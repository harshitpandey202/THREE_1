import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import CANNON from 'cannon' 
import * as  Box  from 'cannon'



/**
 * Debug
 */
const gui = new GUI()

const debuugobject ={}

debuugobject.createsphere = () =>
{
    createsphere(
        Math.random() * 0.5,
        {
      x: (Math.random() -0.5) *3,
      y: 3,
      z:(Math.random() -0.5) *3,
    })
}


gui.add(debuugobject, 'createsphere')


debuugobject.createcube = () =>
{
    createcube(
        Math.random() ,
        Math.random() ,
        Math.random() ,

        {
      x: (Math.random() -0.5) *3,
      y: 3,
      z:(Math.random() -0.5) *3,
    })
}
gui.add(debuugobject, 'createcube')


debuugobject.reset = () =>{
    for(const object of objectstoupdate){
        object.body.removeEventListener('collide' , playhitsound)
        world.removeBody(object.body)
            scene.remove(object.mesh)
    }

}
gui.add(debuugobject, 'reset')



/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

const hitsound = new Audio('/sounds/hit.mp3')
const playhitsound = (collision) =>{
    hitsound.currentTime = 0
    hitsound.play()
    hitsound.volume = Math.random()
    



}



//physics
const world = new CANNON.World()

world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, -9.82 , 0)



//material
const defalutmaterial = new CANNON.Material('default')


const contactmaterail = new CANNON.ContactMaterial(
    defalutmaterial,defalutmaterial,{
        friction: 0.1,
        restitution: 0.8
    }
)
world.addContactMaterial(contactmaterail)



//sphere







//floor

const floorshape = new CANNON.Plane()
const floorbody = new CANNON.Body()
floorbody.mass = 0
floorbody.addShape(floorshape)
floorbody.material = defalutmaterial
floorbody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0 , 0),
    Math.PI * 0.5
)
world.addBody(floorbody)










/**
 * Test sphere
 */


/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



const objectstoupdate =[]
//utils

const createsphere = (radius , position) =>
{
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius,20,20),new THREE.MeshStandardMaterial({
        metalness:0.3,
        roughness:0.4,
        envMap:environmentMapTexture
    })
  
  ) 
  mesh.castShadow= true
  mesh.position.copy(position)
  scene.add(mesh)
  //three 
  const shape = new CANNON.Sphere()
  const body = new CANNON.Body(
    {
        mass:1,
        position: new CANNON.Vec3(0,3,0),
        shape,
        material: defalutmaterial})
        body.position.copy(position)
        body.addEventListener('collide', playhitsound)
        world.add(body )

//update the object
 objectstoupdate.push({
    mesh,
    body
 })

}




createsphere(0.5,{x:0,y:3,z:0})




//cube 



const boxgeometry =new THREE.BoxGeometry(1,1,1)
const boxmaterial =new THREE.MeshStandardMaterial({ envMap : environmentMapTexture,
    metalness: 0.3, roughness:0.4})


   
const createcube = ( width , height , depth , position) =>{


    const mesh = new THREE.Mesh(boxgeometry, boxmaterial)
    mesh.scale.set(width, height , depth)
       mesh.castShadow = true
       mesh.position.copy(position)
       scene.add(mesh)
    //physics
 
const shape = new CANNON.Box(new CANNON.Vec3(width,height,depth))
const body = new CANNON.Body({
    mass:1,
    position: new CANNON.Vec3(0,3,0),
        shape,
        material: defalutmaterial
})
body.position.copy(position)
body.addEventListener('collide', playhitsound)
world.addBody(body)

objectstoupdate.push({
    mesh ,
    body 
})
}













/**
 * Animate
 */
const clock = new THREE.Clock()
let oldtime= 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltatime = elapsedTime - oldtime
    oldtime = elapsedTime


     
    //world
    
    world.step(1/60, deltatime , 3)
    
    for(const object of objectstoupdate){
        object.mesh.position.copy(object.body.position )
        object.mesh.quaternion.copy(object.body.quaternion)
    }

   

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()