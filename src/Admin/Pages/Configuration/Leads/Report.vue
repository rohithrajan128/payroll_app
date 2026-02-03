<template>
  <div class="main-20">
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title
        class="col-md-4"
        :heading="$t('leads')"
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
            <router-link
              class="text-decoration-none"
              :to="{ name: 'leads_amend' }"
            >
              <v-icon color="primary" class="mr-4" size="35" dark v-on="on"
                >mdi-plus-circle</v-icon
              >
            </router-link>
          </template>
          <span>{{ $t("add_new") }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <img
              v-on="on"
              class="img_align img-responsive mr-2 image img_items"
              src="@/assets/images/xlsxicon.png"
              style="cursor: pointer"
              alt
              @click="downloadLeadsReport()"
            />
          </template>
          <span>{{ $t("download_leads") }}</span>
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
    <v-data-table
      :headers="headers"
      :items="leads_array"
      :loading="initval"
      :search="search"
    >
      <template v-slot:item="props">
        <tr>
          <td class="pl-4">
            <v-tooltip bottom v-if="props.item.favourite == 1">
              <template v-slot:activator="{ on }">
                <v-icon
                  color="amber"
                  class="favouritestaricon"
                  v-on="on"
                  @click="addtofavourite(props.item.id)"
                  >mdi-star</v-icon
                >
              </template>
              <span>{{ $t("fav") }}</span>
            </v-tooltip>
            <v-tooltip bottom v-else>
              <template v-slot:activator="{ on }">
                <v-icon
                  color="secondary"
                  v-on="on"
                  class="favouritestaricon"
                  @click="addtofavourite(props.item.id)"
                  >mdi-star-outline</v-icon
                >
              </template>
              <span>{{ $t("fav") }}</span>
            </v-tooltip>
          </td>
          <td style="word-wrap: anywhere">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <router-link
                  :to="{
                    name: 'lead_view',
                    query: {
                      id: props.item.id,
                    },
                  }"
                >
                  <span class="company_name"> {{ props.item.name }}</span>
                </router-link>
              </template>
              <span>{{ $t("view") }}</span>
            </v-tooltip>
          </td>
          <td>
            <span v-if="props.item.primary_contact">
              +{{ props.item.primary_contact.phone_code }}
              {{ props.item.primary_contact.contact_phone }}
            </span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <span v-if="props.item.phone && props.item.phone_code">
              +{{ props.item.phone_code }} {{ props.item.phone }}
            </span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td style="word-wrap: anywhere">
            {{ props.item.email }}
          </td>
          <td>
            <v-chip
              small
              dark
              color="#ff637e"
              v-if="props.item.lead_status == 'New'"
              outlined
              >{{ props.item.lead_status }}</v-chip
            >
            <v-chip
              small
              dark
              color="primary"
              v-if="props.item.lead_status == 'Keeping in touch'"
              outlined
              >{{ props.item.lead_status }}</v-chip
            >
            <v-chip
              small
              dark
              color="warning"
              v-if="props.item.lead_status == 'Looks promising'"
              outlined
              >{{ props.item.lead_status }}</v-chip
            >
            <v-chip
              small
              dark
              color="#794c8a"
              v-if="props.item.lead_status == 'Sales Ready'"
              outlined
              >{{ props.item.lead_status }}</v-chip
            >
            <v-chip
              small
              dark
              color="success"
              v-if="props.item.lead_status == 'Converted'"
              outlined
              >{{ props.item.lead_status }}</v-chip
            >
            <v-chip
              small
              dark
              color="red"
              v-if="props.item.lead_status == 'Disqualified'"
              outlined
              >{{ props.item.lead_status }}</v-chip
            >
          </td>
          <td>
            <span v-if="props.item.fetchcountry">
              {{ props.item.fetchcountry.name }}
            </span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>

          <td class="text-center">
            <router-link
              :to="{
                name: 'leads_amend',
                query: {
                  id: props.item.id,
                },
              }"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon class="mr-2 edit_btn icon_size" v-on="on"
                    >mdi-pencil-outline</v-icon
                  >
                </template>
                <span>{{ $t("edit") }}</span>
              </v-tooltip>
            </router-link>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  class="mr-2 edit_btn icon_size"
                  @click="deleteLeads(props.item.id)"
                  color="error"
                  v-on="on"
                  >mdi-trash-can-outline</v-icon
                >
              </template>
              <span>{{ $t("delete") }}</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
    </v-data-table>
    <div id="hiddentableexcel_format">
      <table border="1" ref="exportable_table" id="timesheet_table">
        <thead>
          <tr>
            <td colspan="2">Lead By Status</td>
            <td colspan="1"></td>
          </tr>
          <tr>
            <td colspan="2">New</td>
            <td colspan="1">{{ status_count.new }}</td>
          </tr>
          <tr>
            <td colspan="2">Keeping in Touch</td>
            <td colspan="1">{{ status_count.kit }}</td>
          </tr>
          <tr>
            <td colspan="2">Looks Promising</td>
            <td colspan="1">{{ status_count.lp }}</td>
          </tr>
          <tr>
            <td colspan="2">Sales Ready</td>
            <td colspan="1">{{ status_count.sr }}</td>
          </tr>
          <tr>
            <td colspan="2">Converted</td>
            <td colspan="1">{{ status_count.cnv }}</td>
          </tr>
          <tr>
            <td colspan="2">Disqualified</td>
            <td colspan="1">{{ status_count.dis }}</td>
          </tr>
          <tr></tr>
          <br />

          <tr>
            <th colspan="3">Financial Year Leads ({{ year_range }})</th>
            <th colspan="1"></th>
          </tr>

          <tr v-for="(month, index) in lead_months" :key="index">
            <td colspan="2">{{ month }}</td>
            <td colspan="1">{{ lead_counts[index] }}</td>
          </tr>

          <br />
          <tr></tr>

          <tr>
            <th>SL NO</th>
            <th>Company Name</th>
            <th>Contact No</th>
            <th>Email</th>
            <th>Status</th>
            <th>Lead Type</th>
            <th>Region</th>
            <th>Annual Revenue</th>
            <th>Company Size</th>
            <th>Deal Size</th>
            <th>Lead Source</th>
            <th>Industry Type</th>
            <th>Service Type</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in leads_export_array" :key="index">
            <td>{{ index + 1 }}</td>
            <td>
              <span v-if="data.name">{{ data.name }}</span>
              <span v-else>{{ $t("no_details") }}</span>
            </td>
            <td>
              <span v-if="data.phone"
                >+{{ data.phone_code }}-{{ data.phone }}</span
              >
              <span v-else>{{ $t("no_details") }}</span>
            </td>
            <td>
              <span v-if="data.email">{{ data.email }}</span>
              <span v-else>{{ $t("no_details") }}</span>
            </td>
            <td>
              <span v-if="data.lead_status">{{ data.lead_status }}</span>
              <span v-else>{{ $t("no_details") }}</span>
            </td>
            <td>
              <span v-if="data.lead_type">{{ data.lead_type }}</span>
              <span v-else>{{ $t("no_details") }}</span>
            </td>
            <td>
              <span v-if="data.region">{{ data.region }}</span>
              <span v-else>{{ $t("no_details") }}</span>
            </td>
            <td>
              <span v-if="data.currency"
                >{{ data.fetchcurrency.shortname }} {{ data.currency }}</span
              >
              <span v-else>{{ $t("no_details") }}</span>
            </td>

            <td>
              <span v-if="data.company_size">{{ data.company_size }}</span>
              <span v-else>{{ $t("no_details") }}</span>
            </td>
            <td>
              <span v-if="data.deal_size">{{ data.deal_size }}</span>
              <span v-else>{{ $t("no_details") }}</span>
            </td>
            <td>
              <span v-if="data.lead_source">{{ data.lead_source }}</span>
              <span v-else>{{ $t("no_details") }}</span>
            </td>
            <td>
              <span v-if="data.industry_type">{{ data.industry_type }}</span>
              <span v-else>{{ $t("no_details") }}</span>
            </td>
            <td>
              <span v-if="data.service_type">{{ data.service_type }}</span>
              <span v-else>{{ $t("no_details") }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <input type="text" v-model="name" />
      <button id="downloaddummybutton" @click="ExportExcel('xlsx')">
        Export table to excel xlsx
      </button>
    </div>
    <ConfirmDialog
      :show="showdeleteDialog"
      :cancel="canceldelete"
      :confirm="confirmdelete"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('want_to_delete_lead')"
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
import Tabs from "vue-tabs-with-active-line";
import ExcelJS from "exceljs";

const TABS = [
  {
    title: "All",
    value: "All",
  },
  {
    title: "New",
    value: "New",
  },
  {
    title: "Keeping in Touch",
    value: "Keeping in touch",
  },
  {
    title: "Looks Promising",
    value: "Looks promising",
  },
  {
    title: "Sales Ready",
    value: "Sales Ready",
  },
  {
    title: "Converted",
    value: "Converted",
  },
  {
    title: "Disqualified",
    value: "Disqualified",
  },
];

export default {
  watch: {
    "$route.query.status": {
      immediate: true,
      handler() {
        if (this.$route.query.status) {
          this.loader = true;
          this.currentTab = this.$route.query.status;
          this.user = JSON.parse(localStorage.getItem("user"));
          this.org_id = this.user.hr_employee.org_id;
          this.emp_id = this.user.emp_id;
          this.roles = this.user.hr_employee.emprole_name;
          this.fetchLeads(this.currentTab);
        }
      },
    },
  },
  components: {
    PageTitle,
    ConfirmDialog,
    Tabs,
  },
  data: () => ({
    tabs: TABS,
    currentTab: "All",
    user: [],
    user_id: "",
    leads_array: [],
    showStatusDialog: false,
    showdeleteDialog: false,
    initval: false,
    status_id: null,
    delete_id: null,
    next_seq: "",

    headers: [
      {
        text: "",
        align: "center",
        width: 0,
        value: "favourite",
      },
      {
        text: "Company Name",
        align: "left",
        value: "name",
        width: "180px",
      },
      {
        text: "Primary Contact",
        align: "left",
        value: "name",
      },
      {
        text: "Contact No",
        align: "left",
        value: "phone_code",
      },
      {
        text: "Email",
        align: "left",
        value: "email",
        width: "180px",
      },
      {
        text: "Status",
        align: "left",
        value: "lead_status",
      },

      {
        text: "Country",
        align: "left",
        value: "fetchcountry.name",
      },
      {
        text: "Actions",
        value: "",
        sortable: false,
        align: "center",
        width: "100px",
      },
    ],
    leads_export_array: [],
    google_icon: {
      icon_name: "supervisor_account",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
    org_id: null,
    emp_id: null,
    roles: [],
    year_range: "",
    lead_counts: [],
    lead_months: [],
    status_count: {},
  }),
  mounted() {
    if (!this.$route.query.status) {
      this.user = JSON.parse(localStorage.getItem("user"));
      this.org_id = this.user.hr_employee.org_id;
      this.emp_id = this.user.emp_id;
      this.roles = this.user.hr_employee.emprole_name;
      this.fetchLeads(this.currentTab);
      this.fetchLeadsExport();
    }
  },
  methods: {
    fetchLeadsExport() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_leads_export")
        .then((res) => {
          this.leads_export_array = res.data.leads;
          this.year_range = res.data.year_range;
          this.lead_months = res.data.months;
          this.lead_counts = res.data.lead_counts;
          this.status_count = res.data.count;
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
    downloadLeadsReport() {
      setTimeout(() => {
        document.getElementById("downloaddummybutton").click();
      }, 200);
    },
    ExportExcel(type, fn, dl) {
      const workbook = new ExcelJS.Workbook();

      const worksheet = workbook.addWorksheet("Leads");

      const table = this.$refs.exportable_table;

      const setHeader = {
        font: { bold: true, color: { argb: "FFFFFF" } },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "6c6cff" },
        },
      };
      const cellStyle = {
        font: { bold: true, color: { argb: "FFFFFF" } },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "6c6cff" },
        },
        border: {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        },
      };
      const setCellStyle = {
        font: { bold: true, color: { argb: "080800" } },
      };

      for (let i = 0; i < table.rows.length; i++) {
        const row = worksheet.addRow([]);
        for (let j = 0; j < table.rows[i].cells.length; j++) {
          const cell = table.rows[i].cells[j];
          const cellValue = cell.innerText;
          const excelCell = row.getCell(j + 1);

          // Apply cell styling
          excelCell.value = cellValue;

          if (
            excelCell._address == "A2" ||
            excelCell._address == "A3" ||
            excelCell._address == "A4" ||
            excelCell._address == "A5" ||
            excelCell._address == "A6" ||
            excelCell._address == "A7" ||
            excelCell._address == "A10" ||
            excelCell._address == "A11" ||
            excelCell._address == "A12" ||
            excelCell._address == "A13" ||
            excelCell._address == "A14" ||
            excelCell._address == "A15" ||
            excelCell._address == "A16" ||
            excelCell._address == "A17" ||
            excelCell._address == "A18" ||
            excelCell._address == "A19" ||
            excelCell._address == "A20" ||
            excelCell._address == "A21"
          ) {
            excelCell.style = setCellStyle;
          }
          if (
            excelCell._address == "A23" ||
            excelCell._address == "B23" ||
            excelCell._address == "C23" ||
            excelCell._address == "D23" ||
            excelCell._address == "E23" ||
            excelCell._address == "F23" ||
            excelCell._address == "G23" ||
            excelCell._address == "H23" ||
            excelCell._address == "I23" ||
            excelCell._address == "J23" ||
            excelCell._address == "K23" ||
            excelCell._address == "L23" ||
            excelCell._address == "M23"
          ) {
            excelCell.style = cellStyle;
          }
          if (
            excelCell._address == "A1" ||
            excelCell._address == "B1" ||
            excelCell._address == "A9" ||
            excelCell._address == "B9"
          ) {
            excelCell.style = setHeader;
          }

          // Calculate and set the column width based on the content length
          const cellContentLength = cellValue.length;
          const column = worksheet.getColumn(j + 1);
          const currentColumnWidth = column.width || 10;
          const newColumnWidth = Math.max(
            currentColumnWidth,
            cellContentLength + 2
          );
          column.width = newColumnWidth;
        }
      }
      let filename = "leads_report";
      if (dl) {
        const buffer = workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        let stringWithUnderscores = filename.replace(/\s+/g, "_");
        a.download = stringWithUnderscores + ".xlsx";
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        workbook.xlsx.writeBuffer().then((buffer) => {
          const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          let stringWithUnderscores = filename.replace(/\s+/g, "_");
          a.download = stringWithUnderscores + ".xlsx";
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(url);
          document.body.removeChild(a);
        });
      }
    },
    handleClick(newTab) {
      this.currentTab = newTab;
      this.fetchLeads(newTab);
    },
    cancelStatus() {
      this.showStatusDialog = false;
    },
    confirmStatus() {
      this.initval = true;
      this.statusUpdate();
      this.showStatusDialog = false;
      this.initval = false;
    },
    updateLeadsStatus(id) {
      this.status_id = id;
      this.showStatusDialog = true;
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
            this.fetchLeads(this.currentTab);
          } else {
            this.flashMessage.error({
              message: res.data.message,
            });
            this.fetchLeads(this.currentTab);
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
.img_items {
  width: 50px !important;
}
#hiddentableexcel_format {
  display: none;
}
.company_name:hover{
  font-weight: bold;
}
</style>