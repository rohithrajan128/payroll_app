<template>
  <v-dialog persistent v-model="show_log_amend" max-width="600" small>
    <v-card class="container pb-3" style="padding: 0px !important">
      <v-toolbar color="primary" dark class="dialog-header">
        <span class="headline">{{ $t("create_amend_call_logs") }}</span>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon @click="close" v-on="on">mdi-close</v-icon>
          </template>
          <span>{{ $t("close") }}</span>
        </v-tooltip>
      </v-toolbar>
      <div style="padding: 10px">
        <div class="card-body">
          <VueElementLoading
            :active="loader"
            spinner="bar-fade-scale"
            color="var(--primary)"
          />
          <v-alert
            v-model="show_error"
            text
            color="error"
            icon="warning"
            outlined
            dismissible
          >
            {{ error_msg }}</v-alert
          >
          <v-form ref="form" v-model="valid">
            <v-layout wrap>
              <v-flex xs12 md8 pl-2>
                <div class="call_details">
                  {{ $t("call_details")
                  }}<span class="text-danger ml-2">*</span>
                </div>
                <v-radio-group
                  :disabled="call_log.id > 0"
                  v-model="call_log.status"
                  class="d-flex mt-1"
                  row
                  @change="resetFields(call_log.status)"
                >
                  <v-radio
                    class="radio_items"
                    label="Schedule Call"
                    value="schedule_call"
                  ></v-radio>
                  <v-radio
                    class="radio_items"
                    label="Completed Call"
                    value="completed_call"
                  ></v-radio>
                </v-radio-group>
              </v-flex>
              <v-flex xs12 md4 mt-2 v-if="call_log.status == 'schedule_call'">
                <v-select
                  v-model="call_log.type"
                  :items="call_type_array"
                  v-bind:label="$t('call_type')"
                  outlined
                  dense
                  class="required_field"
                  :rules="fieldRules"
                  required
                ></v-select>
              </v-flex>
            </v-layout>
            <v-layout wrap>
              <v-flex v-if="call_log.status == 'schedule_call'" xs12 md12 pl-2>
                <v-textarea
                  class="required_field"
                  v-model="call_log.reason"
                  dense
                  rows="3"
                  maxlength="2000"
                  v-bind:label="$t('reason')"
                  outlined
                  counter="2000"
                  :rules="fieldRules"
                ></v-textarea>
              </v-flex>
              <v-flex xs12 md6 pl-2>
                <v-select
                  :disabled="selected_mark_complete > 0"
                  v-model="call_log.mode"
                  :items="[
                    'Google Hangout',
                    'Skype',
                    'Goto Meeting',
                    'Zoom',
                    'Telephonic',
                    'Others',
                  ]"
                  v-bind:label="$t('call_mode')"
                  outlined
                  dense
                  class="required_field"
                  :rules="fieldRules"
                  required
                ></v-select>
              </v-flex>
              <v-flex xs12 md6 pl-2>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-select
                      :disabled="selected_mark_complete > 0"
                      v-model="call_log.purpose"
                      :items="[
                        'Cold Call',
                        'Demo',
                        'Desk',
                        'Follow-up Call',
                        'Negotiation',
                        'Prospecting',
                      ]"
                      v-bind:label="$t('call_purpose')"
                      v-on="on"
                      outlined
                      dense
                      class="required_field"
                      :rules="fieldRules"
                      required
                    ></v-select>
                  </template>
                  <span>{{ $t("call_purpose") }}</span>
                </v-tooltip>
              </v-flex>

              <v-flex
                xs12
                md6
                pl-2
                class="date_pick"
                v-if="call_log.status == 'completed_call'"
              >
                <DatePicker
                  :label="$t('completed_date')"
                  :min="new Date().toISOString().substr(0, 10)"
                  :stored_date="call_log.completed_date"
                  @formatted_date="formatted_completed_date"
                  dense
                  :class_required="'RequiredField'"
                  :rules="fieldRules"
                />
              </v-flex>
              <v-flex xs12 md6 pl-2 v-if="call_log.status == 'completed_call'">
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
                      v-model="call_log.completed_time"
                      :label="$t('completed_time')"
                      append-icon="mdi-clock-outline"
                      dense
                      readonly
                      class="required_field"
                      :rules="fieldRules"
                      required
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menu2"
                    v-model="call_log.completed_time"
                    full-width
                    @click:minute="$refs.menu.save(call_log.completed_time)"
                  ></v-time-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 md6 pl-2 v-if="call_log.status == 'schedule_call'">
                <DatePicker
                  :label="$t('schedule_date')"
                  :min="new Date().toISOString().substr(0, 10)"
                  :stored_date="call_log.schedule_date"
                  @formatted_date="formatted_schedule_date"
                  dense
                  :class_required="'RequiredField'"
                  :rules="fieldRules"
                />
              </v-flex>
              <v-flex xs12 md6 pl-2 v-if="call_log.status == 'schedule_call'">
                <v-menu
                  ref="menu"
                  v-model="menu4"
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
                      v-model="call_log.schedule_time"
                      :label="$t('schedule_time')"
                      append-icon="mdi-clock-outline"
                      dense
                      readonly
                      class="required_field"
                      :rules="fieldRules"
                      required
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menu4"
                    v-model="call_log.schedule_time"
                    full-width
                    @click:minute="$refs.menu.save(call_log.schedule_time)"
                  ></v-time-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 md6 pl-2 v-if="call_log.status == 'completed_call'">
                <v-select
                  v-model="call_log.duration"
                  :items="call_log_duration"
                  v-bind:label="$t('duration')"
                  outlined
                  item-value="longname"
                  item-text="longname"
                  dense
                  class="required_field"
                  :rules="fieldRules"
                  required
                ></v-select>
              </v-flex>
              <v-flex xs12 md6 pl-2 v-if="call_log.status == 'completed_call'">
                <v-select
                  v-model="call_log.outcome"
                  :items="call_outcome_array"
                  v-bind:label="$t('outcome')"
                  outlined
                  item-value="longname"
                  item-text="longname"
                  dense
                  class="required_field"
                  :rules="fieldRules"
                  required
                ></v-select>
              </v-flex>
              <v-flex xs12 md12 pl-2 v-if="call_log.status == 'completed_call'">
                <v-textarea
                  class="required_field"
                  v-model="call_log.discussion"
                  dense
                  rows="3"
                  maxlength="2000"
                  v-bind:label="$t('discussion')"
                  outlined
                  counter="2000"
                  :rules="fieldRules"
                ></v-textarea>
              </v-flex>
              <v-row class="pl-2">
                <v-col cols="12" md="6" v-if="source != 'Lead'">
                  <v-select
                    class="pr-2 required_field"
                    :readonly="source == 'Lead'"
                    v-model="call_log.link_to"
                    :items="link_array"
                    :label="$t('link_to')"
                    outlined
                    item-value="longname"
                    item-text="longname"
                    dense
                    :rules="fieldRules"
                  ></v-select>
                </v-col>

                <v-col cols="12" :md="source != 'Lead' ? 6 : 12">
                  <div v-if="call_log.link_to == 'Lead'">
                    <v-autocomplete
                      :readonly="source == 'Lead'"
                      v-model="call_log.lead_id"
                      :items="leads_array"
                      :label="$t('lead_name')"
                      v-on="on"
                      outlined
                      item-value="id"
                      item-text="name"
                      dense
                      :rules="fieldRules"
                      class="required_field"
                    ></v-autocomplete>
                  </div>
                  <div v-if="call_log.link_to == 'Candidate'">
                    <v-autocomplete
                      :readonly="source == 'Lead'"
                      v-model="call_log.candidate_id"
                      :items="candidates_array"
                      :label="$t('candidate')"
                      v-on="on"
                      outlined
                      item-value="id"
                      item-text="full_name"
                      dense
                      :rules="fieldRules"
                      class="required_field"
                    ></v-autocomplete>
                  </div>
                  <div v-if="call_log.link_to == 'Connect'">
                    <v-autocomplete
                      :readonly="source == 'Lead'"
                      v-model="call_log.connect_id"
                      :items="connects_array"
                      :label="$t('connect')"
                      v-on="on"
                      outlined
                      item-value="id"
                      item-text="full_name"
                      dense
                      :rules="fieldRules"
                      class="required_field"
                    ></v-autocomplete>
                  </div>
                </v-col>
              </v-row>
              <v-flex xs12 md12 pl-2>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-select
                      v-model="call_log.assigned_to"
                      :items="lead_owners_array"
                      v-bind:label="$t('assigned_to')"
                      v-on="on"
                      outlined
                      item-value="id"
                      item-text="Full_Code"
                      dense
                      class="required_field"
                      :rules="fieldRules"
                      required
                    ></v-select>
                  </template>
                  <span>{{ $t("assigned_to") }}</span>
                </v-tooltip>
              </v-flex>

              <v-flex xs12 md4 pl-2 v-if="call_log.status == 'completed_call'">
                <div style="font-size: 16px">{{ $t("followup_call") }}</div>
                <v-checkbox
                  v-model="call_log.followup_call"
                  class="mt-0"
                ></v-checkbox>
              </v-flex>
              <v-flex xs12 md4 mt-2 v-if="call_log.followup_call == 1">
                <DatePicker
                  :label="$t('followup_date')"
                  :min="new Date().toISOString().substr(0, 10)"
                  :stored_date="call_log.followup_date"
                  @formatted_date="formatted_followup_date"
                  dense
                  :class_required="'RequiredField'"
                  :rules="fieldRules"
                />
              </v-flex>
              <v-flex xs12 md4 mt-2 v-if="call_log.followup_call == 1">
                <v-menu
                  ref="menu"
                  v-model="menu3"
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
                      v-model="call_log.followup_time"
                      :label="$t('followup_time')"
                      append-icon="mdi-clock-outline"
                      dense
                      readonly
                      class="required_field"
                      :rules="fieldRules"
                      required
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menu3"
                    v-model="call_log.followup_time"
                    full-width
                    @click:minute="$refs.menu.save(call_log.followup_time)"
                  ></v-time-picker>
                </v-menu>
              </v-flex>
            </v-layout>
            <v-layout wrap v-if="call_log.status == 'schedule_call'">
              <v-flex xs12 md3 pl-2>
                <v-select
                  v-model="call_log.remind_me"
                  :items="remind_me_options"
                  item-text="longname"
                  item-value="shortname"
                  v-bind:label="$t('remind_me')"
                  outlined
                  dense
                ></v-select>
              </v-flex>
              <v-flex xs12 md5 pl-4 v-if="call_log.remind_me == 'custom'">
                <DatePicker
                  :label="$t('custom_date')"
                  :min="new Date().toISOString().substr(0, 10)"
                  :stored_date="call_log.custom_date"
                  @formatted_date="formatted_custom_date"
                  dense
                  :class_required="'RequiredField'"
                  :rules="fieldRules"
                />
              </v-flex>
              <v-flex xs12 md4 pl-2 v-if="call_log.remind_me == 'custom'">
                <v-menu
                  ref="menu"
                  v-model="menu5"
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
                      v-model="call_log.custom_time"
                      :label="$t('custom_time')"
                      append-icon="mdi-clock-outline"
                      dense
                      readonly
                      class="required_field"
                      :rules="fieldRules"
                      required
                      outlined
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menu5"
                    v-model="call_log.custom_time"
                    full-width
                    @click:minute="$refs.menu.save(call_log.custom_time)"
                  ></v-time-picker>
                </v-menu>
              </v-flex>
            </v-layout>
          </v-form>
        </div>
      </div>
      <div class="d-block text-right action-footer">
        <v-divider></v-divider>
        <div style="padding-right: 20px; padding-bottom: 10px">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div v-on="on" class="d-inline-block">
                <v-btn
                  v-on="on"
                  small
                  @click="close()"
                  :disabled="isBtnLoading"
                  class="ma-1 font-weight-bold cancel-btn"
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
                  :disabled="isDisabled"
                  @click="submit"
                  small
                  class="mr-2 success hover_shine"
                  color="green darken-1"
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
    </v-card>
  </v-dialog>
