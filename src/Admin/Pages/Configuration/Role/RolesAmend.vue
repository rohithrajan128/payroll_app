<template>
  <div class="container-fluid mt-3 p-0">
    <!-- <div class="card-hover-shadow mb-3 card-border card mx-auto"> -->
    <div class="mb-3 mx-auto">
      <div class="card-header">
        <div class="card-header-tab">
          <div class="
              card-header-title
              font-size-lg
              text-capitalize
              titlewrap   
            ">
            <!-- class=page-title-color -->
            {{ $t("create_ammend_roles") }}
          </div>
        </div>
      </div>
      <div class="card-body">
        <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
        <v-form ref="form" v-model="valid">
          <v-layout>
            <v-flex xs12 md6>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field v-on="on" v-model="fieldItem.rolename" :rules="nameRules" v-bind:label="$t('name')"
                    outlined dense class="required_field" required></v-text-field>
                </template>
                <span>{{ $t("name") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md6>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field v-on="on" v-model="fieldItem.roledescription" :rules="descriptionRules"
                    v-bind:label="$t('description')" outlined dense class="required_field" required></v-text-field>
                </template>
                <span>{{ $t("description") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </v-form>
      </div>
      <div class="d-block text-right pr-4">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block mr-2">
              <v-btn v-on="on" small @click="$router.go(-1)" :disabled="loading" class="ma-1 font-weight-bold cancel-btn"
                color="dark cancel_button">{{ $t("cancel") }}</v-btn>
            </div>
          </template>
          <span>{{ $t("cancel") }}</span>
        </v-tooltip>
        <!-- <v-btn @click="clear" class="mr-2 btn btn-link btn-sm">clear</v-btn> -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block">
              <v-btn :disabled="isDisabled" @click="submit" small class="mr-2 success hover_shine" color="green darken-1">
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
    successmessage: "",
    message: "",
    valid_error: false,
    file: "",
    loading: false,
    isBtnLoading: false,
    isDisabled: false,
    loader: false,
    fieldItem: {
      id: 0,
    },
  }),

  computed: {
    nameRules() {
      return [(v) => !!v || this.$t("name_required")];
    },

    descriptionRules() {
      return [(v) => !!v || this.$t("description_required")];
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
              "roles/" +
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
                this.fieldItem = res.data.role;
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
    submit() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        // Form is valid, process
        if (this.fieldItem.id == 0) {
          axios
            .post(process.env.VUE_APP_API_URL_ADMIN + "roles", this.fieldItem)
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
                  name: "roles",
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
              this.isBtnLoading = false;
              this.isDisabled = false;
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
              console.log("error", err);
            });
          console.log(err);
        } else {
          axios
            .patch(
              process.env.VUE_APP_API_URL_ADMIN + "roles/" + this.fieldItem.id,
              this.fieldItem
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
                this.$router.push({
                  name: "roles",
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
<style scoped></style>
