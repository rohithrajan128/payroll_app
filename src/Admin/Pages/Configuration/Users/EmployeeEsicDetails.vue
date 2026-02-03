<template>
  <div class="main-20">
    <v-app-bar flat color="white">
      <!-- <h5>
        {{ $t("esic_details") }}
        <i class="fa fa-folder-o pl-3"></i>
      </h5> -->
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            v-if="view == 'userview' && status"
            class="btn mr-2 mb-2 hover_shine add_new"
            small
            v-on="on"
            @click="dialogEsicDetails"
            >{{ $t("add") }}</v-btn
          >
        </template>
        <span>{{ $t("add") }}</span>
      </v-tooltip>
    </v-app-bar>
    <v-data-table
      :loading="initval"
      :headers="emp_esic_headers"
      :items="emp_esic_data"
      v-bind:no-data-text="$t('no_data_available')"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.esic_no }}</td>
          <td>{{ item.date_of_reg_no | formatDate }}</td>
          <!-- <td>{{ item }}</td> -->

          <td class="text-center px-0" v-if="view == 'userview' && status">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  class="mr-3 edit_btn icon_size"
                  v-on="on"
                  @click="editEsicDetails(item.id)"
                  >mdi-pencil-outline</v-icon
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
    <v-dialog persistent v-model="emp_esic_dialog" fullscreen transition="dialog-bottom-transition" max-width="800px">
      <v-card>
        <v-toolbar color="primary" dark>
          <span class="headline">
            {{ $t("create_amend_emp_esic_details") }}
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

        <v-alert v-model="save_error" :text="save_error" color="error" icon="warning" outlined dismissible>
      {{ valertdialogmessage }}</v-alert>

        <v-form ref="empesic" v-model="valid">
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm7 md7 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-on="on"
                        v-model="emp_esic_details.esic_no"
                        :rules="fieldRules"
                        dense
                        v-bind:label="$t('esic_no')"
                        outlined
                        maxlength="20"
                        class="required_field text-capitalize"
                      ></v-text-field>
                    </template>
                    <span>{{ $t("esic_no") }}</span>
                  </v-tooltip>
                </v-flex>
                <v-flex xs12 sm5 md5 pl-2>
                  <template>
                    <DatePicker
                      :label="$t('date_of_reg_no')"
                      :stored_date="emp_esic_details.date_of_reg_no"
                      :max="new Date().toISOString().substr(0, 10)"
                      @formatted_date="formatted_reg_date"
                      dense
                      :class_required="'RequiredField'"
                      :rules="fieldRules"
                    />
                  </template>
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
                  @click="saveEmpEsicDetails()"
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
</template>

<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import DatePicker from "../Components/DatePicker.vue";
export default {
  components: {
    DatePicker,
    PageTitle,
    ConfirmDialog,
  },
  props: ["user_id", "view", "status"],

  data: () => ({
    valertdialogmessage:"",
    save_error: false,
    google_icon: {
      icon_name: "location_city ",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    emp_esic_details: {
      id: 0,
      emp_id: null,
      esic_no: null,
      date_of_reg_no: null,
      org_id: null,
      site_id: null,
    },
    emp_esic_dialog: false,
    isBtnLoading: false,
    isDisabled: false,
    user:"",

    emp_esic_data: [],
    emp_esic_array: [],
    valid: true,
    delete_id: null,
    showConfirmDialog: false,
    initval: false,
  }),
mounted(){
    this.user = JSON.parse(localStorage.getItem("user"));
},
  watch: {
    user_id: {
      immediate: true,
      handler() {
        if (this.user_id) {
              this.user = JSON.parse(localStorage.getItem("user"));
          this.fetchEmpEsicDetails();
        }
      },
    },
  },
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    emp_esic_headers() {
      if (this.view == "userview" && this.status) {
        return [
          {
            text: this.$t("esic_no"),
            value: "",
            sortable: true,
          },
          {
            text: this.$t("date_of_reg_no"),
            value: "",
            sortable: true,
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
            text: this.$t("esic_no"),
            value: "",
            sortable: true,
          },
          {
            text: this.$t("date_of_reg_no"),
            value: "",
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
    closeDialog() {
      this.save_error=false;
      this.emp_esic_dialog = false;
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
      this.deleteEmpEsicDetails(id);
    },
    cancel() {
      this.showConfirmDialog = false;
    },
    dialogEsicDetails() {
      this.emp_esic_dialog = true;
      this.emp_esic_details.esic_no = null;
      this.emp_esic_details.date_of_reg_no = "";
      this.emp_esic_details.id = 0;
      this.emp_esic_details.emp_id = null;
      this.isDisabled = false;
    },
    formatted_reg_date(formatted_date) {
      this.emp_esic_details.date_of_reg_no = formatted_date;
    },
    fetchEmpEsicDetails() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_emp_eisc_details", {
          params: {
            user_id: this.user_id,
            site_id: this.user.hr_employee.site_id,
            org_id: this.user.hr_employee.org_id,
          },
        })
        .then((res) => {
          this.emp_esic_data = res.data.emp_esic_data;
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
    deleteEmpEsicDetails(id) {
      this.initval = true;
      this.showConfirmDialog = false;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "delete_emp_esic_details/" + id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.fetchEmpEsicDetails();
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
    editEsicDetails(id) {
      this.initval = true;
      this.isDisabled = false;
      // this.empbank_dialog = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetch_emp_esic_details_by_id",
          {
            params: {
              id: id,
            },
          }
        )

        .then((res) => {
          if (res.data.status == "S") {
            this.message = res.data.message;
            this.emp_esic_details = res.data.emp_esic_details_by_id;
            this.emp_esic_dialog = true;
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
    saveEmpEsicDetails() {
      if (this.$refs.empesic.validate()) {
        this.isBtnLoading = true;
        this.isDisabled = true;
        this.emp_esic_details.emp_id = this.user_id;
        this.emp_esic_details.org_id = this.user.hr_employee.org_id;
        this.emp_esic_details.site_id = this.user.hr_employee.site_id;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "create_emp_esic_details",
            this.emp_esic_details
          )
          .then((response) => {
            if (response.data.status == "S") {
              this.flashMessage.success({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.emp_esic_dialog = false;
              this.isBtnLoading = false;
              this.isDisabled = false;
              this.fetchEmpEsicDetails();
            } else if (response.data.status == "E") {
              this.valertdialogmessage = response.data.message;
              this.save_error=true;
              this.isBtnLoading = false;
              this.isDisabled = false;
              // this.emp_esic_dialog = false;
            }
          })
          .catch((err) => {
            this.valertdialogmessage = this.$t("something_went_wrong");
            this.save_error=true;
            console.log(err);
            this.isBtnLoading = false;
          });
      }
    },
  },
};
</script>