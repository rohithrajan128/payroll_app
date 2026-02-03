<template>
  <div class="main-20">
    <!-- <div>
      <page-title
        :heading="$t('resource_history')"
        :google_icon="google_icon"
      ></page-title>
    </div> -->

    <div>
      <v-data-table
        :loading="initval"
        :headers="headers"
        :items="allresources"
        v-bind:no-data-text="$t('no_data_available')"
        :footer-props="{ 'items-per-page-text': $t('rows_per_page') }"
      >
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.hr_emp_id.full_details }}</td>

            <td>{{ props.item.start_date | formatDate }}</td>
            <td>{{ props.item.end_date   | formatDate }}</td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </div>
</template>
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import DatePicker from "../Components/DatePicker.vue";
export default {
  components: {
    PageTitle,
    ConfirmDialog,
    DatePicker,
  },
  props: ["project_name"],
  data: () => ({
    google_icon: {
      icon_name: "ballot",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },

    initval: false,
    isBtnLoading: false,
    valid: true,
    empid_list: [],
    projectid_list: [],

    //  resource_allocation: {
    //    emp_id: "",
    //    project_id: "",
    //    start_date: "",
    //    end_date: "",
    //  },
    allresources: [],
    headers: [
      {
        text: "Resource",
        value: "emp_id",
      },

      {
        text: "Start Date",
        value: "start_date",
      },
      {
        text: "End Date",
        value: "end_date",
      },
    ],

    submit_credential_disable: false,
  }),
  mounted() {
    this.fetchresourcehistoryhistory();
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
                "getresourcehistory?slug=" +
                this.$route.query.slug
            )
            .then((res) => {
              this.allresources = res.data.resources;

              this.initval = false;
            })           
            .catch((err) => {
              this.isDisabled = false;
              console.log("this error" + err);
            });
        }
      },
    },
  },

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },
  methods: {
    fetchresourcehistoryhistory() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN +"getresourcehistory?slug="+this.$route.query.slug)
        .then((res) => {
          this.allresources = res.data.resources;

          this.initval = false;
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
        });
    },

    fetchempid() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getempid")
        .then((res) => {
          this.empid_list = res.data.emp_ids;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetchprojectid() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getprojectid")
        .then((res) => {
          this.projectid_list = res.data.project_ids;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
