<template>
  <div>
    <v-app-bar flat color="white">
      <div class="add_btn_end">
      <v-tooltip bottom v-if="user_id">
        <template v-slot:activator="{ on }">
          <v-btn
            v-if="view == 'userview' && status"
            class="btn mr-2 mb-2 hover_shine add_new"
            small
            v-on="on"
            @click="visaAddbtn"
          >
            {{ $t("add") }}
          </v-btn>
        </template>
        <span>{{ $t("add") }}</span>
      </v-tooltip>
      </div>
    </v-app-bar>
    <v-alert
      v-if="valid_error"
      :text="valid_error"
      color="error"
      icon="warning"
      outlined
      dismissible
      class="pr-6 mr-6"
    >
      {{ valertmessgae }}</v-alert
    >
    <v-data-table
      :headers="headers"
      class="pt-3"
      :items="visa_data"
      :loading="initval"
    >
      <template v-slot:item="props">
        <tr>
          <td>{{ props.item.visa_no }}</td>
          <td v-if="props.item.passport_id">
            {{ props.item.fetchpassportdetails.passport_no }}
          </td>
          <td v-else>{{ $t("not_appllicable") }}</td>
          <td>{{ props.item.type_visa_issued }}</td>
          <td>{{ props.item.visa_issuing_authority }}</td>
          <td>{{ props.item.date_of_issue | formatDate }}</td>
          <td>{{ props.item.date_of_expiry | formatDate }}</td>
          <td>
            <v-chip
              v-if="props.item.date_of_expiry >= todaysdate"
              small
              color="success"
              class="vchippassportstatus"
            >
              <span>{{ $t("active") }}</span></v-chip
            >
            <v-chip v-else small color="error" class="vchippassportstatus">
              <span>{{ $t("expired") }}</span>
            </v-chip>
          </td>
          <td v-if="view == 'userview' && status">
            <div v-if="props.item.visa_document">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <a
                    v-on="on"
                    class="text-center"
                    :href="document_url + props.item.visa_document"
                    target="_blank"
                  >
                    <v-icon color="blue" class="px-3">mdi-download</v-icon>
                  </a>
                </template>
                <span>{{ $t("Download") }}</span>
              </v-tooltip>
            </div>
            <span v-else>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <div v-on="on">
                    <v-icon disabled class="px-3">mdi-download</v-icon>
                  </div>
                </template>
                <span>{{ $t("no_doc") }}</span>
              </v-tooltip>
            </span>
          </td>
          <td v-if="view == 'userview' && status">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  class="mr-3 edit_btn icon_size"
                  v-on="on"
                  @click="editVisa(props.item.id, props.item.date_of_expiry)"
                >
                  mdi-pencil-outline</v-icon
                >
              </template>
              <span>{{ $t("edit") }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  class="delete_btn icon_size"
                  v-on="on"
                  small
                  :disabled="props.item.date_of_expiry < todaysdate"
                  @click="deleteItem(props.item.id)"
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
      v-model="dialog"
      fullscreen
      transition="dialog-bottom-transition"
      max-width="1100px"
    >
      <v-card>
        <v-toolbar color="primary" dark>
          <span class="headline">{{ $t("create_amend_visa_details") }}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon @click="close" class="dialogcloseinuserdetails" v-on="on"
                >mdi-close</v-icon
              >
            </template>
            <span>{{ $t("close") }}</span>
          </v-tooltip>
        </v-toolbar>
        <v-alert
          v-if="save_error"
          :text="save_error"
          color="error"
          icon="warning"
          outlined
          dismissible
        >
          {{ valertdialogmessage }}</v-alert
        >
        <v-form ref="userform" v-model="valid">
          <v-card-text class="mt-8">
            <v-container grid-list-md>
              <v-layout wrap>
                <v-row v-if="visaDetails.passport_id > 0">
                  <v-spacer></v-spacer>
                  <div class="row displaypassportdetailsinvisa">
                    <span> {{ $t("passport_issue_date") }} :</span>
                    <b class="ml-2">
                      {{ passport_date_of_issue | formatDate }}</b
                    >
                    <span class="ml-8">
                      {{ $t("passport_expiry_date") }} :</span
                    >
                    <b class="ml-2">
                      {{ passport_date_of_expiry | formatDate }}</b
                    >
                  </div>
                </v-row>
              </v-layout>
              <v-layout wrap>
                <v-flex md6 pl-2 v-if="!showlov">
                  <v-autocomplete
                    dense
                    outlined
                    v-bind:label="$t('passport_no')"
                    @change="
                      fetchpassportvalidationdate(visaDetails.passport_id)
                    "
                    v-model="visaDetails.passport_id"
                    :items="passportDetails"
                    item-text="passport_no"
                    :rules="fieldRules"
                    class="required_field"
                    item-value="id"
                  ></v-autocomplete>
                </v-flex>
                <v-flex md6 pl-2 v-else>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        dense
                        outlined
                        v-on="on"
                        v-bind:label="$t('passport_no')"
                        v-model="visaDetails.fetchpassportdetails.passport_no"
                        class="required_field"
                        readonly
                      ></v-text-field>
                    </template>
                    <span>{{ $t("passport_no") }}</span>
                  </v-tooltip>
                </v-flex>
                <v-flex md6 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-on="on"
                        dense
                        outlined
                        v-bind:label="$t('visa_no')"
                        v-model="visaDetails.visa_no"
                        :readonly="!dialogedit"
                        :rules="fieldRules"
                        class="required_field"
                        maxlength="10"
                      ></v-text-field>
                    </template>
                    <span>{{ $t("visa_no") }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>

              <v-layout wrap>
                <v-flex md6 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        dense
                        outlined
                        v-on="on"
                        v-bind:label="$t('type_of_visa_issued')"
                        :rules="fieldRules"
                        :readonly="!dialogedit"
                        class="required_field"
                        v-model="visaDetails.type_visa_issued"
                      ></v-text-field>
                    </template>
                    <span>{{ $t("type_of_visa_issued") }}</span>
                  </v-tooltip>
                </v-flex>
                <v-flex md6 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-on="on"
                        dense
                        outlined
                        v-bind:label="$t('visa_issuing_auth')"
                        v-model="visaDetails.visa_issuing_authority"
                        :readonly="!dialogedit"
                        :rules="fieldRules"
                        class="required_field"
                      ></v-text-field>
                    </template>
                    <span>{{ $t("visa_issuing_auth") }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>

              <v-layout wrap>
                <v-flex md6 pl-2>
                  <DatePicker
                    :label="$t('date_of_issue')"
                    :rules="fieldRules"
                    :class_required="'RequiredField'"
                    v-if="dialogedit"
                    :stored_date="visaDetails.date_of_issue"
                    :min="passport_date_of_issue"
                    :max="new Date().toISOString().substr(0, 10)"
                    @formatted_date="formatteddateofIssue"
                  />
                  <v-text-field
                    v-on="on"
                    dense
                    outlined
                    v-bind:label="$t('date_of_issue')"
                    v-else
                    v-model="visaDetails.date_of_issue"
                    readonly
                    class="required_field"
                  ></v-text-field>
                </v-flex>
                <v-flex md6 pl-2>
                  <DatePicker
                    :label="$t('date_of_expiry')"
                    :rules="fieldRules"
                    :class_required="'RequiredField'"
                    v-if="dialogedit"
                    :stored_date="visaDetails.date_of_expiry"
                    :min="visaDetails.date_of_issue"
                    @formatted_date="formatteddateofExpiry"
                  />
                  <v-text-field
                    v-on="on"
                    dense
                    outlined
                    v-bind:label="$t('date_of_expiry')"
                    v-else
                    v-model="visaDetails.date_of_expiry"
                    readonly
                    class="required_field"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 sm6 md4 pl-2 class>
                  <div class="browsedivdoc" v-if="dialogedit">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          readonly
                          outlined
                          dense
                          v-on="on"
                          @click="callDocumentSelect"
                          v-model="visaDetails.doct_type"
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
                  <div
                    class="browsedivdoc"
                    v-else-if="visaDetails.doct_type && !dialogedit"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          readonly
                          outlined
                          dense
                          v-on="on"
                          v-model="visaDetails.doct_type"
                          v-bind:label="$t('upload_doc')"
                        ></v-text-field>
                        <v-chip
                          label
                          class="browsebtndoc"
                          color="primary"
                          v-on="on"
                          >{{ $t("browse") }}</v-chip
                        >
                      </template>
                      <span>{{ $t("upload_doc") }}</span>
                    </v-tooltip>
                  </div>
                  <!-- dialogedit -->
                  <div
                    v-if="visaDetails.doct_type"
                    class="documentdownloadapplyleave"
                  >
                    <a
                      :href="document_url + visaDetails.doct_type"
                      class="text-primary f-13 a-underline"
                    >
                      {{ $t("download") }}
                    </a>
                  </div>
                </v-flex>
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
                          :documentlink="visaDetails.doct_type"
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
                    @click="close"
                    class="font-weight-bold mb-3"
                    color="secondary"
                    >{{ $t("cancel") }}</v-btn
                  >
                </div>
              </template>
              <span>{{ $t("cancel") }}</span>
            </v-tooltip>
            <v-tooltip top v-if="dialogedit">
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  @click="saveVisa()"
                  small
                  class="mr-2 success hover_shine mb-3"
                  color="green darken-1"
                  :disabled="isBtnLoading"
                >
                  {{ $t("submit") }}
                  <b-spinner small v-if="isBtnLoading"></b-spinner>
                </v-btn>
              </template>
              <span> {{ $t("submit") }} </span>
            </v-tooltip>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <ConfirmDialog
      :show="showConfirmDialog"
      :cancel="cancel"
      :confirm="confirmDelete"
      :id="delete_id"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('delete_confirmation')"
    />
  </div>
</template>
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import DatePicker from "../Components/DatePicker.vue";
import DocumentSelect from "../Components/Upload/DocumentSelect.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
export default {
  props: ["user_id", "view", "status"],
  components: {
    PageTitle,
    DatePicker,
    DocumentSelect,
    ConfirmDialog,
  },
  data: () => ({
    document_url: process.env.VUE_APP_IMAGE_PATH,
    todaysdate: new Date().toISOString().substr(0, 10),
    visaDetails: {
      id: 0,
      emp_id: "",
      passport_id: "",
      visa_no: "",
      type_visa_issued: "",
      visa_issuing_authority: "",
      date_of_issue: "",
      date_of_expiry: "",
      doct_type: "",
    },
    passport_date_of_issue: "",
    passport_date_of_expiry: "",
    valid: true,
    dialogedit: true,
    showlov: false,
    valertdialogmessage: "",
    save_error: false,
    delete_id: null,
    valertmessgae: "",
    valid_error: false,
    showConfirmDialog: false,
    enable_document_select: "",
    initval: false,
    dialog: false,
    isBtnLoading: false,
    passportDetails: [],
    visa_data: [],
  }),
  mounted() {
    this.$eventBus.$on("passport", this.addPassport);
  },
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    headers() {
      if (this.view == "userview" && this.status) {
        return [
          {
            text: "Visa No",
            align: "left",
            value: "visa_no",
          },
          {
            text: "Passport No",
            align: "left",
            value: "fetchpassportdetails.passport_no",
          },
          {
            text: "Type of Visa Issued",
            value: "type_visa_issued",
            align: "left",
          },
          {
            text: "Visa Issuing Authority",
            value: "visa_issuing_authority",
            align: "left",
          },
          {
            text: "Date of Issue",
            value: "date_of_issue",
            align: "left",
          },
          {
            text: "Date of Expiry",
            value: "date_of_expiry",
            align: "left",
          },
          {
            text: "Status",
            sortable: false,
            align: "left",
          },
          {
            text: "Document",
            value: "passport_document",
            align: "left",
          },
          {
            text: "Action",
            value: "",
            align: "left",
          },
        ];
      } else {
        return [
          {
            text: "Passport No",
            align: "left",
            value: "fetchpassportdetails.passport_no",
          },
          {
            text: "Visa No",
            align: "left",
            value: "visa_no",
          },

          {
            text: "Type of Visa Issued",
            value: "type_visa_issued",
            align: "left",
          },
          {
            text: "Visa Issuing Authority",
            value: "visa_issuing_authority",
            align: "left",
          },
          {
            text: "Date of Issue",
            value: "date_of_issue",
            align: "left",
          },
          {
            text: "Date of Expiry",
            value: "date_of_expiry",
            align: "left",
          },
          {
            text: "Status",
            sortable: false,
            align: "left",
          },
        ];
      }
    },
  },

  watch: {
    user_id: {
      immediate: true,
      handler() {
        if (this.user_id) {
          this.fetchPasspostdetails();
          this.fetchvisadetailsdata();
        }
      },
    },
  },
  methods: {
    confirmDelete() {
      this.deleteVisaDetails();
      this.showConfirmDialog = false;
    },
    cancel() {
      this.showConfirmDialog = false;
    },
    deleteItem(id) {
      this.delete_id = id;
      this.showConfirmDialog = true;
    },
    deleteVisaDetails() {
      this.valid_error = false;
      this.valertmessgae = "";
      this.initval = true;
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "deletevisadetails", {
          id: this.delete_id,
        })
        .then((response) => {
          if (response.data.status == "S") {
            this.initval = false;
            this.flashMessage.success({
              message: response.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.fetchvisadetailsdata();
          } else if (response.data.status == "EXIST") {
            this.initval = false;
            (this.valertmessgae = response.data.message),
              (this.valid_error = true);
          } else {
            this.initval = false;
            (this.valertmessgae = response.data.message),
              (this.valid_error = true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    uploadedDocument(file_path) {
      this.visaDetails.doct_type = file_path;
      this.closeDocumentSelectDialog();
    },
    closeDocumentSelectDialog(uploadtype) {
      this.enable_document_select = "";
    },
    callDocumentSelect() {
      this.enable_document_select = "DragDrop";
    },
    addPassport() {
      this.fetchPasspostdetails();
    },
    editVisa(id, expire) {
      this.visaDetails = [];
      this.passport_date_of_issue = "";
      this.passport_date_of_issue = "";
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetchvisadetailsdatasforedit",
          {
            params: {
              id: id,
              emp_id: this.user_id,
            },
          }
        )
        .then((response) => {
          if (response.data.status == "S") {
            this.visaDetails = response.data.data;
            this.passport_date_of_expiry =
              response.data.passport_date_of_expiry;
            this.passport_date_of_issue = response.data.passport_date_of_issue;
            this.showlov = true;
            this.initval = false;
            if (expire >= this.todaysdate) {
              this.dialogedit = true;
            } else {
              this.dialogedit = false;
            }
            this.showlov = true;
            this.dialog = true;
          } else if (response.data.status == "EXIST") {
            // this.visaDetails = response.data.data;
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.initval = false;
            this.dialog = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchvisadetailsdata() {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetchvisadetailsdatas/" +
            this.user_id
        )
        .then((response) => {
          if (response.data.status == "S") {
            this.visa_data = response.data.visadetails;
            this.$emit("visaDataLength", this.visa_data.length);
            this.$eventBus.$emit("visa_length");
            this.initval = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchpassportvalidationdate(pass_id) {
      this.passport_date_of_issue = "";
      this.passport_date_of_expiry = "";
      this.passport_date_of_issue = this.passportDetails.find(
        (x) => x.id == pass_id
      ).date_of_issue;
      this.passport_date_of_expiry = this.passportDetails.find(
        (x) => x.id == pass_id
      ).date_of_expiry;
    },
    fetchPasspostdetails() {
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetchpassportdetailslov/" +
            this.user_id
        )
        .then((response) => {
          if (response.data.status == "S") {
            this.passportDetails = response.data.passportdetails;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    saveVisa() {
      if (this.$refs.userform.validate()) {
        this.isBtnLoading = true;
        this.visaDetails.emp_id = this.user_id;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "createvisadetails",
            this.visaDetails
          )
          .then((response) => {
            if (response.data.status == "S") {
              this.flashMessage.success({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.visaDetails.passport_id = "";
              this.visaDetails = {
                id: 0,
                emp_id: "",
                passport_id: "",
                visa_no: "",
                type_visa_issued: "",
                visa_issuing_authority: "",
                date_of_issue: "",
                date_of_expiry: "",
                doct_type: "",
              };
              this.$refs.userform.reset();

              this.isBtnLoading = false;
              this.close();
              this.fetchvisadetailsdata();
            } else if (response.data.status == "EXIST") {
              (this.valertdialogmessage = response.data.message),
                (this.isBtnLoading = false);
              this.save_error = true;
            } else if (response.data.status == "VISAEXIST") {
              (this.valertdialogmessage = response.data.message),
                (this.isBtnLoading = false);
              this.save_error = true;
            } else {
              (this.valertdialogmessage = response.data.message),
                (this.isBtnLoading = false);
              this.save_error = true;
            }

            this.close();
          })
          .catch((err) => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.isBtnLoading = false;
          });
      }
    },
    visaAddbtn() {
      this.showlov = false;
      if (this.passportDetails.length < 1) {
        this.flashMessage.error({
          message: this.$t("add_passport_details_first"),
          time: 4000,
          blockClass: "custom-block-class",
        });
      } else {
        this.dialogedit = true;
        this.visaDetails.emp_id = this.user_id;
        this.visaDetails.id = 0;
        this.save_error = false;
        this.valertdialogmessage = "";
        this.dialog = true;
      }
    },
    close() {
      this.showlov = false;
      this.$refs.userform.reset();
      this.dialog = false;
      this.passport_date_of_expiry = "";
      this.passport_date_of_issue = "";
      this.save_error = false;
      this.visaDetails = {
        id: 0,
        emp_id: "",
        passport_id: "",
        visa_no: "",
        type_visa_issued: "",
        visa_issuing_authority: "",
        date_of_issue: "",
        date_of_expiry: "",
        doct_type: "",
      };
    },
    formatteddateofIssue(formatted_date) {
      this.visaDetails.date_of_issue = formatted_date;
      if (this.visaDetails.date_of_issue > this.visaDetails.date_of_expiry) {
        this.visaDetails.date_of_expiry = "";
      }
    },
    formatteddateofExpiry(formatted_date) {
      this.visaDetails.date_of_expiry = formatted_date;
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
  },
};
</script>
<style scoped>
/* .documentdownloadapplyleave {
  position: absolute;
  right: 3px;
  top: 40px;
  font-size: 13px;
  font-weight: 600;
} */

.browsedivdoc {
  display: inline-flex;
  width: 100%;
  position: relative;
}

.browsedivdoc /deep/ .v-chip {
  border-radius: 0%;
}

.browsedivdoc /deep/ .v-text-field__details {
  display: none;
}

.browsebtndoc {
  height: 40px;
  margin-left: -10%;
}

.displaypassportdetailsinvisa {
  position: absolute;
  right: 157pt;
  margin-bottom: 10px;
  font-size: 14px;
  color: #04043c;
}
.add_btn_end{
  width: 100%;
  text-align: end;
}
</style>
