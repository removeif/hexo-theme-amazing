/**
 * Configuration and validation.
 * @module core/schema
 */
const Ajv = require('ajv');
const path = require('path');
const yaml = require('../util/yaml');

/**
 * A magic string for reformating comment lines in the YAML output.
 */
const MAGIC = 'c823d4d4';

/**
 * Default value for the primitive types.
 * @access private
 */
const PRIMITIVE_DEFAULTS = {
    'null': null,
    'boolean': false,
    'number': 0,
    'integer': 0,
    'string': '',
    'array': [],
    'object': {}
};

const typeOf = value => {
    return value === undefined
        ? 'undefined'
        : Object.prototype.toString.call(value)
            .replace(/^\[object\s+([a-z]+)\]$/i, '$1')
            .toLowerCase();
};

const hasOwnProperty = (obj, prop) => {
    return obj === null || typeOf(obj) === 'undefined'
        ? false
        : Object.prototype.hasOwnProperty.call(obj, prop);
};

function traverseObj(obj, targetKey, handler) {
    if (typeOf(obj) === 'array') {
        for (const child of obj) {
            traverseObj(child, targetKey, handler);
        }
    } else if (typeOf(obj) === 'object') {
        for (const key in obj) {
            if (key === targetKey) {
                handler(obj[key]);
            } else {
                traverseObj(obj[key], targetKey, handler);
            }
        }
    }
}

/**
 * The default value wrapper class.
 */
class DefaultValue {

    /**
     * @param {any} value The wrapped default value.
     * @param {string} description A description of the contained value. Used to produce
     * the comment string.
     */
    constructor(value, description) {
        this.value = value;
        this.description = description;
    }

    /**
     * Duplicate the current default value.
     * <p>
     * Wrapped value will be shallow copied.
     *
     * @returns {module:core/schema~DefaultValue} A new instance of the current default value.
     */
    clone() {
        const result = new DefaultValue(this.value, this.description);
        if (result.value instanceof DefaultValue) {
            result.value = result.value.clone();
        } else if (typeOf(result.value) === 'array') {
            result.value = [].concat(result.value);
        } else if (typeOf(result.value) === 'object') {
            result.value = Object.assign({}, result.value);
        }
        return result;
    }

    /**
     * Unwrap current {module:core/schema~DefaultValue} if its wrapped value is also a
     * {module:core/schema~DefaultValue}.
     * <p>
     * The description will also be replaced with wrapped value description, if exists.
     */
    flatten() {
        if (this.value instanceof DefaultValue) {
            this.value.flatten();
            if (hasOwnProperty(this.value, 'description') && this.value.description) {
                this.description = this.value.description;
            }
            this.value = this.value.value;
        }
    }

    /**
     * Merge current default value with another default value.
     *
     * @param {module:core/schema~DefaultValue} source The input object to be merged with. Should have the
     * same wrapped value type as current wrapped default value.
     */
    merge(source) {
        if (hasOwnProperty(source, 'value') && source.value !== null) {
            this.flatten();
            if (source.value instanceof DefaultValue) {
                source = source.clone();
                source.flatten();
            }
            if (typeOf(source.value) === typeOf(this.value)) {
                if (typeOf(this.value) === 'array') {
                    this.value = this.value.concat(source.value);
                } else if (typeOf(this.value) === 'object') {
                    Object.keys(source.value).forEach(key => { this.value[key] = source.value[key]; });
                } else {
                    this.value = source.value;
                }
            } else if (typeOf(this.value) === 'undefined' || typeOf(this.value) === 'null') {
                this.value = source.value;
            }
        }
        if (hasOwnProperty(source, 'description') && source.description) {
            this.description = source.description;
        }
    }

    /**
     * Create a new array with comments inserted as new elements right before each child element.
     * <p>
     * If current wrapped value is an array and some of its elements are instances of
     * {@link module:core/schema~DefaultValue}, the element's description will be inserted as a new child
     * right before the element.
     * The element itself will also be converted into its commented version using the <code>toCommented</code>
     * method.
     *
     * @returns {Array} A new array with comments and the original elements in the commented form.
     */
    toCommentedArray() {
        return [].concat(...this.value.map(item => {
            if (item instanceof DefaultValue) {
                if (typeOf(item.description) !== 'string' || !item.description.trim()) {
                    return [item.toCommented()];
                }
                return item.description.split('\n').map((line, i) => {
                    return MAGIC + i + ': ' + line;
                }).concat(item.toCommented());
            } else if (typeOf(item) === 'array' || typeOf(item) === 'object') {
                return new DefaultValue(item).toCommented();
            }
            return [item];
        }));
    }

