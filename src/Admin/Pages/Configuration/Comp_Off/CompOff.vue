<template>
    <div>
      <!-- <page-title
        :heading="$t('compoff_history')"
        :google_icon="google_icon"
      ></page-title> -->
      <!-- <div class="row justify-content-center"> -->
        <compoffapproval></compoffapproval>
      </div>
    <!-- </div> -->
  </template>
  
  <script>
  import PageTitle from "../../../../Layout/Components/PageTitle.vue";
  import compoffapproval from "../Comp_Off/CompOffApproval.vue"
  
  export default {
    components: {
      PageTitle,
      compoffapproval,
    },
    data: () => ({
      dashboarddata: [],
      user:[],
      google_icon: {
        icon_name: "history",
        color: "google_icon_gradient",
        icon: "material-symbols-outlined",
      },
    }),
    created() {
    
    },
    methods: {
 
    },
  };
  </script>
  