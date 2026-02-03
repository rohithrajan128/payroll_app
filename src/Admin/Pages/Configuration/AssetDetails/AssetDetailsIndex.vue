<template>
  <div class="main-20">
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title class="col-md-4" :heading="$t('asset_details')" :google_icon="google_icon"></page-title>

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

      <div>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <router-link
              class="text-decoration-none"
              :to="{ name: 'assetdetails.amend' }"
            >
              <v-btn color=" btn  hover_shine add_new" small class v-on="on">{{ $t("add_new") }}</v-btn>
            </router-link>
          </template>
          <span>{{ $t("add_new") }}</span>
        </v-tooltip>
      </div>
    </div>

    <v-data-table
      :headers="headers"
      :items="allassets"
      :loading="initval"
      :search="search"
      v-bind:no-data-text="$t('no_data_available')"
    >
      <template v-slot:item="{ item, expand, isExpanded }">
        <tr>
          <td>{{ item.invoice_no }}</td>
          <td v-if="item.sitename">{{ item.sitename.shortname }}</td>
          <td v-if="item.departmentlookupdetails">{{ item.departmentlookupdetails.shortname }}</td>
          <td v-else> - </td>
          <td v-if="item.purchased_from != null">{{ item.vendorslist.shortname }}</td>
          <td>{{ item.purchased_date |formatDate }}</td>

          <td class="text-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <!-- <div v-on="on" class="d-inline-block">
                  <v-btn
                    class="hover_shine btn mr-2 mb-2"
                    :disabled="isDisabled"
                    @click="changeStatus(item.slug)"
                    small
                    v-bind:class="[
                      item.status == 1 ? 'success' : 'warning',
                    ]"
                  >
                    <span v-if="item.status == 1" class="spanactivesize">{{ $t("active") }}</span>
                    <span v-if="item.status == 0" class="spanactivesize">{{ $t("inactive") }}</span>
                  </v-btn>
                </div> -->

                <div v-on="on" class="maindivforswitch d-inline-block" @click="changeStatus(item.slug)">
                  <v-switch v-model="item.status" color="success" readonly>
                  </v-switch>
                  <div class="viconinswitchon" v-if="item.status == 1">
                    <img src="@/assets/images/correct_switch.png" height="20px">
                  </div>
                  <div class="viconinswitchoff" v-if="item.status == 0">
                    <img src="@/assets/images/delete_switch.png" height="24px">
                  </div>
                </div>

              </template>
              <span>{{ $t("status") }}</span>
            </v-tooltip>
          </td>
          <td class="text-center">
            <router-link
              :to="{
                name: 'assetdetails.amend',
                query: {
                  slug: item.slug,                 
                },
              }"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon class="mr-2 edit_btn icon_size" v-on="on">mdi-pencil-outline</v-icon>
                </template>
                <span>{{ $t("edit") }}</span>
              </v-tooltip>
            </router-link>
          </td>
          <td @click="expand(!isExpanded)">
            <v-btn icon v-if="isExpanded == false">
              <v-icon>mdi-arrow-down-drop-circle-outline</v-icon>
            </v-btn>
            <v-btn icon v-else>
              <v-icon>mdi-arrow-up-drop-circle-outline</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <tr>
          <td :colspan="headers.length" class="bg-grey pl-3 py-2">
            <v-row class="justify-space-around mt-1" v-if="item.description!=null">
              <v-col md="12">
                <span class="expand_row_header">
                  {{
                  $t("description")
                  }} :
                </span>
                <p>{{item.description }}</p>
              </v-col>
            </v-row>
            <v-row class="justify-space-around mt-1" v-else>
              <v-col md="12">
                <!-- <span class="expand_row_header">{{
                    $t("description")
                }} :</span>-->
                <p align="center">
                  <strong>{{$t("no_data_available")}}</strong>
                </p>
              </v-col>
            </v-row>
          </td>
        </tr>
      </template>
    </v-data-table>
    <ConfirmDialog
      :show="showStatusDialog"
      :cancel="cancelStatus"
      :confirm="confirmStatus"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('status_change')"
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
    allassets: [],
    showConfirmDialog: false,
    initval: false,
    status_id: null,
    isDisabled: false,
    headers: [
      {
        text: "Invoice No",
        align: "left",
        value: "invoice_no"
      },
      {
        text: "Site",
        align: "left",
        value: "sitename.shortname"
      },
      {
        text: "Department",
        align: "left",
        value: "departmentlookupdetails.shortname"
      },
      {
        text: "Purchased From",
        align: "left",
        value: "vendorslist.shortname"
      },
      {
        text: "Purchased Date",
        align: "left",
        value: "purchased_date"
      },
      {
        text: "Status",
        value: "status",
        align: "center"
      },
      {
        text: "Actions",
        value: "name",
        align: "center"
      },
      {
        text: "",
        value: "",
        align: "center"
      }
    ],
    google_icon: {
      icon_name: "important_devices",
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
    this.fetchassetdetails();
  },
  methods: {
    cancel() {
      this.showConfirmDialog = false;
    },

    cancelStatus() {
      this.showStatusDialog = false;
    },
    confirmStatus() {
      this.statusUpdate();
      this.showStatusDialog = false;
    },
    fetchassetdetails() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getAssetdetails")
        .then(res => {
          this.allassets = res.data.assetdetails;
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
    },
    changeStatus(slug) {
      this.status_id = slug;
      this.showStatusDialog = true;
    },
    statusUpdate() {
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "updatedetailedAssetstatus", {
          slug: this.status_id
        })
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
            this.fetchassetdetails();
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class"
            });
            this.initval = true;
          } else {
            this.flashMessage.error({
              message: this.array_data
            });
            this.initval = true;
            this.fetchassetdetails();
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
</style>