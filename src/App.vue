<template>
  <el-container>
    <el-steps :active="1" simple>
      <el-step title="步骤 1" icon="el-icon-edit"></el-step>
      <el-step title="步骤 2" icon="el-icon-upload"></el-step>
      <el-step title="步骤 3" icon="el-icon-picture"></el-step>
    </el-steps>
    {{ distance }}
    <el-button @click="getArea()">打卡距离</el-button>
    <el-main>
      <div class="warpper">
        <DagToolbar @helper="handleHelper" :ratio="ratio" />
        <DagCanvas ref="dagRef" @drop="handleDrop" @node="handleNode" @edge="handleEdge" @changeratio="changeratio" />
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
import { getPreciseDistance } from "geolib";
// import * as Location from "expo-location";
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
      options: {
        enableHighAccuracy: true,
      },
      // 打卡位置
      // location: {
      //   longitude: 113.748742,
      //   latitude: 23.025777,
      // },
      // 打印的位置  0距离
      location: {
        longitude: 113.7374204,
        latitude: 23.0218748,
      },
      distance: 1.11,
    };
  },
  mounted() {
    this.getArea();
  },
  methods: {
    getArea() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            alert("打卡距离11", this.distance);
            var longitude = position.coords.longitude;
            var latitude = position.coords.latitude;
            console.log("Longitude纬度 is: " + longitude);
            console.log("Latitude经度 is: " + latitude);

            // 这里可以添加其他逻辑，以下是判断是否在打卡范围内
            // var distance = getPreciseDistance(this.location, arr);
            this.distance = getPreciseDistance(
              { latitude: 23.025777, longitude: 113.748742 },
              {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              }
            );
            console.log(this.distance, "距离");
            window.alert("距离" + this.distance + "米");

            // if (distance < 500) {
            //   console.log("在500m以内");
            // } else {
            //   console.log("超过500m");
            // }
          },
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              console.error("用户拒绝了地理位置权限");
              alert('记得开手机定位权限啊')
            } else {
              alert("错误", error.message);
              console.error("Error Code = " + error.code + " - " + error.message);
            }
          },
          this.options
        );
      } else {
        alert("不支持获取位置");
        this.$message.error("不支持获取位置");
      }
    },
    getDistance(lat1, lon1, lat2, lon2) {
      var R = 6371; // 地球半径，单位为公里
      // var dLat = this.deg2rad(lat2 - lat1);
      // var dLon = this.deg2rad(lon2 - lon1);
      // Math.sin数字的正弦值  Math.cos数字的正弦值  Math.sqrt平方根
      // var a =
      //   Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      //   Math.cos(this.deg2rad(lat1)) *
      //     Math.cos(this.deg2rad(lat2)) *
      //     Math.sin(dLon / 2) *
      //     Math.sin(dLon / 2);
      // var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      // var d = R * c; // 距离，单位为公里
      var radLat1 = (lat1 * Math.PI) / 180.0;
      var radLat2 = (lat2 * Math.PI) / 180.0;
      var a = radLat1 - radLat2;
      var b = (lon1 * Math.PI) / 180.0 - (lon2 * Math.PI) / 180.0;
      var s =
        2 *
        Math.asin(
          Math.sqrt(
            Math.pow(Math.sin(a / 2), 2) +
            Math.cos(radLat1) *
            Math.cos(radLat2) *
            Math.pow(Math.sin(b / 2), 2)
          )
        );
      s = s * 6378.137;

      return s.toFixed(2);
    },
    // deg2rad(deg) {
    //   // 角度转换成弧度
    //   // Math.PI圆周率
    //   return deg * (Math.PI / 180);
    // },
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
