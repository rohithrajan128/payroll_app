<template>
  <div class="main-20">
    <div flat v-if=" $route.name=='leavehistory'" color="white"  class="row py-5 pl-5 align-items-center">
      <page-title class="col-md-7" :heading="$t('leave_history')" :google_icon="google_icon"></page-title>
    <div v-if=" $route.name=='leavehistory'" class="col-md-4" >
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-text-field
           dense
		       rounded-pill
           density="compact"
		       outlined
		       rounded
           small
            v-on="on"
            v-model="search"
            append-icon="search"
            label="Search"
            class="srch_bar"
            hide-details
          ></v-text-field>
        </template>
        <span>{{ $t("search") }}</span>
      </v-tooltip>
    </div>
    </div>
    <v-data-table
      :headers="headers"
      :items="applied_leaves"
      :loading="initval"
      :search="search"
    >
      <template v-slot:item="props">
        <tr>
          <td>
            <v-chip
              color="primary"
              small
              outlined
              medium
              class="leavedetailshoverchip"
              @click="opendialogDetails(props.item)"
            >{{ props.item.leavemasterdetails.leave_name }}</v-chip>
          </td>
          <td>{{ props.item.start_date | formatdateMonthyear }}</td>
          <td>{{ props.item.end_date | formatdateMonthyear }}</td>
          <td v-if="props.item.no_of_leaves.toString().length == 1">{{ props.item.no_of_leaves }}.0</td>
          <td v-else>{{ props.item.no_of_leaves }}</td>
          <td>{{ props.item.created_at | formatdateMonthyear }}</td>
          <td>{{ props.item.advance_leave_period }} Days</td>
          <td>
            <v-chip
              :color="props.item.status_color"
              small
              medium
              class="statusleavetd"
            >{{ props.item.status }}</v-chip>
          </td>
        </tr>
      </template>
    </v-data-table>

    <v-dialog width="900px" persistent v-model="leavehistorydialog">
      <v-card min-height="400px">
        <v-toolbar color="primary" dark>
          <span class="h4 pt-2">{{ $t('leave_history_details') }}</span>
          <v-spacer></v-spacer>
          <v-icon
            medium
            @click="leavehistorydialog = false"
            class="dialogcloseinuserdetails"
            >mdi-close</v-icon>
        </v-toolbar>

        <b-tabs class="pt-3" card>
          <b-tab title="Leave Details" active>
            <div min-height="250px" class="pt-2" style="position: relative;">
              <!-- {{ propsDetails.leavemasterdetails }} -->
              <div class="row pa-6">
                <div class="col-md-6">
                  <v-layout>
                    <v-flex md4 class="leavedetailstitle">
                      <span>{{ $t('leave_status') }}</span>
                    </v-flex>
                    <v-flex md8 class="leavedetailsbody">
                      <span>{{ propsDetails.status }}</span>
                    </v-flex>
                  </v-layout>

                  <v-layout>
                    <v-flex md4 class="leavedetailstitle">
                      <span>{{ $t('leave_type') }}</span>
                    </v-flex>
                    <v-flex md8 class="leavedetailsbody">
                      <span
                        v-if="propsDetails.leave_type != null"
                      >{{ propsDetails.leavemasterdetails.leave_name }}</span>
                    </v-flex>
                  </v-layout>

                  <v-layout>
                    <v-flex md4 class="leavedetailstitle">
                      <span>{{ $t('leave_details') }}</span>
                    </v-flex>
                    <v-flex md8 class="leavedetailsbody">
                      <span>{{ propsDetails.details }}</span>
                    </v-flex>
                  </v-layout>
                </div>
                <div class="col-md-6">
                  <v-layout>
                    <v-flex md4 class="leavedetailstitle">
                      <span>{{ $t('start_date') }}</span>
                    </v-flex>
                    <v-flex md4 class="leavedetailsbody">
                      <span>{{ propsDetails.start_date | formatDate }}</span>
                    </v-flex>
                    <v-flex md4 class="leavedetailsbody">
                      <span>{{ propsDetails.start_date_day_type }}</span>
                    </v-flex>
                  </v-layout>

                  <v-layout>
                    <v-flex md4 class="leavedetailstitle">
                      <span>{{ $t('end_date') }}</span>
                    </v-flex>
                    <v-flex md4 class="leavedetailsbody">
                      <span>{{ propsDetails.end_date | formatDate }}</span>
                    </v-flex>
                    <v-flex md4 class="leavedetailsbody">
                      <span>{{ propsDetails.end_date_day_type }}</span>
                    </v-flex>
                  </v-layout>

                  <v-layout>
                    <v-flex class="mt-2" md4>
                      <span class="leavedetailstitle">{{ $t('applied_by') }}</span>
                    </v-flex>
                    <v-flex md8 class="leavedetailsbody">
                      <span
                        v-if="propsDetails.emp_id != null"
                      >{{ propsDetails.empnamefetch.Full_Code }}</span>
                    </v-flex>
                  </v-layout>
                </div>
                <v-layout class="mt-2 mb-2" v-if="opencancelreason">
                  <v-flex md12 class="pl-5">
                    <v-textarea
                      outlined
                      class="required_field"
                      rows="2"
                      v-model="cancelLeave.cancel_reason"
                      v-bind:label="$t('reason_for_cancelling')"
                      ref="ROLfocus"
                      counter="500"
                      maxlength="500"
                    ></v-textarea>
                  </v-flex>
                </v-layout>
                <v-row
                  v-if="propsDetails.status != 'Cancelled' && propsDetails.status != 'Waiting'"
                >
                  <v-spacer></v-spacer>
                  <div class="cancelbuttoninleavehistory">
                    <v-btn
                      small
                      @click="showCancelLeave(propsDetails)"
                      class="mr-6"
                      color="small btn mr-4  hover_shine error"
                      :disabled="isBtnLoading"
                    >
                      {{ $t('cancel_leave') }}
                      <b-spinner small v-if="isBtnLoading"></b-spinner>
                    </v-btn>
                  </div>
                </v-row>
              </div>
            </div>
          </b-tab>
          <b-tab title="Leave Breakup" v-if="propsDetails.status !='Cancelled'">
            <div class="pl-6 pr-6 pt-3">
              <!-- <v-simple-table>
               <template v-slot:default>
                 <thead>
                   <tr>
                     <th class="text-left">{{ $t('leave_type') }}</th>
                     <th class="text-left">{{ $t('no_of_leaves') }}</th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr>
                     <td>-</td>
                     <td>-</td>
                   </tr>
                 </tbody>
               </template>
              </v-simple-table>-->
              <v-data-table
                :headers="leave_breakup_headers"
                class
                :items="leave_breakup_details"
                :hide-default-footer="true"
                :loading="initval"
              >
                <template v-slot:item="props">
                  <tr>
                    <td>{{ props.item.leave_type.leave_name }}</td>
                    <td>{{ props.item.no_of_leaves }}</td>
                    <td v-if="props.item.available_leaves">{{leaveAvailable(props.item.available_leaves.leave_taken)}}</td>
                  </tr>
                </template>
              </v-data-table>
            </div>
          </b-tab>
          <b-tab title="Cancel Details" v-if="propsDetails.status =='Cancelled'">
            <div class="pl-2 pr-2 pt-3">
              <v-layout>
                    <v-flex md12 class="leavedetailstitle">
                      <v-textarea
                      outlined
                      class=""
                      rows="2"
                      v-model="propsDetails.cancel_reason"
                      v-bind:label="$t('reason_for_cancelling')"
                      ref="ROLfocus"
                      readonly
                    ></v-textarea>
                    </v-flex>
                  </v-layout>
            </div>
          </b-tab>
          <!-- <b-tab title="Approval Details">
            <v-card min-height="250px" class="pt-2">
              <div class="pl-6 pr-6 pt-3">
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">{{ $t('approvers') }}</th>
                        <th class="text-left">{{ $t('status') }}</th>
                        <th class="text-left">{{ $t('date') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in propsDetails.fetchmatrixdetails" :key="item.name">
                        <td>{{ item.fetchhremployee.Full_Code }}</td>
                        <td>{{ item.APPROVE_STATUS }}</td>
                        <td>{{ item.updated_at | formatDate }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </div>
            </v-card>
          </b-tab> -->
          <b-tab title="Approval Details" v-if="propsDetails.status !='Cancelled'">
            <v-card min-height="250px" class="pt-2">
              <div class="pl-6 pr-6 pt-3">
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">{{ $t('approvers') }}</th>
                        <th class="text-left">{{ $t('status') }}</th>
                        <th class="text-left">{{ $t('date') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in propsDetails.fetchmatrixdetails" :key="item.name">
                        <td>{{ item.fetchhremployee.Full_Code }}</td>
                        <td>{{ item.approve_status }}</td>
                        <td>{{ item.updated_at | formatDate }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </div>
            </v-card>
          </b-tab>
          <b-tab title="Approval History">
            <v-card min-height="250px" class="pt-2">
              <div class="pl-6 pr-6 pt-3" style="position: relative;">
                <v-card-text class="py-2">
                  <v-timeline align-top dense>
                    <div v-for="(timeline, index) in leavehistorydetails" :key="index">
                      <v-timeline-item
                        color="teal lighten-3"
                        small
                        class="align-items-baseline timeline1 mt-3"
                      >
                        <v-card v-if="timeline.approve_status=='Applied'">
                          <v-row>
                            <v-col class="cols mx-5">
                              <div>
                                <strong>{{timeline.fullname}}</strong>- &nbsp;
                                <small>{{timeline.created_at |formatDateTime}}</small>
                              </div>
                              <div class="text-caption mt-2"> {{ $t('leave_applied_on') }}{{ timeline.created_at |formatDate }} </div>
                            </v-col>
                          </v-row>
                        </v-card>
                        <v-card v-if="timeline.approve_status=='Cancelled'">
                          <v-row>
                            <v-col class="cols mx-5">
                              <div>
                                <strong>{{timeline.fetchapprover.full_name}}</strong>- &nbsp;
                                <small>{{timeline.created_at |formatDateTime}}</small>
                              </div>
                              <div class="text-caption mt-2"> {{ $t('leave_cancelled_on') }}{{ timeline.created_at |formatDate }} </div>
                            </v-col>
                          </v-row>
                        </v-card>
                        <v-card v-if="timeline.approve_status=='Rejected'">
                          <v-row>
                            <v-col class="cols mx-5">
                              <div>
                                <strong>{{timeline.fetchapprover.full_name}}</strong>- &nbsp;
                                <small>{{timeline.created_at |formatDateTime}}</small>
                              </div>
                              <div class="text-caption mt-2"> {{ $t('leave_rejected_on') }}{{ timeline.created_at |formatDate }} </div>
                            </v-col>
                          </v-row>
                        </v-card>
                        <v-card v-if="timeline.approve_status=='Pending'">
                          <v-row>
                            <v-col class="cols mx-5">
                              <div>
                                <strong>{{timeline.fetchapplication.employee_details.firstname}} {{timeline.fetchapplication.employee_details.middlename}} {{timeline.fetchapplication.employee_details.lastname}}</strong>- &nbsp;
                                <small>{{timeline.created_at |formatDateTime}}</small>
                              </div>
                              <div class="text-caption mt-2"> {{ $t('leave_status_pending') }}</div>
                            </v-col>
                          </v-row>
                        </v-card>
                        <v-card v-if="timeline.approve_status=='Approved'">
                          <v-row>
                            <v-col class="cols mx-5">
                              <div>
                                <strong>{{timeline.fetchapprover.firstname}} {{timeline.fetchapprover.middlename}} {{timeline.fetchapprover.lastname}}</strong>
                                - &nbsp;
                                <small>{{timeline.created_at |formatDateTime}}</small>
                              </div>
                              <div class="text-caption mt-2"> {{ $t('leave_is_approved') }}</div>
                            </v-col>
                          </v-row>
                        </v-card>
                      </v-timeline-item>
                    </div>
                  </v-timeline>
                </v-card-text>
              </div>
            </v-card>
          </b-tab>
        </b-tabs>
        <ConfirmDialog :show="showCancelDialog" :cancel="cancelDialog" :confirm="confirmCancel" v-bind:title="$t('confirm')"
          v-bind:description="confirmation_cancel_message" />
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
export default {
  components: {
    PageTitle,
    ConfirmDialog
  },
  props:['search'],
  data: () => ({
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    google_icon: {
      icon_name: "history",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined"
    },
    search: "",
    leavehistorydialog: false,
    initval: false,
    user: "",
    user_id: "",
    isBtnLoading: false,
    confirmation_cancel_message: "",
    showCancelDialog: false,
    applied_leaves: [],
    leaveprops: [],
    leavehistorydetails: [],
    leave_breakup_details: [],
    propsDetails: [],
    opencancelreason: false,
    cancelLeave: {
      id: "",
      employee_id: "",
      cancel_reason: ""
    },
    leave_breakup_headers: [
      {
        text: "Leave Type",
        align: "left",
        value: "short_name"
      },
      {
        text: "No of Leaves",
        value: "asset_status_fetch.shortname"
      },
      {
        text: "Leaves Available",
        value: "asset_status_fetch.shortname"
      }
    ],
    headers: [
      {
        text: "Leave Type",
        align: "left",
        value: "leavemasterdetails.leave_name"
      },

      {
        text: "Start Date",
        value: "start_date",
        align: "left"
      },
      {
        text: "End Date",
        value: "end_date",
        align: "left"
      },
      {
        text: "No of Leave",
        value: "no_of_leaves",
        align: "left"
      },
      {
        text: "Leave Applied Date",
        value: "created_at",
        align: "left"
      },
      {
        text: "Advance Leave Period",
        value: "advance_leave_period",
        align: "left"
      },
      {
        text: "Status",
        value: "status",
        align: "left",
        sortable: false
      }
    ]
  }),
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.user_id = this.user.emp_id;
  },
  watch: {
    user_id: {
      immediate: true,
      handler() {
        if(this.user_id>0){
            this.fetchallleaves();
        }
      }
    }
  },

  methods: {
    leaveAvailable(leave_no){
     return Math.round(leave_no * 2) / 2;
    },
    fetchleaveHistory(leave_application_id) {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
          "fetchleavehistory/" +
          leave_application_id
        )
        .then(res => {
          this.leavehistorydetails = res.data.leavehistorydetails;
          this.leavehistorydetails.map(ele => {
            if (ele.approve_status == 'Pending') {
              let applied_data = {
                approve_status: 'Applied',
                created_at: ele.created_at,
                fullname: ele.fetchapplication.employee_details.firstname + " " + ele.fetchapplication.employee_details.middlename + " " + ele.fetchapplication.employee_details.lastname
              };
              this.leavehistorydetails = [
                ...this.leavehistorydetails, applied_data];
            }
          })


          this.initval = false;
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
    fetchleaveBreakup(leave_application_id,start_date) {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
          "fetchleavebreakup" , {
          params: {
            leave_application_id: leave_application_id,
            user_id:this.user_id,
            start_date:start_date
          },
        })
        .then(res => {
          this.leave_breakup_details = res.data.leave_breakup_details;
          this.initval = false;
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
    fetchallleaves() {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
          "fetchemployeeleaveshistory/" +
          this.user_id
        )
        .then(res => {
          if(res.data.status == 'S'){
             this.applied_leaves = res.data.pendingleaves;
          this.initval = false;
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
    },
    opendialogDetails(props) {
      this.propsDetails = [];
      this.propsDetails = props;
      this.initval = true;
      this.fetchleaveBreakup(props.id,props.start_date);
      this.fetchleaveHistory(props.id);
      setTimeout(() => {
        this.initval = false;
        this.leavehistorydialog = true;
      }, 600);
    },

    showCancelLeave(props) {
      this.opencancelreason = true;
      if (this.cancelLeave.cancel_reason == "") {
        setTimeout(() => {
          this.$refs.ROLfocus.focus();
        }, 40);
      }
      else{
       this.leaveprops = props;
      this.confirmation_cancel_message = this.$t('want_to_cancel_the_leave');
      this.showCancelDialog = true; 
      }
    },
    cancelDialog() {
      this.showCancelDialog = false;
      this.leaveprops = [];
    },
    confirmCancel() {
      this.showCancelDialog = false;
      this.cancelAppliedLeave(this.leaveprops);
    },

    cancelAppliedLeave(props) {
      this.cancelLeave.employee_id = props.emp_id;
      this.cancelLeave.id = props.id;
    //  this.opencancelreason = true;
        this.isBtnLoading = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "empcancelleaveafterstartdate",
            this.cancelLeave
          )
          .then(response => {
            if (response.data.status == "S") {
              this.flashMessage.success({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class"
              });
              this.cancelLeave.cancel_reason = "";
              this.isBtnLoading = false;
              this.opencancelreason = false;
              this.leavehistorydialog = false;
              this.leaveprops = [];
              this.fetchallleaves();
            }
          })
          .catch(err => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class"
            });
            console.log(err);
          });
    }

  }
};
</script>
<style scoped>
.leavedetailstitle {
  font-size: 13px;
  font-weight: 600;
  color: #726f6f;
  padding: 7px 9px;
}

.leavedetailsbody {
  font-size: 13px;
  font-weight: 500;
  color: rgba(22, 21, 21, 0.8);
  padding: 7px 9px;
}

.simbletabletimeline {
  position: absolute;
  left: -23%;
}

.cancelbuttoninleavehistory {
  position: absolute;
  bottom: 1px;
  right: 0px;
  margin-top: 20px;
}

.leavedetailshoverchip {
  min-width: 95px;
  display: block;
  text-align: center;
}
</style> 