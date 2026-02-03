<template>
  <div class="container-fluid mt-3 p-0" style="background: white">
    <div class="mx-auto">
      <div class="card-header stick-header">
        <div class="card-header-tab">
          <div class="card-header-title font-size-lg text-capitalize titlewrap">
            {{ $t("create_amend_leads") }}
          </div>
        </div>
      </div>
      <div class="card-body">
        <VueElementLoading
          :active="loader"
          spinner="bar-fade-scale"
          color="var(--primary)"
        />
        <!-- {{ basicDetails }} -->
        <v-form ref="form" v-model="valid">
          <div class="row">
            <div class="col-md-4 leadtextfields pb-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    maxlength="50"
                    v-on="on"
                    v-model="basicDetails.name"
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
            </div>
            <div class="col-md-4 leadtextfields pb-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-select
                    v-model="basicDetails.lead_owner"
                    :items="lead_owners_array"
                    v-bind:label="$t('lead_owner')"
                    v-on="on"
                    outlined
                    item-value="id"
                    item-text="Full_Code"
                    dense
                    class="required_field"
                    :rules="fieldRules"
                    required
                  ></v-select>
                </template>
                <span>{{ $t("lead_owner") }}</span>
              </v-tooltip>
            </div>
            <div class="col-md-4 pb-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    maxlength="200"
                    v-on="on"
                    v-model="basicDetails.email"
                    :rules="[...emailRules, ...fieldRules]"
                    v-bind:label="$t('email')"
                    outlined
                    dense
                    class="required_field"
                    required
                  ></v-text-field>
                </template>
                <span>{{ $t("email") }}</span>
              </v-tooltip>
            </div>
            <div class="col-md-4 leadtextfields pb-0">
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
                        class="required_field input_field"
                        hide-details
                        maxlength="5"
                        v-model="basicDetails.phone_code"
                      ></v-text-field>
                    </template>
                    <span>{{ $t("country_code") }}</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="basicDetails.phone"
                        class="required_field select_field"
                        v-bind:label="$t('contact_no')"
                        v-on="on"
                        :rules="fieldRules"
                        @keypress.native="isNumber($event)"
                        maxlength="15"
                        outlined
                        dense
                      ></v-text-field>
                    </template>
                    <span>{{ $t("contact_no") }}</span>
                  </v-tooltip>
                </div>
              </div>
            </div>
            <div class="col-md-4 leadtextfields createlookupflex pb-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-select
                    v-model="basicDetails.company_size"
                    :items="companysize_array"
                    v-bind:label="$t('company_size')"
                    item-text="longname"
                    item-value="shortname"
                    v-on="on"
                    outlined
                    dense
                    class="required_field"
                    :rules="fieldRules"
                    required
                  ></v-select>
                </template>
                <span>{{ $t("company_size") }}</span>
              </v-tooltip>
              <CreateLookup
                :dropdownlabel="$t('company_size')"
                lookup_parent_name="COMPANY_SIZE"
                @lookup_data="lookupMessage"
              ></CreateLookup>
            </div>
            <div class="col-md-4 pb-0">
              <div class="row">
                <div class="col-md-12">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <div class="currencytypeparentdiv">
                        <v-select
                          v-model="basicDetails.currency_type"
                          :items="currency_array"
                          item-text="shortname"
                          item-value="id"
                          v-bind:label="$t('currency_type')"
                          v-on="on"
                          outlined
                          dense
                          class="required_field currency-type"
                          :rules="fieldRules"
                          required
                        ></v-select>
                      </div>
                    </template>
                    <span>{{ $t("currency_type") }}</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        maxlength="20"
                        v-model="basicDetails.currency"
                        class="required_field select_field"
                        v-bind:label="$t('annual_revenue')"
                        v-on="on"
                        :rules="fieldRules"
                        @keypress.native="isNumber($event)"
                        outlined
                        dense
                      ></v-text-field>
                    </template>
                    <span>{{ $t("annual_revenue") }}</span>
                  </v-tooltip>
                </div>
              </div>
            </div>
            <div class="col-md-12 pb-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-textarea
                    rows="4"
                    v-on="on"
                    class="pr-2"
                    maxlength="4000"
                    counter
                    v-model="basicDetails.description"
                    v-bind:label="$t('about_company')"
                    outlined
                    dense
                  ></v-textarea>
                </template>
                <span>{{ $t("about_company") }}</span>
              </v-tooltip>
            </div>
            <div class="col-md-12 pb-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-textarea
                    rows="4"
                    v-on="on"
                    class="pr-2"
                    maxlength="4000"
                    counter
                    v-model="basicDetails.requirement"
                    v-bind:label="$t('lead_requirement')"
                    outlined
                    dense
                  ></v-textarea>
                </template>
                <span>{{ $t("lead_requirement") }}</span>
              </v-tooltip>
            </div>
          </div>
          <h5 class="mt-3">{{ $t("primary_contact_details") }}</h5>
          <div class="row mt-2" style="margin-bottom: 24px">
            <div class="col-md-4 pb-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    v-bind:label="$t('salutation')"
                    v-on="on"
                    index="id"
                    item-value="shortname"
                    item-text="longname"
                    v-model="basicDetails.primary_contact.salutation"
                    :items="salutation_array"
                    class="required_field"
                    :rules="fieldRules"
                    outlined
                    dense
                  ></v-autocomplete>
                </template>
                <span>{{ $t("salutation") }}</span>
              </v-tooltip>
            </div>
            <div class="col-md-4 pb-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="basicDetails.primary_contact.contact_name"
                    maxlength="200"
                    v-bind:label="$t('contact_name')"
                    required
                    outlined
                    dense
                    :rules="fieldRules"
                    class="required_field"
                  ></v-text-field>
                </template>
                <span>{{ $t("contact_name") }}</span>
              </v-tooltip>
            </div>
            <div class="col-md-4 pb-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="basicDetails.primary_contact.contact_email"
                    v-bind:label="$t('email')"
                    outlined
                    maxlength="200"
                    :rules="[...fieldRules, ...emailRules]"
                    dense
                    class="required_field"
                  ></v-text-field>
                </template>
                <span>{{ $t("email") }}</span>
              </v-tooltip>
            </div>
            <div class="col-md-4 pb-0">
              <div class="row">
                <div class="col-md-12">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        dense
                        outlined
                        v-bind:label="$t('country_code')"
                        v-on="on"
                        prefix="+"
                        @keypress.native="isNumber($event)"
                        maxlength="5"
                        required
                        :rules="fieldRules"
                        class="required_field input_field"
                        hide-details
                        v-model="basicDetails.primary_contact.phone_code"
                      ></v-text-field>
                    </template>
                    <span>{{ $t("country_code") }}</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="basicDetails.primary_contact.contact_phone"
                        class="required_field select_field"
                        v-bind:label="$t('contact_no')"
                        maxlength="15"
                        v-on="on"
                        :rules="fieldRules"
                        @keypress.native="isNumber($event)"
                        outlined
                        dense
                      ></v-text-field>
                    </template>
                    <span>{{ $t("contact_no") }}</span>
                  </v-tooltip>
                </div>
              </div>
            </div>
          </div>
          <h5 class="mt-5">{{ $t("company_contact_address") }}</h5>
          <div class="row mt-2">
            <div class="col-md-12 pb-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-textarea
                    v-on="on"
                    rows="2"
                    maxlength="120"
                    v-model="basicDetails.address"
                    :rules="fieldRules"
                    required
                    v-bind:label="$t('address')"
                    class="required_field"
                    outlined
                    dense
                  ></v-textarea>
                </template>
                <span>{{ $t("address") }}</span>
              </v-tooltip>
            </div>
            <div class="col-md-4 leadtextfields pb-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    v-on="on"
                    index="id"
                    v-bind:label="$t('country')"
                    outlined
                    v-model="basicDetails.country"
                    :items="countries"
                    item-text="name"
                    item-value="id"
                    dense
                    @change="fetch_states(basicDetails.country)"
                  ></v-autocomplete>
                </template>
                <span>{{ $t("country") }}</span>
              </v-tooltip>
            </div>
            <div class="col-md-4 leadtextfields pb-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    v-on="on"
                    v-bind:label="$t('state')"
                    outlined
                    dense
                    class="pr-2"
                    index="id"
                    @change="fetch_cities(basicDetails.state)"
                    item-text="name"
                    item-value="id"
                    v-model="basicDetails.state"
                    :items="states"
                  ></v-autocomplete>
                </template>
                <span>{{ $t("state") }}</span>
              </v-tooltip>
            </div>
            <div class="col-md-4 pb-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    v-on="on"
                    index="id"
                    v-model="basicDetails.city"
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
            </div>
          </div>
          <h5 class="mt-3">Other Information</h5>
          <div class="row mt-2">
            <div class="col-md-4 leadtextfields pb-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    maxlength="100"
                    v-model="basicDetails.region"
                    class="required_field"
                    v-bind:label="$t('region')"
                    v-on="on"
                    :rules="fieldRules"
                    outlined
                    dense
                  ></v-text-field>
                </template>
                <span>{{ $t("region") }}</span>
              </v-tooltip>
            </div>

            <div class="col-md-4 leadtextfields createlookupflex pb-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-select
                    v-model="basicDetails.industry_type"
                    :items="industry_type_array"
                    item-text="longname"
                    item-value="shortname"
                    v-bind:label="$t('industry_type')"
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
                :dropdownlabel="$t('industry_type')"
                lookup_parent_name="INDUSTRY_TYPE"
                @lookup_data="lookupMessage"
              ></CreateLookup>
            </div>
            <div class="col-md-4 createlookupflex pb-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-select
                    v-model="basicDetails.service_type"
                    :items="service_type_array"
                    item-text="longname"
                    item-value="shortname"
                    v-bind:label="$t('service_type')"
                    v-on="on"
                    outlined
                    dense
                    class="required_field"
                    :rules="fieldRules"
                    required
                  ></v-select>
                </template>
                <span>{{ $t("service_type") }}</span>
              </v-tooltip>
              <CreateLookup
                :dropdownlabel="$t('service_type')"
                lookup_parent_name="SERVICE_TYPE"
                @lookup_data="lookupMessage"
              ></CreateLookup>
            </div>
            <div class="col-md-2 leadtextfields pb-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    maxlength="10"
                    v-model="basicDetails.deal_size"
                    class="required_field"
                    v-bind:label="$t('deal_size')"
                    v-on="on"
                    :rules="fieldRules"
                    @keypress.native="isNumber($event)"
                    outlined
                    dense
                  ></v-text-field>
                </template>
                <span>{{ $t("deal_size") }}</span>
              </v-tooltip>
            </div>
            <div class="col-md-2 leadtextfields pb-0">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-select
                    v-model="basicDetails.lead_type"
                    :items="lead_category_array"
                    item-text="longname"
                    item-value="longname"
                    v-bind:label="$t('lead_category')"
                    v-on="on"
                    outlined
                    dense
                    class="required_field"
                    :rules="fieldRules"
                    required
                  ></v-select>
                </template>
                <span>{{ $t("lead_category") }}</span>
              </v-tooltip>
            </div>
            <div class="col-md-4 leadtextfields pb-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-select
                    v-model="basicDetails.lead_status"
                    :items="leadstatus_array"
                    v-bind:label="$t('lead_status')"
                    item-text="longname"
                    item-value="shortname"
                    v-on="on"
                    outlined
                    dense
                    class="required_field"
                    :rules="fieldRules"
                    required
                  ></v-select>
                </template>
                <span>{{ $t("lead_status") }}</span>
              </v-tooltip>
            </div>
            <div class="col-md-4 createlookupflex pb-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-select
                    v-model="basicDetails.lead_source"
                    :items="leadsource_array"
                    item-text="longname"
                    item-value="shortname"
                    v-bind:label="$t('lead_source')"
                    v-on="on"
                    outlined
                    dense
                    class="required_field"
                    :rules="fieldRules"
                    required
                  ></v-select>
                </template>
                <span>{{ $t("lead_source") }}</span>
              </v-tooltip>
              <CreateLookup
                :dropdownlabel="$t('lead_source')"
                lookup_parent_name="LEAD_SOURCE"
                @lookup_data="lookupMessage"
              ></CreateLookup>
            </div>
            <!-- <div class="col-md-1 pl-5 leadtextfields" style="margin-top: -16px">
              <label>Status</label>
              <v-switch
                class="mt-0"
                v-model="basicDetails.status"
                color="success"
                inset
              >
              </v-switch>
            </div> -->
          </div>
          <h5 class="mt-3">Company Social Links</h5>
          <div class="row mt-2">
            <div class="col-md-6 leadtextfields pb-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    maxlength="100"
                    v-model="basicDetails.linkedin"
                    v-bind:label="$t('linkedin')"
                    v-on="on"
                    outlined
                    dense
                  ></v-text-field>
                </template>
                <span>{{ $t("linkedin") }}</span>
              </v-tooltip>
            </div>
            <div class="col-md-6 pb-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="basicDetails.skype"
                    v-bind:label="$t('skype')"
                    maxlength="100"
                    v-on="on"
                    outlined
                    dense
                  ></v-text-field>
                </template>
                <span>{{ $t("skype") }}</span>
              </v-tooltip>
            </div>
            <div class="col-md-6 leadtextfields pb-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    maxlength="100"
                    v-model="basicDetails.facebook"
                    v-bind:label="$t('facebook')"
                    v-on="on"
                    outlined
                    dense
                  ></v-text-field>
                </template>
                <span>{{ $t("facebook") }}</span>
              </v-tooltip>
            </div>
            <div class="col-md-6 pb-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="basicDetails.twitter"
                    v-bind:label="$t('twitter')"
                    v-on="on"
                    outlined
                    maxlength="100"
                    dense
                  ></v-text-field>
                </template>
                <span>{{ $t("twitter") }}</span>
              </v-tooltip>
            </div>
          </div>
        </v-form>
      </div>
      <div class="d-block text-right action-footer">
        <v-divider></v-divider>
        <div class="pb-2 px-3">
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
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div v-on="on" class="d-inline-block">
                <v-btn
                  :disabled="isDisabled"
                  @click="submit"
                  small
                  class="mr-2 success hover_shine"
                  color="green darken-1"
                >
                  {{ $t("submit") }}
                  <b-spinner
                    :disabled="isBtnLoading"
                    small
                    v-if="isBtnLoading"
                  ></b-spinner>
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
    isDisabled: false,
    loader: false,
    basicDetails: {
      id: 0,
      lead_type: "",
      name: "",
      lead_owner: "",
      email: "",
      phone_code: "",
      phone: null,
      address: "",
      lead_status: "New",
      city: null,
      state: null,
      country: null,
      description: "",
      comments: "",
      region: "",
      company_size: null,
      industry_type: "",
      service_type: "",
      currency_type: null,
      currency: "",
      deal_size: null,
      status: 1,
      lead_source: "",
      linkedin: "",
      skype: "",
      facebook: "http://facebook.com/",
      twitter: "https://twitter.com/",
      primary_contact: {
        id: 0,
        lead_id: null,
        salutation: "",
        contact_name: "",
        phone_code: "",
        contact_phone: "",
        contact_email: "",
        is_primary: 1,
      },
    },
    companysize_array: [],
    leadsource_array: [],
    countries: [],
    states: [],
    cities: [],
    industry_type_array: [],
    leadstatus_array: [],
    service_type_array: [],
    currency_array: [],
    user: [],
    lead_owners_array: [],
    roles: "",
    emp_id: null,
    org_id: null,
    lead_category_array: [],
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

    numberRules() {
      return [(v) => !!v || this.$t("valid_number_required")];
    },
    phoneRules() {
      return [(v) => !v || v.length >= 10 || this.$t("valid_number_required")];
    },
  },

  async mounted() {
    this.user = await JSON.parse(localStorage.getItem("user"));
    this.org_id = this.user.hr_employee.org_id;
    this.emp_id = this.user.emp_id;
    this.roles = this.user.hr_employee.emprole_name;
    this.fetchLeadsOwners();
  },

  created() {
    this.fetchLookups();
    this.get_countries();
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.id) {
          this.loader = true;
          axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "leads/" +
                this.$route.query.id +
                "/edit"
            )
            .then((res) => {
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "S") {
                this.basicDetails = res.data.lead;
                if (this.basicDetails.country) {
                  this.fetch_states(this.basicDetails.country);
                }
                if (this.basicDetails.state) {
                  this.fetch_cities(this.basicDetails.state);
                }
                this.loader = false;
              } else if (res.data.status == "E") {
                this.flashMessage.error({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class",
                });
                this.loader = false;
              } else {
                this.flashMessage.error({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class",
                });
                this.loader = false;
              }
            })
            .catch((err) => {
              this.loader = false;
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
              console.log(err);
            });
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
    fetchLeadsOwners() {
      this.loader = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchleadownersbyrole")
        .then((res) => {
          if ((res.data.status = "S")) {
            this.lead_owners_array = res.data.lead_owners;
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
            lookup_type: "SALUTATION",
          },
        })
        .then((response) => {
          this.salutation_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "LEAD_CATEGORY",
          },
        })
        .then((response) => {
          this.lead_category_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "INDUSTRY_TYPE",
          },
        })
        .then((response) => {
          this.industry_type_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "SERVICE_TYPE",
          },
        })
        .then((response) => {
          this.service_type_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "CURRENCY",
          },
        })
        .then((response) => {
          this.currency_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "LEAD_SOURCE",
          },
        })
        .then((response) => {
          this.leadsource_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "COMPANY_SIZE",
          },
        })
        .then((response) => {
          this.companysize_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "LEAD_STATUS",
          },
        })
        .then((response) => {
          this.leadstatus_array = response.data.lookup_details;
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
    fetch_states(id) {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_states_name/" + id)
        .then((response) => {
          this.states = response.data.states;
          this.cities = [];
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetch_cities(id) {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_cities_name/" + id)
        .then((response) => {
          this.cities = response.data.cities;
        })
        .catch((err) => {
          console.log(err);
        });
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
        this.isDisabled = true;
        this.isBtnLoading = true;
        if (this.basicDetails.id == 0) {
          axios
            .post(
              process.env.VUE_APP_API_URL_ADMIN + "leads",
              this.basicDetails
            )
            .then((res) => {
              this.btnloading = false;
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
                // this.$router.push({
                //   name: "leadsreport",
                // });
                this.$router.go(-1);
              } else if (res.data.status == "E") {
                this.isBtnLoading = false;
                this.isDisabled = false;
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
              this.isBtnLoading = false;
              this.isDisabled = false;
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
              console.log("error", err);
            });
        } else {
          axios
            .patch(
              process.env.VUE_APP_API_URL_ADMIN +
                "leads/" +
                this.basicDetails.id,
              this.basicDetails
            )
            .then((res) => {
              this.valid_error = false;
              this.btnloading = false;
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
                this.$router.go(-1);
              } else if (res.data.status == "E") {
                this.isBtnLoading = false;
                this.isDisabled = false;
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
              this.isBtnLoading = false;
              this.isDisabled = false;
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
              console.log("error", err);
            });
        }
      } else {
        //alert("Form is Invalid");
      }
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>
<style scoped>
.select_field {
  position: absolute;
  top: 12px;
  right: 15px;
  height: 20px !important;
}

.leadtextfields {
  padding-right: 0px !important;
}

.select_field /deep/ .v-label--active {
  background: white;
  padding: 0px 12px 0px 12px;
}

.currency-type >>> .v-input__append-inner {
  display: none;
}

.currencytypeparentdiv /deep/ .v-label {
  left: -3px !important;
  right: auto !important;
  position: absolute !important;
  font-size: 14px !important;
}
.stick-header {
  position: sticky;
  z-index: 10;
  top: 60px;
}
.action-footer {
  position: sticky;
  z-index: 10;
  background: white;
  bottom: 0px;
}
</style>
