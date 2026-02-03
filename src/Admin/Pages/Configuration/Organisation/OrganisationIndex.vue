<template>
  <div class="main-20">
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title
        class="col-md-4"
        :heading="$t('organisation')"
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
            <!-- <router-link
            class="text-decoration-none"
            :to="{ name: 'organisation.amend' }"
            >-->
            <v-btn
              color=" btn hover_shine add_new"
              small
              @click="checkLocation"
              v-on="on"
              >{{ $t("add_new") }}</v-btn
            >
            <!-- </router-link> -->
          </template>
          <span>{{ $t("add_new") }}</span>
        </v-tooltip>
      </div>
    </div>

    <v-data-table
      :headers="headers"
      :items="allorganisation"
      :loading="initval"
      :search="search"
    >
      <template v-slot:item="props">
        <tr>
          <td>{{ props.item.shortname }}</td>
          <td v-if="props.item.logo">
            <div class="img_border_width_height">
              <img :src="envImagePath + props.item.logo" class="img_width" />
            </div>
          </td>
          <td v-else>
            <div class="img_border_width_height">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <img
                    src="@/assets/images/no-image-icon.jpg"
                    style="width: 59px; margin-left: 4px; padding: 4px"
                    v-on="on"
                  />
                </template>
                <span>{{ $t("no_image_available") }}</span>
              </v-tooltip>
            </div>
          </td>
          <td class="text-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div
                  v-on="on"
                  class="maindivforswitch d-inline-block"
                  @click="changeStatus(props.item.id)"
                >
                  <v-switch
                    v-model="props.item.status"
                    color="success"
                    readonly
                  ></v-switch>
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
                name: 'organisation.amend',
                query: {
                  slug: props.item.slug,
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
          </td>
        </tr>
      </template>
    </v-data-table>
    <ConfirmDialog
      :show="showStatusDialog"
      :cancel="cancelStatus"
      :confirm="confirmStatus"
      :primary_delete="delete_primary"
      v-bind:title="$t('confirm')"
      :create_message="confirm_message"
      :description="description_text_message"
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
    envImagePath: process.env.VUE_APP_IMAGE_PATH,

    allorganisation: [],
    initval: true,
    status_id: null,
    isDisabled: false,
    site: [],
    delete_primary: "",
    confirm_message: "",
    description_text_message: "",
    headers: [
      {
        text: "Organisation",
        align: "left",
        value: "shortname",
      },
      {
        text: "Organisation Image",
        align: "left",
        value: "shortname",
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
      icon_name: "Apartment",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
    valid: false,
    message: "",
    showStatusDialog: false,
  }),
  mounted() {
    this.fetchOrganisation();
    this.fetchLocation();
  },
  methods: {
    fetchLocation() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getactivesite")
        .then((res) => {
          this.site = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    checkLocation() {
      if (this.site.length > 0) {
        this.$router.push({
          name: "organisation.amend",
        });
      } else {
        this.showStatusDialog = true;
        this.description_text_message = this.$t(
          "you_are_not_craeted_any_location"
        );
        this.confirm_message = this.$t("go_to_location");
        this.delete_primary = "Primary";
      }
    },
    confirmStatus() {
      this.showStatusDialog = false;
      if (this.site.length == 0) {
        return this.$router.push({
          name: "location.amend",
        });
      }
      this.statusUpdate();
    },
    cancelStatus() {
      this.showStatusDialog = false;
    },

    fetchOrganisation() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getorganisation")
        .then((res) => {
          this.allorganisation = res.data.data;
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
    changeStatus(id) {
      this.status_id = id;
      this.description_text_message = this.$t("status_change");
      this.showStatusDialog = true;
    },
    statusUpdate() {
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "updateorganisationstatus", {
          id: this.status_id,
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

            this.fetchOrganisation();
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
            this.fetchOrganisation();
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log("this error" + err);
          this.initval = false;
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
.img_width {
  width: 66px;
  padding: 1px;
}
.img_border_width_height {
  border: 1px solid black;
  width: 69px;
  height: 59px;
}
</style>