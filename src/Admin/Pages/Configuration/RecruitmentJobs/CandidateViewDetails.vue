<template>
  <div>
    <div class="mb-3 mx-auto">
      <div>
        <VueElementLoading
          :active="loader_main"
          spinner="bar-fade-scale"
          color="var(--primary)"
        />
        <!-- <div v-if="recruitment_details == ''" class="text-center">
          {{ $t('no_data_found') }}
        </div> -->

        <v-stepper v-model="stepmodel" vertical>
          <div class="d-flex justify-content-between">
            <router-link
              class="text-decoration-none"
              :to="{
                name: 'candidate_recruitment_view',
                query: {
                  slug: recruitment_details.slug,
                },
              }"
              ><div
                class="card-header-title card_heading font-size-lg text-capitalize titlewrap"
              >
                {{ recruitment_details.name }}
              </div></router-link
            >
            <div class="d-flex" v-if="status == 'Active'">
              <div v-if="candiadte_job_status != 'Interview Scheduled'">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-autocomplete
                      dense
                      v-on="on"
                      v-model="interview_status"
                      v-bind:label="$t('candidate_status')"
                      :items="interviews_array"
                      item-text="longname"
                      item-value="shortname"
                      class="mr-4 pt-2"
                      outlined
                      @change="confirmJobStatus(interview_status)"
                      :disabled="
                        interview_status == 'Hired' ||
                        interview_status == 'Rejected'
                      "
                    ></v-autocomplete>
                  </template>
                  <span>{{ $t("candidate_status") }}</span>
                </v-tooltip>
              </div>
              <div v-if="candiadte_job_status == 'Interview Scheduled'">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-autocomplete
                      dense
                      v-on="on"
                      v-model="interview_status"
                      v-bind:label="$t('interview_status')"
                      :items="interviews_array"
                      item-text="longname"
                      item-value="shortname"
                      class="mr-4 pt-2"
                      outlined
                      @change="confirmJobStatus(interview_status)"
                      :disabled="
                        interview_status == 'Hired' ||
                        interview_status == 'Rejected'
                      "
                    ></v-autocomplete>
                  </template>
                  <span>{{ $t("interview_status") }}</span>
                </v-tooltip>
              </div>
            </div>
          </div>
          <v-stepper-step :complete="stepmodel > 1" step="1" editable>
            {{ $t("basic_details") }}
          </v-stepper-step>
          <v-stepper-content step="1">
            <div class="row" style="padding: 8px">
              <!-- <div class="col-md-4">
                <div class="title_heading">
                  {{ $t("full_name") }}
                </div>
                <div class="values">
                  {{ recruitment_details.name }}
                </div>
              </div> -->
              <div class="col-md-6">
                <div class="title_heading">
                  {{ $t("email") }}
                </div>
                <div class="values">
                  {{ recruitment_details.email }}
                </div>
              </div>
              <div class="col-md-4">
                <div class="title_heading">
                  {{ $t("contact_no") }}
                </div>
                <div class="values">
                  {{ recruitment_details.mobile }}
                </div>
              </div>
              <div class="col-md-2">
                <div class="title_heading">
                  {{ $t("gender") }}
                </div>
                <div class="values">
                  {{ recruitment_details.candidate_gender }}
                </div>
              </div>
              <div class="col-md-12">
                <div class="title_heading">
                  {{ $t("position_applied_for") }}
                </div>
                <div class="values">
                  {{ job_title }}
                </div>
              </div>
            </div>
          </v-stepper-content>
          <v-stepper-step :complete="stepmodel > 2" step="2" editable>
            {{ $t("current_employment_details") }}
            <span
              v-if="
                recruitment_details.total_experience_year &&
                recruitment_details.total_experience_year > 0
              "
              >-&nbsp;&nbsp;{{ $t("experienced") }}</span
            >
            <span v-else>-&nbsp;&nbsp;{{ $t("fresher") }}</span>
          </v-stepper-step>
          <v-stepper-content step="2">
            <div
              class="row"
              style="padding: 8px"
              v-if="
                recruitment_details.total_experience_year &&
                recruitment_details.total_experience_year > 0
              "
            >
              <div class="col-md-4">
                <div class="title_heading">{{ $t("employoment_type") }}</div>
                <div
                  class="values"
                  v-if="
                    recruitment_details.emp_type_looking &&
                    recruitment_details.emp_type_looking.length > 0
                  "
                >
                  <v-chip
                    v-for="(posirion_applied, index) in JSON.parse(
                      recruitment_details.emp_type_looking
                    )"
                    :key="index"
                    x-small
                    class="ma-1"
                    color="primary"
                    >{{ posirion_applied }}</v-chip
                  >
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
              <div class="col-md-4">
                <div class="title_heading">{{ $t("current_company") }}</div>
                <div class="values" v-if="recruitment_details.current_company">
                  {{ recruitment_details.current_company }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
              <div class="col-md-4">
                <div class="d-flex justify-content-between">
                  <div>
                    <div class="title_heading">
                      {{ $t("current_designation") }}
                    </div>
                    <div
                      class="values"
                      v-if="recruitment_details.current_designation"
                    >
                      {{ recruitment_details.current_designation }}
                    </div>
                    <div v-else>{{ $t("empty_field") }}</div>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="title_heading">{{ $t("current_location") }}</div>
                <div class="values" v-if="recruitment_details.current_location">
                  {{ recruitment_details.current_location }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
              <div class="col-md-4">
                <div class="title_heading">{{ $t("current_CTC") }}</div>
                <div class="values" v-if="recruitment_details.current_ctc">
                  {{ recruitment_details.current_ctc }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
              <div class="col-md-4">
                <div class="title_heading">{{ $t("expected_CTC") }}</div>
                <div class="values" v-if="recruitment_details.expected_ctc">
                  {{ recruitment_details.expected_ctc }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
              <div class="col-md-4">
                <div class="title_heading">{{ $t("notice_period") }}</div>
                <div class="values" v-if="recruitment_details.notice_period">
                  {{ recruitment_details.notice_period }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>

              <div class="col-md-4">
                <div class="title_heading">
                  {{ $t("total_work_experience") }}
                </div>
                <div
                  class="values"
                  v-if="recruitment_details.total_experience_year"
                >
                  {{ recruitment_details.total_experience_year }}.
                  {{ recruitment_details.total_experience_months }}
                  {{ $t("years") }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
              <div class="col-md-4">
                <div class="title_heading">{{ $t("relevant_experience") }}</div>
                <div
                  class="values"
                  v-if="recruitment_details.relevant_experience"
                >
                  {{ recruitment_details.relevant_experience }}
                  {{ $t("year") }}
                  {{ recruitment_details.relevant_experience_months }}
                  {{ $t("months") }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
            </div>
            <div class="row" style="padding: 8px" v-else>
              <div class="col-md-6">
                <div class="title_heading">{{ $t("employoment_type") }}</div>
                <div
                  class="values"
                  v-if="
                    recruitment_details.emp_type_looking &&
                    recruitment_details.emp_type_looking.length > 0
                  "
                >
                  <v-chip
                    v-for="(posirion_applied, index) in JSON.parse(
                      recruitment_details.emp_type_looking
                    )"
                    :key="index"
                    x-small
                    class="ma-1"
                    color="primary"
                    >{{ posirion_applied }}</v-chip
                  >
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
              <div class="col-md-6">
                <div class="title_heading">{{ $t("current_location") }}</div>
                <div class="values" v-if="recruitment_details.current_location">
                  {{ recruitment_details.current_location }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
              <div class="col-md-6">
                <div class="title_heading">{{ $t("expected_CTC") }}</div>
                <div class="values" v-if="recruitment_details.expected_ctc">
                  {{ recruitment_details.expected_ctc }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
              <div class="col-md-6">
                <div class="title_heading">{{ $t("notice_period") }}</div>
                <div class="values" v-if="recruitment_details.notice_period">
                  {{ recruitment_details.notice_period }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
            </div>
          </v-stepper-content>
          <v-stepper-step :complete="stepmodel > 3" step="3" editable>
            {{ $t("edu_and_skill") }}
          </v-stepper-step>

          <v-stepper-content step="3">
            <div class="row px-3">
              <div class="col-md-4">
                <div class="title_heading">
                  {{ $t("highest_qualifiaction") }}
                </div>
                <div
                  class="values"
                  v-if="recruitment_details.candidate_qualification"
                >
                  {{ recruitment_details.candidate_qualification }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
              <div class="col-md-4">
                <div class="title_heading">{{ $t("courses") }}</div>
                <div class="values" v-if="recruitment_details.courses">
                  {{ recruitment_details.courses }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
              <div class="col-md-4">
                <div class="title_heading">{{ $t("major_skillset") }}</div>
                <div class="values" v-if="recruitment_details.candidate_skills">
                  <v-chip
                    v-for="(skills, i) in JSON.parse(
                      recruitment_details.candidate_skills
                    )"
                    :key="i"
                    class="mr-1"
                    variant="outlined"
                    color="primary"
                    x-small
                    >{{ skills }}</v-chip
                  >
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
            </div>
          </v-stepper-content>
          <v-stepper-step step="4" editable>
            {{ $t("other_details") }}
          </v-stepper-step>
          <v-stepper-content step="4">
            <div class="row px-3">
              <div class="col-md-4">
                <div class="title_heading">{{ $t("marital_status") }}</div>
                <div class="values" v-if="recruitment_details.marital_status">
                  {{ recruitment_details.marital_status }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
              <div class="col-md-4">
                <div class="title_heading">{{ $t("passport_expiry") }}</div>
                <div class="values" v-if="recruitment_details.passport_expiry">
                  {{
                    recruitment_details.passport_expiry | formatdateMonthyear
                  }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
              <div class="col-md-4">
                <div class="title_heading">{{ $t("travel_details") }}</div>
                <div
                  class="values"
                  v-if="recruitment_details.candidate_travel_history"
                >
                  {{ recruitment_details.candidate_travel_history }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
              <div class="col-md-4">
                <div class="title_heading">
                  {{ $t("willingness_to_travel") }}
                </div>
                <div
                  class="values"
                  v-if="recruitment_details.willing_to_travel"
                >
                  {{ recruitment_details.willing_to_travel }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
              <div class="col-md-4">
                <div class="title_heading">{{ $t("visa_available") }}</div>
                <div class="values" v-if="recruitment_details.candidate_visa">
                  {{ recruitment_details.candidate_visa }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
              <div class="col-md-4">
                <div class="title_heading">{{ $t("source") }}</div>
                <div class="values" v-if="recruitment_details.source_type">
                  {{ recruitment_details.source_type }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
              <div class="col-md-4">
                <div class="title_heading">{{ $t("source_type") }}</div>
                <div class="values" v-if="recruitment_details.source_data">
                  {{ recruitment_details.source_data }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
              <div class="col-md-8">
                <div class="title_heading">{{ $t("queries") }}</div>
                <div
                  class="values"
                  v-if="recruitment_details.candidate_queries"
                >
                  {{ recruitment_details.candidate_queries }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
            </div>
          </v-stepper-content>
          <!-- <v-stepper-step step="5" editable>
            {{ $t("social_media_link") }}
          </v-stepper-step>
          <v-stepper-content step="5">
            <v-form ref="formstep5" v-model="valid">
              <v-card>
                <v-layout pt-1>
                  <v-flex xs12 md6>
                    <v-text-field
                      v-model="recruitment_details.website"
                      :disabled="ediatable_data"
                      v-bind:label="$t('website')"
                      class="p-0"
                      dense
                      outlined
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 md6 pl-2>
                    <v-text-field
                      v-model="recruitment_details.youtube"
                      :disabled="ediatable_data"
                      v-bind:label="$t('youtube')"
                      required
                      class="pr-2"
                      dense
                      outlined
                    ></v-text-field>
                  </v-flex>

                
                </v-layout>

                <v-layout pt-1>
                  <v-flex xs12 md6>
                    <v-text-field
                      v-model="recruitment_details.linkedin"
                      :disabled="ediatable_data"
                      v-bind:label="$t('linkedin')"
                      class="pr-2"
                      dense
                      outlined
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 md6 pl-2>
                    <v-text-field
                      v-model="recruitment_details.twitter"
                      :disabled="ediatable_data"
                      v-bind:label="$t('twitter')"
                      class="pr-2"
                      required
                      dense
                      outlined
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex xs12 md6>
                    <v-text-field
                      v-model="recruitment_details.instagram"
                      :disabled="ediatable_data"
                      v-bind:label="$t('instagram')"
                      class="pr-2"
                      required
                      dense
                      outlined
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-text-field
                      v-model="recruitment_details.facebook"
                      :disabled="ediatable_data"
                      v-bind:label="$t('facebook')"
                      class="pr-2"
                      required
                      dense
                      outlined
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-form>
          </v-stepper-content> -->
        </v-stepper>
        <v-dialog
          persistent
          v-model="reject_hired_dialog"
          small
          transition="dialog-bottom-transition"
          max-width="800px"
        >
          <v-card class="container" style="padding: 0px !important">
            <v-toolbar color="primary" dark>
              <span class="headline">{{ $t("reject_hire_comments") }}</span>
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
            <v-form ref="reject_hire" v-model="valid">
              <v-layout>
                <v-flex xs12 md11 ml-3 mt-4>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-textarea
                        v-on="on"
                        rows="2"
                        maxlength="250"
                        v-model="reject_hired_comments"
                        v-bind:label="$t('comments')"
                        counter="250"
                        class="required_field"
                        :rules="fieldRules"
                        outlined
                        dense
                      ></v-textarea>
                    </template>
                    <span>{{ $t("comments") }}</span>
                  </v-tooltip>
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
                    @click="saveCandidateComments()"
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
      </div>
      <ConfirmDialog
        :show="showStatusDialog"
        :cancel="cancelStatus"
        :confirm="confirmStatus"
        :id="status_id"
        v-bind:title="$t('confirm')"
        v-bind:description="$t('status_change')"
      />
    </div>
  </div>
</template>

<script>
import ConfirmDialog from "../Components/ConfirmDialog.vue";

import VueElementLoading from "vue-element-loading";

export default {
  props: ["candidate_slug", "job_id", "job_title", "status"],
  components: {
    VueElementLoading,

    ConfirmDialog,
  },
  data: () => ({
    showStatusDialog: false,
    ediatable_data: true,
    stepmodel: 1,
    valid: true,
    loader_main: false,
    loader: false,
    status_id: null,
    reject_hired_dialog: false,
    candiadte_job_status: "",
    document_url: process.env.VUE_APP_IMAGE_PATH,
    isBtnLoading: false,
    isDisabled: false,
    openMedia: false,
    job_type_array: [],
    interviews_array: [],
    interview_status: "",
    job_status: "",
    recruitment_details: "",
    reject_hired_comments: "",
    submit_btn_disable: false,
  }),

  created() {
    this.fetchlookup();
  },
  watch: {
    "$route.query.candiadte_job_status": {
      immediate: true,
      handler() {
        if (this.$route.query.candiadte_job_status) {
          this.candiadte_job_status = this.$route.query.candiadte_job_status;
        }
        else{
          this.candiadte_job_status="All"
        }
      },
    },
    candidate_slug: {
      immediate: true,
      handler() {
        if (this.candidate_slug) {
          this.interview_status = "";
          this.fetchCandidateDetails();
        } else {
          this.recruitment_details = "";
        }
      },
    },
    job_id: {
      immediate: true,
      handler() {
        if (this.job_id) {
          this.job_id = this.job_id;
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
    saveCandidateComments() {
      if (this.$refs.reject_hire.validate()) {
        this.isBtnLoading = true;
        this.submit_btn_disable = true;

        this.changeJobsStatus(this.job_status);
        // this.isBtnLoading = false;

        console.log("error", err);
      }
    },
    close() {
      this.reject_hired_dialog = false;
      this.reject_hired_comments = "";
      this.submit_btn_disable = false;
      this.fetchCandidateDetails();
      this.showStatusDialog = false;
    },
    previousPage(page_details) {
      this.$router.push({
        name: "recruitment",
        params: {
          page_details: page_details,
        },
      });
    },
    confirmJobStatus(job_status) {
      this.showStatusDialog = true;
      this.job_status = job_status;
      //   this.job_id = id;
    },
    cancelStatus() {
      this.showStatusDialog = false;
      this.fetchCandidateDetails();
    },
    confirmStatus() {
      // this.statusUpdate()
      if (this.job_status == "Rejected" || this.job_status == "Hired") {
        this.reject_hired_dialog = true;
      } else {
        this.changeJobsStatus(this.job_status);
        this.showStatusDialog = false;
      }
    },
    changeJobsStatus(jobs_status) {
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "update_candidate_job_status",
          {
            job_id: this.job_id,
            job_status: jobs_status,
            candidate_id: this.recruitment_details.id,
            reject_hired_comments: this.reject_hired_comments,
          }
        )
        .then((res) => {
          this.close();
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.fetchCandidateDetails();

            this.flashMessage.success({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.isBtnLoading = false;

            // this.fetchJobs();
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.isBtnLoading = false;

            this.loader = false;
          } else {
            this.flashMessage.error({
              message: this.array_data,
            });
            this.isBtnLoading = false;
          }
        })
        .catch((err) => {
          this.isBtnLoading = false;
          this.loader = false;
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log("this error" + err);
        });
    },
    editCandidateData() {
      this.ediatable_data = false;
    },
    fetchCandidateDetails() {
      this.loader_main = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetch_candidate_slug?slug=" +
            this.candidate_slug +
            "&job_id=" +
            this.job_id +
            "&tabs_page=" +
            this.$route.query.candiadte_job_status
        )
        .then((res) => {
          this.btnloading = false;
          if (res.data.status == "S") {
            this.loader_main = false;
            this.message = res.data.message;
            this.recruitment_details = res.data.candidate_details;
            if (
              this.$route.query.candiadte_job_status == "Interview Scheduled" ||
              this.$route.query.candiadte_job_status == "Shortlist"
            ) {
              this.interview_status =
                res.data.interview_status.interview_status;
            } else {
              this.interview_status = res.data.interview_status.job_status;
            }
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

    fetchlookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "INTERVIEW_STATUS",
          },
        })
        .then((response) => {

          if (
            this.$route.query.candiadte_job_status == "Interview Scheduled" ||
            this.$route.query.candiadte_job_status == "Shortlist" || this.candiadte_job_status=='All')
           {
            
            this.interviews_array = response.data.lookup_details; 
          } else {
            // alert("else");
             this.interviews_array = response.data.lookup_details.filter(
              (ele) => {
                return (
                  ele.shortname != "Schedule Next Round" &&
                  ele.shortname != "Interview Scheduled"
                );
              }
            );
            
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style scoped>
.text_position {
  position: absolute;
  bottom: 5px;
  left: 10px;
  /* text-wrap: nowrap; */
}

.card_heading {
  margin: 10px 0px 0px 20px;
  font-weight: 800;
}
.edit_margin {
  margin-top: -23px;
}
.title_heading {
  font-weight: bold;
}
</style>
