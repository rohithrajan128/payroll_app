<template>
  <div class="main-20">
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title
        class="col-md-4"
        :heading="$t('activities')"
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

      <div class="col-md-2 d-flex justify-content-end">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div>
              <v-icon
                @click="addNew()"
                color="primary"
                class="mr-4"
                size="35"
                dark
                v-on="on"
                >mdi-plus-circle</v-icon
              >
            </div>
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
    <div>
      <FollowupReport
        v-if="currentTab == 'followup'"
        source="None"
        :lead_id="null"
        :search="search"
        :add_followup="add_followup"
        @reset-data="resetData"
      ></FollowupReport>
      <MeetingReport
        v-if="currentTab == 'meetings'"
        source="None"
        :lead_id="null"
        :search="search"
        :add_meeting="add_meeting"
        @reset-data="resetData"
      />
      <CallLogsReport
        v-if="currentTab == 'call_logs'"
        :search_input="search"
        source="None"
        :lead_id="null"
        :add_call_log="add_call_log"
        @reset-data="resetData"
      />
    </div>
  </div>
</template>
    
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import Tabs from "vue-tabs-with-active-line";
import FollowupReport from "./FollowupReport.vue";
import MeetingReport from "./MeetingReport.vue";
import CallLogsReport from "./CallLogsReport.vue";

const TABS = [
  {
    title: "Followup",
    value: "followup",
  },
  {
    title: "Meetings",
    value: "meetings",
  },
  {
    title: "Call Logs",
    value: "call_logs",
  },
];

export default {
    watch: {
      "$route.query.tab": {
        immediate: true,
        handler() {
          if (this.$route.query.tab) {
            this.currentTab = this.$route.query.tab;
          }
        },
      },
    },
  components: {
    PageTitle,
    ConfirmDialog,
    Tabs,
    FollowupReport,
    MeetingReport,
    CallLogsReport,
  },
  data: () => ({
    add_meeting: false,
    add_followup: false,
    add_call_log: false,
    tabs: TABS,
    currentTab: "followup",
    showStatusDialog: false,
    showdeleteDialog: false,
    initval: false,
    status_id: null,
    delete_id: null,
    next_seq: "",
    google_icon: {
      icon_name: "contract_edit",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
    roles: [],
  }),
  mounted() {
    // if (!this.$route.query.status) {
    //   this.user = JSON.parse(localStorage.getItem("user"));
    //   this.org_id = this.user.hr_employee.org_id;
    //   this.emp_id = this.user.emp_id;
    //   this.roles = this.user.hr_employee.emprole_name;
    //   this.fetchLeads(this.currentTab);
    // }
  },
  methods: {
    addNew() {
      this.add_meeting = true;
      this.add_followup = true;
      this.add_call_log = true;
    },
    resetData() {
      this.add_meeting = false;
      this.add_followup = false;
      this.add_call_log = false;
    },
    handleClick(newTab) {
      this.currentTab = newTab;
    },

    canceldelete() {
      this.showdeleteDialog = false;
    },
    confirmdelete() {
      this.confirmDeleteLead();
      this.showdeleteDialog = false;
    },

    fetchLeads(status = "All") {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "leads", {
          params: {
            org_id: this.org_id,
            emp_id: this.emp_id,
            roles: this.roles,
            status: status,
          },
        })
        .then((res) => {
          this.leads_array = res.data.leads;
          this.initval = false;
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
          this.initval = false;
        });
    },

    deleteLeads(id) {
      this.delete_id = id;
      this.showdeleteDialog = true;
    },

    confirmDeleteLead() {
      this.initval = true;
      axios
        .delete(process.env.VUE_APP_API_URL_ADMIN + "leads/" + this.delete_id)
        .then((res) => {
          if (res.data.status == "S") {
            this.flashMessage.success({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.initval = false;
            this.fetchLeads(this.currentTab);
          } else {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.initval = false;
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          this.initval = false;
          console.log("this error" + err);
        });
    },

    addtofavourite(id) {
      this.initval = true;
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "update_leads_favourite", {
          id: id,
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.flashMessage.success({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.fetchLeads(this.currentTab);
          } else {
            this.flashMessage.error({
              message: res.data.message,
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
.favouritestaricon {
  cursor: pointer !important;
}
</style>