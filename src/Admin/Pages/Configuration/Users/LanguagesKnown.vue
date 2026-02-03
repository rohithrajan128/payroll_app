<template>
  <div class="main-20">
    <!-- <div class="pagetitle_in_userdetails">
      <page-title
        :heading="$t('reference')"
        :google_icon="google_icon"
      ></page-title>
    </div>-->
    <div>
      <v-app-bar flat color="white">
        <!-- <h5>
          {{ $t("languages_known") }}
          <i class="fa fa-language pl-3"></i>
        </h5> -->
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              v-if="view == 'userview' && status"
              class="btn mr-2 mb-2 hover_shine add_new"
              small
              v-on="on"
              @click="dialog_open_when_add"
              >{{ $t("add") }}</v-btn
            >
          </template>
          <span>{{ $t("add") }}</span>
        </v-tooltip>
      </v-app-bar>

      <v-data-table
        :loading="initval"
        :headers="headers"
        :items="languageslist"
        v-bind:no-data-text="$t('no_data_available')"
        :footer-props="{ 'items-per-page-text': $t('rows_per_page') }"
      >
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.language }}</td>
            <td v-if="props.item.read">{{ $t("yes") }}</td>
            <td v-else>{{ $t("no") }}</td>

            <td v-if="props.item.write">{{ $t("yes") }}</td>
            <td v-else>{{ $t("no") }}</td>

            <td v-if="props.item.speak">{{ $t("yes") }}</td>
            <td v-else>{{ $t("no") }}</td>

            <td class="text-center px-0" v-if="view == 'userview' && status">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    small
                    class="mr-3 edit_btn icon_size"
                    v-on="on"
                    @click="editlanguages(props.item.id)"
                    >mdi-pencil-outline</v-icon
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
                    @click="deletelanguages(props.item.id)"
                    >mdi-trash-can-outline</v-icon
                  >
                </template>
                <span>{{ $t("delete") }}</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-dialog
        persistent
        v-model="dialog"
        transition="dialog-bottom-transition"
        max-width="800px"
      >
        <v-card>
          <v-toolbar color="primary" dark>
            <span class="headline">{{ $t("create_amend_languages") }}</span>
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
          <v-alert
            v-model="save_error"
            :text="save_error"
            color="error"
            icon="warning"
            outlined
            dismissible
          >
            {{ valertdialogmessage }}</v-alert
          >
          <v-form ref="languageform" v-model="valid">
            <v-card-text class>
              <div class="languageadd_containerdiv">
                <v-container grid-list-md>
                  <v-layout
                    wrap
                    v-for="(language_data, language_index) in addmorelanguages"
                    :key="language_index"
                  >
                    <v-flex xs12 sm4 md4 pl-2 pt-5 mr-10 class="createlookupflex">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-autocomplete
                            v-on="on"
                            @change="
                              checkLangExist(
                                language_data.language,
                                language_data.id,
                                language_index
                              )
                            "
                            v-model="language_data.language"
                            :rules="fieldRulesArray"
                            :items="language_array"
                            item-text="shortname"
                            item-value="shortname"
                            dense
                            v-bind:label="$t('name')"
                            outlined
                            class="required_field"
                          >
                          </v-autocomplete>
                        </template>
                        <span>{{ $t("lang_name") }}</span>
                      </v-tooltip>
                      <CreateLookup lookup_parent_name="LANGUAGE_KNOWN" @lookup_data="lookupMessage" :dropdownlabel="$t('lang_name')"></CreateLookup>
                    </v-flex>

                    <v-flex xs12 sm1 md1 pl-2 mr-4 class="labelcheckbox">
                      <v-checkbox
                        v-model="language_data.read"
                        v-bind:label="$t('read')"
                      ></v-checkbox>
                    </v-flex>
                    <v-flex xs12 sm1 md1 pl-2 mr-4 class="labelcheckbox">
                      <v-checkbox
                        v-model="language_data.write"
                        v-bind:label="$t('write')"
                      ></v-checkbox>
                    </v-flex>
                    <v-flex xs12 sm1 md1 pl-2 mr-4 class="labelcheckbox">
                      <v-checkbox
                        v-model="language_data.speak"
                        v-bind:label="$t('speak')"
                      ></v-checkbox>
                    </v-flex>
                    <v-flex
                      sm2
                      md2
                      pl-5
                      class="labelcheckbox"
                    >
                    
                        <v-tooltip  v-if="language_index == addmorelanguages.length - 1" bottom>
                          <template v-slot:activator="{ on }">
                            <button
                              v-on="on"
                              @click="addmorelanguage"
                              class="btn btn-primary rounded-circle mx-2 py-0 px-0 mt-5 primary"
                                type="button"
                            >
                              <v-icon class="text-white" medium
                                >mdi-plus</v-icon
                              >
                            </button>
                          </template>
                          <span>{{ $t("add") }}</span>
                        </v-tooltip>
                        <v-tooltip  v-if="addmorelanguages.length > 1" bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon
                          class="delete_btn icon_size mt-4 mr-3"
                          v-on="on"
                          @click="removelanguage(language_index)"
                        >mdi-trash-can-outline</v-icon>
                      </template>
                      <span>{{ $t("remove") }}</span>
                    </v-tooltip>
                    
                    </v-flex>
                   
                  </v-layout>
                </v-container>
              </div>
            </v-card-text>
            <v-row style="padding-bottom: 20px; margin-right: 10px">
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <div v-on="on" class="d-inline-block mr-2">
                    <v-btn
                      v-on="on"
                      small
                      @click="close"
                      class="mb-3 font-weight-bold cancel-btn"
                      color="btn hover_shine cancel_button"
                      >{{ $t("cancel") }}</v-btn
                    >
                  </div>
                </template>
                <span>{{ $t("cancel") }}</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    @click="save()"
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
                <span>{{ $t("submit") }}</span>
              </v-tooltip>
            </v-row>
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
import CreateLookup from "../../../Pages/CreateLookup.vue";
export default {
  components: {
    PageTitle,
    ConfirmDialog,
    CreateLookup
  },
  props: ["user_id", "view", "status"],
  data: () => ({
    valertdialogmessage: "",
    save_error: false,
    google_icon: {
      icon_name: "Badge",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    language_array: [],
    message: "",
    delete_id: "",
    dialog: false,
    initval: false,
    isBtnLoading: false,
    valid: true,
    languageslist: [],
    addmorelanguages: [],
    dialogDelete: false,
    languagedetails: {
      id: 0,
      emp_id: "",
      language: [],
      read: 0,
      write: 0,
      speak: 0,
    },
    submit_credential_disable: false,
  }),
  mounted() {
    this.fetchlanguagesknown();
    this.fetchLookups();
  },
  watch: {
    user_id: {
      immediate: true,
      handler() {
        this.fetchlanguagesknown();
      },
    },
  },

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    fieldRulesArray() {
      return [(v) => v.length > 0 || this.$t("field_required")];
    },
    headers() {
      if (this.view == "userview" && this.status) {
        return [
          {
            text: "Languages",
            align: "left",
            value: "languages",
          },
          {
            text: "Read",
            align: "left",
            value: "read",
          },
          {
            text: "Write",
            align: "left",
            value: "write",
          },
          {
            text: "Speak",
            align: "left",
            value: "speak",
          },

          {
            text: "Actions",
            align: "center",
            value: "name",
          },
        ];
      } else {
        return [
          {
            text: "Languages",
            align: "left",
            value: "languages",
          },
          {
            text: "Read",
            align: "left",
            value: "read",
          },
          {
            text: "Write",
            align: "left",
            value: "write",
          },
          {
            text: "Speak",
            align: "left",
            value: "speak",
          },
        ];
      }
    },
  },
  methods: {
    lookupMessage(lookup_data) {
      if (lookup_data.status == 'S') {
        this.flashMessage.success({
          message: lookup_data.message,
          time: 4000,
          blockClass: "custom-block-class",
        });
        this.fetchLookups();
      }
      else {
        this.flashMessage.error({
          message: lookup_data.message,
          time: 4000,
          blockClass: "custom-block-class",
        });
      }
    },
    fetchLookups() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "LANGUAGE_KNOWN",
          },
        })
        .then((response) => {
          this.language_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchlanguagesknown() {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "getlanguagesKnown/" +
            this.user_id
        )
        .then((res) => {
          this.languageslist = res.data.languagesknown;
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

    checkLangExist(lang, id, index) {
      this.valertdialogmessage = "";
      this.save_error = false;
      this.submit_credential_disable = false;
      if (id == 0) {
        for (var l = 0; l < this.addmorelanguages.length; l++) {
          if (lang == this.addmorelanguages[l].language && l != index) {
            this.valertdialogmessage = lang + " is Already Exist";
            this.submit_credential_disable = true;
            this.save_error = true;
          }
        }
      }
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "checklanguageexist", {
          language: lang,
          id: id,
          emp_id: this.user_id,
        })
        .then((res) => {
          if (res.data.status == "S") {
            return true;
          } else {
            this.valertdialogmessage = res.data.message;
            this.submit_credential_disable = true;
            this.save_error = true;
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

    deletelanguages(id) {
      this.delete_id = id;
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.initval = true;
      this.dialogDelete = false;
      axios
        .delete(
          process.env.VUE_APP_API_URL_ADMIN +
            "deletelanguagesKnown/" +
            this.delete_id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.fetchlanguagesknown();
            this.message = res.data.message;
            this.flashMessage.success({
              message: this.message,
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
          console.log(" error" + err);
        });
    },
    dialog_open_when_add() {
      this.dialog = true;
      this.addmorelanguage();
    },
    close() {
      this.save_error = false;
      this.dialog = false;
      this.delete_id = "";
      this.initval = false;
      this.languagedetails = {};
      this.addmorelanguages = [];
      this.languagedetails.id = "0";
      this.submit_credential_disable = false;
      this.isBtnLoading = false;
    },
    closeDelete() {
      this.dialogDelete = false;
    },
    addmorelanguage() {
      this.languagedetails.id = 0;
      this.languagedetails.emp_id = this.user_id;
      this.languagedetails.read = 0;
      this.languagedetails.write = 0;
      this.languagedetails.speak = 0;
      this.addmorelanguages.push(this.languagedetails);
      this.languagedetails = {};
      this.languagedetails.id = 0;
      this.languagedetails.language = "";
      this.languagedetails.read = 0;
      this.languagedetails.write = 0;
      this.languagedetails.speak = 0;
    },
    removelanguage(index) {
      this.addmorelanguages.splice(index, 1);
    },
    save() {
      if (this.$refs.languageform.validate()) {
        this.submit_credential_disable = true;
        this.isBtnLoading = true;
        axios
          .post(process.env.VUE_APP_API_URL_ADMIN + "createlanguages", {
            languagedetails: this.addmorelanguages,
            user_id: this.user_id,
          })
          .then((response) => {
            if (response.data.status == "S") {
              this.flashMessage.success({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.close();
              this.fetchlanguagesknown();
            }
            if (response.data.status == "EXIST") {
              // this.close();
              this.valertdialogmessage = response.data.message;
              this.save_error = true;
              this.submit_credential_disable = false;
              this.isBtnLoading = false;
            }
            if (response.data.status == "E") {
              this.valertdialogmessage = response.data.message;
              this.save_error = true;
              this.submit_credential_disable = false;
              this.isBtnLoading = false;
              // this.close();
              // this.fetchlanguagesknown();
            }
          })
          .catch((err) => {
            this.valertdialogmessage = this.$t("something_went_wrong");
            this.save_error = true;
            this.submit_credential_disable = false;
            this.isBtnLoading = false;
            console.log(err);
            this.close();
          });
      }
    },
    editlanguages(edit_id) {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetchlanguagesknown/" + edit_id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.addmorelanguages = res.data.languagesknown;
            this.dialog = true;
            this.initval = false;
          }
          if (res.data.status == "E") {
            this.flashMessage.error({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.close();
          }
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

    NumbersOnly(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
  },
};
</script>
<style scoped>
.labelcheckbox /deep/ .v-label {
  margin: 0px;
}

.addlanguagebutton {
  height: 30px !important;
  padding: 0px 4px !important;
}
</style>