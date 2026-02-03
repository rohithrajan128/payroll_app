<template>
   <div class="container-fluid mt-3 p-0">
    <div class="mb-3 mx-auto">
      <div class="card-header">
        <div class="">
          <div
            class="card-header-title font-size-lg text-capitalize titlewrap"
          >{{ $t("create_amend_leave_calculation") }}</div>
        </div>
      </div>
      <div class="card-body">
        <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
        <v-form ref="form" v-model="valid">
          <v-layout>
            <v-flex xs12 md4 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    v-bind:label="$t('organisation')"
                    v-on="on"
                    index="id"
                    item-value="id"
                    item-text="shortname"
                    class="required_field"
                    disabled
                    v-model="leave_calculation.org_id"
                    :rules="fieldRules"
                    :items="organisation_array"
                    outlined
                    dense
                  ></v-autocomplete>
                </template>
                <span>{{ $t("organisation") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md4 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    v-bind:label="$t('leave_type')"
                    v-on="on"
                    index="id"
                    item-value="id"
                    item-text="leave_name"
                    class="required_field"
                    v-model="leave_calculation.leave_id"
                    :rules="fieldRules"
                    :items="leave_array"
                    outlined
                    dense
                  ></v-autocomplete>
                </template>
                <span>{{ $t("leave_type") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12 md4 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    v-bind:label="$t('calculation_type')"
                    v-on="on"
                    index="id"
                    item-value="id"
                    item-text="longname"
                    class="required_field"
                    v-model="leave_calculation.current_calculation_type_id"
                    :rules="fieldRules"
                    :items="calculation_type_array"
                    @change="
                      calculateEffectiveDate(
                        leave_calculation.current_calculation_type_id
                      )
                    "
                    outlined
                    dense
                  ></v-autocomplete>
                </template>
                <span>{{ $t("calculation_type") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md4 pl-2>
              <DatePicker
                :label="$t('effective_date')"
                :stored_date="leave_calculation.effective_date"
                :min="new Date().toISOString().substr(0, 10)"
                @formatted_date="formattedEffectiveDate"
                dense
              />
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
                  @click="submitLeaveCalculationSetup"
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
  </div>
</template>
<script>
import VueElementLoading from "vue-element-loading";
import DatePicker from "../Components/DatePicker.vue";
import moment from "moment";
export default {
  components: {
    VueElementLoading,
    DatePicker
  },
  data: () => ({
    valid: true,
    calc_type_longname: "",
    financial_year_data: "",
    loader: false,
    organisation_array: [],
    leave_array: [],
    isBtnLoading: false,
    isDisabled: false,
    calculation_type_array: [],
    leave_calculation: {
      id: 0,
      org_id: null,
      leave_id: null,
      current_calculation_type_id: null,
      effective_date: "",
      updation_date: "",
      status: 1
    }
  }),
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          axios
            .get(process.env.VUE_APP_API_URL_ADMIN + "edit_leave_cal_by_slug", {
              params: {
                slug: this.$route.query.slug
              }
            })
            .then(res => {
              this.leave_calculation = res.data.leave_calc_data;

              this.loader = false;
            });
        }
      }
    }
  },
  mounted() {
    this.fetchLookups();
    this.fetchOrgnaisation();
    this.fetchLeave();
    this.fetchFinancialYear();
  },
  computed: {
    fieldRules() {
      return [v => !!v || this.$t("field_required")];
    }
  },
  methods: {
    fetchFinancialYear() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_active_financial_year")
        .then(res => {
          this.financial_year_data = res.data.active_financial_year;
        })

        .catch(err => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });

          console.log(" error" + err);
        });
    },
    calculateEffectiveDate(calculation_type) {
      var CurrentDate = new Date().toISOString().slice(0, 10);
      this.calc_type_longname = this.calculation_type_array.find(
        x => x.id === calculation_type
      ).longname;
      if (this.calc_type_longname == "Daily" && this.financial_year_data) {
        if (
          CurrentDate >= this.financial_year_data.start_date &&
          CurrentDate < this.financial_year_data.end_date
        ) {
          var present_day = moment().format("YYYY-MM-DD");

          this.leave_calculation.effective_date = present_day;
        } else {
          this.isDisabled = true;
          this.flashMessage.error({
            message: this.$t("financial_year_not_started"),
            time: 4000,
            blockClass: "custom-block-class"
          });
        }
        // this.leave_calculation.effective_date=myDate
      } else if (
        this.calc_type_longname == "Quarterly" &&
        this.financial_year_data
      ) {
        if (
          CurrentDate >= this.financial_year_data.start_date &&
          CurrentDate < this.financial_year_data.end_date
        ) {
          if (this.leave_calculation.id > 0) {
            var quarterly_month_increament = moment(
              this.leave_calculation.effective_date
            )
              .add("quarter")
              .startOf("quarter")
              .format("YYYY-MM-DD");
            // this.leave_calculation.effective_date = quarterly_month_increament;
          } else {
            var quarterly_month_increament = moment()
              .add("quarter")
              .startOf("quarter")
              .format("YYYY-MM-DD");
          }
          this.leave_calculation.effective_date = quarterly_month_increament;
        } else {
          this.isDisabled = true;
          this.flashMessage.error({
            message: this.$t("financial_year_not_started"),
            time: 4000,
            blockClass: "custom-block-class"
          });
        }
      } else if (
        this.calc_type_longname == "Monthly" &&
        this.financial_year_data
      ) {
        if (
          CurrentDate >= this.financial_year_data.start_date &&
          CurrentDate < this.financial_year_data.end_date
        ) {
          var first_day_of_month = moment()
            .add("month")
            .startOf("month")
            .format("YYYY-MM-DD");

          this.leave_calculation.effective_date = first_day_of_month;
        } else {
          this.isDisabled = true;
          this.flashMessage.error({
            message: this.$t("financial_year_not_started"),
            time: 4000,
            blockClass: "custom-block-class"
          });
        }
      } else {
        this.isDisabled = true;
        this.flashMessage.error({
          message: this.$t("no_financial_year"),
          time: 4000,
          blockClass: "custom-block-class"
        });
      }
    },
    submitLeaveCalculationSetup() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        // Form is valid, process

        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "create_leave_calculation",
            this.leave_calculation
          )
          .then(res => {
            this.isDisabled = false;
            this.isBtnLoading = false;
            if (Array.isArray(res.data.message)) {
              this.array_data = res.data.message.toString();
            } else {
              this.array_data = res.data.message;
            }
            if (res.data.status == "S") {
              this.flashMessage.success({
                message: this.array_data,
                time: 4000,
                blockClass: "custom-block-class"
              });
              this.message = res.data.message;
              this.$router.push({
                name: "leave_calculation"
              });
            } else if (res.data.status == "E") {
              this.flashMessage.error({
                message: this.array_data,
                time: 4000,
                blockClass: "custom-block-class"
              });
              this.isBtnLoading = false;
              this.isDisabled = false;
            } else {
              this.isBtnLoading = false;
              this.flashMessage.error({
                message: this.array_data
              });
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
      } else {
        //alert("Form is Invalid");
      }
    },
    formattedEffectiveDate(formatted_date) {
      this.leave_calculation.effective_date = formatted_date;
    },
    fetchLookups() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "CALCULATION_TYPE"
          }
        })
        .then(response => {
          this.calculation_type_array = response.data.lookup_details;
        })
        .catch(err => {
          console.log(err);
        });
    },
    fetchOrgnaisation() {
      this.user = JSON.parse(localStorage.getItem("user"));
      this.leave_calculation.org_id = this.user.hr_employee.org_id;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getorganisation")
        .then(res => {
          this.organisation_array = res.data.data;
        })

        .catch(err => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });

          console.log(" error" + err);
        });
    },
    fetchLeave() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_leave_type_calculation")
        .then(res => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.leave_array = res.data.leave_rules_data;
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class"
            });
          } else {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class"
            });
            console.log("error message", array_data);
          }
        })
        .catch(err => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          console.log("error", err);
        });
    }
  }
};
</script>
<style scoped>
</style>