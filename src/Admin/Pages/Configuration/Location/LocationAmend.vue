<template>
  <div class="container-fluid mt-3 p-0">
    <div class="mb-3 mx-auto">
      <div class="card-header">
        <div class=" ">
          <div class="card-header-title font-size-lg text-capitalize titlewrap">
            {{ $t("create_location") }}
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
          <div class="row">
            <div class="col-md-12 mb-5">
              <v-layout>
                <v-flex xs12 md5 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-on="on"
                        v-model="location.shortname"
                        :rules="fieldRules"
                        v-bind:label="$t('location_name')"
                        required
                        class="required_field"
                        outlined
                        dense
                      ></v-text-field>
                    </template>
                    <span>{{ $t("location_name") }}</span>
                  </v-tooltip>
                </v-flex>
                <v-flex xs12 md3 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-on="on"
                        v-model="location.location_id"
                        :rules="fieldRules"
                        required
                        v-bind:label="$t('location_id')"
                        class="required_field"
                        outlined
                        dense
                      ></v-text-field>
                    </template>
                    <span>{{ $t("location_id") }}</span>
                  </v-tooltip>
                </v-flex>
                <!-- <v-flex xs12 md9 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-textarea
                        rows="1"
                        v-on="on"
                        auto-grow
                        counter="500"
                        v-model="location.description"
                        maxlength="500"
                        v-bind:label="$t('organisationdescription')"
                        required
                        outlined
                        dense
                      ></v-textarea>
                    </template>
                    <span>{{ $t("organisationdescription") }}</span>
                  </v-tooltip>
                </v-flex> -->
              </v-layout>
              <v-layout></v-layout>
            </div>
          </div>
          <h5 class="pl-2 mb-5">{{ $t("Address_details") }}</h5>
          <v-layout>
            <v-flex xs12 md12 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-textarea
                    v-on="on"
                    rows="2"
                    maxlength="200"
                    v-model="location.address"
                    :rules="fieldRules"
                    required
                    v-bind:label="$t('address')"
                    class="required_field"
                    outlined
                    dense
                  ></v-textarea>
                </template>
                <span>{{ $t("organisationaddress") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
          <v-layout>
            <Countries
              col-md-9
              @countries_change="CountriesChange"
              :selected_country="location.country"
              :selected_state="location.state"
              :selected_city="location.city"
            />
            <v-flex xs12 md3 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    maxlength="6"
                    v-on="on"
                    v-model="location.postcode"
                    :rules="[...fieldRules, ...postcodeRules]"
                    @keypress.native="isNumber($event)"
                    v-bind:label="$t('organisationpostcode')"
                    required
                    class="required_field"
                    outlined
                    dense
                  ></v-text-field>
                </template>
                <span>{{ $t("organisationpostcode") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </v-form>
      </div>
      <div class="d-block text-right mr-4">
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
                @click="saveSite"
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
import Countries from "../Components/CountriesStatesCities.vue";
export default {
  components: {
    VueElementLoading,
    Countries,
  },
  data: () => ({
    valid: true,
    loader: false,
    file: "",
    isBtnLoading: false,
    isDisabled: false,
    location: {
      id: 0,
      shortname: "",
      description: "",
      location_id: "",
      country: "",
      state: "",
      city: "",
      address: "",
      address2: "",
      address3: "",
      postcode: "",
      site_id: "",
      status: 1,
    },
    userRoles: [],
    items: [],
    countries: [],
    states: [],
    cities: [],
    site: "",
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    numberRules() {
      return [(v) => !!v || this.$t("valid_number_required")];
    },
    postcodeRules() {
      return [(v) => (v >= 0 && v <= 999999) || this.$t("postcode_valid")];
    },
  },

  mounted() {
    // this.fetch_countries();
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
                "fetchlocation?slug=" +
                this.$route.query.slug
            )
            .then((res) => {
              this.btnloading = false;
              this.loader = false;
              if (res.data.status == "S") {
                this.message = res.data.message;
                this.location = res.data.fndSite;
                // this.fetch_states(this.location.country);
                // this.fetch_cities(this.location.state);
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
    CountriesChange(type, name) {
      if (type == "country") {
        this.location.country = name;
      } else if (type == "state") {
        this.location.state = name;
      } else if (type == "city") {
        this.location.city = name;
      }
    },
    saveSite() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        axios
          .post(process.env.VUE_APP_API_URL_ADMIN + "createsite", this.location)
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
              this.$router.push({
                name: "location",
              });
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

    clear() {
      this.$refs.form.reset();
    },

    // fetch_countries() {
    //   axios
    //     .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_countries")
    //     .then((response) => {
    //       this.countries = response.data.countries;
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // },

    // fetch_states(name) {
    //   this.initval = true;
    //   axios
    //     .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_states_name/" + name)
    //     .then((response) => {
    //       this.states = response.data.states;
    //       this.initval = false;
    //       this.cities = [];
    //     })
    //     .catch((err) => {
    //       this.initval = false;
    //       console.log(err);
    //     });
    // },

    // fetch_cities(name) {
    //   this.initval = true;
    //   axios
    //     .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_cities_name/" + name)
    //     .then((response) => {
    //       this.cities = response.data.cities;
    //       this.initval = false;
    //     })
    //     .catch((err) => {
    //       this.initval = false;
    //       console.log(err);
    //     });
    // },

    isNumber(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      }
      return true;
    },
  },
};
</script>
