<template>
  <div class="main-20">
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title class="col-md-4" :heading="$t('system_admin_noc')" :google_icon="google_icon"></page-title>

      <div class="col-md-6">
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

      <div class="col-md-2"></div>
    </div>
    <v-data-table :headers="headers" :items="allcategories" :loading="initval" :search="search">
      <template v-slot:item="{item } ">
        <tr>
          <td>
            <!-- query: {
                      slug: props.item.slug,
                      view: 'exit_noc.amend'
            },-->
            <router-link
              class="text-decoration-none"
              :to="{
                    name: 'system_admin_noc.amend',
                    query: {
                      slug: item.emp_details.slug,
                      full_name:item.emp_details.full_name
                    }
                  }"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-chip v-on="on" color="success" small outlined medium class="userindexcodechip">
                    {{item.emp_details.empno
                    }}
                  </v-chip>
                </template>
                <span>{{ $t("view") }}</span>
              </v-tooltip>
            </router-link>
          </td>

          <td>{{ item.emp_details.full_name }}</td>
          <td>
            
            <span v-if="item.submit_system_admin_questions == 1">{{ $t("approved") }}</span>
                    <span v-else>{{ $t("Pending") }}</span>
            
            </td>
          <td>{{ item.resignation_submitted_on | formatDate }}</td>
        </tr>
      </template>
    </v-data-table>
    <ConfirmDialog
      :show="showConfirmDialog"
      :cancel="cancel"
      :confirm="confirm"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('delete_confirmation')"
    />
  </div>
</template>
      
    <script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
export default {
  components: {
    PageTitle,
    ConfirmDialog
  },
  data: () => ({
    allcategories: [],
    showConfirmDialog: false,
    initval: false,
    delete_id: null,
    status_id: null,
    isDisabled: false,
    headers: [
      {
        text: "Employee Number",
        align: "left",
        value: "emp_details.empno"
      },

      {
        text: "Employee Name",
        value: "emp_details.full_name",
        align: "left"
      },
      {
        text: "Status",
        value: "status",
        align: "left"
      },
      {
        text: "Date of Resignation",
        value: "resignation_submitted_on",
        align: "left"
      }
    ],
    google_icon: {
      icon_name: "quiz",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined"
    },
    search: "",
    valid: false,
    message: "",
    showStatusDialog: false
  }),
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.fetchSystemAdmin();
  },
  methods: {
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm() {
      this.deleteConfirm();
      this.showConfirmDialog = false;
    },
    deleteItem(id) {
      this.delete_id = id;
      this.showConfirmDialog = true;
    },
    deleteConfirm() {
      axios
        .delete(
          process.env.VUE_APP_API_URL_ADMIN + "deletecategory/" + this.delete_id
        )
        .then(res => {
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
            this.initval = true;
            this.fetchSystemAdmin();
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class"
            });
          } else {
            this.flashMessage.error({
              message: this.array_data
            });

            this.fetchSystemAdmin();
          }
        })
        .catch(err => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          console.log("this error" + err);
        });
    },

    fetchSystemAdmin() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "get_system_admin_noc")
        .then(res => {
          this.allcategories = res.data.user_details;
          this.initval = false;
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
};
</script>
    <style scoped>
.v-text-field /deep/ .v-input__slot {
  min-height: 38px !important;
  width: 353px;
}

.param-value {
  max-width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.description_item {
  overflow-wrap: anywhere;
}
.userindexcodechip:hover {
  cursor: pointer;
}
</style>