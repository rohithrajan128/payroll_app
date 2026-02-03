<template>
  <div class="main-20">
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
              @click="addNew()"
              medium
              color="primary"
              style="font-size: 30px"
              v-on="on"
              class="mr-5"
              >mdi-plus-circle</v-icon
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
    />

    <div v-if="currentTab == 'followup'">
      <FollowupReport
        source="Lead"
        :lead_id="lead_id"
        :search="search"
        :add_followup="add_followup"
        @update-timeline="updateTimeline"
        @reset-data="resetData"
      ></FollowupReport>
    </div>
    <div v-if="currentTab == 'meeting'">
      <MeetingReport
        source="Lead"
        :lead_id="lead_id"
        :search="search"
        :add_meeting="add_meeting"
        @update-timeline="updateTimeline"
        @reset-data="resetData"
      />
    </div>
  </div>
</template>
    
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import Tabs from "vue-tabs-with-active-line";
import FollowupReport from "./FollowupReport.vue";
import MeetingReport from "./MeetingReport.vue";

const TABS = [
  {
    title: "Followup",
    value: "followup",
  },
  {
    title: "Meetings",
    value: "meeting",
  },
];

export default {
  components: {
    PageTitle,
    Tabs,
    FollowupReport,
    MeetingReport,
  },
  data: () => ({
    user: [],
    tabs: TABS,
    currentTab: "followup",
    headers: [
      {
        text: "Followup Date",
        align: "left",
        value: "followup_date",
      },
      {
        text: "Followup Time",
        align: "left",
        value: "followup_time",
      },

      {
        text: "Actions",
        value: "",
        sortable: false,
        align: "center",
      },
    ],
    google_icon: {
      icon_name: "diversity_3",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
  }),
  props: ["lead_id", "add_followup", "add_meeting"],
  watch: {
    add_followup: {
      immediate: true,
      handler() {
        if (this.add_followup == true) {
          this.currentTab = "followup";
          this.addNew();
        }
      },
    },
    add_meeting: {
      immediate: true,
      handler() {
        if (this.add_meeting == true) {
          this.currentTab = "meeting";
          this.addNew();
        }
      },
    },
  },
  mounted() {},
  methods: {
    resetData() {
      this.add_meeting = false;
      this.add_followup = false;
    },
    updateTimeline() {
      this.$emit("update-timeline");
    },
    handleClick(newTab) {
      this.currentTab = newTab;
    },
    addNew() {
      if (this.currentTab == "followup") {
        this.add_meeting = false;
        this.add_followup = true;
      } else {
        this.add_followup = false;
        this.add_meeting = true;
      }
    },
  },
};
</script>
<style scoped>
.action-header-bar {
  position: absolute;
  right: -12px;
  z-index: 10;
}
</style>