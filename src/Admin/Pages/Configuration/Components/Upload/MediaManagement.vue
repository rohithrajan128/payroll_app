<template>
  <div>
    <v-alert :value="valid_error" color="error" icon="warning" outlined>
      {{ message }}
    </v-alert>
    <!-- Manage Assets section -->
    <div>
      <v-card style="margin-top: 40px">
        <v-progress-linear indeterminate color="blue" v-if="initval"></v-progress-linear>
        <v-tabs vertical>
          <v-tab
            v-for="(assettype, i) in assetTypes"
            @click="getAssetData(assettype.type)"
            :key="i"
          >
            <v-icon left> {{ assettype.icon }}</v-icon>
            {{ assettype.type }}
          </v-tab>
          <!-- <v-tab @click="getAssetData('Pdf')">
            <v-icon left> mdi-file-pdf </v-icon>
            Pdf
          </v-tab>
          <v-tab @click="getAssetData('Doc')">
            <v-icon left> mdi-microsoft-word </v-icon>
            Doc
          </v-tab>
          <v-tab @click="getAssetData('Excel')">
            <v-icon left> mdi-microsoft-excel </v-icon>
            Excel
          </v-tab>
          <v-tab @click="getAssetData('Videos')">
            <v-icon left> mdi-movie </v-icon>
            Videos
          </v-tab> -->
          <!-- Images section -->
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-pagination
                  v-model="page"
                  :length="totalPages"
                  total-visible="9"
                  next-icon="mdi-menu-right"
                  prev-icon="mdi-menu-left"
                  @input="handlePageChange"
                ></v-pagination>
                <v-tabs>
                  <v-tab>
                    <v-icon left> mdi-folder-multiple-image </v-icon>
                    Uploaded Images
                  </v-tab>
                  <v-tab-item>
                    <v-card flat>
                      <div class="search-sec">
                        <div>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-on="on"
                                style="width: 300px"
                                v-model="search"
                                @change="initialise"
                                append-icon="search"
                                label="Search"
                                single-line
                                hide-details
                              ></v-text-field>
                            </template>
                            <span>Search</span>
                          </v-tooltip>
                        </div>
                        <div>
                          <v-menu
                            v-model="fromdatemenu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="fromdate"
                                label="From Date"
                                prepend-icon="event"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                              >
                              </v-text-field>
                            </template>
                            <v-date-picker
                              v-model="fromdate"
                              @input="fromdatemenu = false"
                              min="1700-01-01"
                              :max="new Date().toISOString().substr(0, 10)"
                              :allowed-dates="
                                (date) => date <= new Date().toISOString().substr(0, 10)
                              "
                              @change="updateEndDate"
                            ></v-date-picker>
                          </v-menu>
                        </div>
                        <div>
                          <v-menu
                            v-model="todatemenu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="todate"
                                label="To Date"
                                prepend-icon="event"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                              >
                              </v-text-field>
                            </template>
                            <v-date-picker
                              v-model="todate"
                              @input="todatemenu = false"
                              min="1700-01-01"
                              :max="new Date().toISOString().substr(0, 10)"
                              :allowed-dates="(date) => date >= fromdate"
                            ></v-date-picker>
                          </v-menu>
                        </div>
                        <div>
                          <v-btn @click="initialise">Filter</v-btn>
                        </div>
                        <div v-if="search || fromdate || todate">
                          <v-btn @click="clearfilter">Clear Filter</v-btn>
                        </div>
                      </div>
                      <div class="d-flex file-section" style="flex-flow: wrap">
                        <div v-if="AssetsData.length == 0 && !initval">
                          No Images found, Upload Image
                        </div>
                        <div
                          v-for="(assetData, i) in AssetsData"
                          :key="i"
                          :class="assetData.status == 1 ? '' : 'disable-section'"
                        >
                          <div class="mt-4">
                            <img
                              style="width: 100%; height: 124px"
                              :src="aws_url + assetData.media_url"
                            />
                          </div>
                          <div>
                            <div class="d-flex">
                              <h2>{{ assetData.alt_text }}</h2>
                              <div class="action-btn">
                                <a
                                  :href="aws_url + assetData.media_url"
                                  download
                                  style="color: #00000"
                                  target="_blank"
                                >
                                  <i
                                    style="margin-top: 10px"
                                    class="vsm-icon pe-7s-cloud-download"
                                    aria-hidden="true"
                                  ></i>
                                </a>
                                <i
                                  style="margin-top: 10px"
                                  class="vsm-icon pe-7s-note"
                                  @click="editdialog(assetData)"
                                  aria-hidden="true"
                                ></i>
                                <i
                                  style="margin-top: 10px"
                                  class="vsm-icon pe-7s-trash"
                                  @click="deleteItem(assetData)"
                                  aria-hidden="true"
                                ></i>
                              </div>
                            </div>
                            <p class="dec-ellipsis-1">By: {{ assetData.owner }}</p>
                            <p class="dec-ellipsis-1">
                              Year: {{ assetData.photo_year | formatDateYear }}
                            </p>
                            <p class="dec-ellipsis-1">
                              {{ assetData.uploaded_at }}
                            </p>
                          </div>
                          <!-- <v-btn
                            x-small
                            class="success"
                            v-if="assetData.on_timeline == 1"
                            @click="markOnTimeline(assetData)"
                            :disabled="assetData.status == 0"
                          >
                            On Timeline
                          </v-btn>
                          <v-btn
                            x-small
                            class="error"
                            v-else
                            @click="markOnTimeline(assetData)"
                            :disabled="assetData.status == 0"
                          >
                            Add to Timeline
                          </v-btn> -->
                          <!-- <v-btn class="mt-4" color="primary" dark small>
                            <a
                              :href="aws_url + assetData.media_url"
                              download
                              style="color: white"
                              target="_blank"
                            >
                              <v-icon dark style="margin-right: 20px">
                                mdi-cloud-download
                              </v-icon>
                              Download
                            </a>
                          </v-btn> -->
                        </div>
                      </div>
                      <div class="mt-20" v-if="!initval">
                        <vue-dropzone
                          ref="myVueDropzone"
                          id="dropzone"
                          :options="dropzoneOptions"
                          @vdropzone-file-added="afterFileAdded"
                        ></vue-dropzone>
                      </div>
                    </v-card>
                  </v-tab-item>
                </v-tabs>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <!-- Images section -->
          <!-- PDf section -->
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <div v-if="AssetsData.length == 0 && !initval">
                  No PDF documents found, Please Upload
                </div>
                <div class="d-flex file-section">
                  <div v-for="(assetData, i) in AssetsData" :key="i">
                    <div class="mt-4"><v-icon left> mdi-file-pdf </v-icon></div>
                    <div>
                      <div class="d-flex">
                        <h2>{{ assetData.alt_text }}</h2>
                        <div class="action-btn">
                          <i
                            style="margin-top: 10px"
                            class="vsm-icon pe-7s-note"
                            @click="editdialog(assetData)"
                            aria-hidden="true"
                          ></i>
                          <i
                            style="margin-top: 10px"
                            class="vsm-icon pe-7s-trash"
                            @click="deleteItem(assetData)"
                            aria-hidden="true"
                          ></i>
                        </div>
                      </div>
                      <p class="dec-ellipsis-1">By: {{ assetData.owner }}</p>
                      <p class="dec-ellipsis-1">
                        Year: {{ assetData.photo_year | formatDateYear }}
                      </p>
                      <p class="dec-ellipsis-1">
                        {{ assetData.uploaded_at }}
                      </p>
                    </div>
                    <v-btn class="mt-4" color="primary" dark small>
                      <a
                        :href="aws_url + assetData.media_url"
                        target="_blank"
                        style="color: white"
                      >
                        <v-icon dark style="margin-right: 20px">
                          mdi-cloud-download
                        </v-icon>
                        Download
                      </a>
                    </v-btn>
                  </div>
                </div>
                <div class="mt-20">
                  <vue-dropzone
                    ref="myVueDropzone"
                    id="dropzone"
                    :options="dropzoneOptions"
                    @vdropzone-file-added="afterFileLoad"
                  ></vue-dropzone>
                </div>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <!-- PDf section -->
          <!-- Word section -->
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <div v-if="AssetsData.length == 0 && !initval">
                  No Documents found, Please Upload
                </div>
                <div class="d-flex file-section">
                  <div v-for="(assetData, i) in AssetsData" :key="i">
                    <div class="mt-4">
                      <v-icon left> mdi-microsoft-word </v-icon>
                    </div>
                    <div>
                      <div class="d-flex">
                        <h2>{{ assetData.alt_text }}</h2>
                        <div class="action-btn">
                          <i
                            style="margin-top: 10px"
                            class="vsm-icon pe-7s-note"
                            @click="editdialog(assetData)"
                            aria-hidden="true"
                          ></i>
                          <i
                            style="margin-top: 10px"
                            class="vsm-icon pe-7s-trash"
                            @click="deleteItem(assetData)"
                            aria-hidden="true"
                          ></i>
                        </div>
                      </div>
                      <p class="dec-ellipsis-1">By: {{ assetData.owner }}</p>
                      <p class="dec-ellipsis-1">
                        Year: {{ assetData.photo_year | formatDateYear }}
                      </p>
                      <p class="dec-ellipsis-1">
                        {{ assetData.uploaded_at }}
                      </p>
                    </div>
                    <v-btn class="mt-4" color="primary" dark small>
                      <a
                        :href="aws_url + assetData.media_url"
                        target="_blank"
                        style="color: white"
                      >
                        <v-icon dark style="margin-right: 20px">
                          mdi-cloud-download
                        </v-icon>
                        Download
                      </a>
                    </v-btn>
                  </div>
                </div>
                <div class="mt-20">
                  <vue-dropzone
                    ref="myVueDropzone"
                    id="dropzone"
                    :options="dropzoneOptions"
                    @vdropzone-file-added="afterFileLoad"
                  ></vue-dropzone>
                </div>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <!-- word section -->
          <!-- Excel section -->
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <div v-if="AssetsData.length == 0 && !initval">
                  No Spreadshets found, Please Upload
                </div>
                <div class="d-flex file-section">
                  <div v-for="(assetData, i) in AssetsData" :key="i">
                    <div class="mt-4">
                      <v-icon left> mdi-microsoft-excel </v-icon>
                    </div>
                    <div>
                      <div class="d-flex">
                        <h2>{{ assetData.alt_text }}</h2>
                        <div class="action-btn">
                          <i
                            style="margin-top: 10px"
                            class="vsm-icon pe-7s-note"
                            @click="editdialog(assetData)"
                            aria-hidden="true"
                          ></i>
                          <i
                            style="margin-top: 10px"
                            class="vsm-icon pe-7s-trash"
                            @click="deleteItem(assetData)"
                            aria-hidden="true"
                          ></i>
                        </div>
                      </div>
                      <p class="dec-ellipsis-1">By: {{ assetData.owner }}</p>
                      <p class="dec-ellipsis-1">
                        Year: {{ assetData.photo_year | formatDateYear }}
                      </p>
                      <p class="dec-ellipsis-1">
                        {{ assetData.uploaded_at }}
                      </p>
                    </div>
                    <v-btn class="mt-4" color="primary" dark small>
                      <a
                        :href="aws_url + assetData.media_url"
                        target="_blank"
                        style="color: white"
                      >
                        <v-icon dark style="margin-right: 20px">
                          mdi-cloud-download
                        </v-icon>
                        Download
                      </a>
                    </v-btn>
                  </div>
                </div>
                <div class="mt-20">
                  <vue-dropzone
                    ref="myVueDropzone"
                    id="dropzone"
                    :options="dropzoneOptions"
                    @vdropzone-file-added="afterFileLoad"
                  ></vue-dropzone>
                </div>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <!-- Excel section -->
          <!-- Videos section -->
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <div class="mb-20" style="text-align: right">
                  <v-btn @click="opendialog">Add Video</v-btn>
                </div>
                <div v-if="AssetsData.length == 0 && !initval">
                  No Videos found, Add Video
                </div>
                <div class="d-flex file-section">
                  <div v-for="(assetData, i) in AssetsData" :key="i">
                    <div class="mt-4">
                      <v-icon left> mdi-movie </v-icon>
                    </div>
                    <div>
                      <div class="d-flex">
                        <h2>{{ assetData.alt_text }}</h2>
                        <div class="action-btn">
                          <i
                            style="margin-top: 10px"
                            class="vsm-icon pe-7s-note"
                            @click="editdialog(assetData)"
                            aria-hidden="true"
                          ></i>
                          <i
                            style="margin-top: 10px"
                            class="vsm-icon pe-7s-trash"
                            @click="deleteItem(assetData)"
                            aria-hidden="true"
                          ></i>
                        </div>
                      </div>
                      <p class="dec-ellipsis-1">By: {{ assetData.owner }}</p>
                      <p class="dec-ellipsis-1">
                        Year: {{ assetData.photo_year | formatDateYear }}
                      </p>
                      <p class="dec-ellipsis-1">
                        {{ assetData.uploaded_at }}
                      </p>
                    </div>
                    <v-btn class="mt-4" color="primary" dark small>
                      <a :href="assetData.media_url" target="_blank" style="color: white">
                        <v-icon dark style="margin-right: 20px">
                          mdi-arrow-right-drop-circle
                        </v-icon>
                        Preview
                      </a>
                    </v-btn>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <!-- Videos section -->
        </v-tabs>
      </v-card>
    </div>
    <!-- Manage Assets section -->

    <v-dialog v-model="otherdialog" max-width="800">
      <v-form ref="form" v-model="valid">
        <v-card class="flexcard" height="100%">
          <v-card-title style="justify-content: space-between">
            <span class="headline">Upload Meta Data</span>
            <i class="lnr-cross" style="cursor: pointer" @click="closeotherdialog()"></i>
          </v-card-title>
          <v-container grid-list-md>
            <v-layout>
              <v-flex xs12 md3>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-on="on"
                      v-model="alt_text"
                      label="Alt Text"
                      :rules="fieldRules"
                      required
                    ></v-text-field>
                  </template>
                  <span>Name</span>
                </v-tooltip>
              </v-flex>
              <v-flex xs12 md3>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-autocomplete
                      v-on="on"
                      label="Select Category"
                      index="shortname"
                      item-value="shortname"
                      item-text="shortname"
                      v-model="category"
                      :rules="fieldRules"
                      :items="categories"
                      required
                    ></v-autocomplete>
                  </template>
                  <span>Category</span>
                </v-tooltip>
              </v-flex>
              <v-flex xs12 md3>
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="photo_year"
                      label="Year"
                      prepend-icon="event"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    >
                    </v-text-field>
                  </template>
                  <v-date-picker
                    v-model="photo_year"
                    @input="menu2 = false"
                    min="1700-01-01"
                    :max="new Date().toISOString().substr(0, 10)"
                    :allowed-dates="
                      (date) => date <= new Date().toISOString().substr(0, 10)
                    "
                  ></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 md3>
                <v-checkbox
                  v-model="status"
                  v-bind:false-value="0"
                  v-bind:true-value="1"
                  :label="`Active?: ${status == 1 ? 'Yes' : 'No'}`"
                ></v-checkbox>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex xs12 md12>
                <!-- <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-textarea
                      outlined
                      v-on="on"
                      v-model="description"
                      label="Description"
                      required
                    ></v-textarea>
                  </template>
                  <span>Description</span>
                </v-tooltip> -->
                <quill-editor
                  v-model="description"
                  tag-name="textarea"
                  id="description"
                  name="description"
                  label="Description"
                  :editor="editor"
                  :config="editorConfig"
                ></quill-editor>
              </v-flex>
            </v-layout>
            <v-layout v-if="selectedtype == 'Image'">
              <v-flex xs12 md4>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-on="on"
                      v-model="owner"
                      label="Owner"
                      required
                    ></v-text-field>
                  </template>
                  <span>Owner</span>
                </v-tooltip>
              </v-flex>
              <v-flex xs12 md4>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-autocomplete
                      v-on="on"
                      v-model="tags"
                      :items="lookupitems"
                      index="shortname"
                      item-value="shortname"
                      item-text="shortname"
                      attach
                      chips
                      label="Select Age Group"
                      multiple
                      return-object
                    ></v-autocomplete>
                  </template>
                  <span>Age Groups</span>
                </v-tooltip>
              </v-flex>
              <v-flex xs12 md2>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-on="on"
                      v-model="latitude"
                      label="Latitude"
                      required
                    ></v-text-field>
                  </template>
                  <span>Latitude</span>
                </v-tooltip>
              </v-flex>
              <v-flex xs12 md2>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-on="on"
                      v-model="longitude"
                      label="Longitude"
                      required
                    ></v-text-field>
                  </template>
                  <span>Longitude</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
            <v-layout v-if="selectedtype == 'Videos'">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="media_url"
                    :rules="fieldRules"
                    label="Video Url"
                    required
                  ></v-text-field>
                </template>
                <span>Video Url</span>
              </v-tooltip>
            </v-layout>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="save" :disabled="!valid || btnloading">
              <b-spinner small v-if="btnloading"></b-spinner>Save
            </v-btn>
            <v-btn @click="closeotherdialog" :disabled="btnloading"> Close </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import Cropper from "./CropUploadImage.vue";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import { quillEditor } from "vue-quill-editor";

