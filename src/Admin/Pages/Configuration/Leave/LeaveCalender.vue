<template>
  <div class="main-20 h-100">
    <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
    <div></div>
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat>
            <v-btn small color="btn mr-2 mb-2 hover_shine add_new" @click="prev">
              <v-icon small>mdi-chevron-left</v-icon>
              {{ $t("previous") }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-toolbar-title v-if="$refs.calendar" class="calender_title">
              <page-title :heading="$t('leave_calender') + '-' + $refs.calendar.title"
                :google_icon="google_icon"></page-title>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-select v-model="type" :items="types" item-text="name" item-value="value" dense outlined hide-details class="ma-2 type_field"
              :label="$t('type')">
              </v-select>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on" class="d-inline-block mr-2">
                  <v-btn v-if="day_navigate == true" v-on="on" small @click="type = 'month'; day_navigate = false"
                    class="ma-1 font-weight-bold cancel-btn" color="dark cancel_button">{{ $t("cancel") }}</v-btn>
                </div>
              </template>
              <span>{{ $t("cancel") }}</span>
            </v-tooltip>
            <v-btn small color="btn mr-2 mb-2 hover_shine add_new" @click="next">
              {{ $t("next") }}
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
          </v-toolbar>
        </v-sheet>
        <v-sheet height="94%">
          <v-calendar ref="calendar" v-model="focus" color="primary" :events="events" @click:event="showEvent"
            @click:date="dateclick(focus)" :type="type"></v-calendar>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import VueElementLoading from "vue-element-loading";
import ChildIndexVue from "../Lookups/ChildIndex.vue";
export default {
  components: {
    PageTitle,
    VueElementLoading
  },
  data: () => ({
    google_icon: {
      icon_name: "calendar_today",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined"
    },
    type: "month",
    types: [{name:"Month",value:"month"},{name:"Week",value:"week"} , {name:"Day",value:"day"}],
    loader: true,
    day_navigate: false,
    event: "",
    focus: "",
    events: [],
    all_employee_details: []
  }),
  mounted() {
    this.fetchAllEmployeeLeaveDetail();
  },
  methods: {
    dayTypes(item){ 
    console.log(item);
    //  return item.charAt(0).toUpperCase() + item.slice(1) 
   },
    showEvent({ nativeEvent, event }) {
      this.open_date_task(event.leave_id);
      //  nativeEvent.stopPropagation();
    },
    open_date_task(leave_id) {
      this.$router.push({
        name: "leaveapproval_amend",
        query: {
          id: leave_id
        }
      });
    },

    dateclick(date) {
      this.day_navigate = true;
      console.log(date);
      this.type = "day";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    fetchAllEmployeeLeaveDetail() {
      (this.month_date = new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10)),
        axios
          .get(
            process.env.VUE_APP_API_URL_ADMIN + "fetch_all_emp_applied_leave"
          )
          .then(res => {
            this.loader = false;

            if (Array.isArray(res.data.message)) {
              this.array_data = res.data.message.toString();
            } else {
              this.array_data = res.data.message;
            }
            if (res.data.status == "S") {
              this.loader = false;

              this.all_employee_details = res.data.employee_applied_leave;
              for (let i = 0; i < this.all_employee_details.length; i++) {
                if (this.all_employee_details[i].status == 'Pending') {
                  var color = 'primary';
                } else if (this.all_employee_details[i].status == 'Cancelled') {
                  var color = 'warning';
                } else if (this.all_employee_details[i].status == 'Waiting') {
                  var color = 'yellow';

                } else if (this.all_employee_details[i].status == 'Approved') {
                  var color = 'success';

                } else if (this.all_employee_details[i].status == 'Rejected') {
                  var color = 'error';
                } else if (this.all_employee_details[i].status == 'LOP') {
                  var color = 'secondary';
                }
                this.events.push({
                  name: this.all_employee_details[i].empnamefetch.full_name,
                  start: this.all_employee_details[i].start_date,
                  end: this.all_employee_details[i].end_date,
                  leave_id: this.all_employee_details[i].id,
                  color: color
                });
              }
            } else if (res.data.status == "E") {
              this.loader = false;
              this.flashMessage.error({
                message: this.array_data,
                time: 4000,
                blockClass: "custom-block-class"
              });
            } else {
              this.loader = false;
              this.flashMessage.error({
                message: this.array_data,
                time: 4000,
                blockClass: "custom-block-class"
              });
              console.log("error message", array_data);
            }
          })
          .catch(err => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class"
            });
            console.log("error", err);
            this.loader = false;
          });
    }
  }
};
</script>
<style scoped>
.type_field {
  max-width: 125px !important;
}
</style>