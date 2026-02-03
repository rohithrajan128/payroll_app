<template>
  <div class="height-scroll">
    <div v-if="!interviwe_details.length > 0" class="no-data-align">
      {{ $t("no_interviwe_scheduled_candidate") }}
    </div>
    <div
      v-for="(interview_data, interviwe_index) in sortedInterviewDetails"
      :key="interviwe_index"
      v-else
    >
      <v-card class="intreview-border mt-2 p-1">
        <div class="d-flex justify-content-between mt-2">
          <div class="flex-width">
            <div class="font-weight-bold candiate-name-font">
              {{ interview_data.fetch_candidate_name.salutation }}
              {{ interview_data.fetch_candidate_name.name }} -
              {{ interview_data.fetch_job_details.job_title }}
            </div>
            <div class="interview-date-font">
              {{ interview_data.interview_date | formatWithoutYearMonth }} |
              {{ interview_data.interview_date | formatMonthDate }} |
              {{ interview_data.interview_time | timeFormat }} | ({{
                interview_data.interview_duration
              }})
            </div>
            <div class="mt-1 font-weight-bold">
              <span>{{ interview_data.interview_type }}</span> :
              <span
                v-if="interview_data.interview_type == 'Online Interiew'"
                class="ml-2 font-weight-normal"
                ><a :href="interview_data.interview_format">{{
                  interview_data.interview_format
                }}</a></span
              >
              <span
                v-else-if="interview_data.interview_type == 'Phone'"
                class="ml-2 font-weight-normal"
                >{{ interview_data.interview_format }}</span
              >
              <span v-else>-</span>
            </div>
            <div class="font-weight-bold mt-2">
              {{ $t("comments") }}
            </div>
            <div
              v-if="
                interview_data.fetch_candidate_comments.length > 0
              "
            >
              <div
                v-for="(
                  interview_comments, interview_index
                ) in interview_data.fetch_candidate_comments"
                :key="interview_index"
              >
                <!-- {{interview_data.fetch_candidate_interview_comments[0].interview_status}} -->
                    <span style="font-weight: bold !important" >
                  {{ interview_comments.interview_status  }}:
                </span>
                <span style="font-weight: normal !important" >
                  {{ interview_comments.interview_status_comments  }}
                </span>
           

              </div>
            </div>
               <div v-else>
              {{ $t("no_data_found") }}
            </div>
          </div>
          <div class="p-1">
            <div class="status-margin">
              <v-autocomplete
                dense
                v-model="interview_data.interview_status"
                v-bind:label="$t('interview_status')"
                :items="interviews_array"
                item-text="longname"
                item-value="shortname"
                class="mt-5"
                outlined
                @change="
                  showconfirmChange(
                    interview_data.interview_status,
                    interview_data.job_id,
                    interview_data.id,
                    interview_data.candidate_id
                  )
                "
              ></v-autocomplete>
            </div>
            <div>
              {{ $t("interviewer") }}:
              <span class="reporting-border">
                <v-avatar size="20">
                  <v-img
                    v-if="
                      interview_data.fetch_interview_name &&
                      interview_data.fetch_interview_name.profile_pic
                    "
                    :src="
                      envImagePath +
                      interview_data.fetch_interview_name.profile_pic
                    "
                    alt
                  >
                  </v-img>

                  <img
                    v-else
                    src="@/assets/images/default-user-profile-picture.png"
                    alt
                  />
                </v-avatar>
                <span
                  class="reporting-name-font"
                  v-if="interview_data.fetch_interview_name"
                  >{{ interview_data.fetch_interview_name.Full_Code }}
                </span>
                <span
                  class="reporting-name-font"
                  v-else-if="interview_data.is_client_interview"
                  >Client - {{ interview_data.client_name }}
                </span>
                <span class="reporting-name-font" v-else
                  >{{ $t("no_data_found") }}
                </span>
              </span>
            </div>
          </div>
        </div>
      </v-card>
    </div>
    <ConfirmDialog
      :show="showStatuschange"
      :cancel="cancelchange"
      :confirm="confirmChange"
      v-bind:title="$t('confirm')"
      :description="$t('interview_status_change')"
    />
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
              <v-icon @click="close" class="dialogcloseinuserdetails" v-on="on"
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
</template>
<script>
import ConfirmDialog from "../Components/ConfirmDialog.vue";

