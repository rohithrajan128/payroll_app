<template>
  <div class="container-fluid mt-3 p-0">
    <div class=" mb-3 mx-auto">
      <div class="card-header">
        <div class="card-header-tab">
          <div class="
              card-header-title
              font-size-lg
              text-capitalize
              titlewrap
            ">
            {{ $t("create_country") }}
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
                  <v-text-field v-on="on" dense v-model="fieldItem.name" :rules="fieldRules"
                    v-bind:label="$t('country_name')" required class="required_field" outlined></v-text-field>
                </template>
                <span>{{ $t("country_name") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
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
    fieldItem: {
      id: 0,
      name: "",
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
              "edit_countries/" +
              this.$route.query.slug
            )
            .then((res) => {
              this.fieldItem = res.data.countries;
              this.loader = false;
            });
        }
      },
    },
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;

        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "save_countries",
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
                name: "countries",
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
            console.log(err);
          });
      } else {
        console.log("Form is Invalid")
      }
    },
  },
};
</script>
