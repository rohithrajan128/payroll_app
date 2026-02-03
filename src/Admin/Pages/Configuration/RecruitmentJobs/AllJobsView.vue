<template>
  <div class="main-20">
    <VueElementLoading
      :active="loader"
      spinner="bar-fade-scale"
      color="var(--primary)"
    />

    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title
        class="col-md-4"
        :heading="$t('jobs')"
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
              v-model="search_jobs"
              append-icon="search"
              label="Search"
              class="srch_bar"
              hide-details
            ></v-text-field>
          </template>
          <span>{{ $t("search") }}</span>
        </v-tooltip>
      </div>

      <div class="col-md-2" v-if="all_job_status == 'Active'">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <router-link
              class="text-decoration-none"
              :to="{ name: 'jobs_amend' }"
            >
              <v-btn
                color=" btn mr-2 mb-2 hover_shine add_new"
                small
                class="mb-2"
                v-on="on"
                >{{ $t("add_new") }}</v-btn
              >
            </router-link>
          </template>
          <span>{{ $t("add_new") }}</span>
        </v-tooltip>
      </div>
    </div>
    <div
      v-if="JobSearch && !JobSearch.length > 0"
      class="d-flex justify-content-center no_job_found mt-4"
    >
      {{ $t("no_job_found") }}
    </div>
    <div v-else>
      <div
        class="row jobs_row"
        v-for="(job_details, index) in JobSearch"
        :key="index"
      >
        <div class="col-md-3">
          <div
            class="job_title"
            @click="
              viewCandidateJobdetails(job_details.slug, 'all_jobs', 'All')
            "
          >
            {{ job_details.job_title }}
          </div>

          <div>
            <span class="font-weight-bold"> {{ $t("client") }}</span>
            <span v-if="job_details.client"> :{{ job_details.client }}</span>
            <span v-else>
              {{ $t("empty_field") }}
            </span>
          </div>
          <div>
            <span class="font-weight-bold"> {{ $t("work_location") }}</span>
            <span v-if="job_details.work_location">
              :{{ job_details.work_location }}</span
            >
            <span v-else>
              {{ $t("empty_field") }}
            </span>
          </div>
          <div>
            <span class="font-weight-bold"> {{ $t("work_mode") }}</span>
            <span v-if="job_details.work_mode">
              :{{ job_details.work_mode }}</span
            >
            <span v-else>
              {{ $t("empty_field") }}
            </span>
          </div>
        </div>
        <div class="col-md-6">
          <div class="row">
            <div
              class="col-md-3"
              @click="
                viewCandidateJobdetails(job_details.slug, 'active', 'Active')
              "
            >
              <div class="text-center candidate_color">
                {{ $t("active_candidates") }}
              </div>
              <div class="text-center mt-1 cursor_pointer">
                {{ job_details.active_candidates }}
              </div>
            </div>
            <div
              class="col-md-2"
              @click="
                viewCandidateJobdetails(
                  job_details.slug,
                  'contacting',
                  'Contacting'
                )
              "
            >
              <div class="text-center candidate_color">
                {{ $t("contacting") }}
              </div>
              <div
                class="text-center mt-1 cursor_pointer"
                v-if="
                  job_details.contacting_list ||
                  job_details.contacting_list == 0
                "
              >
                {{ job_details.contacting_list }}
              </div>
              <div v-else class="text-center">
                {{ $t("empty_field") }}
              </div>
            </div>
            <div
              class="col-md-2"
              @click="
                viewCandidateJobdetails(job_details.slug, 'hired', 'Hired')
              "
            >
              <div class="text-center candidate_color">
                {{ $t("hired") }}
              </div>
              <div class="text-center mt-1 cursor_pointer">
                {{ job_details.hired_candidates }}
              </div>
            </div>
            <!-- <div class="col-md-2">
              <div class="text-center font-weight-bold">
                {{ $t("posted_on") }}
              </div>
              <div class="text-center mt-1">
                {{ job_details.created_at | formatdateMonthyear }}
              </div>
            </div> -->
            <div class="col-md-2">
              <div class="text-center font-weight-bold">
                {{ $t("due_date") }}
              </div>
              <div
                class="text-center mt-1"
                v-if="job_details.job_end_date != null"
              >
                {{ job_details.job_end_date | formatdateMonthyear }}
              </div>
              <div v-else class="text-center">
                {{ $t("empty_field") }}
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="d-flex justify-content-between">
            <v-flex xs12 md8 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    outlined
                    v-on="on"
                    v-bind:label="$t('job_status')"
                    v-model="job_details.job_status"
                    :items="job_status_array"
                    item-value="shortname"
                    item-text="longname"
                    dense
                    @change="
                      checkJobEndDate(
                        job_details.job_status,
                        job_details.id,
                        job_details.job_end_date
                      )
                    "
                  >
                  </v-autocomplete>
                </template>
                <span>{{ $t("job_status") }}</span>
              </v-tooltip>
              <div class="text-center font-weight-bold posted_margin">
                {{ $t("posted_on") }}
                <span class="font-weight-normal"
                  >:{{ job_details.created_at | formatdateMonthyear }}</span
                >
              </div>
              <!-- <div class="text-center mt-1">
                {{ job_details.created_at | formatdateMonthyear }}
              </div> -->
            </v-flex>

            <div>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <router-link
                    small
                    :to="{
                      name: 'jobs_amend',
                      query: { slug: job_details.slug },
                    }"
                  >
                    <v-icon
                      small
                      class="mr-2 edit_btn icon_size edit_cursor"
                      v-on="on"
                      >mdi-pencil-outline</v-icon
                    >
                  </router-link>
                </template>
                <span>{{ $t("edit") }}</span>
              </v-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ConfirmDialog
      :show="showConfirmDialog"
      :cancel="cancel"
      :confirm="confirm"
      :id="delete_id"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('delete_confirmation')"
    />
    <ConfirmDialog
      :show="showStatusDialog"
      :cancel="cancelStatus"
      :confirm="confirmStatus"
      :id="status_id"
      v-bind:title="$t('confirm')"
      :primary_delete="delete_primary"
      :description="description_text_status"
    />
    <div class="text-center mt-10" v-if="JobSearch.length > 0">
      <v-pagination
        :length="Math.ceil(jobs_array.total / 10)"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        v-model="jobs_array.page"
        circle
        @input="onPageChange"
      >
      </v-pagination>
    </div>
  </div>
