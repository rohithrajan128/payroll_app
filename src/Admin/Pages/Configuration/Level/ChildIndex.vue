<template>
  <v-card>
    <v-app-bar flat color="white app_bar">
      <div class="w-100 h-100 py-5">
        <v-toolbar-title class="mb-5 page-title-color">{{ this.$route.query.level_name }}</v-toolbar-title>
        <div class="row my-4 justify-space-between">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-text-field
                v-on="on"
                v-model="search"
                append-icon="search"
                v-bind:label="$t('search')"
                single-line
                hide-details
                class="srch_bar col-md-6"
              ></v-text-field>
            </template>
            <span>{{ $t("search") }}</span>
          </v-tooltip>
          <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
          <v-form ref="form" class="col-md-3" v-model="valid">
            <v-dialog v-model="designation_dialog" max-width="900px">
              <template v-slot:activator="{ on: dialog }">
                <v-tooltip bottom>
                  <template #activator="{ on: tooltip }">
                    <v-btn
                      v-on="{ ...tooltip }"
                      small
                      @click="$router.go(-1)"
                      class="ma-1 font-weight-bold cancel-btn"
                      color="dark cancel_button"
                    >{{ $t("cancel") }}</v-btn>
                  </template>
                  <span>{{ $t("cancel") }}</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template #activator="{ on: tooltip }">
                    <v-btn
                      small
                      class="btn mr-2 mb-2 hover_shine add_new"
                      v-on="{ ...tooltip, ...dialog }"
                      @click="designationDialog"
                    >{{ $t("add_new") }}</v-btn>
                  </template>
                  <span>{{ $t("add_new") }}</span>
                </v-tooltip>
              </template>

              <v-card>
                <v-toolbar color="primary" dark>
                  <span class="headline">{{ $t("assign_designation") }}</span>
                  <v-spacer></v-spacer>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon @click="close" class="dialogcloseinuserdetails" v-on="on">mdi-close</v-icon>
                    </template>
                    <span>{{ $t("close") }}</span>
                  </v-tooltip>
                </v-toolbar>
                <v-card-text class="mt-5">
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm6 md6 pl-2>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-autocomplete
                              v-bind:label="$t('designation')"
                              v-on="on"
                              index="id"
                              item-value="shortname"
                              item-text="longname"
                              :multiple="multiple_select"
                              v-model="editedItem.designation"
                              :rules="fieldRules"
                              :items="designation_array"
                              outlined
                              dense
                              class="required_field"
                            ></v-autocomplete>
                          </template>
                          <span>{{ $t("designation") }}</span>
                        </v-tooltip>
                      </v-flex>
                      <v-flex xs12 sm6 md12 pl-2>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-textarea
                              v-on="on"
                              v-model="editedItem.designation_description"
                              v-bind:label="$t('description')"
                              required
                              outlined
                              counter="600"
                              rows="2"
                              dense
                            ></v-textarea>
                          </template>
                          <span>{{ $t("description") }}</span>
                        </v-tooltip>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <div v-on="on" class="d-inline-block">
                        <v-btn
                          :disabled="isDisabled"
                          @click="save"
                          small
                          class="mr-2 success hover_shine"
                          color="green darken-1"
                        >
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
    <v-data-table
      :headers="headers"
      :items="designation_details"
      :search="search"
      :loading="initval"
      v-bind:no-data-text="$t('no_data_available')"
      :footer-props="{
        'items-per-page-text': $t('rows_per_page'),
      }"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      item-key="id"
      show-expand
    >
      <template v-slot:item="{ item, expand, isExpanded }">
        <tr>
          <td></td>
          <td>{{ item.designation }}</td>

          <td class="justify-center layout px-0">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  v-on="on"
                  small
                  class="mr-2 edit_btn icon_size"
                  @click="editItem(item)"
                >mdi-pencil-outline</v-icon>
              </template>
              <span>{{ $t("edit") }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  v-on="on"
                  class="delete_btn icon_size"
                  @click="deleteItem(item)"
                >mdi-trash-can-outline</v-icon>
              </template>
              <span>{{ $t("delete") }}</span>
            </v-tooltip>
          </td>
          <td @click="expand(!isExpanded)">
            <v-btn icon v-if="isExpanded == false">
              <v-icon>mdi-arrow-down-drop-circle-outline</v-icon>
            </v-btn>
            <v-btn icon v-else>
              <v-icon>mdi-arrow-up-drop-circle-outline</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="dropdown-container bg-grey pl-3 py-2">
          <div class="text-secondary px-5 description_item" v-if="item.designation_description">
            <strong>{{ $t("description") }}:</strong>
            <br />
            {{ item.designation_description }}
          </div>
          <div class="text-secondary" v-else>
            <p class="pl-3">{{ $t("no_details_found") }}</p>
          </div>
        </td>
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
</template>

<script>
import VueElementLoading from "vue-element-loading";
import ConfirmDialog from "../Components/ConfirmDialog.vue";

export default {
  components: {
    VueElementLoading,
    ConfirmDialog
  },
  data: () => ({
    valid: true,
    multiple_select: true,
    message: "",
    initval: true,
    search: "",
    designation_dialog: false,
    isBtnLoading: false,
    isDisabled: false,
    loader: false,
    expanded: [],
    singleExpand: false,
    showConfirmDialog: false,
    delete_id: null,
    designation_details: [],
    designation_array: [],
    label: "Icon",
    editedItem: {
      id: 0,
      designation: "",
      designation_description: "",
      slug: "",
      parent_id: ""
    }
  }),

  computed: {
    fieldRules() {
      return [v => !!v || this.$t("field_required")];
    },

    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    headers() {
      return [
        {
          text: this.$t("designation"),
          value: "designation"
        },

        {
          text: this.$t("action"),
          align: "center",
          value: "class_name"
        },
        {
          text: ""
        }
      ];
    }
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
      }
    }
  },
  mounted() {},
  methods: {
    designationDialog() {
      this.multiple_select = true;
      this.designation_dialog = true;
      this.fetchLookup();
    },
    fetchLookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "DESIGNATION"
          }
        })
        .then(response => {
          this.designation_array = response.data.lookup_details;
        })
        .catch(err => {
          console.log(err);
        });
    },
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
      this.deleteChildDesignation(designation_id);
    },
    deleteChildDesignation(designation_id) {
      axios
        .delete(process.env.VUE_APP_API_URL_ADMIN + "level/" + designation_id)
        .then(res => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class"
            });
          } else {
            this.flashMessage.success({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class"
            });
            this.initialize();
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
    },

    initialize() {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "leveldata/" +
            this.$route.query.level_name
        )
        .then(res => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.initval = false;
            this.designation_details = res.data.designations_data;
          } else if (res.data.status == "E") {
            this.initval = false;
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class"
            });
          } else {
            this.initval = false;
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

    close() {
      this.designation_dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    editItem(item) {
      this.multiple_select = false;
      this.isDisabled = false;
      this.editedIndex = this.designation_details.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.fetchLookup();
      this.designation_dialog = true;
    },
    save() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        this.editedItem.slug = this.$route.query.slug;
        if (this.editedIndex > -1) {
          axios
            .patch(
              process.env.VUE_APP_API_URL_ADMIN + "level/" + this.editedItem.id,
              this.editedItem
            )
            .then(res => {
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "E") {
                this.flashMessage.error({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class"
                });
                this.isDisabled = false;
                this.isBtnLoading = false;
              } else {
                this.flashMessage.success({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class"
                });
                this.isBtnLoading = false;
                this.isDisabled = false;
                this.initialize();
                this.$refs.form.reset();
              }
            })
            .catch(err => {
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class"
              });
              this.isBtnLoading = false;
              this.isDisabled = false;
              console.log("error", err);
            });
        } else {
          axios
            .post(process.env.VUE_APP_API_URL_ADMIN + "level", this.editedItem)
            .then(res => {
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "E") {
                this.flashMessage.error({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class"
                });
                this.isBtnLoading = false;
                this.isDisabled = false;
              } else {
                this.flashMessage.success({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class"
                });
                this.isBtnLoading = false;
                this.isDisabled = false;
                this.initialize();
                this.$refs.form.reset();
              }
            })
            .catch(err => {
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class"
              });
              this.isBtnLoading = false;
              this.isDisabled = false;
              console.log("error", err);
            });
        }
        this.isBtnLoading = false;
        this.isDisabled = false;
        this.close();
      }
    }
  }
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
</style>