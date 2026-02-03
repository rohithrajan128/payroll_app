<template>
  <div>
    <div class="main-20">
      <!-- <div class="pagetitle_in_userdetails">
        <page-title
          :heading="$t('epfo_account_details')"
          :google_icon="google_icon"
        ></page-title>
      </div><br><br> -->
      <div>
        <v-app-bar flat color="white">
                      <!-- <h5>{{$t('epfo_account_details')}}<i class="fa fa-money pl-3"></i></h5> -->

          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                v-if="view == 'userview' && status"
                class="btn mr-2 mb-2 hover_shine add_new"
                small
                v-on="on"
                @click="dialogEpfoAccount"
              >
                {{ $t("add") }}
              </v-btn>
            </template>
            <span>{{ $t("add") }}</span>
          </v-tooltip>
        </v-app-bar>
        <v-data-table
          :loading="initval"
          :headers="emp_epfo_bank_headers"
          :items="emp_epfo_account_details"
          v-bind:no-data-text="$t('no_data_available')"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.epfo_number }}</td>
              <td>{{ item.uan }}</td>
              <td>{{ item.epfo_joining_date | formatDate }}</td>
              <td v-if="item.epfo_end_date">
                {{ item.epfo_end_date | formatDate }}
              </td>
              <td v-else>-</td>
              <td class="text-center px-0" v-if="view == 'userview' && status">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      small
                      class="mr-3 edit_btn icon_size"
                      v-on="on"
                      @click="editEpfoAccountDetails(item.id)"
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
          fullscreen
          transition="dialog-bottom-transition"
          v-model="emp_epfo_acoount_dialog"
          max-width="800px"
        >
          <v-card>
            <v-toolbar color="primary" dark>
              <span class="headline">{{
                $t("create_amend_epfo_account_details")
              }}</span>
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
            <v-alert v-model="save_error" :text="save_error" color="error" icon="warning" outlined dismissible>
      {{ valertdialogmessage }}</v-alert>
            <v-form ref="emp_epfo_valid" v-model="valid">
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 sm6 md6 pl-2>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-on="on"
                            v-model="epfo_emp_account.epfo_number"
                            :rules="fieldRules"
                            dense
                            maxlength="22"
                            v-bind:label="$t('epfo_number')"
                            outlined
                            class="required_field"
                          ></v-text-field>
                        </template>
                        <span>{{ $t("epfo_number") }}</span>
                      </v-tooltip>
                    </v-flex>
                    <v-flex xs12 sm6 md6 pl-2>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-on="on"
                            v-model="epfo_emp_account.uan"
                            :rules="fieldRules"
                            dense
                            v-bind:label="$t('uan_no')"
                            v-on:keypress="NumbersOnly"
                            outlined
                            maxlength="14"
                            class="required_field"
                          ></v-text-field>
                        </template>
                        <span>{{ $t("uan_no") }}</span>
                      </v-tooltip>
                    </v-flex>
                  </v-layout>
                  <v-layout wrap>
                    <v-flex xs12 sm6 md6 pl-2>
                      <DatePicker
                        :label="$t('epfo_joining_date')"
                        :stored_date="epfo_emp_account.epfo_joining_date"
                        dense
                        :class_required="'RequiredField'"
                        :rules="fieldRules"
                        :max="new Date().toISOString().substr(0, 10)"
                        @formatted_date="formatteStartDate"
                      />
                    </v-flex>
                    <v-flex xs12 sm6 md6 pl-2>
                      <DatePicker
                        :label="$t('epfo_end_date')"
                        :stored_date="epfo_emp_account.epfo_end_date"
                        dense
                        :min="epfo_emp_account.epfo_joining_date"
                        @formatted_date="formattedEndDate"
                      />
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
                class="cancel-btn"
                color="secondary"
                
              >{{ $t("cancel") }}</v-btn>
            </div>
          </template>
          <span>{{ $t("cancel") }}</span>
        </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :disabled="isDisabled"
                      v-on="on"
                      @click="saveEmpEpfoAccountDetails()"
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
          :confirm="confirm"
          :id="delete_id"
          v-bind:title="$t('confirm')"
          v-bind:description="$t('delete_confirmation')"
        />
      </div>
    </div>
  </div>
