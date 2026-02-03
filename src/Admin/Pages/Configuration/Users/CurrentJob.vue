<template>
  <div class="main-20 pl-3 pr-3">
    <VueElementLoading
      :active="loader"
      spinner="bar-fade-scale"
      color="var(--primary)"
    />
    <!-- <v-tabs color="#3f6ad8" left> -->
    <!-- <v-tab v-if="getdata"
        ><i class="fa fa-briefcase pl-2 mr-1" aria-hidden="true"></i><span class="tab-title"
          >{{ $t("work_information")
          }}</span
      ></v-tab> -->
    <!-- <v-tab v-if="getdata"
        ><i class="fa fa-vcard pl-2 mr-1" aria-hidden="true"></i><span class="tab-title"
          >{{ $t("personal_details")
          }}</span
      ></v-tab> -->

    <!-- <v-tab-item v-if="getdata"> -->
    <!-- -----------work info start----------------- -->
    <!-- <v-container fluid class="mt-3 px-5 mb-5">
          <div class="row">
            <div class="col-md-4 col-sm-4 col-lg-4" v-if="getdata">
              <div> {{$t("employee_id") }}</div>
              <div
                class="values"
                v-if="user_info.user.userdetails.auto_gen_emp_id"
              >
                {{ user_info.user.userdetails.auto_gen_emp_id }}
              </div>
              <div class="values" v-else>-</div>
            </div>
            <div class="col-md-4 col-sm-4 col-lg-4" v-if="getdata">
              <v-layout>
                <v-flex md6>
                  <div>{{ $t("employee_status") }}</div>
                  <div
                    class="values"
                    v-if="user_info.user.userdetails.status == '1'"
                  >
                    {{ $t("active") }}
                  </div>
                  <div class="values" v-else>{{ $t("inactive") }}</div>
                </v-flex>
                <v-flex md6> </v-flex>
              </v-layout>
            </div>
            <div class="col-md-4 col-sm-4 col-lg-4" v-if="getdata"></div>
          </div>

          <div class="row">
            <div class="col-md-4 col-sm-4 col-lg-4" v-if="getdata">
              <div>{{ $t("employee_type") }}</div>
              <div
                class="values"
                v-if="user_info.user.employee_status.longname"
              >
                {{ user_info.user.employee_status.longname }}
              </div>
              <div class="values" v-else>-</div>
            </div>
            <div class="col-md-4 col-sm-4 col-lg-4" v-if="getdata">
              <div>{{ $t("Joining_date") }}</div>
              <div class="values" v-if="user_info.user.Joining_date">
                {{ user_info.user.Joining_date | formatDate }}
              </div>
              <div class="values" v-else>-</div>
            </div>
            <div class="col-md-4 col-sm-4 col-lg-4" v-if="getdata">
              <div>{{ $t("level") }}</div>
              <div class="values" v-if="user_info.user.levelidname">
                {{ user_info.user.levelidname.level }}
              </div>
              <div class="values" v-else>&nbsp;-</div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4 col-sm-4 col-lg-4" v-if="getdata">
              <div>{{ $t("department") }}</div>
              <div class="values" v-if="user_info.user.department_id">
                {{ user_info.user.department }}
              </div>
              <div class="values" v-else>-</div>
            </div>
            <div class="col-md-4 col-sm-4 col-lg-4" v-if="getdata">
              <div>{{ $t("designation") }}</div>
              <div class="values" v-if="user_info.user.designation">
                {{ user_info.user.designation.designation }}
              </div>
              <div class="values" v-else>-</div>
            </div>
            <div class="col-md-4 col-sm-4 col-lg-4" v-if="getdata">
              <div>{{ $t("organisation") }}</div>
              <div class="values" v-if="user_info.user.user_org.shortname">
                {{ user_info.user.user_org.shortname }}
              </div>
              <div class="values" v-else>&nbsp;-</div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4 col-sm-4 col-lg-4" v-if="getdata">
              <div>{{ $t("site") }}</div>
              <div class="values" v-if="user_info.user.sitedetails.shortname">
                {{ user_info.user.sitedetails.shortname }}
              </div>
              <div class="values" v-else>-</div>
            </div>

            <div class="col-md-4 col-sm-4 col-lg-4" v-if="getdata">
              <div>{{ $t("official_email") }}</div>
              <div class="values" v-if="user_info.user.user_email">
                {{ user_info.user.user_email }}
              </div>
              <div class="values" v-else>-</div>
            </div>

            <div class="col-md-4 col-sm-4 col-lg-4" v-if="getdata">
              <div>{{ $t("role") }}</div>
              <div
                class="values employee_role_chips_margin ma-2"
                v-if="user_info.user.emprole_name"
              >
                <v-chip
                  v-for="(days, i) in user_info.user.emprole_name"
                  :key="i"
                  class="mr-1"
                  color="primary"
                  variant="outlined"
                  small
                >
                  {{ days }}
                </v-chip>

              </div>
              <div class="values" v-else>-</div>
            </div>
          </div>

          <div class="row mt-0 mb-5">
            <div class="col-md-12 col-sm-12 col-lg-12 pt-0" v-if="getdata">
              <div>{{ $t("working_days") }}</div>
              <div class="values" v-if="user_info.user.working_days">
                <v-chip
                  v-for="(days, i) in JSON.parse(user_info.user.working_days)"
                  :key="i"
                  class="ma-2 ml-0"
                  color="primary"
                  variant="outlined"
                  small
                >
                  {{ days }}
                </v-chip>

              </div>
              <div class="values" v-else>&nbsp;-</div>
            </div>
          </div>
        </v-container> -->
    <!-- -----------work info end----------------- -->
    <!-- </v-tab-item> -->
    <!-- <v-tab-item v-if="getdata"> -->
    <!-- -----------personal details start----------------- -->
    <v-container fluid class="mt-3 px-5 mb-5">
      <div class="row">
        <div class="col-md-4 col-sm-4 col-lg-4" v-if="getdata">
          <div>{{ $t("marital_status") }}</div>
          <div
            class="values"
            v-if="user_info.user.martialstatuslookupdetails.longname"
          >
            {{ user_info.user.martialstatuslookupdetails.longname }}
          </div>
          <div class="values" v-else>-</div>
        </div>
        <!-- <div class="col-md-4 col-sm-4 col-lg-4" v-if="getdata">
          <div>{{ $t("dob") }}</div>
          <div class="values" v-if="user_info.user.dob">
            {{ user_info.user.dob | formatDate }}
          </div>
          <div class="values" v-else>-</div>
        </div> -->

        <div class="col-md-4 col-sm-4 col-lg-4" v-if="getdata">
          <div>{{ $t("personal_email") }}</div>
          <div class="values" v-if="user_info.user.personal_email">
            {{ user_info.user.personal_email }}
          </div>
          <div class="values" v-else>-</div>
        </div>
         <div class="col-md-4 col-sm-4 col-lg-4" v-if="getdata">
          <div>{{ $t("nationality") }}</div>
          <div class="values" v-if="user_info.user.nationalitylookupdetails">
            {{ user_info.user.nationalitylookupdetails.longname }}
          </div>
          <div class="values" v-else>-</div>
        </div>
      </div>

      <div class="row">
       
        <div class="col-md-4 col-sm-4 col-lg-4" v-if="getdata">
          <div>{{ $t("blood_group") }}</div>
          <div class="values" v-if="user_info.user.bloodgrouplookupdetails">
            {{ user_info.user.bloodgrouplookupdetails.longname }}
          </div>
          <div class="values" v-else>-</div>
        </div>
        <div class="col-md-4 col-sm-4 col-lg-4" v-if="getdata">
          <div>{{ $t("weight") }}</div>
          <div class="values" v-if="user_info.user.weight">
            {{ user_info.user.weight }}
          </div>
          <div class="values" v-else>&nbsp;-</div>
        </div>
        <div class="col-md-4 col-sm-4 col-lg-4" v-if="getdata">
          <div>{{ $t("height") }}</div>
          <div class="values" v-if="user_info.user.height">
            {{ user_info.user.height }}
          </div>
          <div class="values" v-else>-</div>
        </div>
      </div>

      <div class="row">
        
         <div class="col-md-4 col-sm-4 col-lg-4" v-if="getdata">
          <div>{{ $t("social_id") }}</div>
          <div class="values" v-if="user_info.user.social_id">
            {{ user_info.user.social_id }}
          </div>
          <div class="values" v-else>&nbsp;-</div>
        </div>

        <div class="col-md-4 col-sm-4 col-lg-4" v-if="getdata">
          <div>{{ $t("religion") }}</div>
          <div class="values" v-if="user_info.user.religionlookupdetails">
            {{ user_info.user.religionlookupdetails.longname }}
          </div>
          <div class="values" v-else>-</div>
        </div>
          <div class="col-md-4 col-sm-4 col-lg-4" v-if="getdata">
          <div>{{ $t("caste") }}</div>
          <div class="values" v-if="user_info.user.caste">
            {{ user_info.user.caste }}
          </div>
          <div class="values" v-else>&nbsp;-</div>
        </div>
      </div>
      <div class="row">
       
      

              <div class="col-md-4 col-sm-4 col-lg-4" v-if="getdata">
          <div>{{ $t("identity_nark") }}</div>

          <div class="values" v-if="user_info.user.identity_mark">
            {{ user_info.user.identity_mark }}
          </div>
          <div class="values" v-else>-</div>
        </div>
        <div class="col-md-4 col-sm-4 col-lg-4" v-if="getdata">
          <div>{{ $t("disability") }}</div>
          <div class="values" v-if="user_info.user.identity_mark">
            {{ user_info.user.disability }}
          </div>
          <div class="values" v-else>&nbsp;-</div>
        </div>
      </div>

      <div class="row">
  
      </div>
    </v-container>
    <!-- -----------personal details end----------------- -->
    <!-- </v-tab-item>
    </v-tabs> -->
    <div>
      <!-- <v-row>
        <v-spacer></v-spacer>
        <v-btn class="hover_shine btn" 
                    @click="changeStatus(user_info.user.id)" small 
                    v-bind:class="[
                     user_info.user.userdetails.status == 1 ? 'success' : 'warning',
                    ]">
                    <span v-if="user_info.user.userdetails.status == 1" class="spanactivesize">{{ $t("active") }}</span>
                    <span v-else class="spanactivesize">{{ $t("inactive") }}</span>
                  </v-btn>
      </v-row>       -->
    </div>
    <ConfirmDialog
      :show="showStatusDialog"
      :cancel="cancelStatus"
      :confirm="confirmStatus"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('status_change')"
    />
  </div>
