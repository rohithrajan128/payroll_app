<template>
  <div>
    <VueElementLoading
      :active="loader"
      spinner="bar-fade-scale"
      color="var(--primary)"
    />
    <div class="row mt-2">
      <div class="col-md-9">
        <div class="row">
          <div class="col-md-4">
            <v-card class="card-height">
              <p class="pl-5 pt-2 m-0 font-weight-bold">
                {{ $t("jobs") }}
              </p>
              <div class="row">
                <div class="col-md-5">
                  <p class="all_card_font text-success">
                    {{ all_dashboard_data.active_job_count }}
                  </p>
                  <p
                    class="text-center text-hover"
                    @click="goToViewAll('active_jobs')"
                  >
                    {{ $t("open_jobs") }}
                  </p>
                </div>
                <div class="col-md-1 candidate_height">
                  <v-divider vertical></v-divider>
                </div>
                <div class="col-md-5">
                  <p class="all_card_font text-danger">
                    {{ all_dashboard_data.inactive_job_count }}
                  </p>
                  <p
                    class="text-center text-hover-closed"
                    @click="goToViewAll('inactive_jobs')"
                  >
                    {{ $t("closed_jobs") }}
                  </p>
                </div>
              </div>
            </v-card>
          </div>

          <div class="col-md-4">
            <v-card class="card-height border-color-candidates">
              <p class="pl-5 pt-2 m-0 font-weight-bold">
                {{ $t("candidates") }}
              </p>
              <div class="row">
                <div class="col-md-5">
                  <p class="all_card_font text-info">
                    {{ all_dashboard_data.all_candidate_count }}
                  </p>
                  <p
                    class="text-center candidate_hover pl-1"
                    @click="goToViewAll('candidate_details')"
                  >
                    {{ $t("total_candidates") }}
                  </p>
                </div>
                <div class="col-md-1 candidate_height">
                  <v-divider vertical></v-divider>
                </div>
                <div class="col-md-5">
                  <p class="all_card_font text-success">
                    {{ all_dashboard_data.active_candidate }}
                  </p>
                  <p
                    class="text-center text-hover"
                    @click="goToViewAll('candidate_details')"
                  >
                    {{ $t("active_candidates") }}
                  </p>
                </div>
              </div>
            </v-card>
          </div>

          <div class="col-md-4">
            <v-card class="card-height tracking_border">
              <p class="pl-5 pt-2 m-0 font-weight-bold">
                {{ $t("interviews_tracking") }}
              </p>
              <div class="row pt-2">
                <div class="col-md-5">
                  <p
                    class="all_card_font text-success"
                    style="margin-top: -3px"
                  >
                    {{ all_dashboard_data.upcoming_interview_count }}
                  </p>
                  <p class="text-center text-hover" style="margin-top: -8px">
                    {{ $t("upcoming_interview") }}
                  </p>
                </div>
                <div class="col-md-1 candidate_height mt-3">
                  <v-divider vertical></v-divider>
                </div>
                <div class="col-md-5">
                  <p
                    class="all_card_font text-success"
                    style="margin-top: -6px"
                  >
                    {{ all_dashboard_data.offered_count }}
                  </p>
                  <p class="text-center text-hover">
                    {{ $t("offers_toextend") }}
                  </p>
                </div>
              </div>
            </v-card>
          </div>
        </div>
        <v-tabs color="#3f6ad8" class="mt-5">
          <v-tab
            ><span class="tab-title"
              ><i class="fa fa-address-book pl-3 mr-2"></i>
              {{ $t("active_jobs") }}
            </span>
          </v-tab>

          <v-tab
            ><span class="tab-title"
              ><i class="fa fa-users pl-3 mr-2"></i>
              {{ $t("candidates") }}
            </span></v-tab
          >

          <!-- <a @click="goToViewAll('jobs')" class="link_color">{{
            $t("view_all_jobs")
          }}</a> -->

          <v-btn
            color=" btn mr-2 mb-2 hover_shine add_new"
            small
            class="mb-2 link_color"
            @click="goToViewAll('active_jobs')"
            >{{ $t("view_all_jobs") }}</v-btn
          >
          <v-tab-item>
            <div class="row mt-1">
              <div class="col-md-12">
                <div class="main-card mb-3 card">
                  <div class="table-responsive">
                    <table
                      class="align-middle mb-0 table table-borderless table-striped table-hover"
                    >
                      <thead>
                        <!-- <tr>
                      <th></th>
                      <th class="text-center"></th>
                      <th class="text-center"></th>
                      <th class="text-center"></th>
                      <th class="text-center"></th>
                      <th class="text-center"></th>
                      <th class="text-center"></th>
                    </tr> -->
                      </thead>

                      <tbody>
                        <div
                          v-if="
                            all_dashboard_data.all_dashboard_data &&
                            !all_dashboard_data.all_dashboard_data.length > 0
                          "
                          class="text-center"
                        >
                          {{ $t("no_details_found") }}
                        </div>
                        <tr
                          v-else
                          v-for="(
                            active_jobs, active_job_index
                          ) in all_dashboard_data.all_active_job"
                          :key="active_job_index"
                        >
                          <td
                            class="text-muted cursor_pointer"
                            @click="
                              viewCandidateJobdetails(
                                active_jobs.slug,
                                'all_jobs',
                                'All'
                              )
                            "
                          >
                            {{ active_jobs.job_title }}
                          </td>
                          <td>
                            <div
                              class="candidate_border_style cursor_pointer"
                              @click="
                                viewCandidateJobdetails(
                                  active_jobs.slug,
                                  'active',
                                  'Active'
                                )
                              "
                            >
                              {{ active_jobs.active_candidate_count }}
                              {{ $t("active_candidates") }}
                            </div>
                          </td>
                          <td class="text-center">
                            <div
                              class="candidate_border_style candiate_contact_color cursor_pointer"
                              @click="
                                viewCandidateJobdetails(
                                  active_jobs.slug,
                                  'contacting',
                                  'Contacting'
                                )
                              "
                            >
                              {{ active_jobs.contacting_candidate_count }}
                              {{ $t("contacting") }}
                            </div>
                          </td>
                          <td class="text-center">
                            <div
                              class="candidate_border_style cursor_pointer"
                              @click="
                                viewCandidateJobdetails(
                                  active_jobs.slug,
                                  'interview_scheduled',
                                  'Interview Scheduled'
                                )
                              "
                            >
                              {{ active_jobs.schedule_interview_count }}
                              {{ $t("interviewed") }}
                            </div>
                          </td>
                          <td class="text-center" style="width: 150px">
                            <div
                              class="candidate_border_style rejected_color cursor_pointer"
                              @click="
                                viewCandidateJobdetails(
                                  active_jobs.slug,
                                  'rejected',
                                  'Rejected'
                                )
                              "
                            >
                              {{ active_jobs.rejected_candidates }}
                              {{ $t("rejected") }}
                            </div>
                          </td>
                          <td class="text-center">
                            <div
                              class="candidate_border_style hired_color cursor_pointer"
                              @click="
                                viewCandidateJobdetails(
                                  active_jobs.slug,
                                  'hired',
                                  'Hired'
                                )
                              "
                            >
                              {{ active_jobs.hired_candidates }}
                              {{ $t("hired") }}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="d-block text-center card-footer"></div>
                </div>
              </div>
            </div>
          </v-tab-item>
          <v-tab-item>
            <div class="row mt-1">
              <div class="col-md-12">
                <div class="main-card mb-3 card">
                  <div class="table-responsive">
                    <table
                      class="align-middle mb-0 table table-borderless table-striped table-hover"
                    >
                      <thead>
                        <tr>
                          <th>{{ $t("name") }}</th>
                          <th>{{ $t("applied_jobs") }}</th>
                          <th class="text-center">{{ $t("status") }}</th>
                          <!-- <th class="text-center"></th>
                      <th class="text-center"></th>
                      <th class="text-center"></th> -->
                        </tr>
                      </thead>
                      <tbody>
                        <div
                          v-if="!candidate_applied_job_array.length > 0"
                          class="text-center"
                        >
                          {{ $t("no_details_found") }}
                        </div>
                        <tr
                          v-else
                          v-for="(
                            candidate_details, candidate_job_index
                          ) in candidate_applied_job_array"
                          :key="candidate_job_index"
                        >
                          <td
                            class="text-muted cursor_pointer"
                            @click="
                              viewCandidatedetails(
                                candidate_details.fetch_job_details.slug,
                                candidate_details.fetch_candidate_details.id,
                                candidate_details.fetch_candidate_details.slug,
                                candidate_details.job_status
                              )
                            "
                          >
                            {{ candidate_details.fetch_candidate_details.name }}
                          </td>
                          <td>
                            <div
                              class="cursor_pointer"
                              @click="
                                viewCandidatedetails(
                                  candidate_details.fetch_job_details.slug,
                                  candidate_details.fetch_candidate_details.id,
                                  candidate_details.fetch_candidate_details
                                    .slug,
                                  candidate_details.job_status
                                )
                              "
                            >
                              {{
                                candidate_details.fetch_job_details.job_title
                              }}
                            </div>
                          </td>
                          <td class="text-center">
                            <div
                              class="candidate_border_style hired_color cursor_pointer"
                              @click="
                                viewCandidatedetails(
                                  candidate_details.fetch_job_details.slug,
                                  candidate_details.fetch_candidate_details.id,
                                  candidate_details.fetch_candidate_details
                                    .slug,
                                  candidate_details.job_status
                                )
                              "
                            >
                              {{ candidate_details.job_status }}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="d-block text-center card-footer"></div>
                </div>
              </div>
            </div>
          </v-tab-item>
        </v-tabs>
      </div>
      <div class="col-md-3 pl-0">
        <div class="main-card mb-3 card time_line_card">
          <div class="card-body">
            <div>
              <h5 class="upcoming_interview_title">
                {{ $t("upcoming_interview") }}
              </h5>
              <v-divider :thickness="10" clss="mt-3"></v-divider>
            </div>
            <div
              v-if="
                all_dashboard_data.upcoming_interview &&
                !all_dashboard_data.upcoming_interview.length > 0
              "
              class="text-center"
            >
              {{ $t("no_details_found") }}
            </div>
            <div
              v-else
              class="vertical-timeline vertical-timeline--animate vertical-timeline--one-column"
              v-for="(
                interview_data, interview_index
              ) in all_dashboard_data.upcoming_interview"
              :key="interview_index"
            >
              <div class="vertical-timeline-element">
                <div>
                  <span class="vertical-timeline-element-icon bounce-in">
                    <i class="badge badge-dot badge-dot-xl badge-success"></i>
                  </span>
                  <div class="vertical-timeline-element-content bounce-in">
                    <h4 class="timeline-title">
                      {{ $t("interview_with") }}
                      {{ interview_data.fetch_candidate_name.name }}
                    </h4>
                    <p class="m-0">
                      {{ interview_data.fetch_job_details.job_title }}
                      <!-- <a href="javascript:void(0);">{{ interview_data.interview_time | formatTime }}</a> -->
                    </p>
                    <div v-if="interview_data.fetch_interview_name">
                      <span class="font-weight-bold"
                        >{{ $t("interviewer") }}:</span
                      >
                      &nbsp;{{ interview_data.fetch_interview_name.Full_Code }}
                    </div>
                    <div v-else-if="interview_data.is_client_interview">
                      <span class="font-weight-bold"
                        >{{ $t("interviewer") }}:</span
                      >
                      &nbsp;Client - {{ interview_data.client_name }}
                    </div>
                    <div v-else>
                      <span class="font-weight-bold"
                        >{{ $t("interviewer") }}:</span
                      >
                      &nbsp;{{ $t("no_data_found") }}
                    </div>
                    <span
                      class="vertical-timeline-element-date margin-interview"
                    >
                      {{ interview_data.interview_date | formatDate }}

                      <div>
                        {{ interview_data.interview_time | formatTime }}
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import VueElementLoading from "vue-element-loading";

