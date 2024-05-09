import { OrbitControls } from 'three/examples/jsm/Addons.js'
import './style.css'
import * as THREE from "three"
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { RectAreaLightUniformsLib, RectAreaLightHelper } from 'three/examples/jsm/Addons.js'
import { RGBELoader } from 'three/examples/jsm/Addons.js'

class App {
  private domApp: Element
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera?: THREE.PerspectiveCamera

  private light?: THREE.Light;
  private helper?: THREE.DirectionalLightHelper | THREE.PointLightHelper | THREE.SpotLightHelper;

  constructor() {
    console.log('Hello three.js')

    this.domApp = document.querySelector('#app')!

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.domApp.appendChild(this.renderer.domElement)
    this.scene = new THREE.Scene()

    this.setupCamera()
    this.setupLight()
    this.setupModels()
    this.setupEvents()
  }

  private setupCamera() {
    const domApp = this.domApp
    const width = domApp.clientWidth
    const height = domApp.clientHeight

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100)
    this.camera.position.set(2, 2, 3.5);

    new OrbitControls(this.camera, this.domApp as HTMLElement)
  }

  private setupLight() {
    // AmbientLight 주변광
    /*
    const light = new THREE.AmbientLight("#ffffff", 0.1);
    this.scene.add(light);
    //*/

    // HemisphereLight 주변광
    /*
    const light = new THREE.HemisphereLight("#b0d8f5", "#bb7a1c", 1);
    this.scene.add(light);
    //*/

    // DirectionalLight 광원
    /*
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 0);
    light.target.position.set(0, 0, 0);
    this.scene.add(light.target);
    this.light = light;
    this.scene.add(light);

    const helper = new THREE.DirectionalLightHelper(light);
    this.helper = helper;
    this.scene.add(helper);
    //*/

    // PointLight 광원
    /*
    const light = new THREE.PointLight(0xffffff, 5);
    light.position.set(0, 5, 0);
    light.distance = 10;
    this.scene.add(light);
    this.light = light;

    const helper = new THREE.PointLightHelper(light);
    this.helper = helper;
    this.scene.add(helper);
    //*/

    // SpotLight 광원
    //*
    const light = new THREE.SpotLight(0xffffff, 10);
    light.position.set(0, 2.5, 0);
    light.target.position.set(0, 0, 0);
    light.angle = THREE.MathUtils.degToRad(30);
    light.penumbra = .1;
    this.scene.add(light);
    this.scene.add(light.target);

    const helper = new THREE.SpotLightHelper(light);
    this.scene.add(helper);

    this.light = light;
    this.helper = helper

    const gui = new GUI()
    gui.add(light, 'angle', 0, Math.PI / 2, 0.01).onChange(() => helper.update());
    gui.add(light, 'penumbra', 0, 1, 0.01).onChange(() => helper.update());
    //*/

    // RectAreaLight 광원
    /*
    RectAreaLightUniformsLib.init();
    const light = new THREE.RectAreaLight(0xffffff, 10, 3, 0.5);
    light.position.set(0, 5, 0);
    light.rotation.x = THREE.MathUtils.degToRad(-90);
    this.scene.add(light);

    const helper = new RectAreaLightHelper(light);
    light.add(helper);
    //*/

    // HDR Image를 이용한 광원
    /*
    new RGBELoader()
      .load("./hayloft_2k.hdr", (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        this.scene.environment = texture;
        this.scene.background = texture;

        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.4;

      }
    );
    //*/
  }

  private setupModels() {
    const axisHelper = new THREE.AxesHelper(10)
    this.scene.add(axisHelper)

    const geomGround = new THREE.PlaneGeometry(5, 5)
    const matGround = new THREE.MeshStandardMaterial(
      { color: "#2c3e50", roughness: 0.5, metalness: 0.5, side: THREE.DoubleSide })
    const ground = new THREE.Mesh(geomGround, matGround)
    ground.rotation.x = -THREE.MathUtils.degToRad(90)
    ground.position.y = -.5;
    this.scene.add(ground);

    const geomBigSphere = new THREE.SphereGeometry(1, 32, 16, 0,
      THREE.MathUtils.degToRad(360), 0, THREE.MathUtils.degToRad(90));
    const matBigSphere = new THREE.MeshStandardMaterial(
      { color: "#ffffff", roughness: 0.1, metalness: 0.2 });
    const bigSphere = new THREE.Mesh(geomBigSphere, matBigSphere);
    bigSphere.position.y = -0.5;
    this.scene.add(bigSphere);

    const geomSmallSphere = new THREE.SphereGeometry(0.2);
    const matSmallSphere = new THREE.MeshStandardMaterial(
      { color: "#e74c3c", roughness: 0.2, metalness: 0.5 });
    const smallSphere = new THREE.Mesh(geomSmallSphere, matSmallSphere);

    const smallSpherePivot = new THREE.Object3D();
    smallSpherePivot.add(smallSphere);
    bigSphere.add(smallSpherePivot);
    smallSphere.position.x = 2;
    smallSpherePivot.rotation.y = THREE.MathUtils.degToRad(-45)
    smallSpherePivot.position.y = 0.5;
    smallSpherePivot.name = "smallSpherePivot";

    const cntItems = 8;
    const geomTorus = new THREE.TorusGeometry(0.3, 0.1);
    const matTorus = new THREE.MeshStandardMaterial(
      { color: "#9b59b6", roughness: 0.5, metalness: 0.9 });
    for (let i = 0; i < cntItems; i++) {
      const torus = new THREE.Mesh(geomTorus, matTorus);
      const torusPivot = new THREE.Object3D();

      bigSphere.add(torusPivot);
      torus.position.x = 2;
      torusPivot.position.y = 0.5;
      torusPivot.rotation.y = THREE.MathUtils.degToRad(360) / cntItems * i;
      torusPivot.add(torus);
    }
  }

  private setupEvents() {
    window.onresize = this.resize.bind(this)
    this.resize()
    this.renderer.setAnimationLoop(this.render.bind(this))
  }

  private resize() {
    const domApp = this.domApp
    const width = domApp.clientWidth
    const height = domApp.clientHeight

    const camera = this.camera
    if (camera) {
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    this.renderer.setSize(width, height)
  }

  private update(time: number) {
    time *= 0.001 // ms -> s

    const smallSpherePivot = this.scene.getObjectByName("smallSpherePivot");
    if (smallSpherePivot) {
      // smallSpherePivot.rotation.y = time;   
      const euler = new THREE.Euler(0, time, 0);
      const quaterion = new THREE.Quaternion().setFromEuler(euler);
      smallSpherePivot.setRotationFromQuaternion(quaterion);
      //smallSpherePivot.quaternion.setFromEuler(euler);

      // 회전하며 움직이는 빨간색 작은 구
      const smallSphere = smallSpherePivot.children[0];

      // 광원이 DirectionalLight일 경우
      if(this.light! instanceof THREE.DirectionalLight) {
        smallSphere.getWorldPosition(this.light!.target.position);
        this.helper!.update();
      }

      // 광원이 PointLight일 경우
      if(this.light! instanceof THREE.PointLight) {
        smallSphere.getWorldPosition(this.light!.position);
        this.helper!.update();
      }

      // 광원이 SpotLight 경우
      if(this.light! instanceof THREE.SpotLight) {
        smallSphere.getWorldPosition(this.light!.target.position);
        this.helper!.update();  
      }
    }
  }

  private render(time: number) {
    this.update(time)
    this.renderer.render(this.scene, this.camera!)
  }
}

new App()