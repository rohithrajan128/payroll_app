<template>
  <div class="main-20 p-2">
    <div flat color="white" class="row pt-2 align-items-center">
      <page-title
        class="col-md-12"
        :heading="$t('dashboard')"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <VueElementLoading
      :active="loader"
      spinner="bar-fade-scale"
      color="var(--primary)"
    />
    <div class="row mt-2">
      <div class="col-md-9">
        <div class="mb-2">
          <div class="lead_by_status">{{ $t("lead_by_status") }}</div>
        </div>
        <div class="row">
          <div class="col-md-2 count-data" @click="redirectTo('New')">
            <v-card class="card-height border-rose">
              <p class="px-2 pt-2 m-0 font-weight-bold text-rose">
                {{ $t("new") }}
              </p>
              <p class="all_card_font text-center w-100 text-rose">
                {{ count.new }}
              </p>
            </v-card>
          </div>
          <div
            class="col-md-2 count-data"
            @click="redirectTo('Keeping in touch')"
          >
            <v-card class="card-height border-primary card">
              <p class="px-2 pt-2 m-0 font-weight-bold text-primary">
                {{ $t("keeping_in_touch") }}
              </p>
              <p class="all_card_font text-center w-100 text-primary">
                {{ count.kit }}
              </p>
            </v-card>
          </div>
          <div
            class="col-md-2 count-data"
            @click="redirectTo('Looks promising')"
          >
            <v-card class="card-height border-warning">
              <p class="px-2 pt-2 m-0 font-weight-bold text-warning">
                {{ $t("looks_promising") }}
              </p>
              <p class="all_card_font text-center w-100 text-warning">
                {{ count.lp }}
              </p>
            </v-card>
          </div>
          <div class="col-md-2 count-data" @click="redirectTo('Sales Ready')">
            <v-card class="card-height border-alternate">
              <p class="px-2 pt-2 m-0 font-weight-bold text-alternate">
                {{ $t("sales_ready") }}
              </p>
              <p class="all_card_font text-center w-100 text-alternate">
                {{ count.sr }}
              </p>
            </v-card>
          </div>
          <div class="col-md-2 count-data" @click="redirectTo('Converted')">
            <v-card class="card-height border-success">
              <p class="px-2 pt-2 m-0 font-weight-bold text-success">
                {{ $t("converted") }}
              </p>
              <p class="all_card_font text-center w-100 text-success">
                {{ count.cnv }}
              </p>
            </v-card>
          </div>
          <div class="col-md-2 count-data" @click="redirectTo('Disqualified')">
            <v-card class="card-height border-danger">
              <p class="px-2 pt-2 m-0 font-weight-bold text-danger">
                {{ $t("disqualified") }}
              </p>
              <p class="all_card_font text-center w-100 text-danger">
                {{ count.dis }}
              </p>
            </v-card>
          </div>
        </div>
        <v-divider></v-divider>
        <div class="mt-5 mb-2 row">
          <div class="col-md-7">
            <div class="lead_by_status">{{ $t("leads_chart") }}</div>
            <div v-if="show_chart" class="chart-container">
              <VueApexCharts
                :width="screenWidth / 3.2"
                type="line"
                :options="options"
                :series="series"
              ></VueApexCharts>
            </div>
            <div v-else class="chart-loader">
              <VueElementLoading
                active
                spinner="bar-fade-scale"
                color="var(--primary)"
                text="Loading data..."
              />
            </div>
          </div>
          <div class="col-md-5">
            <TaskCounter></TaskCounter>
          </div>
        </div>
      </div>
      <div class="col-md-3 pl-0 pt-0">
        <div class="right-timeline-container">
          <v-card elevation="1">
            <UpcomingTasksWidget></UpcomingTasksWidget>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import VueElementLoading from "vue-element-loading";
import VueApexCharts from "vue-apexcharts";
import UpcomingTasksWidget from "./UpcomingTasksWidget.vue";
import TaskCounter from "./TaskCounter.vue";

