import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faFileCirclePlus, faFolderOpen,
  faRotateLeft, faRotateRight,
  faMagnifyingGlassMinus, faExpand, faMagnifyingGlassPlus,
  faDownload, faShareNodes, faCheck, faCircleInfo, faXmark,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'

import App from './App.vue'

import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import './styles/global.css'

library.add(
  faFileCirclePlus, faFolderOpen,
  faRotateLeft, faRotateRight,
  faMagnifyingGlassMinus, faExpand, faMagnifyingGlassPlus,
  faDownload, faShareNodes, faCheck, faCircleInfo, faXmark,
  faTriangleExclamation,
)

createApp(App)
  .component('fa-icon', FontAwesomeIcon)
  .mount('#app')
