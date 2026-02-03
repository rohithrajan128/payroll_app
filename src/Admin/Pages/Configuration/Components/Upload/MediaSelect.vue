<template>
  <div>
    <v-dialog v-model="mediaDialog" max-width="1200">
      <v-card class="flexcard" height="100%">
        <v-card-title style="justify-content: space-between">
          <span class="headline">Upload Image</span>
          <i class="lnr-cross" style="cursor: pointer" @click="closeMediaLibrary()"></i>
        </v-card-title>
        <v-alert :value="valid_error" color="error" icon="warning" outlined class="m-2">
        </v-alert>
        <!-- Show Cropper Component -->
        <v-dialog v-model="cropperdialog" max-width="1000">
          <v-card class="flexcard" height="100%">
            <Cropper :key="componentKey" ref="cropperComponent" @onUpdateSource="onUpdateSource"
              @onUploadComplete="onUpload" @onCropperClose="closecropper" :sourceimage="sourceimage" :folder="folder"
              :filename="filename" :extension="extension" :resizewidth="resizewidth" :resizeheight="resizeheight"
              :editmode="editmode" :editImageUrl="editImageUrl" :type="selectedtype" :edit_id="edit_id"
              :edit_alt_text="edit_alt_text" :edit_description="edit_description" :edit_category="edit_category"
              :edit_photo_year="edit_photo_year" :edit_owner="edit_owner" :edit_status="edit_status"
              :edit_coordinates="edit_coordinates" :addtimeline="addtimeline" :uploadflag="uploadflag"></Cropper>
          </v-card>
        </v-dialog>
        <!-- Manage Assets section -->
        <div>
          <v-card style="margin-top: 40px">
            <v-progress-linear indeterminate color="blue" v-if="initval"></v-progress-linear>

            <v-card flat>
              <v-card-text>
                <v-tabs>
                  <!-- <v-tab @click="MyImages()">
                    <v-icon left>mdi-folder-multiple-image </v-icon>
                    Your Images
                  </v-tab>
                  <v-tab @click="SharedImage(false)">
                    <v-icon left>mdi-folder-multiple-image </v-icon>
                    Shared Images
                  </v-tab> -->
                  <v-tab>
                    <v-icon left>mdi-folder-multiple-image </v-icon>
                    Upload New
                  </v-tab>
                  <!-- <v-tab-item><v-card flat>
                      <div>
                        <v-pagination v-model="mypage" :length="myTotalPages" total-visible="9"
                          next-icon="mdi-menu-right" prev-icon="mdi-menu-left"
                          @input="handleMyPageChange"></v-pagination>
                      </div>
                      <div class="search-sec">
                        <div>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-text-field v-on="on" style="width: 300px" v-model="search" @change="MyImages"
                                append-icon="search" label="Search" single-line hide-details></v-text-field>
                            </template>
                            <span>Search</span>
                          </v-tooltip>
                        </div>
                        <div>
                          <v-menu v-model="fromdatemenu" :close-on-content-click="false" :nudge-right="40"
                            transition="scale-transition" offset-y min-width="290px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field v-model="fromdate" label="From Date" prepend-icon="event" readonly
                                v-bind="attrs" v-on="on">
                              </v-text-field>
                            </template>
                            <v-date-picker v-model="fromdate" @input="fromdatemenu = false" min="1700-01-01"
                              :max="new Date().toISOString().substr(0, 10)" :allowed-dates="
                                (date) =>
                                  date <= new Date().toISOString().substr(0, 10)
                              " @change="updateEndDate"></v-date-picker>
                          </v-menu>
                        </div>
                        <div>
                          <v-menu v-model="todatemenu" :close-on-content-click="false" :nudge-right="40"
                            transition="scale-transition" offset-y min-width="290px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field v-model="todate" label="To Date" prepend-icon="event" readonly
                                v-bind="attrs" v-on="on">
                              </v-text-field>
                            </template>
                            <v-date-picker v-model="todate" @input="todatemenu = false" min="1700-01-01"
                              :max="new Date().toISOString().substr(0, 10)"
                              :allowed-dates="(date) => date >= fromdate"></v-date-picker>
                          </v-menu>
                        </div>
                        <div>
                          <v-btn @click="MyImages">Filter</v-btn>
                        </div>
                        <div v-if="search || fromdate || todate">
                          <v-btn @click="clearfilter('MyImages')">Clear Filter</v-btn>
                        </div>
                      </div>
                      <div class="d-flex file-section" style="flex-flow: wrap">
                        <div v-if="ImageData.length == 0 && !initval" class="m-2">
                          No Images found, Upload Image
                        </div>
                        <div v-for="(assetData, i) in ImageData" :key="i">
                          <div class="mt-4">
                            <img style="width: 100%; height: 124px" :src="aws_url + assetData.media_url" />
                          </div>
                          <div>
                            <div class="d-flex">
                              <h2>{{ assetData.alt_text }}</h2>
                            </div>
                            <p class="dec-ellipsis-1">
                              By: {{ assetData.owner }}
                            </p>
                            <p class="dec-ellipsis-1">
                              Year: {{ assetData.photo_year | formatDateYear }}
                            </p>
                            <p class="dec-ellipsis-1">
                              {{ assetData.uploaded_at }}
                            </p>
                          </div>
                          <v-btn class="mt-4" color="primary" dark small @click="assignImage(assetData)">
                            <v-icon dark style="margin-right: 20px">
                              mdi-plus
                            </v-icon>
                            Assign
                          </v-btn>
                        </div>
                      </div>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item>
                    <v-card flat>
                      <div>
                        <v-pagination v-model="sharedpage" :length="sharedTotalPages" total-visible="9"
                          next-icon="mdi-menu-right" prev-icon="mdi-menu-left"
                          @input="handleSharedPageChange"></v-pagination>
                      </div>
                      <div class="search-sec">
                        <div>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-text-field v-on="on" style="width: 300px" v-model="search" @change="SharedImage(true)"
                                append-icon="search" label="Search" single-line hide-details></v-text-field>
                            </template>
                            <span>Search</span>
                          </v-tooltip>
                        </div>
                        <div>
                          <v-menu v-model="fromdatemenu" :close-on-content-click="false" :nudge-right="40"
                            transition="scale-transition" offset-y min-width="290px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field v-model="fromdate" label="From Date" prepend-icon="event" readonly
                                v-bind="attrs" v-on="on">
                              </v-text-field>
                            </template>
                            <v-date-picker v-model="fromdate" @input="fromdatemenu = false" min="1700-01-01"
                              :max="new Date().toISOString().substr(0, 10)" :allowed-dates="
                                (date) =>
                                  date <= new Date().toISOString().substr(0, 10)
                              " @change="updateEndDate"></v-date-picker>
                          </v-menu>
                        </div>
                        <div>
                          <v-menu v-model="todatemenu" :close-on-content-click="false" :nudge-right="40"
                            transition="scale-transition" offset-y min-width="290px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field v-model="todate" label="To Date" prepend-icon="event" readonly
                                v-bind="attrs" v-on="on">
                              </v-text-field>
                            </template>
                            <v-date-picker v-model="todate" @input="todatemenu = false" min="1700-01-01"
                              :max="new Date().toISOString().substr(0, 10)"
                              :allowed-dates="(date) => date >= fromdate"></v-date-picker>
                          </v-menu>
                        </div>
                        <div>
                          <v-btn @click="SharedImage(true)">Filter</v-btn>
                        </div>
                        <div v-if="search || fromdate || todate">
                          <v-btn @click="clearfilter('SharedImages')">Clear Filter</v-btn>
                        </div>
                      </div>

                      <div class="d-flex file-section">
                        <v-card-text style="width: 100%">
                          <div class="d-flex file-section">
                            <div v-if="SharedAssets.length == 0 && !initval">
                              No Shared Images found
                            </div>

                            <div v-for="(assetData, i) in SharedAssets" :key="i">
                              <div class="mt-4">
                                <img style="width: 100%; height: 124px" :src="aws_url + assetData.media_url" />
                              </div>
                              <div>
                                <div class="d-flex">
                                  <h2>{{ assetData.alt_text }}</h2>
                                  <div class="action-btn">
                                    <v-icon v-if="addbtn" style="margin-bottom: 6px; color: green"
                                      right>mdi-checkbox-marked-circle
                                    </v-icon>
                                  </div>
                                </div>
                                <p class="dec-ellipsis-1">
                                  By: {{ assetData.owner }}
                                </p>
                                <p class="dec-ellipsis-1">
                                  Year:
                                  {{ assetData.photo_year | formatDateYear }}
                                </p>
                                <p class="dec-ellipsis-1">
                                  {{ assetData.uploaded_at }}
                                </p>
                                <v-btn class="mt-4" color="primary" dark small @click="assignImage(assetData)">
                                  <v-icon dark style="margin-right: 20px">
                                    mdi-plus
                                  </v-icon>
                                  Assign
                                </v-btn>
                              </div>
                            </div>
                          </div>
                        </v-card-text>
                      </div>
                    </v-card>
                  </v-tab-item> -->
                  <v-tab-item>
                    <v-card flat>
                      <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"
                        @vdropzone-file-added="afterFileAdded"></vue-dropzone>
                    </v-card>
                  </v-tab-item>
                </v-tabs>
              </v-card-text>
            </v-card>
          </v-card>
        </div>
      </v-card>
    </v-dialog>
    <!-- Manage Assets section -->
    <!-- <v-layout v-if="uploadtype == 'DragDrop'" class="upload-img">
      <v-flex xs12 style="display: flex; padding-top: 80px">
        <p @click="openMediaLibrary()">{{$t('add_image')}}</p>
      </v-flex>
    </v-layout> -->
    <v-layout style="
        flex-direction: column-reverse;
        align-items: left;
        margin-left: 35px;
       
      ">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <span v-on="on">
            <v-flex xs12 md7 v-if="!image">
              <img src="@/assets/images/upload_image_default.png" @click="openMediaLibrary()"
                style="border-style: double" v-bind:class="[
                  from == 'system_parameter'
                    ? 'image-size-sys'
                    : 'image-size-other',
                ]" />
            </v-flex>
          </span>
        </template>
        <span>{{ $t("upload_profile") }}</span>
      </v-tooltip>
      <v-flex xs12 md5 v-if="image && multiple == 0" style="display: flex">
        <img :src="envImagePath + image" style="border-style: double" v-bind:class="[
          from == 'system_parameter' ? 'image-size-sys' : 'image-size-other',
        ]" />
        <button v-if="image" @click="removeImage">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-icon class="delete_btn icon_size" v-bind:class="[
                from == 'system_parameter'
                  ? 'delete-icon-sys'
                  : 'delete-icon',
              ]" v-on="on" medium>mdi-trash-can-outline</v-icon>
            </template>
            <span>{{ $t("delete") }}</span>
          </v-tooltip>
        </button>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Cropper from "./CropUploadImage.vue";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";

