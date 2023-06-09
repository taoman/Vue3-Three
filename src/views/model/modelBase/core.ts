/*
 * @Descripttion: 初始化配置
 * @Author: taoman
 * @Date: 2023-05-31 15:14:31
 * @LastEditors: taoman
 * @LastEditTime: 2023-06-05 16:59:13
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
import Stats from 'three/examples/jsm/libs/stats.module';

export class ThreeBase {
  static initScene() {
    const scene = new THREE.Scene()
    return scene
  }

  static initCamera(element: HTMLElement) {
    const fov = 20
    const near = 0.1
    const far = 2000
    const aspect = element.offsetWidth / element.offsetHeight
    const camera = new THREE.PerspectiveCamera(fov,aspect, near, far )
    camera.position.set(0, 0, 0)
    return camera
  }
  static initCSSRender(element: HTMLElement) {
    const CSSRenderer = new CSS2DRenderer()
    CSSRenderer.setSize(element.offsetWidth, element.offsetHeight)
    CSSRenderer.domElement.style.position = 'absolute'
    CSSRenderer.domElement.style.top = '0px'
    element.appendChild(CSSRenderer.domElement)
    return CSSRenderer
  }

  static initRenderer(element: HTMLElement) {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    // 输出颜色空间
    renderer.outputColorSpace = THREE.SRGBColorSpace
    // renderer.outputEncoding = THREE.sRGBEncoding
    renderer.shadowMap.enabled = true
    renderer.setSize(element.offsetWidth, element.offsetHeight)
    renderer.localClippingEnabled = true
    element.appendChild(renderer.domElement)
    return renderer
  }

  static initControls(camera: THREE.Camera, domElement: HTMLElement) {
    const control = new OrbitControls(camera, domElement)
    control.target = new THREE.Vector3(0, 0, 0)
    // control.enableDamping = true;
    // control.dampingFactor = 0.3;
    // control.enableZoom = true;
    // control.autoRotate = true
    control.update()
    return control
  }
  
  static initStats(domElement: HTMLElement){
    const stats = new Stats()
    stats.showPanel(1)
    domElement.appendChild(stats.dom)
    return stats
  }
}
