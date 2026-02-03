<template>
  <div class="main-20">
    <v-card elevation="0">
      <div flat color="white" class="row mt-2 mb-1 mx-2 align-items-center">
        <div class="col-md-9">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-text-field dense rounded-pill density="compact" outlined rounded small v-on="on" v-model="search"
                append-icon="search" label="Search" class="srch_bar" hide-details></v-text-field>
            </template>
            <span>{{ $t("search") }}</span>
          </v-tooltip>
        </div>
        <div class="col-md-3" style="display: flex; justify-content: end">

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn color="btn hover_shine add_new" small class="mr-3" v-on="on" @click="opencontactdialog()">{{
                $t("add_new") }}</v-btn>
            </template>
            <span>{{ $t("add_new") }}</span>
          </v-tooltip>

        </div>
      </div>
    </v-card>
    <v-data-table :headers="headers" :items="contact_details" :search="search" :loading="initval">
      <template v-slot:item="{ item }">
        <tr>
          <td>
            <span v-if="item.salutation">
              {{ item.salutation }}</span>
            {{ item.name }}
          </td>
          <td>{{ item.email }} </td>
          <td>
            + {{ item.contact_no_code }}
            {{ item.contact_no }}</td>
          <td>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on" class="maindivforswitch d-inline-block"
                  @click="changeprimarycontact(item.id, item.primary, item.salutation, item.name, item.contact_no_code, item.contact_no)">
                  <v-switch v-model="item.primary" color="success" readonly>
                  </v-switch>
                  <div class="viconinswitchon" v-if="item.primary == 1">
                    <img src="@/assets/images/correct_switch.png" height="20px" />
                  </div>
                  <div class="viconinswitchoff" v-if="item.primary == 0">
                    <img src="@/assets/images/delete_switch.png" height="24px" />
                  </div>
                </div>
              </template>
              <span>{{ $t("primary") }}</span>
            </v-tooltip>
          </td>
          <td class="px-0 text-center">

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon small class="mr-2 edit_btn icon_size" v-on="on"
                  @click=opencontactdialog(item)>mdi-pencil-outline</v-icon>
              </template>
              <span>{{ $t("edit") }}</span>
            </v-tooltip>

            <v-tooltip bottom >
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" class="delete_btn icon_size" :disabled="item.primary==1" @click="deleteItem(item)">mdi-trash-can-outline</v-icon>
              </template>
              <span>{{ $t("delete") }}</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
    </v-data-table>

    <v-dialog v-model="contactdialog" persistent max-width="650px" style="overflow-x:hidden;">
      <v-toolbar color="primary">
        <span class="headline" style="color: white;">{{ $t("create_contact") }}
        </span>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon @click="closedialog()" class="dialogcloseinuserdetails" v-on="on"
              style="color: white;">mdi-close</v-icon>
          </template>
          <span>{{ $t("close") }}</span>
        </v-tooltip>
      </v-toolbar>
      <v-card>
        <v-form ref="form" v-model="valid">
          <div class="row px-6 pt-4 pb-6 m-0">
            <div class="col-md-3 pr-1 pb-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete v-bind:label="$t('salutation')" v-on="on" index="id" item-value="shortname"
                    :rules="fieldRules" required class="required_field" item-text="longname"
                    v-model="contact_connect.salutation" :items="salutation_array" outlined dense></v-autocomplete>
                </template>
                <span>{{ $t("salutation") }}</span>
              </v-tooltip>
            </div>
            <div class="col-md-9 pl-1 pb-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field v-on="on" v-model="contact_connect.name" :rules="fieldRules" v-bind:label="$t('name')"
                    required class="required_field" maxlength="100" outlined dense></v-text-field>
                </template>
                <span>{{ $t("name") }}</span>
              </v-tooltip>
            </div>
            <div class="col-md-12 py-0 my-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field v-on="on" v-model="contact_connect.email" :rules="[...fieldRules, ...emailRules]"
                    v-bind:label="$t('email')" required class="required_field" maxlength="100" outlined
                    dense></v-text-field>
                </template>
                <span>{{ $t("email") }}</span>
              </v-tooltip>
            </div>
            <div class="col-md-12 pt-0 my-0">
              <div class="row">
                <div class="col-md-12">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field dense prefix="+" outlined v-bind:label="$t('country_code')" v-on="on" required
                        :rules="fieldRules" @keypress.native="isNumber($event)" class="required_field input_field"
                        hide-details maxlength="5" v-model="contact_connect.contact_no_code"></v-text-field>
                    </template>
                    <span>{{ $t("country_code") }}</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field maxlength=15 v-on="on" v-model="contact_connect.contact_no"
                        @keypress.native="isNumber($event)" class="required_field select_field" required
                        :rules="fieldRules" v-bind:label="$t('contact_no')" outlined dense></v-text-field>
                    </template>
                    <span>{{ $t("contact_no") }}</span>
                  </v-tooltip>
                </div>
              </div>
            </div>
          </div>
        </v-form>
        <div class="d-block text-right pb-6 pr-6">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div class="d-inline-block mr-2">
                <v-btn v-on="on" small class="ma-1 font-weight-bold cancel-btn" color="secondary"
                  @click="closedialog()">{{
                    $t("cancel") }}</v-btn>
              </div>
            </template>
            <span>{{ $t("cancel") }}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div v-on="on" class="d-inline-block">
                <v-btn :disabled="isBtnLoading" color="green darken-1" @click="submit" small
                  class="mr-2 success hover_shine">
                  {{ $t("submit") }}
                  <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
                </v-btn>
              </div>
            </template>
            <span>{{ $t("submit") }}</span>
          </v-tooltip>
        </div>
      </v-card>
    </v-dialog>

    <ConfirmDialog :show="showConfirmDialog" :cancel="cancel" :confirm="confirm" :id="delete_id"
      v-bind:title="$t('confirm')" v-bind:description="$t('delete_confirmation')" />
  </div>
