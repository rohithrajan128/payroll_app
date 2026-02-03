<template>
  <v-card>
    <v-app-bar flat color="white app_bar">
      <div class="w-100 h-100 py-5">

        <div class="row my-4 justify-space-between">
          <v-toolbar-title class="mb-5 col-md-4">
            {{ this.$route.query.parentname }} ({{ $t("values") }})
          </v-toolbar-title>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-text-field dense rounded-pill density="compact" outlined rounded small v-on="on" v-model="search"
                append-icon="search" v-bind:label="$t('search')" hide-details class="srch_bar col-md-6"></v-text-field>
            </template>
            <span>{{ $t("search") }}</span>
          </v-tooltip>

          <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
          <v-form ref="form" class="col-md-3" v-model="valid">
            <v-dialog v-model="dialog" max-width="900px">
              <template v-slot:activator="{ on: dialog }">
                <v-tooltip bottom>
                  <template #activator="{ on: tooltip }">
                    <v-btn v-on="{ ...tooltip }" small @click="$router.go(-1)" class="ma-1 font-weight-bold cancel-btn"
                      color="dark cancel_button">{{ $t("cancel") }}</v-btn>
                  </template>
                  <span>{{ $t("cancel") }}</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template #activator="{ on: tooltip }">
                    <v-btn small class="btn mr-2  hover_shine add_new" v-on="{ ...tooltip, ...dialog }"
                      v-on:click="incrementseq()">{{ $t("add_new") }}</v-btn>
                  </template>
                  <span>{{ $t("add_new") }}</span>
                </v-tooltip>
              </template>

              <v-card>
                <v-toolbar color="primary" dark>
                  <span class="headline">{{
                    $t("create_child_lookup")
                  }}</span>
                  <v-spacer></v-spacer>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon @click="close" class="dialogcloseinuserdetails" v-on="on">mdi-close</v-icon>
                    </template>
                    <span>{{ $t("close") }}</span>
                  </v-tooltip>
                </v-toolbar>
                <v-alert v-model="save_error" :text="save_error" color="error" icon="warning" outlined dismissible>
                  {{ valertdialogmessage }}</v-alert>
                <v-card-text class="mt-5">
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm6 md4 pl-2>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-text-field v-on="on" v-model="editedItem.shortname" :rules="fieldRules" 
                              v-bind:label="$t('shortname')" outlined class="required_field"></v-text-field>
                          </template>
                          <span>{{ $t("shortname") }}</span>
                        </v-tooltip>
                      </v-flex>
                      <v-flex xs12 sm6 md4 pl-2>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-text-field v-on="on" v-model="editedItem.longname" :rules="fieldRules"
                              v-bind:label="$t('longname')" outlined class="required_field"></v-text-field>
                          </template>
                          <span>{{ $t("longname") }}</span>
                        </v-tooltip>
                      </v-flex>
                      <v-flex xs12 sm6 md4 pl-2>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-text-field v-on="on" v-model="editedItem.seq" :rules="fieldRules"
                              v-bind:label="$t('sequence')" outlined class="required_field"></v-text-field>
                          </template>
                          <span>{{ $t("sequence") }}</span>
                        </v-tooltip>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <div v-on="on" class="d-inline-block mr-2">
                        <v-btn v-on="on" small @click="close" class="ma-1 font-weight-bold cancel-btn"
                          color="dark cancel_button">{{ $t("cancel") }}</v-btn>
                      </div>
                    </template>
                    <span>{{ $t("cancel") }}</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <div v-on="on" class="d-inline-block">
                        <v-btn :disabled="isDisabled" @click="save" small class="mr-2 success hover_shine"
                          color="green darken-1">
                          {{ $t("submit") }}
                          <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
                        </v-btn>
                      </div>
                    </template>
                    <span>{{ $t("submit") }}</span>
                  </v-tooltip>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-form>
        </div>
      </div>
    </v-app-bar>
    <v-data-table :headers="headers" :items="lookups" :search="search" :loading="initval"
      v-bind:no-data-text="$t('no_data_available')" :footer-props="{
        'items-per-page-text': $t('rows_per_page'),
      }">
      <template v-slot:item="props">
        <tr>
          <td>{{ props.item.shortname }}</td>
          <td>{{ props.item.longname }}</td>
          <td>{{ props.item.seq }}</td>
          <td class="justify-center layout px-0">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" small class="mr-2 edit_btn icon_size"
                  @click="editItem(props.item)">mdi-pencil-outline</v-icon>
              </template>
              <span>{{ $t("edit") }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" class="delete_btn icon_size"
                  @click="deleteItem(props.item)">mdi-trash-can-outline</v-icon>
              </template>
              <span>{{ $t("delete") }}</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
    </v-data-table>
    <div class="d-block text-right card-footer"></div>
    <ConfirmDialog :show="showConfirmDialog" :cancel="cancel" :confirm="confirm" :id="delete_id"
      v-bind:title="$t('confirm')" v-bind:description="$t('delete_confirmation')" />
  </v-card>
</template>

<script>
import VueElementLoading from "vue-element-loading";
import ConfirmDialog from "../Components/ConfirmDialog.vue";

export default {
  components: {
    VueElementLoading,
    ConfirmDialog,
  },
  data: () => ({
    valertdialogmessage: "",
    save_error: false,
    aws_url: process.env.MIX_AWS_URL,
    valid: true,
    message: "",
    initval: true,
    search: "",
    dialog: false,
    isBtnLoading: false,
    isDisabled: false,
    loader: false,
    showConfirmDialog: false,
    delete_id: null,
    lookups: [],
    label: "Icon",
    editedItem: {
      id: 0,
      shortname: "",
      longname: "",
      seq: "",
      icon: "",
      slug: "",
      parent_id: "",
    },
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
          text: this.$t("shortname"),
          value: "shortname",
        },
        {
          text: this.$t("section"),
          value: "longname",
        },
        {
          text: this.$t("sequence"),
          value: "seq",
        },
        // {
        //   text: this.$t("icon"),
        //   value: "icon",
        // },

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
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.initialize();
        }
      },
    },
  },
  mounted() { },

  methods: {
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm(id) {
      this.deleteConfirm(id);
      this.showConfirmDialog = false;
    },
    incrementseq: function () {
      var max_seq = Math.max.apply(
        Math,
        this.lookups.map(function (o) {
          return o.seq;
        })
      );
      var newval = max_seq > 0 ? max_seq + 1 : 1;
      this.editedItem.seq = newval;
      this.isDisabled = false;
    },
    deleteItem(lookup) {
      this.delete_id = lookup;
      this.showConfirmDialog = true;
    },
    deleteConfirm(item) {
      const index = this.lookups.indexOf(item);
      this.deleteChildLookup(this.lookups[index]);
      this.lookups.splice(index, 1);
    },
    deleteChildLookup(lookup) {
      axios
        .delete(process.env.VUE_APP_API_URL_ADMIN + "lookups/" + lookup.id)
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
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
          "lookupdata/" +
          this.$route.query.parentname
        )
        .then((res) => {
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
              blockClass: "custom-block-class",
            });
          } else {
            this.initval = false;
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

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    editItem(item) {
      this.isDisabled = false;
      this.editedIndex = this.lookups.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    save() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        this.editedItem.slug = this.$route.query.slug;
        if (this.editedIndex > -1) {
          axios
            .patch(
              process.env.VUE_APP_API_URL_ADMIN +
              "lookups/" +
              this.editedItem.id,
              this.editedItem
            )
            .then((res) => {
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "E") {
                this.valertdialogmessage = response.data.message;
                this.save_error = true;
                this.isDisabled = false;
                this.isBtnLoading = false;
              } else {
                this.valertdialogmessage = response.data.message;
                this.save_error = true;
                this.isBtnLoading = false;
                this.initialize();
                this.$refs.form.reset();
              }
            })
            .catch((err) => {
              this.valertdialogmessage = response.data.message;
              this.save_error = true;
              this.isBtnLoading = false;
              console.log("error", err);
            });
        } else {
          axios
            .post(
              process.env.VUE_APP_API_URL_ADMIN + "lookups",
              this.editedItem
            )
            .then((res) => {
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "E") {
                this.valertdialogmessage = response.data.message;
                this.save_error = true;
                this.isBtnLoading = false;
                this.isDisabled = false;
              } else if (res.data.status = 'S') {
                this.flashMessage.success({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class",
                });
                this.isBtnLoading = false;
                this.initialize();
                this.$refs.form.reset();
              } else {
                this.valertdialogmessage = this.$t("something_went_wrong");
                this.save_error = true;
                this.isBtnLoading = false;
                this.isDisabled = false;
              }
            })
            .catch((err) => {
              this.valertdialogmessage = this.$t("something_went_wrong");
              this.save_error = true;
              this.isBtnLoading = false;
              console.log("error", err);
            });
        }
        this.close();
      }
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
</style>