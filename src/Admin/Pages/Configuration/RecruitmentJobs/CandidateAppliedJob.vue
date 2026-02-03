<template>
  <div>
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title
        class="col-md-4"
        :heading="job_details.job_title"
        :google_icon="google_icon"
      ></page-title>
      <div class="col-md-6">
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
              @keyup="searchData(search)"
            ></v-text-field>
          </template>
          <span>{{ $t("search") }}</span>
        </v-tooltip>
      </div>
      <div class="col-md-2 d-flex justify-content-end">
        <div
          class="mt-1"
          v-if="
            job_details.job_status == 'Active' &&
            currentTab != 'interview_scheduled'
          "
        >
          <v-btn
            small
            color=" btn hover_shine add_new"
            @click="candidateDialogue"
          >
            {{ $t("assign_candidate") }}
          </v-btn>
        </div>
        <div
          v-if="
            currentTab == 'interview_scheduled' &&
            job_details.job_status == 'Active'
          "
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                color=" btn hover_shine add_new"
                small
                class="mt-1"
                v-on="on"
                @click="openDialog"
                >{{ $t("schedule_interview") }}</v-btn
              >
            </template>
            <span>{{ $t("schedule_interview") }}</span>
          </v-tooltip>
        </div>
        <v-dialog
          persistent
          v-model="assign_candidate_dialogue"
          small
          transition="dialog-bottom-transition"
          max-width="700px"
        >
          <v-card class="container" style="padding: 0px !important">
            <v-toolbar color="primary" dark>
              <span class="headline">{{ $t("assign_candidate") }}</span>
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    @click="close"
                    class="dialogcloseinuserdetails"
                    v-on="on"
                    >mdi-close</v-icon
                  >
                </template>
                <span>{{ $t("close") }}</span>
              </v-tooltip>
            </v-toolbar>
            <v-form ref="apply_job" v-model="valid">
              <v-layout>
                <v-flex xs12 md11 ml-3 mt-4>
                  <v-autocomplete
                    dense
                    v-model="candidate_applied_job.candidate_id"
                    v-bind:label="$t('candidate')"
                    :items="candidate_details_array"
                    item-text="full_name"
                    :rules="fieldRules"
                    class="required_field"
                    item-value="id"
                    multiple
                    chips
                    outlined
                  ></v-autocomplete>
                </v-flex>
              </v-layout>
            </v-form>
            <v-card-actions class="container">
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <div class="d-inline-block mr-2">
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
                    @click="saveCandidateJob()"
                    small
                    class="mr-2 success hover_shine mb-3"
                    color="green darken-1"
                    :disabled="submit_btn_disable"
                  >
                    {{ $t("submit") }}
                    <b-spinner
                      :disabled="isBtnLoading"
                      small
                      v-if="isBtnLoading"
                    ></b-spinner>
                  </v-btn>
                </template>
                <span>{{ $t("submit") }}</span>
              </v-tooltip>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- :get_all_jobs="" -->

        <div v-if="currentTab == 'interview_scheduled'">
          <ScheduleInterview
            :schedule_dialog="schedule_dialog"
            :canidate_job_id="job_details.id"
            :edit_schedule_interview="edit_schedule_interview"
            :schedule_interview_slug="schedule_interview_slug"
            @scheduleDialog="scheduleDialog"
          />
        </div>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div class="d-inline-block mr-2">
              <v-btn
                v-on="on"
                small
                class="ma-1 font-weight-bold cancel-btn"
                color="secondary"
                @click="$router.go(-1)"
                >{{ $t("back") }}</v-btn
              >
            </div>
          </template>
          <span>{{ $t("back") }}</span>
        </v-tooltip>
      </div>
    </div>
    <v-tabs>
      <Tabs
        :tabs="tabs"
        :currentTab="currentTab"
        :wrapper-class="'shadow-tabs inline-tabs align-self-center'"
        :tab-class="'tab-item'"
        :tab-active-class="'tab-item-active'"
        :line-class="'tab-item-line'"
        @onClick="handleClick"
      />
    </v-tabs>
    <div v-if="currentTab == 'all_jobs'">
      <AppliedJobsStatus
        :candidate_job_array="candidate_job_array"
        :job_details="job_details"
        :candidate_fetch="candidate_fetch_status"
        :tabs_page="'all_jobs'"
        :candidate_search="candidate_search_data"
      />
    </div>
    <div v-if="currentTab == 'active'">
      <AppliedJobsStatus
        :candidate_job_array="candidate_job_array"
        :job_details="job_details"
        :candidate_fetch="candidate_fetch_status"
        :tabs_page="'active'"
      />
    </div>
    <div v-if="currentTab == 'contacting'">
      <AppliedJobsStatus
        :candidate_job_array="candidate_job_array"
        :job_details="job_details"
        :candidate_fetch="candidate_fetch_status"
        :tabs_page="'contacting'"
      />
    </div>
    <div v-if="currentTab == 'interview_scheduled'">
      <AppliedJobsStatus
        :candidate_job_array="candidate_job_array"
        :job_details="job_details"
        :candidate_fetch="candidate_fetch_status"
        :tabs_page="'interview_scheduled'"
        @updated_interview_status="updated_interview_status"
      />
    </div>
    <div v-if="currentTab == 'shortlisted'">
      <AppliedJobsStatus
        :candidate_job_array="candidate_job_array"
        :job_details="job_details"
        :candidate_fetch="candidate_fetch_status"
        :tabs_page="'shortlisted'"
      />
    </div>
    <div v-if="currentTab == 'onhold'">
      <AppliedJobsStatus
        :candidate_job_array="candidate_job_array"
        :job_details="job_details"
        :candidate_fetch="candidate_fetch_status"
        :tabs_page="'onhold'"
      />
    </div>
    <div v-if="currentTab == 'hired'">
      <AppliedJobsStatus
        :candidate_job_array="candidate_job_array"
        :job_details="job_details"
        :candidate_fetch="candidate_fetch_status"
        :tabs_page="'hired'"
      />
    </div>
    <div v-if="currentTab == 'rejected'">
      <AppliedJobsStatus
        :candidate_job_array="candidate_job_array"
        :job_details="job_details"
        :candidate_fetch="candidate_fetch_status"
        :tabs_page="'rejected'"
      />
    </div>
  </div>
