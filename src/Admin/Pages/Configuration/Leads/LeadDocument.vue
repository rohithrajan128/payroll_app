<template>
  <div class="main-20">
    <div flat color="white" class="py-2 px-3 d-flex action-header-bar">
      <!-- <page-title
        class="col-md-4"
        :heading="$t('lead_documents')"
        :google_icon="google_icon"
      ></page-title> -->
      <div>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-text-field
              dense
              rounded-pill
              density="compact"
              outlined
              rounded
              small
              v-on="on"
              v-model="search"
              append-icon="search"
              label="Search"
              class="srch_bar"
              hide-details
              @keyup="searchDoc(search)"
            ></v-text-field>
          </template>
          <span>{{ $t("search") }}</span>
        </v-tooltip>
      </div>
      <div class="d-flex justify-content-end ml-4">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              color="primary"
              medium
              v-on="on"
              style="font-size: 30px"
              class="mr-5"
              @click="AddleaddocumentButton(0)"
              >mdi-plus-circle</v-icon
            >
          </template>
          <span>{{ $t("add_new") }}</span>
        </v-tooltip>
      </div>
    </div>
    <v-divider class="mb-0 mt-1"></v-divider>
    <div v-bind:class="[dummyarray.length > 0 ? 'pt-0' : 'pt-10']">
      <VueElementLoading
        :active="loader"
        spinner="bar-fade-scale"
        color="var(--primary)"
      />
    </div>
    <div class="row mt-2 px-3" v-if="dummyarray.length > 0">
      <div
        class="col-md-2 col-sm-6 col-lg-2 text-center"
        v-for="(doc, i) in dummyarray"
        :key="i"
      >
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
                  <v-list-item
                    style="cursor: pointer"
                    @click="AddleaddocumentButton(doc.id)"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon color="primary" size="small" v-on="on">
                          mdi-rename-outline
                        </v-icon>
                        <strong class="ml-1" v-on="on">{{
                          $t("rename")
                        }}</strong>
                      </template>
                      <span>{{ $t("rename") }}</span>
                    </v-tooltip>
                  </v-list-item>
                  <v-list-item
                    style="cursor: pointer"
                    @click="deleteLeads(doc.id)"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon color="error" size="small" v-on="on">
                          mdi-delete
                        </v-icon>
                        <strong class="ml-1" v-on="on">{{
                          $t("delete")
                        }}</strong>
                      </template>
                      <span>{{ $t("Download") }}</span>
                    </v-tooltip>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <div class="documemtimagediv">
              <v-img
                width="80"
                src="@/assets/icons/social-media/pdf-icon.svg"
                v-if="doc.filetype == 'Pdf'"
              ></v-img>
              <v-img
                width="80"
                src="@/assets/icons/social-media/microsoft-excel-icon.svg"
                v-else-if="doc.filetype == 'Excel'"
              ></v-img>
              <v-img
                width="67"
                src="@/assets/icons/social-media/text-file-line-icon.svg"
                v-else
              ></v-img>
            </div>
            <div class="downloadbuttondocument" v-if="hover && doc.fileurl">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <a
                    v-on="on"
                    class="text-center"
                    :href="document_url + doc.fileurl"
                    target="_blank"
                  >
                    <v-icon> mdi-download </v-icon>
                  </a>
                </template>
                <span>{{ $t("Download") }}</span>
              </v-tooltip>
            </div>
          </v-card>
        </v-hover>
        <strong>{{ doc.document_name }}</strong>
      </div>
    </div>
    <div class="row mt-2 px-3" v-else>
      <div class="col-md-12 text-center h5 b">
        {{ $t("no_data_available") }}
      </div>
    </div>
    <v-dialog v-model="LeadDialogDoc" persistent max-width="600px">
      <v-toolbar color="primary">
        <span class="headline" style="color: white" v-if="showfileurl">{{
          $t("create_lead_document")
        }}</span>
        <span class="headline" style="color: white" v-else>{{
          $t("rename_lead_document")
        }}</span>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              @click="closeLeadDoc"
              class="dialogcloseinuserdetails"
              style="color: white"
              v-on="on"
              >mdi-close</v-icon
            >
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
                  <v-text-field
                    v-on="on"
                    v-model="documentlead.document_name"
                    maxlength="100"
                    v-bind:label="$t('doc_name')"
                    required
                    outlined
                    dense
                    :rules="fieldRules"
                    class="required_field"
                  ></v-text-field>
                </template>
                <span>{{ $t("doc_name") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
          <v-layout pt-2 class="px-4" v-if="showfileurl">
            <v-flex xs12 md12 pl-2>
              <div class="browsedivdoc required_field_doc_lead">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      readonly
                      outlined
                      dense
                      v-on="on"
                      @click="callDocumentSelect"
                      :rules="fieldRules"
                      v-model="documentlead.fileurl"
                      v-bind:label="$t('upload_doc')"
                    ></v-text-field>
                    <v-chip
                      label
                      class="browsebtndoc"
                      @click="callDocumentSelect"
                      color="primary"
                      v-on="on"
                      >{{ $t("browse") }}</v-chip
                    >
                  </template>
                  <span>{{ $t("upload_doc") }}</span>
                </v-tooltip>
              </div>
            </v-flex>
            <v-flex xs12 md4 pl-2 style="display: none">
              <DocumentSelect
                :label="'File'"
                :folder="'LeadDocument'"
                :uploadtype="enable_document_select"
                @closeDialog="closeDocumentSelectDialog"
                @uploadedDocument="uploadedDocument"
                @uploadedFileType="uploadedFileType"
                :documentlink="documentlead.fileurl"
              ></DocumentSelect>
            </v-flex>
          </v-layout>
          <div class="d-block text-right pr-4 pb-4">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on" class="d-inline-block mr-2">
                  <v-btn
                    v-on="on"
                    small
                    @click="closeLeadDoc"
                    :disabled="isBtnLoading"
                    class="ma-1 font-weight-bold cancel-btn"
                    color="dark cancel_button"
                    >{{ $t("cancel") }}</v-btn
                  >
                </div>
              </template>
              <span>{{ $t("cancel") }}</span>
            </v-tooltip>
            <!-- <v-btn @click="clear" class="mr-2 btn btn-link btn-sm">clear</v-btn> -->
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on" class="d-inline-block">
                  <v-btn
                    :disabled="isBtnLoading"
                    @click="submit"
                    small
                    class="mr-2 success hover_shine"
                    color="green darken-1"
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
        </v-form>
      </v-card>
    </v-dialog>

    <ConfirmDialog
      :show="showdeleteDialog"
      :cancel="canceldelete"
      :confirm="confirmdelete"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('want_to_delete_lead_doc')"
    />

    <ConfirmDialog
      :show="showStatusDialog"
      :cancel="cancelStatus"
      :confirm="confirmStatus"
      :id="status_id"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('status_change')"
    />
  </div>
</template>
      
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import DocumentSelect from "../Components/Upload/DocumentSelect.vue";
import VueElementLoading from "vue-element-loading";

export default {
  components: {
    PageTitle,
    ConfirmDialog,
    DocumentSelect,
    VueElementLoading,
  },
  props: ["lead_parent_id", "add_documents"],
  data: () => ({
    enable_document_select: "",
    document_url: process.env.VUE_APP_IMAGE_PATH,
    LeadDocumentarray: [],
    dummyarray: [],
    showStatusDialog: false,
    showdeleteDialog: false,
    LeadDialogDoc: false,
    valid: false,
    loader: false,
    status_id: null,
    delete_id: null,
    next_seq: "",
    headers: [
      {
        text: "Document Name",
        align: "left",
        value: "document_name",
      },

      {
        text: "Document Download",
        align: "",
        value: "fileurl",
      },
      // {
      //   text: "Status",
      //   align: "left",
      //   value: "status",
      // },
      {
        text: "Actions",
        value: "",
        sortable: false,
        align: "center",
      },
    ],
    google_icon: {
      icon_name: "folder_open",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
    isBtnLoading: false,
    showfileurl: true,
    documentlead: {
      id: 0,
      lead_id: 0,
      fileurl: "",
      filetype: "",
      document_name: "",
    },
    lead_followups_array: [],
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
    lead_parent_id: {
      immediate: true,
      handler() {
        this.documentlead.lead_id = this.lead_parent_id;
      },
    },
    add_documents: {
      immediate: true,
      handler() {
        if (this.add_documents == true) {
          this.AddleaddocumentButton(0);
        }
      },
    },
    search: {
      immediate: true,
      handler() {
        if (this.search == "" || this.search == null) {
          this.fetchLeadDocument();
        }
      },
    },
  },
  mounted() {
    this.fetchLeadDocument();
    // this.fetchFollowUpdropdown();
  },
  methods: {
    uploadedFileType(uploadedFileType) {
      this.documentlead.filetype = uploadedFileType;
    },
    searchDoc(name) {
      var search_name = name.toLowerCase();
      this.loader = true;
      this.dummyarray = [];
      for (var i = 0; i < this.LeadDocumentarray.length; i++) {
        var doc_name = this.LeadDocumentarray[i].document_name.toLowerCase();
        if (doc_name.includes(search_name)) {
          this.dummyarray.push(this.LeadDocumentarray[i]);
        }
      }
      this.loader = false;
    },
    callDocumentSelect() {
      this.enable_document_select = "DragDrop";
    },
    closeDocumentSelectDialog(uploadtype) {
      this.enable_document_select = "";
      console.log("close dialog", uploadtype);
      this.loader = false;
    },
    uploadedDocument(file_path) {
      this.loader = true;
      this.documentlead.fileurl = file_path;
      this.closeDocumentSelectDialog();
    },
    cancelStatus() {
      this.showStatusDialog = false;
    },
    confirmStatus() {
      this.statusUpdate();
      this.showStatusDialog = false;
    },
    updateLeadcontactStatus(id) {
      this.status_id = id;
      this.showStatusDialog = true;
    },
    statusUpdate() {
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "updateleaddocumentstatus", {
          id: this.status_id,
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.flashMessage.success({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.fetchLeadDocument();
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
          } else {
            this.flashMessage.error({
              message: res.data.message,
            });
            this.fetchLeadDocument();
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log("this error" + err);
        });
    },

    submit() {
      if (this.$refs.form.validate()) {
        this.isBtnLoading = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "create_lead_document",
            this.documentlead
          )
          .then((res) => {
            this.isBtnLoading = false;
            if (res.data.status == "S") {
              this.LeadDialogDoc = false;
              this.flashMessage.success({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.closeLeadDoc();
              this.fetchLeadDocument();
              this.$emit("update-timeline");
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
      this.confirmDeleteLeadDoc();
      this.showdeleteDialog = false;
    },

    AddleaddocumentButton(id) {
      this.loader = true;
      if (id > 0) {
        this.showfileurl = false;
        axios
          .get(
            process.env.VUE_APP_API_URL_ADMIN +
              "fetch_lead_document_by_id/" +
              id
          )
          .then((res) => {
            this.documentlead = res.data.data;
            this.loader = false;
            this.LeadDialogDoc = true;
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
      } else {
        this.showfileurl = true;
        this.documentlead.id = 0;
        this.documentlead.fileurl = "";
        this.documentlead.lead_id = this.lead_parent_id;
        this.LeadDialogDoc = true;
        this.loader = false;
      }
    },

    fetchLeadDocument() {
      this.loader = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "getleaddocuments/" +
            this.lead_parent_id
        )
        .then((res) => {
          this.LeadDocumentarray = res.data.data;
          this.dummyarray = res.data.data;
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

    deleteLeads(id) {
      this.delete_id = id;
      this.showdeleteDialog = true;
    },

    closeLeadDoc() {
      this.LeadDialogDoc = false;
      this.$refs.form.reset();
    },

    confirmDeleteLeadDoc() {
      this.loader = true;
      axios
        .delete(
          process.env.VUE_APP_API_URL_ADMIN +
            "delete_contact_lead_document/" +
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
            this.fetchLeadDocument();
            this.$emit("update-timeline");
          } else {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.loader = false;
            this.fetchLeadDocument();
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

.required_field_doc_lead::after {
  content: "*";
  color: red;
  margin-left: 2px;
}
.action-header-bar {
  display: flex;
  justify-content: end;
  margin-right: -12px;
}
</style>