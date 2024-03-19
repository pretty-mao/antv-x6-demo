<template>
    <div class="container" ref="container" @drop="handleDrop" @dragenter.prevent @dragover.prevent @dragleave.prevent>
        <div ref="paper" class="paper"></div>
        <div ref="minimap" class="minimap"></div>
    </div>
</template>

<script>
import { Graph } from '@antv/x6';
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { History } from '@antv/x6-plugin-history';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
// import { Transform } from '@antv/x6-plugin-transform';
import { debounce, uniqueId } from "lodash";

export default {
    name: 'canvas',
    props: {
    },
    data() {
        return {
            graph: null,
        }
    },
    methods: {
        handleDrop(e) {
            this.$emit('drop', e)
        },
        // init
        initGraph() {
            this.graph = new Graph({
                container: this.$refs.paper,
                scroller: true,
                grid: {
                    size: 10,
                    visible: true
                },
                connecting: {
                    router: 'manhattan',
                    allowBlank: false,
                    allowLoop: false,
                    allowNode: false,
                    snap: true,
                },
                snapline: true,
                scaling: {
                    min: 0.2,
                    max: 2
                },
                autoResize: this.$refs.container,
                minimap: {
                    enabled: true,
                    width: 200,
                    height: 120,
                    container: this.$refs.minimap
                },
                selecting: {
                    enabled: true,
                    rubberband: true,
                    movable: true,
                    showEdgeSelectionBox: true,
                    showNodeSelectionBox: true
                },
                keyboard: {
                    enabled: true
                }
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
            this.graph.on('node:dblclick', ({ node, e }) => {
                // 在这里处理双击事件
                console.log('Node was double clicked:', node);
            });

            this.graph.on('node:contextmenu', ({ node, e }) => {
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

            const graph = this.graph

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
        },
        // 新增节点
        addShape(e, item) {
            const { x, y } = this.graph.clientToLocal(e.clientX, e.clientY)
            // 可以传入前缀 档期啊页面的id
            const id = uniqueId('123')

            const nodeSjape = {
                ...item,
                shape: 'custom',
                x: x - item.x,
                y: y - item.y,
                id,
                zIndex: 1,
                width: 100,
                height: 40,
                data: {
                    id,
                    name: item.name,
                    type: item.type,
                    x,
                    y,
                },

            }
            this.graph.addNode(nodeSjape)
            console.log('addShape', nodeSjape);
        },

    },
    mounted() {
        this.initGraph()
        this.initResize()
        this.initevent()
    }
}
</script>

<style scoped>
.container {
    width: calc(100% - 94px);
    width: 100%;
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

#graph-container {
    width: calc(100% - 180px);
    height: 100%;
}

.x6-widget-stencil {
    background-color: #fff;
}

.x6-widget-stencil-title {
    background-color: #fff;
}

.x6-widget-stencil-group-title {
    background-color: #fff !important;
}

.x6-widget-transform {
    margin: -1px 0 0 -1px;
    padding: 0px;
    border: 1px solid #239edd;
}

.x6-widget-transform>div {
    border: 1px solid #239edd;
}

.x6-widget-transform>div:hover {
    background-color: #3dafe4;
}

.x6-widget-transform-active-handle {
    background-color: #3dafe4;
}

.x6-widget-transform-resize {
    border-radius: 0;
}

.x6-widget-selection-inner {
    border: 1px solid #239edd;
}

.x6-widget-selection-box {
    opacity: 0;
}
</style>