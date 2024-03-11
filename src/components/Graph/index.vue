<template>
  <div class="btn">
    <a-button type="primary" @click="save">保存</a-button>
    <a-button type="primary" @click="exportPng">导出png</a-button>
  </div>
  <div class="app">
    <div class="app-stencil" id="stencilContainer" ref="stencilContainer"></div>
    <div class="app-content" id="container" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Graph, Shape } from '@antv/x6'
import { Stencil } from '@antv/x6-plugin-stencil'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Selection } from '@antv/x6-plugin-selection'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { History } from '@antv/x6-plugin-history'
import { Export } from '@antv/x6-plugin-export'
const dataShapes = [
  {
    shape: 'custom-rect',
    label: '开始',
    attrs: {
      body: {
        rx: 20,
        ry: 26
      }
    }
  },
  {
    shape: 'custom-rect',
    label: '过程'
  },
  {
    shape: 'custom-rect',
    attrs: {
      body: {
        rx: 6,
        ry: 6
      }
    },
    label: '可选过程'
  },
  {
    shape: 'custom-polygon',
    attrs: {
      body: {
        refPoints: '0,10 10,0 20,10 10,20'
      }
    },
    label: '决策'
  },
  {
    shape: 'custom-polygon',
    attrs: {
      body: {
        refPoints: '10,0 40,0 30,20 0,20'
      }
    },
    label: '数据'
  },
  {
    shape: 'custom-circle',
    label: '连接'
  }
]
const imageShapes = [
  {
    label: 'Client',
    image: 'https://gw.alipayobjects.com/zos/bmw-prod/687b6cb9-4b97-42a6-96d0-34b3099133ac.svg'
  },
  {
    label: 'Http',
    image: 'https://gw.alipayobjects.com/zos/bmw-prod/dc1ced06-417d-466f-927b-b4a4d3265791.svg'
  },
  {
    label: 'Api',
    image: 'https://gw.alipayobjects.com/zos/bmw-prod/c55d7ae1-8d20-4585-bd8f-ca23653a4489.svg'
  },
  {
    label: 'Sql',
    image: 'https://gw.alipayobjects.com/zos/bmw-prod/6eb71764-18ed-4149-b868-53ad1542c405.svg'
  },
  {
    label: 'Clound',
    image: 'https://gw.alipayobjects.com/zos/bmw-prod/c36fe7cb-dc24-4854-aeb5-88d8dc36d52e.svg'
  },
  {
    label: 'Mq',
    image: 'https://gw.alipayobjects.com/zos/bmw-prod/2010ac9f-40e7-49d4-8c4a-4fcf2f83033b.svg'
  }
]
// #region 初始化图形
const ports = {
  groups: {
    top: {
      position: 'top',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden'
          }
        }
      }
    },
    right: {
      position: 'right',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden'
          }
        }
      }
    },
    bottom: {
      position: 'bottom',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden'
          }
        }
      }
    },
    left: {
      position: 'left',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden'
          }
        }
      }
    }
  },
  items: [
    {
      group: 'top'
    },
    {
      group: 'right'
    },
    {
      group: 'bottom'
    },
    {
      group: 'left'
    }
  ]
}
let graph: Graph
// 键盘事件
const keyboradEvent = () => {
  graph.bindKey(['meta+c', 'ctrl+c'], () => {
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.copy(cells)
    }
    return false
  })
  graph.bindKey(['meta+x', 'ctrl+x'], () => {
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.cut(cells)
    }
    return false
  })
  graph.bindKey(['meta+v', 'ctrl+v'], () => {
    if (!graph.isClipboardEmpty()) {
      const cells = graph.paste({ offset: 32 })
      graph.cleanSelection()
      graph.select(cells)
    }
    return false
  })

  // undo redo
  graph.bindKey(['meta+z', 'ctrl+z'], () => {
    if (graph.canUndo()) {
      graph.undo()
    }
    return false
  })
  graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
    if (graph.canRedo()) {
      graph.redo()
    }
    return false
  })

  // select all
  graph.bindKey(['meta+a', 'ctrl+a'], () => {
    const nodes = graph.getNodes()
    if (nodes) {
      graph.select(nodes)
    }
  })

  // delete
  graph.bindKey('backspace', () => {
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.removeCells(cells)
    }
  })

  // zoom
  graph.bindKey(['ctrl+1', 'meta+1'], () => {
    const zoom = graph.zoom()
    if (zoom < 1.5) {
      graph.zoom(0.1)
    }
  })
  graph.bindKey(['ctrl+2', 'meta+2'], () => {
    const zoom = graph.zoom()
    if (zoom > 0.5) {
      graph.zoom(-0.1)
    }
  })
}
// 注册节点类型
const registerNode = () => {
  Graph.registerNode(
    'custom-rect',
    {
      inherit: 'rect',
      width: 66,
      height: 36,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#5F95FF',
          fill: '#EFF4FF'
        },
        text: {
          fontSize: 12,
          fill: '#262626'
        }
      },
      ports: { ...ports }
    },
    true
  )

  Graph.registerNode(
    'custom-polygon',
    {
      inherit: 'polygon',
      width: 66,
      height: 36,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#5F95FF',
          fill: '#EFF4FF'
        },
        text: {
          fontSize: 12,
          fill: '#262626'
        }
      },
      ports: {
        ...ports,
        items: [
          {
            group: 'top'
          },
          {
            group: 'bottom'
          }
        ]
      }
    },
    true
  )

  Graph.registerNode(
    'custom-circle',
    {
      inherit: 'circle',
      width: 45,
      height: 45,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#5F95FF',
          fill: '#EFF4FF'
        },
        text: {
          fontSize: 12,
          fill: '#262626'
        }
      },
      ports: { ...ports }
    },
    true
  )

  Graph.registerNode(
    'custom-image',
    {
      inherit: 'rect',
      width: 52,
      height: 52,
      markup: [
        {
          tagName: 'rect',
          selector: 'body'
        },
        {
          tagName: 'image'
        },
        {
          tagName: 'text',
          selector: 'label'
        }
      ],
      attrs: {
        body: {
          stroke: '#5F95FF',
          fill: '#5F95FF'
        },
        image: {
          width: 26,
          height: 26,
          refX: 13,
          refY: 16
        },
        label: {
          refX: 3,
          refY: 2,
          textAnchor: 'left',
          textVerticalAnchor: 'top',
          fontSize: 12,
          fill: '#fff'
        }
      },
      ports: { ...ports }
    },
    true
  )
}
// 左侧节点
const stencilNode = () => {
  const stencilContainer = document.getElementById('stencilContainer')
  const stencil = new Stencil({
    title: '流程图',
    target: graph,
    search(cell, keyword) {
      return cell.shape.indexOf(keyword) !== -1
    },
    placeholder: '搜索图形名称',
    notFoundText: 'Not Found',
    collapsable: true,
    stencilGraphHeight: 0,
    groups: [
      {
        name: 'group1',
        title: '基础流程图'
      },
      {
        name: 'group2',
        title: '系统设计图'
      }
    ]
  })
  stencilContainer?.appendChild(stencil.container)
  const dataNodes = dataShapes.map((item) =>
    graph.createNode({
      shape: item.shape,
      label: item.label,
      attrs: item.attrs
    })
  )
  const imageNodes: any = imageShapes.map((item) =>
    graph?.createNode({
      shape: 'custom-image',
      label: item.label,
      attrs: {
        image: {
          'xlink:href': item.image
        }
      }
    })
  )
  stencil.load(dataNodes, 'group1')
  stencil.load(imageNodes, 'group2')
}
// 控制连接桩显示/隐藏
const addPorts = () => {
  const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
    for (let i = 0, len = ports.length; i < len; i += 1) {
      ports[i].style.visibility = show ? 'visible' : 'hidden'
    }
  }
  graph.on('node:mouseenter', () => {
    const container = document.getElementById('container')!
    const ports = container.querySelectorAll('.x6-port-body') as NodeListOf<SVGElement>
    showPorts(ports, true)
  })
  graph.on('node:mouseleave', () => {
    const container = document.getElementById('container')!
    const ports = container.querySelectorAll('.x6-port-body') as NodeListOf<SVGElement>
    showPorts(ports, false)
  })
}
const init = () => {
  graph = new Graph({
    container: document.getElementById('container') as HTMLElement,
    background: {
      color: '#F2F7FA'
    },
    grid: {
      visible: true,
      type: 'doubleMesh',
      args: [
        {
          color: '#eee', // 主网格线颜色
          thickness: 1 // 主网格线宽度
        },
        {
          color: '#ddd', // 次网格线颜色
          thickness: 1, // 次网格线宽度
          factor: 4 // 主次网格线间隔
        }
      ]
    },
    panning: {
      enabled: true,
      modifiers: 'ctrl'
    },
    mousewheel: {
      enabled: true,
      modifiers: 'Ctrl',
      maxScale: 4,
      minScale: 0.2
    },
    connecting: {
      router: {
        name: 'manhattan'
      },
      connector: {
        name: 'rounded',
        args: {
          radius: 8
        }
      },
      anchor: 'center',
      connectionPoint: 'anchor',
      allowBlank: false,
      snap: {
        radius: 20
      },
      createEdge() {
        return new Shape.Edge({
          attrs: {
            line: {
              stroke: '#A2B1C3',
              strokeWidth: 2,
              targetMarker: {
                name: 'block',
                width: 12,
                height: 8
              }
            }
          },
          zIndex: 0
        })
      },
      validateConnection({ targetMagnet }) {
        return !!targetMagnet
      }
    }
  })
  graph
    .use(
      new Snapline({
        enabled: true
      })
    )
    .use(
      new Selection({
        rubberband: true,
        showNodeSelectionBox: true
      })
    )
    .use(new Keyboard())
    .use(new Clipboard())
    .use(new History())
    .use(new Export())
  graph.centerContent()

  registerNode()
  keyboradEvent()
  stencilNode()
  addPorts()
}
const save = () => {
  const data = graph.toJSON()
  console.log(data)
}
const exportPng = () => {
  console.log('导出')
  graph.exportPNG('流程图', { width: 600, height: 600, backgroundColor: '#eee', padding: 20 })
}
onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.name {
  @include name;
}
.app {
  display: flex;
  width: 100%;
  height: calc(100vh - 250px);
  padding: 0;
  font-family: sans-serif;
  .app-stencil {
    position: relative;
    width: 200px;
    height: 100%;
    border: 1px solid #f0f0f0;
  }
  .app-content {
    flex: 1;
    height: 100%;
    margin-left: 8px;
    box-shadow: 0 12px 5px -10px rgb(0 0 0 / 10%), 0 0 4px 0 rgb(0 0 0 / 10%);
  }
}
.btn {
  margin-bottom: 10px;
  button {
    margin-right: 10px;
  }
}
</style>
