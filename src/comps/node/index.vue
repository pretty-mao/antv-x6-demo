<template>
    <div class="node-warpper ">
        {{ node?.name || '过程' }}
    </div>
</template>

<script>
export default {
    name: 'node',
    inject: ['getNode'],
    data() {
        return {
            node: null
        }
    },
    mounted() {
        this.node = this.getNode()?.getData()
    }
}
</script>

<style scoped>
.node-warpper {
    height: 38px;
    width: 100px;
    background-color: #fff;
    padding: 4px;
    line-height: 40px;
    /* border-right: 1px solid #827a7a; */
    border-radius: 4px;
    /* box-shadow: 0 0 5px #827a7a; */
}
</style>