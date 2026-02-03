<template>
  <div>
    <v-app-bar color="white">
      <div>
        <div
          class="card-header-title font-size-lg text-capitalize titlewrap"
        >{{ $t("create_amend_user") }}</div>
      </div>
    </v-app-bar>
    <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
    <!-- <div v-if="employee_details" class="profile_name mb-3">
      <v-card class="profile_card d-flex align-items-center p-2">
        <i class="pe-7s-user icon-gradient bg-tempting-azure profile_icon"></i>
        <div class="ml-2">
          <strong>{{ employee_details.firstname }}
            {{ employee_details.lastname }}</strong>
        
        </div>
      </v-card>
    </div>-->

    <v-stepper v-model="e1" vertical>
      <v-stepper-step class="align-items-baseline" :editable="editable" :complete="e1 > 1" step="1">
        <div class="row">
          <div class="col-md-2">
            <div class="all_heading_display">{{ $t("personal_details") }}</div>
          </div>

          <div class="col-md-10 row align_row">
            <div class="col-md-5 " v-if="e1 != 1 && profile_details != null">
              <div class="d-flex">
                <!-- <div>
                <i class="fa fa-user-o user_icon"></i>
                </div>-->
                <div class=" full_name_display">
                  <v-avatar size="40" class="text-center">
                    <v-img
                      v-if="profile_details.profile_pic != null"
                      :src="envImagePath + profile_details.profile_pic"
                      alt
                    ></v-img>
                    <img
                      v-else
                      width="38"
                      class="rounded-circle"
                      src="@/assets/images/default-user-profile-picture.png"
                      alt
                    />
                  </v-avatar>
                  <span class="pl-2">
                    {{ profile_details.salutation }} {{ profile_details.firstname }} {{ profile_details.lastname }} (
                    {{ profile_details.personal_email }} )
                  </span>
                </div>
              </div>
              <!-- <div class="ml-43"></div> -->
            </div>
            <div class="col-md-2" v-if="e1 != 1 && profile_details != null">
              <div class="d-flex">
                <span>
                  <i class="fa fa-list user_icon"></i>
                </span>
                <span class="gender_margin">{{ profile_details.gender }}</span>
              </div>
            </div>
            <div class="col-md-3" v-if="e1 != 1 && profile_details != null">
              <div class="d-flex">
                <span>
                  <i class="fa fa-birthday-cake user_icon"></i>
                </span>
                <span class="phone_margin mt-4">{{ profile_details.dob | formatDate }}</span>
              </div>
            </div>

            <div class="col-md-2" v-if="e1 != 1 && profile_details != null">
              <div class="d-flex">
                <span>
                  <i class="fa fa-phone user_icon"></i>
                </span>
                <span class="phone_margin m-auto">{{ profile_details.phone }}</span>
              </div>
            </div>

            <!-- <div class="col-md-2" v-if="e1 != 1 && profile_details != null">
              <div class="d-flex">
                <span>
                  <i class="fa fa-genderless user_icon"></i>
                </span>
                <span class="phone_margin">{{ profile_details.marital_status }}</span>
              </div>
            </div> -->
          </div>

          <!-- <div class="col-md-2" v-if="e1 != 1 && profile_details != null">
            <v-avatar size="50" class="text-center" style="margin-left: 82px">
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
            </v-avatar>
          </div>-->
        </div>
      </v-stepper-step>
      <v-stepper-content step="1">
        <HrEmployeeBasicDetails
          @basicDetails="basicDetails"
          :employee_details="employee_details"
          :slug="employee_details.slug"
        />
      </v-stepper-content>
      <v-stepper-step
        class="align-items-baseline"
        :editable="official_editable"
        :complete="e1 > 2"
        step="2"
      >
        <div class="row pt-5">
          <div class="col-md-2 all_heading_display">{{ $t("official_details") }}</div>
          <div
            class="col-md-2 maindivinitialdetials d-flex justify-content-start"
            v-if="e1 > 2 && profile_details != null"
          >
            <div>
              <span>
                <i class="fa fa-list user_icon" aria-hidden="true"></i>
              </span>
              <span v-if="employee_type_name">{{ employee_type_name }}</span>
              <span class="mt-15" v-else>{{ not_appllicable }}</span>
            </div>
          </div>
          <div class="col-md-3">
            <div class="ml-2" v-if="e1 > 2 && profile_details != null">
              <span>
                <i class="fa fa-list user_icon" aria-hidden="true"></i>
              </span>
              <span class="mt-15" v-if="designation_name">{{ designation_name }}</span>
              <span class="mt-15" v-else>{{ not_appllicable }}</span>
            </div>
          </div>
          <div class="col-md-2" v-if="e1 > 2 && profile_details != null">
            <span>
              <i class="fa fa-calendar user_icon" aria-hidden="true"></i>
            </span>
            <span
              class="mt-15"
              v-if="profile_details.Joining_date"
            >{{ profile_details.Joining_date | formatDate }}</span>
            <span class="mt-15" v-else>{{ not_appllicable }}</span>
          </div>

          <div class="col-md-2" v-if="e1 > 2 && profile_details != null">
            <span>
              <i class="fa fa-list user_icon" aria-hidden="true"></i>
            </span>
            <span v-if="profile_details.empno">{{ profile_details.empno }}</span>
            <span class="mt-15" v-else>{{ not_appllicable }}</span>
          </div>
          <div class="col-md-2"></div>
        </div>
        <div class="row margin_top_email" v-if="e1 > 2 && profile_details != null">
          <div class="col-md-2"></div>
          <div class="col-md-4 maindivinitialdetials">
            <span>
              <i class="fa fa-envelope-o user_icon" aria-hidden="true"></i>
            </span>
            <span
              class="mt-15"
              style="font-size: 13px;"
              v-if="profile_details.user_email"
            >{{ profile_details.user_email }}</span>
          </div>
        </div>
      </v-stepper-step>
      <v-stepper-content step="2">
        <HrEmployeeOfficialDetails
          :initial_details="initial_details"
          :profile_details="profile_details"
          :employee_details="employee_details"
          @officialDetails="officialDetails"
          @designationEmployeeType="designationEmployeeType"
        />
      </v-stepper-content>
      <v-stepper-step
        :editable="other_editable"
        :complete="e1 > 3"
        step="3"
      >{{ $t("other_details") }}</v-stepper-step>
      <v-stepper-content step="3">
        <HrEmployeePersonalDetails
          @personalDetails="personalDetails"
          :profile_details="profile_details"
          @callLookupValues="callLookupValues"
        />
      </v-stepper-content>
    </v-stepper>
  </div>
