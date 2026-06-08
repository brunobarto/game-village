export class InputManager {
  keys: { [key: string]: boolean } = {}

  constructor() {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
  }

  onKeyDown = (e: KeyboardEvent) => {
    this.keys[e.key.toLowerCase()] = true
  }

  onKeyUp = (e: KeyboardEvent) => {
    this.keys[e.key.toLowerCase()] = false
  }

  getMovementVector() {
    let dx = 0
    let dz = 0

    if (this.keys['w'] || this.keys['arrowup']) dz -= 1
    if (this.keys['s'] || this.keys['arrowdown']) dz += 1
    if (this.keys['a'] || this.keys['arrowleft']) dx -= 1
    if (this.keys['d'] || this.keys['arrowright']) dx += 1

    // Normalize
    if (dx !== 0 && dz !== 0) {
      const length = Math.sqrt(dx * dx + dz * dz)
      dx /= length
      dz /= length
    }

    return { dx, dz }
  }

  cleanup() {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
  }
}
