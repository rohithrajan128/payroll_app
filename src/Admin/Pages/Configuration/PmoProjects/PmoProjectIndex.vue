<template>
  <div>
    <div class="main-20">
      <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
      <div flat color="white" class="row py-5 pl-5 align-items-center">
        <page-title class="col-md-4" :heading="$t('Projects')" :google_icon="google_icon"></page-title>
        <div class="col-md-6">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-text-field
                dense
                density="compact"
                v-on="on"
                outlined
                v-model="search"
                append-icon="search"
                label="Search"
                class="srch_bar"
                rounded
                small
                hide-details
                rounded-pill
              ></v-text-field>
            </template>
            <span>{{ $t("search") }}</span>
          </v-tooltip>
        </div>

        <div class="col-md-2">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <router-link
                class="text-decoration-none"
                :to="{
                    name: 'project.amend',
                    query: { hide: 'true',from:'add_new' },
                  }"
              >
                <v-btn v-if="user_role.includes('HR')" color=" btn hover_shine add_new" small v-on="on">{{ $t("add_new") }}</v-btn>
              </router-link>
            </template>
            <span>{{ $t("add_new") }}</span>
          </v-tooltip>
        </div>
      </div>
      <div>

        <v-tabs v-if="currentTab">
        <Tabs
          :tabs="tabs"
          :currentTab="currentTab"
          :wrapper-class="'shadow-tabs inline-tabs align-self-center'"
          style="display: inline-flex"
          :tab-class="'tab-item'"
          :tab-active-class="'tab-item-active'"
          :line-class="'tab-item-line'"
          @onClick="handleClick"
        />
      </v-tabs>


          <div v-if="currentTab=='current_projects'">
            <v-sheet class="vsheetbtab">
              <PmoActiveProjects
                :search="search"
                @display_active="displayactiveprojects()"
                :active_proj="active_proj"
                :user_role="user_role"
                :status="active"
              />
            </v-sheet>
          </div>
          <div v-else-if="currentTab=='inactive_projects'">
            <v-sheet class="vsheetbtab">
              <PmoInactiveProjects
                :search="search"
                @display_active="displayactiveprojects()"
                :inactive_proj="inactive_proj"
                :user_role="user_role"
                :status="inactive"
              />
            </v-sheet>
          </div>
  
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import VueElementLoading from "vue-element-loading";
import PmoActiveProjects from "./PmoActiveProjects.vue";
import PmoInactiveProjects from "./PmoInactiveProjects.vue";
import Tabs from "vue-tabs-with-active-line";

const TABS = [
  {
    title: "Current Projects",
    value: "current_projects"
  },
  {
    title: "Inactive/Completed Projects",
    value: "inactive_projects"
  }
];
export default {
  data: () => ({
    tabs:TABS,
    currentTab:"current_projects",
    user_role:[],
    search: "",
    active_proj: [],
    inactive_proj: [],
    status: "",
    active: "",
    inactive: "",
    loader: false,
    google_icon: {
      icon_name: "Work",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined"
    },
    user: [],
    user_id: "",
  }),
  components: {
    PageTitle,
    ConfirmDialog,
    VueElementLoading,
    PmoActiveProjects,
    PmoInactiveProjects,
    Tabs
  },
  mounted() {
    // this.displayinactiveprojects();
    this.user = JSON.parse(localStorage.getItem("user"));
    this.user_id = this.user.emp_id;
  },
  watch: {
    user_id: {
      immediate: true,
      handler() {
        if (this.user_id) {
          this.displayactiveprojects();
        }
      }
    }
  },
  methods: {
    handleClick(newTab) {
      this.currentTab = newTab;
    },
    fetchactiveprojects() {
      this.status = true;
    },
    fetchinactiveprojects() {
      this.status = true;
    },

    displayactiveprojects() {
      this.loader = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchactiveprojects", {
          params: {
            emp_id: this.user_id
          }
        })
        .then(res => {
          this.user_role= res.data.user_role;
          this.active_proj = res.data.projects;

          this.inactive_proj = res.data.projects_inactive;
          this.loader = false;
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class"
            });
          }
        })
        .catch(err => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          console.log("error", err);
        });
    }
    // displayinactiveprojects() {
    //       this.loader = true;
    //       axios
    //         .get(process.env.VUE_APP_API_URL_ADMIN + "fetchinactiveprojects")
    //         .then((res) => {
    //           // this.inactive_proj = res.data.projects;
    //           this.loader = false;
    //           if (Array.isArray(res.data.message)) {
    //             this.array_data = res.data.message.toString();
    //           } else {
    //             this.array_data = res.data.message;
    //           }
    //           if (res.data.status == "E") {
    //             this.flashMessage.error({
    //               message: this.array_data,
    //               time: 4000,
    //               blockClass: "custom-block-class",
    //             });
    //           }
    //         })
    //         .catch((err) => {
    //           this.flashMessage.error({
    //             message: this.$t("something_went_wrong"),
    //             time: 4000,
    //             blockClass: "custom-block-class",
    //           });
    //           console.log("error", err);
    //         });
    //     },
  }
};
</script>

<style scoped>
.vsheetbtab {
  padding: 0px;
}
</style>