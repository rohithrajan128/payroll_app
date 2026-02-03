
<template>
  <div>
    <div class="mt-10">      
      <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
    </div>
   
    <div v-if="showdetails">
      <div>
        <div class="d-flex jd-top-header">
          <h5 class="job-title text-capitalize">
            {{ selected_candidate.firstname }} {{ selected_candidate.lastname }}
          </h5>
        </div>
        <div class="d-flex mb-2">
                <!-- <span class="desc-title">{{ $t("designation") }}</span> -->
                <span v-if="selected_candidate.designation_id == null">{{
                  $t("not_appllicable")
                }}</span>
                <span class="desc-content-width" v-else>{{
                  selected_candidate.designationlookupdetails.shortname
                }}</span>
              </div>
               <div class="d-flex mb-2">
                <!-- <span class="desc-title">{{ $t("designation") }}</span> -->
                <span v-if="selected_candidate.userdetails.auto_gen_emp_id == null">{{
                  $t("not_appllicable")
                }}</span>
                <span class="desc-content-width" v-else>{{
                  selected_candidate.userdetails.auto_gen_emp_id
                }}</span>
              </div>
              
        <!-- <v-divider></v-divider> -->
      </div>
      <!-- <div class="row justify-content-between">
        <div class="col-sm-5">
          <div class="row">
            <div class="col-sm-3">
              <div class="d-flex mb-2">
                <span class="desc-title">{{ $t("email") }} </span>
                <span v-if="selected_candidate.userdetails.email">:&nbsp;{{ $t("not_appllicable") }}</span>
                <span class="desc-content-width" v-else>:&nbsp;{{ selected_candidate.userdetails.email }}</span>
              </div>
              <div class="d-flex mb-2">
                <span class="desc-title">{{ $t("dob") }}</span>
                <span v-if="selected_candidate.dob == null">:&nbsp;{{ $t("not_appllicable") }}</span>
                <span class="desc-content-width" v-else>:&nbsp;{{ selected_candidate.dob | formatDate }}</span>
              </div>
              <div class="d-flex mb-2">
                <span class="desc-title">{{ $t("blood_group") }}</span>
                <span v-if="selected_candidate.blood_group == null">:&nbsp;{{
                  $t("not_appllicable")
                }}</span>
                <span class="desc-content-width" v-else>:&nbsp;{{
                  selected_candidate.bloodgrouplookupdetails.shortname
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-5">
          <div class="row">
            <div class="d-flex mb-2 mt-3">
                <span class="desc-title">{{ $t("role") }}</span>
                <span v-if="selected_candidate.userdetails.rolename == null">:&nbsp;{{ $t("not_appllicable") }}</span>
                <span style="margin-left:1px;" class="desc-content-width" v-else>:
                  <div class="rolechipclass"> <v-chip  color="primary" small v-for="(role , index) in selected_candidate.employee_roles" :key="index"
                  class="mr-1 mb-3">
                    {{ role.role_details.rolename }}
                  </v-chip></div>
                 </span>
              </div>
            <div class="d-flex mb-2 ">
              <span class="desc-title">{{ $t("emp_type") }}</span>
              <span v-if="selected_candidate.emp_type == null">:&nbsp;{{
                $t("not_appllicable")
              }}</span>
              <span class="desc-content-width" v-else>:&nbsp;{{
                selected_candidate.emptypelookupdetails.shortname
              }}</span>
            </div>
            <div class="d-flex mb-2">
              <span class="desc-title">{{ $t("emp_no") }}</span>
              <span v-if="selected_candidate.empno == null">:&nbsp;{{ $t("not_appllicable") }}</span>
              <span class="desc-content-width" v-else>:&nbsp;{{ selected_candidate.empno }}</span>
            </div>
            
           
                  
          </div>
        </div>
      </div> -->
      <!-- <v-row class="text-right mt-5">
       
        <v-col>
          <v-btn v-if="!showmoredetails" text small color="blue" @click="showmoredetails = !showmoredetails">More
            Details<v-icon small>mdi-chevron-double-down</v-icon></v-btn>
          <v-btn v-else text small color="blue" @click="showmoredetails = !showmoredetails">Less Details<v-icon
              small>mdi-chevron-double-up</v-icon></v-btn>
        </v-col>
      </v-row> -->
      <div class="row justify-content-between" v-if="showmoredetails">
        
        <div class="col-sm-5">
          <div class="row">
            <div class="col-sm-3">
              <div class="d-flex mb-2">
                <span class="desc-title">{{ $t("gender") }}</span>
                <span v-if="selected_candidate.gender == null">:&nbsp;{{ $t("not_appllicable") }}</span>
                <span class="desc-content-width" v-else>:&nbsp;{{ selected_candidate.gender }}</span>
              </div>
             
           
              <div class="d-flex mb-2">
                <span class="desc-title">{{ $t("martial_status") }}</span>
                <span v-if="selected_candidate.maritalstatus_id == null">:&nbsp;{{
                  $t("not_appllicable")
                }}</span>
                <span class="desc-content-width"
                  v-else>:&nbsp;{{ selected_candidate.martialstatuslookupdetails.shortname }}</span>
              </div>
              <div class="d-flex mb-2">
                <span class="desc-title">{{ $t("Joining_date") }}</span>
                <span v-if="selected_candidate.Joining_date == null">:&nbsp;{{ $t("not_appllicable") }}</span>
                <span class="desc-content-width" v-else>:&nbsp;{{ selected_candidate.Joining_date }}</span>
              </div>
              <div class="d-flex mb-2">
                <span class="desc-title">{{ $t("mode_of_transfer") }}</span>
                <span v-if="selected_candidate.mode_of_transfer == null">:&nbsp;{{ $t("not_appllicable") }}</span>
                <span class="desc-content-width" v-else>:&nbsp;{{ selected_candidate.mode_of_transfer }}</span>
              </div>
              <div class="d-flex mb-2">
                <span class="desc-title">{{ $t("religion") }}</span>
                <span v-if="selected_candidate.religion_id == null">:&nbsp;{{
                  $t("not_appllicable")
                }}</span>
                <span class="desc-content-width" v-else>:&nbsp;{{
                  selected_candidate.religionlookupdetails.shortname
                }}</span>
              </div>
              <div class="d-flex mb-2">
                <span class="desc-title">{{ $t("account_no") }}</span>
                <span v-if="selected_candidate.unique_account_no == null">:&nbsp;{{ $t("not_appllicable") }}</span>
                <span class="desc-content-width" v-else>:&nbsp;{{ selected_candidate.unique_account_no }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-5">
          <div class="row">
            <div class="col-sm-3">

              <div class="d-flex mb-2">
                <span class="desc-title">{{ $t("title") }}</span>
                <span v-if="selected_candidate.title == null">:&nbsp;{{ $t("not_appllicable") }}</span>
                <span class="desc-content-width" v-else>:&nbsp;{{ selected_candidate.title }}</span>
              </div>
              <div class="d-flex mb-2">
                <span class="desc-title">{{ $t("identity_nark") }}</span>
                <span v-if="selected_candidate.identity_mark == null">:&nbsp;{{ $t("not_appllicable") }}</span>
                <span class="desc-content-width" v-else>:&nbsp;{{ selected_candidate.identity_mark }}</span>
              </div>

              <div class="d-flex mb-2">
                <span class="desc-title">{{ $t("height") }}</span>
                <span v-if="selected_candidate.height == null">:&nbsp;{{ $t("not_appllicable") }}</span>
                <span class="desc-content-width" v-else>:&nbsp;{{ selected_candidate.height }} cm</span>
              </div>
              <div class="d-flex mb-2">
                <span class="desc-title">{{ $t("weight") }}</span>
                <span v-if="selected_candidate.weight == null">:&nbsp;{{ $t("not_appllicable") }}</span>
                <span class="desc-content-width" v-else>:&nbsp;{{ selected_candidate.weight }} kg</span>
              </div>
              <div class="d-flex mb-2">
                <span class="desc-title">{{ $t("designation") }}</span>
                <span v-if="selected_candidate.designation_id == null">:&nbsp;{{
                  $t("not_appllicable")
                }}</span>
                <span class="desc-content-width" v-else>:&nbsp;{{
                  selected_candidate.designationlookupdetails.shortname
                }}</span>
              </div>
              <div class="d-flex mb-2">
                <span class="desc-title">{{ $t("nationality") }}</span>
                <span v-if="selected_candidate.nationality_id == null">:&nbsp;{{
                  $t("not_appllicable")
                }}</span>
                <span class="desc-content-width" v-else>:&nbsp;{{
                  selected_candidate.nationalitylookupdetails.shortname
                }}</span>
              </div>
            </div>
          </div>
        </div>

       </div>
    </div> 
  </div>

</template>
<script>
import VueElementLoading from "vue-element-loading";

export default {
  components: {
    VueElementLoading,
  },
  props: ["selected_candidate_slug", "userView", "user_data","userRoles"],
  data: () => ({
    selected_candidate: "",
    loader: true,
    showdetails: false,
    showmoredetails: false,
  }),
  watch: {
    selected_candidate_slug: {
      immediate: true,
      handler() {
        this.user = JSON.parse(localStorage.getItem("user"));
        if (this.selected_candidate_slug) {
       this.fetchUserDetails();
        }
      },
    },
    userRoles:{
      immediate: true,
      handler() {
        if(this.userRoles){
        this.fetchUserDetails();
        }
      },
    }
  },
  methods:{
    fetchUserDetails(){
      axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
              "fetchuserbyslug?slug=" +
              this.selected_candidate_slug
            )
            .then((res) => {
              this.loader = false;
              if (res.data.status == "S") {
                if (this.userView == "1") {
                  this.selected_candidate = res.data.user;
                  this.loader = false;
                  this.showdetails = true;
                }
              } else if (res.data.status == "E") {
              this.message = res.data.message;
              }
            })
            .catch((err) => {
              this.loader = false;
              this.message = err;
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
              console.log("this error" + err);
            });
    }
  }
};
</script>
<style scoped>
.rolechipclass{
  margin-left: 15px;
  margin-top: -22px;
}
</style>