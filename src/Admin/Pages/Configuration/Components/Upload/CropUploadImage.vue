<template>
  <div>
    <div class="controls-bg">
      <div class="control-icon">
        <img
          src="@/assets/icons/flip-horizontal.svg"
          @click="flip(true, false)"
        />
        <img
          src="@/assets/icons/flip-vertical.svg"
          @click="flip(false, true)"
        />
        <img src="@/assets/icons/rotate-clockwise.svg" @click="rotate(90)" />
        <img
          src="@/assets/icons/rotate-counter-clockwise.svg"
          @click="rotate(-90)"
        />
        <img src="@/assets/icons/zoom-in.svg" @click="zoom(1.05)" />
        <img src="@/assets/icons/zoom-out.svg" @click="zoom(0.95)" />
      </div>
      <div style="text-align: right">
        <v-btn @click="upload" :disabled="imageloading"
          ><b-spinner small v-if="imageloading"></b-spinner>Upload</v-btn
        >
        <v-btn @click="closecropper">Close</v-btn>
      </div>
    </div>
    <div style="text-align: center" v-if="editloading">
      <b-spinner small>Loading please wait..</b-spinner>
    </div>
    <cropper
      ref="cropper"
      class="cropper"
      :src="sourceimage"
      :stencil-size="{
        width: this.resizewidth,
        height: this.resizeheight,
      }"
      :stencil-props="{
        movable: false,
        resizable: false,
      }"
      image-restriction="none"
      @change="change"
      crossOrigin="anonymous"
    ></cropper>
  </div>
</template>

<script>
//import PageTitle from "../../Layout/Components/PageTitle.vue";

import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

export default {
  components: {
    Cropper,
  },
  props: [
    "sourceimage",
    "folder",
    "filename",
    "extension",
    "resizewidth",
    "resizeheight",
    "editmode",
    "editImageUrl",
  ],
  data: () => ({
    imageloading: false,
    editloading: false,
  }),

  created() {
    if (this.editmode) {
      this.editloading = true;
      return axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "imageUrlBase64", {
          url: this.editImageUrl,
        })
        .then((res) => {
          this.editloading = false;
          this.$emit("onUpdateSource", res.data.imagedata);
          //this.sourceimage = res.data.imagedata;
        })
        .catch((err) => {
          this.editloading = false;
          console.log("this error -> " + err);
        });
    }
  },

  methods: {
    flip(x, y) {
      this.$refs.cropper.flip(x, y);
    },
    rotate(angle) {
      this.$refs.cropper.rotate(angle);
    },
    zoom(factor) {
      this.$refs.cropper.zoom(factor);
    },

    crop() {
      const { coordinates, canvas } = this.$refs.cropper.getResult();
      this.coordinates = coordinates;
      // You able to do different manipulations at a canvas
      // but there we just get a cropped image, that can be used
      // as src for <img/> to preview result
      this.image = canvas.toDataURL();
    },

    change({ coordinates, canvas }) {
      console.log(coordinates, canvas);
    },

    closecropper() {
      this.$emit("onCropperClose");
    },

    onUpdateSource(storedImage) {
      //this.image = storedImage;
      this.sourceimage = storedImage;
    },

    upload() {
      this.crop();
      //var imagedata = this.result.canvas;
      this.imageloading = true;
      this.message = "";
      return axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "imageupload", {
          image: this.image,
          folder: this.folder,
          filename: this.filename,
          extension: this.extension,
          width: this.resizewidth,
          height: this.resizeheight,
        })
        .then((res) => {
          console.log(res.data);
          this.imageloading = false;
          if (res.data.status == "S") {
            this.message = res.data.message;
            // this.flashMessage.success({
            //   message: this.message,
            //   time: 4000,
            //   blockClass: "custom-block-class",
            // });
            console.log(res.data);
            this.fileurl = res.data.filepath;
            // this.$emit("onUploadComplete", res.data.filepath);
            this.$emit("onUploadComplete", this.fileurl);
          } else {
            this.flashMessage.error({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          this.imageloading = false;
          alert("Unable to upload file, try later");
          console.log("this error -> " + err);
        });
    },
  },
};
</script>
<style scoped>
.cropper {
  height: 600px;
  background: #ddd;
}
.controls-bg {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #0b0b0bb5;
}
.control-icon > img {
  color: white;
  font-size: 23px;
  font-weight: 700;
  padding: 10px 24px;
  background: #000000c2;
  border-radius: 14px;
}
</style>
