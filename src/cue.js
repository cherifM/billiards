import * as THREE from 'three'
import { BALL } from './ball.js'

export function createCue(){
  const g = new THREE.Group()
  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.01, 0.015, 1.5, 16, 1, true),
    new THREE.MeshStandardMaterial({ color:0xcda677, roughness:0.7 })
  )
  shaft.position.y = BALL.radius + 0.03
  shaft.rotation.z = Math.PI/2
  shaft.castShadow = true
  g.add(shaft)

  const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.04, 16), new THREE.MeshStandardMaterial({ color:0x4fc3f7 }))
  tip.position.set(0.75, BALL.radius + 0.03, 0)
  tip.rotation.z = Math.PI/2
  tip.castShadow = true
  g.add(tip)
  return g
}

export function updateCue(cue, cueBall, aimDir, power){
  if(!cueBall) return
  const offset = 0.85 + power*0.6
  cue.position.copy(cueBall.position)
  cue.position.addScaledVector(aimDir, -offset)
  const yaw = Math.atan2(aimDir.x, aimDir.z)
  cue.rotation.y = yaw
}
