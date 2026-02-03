<template>
  <v-app>
    <div class="h-100 background_img">
      <b-row class="h-100 no-gutters align-items-center">
        <VueElementLoading
              :active="loader"
              spinner="bar-fade-scale"
              color="var(--primary)"
            />
        <b-col lg="4" class="d-none d-lg-block">
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

        <b-col
          lg="8"
          md="12"
          class="
            rounded
            justify-content-center
            align-items-center
          "
        >
          <b-col lg="6" md="8" sm="12" class="mx-auto app-login-box">
            <!-- <div class="app-logo" /> -->
            <div class="card-header">{{ $t("reset_password") }}</div>
            <div class="card-body">
              <!-- <ul v-if="errors">
              <li v-for="error in errors" v-bind:key="error">{{ msg }}</li>
            </ul> -->
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
              <v-form autocomplete="off" ref="form" v-model="valid">
                <div class="otptimer-align mb-3">
                  <span class="form-group">
                    {{ $t("email") }} :
                    <span>{{ emaildata }}</span>
                  </span>
                </div>
                <div class="form-group">
                  <div class="position-relative" style="max-width: 440px">
                    <v-otp-input
                      v-model="verification_code"
                      :disabled="loading"
                      @finish="onFinish"
                    ></v-otp-input>
                    <v-overlay absolute :value="loading">
                      <v-progress-circular
                        indeterminate
                        color="primary"
                      ></v-progress-circular>
                    </v-overlay>
                  </div>
                </div>
                <!-- <div class="form-group">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                     
                      v-on="on"     
                      v-model="verification_code"
                      :rules="fieldRules"
                      v-bind:label="$t('verification_code')"
                      required
                    ></v-text-field>
                  </template>
                  <span>{{$t('verification_code')}}</span>
                </v-tooltip>
                </div> -->
                <div class="form-group">
                  <!-- <label for="email">{{$t('password')}}</label> -->
                  <!-- <input type="password" id="password" class="form-control" placeholder="" v-model="new_password" required> -->
                  <span v-show="textvisible">
                    <span class="time_data">
                      {{ $t("resend_code_format") }} {{ timecount }}
                      {{ $t("seconds") }}
                    </span>
                  </span>
                  <div class="Resendbtn">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <div v-on="on" class="d-inline-block">
                          <v-btn
                            small
                            class="primary ml-2 f-13 hover_shine add_new"
                            @click="requestpassword"
                            v-show="btnvisible"
                            :disabled="isdisabled"
                            >{{ $t("resend_code") }}
                            <b-spinner
                              :disabled="isbtnLoading"
                              small
                              v-if="isbtnLoading"
                            ></b-spinner>
                          </v-btn>
                        </div>
                      </template>
                      <span>{{ $t("resend_code") }}</span>
                    </v-tooltip>
                  </div>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        :append-icon="
                          newpasswordtoggle ? 'visibility' : 'visibility_off'
                        "
                        @click:append="
                          () => (newpasswordtoggle = !newpasswordtoggle)
                        "
                        :type="newpasswordtoggle ? 'password' : 'text'"
                        v-on="on"
                        v-model="new_password"
                        :rules="[...fieldRules,...passwordRules]"
                            @keydown="NumbersOnly"
                            maxlength="6"
                        v-bind:label="$t('new_pin')"
                        @keyup.enter="resetPassword"
                        required
                      ></v-text-field>
                    </template>
                    <span>{{ $t("password") }}</span>
                  </v-tooltip>
                </div>
                <div class="form-group">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-on="on"
                        :append-icon="
                          confirmpasswordtoggle
                            ? 'visibility'
                            : 'visibility_off'
                        "
                        @click:append="
                          () => (confirmpasswordtoggle = !confirmpasswordtoggle)
                        "
                        :type="confirmpasswordtoggle ? 'password' : 'text'"
                        v-model="password_confirmation"
                        :rules="[...fieldRules,...passwordRules]"
                            @keydown="NumbersOnly"
                            maxlength="6"
                        v-bind:label="$t('confirm_pin')"
                        @keyup.enter="resetPassword"
                        required
                      ></v-text-field>
                    </template>
                    <span>{{ $t("confirm_password") }}</span>
                  </v-tooltip>
                </div>
                <!-- <button  style="float:right" @click="resetPassword()" class="btn btn-primary">{{$t('save')}}</button> -->
                <div class="d-flex justify-content-end" style="">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <div v-on="on" class="d-inline-block">
                        <v-btn
                          class="ma-1 font-weight-bold cancel-btn"
                          color="dark cancel_button"
                          small
                           :disabled="isDisabled"
                          @click="cancel()"
                        >
                          {{ $t("cancel") }}
                        </v-btn>
                      </div>
                    </template>
                    <span>{{ $t("cancel") }}</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <div v-on="on" class="">
                        <b-button
                          :disabled="isDisabled"
                          @click="resetPassword"
                          class="font-weight-bold submit_font_size"
                          variant=" hover_shine add_new"
                          >{{ $t("submit") }}
                          <b-spinner
                            :disabled="isBtnLoading"
                            small
                            v-if="isBtnLoading"
                          ></b-spinner>
                        </b-button>
                      </div>
                    </template>
                    <span>{{ $t("submit") }}</span>
                  </v-tooltip>
                </div>
              </v-form>
            </div>
          </b-col>
        </b-col>
      </b-row>
    </div>
  </v-app>
