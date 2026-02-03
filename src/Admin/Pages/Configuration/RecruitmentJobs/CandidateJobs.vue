<template>
  <div>
    <div class="card-body">
      <VueElementLoading
        :active="loader"
        spinner="bar-fade-scale"
        color="var(--primary)"
      />
      <div class="d-flex justify-content-between">
        <p class="job-title mt-3">
          {{ job_details.job_title }}
        </p>
        <div class="d-flex">
          <div class="btn_margin" v-if="job_details.job_status == 'Active'">
            <v-btn
              small
              color=" btn hover_shine add_new"
              @click="candidateDialogue"
            >
              {{ $t("assign_candidate") }}
            </v-btn>
          </div>
          <div>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-autocomplete
                  dense
                  v-on="on"
                  v-model="interview_status"
                  v-bind:label="$t('status')"
                  :items="interviews_array"
                  item-text="longname"
                  item-value="shortname"
                  class="mr-4 pt-2"
                  outlined
                  @change="fetchJobDetails(job_slug, interview_status)"
                ></v-autocomplete>
              </template>
              <span>{{ $t("status") }}</span>
            </v-tooltip>
          </div>
          <div class="mt-2">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on" class="d-inline-block mr-2">
                  <v-btn
                    v-on="on"
                    small
                    @click="$router.go(-1)"
                    class="ma-1 font-weight-bold cancel-btn"
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
      <v-dialog
        persistent
        v-model="assign_candidate_dialogue"
        small
        transition="dialog-bottom-transition"
        max-width="800px"
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
      <div class="container-fluid mt-5">
        <div class="row">
          <div class="col-md-3">
            <div>
              <v-text-field
                v-bind:label="$t('search')"
                v-model="searchCandidates"
                solo
                dense
                append-icon="mdi-magnify"
                clearable
              ></v-text-field>
            </div>
            <!-- <div class="d-flex justify-content-between mt-2 mr-4">
                <div class="pl-4">
                    <v-card class="p-3 job-title">{{ job_details.job_title }}</v-card>
                </div>
                <v-btn small class="secondary" @click="$router.go(-1)">
                    {{ $t("back") }}
                </v-btn>
            </div> -->
            <div class="scroll-section">
              <div v-if="!candidateSearch.length > 0" class="text-center mt-5">
                {{ $t("no_details_found") }}
              </div>
              <div
                class="card p-2 mb-20"
                v-for="(candidate, candidateIndex) in candidateSearch"
                :key="candidateIndex"
                v-bind:class="{
                  'is-active': candidate.id == activeSlug,
                }"
              >
                <div>
                  <div
                    @click="gotodetails(candidate.candidate_id, candidate.slug)"
                    class="cursor_pointer"
                  >
                    <!-- -->
                    <div class="d-flex jd-top-header">
                      <h6 class="candidate_title text-capitalize">
                        {{ candidate.name }}
                      </h6>
                    </div>
                    <div class="d-flex">
                      <p class="mr-2 float-left font-weight-bold">
                        {{ $t("total_experience") }}
                      </p>
                      <span v-if="candidate.total_experience_year">
                        : &nbsp;{{ candidate.total_experience_year }}.{{
                          candidate.total_experience_months
                        }}
                        Years
                      </span>
                      <span v-else> : &nbsp;{{ $t("empty_field") }} </span>
                    </div>
                    <div class="d-flex">
                      <p class="mr-2 float-left font-weight-bold">
                        {{ $t("notice_period") }}
                      </p>

                      <span v-if="candidate.notice_period" class="ml-4"
                        >: &nbsp;{{ candidate.notice_period }}
                      </span>
                      <span v-else class="ml-5">
                        : &nbsp;{{ $t("empty_field") }}
                      </span>
                    </div>
                    <!-- <div>{{ $t("skills") }}:</div>
                    <div class="d-flex flex-wrap">
                      <v-chip
                        v-for="(skill, skillIndex) in JSON.parse(
                          candidate.candidate_skills
                        )"
                        :key="skillIndex"
                        x-small
                        class="ma-1"
                        color="primary"
                        >{{ skill }}</v-chip
                      >
                    </div> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <CandidateViewDetails
              :candidate_slug="candidate_slug"
              :job_id="job_details.id"
              :job_title="job_details.job_title"
              :status="job_details.job_status"
              v-if="candidate_slug"
            />
            <div v-else class="text-center">
              {{ $t("no_data_found") }}
            </div>
          </div>
          <div class="col-md-3">
            <div class="card p-20 notes-card">
              <p class="mx-2 mb-2">
                <i class="lnr lnr-book"></i>&nbsp;{{ $t("comments") }}
              </p>
              <CreateNotes
                :candidate_id="candidate_id"
                :job_id="job_details.id"
                v-if="candidate_id"
              />
              <div v-else class="text-center p-2">
                {{ $t("no_data_found") }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VueElementLoading from "vue-element-loading";
import CandidateViewDetails from "./CandidateViewDetails.vue";
import CreateNotes from "../Components/CreateNotes.vue";

export default {
  components: {
    VueElementLoading,
    CandidateViewDetails,
    CreateNotes,
  },
  data: () => ({
    loader: false,
    candidate_job_array: [],
    job_details: "",
    valid: false,
    searchCandidates: "",
    submit_btn_disable: false,
    interviews_array: [],
    candidate_details_array: [],
    activeSlug: null,
    candidate_slug: "",
    candidate_id: null,
    interview_status: "",
    isBtnLoading: false,
    job_slug: "",
    assign_candidate_dialogue: false,
    candidate_applied_job: {
      candidate_id: null,
      job_id: null,
    },
  }),
  computed: {
    candidateSearch() {
      if (this.searchCandidates) {
        return this.candidate_job_array.filter((candidate) => {
          if (candidate.name != null) {
            return (
              candidate.name
                .toLowerCase()
                .includes(this.searchCandidates.toString().toLowerCase()) ||
              candidate.notice_period
                .toLowerCase()
                .includes(this.searchCandidates.toString().toLowerCase())
            );
          }
        });
      } else {
        return this.candidate_job_array;
      }
    },
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.job_slug = this.$route.query.slug;
          if (this.$route.query.candiadte_job_status) {
            this.fetchJobDetails(
              this.$route.query.slug,
              this.$route.query.candiadte_job_status
            );
          } else {
            this.fetchJobDetails(this.$route.query.slug);
          }
          this.fetchLookup();
        }
      },
    },
  },
  methods: {
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
              this.fetchJobDetails(this.$route.query.slug);
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
    close() {
      this.assign_candidate_dialogue = false;
      this.candidate_applied_job.candidate_id = null;
      this.candidate_applied_job.job_id = "";
    },
    candidateDialogue() {
      this.assign_candidate_dialogue = true;
      this.fetchCandiateDetails();
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
    fetchLookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "INTERVIEW_STATUS",
          },
        })
        .then((response) => {
          this.interviews_array = response.data.lookup_details;

          this.interviews_array.splice(0, 0, {
            id: "0",
            shortname: "All",
            longname: "All",
          });
          if (this.$route.query.candiadte_job_status) {
            this.interview_status = this.$route.query.candiadte_job_status;
          } else {
            this.interview_status = "All";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    previousPage(page_details) {
      this.$router.push({
        name: "recruitment",
        params: {
          page_details: page_details,
        },
      });
    },
    gotodetails(id, candidate_slug) {
      this.candidate_slug = candidate_slug;
      this.candidate_id = id;
      this.activeSlug = id;
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

          if (
            this.$route.query.candidate_slug &&
            this.candidate_job_array.length > 0 &&
            !this.interview_status
          ) {
            this.candidate_slug = this.$route.query.candidate_slug;
            this.candidate_id = this.$route.query.candidate_id;
          } else if (
            this.interview_status &&
            this.candidate_job_array.length > 0
          ) {
            this.candidate_slug = this.candidate_job_array[0].slug;
            this.candidate_id = this.candidate_job_array[0].id;
          } else {
            this.candidate_slug = "";
            this.candidate_id = null;
          }
          this.activeSlug = this.candidate_id;

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
</script>
<style scoped>
.scroll-section {
  max-height: 570px;
  overflow-y: scroll;
}
.jd-top-header {
  width: 100%;
  justify-content: space-between;
  align-items: self-end;
}

.candidate_title {
  font-weight: 600;
  /* color: #1976d2; */
  cursor: pointer;
}
.job-actions-parent {
  align-items: center;
  justify-content: space-between;
}
.mb-20 {
  margin-bottom: 20px;
}
.is-active {
  border: 3px solid #3e9af5;
}
.job-title {
  font-size: 26px !important;
  margin-left: 30px;
  font-weight: 900;
  color: #1976d2;
}

.cursor_pointer {
  cursor: pointer;
}
.btn_margin {
  margin: 12px 7px 0px 0px;
}
</style>
