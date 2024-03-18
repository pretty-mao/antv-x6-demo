<template>
  <el-container>
    <el-steps :active="1" simple>
      <el-step title="步骤 1" icon="el-icon-edit"></el-step>
      <el-step title="步骤 2" icon="el-icon-upload"></el-step>
      <el-step title="步骤 3" icon="el-icon-picture"></el-step>
    </el-steps>
    <el-main>
      <div class="warpper">
        <DagToolbar @helper="handleHelper" />
        <div class="flex">
          <DagSidar @drag="handleDrag" />
          <DagCanvas ref="dagRef" />
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { Graph } from '@antv/x6'
import DagCanvas from './comps/canvas/index.vue'
import DagSidar from './comps/sidar/index.vue'
import DagToolbar from './comps/toolbar/index.vue'
export default {
  name: 'App',
  components: {
    DagCanvas,
    DagSidar,
    DagToolbar
  },
  data() {
    return {
      item: {},
    }
  },
  mounted() {
  },
  methods: {
    handleHelper() {
      console.log('handleHelper')
    },
    handleDrag(item, e) {
      this.$refs.dagRef.addShape({
        x: e.clientX,
        y: e.clientY,
        ...item
      })
    }
  }
}
</script>

<style scoped>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

.el-container {
  height: 100%;
  width: 100%;
  flex-direction: column
}

.el-main {
  height: calc(100vh - 46px);
}

.warpper {
  display: flex;
  flex-direction: column;
}

.flex {
  display: flex;
}
</style>