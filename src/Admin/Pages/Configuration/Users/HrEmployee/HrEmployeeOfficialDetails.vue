<template>
  <div class="official_container">
    <v-form ref="form" v-model="official_details_valid">
    <v-row class="mtb-10">
      <v-row class="mtb-10">
        <v-col cols="12" sm="4" md="8" class>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-autocomplete
                v-if="user && user.hr_employee.emprole_name.includes('HR')"
                v-bind:label="$t('organisation')"
                v-on="on"
                index="id"
                disabled
                item-value="id"
                item-text="shortname"
                v-model="official_details.org_id"
                :rules="fieldRules"
                :items="organisation_array"
                outlined
                dense
                @input="
                  fetchOrgSite(official_details.org_id);
                  fetchweeks(official_details.org_id);
                "
                class="required_field"
              ></v-autocomplete>
              <v-autocomplete
                v-else
                v-bind:label="$t('organisation')"
                :disabled="disable_reporting_to"
                v-on="on"
                index="id"
                item-value="id"
                item-text="shortname"
                v-model="official_details.org_id"
                :rules="fieldRules"
                :items="organisation_array"
                outlined
                dense
                @change="
                  fetchOrgSite(official_details.org_id);
                  fetchweeks(official_details.org_id);
                "
                class="required_field"
              ></v-autocomplete>
            </template>
            <span>{{ $t("organisation") }}</span>
          </v-tooltip>
        </v-col>
        <v-col cols="12" sm="4" md="4" class="mbtm-7">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-autocomplete
              :disabled="emp_type_disabled"
                v-bind:label="$t('employee_type')"
                v-on="on"
                index="id"
                item-value="id"
                item-text="employee_type"
                v-model="official_details.emp_type"
                :rules="fieldRules"
                :items="employee_type_array"
                outlined
                dense
                class="required_field"
                @change="
                  generateEmployeeNo(
                    official_details.emp_type,
                    employee_type_array
                  )
                "
              ></v-autocomplete>
            </template>
            <span>{{ $t("employee_type") }}</span>
          </v-tooltip>
        </v-col>
                <!-- :disabled="emp_number_disabled" -->
        <v-col cols="12" sm="4" md="4" class="mbtm-7">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-text-field
                v-bind:label="$t('employee_number')"
                v-on="on"
                index="id"
                item-value="id"
                item-text="longname"
                v-model="official_details.empno"
                :rules="fieldRules"
                outlined
                dense
                class="required_field mt_30"
              ></v-text-field>
            </template>
            <span>{{ $t("employee_number") }}</span>
          </v-tooltip>
        </v-col>
        <v-col cols="12" sm="4" md="4" class="mbtm-7">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-autocomplete
                v-bind:label="$t('designation')"
                v-on="on"
                index="id"
                item-value="id"
                item-text="designation"
                v-model="official_details.designation_id"
                :rules="fieldRules"
                :items="designation_array"
                outlined
                required
                @change="
                  getLevelData(official_details.designation_id);
                  updatedesignation(official_details);
                "
                dense
                class="required_field mt_30"
              ></v-autocomplete>
            </template>
            <span>{{ $t("designation") }}</span>
          </v-tooltip>
        </v-col>
        <v-col cols="12" sm="4" md="4" class="mbtm-7">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-autocomplete
                v-bind:label="$t('level')"
                v-on="on"
                index="id"
                item-value="id"
                item-text="level"
                v-model="official_details.level_id"
                :items="employee_level_array"
                :rules="fieldRules"
                outlined
                disabled
                dense
                class="required_field mt_30"
              ></v-autocomplete>
            </template>
            <span>{{ $t("level") }}</span>
          </v-tooltip>
        </v-col>
        <v-col cols="12" sm="4" md="4" class="mbtm-7">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-autocomplete
                v-bind:label="$t('department')"
                v-on="on"
                index="id"
                item-value="id"
                item-text="longname"
                v-model="official_details.department_id"
                :rules="fieldRules"
                :items="department_array"
                outlined
                dense
                class="required_field mt_30"
              ></v-autocomplete>
            </template>
            <span>{{ $t("department") }}</span>
          </v-tooltip>
        </v-col>
        <v-col cols="12" sm="4" md="4" class="mbtm-7">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-autocomplete
                v-bind:label="$t('site')"
                v-on="on"
                index="id"
                item-value="fnd_site.id"
                item-text="fnd_site.unique_location"
                v-model="official_details.site_id"
                :rules="fieldRules"
                :items="site_array"
                outlined
                dense
                class="required_field mt_30"
              ></v-autocomplete>
            </template>
            <span>{{ $t("site") }}</span>
          </v-tooltip>
        </v-col>
        <v-col cols="12" sm="4" md="4" class="mbtm-7">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <DatePicker
                :disable_field="emp_Joining_date_disabled"
                :label="$t('doj')"
                v-on="on"
                :stored_date="official_details.Joining_date"
                :min="org_establised_date"
                :max="new Date().toISOString().substr(0, 10)"
                @formatted_date="formattedDate"
                class="mr-1 mt_30"
                :rules="fieldRules"
                :class_required="'RequiredField'"
              />
            </template>
            <span>{{ $t("doj") }}</span>
          </v-tooltip>
        </v-col>
        <v-col cols="12" sm="4" md="8" class="mbtm-7">
          
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-on="on"
                  v-model="official_details.official_email"
                  :rules="emailRules"
                  class="required_field mt_30"
                  v-bind:label="$t('official_email')"
                  required
                  outlined
                  dense
                ></v-text-field>
              </template>
              <span>{{ $t("official_email") }}</span>
            </v-tooltip>
          
        </v-col>
        <v-col cols="12" sm="4" md="4" class="createlookupflex">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-autocomplete
                :disabled="official_details.is_permanent == 1"
                v-bind:label="$t('employee_status')"
                v-on="on"
                index="id"
                item-value="id"
                item-text="longname"
                v-model="official_details.emp_status"
                :rules="fieldRules"
                :items="employee_status_array"
                outlined
                dense
                class="required_field mt_30"
                @change="updateEmployeeStatus(official_details)"
              ></v-autocomplete>
            </template>
            <span>{{ $t("employee_status") }}</span>
          </v-tooltip>
        <div style="margin-top:-28px">
          <CreateLookup lookup_parent_name="EMPLOYEE_STATUS" @lookup_data="lookupMessage" :dropdownlabel="$t('employee_status')"></CreateLookup>
        </div>
     
        </v-col>
        <v-col cols="12" sm="4" md="8" class>
          <v-tooltip bottom v-if="official_details.working_days">
            <template v-slot:activator="{ on }">
              <v-autocomplete
                v-on="on"
                v-bind:label="$t('working_days')"
                :items="working_days_array"
                index="id"
                item-value="longname"
                class="required_field mt_30"
                item-text="shortname"
                v-model="official_details.working_days"
                :rules="fieldRules"
                outlined
                dense
                multiple
                required
                chips
                small-chips
                prepend-inner-icon="mdi mdi-calendar-week-outline"
              >
                <template v-slot:selection="{ item }">
                  <v-chip outlined class="py-2" color="primary" small>
                    <span>{{ item.longname }}</span>
                  </v-chip>
                </template>
              </v-autocomplete>
            </template>
            <span>{{ $t("working_days") }}</span>
          </v-tooltip>
        </v-col>
        <v-col cols="12" sm="4" md="4" class="mbtm-7">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-autocomplete
                v-bind:label="$t('reporting_to')"
                v-on="on"
                index="id"
                item-value="id"
                item-text="Full_Code"
                v-model="official_details.manager_id"
                :rules="fieldRules"
                :items="all_employee_details"
                outlined
                :disabled="disable_reporting_to"
                @change="assignManagerId(official_details.manager_id)"
                dense
                class="required_field mt_30"
              ></v-autocomplete>
            </template>
            <span>{{ $t("reporting_to") }}</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-row>
  </v-form>
    <div class="text-right btn_container">
      <v-btn small @click="$router.go(-1)" class="secondary">
        {{ $t("cancel") }}
      </v-btn>
      <v-btn
        color="primary"
        class="ml-2"
        :disabled="saveDisabled"
        @click="SubmitEmployeeOfficialDetails('samepage')"
        small
      >
        {{ $t("save") }}
        <b-spinner
          :disabled="saveBtnLoading"
          small
          v-if="saveBtnLoading"
        ></b-spinner>
      </v-btn>
      <v-btn
        color="primary"
        class="ml-2"
        :disabled="isDisabled"
        @click="SubmitEmployeeOfficialDetails('nextpage')"
        small
      >
        {{ $t("save_next") }}
        <b-spinner
          :disabled="isBtnLoading"
          small
          v-if="isBtnLoading"
        ></b-spinner>
      </v-btn>
    </div>

    <v-form ref="designationform" class="col-md-3" v-model="valid">
      <v-dialog v-model="designation_dialog" max-width="900px">
        <v-card>
          <v-toolbar color="primary" dark>
            <span class="headline">{{ $t("assign_designation") }}</span>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  @click="close"
                  class="dialogcloseinuserdetails"
                  v-on="on"
                  >mdi-close</v-icon
                >
              </template>
              <span>{{ $t("close") }}</span>
            </v-tooltip>
          </v-toolbar>
          <v-card-text class="mt-5">
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md6 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-autocomplete
                        v-bind:label="$t('designation')"
                        v-on="on"
                        index="id"
                        disabled
                        item-value="id"
                        item-text="designation"
                        v-model="official_details.designation_id"
                        :rules="fieldRules"
                        :items="designation_array"
                        outlined
                        @change="
                          getLevelData(official_details.designation_id);
                          updatedesignation(official_details);
                        "
                        dense
                        class="required_field"
                      ></v-autocomplete>
                    </template>
                    <span>{{ $t("designation") }}</span>
                  </v-tooltip>
                </v-flex>

                <v-flex xs12 md4 pl-2>
                  <DatePicker
                    :label="$t('effective_date')"
                    :stored_date="update_designation.start_date"
                    @formatted_date="formatted_from_date"
                    dense
                    :class_required="'RequiredField'"
                    :min="min_date"
                    :rules="fieldRules"
                    v-model="update_designation.start_date"
                  />
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on" class="d-inline-block">
                  <v-btn
                    :disabled="isDisabled"
                    @click="designationupdate(official_details)"
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
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-form>
    <ConfirmDialog
      :show="showStatusDialog"
      :cancel="cancelStatus"
      :confirm="confirmStatus"
      v-bind:title="$t('confirm')"
      v-bind:description="description_value"
    />
    <ConfirmDialog
      :show="showEmpStatusDialog"
      :cancel="cancelEmpStatus"
      :confirm="confirmEmpStatus"
      v-bind:title="$t('confirm')"
      v-bind:description="description_value"
    />
  </div>
