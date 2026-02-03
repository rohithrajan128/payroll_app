<template>
  <div class="main-20">
    <div class="pagetitle_in_userdetails mb-7">
      <!-- <v-app-bar flat color="white">
    </v-app-bar> -->
    </div>
    <div>
      <VueElementLoading
        :active="loader"
        spinner="bar-fade-scale"
        color="var(--primary)"
      />
      <div>
        <v-alert v-if="save_error" :text="save_error" color="error" icon="warning" outlined dismissible>
      {{ valertdialogmessage }}</v-alert>
        <v-row class="mt-7">
          <v-col cols="8" sm="4" md="6">
            <v-form ref="form" v-model="official_details_valid">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    v-bind:label="$t('employee_role')"
                    v-on="on"
                    :items="roles_array"
                    index="id"
                    item-value="id"
                    item-text="role_display_name"
                    multiple
                    outlined
                    dense
                    :disabled="!status || view=='myprofile'"
                    v-model="user_role_details.employee_roles"
                    class="required_field ml-2"
                  >
                  <template v-slot:selection="{ item }">
                          <v-chip outlined class="py-2" color="primary" small>
                            <span>{{item.role_display_name}}</span>
                          </v-chip>
                        </template>
                  
            
                  
                  
                  </v-autocomplete>
                </template>
                <span>{{ $t("employee_role") }}</span>
              </v-tooltip>
            </v-form>
          </v-col>
          <v-col cols="4" sm="4" md="6" >
            <div class="pb-4" v-if="status && view=='userview'">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    color="primary"
                    class="ml-2"
                    :disabled="isDisabled"
                    @click="submitEmployeeRole()"
                    small
                    >{{ $t("submit") }}
                    <b-spinner
                      :disabled="isBtnLoading"
                      small
                      v-if="isBtnLoading"
                    ></b-spinner
                  ></v-btn>
                </template>
                <span>{{ $t("submit") }}</span>
              </v-tooltip>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>
    
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import VueElementLoading from "vue-element-loading";
export default {
  components: {
    PageTitle,
    ConfirmDialog,
    VueElementLoading,
  },
  props: ["user_id","reportmanagerassigning","status","view"],
  data: () => ({
    valertdialogmessage:"",
    save_error: false,
    roles_array: [],
    user_role_details: {
      employee_id: "",
      employee_roles: [],
    },
    official_details_valid: true,
    isBtnLoading: false,
    isDisabled: false,
    loader: true,
  }),
  mounted() {
    this.fetchRoles();
  },
  watch: {
    user_id: {
      immediate: true,
      handler() {
        this.user_role_details.employee_id = this.user_id;
        this.fetchUserRolesByID();
      },
    },
  },
  computed: {},
  methods: {
    fetchRoles() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_all_roles")
        .then((res) => {
          this.roles_array = res.data.roles_details;
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log("this error" + err);
        });
    },
    submitEmployeeRole() {
      if (this.user_role_details.employee_roles != "") {
        this.isBtnLoading = true;
        this.isDisabled = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "update_user_roles",
            this.user_role_details
          )
          .then((response) => {
            console.log(response);
            if (response.data.status == "S") {
              this.isBtnLoading = false;
              this.flashMessage.success({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.fetchUserRolesByID();
              this.isBtnLoading = false;
              this.isDisabled = false;
              if(this.reportmanagerassigning){
                this.$emit('updatedrole');
              }
            }else if(response.data.status == "S"){
              this.valertdialogmessage = response.data.message;
               this.save_error=true;
               this.isBtnLoading = false;
              this.isDisabled = false;
            }else{
              this.valertdialogmessage = response.data.message;
               this.save_error=true;
               this.isBtnLoading = false;
              this.isDisabled = false;
            }
          })
          .catch((err) => {
            // this.flashMessage.error({
            //   message: this.$t("something_went_wrong"),
            //   time: 4000,
            //   blockClass: "custom-block-class",
            // });
            this.valertdialogmessage = response.data.message;
            this.save_error=true;
            this.isBtnLoading = false;
            this.isDisabled = false;
            console.log(err);
          });
      } else {
        this.flashMessage.error({
          message: this.$t("select_atleast_one_role"),
          time: 4000,
          blockClass: "custom-block-class",
        });
      }
    },

    fetchUserRolesByID() {
      this.user_role_details.employee_roles = [];
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetch_employee_roles_by_user_id/" +
            this.user_role_details.employee_id
        )
        .then((res) => {
          if (res.data.status == "S") {
            if (this.user_role_details.employee_roles == 0) {
              res.data.employee_role_details.employee_roles.map((item) => {
                if (item.role_id) {
                  this.user_role_details.employee_roles.push(item.role_id);
                  this.loader = false;
                }
              });
            }
            
          } else if (res.data.status == "E") {
          }
        })
        .catch((err) => {
          console.log("this error" + err);
        });
    },
  },
};
</script>

<style scoped>
</style> 



<!-- <v-dialog v-model="dialog" max-width="900px">              
              
  <v-card>
    <v-toolbar color="primary" dark>
      <span class="headline">{{ $t("create_amend_roles") }}</span>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-icon @click="close" class="dialogcloseinuserdetails" v-on="on">mdi-close</v-icon>
        </template>
        <span>{{ $t("close") }}</span>
      </v-tooltip>
    </v-toolbar>
 
  </v-card>
</v-dialog> -->