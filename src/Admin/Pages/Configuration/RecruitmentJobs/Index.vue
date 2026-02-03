<template>
  <div class="main-20">
    <!-- <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title
        class="col-md-4"
        :heading="$t('jobs')"
        :google_icon="google_icon"
      ></page-title>
      <div class="col-md-6">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-text-field
              dense
              rounded-pill
              density="compact"
              outlined
              rounded
              small
              v-on="on"
              v-model="search"
              append-icon="search"
              label="Search"
              class="srch_bar"
              hide-details
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
              :to="{ name: 'jobs_amend' }"
            >
              <v-btn
                color=" btn mr-2 mb-2 hover_shine add_new"
                small
                class="mb-2"
                v-on="on"
                >{{ $t("add_new") }}</v-btn
              >
            </router-link>
          </template>
          <span>{{ $t("add_new") }}</span>
        </v-tooltip>
      </div>
    </div> -->
    <Tabs
      :tabs="tabs"
      :currentTab="currentTab"
      :wrapper-class="'shadow-tabs inline-tabs align-self-center'"
      :tab-class="'tab-item'"
      :tab-active-class="'tab-item-active'"
      :line-class="'tab-item-line'"
      @onClick="handleClick"
      style="background: white"
    />
    <div v-if="currentTab == 'active_jobs'">
      <AllJobsView :component_job_status="'Active'" />
    </div>
    <div v-if="currentTab == 'paused_jobs'">
      <AllJobsView :component_job_status="'Paused'" />
    </div>
    <div v-if="currentTab == 'inactive_jobs'">
      <AllJobsView :component_job_status="'InActive'" />
    </div>
  </div>
</template>
<script>
import Tabs from "vue-tabs-with-active-line";
import AllJobsView from "./AllJobsView.vue";
import PageTitle from "../../../../Layout/Components/PageTitle.vue";

export default {
  props: ["tabs_details"],
  components: {
    PageTitle,
    AllJobsView,
    Tabs,
  },
  data: () => ({
    google_icon: {
      icon_name: "settings_suggest",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    tabs: TABS,
    currentTab: "active_jobs",
  }),

  mounted() {
    if (localStorage.getItem("active_job_tab")) {
      this.currentTab = localStorage.getItem("active_job_tab");
    }
  },
  watch: {
    tabs_details: {
      immediate: true,
      handler() {
        if (this.tabs_details) {
          this.handleClick(this.tabs_details)
          // alert("sadad");
        }
      },
    },
  },
  methods: {
    handleClick(newTab) {
      this.currentTab = newTab;
      localStorage.setItem("active_job_tab", newTab);
    },
  },
};
const TABS = [
  {
    title: "Active Jobs",
    value: "active_jobs",
  },
  {
    title: "Paused Jobs",
    value: "paused_jobs",
  },
  {
    title: "InActive Jobs",
    value: "inactive_jobs",
  },
];
</script>
<style scoped>
.theme--light.v-tabs > .v-tabs-bar {
  background: #f1f5f8 !important;
}
</style>
