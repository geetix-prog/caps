<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as THREE from 'three'

defineOptions({
  name: 'Scene3DCamera',
})

const container = ref<HTMLDivElement | null>(null)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let animationId: number
let cameraGroup: THREE.Group
let mouseX = 0
let mouseY = 0

// Matériaux — tons plus clairs et contrastés
const matBodyDark = () =>
  new THREE.MeshStandardMaterial({ color: 0x4a4a4a, metalness: 0.75, roughness: 0.2 })
const matBodyMid = () =>
  new THREE.MeshStandardMaterial({ color: 0x5c5c5c, metalness: 0.7, roughness: 0.25 })
const matBodyLight = () =>
  new THREE.MeshStandardMaterial({ color: 0x6e6e6e, metalness: 0.65, roughness: 0.3 })
const matChrome = () =>
  new THREE.MeshStandardMaterial({ color: 0xe0e0e0, metalness: 0.95, roughness: 0.05 })
const matRubber = () =>
  new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.0, roughness: 0.9 })
const matRedEmissive = () =>
  new THREE.MeshStandardMaterial({
    color: 0xff0000,
    emissive: 0xff0000,
    emissiveIntensity: 2.5,
  })
const matBlueGlass = () =>
  new THREE.MeshPhysicalMaterial({
    color: 0x4488dd,
    metalness: 0.0,
    roughness: 0.05,
    transparent: true,
    opacity: 0.55,
    transmission: 0.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
  })

function createProCamera(): THREE.Group {
  const group = new THREE.Group()

  // ─── CORPS PRINCIPAL ───
  const mainBody = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.1, 1.8), matBodyDark())
  group.add(mainBody)

  // Arête supérieure arrondie
  const topRound = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.6, 32), matBodyDark())
  topRound.rotation.z = Math.PI / 2
  topRound.position.set(0, 0.55, 0)
  group.add(topRound)

  // Section arrière
  const rearSection = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.9, 1.6), matBodyMid())
  rearSection.position.set(-1.1, 0, 0)
  group.add(rearSection)

  // Plaque latérale chrome
  const sidePlate = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.4, 0.8), matChrome())
  sidePlate.position.set(0, 0.2, 0.92)
  group.add(sidePlate)

  // Label rouge
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(0.6, 0.15),
    new THREE.MeshStandardMaterial({ color: 0xdd3333, metalness: 0.3, roughness: 0.5 }),
  )
  label.position.set(0, 0.2, 0.931)
  group.add(label)

  // ─── OBJECTIF PRINCIPAL ───
  const lensBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 1.4, 32), matBodyMid())
  lensBarrel.rotation.z = Math.PI / 2
  lensBarrel.position.set(1.5, -0.05, 0)
  group.add(lensBarrel)

  // Bague de mise au point
  const focusRing = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.04, 16, 32), matRubber())
  focusRing.rotation.y = Math.PI / 2
  focusRing.position.set(1.2, -0.05, 0)
  group.add(focusRing)

  // Bague de zoom
  const zoomRing = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.05, 16, 32), matRubber())
  zoomRing.rotation.y = Math.PI / 2
  zoomRing.position.set(1.6, -0.05, 0)
  group.add(zoomRing)

  // Pare-soleil
  const hood = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.42, 0.3, 4), matBodyLight())
  hood.rotation.z = Math.PI / 2
  hood.rotation.x = Math.PI / 4
  hood.position.set(2.3, -0.05, 0)
  group.add(hood)

  // Verre de l'objectif
  const lensGlass = new THREE.Mesh(new THREE.CircleGeometry(0.36, 32), matBlueGlass())
  lensGlass.position.set(2.46, -0.05, 0)
  lensGlass.rotation.y = Math.PI / 2
  group.add(lensGlass)

  // Anneaux de diaphragme
  for (let i = 1; i <= 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.08 * i, 0.08 * i + 0.012, 32),
      new THREE.MeshStandardMaterial({
        color: 0x2244aa,
        transparent: true,
        opacity: 0.35,
      }),
    )
    ring.position.set(2.47, -0.05, 0)
    ring.rotation.y = Math.PI / 2
    group.add(ring)
  }

  // Reflet dans l'objectif
  const lensFlare = new THREE.Mesh(
    new THREE.CircleGeometry(0.15, 32),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.15,
      transparent: true,
      opacity: 0.25,
    }),
  )
  lensFlare.position.set(2.48, 0.05, 0.08)
  lensFlare.rotation.y = Math.PI / 2
  group.add(lensFlare)

  // ─── VISEUR ÉLECTRONIQUE ───
  const viewfinderBody = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.35, 0.35), matBodyDark())
  viewfinderBody.position.set(-0.5, 0.75, 0)
  group.add(viewfinderBody)

  const eyepiece = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.2, 16), matRubber())
  eyepiece.rotation.z = Math.PI / 2
  eyepiece.position.set(-0.95, 0.75, 0)
  group.add(eyepiece)

  const viewScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.25, 0.18),
    new THREE.MeshStandardMaterial({
      color: 0x2266aa,
      emissive: 0x2266aa,
      emissiveIntensity: 0.4,
    }),
  )
  viewScreen.position.set(-0.15, 0.75, 0.176)
  group.add(viewScreen)

  // ─── POIGNÉE SUPÉRIEURE ───
  const handleBar = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.15), matChrome())
  handleBar.position.set(0, 1.15, 0)
  group.add(handleBar)

  for (const xOff of [-0.55, 0.55]) {
    const support = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.08), matChrome())
    support.position.set(xOff, 0.95, 0)
    group.add(support)
  }

  // Pad d'épaule
  const shoulderPad = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.12, 1.4), matRubber())
  shoulderPad.position.set(-0.2, -0.62, 0)
  group.add(shoulderPad)

  // ─── MICRO INTÉGRÉ ───
  const micBody = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8), matBodyLight())
  micBody.rotation.z = -Math.PI / 6
  micBody.position.set(1.0, 0.85, 0.3)
  group.add(micBody)

  const micHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.9 }),
  )
  micHead.position.set(1.25, 0.7, 0.3)
  group.add(micHead)

  // ─── INDICATEURS REC ───
  const recLight = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), matRedEmissive())
  recLight.position.set(0.6, 0.57, 0.55)
  recLight.userData.isRec = true
  group.add(recLight)

  const recLight2 = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 16), matRedEmissive())
  recLight2.position.set(0.75, 0.57, 0.55)
  recLight2.userData.isRec = true
  group.add(recLight2)

  // ─── BOUTONS LATÉRAUX ───
  for (let i = 0; i < 4; i++) {
    const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.04, 12), matChrome())
    btn.rotation.x = Math.PI / 2
    btn.position.set(-0.3 + i * 0.2, 0.3, 0.92)
    group.add(btn)
  }

  // Servo grip
  const servoGrip = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.2, 0.4), matRubber())
  servoGrip.position.set(0.85, -0.35, 0.7)
  servoGrip.rotation.x = 0.2
  group.add(servoGrip)

  // ─── CONNECTEURS BNC ───
  for (let i = 0; i < 3; i++) {
    const bnc = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.08, 12), matChrome())
    bnc.rotation.z = Math.PI / 2
    bnc.position.set(-1.42, -0.1 + i * 0.2, 0.4)
    group.add(bnc)
  }

  // ─── GRILLE DE VENTILATION ───
  for (let i = 0; i < 5; i++) {
    const vent = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.04, 0.6), matBodyMid())
    vent.position.set(0.3, -0.35 + i * 0.06, 0.92)
    group.add(vent)
  }

  return group
}

