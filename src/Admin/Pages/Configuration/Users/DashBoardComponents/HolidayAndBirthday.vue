<template>
  <v-layout wrap>
    <v-flex
      md4
      sm12
      xl4
      lg4
      class=""
      v-bind:class="[showAnnoncement ? 'pr-0' : 'pr-0']"
    >
      <div class="row">
        <div class="col-md-12">
          <div class="main-card mb-3 card">
            <div class="card-header">
              {{ $t("upcoming_holidays") }}
            </div>
            <div
              class="holidaytimileneheight"
              v-if="upcoming_holidays.length >= 1"
            >
              <VuePerfectScrollbar class="scrollbar-container" v-once>
                <v-timeline align-top dense>
                  <v-timeline-item
                    v-for="(holiday, i) in upcoming_holidays"
                    :key="i"
                    :color="holiday.color"
                    small
                  >
                    <v-row class="">
                      <v-col cols="3" class="px-0">
                        <strong>{{
                          holiday.from_date | formatdateMonthyear
                        }}</strong>
                      </v-col>
                      <v-col cols="8" class="px-0 pl-3">
                        <div
                          :class="`badge badge-${holiday.color}`"
                          class="text-item"
                        >
                          <span
                            class="badgeholidayname"
                            v-if="holiday.fetch_holidaytype.shortname"
                          >
                            {{ holiday.fetch_holidaytype.shortname }}</span
                          >
                        </div>
                        <div class="dayname_timeline">
                          {{ holiday.day }}
                        </div>
                      </v-col>
                    </v-row>
                  </v-timeline-item>
                </v-timeline>
              </VuePerfectScrollbar>
            </div>
            <div class="approvalsscrollbarrowminheightforholidayvelse" v-else>
              <v-sheet class="nodatasvelsedashboard"
                ><span>{{ $t("no_holidays_this_year") }}</span></v-sheet
              >
            </div>
          </div>
        </div>
      </div>
    </v-flex>
    <v-flex md4 sm12 xl4 lg4 class="px-2" v-if="!showAnnoncement">
      <div class="row">
        <div class="col-md-12">
          <div class="main-card mb-3 card" id="birthdayanimationdiv">
            <div class="card-header" v-if="!closebirthdaytitle">
              {{ $t("upcoming_birthday") }}
            </div>
            <div
              class="currentbirthdaymonthheight"
              v-if="emp_current_month_bithday.length >= 1"
            >
              <VuePerfectScrollbar class="scrollbar-container" v-once>
                <table
                  class="align-middle mb-0 table table-borderless table-striped table-hover"
                >
                  <tbody>
                    <tr
                      v-for="(birthday, i) in emp_current_month_bithday"
                      :key="i"
                    >
                      <div class="col-md-12">
                        <div class="widget-content p-0">
                          <div class="widget-content-wrapper">
                            <div class="widget-content-left ml-1">
                              <img
                                width="55"
                                class="birthdayimage rounded-circle"
                                v-if="birthday.profile_pic"
                                :src="envImagePath + birthday.profile_pic"
                                alt
                              />
                              <img
                                v-else
                                width="55"
                                class="rounded-circle"
                                src="@/assets/images/default-user-profile-picture.png"
                              />
                            </div>
                            <div class="widget-content-left pl-4">
                              <div
                                class="widget-heading currentbirthdaynameheading"
                              >
                                {{ birthday.full_name }}
                              </div>
                              <!-- <div class="widget-subheading currentbirthdaynamesubheading">
                                {{ birthday.user_email }}
                              </div> -->
                            </div>
                            <v-spacer></v-spacer>
                            <div class="widget-content-left pl-6">
                              <img
                                width="30"
                                class="rounded-circle"
                                style="transform: rotate(-45deg)"
                                src="../../../../../assets/images/balloons-png-10884.png"
                                alt
                              />
                              <!-- src="https://static.vecteezy.com/system/resources/thumbnails/006/748/751/small/realistic-3d-gift-box-illustration-eps10-free-vector.jpg" -->
                            </div>
                            <div class="widget-content-left pl-2 pr-4">
                              <div
                                class="widget-heading"
                                style="font-size: 12px"
                              >
                                {{ birthday.dob | formatBirthDate }}
                              </div>
                              <div class="widget-subheading">
                                {{ birthday.dob | formatBirthDay }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </tr>
                  </tbody>
                </table>
              </VuePerfectScrollbar>
            </div>
            <div class="approvalsscrollbarrowminheightforholidayvelse" v-else>
              <v-sheet class="nodatasvelsedashboard"
                ><span>{{ $t("no_birthday_this_month") }}</span></v-sheet
              >
            </div>
          </div>
        </div>
      </div>
    </v-flex>
    <v-flex md4 sm12 xl4 lg4 class="" v-if="!showAnnoncement">
      <div class="row">
        <div class="col-md-12">
          <div class="main-card mb-3 card">
            <div class="card-header">
              {{ $t("announcement") }}
              <v-spacer></v-spacer>
              <v-icon
                medium
                class="mt-2 mb-3 dialogcloseinuserdetails"
                @click="openAnnouncement"
              >
                mdi-arrow-expand-all
              </v-icon>
            </div>
            <div
              class="currentbirthdaymonthheight"
              v-if="announcement_array.length >= 1"
            >
              <VuePerfectScrollbar class="scrollbar-container" v-once>
                <div
                  class="mb-3 card text-white bg-success announcementmainclass"
                  v-for="(announcement, i) in announcement_array"
                  :key="i"
                >
                  <div class="card-header announcementheader">
                    <span class="announcementheaderspan">{{
                      announcement.title
                    }}</span>
                    <v-spacer></v-spacer>
                    <v-tooltip bottom v-if="announcement.document_upload">
                      <template v-slot:activator="{ on }">
                        <span>
                          <a
                            :href="document_url + announcement.document_upload"
                            download
                          >
                            <v-icon color="blue" v-on="on" medium
                              >mdi-download</v-icon
                            ></a
                          ></span
                        >
                      </template>
                      <span>{{ $t("download_attachment") }}</span>
                    </v-tooltip>
                  </div>
                  <div class="card-body announcementbody">
                    <span
                      class="announcementbodyspan"
                      v-html="announcement.content"
                    ></span>
                    <div class="text-end">
                      <router-link
                        v-if="announcement.content.length > 40"
                        :to="{
                          name: 'announcement_view',
                          query: {
                            slug: announcement.slug,
                            id: announcement.id,
                          },
                        }"
                      >
                        <!-- @click="Readmore(announcement.slug)" -->
                        {{ $t("more") }}
                      </router-link>
                    </div>
                  </div>
                </div>
              </VuePerfectScrollbar>
            </div>
            <div class="approvalsscrollbarrowminheightforholidayvelse" v-else>
              <v-sheet class="nodatasvelsedashboard"
                ><span>{{ $t("no_annoucement_today") }}</span></v-sheet
              >
            </div>
          </div>
        </div>
      </div>
    </v-flex>
    <v-flex md8 sm12 xl8 lg8 class="pl-2" v-if="showAnnoncement">
      <div class="row">
        <div class="col-md-12">
          <div class="maindivexpandannouncemet main-card mb-3 card">
            <div class="card-header">
              {{ $t("announcement") }}
              <v-spacer></v-spacer>
              <v-icon
                medium
                class="mt-2 mb-3 dialogcloseinuserdetails"
                @click="closeAnnouncement"
              >
                mdi-close
              </v-icon>
            </div>
            <div
              class="currentbirthdaymonthheight"
              v-if="announcement_array.length >= 1"
            >
              <VuePerfectScrollbar class="scrollbar-container" v-once>
                <div
                  class="mb-3 card text-white"
                  v-for="(announcement, i) in announcement_array"
                  :key="i"
                >
                  <div class="card-header announcementheaderexpanded">
                    <span style="text-align: justify">{{
                      announcement.title
                    }}</span>
                    <v-spacer></v-spacer>
                    <v-tooltip bottom v-if="announcement.document_upload">
                      <template v-slot:activator="{ on }">
                        <span>
                          <a
                            :href="document_url + announcement.document_upload"
                            download
                          >
                            <v-icon v-on="on"  color="blue" medium>mdi-download</v-icon></a
                          ></span
                        >
                      </template>
                      <span>{{ $t("download_attachment") }}</span>
                    </v-tooltip>
                  </div>
                  <div class="card-body announcementbody">
                    <span v-html="announcement.content"></span>
                  </div>
                </div>
              </VuePerfectScrollbar>
            </div>
            <div class="approvalsscrollbarrowminheightforholidayvelse" v-else>
              <v-sheet class="nodatasvelsedashboard"
                ><span>{{ $t("no_annoucement_today") }}</span></v-sheet
              >
            </div>
          </div>
        </div>
      </div>
    </v-flex>
    <!-- .........{{ announcement_array }} -->
  </v-layout>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
