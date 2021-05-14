import has from './has'
import clipboard from './clipboard'

const directives = {
  has,
  clipboard,
}

export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key])
    })
  },
}