import { Vector3 } from 'three'
import { SPAWN } from '../data/landmarks'
import { heightAt } from './world/terrain'

// Mutable per-frame player state shared by the player, camera, orbs and
// minimap. Kept outside React so it can change every frame without renders.
export const player = {
  pos: new Vector3(SPAWN[0], heightAt(SPAWN[0], SPAWN[1]), SPAWN[1]),
  heading: Math.PI,
  speed: 0,
  keys: new Set(),
}
