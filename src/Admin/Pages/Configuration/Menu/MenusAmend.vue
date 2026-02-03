<template>
  <div class="container-fluid mt-3 p-0">
    <!-- <v-alert :value="valid_error" color="error" icon="warning" outlined>{{
      message
    }}</v-alert>-->
    <div class="">
      <div class=" p-0">
        <div class="card-header-tab card-header">
          <div class="
              card-header-title
              font-size-lg
              text-capitalize
              titlewrap
            ">
            {{ $t("create_menu") }}
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
                  <span v-on="on">
                    <!-- ------------{{items.parentsmenu}} -->
                    <!-- {{fieldItem}} -->
                    <v-autocomplete :items="items.parentmenu" v-bind:label="$t('parent')" index="id" item-value="id"
                      item-text="title" dense v-model="fieldItem.parent_id" class="pr-2" outlined>
                      <template slot="selection" slot-scope="data">
                        {{ data.item.title }} ({{ data.item.parent_name }})
                      </template>
                      <template slot="item" slot-scope="data">
                        {{ data.item.title }} ({{ data.item.parent_name }})
                      </template>
                    </v-autocomplete>
                  </span>
                </template>
                <span>{{ $t("parent") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md6>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field v-on="on" v-model="fieldItem.title" :rules="fieldRules" dense v-bind:label="$t('title')"
                    required class="required_field" outlined></v-text-field>
                </template>
                <span>{{ $t("title") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>

          <v-layout>
            <v-flex xs12 md6>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field v-on="on" v-model="fieldItem.href" :rules="fieldRules" v-bind:label="$t('link')" required
                    dense class="required_field" outlined></v-text-field>
                </template>
                <span>{{ $t("link") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md4>
              <v-tooltip v-bind:disabled="disabled" bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field v-on="on" dense v-model="fieldItem.icon" v-bind:label="$t('style')" required outlined
                    class="pr-2"></v-text-field>
                </template>
                <span>{{ $t("style") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field type="number" v-on="on" dense v-model="fieldItem.seq" :rules="numberRules"
                    v-bind:label="$t('sequence')" required class="required_field" outlined></v-text-field>
                </template>
                <span>{{ $t("sequence") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </v-form>
      </div>
      <!-- card-footer -->
      <div class="d-block mr-4 text-right ">
        <!-- <button class="mr-2 btn btn-link btn-sm">Cancel</button>
        <button class="btn-shadow-primary btn btn-primary btn-lg">Submit</button>-->
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
              <v-btn :disabled="isDisabled" @click="submit" small class="mr-2 success hover_shine">
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
    valid_error: false,
    message: "",
    loader: false,
    isBtnLoading: false,
    disabled: false,
    loading: false,
    isDisabled: false,
    fieldItem: {
      id: 0,
      title: "",
      href: "",
      parent_id: 0,
      seq: "",
      icon: "",
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

  created() {
    axios
      .get(process.env.VUE_APP_API_URL_ADMIN + "parentmenus")
      .then((res) => {
        //commit('FETCH_appointments', res.data)
        this.items = res.data;
      })
      .catch((err) => {
        this.flashMessage.error({
          message: this.$t("something_went_wrong"),
          time: 4000,
          blockClass: "custom-block-class",
        });
        console.log("error", err);
      });
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
              "menu/" +
              this.$route.query.slug +
              "/edit"
            )
            .then((res) => {
              this.loader = false;
              this.fieldItem = res.data.menu;
            })
            .catch((err) => {
              this.loader = false;
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.loader = false;
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
        if (this.fieldItem.id == 0) {
          axios
            .post(process.env.VUE_APP_API_URL_ADMIN + "menu", this.fieldItem)
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
                  name: "menus",
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
                this.isDisabled = false;
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
              this.isDisabled = false;
              console.log("error", err);
            });
        } else {
          axios
            .patch(
              process.env.VUE_APP_API_URL_ADMIN + "menu/" + this.fieldItem.id,
              this.fieldItem
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
                this.$router.push({
                  name: "menus",
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
                  time: 4000,
                  blockClass: "custom-block-class",
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
      }
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>