export default {
  props: {
    entity_type: {
      type: String,
      default: "None",
    },
    entity_id: {
      type: Number,
      default: 0,
    },
    label: {
      type: String,
      default: "Logo",
    },
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
      default: 268,
    },
  },
  data: () => ({
    editorConfig: {
      required: true,
    },
    editor: "",
    lookupitems: [],
    fromdatemenu: false,
    todatemenu: false,
    fromdate: "",
    todate: "",
    aws_url: process.env.MIX_AWS_URL,
    page: 1,
    totalPages: 0,
    sharedpage: 1,
    sharedTotalPages: 0,
    search: "",
    loader: false,
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
    edit_tags: "",
    edit_category: "",
    edit_coordinates: {},
    AssetsData: [],
    SharedAssets: [],
    selectedImages: [],
    access_token: "XXX",
    dropzoneOptions: {
      url: "/api/v1/dragUpload",
      thumbnailWidth: 150,
      maxFilesize: 0.5,
      headers: { Assets: "Assets" },
      previewsContainer: false,
      autoProcessQueue: false,
    },
    assetTypes: [
      { type: "Image", icon: "mdi-folder-multiple-image" },
      { type: "Pdf", icon: "mdi-file-pdf" },
      { type: "Doc", icon: "mdi-microsoft-word" },
      { type: "Excel", icon: "mdi-microsoft-excel" },
      { type: "Videos", icon: "mdi-movie" },
    ],
    message: "",

    currentFile: undefined,
    progress: 0,
    fileInfos: [],
    icon: "",
    filename: "icon",
    extension: "png",
    imageloading: false,
    sourceimage: "",
    cropperdialog: false,
    url: "",
    base64: "",
    error: "",
    editmode: false,
    editImageUrl: "",
    componentKey: 0,
    addbtn: false,
    valid: false,
    otherdialog: false,
    menu2: false,
    alt_text: "",
    description: "",
    photo_year: "",
    media_url: "",
    owner: "",
    tags: "",
    category: "",
    status: 0,
    latitude: 0,
    longitude: 0,
    selectedfile: {},
    btnloading: false,
    fieldRules: [(v) => !!v || "Field is required"],
    categories: [],
  }),
  components: {
    vueDropzone: vue2Dropzone,
    Cropper,
    quillEditor,
  },
  created() {
    this.selectedtype = "Image";
    axios
      .get(process.env.VUE_APP_API_URL_ADMIN + "lookupdata/AGE_GROUP")
      .then((res) => {
        this.lookupitems = res.data;
      })
      .catch((err) => {
        console.log(err);
      });

    this.initialise();

    axios
      .get(process.env.VUE_APP_API_URL_ADMIN + "lookupdata/IMAGE_CATEGORY")
      .then((res) => {
        this.categories = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },

  methods: {
    updateEndDate() {
      this.todate = this.fromdate;
    },
    opendialog() {
      this.type = this.selectedtype;
      this.edit_id = 0;
      this.alt_text = "";
      this.description = "";
      this.photo_year = "";
      this.category = "";
      this.owner = "";
      this.tags = "";
      this.status = 0;
      this.latitude = 0;
      this.longitude = 0;
      this.otherdialog = true;
    },

    editdialog(item) {
      this.type = item.type;
      this.edit_id = item.id;
      this.alt_text = item.alt_text;
      this.description = item.description;
      this.photo_year = item.photo_year;
      this.status = item.status;
      this.owner = item.owner;
      this.category = item.category;
      this.latitude = item.latitude;
      this.longitude = item.longitude;
      this.tags = JSON.parse(item.tags);
      this.otherdialog = true;
    },

    closeotherdialog() {
      this.otherdialog = false;
    },

    opencropper() {
      this.cropperdialog = true;
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
      this.edit_tags = JSON.parse(item.tags);
      this.opencropper();
    },

    closecropper() {
      this.sourceimage = "";
      this.editmode = false;
      this.editImageUrl = "";
      this.cropperdialog = false;
    },

    onUpload(storedImage) {
      //this.image = storedImage;
      this.icon = storedImage;
      //this.$emit("updateImage", storedImage);
      this.initialise();
      this.closecropper();
    },

    onUpdateSource(storedImage) {
      //this.image = storedImage;
      this.sourceimage = storedImage;
    },

    clearfilter() {
      this.search = "";
      this.fromdate = "";
      this.todate = "";
      this.initialise();
    },
    initialise() {
      this.initval = true;
      if (this.search || this.fromdate || this.todate) {
        this.page = 1;
      }
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "uploadedImages?page=" + this.page, {
          type: this.selectedtype,
          search: this.search,
          fromdate: this.fromdate,
          todate: this.todate,
          entity_type: this.entity_type,
          entity_id: this.entity_id,
        })
        .then((res) => {
          this.initval = false;
          this.AssetsData = res.data.assets.data;
          this.totalPages = res.data.assets.last_page;
          this.access_token = res.data.token;
        })
        .catch((err) => {
          console.log(err);
          this.initval = false;
          this.valid_error = true;
          this.message = "Something went wrong.  Please contact the administrator.";
          this.$vuetify.goTo(0);
        });
    },

    initialisePageChange() {
      this.initval = true;
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "uploadedImages?page=" + this.page, {
          type: this.selectedtype,
          search: this.search,
          fromdate: this.fromdate,
          todate: this.todate,
          entity_type: this.entity_type,
          entity_id: this.entity_id,
        })
        .then((res) => {
          this.initval = false;
          this.AssetsData = res.data.assets.data;
          this.totalPages = res.data.assets.last_page;
          this.access_token = res.data.token;
        })
        .catch((err) => {
          console.log(err);
          this.initval = false;
          this.valid_error = true;
          this.message = "Something went wrong.  Please contact the administrator.";
          this.$vuetify.goTo(0);
        });
    },

    getAssetData(type) {
      this.selectedtype = type;
      this.AssetsData = [];
      this.initialise();
    },

    deleteItem(item) {
      if (confirm("Are you sure you want to delete this asset?")) {
        //this.deleteTemplate(this.covidstatus[index]);
        const index = this.AssetsData.indexOf(item);
        axios
          .delete(process.env.VUE_APP_API_URL_ADMIN + "assets/" + item.id)
          .then((res) => {
            if (res.data.status == "E") {
              this.valid_error = true;
              this.message = res.data.message;
              this.$vuetify.goTo(0);
            } else {
              //this.initialise();
              this.AssetsData.splice(index, 1);
            }
          })
          .catch((err) => {
            console.log(err);
            this.valid_error = true;
            this.message = "Something went wrong.  Please contact the administrator.";
            this.$vuetify.goTo(0);
          });
      }
    },

    afterFileAdded(file) {
      if (file.type.includes("image")) {
      } else {
        alert("Only Images allowed!!");
        return false;
      }
      var imagex = new Image();
      var reader = new FileReader();
      this.progress = 0;
      reader.onload = (e) => {
        //this.$emit("updateImage",e.target.result);
        //this.upload(e.target.result);
        //this.sourceimage = e.target.result;
        //this.editmode = false;
        //this.opencropper();
        this.selectedfile = e.target.result;
        this.opendialog();
      };
      reader.readAsDataURL(file);
    },
    afterFileLoad(file) {
      if (this.selectedtype == "Image") {
        if (file.type.includes("image")) {
        } else {
          alert("Only Images allowed!!");
          return false;
        }
      }
      if (this.selectedtype == "Pdf") {
        if (file.type.includes("pdf")) {
        } else {
          alert("Only PDF's allowed!!");
          return false;
        }
      } else if (this.selectedtype == "Doc") {
        if (file.type.includes("document")) {
        } else {
          alert("Only Document's allowed!!");
          return false;
        }
      } else if (this.selectedtype == "Excel") {
        if (file.type.includes("sheet")) {
        } else {
          alert("Only Spreadsheet's allowed!!");
          return false;
        }
      }
      this.selectedfile = file;
      this.opendialog();
    },

    save() {
      this.btnloading = true;
      if (this.selectedtype == "Videos") {
        if (this.edit_id > 0) {
          axios
            .patch(process.env.VUE_APP_API_URL_ADMIN + "assets/" + this.edit_id, {
              alt_text: this.alt_text,
              description: this.description,
              media_url: this.media_url,
              category: this.category,
              tags: this.tags,
              owner: this.owner,
              latitude: this.latitude,
              longitude: this.longitude,
            })
            .then((res) => {
              this.btnloading = false;
              if (res.data.status == "E") {
                this.btnloading = false;
                this.valid_error = true;
                this.message = res.data.message;
                this.$vuetify.goTo(0);
              } else {
                this.initialise();
                this.closeotherdialog();
              }
            })
            .catch((err) => {
              console.log(err);
              this.btnloading = false;
              this.valid_error = true;
              this.message = "Something went wrong.  Please contact the administrator.";
              this.$vuetify.goTo(0);
            });
        } else {
          axios
            .post(process.env.VUE_APP_API_URL_ADMIN + "assets", {
              entity_type: this.entity_type,
              entity_id: this.entity_id,
              alt_text: this.alt_text,
              description: this.description,
              tags: this.tags,
              owner: this.owner,
              type: this.selectedtype,
              media_url: this.media_url,
              category: this.category,
              latitude: this.latitude,
              longitude: this.longitude,
              id: this.edit_id,
            })
            .then((res) => {
              this.btnloading = false;
              if (res.data.status == "E") {
                this.btnloading = false;
                this.valid_error = true;
                this.message = res.data.message;
                this.$vuetify.goTo(0);
              } else {
                this.initialise();
                this.closeotherdialog();
              }
            })
            .catch((err) => {
              console.log(err);
              this.btnloading = false;
              this.valid_error = true;
              this.message = "Something went wrong.  Please contact the administrator.";
              this.$vuetify.goTo(0);
            });
        }
      } else {
        let formData = new FormData();
        formData.append("file", this.selectedfile);
        formData.append("alt_text", this.alt_text);
        formData.append("category", this.category);
        formData.append("description", this.description);
        formData.append("type", this.selectedtype);
        formData.append("entity_type", this.entity_type);
        formData.append("entity_id", this.entity_id);
        formData.append("photo_year", this.photo_year);
        formData.append("owner", this.owner);
        formData.append("status", this.status);
        formData.append("latitude", this.latitude);
        formData.append("longitude", this.longitude);
        formData.append("tags", JSON.stringify(this.tags));
        formData.append("id", this.edit_id);
        axios
          .post(process.env.VUE_APP_API_URL_ADMIN + "assetDocumentUpload", formData)
          .then((res) => {
            this.btnloading = false;
            if (res.data.status == "E") {
              this.btnloading = false;
              this.valid_error = true;
              this.message = res.data.message;
              this.$vuetify.goTo(0);
            } else {
              this.initialise();
              this.closeotherdialog();
            }
          })
          .catch((err) => {
            console.log(err);
            this.btnloading = false;
            this.valid_error = true;
            this.message = "Something went wrong.  Please contact the administrator.";
            this.$vuetify.goTo(0);
          });
      }
    },
    getSelectedImage(ImageObj) {
      this.addbtn = true;
      this.selectedImages.push(ImageObj);
    },

    SharedImage(clear) {
      if (clear) {
        this.SharedAssets = [];
      }
      if (this.SharedAssets.length == 0) {
        this.initval = true;
        axios
          .post(process.env.VUE_APP_API_URL_ADMIN + "sharedImages?page=" + this.sharedpage, {
            search: this.search,
          })
          .then((res) => {
            this.initval = false;
            this.SharedAssets = res.data.assets.data;
            this.sharedTotalPages = res.data.assets.last_page;
          })
          .catch((err) => {
            console.log(err);
            this.initval = false;
            this.valid_error = true;
            this.message = "Something went wrong.  Please contact the administrator.";
            this.$vuetify.goTo(0);
          });
      }
    },

    markOnTimeline(item) {
      const index = this.AssetsData.indexOf(item);
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "markOnTimeline", {
          id: item.id,
          on_timeline: item.on_timeline,
        })
        .then((res) => {
          this.AssetsData[index].on_timeline = item.on_timeline == 1 ? 0 : 1;
        })
        .catch((err) => {
          console.log(err);
          this.valid_error = true;
          this.message = "Something went wrong.  Please contact the administrator.";
          this.$vuetify.goTo(0);
        });
    },

    handlePageChange(value) {
      this.page = value;
      this.initialisePageChange();
    },

    handleSharedPageChange(value) {
      this.sharedpage = value;
      this.SharedImage(true);
    },
  },
};
</script>
<style lang="css">
@import "~quill/dist/quill.core.css";
@import "~quill/dist/quill.snow.css";
@import "~quill/dist/quill.bubble.css";
</style>
<style scoped>
.disable-section {
  background: #e4e4e4;
  filter: blur(0px) grayscale(6%);
  opacity: 0.6;
}
.mt-20 {
  margin-top: 20px;
}
.v-tabs >>> .v-tabs-bar {
  /* width: 157px; */
  border-right: 1px solid #dedede !important;
}

.theme--dark.v-toolbar.v-sheet {
  height: auto !important;
}
.v-toolbar >>> .v-toolbar__content {
  height: auto !important;
}
.v-tab {
  justify-content: left;
}
.file-section > div {
  margin-right: 13px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 2px 1px #eee;
  padding: 16px;
  width: 190px;
  position: relative;
  margin-top: 19px;
  flex-flow: wrap;
}
.file-section div > h2 {
  font-size: 17px;
  margin-bottom: 0px;
  font-weight: 500;
  margin-top: 6px;
  color: #007ca1;
}
.circle-img {
  background: #ffffff
    url(https://d175p71fr6e2yb.cloudfront.net/storage/orglogo/961dcfe1-696c-4276-a4dd-ef75ad6b7673.png);
  width: 116px;

  border-radius: 11px;

  background-size: cover;
  background-position: center;
  margin-right: 20px;
  border: 1px solid #f0f0f0;
}
.featured-parent > h3 {
  width: 100%;
  font-size: 20px;
  margin-top: 10px;
  color: rgb(16, 145, 189);
  font-weight: 500;
  text-align: left;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dec-ellipsis-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 14px;
  color: #707070 !important;
  font-weight: 500 !important;
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
.action-btn > i {
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
</style>
