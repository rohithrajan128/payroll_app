<template>
  <v-dialog persistent v-model="show_meeting_amend" max-width="600" small>
    <v-card class="container pb-3" style="padding: 0px !important">
      <v-toolbar color="primary" dark class="dialog-header">
        <span class="headline">{{ $t("create_amend_meeting") }}</span>
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
              <v-flex xs12 md12 pl-2>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-on="on"
                      v-model="meeting.title"
                      :rules="fieldRules"
                      v-bind:label="$t('title')"
                      required
                      class="required_field"
                      outlined
                      dense
                    ></v-text-field>
                  </template>
                  <span>{{ $t("title") }}</span>
                </v-tooltip>
              </v-flex>
              <v-flex xs12 md4 pl-2 class="date_pick">
                <v-menu
                  v-model="menu1"
                  ref="menu"
                  :close-on-content-click="true"
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="formattedStartdate"
                      v-bind:label="$t('start_date')"
                      append-icon="mdi-calendar"
                      outlined
                      dense
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      class="required_field"
                      :rules="fieldRules"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="meeting.start_date"
                    no-title
                    :min="new Date().toISOString().substr(0, 10)"
                    @click:date="$refs.menu.save(menu1)"
                    scrollable
                  >
                  </v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 md4 pl-2>
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
                      v-model="meeting.start_time"
                      :label="$t('start_time')"
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
                    v-model="meeting.start_time"
                    full-width
                    @click:minute="$refs.menu.save(meeting.start_time)"
                  ></v-time-picker>
                </v-menu>
              </v-flex>

              <v-flex xs12 md4 pl-2>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-select
                      v-model="meeting.duration"
                      :items="meeting_duration"
                      v-bind:label="$t('duration')"
                      v-on="on"
                      outlined
                      item-value="longname"
                      item-text="longname"
                      dense
                      class="required_field"
                      :rules="fieldRules"
                      required
                    ></v-select>
                  </template>
                  <span>{{ $t("duration") }}</span>
                </v-tooltip>
              </v-flex>
              <v-flex xs12 md12 pl-2>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-select
                      v-model="meeting.assigned_to"
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
              <v-flex xs12 md12 pl-2>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-autocomplete
                      clearable
                      class="pr-2"
                      chips
                      deletable-chips
                      multiple
                      small-chips
                      v-on="on"
                      v-model="meeting.participants"
                      outlined
                      :label="$t('participants')"
                      :items="lead_owners_array"
                      item-value="id"
                      item-text="Full_Code"
                    ></v-autocomplete>
                  </template>
                  <span>{{ $t("participants") }}</span>
                </v-tooltip>
              </v-flex>
              <v-row class="pl-2">
                <v-col cols="12" md="6" v-if="source != 'Lead'">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-select
                        :readonly="source == 'Lead'"
                        v-model="meeting.link_to"
                        :items="link_array"
                        :label="$t('link_to')"
                        v-on="on"
                        outlined
                        item-value="longname"
                        item-text="longname"
                        dense
                        :rules="fieldRules"
                        class="required_field"
                      ></v-select>
                    </template>
                    <span>{{ $t("link_to") }}</span>
                  </v-tooltip>
                </v-col>

                <v-col cols="12" :md="source != 'Lead' ? 6 : 12">
                  <div v-if="meeting.link_to == 'Lead'">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          :readonly="source == 'Lead'"
                          v-model="meeting.lead_id"
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
                      </template>
                      <span>{{ $t("lead_name") }}</span>
                    </v-tooltip>
                  </div>
                  <div v-if="meeting.link_to == 'Candidate'">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          :readonly="source == 'Lead'"
                          v-model="meeting.candidate_id"
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
                      </template>
                      <span>{{ $t("candidates") }}</span>
                    </v-tooltip>
                  </div>
                  <div v-if="meeting.link_to == 'Connect'">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          :readonly="source == 'Lead'"
                          v-model="meeting.connect_id"
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
                      </template>
                      <span>{{ $t("connects") }}</span>
                    </v-tooltip>
                  </div>
                </v-col>
              </v-row>
              <v-flex xs12 md12 pl-2>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-on="on"
                      v-model="meeting.location"
                      v-bind:label="$t('location')"
                      class="pr-2"
                      outlined
                      dense
                    ></v-text-field>
                  </template>
                  <span>{{ $t("location") }}</span>
                </v-tooltip>
              </v-flex>
              <v-flex xs12 md12 pl-2>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-textarea
                      v-on="on"
                      class="pr-2"
                      v-model="meeting.comment"
                      dense
                      rows="3"
                      maxlength="2000"
                      v-bind:label="$t('comments')"
                      outlined
                      counter="2000"
                    ></v-textarea>
                  </template>
                  <span>{{ $t("comments") }}</span>
                </v-tooltip>
              </v-flex>
              <v-flex xs12 md3 pl-2>
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-select
                      v-model="meeting.remind_me"
                      :items="remind_me_options"
                      item-text="longname"
                      item-value="shortname"
                      v-bind:label="$t('remind_me')"
                      v-on="on"
                      outlined
                      dense
                    ></v-select>
                  </template>
                  <span>{{ $t("remind_me") }}</span>
                </v-tooltip>
              </v-flex>
              <v-flex
                v-if="meeting.remind_me == 'custom'"
                xs12
                md5
                pl-2
                class="date_pick"
              >
                <v-menu
                  v-model="menu5"
                  ref="menu5"
                  :close-on-content-click="false"
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="formattedCustomdate"
                      v-bind:label="$t('custom_date')"
                      append-icon="mdi-calendar"
                      outlined
                      dense
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      class="required_field"
                      :rules="fieldRules"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="meeting.custom_date"
                    no-title
                    :min="new Date().toISOString().substr(0, 10)"
                    @click:date="$refs.menu.save(menu5)"
                    scrollable
                  >
                  </v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex v-if="meeting.remind_me == 'custom'" xs12 md4 pl-2>
                <v-menu
                  ref="menu"
                  v-model="menu6"
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
                      v-model="meeting.custom_time"
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
                    v-if="menu6"
                    v-model="meeting.custom_time"
                    full-width
                    @click:minute="$refs.menu.save(meeting.custom_time)"
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
  data: () => ({
    valid: false,
    successmessage: "",
    message: "",
    valid_error: false,
    loading: false,
    isBtnLoading: false,
    isDisabled: false,
    loader: false,
    menu1: false,
    menu2: false,
    menu3: false,
    menu4: false,
    menu5: false,
    menu6: false,
    show_error: false,
    error_msg: "something went wrong",
    time: null,
    meeting: {
      id: 0,
      title: "",
      start_date: "",
      start_time: "",
      duration: "",
      is_all_day: 0,
      assigned_to: "",
      participants: [],
      lead_id: null,
      connect_id: null,
      candidate_id: null,
      location: "",
      comment: "",
      remind_me: "none",
      custom_date: "",
      custom_time: "",
      link_to: "",
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
    meeting_duration: [
      {
        id: 1,
        shortname: "30 mins",
        longname: "30 mins",
      },
      {
        id: 2,
        shortname: "1hr",
        longname: "1 hour",
      },
      {
        id: 3,
        shortname: "1.5hr",
        longname: "1.5 hour",
      },
      {
        id: 4,
        shortname: "2hr",
        longname: "2 hour",
      },
    ],
    formattedStartdate: "",
    formattedEnddate: "",
    formattedCustomdate: "",
    lead_owners_array: [],
    user: [],
    org_id: null,
    emp_id: null,
    roles: "",
    leads_array: [],
    candidates_array: [],
    connects_array: [],
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
  }),

  props: ["lead_id", "show_meeting_amend", "selected_meeting", "source"],

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
          this.meeting.lead_id = this.lead_id;
        }
      },
    },
    menu1: {
      immediate: true,
      handler() {
        if (this.meeting.start_date) {
          this.formatStartDate();
        }
      },
    },
    menu3: {
      immediate: true,
      handler() {
        if (this.meeting.end_date) {
          this.formatEndDate();
        }
      },
    },
    menu5: {
      immediate: true,
      handler() {
        if (this.meeting.custom_date) {
          this.formatCustomDate();
        }
      },
    },
    selected_meeting: {
      immediate: true,
      handler() {
        if (this.selected_meeting) {
          this.loader = true;
          axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "lead_meeting/" +
                this.selected_meeting +
                "/edit"
            )
            .then((res) => {
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "S") {
                this.meeting = res.data.meeting;
                this.formatStartDate();
                if (this.meeting.custom_date) {
                  this.formatCustomDate();
                }
                if (this.source == "Lead") {
                  this.meeting.link_to = "Lead";
                }
                this.loader = false;
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
          if (this.source == "Lead") {
            var source_type = "Lead";
          }
          this.meeting = {
            id: 0,
            title: "",
            start_date: "",
            start_time: "",
            duration: "",
            is_all_day: 0,
            assigned_to: "",
            participants: [],
            lead_id: this.lead_id,
            location: "",
            comment: "",
            remind_me: "none",
            custom_date: "",
            custom_time: "",
            link_to: source_type,
          };
        }
      },
    },
  },
  async mounted() {
    this.user = await JSON.parse(localStorage.getItem("user"));
    this.org_id = this.user.hr_employee.org_id;
    this.emp_id = this.user.emp_id;
    this.roles = this.user.hr_employee.emprole_name;
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
    fetchLeadsOwners() {
      this.loader = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchleadownersbyrole")
        .then((res) => {
          if ((res.data.status = "S")) {
            this.lead_owners_array = res.data.lead_owners;
            this.meeting.assigned_to = this.user.hr_employee.id;
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
    formatStartDate() {
      var dateformat = new Date(this.meeting.start_date);
      this.formattedStartdate =
        dateformat.toLocaleString("default", { day: "2-digit" }) +
        "-" +
        dateformat.toLocaleString("default", { month: "2-digit" }) +
        "-" +
        dateformat.getFullYear();
    },
    formatEndDate() {
      var dateformat = new Date(this.meeting.end_date);
      this.formattedEnddate =
        dateformat.toLocaleString("default", { day: "2-digit" }) +
        "-" +
        dateformat.toLocaleString("default", { month: "2-digit" }) +
        "-" +
        dateformat.getFullYear();
    },
    formatCustomDate() {
      var dateformat = new Date(this.meeting.custom_date);
      this.formattedCustomdate =
        dateformat.toLocaleString("default", { day: "2-digit" }) +
        "-" +
        dateformat.toLocaleString("default", { month: "2-digit" }) +
        "-" +
        dateformat.getFullYear();
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
        if (this.meeting.id == 0) {
          axios
            .post(
              process.env.VUE_APP_API_URL_ADMIN + "lead_meeting",
              this.meeting
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
                this.close();
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
              console.log(err);
            });
        } else {
          axios
            .patch(
              process.env.VUE_APP_API_URL_ADMIN +
                "lead_meeting/" +
                this.meeting.id,
              this.meeting
            )
            .then((res) => {
              this.valid_error = false;
              this.isBtnLoading = false;
              this.isDisabled = false;

              this.error_msg = res.data.message;

              if (res.data.status == "S") {
                this.show_error = false;
                this.$emit("update-meeting");

                this.flashMessage.success({
                  message: res.data.message,
                  time: 4000,
                  blockClass: "custom-block-class",
                });
                this.close();
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
              console.log(err);
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
</style>
