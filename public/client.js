import * as THREE from '/build/three.module.js'
import { OrbitControls } from '/jsm/controls/OrbitControls.js'
import gsap from '/gsap/index.js'
import { DRACOLoader } from '/jsm/loaders/DRACOLoader.js'
import {GLTFLoader} from '/jsm/loaders/GLTFLoader.js'

    const canvas = document.querySelector('.model')
    const canvas_scene = document.querySelector('.canvas_scene')
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, canvas_scene.offsetWidth/canvas_scene.offsetHeight, 0.1, 10000)
    camera.position.z = 120
    scene.add(camera)
    const renderer = new THREE.WebGLRenderer({
        canvas
    })
    renderer.setPixelRatio(devicePixelRatio)
    renderer.setSize(canvas_scene.offsetWidth, canvas_scene.offsetHeight)
    renderer.shadowMap.enabled = true

    scene.background = new THREE.Color("white")
    scene.receiveShadow = true

    const control = new OrbitControls(camera, renderer.domElement)
    const shoeParts = []
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('./assets/draco/')

    const gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(dracoLoader)
    let currentModel = null


    function createLights() {
        const ambient = new THREE.AmbientLight(0xffffff, 0.5)
        const point = new THREE.PointLight(0xffffff, 0.8)
        point.position.set(-100,100,100)
        const h = new THREE.PointLightHelper(point, 30, "red")
        h.position.y = 100
        point.castShadow = true
        point.castShadow = true
        scene.add(ambient,point)
    }

    function createShoe(shoeName) {
        gltfLoader.load(
            `/assets/products/${shoeName}`,
            (model) => {
                
                model.scene.traverse( function( mesh ) {
    
                    if(mesh.isMesh) {
                        mesh.castShadow = true
                        //mesh.material.envMap = envMaterial
                        //mesh.receiveShadow = true
                        shoeParts.push(mesh)
                    }
                });

                if(shoeName==="new_balance_997.gltf") {
                    model.scene.scale.setScalar(0.1)
                    model.scene.rotation.y = -Math.PI*0.5
                    model.scene.rotation.z = -0.25
                } else if(shoeName==="nike_air_jordan.gltf") {
                    model.scene.scale.setScalar(10)
                    model.scene.rotation.z = 0.15
                } else {
                    model.scene.rotation.y = -Math.PI*0.5
                    model.scene.scale.setScalar(10)
                    model.scene.rotation.z = -0.25
                }


                mainModel = model

                currentTimeline = gsap.timeline()
                
                currentTimeline.to(".product-details", {right: 0, ease:"slow"})
                currentTimeline.from(model.scene.position, {x:-300, ease:"elastic"})
    
    
                // model.scene.castShadow = true
                scene.add(model.scene)
                currentModel = model.scene
                document.querySelector('.progress-container').style.display = "none"
            },
            (xhr) => {
                var loaded = ( xhr.loaded / xhr.total * 100 )
                var progress_bar = document.querySelector('.progress-bar')
                progress_bar.style.width = loaded+"%"
                document.querySelector('.percentage').innerHTML = Math.round(loaded)+"%"
                if(loaded<5){
                    progress_bar.style.background = "red"
                } else if(loaded<25) {
                    progress_bar.style.background = "orangered"
                } else if(loaded<50) {
                    progress_bar.style.background = "orange"
                } else if(loaded<75) {
                    progress_bar.style.background = "lightgreen"
                } else {
                    progress_bar.style.background = "#86e01e"
                }
                if(Math.round(loaded)===100) {
                    document.querySelector('.percentage').innerHTML = "Loading..."
                }
            }
        )
    }

    function distroyModel() {
        while(scene.children.length > 0){
            scene.remove(scene.children[0]);
        }
    }




    let mainModel = null

    let currentTimeline = null


    let currentShoe = "nike_air_jordan.gltf"
    createLights()
    createShoe(currentShoe)

    document.querySelector('.shoe_change').addEventListener('change', (e)=>{
        if (currentTimeline) currentTimeline.reverse()
        setTimeout(() => {
            distroyModel()
            createLights()
            document.querySelector('.progress-container').style.display = "flex"
            createShoe(`${e.target.value}.gltf`)
        }, 1000);
    })


    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const mouseHover = new THREE.Vector2();
    let currentHexColor = "#fff"

    canvas.addEventListener('mousemove', (event)=>{
        var rect = renderer.domElement.getBoundingClientRect();
        mouseHover.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
        mouseHover.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;

        raycaster.setFromCamera(mouseHover, camera)
        const cursor = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><g filter="url(#filter0_d)"><path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="${currentHexColor}"/></g><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/><text fill="#000" style="white-space:pre" font-family="Inter var, sans-serif" font-size="10" letter-spacing="-.01em"><tspan x="35" y="63">Shoe</tspan></text></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h64v64H0z"/></clipPath><filter id="filter0_d" x="6" y="8" width="47" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="3"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`
        const auto = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/></svg>`
   
        const intersects = raycaster.intersectObjects(shoeParts);
        for ( let i = 0; i < intersects.length; i ++ ) {
            currentHexColor = "#"+intersects[0].object.material.color.getHexString()
            document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(cursor)}'), auto`
        }
        if(intersects.length==0) {
            currentHexColor = "#fff"
            document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(auto)}'), auto`
        }
    })



    let selectedPart = null

    canvas.addEventListener('click', (event)=>{

        var rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
        mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;


        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects(shoeParts);
        for ( let i = 0; i < intersects.length; i ++ ) {
            selectedPart = intersects[0].object
            let currentColor = intersects[0].object.material.color
            picker.show()
            picker.setColor(`#${currentColor.getHexString()}`)
        }
        if(intersects.length==0) {
            selectedPart = null
        }
    })

    const myParentElement = document.querySelector('.color-picker')
    var picker = new Picker({
        parent: myParentElement,
        onDone: function(color) {
            if(selectedPart) {
                selectedPart.material.color.set(new THREE.Color(color.rgbString))
            }
        },
    });

   

    let move = false;
    setInterval(() => {
        if(mainModel) {
            if(move) {
                gsap.to(mainModel.scene.position, {y:0, duration: 2, ease:'slow'})
                move = false;
            } else {
                gsap.to(mainModel.scene.position, {y:2, duration: 2,  ease:'slow'})
                move = true;
            }
        }
    }, 2000);


    function animate() {
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
        control.update()
    }
    animate()
