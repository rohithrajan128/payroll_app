
<template>
  <div class="main-20">
    <div>
      <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
      <v-sheet class="pa-10 vlayoutDetailsdisplay" :class="{ header: true, scrolled: isScrolled }">
        <v-row wrap class="pt-2">
          <v-col cols="12" md="3">
            <page-title :heading="$t('create_timesheet')" :google_icon="google_icon"></page-title>
          </v-col>
          <v-col cols="12" md="6">
            <div class="d-flex">
              <div class="data-card">
                <div class="data-header">{{ $t("date") }}</div>
                <div class="values pa-2 text-center" v-if="fetchprojectdetails_array.submittedDate">
                  {{ fetchprojectdetails_array.submittedDate | formatFullDate }}
                </div>
                <div class="values px-2" v-else>
                  {{ $t("not_appllicable") }}
                </div>
              </div>
              <div class="ml-5 data-card">
                <div class="data-header">{{ $t("max_work_hours") }}</div>
                <div class="pa-2 values text-center">{{ max_work_hour }}</div>
              </div>
              <div class="ml-5 data-card">
                <div class="data-header">{{ $t("remaining_work_hours") }}</div>
                <div class="pa-2 values text-center">
                  {{ remainingWorking_hours }}
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="3">
            <div class="d-flex">
              <div>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn small v-on=on color="btn hover_shine cancel_button" class="mr-1 mb-2"
                      @click="cancelTimesheet()">{{ $t("cancel") }}</v-btn>
                  </template>
                  <span>{{ $t("cancel") }}</span>
                </v-tooltip>
              </div>
              <!-- <div v-if="displaySubmit && !submit_button"> -->
              <div v-if="displaySubmit">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn small color="btn mr-1 mb-2 hover_shine add_new" class="mr-4" @click="submitconfirm = true"
                      :disabled="isBtnLoading1" v-on="on">
                      {{ $t("submit_for_approval") }}
                      <b-spinner :disabled="isBtnLoading1" small v-if="isBtnLoading1"></b-spinner>
                    </v-btn>
                  </template>
                  <span>{{ $t("submit_for_approval") }}</span>
                </v-tooltip>
              </div>
            </div>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>

        <!--  <div class="row mt-6 pl-12" v-if="no_comp_off">
          <div class="col-md-3 col-sm-3 col-lg-3">
            <div>{{ $t("date") }}</div>
            <div class="values" v-if="fetchprojectdetails_array.submittedDate">
              {{ fetchprojectdetails_array.submittedDate | formatFullDate }}
            </div>
            <div class="values" v-else>{{ $t("not_appllicable") }}</div>
          </div>-->
        <!-- <div class="col-md-3 col-sm-3 col-lg-3 text-center">
            <div>{{ $t("max_work_hours") }}</div>
            <div class="values" v-if="max_work_hour">{{ max_work_hour }}</div>
            <div class="values" v-else>{{ $t('not_appllicable') }}</div>
          </div>-->
        <!-- <div class="col-md-3 col-sm-3 col-lg-3 text-left">
            <div>{{ $t("max_work_hours") }}</div>
          {{ max_work_hour }}-->
        <!-- <div v-if="progressbartimeleft >= 0">
              <div class="values" v-if="remainingWorking_hours">
                <v-progress-circular
                  :size="56"
                  :width="10"
                  :rotate="270"
                  v-model="progressbartimeleft"
                  color="primary"
                  style="margin-top: 5px; margin-right: 36px"
                >
                  {{ max_work_hour }}
                  <span>{{ $t("H") }}</span>
                </v-progress-circular>
              </div>
              <div class="values" v-else>
                <v-progress-circular
                  :size="56"
                  :width="10"
                  :rotate="270"
                  v-model="progressbartimeleft"
                  color="success"
                  style="margin-top: 5px; margin-right: 36px"
                >
                  {{ max_work_hour }}
                  <span>{{ $t("H") }}</span></v-progress-circular
                >
              </div>
          </div>-->
        <!-- </div> -->
        <!-- <div class="col-md-3 col-sm-3 col-lg-3 text-left">
            <div>{{ $t("remaining_work_hours") }}</div>

            <div>{{ remainingWorking_hours }}</div>
          </div>
        </div>-->
        <v-form ref="compoffref" v-model="valid">
          <div class="row mt-6">
            <div class="col-md-3 col-sm-3 col-lg-3" v-if="no_comp_off">
              <div class="d-flex">
                <p>{{ $t("apply_comp_off") }}</p>
                <v-checkbox v-model="comp_off_check" class="check_box_margin"
                  @change="enableCompOff(comp_off_check)"></v-checkbox>
              </div>
            </div>

            <div class="col-md-3 col-sm-3 col-lg-3" v-if="compoff_type != null">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete dense outlined :rules="fieldRules" required :label="$t('day_type')"
                    :items="day_type_array" item-text="longname" item-value="shortname" v-model="day_type" v-on="on"
                    :disabled="submit_button"></v-autocomplete>
                </template>
                <span>{{ $t("day_type") }}</span>
              </v-tooltip>
            </div>
            <div class="col-md-3 col-sm-3 col-lg-3" v-if="compoff_type != null">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete dense outlined :rules="fieldRules" required :label="$t('adjust_compoff_leave')"
                    :items="adjust_compoff_items" item-text="longname" item-value="longname"
                    v-model="adjust_compoff_leave" v-on="on" :disabled="submit_button"></v-autocomplete>
                </template>
                <span>{{ $t("adjust_compoff_leave") }}</span>
              </v-tooltip>
            </div>

            <div class="col-md-3 col-sm-3 col-lg-3 comp_off_width" v-if="compoff_type != null">
              <div>{{ $t("compoff_type") }}</div>
              <div class="values" v-if="compoff_type">{{ compoff_type }}</div>
              <div class="values" v-else>{{ $t("not_appllicable") }}</div>
            </div>
          </div>
        </v-form>
      </v-sheet>
      <!-- <hr /> -->
      <!-- <v-layout wrap class="mb-2 pr-4"> -->
      <!-- <v-spacer></v-spacer> -->
      <!-- <v-flex xs12 sm6 md6 class="text-right">
               <v-btn small @click="sendTimesheetStatus" color="btn mr-2 mb-2 hover_shine add_new" >{{
                  $t("send_status")
               }}</v-btn>
      </v-flex>-->
      <!-- </v-layout> -->
      <div class="mt-4">
        <v-form ref="activityref" v-model="valid">
          <v-sheet v-for="(activity_data, activity_index) in activities" :key="activity_index">
            <v-card>
              <div v-if="activity_data.status_update != true">
                <div class="activitycheckboxrow">
                  <v-checkbox class="ml-10 vcheckboxindex" v-if="activity_data.id >= 1" v-model="selectcheckboxId"
                    :value="activity_data.id" multiple :disabled="activity_data.status_update == true &&
                      activity_data.timesheet_status != 'Rejected'
                      "></v-checkbox>
                  <v-checkbox class="ml-10 vcheckboxindex" v-else v-model="selectcheckboxIndex" :value="activity_index"
                    multiple :disabled="activity_data.status_update == true &&
                      activity_data.timesheet_status != 'Rejected'
                      "></v-checkbox>
                </div>
              </div>
              <div v-else>
                <div class="statusshowicon" v-if="activity_data.timesheet_status == 'Approved'">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on" color="success" medium>mdi-check-decagram</v-icon>
                    </template>
                    <span>{{ $t("approved") }}</span>
                  </v-tooltip>
                </div>
                <div class="statusshowicon" v-if="activity_data.timesheet_status == 'Rejected'">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on" color="error" medium>mdi-progress-close</v-icon>
                    </template>
                    <span>{{ $t("rejected") }}</span>
                  </v-tooltip>
                </div>
              </div>
              <v-row>
                <v-spacer></v-spacer>
                <div class="projectmanagerchiptimesheet" v-if="activity_data.project_slug">
                  <span class="align-self-center projectmanagerchiptimesheetspan">{{ $t("managed_by") }}:</span>
                  <v-chip color="primary" outlined class="projectmanagerchiptimesheetprofilechip" v-if="activity_data.project_slug &&
                    managerloading != activity_index
                    ">
                    <v-avatar left>
                      <v-img v-if="activity_data.project_manager &&
                        activity_data.project_manager.profile_pic
                        " :src="envImagePath +
    activity_data.project_manager.profile_pic
    " alt></v-img>
                      <img v-else src="@/assets/images/default-user-profile-picture.png" alt />
                    </v-avatar>
                    {{ activity_data.project_manager.Full_Code }}
                  </v-chip>
                  <v-progress-linear color="primary" indeterminate class="pr-3"
                    v-if="managerloading == activity_index"></v-progress-linear>
                </div>
              </v-row>
              <div class="row pb-6 mt-30">
                <div class="col-md-7 project_display">
                  <v-layout wrap class="pl-16">
                    <v-flex md6 pr-4 pl-4>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-autocomplete v-on="on" v-model="activity_data.project_slug" dense outlined @change="
                            fetchprojectmanagername(
                              activity_data.project_slug,
                              activity_index
                            )
                            " :disabled="activity_data.status_update == true &&
    activity_data.timesheet_status != 'Rejected'
    " :rules="fieldRules" class="required_field" :label="$t('project')" no-data-text="No project available"
                            :items="assignedProjects" item-value="slug" item-text="project_name"></v-autocomplete>
                        </template>
                        <span>{{ $t("project") }}</span>
                      </v-tooltip>
                    </v-flex>
                    <v-flex md6>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-autocomplete v-on="on" v-model="activity_data.task_name" dense outlined :disabled="activity_data.status_update == true &&
                            activity_data.timesheet_status != 'Rejected'
                            " :rules="fieldRules" class="required_field" :label="$t('activity')" :items="activity_type"
                            item-text="longname" item-value="longname"></v-autocomplete>
                        </template>
                        <span>{{ $t("activity") }}</span>
                      </v-tooltip>
                    </v-flex>
                  </v-layout>
                  <v-layout wrap class="pt-3 pl-16">
                    <!-- <v-flex pr-4 md4 pl-4>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-textarea
                            dense
                            outlined
                            v-model="activity_data.emp_comment"
                            :label="$t('emp_comment')"
                            :disabled="activity_data.status_update == true && activity_data.timesheet_status != 'Rejected'"
                            rows="1"
                            v-on="on"
                          ></v-textarea>
                        </template>
                        <span>{{ $t("emp_comment") }}</span>
                      </v-tooltip>
                    </v-flex>-->
                    <v-flex md6 pr-4 pl-4>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-autocomplete dense outlined :label="$t('activity_status')" :items="activity_status"
                            :disabled="activity_data.status_update == true &&
                              activity_data.timesheet_status != 'Rejected'
                              " v-model="activity_data.task_status" item-text="longname" :rules="fieldRules"
                            class="required_field" item-value="longname" v-on="on"></v-autocomplete>
                        </template>
                        <span>{{ $t("activity_status") }}</span>
                      </v-tooltip>
                    </v-flex>
                    <v-flex md3>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-text-field :rules="fieldRules" class="required_field pr-25" dense outlined
                            :label="$t('eta_given')" hint="In Hours" :disabled="activity_data.status_update == true &&
                              activity_data.timesheet_status != 'Rejected'
                              " v-on:keypress="NumbersOnly" @input="handleEtaInput(activity_index)" @keydown="
    handleEtaBackspace(activity_index, $event)
    " maxlength="3" v-on="on" v-model="activity_data.eta_given"></v-text-field>
                        </template>
                        <span>{{ $t("eta_given") }}</span>
                      </v-tooltip>
                    </v-flex>
                    <v-flex md3 pl-2>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-text-field :rules="fieldRules" class="required_field" dense outlined v-on="on"
                            :label="$t('todays_effort')" hint="In Hours" v-on:keypress="NumbersOnly"
                            @input="handleInput(activity_index)" @keydown="handleBackspace(activity_index, $event)"
                            maxlength="3" :error="activity_data.noOfHourerror" :disabled="activity_data.status_update == true &&
                              activity_data.timesheet_status != 'Rejected'
                              " :error-messages="activity_data.noOfHourerrorMessage" v-model="activity_data.no_of_hrs"
                            @keyup="maxworkinghourscheck(activity_index)"></v-text-field>
                        </template>
                        <span>{{ $t("todays_effort") }}</span>
                      </v-tooltip>
                    </v-flex>
                  </v-layout>
                  <v-layout wrap class="pt-3 pl-16" v-if="activity_data.approver_comment != null &&
                    activity_data.status_update == true
                    ">
                    <v-textarea rows="2" class="ml-4" v-on="on" dense outlined readonly
                      v-model="activity_data.approver_comment" :label="$t('approver_comment')"></v-textarea>
                  </v-layout>
                </div>
                <div class="col-md-5 pr-14 project_display">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-textarea rows="4" v-on="on" dense outlined counter="1000" maxlength="1000" :disabled="activity_data.status_update == true &&
                        activity_data.timesheet_status != 'Rejected'
                        " v-model="activity_data.task_desc" :label="$t('activity_description')" :rules="fieldRules"
                        class="required_field"></v-textarea>
                    </template>
                    <span>{{ $t("activity_description") }}</span>
                  </v-tooltip>
                </div>
              </div>
              <v-row v-if="activity_index == activities.length - 1" style="margin-top: -20px">
                <v-spacer></v-spacer>
                <v-btn small @click="dialogDelete = true" color="btn hover_shine error_button" class="ml-8 mb-5 mr-2"
                  :disabled="show_delete_btn" v-if="selectcheckboxId.length != '0' ||
                    selectcheckboxIndex.length != '0'
                    ">
                  {{ $t("delete") }}
                  <b-spinner :disabled="show_delete_btn" small v-if="show_delete_btn"></b-spinner>
                </v-btn>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn small color="btn hover_shine add_new" @click="addActivity" class="mb-5" v-on="on"
                      :disabled="remainingWorking_hours == 0">{{ $t("add_activity") }}</v-btn>
                  </template>
                  <span>{{ $t("add_activity") }}</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn small color="btn hover_shine add_new" class="ml-2 mr-15 mb-5" @click="addActivityTimesheet"
                      :disabled="isBtnLoading ||
                        !hidesavebutton ||
                        (submit_button && remainingWorking_hours >= max_work_hour)
                        " v-on="on">
                      {{ $t("save_activity") }}
                      <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
                    </v-btn>
                  </template>
                  <span>{{ $t("save_activity") }}</span>
                </v-tooltip>
              </v-row>
            </v-card>
          </v-sheet>
        </v-form>
      </div>
    </div>

    <!-- <ConfirmDialog :id="delete_id" :show="dialogDelete" :cancel="closeDelete" :confirm="deleteItemConfirm"
    v-bind:title="$t('confirm')" v-bind:description="$t('want_to_delete')" />-->
    <ConfirmDialog :show="dialogDelete" :cancel="closeDelete" :confirm="deleteItemConfirm" v-bind:title="$t('confirm')"
      v-bind:description="$t('want_to_delete')" />

    <ConfirmDialog :show="submitconfirm" :cancel="closesubmit" :confirm="submitConfirmsave" v-bind:title="$t('confirm')"
      v-bind:description="$t('want_to_submit')" />
  </div>
