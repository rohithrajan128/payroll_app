<template>
  <div class="container-fluid mt-3 p-0">
    <div class="mb-3 mx-auto">
      <div class="card-header">
        <div class="p-0 card-header">
          <div class="card-header-title font-size-lg text-capitalize titlewrap">
            {{ $t("create_lookup") }}
          </div>
        </div>
      </div>
      <div class="card-body mt-5">
        <VueElementLoading
          :active="loader"
          spinner="bar-fade-scale"
          color="var(--primary)"
        />
        <v-form ref="form" v-model="valid">
          <v-layout>
            <v-flex xs12 md4>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    dense
                    v-on="on"
                    v-model="lookupItem.shortname"
                    :rules="fieldRules"
                    v-bind:label="$t('shortname')"
                    required
                    class="required_field"
                    outlined
                  ></v-text-field>
                </template>
                <span>{{ $t("shortname") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md4>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    dense
                    v-on="on"
                    v-model="lookupItem.longname"
                    :rules="fieldRules"
                    v-bind:label="$t('longname')"
                    required
                    class="required_field"
                    outlined
                  ></v-text-field>
                </template>
                <span>{{ $t("longname") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md4>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    dense
                    v-on="on"
                    v-model="lookupItem.seq"
                    type="number"
                    :rules="numberRules"
                    v-bind:label="$t('sequence')"
                    required
                    class="required_field"
                    outlined
                  ></v-text-field>
                </template>
                <span>{{ $t("sequence") }}</span>
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
                @click="submit"
                small
                class="mr-2 success hover_shine"
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
    lookupItem: {
      id: 0,
      shortname: "",
      longname: "",
      seq: "",
      f1: "",
      icon: "",
      parentid: 0,
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
                "lookups/" +
                this.$route.query.slug +
                "/edit"
            )
            .then((res) => {
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "S") {
                this.lookupItem = res.data.lookup;
                this.loader = false;
              } else if (res.data.status == "E") {
                this.flashMessage.error({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class",
                });
                this.loader = false;
              } else {
                console.log("error message", array_data);
              }
            })
            .catch((err) => {
              this.loader = false;
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
              console.log("error", err);
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
        // Form is valid, process
        if (this.lookupItem.id == 0) {
          axios
            .post(
              process.env.VUE_APP_API_URL_ADMIN + "lookups",
              this.lookupItem
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
                  name: "lookups",
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
              this.isDisabled = false;
              console.log("error", err);
            });
        } else {
          axios
            .patch(
              process.env.VUE_APP_API_URL_ADMIN +
                "lookups/" +
                this.lookupItem.id,
              this.lookupItem
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
                  name: "lookups",
                });
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
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.isBtnLoading = false;
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