export default {
  components: {
    PageTitle,
    VueElementLoading,
  },
  data: () => ({
    candidate_activity: "",
    loader: false,
    inactive_jobs_count: null,
    all_dashboard_data: "",
    candidate_applied_job_array: [],
  }),
  mounted() {
    this.fetchCandidateActivityDetails();
  },
  methods: {
    viewCandidatedetails(
      slug,
      candidate_id,
      candidate_slug,
      candiadte_job_status
    ) {
      this.$router.push({
        name: "applied_candidates",
        query: {
          slug: slug,
          candidate_id: candidate_id,
          candidate_slug: candidate_slug,
          candiadte_job_status: candiadte_job_status,
        },
      });
    },
    goToViewAll(page_details) {
      this.$emit("jobDetails", page_details);
    },
    // goToCandidates(candidate_tab_details) {
    //   this.$emit("candidateDetails", candidate_tab_details);
    // },
    viewCandidateJobdetails(slug, tabs_details, retrived_data) {
      this.$router.push({
        name: "candidate_applied_job",
        query: {
          slug: slug,
          tabs_details: tabs_details,
          retrived_data: retrived_data,
        },
      });
    },
    fetchCandidateActivityDetails() {
      this.loader = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_candidates_activity")
        .then((res) => {
          this.loader = false;
          if (res.data.status == "S") {
            this.all_dashboard_data = res.data;
            this.candidate_applied_job_array = res.data.candidate_applied_job;
          } else if (res.data.status == "E") {
            this.message = res.data.message;
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
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
          console.log(" error" + err);
        });
    },
  },
};
</script>
<style scoped>
.upcoming_interview_title {
  font-size: 14px;
  font-weight: bold;
  margin-top: -8px;
}
.activity_font {
  margin: 24px 0px 33px 13px;
  font-weight: bold;
  font-size: 16px;
}
.card-height {
  height: 134px;
  border-bottom: 6px solid #ccc !important ;
  border-color: #f44336 !important;
  border-radius: 10px 10px 10px 10px;
}
.all_card_font {
  text-align: center;
  font-size: 40px;
  margin: 0px;
  font-weight: bold;
}

.text-hover:hover {
  color: green;
  font-weight: bold;
  cursor: pointer;
}
.text-hover-closed:hover {
  color: red;
  font-weight: bold;
  cursor: pointer;
}
.border-color-candidates {
  border-color: #14a6b1 !important;
}
.candidate_height {
  height: 100px;
}
/* .candiate_color {
  color: #12a2e0;
} */
.tracking_border {
  border-color: #f79202 !important;
}
.upcoming_interview_card {
  height: 300px;
  margin-left: -7px;
  border-radius: 10px 10px 10px 10px;
  overflow-y: scroll;
}
.candidate_border_style {
  background-color: #abcef157 !important;
  border: 1px solid aliceblue;
  border-radius: 5px 5px 5px 5px;
  padding: 2px;
  text-align: center;
  color: #3f6ad8;
  font-weight: bold;
}
.candiate_contact_color {
  color: #f69102;
  background: #ffd69c69 !important;
}
.rejected_color {
  color: red;
  background: #faadad75 !important;
}
.hired_color {
  color: green;
  background: #a0e1a066 !important;
}
.interview_border {
  background: #d6e9fd;
  height: 70px;
  margin: 10px;
  border-radius: 7px 7px 7px 7px;
  border-left: 5px solid #2b85df !important;
  padding: 10px;
  border: 1px solid aliceblue;
}
.display_interview {
  color: gray;
  font-size: 12px;
}
.candidate_hover:hover {
  color: #16aaff;
  cursor: pointer;
  font-weight: bold;
}
.cursor_pointer {
  cursor: pointer;
  transition: transform 0.5s;
}
.cursor_pointer:hover {
  transform: scale(1.05);
  font-weight: bold;
}
.link_color {
  /* color: #3f6ad8 !important; */
  position: absolute;
  right: 10px;
  top: 10px;
}
.v-tabs >>> .v-item-group {
  position: relative !important;
}
.time_line_card {
  width: 100%;
  height: 500px;
  overflow-y: scroll;
}
.margin-interview {
  margin-left: -11px;
}
</style>
