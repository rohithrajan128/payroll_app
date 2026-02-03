<template>
  <div class="main-20">
    <!-- <div>
      <page-title
        :heading="$t('activities')"
        :google_icon="google_icon"
      ></page-title>
    </div> -->

    <div>
      <v-app-bar flat color="white">
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              class="btn mr-2 mb-2 hover_shine add_new"
              small
              v-on="on"
              @click="dialog_open_when_add()"
            >
              {{ $t("add") }}
            </v-btn>
          </template>
          <span>{{ $t("add") }}</span>
        </v-tooltip>
      </v-app-bar>

      <v-data-table
        :loading="initval"
        :headers="headers"
        :items="allactivities"
        v-bind:no-data-text="$t('no_data_available')"
        :footer-props="{ 'items-per-page-text': $t('rows_per_page') }"
      >
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.activity_id.activity_name }}</td>

            <!-- <td>{{ props.item.category_name }}</td> -->

            <td class="text-center px-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    small
                    class="mr-3 edit_btn icon_size"
                    v-on="on"
                    @click="editactivity(props.item.id)"
                  >
                    mdi-pencil-outline</v-icon
                  >
                </template>
                <span>{{ $t("edit") }}</span>
              </v-tooltip>
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

      <v-dialog persistent v-model="dialog" max-width="800px">
        <v-card>
          <v-toolbar color="primary" dark>
            <span class="headline">{{ $t("create_amend_activity") }}</span>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  @click="close"
                  class="dialogcloseinuserdetails"
                  v-on="on"
                  >mdi-close</v-icon
                >
              </template>
              <span>{{ $t("close") }}</span>
            </v-tooltip>
          </v-toolbar>

          <v-alert v-model="save_error" :text="save_error" color="error" icon="warning" outlined dismissible>
      {{ valertdialogmessage }}</v-alert>
          <v-form ref="activityform" v-model="valid">
            <v-card-text class="mt-8">
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md6 pl-2>
                    <v-text-field
                      v-model="activities.activity_id.activity_name"
                      :rules="fieldRules"
                      dense
                      v-bind:label="$t('activity_name')"
                      outlined
                      class="required_field"
                    >
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6 pl-2>
                    <v-autocomplete
                      v-model="activities.activity_id.category_id"
                      :rules="fieldRules"
                      dense
                      v-bind:label="$t('category_name')"
                      outlined
                      class="required_field"
                      item-value="id"
                      item-text="category_name"
                      :items="allcategories"
                    >
                    </v-autocomplete>
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex xs12 md12 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-textarea
                          v-on="on"
                          v-model="activities.activity_id.description"
                          :rules="fieldRules"
                          v-bind:label="$t('description')"
                          required
                          class="required_field"
                          outlined
                          counter="500"
                          rows="2"
                          maxlength="500"
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
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    @click="saveactivity()"
                    small
                    class="mr-2 success hover_shine mb-3"
                    color="green darken-1"
                    :disabled="submit_credential_disable"
                  >
                    {{ $t("submit") }}
                    <b-spinner
                      :disabled="isBtnLoading"
                      small
                      v-if="isBtnLoading"
                    ></b-spinner>
                  </v-btn>
                </template>
                <span> {{ $t("submit") }} </span>
              </v-tooltip>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
      <ConfirmDialog
        :id="delete_id"
        :show="dialogDelete"
        :cancel="closeDelete"
        :confirm="deleteItemConfirm"
        v-bind:title="$t('confirm')"
        v-bind:description="$t('want_to_delete')"
      />
    </div>
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
  // props: ["project_name"],
  props: ["projectid"],
  data: () => ({
    valertdialogmessage:"",
    save_error: false,
    google_icon: {
      icon_name: "ballot",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },

    delete_id: "",
    dialog: false,
    initval: false,
    isBtnLoading: false,
    valid: true,
    empid_list: [],
    projectid_list: [],
    dialogDelete: false,
    activities: {
      activity_id: { category_id: "", description: "" },
      project_id: { id: "" },
    },
    allactivities: [],
    allcategories: [],
    headers: [
      {
        text: "Activity",
        value: "activity_name",
      },

      {
        text: "Actions",
        value: "name",
        align: "center",
      },
    ],

    submit_credential_disable: false,
  }),
  mounted() {
    this.fetchcategories();
    this.fetchactivities();
  },

  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "getactivities?slug=" +
                this.$route.query.slug
            )
            .then((res) => {
              this.allactivities = res.data.activity;
              this.initval = false;
            })
            .catch((err) => {
              this.isDisabled = false;
              console.log("this error" + err);
            });
        }
      },
    },
  },

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },
  methods: {
    fetchactivities() {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "getactivities?slug=" +
            this.$route.query.slug
        )
        .then((res) => {
          this.allactivities = res.data.activity;
          this.activities.project_id.id = res.data.projectID;
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

    fetchcategories() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getcategories")
        .then((res) => {
          this.allcategories = res.data.category;

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

    deleteItem(id) {
      this.delete_id = id;
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.initval = true;
      this.dialogDelete = false;

      axios
        .delete(
          process.env.VUE_APP_API_URL_ADMIN + "deleteactivity/" + this.delete_id
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
            this.fetchactivities();
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
            // this.initval = true;
          } else {
            this.flashMessage.error({
              message: this.array_data,
            });
            // this.initval = true;
            this.fetchactivities();
          }
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
    dialog_open_when_add() {
      // this.activities.project_id.id = id;
      this.dialog = true;
      this.fetchprojectid();
      this.fetchempid();
    },
    close() {
      this.save_error=false;
      this.dialog = false;
      this.delete_id = "";
      this.initval = false;
      this.submit_credential_disable = false;
      this.isBtnLoading = false;
      this.$refs.activityform.reset();
    },
    closeDelete() {
      this.dialogDelete = false;
    },
    saveactivity() {
      if (this.$refs.activityform.validate()) {
        this.submit_credential_disable = true;
        this.isBtnLoading = true;

        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "createactivity",
            this.activities
          )
          .then((response) => {
            if (response.data.status == "S") {
              this.flashMessage.success({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.close();
              this.fetchactivities();
              this.activities.id = 0;
            }
           else if (response.data.status == "E") {
            this.valertdialogmessage = response.data.message;
            this.save_error=true;
            this.submit_credential_disable = true;
             this.isBtnLoading = true;
            }else{
            this.valertdialogmessage = this.$t("something_went_wrong");
            this.save_error=true;
            this.submit_credential_disable = true;
            this.isBtnLoading = true;
            }
          })
          .catch((err) => {
            this.valertdialogmessage = this.$t("something_went_wrong");
            this.save_error=true;
            this.submit_credential_disable = true;
            this.isBtnLoading = true;
            console.log(err);
          });
      }
    },
    editactivity(id) {
      this.dialog = true;
      this.initval = false;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "edit_activity/" + id)
        .then((res) => {
          this.activities = res.data.activities;
          this.loader = false;
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

    fetchempid() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getempid")
        .then((res) => {
          this.empid_list = res.data.emp_ids;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetchprojectid() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getprojectid")
        .then((res) => {
          this.projectid_list = res.data.project_ids;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
