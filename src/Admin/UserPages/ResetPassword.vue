<template>
  <div class="container-fluid main-20 p-0">
    <v-alert :value="valid_error" color="error" icon="warning" outlined>{{
      message
    }}</v-alert>
    <div class="main-card mb-3 card">
      <div class="card-header">
        <i class="add-icon lnr-add icon-gradient bg-happy-itmeo"></i>
        {{ $t("reset_password") }}
      </div>

      <div class="card-body">
        <v-form autocomplete="off" ref="form" v-model="valid">
          <v-container-fluid>
            <v-layout>
              <v-flex xs12 md6>
                <strong>{{ $t("email") }}:</strong>
                &nbsp;&nbsp;
                {{ userprofile.email }}
              </v-flex>
            </v-layout>
            <br />
            <v-layout>
              <v-flex xs12 md6>
                <v-text-field :append-icon="currentpasswordtoggle ? 'visibility' : 'visibility_off'
                  " @click:append="() => (currentpasswordtoggle = !currentpasswordtoggle)
    " :type="currentpasswordtoggle ? 'password' : 'text'" v-model="fieldItem.currentpassword"
                  v-bind:label="$t('current_pin')" required :rules="[...fieldRules, ...passwordRules]"
                  @keydown="NumbersOnly" maxlength="6"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex xs12 md6>
                <v-text-field :append-icon="newpasswordtoggle ? 'visibility' : 'visibility_off'
                  " @click:append="() => (newpasswordtoggle = !newpasswordtoggle)"
                  :type="newpasswordtoggle ? 'password' : 'text'" v-model="fieldItem.newpassword"
                  :rules="[...fieldRules, ...passwordRules]" @keydown="NumbersOnly" maxlength="6"
                  v-bind:label="$t('new_pin')" required></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex xs12 md6>
                <v-text-field :append-icon="confirmpwdtoggle ? 'visibility' : 'visibility_off'
                  " @click:append="() => (confirmpwdtoggle = !confirmpwdtoggle)"
                  :type="confirmpwdtoggle ? 'password' : 'text'" v-model="fieldItem.confirmpassword"
                  @keydown="NumbersOnly" maxlength="6" :rules="[
                    !!fieldItem.confirmpassword || $t('password_confirm'),
                    fieldItem.newpassword === fieldItem.confirmpassword ||
                    $t('confirm_pin'),
                  ]" v-bind:label="$t('confirm_pin')" required></v-text-field>
              </v-flex>
            </v-layout>
          </v-container-fluid>
        </v-form>
      </div>
      <div class="d-block text-right card-footer">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block">
              <v-btn @click="cancel" class="mr-2 mb-2 font-weight-bold cancel-btn" color="dark cancel_button" small>
                {{ $t("cancel") }}
              </v-btn>
            </div>
          </template>
          <span>{{ $t("cancel") }}</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block">
              <v-btn :disabled="!valid || isDisabled" @click="submit" class="mr-2 mb-2 success hover_shine" small>
                {{ $t("submit") }}
                <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
              </v-btn>
            </div>
          </template>
          <span>{{ $t("submit") }}</span>
        </v-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => ({
    valid: false,
    valid_error: false,
    message: "",
    userprofile: "",
    isDisabled: false,
    isBtnLoading: false,
    fieldItem: {
      currentpassword: "",
      newpassword: "",
      confirmpassword: "",
      claim_profile: "N",
      email: "",
    },
    currentpasswordtoggle: String,
    newpasswordtoggle: String,
    confirmpwdtoggle: String,
    newpasswordshow: false,
    confirmpasswordshow: false,
  }),
  computed: {
    minlength() {
      return [
        (v) => v.length > 7 || this.$t("password_length"),
        (v) => !!v || this.$t("field_required"),
      ];
    },
    fieldRules() {
      return [(v) => (!!v && !!v.trim()) || this.$t("field_required")];
    },
    passwordRules() {
      return [(v) => (v.length == 6 || this.$t("pin_must_6_digits"))];
    },
  },
  created() { },
  watch: {},
  mounted() {
    this.userprofile = JSON.parse(localStorage.getItem("user"));
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
    submit() {
      if (this.$refs.form.validate()) {
        if (this.fieldItem.newpassword != this.fieldItem.confirmpassword) {
          this.valid_error = true;
          this.message = "Confirm password is not matching with new password";
          this.$vuetify.goTo(0);
        } else {
          // Form is valid, process
          this.isDisabled = true;
          this.isBtnLoading = true;
          this.fieldItem.email = this.userprofile.email;
          this.fieldItem.user_id = this.userprofile.id;
          axios
            .post(
              process.env.VUE_APP_API_URL_ADMIN + "resetuserpassword",
              this.fieldItem
            )
            .then(
              (res) => {
                this.valid_error = false;
                if (Array.isArray(res.data.message)) {
                  this.array_data = res.data.message.toString();
                } else {
                  this.array_data = res.data.message;
                }
                if (res.data.status == "E") {
                  (this.message = this.array_data), (this.isDisabled = false);
                  this.isBtnLoading = false;
                  this.valid_error = true;
                  this.valid_success = false;
                  this.$vuetify.goTo(0);
                } else {
                  this.flashMessage.success({
                    title: res.data.title,
                    message: this.array_data,
                    time: 1000,
                    blockClass: "custom-block-class",
                  });
                  this.valid_error = false;
                  this.valid_success = true;
                  // setTimeout(() => this.$router.push({ name: "login" }), 1000);
                  this.isDisabled = false;
                  this.isBtnLoading = false;
                }
              },
              (error) => {
                console.log(error);
                (this.message = this.$t("too_many_request")),
                  (this.isDisabled = true),
                  (this.isBtnLoading = false);
                setTimeout(() => (this.isDisabled = false), 120000);
                setTimeout(() => (this.message = "Now try again"), 120000);
              }
            )
            .catch((err) => {
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
              console.log("error data", err);
              this.valid_success = false;
              this.valid_error = true;
              this.message = this.$t("password_error");
              this.$vuetify.goTo(0);
            });
        }
      } else {
        this.flashMessage.error({
          message: this.$t("invalid_form"),
          time: 4000,
          blockClass: "custom-block-class",
        });
      }
    },
    cancel() {
      this.$router.push({
        name: "dashboard",
      });
    },
  },
};
</script>
