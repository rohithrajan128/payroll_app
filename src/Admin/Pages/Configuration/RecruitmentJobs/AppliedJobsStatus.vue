<template>
  <div class="mt-2">
    <v-data-table
      :headers="headers"
      :items="candidate_job_array"
      :loading="initval"
      :search="search"
      :single-expand="singleExpand"
      item-key="id"
      v-if="
        page == 'all_jobs' ||
        page == 'active' ||
        page == 'contacting' ||
        page == 'onhold' ||
        page == 'rejected'
      "
    >
      <template v-slot:item="{ item, expand, isExpanded }">
        <tr v-bind:class="[isExpanded == true ? 'rowisexpandcolor' : '']">
          <td>
            <router-link
              class="text-decoration-none"
              :to="{
                name: 'applied_candidates',
                query: {
                  slug: job_details.slug,
                  candidate_id: item.id,
                  candidate_slug: item.slug,
                  candiadte_job_status: candidate_fetch,
                },
              }"
              >{{ item.name }}</router-link
            >
          </td>
          <!-- <td>{{ item.country_code }}</td> -->
          <td>{{ item.country_code }} {{ item.mobile }}</td>

          <td>
            <span v-if="item.total_experience_year > 0">
              {{ item.total_experience_year }}.
              {{ item.total_experience_months }}
              <span v-if="item.total_experience_year > 1">{{
                $t("years")
              }}</span>
              <span v-else>{{ $t("year") }}</span>
            </span>
            <!-- <span v-else>{{ $t('zero_experience') }}</span> -->
            <span v-else>{{ $t("empty_field") }}</span>
          </td>

          <td>
            <span v-if="item.notice_period">{{ item.notice_period }}</span>
            <span v-else>{{ $t("empty_field") }}</span>
          </td>
          <td v-if="item.job_status">
            <v-autocomplete
              dense
              v-model="item.job_status"
              v-bind:label="$t('interview_status')"
              :items="interviews_array"
              item-text="longname"
              item-value="shortname"
              class="mt-5"
              outlined
              @change="showconfirmChange(item.job_status, null, item.id)"
            ></v-autocomplete>
          </td>

          <td v-else>{{ $t("empty_field") }}</td>
          <td
            @click="expand(!isExpanded)"
            v-if="
              item.fetch_candidate_interview &&
              item.fetch_candidate_interview.length > 0
            "
          >
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn icon v-if="isExpanded == false" v-on="on">
                  <v-icon>mdi-arrow-down-drop-circle-outline</v-icon>
                </v-btn>
                <v-btn icon v-else>
                  <v-icon>mdi-arrow-up-drop-circle-outline</v-icon>
                </v-btn>
              </template>
              <span>{{ $t("add_details") }}</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <tr class="dropdowncandidatedetails">
          <td :colspan="headers.length + 1" class="p-0">
            <v-simple-table class="simpletableformetricdisplaydropdown">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      <b>{{ $t("comments") }}</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <!-- <div>
                        {{ item.reject_hired_comments }}
                      </div> -->
                      <!-- <div v-else class="text-center">
                        {{ $t("no_details_found") }}
                      </div> -->

                      <div
                        v-for="(notes, index) in item.fetch_candidate_interview"
                        :key="index"
                      >
                        <span style="font-weight: bold !important">
                          {{ notes.interview_status }}:
                        </span>
                        <span style="font-weight: normal !important">
                          {{ notes.interview_status_comments }}
                        </span>
                        <v-divider class="m-0"></v-divider>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </td>
        </tr>
      </template>
    </v-data-table>

    <v-data-table
      :headers="headers_interview"
      :items="candidate_job_array"
      :loading="initval"
      :search="search"
      item-key="id"
      :single-expand="singleExpandInterview"
      v-else
    >
      <template v-slot:item="{ item ,expand, isExpanded }">
        <!-- <template v-slot:item="props"> -->
        <tr v-bind:class="[isExpanded == true ? 'rowisexpandcolor' : '']">
          <td>
            <router-link
              class="text-decoration-none"
              :to="{
                name: 'applied_candidates',
                query: {
                  slug: job_details.slug,
                  candidate_id: item.candidate_id,
                  candidate_slug: item.slug,
                  candiadte_job_status: candidate_fetch,
                },
              }"
            >
              {{ item.interview_date | formatDate }}
            </router-link>
          </td>
          <td>
            {{ item.interview_time | formatTime }}
          </td>

          <td v-if="item.fetch_candidate_name">
            {{ item.fetch_candidate_name.name }}
          </td>
          <td v-else>{{ $t("not_appllicable") }}</td>
          <td>
            {{ item.interview_type }}
          </td>

          <td v-if="item.fetch_interview_name">
            {{ item.fetch_interview_name.Full_Code }}
          </td>
          <td v-else-if="item.is_client_interview && item.client_name">
            {{ $t("Client") }} - {{ item.client_name }}
          </td>
          <td v-else>{{ $t("not_appllicable") }}</td>
          <td class="text-center">
            <v-autocomplete
              dense
              v-model="item.interview_status"
              v-bind:label="$t('interview_status')"
              :items="interviews_array"
              item-text="longname"
              item-value="shortname"
              class="mt-5"
              outlined
              @change="
                showconfirmChange(
                  item.interview_status,
                  item.id,
                  item.candidate_id
                )
              "
            ></v-autocomplete>
          </td>
          <td
            @click="expand(!isExpanded)"
            v-if="
             item.fetch_candidate_comments &&
             item.fetch_candidate_comments.length > 0
            "
          >
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn icon v-if="isExpanded == false" v-on="on">
                  <v-icon>mdi-arrow-down-drop-circle-outline</v-icon>
                </v-btn>
                <v-btn icon v-else>
                  <v-icon>mdi-arrow-up-drop-circle-outline</v-icon>
                </v-btn>
              </template>
              <span>{{ $t("add_details") }}</span>
            </v-tooltip>
          </td>
          <!-- <td class="text-center px-0">

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  v-on="on"
                  small
                  class="mr-2 edit_btn icon_size"
                  @click="openDialog(true, props.item.slug)"
                  >mdi-pencil-outline</v-icon
                >
              </template>
              <span>{{ $t("edit") }}</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  class="delete_btn icon_size"
                  v-on="on"
                  small
                  :disabled="date >= props.item.interview_date"
                  @click="deleteItem(props.item.id)"
                  >mdi-trash-can-outline</v-icon
                >
              </template>
              <span>{{ $t("delete") }}</span>
            </v-tooltip>
          </td> -->
     
        </tr>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <tr class="dropdowncandidatedetails">
          <td :colspan="headers.length + 1" class="p-0">
            <v-simple-table class="simpletableformetricdisplaydropdown">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      <b>{{ $t("comments") }}</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div
                        v-for="(notes, index) in item.fetch_candidate_comments"
                        :key="index"
                      >
                        <span style="font-weight: bold !important">
                          {{ notes.interview_status }}:
                        </span>
                        <span style="font-weight: normal !important">
                          {{ notes.interview_status_comments }}
                        </span>
                        <v-divider class="m-0"></v-divider>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </td>
        </tr>
      </template>
    </v-data-table>

    <v-dialog
      persistent
      v-model="reject_hired_dialog"
      small
      transition="dialog-bottom-transition"
      max-width="800px"
    >
      <v-card class="container" style="padding: 0px !important">
        <v-toolbar color="primary" dark>
          <span class="headline">{{ $t("comments") }}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                @click="cancelchange"
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
                  @click="cancelchange"
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
    <ConfirmDialog
      :show="showStatuschange"
      :cancel="cancelchange"
      :confirm="confirmChange"
      :id="status_id"
      v-bind:title="$t('confirm')"
      :description="$t('interview_status_change')"
    />
  </div>
