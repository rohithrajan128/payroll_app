<template>
  <div class="main-20">
    <div class="pa-5">
      <page-title :heading="$t('timesheet_approval')" :google_icon="google_icon"></page-title>
    </div>
    <v-sheet class="">
      <v-form ref="form" v-model="valid">
        <v-layout class="pb-1 pt-7 pl-3">
          <v-flex md3>
            <v-row>
              <!-- <v-col md="3" class="align-self-center pb-9 required_field text-right">
                <span class="paragraph_timesheet">{{ $t("project") }}</span>
              </v-col> -->
              <v-col md="10">
                <v-autocomplete dense outlined :items="is_proj_active ? manager_project : project_inactive"
                  v-bind:label="$t('project')" item-value="id" item-text="project_name"
                  @change="projectselected(timesheet_filter.project)" v-model="timesheet_filter.project"
                  :rules="fieldRules" class="required_field"></v-autocomplete>
                <v-checkbox class="mt-0 pt-0" v-model="is_proj_active" label="Active Projects"></v-checkbox>
              </v-col>
            </v-row>
          </v-flex>
          <v-flex md3>
            <v-row>
              <!-- <v-col md="3" class="align-self-center pb-9 required_field text-right">
                <span class="paragraph_timesheet">{{ $t("resource") }}</span>
              </v-col> -->
              <v-col md="10">
                <v-autocomplete dense outlined v-bind:label="$t('resource')" :items="project_resources"
                  item-value="emp_id" item-text="hr_emp_id.Full_Code" v-model="timesheet_filter.resource"
                  @change="fetchalltimesheets" class="required_field"></v-autocomplete>
              </v-col>
            </v-row>
          </v-flex>
          <v-flex md3>
            <v-row>
              <!-- <v-col md="3" class="align-self-center pb-9 required_field text-right">
                <span class="paragraph_timesheet">{{ $t("month") }}</span>
              </v-col> -->
              <v-col md="10">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-menu v-on="on" ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="date"
                      transition="scale-transition" offset-y max-width="290px" min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="convertedmonth" v-bind:label="$t('month')" append-icon="mdi-calendar"
                          outlined dense readonly v-bind="attrs" v-on="on" class="required_field"></v-text-field>
                      </template>
                      <v-date-picker v-model="timesheet_filter.month" type="month"
                        :max="new Date().toISOString().substr(0, 10)" no-title @click:month="
                          $refs.menu.save(date),
                          formatmonthname(timesheet_filter.month)
                          " scrollable></v-date-picker>
                    </v-menu>
                  </template>
                  <span>{{ $t("month") }}</span>
                </v-tooltip>
              </v-col>
              <v-col md="2"> </v-col>
            </v-row>
          </v-flex>
          <v-flex md3>
            <v-row>
              <v-col md="2">
                <v-btn small :disabled="isBtnLoading" color="primary" class="mr-2" @click="downloadTimesheet">
                  {{ $t("download") }}
                  <b-spinner small v-if="isBtnLoading"></b-spinner>
                </v-btn>
                <div id="hiddentableexcel_format">
                  <table border="1" ref="exportable_table">
                    <thead>
                      <tr v-if="downloadoption == 'employee' ||
                        downloadoption == 'project'
                        ">
                        <th>Resource</th>
                        <td>
                          <span v-if="empName != null">{{ empName.firstname }}
                            {{ empName.lastname }}</span>
                        </td>
                        <th>Month</th>
                        <td>{{ timesheet_filter.month | formatMonth }}</td>
                      </tr>
                      <tr v-else>
                        <th>Month</th>
                        <td colspan="4">
                          {{ timesheet_filter.month | formatMonth }}
                        </td>
                      </tr>
                      <tr v-if="downloadoption == 'employee' ||
                        downloadoption == 'project'
                        ">
                        <th>Total No of working days</th>
                        <td>
                          {{ totalWorkdays }}
                        </td>
                        <th>No of days worked</th>
                        <td>{{ countworkdays }}</td>
                      </tr>
                      <tr v-else>
                        <th>Total No of working days</th>
                        <td colspan="4">
                          {{ totalWorkdays }}
                        </td>
                      </tr>
                      <tr>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                      </tr>
                      <tr>
                        <th>SL No</th>
                        <th>Task</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>No of Hours</th>
                        <th v-if="downloadoption == 'monthly'">Resource</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(tims, index) in empTimesheet" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ tims.task_name }}</td>
                        <td>{{ tims.task_desc }}</td>
                        <td>{{ tims.submitted_date | formatDate }}</td>
                        <td>{{ tims.no_of_hrs }}</td>
                        <th v-if="downloadoption == 'monthly'">
                          {{ tims.employee_details.full_name }}
                        </th>
                      </tr>
                    </tbody>
                  </table>
                  <input type="text" v-model="name" />
                  <button id="downloaddummybutton" @click="ExportExcel('xlsx')">
                    Export table to excel xlsx
                  </button>
                </div>
              </v-col>
            </v-row>
          </v-flex>
        </v-layout>
      </v-form>
    </v-sheet>

    <!-- <v-data-table :headers="headers" class="pt-8 elevation-1 mt-2" :items="timesheet_approval" :loading="initval"
      show-select :item-key="index" v-model="selectedall" hide-default-footer disable-pagination
      v-if="timesheet_filter.project">
      <template v-slot:item="{ item, index }">
        <tr v-if="index == 0 ||
          timesheet_approval[index - 1].employee_name != item.employee_name
          ">
          <td colspan="14" class="resourcestylename">
            <div class="row">
              <div class="text-center pl-3">
                <v-avatar size="34">
                  <img v-if="item.employee_details.profile_pic" :src="envImagePath + item.employee_details.profile_pic" />
                  <img v-else src="@/assets/images/default-user-profile-picture.png" />
                </v-avatar>
              </div>
              <div class="align-self-center pl-3">{{ item.employee_name }}</div>
            </div>
          </td>
        </tr>
        <tr v-bind:class="[item.comp_off_flag == 1 ? 'bg-warning' : '']">
          <td>
            <v-checkbox v-model="selectedunique" @click="checkboxSelectedUnique" :value="index"></v-checkbox>
          </td>
          <td v-if="item.submitted_date">
            {{ item.submitted_date | formatFullDate }}
          </td>
          <td v-else>{{ $t("not_appllicable") }}</td>
          <td v-if="item.project_details">
            {{ item.project_details.project_name }}
          </td>
          <td v-else>{{ $t("not_appllicable") }}</td>
         
          <td>
            <v-tooltip bottom v-if="item.task_desc" max-width="370" color="white">
              <template v-slot:activator="{ on }">
                <div class="description_hover_div" v-on="on">
                  {{ item.task_desc }}
                </div>
              </template>
              <v-sheet class="pa-4 b">{{ item.task_desc }}</v-sheet>
            </v-tooltip>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            {{ item.task_status }}
          </td>
          <td>
            {{ item.eta_given }}
          </td>
          <td>
            {{ item.no_of_hrs }}
          </td>
         
          <td>
            <v-autocomplete style="margin-top: 26px; width: 120px" dense
              v-model="timesheet_approval[index].timesheet_status" outlined :items="status_lookup" item-text="shortname"
              item-value="shortname" v-bind:label="$t('status')" @change="showconfirmChange(item.id,
                item.unique_id_compoff,
                timesheet_approval[index].timesheet_status,
                timesheet_approval[index].approver_comment,
                index)
                "></v-autocomplete>
          </td>
          <td>
            <v-textarea style="margin-top: 26px; width: 120px" dense rows="1" v-bind:label="$t('comment')" ref="comment"
              outlined v-model="timesheet_approval[index].approver_comment"
              :error="timesheet_approval[index].approvercommenterror" :error-messages="timesheet_approval[index].approvercommenterrormessage
                " @keydown="clearerrorcomment(index)"></v-textarea>
          </td>
          <td>
            <span v-if="item.comp_off_flag == 1">{{ $t("yes") }}</span>
          
          <td>
            <span v-if="item.adjust_comoff_leave">{{
              item.adjust_comoff_leave
            }}</span>
          
          </td>
         
        </tr>
      </template>
    </v-data-table>-->

    <v-tabs>
      <Tabs :tabs="tabs" :currentTab="currentTab" :wrapper-class="'shadow-tabs inline-tabs align-self-center'"
        style="display: inline-flex" :tab-class="'tab-item'" :tab-active-class="'tab-item-active'"
        :line-class="'tab-item-line'" @onClick="handleClick" />
    </v-tabs>
    <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />

    <v-card class="row mx-1 mt-5" v-if="timesheet_approval.length >= 1">
      <div class="col-lg-12 row justify-content-between align-items-center">
        <v-checkbox class="pl-2 w-25 col-lg-2" v-if="timesheet_approval.length >= 1" label="Select All"
          v-model="selectedall" :value="index"></v-checkbox>
        <div class="legendInlineclass d-flex mb-5 col-lg-6 col-md-6 justify-content-end" v-if="timesheet_filter.project">
          <span class="legendInnercolorRed">{{ $t("Orange") }}</span>
          <span class="legendInnercolorText">{{ $t("comp_off_applied") }}</span>
          <span class="legendInnercolorblue ml-3">{{ $t("blue") }}</span>
          <span class="legendInnercolorText">{{ $t("new") }}</span>
        </div>
      </div>
      <div class="col-md-12 col-lg-12 timesheet_item" v-bind:class="[
        item.comp_off_flag == 1
          ? 'iscompoff'
          : timesheet_approval[index].timesheet_status == null
            ? 'is_new'
            : '',
      ]" v-for="(item, index) in timesheet_approval" :key="index">
        <div v-if="index == 0 ||
          timesheet_approval[index - 1].employee_name != item.employee_name
          " class="d-flex">
          <v-avatar size="34">
            <img v-if="item.employee_details.profile_pic" :src="envImagePath + item.employee_details.profile_pic" />
            <img v-else src="@/assets/images/default-user-profile-picture.png" />
          </v-avatar>
          <div class="align-self-center pl-3">{{ item.employee_name }}</div>
        </div>
        <div class="row align-items-center">
          <v-checkbox class="col-md-1 col-lg-1 check_box" v-model="selectedunique" @click="checkboxSelectedUnique"
            :value="index"></v-checkbox>
          <div class="row col-md-11 col-lg-1 col-lg-11 px-2 py-0 w-100 align-items-center my-4">
            <div class="col-md-2 py-0 col-lg-2">
              <strong>{{ $t("date") }}:</strong>
              <span v-if="item.submitted_date">
                {{ item.submitted_date | formatFullDate }}</span>
              <span v-else>{{ $t("not_appllicable") }}</span>
            </div>
            <div class="col-md-2 py-0 col-lg-2 text-nowrap">
              <strong class="text-nowrap">{{ $t("project") }}:</strong>
              <span class="text-nowrap" v-if="item.project_details">
                {{ item.project_details.project_name }}</span>
              <span v-else>{{ $t("not_appllicable") }}</span>
            </div>

            <div class="col-md-2 col-lg-2">
              <strong>{{ $t("eta_given") }}:</strong>
              {{ item.eta_given }}
            </div>

            <div class="col-md-2 py-0 col-lg-2">
              <strong>{{ $t("todays_effort") }}:</strong>
              {{ item.no_of_hrs }}
            </div>
            <div v-if="item.comp_off_flag != 1" class="col-md-2 py-0 col-lg-2">
              <strong> {{ $t("comp_off") }}:</strong>

              <span v-if="item.comp_off_flag == 1">{{ $t("yes") }}</span>
              <span v-else> {{ $t("no") }}</span>
            </div>
            <div v-if="item.adjust_comoff_leave" class="col-md-2 py-0 col-lg-2">
              <strong>{{ $t("comp_type") }}:</strong>
              <span v-if="item.adjust_comoff_leave">{{
                item.adjust_comoff_leave
              }}</span>
              <span v-else> {{ $t("not_appllicable") }}</span>
            </div>
            <div class="col-md-2 py-0 col-lg-2">
              <strong>{{ $t("status") }}:</strong>
              <span> {{ item.task_status }}</span>
            </div>

            <div class="col-md-4 col-lg-4 py-0 d-flex">
              <v-textarea style="margin-top: 26px" readonly dense rows="1" v-bind:label="$t('description')" outlined
                v-model="item.task_desc"></v-textarea>

              <!-- <span v-else>
      {{ $t("not_appllicable") }}
              </span>-->
            </div>

            <div class="col-md-2 py-0 col-lg-2">
              <v-autocomplete ref="status" style="margin-top: 26px" dense
                v-model="timesheet_approval[index].timesheet_status" outlined :items="status_lookup" item-text="shortname"
                item-value="shortname" v-bind:label="$t('status')" @change="
                  showconfirmChange(
                    item.id,
                    item.unique_id_compoff,
                    timesheet_approval[index].timesheet_status,
                    timesheet_approval[index].approver_comment,
                    index
                  )
                  "></v-autocomplete>
            </div>
            <div class="col-md-4 py-0 col-lg-4">
              <v-responsive max-width="250">
                <v-textarea style="margin-top: 26px" dense rows="1" v-bind:label="$t('comment')" ref="comment" outlined
                  v-model="timesheet_approval[index].approver_comment"
                  :error="timesheet_approval[index].approvercommenterror" :error-messages="timesheet_approval[index].approvercommenterrormessage
                    " @keydown="clearerrorcomment(index)"></v-textarea>
              </v-responsive>
            </div>
            <div class="col-md-2 py-0 col-lg-2">
              <span v-if="timesheet_approval[index].timesheet_status == 'Approved'">
                <b-icon icon="check-circle" variant="success" scale="2">
                </b-icon>
                <span class="ml-2 text-success h6">Approved</span>
              </span>
              <span v-if="timesheet_approval[index].timesheet_status == 'Rejected'">
                <b-icon icon="x-circle" variant="danger" scale="2"> </b-icon>
                <span class="ml-2 text-danger h6">Rejected</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="my-3 col-lg-12 py-0 text-end" v-if="timesheet_approval.length >= 1">
        <v-btn small color="success" class="mr-2" :disabled="selectedunique.length == 0 || isBtnLoading"
          @click="groupstatuschange('Approved')">
          {{ $t("approve") }}
          <b-spinner small v-if="isBtnLoading && group_status_name == 'Approved'"></b-spinner>
        </v-btn>
        <v-btn small color="error" class="mr-8" :disabled="selectedunique.length == 0 || isBtnLoading"
          @click="groupstatuschange('Rejected')">
          {{ $t("reject") }}
          <b-spinner small v-if="isBtnLoading && group_status_name == 'Rejected'"></b-spinner>
        </v-btn>
      </div>
    </v-card>
    <div class="text-center mt-5" v-else>
      <v-icon size="50px">mdi mdi-alert-circle-outline</v-icon>
      <p>{{ $t("no_details_found") }}</p>
    </div>

    <v-dialog v-model="timesheetdialog" fullscreen transition="dialog-bottom-transition" width="1200" persistent>
      <v-toolbar color="primary" dark>
        <span class="headline">{{
          $t("approve/reject_timesheet_status")
        }}</span>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon @click="timesheetdialog = false" class="dialogcloseinuserdetails" v-on="on">mdi-close</v-icon>
          </template>
          <span>{{ $t("close") }}</span>
        </v-tooltip>
      </v-toolbar>
      <v-card class="pa-5">
        <div class="row">
          <div class="col-md-3">
            <div class="d-flex pt-2">
              <p class="paragraph_timesheet heading-min-width">
                {{ $t("resource") }}
              </p>
              <p class="paragraph_timesheet_text">
                :{{ gettimesheet.emp_name }}
              </p>
            </div>
            <div class="d-flex">
              <p class="paragraph_timesheet heading-min-width">
                {{ $t("eta_given") }}
              </p>
              <p class="paragraph_timesheet_text">
                :{{ gettimesheet.total_eta_given }} {{ $t("hour") }}
              </p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="d-flex pt-2">
              <p class="paragraph_timesheet heading-min-width">
                {{ $t("project") }}
              </p>
              <p class="paragraph_timesheet_text">
                :{{ gettimesheet.project_name }}
              </p>
            </div>
            <div class="d-flex">
              <p class="paragraph_timesheet heading-min-width">
                {{ $t("eta_taken") }}
              </p>
              <p class="paragraph_timesheet_text">
                :{{ gettimesheet.total_working_hour }} {{ $t("hour") }}
              </p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="d-flex pt-2">
              <p class="paragraph_timesheet heading-min-width">
                {{ $t("date") }}
              </p>
              <p class="paragraph_timesheet_text" v-if="gettimesheet.all_details[0]">
                :{{
                  gettimesheet.all_details[0].submitted_date | formatFullDate
                }}
              </p>
            </div>
            <div class="d-flex">
              <p class="paragraph_timesheet heading-min-width">
                {{ $t("status") }}
              </p>
              <p class="paragraph_timesheet_text" v-if="gettimesheet.all_details[0]">
                <span v-if="gettimesheet.all_details[0].timesheet_status">:{{ gettimesheet.all_details[0].timesheet_status
                }}</span>
                <span v-else>:{{ $t("Pending") }}</span>
              </p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="d-flex pt-2">
              <p class="paragraph_timesheet heading-min-width">
                {{ $t("day") }}
              </p>
              <p class="paragraph_timesheet_text" v-if="gettimesheet.all_details[0]">
                :{{ dayType }}
              </p>
            </div>
            <div class="d-flex">
              <p class="paragraph_timesheet heading-min-width">
                {{ $t("adjust_compoff_leave") }}
              </p>
              <p class="paragraph_timesheet_text" v-if="gettimesheet.all_details[0]">
                <span v-if="gettimesheet.all_details[0].adjust_comoff_leave">:{{
                  gettimesheet.all_details[0].adjust_comoff_leave }}</span>
                <span v-else>:{{ $t("not_appllicable") }}</span>
              </p>
            </div>
          </div>
        </div>
        <div class>
          <hr />
          <div class v-for="(task, i) in gettimesheet.all_details" :key="i">
            <v-layout wrap>
              <v-flex md4 pr-4 pl-4>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field v-on="on" readonly v-model="task.task_name" dense outlined
                      :label="$t('activity')"></v-text-field>
                  </template>
                  <span>{{ $t("activity") }}</span>
                </v-tooltip>
              </v-flex>

              <v-flex md4>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field v-on="on" dense outlined :label="$t('activity_status')" readonly
                      v-model="task.task_status"></v-text-field>
                  </template>
                  <span>{{ $t("activity_status") }}</span>
                </v-tooltip>
              </v-flex>
            </v-layout>

            <v-layout wrap class="pl-16 pt-3">
              <v-flex pr-4 md4>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field v-on="on" dense outlined :label="$t('eta_given')" readonly
                      v-model="task.eta_given"></v-text-field>
                  </template>
                  <span>{{ $t("eta_given") }}</span>
                </v-tooltip>
              </v-flex>
              <v-flex md4>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field v-on="on" dense outlined :label="$t('todays_effort')" v-model="task.no_of_hrs"
                      readonly></v-text-field>
                  </template>
                  <span>{{ $t("todays_effort") }}</span>
                </v-tooltip>
              </v-flex>
            </v-layout>

            <!-- <div class="col-md-4 pr-14">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-textarea
                    rows="4"
                    v-on="on"
                    dense
                    outlined
                    counter="1000"
                    maxlength="1000"
                    :disabled="activity_data.status_update == true"
                    v-model="activity_data.task_desc"
                    :label="$t('activity_description')"
                    :rules="fieldRules"
                    class="required_field"
                  ></v-textarea>
                </template>
                <span>{{ $t("activity_description") }}</span>
              </v-tooltip>
            </div>-->
          </div>
        </div>
      </v-card>
    </v-dialog>
    <ConfirmDialog :show="showStatusDialog" :cancel="cancelStatus" :confirm="confirmStatus" v-bind:title="$t('confirm')"
      :description="description_text_message" />
    <ConfirmDialog :show="showStatuschange" :cancel="cancelchange" :confirm="confirmChange" v-bind:title="$t('confirm')"
      :description="description_change_message" />
  </div>
