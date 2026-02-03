<template>
  <div class="main-20">
    <div flat color="white" class="py-2 px-3 d-flex action-header-bar">
      <!-- <page-title
        class="col-md-4"
        :heading="$t('contact_details')"
        :google_icon="google_icon"
      ></page-title> -->
      <div>
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
              label="Search"
              class="srch_bar"
              hide-details
            ></v-text-field>
          </template>
          <span>{{ $t("search") }}</span>
        </v-tooltip>
      </div>

      <div class="d-flex justify-content-end ml-4">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              medium
              color="primary"
              style="font-size: 30px"
              v-on="on"
              class="mr-5"
              @click="addcontcatlead(0)"
              >mdi-plus-circle</v-icon
            >
          </template>
          <span>{{ $t("add_new") }}</span>
        </v-tooltip>
      </div>
    </div>
    <v-divider class="mb-0 mt-1"></v-divider>
    <v-data-table
      :headers="headers"
      :items="contactLead"
      :loading="initval"
      :search="search"
    >
      <template v-slot:item="props">
        <tr>
          <td>
            {{ props.item.salutation }}&nbsp;{{ props.item.contact_name }}
          </td>
          <td>{{ props.item.contact_email }}</td>
          <td>+{{ props.item.phone_code }} {{ props.item.contact_phone }}</td>
          <td>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div
                  v-on="on"
                  class="maindivforswitch d-inline-block"
                  @click="
                    confirmPrimaryContactUpdate(
                      props.item.id,
                      props.item.is_primary
                    )
                  "
                >
                  <v-switch
                    v-model="props.item.is_primary"
                    color="success"
                    readonly
                  >
                  </v-switch>
                  <div
                    class="viconinswitchon"
                    v-if="props.item.is_primary == 1"
                  >
                    <img
                      src="@/assets/images/correct_switch.png"
                      height="20px"
                    />
                  </div>
                  <div
                    class="viconinswitchoff"
                    v-if="props.item.is_primary == 0"
                  >
                    <img
                      src="@/assets/images/delete_switch.png"
                      height="24px"
                    />
                  </div>
                </div>
              </template>
              <span>{{ $t("primary") }}</span>
            </v-tooltip>
          </td>

          <td class="text-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  class="mr-2 edit_btn icon_size"
                  v-on="on"
                  @click="addcontcatlead(props.item.id)"
                  >mdi-pencil-outline</v-icon
                >
              </template>
              <span>{{ $t("edit") }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  class="mr-2 edit_btn icon_size"
                  @click="deleteLeads(props.item.id, props.item.is_primary)"
                  color="error"
                  v-on="on"
                  >mdi-trash-can-outline</v-icon
                >
              </template>
              <span>{{ $t("delete") }}</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-dialog v-model="contacteditdialog" persistent max-width="600px">
      <v-toolbar color="primary">
        <span class="headline" style="color: white">{{
          $t("create_contact")
        }}</span>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              @click="closecontact"
              class="dialogcloseinuserdetails"
              style="color: white"
              v-on="on"
              >mdi-close</v-icon
            >
          </template>
          <span>{{ $t("close") }}</span>
        </v-tooltip>
      </v-toolbar>
      <v-card class="pt-6 px-3">
        <v-form ref="form" v-model="valid">
          <v-layout pt-2 wrap>
            <v-flex xs12 md3 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    v-bind:label="$t('salutation')"
                    v-on="on"
                    index="id"
                    item-value="shortname"
                    item-text="longname"
                    v-model="leadcontactDetails.salutation"
                    :items="salutation_array"
                    class="required_field"
                    :rules="fieldRules"
                    outlined
                    dense
                  ></v-autocomplete>
                </template>
                <span>{{ $t("salutation") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md9 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="leadcontactDetails.contact_name"
                    maxlength="200"
                    v-bind:label="$t('contact_name')"
                    required
                    outlined
                    dense
                    :rules="fieldRules"
                    class="required_field"
                  ></v-text-field>
                </template>
                <span>{{ $t("contact_name") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md12 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="leadcontactDetails.contact_email"
                    v-bind:label="$t('email')"
                    outlined
                    maxlength="200"
                    :rules="[...fieldRules, ...emailRules]"
                    dense
                    class="required_field"
                  ></v-text-field>
                </template>
                <span>{{ $t("email") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md12 pl-2>
              <div class="row">
                <div class="col-md-12">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        dense
                        outlined
                        v-bind:label="$t('country_code')"
                        v-on="on"
                        prefix="+"
                        @keypress.native="isNumber($event)"
                        maxlength="5"
                        required
                        :rules="fieldRules"
                        class="required_field input_field"
                        hide-details
                        v-model="leadcontactDetails.phone_code"
                      ></v-text-field>
                    </template>
                    <span>{{ $t("country_code") }}</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="leadcontactDetails.contact_phone"
                        class="required_field select_field"
                        v-bind:label="$t('contact_no')"
                        maxlength="15"
                        v-on="on"
                        :rules="fieldRules"
                        @keypress.native="isNumber($event)"
                        outlined
                        dense
                      ></v-text-field>
                    </template>
                    <span>{{ $t("contact_no") }}</span>
                  </v-tooltip>
                </div>
              </div>
            </v-flex>

            <!-- <v-flex xs12 md2 pl-2>
              <v-checkbox
                v-model="leadcontactDetails.is_primary"
                :label="$t('is_primary')"
                class="leadprimarycheckbox mt-0"
              ></v-checkbox>
            </v-flex> -->
          </v-layout>
          <div class="d-block text-right py-4">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on" class="d-inline-block mr-2">
                  <v-btn
                    v-on="on"
                    small
                    @click="closecontact"
                    :disabled="isBtnLoading"
                    class="ma-1 font-weight-bold cancel-btn"
                    color="dark cancel_button"
                    >{{ $t("cancel") }}</v-btn
                  >
                </div>
              </template>
              <span>{{ $t("cancel") }}</span>
            </v-tooltip>
            <!-- <v-btn @click="clear" class="mr-2 btn btn-link btn-sm">clear</v-btn> -->
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on" class="d-inline-block">
                  <v-btn
                    :disabled="isBtnLoading"
                    @click="submit"
                    small
                    class="mr-2 success hover_shine"
                    color="green darken-1"
                  >
                    {{ $t("submit") }}
                    <b-spinner
                      :disabled="isBtnLoading"
                      small
                      v-if="isBtnLoading"
                    ></b-spinner>
                  </v-btn>
                </div>
              </template>
              <span>{{ $t("submit") }}</span>
            </v-tooltip>
          </div>
        </v-form>
      </v-card>
    </v-dialog>
    <ConfirmDialog
      :show="showdeleteDialog"
      :cancel="canceldelete"
      :confirm="confirmdelete"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('want_to_delete_contact')"
    />

    <ConfirmDialog
      :show="showStatusDialog"
      :cancel="cancelStatus"
      :confirm="confirmStatus"
      :id="status_id"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('confirm_primary_update')"
    />
  </div>
</template>
      
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import ContactDetails from "../../Configuration/Leads/ContactDetails.vue";
export default {
  components: {
    PageTitle,
    ConfirmDialog,
    ContactDetails,
  },
  props: ["lead_parent_id", "add_contacts"],
  data: () => ({
    user: [],
    user_id: "",
    contactLead: [],
    valid: false,
    showStatusDialog: false,
    showdeleteDialog: false,
    contacteditdialog: false,
    initval: false,
    status_id: null,
    delete_id: null,
    next_seq: "",
    headers: [
      {
        text: "Contact Name",
        align: "left",
        value: "contact_name",
      },
      {
        text: "Email",
        align: "left",
        value: "contact_email",
      },
      {
        text: "Contact Number",
        align: "left",
        value: "contact_phone",
      },
      {
        text: "Is primary?",
        align: "left",
        value: "is_primary",
      },
      // {
      //   text: "Status",
      //   align: "left",
      //   value: "status",
      // },
      {
        text: "Actions",
        value: "",
        sortable: false,
        align: "center",
      },
    ],
    google_icon: {
      icon_name: "supervisor_account",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
    isBtnLoading: false,
    leadcontactDetails: {
      id: 0,
      lead_id: null,
      salutation: "",
      contact_name: "",
      phone_code: "",
      contact_phone: "",
      contact_email: "",
      is_primary: "",
    },
    salutation_array: [],
    sel_contact_id: null,
    is_primary_contact: null,
  }),
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
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
  watch: {
    lead_parent_id: {
      immediate: true,
      handler() {
        this.leadcontactDetails.lead_id = this.lead_parent_id;
      },
    },
    add_contacts: {
      immediate: true,
      handler() {
        if (this.add_contacts == true) {
          this.addcontcatlead(0);
        }
      },
    },
  },
  mounted() {
    this.fetchcontactDetails();
    this.fetchlookup();
  },
  methods: {
    changePrimaryContact() {
      if (this.is_primary_contact == 0) {
        this.initval = true;
        axios
          .get(
            process.env.VUE_APP_API_URL_ADMIN + "change_lead_primary_contact/",
            {
              params: {
                contact_id: this.sel_contact_id,
                lead_id: this.lead_parent_id,
              },
            }
          )
          .then((res) => {
            if (res.data.status == "S") {
              this.flashMessage.success({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.fetchcontactDetails();
              this.$emit("update-timeline");
              this.$emit("update-basic-details");
            } else {
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
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
            console.log("error", err);
          });
      } else {
        this.flashMessage.error({
          message: this.$t("should_have_least_one_primary"),
          time: 4000,
          blockClass: "custom-block-class",
        });
      }
    },
    fetchlookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "SALUTATION",
          },
        })
        .then((response) => {
          this.salutation_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    cancelStatus() {
      this.showStatusDialog = false;
    },
    confirmStatus() {
      this.changePrimaryContact();
      this.showStatusDialog = false;
    },
    confirmPrimaryContactUpdate(id, primary) {
      this.sel_contact_id = id;
      this.is_primary_contact = primary;
      this.showStatusDialog = true;
    },
    statusUpdate() {
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "updatestatusleadcontact", {
          id: this.status_id,
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.flashMessage.success({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.fetchcontactDetails();
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
          } else {
            this.flashMessage.error({
              message: res.data.message,
            });
            this.fetchcontactDetails();
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
    submit() {
      if (this.$refs.form.validate()) {
        this.isBtnLoading = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "create_contact_lead",
            this.leadcontactDetails
          )
          .then((res) => {
            this.isBtnLoading = false;
            if (res.data.status == "S") {
              this.contacteditdialog = false;
              this.flashMessage.success({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.closecontact();
              this.fetchcontactDetails();
              this.$emit("update-timeline");
              this.$emit("update-basic-details");
            } else {
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
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
            console.log("error", err);
          });
      }
    },

    canceldelete() {
      this.showdeleteDialog = false;
    },
    confirmdelete() {
      this.confirmDeleteLead();
      this.showdeleteDialog = false;
    },

    addcontcatlead(id) {
      this.initval = true;
      if (id > 0) {
        axios
          .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_contact_lead/" + id)
          .then((res) => {
            this.leadcontactDetails = res.data.data;
            this.initval = false;
            this.contacteditdialog = true;
          })
          .catch((err) => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            console.log(" error" + err);
            this.initval = false;
          });
      } else {
        this.leadcontactDetails.id = 0;
        this.contacteditdialog = true;
        this.initval = false;
      }
    },

    fetchcontactDetails() {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "getcontactlead/" +
            this.lead_parent_id
        )
        .then((res) => {
          this.contactLead = res.data.contact_lead;
          this.initval = false;
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
          this.initval = false;
        });
    },

    deleteLeads(id, primary) {
      this.is_primary_contact = primary;
      this.delete_id = id;
      this.showdeleteDialog = true;
    },

    isNumber(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      }
      return true;
    },

    closecontact() {
      this.contacteditdialog = false;
      this.$refs.form.reset();
    },

    confirmDeleteLead() {
      if (this.is_primary_contact == 0) {
        this.initval = true;
        axios
          .delete(
            process.env.VUE_APP_API_URL_ADMIN +
              "delete_contact_lead/" +
              this.delete_id
          )
          .then((res) => {
            if (res.data.status == "S") {
              this.flashMessage.success({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.initval = false;
              this.fetchcontactDetails();
              this.$emit("update-timeline");
            } else {
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.initval = false;
              this.fetchcontactDetails();
            }
          })
          .catch((err) => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.initval = false;
            console.log("this error" + err);
          });
      } else {
        this.flashMessage.error({
          message: this.$t("should_have_least_one_primary"),
          time: 4000,
          blockClass: "custom-block-class",
        });
      }
    },
  },
};
</script>
<style scoped>
.select_field {
  position: absolute;
  right: 12px;
  top: 12px;
  width: 62%;
  height: 20px !important;
}

.select_field /deep/ .v-label--active {
  background: white;
  /* padding: 0px 12px 0px 12px; */
}

.leadprimarycheckbox /deep/ .v-label {
  margin-top: 6px !important;
}

/* .select_field /deep/ .v-input__control {
  padding-right: 3px !important;
} */
.action-header-bar {
  display: flex;
  justify-content: end;
  margin-right: -12px;
}
</style>