export default {
  props: {
    image: {
      type: String,
      default: "",
    },
    folder: {
      type: String,
      default: "others",
    },
    resizewidth: {
      type: Number,
      default: 321,
    },
    resizeheight: {
      type: Number,
      default: 150,
    },
    addtimeline: {
      type: String,
      default: "N",
    },
    uploadtype: {
      type: String,
      default: "",
    },
    qindex: {
      type: Number,
      default: 0,
    },
    multiple: {
      type: Number,
      default: 0,
    },
    from: {
      type: String,
      default: "",
    },
    upload_profile: {
      type: Boolean,
      default: 0,
    },
  },
  data: () => ({
    fromdatemenu: false,
    todatemenu: false,
    fromdate: "",
    todate: "",
    mediaDialog: false,
    aws_url: process.env.MIX_AWS_URL,
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    mypage: 1,
    myTotalPages: 0,
    sharedpage: 1,
    sharedTotalPages: 0,
    page: 1,
    totalPages: 0,
    search: "",
    valid_error: false,
    initval: false,
    dialog: false,
    selectedtype: "Image",
    edit_id: 0,
    edit_alt_text: "",
    edit_description: "",
    edit_photo_year: "",
    edit_status: "",
    edit_owner: "",
    edit_category: "",
    edit_coordinates: {},
    uploadflag: "N",
    AssetsData: [],
    SharedAssets: [],
    ImageData: [],
    dropzoneOptions: {
      url: "https://httpbin.org/post",
      thumbnailWidth: 150,
      maxFilesize: 0.5,
      headers: { Assets: "Assets" },
      previewsContainer: false,
      autoProcessQueue: false,
    },
    message: "",
    progress: 0,
    icon: "",
    filename: "icon",
    extension: "png",
    sourceimage: "",
    cropperdialog: false,
    url: "",
    error: "",
    editmode: false,
    editImageUrl: "",
    componentKey: 0,
    addbtn: false,
    valid: false,
    menu2: false,
    alt_text: "",
    description: "",
    photo_year: "",
    media_url: "",
    category: "",
    status: 0,
  }),
  components: {
    vueDropzone: vue2Dropzone,
    Cropper,
  },
  created() {
    this.selectedtype = "Image";
    this.MyImages();
  },
 watch: {
upload_profile:{
      immediate: true,
      handler() {
        if (this.upload_profile==true) {
          this.openMediaLibrary();
        }
      }
}
  },
  methods: {
    updateEndDate() {
      this.todate = this.fromdate;
    },

    openMediaLibrary() {
      this.mediaDialog = true;
    },

    closeMediaLibrary() {
      this.mediaDialog = false;
    },

    removeImage() {
      this.image = null;
      this.$emit("removeImage", this.image);
    },

    opencropper() {
      this.cropperdialog = true;
    },

    assignImage(item) {
      this.componentKey += 1;
      //this.edit_coordinates = JSON.parse(item.coordinates);
      this.sourceimage = "";
      this.editImageUrl = item.media_url;
      this.editmode = true;
      this.edit_id = item.id;
      this.edit_alt_text = item.alt_text;
      this.edit_description = item.description;
      this.edit_photo_year = item.photo_year;
      this.edit_status = item.status;
      this.edit_owner = item.owner;
      this.edit_category = item.category;
      this.uploadflag = "N";
      this.opencropper();
    },

    editImage(imageUrl, item) {
      this.componentKey += 1;
      this.edit_coordinates = JSON.parse(item.coordinates);
      this.sourceimage = "";
      this.editImageUrl = imageUrl; //"http://192.168.2.32:8002/images/7.jpg";
      this.editmode = true;
      this.edit_id = item.id;
      this.edit_alt_text = item.alt_text;
      this.edit_description = item.description;
      this.edit_photo_year = item.photo_year;
      this.edit_status = item.status;
      this.edit_owner = item.owner;
      this.edit_category = item.category;
      this.uploadflag = "N";
      this.opencropper();
    },

    closecropper() {
      this.sourceimage = "";
      this.editmode = false;
      this.editImageUrl = "";
      this.closeMediaLibrary();
      this.cropperdialog = false;
    },

    onUpload(storedImage) {
      //this.image = storedImage;
      //this.image = storedImage;
      this.$emit("updateImage", storedImage, this.qindex);
      // this.initialise();
      this.closecropper();
    },

    onUpdateSource(storedImage) {
      this.sourceimage = storedImage;
    },
    initialise() {
      this.initval = true;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "townImages?page=" + this.page,
          {
            search: this.search,
            fromdate: this.fromdate,
            todate: this.todate,
          }
        )
        .then((res) => {
          this.initval = false;
          this.AssetsData = res.data.assets.data;
          this.totalPages = res.data.assets.last_page;
        })
        .catch((err) => {
          console.log(err);
          this.initval = false;
          this.valid_error = true;
          this.message =
            "Something went wrong.  Please contact the administrator.";
          this.$vuetify.goTo(0);
        });
    },

    MyImages() {
      this.initval = true;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN +
          "uploadedImages?page=" +
          this.mypage,
          {
            search: this.search,
            myimage: true,
            fromdate: this.fromdate,
            todate: this.todate,
            type: "Image",
          }
        )
        .then((res) => {
          this.initval = false;
          this.ImageData = res.data.assets.data;
          this.myTotalPages = res.data.assets.last_page;
        })
        .catch((err) => {
          console.log(err);
          this.initval = false;
          this.valid_error = true;
          this.message =
            "Something went wrong.  Please contact the administrator.";
          this.$vuetify.goTo(0);
        });
    },

    afterFileAdded(file) {
      if (file.type.includes("image")) {
      } else {
        this.flashMessage.error({
          message: this.$t("image_allowed"),
          time: 4000,
          blockClass: "custom-block-class",
        });
        return false;
      }
      var imagex = new Image();
      var reader = new FileReader();
      this.progress = 0;
      reader.onload = (e) => {
        //this.$emit("updateImage",e.target.result);
        //this.upload(e.target.result);
        this.sourceimage = e.target.result;
        this.editmode = false;
        this.edit_alt_text = "";
        this.edit_description = "";
        this.edit_photo_year = "";
        this.edit_status = 0;
        this.edit_owner = "";
        this.edit_category = "";
        this.uploadflag = "Y";
        this.opencropper();
      };
      reader.readAsDataURL(file);
    },

    SharedImage(clear) {
      if (clear) {
        this.SharedAssets = [];
      }
      if (this.SharedAssets.length == 0) {
        this.initval = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN +
            "sharedImages?page=" +
            this.sharedpage,
            {
              search: this.search,
              fromdate: this.fromdate,
              todate: this.todate,
            }
          )
          .then((res) => {
            this.initval = false;
            this.SharedAssets = res.data.assets.data;
            this.sharedTotalPages = res.data.assets.last_page;
          })
          .catch((err) => {
            console.log(err);
            this.initval = false;
            this.valid_error = true;
            this.message =
              "Something went wrong.  Please contact the administrator.";
            this.$vuetify.goTo(0);
          });
      }
    },

    handleMyPageChange(value) {
      this.mypage = value;
      this.ImageData = [];
      this.MyImages();
    },

    handleSharedPageChange(value) {
      this.sharedpage = value;
      this.SharedImage(true);
    },

    clearfilter(tabname) {
      this.search = "";
      this.fromdate = "";
      this.todate = "";
      if (tabname == "MyImages") {
        this.MyImages();
      } else if (tabname == "SharedImages") {
        this.SharedImage(true);
      } else {
        this.initialise();
      }
    },
  },
};
</script>
<style scoped>
.v-tabs>>>.v-tabs-bar {
  /* width: 157px; */
  border-right: 1px solid #dedede !important;
}

