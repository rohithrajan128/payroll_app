<template>
  <div>
    <v-dialog v-model="cropperdialog" max-width="800">
      <v-card class="flexcard" height="100%">
        <Cropper :key="componentKey" ref="cropperComponent" @onUpdateSource="onUpdateSource" @onUploadComplete="onUpload" @onCropperClose="closecropper" :sourceimage="sourceimage" :folder="folder" :filename="filename" :extension="extension" :resizewidth="resizewidth" :resizeheight="resizeheight" :editmode="editmode" :editImageUrl="editImageUrl"></Cropper>
      </v-card>
    </v-dialog>
    <!-- <div v-if="currentFile && progress < 100">
      <div>
        <v-progress-linear
          v-model="progress"
          color="light-blue"
          height="25"
          reactive
        >
          <strong>{{ progress }} %</strong>
        </v-progress-linear>
      </div>
    </div> -->
    <v-layout style="flex-direction: column-reverse;align-items:center;padding: 10px;margin: 6px 3px;">
      <v-flex xs12 md7 style="margin-left: 10px;font-size: 10px;text-align:center;padding-bottom: 25px;">
        <label for="files" class="btn" style="margin:0px; font-size:10px;">{{label}}</label>
        <input id="files" type="file" @change="onFileChange" >
        <!-- <b-spinner small v-if="imageloading"></b-spinner> -->
      </v-flex>
      <v-flex xs12 md5 v-if="image" style="display: flex;">
        <!-- <img :src="icon" height="40" /> -->
        <img v-if="image.indexOf('data:image')!==-1" :src="image" height= "200px"  width ="200px" style="border-style: double;"/>
        <img v-else :src="aws_url+image" height= "120px"  width ="200px" style="border-style: double;" @click="editImage(aws_url+image)"/>

        
        <button v-if="image" @click="removeImage"><v-icon medium>delete</v-icon></button>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
import Cropper from "./CropUploadImage";

export default {
  components: {
        Cropper
  },
  props:{
      label:{
          type:String,
          default:"image"
      },
      image:{
          type:String,
          default:""
      },
      folder:{
          type:String,
          default:"others"
      },
      resizewidth:{
          type:Number,
          default:321
      },
      resizeheight:{
          type:Number,
          default:268
      }
  },
  name: "upload-files",
  data() {
    return {
      aws_url: process.env.VUE_APP_API_URL_STAFF_FILEPATH,
      currentFile: undefined,
      progress: 0,
      message: "",
      fileInfos: [],
      icon:"",
      filename:"icon",
      extension:"png",
      imageloading: false,
      sourceimage:"",
      cropperdialog: false,
      url: '',
      base64: '',
      error: '',
      editmode: false,
      editImageUrl: "",
      componentKey:0,
    };
  },
  mounted() {

  },
  methods: {


    opencropper() {
      this.cropperdialog = true;
    },

    closecropper(){
        this.sourceimage = "";
        this.editmode = false;
        this.editImageUrl = "";
        this.cropperdialog = false;
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      //this.imageloading = true;
      this.createImage(files[0]);
      const filename = event.target.files[0].name;
      const lastDot = filename.lastIndexOf('.');
      const fileNameWithoutExt = filename.substring(0, lastDot);
      const ext = filename.substring(lastDot + 1);
      this.filename = fileNameWithoutExt;
      this.extension = ext;
    },
    createImage(file) {
      //var imagex = new Image();
      var reader = new FileReader();
      this.progress = 0;
      reader.onload = (e) => {
        //this.$emit("updateImage",e.target.result);
        //this.upload(e.target.result);
        this.sourceimage = e.target.result;
        this.editmode = false;
        this.opencropper();
      };
      reader.readAsDataURL(file);
      //this.upload(this.image);
    },
    removeImage: function () {
      this.$emit("updateImage","");
      this.icon = '';
    },
    editImage(imageUrl){
        this.componentKey +=1;
        this.sourceimage = "";
        this.editImageUrl = imageUrl; //"http://192.168.2.32:8002/images/7.jpg";
        this.editmode = true;
        this.opencropper();
    },
    onUpload(storedImage){
        //this.image = storedImage;
        this.icon = storedImage;
         this.$emit("index",0);
       this.$emit("updateImage",storedImage);
        // this.$emit('updateImage',storedImage,0)
        // MyBus.$emit(‘emitLabel’, {'tableOne':this.table1, 'tableTwo':this.table2});
      
        this.closecropper();
    },

    onUpdateSource(storedImage){
        //this.image = storedImage;
        this.sourceimage = storedImage;
    },


    upload(imagedata) {
        if (!imagedata) {
            this.message = "Please select a file!";
            return;
        }

         this.message = "";
         return axios.post(process.env.VUE_APP_API_URL_ADMIN + "imageupload", {'image':imagedata,'folder':this.folder,'filename':this.filename,'extension':this.extension})
            .then((res) => {
                this.imageloading = false;
                if(res.data.status=='S'){
                    this.message = res.data.message;
                    this.icon = res.data.filepath;
                }else{
                    alert(res.data.message);
                }

            }).catch((err) => {
                this.imageloading = false;
                alert('Unable to upload file, try later');
                console.log("this error -> " + err);
            });
    },
  },
};
</script>
