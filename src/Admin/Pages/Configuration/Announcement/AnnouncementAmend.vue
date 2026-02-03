<template>
  <div class="container-fluid card mt-3 p-0">
    <div class="main-card mb-3">
      <div class>
        <div class="card-header-tab card-header">
          <div
            class="card-header-title font-size-lg text-capitalize titlewrap"
          >{{ $t("create_announcement") }}</div>
        </div>
      </div>
      <div class="card-body">
        <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
        <v-alert
          v-model="save_error"
          :text="save_error"
          color="error"
          icon="warning"
          outlined
          dismissible
        >{{ valertdialogmessage }}</v-alert>
        <v-form ref="form" v-model="valid">
          <v-layout wrap class="mt-2">
            <v-flex xs12 md6 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="announcement.title"
                    v-bind:label="$t('title')"
                    required
                    dense
                    maxlength="50"
                    counter
                    :rules="fieldRules"
                    class="required_field"
                    outlined
                  ></v-text-field>
                </template>
                <span>{{ $t("title") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12 md12 pl-2>
              <!--<v-textarea
                rows="3"
                maxlength="1000"
                counter
                v-model="announcement.content"
                v-bind:label="$t('description')"
                outlined
                dense
              ></v-textarea>-->

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span v-on="on">
                    <v-card-title class="font-weight-bold desc_item p-0">{{ $t("description") }}</v-card-title>

                    <quill-editor
                      v-model="announcement.content"
                      tag-name="textarea"
                      id="tempbody"
                      name="template_body"
                      :options="editorOptions"
                      v-bind:label="$t('body')"
                    ></quill-editor>
                    <span v-if="showerrmsg" name style="color: red">{{ $t("field_required") }}</span>
                  </span>
                </template>
                <span>{{ $t("body") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
          <v-layout class="mt-2">
            <v-flex xs12 md6 pl-2 class="m-auto mt-5">
              <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
              <div class="browsedivdoc">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      readonly
                      outlined
                      dense
                      v-on="on"
                      @click="callDocumentSelect"
                      v-model="announcement.document_upload"
                      v-bind:label="$t('upload_doc')"
                    ></v-text-field>
                    <v-chip
                      label
                      class="browsebtndoc"
                      @click="callDocumentSelect"
                      color="primary"
                      v-on="on"
                    >{{ $t("browse") }}</v-chip>
                  </template>
                  <span>{{ $t("upload_doc") }}</span>
                </v-tooltip>
              </div>
              <div
                class="d-flex download_item justify-end"
                v-if="announcement.document_upload && $route.query.slug"
              >
                <a :href="document_url + announcement.document_upload" download>
                  <p class="download_color">Download</p>
                </a>
              </div>
            </v-flex>
            <v-layout>
              <v-flex xs12 sm6 md8 style="display: none">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <span v-on="on">
                      <DocumentSelect
                        :label="'Proof'"
                        :folder="'ProofDocument'"
                        :uploadtype="enable_document_select"
                        @closeDialog="closeDocumentSelectDialog"
                        @uploadedDocument="uploadedDocument"
                        :documentlink="announcement.document_upload"
                      ></DocumentSelect>
                    </span>
                  </template>
                  <span>{{ $t("file_input") }}</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </v-layout>
        </v-form>
      </div>
      <div class="d-block text-right mr-4">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div class="d-inline-block mr-2">
              <v-btn
                v-on="on"
                small
                class="ma-1 font-weight-bold cancel-btn"
                color="secondary"
                @click="$router.go(-1)"
              >{{ $t("cancel") }}</v-btn>
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
                <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
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
import DocumentSelect from "../Components/Upload/DocumentSelect.vue";
import { quillEditor } from "vue-quill-editor";
import Quill from "quill";
import ImageResize from "quill-image-resize";
Quill.register("modules/imageResize", ImageResize);

export default {
  components: {
    VueElementLoading,
    DocumentSelect,
    quillEditor
  },
  data: () => ({
    editorOptions: {
      modules: {
        
        toolbar: [
          ["bold", "italic", "underline", "strike"], // Text formatting options
          ["blockquote", "code-block"], // Blockquote and code block options
          [{ header: 1 }, { header: 2 }], // Header options
          [{ list: "ordered" }, { list: "bullet" }], // List options
          [{ script: "sub" }, { script: "super" }], // Subscript and superscript options
          [{ indent: "-1" }, { indent: "+1" }], // Indentation options
          [{ direction: "rtl" }], // Text direction option
          ["link", "image", "video"], // Link, image, and video options
          ["clean"] // Remove formatting option
        ],
        imageResize: ["Resize", "DisplaySize", "Toolbar"]
      }
    },
    loader: false,
    valertdialogmessage: "",
    save_error: false,
    showerrmsg:false,
    isBtnLoading: false,
    valid: true,
    loader: false,
    document_url: process.env.VUE_APP_IMAGE_PATH,
    employee_type_array: [],
    enable_document_select: "",
    isDisabled: false,
    announcement: {
      id: 0,
      title: "",
      content: "",
      document_upload: null,
      site_id: null,
      org_id: null
    }
  }),
  computed: {
    fieldRules() {
      return [v => !!v || this.$t("field_required")];
    },

    numberRules() {
      return [v => !!v || this.$t("number_required")];
    }
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.announcement.org_id = this.user.hr_employee.org_id;
    this.announcement.site_id = this.user.hr_employee.site_id;
    this.fetchLookups();
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          axios
            .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_announcement", {
              params: {
                slug: this.$route.query.slug
              }
            })
            .then(res => {
              this.announcement = res.data.announcement_details;
              this.loader = false;
            });
        }
      }
    }
  },
  methods: {
    uploadedDocument(file_path) {
      this.loader = true;
      this.announcement.document_upload = file_path;
      this.closeDocumentSelectDialog();
    },
    NumbersOnly(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    fetchLookups() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "EMPLOYEE_TYPE"
          }
        })
        .then(response => {
          this.employee_type_array = response.data.lookup_details;
        })
        .catch(err => {
          console.log(err);
        });
    },
    closeDocumentSelectDialog(uploadtype) {
      this.enable_document_select = "";
      console.log("close dialog", uploadtype);
      this.loader = false;
    },
    callDocumentSelect() {
      this.enable_document_select = "DragDrop";
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        // Form is valid, process
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "create_announcement",
            this.announcement
          )
          .then(res => {
            this.btnloading = false;
            if (Array.isArray(res.data.message)) {
              this.array_data = res.data.message.toString();
            } else {
              this.array_data = res.data.message;
            }
            if (res.data.status == "S") {
              this.flashMessage.success({
                message: this.array_data,
                time: 4000,
                blockClass: "custom-block-class"
              });
              this.message = res.data.message;
              this.$router.push({
              name: "announcements"
              });
            } else if (res.data.status == "E") {
              this.valertdialogmessage = response.data.message;
              this.save_error = true;
              this.isBtnLoading = false;
              this.isDisabled = false;
            } else {
              this.isBtnLoading = false;
              this.valertdialogmessage = this.$t("something_went_wrong");
              this.save_error = true;
              this.isDisabled = false;
            }
          })
          .catch(err => {
            this.valertdialogmessage = this.$t("something_went_wrong");
            this.save_error = true;
            this.isDisabled = false;
            this.isBtnLoading = false;
            console.log(err);
          });
      } else {
        console.log("Form is Invalid");
      }
    }
  }
};
</script>
<style scoped>
@import "~quill/dist/quill.core.css";
@import "~quill/dist/quill.snow.css";
@import "~quill/dist/quill.bubble.css";
.browsedivdoc {
  display: inline-flex;
  width: 100%;
  position: relative;
}

.browsedivdoc /deep/ .v-chip {
  border-radius: 0%;
}

.browsebtndoc {
  height: 40px !important;
  margin-left: -10%;
}
.download_color {
  color: #3f6ad8;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
.download_item {
  position: absolute;
  top: 40px;
  right: 0px;
}
.desc_item {
  font-size: 17px;
}
</style>