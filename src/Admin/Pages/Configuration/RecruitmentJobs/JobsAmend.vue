<template>
  <div class="container-fluid card mt-3 p-0">
    <div class="main-card mb-3">
      <div class>
        <div class="card-header-tab card-header">
          <div class="card-header-title font-size-lg text-capitalize titlewrap">
            {{ $t("create_jobs") }}
          </div>
        </div>
      </div>
      <div class="card-body">
        <VueElementLoading
          :active="loader"
          spinner="bar-fade-scale"
          color="var(--primary)"
        />
        <!-- <v-alert
          v-model="save_error"
          :text="save_error"
          color="error"
          icon="warning"
          outlined
          dismissible
        >{{ valertdialogmessage }}</v-alert> -->
        <v-form ref="form" v-model="valid">
          <v-layout wrap class="mt-2">
            <v-flex xs12 md12 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="jobs_data.job_title"
                    v-bind:label="$t('job_title')"
                    required
                    dense
                    maxlength="50"
                    :rules="fieldRules"
                    class="required_field"
                    outlined
                  ></v-text-field>
                </template>
                <span>{{ $t("job_title") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
          <v-layout wrap class="mt-2">
            <v-flex xs12 md4 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="jobs_data.no_of_vacancies"
                    v-bind:label="$t('no_of_vacancies')"
                    required
                    dense
                    maxlength="5"
                    v-on:keypress="NumbersOnly"
                    counter
                    outlined
                  ></v-text-field>
                </template>
                <span>{{ $t("no_of_vacancies") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md4 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="jobs_data.client"
                    v-bind:label="$t('client')"
                    dense
                    :rules="fieldRules"
                    class="required_field"
                    max-length="100"
                    outlined
                  ></v-text-field>
                </template>
                <span>{{ $t("client") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md4 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="jobs_data.salary_range"
                    v-bind:label="$t('salary_range')"
                    required
                    dense
                    maxlength="100"
                    outlined
                  ></v-text-field>
                </template>
                <span>{{ $t("salary_range") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
          <v-layout wrap class="mt-2">
            <v-flex xs12 md4 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="jobs_data.work_location"
                    v-bind:label="$t('work_location')"
                    dense
                    :rules="fieldRules"
                    class="required_field"
                    maxlength="100"
                    outlined
                  ></v-text-field>
                </template>
                <span>{{ $t("work_location") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md4 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="jobs_data.experience_years"
                    v-bind:label="$t('experience')"
                    dense
                    maxlength="5"
                    v-on:keypress="NumbersOnly"
                    outlined
                  ></v-text-field>
                </template>
                <span>{{ $t("experience") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md4 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    v-bind:label="$t('employoment_type')"
                    v-on="on"
                    index="id"
                    item-value="shortname"
                    item-text="longname"
                    v-model="jobs_data.job_type"
                    :rules="fieldRules"
                    :items="job_type_array"
                    outlined
                    dense
                    class="required_field"
                  ></v-autocomplete>
                </template>
                <span>{{ $t("department") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
          <v-layout wrap class="mt-2">
            <v-flex xs12 md4 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    v-bind:label="$t('work_mode')"
                    v-on="on"
                    index="id"
                    class="required_field"
                    item-value="shortname"
                    item-text="longname"
                    v-model="jobs_data.work_mode"
                    :rules="fieldRules"
                    :items="work_mode_array"
                    outlined
                    dense
                  ></v-autocomplete>
                </template>
                <span>{{ $t("work_mode") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md4 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    outlined
                    v-on="on"
                    v-bind:label="$t('recruiter')"
                    v-model="jobs_data.recruiter_id"
                    :items="active_employee"
                    item-value="id"
                    item-text="Full_Code"
                    dense
                  >
                  </v-autocomplete>
                </template>
                <span>{{ $t("recruiter") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md4 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    outlined
                    v-on="on"
                    v-bind:label="$t('hiring_manager')"
                    v-model="jobs_data.hiring_manager_id"
                    :items="active_employee"
                    item-value="id"
                    item-text="Full_Code"
                    dense
                  >
                  </v-autocomplete>
                </template>
                <span>{{ $t("hiring_manager") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12 md4 pl-2>
              <DatePicker
                :label="$t('due_date')"
                :stored_date="jobs_data.job_end_date"
                :min="new Date().toISOString().substr(0, 10)"
                @formatted_date="formatteStartDate"
                dense
              />
            </v-flex>
            <!-- <v-flex xs12 md4 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    outlined
                    v-on="on"
                    v-bind:label="$t('job_status')"
                    v-model="jobs_data.job_status"
                    :items="job_status_array"
                    :rules="fieldRules"
                    class="required_field"
                    item-value="shortname"
                    item-text="longname"
                    dense
                  >
                  </v-autocomplete>
                </template>
                <span>{{ $t("job_status") }}</span>
              </v-tooltip>
            </v-flex> -->
          </v-layout>
          <v-layout>
            <v-flex xs12 md12 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span v-on="on">
                    <v-card-title class="font-weight-bold desc_item p-0">{{
                      $t("job_description")
                    }}</v-card-title>

                    <quill-editor
                      v-model="jobs_data.description"
                      tag-name="textarea"
                      id="tempbody"
                      name="template_body"
                      :options="editorOptions"
                      v-bind:label="$t('job_description')"
                    ></quill-editor>
                  </span>
                </template>
                <span>{{ $t("job_description") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
          <v-layout class="mt-2"> </v-layout>
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
                @click="previousPage()"
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
import DatePicker from "../Components/DatePicker.vue";

import VueElementLoading from "vue-element-loading";
import { quillEditor } from "vue-quill-editor";
import Quill from "quill";
import ImageResize from "quill-image-resize";
Quill.register("modules/imageResize", ImageResize);

export default {
  components: {
    VueElementLoading,
    quillEditor,
    DatePicker,
  },

  data: () => ({
    editorOptions: {
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"], // Text formatting options
          ["blockquote", "code-block"], // Blockquote and code block options
          [{ header: 1 }, { header: 2 }], // Header options
          [{ list: "ordered" }, { list: "bullet" }], // List options
          [{ script: "sub" }, { script: "super" }], // Subscript and superscript options
          [{ indent: "-1" }, { indent: "+1" }], // Indentation options
          [{ direction: "rtl" }], // Text direction option
          ["link", "image", "video"], // Link, image, and video options
          ["clean"], // Remove formatting option
        ],
        imageResize: ["Resize", "DisplaySize", "Toolbar"],
      },
    },

    loader: false,
    isBtnLoading: false,
    valid: true,
    loader: false,
    isDisabled: false,
    job_type_array: [],
    work_mode_array: [],
    active_employee: [],
    job_status_array: [],
    jobs_data: {
      id: 0,
      job_title: "",
      description: "",
      no_of_vacancies: null,
      client: "",
      salary_range: "",
      work_location: "",
      experience_years: "",
      job_type: "",
      work_mode: "",
      recruiter_id: null,
      hiring_manager_id: null,
      job_end_date: "",
      job_status: "Active",
    },
  }),
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          axios
            .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_recruitment_job", {
              params: {
                slug: this.$route.query.slug,
              },
            })
            .then((res) => {
              this.jobs_data = res.data.jobs_details;
              this.loader = false;
            });
        }
      },
    },
  },
  mounted() {
    this.fetchActiveEmployees();
    this.fetchLookups();
  },
  methods: {
  previousPage() {
      this.$router.push({
        name: "recruitment",
        params: {
          page_details: 'jobs',
        },
      });
    },
    formatteStartDate(formatted_date) {
      this.jobs_data.job_end_date = formatted_date;
    },
    fetchActiveEmployees() {
      this.loader = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_all_active_user", {})
        .then((res) => {
          this.active_employee = res.data.usersdata;
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
    fetchLookups() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "JOB_TYPE",
          },
        })
        .then((response) => {
          this.job_type_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
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
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "MODE_OF_WORK",
          },
        })
        .then((response) => {
          console.log("object");
          console.log(response.data.lookup_details);
          this.work_mode_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
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
            process.env.VUE_APP_API_URL_ADMIN + "create_recruitment_job",
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
                  page_details: 'jobs',
                },
              });
            } else if (res.data.status == "E") {
              this.valertdialogmessage = response.data.message;
               this.flashMessage.error({
                message: this.array_data,
                time: 4000,
                blockClass: "custom-block-class",
              });
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
@import "~quill/dist/quill.core.css";
@import "~quill/dist/quill.snow.css";
@import "~quill/dist/quill.bubble.css";
</style>
