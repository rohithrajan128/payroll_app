<template>
  <div>
    <div v-if="source == 'Lead'">
    <v-data-table
      :headers="headers"
      :items="lead_followups_array"
      :loading="initval"
      :search="search"
      :single-expand="singleExpand"
      item-key="id"
    >
    
      <template v-slot:item="{ item, expand, isExpanded }">
        <tr>
          <td v-if="source != 'Lead'" style="color:#1976d2" >
            <span class="redirect_to" @click="redirectTo(item)" v-if="item.link_to == 'Lead'">{{ item.lead_name }}</span>
            <span class="redirect_to" @click="redirectTo(item)" v-if="item.link_to == 'Candidate'">{{ item.candidate_data.name }}</span>
            <span class="redirect_to" @click="redirectTo(item)" v-if="item.link_to == 'Connect'">{{ item.connect_data.business_name }}</span>
          </td>
          <td v-if="source != 'Lead'">
            <span v-if="item.link_to == 'Lead'">+{{ item.lead_details.primary_contact.phone_code }}-{{item.lead_details.primary_contact.contact_phone}}</span>
            <span v-if="item.link_to == 'Candidate'">+{{ item.candidate_data.country_code }}-{{item.candidate_data.mobile}}</span>
            <span v-if="item.link_to == 'Connect'">+{{ item.connect_data.contact_number_code }}-{{item.connect_data.contact_number}}</span>
          </td>
          <td v-if="source != 'Lead'">{{ item.link_to }}</span>
          </td>
          <td>{{ item.followup_date | formatDate }}</td>
          <td>{{ item.followup_time }}</td>
          <td>
            <v-select
              :disabled="item.completion_status == 'completed'"
              :class="[item.completion_status == 'completed'?'complete-status':'schedule-status']"
              @change="markComplete(item)"
              class="pt-1 change-status"
              style="width:140px;"
              v-model="item.completion_status"
              :items="markcomplete_array"
              item-text="longname"
              item-value="shortname"
              solo
              dense
            ></v-select>
          </td>
          <td class="text-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  @click="editFollowup(item.id)"
                  class="mr-2 edit_btn icon_size"
                  v-on="on"
                  >mdi-pencil-outline</v-icon
                >
              </template>
              <span>{{ $t("edit") }}</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  class="mr-2 edit_btn icon_size"
                  @click="deleteFollowup(item.id)"
                  color="error"
                  v-on="on"
                  >mdi-trash-can-outline</v-icon
                >
              </template>
              <span>{{ $t("delete") }}</span>
            </v-tooltip>
          </td>
          <td @click="expand(!isExpanded)">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn icon v-if="isExpanded == false" v-on="on">
                  <v-icon>mdi-arrow-down-drop-circle-outline</v-icon>
                </v-btn>
                <v-btn icon v-else>
                  <v-icon>mdi-arrow-up-drop-circle-outline</v-icon>
                </v-btn>
              </template>
              <span>{{ $t("add_details") }}</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <tr>
          <td :colspan="headers.length + 1" class="p-0">
            <div v-if="item.comments" class="px-5 py-2">
              <div class="h6 b pa-0 ma-0">{{ $t("comments") }} :</div>
              &nbsp;
              <div style="text-align: justify; margin-top: -15px">
                {{ item.comments }}
              </div>
            </div>
            <div class="row px-3" v-else>
              <div class="col-md-12 text-center h6 b">
                {{ $t("no_comments") }}
              </div>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
    </div>
    <div v-else>
      <Tabs
        style="background:white"
        :tabs="tabs"
        :currentTab="currentTab"
        :wrapper-class="'shadow-tabs inline-tabs align-self-center'"
        :tab-class="'tab-item'"
        :tab-active-class="'tab-item-active'"
        :line-class="'tab-item-line'"
        @onClick="handleClick"
      />
       <v-data-table
      :headers="headers"
      :items="filtered_array"
      :loading="initval"
      :search="search"
      :single-expand="singleExpand"
      item-key="id"
    >
    
      <template v-slot:item="{ item, expand, isExpanded }">
        <tr>
          <td v-if="source != 'Lead'" style="color:#1976d2" >
            <span class="redirect_to" @click="redirectTo(item)" v-if="item.link_to == 'Lead'">{{ item.lead_name }}</span>
            <span class="redirect_to" @click="redirectTo(item)" v-if="item.link_to == 'Candidate'">{{ item.candidate_data.name }}</span>
            <span class="redirect_to" @click="redirectTo(item)" v-if="item.link_to == 'Connect'">{{ item.connect_data.business_name }}</span>
          </td>
          <td v-if="source != 'Lead'">
            <span v-if="item.link_to == 'Lead'">+{{ item.lead_details.primary_contact.phone_code }}-{{item.lead_details.primary_contact.contact_phone}}</span>
            <span v-if="item.link_to == 'Candidate'">+{{ item.candidate_data.country_code }}-{{item.candidate_data.mobile}}</span>
            <span v-if="item.link_to == 'Connect'">+{{ item.connect_data.contact_number_code }}-{{item.connect_data.contact_number}}</span>
          </td>
          <td v-if="source != 'Lead'">{{ item.link_to }}</span>
          </td>
          <td>{{ item.followup_date | formatDate }}</td>
          <td>{{ item.followup_time }}</td>
          <td>
            <v-select
              :disabled="item.completion_status == 'completed'"
              :class="[item.completion_status == 'completed'?'complete-status':'schedule-status']"
              @change="markComplete(item)"
              class="pt-1 change-status"
              style="width:140px;"
              v-model="item.completion_status"
              :items="markcomplete_array"
              item-text="longname"
              item-value="shortname"
              solo
              dense
            ></v-select>
          </td>
          <td class="text-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  @click="editFollowup(item.id)"
                  class="mr-2 edit_btn icon_size"
                  v-on="on"
                  >mdi-pencil-outline</v-icon
                >
              </template>
              <span>{{ $t("edit") }}</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  class="mr-2 edit_btn icon_size"
                  @click="deleteFollowup(item.id)"
                  color="error"
                  v-on="on"
                  >mdi-trash-can-outline</v-icon
                >
              </template>
              <span>{{ $t("delete") }}</span>
            </v-tooltip>
          </td>
          <td @click="expand(!isExpanded)">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn icon v-if="isExpanded == false" v-on="on">
                  <v-icon>mdi-arrow-down-drop-circle-outline</v-icon>
                </v-btn>
                <v-btn icon v-else>
                  <v-icon>mdi-arrow-up-drop-circle-outline</v-icon>
                </v-btn>
              </template>
              <span>{{ $t("add_details") }}</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <tr>
          <td :colspan="headers.length + 1" class="p-0">
            <div v-if="item.comments" class="px-5 py-2">
              <div class="h6 b pa-0 ma-0">{{ $t("comments") }} :</div>
              &nbsp;
              <div style="text-align: justify; margin-top: -15px">
                {{ item.comments }}
              </div>
            </div>
            <div class="row px-3" v-else>
              <div class="col-md-12 text-center h6 b">
                {{ $t("no_comments") }}
              </div>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
    </div>

    <v-dialog persistent v-model="show_markup_dialog" max-width="500" small>
      <v-card class="container pb-3" style="padding: 0px !important">
        <v-toolbar color="primary" dark>
          <span class="headline">{{ $t("mark_complete") }}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                @click="closeMarkupDialog()"
                class="dialogcloseinuserdetails"
                v-on="on"
                >mdi-close</v-icon
              >
            </template>
            <span>{{ $t("close") }}</span>
          </v-tooltip>
        </v-toolbar>

        <div class="row px-4 ma-0">
          <div class="col-md-12">
            <div class="mb-2">{{ $t("mark_complete_msg") }}</div>
            <v-textarea
              v-model="completion_comment"
              v-bind:label="$t('comment')"
              class="required_field"
              outlined
              counter="2000"
              maxlength="2000"
              rows="5"
              dense
            ></v-textarea>
          </div>
        </div>
        <div
          class="d-flex justify-content-end pb-3 pr-4"
        >
          <v-btn
            :disabled="isMarkupLoading || completion_comment == ''"
            @click="submitMarkComplete()"
            small
            class="mr-2 success hover_shine"
            color="green darken-1"
          >
            {{ $t("submit") }}
            <b-spinner small v-if="isMarkupLoading"></b-spinner>
          </v-btn>
        </div>
        <div></div>
      </v-card>
    </v-dialog>

    <div v-if="show_followup_amend">
      <FollowupAmend
        :source="source"
        :lead_id="lead_id"
        :show_followup_amend="show_followup_amend"
        @close-dialog="closeFollowupAmend"
        :selected_followup="selected_followup"
        @update-followups="updateData"
      />
    </div>
    <ConfirmDialog
      :show="showdeleteDialog"
      :cancel="canceldelete"
      :confirm="confirmdelete"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('want_to_delete_followup')"
    />
  </div>
