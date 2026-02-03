<template>
  <div class="">
    <div class="">
      <div class="d-flex">
        <div class="page-title-icon">
          <i :class="google_icon.icon"><span :class="google_icon.color">{{google_icon.icon_name}}</span></i>
        </div>
        <div class="">
         <p class="heading ml-2">{{heading}}</p> 
          <div class="page-title-subheading">{{subheading}}</div>
        </div>
      </div>
      <div class="page-title-actions">
       
      </div>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faStar, faPlus } from "@fortawesome/free-solid-svg-icons";


library.add(faStar, faPlus);

export default {
  components: {
   
  },
  props: { 
    heading: String,
    subheading: String,
    google_icon:Object
  }
};
</script>
<style scoped>
.heading{
  font-size:18px;
  margin-bottom: 0px !important;
}
</style>