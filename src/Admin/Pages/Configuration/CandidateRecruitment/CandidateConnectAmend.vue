<template>
  <div class="maincontainerconnect mt-3 p-0">
    <div class="mb-3 mx-auto">
      <div class="card-header">
        <div class="card-header-tab">
          <div class="card-header-title font-size-lg text-capitalize titlewrap">
            {{ $t("create_amend_connect") }}
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
          <div class="px-3">
            <v-layout wrap pr-2>
              <v-flex md6 sm12 pl-3 class="createlookupflex">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-select
                      v-model="RecruitmentConnect.connect_type"
                      :items="connect_type_array"
                      item-text="longname"
                      item-value="shortname"
                      v-bind:label="$t('connect_type')"
                      v-on="on"
                      outlined
                      dense
                      class="required_field"
                      :rules="fieldRules"
                      required
                    ></v-select>
                  </template>
                  <span>{{ $t("industry_type") }}</span>
                </v-tooltip>
                <CreateLookup
                  :dropdownlabel="$t('connect_type')"
                  lookup_parent_name="CONNECT_TYPE"
                  @lookup_data="lookupMessage"
                ></CreateLookup>
              </v-flex>
            </v-layout>
            <h5 class="ml-3">{{ $t("primary_contact_details") }}</h5>
            <v-layout wrap mt-4 pr-2>
              <v-flex md4 sm4 pl-3>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-autocomplete
                      v-bind:label="$t('salutation')"
                      v-on="on"
                      index="id"
                      item-value="shortname"
                      item-text="longname"
                      v-model="RecruitmentConnect.salutation"
                      :items="salutation_array"
                      outlined
                      dense
                    ></v-autocomplete>
                  </template>
                  <span>{{ $t("salutation") }}</span>
                </v-tooltip>
              </v-flex>
              <v-flex md8 sm8 pl-3>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      maxlength="100"
                      v-on="on"
                      v-model="RecruitmentConnect.contact_name"
                      v-bind:label="$t('contact_name')"
                      outlined
                      dense
                      required
                    ></v-text-field>
                  </template>
                  <span>{{ $t("contact_name") }}</span>
                </v-tooltip>
              </v-flex>
              <v-flex md6 sm6 pl-3>
                <div class="row">
                  <div class="col-md-12">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          dense
                          prefix="+"
                          outlined
                          v-bind:label="$t('country_code')"
                          v-on="on"
                          required
                          :rules="fieldRules"
                          @keypress.native="isNumber($event)"
                          class="required_field input_field"
                          hide-details
                          maxlength="5"
                          v-model="RecruitmentConnect.contact_number_code"
                        ></v-text-field>
                      </template>
                      <span>{{ $t("country_code") }}</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          maxlength="15"
                          v-on="on"
                          v-model="RecruitmentConnect.contact_number"
                          @keypress.native="isNumber($event)"
                          class="required_field select_field"
                          required
                          :rules="fieldRules"
                          v-bind:label="$t('contact_no')"
                          outlined
                          dense
                        ></v-text-field>
                      </template>
                      <span>{{ $t("contact_no") }}</span>
                    </v-tooltip>
                  </div>
                </div>
              </v-flex>
              <v-flex md6 sm6 pl-3>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      maxlength="100"
                      v-on="on"
                      v-model="RecruitmentConnect.contact_email"
                      :rules="emailRules"
                      v-bind:label="$t('contact_email')"
                      outlined
                      dense
                      required
                    ></v-text-field>
                  </template>
                  <span>{{ $t("contact_email") }}</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
            <h5 class="ml-3">{{ $t("company_details") }}</h5>
            <v-layout wrap mt-4 pr-2>
              <v-flex md6 sm6 pl-3>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      maxlength="100"
                      v-on="on"
                      v-model="RecruitmentConnect.business_name"
                      :rules="fieldRules"
                      v-bind:label="$t('company_name')"
                      outlined
                      dense
                      class="required_field"
                      required
                    ></v-text-field>
                  </template>
                  <span>{{ $t("company_name") }}</span>
                </v-tooltip>
              </v-flex>
              <v-flex md6 sm6 pl-3>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      maxlength="100"
                      v-on="on"
                      v-model="RecruitmentConnect.business_alias"
                      v-bind:label="$t('business_alias')"
                      outlined
                      dense
                    ></v-text-field>
                  </template>
                  <span>{{ $t("business_alias") }}</span>
                </v-tooltip>
              </v-flex>
              <v-flex md6 sm6 pl-3>
                <div class="row">
                  <div class="col-md-12">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          dense
                          prefix="+"
                          outlined
                          v-bind:label="$t('country_code')"
                          v-on="on"
                          required
                          :rules="fieldRules"
                          @keypress.native="isNumber($event)"
                          class="required_field input_field"
                          hide-details
                          maxlength="5"
                          v-model="RecruitmentConnect.contact_no_code"
                        ></v-text-field>
                      </template>
                      <span>{{ $t("country_code") }}</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="RecruitmentConnect.contact_no"
                          class="required_field select_field"
                          v-bind:label="$t('company_contact_no')"
                          v-on="on"
                          :rules="fieldRules"
                          @keypress.native="isNumber($event)"
                          maxlength="15"
                          outlined
                          dense
                        ></v-text-field>
                      </template>
                      <span>{{ $t("company_contact_no") }}</span>
                    </v-tooltip>
                  </div>
                </div>
              </v-flex>
              <v-flex md6 sm6 pl-3>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      maxlength="100"
                      v-on="on"
                      v-model="RecruitmentConnect.email"
                      :rules="emailRules"
                      v-bind:label="$t('company_email')"
                      outlined
                      dense
                      required
                    ></v-text-field>
                  </template>
                  <span>{{ $t("company_email") }}</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
            <h5 class="ml-3">{{ $t("address") }}</h5>
            <v-layout wrap mt-4 pr-2>
              <v-flex md12 sm12 pl-3>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-textarea
                      v-on="on"
                      rows="2"
                      maxlength="200"
                      v-model="RecruitmentConnect.address"
                      v-bind:label="$t('address')"
                      outlined
                      dense
                    ></v-textarea>
                  </template>
                  <span>{{ $t("address") }}</span>
                </v-tooltip>
              </v-flex>
              <v-flex md6 sm6 pl-3>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-autocomplete
                      v-on="on"
                      index="id"
                      v-bind:label="$t('country')"
                      outlined
                      v-model="RecruitmentConnect.country"
                      :items="countries"
                      item-text="name"
                      item-value="name"
                      dense
                      @change="fetch_states(RecruitmentConnect.country)"
                    ></v-autocomplete>
                  </template>
                  <span>{{ $t("country") }}</span>
                </v-tooltip>
              </v-flex>
              <v-flex md6 sm6 pl-3>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-autocomplete
                      v-on="on"
                      v-bind:label="$t('state')"
                      outlined
                      dense
                      index="id"
                      @change="fetch_cities(RecruitmentConnect.state)"
                      item-text="name"
                      item-value="name"
                      v-model="RecruitmentConnect.state"
                      :items="states"
                    ></v-autocomplete>
                  </template>
                  <span>{{ $t("state") }}</span>
                </v-tooltip>
              </v-flex>
              <v-flex md6 sm6 pl-3>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-autocomplete
                      v-on="on"
                      index="id"
                      v-model="RecruitmentConnect.city"
                      item-text="name"
                      item-value="id"
                      v-bind:label="$t('city')"
                      outlined
                      dense
                      :items="cities"
                    ></v-autocomplete>
                  </template>
                  <span>{{ $t("city") }}</span>
                </v-tooltip>
              </v-flex>
              <v-flex md6 sm6 pl-3>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="RecruitmentConnect.post_code"
                      v-on="on"
                      v-bind:label="$t('postal_code')"
                      outlined
                      dense
                      maxlength="10"
                      @keypress.native="isNumber($event)"
                    >
                    </v-text-field>
                  </template>
                  <span>{{ $t("postal_code") }}</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
            <h5 class="ml-3">{{ $t("services_offered") }}</h5>
            <v-layout wrap mt-4 pr-2>
              <v-flex md12 sm12 pl-3>
                <v-combobox
                  v-model="RecruitmentConnect.service_offered"
                  chips
                  multiple
                  required
                  hint="Enter to add tags"
                  :rules="fieldRules"
                  class="required_field majorskillsetcombobox"
                  outlined
                  dense
                  v-bind:label="$t('services_offered')"
                >
                  <template
                    v-slot:selection="{ attrs, item, select, selected }"
                  >
                    <v-chip
                      small
                      v-bind="attrs"
                      :input-value="selected"
                      @click="select"
                      color="primary"
                      class="ma-1"
                    >
                      {{ item }}
                    </v-chip>
                  </template>
                </v-combobox>
              </v-flex>
            </v-layout>
            <!-- <h5 class="ml-3">{{ $t('tax_info') }}</h5>
                        <v-layout wrap mt-4 pr-2>
                            <v-flex md6 sm6 pl-3>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field maxlength=100 v-on="on" v-model="RecruitmentConnect.business_gstin"
                                            v-bind:label="$t('business_gstin')" outlined dense required></v-text-field>
                                    </template>
                                    <span>{{ $t("business_gstin") }}</span>
                                </v-tooltip>
                            </v-flex>
                            <v-flex md6 sm6 pl-3>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field maxlength=100 v-on="on" v-model="RecruitmentConnect.business_pan"
                                            v-bind:label="$t('business_pan_number')" outlined dense></v-text-field>
                                    </template>
                                    <span>{{ $t("business_pan_number") }}</span>
                                </v-tooltip>
                            </v-flex>
                        </v-layout> -->
            <!-- <h5 class="ml-3">{{ $t('company_social_links') }}</h5>
                        <v-layout wrap mt-5 pr-2>
                            <v-flex md6 sm6 pl-3>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field maxlength=100 v-on="on" v-model="RecruitmentConnect.website"
                                            v-bind:label="$t('website')" outlined dense></v-text-field>
                                    </template>
                                    <span>{{ $t("website") }}</span>
                                </v-tooltip>
                            </v-flex>
                            <v-flex md6 sm6 pl-3>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field maxlength=100 v-on="on" v-model="RecruitmentConnect.linkedin"
                                            v-bind:label="$t('linkedin')" outlined dense required></v-text-field>
                                    </template>
                                    <span>{{ $t("linkedin") }}</span>
                                </v-tooltip>
                            </v-flex>
                            <v-flex md6 sm6 pl-3>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field maxlength=100 v-on="on" v-model="RecruitmentConnect.facebook"
                                            v-bind:label="$t('facebook')" outlined dense required></v-text-field>
                                    </template>
                                    <span>{{ $t("facebook") }}</span>
                                </v-tooltip>
                            </v-flex>
                            <v-flex md6 sm6 pl-3>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field maxlength=100 v-on="on" v-model="RecruitmentConnect.twitter"
                                            v-bind:label="$t('twitter')" outlined dense></v-text-field>
                                    </template>
                                    <span>{{ $t("twitter") }}</span>
                                </v-tooltip>
                            </v-flex>
                            <v-flex md6 sm6 pl-3>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field maxlength=100 v-on="on" v-model="RecruitmentConnect.skype"
                                            v-bind:label="$t('skype')" outlined dense></v-text-field>
                                    </template>
                                    <span>{{ $t("skype") }}</span>
                                </v-tooltip>
                            </v-flex>
                        </v-layout> -->
          </div>
        </v-form>
        <div class="d-block text-right pr-3">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div v-on="on" class="d-inline-block mr-2">
                <v-btn
                  v-on="on"
                  small
                  @click="$router.go(-1)"
                  :disabled="loading"
                  class="ma-1 font-weight-bold cancel-btn"
                  color="dark cancel_button"
                  >{{ $t("cancel") }}</v-btn
                >
              </div>
            </template>
            <span>{{ $t("cancel") }}</span>
          </v-tooltip>
          <!-- <v-btn @click="clear" class="mr-2 btn btn-link btn-sm">clear</v-btn> -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div v-on="on" class="d-inline-block">
                <v-btn
                  :disabled="isBtnLoading"
                  @click="submit"
                  small
                  class="mr-2 success hover_shine"
                  color="green darken-1"
                >
                  {{ $t("submit") }}
                  <b-spinner small v-if="isBtnLoading"></b-spinner>
                </v-btn>
              </div>
            </template>
            <span>{{ $t("submit") }}</span>
          </v-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
