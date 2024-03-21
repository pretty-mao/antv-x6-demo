<template>
    <div class="toolbar-warpper">
        <!-- 放大 缩小 -->
        <el-button icon="el-icon-question" plain size="mini" @click="handleHelper"></el-button>

        <el-button icon="el-icon-question" plain size="mini" @click="handleFormat">handleFormat</el-button>
    </div>
</template>

<script>
import { formatLayout } from '../canvas/layout'

export default {
    mame: 'toolbar',
    inject: ['getGraph'],
    data() {
        return {
            rankdir: 'TB',
        }
    },
    methods: {
        handleHelper() {
            this.$emit('helper')
        },
        handleFormat() {
            const graph = this.getGraph()
            this.rankdir = formatLayout(graph, this.rankdir === 'TB' ? 'LR' : 'TB')
        },
    }
}
</script>

<style scoped>
.toolbar-warpper {
    height: 28px;
    width: 100%;
    background-color: #f0f0f0;
    display: flex;
}

.el-button {
    padding: 7px;
    display: flex;
    align-items: center;
}
</style>