<template>
  <div>
   
      <div flat color="white" class="row py-5 pl-5 align-items-center">
    <page-title class="col-md-4" :heading="$t('role')" :google_icon="google_icon"></page-title>
<div class="col-md-6">
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
          <v-text-field
          dense
           density="compact"
            v-on="on"
            outlined
            v-model="search"
            append-icon="search"
            label="Search"
            class="srch_bar"
            rounded
           small
            hide-details
            rounded-pill
          ></v-text-field>
        
        </template>
          <span>{{ $t("search") }}</span>
        </v-tooltip>
</div>
        
      <div class="col-md-2">

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <router-link :to="{ name: 'roles_amend' }">
              <v-btn
                x-small
                class="btn mr-2 mb-2 hover_shine add_new"
                small
                v-on="on"
                >{{ $t("add_new") }}</v-btn
              >
              <!-- <v-btn color="primary" class="mb-2"> </v-btn> -->
            </router-link>
          </template>
          <span>{{ $t("add_new") }}</span>
        </v-tooltip>

      </div>

       
      </div>
      <v-data-table
        :headers="headers"
        :items="roles"
        :search="search"
        :loading="initval"
        v-bind:no-data-text="$t('no_data_available')"
        :footer-props="{
          'items-per-page-text': $t('rows_per_page'),
        }"
      >
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.rolename }}</td>
            <td>{{ props.item.roledescription }}</td>
            <td class="text-center px-0">
              <router-link
                small
                class="mr-2"
                :to="{ name: 'roles_amend', query: { slug: props.item.slug } }"
              >
                <!-- <i class="material-icons">edit</i> -->
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon class="mr-2 edit_btn icon_size" v-on="on"
                      >mdi-pencil-outline</v-icon
                    >
                  </template>
                  <span>{{ $t("edit") }}</span>
                </v-tooltip>
              </router-link>
              <router-link
                class="mr-2"
                :to="{
                  name: 'roles_menu',
                  query: {
                    slug: props.item.slug,
                    id: props.item.id,
                    name: props.item.rolename,
                  },
                }"
              >
                <!-- <i class="material-icons">edit</i> -->
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon class="mr-2 settings_icon icon_size" v-on="on"
                      >lnr-cog</v-icon
                    >
                  </template>
                  <span>{{ $t("assign_menus_role") }}</span>
                </v-tooltip>
              </router-link>
            </td>
          </tr>
        </template>
      </v-data-table>
   
  </div>
</template>

<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
export default {
  components: { PageTitle },
  data: () => ({
    search: "",
    dialog: false,
    initval: true,
    google_icon: {
      icon_name: "manage_accounts",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    roles: [],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    headers() {
      return [
        {
          text: this.$t("name"),
          value: "rolename",
        },
        {
          text: this.$t("description"),
          value: "roledescription",
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
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.initialize();
  },
  mounted() {},

  methods: {
    deleteRole(role) {
      axios
        .delete(process.env.VUE_APP_API_URL_ADMIN + "roles/" + role.id)
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
          console.log("error", err);
        });
    },

    initialize() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "roles")
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.roles = res.data.role;
            this.initval = false;
          } else if (res.data.status == "E") {
            this.initval = false;
          } else {
            this.flashMessage.error({
              message: this.array_data,
            });
            this.initval = false;
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

    deleteItem(item) {
      const index = this.roles.indexOf(item);
      if (confirm(this.$t("delete_confirmation"))) {
        this.deleteRole(this.roles[index]);
        this.roles.splice(index, 1);
      }
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
