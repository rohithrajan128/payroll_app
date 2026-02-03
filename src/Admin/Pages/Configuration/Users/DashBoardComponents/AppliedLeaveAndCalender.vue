<template>
  <v-layout>
    <v-flex md8 sm12 xl8 lg8 class="mr-2">
      <div class="row">
        <div class="col-md-12">
          <div class="main-card mb-3 card">
            <div class="card-header" style="height:64px;">
              {{ $t("team_leave_calender") }}
            </div>
            <div class="table-responsive">
              <div class="calenderscrollbarrowminheight">
                <VuePerfectScrollbar class="scrollbar-container" v-once>
                  <div>
                    <v-calendar v-model="focus" ref="calendar" :events="events">
                    </v-calendar>
                  </div>
                </VuePerfectScrollbar>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-flex>
    <v-flex md4 sm12 xl4 lg4 >
      <div class="row">
        <div class="col-md-12">
          <div class="main-card mb-3 card leave-data-card">
            <!-- <div class="card-header">
              {{ $t('approval') }}
              <v-spacer></v-spacer>
              
              <v-btn small class="mt-2 primary hover_shine mb-3" @click="routetoviewAll(currentTab)"
                v-if="(currentTab == 'timesheetapproval' && emp_timesheet.length > 1) || (currentTab == 'leaveapproval' && emp_pending_leave_pending.length > 1)">
                <span>{{ $t('view_all') }}</span>
              </v-btn>
            </div> -->
            <div class="table-responsive approval-tabs">
              <tabs
                :tabs="
                  this.user.hr_employee &&
                  this.user.hr_employee.emprole_name.includes('HR') &&  !this.user.hr_employee.emprole_name.includes('Manager')
                    ? tabs
                    : tabs1
                "
                :currentTab="currentTab"
                :wrapper-class="'shadow-tabs inline-tabs'"
                style="display: inline-flex"
                :tab-class="'tab-item'"
                :tab-active-class="'tab-item-active'"
                :line-class="'tab-item-line'"
                @onClick="handleClick"
                
              />

              <!--<v-icon class="view_btn" @click="routetoviewAll(currentTab)"  v-if="(currentTab == 'timesheetapproval' && emp_timesheet.length > 1) || (currentTab == 'leaveapproval' && emp_pending_leave_pending.length > 1)">
                mdi mdi-view-grid-plus-outline
               </v-icon>-->

              <v-tooltip
                bottom
                v-if="
                  (currentTab == 'timesheetapproval' &&
                    emp_timesheet.length > 1) ||
                  (currentTab == 'leaveapproval' &&
                    emp_pending_leave_pending.length > 1)
                "
              >
                <template v-slot:activator="{ on }">
                  <v-icon
                    @click="routetoviewAll(currentTab)"
                    v-on="on"
                    small
                    class="mr-2 edit_btn icon_size view_btn"
                    >mdi mdi-view-grid-plus-outline</v-icon
                  >
                </template>
                <span>{{ $t("view") }}</span>
              </v-tooltip>

              <!-- <v-btn  small class="mt-2 primary hover_shine mb-3 view_btn" @click="routetoviewAll(currentTab)"
                v-if="(currentTab == 'timesheetapproval' && emp_timesheet.length > 1) || (currentTab == 'leaveapproval' && emp_pending_leave_pending.length > 1)">
                <span>{{ $t('view_all') }}</span>
              </v-btn> -->

              <div v-if="currentTab === 'appliedleave'">
                <div
                  class="approvalsscrollbarrowminheight"
                  style="height: 302px;"
                  v-if="emp_applied_leave.length >= 1"
                >
                  <VuePerfectScrollbar class="scrollbar-container" v-once>
                    <table
                      class="align-middle mb-0 table table-borderless table-striped table-hover"
                    >
                      <thead>
                        <tr class="mt-8">
                          <th class="pl-6 approvalstableheadings">
                            {{ $t("employee_name") }}
                          </th>
                          <th class="text-center approvalstableheadings">
                            {{ $t("start_date") }}
                          </th>
                          <th class="text-center approvalstableheadings">
                            {{ $t("end_date") }}
                          </th>
                          <th class="text-center approvalstableheadings">
                            {{ $t("status") }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(leave, i) in emp_applied_leave" :key="i">
                          <td>
                            <div class="widget-content p-0 pl-2">
                              <div class="widget-content-wrapper">
                                <div class="widget-content-left mr-2">
                                  <div class="widget-content-left">
                                    <img
                                      width="33"
                                      class="rounded-circle"
                                      v-if="leave.employee_details.profile_pic"
                                      :src="
                                        envImagePath +
                                        leave.employee_details.profile_pic
                                      "
                                      alt
                                    />
                                    <img
                                      v-else
                                      width="33"
                                      class="rounded-circle"
                                      src="@/assets/images/default-user-profile-picture.png"
                                    />
                                  </div>
                                </div>
                                <div class="widget-content-left flex2">
                                  <div
                                    class="widget-heading employeenameinapproval"
                                  >
                                    <span
                                      v-if="leave.employee_details.full_name"
                                      >{{
                                        leave.employee_details.full_name
                                      }}</span
                                    >
                                  </div>
                                  <div
                                    class="widget-subheading opacity-7 employeenumberinapproval"
                                  >
                                    <span
                                      v-if="leave.employee_details.full_name"
                                      >{{ leave.employee_details.empno }}</span
                                    >
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td class="text-center dateinapprovaldiv">
                            {{ leave.start_date | formatDate }}
                          </td>
                          <td class="text-center dateinapprovaldiv">
                            {{ leave.end_date | formatDate }}
                          </td>
                          <td class="text-center">
                            <div
                              :class="`badge badgechipinappliedleave badge-${leave.color}`"
                            >
                              {{ leave.status }}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </VuePerfectScrollbar>
                </div>
                <div class="approvalsscrollbarrowminheight" v-else>
                  <v-sheet class="nodatasvelsedashboard"
                    ><span>{{
                      $t("no_leave_applied_this_month")
                    }}</span></v-sheet
                  >
                </div>
              </div>
              <div v-if="currentTab === 'leaveapproval'">
                <div
                  class="approvalsscrollbarrowminheight leave_container"
                  style="height: 302px;"
                  v-if="emp_pending_leave_pending.length >= 1"
                >
                  <VuePerfectScrollbar class="scrollbar-container" v-once>
                    <table
                      class="align-middle mb-0 table table-borderless table-striped table-hover"
                    >
                      <thead>
                        <tr class="mt-8">
                          <th class="pl-6 approvalstableheadings">
                            {{ $t("employee_name") }}
                          </th>
                          <th class="text-center approvalstableheadings">
                            {{ $t("start_date") }}
                          </th>
                          <th class="text-center approvalstableheadings">
                            {{ $t("end_date") }}
                          </th>
                          <th class="text-center approvalstableheadings">
                            {{ $t("status") }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(pendingLeave, i) in emp_pending_leave_pending"
                          :key="i"
                        >
                          <td>
                            <div class="widget-content p-0 pl-2">
                              <div class="widget-content-wrapper">
                                <div class="widget-content-left mr-2">
                                  <div class="widget-content-left">
                                    <img
                                      width="33"
                                      class="rounded-circle"
                                      v-if="
                                        pendingLeave &&
                                        pendingLeave.employee_details &&
                                        pendingLeave.employee_details
                                          .profile_pic
                                      "
                                      :src="
                                        envImagePath +
                                        pendingLeave.employee_details
                                          .profile_pic
                                      "
                                      alt
                                    />
                                    <img
                                      v-else
                                      width="33"
                                      class="rounded-circle"
                                      src="@/assets/images/default-user-profile-picture.png"
                                    />
                                  </div>
                                </div>
                                <div class="widget-content-left flex2">
                                  <div
                                    class="widget-heading employeenameinapproval"
                                    v-if="
                                      pendingLeave &&
                                      pendingLeave.employee_details &&
                                      pendingLeave.employee_details.full_name
                                    "
                                  >
                                    {{
                                      pendingLeave.employee_details.full_name
                                    }}
                                  </div>
                                  <div
                                    class="widget-subheading opacity-7 employeenumberinapproval"
                                    v-if="
                                      pendingLeave &&
                                      pendingLeave.employee_details &&
                                      pendingLeave.employee_details.empno
                                    "
                                  >
                                    {{ pendingLeave.employee_details.empno }}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td
                            class="text-center dateinapprovaldiv"
                            v-if="pendingLeave"
                          >
                            {{ pendingLeave.start_date | formatDate }}
                          </td>
                          <td
                            class="text-center dateinapprovaldiv"
                            v-if="pendingLeave"
                          >
                            {{ pendingLeave.end_date | formatDate }}
                          </td>
                          <td class="text-center" v-if="pendingLeave">
                            <router-link
                              class="text-decoration-none"
                              style="color: white"
                              :to="{
                                name: 'leaveapproval_amend',
                                query: {
                                  id: pendingLeave.id,
                                },
                              }"
                            >
                              <div
                                class="badge badge-success badgechipinapproval"
                              >
                                {{ pendingLeave.status }}
                              </div>
                            </router-link>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </VuePerfectScrollbar>
                </div>
                <div class="approvalsscrollbarrowminheight" v-else>
                  <v-sheet class="nodatasvelsedashboard"
                    ><span>{{ $t("no_pending_leaves") }}</span></v-sheet
                  >
                </div>
              </div>
              <div v-if="currentTab === 'timesheetapproval'">
                <div
                  class="approvalsscrollbarrowminheight"
                  v-if="emp_timesheet.length >= 1"
                >
                  <VuePerfectScrollbar class="scrollbar-container" v-once>
                    <table
                      class="align-middle mb-0 table table-borderless table-striped table-hover"
                    >
                      <thead>
                        <tr class="mt-8">
                          <th class="pl-4 approvalstableheadings">
                            {{ $t("project_name") }}
                          </th>
                          <th class="text-center approvalstableheadings">
                            {{ $t("no_of_employees") }}
                          </th>
                          <th class="text-center approvalstableheadings">
                            {{ $t("status") }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(project, i) in emp_timesheet" :key="i">
                          <td>
                            <div class="widget-content p-0 pl-2">
                              <div class="widget-content-wrapper">
                                <div class="widget-content-left flex2 mr-2">
                                  <div
                                    class="widget-heading employeenameinapproval"
                                  >
                                    {{ project.project_name }}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td class="text-center dateinapprovaldiv">
                            {{ project.emp_timesheet_status_details_count }}
                          </td>
                          <td class="text-center">
                            <router-link
                              class="text-decoration-none"
                              style="color: white"
                              :to="{
                                name: 'timesheet_approval',
                                query: {
                                  id: project.id,
                                },
                              }"
                            >
                              <div
                                class="badge badge-success badgechipinapproval"
                              >
                                {{ $t("pending") }}
                              </div>
                            </router-link>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </VuePerfectScrollbar>
                </div>
                <div class="approvalsscrollbarrowminheight" v-else>
                  <v-sheet class="nodatasvelsedashboard"
                    ><span>{{ $t("no_pending_timesheet_task") }}</span></v-sheet
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import VueElementLoading from "vue-element-loading";
import Tabs from "vue-tabs-with-active-line";
import { CalendarPlugin } from "bootstrap-vue";

const TABS = [
  {
    title: "Leave Applied",
    value: "appliedleave",
  },
  {
    title: "Leave Approval",
    value: "leaveapproval",
  },
];
const TABS1 = [
  {
    title: "Leave Applied",
    value: "appliedleave",
  },
  {
    title: "Leave Approval",
    value: "leaveapproval",
  },
  {
    title: "Timesheet Approval",
    value: "timesheetapproval",
  },
];
export default {
  components: {
    VuePerfectScrollbar,
    Tabs,
    VueElementLoading,
  },
  data: () => ({
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    events: [],
    emp_pending_leave_pending: [],
    emp_timesheet_pending: [],
    emp_timesheet: [],
    emp_applied_leave: [],
    user: "",
    user_id: "",
    focus: "",
    tabs: TABS,
    tabs1: TABS1,
    currentTab: "appliedleave",
  }),
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.user_id = this.user.emp_id;
  },
  watch: {
    user_id: {
      immediate: true,
      handler() {
        if (this.user_id > 0) {
          this.fetchTeamEmpLeave();
          this.fetchEmpApprovalTimeSheet();
          this.fetchEmpAppliedLeave();
          this.fetchEmpPendingLeave();
        }
      },
    },
  },
  methods: {
    handleClick(newTab) {
      this.currentTab = newTab;
    },
    routetoviewAll(tab) {
      if (tab == "timesheetapproval") {
        this.$router.push({
          name: "timesheet_approval",
        });
      } else if (tab == "leaveapproval") {
        this.$router.push({
          name: "leave_approval",
        });
      }
    },
    fetchEmpPendingLeave() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_emp_pending_leave", {
          params: {
            manager_id: this.user_id,
          },
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.emp_pending_leave_pending = res.data.emp_pending_leave_pending;
            this.$emit("fetchpendingleaves", "true");
          } else if (res.data.status == "E") {
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
    fetchEmpAppliedLeave() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_emp_applied_leave", {
          params: {
            emp_id: this.user_id,
          },
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.emp_applied_leave = res.data.current_month_emp_applie_leave;
            this.$emit("fetchappliedleaves", "true");
          } else if (res.data.status == "E") {
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
    fetchEmpApprovalTimeSheet() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "emp_timesheet_pending", {
          params: {
            manager_id: this.user_id,
          },
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.emp_timesheet = [];
            this.emp_timesheet_pending = res.data.emp_timesheet_pending;

            for (var i = 0; i < this.emp_timesheet_pending.length; i++) {
              if (
                this.emp_timesheet_pending[i]
                  .emp_timesheet_status_details_count != 0
              ) {
                this.emp_timesheet.push(this.emp_timesheet_pending[i]);
              }
            }
            this.$emit("fetchpendingtasks", "true");
          } else if (res.data.status == "E") {
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
    fetchTeamEmpLeave() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_team_applied_leave", {
          params: {
            emp_id: this.user_id,
          },
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.team_applied_leave = res.data.team_applied_leave;
            for (let i = 0; i < this.team_applied_leave.length; i++) {
              this.events.push({
                name: this.team_applied_leave[i].employee_details.full_name,
                start: this.team_applied_leave[i].start_date,
                end: this.team_applied_leave[i].end_date,
                // leave_id: this.team_applied_leave[i].id
              });
            }
            this.$emit("fetchpempgroupleaves", "true");
          } else if (res.data.status == "E") {
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
.timesheetapprovalrow {
  height: 58px;
}

.timesheetapprovalprojectnamespan {
  font-size: 13px;
  font-weight: 500;
}

.approvalstableheadings {
  font-size: 11px;
}

.employeenameinapproval {
  font-size: 12px;
}

.employeenumberinapproval {
  font-size: 10px;
}

.dateinapprovaldiv {
  font-size: 12px;
  padding-top: 12px !important;
}

.badgechipinapproval {
  font-size: 8px;
  letter-spacing: 1pt;
  padding: 6px 7px;
}
.badgechipinappliedleave {
  font-size: 8px;
  letter-spacing: 1pt;
  padding: 6px 7px;
  min-width: 68px;
}

.tabs__item {
  font-size: 11px !important;
  font-weight: 500 !important;
}

.shadow-tabs {
  font-size: 12px !important;
  font-weight: 600 !important;
}

.tabs__item {
  /* padding: inherit !important; */
  margin-bottom: -6px !important;
}
.view_btn {
  position: absolute !important;
  top: 25px;
  right: 0px;
}
.leave-data-card{
  min-height: 383px;
}
.approval-tabs >>> .tabs__active-line.tab-item-line{
  height: 65% !important;
}
</style>