</template>
  
  
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import moment from "moment";
import Tabs from "vue-tabs-with-active-line";
import VueElementLoading from "vue-element-loading";
const TABS = [
  {
    title: "All",
    value: "all",
  },
  {
    title: "Approved",
    value: "approved",
  },
  {
    title: "Awaiting Approval",
    value: "awaiting_approval",
  },
  {
    title: "Rejected",
    value: "rejected",
  },
];
import VueExcelXlsx from "vue-excel-xlsx";
import Vue from "vue";
import ExcelJS from "exceljs";

Vue.use(VueExcelXlsx);
export default {
  components: {
    PageTitle,
    ConfirmDialog,
    moment,
    Tabs,
    VueElementLoading,
  },
  data: () => ({
    name: "",
    is_proj_active: true,
    loader: false,
    tabs: TABS,
    currentTab: "all",
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    google_icon: {
      icon_name: "fact_check",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu: false,
    valid: true,
    showStatusDialog: false,
    showStatuschange: false,
    group_status_name: "",
    initval: false,
    dayType: "",
    index: "",
    convertedmonth: "",
    description_change_message: "",
    approvercommenterrormessage: "",
    approvercommenterror: false,
    description_text_message: "",
    timesheet_filter: {
      month: "",
      project: "",
      resource: "",
    },
    allow_watch: true,
    isBtnLoading: false,
    valid: true,
    manager_project: [],
    project_resources: [],
    rejectIndex: [],
    timesheet_approval: [],
    RejectIndexcomment: false,
    selectedall: [],
    selectedunique: [],
    user: [],
    user_id: "",
    status_lookup: [],
    dialogComment: "",
    project_inactive: [],
    countworkdays: null,
    totalWorkdays: null,
    empName: "",
    empTimesheet: [],
    gettimesheet: {
      all_details: [],
      emp_name: "",
      project_name: "",
      total_eta_taken: 0,
      total_working_hour: 0,
      total_eta_given: 0,
      unique_id: "",
    },
    monthSelected: "",
    change_id: "",
    downloadoption: "",
    change_unique_id: "",
    change_status: "",
    change_comment: "",
    change_index: "",
    dialogcommenterrormessage: "",
    dialogcommenterror: false,
    timesheetdialog: false,
    approved_timesheet: [],
    rejected_timesheet: [],
    awaiting_timesheet: [],
    headers: [
      {
        text: "Date",
        align: "left",
        value: "submitted_date",
      },
      {
        text: "Project Name",
        value: "project_details.project_name",
        align: "left",
      },
      //   {
      //     text: "Activity Name",
      //     value: "activity_name",
      //     align: "left",
      //   },
      {
        text: "Activity Description",
        value: "task_desc",
        align: "left",
        sortable: false,
      },
      {
        text: "Activity status",
        value: "task_status",
        align: "left",
      },
      {
        text: "ETA Given",
        value: "eta_taken",
        align: "left",
      },
      {
        text: "Today's Effort",
        value: "no_of_hrs",
        align: "left",
      },
      //   {
      //     text: "ETA Taken",
      //     value: "eta_taken",
      //     align: "left",
      //   },
      //   {
      //     text: "Emp Comment",
      //     value: "emp_comment",
      //     align: "left",
      //   },
      {
        text: "Status",
        value: "",
        align: "left",
      },
      {
        text: "Approver Comment",
        value: "approver_comment",
        align: "left",
      },
      {
        text: "Comp Off?",
        value: "",
        align: "left",
      },
      {
        text: "Comp Type",
        value: "",
        align: "left",
      },
      //   {
      //     text: "Action",
      //     value: "",
      //     align: "left",
      //   },
    ],
    sel_project_title: "",
  }),
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    const recaptchaScript = document.createElement("script");
    recaptchaScript.setAttribute(
      "src",
      "https://unpkg.com/xlsx@0.15.1/dist/xlsx.full.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.min.js"
    );
    document.head.appendChild(recaptchaScript);
    this.user_id = this.user.emp_id;
    this.fetchlookup();
    this.selectedunique = [];
    this.selectedall = [];
    // this.$nextTick(() => {
    //   this.$refs.myIcon.$el.setAttribute('animation', 'none');
    // });
  },
  created() {
    let objectDate = new Date();
    this.timesheet_filter.month =
      objectDate.getFullYear() + "-" + (objectDate.getMonth() + 1);
    this.convertedmonth = moment(String(this.timesheet_filter.month)).format(
      "MMMM YYYY"
    );
  },
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },
  watch: {
    user_id: {
      immediate: true,
      handler() {
        if (this.user_id >= 1) {
          this.fetchallproject();
        }
      },
    },
    "$route.query.id": {
      immediate: true,
      handler() {
        if (this.$route.query.id >= 1) {
          this.timesheet_filter.project = this.$route.query.id;
          this.projectselected(this.$route.query.id);
        }
      },
    },

    selectedall: {
      immediate: true,
      handler() {
        if (this.selectedall.length >= 1) {
          this.selectedunique = [];
          for (var j = 0; j < this.timesheet_approval.length; j++) {
            this.selectedunique.push(j);
          }
        }
        if (this.selectedall.length == 0) {
          if (this.allow_watch) {
            this.selectedunique = [];
          }
        }
      },
    },
    selectedunique: {
      immediate: true,
      handler() {
        if (this.selectedall.length >= 1 && this.selectedunique.length == 0) {
          this.selectedall = [];
          this.allow_watch = true;
        }
        if (
          this.selectedunique.length == this.timesheet_approval.length &&
          this.selectedall.length == 0
        ) {
          this.selectedall = this.timesheet_approval;
          this.allow_watch = true;
        }
      },
    },
  },
  methods: {
    // clickDownload() {
    //   document.getElementById("downloaddummybutton").click();
    // },

    async ExportExcel(type, fn, dl) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Timesheet");
      const table = this.$refs.exportable_table;
      const cellStyle = {
        font: { bold: true, color: { argb: "FFFFFF" } },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "6c6cff" },
        },
        border: {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        },
      };
      // const fontBold = {
      //   font: { bold: true },
      //   fill: {
      //     type: "pattern",
      //     pattern: "solid",
      //     fgColor: { argb: "e5e8ee" },
      //   },
      // };
      const cellAlignment = { horizontal: "center", vertical: "middle" };
      worksheet.mergeCells("A1:E1");

      // Apply cell styling to the merged cell
      const mergedCell = worksheet.getCell("A1");
      mergedCell.style = cellStyle;
      mergedCell.alignment = cellAlignment;

      // Set content for the merged cell
      mergedCell.value = "Timesheet - " + this.sel_project_title;

      for (let i = 0; i < table.rows.length; i++) {
        const row = worksheet.addRow([]);
        for (let j = 0; j < table.rows[i].cells.length; j++) {
          const cell = table.rows[i].cells[j];
          const cellValue = cell.innerText;
          const excelCell = row.getCell(j + 1);

          // Apply cell styling
          excelCell.value = cellValue;

          if (
            excelCell._address == "A2" ||
            excelCell._address == "A3" ||
            excelCell._address == "A5" ||
            excelCell._address == "C2" ||
            excelCell._address == "C3" ||
            excelCell._address == "B5" ||
            excelCell._address == "C5" ||
            excelCell._address == "D5" ||
            excelCell._address == "E5"
          ) {
            excelCell.style = cellStyle;
          }
          // if (excelCell == 'Total Days' ||
          //   cellValue == "Total hours") {
          //     excelCell.style = fontBold;
          // }

          // Calculate and set the column width based on the content length
          const cellContentLength = cellValue.length;
          const column = worksheet.getColumn(j + 1);
          const currentColumnWidth = column.width || 10;
          const newColumnWidth = Math.max(
            currentColumnWidth,
            cellContentLength + 2
          );
          column.width = newColumnWidth;
        }
      }
      let filename = this.empName.Full_Code + " " + this.sel_project_title;

      // Generate the Excel file
      if (dl) {
        const buffer = workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        let stringWithUnderscores = filename.replace(/\s+/g, "_");
        a.download = stringWithUnderscores + ".xlsx";
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        workbook.xlsx.writeBuffer().then((buffer) => {
          const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          let stringWithUnderscores = filename.replace(/\s+/g, "_");
          a.download = stringWithUnderscores + ".xlsx";
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(url);
          document.body.removeChild(a);
        });
      }
    },
    downloadTimesheet() {
      if (this.$refs.form.validate()) {
        this.isBtnLoading = true;
        this.totalWorkdays = "";
        this.countworkdays = "";
        axios
          .post(process.env.VUE_APP_API_URL_ADMIN + "downloadtimesheet", {
            selectedOption: "project_monthly",
            projectResourse: this.timesheet_filter.resource,
            projectSelected: this.timesheet_filter.project,
            monthSelected: this.timesheet_filter.month,
            orgSelected: 1,
          })
          // projectSelected: this.timesheet_filter.project,
          // projectResourse: this.timesheet_filter.resource,
          .then((res) => {
            if (res.data.status == "S") {
              this.empTimesheet = res.data.empTimesheet;
              this.empName = res.data.empname;
              this.totalWorkdays = res.data.totalWorkdays;
              this.countworkdays = res.data.countworkdays;
              if (this.timesheet_filter.resource == 0) {
                this.downloadoption = "monthly";
              } else {
                this.downloadoption = "project";
              }
             
              setTimeout(() => {
                this.ExportExcel("xlsx");
                this.isBtnLoading = false;
              }, 1000);

            } else if (res.data.status == "ERR") {
              this.isBtnLoading = false;

              this.flashMessage.error({
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
              this.isBtnLoading = false;
            }
          })

          .catch((err) => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            console.log("this error" + err);
            this.isBtnLoading = false;
          });
      }
    },
    handleClick(newTab) {
      this.currentTab = newTab;
      this.fetchalltimesheets();
    },
    checkboxSelectedUnique() {
      if (
        this.selectedunique.length != this.timesheet_approval.length &&
        this.selectedall.length >= 1
      ) {
        this.selectedall = [];
        this.allow_watch = false;
      } else {
        this.allow_watch = true;
      }
    },
    formatmonthname(date) {
      this.convertedmonth = moment(String(date)).format("MMMM YYYY");
      this.fetchalltimesheets();
    },

    fetchallproject() {
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
          "fetchmanagersprojects/" +
          this.user_id
        )
        .then((response) => {
          if (response.data.status == "S") {
            this.manager_project = response.data.projects;
            this.project_inactive = response.data.project_inactive;
          }
        })
        .catch(() => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
        });
    },
    projectselected(project_id) {
      this.timesheet_filter.resource = "";
      if (project_id) {
        if (this.is_proj_active == true) {
          this.manager_project.forEach((project) => {
            if (project.id == project_id) {
              this.sel_project_title = project.project_name;
            }
          });
        } else {
          this.project_inactive.forEach((project) => {
            if (project.id == project_id) {
              this.sel_project_title = project.project_name;
            }
          });
        }
      }
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
          "fetchallresourcesfromprojectid/" +
          project_id
        )
        .then((response) => {
          if (response.data.status == "S") {
            this.project_resources = response.data.resources;
            if (this.project_resources.length >= 1) {
              this.project_resources.unshift({
                id: 0,
                emp_id: 0,
                hr_emp_id: {
                  Full_Code: "All resources",
                },
              });
              this.timesheet_filter.resource = 0;
            }
            // setTimeout(() => {
            this.fetchalltimesheets();
            // }, 50);
          }
        })
        .catch(() => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
        });
    },

    groupstatuschange(status) {
      this.RejectIndexcomment = false;
      this.group_status_name = status;
      this.showStatusDialog = false;
      this.rejectIndex = [];
      for (var comment = 0; comment < this.selectedunique.length; comment++) {
        if (
          (this.timesheet_approval[this.selectedunique[comment]]
            .approver_comment == null ||
            this.timesheet_approval[this.selectedunique[comment]]
              .approver_comment == "") &&
          this.group_status_name == "Rejected"
        ) {
          this.RejectIndexcomment = true;
          this.rejectIndex.push(this.selectedunique[comment]);
        }
      }
      if (!this.RejectIndexcomment) {
        if (status == "Approved") {
          this.description_text_message = this.$t("approve_time_sheet");
        } else {
          this.description_text_message = this.$t("reject_time_sheet");
        }
        // this.description_text_message = this.$t('status_change');
        this.showStatusDialog = true;
        // reject_time_sheet;
      } else {
        for (var j = 0; j < this.rejectIndex.length; j++) {
          this.$refs["comment"][this.rejectIndex[j]].$props.error = true;
          this.$refs["comment"][this.rejectIndex[j]].$props.errorMessages =
            this.$t("field_required");
          this.timesheet_approval[
            this.rejectIndex[j]
          ].approvercommenterror = true;
          this.timesheet_approval[
            this.rejectIndex[j]
          ].approvercommenterrormessage = this.$t("field_required");
        }
      }
    },

    cancelStatus() {
      this.showStatusDialog = false;
    },

    confirmStatus() {
      this.showStatusDialog = false;
      this.statusUpdateGroup();
    },
    statusUpdateGroup() {
      var statusUniqueIds = [];
      for (var unique = 0; unique < this.selectedunique.length; unique++) {
        statusUniqueIds.push({
          id: this.timesheet_approval[this.selectedunique[unique]].id,
          unique_id:
            this.timesheet_approval[this.selectedunique[unique]]
              .unique_id_compoff,
          comment:
            this.timesheet_approval[this.selectedunique[unique]]
              .approver_comment,
        });
      }
      this.isBtnLoading = true;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "groupstatuschangetimesheet",
          {
            status: this.group_status_name,
            unique_ids: statusUniqueIds,
          }
        )
        .then((response) => {
          if (response.data.status == "S") {
            this.initval = false;
            this.isBtnLoading = false;
            this.flashMessage.success({
              message: response.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.selectedall = [];
            this.selectedunique = [];
            this.fetchalltimesheets();
          }
        })
        .catch(() => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          this.initval = false;
          this.isBtnLoading = false;
        });
    },
    fetchalltimesheets() {
      this.loader = true;
      if (this.$refs.form.validate()) {
        this.selectedall = [];
        this.selectedunique = [];
        this.initval = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "fetchalltimesheetsforapproval",
            this.timesheet_filter
          )
          .then((response) => {
            if (response.data.status == "S") {
              //based on status fetch

              if (this.currentTab == "approved") {
                this.timesheet_approval = response.data.data.filter((ele) => {
                  return ele.timesheet_status == "Approved";
                });
                this.loader = false;
              } else if (this.currentTab == "rejected") {
                this.timesheet_approval = response.data.data.filter((ele) => {
                  return ele.timesheet_status == "Rejected";
                });
                this.loader = false;
              } else if (this.currentTab == "awaiting_approval") {
                this.timesheet_approval = response.data.data.filter((ele) => {
                  return ele.timesheet_status == null;
                });
                this.loader = false;
              } else {
                this.timesheet_approval = response.data.data;
                this.loader = false;
              }

              this.initval = false;
            } else {
              this.loader = false;
            }
          })
          .catch(() => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.loader = false;
            this.initval = false;
          });
      } else {
        this.loader = false;
      }
    },
    fetchlookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "TIMESHEET_APPROVAL_STATUS",
          },
        })
        .then((response) => {
          this.status_lookup = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    timesheetdialogopen(unique_id, emp_name, project_name, cmt) {
      this.dialogComment = cmt;
      this.gettimesheet.all_details = [];
      this.gettimesheet.total_eta_given = 0;
      this.gettimesheet.total_working_hour = 0;
      this.gettimesheet.total_eta_taken = 0;
      this.gettimesheet.emp_name = emp_name;
      this.gettimesheet.project_name = project_name;
      this.gettimesheet.unique_id = unique_id;
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
          "gettimesheetwithuniquecompoffid/" +
          unique_id
        )
        .then((response) => {
          if (response.data.status == "S") {
            this.gettimesheet.all_details = response.data.gettimesheet;
            for (var i = 0; i < response.data.gettimesheet.length; i++) {
              this.gettimesheet.total_eta_given =
                this.gettimesheet.total_eta_given +
                response.data.gettimesheet[i].eta_given;
              this.gettimesheet.total_working_hour =
                this.gettimesheet.total_working_hour +
                response.data.gettimesheet[i].no_of_hrs;
              this.gettimesheet.total_eta_taken =
                this.gettimesheet.total_eta_taken +
                response.data.gettimesheet[i].eta_taken;
              if (this.gettimesheet.total_eta_taken >= 8) {
                this.dayType = "Full Day";
              } else {
                this.dayType = "Half Day";
              }
            }
            this.initval = false;
            this.timesheetdialog = true;
          }
        })
        .catch(() => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          this.initval = false;
        });
    },

    cancelchange() {
      this.timesheet_approval[this.change_index].timesheet_status = null;
      this.change_id = "";
      this.change_unique_id = "";
      this.change_status = "";
      this.change_comment = "";
      this.change_index = "";
      this.description_change_message = "";
      this.showStatuschange = false;
    },

    showconfirmChange(id, unique_id, status, comment, index) {
      for (var i = 0; i < this.timesheet_approval.length; i++) {
        (this.timesheet_approval[i].approvercommenterrormessage = ""),
          (this.timesheet_approval[i].approvercommenterror = false);
      }
      if (status == "Rejected" && (comment == null || comment == "")) {
        this.$refs["status"][index].value = null;
        this.$refs["comment"][index].focus();
        this.timesheet_approval[index].approvercommenterror = true;

        this.timesheet_approval[index].approvercommenterrormessage =
          this.$t("field_required");
        this.timesheet_approval[index].timesheet_status = null;
      } else {
        this.change_id = id;
        this.change_unique_id = unique_id;
        this.change_status = status;
        this.change_comment = comment;
        this.change_index = index;
        if (status == "Rejected") {
          var statusname = "Reject";
        }
        if (status == "Approved") {
          var statusname = "Approve";
        }
        this.description_change_message =
          "Want to " + statusname + " the Activity?";
        this.showStatuschange = true;
      }
    },

    confirmChange() {
      this.showStatuschange = false;
      this.timesheetstatusupdate(
        this.change_id,
        this.change_unique_id,
        this.change_status,
        this.change_comment
      );
    },
    timesheetstatusupdate(id, unique_id, status, comment) {
      this.initval = true;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "timesheetactivitystatusupdate",
          {
            id: id,
            unique_id: unique_id,
            status: status,
            comment: comment,
          }
        )
        .then((response) => {
          if (response.data.status == "S") {
            this.flashMessage.success({
              message: response.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.initval = false;
            this.change_id = "";
            this.change_unique_id = "";
            this.change_status = "";
            this.change_comment = "";
            this.change_index = "";
          }
          this.fetchalltimesheets();
        })
        .catch(() => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          this.initval = false;
        });
    },
    clearerrorcomment(index) {
      this.timesheet_approval[index].approvercommenterrormessage = "";
      this.timesheet_approval[index].approvercommenterror = false;
    },
    dialogapprovestatus(unique_id, status, comment) {
      this.dialogcommenterror = false;
      this.dialogcommenterrormessage = "";
      if (status == "Rejected" && comment == null) {
        this.dialogcommenterror = true;
        this.dialogcommenterrormessage = this.$t("field_required");
      } else {
        this.timesheetdialog = false;
        this.initval = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "timesheetactivitystatusupdate",
            {
              unique_id: unique_id,
              status: status,
              comment: comment,
            }
          )
          .then((response) => {
            if (response.data.status == "S") {
              this.flashMessage.success({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.initval = false;
              this.fetchalltimesheets();
            }
          })
          .catch(() => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.initval = false;
          });
      }
    },
  },
};
</script>
<style scoped>
.timesheetactivitiestd {
  max-width: 110px;
  overflow-wrap: break-word;
  max-height: 112px;
  overflow: auto;
}

