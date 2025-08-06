import * as THREE from 'three'

export const BALL = {
  radius: 0.05715/2,
  mass: 0.17
}

export function createBall(color){
  const geom = new THREE.SphereGeometry(BALL.radius, 48, 32)
  const mat = new THREE.MeshStandardMaterial({ color, roughness:0.4, metalness:0.0 })
  const mesh = new THREE.Mesh(geom, mat)
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.userData.vel = new THREE.Vector3()
  mesh.userData.ang = new THREE.Vector3()
  mesh.userData.spin = new THREE.Vector3()
  mesh.userData.inPocket = false
  return mesh
}

export function createSet(){
  const colors = [0xffffff, 0xffee58, 0x1976d2, 0xd32f2f, 0x4caf50, 0xff9800, 0x7b1fa2, 0x5d4037, 0x000000,
    0xfff176, 0x64b5f6, 0xef9a9a, 0xa5d6a7, 0xffcc80, 0xce93d8, 0x8d6e63]
  const balls = colors.map(c=>createBall(c))
  return balls
}
