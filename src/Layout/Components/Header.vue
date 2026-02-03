<template>
  <div :class="headerbg" class="app-header header-shadow">
    <div class="logo-src" />
    <div class="app-header__content">
      <div class="app-header-right">
        <v-hover
          v-slot="{ hover }"
          open-delay="200"
          v-if="
            user.hr_employee &&
            user.hr_employee.emprole_name.includes('Manager', 'HR')
          "
        >
          <v-btn @click="snackbarShow()" class="bg-none bell_btn">
            <v-badge
              :content="notification_count"
              :value="notification_count"
              color="green"
              overlap
            >
              <v-icon
                @click="fetchNotifications"
                size="x-large"
                class="text-success"
                >{{
                  hover
                    ? "mdi-bell"
                    : notify_visible == true
                    ? "mdi-bell"
                    : "mdi-bell-outline"
                }}</v-icon
              >
            </v-badge>

            <!-- <v-badge  dot overlap x-small>
            </v-badge>-->
          </v-btn>
        </v-hover>
        <v-expand-transition>
          <v-card
            v-if="notify_visible"
            v-click-outside="snackbarhide"
            class="drawer"
          >
            <v-card max-width="450" class="mx-auto">
              <v-toolbar color="cyan" dark>
                <v-toolbar-title>Notifications</v-toolbar-title>

                <v-spacer></v-spacer>

                <v-btn icon>
                  <v-icon>mdi-bell</v-icon>
                </v-btn>
              </v-toolbar>

              <v-list three-line class="notify_contents">
                <!-- <v-subheader  
        >
        Today
                </v-subheader>-->
                <VueElementLoading
                  :active="notify_loader"
                  spinner="bar-fade-scale"
                  color="var(--primary)"
                />
                <template
                  v-if="notifications_array.length > 0"
                  v-for="(item, index) in notifications_array"
                >
                  <v-list-item class="m-auto notify_items">
                    <v-list-item-avatar class="my-auto">
                      <img
                        class="m-auto my-auto"
                        v-if="item.emp_details.profile_pic"
                        :src="envImagePath + item.emp_details.profile_pic"
                      />
                      <img
                        v-else
                        src="@/assets/images/default-user-profile-picture.png"
                      />
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                      <v-list-item-subtitle>{{
                        item.body
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider class="m-0"></v-divider>
                </template>
                <template v-if="notifications_array.length == 0">
                  <div class="text-secondary">
                    <p class="pl-3 text-center">{{ $t("no_details_found") }}</p>
                  </div>
                </template>
              </v-list>
            </v-card>
          </v-card>
        </v-expand-transition>
        <QuickActions></QuickActions>
        <UserArea />
      </div>
    </div>
    <div class="app-header__mobile-menu">
      <div>
        <button
          type="button"
          class="hamburger close-sidebar-btn hamburger--elastic"
          v-bind:class="{ 'is-active': isOpen }"
          @click="toggleMobile('closed-sidebar-open')"
        >
          <span class="hamburger-box">
            <span class="hamburger-inner"></span>
          </span>
        </button>
      </div>
    </div>
    <div class="app-header__menu">
      <span>
        <b-button
          class="btn-icon btn-icon-only"
          variant="primary"
          size="sm"
          v-bind:class="{ active: isOpenMobileMenu }"
          @click="toggleMobile2('header-menu-open')"
        >
          <div class="btn-icon-wrapper">
            <font-awesome-icon icon="ellipsis-v" />
          </div>
        </b-button>
      </span>
    </div>
  </div>
</template>

<script>
import { getMessaging, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import UserArea from "./Header/HeaderUserArea";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import QuickActions from "./Header/HeaderQuickActions.vue";
import VueElementLoading from "vue-element-loading";
if (window.location.protocol === "https:") {
  const firebaseConfig = {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTHDOMAIN,
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_FIREBASE_SENDER_ID,
    appId: process.env.VUE_APP_FIREBASE_APP_ID,
    measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID,
  };
  const app = initializeApp(firebaseConfig);
  var messaging = getMessaging();

}
library.add(faEllipsisV);
export default {
  name: "Header",
  components: {
    VueElementLoading,
    UserArea,
    QuickActions,
    "font-awesome-icon": FontAwesomeIcon,
  },

  data() {
    return {
      notify_loader: true,
      envImagePath: process.env.VUE_APP_IMAGE_PATH,
      notifications_array: [],
      notification_count: 0,
      items: [
        { header: "Today" },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
          title: "Brunch this weekend?",
          subtitle: `<span class="text--primary">Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
        },
        { divider: true, inset: true },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
          title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
          subtitle: `<span class="text--primary">to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend.`,
        },
        { divider: true, inset: true },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
          title: "Oui oui",
          subtitle:
            '<span class="text--primary">Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?',
        },
        { divider: true, inset: true },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
          title: "Birthday gift",
          subtitle:
            '<span class="text--primary">Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?',
        },
        { divider: true, inset: true },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
          title: "Recipe to try",
          subtitle:
            '<span class="text--primary">Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos.',
        },
      ],
      notify_visible: false,
      snackbar: {
        color: null,
        icon: null,
        mode: null,
        position: "top",
        text: null,
        timeout: 7500,
        title: null,
        visible: false,
      },
      timeout: 7500,
      isOpen: false,
      isOpenMobileMenu: false,
      app_image_url: "",
      parameter_image_url: [],
      application_name: "",
      greeting: "",
      user: "",
    };
  },
  props: {
    headerbg: String,
  },
  mounted() {
    this.$eventBus.$on("app_logo", this.change_logo);
    this.fetchAppImageUrl();
    this.user = JSON.parse(localStorage.getItem("user"));
    if (window.location.protocol === "https:") {

    onMessage(messaging, (payload) => {
      // console.log("Message received. ", payload);

      this.fetchNotifications();
    });
    }
    // this.fetchNotifications();
  },
  methods: {
    snackbarhide() {
      // console.log("object");
      this.notify_visible = false;
    },
    snackbarShow() {
      this.notify_visible = true;
    },

    toggleMobile(className) {
      const el = document.body;
      this.isOpen = !this.isOpen;

      if (this.isOpen) {
        el.classList.add(className);
      } else {
        el.classList.remove(className);
      }
    },

    toggleMobile2(className) {
      const el = document.body;
      this.isOpenMobileMenu = !this.isOpenMobileMenu;

      if (this.isOpenMobileMenu) {
        el.classList.add(className);
      } else {
        el.classList.remove(className);
      }
    },
    change_logo() {
      this.app_image_url = localStorage.getItem("App_Image_Url");
      this.fetchAppImageUrl();
    },
    fetchAppImageUrl() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_image_url", {})
        .then((res) => {
          this.parameter_image_url = res.data.parameter_image;
          this.application_name = res.data.application_name;
          localStorage.setItem("Application_Name", this.application_name);

          if (this.parameter_image_url != null) {
            localStorage.setItem(
              "App_Image_Url",
              this.parameter_image_url.image_full_url
            );
            this.app_image_url = localStorage.getItem("App_Image_Url");
          } else {
            localStorage.removeItem("App_Image_Url");
            this.app_image_url = "";
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
    fetchNotifications() {
      this.notify_loader = true;
      if (this.user.hr_employee.device_token) {
        axios
          .get(process.env.VUE_APP_API_URL_ADMIN + "fetchnotifications")
          .then((res) => {
            this.notifications_array = res.data.notification;
            this.notification_count = res.data.notification_count;
            this.updateNotificationsStatus();
            this.notify_loader = false;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    updateNotificationsStatus() {
      // this.fetchNotifications();
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "update_notifications_status")
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.notification_count = res.data.notification_count;
            // this.flashMessage.success({
            //   message: this.array_data,
            //   time: 4000,
            //   blockClass: "custom-block-class",
            // });
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
          } else {
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
          console.log("this error" + err);
        });
    },
  },
};
</script>
<style scoped>
.name_display {
  font-size: 16px;
  opacity: 1;
}
.bell_btn {
  box-shadow: none;
  background-color: transparent !important;
}
.drawer {
  position: absolute;
  z-index: 1000;
  top: 60px;
  right: 20px;
  width: 400px;
  /* min-height: 500px; */
  /* height:max-content; */
  /* height: 50vh; */
  /* overflow-y: scroll; */
  border-radius: 20px;
}
.notify_items {
  /* height:500px */
}
.notify_contents {
  max-height: 300px;
  overflow-y: scroll;
}
</style>