</template>
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import DatePicker from "../Components/DatePicker.vue";
export default {
  components: {
    PageTitle,
    ConfirmDialog,
    DatePicker,
  },
  props: ["user_id", "view" , "status"],
  data: () => ({
    valertdialogmessage:"",
    save_error: false,
    google_icon: {
      icon_name: "location_city ",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    valid: true,
    emp_epfo_account_details: [],
    emp_epfo_acoount_dialog: false,
    initval: false,
    isDisabled: false,
    isBtnLoading: false,
    showConfirmDialog: false,
    delete_id: null,
    epfo_emp_account: {
      id: 0,
      emp_id: null,
      epfo_number: "",
      uan: null,
      epfo_joining_date: "",
      epfo_end_date: "",
    },
  }),
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    emp_epfo_bank_headers() {
      if (this.view == "userview" && this.status) {
        return [
          {
            text: this.$t("epfo_number"),
            value: "bank_name",
            sortable: false,
          },
          {
            text: this.$t("uan_number"),
            value: "account_no",
            sortable: false,
          },
          {
            text: this.$t("epfo_joining_date"),
            value: "branch_name",
            sortable: false,
          },
          {
            text: this.$t("epfo_end_date"),
            value: "account_type_details.longname",
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
            text: this.$t("epfo_number"),
            value: "bank_name",
            sortable: false,
          },
          {
            text: this.$t("uan_number"),
            value: "account_no",
            sortable: false,
          },
          {
            text: this.$t("epfo_joining_date"),
            value: "branch_name",
            sortable: false,
          },
          {
            text: this.$t("epfo_end_date"),
            value: "account_type_details.longname",
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
  watch: {
    user_id: {
      immediate: true,
      handler() {
        this.fetchAllEmpEpfoDetails();
      },
    },
  },
  methods: {
    deleteItem(id) {
      this.delete_id = id;
      this.showConfirmDialog = true;
    },
    confirm(id) {
      this.deleteConfirm(id);
      this.showConfirmDialog = false;
    },
    deleteConfirm(id) {
      this.deleteEmpEpfoAccount(id);
    },
    deleteEmpEpfoAccount(id) {
      this.initval = true;
      this.showConfirmDialog = false;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "delete_emp_epfo_details/" + id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.fetchAllEmpEpfoDetails();
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
    cancel() {
      this.showConfirmDialog = false;
    },
    closeDialog() {
      this.save_error=false;

      this.emp_epfo_acoount_dialog = false;
    },
    formatteStartDate(formatted_date) {
      this.epfo_emp_account.epfo_joining_date = formatted_date;
    },
    formattedEndDate(formatted_date) {
      this.epfo_emp_account.epfo_end_date = formatted_date;
    },
    saveEmpEpfoAccountDetails() {
      if (this.$refs.emp_epfo_valid.validate()) {
        this.isBtnLoading = true;
        this.isDisabled = true;
        this.epfo_emp_account.emp_id = this.user_id;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "create_emp_epfo_details",
            this.epfo_emp_account
          )
          .then((response) => {
            if (response.data.status == "S") {
              this.flashMessage.success({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.emp_epfo_acoount_dialog = false;
              this.isBtnLoading = false;
              this.isDisabled = false;
              this.fetchAllEmpEpfoDetails();
            } 
            else if (response.data.status == "E") {
              this.valertdialogmessage = response.data.message;
              this.save_error=true;
              this.isBtnLoading = false;
              this.isDisabled = false;
            }
            else if (response.data.status == "EXIST") {
              this.valertdialogmessage = response.data.message;
              this.save_error=true;
              this.isBtnLoading = false;
              this.isDisabled = false;
            }
          })
          .catch((err) => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            console.log(err);
            this.valertdialogmessage = response.data.message;
            this.save_error=true;
            this.isBtnLoading = false;
            this.isDisabled = false;
       
          });
      }
    },
    fetchAllEmpEpfoDetails() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_all_emp_epfo_details", {
          params: {
            user_id: this.user_id,
          },
        })
        .then((res) => {
          this.emp_epfo_account_details = res.data.emp_epfo_account_details;
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
    dialogEpfoAccount() {
      this.epfo_emp_account.id = 0;
      this.emp_epfo_acoount_dialog = true;
      this.epfo_emp_account= {
      id: 0,
      emp_id: null,
      epfo_number: "",
      uan: null,
      epfo_joining_date: "",
      epfo_end_date: "",
    }
    },
    editEpfoAccountDetails(id) {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetch_emp_epfo_details_by_id",
          {
            params: {
              id: id,
            },
          }
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.message = res.data.message;
            this.epfo_emp_account = res.data.emp_epfo_details_by_id;
            this.emp_epfo_acoount_dialog = true;
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
</style>