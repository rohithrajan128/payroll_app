<template>
  <div class="main-20">
    <div>
      <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
      <Tabs class="pl-0 ml-0" :tabs="tabs" :currentTab="currentTab"
        :wrapper-class="'shadow-tabs inline-tabs align-self-center'" :tab-class="'tab-item'"
        :tab-active-class="'tab-item-active'" :line-class="'tab-item-line'" @onClick="handleClick" />
      <hr>
      <div>
        <div v-if="currentTab == 'active'">
          <h6 style="padding-block: 8px;font-size: 18px;margin-left: 4px;">{{ $t('manager') }}</h6>
          <v-row>
            <v-col cols="12" md="4">
              <v-card class="p-3 contact-info-card" v-if="current_manager">
                <b style="font-size: 14px">{{ $t('manager') }}</b><br />
                <div style="font-size: 14px">
                  {{ current_manager.manager_name }}
                </div>
                <div class="row">
                  <div class="col-md-8">
                    <b style="font-size: 12px">{{ $t('email') }}</b><br />
                    <div style="font-size: 13px">
                      {{ current_manager.manager_email }}
                    </div>
                  </div>
                  <div class="col-md-4">
                    <b style="font-size: 12px">{{ $t('start_date') }}</b><br />
                    <div style="font-size: 12px">
                      {{ current_manager.start_date || formatDate }}
                    </div>
                  </div>
                </div>
              </v-card>
            </v-col>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn v-if="view == 'userview' && status" color="primary" dark small
                  class="btn mr-2 mb-2 hover_shine add_new" v-on="on" @click="UpdateManger">{{ $t("assign_manager") }}
                </v-btn>
              </template>
              <span>{{ $t("create_new_manager") }}</span>
            </v-tooltip>
          </v-row>
          <hr>
          <h6 style="padding-block: 8px;font-size: 18px;margin-left: 4px;">{{ $t('projects') }}</h6>
          <div v-if="Active_Projects.length > 0">
            <v-row>
              <v-col v-for="(prj, index) in Active_Projects" :key="index" cols="12" md="4">
                <v-card class="p-3 contact-info-card">
                  <b style="font-size: 14px">Project Name</b><br />
                  <div style="font-size: 14px">{{ prj.project_name }}</div>
                  <b style="font-size: 14px">Manager</b><br />
                  <div style="font-size: 14px">
                    <span v-if="prj.manager_details.Full_Code">
                      {{ prj.manager_details.Full_Code }}
                    </span>
                    <span v-else>{{ $t('not_appllicable') }}</span>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </div>
          <div v-else class="text-center pa-5">No data found</div>
        </div>
        <div v-if="currentTab == 'inactive'">
          <h6 style="padding-block: 8px;font-size: 18px;margin-left: 4px;">{{ $t('manager') }}</h6>
          <v-row v-if="inactive_manager.length > 0">
            <v-col cols="12" md="4" v-for="(inactiveman, i ) in  inactive_manager" :key="i">
              <v-card class="p-3 contact-info-card-inactive">
                <b style="font-size: 14px">{{ $t('manager') }}</b><br />
                <div style="font-size: 14px">
                  {{ inactiveman.manager_name }}
                </div>
                <div class="row">
                  <div class="col-md-8">
                    <b style="font-size: 12px">{{ $t('email') }}</b><br />
                    <div style="font-size: 13px">
                      {{ inactiveman.manager_email }}
                    </div>
                  </div>
                  <div class="col-md-4">
                    <b style="font-size: 12px">{{ $t('end_date') }}</b><br />
                    <div style="font-size: 12px">
                      {{ inactiveman.end_date || formatDate }}
                    </div>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <div v-else class="text-center pa-5">No data found</div>
          <hr>
          <h6 style="padding-block: 8px;font-size: 18px;margin-left: 4px;">{{ $t('project') }}</h6>
          <div v-if="InActive_Projects.length > 0">
            <v-row>
              <v-col v-for="(prj, index) in InActive_Projects" :key="index" cols="12" md="4">
                <v-card class="p-3 contact-info-card-inactive">
                  <b style="font-size: 14px">Project Name</b><br />
                  <div style="font-size: 14px">{{ prj.project_name }}</div>
                  <b style="font-size: 14px">Manager</b><br />
                  <div style="font-size: 14px">
                    <span v-if="prj.manager_details.Full_Code">
                      {{ prj.manager_details.Full_Code }}
                    </span>
                    <span v-else>{{ $t('not_appllicable') }}</span>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </div>
          <div v-else class="text-center pa-5">No data found</div>
        </div>
      </div>
      <v-dialog v-model="dialog" persistent fullscreen transition="dialog-bottom-transition" width="800">
        <v-card>
          <v-toolbar color="primary" dark>
            <span class="headline">{{ $t("assign_reporting_manager") }}</span>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon @click="closereportingmanager" class="dialogcloseinuserdetails" v-on="on">mdi-close</v-icon>
              </template>
              <span>{{ $t("close") }}</span>
            </v-tooltip>
          </v-toolbar>
          <v-card-text>
            <v-alert v-model="save_error" :text="save_error" color="error" icon="warning" outlined dismissible>
              {{ valertdialogmessage }}</v-alert>
            <v-form v-model="valid" ref="form">
              <v-layout class="pa-2 pt-10">
                <v-flex md4 class="pr-2">
                  <v-autocomplete dense v-bind:label="$t('existing_manager')" outlined class="required_field"
                    :rules="fieldRules" disabled v-model="reportingmanager.current_manager" :items="primarymanagerslist"
                    item-text="Full_Code" item-value="id"></v-autocomplete>
                </v-flex>
                <v-flex md4 class="pr-2">
                  <v-autocomplete dense v-bind:label="$t('reporting_managers')" outlined class="required_field"
                    :rules="fieldRules" v-model="reportingmanager.manager_id" :items="managerslist" item-text="Full_Code"
                    item-value="id"></v-autocomplete>
                </v-flex>
                <v-flex md4 class="pr-2">
                  <DatePicker :label="$t('start_date')" :stored_date="reportingmanager.end_date" :rules="fieldRules"
                    :class_required="'RequiredField'" :max="new Date().toISOString().substr(0, 10)"
                    @formatted_date="formattedEndDate" />
                </v-flex>
              </v-layout>
            </v-form>
            <v-row class="mr-2">
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <div v-on="on" class="d-inline-block mr-2">
                    <v-btn v-on="on" small @click="closereportingmanager" class="ma-1 font-weight-bold cancel-btn"
                      color="btn hover_shine cancel_button">{{ $t("cancel") }}</v-btn>
                  </div>
                </template>
                <span>{{ $t("cancel") }}</span>
              </v-tooltip>
              <v-btn small color="success" class="mr-5 mt-1 mb-2" :disabled="isBtnLoading"
                @click="createnewprimarymanager">
                {{ $t("save") }} &nbsp;
                <b-spinner small v-if="isBtnLoading"></b-spinner>
              </v-btn>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>

      <ConfirmDialog :show="showStatusDialog" :cancel="cancelStatus" :confirm="confirmStatus" v-bind:title="$t('confirm')"
        v-bind:description="$t('change_primary_reporting_manager')" />
      <ConfirmDialog :show="showalert" :cancel="cancelalert" v-bind:title="$t('confirm')" :primary_delete="delete_primary"
        v-bind:description="description_text_message" :confirm="confirmassign" :create_message="confirm_message" />
    </div>
  </div>
