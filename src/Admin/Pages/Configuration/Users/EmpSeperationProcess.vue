<template>
  <div class="main-20">
    <!-- <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" /> -->
    <!-- <v-layout class="pt-2 pl-2 pr-2">
      <span class="project_work_heading">
        {{ $t("emp_seperation_process") }}&nbsp;
        <i class="fa fa-external-link "></i>
      </span>      
    </v-layout> -->
    <div>
      <!-- <div class="row pl-5 ">
        <div class="col-md-7 maindivfortravelradio mt-2">
          <h5 class="usernamedisplaytravel"> {{ $t('initiate_emp_seperation') }}</h5>
          <v-radio-group inline v-model="employee_seperation" class="userdetailsoftravel pt-4" :disabled="empSepReadonly">
            <v-radio label="Yes" class="radio_items " :value="1"></v-radio>
            <v-radio label="No" class="radio_items " :value="0"></v-radio>
          </v-radio-group>
        </div>
      </div> -->

      <v-layout wrap class="mt-1" v-if="employee_seperation">
        <v-flex md3 pl-2>
          <div class="userdetails_in_emp_seperation_process">
            <span class="heading_emp_seperation_process">
              {{ $t("Joining_date") }}
            </span>
            <span class="body_emp_seperation_process" v-if="emp_details.Joining_date">{{ emp_details.Joining_date |
              formatFullDate }}</span>
            <span class="body_emp_seperation_process" v-else>{{
              $t("not_appllicable")
            }}</span>
          </div>
        </v-flex>
        <v-flex md3 pl-2>
          <div class="userdetails_in_emp_seperation_process">
            <span class="heading_emp_seperation_process">
              {{ $t("designation") }}
            </span>
            <span class="body_emp_seperation_process" v-if="emp_details.designation_id">{{
              emp_details.designation.designation }}</span>
            <span class="body_emp_seperation_process" v-else>{{
              $t("not_appllicable")
            }}</span>
          </div>
        </v-flex>
        <v-flex md3 pl-2>
          <div class="userdetails_in_emp_seperation_process">
            <span class="heading_emp_seperation_process">
              {{ $t("year_in_service") }}
            </span>
            <span class="body_emp_seperation_process" v-if="emp_details.Joining_date">
              {{ yearDiff }}
              <span v-if="yearDiff > 1">{{ $t("years") }} </span>
              <span v-else>{{ $t("year") }} </span>
              , {{ monthDiff }}
              <span v-if="monthDiff > 1">{{ $t("month") }}</span>
              <span v-else>{{ $t("month") }}</span>
            </span>
            <span class="body_emp_seperation_process" v-else>{{
              $t("not_appllicable")
            }}</span>
          </div>
        </v-flex>
        <v-flex md3 pl-2>
          <div class="userdetails_in_emp_seperation_process">
            <span class="heading_emp_seperation_process">
              {{ $t("total_experience") }}
            </span>
            <span v-if="total_exp" class="body_emp_seperation_process">{{
              total_exp
            }}</span>
          </div>
        </v-flex>
      </v-layout>

      <!-- <v-sheet v-if="employee_seperation && !loader" class="mt-12">
        <v-row wrap class="pl-3 pr-3">
          <v-app-bar>
            <span class="project_work_heading">{{ $t('projects_currently_working_on') }}</span><v-spacer></v-spacer>
            <v-tooltip bottom v-if="!showProject">
              <template v-slot:activator="{ on }">
                <v-btn text @click="hideandshowProject('show')" v-on="on"> <v-icon
                    size="40">mdi-menu-down</v-icon></v-btn>
              </template>
              <span>{{ $t("show_details") }}</span>
            </v-tooltip>
            <v-tooltip bottom v-else>
              <template v-slot:activator="{ on }">
                <v-btn text @click="hideandshowProject('hide')" v-on="on"> <v-icon size="40">mdi-menu-up</v-icon></v-btn>
              </template>
              <span>{{ $t("hide_details") }}</span>
            </v-tooltip>
          </v-app-bar>
        </v-row>
        <v-data-table :headers="headers" class="mt-3" :items="projectDetails" :loading="initval" v-if="showProject">
          <template v-slot:item="props">
            <tr>
              <td v-if="props.item.project_id">{{ props.item.pmo_projectid.project_name }}</td>
              <td v-else>{{ $t('not_appllicable') }}</td>
              <td v-if="props.item.project_id">{{ props.item.pmo_projectid.manager_details.Full_Code }}</td>
              <td v-else>{{ $t('not_appllicable') }}</td>
              <td v-if="props.item.start_date">{{ props.item.start_date | formatdateMonthyear }}</td>
              <td v-else>{{ $t('not_appllicable') }}</td>
              <td v-if="props.item.end_date">{{ props.item.end_date | formatdateMonthyear }}</td>
              <td v-else>{{ $t('not_appllicable') }}</td>
            </tr>
          </template>
        </v-data-table>
        <hr>
      </v-sheet> -->

      <v-layout v-if="employee_seperation" class="pt-2 pl-2 pr-2 mt-5">
        <span class="project_work_heading">{{ $t("emp_seperation") }} &nbsp; <i class="fa fa-road"></i></span>
      </v-layout>
      <v-form ref="emp_sep_form" v-model="valid">
        <div class="row mt-3">
          <div class="col-md-6 px-4">
            <v-layout wrap v-if="employee_seperation">
              <v-flex md11>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-select dense outlined v-bind:label="$t('reason_for_resigning')" v-on="on" :rules="fieldRules"
                      v-model="emp_seperation.reason_for_relieving" class="required_field"
                      :items="reason_for_relieving_array" item-text="shortname" item-value="shortname"
                      @change="relievingLovchange"></v-select>
                  </template>
                  <span>{{ $t("reason_for_resigning") }}</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
            <v-layout wrap v-if="emp_seperation.reason_for_relieving == 'Resigned'">
              <v-flex md11>
                <DatePicker :label="$t('resignation_submitted_on')" :stored_date="emp_seperation.resignation_submitted_on"
                  @formatted_date="formatted_resignation_submitted_on" dense :class_required="'RequiredField'"
                  :max="new Date().toISOString().substr(0, 10)" :rules="fieldRules"
                  v-model="emp_seperation.resignation_submitted_on" />
              </v-flex>
            </v-layout>
            <v-layout wrap v-if="emp_seperation.reason_for_relieving == 'Resigned'">
              <v-flex md11>
                <DatePicker :label="$t('tentative_last_working_day')"
                  :stored_date="emp_seperation.tentative_last_working_day" @formatted_date="formatted_last_working_day"
                  dense :class_required="'RequiredField'" :min="emp_seperation.resignation_submitted_on"
                  :rules="fieldRules" v-model="emp_seperation.tentative_last_working_day" />
              </v-flex>
            </v-layout>
      
            <v-layout wrap v-if="employee_seperation &&
              emp_seperation.reason_for_relieving != 'Resigned' &&
              emp_seperation.reason_for_relieving != '' &&
              emp_seperation.reason_for_relieving != null
              ">
              <v-flex md11 v-if="emp_seperation.reason_for_relieving != 'Death of Employee'">
                <DatePicker :label="$t('relieving_date')" :stored_date="emp_seperation.relieving_date"
                  @formatted_date="formatted_relieving_date" dense :class_required="'RequiredField'"
                  :max="new Date().toISOString().substr(0, 10)" :rules="fieldRules"
                  v-model="emp_seperation.relieving_date" />
              </v-flex>
              <v-flex md11 v-else>
                <DatePicker :label="$t('date_of_death')" :stored_date="emp_seperation.relieving_date"
                  @formatted_date="formatted_relieving_date" dense :class_required="'RequiredField'"
                  :max="new Date().toISOString().substr(0, 10)" :rules="fieldRules"
                  v-model="emp_seperation.relieving_date" />
              </v-flex>
            </v-layout>

          </div>
          <div class="col-md-6 px-4">
            <v-layout wrap v-if="employee_seperation">
              <v-flex md10>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-textarea rows="3" v-on="on" dense outlined v-bind:label="$t('remark')"
                      v-model="emp_seperation.remark"></v-textarea>
                  </template>
                  <span>{{ $t("remark") }}</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
            <v-layout wrap v-if="emp_seperation.reason_for_relieving == 'Resigned'">
              <v-flex md11>
                <div class="browsedivdoc">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-text-field readonly outlined dense prepend-inner-icon="mdi-file" v-on="on"
                        v-model="emp_seperation.upload_resignation_letter" @keypress="callDocumentSelect"
                        @click="callDocumentSelect" v-bind:label="$t('document')"></v-text-field>
                      <v-chip label class="browsebtndoc" @click="callDocumentSelect" color="primary" v-on="on">{{
                        $t("browse") }}</v-chip>
                    </template>
                    <span>{{ $t("document") }}</span>
                  </v-tooltip>
                  <div v-if="emp_seperation.upload_resignation_letter != '' &&
                    emp_seperation.upload_resignation_letter != null
                    " class="documentdownloadapplyleave">
                    <a :href="envImagePath + emp_seperation.upload_resignation_letter
                      " class="text-primary f-13 a-underline">
                      {{ $t("download") }}
                    </a>
                  </div>
                </div>
              </v-flex>
            </v-layout>
          </div>
        </div>
      </v-form>
      <v-row class="mb-3 mr-3 mt-5">
        <v-spacer></v-spacer>
        <div>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn small v-on="on" class="font-weight-bold cancel-btn mr-2 mb-1" color="btn hover_shine cancel_button"
                @click="$router.go(-1)">{{ $t("back") }}</v-btn>
            </template>
            <span>{{ $t("back") }}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn small v-on="on" class="mr-2 success hover_shine mb-1" :disabled="isBtnLoading || isBtnLoading1"
                @click="SaveEmpSeperationProcess">{{ $t("save") }}
                <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
              </v-btn>
            </template>
            <span>{{ $t("save") }}</span>
          </v-tooltip>
        </div>
        <div v-if="empSepReadonly">
          <v-tooltip bottom>
            <!-- routeToexitInterview -->
            <template v-slot:activator="{ on }">
              <v-btn small v-on="on" class="mr-2 ml-1 primary mb-1" :disabled="isBtnLoading || isBtnLoading2"
                @click="checkifManager(1)">{{ $t("save_next") }}
                <b-spinner :disabled="isBtnLoading2" small v-if="isBtnLoading2"></b-spinner>
              </v-btn>
            </template>
            <span>{{ $t("save_next") }}</span>
          </v-tooltip>
        </div>
        <div v-if="empSepReadonly">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn small v-on="on" class="mr-2 ml-1 primary mb-1" :disabled="isBtnLoading1 || isBtnLoading1"
                @click="checkifManager(2)">{{ $t("next") }}
                <b-spinner :disabled="isBtnLoading1" small v-if="isBtnLoading1"></b-spinner>
              </v-btn>
            </template>
            <span>{{ $t("next") }}</span>
          </v-tooltip>
        </div>
      </v-row>
    </div>
    <div style="display: none">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <span v-on="on">
            <DocumentSelect :folder="'emp_resignation_letter'" :uploadtype="enable_document_select"
              @closeDialog="closeDialog" @uploadedDocument="uploadedDocument"
              :documentlink="emp_seperation.upload_resignation_letter"></DocumentSelect>
          </span>
        </template>
        <span>{{ $t("file_input") }}</span>
      </v-tooltip>
    </div>

    <v-dialog v-model="report_dialog" persistent fullscreen transition="dialog-bottom-transition" width="800">
      <v-card>
        <v-toolbar color="primary" dark>
          <span class="headline">{{ $t("assign_reporting_manager") }}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon @click="closereportingmanager" class="dialogcloseinuserdetails" v-on="on">mdi-close</v-icon>
            </template>
            <span>{{ $t("close") }}</span>
          </v-tooltip>
        </v-toolbar>
        <v-card-text>
          <!-- <v-alert v-model="save_error" :text="save_error" color="error" icon="warning" outlined dismissible>
      {{ valertdialogmessage }}</v-alert> -->

          <v-form v-model="valid" ref="form">
            <div v-for="(employee, index) in assigned_employees" :key="index">
              <v-layout class="pa-2 pt-10">
                <v-flex md4 class="pr-2">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field v-on="on" v-model="employee.emp_details.Full_Code" v-bind:label="$t('employee_name')"
                        required dense readonly :rules="fieldRules" class="required_field" outlined></v-text-field>
                    </template>
                    <span>{{ $t("employee_name") }}</span>
                  </v-tooltip>

                  <!-- <v-autocomplete dense v-bind:label="$t('existing_manager')" outlined class="required_field"
                    :rules="fieldRules" disabled v-model="reportingmanager.current_manager" :items="managerslist"
                    item-text="Full_Code" item-value="id"></v-autocomplete> -->
                </v-flex>

                <v-flex md4 class="pr-2">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field v-on="on" v-model="emp_details.Full_Code" v-bind:label="$t('existing_manager')"
                        required dense readonly :rules="fieldRules" class="required_field" outlined></v-text-field>
                    </template>
                    <span>{{ $t("existing_manager") }}</span>
                  </v-tooltip>

                  <!-- <v-autocomplete dense v-bind:label="$t('existing_manager')" outlined class="required_field"
                    :rules="fieldRules" disabled v-model="reportingmanager.current_manager" :items="managerslist"
                    item-text="Full_Code" item-value="id"></v-autocomplete> -->
                </v-flex>
                <v-flex md4 class="pr-2">
                  <v-autocomplete dense v-bind:label="$t('reporting_managers')" outlined class="required_field"
                    :rules="fieldRules" v-model="employee.new_manager_id" :items="managerslist" item-text="Full_Code"
                    item-value="id"></v-autocomplete>
                </v-flex>
                <v-flex md4 class="pr-2">
                  <DatePicker :label="$t('start_date')" :stored_date="employee.end_date" :list_index="index"
                    :rules="fieldRules" :class_required="'RequiredField'" :max="new Date().toISOString().substr(0, 10)"
                    @formatted_date_index="formattedEndDate" />
                </v-flex>
              </v-layout>
            </div>
          </v-form>
          <v-row class="mr-2">
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on" class="d-inline-block mr-2">
                  <v-btn v-on="on" small @click="closereportingmanager" class="ma-1 font-weight-bold cancel-btn"
                    color="btn hover_shine cancel_button">{{ $t("cancel") }}</v-btn>
                </div>
              </template>
              <span>{{ $t("cancel") }}</span>
            </v-tooltip>
            <v-btn small color="success" class="mr-5 mt-1 mb-2" :disabled="isBtnLoading" @click="createnewprimarymanager">
              {{ $t("save") }} &nbsp;
              <b-spinner small v-if="isBtnLoading"></b-spinner>
            </v-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <ConfirmDialog :show="showalert" :cancel="cancelalert" v-bind:title="$t('confirm')"
      v-bind:description="description_text_message" :confirm="confirmassign" />
  </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import DatePicker from "../Components/DatePicker.vue";
