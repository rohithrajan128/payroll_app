<template>
  <v-app class="position_app">
    <v-navigation-drawer
      v-model="side_drawer"
      absolute
      temporary
      height="100vh"
      width="30%"
      right
      class="navigation_drawer_zindex"
    >
      <v-list-item
        style="
          min-height: 70px;
          position: sticky;
          top: 0px;
          z-index: 1;
          background: white;
        "
      >
        <!-- <v-list-item-avatar>
                  <v-img
                    src="https://randomuser.me/api/portraits/men/78.jpg"
                  ></v-img>
                </v-list-item-avatar> -->
        <div class="font-weight-bold" style="font-size: 18px">
          {{ $t("leave_details") }}
        </div>
        <!-- <v-list-item-content>
                  <v-list-item-title>{{$t('leave_details')}}</v-list-item-title>
                </v-list-item-content>
        <v-divider></v-divider> -->
      </v-list-item>
      <v-divider class="m-0"></v-divider>
      <div class="pa-5 row">
        <div
          class="col-md-6 card-content"
          v-for="(employee_leaves, emp_index) in emp_all_leave_details"
          :key="emp_index"
        >
          <!-- square container start  -->
          <div style="width: 140px">
            <v-card
              v-if="employee_leaves.leave_taken != null"
              class="mb-5 card-border"
            >
              <div class="leavedetailscard card-bg-vl font-weight-bold">
                {{ employee_leaves.leave_name
                }}<span class="leaveshortnamedisplay"></span>
              </div>
              <div class="leavecountcard">
                {{ employee_leaves.leave_taken }}/
                {{ getRoundedNumber(employee_leaves.leave_total) }}
              </div>
            </v-card>
            <v-card v-else class="mb-5 card-border">
              <div class="leavedetailscard card-bg-vl font-weight-bold">
                {{ employee_leaves.leave_name
                }}<span class="leaveshortnamedisplay"></span>
              </div>
              <div class="leavecountcard">
                0.0 / {{ getRoundedNumber(employee_leaves.leave_total) }}
              </div>
            </v-card>
          </div>
          <!-- square container end  -->
          <!-- circular container start  -->

          <!-- <div
            class="circle-container"
            v-if="employee_leaves.leave_taken != null"
          >
            <div class="circle-header">
              <span class="text-center circle-text-align mt-1">{{
                employee_leaves.leave_name
              }}</span>
            </div>
            <div class="circle-data">
              <span class="text-center mb-2 circle-text-align">
                {{ employee_leaves.leave_taken }}/
                {{ getRoundedNumber(employee_leaves.leave_total) }}</span
              >
            </div>
          </div>
          <div class="circle-container" v-else>
            <div class="circle-header">
              <span class="text-center circle-text-align mt-1">{{
                employee_leaves.leave_name
              }}</span>
            </div>
            <div class="circle-data">
              <span class="text-center mb-2 circle-text-align">
                0.0 / {{ getRoundedNumber(employee_leaves.leave_total) }}</span
              >
            </div>
          </div> -->
          <!-- circular container end  -->
        </div>
      </div>
    </v-navigation-drawer>
    <!-- 17,18 -->
    <VueElementLoading
      :active="loader"
      spinner="bar-fade-scale"
      color="var(--primary)"
    />
    <div class="row mt-3 container-fluid row-margin">
      <div class="col-md-8">
        <v-card class="card-height">
          <div class="row">
            <div class="col-md-3">
              <div class="profilepic">
                <img
                  class="profilepic__image"
                  v-if="user.hr_employee.profile_pic"
                  :src="envImagePath + user.hr_employee.profile_pic"
                  alt
                />
                <img
                  v-else
                  class="profilepic__image"
                  src="@/assets/images/default-user-profile-picture.png"
                />
              </div>
            </div>
            <div class="col-md-9">
              <div class="name-border">
                <div class="d-flex justify-content-between">
                  <div>
                    <div class="name-fonts">
                      {{ user.hr_employee.firstname }}
                      {{ user.hr_employee.lastname }}
                    </div>
                    <div class="designation-fonts">
                      {{ user.hr_employee.designation.designation }}
                    </div>
                  </div>
                  <div class="mr-2">
                    <img
                      src="@/assets/images/male_icon.jpg"
                      v-if="user.hr_employee.gender == 'Male'"
                      height="40"
                      class="icon_radius"
                    />
                    <img
                      src="@/assets/images/female_icon.jpg"
                      height="40"
                      class="icon_radius"
                      v-else
                    />
                    <span class="emp-no-font">{{
                      user.hr_employee.empno
                    }}</span>
                  </div>
                </div>
                <div
                  v-if="user.hr_employee.gender == 'Male'"
                  class="gender_font"
                >
                  {{ $t("male") }}
                </div>
                <div
                  v-else-if="user.hr_employee.gender == 'Female'"
                  class="gender_font"
                >
                  {{ $t("female") }}
                </div>
                <div v-else class="gender_font">
                  {{ $t("others") }}
                </div>
              </div>
              <!-- {{user_info}} -->
              <div class="d-flex mt-2 justify-content-between">
                <div>
                  <div>
                    <i
                      class="fa fa-envelope fa-font-size email-color"
                      aria-hidden="true"
                    ></i>
                    <span class="em-font"
                      >{{ user.hr_employee.user_email }}
                    </span>
                  </div>
                  <div class="mt-2">
                    <i
                      class="fa fa-phone fa-font-size phone-color"
                      aria-hidden="true"
                    ></i>
                    <span class="em-font">{{ user.hr_employee.phone }} </span>
                  </div>
                  <div class="mt-2">
                    <i
                      class="fa fa-calendar fa-font-size jod-color"
                      aria-hidden="true"
                    ></i>
                    <span class="em-font"
                      >{{ user.hr_employee.Joining_date | formatDate }} (<span
                        class="font-weight-bold"
                        >DOJ</span
                      >)
                    </span>
                  </div>
                </div>
                <!-- {{user_info.user.reporting_to   user_info.user.reporting_to.empnamefetch.profile_pic}} -->
                <!-- {{user_info.user.reporting_to}} -->
                <!-- {{manager_details}} -->
                <div class="mr-3 font-weight-bold">
                  {{ $t("reporting_to") }}
                  <div class="mt-1 reporting-border">
                    <v-avatar size="35" class="hover_shine">
                      <v-img
                        v-if="manager_details.profile"
                        :src="envImagePath + manager_details.profile"
                        alt
                      ></v-img>
                      <img
                        v-else
                        src="@/assets/images/default-user-profile-picture.png"
                        alt
                      />
                    </v-avatar>
                    <span
                      class="reporting-name-font"
                      v-if="manager_details.manager"
                      >{{ manager_details.manager }}
                    </span>
                    <span v-else class="reporting-name-font">{{
                      $t("self")
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-card>
      </div>
      <div class="col-md-4">
        <div class="card height-width-card">
          <div
            class="d-flex justify-content-between align-items-center leaves_card_padding"
          >
            <div class="work_align">{{ $t("leaves") }}</div>
            <div class="font-weight-bold">
              <a @click="fetchLeaveAllDetails()" class="a_link_color"> More </a>
            </div>
          </div>

          <div class="row px-5">
            <div class="col-md-3 col-lg-3 col-xl-3">
              <v-card max-width="100px" class="mb-5 leave_width">
                <div class="leavedetailscard">
                  {{ $t("allotted")
                  }}<span class="leaveshortnamedisplay"></span>
                </div>
                <div class="leavecountcard">{{ allotted_leaves }}</div>
              </v-card>
            </div>
            <div class="col-md-3 col-lg-3 col-xl-3">
              <v-card max-width="100px" class="mb-5 leave_width">
                <div class="leavedetailscard">
                  {{ $t("applied") }}<span class="leaveshortnamedisplay"></span>
                </div>
                <div class="leavecountcard">{{ applied_leaves }}</div>
              </v-card>
            </div>
            <div class="col-md-3 col-lg-3 col-xl-3">
              <v-card max-width="100px" class="mb-5 leave_width">
                <div class="leavedetailscard">
                  {{ $t("availed") }}<span class="leaveshortnamedisplay"></span>
                </div>
                <div class="leavecountcard">{{ availed_leaves }}</div>
              </v-card>
            </div>
            <div class="col-md-3 col-lg-3 col-xl-3">
              <v-card max-width="100px" class="mb-5 leave_width">
                <div class="leavedetailscard">
                  {{ $t("balance") }}<span class="leaveshortnamedisplay"></span>
                </div>
                <div class="leavecountcard">{{ balance_leaves }}</div>
              </v-card>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-row class="row px-8 pt-1" v-if="enable_applied_leave_calendar == true">
      <applied-leave-and-calender
        @fetchpendingleaves="checkPendingLeaves"
        @fetchappliedleaves="checkAppliedLeaves"
        @fetchpendingtasks="checkPendingTask"
        @fetchpempgroupleaves="checkempgroupLeaves"
      ></applied-leave-and-calender>
    </v-row>
    <v-row class="row px-8 pb-4">
      <holiday-birthday
        @fetchbirthday="checkfetchbirthday"
        @fetchholiday="checkfetchholiday"
        @fetchannouncement="checkAnnoucementget"
      ></holiday-birthday>
    </v-row>

    <v-row class="row px-8">
      <!-- // <leave-and-timesheet></leave-and-timesheet> -->
    </v-row>
  </v-app>
</template>

<script>
// import firebase from "@/firebaseConfig.js";
// import { messaging } from "@/firebase.js";
import { getMessaging, getToken } from "firebase/messaging";
import HolidayBirthday from "../Pages/Configuration/Users/DashBoardComponents/HolidayAndBirthday.vue";
import AppliedLeaveAndCalender from "../Pages/Configuration/Users/DashBoardComponents/AppliedLeaveAndCalender.vue";
import VueElementLoading from "vue-element-loading";
export default {
  components: {
    HolidayBirthday,
    AppliedLeaveAndCalender,
    VueElementLoading,
  },
  data: () => ({
    search: "",
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    todaysdate: new Date().toISOString().substr(0, 10),
    current_time: "",
    user: [],
    loader: false,
    getallaleaves: false,
    side_drawer: false,
    greeting: "",
    user_id: "",
    holidaycomponent: "",
    birthdaycomponent: "",
    calendercomponent: "",
    timesheetpendingcomponent: "",
    enable_applied_leave_calendar: false,
    appliedleavecomponent: "",
    announcementgetcomponent: "",
    leaveapprovalcomponent: "",
    balance_leaves: "",
    availed_leaves: "",
    applied_leaves: "",
    allotted_leaves: "",
    manager_details: "",
    emp_all_leave_details: [],
    initval: false,
  }),
  computed: {
    headers() {
      return [
        {
          text: this.$t("leave_name"),
          align: "left",
        },
        {
          text: this.$t("total"),
          align: "left",
        },
        {
          text: this.$t("availed"),
        },
        {
          text: this.$t("balance"),
        },
        {
          text: this.$t("applied"),
        },
      ];
    },
  },
  created() {
    if (window.location.protocol === "https:") {
      this.firebaseNotificationPermission();
      console.log("nav", navigation);
    }
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    if (this.user) {
      this.enable_applied_leave_calendar =
        this.user.hr_employee.emprole_name.includes("Manager");
    }
    this.user_id = this.user.emp_id;
    this.checkDayType();
    this.showTime();
  },
  watch: {
    user_id: {
      immediate: true,
      handler() {
        if (this.user_id != "") {
          this.fetchTotalappliedleavecount();
          this.fetchPrimaryManagerDetails(this.user_id);
        }
      },
    },
  },
  methods: {
    getRoundedNumber(number) {
      return number.toFixed(1);
    },
    fetchLeaveAllDetails() {
      this.loader = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fecth_emp_leave_details")
        .then((res) => {
          this.loader = false;
          if (res.data.status == "S") {
            this.emp_all_leave_details = res.data.emp_leave_balance;
            this.side_drawer = true;
          } else {
            this.loader = false;
            this.flashMessage.error({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.loader = false;
            this.side_drawer = false;
          }
        })
        .catch((err) => {
          this.loader = false;
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log("this error" + err);
          this.side_drawer = false;
        });
    },
    fetchPrimaryManagerDetails(user_id) {
      this.loader = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetchprimarymanagerbyid/" +
            user_id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.manager_details = res.data;
            // this.manager_pic = res.data.profile;
            // this.manager_designation = res.data.manager_desigantion;
          } else {
            this.flashMessage.error({
              message: res.data.message,
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
          console.log("this error" + err);
        });
    },
    firebaseNotificationPermission() {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          try {
            let messaging = getMessaging();
            const token = getToken(messaging).then((token) => {
              this.addTokenEmp(token);
            }); // Send the token to your server for sending notifications
          } catch (error) {
            console.error("Error retrieving FCM token:", error);
          }
          // messaging.getToken();
        }
      });
      //
    },
    addTokenEmp(fcm_token) {
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "add_device_token", {
          emp_id: this.user_id,
          device_token: fcm_token,
        })
        .then((res) => {
          if (res.data.status == "S") {
          } else if (res.data.status == "E") {
          }
        })
        .catch((err) => {
          console.log("Error adding device token", err);
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
        });
    },
    fetchTotalappliedleavecount() {
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "fetchleavescountbyuserid", {
          emp_id: this.user_id,
          leave_id: 0,
          year_type:
            this.user.hr_employee["user_org"]["leave_calculation_year"],
        })
        .then((res) => {
          this.balance_leaves = res.data.balance_leave;
          this.availed_leaves = res.data.availed_leave;
          this.applied_leaves = res.data.applied_leaves;
          this.allotted_leaves = res.data.allotted_leaves;
          this.getallaleaves = true;
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
    checkfetchbirthday(fetchbirthday) {
      this.birthdaycomponent = fetchbirthday;
      this.checkAlldataget();
    },
    checkAnnoucementget(fetchannouncement) {
      this.announcementgetcomponent = fetchannouncement;
      this.checkAlldataget();
    },
    checkfetchholiday(fetchholiday) {
      this.holidaycomponent = fetchholiday;
      this.checkAlldataget();
    },
    checkempgroupLeaves(fetchpempgroupleaves) {
      this.calendercomponent = fetchpempgroupleaves;
      this.checkAlldataget();
    },
    checkPendingTask(fetchpendingtasks) {
      this.timesheetpendingcomponent = fetchpendingtasks;
      this.checkAlldataget();
    },
    checkAppliedLeaves(fetchappliedleaves) {
      this.appliedleavecomponent = fetchappliedleaves;
      this.checkAlldataget();
    },
    checkPendingLeaves(fetchpendingleaves) {
      this.leaveapprovalcomponent = fetchpendingleaves;
      this.checkAlldataget();
    },
    checkAlldataget() {
      if (
        (this.birthdaycomponent == "true" &&
          this.holidaycomponent == "true" &&
          this.calendercomponent == "true") ||
        (this.enable_applied_leave_calendar == false &&
          this.timesheetpendingcomponent == "true") ||
        (this.enable_applied_leave_calendar == false &&
          this.appliedleavecomponent == "true") ||
        (this.enable_applied_leave_calendar == false &&
          this.leaveapprovalcomponent == "true") ||
        (this.enable_applied_leave_calendar == false &&
          this.announcementgetcomponent == "true" &&
          this.getallaleaves)
      ) {
        this.loader = false;
      }
    },
    checkDayType() {
      var present_date = new Date();
      var present_date_hours = present_date.getHours();
      if (present_date_hours < 12) {
        this.greeting = this.$t("good_morning");
      } else if (present_date_hours >= 12 && present_date_hours <= 17) {
        this.greeting = this.$t("good_afternoon");
      } else if (present_date_hours >= 17 && present_date_hours <= 24) {
        this.greeting = this.$t("good_evening");
      }
    },
    showTime() {
      var date = new Date();
      var h = date.getHours(); // 0 - 23
      var m = date.getMinutes(); // 0 - 59
      var s = date.getSeconds(); // 0 - 59
      var session = "AM";
      if (h == 0) {
        h = 12;
      }
      if (h >= 12) {
        session = "PM";
      }
      if (h > 12) {
        h = h - 12;
      }
      h = h < 10 ? "0" + h : h;
      m = m < 10 ? "0" + m : m;
      s = s < 10 ? "0" + s : s;
      // this.current_time = h + ":" + m + ":" + s + " " + session;
      this.current_time = h + ":" + m + " " + session;
      setTimeout(() => {
        this.showTime();
      }, 1000);
    },
  },
};
</script>

<style scoped>
.height-width-card {
  height: 152px;
}

/* 
.img_border_radius {
  border-radius: 10px !important;
  height: 20px;
} */

.leaveshortnamedisplay {
  font-size: 12px;
}

.leavedetailscard {
  font-size: 15px;
  text-align: center;
  font-weight: 500;
  /* font-family: "'Raleway', sans-serif !important;"; */
  background-color: rgb(22, 113, 205);
  height: auto;
  color: #eeeeee;
  padding: 5px 0px;
}

.leavecountcard {
  text-align: center;
  font-size: 20px;
  /* font-family: 'Raleway', sans-serif !important;; */
  height: auto;
  font-weight: 500;
  padding: 5px 0px;
  /* border: solid 1px dodgerblue; */
}

.leave_align-self {
  align-items: self-end;
}

.work_align {
  font-size: 17px;
  font-weight: 600;
  margin-top: 15px;
  margin-bottom: 15px;
  margin-left: 15px;
}

.datespaninheaderdashboard {
  /* margin-left: 15px; */
  font-size: 15px;
  font-weight: 500;
  color: #695858;
}

.clock {
  color: #037a4f;
  /* font-family: 'Raleway', sans-serif !important;; */
  margin-left: 15px;
  font-size: 18px;
  font-weight: 600;
  margin-top: 13px;
  letter-spacing: 1px;
}

.dahsboardfreeting {
  font-size: 14px;
  font-weight: 600;
  color: #048904;
}

.headerdivinprofilecard {
  height: 100% !important;
}

.displayempprofile {
  height: 152px;
}

.leaves_card_padding {
  padding: 0px 19px 0px 0px;
}

.a_link_color {
  color: #1976d2 !important;
}

.main-card-leave-details {
  height: 384px;
  width: 250px;
}

.rounded_margin {
  margin: 6px 11px 8px 11px;
  width: 75px;
}

.p-20 {
  padding: 20px 12px 20px 12px !important;
}

.navigation_drawer_zindex {
  z-index: 1000 !important;
  border-radius: 8px 0px 0px 8px;
  margin-top: 6px;
}

.position_app {
  position: relative;
}

.leaves_bg {
  background: #7ab0d3;
}

.leave_width {
  min-width: 57px;
}

.card-content {
  display: grid;
  place-content: center;
  /* height: 150px; */
}

.card-border {
  /* border: 1px solid grey !important; */
  box-shadow: 0px 0px 2px !important;
  border-radius: 20px 20px !important;
}

.card-bg-vl {
  background: #5858a8;
}

.circle-container {
  width: 130px;
  height: 130px;
  border-radius: 130px;
  box-shadow: 0px 0px 3px grey;
  overflow: auto;
}

.circle-header {
  height: 50%;
  background: rgb(22, 113, 205);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0px 1px 8px gray;
}

.circle-data {
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.circle-text-align {
  width: 70%;
}

.roundedprofilepic {
  border: solid white 3px;
  border-radius: 50px;
}
.roundedprofilepicmanager {
  border: solid rgb(216, 213, 213) 3px;
  border-radius: 50px;
}

.profilepic {
  position: relative;
  /* width: 146px; */
  height: 167px;
  border-radius: 8px;
  overflow: hidden;
  /* background-color: #111; */
  margin-left: 5px;
  border: 1px solid #c1b0b0;
}

/* .profilepic:hover .profilepic__image {
  opacity: 0.2;
  background: grey;
} */

.profilepic__image {
  object-fit: cover;
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
  height: 180px;
}

.profilepic__content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.name-border {
  border: 1px solid black;
  border-radius: 7px 7px 7px 7px;
  padding: 6px;
  margin-right: 13px;
}
.name-fonts {
  font-size: 19px;
  font-weight: bold;
}
.designation-fonts {
  font-size: 13px;
  color: gray;
  font-weight: bold;
}
.fa-font-size {
  font-size: 18px;
}
.em-font {
  margin-left: 8px;
  font-size: 14px;
}
.reporting-border {
  border: 1px solid #247cd4;
  border-radius: 7px 7px 7px 7px;
  padding: 2px;
}
.reporting-name-font {
  color: #247cd4;
  font-weight: normal;
  margin-left: 6px;
}

.icon_radius {
  border-radius: 40px;
}

.emp-no-font {
  font-weight: bold;
  font-size: 17px;
  margin-left: 7px;
}
.card-height {
  height: 195px;
}
.row-margin {
  margin-left: -5px;
}
.jod-color {
  color: #1414f1e0;
}
.phone-color {
  color: #1671cd;
}
.email-color {
  color: #0aaace;
}
.gender_font {
  text-align: end;
  margin-top: -7px;
  margin-right: 70px;
  font-size: 13px;
  text-transform: capitalize;
  font-weight: 700;
}
</style>
