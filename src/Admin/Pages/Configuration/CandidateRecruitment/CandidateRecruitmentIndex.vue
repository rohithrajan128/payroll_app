<template>
  <div class="main-20">
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <div class="row d-flex">
        <div class="col-md-3 align-items-center pt-6">
          <page-title :heading="$t('candidate_recruitment')" :google_icon="google_icon"></page-title>
        </div>
        <div class="col-md-4 align-items-center pt-4">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-text-field dense rounded-pill density="compact" outlined rounded small v-on="on" v-model="search"
                append-icon="search" label="Search" class="srch_bar" hide-details></v-text-field>
            </template>
            <span>{{ $t("search") }}</span>
          </v-tooltip>
        </div>
        <div class="col-md-5 align-items-center text-right pr-7">
          <v-tooltip bottom v-if="slug_exist == true">
            <template v-slot:activator="{ on }">
              <v-btn small v-on="on" @click="$router.go(-1)" class="font-weight-bold cancel-btn mr-2"
                color="btn hover_shine primary cancel_button">{{ $t("back") }}
              </v-btn>
            </template>
            <span>{{ $t("back") }}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <router-link class="text-decoration-none" :to="{ name: 'candidate_recruitment_amend' }"
                style="color: white">
                <v-btn color=" btn hover_shine add_new" small class v-on="on">{{
                  $t("add_new")
                }}</v-btn>
              </router-link>
            </template>
            <span>{{ $t("add_new") }}</span>
          </v-tooltip>
          <v-tooltip bottom pl-2>
            <template v-slot:activator="{ on }">
              <v-btn color=" btn hover_shine add_new" small class="ml-2" v-on="on" @click="enableUploadButton">
                {{ $t("candidate_upload") }}</v-btn>
            </template>
            <span>{{ $t("candidate_upload") }}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <img v-on="on" class="img_align img-responsive mr-2 image ml-5 img_items" src="@/assets/images/xlsxicon.png"
                style="cursor: pointer" alt @click="canidatedownload()" />
            </template>
            <span>{{ $t("download_candidates") }}</span>
          </v-tooltip>
        </div>
      </div>
    </div>

    <v-form ref="form" v-model="valid" v-if="bulk_upload">
      <v-flex xs12 md12>
        <div v-if="alertdisabel">
          <v-alert v-show="valid_error == true && valid_success == false" color="error" icon="warning" outlined>
            <div class="readmore">{{ message }}</div>
            <a v-if="message.length > 100" class="text-primary" @click="Readmore(message)">{{ $t("more") }}</a>
          </v-alert>
        </div>
        <div v-if="alertshow">
          <v-alert v-show="valid_error == true && valid_success == false" color="error" icon="warning" outlined>
            {{ errormessage }}
            <a class="text-primary ml-2" @click="Readless(message)">{{
              $t("less")
            }}</a>
          </v-alert>
        </div>
        <v-alert v-show="valid_error == false && valid_success == true" outlined type="success" text>
          {{ successmessage }}
        </v-alert>
        <div no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <div class="d-flex w-100 justify-content-between">
              <div class="pl-2 pr-2 d-block">
                {{ $t("file_upload_candidate") }}
              </div>

              <div class="close_icon">
                <template>
                  <v-icon @click="closeBulkUpload" v-on="on" color="red">mdi-close</v-icon>
                </template>
              </div>
            </div>
          </b-card-header>
          <b-collapse id="accordion1" v-model="visible" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <div class="text-center">
                <v-progress-circular v-if="loading" :size="70" :width="7" color="purple"
                  indeterminate></v-progress-circular>
              </div>
              <v-flex xs12 md6>
                <div class="row">
                  <div class="col-6">
                    <span>
                      <v-row>
                        <v-file-input :prepend-icon="null" prepend-inner-icon="mdi-microsoft-excel" ref="filedata"
                          :rules="fieldRules" @change="selectFile" accept=".xlsx, .xls"
                          v-bind:label="$t('file_input')"></v-file-input>
                      </v-row>
                    </span>
                  </div>
                  <div>
                    <v-btn :disabled="!valid" class="btn-shadow-primary btn btn-primary btn-lg"
                      @click="uploadCandidate">{{ $t("upload") }}</v-btn>

                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <a :href="'/files/candidate_recruitment_template.xlsx'" download>
                          <img v-on="on" class="img_align img-responsive mr-2 image ml-5 img_items"
                            src="@/assets/images/xlsxicon.png" alt />
                        </a>
                      </template>
                      <span>{{ $t("download_template") }}</span>
                    </v-tooltip>
                  </div>
                </div>
              </v-flex>
            </b-card-body>
          </b-collapse>
        </div>
      </v-flex>
    </v-form>
    <v-data-table :headers="headers" :items="allrecruitment" :loading="initval" :search="search"
      :single-expand="singleExpand" item-key="id">
      <template v-slot:item="{ item, expand, isExpanded }">
        <tr v-bind:class="[isExpanded == true ? 'rowisexpandcolor' : '']">
          <td>
            <router-link class="text-decoration-none" :to="{
              name: 'candidate_recruitment_view',
              query: {
                slug: item.slug,
              },
            }">{{ item.name }}</router-link>
          </td>
          <!-- <td>{{ item.country_code }}</td> -->
          <td>+{{ item.country_code }} {{ item.mobile }}</td>
          <td v-if="item.candidate_applied_details.length > 0" class="pl-0 ml-0" style="max-width: 280px">
            <v-chip v-for="(job_details, index) in item.candidate_applied_details" :key="index" x-small color="primary"
              class="ma-1">{{ job_details.job_title }}</v-chip>
            <!-- <span {{ $t("empty_field") }}</span> -->
          </td>
          <td v-else>
            {{ $t("empty_field") }}
          </td>
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
          <td style="max-width: 300px">
            <div v-if="item.skills.length > 0">
              <div v-if="item.skillexpand">
                <v-chip v-for="(skill, index) in item.skills" :key="index" x-small color="primary" class="ma-1">{{
                  skill.skills }}</v-chip>
                <v-chip class="mr-1" variant="outlined" color="success"
                  v-bind:class="[item.skillexpand ? 'warning' : 'success']" x-small style="cursor: pointer;"
                  @click="item.skillexpand = false">
                  <span> {{ $t('hide') }} <v-icon x-small>mdi-arrow-up-drop-circle-outline</v-icon></span>
                </v-chip>
              </div>
              <div v-else>
                <div v-if="item.skills.length > 2 && item.skills.length != 3">
                  <span v-for="(skill, index) in item.skills" :key="index">
                    <v-chip v-if="index < 2" class="mr-1" variant="outlined" color="primary" x-small>
                      {{ skill.skills }}
                    </v-chip>
                  </span>
                  <v-chip class="mr-1" variant="outlined" color="success"
                    v-bind:class="[item.skillexpand ? 'warning' : 'success']" x-small style="cursor: pointer;"
                    @click="item.skillexpand = true">
                    <span>+ {{ item.skills.length - 2 }} more
                      <v-icon x-small>mdi-arrow-down-drop-circle-outline</v-icon>
                    </span>
                  </v-chip>
                </div>
                <div v-else>
                  <v-chip v-for="(skill, i) in item.skills" :key="i" class="mr-1" variant="outlined" color="primary"
                    x-small>
                    {{ skill.skills }}
                  </v-chip>
                </div>
                <div v-if="item.skills.length == 3">
                  <span v-for="(skill, j) in item.skills" :key="j">
                    <v-chip v-if="i < 3" class="mr-1" variant="outlined" color="primary" x-small>
                      {{ skill.skills }}
                    </v-chip>
                  </span>
                </div>
              </div>
            </div>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>


          <!-- <td>
            <v-chip v-for="(skill, i) in JSON.parse(item.candidate_skills)" :key="i" x-small color="primary"
              class="ma-1">{{ skill }}</v-chip>
          </td> -->
          <!-- <td>
            <v-btn
              color=" btn mr-2 mb-2 hover_shine add_new"
              small
              class="mb-2"
              v-on="on"
              x-small
              @click="openDialogReminder(item.id)"
              >{{ $t("reminder") }}</v-btn
            >
          </td> -->
          <!--  <td>{{ item.relevant_experience }}</td>
          <td>{{ item.current_ctc }}</td>
          <td>{{ item.expected_ctc }}</td>-->
          <td>
            <span v-if="item.notice_period">{{ item.notice_period }}</span>
            <span v-else>{{ $t("empty_field") }}</span>
          </td>
          <td class="text-center">
            <router-link :to="{
              name: 'candidate_recruitment_amend',
              query: {
                slug: item.slug,
              },
            }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon class="mr-2 edit_btn icon_size" v-on="on">mdi-pencil-outline</v-icon>
                </template>
                <span>{{ $t("edit") }}</span>
              </v-tooltip>
            </router-link>
          </td>
          <!-- <td>
            <span v-if="item.interview_status">{{
              item.interview_status
            }}</span>
            <span v-else>{{ $t("empty_field") }}</span>
          </td> -->
          <!-- <td class="text-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div
                  v-on="on"
                  class="maindivforswitch d-inline-block"
                  @click="changeStatus(item.id)"
                >
                  <v-switch
                    v-model="item.status"
                    color="success"
                    readonly
                  ></v-switch>
                  <div class="viconinswitchon" v-if="item.status == 1">
                    <img
                      src="@/assets/images/correct_switch.png"
                      height="20px"
                    />
                  </div>
                  <div class="viconinswitchoff" v-if="item.status == 0">
                    <img
                      src="@/assets/images/delete_switch.png"
                      height="24px"
                    />
                  </div>
                </div>
              </template>
              <span>{{ $t("status") }}</span>
            </v-tooltip>
          </td> -->
          <!-- 
          <td class="text-center">
            <router-link
              :to="{
                name: 'candidate_recruitment_amend',
                query: {
                  slug: item.slug,
                },
              }"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon class="mr-2 edit_btn icon_size" v-on="on"
                    >mdi-pencil-outline</v-icon
                  >
                </template>
                <span>{{ $t("edit") }}</span>
              </v-tooltip>
            </router-link>
          </td> -->
          <td @click="expand(!isExpanded)">
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
                <thead v-if="!item.fetch_notes.length > 0">
                  <tr>
                    <th class="text-center">
                      <b>{{ $t("no_comments_found") }}</b>
                    </th>
                  </tr>
                </thead>
                <tbody v-else>
                  <tr>
                    <td>
                      <div v-if="item.fetch_notes">
                        <div v-for="(notes, index) in item.fetch_notes" :key="index">
                          <small>
                            <strong>{{ $t("created_on") }}</strong>&nbsp;:&nbsp;
                            <span>
                              <i> {{ notes.created_at | formatDateTime }}</i>
                            </span></small>
                          <div>
                            {{ notes.description }}
                          </div>
                          <v-divider class="m-0"></v-divider>
                        </div>
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
    <v-dialog persistent v-model="reminder_dialog" small transition="dialog-bottom-transition" max-width="950px">
      <v-card class="container" style="padding: 0px !important">
        <v-toolbar color="primary" dark>
          <span class="headline">{{ $t("candiate_reminder") }}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon @click="close" class="dialogcloseinuserdetails" v-on="on">mdi-close</v-icon>
            </template>
            <span>{{ $t("close") }}</span>
          </v-tooltip>
        </v-toolbar>
        <v-card-actions class="container">
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div v-on="on" class="d-inline-block mr-2">
                <v-btn v-on="on" small @click="close" class="mb-3 font-weight-bold cancel-btn"
                  color="btn hover_shine cancel_button">{{ $t("cancel") }}</v-btn>
              </div>
            </template>
            <span>{{ $t("cancel") }}</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="saveReminder()" small class="mr-2 success hover_shine mb-3" color="green darken-1"
                :disabled="submit_btn_disable">
                {{ $t("submit") }}
                <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
              </v-btn>
            </template>
            <span>{{ $t("submit") }}</span>
          </v-tooltip>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div id="hiddentableexcel_format">
      <table border="1" ref="exportable_table" id="timesheet_table">
        <thead>
          <tr>
            <th colspan="3">Number of Candidates</th>
            <td colspan="17" class="pl-3">
              {{ allrecruitment.length }}
            </td>
          </tr>
          <tr>
            <td colspan="20">&nbsp;</td>
          </tr>
          <tr>
            <th>SL No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Gender</th>
            <th>Marital Status</th>
            <th>Position Applied</th>
            <th>Candidate Skills</th>
            <th>Highest Qualification</th>
            <th>Course</th>
            <th>Source Type</th>
            <th>Experienced/Fresher</th>
            <th>Current Company</th>
            <th>Current Designation</th>
            <th>Current Location</th>
            <th>Current CTC</th>
            <th>Expected CTC</th>
            <th>Notice Period</th>
            <th>Total Experience</th>
            <th>Relevant Experience</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in allrecruitment" :key="index">
            <td>{{ index + 1 }}</td>
            <td>
              <span v-if="data.name">{{ data.name }}</span>
              <span v-else>{{ $t("no_details") }}</span>
            </td>
            <td>
              <span v-if="data.email">{{ data.email }}</span>
              <span v-else>{{ $t("no_details") }}</span>
            </td>
            <td>
              <span v-if="data.mobile">{{ data.mobile }}</span>
              <span v-else>{{ $t("no_details") }}</span>
            </td>
            <td>
              <span v-if="data.candidate_gender">{{
                data.candidate_gender
              }}</span>
              <span v-else>{{ $t("no_details") }}</span>
            </td>
            <td>
              <span v-if="data.marital_status">{{ data.marital_status }}</span>
              <span v-else>{{ $t("no_details") }}</span>
            </td>
            <td>
              <span v-if="data.candidate_applied_details.length > 0">
                <span v-for="(position, j) in data.candidate_applied_details" :key="j">
                  {{ position.job_title }}
                  <span v-if="j != data.candidate_applied_details.length - 1">,</span>
                </span>
              </span>
              <span v-else>{{ $t("no_details") }}</span>
            </td>
            <td>
              <span v-if="data.candidate_skills">
                <span v-for="(skills, h) in JSON.parse(data.candidate_skills)" :key="h">
                  {{ skills }}
                  <span v-if="h != JSON.parse(data.candidate_skills).length - 1">,</span>
                </span>
              </span>
              <span v-else>{{ $t("no_details") }}</span>
            </td>
            <td>
              <span v-if="data.candidate_qualification">{{
                data.candidate_qualification
              }}</span>
              <span v-else>{{ $t("no_details") }}</span>
            </td>
            <td>
              <span v-if="data.courses">{{ data.courses }}</span>
              <span v-else>{{ $t("no_details") }}</span>
            </td>
            <td>
              <span v-if="data.source_type">{{ data.source_type }}</span>
              <span v-else>{{ $t("no_details") }}</span>
            </td>
            <td>
              <span v-if="data.candidate_type">{{ data.candidate_type }}</span>
              <span v-else>{{ $t("no_details") }}</span>
            </td>
            <td>
              <span v-if="data.current_company">{{
                data.current_company
              }}</span>
              <span v-else>{{ $t("no_details") }}</span>
            </td>
            <td>
              <span v-if="data.current_designation">{{
                data.current_designation
              }}</span>
              <span v-else>{{ $t("no_details") }}</span>
            </td>
            <td>
              <span v-if="data.current_location">{{
                data.current_location
              }}</span>
              <span v-else>{{ $t("no_details") }}</span>
            </td>
            <td>
              <span v-if="data.current_ctc">{{ data.current_ctc }}</span>
              <span v-else>{{ $t("no_details") }}</span>
            </td>
            <td>
              <span v-if="data.expected_ctc">{{ data.expected_ctc }}</span>
              <span v-else>{{ $t("no_details") }}</span>
            </td>
            <td>
              <span v-if="data.notice_period">{{ data.notice_period }}</span>
              <span v-else>{{ $t("no_details") }}</span>
            </td>
            <td>
              <span v-if="data.total_experience_year > 0">
                {{ data.total_experience_year }}
                <span v-if="data.total_experience_year > 1">Years</span>
                <span v-else>Year</span>
              </span>
              <span v-else>0 year </span>
              <span v-if="data.total_experience_months > 0">
                {{ data.total_experience_months }}
                <span v-if="data.total_experience_months > 1">Months</span>
                <span v-else>Month</span>
              </span>
              <span v-else>0 Month</span>
            </td>
            <td>
              <span v-if="data.relevant_experience > 0">
                {{ data.relevant_experience }}
                <span v-if="data.relevant_experience > 1">Years</span>
                <span v-else>Year</span>
              </span>
              <span v-else> 0 year </span>
              <span v-if="data.relevant_experience_months > 0">
                {{ data.relevant_experience_months }}
                <span v-if="data.relevant_experience_months > 1">Months</span>
                <span v-else> Month</span>
              </span>
              <span v-else> 0 Month</span>
            </td>
          </tr>
        </tbody>
      </table>
      <input type="text" v-model="name" />
      <button id="downloaddummybutton" @click="ExportExcel('xlsx')">
        Export table to excel xlsx
      </button>
    </div>

    <ConfirmDialog :show="showStatusDialog" :cancel="cancelStatus" :confirm="confirmStatus" v-bind:title="$t('confirm')"
      v-bind:description="$t('status_change')" />
  </div>
