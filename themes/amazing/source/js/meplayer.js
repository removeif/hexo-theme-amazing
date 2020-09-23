/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _constants = __webpack_require__(1);

	var _lyric = __webpack_require__(2);

	var lyric = _interopRequireWildcard(_lyric);

	var _utils = __webpack_require__(3);

	var utils = _interopRequireWildcard(_utils);

	var _spectrum = __webpack_require__(4);

	var spectrum = _interopRequireWildcard(_spectrum);

	var _selector = __webpack_require__(5);

	var selector = _interopRequireWildcard(_selector);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var root = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) == 'object' && window.window === window ? window : (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global.global === global ? global : undefined;

	root.mePlayer = function (options,endcallback) {
	  // 检查必填选项
	  if (!(options.music && options.music.src)) {
	    console.error('必须指定音乐地址哦~');
	    return;
	  }

	  var musicConf = options.music,
	      target = selector.$(options.target) || document.querySelector('.meplayer'),
	      theme = options.theme || _constants.THEME_DEFAULT,
	      hasLrc = musicConf.lrc ? true : false,
	      coverSrc = musicConf.cover || 'https://unsplash.it/78/?random',
	      loop = musicConf.loop || false,
	      autoplay = options.autoplay,
	      currentThemeClass = theme === _constants.THEME_DEFAULT ? 'meplayer-container' : 'meplayer-container-mini',
	      containerClass = currentThemeClass + ' ' + (hasLrc ? 'meplayer-haslrc' : '') + ' meplayer-isloading',
	      playerHTMLContent = '<div class="' + containerClass + '">\n                             <audio src=' + musicConf.src + ' preload="auto"></audio>\n                             <div class="meplayer-info">\n                             <div class="meplayer-info-cover"><img src=' + coverSrc + ' alt=""></div>\n                             <div class="meplayer-meta">\n                             <div class="meplayer-meta-title">' + musicConf.title + '</div>\n                             <div class="meplayer-meta-author">' + musicConf.author + '</div>\n                             <div class="meplayer-meta-time-tick"><span class="meplayer-meta-time-tick-text"></span></div>\n                             </div>\n                             </div>\n                             <canvas class="meplayer-spectrum"></canvas>\n                             <div class="meplayer-lyric"><div class="meplayer-lyric-area"></div></div>\n                             <div class="meplayer-control"><div class="meplayer-control-play"><i class="icon-play"></i><i class="icon-pause"></i></div></div>\n                             <div class="meplayer-volume-bg"><div class="meplayer-volume"><i class="icon-volume"></i><div class="meplayer-volume-progress"></div></div></div>\n                             <div class="meplayer-duration"><i class="icon-clock"></i><span class="meplayer-duration-text">loading</span></div>\n                             <div class="meplayer-loadingsign"><i class="icon-spin animate-spin"></i>loading</div>\n                             <div class="meplayer-timeline-bg"><div class="meplayer-timeline"><div class="meplayer-timeline-passed"></div></div></div>\n                             </div>';

	  target.innerHTML = playerHTMLContent;

	  var meplayerContainer = target.querySelector('.' + currentThemeClass),
	      _selector$init$select = selector.init(meplayerContainer).select(['audio', '.meplayer-control-play', '.meplayer-meta-time-tick-text', '.meplayer-duration', '.meplayer-timeline', '.meplayer-timeline-passed', '.meplayer-volume', '.meplayer-volume-progress', '.meplayer-lyric-area', '.meplayer-spectrum']),
	      _selector$init$select2 = _slicedToArray(_selector$init$select, 10),
	      audio = _selector$init$select2[0],
	      playBtn = _selector$init$select2[1],
	      timeTick = _selector$init$select2[2],
	      timeCount = _selector$init$select2[3],
	      timeLine = _selector$init$select2[4],
	      timePassed = _selector$init$select2[5],
	      volumeArea = _selector$init$select2[6],
	      volumeProgress = _selector$init$select2[7],
	      lyricArea = _selector$init$select2[8],
	      canvas = _selector$init$select2[9],
	      duration;


	  if (hasLrc) {
	    lyric.parse(musicConf.lrc).renderTo(lyricArea);
	  } else {
	    // 频谱动画初始化
	    spectrum.init(canvas);
	  }

	  eventInit();

	  if (autoplay) {
	    handlePlayClick();
	  }

	  // 重定义meplayer
	  root.mePlayerMethod = {
	    play: play,
	    pause: pause,
	    toggleTheme: toggleTheme

	    // 给播放器绑定各种事件
	  };function eventInit() {
	    audio.addEventListener('ended', handleAudioEnd);
	    audio.addEventListener('canplaythrough', handleCanPlayThrough);
	    audio.addEventListener('durationchange', handleDurationChange);
	    audio.addEventListener('timeupdate', handleTimeUpdate);
	    playBtn.addEventListener('click', handlePlayClick);
	    timeLine.addEventListener('click', handleTimeLineClick);
	  }

	  function handleAudioEnd() {
	    if (loop) {
	      audio.play();
	    } else {
	      utils.removeClass(meplayerContainer, 'meplayer-isplaying');
	      endcallback();
	    }
	  }

	  function handleCanPlayThrough() {
	    duration = this.duration;
	    setTimeout(function () {
	      utils.removeClass(meplayerContainer, 'meplayer-isloading');
	      timeCount.querySelector('.meplayer-duration-text').innerText = utils.parseSec(duration.toFixed(0));
	    }, 1000);
	  }

	  function handleDurationChange() {
	    duration = this.duration;
	  }

	  function handleTimeUpdate() {
	    var curTime = audio.currentTime;
	    var curTimeForLrc = audio.currentTime.toFixed(3);
	    var playPercent = 100 * (curTime / duration);

	    timePassed.style.width = playPercent.toFixed(2) + '%';
	    timeTick.innerText = utils.parseSec(curTime);

	    if (hasLrc && theme === _constants.THEME_DEFAULT) {
	      var tempLrcIndex = lyric.currentIndex(curTimeForLrc);
	      var tempLrcLines = lyricArea.querySelectorAll('p');
	      var tempLrcLinePre = tempLrcLines[tempLrcIndex - 1];
	      var tempLrcLine = tempLrcLines[tempLrcIndex];
	      var tempLrcLineNext = tempLrcLines[tempLrcIndex + 1];

	      if (!tempLrcLine.className.includes('meplayer-lyric-current')) {
	        utils.removeClass(lyricArea.querySelector('.meplayer-lyric-current'), 'meplayer-lyric-current');
	        if (lyricArea.querySelector('.meplayer-lyric-pre')) {
	          utils.removeClass(lyricArea.querySelector('.meplayer-lyric-pre'), 'meplayer-lyric-pre');
	        }
	        if (lyricArea.querySelector('.meplayer-lyric-next')) {
	          utils.removeClass(lyricArea.querySelector('.meplayer-lyric-next'), 'meplayer-lyric-next');
	        }
	        utils.addClass(tempLrcLine, 'meplayer-lyric-current');
	        if (tempLrcLinePre) {
	          utils.addClass(tempLrcLinePre, 'meplayer-lyric-pre');
	        }
	        if (tempLrcLineNext) {
	          utils.addClass(tempLrcLineNext, 'meplayer-lyric-next');
	        }

	        lyricArea.style.webkitTransform = 'translateY(-' + 20 * tempLrcIndex + 'px)';
	        lyricArea.style.transform = 'translateY(-' + 20 * tempLrcIndex + 'px)';
	      }
	    }
	  }

	  function handlePlayClick() {
	    var _handleMouseWheel;

	    if (audio.paused) {
	      audio.play();
	      if (theme === _constants.THEME_DEFAULT && !hasLrc) {
	        spectrum.draw();
	      }
	      // 播放状态中可以用滑轮调节音量
	      meplayerContainer.addEventListener('mousewheel', function handleMouseWheel() {
	        var timer = null;
	        var step = 0.05;
	        _handleMouseWheel = function _handleMouseWheel(event) {
	          if (timer) {
	            clearTimeout(timer);
	          }
	          if (!meplayerContainer.className.includes('meplayer-adjusting-volume')) {
	            utils.addClass(meplayerContainer, 'meplayer-adjusting-volume');
	          }
	          if (event.wheelDeltaY < 0 && audio.volume > step) {
	            audio.volume -= step;
	          }
	          if (event.wheelDeltaY > 0 && audio.volume < 1 - step) {
	            audio.volume += step;
	          }
	          if (theme === _constants.THEME_DEFAULT) {
	            volumeProgress.style.width = audio.volume * 100 + '%';
	          } else {
	            volumeArea.querySelector('i').style.opacity = audio.volume;
	          }
	          event.preventDefault();

	          timer = setTimeout(function () {
	            utils.removeClass(meplayerContainer, 'meplayer-adjusting-volume');
	          }, 1000);
	        };
	        return _handleMouseWheel;
	      }());
	    } else {
	      audio.pause();
	      spectrum.stop();
	      meplayerContainer.removeEventListener('mousewheel', _handleMouseWheel);
	    }
	    utils.toggleClass(meplayerContainer, 'meplayer-isplaying');
	  }

	  function handleTimeLineClick() {
	    var clickPercent = (event.pageX - utils.getAbsLeft(this)) / this.offsetWidth;
	    timePassed.style.width = clickPercent * 100 + '%';
	    audio.currentTime = (clickPercent * duration).toFixed(0);
	  }

	  function play() {
	    if (audio.paused) {
	      utils.addClass(meplayerContainer, 'meplayer-isplaying');
	      audio.play();
	      	// 浏览器通知
            // $("#p_message").show();
            // if(window.Notification && Notification.permission !== "denied") {
            //     Notification.requestPermission(function(status) {
            //         var n = new Notification(musicConf.title, {body:'开始播放' + musicConf.author + '的' + musicConf.title, icon:musicConf.cover});
            //     });
            // }
	    }
	  }

	  function pause() {
	    if (!audio.paused) {
	      utils.removeClass(meplayerContainer, 'meplayer-isplaying');
	      audio.pause();
	    }
	  }

	  function toggleTheme() {
	    var step = 0.03;
	    var count = 0;
	    var maxCount = 200;

	    utils.addClass(meplayerContainer, 'meplayer-changing-theme');

	    theme = theme === _constants.THEME_DEFAULT ? _constants.THEME_MINI : _constants.THEME_DEFAULT;

	    loop();

	    function loop() {
	      count++;
	      meplayerContainer.style.opacity -= step;
	      if (meplayerContainer.style.opacity <= 0) {
	        step *= -1;
	        meplayerContainer.style.opacity = 0;
	        utils.toggleClass(meplayerContainer, 'meplayer-container-mini');
	        utils.toggleClass(meplayerContainer, 'meplayer-container');
	      }
	      if (meplayerContainer.style.opacity < 1 && count < maxCount) {
	        requestAnimationFrame(loop);
	      } else {
	        setTimeout(function () {
	          utils.removeClass(meplayerContainer, 'meplayer-changing-theme');
	        }, 500);
	      }
	    }
          return theme;
	  }
	};

	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	  module.exports = root.mePlayer;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/*
	 * 全局常量声明
	 */

	var THEME_DEFAULT = 'default';
	var THEME_MINI = 'mini';
	var LYRIC_CURRENT_CLASS = 'meplayer-lyric-current';
	var LYRIC_NEXT_CLASS = 'meplayer-lyric-next';

	exports.THEME_DEFAULT = THEME_DEFAULT;
	exports.THEME_MINI = THEME_MINI;
	exports.LYRIC_CURRENT_CLASS = LYRIC_CURRENT_CLASS;
	exports.LYRIC_NEXT_CLASS = LYRIC_NEXT_CLASS;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.currentIndex = exports.renderTo = exports.parse = undefined;

	var _constants = __webpack_require__(1);

	var lyrics;

	// 歌词解析脚本
	// 修改自：https://github.com/DIYgod/APlayer
	function parse(text) {
	  var lyric = text.split('\n');
	  var lrc = [];
	  var len = lyric.length;
	  var reg1 = /\[(\d{2}):(\d{2})\.(\d{2,3})]/g;
	  var reg2 = /\[(\d{2}):(\d{2})\.(\d{2,3})]/;
	  for (var i = 0; i < len; i++) {
	    var time = lyric[i].match(reg1);
	    var lrcText = lyric[i].replace(reg1, '').replace(/^\s+|\s+$/g, '');
	    // 排除空行
	    if (!lrcText) {
	      continue;
	    }
	    if (time != null) {
	      var timeLen = time.length;
	      for (var j = 0; j < timeLen; j++) {
	        var oneTime = reg2.exec(time[j]);
	        var lrcTime = oneTime[1] * 60 + parseInt(oneTime[2]) + parseInt(oneTime[3]) / ((oneTime[3] + '').length === 2 ? 100 : 1000);
	        lrc.push({
	          time: lrcTime,
	          text: lrcText
	        });
	      }
	    }
	  }
	  lrc.sort(function (a, b) {
	    return a.time - b.time;
	  });

	  lyrics = lrc;
	  return this;
	}

	// 歌词文本解析成DOM结构
	function renderTo(target) {
	  if (!lyrics) {
	    console.error('未指定歌词文本！');
	    return;
	  }
	  var lyricHTML = '';
	  for (var i = 0; i < lyrics.length; i++) {
	    lyricHTML += '<p>' + lyrics[i].text + '</p>';
	  }
	  target.innerHTML = lyricHTML;
	  target.querySelector('p').className = _constants.LYRIC_CURRENT_CLASS;
	  target.querySelector('p + p').className = _constants.LYRIC_NEXT_CLASS;
	  return this;
	}

	function currentIndex(time) {
	  if (time < lyrics[0].time) return 0;
	  for (var i = 0, l = lyrics.length; i < l; i++) {
	    if (time >= lyrics[i].time && (!lyrics[i + 1] || time <= lyrics[i + 1].time)) {
	      break;
	    }
	  }
	  return i;
	}

	exports.parse = parse;
	exports.renderTo = renderTo;
	exports.currentIndex = currentIndex;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function toggleClass(el, className) {
	  if (el.classList) {
	    el.classList.toggle(className);
	  } else {
	    var classes = el.className.split(' ');
	    var existingIndex = classes.indexOf(className);

	    if (existingIndex >= 0) classes.splice(existingIndex, 1);else classes.push(className);

	    el.className = classes.join(' ');
	  }
	}

	function addClass(el, className) {
	  if (el.classList) el.classList.add(className);else el.className += ' ' + className;
	}

	function removeClass(el, className) {
	  if (el.classList) el.classList.remove(className);else el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	}

	function getAbsLeft(el) {
	  var left = el.offsetLeft;
	  while (el.offsetParent) {
	    el = el.offsetParent;
	    left += el.offsetLeft;
	  }
	  return left;
	}

	function parseSec(sec) {
	  var tempMin = sec / 60 | 0;
	  var tempSec = sec % 60 | 0;
	  var curMin = tempMin < 10 ? '0' + tempMin : tempMin;
	  var curSec = tempSec < 10 ? '0' + tempSec : tempSec;
	  return curMin + ':' + curSec;
	}

	exports.toggleClass = toggleClass;
	exports.addClass = addClass;
	exports.removeClass = removeClass;
	exports.getAbsLeft = getAbsLeft;
	exports.parseSec = parseSec;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/*
	 * 频谱动画模拟
	 * */
	var canvas,
	    ctx,
	    specItems = [],
	    needStop = false,
	    timer = null,
	    random = Math.random;

	function randHeight() {
	  if (random() > 0.8) {
	    return random() * 8 + 11;
	  } else {
	    return random() * 6 + 2;
	  }
	}

	var randHeightGenerator = function randHeightGenerator(base) {
	  var max = base * 1.5 > 28 ? 28 : base * 1.5,
	      min = 1,
	      direction = random() > 0.5 ? 1 : -1,
	      tempHeight = base,
	      curStep;
	  return function () {
	    curStep = direction;
	    tempHeight += curStep;
	    if (tempHeight >= max) {
	      direction *= -1;
	      tempHeight = max;
	    } else if (tempHeight <= min) {
	      direction *= -1;
	      tempHeight = min;
	    }
	    if (random() > 0.9) {
	      direction *= -1;
	    }
	    return tempHeight;
	  };
	};

	function loop() {
	  ctx.clearRect(0, -canvas.height / 2, canvas.width, canvas.height);
	  for (var i = 0; i < specItems.length; i++) {
	    var item = specItems[i];
	    var height = item.getHeight();
	    ctx.fillRect(i + specItems[i].xSpace, -height / 2, specItems[i].width, height);
	  }

	  if (!needStop) {
	    timer = requestAnimationFrame(loop);
	  }
	}

	function init(canvasElem) {
	  var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 220;
	  var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 30;
	  var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '#D94240';

	  canvas = canvasElem;
	  canvas.width = width;
	  canvas.height = height;
	  ctx = canvas.getContext('2d');
	  ctx.fillStyle = color;
	  ctx.translate(0, height / 2);

	  for (var i = 0; i < 64; i++) {
	    var xSpace = i == 0 ? 0 : 5 * i;
	    var tempItem = {
	      xSpace: xSpace,
	      width: 1,
	      getHeight: randHeightGenerator(randHeight())
	    };
	    specItems.push(tempItem);
	  }
	}

	function draw() {
	  needStop = false;
	  loop();
	}

	function stop() {
	  needStop = true;
	}

	exports.init = init;
	exports.draw = draw;
	exports.stop = stop;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * 元素选择器辅助工具模块
	 * init  : 设定容器
	 * select: 传入选择器则返回元素，传入选择器数组则返回对应的元素数组
	 * $     : 辅助功能，使得无论传入选择器字符串还是元素本身，都能返回正确的元素
	 */

	var container;

	function init(element) {
	  container = $(element);
	  return this;
	}

	function select(element) {
	  var result;
	  if (Array.isArray(element)) {
	    var tempResults = [];
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	      for (var _iterator = element[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	        var value = _step.value;

	        tempResults.push($(value, container));
	      }
	    } catch (err) {
	      _didIteratorError = true;
	      _iteratorError = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion && _iterator.return) {
	          _iterator.return();
	        }
	      } finally {
	        if (_didIteratorError) {
	          throw _iteratorError;
	        }
	      }
	    }

	    result = tempResults;
	  } else {
	    result = $(element, container);
	  }
	  return result;
	}

	function $(element, context) {
	  var result;
	  context = context || document;
	  if (typeof element === 'string') {
	    result = context.querySelector(element);
	  } else if (element.toString().includes('HTMLDivElement')) {
	    result = element;
	  }

	  return result;
	}

	exports.init = init;
	exports.select = select;
	exports.$ = $;

/***/ })
/******/ ]);