</template>
<script>
import ConfirmDialog from "../../Components/ConfirmDialog.vue";
import MediaSelect from "../../Components/Upload/MediaSelect.vue";
import DatePicker from "../../Components/DatePicker.vue";
import HrEmployeeBasicDetails from "./HrEmployeeBasicDetails.vue";
import HrEmployeePersonalDetails from "../HrEmployee/HrEmployeePersonalDetails.vue";
import HrEmployeeOfficialDetails from "../HrEmployee/HrEmployeeOfficialDetails.vue";
import VueElementLoading from "vue-element-loading";
export default {
  components: {
    ConfirmDialog,
    MediaSelect,
    DatePicker,
    HrEmployeeBasicDetails,
    HrEmployeePersonalDetails,
    HrEmployeeOfficialDetails,
    VueElementLoading
  },
  data: () => ({
    e1: 1,
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    profile_details: {},
    initial_details: {},
    loader: false,
    user: "",
    employee_details: "",
    lookupValues: "",
    level_data: "",
    organisation_name: "",
    employee_type: "",
    designation_name: "",
    editable: false,
    official_editable: false,
    other_editable: false,
    employee_type_name: "",
    organisation_array: []
  }),
  computed: {},
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.fetchOrganisation();
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "fetch_employee_by_slug?slug=" +
                this.$route.query.slug
            )
            .then(res => {
              this.loader = false;
              if (res.data.status == "S") {
                this.initial_details = JSON.parse(
                  JSON.stringify(res.data.employee_details)
                );

                this.message = res.data.message;
                this.employee_details = res.data.employee_details;
                this.profile_details = res.data.employee_details;

                this.editable = true;
                this.official_editable = true;
                this.other_editable = true;
              } else if (res.data.status == "E") {
                this.message = res.data.message;
              }
            })
            .catch(err => {
              this.isDisabled = false;
              console.log("this error" + err);
            });
        }
      }
    }
  },
  methods: {
    fetchOrganisation() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_all_organisation")
        .then(res => {
          this.organisation_array = res.data.organisation_details;
        })
        .catch(err => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          console.log("this error" + err);
        });
    },
    callLookupValues(CallLookup) {
      this.lookupValues = CallLookup;
    },
    enableBack(page) {
      if (page == 2) {
        this.e1 = 1;
      } else if (page == 3) {
        this.e1 = 2;
      }
    },
    basicDetails(basic_details) {
      this.profile_details = basic_details;
      if (this.user.hr_employee.emprole_name.includes("HR")) {
        this.profile_details.org_id = this.user.hr_employee.org_id;

        var working_days = this.organisation_array.find(
          x => x.id == this.user.hr_employee.org_id
        ).working_days;
        this.profile_details.working_days = JSON.parse(working_days);
      }
      this.editable = true;
      this.official_editable = true;
      this.e1 = 2;
    },
    personalDetails() {
      if (this.user.hr_employee.emprole_name.includes("HR")) {
        this.$router.push({
          name: "employeedetails"
        });
      } else {
        this.$router.push({
          name: "users"
        });
      }
    },
    officialDetails(official_details) {
      this.e1 = 3;

      this.profile_details = official_details;
      this.profile_details.user_email = official_details.official_email;
      this.editable = true;
      this.official_editable = true;
      this.other_editable = true;
    },
    designationEmployeeType(designation, employeetype) {
      this.designation_name = designation;
      this.employee_type_name = employeetype;
    }
  }
};
</script>
<style scoped>
.stepper {
  height: 100% !important;
}

/* .full_name_display {
  font-size: 16px;
  font-weight: 700;
} */
.profile_name {
  font-size: 18px !important;
}

.profile_card {
  width: fit-content;
}

.ml-43 {
  margin-left: 45px;
}

.profile_icon {
  font-size: 28px !important;
}

.maindivinitialdetials {
  margin-left: 4%;
  display: inline;
}

.headerinitialdetails {
  margin-left: 1%;
  font-weight: 600;
  font-size: 12px;
}

.bodyinitialdetails {
  font-weight: 500;
  font-size: 11px;
  margin-right: 2%;
}

.user_icon {
  font-size: 23px !important;
  color: #03a9f4;
  padding: 10px;
  border-radius: 20px;
}

.phone_margin {
  margin-top: 12px;
  font-size: 14px;
}
.gender_margin {
  margin-top: 15px;
  /* margin-left: 8px; */
  font-size: 14px;
}

.mt-15 {
  margin-top: 15px !important;
}

.list-height {
  line-height: 22px;
}

.all_heading_display {
  display: flex;
  padding-bottom: 31px;
  align-items: center;
}

/* .status_display{
      display: flex;
    justify-content: center;
    margin-left: -22px;
} */
.email_flex {
  display: flex;
  word-wrap: break-word;
}
.margin_top_email {
  margin-top: -30px !important;
}
.align_row{
  margin-top:-20px
}
</style>