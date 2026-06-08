import * as THREE from 'three'
import { COLORS, MAP_SIZE, BUILDINGS, BuildingDef } from './Constants'

export function createWorld(scene: THREE.Scene) {
  // Ground
  const groundGeo = new THREE.PlaneGeometry(MAP_SIZE, MAP_SIZE, 30, 30)

  // Add some noise to ground vertices for a slightly uneven retro feel
  const posAttribute = groundGeo.attributes.position
  for (let i = 0; i < posAttribute.count; i++) {
    const z = posAttribute.getZ(i)
    posAttribute.setZ(i, z + (Math.random() * 0.2 - 0.1))
  }
  groundGeo.computeVertexNormals()

  const groundMat = new THREE.MeshLambertMaterial({ color: COLORS.ground })
  const ground = new THREE.Mesh(groundGeo, groundMat)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  // Paths (simple planes slightly above ground)
  createPath(scene, 0, 0, 4, MAP_SIZE) // Vertical main street
  createPath(scene, 0, 0, MAP_SIZE, 4) // Horizontal main street
  createPath(scene, -12, -4, 4, 10) // Path to houses
  createPath(scene, 12, -4, 4, 10) // Path to houses
  createPath(scene, 16, 4, 4, 10) // Path to mart
  createPath(scene, -16, 8, 4, 18) // Path to tower

  // Buildings
  BUILDINGS.forEach((b) => createBuilding(scene, b))

  // Fences & Trees (Perimeter)
  createPerimeter(scene)
}

function createPath(
  scene: THREE.Scene,
  x: number,
  z: number,
  w: number,
  d: number,
) {
  const pathGeo = new THREE.PlaneGeometry(w, d)
  const pathMat = new THREE.MeshLambertMaterial({ color: COLORS.path })
  const path = new THREE.Mesh(pathGeo, pathMat)
  path.rotation.x = -Math.PI / 2
  path.position.set(x, 0.05, z)
  path.receiveShadow = true
  scene.add(path)
}

function createBuilding(scene: THREE.Scene, b: BuildingDef) {
  const group = new THREE.Group()
  group.position.set(b.x, 0, b.z)

  const bodyColor = b.type === 'tower' ? COLORS.towerBody : COLORS.houseBody
  const roofColor =
    b.type === 'mart'
      ? COLORS.martRoof
      : b.type === 'tower'
        ? 0x302838
        : COLORS.houseRoof
  const height = b.type === 'tower' ? 15 : 4

  // Body
  const bodyGeo = new THREE.BoxGeometry(b.w, height, b.d)
  const bodyMat = new THREE.MeshLambertMaterial({ color: bodyColor })
  const body = new THREE.Mesh(bodyGeo, bodyMat)
  body.position.y = height / 2
  body.castShadow = true
  body.receiveShadow = true
  group.add(body)

  // Roof
  if (b.type === 'tower') {
    const roofGeo = new THREE.BoxGeometry(b.w + 1, 1, b.d + 1)
    const roof = new THREE.Mesh(
      roofGeo,
      new THREE.MeshLambertMaterial({ color: roofColor }),
    )
    roof.position.y = height + 0.5
    group.add(roof)

    // Tower tiers
    for (let i = 1; i < 4; i++) {
      const tier = new THREE.Mesh(
        new THREE.BoxGeometry(b.w + 2 - i, 0.5, b.d + 2 - i),
        new THREE.MeshLambertMaterial({ color: roofColor }),
      )
      tier.position.y = (height / 4) * i
      group.add(tier)
    }
  } else {
    // Gabled roof
    const roofGeo = new THREE.ConeGeometry(Math.max(b.w, b.d) * 0.7, 3, 4)
    const roofMat = new THREE.MeshLambertMaterial({ color: roofColor })
    const roof = new THREE.Mesh(roofGeo, roofMat)
    roof.rotation.y = Math.PI / 4
    roof.position.y = height + 1.5
    roof.castShadow = true
    group.add(roof)
  }

  // Door
  const doorGeo = new THREE.BoxGeometry(1.5, 2.5, 0.2)
  const doorMat = new THREE.MeshLambertMaterial({ color: 0x443322 })
  const door = new THREE.Mesh(doorGeo, doorMat)
  door.position.set(0, 1.25, b.d / 2 + 0.05)
  group.add(door)

  // Sign for Mart
  if (b.type === 'mart') {
    const signGeo = new THREE.BoxGeometry(4, 1.5, 0.3)
    const signMat = new THREE.MeshLambertMaterial({ color: 0xffffff })
    const sign = new THREE.Mesh(signGeo, signMat)
    sign.position.set(0, 3, b.d / 2 + 0.1)
    group.add(sign)

    const blueStripe = new THREE.Mesh(
      new THREE.BoxGeometry(4, 0.3, 0.35),
      new THREE.MeshLambertMaterial({ color: COLORS.martRoof }),
    )
    blueStripe.position.set(0, 3, b.d / 2 + 0.1)
    group.add(blueStripe)
  }

  scene.add(group)
}

function createPerimeter(scene: THREE.Scene) {
  const half = MAP_SIZE / 2
  const step = 2

  for (let i = -half; i <= half; i += step) {
    // Top and bottom edges
    createTree(scene, i, -half)
    createTree(scene, i, half)
    // Left and right edges
    createTree(scene, -half, i)
    createTree(scene, half, i)
  }

  // Random scattered trees
  for (let i = 0; i < 30; i++) {
    const x = (Math.random() - 0.5) * MAP_SIZE
    const z = (Math.random() - 0.5) * MAP_SIZE

    // Don't place on paths or buildings
    if (Math.abs(x) < 3 || Math.abs(z) < 3) continue

    let nearBuilding = false
    for (const b of BUILDINGS) {
      if (Math.abs(x - b.x) < b.w / 2 + 2 && Math.abs(z - b.z) < b.d / 2 + 2) {
        nearBuilding = true
        break
      }
    }

    if (!nearBuilding) {
      createTree(scene, x, z)
    }
  }
}

function createTree(scene: THREE.Scene, x: number, z: number) {
  const group = new THREE.Group()
  group.position.set(x, 0, z)

  const trunk = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 1, 0.4),
    new THREE.MeshLambertMaterial({ color: 0x332211 }),
  )
  trunk.position.y = 0.5
  trunk.castShadow = true
  group.add(trunk)

  const leaves = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 2, 1.5),
    new THREE.MeshLambertMaterial({ color: COLORS.tree }),
  )
  leaves.position.y = 2
  leaves.castShadow = true
  group.add(leaves)

  scene.add(group)
}
