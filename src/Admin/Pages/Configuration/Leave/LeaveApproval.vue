<template>
  <div class="main-20">
    <div flat color="white" class="row py-5 align-items-center">
      <page-title
        class="col-md-3"
        :heading="$t('leave_approval')"
        :google_icon="google_icon"
      ></page-title>
      <div class="col-md-4">
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

      <div class="col-md-4">
        <v-form class="row mt-3" ref="dateform" v-model="valid">
          <div class="col-md-5">
            <DatePicker
              :rules="fieldRules"
              :label="$t('start_date')"
              :stored_date="filter_start_date"
              @formatted_date="formattedStartDate"
            />
          </div>
          <div class="col-md-5">
            <DatePicker
              :rules="fieldRules"
              :label="$t('end_date')"
              :stored_date="filter_end_date"
              :min="filter_start_date"
              @formatted_date="formattedEndDate"
            />
          </div>

          <div class="col-md-2">
            <v-btn
              color="btn mr-2 mt-2 hover_shine add_new"
              @click="handleClick(currentTab, 'search')"
              small
              :disabled="isBtnLoading"
              class="ml-auto"
            >
              {{ $t("Search") }}
              <b-spinner small v-if="isBtnLoading"></b-spinner>
            </v-btn>
          </div>
        </v-form>
      </div>
    </div>
    <v-tabs>
      <Tabs
        :tabs="
          user.hr_employee.emprole_name.includes('HR')
            ? tabs
            : tabs.filter(
                (ele) =>
                  ele.value != 'leave_cancellation' &&
                  ele.value != 'escalated_leave'
              )
        "
        :currentTab="currentTab"
        :wrapper-class="'shadow-tabs inline-tabs align-self-center'"
        style="display: inline-flex"
        :tab-class="'tab-item'"
        :tab-active-class="'tab-item-active'"
        :line-class="'tab-item-line'"
        @onClick="handleClick"
      />
    </v-tabs>
    <div>
      <v-data-table
        :headers="headers"
        class="pt-8"
        :items="filtered_leave_details"
        :loading="initval"
        :search="search"
      >
        <template v-slot:item="props">
          <tr>
            <td>
              <router-link
                class="text-decoration-none"
                style="color: white"
                :to="{
                  name: 'leaveapproval_amend',
                  query: {
                    id: props.item.id,
                  },
                }"
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-chip
                      v-on="on"
                      color="primary"
                      small
                      outlined
                      medium
                      class="leavedetailshoverchip"
                      >{{ props.item.empnamefetch.Full_Code }}</v-chip
                    >
                  </template>
                  <span>{{ $t("view") }}</span>
                </v-tooltip>
              </router-link>
            </td>
            <td>{{ props.item.leavemasterdetails.leave_name }}</td>
            <td>{{ props.item.start_date | formatdateMonthyear }}</td>
            <td>{{ props.item.end_date | formatdateMonthyear }}</td>
            <td v-if="props.item.no_of_leaves.toString().length == 1">
              {{ props.item.no_of_leaves }}.0
            </td>
            <td v-else>{{ props.item.no_of_leaves }}</td>
            <td>{{ props.item.created_at | formatdateMonthyear }}</td>
            <td>{{ props.item.advance_leave_period }} Days</td>
            <td>
              <router-link
                class="text-decoration-none"
                style="color: white"
                :to="{
                  name: 'leaveapproval_amend',
                  query: {
                    id: props.item.id,
                  },
                }"
              >
                <v-chip
                  :color="props.item.status_color"
                  small
                  medium
                  class="statusleavetd leavedetailshoverchip"
                  >{{ props.item.status }}</v-chip
                >
              </router-link>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
    <!-- <div v-if="currentTab == 'approved'">
      <v-data-table
        :headers="headers"
        class="pt-8"
        :items="approved_leave_details"
        :loading="initval"
        :search="search"
      >
        <template v-slot:item="props">
          <tr>
            <td>
              <router-link
                class="text-decoration-none"
                style="color: white"
                :to="{
                  name: 'leaveapproval_amend',
                  query: {
                    id: props.item.id,
                  },
                }"
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-chip
                      v-on="on"
                      color="primary"
                      small
                      outlined
                      medium
                      class="leavedetailshoverchip"
                    >{{ props.item.empnamefetch.Full_Code }}</v-chip>
                  </template>
                  <span>{{ $t("view") }}</span>
                </v-tooltip>
              </router-link>
            </td>
            <td>{{ props.item.leavemasterdetails.leave_name }}</td>
            <td>{{ props.item.start_date | formatdateMonthyear }}</td>
            <td>{{ props.item.end_date | formatdateMonthyear }}</td>
            <td
              v-if="props.item.no_of_leaves.toString().length == 1"
            >{{ props.item.no_of_leaves }}.0</td>
            <td v-else>{{ props.item.no_of_leaves }}</td>
            <td>{{ props.item.created_at | formatdateMonthyear }}</td>
            <td>{{ props.item.advance_leave_period }} Days</td>
            <td>
              <router-link
                class="text-decoration-none"
                style="color: white"
                :to="{
                  name: 'leaveapproval_amend',
                  query: {
                    id: props.item.id,
                  },
                }"
              >
                <v-chip
                  :color="props.item.status_color"
                  small
                  medium
                  class="statusleavetd leavedetailshoverchip"
                >{{ props.item.status }}</v-chip>
              </router-link>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>-->
  </div>
