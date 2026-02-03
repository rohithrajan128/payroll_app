<template>
  <div class="main-20">
    <div>
      <v-app-bar flat color="white">
        <!-- <div class="pagetitle_in_userdetails">
          <page-title
            :heading="$t('reference')"
            :google_icon="google_icon"
          ></page-title>
        </div> -->
        <h5><i class="fa fa-user-circle-o pl-3 mr-2"></i>{{ $t("reference") }}</h5>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn class="btn mr-2 mb-2 hover_shine add_new" small v-on="on" @click="dialog_open_when_add"
              v-if="view == 'userview' && status">
              {{ $t("add") }}
            </v-btn>
          </template>
          <span>{{ $t("add") }}</span>
        </v-tooltip>
      </v-app-bar>
      <!-- <div class="container justify-content-between">
        <div class="card-hover-shadow expansion_panel justify-content-between" outlined>
          <v-expansion-panels 
            class="expansionpaneldummydiv"
           
            multiple
          >
            <v-expansion-panel 
              class="col-md-5 mt-5"
              v-for="(reference, i) in reflist"
              :key="i"
            >
           <v-card>
              <v-expansion-panel-header>
                <div style="display: block">
                  <v-row class="text-h6 text-capitalize mb-1"
                    ><v-col md="8"> {{ reference.name }}</v-col
                    ><v-col md="4" class="d-flex justify-content-end" v-if="view == 'userview'">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-icon
                            small
                            class="mr-3 edit_btn icon_size"
                            v-on="on"
                            @click="editreference(reference.id)"
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
                            @click="deletereference(reference.id)"
                            >mdi-trash-can-outline</v-icon
                          >
                        </template>
                        <span>{{ $t("delete") }}</span>
                      </v-tooltip></v-col
                    >
                  </v-row>
                  <v-row class="text-capitalize">
                    <v-col class="heading">{{ $t("position") }}</v-col
                    ><v-col class="values">: {{ reference.position }}</v-col>
                  </v-row>
                  <v-row>
                    <v-col class="heading">{{ $t("organisation") }}</v-col
                    ><v-col class="values"
                      >: {{ reference.organisation }}</v-col
                    ></v-row
                  >
                </div>
              </v-expansion-panel-header>
              
              <v-expansion-panel-content>
                <div>
                  <v-row>
                    <v-col class="heading">{{ $t("contact_no") }}</v-col
                    ><v-col class="values"
                      >: {{ reference.contact_no }}</v-col
                    ></v-row
                  >
                  <v-row>
                    <v-col class="heading">{{ $t("pincode") }}</v-col
                    ><v-col class="values">
                      : {{ reference.pincode }}</v-col
                    ></v-row
                  >
                  <v-row>
                    <v-col class="heading">{{ $t("state") }}</v-col
                    ><v-col class="values"
                      >: {{ reference.state }}</v-col
                    ></v-row
                  >
                  <v-row>
                    <v-col class="heading">{{ $t("city") }}</v-col
                    ><v-col class="values">: {{ reference.city }}</v-col></v-row
                  >
                </div>
              </v-expansion-panel-content></v-card>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </div> -->
      <v-data-table :loading="initval" :headers="headers" :items="reflist" v-bind:no-data-text="$t('no_data_available')"
        :footer-props="{ 'items-per-page-text': $t('rows_per_page') }">
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.organisation }}</td>
            <td>{{ props.item.email }}</td>
            <td>{{ props.item.contact_no }}</td>
            <td>
              <span v-if="props.item.position">{{ props.item.position }}</span>
              <span v-else>{{ $t("not_appllicable") }}</span>
            </td>
            <td>
              <v-tooltip bottom v-if="props.item.address" max-width="370" color="white">
                <template v-slot:activator="{ on }">
                  <div class="description_hover_div" v-on="on">
                    {{ props.item.address }}
                  </div>
                </template>
                <v-sheet class="pa-4 b">{{ props.item.address }}</v-sheet>
              </v-tooltip>
              <span v-else>{{ $t("not_appllicable") }}</span>
            </td>
            <td>
              <span v-if="props.item.city">{{ props.item.city }}</span>
              <span v-else>{{ $t("not_appllicable") }}</span>
            </td>
            <td>
              <span v-if="props.item.state">{{ props.item.state }}</span>
              <span v-else>{{ $t("not_appllicable") }}</span>
            </td>
            <td>
              <span v-if="props.item.pincode">{{ props.item.pincode }}</span>
              <span v-else>{{ $t("not_appllicable") }}</span>
            </td>

            <td class="text-center px-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon small class="mr-3 edit_btn icon_size" v-on="on" @click="editreference(props.item.id)">
                    mdi-pencil-outline</v-icon> </template><span>{{ $t("edit") }}</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon class="delete_btn icon_size" v-on="on" small
                    @click="deletereference(props.item.id)">mdi-trash-can-outline</v-icon>
                </template>
                <span>{{ $t("delete") }}</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>

      <v-dialog persistent fullscreen transition="dialog-bottom-transition" max-width="1100px" v-model="dialog">
        <v-card>
          <v-toolbar color="primary" dark>
            <span class="headline">{{ $t("create_amend_reference") }}</span>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon @click="close" class="dialogcloseinuserdetails" v-on="on">mdi-close</v-icon>
              </template>
              <span>{{ $t("close") }}</span>
            </v-tooltip>
          </v-toolbar>

          <v-form ref="referenceform" v-model="referencevalid">
            <v-alert v-model="save_error" :text="save_error" color="error" icon="warning" outlined dismissible>
              {{ valertdialogmessage }}</v-alert>
            <v-card-text class="mt-8 ref-card">
              <v-container grid-list-md v-for="(referencedetails, i) in referencedetailsloop" :key="i">
                <v-form ref="reference_validation" v-model="valid">
                  <v-row class="minusreferencerowclass mt-5" v-if="referencedetails.id == 0">
                    <v-spacer></v-spacer>
                    <div>
                      <v-tooltip bottom v-if="i != 0">
                        <template v-slot:activator="{ on }">
                          <button v-on="on" x-small rounded @click="removereference(i, referencedetails)" class=""
                            type="button">
                            <v-icon class="delete_btn icon_size" medium>mdi-trash-can-outline</v-icon>
                          </button>
                        </template>
                        <span>{{ $t("remove") }}</span>
                      </v-tooltip>
                    </div>
                  </v-row>
                  <v-layout wrap>
                    <v-flex xs12 sm4 md4 pl-2>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-text-field v-on="on" v-model="referencedetails.name" :rules="fieldRules" dense
                            v-bind:label="$t('name')" outlined class="required_field"></v-text-field>
                        </template>
                        <span>{{ $t("name") }}</span>
                      </v-tooltip>
                    </v-flex>
                    <v-flex xs12 sm4 md4 pl-2>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-text-field v-on="on" v-model="referencedetails.organisation" :rules="fieldRules" dense
                            v-bind:label="$t('organisation')" outlined class="required_field"></v-text-field>
                        </template>
                        <span>{{ $t("organisation") }}</span>
                      </v-tooltip>
                    </v-flex>
                    <v-flex xs12 sm4 md4 pl-2>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-text-field v-on="on" v-model="referencedetails.position" dense v-bind:label="$t('position')"
                            outlined></v-text-field>
                        </template>
                        <span>{{ $t("position") }}</span>
                      </v-tooltip>
                    </v-flex>
                  </v-layout>
                  <v-layout wrap>
                    <v-flex xs12 sm8 md8 pl-2>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-text-field v-on="on" v-model="referencedetails.email" :rules="[...fieldRules, ...emailRules]"
                            dense v-bind:label="$t('email')" outlined class="required_field"></v-text-field>
                        </template>
                        <span>{{ $t("email") }}</span>
                      </v-tooltip>
                    </v-flex>
                    <v-flex xs12 sm4 md4 pl-2>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-text-field v-on="on" v-model="referencedetails.contact_no"
                            :rules="[...fieldRules, ...phoneRules]" dense v-on:keypress="NumbersOnly"
                            v-bind:label="$t('contact_no')" maxlength="10" outlined class="required_field"></v-text-field>
                        </template>
                        <span>{{ $t("contact_no") }}</span>
                      </v-tooltip>
                    </v-flex>
                  </v-layout>
                  <v-layout wrap>
                    <v-flex sm4 md4 pl-2>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-text-field v-on="on" v-model="referencedetails.city" dense v-bind:label="$t('city')"
                            outlined></v-text-field>
                        </template>
                        <span>{{ $t("city") }}</span>
                      </v-tooltip>
                    </v-flex>
                    <v-flex sm4 md4 pl-2>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-text-field v-on="on" v-model="referencedetails.state" dense v-bind:label="$t('state')"
                            outlined></v-text-field>
                        </template>
                        <span>{{ $t("state") }}</span>
                      </v-tooltip>
                    </v-flex>
                    <v-flex sm4 md4 pl-2>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-text-field v-on="on" v-model="referencedetails.pincode" dense :rules="postcodeRules"
                            v-bind:label="$t('pincode')" outlined maxlength="6"
                            v-on:keypress="NumbersOnly"></v-text-field>
                        </template>
                        <span>{{ $t("pincode") }}</span>
                      </v-tooltip>
                    </v-flex>
                  </v-layout>
                  <v-layout wrap>
                    <v-flex xs12 sm12 md12 pl-2>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-textarea rows="2" v-on="on" v-model="referencedetails.address" dense counter="200"
                            maxlength="200" v-bind:label="$t('address')" outlined></v-textarea>
                        </template>
                        <span>{{ $t("address") }}</span>
                      </v-tooltip>
                    </v-flex>
                  </v-layout>
                  <v-row v-if="i + 1 == referencedetailsloop.length" class="mt-2">
                    <v-spacer></v-spacer>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <div class="d-inline-block mr-2">
                          <v-btn v-on="on" small class="font-weight-bold cancel-btn" color="secondary" @click="close">
                            {{ $t("cancel") }}
                          </v-btn>
                        </div>
                      </template>
                      <span>{{ $t("cancel") }}</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn v-on="on" @click="addmorereference(i)" small class="primary hover_shine mb-3"
                          color="primary darken-1">
                          {{ $t("add_references") }}
                        </v-btn>
                      </template>
                      <span> {{ $t("add_references") }} </span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn v-on="on" @click="save(i)" small class="success hover_shine mb-3 ml-2"
                          color="green darken-1" :disabled="submit_credential_disable">
                          {{ $t("submit") }}
                          <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
                        </v-btn>
                      </template>
                      <span> {{ $t("submit") }} </span>
                    </v-tooltip>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>
          </v-form>
          <ConfirmDialog class="z-index-1000" :show="showDesignationDialog" :cancel="cancel" :confirm="confirm"
            v-bind:title="$t('confirm')" v-bind:description="$t('remove_reference')" />
        </v-card>
      </v-dialog>
      <ConfirmDialog :id="delete_id" :show="dialogDelete" :cancel="closeDelete" :confirm="deleteItemConfirm"
        v-bind:title="$t('confirm')" v-bind:description="$t('want_to_delete')" />
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
  props: ["user_id", "view", "status"],
  data: () => ({
    ref_index: "",
    referencevalid: false,
    showDesignationDialog: false,
    valertdialogmessage: "",
    save_error: false,
    google_icon: {
      icon_name: "Badge",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    headers: [
      { text: "Name", align: "start", value: "name" },
      { text: "Organisation", value: "organisation" },
      { text: "Email", value: "email", sortable: false },
      { text: "Phone", value: "contact_no", sortable: false },
      { text: "Position", value: "position", sortable: false },
      { text: "Address", value: "address", sortable: false },
      { text: "Pincode", value: "pincode", sortable: false },
      { text: "City", value: "city", sortable: false },
      { text: "State", value: "state", sortable: false },
      // { text: 'Last Held Designation', value: 'last_held_des', sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    panel: [0, 1],
    readonly: false,
    message: "",
    delete_id: "",
    dialog: false,
    initval: false,
    isBtnLoading: false,
    valid: true,
    reflist: [],
    dialogDelete: false,
    referencedetailsloop: [],
    referencedetails: {
      id: "0",
      user_emp_id: "",
      name: "",
      position: "",
      email: "",
      address: "",
      organisation: "",
      contact_no: "",
      pincode: "",
      city: "",
      state: "",
    },
    submit_credential_disable: false,
  }),

  watch: {
    user_id: {
      immediate: true,
      handler() {
        this.fetchreference();
        this.addmorereference(-1);
      },
    },
  },
  mounted() {
    this.$eventBus.$on("updated_reference", () => {
      this.fetchreference();
    });
  },
  computed: {
    phoneRules() {
      return [(v) => !v || v.length >= 10 || this.$t("valid_number_required")];
    },
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    postcodeRules() {
      return [(v) => (v >= 0 && v <= 999999) || this.$t("postcode_valid")];
    },
    emailRules() {
      return [
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          this.$t("email_valid"),
      ];
    },
  },
  methods: {
    removereference(index, referencedetails) {
      this.ref_index = index;
      if (
        referencedetails.name != "" ||
        referencedetails.organisation != "" ||
        referencedetails.position != "" ||
        referencedetails.email != "" ||
        referencedetails.contact_no != "" ||
        referencedetails.pincode != "" ||
        referencedetails.city != "" ||
        referencedetails.state != ""
      ) {
        this.showDesignationDialog = true;
      } else {
        console.log("inside else");
        this.removereferencerow(this.ref_index);
      }
    },
    cancel() {
      this.showDesignationDialog = false;
    },
    confirm() {
      this.removereferencerow(this.ref_index);
      this.showDesignationDialog = false;
    },

    fetchreference() {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "getallreference/" + this.user_id
        )
        .then((res) => {
          this.reflist = res.data.ref_name;
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

    deletereference(id) {
      this.delete_id = id;
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.initval = true;
      this.dialogDelete = false;
      axios
        .delete(
          process.env.VUE_APP_API_URL_ADMIN +
          "deletereference/" +
          this.delete_id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.fetchreference();
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
    removereferencerow(index) {
      if (this.referencedetailsloop.length > 1) {
        this.referencedetailsloop.splice(index, 1);
      }
    },
    addmorereference(index) {
      if (index >= 0) {
        if (this.$refs.reference_validation[index].validate()) {
          this.referencedetails.id = 0;
          this.referencedetails.user_emp_id = this.user_id;
          this.referencedetailsloop.push(this.referencedetails);
          this.referencedetails = {};
          this.referencedetails.id = 0;
          this.referencedetails.state = "";
          this.referencedetails.city = "";
          this.referencedetails.pincode = "";
          this.referencedetails.contact_no = "";
          this.referencedetails.organisation = "";
          this.referencedetails.address = "";
          this.referencedetails.email = "";
          this.referencedetails.position = "";
          this.referencedetails.name = "";
        }
      }
      else {
        this.referencedetails.id = 0;
        this.referencedetails.user_emp_id = this.user_id;
        this.referencedetailsloop.push(this.referencedetails);
        this.referencedetails = {};
        this.referencedetails.id = 0;
        this.referencedetails.state = "";
        this.referencedetails.city = "";
        this.referencedetails.pincode = "";
        this.referencedetails.contact_no = "";
        this.referencedetails.organisation = "";
        this.referencedetails.address = "";
        this.referencedetails.email = "";
        this.referencedetails.position = "";
        this.referencedetails.name = "";
      }
    },
    dialog_open_when_add() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.delete_id = "";
      this.initval = false;
      this.referencedetails = {};
      this.referencedetails.id = "0";
      this.submit_credential_disable = false;
      this.isBtnLoading = false;
      this.referencedetailsloop = [];
      this.save_error = false;
      this.addmorereference(-1);
      this.$refs.reference_validation.reset();
    },
    closeDelete() {
      this.dialogDelete = false;
    },
    save(index) {
      if (this.$refs.reference_validation[index].validate()) {
        this.submit_credential_disable = true;
        this.isBtnLoading = true;
        this.referencedetails.user_emp_id = this.user_id;
        axios
          .post(process.env.VUE_APP_API_URL_ADMIN + "createreference", {
            reference: this.referencedetailsloop,
          })
          .then((response) => {
            if (response.data.status == "S") {
              this.flashMessage.success({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.close();
              this.fetchreference();
            } else if (response.data.status == "E") {
              this.valertdialogmessage = response.data.message;
              this.save_error = true;
              this.isBtnLoading = false;
              this.submit_credential_disable = false;
              // this.close();
              // this.fetchreference();
            } else {
              this.valertdialogmessage = this.$t("something_went_wrong");
              this.isBtnLoading = false;
              this.save_error = true;
              this.submit_credential_disable = false;
            }
          })
          .catch((err) => {
            this.valertdialogmessage = this.$t("something_went_wrong");
            this.save_error = true;
            this.isBtnLoading = false;
            this.submit_credential_disable = false;
            console.log(err);
            this.close();
          });
      }
    },
    editreference(id) {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchreference/" + id)
        .then((res) => {
          if (res.data.status == "S") {
            this.referencedetailsloop = res.data.ref_num;
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
.ref-card {
  border: none;
}

.heading {
  font-weight: bold;
  font-size: 15px;
}

.values {
  font-size: 15px;
}

.expansion_panel /deep/ .v-expansion-panel-header {
  align-items: flex-start !important;
}

.expansionpaneldummydiv .v-expansion-panel {
  flex: 1 0 25% !important;
  margin: 10px 50px !important;
  max-width: 40%;
  position: relative;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.expansion_panel /deep/ .v-expansion-panels {
  /* border-radius: 4px; */
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between !important;
  list-style-type: none;
  padding: 0;
  width: 100%;
  /* z-index: 1; */
}

.theme--light.v-sheet--outlined {
  border: none;
}

.expansion_panel /deep/ .v-expansion-panel::before {
  box-shadow: none !important;
}

.minusreferencerowclass {
  margin-bottom: -35px;
  margin-right: -55px;
}

.minusreferencebutton {
  height: 30px !important;
  padding: 0px 4px !important;
}
</style>
