<template>
  <div class="container-fluid main-20">
    <div class="card-hover-shadow mb-3 card-border card mx-auto">
      <div class="card-header">
        <div class="card-header-tab card-header">
          <div
            class="
              card-header-title
              font-size-lg
              text-capitalize
              titlewrap
              page-title-color
            "
          >
            {{ $t("create_user") }}
          </div>
        </div>
      </div>
      <div class="card-body">
        <VueElementLoading
          :active="loader"
          spinner="bar-fade-scale"
          color="var(--primary)"
        />
        <v-form ref="form" v-model="valid">
          <h5 class="pl-2 mb-5">{{ $t("user_details") }}</h5>
          <div class="row">
            <div class="col-md-8 mb-4">
              <v-layout>
                <v-flex xs12 md4 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <span v-on="on">
                        <v-autocomplete
                          v-bind:label="$t('user_type')"
                          index="id"
                          item-value="id"
                          item-text="rolename"
                          v-model="userDetails.role_id"
                          :rules="fieldRules"
                          :items="userRoles"
                          @change="userType_selected(userDetails.role_id)"
                          outlined
                          dense
                          class="required_field"
                          return-object
                        ></v-autocomplete>
                      </span>
                    </template>
                    <span>{{ $t("select_role") }}</span>
                  </v-tooltip>
                </v-flex>

                <v-flex xs12 md8 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <span v-on="on">
                        <v-autocomplete
                          v-if="admin_organisation"
                          v-bind:label="$t('organization')"
                          index="id"
                          item-value="id"
                          item-text="org_name"
                          v-model="userDetails.org_id"
                          :rules="fieldRules"
                          :items="org_name"
                          outlined
                          dense
                          class="required_field"
                          return-object
                        ></v-autocomplete>
                      </span>
                    </template>
                    <span>{{ $t("select_organization") }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>

              <v-layout>
                <v-flex xs12 md4 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-autocomplete
                        v-bind:label="$t('salutation')"
                        v-on="on"
                        index="id"
                        item-value="shortname"
                        item-text="longname"
                        v-model="userDetails.salutation"
                        :rules="fieldRules"
                        :items="salutation_array"
                        outlined
                        dense
                        class="required_field"
                      ></v-autocomplete>
                    </template>
                    <span>{{ $t("salutation") }}</span>
                  </v-tooltip>
                </v-flex>
                <v-flex xs12 md4 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-on="on"
                        v-model="userDetails.firstname"
                        :rules="fieldRules"
                        v-bind:label="$t('firstname')"
                        required
                        class="required_field"
                        outlined
                        dense
                      ></v-text-field>
                    </template>
                    <span>{{ $t("firstname") }}</span>
                  </v-tooltip>
                </v-flex>
                <!-- <v-flex xs12 md4 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-on="on"
                        v-model="userDetails.middlename"
                        :rules="fieldRules"
                        v-bind:label="$t('middlename')"
                       
                        outlined
                        dense
                      ></v-text-field>
                    </template>
                    <span>{{ $t("middlename") }}</span>
                  </v-tooltip>
                </v-flex> -->
                <v-flex xs12 md4 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-on="on"
                        v-model="userDetails.lastname"
                        :rules="fieldRules"
                        v-bind:label="$t('lastname')"
                        required
                        class="required_field"
                        outlined
                        dense
                      ></v-text-field>
                    </template>
                    <span>{{ $t("lastname") }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex xs12 md4 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-autocomplete
                        v-bind:label="$t('gender')"
                        v-on="on"
                        index="id"
                        item-value="shortname"
                        item-text="longname"
                        class="required_field"
                        v-model="userDetails.gender"
                        :rules="fieldRules"
                        :items="gender_array"
                        outlined
                        dense
                      ></v-autocomplete>
                    </template>
                    <span>{{ $t("gender") }}</span>
                  </v-tooltip>
                </v-flex>
                 <!-- <v-flex xs12 md4 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-autocomplete
                        v-bind:label="$t('maritalstatus')"
                        v-on="on"
                        index="id"
                        item-value="shortname"
                        item-text="longname"
                       
                        v-model="userDetails.maritalstatus"
                        :rules="fieldRules"
                        :items="maritalstatus_array"
                        outlined
                        dense
                      ></v-autocomplete>
                    </template>
                    <span>{{ $t("maritalstatus") }}</span>
                  </v-tooltip>
                </v-flex> -->
                <v-flex xs12 md4 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-on="on"
                        v-model="userDetails.email"
                        :rules="emailRules"
                        class="required_field"
                        v-bind:label="$t('email_user')"
                        required
                        outlined
                        dense
                      ></v-text-field>
                    </template>
                    <span>{{ $t("email") }}</span>
                  </v-tooltip>
                </v-flex>
                <!-- <v-flex xs12 md4 pl-2>
                  <v-text-field
                    v-model="userDetails.mobile"
                    class="required_field"
                    v-bind:label="$t('mobile')"
                    outlined dense
                    required
                    :rules="[...fieldRules, ...phoneRules]"
                    @keypress.native="isNumber($event)"
                  ></v-text-field>
                </v-flex> -->
              </v-layout>
            </div>
            <div class="col-md-4">
              <v-layout>
                <v-flex xs12>
                  <MediaSelect
                    :label="'Image'"
                    folder="userprofile"
                    :image="userDetails.profile_pic"
                    @updateImage="updateImage"
                  ></MediaSelect>
                </v-flex>
              </v-layout>
            </div>
          </div>
          <h5 class="pl-2 mb-5">{{ $t("other_details") }}</h5>
          <!-- <v-layout>
            <v-flex xs12 md12 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="userDetails.address"
                    v-bind:label="$t('address')"
                    outlined dense
                    class="pr-2"
                  ></v-text-field>
                </template>
                <span>{{ $t("address") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout> -->
          <!-- <v-layout>
            <v-flex xs12 md3 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    v-bind:label="$t('country')"
                    v-on="on"
                    index="id"
                    v-model="userDetails.country"
                    :items="countries"
                    item-text="name"
                    item-value="name"
                    class="pr-2"
                    outlined dense
                    @change="fetch_states(userDetails.country)"
                  ></v-autocomplete>
                </template>
                <span>{{ $t("country") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md3 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    v-bind:label="$t('state')"
                    v-on="on"
                    index="id"
                    item-value="name"
                    item-text="name"
                    class="pr-2"
                    v-model="userDetails.state"
                    :items="states"
                    outlined dense
                    @change="fetch_cities(userDetails.state)"
                  ></v-autocomplete>
                </template>
                <span>{{ $t("state") }}</span>
              </v-tooltip>
            </v-flex> -->
          <!-- <v-flex xs12 md3 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    v-bind:label="$t('city')"
                    v-on="on"
                    index="id"
                    item-value="name"
                    item-text="name"
                    class="pr-2"
                    v-model="userDetails.city"
                    :items="cities"
                    outlined dense
                  ></v-autocomplete>
                </template>
                <span>{{ $t("city") }}</span>
              </v-tooltip>
            </v-flex> -->

          <!-- <v-flex xs12 md3 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="userDetails.postcode"
                    v-on="on"
                    v-bind:label="$t('postal_code')"
                    class="pr-2"
                    outlined dense
                    :rules="postcodeRules"
                    @keypress.native="isNumber($event)"
                  >
                  </v-text-field>
                </template>
                <span>{{ $t("postal_code") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout> -->
          <v-layout>
            <v-flex xs12 md3 pl-2>
              <DatePicker
                :label="$t('date_of_birth')"
                :stored_date="userDetails.dob"
                :max="new Date().toISOString().substr(0, 10)"
                @formatted_date="formattedDate"
              />
            </v-flex>
            <!-- <v-flex xs12 md3 pl-2>
              <v-text-field
                v-model="userDetails.phone"
                v-bind:label="$t('phone')"
                :rules="phoneRules"
                outlined dense
                class="pr-2"
              ></v-text-field>
            </v-flex> -->
          </v-layout>
        </v-form>
      </div>
      <div class="d-block text-right card-footer">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block mr-2">
              <v-btn
                v-on="on"
                small
                @click="$router.go(-1)"
                class="ma-1 font-weight-bold cancel-btn"
                color="dark cancel_button"
                >{{ $t("cancel") }}</v-btn
              >
            </div>
          </template>
          <span>{{ $t("cancel") }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block">
              <v-btn
                :disabled="isDisabled"
                color="green darken-1"
                @click="saveUser"
                small
                class="mr-2 success hover_shine"
              >
                {{ $t("save") }}
                <b-spinner
                  :disabled="isBtnLoading"
                  small
                  v-if="isBtnLoading"
                ></b-spinner>
              </v-btn>
            </div>
          </template>
          <span>{{ $t("save") }}</span>
        </v-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
import MediaSelect from "../Components/Upload/MediaSelect.vue";
import DatePicker from "../Components/DatePicker.vue";
export default {
  components: {
    VueElementLoading,
    MediaSelect,
    DatePicker,
  },
  data: (vm) => ({
    valid: true,
    loader: false,
    admin_organisation: false,
    file: "",
    isBtnLoading: false,
    isDisabled: false,
    menu: "",
    dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    userDetails: {
      id: 0,
      salutation: "",
      firstname: "",
      middlename: "",
      lastname: "",
      gender: "",
      email: "",
      profile_pic: "",
      status: 1,
      dob: "",
      role_id: null,
      // maritalstatus:"",
      org_id: "",
    },
    passwordvalue: String,
    userRoles: [],
    org_name: [],
    items: [],
    gender_array: [],
    salutation_array: [],
    // maritalstatus_array:[],
    countries: [],
    states: [],
    cities: [],
    padStart: "",
    user: [],
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    numberRules() {
      return [(v) => !!v || this.$t("valid_number_required")];
    },

    phoneRules() {
      return [
        (v) =>
          (v >= 0 && v <= 999999999999) || this.$t("valid_number_required"),
      ];
    },

    emailRules() {
      return [
        (v) => !!v || this.$t("email_required"),
         v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || this.$t("email_valid"),
      ];
    },

    postcodeRules() {
      return [(v) => (v >= 0 && v <= 999999) || this.$t("postcode_valid")];
    },
  },

  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    // this.rolename = JSON.parse(localStorage.getItem("userrole"));
    this.fetchRole();
    this.fetchOrg();
    this.fetchlookup();
    this.get_countries();
  },

  created() {},
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "fetchuserbyslug?slug=" +
                this.$route.query.slug
            )
            .then((res) => {
              this.btnloading = false;
              this.loader = false;
              if (res.data.status == "S") {
                this.message = res.data.message;
                this.userDetails = res.data.user;
                this.fetch_states(this.userDetails.country);
                this.fetch_cities(this.userDetails.state);
                if (this.$route.query.pathname) {
                  this.from_path = this.$route.query.pathname;
                }
              } else if (res.data.status == "E") {
                this.message = res.data.message;
              }
            })
            .catch((err) => {
              this.isDisabled = false;
              console.log("this error" + err);
            });
        }
      },
    },
  },
  methods: {
    formattedDate(formatted_date) {
      this.userDetails.dob = formatted_date;
    },
    saveUser() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        if (!Number.isInteger(this.userDetails.role_id)) {
          this.userDetails.role_id = this.userDetails.role_id.id;
          this.userDetails.org_id = this.userDetails.org_id.id;
          this.userDetails.created_by = this.user.id;
          if (this.user.hr_employee.rolename == "Admin") {
            this.userDetails.org_id = this.user.org_id;
            // this.userDetails.created_by = this.user.id;
          }
        }
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "saveuser",
            this.userDetails
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
              if (this.userDetails.id == 0) {
                this.$router.push({
                  name: "users",
                });
              } else {
                this.$router.push({
                  name: "users.view",
                  query: {
                    slug: this.userDetails.slug,
                  },
                });
              }
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
            this.isBtnLoading = false;
            this.isDisabled = false;
            console.log("this error" + err);
          });
      }
    },
    userType_selected(userRoles) {
      if (userRoles.role_display_name != "SuperUser") {
        this.admin_organisation = true;
      } else {
        this.admin_organisation = false;
      }
    },

    clear() {
      this.$refs.form.reset();
    },

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
            lookup_type: "MARITAL_STATUS",
          },
        })
        .then((response) => {
          this.maritalstatus_array = response.data.lookup_details;
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

    get_countries() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_countries")
        .then((response) => {
          this.countries = response.data.countries;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetch_states(name) {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_states_name/" + name)
        .then((response) => {
          this.states = response.data.states;
          this.initval = false;
          this.cities = [];
        })
        .catch((err) => {
          this.initval = false;
          console.log(err);
        });
    },

    fetch_cities(name) {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_cities_name/" + name)
        .then((response) => {
          this.cities = response.data.cities;
          this.initval = false;
        })
        .catch((err) => {
          this.initval = false;
          console.log(err);
        });
    },

    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}-${month}-${year}`;
    },

    isNumber(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      }
      return true;
    },

    parseDate(date) {
      if (!date) return null;
      const [month, day, year] = date.split("-");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },

    fetchRole() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchrole")
        .then((res) => {
          this.btnloading = false;
          if (res.data.status == "S") {
            this.message = res.data.message;
            this.userRoles = res.data.roles;
          } else if (res.data.status == "E") {
            this.message = res.data.message;
          }
        })
        .catch((err) => {
          this.isDisabled = false;
          console.log("this error" + err);
        });
    },

    fetchOrg() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_org_name")
        .then((response) => {
          this.org_name = response.data.organization;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateImage(imagedata) {
      this.userDetails.image_url = imagedata;
    },
  },
};
</script>
