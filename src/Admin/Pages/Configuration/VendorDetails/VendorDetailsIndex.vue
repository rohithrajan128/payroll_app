<template>
  <div class="main-20">
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title class="col-md-4" :heading="$t('vendor_details')" :google_icon="google_icon"></page-title>

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

      <div class="col-md-2">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <router-link
              class="text-decoration-none"
              :to="{ name: 'vendordetails.amend' }"
              style="color: white"
            >
              <v-btn color=" btn hover_shine add_new" small class v-on="on">{{ $t("add_new") }}</v-btn>
            </router-link>
          </template>
          <span>{{ $t("add_new") }}</span>
        </v-tooltip>
      </div>
    </div>

    <v-data-table :headers="headers" :items="allvendorlist" :loading="initval" :search="search">
      <template v-slot:item="props">
        <tr>
          <td>{{ props.item.registered_name }}</td>
          <td>{{ props.item.shortname }}</td>
          <td>
            <span v-if="props.item.contact_name!=null">{{ props.item.contact_name }}</span>
            <span v-else>{{ $t('empty_field') }}</span>
          </td>
          <td>
            <span v-if="props.item.mobile!=null">{{ props.item.mobile }}</span>
            <span v-else>{{ $t('empty_field') }}</span>
          </td>
          <td>
            <span v-if="props.item.email_id!=null">{{ props.item.email_id }}</span>
            <span v-else>{{ $t('empty_field') }}</span>
          </td>
          <td>
            <span v-if="props.item.gst_no!=null">{{ props.item.gst_no }}</span>
            <span v-else>{{ $t('empty_field') }}</span>
          </td>
          <td class="text-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <!-- <div v-on="on" class="d-inline-block">
                  <v-btn
                    class="hover_shine btn mr-2 mb-2"
                    :disabled="isDisabled"
                    @click="changeStatus(props.item.slug)"
                    small
                    v-bind:class="[
                      props.item.active_status == 1 ? 'success' : 'warning',
                    ]"
                  >
                    <span
                      v-if="props.item.active_status == 1"
                      class="spanactivesize"
                    >{{ $t("active") }}</span>
                    <span
                      v-if="props.item.active_status == 0"
                      class="spanactivesize"
                    >{{ $t("inactive") }}</span>
                  </v-btn>
                </div> -->
                <div v-on="on" class="maindivforswitch d-inline-block" @click="changeStatus(props.item.id)">
                  <v-switch v-model="props.item.active_status" color="success" readonly>
                  </v-switch>
                  <div class="viconinswitchon" v-if="props.item.active_status == 1">
                    <img src="@/assets/images/correct_switch.png" height="20px">
                  </div>
                  <div class="viconinswitchoff" v-if="props.item.active_status == 0">
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
                name: 'vendordetails.amend',
                query: {
                  slug: props.item.slug,                 
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
    allvendorlist: [],
    showConfirmDialog: false,
    initval: false,
    status_id: null,
    isDisabled: false,
    headers: [
      {
        text: "Registered Name",
        align: "left",
        value: "registered_name"
      },
      {
        text: "Short Name",
        align: "left",
        value: "shortname"
      },

      {
        text: "Contact Person",
        value: "contact_name",
        align: "left"
      },
      {
        text: "Contact Number",
        align: "left",
        value: "mobile"
      },
      {
        text: "Email",
        align: "left",
        value: "email_id"
      },
      {
        text: "GST NO",
        align: "left",
        value: "gst_no"
      },
      {
        text: "Status",
        align: "center",
        value: "active_status"
      },

      {
        text: "Actions",
        value: "name",
        align: "center"
      }
    ],
    google_icon: {
      icon_name: "menu_book",
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
    this.fetchvendordetails();
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
    fetchvendordetails() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getvendordetails")
        .then(res => {
          this.allvendorlist = res.data.vendordetails;
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
    changeStatus(id) {
      this.status_id = id;
      this.showStatusDialog = true;
    },

    statusUpdate() {
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "updateVendorstatus", {
          id: this.status_id
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
            this.fetchvendordetails();
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
            this.fetchvendordetails();
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