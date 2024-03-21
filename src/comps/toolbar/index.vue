<template>
  <div class="toolbar-warpper">
    <!-- 这里放 --放大 缩小 -->
    <div class="zoom">
      <i class="el-icon-remove" @click="handleHelper('zoom')"></i>
      <span style="padding: 0 10px; font-size: 12px">{{ ratio }}</span>
      <i class="el-icon-circle-plus" @click="handleHelper('large')"></i>
    </div>
    <div class="toolbar-warpper">
      <!-- 放大 缩小 -->
      <el-button
        icon="el-icon-question"
        plain
        size="mini"
        @click="handleHelper"
      ></el-button>

      <el-button icon="el-icon-question" plain size="mini" @click="handleFormat"
        >handleFormat</el-button
      >
    </div>
    <el-button @click="handleHelper('center')">复位</el-button>
    <el-button @click="handleHelper('direction')">切换方向</el-button>
    <el-button @click="handleHelper('save')">保存</el-button>
    <el-button
      icon="el-icon-question"
      plain
      size="mini"
      @click="handleHelper('center')"
    ></el-button>
  </div>
</template>

<script>
import { formatLayout } from "../canvas/layout";

export default {
  mame: "toolbar",
  data() {
    return {
      // ...
      rankdir: "TB",
    };
  },
  props: {
    ratio: {
      type: String,
      default: "100%",
    },
  },
  mame: "toolbar",
  inject: ["getGraph"],

  methods: {
    handleHelper(val) {
      this.$emit("helper", val);
    },
    handleFormat() {
      const graph = this.getGraph();
      this.rankdir = formatLayout(graph, this.rankdir === "TB" ? "LR" : "TB");
    },
  },
};
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
.zoom {
  padding: 7px;
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
  i {
    font-size: 12px;
    &:hover {
      color: blue;
      opacity: 0.8;
    }
  }
}
</style>
