<template>
  <div class="main-20">
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title class="col-md-4" :heading="$t('sytem_parameter')" :google_icon="google_icon"></page-title>
      <div class="search_item col-md-6">
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
            :to="{ name: 'system_parameter_amend' }"
          >
            <v-btn
              color=" btn hover_shine add_new"
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
      :items="systemparameter"
      :search="search"
      :loading="initval"
    >
      <template v-slot:item="props">
        <tr>
          <td>{{ props.item.parameter_name }}</td>
          <td class="param-value">{{ props.item.parameter_value }}</td>
          <td>{{ props.item.description }}</td>
          <td class="text-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <!-- <div v-on="on" class="d-inline-block min_width">
                  <v-btn
                    x-small
                    v-on="on"
                    :disabled="isDisabled"
                    class="hover_shine"
                    @click="updateSystemParameteStatus(props.item.id)"
                    small
                    v-bind:class="[
                      props.item.status == 1 ? 'success' : 'warning',
                    ]"
                  >
                    <span v-if="props.item.status == 1">{{ $t("active") }}</span>
                    <span v-if="props.item.status == 0">{{ $t("inactive") }}</span>
                  </v-btn>
                </div> -->
                <div v-on="on" class="maindivforswitch d-inline-block" @click="updateSystemParameteStatus(props.item.id)">
                  <v-switch v-model="props.item.status" color="success" readonly>
                  </v-switch>
                  <div class="viconinswitchon" v-if="props.item.status == 1">
                    <img src="@/assets/images/correct_switch.png" height="20px">
                  </div>
                  <div class="viconinswitchoff" v-if="props.item.status == 0">
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
                name: 'system_parameter_amend',
                query: { slug: props.item.slug },
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
                  small
                  @click="deleteItem(props.item.id)"
                >mdi-trash-can-outline</v-icon>
              </template>
              <span>{{ $t("delete") }}</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
    </v-data-table>
    <ConfirmDialog
      :show="showConfirmDialog"
      :cancel="cancel"
      :confirm="confirm"
      :id="delete_id"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('delete_confirmation')"
    />
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
    systemparameter: [],
    showConfirmDialog: false,
    showStatusDialog: false,
    delete_id: null,
    status_id: null,
    isDisabled: false,
    initval: false,

    headers: [
      {
        text: "Name",
        align: "left",
        sortable: false,
        value: "parameter_name"
      },
      {
        text: "Value",
        value: "parameter_value"
      },
      {
        text: "Description",
        value: "description"
      },
      {
        text: "Status",
        align: "center",
        value: "status"
      },
      {
        text: "Actions",
        value: "name",
        align: "center",
        sortable: false
      }
    ],
    google_icon: {
      icon_name: "settings_suggest",
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
    this.fetchSystemParameters();
  },
  methods: {
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm(id) {
      this.deleteConfirm(id);
      this.showConfirmDialog = false;
    },
    cancelStatus() {
      this.showStatusDialog = false;
    },
    confirmStatus() {
      this.statusUpdate();
      this.showStatusDialog = false;
    },
    fetchSystemParameters() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getsystem_params")
        .then(res => {
          this.systemparameter = res.data.systemparameters;
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
    deleteConfirm(id) {
      this.deletesystemparameter(id);
    },
    deleteItem($id) {
      this.delete_id = $id;
      this.showConfirmDialog = true;
    },
    deletesystemparameter(id) {
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "delete_system_params/" + id)
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
            this.fetchSystemParameters();
            localStorage.removeItem("appimage");
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
          }
        })
        .catch(err => {
          this.initval = false;
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          console.log("this error" + err);
        });
    },
    updateSystemParameteStatus(id) {
      this.status_id = id;
      this.showStatusDialog = true;
    },
    statusUpdate() {
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "update_system_param_status",
          {
            id: this.status_id
          }
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
            this.fetchSystemParameters();
            this.$eventBus.$emit("app_logo");
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
            this.fetchSystemParameters();
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

.v-btn:not(.v-btn--round).v-size--small {
  min-width: 90px !important;
}
</style>