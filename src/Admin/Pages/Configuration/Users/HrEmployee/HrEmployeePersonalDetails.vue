<template>
  <div>
    <v-form ref="form" v-model="personal_details_valid">
      <div>
        <h4 class="title-section-user_creation">
          {{ $t("physical_details") }}
        </h4>
      </div>
      <v-row class="mtb-10">
        <v-col cols="12" sm="4" md="2" class="createlookupflex">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-autocomplete v-bind:label="$t('blood_grp')" v-on="on" index="id" item-value="id" item-text="longname"
                v-model="personal_details.blood_group" :rules="fieldRules" :items="blood_type_array" outlined dense
                class="required_field"></v-autocomplete>
            </template>
            <span>{{ $t("blood_grp") }}</span>
          </v-tooltip>
          <CreateLookup lookup_parent_name="BLOOD_GROUP" @lookup_data="lookupMessage" :dropdownlabel="$t('blood_grp')"></CreateLookup>
        </v-col>
        <v-col cols="12" sm="4" md="2" class="mbtm-7">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-text-field v-on="on" outlined v-model="personal_details.weight" :rules="fieldRules"
                v-bind:label="$t('weight')" class="required_field" maxlength="3" @keypress.native="isNumber($event)" dense
                required></v-text-field>
            </template>
            <span>{{ $t("weight") }}</span>
          </v-tooltip>
        </v-col>
        <v-col cols="12" sm="4" md="2" class="mbtm-7">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-text-field v-on="on" outlined v-model="personal_details.height" :rules="fieldRules"
                v-bind:label="$t('height')" maxlength="3" class="required_field" @keypress.native="isNumber($event)" dense
                required></v-text-field>
            </template>
            <span>{{ $t("height") }}</span>
          </v-tooltip>
        </v-col>
        <v-col cols="12" sm="4" md="6" class="mbtm-7">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-text-field v-on="on" outlined v-model="personal_details.identity_mark"
                v-bind:label="$t('identification_mark')" dense required maxlength="200" counter="200"
                rows="1"></v-text-field>
            </template>
            <span>{{ $t("weight") }}</span>
          </v-tooltip>
        </v-col>
        <v-col cols="12" sm="4" md="6" class="mbtm-7">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-textarea v-on="on" outlined v-model="personal_details.disability" v-bind:label="$t('disability')"
                class="mt_30" dense maxlength="200" counter="200" rows="1" required></v-textarea>
            </template>
            <span>{{ $t("disability") }}</span>
          </v-tooltip>
        </v-col>
      </v-row>
      <div>
        <h4 class="title-section-user_creation">
          {{ $t("nationality_details") }}
        </h4>
      </div>
      <v-row class="mtb-10">
        <v-col cols="12" sm="4" md="3" class="createlookupflex">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-autocomplete v-bind:label="$t('nationality')" v-on="on" index="id" item-value="id" item-text="longname"
                v-model="personal_details.nationality_id" :rules="fieldRules" :items="nationality_array" outlined dense
                class="required_field"></v-autocomplete>
            </template>
            <span>{{ $t("nationality") }}</span>
          </v-tooltip>
          <CreateLookup lookup_parent_name="NATIONALITY" @lookup_data="lookupMessage"   :dropdownlabel="$t('nationality')"></CreateLookup>
        </v-col>
        <v-col cols="12" sm="4" md="3" class="createlookupflex">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-autocomplete v-bind:label="$t('religion')" v-on="on" index="id" item-value="id" item-text="longname"
                v-model="personal_details.religion_id" :rules="fieldRules" :items="religion_array" outlined dense
                class="required_field"></v-autocomplete>
            </template>
            <span>{{ $t("religion") }}</span>
          </v-tooltip>
          <CreateLookup lookup_parent_name="RELIGION" @lookup_data="lookupMessage" :dropdownlabel="$t('religion')"></CreateLookup>
        </v-col>
        <v-col cols="12" sm="4" md="3" class="mbtm-7">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-text-field v-bind:label="$t('caste')" v-on="on" v-model="personal_details.caste" outlined
                dense></v-text-field>
            </template>
            <span>{{ $t("caste") }}</span>
          </v-tooltip>
        </v-col>
        <v-col cols="12" sm="4" md="3">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-text-field v-on="on" outlined v-model="personal_details.social_id" :rules="fieldRules"
                v-bind:label="$t('social_id')" class="required_field" maxlength="20" dense
                @keypress.native="isNumber($event)" required></v-text-field>
            </template>
            <span>{{ $t("social_id") }}</span>
          </v-tooltip>
        </v-col>
      </v-row>
      <div>
        <h4 class="title-section-user_creation">
          {{ $t("recent_education_details") }}
        </h4>
      </div>
      <v-row class="mtb-10">
        <v-col cols="12" sm="4" md="4" class="createlookupflex">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-autocomplete v-on="on" v-model="personal_details.type_id" :rules="fieldRules" dense
                v-bind:label="$t('course')" outlined class="required_field" item-value="id" item-text="longname"
                :error="course_exist_focus" :error-messages="course_exist_focus_message" :items="courselist"
                :disabled="course_disable_when_edit"></v-autocomplete>
            </template>
            <span>{{ $t("course") }}</span>
          </v-tooltip>
          <CreateLookup lookup_parent_name="EDUCATION_TYPE" @lookup_data="lookupMessage" :dropdownlabel="$t('course')"></CreateLookup>
        </v-col>
        <v-col cols="12" sm="4" md="4" class="mbtm-7">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-menu v-on="on" ref="menu" v-model="menu" :close-on-content-click="false"
                :return-value.sync="personal_details.year_of_passing" transition="scale-transition" offset-y
                max-width="290px" min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="personal_details.year_of_passing" v-bind:label="$t('year_of_passing')"
                    append-icon="mdi-calendar" outlined dense readonly v-bind="attrs" v-on="on"
                    :disabled="course_disable_when_edit"></v-text-field>
                </template>
                <v-date-picker v-model="personal_details.year_of_passing" type="month"
                  :max="new Date().toISOString().substr(0, 10)" no-title @click:month="
                    saveformattedmonth(personal_details.year_of_passing)
                    " scrollable>
                </v-date-picker>
              </v-menu>
            </template>
            <span>{{ $t("year_of_passing") }}</span>
          </v-tooltip>
        </v-col>
        <v-col cols="12" sm="4" md="4" class="createlookupflex">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-autocomplete v-on="on" item-value="shortname" item-text="longname" :items="classobtain"
                v-model="personal_details.class_obtained" :rules="fieldRules" dense v-bind:label="$t('class_obtained')"
                outlined :disabled="course_disable_when_edit" class="required_field"></v-autocomplete>
            </template>
            <span>{{ $t("caste") }}</span>
          </v-tooltip>
          <CreateLookup lookup_parent_name="CLASS_OBTAINED" @lookup_data="lookupMessage" :dropdownlabel="$t('caste')"></CreateLookup>
        </v-col>
      </v-row>
    </v-form>
    <div class="text-right btn_container">
      <v-btn small @click="$router.go(-1)" class="secondary">
        {{ $t("cancel") }}
      </v-btn>
      <v-btn color="primary" class="ml-2" :disabled="isDisabled" @click="SubmitEmployeeOtherDetails()" small>
        {{ $t("save") }}
        <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
      </v-btn>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import CreateLookup from "../../../CreateLookup.vue";