    /**
     * Create a new object with comments inserted as new properties right before every original properties.
     * <p>
     * Works similar to {@link module:core/schema~DefaultValue#toCommentedArray}.
     *
     * @returns {Object} A new object with comments and the original property values in the commented form.
     */
    toCommentedObject() {
        if (this.value instanceof DefaultValue) {
            return this.value.toCommented();
        }
        const result = {};
        for (const key in this.value) {
            const item = this.value[key];
            if (item instanceof DefaultValue) {
                if (typeOf(item.description) === 'string' && item.description.trim()) {
                    item.description.split('\n').forEach((line, i) => {
                        result[MAGIC + key + i] = line;
                    });
                }
                result[key] = item.toCommented();
            } else if (typeOf(item) === 'array' || typeOf(item) === 'object') {
                result[key] = new DefaultValue(item).toCommented();
            } else {
                result[key] = item;
            }
        }
        return result;
    }

    /**
     * Call {@link module:core/schema~DefaultValue#toCommentedArray} or
     * {@link module:core/schema~DefaultValue#toCommentedObject} based on the type of the wrapped value.
     * <p>
     * If neither applies, directly return the wrapped value.
     *
     * @returns {any} The commented object/array, or the original wrapped value.
     */
    toCommented() {
        if (typeOf(this.value) === 'array') {
            return this.toCommentedArray();
        } else if (typeOf(this.value) === 'object') {
            return this.toCommentedObject();
        }
        return this.value;
    }

    /**
     * Create the YAML string with all the comments from current default value.
     *
     * @returns {string} The formatted YAML string.
     */
    toYaml() {
        const regex = new RegExp('^(\\s*)(?:-\\s*\\\')?' + MAGIC + '.*?:\\s*\\\'?(.*?)\\\'*$', 'mg');
        return yaml.stringify(this.toCommented()).replace(regex, '$1# $2');// restore comments
    }
}

/* eslint-disable no-use-before-define */
/**
 * A class that can resolving referenced JSON schemas and create {@link module:core/schema~DefaultValue}s.
 */
class Schema {

    /**
     * @param {module:core/schema~SchemaLoader} loader JSON schema loader.
     * @param {Object} def The JSON schema definition.
     */
    constructor(loader, def) {
        if (!(loader instanceof SchemaLoader)) {
            throw new Error('loader must be an instance of SchemaLoader');
        }
        if (typeOf(def) !== 'object') {
            throw new Error('schema definition must be an object');
        }
        this.loader = loader;
        this.def = def;
        this.compiledSchema = null;
    }

    /**
     * Validate an object against the JSON schema.
     *
     * @param {any} obj Object to be validated.
     * @returns {boolean|Object} True if Object is valid, or validation errors.
     */
    validate(obj) {
        if (!this.compiledSchema) {
            this.compiledSchema = this.loader.compileValidator(this.def.$id);
        }
        return this.compiledSchema(obj) ? true : this.compiledSchema.errors;
    }

    /**
     * Create the {@link module:core/schema~DefaultValue} for an array-typed JSON schema.
     * <p>
     * Each possible type of the array elements defined in <code>oneOf</code> will be processed and a
     * {@link module:core/schema~DefaultValue} will be added to the result array.
     *
     * @param {Object} def JSON schema definition of the array.
     * @returns {@link module:core/schema~DefaultValue} The {@link module:core/schema~DefaultValue} for the
     * array definition.
     */
    getArrayDefaultValue(def) {
        const defaultValue = new DefaultValue(null, def.description);
        // all array elements have the same type, return the default value for that type
        if (typeOf(def.items) === 'object') {
            const items = Object.assign({}, def.items);
            delete items.oneOf;
            let value = this.getDefaultValue(items);
            // additionally, if each array element can be in one of the provided types in <code>oneOf</code>
            if (typeOf(def.items.oneOf) === 'array') {
                // for each <code>oneOf</code> element, return a {@link module:core/schema~DefaultValue}
                defaultValue.value = def.items.oneOf.map(one => {
                    // if the <code>items</code> definition also exists, merge it with the <code>oneOf</code>
                    // {@link module:core/schema~DefaultValue}
                    const clone = value.clone();
                    clone.merge(this.getDefaultValue(one));
                    return clone;
                });
            } else {
                if (typeOf(value) !== 'array') {
                    value = [value];
                }
                defaultValue.value = value;
            }
        }
        return defaultValue;
    }