import Countries from "../Components/CountriesStatesCities.vue";
import CreateLookup from "../../../Pages/CreateLookup.vue";
import { Country, State, City } from "country-state-city";
// import csc from 'country-state-city';

export default {
  components: {
    VueElementLoading,
    Countries,
    CreateLookup,
  },
  data: () => ({
    valid: true,
    successmessage: "",
    message: "",
    valid_error: false,
    file: "",
    loading: false,
    isBtnLoading: false,
    loader: false,
    RecruitmentConnect: {
      id: 0,
      salutation: "",
      contact_name: "",
      contact_number_code: "",
      contact_number: "",
      contact_email: "",
      connect_type: "",
      business_name: "",
      business_alias: "",
      contact_no_code: "",
      contact_no: "",
      email: "",
      country: "",
      state: "",
      city: "",
      post_code: "",
      address: "",
      service_offered: "",
    },
    country_code: "",
    countries: [],
    states: [],
    cities: [],
    connect_type_array: [],
    salutation_array: [],
  }),
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    emailRules() {
      return [
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          this.$t("email_valid"),
      ];
    },
  },

  mounted() {},

  created() {
    this.countries = Country.getAllCountries();
    this.fetchLookups();
    // this.get_countries();
  },
  watch: {
    "$route.query.id": {
      immediate: true,
      handler() {
        if (this.$route.query.id > 0) {
          this.fetchconnectbyId(this.$route.query.id);
        }
      },
    },
  },
  methods: {
    lookupMessage(lookup_data) {
      if (lookup_data.status == "S") {
        this.flashMessage.success({
          message: lookup_data.message,
          time: 4000,
          blockClass: "custom-block-class",
        });
        this.fetchLookups();
      } else {
        this.flashMessage.error({
          message: lookup_data.message,
          time: 4000,
          blockClass: "custom-block-class",
        });
      }
    },
    fetchconnectbyId(id) {
      this.loader = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "edit_recruitment_connect/" + id
        )
        .then((res) => {
          if ((res.data.status = "S")) {
            this.RecruitmentConnect = res.data.connect;
            this.RecruitmentConnect.service_offered = JSON.parse(
              res.data.connect.service_offered
            );
            if(this.RecruitmentConnect.country){

              this.fetch_states(this.RecruitmentConnect.country);
            }
            // this.fetch_cities(this.RecruitmentConnect.state);
            this.loader = false;
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
        });
    },

    fetchLookups() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "CONNECT_TYPE",
          },
        })
        .then((response) => {
          this.connect_type_array = response.data.lookup_details;
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

    fetch_states(country_name) {
    
        this.country_code = this.countries.find(
          (x) => x.name == country_name
        ).isoCode;
        this.states = State.getStatesOfCountry(this.country_code);
        this.fetch_cities()
   
      //   states
    },

    fetch_cities() {
    //   alert(this.country_code);
      this.cities = City.getCitiesOfCountry(this.country_code);
    },
    isNumber(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      }
      return true;
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.isBtnLoading = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "create_recruitment_connect",
            this.RecruitmentConnect
          )
          .then((res) => {
            this.btnloading = false;
            if (res.data.status == "S") {
              this.flashMessage.success({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.$router.go(-1);
            } else {
              this.isBtnLoading = false;
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
            }
          })
          .catch((err) => {
            this.isBtnLoading = false;
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            console.log("error", err);
          });
      }
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>
<style scoped>
.currency-type >>> .v-input__append-inner {
  display: none;
}

.currencytypeparentdiv /deep/ .v-label {
  left: -3px !important;
  right: auto !important;
  position: absolute !important;
  font-size: 14px !important;
}

.majorskillsetcombobox /deep/ .v-input__append-inner {
  display: none !important;
}

.maincontainerconnect {
  width: 75%;
  margin-left: auto;
  margin-right: auto;
}

.select_field {
  position: absolute;
  right: 15px !important;
  top: 12px;
  width: 62%;
  height: 20px !important;
}

.select_field /deep/ .v-label--active {
  background: white;
  padding: 0px 12px 0px 12px;
}
</style>
