<template>
  <div class="container-fluid mt-3 p-0">
    <div class=" mb-3 mx-auto">
      <div class="">
        <div class="card-header-tab card-header">
          <div class="card-header-title font-size-lg text-capitalize titlewrap">{{ $t("create_organisation") }}</div>
        </div>
      </div>
      <div class="card-body">
        <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
        <v-form ref="form" v-model="valid">
          <h5 class="pl-2 mb-5">{{ $t("Organisation_details") }}</h5>
          <div class="row">
            <div class="col-md-9 mb-4">
              <v-layout>
                <v-flex xs12 md12 pl-2 pr-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field v-on="on" v-model="organisation.shortname" :rules="fieldRules"
                        v-bind:label="$t('organisationname')" required class="required_field" outlined
                        dense></v-text-field>
                    </template>
                    <span>{{ $t("organisationname") }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex md4 pl-2 pr-2>
                  <DatePicker :label="$t('established_date')" :stored_date="organisation.established_date"
                    @formatted_date="formatted_from_date" dense :max="new Date().toISOString().substr(0, 10)"
                    :class_required="'RequiredField'" :rules="fieldRules" v-model="organisation.established_date" />
                </v-flex>
                <v-flex md4 pl-2 pr-2>
                  <v-text-field dense v-model="organisation.tan_no" @keyup="uppercasetan" maxlength="10" outlined
                    v-bind:label="$t('tan_no')"></v-text-field>
                </v-flex>
                <v-flex md4 pl-2 pr-2>
                  <v-text-field dense v-model="organisation.pan_no" maxlength="10" @keyup="uppercasepan" outlined
                    class="required_field" :rules="fieldRules" v-bind:label="$t('pan_no')"></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex md4 pl-2 pr-2>
                  <v-text-field dense v-model="organisation.pt_reg_no" outlined @keyup="uppercasept"
                    v-bind:label="$t('pt_reg_no')"></v-text-field>
                </v-flex>
                <v-flex md4 pl-2 pr-2>
                  <v-text-field dense v-model="organisation.epfo_reg_no" @keyup="uppercaseepfo" outlined
                    v-bind:label="$t('epfo_reg_no')"></v-text-field>
                </v-flex>
                <v-flex md4 pl-2 pr-4>
                  <v-text-field dense v-model="organisation.esic_reg_no" @keyup="uppercasereg" outlined
                    v-bind:label="$t('esic_reg_no')"></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex md4 pl-2 pr-2 class="createlookupflex">
                  <v-autocomplete dense v-model="organisation.establishment_type" class="required_field"
                    :rules="fieldRules" outlined v-bind:label="$t('establishment_type')" :items="establish_type"
                    item-value="shortname" item-text="longname"></v-autocomplete>
                  <CreateLookup lookup_parent_name="ESTABLISHMENT_TYPE" @lookup_data="lookupMessage"
                    :dropdownlabel="$t('establishment_type')"></CreateLookup>
                </v-flex>
                <v-flex md4 pl-2 pr-2>
                  <v-autocomplete dense v-model="organisation.leave_calculation_year" class="required_field"
                    :rules="fieldRules" outlined v-bind:label="$t('leave_setup_based_on')"
                    :items="reporting_based_on_array" item-value="shortname" item-text="shortname"></v-autocomplete>
                </v-flex>
                <v-flex md4 pl-2 pr-2>
                  <v-text-field dense v-model="organisation.website" class="required_field" :rules="websiteRules" outlined
                    v-bind:label="$t('website')"></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex xs12 md8 pl-2 pr-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-autocomplete v-on="on" v-bind:label="$t('working_days')" :items="working_days_array" index="id"
                        item-value="longname" class="required_field" item-text="shortname"
                        v-model="organisation.working_days" :rules="multiplerules" outlined dense multiple required
                        prepend-inner-icon="mdi mdi-calendar-week-outline">
                        <template v-slot:selection="{ item }">
                          <v-chip outlined class="py-2" color="primary" small>
                            <span>{{ item.longname }}</span>
                          </v-chip>
                        </template>


                      </v-autocomplete>
                    </template>
                    <span>{{ $t("working_days") }}</span>
                  </v-tooltip>
                </v-flex>
                <v-flex md4 pl-2 pr-2>
                  <v-select dense v-model="organisation.cov_under_graduity" class="required_field" :rules="fieldRules"
                    outlined v-bind:label="$t('cov_under_graduity')" :items="gratuity_act" item-value="shortname"
                    item-text="shortname"></v-select>
                </v-flex>
              </v-layout>
            </div>
            <div class="col-md-3">
              <v-layout>
                <v-flex xs12>
                  <MediaSelect :label="'Image'" folder="OrganisationImage" :image="organisation.logo"
                    @updateImage="updateImage"></MediaSelect>
                </v-flex>
              </v-layout>
            </div>
          </div>

          <h5 class="pl-2 mb-5">{{ $t("location_details") }}</h5>
          <div class="row">
            <div class="col-md-9 mb-4">
              <v-layout>
                <v-flex xs12 md12 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-autocomplete v-on="on" v-bind:label="$t('location')" :items="site" index="id" item-value="id"
                        class="required_field" item-text="unique_location" v-model="organisation.site_id"
                        :rules="multiplerules" outlined dense multiple required chips small-chips
                        prepend-inner-icon="mdi-map-marker-multiple">
                        <template v-slot:selection="{ item }">
                          <v-chip outlined class="py-2" color="primary" small>
                            <span>{{ item.unique_location }}</span>
                          </v-chip>
                        </template>
                      </v-autocomplete>
                    </template>
                    <span>{{ $t("location") }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
            </div>
          </div>

        </v-form>
      </div>
      <div class="d-block text-right mr-4">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block mr-2">
              <v-btn v-on="on" small @click="$router.go(-1)" class="ma-1 font-weight-bold cancel-btn"
                color="dark cancel_button">{{ $t("cancel") }}</v-btn>
            </div>
          </template>
          <span>{{ $t("cancel") }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block">
              <v-btn :disabled="isDisabled" color="green darken-1" @click="saveOrg" small
                class="mr-2 success hover_shine">
                {{ $t("save") }}
                <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
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
import DatePicker from "../Components/DatePicker.vue";
import VueElementLoading from "vue-element-loading";
import MediaSelect from "../Components/Upload/MediaSelect.vue";
import CreateLookup from "../../../Pages/CreateLookup.vue";
export default {
  components: {
    VueElementLoading,
    MediaSelect,
    DatePicker,
    CreateLookup
  },
  data: () => ({
    valid: true,
    loader: false,
    file: "",
    isBtnLoading: false,
    isDisabled: false,
    working_days_array: [],
    establish_type: [],
    gratuity_act: [],
    reporting_based_on_array: [],
    leave_calculation_year: "",
    organisation: {
      id: 0,
      shortname: "",
      site_id: [],
      working_days: [],
      selected_location: [],
      status: 1,
      logo: '',
      website: '',
      establishment_type: '',
      cov_under_graduity: '',
      esic_reg_no: '',
      epfo_reg_no: '',
      pt_reg_no: '',
      pan_no: '',
      tan_no: '',
      established_date: ''
    },
    site: []
  }),

  computed: {
    fieldRules() {
      return [v => !!v || this.$t("field_required")];
    },
    websiteRules() {
      return [
        (v) => (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)?$/.test(v) || v.length == 0) || this.$t("url_valid"),
        v => !!v || this.$t("url_valid")
      ];
    },
    multiplerules() {
      return [v => (v.length > 0 && !!v) || this.$t("field_required")];
    }
  },

  mounted() {
    this.fetchsite();
    this.fetchlookup();
  },

  created() { },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
              "fetchorgbyslug?slug=" +
              this.$route.query.slug
            )
            .then(res => {
              this.btnloading = false;
              this.loader = false;
              if (res.data.status == "S") {
                this.message = res.data.message;
                this.organisation = res.data.fndOrg;
                this.organisation.working_days = JSON.parse(this.organisation.working_days);

                this.organisation.site_id =
                  res.data.fndOrg.fnd_org_site.fnd_site.id;

              } else if (res.data.status == "E") {
                this.message = res.data.message;
              }
            })
            .catch(err => {
              this.isDisabled = false;
              console.log("this error" + err);
            });
        }
      }
    }
  },

  methods: {
    lookupMessage(lookup_data) {
      if (lookup_data.status == 'S') {
        this.flashMessage.success({
          message: lookup_data.message,
          time: 4000,
          blockClass: "custom-block-class",
        });
        this.fetchlookup();
      }
      else {
        this.flashMessage.error({
          message: lookup_data.message,
          time: 4000,
          blockClass: "custom-block-class",
        });
      }
    },
    formatted_from_date(formatted_date) {
      this.organisation.established_date = formatted_date;
    },
    // NumbersOnly(evt) {
    //   evt = evt ? evt : window.event;
    //   var charCode = evt.which ? evt.which : evt.keyCode;
    //   if (
    //     charCode > 31 &&
    //     (charCode < 48 || charCode > 57) &&
    //     charCode !== 46
    //   ) {
    //     evt.preventDefault();
    //   } else {
    //     return true;
    //   }
    // },
    uppercasetan() {
      if (this.organisation.tan_no != "") {
        this.organisation.tan_no = this.organisation.tan_no.toUpperCase();
      }
    },
    uppercasepan() {
      if (this.organisation.pan_no != "") {
        this.organisation.pan_no = this.organisation.pan_no.toUpperCase();
      }
    },
    uppercasept() {
      if (this.organisation.pt_reg_no != "") {
        this.organisation.pt_reg_no = this.organisation.pt_reg_no.toUpperCase();
      }
    },
    uppercaseepfo() {
      if (this.organisation.epfo_reg_no != "") {
        this.organisation.epfo_reg_no = this.organisation.epfo_reg_no.toUpperCase();
      }
    },
    uppercasereg() {
      if (this.organisation.esic_reg_no != "") {
        this.organisation.esic_reg_no = this.organisation.esic_reg_no.toUpperCase();
      }
    },
    fetchlookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "WEEKDAYS",
          },
        })
        .then((response) => {
          this.working_days_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "SERIALISED_ITEM",
          },
        })
        .then((response) => {
          this.gratuity_act = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "ESTABLISHMENT_TYPE",
          },
        })
        .then((response) => {
          this.establish_type = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "REPORTING_BASED_ON"
          }
        })
        .then(response => {
          this.reporting_based_on_array = response.data.lookup_details;
        })
        .catch(err => {
          console.log(err);
        });
    },




    selectLocations(location_id) {
      this.organisation.selected_location.push(location_id);
    },

    // selectLocations(location_id) {
    //   alert("length", this.selected_location.length);
    //   for (var i = 0; i < this.selected_location.length; i++) {
    //     alert("hi");
    //     if (this.organisation.selected_location != location_id) {
    //       this.organisation.selected_location.push(location_id);
    //     } else {
    //       this.flashMessage.error({
    //         message: this.$t("something_went_wrong"),
    //         time: 4000,
    //         blockClass: "custom-block-class",
    //       });
    //     }
    //   }
    // },

    deleteAddedLocation(index) {
      this.organisation.selected_location.splice(index, 1);
      this.organisation.site_id.splice(index, 1);
    },

    saveOrg() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "createorganisation",
            this.organisation
          )
          .then(res => {
            if (Array.isArray(res.data.message)) {
              this.array_data = res.data.message.toString();
            } else {
              this.array_data = res.data.message;
            }
            if (res.data.status == "S") {
              this.flashMessage.success({
                message: this.array_data,
                time: 4000,
                blockClass: "custom-block-class"
              });
              this.message = res.data.message;
              this.$router.push({
                name: "organisation"
              });
            } else if (res.data.status == "E") {
              this.isBtnLoading = false;
              (this.isDisabled = false),
                this.flashMessage.error({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class"
                });
            } else {
              this.isBtnLoading = false;
              this.flashMessage.error({
                message: this.array_data
              });
            }
          })
          .catch(err => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class"
            });
            this.isBtnLoading = false;
            this.isDisabled = false;
            console.log("this error" + err);
          });
      }
    },

    addLocation() {
      this.organisation.site_id.push({
        selected_location: ""
      });
    },

    clear() {
      this.$refs.form.reset();
    },

    updateImage(imagedata) {
      this.organisation.logo = imagedata;
    },

    fetchsite() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getactivesite")
        .then(res => {
          this.site = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
