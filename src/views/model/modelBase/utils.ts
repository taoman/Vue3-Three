/*
 * @Descripttion: 集成封装
 * @Author: taoman
 * @Date: 2023-05-31 15:06:14
 * @LastEditors: taoman
 * @LastEditTime: 2023-06-09 17:14:08
 */
import { onMounted, ref, shallowRef } from 'vue'
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import type { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { ThreeBase } from './core'
import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import Stats from 'three/examples/jsm/libs/stats.module';
import { isFunction } from 'lodash'
export function useThree() {
  const container = ref<HTMLElement>()
  const statsRef = ref<HTMLElement>()
  const stats = shallowRef<Stats>()
  const scene = shallowRef<THREE.Scene>()
  const camera = shallowRef<THREE.Camera>()
  const renderer = shallowRef<THREE.WebGLRenderer>()
  const CSSRenderer = shallowRef<CSS2DRenderer>()
  const control = shallowRef<OrbitControls>()
  const clock = new THREE.Clock()
  const mixers: any = []
  const renderMixins = new Map()
  onMounted(() => {
    const el = container.value!
    const statsEl = statsRef.value!
    scene.value = ThreeBase.initScene()
    camera.value = ThreeBase.initCamera(el)
    renderer.value = ThreeBase.initRenderer(el)
    CSSRenderer.value = ThreeBase.initCSSRender(el)
    control.value = ThreeBase.initControls(camera.value, CSSRenderer.value.domElement)
    stats.value = ThreeBase.initStats(statsEl)
  })
  const render = () => {
    // const delta = new THREE.Clock().getDelta()
    renderer.value?.render(scene.value!, camera.value!)
    const mixerUpdateDelta = clock.getDelta() 
    mixers.forEach((mixer:any) => mixer.update(mixerUpdateDelta))
    CSSRenderer.value!.render(scene.value!, camera.value!)
    renderMixins.forEach((mixin) => isFunction(mixin) && mixin())
    TWEEN.update()
    stats.value?.update()
    requestAnimationFrame(() => render())
  }
  const loadModels = async (tasks: Promise<any>[]) => {13319193696
    await Promise.all(tasks)
  }
  /**
   * @description: 加载模型
   * @param {string} 模型路径地址
   * @return {*}
   */
  const loadGLTF = (url: string): Promise<GLTF> => {
    const loader = new GLTFLoader()
    return new Promise<GLTF>((resolve) => {
      loader.load(url, (object: GLTF) => resolve(object))
    })
  }

  const loadAnimate = (
    mesh: THREE.Mesh | THREE.AnimationObjectGroup | THREE.Group,
    animations: Array<THREE.AnimationClip>,
    animationName: string
  ) => {
    const mixer = new THREE.AnimationMixer(mesh)
    const clip = THREE.AnimationClip.findByName(animations, animationName)
    if (!clip) return undefined
    const action = mixer.clipAction(clip)
    action.play()
    mixers.push(mixer)

    return undefined
  }

  return {
    container,
    scene,
    stats,
    statsRef,
    camera,
    renderer,
    CSSRenderer,
    control,
    renderMixins,
    render,
    loadModels,
    loadGLTF,
    loadAnimate
  }
}