export default {
  components: {
    PageTitle,
    VueElementLoading,
    VueApexCharts,
    UpcomingTasksWidget,
    TaskCounter,
  },
  data: () => ({
    screenWidth: window.innerWidth,
    google_icon: {
      icon_name: "dashboard",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    loader: false,
    count: {
      new: 0,
      kit: 0,
      lp: 0,
      sr: 0,
      cnv: 0,
      dis: 0,
    },
    org_id: null,
    emp_id: null,
    roles: [],
    show_chart: true,
    options: {
      chart: {
        id: "vuechart",
      },
      xaxis: {
        categories: [],
        title: {
          text: "Month",
        },
      },
      yaxis: {
        min: 0,
        max: 50,
        title: {
          text: "Lead Count",
          style: {
            color: "#269ffb",
          },
        },
      },
      markers: {
        size: 2,
      },
    },
    series: [
      {
        name: "Leads",
        data: [],
      },
    ],
    upcoming_followup: [],
    upcoming_meetings: [],
  }),
  async mounted() {
    this.user = await JSON.parse(localStorage.getItem("user"));
    this.org_id = this.user.hr_employee.org_id;
    this.emp_id = this.user.emp_id;
    this.roles = this.user.hr_employee.emprole_name;
    this.fetchLeadCount();
    this.fetchLeadChart();
    window.addEventListener("resize", this.handleResize);
  },

  methods: {
    redirectTo(status) {
      this.$router.push({
        name: "leadsreport",
        query: {
          status: status,
        },
      });
    },
    handleResize() {
      this.screenWidth = window.innerWidth;
    },

    fetchLeadCount() {
      this.loader = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_lead_count", {
          params: {
            org_id: this.org_id,
            emp_id: this.emp_id,
            roles: this.roles,
          },
        })
        .then((res) => {
          this.loader = false;
          if (res.data.status == "S") {
            this.count = res.data.count;
          } else if (res.data.status == "E") {
            this.message = res.data.message;
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
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
          console.log(" error" + err);
        });
    },
    fetchLeadChart() {
      this.loader = true;
      this.show_chart = false;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_lead_chart", {
          params: {
            org_id: this.org_id,
            emp_id: this.emp_id,
            roles: this.roles,
          },
        })
        .then((res) => {
          this.loader = false;
          if (res.data.status == "S") {
            this.options.xaxis.categories = res.data.months;
            this.options.yaxis.title.text =
              "Lead Count (" + res.data.year_range + ")";
            this.series[0].data = res.data.lead_counts;
            this.show_chart = true;
          } else if (res.data.status == "E") {
            this.message = res.data.message;
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
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
          console.log(" error" + err);
        });
    },
  },
};
</script>
<style scoped>
.upcoming_interview_title {
  font-size: 14px;
  font-weight: bold;
  margin-top: -8px;
}
.activity_font {
  margin: 24px 0px 33px 13px;
  font-weight: bold;
  font-size: 16px;
}
.card-height {
  height: 105px;
  border-bottom: 3px solid;
  border-radius: 10px 10px 10px 10px;
}
.all_card_font {
  text-align: center;
  font-size: 40px;
  margin: 0px;
  font-weight: bold;
  position: absolute;
  bottom: 8px;
}

.text-hover:hover {
  color: green;
  font-weight: bold;
  cursor: pointer;
}
.text-hover-closed:hover {
  color: red;
  font-weight: bold;
  cursor: pointer;
}
.border-color-candidates {
  border-color: #14a6b1 !important;
}
.candidate_height {
  height: 100px;
}

.interview_border {
  background: #d6e9fd;
  height: 70px;
  margin: 10px;
  border-radius: 7px 7px 7px 7px;
  border-left: 5px solid #2b85df !important;
  padding: 10px;
  border: 1px solid aliceblue;
}
.display_interview {
  color: gray;
  font-size: 12px;
}
.candidate_hover:hover {
  color: #16aaff;
  cursor: pointer;
  font-weight: bold;
}
.cursor_pointer {
  cursor: pointer;
  transition: transform 0.5s;
}
.cursor_pointer:hover {
  transform: scale(1.05);
  font-weight: bold;
}
.link_color {
  /* color: #3f6ad8 !important; */
  position: absolute;
  right: 10px;
  top: 10px;
}
.v-tabs >>> .v-item-group {
  position: relative !important;
}
.time_line_card {
  width: 100%;
  overflow-y: scroll;
  top: -42px;
  right: -12px;
  height: 50vh;
}
.lead_by_status {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
}
.chart-container >>> .apexcharts-canvas {
  background: white !important;
  border-bottom: 2px solid #269ffb;
  border-top: 2px solid #269ffb;
  border-radius: 14px;
}
.chart-container {
  margin-left: -18px;
}

/* .tabs__item .tabs__item_active .tab-item-active .tab-item {
  width: 105px !important;
  height: 55px !important;
}
.tabs__active-line .tab-item-line {
  width: 105px !important;
  height: 55px !important;
} */
.lead-tabs-dashboard {
  position: sticky;
  top: 0px;
  z-index: 10;
  background: white;
}
.lead-tabs-dashboard >>> .tab-item-active {
  width: 105px !important;
  height: 55px !important;
}
.lead-tabs-dashboard >>> .tab-item-line {
  width: 105px !important;
  height: 55px !important;
}
.lead-tabs-dashboard >>> .tab-item {
  width: 105px !important;
  height: 55px !important;
}
.call_logs_card {
  width: 100%;
  overflow-y: scroll;
  top: 300px;
  right: -12px;
  height: 39vh;
}
.uc-calls {
  font-size: 16px;
  font-weight: bold;
  padding-left: 10px;
  padding-top: 5px;
}
.right-timeline-container {
  position: fixed;
  top: 64px;
  padding-right: 8px;
  min-width: 20.5%;
}

.count-data {
  transform: scaleY(1);
  transition: transform 0.3s ease;
}
.count-data:hover {
  cursor: pointer;
  transform: scaleY(1.1);
}
.chart-loader {
  background: #cfcfcf !important;
  width: 95%;
  border-radius: 20px !important;
}
.chart-loader >>> .velmld-overlay {
  border-radius: 20px !important;
}
</style>
