<template>
  <div class="main-20">
    <!-- <div flat color="white" class="row py-5 pl-5 align-items-center w-100">
      <page-title
        class="col-md-4"
        :heading="$t('interview')"
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
            ></v-text-field>
          </template>
          <span>{{ $t("search") }}</span>
        </v-tooltip>
      </div>
      <div class="col-md-2">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              color=" btn mr-2 mb-2 mr-5 hover_shine add_new"
              small
              class="mb-2"
              v-on="on"
              @click="openDialog(false)"
              >{{ $t("schedule_interview") }}</v-btn
            >
          </template>
          <span>{{ $t("schedule_interview") }}</span>
        </v-tooltip>
      </div>
    </div> -->
    <div>
      <ScheduleInterview
        :schedule_dialog="schedule_dialog"
        :edit_schedule_interview="edit_schedule_interview"
        :schedule_interview_slug="schedule_interview_slug"
        @scheduleDialog="scheduleDialog"
        @tabUpdates="tabUpdates"
      />
    </div>
    <v-data-table
      :headers="headers"
      :items="candiate_interview_details"
      :search="search"
      :loading="initval"
      :single-expand="singleExpand"
      class="mt-2"
    >
      <template v-slot:item="{ item, expand, isExpanded }">
        <tr>
          <td @click="interviewDialog(item)" class="date_cursor">
            {{ item.interview_date | formatDate }}
          </td>
          <td>
            {{ item.interview_time | formatTime }}
          </td>
          <td>
            <span v-if="item.fetch_job_details">{{
              item.fetch_job_details.job_title
            }}</span>
            <span v-else>{{ $t("not_appllicable") }}</span>
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
          <td
            v-else-if="item.is_client_interview && item.client_name"
          >
            {{ $t("Client") }} - {{ item.client_name }}
          </td>
          <td v-else>{{ $t("not_appllicable") }}}</td>

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
                  item.job_id,
                  item.candidate_id
                )
              "
            ></v-autocomplete>
          </td>

          <td class="text-center px-0">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  v-on="on"
                  small
                  class="mr-2 edit_btn icon_size"
                  @click="openDialog(true, item.slug)"
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
                  :disabled="date >= item.interview_date"
                  @click="deleteItem(item.id)"
                  >mdi-trash-can-outline</v-icon
                >
              </template>
              <span>{{ $t("delete") }}</span>
            </v-tooltip>
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
    <v-dialog
      persistent
      v-model="view_interview_details"
      small
      transition="dialog-bottom-transition"
      max-width="800px"
    >
      <v-card class="container" style="padding: 0px !important">
        <v-toolbar color="primary" dark>
          <span class="headline" v-if="interview_details.fetch_job_details"
            >{{ interview_details.fetch_job_details.job_title }} &nbsp;{{
              $t("interview")
            }}</span
          >
          <span class="headline" v-else>{{ $t("schedule_interview") }}</span>
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
        <v-layout>
          <div
            v-if="interview_details.fetch_candidate_name"
            class="p-3 d-flex justify-content-between"
            style="width: 100%"
          >
            <div>
              <div class="candidate_heading_font">
                {{ $t("candidate_name") }}
              </div>
              <div class="candiate_font">
                {{ interview_details.fetch_candidate_name.name }}
              </div>
            </div>
            <div>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    medium
                    color="primary"
                    dark
                    v-on="on"
                    class="vicon_llink mr-1 pb-2 edit_cursor"
                    @click="editinetrviewDetails(true, interview_details.slug)"
                  >
                    mdi-pencil-circle
                  </v-icon>
                </template>
                <span>{{ $t("edit") }}</span>
              </v-tooltip>
            </div>
          </div>
        </v-layout>
        <v-layout>
          <div class="row p-3">
            <div class="col-md-4">
              <div class="candidate_heading_font">
                {{ $t("experience") }}
              </div>
              <div class="candiate_font">
                <span
                  v-if="
                    interview_details.fetch_candidate_name &&
                    interview_details.fetch_candidate_name.total_experience
                  "
                >
                  {{ interview_details.fetch_candidate_name.total_experience }}
                  {{
                    interview_details.fetch_candidate_name
                      .total_experience_months
                  }}
                  Years
                </span>
                <span v-else>
                  {{ $t("no_data_found") }}
                </span>
              </div>
            </div>
            <div class="col-md-4">
              <div class="candidate_heading_font">
                {{ $t("notice_period") }}
              </div>
              <div class="candiate_font">
                <span
                  v-if="
                    interview_details.fetch_candidate_name &&
                    interview_details.fetch_candidate_name.notice_period
                  "
                >
                  {{ interview_details.fetch_candidate_name.notice_period }}
                </span>
                <span v-else>
                  {{ $t("no_data_found") }}
                </span>
              </div>
            </div>
            <div class="col-md-4">
              <div class="candidate_heading_font">
                {{ $t("cctc/ectc") }}
              </div>
              <div class="candiate_font">
                <span
                  v-if="
                    interview_details.fetch_candidate_name &&
                    interview_details.fetch_candidate_name.current_ctc
                  "
                >
                  {{ interview_details.fetch_candidate_name.current_ctc }} /{{
                    interview_details.fetch_candidate_name.expected_ctc
                  }}
                </span>
                <span v-else>
                  {{ $t("no_data_found") }}
                </span>
              </div>
            </div>
          </div>
        </v-layout>
        <v-layout>
          <div class="row p-3">
            <div class="col-md-4">
              <div class="candidate_heading_font">
                {{ $t("interview_date") }}
              </div>
              <div class="candiate_font">
                <span v-if="interview_details">
                  {{ interview_details.interview_date | formatDate }}
                </span>
                <span v-else>
                  {{ $t("no_data_found") }}
                </span>
              </div>
            </div>
            <div class="col-md-4">
              <div class="candidate_heading_font">
                {{ $t("interview_time") }}
              </div>
              <div class="candiate_font">
                <span v-if="interview_details.fetch_candidate_name">
                  {{ interview_details.interview_time | formatTime }}
                </span>
                <span v-else>
                  {{ $t("no_data_found") }}
                </span>
              </div>
            </div>
            <div class="col-md-4">
              <div class="candidate_heading_font">
                {{ $t("duration") }}
              </div>
              <div class="candiate_font">
                <span v-if="interview_details">
                  {{ interview_details.interview_duration }}
                </span>
                <span v-else>
                  {{ $t("no_data_found") }}
                </span>
              </div>
            </div>
          </div>
        </v-layout>
        <v-layout>
          <div class="row p-3">
            <div class="col-md-4">
              <div class="candidate_heading_font">
                {{ $t("interview_type") }}
              </div>
              <div class="candiate_font">
                <span v-if="interview_details.interview_type">
                  {{ interview_details.interview_type }}
                </span>
                <span v-else>
                  {{ $t("no_data_found") }}
                </span>
              </div>
            </div>
            <div class="col-md-4">
              <div class="candidate_heading_font">
                {{ $t("interview_format") }}
              </div>
              <div class="candiate_font">
                <span
                  v-if="
                    interview_details.interview_type &&
                    interview_details.interview_type == 'Online Interiew'
                  "
                >
                  <a
                    :href="interview_details.interview_format"
                    target="_blank"
                    >{{ interview_details.interview_format }}</a
                  >
                </span>

                <span
                  v-else-if="
                    interview_details.interview_type &&
                    interview_details.interview_type == 'Phone'
                  "
                  >{{ interview_details.interview_format }}</span
                >
                <span v-else> - </span>
              </div>
            </div>
            <div class="col-md-4">
              <div class="candidate_heading_font">
                {{ $t("interviewer") }}
              </div>
              <div class="candiate_font">
                <span
                  v-if="
                    interview_details  && interview_details.fetch_interview_name
                  "
                >
                  {{ interview_details.fetch_interview_name.Full_Code }}
                </span>
                <span
                  v-else-if="
                    interview_details && interview_details.is_client_interview
                  "
                >
                  {{ interview_details.client_name }}
                </span>
                <span v-else>
                  {{ $t("no_data_found") }}
                </span>
              </div>
            </div>
          </div>
        </v-layout>
        <!-- {{ interview_details }} -->
      </v-card>
    </v-dialog>
    <ConfirmDialog
      :show="showConfirmDialog"
      :cancel="cancel"
      :confirm="confirm"
      :id="delete_id"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('delete_confirmation')"
    />
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
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import ScheduleInterview from "./ScheduleInterview.vue";
export default {
  props: ["interview_status", "search"],
  components: {
    PageTitle,
    ConfirmDialog,
    ScheduleInterview,
  },
  data: () => ({
    google_icon: {
      icon_name: "settings_suggest",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    edit_schedule_interview: false,
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    schedule_interview_slug: "",
    schedule_dialog: false,
    document_url: process.env.VUE_APP_IMAGE_PATH,
    search: "",
    showConfirmDialog: false,
    showStatusDialog: false,
    delete_id: null,
    status_id: null,
    isDisabled: false,
    initval: false,
    valid:false,
    candiate_interview_details: [],
    user: "",
    view_interview_details: false,
    interview_details: "",
    interviews_array: [],
    showStatuschange: false,
    candidate_interview_status: "",
    job_candidate_id: null,
    reject_hired_dialog: false,
    job_id: null,
    singleExpand:false,
    submit_btn_disable: false,
  }),
  computed: {
    headers() {
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
          text: this.$t("job_title"),
          align: "left",
          sortable: true,
          value: "fetch_job_details.job_title",
          width: "18%",
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
          value: "status",
        },
        {
          text: "Actions",
          value: "name",
          align: "center",
          sortable: false,
        },
      ];
    },
  },
  watch: {
    interview_status: {
      immediate: true,
      handler() {
        if (this.interview_status) {
          // alert(this.interview_status)
          this.fetchJobs(this.interview_status);
          this.fetchLookups();
        }
      },
    },
    search: {
      immediate: true,
      handler() {
        if (this.search) {
          this.search = search;
        }
      },
    },
  },

  methods: {
    saveCandidateComments() {
      if (this.$refs.reject_hire.validate()) {
        this.isBtnLoading = true;
        this.submit_btn_disable = true;

        this.changeJobsStatus();
        // this.isBtnLoading = false;

        console.log("error", err);
      }
    },
    cancelchange() {
      this.showStatuschange = false;
      this.reject_hired_dialog = false;
      this.reject_hired_comments = "";
      this.submit_btn_disable = false;
      this.fetchJobs(this.interview_status);
    },
    confirmChange() {
      this.reject_hired_dialog = true;
    },
    showconfirmChange(status, id, candiate_id) {
      this.showStatuschange = true;
      this.candidate_interview_status = status;
      this.job_id = id;
      this.job_candidate_id = candiate_id;
    },
    changeJobsStatus() {
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "update_candidate_job_status",
          {
            // interview_id: this.interview_id,
            interview_status: this.candidate_interview_status,
            job_id: this.job_id,
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
    editinetrviewDetails(edit, slug) {
      this.view_interview_details = false;
      this.interview_details = "";
      this.edit_schedule_interview = edit;
      this.schedule_interview_slug = slug;
      this.schedule_dialog = true;
    },
    close() {
      this.view_interview_details = false;
      this.interview_details = "";
    },
    interviewDialog(all_candidate_details) {
      this.view_interview_details = true;
      this.interview_details = all_candidate_details;
    },
    tabUpdates(data) {
      this.fetchJobs();
      cosole.log(data);
    },
    scheduleDialog(dialog_value) {
      this.schedule_dialog = dialog_value;
      this.fetchJobs(this.interview_status);
    },
    openDialog(edit, slug) {
      this.edit_schedule_interview = edit;
      this.schedule_interview_slug = slug;
      this.schedule_dialog = true;
    },
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm(id) {
      this.deleteConfirm(id);
      this.showConfirmDialog = false;
    },

    deleteConfirm(id) {
      this.deleteScheduleInterview(id);
    },

    deleteItem($id) {
      this.delete_id = $id;
      this.showConfirmDialog = true;
    },
    fetchJobs(status) {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetch_all_schedule_interview",
          {
            params: {
              interview_status: status,
            },
          }
        )
        .then((res) => {
          console.log(res);
          this.candiate_interview_details = res.data.candiate_interview_details;
          this.initval = false;
        })
        .catch((err) => {
          this.initval = false;
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
        });
    },
    deleteScheduleInterview(id) {
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "delete_interview_schedule/" + id
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
            this.initval = false;
          } else {
            this.flashMessage.error({
              message: this.array_data,
            });
          }
        })
        .catch((err) => {
          this.initval = false;
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
.date_cursor {
  cursor: pointer;
  color: #3f6ad8;
}
.candiate_font {
  font-size: 14px;
  margin-top: 2px;
}
.candidate_heading_font {
  font-weight: bold;
  font-size: 15px;
}
.edit_cursor {
  cursor: pointer;
}
</style>
