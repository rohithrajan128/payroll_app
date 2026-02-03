<template>
   <v-layout>
            <v-flex xs12 md4 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    v-bind:label="$t('country')"
                    v-on="on"
                    index="id"
                    :rules="fieldRules"
                    class="required_field pr-2"
                    required
                    v-model="selected_country"
                    :items="countries"
                    item-text="name"
                    item-value="id"
                    outlined
                    dense
                    @change="fetch_states(selected_country)"
                  ></v-autocomplete>
                </template>
                <span>{{ $t("country") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md4 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    v-bind:label="$t('state')"
                    v-on="on"
                    :rules="fieldRules"
                    class="required_field pr-2"
                    required
                    index="id"
                    item-value="id"
                    item-text="name"
                    v-model="selected_state"
                    :items="states"
                    outlined
                    dense
                    @change="fetch_cities(selected_state)"
                  ></v-autocomplete>
                </template>
                <span>{{ $t("state") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md4 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    v-bind:label="$t('city')"
                    v-on="on"
                    index="id"
                    item-value="id"
                    item-text="name"
                    :rules="fieldRules"
                    class="required_field pr-2"
                    required
                    v-model="selected_city"
                    :items="cities"
                    outlined
                    dense
                    @change="emitCity(selected_city)"
                  ></v-autocomplete>
                </template>
                <span>{{ $t("city") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
</template>
<script>
export default {
    data: () => ({
    userRoles: [],
    items: [],
    countries: [],
    states: [],
    cities: [],
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
  }),
  props:['selected_country','selected_state','selected_city'],
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
    this.fetch_countries();
  },
  watch: {
    selected_state: {
      immediate: true,
      handler() {
        if (this.selected_country) {
        this.fetch_states(this.selected_country);
        
      }
    },
  },
  selected_city: {
      immediate: true,
      handler() {
        if (this.selected_state) {
        this.fetch_cities(this.selected_state)
      }
    },
  },
  },
  methods:{
    fetch_countries() {
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
      this.$emit('countries_change','country', name);
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
        this.$emit('countries_change','state', name);
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
    emitCity(name){
    this.$emit('countries_change','city', name);
    }
  }
}
</script>
