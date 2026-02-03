<template>
  <div class="container-fluid mt-3 p-0">
    <div class="row card-header">
      <div class="col-md-10 col-lg-10">
        <div class="row pt-2 justify-space-between">
          <div class="d-flex p-3">
            <div>
              <div v-if="recruitment_details.candidate_gender == 'Male'">
                <img
                  src="@/assets/images/male_icon.jpg"
                  height="59"
                  class="icon_radius"
                />
                <div class="gender-font">
                  {{ $t("male") }}
                </div>
              </div>
              <div v-else-if="recruitment_details.candidate_gender == 'Female'">
                <img
                  src="@/assets/images/female_icon.jpg"
                  height="59"
                  class="icon_radius"
                />
                <div class="gender-font">
                  {{ $t("female") }}
                </div>
              </div>
              <div v-else>
                <i
                  class="fa fa-venus-mars"
                  style="font-size: 22px; font-weight: bold"
                ></i>
              </div>
            </div>
            <div class="card-header-tab ml-3">
              <div class="candidate_name_color">
                <span v-if="recruitment_details.salutation">
                  {{ recruitment_details.salutation }}
                </span>
                {{ recruitment_details.name }}
              </div>

              <div class="phone-align">
                <span>
                  <v-icon small> mdi-gmail </v-icon>
                </span>
                <span class="ml-1">
                  {{ recruitment_details.email }}
                </span>
              </div>
                 <div class="phone-align mt-1">
                   <span>
                  <v-icon small> mdi-phone </v-icon>
                </span>
                <span>
                + {{ recruitment_details.country_code }}
                {{ recruitment_details.mobile }}
                </span>
              </div>
            </div>
          </div>

          <div class="d-flex ml-1 align-items-center">
            <div class="notice_period_font font-weight-bold">
              {{ $t("notice_period") }}
              <div class="margin_top_px">
                {{ $t("experience") }}
              </div>
            </div>
            <div>
              <div
                class="notice_period_font ml-1"
                style="font-weight: normal"
                v-if="recruitment_details.notice_period"
              >
                : &nbsp;{{ recruitment_details.notice_period }}
              </div>

              <div
                v-else
                style="font-size: 11px; padding-bottom: 5px; align-self: center"
              >
                :&nbsp;-
              </div>
              <div class="margin_top_px">
                <span
                  v-if="recruitment_details.total_experience_year > 0"
                  class="notice_period_font ml-1"
                  style="font-weight: normal"
                >
                  : &nbsp;{{ recruitment_details.total_experience_year }}.
                  {{ recruitment_details.total_experience_months }}
                </span>
                <span
                  v-else
                  class="notice_period_font ml-1"
                  style="font-weight: normal"
                  >:&nbsp; {{ $t("fresher") }}</span
                >
                <span> </span>
              </div>
            </div>
          </div>

          <div class="d-flex align-items-center">
            <div class="notice_period_font font-weight-bold">
              {{ $t("current_CTC") }}&nbsp;
              <div class="margin_top_px">{{ $t("expected_CTC") }}&nbsp;</div>
            </div>
            <div>
              <div
                class="notice_period_font ml-1"
                style="font-weight: normal"
                v-if="recruitment_details.current_ctc"
              >
                :&nbsp;{{ recruitment_details.current_ctc }}
              </div>
              <div
                v-else
                style="font-size: 11px; padding-bottom: 5px; align-self: center"
              >
                :&nbsp;-
              </div>
              <div
                class="notice_period_font ml-1 margin_top_px"
                style="font-weight: normal"
                v-if="recruitment_details.expected_ctc"
              >
                :&nbsp;{{ recruitment_details.expected_ctc }}
              </div>
              <div
                v-else
                style="font-size: 11px; padding-bottom: 5px; align-self: center"
              >
                :&nbsp;-
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-2 col-lg-2 ">
        <div class="row  justify-content-end pt-3">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                v-on="on"
                class="mr-1 pb-2"
                color="primary"
                @click="openDialogReminder()"
                >mdi-alarm</v-icon
              >
            </template>
            <span>{{ $t("reminder") }}</span>
          </v-tooltip>

          <router-link
            :to="{
              name: 'candidate_recruitment_amend',
              query: {
                slug: recruitment_details.slug,
              },
            }"
          >
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  medium
                  color="primary"
                  dark
                  v-on="on"
                  class="vicon_llink mr-1 pb-2"
                >
                  mdi-pencil-circle
                </v-icon>
              </template>
              <span>{{ $t("edit") }}</span>
            </v-tooltip>
          </router-link>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                v-on="on"
                class="mr-5 pb-2"
                color="primary"
                @click="openDialog(false)"
                >mdi-calendar-clock</v-icon
              >
            </template>
            <span>{{ $t("schedule_interview") }}</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div v-on="on" class="d-inline-block mr-2">
                <v-btn
                  v-on="on"
                  small
                  @click="previousPage('candidate_details')"
                  class="font-weight-bold cancel-btn"
                  color="dark cancel_button"
                  >{{ $t("back") }}</v-btn
                >
              </div>
            </template>
            <span>{{ $t("back") }}</span>
          </v-tooltip>
        </div>
      </div>
    </div>
    <div class="mb-3 mx-auto">
      <VueElementLoading
        :active="loader_main"
        spinner="bar-fade-scale"
        color="var(--primary)"
      />
      <div class="px-0">
        <div class="row">
          <v-card class="col-md-9" style="margin-top: 13px">
            <Tabs
              :tabs="tabs"
              :currentTab="currentTab"
              :wrapper-class="'shadow-tabs inline-tabs align-self-center'"
              :tab-class="'tab-item'"
              :tab-active-class="'tab-item-active'"
              :line-class="'tab-item-line'"
              @onClick="handleClick"
            />

            <div v-if="currentTab == 'candidate_details'">
              <CandidateDetails :recruitment_details="recruitment_details" />
            </div>

            <div v-if="currentTab == 'interviews'" class="px-5">
              <CandidateInterview
                :interviwe_details="recruitment_details.fetch_interview_details"
                :interviews_array="interviews_array"
                @updatedData="updatedData"
              />
            </div>

            <div
              v-if="currentTab == 'interview_timeline'"
              class="row col-md-12 px-5"
            >
              <v-card
                min-height="300px"
                width="100%"
                class="pt-2"
                style="box-shadow: 0px 0px; margin-top: 10px"
              >
                <!-- {{candidate_timeline.length}} -->
                <div
                  class="text-center mt-5"
                  v-if="!candidate_timeline.length > 0"
                >
                  {{ $t("no_data_found") }}
                </div>
                <div
                  class="pl-6 pr-6 pt-3 timeline_container"
                  v-if="candidate_timeline && candidate_timeline.length > 0"
                >
                  <v-card-text class="py-2">
                    <v-timeline align-top dense>
                      <div
                        v-for="(timeline, index) in candidate_timeline"
                        :key="index"
                      >
                        <v-timeline-item
                          color="teal lighten-3"
                          small
                          class="align-items-baseline timeline1 mt-3"
                        >
                          <v-card
                            v-if="timeline.candidate_recruitment_status == null"
                          >
                            <v-row>
                              <v-col class="cols mx-5">
                                <strong>
                                  {{
                                    timeline.fetch_created_by_details.Full_Code
                                  }}
                                </strong>
                                {{ $t("created_candidate_at") }}
                                {{ timeline.created_at | formatDateTime }}
                              </v-col>
                            </v-row>
                          </v-card>
                          <v-card v-else>
                            <v-row>
                              <v-col class="cols mx-5">
                                <div>
                                  <strong
                                    v-if="
                                      timeline.fetch_schedule_interview_details &&
                                      timeline.fetch_schedule_interview_details
                                        .fetch_interview_name
                                    "
                                  >
                                    {{ $t("interviewer") }}:
                                    {{
                                      timeline.fetch_schedule_interview_details
                                        .fetch_interview_name.Full_Code
                                    }}
                                  </strong>
                                  <span
                                    v-if="
                                      timeline.fetch_schedule_interview_details
                                    "
                                    >@{{
                                      timeline.fetch_schedule_interview_details
                                        .interview_date | formatDate
                                    }}
                                    {{
                                      timeline.fetch_schedule_interview_details
                                        .interview_time
                                    }}
                                    &nbsp;
                                  </span>
                                </div>

                                <div
                                  class="text-caption mt-2"
                                  v-if="
                                    timeline.fetch_schedule_interview_details !=
                                    null
                                  "
                                >
                                  <strong>{{ $t("interview_type") }}:</strong>
                                  {{
                                    timeline.fetch_schedule_interview_details
                                      .interview_type
                                  }}
                                  <strong class="ml-2"
                                    >{{ $t("interview_status") }}:</strong
                                  >
                                  <v-chip
                                    x-small
                                    :input-value="selected"
                                    @click="select"
                                    color="primary"
                                    class="ma-1"
                                    >{{
                                      timeline.candidate_recruitment_status
                                    }}</v-chip
                                  >
                                  {{ $t("by") }}
                                  {{
                                    timeline.fetch_created_by_details.Full_Code
                                  }}
                                </div>
                              </v-col>
                            </v-row>
                          </v-card>
                        </v-timeline-item>
                      </div>
                    </v-timeline>
                  </v-card-text>
                </div>
              </v-card>
            </div>
            <div v-if="currentTab == 'documents'">
              <CandidateDoc :recruitment_details="recruitment_details" />
            </div>
          </v-card>
          <div class="col-md-3 pt-4">
            <div class="card notes-card">
              <p class="ml-2 mb-2">
                <i class="lnr lnr-book"></i>&nbsp;Comments
              </p>
              <CreateNotes :candidate_id="recruitment_details['id']" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-dialog
      persistent
      v-model="reminder_dialog"
      small
      transition="dialog-bottom-transition"
      max-width="950px"
    >
      <v-card class="container" style="padding: 0px !important">
        <v-toolbar color="primary" dark>
          <span class="headline">{{ $t("candiate_reminder") }}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon @click="close" class="dialogcloseinuserdetails" v-on="on"
                >mdi-close</v-icon
              >
            </template>
            <span>{{ $t("close") }}</span>
          </v-tooltip>
        </v-toolbar>
        <v-form ref="reminder_ref" v-model="valid_reminder" class="px-4">
          <v-layout>
            <v-flex xs12 md6 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="reminder.title"
                    v-bind:label="$t('title')"
                    required
                    dense
                    maxlength="50"
                    counter
                    :rules="fieldRules"
                    class="required_field mt-4"
                    outlined
                  ></v-text-field>
                </template>
                <span>{{ $t("title") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md3 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <DatePicker
                    :label="$t('reminder_date')"
                    :min="new Date().toISOString().substr(0, 10)"
                    :stored_date="reminder.remainder_date"
                    @formatted_date="formatted_reminder_date"
                    dense
                    :class_required="'RequiredField'"
                    class="mt-4"
                    v-on="on"
                  />
                </template>
                <span>{{ $t("reminder_date") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md3 pl-2>
              <v-menu
                ref="menu"
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="time"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="reminder.remainder_time"
                    :label="$t('remainder_time')"
                    append-icon="mdi-clock-outline"
                    dense
                    class="required_field time_class mt-4"
                    :rules="fieldRules"
                    required
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="menu2"
                  v-model="reminder.remainder_time"
                  full-width
                  @click:minute="$refs.menu.save(reminder.remainder_time)"
                ></v-time-picker>
              </v-menu>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12 sm6 md12 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-textarea
                    v-on="on"
                    v-model="reminder.description"
                    :rules="fieldRules"
                    maxlength="200"
                    counter="200"
                    v-bind:label="$t('descritpion')"
                    class="required_field pr-2"
                    outlined
                    rows="2"
                    dense
                  ></v-textarea>
                </template>
                <span>{{ $t("descritpion") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </v-form>
        <v-card-actions class="container">
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div v-on="on" class="d-inline-block mr-2">
                <v-btn
                  v-on="on"
                  small
                  @click="close"
                  class="mb-3 font-weight-bold cancel-btn"
                  color="btn hover_shine cancel_button"
                  >{{ $t("cancel") }}</v-btn
                >
              </div>
            </template>
            <span>{{ $t("cancel") }}</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                @click="saveReminder()"
                small
                class="mr-2 success hover_shine mb-3"
                color="green darken-1"
                :disabled="submit_btn_disable"
              >
                {{ $t("submit") }}
                <b-spinner
                  :disabled="isreminderBtnLoading"
                  small
                  v-if="isreminderBtnLoading"
                ></b-spinner>
              </v-btn>
            </template>
            <span>{{ $t("submit") }}</span>
          </v-tooltip>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div>
      <ScheduleInterview
        :schedule_dialog="schedule_dialog"
        :edit_schedule_interview="edit_schedule_interview"
        :schedule_interview_slug="schedule_interview_slug"
        @scheduleDialog="scheduleDialog"
        :candidate_name="recruitment_details.name"
        :candidate_id="recruitment_details.id"
        @tabUpdates="tabUpdates"
      />
    </div>
    <ConfirmDialog
      :show="showStatuschange"
      :cancel="cancelchange"
      :confirm="confirmChange"
      v-bind:title="$t('confirm')"
      :description="$t('interview_status_change')"
    />
  </div>
</template>

<script>
import CandidateDoc from "./CandidateDocument.vue";
import VueElementLoading from "vue-element-loading";
import DocumentSelect from "../Components/Upload/DocumentSelect.vue";
import ScheduleInterview from "../Interviews/ScheduleInterview.vue";
import CandidateInterview from "./CandidateInterview.vue";
import Tabs from "vue-tabs-with-active-line";
import CreateNotes from "../Components/CreateNotes.vue";
import CandidateDetails from "./CandidateDetails.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import DatePicker from "../Components/DatePicker.vue";

const TABS = [
  {
    title: "Candidate Details",
    value: "candidate_details",
  },
  {
    title: "Interviews",
    value: "interviews",
  },
  {
    title: "Interview Timeline",
    value: "interview_timeline",
  },
  {
    title: "Documents",
    value: "documents",
  },
];
export default {
  components: {
    VueElementLoading,
    DocumentSelect,
    Tabs,
    CandidateDoc,
    CandidateDetails,
    CreateNotes,
    CandidateInterview,
    ConfirmDialog,
    DatePicker,
    ScheduleInterview,
  },
  data: () => ({
    menu2: false,
    tabs: TABS,
    valid_reminder: true,
    currentTab: "candidate_details",
    valid: true,
    loader_main: false,
    loader: false,
    more_datiails: false,
    document_url: process.env.VUE_APP_IMAGE_PATH,
    isBtnLoading: false,
    isDisabled: false,
    openMedia: false,
    candidate_timeline: [],
    initval: false,
    showStatuschange: false,
    interviews_array: [],
    reminder_dialog: false,
    isreminderBtnLoading: false,
    submit_btn_disable: false,

    time: null,
    recruitment_details: {
      id: 0,
      name: "",
      email: "",
      mobile: "",
      position_applied_for: "",
      candidate_job: "",
      candidate_skills: "",
      current_company: "",
      current_location: "",
      total_experience: "",
      relevant_experience: "",
      current_ctc: "",
      expected_ctc: "",
      notice_period: "",
      willing_to_travel: "",
      passport_expiry: "",
      candidate_queries: "",
      filename: "",
      file_url: "",
      status: "",
    },
    reminder: {
      candidate_id: null,
      title: "",
      description: "",
      remainder_date: "",
      remainder_time: "",
      status: 1,
    },
    schedule_dialog: false,
    edit_schedule_interview: false,
    schedule_interview_slug: false,
    enable_document_select: "",
    passportExpiryItems: [],
    willtotravelItems: [],
    noticeperiodItems: [],
    postionappliedforItems: [],
    candidatejobItems: [],
    search: "",
    interview_status: "",
    interview_id: "",
    previous_item: "",
  }),

  computed: {
    headers() {
      return [
        {
          text: this.$t("job_title"),
          align: "left",
          sortable: true,
          value: "job_title",
          width: "18%",
        },
        {
          text: this.$t("interview_type"),
          value: "description",
          sortable: true,
          width: "20%",
        },
        {
          text: this.$t("candidate_name"),
          sortable: true,
          value: "no_of_vacancies",
        },
        {
          text: this.$t("interviewer"),
          sortable: true,
          value: "no_of_vacancies",
        },
        {
          text: this.$t("interview_date"),
          sortable: true,
          value: "no_of_vacancies",
        },
        {
          text: "Status",
          align: "center",
          value: "status",
          width: "20%",
        },
        {
          text: "Actions",
          value: "name",
          align: "center",
          sortable: false,
        },
      ];
    },
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    emailRules() {
      return [
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          this.$t("email_valid"),
      ];
    },
    numberRules() {
      return [(v) => !!v || this.$t("valid_number_required")];
    },
    phoneRules() {
      return [(v) => !v || v.length >= 10 || this.$t("valid_number_required")];
    },
  },

  created() {
    this.fetchLookups();
    this.$eventBus.$on("updated_candidate_details", () => {
      this.fetchCandidateDetails();
    });
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader_main = true;
          this.fetchCandidateDetails();
        }
      },
    },
  },

  methods: {
    updatedData(status){
this.fetchCandidateDetails();
    },
    tabUpdates(data) {
      this.fetchCandidateDetails();
      console.log(data);
      this.currentTab = "interviews";
    },
    scheduleDialog(dialog_value) {
      this.schedule_dialog = dialog_value;
    },
    openDialog(edit, slug) {
      this.edit_schedule_interview = edit;
      this.schedule_interview_slug = slug;
      this.schedule_dialog = true;
    },
    formatted_reminder_date(formatted_date) {
      this.reminder.remainder_date = formatted_date;
    },
    fetchCandidateDetails() {
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "view_candidate_details?slug=" +
            this.$route.query.slug
        )
        .then((res) => {
          this.btnloading = false;
          if (res.data.status == "S") {
            this.loader_main = false;
            this.message = res.data.message;
            this.recruitment_details = res.data.candidate_details;
            this.fetchInterviewTimeline(res.data.candidate_details.id);
          } else if (res.data.status == "E") {
            this.loader_main = false;
            this.message = res.data.message;
          }
        })
        .catch((err) => {
          this.isDisabled = false;
          console.log("this error" + err);
        });
    },
    saveReminder() {
      if (this.$refs.reminder_ref.validate()) {
        this.submit_btn_disable = true;
        this.isreminderBtnLoading = true;
        this.reminder.candidate_id = this.recruitment_details.id;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "create_reminder",
            this.reminder
          )
          .then((response) => {
            if (response.data.status == "S") {
              this.flashMessage.success({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.submit_btn_disable = false;
              this.isreminderBtnLoading = false;

              this.close();
              this.fetchCandidateDetails();
            }
            if (response.data.status == "E") {
              this.submit_btn_disable = false;
              this.isreminderBtnLoading = false;

              // this.close();
              // this.fetchDetails();
            }
          })
          .catch((err) => {
            this.submit_btn_disable = false;
            this.isreminderBtnLoading = false;
            console.log(err);
            this.close();
          });
      }
    },
    close() {
      this.reminder_dialog = false;
      this.reminder.candidate_id = null;
      this.reminder.title = "";
      this.reminder.description = "";
      this.reminder.remainder_date = "";
      this.reminder.remainder_time = "";
      this.reminder.status = "";
    },
    openDialogReminder() {
      setTimeout(() => {
        this.reminder_dialog = true;
      }, 300);
      if (this.recruitment_details.fetch_candidate_reminder != null) {
        this.reminder = this.recruitment_details.fetch_candidate_reminder;
      }
      // } else {
      //   alert("ASdsa")
      //   this.reminder = "";
      // }
    },
    previousPage(page_details) {
      // this.$router.push({
      //   name: "recruitment",
      //   params: {
      //     page_details: page_details,
      //   },
      // });
      this.$router.go(-1);
    },
    previousItem(previous_item) {
      this.previous_item = previous_item;
    },
    cancelchange() {
      this.showStatuschange = false;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "view_candidate_details?slug=" +
            this.$route.query.slug
        )
        .then((res) => {
          this.btnloading = false;
          if (res.data.status == "S") {
            this.loader_main = false;
            this.message = res.data.message;
            this.recruitment_details = res.data.candidate_details;
            this.fetchInterviewTimeline(res.data.candidate_details.id);
          } else if (res.data.status == "E") {
            this.loader_main = false;
            this.message = res.data.message;
          }
        })
        .catch((err) => {
          this.isDisabled = false;
          console.log("this error" + err);
        });
    },
   
    fetchLookups() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "INTERVIEW_STATUS",
          },
        })
        .then((response) => {
          this.interviews_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetchInterviewTimeline(candidate_id) {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_candidate_timeline", {
          params: {
            candidate_id: candidate_id,
          },
        })
        .then((res) => {
          console.log("object");
          this.candidate_timeline = res.data.candidate_details;
          this.initval = false;
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
    handleClick(newTab) {
      this.currentTab = newTab;
    },
    uploadedDocument(file_path) {
      this.loader = true;
      this.recruitment_details.file_url = file_path;
      this.closeDocumentSelectDialog();
    },
    uploadedDocumentName(file_name) {
      this.recruitment_details.filename = file_name;
    },
    closeDocumentSelectDialog(uploadtype) {
      this.enable_document_select = "";
      console.log("close dialog", uploadtype);
      this.loader = false;
    },
    callDocumentSelect() {
      this.enable_document_select = "DragDrop";
    },

    fetchlookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "PASSPORT EXPIRY",
          },
        })
        .then((response) => {
          this.passportExpiryItems = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "WILLINGNESS TO TRAVEL",
          },
        })
        .then((response) => {
          this.willtotravelItems = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "NOTICE PERIOD",
          },
        })
        .then((response) => {
          this.noticeperiodItems = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "POSITION APPLIED FOR",
          },
        })
        .then((response) => {
          this.postionappliedforItems = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    saveRecruitment() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "create_candidate_details",
            this.recruitment_details
          )
          .then((res) => {
            if (Array.isArray(res.data.message)) {
              this.array_data = res.data.message.toString();
            } else {
              this.array_data = res.data.message;
            }
            if (res.data.status == "S") {
              this.flashMessage.success({
                message: this.array_data,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.message = res.data.message;
              this.$router.push({
                name: "candidate_recruitment",
              });
            } else if (res.data.status == "E") {
              this.isBtnLoading = false;
              (this.isDisabled = false),
                this.flashMessage.error({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class",
                });
              this.clear();
            } else {
              this.isBtnLoading = false;
              this.flashMessage.error({
                message: this.array_data,
              });
              this.clear();
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
            console.log("this error" + err);
          });
      }
    },

    clear() {
      this.$refs.form.reset();
    },

    isNumber(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      }
      return true;
    },
  },
};
</script>
<style scoped>
.browsedivdoc {
  display: inline-flex;
  width: 100%;
  position: relative;
}

