<template>
  <div>
    <div flat color="white" class="py-2 px-3 d-flex action-header-bar">
      <div>
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

      <div class="d-flex justify-content-end ml-4">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              v-on="on"
              class="mr-5 pb-2"
              color="primary"
              @click="openDialog(false)"
              >mdi-calendar-clock</v-icon
            >
          </template>
          <span>{{ $t("add_new") }}</span>
        </v-tooltip>
      </div>
    </div>
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

    <div v-if="currentTab == 'Interview Scheduled'">
      <Interview :interview_status="'Interview Scheduled'" :search="search" />
    </div>
    <div v-if="currentTab == 'Shortlist'">
      <Interview :interview_status="'Shortlist'" :search="search"/>
    </div>
    <div v-if="currentTab == 'Schedule Next Round'">
      <Interview :interview_status="'Schedule Next Round'" :search="search" />
    </div>
    <div v-if="currentTab == 'On Hold'">
      <Interview :interview_status="'On Hold'" :search="search"/>
    </div>
    <div v-if="currentTab == 'Hired'">
      <Interview :interview_status="'Hired'" :search="search" />
    </div>
    <div v-if="currentTab == 'Rejected'">
      <Interview :interview_status="'Rejected'"  :search="search"/>
    </div>
    <div v-if="currentTab == 'Others'">
      <Interview :interview_status="'Others'" :search="search" />
    </div>
    <div>
      <ScheduleInterview
        :schedule_dialog="schedule_dialog"
        :edit_schedule_interview="edit_schedule_interview"
        :schedule_interview_slug="schedule_interview_slug"
        @scheduleDialog="scheduleDialog"
        @tabUpdates="tabUpdates"
      />
    </div>
  </div>
</template>
<script>
import Tabs from "vue-tabs-with-active-line";
import Interview from "./Interview.vue";
import ScheduleInterview from "./ScheduleInterview.vue";

export default {
  components: {
    Tabs,
    Interview,
    ScheduleInterview,
  },
  data: () => ({
    tabs: TABS,
    currentTab: "Interview Scheduled",
    loader: false,
    search: "",
    schedule_dialog: false,
    schedule_interview_slug: "",
    edit_schedule_interview: false,
  }),
  // mounted(){
  // this.handleClick()
  // },
  methods: {
    tabUpdates(data) {
      this.fetchJobs();
      cosole.log(data);
    },
    handleClick(newTab) {
      this.currentTab = newTab;
    },
    openDialog(edit) {
      this.edit_schedule_interview = edit;
      this.schedule_dialog = true;
    },
    scheduleDialog(dialog_value) {
      this.schedule_dialog = dialog_value;
      this.fetchJobs(this.interview_status);
    },
    fetchJobs(status) {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetch_all_schedule_interview",
          {
            params: {
              interview_status: status,
            },
          }
        )
        .then((res) => {
          console.log(res);
          this.candiate_interview_details = res.data.candiate_interview_details;
          this.initval = false;
        })
        .catch((err) => {
          this.initval = false;
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
        });
    },
  },
};
const TABS = [
  {
    title: "Interview Scheduled",
    value: "Interview Scheduled",
  },
  {
    title: "Shortlist",
    value: "Shortlist",
  },
  {
    title: "Schedule Next Round",
    value: "Schedule Next Round",
  },
  {
    title: "On Hold",
    value: "On Hold",
  },
  {
    title: "Hired",
    value: "Hired",
  },
  {
    title: "Rejected",
    value: "Rejected",
  },
  {
    title: "Others",
    value: "Others",
  },
];
</script>
<style scoped>
.search_interview {
  /* margin: 12px 0px 14px -14px; */
  position: absolute;
  left: 65%;
  top: 12px;
  height: 61px;
  border-bottom: #dee2e6 solid 1px;
}
.parent_position {
  position: relative;
  margin: 1px;
}
.action-header-bar {
  position: absolute;
  right: -12px;
  z-index: 10;
}
</style>
