<template>
  <div class="main-20">
    <!-- <div v-if="!thisuserisHR"> -->
    <div>
      <VueElementLoading
        :active="loader"
        spinner="bar-fade-scale"
        color="var(--primary)"
      />
      <v-sheet class="timesheetvsheettop">
        <v-form v-model="valid" ref="form">
          <div
            class="timesheetprojectborder pl-3 row align-items-baseline pr-2"
          >
            <page-title
              class="col-md-3"
              :heading="$t('timesheet')"
              :google_icon="google_icon"
            ></page-title>
            <div class="col-md-3">
              <v-autocomplete
                :rules="fieldRules"
                outlined
                dense
                label="Project"
                no-data-text="No project available"
                :items="assignedProjects"
                item-value="slug"
                item-text="project_name"
                @change="fetch_specific_projects_workedOn"
                v-model="project_selected"
              >
              </v-autocomplete>
            </div>
            <div class="col-md-2">
              <DatePicker
                :rules="fieldRules"
                :label="$t('start_date')"
                :stored_date="empDownloadtimesheet.start_date"
                :max="new Date().toISOString().substr(0, 10)"
                @formatted_date="formattedStartDate"
              />
            </div>
            <div class="col-md-2">
              <DatePicker
                :rules="fieldRules"
                :label="$t('end_date')"
                :stored_date="empDownloadtimesheet.end_date"
                :max="end_date_download_limit"
                :min="empDownloadtimesheet.start_date"
                @formatted_date="formattedEndDate"
              />
            </div>
            <div class="col-md-2">
              <v-btn
                color="btn mr-2 hover_shine add_new"
                small
                :disabled="isBtnLoading"
                class="ml-auto"
                @click="employeetimesheetdownload"
              >
                {{ $t("download") }}
                <b-spinner small v-if="isBtnLoading"></b-spinner>
              </v-btn>
            </div>
          </div>
        </v-form>
      </v-sheet>
      <v-row class="fill-height">
        <v-col>
          <v-sheet height="64">
            <v-toolbar flat>
              <v-btn
                small
                color="btn mr-2 mb-2 hover_shine add_new"
                @click="prev"
              >
                <v-icon small> mdi-chevron-left </v-icon>
                {{ $t("previous") }}
              </v-btn>

              <v-spacer></v-spacer>
              <v-toolbar-title v-if="$refs.calendar" class="calender_title">
                {{ $refs.calendar.title }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                small
                color="btn mr-2 mb-2 hover_shine add_new"
                @click="next"
              >
                {{ $t("next") }}
                <v-icon small> mdi-chevron-right </v-icon>
              </v-btn>
            </v-toolbar>
          </v-sheet>
          <v-sheet height="600">
            <v-calendar
              ref="calendar"
              v-model="focus"
              color="primary"
              :events="events"
              type="month"
            >
              <template #day-label="{ date }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-chip
                      class="rounded-pill mb-2"
                      outlined
                      plain
                      small
                      :disabled="isHoliday(date)"
                      v-on="on"
                      @click="TimeAvailabiltycheckByDate(date)"
                      :color="isweekOff(date)"
                    >
                      {{ date | formatWithDate }}
                    </v-chip>
                  </template>
                  <span>{{ $t("add_activity") }}</span>
                </v-tooltip>
              </template>
              <template #event="{ nativeEvent, event }">
                <div class="pl-1" @click="showEvent({ nativeEvent, event })">
                  {{ event.name }}
                </div>
              </template>
            </v-calendar>
          </v-sheet>
        </v-col>
      </v-row>
      <v-sheet class="mt-1 p-3 mb-1">
        <fieldset>
          <legend></legend>
          <div class="row">
            <div class="col-md-4 legendouterclass">
              <div class="legendInlineclass">
                <div class="legendInnercolorRed">{{ $t("red") }}</div>
                <div class="legendInnercolorText">
                  {{ $t("rejected_by_manager") }}
                </div>
              </div>
            </div>
            <div class="col-md-4 legendouterclass">
              <div class="legendInlineclass">
                <div class="legendInnercolorGreen">{{ $t("green") }}</div>
                <div class="legendInnercolorText">
                  {{ $t("approved_by_manager") }}
                </div>
              </div>
            </div>
            <div class="col-md-4 legendouterclass">
              <div class="legendInlineclass">
                <div class="legendInnercolorYellow">{{ $t("yellow") }}</div>
                <div class="legendInnercolorText">
                  {{ $t("not_yet_submitted_by_you") }}
                </div>
              </div>
            </div>
            <div class="col-md-4 legendouterclass">
              <div class="legendInlineclass">
                <div class="legendInnercolorBlue">{{ $t("blue") }}</div>
                <div class="legendInnercolorText">
                  {{ $t("not_yet_seen_by_manager") }}
                </div>
              </div>
            </div>
            <div class="col-md-4 legendouterclass">
              <div class="legendInlineclass">
                <div class="legendInnerlightRed">{{ $t("pink") }}</div>
                <div class="legendInnercolorText">{{ $t("holidays") }}</div>
              </div>
            </div>
            <div class="col-md-4 legendouterclass">
              <div class="legendInlineclass">
                <div class="legendInnerOrange">{{ $t("orange") }}</div>
                <div class="legendInnercolorText">{{ $t("on_leave") }}</div>
              </div>
            </div>
          </div>
        </fieldset>
      </v-sheet>
      <div id="hiddentableexcel_format">
        <table border="1" ref="exportable_table" id="timesheet_table">
          <thead>
            <tr>
              <th>Resource</th>
              <td colspan="3">
                {{ employeedetails.full_details }}
              </td>
            </tr>
            <tr>
              <th>Month</th>
              <td>{{ monthselected }}</td>
              <th>Total Days</th>
              <td>{{ totalDays }}</td>
            </tr>
            <tr>
              <td colspan="4">&nbsp;</td>
            </tr>
            <tr>
              <th>SL No</th>
              <th>Task</th>
              <th>Date</th>
              <th>No of Hours</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, index) in timesheetdownloaddatas" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ data.task_desc }}</td>
              <td>{{ data.submitted_date | formatDate }}</td>
              <td>{{ data.no_of_hrs }}</td>
            </tr>
            <tr>
              <td colspan="2">&nbsp;</td>
              <td colspan="2">&nbsp;</td>
              <td>Total hours</td>
              <td>{{ totalHours }}</td>
            </tr>
          </tbody>
        </table>
        <input type="text" v-model="name" />
        <button id="downloaddummybutton" @click="ExportExcel('xlsx')">
          Export table to excel xlsx
        </button>
      </div>
      <ConfirmDialog
        :show="showConfirmDialog"
        :cancel="cancel"
        :confirm="confirm"
        v-bind:title="$t('confirm')"
        v-bind:description="$t('do_you_want_to_mark_this_date_as_comp_off')"
      />
    </div>
    <!-- <div>
      <TimesheetHR :org_id="user.hr_employee.org_id" :user_details="user.hr_employee" />
    </div> -->
  </div>
