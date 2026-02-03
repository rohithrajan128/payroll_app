<template>
  <v-app>
    <VueElementLoading
      :active="loader"
      spinner="bar-fade-scale"
      color="var(--primary)"
    />
    <div class="background_img">
      <transition name="fade" mode="out-in" appear>
        <div class="h-100">
          <b-row class="h-per no-gutters">
            <b-col
              md="6"
              class="d-lg-block m-auto text-center"
            >
              <div class="slider-light">
                <div v-if="app_image_url">
                  <a>
                    <img
                      class="custom-logo"
                      v-bind:src="app_image_url"
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
            <b-col
              md="6"
              class="d-flex justify-content-center bg-transparent align-items-center"
            >
              <b-col
                md="6"
                sm="12"
                class="mx-auto app-login-box login_backgroud"
              >
                <div
                >
                  <div>
                    <!-- <h4 class="mb-0">
                      <div>{{ $t("welcome_msg") }}</div>
                    </h4>
                    <div class="font-login">{{ $t('agilsuite') }}</div> -->
                    <span class="font-sign-in-msg">{{
                      $t("sign_in_msg")
                    }}</span>
                  </div>
                </div>

                <v-divider></v-divider>

                <div>
                  <v-form v-model="valid">
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="12">
                          <v-text-field
                          class="name_field"
                          maxlength="12"
                            v-model="details.auto_gen_emp_id"
                            :rules="fieldRules"
                            @keyup.enter="loginNav"
                            v-bind:label="$t('username')"
                            dense
                            required
                          ></v-text-field>
                          <div class="v-messages__message" v-if="errors.error">
                            {{ errors.error }}
                          </div>
                        </v-col>
                        <v-col cols="12" md="12">
                         
                          <v-text-field
                          @keyup="checkpasswordvalid(details.password)"
                            v-model="details.password"
                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="[...fieldRules,...passwordRules]"
                            @keydown="NumbersOnly"
                            maxlength="6"
                            :type="show1 ? 'text' : 'password'"
                            name="input-10-1"
                            v-bind:label="$t('pin')"
                            dense
                            @keyup.enter="login"
                            counter
                            @click:append="show1 = !show1"
                          ></v-text-field>
                         
                        </v-col>
                        <v-col
                          cols="12"
                          md="12"
                          style="text-align: end; margin: -23px 0px 0px 17px"
                        >
                          <router-link to="/forgot_password">
                            <a
                              class="btn-lg btn a-underline"
                              style="font-size: 14px"
                            >
                              {{ $t("recoverpassword") }}
                            </a></router-link
                          >
                        </v-col>
                      </v-row>

                      <!-- <div class="divider" /> -->
                      <div>
                        <v-btn
                          block
                        class="button_color text-white"
                          variant="mr-2 mb-2 hover_shine  "
                          small
                          @click="login"
                       :disabled="!valid || btnloading"
                          >{{ $t("sign_in") }}
                          <b-spinner
                            :disabled="btnloading"
                            small
                            v-if="btnloading"
                          ></b-spinner>
                        </v-btn>
                      </div>
                      <!-- <div class="d-flex align-items-center ">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <div v-on="on" class="d-inline-block">
                              <v-btn 
                              block
                                variant="mr-2 mb-2 hover_shine add_new"
                                small
                                @click="login"
                                :disabled="!valid || btnloading"
                                >{{ $t("sign_in") }}
                                <b-spinner
                                  :disabled="btnloading"
                                  small
                                  v-if="btnloading"
                                ></b-spinner>
                              </v-btn >
                            </div>
                          </template>
                          <span>{{ $t("sign_in") }}</span>
                        </v-tooltip>
                      </div> -->
                    </v-container>
                  </v-form>
                </div>
              </b-col>
            </b-col>
          </b-row>
        </div>
      </transition>
    </div>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import VueElementLoading from "vue-element-loading";

export default {
  components: {
    VueElementLoading,
  },
  data: () => ({
    details: {
      auto_gen_emp_id: "",
      password: "",
    },
    valid: false,
    show1: false,
    user: "",
    btnloading: false,
    userprofile: "",
    loader: false,
    app_image_url: "",
    application_name: "",
    app_name: "",
  }),



  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    passwordRules() {
      return [(v) => (v.length == 6 || this.$t("pin_must_6_digits")) ];
    },
    emailRules() {
      return [
        (v) => !!v || this.$t("email_required"),
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          this.$t("email_valid"),
      ];
    },

    ...mapGetters(["errors"]),
  },

  //User will be logged out if they enter the / or click backbutton from dashboard
  beforeCreate () {
      if (this.$store.state.isLogged) {  
      }
      else{
        this.$router.push("/");
        localStorage.removeItem("user");
      }
  },
//User will be logged out if they enter the / or click backbutton from dashboard


  mounted() {
    this.$store.commit("setErrors", {});
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
    checkpasswordvalid(password) {
      if (password.length==6) {
        this.valid = true;
      }
      else {
        this.valid = false;
      }
    },
    NumbersOnly(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },

    ...mapActions("auth", ["sendLoginRequest"]),

    login: function () {
      if (this.valid==true) {
      this.loader = true;
      setTimeout(() => {
        this.loader = false;
      }, 1050);
      this.sendLoginRequest(this.details).then(() => {
        this.btnloading = true;
        this.user = JSON.stringify(localStorage.getItem("user"));
        this.userprofile = JSON.parse(localStorage.getItem("user"));
        this.$router.push({
          name: "dashboard",
        });
      });
      this.btnloading = false;
    }
    },
    loginNav:function(){
      if(this.valid == true){
        this.login()
      }
    }
  },
};
</script>

<style scoped>
.v-messages__message,
.v-text-field--is-booted .error--text {
  color: red;
}
.font-login {
  /* font-family: fantasy; */
  font-size: 35px;
  color: #4adde7;
}

.d-flex {
  display: flex !important;
  align-items: center;
  justify-content: center;
  background: #fff;
}
.h-100 {
  height: 100vh !important;
}
.font-sign-in-msg {
  font-size: 16px;
  font-weight: 600;
}
.h-per {
  height: 100% !important;
}
.background_img {
  background-image: url("@/assets/images/background_image.png");
    background-size: cover;

}
.login_backgroud {
  background: #fff;
  padding: 33px;
  border-radius: 3px;
  min-height: 376px;

  max-width: 319px;
}
.button_color {
  background: #a0426e !important;
  
  position: relative;
  top: 20px;
}
.custom-logo{
  width: 14vw; 
  transition: width 0.5s
}
.name_field >>> input {
  text-transform: uppercase;
}
</style>
