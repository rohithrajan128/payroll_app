<template>
  <div class="main-20">
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title
        class="col-md-4"
        :heading="$t('designation')"
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
              v-bind:label="$t('search')"
              hide-details
              class="srch_bar"
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
              :to="{ name: 'designation_amend' }"
            >
              <v-btn
                class="btn mr-2 mb-2 hover_shine add_new"
                small
                v-on="on"
                >{{ $t("add_new") }}</v-btn
              >
            </router-link>
          </template>
          <span>{{ $t("add_new") }}</span>
        </v-tooltip>
      </div>
    </div>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="designation_details"
        :search="search"
        :loading="initval"
        v-bind:no-data-text="$t('no_data_available')"
        :footer-props="{
          'items-per-page-text': $t('rows_per_page'),
        }"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.designation }}</td>

            <td v-if="item.level_details">{{ item.level_details.level }}</td>
            <td v-else>{{ $t("not_appllicable") }}</td>
            <td>
              <v-tooltip
                bottom
                v-if="item.designation_description"
                max-width="370"
                color="white"
              >
                <template v-slot:activator="{ on }">
                  <div class="description_hover_div" v-on="on">
                    {{ item.designation_description }}
                  </div>
                </template>
                <v-sheet class="pa-4 b">{{
                  item.designation_description
                }}</v-sheet>
              </v-tooltip>
              <span v-else>{{ $t("not_appllicable") }}</span>
            </td>

            <td class="px-0">
              <router-link
                small
                :to="{
                  name: 'designation_amend',
                  query: { slug: item.slug },
                }"
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon small class="mr-2 edit_btn icon_size" v-on="on"
                      >mdi-pencil-outline</v-icon
                    >
                  </template>
                  <span>{{ $t("edit") }}</span>
                </v-tooltip>
              </router-link>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    class="delete_btn icon_size"
                    @click="deleteItem(item)"
                    >mdi-trash-can-outline</v-icon
                  >
                </template>
                <span>{{ $t("delete") }}</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
      <div class="d-block text-right card-footer"></div>
      <ConfirmDialog
        :show="showConfirmDialog"
        :cancel="cancel"
        :confirm="confirm"
        :id="delete_id"
        v-bind:title="$t('confirm')"
        v-bind:description="$t('delete_confirmation')"
      />
    </v-card>
  </div>
</template>
  
  <script>
import VueElementLoading from "vue-element-loading";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import PageTitle from "../../../../Layout/Components/PageTitle.vue";

export default {
  components: {
    VueElementLoading,
    ConfirmDialog,
    PageTitle,
  },
  data: () => ({
    valid: true,
    message: "",
    initval: true,
    search: "",
    loader: false,
    expanded: [],
    singleExpand: false,
    showConfirmDialog: false,
    delete_id: null,
    designation_details: [],
    user: "",
    google_icon: {
      icon_name: "library_books",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    label: "Icon",
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    headers() {
      return [
        {
          text: this.$t("designation"),
          value: "designation",
        },
        {
          text: this.$t("level"),
          value: "level_id",
        },
        {
          text: this.$t("description"),
          value: "designation_description",
        },
        {
          text: this.$t("action"),
          align: "start",
          value: "class_name",
        },
        {
          text: "",
        },
      ];
    },
  },

  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.initialize();
  },
  methods: {
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm(id) {
      this.deleteConfirm(id);
      this.showConfirmDialog = false;
    },

    deleteItem(designation) {
      this.delete_id = designation.id;
      this.showConfirmDialog = true;
    },
    deleteConfirm(designation_id) {
      this.deleteDesignation(designation_id);
    },
    deleteDesignation(designation_id) {
      axios
        .delete(
          process.env.VUE_APP_API_URL_ADMIN + "designation/" + designation_id
        )
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
          } else {
            this.flashMessage.success({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.initialize();
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

    initialize() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "designation", {
          params: {
            site_id: this.user.hr_employee.site_id,
            org_id: this.user.hr_employee.org_id,
          },
        })
        .then((res) => {
          this.initval = false;
          if (res.data.status == "S") {
            this.initval = false;
            this.designation_details = res.data.designations_data;
          } else if (res.data.status == "E") {
            this.initval = false;
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
          } else {
            this.initval = false;
            console.log("error message", array_data);
          }
        })
        .catch((err) => {
          this.initval = false;
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log("error", err);
          this.initval = false;
        });
    },
  },
};
</script>
  <style scoped>
.app_bar {
  height: 120px !important;
}
.srch_bar {
  flex: 1 !important;
}
.description_item {
  overflow-wrap: anywhere;
}
.description_hover_div{
   width: 30vw !important;
    height: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>