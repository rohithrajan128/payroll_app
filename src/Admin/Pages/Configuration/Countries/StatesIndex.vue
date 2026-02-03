<template>
  <div class="main-20">
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title
        class="col-md-4"
        :heading="$t('states')"
        :google_icon="google_icon"
      ></page-title>
      <div class="col-md-5">
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

      <div class="col-md-3 d-flex">
        <v-tooltip bottom>
          <template #activator="{ on: tooltip }">
            <v-btn
              small
              class="ma-1 font-weight-bold cancel-btn"
              color="dark cancel_button"
              v-on="{ ...tooltip }"
              @click="cancelBtn()"
              >{{ $t("cancel") }}</v-btn
            >
          </template>
          <span>{{ $t("cancel") }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <router-link
              class="text-decoration-none mt-1"
              :to="{ name: 'states.amend', params: { country_id: country_id } }"
            >
              <v-btn
                color=" btn mr-2 mb-2 hover_shine add_new"
                small
                class="mb-2"
                v-on="on"
              >
                {{ $t("add_new") }}
              </v-btn></router-link
            >
          </template>
          <span>{{ $t("add_new") }}</span>
        </v-tooltip>
      </div>
    </div>
    <v-data-table
      :headers="headers"
      :items="states"
      :search="search"
      :loading="initval"
      v-bind:no-data-text="$t('no_data_available')"
      :footer-props="{
        'items-per-page-text': $t('rows_per_page'),
      }"
    >
      <template v-slot:item="props">
        <tr>
          <td>{{ props.item.name }}</td>
          <td class="justify-center align-items-center layout px-0">
            <router-link
              small
              class="mr-2"
              :to="{
                name: 'states.amend',
                query: {
                  slug: props.item.slug,
                  parentname: parent_name,
                },
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

            <router-link
              small
              class="mr-2"
              :to="{
                name: 'cities',
                params: {
                  id: props.item.id,
                  country_id: props.item.country_id,
                  parentname: props.item.name,
                  country_name: country_name,
                  action: 'add city',
                },
              }"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon small class="mr-2 settings_icon icon_size" v-on="on"
                    >lnr-cog</v-icon
                  >
                </template>
                <span>{{ $t("add_suburb") }}</span>
              </v-tooltip>
            </router-link>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  class="delete_btn icon_size"
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
    ConfirmDialog,
  },
  data: () => ({
    search: "",
    dialog: false,
    initval: true,
    parent_name: "",
    states: [],
    country_id: null,
    message: "",
    successmessage: "",
    country_name: "",
    google_icon: {
      icon_name: "apartment",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    showConfirmDialog: false,
    delete_id: null,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    headers() {
      return [
        {
          text: this.$t("name"),
          value: "name",
        },
        {
          text: this.$t("action"),
          align: "center",
          value: "class_name",
        },
      ];
    },
  },

  watch: {
    "$route.params.id": {
      immediate: true,
      handler() {
        if (this.$route.params.id) {
          this.loader = true;
          this.country_id = this.$route.params.id;
          localStorage.setItem("country_id", this.$route.params.id);
          this.parent_name = this.$route.params.parentname;
          this.country_name = this.$route.params.parentname;
          this.initialize();
        }
      },
    },
  },

  created() {},
  mounted() {
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
    deleteItem(template_id) {
      this.delete_id = template_id;
      this.showConfirmDialog = true;
    },
    initialize() {
      this.initval = true;
      this.country_id = localStorage.getItem("country_id");
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetch_states?country_id=" +
            this.country_id
        )
        .then((response) => {
          if (Array.isArray(response.data.message)) {
            this.array_data = response.data.message.toString();
          } else {
            this.array_data = response.data.message;
          }
          if (response.data.status == "S") {
            this.states = response.data.states;
            this.initval = false;
          } else if (response.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
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
          this.initval = false;
          console.log(err);
        });
    },

    deleteConfirm(id) {
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "delete_states/" + id)
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
            this.initialize();
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
    cancelBtn() {
      this.$router.push({
        name: "countries",
      });
    },
  },
};
</script>
