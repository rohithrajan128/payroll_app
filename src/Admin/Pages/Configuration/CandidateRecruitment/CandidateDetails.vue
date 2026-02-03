<template>
  <div>
    <v-stepper v-model="stepmodel" vertical>
      <v-stepper-step :complete="stepmodel > 1" step="1" editable>
        {{ $t("current_employment_details") }} 
     
      </v-stepper-step>
      <v-stepper-content step="1">
        <div
          class="row"
          style="padding: 8px"
          v-if="recruitment_details.total_experience_year > 0"
        >
          <div class="col-md-4">
            <div class="title_heading">{{ $t("position_applied_for") }}</div>
            <div
              class="values"
              v-if="
                recruitment_details.fetch_candidate_applied_jobs &&
                recruitment_details.fetch_candidate_applied_jobs.length > 0
              "
            >
              <v-chip
                v-for="(
                  job_details, index
                ) in recruitment_details.fetch_candidate_applied_jobs"
                :key="index"
                x-small
                class="ma-1"
                color="primary"
                >{{ job_details.fetch_job_details.job_title }}</v-chip
              >
            </div>
            <div v-else>{{ $t("empty_field") }}</div>
          </div>
          <div class="col-md-4">
            <div class="title_heading">{{ $t("current_company") }}</div>
            <div class="values" v-if="recruitment_details.current_company">
              {{ recruitment_details.current_company }}
            </div>
            <div v-else>{{ $t("empty_field") }}</div>
          </div>
          <div class="col-md-4">
            <div class="d-flex justify-content-between">
              <div>
                <div class="title_heading">{{ $t("current_designation") }}</div>
                <div
                  class="values"
                  v-if="recruitment_details.current_designation"
                >
                  {{ recruitment_details.current_designation }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>

              <!-- <div>
                <router-link
                  :to="{
                    name: 'candidate_recruitment_amend',
                    query: {
                      slug: recruitment_details.slug,
                    },
                  }"
                >
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on" small class="mr-2 edit_btn icon_size"
                        >mdi-pencil-outline</v-icon
                      >
                    </template>
                    <span>{{ $t("edit") }}</span>
                  </v-tooltip>
                </router-link>
              </div> -->
            </div>
          </div>
          <div class="col-md-4">
            <div class="title_heading">{{ $t("current_location") }}</div>
            <div class="values" v-if="recruitment_details.current_location">
              {{ recruitment_details.current_location }}
            </div>
            <div v-else>{{ $t("empty_field") }}</div>
          </div>
          <div class="col-md-4">
            <div class="title_heading">{{ $t("current_CTC") }}</div>
            <div class="values" v-if="recruitment_details.current_ctc">
              {{ recruitment_details.current_ctc }}
            </div>
            <div v-else>{{ $t("empty_field") }}</div>
          </div>
          <div class="col-md-4">
            <div class="title_heading">{{ $t("expected_CTC") }}</div>
            <div class="values" v-if="recruitment_details.expected_ctc">
              {{ recruitment_details.expected_ctc }}
            </div>
            <div v-else>{{ $t("empty_field") }}</div>
          </div>

          <div class="col-md-4">
            <div class="title_heading">{{ $t("employoment_type") }}</div>
            <div
              class="values"
              v-if="
                recruitment_details.emp_type_looking &&
                recruitment_details.emp_type_looking.length > 0
              "
            >
              <v-chip
                v-for="(posirion_applied, index) in JSON.parse(
                  recruitment_details.emp_type_looking
                )"
                :key="index"
                x-small
                class="ma-1"
                color="primary"
                >{{ posirion_applied }}</v-chip
              >
            </div>
            <div v-else>{{ $t("empty_field") }}</div>
          </div>

          <div class="col-md-4">
            <div class="title_heading">{{ $t("total_work_experience") }}</div>
            <div
              class="values"
              v-if="recruitment_details.total_experience_year"
            >
              {{ recruitment_details.total_experience_year }}.
              {{ recruitment_details.total_experience_months }}
              {{ $t("years") }}
            </div>
            <div v-else>{{ $t("empty_field") }}</div>
          </div>
          <div class="col-md-4">
            <div class="title_heading">{{ $t("relevant_experience") }}</div>
            <div class="values" v-if="recruitment_details.relevant_experience">
              {{ recruitment_details.relevant_experience }}.{{
                recruitment_details.relevant_experience_months
              }}
              {{ $t("year") }}
            </div>
            <div v-else>{{ $t("empty_field") }}</div>
          </div>
        </div>
        <div class="row" style="padding: 8px" v-else>
          <div class="col-md-4">
            <div class="title_heading">{{ $t("position_applied_for") }}</div>
            <div
              class="values"
              v-if="
                recruitment_details.fetch_candidate_applied_jobs &&
                recruitment_details.fetch_candidate_applied_jobs.length > 0
              "
            >
              <v-chip
                v-for="(
                  job_details, index
                ) in recruitment_details.fetch_candidate_applied_jobs"
                :key="index"
                x-small
                class="ma-1"
                color="primary"
                >{{ job_details.fetch_job_details.job_title }}</v-chip
              >
            </div>
            <div v-else>{{ $t("empty_field") }}</div>
          </div>
          <div class="col-md-4">
            <div class="title_heading">{{ $t("current_location") }}</div>
            <div class="values" v-if="recruitment_details.current_location">
              {{ recruitment_details.current_location }}
            </div>
            <div v-else>{{ $t("empty_field") }}</div>
          </div>
          <div class="col-md-4">
            <div class="d-flex justify-content-between">
              <div>
                <div class="title_heading">{{ $t("expected_CTC") }}</div>
                <div class="values" v-if="recruitment_details.expected_ctc">
                  {{ recruitment_details.expected_ctc }}
                </div>
                <div v-else>{{ $t("empty_field") }}</div>
              </div>
              <div>
                <router-link
                  :to="{
                    name: 'candidate_recruitment_amend',
                    query: {
                      slug: recruitment_details.slug,
                    },
                  }"
                >
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on" small class="mr-2 edit_btn icon_size"
                        >mdi-pencil-outline</v-icon
                      >
                    </template>
                    <span>{{ $t("edit") }}</span>
                  </v-tooltip>
                </router-link>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="title_heading">{{ $t("employoment_type") }}</div>
            <div
              class="values"
              v-if="
                recruitment_details.emp_type_looking &&
                recruitment_details.emp_type_looking.length > 0
              "
            >
              <v-chip
                v-for="(posirion_applied, index) in JSON.parse(
                  recruitment_details.emp_type_looking
                )"
                :key="index"
                x-small
                class="ma-1"
                color="primary"
                >{{ posirion_applied }}</v-chip
              >
            </div>
            <div v-else>{{ $t("empty_field") }}</div>
          </div>
        </div>
      </v-stepper-content>
      <v-stepper-step :complete="stepmodel > 2" step="2" editable>
        <v-row class="pa-0 ma-0">
          {{ $t("skills") }}
          <v-spacer></v-spacer>
          <v-tooltip bottom v-if="stepmodel == 2">
            <template v-slot:activator="{ on }">
              <v-icon
                medium
                color="primary"
                v-on="on"
                class="vicon_llink"
                @click="addskills()"
              >
                mdi-plus-circle
              </v-icon>
            </template>
            <span>{{ $t("add") }}</span>
          </v-tooltip>
        </v-row>
      </v-stepper-step>
      <v-stepper-content step="2">
        <v-data-table
          :headers="skillheaders"
          :items="recruitment_details.skills"
          :loading="initval"
        >
          <template v-slot:item="props">
            <tr>
              <td>
                <span v-if="props.item.skills">{{ props.item.skills }}</span>
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>
              <td>
                <span v-if="props.item.proficiency">{{
                  props.item.proficiency
                }}</span>
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>
              <td>
                <span v-if="props.item.total_experience">{{
                  props.item.total_experience
                }}</span>
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>
              <td>
                <span v-if="props.item.formattedDate2">{{
                  props.item.formattedDate2
                }}</span>
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>
              <td class="text-center px-0">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      v-on="on"
                      small
                      class="mr-2 edit_btn icon_size"
                      @click="editcertificates(props.item.id, 'skills')"
                      >mdi-pencil-outline</v-icon
                    >
                  </template>
                  <span>{{ $t("edit") }}</span>
                </v-tooltip>
                <v-tooltip bottom v-if="recruitment_details.skills.length > 1">
                  <template v-slot:activator="{ on }">
                    <v-icon
                      class="delete_btn icon_size"
                      v-on="on"
                      small
                      @click="deleteItem(props.item.id, 'skills')"
                      >mdi-trash-can-outline</v-icon
                    >
                  </template>
                  <span>{{ $t("delete") }}</span>
                </v-tooltip>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-stepper-content>
      <v-stepper-step :complete="stepmodel > 3" step="3" editable>
        <v-row class="pa-0 ma-0">
          {{ $t("certification") }}
          <v-spacer></v-spacer>
          <v-tooltip bottom v-if="stepmodel == 3">
            <template v-slot:activator="{ on }">
              <v-icon
                medium
                color="primary"
                v-on="on"
                class="vicon_llink"
                @click="addcertificate()"
              >
                mdi-plus-circle
              </v-icon>
            </template>
            <span>{{ $t("add") }}</span>
          </v-tooltip>
        </v-row>
      </v-stepper-step>
      <v-stepper-content step="3">
        <v-data-table
          :headers="certificatesheaders"
          :items="recruitment_details.certificates"
          :loading="initval"
        >
          <template v-slot:item="props">
            <tr>
              <td>
                <span v-if="props.item.certification_title">{{
                  props.item.certification_title
                }}</span>
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>
              <td>
                <span v-if="props.item.formattedDate1">{{
                  props.item.formattedDate1
                }}</span>
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>
              <td class="text-center px-0">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      v-on="on"
                      small
                      class="mr-2 edit_btn icon_size"
                      @click="editcertificates(props.item.id, 'certificate')"
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
                      @click="deleteItem(props.item.id, 'certificate')"
                      >mdi-trash-can-outline</v-icon
                    >
                  </template>
                  <span>{{ $t("delete") }}</span>
                </v-tooltip>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-stepper-content>
      <v-stepper-step :complete="stepmodel > 4" step="4" editable>
        {{ $t("other_details") }}
      </v-stepper-step>
      <v-stepper-content step="4">
        <div class="row px-3">
          <div class="col-md-4">
            <div class="title_heading">{{ $t("marital_status") }}</div>
            <div class="values" v-if="recruitment_details.marital_status">
              {{ recruitment_details.marital_status }}
            </div>
            <div v-else>{{ $t("empty_field") }}</div>
          </div>
          <div class="col-md-4">
            <div class="title_heading">{{ $t("passport_expiry") }}</div>
            <div class="values" v-if="recruitment_details.passport_expiry">
              {{ recruitment_details.passport_expiry | formatdateMonthyear }}
            </div>
            <div v-else>{{ $t("empty_field") }}</div>
          </div>
          <div class="col-md-4">
            <div class="title_heading">{{ $t("travel_details") }}</div>
            <div
              class="values"
              v-if="recruitment_details.candidate_travel_history"
            >
              {{ recruitment_details.candidate_travel_history }}
            </div>
            <div v-else>{{ $t("empty_field") }}</div>
          </div>
          <div class="col-md-4">
            <div class="title_heading">{{ $t("willingness_to_travel") }}</div>
            <div class="values" v-if="recruitment_details.willing_to_travel">
              {{ recruitment_details.willing_to_travel }}
            </div>
            <div v-else>{{ $t("empty_field") }}</div>
          </div>
          <div class="col-md-4">
            <div class="title_heading">{{ $t("visa_available") }}</div>
            <div class="values" v-if="recruitment_details.candidate_visa">
              {{ recruitment_details.candidate_visa }}
            </div>
            <div v-else>{{ $t("empty_field") }}</div>
          </div>
          <div class="col-md-12">
            <div class="title_heading">{{ $t("queries") }}</div>
            <div class="values" v-if="recruitment_details.candidate_queries">
              {{ recruitment_details.candidate_queries }}
            </div>
            <div v-else>{{ $t("empty_field") }}</div>
          </div>
        </div>
      </v-stepper-content>
    </v-stepper>

    <v-dialog v-model="cert_dialog" persistent max-width="650px">
      <v-toolbar color="primary">
        <span class="headline" style="color: white">
          {{ $t("amend_candidate_certificate") }}
        </span>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              @click="closecertdialog"
              class="dialogcloseinuserdetails"
              v-on="on"
              style="color: white"
              >mdi-close</v-icon
            >
          </template>
          <span>{{ $t("close") }}</span>
        </v-tooltip>
      </v-toolbar>
      <v-card>
        <v-form ref="form" v-model="valid">
          <v-layout class="ma-0 pt-6 px-5">
            <v-flex xs12 md6 pr-1>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="certification.certification_title"
                    max-length="100"
                    :rules="fieldRules"
                    class="required_field"
                    v-bind:label="$t('certification_title')"
                    required
                    outlined
                    dense
                  ></v-text-field>
                </template>
                <span>{{ $t("certification_title") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex md6 sm6 pl-1>
              <v-menu
                v-model="menu1"
                ref="menu1"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="cert_obtained_formatted"
                    v-bind:label="$t('obtained_date')"
                    append-icon="mdi-calendar"
                    outlined
                    dense
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="certification.obtained_date"
                  type="month"
                  no-title
                  scrollable
                  :max="new Date().toISOString().substr(0, 10)"
                  @input="formatobtaineddate()"
                  @change="menu1 = false"
                ></v-date-picker>
              </v-menu>
            </v-flex>
          </v-layout>
          <div class="text-right pr-3 pb-4">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on" class="d-inline-block mr-2">
                  <v-btn
                    small
                    @click="closecertdialog"
                    class="ma-1 font-weight-bold cancel-btn"
                    :disabled="isBtnLoading"
                    color="dark cancel_button"
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
                    :disabled="isBtnLoading"
                    color="green darken-1"
                    @click="submit('certificate')"
                    small
                    class="mr-2 success hover_shine"
                  >
                    {{ $t("submit") }}
                    <b-spinner small v-if="isBtnLoading"></b-spinner>
                  </v-btn>
                </div>
              </template>
              <span>{{ $t("submit") }}</span>
            </v-tooltip>
          </div>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="skills_dialog" persistent max-width="650px">
      <v-toolbar color="primary">
        <span class="headline" style="color: white">
          {{ $t("amend_candidate_skills") }}
        </span>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              @click="closecertdialog"
              class="dialogcloseinuserdetails"
              v-on="on"
              style="color: white"
              >mdi-close</v-icon
            >
          </template>
          <span>{{ $t("close") }}</span>
        </v-tooltip>
      </v-toolbar>
      <v-card>
        <v-form ref="form" v-model="valid">
          <v-layout pt-4 px-6>
            <v-flex xs12 md6>
              <v-autocomplete
                v-model="skill.skills"
                required
                class="required_field"
                outlined
                dense
                :rules="fieldRules"
                @change="skillChange(skill.skills)"
                :error="skillerror"
                :error-messages="skillerrormessage"
                :items="candidateskillsitems"
                item-text="longname"
                item-value="longname"
                v-bind:label="$t('skill')"
              >
              </v-autocomplete>
            </v-flex>
            <v-flex xs12 md6 pl-2>
              <v-autocomplete
                v-bind:label="$t('proficiency')"
                index="id"
                item-value="shortname"
                item-text="longname"
                v-model="skill.proficiency"
                :items="skillsproficiencyarray"
                outlined
                dense
              >
              </v-autocomplete>
            </v-flex>
          </v-layout>
          <v-layout pt-1 px-6>
            <v-flex xs12 md6>
              <v-text-field
                v-model="skill.total_experience"
                v-bind:label="$t('total_experience')"
                maxlength="20"
                outlined
                dense
              ></v-text-field>
            </v-flex>
            <v-flex md6 sm6 pl-2 pr-1>
              <v-menu
                v-model="menu2"
                ref="menu2"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="skill_formatted_date"
                    v-bind:label="$t('last_worked_on')"
                    append-icon="mdi-calendar"
                    outlined
                    dense
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="skill.last_worked_on"
                  type="month"
                  no-title
                  scrollable
                  :max="new Date().toISOString().substr(0, 10)"
                  @input="formatlastworked()"
                  @change="menu2 = false"
                ></v-date-picker>
              </v-menu>
            </v-flex>
          </v-layout>
          <div class="text-right pr-5 pb-4">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on" class="d-inline-block mr-2">
                  <v-btn
                    small
                    @click="closecertdialog"
                    class="ma-1 font-weight-bold cancel-btn"
                    :disabled="isBtnLoading"
                    color="dark cancel_button"
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
                    :disabled="isBtnLoading"
                    color="green darken-1"
                    @click="submit('skills')"
                    small
                    class="mr-2 success hover_shine"
                  >
                    {{ $t("submit") }}
                    <b-spinner small v-if="isBtnLoading"></b-spinner>
                  </v-btn>
                </div>
              </template>
              <span>{{ $t("submit") }}</span>
            </v-tooltip>
          </div>
        </v-form>
      </v-card>
    </v-dialog>

    <ConfirmDialog
      :show="showConfirmDialog"
      :cancel="cancel"
      :confirm="confirmdelete"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('delete_confirmation')"
    />
  </div>
</template>
<script>
import ConfirmDialog from "../Components/ConfirmDialog.vue";
export default {
  components: {
    ConfirmDialog,
  },
  props: ["recruitment_details"],
  data: () => ({
    valid: false,
    showConfirmDialog: false,
    cert_dialog: false,
    skills_dialog: false,
    delete_id: null,
    skillsproficiencyarray: [],
    candidateskillsitems: [],
    menu1: false,
    menu2: false,
    skillerror: false,
    skillerrormessage: "",
    delete_type: "",
    initval: false,
    stepmodel: 1,
    certification: {
      id: 0,
      candidate_id: 0,
      certification_title: "",
      obtained_date: "",
    },
    skill: {
      id: 0,
      candidate_id: 0,
      skills: "",
      proficiency: "",
      total_experience: "",
      last_worked_on: "",
    },
    cert_obtained_formatted: "",
    skill_formatted_date: "",
    isBtnLoading: false,
  }),
  created() {
    this.fetchlookup();
  },
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    skillheaders() {
      return [
        {
          text: this.$t("skill"),
          align: "left",
          sortable: true,
          value: "skills",
        },
        {
          text: this.$t("proficiency"),
          value: "proficiency",
          sortable: true,
        },
        {
          text: this.$t("total_experience"),
          value: "total_experience",
          sortable: true,
        },
        {
          text: this.$t("last_worked_on"),
          value: "last_worked_on",
          sortable: true,
        },
        {
          text: "Actions",
          value: "name",
          align: "center",
          sortable: false,
        },
      ];
    },
    certificatesheaders() {
      return [
        {
          text: this.$t("title"),
          align: "left",
          sortable: true,
          value: "certification_title",
        },
        {
          text: this.$t("obtained_date"),
          value: "formattedDate1",
          sortable: true,
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
  methods: {
    skillChange(skillname) {
      this.skillerror = false;
      this.skillerrormessage = "";
      for (var i = 0; i < this.recruitment_details.skills.length; i++) {
        if (skillname == this.recruitment_details.skills[i].skills) {
          this.skillerror = true;
          this.skillerrormessage = this.$t("this_skill_already_exist");
        }
      }
    },
    addskills() {
      this.skill.candidate_id = this.recruitment_details.id;
      this.skill_formatted_date = "";
      this.skill = {
        id: 0,
        candidate_id: this.recruitment_details.id,
        skills: "",
        proficiency: "",
        total_experience: "",
        last_worked_on: "",
      };
      this.skills_dialog = true;
      this.skillerror = false;
      this.skillerrormessage = "";
    },
    addcertificate() {
      this.certification.candidate_id = this.recruitment_details.id;
      this.cert_obtained_formatted = "";
      this.certification = {
        id: 0,
        candidate_id: this.recruitment_details.id,
        certification_title: "",
        obtained_date: "",
      };
      this.cert_dialog = true;
    },
    deleteItem(id, type) {
      this.delete_id = id;
      this.delete_type = type;
      this.showConfirmDialog = true;
    },
    cancel() {
      this.showConfirmDialog = false;
      this.delete_id = null;
      this.delete_type = "";
    },
    confirmdelete() {
      this.deleteConfirm();
      this.showConfirmDialog = false;
    },
    deleteConfirm() {
      this.initval = true;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN +
            "delete_candidate_details_by_type",
          {
            id: this.delete_id,
            type: this.delete_type,
          }
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.flashMessage.success({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.initval = false;
            this.$eventBus.$emit("updated_candidate_details");
          } else {
            this.initval = false;
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
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
    formatlastworked() {
      if (this.skill.last_worked_on) {
        const year = this.skill.last_worked_on.substr(0, 4);
        const month = this.skill.last_worked_on.substr(5, 2);
        const options = { year: "numeric", month: "short" };
        const formattedDate = new Date(year, month - 1).toLocaleDateString(
          undefined,
          options
        );
        this.skill_formatted_date = formattedDate;
      } else {
        this.skill_formatted_date = "";
      }
    },
    fetchlookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "TECHNICAL_SKILLS_HEADER",
          },
        })
        .then((response) => {
          this.candidateskillsitems = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "SKILLS_PROFICIENCY",
          },
        })
        .then((response) => {
          this.skillsproficiencyarray = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editcertificates(id, type) {
      this.initval = true;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN +
            "editcandidateskillsandcertificatebyid",
          {
            id: id,
            type: type,
          }
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.initval = false;
            if (type == "certificate") {
              this.certification = res.data.data;
              this.formatobtaineddate();
              this.cert_dialog = true;
            }
            if (type == "skills") {
              this.skill = res.data.data;
              this.formatlastworked();
              this.skills_dialog = true;
            }
          } else {
            this.initval = false;
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
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

    submit(type) {
      if (this.$refs.form.validate() && this.skillerror == false) {
        this.isBtnLoading = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN +
              "savecandidateskillsandcertificate",
            {
              certificates: this.certification,
              type: type,
              skill: this.skill,
            }
          )
          .then((res) => {
            if (res.data.status == "S") {
              this.flashMessage.success({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.$eventBus.$emit("updated_candidate_details");
            } else {
              alert("hiii");
              this.isBtnLoading = false;
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
            }
            this.closecertdialog();
          })
          .catch((err) => {
            alert("console hello");
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.isBtnLoading = false;
            console.log("this error" + err);
          });
      }
    },
    formatobtaineddate() {
      if (this.certification.obtained_date) {
        const year = this.certification.obtained_date.substr(0, 4);
        const month = this.certification.obtained_date.substr(5, 2);
        const options = { year: "numeric", month: "short" };
        const formattedDate = new Date(year, month - 1).toLocaleDateString(
          undefined,
          options
        );
        this.cert_obtained_formatted = formattedDate;
      } else {
        this.cert_obtained_formatted = "";
      }
    },
    closecertdialog() {
      this.cert_dialog = false;
      this.skills_dialog = false;
      this.isBtnLoading = false;
      this.certification = {
        candidate_id: this.recruitment_details.id,
        certification_title: "",
        obtained_date: "",
      };
      this.skill = {
        id: 0,
        candidate_id: this.recruitment_details.id,
        skills: "",
        proficiency: "",
        total_experience: "",
        last_worked_on: "",
      };
      this.skillerror = false;
      this.skillerrormessage = "";
    },
  },
};
</script>
<style scoped>
.more_btn_margin {
  margin: 7px 38px 26px 0px;
  width: 100%;
  text-align: end;
  color: #3f6ad8;
  font-size: 15px;
  font-weight: bold;
}

.title_heading {
  font-weight: bold;
}
</style>
