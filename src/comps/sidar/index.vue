<template>
    <div class="soder-warpper">
        <div v-for="item in items" :key="item.name" draggable="true" class="item"
            @dragstart="(e) => handleDrag(item, e)">
            {{
            item.name }}</div>
    </div>
</template>

<script>
export default {
    name: 'sidar',
    data() {
        return {
            items: [
                { name: '开始', type: 'start' },
                { name: '结束', type: 'end' },
                { name: '环节', type: 'approval' },
            ],
        }
    },
    methods: {
        handleDrag(item, e) {
            this.$emit('dragStart', item, e)
        }
    }
}
</script>

<style scoped>
.soder-warpper {
    height: calc(100vh - 200px);
    width: 100px;
    flex-shrink: 0;
    background-color: #fff;
    padding: 10px;
    border-right: 1px solid #eee;
}

.item {
    height: 40px;
    cursor: pointer;
    padding: 1px 15px;
    border: 1px solid #eee;
    border-radius: 5px;
    line-height: 40px;
}
</style>