</template>
<script>
import DatePicker from "../Components/DatePicker.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import assigningnewrole from "../Users/AssigningNewRole.vue";
import VueElementLoading from "vue-element-loading";
import Tabs from "vue-tabs-with-active-line";
const TABS = [
  {
    title: "Active",
    value: "active",
  },
  {
    title: "Inactive",
    value: "inactive",
  },
];
export default {
  props: ["user_id", "view", "status"],

  components: {
    DatePicker,
    ConfirmDialog,
    assigningnewrole,
    VueElementLoading,
    Tabs,
  },
  data: () => ({
    tabs: TABS,
    currentTab: "active",
    valertdialogmessage: "",
    save_error: false,
    allmanagers: [],
    loader: false,
    primarymanagerslist: [],
    managerslist: [],
    empdetailsself: [],
    reportingmanager: {
      current_manager: "",
      end_date: "",
      manager_id: "",
      emp_id: "",
    },
    reportmanagerassigning: false,
    reportManagerID: "",
    assignmanagerdialog: false,
    confirm_message: "",
    delete_primary: "",
    description_text_message: "",
    showalert: false,
    showStatusDialog: false,
    initval: true,
    isBtnLoading: false,
    valid: true,
    dialog: false,
   
    InActive_Projects: [],
    Active_Projects: [],
    inactive_manager: [],
    current_manager: [],
  }),

  mounted() { },
  watch: {
    user_id: {
      immediate: true,
      handler() {
        if (this.user_id >= 1) {
          this.reportingmanager.emp_id = this.user_id;
          this.fetchallmanagersdatatable();
          this.fetchProjects();
        }
      },
    },
  },

  methods: {
    handleClick(newTab) {
      this.currentTab = newTab;
    },
    updatedrole() {
      this.initval = true;
      this.createnewprimarymanager();
      this.assignmanagerdialog = false;
      this.initval = false;
    },
    cancelStatus() {
      this.showStatusDialog = false;
      this.dialog = false;
    },
    confirmStatus() {
      this.showStatusDialog = false;
      this.fetchallManagersList();
    },
    confirmassign() {
      this.showalert = false;
      this.dialog = false;
      if (this.reportingmanager.manager_id >= 1) {
        this.reportManagerID = this.reportingmanager.manager_id;
      } else {
        this.reportManagerID = this.reportingmanager.emp_id;
      }
      this.reportmanagerassigning = true;
      setTimeout(() => {
        this.assignmanagerdialog = true;
      }, 100);
    },
    cancelalert() {
      this.showalert = false;
      this.dialog = true;
    },
    createnewprimarymanager() {
      if (this.$refs.form.validate()) {
        this.isBtnLoading = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN +
            "createreportingmanagerforanemployee",
            this.reportingmanager
          )
          .then((response) => {
            if (response.data.status == "S") {
              this.flashMessage.success({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.fetchallmanagersdatatable();
              this.isBtnLoading = false;
              this.dialog = false;
            }
            if (response.data.status == "NotaManager") {
              this.dialog = false;
              setTimeout(() => {
                this.showalert = true;
                this.description_text_message = response.data.message;
                this.delete_primary = "Primary";
                this.isBtnLoading = false;
                this.confirm_message = this.$t("assign_role");
              }, 100);
            }
            if (response.data.status == "E") {
              this.valertdialogmessage = response.data.message;
              this.save_error = true;
              this.initval = false;
            }
          })
          .catch((err) => {
            this.isBtnLoading = false;
            this.valertdialogmessage = this.$t("something_went_wrong");
            this.save_error = true;
            console.log(err);
            this.initval = false;
          });
      }
    },
    UpdateManger() {
      this.reportingmanager.manager_id = "";
      this.reportingmanager.end_date = "";
      this.showStatusDialog = true;
      this.reportingmanager.current_manager = this.current_manager.manager_id;
    },

    fetchProjects() {
      this.loader = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchactiveprojects", {
          params: {
            emp_id: this.user_id,
          },
        })
        .then((res) => {
          this.user_role = res.data.user_role;
          var projects = res.data.projects;
          let inactive_proj = [];
          let active_proj = [];
          projects.map((ele) => {
            // if (ele.primary) {
            //   inactive_proj.push(ele);
            // } else {
            active_proj.push(ele);
            // }
          });
          this.inactive_proj = inactive_proj;
          this.active_proj = active_proj;
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
              blockClass: "custom-block-class",
            });
          }
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
    fetchallmanagersdatatable() {
      this.initval = true;
      this.loader = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
          "fetchuserallreportingmanagers/" +
          this.user_id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.current_manager = res.data.current_manager;
            this.inactive_manager = res.data.inactive_manager;
            this.Active_Projects = res.data.Active_Projects;
            this.InActive_Projects = res.data.InActive_Projects;

            this.loader = false;
            this.initval = false;
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
        });
    },
    fetchallManagersList() {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
          "fetchallmanagersfromempid/" +
          this.user_id
        )
        .then((res) => {
          this.primarymanagerslist = res.data.primary_managers;
          this.managerslist = res.data.allmanagers;
          this.initval = false;
          this.dialog = true;
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          this.initval = false;
          console.log(" error" + err);
        });
    },
    formattedEndDate(formatted_date) {
      this.reportingmanager.end_date = formatted_date;
    },
    closereportingmanager() {
      this.dialog = false;
      this.save_error = false;
    },
    NumbersOnly(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    allowedMonths: (val) => parseInt(val.split("-")[1], 10) % 2 === 0,
  },
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

  },
};
</script>
<style scoped>
.assignroleclass {
  height: 233px;
  width: 750px;
  padding-left: 31px;
  padding-top: 24px;
}

.contact-info {
  padding: 2px;
  box-shadow: 0px 0px 4px 0px;
  color: white;
  border-radius: 5px;
  position: absolute;
  right: -44px;
  rotate: 45deg;
  top: 15px;
  width: 140px;
  text-align: center;
}

.contact-info-card {
  position: relative;
  overflow: clip;
  box-shadow: 0px 0px 3px 1px #007bff !important;
  margin-left: 5px;
}

.contact-info-card-inactive {
  position: relative;
  overflow: clip;
  box-shadow: 0px 0px 3px 1px #f94e1b !important;
  margin-left: 5px;
}

.inline-tabs {
  border: 0px !important;
}
</style>