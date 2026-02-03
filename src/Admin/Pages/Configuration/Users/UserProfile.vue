
<template>
  <div class="main-20">
    <div class="pagetitle_in_userdetails">
      <page-title :heading="$t('user_profile')" :google_icon="google_icon_userprofile"></page-title>
    </div>
    <div class="row">
      <div class="col-md-12 col-lg-4 col-xl-4">
        <div
          class="
            card-hover-shadow
            profile-responsive
            card-border
            border-success
            mb-3
            card
          "
        >
          <div class="dropdown-menu-header">
            <div class="dropdown-menu-header-inner bg-theme-green">
              <div class="menu-header-content">
                <div
                  class="
                    avatar-icon-wrapper
                    btn-hover-shine
                    mb-3
                    avatar-icon-xl
                  "
                >
                  <div class="avatar-icon rounded">
                    <img
                    v-if="usersdata.profile_pic"
                      :src="envImagePath + usersdata.profile_pic"
                    />
                    <img
                      v-else
                      src="@/assets/images/default-user-profile-picture.png"
                    />
                  </div>
                </div>
               
                <div>
                  <h5 class="menu-header-title" v-if="!isSpinnerLoad">
                    {{ usersdata.salutation }}.
                    {{ usersdata.firstname }}
                    {{ usersdata.lastname }}
                  </h5>
                  <b-spinner
                  small
                  v-if="isSpinnerLoad"
                ></b-spinner>
                </div>
                <div
                  class="menu-header-btn-pane pt-2"
                  v-if="hide_credential != 'myNetwork'"
                >
                  <div role="group" class="btn-group text-center">
                    <!-- <div class="nav pr-2" v-if="!isSpinnerLoad">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            @click="$router.go(-1)"
                            v-on="on"
                            color="secondary"
                            class="hover_shine btn mr-2 mb-2"
                            >{{ $t("cancel") }}</v-btn
                          >
                        </template>
                        <span>{{ $t("cancel") }}</span>
                      </v-tooltip>
                    </div> -->
                    <div class="nav" v-if="!isSpinnerLoad & $route.query.view != 'myprofile'">
                      <router-link
                        :to="{
                          name: 'employee_creation',
                          query: {
                            slug: usersdata.slug,
                            pathname: 'userview',
                          },
                        }"
                      >
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn v-on="on" class="hover_shine btn mr-2 mb-2" >
                              {{ $t("edit") }}
                            </v-btn>
                          </template>
                          <span>{{ $t("edit") }}</span>
                        </v-tooltip>
                      </router-link>
                    </div>
                  </div>
                  {{ hide_credential }}
                  <div
                    v-if="
                      user.rolename == 'SuperUser' || user.rolename == 'Admin'
                    "
                  >
                    <div class="menu-header-btn-pane pt-2">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <div v-on="on" class="d-inline-block">
                            <v-btn
                              class="hover_shine mr-2 mb-2 warning"
                              :disabled="send_credentials_disabled"
                              @click="resetPassword(usersdata.email)"
                            >
                              <b-spinner
                                :disabled="isBtnLoading"
                                small
                                v-if="isBtnLoading"
                              ></b-spinner>
                              {{ $t("send_credentials") }}
                            </v-btn>
                          </div>
                        </template>
                        <span>{{ $t("send_credentials") }}</span>
                      </v-tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
      <div class="col-md-12 col-lg-8 col-xl-8">
        <div class="mb-3">
          <div class="content">
            <b-row>
              <b-col md="12">
                <div class="p-0 card-body">
                  <div>
                    <ProfileDetails
                      :selected_candidate_slug="usersdata.slug"
                      userView="1"
                      :userRoles=user_roles
                      :user_data="usersdata"
                    />
                  </div>
                </div>
              </b-col>
            </b-row>
          </div>
        </div>
      </div>
    </div> 
    <ConfirmDialog
      :show="showStatusDialog"
      :cancel="cancelStatus"
      :confirm="confirmStatus"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('confirm_send_credentials')"
    />
  </div>

</template>  
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ProfileDetails from "../Components/ProfileDetails.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
export default {
  components: {
    PageTitle,
    ProfileDetails,
    ConfirmDialog,
  },
  props: ["updated_user_role"],
  data: () => ({
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    view_page: "",
    send_credentials_disabled: false,
    isBtnLoading: false,
    isDisabled: false,
    initval: true,
    email: null,
    usersdata: [],
    isSpinnerLoad : true,
    search: "",
    valid: false,
    message: "",
    user_id: null,
    user: [],
    profile_status: [],
    usertype: "",
    user_profile: "",
    hide_credential: "",
    showStatusDialog: false,
    user_id : '',
    user_roles: '',
    google_icon_userprofile: {
      icon_name: "account_box",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
  }),
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));     
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.view_page = this.$route.query.view;
        this.fetchuserDetails();
        }
        if (this.$route.query.user_page) {
          this.hide_credential = this.$route.query.user_page;
        }
        if (this.$route.query.view) {
          this.user_profile = this.$route.query.view;
        }
      },
    },
    updated_user_role: {
      immediate: true,
      handler() {
        if(this.updated_user_role){
        this.user_roles=this.updated_user_role
        }
      },
    },
  },
  methods: {
    fetchuserDetails(){
      this.loader = true;
          this.hide_credential = "";
          axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "fetchuserbyslug?slug=" +
                this.$route.query.slug +
                "&view=" +
                this.$route.query.view
            )
            .then((res) => {
              this.btnloading = false;
              this.loader = false;
              if (res.data.status == "S") {
                this.message = res.data.message;
                this.usersdata = res.data.user;
               this.isSpinnerLoad =false;
              } else if (res.data.status == "E") {
                this.message = res.data.message;
              }
            })
            .catch((err) => {
              this.isDisabled = false;
              console.log("this error" + err);
            });
    },
    cancelStatus() {
      this.showStatusDialog = false;
    },
    confirmStatus() {
      this.statusUpdate();
      this.showStatusDialog = false;
    },
    resetPassword(email) {
      this.email = email;
      this.showStatusDialog = true;
    },
    statusUpdate() {
      this.send_credentials_disabled = true;
      this.isBtnLoading = true;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN +
            "send_credentials?email=" +
            this.email
        )
        .then((response) => {
          if (response.data.status == "S") {
            this.flashMessage.success({
              message: response.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.send_credentials_disabled = false;
            this.isBtnLoading = false;
          } else if (response.data.status == "E") {
            this.flashMessage.error({
              message: response.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.isDisasend_credentials_disabledbled = false;
            this.isBtnLoading = false;
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          this.isBtnLoading = false;
          this.send_credentials_disabled = false;
          console.log(err);
        });
    },
  },
};
</script>