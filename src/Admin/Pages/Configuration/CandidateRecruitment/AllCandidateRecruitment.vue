<template>
  <div class="mt-2">
    <!-- <v-tabs> -->
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
    <!-- </v-tabs> -->

    <div v-if="currentTab == 'candidate_dashboard'">
      <CandidateDashboard @jobDetails="jobDetails" />
    </div>
    <div v-if="currentTab == 'candidate_details'">
      <CandidateRecruitment />
    </div>
    <div v-if="currentTab == 'jobs'">
      <Jobs :tabs_details="tabs_details" />
    </div>
    <div v-if="currentTab == 'interviews'">
      <InterviewsAllTabs />
    </div>
    <div v-if="currentTab == 'candidates_connect'">
      <CandidateConnect />
    </div>
  </div>
</template>
<script>
import Tabs from "vue-tabs-with-active-line";
import ComingSoon from "../../ComingSoon.vue";
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import CandidateRecruitment from "../CandidateRecruitment/CandidateRecruitmentIndex.vue";
import CandidateDashboard from "../CandidateRecruitment/CandidateDashboard.vue";
import CandidateConnect from "../CandidateRecruitment/CandidateConnect.vue";
import InterviewsAllTabs from "../Interviews/InterviewAllTabs.vue";
import Jobs from "../RecruitmentJobs/Index.vue";
// import ContactRecruitment from "../Recruitment/ContactsRecruitment.vue";
export default {
  components: {
    Tabs,
    PageTitle,
    ComingSoon,
    CandidateRecruitment,
    InterviewsAllTabs,
    Jobs,
    CandidateConnect,
    CandidateDashboard,
    // ContactRecruitment,
  },
  data: () => ({
    tabs: TABS,
    currentTab: "candidate_dashboard",
    loader: false,
  }),
  watch: {
    "$route.params.page_details": {
      immediate: true,
      handler() {
        if (this.$route.params.page_details) {
          this.currentTab = this.$route.params.page_details;
        }
      },
    },
  },
  mounted() {
    if (localStorage.getItem("active_rect_tab")) {
      this.currentTab = localStorage.getItem("active_rect_tab");
    }
  },
  methods: {
    jobDetails(page_details) {
      // alert(page_details);
      if (page_details == "candidate_details") {
        this.currentTab = page_details;
      } else if (page_details) {
        this.tabs_details = page_details;
        this.currentTab = "jobs";
      }
    },
    handleClick(newTab) {
      this.currentTab = newTab;
      localStorage.setItem("active_rect_tab", newTab);
    },
  },
};
const TABS = [
  {
    title: "Dashboard",
    value: "candidate_dashboard",
  },
  {
    title: "Candidates",
    value: "candidate_details",
  },
  {
    title: "Jobs",
    value: "jobs",
  },
  {
    title: "Interviews",
    value: "interviews",
  },
  {
    title: "Connects",
    value: "candidates_connect",
  },
];
</script>
<style scoped></style>
