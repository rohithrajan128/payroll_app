<template>
    <div class="container-fluid mt-3 p-0">
    <div class="card-hover-shadow mb-3 mx-auto">
      <div class="card-header">
        <div class="card-header-tab ">
          <div
            class="
              card-header-title
              font-size-lg
              text-capitalize
              titlewrap
            "
          >
            {{ $t("create_category") }}
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
          <h5 class="pl-2 mb-5">{{ $t("category_details") }}</h5>
          <div class="row">
            <div class="col-md-12 mb-4">
              <v-layout>
                <v-flex xs12 md6 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-on="on"
                        v-model="categories.category_name"
                        :rules="fieldRules"
                        v-bind:label="$t('category_name')"
                        required
                        class="required_field"
                        outlined
                        dense
                      ></v-text-field>
                    </template>
                    <span>{{ $t("category_name") }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex xs12 md12 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-textarea
                        v-on="on"
                        v-model="categories.description"
                        :rules="fieldRules"
                        v-bind:label="$t('description')"
                        required
                        class="required_field"
                        outlined
                        counter="600" rows="2" 
                        dense
                      ></v-textarea>
                       
                    </template>
                    <span>{{ $t("description") }}</span>
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
                @click="saveCategory"
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
      category_name: "",
      description: "",
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
                "getcategorybyslug?slug=" +
                this.$route.query.slug
            )
            .then((res) => {
              this.btnloading = false;
              this.loader = false;
              if (res.data.status == "S") {
                this.message = res.data.message;              
                this.categories = res.data.category;
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
    saveCategory() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "createcategory",
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
              this.$router.push(
                {
                name:'categories'
                }
              )
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
      this.$refs.form.reset();
    },
  },
};
</script>
  