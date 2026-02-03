<template>
  <v-app>
    <div class="h-100">
      <b-row class="h-100 no-gutters">
        <b-col lg="4" class="d-none d-lg-block d-flex">
          <div v-if="app_image_url">
            <img
              class="custom-logo"
              v-bind:src="app_image_url"
              style="width: 35vh; transition: width 0.5s"
            />
          </div>
          <div v-else-if="app_image_url == ''">
            <p>{{ application_name }}</p>
          </div>
          <div v-else>
            <p>{{ application_name }}</p>
          </div>
        </b-col>
        <b-col
          lg="8"
          md="12"
          class="
            h-100
            d-flex
            bg-white
            justify-content-center
            align-items-center
          "
        >
          <b-col lg="6" md="8" sm="12" class="mx-auto app-login-box">
            <div class="card-header">{{ $t("verify_code") }}</div>
            <div class="card-body">
              <div
                style="color: red"
                class="v-messages__message"
                v-if="status == 'E'"
              >
                {{ message }}
              </div>
              <div style="color: green" v-if="status == 'S'">{{ message }}</div>
              <v-form autocomplete="off" ref="form" v-model="valid">
                <div class="form-group">
                  {{ $t("email") }} : {{ emaildata }}
                </div>
                <div class="form-group">
                  <div class="position-relative" style="max-width: 300px">
                    <v-otp-input
                      v-model="verification_code"
                      :disabled="loading"
                      @finish="onFinish"
                      :rules="fieldRules"
                    ></v-otp-input>
                    <v-overlay absolute :value="loading">
                      <v-progress-circular
                        indeterminate
                        color="primary"
                      ></v-progress-circular>
                    </v-overlay>
                  </div>
                </div>
                <div class="form-group">
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
                            class="primary ml-2"
                            @click="requestpassword"
                            v-show="btnvisible"
                            :disabled="isdisabled"
                          >
                            {{ $t("resend_code") }}
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
                </div>
                <hr />
                <div class="d-flex" style="float: right">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <div v-on="on" class="d-inline-block">
                        <b-button
                          color="dark cancel_button"
                          variant="font-weight-bold cancel-btn mr-2"
                          @click="cancel()"
                          >{{ $t("cancel") }}</b-button
                        >
                      </div>
                    </template>
                    <span>{{ $t("cancel") }}</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <div v-on="on" class="d-inline-block">
                        <b-button
                          :disabled="isDisabled"
                          @click="registerUser"
                          variant="f-13 mr-2 hover_shine add_new"
                        >
                          {{ $t("submit") }}
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
export default {
  components: {},
  data() {
    return {
      token: null,
      emaildata: null,
      application_name: "",
      app_image_url: "",
      new_password: "",
      password_confirmation: "",
      verification_code: null,
      has_error: false,
      status: "",
      message: "",
      data: "",
      user: "",
      isdisabled: false,
      valid: true,
      isDisabled: false,
      isBtnLoading: false,
      confirmpasswordtoggle: String,
      newpasswordtoggle: String,
      loading: false,
      snackbar: false,
      snackbarColor: "default",
      otp: "",
      text: "",
      expectedOtp: "",
      textvisible: true,
      btnvisible: false,
      isbtnLoading: false,
      timecount: 60,
    };
  },
  computed: {
    fieldRules() {
      return [(v) => (!!v && !!v.trim()) || this.$t("field_required")];
    },
    passwordRules() {
      return [
        (v) => v.length >= 8 || "Password must have atleast 8 characters",
      ];
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
        }
      },
    },
  },
  mounted() {
    if (localStorage.getItem("Application_Name")) {
      this.application_name = localStorage.getItem("Application_Name");
    }
    if (localStorage.getItem("App_Image_Url") != null) {
      this.app_image_url = localStorage.getItem("App_Image_Url");
    } else {
      this.app_image_url = "";
    }
    this.emaildata = localStorage.getItem("verifyemail");
    setTimeout(() => (this.btnvisible = true), 60000);
    setTimeout(() => (this.textvisible = false), 60000);
  },
  methods: {
    onFinish(rsp) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.snackbarColor = rsp === this.expectedOtp ? "success" : "warning";
        this.text = `Processed OTP with "${rsp}" (${this.snackbarColor})`;
        this.snackbar = true;
      }, 3500);
    },
    registerUser() {
      if (this.$refs.form.validate()) {
        if (this.new_password != this.password_confirmation) {
          this.status = "E";
          this.message = "Confirm password is not matching with new password";
        } else {
          this.isDisabled = true;
          this.isBtnLoading = true;
          axios
            .post(
              process.env.VUE_APP_API_URL_ADMIN + "registration_otp_validate",
              {
                otp: this.verification_code,
                email: this.emaildata,
              }
            )
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
                  this.flashMessage.success({
                    message: this.array_data,
                  });

                  setTimeout(() => this.$router.push({ name: "login" }), 1000);
                  localStorage.removeItem("verifyemail");
                } else if (response.data.status == "E") {
                  this.flashMessage.error({
                    message: this.array_data,
                  });
                  this.message = response.data.message;
                  this.isDisabled = false;
                  this.isBtnLoading = false;
                }
              },
              (error) => {
                console.log(error);
                this.flashMessage.error({
                  message: this.$t("too_many_request"),
                });
                this.message = this.$t("too_many_request");
                this.isBtnLoading = false;
                this.isDisabled = true;
                setTimeout(() => (this.isDisabled = false), 60000);
              }
            );
        }
      }
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
        .then(
          (response) => {
            this.response = response.data;
            this.message = response.data.message;
            this.status = response.data.status;
            this.isdisabled = false;
            this.isbtnLoading = false;
          },
          (error) => {
            console.log(error);
            this.flashMessage.error({
              message: this.$t("too_many_request"),
            });
            this.message = this.$t("too_many_request");
            this.status = "E";
            this.btnvisible = false;
            this.isdisabled = false;
            this.isbtnLoading = false;
            setTimeout(() => (this.btnvisible = true), 60000);
          }
        )
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          this.isdisabled = false;
          this.isbtnLoading = false;
        });
    },
    cancel() {
      this.$router.push({ name: "login" });
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
.Resendbtn {
  margin-left: -7px;
  display: flex;
  justify-content: end;
}
</style>

