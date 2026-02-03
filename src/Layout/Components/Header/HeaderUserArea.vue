<template>
  <div class="d-flex">
    <div class="header-btn-lg pr-0">
      <div class="widget-content p-0">
        <div class="widget-content-wrapper">
          <div class="widget-content-left">
            <b-dropdown
              toggle-class="p-0 mr-2"
              menu-class="dropdown-menu-lg dropdown-menu"
              variant="link"
              no-caret
              right
            >
              <span slot="button-content">
                <div class="icon-wrapper icon-wrapper-alt rounded-circle">
                  <img
                            v-if="user && user.hr_employee.profile_pic != null"
                            width="42"
                            class="rounded-circle"
                            :src="envImagePath + user.hr_employee.profile_pic"
                            alt
                          />
                  <img
                    v-else
                    width="42"
                    class="rounded-circle"
                    src="@/assets/images/default-user-profile-picture.png"
                    alt
                  />
                </div>
              </span>
              <div class="dropdown-menu-header">
                <div class="dropdown-menu-header-inner bg-info">
                  <div class="menu-header-image opacity-2 dd-header-bg-6"></div>
                  <div class="menu-header-content text-left">
                    <div class="widget-content p-0">
                      <div class="widget-content-wrapper">
                        <div class="widget-content-left mr-3">
                          <img
                            v-if="user && user.hr_employee.profile_pic != null"
                            width="42"
                            class="rounded-circle"
                            :src="envImagePath + user.hr_employee.profile_pic"
                            alt
                          />
                          <img
                            v-else
                            width="42"
                            class="rounded-circle"
                    src="@/assets/images/default-user-profile-picture.png"
                            alt
                          />
                        </div>
                        <div v-if="user" class="widget-content-left">
                          <div  class="widget-heading">
                            {{ user.hr_employee.firstname }}{{ user.hr_employee.lastname }}
                          </div>
                          <div class="widget-subheading opacity-8">
                            {{ user.hr_employee.rolename }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="scroll-area-xs">
                <VuePerfectScrollbar class="scrollbar-container" v-once>
                  <ul class="nav flex-column px-5">
                    <li v-if="user" class="nav-item d-flex">
                      <v-icon class="icon_color delete_btn"
                        >mdi-account-box</v-icon
                      >

                      <router-link
                        :to="{
                          name: 'users.view',
                          query: {
                            slug: user.hr_employee.slug,
                            view: 'myprofile',
                          },
                        }"
                        class="nav-link"
                        >{{ $t("myprofile") }}</router-link
                      >
                    </li>
                    <li class="nav-item d-flex">
                      <v-icon class="icon_color delete_btn">mdi-restore</v-icon>
                      <router-link
                        :to="{ name: 'reset_password' }"
                        class="nav-link"
                        >{{ $t("reset_password") }}</router-link
                      >
                    </li>
                    <li class="nav-item d-flex">
                      <v-icon class="icon_color edit_btn">mdi-logout</v-icon>
                      <div class>
                        <button class="nav-link" style="color: #1976d2;" @click="logout">
                          {{ $t("logout") }}
                        </button>
                      </div>
                    </li>
                  </ul>
                </VuePerfectScrollbar>
              </div>
            </b-dropdown>
          </div>
          <div  v-if="user" class="widget-content-left">
            <div class="widget-heading">
              {{ user.hr_employee.firstname }} {{ user.hr_employee.lastname }}
             
            </div>
           <small>{{user.hr_employee.empno}}</small> 
            <div class="widget-subheading" v-if="user.hr_employee.rolename">
            
              {{ user.hr_employee.rolename }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";

import { mapGetters, mapActions } from "vuex";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleDown,
  faCalendarAlt,
  faTrashAlt,
  faCheck,
  faFileAlt,
  faCloudDownloadAlt,
  faFileExcel,
  faFilePdf,
  faFileArchive,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faAngleDown,
  faCalendarAlt,
  faTrashAlt,
  faCheck,
  faFileAlt,
  faCloudDownloadAlt,
  faFileExcel,
  faFilePdf,
  faFileArchive,
  faEllipsisH
);

export default {
  components: {
    VuePerfectScrollbar,
  },
  data: () => ({
    fill1: { gradient: ["#00b09b", "#96c93d"] },
    fill2: { gradient: ["#ff0844", "#ffb199"] },
    fill3: { gradient: ["#f6d365", "#fda085"] },
    showDrawerSection: false,
    user: "",
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
  }),
  computed: {
    ...mapGetters(["auth"]),
  },
  mounted() {},
  created() {
    this.user = JSON.parse(localStorage.getItem("user"));
  },
  methods: {
    ...mapActions("auth", ["sendLogoutRequest"]),
    logout() {
      this.$router.push("/");
      localStorage.removeItem("user");
    },
  },
};
</script>
<style scoped>
.widget-content-left >>> .dropdown-menu-lg {
  min-width: 20rem !important;
}

.width-500 {
  width: 500px !important;
}

.icon_color {
  color: #0dcaf0 !important;
}

.router-link-exact-active {
  background: #ffffff !important;
  font-weight: bolder !important;
}
</style>