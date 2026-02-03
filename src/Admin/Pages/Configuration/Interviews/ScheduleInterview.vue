<template>
  <div>
    <v-dialog
      persistent
      v-model="schedule_dialog"
      small
      transition="dialog-bottom-transition"
      max-width="800px"
    >
      <v-card class="container" style="padding: 0px !important">
        <v-toolbar color="primary" dark>
          <span class="headline" v-if="candidate_name"
            >{{ $t("schedule_with") }} {{ candidate_name }}</span
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
        <v-form ref="form" v-model="valid" class="p-3">
          <v-alert
            v-model="save_error"
            :text="valertdialogmessage"
            color="error"
            icon="warning"
            outlined
            dismissible
          >
            {{ valertdialogmessage }}</v-alert
          >
          <VueElementLoading
            :active="loader1"
            spinner="bar-fade-scale"
            color="var(--primary)"
          />
          <v-layout wrap class="mt-2">
            <v-flex xs12 md12 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    dense
                    v-on="on"
                    :readonly="readonly_all"
                    :disabled="candidate_id || edit_schedule_interview == true"
                    v-model="jobs_data.candidate_id"
                    v-bind:label="$t('candidate_name')"
                    :items="allrecruitment"
                    :rules="fieldRules"
                    item-text="name"
                    item-value="id"
                    required
                    class="required_field"
                    outlined
                    @change="fetchCandidateAppliedJob()"
                  ></v-autocomplete>
                </template>
                <span>{{ $t("candidate_name") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md12 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    dense
                    v-on="on"
                    :readonly="readonly_all"
                    v-model="jobs_data.job_id"
                    v-bind:label="$t('job_title')"
                    :rules="fieldRules"
                    class="required_field"
                    :items="jobs_array"
                    item-text="job_title"
                    item-value="id"
                    :disabled="candidate_disable"
                    outlined
                  ></v-autocomplete>
                </template>
                <span>{{ $t("job_id") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
          <v-layout wrap>
            <v-flex xs12 md6 pl-2 class="createlookupflex">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    dense
                    v-on="on"
                    :readonly="readonly_all"
                    v-model="jobs_data.interview_type"
                    v-bind:label="$t('interview_type')"
                    :items="interview_type_array"
                    :rules="fieldRules"
                    item-text="longname"
                    item-value="shortname"
                    required
                    class="required_field"
                    outlined
                    @change="fieldNameChange(jobs_data.interview_type)"
                  ></v-autocomplete>
                </template>
                <span>{{ $t("interview_type") }}</span>
              </v-tooltip>
              <CreateLookup
                :dropdownlabel="$t('interview_type')"
                lookup_parent_name="INTERVIEW_TYPE"
                @lookup_data="lookupMessage"
              ></CreateLookup>
            </v-flex>
            <v-flex
              xs12
              md6
              pl-2
              v-if="jobs_data.interview_type != 'Face to Face'"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="jobs_data.interview_format"
                    :label="interview_format_name"
                    dense
                    class="required_field"
                    :rules="fieldRules"
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <span>{{ $t("interview_type") }}</span>
              </v-tooltip>
            </v-flex>

            <v-flex xs12 md3 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <DatePicker
                    :label="$t('interview_date')"
                    :min="new Date().toISOString().substr(0, 10)"
                    :disable_field="time_cross || readonly_all"
                    :stored_date="jobs_data.interview_date"
                    @formatted_date="formatted_interview_date"
                    dense
                    :class_required="'RequiredField'"
                    :rules="fieldRules"
                    v-on="on"
                  />
                </template>
                <span>{{ $t("interview_date") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md3>
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
                    v-model="jobs_data.interview_time"
                    :label="$t('interview_time')"
                    :disabled="time_cross || readonly_all"
                    append-icon="mdi-clock-outline"
                    dense
                    readonly
                    class="required_field time_class"
                    :rules="fieldRules"
                    required
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="menu2"
                  v-model="jobs_data.interview_time"
                  full-width
                  @click:minute="$refs.menu.save(jobs_data.interview_time)"
                ></v-time-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12 md6 pl-2 class="createlookupflex">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    dense
                    v-on="on"
                    v-model="jobs_data.interview_duration"
                    v-bind:label="$t('duration')"
                    :items="interviews_duration_array"
                    item-text="longname"
                    :rules="fieldRules"
                    item-value="shortname"
                    required
                    class="required_field"
                    outlined
                  ></v-autocomplete>
                </template>
                <span>{{ $t("duration") }}</span>
              </v-tooltip>
              <CreateLookup
                :dropdownlabel="$t('duration')"
                lookup_parent_name="INTERVIEW_DURATION"
                @lookup_data="lookupMessage"
              ></CreateLookup>
            </v-flex>
            <!-- <v-flex xs12 md6 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    dense
                    v-on="on"
                    v-model="jobs_data.interview_status"
                    v-bind:label="$t('interview_status')"
                    :items="interviews_array"
                    item-text="longname"
                    :rules="fieldRules"
                    item-value="shortname"
                    required
                    class="required_field"
                    outlined
                  ></v-autocomplete>
                </template>
                <span>{{ $t("interview_status") }}</span>
              </v-tooltip>
            </v-flex> -->
          </v-layout>
          <v-layout>
            <template>
              <v-flex xs6 md3 pl-2>
                <v-checkbox
                  compact
                  small
                  class="client_checkbox mt-0"
                  v-model="jobs_data.is_client_interview"
                  @change="clientChange(jobs_data.is_client_interview)"
                  label="is Client Interview?"
                ></v-checkbox>
              </v-flex>
              <!-- :rules="fieldRules" -->
              <v-flex xs6 md4 v-if="jobs_data.is_client_interview">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-show="jobs_data.is_client_interview == true"
                      v-model="jobs_data.client_name"
                      :label="$t('client_name')"
                      dense
                      required
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <span>{{ $t("client_name") }}</span>
                </v-tooltip>
              </v-flex>
              <v-flex xs6 md5 pl-2>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-autocomplete
                      dense
                      v-show="jobs_data.is_client_interview == false"
                      v-on="on"
                      v-model="jobs_data.interviewer_id"
                      v-bind:label="$t('interviewer')"
                      :items="employee_array"
                      item-text="Full_Code"
                      item-value="id"
                      outlined
                    ></v-autocomplete>
                  </template>
                  <span>{{ $t("interviewer") }}</span>
                </v-tooltip>
              </v-flex>
            </template>
          </v-layout>
        </v-form>
        <div class="d-block text-right mr-4 pb-5">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div class="d-inline-block mr-2">
                <v-btn
                  v-on="on"
                  small
                  class="ma-1 font-weight-bold cancel-btn"
                  color="secondary"
                  @click="close"
                  >{{ $t("cancel") }}</v-btn
                >
              </div>
            </template>
            <span>{{ $t("cancel") }}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div v-on="on" class="d-inline-block">
                <v-btn
                  :disabled="isDisabled"
                  color="green darken-1"
                  @click="submitInterview"
                  small
                  class="mr-2 success hover_shine"
                >
                  {{ $t("submit") }}
                  <b-spinner
                    :disabled="isBtnLoading"
                    small
                    v-if="isBtnLoading"
                  ></b-spinner>
                </v-btn>
              </div>
            </template>
            <span>{{ $t("submit") }}</span>
          </v-tooltip>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import DatePicker from "../Components/DatePicker.vue";
import VueElementLoading from "vue-element-loading";
import CreateLookup from "../../../Pages/CreateLookup.vue";
export default {
  props: [
    "schedule_dialog",
    "edit_schedule_interview",
    "schedule_interview_slug",
    "candidate_id",
    "candidate_name",
    "canidate_job_id",
  ],
  components: {
    DatePicker,
    VueElementLoading,
    CreateLookup,
  },
  data: () => ({
    loader1: false,
    todaysdate: new Date().toISOString().substr(0, 10),
    current_hour: "",
    current_min: "",
    employee_array: [],
    time: null,
    menu2: false,
    modal2: false,
    loader: false,
    isBtnLoading: false,
    valid: true,
    time_cross: false,
    isDisabled: false,
    jobs_array: [],
    disabled_candidate: false,
    save_error: false,
    readonly_all: false,
    allrecruitment: [],
    interview_type_array: [],
    interviews_array: [],
    valertdialogmessage: false,
    enable_interview_format: "",
    interview_format_name: "Interview Format",
    interviews_duration_array: [],
    jobs_data: {
      id: 0,
      job_id: "",
      candidate_id: "",
      interview_type: "",
      interviewer_id: "",
      interview_date: "",
      interview_time: "",
      interview_format: "",
      is_client_interview: false,
      client_name: "",
      interview_status: "New",
      interview_duration: "",
    },
      candidate_disable: false,
  }),
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },
  created() {
    const date = new Date();
    const hour = date.getHours();
    const min = date.getMinutes();
    this.current_hour = hour;
    this.current_min = min;
  },

  watch: {
    schedule_dialog: {
      immediate: true,
      handler() {
        // alert(this.schedule_dialog);
        this.time_cross = false;
        this.readonly_all = false;
        if (this.canidate_job_id) {
          this.candidate_disable = true;
          this.fetchCandidateAppliedJob();
          this.fetchRecruitment();
          this.fetchLookups();
          this.fetchRecruitment();
          this.fetchAllEmployee();
          setTimeout(() => {
            this.jobs_data.job_id = this.canidate_job_id;
          }, 300);
        } else {
          if (this.schedule_dialog && this.edit_schedule_interview == true) {
            //   this.fetchJobs();
            this.candidate_disable = false;
            this.editScheduleInterview();
          }
          this.jobs_data.is_client_interview = false;
          this.fetchLookups();
          this.fetchRecruitment();
          this.fetchAllEmployee();
          // this.fetchRecruitment();
          if (this.candidate_name && this.candidate_id) {
            this.jobs_data.job_id = null;
            this.fetchCandidateAppliedJob();
            this.jobs_data.candidate_id = this.candidate_id;
          }
        }
      },
    },
  },

  methods: {
    lookupMessage(lookup_data) {
      if (lookup_data.status == "S") {
        this.flashMessage.success({
          message: lookup_data.message,
          time: 4000,
          blockClass: "custom-block-class",
        });
        this.fetchLookups();
      } else {
        this.flashMessage.error({
          message: lookup_data.message,
          time: 4000,
          blockClass: "custom-block-class",
        });
      }
    },
    editScheduleInterview() {
      if (this.schedule_interview_slug) {
        this.loader1 = true;
        axios
          .get(
            process.env.VUE_APP_API_URL_ADMIN + "fetch_schedule_intervew_slug",
            {
              params: {
                slug: this.schedule_interview_slug,
              },
            }
          )
          .then((res) => {
            setTimeout(() => {
              this.jobs_data = res.data.candiate_interview_details;
              this.fetchCandidateAppliedJob();
              if (this.jobs_data.interview_status == "Rescheduled") {
                this.readonly_all = true;
              }
              this.time_cross_check();
              this.loader1 = false;
            }, 1000);
          });
      }
    },
    submitInterview() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        // Form is valid, process
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "create_schedule_interview",
            this.jobs_data
          )
          .then((res) => {
            this.btnloading = false;
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
              this.isBtnLoading = false;
              this.isDisabled = false;
              this.message = res.data.message;
              this.$emit("tabUpdates", res.data);
              this.close();
              // this.fetchAllScheduledInterview();
            } else if (res.data.status == "E") {
              this.valertdialogmessage = res.data.message;
              this.save_error = true;
              this.isBtnLoading = false;
              this.isDisabled = false;
            } else {
              this.isBtnLoading = false;
              this.valertdialogmessage = this.$t("something_went_wrong");
              this.save_error = true;
              this.isDisabled = false;
            }
          })
          .catch((err) => {
            this.valertdialogmessage = this.$t("something_went_wrong");
            this.save_error = true;
            this.isDisabled = false;
            this.isBtnLoading = false;
            console.log(err);
          });
      } else {
        console.log("Form is Invalid");
      }
    },
    clientChange(check_box_value) {
      if (check_box_value == false) {
        this.jobs_data.client_name = "";
      } else {
        this.jobs_data.interviewer_id = "";
      }
    },
    fieldNameChange(name) {
      this.interview_format_name = name;
    },
    fetchCandidateAppliedJob() {
      // this.save_error = false;
      // this.jobs_data.interview_type = "";
      // this.jobs_data.interview_date = "";
      // this.jobs_data.interview_time = "";
      // this.jobs_data.interview_format = "";
      // this.jobs_data.interview_duration = "";
      // this.jobs_data.is_client_interview = false;
      // this.jobs_data.client_name = "";
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetch_candidate_applied_job",
          {
            // params: {
            //   candidate_id: candidate_id,
            // },
          }
        )
        .then((res) => {
          this.jobs_array = res.data.all_jobs;
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
    close() {
      this.schedule_dialog = false;
      this.save_error = false;
      this.jobs_data.candidate_id = null;
      this.jobs_data.interview_type = "";

      this.jobs_data.interviewer_id = "";
      this.jobs_data.interview_date = "";
      this.jobs_data.interview_time = "";
      this.jobs_data.interview_format = "";
      this.jobs_data.interview_duration = "";
      this.jobs_data.is_client_interview = false;
      this.jobs_data.client_name = "";
      this.jobs_data.job_id = "";
      this.$emit("scheduleDialog", false);
    },
    fetchAllEmployee() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_all_employee_details")
        .then((res) => {
          this.employee_array = res.data.all_employee_details;
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
    fetchLookups() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "INTERVIEW_DURATION",
          },
        })
        .then((response) => {
          this.interviews_duration_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
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
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "INTERVIEW_TYPE",
          },
        })
        .then((response) => {
          this.interview_type_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // fetchJobs() {
    //   this.initval = true;
    //   axios
    //     .get(
    //       process.env.VUE_APP_API_URL_ADMIN + "fetch_all_recruitment_job",
    //       {}
    //     )
    //     .then((res) => {
    //       this.jobs_array = res.data.jobs_details;
    //       this.initval = false;
    //     })
    //     .catch((err) => {
    //       this.initval = false;
    //       this.flashMessage.error({
    //         message: this.$t("something_went_wrong"),
    //         time: 4000,
    //         blockClass: "custom-block-class",
    //       });
    //       console.log(" error" + err);
    //     });
    // },
    fetchRecruitment() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_all_candidate_data", {
          params: {
            canidate_job_id: this.canidate_job_id,
          },
        })
        .then((res) => {
          this.allrecruitment = res.data.candidate_details;
          this.allrecruitment = this.allrecruitment.filter((ele) => {
            return ele.status == 1;
          });
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
    formatted_interview_date(formatted_date) {
      this.jobs_data.interview_date = formatted_date;
    },
    NumbersOnly(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    time_cross_check() {
      if (this.todaysdate < this.jobs_data.interview_date) {
        this.time_cross = false;
      } else if (this.todaysdate == this.jobs_data.interview_date) {
        const full_time = this.current_hour + ":" + this.current_min + ":00";
        if (this.jobs_data.interview_time > full_time) {
          this.time_cross = false;
        } else {
          this.time_cross = true;
        }
      } else {
        this.time_cross = true;
      }
    },
    openScheduleDialog() {
      this.schedule_dialog = true;
    },
  },
};
</script>
<style scoped></style>