</template>

<script>
// import PageTitle from "../../../../Layout/Components/PageTitle.vue";
// import ScheduleInterview from "../Interviews/ScheduleInterview.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";

export default {
  components: {
    ConfirmDialog,
  },
  props: [
    "candidate_job_array",
    "job_details",
    "candidate_fetch",
    "tabs_page",
    "candidate_search",
  ],
  data: () => ({
    google_icon: {
      icon_name: "settings_suggest",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
    reject_hired_dialog: false,
    reject_hired_comments: "",
    page: "",
    isBtnLoading: false,
    initval: true,
    interviews_array: [],
    status_id: null,
    submit_btn_disable: false,
    applied_jobs_array: [],
    candidate_details_array: [],
    singleExpand: false,
    singleExpandInterview: false,
    showStatuschange: false,
    candidate_interview_status: "",
    interview_id: null,
    valid: true,
    job_candidate_id: null,
    candidate_applied_job: {
      candidate_id: null,
      job_id: null,
    },
  }),
  computed: {
    headers() {
      return [
        {
          text: "Name",
          align: "left",
          value: "name",
          width: "15%",
        },
        {
          text: "Phone Number",
          align: "left",
          value: "mobile",
          width: "15%",
        },
        {
          text: "Total Experirence",
          align: "left",
          value: "total_experience_year",
        },

        {
          text: "Notice Period",
          align: "left",
          value: "notie_period",
        },
        {
          text: "Status",
          align: "left",
          value: "job_status",
        },
      ];
    },
    headers_interview() {
      return [
        {
          text: this.$t("interview_date"),
          sortable: true,
          value: "interview_date",
        },
        {
          text: this.$t("interview_time"),
          sortable: true,
          value: "interview_time",
        },
        {
          text: this.$t("candidate_name"),
          sortable: true,
          value: "fetch_candidate_name.name",
        },

        {
          text: this.$t("interview_type"),
          value: "interview_type",
          sortable: true,
        },

        {
          text: this.$t("interviewer"),
          sortable: true,
          value: "no_of_vacancies",
        },

        {
          text: "Status",
          align: "center",
          value: "interview_status",
        },
      ];
    },
  },
  methods: {
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
    cancelchange() {
      this.showStatuschange = false;
      this.reject_hired_dialog = false;
      this.reject_hired_comments = "";
      this.submit_btn_disable = false;

      this.$emit("updated_interview_status", "updated");
    },
    showconfirmChange(status, id, candiate_id) {
      this.showStatuschange = true;
      this.candidate_interview_status = status;
      this.interview_id = id;
      this.job_candidate_id = candiate_id;
    },
    saveCandidateComments() {
      if (this.$refs.reject_hire.validate()) {
        this.isBtnLoading = true;
        this.submit_btn_disable = true;

        this.changeJobsStatus();
        // this.isBtnLoading = false;

        console.log("error", err);
      }
    },
    changeJobsStatus() {
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "update_candidate_job_status",
          {
            interview_id: this.interview_id,
            interview_status: this.candidate_interview_status,
            job_id: this.job_details.id,
            reject_hired_comments: this.reject_hired_comments,
            candidate_id: this.job_candidate_id,
          }
        )
        .then((res) => {
          this.cancelchange();
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            // this.fetchCandidateDetails();
            this.$emit("updated_interview_status", "updated");
            this.isBtnLoading = false;
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
    //  interview_status: this.candidate_interview_status,
    //     interview_id: this.interview_id,
    confirmChange() {
      this.reject_hired_dialog = true;
    },
  },
  watch: {
    candidate_search: {
      immediate: true,
      handler() {
        if (this.candidate_search) {
          this.search = this.candidate_search;
        } else {
          this.search = "";
        }
      },
    },
    candidate_job_array: {
      immediate: true,
      handler() {
        this.initval = true;
        if (this.candidate_job_array) {
          setTimeout(() => {
            this.initval = false;
          }, 300);
        }
      },
    },
    tabs_page: {
      immediate: true,
      handler() {
        this.initval = true;
        if (this.tabs_page) {
          this.page = this.tabs_page;

          this.fetchLookups();
        }
      },
    },
  },
};
</script>

<style scoped>
.simpletableformetricdisplaydropdown {
  background: #f0efef !important;
}
.rowisexpandcolor {
  background: white !important;
}
.w-100 {
  width: 100%;
}
</style>