</template>

<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import DatePicker from "../Components/DatePicker.vue";
import moment from "moment";
import ExcelJS from "exceljs";

export default {
  components: {
    PageTitle,
    ConfirmDialog,
    DatePicker,
    moment,
  },
  data: () => ({
    singleExpand: false,
    menu2: false,
    time: null,
    bulk_upload: false,
    todaysdate: new Date().toISOString().substr(0, 10),
    allrecruitment: [],
    showConfirmDialog: false,
    reminder_dialog: false,
    visible: false,
    valid_reminder: true,
    initval: false,
    isDisabled: false,
    successmessage: "",
    errormessage: {},
    alertshow: false,
    alertdisabel: true,
    name: "",
    submit_btn_disable: false,
    reminder_data: {
      candidate_id: null,
      title: "",
      description: "",
      remainder_date: "",
      remainder_time: "",
      status: 1,
    },
    message: "",
    headers: [
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
        text: "Applied For",
        align: "left",
        value: "candidate_applied_details[0].job_title",
      },
      {
        text: "Total Experirence",
        align: "left",
        value: "total_experience_year",
      },
      {
        text: "Skills",
        align: "left",
        value: "skills[0].skills",
      },
      // {
      //   text: "Skills",
      //   align: "left",
      //   value: "candidate_skills",
      // },
      {
        text: "Notice Period",
        align: "left",
        value: "notie_period",
      },
      {
        text: "Action",
        align: "left",
        value: "",
      },
      // {
      //   text: "Remiander",
      //   align: "left",
      //   value: "",
      // },
      // {
      //   text: "Interview Status",
      //   align: "center",
      //   value: "",
      // },
      // {
      //   text: "Status",
      //   align: "center",
      //   value: "",
      // },
    ],
    google_icon: {
      icon_name: "fact_check",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
    valid: false,
    message: "",
    loading: false,
    uploaded_file: "",
    valid_error: false,
    valid_success: false,
    search: "",
    dialog: false,
    initval: true,
    showStatusDialog: false,
    status_id: "",
    isBtnLoading: false,
    slug_exist: false,
  }),
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.fetchRecruitment();
    const recaptchaScript = document.createElement("script");
    recaptchaScript.setAttribute(
      "src",
      "https://unpkg.com/xlsx@0.15.1/dist/xlsx.full.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.min.js"
    );
    document.head.appendChild(recaptchaScript);
  },

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          this.search = this.$route.query.slug;
          this.slug_exist = true;
        }
      },
    },
  },
  methods: {
    canidatedownload() {
      setTimeout(() => {
        document.getElementById("downloaddummybutton").click();
      }, 200);
    },
    ExportExcel(type, fn, dl) {
      const workbook = new ExcelJS.Workbook();

      const worksheet = workbook.addWorksheet("Candidate Recruitment");

      const table = this.$refs.exportable_table;

      const cellStyle = {
        font: { bold: true, color: { argb: "FFFFFF" } },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "6c6cff" },
        },
        border: {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        },
      };
      const cellStyleNumber = {
        font: { bold: true, color: { argb: "080800" } },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFF00" },
        },
        border: {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        },
      };
      const fontBold = {
        font: { bold: true },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "e5e8ee" },
        },
      };
      const cellAlignment = { horizontal: "center", vertical: "middle" };
      worksheet.mergeCells("A1:I1");

      // Apply cell styling to the merged cell
      const mergedCell = worksheet.getCell("A1");
      mergedCell.style = cellStyle;
      mergedCell.alignment = cellAlignment;

      // Set content for the merged cell
      mergedCell.value = "Candidate Recruitment";

      for (let i = 0; i < table.rows.length; i++) {
        const row = worksheet.addRow([]);
        for (let j = 0; j < table.rows[i].cells.length; j++) {
          const cell = table.rows[i].cells[j];
          const cellValue = cell.innerText;
          const excelCell = row.getCell(j + 1);

          // Apply cell styling
          excelCell.value = cellValue;

          if (
            excelCell._address == "A2" ||
            excelCell._address == "A4" ||
            excelCell._address == "B4" ||
            excelCell._address == "C4" ||
            excelCell._address == "D4" ||
            excelCell._address == "E4" ||
            excelCell._address == "F4" ||
            excelCell._address == "G4" ||
            excelCell._address == "H4" ||
            excelCell._address == "I4" ||
            excelCell._address == "J4" ||
            excelCell._address == "K4" ||
            excelCell._address == "L4" ||
            excelCell._address == "M4" ||
            excelCell._address == "N4" ||
            excelCell._address == "O4" ||
            excelCell._address == "P4" ||
            excelCell._address == "Q4" ||
            excelCell._address == "R4" ||
            excelCell._address == "S4" ||
            excelCell._address == "T4"
          ) {
            excelCell.style = cellStyle;
          }
          if (excelCell._address == "B2") {
            excelCell.style = cellStyleNumber;
          }

          // Calculate and set the column width based on the content length
          const cellContentLength = cellValue.length;
          const column = worksheet.getColumn(j + 1);
          const currentColumnWidth = column.width || 10;
          const newColumnWidth = Math.max(
            currentColumnWidth,
            cellContentLength + 2
          );
          column.width = newColumnWidth;
        }
      }
      let filename = "candidate_recruitment_file";
      // Generate the Excel file
      if (dl) {
        console.log("inside if");
        const buffer = workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        let stringWithUnderscores = filename.replace(/\s+/g, "_");
        a.download = stringWithUnderscores + ".xlsx";
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.log("inside else");
        workbook.xlsx.writeBuffer().then((buffer) => {
          const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          let stringWithUnderscores = filename.replace(/\s+/g, "_");
          a.download = stringWithUnderscores + ".xlsx";
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(url);
          document.body.removeChild(a);
        });
      }
    },

    enableUploadButton() {
      this.bulk_upload = true;
      this.visible = true;
    },
    closeBulkUpload() {
      this.bulk_upload = false;
      this.visible = false;
    },
    // saveReminder() {
    //   if (this.$refs.reminder.validate()) {
    //     this.submit_btn_disable = true;
    //     this.isBtnLoading = true;
    //     axios
    //       .post(
    //         process.env.VUE_APP_API_URL_ADMIN + "create_reminder",
    //         this.reminder_data
    //       )
    //       .then((response) => {
    //         if (response.data.status == "S") {
    //           this.flashMessage.success({
    //             message: response.data.message,
    //             time: 4000,
    //             blockClass: "custom-block-class",
    //           });
    //           this.submit_btn_disable = false;
    //           this.isBtnLoading = false;

    //           this.close();
    //         }
    //         if (response.data.status == "E") {
    //           this.isBtnLoading = false;
    //           this.submit_btn_disable = false;

    //           // this.close();
    //           // this.fetchDetails();
    //         }
    //       })
    //       .catch((err) => {
    //         this.isBtnLoading = false;
    //         this.submit_btn_disable = false;

    //         console.log(err);
    //         this.close();
    //       });
    //   }
    // },
    // formatted_reminder_date(formatted_date) {
    //   this.reminder_data.remainder_date = formatted_date;
    // },
    close() {
      this.reminder_dialog = false;
      this.reminder_data.candidate_id = null;
      this.reminder_data.title = "";
      this.reminder_data.description = "";
      this.reminder_data.remainder_date = "";
      this.reminder_data.remainder_time = "";
      this.reminder_data.status = "";
    },
    // openDialogReminder(candidate_id) {
    //   var reminder_details_exist = this.allrecruitment.find(
    //     (x) => (x.id = candidate_id)
    //   ).fetch_candidate_reminder;
    //   console.log("reminder data will be ", reminder_details_exist);
    //   if (reminder_details_exist) {
    //     this.reminder_data = reminder_details_exist;
    //   }
    //   this.fetchRecruitment();
    //   setTimeout(() => {
    //     this.reminder_dialog = true;
    //   }, 300);
    //   this.reminder_data.candidate_id = candidate_id;
    // },
    cancelStatus() {
      this.showStatusDialog = false;
    },
    confirmStatus() {
      this.showStatusDialog = false;
      this.statusUpdate();
    },
    changeStatus(slug) {
      this.status_id = slug;
      this.showStatusDialog = true;
    },
    statusUpdate() {
      this.initval = true;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN +
          "update_recruitment_candidates_status",
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
            this.fetchRecruitment();
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
            this.fetchRecruitment();
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log("this error" + err);
          this.initval = false;
        });
    },
    Readmore(message) {
      this.alertshow = true;
      this.alertdisabel = false;
      this.errormessage = message;
    },
    Readless(message) {
      this.alertshow = false;
      this.alertdisabel = true;
      this.message = message;
    },

    fetchRecruitment() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_all_candidate_data")
        .then((res) => {
          this.allrecruitment = res.data.candidate_details;
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

    // UPLOAD CITIES OR SUBURBS
    selectFile(file) {
      this.validate = true;
      this.uploaded_file = file;
    },

    uploadCandidate() {
      this.message = "";
      this.loading = true;
      this.valid = false;
      if (this.uploaded_file == "") {
        this.valid_error = true;
        this.valid_success = false;
        this.$vuetify.goTo(0);
        return;
      }
      let formData = new FormData();
      formData.append("uploaded_file", this.uploaded_file);
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "uploadcandidateprofile",
          formData
        )
        .then((res) => {
          console.log(res);
          this.loading = false;
          this.valid = true;
          if (res.data.status == "E") {
            this.valid_error = true;
            this.valid_success = false;
            this.colorcode = "error";
            for (var i = 0; i < res.data.message.length; i++) {
              this.message = this.message + " " + res.data.message[i];
            }
            this.$vuetify.goTo(0);
          } else {
            this.valid_error = false;
            this.valid_success = true;
            this.successmessage = res.data.message; //"File uploded successfully";
            this.uploaded_file = "";
            this.$refs.filedata.reset();
            this.fetchRecruitment();
          }
        })
        .catch((err) => {
          this.valid_success = false;
          this.valid_error = true;
          this.valid = true;
          this.colorcode = "error";
          this.loading = false;
          this.message = this.$t("contact_admin");
          this.$vuetify.goTo(0);
          console.log(err);
        });
    },
  },
};
</script>
<style scoped>
.v-text-field /deep/ .v-input__slot {
  min-height: 38px !important;
  /* width: 353px; */
}

.param-value {
  max-width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.readmore {
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.upload_btn {
  background: #2a6396;
}

.img_items {
  width: 50px !important;
}

.simpletableformetricdisplaydropdown {
  background: #f0efef !important;
}

.rowisexpandcolor {
  background: white !important;
}

.w-100 {
  width: 100%;
}

.close_icon {
  border: 1px solid red;
}

#downloaddummybutton {
  display: none;
}

#hiddentableexcel_format {
  display: none;
}
</style>
