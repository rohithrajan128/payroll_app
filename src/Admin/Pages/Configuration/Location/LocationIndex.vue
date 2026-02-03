<template>
  <div class="main-20">
    <div flat color="white" class="row py-5 pl-5 align-items-center">
    <page-title class="col-md-4" :heading="$t('location')" :google_icon="google_icon"></page-title>
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
            :to="{ name: 'location.amend' }"
            style="color: white"
          >
            <v-btn
              color=" btn mr-2 mb-2 hover_shine add_new"
              small
              class="mb-2"
              v-on="on"
            >{{ $t("add_new") }}</v-btn>
          </router-link>
        </template>
        <span>{{ $t("add_new") }}</span>
      </v-tooltip>
    </div>
  </div>
    <v-data-table
      :headers="headers"
      :loading="initval"
      :items="allorganisation"
      :search="search"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.location_id }}</td>
          <td>{{ item.shortname }}</td>
          <td>
            <v-tooltip bottom v-if="item.address" max-width="370" color="white">
              <template v-slot:activator="{ on }">
                <div class="description_hover_div" v-on="on">{{ item.address }}</div>
              </template>
              <v-sheet class="pa-4 b">{{ item.address }}</v-sheet>
            </v-tooltip>
            <span v-else>{{ $t('empty_field') }}</span>
          </td>

          <td>
            <span v-if="item.state">{{ item.get_state_name.name }}</span>
            <span v-else>{{ $t('empty_field') }}</span>
          </td>
          <td>
            <span v-if="item.city">{{ item.get_city_name.name }}</span>
            <span v-else>{{ $t('empty_field') }}</span>
          </td>
          <td>{{ item.postcode }}</td>
          <td>
            <span v-if="item.country">{{ item.get_country_name.name }}</span>
            <span v-else>{{ $t('empty_field') }}</span>
          </td>
          <td class="text-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div
                  v-on="on"
                  class="maindivforswitch d-inline-block"
                  @click="changeStatus(item.id)"
                >
                  <v-switch v-model="item.status" color="success" readonly></v-switch>
                  <div class="viconinswitchon" v-if="item.status == 1">
                    <img src="@/assets/images/correct_switch.png" height="20px" />
                  </div>
                  <div class="viconinswitchoff" v-if="item.status == 0">
                    <img src="@/assets/images/delete_switch.png" height="24px" />
                  </div>
                </div>
              </template>
              <span>{{ $t("status") }}</span>
            </v-tooltip>
          </td>

          <td class="text-center">
            <router-link
              :to="{
              name: 'location.amend',
              query: {
                slug: item.slug
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
    allorganisation: [],
    status_id: null,
    initval: true,
    headers: [
      {
        text: "Location ID",
        align: "left",
        value: "location_id"
      },
      {
        text: "Location Name",
        align: "left",
        value: "shortname"
      },
      {
        text: "Address",
        value: "address"
      },

      {
        text: "State",
        value: "get_state_name.name"
      },
      {
        text: "City",
        value: "get_city_name.name"
      },
      {
        text: "Post Code",
        value: "postcode"
      },
      {
        text: "Country",
        value: "get_country_name.name"
      },
      {
        text: "Status",
        value: "",
        align: "center"
      },
      {
        text: "Action",
        value: "",
        align: "center"
      }
    ],
    google_icon: {
      icon_name: "location_on",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined"
    },
    search: "",
    valid: false,
    message: "",
    showStatusDialog: false,
    singleExpand: false
  }),
  mounted() {
    this.fetchSite();
  },
  methods: {
    cancelStatus() {
      this.showStatusDialog = false;
    },
    confirmStatus() {
      this.showStatusDialog = false;
      this.statusUpdate();
    },
    fetchSite() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getsite")
        .then(res => {
          this.allorganisation = res.data.data;
          this.initval = false;
        })
        .catch(err => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          console.log(" error" + err);
          this.initval = false;
        });
    },
    changeStatus(slug) {
      this.status_id = slug;
      this.showStatusDialog = true;
    },
    statusUpdate() {
      this.initval = true;
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "updatesitestatus", {
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
            this.fetchSite();
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class"
            });
            this.initval = false;
          } else {
            this.flashMessage.error({
              message: this.array_data
            });
            this.fetchSite();
          }
        })
        .catch(err => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          console.log("this error" + err);
          this.initval = false;
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

.descriptionprintdiv {
  width: 335px;
  text-align: justify;
  overflow: auto;
  text-overflow: ellipsis;
  height: 122px;
}
</style>