<template>
  <div class="container-fluid px-5 main-20">
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title class="col-md-4" :heading="$t('employee_details')" :google_icon="google_icon"></page-title>
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
      <div class="col-md-2">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <router-link
              class="text-decoration-none"
              :to="{ name: 'employee_creation' }"
            >
              <v-btn
                color=" btn mr-2 mb-2 hover_shine add_new"
                small
                class="mb-2"
                v-on="on"
              >{{ $t("create_emp") }}</v-btn>
            </router-link>
          </template>
          <span>{{ $t("create_emp") }}</span>
        </v-tooltip>
      </div>
    </div>

    <div>
      <!-- <v-row>
          <v-spacer></v-spacer>
          <v-col class="username_display">
            <b><v-icon medium color="grey">mdi-account</v-icon>{{user_name}}</b>
          </v-col>
      </v-row>-->
      <!-- <v-app-bar flat color="white"> 
      </v-app-bar>-->
      <v-tabs>
      <Tabs
        :tabs="tabs"
        :currentTab="currentTab"
        :wrapper-class="'shadow-tabs inline-tabs align-self-center'"
        :tab-class="'tab-item'"
        :tab-active-class="'tab-item-active'"
        :line-class="'tab-item-line'"
        @onClick="handleClick"
      />
    </v-tabs>
    <div v-if="currentTab=='active_employees'">
      <ActiveEmployees :search="search" />
    </div>
    <div v-if="currentTab=='inactive_employees'">
      <InactiveEmployees :search="search" />
    </div>


     
    </div>
  </div>
</template> 
  <script>
import PageTitle from "../../Layout/Components/PageTitle.vue";
import ActiveEmployees from "../Pages/Configuration/employees/ActiveEmployees.vue";
import InactiveEmployees from "../Pages/Configuration/employees/InactiveEmployees.vue";
import Tabs from "vue-tabs-with-active-line";

const TABS = [
  {
    title: "Active Employees",
    value: "active_employees"
  },
  {
    title: "Inactive Employees",
    value: "inactive_employees"
  }
];

export default {
  components: {
    ActiveEmployees,
    InactiveEmployees,
    PageTitle,	
    Tabs
    // EmpEpfoAccountDetails
  },
  data: () => ({
    tabs:TABS,
    currentTab:"active_employees",
    google_icon: {
      icon_name: "badge",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined"
    },
    search:""
  }),
  mounted() {},
  watch: {},

  methods: {
    handleClick(newTab) {
      this.currentTab = newTab;
    },
  }
};
</script>
  <style scoped>
/* .username_display {
    color: grey;
    font-family: Georgia, "Times New Roman", Times, serif;
    font-size: 18px;
    margin-bottom: 20px;
    margin-right: 5px;
  width: auto;
    text-align: right;
  }
  .main_card /deep/ .nav {
      flex-wrap:nowrap !important;
      width:100% !important;
  }
  .main_card /deep/.nav-link{
    padding: 0.3rem !important;
  }
  .main_card /deep/.nav-tabs{
    justify-content:space-between !important;
  }*/
.addnewemployeeinhrview {
  position: absolute;
  right: 10px;
  top: 25px;
}
</style> 