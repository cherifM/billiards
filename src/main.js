import * as THREE from 'three'
import { createRenderer, createScene, createCamera, resize } from './scene.js'
import { createGame, updateGame, rerack } from './game.js'
import { createInput } from './input.js'

const container = document.getElementById('app')
const renderer = createRenderer(container)
const { scene } = createScene()
const camera = createCamera(container)

const input = createInput(renderer.domElement)

const state = createGame(scene)

const powerBar = document.getElementById('powerBar')
document.getElementById('rerack').addEventListener('click', ()=>rerack(state))
window.addEventListener('keydown', (e)=>{ if(e.key==='r' || e.key==='R') rerack(state) })

let last = performance.now()
function loop(t){
  const dt = Math.min(0.033, (t - last) / 1000)
  last = t
  updateGame(state, camera, input, dt)
  powerBar.style.width = `${Math.floor(state.power*100)}%`
  renderer.render(scene, camera)
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)

window.addEventListener('resize', ()=>resize(renderer, camera, container))
