<template>
  <div class="container-fluid mt-3 p-0">
    <div class="mb-3 mx-auto">
      <div class="card-header">
        <div class="card-header-tab">
          <div class="card-header-title font-size-lg text-capitalize titlewrap">
            {{ $t("create_holiday") }}
          </div>
        </div>
      </div>
      <div class="card-body">
        <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
        <v-form ref="form" v-model="valid">
          <h5 class="pl-2 mb-5">{{ $t("holiday_details") }}</h5>
          <div class="row">
            <div class="col-md-12 pb-0">
              <v-layout>
                <v-flex md4 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-autocomplete v-if="user.hr_employee.emprole_name.includes('SuperUser')
                        " maxlength="50" dense outlined v-bind:label="$t('company')" v-model="holiday.company"
                        v-on="on" required class="required_field" :rules="fieldRules"
                        :disabled="$route.query.slug != null" item-value="id" item-text="shortname" :items="organisation"
                        @change="fetchsite(holiday.company)"></v-autocomplete>

                      <v-autocomplete v-else maxlength="50" dense outlined v-bind:label="$t('company')"
                        v-model="holiday.company" readonly v-on="on" required class="required_field" :rules="fieldRules"
                        :disabled="$route.query.slug != null" item-value="id" item-text="shortname" :items="organisation"
                        @change="fetchsite(holiday.company)"></v-autocomplete>
                    </template>
                    <span>{{ $t("company") }}</span>
                  </v-tooltip>
                </v-flex>
                <v-flex md4 pl-2>
                  <v-tooltip bottom v-if="$route.query.slug">
                    <template v-slot:activator="{ on }">
                      <v-select v-bind:label="$t('location')" v-on="on" index="id" item-value="id" class="required_field"
                        item-text="unique_location" v-model="holiday.site_id" :items="site" outlined multiple disabled
                        dense>
                      </v-select>
                    </template>
                    <span>{{ $t("location") }}</span>
                  </v-tooltip>
                  <v-tooltip bottom v-else>
                    <template v-slot:activator="{ on }">
                      <v-autocomplete v-if="user.hr_employee.emprole_name.includes('SuperUser')
                        " v-bind:label="$t('location')" v-on="on" index="id" item-value="id" class="required_field"
                        item-text="unique_location" :disabled="holiday.company == ''" v-model="holiday.site_id"
                        :rules="fieldRules" :items="site" outlined multiple dense>
                        <v-list-item slot="prepend-item" ripple @click="selectEmployeeDesignation" class="ml-5">
                          <v-list-item-action>
                            <v-icon :color="holiday.site_id.length > 0 > 0 ? '#1976d2' : ''
                              " class="select_icon_font_size">{{ iconDesignation }}</v-icon>
                          </v-list-item-action>
                          <v-list-item-title style="margin-left: 31px">Select All</v-list-item-title>
                        </v-list-item>
                        <v-divider slot="prepend-item" class="mt-2" />
                      </v-autocomplete>

                      <v-autocomplete v-else v-bind:label="$t('location')" v-on="on" index="id" item-value="id" readonly
                        class="required_field" item-text="unique_location" :disabled="holiday.company == ''"
                        v-model="holiday.site_id" :rules="fieldRules" :items="site" outlined multiple dense>
                      </v-autocomplete>

                      <!-- <v-select v-else  v-bind:label="$t('location')" v-on="on" index="id" item-value="id" class="required_field"
                        item-text="unique_location" v-model="user.hr_employee.site_id" :items="site" outlined multiple disabled
                        dense>
                      </v-select> -->
                    </template>
                    <span>{{ $t("location") }}</span>
                  </v-tooltip>
                </v-flex>

                <v-flex md4 pl-2>
                  <v-tooltip bottom v-if="$route.query.slug">
                    <template v-slot:activator="{ on }">
                      <v-text-field disabled v-on="on" v-model="holiday.year_applicable"
                        v-bind:label="$t('year_applicable')" class="required_field" outlined dense></v-text-field>
                    </template>
                    <span>{{ $t("year_applicable") }}</span>
                  </v-tooltip>
                  <v-tooltip bottom v-else>
                    <template v-slot:activator="{ on }">
                      <v-autocomplete v-on="on" maxlength="4" v-model="holiday.year_applicable" :rules="fieldRules"
                        v-bind:label="$t('year_applicable')" required class="required_field" outlined dense
                        v-on:keypress="NumbersOnly" item-value="year" item-text="year" :items="year_array"
                        @change="date_year_fetch(holiday.year_applicable)"></v-autocomplete>
                    </template>
                    <span>{{ $t("year_applicable") }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
            </div>
          </div>
          <v-row class="mb-4">
            <h6 v-if="holiday_list_array.lenght > 0" class="pl-6 mb-5">
              <b>{{ $t("list_of_holidays") }}</b>
            </h6>
            <v-spacer></v-spacer>

            <div v-if="alertdisable">
              <v-alert v-show="valid_error == true && valid_success == false" color="error" icon="warning" outlined>
                <div class="readmore">{{ message }}</div>
                <a v-if="message.length > 200" class="text-primary" @click="Readmore(message)">
                  {{ $t("more") }}
                </a>
              </v-alert>
            </div>
            <div v-if="alertshow">
              <v-alert v-show="valid_error == true && valid_success == false" color="error" icon="warning" outlined>{{
                errormessage
              }}<a class="text-primary ml-2" @click="Readless(message)">
                  {{ $t("less") }}</a>
              </v-alert>
            </div>
            <v-alert dense v-show="valid_error == false && valid_success == true" outlined type="success" text
              class="holiday_container">{{ successmessage }}</v-alert>
            <v-spacer></v-spacer>
            <v-tooltip bottom v-if="!$route.query.slug">
              <template v-slot:activator="{ on }">
                <v-btn small v-on="on" @click="addnewlist" color="primary" class="mr-2">{{ $t("add_holiday") }}</v-btn>
              </template>
              <span>{{ $t("add_holiday") }}</span>
            </v-tooltip>

            <v-tooltip bottom v-if="!$route.query.slug">
              <template v-slot:activator="{ on }">
                <v-btn small v-on="on" @click="addholidayexcell" v-b-toggle.accordion1 color="primary" class="mr-4">{{
                  $t("bulk_holiday") }}</v-btn>
              </template>
              <span>{{ $t("bulk_holiday") }}</span>
            </v-tooltip>
          </v-row>

          <v-form ref="form" v-model="valid" class="mb-5" v-if="!$route.query.slug">
            <v-layout v-if="hideaftersuccess">
              <v-spacer></v-spacer>
              <v-flex xs9 md9 lg9>
                <b-collapse id="accordion1" accordion="my-accordion" role="tabpanel">
                  <b-card-body>
                    <v-layout>
                      <v-flex md2 class="align-self-center text-right">
                        <div class="text-right align-self-center">
                          <v-progress-circular v-if="loading" :size="30" :width="7" color="purple" class="mr-6"
                            style="margin-top:-22px" indeterminate></v-progress-circular>
                        </div>
                      </v-flex>
                      <v-flex md5>
                        <v-file-input :prepend-icon="null" prepend-inner-icon="mdi-microsoft-excel" ref="filedata" dense
                          outlined :rules="fieldRules" @change="selectFile"
                          v-bind:label="$t('file_input')"></v-file-input>

                        <!-- <div class="browsedivdoc">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      readonly
                      outlined
                      dense
                      v-on="on"
                      @click="callDocumentSelect"
                      v-model="announcement.document_upload"
                      v-bind:label="$t('file_input')"
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
              </div> -->
                      </v-flex>
                      <v-flex md1 pl-3 pb-0 ml-3>
                        <v-btn :disabled="!valid" class="btn-shadow-primary btn btn-primary btn-lg"
                          @click="uploadHolidaylist">{{ $t("upload") }}</v-btn>
                      </v-flex>
                      <v-flex md4 ml-6>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <a :href="'/files/holiday_template.xlsx'" download>
                              <img v-on="on" class="img_align img-responsive mr-2 image ml-5"
                                style="width: 50px; margin-top: -5px" src="@/assets/images/xlsxicon.png" alt /></a>
                          </template>
                          <span>{{ $t("download_template") }}</span>
                        </v-tooltip>
                      </v-flex>
                    </v-layout>
                  </b-card-body>
                </b-collapse>
              </v-flex>
              <v-spacer></v-spacer>
            </v-layout>
          </v-form>
          <div v-for="(list, index) in holiday_list_array" :key="index">
            <v-layout wrap class="px-2">
              <v-flex md3 pl-2>
                <v-combobox @change="checkholidayexist(list.master_id, index)" ref="masterCombo" v-model="list.master_id"
                  dense v-bind:label="$t('holiday_name')" outlined item-value="id" item-text="longname"
                  :items="holidays_array" class="required_field" :rules="fieldRules">
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title>
                        No Holidays matching, Click
                        <v-btn x-small class="primary text-white" @click="createinput(index)">here</v-btn>
                        to create a new one
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                </v-combobox>

              </v-flex>
              <v-flex md3 pl-2 class="createlookupflex">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-autocomplete v-on="on" item-value="longname" item-text="longname" v-model="list.holiday_type"
                      :rules="fieldRules" v-bind:label="$t('holiday_type')" :items="holiday_type" required
                      class="required_field" outlined dense></v-autocomplete>
                  </template>
                  <span>{{ $t("holiday_type") }}</span>
                </v-tooltip>
                <CreateLookup lookup_parent_name="HOLIDAY_TYPE" @lookup_data="lookupMessage"
                  :dropdownlabel="$t('holiday_type')"></CreateLookup>
              </v-flex>
              <v-flex md3 pl-2>
                <DatePicker :label="$t('date')" :stored_date="list.holiday_date" :rules="fieldRules"
                  :class_required="'RequiredField'" :min="min_year_date" :max="max_year_date" :list_index="index"
                  @formatted_date_index="formatted_date_index" />
              </v-flex>
              <v-flex md2 pl-2>
                <v-text-field v-model="list.dayname" v-bind:label="$t('day_name')" outlined dense disabled>
                </v-text-field>
              </v-flex>
              <v-flex md1 calss="justify-content-between" pt-1>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon class="delete_btn mr-2 icon_size " medium @click="minimizerowindex(index)" v-on="on">
                      mdi-trash-can-outline</v-icon>
                  </template>
                  <span>{{ $t("remove") }}</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon class="text-white rounded-pill  iconflexaddremove" medium @click="addrowindex(index)"
                      v-show="index === holiday_list_array.length - 1" v-on="on">
                      mdi-plus</v-icon>
                  </template>
                  <span>{{ $t("add") }}</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </div>
        </v-form>
      </div>
      <div class="d-block text-right mr-4">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block mr-2">
              <v-btn v-on="on" small @click="$router.go(-1)" class="ma-1 font-weight-bold cancel-btn"
                color="btn hover_shine cancel_button">{{ $t("cancel") }}</v-btn>
            </div>
          </template>
          <span>{{ $t("cancel") }}</span>
        </v-tooltip>
        <v-tooltip bottom v-if="holiday_list_array.length >= 1">
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block">
              <v-btn :disabled="isDisabled" color="green darken-1" @click="saveholiday" small
                class="mr-2 success hover_shine">
                {{ $t("save") }}
                <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
              </v-btn>
            </div>
          </template>
          <span>{{ $t("save") }}</span>
        </v-tooltip>
      </div>
    </div>
  </div>
</template>
  
<script>
import VueElementLoading from "vue-element-loading";
import MediaSelect from "../Components/Upload/MediaSelect.vue";
import DatePicker from "../Components/DatePicker.vue";
import DocumentSelect from "../Components/Upload/DocumentSelect.vue";
import CreateLookup from "../../../Pages/CreateLookup.vue";
export default {
  components: {
    VueElementLoading,
    MediaSelect,
    DatePicker,
    DocumentSelect,
    CreateLookup
  },
  data: () => ({
    hideaftersuccess: false,
    alertshow: false,
    alertdisable: true,
    errormessage: "",
    successmessage: "",
    message: "",
    dialog: false,
    uploaded_file: "",
    valid: false,
    valid_error: false,
    valid_success: false,
    enable_document_select: "",
    date: "",
    menu: false,
    valid: true,
    loader: false,
    isBtnLoading: false,
    isDisabled: false,
    user: [],
    user_id: "",
    holiday: {
      userID: "",
      company: "",
      site_id: [],
      year_applicable: "",
    },
    min_year_date: "",
    max_year_date: "",
    holiday_list: {
      id: 0,
      master_id: "",
      holiday_date: "",
      dayname: "",
      holiday_type: "",
    },
    holiday_list_array: [],
    holidays_array: [],
    holiday_type: [],
    site: [],
    year_array: [],
    organisation: [],
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    iconDesignation() {
      if (this.selectall_employee_designation) return "mdi-checkbox-marked";
      if (this.select_single_designation) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    },
    selectall_employee_designation() {
      return this.holiday.site_id.length === this.site.length;
    },
    select_single_designation() {
      return (
        this.holiday.site_id.length > 0 && !this.selectall_employee_designation
      );
    },
  },

  mounted() {
    let currentYear = new Date().getFullYear();
    this.fetchyearArray(currentYear);
    this.date_year_fetch(currentYear);
    this.fetchlookup();
    this.fetchOrg();
  },

  created() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.user_id = this.user.emp_id;
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          axios
            .post(
              process.env.VUE_APP_API_URL_ADMIN +
              "fetchholiday?slug=" +
              this.$route.query.slug
            )
            .then((res) => {
              this.btnloading = false;
              this.loader = false;
              if (res.data.status == "S") {
                this.message = res.data.message;
                this.holiday_list_array = res.data.holiday;
                this.holiday.company = res.data.organisation;
                this.fetchsite(this.holiday.company);
                this.holiday.site_id = res.data.location_id;
                this.holiday.year_applicable = res.data.year;
              } else if (res.data.status == "E") {
                this.message = res.data.message;
              }
            })
            .catch((err) => {
              this.isDisabled = false;
              console.log("this error" + err);
            });
        }
        else {
          this.holiday_list_array.push(this.holiday_list);
          this.holiday_list = {
            master_id: "",
            holiday_date: "",
            dayname: "",
            holiday_type: "",
          };
        }
      },
    },
    user_id: {
      immediate: true,
      handler() {
        if (this.user_id >= 1) {
          this.holiday.userID = this.user_id;
        }
      },
    },
    user: {
      immediate: true,
      handler() {
        // alert(this.user.hr_employee.org_id)
        if (this.user.hr_employee.org_id != null) {
          this.holiday.company = this.user.hr_employee.org_id;
          this.holiday.site_id = [this.user.hr_employee.site_id];
          this.fetchsite(this.holiday.site_id);
        }
      },
    },
  },

  methods: {
    closeDocumentSelectDialog(uploadtype) {
      this.enable_document_select = "";
    },
    callDocumentSelect() {
      this.enable_document_select = "DragDrop";
    },
    createinput(index) {
      this.$refs["masterCombo"][index].blur();
      this.$nextTick(() => {
        this.createnewlookupskills(
          this.holiday_list_array[index].master_id,
          index
        );
      });
    },
    createnewlookupskills(value, index) {
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "addholidayslookupsvalues", {
          skills: value,
          lookup: "HOLIDAYS",
        })
        .then((response) => {
          this.holiday_list_array[index].master_id = [];
          this.fetchlookup();
          this.holiday_list_array[index].master_id = response.data.lookupid;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addholidayexcell() {
      if (this.$refs.form.validate()) {
        this.hideaftersuccess = true;
      }
    },
    fetchyearArray(currYear) {
      this.holiday.year_applicable = currYear;
      if (currYear) {
        for (var y = currYear - 10; y <= currYear + 5; y++) {
          this.year_array.push({
            year: y,
          });
        }
      }
    },
    date_year_fetch(year) {
      this.min_year_date = year + "-" + "01" + "-" + "01";
      this.max_year_date = year + "-" + "12" + "-" + "31";
    },
    selectEmployeeDesignation() {
      if (this.selectall_employee_designation) {
        this.holiday.site_id = [];
      } else {
        // this.holiday.site_id = this.site.slice();
        this.holiday.site_id = [];
        this.site.map((site) => {
          this.holiday.site_id.push(site.id);
        });
      }
    },
    formatted_date_index(formatted_date, index) {
      if (formatted_date) {
        if (index >= 0) {
          this.holiday_list_array[index].holiday_date = formatted_date;
          let date = new Date(formatted_date);
          let dayName = date.toLocaleString("en-us", { weekday: "long" });
          this.holiday_list_array[index].dayname = dayName;
        }
      }
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
    addnewlist() {
      if (this.$refs.form.validate()) {
        this.holiday_list_array.push(this.holiday_list);
        this.holiday_list = {
          master_id: "",
          holiday_date: "",
          dayname: "",
          holiday_type: "",
        };
      }
    },
    addrowindex() {
      if (this.$refs.form.validate()) {
        this.holiday_list_array.push(this.holiday_list);
        this.holiday_list = {
          master_id: "",
          holiday_date: "",
          dayname: "",
          holiday_type: "",
        };
      }
    },
    minimizerowindex(index) {
      this.holiday_list_array.splice(index, 1);
    },
    checkholidayexist(id, ind) {
      for (var i = 0; i < this.holiday_list_array.length; i++) {
        if (this.holiday_list_array[i].master_id == id && i != ind) {
          this.holiday_list_array[ind].master_id = [];
          this.flashMessage.error({
            message: this.$t("already_added_this_holiday"),
            time: 4000,
            blockClass: "custom-block-class",
          });
        }
      }
    },
    saveholiday() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        this.holiday.userID = this.user_id;
        axios
          .post(process.env.VUE_APP_API_URL_ADMIN + "saveholiday", {
            holiday: this.holiday,
            holiday_list: this.holiday_list_array,
          })
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
              this.message = res.data.message;
              this.$router.push({
                name: "holiday",
              });
            } else if (res.data.status == "EXIST") {
              this.flashMessage.error({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.isDisabled = false;
              this.isBtnLoading = false;
            } else if (res.data.status == "NOYEAR") {
              this.flashMessage.error({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.isDisabled = false;
              this.isBtnLoading = false;
            } else if (res.data.status == "E") {
              this.isBtnLoading = false;
              (this.isDisabled = false),
                this.flashMessage.error({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class",
                });
            } else {
              this.isBtnLoading = false;
              this.flashMessage.error({
                message: this.array_data,
              });
            }
          })
          .catch((err) => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.isBtnLoading = false;
            this.isDisabled = false;
            console.log("this error" + err);
          });
      }
    },

    clear() {
      this.$refs.form.reset();
    },

    fetchsite(org_id) {
      this.site = [];
      if (this.user.hr_employee.emprole_name.includes("SuperUser")) {
        this.holiday.site_id = "";
      }
      this.axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getsiteholiday/" + org_id)
        .then((res) => {
          this.site = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetchOrg() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getallorgforholiday")
        .then((res) => {
          this.organisation = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    lookupMessage(lookup_data) {
      if (lookup_data.status == 'S') {
        this.flashMessage.success({
          message: lookup_data.message,
          time: 4000,
          blockClass: "custom-block-class",
        });
        this.fetchlookup();
      }
      else {
        this.flashMessage.error({
          message: lookup_data.message,
          time: 4000,
          blockClass: "custom-block-class",
        });
      }
    },
    fetchlookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "HOLIDAYS",
          },
        })
        .then((response) => {
          this.holidays_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "HOLIDAY_TYPE",
          },
        })
        .then((response) => {
          this.holiday_type = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    Readmore(message) {
      this.alertshow = true;
      this.alertdisable = false;
      this.errormessage = message;
    },
    Readless(message) {
      this.alertshow = false;
      this.alertdisable = true;
      this.message = message;
    },
    selectFile(file) {
      this.validate = true;
      this.uploaded_file = file;
    },

    uploadHolidaylist() {
      if (this.$refs.form.validate()) {
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
            process.env.VUE_APP_API_URL_ADMIN + "uploadholidaylist",
            formData
          )
          .then((res) => {
            this.loading = false;
            this.valid = true;
            if (res.data.status == "S") {
              this.flashMessage.success({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.successmessage = res.data.message;
              this.holiday_list_array = res.data.holidays;
              this.valid_error = false;
              this.valid_success = true;
              this.hideaftersuccess = false;
            }
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
            }
          })
          .catch((err) => {
            console.log(err);
            this.valid_success = false;
            this.valid_error = true;
            this.valid = true;
            this.colorcode = "error";
            this.loading = false;
            this.message = this.$t("contact_admin");
            this.$vuetify.goTo(0);
            console.log(err);
          });
      }
    },
  },
};
</script>
<style>
.iconflexaddremove {
  background-color: #1976d2 !important;
  height: 28px !important;
  width: 28px !important;
}

.fileinputrowclass {
  min-width: 250px !important;
  padding-top: 10px;
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
  height: 40px !important;
  margin-left: -10%;
}

.holiday_container {
  width: 50% !important;
}
</style>