</template>
<script>
import VueElementLoading from "vue-element-loading";
import moment from "moment";

import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
export default {
  props: ["component_job_status"],
  components: {
    PageTitle,
    ConfirmDialog,
    VueElementLoading,
  },
  data: () => ({
    google_icon: {
      icon_name: "settings_suggest",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    delete_primary: "",
    description_text_status: "",
    search_jobs: "",
    loader: false,
    job_status_array: [],
    job_status: "",
    showConfirmDialog: false,
    job_status: "",
    job_id: null,
    showStatusDialog: false,
    delete_id: null,
    status_id: null,
    isDisabled: false,
    jobs_array: [],
    user: "",
    all_job_status: "",
  }),
  computed: {
    JobSearch() {
      if (this.search_jobs) {
        return this.jobs_array.data.filter((job_data) => {
          if (job_data.job_title != null) {
            return (
              job_data.job_title
                .toLowerCase()
                .includes(this.search_jobs.toString().toLowerCase()) ||
              job_data.client
                .toLowerCase()
                .includes(this.search_jobs.toString().toLowerCase()) ||
              job_data.work_location
                .toLowerCase()
                .includes(this.search_jobs.toString().toLowerCase()) ||
              job_data.work_mode
                .toLowerCase()
                .includes(this.search_jobs.toString().toLowerCase()) ||
              job_data.created_at
                .toLowerCase()
                .includes(this.search_jobs.toString().toLowerCase())
            );
          }
        });
      } else {
        return this.jobs_array.data;
      }
    },
  },
  watch: {
    component_job_status: {
      immediate: true,
      handler() {
        if (this.component_job_status) {
          this.all_job_status = this.component_job_status;
          this.fetchJobs();
        }
      },
    },
  },
  mounted() {
    this.fetclookups();
  },

  methods: {
    onPageChange(page) {
      this.loader = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_all_recruitment_job", {
          params: {
            job_status: this.all_job_status,
          },
        })

        .then((res) => {
          this.jobs_array = res.data.jobs_details;
          this.jobs_array = this.paginator(this.jobs_array, page, 10);
          this.loader = false;
          // this.recommendeddetails = res.data.recomended_details.data;
          // this.paginate_recommended = res.data.recomended_details;
        })
        .catch((err) => {
          this.loader = false;
          console.log("this error" + err);
        });
    },
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
    checkJobEndDate(job_status, id, end_date) {
      if (end_date && end_date <= moment().format("YYYY-MM-DD")) {
        // alert("dfsd")
        this.description_text_status = this.$t(
          "please_change_due_date_of_project"
        );
        this.delete_primary = "Primary";
        this.showStatusDialog = true;
      } else {
        this.confirmJobStatus(job_status, id);
        this.delete_primary = "";
        this.description_text_status = this.$t("status_change");
      }
      console.log(id);
      console.log(job_status);
    },
    confirmJobStatus(job_status, id) {
      this.showStatusDialog = true;
      this.job_status = job_status;
      this.job_id = id;
    },
    changeJobsStatus(jobs_status, id) {
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "update_recruitment_job_status",
          {
            id: id,
            job_status: jobs_status,
          }
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
            this.fetchJobs();
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.loader = false;
          } else {
            this.flashMessage.error({
              message: this.array_data,
            });
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
        });
    },
    fetclookups() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "JOB_STATUS",
          },
        })
        .then((response) => {
          this.job_status_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm(id) {
      this.deleteConfirm(id);
      this.showConfirmDialog = false;
    },
    cancelStatus() {
      this.showStatusDialog = false;
      this.fetchJobs();
    },
    confirmStatus() {
      // this.statusUpdate()

      this.changeJobsStatus(this.job_status, this.job_id);
      this.showStatusDialog = false;
    },

    deleteConfirm(id) {
      this.deleteAnnouncement(id);
    },

    deleteItem($id) {
      this.delete_id = $id;
      this.showConfirmDialog = true;
    },
    fetchJobs() {
      this.loader = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_all_recruitment_job", {
          params: {
            job_status: this.all_job_status,
          },
        })
        .then((res) => {
          this.jobs_array = res.data.jobs_details;
          this.jobs_array = this.paginator(this.jobs_array, 1, 10);
          this.loader = false;
        })
        .catch((err) => {
          this.loader = false;
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
        });
    },
    paginator(items, current_page, per_page_items) {
      let page = current_page || 1,
        per_page = per_page_items || 10,
        offset = (page - 1) * per_page,
        paginatedItems = items.slice(offset).slice(0, per_page_items),
        total_pages = Math.ceil(items.length / per_page);

      return {
        page: page,
        per_page: per_page,
        pre_page: page - 1 ? page - 1 : null,
        next_page: total_pages > page ? page + 1 : null,
        total: items.length,
        total_pages: total_pages,
        data: paginatedItems,
      };
    },
    deleteAnnouncement(id) {
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "delete_announcement/" + id)
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
            this.fetchJobs();
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.loader = false;
          } else {
            this.flashMessage.error({
              message: this.array_data,
            });
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
        });
    },
    // updateEmployeeNumberStatus(id) {
    //   this.status_id = id;
    //   this.showStatusDialog = true;
    // },
    statusUpdate() {
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "update_recruitment_job_status",
          {
            id: this.status_id,
          }
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
            this.fetchJobs();
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
          } else {
            this.flashMessage.error({
              message: this.array_data,
            });
            this.fetchJobs();
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
.description_hover_div {
  height: 20px !important;
  width: 46vw !important;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
}
.jobs_row {
  border-radius: 10px 10px 10px 10px;
  border: 1px solid gray;
  margin: 20px;
}
.jobs_row:hover {
  box-shadow: 0px 0px 3px;
}
.job_title {
  color: #1669d2;
  font-weight: 800;
  font-size: 16px;
  cursor: pointer;
}
.no_job_found {
  font-size: 18px;
}
.edit_cursor {
  cursor: pointer;
}
.candidate_color {
  color: #1568d1;
  cursor: pointer;
}
.cursor_pointer {
  cursor: pointer;
}
.cursor_pointer:hover {
  font-weight: bold;
}
.candidate_color:hover {
  color: black;
  transform: scale(1.05);
}
.posted_margin {
  margin-top: -21px;
}
</style>
