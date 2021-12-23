let bindTouchEvents = (dom)=>{
  const element = document.getElementsByClassName(
    dom
  )[0]
  if (element) {
    element.addEventListener(
      'touchstart',
      event => {
        event.preventDefault()
        this.touchX = event.changedTouches[0].clientX
        this.touchY = event.changedTouches[0].clientY
      },
      true
    )
    element.addEventListener(
      'touchmove',
      event => {
        event.preventDefault()

        // 计算手指偏移量
        const offsetX = event.changedTouches[0].clientX - this.touchX
        const offsetY = event.changedTouches[0].clientY - this.touchY

        element.scrollLeft = element.scrollLeft - offsetX
        element.scrollTop = element.scrollTop - offsetY

        this.touchX = event.changedTouches[0].clientX
        this.touchY = event.changedTouches[0].clientY
      },
      true
    )
    element.addEventListener(
      'touchend',
      event => {
        event.preventDefault()

        this.touchX = event.changedTouches[0].clientX
        this.touchY = event.changedTouches[0].clientY
      },
      true
    )
  } else {
    console.warn('未获取到表格元素')
  }
}