import DocumentSelect from "../Components/Upload/DocumentSelect.vue";
export default {
  components: {
    VueElementLoading,
    DatePicker,
    DocumentSelect,
    ConfirmDialog,
  },
  props: ["user_id", "view", "status", "user_slug"],
  data: () => ({
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    google_icon: {
      icon_name: "Badge",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    report_dialog: false,
    save_error: "",
    valertdialogmessage: false,
    managerslist: [],
    remainingmanagerslist: [],
    assigned_employees: [],
    description_text_message: "",
    showalert: false,
    isBtnLoading2: false,
    total_exp: "",
    enable_document_select: "",
    valid: false,
    showProject: true,
    panel: [],
    employee_seperation: 0,
    isBtnLoading: false,
    isBtnLoading1: false,
    empSepReadonly: false,
    emp_details: [],
    todaysdate: new Date().toISOString().substr(0, 10),
    yearDiff: "",
    monthDiff: "",
    initval: false,
    emp_seperation: {
      emp_id: "",
      reason_for_relieving: "",
      remark: "",
      relieving_date: "",
      upload_resignation_letter: "",
      tentative_last_working_day: "",
      resignation_submitted_on: "",
    },
    reportingmanager: {
      current_manager: "",
      manager_id: "",
    },
    reason_for_relieving_array: [],
    projectDetails: [],
    headers: [
      {
        text: "Project Name",
        align: "left",
        value: "",
      },
      {
        text: "Project Manager",
        align: "left",
        value: "",
      },

      {
        text: "Start Date",
        align: "left",
        value: "",
      },
      {
        text: "End date",
        align: "left",
        value: "",
      },
    ],
  }),
  mounted() { },
  created() {
    this.fetchlookup();
  },
  watch: {
    employee_seperation: {
      immediate: true,
      handler() {
        if (this.user_slug) {
          this.employee_seperation = 1;
          this.fetchemployeeDetails();
        }
      },
    },
    user_slug: {
      immediate: true,
      handler() {
        if (this.user_slug) {
          this.fetchemployeeDetails();
        }
      },
    },
    user_id: {
      immediate: true,
      handler() {
        if (this.user_id) {
          this.fetchProjectDetails();
          this.fetchEmpSeperateProcess();
          this.emp_seperation.emp_id = this.user_id;
        }
      },
    },
  },

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },
  methods: {

    createnewprimarymanager() {
      if (this.$refs.form.validate()) {
        this.isBtnLoading = true;
        axios
          .post(process.env.VUE_APP_API_URL_ADMIN + "createreportingmanager", {
            assigned_employees: this.assigned_employees,
          })
          .then((response) => {
            if (response.data.status == "S") {
              this.flashMessage.success({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              // this.fetchallmanagersdatatable();
              this.report_dialog = false;
              this.isBtnLoading = false;
              this.dialog = false;
            }
            if (response.data.status == "NotaManager") {
              this.dialog = false;
              setTimeout(() => {
                this.showalert = true;
                this.description_text_message = response.data.message;
                this.delete_primary = "Primary";
                this.isBtnLoading = false;
                this.confirm_message = this.$t("assign_role");
              }, 100);
            }
            if (response.data.status == "E") {
              this.valertdialogmessage = response.data.message;
              this.save_error = true;
              this.initval = false;
            }
          })
          .catch((err) => {
            this.isBtnLoading = false;
            this.valertdialogmessage = this.$t("something_went_wrong");
            this.save_error = true;
            console.log(err);
            this.initval = false;
          });
      }
    },
    formattedEndDate(formatted_date, index) {
      this.assigned_employees[index].end_date = formatted_date;
    },
    closereportingmanager() {
      this.dialog = false;
      this.report_dialog = false;
      this.save_error = false;
    },
    fetchallManagersList() {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetchmanagers/" + this.user_id
        )
        .then((res) => {
          this.managerslist = res.data.allmanagers;
          // this.managerslist.splice(0, 0, {
          //   id: "0",
          //   Full_Code: "Self",
          // });
          this.initval = false;
          this.dialog = true;
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

    confirmassign() {
      this.showalert = false;
      this.fetchallManagersList();
      this.dialog = false;
      this.report_dialog = true;
    },
    cancelalert() {
      this.showalert = false;
      this.dialog = true;
    },

    checkifManager(from) {
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "checkifmanager/" + this.user_id
        )
        .then((response) => {
          if (response.data.employee_assigned.length > 0) {
            this.description_text_message = response.data.message;
            this.showalert = true;
            this.assigned_employees = response.data.employee_assigned;
          } else if (from == 1) {
            // alert('inside lese')
            if (this.$refs.emp_sep_form.validate()) {
            this.routeToexitInterview();
            }
          } else if (from == 2) {
            this.routeToexit();
          }

          // if (response.data.status == "EXIST") {
          //   this.submit_credential_disable = true;
          //   this.course_exist_focus = true;
          //   this.course_exist_focus_message = "Course already added";
          // } else {
          //   this.course_exist_focus = false;
          //   this.course_exist_focus_message = "";
          //   this.submit_credential_disable = false;
          // }
        })
        .catch((err) => {
          console.log(" error" + err);
        });
    },
    routeToexit() {
      this.isBtnLoading1 = true;
      this.$emit("updatestepper", 2);
      this.isBtnLoading1 = false;
      // setTimeout(() => {
      //   this.$router.push({
      //     name: "exit_interview_process_hr",
      //     query:
      //         {
      //           slug:this.emp_details.slug
      //         },
      //   });
      //   this.isBtnLoading1 = false;
      // }, 500);
    },

    routeToexitInterview() {
      this.isBtnLoading2 = true;
      this.SaveEmpSeperationProcess();
      setTimeout(() => {
        this.isBtnLoading2 = false;
        this.$emit("updatestepper", 2);
      }, 1000);

      // setTimeout(() => {
      //   this.$router.push({
      //     name: "exit_interview_process_hr",
      //     query:
      //         {
      //           slug:this.emp_details.slug
      //         },
      //   });
      //   this.isBtnLoading1 = false;
      // }, 500);
    },
    closeDialog(uploadtype) {
      this.enable_document_select = "";
      console.log("close dialog", uploadtype);
    },

    callDocumentSelect() {
      this.enable_document_select = "DragDrop";
    },
    uploadedDocument(filepath) {
      // this.emp_seperation.upload_resignation_letter = filepath.substring(23);
      this.emp_seperation.upload_resignation_letter = filepath;
      this.closeDialog();
    },

    relievingLovchange() {
      this.emp_seperation.relieving_date = "";
      this.emp_seperation.tentative_last_working_day = "";
      this.emp_seperation.upload_resignation_letter = "";
      this.emp_seperation.resignation_submitted_on = "";
    },
    formatted_relieving_date(formatted_date) {
      this.emp_seperation.relieving_date = formatted_date;
    },
    formatted_resignation_submitted_on(formatted_date) {
      this.emp_seperation.resignation_submitted_on = formatted_date;
    },
    formatted_last_working_day(formatted_date) {
      this.emp_seperation.tentative_last_working_day = formatted_date;
    },
    fetchlookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "REASON_FOR_RELEIVING",
          },
        })
        .then((response) => {
          this.reason_for_relieving_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    hideandshowProject(action) {
      setTimeout(() => {
        if (action == "show") {
          this.showProject = true;
        } else {
          this.showProject = false;
        }
      }, 100);
    },

    fetchProjectDetails() {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
          "getcurrentprojectworkingon/" +
          this.user_id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.projectDetails = res.data.project_worked_on;
            this.initval = false;
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
          this.initval = false;
        });
    },

    SaveEmpSeperationProcess() {
      if (this.$refs.emp_sep_form.validate()) {
        this.isBtnLoading = true;
        this.emp_seperation.emp_id = this.user_id;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "saveemployeeseperationprocess",
            this.emp_seperation
          )
          .then((res) => {
            if (res.data.status == "S") {
              this.isBtnLoading = false;
              this.flashMessage.success({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.fetchEmpSeperateProcess();
            }
          })
          .catch((err) => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            console.log(" error" + err);
            this.isBtnLoading = false;
          });
      }
    },

    fetchEmpSeperateProcess() {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
          "fetchemployeeseperateprocess/" +
          this.user_id
        )
        .then((res) => {
          if (res.data.status == "S") {
            if (res.data.data) {
              this.employee_seperation = 1;
              this.empSepReadonly = true;
              this.emp_seperation = res.data.data;
            }
            this.initval = false;
            this.$emit("getdatasuccess", 1);
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
          this.initval = false;
        });
    },

    differenceInMonths(date1, date2) {
      const month = date1.getMonth() - date2.getMonth();
      const year = date1.getYear() - date2.getYear();
      const Month_Diff = month + year * 12;
      this.yearDiff = parseInt(Month_Diff / 12);
      this.monthDiff = Month_Diff - this.yearDiff * 12;
    },

    fetchemployeeDetails() {
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
          "fetchuserbyslug?slug=" +
          this.user_slug
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.emp_details = res.data.user;
            // this.yearDiff = .getYear() - .getYear();
            this.total_exp = res.data.total_exp;
            const date1 = new Date(this.todaysdate);
            const date2 = new Date(res.data.user.Joining_date);
            this.differenceInMonths(date1, date2);            
          } else {
            this.flashMessage.error({
              message: res.data.message,
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
  },
};
</script>
<style scoped>
.usernamedisplaytravel {
  font-size: 15px;
  font-weight: 500;
  padding-bottom: 10px;
}

.project_work_heading {
  font-size: 17px;
  font-weight: 500;
}

.radio_items {
  margin-left: 78px;
  align-items: flex-start !important;
}

.userdetailsoftravel {
  margin: 0px;
  margin-left: 40px;
}

.maindivfortravelradio {
  align-items: baseline;
  display: inline-flex;
  padding: 0% !important;
}

.userdetails_in_emp_seperation_process {
  display: grid;
}

.heading_emp_seperation_process {
  font-size: 14px;
  font-weight: 500;
  color: #6c5d5d;
  margin-bottom: 2px;
}

.body_emp_seperation_process {
  font-size: 14px;
  font-weight: 500;
  color: #403636;
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

.documentdownloadapplyleave {
  position: absolute;
  right: 3px;
  top: 40px;
  font-size: 13px;
  font-weight: 600;
}

.documentdownloadapplyleave:hover {
  font-weight: 700;
  cursor: pointer;
}
</style>