export default {
  components: {
    VuePerfectScrollbar,
  },
  data: () => ({
    todaysdate: new Date().toISOString().substr(0, 10),
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    user: [],
    document_url: process.env.VUE_APP_IMAGE_PATH,
    announcement_array: [],
    showAnnoncement: false,
    closebirthdaytitle: false,
    user_id: "",
    user_site_id: "",
    user_org_id: "",
    upcoming_holidays: [],
    emp_current_month_bithday: [],
  }),
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.user_id = this.user.emp_id;
  },
  watch: {
    user_id: {
      immediate: true,
      handler() {
        if (this.user.hr_employee && this.user_id > 0) {
          this.user_site_id = this.user.hr_employee.site_id;
          this.user_org_id = this.user.hr_employee.org_id;
          this.fetchUpcomingHolidays();
          this.fetchEmpBirthday();
          this.fetchCurrentdayAnnouncement();
        }
      },
    },
  },

  methods: {
    // Readmore(announcement_slug){
    //   alert(announcement_slug);
    //   this.$router.query({
    //             name: "announcement_view",
    //             slug:   announcement_slug
    //           });
    // },
    openAnnouncement() {
      this.closebirthdaytitle = true;
      document.getElementById("birthdayanimationdiv").className =
        "dummydivbirthday";
      this.showAnnoncement = true;
    },

    closeAnnouncement() {
      this.closebirthdaytitle = false;
      this.showAnnoncement = false;
    },
    fetchUpcomingHolidays() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_upcoming_holidays", {
          params: {
            site_id: this.user_site_id,
            org_id: this.user_org_id,
          },
        })
        .then((res) => {
          if (res.data.status == "S") {
            for (var hol = 0; hol < res.data.upcoming_holidays.length; hol++) {
              if (res.data.upcoming_holidays[hol].from_date < this.todaysdate) {
                this.upcoming_holidays.push(res.data.upcoming_holidays[hol]);
              } else {
                this.upcoming_holidays.unshift(res.data.upcoming_holidays[hol]);
              }
            }
            this.$emit("fetchholiday", "true");
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
    fetchCurrentdayAnnouncement() {
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetch_current_day_announcement",
          {
            params: {
              site_id: this.user_site_id,
              org_id: this.user_org_id,
            },
          }
        )
        .then((res) => {
          this.announcement_array = res.data.announcement_details;
          this.$emit("fetchannouncement", "true");
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
    fetchEmpBirthday() {
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetch_emp_current_month_birthday",
          {
            params: {
              site_id: this.user_site_id,
              org_id: this.user_org_id,
            },
          }
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.emp_current_month_bithday = res.data.current_month_birthday;
            this.$emit("fetchbirthday", "true");
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
  },
};
</script>

<style scoped>
.holidaytimileneheight {
  height: 265px;
  width: 100%;
  overflow-x: hidden !important;
}

.currentbirthdaymonthheight {
  height: 265px;
  width: 100%;
  overflow-x: hidden !important;
}

.dayname_timeline {
  font-weight: 500;
  padding-left: 3px;
  padding-top: 1px;
  font-size: 13px;
  width: 100px;
  color: grey;
}

.ps__scrollbar-x {
  display: none !important;
}

.currentbirthdaynamesubheading {
  font-size: 13px;
}

.currentbirthdaynameheading {
  font-size: 15px;
}

.count-up-wrapper {
  font-size: 13px;
}

.badgeholidayname {
  font-size: 12px;
  letter-spacing: 1pt;
}

.approvalsscrollbarrowminheightforholidayvelse {
  height: 266px;
  overflow-x: hidden;
}

.announcementheaderspan {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 285px;
}

.announcementheader {
  background-color: aliceblue !important;
  color: #080808cf !important;
  height: 40px !important;
}

.announcementheaderexpanded {
  background-color: aliceblue !important;
  color: #080808cf !important;
}

.announcementbody {
  background-color: white;
  color: black;
  padding: 14px 14px;
}

.announcementbodyspan {
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

/* .announcementmainclass:hover .announcementbodyspan {
    white-space: normal;
    text-overflow: ellipsis;
    display: inline-block;
    height: 47px;
    overflow: visible;
} */

.maindivexpandannouncemet {
  margin-left: auto;
  animation-name: big_it_announcement;
  animation-duration: 0.3s;
  animation-fill-mode: forwards;
}

/* #birthdayanimationdiv {} */

.dummydivbirthday {
  margin-right: auto;
  animation-name: small_it_birthday;
  animation-duration: 0s;
  animation-fill-mode: forwards;
}

@keyframes big_it_announcement {
  from {
    width: 48%;
  }

  to {
    width: 100%;
  }
}

@keyframes small_it_birthday {
  from {
    width: 100%;
  }

  to {
    width: 0%;
  }
}
</style>