</template>

<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import TimesheetHR from "../Timesheet/TimesheetHR.vue";
import DatePicker from "../Components/DatePicker.vue";
import VueElementLoading from "vue-element-loading";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import moment from "moment";
import ExcelJS from "exceljs";
export default {
  components: {
    PageTitle,
    DatePicker,
    ConfirmDialog,
    moment,
    TimesheetHR,
    VueElementLoading,
  },
  data: () => ({
    google_icon: {
      icon_name: "work_history",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    compoff_type: "",
    name: "",
    monthselected: "",
    showConfirmDialog: false,
    employeedetails: {},
    totalHours: "",
    totalDays: "",
    max_work_hour: "",
    user: "",
    emp_leaves: [],
    thisuserisHR: false,
    user_id: "",
    user_org_id: "",
    assignedProjects: [],
    HolidayLeavesArray: [],
    project_selected: "",
    focus: "",
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    overview: [],
    nonworkingday: false,
    holiday_dates: [],
    weekoff_dates: [],
    task_exist: [],
    todaysdate: new Date().toISOString().substr(0, 10),
    loader: false,
    valid: true,
    comp_off_check: null,
    empDownloadtimesheet: {
      start_date: "",
      end_date: "",
      emp_id: "",
      project_slug: "",
    },
    isBtnLoading: false,
    end_date_download_limit: "",
    timesheetdownloaddatas: [],
    passing_date_for_confirm: "",
    sel_project_title: "",
  }),
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },
  watch: {
    "$route.query.project_slug": {
      immediate: true,
      handler() {
        if (this.$route.query.project_slug) {
          this.project_selected = "all_projects";
          this.fetch_specific_projects_workedOn();
        }
        if (this.$route.query.date) {
          setTimeout(() => {
            this.setToday(this.$route.query.date);
          }, 100);
        }
      },
    },
    user_id: {
      immediate: true,
      handler() {
        if (this.user_id >= 1) {
          this.fetch_holiday_dates_and_leaves();
          if (this.$route.query.project_slug == null) {
            this.fetch_entire_projects_workedOn();
          }
        }
      },
    },
  },
  mounted() {
    // this.$refs.calendar.checkChange()
    this.thisuserisHR = false;
    if (this.$route.query.project_slug == null && this.user_id > 0) {
      this.project_selected = "all_projects";
      this.fetch_specific_projects_workedOn();
    }
    this.fetchMaxworkHours();
    this.setToday(this.todaysdate);
    this.user = JSON.parse(localStorage.getItem("user"));
    this.user_id = this.user.emp_id;
    this.user_org_id = this.user.hr_employee.org_id;
    this.empDownloadtimesheet.emp_id = this.user_id;
    this.fetch_project_assigned();

    this.checkHrrole();

    const recaptchaScript = document.createElement("script");
    recaptchaScript.setAttribute(
      "src",
      "https://unpkg.com/xlsx@0.15.1/dist/xlsx.full.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.min.js"
    );
    document.head.appendChild(recaptchaScript);
  },

  methods: {
    isHoliday(date) {
      for (var i = 0; i < this.HolidayLeavesArray.length; i++) {
        var leaveDate = this.HolidayLeavesArray[i].leaves;
        if (date == leaveDate) {
          return true;
        }
      }
      if (date > this.todaysdate) {
        return true;
      }
    },
    isweekOff(date) {
      for (var j = 0; j < this.weekoff_dates.length; j++) {
        var weekOff = this.weekoff_dates[j].weekoffs;
        if (moment(date).format("dddd") == weekOff) {
          return "error";
        }
      }
    },
    cancel() {
      this.showConfirmDialog = false;
      this.$router.push({
        name: "timesheet.task",
        query: {
          selectedDate: this.passing_date_for_confirm,
          selectedID: this.user_id,
          userOrgID: this.user_org_id,
          compoff_type: "NoCompOff",
          working_type: this.compoff_type,
        },
      });
    },
    confirm() {
      this.showConfirmDialog = false;
      this.$router.push({
        name: "timesheet.task",
        query: {
          selectedDate: this.passing_date_for_confirm,
          selectedID: this.user_id,
          userOrgID: this.user_org_id,
          compoff_type: this.compoff_type,
          working_type: this.compoff_type,
        },
      });
    },
    formattedStartDate(formatted_date) {
      this.empDownloadtimesheet.end_date = "";
      this.empDownloadtimesheet.start_date = formatted_date;
      this.end_date_download_limit = moment(
        this.empDownloadtimesheet.start_date,
        "YYYY-MM-DD"
      )
        .endOf("month")
        .format("YYYY-MM-DD");
    },
    formattedEndDate(formatted_date) {
      this.empDownloadtimesheet.end_date = formatted_date;
    },
    fetchMaxworkHours() {
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "max_work_hours/" +
            "MAXIMUM_WORKING_HOURS"
        )
        .then((res) => {
          this.max_work_hour = res.data.value;
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

    TimeAvailabiltycheckByDate(date) {
      this.loader = true;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "checktimeavailabilitybydate",
          { userID: this.user_id, Date: date, maxworkHours: this.max_work_hour }
        )
        .then((response) => {
          console.log(response);
          if (response.data.status == "S") {
            this.task_exist = response.data.timesheet_all_projects;
            this.open_date_task(date, "true");
            this.loader = false;
          } else {
            this.flashMessage.error({
              message: response.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.loader = false;
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
        });
    },

    fetch_entire_projects_workedOn() {
      this.loader = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetchemployeealltimesheettask/" +
            this.user_id
        )
        .then((res) => {
          if (res.data.status == "S") {
            for (var i = 0; i < res.data.timesheet.length; i++) {
              if (res.data.timesheet[i].project_details.active_flag == 0) {
                continue;
              }
            }
            this.overview = res.data.timesheet;
            this.eventgetting();
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
          console.log("this error" + err);
          this.loader = false;
        });
    },

    fetch_specific_projects_workedOn() {
      this.empDownloadtimesheet.project_slug = this.project_selected;
      this.assignedProjects.forEach((project) => {
        if (project.slug == this.project_selected) {
          this.sel_project_title = project.project_name;
        }
      });
      // this.sel_project_title =
      this.loader = true;
      this.overview = [];
      if (this.project_selected === "all_projects") {
        this.overview = [];
        this.fetch_entire_projects_workedOn();
      } else {
        this.overview = [];
        this.notselectproject = false;
        axios
          .get(
            process.env.VUE_APP_API_URL_ADMIN +
              "getspecifictimesheet/" +
              this.project_selected
          )
          .then((res) => {
            this.overview = res.data.timesheet;
            this.eventgetting();
            this.loader = false;
          })
          .catch((err) => {
            console.log("this error" + err);
            this.loader = false;
          });
      }
    },

    fetch_holiday_dates_and_leaves() {
      this.loader = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "getholidaysandleaves/" +
            this.user_id
        )
        .then((res) => {
          this.holiday_dates = res.data.holidays;
          this.weekoff_dates = res.data.weekoff;
          this.emp_leaves = res.data.leaves;
          this.HolidayLeavesArray = res.data.leaveDates;
          this.eventgetting();
        })
        .catch((err) => {
          console.log("this error" + err);
        });
    },

    fetch_project_assigned() {
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetch_assigned_all_project/" +
            this.user_id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.assignedProjects = res.data.assigned_project;
            if (this.assignedProjects.length > 1) {
              this.assignedProjects.splice(0, 0, {
                id: 0,
                slug: "all_projects",
                project_name: "All projects",
              });
            }
          } else {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.loader = false;
          }
        })
        .catch((err) => {
          console.log("this error" + err);
        });
    },

    open_date_task(date, compoff) {
      let selected_date = new Date(date);
      let day = selected_date.toLocaleString("en-us", { weekday: "long" });
      this.nonworkingday = false;
      this.passing_date_for_confirm = "";
      if (compoff == "true") {
        for (
          var dummy_week_off = 0;
          dummy_week_off < this.weekoff_dates.length;
          dummy_week_off++
        ) {
          if (this.weekoff_dates[dummy_week_off].weekoffs == day) {
            this.nonworkingday = true;
            this.compoff_type = "Weekoff";
          }
        }
        for (var h = 0; h < this.holiday_dates.length; h++) {
          if (this.holiday_dates[h].from_date == date) {
            this.nonworkingday = true;
            this.compoff_type = "Holiday";
          }
        }
      }

      if (this.task_exist.length > 0) {
        for (var i = 0; i <= this.task_exist.length - 1; i++) {
          this.comp_off_check = this.task_exist[i].comp_off_flag;
        }
        console.log("comp_off_check", this.comp_off_check);
      }
      if (
        this.nonworkingday &&
        this.task_exist.length == 0 &&
        this.comp_off_check == 1
      ) {
        this.showConfirmDialog = true;
        this.passing_date_for_confirm = date;
      } else if (
        this.nonworkingday &&
        this.task_exist.length == 0 &&
        this.comp_off_check == null
      ) {
        this.passing_date_for_confirm = date;
        this.showConfirmDialog = true;
      } else if (this.task_exist.length > 0 && this.comp_off_check == 1) {
        this.passing_date_for_confirm = date;
        this.$router.push({
          name: "timesheet.task",
          query: {
            selectedDate: this.passing_date_for_confirm,
            selectedID: this.user_id,
            userOrgID: this.user_org_id,
            compoff_type: this.compoff_type,
            working_type: this.compoff_type,
          },
        });
      } else if (
        this.task_exist.length > 0 &&
        this.comp_off_check == null &&
        this.compoff_type
      ) {
        this.passing_date_for_confirm = date;
        this.$router.push({
          name: "timesheet.task",
          query: {
            selectedDate: this.passing_date_for_confirm,
            selectedID: this.user_id,
            userOrgID: this.user_org_id,
            compoff_type: "NoCompOff",
            working_type: this.compoff_type,
          },
        });
      } else {
        this.$router.push({
          name: "timesheet.task",
          query: {
            selectedDate: date,
            selectedID: this.user_id,
            userOrgID: this.user_org_id,
          },
        });
      }
    },

    // viewDay({ date }) {
    //   this.focus = date
    //   this.type = 'day'
    // },
    getEventColor(event) {
      return event.color;
    },
    setToday(date) {
      this.focus = date;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      if (event.type == "Leave") {
        this.flashMessage.error({
          message: this.$t("cannot_view_activiy_on_leave"),
          time: 4000,
          blockClass: "custom-block-class",
        });
      } else if (event.type == "Holiday") {
        this.flashMessage.error({
          message: this.$t("its_a_holiday"),
          time: 4000,
          blockClass: "custom-block-class",
        });
      } else {
        // this.open_date_task(event.start, "false");
        this.checkTimesheetDataExist(event.start);
        // nativeEvent.stopPropagation();
      }
    },
    checkTimesheetDataExist(event_start) {
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "check_time_sheet_exist", {
          userID: this.user_id,
          Date: event_start,
          maxworkHours: this.max_work_hour,
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.task_exist = res.data.time_sheet_exist;
            this.open_date_task(event_start, "true");
          }
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
    eventgetting() {
      const events = [];
      for (let i = 0; i < this.overview.length; i++) {
        events.push({
          name: this.overview[i].task_name,
          project: this.overview[i].project_details.slug,
          type: "Activity",
          start: this.overview[i].submitted_date,
          color: this.overview[i].status_color,
        });
      }

      for (let j = 0; j < this.holiday_dates.length; j++) {
        events.push({
          name: this.holiday_dates[j].fetch_holidaytype.shortname,
          start: this.holiday_dates[j].from_date,
          color: "#ff6666",
          type: "Holiday",
          disabled: this.holiday_dates[j].from_date,
        });
      }

      for (let h = 0; h < this.emp_leaves.length; h++) {
        events.push({
          name: this.$t("on_leave"),
          type: "Leave",
          start: this.emp_leaves[h].start_date,
          end: this.emp_leaves[h].end_date,
          color: "orange",
        });
      }
      this.events = events;
      this.loader = false;
    },
    employeetimesheetdownload() {
      if (this.$refs.form.validate()) {
        this.isBtnLoading = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "downloademployeetimesheet",
            this.empDownloadtimesheet
          )
          .then((res) => {
            if (res.data.status == "S") {
              this.isBtnLoading = false;
              this.timesheetdownloaddatas = res.data.timesheetdownload;
              this.employeedetails = res.data.employeedetails;
              this.monthselected = res.data.monthselected;
              this.totalDays = res.data.totalDays;
              this.totalHours = res.data.totalHours;
              setTimeout(this.clickDownload, 200);
            }
          })
          .catch((err) => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            console.log(" error" + err);
          });
      }
    },
    clickDownload() {
      document.getElementById("downloaddummybutton").click();
    },
    checkHrrole() {
      for (var h = 0; h <= this.user.hr_employee.emprole_name.length; h++) {
        if (this.user.hr_employee.emprole_name[h] === "HR") {
          this.thisuserisHR = true;
        }
      }
    },
    ExportExcel(type, fn, dl) {
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
      const fontBold = {
        font: { bold: true },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "e5e8ee" },
        },
      };
      const cellAlignment = { horizontal: "center", vertical: "middle" };
      worksheet.mergeCells("A1:D1");

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
            excelCell._address == "B5" ||
            excelCell._address == "C5" ||
            excelCell._address == "D5" 
          ) {
            excelCell.style = cellStyle;
          }
          if (excelCell == 'Total Days' ||
            cellValue == "Total hours") {
              excelCell.style = fontBold;       
          }

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
      let filename = this.employeedetails.Full_Code + ' '+ this.sel_project_title;

      // Generate the Excel file
      if (dl) {
        console.log("inside if");
        const buffer = workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        let stringWithUnderscores = filename.replace(
          /\s+/g,
          "_"
        );
        a.download = stringWithUnderscores + ".xlsx";
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.log("inside else");
        workbook.xlsx.writeBuffer().then((buffer) => {
          const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          let stringWithUnderscores = filename.replace(
            /\s+/g,
            "_"
          );
          a.download = stringWithUnderscores + ".xlsx";
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(url);
          document.body.removeChild(a);
        });
      }
    },
  },
};
</script>
<style scoped>
.legendInlineclass {
  display: inline-flex;
  padding: 3px;
}

