<template>
  <div class="container-fluid mt-3 p-0">
    <div class="mb-3 mx-auto">
      <div class="card-header">
        <div class="card-header-tab card-header">
          <div class="card-header-title font-size-lg text-capitalize titlewrap">
            {{ $t("create_asset_categories") }}
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
          <v-layout
            v-for="(categories, index) in categories_array"
            :key="index"
            wrap
          >
            <v-flex xs6 md3 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    dense
                    v-on="on"
                    v-model="categories.parent_id"
                    v-bind:label="$t('parent')"
                    required
                    @change="
                      FetchTAgIdforChild(
                        categories.parent_id,
                        parentShortnames,
                        index
                      )
                    "
                    :items="parentShortnames"
                    item-text="short_name"
                    item-value="id"
                    outlined
                  ></v-autocomplete>
                </template>
                <span>{{ $t("parent") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs6 md3 pl-2 class="createlookupflex">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    @change="
                      AssetTypecheCk(
                        categories.asset_type,
                        categoriesAssetTypes
                      )
                    "
                    dense
                    v-on="on"
                    v-model="categories.asset_type"
                    :rules="fieldRules"
                    v-bind:label="$t('asset_type')"
                    required
                    :items="categoriesAssetTypes"
                    item-text="shortname"
                    item-value="id"
                    class="required_field"
                    outlined
                    :disabled="categories.parent_id != 0"
                  ></v-autocomplete>
                </template>
                <span>{{ $t("asset_type") }}</span>
              </v-tooltip>
              <CreateLookup lookup_parent_name="ASSET_TYPE" @lookup_data="lookupMessage" :dropdownlabel="$t('asset_type')"></CreateLookup>
            </v-flex>
            <v-flex xs6 md3 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    dense
                    v-on="on"
                    v-model="categories.short_name"
                    :rules="fieldRules"
                    v-bind:label="$t('short_name')"
                    required
                    class="required_field"
                    outlined
                  ></v-text-field>
                </template>
                <span>{{ $t("short_name") }}</span>
              </v-tooltip>
            </v-flex>

            <v-flex
              xs6
              md2
              pl-2
              v-if="
                categories.asset_type &&
                categoriesAssetTypes.find(
                  (ele) => ele.id == categories.asset_type
                ).shortname == 'Asset'
              "
            >
              <!-- {{ categories.parent_id }} -->
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-if="parentShortnames"
                    class="required_field"
                    :rules="fieldRules"
                    :prefix="getPrefix(parentShortnames, categories.parent_id)"
                    dense
                    v-on="on"
                    v-model="categories.asset_tag_id"
                    v-bind:label="$t('asset_tag_id')"
                    required
                    outlined
                  ></v-text-field>
                </template>
                <span>{{ $t("asset_tag_id") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex v-if="categories.parent_id > 0" xs12 md3 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    dense
                    v-on="on"
                    v-model="categories.alert_value"
                    v-bind:label="$t('alert_value')"
                    v-on:keypress="NumbersOnly"
                    required
                    outlined
                  ></v-text-field>
                </template>
                <span>{{ $t("alert_value") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex v-if="categories.parent_id > 0" xs6 md3 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    dense
                    v-on="on"
                    v-model="categories.serialised_item"
                    v-bind:label="$t('serialised_item')"
                    :items="categoryserialisedItems"
                    item-text="shortname"
                    item-value="id"
                    required
                    outlined
                  ></v-autocomplete>
                </template>
                <span>{{ $t("serialised_item") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex v-if="categories.parent_id > 0" xs12 md3 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    dense
                    v-on="on"
                    v-model="categories.parent_metric"
                    v-bind:label="$t('metric')"
                    :items="parentMetricValues"
                    item-text="long_name"
                    item-value="id"
                    @change="
                      fetchchildMetricvalues(categories.parent_metric, index)
                    "
                    required
                    outlined
                  ></v-autocomplete>
                </template>
                <span>{{ $t("metric") }}</span>
              </v-tooltip>
            </v-flex>

            <v-flex v-if="categories && categories.parent_id > 0" xs12 md2 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    dense
                    v-on="on"
                    v-model="categories.child_metric"
                    v-bind:label="$t('metric_value')"
                    :items="childMetricValues[index]"
                    item-text="metric_value"
                    item-value="id"
                    required
                    outlined
                  ></v-autocomplete>
                </template>
                <span>{{ $t("metric_value") }}</span>
              </v-tooltip>
            </v-flex>

            <v-flex xs12 md1 pl-6>
              <v-tooltip v-if="categories_array.length > 1" bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    class="delete_btn icon_size mt-2 mr-3"
                    v-on="on"
                    @click="removelanguage(index)"
                    >mdi-trash-can-outline</v-icon
                  >
                </template>
                <span>{{ $t("remove") }}</span>
              </v-tooltip>
              <v-tooltip bottom v-show="index == categories_array.length - 1">
                <template v-slot:activator="{ on }">
                  <button
                    v-show="index == categories_array.length - 1"
                    v-on="on"
                    x-small
                    rounded
                    class="btn btn-primary rounded-circle primary mt-2 px-1 py-0"
                    @click="addmorecontact"
                    type="button"
                  >
                    <v-icon class="text-white" small>mdi-plus</v-icon>
                  </button>
                </template>
                <span>{{ $t("add") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md12>
              <v-divider class="mt-0"></v-divider>
            </v-flex>
          </v-layout>
        </v-form>

        <div class="d-block text-right mr-4">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div v-on="on" class="d-inline-block mr-2">
                <v-btn
                  v-on="on"
                  small
                  class="ma-1 font-weight-bold cancel-btn"
                  color="secondary"
                  @click="$router.go(-1)"
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
  </div>
</template>

<script>
import CreateLookup from "../../../Pages/CreateLookup.vue";
import VueElementLoading from "vue-element-loading";
export default {
  components: {
    VueElementLoading,
    CreateLookup
  },
  data: () => ({
    valid: true,
    loader: false,
    isBtnLoading: false,
    isDisabled: false,
    whenassetselect: false,
    categories_array: [
      {
        id: 0,
        short_name: "",
        asset_type: "",
        asset_tag_id: "",
        serialised_item: "",
        parent_id: 0,
        alert_value: "",
        parent_metric: "",
        child_metric: "",
      },
    ],

    categories: {
      id: 0,
      short_name: "",
      asset_type: "",
      asset_tag_id: "",
      serialised_item: "",
      parent_id: 0,
      alert_value: "",
      parent_metric: "",
      child_metric: "",
    },
    iFselectChild: false,
    categoryserialisedItems: [],
    parentShortnames: [
      {
        id: 0,
        short_name: "None",
      },
    ],
    categoriesAssetTypes: [],
    parentMetricValues: [],
    childMetricValues: [],
    tagIDwhenEdit: "",
    assetTypeID: "",
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },
  mounted() {
    this.fetchlookup();
    this.fetchParentnames();
    this.fetchparentMetricvalues();
    // this.addmorecontact();
  },
  created() {},
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.fetchCategoriesbyslug();
        }
      },
    },
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
    getPrefix(parentShortnames, category) {
      if (category) {
        return (
          parentShortnames.find((ele) => ele.id == category).asset_tag_id + "/"
        );
      }
    },
    whenassetselect(category, category_array) {
      // category_array.find(
      //               (x) => x.id == category
      //             ).shortname
    },
    removelanguage(index) {
      this.categories_array.splice(index, 1);
    },
    addmorecontact() {
      this.categories_array.push(this.categories);
      this.categories = {
        id: 0,
        short_name: "",
        asset_type: "",
        asset_tag_id: "",
        serialised_item: "",
        parent_id: 0,
        alert_value: "",
        parent_metric: "",
        child_metric: "",
      };
    },
    // AssetTypecheCk(id, array) {
    //   this.categories.asset_tag_id = "";
    //   this.whenassetselect = false;
    //   array.map(assettype => {
    //     if (assettype.id == id) {
    //       if (assettype.shortname == "Asset") {
    //         this.whenassetselect = true;
    //       } else {
    //         this.whenassetselect = false;
    //       }
    //     }
    //   });
    // },
    fetchlookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "ASSET_TYPE",
          },
        })
        .then((response) => {
          this.categoriesAssetTypes = response.data.lookup_details;
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
          this.categoryserialisedItems = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchParentnames() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getallassetcategories")
        .then((res) => {
          if (res.data.parent_names.length > 0) {
            this.parentShortnames.push(...res.data.parent_names);
          }
          this.initval = false;
        })
        .catch((err) => {
          this.initval = false;
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
        });
    },
    fetchparentMetricvalues() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getparentmetricvalues")
        .then((res) => {
          this.parentMetricValues = res.data.data;
          this.initval = false;
        })
        .catch((err) => {
          this.initval = false;
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
        });
    },

    fetchchildMetricvalues(id, index) {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getchildmetricvalues/" + id)
        .then((res) => {
          this.childMetricValues[index] = res.data.data;
        })
        .catch((err) => {
          this.initval = false;
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
        });
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.categoriesAssetTypes.map((assettype) => {
          if (assettype.id == this.categories.asset_type) {
            if (assettype.shortname == "Asset") {
              this.categories.asset_tag_id =
                this.tagIDwhenEdit + this.categories.asset_tag_id;
              this.tagIDwhenEdit = "";
            }
          }
        });

        // if (this.categories.parent_id != 0) {
        //   this.categories.asset_tag_id = this.tagIDwhenEdit + this.categories.asset_tag_id;
        //   this.tagIDwhenEdit = '';
        // }
        this.isDisabled = true;
        this.isBtnLoading = true;
        axios
          .post(process.env.VUE_APP_API_URL_ADMIN + "createassetcategories", {
            categories_array: this.categories_array,
          })
          .then((res) => {
            if (res.data.status == "S") {
              this.flashMessage.success({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.$router.push({
                name: "assetcategories",
              });
              this.isBtnLoading = false;
              this.isDisabled = false;
            } else {
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.isBtnLoading = false;
              this.isDisabled = false;
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
      }
    },

    fetchCategoriesbyslug() {
      this.loader = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "getcategoriesbyslug/" +
            this.$route.query.slug
        )
        .then((res) => {
          if (this.$route.query.assetType == "Asset") {
            this.whenassetselect = true;
          } else {
            this.whenassetselect = false;
          }
          if (res.data.status == "S") {
            setTimeout(() => {
              this.categories_array = [res.data.data];
              this.loader = false;
            }, 1000);

            // this.categories_array.map(ele,i=>{
            //   if(ele.parent_id!=0){
            //     this.categories_array[i]['iFselectChild']=true;
            //   }
            // })
            this.fetchParentnames();
            // if (this.categories.parent_id != 0) {
            //   this.iFselectChild = true;
            // }
            this.fetchchildMetricvalues(
              res.data.data.parent_metric,
              0,
              res.data.data
            );
          } else {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
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
    },
    addcategoriesvalue() {
      this.sub_categories = {};
      this.sub_categories.id = "0";
      this.sub_categories.parent_id = this.parent_id;
      this.sub_categories_array.push(this.sub_categories);
    },

    FetchTAgIdforChild(id, array, index) {
      if (id >= 1) {
        this.tagIDwhenEdit = "";
        this.whenassetselect = false;
        this.loader = true;
        axios
          .get(
            process.env.VUE_APP_API_URL_ADMIN +
              "fetchassetcategoriesparenttagid/" +
              id
          )
          .then((res) => {
            if (res.data.status == "S") {
              this.iFselectChild = true;
              array.map((parent) => {
                if (parent.id == id) {
                  this.assetTypeID = parent.asset_type;
                  this.categories_array[index].asset_type = parent.asset_type;
                }
              });
              this.categoriesAssetTypes.map((assetType) => {
                if (assetType.id == this.assetTypeID) {
                  if (assetType.shortname == "Asset") {
                    this.whenassetselect = true;
                    this.tagIDwhenEdit = res.data.tag_id + "/";
                  }
                }
              });
              this.loader = false;
            } else {
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
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
            console.log("error", err);
          });
      } else {
        // this.$refs.form.reset();
        this.categories.parent_id = 0;
        this.iFselectChild = false;
        this.whenassetselect = false;
        this.tagIDwhenEdit = "";
      }
    },
    NumbersOnly(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
  },
};
</script>

<style scoped>
.addlanguagebutton {
  padding: 0px !important;
}
</style>