.browsedivdoc /deep/ .v-chip {
  border-radius: 0%;
}

.browsedivdoc /deep/ .v-text-field__details {
  display: none;
}

.browsebtndoc {
  height: 40px;
  margin-left: -10%;
  /* margin-top: 30px; */
}

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

.icon_size_download {
  font-size: 22px !important;
}

.timeline_container {
  position: relative !important;
}

/* .candidate_details {
  max-height: 300px;
} */
.notes_margin {
  margin-left: -11px;
}

.card_header_margin {
  margin: 1px;
}

.email_margin {
  margin-top: 1px;
}

.card_font {
  color: #373737 !important;
  font-size: -0.06rem;
  text-transform: none !important;
  font-weight: normal;
}

.icon_mobile_font {
  font-size: 22px;
}

.notice_period_font {
  font-size: 14px;
  text-transform: none;
  color: black;
}

.candidate_name_color {
  color: #2e81d4;
  text-transform: capitalize;
  font-size: 17px;
}

.schedule_margin {
  margin-left: -5px;
}

.cancel_margin {
  margin-left: -6px;
}
.icon_radius {
  border-radius: 40px;
}
.card-header {
  height: 120px !important;
}
.gender-font {
  font-size: 14px;
  text-align: center;
  text-transform: capitalize;
}
.phone-color {
  color: #1671cd;
}
.phone-align {
  font-size: 13px;
  color: black;
  font-weight: 600;
  margin-top: 2px;
  text-transform: none !important;
}
.margin_top_px{
  margin-top:1px
}
</style>
