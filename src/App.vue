<template>
  <div ref="container"></div>
</template>

<script>
import { Graph } from '@antv/x6'

export default {
  name: 'App',
  mounted() {
    const graph = new Graph({
      container: this.$refs.container,
      grid: true
    })

    graph.addNode({
      x: 80,
      y: 80,
      width: 100,
      height: 40,
      label: 'Hello',
    })

    graph.addNode({
      x: 240,
      y: 240,
      width: 100,
      height: 40,
      label: 'X6',
    })
  }
}
</script>

<style scoped>
div {
  width: 800px;
  height: 600px;
  background-color: #f5f5f5;
}
</style>