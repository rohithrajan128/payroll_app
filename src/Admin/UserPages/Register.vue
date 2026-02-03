<template>
  <v-app>
    <!-- <div style="background-image: url('assets/images/logo-inverse.png')"> -->
    <div>
      <transition name="fade" mode="out-in" appear>
        <div class="h-100">
          <b-row class="h-100 no-gutters">
            <b-col
              lg="12"
              md="12"
              class="d-flex bg-white justify-content-center align-items-center"
            >
              <b-col lg="9" md="10" sm="12" class="mx-auto app-login-box mt-10">
                <v-card elevation="5">
                  <div
                    style="
                      display: flex;
                      display: flex;
                      justify-content: space-around;
                      align-items: center;
                    "
                  >
                    <div>
                      <div class="font-base-app text-center">
                        {{ application_name }}
                      </div>
                      <!-- <div class="font-login mt-2">
                        {{ $t("registration_header") }}
                      </div> -->
                    </div>
                  </div>
                  <div class="divider" />
                  <VueElementLoading
                    :active="loader"
                    spinner="bar-fade-scale"
                    color="var(--primary)"
                  />
                  <div
                    style="color: red"
                    class="v-messages__message"
                    v-if="valid_error"
                  >
                    {{ alertmessage }}
                  </div>
                  <div>
                    <v-form v-model="valid" ref="form">
                      <v-container>
                        <v-row>
                          <v-col cols="12" md="2" class="pt-0 pb-0">
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-autocomplete
                                  v-bind:label="$t('salutation')"
                                  v-on="on"
                                  index="id"
                                  item-value="shortname"
                                  item-text="longname"
                                  v-model="users.salutation"
                                  :rules="fieldRules"
                                  :items="salutation_array"
                                  @keyup.enter="saveUser"
                                  class="required_field"
                                ></v-autocomplete>
                              </template>
                              <span>{{ $t("salutation") }}</span>
                            </v-tooltip>
                          </v-col>
                          <v-col cols="12" md="5" class="pt-0 pb-0">
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  v-on="on"
                                  v-model="users.name"
                                  :rules="fieldRules"
                                  v-bind:label="$t('firstname')"
                                  class="required_field"
                                  required
                                  @keyup.enter="saveUser"
                                ></v-text-field>
                              </template>
                              <span>{{ $t("name") }}</span>
                            </v-tooltip>
                          </v-col>
                          <v-col cols="12" md="5" class="pt-0 pb-0">
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  v-on="on"
                                  v-model="users.lastname"
                                  :rules="fieldRules"
                                  v-bind:label="$t('lastname')"
                                  class="required_field"
                                  required
                                  @keyup.enter="saveUser"
                                ></v-text-field>
                              </template>
                              <span>{{ $t("lastname") }}</span>
                            </v-tooltip>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" md="2" class="pt-0 pb-0">
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-autocomplete
                                  v-bind:label="$t('gender')"
                                  v-on="on"
                                  index="id"
                                  item-value="shortname"
                                  item-text="longname"
                                  class="required_field"
                                  v-model="users.gender"
                                  :rules="fieldRules"
                                  :items="gender_array"
                                ></v-autocomplete>
                              </template>
                              <span>{{ $t("gender") }}</span>
                            </v-tooltip>
                          </v-col>
                          <v-col cols="12" md="10" class="pt-0 pb-0">
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  v-on="on"
                                  v-model="users.email"
                                  :rules="emailRules"
                                  class="required_field"
                                  v-bind:label="$t('email_user')"
                                  required
                                  @keyup.enter="saveUser"
                                ></v-text-field>
                              </template>
                              <span>{{ $t("email") }}</span>
                            </v-tooltip>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" md="6" class="pt-0 pb-0">
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  class="required_field"
                                  :append-icon="
                                    show2 ? 'mdi-eye' : 'mdi-eye-off'
                                  "
                                  :type="show2 ? 'text' : 'password'"
                                  @click:append="show2 = !show2"
                                  v-on="on"
                                  v-model="users.password"
                                  :rules="[...passwordRules, ...fieldRules]"
                                  v-bind:label="$t('password')"
                                  required
                                ></v-text-field>
                              </template>
                              <span>{{ $t("password") }}</span>
                            </v-tooltip>
                          </v-col>
                          <v-col cols="12" md="6" class="pt-0 pb-0">
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  class="required_field"
                                  :append-icon="
                                    show1 ? 'mdi-eye' : 'mdi-eye-off'
                                  "
                                  :type="show1 ? 'text' : 'password'"
                                  @click:append="show1 = !show1"
                                  v-on="on"
                                  v-model="users.confirm_password"
                                  :rules="[
                                    !!users.confirm_password ||
                                      $t('password_confirm'),
                                    users.password === users.confirm_password ||
                                      $t('confirm_password_match'),
                                  ]"
                                  v-bind:label="$t('confirm_password')"
                                  required
                                  @keyup.enter="saveUser"
                                ></v-text-field>
                              </template>
                              <span>{{ $t("confirm_password") }}</span>
                            </v-tooltip>
                          </v-col>
                        </v-row>
                        <div class="row my-5">
                          <div class="col-md-6">
                            <div class="f-13 ml-2">
                              {{ $t("already_have_account") }}
                              <router-link to="/" class="a-underline">
                                {{ $t("sign_in") }}
                              </router-link>
                            </div>
                          </div>
                          <div class="text-end col-md-6">
                            <button
                              :disabled="isDisabled"
                              type="button"
                              @click="saveUser"
                              class="
                                btn
                                mt-3
                                w-50
                                btn_radius
                                hover_shine
                                add_new
                                mr-2
                              "
                            >
                              {{ $t("create_account") }}
                              <b-spinner small v-if="isBtnLoading"></b-spinner>
                            </button>
                          </div>
                        </div>
                        <div class="divider" />
                      </v-container>
                    </v-form>
                  </div>
                </v-card>
              </b-col>
            </b-col>
          </b-row>
        </div>
      </transition>
    </div>
  </v-app>
