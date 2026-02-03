<template>
  <div>
    <!--------------------------------- lead header start --------------------------------->
    <v-card class="pa-3 mb-1 lead-header" elevation="0" :class="{ 'lead-header-scroll': isScrolled }">
      <div class="row">
        <div class="col-md-5 row">
          <div class="col-md-2">
            <div style="position: relative">
              <v-avatar size="65" class="text-center mtb-20">
                <v-img v-if="basicDetails.logo != null" :src="envImagePath + basicDetails.logo" alt></v-img>
                <img v-else width="42" class="rounded-circle" src="@/assets/images/noimage.png" alt />
                <div class="camera-icon">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon style="font-size: 18px; margin-bottom: 10px" @click="upload_Image" color="grey lighten-1">
                          mdi-camera
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t("add_logo") }}</span>
                  </v-tooltip>
                </div>
              </v-avatar>
            </div>
          </div>
          <div class="col-md-10 pl-3">
            <div>
              <div v-if="basicDetails.name">
                <span style="font-weight: bold; font-size: 16px">{{
                  basicDetails.name
                }}</span>
              </div>
            </div>
            <div v-if="basicDetails.email" class="d-flex">
              <div class="mr-1">
                <v-icon style="font-size: 18px; color: #0eb0ff">mdi-gmail</v-icon>
              </div>
              <div class="w-90">{{ basicDetails.email }}</div>
            </div>
          </div>
        </div>

        <div class="col-md-3 d-flex">
          <div class="pt-2">
            <img width="40" src="@/assets/icons/primary_contacts.png" />
          </div>
          <div class="pl-2">
            <div>
              <strong>{{ $t("primary_contact") }}</strong>
            </div>
            <div v-if="basicDetails.primary_contact">
              {{ basicDetails.primary_contact.salutation }}&nbsp;{{
                basicDetails.primary_contact.contact_name
              }}
              <div style="font-size: 12px">
                +{{ basicDetails.primary_contact.phone_code }}-{{
                  basicDetails.primary_contact.contact_phone
                }}
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 d-flex">
          <div class="d-flex" style="margin-left: -34px">
            <div>
              <v-avatar v-if="basicDetails.fetchleadowner">
                <img v-if="basicDetails.fetchleadowner.profile_pic"
                  :src="envImagePath + basicDetails.fetchleadowner.profile_pic" />
                <img v-else src="@/assets/images/default-user-profile-picture.png" />
              </v-avatar>
            </div>
            <div class="ml-1">
              <div>
                <strong> {{ $t("lead_owner") }}</strong>
              </div>
              <div v-if="basicDetails.fetchleadowner">
                {{ basicDetails.fetchleadowner.full_name }}
                <div style="font-size: 12px">
                  ({{ basicDetails.fetchleadowner.empno }})
                </div>
              </div>
            </div>
          </div>
          <div style="position: absolute; right: 0px" class="pt-1">
            <!-- open-on-hover -->
            <v-menu bottom offset-y transition="scale-transition">
              <template v-slot:activator="{ on }">
                <v-avatar size="50" v-on="on" style="outline: 1px solid black">
                  <img class="cat_logo" v-if="basicDetails.lead_type == 'Hot Lead'"
                    src="@/assets/icons/lead-category/hot_lead.png" />
                  <img class="cat_logo" v-if="basicDetails.lead_type == 'Cold Lead'"
                    src="@/assets/icons/lead-category/cold_lead.png" />
                  <img class="cat_logo" v-if="basicDetails.lead_type == 'Warm Lead'"
                    src="@/assets/icons/lead-category/warm_lead.png" />
                  <img class="cat_logo" style="width: 35px; height: 35px" v-if="basicDetails.lead_type ==
                    'Information Qualified Lead (IQL)'
                    " src="@/assets/icons/lead-category/iql_lead.png" />
                </v-avatar>
              </template>
              <v-list>
                <v-list-item v-for="(category, i) in lead_categories" :key="i"
                  @click="confirmCategoryChange(category.longname)" v-bind:class="[
                    category.longname == basicDetails.lead_type
                      ? 'sel-cat'
                      : '',
                  ]">
                  <div v-if="category.shortname == 'Cold'">
                    <img width="40" src="@/assets/icons/lead-category/cold_lead.png" /><span class="lead-cat">{{
                      category.longname }}</span>
                  </div>
                  <div v-if="category.shortname == 'Hot'">
                    <img width="40" src="@/assets/icons/lead-category/hot_lead.png" /><span class="lead-cat">{{
                      category.longname }}</span>
                  </div>
                  <div v-if="category.shortname == 'IQL'" class="d-flex">
                    <div>
                      <img width="30" class="ml-2" src="@/assets/icons/lead-category/iql_lead.png" />
                    </div>
                    <div style="padding-left: 12px">
                      <span style="font-size: 16px">{{
                        category.longname
                      }}</span>
                    </div>
                  </div>
                  <div v-if="category.shortname == 'Warm'">
                    <img width="40" src="@/assets/icons/lead-category/warm_lead.png" /><span class="lead-cat">{{
                      category.longname }}</span>
                  </div>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
        <div class="col-md-1" style="
            display: flex;
            justify-content: end;
            position: relative;
            left: 30px;
          ">
          <!-- open-on-hover -->
          <v-menu bottom offset-y transition="scale-transition">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" small color="primary" class="ma-1 font-weight-bold"
                style="position: absolute; top: 48px; right: 20px; width: 60px"><v-icon>mdi-plus</v-icon></v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(menu, i) in multi_menu" :key="i" @click="redirectMenu(menu.url)">
                <v-list-item-title>
                  <span style="position: relative; top: 4px"><i class="material-symbols-outlined"><span
                        style="font-size: 18px" class="mt-3">{{
                          menu.icon
                        }}</span></i></span>
                  <span class="pl-2">{{ menu.name }}</span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <!-- <v-tooltip left>
            <template v-slot:activator="{ on }"> -->
          <div class="d-inline-block mr-2 text-right">
            <v-btn small @click="$router.go(-1)" class="ma-1 font-weight-bold cancel-btn" color="dark cancel_button">{{
              $t("back") }}</v-btn>
          </div>
          <!-- </template>
            <span>{{ $t("back") }}</span>
          </v-tooltip> -->
        </div>
      </div>
    </v-card>
    <!------------------------------ lead header end  --------------------------------->
    <div class="container-fluid p-0">
      <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
      <div class="row">
        <div class="col-md-9 pr-2">
          <v-card class="mb-3 h-100">
            <div>
              <Tabs :tabs="tabs" :currentTab="currentTab" :wrapper-class="'shadow-tabs inline-tabs align-self-center'"
                :tab-class="'tab-item'" :tab-active-class="'tab-item-active'" :line-class="'tab-item-line'"
                @onClick="handleClick" />
              <div class="action-btn d-flex">
                <v-menu>
                  <template v-slot:activator="{ on: menu, attrs }">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-chip class="mt-1" pill v-bind="attrs" v-on="{ ...tooltip, ...menu }" small
                          :color="basicDetails.status_color" style="color:white">
                          {{ basicDetails.lead_status }}
                          <v-icon right>
                            mdi-menu-down
                          </v-icon>
                        </v-chip>
                      </template>
                      <span>{{ $t('lead_status') }}</span>
                    </v-tooltip>
                  </template>
                  <v-list class="c-drop-menu">
                    <v-list-item v-for="(item, index) in leadstatus_array" :key="index">
                      <v-list-item-title @click="confirmLeadStatus(item.shortname)" style="cursor: pointer;">
                        {{ item.longname }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <div class="w-20 text-end">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon medium v-on="on" color="primary" dark @click="editLead()" class="vicon_llink"
                        style="font-size: 30px">mdi-pencil-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("edit_lead") }}</span>
                  </v-tooltip>
                </div>
              </div>
            </div>
            <div>
              <div v-if="currentTab == 'about'">
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-8">
                      <div>
                        <strong>{{ $t("address") }}</strong>
                      </div>
                      <div>
                        <div v-if="basicDetails.address">
                          {{ basicDetails.address
                          }}<span v-if="basicDetails.fetchcity">, {{ basicDetails.fetchcity.name }}</span>
                          <span v-if="basicDetails.fetchstate">, {{ basicDetails.fetchstate.name }}</span>
                          <span v-if="basicDetails.fetchcountry">, {{ basicDetails.fetchcountry.name }}</span>
                        </div>
                        <div v-else>{{ $t("empty_field") }}</div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div>
                        <strong>{{ $t("region") }}</strong>
                      </div>
                      <div>
                        <div v-if="basicDetails.region">
                          {{ basicDetails.region }}
                        </div>
                        <div v-else>{{ $t("empty_field") }}</div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div>
                        <strong>{{ $t("annual_revenue") }}</strong>
                      </div>

                      <div v-if="basicDetails.currency">
                        <span v-if="basicDetails.currency_type">{{
                          basicDetails.fetchcurrency.shortname
                        }}</span>
                        {{ basicDetails.currency }}
                      </div>
                      <div v-else>{{ $t("empty_field") }}</div>
                    </div>
                    <div class="col-md-4">
                      <div>
                        <strong>{{ $t("company_size") }}</strong>
                      </div>

                      <div v-if="basicDetails.company_size">
                        {{ basicDetails.company_size }}
                      </div>
                      <div v-else>{{ $t("empty_field") }}</div>
                    </div>
                    <div class="col-md-4">
                      <div>
                        <strong>{{ $t("deal_size") }}</strong>
                      </div>

                      <div v-if="basicDetails.deal_size">
                        {{ basicDetails.deal_size }}
                      </div>
                      <div v-else>{{ $t("empty_field") }}</div>
                    </div>
                    <div class="col-md-4">
                      <div>
                        <strong>{{ $t("lead_source") }}</strong>
                      </div>

                      <div v-if="basicDetails.lead_source">
                        {{ basicDetails.lead_source }}
                      </div>
                      <div v-else>{{ $t("empty_field") }}</div>
                    </div>
                    <div class="col-md-4">
                      <div>
                        <strong>{{ $t("industry_type") }} </strong>
                      </div>

                      <div v-if="basicDetails.industry_type">
                        {{ basicDetails.industry_type }}
                      </div>
                      <div v-else>{{ $t("empty_field") }}</div>
                    </div>
                    <div class="col-md-4">
                      <div>
                        <strong>{{ $t("service_type") }} </strong>
                      </div>

                      <div v-if="basicDetails.service_type">
                        {{ basicDetails.service_type }}
                      </div>
                      <div v-else>{{ $t("empty_field") }}</div>
                    </div>
                    <div class="col-md-12 mt-3">
                      <v-divider></v-divider>
                      <strong> {{ $t("lead_requirement") }}</strong>
                      <div v-if="basicDetails.requirement">
                        <span v-html="basicDetails.requirement"></span>
                      </div>
                      <div v-else>{{ $t("empty_field") }}</div>
                    </div>
                    <div class="col-md-12">
                      <v-divider></v-divider>
                      <strong> {{ $t("about_company") }}</strong>
                      <div v-if="basicDetails.description">
                        <span v-html="basicDetails.description"></span>
                      </div>
                      <div v-else>{{ $t("empty_field") }}</div>
                    </div>
                    <div class="col-md-12" v-if="basicDetails.linkedin ||
                      basicDetails.skype ||
                      basicDetails.facebook ||
                      basicDetails.twitter
                      ">
                      <v-divider></v-divider>
                      <strong>Social Media Links</strong>
                    </div>
                    <div class="col-md-12 pt-0" v-if="basicDetails.linkedin">
                      <div class="d-flex">
                        <div class="pr-2">
                          <v-img width="20" src="@/assets/icons/social-media/linkedin.svg"></v-img>
                        </div>
                        <!-- <strong>{{ $t("linkedin") }}</strong> -->
                        <a class="social-links" :href="basicDetails.linkedin" target="_tab">{{ basicDetails.linkedin
                        }}</a>
                      </div>
                    </div>
                    <div class="col-md-12 pt-0" v-if="basicDetails.skype">
                      <div class="d-flex">
                        <div class="pr-2">
                          <v-img width="20" src="@/assets/icons/social-media/skype.svg"></v-img>
                        </div>
                        <!-- <strong>{{ $t("skype") }}</strong> -->
                        <a class="social-links" :href="basicDetails.skype" target="_tab">{{ basicDetails.skype }}</a>
                      </div>
                    </div>
                    <div class="col-md-12 pt-0" v-if="basicDetails.facebook">
                      <div class="d-flex">
                        <div class="pr-2">
                          <v-img width="20" src="@/assets/icons/social-media/facebook.svg"></v-img>
                        </div>
                        <!-- <strong>{{ $t("facebook") }}</strong> -->
                        <a class="social-links" :href="basicDetails.facebook" target="_tab">{{ basicDetails.facebook
                        }}</a>
                      </div>
                    </div>
                    <div class="col-md-12 pt-0" v-if="basicDetails.twitter">
                      <div class="d-flex">
                        <div class="pr-2">
                          <v-img width="20" src="@/assets/icons/social-media/twitter.svg"></v-img>
                        </div>
                        <!-- <strong>{{ $t("twitter") }}</strong> -->
                        <a class="social-links" :href="basicDetails.twitter" target="_tab">{{ basicDetails.twitter }}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="currentTab == 'contact_leads'">
                <ContactIndex :lead_parent_id="$route.query.id" :add_contacts="add_contacts"
                  @update-timeline="fetchTimeline" @update-basic-details="fetchleadsbasicdetails" />
              </div>
              <div v-if="currentTab == 'leads_tasks'">
                <TasksDetails :lead_id="basicDetails.id" :add_followup="add_followups" :add_meeting="add_meeting"
                  @update-timeline="fetchTimeline" />
              </div>
              <div v-if="currentTab == 'lead_documents'">
                <LeadDocument :lead_parent_id="$route.query.id" :add_documents="add_documents"
                  @update-timeline="fetchTimeline" />
              </div>
              <div v-if="currentTab == 'call_logs'">
                <CallLogsReport source="Lead" :lead_id="basicDetails.id" @refresh="refresh" :add_call_log="add_call_log"
                  @update-timeline="fetchTimeline" />
              </div>
              <div v-if="currentTab == 'notes'">
                <LeadNotes :lead_id="basicDetails.id" @refresh="refresh" :refresh_value="refresh_value"
                  :add_notes="add_notes" @update-timeline="fetchTimeline" />
              </div>
            </div>
          </v-card>
        </div>
        <div class="col-md-3 pl-0">
          <v-card style="height: 76vh; position: sticky; top: 148px">
            <div class="px-2 py-4" style="font-weight: bold; font-size: 18px">
              <v-icon class="mr-2">mdi-timeline-text-outline</v-icon>Timeline
            </div>
            <v-divider class="mt-0"></v-divider>
            <VuePerfectScrollbar style="height: 80%">
              <div>
                <div v-if="timeline_array.length > 0">
                  <v-timeline align-top dense style="margin-left: -20px">
                    <div v-for="(timeline, index) in timeline_array" :key="index">
                      <v-timeline-item color="teal lighten-3" small class="align-items-baseline timeline1 mt-3 pr-4">
                        <v-card class="p-2">
                          <span v-if="timeline.type == 'create_lead'">{{ $t("lead") }} '{{ timeline.lead_data.name }}'
                            {{ $t("created") }}</span>
                          <span v-else>
                            {{ timeline.description }}
                          </span>
                          <div class="mt-1">
                            <span style="
                                color: #6f6f6f;
                                font-style: italic;
                                font-size: 11px;
                              ">
                              {{ timeline.full_code }},
                              {{ timeline.created_at | formatDateTime }}
                            </span>
                          </div>
                        </v-card>
                      </v-timeline-item>
                    </div>
                  </v-timeline>
                </div>
                <div v-else class="nill-data py-3">No data found</div>
              </div>
            </VuePerfectScrollbar>
          </v-card>
        </div>
      </div>

      <div>
        <v-dialog persistent v-model="more_details" max-width="800px">
          <v-card>
            <v-toolbar color="primary" dark>
              <span class="headline">{{ $t("about_company") }}</span>
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon @click="more_details = false" class="dialogcloseinuserdetails" v-on="on">mdi-close</v-icon>
                </template>
                <span>{{ $t("close") }}</span>
              </v-tooltip>
            </v-toolbar>
            <v-card-text class="pt-2">
              {{ basicDetails.description }}
            </v-card-text>
          </v-card>
        </v-dialog>

        <ConfirmDialog :show="showStatusDialog" :cancel="cancelStatus" :confirm="confirmStatus" :id="status_id"
          v-bind:title="$t('confirm')" v-bind:description="$t('status_change')" />
      </div>
    </div>
    <div class="scroll-top-btn" v-show="scroll_top == true">
      <v-btn class="mx-2" fab dark small color="primary" @click="scrollTop()">
        <v-icon dark> mdi-chevron-up </v-icon>
      </v-btn>
    </div>
    <MediaSelect style="display: none" :label="'Image'" folder="lead_logo" :image="basicDetails.logo" :resizeheight="100"
      :resizewidth="100" @updateImage="updateImage" :upload_profile="openMedia">
    </MediaSelect>
    <ConfirmDialog :show="showConfirmDialog" :cancel="cancelCategoryUpdate" :confirm="confirmCategoryUpdate"
      :id="status_id" v-bind:title="$t('confirm')" v-bind:description="$t('category_change')" />
  </div>
