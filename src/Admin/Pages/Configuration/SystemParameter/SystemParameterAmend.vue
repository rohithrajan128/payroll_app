<template>
  <div class="container-fluid mt-3 p-0">
    <div class="main-card mb-3">
      <div class="card-header p-0">
        <div class="card-header-tab card-header">
          <div class="card-header-title font-size-lg text-capitalize titlewrap">
            {{ $t("create_system_parameter") }}
          </div>
        </div>
      </div>
      <div class="card-body">
        <VueElementLoading
          :active="loader"
          spinner="bar-fade-scale"
          color="var(--primary)"
        />
        <v-form ref="form" v-model="valid">
          <div v-if="system_params.parameter_name == 'APP_LOGO'">
            <v-flex xs12 md2>
              <input
                type="checkbox"
                class="larger mb-5"
                :value="system_params.is_file_upload"
                v-model="system_params.is_file_upload"
                @click="uploadImagestatus(system_params.is_file_upload)"
              />
              {{ $t("is_file_upload") }}
            </v-flex>
          </div>
          <v-layout class="mt-2">
            <v-flex xs12 md6>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="system_params.parameter_name"
                    :rules="fieldRules"
                    v-bind:label="$t('parameter_name')"
                    required
                    dense
                    class="required_field"
                    outlined
                  ></v-text-field>
                </template>
                <span>{{ $t("parameter_name") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md6 v-if="system_params.is_file_upload == false">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="system_params.parameter_value"
                    :rules="fieldRules"
                    dense
                    v-bind:label="$t('parameter_value')"
                    required
                    class="required_field"
                    outlined
                  ></v-text-field>
                </template>
                <span>{{ $t("parameter_value") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex
              class="upload_image mb-5 text-align"
              xs12
              md6
              v-if="
                system_params.is_file_upload == true &&
                system_params.parameter_name == 'APP_LOGO'
              "
            >
              <MediaSelect
                :from="'system_parameter'"
                :label="'Image'"
                :resizeheight="90" 
                :resizewidth="200" 
                folder="app_logo"
                :image="system_params.parameter_value"
                @updateImage="updateImage"
              ></MediaSelect>
              <a
                class="text-center"
                @click="downloadImage(system_params.parameter_value)"
              >
                <span
                  v-if="
                    system_params.parameter_value &&
                    system_params.parameter_name == 'APP_LOGO' &&
                    system_params.is_file_upload == true
                  "
                  class="download_btn_color"
                  >{{ $t("download") }}</span
                >
              </a>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12 md12>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-textarea
                    v-on="on"
                    v-model="system_params.description"
                    :rules="fieldRules"
                    v-bind:label="$t('description')"
                    required
                     rows="2"
                    class="required_field"
                    outlined
                  ></v-textarea>
                </template>
                <span>{{ $t("description") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </v-form>
      </div>
      <div class="d-block text-right mr-4">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block mr-2">
              <v-btn
                v-on="on"
                small
                class="ma-1 font-weight-bold cancel-btn"
                color="dark cancel_button"
                @click="$router.go(-1)"
              >
                {{ $t("cancel") }}
              </v-btn>
            </div>
          </template>
          <span>{{ $t("cancel") }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block">
              <v-btn
                :disabled="isDisabled"
                color="green darken-1"
                @click="submit"
                small
                class="mr-2 success hover_shine"
              >
                {{ $t("submit") }}
                <b-spinner
                  :disabled="isBtnLoading"
                  small
                  v-if="isBtnLoading"
                ></b-spinner>
              </v-btn>
            </div>
          </template>
          <span>{{ $t("submit") }}</span>
        </v-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
import MediaSelect from "../Components/Upload/MediaSelect.vue";
export default {
  components: {
    VueElementLoading,
    MediaSelect,
  },
  data: () => ({
    envPath: process.env.VUE_APP_IMAGE_DOWNLOAD_URL,
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    valid: true,
    loader: false,
    file: "",
    isBtnLoading: false,
    showupload: "",
    isDisabled: false,
    checkbox_value: false,
    system_params: {
      id: 0,
      parameter_name: "",
      parameter_value: "",
      description: "",
      is_file_upload: false,
    },
    noimagepreview: "",
    items: [],
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    numberRules() {
      return [(v) => !!v || this.$t("number_required")];
    },
  },

  created() {},
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "edit_system_params/" +
                this.$route.query.slug
            )
            .then((res) => {
              this.system_params = res.data.systemparameter;
              this.loader = false;
            });
        }
      },
    },
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        // Form is valid, process
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "save_system_params",
            this.system_params
          )
          .then((res) => {
            this.btnloading = false;
            let App_Image_Url = res.data.systemparameter.image_full_url;
            localStorage.setItem("App_Image_Url", App_Image_Url);
            this.$eventBus.$emit("app_logo");
            this.$store.state.app_img_url =
              res.data.systemparameter.image_full_url;
            if (Array.isArray(res.data.message)) {
              this.array_data = res.data.message.toString();
            } else {
              this.array_data = res.data.message;
            }
            if (res.data.status == "S") {
              this.flashMessage.success({
                message: this.array_data,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.message = res.data.message;
              this.$router.push({
                name: "system_parameter",
              });
            } else if (res.data.status == "E") {
              this.flashMessage.error({
                message: this.array_data,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.isBtnLoading = false;
              this.isDisabled = false;
            } else {
              this.isBtnLoading = false;
              this.flashMessage.error({
                message: this.array_data,
              });
            }
          })
          .catch((err) => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.isBtnLoading = false;
            console.log(err);
          });
      } else {
        console.log("Form is Invalid");
      }
    },
    //  addfilename(filename) {
    //   this.upload_cv.filename = filename;
    // },
    //  fileExtension(file_extension) {
    //   this.upload_cv.mime_type = file_extension;
    // },
    uploadImagestatus(value) {
      if (value == false) {
        this.system_params.is_file_upload = true;
      } else {
        this.system_params.is_file_upload = false;
      }
    },
    updateImage(imagedata) {
      this.system_params.parameter_value = imagedata;
    },

    downloadImage(image_url) {
      window.open(this.envImagePath + image_url, "_blank");
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>
<style scoped>
input.larger {
  width: 20px;
  height: 20px;
}

.upload_doc {
  margin-top: -14px;
}

.upload_image {
  margin-bottom: 3px;
}

.download_btn_color {
  color: #3f6ad8;
  margin-left: 60px;
}

.image-width {
  border: 2px solid black;
  padding: 1px;
}
</style>
