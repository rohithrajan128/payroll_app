<template>
    <div>
      <page-title
        :heading="$t('job_openings')"
        :google_icon="google_icon"
      ></page-title>
      <div class="row justify-content-center">
        <ComingSoon></ComingSoon>
      </div>
    </div>
  </template>
  
  <script>
  import PageTitle from "../../../../Layout/Components/PageTitle.vue";
  import ComingSoon from "../../../Pages/ComingSoon.vue";
  
  export default {
    components: {
      PageTitle,
      ComingSoon,
    },
    data: () => ({
      dashboarddata: [],
      user:[],
      google_icon: {
        icon_name: "curtains",
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
  