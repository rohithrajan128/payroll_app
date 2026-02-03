<template>
  <div class="main-20">
    <div>
      <v-app-bar flat color="white">
        <div class="row">
          <div class="col-md-9">
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
                  v-bind:label="$t('search')"
                  hide-details
                  class="srch_bar"
                ></v-text-field>
              </template>
              <span>{{ $t("search") }}</span>
            </v-tooltip>
          </div>
          <div class="col-md-3 text-end">
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-if="view == 'userview' && status"
                  class="btn mr-2 mb-2 hover_shine add_new"
                  small
                  v-on="on"
                  @click="dialogIdProof"
                  >{{ $t("add") }}</v-btn
                >
              </template>
              <span>{{ $t("add") }}</span>
            </v-tooltip>
          </div>
        </div>
      </v-app-bar>
      <v-data-table
        :loading="initval"
        :headers="emp_proof_headers"
        :items="emp_proof_data"
        :search="search"
        v-bind:no-data-text="$t('no_data_available')"
        class="mt-2"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td class="text-capitalize">{{ item.check_proof_type }}</td>
            <td>{{ item.proof_id }}</td>
            <td>{{ item.proof_data }}</td>
            <td v-if="item.issue_date">{{ item.issue_date | formatDate }}</td>
            <td v-else>-</td>

            <td v-if="item.expiry_date">{{ item.expiry_date | formatDate }}</td>
            <td v-else>-</td>
            <td>
              <v-tooltip
                bottom
                v-if="item.description"
                max-width="370"
                color="white"
              >
                <template v-slot:activator="{ on }">
                  <div class="description_hover_div" v-on="on">
                    {{ item.description }}
                  </div>
                </template>
                <v-sheet class="pa-4 b">{{ item.description }}</v-sheet>
              </v-tooltip>
              <span v-else>{{ $t("not_appllicable") }}</span>
            </td>
            <td>
              <div v-if="item.doct_type">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <a
                      v-on="on"
                      class="text-center"
                      :href="document_url + item.doct_type"
                      target="_blank"
                    >
                      <v-icon color="blue" class="px-3">mdi-download</v-icon>
                    </a>
                  </template>
                  <span>{{ $t("Download") }}</span>
                </v-tooltip>
              </div>
              <div v-else>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <a v-on="on" target="_blank">
                      <v-icon color="blue" disabled class="px-3"
                        >mdi-download</v-icon
                      >
                    </a>
                  </template>
                  <span>{{ $t("no_file_available") }}</span>
                </v-tooltip>
              </div>
            </td>

            <td class="text-center px-0" v-if="view == 'userview' && status">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    small
                    class="mr-3 edit_btn icon_size"
                    v-on="on"
                    @click="editProofDetails(item.id)"
                    >mdi-pencil-outline</v-icon
                  >
                </template>
                <span>{{ $t("edit") }}</span>
              </v-tooltip>
              <v-tooltip bottom v-if="item.check_proof_type_id == 0">
                <template v-slot:activator="{ on }">
                  <v-icon
                    class="delete_btn icon_size"
                    v-on="on"
                    small
                    @click="deleteItem(item.id)"
                    >mdi-trash-can-outline</v-icon
                  >
                </template>
                <span>{{ $t("delete") }}</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-dialog
        persistent
        v-model="id_Proof_dialog"
        fullscreen
        transition="dialog-bottom-transition"
        max-width="800px"
      >
        <v-card>
          <v-toolbar color="primary" dark>
            <span class="headline">
              {{ $t("create_amend_emp_proof_details") }}
            </span>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  @click="closeDialog"
                  class="dialogcloseinuserdetails"
                  v-on="on"
                  >mdi-close</v-icon
                >
              </template>
              <span>{{ $t("close") }}</span>
            </v-tooltip>
          </v-toolbar>
          <v-alert
            v-model="save_error"
            :text="save_error"
            color="error"
            icon="warning"
            outlined
            dismissible
          >
            {{ valertdialogmessage }}</v-alert
          >
          <v-form ref="empproof" v-model="valid">
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-on="on"
                          :rules="fieldRules"
                          v-model="emp_proof.proof_id"
                          dense
                          v-bind:label="$t('proof_name')"
                          outlined
                          class="required_field"
                        ></v-text-field>
                      </template>
                      <span>{{ $t("proof_name") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 sm6 md8 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-on="on"
                          v-model="emp_proof.proof_data"
                          :rules="proofRules"
                          dense
                          v-bind:label="$t('proof_no')"
                          outlined
                          :maxlength="text_field_max_length"
                          class="required_field"
                          @keydown="checkKeyDownAlphaNumeric($event)"
                          @keyup="uppercase"
                        ></v-text-field>
                      </template>
                      <span>{{ $t("proof_no") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 sm6 md4 pl-2>
                    <template>
                      <DatePicker
                        :label="$t('issue_date')"
                        :stored_date="emp_proof.issue_date"
                        :max="new Date().toISOString().substr(0, 10)"
                        @formatted_date="formatted_issue_date"
                        dense
                      />
                    </template>
                  </v-flex>
                  <v-flex xs12 sm6 md4 pl-2>
                    <template>
                      <DatePicker
                        :label="$t('expiry_date')"
                        :stored_date="emp_proof.expiry_date"
                        @formatted_date="formatted_expiry_date"
                        dense
                        :min="emp_proof.issue_date"
                      />
                    </template>
                  </v-flex>
                  <v-flex xs12 sm6 md4 pl-2 class>
                    <div class="browsedivdoc">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            readonly
                            outlined
                            dense
                            v-on="on"
                            @click="callDocumentSelect"
                            v-model="emp_proof.doct_type"
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
                    <!-- {{emp_proof.doct_type}} -->
                    <!-- <div v-if="emp_proof.doct_type">
                      <a :href="document_url  +  emp_proof.doct_type" download>
                        <p class="download_color">Download</p>
                      </a>
                    </div> -->
                    <div v-if="emp_proof.doct_type">
                      <a
                        :href="document_url + emp_proof.doct_type"
                        class="text-primary f-13 a-underline"
                      >
                        {{ $t("download") }}
                      </a>
                    </div>
                  </v-flex>
                  <v-flex xs12 sm6 md12 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-textarea
                          v-on="on"
                          v-model="emp_proof.description"
                          dense
                          counter="200"
                          rows="2"
                          v-bind:label="$t('description')"
                          outlined
                          maxlength="200"
                        ></v-textarea>
                      </template>
                      <span>{{ $t("proof_no") }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
                <v-layout wrap> </v-layout>
                <v-layout>
                  <v-flex xs12 sm6 md4 style="display: none">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <span v-on="on">
                          <DocumentSelect
                            :label="'Proof '"
                            :folder="'ProofDocument'"
                            :uploadtype="enable_document_select"
                            @closeDialog="closeDocumentSelectDialog"
                            @uploadedDocument="uploadedDocument"
                            :documentlink="emp_proof.doct_type"
                          ></DocumentSelect>
                        </span>
                      </template>
                      <span>{{ $t("file_input") }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions class="container">
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <div v-on="on" class="d-inline-block mr-2">
                    <v-btn
                      v-on="on"
                      small
                      @click="closeDialog"
                      class="ma-1 font-weight-bold mb-3"
                      color="secondary"
                      >{{ $t("cancel") }}</v-btn
                    >
                  </div>
                </template>
                <span>{{ $t("cancel") }}</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    :disabled="isDisabled"
                    v-on="on"
                    @click="saveEmpIdProofs()"
                    small
                    class="mr-2 success hover_shine mb-3"
                    color="green darken-1"
                  >
                    {{ $t("submit") }}
                    <b-spinner
                      :disabled="isBtnLoading"
                      small
                      v-if="isBtnLoading"
                    ></b-spinner>
                  </v-btn>
                </template>
                <span>{{ $t("submit") }}</span>
              </v-tooltip>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
      <ConfirmDialog
        :show="showConfirmDialog"
        :cancel="cancel"
        :confirm="confirm"
        :id="delete_id"
        v-bind:title="$t('confirm')"
        v-bind:description="$t('delete_confirmation')"
      />
    </div>
  </div>
</template>
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import DatePicker from "../Components/DatePicker.vue";
import DocumentSelect from "../Components/Upload/DocumentSelect.vue";
export default {
  components: {
    DatePicker,
    PageTitle,
    ConfirmDialog,
    DocumentSelect,
  },
  props: ["user_id", "view", "status"],
  data: () => ({
    search: "",
    valertdialogmessage: "",
    save_error: false,
    google_icon: {
      icon_name: "location_city ",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    document_url: process.env.VUE_APP_IMAGE_PATH,
    id_Proof_dialog: false,
    isBtnLoading: false,
    isDisabled: false,
    emp_proof_data: [],
    employee_proof_array: [],
    valid: true,
    emp_proof_name: "",
    text_field_max_length: "",
    delete_id: null,
    showConfirmDialog: false,
    initval: false,
    proof_type_array: [],
    proof_type_longname: "",
    enable_document_select: "",
    emp_proof: {
      id: 0,
      id_type: null,
      proof_id: null,
      proof_data: "",
      emp_id: null,
      issue_date: "",
      expiry_date: "",
      description: "",
      doct_type: "",
    },
  }),
  mounted() {
    this.fetchLookup();
  },
  watch: {
    user_id: {
      immediate: true,
      handler() {
        if (this.user_id) {
          this.fetchEmpProofDetails();
        }
      },
    },
  },
  computed: {
    proofRules() {
      if (this.emp_proof_name == "Passport") {
        this.text_field_max_length = "8";
        return [
          (v) => /[a-zA-Z]{1}[0-9]{7}/.test(v) || this.$t("passport_valid"),
        ];
      } else if (this.emp_proof_name == "Aadhar Card") {
        this.text_field_max_length = "12";
        return [(v) => /[0-9]{12}/.test(v) || this.$t("adharcard_valid")];
      } else if (this.emp_proof_name == "PAN") {
        this.text_field_max_length = "10";
        return [
          (v) => /[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v) || this.$t("pan_valid"),
        ];
      } else if (this.emp_proof_name == "Driving License") {
        this.text_field_max_length = "16";
        return [
          (v) =>
            /[A-Z]{2}-[0-9]{2}[0-9][0-9][0-9]{7}$/.test(v) ||
            this.$t("driving_license_valid"),
        ];
      } else {
        return [(v) => !!v || this.$t("field_required")];
      }
    },
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    emp_proof_headers() {
      if (this.view == "userview" && this.status) {
        return [
          {
            text: this.$t("doc_section"),
            value: "check_proof_type",
            sortable: true,
          },
          {
            text: this.$t("proof_name"),
            value: "proof_id",
            sortable: true,
          },
          {
            text: this.$t("proof_no"),
            value: "proof_data",
            sortable: true,
          },
          {
            text: this.$t("issue_date"),
            value: "issue_date",
            sortable: true,
          },
          {
            text: this.$t("expiry_date"),
            value: "expiry_date",
            sortable: true,
          },
          {
            text: this.$t("description"),
            value: "description",
            sortable: true,
          },
          {
            text: this.$t("document_download"),
            align: "",
            value: "class_name",
          },
          {
            text: this.$t("action"),
            align: "center",
            value: "class_name",
          },
        ];
      } else {
        return [
          {
            text: this.$t("proof_id"),
            value: "proof_id",
            sortable: true,
          },
          {
            text: this.$t("proof_data"),
            value: "proof_data",
            sortable: true,
          },
          {
            text: "",
            sortable: true,
          },
        ];
      }
    },
  },
  methods: {
    uploadedDocument(file_path) {
      this.emp_proof.doct_type = file_path;
      this.closeDocumentSelectDialog();
    },
    closeDocumentSelectDialog(uploadtype) {
      this.enable_document_select = "";
      console.log("close dialog", uploadtype);
    },
    callDocumentSelect() {
      this.enable_document_select = "DragDrop";
    },
    formatted_issue_date(formatted_date) {
      this.emp_proof.issue_date = formatted_date;
      this.emp_proof.expiry_date = "";
    },
    formatted_expiry_date(formatted_date) {
      this.emp_proof.expiry_date = formatted_date;
    },
    // proofType(type_id) {
    //   // proof_type_array.find(id==type_id);
    //   this.proof_type_longname = this.proof_type_array.find(
    //     (x) => x.id === type_id
    //   ).shortname;
    // },
    deleteItem(id) {
      this.delete_id = id;
      this.showConfirmDialog = true;
    },
    confirm(id) {
      this.deleteConfirm(id);
      this.showConfirmDialog = false;
    },
    deleteConfirm(id) {
      this.deleteEmpProofDetails(id);
    },
    cancel() {
      this.showConfirmDialog = false;
    },
    deleteEmpProofDetails(id) {
      this.initval = true;
      this.showConfirmDialog = false;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "delete_emp_proof_details/" + id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.fetchEmpProofDetails();
            this.initval = false;
            this.message = res.data.message;
            this.flashMessage.success({
              message: this.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
          }
        })
        .catch((err) => {
          this.initval = false;
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
        });
    },
    editProofDetails(id) {
      this.initval = true;
      // this.empbank_dialog = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetch_emp_proof_details_by_id",
          {
            params: {
              id: id,
            },
          }
        )

        .then((res) => {
          if (res.data.status == "S") {
            this.message = res.data.message;
            this.emp_proof = res.data.emp_proof_details;
            //this.emp_proof.doct_type = res.data.emp_proof_details.doct_type.substring(23);
            // this.empProofData(this.emp_proof.proof_id);
            this.id_Proof_dialog = true;
            this.initval = false;
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          this.initval = false;
          console.log(" error" + err);
        });
    },
    fetchEmpProofDetails() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_emp_proof_details", {
          params: {
            user_id: this.user_id,
          },
        })
        .then((res) => {
          this.emp_proof_data = res.data.emp_proof_details;
          this.initval = false;
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
        });
    },
    uppercase() {
      if (this.emp_proof_name != "") {
        this.emp_proof.proof_data = this.emp_proof.proof_data.toUpperCase();
      }
    },
    checkKeyDownAlphaNumeric(event) {
      if (
        this.emp_proof_name == "Passport" ||
        this.emp_proof_name == "PAN" ||
        this.emp_proof_name == "Driving License"
      ) {
        if (!/[a-zA-Z0-9\s]/.test(event.key)) {
          this.ignoredValue = event.key ? event.key : "";
          event.preventDefault();
        }
      } else if (this.emp_proof_name == "Aadhar Card") {
        event = event ? event : window.event;
        var charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          event.preventDefault();
        }
        return true;
      }
    },
    // empProofData(proof_id) {
    //   this.emp_proof_name = this.employee_proof_array.find(
    //     (x) => x.id == proof_id
    //   ).longname;
    // },
    fetchLookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "DOCTYPE",
          },
        })
        .then((response) => {
          this.employee_proof_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "PROOF_TYPE",
          },
        })
        .then((response) => {
          this.proof_type_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    dialogIdProof() {
      (this.enable_document_select = ""), (this.id_Proof_dialog = true);
      this.emp_proof.proof_id = null;
      this.emp_proof.id_type = null;
      this.emp_proof.proof_data = "";
      this.emp_proof.issue_date = "";
      this.emp_proof.expiry_date = "";
      this.emp_proof.description = "";
      this.emp_proof.doct_type = "";
      this.emp_proof.id = 0;
      this.emp_id = null;
    },
    closeDialog() {
      (this.save_error = false), (this.id_Proof_dialog = false);
    },
    saveEmpIdProofs() {
      if (this.$refs.empproof.validate()) {
        this.isBtnLoading = true;
        this.isDisabled = true;
        this.emp_proof.emp_id = this.user_id;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "create_emp_proof_details",
            this.emp_proof
          )
          .then((response) => {
            if (response.data.status == "S") {
              this.flashMessage.success({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.id_Proof_dialog = false;
              this.isBtnLoading = false;
              this.isDisabled = false;
              this.fetchEmpProofDetails();
            } else if (response.data.status == "E") {
              this.valertdialogmessage = response.data.message;
              this.save_error = true;
              this.isBtnLoading = false;
              this.isDisabled = false;
            } else {
              this.valertdialogmessage = response.data.message;
              this.save_error = true;
              this.isBtnLoading = false;
              this.isDisabled = false;
            }
          })
          .catch((err) => {
            this.valertdialogmessage = this.$t("something_went_wrong");
            this.save_error = true;
            console.log(err);
            this.id_Proof_dialog = false;
            this.isBtnLoading = false;
          });
      }
    },
  },
};
</script>
<style scoped>
.uppercase {
  text-transform: uppercase;
}

.download_color {
  color: #3f6ad8;
  font: size 15px;
  margin-top: -23px;
  cursor: pointer;
}

.browsedivdoc {
  display: inline-flex;
  width: 100%;
  position: relative;
}

.browsedivdoc /deep/ .v-chip {
  border-radius: 0%;
}

.browsebtndoc {
  height: 40px;
  margin-left: -10%;
}
.browsedivdoc /deep/ .v-text-field__details {
  display: none;
}

.leavedetailscard {
  font-size: 15px;
  text-align: center;
  font-weight: 500;
  /* font-family: "Roboto"; */
  background-color: rgb(22, 113, 205);
  height: 35px;
  color: #eeeeee;
  padding-top: 5px;
}

.leavecountcard {
  text-align: center;
  font-size: 20px;
  /* font-family: sans-serif; */
  font-weight: 500;
  /* border: solid 1px dodgerblue; */
}

.documentdownloadapplyleave {
  position: absolute;
  right: 3px;
  top: 40px;
  font-size: 13px;
  font-weight: 600;
}

.download_margin {
  margin-top: -20px;
}

.documentdownloadapplyleave:hover {
  font-weight: 700;
  cursor: pointer;
}

.documentdeleteapplyleave {
  position: absolute;
  left: -22px;
  top: 9px;
  cursor: pointer;
}
</style>