export default {
  components: {
    CreateLookup,
  },
  props: ["profile_details"],
  data: () => ({
    isDisabled: false,
    isBtnLoading: false,
    personal_details_valid: true,
    blood_type_array: [],
    nationality_array: [],
    religion_array: [],
    caste_array: [],
    marital_status_array: [],
    courselist: [],
    course_exist_focus: false,
    course_exist_focus_message: "",
    course_disable_when_edit: false,
    menu: false,
    classobtain: [],
    // date() {
    //   this.dateFormatted = this.formatDate(this.show_date);
    // },
    personal_details: {
      blood_group: null,
      height: null,
      weight: null,
      identity_mark: "",
      disability: "",
      nationality_id: null,
      caste: "",
      social_id: null,
      religion_id: null,
      type_id: null,
      year_of_passing: null,
      class_obtained: "",
    },
  }),
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },
  mounted() {
    this.fetchLookup();
    this.previousDate();
    // this.getMaxDateDob(new Date());
  },
  watch: {
    profile_details: {
      immediate: true,
      handler() {
        if (this.profile_details) {
          this.personal_details = this.profile_details;
          if (this.profile_details.min_education) {
            this.personal_details.type_id =
              this.profile_details.min_education.type_id;
            this.personal_details.year_of_passing =
              this.profile_details.min_education.year_of_passing;
            this.personal_details.class_obtained =
              this.profile_details.min_education.class_obtained;
          }

          if (
            this.profile_details.min_education &&
            this.profile_details.min_education.type_id != null
          ) {
            this.course_disable_when_edit = true;
          }
        }
      },
    },

    // menu(val) {
    //   val && this.$nextTick(() => (this.$refs.picker.activePicker = "YEAR"));
    // },
  },
  methods: {
    lookupMessage(lookup_data) {
      if (lookup_data.status == 'S') {
        this.flashMessage.success({
          message: lookup_data.message,
          time: 4000,
          blockClass: "custom-block-class",
        });
        this.fetchLookup();
      }
      else {
        this.flashMessage.error({
          message: lookup_data.message,
          time: 4000,
          blockClass: "custom-block-class",
        });
      }
    },
    formatDate(date) {
      if (!date) {
        return null;
      }
      const [year, month] = date.split("-");
      var month_name = moment(month).format("MMM");
      return `${month_name}-${year}`;
    },

    saveformattedmonth(date) {
      if (date == null) {
        return null;
      } else {
        let monthdate = new Date(date);
        let month = monthdate.toLocaleString("default", { month: "short" });
        let year = monthdate.getFullYear();

        this.$refs.menu.save(month + "-" + year);
      }
    },
    //     storeAllEducationDetails(type_id,storing_values){
    //       if(storing_values=="type_id_details"){

    //         this.profile_details.min_education.type_id=type_id;
    //       }else if(storing_values=="class_obtained"){
    // this.profile_details.min_education.class_obtained=type_id;
    //       }
    //     },
    SubmitEmployeeOtherDetails() {
      if (this.$refs.form.validate()) {
        this.isBtnLoading = true;
        this.isDisabled = true;

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
              this.$router.go(-1)
              this.flashMessage.success({
                message: this.array_data,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.message = res.data.message;

              this.$emit("personalDetails");
            } else if (res.data.status == "E") {
              this.flashMessage.error({
                message: this.array_data,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.isBtnLoading = false;
              this.isDisabled = false;
            } else {
              this.isBtnLoading = false;
              this.isDisabled = false;
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
      }
      // else {
      //   this.flashMessage.error({
      //     message: this.$t("enter_required_fields"),
      //     time: 4000,
      //     blockClass: "custom-block-class",
      //   });
      // }
    },
    previousDate(date = new Date()) {
      const previous = new Date(date.getTime());
      previous.setDate(date.getDate() - 6575);
      this.previous_date = previous;
    },
    formattedDate(formatted_date) {
      this.emp_age = formatted_date;
      this.personal_details.dob = formatted_date;
    },

    fetchLookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "BLOOD_GROUP",
          },
        })
        .then((response) => {
          this.blood_type_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "NATIONALITY",
          },
        })
        .then((response) => {
          this.nationality_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "RELIGION",
          },
        })
        .then((response) => {
          this.religion_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "EDUCATION_TYPE",
          },
        })
        .then((response) => {
          this.courselist = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "CLASS_OBTAINED",
          },
        })
        .then((response) => {
          this.classobtain = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    isNumber(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
        evt.preventDefault();
      }
      return true;
    },
  },
};
</script>
<style scoped>
.mt_30 {
  margin-top: -30px;
}

.btn_container {
  top: 85%;
  left: 78vw;
}

.cancel_btn {
  float: right;
}

.age_style {
  margin-top: -11px;
  font-size: 16px;
  font-weight: bold;
  margin-left: -3px;
}
</style>