</template>

<script>
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import FollowupAmend from "./FollowupAmend.vue";
import Tabs from "vue-tabs-with-active-line";

const TABS = [
  {
    title: "Scheduled",
    value: "scheduled",
  },
  {
    title: "Completed",
    value: "completed",
  },
];
export default {
  components: {
    ConfirmDialog,
    FollowupAmend,
    Tabs,
  },
  data: () => ({
    currentTab: "scheduled",
    tabs: TABS,
    user: [],
    user_id: "",
    singleExpand: false,
    time: null,
    view_array: [],
    completed_followup: [],
    scheduled_followup: [],
    lead_followups_array: [],
    showdeleteDialog: false,
    initval: false,
    delete_id: null,
    google_icon: {
      icon_name: "diversity_3",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    show_followup_amend: false,
    selected_followup: null,
    sel_markup_id: null,
    show_markup_dialog: false,
    completion_comment: "",
    current_completion_status: "",
    isMarkupLoading: false,
    filtered_array: [],
    markcomplete_array: [
      {
        id: 1,
        shortname: "scheduled",
        longname: "Scheduled",
      },
      {
        id: 2,
        shortname: "completed",
        longname: "Completed",
      },
    ],
  }),
  props: ["lead_id", "add_followup", "search", "source"],

  watch: {
    lead_id: {
      immediate: true,
      handler() {
        if (this.lead_id) {
          this.loader = true;
          this.fetchLeadFollowups();
        }
      },
    },
    add_followup: {
      immediate: true,
      handler() {
        if (this.add_followup == true) {
          this.addFollowup();
        }
      },
    },
  },
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    headers() {
      if (this.source == "Lead") {
        return [
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
            text: "Status",
            align: "center",
            value: "completion_status",
            width: "180px",
          },
          {
            text: "Actions",
            value: "",
            sortable: false,
            align: "center",
          },
          {
            text: "",
            value: "",
            sortable: false,
            align: "center",
          },
        ];
      } else {
        return [
          {
            text: "Name",
            align: "left",
            value: "lead_name",
            width: "200px",
          },
          {
            text: "Contact",
            align: "left",
            value: "contact",
          },
          {
            text: "Linked To",
            align: "left",
            value: "link_to",
          },
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
            text: "Status",
            align: "center",
            value: "completion_status",
          },
          {
            text: "Actions",
            value: "",
            sortable: false,
            align: "center",
          },
          {
            text: "",
            value: "",
            sortable: false,
            align: "center",
          },
        ];
      }
    },
  },
  mounted() {
    if (this.lead_id === null) {
      this.fetchLeadFollowups();
    }
  },
  methods: {
    handleClick(newTab) {
      this.currentTab = newTab;
      if (this.currentTab == "scheduled") {
        this.filtered_array = this.scheduled_followup;
      } else {
        this.filtered_array = this.completed_followup;
      }
    },
    redirectTo(item) {
      if (item.link_to == "Candidate") {
        this.$router.push({
          name: "candidate_recruitment_view",
          query: {
            slug: item.candidate_data.slug,
          },
        });
      } else if (item.link_to == "Lead") {
        this.$router.push({
          name: "lead_view",
          query: {
            id: item.lead_details.id,
          },
        });
      } else if (item.link_to == "Connect") {
        this.$router.push({
          name: "candidate_connect_view",
          query: {
            id: item.connect_data.id,
          },
        });
      }
    },
    submitMarkComplete() {
      this.isMarkupLoading = true;
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "mark_followup_complete", {
          followup_id: this.sel_markup_id,
          completion_comment: this.completion_comment,
        })
        .then((res) => {
          this.flashMessage.success({
            message: res.data.message,
            time: 4000,
            blockClass: "custom-block-class",
          });
          this.isMarkupLoading = false;
          this.closeMarkupDialog();
          this.updateData();
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
          this.isMarkupLoading = false;
        });
    },
    closeMarkupDialog() {
      this.show_markup_dialog = false;
      this.completion_comment = "";
      this.fetchLeadFollowups();
    },
    markComplete(item) {
      this.show_markup_dialog = true;
      if (item.completion_comment) {
        this.completion_comment = item.completion_comment;
      }

      this.current_completion_status = item.completion_status;
      this.sel_markup_id = item.id;
    },
    addFollowup() {
      this.selected_followup = null;
      this.show_followup_amend = true;
    },
    editFollowup(id) {
      this.initval = true;
      this.selected_followup = id;
      setTimeout(() => {
        this.show_followup_amend = true;
        this.initval = false;
      }, 500);
    },
    canceldelete() {
      this.showdeleteDialog = false;
    },
    confirmdelete() {
      this.confirmDeleteFollowup();
      this.showdeleteDialog = false;
    },
    updateData() {
      this.fetchLeadFollowups();
      this.$emit("update-timeline");
    },

    fetchLeadFollowups() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "leadsfollowup", {
          params: {
            lead_id: this.lead_id,
          },
        })
        .then((res) => {
          this.lead_followups_array = res.data.lead_followups;
          let sh_array = [];
          let cp_array = [];
          this.lead_followups_array.map((ele) => {
            if (ele.completion_status == "scheduled") {
              sh_array.push(ele);
            } else {
              cp_array.push(ele);
            }
            this.scheduled_followup = sh_array;
            this.completed_followup = cp_array;
            if (this.source != "Lead") {
              this.filtered_array = this.scheduled_followup;
            }
          });
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

    deleteFollowup(id) {
      this.delete_id = id;
      this.showdeleteDialog = true;
    },

    closeFollowupAmend() {
      this.show_followup_amend = false;
      this.$emit("reset-data");
    },

    confirmDeleteFollowup() {
      this.initval = true;
      axios
        .delete(
          process.env.VUE_APP_API_URL_ADMIN + "leadsfollowup/" + this.delete_id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.flashMessage.success({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.initval = false;
            this.fetchLeadFollowups();
            this.$emit("update-timeline");
          } else {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.initval = false;
            this.fetchLeadFollowups();
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
.title_heading {
  font-weight: bold;
}
.complete-status >>> .v-input__slot {
  border: 1px solid green;
  background: rgb(250, 255, 250) !important;
}
.schedule-status >>> .v-input__slot {
  border: 1px solid orange;
  background: rgb(255, 251, 240) !important;
}
.redirect_to:hover {
  cursor: pointer;
  font-weight: bold;
}
</style>