    /**
     * Create the {@link module:core/schema~DefaultValue} for an object-typed JSON schema.
     * <p>
     * The first possible type of the object element defined in <code>oneOf</code> will be processed and its
     * {@link module:core/schema~DefaultValue} will be merged with the {@link module:core/schema~DefaultValue}
     * created from the <code>properties</code> definition.
     *
     * @param {Object} def JSON schema definition of the object.
     * @returns {@link module:core/schema~DefaultValue} The {@link module:core/schema~DefaultValue} for the
     * object definition.
     */
    getObjectDefaultValue(def) {
        const value = {};
        if (typeOf(def.properties) === 'object') {
            for (const property in def.properties) {
                value[property] = this.getDefaultValue(def.properties[property]);
            }
        }
        const defaultValue = new DefaultValue(value, def.description);
        // only the first one of the possible types will be merged with {@link module:core/schema~DefaultValue}
        // for the <code>properties</code> definition.
        if (typeOf(def.oneOf) === 'array' && def.oneOf.length) {
            defaultValue.merge(this.getDefaultValue(def.oneOf[0]));
            defaultValue.description = def.description;
        }
        return defaultValue;
    }

    /**
     * Create the {@link module:core/schema~DefaultValue} for any typed JSON schema that is not purely defined
     * by its <code>$ref</code>.
     * <p>
     * If the definition also contains a <code>$ref</code>, the {@link module:core/schema~DefaultValue} for the
     * <code>$ref</code> definition will be merged to the {@link module:core/schema~DefaultValue} of the current
     * definition.
     * <p>
     * If <code>type</code> of the JSON schema is of primitive types, and the <code>nullable</code> is set to
     * <code>false</code> in the schema definition, primitive default values will be set insided the result
     * {@link module:core/schema~DefaultValue}.
     *
     * @param {Object} def JSON schema definition.
     * @returns {@link module:core/schema~DefaultValue} The {@link module:core/schema~DefaultValue} for the
     * definition.
     * @throws {Error} If <code>type</code> is undefined or it is 'array', 'object', or primitive types.
     */
    getTypedDefaultValue(def) {
        let defaultValue;
        const type = typeOf(def.type) === 'array' ? def.type[0] : def.type;
        if (type === 'array') {
            defaultValue = this.getArrayDefaultValue(def);
        } else if (type === 'object') {
            defaultValue = this.getObjectDefaultValue(def);
        } else if (hasOwnProperty(PRIMITIVE_DEFAULTS, type)) {
            if (hasOwnProperty(def, 'nullable') && def.nullable) {
                defaultValue = new DefaultValue(null, def.description);
            } else {
                defaultValue = new DefaultValue(PRIMITIVE_DEFAULTS[type], def.description);
            }
        } else {
            throw new Error(`Cannot get default value for type ${type}`);
        }
        // referred default value always get overwritten by its parent default value
        if (hasOwnProperty(def, '$ref') && def.$ref) {
            const refDefaultValue = this.getReferredDefaultValue(def);
            refDefaultValue.merge(defaultValue);
            defaultValue = refDefaultValue;
        }
        return defaultValue;
    }

    /**
     * Create the {@link module:core/schema~DefaultValue} for any JSON schema that is purely defined by its
     * <code>$ref</code>.
     *
     * @param {Object} def JSON schema definition.
     * @returns {@link module:core/schema~DefaultValue} The {@link module:core/schema~DefaultValue} for the
     * definition.
     */
    getReferredDefaultValue(def) {
        const schema = this.loader.getSchema(def.$ref);
        if (!schema) {
            throw new Error(`Schema ${def.$ref} is not loaded`);
        }
        const defaultValue = this.getDefaultValue(schema.def);
        defaultValue.merge({ description: def.description });
        return defaultValue;
    }