.resourcestylename {
  font-size: 15px;
  color: #272525;
  font-weight: 500;
}

.etatakenindialogbox {
  position: absolute;
  bottom: 9px;
  right: 3px;
  font-size: 12px;
  font-weight: 500;
}

.activitydescriptionlayout {
  max-height: 250px;
  border: solid #d2c9c9 1px;
  overflow: auto;
  padding: 14px 15px;
}

.heading-min-width {
  min-width: 75px;
}

.legendInnercolorRed {
  font-size: 11px;
  font-weight: 700;
  color: white;
  text-align: center;
  background-color: #f7b924;
  display: inline-block;
  min-width: 65px;
  min-height: 18px;
}

.legendInnercolorblue {
  font-size: 11px;
  font-weight: 700;
  color: white;
  text-align: center;
  background-color: #246ef7;
  display: inline-block;
  min-width: 65px;
  min-height: 18px;
}

.legendInnercolorText {
  margin-left: 10px;
}

.legendInlineclass {
  margin-right: 30px;
  max-height: 10px;
}

.timesheet_item {
  border-bottom: 1px solid rgba(128, 128, 128, 0.493);
}

.main-20 /deep/ .v-label {
  margin: 0px !important;
}

.check_box {
  max-width: fit-content;
}

.iscompoff {
  border-left: 5px solid #f7b924;
  border-radius: 5px 5px 0px 5px;
}

.is_new {
  border-left: 5px solid #246ef7;
  border-radius: 5px 5px 0px 5px;
}

#hiddentableexcel_format {
  display: none;
}

#downloaddummybutton {
  display: none;
}
</style> 