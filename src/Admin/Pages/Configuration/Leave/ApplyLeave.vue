<template>
  <div class="main-20">


    <div flat color="white" class="row py-5 pl-5 align-items-center">

      <page-title class="col-md-4" :heading="$t('leave_application_details')" :google_icon="google_icon"></page-title>

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
           v-on="on" v-model="search" append-icon="search" label="Search" class="srch_bar" 
            hide-details></v-text-field>
        </template>
        <span>{{ $t("search") }}</span>
      </v-tooltip>
</div>
     
     <div class="col-md-2">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <router-link :to="{
            name: 'createamendleave',
          }">
            <v-btn class="text-right mr-8 primary hover_shine " small v-on="on">
              {{ $t('applyleave') }}
            </v-btn>
          </router-link>
        </template>
        <span>{{ $t("applyleave") }}</span>
      </v-tooltip>
     </div>
      
    </div>


    <v-tabs>
        <Tabs
          :tabs="tabs"
          :currentTab="currentTab"
          :wrapper-class="'shadow-tabs inline-tabs align-self-center'"
          style="display: inline-flex"
          :tab-class="'tab-item'"
          :tab-active-class="'tab-item-active'"
          :line-class="'tab-item-line'"
          @onClick="handleClick"
        />
      </v-tabs>








<div v-if="currentTab=='applied_leaves'">
  <v-data-table :headers="headers" class="" :items="applied_leaves" :loading="initval" :search="search">
      <template v-slot:item="props">
        <tr>
          <td>
            <router-link class="text-decoration-none" style="color: white" :to="{
              name: 'createamendleave',
              query: {
                id: props.item.id,
              },
            }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-chip v-on="on" color="primary" small outlined medium class="leavedetailshoverchip">
                    {{ props.item.leavemasterdetails.leave_name }}</v-chip>
                </template>
                <span>{{ $t("view") }}</span>
              </v-tooltip>
            </router-link>
          </td>
          <td>{{ props.item.start_date | formatdateMonthyear }}</td>
          <td>{{ props.item.end_date | formatdateMonthyear }}</td>
          <td v-if="props.item.no_of_leaves.toString().length == 1"> {{ props.item.no_of_leaves }}.0</td>
          <td v-else> {{ props.item.no_of_leaves }}</td>
          <td>{{ props.item.created_at | formatdateMonthyear }}</td>
          <td>{{ props.item.advance_leave_period }} Days</td>
          <td>
            <v-chip :color="props.item.status_color" small  medium class="statusleavetd">
              {{ props.item.status }}</v-chip>
            </td>
        </tr>
      </template>
    </v-data-table>

</div>
<div v-if="currentTab=='availed_leaves'">

<LeaveHistory :search="search"></LeaveHistory>
</div>
    

  </div>
</template>


<script>

import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import Tabs from "vue-tabs-with-active-line";
import LeaveHistory from "@/Admin/Pages/Configuration/Leave/LeaveHistory.vue"
const TABS = [
  {
    title: "Applied Leaves",
    value: "applied_leaves"
  },
  {
    title: "Availed Leaves",
    value: "availed_leaves"
  }
];
export default {
  components: {
    PageTitle,
    Tabs,
    LeaveHistory
  },
  data: () => ({
    tabs:TABS,
    google_icon: {
      icon_name: "contact_mail",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
    initval: false,
    user: '',
    user_id: '',
    applied_leaves: [],
    currentTab:"applied_leaves",

    headers: [
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
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.user_id = this.user.emp_id;
  },
  watch: {
    user_id: {
      immediate: true,
      handler() {
        if(this.user_id>0){
          this.fetchallleaves();
        }
      },
    },
  },

  methods: {
    handleClick(newTab) {
      this.currentTab = newTab;
    },
    fetchallleaves() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchemployeependingleaves/" + this.user_id)
        .then((res) => {
          if(res.data.status == 'S'){
              this.applied_leaves = res.data.pendingleaves;
          this.initval = false;
          }
    
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          console.log(" error" + err);
        });
    },
  },

};
</script>
<style scoped>
.leavedetailshoverchip{
  /* min-width:100px; */
  display:block;
  text-align: center;
}
</style> 