</template>

<script>
import VueElementLoading from "vue-element-loading";

export default {
  components: { VueElementLoading },
  data() {
    return {
      token: null,
      emaildata: null,
      new_password: "",
      password_confirmation: "",
      verification_code: null,
      has_error: false,
      status: "",
      message: "",
      data: "",
      user: "",
      valid: true,
      isDisabled: false,
      isBtnLoading: false,
      isdisabled: false,
      isbtnLoading: false,
      confirmpasswordtoggle: String,
      newpasswordtoggle: String,
      loading: false,
      snackbar: false,
      snackbarColor: "default",
      otp: "",
      text: "",
      expectedOtp: "",
      length: 7,
      btnvisible: false,
      timecount: 60,
      textvisible: true,
      app_image_url: "",
      application_name: "",
      app_name: "",
      loader: false,
    };
  },
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    passwordRules() {
      return [(v) => (v.length == 6 || this.$t("pin_must_6_digits")) ];
    },
  },
  watch: {
    timecount: {
      handler(value) {
        if (value > 0) {
          setTimeout(() => {
            this.timecount--;
          }, 1000);
        }
      },
      immediate: true,
    },
    "$route.params.email": {
      immediate: true,
      handler() {
        if (this.$route.params.email) {
          localStorage.setItem("verifyemail", this.$route.params.email);
          this.email = this.$route.params.email;
          this.emaildata = this.$route.params.email;
        }
      },
    },
  },
  mounted() {
    // this.user = JSON.parse(localStorage.getItem("user"));
    this.emaildata = localStorage.getItem("verifyemail");
    setTimeout(() => (this.btnvisible = true), 60000);
    setTimeout(() => (this.textvisible = false), 60000);
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
    onFinish(rsp) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.snackbarColor = rsp === this.expectedOtp ? "success" : "warning";
        this.text = `Processed OTP with "${rsp}" (${this.snackbarColor})`;
        this.snackbar = true;
      }, 3500);
    },

    resetPassword() {
      if (this.$refs.form.validate()) {
        if (this.new_password != this.password_confirmation) {
          this.status = "E";
          this.message = this.$t("password_not_match");
          this.isDisabled = false;
          this.isBtnLoading = false;
          // this.$vuetify.goTo(0);
        } else {
          this.isDisabled = true;
          this.isBtnLoading = true;
          axios
            .post(process.env.VUE_APP_API_URL_ADMIN + "reset/password", {
              otp: this.verification_code,
              email: this.emaildata,
              password: this.new_password,
              password_confirmation: this.password_confirmation,
            })
            .then(
              (response) => {
                if (Array.isArray(response.data.message)) {
                  this.array_data = response.data.message.toString();
                } else {
                  this.array_data = response.data.message;
                }
                this.message = response.data.message;
                this.status = response.data.status;
                if (response.data.status == "S") {
                  // this.flashMessage.success({
                  // message: this.array_data,
                  // time: 4000,
                  // blockClass: "custom-block-class",
                  // });)
                  setTimeout(() => this.$router.push({ name: "login" }), 1000);
                  localStorage.removeItem("verifyemail");
                } else if (response.data.status == "E") {
                  // this.flashMessage.error({
                  //   message: this.array_data,
                  // });
                  this.message = response.data.message;
                  this.isDisabled = false;
                  this.isBtnLoading = false;
                }
              },
              (error) => {
                this.message = this.$t("too_many_request");
              }
            )
            .catch((err) => {
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
              console.log("error data", err);
            });
        }
      }
    },
    cancel() {
      this.$router.push({ name: "login" });
    },
    requestpassword() {
      this.timecount = 60;
      this.textvisible = true;
      setTimeout(() => (this.textvisible = false), 60000);
      this.btnvisible = false;
      setTimeout(() => (this.btnvisible = true), 60000);
      this.isdisabled = true;
      this.isbtnLoading = true;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN +
            "resend_otp_validate?email=" +
            this.emaildata
        )
        .then((response) => {
          this.response = response.data;
          this.message = response.data.message;
          this.status = response.data.status;
          // if (this.status == "S") {
          //   setTimeout(
          //     () =>
          //       this.$router.push({
          //         name: "reset-password-form",
          //         params: { email: this.$route.params.email },
          //       }),
          //     1000
          //   );
          // }
          this.isdisabled = false;
          this.isbtnLoading = false;
        })
        .catch((err) => {
          this.isdisabled = false;
          this.isbtnLoading = false;
          console.log(err);
        });
    },
  },
};
</script>
<style scoped>
.font-login {
  /* font-family: "Goudy Old Style"; */
  font-size: 35px;
  color: black;
}
.d-flex {
  display: flex !important;
  align-items: center;
  justify-content: center;
  background: #fff;
}
.time_data {
  width: 232px;
  margin-left: 0px;
}

.Resendbtn {
  margin-left: -7px;
  display: flex;
  justify-content: end;
}
.background_img {
  background-image: url("@/assets/images/background_image.png");
    background-size: cover;
}
.btn{
  padding:0.14rem 0.8rem !important
}
.submit_font_size{
  font-size:14px
}
.v-input /deep/ input{
  background:transparent !important;
}
.v-input__control /deep/ input{
  background-color: transparent;
}
</style>

