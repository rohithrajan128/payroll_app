<template>
  <div class="main-20">
    <v-sheet class="pa-7">
      <page-title
        class="mb-4"
        :heading="$t('apply_leave')"
        :google_icon="google_icon"
      ></page-title>
      <VueElementLoading
        :active="loader"
        spinner="bar-fade-scale"
        color="var(--primary)"
      />
      <v-form ref="form" v-model="valid">
        <div class="row">
          <div class="col-md-12">
            <v-layout>
              <div class="row">
                <div class="col-md-6">
                  <v-layout>
                    <v-flex md7 class="radio-item b h6 align-self-center">
                      <div
                        class="optiontextstyle align-self-center"
                        style="display: inline-flex; align-items: center"
                      >
                        {{ $t("specialleave") }} :
                        <v-radio-group
                          :disabled="$route.query.id"
                          inline
                          v-model="specialLeave"
                          class="d-flex"
                        >
                          <v-radio
                            label="Yes"
                            class="radio_items"
                            :value="1"
                          ></v-radio>
                          <v-radio
                            label="No"
                            class="radio_items"
                            :value="0"
                          ></v-radio>
                        </v-radio-group>
                      </div>
                    </v-flex>
                    <v-flex md5 class="optiontextstyle align-self-center">
                      <div v-if="isBereavementLeave">
                        {{ $t("status") }} :
                        <v-chip
                          class="mb-1 ml-3"
                          color="success"
                          outlined
                          small
                        >
                          <span v-if="leave_details.leavestatus != 'New'">
                            {{ leave_details.status }}
                          </span>
                          <span v-else>{{ leave_details.leavestatus }}</span>
                        </v-chip>
                      </div>
                    </v-flex>
                  </v-layout>
                </div>
                <div class="col-md-6 pr-9">
                  <v-layout>
                    <v-flex md3>
                      <v-card max-width="115px" class="mb-10">
                        <div class="leavedetailscard">
                          {{ $t("allotted")
                          }}<span
                            class="leaveshortnamedisplay"
                            v-if="leaveshortname"
                          >
                            ({{ leaveshortname }})</span
                          >
                        </div>
                        <div class="leavecountcard">{{ allotted_leaves }}</div>
                      </v-card>
                    </v-flex>
                    <v-flex md3>
                      <v-card max-width="115px" class="mb-10 ml-2">
                        <div class="leavedetailscard">
                          {{ $t("applied")
                          }}<span
                            class="leaveshortnamedisplay"
                            v-if="leaveshortname"
                          >
                            ({{ leaveshortname }})</span
                          >
                        </div>
                        <div class="leavecountcard">{{ applied_leaves }}</div>
                      </v-card>
                    </v-flex>
                    <v-flex md3>
                      <v-card max-width="115px" class="mb-10 ml-2">
                        <div class="leavedetailscard">
                          {{ $t("availed")
                          }}<span
                            class="leaveshortnamedisplay"
                            v-if="leaveshortname"
                          >
                            ({{ leaveshortname }})</span
                          >
                        </div>
                        <div class="leavecountcard">{{ availed_leaves }}</div>
                      </v-card>
                    </v-flex>
                    <v-flex md3>
                      <v-card max-width="115px" class="mb-10 ml-2">
                        <div class="leavedetailscard">
                          {{ $t("balance")
                          }}<span
                            class="leaveshortnamedisplay"
                            v-if="leaveshortname"
                          >
                            ({{ leaveshortname }})</span
                          >
                        </div>
                        <div class="leavecountcard">{{ balance_leaves }}</div>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </div>
              </div>
            </v-layout>
            <v-layout class="mt-2">
              <v-flex xs12 md6 class="pr-12">
                <v-autocomplete
                  v-bind:label="$t('leave_type')"
                  outlined
                  dense
                  class="required_field"
                  v-model="leave_details.leave_type"
                  :rules="fieldRules"
                  :disabled="$route.query.id"
                  @change="checkitisbereavement(leave_details.leave_type)"
                  :items="leave_master_types"
                  item-text="leave_name"
                  item-value="id"
                ></v-autocomplete>
              </v-flex>
              <v-flex xs12 md6 class="pr-12">
                <div v-if="!isBereavementLeave" class="optiontextstyle">
                  {{ $t("status") }} :
                  <v-chip class="mb-1 ml-3" color="success" outlined small>
                    <span v-if="leave_details.leavestatus != 'New'">
                      {{ leave_details.status }}
                    </span>
                    <span v-else>{{ leave_details.leavestatus }}</span>
                    <v-icon end icon="mdi-account-outline"></v-icon>
                  </v-chip>
                </div>
                <v-autocomplete
                  v-bind:label="$t('relation_type')"
                  outlined
                  dense
                  class="required_field"
                  :disabled="$route.query.id"
                  v-model="leave_details.relation_type"
                  v-if="isBereavementLeave"
                  :rules="fieldRules"
                  required
                  :items="relation_array"
                  item-text="shortname"
                  item-value="id"
                ></v-autocomplete>
              </v-flex>
            </v-layout>
            <v-layout class="mt-2">
              <v-flex xs12 md3 class="align-self-center">
                <v-menu
                  v-model="menu"
                  ref="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="formattedStartdate"
                      v-bind:label="$t('start_date')"
                      :disabled="$route.query.id"
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
                  <!-- :allowed-dates="allowedDates" -->
                  <v-date-picker
                    v-model="leave_details.start_date"
                    no-title
                    :min="effective_date"
                    :max="effective_end_date"
                    :allowed-dates="disabledHolidays"
                    @click:date="$refs.menu.save(menu)"
                    scrollable
                  >
                  </v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 md3 class="pr-12 pl-3 align-self-center">
                <v-autocomplete
                  outlined
                  dense
                  class="required_field"
                  required
                  :disabled="$route.query.id"
                  v-model="leave_details.start_date_day_type"
                  :rules="fieldRules"
                  @change="checkstartdaytype(leave_details.start_date_day_type)"
                  :items="start_day_type_array"
                  item-text="shortname"
                  item-value="shortname"
                ></v-autocomplete>
              </v-flex>
              <v-flex xs12 md3 class="align-self-center">
                <v-menu
                  v-model="menu1"
                  ref="menu1"
                  :close-on-content-click="false"
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="formattedEnddate"
                      v-bind:label="$t('end_date')"
                      :disabled="$route.query.id || enddatedisable"
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
                    v-model="leave_details.end_date"
                    no-title
                    :min="leave_details.start_date"
                    :max="endDateMin"
                    @click:date="$refs.menu1.save(menu1)"
                    scrollable
                    :allowed-dates="disabledHolidays"
                  >
                  </v-date-picker>
                </v-menu>
              </v-flex>

              <v-flex xs12 md3 class="pr-12 pl-3 align-self-center">
                <v-autocomplete
                  outlined
                  dense
                  class="required_field"
                  required
                  :min="leave_details.start_date"
                  v-model="leave_details.end_date_day_type"
                  :rules="fieldRules"
                  :disabled="$route.query.id || end_date_day_type_disable"
                  :items="end_day_type_array"
                  item-text="shortname"
                  item-value="shortname"
                ></v-autocomplete>
              </v-flex>
            </v-layout>
            <v-layout class="mt-2">
              <v-flex xs12 md6 class="pr-14">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-on="on"
                      v-bind:label="$t('alt_phone_no')"
                      outlined
                      dense
                      required
                      :rules="[...phoneRules]"
                      v-model="leave_details.alt_phone_no"
                      maxlength="12"
                      :disabled="$route.query.id"
                      v-on:keypress="NumbersOnly"
                    ></v-text-field>
                  </template>
                  <span>{{ $t("alt_phone_no") }}</span>
                </v-tooltip>
              </v-flex>
              <v-flex v-if="is_file_upload == 1" xs12 md6 class="pr-13">
                <v-text-field
                  readonly
                  outlined
                  dense
                  prepend-inner-icon="mdi-file"
                  v-if="$route.query.id"
                  :disabled="$route.query.id"
                  v-model="leave_details.document"
                  v-bind:label="$t('document')"
                ></v-text-field>
                <div class="browsedivdoc" v-else>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        readonly
                        outlined
                        dense
                        prepend-inner-icon="mdi-file"
                        v-on="on"
                        v-model="leave_details.document"
                        @keypress="callDocumentSelect"
                        @click="callDocumentSelect"
                        v-bind:label="$t('document')"
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
                    <span>{{ $t("document") }}</span>
                  </v-tooltip>
                  <div
                    v-if="
                      leave_details.document != '' &&
                      leave_details.document != null
                    "
                    class="documentdownloadapplyleave"
                  >
                    <a
                      :href="envImagePath + leave_details.document"
                      class="text-primary f-13 a-underline"
                    >
                      {{ $t("download") }}
                    </a>
                  </div>
                </div>
              </v-flex>
            </v-layout>

            <v-layout class="mt-2">
              <v-flex xs12 md12 class="pr-10">
                <v-textarea
                  outlined
                  class="required_field"
                  rows="2"
                  v-bind:label="$t('reason_for_leave')"
                  :disabled="$route.query.id"
                  v-model="leave_details.details"
                  :rules="fieldRules"
                  counter="500"
                  maxlength="500"
                ></v-textarea>
              </v-flex>
            </v-layout>

            <v-layout class="mt-2" v-if="AtcancelLeave">
              <v-flex xs12 md12 class="pr-10">
                <v-textarea
                  outlined
                  class="required_field"
                  rows="2"
                  v-bind:label="$t('reason_for_cancelling')"
                  v-model="leave_details.cancel_reason"
                  :rules="fieldRules"
                  ref="ROLfocus"
                  counter="500"
                  maxlength="500"
                ></v-textarea>
              </v-flex>
            </v-layout>
          </div>
        </div>
        <v-layout class="mt-1">
          <v-flex xs12 md12 class="text-right pr-10">
            <v-spacer></v-spacer>
            <v-btn
              small
              color="btn mr-3 mb-3 hover_shine cancel_button"
              @click="$router.go(-1)"
            >
              {{ $t("cancel") }}
            </v-btn>
            <v-btn
              small
              :disabled="isBtnLoading"
              class="mr-2 primary hover_shine mb-3"
              @click="applyLeave"
              v-if="!$route.query.id"
            >
              <span>{{ $t("applyleave") }}</span>
              <b-spinner small v-if="isBtnLoading"></b-spinner>
            </v-btn>
            <v-btn
              small
              color="small btn mr-2 mb-3  hover_shine error"
              @click="showCancelLeave"
              :disabled="isBtnLoading1"
              v-if="
                $route.query.id &&
                leave_details.status != 'Cancelled' &&
                leave_details.status != 'Waiting'
              "
            >
              {{ $t("cancel_leave") }}
              <b-spinner small v-if="isBtnLoading1"></b-spinner>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-form>
    </v-sheet>
    <ConfirmDialog
      :show="showStatusDialog"
      :cancel="cancelStatus"
      :confirm="confirmStatus"
      v-bind:title="$t('confirm')"
      v-bind:description="confirmation_leaveadvance_message"
    />

    <ConfirmDialog
      :show="showCancelDialog"
      :cancel="cancelDialog"
      :confirm="confirmCancel"
      v-bind:title="$t('confirm')"
      v-bind:description="confirmation_cancel_message"
    />

    <div style="display: none">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <span v-on="on">
            <DocumentSelect
              :label="'Document '"
              :folder="'leave_document'"
              :uploadtype="enable_document_select"
              @closeDialog="closeDialog"
              @uploadedDocument="uploadedDocument"
            ></DocumentSelect>
            <!-- :documentlink="assetdetails.invoice_attached" -->
          </span>
        </template>
        <span>{{ $t("file_input") }}</span>
      </v-tooltip>
    </div>
  </div>
