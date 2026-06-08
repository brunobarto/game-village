import * as THREE from 'three'
import { COLORS } from './Constants'

export class Character {
  group: THREE.Group
  body: THREE.Mesh
  head: THREE.Mesh
  leftLeg: THREE.Mesh
  rightLeg: THREE.Mesh
  leftArm: THREE.Mesh
  rightArm: THREE.Mesh

  walkTime: number = 0
  isWalking: boolean = false

  // For NPCs
  targetX: number = 0
  targetZ: number = 0
  waitTime: number = 0

  constructor(color: number = COLORS.playerBody, isPlayer: boolean = false) {
    this.group = new THREE.Group()

    const material = new THREE.MeshLambertMaterial({ color })
    const skinMaterial = new THREE.MeshLambertMaterial({ color: 0xffddcc })
    const darkMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 })

    // Body
    this.body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1, 0.5), material)
    this.body.position.y = 1.2
    this.body.castShadow = true
    this.group.add(this.body)

    // Head
    this.head = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.8, 0.8),
      skinMaterial,
    )
    this.head.position.y = 2.1
    this.head.castShadow = true
    this.group.add(this.head)

    // Hair/Hat
    if (isPlayer) {
      const hat = new THREE.Mesh(
        new THREE.BoxGeometry(0.82, 0.3, 0.82),
        new THREE.MeshLambertMaterial({ color: COLORS.playerHat }),
      )
      hat.position.y = 2.4
      const brim = new THREE.Mesh(
        new THREE.BoxGeometry(0.82, 0.1, 0.4),
        new THREE.MeshLambertMaterial({ color: 0xffffff }),
      )
      brim.position.set(0, 2.3, 0.5)
      this.group.add(hat)
      this.group.add(brim)
    } else {
      const hair = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 0.3, 0.85),
        darkMaterial,
      )
      hair.position.y = 2.4
      this.group.add(hair)
    }

    // Eyes
    const eyeGeo = new THREE.BoxGeometry(0.1, 0.1, 0.1)
    const eyeL = new THREE.Mesh(eyeGeo, darkMaterial)
    eyeL.position.set(-0.2, 2.1, 0.41)
    const eyeR = new THREE.Mesh(eyeGeo, darkMaterial)
    eyeR.position.set(0.2, 2.1, 0.41)
    this.group.add(eyeL)
    this.group.add(eyeR)

    // Limbs
    const limbGeo = new THREE.BoxGeometry(0.3, 0.8, 0.3)

    this.leftLeg = new THREE.Mesh(limbGeo, darkMaterial)
    this.leftLeg.position.set(-0.25, 0.4, 0)
    this.leftLeg.castShadow = true
    this.group.add(this.leftLeg)

    this.rightLeg = new THREE.Mesh(limbGeo, darkMaterial)
    this.rightLeg.position.set(0.25, 0.4, 0)
    this.rightLeg.castShadow = true
    this.group.add(this.rightLeg)

    this.leftArm = new THREE.Mesh(limbGeo, material)
    this.leftArm.position.set(-0.55, 1.3, 0)
    this.leftArm.castShadow = true
    this.group.add(this.leftArm)

    this.rightArm = new THREE.Mesh(limbGeo, material)
    this.rightArm.position.set(0.55, 1.3, 0)
    this.rightArm.castShadow = true
    this.group.add(this.rightArm)
  }

  updateAnimation(delta: number, speed: number) {
    if (this.isWalking) {
      this.walkTime += delta * 15
      const swing = Math.sin(this.walkTime) * 0.5

      this.leftLeg.rotation.x = swing
      this.rightLeg.rotation.x = -swing
      this.leftArm.rotation.x = -swing
      this.rightArm.rotation.x = swing

      // Bobbing
      this.group.position.y = Math.abs(Math.sin(this.walkTime * 2)) * 0.1
    } else {
      this.walkTime = 0
      this.leftLeg.rotation.x = 0
      this.rightLeg.rotation.x = 0
      this.leftArm.rotation.x = 0
      this.rightArm.rotation.x = 0
      this.group.position.y = 0
    }
  }
}