</template>
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import VueElementLoading from "vue-element-loading";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
export default {
  components: {
    PageTitle,
    VueElementLoading,
    ConfirmDialog,
  },
  data: () => ({
    google_icon: {
      icon_name: "work_history",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    user: [],
    showhundred: 100,
    progressbartimeleft: null,
    progressbarremainingworkhours: null,
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    user_id: "",
    assignedProjects: [],
    day_type: "",
    projectsluglength: "",
    activityslugvalue: "",
    day_type_array: [],
    adjust_compoff_leave: "",
    day_items: [],
    adjust_compoff_items: [],
    timesheetCheckbox: false,
    project_details: [],
    loader: true,
    isBtnLoading: false,
    isBtnLoading1: false,
    activity_type: [],
    activity_status: [],
    timesheet_status: [],
    max_work_hour: "",
    valid: true,
    displaySubmit: false,
    ActivityofDate: [],
    compoff_type: null,
    comp_off_check: 0,
    time_sheet_status: "",
    timesheet: {
      id: "0",
      org_id: "",
      submitted_date: "",
      project_slug: "",
      task_name: "",
      activity_name: "",
      task_desc: "",
      task_status: "",
      no_of_hrs: null,
      timesheet_status: "",
      emp_comment: "",
      approver_comment: "",
      eta_given: "",
      eta_taken: "",
      emp_id: "",
      active: "",
      dependency: "",
      dependency_comment: "",
      project_manager: "",
      noOfHourerrorMessage: "",
      noOfHourerror: false,
    },
    sumofNoOfHrs: null,
    managerloading: null,
    hidesavebutton: false,
    activities: [],
    selectcheckboxIndex: [],
    selectcheckboxId: [],
    dialogDelete: false,
    submitconfirm: false,
    show_delete_btn: false,
    remainingWorking_hours: 0,
    no_comp_off: "",
    submit_button: false,
    fetchprojectdetails_array: {
      empID: "",
      submittedDate: "",
    },
    isScrolled: false,
    //checkall: false,
  }),
  watch: {
    user_id: {
      immediate: true,
      handler() {
        if (this.user_id >= 1) {
          this.fetch_project_assigned();
          this.fetchactivityByDate();
        }
      },
    },
    "$route.query.selectedDate": {
      immediate: true,
      handler() {
        this.timesheet.submitted_date = this.$route.query.selectedDate;
        this.timesheet.emp_id = this.$route.query.selectedID;
        this.timesheet.org_id = this.$route.query.userOrgID;
        this.fetchprojectdetails_array.submittedDate =
          this.$route.query.selectedDate;
        this.fetchprojectdetails_array.empID = this.$route.query.selectedID;
      },
    },
    "$route.query.compoff_type": {
      immediate: true,
      handler() {
        if (this.$route.query.compoff_type == "NoCompOff") {
          // alrt()
          this.compoff_type = null;
          setTimeout(() => {
            this.no_comp_off = this.$route.query.compoff_type;
          }, 2900);
          this.comp_off_check = 0;
        } else if (this.$route.query.compoff_type) {
          setTimeout(() => {
            this.compoff_type = this.$route.query.compoff_type;
            this.no_comp_off = this.$route.query.compoff_type;
            this.comp_off_check = 1;
          }, 2900);
        }
      },
    },
  },
  methods: {
    handleInput(index) {
      // Check if the input ends with a dot ('.')
      if (this.activities[index].no_of_hrs.endsWith(".")) {
        if (this.activities[index].no_of_hrs == ".") {
          this.activities[index].no_of_hrs = "0.";
        }
        this.activities[index].no_of_hrs += "5";
      }
    },
    handleBackspace(index, event) {
      if (event.keyCode == 8) {
        if (this.activities[index].no_of_hrs.endsWith(".5")) {
          this.activities[index].no_of_hrs = this.activities[
            index
          ].no_of_hrs.slice(1, 2);
        }
      }
    },
    handleEtaInput(index) {
      if (this.activities[index].eta_given.endsWith(".")) {
        if (this.activities[index].eta_given == ".") {
          this.activities[index].eta_given = "0.";
        }
        this.activities[index].eta_given += "5";
      }
    },
    handleEtaBackspace(index, event) {
      if (event.keyCode == 8) {
        if (this.activities[index].eta_given.endsWith(".5")) {
          this.activities[index].eta_given = this.activities[
            index
          ].eta_given.slice(1, 2);
        }
      }
    },
    updateHeaderBackground() {
      this.isScrolled = window.scrollY > 0;
    },
    enableCompOff(comp_off_data) {
      // alert(comp_off_data)
      if (comp_off_data == false) {
        this.compoff_type = null;
        this.adjust_compoff_leave = "";
        this.day_type = "";
        this.submit_button = false;
        this.displaySubmit = true;
        this.no_comp_off = this.$route.query.working_type;
      } else {
        this.compoff_type = this.$route.query.working_type;
        this.adjust_compoff_leave = "";
        this.day_type = "";
        this.submit_button = false;
        if (this.activities[0].task_name != "") {
          this.displaySubmit = true;
        }
      }
    },
    cancelTimesheet() {
      this.$router.push({
        name: "timesheet",
        query: {
          date: this.$route.query.selectedDate,
        },
      });
    },
    addActivity() {
      if (this.$refs.activityref.validate()) {
        this.timesheet.submitted_date = this.$route.query.selectedDate;
        this.timesheet.emp_id = this.$route.query.selectedID;
        this.timesheet.org_id = this.$route.query.userOrgID;
        this.timesheet.noOfHourerrorMessage = "";
        this.timesheet.noOfHourerror = false;
        if (this.projectsluglength == 1) {
          let activity_index_timesheet = this.activities.length;
          this.timesheet.project_slug = this.activityslugvalue;
          this.fetchprojectmanagername(
            this.activityslugvalue,
            activity_index_timesheet
          );
        } else {
          this.timesheet.project_slug = "";
        }
        this.activities.push(this.timesheet);
        this.timesheet = {};
        this.timesheet.id = "0";
        this.timesheet.task_name = "";
        this.timesheet.project_slug = "";
        this.timesheet.activity_name = "";
        this.timesheet.task_desc = "";
        this.timesheet.task_status = "";
        this.timesheet.no_of_hrs = null;
        this.timesheet.timesheet_status = "";
        this.timesheet.emp_comment = "";
        this.timesheet.approver_comment = "";
        this.timesheet.eta_given = "";
        this.timesheet.eta_taken = "";
        this.timesheet.active = "";
        this.timesheet.dependency = "";
        this.timesheet.dependency_comment = "";
        this.timesheet.project_manager = "";
        this.managerloading = null;
        if (this.projectsluglength == 1) {
          let activity_index_timesheet = this.activities.length - 1;
          this.fetchprojectmanagername(
            this.activityslugvalue,
            activity_index_timesheet
          );
        }
        this.checkAllStatusupdated();
      }
    },

    fetch_project_assigned() {
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
          "fetch_assigned_project/" +
          this.user_id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.assignedProjects = res.data.assigned_project;
            this.projectsluglength = res.data.sluglength;
            if (this.projectsluglength == 1) {
              this.activityslugvalue = this.assignedProjects["0"].slug;
            }
          }
        })
        .catch((err) => {
          console.log("this error" + err);
        });
    },
    fetchprojectmanagername(slug, index) {
      this.managerloading = index;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
          "fetchtimesheetprojectmanagername/" +
          slug
        )
        .then((response) => {
          if (response.data.status == "S") {
            this.activities[index].project_manager =
              response.data.project_manager.manager_details;
            this.managerloading = null;
          } else {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.managerloading = null;
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(err);
        });
    },
    fetchProjectDetails(slug) {
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
          "fetchprojectmanagernamefromid/" +
          slug
        )
        .then((res) => {
          this.project_details = res.data.projectDetails;
          this.loader = false;
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

    fetchlookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "TASKNAME",
          },
        })
        .then((response) => {
          this.activity_type = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "DAY_TYPE",
          },
        })
        .then((response) => {
          this.day_type_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "ADJUST_COMPOFF_LEAVE",
          },
        })
        .then((response) => {
          this.adjust_compoff_items = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "TASKSTATUS",
          },
        })
        .then((response) => {
          this.activity_status = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "TIMESHEETSTATUS",
          },
        })
        .then((response) => {
          this.timesheet_status = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    addActivityTimesheet() {
      //$compoff_valid=this.$refs.activityref.validate();
      if (this.comp_off_check == true) {
        var $timesheet_valid = this.$refs.compoffref.validate();
      } else {
        var $timesheet_valid = 1;
      }
      if (this.$refs.activityref.validate() && $timesheet_valid) {
        this.isBtnLoading = true;
        axios
          .post(process.env.VUE_APP_API_URL_ADMIN + "createtimesheet", {
            activities: this.activities,
            empID: this.$route.query.selectedID,
            submittedDate: this.$route.query.selectedDate,
            maxWorkhours: this.max_work_hour,
            adjust_compoff_leave: this.adjust_compoff_leave,
            day_type: this.day_type,
            compoff_type: this.compoff_type,
            no_comp_off: this.no_comp_off,
          })
          .then((response) => {
            if (response.data.status == "S") {
              this.isBtnLoading = false;
              this.flashMessage.success({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              window.scrollTo(0, 0);
              this.fetchactivityByDate();
            } else if (response.data.status == "NO_HOURS") {
              this.isBtnLoading = false;
              this.flashMessage.error({
                message: response.data.message + this.max_work_hour + ".0",
                time: 4000,
                blockClass: "custom-block-class",
              });
            } else if (response.data.status == "compoffexist") {
              this.isBtnLoading = false;
              this.flashMessage.error({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
            } else {
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.isBtnLoading = false;
            }
          })
          .catch((err) => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            console.log(err);
            this.isBtnLoading = false;
          });
      }
    },
    submitConfirmsave() {
      this.submitconfirm = false;
      this.submitForApproval();
    },
    submitForApproval() {
      if (this.comp_off_check == true) {
        var validate_form = this.$refs.compoffref.validate();
        var validate_activity_form = this.$refs.activityref.validate();
      } else {
        validate_form = true;
        validate_activity_form = this.$refs.activityref.validate();

      }
      if (validate_form && validate_activity_form) {
        this.isBtnLoading1 = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "timesheetsubmitforapproval",
            {
              submited_date: this.fetchprojectdetails_array.submittedDate,
              emp_id: this.fetchprojectdetails_array.empID,
              day_type: this.day_type,
              adjust_compoff_leave: this.adjust_compoff_leave,
            }
          )
          .then((response) => {
            if (response.data.status == "S") {
              this.isBtnLoading1 = false;
              this.flashMessage.success({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.fetchactivityByDate();
              this.$router.push({
                name: "timesheet",
              });
            } else {
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.isBtnLoading1 = false;
            }
          })
          .catch((err) => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            console.log(err);
            this.isBtnLoading1 = false;
          });
      }
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

    fetchactivityByDate() {
      this.loader = true;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "gettimesheet",
          this.fetchprojectdetails_array
        )
        .then((response) => {
          if (response.data.status == "S") {
            console.log("response data");
            if (response.data.timesheet.length > 0) {
              this.compoff_type = response.data.timesheet[0].compoff_type;
              this.day_type = response.data.timesheet[0].day_type;
              this.adjust_compoff_leave =
                response.data.timesheet[0].adjust_comoff_leave;
            }
            this.activities = response.data.timesheet;
            if (this.activities.length > 0) {
              this.time_sheet_status = this.activities.find(
                (x) => x.timesheet_status == "Approved"
              );
            }
            if (
              this.time_sheet_status &&
              this.time_sheet_status.timesheet_status == "Approved"
            ) {
              this.submit_button = true;
            } else {
              this.submit_button = false;
            }
            this.remainingWorking_hours = response.data.remaining_hours;
            this.max_work_hour = response.data.maximumworkinghour;
            if (response.data.remaining_hours >= 1) {
              this.progressbartimeleft =
                (response.data.remaining_hours / 8) * 100;
              this.progressbarremainingworkhours =
                100 - this.progressbartimeleft;
            } else {
              this.progressbartimeleft = 0;
              this.progressbarremainingworkhours = 100;
            }
            if (response.data.all_activity_approved >= 1) {
              this.displaySubmit = true;
            } else {
              this.displaySubmit = false;
            }
            this.checkAllStatusupdated();
            if (this.activities.length == 0) {
              this.addActivity();
            }
            this.loader = false;
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
          console.log(err);
          this.loader = false;
          // this.close();
        });
    },
    checkAllStatusupdated() {
      this.hidesavebutton = false;
      for (var i = 0; i < this.activities.length; i++) {
        if (
          this.activities[i].status_update != true ||
          this.activities[i].timesheet_status == "Rejected"
        ) {
          this.hidesavebutton = true;
        }
      }
    },

    closeDelete() {
      this.dialogDelete = false;
    },
    closesubmit() {
      this.submitconfirm = false;
    },

    deleteItemConfirm() {
      if (this.selectcheckboxIndex.length != "0") {
        this.selectcheckboxIndex.sort(function (a, b) {
          return a - b;
        });
        var flag_for_checkbox = 0;
        for (var j = 0; j < this.selectcheckboxIndex.length; j++) {
          var z = j - flag_for_checkbox;
          this.activities.splice(this.selectcheckboxIndex[z], 1);
          flag_for_checkbox++;
        }
      }
      this.selectcheckboxIndex = [];
      this.dialogDelete = false;
      // this.checkall = false;
      if (this.selectcheckboxId.length != "0") {
        this.show_delete_btn = true;
        this.dialogDelete = false;

        axios
          .post(process.env.VUE_APP_API_URL_ADMIN + "deletetimesheet/", {
            delete_ids: this.selectcheckboxId,
          })
          .then((response) => {
            if (response.data.status == "S") {
              this.flashMessage.success({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.selectcheckboxId = [];
              this.show_delete_btn = false;
              this.fetchactivityByDate();
              //this.checkall = false;
            } else {
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.show_delete_btn = false;
            }
          })
          .catch((err) => {
            this.show_delete_btn = false;
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            console.log(err);
            this.close();
          });
      }
      // this.fetchactivityByDate();
    },

    maxworkinghourscheck(index) {
      this.sumofNoOfHrs = 0;
      this.activities[index].noOfHourerror = false;
      this.activities[index].noOfHourerrorMessage = "";
      this.activities.map((array) => {
        if (array.no_of_hrs > 0) {
          this.sumofNoOfHrs = this.sumofNoOfHrs + parseInt(array.no_of_hrs);
        }
      });
      if (this.sumofNoOfHrs > this.max_work_hour) {
        this.activities[index].noOfHourerror = true;
        this.activities[index].noOfHourerrorMessage =
          "Maximum working Hours/Day is " + this.max_work_hour;
      }
    },

    // selectallCheckbox() {
    //    this.selectcheckboxIndex = [];
    //    this.selectcheckboxId = [];
    //    for (var activityID = 0; activityID < this.activities.length; activityID++) {
    //       if (this.activities[activityID].id == '0') {
    //          if (this.checkall == true) {
    //             this.selectcheckboxIndex.push(this.activities.indexOf(this.activities[activityID]));
    //          }
    //          else {
    //             this.selectcheckboxIndex = [];
    //          }
    //       }
    //       else {
    //          if (this.checkall == true) {
    //             this.selectcheckboxId.push(this.activities[activityID].id);
    //          }
    //          else {
    //             this.selectcheckboxId = [];
    //          }
    //       }
    //    }
    // },
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.updateHeaderBackground);
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.user_id = this.user.emp_id;
    this.fetchlookup();
    this.timesheet.submitted_date = this.$route.query.selectedDate;
    this.timesheet.emp_id = this.$route.query.selectedID;
    this.timesheet.org_id = this.$route.query.userOrgID;
    window.addEventListener("scroll", this.updateHeaderBackground);
    // this.addActivity();
  },
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },
};
</script>

<style scoped>
.activitycheckboxrow {
  position: absolute;
  top: 53px;
  z-index: 1 !important;
}

.vcheckboxindex {
  z-index: 1 !important;
}

.statusshowicon {
  position: absolute;
  top: 73px;
  left: 43px;
  z-index: 1 !important;
}

.values {
  font-weight: bold;
  font-size: 14px;
}

.projectmanagerchiptimesheet {
  position: absolute;
  left: 81px;
  top: 20px;
  border-radius: 4px !important;
}

.projectmanagerchiptimesheetspan {
  font-size: 13px;
  font-weight: 600;
  color: #0000009e;
  margin-right: 3px;
}

.projectmanagerchiptimesheetprofilechip {
  border-radius: 8px !important;
}

.btn-right {
  text-align: right;
}

.mt-30 {
  margin-top: 30px !important;
}

.comp_off_width {
  max-width: 25%;
}

.pl-77 {
  padding-left: 77px;
}

.check_box_margin {
  margin: -5px 0px 0px 7px;
}

.project_display {
  margin-top: 35px;
}

.data-card {
  /* border: 1px solid grey; */
  /* padding: 8px; */
  border-radius: 5px;
  box-shadow: 0px 0px 5px gray;
}

.header.scrolled {
  position: sticky;
  top: 40px;
  z-index: 10;
  border-bottom: 1px solid grey;
  background: rgb(244, 244, 244);
}

.data-header {
  border-radius: 5px 5px 0px 0px;
  background: #6c6c6c;
  color: white;
  padding: 5px;
  text-align: center;
}
</style>