// ─── PARTICULES ───
function createParticles(): THREE.Points {
  const count = 180
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 14
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.03,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
  })
  return new THREE.Points(geometry, material)
}

function onMouseMove(e: MouseEvent) {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2
}

function init() {
  if (!container.value) return

  const width = container.value.clientWidth || window.innerWidth
  const height = container.value.clientHeight || window.innerHeight

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
  camera.position.set(0, 0.5, 7)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.6
  container.value.appendChild(renderer.domElement)

  // ─── ÉCLAIRAGE BOOSTÉ ───
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  // Key light — puissante
  const keyLight = new THREE.DirectionalLight(0xfff8ee, 1.8)
  keyLight.position.set(4, 5, 4)
  scene.add(keyLight)

  // Fill light — chaude
  const fillLight = new THREE.DirectionalLight(0xffeedd, 0.9)
  fillLight.position.set(-4, 2, 3)
  scene.add(fillLight)

  // Rim light
  const rimLight = new THREE.DirectionalLight(0xffffff, 1.0)
  rimLight.position.set(0, 3, -5)
  scene.add(rimLight)

  // Bottom fill
  const bottomFill = new THREE.DirectionalLight(0xffeedd, 0.4)
  bottomFill.position.set(0, -4, 3)
  scene.add(bottomFill)

  // Accents colorés
  const accentPink = new THREE.PointLight(0xff3388, 0.7, 15)
  accentPink.position.set(-4, 1, 2)
  scene.add(accentPink)

  const accentBlue = new THREE.PointLight(0x3388ff, 0.7, 15)
  accentBlue.position.set(4, -1, 2)
  scene.add(accentBlue)

  // ─── CAMÉRA SEULE ───
  cameraGroup = new THREE.Group()
  const proCamera = createProCamera()
  cameraGroup.add(proCamera)
  cameraGroup.position.set(0, 0, 0)
  scene.add(cameraGroup)

  // Particules
  const particles = createParticles()
  scene.add(particles)

  // ─── ANIMATION ───
  const clock = new THREE.Clock()

  function animate() {
    animationId = requestAnimationFrame(animate)
    const t = clock.getElapsedTime()

    // Flottement
    cameraGroup.rotation.y = Math.sin(t * 0.4) * 0.15
    cameraGroup.rotation.x = Math.cos(t * 0.3) * 0.03
    cameraGroup.position.y = Math.sin(t * 0.5) * 0.1

    // Parallaxe souris
    camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.02
    camera.position.y += (-mouseY * 0.8 + 0.5 - camera.position.y) * 0.02
    camera.lookAt(0, 0, 0)

    // Clignotement REC
    cameraGroup.traverse((child) => {
      if (child instanceof THREE.Mesh && child.userData.isRec) {
        const mat = child.material as THREE.MeshStandardMaterial
        mat.emissiveIntensity = 1.5 + Math.sin(t * 4) * 1.5
      }
    })

    // Particules
    const positions = particles.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += Math.sin(t + i) * 0.001
    }
    particles.geometry.attributes.position.needsUpdate = true
    particles.rotation.y = t * 0.02

    // Pulsation lumières
    accentPink.intensity = 0.5 + Math.sin(t * 1.2) * 0.3
    accentBlue.intensity = 0.5 + Math.cos(t * 1.0) * 0.3

    renderer.render(scene, camera)
  }

  animate()

  window.addEventListener('resize', onResize)
  window.addEventListener('mousemove', onMouseMove)
}

function onResize() {
  if (!container.value) return
  const width = container.value.clientWidth || window.innerWidth
  const height = container.value.clientHeight || window.innerHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

onMounted(async () => {
  await nextTick()
  init()
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('mousemove', onMouseMove)
  renderer?.dispose()
})
</script>

<template>
  <div ref="container" class="absolute inset-0 w-full h-full z-0"></div>
</template>
