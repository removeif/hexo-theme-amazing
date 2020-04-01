// 参考自 主题https://github.com/fi3ework/hexo-theme-archer
let prevHeight = 0
function initTocLinksScrollTop(tocLinks) {
  return [...tocLinks].map(link => {
    return getAbsPosition(link).y
  })
}

let calcAnchorLink = (heights, currHeight) => {
  for (let i = 0; i < heights.length; i++) {
    if (Math.abs(currHeight - heights[i]) < 1.1) {
      return i
    }
  }
  return -1
}

let isPassingThrough = (currHeight, prevHeight, linkHeight) => {
  return (currHeight + 1 - linkHeight) * (prevHeight + 1 - linkHeight) <= 0
}

function calcScrollIntoScreenIndex(heights, prevHeight, currHeight) {
  let anchorLinkIndex = calcAnchorLink(heights, currHeight)
  if (anchorLinkIndex >= 0) {
    return anchorLinkIndex
  }

  for (let i = 0; i < heights.length; i++) {
    if (isPassingThrough(currHeight, prevHeight, heights[i])) {
      // if is scrolling down, select current
      if (currHeight > prevHeight) {
        return i
      } else {
        // if is scrolling up, select previous
        return i - 1
      }
    }
  }
}

// hide all ol
function hideAllOl(root) {
  ;[...root.querySelectorAll('ul')].forEach(li => {
    hideItem(li)
  })
}

function showOrHidden(tocs, cur) {
  var i = 0;
  tocs.forEach(ul => {
    if (i > 0) {
      if (ul.innerText.indexOf(cur.innerText) > -1) {
        showItem(ul);
      } else {
        hideItem(ul);
      }
    }
    i++;
  })
}

// back to default state
function initFold(toc) {
  ;[...toc.children].forEach(child => {
    hideAllOl(child)
  })
    ;[...toc.querySelectorAll('.is-current')].forEach(child => {
      child.classList.remove('is-current')
    })
}

function resetFold(toc) {
  initFold(toc)
}

function hideItem(node) {
  node.style.display = 'none'
}

function showItem(node) {
  node.style.display = ''
}

function getAbsPosition(e) {
  let x = e.offsetLeft,
    y = e.offsetTop
  while ((e = e.offsetParent)) {
    x += e.offsetLeft
    y += e.offsetTop
  }
  return {
    x: x,
    y: y
  }
}

function loadToc() {
  let toc = document.querySelector('.toc')
  let tocs = document.querySelectorAll('.toc')
  let tocItems = document.querySelectorAll('.toc-item')
  if (!tocItems.length || toc == null) {
    return
  }
  initFold(toc)
  let headers = document.querySelectorAll(
    '.article-entry h1, h2, h3, h4, h5, h6'
  )
  // get links height
  let heights = initTocLinksScrollTop(headers)
  document.addEventListener('scroll', () => {
    let currHeight = $(document).scrollTop()
    let currHeightIndex = calcScrollIntoScreenIndex(
      heights,
      prevHeight,
      currHeight
    )
    prevHeight = currHeight
    if (typeof currHeightIndex === 'undefined') {
      return
    }
    let currItem = tocItems[currHeightIndex]
    if (currItem) {
      // show or hidden toc
      showOrHidden(tocs, currItem);
    }
  })
}