</template>
<script>
import DatePicker from "../../Components/DatePicker.vue";
import ConfirmDialog from "../../Components/ConfirmDialog.vue";
import CreateLookup from "../../../CreateLookup.vue";
export default {
  props: [
    "profile_details",
    "employee_details",
    "lookupValues",
    "initial_details",
    // "level_data",
  ],
  components: {
    ConfirmDialog,
    DatePicker,
    CreateLookup
  },
  data: () => ({
    todaysdate: new Date().toISOString().substr(0, 10),
    description_value: "",
    designation_name: "",
    disable_reporting_to: false,
    showStatusDialog: false,
    showEmpStatusDialog: false,
    isDisabled: false,
    emp_number_disabled: false,
    emp_type_disabled: false,
    emp_Joining_date_disabled: false,
    designation_dialog: false,
    saveBtnLoading: false,
    saveDisabled: false,
    isBtnLoading: false,
    valid: true,
    official_details_valid: true,
    employee_status_array: [],
    employee_type_array: [],
    organisation_array: [],
    designation_array: [],
    level_array: [],
    department_array: [],
    all_employee_details: [],
    roles_array: [],
    employeeroles: [],
    site_array: [],
    employee_code: "",
    assign_manager_id: null,
    employee_number_limit: null,
    working_days_array: [],
    user: "",
    old_designation: "",
    employee_level_array: [],
    official_details: {
      official_email: "",
      is_permanent: "",
      org_id: null,
      emp_type: null,
      emp_status: null,
      empno: "",
      level_id: null,
      Joining_date: "",
      site_id: null,
      designation_id: null,
      department_id: null,
      manager_id: null,
      start_date: "",
      working_days: [],
    },
    designation_name: "",
    org_establised_date: "",
    employee_type_name: "",
    min_date: "",
    update_designation: {
      start_date: "",
    },
  }),
  computed: {
    emailRules() {
      return [
        (v) => !!v || this.$t("email_required"),

        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          this.$t("email_valid"),
      ];
    },
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },
  mounted() {
    // this.user = JSON.parse(localStorage.getItem("user"));
  },
  watch: {
    dialog(val) {
      val || this.close();
    },

    profile_details: {
      immediate: true,
      handler() {
        if (this.profile_details) {
          if (this.profile_details.designation) {
            this.$emit(
              "designationEmployeeType",
              this.profile_details.designation.designation,
              this.profile_details.employee_type
            );
          }
          this.user = JSON.parse(localStorage.getItem("user"));
          this.fetchlookup();
          this.fetchEmployeeType();
          this.fetchempDesignation();
          this.fetchempLevelData();

          this.official_details = this.profile_details;
          this.official_details.start_date = "";
          this.fetchOrganisation();
          if (this.official_details.org_id) {
            this.fetchOrgSite(this.official_details.org_id);
          }
          if (this.official_details.working_days) {
            this.official_details.working_days = JSON.parse(
              this.official_details.working_days
            );
          } else {
            this.fetchweeks(this.official_details.org_id);
          }
          if (this.employee_details && this.employee_details.userdetails) {
            this.official_details.official_email =
              this.employee_details.userdetails.email;
          }
          if (
            this.official_details.assign_manger &&
            this.official_details.assign_manger.manager_id == null
          ) {
            this.official_details.manager_id = "0";
            this.disable_reporting_to = true;
          } else if (this.official_details.assign_manger) {
            this.disable_reporting_to = true;
            this.official_details.manager_id =
              this.official_details.assign_manger.manager_id;
          }
          if (this.employee_details && this.employee_details.designation_id) {
            setTimeout(() => {
              this.getLevelData(this.employee_details.designation_id);
            }, 2500);
          }
          if (this.official_details.empno != null) {
            this.emp_number_disabled = true;
          }
          if (this.official_details.emp_type != null) {
            this.emp_type_disabled = true;
          }
          if (this.official_details.Joining_date != null) {
            this.emp_Joining_date_disabled = true;
          }
        }
      },
    },

    // lookupValues: {
    //   immediate: true,
    //   handler() {
    //     if (this.lookupValues == "CallLookup") {
    //       this.fetchlookup();
    //     }
    //   },
    // },
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
    fetchempLevelData() {
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetch_designation_level_data",
          {
            params: {
              org_id: this.user.hr_employee.org_id,
              site_id: this.user.hr_employee.site_id,
            },
          }
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.employee_level_array = res.data.employee_level;
          } else if (res.data.status == "E") {
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
          console.log("this error" + err);
        });
    },
    fetchempDesignation() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_emp_deignation", {
          params: {
            org_id: this.user.hr_employee.org_id,
            site_id: this.user.hr_employee.site_id,
          },
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.designation_array = res.data.emp_designation;
          } else if (res.data.status == "E") {
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
          console.log("this error" + err);
        });
    },
    formatted_from_date(formatted_date) {
      this.update_designation.start_date = formatted_date;
    },
    dialog(val) {
      val || this.close();
    },
    close() {
      this.designation_dialog = false;
      this.update_designation.start_date = "";
      this.official_details.designation_id =
        this.initial_details.designation_id;
      this.getLevelData(this.initial_details.designation_id);
    },
    cancelStatus() {
      this.showStatusDialog = false;
      this.official_details.designation_id =
        this.initial_details.designation_id;
      this.getLevelData(this.initial_details.designation_id);
    },
    cancelEmpStatus() {
      this.showEmpStatusDialog = false;
      this.official_details.emp_status = this.initial_details.emp_status;
    },
    updatedesignation() {
      this.description_value = this.$t("change_designation");
      if (this.initial_details.empno != null) {
        this.showStatusDialog = true;
      }
    },
    updateEmployeeStatus() {
      this.description_value = this.$t("change_employee_status");
      if (this.initial_details.emp_status != null) {
        this.showEmpStatusDialog = true;
      }
    },
    update() {
      if (this.initial_details.empno != null) {
        this.showStatusDialog = true;
      }
    },
    confirmStatus() {
      // this.statusUpdate();

      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "previous_designation_details/" +
            this.official_details.id
        )
        .then((res) => {
          this.min_date = res.data.JobHistory.start_date;
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log("this error" + err);
        });

      this.designation_dialog = true;
      this.showStatusDialog = false;
    },
    confirmEmpStatus() {
      this.updateEmpStatus();

      this.showEmpStatusDialog = false;
    },
    updateEmpStatus() {
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "updateempstatus", {
          official_details: this.official_details,
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.initval = false;
            this.official_details.employee_status.longname =
              res.data.emp_status.longname;
            this.official_details.is_permanent = 1;
            this.flashMessage.success({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
          } else {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
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
          console.log("this error" + err);
        });
    },
    designationupdate() {
      this.initval = true;
      if (this.$refs.designationform.validate()) {
        axios
          .post(process.env.VUE_APP_API_URL_ADMIN + "updateempdesignation", {
            official_details: this.official_details,
            update_designation: this.update_designation,
          })
          .then((res) => {
            if (res.data.status == "S") {
              this.initval = false;
              this.update_designation.start_date = "";
              this.designation_dialog = false;
              this.flashMessage.success({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
            } else {
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
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
            console.log("this error" + err);
          });
      }
    },

    fetchweeks(org_id) {
      setTimeout(() => {
        var working_days = this.organisation_array.find(
          (x) => x.id == org_id
        ).working_days;
        this.fetchlookup();
        this.official_details.working_days = JSON.parse(working_days);
      }, 2600);
    },
    assignManagerId(id) {
      this.official_details.manager_id = id;
    },
    fetchAllEmployee(org_id) {
      // this.all_employee_details = [];
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_all_employee/" + org_id)
        .then((res) => {
          this.all_employee_details = res.data.all_employee_details;
          this.all_employee_details.splice(0, 0, {
            id: "0",
            Full_Code: "Self",
          });
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
    fetchEmployeeType() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_all_emp_no_details")
        .then((res) => {
          this.employee_type_array = res.data.all_employee_number_details;
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
    fetchOrganisation() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_all_organisation")
        .then((res) => {
          this.organisation_array = res.data.organisation_details;
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
    getLevelData(designation_id) {
      this.designation_array.map((item) => {
        if (designation_id == item.id) {
          this.designation_name = item.designation;
          this.official_details.level_id = item.level_id;
        }
      });
    },
    generateEmployeeNo(emp_type_id, emp_type_array) {
      emp_type_array.map((item) => {
        if (emp_type_id == item.id) {
          this.employee_type_name = item.employee_type;
          this.official_details.employee_type_name = item.employee_type;
          this.employee_number_limit = item.employee_no_limit;
          this.employee_code = item.employee_auto_gen_name;
        }
      });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "generate_employee_no", {
          params: {
            employee_type_name: this.official_details.employee_type_name,
            employee_no_limit: this.employee_number_limit,
            employee_code: this.employee_code,
          },
        })
        .then((res) => {
          this.official_details.empno = res.data.autogen_emp_id;
          this.emp_number_disabled = true;
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
    fetchOrgSite(org_id) {
      setTimeout(() => {
        this.org_establised_date = this.organisation_array.find(
          (x) => (x.id = org_id)
        ).established_date;
      }, 3000);
      this.fetchAllEmployee(org_id);
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_org_site", {
          params: {
            org_id: org_id,
          },
        })
        .then((res) => {
          this.site_array = res.data.org_site_details;
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
    formattedDate(formatted_date) {
      this.official_details.Joining_date = formatted_date;
    },
    SubmitEmployeeOfficialDetails(page) {
      if (this.$refs.form.validate()) {
        if (page == "samepage") {
          this.saveBtnLoading = true;
          this.saveDisabled = true;
          this.isDisabled = true;
        } else {
          this.isBtnLoading = true;
          this.isDisabled = true;
          this.saveDisabled = true;
        }
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "save_employee_details",
            this.official_details
          )
          .then((res) => {
            if (Array.isArray(res.data.message)) {
              this.array_data = res.data.message.toString();
            } else {
              this.array_data = res.data.message;
            }
            if (res.data.status == "S") {
              this.isBtnLoading = false;
              this.isDisabled = false;
              this.saveBtnLoading = false;
              this.saveDisabled = false;
              this.disable_reporting_to=true;
              // this.profile_details = Object.assign(
              //   this.profile_details,
              //   official_details
              // );
              if (page == "samepage") {
                this.flashMessage.success({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class",
                });
                this.message = res.data.message;
              } else {
                this.$emit("officialDetails", this.official_details);
                this.$emit(
                  "designationEmployeeType",
                  res.data.employee_data.designation.designation,
                  res.data.employee_data.employee_type
                );
              }
            } else if (res.data.status == "E") {
              this.flashMessage.error({
                message: this.array_data,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.isBtnLoading = false;
              this.isDisabled = false;
              this.saveBtnLoading = false;
              this.saveDisabled = false;
            } else {
              this.isBtnLoading = false;
              this.isDisabled = false;
              this.saveBtnLoading = false;
              this.saveDisabled = false;
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
            this.isDisabled = false;
            console.log(err);
          });
      }
    },

    fetchlookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "WEEKDAYS",
          },
        })
        .then((response) => {
          this.working_days_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "EMPLOYEE_STATUS",
          },
        })
        .then((response) => {
          this.employee_status_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      // axios
      //   .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
      //     params: {
      //       lookup_type: "DESIGNATION",
      //     },
      //   })
      //   .then((response) => {
      //     this.designation_array = response.data.lookup_details;
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "DEPARTMENT",
          },
        })
        .then((response) => {
          this.department_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style scoped>
.mt_30 {
  margin-top: -30px;
}
.official_container >>> .v-stepper {
  height: 100% !important;
}
.btn_container {
  top: 85%;
  left: 76vw;
}
/* .cancel_btn {

} */
</style>