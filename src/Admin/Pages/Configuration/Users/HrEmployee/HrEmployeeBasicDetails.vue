<template>
  <div>
    <v-form ref="form" v-model="basic_valid">
      <div class="row form-parent stepper-height">
        <div class="col-md-10 mt-5 mbtm-7">
          <v-layout class="mtb-10">
            <v-flex md3 sm3 lg3 px-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    v-bind:label="$t('salutation')"
                    v-on="on"
                    index="id"
                    item-value="shortname"
                    item-text="longname"
                    v-model="profile_details.salutation"
                    :rules="fieldRules"
                    :items="salutation_array"
                    outlined
                    dense
                    class="required_field"
                  ></v-autocomplete>
                </template>
                <span>{{ $t("salutation") }}</span>
              </v-tooltip>
            </v-flex>

            <v-flex md5 sm5 lg5 px-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    outlined
                    v-model="profile_details.firstname"
                    :rules="fieldRules"
                    v-bind:label="$t('firstname')"
                    class="required_field"
                    maxlength="100"
                    dense
                    required
                  ></v-text-field>
                </template>
                <span>{{ $t("name") }}</span>
              </v-tooltip>
            </v-flex>

            <v-flex lg4 md4 sm4 px-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    outlined
                    v-model="profile_details.lastname"
                    :rules="fieldRules"
                    v-bind:label="$t('lastname')"
                    class="required_field"
                    required
                    dense
                  ></v-text-field>
                </template>
                <span>{{ $t("lastname") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>

          <v-layout class="mt-8">
            <v-flex md3 sm3 lg3 px-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    v-bind:label="$t('gender')"
                    v-on="on"
                    index="id"
                    item-value="longname"
                    item-text="longname"
                    v-model="profile_details.gender"
                    :rules="fieldRules"
                    :items="gender_array"
                    outlined
                    dense
                    class="required_field mt_30"
                  ></v-autocomplete>
                </template>
                <span>{{ $t("gender") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex px-2 md5 sm5 lg5 style="position: relative">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <DatePicker
                    :label="$t('dob')"
                    v-on="on"
                    :stored_date="profile_details.dob"
                    :max="
                      previous_date
                        ? previous_date.toISOString().substr(0, 10)
                        : ''
                    "
                    @formatted_date="formattedDateDob"
                    class="mr-1 mt_30"
                    :rules="fieldRules"
                    :class_required="'RequiredField'"
                  />
                </template>
                <span>{{ $t("dob") }}</span>
              </v-tooltip>
              <h5 class="agedisplaybelowdob">
                <!-- <span v-if="emp_age">{{ emp_age | calculateAge }} {{ $t("years") }}</span> -->
                <span v-if="emp_age">
                  {{ yearDiff }}
                  <span>{{ $t("years") }} </span>
                  , {{ monthDiff }}
                  <span v-if="monthDiff > 1">{{ $t("month") }}</span>
                  <span v-else>{{ $t("month") }}</span>
                </span>
                <span class="body_emp_seperation_process" v-else></span>
              </h5>
            </v-flex>
            <v-flex md4 sm4 lg4 px-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    v-bind:label="$t('marital_status')"
                    v-on="on"
                    index="id"
                    item-value="id"
                    item-text="longname"
                    v-model="profile_details.maritalstatus_id"
                    :rules="fieldRules"
                    :items="marital_status_array"
                    outlined
                    dense
                    class="required_field mt_30"
                  ></v-autocomplete>
                </template>
                <span>{{ $t("marital_status") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
          <v-layout class="mt-8">
            <v-flex px-2 md8 lg8 sm8>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="profile_details.personal_email"
                    :rules="emailRules"
                    class="required_field mt_30"
                    v-bind:label="$t('personal_email')"
                    required
                    outlined
                    dense
                  ></v-text-field>
                </template>
                <span>{{ $t("personal_email") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex md4 lg4 px-2 sm4>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-bind:label="$t('phone_number')"
                    :rules="[...fieldRules, ...phoneRules]"
                    outlined
                    class="required_field mt_30"
                    maxlength="12"
                    @keypress.native="isNumber($event)"
                    v-model="profile_details.phone"
                    required
                    dense
                  ></v-text-field>
                </template>
                <span>{{ $t("phone_number") }}</span>
              </v-tooltip>
            </v-flex>
            <!-- <span class="age_style" v-if="emp_age">
              {{ $t("age") }} : {{ emp_age | calculateAge }} {{ $t("years") }}
            </span> -->
          </v-layout>
        </div>

        <div class="col-md-2 text-center align-self-center pb-8 pr-8">
          <center>
            <v-avatar size="100" class="text-center mtb-20">
              <v-img
                v-if="profile_details.profile_pic != null"
                :src="envImagePath + profile_details.profile_pic"
                alt
              ></v-img>
              <img
                v-else
                width="42"
                class="rounded-circle"
                src="@/assets/images/default-user-profile-picture.png"
                alt
              />
              <div class="camera-icon">
                <v-tooltip v-model="show" top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon @click="upload_Image" color="grey lighten-1">
                        mdi-camera
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t("upload_profile_pic") }}</span>
                </v-tooltip>
              </div>
            </v-avatar>

            <v-layout style="display: none">
              <v-flex xs12>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <span v-on="on">
                      <MediaSelect
                        :label="'Image'"
                        folder="userprofiles"
                        :image="profile_details.profile_pic"
                        :resizeheight="100"
                        :resizewidth="100"
                        @updateImage="updateImage"
                        :upload_profile="openMedia"
                      >
                      </MediaSelect>
                    </span>
                  </template>
                  <span>{{ $t("file_input") }}</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </center>
        </div>
      </div>
    </v-form>
    <div class="text-center">
      <div class="text-right btn_container">
        <v-btn small @click="$router.go(-1)" class="secondary">
          {{ $t("cancel") }}
        </v-btn>
        <v-btn
          color="primary"
          class="ml-2"
          :disabled="saveDisabled"
          @click="validatePersonalDetails('samepage')"
          small
        >
          {{ $t("save") }}
          <b-spinner
            :disabled="saveBtnLoading"
            small
            v-if="saveBtnLoading"
          ></b-spinner>
        </v-btn>
        <v-btn
          color="primary"
          class="ml-2"
          :disabled="isDisabled"
          @click="validatePersonalDetails('nextpage')"
          small
        >
          {{ $t("save_next") }}
          <b-spinner
            :disabled="isBtnLoading"
            small
            v-if="isBtnLoading"
          ></b-spinner>
        </v-btn>
      </div>
    </div>
  </div>
</template>
<script>
import ConfirmDialog from "../../Components/ConfirmDialog.vue";
import MediaSelect from "../../Components/Upload/MediaSelect.vue";
import DatePicker from "../../Components/DatePicker.vue";
import moment from "moment";
export default {
  props: ["employee_details"],
  components: {
    ConfirmDialog,
    MediaSelect,
    DatePicker,
    moment,
  },
  data: () => ({
    basic_valid: true,
    hrempagediff: "",
    show: false,
    openMedia: false,
    isDisabled: false,
    saveBtnLoading: false,
    saveDisabled: false,
    salutation_array: [],
    gender_array: [],
    marital_status_array: [],
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    isBtnLoading: false,
    emp_age: "",
    user: "",
    todaysdate: new Date().toISOString().substr(0, 10),
    yearDiff: "",
    monthDiff: "",
    profile_details: {
      id: 0,
      salutation: "",
      firstname: "",
      middlename: "",
      lastname: "",
      gender: "",
      personal_email: "",
      profile_pic: null,
      dob: "",
      maritalstatus_id: "",
    },
    previous_date: "",
  }),
  watch: {
    employee_details: {
      immediate: true,
      handler() {
        if (this.employee_details) {
          this.profile_details = this.employee_details;
        }
      },
    },
  },
  computed: {
    emailRules() {
      return [
        (v) => !!v || this.$t("email_required"),
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          this.$t("email_valid"),
      ];
    },
    phoneRules() {
      return [(v) => !v || v.length >= 10 || this.$t("valid_number_required")];
    },
    numberRules() {
      return [(v) => (v >= 0 && v <= 999999999999) || this.$t("entered_value")];
    },

    postcodeRules() {
      return [(v) => (v >= 0 && v <= 999999) || this.$t("postcode_valid")];
    },

    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.fetchlookup();
    this.previousDate();
    // this.getagediff();
  },

  methods: {
    // getagediff() {

    //   var today = moment().format('YYYY-MM-DD');
    //   this.hrempagediff = today;

    // },
    validatePersonalDetails(page) {
      if (this.$refs.form.validate()) {
        if (page == "samepage") {
          this.saveBtnLoading = true;
          this.saveDisabled = true;
        } else {
          this.isBtnLoading = true;
          this.isDisabled = true;
        }
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "check_email_exist",
            this.profile_details
          )
          .then((res) => {
            // this.btnloading = false;
            if (Array.isArray(res.data.message)) {
              this.array_data = res.data.message.toString();
            } else {
              this.array_data = res.data.message;
            }
            if (res.data.status == "S") {
              this.SubmitEmployeeProfile(page);
            } else if (res.data.status == "E") {
              this.flashMessage.error({
                message: this.array_data,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.isBtnLoading = false;
              this.isDisabled = false;
              this.saveBtnLoading = false;
              this.saveDisabled = false;

              this.isDisabled = false;
            } else {
              this.flashMessage.error({
                message: this.array_data,
              });
              this.isBtnLoading = false;
              this.isDisabled = false;
              this.saveBtnLoading = false;
              this.saveDisabled = false;
            }
          });
        // this.$emit("personalDetails", this.personal_details);
        // this.$emit("callLookupValues", "CallLookup");
      }
      // else {
      //   this.flashMessage.error({
      //     message: this.$t("enter_required_fields"),
      //     time: 4000,
      //     blockClass: "custom-block-class",
      //   });
      // }
    },
    isNumber(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      }
      return true;
    },
    SubmitEmployeeProfile(page) {
      if (page == "samepage") {
        this.saveBtnLoading = true;
        this.saveDisabled = true;
        this.isDisabled = true;
      } else {
        this.isBtnLoading = true;
        this.isDisabled = true;
        this.saveDisabled = true;
      }

      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "save_employee_details",
          this.profile_details
        )
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.isBtnLoading = false;
            this.isDisabled = false;
            this.saveBtnLoading = false;
            this.saveDisabled = false;
            this.profile_details = res.data.employee_data;
            if (page == "samepage") {
              this.flashMessage.success({
                message: this.array_data,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.message = res.data.message;
            } else {
              this.$emit("basicDetails", this.profile_details);
            }
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.isBtnLoading = false;
            this.isDisabled = false;
            this.saveBtnLoading = false;
            this.saveDisabled = false;
          } else {
            this.isBtnLoading = false;
            this.isDisabled = false;
            this.saveBtnLoading = false;
            this.saveDisabled = false;
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
          console.log(err);
        });
    },
    previousDate(date = new Date()) {
      const previous = new Date(date.getTime());
      previous.setDate(date.getDate() - 6575);
      this.previous_date = previous;
    },
    formattedDateDob(formatted_date) {
      this.emp_age = formatted_date;
      this.profile_details.dob = formatted_date;
      const date1 = new Date(this.todaysdate);
      const date2 = new Date(formatted_date);
      this.differenceInMonths(date1, date2);
    },

    differenceInMonths(date1, date2) {
      const month = date1.getMonth() - date2.getMonth();
      const year = date1.getYear() - date2.getYear();
      const Month_Diff = month + year * 12;
      this.yearDiff = parseInt(Month_Diff / 12);
      this.monthDiff = Month_Diff - this.yearDiff * 12;
    },
    emitProfileDetails() {
      // this.organisation_name = this.organisation_array.find(
      //   (x) => x.id === this.profile_details.org_id
      // ).shortname;
      // this.designation_name = this.designation_array.find(
      //   (x) => x.id === this.profile_details.designation_id
      // ).longname;
      // this.employee_type_name_emit = this.employee_type_array.find(
      //   (x) => x.id === this.profile_details.emp_type
      // ).longname;
    },

    formattedDate(formatted_date) {
      this.profile_details.Joining_date = formatted_date;
    },

    updateImage(imagedata) {
      this.profile_details.profile_pic = imagedata;
    },
    upload_Image() {
      if (this.openMedia == false) {
        this.openMedia = true;
      } else {
        this.openMedia = false;
      }
    },
    fetchlookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "SALUTATION",
          },
        })
        .then((response) => {
          this.salutation_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "LEAVE_MARITAL_STATUS",
          },
        })
        .then((response) => {
          this.marital_status_array = response.data.lookup_details;
          this.marital_status_array = this.marital_status_array.filter(
            (ele) => {
              return ele.shortname !== "All";
            }
          );
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "GENDER_LEAVE",
          },
        })
        .then((response) => {
          this.gender_array = response.data.lookup_details;
          this.gender_array = this.gender_array.filter((ele) => {
            return ele.shortname !== "All";
          });
        })
        .catch((err) => {
          console.log(err);
        });
      if (this.user.hr_employee.emprole_name.includes("HR")) {
        this.profile_details.org_id = this.user.hr_employee.org_id;
        this.profile_details.site_id = this.user.hr_employee.site_id;
      }
      // axios
      //   .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
      //     params: {
      //       lookup_type: "GENDER",
      //     },
      //   })
      //   .then((response) => {
      //     this.gender_array = response.data.lookup_details;
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
      // axios
      //   .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
      //     params: {
      //       lookup_type: "EMPLOYEE_STATUS",
      //     },
      //   })
      //   .then((response) => {
      //     this.employee_status_array = response.data.lookup_details;
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
      // axios
      //   .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
      //     params: {
      //       lookup_type: "DESIGNATION",
      //     },
      //   })
      //   .then((response) => {
      //     this.designation_array = response.data.lookup_details;
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
      // axios
      //   .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
      //     params: {
      //       lookup_type: "DEPARTMENT",
      //     },
      //   })
      //   .then((response) => {
      //     this.department_array = response.data.lookup_details;
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    },
  },
};
</script>
<style scoped>
.camera-icon {
  background: #00000070;
  position: absolute;
  left: 1px;
  width: 99px;
  height: 43px;
  top: 67px;
}

.form-parent > .col {
  padding: 7px 20px 0px 20px;
}

.mt_30 {
  margin-top: -30px;
}

.btn_container {
  top: 85%;
  left: 82vw;
}

.agedisplaybelowdob {
  position: absolute;
  bottom: 30px;
  font-size: 11px;
  font-weight: 500;
  right: 64px;
}
</style>
