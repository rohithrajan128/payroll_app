<template>
  <div class="main-20">
    <div class="row pr-9 mb-3">
      <div class="col-md-3">
      </div>
      <div class="col-md-9">
        <v-layout wrap class="justify-content-end">
          <v-flex md2 v-for="(leave, index) in leavebalancedata" :key="index">
            <v-card class="ms-auto mainvcardleave">
              <div class="leavedetailscard">{{ leave.leave_name }}</div>
              <div class="leavecountcard">
                <span>{{ leave.no_of_leaves }}</span
                ><span> / </span><span>{{ leave.leave_balance }}</span>
              </div>
            </v-card>
          </v-flex>
        </v-layout>
      </div>
    </div>
    <div class="filter-block">
      <div class="pr-2" style="width: 185px;">
        <v-autocomplete
          class="ms-auto"
          dense
          outlined
          v-model="leave_filter.financial_year"
          :items="financial_year_array"
          @change="fetchallleaves"
          item-text="financial_year"
          item-value="id"
          v-bind:label="$t('financial_year')"
        ></v-autocomplete>
      </div>
      <div>
        <v-autocomplete
          dense
          outlined
          v-model="leave_filter.leave_type"
          :items="leave_type_array"
          @change="fetchallleaves"
          item-text="leave_name"
          item-value="id"
          v-bind:label="$t('leave_type')"
        ></v-autocomplete>
      </div>
    </div>
    <LeaveCount :data="leave_data"></LeaveCount>
    <!-- <v-data-table
      :headers="headers"
      class="pt-5 elevation-1"
      :items="applied_leaves"
      :loading="initval"
      :search="search"
    >
      <template v-slot:item="props">
        <tr>
          <td>
            <v-chip color="primary" small outlined medium class="">
              {{ props.item.leavemasterdetails.leave_name }}</v-chip
            >
          </td>
          <td>{{ props.item.start_date | formatdateMonthyear }}</td>
          <td>{{ props.item.end_date | formatdateMonthyear }}</td>
          <td v-if="props.item.no_of_leaves.toString().length == 1">
            {{ props.item.no_of_leaves }}.0
          </td>
          <td v-else>{{ props.item.no_of_leaves }}</td>
          <td>{{ props.item.created_at | formatdateMonthyear }}</td>
          <td>{{ props.item.advance_leave_period }} Days</td>
          <td>{{ props.item.current_approver }}</td>
          <td>
            <v-chip
              :color="props.item.status_color"
              small
              medium
              class="statusleavetd"
            >
              {{ props.item.status }}</v-chip
            >
          </td>
        </tr>
      </template>
    </v-data-table> -->
  </div>
</template>

<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import DatePicker from "../Components/DatePicker.vue";
import LeaveCount from "./LeaveCount.vue";
export default {
  props: ["user_id", "view"],
  components: {
    PageTitle,
    DatePicker,
    LeaveCount,
  },
  data: () => ({
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    search: "",
    initval: false,
    leave_data: {},
    financial_year_array: [],
    leave_type_array: [],
    leavebalancedata: [],
    leave_filter: {
      financial_year: "",
      leave_type: "",
    },
    headers: [
      {
        text: "Applied",
        // align: "left",
        value: "leavemasterdetails.leave_name",
      },

      {
        text: "Approved",
        // value: "start_date",
        align: "left",
      },
      {
        text: "Cancelled",
        // value: "end_date",
        align: "left",
      },
      {
        text: "Escalated",
        // value: "no_of_leaves",
        align: "left",
      },
      {
        text: "Lop",
        // value: "created_at",
        align: "left",
      },
      {
        text: "Pending",
        // value: "advance_leave_period",
        align: "left",
      },
      {
        text: "Rejected",
        // value: "current_approver",
        align: "left",
      },
      {
        text: "Waiting",
        // value: "status",
        align: "left",
      },
    ],
  }),
  mounted() {},
  watch: {
    user_id: {
      immediate: true,
      handler() {
        this.fectleavesandfinancialyear();
        this.fetchleavecounts();
      },
    },
  },

  methods: {
    fetchallleaves() {
      this.initval = true;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "fetchemployeeleavesdeatils",
          {
            user_id: this.user_id,
            financial_year: this.leave_filter.financial_year,
            leave_type: this.leave_filter.leave_type,
          }
        )
        .then((res) => {
          this.leave_data = res.data.leave_data;
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

    fectleavesandfinancialyear() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchleavesandfinancialyear")
        .then((res) => {
          this.financial_year_array = res.data.financial_year;
          this.leave_type_array = res.data.leave_type;
          if (this.financial_year_array.length != 0) {
            this.financial_year_array.unshift({
              id: 0,
              financial_year: "All",
            });
          }
          if (this.leave_type_array.length != 0) {
            this.leave_type_array.unshift({
              id: 0,
              leave_name: "All",
            });
          }
          this.leave_filter.financial_year = res.data.default_year;
          this.leave_filter.leave_type = 0;
          this.initval = false;
          this.fetchallleaves();
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          this.initval = false;
        });
    },

    fetchleavecounts() {
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetchallleavebalanacedetails/" +
            this.user_id
        )
        .then((res) => {
          this.leavebalancedata = res.data.leavebalancedetails;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style scoped>
.leavecountcard {
  text-align: center;
  font-size: 17px;
  /* font-family: sans-serif; */
  font-weight: 500;
}

.leavedetailscard {
  font-size: 11px;
  text-align: center;
  font-weight: 500;
  /* font-family: "Roboto"; */
  background-color: rgb(22, 113, 205);
  height: 24px;
  color: #eeeeee;
  padding-top: 4px;
}
.mainvcardleave {
  max-width: 89px;
  height: 53px;
}
/* .title {
  text-wrap: nowrap;
} */

.filter-block{
  display: flex;
  width: fit-content;
  position: absolute;
  top: 80px;
  padding: 0px 10px;
}
</style>
