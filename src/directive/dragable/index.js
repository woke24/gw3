/**
* 支持父级，自定义父级，以及window作为父级
* 使用示例：
* 1. v-dragable
* 2. v-dragable="'father'" // 使用父级作为父级
* 3. v-dragable="'body'" // 使用body对象作为父级
* 4. v-dragable="'#app'" // 使用id作为父级
* 5. v-dragable="'.list'" // 使用class名作为父级
* 3-5代表所有可被document.querySelector()解析的参数值
**/
const directive = {
  mounted: (el, binding) => {
    setParentDom(el, binding, false)
    // 子级元素位置处理
    // 1. 获取父子元素当前位置
    let parentDomRect
    let elDomRect
    let mouseData = {
      down: { x: 0, y: 0 },
      move: { x: 0, y: 0 }
    }
    let mouseDown = false
    // 从DOM当前位置读取，避免Vue重新渲染时重置为0
    const currentRect = el.getBoundingClientRect()
    const parentRect = el.__parentDom__.getBoundingClientRect()
    el.__position__ = {
      x: currentRect.left - parentRect.left,
      y: currentRect.top - parentRect.top
    }
    let bodyUserSelect = 'text'

    function handleMouseDown(e) {
      if (e.button !== 0) {
        return
      }
      mouseData.down = {
        x: e.clientX,
        y: e.clientY
      }
      mouseDown = true
      parentDomRect = el.__parentDom__.getBoundingClientRect()
      elDomRect = el.getBoundingClientRect()
      bodyUserSelect = document.querySelector('body').style.userSelect
      document.querySelector('body').style.userSelect = "none"
    }
    function handleMouseMove(e) {
      if (!mouseDown) {
        return
      }
      mouseData.move = {
        x: e.clientX,
        y: e.clientY
      }
      setPosition()
    }
    function handleMouseUp(e) {
      if (mouseDown) {
        mouseDown = false
        document.querySelector('body').style.userSelect = bodyUserSelect
      }
    }
    // 用于设置el元素的Position位置
    function setPosition() {
      // 通过几何图形计算更佳，我就是通过几何画图计算出来的当前数据，使用者可以自行计算，得到这两个值
      const x = mouseData.move.x + elDomRect.x - parentDomRect.x - mouseData.down.x
      const y = mouseData.move.y + elDomRect.y - parentDomRect.y - mouseData.down.y
      // 边界处理：允许超出20px
      const overflow = 20
      el.__position__.x = Math.max(-overflow, Math.min(x, parentDomRect.width - elDomRect.width + overflow))
      el.__position__.y = Math.max(-overflow, Math.min(y, parentDomRect.height - elDomRect.height + overflow))
      // 渲染到真实dom属性上
      el.style.position = 'absolute'
      el.style.zIndex = 100
      el.style.left = el.__position__.x + 'px'
      el.style.top = el.__position__.y + 'px'
    }
    el.__mouseDown__ = handleMouseDown
    el.__mouseMove__ = handleMouseMove
    el.__mouseUp__ = handleMouseUp
    // 2. 监听拖拽事件
    el.addEventListener('mousedown', el.__mouseDown__)
    document.addEventListener('mousemove', el.__mouseMove__)
    document.addEventListener('mouseup', el.__mouseUp__)
  },
  // updated(el, binding) {
  //     setParentDom(el, binding)
  // },
  beforeUnmount(el) {
    // 避免重复开销，卸载所有的监听
    // 解决问题：多次创建新的实例 =》 监听不取消 =》 同时存在多个无用的监听，导致页面性能变差
    document.removeEventListener('mousedown', el.__mouseDown__)
    document.removeEventListener('mousemove', el.__mouseMove__)
    document.removeEventListener('mouseup', el.__mouseUp__)
  }
}
// 设置parentDom，供mounted和update使用
function setParentDom(el, binding) {

  const array = [
    { name: 'father', dom: el.parentElement }
  ]

  // 获取父级元素
  let parentDom
  // 以下if操作用于确保一定有一个parentDom
  if (binding.value) {
    const findArr = array.find((arr) => {
      return arr.name === binding.value
    })
    if (findArr && findArr.dom) {
      parentDom = findArr.dom
    } else {
      parentDom = document.querySelector(binding.value) || array[0].dom || array[1].dom
    }
  } else {
    parentDom = array[0].dom || array[1].dom
  }
  // 把以前的样式重置一下
  if (el.__parentDom__) {
    el.__parentDom__.style.position = 'static'
  }
  el.__parentDom__ = parentDom
  el.__bindingValue__ = binding.value
  el.__parentDom__.style.position = 'relative'
}
export default directive