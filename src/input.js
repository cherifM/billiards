import * as THREE from 'three'
import { clamp } from './utils/math.js'

export function createInput(canvas){
  const state = {
    aiming: false,
    mouse: new THREE.Vector2(),
    last: new THREE.Vector2(),
    delta: new THREE.Vector2(),
    power: 0,
    yaw: 0,
    pitch: 0.35,
    zoom: 8.5,
    fine: false
  }

  canvas.addEventListener('mousedown', (e)=>{
    state.aiming = true
    state.last.set(e.clientX, e.clientY)
  })
  window.addEventListener('mouseup', ()=>{ state.aiming = false })
  window.addEventListener('mousemove', (e)=>{
    state.mouse.set(e.clientX, e.clientY)
    if(state.aiming){
      state.delta.subVectors(state.mouse, state.last)
      const sens = state.fine? 0.002 : 0.005
      state.yaw -= state.delta.x * sens
      state.power = clamp((state.delta.y * 0.004), 0, 1)
      state.last.copy(state.mouse)
    }
  })
  window.addEventListener('wheel', (e)=>{
    state.zoom = clamp(state.zoom + Math.sign(e.deltaY)*0.6, 5, 14)
  }, { passive:true })
  window.addEventListener('keydown', (e)=>{
    if(e.key==='Shift') state.fine = true
  })
  window.addEventListener('keyup', (e)=>{
    if(e.key==='Shift') state.fine = false
  })
  return state
}
