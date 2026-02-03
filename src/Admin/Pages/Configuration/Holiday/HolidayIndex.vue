<template>
  <div class="main-20">
    <div>
    <div class="row mt-3">
      <div class="col-md-2">
        <page-title class="col-md-4" :heading="$t('holiday')" :google_icon="google_icon"></page-title>
      </div>
      <div class="col-md-8">
        
      <div class="row">
        <!-- <div class="col-md-4 textfieldmaxwidth">
        <v-autocomplete dense outlined v-bind:label="$t('organisation')" 
              v-model="filter.organisation" item-value="id" item-text="shortname" :items="organisation"
              @change="fetchsite(filter.organisation)"></v-autocomplete>
      </div> -->
      <div class="col-md-4 textfieldmaxwidth" >
        <!-- <v-autocomplete v-bind:label="$t('location')" index="id" item-value="id" item-text="unique_location"
              :disabled="filter.organisation == ''" v-model="filter.location" :items="site" outlined dense
              @change="fetchholiday" >
            </v-autocomplete> -->
      </div>
      <div class="col-md-4 textfieldmaxwidth">
        <v-autocomplete v-model="filter.year_applicable" 
          v-bind:label="$t('year_applicable')" outlined dense v-on:keypress="NumbersOnly" item-value="year"
          item-text="year" :items="year_array" @change="fetchholiday" >
          </v-autocomplete>
      </div>
      </div>


      </div>
      <div class="col-md-2">
        <div class="holidayheaderbutton">
        <v-tooltip bottom class="ms-auto">
            <template v-slot:activator="{ on }">
              <router-link class="text-decoration-none" :to="{ name: 'holiday.amend' }" style="color: white">
                <v-btn class="ml-auto" color=" btnhover_shine add_new" small v-on="on">{{ $t("add_new") }}</v-btn>
              </router-link>
            </template>
            <span>{{ $t("add_new") }}</span>
          </v-tooltip></div>
      </div>
    </div>

    <v-data-table :headers="headers" :loading="initval" :items="holiday" :search="search" >
      <template v-slot:item="props">
        <tr>
          <td>{{ props.item.from_date | formatDate }}</td>
          <td>{{ props.item.day }}</td>
          <td>{{ props.item.fetch_holidaytype.shortname }}</td>
          <td>{{ props.item.fetch_site_details.unique_location }}</td>

          <td class="text-center">
            <router-link :to="{
              name: 'holiday.amend',
              query: {
                slug: props.item.slug,
              },
            }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon class="mr-2 edit_btn icon_size" v-on="on">mdi-pencil-outline</v-icon>
                </template>
                <span>{{ $t("edit") }}</span>
              </v-tooltip>
            </router-link>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon class="mr-2 delete_btn icon_size" v-on="on" small
                  @click="deleteHoliday(props.item.id)">mdi-trash-can-outline</v-icon>
              </template>
              <span>{{ $t("delete") }}</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
    </v-data-table>
    <ConfirmDialog :show="showConfirmDialog" :cancel="cancel" :confirm="confirm" v-bind:title="$t('confirm')"
      v-bind:description="$t('delete_confirmation')" />
  </div>
</div>
</template>
  
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
export default {
  components: {
    PageTitle,
    ConfirmDialog,
  },
  data: () => ({
    filter: {
      organisation: '',
      location: '',
      year_applicable: '',
    },
    current_year: '',
    site: [],
    year_array: [],
    organisation: [],
    loading: false,
    valid: false,
    search: "",
    message: "",
    dialog: false,
    lookups: [],
    holiday: [],
    status_id: null,
    delete_id: null,
    initval: false,
    isDisabled: false,
    headers: [
      {
        text: "Date",
        align: "left",
        value: "from_date",
      },
      {
        text: "Day",
        align: "left",
        value: "day",
      },

      {
        text: "Holiday Name",
        align: "left",
        value: "fetch_holidaytype.shortname",
      },
      {
        text: "Location",
        align: "left",
        value: "fetch_site_details.unique_location",
      },

      {
        text: "Actions",
        value: "name",
        align: "center",
        sortable : false
      },
    ],
    google_icon: {
      icon_name: "calendar_month",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
    valid: false,
    message: "",
    showConfirmDialog: false,
  }),
  created() {
     let currentYear = new Date().getFullYear();
    this.filter.year_applicable = currentYear;
    this.fetchholiday();    
  },
  mounted() {
    let currentYear = new Date().getFullYear();
    this.filter.year_applicable = currentYear;
    this.fetchOrg();
    this.fetchyearArray(currentYear);
  },
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },
  methods: {
    fetchsite(org_id) {
      this.site = [];
      this.holiday.site_id = '';
      this.
        axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getsiteholiday/" + org_id)
        .then((res) => {
          this.site = res.data.data;
          if(this.site.length>=1){
            this.site.unshift({
              id:0,
              unique_location : 'All'
            })
            this.filter.location = 0;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      this.fetchholiday();
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

    fetchOrg() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getallorgforholiday")
        .then((res) => {
          this.organisation = res.data.data;
          if(this.organisation.length>=1){
            this.organisation.unshift({
              id:0,
              shortname : 'All'
            })
            this.filter.organisation =0 ;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchyearArray(currYear) {
      if (currYear) {
        var y=currYear;
        for (var y = currYear - 10; y <= currYear + 1; y++) {
          this.year_array.unshift({
            'year': y
          });
        }
       
      }
    },
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm() {
      this.deleteConfirm();
      this.showConfirmDialog = false;
    },
    deleteHoliday(id) {
      this.delete_id = id;
      this.showConfirmDialog = true;
    },
    deleteConfirm() {  
      this.initval = true;
      axios
        .delete(
          process.env.VUE_APP_API_URL_ADMIN + "deleteholiday/" + this.delete_id
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
          
            this.fetchholiday();
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
          } else {
            this.flashMessage.error({
              message: this.array_data,
            });

            this.fetchholiday();
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log("this error" + err);
        });
    },

    fetchholiday() {
      this.initval = true;
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "getholidayfilter", this.filter)
        .then((res) => {
          this.holiday = res.data.data;
          this.initval = false;
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          this.initval = false;
          console.log(" error" + err);
        });
    },

  },
};
</script>
<style scoped>





.holidayheaderbutton{
  text-align: end;
    padding-right: 34px;
}

.textfieldmaxwidth /deep/ .v-input__slot{
  max-width:100% !important;
}
</style>