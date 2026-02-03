
<template>
  <div class="">
    <v-app>
      <div class="h-100 background_img">
        <b-row class="h-100 align-items-center no-gutters">
          <b-col lg="4" class="d-none  d-lg-block">
            <div class="slider-light text-center">
              <div v-if="app_image_url">
                <a>
                  <img
                    class="custom-logo"
                    v-bind:src="app_image_url"
                    style="width: 35vh; transition: width 0.5s"
                  />
                </a>
              </div>
              <div v-else-if="app_image_url == ''">
                <a class="font-base-app text-center">
                  {{ application_name }}
                </a>
              </div>
              <div v-else>
                <a class="font-base-app text-center">
                  {{ application_name }}
                </a>
              </div>
            </div>
          </b-col>
          <VueElementLoading
            :active="loader"
            spinner="bar-fade-scale"
            color="var(--primary)"
          />
          <b-col
            lg="8"
            md="12"
            class="
              h-100
              d-flex
              justify-content-center
              align-items-center
            "
          >
            <b-col lg="6" md="8" sm="12" class="mx-auto app-login-box forgot_password_container">
              <div
                style="
                  display: flex;
                  display: flex;
                  justify-content: space-around;
                  align-items: center;
                "
              >
                <div>
                  <!-- <h4 class="mb-0">
                    <img
                      src="@/assets/images/home-login.png"
                      style="width: 100%"
                    />
                  </h4> -->
                  <!-- <div class="font-login">Create Account</div> -->
                </div>
              </div>
              <h4 class="text-center">
                <div class="font-login">{{ $t("forgot_password") }}</div>
                <!-- <span>{{$t('form_to_recover_psw')}}</span> -->
              </h4>
              <div>
             
                  <b-row form>
                    <b-col md="12">
                    
                        <div
                          style="color: red"
                          class="v-messages__message"
                          v-if="status == 'E'"
                        >
                          {{ message }}
                        </div>
                        <div style="color: green" v-if="status == 'S'">
                          {{ message }}
                        </div>
                        <!-- <Label for="exampleEmail">Email</Label>
                       <input type="email" id="email" class="form-control" mailto:placeholder="user@example.com" v-model="email" required> -->
                     
                          <div class="form-group">
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  v-on="on"
                                  v-model="email"
                                  @keyup="checkemailvalid(email)"
                                  :rules="[...fieldRules,...emailRules]"
                                  v-bind:label="$t('email')"
                                  @keyup.enter="requestResetPassword"
                                  required
                                ></v-text-field>
                              </template>
                              <span>{{ $t("email") }}</span>
                            </v-tooltip>
                          </div>
                     
                    
                    </b-col>
                  </b-row>
                  <div class="d-flex align-items-center">
                    <h6 class="mb-0">
                      <a href="/" class="text-primary f-13 a-underline">{{
                        $t("sign_existing_account")
                      }}</a>
                    </h6>
                    <div class="ml-auto">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <div v-on="on" class="d-inline-block">
                            <v-btn
                              color="btn ml-2 mb-2 hover_shine add_new"
                              @click="requestResetPassword"
                              small
                              :disabled="isDisabled || !valid"
                              >{{ $t("recoverpassword") }}
                              <b-spinner
                                :disabled="isBtnLoading"
                                v-if="isBtnLoading"
                              ></b-spinner>
                            </v-btn>
                          </div>
                        </template>
                        <span>{{ $t("recover_password") }}</span>
                      </v-tooltip>
                    </div>
                  </div>
             
              </div>
            </b-col>
          </b-col>
        </b-row>
      </div>
    </v-app>
  </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
export default {
  components: {
    VueElementLoading,
  },
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
     emailRules() {
      return [
        (v) =>/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || this.$t("email_valid"),
      ];
    },
  },
  data() {
    return {
      email: null,
      has_error: false,
      status: "",
      message: "",
      loader: false,
      isDisabled: false,
      valid: false,
      isBtnLoading: false,
      app_image_url: "",
      application_name: "",
      app_name: "",
    };
  },

  created() {
    this.$nextTick(function () {
      this.loader = true;
      window.addEventListener("resize", this.getWindowWidth);
      setTimeout(() => {
        if (localStorage.getItem("App_Image_Url") != null) {
          this.app_image_url = localStorage.getItem("App_Image_Url");
          this.app_name = localStorage.getItem("App_Name");
        } else {
          this.app_image_url = "";
        }
        if (localStorage.getItem("Application_Name")) {
          this.application_name = localStorage.getItem("Application_Name");
        } else {
          this.application_name = "";
        }
        this.loader = false;
      }, 2000);
    });
  },

  methods: {
    checkemailvalid(email) {
      let regex = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
      let isValid = regex.test(email);
      if (isValid) {
        this.valid = true;
      }
      else {
        this.valid = false;
      }
    },
    requestResetPassword() {
      if (this.valid == true) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        this.loader = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN +
              "reset_password?email=" +
              this.email +
              "&role=User"
          )
          .then((response) => {
            this.response = response.data;
            this.message = response.data.message;
            this.status = response.data.status;
            if (this.status == "S") {
              setTimeout(
                () =>
                  this.$router.push({
                    name: "reset_password_form",
                    params: { email: this.email },
                  }),
                1000
              );
            }
            this.isDisabled = false;
            this.isBtnLoading = false;
            this.loader = false;
          })
          .catch((err) => {
            this.isDisabled = false;
            this.isBtnLoading = false;
            this.loader = false;
            console.log(err);
          });
      }
    },
    cancel() {
      this.$router.push({ name: "Login" });
    },
  },
};
</script>
<style scoped>
.d-flex {
  display: flex !important;
  align-items: center;
  justify-content: center;
  background: #fff;
}
/* .font-login {
  font-family: "Goudy Old Style"; 
  font-size: 25px;
  color: black;
} */
.background_img {
  background-image: url("@/assets/images/background_image.png");
    background-size: cover;
}
.d-flex{
  background: transparent;
}
.forgot_password_container{
  background: #fff;
  border-radius: 10px;
}
</style>




