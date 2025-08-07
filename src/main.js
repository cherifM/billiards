import * as THREE from 'three'
import { createRenderer, createScene, createCamera, resize } from './scene.js'
import { createGame, updateGame, rerack } from './game.js'
import { createInput } from './input.js'
import { audioManager } from './audio.js'
import { gameState } from './gamestate.js'

let renderer, scene, camera, input, state, powerBar, gameStatus, container

try {
  console.log('Starting app initialization...')
  
  container = document.getElementById('app')
  if (!container) {
    throw new Error('App container not found')
  }
  
  console.log('Creating renderer...')
  renderer = createRenderer(container)
  
  console.log('Creating scene...')
  const sceneData = createScene()
  scene = sceneData.scene
  
  console.log('Creating camera...')
  camera = createCamera(container)

  console.log('Creating input...')
  input = createInput(renderer.domElement)

  console.log('Creating game...')
  state = createGame(scene)

  console.log('Initializing audio...')
  audioManager.init().catch(e => console.warn('Audio initialization failed:', e))

  powerBar = document.getElementById('powerBar')
  gameStatus = document.getElementById('gameStatus')
  
  if (!powerBar || !gameStatus) {
    console.warn('Missing UI elements:', { powerBar: !!powerBar, gameStatus: !!gameStatus })
  }
  
  document.getElementById('rerack').addEventListener('click', ()=>rerack(state))
  window.addEventListener('keydown', (e)=>{ if(e.key==='r' || e.key==='R') rerack(state) })

  window.addEventListener('click', () => {
    audioManager.enable()
  }, { once: true })
  
  console.log('App initialized successfully')

  let last = performance.now()
  function loop(t){
    try {
      const dt = Math.min(0.033, (t - last) / 1000)
      last = t
      updateGame(state, camera, input, dt)
      if (powerBar) powerBar.style.width = `${Math.floor(state.power*100)}%`
      if (gameStatus) gameStatus.textContent = gameState.getStatusMessage()
      renderer.render(scene, camera)
      requestAnimationFrame(loop)
    } catch (error) {
      console.error('Runtime error in game loop:', error)
    }
  }
  requestAnimationFrame(loop)

  window.addEventListener('resize', ()=>resize(renderer, camera, container))
  
} catch (error) {
  console.error('Failed to initialize app:', error)
  document.body.innerHTML += `<div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); color: red; background: rgba(0,0,0,0.8); padding: 20px; border-radius: 5px;">Error: ${error.message}</div>`
}
