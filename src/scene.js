import * as THREE from 'three'

export function createRenderer(container){
  const renderer = new THREE.WebGLRenderer({ antialias:true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.shadowMap.enabled = true
  container.appendChild(renderer.domElement)
  return renderer
}

export function createScene(){
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0b0f14)
  const hemi = new THREE.HemisphereLight(0xffffff, 0x223344, 0.35)
  scene.add(hemi)
  const dir = new THREE.DirectionalLight(0xffffff, 0.9)
  dir.position.set(3,6,4)
  dir.castShadow = true
  dir.shadow.mapSize.set(2048,2048)
  dir.shadow.camera.near = 0.1
  dir.shadow.camera.far = 20
  scene.add(dir)
  return { scene, dir }
}

export function createCamera(container){
  const aspect = container.clientWidth / container.clientHeight
  const cam = new THREE.PerspectiveCamera(55, aspect, 0.05, 200)
  cam.position.set(0, 6.5, 8.5)
  cam.lookAt(0,0,0)
  return cam
}

export function resize(renderer, camera, container){
  const w = container.clientWidth
  const h = container.clientHeight
  renderer.setSize(w, h)
  camera.aspect = w/h
  camera.updateProjectionMatrix()
}
