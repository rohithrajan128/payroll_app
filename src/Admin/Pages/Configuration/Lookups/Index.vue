<template>
  <div class="main-20">
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title class="col-md-4" :heading="$t('lookups')" :google_icon="google_icon"></page-title>
      <div class="search_item col-md-6">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-text-field dense rounded-pill density="compact" outlined rounded small v-on="on" v-model="search"
              append-icon="search" v-bind:label="$t('search')" hide-details class="srch_bar"></v-text-field>
          </template>
          <span>{{ $t("search") }}</span>
        </v-tooltip>
      </div>
      <div class="col-md-2">
        <!-- <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <router-link class="text-decoration-none" :to="{ name: 'lookups_amend' }">
            <v-btn class="btn hover_shine add_new" small v-on="on">{{ $t("add_new") }}</v-btn>
          </router-link>
        </template>
        <span>{{ $t("add_new") }}</span>
      </v-tooltip> -->
      </div>
    </div>
    <v-data-table :headers="headers" :items="lookups" :search="search" :loading="initval"
      v-bind:no-data-text="$t('no_data_available')" :footer-props="{
        'items-per-page-text': $t('rows_per_page'),
      }">
      <template v-slot:item="props">
        <tr>
          <td>{{ props.item.shortname }}</td>
          <td>{{ props.item.longname }}</td>
          <td>{{ props.item.seq }}</td>
          <td class="text-center px-0">
            <router-link small :to="{
              name: 'lookups_amend',
              query: { slug: props.item.slug },
            }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon small class="mr-2 edit_btn icon_size" v-on="on">mdi-pencil-outline</v-icon>
                </template>
                <span>{{ $t("edit") }}</span>
              </v-tooltip>
            </router-link>
            <router-link small class="mr-2" :to="{
              name: 'child_lookups',
              query: {
                slug: props.item.slug,
                parentname: props.item.shortname,
              },
            }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon class="mr-2 settings_icon icon_size" v-on="on">lnr-cog</v-icon>
                </template>
                <span>{{ $t("child_look_ups") }}</span>
              </v-tooltip>
            </router-link>
            <!-- <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  class="delete_btn icon_size"
                  v-on="on"
                  small
                  @click="deleteItem(props.item)"
                >mdi-trash-can-outline</v-icon>
              </template>
              <span>{{ $t("delete") }}</span>
            </v-tooltip> -->
          </td>
        </tr>
      </template>
    </v-data-table>
    <!-- <ConfirmDialog :show="showConfirmDialog" :cancel="cancel" :confirm="confirm" :id="delete_id"
      v-bind:title="$t('confirm')" v-bind:description="$t('delete_confirmation')" /> -->
  </div>
</template>
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
// import ConfirmDialog from "../Components/ConfirmDialog.vue";
export default {
  components: {
    PageTitle,
    // ConfirmDialog 
  },
  data: () => ({
    search: "",
    dialog: false,
    initval: true,
    lookups: [],
    showConfirmDialog: false,
    delete_id: null,
    google_icon: {
      icon_name: "library_books",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined"
    },
    message: ""
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    headers() {
      return [
        {
          text: this.$t("shortname"),
          value: "shortname"
        },
        {
          text: this.$t("section"),
          value: "longname"
        },
        {
          text: this.$t("sequence"),
          value: "seq"
        },

        {
          text: this.$t("action"),
          align: "center",
          value: "class_name"
        }
      ];
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },
  mounted() { },

  methods: {
    // cancel() {
    //   this.showConfirmDialog = false;
    // },
    // confirm(id) {
    //   this.deleteConfirm(id);
    //   this.showConfirmDialog = false;
    // },
    // deleteLookup(lookup) {
    //   axios
    //     .delete(process.env.VUE_APP_API_URL_ADMIN + "lookups/" + lookup.id)
    //     .then(res => {
    //       if (Array.isArray(res.data.message)) {
    //         this.array_data = res.data.message.toString();
    //       } else {
    //         this.array_data = res.data.message;
    //       }
    //       if (res.data.status == "E") {
    //         this.flashMessage.error({
    //           message: this.array_data,
    //           time: 4000,
    //           blockClass: "custom-block-class"
    //         });
    //       } else {
    //         this.flashMessage.success({
    //           message: this.array_data,
    //           time: 4000,
    //           blockClass: "custom-block-class"
    //         });
    //         this.initialize();
    //       }
    //     })
    //     .catch(err => {
    //       this.flashMessage.error({
    //         message: this.$t("something_went_wrong"),
    //         time: 4000,
    //         blockClass: "custom-block-class"
    //       });
    //       console.log("error", err);
    //     });
    // },

    initialize() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "lookups")
        .then(res => {
          this.initval = false;
          this.lookups = res.data.lookups;
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.initval = false;
            this.lookups = res.data.lookups;
          } else if (res.data.status == "E") {
            this.initval = false;
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class"
            });
          } else {
            this.initval = false;
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class"
            });
            console.log("error message", array_data);
          }
        })
        .catch(err => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          console.log("error", err);
          this.initval = false;
        });
    },

    // deleteItem(item) {
    //   this.delete_id = item;
    //   this.showConfirmDialog = true;
    // },
    // deleteConfirm(item) {
    //   const index = this.lookups.indexOf(item);
    //   this.deleteLookup(this.lookups[index]);
    //   this.lookups.splice(index, 1);
    // },
    // close() {
    //   this.dialog = false;
    //   setTimeout(() => {
    //     this.editedItem = Object.assign({}, this.defaultItem);
    //     this.editedIndex = -1;
    //   }, 300);
    // }
  }
};
</script>
