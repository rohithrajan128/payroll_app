<template>
  <div class="container-fluid mt-3 p-0">
    <div class="main-card mb-3">
      <div>
        <div class="card-header-tab card-header">
          <div class="card-header-title font-size-lg text-capitalize titlewrap">
            {{ $t("create_designation") }}
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
          <div
            v-for="(deisgnation_object, index) in designation_array"
            :key="index"
          >
            <!-- {{deisgnation_object}} -->
            <v-layout>
              <v-flex xs12 md4 pl-2>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-autocomplete
                      v-bind:label="$t('level')"
                      v-on="on"
                      index="id"
                      class="required_field"
                      item-value="id"
                      item-text="level"
                      v-model="deisgnation_object.level_id"
                      :rules="fieldRules"
                      :items="level_array"
                      outlined
                      dense
                    ></v-autocomplete>
                  </template>
                  <span>{{ $t("level_name") }}</span>
                </v-tooltip>
              </v-flex>

              <v-flex xs12 md4 pl-2>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-on="on"
                      v-model="deisgnation_object.designation"
                      :rules="fieldRules"
                      v-bind:label="$t('designation_name')"
                      required
                      class="required_field"
                      maxlength="40"
                      counter="40"
                      outlined
                      dense
                    ></v-text-field>
                  </template>
                  <span>{{ $t("designation_name") }}</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex xs12 md10 pl-2>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-textarea
                      v-on="on"
                      v-model="deisgnation_object.designation_description"
                      v-bind:label="$t('description')"
                      required
                      outlined
                      counter="500"
                      rows="2"
                      maxlength="500"
                      dense
                    ></v-textarea>
                  </template>
                  <span>{{ $t("description") }}</span>
                </v-tooltip>
              </v-flex>
              <v-flex
                xs12
                md1
                pl-50
                v-if="
                  index == designation_array.length - 1 && !$route.query.slug
                "
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <button
                      v-on="on"
                      @click="addDesignation(index)"
                      class="btn btn-primary rounded-circle mr-2 py-0 mt-4 primary designation_add_icon"
                    >
                      <v-icon class="text-white" medium>mdi-plus</v-icon>
                    </button>
                  </template>
                  <span>{{ $t("add") }}</span>
                </v-tooltip>
              </v-flex>
              <v-flex
                xs12
                md1
                pl-50
                v-if="designation_array.length > 1 && index > 0"
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <button
                      v-on="on"
                      @click="removeDesignation(index)"
                      class="btn btn-primary rounded-circle mr-2 py-0 mt-4 primary designation_add_icon"
                    >
                      <v-icon class="text-white" medium>mdi-minus</v-icon>
                    </button>
                  </template>
                  <span>{{ $t("add") }}</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </div>
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
                @click="save"
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
    <ConfirmDialog
      :show="showConfirmDialog"
      :cancel="cancel"
      :confirm="confirm"
      :id="delete_id"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('delete_confirmation')"
    />
  </div>
</template>
  
<script>
import VueElementLoading from "vue-element-loading";
import ConfirmDialog from "../Components/ConfirmDialog.vue";

export default {
  components: {
    VueElementLoading,
    ConfirmDialog,
  },
  data: () => ({
    valid: true,
    loader: false,
    isBtnLoading: false,
    isDisabled: false,
    user: "",
    designation_array: [],
    designation_detailes: "",
    showConfirmDialog: false,
    delete_id: null,
    designation_data: {
      id: 0,
      designation: "",
      designation_description: "",
      level_id: null,
    },
    level_array: [],
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
  mounted() {
    if (!this.$route.query.slug) {
      this.designation_array.push(this.designation_data);
    }
    this.fetchLevel();
    this.user = JSON.parse(localStorage.getItem("user"));
  },
  created() {},
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        this.fetchLevel();
        if (this.$route.query.slug) {
          this.loader = true;
          axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "designation/" +
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
                // this.fetchLevel();
                this.designation_array.push(res.data.designation_data);
                this.designation_detailes = res.data.designation_data;
                this.loader = false;
              } else if (res.data.status == "E") {
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
              console.log("error", err);
            });
        }
      },
    },
  },
  methods: {
    addDesignation() {
      // alert(index)
      if (this.$refs.form.validate()) {
        this.designation_array.push({
          id: 0,
          designation: "",
          designation_description: "",
          level_id: "",
        });
        // this.designation_data.level_id="";
        // this.designation_data.designation_description="";
        // this.designation_data.designation="";
      }
    },
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm(id) {
      this.deleteConfirm(id);
      this.showConfirmDialog = false;
    },

    removeDesignation(index) {
      this.delete_id = index;
      this.showConfirmDialog = true;
    },
    deleteConfirm(index) {
      this.designation_array.splice(index, 1);
    },
    // removeDesignation(index) {
    //   this.designation_array.splice(index, 1);
    // },
    fetchLevel() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_level_details")
        .then((response) => {
          if (response.data.status == "S") {
            this.level_array = response.data.employee_level;
          } else {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(err);
        });
    },
    // formattedStartDate(formatted_date) {
    //   this.level.work_week_start = formatted_date;
    // },
    // formattedEndDate(formatted_date) {
    //   this.level.work_week_end = formatted_date;
    // },
    save() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        if (this.designation_detailes) {
          axios
            .patch(
              process.env.VUE_APP_API_URL_ADMIN +
                "designation/" +
                this.designation_detailes.id,
              this.designation_detailes,
              this.user.hr_employee.org_id
            )
            .then((res) => {
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "E") {
                this.flashMessage.error({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class",
                });
                this.isDisabled = false;
                this.isBtnLoading = false;
              } else {
                this.flashMessage.success({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class",
                });
                this.isBtnLoading = false;
                this.isDisabled = false;
                this.$router.push({
                  name: "designation",
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
          this.isDisabled = true;
          this.isBtnLoading = true;
          axios
            .post(process.env.VUE_APP_API_URL_ADMIN + "designation", {
              designation: this.designation_array,
              org_id: this.user.hr_employee.org_id,
              site_id: this.user.hr_employee.site_id,
            })
            .then((res) => {
              this.isDisabled = false;
              this.isBtnLoading = false;
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "E") {
                this.flashMessage.error({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class",
                });
              } else {
                this.flashMessage.success({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class",
                });
                this.$router.push({
                  name: "designation",
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
        }
      }
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>
<style scoped>
.designation_add_icon {
  height: 30px !important;
  padding: 0px 4px !important;
}
.pl-50 {
  padding-left: 50px !important;
}
</style>
  