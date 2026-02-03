<template>
  <div class="main-20">
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title
        class="col-md-4"
        :heading="$t('categories')"
        :google_icon="google_icon"
      ></page-title>

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
              :to="{ name: 'categories.amend' }"
            >
              <v-btn
                color=" btn mr-2 mb-2 hover_shine add_new"
                small
                class="mb-2"
                v-on="on"
                >{{ $t("add_new") }}</v-btn
              >
            </router-link>
          </template>
          <span>{{ $t("add_new") }}</span>
        </v-tooltip>
      </div>
    </div>
    <v-data-table
      :headers="headers"
      :items="categories_array"
      :loading="initval"
      class="elevation-1"
      :search="search"
    >
      <template v-slot:item="props">
        <tr>
          <td>{{ props.item.longname }}</td>
          <!-- <td>{{ props.item.created_by }}</td> -->

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
                      props.item.status == 1 ? 'success' : 'warning',
                    ]"
                  >
                    <span
                      v-if="props.item.status == 1"
                      class="spanactivesize"
                      >{{ $t("active") }}</span
                    >
                    <span
                      v-if="props.item.status == 0"
                      class="spanactivesize"
                      >{{ $t("inactive") }}</span
                    >
                  </v-btn>
                </div> -->
                <div
                  v-on="on"
                  class="maindivforswitch d-inline-block"
                  @click="changeStatus(props.item.slug)"
                >
                  <v-switch v-model="props.item.status" color="success" readonly>
                  </v-switch>
                  <div class="viconinswitchon" v-if="props.item.status == 1">
                    <img
                      src="@/assets/images/correct_switch.png"
                      height="20px"
                    />
                  </div>
                  <div class="viconinswitchoff" v-if="props.item.status == 0">
                    <img
                      src="@/assets/images/delete_switch.png"
                      height="24px"
                    />
                  </div>
                </div>
              </template>
              <span>{{ $t("status") }}</span>
            </v-tooltip>
          </td>
          <td class="text-center">
            <router-link
              :to="{
                name: 'categories.amend',
                query: {
                  slug: props.item.slug,
                  pathname: 'categories.amend',
                },
              }"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon class="mr-2 edit_btn icon_size" v-on="on"
                    >mdi-pencil-outline</v-icon
                  >
                </template>
                <span>{{ $t("edit") }}</span>
              </v-tooltip>
            </router-link>

            <v-tooltip bottom v-if="user.rolename == 'SuperUser'">
              <template v-slot:activator="{ on }">
                <v-icon
                  class="mr-2 delete_btn icon_size"
                  v-on="on"
                  small
                  @click="deleteItem(props.item.id)"
                  >mdi-trash-can-outline</v-icon
                >
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
    ConfirmDialog,
  },
  data: () => ({
    categories_array: [],
    showConfirmDialog: false,
    initval: false,
    delete_id: null,
    status_id: null,
    isDisabled: false,
    headers: [
      {
        text: "Categories",
        align: "left",
        value: "longname",
      },

      {
        text: "Status",
        value: "status",
        align: "center",
      },
      {
        text: "Actions",
        value: "name",
        align: "center",
      },
    ],
    google_icon: {
      icon_name: "important_devices",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
    valid: false,
    message: "",
    showStatusDialog: false,
  }),
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.fetchasset();
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
          process.env.VUE_APP_API_URL_ADMIN + "deleteasset/" + this.delete_id
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
            this.initval = true;
            this.fetchasset();
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

            this.fetchasset();
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

    cancelStatus() {
      this.showStatusDialog = false;
    },
    confirmStatus() {
      this.statusUpdate();
      this.showStatusDialog = false;
    },
    fetchasset() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "get_all_categories")
        .then((res) => {
          this.categories_array = res.data.categories;
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
    changeStatus(slug) {
      this.status_id = slug;
      this.showStatusDialog = true;
    },
    statusUpdate() {
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "updateassetstatus", {
          slug: this.status_id,
        })
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
            this.initval = true;
            this.fetchasset();
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.initval = true;
          } else {
            this.flashMessage.error({
              message: this.array_data,
            });
            this.initval = true;
            this.fetchasset();
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
  },
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