</template>
    
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import DocumentSelect from "../Components/Upload/DocumentSelect.vue";
import DatePicker from "../Components/DatePicker.vue";
import VueElementLoading from "vue-element-loading";
import moment from "moment";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
export default {
  components: {
    PageTitle,
    DocumentSelect,
    DatePicker,
    VueElementLoading,
    moment,
    ConfirmDialog,
  },
  data: () => ({
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    isBereavementLeave: false,
    enable_document_select: "",
    isBtnLoading: false,
    isBtnLoading1: false,
    specialLeave: 0,
    valid: true,
    formattedStartdate: "",
    formattedEnddate: "",
    menu: false,
    menu1: false,
    loader: false,
    showStatusDialog: false,
    showCancelDialog: false,
    AtcancelLeave: false,
    confirmation_leaveadvance_message: "",
    confirmation_cancel_message: "",
    user: [],
    google_icon: {
      icon_name: "edit_square",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    holidays_allowed: [],
    weekoff_allowed: [],
    noofdays_before_apply: "",
    all_leave_types: [],
    leave_master_types: [],
    relation_array: [],
    start_day_type_array: [],
    end_day_type_array: [],
    end_date_day_type_disable: false,
    enddatedisable: false,
    leave_details: {
      id: "0",
      employee_id: "",
      org_id: "",
      relation_type: "",
      document: "",
      details: "",
      end_date_day_type: "Full Day",
      start_date_day_type: "Full Day",
      end_date: "",
      start_date: "",
      alt_phone_no: "",
      leave_type: "",
      special_leave: "",
      leavestatus: "New",
      cancel_reason: null,
    },
    user_id: "",
    org_id: "",
    is_file_upload: false,
    balance_leaves: "",
    availed_leaves: "",
    applied_leaves: "",
    allotted_leaves: "",
    leaveshortname: "",
    effective_date: "",
    effective_end_date: "",
    findleave: "",
  }),
  created() {},
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    phoneRules() {
      return [(v) => !v || v.length >= 10 || this.$t("valid_number_required")];
    },
    endDateMin() {
      if (this.leave_details.start_date != "") {
        var someDate = new Date(this.leave_details.start_date);
        var numberOfDaysToAdd = this.findleave.max_consecutive_days;
        var result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
        //  let date=new Date(result)
        var date1 = moment(new Date(result));
        return date1.format("YYYY-MM-DD");
      }
    },
  },
  watch: {
    "$route.query.id": {
      immediate: true,
      handler() {
        if (this.$route.query.id) {
          this.fetchempleavebyemployeeid();
        }
      },
    },

    specialLeave: {
      immediate: true,
      handler() {
        if (this.$route.query.id == null) {
          this.leave_details.leave_type = "";
          if (this.user_id) {
            this.fetchTotalappliedleavecount(
              this.user_id,
              this.leave_details.leave_type
            );
          }
        }
        this.checkwhichleave();
        this.leave_details.special_leave = this.specialLeave;
      },
    },

    menu: {
      immediate: true,
      handler() {
        if (this.leave_details.start_date) {
          this.dateconevreterstartdate();
          this.leave_details.end_date = this.leave_details.start_date;
          this.dateconevreterenddate();
          if ((this.leave_details.start_date = this.leave_details.end_date)) {
            this.end_date_day_type_disable = true;
            this.leave_details.end_date_day_type = "Full Day";
          } else {
            this.end_date_day_type_disable = false;
          }
        }
      },
    },
    menu1: {
      immediate: true,
      handler() {
        if (this.leave_details.end_date) {
          this.dateconevreterenddate();
          if (this.leave_details.start_date != this.leave_details.end_date) {
            this.end_date_day_type_disable = false;
          } else {
            this.end_date_day_type_disable = true;
          }
        }
      },
    },

    user_id: {
      immediate: true,
      handler() {
        this.leave_details.employee_id = this.user_id;
        this.leave_details.org_id = this.org_id;
        if (this.user_id > 0) {
          this.fetch_weekoffs_and_holidays();
          this.fetchleavetypes(this.user_id);
          this.fetchTotalappliedleavecount(
            this.user_id,
            this.leave_details.leave_type
          );
        }
      },
    },
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.user_id = this.user.emp_id;
    this.org_id = this.user.hr_employee.org_id;
    this.fetchlookup();
  },

  methods: {
    disabledHolidays(val) {
      if (
        this.weekoff_allowed.indexOf(moment(val).format("dddd")) !== -1 ||
        this.holidays_allowed.indexOf(val) !== -1
      ) {
        return false;
      } else {
        return true;
      }
    },

    fetch_weekoffs_and_holidays() {
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "getemployeeweekoffandholidays/" +
            this.user_id
        )
        .then((res) => {
          this.holidays_allowed = res.data.holidays;
          this.weekoff_allowed = res.data.weekoff;
        })
        .catch((err) => {
          console.log("this error" + err);
        });
    },

    // allowedDates(val) {
    //   return moment(val).day() !== 1 && moment(val).day() !== 5;
    // },
    cancelStatus() {
      this.showStatusDialog = false;
    },
    confirmStatus() {
      this.confirm_apply_leave();
      this.showStatusDialog = false;
    },
    showCancelLeave() {
      if (this.leave_details.cancel_reason == null) {
        this.AtcancelLeave = true;
        setTimeout(this.focussetROL, 30);
      } else {
        this.confirmation_cancel_message = this.$t("want_to_cancel_the_leave");
        this.showCancelDialog = true;
      }
    },
    cancelDialog() {
      this.showCancelDialog = false;
    },
    confirmCancel() {
      this.showCancelDialog = false;
      this.CancelLeave();
    },
    dateconevreterstartdate() {
      var dateformat = new Date(this.leave_details.start_date);
      this.formattedStartdate =
        dateformat.toLocaleString("default", { day: "2-digit" }) +
        "-" +
        dateformat.toLocaleString("default", { month: "short" }) +
        "-" +
        dateformat.getFullYear();
    },
    dateconevreterenddate() {
      var dateformat = new Date(this.leave_details.end_date);
      this.formattedEnddate =
        dateformat.toLocaleString("default", { day: "2-digit" }) +
        "-" +
        dateformat.toLocaleString("default", { month: "short" }) +
        "-" +
        dateformat.getFullYear();
    },
    fetchlookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "RELATION_TYPE",
          },
        })
        .then((response) => {
          this.relation_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "DAY_TYPE",
          },
        })
        .then((response) => {
          this.start_day_type_array = response.data.lookup_details;
          this.end_day_type_array.push(
            { shortname: "Full Day" },
            { shortname: "First Half" }
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },

    applyLeave() {
      if (this.$refs.form.validate()) {
        this.confirmation_leaveadvance_message = "";
        this.noofdays_before_apply = "";
        this.leave_details.employee_id = this.user_id;
        this.leave_details.org_id = this.org_id;
        var no_of_day_in_advance = this.leave_master_types.find(
          (x) => x.id == this.leave_details.leave_type
        ).leave_in_advance;
        if (no_of_day_in_advance != null && no_of_day_in_advance!=0) {
          var advancestartDate = moment(
            this.leave_details.start_date,
            "YYYY-MM-DD"
          );
          var advanceendDate = moment(
            this.leave_details.end_date,
            "YYYY-MM-DD"
          );
             // var noofdaysapplied = advanceendDate.diff(advancestartDate, "days");
              this.noofdays_before_apply =
            // no_of_day_in_advance * (noofdaysapplied + 1);
            no_of_day_in_advance;
          this.confirmation_leaveadvance_message =
            this.$t("leave_should_be_applied") +
            this.noofdays_before_apply +
            this.$t("days_before");
          var add_from_today = moment();
          add_from_today = add_from_today.add(
            this.noofdays_before_apply,
            "days"
          );
          add_from_today = add_from_today.format("YYYY-MM-DD");
          if (add_from_today >= this.leave_details.start_date) {
            this.showStatusDialog = true;
          } else {
            this.confirm_apply_leave();
          }
        } else {
          this.confirm_apply_leave();
        }
      }
    },

    confirm_apply_leave() {
      this.isBtnLoading = true;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "applyemployeeleave",
          this.leave_details
        )
        .then((response) => {
          this.isBtnLoading = false;
          if (response.data.status == "S") {
            this.flashMessage.success({
              message: response.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.isBtnLoading = false;
            this.$router.push({
              name: "applyleave",
            });
          }
          if (response.data.status == "EXIST") {
            this.flashMessage.error({
              message: response.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.isBtnLoading = false;
          }
        })
        .catch((err) => {
          this.isBtnLoading = false;
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(err);
        });
    },
    fetchempleavebyemployeeid() {
      this.loader = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetchempleavebyemployeeid/" +
            this.$route.query.id
        )
        .then((response) => {
          if (response.data.status == "S") {
            this.specialLeave = response.data.emp_data.special_leave;
            this.leave_details = response.data.emp_data;
            this.dateconevreterstartdate();
            this.dateconevreterenddate();
            this.isBereavementLeave = response.data.leave;
            this.loader = false;
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(err);
        });
    },

    uploadedDocument(filepath) {
      this.leave_details.document = filepath;
      this.closeDialog();
    },

    closeDialog(uploadtype) {
      this.enable_document_select = "";
    },

    callDocumentSelect() {
      this.enable_document_select = "DragDrop";
    },
    fetchleavetypes(id) {
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetchleavetypesfromleavemaster/" +
            id
        )
        .then((res) => {
          var site_details = this.user.hr_employee.site_id;
          var designation = this.user.hr_employee.designation.longname;
          var emp_id = this.user.hr_employee.id;
          var department = this.user.hr_employee.department;
          var rolename = this.user.hr_employee.emprole_name;
          var employee_type = this.user.hr_employee.employee_type;
          res.data.data.map((ele) => {
            if (ele.date_confirmation == "Date of Joining") {
              var joining_date = this.user.hr_employee.Joining_date;
            } else {
              var joining_date = this.user.hr_employee.date_of_confirmation;
            }
            const haroles = rolename.every((elem) => {
              return JSON.parse(ele.role).includes(elem);
            });
            if (
              ele.site_id.includes(site_details) &&
              (JSON.parse(ele.designation).length == 0 ||
                ele.designation.includes(designation)) &&
              (JSON.parse(ele.department).length == 0 ||
                ele.department.includes(department)) &&
              (haroles || JSON.parse(ele.role).length == 0) &&
              (ele.emp_type.includes(employee_type) ||
                JSON.parse(ele.designation).length == 0) &&
              (JSON.parse(ele.emp_id).length == 0 ||
                ele.emp_id.includes(emp_id))
            ) {
              if (ele.effective_year == "Year(s)") {
                let years_of_exp = moment().diff(joining_date, "years");
                if (years_of_exp >= ele.min_service_year) {
                  this.all_leave_types.push(ele);
                }
              } else if (ele.effective_year == "Month(s)") {
                let months_of_exp = moment().diff(joining_date, "months");
                if (months_of_exp >= ele.min_service_year) {
                  this.all_leave_types.push(ele);
                }
              } else if (ele.effective_year == "Day(s)") {
                let days_of_exp = moment().diff(joining_date, "days");
                if (days_of_exp >= ele.min_service_year) {
                  this.all_leave_types.push(ele);
                }
              }
            }
          });
          this.checkwhichleave();
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
    checkwhichleave() {
      this.leave_master_types = [];
      if (this.specialLeave == 0) {
        for (var i = 0; i < this.all_leave_types.length; i++) {
          if (this.all_leave_types[i].is_special_leave == 0) {
            this.leave_master_types.push(this.all_leave_types[i]);
          }
        }
      } else {
        for (var i = 0; i < this.all_leave_types.length; i++) {
          if (this.all_leave_types[i].is_special_leave == 1) {
            this.leave_master_types.push(this.all_leave_types[i]);
          }
        }
      }
    },
    CancelLeave() {
      this.isBtnLoading1 = true;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "cancelappliedleavebyemp",
          this.leave_details
        )
        .then((response) => {
          if (response.data.status == "S") {
            this.flashMessage.success({
              message: response.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.isBtnLoading1 = false;
            this.AtcancelLeave = false;
            this.$router.push({
              name: "applyleave",
            });
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(err);
        });
    },
    focussetROL() {
      this.$refs.ROLfocus.focus();
      window.scrollTo(0, document.body.scrollHeight);
    },
    checkitisbereavement(leaveid) {
      this.is_file_upload = this.leave_master_types.find(
        (x) => x.id == leaveid
      ).is_file_upload;
      this.leave_details.relation_type = "";

      this.isBereavementLeave = false;
      var LeaveName = this.leave_master_types.find(
        (x) => x.id == leaveid
      ).leave_name;
      if (LeaveName == "Bereavement Leave") {
        this.isBereavementLeave = true;
      }

      var findleave = this.leave_master_types.find((x) => x.id == leaveid);
      this.findleave = findleave;
      var max_calender_date = "";
      if (findleave.date_confirmation == "Date of Joining") {
        max_calender_date = this.user.hr_employee.joining_date;
      } else {
        max_calender_date = moment(
          this.user.hr_employee.date_of_confirmation
        ).format("YYYY-MM-DD");
      }
      var calender_date_limit = "";
      if (findleave.effective_date > max_calender_date) {
        calender_date_limit = max_calender_date;
      } else {
        calender_date_limit = findleave.effective_date;
      }
      this.effective_date = calender_date_limit;
      this.effective_end_date = findleave.effective_end_date;
      this.fetchTotalappliedleavecount(this.user_id, leaveid);
    },

    fetchTotalappliedleavecount(empID, typeID) {
      this.leaveshortname = "";
      this.loader = true;
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "fetchleavescountbyuserid", {
          emp_id: empID,
          leave_id: typeID,
          year_type:this.user.hr_employee['user_org']['leave_calculation_year']
        })
        .then((res) => {
          this.balance_leaves = res.data.balance_leave;
          this.availed_leaves = res.data.availed_leave;
          this.applied_leaves = res.data.applied_leaves;
          this.allotted_leaves = res.data.allotted_leaves;
          if (typeID >= 1) {
            this.leaveshortname = this.leave_master_types.find(
              (x) => x.id == typeID
            ).shortname;
          }
          this.loader = false;
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
    checkstartdaytype(start_day) {
      if (start_day == "First Half") {
        this.leave_details.end_date = this.leave_details.start_date;
        this.leave_details.end_date_day_type = "Full Day";
        this.dateconevreterenddate();
        this.end_date_day_type = "Full Day";
        this.enddatedisable = true;
        this.end_date_day_type_disable = true;
      } else {
        if ((this.leave_details.start_date = this.leave_details.end_date)) {
          this.enddatedisable = false;
        } else {
          this.enddatedisable = false;
          this.end_date_day_type_disable = false;
        }
      }
    },
    // deleteleavereasonDoc() {
    //     this.leave_details.document = '';
    // },
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
  },
};
</script>
<style scoped>
.radio-item /deep/ .v-input--radio-group__input {
  flex-direction: row;
  align-self: center;
}

.radio-item /deep/ .v-label {
  margin-bottom: 0px !important;
}

.radio_items {
  margin-bottom: 0px !important;
  padding-left: 13px;
  padding-right: 13px;
}

.optiontextstyle {
  font-size: 14px;
  font-weight: 600;
  padding-bottom: 10px;
  color: rgb(81, 75, 75);
}

.browsedivdoc {
  display: inline-flex;
  width: 100%;
  position: relative;
}

.browsedivdoc /deep/ .v-chip {
  border-radius: 0%;
}

.browsebtndoc {
  height: 40px;
  margin-left: -10%;
}

.leavedetailscard {
  font-size: 15px;
  text-align: center;
  font-weight: 500;
  /* font-family: "Roboto"; */
  background-color: rgb(22, 113, 205);
  height: 35px;
  color: #eeeeee;
  padding-top: 5px;
}

.leavecountcard {
  text-align: center;
  font-size: 20px;
  /* font-family: sans-serif; */
  font-weight: 500;
  /* border: solid 1px dodgerblue; */
}

.documentdownloadapplyleave {
  position: absolute;
  right: 3px;
  top: 40px;
  font-size: 13px;
  font-weight: 600;
}

.documentdownloadapplyleave:hover {
  font-weight: 700;
  cursor: pointer;
}

.documentdeleteapplyleave {
  position: absolute;
  left: -22px;
  top: 9px;
  cursor: pointer;
}

.leaveshortnamedisplay {
  font-size: 12px;
}
.v-application .accent--text{color: #000 !important;}
.v-btn::before {color: #000 !important;}
.v-picker {
  min-width: 343px !important;
}
</style>
  