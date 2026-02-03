<template>
  <div class="container-fluid mt-3 p-0">
    <div class="connectheader" :class="{ 'connect-header-scroll': isScrolled }">
      <v-row class="py-3 px-0" v-if="connectdetails">
        <v-col md="7">
          <div class="row justify-space-between">
            <div class="col-md-7">
              <div class="row">
                <div class="col-md-3">
                  <div style="position: relative">
                    <v-avatar size="70" class="text-center mtb-20">
                      <v-img
                        v-if="connectdetails.company_profile != null"
                        :src="envImagePath + connectdetails.company_profile"
                        alt
                      ></v-img>
                      <img
                        v-else
                        width="42"
                        class="rounded-circle"
                        src="@/assets/images/noimage.png"
                        alt
                      />
                      <div class="camera-icon">
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn icon v-bind="attrs" v-on="on">
                              <v-icon
                                @click="upload_Image"
                                color="grey lighten-1"
                              >
                                mdi-camera
                              </v-icon>
                            </v-btn>
                          </template>
                          <span>{{ $t("add_company_img") }}</span>
                        </v-tooltip>
                      </div>
                    </v-avatar>
                  </div>
                </div>
                <div class="col-md-9 align-self-center">
                  <div class="pb-2">
                    <div class="row companyheaders">
                      {{ connectdetails.business_name }}
                      <span
                        v-if="connectdetails.business_alias"
                        class="ml-1"
                        style="font-size: 12px !important; margin-top: 2px"
                      >
                        ( {{ connectdetails.business_alias }} )
                      </span>
                    </div>
                    <div class="row">
                      <div class="row pt-5 ml-0">
                        <v-icon small> mdi-gmail </v-icon>
                        <v-tooltip bottom v-if="connectdetails.email">
                          <template v-slot:activator="{ on }">
                            <div
                              class="companyheader ml-1 overheaderemailconnect"
                              v-on="on"
                              style="cursor: pointer"
                            >
                              {{ connectdetails.email }}
                            </div>
                          </template>
                          <span> {{ connectdetails.email }}</span>
                        </v-tooltip>
                        <span v-else class="ml-2">{{ $t("not_found") }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-5 align-self-center pl-5">
              <div class="row">
                <div class="col-md-2 align-self-center">
                  <div style="position: relative">
                    <v-avatar size="40" class="text-center mtb-20" rounded="0">
                      <img
                        width="42"
                        src="@/assets/images/primary_contact_info.jpg"
                        alt
                      />
                    </v-avatar>
                  </div>
                </div>
                <div class="col-md-10 align-self-center">
                  <div class="ml-2" style="display: block">
                    <div class="companyheader">
                      {{ $t("primary_contact") }}
                    </div>
                    <div>
                      <span
                        v-if="connectdetails.contact_name"
                        class="companyheaders"
                      >
                        {{ connectdetails.salutation }}
                        {{ connectdetails.contact_name }}
                      </span>
                      <span v-else>{{ $t("not_found") }}</span>
                    </div>
                    <div class="primarycontact_row">
                      <span
                        v-if="connectdetails.contact_no"
                        class="primarycontact_span"
                      >
                        + {{ connectdetails.contact_number_code }}
                        {{ connectdetails.contact_number }}</span
                      >
                      <span v-else>{{ $t("not_found") }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-col>
        <v-col md="5" class="align-self-center">
          <div class="row justify-space-between">
            <div class="col-md-7 align-self-center">
              <div class="row" style="padding-left: 69px">
                <div style="position: relative">
                  <v-avatar size="50" class="text-center mtb-20">
                    <img
                      width="42"
                      class="rounded-circle"
                      src="@/assets/images/connect_type.jpg"
                      alt
                    />
                  </v-avatar>
                </div>
                <div class="align-self-center ml-4 pb-4">
                  <div class="row companyheader">
                    {{ $t("connect_type") }}
                  </div>
                  <div class="row">
                    <div class="row pt-3 ml-0">
                      <span
                        v-if="connectdetails.connect_type"
                        class="companyheaders"
                      >
                        {{ connectdetails.connect_type }}
                      </span>
                      <span v-else>{{ $t("not_found") }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-2 align-self-center">
              <div class="row">
                <div class="col-md-6">
                  <router-link
                    small
                    :to="{
                      name: 'candidate_connect_amend',
                      query: { id: $route.query.id },
                    }"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon
                          medium
                          color="primary"
                          dark
                          v-on="on"
                          class="vicon_llink"
                        >
                          mdi-pencil-circle
                        </v-icon>
                      </template>
                      <span>{{ $t("edit") }}</span>
                    </v-tooltip>
                  </router-link>
                </div>
                <div class="col-md-6">
                  <v-menu>
                    <template v-slot:activator="{ on: menu, attrs }">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                          <v-icon
                            medium
                            color="primary"
                            v-bind="attrs"
                            v-on="{ ...tooltip, ...menu }"
                            class="vicon_llink"
                          >
                            mdi-plus-circle
                          </v-icon>
                        </template>
                        <span>{{ $t("add") }}</span>
                      </v-tooltip>
                    </template>
                    <v-list>
                      <v-list-item @click="addserviceoffers()">
                        <v-icon size="medium" color="secondary" class="pr-1">
                          mdi-file-edit</v-icon
                        >
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <span v-on="on">{{ $t("services_offered") }}</span>
                          </template>
                          <span>{{ $t("services_offered") }}</span>
                        </v-tooltip>
                      </v-list-item>
                      <v-list-item @click="addcontactmenu()">
                        <v-icon size="medium" color="secondary" class="pr-1">
                          mdi-plus-circle</v-icon
                        >
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <span v-on="on">{{ $t("add_contact") }}</span>
                          </template>
                          <span>{{ $t("add_contact") }}</span>
                        </v-tooltip>
                      </v-list-item>
                      <v-list-item @click="adddocumentmenu()">
                        <v-icon size="medium" color="secondary" class="pr-1">
                          mdi-plus-circle</v-icon
                        >
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <span v-on="on">{{ $t("add_document") }}</span>
                          </template>
                          <span>{{ $t("add_document") }}</span>
                        </v-tooltip>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <div class="d-inline-block mr-2">
                    <v-btn
                      v-on="on"
                      small
                      @click="$router.go(-1)"
                      class="ma-1 font-weight-bold cancel-btn text-right"
                      color="dark cancel_button mr-3"
                      >{{ $t("back") }}</v-btn
                    >
                  </div>
                </template>
                <span>{{ $t("back") }}</span>
              </v-tooltip>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
    <v-layout style="display: none">
      <v-flex xs12>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <span v-on="on">
              <MediaSelect
                :label="'Image'"
                folder="connect_company_image"
                :image="connectdetails.company_profile"
                :resizeheight="100"
                :resizewidth="100"
                @updateImage="updateImage"
                :upload_profile="openMedia"
              >
              </MediaSelect>
            </span>
          </template>
          <span>{{ $t("file_input") }}</span>
        </v-tooltip>
      </v-flex>
    </v-layout>
    <div class="row">
      <div class="col-md-9">
        <div class="mb-3 mx-auto">
          <v-tabs>
            <Tabs
              :tabs="tabs"
              :currentTab="currentTab"
              :wrapper-class="'shadow-tabs inline-tabs align-self-center'"
              :disabled="true"
              :tab-class="'tab-item'"
              :tab-active-class="'tab-item-active'"
              :line-class="'tab-item-line'"
              @onClick="handleClick"
            />
          </v-tabs>
          <div v-if="currentTab == 'connect_details'">
            <connectdetails :connect_id="$route.query.id" @getData="getData" />
          </div>
          <div v-if="currentTab == 'contacts'">
            <ContactRecruitment
              :connect_id="$route.query.id"
              :menuclick="menupasscontact"
            />
          </div>
          <div v-if="currentTab == 'documents'">
            <ConnectDocument
              :connect_id="$route.query.id"
              :menuclick="menupassdocument"
            />
          </div>
          <div v-if="currentTab == 'notes'">
            <div v-if="comment_layout">
              <ConnectNotes :connect_id="$route.query.id"></ConnectNotes>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3 p-0">
        <div class="connect-notes-scroll mb-5">
          <ConnectNotes
            :connect_id="$route.query.id"
            :view="'mainview'"
            @notes_size="notes_size"
          ></ConnectNotes>
          <div
            class="row text-right seemoreclasscomment"
            v-if="currentTab != 'notes' && noteslength > 1"
          >
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <strong class="pr-1" v-on="on" @click="seemore()">{{
                  $t("see_more")
                }}</strong>
                <v-icon v-on="on" small @click="seemore()" color="primary"
                  >mdi-eye-outline</v-icon
                >
              </template>
              <span>{{ $t("see_more") }}</span>
            </v-tooltip>
          </div>
        </div>
      </div>
    </div>
    <v-dialog persistent v-model="servicedialog" max-width="800" small>
      <v-card class="container pb-3" style="padding: 0px !important">
        <v-toolbar color="primary" dark>
          <span class="headline">{{ $t("services_offered") }}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon @click="close" class="dialogcloseinuserdetails" v-on="on"
                >mdi-close</v-icon
              >
            </template>
            <span>{{ $t("close") }}</span>
          </v-tooltip>
        </v-toolbar>
        <div style="padding: 10px">
          <div class="card-body">
            <v-form ref="form" v-model="valid">
              <v-layout wrap mt-4 pr-2>
                <v-flex md12 sm12 pl-3>
                  <v-combobox
                    v-model="servicearray"
                    chips
                    multiple
                    required
                    hint="Enter to add tags"
                    class="majorskillsetcombobox"
                    outlined
                    dense
                    v-bind:label="$t('services_offered')"
                  >
                    <template
                      v-slot:selection="{ attrs, item, select, selected }"
                    >
                      <v-chip
                        small
                        v-bind="attrs"
                        :input-value="selected"
                        @click="select"
                        color="primary"
                        class="ma-1"
                      >
                        {{ item }}
                      </v-chip>
                    </template>
                  </v-combobox>
                </v-flex>
              </v-layout>
              <v-row>
                <div class="values pl-4" v-if="currentservicearray">
                  <v-chip
                    v-for="(service, i) in currentservicearray"
                    :key="i"
                    class="mr-1 serviceofeerrow"
                    close
                    @click:close="closeservicechips(i)"
                    variant="outlined"
                    color="primary"
                    small
                    >{{ service }}</v-chip
                  >
                </div>
              </v-row>
            </v-form>
          </div>
          <div class="d-block text-right pr-4">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on" class="d-inline-block mr-2">
                  <v-btn
                    v-on="on"
                    small
                    @click="close()"
                    :disabled="isBtnLoading"
                    class="ma-1 font-weight-bold cancel-btn"
                    color="dark cancel_button"
                    >{{ $t("cancel") }}</v-btn
                  >
                </div>
              </template>
              <span>{{ $t("cancel") }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on" class="d-inline-block">
                  <v-btn
                    :disabled="isBtnLoading"
                    @click="submitservice"
                    small
                    class="mr-2 success hover_shine"
                    color="green darken-1"
                  >
                    {{ $t("submit") }}
                    <b-spinner
                      :disabled="isBtnLoading"
                      small
                      v-if="isBtnLoading"
                    ></b-spinner>
                  </v-btn>
                </div>
              </template>
              <span>{{ $t("submit") }}</span>
            </v-tooltip>
          </div>
        </div>
      </v-card>
    </v-dialog>
    <div class="scroll-top-btn" v-show="scroll_top == true">
      <v-btn class="mx-2" fab dark small color="primary" @click="scrollTop()">
        <v-icon dark> mdi-chevron-up </v-icon>
      </v-btn>
    </div>
  </div>
</template>
 
<script>
import VueElementLoading from "vue-element-loading";
import connectdetails from "../CandidateRecruitment/ConnectDetails.vue";
import ContactRecruitment from "../Recruitment/ContactsRecruitment.vue";
import ConnectDocument from "./ConnectDocuments.vue";
import ConnectNotes from "./ConnectNotes.vue";
import Tabs from "vue-tabs-with-active-line";
import MediaSelect from "../Components/Upload/MediaSelect.vue";
const TABS = [
  {
    title: "About",
    value: "connect_details",
  },
  {
    title: "Contacts",
    value: "contacts",
  },
  {
    title: "Documents",
    value: "documents",
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
    connectdetails,
    ContactRecruitment,
    ConnectDocument,
    ConnectNotes,
    MediaSelect,
  },
  data: () => ({
    openMedia: false,
    isScrolled: false,
    scroll_top: false,
    isBtnLoading: false,
    menupasscontact: false,
    menupassdocument: false,
    valid: false,
    servicedialog: false,
    tabs: TABS,
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    currentTab: "connect_details",
    comment_layout: true,
    loader: false,
    noteslength: 0,
    connectdetails: [],
    servicearray: [],
    currentservicearray: [],
  }),

  mounted() {
    window.addEventListener("scroll", this.updateHeaderBackground);
  },

  created() {
    this.$eventBus.$on(
      "update_primary_contact",
      (salutation, name, contact_no, contact_no_code) => {
        this.connectdetails.salutation = salutation;
        this.connectdetails.contact_name = name;
        this.connectdetails.contact_number_code = contact_no_code;
        this.connectdetails.contact_number = contact_no;
      }
    );
    this.$eventBus.$on("updated_notes", () => {
      this.comment_layout = false;
      setTimeout(() => {
        this.comment_layout = true;
      }, 10);
    });
  },

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },

  watch: {},
  methods: {
    notes_size(notes_size) {
      this.noteslength = notes_size;
    },
    seemore() {
      this.currentTab = "notes";
    },
    scrollTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      this.scroll_top = false;
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
    addserviceoffers() {
      this.currentTab = "connect_details";
      this.servicedialog = true;
    },
    adddocumentmenu() {
      this.currentTab = "documents";
      this.menupassdocument = true;
    },
    addcontactmenu() {
      this.currentTab = "contacts";
      this.menupasscontact = true;
    },
    upload_Image() {
      if (this.openMedia == false) {
        this.openMedia = true;
      } else {
        this.openMedia = false;
      }
    },
    updateImage(imagedata) {
      this.connectdetails.company_profile = imagedata;
      this.updateLeadIcon();
    },
    updateLeadIcon() {
      this.loader = true;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "updateconnectdetailsinviewpage",
          {
            parent_id: this.$route.query.id,
            type: type,
            data: this.connectdetails,
          }
        )
        .then((res) => {
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
    submitservice() {
      this.isBtnLoading = true;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "createamendserviceinviewpage",
          {
            parent_id: this.$route.query.id,
            old_data: this.currentservicearray,
            new_data: this.servicearray,
          }
        )
        .then((res) => {
          this.isBtnLoading = false;
          this.servicedialog = false;
          this.flashMessage.success({
            message: res.data.message,
            time: 4000,
            blockClass: "custom-block-class",
          });
          this.$eventBus.$emit("updated_services");
          this.close();
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
    closeservicechips(index) {
      this.currentservicearray.splice(index, 1);
    },
    close() {
      this.servicearray = [];
      this.servicedialog = false;
    },
    getData(getData) {
      this.connectdetails = getData;
      this.currentservicearray = getData.service_offered;
    },

    handleClick(newTab) {
      this.menupasscontact = false;
      this.menupassdocument = false;
      if (this.connectdetails.length != 0) {
        this.currentTab = newTab;
        localStorage.setItem("active_rect_tab-connects", newTab);
      }
    },
  },
};
</script>
<style scoped>
.connectheader {
  padding-bottom: 15px;
  height: auto;
  transition: 0.3s;
  padding-inline: 24px;
  padding-top: 17px;
  position: sticky;
  background: white;
  z-index: 10;
  top: 56px;
  border-bottom: solid #f3f3f3 7px;
}

.camera-icon {
  background: #00000070;
  position: absolute;
  left: 1px;
  width: 69px;
  height: 34px;
  top: 47px;
}

.camera-icon /deep/ .v-icon {
  font-size: 19px !important;
  margin-bottom: 10px !important;
}

.companyheaders {
  font-size: 15px;
  font-weight: 600;
}

.companyheader {
  font-size: 12px;
  font-weight: 600;
}

.vicon_llink {
  font-size: 30px !important;
}

.v-list-item {
  cursor: pointer !important;
  font-weight: 600;
}

.majorskillsetcombobox /deep/ .v-input__append-inner {
  display: none !important;
}

.primarycontact_span {
  font-size: 13px;
  font-weight: 800;
  color: #000000;
}

.overheaderemailconnect {
  text-overflow: ellipsis;
  overflow: hidden;
  width: 163px;
  font-size: 14px;
}

.serviceofeerrow {
  margin-top: 6px !important;
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

.connect-header-scroll {
  transition: 0.3s;
  transform: scale(1.01);
}

.connect-notes-scroll {
  position: sticky;
  top: 190px;
  margin-top: 10px;
}

.seemoreclasscomment {
  margin-top: 0px;
  background: white;
  margin-inline: unset;
  padding-left: 15px;
  padding-bottom: 12px;
  cursor: pointer;
}
</style>
  