    /**
     * Create the {@link module:core/schema~DefaultValue} for any JSON schema.
     *
     * @param {Object} def JSON schema definition.
     * @returns {@link module:core/schema~DefaultValue} The {@link module:core/schema~DefaultValue} for the
     * definition.
     */
    getDefaultValue(def = null) {
        if (!def) {
            def = this.def;
        }
        if (hasOwnProperty(def, 'const')) {
            return new DefaultValue(def.const, def.description);
        }
        if (hasOwnProperty(def, 'default')) {
            return new DefaultValue(def.default, def.description);
        }
        if (hasOwnProperty(def, 'examples') && typeOf(def.examples) === 'array' && def.examples.length) {
            return new DefaultValue(def.examples[0], def.description);
        }
        if (hasOwnProperty(def, 'type') && def.type) {
            return this.getTypedDefaultValue(def);
        }
        // $ref only schemas
        if (hasOwnProperty(def, '$ref') && def.$ref) {
            return this.getReferredDefaultValue(def);
        }
        throw new Error('The following schema definition must have at least one of the '
            + '["const", "default", "examples", "type", "$ref"] fields:\n'
            + JSON.stringify(def, null, 2));
    }
}

/**
 * Class for loading JSON schema files from filesystems and creating validator.
 */
class SchemaLoader {
    constructor() {
        this.schemas = {};
        this.ajv = new Ajv({ nullable: true });
    }

    /**
     * Get JSON schema definition by its <code>$id</code>.
     *
     * @param {string} $id JSON schema <code>$id</code>.
     * @returns {Object} JSON schema definition.
     */
    getSchema($id) {
        return this.schemas[$id];
    }

    /**
     * Add a JSON schema definition to the collection.
     *
     * @param {Object} JSON schema definition.
     * @throws {Error} If JSON schema definition does not have an <code>$id</code>.
     */
    addSchema(def) {
        if (!hasOwnProperty(def, '$id')) {
            throw new Error('The schema definition does not have an $id field');
        }
        this.ajv.addSchema(def);
        this.schemas[def.$id] = new Schema(this, def);
    }

    /**
     * Remove a JSON schema definition to the collection.
     *
     * @param {string} $id JSON schema <code>$id</code>.
     */
    removeSchema($id) {
        this.ajv.removeSchema($id);
        delete this.schemas[$id];
    }

    /**
     * Create a JSON schema validation function for a given schema identified by its <code>$id</code>.
     *
     * @param {*} $id $id JSON schema <code>$id</code>.
     * @returns {Function} JSON schema validation function.
     */
    compileValidator($id) {
        return this.ajv.compile(this.getSchema($id).def);
    }
}

/**
 * Create a {@link module:core/schema~SchemaLoader} and load all referred JSON schema from the resolve
 * directories.
 *
 * @param {Object} rootSchemaDef The root JSON schema definition.
 * @param {Array} resolveDirs Additional directories for resolving referred JSON schemas besides the
 * <code>lib/schema</code> folder in this library. Directory order matters.
 * @returns {@link module:core/schema~SchemaLoader} The schema loader with all referred schemas loaded.
 * @throws {Error} Referred schema not found in any of the resolve directories.
 */
SchemaLoader.load = (rootSchemaDef, resolveDirs = []) => {
    if (typeOf(resolveDirs) !== 'array') {
        resolveDirs = [resolveDirs];
    }
    resolveDirs.push(path.join(__dirname, '../schema/'));

    const loader = new SchemaLoader();
    loader.addSchema(rootSchemaDef);

    function handler($ref) {
        if (loader.getSchema($ref)) {
            return;
        }
        for (const dir of resolveDirs) {
            let def;
            try {
                def = require(path.join(dir, $ref));
            } catch (e) {
                continue;
            }
            if (typeOf(def) !== 'object' || def.$id !== $ref) {
                continue;
            }
            loader.addSchema(def);
            traverseObj(def, '$ref', handler);
            return;
        }
        throw new Error('Cannot find schema definition ' + $ref + '.\n'
            + 'Please check if the file exists and its $id is correct');
    }

    traverseObj(rootSchemaDef, '$ref', handler);
    return loader;
};

module.exports = {
    MAGIC,
    Schema,
    SchemaLoader,
    DefaultValue
};