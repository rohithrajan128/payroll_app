<template>
  <div class="main-20" v-if="user_org_id>=1">
      <TimesheetHR :org_id="user_org_id" :user_details="user.hr_employee" />
  </div>
</template>
  
  <script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import TimesheetHR from "../Timesheet/TimesheetHR.vue";
import DatePicker from "../Components/DatePicker.vue";
import VueElementLoading from "vue-element-loading";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import moment from "moment";
export default {
  components: {
    PageTitle,
    DatePicker,
    ConfirmDialog,
    moment,
    TimesheetHR,
    VueElementLoading
  },
  data: () => ({
    google_icon: {
      icon_name: "work_history",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined"
    },
    name: "",
    monthselected: "",
    showConfirmDialog: false,
    employeedetails: [],
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
    notselectproject: false,
    todaysdate: new Date().toISOString().substr(0, 10),
    loader: false,
    valid: true,
    empDownloadtimesheet: {
      start_date: "",
      end_date: "",
      emp_id: "",
      project_slug: ""
    },
    isBtnLoading: false,
    end_date_download_limit: "",
    timesheetdownloaddatas: [],
    passing_date_for_confirm: ""
  }),
  computed: {
    fieldRules() {
      return [v => !!v || this.$t("field_required")];
    }
  },
  watch: {
    "$route.query.project_slug": {
      immediate: true,
      handler() {
        if (this.$route.query.project_slug) {
          this.project_selected = this.$route.query.project_slug;
          this.fetch_specific_projects_workedOn();
        }
        if (this.$route.query.date) {
          setTimeout(() => {
            this.setToday(this.$route.query.date);
          }, 100);
        }
      }
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
      }
    }
  },
  mounted() {
    // this.$refs.calendar.checkChange()
    this.thisuserisHR = false;
    if (this.$route.query.project_slug == null) {
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
    },
    confirm() {
      this.showConfirmDialog = false;
      this.$router.push({
        name: "timesheet.task",
        query: {
          selectedDate: this.passing_date_for_confirm,
          selectedProject: this.project_selected,
          selectedID: this.user_id,
          userOrgID: this.user_org_id
        }
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
        .then(res => {
          this.max_work_hour = res.data.value;
        })
        .catch(err => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          console.log(" error" + err);
        });
    },

    TimeAvailabiltycheckByDate(date) {
      this.loader = true;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "checktimeavailabilitybydate",
          {
            userID: this.user_id,
            Date: date,
            maxworkHours: this.max_work_hour,
            project: this.project_selected
          }
        )
        .then(response => {
          if (response.data.status == "S") {
            this.open_date_task(date, "true");
            this.loader = false;
          } else if (response.data.status == "EXIST") {
            this.flashMessage.error({
              message: response.data.message,
              time: 4000,
              blockClass: "custom-block-class"
            });
            this.loader = false;
          } else {
            this.flashMessage.error({
              message: response.data.message,
              time: 4000,
              blockClass: "custom-block-class"
            });
            this.loader = false;
          }
        })
        .catch(err => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          console.log(err);
          this.loader = false;
        });
    },

    fetch_entire_projects_workedOn() {
      this.loader = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetchemployeealltimesheettask/" + this.user_id
        )
        .then(res => {
          if(res.data.status == 'S'){
             for (var i = 0; i < res.data.timesheet.length; i++) {
            if (res.data.timesheet[i].project_details.active_flag == 0) {
              continue;
            }
          }
          this.overview = res.data.timesheet;
          this.loader = false;
          }
         else{
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
         }
        })
        .catch(err => {
          console.log("this error" + err);
          this.loader = false;
        });
    },

    fetch_specific_projects_workedOn() {
      this.empDownloadtimesheet.project_slug = this.project_selected;
      this.loader = true;
      this.overview = [];
      if (this.project_selected === "all_projects") {
        this.overview = [];
        this.fetch_entire_projects_workedOn();
      } else {
        this.notselectproject = false;
        axios
          .get(
            process.env.VUE_APP_API_URL_ADMIN +
              "getspecifictimesheet/" +
              this.project_selected
          )
          .then(res => {
            this.overview = res.data.timesheet;
            this.loader = false;
          })
          .catch(err => {
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
        .then(res => {
          this.holiday_dates = res.data.holidays;
          this.weekoff_dates = res.data.weekoff;
          this.emp_leaves = res.data.leaves;
          this.HolidayLeavesArray = res.data.leaveDates;
          this.eventgetting();
        })
        .catch(err => {
          console.log("this error" + err);
        });
    },

    fetch_project_assigned() {
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetch_assigned_project/" +
            this.user_id
        )
        .then(res => {
          if (res.data.status == "S") {
            this.assignedProjects = res.data.assigned_project;
            if (this.assignedProjects.length > 1) {
              this.assignedProjects.splice(0, 0, {
                id: 0,
                slug: "all_projects",
                project_name: "All projects"
              });
            }
          } else {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class"
            });
            this.loader = false;
          }
        })
        .catch(err => {
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
          }
        }
        for (var h = 0; h < this.holiday_dates.length; h++) {
          if (this.holiday_dates[h].from_date == date) {
            this.nonworkingday = true;
          }
        }
      }

      if (this.project_selected != "all_projects") {
        if (this.nonworkingday) {
          this.showConfirmDialog = true;
          this.passing_date_for_confirm = date;
        } else {
          this.$router.push({
            name: "timesheet.task",
            query: {
              selectedDate: date,
              selectedProject: this.project_selected,
              selectedID: this.user_id,
              userOrgID: this.user_org_id
            }
          });
        }
      } else {
        this.notselectproject = true;
        this.flashMessage.error({
          message: this.$t("please_select_project_to_submit_timesheet"),
          time: 4000,
          blockClass: "custom-block-class"
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
      this.project_selected = null;
      if (event.type == "Leave") {
        this.flashMessage.error({
          message: this.$t("cannot_view_activiy_on_leave"),
          time: 4000,
          blockClass: "custom-block-class"
        });
      } else if (event.type == "Holiday") {
        this.flashMessage.error({
          message: this.$t("its_a_holiday"),
          time: 4000,
          blockClass: "custom-block-class"
        });
      } else {
        this.project_selected = event.project;
        this.open_date_task(event.start, "false");
       // nativeEvent.stopPropagation();
      }
    },

    eventgetting() {
      const events = [];
      for (let i = 0; i < this.overview.length; i++) {
        events.push({
          name: this.overview[i].task_name,
          project: this.overview[i].project_details.slug,
          type: "Activity",
          start: this.overview[i].submitted_date,
          color: this.overview[i].status_color
        });
      }

      for (let j = 0; j < this.holiday_dates.length; j++) {
        events.push({
          name: this.holiday_dates[j].fetch_holidaytype.shortname,
          start: this.holiday_dates[j].from_date,
          color: "#ff6666",
          type: "Holiday",
          disabled: this.holiday_dates[j].from_date
        });
      }

      for (let h = 0; h < this.emp_leaves.length; h++) {
        events.push({
          name: this.$t("on_leave"),
          type: "Leave",
          start: this.emp_leaves[h].start_date,
          end: this.emp_leaves[h].end_date,
          color: "orange"
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
          .then(res => {
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
          .catch(err => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class"
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
      var elt = this.$refs.exportable_table;
      var wb = XLSX.utils.table_to_book(elt, { sheet: "Sheet JS" });
      return dl
        ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
        : XLSX.writeFile(
            wb,
            fn ||
              ("Timesheet" + "." || "SheetJSTableExport.") + (type || "xlsx")
          );
    }
  }
};
</script>
  <style scoped>
.legendInlineclass {
  display: inline-flex;
  padding: 3px;
}

.legendouterclass {
  display: block;
  margin-left: 5px;
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