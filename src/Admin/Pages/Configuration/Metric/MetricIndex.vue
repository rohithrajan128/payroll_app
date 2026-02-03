<template>
  <div class="main-20">
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title class="col-md-4" :heading="$t('metric')" :google_icon="google_icon"></page-title>

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
              :to="{ name: 'metric_amend' }"
              style="color: white"
            >
              <v-btn color=" btn hover_shine add_new" small class v-on="on">
                {{
                $t("add_new")
                }}
              </v-btn>
            </router-link>
          </template>
          <span>{{ $t("add_new") }}</span>
        </v-tooltip>
      </div>
    </div>
    <v-data-table
      :headers="headers"
      :items="metric"
      :search="search"
      :loading="initval"
      :single-expand="singleExpand"
      item-key="id"
    >
      <template v-slot:item="{ item, expand, isExpanded }">
        <tr>
          <td>{{ item.short_name }}</td>
          <td class="param-value">{{ item.long_name }}</td>
          <td class="text-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <!-- <div v-on="on" class="d-inline-block min_width">
                  <v-btn
                    x-small
                    v-on="on"
                    :disabled="isDisabled"
                    class="hover_shine"
                    @click="updateMetricStatus(item.id)"
                    small
                    v-bind:class="[
                                            item.active == 1 ? 'success' : 'warning',
                                        ]"
                  >
                    <span v-if="item.active == 1">{{ $t("active") }}</span>
                    <span v-if="item.active == 0">{{ $t("inactive") }}</span>
                  </v-btn>
                </div> -->
                <div v-on="on" class="maindivforswitch d-inline-block" @click="updateMetricStatus(item.id)">
                  <v-switch v-model="item.active" color="success" readonly>
                  </v-switch>
                  <div class="viconinswitchon" v-if="item.active == 1">
                    <img src="@/assets/images/correct_switch.png" height="20px">
                  </div>
                  <div class="viconinswitchoff" v-if="item.active == 0">
                    <img src="@/assets/images/delete_switch.png" height="24px">
                  </div>
                </div>
              </template>
              <span>{{ $t("status") }}</span>
            </v-tooltip>
          </td>
          <td class="text-center px-0">
            <router-link
              :to="{
                            name: 'metric_amend',
                            query: { slug: item.slug },
                        }"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" small class="mr-2 edit_btn icon_size">mdi-pencil-outline</v-icon>
                </template>
                <span>{{ $t("edit") }}</span>
              </v-tooltip>
            </router-link>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  class="delete_btn icon_size"
                  v-on="on"
                  dense
                  @click="deleteItem(item.id)"
                >mdi-trash-can-outline</v-icon>
              </template>
              <span>{{ $t("delete") }}</span>
            </v-tooltip>
          </td>
          <td @click="expand(!isExpanded)">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn icon v-if="isExpanded == false" v-on="on">
                  <v-icon>mdi-arrow-down-drop-circle-outline</v-icon>
                </v-btn>
                <v-btn icon v-else>
                  <v-icon>mdi-arrow-up-drop-circle-outline</v-icon>
                </v-btn>
              </template>
              <span>{{ $t("show_metric_values") }}</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <tr>
          <td :colspan="headers.length" class="p-0">
            <v-simple-table
              class="simpletableformetric"
              v-if="item.metric_value_relation.length != 0"
            >
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      <b class="simpledatatableheader">{{ $t("metric_value") }}</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="val in item.metric_value_relation" :key="val">
                    <td>
                      <b class="simpledatatablebody">{{ val.metric_value }}</b>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <div v-else>
              <p class="nometricvalues">{{ $t('no_metric_values') }}</p>
            </div>
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
    <ConfirmDialog
      :show="showConfirmDialog"
      :cancel="canceldelete"
      :confirm="confirmDelete"
      :id="delete_id"
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
    metric: [],
    showConfirmDialog: false,
    showStatusDialog: false,
    status_id: null,
    isDisabled: false,
    delete_id: "",
    initval: false,
    singleExpand: false,
    headers: [
      {
        text: "Short Name",
        align: "left",
        value: "short_name"
      },
      {
        text: "Long Name",
        value: "long_name"
      },
      {
        text: "Status",
        align: "center",
        value: "status",
        sortable:false
      },
      {
        text: "Actions",
        value: "name",
        align: "center",
        sortable: false
      },
      {
        text: "",
        align: "center",
        sortable: false
      }
    ],
    google_icon: {
      icon_name: "bar_chart",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined"
    },
    search: "",
    valid_error: false,
    valid_success: false,
    successmessage: "",
    valid: false,
    message: ""
  }),
  mounted() {
    this.fetchMetrics();
  },
  methods: {
    canceldelete() {
      this.showConfirmDialog = false;
    },
    deleteItem(id) {
      this.delete_id = id;
      this.showConfirmDialog = true;
    },
    cancelStatus() {
      this.showStatusDialog = false;
    },
    confirmStatus() {
      this.statusUpdate();
      this.showStatusDialog = false;
    },
    confirmDelete() {
      this.initval = true;
      this.showConfirmDialog = false;
      axios
        .delete(
          process.env.VUE_APP_API_URL_ADMIN +
            "deletemetricparent/" +
            this.delete_id
        )
        .then(res => {
          if (res.data.status == "S") {
            this.initval = false;
            this.fetchMetrics();
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
    },
    fetchMetrics() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getallmetric")
        .then(res => {
          this.metric = res.data.data;
          this.initval = false;
        })
        .catch(err => {
          this.initval = false;
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          console.log(" error" + err);
        });
    },

    updateMetricStatus(id) {
      this.status_id = id;
      this.showStatusDialog = true;
    },
    statusUpdate() {
      this.initval = true;
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "updateMetricStatus", {
          id: this.status_id
        })
        .then(res => {
          if (res.data.status == "S") {
            this.initval = false;
            this.flashMessage.success({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class"
            });
            this.fetchMetrics();
          } else {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class"
            });
            this.initval = false;
          }
        })
        .catch(err => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          this.initval = false;
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

.v-btn:not(.v-btn--round).v-size--small {
  min-width: 90px !important;
}

.simpledatatablebody {
  font-size: 11px;
  font-weight: 500;
}

.simpledatatableheader {
  font-weight: bolder;
  font-size: 13px;
}

.simpletableformetric /deep/ .v-data-table__wrapper {
  background-color: rgb(245, 245, 245);
}

.nometricvalues {
  text-align: center;
  font-weight: bolder;
  font-size: 14px;
  color: rgb(134, 131, 131);
  margin-top: 18px;
}
</style>