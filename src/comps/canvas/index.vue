<template>
    <div class="container" ref="container">
        <div ref="sider" id="stencil"></div>
        <div ref="paper" class="paper"></div>
    </div>
</template>

<script>
import { Graph, Shape } from '@antv/x6';
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { History } from '@antv/x6-plugin-history';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { portsGroups } from './config.js'
import { debounce, uniqueId } from "lodash";
import { Stencil } from '@antv/x6-plugin-stencil'

export default {
    name: 'canvas',
    props: {
    },
    emits: ['node', 'edge'],
    data() {
        return {
            graph: null,
            stencil: null,
        }
    },
    methods: {
        // init
        initGraph() {
            this.graph = new Graph({
                container: this.$refs.paper,
                grid: true,
                mousewheel: {
                    enabled: true,
                    zoomAtMousePosition: true,
                    modifiers: 'ctrl',
                    minScale: 0.5,
                    maxScale: 3,
                },
                connecting: {
                    router: 'manhattan',
                    allowBlank: false,
                    allowLoop: false,
                    allowNode: false,
                    snap: true,
                    connector: {
                        name: 'rounded',
                        args: {
                            radius: 8,
                        },
                    },
                    anchor: 'center',
                    connectionPoint: 'anchor',
                    allowBlank: false,
                    snap: {
                        radius: 20,
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
                                        height: 8,

                                    },
                                },
                            },
                            zIndex: 0,
                            label: 'edge',
                        })
                    },
                    validateConnection({ targetMagnet }) {
                        return !!targetMagnet
                    },
                },
                highlighting: {
                    magnetAdsorbed: {
                        name: 'stroke',
                        args: {
                            attrs: {
                                fill: '#5F95FF',
                                stroke: '#5F95FF',
                            },
                        },
                    },
                },
            })

            this.graph
                .use(
                    new Selection({
                        rubberband: true,
                        showNodeSelectionBox: true,
                    }),
                )
                .use(new Snapline())
                .use(new Keyboard())
                .use(new Clipboard())
                .use(new History())

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
                                    visibility: 'hidden',
                                },
                            },
                        },
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
                                    visibility: 'hidden',
                                },
                            },
                        },
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
                                    visibility: 'hidden',
                                },
                            },
                        },
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
                                    visibility: 'hidden',
                                },
                            },
                        },
                    },
                },
                items: [
                    {
                        group: 'top',
                    },

                    {
                        group: 'bottom',
                    },
                ],
            }

            Graph.registerNode(
                'rect',
                {
                    inherit: 'rect',
                    width: 66,
                    height: 36,
                    attrs: {
                        body: {
                            strokeWidth: 1,
                            stroke: '#5F95FF',
                            fill: '#EFF4FF',
                        },
                        text: {
                            fontSize: 12,
                            fill: '#262626',
                        },
                    },
                    ports,
                },
                true,
            )

            Graph.registerNode(
                'circle',
                {
                    inherit: 'circle',
                    width: 45,
                    height: 45,
                    attrs: {
                        body: {
                            strokeWidth: 1,
                            stroke: '#5F95FF',
                            fill: '#EFF4FF',
                        },
                        text: {
                            fontSize: 12,
                            fill: '#262626',
                        },
                    },
                    ports: {

                    },
                },
                true,
            )
        },
        initResize() {
            const resizeHandler = debounce(() => {
                const w = this.$refs.container?.offsetWidth;
                const h = this.$refs.container?.offsetHeight;
                this.graph?.resize(w, h);
            }, 300);

            const observer = new ResizeObserver(entries => {
                for (let entry of entries) {
                    resizeHandler();
                }
            });
            observer.observe(this.$refs.container);
        },
        initevent() {
            const graph = this.graph
            const container = this.$refs.paper
            graph.on('node:dblclick', ({ node, e }) => {
                this.$emit('node', node, e)
            });

            this.graph.on('edge:dblclick', ({ edge, e }) => {
                this.$emit('edge', edge, e)
            });

            graph.on('node:contextmenu', ({ node, e }) => {
                e.preventDefault(); // 阻止浏览器默认的右键菜单

                // 创建并显示你的自定义菜单
                let menu = document.createElement('ul');
                menu.style.position = 'absolute';
                menu.style.listStyle = 'none';
                menu.style.padding = '4px';
                menu.style.backgroundColor = 'white';
                menu.style.border = '1px solid #ccc';
                menu.style.borderRadius = '5px';
                menu.style.cursor = 'pointer';
                menu.style.height = '16px';
                menu.style.width = '48px';
                menu.style.lineHeight = '16px';

                let item = document.createElement('li');
                item.innerText = '删除';
                item.onclick = () => {
                    console.log('Custom menu item clicked');
                };
                menu.appendChild(item);

                menu.style.left = `${e.clientX}px`;
                menu.style.top = `${e.clientY}px`;

                document.body.appendChild(menu);

                // 当点击其他地方时移除菜单
                document.addEventListener('click', () => {
                    document.body.removeChild(menu);
                }, { once: true });
            });

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

            const showPorts = (ports, show) => {
                for (let i = 0, len = ports.length; i < len; i += 1) {
                    ports[i].style.visibility = show ? 'visible' : 'hidden'
                }
            }
            graph.on('node:mouseenter', () => {
                const ports = container.querySelectorAll(
                    '.x6-port-body',
                )
                showPorts(ports, true)
            })
            graph.on('node:mouseleave', () => {
                const ports = container.querySelectorAll(
                    '.x6-port-body',
                )
                showPorts(ports, false)
            })
        },
        initStencil() {
            this.stencil = new Stencil({
                title: '流程图',
                target: this.graph,
                stencilGraphWidth: 200,
                stencilGraphHeight: 180,
                layoutOptions: {
                    columns: 1,
                    columnWidth: 80,
                    rowHeight: 55,
                },
                groups: [
                    {
                        name: 'default',
                        title: '流程图',
                        graphHeight: 180,
                        layoutOptions: {
                            columns: 1,
                            columnWidth: 80,
                            rowHeight: 55,
                        },
                    }
                ]
            })

            const r1 = this.graph.createNode({
                shape: 'circle',
                label: '开始',
                attrs: {
                    body: {
                        rx: 20,
                        ry: 26,
                    },
                },
                ports: {
                    groups: portsGroups,
                    items: [
                        {
                            group: 'out',
                        },
                    ],
                }
            })
            const r2 = this.graph.createNode({
                shape: 'rect',
                label: '过程',
                attrs: {
                    body: {
                        rx: 20,
                        ry: 26,
                    },
                },
                ports: {
                    groups: portsGroups,
                    items: [
                        {
                            group: 'out',
                        },
                        {
                            group: 'in',
                        }
                    ],
                }
            })
            const r3 = this.graph.createNode({
                shape: 'circle',
                label: '结束',
                attrs: {
                    body: {
                        rx: 20,
                        ry: 26,
                    },
                },
                ports: {
                    groups: portsGroups,
                    items: [
                        {
                            group: 'in',
                        },
                    ],
                }
            })
            this.stencil.load([r1, r2, r3], 'default')
            document.getElementById('stencil').appendChild(this.stencil.container)
        },
    },
    mounted() {
        this.initGraph()
        this.initResize()
        this.initevent()
        this.initStencil()
    }
}
</script>

<style scoped>
.container {
    height: calc(100vh - 94px);
    width: 100%;
    display: flex;
}

.minimap {
    position: absolute;
    right: 20px;
    bottom: 60px;
    border: dashed 1px #e4e4e4;
}

.paper {
    height: 100%;
    width: 100%;

    :global {
        .x6-widget-selection-selected {
            .x6-widget-selection-inner {
                border: none;
                box-shadow: none;
            }
        }
    }
}

#container {
    display: flex;
    border: 1px solid #dfe3e8;
}

#stencil {
    width: 180px;
    height: 100%;
    position: relative;
    border-right: 1px solid #dfe3e8;
}
</style>