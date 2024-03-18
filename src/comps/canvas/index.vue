<template>
    <div class="container" ref="container" @drag="handleDrag" @dragenter.prevent @dragover.prevent @dragleave.prevent>
        <div ref="paper" class="paper"></div>
        <div ref="minimap" class="minimap"></div>
    </div>
</template>

<script>
import { Graph } from '@antv/x6'
import { uuid } from '../../util'
export default {
    name: 'canvas',
    props: {
    },
    data() {
        return {
            graph: null
        }
    },
    methods: {
        handleDrag(e) {
            this.$emit('drag', e)
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
        },
        // 新增节点
        addShape(item) {
            const { x, y } = this.graph.clientToLocal(item.x, item.y)
            const id = uuid(String(new Date().getTime()))
            const nodeSjape = {
                id,
                zIndex: 1,
                data: {
                    id,
                    name: item.name,
                    type: item.type,
                    x,
                    y,
                }
            }
            this.graph.addNode(nodeSjape)
        },

    },
    mounted() {
        this.initGraph()
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
</style>