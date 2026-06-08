import * as THREE from 'three'
import { InputManager } from './Input'
import { Character } from './Character'
import { createWorld } from './World'
import { COLORS, BUILDINGS, BOUNDS, POIS, MAP_SIZE } from './Constants'

export class GameEngine {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  input: InputManager

  player: Character
  npcs: Character[] = []

  clock: THREE.Clock
  animationFrameId: number = 0

  onPoiUpdate: (text: string | null) => void

  constructor(
    canvas: HTMLCanvasElement,
    onPoiUpdate: (text: string | null) => void,
  ) {
    this.onPoiUpdate = onPoiUpdate
    this.clock = new THREE.Clock()
    this.input = new InputManager()

    // Setup Scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(COLORS.sky)
    this.scene.fog = new THREE.Fog(COLORS.fog, 15, 40)

    // Setup Camera (Top-down 3/4 view)
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    )
    this.camera.position.set(0, 15, 20)
    this.camera.lookAt(0, 0, 0)

    // Setup Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // Retro feel, cap pixel ratio
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    this.scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xe0d0ff, 0.8)
    dirLight.position.set(20, 30, 10)
    dirLight.castShadow = true
    dirLight.shadow.camera.left = -30
    dirLight.shadow.camera.right = 30
    dirLight.shadow.camera.top = 30
    dirLight.shadow.camera.bottom = -30
    dirLight.shadow.mapSize.width = 1024
    dirLight.shadow.mapSize.height = 1024
    this.scene.add(dirLight)

    // World
    createWorld(this.scene)

    // Player
    this.player = new Character(COLORS.playerBody, true)
    this.player.group.position.set(0, 0, 5)
    this.scene.add(this.player.group)

    // NPCs
    for (let i = 0; i < 5; i++) {
      const color = COLORS.npcColors[i % COLORS.npcColors.length]
      const npc = new Character(color, false)

      // Random start position on paths
      npc.group.position.set(
        (Math.random() - 0.5) * 20,
        0,
        (Math.random() - 0.5) * 20,
      )
      this.setNewNpcTarget(npc)

      this.npcs.push(npc)
      this.scene.add(npc.group)
    }

    // Resize handler
    window.addEventListener('resize', this.onWindowResize)

    // Start Loop
    this.loop()
  }

  setNewNpcTarget(npc: Character) {
    npc.targetX = (Math.random() - 0.5) * (MAP_SIZE - 10)
    npc.targetZ = (Math.random() - 0.5) * (MAP_SIZE - 10)
    npc.waitTime = Math.random() * 2 + 1
  }

  checkCollision(x: number, z: number, radius: number = 0.5): boolean {
    // Bounds
    if (x < -BOUNDS || x > BOUNDS || z < -BOUNDS || z > BOUNDS) return true

    // Buildings
    for (const b of BUILDINGS) {
      const halfW = b.w / 2
      const halfD = b.d / 2
      if (
        x + radius > b.x - halfW &&
        x - radius < b.x + halfW &&
        z + radius > b.z - halfD &&
        z - radius < b.z + halfD
      ) {
        return true
      }
    }
    return false
  }

  checkPOIs() {
    const px = this.player.group.position.x
    const pz = this.player.group.position.z

    let activePoi = null
    for (const poi of POIS) {
      const dx = px - poi.x
      const dz = pz - poi.z
      if (dx * dx + dz * dz < poi.radius * poi.radius) {
        activePoi = poi.text
        break
      }
    }
    this.onPoiUpdate(activePoi)
  }

  updatePlayer(delta: number) {
    const speed = 6
    const move = this.input.getMovementVector()

    if (move.dx !== 0 || move.dz !== 0) {
      this.player.isWalking = true

      // Calculate intended position
      const newX = this.player.group.position.x + move.dx * speed * delta
      const newZ = this.player.group.position.z + move.dz * speed * delta

      // Slide along walls (check axes independently)
      if (!this.checkCollision(newX, this.player.group.position.z)) {
        this.player.group.position.x = newX
      }
      if (!this.checkCollision(this.player.group.position.x, newZ)) {
        this.player.group.position.z = newZ
      }

      // Rotation
      const angle = Math.atan2(move.dx, move.dz)
      this.player.group.rotation.y = angle
    } else {
      this.player.isWalking = false
    }

    this.player.updateAnimation(delta, speed)
  }

  updateNPCs(delta: number) {
    const speed = 2.5

    for (const npc of this.npcs) {
      if (npc.waitTime > 0) {
        npc.waitTime -= delta
        npc.isWalking = false
      } else {
        const dx = npc.targetX - npc.group.position.x
        const dz = npc.targetZ - npc.group.position.z
        const dist = Math.sqrt(dx * dx + dz * dz)

        if (dist < 0.5) {
          this.setNewNpcTarget(npc)
        } else {
          npc.isWalking = true
          const vx = (dx / dist) * speed * delta
          const vz = (dz / dist) * speed * delta

          const newX = npc.group.position.x + vx
          const newZ = npc.group.position.z + vz

          if (!this.checkCollision(newX, newZ)) {
            npc.group.position.x = newX
            npc.group.position.z = newZ
            npc.group.rotation.y = Math.atan2(vx, vz)
          } else {
            // Hit a wall, pick new target
            this.setNewNpcTarget(npc)
          }
        }
      }
      npc.updateAnimation(delta, speed)
    }
  }

  loop = () => {
    this.animationFrameId = requestAnimationFrame(this.loop)

    const delta = Math.min(this.clock.getDelta(), 0.1) // Cap delta to prevent huge jumps

    this.updatePlayer(delta)
    this.updateNPCs(delta)
    this.checkPOIs()

    // Camera Follow
    const targetCamX = this.player.group.position.x
    const targetCamZ = this.player.group.position.z + 12

    this.camera.position.x += (targetCamX - this.camera.position.x) * 5 * delta
    this.camera.position.z += (targetCamZ - this.camera.position.z) * 5 * delta

    // Look slightly ahead of player
    this.camera.lookAt(
      this.player.group.position.x,
      0,
      this.player.group.position.z - 2,
    )

    this.renderer.render(this.scene, this.camera)
  }

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  cleanup() {
    cancelAnimationFrame(this.animationFrameId)
    window.removeEventListener('resize', this.onWindowResize)
    this.input.cleanup()
    this.renderer.dispose()
  }
}
