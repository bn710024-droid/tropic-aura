// ============================================================
//  TROPIC-AURA — Shared scroll state
//  Objet mutable partagé entre GSAP (qui écrit)
//  et Canvas3D / useFrame (qui lit chaque frame).
//  Pas de React state pour rester à 60 FPS constants.
// ============================================================
const scrollState = {
  heroProgress:  0,   // 0→1 pendant la section Hero
  techProgress:  0,   // 0→1 pendant la section Tech
  humanVisible:  false,
  canvasOpacity: 1,   // 1 dans hero/tech/closing, 0 dans human
  splitOpen:     0,   // 0 = entière, 1 = complètement ouverte
}

export default scrollState
