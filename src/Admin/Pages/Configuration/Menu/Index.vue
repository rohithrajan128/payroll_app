<template>
  <div>
    
      <div flat color="white" class="row py-5 pl-5 align-items-center">
        <page-title class="col-md-4" :heading="$t('menus')" :google_icon="google_icon"></page-title>
        <div class="search_item col-md-6">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-text-field
            rounded-pill
           density="compact"
		   outlined
		   rounded
           dense
              elevation="24"
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
        <v-tooltip bottom >
          <template v-slot:activator="{ on }">
            <router-link :to="{ name: 'menu_amend' }" >
              <v-btn small class="mb-2 hover_shine add_new" v-on="on">{{
                $t("add_new")
              }}</v-btn>
            </router-link>
          </template>
          <span>{{ $t("add_new") }}</span>
        </v-tooltip>
      </div>
      </div>
      <v-data-table
        :headers="headers"
        :items="menu"
        :search="search"
        :loading="initval"
        v-bind:no-data-text="$t('no_data_available')"
        :footer-props="{
          'items-per-page-text': $t('rows_per_page'),
        }"
      >
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.title }}</td>
            <td>{{ props.item.href }}</td>
            <td>{{ props.item.parent_name }}</td>
            <td>{{ props.item.seq }}</td>

            <td class="px-0 text-center">
              <router-link
                :to="{ name: 'menu_amend', query: { slug: props.item.slug } }"
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      plain
                      v-on="on"
                      dense
                      class="mr-2 edit_btn icon_size"
                      >mdi-pencil-outline</v-icon
                    >
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
                    @click="deleteItem(props.item)"
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
  components: { PageTitle, ConfirmDialog },
  data: () => ({
    showConfirmDialog: false,
    search: "",
    dialog: false,
    menu: [],
    initval: true,
    message: "",
    delete_id: null,
    google_icon: {
      icon_name: "menu",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    headers() {
      return [
        {
          text: this.$t("title"),
          align: "left",
          sortable: true,
          value: "title",
        },
        {
          text: this.$t("link"),
          value: "href",
        },
        {
          text: this.$t("parent"),
          value: "parent_name",
        },
        {
          text: this.$t("sequence"),
          value: "seq",
        },
        {
          text: this.$t("action"),
          value: "name",
          align: "center",
          sortable: false,
        },
      ];
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.initialize();
  },
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
    deleteItem(menu_id) {
      this.delete_id = menu_id;
      this.showConfirmDialog = true;
    },
    deleteConfirm(item) {
      const index = this.menu.indexOf(item);
      this.deleteMenu(this.menu[index]);
      this.menu.splice(index, 1);
    },
    deleteMenu(menu) {
      this.initval = true;
      axios
        .delete(process.env.VUE_APP_API_URL_ADMIN + "menu/" + menu.id)
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "E") {
            this.initval = false;
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
          } else {
            this.initval = false;
            this.flashMessage.success({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
          }
        })
        .catch((err) => {
          this.initval = false;
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(err);
        });
    },

    initialize() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "menu")
        .then((res) => {
          this.menu = res.data.menu;
          this.initval = false;
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(err);
          this.initval = false;
        });
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
  },
};
</script>
<style scoped>
</style>
