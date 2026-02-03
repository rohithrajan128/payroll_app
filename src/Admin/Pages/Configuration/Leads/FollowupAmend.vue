<template>
  <v-dialog persistent v-model="show_followup_amend" max-width="500" small>
    <v-card class="container pb-3" style="padding: 0px !important">
      <v-toolbar color="primary" dark>
        <span class="headline">{{ $t("create_amend_lead_followup") }}</span>
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
              <v-flex xs12 md6 pl-2 class="align-self-center">
                <DatePicker
                  :label="$t('followup_date')"
                  :min="new Date().toISOString().substr(0, 10)"
                  :stored_date="formDetails.followup_date"
                  @formatted_date="formatted_followup_date"
                  dense
                  :class_required="'RequiredField'"
                  :rules="fieldRules"
                />
              </v-flex>
              <v-flex xs12 md6 pl-2>
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
                      v-model="formDetails.followup_time"
                      :label="$t('followup_time')"
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
                    v-model="formDetails.followup_time"
                    full-width
                    @click:minute="$refs.menu.save(formDetails.followup_time)"
                  ></v-time-picker>
                </v-menu>
              </v-flex>
            </v-layout>
            <v-row class="pl-2">
              <v-col cols="12" md="12" pl-2 v-if="source != 'Lead'" class="py-0">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-select
                      :readonly="source == 'Lead'"
                      v-model="formDetails.link_to"
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
              <v-col cols="12" md="12" class="py-0">
                <div v-if="formDetails.link_to == 'Lead'">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-autocomplete
                        :readonly="source == 'Lead'"
                        v-model="formDetails.lead_id"
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
                <div v-if="formDetails.link_to == 'Candidate'">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-autocomplete
                        :readonly="source == 'Lead'"
                        v-model="formDetails.candidate_id"
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
                <div v-if="formDetails.link_to == 'Connect'">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-autocomplete
                        :readonly="source == 'Lead'"
                        v-model="formDetails.connect_id"
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
              <v-col cols="12" md="12" class="py-0">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-textarea
                      v-on="on"
                      class="pr-2"
                      v-model="formDetails.comments"
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
              </v-col>
            </v-row>
          </v-form>
        </div>
        <div class="d-block text-right pr-4">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div v-on="on" class="d-inline-block mr-2">
                <v-btn
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
    show_error: false,
    error_msg: "something went wrong",
    valid: false,
    time: null,
    successmessage: "",
    message: "",
    valid_error: false,
    loading: false,
    isBtnLoading: false,
    isDisabled: false,
    loader: false,
    menu2: false,
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
    formDetails: {
      id: 0,
      followup_date: "",
      followup_time: "",
      comments: "",
      lead_id: null,
      link_to: "",
      status: 1,
      connect_id: null,
      candidate_id: null,
    },
    leads_array: [],
    candidates_array: [],
    connects_array: [],
    menu: false,
    formattedStartdate: "",
  }),

  props: ["lead_id", "show_followup_amend", "selected_followup", "source"],

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },

  watch: {
    lead_id: {
      immediate: true,
      handler() {
        if (this.lead_id) {
          this.formDetails.lead_id = this.lead_id;
        }
      },
    },

    menu: {
      immediate: true,
      handler() {
        if (this.formDetails.followup_date) {
          this.dateconevreterstartdate();
        }
      },
    },
    selected_followup: {
      immediate: true,
      handler() {
        if (this.selected_followup) {
          this.loader = true;
          axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "leadsfollowup/" +
                this.selected_followup +
                "/edit"
            )
            .then((res) => {
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "S") {
                this.formDetails = res.data.followup_details;
                this.dateconevreterstartdate();
                this.loader = false;
                if (this.source == "Lead") {
                  this.formDetails.link_to = "Lead";
                }
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
          this.formDetails = {
            id: 0,
            followup_date: "",
            followup_time: "",
            comments: "",
            lead_id: this.lead_id,
            status: 1,
            link_to: source_type,
          };
        }
      },
    },
  },
  mounted() {
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
    formatted_followup_date(formatted_date) {
      this.formDetails.followup_date = formatted_date;
    },

    dateconevreterstartdate() {
      var dateformat = new Date(this.formDetails.followup_date);
      this.formattedStartdate =
        dateformat.toLocaleString("default", { day: "2-digit" }) +
        "-" +
        dateformat.toLocaleString("default", { month: "2-digit" }) +
        "-" +
        dateformat.getFullYear();
    },

    formatted_date(formatted_date) {
      this.formDetails.followup_date = formatted_date;
    },

    submit() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        if (this.formDetails.id == 0) {
          axios
            .post(
              process.env.VUE_APP_API_URL_ADMIN + "leadsfollowup",
              this.formDetails
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
                this.$emit("update-followups");
                this.close();
              } else {
                this.show_error = true;
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
                "leadsfollowup/" +
                this.formDetails.id,
              this.formDetails
            )
            .then((res) => {
              this.valid_error = false;
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
                this.$emit("update-followups");
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
.select_field {
  position: absolute;
  right: 15px;
  top: 12px;
  width: 62%;
  height: 20px !important;
}
.select_field /deep/ .v-label--active {
  background: white;
  padding: 0px 12px 0px 12px;
}
.currency-type >>> .v-input__append-inner {
  display: none;
}
</style>
