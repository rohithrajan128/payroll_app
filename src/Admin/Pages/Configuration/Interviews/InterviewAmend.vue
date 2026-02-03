<template>
  <div class="container-fluid card mt-3 p-0">
    <div class="main-card mb-3">
      <div class>
        <div class="card-header-tab card-header">
          <div class="card-header-title font-size-lg text-capitalize titlewrap">
            {{ $t("create_amend_interview") }}
          </div>
        </div>
      </div>
      <div class="card-body">
        <VueElementLoading
          :active="loader"
          spinner="bar-fade-scale"
          color="var(--primary)"
        />
        <v-form ref="form" v-model="valid">
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
          <v-layout wrap class="mt-2">
            <v-flex xs12 md6 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    dense
                    v-on="on"
                    :readonly="readonly_all"
                    :disabled="disabled_candidate"
                    v-model="jobs_data.candidate_id"
                    v-bind:label="$t('candidate_name')"
                    :items="allrecruitment"
                    :rules="fieldRules"
                    item-text="name"
                    item-value="id"
                    required
                    class="required_field"
                    outlined
                  ></v-autocomplete>
                </template>
                <span>{{ $t("candidate_name") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md6 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    dense
                    v-on="on"
                    :readonly="readonly_all"
                    v-model="jobs_data.job_id"
                    v-bind:label="$t('job_title')"
                    :items="jobs_array"
                    item-text="job_title"
                    item-value="id"
                    outlined
                  ></v-autocomplete>
                </template>
                <span>{{ $t("job_id") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>

          <v-layout wrap>
            <v-flex xs12 md6 pl-2>
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
                  ></v-autocomplete>
                </template>
                <span>{{ $t("interview_type") }}</span>
              </v-tooltip>
            </v-flex>

            <template>
              <v-flex xs6 md2 pl-2>
                <v-checkbox
                  compact
                  small
                  class="client_checkbox mt-0"
                  v-model="jobs_data.is_client_interview"
                  label="is Client Interview?"
                ></v-checkbox>
              </v-flex>
              <!-- :rules="fieldRules" -->
              <v-flex xs6 md4>
                <v-tooltip bottom>
                  <!-- Render v-autocomplete if is_client_interview is true -->
                  <template v-slot:activator="{ on }">
                    <v-autocomplete
                      v-show="jobs_data.is_client_interview == false"
                      dense
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
                <v-tooltip bottom>
                  <!-- :rules="fieldRules" -->
                  <!-- Render v-text-field if is_client_interview is false -->
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
            </template>
          </v-layout>
          <v-layout>
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
            <v-flex xs12 md6 pl-2>
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
            </v-flex>
          </v-layout>

          <v-layout v-if="jobs_data.interview_status == 'Offered'">
            <v-flex xs12 md6 pl-2 class="m-auto">
              <VueElementLoading
                :active="loader1"
                spinner="bar-fade-scale"
                color="var(--primary)"
              />
              <div class="browsedivdoc">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      readonly
                      outlined
                      dense
                      v-on="on"
                      @click="callDocumentSelect"
                      v-model="jobs_data.file_url"
                      v-bind:label="$t('upload_doc')"
                    ></v-text-field>
                    <v-chip
                      label
                      class="browsebtndoc"
                      @click="callDocumentSelect"
                      color="primary"
                      v-on="on"
                      >{{ $t("browse") }}</v-chip
                    >
                  </template>
                  <span>{{ $t("upload_doc") }}</span>
                </v-tooltip>
              </div>
              <div
                class="d-flex download_item justify-end"
                v-if="jobs_data.file_url && $route.query.slug"
              >
                <a :href="document_url + jobs_data.file_url" download>
                  <p class="download_color">Download</p>
                </a>
              </div>
            </v-flex>
            <v-layout>
              <v-flex xs12 sm6 md8 style="display: none">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <span v-on="on">
                      <DocumentSelect
                        :label="'Proof'"
                        :folder="'ProofDocument'"
                        :uploadtype="enable_document_select"
                        @closeDialog="closeDocumentSelectDialog"
                        @uploadedDocument="uploadedDocument"
                        @uploadedDocumentName="uploadedDocumentName"
                        :documentlink="jobs_data.file_url"
                      ></DocumentSelect>
                    </span>
                  </template>
                  <span>{{ $t("file_input") }}</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </v-layout>

          <!-- :rules="fieldRules" -->
          <v-layout>
            <v-flex xs12 md3 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    dense
                    v-on="on"
                    v-model="jobs_data.refered_by"
                    v-bind:label="$t('refered_by')"
                    required
                    outlined
                  ></v-text-field>
                </template>
                <span>{{ $t("refered_by") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md9 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-textarea
                    v-on="on"
                    rows="1"
                    maxlength="200"
                    :readonly="readonly_all"
                    counter
                    v-model="jobs_data.comments"
                    v-bind:label="$t('comments')"
                    outlined
                    dense
                  ></v-textarea>
                </template>
                <span>{{ $t("comments") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </v-form>
      </div>
      <div class="d-block text-right mr-4">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div class="d-inline-block mr-2">
              <v-btn
                v-on="on"
                small
                class="ma-1 font-weight-bold cancel-btn"
                color="secondary"
                @click="previousPage(save_path)"
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
                @click="submit"
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
    </div>
  </div>
</template>
<script>
import VueElementLoading from "vue-element-loading";
import DatePicker from "../Components/DatePicker.vue";
import DocumentSelect from "../Components/Upload/DocumentSelect.vue";

export default {
  components: {
    VueElementLoading,
    DatePicker,
    DocumentSelect,
  },

  data: () => ({
    enable_document_select: "",
    document_url: process.env.VUE_APP_IMAGE_PATH,
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
    jobs_data: {
      id: 0,
      job_id: "",
      candidate_id: "",
      interview_type: "",
      interviewer_id: "",
      interview_date: "",
      interview_time: "",
      comments: "",
      refered_by: "",
      is_client_interview: false,
      client_name: "",
      interview_status: "New",
      file_url: "",
      filename: "",
    },
    interviews_array: [],
    allrecruitment: [],
    interview_type_array: [],
    readonly_all: false,
    valertdialogmessage: false,
    save_path: "",
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
  mounted() {
    this.fetchJobs();
    this.fetchLookups();
    this.fetchRecruitment();
    this.fetchAllEmployee();
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.save_path = this.$route.query.path;
          this.loader = true;
          axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "fetch_schedule_intervew_slug",
              {
                params: {
                  slug: this.$route.query.slug,
                },
              }
            )
            .then((res) => {
              setTimeout(() => {
                this.loader = false;
                this.jobs_data = res.data.candiate_interview_details;
                if (this.jobs_data.interview_status == "Rescheduled") {
                  this.readonly_all = true;
                }
                this.time_cross_check();
              }, 1000);
            });
        }
      },
    },
    "$route.query.candidate_slug": {
      immediate: true,
      handler() {
        if (this.$route.query.candidate_slug) {
          this.loader = true;
          axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "view_candidate_details?slug=" +
                this.$route.query.candidate_slug
            )
            .then((res) => {
              this.btnloading = false;
              if (res.data.status == "S") {
                this.message = res.data.message;
                setTimeout(() => {
                  this.jobs_data.candidate_id = res.data.candidate_details.id;
                  this.disabled_candidate = true;
                  this.loader = false;
                }, 1000);
              } else if (res.data.status == "E") {
                this.loader = false;
                this.message = res.data.message;
              }
            })
            .catch((err) => {
              this.isDisabled = false;
              console.log("this error" + err);
            });
        }
      },
    },
    "$route.params.path": {
      immediate: true,
      handler() {
        if (this.$route.params.path) {
          this.save_path = this.$route.params.path;
        }
      },
    },
  },
  methods: {
    previousPage(page_details) {
      this.$router.push({
        name: "recruitment",
        params: {
          page_details: page_details,
        },
      });
    },
    uploadedDocument(file_path) {
      this.loader1 = true;
      this.jobs_data.file_url = file_path;
      this.closeDocumentSelectDialog();
    },
    uploadedDocumentName(file_name) {
      this.jobs_data.filename = file_name;
    },
    closeDocumentSelectDialog(uploadtype) {
      this.enable_document_select = "";
      console.log("close dialog", uploadtype);
      this.loader1 = false;
    },
    callDocumentSelect() {
      this.enable_document_select = "DragDrop";
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
    fetchRecruitment() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_all_candidate_data")
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
    fetchJobs() {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetch_all_recruitment_job",
          {}
        )
        .then((res) => {
          this.jobs_array = res.data.jobs_details;
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
    submit() {
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
              this.message = res.data.message;
              this.$router.push({
                name: "recruitment",
                params: {
                  page_details: this.save_path,
                },
              });
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

.browsebtndoc {
  height: 40px !important;
  margin-left: -10%;
}
.download_color {
  color: #3f6ad8;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
.download_item {
  position: absolute;
  top: 40px;
  right: 0px;
}
.time_class /deep/ input {
  cursor: pointer !important;
}
.client_checkbox /deep/ .v-label {
  margin: 0px;
}
</style>
