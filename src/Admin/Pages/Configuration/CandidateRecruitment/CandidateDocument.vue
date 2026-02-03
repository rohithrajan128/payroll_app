
<template>
  <div class="main-20">
    <v-card elevation="0">
      <div flat color="white" class="row mt-2 mb-1 mx-2 align-items-center">
        <div class="col-md-9">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-text-field dense rounded-pill density="compact" outlined rounded small v-on="on" v-model="search"
                @keyup="searchDoc(search)" append-icon="search" label="Search" class="srch_bar"
                hide-details></v-text-field>
            </template>
            <span>{{ $t("search") }}</span>
          </v-tooltip>
        </div>
        <div class="col-md-3" style="display: flex; justify-content: end">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn color="btn hover_shine add_new" small class="mr-3" v-on="on" @click="addDocument(0)">{{ $t("add_new")
              }}</v-btn>
            </template>
            <span>{{ $t("add_new") }}</span>
          </v-tooltip>
        </div>
      </div>
    </v-card>
    <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
    <div class="row mt-6 px-3" v-if="dummyarray.length>0">
      <div class="col-md-2 col-sm-6 col-lg-2 text-center" v-for="(doc, i) in dummyarray" :key="i">
        <v-hover v-slot="{ hover }" open-delay="0">
          <v-card class="maindocumentdiv mb-1" :elevation="hover ? 10 : 2">
            <div class="text-center threedotsmenu">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="secondary" v-bind="attrs" v-on="on">
                    mdi-dots-vertical
                  </v-icon>
                </template>
                <v-list>
                  <v-list-item style="cursor: pointer;" @click="addDocument(doc)">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon color="primary" size="small" v-on="on">
                          mdi-rename-outline
                        </v-icon> <strong class="ml-1" v-on="on">{{ $t('rename') }}</strong>
                      </template>
                      <span>{{ $t("rename") }}</span>
                    </v-tooltip>
                  </v-list-item>
                  <v-list-item style="cursor: pointer;" @click="deleteDocument(doc.id)">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon color="error" size="small" v-on="on">
                          mdi-delete
                        </v-icon> <strong class="ml-1" v-on="on">{{ $t('delete') }}</strong>
                      </template>
                      <span>{{ $t("Download") }}</span>
                    </v-tooltip>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <div class="documemtimagediv">
              <v-img width="80" src="@/assets/icons/social-media/pdf-icon.svg" v-if="doc.filetype == 'Pdf'"></v-img>
              <v-img width="80" src="@/assets/icons/social-media/microsoft-excel-icon.svg"
                v-else-if="doc.filetype == 'Excel'"></v-img>
              <v-img width="67" src="@/assets/icons/social-media/text-file-line-icon.svg" v-else></v-img>
            </div>
            <div class="downloadbuttondocument" v-if="hover && doc.file_url">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <a v-on="on" class="text-center" :href="document_url + doc.file_url" target="_blank">
                    <v-icon>
                      mdi-download
                    </v-icon>
                  </a>
                </template>
                <span>{{ $t("Download") }}</span>
              </v-tooltip>
            </div>
          </v-card>
        </v-hover>
        <strong>{{ doc.filename }}</strong>
      </div>
    </div>
    <div class="row mt-6 px-3" v-else>
      <div class="col-md-12 text-center h5 b">
        {{ $t("no_data_available") }}
      </div>
      </div>
    <v-dialog v-model="upload_dialog" persistent max-width="600px">
      <v-toolbar color="primary">
        <span class="headline" style="color: white" v-if="showalledit">{{
          $t("create_candidate_document")
        }}</span>
        <span class="headline" style="color: white" v-else>{{
          $t("rename_candidate_document")
        }}</span>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon @click="closeConnectDoc" class="dialogcloseinuserdetails" style="color: white"
              v-on="on">mdi-close</v-icon>
          </template>
          <span>{{ $t("close") }}</span>
        </v-tooltip>
      </v-toolbar>
      <v-card class="pt-6 px-3">
        <v-form ref="form" v-model="valid">
          <v-layout pt-2 class="px-4">
            <v-flex xs12 md12 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field v-on="on" v-model="document.filename" maxlength="100" v-bind:label="$t('doc_name')"
                    required outlined dense :rules="fieldRules" class="required_field"></v-text-field>
                </template>
                <span>{{ $t("doc_name") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
          <v-layout pt-2 class="px-4" v-if="showalledit">
            <v-flex xs12 md12 pl-2>
              <div class="browsedivdoc required_field_doc_connect">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field readonly outlined dense v-on="on" @click="callDocumentSelect" :rules="fieldRules"
                      v-model="document.file_url" v-bind:label="$t('upload_doc')"></v-text-field>
                    <v-chip label class="browsebtndoc" @click="callDocumentSelect" color="primary" v-on="on">{{
                      $t("browse") }}</v-chip>
                  </template>
                  <span>{{ $t("upload_doc") }}</span>
                </v-tooltip>
              </div>
             
            </v-flex>
            <v-flex xs12 md4 pl-2 style="display: none">
              <DocumentSelect :label="'File'" :folder="'CandidateDocument'" :uploadtype="enable_document_select"
                @closeDialog="closeDocumentSelectDialog" @uploadedDocument="uploadedDocument"
                @uploadedFileType="uploadedFileType" :documentlink="document.file_url"></DocumentSelect>
            </v-flex>
          </v-layout>
          <div class="d-block text-right pr-4 pb-4">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on" class="d-inline-block mr-2">
                  <v-btn v-on="on" small @click="closeConnectDoc" :disabled="isBtnLoading"
                    class="ma-1 font-weight-bold cancel-btn" color="dark cancel_button">{{ $t("cancel") }}</v-btn>
                </div>
              </template>
              <span>{{ $t("cancel") }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on" class="d-inline-block">
                  <v-btn :disabled="isBtnLoading" @click="submit" small class="mr-2 success hover_shine"
                    color="green darken-1">
                    {{ $t("submit") }}
                    <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
                  </v-btn>
                </div>
              </template>
              <span>{{ $t("submit") }}</span>
            </v-tooltip>
          </div>
        </v-form>
      </v-card>
    </v-dialog>

    <ConfirmDialog :show="showdeleteDialog" :cancel="canceldelete" :confirm="confirmdelete" v-bind:title="$t('confirm')"
      v-bind:description="$t('want_to_delete_doc')" />

  </div>
</template>
      
<script>
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import DocumentSelect from "../Components/Upload/DocumentSelect.vue";
import VueElementLoading from "vue-element-loading";
export default {
  components: {
    ConfirmDialog,
    DocumentSelect,
    VueElementLoading
  },
  props: ["recruitment_details"],
  data: () => ({
    enable_document_select: "",
    document_url: process.env.VUE_APP_IMAGE_PATH,
    documentarray: [],
    dummyarray: [],
    showdeleteDialog: false,
    showalledit: true,
    upload_dialog: false,
    valid: false,
    loader: false,
    delete_id: null,
    next_seq: "",
    headers: [
      {
        text: "Document Name",
        align: "left",
        value: "filename",
      },

      {
        text: "Download",
        align: "",
        value: "file_url",
      },
      {
        text: "Status",
        align: "left",
        value: "status",
      },
      {
        text: "Actions",
        value: "",
        sortable: false,
        align: "center",
      },
    ],
    search: "",
    isBtnLoading: false,
    document: {
      id: 0,
      candidate_id: 0,
      file_url: "",
      filetype: "",
      filename: "",
    },
  }),
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    emailRules() {
      return [
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          this.$t("email_valid"),
      ];
    },
  },
  watch: {
    recruitment_details: {
      immediate: true,
      handler() {
        this.document.candidate_id = this.recruitment_details.id;
        this.fetchDocuments();
      },
    },

    search: {
      immediate: true,
      handler() {
        if (this.search == "" || this.search == null) {
          this.fetchDocuments();
        }
      }
    }
  },
  mounted() {

  },
  methods: {
    searchDoc(name) {
      var search_name = name.toLowerCase();
      this.loader = true;
      this.dummyarray = [];
      for (var i = 0; i < this.documentarray.length; i++) {
        var doc_name = (this.documentarray[i].filename).toLowerCase();
        if (doc_name.includes(search_name)) {
          this.dummyarray.push(this.documentarray[i]);
        }
      }
      this.loader = false;
    },
    callDocumentSelect() {
      this.enable_document_select = "DragDrop";
    },
    closeDocumentSelectDialog(uploadtype) {
      this.enable_document_select = "";
      this.loader = false;
    },
    uploadedDocument(file_path) {
      this.loader = true;
      this.document.file_url = file_path;
      this.closeDocumentSelectDialog();
    },
    uploadedFileType(uploadedFileType) {
      this.document.filetype = uploadedFileType;
    },

    updateDocStatus(id) {
      this.status_id = id;
      this.showStatusDialog = true;
    },

    submit() {
      if (this.$refs.form.validate()) {
        this.document.candidate_id = this.recruitment_details.id;
        this.isBtnLoading = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "create_candidate_doc",
            this.document
          )
          .then((res) => {
            this.isBtnLoading = false;
            if (res.data.status == "S") {
              this.upload_dialog = false;
              this.flashMessage.success({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.closeConnectDoc();
            } else {
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
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
            console.log("error", err);
          });
      }
    },

    canceldelete() {
      this.showdeleteDialog = false;
    },
    confirmdelete() {
      this.confirmDeleteDoc();
      this.showdeleteDialog = false;
    },

    addDocument(item) {
      if (item) {
        this.document = item;
        this.upload_dialog = true;
        this.showalledit = false;
      } else {
        this.showalledit = true;
        this.document.id = 0;
        this.document.file_url = "";
        this.upload_dialog = true;
      }
    },
    fetchDocuments() {
      this.loader = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchcandidaterecruitmentdocuments", {
          params: {
            candidate_id: this.recruitment_details.id,
          },
        })
        .then((res) => {
          this.documentarray = res.data.candidate_doc;
          this.dummyarray = res.data.candidate_doc;
          this.loader = false;
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
          this.loader = false;
        });
    },

    deleteDocument(id) {
      this.delete_id = id;
      this.showdeleteDialog = true;
    },

    closeConnectDoc() {
      this.upload_dialog = false;
      this.$refs.form.reset();
      this.showalledit = true;
      this.fetchDocuments();
    },

    confirmDeleteDoc() {
      this.loader = true;
      axios
        .delete(
          process.env.VUE_APP_API_URL_ADMIN +
          "delete_candidate_document/" +
          this.delete_id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.flashMessage.success({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.loader = false;
            this.fetchDocuments();
          } else {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.loader = false;
            this.fetchDocuments();
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          this.loader = false;
          console.log("this error" + err);
        });
    },
  },
};
</script>
<style scoped>
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



.desc_item {
  font-size: 17px;
}

.required_field_doc_connect::after {
  content: "*";
  color: red;
  margin-left: 2px;
}

</style>