export default {
  components: {
    ConfirmDialog,
  },
  props: ["interviwe_details", "interviews_array"],
  data: () => ({
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    showStatuschange: false,
    interview_status: "",
    job_id: null,
    recruitment_details: "",
    reject_hired_comments: "",
    reject_hired_dialog: false,
    submit_btn_disable: false,
    isBtnLoading: false,
    valid: false,
    interview_id:null,
    candidate_id: null,
  }),
  computed: {
    sortedInterviewDetails() {
    
    this
      return this.interviwe_details.sort((a, b) => {
        const dateA = new Date(a.interview_date + " " + a.interview_time);
        const dateB = new Date(b.interview_date + " " + b.interview_time);
        return dateA - dateB;
      });
    },
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },
  methods: {
    close() {
      this.reject_hired_dialog = false;
      this.reject_hired_comments = "";
      this.submit_btn_disable = false;
      // this.fetchCandidateDetails();
      this.showStatuschange = false;
    },
    showconfirmChange(status, job_id,id ,candidate_id) {
      this.showStatuschange = true;
      this.interview_status = status;
      this.candidate_id = candidate_id;
      this.job_id = job_id;
      this.interview_id = id;
    },
    cancelchange() {
      this.showStatuschange = false;

      this.$emit("updatedData", this.interview_status);
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
        .post(process.env.VUE_APP_API_URL_ADMIN + "update_candidate_job_status", {
          job_id: this.job_id,
          interview_status: this.interview_status,
          candidate_id: this.candidate_id,
          reject_hired_comments: this.reject_hired_comments,
          interview_id: this.interview_id,
        })
        .then((res) => {
          this.close();
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            // this.fetchCandidateDetails();
            this.$emit("updatedData", this.interview_status);

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
    confirmChange() {
      this.reject_hired_dialog = true;

      // axios
      //   .post(process.env.VUE_APP_API_URL_ADMIN + "update_interview_status", {
      //     interview_status: this.interview_status,
      //     job_id: this.job_id,
      //   })
      //   .then((res) => {
      //     if (Array.isArray(res.data.message)) {
      //       this.array_data = res.data.message.toString();
      //     } else {
      //       this.array_data = res.data.message;
      //     }
      //     if (res.data.status == "S") {
      //       this.flashMessage.success({
      //         message: this.array_data,
      //         time: 4000,
      //         blockClass: "custom-block-class",
      //       });
      //       this.message = res.data.message;
      //       this.showStatuschange = false;
      //     } else if (res.data.status == "E") {
      //       this.isBtnLoading = false;
      //       (this.isDisabled = false),
      //         this.flashMessage.error({
      //           message: this.array_data,
      //           time: 4000,
      //           blockClass: "custom-block-class",
      //         });
      //     } else {
      //       this.isBtnLoading = false;
      //       this.flashMessage.error({
      //         message: this.array_data,
      //       });
      //     }
      //   })
      //   .catch((err) => {
      //     this.flashMessage.error({
      //       message: this.$t("something_went_wrong"),
      //       time: 4000,
      //       blockClass: "custom-block-class",
      //     });
      //     this.isBtnLoading = false;
      //     this.isDisabled = false;
      //     console.log("this error" + err);
      //   });
    },
  },
};
</script>
<style scoped>
.intreview-border {
  border: 1px solid black;
  border-radius: 5px 5px 5px 5px;
}
.intreview-border:hover {
  box-shadow: 0px 0px 7px;
}
.reporting-border {
  border: 1px solid #247cd4;
  border-radius: 7px 7px 7px 7px;
  padding: 2px;
}
.reporting-name-font {
  color: #247cd4;
  font-weight: normal;
  margin-left: 6px;
  padding: 2px 4px 5px 0px;
}
.candiate-name-font {
  font-size: 17px;
}
.status-margin {
  margin-top: -11px;
}
.interview-date-font {
  font-size: 14px;
}
.height-scroll {
  height: 292px;
  overflow: scroll;
}
.no-data-align {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}
.flex-width{
  width:65%;
  padding:5px
}
</style>