</template>
<script>
import Tabs from "vue-tabs-with-active-line";
import AppliedJobsStatus from "./AppliedJobsStatus.vue";
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ScheduleInterview from "../Interviews/ScheduleInterview.vue";

export default {
  components: {
    AppliedJobsStatus,
    PageTitle,
    ScheduleInterview,
    Tabs,
  },
  data: () => ({
    google_icon: {
      icon_name: "settings_suggest",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
    candidate_job_array: [],
    job_details: "",
    tabs: TABS,
    assign_candidate_dialogue: false,
    schedule_dialog: false,
    edit_schedule_interview: false,
    schedule_interview_slug: "",
    edit_schedule_interview: "",
    currentTab: "all_jobs",
    filtering_job_status: "All",
    candidate_fetch_status: "",
    candidate_details_array: [],
    isBtnLoading: false,
    submit_btn_disable: false,
    valid: true,
    candidate_search_data: "",
    candidate_applied_job: {
      candidate_id: null,
      job_id: null,
    },
  }),

  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.job_slug = this.$route.query.slug;
          this.currentTab = this.$route.query.tabs_details;
          this.candidate_fetch_status = this.$route.query.retrived_data;
          this.fetchJobDetails(
            this.$route.query.slug,
            this.candidate_fetch_status
          );

          // this.fetchLookup();
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
    updated_interview_status() {
      this.fetchJobDetails(this.$route.query.slug, "Interview Scheduled");
    },
    searchData(searchdata) {
      this.candidate_search_data = searchdata;
    },
    close() {
      this.candidate_fetch_status = this.currentTab;
      this.handleClick(this.currentTab);
      // this.$emit("tabUpdates", this.tabs_page);
      this.assign_candidate_dialogue = false;
      this.candidate_applied_job.candidate_id = null;
      this.candidate_applied_job.job_id = "";
    },
    saveCandidateJob() {
      if (this.$refs.apply_job.validate()) {
        this.submit_btn_disable = true;
        this.isBtnLoading = true;
        this.candidate_applied_job.job_id = this.job_details.id;

        this.axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "assign_candidate_job",
            this.candidate_applied_job
          )
          .then((response) => {
            if (response.data.status == "S") {
              this.flashMessage.success({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.submit_btn_disable = false;
              this.isBtnLoading = false;
              this.close();
            }
            if (response.data.status == "E") {
              this.isBtnLoading = false;
              this.submit_btn_disable = false;
              // this.close();
              // this.fetchDetails();
            }
          })
          .catch((err) => {
            this.isBtnLoading = false;
            this.submit_btn_disable = false;
            console.log(err);
            this.close();
          });
      }
    },
    fetchCandiateDetails() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_candidate_details", {
          params: {
            job_id: this.job_details.id,
          },
        })
        .then((res) => {
          this.candidate_details_array = res.data.candiate_details;
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
    candidateDialogue() {
      this.assign_candidate_dialogue = true;
      this.fetchCandiateDetails();
    },
    scheduleDialog(dialog_value) {
      this.schedule_dialog = dialog_value;
      this.candidate_fetch_status = this.currentTab;
      this.handleClick(this.currentTab);
    },
    openDialog() {
      this.edit_schedule_interview = "";
      this.schedule_interview_slug = "";
      this.schedule_dialog = true;
    },
    // tabUpdates(value) {
    //   this.handleClick(this.currentTab);
    //   this.candidate_fetch_status = this.currentTab;
    //   console.log("value ", value);
    // },
    handleClick(newTab) {
      this.currentTab = newTab;
      this.candidate_fetch_status = "";
      if (newTab == "all_jobs") {
        this.fetchJobDetails(this.$route.query.slug, "All");
      } else if (newTab == "active") {
        this.fetchJobDetails(this.$route.query.slug, "Active");
        this.candidate_fetch_status = "Active";
      } else if (newTab == "contacting") {
        this.fetchJobDetails(this.$route.query.slug, "Contacting");
        this.candidate_fetch_status = "Contacting";
      } else if (newTab == "interview_scheduled") {
        this.fetchJobDetails(this.$route.query.slug, "Interview Scheduled");
        this.candidate_fetch_status = "Interview Scheduled";
      } else if (newTab == "onhold") {
        this.fetchJobDetails(this.$route.query.slug, "On Hold");
        this.candidate_fetch_status = "On Hold";
      } else if (newTab == "shortlisted") {
        this.fetchJobDetails(this.$route.query.slug, "Shortlist");
        this.candidate_fetch_status = "Shortlist";
      } else if (newTab == "hired") {
        this.fetchJobDetails(this.$route.query.slug, "Hired");
        this.candidate_fetch_status = "Hired";
      } else if (newTab == "rejected") {
        this.fetchJobDetails(this.$route.query.slug, "Rejected");
        this.candidate_fetch_status = "Rejected";
      }
    },
    fetchJobDetails(job_slug, status) {
      this.loader = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetch_candidate_job_details",
          {
            params: {
              slug: job_slug,
              candiadte_job_status: status,
            },
          }
        )
        .then((res) => {
          this.candidate_job_array = res.data.candidate_jobapplied;

          this.job_details = res.data.job_details;
          this.loader = false;
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
          this.loader = false;
        });
    },
  },
};
const TABS = [
  {
    title: "All",
    value: "all_jobs",
  },
  {
    title: "Active",
    value: "active",
  },
  {
    title: "Contacting",
    value: "contacting",
  },
  {
    title: "Interview Scheduled",
    value: "interview_scheduled",
  },
  {
    title: "Shortlisted",
    value: "shortlisted",
  },
  {
    title: "On Hold",
    value: "onhold",
  },
  {
    title: "Hired",
    value: "hired",
  },
  {
    title: "Rejected",
    value: "rejected",
  },
];
</script>
<style scoped></style>
