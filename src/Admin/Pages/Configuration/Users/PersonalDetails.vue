<template>
  <div class="main-20">
    <!-- <div class="pagetitle_in_userdetails">
      <page-title
        :heading="$t('reference')"
        :google_icon="google_icon"
      ></page-title>
    </div> -->
    <div>
      <v-app-bar flat color="white">
        <h4>{{ $t("references") }}</h4>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn class="btn mr-2 mb-2 hover_shine add_new" small v-on="on" @click="dialog_open_when_add">
              {{ $t("add") }}
            </v-btn>
          </template>
          <span>{{ $t("add") }}</span>
        </v-tooltip>
      </v-app-bar>
      <!-- <v-data-table
        :loading="initval"
        :headers="headers"
        :items="reflist"
        v-bind:no-data-text="$t('no_data_available')"
        :footer-props="{ 'items-per-page-text': $t('rows_per_page') }"
      >
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.ref_emp_id }}</td>
            <td>{{ props.item.position }}</td>
            <td>{{ props.item.organisation }}</td>
            <td>{{ props.item.contact_no }}</td>
            <td>{{ props.item.pincode }}</td>
            <td>{{ props.item.state }}</td>
            <td>{{ props.item.city }}</td>
            <td class="text-center px-0" >
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    small
                    class="mr-3 edit_btn icon_size"
                    v-on="on"
                    @click="editreference(props.item.id)"
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
                    @click="deletereference(props.item.id)"
                    >mdi-trash-can-outline</v-icon
                  >
                </template>
                <span>{{ $t("delete") }}</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table> -->

      <!-- <div class="d-flex justify-center ma-4">
      <v-card width="350" elevation="5">
        <v-card-title>references</v-card-title>
        <v-card-subtitle>Your data is ready</v-card-subtitle>
        <v-card-text>
         name:{{props.item.}}
        </v-card-text>
        <v-card-actions>
          <v-btn text color="primary">Download</v-btn>
          <v-btn text>Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </div> -->

      <div class="container row justify-content-between mt-5 d-flex ">
        <v-card width="350" elevation="5" class="col-md-5 mt-5 ref-card card-hover-shadow"
          v-for="(reference, i) in reflist" :key="i" outlined>
          <v-list-item three-line>
            <v-list-item-content class="ref_items">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-list-item-title v-on="on" class="text-h6 ref-card text-capitalize mb-1">
                    {{ $t("references") }}
                  </v-list-item-title>
                </template>
                <span>{{ $t("references") }}</span>
              </v-tooltip>

              <v-list-item-subtitle class="text-h6 ref-name text-capitalize mb-1">{{ $t("name") }}: {{ reference.name
              }}</v-list-item-subtitle>
              <v-list-item-subtitle class="text-capitalize">{{ $t("position") }}:
                {{ reference.position }}</v-list-item-subtitle>
              <v-list-item-subtitle>{{ $t("organisation") }}:
                {{ reference.organisation }}</v-list-item-subtitle>
              <v-list-item-subtitle>{{ $t("contact_no") }}:
                {{ reference.contact_no }}</v-list-item-subtitle>
              <v-list-item-subtitle>{{ $t("pincode") }}:
                {{ reference.pincode }}</v-list-item-subtitle>
              <v-list-item-subtitle>{{ $t("state") }}: {{ reference.state }}</v-list-item-subtitle>
              <v-list-item-subtitle>{{ $t("city") }}: {{ reference.city }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-card-actions class="justify-content-between">
            <v-icon small class="mr-3 edit_btn icon_size" v-on="on" @click="editreference(reference.id)">
              mdi-pencil-outline</v-icon>

            <div>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon class="delete_btn icon_size" v-on="on" small
                    @click="deletereference(reference.id)">mdi-trash-can-outline</v-icon>
                </template>
                <span>{{ $t("delete") }}</span>
              </v-tooltip>
            </div>
          </v-card-actions>
        </v-card>
      </div>

      <v-dialog persistent v-model="dialog" max-width="1100px">
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
          <v-alert v-model="save_error" :text="save_error" color="error" icon="warning" outlined dismissible>
      {{ valertdialogmessage }}</v-alert>
          <v-form ref="referenceform" v-model="valid">
            <v-card-text class="mt-8 ref-card">
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm3 md3 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" v-model="referencedetails.name" :rules="fieldRules" dense
                          v-bind:label="$t('name')" outlined class="required_field"></v-text-field>
                      </template>
                      <span>{{ $t("name") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 sm3 md3 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" v-model="referencedetails.ref_emp_id" :rules="fieldRules" dense
                          v-bind:label="$t('ref_emp_id')" outlined class="required_field"></v-text-field>
                      </template>
                      <span>{{ $t("ref_emp_id") }}</span>
                    </v-tooltip>
                  </v-flex>

                  <v-flex xs12 sm3 md3 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" v-model="referencedetails.position" :rules="fieldRules" dense
                          v-bind:label="$t('position')" outlined class="required_field"></v-text-field>
                      </template>
                      <span>{{ $t("position") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 sm3 md3 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" v-model="referencedetails.organisation" :rules="fieldRules" dense
                          v-bind:label="$t('organisation')" outlined class="required_field"></v-text-field>
                      </template>
                      <span>{{ $t("organisation") }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex xs12 sm3 md3 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" v-model="referencedetails.contact_no" :rules="fieldRules" dense
                          v-bind:label="$t('contact_no')" outlined maxlength="10" v-on:keypress="NumbersOnly"
                          class="required_field"></v-text-field>
                      </template>
                      <span>{{ $t("contact_no") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 sm3 md3 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" v-model="referencedetails.pincode" :rules="fieldRules" dense
                          v-bind:label="$t('pincode')" outlined maxlength="6" v-on:keypress="NumbersOnly"
                          class="required_field"></v-text-field>
                      </template>
                      <span>{{ $t("pincode") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 sm3 md3 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" v-model="referencedetails.city" :rules="fieldRules" dense
                          v-bind:label="$t('city')" outlined class="required_field"></v-text-field>
                      </template>
                      <span>{{ $t("city") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 sm3 md3 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" v-model="referencedetails.state" :rules="fieldRules" dense
                          v-bind:label="$t('state')" outlined class="required_field"></v-text-field>
                      </template>
                      <span>{{ $t("state") }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" @click="save()" small class="mr-2 success hover_shine mb-3" color="green darken-1"
                    :disabled="submit_credential_disable">
                    {{ $t("submit") }}
                    <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
                  </v-btn>
                </template>
                <span> {{ $t("submit") }} </span>
              </v-tooltip>
            </v-card-actions>
          </v-form>
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
  props: ["user_id", "view"],
  data: () => ({
    valertdialogmessage:"",
    save_error: false,
    google_icon: {
      icon_name: "Badge",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    message: "",
    delete_id: "",
    dialog: false,
    initval: false,
    isBtnLoading: false,
    valid: true,
    reflist: [],
    dialogDelete: false,
    referencedetails: {
      id: "0",
      ref_emp_id: "",
      name: "",
      position: "",
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
      },
    },
  },

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },
  methods: {
    fetchreference() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getallreference/")
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
      this.$refs.referenceform.reset();
    },
    closeDelete() {
      this.dialogDelete = false;
    },
    save() {
      if (this.$refs.referenceform.validate()) {
        this.submit_credential_disable = true;
        this.isBtnLoading = true;
        this.referencedetails.user_emp_id = this.user_id;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "createreference",
            this.referencedetails
          )
          .then((response) => {
            if (response.data.status == "S") {
              this.flashMessage.success({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.close();
              this.fetchreference();
            }
            if (response.data.status == "E") {
              this.valertdialogmessage = response.data.message;
              this.save_error=true;
              // this.close();
              // this.fetchreference();
            }
          })
          .catch((err) => {
            this.valertdialogmessage = this.$t("something_went_wrong");
            this.save_error=true;
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
            this.referencedetails = res.data.ref_num[0];
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
.ref-name {
  background: linear-gradient(90deg, chocolate, rgba(163, 165, 42, 0.331));
  background-clip: border-box;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.ref_items {
  max-width: 200px !important;
}
</style>
