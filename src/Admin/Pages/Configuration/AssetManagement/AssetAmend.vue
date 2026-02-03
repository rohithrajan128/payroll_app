<template>
  <div class="container-fluid mt-3 p-0">
    <div class="main-card mb-3">
      <div>
        <div class="card-header-tab card-header">
          <div class="card-header-title font-size-lg text-capitalize titlewrap">
            {{ $t("create_categories") }}
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
          <v-layout wrap>
            <v-flex xs12 md3 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="categories.shortname"
                    :rules="fieldRules"
                    v-bind:label="$t('categories_short_name')"
                    required
                    class="required_field"
                    outlined
                    dense
                  ></v-text-field>
                </template>
                <span>{{ $t("categories_short_name") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md3 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="categories.longname"
                    :rules="fieldRules"
                    v-bind:label="$t('categories_long_name')"
                    required
                    class="required_field"
                    outlined
                    dense
                  ></v-text-field>
                </template>
                <span>{{ $t("categories_long_name") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md3 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="categories.icon_name"
                    v-bind:label="$t('categories_icon')"
                    required
                    outlined
                    dense
                  ></v-text-field>
                </template>
                <span>{{ $t("categories_icon") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md3 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-checkbox
                    v-on="on"
                    v-model="categories.is_default_cat_view"
                    v-bind:label="$t('visible_to_all_employee?')"
                    class="mt-2"
                  ></v-checkbox>
                </template>
                <span>{{ $t("categories_icon") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </v-form>
      </div>
      <div class="d-block text-right card-footer">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block mr-2">
              <v-btn
                v-on="on"
                small
                @click="$router.go(-1)"
                class="ma-1 font-weight-bold"
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
                @click="saveAsset"
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
export default {
  components: {
    VueElementLoading,
  },
  data: () => ({
    valid: true,
    loader: false,
    isBtnLoading: false,
    isDisabled: false,
    categories: {
      id:0,
      longname: "",
      shortname: "",
      icon_name: "",
      is_default_cat_view: 0,
      status: 1,
    },

    items: [],
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
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
                "fetch_category_by_slug?slug=" +
                this.$route.query.slug
            )
            .then((res) => {
              this.btnloading = false;
              this.loader = false;
              if (res.data.status == "S") {
                this.message = res.data.message;
                this.categories = res.data.category;
                this.categories.id=res.data.category.categories_id;
                if (this.$route.query.pathname) {
                  this.from_path = this.$route.query.pathname;
                }
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
    saveAsset() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "create_categories",
            this.categories
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
                name: "categories",
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
      this.categories = {
        longname: "",
        shortname: "",
        status: 1,
      };
    },
  },
};
</script>
  