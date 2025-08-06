import * as THREE from 'three'

export const TABLE = {
  innerX: 2.54*2, 
  innerZ: 1.27*2, 
  height: 0.76,
  cushion: 0.06,
  pocketR: 0.09,
  cloth: 0x1b5e20
}

export function createTable(){
  const g = new THREE.Group()

  const plane = new THREE.Mesh(
    new THREE.BoxGeometry(TABLE.innerX, 0.05, TABLE.innerZ),
    new THREE.MeshStandardMaterial({ color: TABLE.cloth, roughness:0.9, metalness:0 })
  )
  plane.position.y = TABLE.height
  plane.receiveShadow = true
  g.add(plane)

  const woodMat = new THREE.MeshStandardMaterial({ color:0x5d4037, roughness:0.6 })
  const frame = new THREE.Mesh(new THREE.BoxGeometry(TABLE.innerX+0.3, 0.2, TABLE.innerZ+0.3), woodMat)
  frame.position.y = TABLE.height + 0.125
  frame.castShadow = true
  frame.receiveShadow = true
  g.add(frame)

  const legGeom = new THREE.BoxGeometry(0.2, 0.8, 0.2)
  const legOffX = (TABLE.innerX+0.3)/2 - 0.15
  const legOffZ = (TABLE.innerZ+0.3)/2 - 0.15
  for(const sx of [-1,1]) for(const sz of [-1,1]){
    const leg = new THREE.Mesh(legGeom, woodMat)
    leg.position.set(sx*legOffX, 0.4, sz*legOffZ)
    leg.castShadow = true
    g.add(leg)
  }

  const cushionMat = new THREE.MeshStandardMaterial({ color:0x0f3d16, roughness:0.9 })
  const cH = 0.08, cW = TABLE.cushion
  const innerY = TABLE.height + 0.05
  const cx = TABLE.innerX/2, cz = TABLE.innerZ/2
  const cGeomX = new THREE.BoxGeometry(TABLE.innerX - 2*TABLE.pocketR*0.85, cH, cW)
  const cGeomZ = new THREE.BoxGeometry(cW, cH, TABLE.innerZ - 2*TABLE.pocketR*0.85)
  const top = new THREE.Mesh(cGeomX, cushionMat); top.position.set(0, innerY + cH/2, -cz - cW/2)
  const bottom = new THREE.Mesh(cGeomX, cushionMat); bottom.position.set(0, innerY + cH/2, cz + cW/2)
  const left = new THREE.Mesh(cGeomZ, cushionMat); left.position.set(-cx - cW/2, innerY + cH/2, 0)
  const right = new THREE.Mesh(cGeomZ, cushionMat); right.position.set(cx + cW/2, innerY + cH/2, 0)
  for(const m of [top,bottom,left,right]){ m.castShadow = true; m.receiveShadow = true; g.add(m) }

  const pocketMat = new THREE.MeshStandardMaterial({ color:0x222, metalness:0.1, roughness:0.9 })
  const sphereGeom = new THREE.SphereGeometry(TABLE.pocketR, 16, 16, 0, Math.PI*2, 0, Math.PI/2)
  const pockets = []
  const px = cx + cW*0.5, pz = cz + cW*0.5
  const positions = [
    [-px, innerY, -pz], [0, innerY, -pz], [px, innerY, -pz],
    [-px, innerY,  pz], [0, innerY,  pz], [px, innerY,  pz]
  ]
  positions.forEach(([x,y,z])=>{
    const p = new THREE.Mesh(sphereGeom, pocketMat)
    p.position.set(x, y - 0.02, z)
    p.rotation.x = -Math.PI/2
    p.receiveShadow = true
    g.add(p)
    pockets.push(p)
  })

  return { group: g, pockets }
}
