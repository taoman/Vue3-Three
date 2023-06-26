/*
 * @Descripttion: 输出实例
 * @Author: taoman
 * @Date: 2023-05-31 14:31:33
 * @LastEditors: taoman
 * @LastEditTime: 2023-06-26 10:46:29
 */
import * as THREE from 'three'
import { onMounted, ref, shallowRef } from 'vue'
import { debounce, forEach } from 'lodash'
import { useThree } from './utils'
import { v4 as uuid } from 'uuid'
const MODERL_SCALES = <const>[0.0001 * 3, 0.0001 * 3, 0.0001 * 3]
const isDev = process.env.NODE_ENV === 'development'
const MODEL_URL = <const>{
  SKELETON: isDev ? '/models/turbine.glb' : '/Vue3-Three/models/turbine.glb',
  PLANE: isDev ? '/models/plane.glb' : '/Vue3-Three/models/plane.glb',
  EQUIPMENT: isDev ? '/models/equipment.glb' : '/Vue3-Three/models/equipment.glb'
}
const MODEL_SKELETON_ENUM = <const>{
  WireframeMaterial: '线框材质',
  ColorMaterial: '颜色材质'
}
export function useTurbine() {
  const loading = ref(false)
  const turbine = new THREE.Group()
  const modelSkeleton = shallowRef<THREE.Object3D>()
  const modelPlane = shallowRef<THREE.Object3D>()
  const modelEquipment = shallowRef<THREE.Object3D>()

  const {
    container,
    scene,
    statsRef,
    camera,
    control,
    renderMixins,
    loadModels,
    loadGLTF,
    loadAnimate,
    render
  } = useThree()

  const loadLights = () => {
    const LIGHT_LIST = [
      [100, 100, 100],
      [-100, 100, 100],
      [100, -100, 100],
      [100, 100, -100]
    ]
    forEach(LIGHT_LIST, ([x, y, z]: number[]) => {
      const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
      directionalLight.position.set(x, y, z)
      scene.value?.add(directionalLight)
    })
  }
  const loadTurbineSkeleton = async () => {
    const { scene: object, animations } = await loadGLTF(MODEL_URL.SKELETON)
    object.scale.set(...MODERL_SCALES)
    object.position.set(0, 0, 0)
    loadAnimate(object, animations, animations[0].name)
    object.name = 'skeleton'
    modelSkeleton.value = object
    turbine.add(object)
  }
  const loadTurbinPlane = async () => {
    const { scene: object } = await loadGLTF(MODEL_URL.PLANE)
    object.scale.set(...MODERL_SCALES)
    object.position.set(0, 0, 0)
    object.name = 'plane'
    modelPlane.value = object
    turbine.add(object)
  }
  const loadTurbinEquipments = async () => {
    const { scene: object } = await loadGLTF(MODEL_URL.EQUIPMENT)
    object.scale.set(...MODERL_SCALES)
    object.name = 'equipment'
    modelEquipment.value = object
    turbine.add(object)
  }
  // 风机骨架消隐动画
  const skeletonAnimation = () => {
    const shellModel = modelSkeleton.value?.getObjectByName(MODEL_SKELETON_ENUM.ColorMaterial)
    const clippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 3.5)
    shellModel?.traverse((mesh) => {
      if (!(mesh instanceof THREE.Mesh)) return undefined
      mesh.material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 1,
        roughness: 0.7
      })
      mesh.material.clippingPlanes = [clippingPlane]
      return undefined
    })
    const uid = uuid()
    renderMixins.set(uid, () => {
      if (clippingPlane.constant <= -0.1) {
        modelSkeleton.value?.remove(shellModel!)
        renderMixins.delete(uid)
      }
      clippingPlane.constant -= 0.01
    })
  }
  // 风机平台动画
  const planeAnimation = () => {
    // @ts-ignore
    const texture = modelPlane.value.children[0].material.map
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    const uid = uuid()
    renderMixins.set(uid, () => {
      const count = texture.repeat.y
      if (count <= 10) {
        texture.repeat.x += 0.01
        texture.repeat.y += 0.02
      } else {
        texture.repeat.x = 0
        texture.repeat.y = 0
      }
    })
  }
  onMounted(async () => {
    // const axes =new THREE.AxesHelper(10)

    loading.value = true
    // scene.value?.add(axes)
    scene.value?.add(turbine)
    camera.value?.position.set(-8, 10, 10)
    control.value?.target.set(0, 2.6, 0)
    control.value?.update()

    loadLights()
    await loadModels([loadTurbineSkeleton(), loadTurbinPlane(), loadTurbinEquipments()])
    loading.value = false
    render()
    planeAnimation()
    skeletonAnimation()
  })
  return { container, scene, statsRef, turbine, loading }
}
