<template>
  <div class="container-fluid mt-3 p-0">
    <div class="mb-3  mx-auto">
      <div class="card-header">
        <div class="card-header-tab">
          <div class="
              card-header-title
              font-size-lg
              text-capitalize
              titlewrap
            ">
            {{ $t("create_suburb") }}
          </div>
        </div>
      </div>
      <div class="card-body">
        <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
        <v-form ref="form" v-model="valid">
          <v-layout>
            <v-flex xs12 md4>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span v-on="on">
                    <v-text-field v-on="on" v-model="parent_name" v-bind:label="$t('state_name')" required dense
                      :disabled="true" class="required_field" outlined></v-text-field>
                  </span>
                </template>
                <span>{{ $t("state_name") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md4>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field v-on="on" dense v-model="fieldItem.name" :rules="fieldRules" v-bind:label="$t('suburb')"
                    required class="required_field" outlined></v-text-field>
                </template>
                <span>{{ $t("suburb") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </v-form>
      </div>
      <div class="d-block text-right mr-4">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block mr-2">
              <v-btn v-on="on" class="ma-1 font-weight-bold cancel-btn" color="dark cancel_button" small
                @click="cancel()">
                {{ $t("cancel") }}
              </v-btn>
            </div>
          </template>
          <span>{{ $t("cancel") }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block">
              <v-btn :disabled="isDisabled" color="green darken-1" @click="submit" small class="mr-2 success hover_shine">
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

import VueElementLoading from "vue-element-loading";

export default {
  components: {
    VueElementLoading,
  },
  data: () => ({
    valid: true,
    loader: false,
    file: "",
    isBtnLoading: false,
    isDisabled: false,
    country_name: "",
    country_id: null,
    states: [],
    parent_name: "",
    statename: "",
    fieldItem: {
      id: 0,
      name: "",
      state_id: "",
      country_id: "",
    },
    items: [],
  }),

  computed: {

    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    numberRules() {
      return [(v) => !!v || this.$t("number_required")];
    },
  },
  mounted() { },
  created() { },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          this.parent_name = this.$route.query.parentname;
          this.statename = this.$route.query.statename;
          axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
              "edit_cities/" +
              this.$route.query.slug
            )
            .then((res) => {
              this.fieldItem = res.data.cities;
              this.state_id = res.data.state_id;
              this.fieldItem.state_id = res.data.state_id;
              this.fieldItem.country_id = res.data.country_id;
              this.loader = false;
              this.fetchStates();
            });
        }
      },
    },
    "$route.params.state_id": {
      immediate: true,
      handler() {
        if (this.$route.params.state_id) {
          this.state_id = this.$route.params.state_id;
          this.fieldItem.state_id = this.$route.params.state_id;
          this.fieldItem.country_id = this.$route.params.country_id;
          this.country_id = this.$route.params.country_id;
          this.parent_name = this.$route.params.parentname;
          this.statename = this.$route.params.statename;
          this.fetchStates();
        }
      },
    },
  },
  methods: {
    fetchStates() {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
          "fetch_edit_states/" +
          this.fieldItem.state_id
        )
        .then((response) => {
          if (response.data.status == "S") {
            this.states = response.data.states;
            this.parent_name = response.data.states.name;
            this.fieldItem.state_id = response.data.states.id;
            this.initval = false;
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          this.initval = false;
        });
    },

    submit() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "save_cities",
            this.fieldItem
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
              this.$router.push({
                name: "cities",
                params: {
                  id: this.state_id,
                  country_id: this.country_id,
                  parentname: this.parent_name,
                },
              });
            } else if (res.data.status == "E") {
              this.flashMessage.error({
                message: this.array_data,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.isBtnLoading = false;
              this.isDisabled = false;
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
          });
      } else {
         this.isBtnLoading = false;
          this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
      }
    },
    cancel() {
      this.$router.push({
        name: "cities",
        params: {
          id: this.state_id,
          country_id: this.country_id,
          parentname: this.parent_name,
          statename: this.statename,
        },
      });
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>
