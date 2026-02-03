<template>
  <div class="main-20">
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title class="col-md-6" :heading="$t('compoff_approval')" :google_icon="google_icon"></page-title>
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
    </div>
    <v-data-table
      :headers="headers"
      class="pt-8 elevation-1"
      :items="applied_compoff"
      :loading="initval"
      :search="search"
    >
      <template v-slot:item="props">
        <tr>
          <td v-if="props.item.compoffarray.emp_id">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-chip
                  v-on="on"
                  color="primary"
                  outlined
                  small
                  @click="opencompoffdialog(props.item.compoffarray.unique_id_compoff, props.item.compoffarray, props.item.day_type)"
                >{{ props.item.compoffarray.employee_details.Full_Code }}</v-chip>
              </template>
              <span>{{ $t("view") }}</span>
            </v-tooltip>
          </td>
          <td v-else>{{ $t('not_appllicable') }}</td>
          <td>{{ props.item.compoffarray.submitted_date | formatdateMonthyear }}</td>
          <td v-if="props.item.day_type">{{ props.item.day_type }}</td>
          <td v-else>{{ $t('not_appllicable') }}</td>
          <td>
            <span v-if="props.item.compoffarray.project_details">
              {{
              props.item.compoffarray.project_details.project_name }}
            </span>
            <span v-else>{{ $t('not_appllicable') }}</span>
          </td>
          <td>
            <v-chip
              small
              medium
              class="statusleavetd"
              :color="props.item.status_color"
            >{{ props.item.compoffarray.comp_off_approval }}</v-chip>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-dialog v-model="compoffDialog" width="1000" persistent>
      <v-toolbar color="primary" dark>
        <span class="headline">
          {{
          $t("approve/reject_compoff")
          }}
        </span>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              @click="compoffDialog = false;save_error=false;"
              class="dialogcloseinuserdetails"
              v-on="on"
            >mdi-close</v-icon>
          </template>
          <span>{{ $t("close") }}</span>
        </v-tooltip>
      </v-toolbar>
      <v-alert v-model="save_error" :text="save_error" color="error" icon="warning" outlined dismissible>
      {{ valertdialogmessage }}</v-alert>
      <v-card class="pa-5">
        <v-layout wrap class="mt-1">
          <v-flex xs4 sm4 md4>
            <div class="d-flex">
              <p class="paragraph_timesheet">{{ $t("employee_name") }} :</p>
              <p
                class="paragraph_timesheet_text"
                v-if="dialogCompoff.employee_details"
              >{{ dialogCompoff.employee_details.firstname }} {{ dialogCompoff.employee_details.lastname }}</p>
              <p v-else>{{ $t('not_appllicable') }}</p>
            </div>
          </v-flex>
          <v-flex xs4 sm4 md4>
            <div class="d-flex">
              <p class="paragraph_timesheet">{{ $t("status") }} :</p>
              <p class="paragraph_timesheet_text">
                <v-chip
                  small
                  color="success"
                  style="margin-top: -4px;"
                  v-if="dialogCompoff.comp_off_approval == 'Approved'"
                >{{ dialogCompoff.comp_off_approval }}</v-chip>
                <v-chip
                  small
                  color="error"
                  style="margin-top: -4px;"
                  v-if="dialogCompoff.comp_off_approval == 'Rejected'"
                >{{ dialogCompoff.comp_off_approval }}</v-chip>
                <v-chip
                  small
                  color="primary"
                  style="margin-top: -4px;"
                  v-if="dialogCompoff.comp_off_approval == 'Pending'"
                >{{ dialogCompoff.comp_off_approval }}</v-chip>
              </p>
            </div>
          </v-flex>
          <v-flex xs4 sm4 md4>
            <div class="d-flex">
              <p class="paragraph_timesheet">{{ $t("working_hours") }} :</p>
              <p class="paragraph_timesheet_text">{{ total_working_hours }} {{ $t('hour') }}</p>
            </div>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex xs4 sm4 md4>
            <div class="d-flex">
              <p class="paragraph_timesheet">{{ $t("project_name") }} :</p>
              <p
                class="paragraph_timesheet_text"
                v-if="dialogCompoff.project_details"
              >{{ dialogCompoff.project_details.project_name }}</p>
              <p v-else>{{ $t('not_appllicable') }}</p>
            </div>
          </v-flex>
          <v-flex xs4 sm4 md4>
            <div class="d-flex">
              <p class="paragraph_timesheet">{{ $t("worked_on") }} :</p>
              <p
                class="paragraph_timesheet_text"
                v-if="dialogCompoff.employee_details"
              >{{ dialogCompoff.submitted_date | formatdateMonthyear }}</p>
              <p v-else>{{ $t('not_appllicable') }}</p>
            </div>
          </v-flex>
          <v-flex xs4 sm4 md4>
            <div class="d-flex">
              <p class="paragraph_timesheet">{{ $t("day_type") }} :</p>
              <p class="paragraph_timesheet_text" v-if="dialog_day_type">{{ dialog_day_type }}</p>
              <p v-else>{{ $t('not_appllicable') }}</p>
            </div>
          </v-flex>
        </v-layout>
        <v-layout wrap class="activitydescriptionlayout">
          <v-flex xs12 sm12 md12 class="pa-2" v-for="(task, index) in task_desc_array" :key="index">
            <div class="d-flex" style="position: relative;">
              <v-textarea
                outlined
                readonly
                rows="2"
                label="Activity Description"
                v-model="task.task_desc"
              ></v-textarea>
              <span class="etatakenindialogbox">{{ task.no_of_hrs }} {{ $t('hour') }}</span>
            </div>
          </v-flex>
        </v-layout>
        <v-row class="ma-1">
          <v-spacer></v-spacer>
          <v-tooltip bottom v-if="dialogCompoff.comp_off_approval == 'Pending'">
            <template v-slot:activator="{ on }">
              <v-btn
                small
                color="success"
                class="compoffactionchip"
                v-on="on"
                @click="approvecompoffchip(dialogCompoff.unique_id_compoff)"
              >{{ $t('approve') }}</v-btn>
            </template>
            <span>{{ $t("approve") }}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="dialogCompoff.comp_off_approval == 'Pending'">
            <template v-slot:activator="{ on }">
              <v-btn small color="error" class="compoffactionchip">
                <span
                  class="rejectstylespan"
                  v-on="on"
                  @click="rejectcompoffchip(dialogCompoff.unique_id_compoff)"
                >{{ $t('reject') }}</span>
              </v-btn>
            </template>
            <span>{{ $t("reject") }}</span>
          </v-tooltip>
        </v-row>
      </v-card>
      <ConfirmDialog
        :show="showConfirmDialogapprove"
        :cancel="cancelapprove"
        :confirm="confirmApprove"
        v-bind:title="$t('confirm')"
        v-bind:description="$t('want_to_approve_the_status')"
      />
      <ConfirmDialog
        :show="showConfirmDialogreject"
        :cancel="cancelreject"
        :confirm="confirmReject"
        v-bind:title="$t('confirm')"
        v-bind:description="$t('want_to_reject_the_status')"
      />
    </v-dialog>
  </div>