</template>
  
<script>
import VueElementLoading from "vue-element-loading";
import TasksDetails from "./TasksDetails.vue";
import Tabs from "vue-tabs-with-active-line";
import ContactIndex from "../Leads/ContactIndex.vue";
import LeadDocument from "../Leads/LeadDocument.vue";
import MeetingReport from "./MeetingReport.vue";
import CallLogsReport from "./CallLogsReport.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import LeadNotes from "../Leads/LeadNotes.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import MediaSelect from "../Components/Upload/MediaSelect.vue";

const TABS = [
  {
    title: "About",
    value: "about",
  },
  {
    title: "Contacts",
    value: "contact_leads",
  },
  {
    title: "Tasks",
    value: "leads_tasks",
  },
  {
    title: "Documents",
    value: "lead_documents",
  },

  // {
  //   title: "Meetings",
  //   value: "meetings",
  // },
  {
    title: "Call Logs",
    value: "call_logs",
  },
  {
    title: "Notes",
    value: "notes",
  },
];
export default {
  components: {
    VueElementLoading,
    Tabs,
    TasksDetails,
    ContactIndex,
    LeadDocument,
    ConfirmDialog,
    LeadNotes,
    VuePerfectScrollbar,
    MediaSelect,
    MeetingReport,
    CallLogsReport,
  },
  data: () => ({
    tabs: TABS,
    currentTab: "about",
    loader: false,
    more_details: false,
    showStatusDialog: false,
    status_id: null,
    basicDetails: [],
    refresh_value: 1,
    isScrolled: false,
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    multi_menu: [
      // {
      //   id: 1,
      //   name: "Leads",
      //   url: "leads",
      // },
      {
        id: 1,
        name: "Contacts",
        url: "contacts",
        icon: "supervisor_account",
      },
      {
        id: 2,
        name: "Followup",
        url: "followups",
        icon: "diversity_3",
      },
      {
        id: 3,
        name: "Schedule a Meeting",
        url: "schedule_meeting",
        icon: "schedule",
      },
      {
        id: 4,
        name: "Documents",
        url: "documents",
        icon: "folder_open",
      },
      {
        id: 5,
        name: "Notes",
        url: "notes",
        icon: "edit_square",
      },

      {
        id: 6,
        name: "Call Logs",
        url: "call_logs",
        icon: "call_log",
      },
      // {
      //   id: 4,
      //   name: "About",
      //   url: "about",
      // },
    ],
    add_contacts: false,
    add_followups: false,
    add_documents: false,
    add_notes: false,
    add_meeting: false,
    add_call_log: false,
    leadstatus_array: [],
    leadstatus: "",
    scroll_top: false,
    timeline_array: [],
    openMedia: false,
    showConfirmDialog: false,
    sel_category: "",
    lead_categories: [],
  }),

  created() {
    this.loader = true;
  },
  mounted() {
    window.addEventListener("scroll", this.updateHeaderBackground);
    this.fetchLookup();
  },
  // beforeDestroy() {
  //   window.removeEventListener("scroll", this.updateHeaderBackground);
  // },

  watch: {
    "$route.query.id": {
      immediate: true,
      handler() {
        if (this.$route.query.id) {
          this.fetchleadsbasicdetails();
          this.fetchTimeline();
        }
      },
    },
  },
  methods: {
    confirmCategoryChange(category) {
      this.sel_category = category;
      this.showConfirmDialog = true;
    },
    confirmCategoryUpdate() {
      this.changeCategory();
      this.showConfirmDialog = false;
    },
    cancelCategoryUpdate() {
      this.showConfirmDialog = false;
    },
    changeCategory() {
      this.loader = true;
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "update_lead_category", {
          id: this.$route.query.id,
          lead_type: this.sel_category,
        })
        .then((res) => {
          this.fetchleadsbasicdetails();
          this.fetchTimeline();
          this.loader = false;
          this.flashMessage.success({
            message: res.data.message,
            time: 4000,
            blockClass: "custom-block-class",
          });
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log("error", err);
        });
    },
    updateImage(imagedata) {
      this.basicDetails.logo = imagedata;
      this.updateLeadIcon();
    },
    updateLeadIcon() {
      this.loader = true;
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "update_lead_logo", {
          id: this.$route.query.id,
          logo: this.basicDetails.logo,
        })
        .then((res) => {
          this.fetchleadsbasicdetails();
          this.fetchTimeline();
          this.loader = false;
          this.flashMessage.success({
            message: res.data.message,
            time: 4000,
            blockClass: "custom-block-class",
          });
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log("error", err);
        });
    },
    upload_Image() {
      if (this.openMedia == false) {
        this.openMedia = true;
      } else {
        this.openMedia = false;
      }
    },
    fetchTimeline() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_lead_timeline", {
          params: {
            lead_id: this.$route.query.id,
          },
        })
        .then((response) => {
          this.timeline_array = response.data.timeline;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    scrollTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      this.scroll_top = false;
    },
    updateLeadStatus() {
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "update_lead_type_status", {
          lead_id: this.$route.query.id,
          status: this.leadstatus,
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.flashMessage.success({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.fetchleadsbasicdetails();
            this.fetchTimeline();
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
    fetchLookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "LEAD_STATUS",
          },
        })
        .then((response) => {
          this.leadstatus_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "LEAD_CATEGORY",
          },
        })
        .then((response) => {
          this.lead_categories = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editLead() {
      this.$router.push({
        name: "leads_amend",
        query: {
          id: this.$route.query.id,
        },
      });
    },
    redirectMenu(url) {
      if (url == "about") {
        this.more_details = true;
      } else if (url == "contacts") {
        this.currentTab = "contact_leads";
        this.add_contacts = true;
        setTimeout(() => {
          this.add_contacts = false;
        }, 1000);
      } else if (url == "followups") {
        this.currentTab = "leads_tasks";
        this.add_followups = true;
        setTimeout(() => {
          this.add_followups = false;
        }, 1000);
      } else if (url == "documents") {
        this.currentTab = "lead_documents";
        this.add_documents = true;
        setTimeout(() => {
          this.add_documents = false;
        }, 1000);
      } else if (url == "notes") {
        this.currentTab = "notes";
        this.add_notes = true;
        setTimeout(() => {
          this.add_notes = false;
        }, 1000);
      } else if (url == "schedule_meeting") {
        this.currentTab = "leads_tasks";
        this.add_meeting = true;
        setTimeout(() => {
          this.add_meeting = false;
        }, 1000);
      } else if (url == "call_logs") {
        this.currentTab = "call_logs";
        this.add_call_log = true;
        setTimeout(() => {
          this.add_call_log = false;
        }, 1000);
      }
    },
    updateHeaderBackground() {
      if (window.scrollY > 100) {
        this.isScrolled = true;
      } else {
        this.isScrolled = false;
      }
      if (window.scrollY > 300) {
        this.scroll_top = true;
      } else {
        this.scroll_top = false;
      }
    },
    refresh() {
      this.refresh_value = 0;
      setTimeout(() => {
        this.refresh_value = 1;
      }, 100);
    },
    cancelStatus() {
      this.showStatusDialog = false;
      this.fetchleadsbasicdetails();
    },
    confirmStatus() {
      this.updateLeadStatus();
      this.showStatusDialog = false;
    },
    confirmLeadStatus(status) {
      this.leadstatus = status;
      this.showStatusDialog = true;
    },
    fetchleadsbasicdetails() {
      this.loader = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
          "leads/" +
          this.$route.query.id +
          "/edit"
        )
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.basicDetails = res.data.lead;
            setTimeout(() => {
              this.loader = false;
            }, 500);
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.loader = false;
          } else {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.loader = false;
          }
        })
        .catch((err) => {
          this.loader = false;
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(err);
        });
    },
    statusUpdate() {
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "update_leads_status", {
          id: this.status_id,
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.flashMessage.success({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.fetchleadsbasicdetails();
          } else {
            this.flashMessage.error({
              message: res.data.message,
            });
            this.fetchleadsbasicdetails();
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
    handleClick(newTab) {
      this.currentTab = newTab;
    },
  },
};
</script>
<style scoped>
.values {
  font-weight: bold;
  font-size: 14px;
}

.leaddetailscards /deep/ .v-card__title {
  height: 50px !important;
}

.leaddetailscards /deep/ .v-card__text {
  margin-top: -15px !important;
}

.leadaddressdetailscards /deep/ .v-card__title {
  height: 50px !important;
}

.leadaddressdetailscards /deep/ .v-card__text {
  margin-top: -10px !important;
  height: 156.5px !important;
}

.overflowcompanydetails {
  height: 93px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  text-overflow: ellipsis;
  text-align: left !important;
}

.aboutcompanyviewmore {
  position: absolute;
  right: 0px;
  bottom: 7px;
}

.lead-header {
  transition: 0.3s;
  position: sticky;
  background: white;
  z-index: 10;
  top: 56px;
}

.lead-header-scroll {
  transition: 0.3s;
  transform: scale(1.02);
  box-shadow: 0px 0px 3px !important;
}

.social-links {
  color: #2870fb;
}

.action-btn {
  width: 320px;
  position: absolute;
  top: 15px;
  right: -105px;
}

.edit-lead-btn {
  background: #035de8;
  padding: 5px;
  color: white;
  border-radius: 3px;
}

.edit-lead-btn:hover {
  box-shadow: 0px 0px 2px black;
}

.scroll-top-btn {
  transition: 0.5s;
  position: fixed;
  z-index: 90;
  bottom: 10px;
  right: 10px;
  opacity: 0.4;
}

.scroll-top-btn:hover {
  transition: 0.5s;
  opacity: 1;
}

.nill-data {
  color: gray;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.camera-icon {
  background: #00000070;
  position: absolute;
  left: -2px;
  width: 69px;
  height: 34px;
  top: 40px;
}

.cat_logo {
  width: 45px !important;
  height: 45px !important;
  transition: transform 0.5s;
  margin-bottom: 0px;
}

.cat_logo:hover {
  transition: 0.3s;
  cursor: pointer;
  transform: scale(1.15);
}

.lead-cat {
  font-size: 16px;
  margin-left: 10px;
}

.sel-cat {
  background: #e8e8e8;
  font-weight: bold !important;
  pointer-events: none;
}
.c-drop-menu >>> .v-list-item:hover{
  background: rgb(243, 243, 255) !important;
}
</style>
  