</template>

<script>
import VueElementLoading from "vue-element-loading";
import DatePicker from "../Components/DatePicker.vue";
import CreateLookup from "../../../Pages/CreateLookup.vue";
export default {
  components: {
    VueElementLoading,
    DatePicker,
    CreateLookup,
  },

  props: [
    "lead_id",
    "show_log_amend",
    "selected_log",
    "source",
    "selected_tab",
    "selected_mark_complete",
  ],

  data: () => ({
    valid: false,
    successmessage: "",
    message: "",
    valid_error: false,
    loading: false,
    isBtnLoading: false,
    isDisabled: false,
    loader: false,
    time: null,
    menu1: false,
    menu2: false,
    menu3: false,
    menu4: false,
    menu5: false,
    menu6: false,
    show_error: false,
    error_msg: "something went wrong",
    valertdialogmessage: false,
    call_log: {
      id: 0,
      status: "",
      type: "",
      mode: "",
      purpose: "",
      link_to: "",
      lead_id: null,
      completed_date: "",
      completed_time: "",
      schedule_date: "",
      schedule_time: "",
      duration: "",
      outcome: "",
      discussion: "",
      reason: "",
      assigned_to: null,
      followup_call: 0,
      followup_date: "",
      followup_time: "",
      remind_me: "",
      custom_date: "",
      custom_time: "",
      connect_id: null,
      candidate_id: null,
    },
    remind_me_options: [
      {
        id: 1,
        shortname: "None",
        longname: "None",
      },
      {
        id: 2,
        shortname: "15",
        longname: "15 mins",
      },
      {
        id: 3,
        shortname: "30",
        longname: "30 mins",
      },
      {
        id: 4,
        shortname: "1hr",
        longname: "1 hour",
      },
      {
        id: 5,
        shortname: "1day",
        longname: "1 day",
      },
      {
        id: 6,
        shortname: "custom",
        longname: "Custom",
      },
    ],
    call_log_duration: [
      {
        id: 1,
        shortname: "5 mins",
        longname: "5 mins",
      },
      {
        id: 2,
        shortname: "10 mins",
        longname: "10 mins",
      },
      {
        id: 3,
        shortname: "15 mins",
        longname: "15 mins",
      },
      {
        id: 4,
        shortname: "30 mins",
        longname: "30 mins",
      },
      {
        id: 5,
        shortname: "1hr",
        longname: "1 hour",
      },
      {
        id: 6,
        shortname: "1.5hr",
        longname: "1.5 hour",
      },
      {
        id: 7,
        shortname: "2hr",
        longname: "2 hour",
      },
    ],
    call_outcome_array: [
      {
        id: 1,
        longname: "Busy - Call Back Later",
      },
      {
        id: 2,
        longname: "Incorrect Contact",
      },
      {
        id: 3,
        longname: "Interested - Call Back Later",
      },
      {
        id: 4,
        longname: "Interested - Send Information",
      },
      {
        id: 5,
        longname: "Meeting Scheduled",
      },
      {
        id: 6,
        longname: "New Opportunity",
      },
      {
        id: 7,
        longname: "Not Interested - Reason Given",
      },
      {
        id: 8,
        longname: "Not Interested - Reason Not Given",
      },
    ],
    call_type_array: ["Outgoing", "Incoming"],
    formattedStartdate: "",
    formattedEnddate: "",
    formattedCustomdate: "",
    lead_owners_array: [],
    user: [],
    org_id: null,
    emp_id: null,
    roles: "",
    link_array: [
      {
        id: 1,
        longname: "Lead",
      },
      {
        id: 2,
        longname: "Candidate",
      },
      {
        id: 3,
        longname: "Connect",
      },
    ],
    leads_array: [],
    candidates_array: [],
    connects_array: [],
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },

  created() {
    this.fetchLookups();
  },
  watch: {
    lead_id: {
      immediate: true,
      handler() {
        if (this.lead_id) {
          this.call_log.lead_id = this.lead_id;
        }
      },
    },
    selected_tab: {
      immediate: true,
      handler() {
        if (this.call_log.id == 0) {
          if (this.selected_tab == "scheduled") {
            this.call_log.status = "schedule_call";
          } else {
            this.call_log.status = "completed_call";
          }
        }
      },
    },
    source: {
      immediate: true,
      handler() {
        if (this.source) {
          this.call_log.link_to = this.source;
        }
      },
    },
    selected_log: {
      immediate: true,
      handler() {
        if (this.selected_log) {
          this.loader = true;
          axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "lead_call_log/" +
                this.selected_log +
                "/edit"
            )
            .then((res) => {
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "S") {
                this.call_log = res.data.call_log;
                if (this.source == "Lead") {
                  this.call_log.link_to = "Lead";
                }
                this.loader = false;
              } else {
                this.flashMessage.error({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class",
                });
                this.loader = false;
              }
            })
            .catch((err) => {
              this.loader = false;
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
              console.log(err);
            });
        } else {
          // this.resetFields();
        }
      },
    },
    selected_mark_complete: {
      immediate: true,
      handler() {
        if (this.selected_mark_complete > 0) {
          this.loader = true;
          axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "lead_call_log/" +
                this.selected_mark_complete +
                "/edit"
            )
            .then((res) => {
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "S") {
                this.call_log = res.data.call_log;
                if (this.source == "Lead") {
                  this.call_log.link_to = "Lead";
                }
                this.call_log.status = "completed_call";
                this.loader = false;
              } else {
                this.flashMessage.error({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class",
                });
                this.loader = false;
              }
            })
            .catch((err) => {
              this.loader = false;
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
              console.log(err);
            });
        } else {
          // this.resetFields();
        }
      },
    },
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.fetchLeadsOwners();
    this.fetchLeads();
    this.fetchConnects();
    this.fetchCandidates();
  },
  methods: {
    fetchConnects() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_recruitment_connect")
        .then((res) => {
          this.connects_array = res.data.connect;
          this.initval = false;
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
          this.initval = false;
        });
    },
    fetchCandidates() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_all_candidate_data")
        .then((res) => {
          this.candidates_array = res.data.candidate_details;
          this.initval = false;
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
          this.initval = false;
        });
    },
    fetchLeads() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "leads_list")
        .then((res) => {
          this.leads_array = res.data.leads;
          this.initval = false;
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
          this.initval = false;
        });
    },
    formatted_completed_date(formatted_date) {
      this.call_log.completed_date = formatted_date;
    },
    formatted_followup_date(formatted_date) {
      this.call_log.followup_date = formatted_date;
    },
    formatted_schedule_date(formatted_date) {
      this.call_log.schedule_date = formatted_date;
    },
    formatted_custom_date(formatted_date) {
      this.call_log.custom_date = formatted_date;
    },
    resetFields(status = "schedule_call") {
      this.user = JSON.parse(localStorage.getItem("user"));
      if (this.source == "Lead") {
        var source_type = "Lead";
      } else {
        var source_type = "";
      }
      this.call_log = {
        id: 0,
        status: status,
        type: "",
        mode: "",
        purpose: "",
        link_to: source_type,
        lead_id: this.lead_id,
        completed_date: "",
        completed_time: "",
        schedule_date: "",
        schedule_time: "",
        duration: "",
        outcome: "",
        discussion: "",
        reason: "",
        assigned_to: this.user.hr_employee.id,
        followup_call: 0,
        remind_me: "",
        custom_date: "",
        custom_time: "",
        connect_id: null,
        candidate_id: null,
      };
    },
    fetchLeadsOwners() {
      this.loader = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchleadownersbyrole")
        .then((res) => {
          if ((res.data.status = "S")) {
            this.lead_owners_array = res.data.lead_owners;
            this.call_log.assigned_to = this.user.hr_employee.id;
            this.loader = false;
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

    fetchLookups() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "FOLLOWUP_TYPE",
          },
        })
        .then((response) => {
          this.followup_type_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        if (this.call_log.id == 0) {
          axios
            .post(
              process.env.VUE_APP_API_URL_ADMIN + "lead_call_log",
              this.call_log
            )
            .then((res) => {
              this.isBtnLoading = false;
              this.isDisabled = false;
              this.error_msg = res.data.message;
              if (res.data.status == "S") {
                this.show_error = false;
                this.flashMessage.success({
                  message: res.data.message,
                  time: 4000,
                  blockClass: "custom-block-class",
                });
                this.$emit("update-meeting");
                this.$emit("close-dialog");
              } else {
                this.show_error = true;
                this.$vuetify.goTo(0);
              }
            })
            .catch((err) => {
              this.isBtnLoading = false;
              this.isDisabled = false;
              this.error_msg = this.$t("something_went_wrong");
              this.show_error = true;
              console.log("error", err);
            });
        } else {
          axios
            .patch(
              process.env.VUE_APP_API_URL_ADMIN +
                "lead_call_log/" +
                this.call_log.id,
              this.call_log
            )
            .then((res) => {
              this.valid_error = false;
              this.isBtnLoading = false;
              this.isDisabled = false;
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
                this.$emit("update-meeting");
                this.$emit("close-dialog");
              } else {
                this.error_msg = res.data.message;
                this.show_error = true;
                this.$vuetify.goTo(0);
              }
            })
            .catch((err) => {
              this.isBtnLoading = false;
              this.isDisabled = false;
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
              console.log("error", err);
            });
        }
      } else {
        //alert("Form is Invalid");
      }
    },
    clear() {
      this.$refs.form.reset();
    },
    close() {
      this.$emit("close-dialog");
    },
  },
};
</script>
<style scoped>
.action-footer {
  position: sticky;
  z-index: 10;
  background: white;
  bottom: 0px;
}
.dialog-header {
  position: sticky;
  top: 0px;
  z-index: 10;
}
.radio_items >>> .v-label {
  margin-bottom: 0px !important;
}
.call_details {
  font-size: 16px;
  font-weight: bold;
}
</style>
