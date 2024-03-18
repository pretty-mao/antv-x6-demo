<template>
    <div class="toolbar-warpper">
        <!-- 放大 缩小 -->
        <el-button icon="el-icon-question" plain size="mini" @click="handleHelper"></el-button>
    </div>
</template>

<script>
export default {
    mame: 'toolbar',
    data() {
        return {
            // ...
        }
    },
    methods: {
        handleHelper() {
            this.$emit('helper')
        }
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