</template>
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
export default {
  props: ['connect_id', 'menuclick'],
  components: { PageTitle, ConfirmDialog },
  data: () => ({
    search: "",
    isBtnLoading: false,
    valid: false,
    salutation_array: [],
    contactdialog: false,
    initval: false,
    contact_details: [],
    contact_connect: {
      id: 0,
      parent: 0,
      salutation: "",
      name: "",
      email: "",
      contact_no_code: "",
      contact_no: "",
    },
    primary_or_not: 0,
    showConfirmDialog: false,
    delete_id: null,
    google_icon: {
      icon_name: "contacts",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    message: "",
  }),

  computed: {
    headers() {
      return [
        {
          text: this.$t("name"),
          value: "name",
          align: "left",
        },
        {
          text: this.$t("email"),
          value: "email",
        },
        {
          text: this.$t("contact_no"),
          value: "mobile_no",
        },
        {
          text: this.$t("primary"),
          value: "primary",
        },
        {
          text: this.$t("action"),
          align: "center",
          value: "class_name",
        },
      ];
    },
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

  created() {
    this.fetchlookups();
  },
  watch: {
    connect_id: {
      immediate: true,
      handler() {
        if (this.connect_id > 0) {
          this.contact_connect.parent = this.connect_id;
          this.fetchRecruitmentContacts();
        }
      }
    },
    menuclick: {
      immediate: true,
      handler() {
        if (this.menuclick && this.connect_id > 0) {
          this.contact_connect.parent = this.connect_id;
          this.opencontactdialog();
        }
      }
    }
  },

  methods: {
    opencontactdialog(item) {
      if (item) {
        this.contact_connect = item;
        this.primary_or_not = item.primary;
      }
      else {
        this.primary_or_not = 0;
        this.contact_connect.id = 0;
        this.contact_connect.salutation = "";
        this.contact_connect.name = "";
        this.contact_connect.email = "";
        this.contact_connect.contact_no_code = "";
        this.contact_connect.contact_no = "";
      }
      this.isBtnLoading = false;
      this.contactdialog = true;
    },
    deleteItem(item) {
      this.delete_id = item.id;
      this.showConfirmDialog = true;
    },
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm(id) {
      this.initval = true;
      this.deleteContact(id);
      this.showConfirmDialog = false;
    },

    changeprimarycontact(id, primary, salutation, name, contact_no_code, contact_no) {
      if (primary == 0) {
        this.initval = true;
        axios
          .get(
            process.env.VUE_APP_API_URL_ADMIN +
            "change_recruitment_primary_contact/" +
            id
          )
          .then((res) => {
            if (res.data.status == "S") {
              this.flashMessage.success({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.fetchRecruitmentContacts();
              this.$eventBus.$emit("update_primary_contact", salutation, name, contact_no, contact_no_code);
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
      else {
        this.flashMessage.error({
          message: this.$t("should_have_least_one_primary"),
          time: 4000,
          blockClass: "custom-block-class",
        });
      }
    },

    deleteContact(id) {
      axios
        .delete(
          process.env.VUE_APP_API_URL_ADMIN +
          "delete_recruitment_contacts_by_id/" +
          id
        )
        .then((res) => {

          if (res.data.status == "E") {
            this.flashMessage.error({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
          } else {
            this.flashMessage.success({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.fetchRecruitmentContacts();
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

    fetchlookups() {
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


    submit() {
      if (this.$refs.form.validate()) {
        this.contact_connect.parent = this.connect_id;
        this.isBtnLoading = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "save_recruitment_contact",
            this.contact_connect
          )
          .then((res) => {
            if (res.data.status == "S") {
              this.contactdialog = false;
              this.isBtnLoading = false;
              if (this.primary_or_not == 1) {
                this.$eventBus.$emit("update_primary_contact", this.contact_connect.salutation, this.contact_connect.name, this.contact_connect.contact_no, this.contact_connect.contact_no_code);
              }
              this.flashMessage.success({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.closedialog();
              this.fetchRecruitmentContacts();
            } else {
              this.isBtnLoading = false;
              this.contactdialog = false;
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
            }
          })
          .catch((err) => {
            this.isBtnLoading = false;
            this.contactdialog = false;
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            console.log("error", err);
          });
      }
    },
    closedialog() {
      this.contactdialog = false;
      this.primary_or_not = 0;
      this.contact_connect.id = 0;
    },
    fetchRecruitmentContacts() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_recruitment_contacts/" + this.connect_id)
        .then((res) => {
          if (res.data.status == "S") {
            this.initval = false;
            this.contact_details = res.data.contact_details;
          } else if (res.data.status == "E") {
            this.initval = false;
            this.flashMessage.error({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
          } else {
            this.initval = false;
            this.flashMessage.error({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            console.log("error message", res.data.message);
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
  },
};
</script>
<style scoped>
.select_field {
  position: absolute;
  right: 12px !important;
  top: 12px;
  width: 62%;
  height: 20px !important;
}

.select_field /deep/ .v-label--active {
  background: white;
  padding: 0px 12px 0px 12px;
}
</style>
