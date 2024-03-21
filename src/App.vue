<template>
  <el-container>
    <el-steps :active="1" simple>
      <el-step title="步骤 1" icon="el-icon-edit"></el-step>
      <el-step title="步骤 2" icon="el-icon-upload"></el-step>
      <el-step title="步骤 3" icon="el-icon-picture"></el-step>
    </el-steps>
    <el-main>
      <div class="warpper">
        <DagToolbar @helper="handleHelper" :ratio="ratio" />
        <DagCanvas
          ref="dagRef"
          @drop="handleDrop"
          @node="handleNode"
          @edge="handleEdge"
          @changeratio="changeratio"
        />
      </div>

      <Dialog ref="dialog" />
      <Drawer ref="drawer" />
    </el-main>
  </el-container>
</template>

<script>
import { Graph } from "@antv/x6";
import DagCanvas from "./comps/canvas/index.vue";
import DagToolbar from "./comps/toolbar/index.vue";
import { register } from "@antv/x6-vue-shape";
import Dialog from "./comps/dialog/index.vue";
import Drawer from "./comps/drawer/index.vue";

export default {
  name: "App",
  provide() {
    return {
      getGraph: () => this.$refs.dagRef.getGraph(),
    };
  },
  components: {
    DagCanvas,
    DagToolbar,
    Dialog,
    Drawer,
  },
  data() {
    return {
      item: {},
      ratio: "100%",
    };
  },
  mounted() {},
  methods: {
    handleHelper(val) {
      console.log("头部事件", val);
      if (val === "zoom") {
        this.$refs.dagRef.zoomOut();
      } else if (val === "large") {
        this.$refs.dagRef.amplification();
      } else if (val === "direction") {
        this.$refs.dagRef.direction();
      } else if (val === "save") {
        this.$refs.dagRef.save();
      } else {
        this.$refs.dagRef.center();
      }
    },
    handleDrop(e) {
      e.stopPropagation();
      e.preventDefault();
      this.$refs.dagRef.addShape(e, this.item);
    },
    handleDragStart(item, e) {
      this.item = {
        x: e.clientX,
        y: e.clientY,
        ...item,
      };
    },
    handleNode(node) {
      console.log(node);
      this.$refs.drawer.open(node);
    },
    handleEdge(edge) {
      console.log(edge);
      this.$refs.dialog.open(edge);
    },
    changeratio(val) {
      this.ratio = val;
    },
  },
};
</script>

<style scoped>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

.el-container {
  height: 100%;
  width: 100%;
  flex-direction: column;
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
