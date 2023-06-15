import { App } from 'vue'
class AutoScroll {
  element: HTMLElement
  timer: NodeJS.Timer | null
  scrolling: boolean
  step: number
  constructor(element: HTMLElement, step: number) {
    this.element = element
    this.timer = null
    this.scrolling = true
    this.step = step
  }
  startScroll() {
    const { element, step } = this
    console.log('scrolling',this.scrolling)
    this.timer = setInterval(() => {
      if (element.scrollHeight - element.scrollTop - element.clientHeight < 1) {
        element.scrollTop = 0
      } else if (this.scrolling){ 
        element.scrollTop += 1
      }
    }, step)
  }

  openScroll() {
    this.scrolling = true
  }

  closeScroll() {
    this.scrolling = false
  }

  clearScroll() {
    this.timer && clearInterval(this.timer)
  }
}
export default function autoscrollDirective(app: App) {
  app.directive('autoscroll', {
    mounted(el: HTMLElement, binding) {
      const { modifiers } = binding
      const step = 1000 / binding.value
      let element: any

      if (modifiers.parent) {
        element = el.parentElement
      }
      element = el
      const autoScroll = new AutoScroll(element, step)
      autoScroll.startScroll()
      element.mouseenter = autoScroll.closeScroll.bind(autoScroll)
      element.mouseleave = autoScroll.openScroll.bind(autoScroll)
      element.clearScroll = autoScroll.clearScroll.bind(autoScroll)
      element.addEventListener('mouseenter', element.mouseenter)
      element.addEventListener('mouseleave', element.mouseleave)
    },
    unmounted(el) {
      el.removeEventListener('mouseenter', el.mouseenter)
      el.removeEventListener('mouseleave', el.mouseleave)
      el.clearScroll()
    }
  })
}
