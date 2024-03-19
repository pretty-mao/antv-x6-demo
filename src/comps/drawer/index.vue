<template>
    <el-drawer title="我是标题" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
        <span>我来啦!</span>
    </el-drawer>

</template>

<script>
export default {
    data() {
        return {
            drawer: false,
            direction: 'rtl',
            data: {}
        };
    },
    methods: {
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => { });
        },
        open(data) {
            this.drawer = true
            this.data = data
        }
    }
}
</script>

<style scoped></style>