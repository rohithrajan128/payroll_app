<template>
  <div class="main-20">
    
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title
      class="col-md-6"
      :heading="$t('financial_year')"
      :google_icon="google_icon"
    ></page-title>

<div class="colmd-6">
  <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-text-field
           dense
		       rounded-pill
           density="compact"
		        outlined
		       rounded
           small
            v-on="on"
            v-model="search"
            append-icon="search"
            label="Search"
            class="srch_bar"
            hide-details
          ></v-text-field>
        </template>
        <span>{{ $t("search") }}</span>
      </v-tooltip>
</div>
     
    </div>
    <v-data-table
      :headers="headers"
      :items="financial_year_array"
      :search="search"
      :loading="initval"
    >
      <template v-slot:item="props">
        <tr>
          <td>{{ props.item.financial_year }}</td>
          <td class="param-value">{{ props.item.start_date | formatDate }}</td>
          <td>{{ props.item.end_date | formatDate }}</td>
          <td class="text-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <!-- <div v-on="on" class="d-inline-block min_width">
                  <v-btn
                    x-small
                    v-on="on"
                    :disabled="isDisabled"
                    class="hover_shine"
                    small
                    v-bind:class="[
                      props.item.current_fiscal == 1 ? 'success' : 'warning',
                    ]"
                  >
                    <span
                      v-if="props.item.current_fiscal == 1"
                      class="spanactivesize"
                    >
                      {{ $t("active") }}
                    </span>
                    <span
                      v-if="props.item.current_fiscal == 0"
                      class="spanactivesize"
                    >
                      {{ $t("inactive") }}
                    </span>
                  </v-btn>
                </div> -->

                <div v-on="on" class="maindivforswitch d-inline-block">
                  <v-switch v-model="props.item.current_fiscal" color="success" readonly>
                  </v-switch>
                  <div class="viconinswitchon" v-if="props.item.current_fiscal == 1">
                    <img src="@/assets/images/correct_switch.png" height="20px">
                  </div>
                  <div class="viconinswitchoff" v-if="props.item.current_fiscal == 0">
                    <img src="@/assets/images/delete_switch.png" height="24px">
                  </div>
                </div>

              </template>
              <span>{{ $t("status") }}</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
    </v-data-table>
   
  </div>
</template>
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
export default {
  components: {
    PageTitle,
  },
  data: () => ({
    google_icon: {
      icon_name: "calendar_today",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
    initval: false,
    financial_year_array: [],
  }),
  computed: {
    headers() {
      return [
        {
          text: this.$t("financial_year"),
          align: "left",
          sortable: false,
          value: "financial_year",
        },
        {
          text: this.$t("start_date"),
          value: "start_date",
        },
        {
          text: this.$t("end_date"),
          value: "end_date",
        },
        {
          text: "Status",
          align: "center",
          value: "status",
        },
      ];
    },
  },
  mounted() {
    this.fetchFinancialYear();
  },
  methods: {
    fetchFinancialYear() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_financial_year")
        .then((res) => {
          this.financial_year_array = res.data.financial_year;
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
  },
};
</script>
<style scoped>
</style>