</template>

<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import Tabs from "vue-tabs-with-active-line";
import DatePicker from "../Components/DatePicker.vue";

const TABS = [
  {
    title: "Show All",
    value: "show_all",
  },
  {
    title: "Awaiting Approval",
    value: "awaiting_approval",
  },
  {
    title: "Applied Leaves",
    value: "approved",
  },
  {
    title: "Leave Cancellation",
    value: "leave_cancellation",
  },
  {
    title: "Escalated Leave",
    value: "escalated_leave",
  },
];
export default {
  components: {
    PageTitle,
    Tabs,
    DatePicker,
  },
  data: () => ({
    valid: false,
    tabs: TABS,
    filtered_leave_details: [],
    filter_start_date: "",
    filter_end_date: "",
    google_icon: {
      icon_name: "fact_check",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    currentTab: "show_all",
    isBtnLoading: false,
    search: "",
    initval: false,
    user: "",
    user_id: "",
    applied_leaves: [],
    approved_leave_details: [],
    pending_leave_details: [],
    headers: [
      {
        text: "Applied By",
        align: "left",
        value: "empnamefetch.Full_Code",
      },
      {
        text: "Leave Type",
        align: "left",
        value: "leavemasterdetails.leave_name",
      },

      {
        text: "Start Date",
        value: "start_date",
        align: "left",
      },
      {
        text: "End Date",
        value: "end_date",
        align: "left",
      },
      {
        text: "No of Leave",
        value: "no_of_leaves",
        align: "left",
      },
      {
        text: "Leave Applied Date",
        value: "created_at",
        align: "left",
      },
      {
        text: "Advance Leave Period",
        value: "advance_leave_period",
        align: "left",
      },
      {
        text: "Status",
        value: "status",
        align: "left",
        sortable: false,
      },
    ],
  }),
  // mounted() {
  //   this.user = JSON.parse(localStorage.getItem("user"));
  //   this.user_id = this.user.emp_id;
  // },
  // watch: {
  //   user_id: {
  //     immediate: true,
  //     handler() {
  //       this.fetchapprovalleaves();
  //     },
  //   },
  // },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.user_id = this.user.emp_id;
  },
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },
  watch: {
    user_id: {
      immediate: true,
      handler() {
        if (this.user_id) {
          this.fetchapprovalleaves();
        }
      },
    },
  },

  methods: {
    FilterDate() {
      if (this.$refs.dateform.validate()) {
        this.filtered_leave_details = this.filtered_leave_details.filter(
          (ele) =>
            ele.start_date >= this.filter_start_date &&
            ele.end_date <= this.filter_end_date
        );
      }
    },
    formattedStartDate(formatted_date) {
      this.filter_end_date = "";
      this.filter_start_date = formatted_date;
    },
    formattedEndDate(formatted_date) {
      this.filter_end_date = formatted_date;
    },
    handleClick(newTab, search) {
      if (search == "search") {
        if (!this.$refs.dateform.validate()) {
          return;
        }
      }
      this.initval = true;
      this.currentTab = newTab;
      if (this.user.hr_employee.emprole_name.includes("HR")) {
        var CurrentDate = new Date().toISOString().slice(0, 10);
        if (newTab == "awaiting_approval") {
          this.filtered_leave_details = this.pending_leave_details.filter(
            (ele) => ele.status == "Pending" && ele.start_date > CurrentDate
          );
        } else if (newTab == "approved") {
          this.filtered_leave_details = this.pending_leave_details.filter(
            (ele) => ele.status != "Pending" && ele.status != "Waiting"
          );
        } else if (newTab == "leave_cancellation") {
          this.filtered_leave_details = this.pending_leave_details.filter(
            (ele) => ele.status == "Waiting"
          );
        } else if (newTab == "escalated_leave") {
          this.filtered_leave_details = this.pending_leave_details.filter(
            (ele) => ele.status == "Pending" && ele.start_date <= CurrentDate
          );
        } else {
          this.filtered_leave_details = this.pending_leave_details;
        }
      } else {
        if (newTab == "awaiting_approval") {
          this.filtered_leave_details = this.pending_leave_details.filter(
            (ele) => ele.status == "Pending"
          );
        } else if (newTab == "approved") {
          this.filtered_leave_details = this.pending_leave_details.filter(
            (ele) => ele.status != "Pending" && ele.status != "Waiting"
          );
        } else {
          this.filtered_leave_details = this.pending_leave_details;
        }
      }

      if (this.valid == true) {
        this.filtered_leave_details = this.filtered_leave_details.filter(
          (ele) =>
            ele.start_date >= this.filter_start_date &&
            ele.end_date <= this.filter_end_date
        );
      }
      this.initval = false;
    },
    fetchapprovalleaves() {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetchemployeeapprovalleaves/" +
            this.user_id
        )
        .then((res) => {
          this.pending_leave_details = res.data.LeavesApplied;
          this.filtered_leave_details = res.data.LeavesApplied;
          // this.applied_leaves.map(item => {
          //   if (item.status == "Pending" || item.status == "Waiting") {
          //     this.pending_leave_details.push(item);
          //   } else {
          //     this.approved_leave_details.push(item);
          //   }
          // });
          this.initval = false;
        })
        .catch((err) => {
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
</script>
<style scoped>
.srch_bar /deep/ .v-input__slot {
  max-width: 300px !important;
}
</style>
