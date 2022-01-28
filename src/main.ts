import { createApp } from 'lunchboxjs'
import App from './App.vue'
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry'

createApp(App).extend({ RoundedBoxGeometry }).mount('#app')