.legendouterclass {
  display: block;
  /* margin-left: 5px; */
  padding: 0px;
}

.legendInnercolorRed {
  align-self: center;
  font-size: 10px;
  font-weight: 500;
  color: white;
  text-align: center;
  background-color: red;
  min-width: 65px;
}

.legendInnercolorGreen {
  align-self: center;
  font-size: 10px;
  font-weight: 500;
  color: white;
  text-align: center;
  background-color: green;
  min-width: 65px;
}

.legendInnercolorYellow {
  align-self: center;
  font-size: 10px;
  font-weight: 500;
  text-align: center;
  background-color: #ffcc00;
  min-width: 65px;
}

.legendInnercolorBlue {
  align-self: center;
  font-size: 10px;
  font-weight: 500;
  color: white;
  text-align: center;
  background-color: #3f6ad8;
  min-width: 65px;
}

.legendInnerlightRed {
  align-self: center;
  font-size: 10px;
  font-weight: 500;
  color: white;
  text-align: center;
  background-color: #ff6666;
  min-width: 65px;
}

.legendInnerOrange {
  align-self: center;
  font-size: 10px;
  font-weight: 500;
  color: white;
  text-align: center;
  background-color: orange;
  min-width: 65px;
}

.legendInnercolorText {
  margin-left: 10px;
}

.timesheetvsheettop {
  margin-top: -20px;
}

#downloaddummybutton {
  display: none;
}

#hiddentableexcel_format {
  display: none;
}
</style>