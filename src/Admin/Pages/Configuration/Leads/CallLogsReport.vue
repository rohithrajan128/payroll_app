<template>
  <div class="main-20">
    <div
      flat
      color="white"
      class="py-2 px-3 d-flex action-header-bar"
      v-if="source == 'Lead'"
    >
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
              @click="addLogs()"
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
      style="background: white"
      :tabs="tabs"
      :currentTab="currentTab"
      :wrapper-class="'shadow-tabs inline-tabs align-self-center'"
      :tab-class="'tab-item'"
      :tab-active-class="'tab-item-active'"
      :line-class="'tab-item-line'"
      @onClick="handleClick"
    />
    <div>
      <ScheduledCalls
        :source="source"
        v-if="currentTab == 'scheduled'"
        :call_logs="scheduled_call_logs"
        :loading="initval"
        :search="search"
        @edit-call="editCallLog"
        @mark-complete="markComplete"
        @delete-call="deleteCallLog"
        :key="componentKey"
      ></ScheduledCalls>
      <CompletedCalls
        :source="source"
        v-if="currentTab == 'completed'"
        :call_logs="completed_call_logs"
        :loading="initval"
        :search="search"
        @edit-call="editCallLog"
        @delete-call="deleteCallLog"
      ></CompletedCalls>
    </div>
    <div v-if="show_log_amend">
      <CallLogsAmend
        :source="source"
        :lead_id="lead_id"
        :selected_tab="currentTab"
        :show_log_amend="show_log_amend"
        :selected_mark_complete="selected_mark_complete"
        @close-dialog="closeCallLogsAmend"
        :selected_log="selected_log"
        @update-meeting="updateData"
      />
    </div>

    <ConfirmDialog
      :show="showdeleteDialog"
      :cancel="canceldelete"
      :confirm="confirmdelete"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('want_to_delete_call_log')"
    />
    <ConfirmDialog
      :show="showStatusDialog"
      :cancel="cancelStatus"
      :confirm="confirmStatus"
      :id="status_id"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('status_change')"
    />
  </div>
</template>
    
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import CallLogsAmend from "../Leads/CallLogsAmend.vue";
import CompletedCalls from "./CompletedCalls.vue";
import ScheduledCalls from "./ScheduledCalls.vue";
import Tabs from "vue-tabs-with-active-line";

const TABS = [
  {
    title: "Scheduled Calls",
    value: "scheduled",
  },
  {
    title: "Completed Calls",
    value: "completed",
  },
];

export default {
  components: {
    PageTitle,
    ConfirmDialog,
    CallLogsAmend,
    CompletedCalls,
    ScheduledCalls,
    Tabs,
  },
  data: () => ({
    tabs: TABS,
    currentTab: "scheduled",
    user: [],
    user_id: "",
    componentKey:0,
    completed_call_logs: [],
    scheduled_call_logs: [],
    showdeleteDialog: false,
    initval: false,
    delete_id: null,
    google_icon: {
      icon_name: "call_log",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
    show_log_amend: false,
    selected_log: null,
    showStatusDialog: false,
    status_id: null,
    selected_mark_complete:null
  }),
  props: ["lead_id", "add_call_log", "source", "search_input"],
  watch: {
    lead_id: {
      immediate: true,
      handler() {
        if (this.lead_id) {
          this.loader = true;
          this.fetchLeadCallLogs();
        }
      },
    },
    add_call_log: {
      immediate: true,
      handler() {
        if (this.add_call_log == true) {
          this.addLogs();
        }
      },
    },
    search_input: {
      immediate: true,
      handler() {
        if (this.search_input) {
          this.search = this.search_input;
        }
      },
    },
  },
  mounted() {
    if (this.lead_id === null) {
      this.fetchLeadCallLogs();
    }
  },
  methods: {
    handleClick(newTab) {
      this.currentTab = newTab;
    },
    cancelStatus() {
      this.showStatusDialog = false;
    },
    confirmStatus() {
      this.statusUpdate();
      this.showStatusDialog = false;
    },
    updateMeetingStatus(id) {
      this.status_id = id;
      this.showStatusDialog = true;
    },
    addLogs() {
      this.selected_log = null;
      this.show_log_amend = true;
    },
    editCallLog(id) {
      this.initval = true;
      this.selected_log = id;
      this.selected_mark_complete = null;
      setTimeout(() => {
        this.show_log_amend = true;
        this.initval = false;
      }, 500);
    },
    markComplete(id){
      this.initval = true;
      this.selected_mark_complete = id;
      setTimeout(() => {
        this.show_log_amend = true;
        this.initval = false;
      }, 500);
    },
    canceldelete() {
      this.showdeleteDialog = false;
    },
    confirmdelete() {
      this.confirmDeleteCallLog();
      this.showdeleteDialog = false;
    },
    updateData() {
      this.fetchLeadCallLogs();
      this.$emit("update-timeline");
      this.componentKey += 1;
    },

    fetchLeadCallLogs() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "lead_call_log", {
          params: {
            lead_id: this.lead_id,
          },
        })
        .then((res) => {
          this.completed_call_logs = res.data.completed_call_logs;
          this.scheduled_call_logs = res.data.scheduled_call_logs;
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

    deleteCallLog(id) {
      this.delete_id = id;
      this.showdeleteDialog = true;
    },

    closeCallLogsAmend() {
      this.show_log_amend = false;
      this.$emit("reset-data");
      this.updateData();
    },

    confirmDeleteCallLog() {
      this.initval = true;
      axios
        .delete(
          process.env.VUE_APP_API_URL_ADMIN + "lead_call_log/" + this.delete_id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.flashMessage.success({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.initval = false;
            this.fetchLeadCallLogs();
            this.$emit("update-timeline");
          } else {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.initval = false;
            this.fetchLeadCallLogs();
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