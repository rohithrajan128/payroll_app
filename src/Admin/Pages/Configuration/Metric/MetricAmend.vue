<template>
  <div class="container-fluid mt-3 p-0">
    <div class>
      <div class="card-header">
        <div class="card-header-tab card-header">
          <div
            class="card-header-title font-size-lg text-capitalize titlewrap"
          >{{ $t("create_metric") }}</div>
        </div>
      </div>
      <div class="card-body">
        <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
        <v-form ref="form" v-model="valid">
          <v-layout>
            <v-flex xs12 md6 pl-2 >
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    dense
                    v-on="on"
                    v-model="metric.short_name"
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
            <v-flex xs12 md6 pl-4>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    dense
                    v-on="on"
                    v-model="metric.long_name"
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
          </v-layout>
        </v-form>
        <div class="d-block text-right mr-2">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div v-on="on" class="d-inline-block mr-2">
                <v-btn
                  v-on="on"
                  small
                  @click="$router.go(-1)"
                  class="ma-1 font-weight-bold cancel-btn"
                  color="dark cancel_button"
                >{{ $t("cancel") }}</v-btn>
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
                  <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
                </v-btn>
              </div>
            </template>
            <span>{{ $t("submit") }}</span>
          </v-tooltip>
        </div>
      </div>
    </div>
    <v-sheet v-if="showmetricvalue">
      <div class="card-header pl-11">
        <div
          class="card-header-title font-size-lg text-capitalize titlewrap"
        >{{ $t("create_metric_value") }}</div>
        <v-spacer></v-spacer>
        <!-- <v-btn
          small
          class="btn mr-2 mb-2 hover_shine add_new mr-6"
          @click="addmetricvalue"
        >{{ $t("add") }}</v-btn> -->
      </div>
      <!-- <v-layout>
    <div class="metricouter">
        <div class="metriccheckbox">
            <v-checkbox></v-checkbox>
        </div>
        <div class="metricheader">
          {{ $t("metric_value") }}
        </div>
    </div>
      </v-layout>-->
      <v-form v-model="valid1" ref="form1">

        <v-layout v-for="(metric_val, metric_index) in metric_value_array" class="mb-4 align-items-center" :key="metric_index">
          <div class="metricouter" v-if="metric_value_array != null">
            <div class="metriccheckbox">
              <v-checkbox
                multiple
                v-model="metricCheckboxId"
                :value="metric_val.id"
                v-if="metric_val.id != 0"
              ></v-checkbox>
              <v-checkbox v-else multiple v-model="metricCheckboxIndex" :value="metric_index"></v-checkbox>
            </div>
            <div class="metricbody">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="metric_val.metric_value"
                    :rules="fieldRules"
                    dense
                    v-bind:label="$t('metric_value')"
                    outlined
                  ></v-text-field>
                </template>
                <span>{{ $t("metric_value") }}</span>
              </v-tooltip>
            </div>
          </div>
          <v-tooltip
                      bottom
                      v-if="metric_index == metric_value_array.length - 1"
                    >
                      <template v-slot:activator="{ on }">
                        <button
                          v-on="on"
                          x-small
                          rounded
                          class="btn btn-primary rounded-circle add_btn primary p-1 mt-5"
                            type="button"
                          
                        >
                          <v-icon
                            class="text-white"
                            small
                            @click="addmetricvalue"
                            >mdi-plus</v-icon
                          >
                        </button>
                      </template>
                      <span>{{ $t("add") }}</span>
                    </v-tooltip>

        </v-layout>
      </v-form>
      <v-btn
        v-if="(metricCheckboxId.length != 0 || metricCheckboxIndex.length != 0)"
        small
        color="red"
        class="m-4 text-white"
        @click="deleteItem"
      >{{ $t('delete') }}</v-btn>
      <div class="d-block text-right card-footer" v-if="metric_value_array.length != 0">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block">
              <v-btn
                :disabled="isDisabled1"
                color="green darken-1"
                @click="submitmetricvalues"
                small
                class="mr-2 success hover_shine"
              >
                {{ $t("submit") }}
                <b-spinner :disabled="isBtnLoading1" small v-if="isBtnLoading1"></b-spinner>
              </v-btn>
            </div>
          </template>
          <span>{{ $t("submit") }}</span>
        </v-tooltip>
      </div>
    </v-sheet>
    <ConfirmDialog
      :show="dialogDelete"
      :cancel="closeDelete"
      :confirm="deleteItemConfirm"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('want_to_delete')"
    />
  </div>
</template>
  