</template>
<script>
import VueElementLoading from "vue-element-loading";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import CurrentJob from "./CurrentJob.vue";

export default {
  components: {
    VueElementLoading,
    ConfirmDialog,
    VuePerfectScrollbar,
    CurrentJob,
  },

  props: ["user_id", "view", "status", "user_status"],
  data: () => ({
    settings: {
      maxScrollbarLength: 60,
    },
    user_info: [],
    getdata: false,
    isBtnLoading: false,
    valid: true,
    loader: true,
    status_id: null,
    showStatusDialog: false,
  }),
  mounted() {
    this.loader = true;
  },

  watch: {
    user_id: {
      immediate: true,
      handler() {
        if (this.user_id >= 1) {
          this.fetchemployeedetails();
        }
      },
    },
    user_status: {
      immediate: true,
      handler() {
        this.fetchemployeedetails();
      },
    },
  },
  methods: {
    sendCredential(email) {
      this.loader = true;
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "sendcredential", {
          email: email,
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.flashMessage.success({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.loader = false;
          } else {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.loader = false;
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log("this error" + err);
        });
    },

    fetchemployeedetails() {
      this.loader = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetchuserbyslug?slug=" +
            this.$route.query.slug
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.user_id = res.data.user.id;
            this.loading_data = true;
            this.user_info = res.data;
            this.getdata = true;
            this.loader = false;
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log("this error" + err);
        });
    },
    cancelStatus() {
      this.showStatusDialog = false;
    },
    confirmStatus() {
      this.statusUpdate();
      this.showStatusDialog = false;
    },
    changeStatus(id) {
      this.status_id = id;
      this.showStatusDialog = true;
    },
    statusUpdate() {
      this.loader = true;
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "updateuserstatus", {
          id: this.status_id,
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.flashMessage.success({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.loader = false;
            this.fetchemployeedetails();
            this.$emit(
              "updateUserStatus",
              this.user_info.user.userdetails.status
            );
          } else {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.loader = false;
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log("this error" + err);
        });
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
    allowedMonths: (val) => parseInt(val.split("-")[1], 10) % 2 === 0,
  },
};
</script>
<style scoped>
.userform {
  border: none;
}
.heading {
  font-weight: bold;
  font-size: 16px;
}
/* .values {
  font-size: 15px;
} */
.expansionpaneldummydiv /deep/ .v-expansion-panel-header {
  align-items: flex-start !important;
}

.expansionpaneldummydiv .v-expansion-panel {
  flex: 1 0 25% !important;
  margin: 10px 50px !important;
  max-width: 40%;
  position: relative;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}
.theme--light.v-sheet--outlined {
  border: none;
}
.expansion_panel /deep/ .v-expansion-panels {
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between !important;
  list-style-type: none;
  padding: 0;
  width: 100%;
  z-index: 1;
}
.expansionpaneldummydiv /deep/ .v-expansion-panel::before {
  box-shadow: none !important;
}
.values {
  font-weight: bold;
  font-size: 14px;
}
.scroll_items {
  max-height: 300px;
  overflow-y: scroll;
  overflow-x: hidden;
}
::-webkit-scrollbar {
  width: 8px;
}
/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: grey;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #b30000;
}
.employee_role_chips_margin {
  margin-left: -7px !important;
}
</style>