.v-tab {
  justify-content: left;
}

.file-section>div {
  margin-right: 13px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 2px 1px #eee;
  padding: 16px;
  width: 190px;
  position: relative;
  margin-top: 19px;
}

.file-section div>h2 {
  font-size: 17px;
  margin-bottom: 0px;
  font-weight: 500;
  margin-top: 6px;
  color: #007ca1;
}

.dec-ellipsis-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 14px;
  margin-bottom: 0px;
  color: #a4a4a4 !important;
  font-weight: 500 !important;
}

.action-btn {
  position: absolute;
  top: -9px;
  right: 0px;
}

.action-btn>i {
  font-weight: 900;
  font-size: 17px;
  color: #000000;
  cursor: pointer;
}

.mt-4 {
  margin-top: 4px !important;
}

.search-sec {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 98%;
}

.upload-img {
  flex-direction: column-reverse;
  align-items: center;
  padding: 10px;
  height: 180px;
  background: #f1f1f1;
  margin: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px dashed gray;
  color: gray;
}

.delete-icon {
  position: relative;
  bottom: 90px;
  left: 8px;
}

.delete-icon-sys {
  position: relative;
  bottom: 30px;
  left: 8px;
}

.image-size-sys {
  height: 60px;
  width: 110px;
}

.image-size-other {
  height: 130px;
  width: 150px;
}

</style>
