<template>
  <div class="main-20">
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title
        :heading="$t('connects')"
        :google_icon="google_icon"
      ></page-title>
      <v-spacer></v-spacer>
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
      <v-spacer></v-spacer>
      <div class="col-md-2">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <router-link
              class="text-decoration-none"
              :to="{
                name: 'candidate_connect_amend',
              }"
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

    <v-data-table
      :headers="headers"
      :items="connect"
      :search="search"
      :loading="initval"
      :single-expand="singleExpand"
      item-key="id"
      v-bind:no-data-text="$t('no_data_available')"
      :footer-props="{
        'items-per-page-text': $t('rows_per_page'),
      }"
    >
    <template v-slot:item="{ item, expand, isExpanded }">
        <tr>
          <td style="max-width: 260px">
            <v-tooltip bottom v-if="item.business_name">
              <template v-slot:activator="{ on }"
                ><span v-on="on">
                  <router-link
                    small
                    :to="{
                      name: 'candidate_connect_view',
                      query: { id: item.id },
                    }"
                  >
                    {{ item.company_alias_name }}
                  </router-link></span
                >
              </template>
              <span>{{ $t("view") }}</span>
            </v-tooltip>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <span v-if="item.connect_type">{{ item.connect_type }}</span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <span v-if="item.contact_number">
              <span v-if="item.contact_number_code"
                >+ {{ item.contact_number_code }}</span
              >
              {{ item.contact_number }}
            </span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <span v-if="item.contact_no">
              <span v-if="item.contact_no_code"
                >+ {{ item.contact_no_code }}</span
              >
              {{ item.contact_no }}
            </span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td style="max-width: 280px">
            <div v-if="JSON.parse(item.service_offered).length > 0">
              <div
                v-if="
                  JSON.parse(item.service_offered).length > 2 &&
                  JSON.parse(item.service_offered).length != 3
                "
              >
                <span
                  v-for="(service, i) in JSON.parse(item.service_offered)"
                  :key="i"
                >
                  <v-chip
                    v-if="i < 2"
                    class="mr-1"
                    variant="outlined"
                    color="primary"
                    x-small
                  >
                    {{ service }}
                  </v-chip>
                </span>
                <v-chip
                  class="mr-1"
                  variant="outlined"
                  color="success"
                  v-bind:class="[isExpanded ? 'warning' : 'success']"
                  x-small
                  style="cursor: pointer"
                  @click="expand(!isExpanded)"
                >
                  <span v-if="!isExpanded"
                    >+ {{ JSON.parse(item.service_offered).length - 2 }} more
                    <v-icon x-small>mdi-arrow-down-drop-circle-outline</v-icon>
                  </span>
                  <span v-else
                    >{{ $t("hide") }}
                    <v-icon x-small
                      >mdi-arrow-up-drop-circle-outline</v-icon
                    ></span
                  >
                </v-chip>
              </div>
              <div v-else>
                <v-chip
                  v-for="(service, i) in JSON.parse(item.service_offered)"
                  :key="i"
                  class="mr-1"
                  variant="outlined"
                  color="primary"
                  x-small
                >
                  {{ service }}
                </v-chip>
              </div>
              <div v-if="JSON.parse(item.service_offered).length == 3">
                <span
                  v-for="(services, j) in JSON.parse(item.service_offered)"
                  :key="j"
                >
                  <v-chip
                    v-if="j < 3"
                    class="mr-1"
                    variant="outlined"
                    color="primary"
                    x-small
                  >
                    {{ services }}
                  </v-chip>
                </span>
              </div>
            </div>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td class="px-0 text-center">
            <router-link
              small
              :to="{
                name: 'candidate_connect_amend',
                query: { id: item.id },
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
                  @click="deleteItem(item.id)"
                  >mdi-trash-can-outline</v-icon
                >
              </template>
              <span>{{ $t("delete") }}</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <tr>
          <td :colspan="headers.length + 1" class="p-0">
            <div class="row pa-6">
              <div v-if="item.service_offered">
                <span v-if="JSON.parse(item.service_offered).length > 0">
                  <v-chip
                    v-for="(service, i) in JSON.parse(item.service_offered)"
                    :key="i"
                    class="mr-1"
                    variant="outlined"
                    color="primary"
                    x-small
                  >
                    {{ service }}
                  </v-chip>
                </span>
              </div>
            </div>
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
  </div>
</template>
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
export default {
  components: { PageTitle, ConfirmDialog },
  data: () => ({
    search: "",
    expanded: [],
    initval: false,
    connect: [],
    showConfirmDialog: false,
    delete_id: null,
    singleExpand: false,
    google_icon: {
      icon_name: "contacts",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    message: "",
  }),

  computed: {
    headers() {
      return [
        {
          text: this.$t("company_name"),
          value: "business_name",
          align: "left",
        },
        {
          text: this.$t("connect_type"),
          value: "connect_type",
        },
        {
          text: this.$t("primary_contact_no"),
          value: "contact_number",
        },
        {
          text: this.$t("company_contact_no"),
          value: "contact_no",
        },
        {
          text: this.$t("service_offered"),
          value: "service_offered",
        },

        {
          text: this.$t("action"),
          align: "center",
          value: "class_name",
        },
      ];
    },
  },

  created() {
    this.fetchConnect();
  },
  methods: {
    deleteItem(id) {
      this.delete_id = id;
      this.showConfirmDialog = true;
    },
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm(id) {
      this.initval = true;
      this.deleteContact(id);
      this.showConfirmDialog = false;
    },
    deleteContact(id) {
      axios
        .delete(
          process.env.VUE_APP_API_URL_ADMIN + "delete_recruitment_connect/" + id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.flashMessage.success({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.fetchConnect();
          } else {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log("error", err);
        });
    },

    fetchConnect() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_recruitment_connect")
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.initval = false;
            this.connect = res.data.connect;
          } else if (res.data.status == "E") {
            this.initval = false;
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
          } else {
            this.initval = false;
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
            console.log("error message", array_data);
          }
        })
        .catch((err) => {
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
<style scoped></style>