</template>
  
  
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
export default {
  components: {
    PageTitle,
    ConfirmDialog
  },
  data: () => ({
    valertdialogmessage:"",
    save_error: false,
    google_icon: {
      icon_name: "fact_check",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined"
    },
    search: "",
    total_working_hours: "",
    compoffDialog: false,
    showConfirmDialogapprove: false,
    showConfirmDialogreject: false,
    initval: false,
    applied_compoff: [],
    compoffDetails: [],
    dialogCompoff: [],
    task_desc_array: [],
    dialog_day_type: "",
    compoff_id: "",
    headers: [
      {
        text: "Applied By",
        align: "left",
        value: "employee_details.Full_code"
      },
      {
        text: "Worked On",
        value: "submitted_date",
        align: "left"
      },
      {
        text: "Day Type",
        value: "day_type",
        align: "left"
      },
      {
        text: "Project",
        value: "project_details.project_name",
        align: "left",
        sortable: false
      },
      {
        text: "Status",
        value: "comp_off_approval",
        align: "left"
      }
    ]
  }),
  mounted() {
    this.fetchcompoffdetails();
  },
  watch: {},
  methods: {
    approvecompoffchip(unique_id) {
      this.compoff_id = unique_id;
      this.showConfirmDialogapprove = true;
    },
    rejectcompoffchip(unique_id) {
      this.compoff_id = unique_id;
      this.showConfirmDialogreject = true;
    },
    cancelapprove() {
      this.showConfirmDialogapprove = false;
    },
    cancelreject() {
      this.showConfirmDialogreject = false;
    },
    confirmApprove() {
      this.showConfirmDialogapprove = false;
      this.changeCompoffstatus("approve");
    },
    confirmReject() {
      this.showConfirmDialogreject = false;
      this.changeCompoffstatus("reject");
    },

    opencompoffdialog(unique_id, array, day_type) {
      this.dialogCompoff = [];
      this.task_desc_array = [];
      this.dialog_day_type = "";
      this.total_working_hours = 0;
      for (var i = 0; i < this.compoffDetails.length; i++) {
        if (this.compoffDetails[i].unique_id_compoff == unique_id) {
          this.task_desc_array.push(this.compoffDetails[i]);
          this.total_working_hours =
            this.total_working_hours + this.compoffDetails[i].no_of_hrs;
        }
      }
      this.dialogCompoff = array;
      this.dialog_day_type = day_type;
      this.compoffDialog = true;
    },

    changeCompoffstatus(sts) {
      this.compoffDialog = false;
      this.initval = true;
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "compoffstatuschange", {
          status: sts,
          id: this.compoff_id
        })
        .then(response => {
          if (response.data.status == "S") {
            this.fetchcompoffdetails();
            this.initval = false;
            this.flashMessage.success({
              message: response.data.message,
              time: 4000,
              blockClass: "custom-block-class"
            });
          }else if(response.data.status == "E"){
            this.valertdialogmessage = response.data.message;
            this.save_error=true;
            this.initval = false;

          }else{
            this.valertdialogmessage = response.data.message;
            this.save_error=true;
            this.initval = false;
          }
        })
        .catch(() => {
          this.valertdialogmessage = this.$t("something_went_wrong");
          this.save_error=true;
          this.initval = false;
        });
    },

    fetchcompoffdetails() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchappliedcompoffdetails")
        .then(res => {
          this.applied_compoff = res.data.appliedcompoff;
          this.compoffDetails = res.data.allcompoffs;
          this.initval = false;
        })
        .catch(err => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          console.log(" error" + err);
        });
    }
  }
};
</script>
<style scoped>
.compoffactionchip {
  margin-left: 6px;
  min-width: 68px;
  display: inline-flex;
}

.rejectstylespan {
  padding-left: 5px;
}

.etatakenindialogbox {
  position: absolute;
  bottom: 9px;
  right: 3px;
  font-size: 12px;
  font-weight: 500;
}

.activitydescriptionlayout {
  max-height: 250px;
  border: solid #d2c9c9 1px;
  overflow: auto;
  padding: 14px 15px;
}
</style> 