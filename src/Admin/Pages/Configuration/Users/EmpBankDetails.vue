<template>
  <div class="main-20">

    <div>
      <v-app-bar flat color="white">
        <!-- <div class="pagetitle_in_userdetails">
      <page-title
        :heading="$t('bank_details')"
        :google_icon="google_icon"
      ></page-title>
    </div> -->
        <!-- <h5>{{$t('bank_details')}}<i class="fa fa-money pl-3"></i></h5> -->

        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-if="view == 'userview' && status" class="btn mr-2 mb-2 hover_shine add_new" small v-on="on"
              @click="dialogBankDetails">
              {{ $t("add") }}
            </v-btn>
          </template>
          <span>{{ $t("add") }}</span>
        </v-tooltip>
      </v-app-bar>
      <v-data-table :loading="initval" :headers="emp_bank_headers" :items="empbank_details"
        v-bind:no-data-text="$t('no_data_available')">
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.bank_name }}</td>
            <td>{{ item.account_no }}</td>
            <td>{{ item.branch_name }}</td>
            <td>{{ item.account_type_details.longname }}</td>
            <td>{{ item.ifsc_code }}</td>
            <td class="text-center px-0" v-if="view == 'userview' && status">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon small class="mr-3 edit_btn icon_size" v-on="on" @click="editBankDetails(item.id)">
                    mdi-pencil-outline</v-icon>
                </template>
                <span>{{ $t("edit") }}</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon class="delete_btn icon_size" v-on="on" small
                    @click="deleteItem(item.id)">mdi-trash-can-outline</v-icon>
                </template>
                <span>{{ $t("delete") }}</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>

      <v-dialog persistent v-model="empbank_dialog" fullscreen transition="dialog-bottom-transition" max-width="800px">
        <v-card>
          <v-toolbar color="primary" dark>
            <span class="headline">{{
              $t("create_amend_emp_bank_details")
            }}</span>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon @click="closeDialog" class="dialogcloseinuserdetails" v-on="on">mdi-close</v-icon>
              </template>
              <span>{{ $t("close") }}</span>
            </v-tooltip>
          </v-toolbar>
          <v-alert v-model="save_error" :text="save_error" color="error" icon="warning" outlined dismissible>
            {{ valertdialogmessage }}</v-alert>
          <v-form ref="empbank" v-model="valid">
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" v-model="emp_bank.bank_name" :rules="fieldRules" dense
                          v-bind:label="$t('bank_name')" outlined class="required_field"></v-text-field>
                      </template>
                      <span>{{ $t("bank_name") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 sm6 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" v-model="emp_bank.account_no" :rules="fieldRules" dense
                          v-bind:label="$t('bank_account_no')" v-on:keypress="NumbersOnly" outlined maxlength="15"
                          class="required_field"></v-text-field>
                      </template>
                      <span>{{ $t("bank_account_no") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 sm6 md4 pl-2 class="createlookupflex">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete v-on="on" item-value="id" item-text="longname" :items="account_type_array"
                          v-model="emp_bank.account_type_id" :rules="fieldRules" dense v-bind:label="$t('account_type')"
                          outlined class="required_field"></v-autocomplete>
                      </template>
                      <span>{{ $t("account_type") }}</span>
                    </v-tooltip>
                    <CreateLookup lookup_parent_name="ACCOUNT_TYPE" @lookup_data="lookupMessage"
                    :dropdownlabel="$t('account_type')"></CreateLookup>
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" v-model="emp_bank.branch_name" :rules="fieldRules" dense
                          v-bind:label="$t('bank_branch')" outlined class="required_field"></v-text-field>
                      </template>
                      <span>{{ $t("bank_branch") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 sm6 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" v-model="emp_bank.ifsc_code" :rules="fieldRules" dense
                          v-bind:label="$t('ifsc_code')" outlined class="required_field" maxlength="20"
                          @keydown="checkKeyDownAlphaNumeric($event)"></v-text-field>
                      </template>
                      <span>{{ $t("ifsc_code") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 sm6 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" v-model="emp_bank.name_as_per_bank_records" :rules="fieldRules" dense
                          v-bind:label="$t('name_as_per_bank')" outlined class="required_field"></v-text-field>
                      </template>
                      <span>{{ $t("name_as_per_bank") }}</span>
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
                    <v-btn v-on="on" small @click="closeDialog" class=" cancel-btn" color="secondary">{{ $t("cancel")
                    }}</v-btn>
                  </div>
                </template>
                <span>{{ $t("cancel") }}</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn :disabled="isDisabled" v-on="on" @click="saveEmpBankDetails()" small
                    class="mr-2 success hover_shine" color="green darken-1">
                    {{ $t("submit") }}
                    <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
                  </v-btn>
                </template>
                <span> {{ $t("submit") }} </span>
              </v-tooltip>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
      <ConfirmDialog :show="showConfirmDialog" :cancel="cancel" :confirm="confirm" :id="delete_id"
        v-bind:title="$t('confirm')" v-bind:description="$t('delete_confirmation')" />
    </div>
  </div>
</template>
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import CreateLookup from "../../../Pages/CreateLookup.vue";
export default {
  components: {
    PageTitle,
    ConfirmDialog,
    CreateLookup
  },
  props: ["user_id", "view", "status"],
  data: () => ({
    valertdialogmessage: "",
    save_error: false,
    google_icon: {
      icon_name: "location_city ",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    panel: [0, 1],
    readonly: false,
    valid: true,
    empbank_details: [],
    empbank_dialog: false,
    isDisabled: false,
    isBtnLoading: false,
    initval: false,
    account_type_array: [],
    delete_id: null,
    showConfirmDialog: false,
    emp_bank: {
      id: 0,
      name_as_per_bank_records: "",
      bank_name: "",
      account_no: null,
      branch_name: "",
      account_type_id: null,
      ifsc_code: "",
    },
  }),
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    emp_bank_headers() {
      if (this.view == "userview" && this.status) {
        return [
          {
            text: this.$t("bank_name"),
            value: "bank_name",
            sortable: false,
          },
          {
            text: this.$t("bank_account_no"),
            value: "account_no",
            sortable: false,
          },
          {
            text: this.$t("bank_branch"),
            value: "branch_name",
            sortable: false,
          },
          {
            text: this.$t("account_type"),
            value: "account_type_details.longname",
            sortable: false,
          },
          {
            text: this.$t("ifsc_code"),
            value: "ifsc_code",
            sortable: false,
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
            text: this.$t("bank_name"),
            value: "bank_name",
            sortable: false,
          },
          {
            text: this.$t("bank_account_no"),
            value: "account_no",
            sortable: false,
          },
          {
            text: this.$t("bank_branch"),
            value: "branch_name",
            sortable: false,
          },
          {
            text: this.$t("account_type"),
            value: "account_type_details.longname",
            sortable: false,
          },
          {
            text: this.$t("ifsc_code"),
            value: "ifsc_code",
            sortable: false,
          },
          {
            text: "",
            sortable: false,
          },
        ];
      }
    },
  },
  mounted() {
    this.fetchlookup();
  },
  watch: {
    user_id: {
      immediate: true,
      handler() {
        this.fetchBankDetails();
      },
    },
  },
  methods: {
    lookupMessage(lookup_data) {
      if (lookup_data.status == 'S') {
        this.flashMessage.success({
          message: lookup_data.message,
          time: 4000,
          blockClass: "custom-block-class",
        });
        this.fetchlookup();
      }
      else {
        this.flashMessage.error({
          message: lookup_data.message,
          time: 4000,
          blockClass: "custom-block-class",
        });
      }
    },
    isLetter(e) {
      let char = String.fromCharCode(e.keyCode); // Get the character
      if (/^[A-Za-z]+$/.test(char)) return true; // Match with regex 
      else e.preventDefault(); // If not match, don't add to input text
    },
    saveEmpBankDetails() {
      if (this.$refs.empbank.validate()) {
        this.isBtnLoading = true;
        this.isDisabled = true;
        this.emp_bank.emp_id = this.user_id;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "create_emp_bank_details",
            this.emp_bank
          )
          .then((response) => {
            if (response.data.status == "S") {
              this.flashMessage.success({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.empbank_dialog = false;
              this.isBtnLoading = false;
              this.isDisabled = false;
              this.fetchBankDetails();
            }
            else if (response.data.status == "E") {
              this.valertdialogmessage = response.data.message;
              this.save_error = true;
              this.isBtnLoading = false;
              this.isDisabled = false;
            }
            else if (response.data.status == "EXIST") {
              this.valertdialogmessage = response.data.message;
              this.save_error = true;
              this.isBtnLoading = false;
              this.isDisabled = false;
            }
            else {
              this.valertdialogmessage = response.data.message;
              this.save_error = true;
              this.isBtnLoading = false;
              this.isDisabled = false;
            }
          })
          .catch((err) => {
            this.valertdialogmessage = response.data.message;
            this.save_error = true;
            console.log(err);
            this.isBtnLoading = false;
            this.isDisabled = false;

          });
      }
    },
    fetchBankDetails() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_bank_details", {
          params: {
            user_id: this.user_id,
          },
        })
        .then((res) => {
          this.empbank_details = res.data.emp_bank_details;
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
    editBankDetails(id) {
      this.initval = true;
      // this.empbank_dialog = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_bank_details_by_id", {
          params: {
            id: id,
          },
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.message = res.data.message;
            this.emp_bank = res.data.emp_bank_details;
            this.empbank_dialog = true;
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
    deleteItem(id) {
      this.delete_id = id;
      this.showConfirmDialog = true;
    },
    confirm(id) {
      this.deleteConfirm(id);
      this.showConfirmDialog = false;
    },
    deleteConfirm(id) {
      this.deleteEmpBankDetails(id);
    },
    cancel() {
      this.showConfirmDialog = false;
    },
    deleteEmpBankDetails(id) {
      this.initval = true;
      this.showConfirmDialog = false;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "delete_emp_bank_details/" + id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.fetchBankDetails();
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
    checkKeyDownAlphaNumeric(event) {
      if (!/[a-zA-Z0-9\s]/.test(event.key)) {
        this.ignoredValue = event.key ? event.key : "";
        event.preventDefault();
      }
    },
    fetchlookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "ACCOUNT_TYPE",
          },
        })
        .then((response) => {
          this.account_type_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    closeDialog() {
      this.empbank_dialog = false;
    },
    dialogBankDetails() {
      this.emp_bank.id = 0;
      this.empbank_dialog = true;
      this.$refs.empbank.reset();
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
.userform {
  border: none;
}

.heading {
  font-weight: bold;
  font-size: 15px;
}

.values {
  font-size: 15px;
}

.expansionpaneldummydiv /deep/ .v-expansion-panel-header {
  align-items: flex-start !important;
}

.expansionpaneldummydiv .v-expansion-panel {
  flex: 1 0 25% !important;
  margin: 10px 50px !important;
  max-width: 40%;
  position: relative;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);

}

.theme--light.v-sheet--outlined {
  border: none;
}

.expansion_panel /deep/ .v-expansion-panels {

  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between !important;
  list-style-type: none;
  padding: 0;
  width: 100%;
  z-index: 1;

}

.expansionpaneldummydiv /deep/ .v-expansion-panel::before {
  box-shadow: none !important;
}
</style>