<script>
import VueElementLoading from "vue-element-loading";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
export default {
  components: {
    VueElementLoading,
    ConfirmDialog
  },
  data: () => ({
    valid: true,
    valid1: true,
    loader: false,
    isBtnLoading: false,
    isDisabled: false,
    isBtnLoading1: false,
    isDisabled1: false,
    metric: {
      id: 0,
      short_name: "",
      long_name: ""
    },
    showmetricvalue: false,
    metric_value: {
      id: "0",
      metric_value: "",
      parent_id: ""
    },
    metric_value_array: [],
    parent_id: "",
    metricCheckboxId: [],
    metricCheckboxIndex: [],
    dialogDelete: false
  }),

  computed: {
    fieldRules() {
      return [v => !!v || this.$t("field_required")];
    },

    numberRules() {
      return [v => !!v || this.$t("number_required")];
    }
  },

  created() {},
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.fetchMetricbyslug();
          this.fetchMetricvaluesByparentId();
        }
      }
    },
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        axios
          .post(process.env.VUE_APP_API_URL_ADMIN + "createmetric", this.metric)
          .then(res => {
            this.btnloading = false;
            if (res.data.status == "S") {
              this.flashMessage.success({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class"
              });

              this.showmetricvalue = true;
              this.isBtnLoading = false;
              this.isDisabled = false;
              this.parent_id = res.data.id;
              this.metric.id=res.data.id;
              if(this.metric_value_array.length==0){
                this.addmetricvalue();
              }

            }else if(res.data.status =='E') {
              this.flashMessage.error({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class"
              });
              this.isBtnLoading = false;
              this.isDisabled = false;
            }
            
            else {
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class"
              });
              this.isBtnLoading = false;
              this.isDisabled = false;
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
            console.log("error", err);
          });
      }
    },

    fetchMetricbyslug() {
      this.loader = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "getmetricbyslug/" +
            this.$route.query.slug
        )
        .then(res => {
          if (res.data.status == "S") {
            this.metric = res.data.data;
            this.loader = false;
            this.showmetricvalue = true;
            this.parent_id = this.metric.id;
          } else {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class"
            });
            this.loader = false;
          }
        })
        .catch(err => {
          this.loader = false;
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          console.log("error", err);
        });
    },
    addmetricvalue() {
      this.metric_value = {};
      this.metric_value.id = "0";
      this.metric_value.parent_id = this.parent_id;
      this.metric_value_array.push(this.metric_value);
    },
    submitmetricvalues() {
      if (this.$refs.form1.validate()) {
        this.isDisabled1 = true;
        this.isBtnLoading1 = true;
        axios
          .post(process.env.VUE_APP_API_URL_ADMIN + "createmetricvalues", {
            metric_values: this.metric_value_array
          })
          .then(res => {
            if (res.data.status == "S") {
              this.flashMessage.success({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class"
              });
              this.isBtnLoading1 = false;
              this.isDisabled1 = false;
              this.message = res.data.message;
              this.$router.push({
                name: "metric"
              });
            } else {
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class"
              });
              this.isBtnLoading = false;
              this.isDisabled = false;
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
            console.log("error", err);
          });
      }
    },

    fetchMetricvaluesByparentId() {
      this.loader = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "getmetricvaluesbyid/" +
            this.$route.query.slug
        )
        .then(res => {
          if (res.data.status == "S") {
            this.metric_value_array = res.data.data;
            if(this.metric_value_array.length==0){
              this.addmetricvalue();
            }
            this.loader = false;
          } else {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class"
            });
            this.loader = false;
          }
        })
        .catch(err => {
          this.loader = false;
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          console.log("error", err);
        });
    },
    closeDelete() {
      this.dialogDelete = false;
    },
    deleteItem() {
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.dialogDelete = false;
      if (this.metricCheckboxIndex.length != "0") {
        this.metricCheckboxIndex.sort(function(a, b) {
          return a - b;
        });
        var flag_for_metric = 0;
        for (var j = 0; j < this.metricCheckboxIndex.length; j++) {
          var z = j - flag_for_metric;
          this.metric_value_array.splice(this.metricCheckboxIndex[z], 1);
          flag_for_metric++;
        }
       if(this.metric_value_array.length==0){
this.addmetricvalue()
       }
        this.metricCheckboxIndex = [];
      }
      if (this.metricCheckboxId.length != "0") {
        this.loader = true;
        axios
          .post(process.env.VUE_APP_API_URL_ADMIN + "deletemetricvalues/", {
            delete_ids: this.metricCheckboxId
          })
          .then(res => {
            if (res.data.status == "S") {
              this.metricCheckboxId = [];
              this.fetchMetricbyslug();
              this.fetchMetricvaluesByparentId();
              this.loader = false;
              this.flashMessage.success({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class"
              });
            }
          })
          .catch(err => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class"
            });
            console.log(" error" + err);
          });
      }
    }
  }
};
</script>
  
<style scoped>
.metricouter {
  display: inline-flex;
  align-items: center;
  align-self: center;
  margin: 0px 0px -25px 5px;
  width: 40%;
  /* border: solid rgb(167, 159, 159) 1pt; */
}

.metricbody {
  align-self: center;
  padding: 22px 20px 0px 20px;
  width: 100%;
}

.metriccheckbox {
  padding: 0px 0px 0px 20px;
}.add_btn{
  height: max-content;
}
</style>