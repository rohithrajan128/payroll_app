<template>
  <div class="main-20">
    <v-sheet class="pa-7">
      <page-title
        class="mb-3"
        :heading="
          leave_details.status == 'Waiting' ||
          leave_details.status == 'Cancelled'
            ? $t('leave_cancel_request')
            : $t('leave_application_request')
        "
        :google_icon="google_icon"
      ></page-title>

      <VueElementLoading
        :active="loader"
        spinner="bar-fade-scale"
        color="var(--primary)"
      />
      <v-form ref="form" v-model="valid">
        <div class="row">
          <div class="col-md-9">
            <div class="row">
              <div class="col-md-4">
                <div>{{ $t("leave_type") }}</div>
                <div class="values" v-if="leave_details.leave_type">
                  {{
                    all_leave_types.find(
                      (ele) => ele.id == leave_details.leave_type
                    )["leave_name"]
                  }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>

              <div class="col-md-4">
                <div>{{ $t("spl_leave") }}</div>
                <div class="values" v-if="leaveyesorno">{{ leaveyesorno }}</div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>

              <div class="col-md-4">
                <div>{{ $t("status") }}</div>
                <div class="values" v-if="leaveyesorno">
                  <v-chip
                    :color="
                      leave_details.status == 'Pending'
                        ? 'primary'
                        : leave_details.status == 'Cancelled'
                        ? 'warning'
                        : leave_details.status == 'Waiting'
                        ? 'warning'
                        : leave_details.status == 'Approved'
                        ? 'success'
                        : leave_details.status == 'LOP'
                        ? 'secondary'
                        : leave_details.status == 'Rejected'
                        ? 'error'
                        : ''
                    "
                    outlined
                    label
                    small
                    medium
                    class="statusleavetd leavedetailshoverchip"
                    >{{ leave_details.status }}</v-chip
                  >
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-4">
                <div>{{ $t("employee_name") }}</div>
                <div class="values" v-if="leave_details.emp_id != null">
                  {{ leave_details.empnamefetch.Full_Code }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>

              <div class="col-md-4">
                <div>{{ $t("alt_phone_no") }}</div>
                <div class="values" v-if="leave_details.alt_phone_no">
                  {{ leave_details.alt_phone_no }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
              <div class="col-md-4" v-if="isBereavementLeave">
                <div>{{ $t("relation_type") }}</div>
                <div class="values" v-if="leave_details.relation_type">
                  {{
                    relation_array.find(
                      (ele) => ele.id == leave_details.relation_type
                    )["longname"]
                  }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-4">
                <div>{{ $t("start_date") }}</div>
                <div
                  class="values"
                  v-if="formattedStartDate && leave_details.start_date_day_type"
                >
                  {{ formattedStartDate }} /
                  {{ leave_details.start_date_day_type }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>

              <div class="col-md-4">
                <div>{{ $t("end_date") }}</div>
                <div
                  class="values"
                  v-if="formattedEnddate && leave_details.end_date_day_type"
                >
                  {{ formattedEnddate }} / {{ leave_details.end_date_day_type }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
              <div class="col-md-4">
                <div>{{ $t("date_applied") }}</div>
                <div class="values" v-if="leave_details.applied_at">
                  {{ leave_details.applied_at }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-4">
                <div>{{ $t("no_of_days_applied") }}</div>
                <div class="values" v-if="leave_details.no_of_leaves">
                  {{ leave_details.no_of_leaves }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
              <div class="col-md-8">
                <div>{{ $t("reason_for_leave") }}</div>
                <div class="values" v-if="leave_details.details">
                  {{ leave_details.details }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
            </div>

            <div v-if="leave_details.status != 'Pending'" class="row">
              <div class="col-md-12">
                <div>{{ $t("approve_comments") }}</div>
                <div class="values" v-if="leave_matrix.approve_comments">
                  {{ leave_matrix.approve_comments }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
              <div v-if="leave_details.cancel_reason != null" class="col-md-12">
                <div>{{ $t("reason_for_cancelling") }}</div>
                <div class="values" v-if="leave_details.cancel_reason">
                  {{ leave_details.cancel_reason }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
              <div
                v-if="
                  user.hr_employee.emprole_name.includes('HR') &&
                  leave_details.hr_comments_leave_approval == 1 &&
                  leave_details.status != 'Waiting'
                "
                class="col-md-12"
              >
                <div>{{ $t("approve_comments_reject_leave") }}</div>
                <div
                  class="values"
                  v-if="leave_matrix.approve_comments_reject_leave"
                >
                  {{ leave_matrix.approve_comments_reject_leave }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
            </div>

            <!-- <v-layout>
              <v-flex xs12 md12 class="pr-12">
                <div class="row">
                  <div class="col-md-6 pr-6">
                    <v-text-field
                      v-bind:label="$t('spl_leave')"
                      v-model="leaveyesorno"
                      outlined
                      dense
                      readonly
                    ></v-text-field>
                  </div>
                  <div class="col-md-6 pl-6">
                    <v-text-field
                      v-model="leave_details.status"
                      v-bind:label="$t('status')"
                      outlined
                      dense
                      readonly
                    ></v-text-field>
                  </div>
                </div>
              </v-flex>
            </v-layout>-->
            <!-- <v-layout class="mt-2" v-if="!isBereavementLeave">
              <v-flex xs12 md6 class="pr-12">
                <v-text-field
                  v-model="leave_details.empnamefetch.Full_Code"
                  v-if="leave_details.emp_id != null"
                  v-bind:label="$t('employee_name')"
                  outlined
                  dense
                  readonly
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6 class="pr-12">
                <v-autocomplete
                  v-bind:label="$t('leave_type')"
                  outlined
                  dense
                  v-model="leave_details.leave_type"
                  :rules="fieldRules"
                  readonly
                  :items="all_leave_types"
                  item-text="leave_name"
                  item-value="id"
                ></v-autocomplete>
              </v-flex>
            </v-layout>-->
            <!-- <v-layout class="mt-2" v-else>
              <v-flex xs12 md6 class="pr-12">
                <v-text-field
                  v-model="leave_details.empnamefetch.Full_Code"
                  v-if="leave_details.emp_id != null"
                  v-bind:label="$t('employee_name')"
                  outlined
                  dense
                  readonly
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md3 class="pr-3">
                <v-autocomplete
                  v-bind:label="$t('leave_type')"
                  outlined
                  dense
                  v-model="leave_details.leave_type"
                  :rules="fieldRules"
                  readonly
                  :items="all_leave_types"
                  item-text="leave_name"
                  item-value="id"
                ></v-autocomplete>
              </v-flex>
              <v-flex xs12 md3 class="pr-12">
                <v-autocomplete
                  v-bind:label="$t('relation_type')"
                  outlined
                  dense
                  readonly
                  v-model="leave_details.relation_type"
                  v-if="isBereavementLeave"
                  :rules="fieldRules"
                  required
                  :items="relation_array"
                  item-text="shortname"
                  item-value="id"
                ></v-autocomplete>
              </v-flex>
            </v-layout>-->

            <!-- <v-layout class="mt-2">
              <v-flex xs12 md3 class="align-self-center">
                <v-text-field
                  v-model="formattedStartDate"
                  v-bind:label="$t('start_date')"
                  append-icon="mdi-calendar"
                  outlined
                  dense
                  readonly
                  :rules="fieldRules"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md3 class="pr-12 pl-3 align-self-center">
                <v-autocomplete
                  outlined
                  dense
                  required
                  readonly
                  v-model="leave_details.start_date_day_type"
                  :rules="fieldRules"
                  :items="day_type_array"
                  item-text="shortname"
                  item-value="shortname"
                ></v-autocomplete>
              </v-flex>
              <v-flex xs12 md3 class="align-self-center">
                <v-text-field
                  v-model="formattedEnddate"
                  v-bind:label="$t('end_date')"
                  append-icon="mdi-calendar"
                  outlined
                  dense
                  readonly
                  :rules="fieldRules"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md3 class="pr-12 pl-3 align-self-center">
                <v-autocomplete
                  outlined
                  dense
                  required
                  readonly
                  v-model="leave_details.end_date_day_type"
                  :rules="fieldRules"
                  :items="day_type_array"
                  item-text="shortname"
                  item-value="shortname"
                ></v-autocomplete>
              </v-flex>
            </v-layout>-->
            <!-- <v-layout class="mt-2">
              <v-flex xs12 md6 class="pr-12">
                <v-text-field
                  v-bind:label="$t('alt_phone_no')"
                  outlined
                  dense
                  required
                  v-model="leave_details.alt_phone_no"
                  maxlength="12"
                  readonly
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6 class="pr-12">
                <div class="row">
                  <div class="col-md-6">
                    <v-text-field
                      v-bind:label="$t('date_applied')"
                      v-model="leave_details.applied_at"
                      outlined
                      dense
                      readonly
                    ></v-text-field>
                  </div>
                  <div class="col-md-6">
                    <v-text-field
                      v-model="leave_details.no_of_leaves"
                      v-bind:label="$t('no_of_days_applied')"
                      outlined
                      dense
                      readonly
                    ></v-text-field>
                  </div>
                </div>
              </v-flex>
            </v-layout>-->

            <!-- <v-layout class="mt-2">
              <v-flex xs12 md12 class="pr-12">
                <v-text-field
                  outlined
                  v-bind:label="$t('reason_for_leave')"
                  v-model="leave_details.details"
                  :rules="fieldRules"
                  counter="500"
                  maxlength="500"
                  readonly
                >
                </v-text-field>
              </v-flex>
            </v-layout>-->
            <!-- @keyup="approvecommentstatuserror = false" -->
            <!-- :error="approvecommentstatuserror" -->
            <v-layout class="mt-2">
              <v-flex xs12 md12 class="pr-12">
                <v-textarea
                  outlined
                  rows="2"
                  v-if="leave_details.status == 'Pending'"
                  v-bind:label="$t('approve_comments')"
                  v-model="leave_matrix.approve_comments"
                  :rules="enableRules()"
                  ref="approvecommentstatuserror"
                  counter="500"
                  maxlength="500"
                ></v-textarea>
              </v-flex>
            </v-layout>
            <!-- <v-layout class="mt-2">
              <v-flex xs12 md12 class="pr-12" v-if="leave_details.cancel_reason != null">
                <v-textarea
                  outlined
                  rows="2"
                  v-bind:label="$t('reason_for_cancelling')"
                  v-model="leave_details.cancel_reason"
                  readonly
                  :rules="fieldRules"
                  counter="500"
                  maxlength="500"
                ></v-textarea>
              </v-flex>
            </v-layout> -->
            <!-- {{leave_details.hr_comments_leave_approval}} -->
            <v-layout
              class="mt-2"
              v-if="
                user.hr_employee.emprole_name.includes('HR') &&
                leave_details.hr_comments_leave_approval == 1 &&
                leave_details.status == 'Waiting'
              "
            >
              <v-flex xs12 md12 class="pr-12">
                <v-textarea
                  outlined
                  rows="3"
                  :error="approvecommentstatuserror"
                  :disabled="leave_details.status != 'Waiting'"
                  @keyup="approvecommentstatuserror = false"
                  v-bind:label="$t('approve_comments_reject_leave')"
                  v-model="leave_matrix.approve_comments_reject_leave"
                  :rules="fieldRules"
                  ref="approvecommentstatuserror"
                  counter="500"
                  maxlength="500"
                ></v-textarea>
              </v-flex>
            </v-layout>
          </div>
          <div class="col-md-3">
            <v-card>
              <v-app-bar
                color="teal-darken-4"
                height="40"
                class="approve_header"
              >
                <span class="approverheading ml-2">
                  {{ $t("approvers") }}
                </span>
              </v-app-bar>
              <v-list
                v-if="no_approver_message == ''"
                class="approversnamevcard"
              >
                <v-list-item
                  v-for="(approvers, index) in leave_details.matrixDetails"
                  :key="index"
                >
                  <div class="row pa-3" v-if="approvers.APPROVE_TYPE != 'HR'">
                    <div class="col-md-2 align-self-center">
                      <v-avatar size="40" class="text-center">
                        <v-img
                          v-if="approvers.fetchhremployee.profile_pic != null"
                          :src="
                            envImagePath + approvers.fetchhremployee.profile_pic
                          "
                          alt
                        ></v-img>
                        <img
                          v-else
                          width="42"
                          class="rounded-circle"
                          src="@/assets/images/default-user-profile-picture.png"
                          alt
                        />
                      </v-avatar>
                    </div>
                    <div class="col-md-10">
                      <v-list-item-title class="ml-5">
                        <v-layout class="vlayoutapprovestatusheading">
                          <v-flex md12>
                            <span v-if="leave_details.emp_id != null">{{
                              approvers.fetchhremployee.Full_Code
                            }}</span>
                          </v-flex>
                        </v-layout>
                        <v-layout class="vlayoutapprovestatusbody">
                          <v-flex
                            md12
                            v-if="approvers.APPROVE_STATUS == 'Pending'"
                            class="blue--text"
                            >{{ $t("not_yet_approved") }}</v-flex
                          >
                          <v-flex
                            md12
                            v-else
                            v-bind:class="[
                              approvers.APPROVE_STATUS == 'Approved'
                                ? 'green--text'
                                : 'red--text',
                            ]"
                            >{{ approvers.APPROVE_STATUS }}</v-flex
                          >
                        </v-layout>
                      </v-list-item-title>
                    </div>
                  </div>
                  <div
                    v-else
                    class="row ma-1"
                    v-bind:class="[
                      approvers.APPROVE_STATUS == 'Approved'
                        ? 'green--text'
                        : 'red--text',
                    ]"
                  >
                    <div class="col-md-2 align-self-center">
                      <v-avatar size="40" class="text-center">
                        <v-img
                          v-if="approvers.fetchhremployee.profile_pic != null"
                          :src="
                            envImagePath + approvers.fetchhremployee.profile_pic
                          "
                          alt
                        ></v-img>
                        <img
                          v-else
                          width="42"
                          class="rounded-circle"
                          src="@/assets/images/default-user-profile-picture.png"
                          alt
                        />
                      </v-avatar>
                    </div>
                    <div class="col-md-10">
                      <v-list-item-title class="ml-5">
                        <v-layout class="vlayoutapprovestatusheading">
                          <v-flex md12>
                            <span v-if="leave_details.emp_id != null"
                              >{{
                                approvers.fetchhremployee.Full_Code
                              }}
                              (HR)</span
                            >
                          </v-flex>
                        </v-layout>
                        <v-layout class="vlayoutapprovestatusbody">
                          <v-flex
                            md12
                            v-if="approvers.APPROVE_STATUS == 'Pending'"
                            >{{ $t("not_yet_approved") }}</v-flex
                          >
                          <v-flex md12 v-else>
                            {{ approvers.APPROVE_STATUS }}
                            <!-- {{ $t("on_behalf") }} -->
                          </v-flex>
                        </v-layout>
                      </v-list-item-title>
                    </div>
                  </div>
                </v-list-item>
              </v-list>
              <v-card v-else>
                <div class="noapprovermessagestyle">
                  {{ no_approver_message }}
                </div>
              </v-card>
            </v-card>
            <v-layout class="mt-6" v-if="leave_details.document != null">
              <v-flex xs12 md12>
                <div class="browsedivdoc">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        disabled
                        outlined
                        dense
                        prepend-inner-icon="mdi-file"
                        v-model="leave_details.document"
                        v-bind:label="$t('document')"
                      ></v-text-field>

                      <a
                        :href="envImagePath + leave_details.document"
                        class="text-primary f-13 a-underline"
                      >
                        <v-chip
                          label
                          class="browsebtndoc"
                          color="primary"
                          v-on="on"
                          >{{ $t("download") }}</v-chip
                        >
                      </a>
                    </template>
                    <span>{{ $t("download") }}</span>
                  </v-tooltip>
                </div>
              </v-flex>
            </v-layout>
            <div
              class="statusapprovingdiv"
              v-if="leave_details.status != 'Cancelled'"
            >
              <v-row
                class="mt-10 justify-center"
                v-if="leave_details.status != 'Waiting'"
              >
                <v-btn
                  small
                  color="btn  hover_shine success"
                  @click="statusapproving('APPROVE')"
                  :disabled="isBtnLoading || leave_details.status != 'Pending'"
                  min-width="190px"
                >
                  <b-spinner small v-if="spinnerbtn == 'APPROVE'"></b-spinner>
                  {{ $t("approve_leave") }}
                </v-btn>
              </v-row>
              <v-row
                class="mt-8 justify-center"
                v-if="leave_details.status != 'Waiting'"
              >
                <v-btn
                  small
                  color="btn  hover_shine secondary"
                  @click="statusapproving('LOP')"
                  :disabled="isBtnLoading || leave_details.status != 'Pending'"
                  min-width="190px"
                >
                  <b-spinner small v-if="spinnerbtn == 'LOP'"></b-spinner>
                  {{ $t("reject_&_mark_as_lop") }}
                </v-btn>
              </v-row>

              <v-row
                class="mt-8 justify-center"
                v-if="leave_details.status == 'Waiting'"
              >
                <v-btn
                  small
                  color="btn  hover_shine success"
                  @click="statusapproving('CANCEL')"
                  :disabled="isBtnLoading"
                  min-width="190px"
                >
                  <b-spinner small v-if="spinnerbtn == 'CANCEL'"></b-spinner>
                  {{ $t("approve_cancel") }}
                </v-btn>
              </v-row>
              <v-row class="mt-8 justify-center">
                <v-btn
                  small
                  color="btn  hover_shine error"
                  :disabled="
                    isBtnLoading ||
                    (leave_details.status != 'Pending' &&
                      leave_details.status != 'Waiting')
                  "
                  @click="statusapproving('REJECT')"
                  min-width="190px"
                >
                  <b-spinner small v-if="spinnerbtn == 'REJECT'"></b-spinner>
                  {{ $t("reject") }}
                </v-btn>
              </v-row>
            </div>
          </div>
        </div>
        <v-row class="mt-4">
          <v-spacer></v-spacer>
          <v-btn
            small
            color="btn mr-3 mb-3 mt-2 hover_shine cancel_button"
            @click="$router.go(-1)"
            >{{ $t("back") }}</v-btn
          >
        </v-row>
      </v-form>
    </v-sheet>
    <ConfirmDialog
      :show="showStatuschange"
      :cancel="cancelchange"
      :confirm="confirmChange"
      v-bind:title="$t('confirm')"
        :primary_delete="delete_primary"
      :description="description_change_message"
    />
  </div>
</template>
    
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import VueElementLoading from "vue-element-loading";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import moment from "moment";

export default {
  components: {
    PageTitle,
    ConfirmDialog,
    VueElementLoading,
  },
  data: () => ({
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    enable_rules: true,
    isBereavementLeave: false,
    showStatuschange: false,
    changed_status: "",
    description_change_message: "",
    isBtnLoading: false,
    specialLeave: 0,
    formattedEndDate: "",
    formattedStartDate: "",
    leaveyesorno: "",
    valid: true,
    loader: true,
    spinnerbtn: "",
    user: [],
    google_icon: {
      icon_name: "fact_check",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    all_leave_types: [],
    relation_array: [],
    day_type_array: [],
    no_approver_message: "",
    delete_primary:"",
    leave_details: {
      id: "",
      employee_id: "",
      relation_type: "",
      document: "",
      details: "",
      end_date_day_type: "Full Day",
      start_date_day_type: "Full Day",
      end_date: "",
      start_date: "",
      alt_phone_no: "",
      leave_type: "",
      special_leave: "",
      leavestatus: "New",
      cancel_reason: null,
    },
    leave_matrix: {
      leave_id: "",
      approve_comments: "",
      status: "",
      logged_user_id: "",
      leave_type: "",
      approve_comments_reject_leave: "",
    },
    approvecommentstatuserror: false,
    user: "",
    user_id: "",
    items: [
      { text: "Real-Time", icon: "mdi-clock" },
      { text: "Audience", icon: "mdi-account" },
      { text: "Conversions", icon: "mdi-flag" },
    ],
  }),
  created() {},
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },
  watch: {
    "$route.query.id": {
      immediate: true,
      handler() {
        if (this.$route.query.id) {
          this.fetchempleavebyemployeeid();
        }
      },
    },
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.user_id = this.user.emp_id;
    this.leave_matrix.logged_user_id = this.user_id;
    this.fetchleavetypes();
    this.fetchlookup();
  },
  methods: {
    enableRules() {
      if (this.enable_rules == false) {
        return [(v) => !!v || this.$t("field_required")];
      }
    },
    fetchlookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "RELATION_TYPE",
          },
        })
        .then((response) => {
          this.relation_array = response.data.lookup_details;
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
    },

    fetchempleavebyemployeeid() {
      // this.loader = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetchemployeeleaveforapproval/" +
            this.$route.query.id
        )
        .then((response) => {
          if (response.data.status == "S") {
            this.specialLeave = response.data.emp_data.special_leave;
            if (response.data.emp_data.special_leave == 1) {
              this.leaveyesorno = "Yes";
            } else {
              this.leaveyesorno = "No";
            }
            this.leave_details = response.data.emp_data;
            this.leave_matrix.leave_id = response.data.emp_data.id;
            this.leave_matrix.leave_type = this.leave_details.leave_type;
            if (response.data.leave_approval_matrix) {
              this.leave_matrix.approve_comments =
                response.data.leave_approval_matrix.APPROVER_COMMENTS;

              this.leave_matrix.approve_comments_reject_leave =
                response.data.leave_approval_matrix.approve_comments_reject_leave;
            }
           const is_hr_approved= this.leave_details.matrixDetails
        .filter(item => item.APPROVE_TYPE ==='HR')
        .length > 0;
        if(is_hr_approved>0){
          this.leave_details.matrixDetails=this.leave_details.matrixDetails.filter(item=>item.APPROVE_TYPE == 'HR');
        }
            this.dateconevreterenddate();
            this.dateconevreterstartdate();
            this.isBereavementLeave = response.data.leave;
            this.loader = false;
            if (response.data.emp_data.matrixDetails.length == 0) {
              this.no_approver_message =
                "Currently not working on any active projects";
            }
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

    dateconevreterstartdate() {
      var dateformat1 = new Date(this.leave_details.start_date);
      this.formattedStartDate =
        dateformat1.toLocaleString("default", { day: "2-digit" }) +
        "-" +
        dateformat1.toLocaleString("default", { month: "short" }) +
        "-" +
        dateformat1.getFullYear();
    },
    dateconevreterenddate() {
      var dateformat2 = new Date(this.leave_details.end_date);
      this.formattedEnddate =
        dateformat2.toLocaleString("default", { day: "2-digit" }) +
        "-" +
        dateformat2.toLocaleString("default", { month: "short" }) +
        "-" +
        dateformat2.getFullYear();
    },

    fetchleavetypes() {
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetchleavetypesfromleavemaster/" +
            this.user_id
        )
        .then((res) => {
          this.all_leave_types = res.data.data;
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
    statusapproving(status) {
      if (status == "REJECT") {

        var sts = "Reject";
      }
      if (status == "APPROVE") {
        var sts = "Approve";
      }
      if (status == "LOP") {
        var sts = "Reject and mark as LOP";
      }
      if (status == "CANCEL") {
        var sts = "Cancel";
      }
      if (
        status == "LOP" &&
        moment(new Date()).format("YYYY-MM-DD") < this.leave_details.start_date
      ) {
        this.description_change_message =
          "Leave is not yet availed by the employee";
   this.delete_primary = "Primary";
      } else {
        // alert( moment(new Date()).format("YYYY-MM-DD"));
        // alert(  moment(new Date()).format("YYYY-MM-DD") <= this.leave_details.start_date);
           this.delete_primary = "";
        this.description_change_message = "Do you want to " + sts + "?";
        this.changed_status = status;
      }

      if (
        (this.leave_matrix.approve_comments == null ||
          this.leave_matrix.approve_comments == "") &&
        status == "REJECT"
      ) {
        this.$refs.approvecommentstatuserror.focus();
        this.enable_rules = false;
        this.$refs.approvecommentstatuserror.blur();
      } else {
        this.enable_rules = true;
      }
      if (this.enable_rules == true) {
        this.showStatuschange = true;
      }
    },
    cancelchange() {
      this.changed_status = "";
      this.showStatuschange = false;
    },
    confirmChange() {
      this.showStatuschange = false;
      this.confirmstatusapproving(this.changed_status);
    },
    confirmstatusapproving(status) {
      this.leave_matrix.status = status;
      this.approvecommentstatuserror = false;
      if (status === "REJECT") {
        if (this.leave_matrix.approve_comments == "") {
          this.approvecommentstatuserror = true;
          this.$refs.approvecommentstatuserror.focus();
          return;
        }
      }
      this.isBtnLoading = true;
      this.spinnerbtn = status;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "empleavestatusapproving",
          this.leave_matrix
        )
        .then((response) => {
          if (response.data.status == "S") {
            this.flashMessage.success({
              message: response.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.isBtnLoading = false;
            this.spinnerbtn = "";
            this.description_change_message = "";
            this.changed_status = "";
            this.fetchempleavebyemployeeid();
            // this.$router.push({
            //     name: "leave_approval",
            // });
          }
          if (response.data.status == "CHANGED") {
            this.flashMessage.error({
              message: response.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.isBtnLoading = false;
            this.spinnerbtn = "";
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          this.isBtnLoading = false;
          this.spinnerbtn = "";
          console.log(err);
        });
    },
  },
};
</script>
<style scoped>
.radio-item /deep/ .v-input--radio-group__input {
  flex-direction: row;
  align-self: center;
}

.radio-item /deep/ .v-label {
  margin-bottom: 0px !important;
}

.radio_items {
  margin-bottom: 0px !important;
  padding-left: 13px;
  padding-right: 13px;
}

.optiontextstyle {
  font-size: 14px;
  font-weight: 600;
  padding-bottom: 10px;
  color: rgb(81, 75, 75);
}

.browsedivdoc {
  display: inline-flex;
  width: 100%;
  position: relative;
}

.browsedivdoc /deep/ .v-chip {
  border-radius: 0%;
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

.documentdeleteapplyleave {
  position: absolute;
  left: -22px;
  top: 9px;
  cursor: pointer;
}

.vlayoutapprovestatusheading {
  font-size: 14px;
  font-weight: 600;
}

.vlayoutapprovestatusbody {
  font-size: 13px;
  font-weight: 400;
  margin-top: 5px;
}

.approverheading {
  font-weight: 700;
  font-size: 18px;
  color: #303134;
  /* margin-left: 13px; */
  /* font-family: math; */
}

.browsebtndoc {
  margin-left: 5px;
  min-height: 39px;
}

.noapprovermessagestyle {
  font-weight: 500;
  font-size: 14px;
  padding: 16px;
  color: #916161;
}

.statusapprovingdiv {
  margin-top: 5%;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
}

.approversnamevcard {
  max-height: 300px;
  overflow-y: auto;
}
.values {
  font-weight: bold;
  font-size: 14px;
}
</style>
  