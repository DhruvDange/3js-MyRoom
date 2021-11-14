import './style.css'
import * as dat from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { gsap } from 'gsap'

/**
 * LoadingManager
 */

const loadingBarElement = document.querySelector('.loading-bar')


const loadingManager = new THREE.LoadingManager(
    // Loaded
    () => {
        window.setTimeout(() => {
            gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0 })
            loadingBarElement.classList.add('ended')
            loadingBarElement.style.transform = ''
        }, 500)
    },
    // Progress / Loading
    (itemUrl, itemsLoaded, itemsTotal) => {
        const progressRatio = itemsLoaded / itemsTotal
        loadingBarElement.style.transform = `scaleX(${progressRatio})`

    },
)

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
    width: 400
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader(loadingManager)

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader(loadingManager)
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */
const baseTexture = textureLoader.load('room/textures/new/base.jpg')
baseTexture.flipY = false
baseTexture.encoding = THREE.sRGBEncoding

const itemTexture1 = textureLoader.load('room/textures/new/itemsBaked1.jpg')
itemTexture1.flipY = false
itemTexture1.encoding = THREE.sRGBEncoding

const itemTexture2 = textureLoader.load('room/textures/new/itemsBaked2.jpg')
itemTexture2.flipY = false
itemTexture2.encoding = THREE.sRGBEncoding

const chairTexture = textureLoader.load('room/textures/new/bakedChair.jpg')
chairTexture.flipY = false
chairTexture.encoding = THREE.sRGBEncoding

const pcTexture = textureLoader.load('room/textures/new/pcBaked.jpg')
pcTexture.flipY = false
pcTexture.encoding = THREE.sRGBEncoding


/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

/**
 *  Materials
 */
const baseMaterial = new THREE.MeshBasicMaterial({ map: baseTexture })
const itemMaterial1 = new THREE.MeshBasicMaterial({ map: itemTexture1})
const itemMaterial2 = new THREE.MeshBasicMaterial({ map: itemTexture2})
const chairMaterial = new THREE.MeshBasicMaterial({ map: chairTexture})
const pcMaterial = new THREE.MeshBasicMaterial({ map: pcTexture})


const eBlueMaterial = new THREE.MeshBasicMaterial({ color: 0x0E54FF })
const eWhiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })



// const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0x0E54FF })
// const portalLightMaterial = new THREE.MeshBasicMaterial({ color: 0x0E54FF })


/**
 * Model
 */
// gltfLoader.load(
//     'room/items/items.glb',
//     (gltf) => {
//         const bakedMesh = gltf.scene.children.find( (child) => child.name === 'BakedItems')
//         // const ePoleLight1 = gltf.scene.children.find( (child) => child.name === 'ePoleLight1')
//         // const ePoleLight2 = gltf.scene.children.find( (child) => child.name === 'ePoleLight2')
//         // const ePortalLight = gltf.scene.children.find( (child) => child.name === 'ePortal')
        
//         bakedMesh.material = bakedMaterial
//         // ePoleLight1.material = poleLightMaterial
//         // ePoleLight2.material = poleLightMaterial
//         // ePortalLight.material = portalLightMaterial
//         console.log(gltf.scene.children);

//         scene.add(gltf.scene)
//     }
// )

gltfLoader.load(
    'room/draco_room.glb',
    (gltf) => {
        const baseMesh = gltf.scene.children.find( (child) => child.name === 'BaseBaked')
        const items1Mesh = gltf.scene.children.find( (child) => child.name === 'itemsBaked')
        const items2Mesh = gltf.scene.children.find( (child) => child.name === 'items2Baked')
        const chairBackMesh = gltf.scene.children.find( (child) => child.name === 'chairBack')
        const pcMesh = gltf.scene.children.find( (child) => child.name === 'pcBaked')

        const eBlueMesh = gltf.scene.children.find( (child) => child.name === 'eBaked')
        const eWhiteMesh = gltf.scene.children.find( (child) => child.name === 'eScreen')


        
        baseMesh.material = baseMaterial
        items1Mesh.material = itemMaterial1
        items2Mesh.material = itemMaterial2
        chairBackMesh.material = chairMaterial
        pcMesh.material = pcMaterial
        eBlueMesh.material = eBlueMaterial
        eWhiteMesh.material = eWhiteMaterial

        gltf.scene.scale.set(0.2, 0.2, 0.2)
        console.log(gltf.scene);

        scene.add(gltf.scene)
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Overlay
 */
 const overlayGeometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1)
 const overlayMaterial = new THREE.ShaderMaterial({
     transparent: true,
     uniforms: {
         uAlpha: { value: 1 }
     },
     vertexShader: `
         void main(){
             gl_Position = vec4(position, 1.0);
         }
     `,
     fragmentShader: `
         uniform float uAlpha;
 
         void main(){
             gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
         }
     `,
     }
 )
 const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
 scene.add(overlay)

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding= THREE.sRGBEncoding
renderer.physicallyCorrectLights = true

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()