</template>

<script>
import VueElementLoading from "vue-element-loading";
export default {
  components: { VueElementLoading },
  data: () => ({
    loader: false,
    gender_array: [],
    salutation_array: [],
    isBtnLoading: false,
    isDisabled: false,
    show1: false,
    show2: false,
    users: {
      id: 0,
      salutation: "",
      name: "",
      lastname: "",
      gender: "",
      email: "",
      password: "",
      role_id: null,
      userrole: "User",
      confirm_password: "",
    },
    valid: true,
    valid_error: false,
    message: "",
    alertmessage: "",
    array_data: "",
    application_name: "",
  }),
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    emailRules() {
      return [
        (v) => !!v || this.$t("email_required"),
         v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || this.$t("email_valid"),
      ];
    },

    passwordRules() {
      return [(v) => v.length >= 8 || this.$t("password_count")];
    },
  },

  mounted() {
    this.fetchlookup();
  },
  created() {
    this.$nextTick(function () {
      this.loader = true;
      window.addEventListener("resize", this.getWindowWidth);
      setTimeout(() => {
        if (localStorage.getItem("Application_Name")) {
          this.application_name = localStorage.getItem("Application_Name");
        } else {
          this.application_name = "Base App";
        }
        this.loader = false;
      }, 2000);
    });
  },
  methods: {
    fetchlookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "GENDER",
          },
        })
        .then((response) => {
          this.gender_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "SALUTATION",
          },
        })
        .then((response) => {
          this.salutation_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    saveUser() {
      if (this.$refs.form.validate()) {
        if (this.users.password != this.users.confirm_password) {
          this.valid_error = true;
          this.alertmessage = this.$t("confirm_password_match");
        } else {
          this.isDisabled = true;
          this.isBtnLoading = true;
          axios
            .post(
              process.env.VUE_APP_API_URL_ADMIN + "register_user",
              this.users
            )
            .then((res) => {
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "S") {
                this.flashMessage.success({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class",
                });
                this.message = res.data.message;
                setTimeout(
                  () =>
                    this.$router.push({
                      name: "register",
                      params: { email: this.users.email },
                    }),
                  1000
                );
              } else if (res.data.status == "E") {
                this.isBtnLoading = false;
                (this.isDisabled = false),
                  this.flashMessage.error({
                    message: this.array_data,
                    time: 4000,
                    blockClass: "custom-block-class",
                  });
              } else {
                this.isBtnLoading = false;
                this.flashMessage.error({
                  message: this.array_data,
                });
              }
            })
            .catch((err) => {
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.isDisabled = false;
              this.isBtnLoading = false;
              console.log("this error" + err);
            });
        }
      }
    },
  },
};
</script>

<style scoped>
.v-messages__message,
.v-text-field--is-booted .error--text {
  color: red;
}

.d-flex {
  display: flex !important;
  align-items: center;
  justify-content: center;
  background: #fff;
}
.h-150 {
  height: 150%;
}
.btn_radius {
  border-radius: 30px 30px 30px 30px;
}
.font-base-app {
  /* font-family: cursive; */
  font-size: 40px;
  color: #2b70d6;
}
.font-login {
  /* font-family: "Goudy Old Style"; */
  font-size: 22px;
  color: black;
}
</style>
