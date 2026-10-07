// Tiny synthesized sound effects (no audio files). Created lazily after the
// first user gesture so browsers allow playback.

let ctx = null
let muted = false

export function setMuted(v) {
  muted = v
}

function audio() {
  if (muted) return null
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone(freq, start, dur, { type = 'sine', gain = 0.08 } = {}) {
  const a = audio()
  if (!a) return
  const t0 = a.currentTime + start
  const osc = a.createOscillator()
  const g = a.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(gain, t0 + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g).connect(a.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

export const sfx = {
  collect: () => [660, 880, 1320].forEach((f, i) => tone(f, i * 0.06, 0.18, { type: 'triangle' })),
  open: () => tone(520, 0, 0.12, { gain: 0.05 }),
  levelUp: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.09, 0.3, { type: 'square', gain: 0.04 })),
  achievement: () => [784, 988, 1175].forEach((f, i) => tone(f, i * 0.08, 0.35, { type: 'triangle', gain: 0.07 })),
}
