<template>
  <div>
    <v-app-bar flat color="white">
      <div class="add_btn_end">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            v-if="view == 'userview' && status"
            class="btn mr-2 mb-2 hover_shine add_new"
            small
            v-on="on"
            @click="passportAddbtn"
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
      :items="passport_data"
      :loading="initval"
    >
      <template v-slot:item="props">
        <tr>
          <td>{{ props.item.passport_no }}</td>
          <td>{{ props.item.issuing_authority }}</td>
          <td>{{ props.item.date_of_issue | formatDate }}</td>
          <td>{{ props.item.date_of_expiry | formatDate }}</td>
          <td>{{ props.item.place_of_issue }}</td>
          <td>{{ props.item.document_status }}</td>
          <td>
            <v-chip
              v-if="
                (props.item.document_status == 'In Possession' ||
                  props.item.document_status == 'Active') &&
                props.item.date_of_expiry >= todaysdate
              "
              small
              color="success"
              class="vchippassportstatus"
            >
              <span>{{ $t("active") }}</span></v-chip
            >
            <v-chip
              v-else-if="props.item.document_status == 'Lost'"
              small
              color="warning"
              class="vchippassportstatus"
            >
              <span>{{ $t("lost") }}</span>
            </v-chip>
            <v-chip v-else small color="error" class="vchippassportstatus">
              <span>{{ $t("expired") }}</span>
            </v-chip>
          </td>
          <td v-if="view == 'userview' && status">
            <div v-if="props.item.passport_document">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <a
                    v-on="on"
                    class="text-center"
                    :href="document_url + props.item.passport_document"
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
                    <v-icon disabled readonly class="px-3">mdi-download</v-icon>
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
                  @click="
                    editPassport(
                      props.item.id,
                      props.item.date_of_expiry,
                      props.item.document_status
                    )
                  "
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
                  :disabled="
                    props.item.document_status != 'Lost' &&
                    props.item.date_of_expiry < todaysdate
                  "
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
          <span class="headline">{{
            $t("create_amend_passport_details")
          }}</span>
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
          v-if="valid_error_dialog"
          :text="valid_error_dialog"
          color="error"
          icon="warning"
          outlined
          dismissible
        >
          {{ valertmessgaedialog }}</v-alert
        >
        <v-form ref="userform" v-model="valid">
          <v-card-text class="mt-8">
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex md6 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        dense
                        outlined
                        v-on="on"
                        v-bind:label="$t('passport_no')"
                        maxlength="10"
                        :readonly="!passportActive"
                        :rules="fieldRules"
                        class="required_field"
                        @keyup="uppercasepassport"
                        v-model="passportDetails.passport_no"
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
                        v-bind:label="$t('issuing_auth')"
                        v-model="passportDetails.issuing_authority"
                        :rules="fieldRules"
                        :readonly="!passportActive"
                        class="required_field"
                      ></v-text-field>
                    </template>
                    <span>{{ $t("issuing_auth") }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex md6 pl-2>
                  <DatePicker
                    :label="$t('date_of_issue')"
                    :rules="fieldRules"
                    :class_required="'RequiredField'"
                    :stored_date="passportDetails.date_of_issue"
                    :max="new Date().toISOString().substr(0, 10)"
                    :readonly="!passportActive"
                    @formatted_date="formatteddateofIssue"
                  />
                </v-flex>
                <v-flex md6 pl-2>
                  <DatePicker
                    :label="$t('date_of_expiry')"
                    :rules="fieldRules"
                    :class_required="'RequiredField'"
                    :stored_date="passportDetails.date_of_expiry"
                    :min="passportDetails.date_of_issue"
                    :readonly="!passportActive"
                    @formatted_date="formatteddateofExpiry"
                  />
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
                        v-bind:label="$t('place_of_issue')"
                        :rules="fieldRules"
                        :readonly="!passportActive"
                        class="required_field"
                        v-model="passportDetails.place_of_issue"
                      ></v-text-field>
                    </template>
                    <span>{{ $t("place_of_issue") }}</span>
                  </v-tooltip>
                </v-flex>
                <v-flex md6 pl-2 class="createlookupflex">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-select
                        v-on="on"
                        dense
                        outlined
                        v-bind:label="$t('doc_status')"
                        v-model="passportDetails.document_status"
                        :rules="fieldRules"
                        item-value="longname"
                        :readonly="!passportActive"
                        item-text="longname"
                        :items="docStatus"
                        class="required_field"
                      ></v-select>
                    </template>
                    <span>{{ $t("doc_status") }}</span>
                  </v-tooltip>
                  <CreateLookup
                    lookup_parent_name="PASSPORT_DOCUMENT_STATUS"
                    @lookup_data="lookupMessage"
                    :dropdownlabel="$t('doc_status')"
                  ></CreateLookup>
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex xs12 sm6 md4 pl-2 class>
                  <div class="browsedivdoc" v-if="passportActive">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          readonly
                          outlined
                          dense
                          v-on="on"
                          @click="callDocumentSelect"
                          v-model="passportDetails.doct_type"
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
                    v-else-if="!passportActive && passportDetails.doct_type"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          readonly
                          outlined
                          dense
                          v-on="on"
                          v-model="passportDetails.doct_type"
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

                  <div
                    v-if="passportDetails.doct_type"
                    class="documentdownloadapplyleave"
                  >
                    <a
                      :href="document_url + passportDetails.doct_type"
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
                          :documentlink="passportDetails.doct_type"
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
            <v-tooltip top v-if="passportActive">
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  @click="savepassport()"
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
import CreateLookup from "../../../Pages/CreateLookup.vue";
export default {
  props: ["user_id", "view", "status"],
  components: {
    PageTitle,
    DatePicker,
    DocumentSelect,
    ConfirmDialog,
    CreateLookup,
  },
  data: () => ({
    document_url: process.env.VUE_APP_IMAGE_PATH,
    todaysdate: new Date().toISOString().substr(0, 10),
    valid: true,
    passportDetails: {
      id: 0,
      emp_id: "",
      passport_no: "",
      issuing_authority: "",
      date_of_issue: "",
      date_of_expiry: "",
      place_of_issue: "",
      document_status: "",
      doct_type: "",
    },
    passportActive: true,
    delete_id: null,
    valertmessgae: "",
    valid_error: false,
    valertmessgaedialog: "",
    valid_error_dialog: false,
    showConfirmDialog: false,
    enable_document_select: "",
    initval: false,
    dialog: false,
    isBtnLoading: false,
    docStatus: [],
    passport_data: [],
  }),
  mounted() {
    this.fetchlookup();
  },
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    headers() {
      if (this.view == "userview" && this.status) {
        return [
          {
            text: "Passport No",
            align: "left",
            value: "passport_no",
          },
          {
            text: "Issuing Authority",
            align: "left",
            value: "issuing_authority",
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
            text: "Place of Issue",
            value: "place_of_issue",
            align: "left",
          },
          {
            text: "Document Status",
            value: "document_status",
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
            sortable: false,
            align: "left",
          },
        ];
      } else {
        return [
          {
            text: "Passport No",
            align: "left",
            value: "passport_no",
          },
          {
            text: "Issuing Authority",
            align: "left",
            value: "issuing_authority",
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
            text: "Place of Issue",
            value: "place_of_issue",
            align: "left",
          },
          {
            text: "Document Status",
            value: "document_status",
            align: "left",
          },
          {
            text: "Status",
            value: "",
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
          this.fetchPassportDatas();
        }
      },
    },
  },
  methods: {
    lookupMessage(lookup_data) {
      if (lookup_data.status == "S") {
        this.flashMessage.success({
          message: lookup_data.message,
          time: 4000,
          blockClass: "custom-block-class",
        });
        this.fetchlookup();
      } else {
        this.flashMessage.error({
          message: lookup_data.message,
          time: 4000,
          blockClass: "custom-block-class",
        });
      }
    },
    confirmDelete() {
      this.deletepassportDetails();
      this.showConfirmDialog = false;
    },
    cancel() {
      this.showConfirmDialog = false;
    },
    deleteItem(id) {
      this.delete_id = id;
      this.showConfirmDialog = true;
    },
    uploadedDocument(file_path) {
      this.passportDetails.doct_type = file_path;
      this.closeDocumentSelectDialog();
    },
    closeDocumentSelectDialog(uploadtype) {
      this.enable_document_select = "";
      console.log("close dialog", uploadtype);
    },
    callDocumentSelect() {
      this.enable_document_select = "DragDrop";
    },
    editPassport(id, expire, status) {
      this.passportActive = true;
      this.passportDetails = [];
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetchpassportdetailsdatasforedit",
          {
            params: {
              id: id,
              emp_id: this.user_id,
            },
          }
        )
        .then((response) => {
          if (response.data.status == "S") {
            this.passportDetails = response.data.data;
            if (
              (status == "In Possession" || status == "Active") &&
              expire >= this.todaysdate
            ) {
              this.passportActive = true;
            } else {
              this.passportActive = true;
              // this.passportActive = false;
            }
            this.initval = false;
            this.dialog = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deletepassportDetails() {
      this.valid_error = false;
      this.valertmessgae = "";
      this.initval = true;
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "deletepassportdetails", {
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
            this.fetchPassportDatas();
          }
          if (response.data.status == "EXIST") {
            this.initval = false;
            (this.valertmessgae = response.data.message),
              (this.valid_error = true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchlookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "PASSPORT_DOCUMENT_STATUS",
          },
        })
        .then((response) => {
          this.docStatus = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchPassportDatas() {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetchpassportdetailsdatas/" +
            this.user_id
        )
        .then((response) => {
          if (response.data.status == "S") {
            this.passport_data = response.data.passportdetails;
            this.$emit("passportDataLength", this.passport_data.length);
            this.$eventBus.$emit("passport");
            this.initval = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    savepassport() {
      this.valid_error_dialog = false;
      if (this.$refs.userform.validate()) {
        this.isBtnLoading = true;
        this.passportDetails.emp_id = this.user_id;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "createpassportdetails",
            this.passportDetails
          )
          .then((response) => {
            if (response.data.status == "S") {
              this.flashMessage.success({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.$refs.userform.reset();
              this.isBtnLoading = false;
              this.close();
              this.fetchPassportDatas();
            } else if (response.data.status == "EXIST") {
              this.isBtnLoading = false;
              this.initval = false;
              this.valid_error_dialog = true;
              this.valertmessgaedialog = response.data.message;
            }
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
    passportAddbtn() {
      this.passportDetails.emp_id = this.user_id;
      this.passportDetails.id = 0;
      this.passportActive = true;
      this.valid_error_dialog = false;
      this.valertmessgaedialog = "";
      this.dialog = true;
    },
    uppercasepassport() {
      if (this.passportDetails.passport_no != "") {
        this.passportDetails.passport_no =
          this.passportDetails.passport_no.toUpperCase();
      }
    },
    close() {
      this.$refs.userform.reset();
      this.dialog = false;
    },
    formatteddateofIssue(formatted_date) {
      this.passportDetails.date_of_issue = formatted_date;
      if (
        this.passportDetails.date_of_issue > this.passportDetails.date_of_expiry
      ) {
        this.passportDetails.date_of_expiry = "";
      }
    },
    formatteddateofExpiry(formatted_date) {
      this.passportDetails.date_of_expiry = formatted_date;
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

.browsedivdoc /deep/ .v-text-field__details {
  display: none;
}

.browsebtndoc {
  height: 40px;
  margin-left: -10%;
}
.add_btn_end{
  width: 100%;
  text-align: end;
}
</style>
