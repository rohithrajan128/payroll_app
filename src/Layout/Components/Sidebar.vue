<template>
  <div
    :class="sidebarbg"
    class="app-sidebar sidebar-shadow"
    @mouseover="toggleSidebarHover('add', 'closed-sidebar-open')"
    @mouseleave="toggleSidebarHover('remove', 'closed-sidebar-open')"
  >
    <div class="app-header__logo">
      <div v-if="app_image_url">
        <a @click="gotohomepage()">
          <img class="custom-logo" v-bind:src="app_image_url" />
        </a>
      </div>
      <div v-else-if="app_image_url == ''">
        <a @click="gotohomepage()" class="font-base-app text-center">
          {{ application_name }}
        </a>
      </div>
      <div v-else>
        <a @click="gotohomepage()" class="font-base-app text-center">
          {{ application_name }}
        </a>
      </div>
      <div class="header__pane ml-auto permanent">
        <button
          type="button"
          class="hamburger close-sidebar-btn hamburger--elastic"
          v-bind:class="{ 'is-active': !isOpen }"
          @click="toggleBodyClass('closed-sidebar')"
        >
          <span class="hamburger-box">
            <span class="hamburger-inner"></span>
          </span>
        </button>
      </div>
    </div>
    <div class="app-sidebar-content" style="overflow-y: auto">
      <!-- <VuePerfectScrollbar class="app-sidebar-scroll" v-once> -->
      <!-- <sidebar-menu showOneChild :menu="menu" /> -->
      <MenuDisplay :menuItems="menu" />
      <!-- </VuePerfectScrollbar> -->
    </div>

    <!-- <div
      class="pb-2"
      style="position: relative; background-color: #fff; display: flex"
    >
      <span class="mt-2"> </span>
    </div> -->
  </div>
</template>

<script>
// import { SidebarMenu } from "vue-sidebar-menu";
import MenuDisplay from "./MenuDisplay.vue";
export default {
  components: {
    // SidebarMenu,
    MenuDisplay,
  },

  data() {
    return {
      isOpen: false,
      sidebarActive: false,
      language: "",
      org_id: 0,
      menu: [],
      date_format: "",
      collapsed: true,
      windowWidth: 0,
      app_image_url: "",
      application_name: "",
      app_name: "",
    };
  },
  props: {
    sidebarbg: String,
  },
  created() {
    this.toggleBodyClass("closed-sidebar-open");
  },
  created() {
    this.$nextTick(function () {
      window.addEventListener("resize", this.getWindowWidth);
      setTimeout(() => {
        if (localStorage.getItem("App_Image_Url") != null) {
          this.app_image_url = localStorage.getItem("App_Image_Url");
          this.app_name = localStorage.getItem("App_Name");
        } else {
          this.app_image_url = "";
        }
        if (localStorage.getItem("Application_Name")) {
          this.application_name = localStorage.getItem("Application_Name");
        } else {
          this.application_name = "";
        }
      }, 2000);
    });
    this.$eventBus.$on("updated_menus", () => {
      this.fetchMenu();
    });
    this.fetchMenu();
    this.$eventBus.$on("app_logo", this.change_logo);
  },
  methods: {
    fetchMenu() {
      this.user = JSON.parse(localStorage.getItem("user"));
      if (this.user) {
        axios
          .get(
            process.env.VUE_APP_API_URL_ADMIN +
              "menutree?+&emp_id=" +
              this.user.hr_employee.id
          )
          .then((res) => {
            if (Array.isArray(res.data.message)) {
              this.array_data = res.data.message.toString();
            } else {
              this.array_data = res.data.message;
            }
            if (res.data.status == "S") {
              this.menu = res.data.menu;
              this.menu.forEach((ele) => {
                if (ele.href == this.$route.name) {
                  localStorage.setItem("sel_menu", JSON.stringify(ele));
                }
              });
              console.log("my route path");
            } else if (res.data.status == "E") {
              this.flashMessage.error({
                message: this.array_data,
                time: 4000,
                blockClass: "custom-block-class",
              });
            } else {
              this.flashMessage.error({
                message: this.array_data,
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
            console.log(err);
          });
      }
    },
    toggleBodyClass(className) {
      const el = document.body;
      this.isOpen = !this.isOpen;

      if (this.isOpen) {
        el.classList.add(className);
      } else {
        el.classList.remove(className);
      }
    },
    toggleSidebarHover(add, className) {
      const el = document.body;
      this.sidebarActive = !this.sidebarActive;

      this.windowWidth = document.documentElement.clientWidth;

      if (this.windowWidth > "992") {
        if (add === "add") {
          el.classList.add(className);
        } else {
          el.classList.remove(className);
        }
      }
    },
    getWindowWidth() {
      const el = document.body;

      this.windowWidth = document.documentElement.clientWidth;

      if (this.windowWidth < "1200") {
        el.classList.add("closed-sidebar", "closed-sidebar-md");
      } else {
        el.classList.remove("closed-sidebar", "closed-sidebar-md");
      }
    },
    change_logo() {
      this.$nextTick(function () {
        window.addEventListener("resize", this.getWindowWidth);
        setTimeout(() => {
          if (localStorage.getItem("App_Image_Url") != null) {
            this.app_image_url = localStorage.getItem("App_Image_Url");
            this.app_name = localStorage.getItem("App_Name");
          } else {
            this.app_image_url = "";
          }
          if (localStorage.getItem("Application_Name")) {
            this.application_name = localStorage.getItem("Application_Name");
          } else {
            this.application_name = "";
          }
        }, 2000);
      });
    },
    gotohomepage() {
      this.$router.push({ name: "dashboard" });
    },
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.getWindowWidth);
  },
};
</script>
<style scoped>
.v-sidebar-menu .vsm-arrow:after {
  margin-left: 20px;
}

.txt-sidebar-image {
  /* font-family: roboto; */
  font-size: 25px;
}
.sidebar-image-para {
  margin-left: 39px;
  font-size: 11px;
}
.v-sidebar-menu .vsm-link:active {
  color: aqua !important;
  background-color: black !important;
}

.v-sidebar-menu >>> .vsm-icon {
  font-size: 16px !important;
}

.logo_img {
  max-height: 21px;
}
.app-logo {
  display: flex;
  background-repeat: no-repeat;
}
.font-base-app {
  /* font-family: cursive; */
  font-size: 20px !important;
  color: #2b70d6 !important;
}

.custom-logo {
  width: 15vh;
  transition: width 0.5s;
}
</style>
