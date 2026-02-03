<template>
  <div class="main-20">
    <!-- <div class="pagetitle_in_userdetails">
      <page-title
      :heading="$t('family_details')"
      :google_icon="google_icon"
      ></page-title>
    </div> -->
    <div>
      <v-app-bar flat color="white">
        <!-- <h5>{{ $t("family_details") }}<i class="fa fa-users pl-3"></i></h5> -->
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-if="view == 'userview' && status" color="primary" dark small
              class="btn mr-2 mb-2 hover_shine add_new" v-on="on" @click="dialog_open_when_add">{{ $t("add") }}
            </v-btn>
          </template>
          <span>{{ $t("add") }}</span>
        </v-tooltip>
      </v-app-bar>
      <v-data-table :items-per-page="5" :loading="initval" :headers="headers" :items="family_items">
        <template v-slot:item="{ item, expand, isExpanded }">
          <tr>
            <td v-if="item.relationship">
              {{ item.relationship.shortname }}
            </td>
            <td>{{ item.first_name }}</td>
            <td>{{ item.last_name }}</td>
            <td>
              <span v-if="item.dob">{{ item.dob | formatDate }}</span>
              <span v-else>{{ $t('not_appllicable') }}</span>
            </td>
            <td>
              <span v-if="item.phone"> {{ item.phone }}</span>
              <span v-else>{{ $t('not_appllicable') }}</span>
            </td>
            <td class="edit_item px-0" v-if="view == 'userview' && status">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" @click="fetchEdit(item.id)" small
                    class="ml-3 edit_btn icon_size">mdi-pencil-outline</v-icon>
                </template>
                <span>{{ $t("edit") }}</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon class="delete_btn icon_size" v-on="on" small
                    @click="deleteItem(item.id)">mdi-trash-can-outline</v-icon>
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
          <tr>
            <td :colspan="headers.length" class="bg-grey pl-3 py-2">
              <v-row class="justify-space-around mt-1" v-if="item.language_known">
                <v-col md="12">
                  <span class="expand_row_header">
                    {{
                      $t("languages_known")
                    }} :
                  </span>
                  <div class="values">

                    <v-chip v-for="(lang, i) in item.language_known" :key="i" class="ma-2 ml-0" color="primary"
                      variant="outlined" small>
                      {{ lang }}
                    </v-chip>

                    <!-- {{user_info.user.user_org.working_days}} -->
                  </div>
                </v-col>
              </v-row>
              <v-row class="justify-space-around mt-1" v-else>
                <v-col md="12">
                  <p align="center">
                    <strong>{{ $t("no_data_available") }}</strong>
                  </p>
                </v-col>
              </v-row>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-dialog persistent v-model="dialog" transition="dialog-bottom-transition" max-width="800px">
        <v-card>
          <v-toolbar color="primary" dark>
            <span class="headline">{{
              $t("create_amend_family_details")
            }}</span>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon @click="close" class="dialogcloseinuserdetails" v-on="on">mdi-close</v-icon>
              </template>
              <span>{{ $t("close") }}</span>
            </v-tooltip>
          </v-toolbar>
          <v-card-text class="mt-8">
            <v-container grid-list-md class="justify-center">
              <v-alert v-model="save_error" :text="save_error" color="error" icon="warning" outlined dismissible>
      {{ valertdialogmessage }}</v-alert>


              <v-form ref="form" v-model="valid">
                <v-layout>
                  <v-flex xs12 sm6 md6 pl-2 pr-4 class="createlookupflex">
                    <v-autocomplete v-model="family_details.type_id" :rules="fieldRules" dense
                      :error="relation_exist_focus" :error-messages="relation_exist_focus_message" index="id"
                      item-value="id" item-text="longname" v-bind:label="$t('relationship')" outlined
                      @change="relation_exist_check(family_details.type_id)" class="required_field" ref="relationref"
                      :items="relationship_array"></v-autocomplete>
                      <CreateLookup lookup_parent_name="RELATIONSHIP_TYPE" :dropdownlabel="$t('relationship')"
                      @lookup_data="lookupMessage"></CreateLookup>
                  </v-flex>
                  <v-flex xs12 sm6 md6 pl-3 class="check_box_align">
                    <v-checkbox v-model="family_details.is_emergency" v-bind:label="$t('primary_contact')"
                      class="vinputcheckbox" hide-details></v-checkbox>
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex xs12 sm6 md6 pl-2 pr-4>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" v-model="family_details.first_name" :rules="fieldRules" dense
                          v-bind:label="$t('first_name')" outlined class="required_field"></v-text-field>
                      </template>
                      <span>{{ $t("first_name") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 sm6 md6 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" v-model="family_details.last_name" :rules="fieldRules" dense
                          v-bind:label="$t('last_name')" outlined class="required_field"></v-text-field>
                      </template>
                      <span>{{ $t("last_name") }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex xs12 sm3 md3 pl-2>
                    <DatePicker :label="$t('dob')" :stored_date="family_details.dob" dense
                      :max="new Date().toISOString().substr(0, 10)" @formatted_date="formatted_date" />

                  </v-flex>
                  <v-flex xs12 sm3 md3 pl-2 pr-4>
                    <v-text-field outlined v-bind:label="$t('age')" dense v-model="family_details.age" readonly />
                  </v-flex>
                  <v-flex xs12 sm3 md3 pl-2 pr-1>
                    <v-text-field outlined v-bind:label="$t('qualification')" dense
                      v-model="family_details.qualification" />
                  </v-flex>
                  <v-flex xs12 sm3 md3 pl-2 pr-3>
                    <v-text-field outlined v-bind:label="$t('occupation')" dense v-model="family_details.occupation" />
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex xs12 sm6 md6 pl-2 pr-4>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field v-model="family_details.phone" v-bind:label="$t('contact_number')"
                          v-bind:class="family_details.is_emergency ? 'required_field' : ''" maxlength="10" v-on="on"
                          :rules="family_details.is_emergency ? fieldRules : fakeRules"
                          @keypress.native="isNumber($event)" outlined dense></v-text-field>
                      </template>
                      <span>{{ $t("contact_number") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 sm6 md6 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete chips small-chips  multiple v-on="on"
                        :rules="langrule ? fieldRulesArray : fakeRules"
                          @change="langknownarray(family_details.language_known)" v-model="family_details.language_known"
                          class="required_field" :items="language_array" item-text="shortname" item-value="shortname"
                          dense v-bind:label="$t('languages_known')" outlined>
                          <template v-slot:selection="{ item }">
                            <v-chip outlined class="py-2" color="primary" small>
                              <span>{{ item.longname }}</span>
                            </v-chip>
                          </template>
                        </v-autocomplete>
                      </template>
                      <span>{{ $t("languages_known") }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions class="container">
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on" class="d-inline-block ">
                  <v-btn v-on="on" small color="btn hover_shine cancel_button" @click="close"
                    class="mr-2 mb-3 font-weight-bold cancel-btn">{{ $t("cancel") }}</v-btn>
                </div>
              </template>
              <span>{{ $t("cancel") }}</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn :disabled="isDisabled" v-on="on" @click="submit" small class="success hover_shine mb-3"
                  color="green darken-1">{{ $t("submit") }}
                  <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
                </v-btn>
              </template>
              <span>{{ $t("submit") }}</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <ConfirmDialog :show="dialogDelete" :cancel="closeDelete" :confirm="deleteConfirm" :id="delete_id"
        v-bind:title="$t('confirm')" v-bind:description="$t('want_to_delete')" />
    </div>
  </div>
</template>
    
<script>
import CreateLookup from "../../../Pages/CreateLookup.vue";
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import DatePicker from "../Components/DatePicker.vue";
import VueElementLoading from "vue-element-loading";
import moment from "moment";
export default {
  components: {
    PageTitle,
    ConfirmDialog,
    moment,
    DatePicker,
    VueElementLoading,
    CreateLookup
  },
  props: ["user_id", "view", "status"],
  data: () => ({
    valertdialogmessage:"",
    save_error: false,
    initval: true,
    emp_id: "",
    family_items: [],
    language_array: [],
    delete_id: "",
    relationship_array: [],
    isBtnLoading: false,
    submit_credential_disable: false,
    family_details: {
      id: 0,
      type_id: "",
      first_name: "",
      last_name: "",
      dob: "",
      emp_id: "",
      phone: "",
      age: "",
      qualification: "",
      occupation: "",
      is_emergency: false,
      language_known: [],
    },
    previous_date: "",
    google_icon: {
      icon_name: "house",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    relation_id_details: {
      relation_emp_id: "",
      relation_type_id: "",
    },
    valid: true,
    langrule: true,
    editedIndex: -1,
    relation_exist_focus: false,
    relation_exist_focus_message: "",
    defaultItem: {
      nominee: "",
      dob: "",
      last_name: "",
      first_name: "",
      relationship: "",
    },
    editedItem: {
      nominee: "",
      dob: "",
      last_name: "",
      first_name: "",
      relationship: "",
    },
    flag_for_relation: 0,
    dialog: false,
    dialogDelete: false,
    isDisabled: false,
    delete_id: "",
  }),
  mounted() {
    this.fetchlookup();
    this.previousDate();
  },
  watch: {
    user_id: {
      immediate: true,
      handler() {
        if (this.user_id) {
          this.family_details.emp_id = this.user_id;
          this.fetchAllFamily(this.user_id);
        }
      },
    },
  },
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    fakeRules() {
      return;
    },
    fieldRulesArray(v) {
      let array = v;
      return [array.length >= 1 || this.$t("field_required")];
    },

    headers() {
      if (this.view == "userview" && this.status) {
        return [
          {
            text: "Relationship",
            align: "start",
            sortable: false,
            value: "relationship",
          },
          { text: "First Name", value: "first_name" },
          { text: "Last Name", value: "last_name", sortable: false },
          { text: "Date of Birth", value: "dob" },
          { text: "Emergency Contact", value: "phone" },
          { text: "Actions", value: "actions", sortable: false },
        ];
      } else {
        return [
          {
            text: "Relationship",
            align: "start",
            sortable: false,
            value: "relationship",
          },
          { text: "First Name", value: "first_name" },
          { text: "Last Name", value: "last_name", sortable: false },
          { text: "Date of Birth", value: "dob" },
        ];
      }
    },
  },

  created() { },

  methods: {
    lookupMessage(lookup_data) {
      if (lookup_data.status == 'S') {
        this.flashMessage.success({
          message: lookup_data.message,
          time: 4000,
          blockClass: "custom-block-class",
        });
        this.fetchlookup();
      }
      else {
        this.flashMessage.error({
          message: lookup_data.message,
          time: 4000,
          blockClass: "custom-block-class",
        });
      }
    },
    langknownarray(array) {
      if (array.length >= 1) {
        this.langrule = false;
      }
      else {
        this.langrule = true;
      }
    },
    formatted_date(formatted_date) {
      if (formatted_date) {
        this.family_details.dob = formatted_date;
        this.family_details.age = moment().diff(formatted_date, 'years');
      }
    },
    previousDate(date = new Date()) {
      const previous = new Date(date.getTime());
      previous.setDate(date.getDate() - 6575);
      this.previous_date = previous;
    },
    isNumber(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      }
      return true;
    },

    deleteConfirm() {
      this.deleteFamilyDetail();
    },
    deleteItem($id) {
      this.delete_id = $id;
      this.dialogDelete = true;
    },

    deleteFamilyDetail() {
      this.dialogDelete = false;
      this.initval = true;
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "delete_family_details/" + this.delete_id)
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.initval = false;
            this.flashMessage.success({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.fetchAllFamily(this.user_id);
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

    dialog_open_when_add() {
      this.family_details = {
        id: 0,
        type_id: "",
        first_name: "",
        last_name: "",
        dob: "",
        emp_id: "",
        phone: "",
        age: "",
        qualification: "",
        occupation: "",
        is_emergency: false,
        language_known: [],
        emp_id: this.user_id
      }

      this.dialog = true;
      this.isDisabled = false;
      this.isBtnLoading = false;
    },
    fetchEdit(id) {
      this.family_details = "";
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "edit_family_details/" + id)
        .then((res) => {
          this.family_details = res.data.family_details;
          this.family_details.language_known = res.data.language_known;
          this.initval = false;
          this.dialog = true;
        });
    },

    fetchAllFamily(user_id) {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "get_family_details", {
          params: {
            user_id: user_id,
          },
        })
        .then((res) => {
          this.family_items = res.data.family_items;
          this.initval = false;
        })
        .catch((err) => {
          this.initval = false;
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
        });
    },

    submit() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        // Form is valid, process
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "family_details",
            this.family_details
          )
          .then((res) => {
            this.isBtnLoading = false;
            this.isDisabled = false;
            if (Array.isArray(res.data.message)) {
              this.array_data = res.data.message.toString();
            } else {
              this.array_data = res.data.message;
            }
            if (res.data.status == "S") {
              this.$refs.form.reset();
              this.dialog = false;
              this.flashMessage.success({
                message: this.array_data,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.message = res.data.message;
              this.fetchAllFamily(this.user_id);
            } else if (res.data.status == "E") {
              this.valertdialogmessage = res.data.message;
              this.save_error=true;
              this.isBtnLoading = false;
              this.isDisabled = false;
            } else {
              this.isDisabled = false;
              this.isBtnLoading = false;
              this.valertdialogmessage = res.data.message; 
              this.save_error=true;
            }
          })
          .catch((err) => {
            this.isDisabled = false;
            this.isBtnLoading = false;
            this.valertdialogmessage = this.$t("something_went_wrong");; 
            this.save_error=true;
            this.isBtnLoading = false;
            console.log(err);
          });
      } else {
        console.log("Form is Invalid");
      }
    },

    fetchlookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "RELATIONSHIP_TYPE",
          },
        })
        .then((response) => {
          this.relationship_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });

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

    initialize() { },

    editItem(item) {
      this.editedIndex = this.family_details.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.save_error=false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.flag_for_relation = 0;
        this.family_details = "";
      });
      this.submit_credential_disable = false;
      this.isBtnLoading = false;
      this.relation_exist_focus = false;
      this.relation_exist_focus_message = "";
      this.$refs.form.reset();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    // save() {
    //   if (this.$refs.userform.validate()) {
    //     if (this.flag_for_relation != 1) {
    //       if (this.editedIndex > -1) {
    //         Object.assign(
    //           this.family_details[this.editedIndex],
    //           this.editedItem
    //         );
    //       } else {
    //         this.family_details.push(this.editedItem);
    //       }
    //       this.close();
    //     } else {
    //       this.$refs.relationref.focus();
    //       this.flashMessage.error({
    //         message: this.editedItem.relationship + " is already exists",
    //         time: 2000,
    //         blockClass: "custom-block-class"
    //       });
    //     }
    //   }
    // },
    // NumbersOnly(evt) {
    //   evt = evt ? evt : window.event;
    //   var charCode = evt.which ? evt.which : evt.keyCode;
    //   if (
    //     charCode > 31 &&
    //     (charCode < 48 || charCode > 57) &&
    //     charCode !== 46
    //   ) {
    //     evt.preventDefault();
    //   } else {
    //     return true;
    //   }
    // },
    // relationchange(relation) {
    //   for (var i = 0; i <= this.family_details.length; i++) {
    //     if (this.family_details[i].relationship == relation) {
    //       return (this.flag_for_relation = 1);
    //     } else {
    //       this.flag_for_relation = 0;
    //     }
    //   }
    // },
    relation_exist_check(id) {
      this.relation_id_details.relation_emp_id = this.user_id;
      this.relation_id_details.relation_type_id = id;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "relationexistencecheck",
          this.relation_id_details
        )
        .then((response) => {
          if (response.data.status == "EXIST") {
            this.submit_credential_disable = true;
            this.relation_exist_focus = true;
            this.relation_exist_focus_message = "Relation already added";
          } else {
            this.relation_exist_focus = false;
            this.relation_exist_focus_message = "";
            this.submit_credential_disable = false;
          }
        })
        .catch((err) => {
          console.log(" error" + err);
        });
    },
  },
};
</script>

<style scoped>
.edit_item {
  text-align: left !important;
}

.main_card /deep/ .active-card-body {
  padding: 0px !important;
  margin-left: 0px !important;
  margin-right: 0px !important;
}

.check_box_align {
  margin-top: -19px;
  margin-left: -7px;
}

.vinputcheckbox /deep/ .v-label {
  margin-top: 7px !important;
}
</style> 