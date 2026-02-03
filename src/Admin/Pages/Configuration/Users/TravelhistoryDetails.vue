<template>
  <div>
    <v-app-bar flat color="white">
      <div class="add_btn_end">
        <v-tooltip bottom v-if="user_id">
          <template v-slot:activator="{ on }">
            <v-btn
              v-if="view == 'userview' && status"
              class="btn mr-2 mb-2 hover_shine add_new"
              small
              v-on="on"
              @click="travelhistoryAddbtn"
            >
              {{ $t("add") }}
            </v-btn>
          </template>
          <span>{{ $t("add") }}</span>
        </v-tooltip>
      </div>
    </v-app-bar>
    <v-data-table
      :headers="headers"
      class="pt-3"
      :items="travel_data"
      :loading="initval"
    >
      <template v-slot:item="props">
        <!-- {{props.item}} -->
        <tr>
          <td v-if="props.item.fetchvisadetails">
            {{ props.item.fetchvisadetails.visa_no }}
          </td>
          <td v-else>Visa on Arrival</td>

          <td v-if="props.item.passport_no_or_issuing_auth">
            {{ props.item.passport_no_or_issuing_auth }}
          </td>
          <td v-else>{{ $t("not_appllicable") }}</td>
          <td v-if="props.item.visa_auth">{{ props.item.visa_auth }}</td>
          <td v-else>{{ $t("not_appllicable") }}</td>
          <td>{{ props.item.dept_date | formatDate }}</td>
          <td>{{ props.item.date_of_arrival | formatDate }}</td>
          <td>{{ props.item.purpose_of_visit }}</td>
          <!-- <td>{{ props.item.regions_visited }}</td> -->

          <td style="max-width: 300px">
            <div v-if="props.item.regions_visited.length > 0">
              <div v-if="props.item.region_expand">
                <v-chip
                  v-for="(regions, index) in props.item.regions_visited"
                  :key="index"
                  x-small
                  color="primary"
                  class="ma-1"
                  >{{ regions }}</v-chip
                >
                <v-chip
                  class="mr-1"
                  variant="outlined"
                  color="success"
                  v-bind:class="[
                    props.item.region_expand ? 'warning' : 'success',
                  ]"
                  x-small
                  style="cursor: pointer"
                  @click="props.item.region_expand = false"
                >
                  <span>
                    {{ $t("hide") }}
                    <v-icon x-small
                      >mdi-arrow-up-drop-circle-outline</v-icon
                    ></span
                  >
                </v-chip>
              </div>
              <div v-else>
                <div
                  v-if="
                    props.item.regions_visited.length > 2 &&
                    props.item.regions_visited.length != 3
                  "
                >
                  <span
                    v-for="(regions, index) in props.item.regions_visited"
                    :key="index"
                  >
                    <v-chip
                      v-if="index < 2"
                      class="mr-1"
                      variant="outlined"
                      color="primary"
                      x-small
                    >
                      {{ regions }}
                    </v-chip>
                  </span>
                  <v-chip
                    class="mr-1"
                    variant="outlined"
                    color="success"
                    v-bind:class="[
                      props.item.region_expand ? 'warning' : 'success',
                    ]"
                    x-small
                    style="cursor: pointer"
                    @click="props.item.region_expand = true"
                  >
                    <span
                      >+ {{ props.item.regions_visited.length - 2 }} more
                      <v-icon x-small
                        >mdi-arrow-down-drop-circle-outline</v-icon
                      >
                    </span>
                  </v-chip>
                </div>
                <div v-else>
                  <v-chip
                    v-for="(regions, i) in props.item.regions_visited"
                    :key="i"
                    class="mr-1"
                    variant="outlined"
                    color="primary"
                    x-small
                  >
                    {{ regions }}
                  </v-chip>
                </div>
                <div v-if="props.item.regions_visited.length == 3">
                  <span
                    v-for="(regions, j) in props.item.regions_visited"
                    :key="j"
                  >
                    <v-chip
                      v-if="i < 3"
                      class="mr-1"
                      variant="outlined"
                      color="primary"
                      x-small
                    >
                      {{ regions }}
                    </v-chip>
                  </span>
                </div>
              </div>
            </div>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>

          <td v-if="view == 'userview' && status">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  class="mr-3 edit_btn icon_size"
                  v-on="on"
                  @click="editTravel(props.item.id)"
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
    <v-dialog
      persistent
      v-model="dialog"
      fullscreen
      transition="dialog-bottom-transition"
      max-width="1100px"
    >
      <v-card>
        <v-toolbar color="primary" dark>
          <span class="headline">{{ $t("create_amend_travel_details") }}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon @click="close" class="dialogcloseinuserdetails" v-on="on"
                >mdi-close</v-icon
              >
            </template>
            <span>{{ $t("close") }}</span>
          </v-tooltip>
        </v-toolbar>
        <v-alert
          v-if="save_error"
          :text="save_error"
          color="error"
          icon="warning"
          outlined
          dismissible
        >
          {{ valertdialogmessage }}</v-alert
        >
        <v-form ref="userform" v-model="valid">
          <v-card-text class="mt-8">
            <v-container grid-list-md>
              <v-layout wrap>
                <v-row
                  v-if="
                    travelDetails.visa_no != '0' &&
                    travelDetails.visa_no != '' &&
                    visa_expiry_date != ''
                  "
                >
                  <v-spacer></v-spacer>
                  <div class="row displaypassportdetailsinvisa">
                    <span> {{ $t("visa_issue_date") }} :</span>
                    <b class="ml-2"> {{ visa_issue_date | formatDate }}</b>
                    <span class="ml-8"> {{ $t("visa_expiry_date") }} :</span>
                    <b class="ml-2"> {{ visa_expiry_date | formatDate }}</b>
                  </div>
                </v-row>
              </v-layout>
              <v-layout wrap>
                <v-flex md4 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-autocomplete
                        dense
                        outlined
                        v-on="on"
                        v-bind:label="$t('visa_no')"
                        :rules="fieldRules"
                        class="required_field"
                        v-model="travelDetails.visa_no"
                        @change="getPassport(travelDetails.visa_no)"
                        :items="visaDetails"
                        item-text="visa_issued"
                        item-value="id"
                      ></v-autocomplete>
                    </template>
                    <span>{{ $t("visa_no") }}</span>
                  </v-tooltip>
                </v-flex>
                <v-flex
                  md4
                  pl-2
                  v-if="
                    travelDetails.visa_no != 0 || travelDetails.visa_no == ''
                  "
                >
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-on="on"
                        :disabled="travelDetails.visa_no != 0"
                        dense
                        outlined
                        v-bind:label="$t('passport_no/issuing_auth')"
                        v-model="travelDetails.passport_no_or_issuing_auth"
                      ></v-text-field>
                    </template>
                    <span>{{ $t("passport_no/issuing_auth") }}</span>
                  </v-tooltip>
                </v-flex>
                <v-flex md4 pl-2 v-else>
                  <!-- <v-text-field
                        v-on="on"
                        :disabled="travelDetails.visa_no != 0"
                        dense
                        outlined
                        v-bind:label="$t('passport_no/issuing_auth')"
                        v-model="travelDetails.passport_no_or_issuing_auth"
                      ></v-text-field> -->

                  <v-autocomplete
                    index="id"
                    v-bind:label="$t('passport_no/issuing_auth')"
                    item-value="passport_no"
                    item-text="passport_no"
                    class="required_field"
                    v-model="travelDetails.passport_no_or_issuing_auth"
                    :rules="fieldRules"
                    :items="all_passport_details"
                    @change="getAuthority(travelDetails.visa_no)"
                    outlined
                    dense
                  ></v-autocomplete>
                </v-flex>
                 <v-flex md4 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-on="on"
                        :disabled="travelDetails.visa_no != 0"
                        dense
                        outlined
                        v-bind:label="$t('visa_auth')"
                        v-model="travelDetails.visa_auth"
                      ></v-text-field>
                    </template>
                    <span>{{ $t("visa_auth") }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
              <v-layout wrap>
               
              </v-layout>
              <v-layout wrap>
                <v-flex md4 pl-2>
                  <DatePicker
                    :label="$t('dept_date')"
                    :rules="fieldRules"
                    :class_required="'RequiredField'"
                    :stored_date="travelDetails.dept_date"
                    :max="new Date().toISOString().substr(0, 10)"
                    @formatted_date="formatteddeptdate"
                  />
                </v-flex>
                <v-flex md4 pl-2>
                  <DatePicker
                    :label="$t('date_of_arrival')"
                    :rules="fieldRules"
                    :class_required="'RequiredField'"
                    :stored_date="travelDetails.date_of_arrival"
                    :min="travelDetails.dept_date"
                    @formatted_date="formatteddateofarrival"
                  />
                </v-flex>
                  <v-flex md4 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        dense
                        outlined
                        v-on="on"
                        v-bind:label="$t('purpose_of_visit')"
                        :rules="fieldRules"
                        class="required_field"
                        v-model="travelDetails.purpose_of_visit"
                        maxlength="200"
                        counter
                      ></v-text-field>
                    </template>
                    <span>{{ $t("purpose_of_visit") }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
              <v-layout wrap>
              
                <v-flex md12 pl-2>
                  <v-combobox
                    v-model="travelDetails.regions_visited"
                    chips
                    multiple
                    required
                    :rules="fieldRules"
                    class="required_field"
                    outlined
                    dense
                    v-bind:label="$t('region_visited')"
                  >
                    <template
                      v-slot:selection="{ attrs, item, select, selected }"
                    >
                      <v-chip
                        small
                        v-bind="attrs"
                        :input-value="selected"
                        @click="select"
                        color="primary"
                        class="ma-1"
                      >
                        {{ item }}
                      </v-chip>
                    </template>
                  </v-combobox>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions class="container">
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on" class="d-inline-block mr-2">
                  <v-btn
                    v-on="on"
                    small
                    @click="close"
                    class="ma-1 font-weight-bold mb-3"
                    color="secondary"
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
                  @click="savetraveldetails()"
                  small
                  class="mr-2 success hover_shine mb-3"
                  color="green darken-1"
                  :disabled="isBtnLoading"
                >
                  {{ $t("submit") }}
                  <b-spinner small v-if="isBtnLoading"></b-spinner>
                </v-btn>
              </template>
              <span> {{ $t("submit") }} </span>
            </v-tooltip>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <ConfirmDialog
      :show="showConfirmDialog"
      :cancel="cancel"
      :confirm="confirmDelete"
      :id="delete_id"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('delete_confirmation')"
    />
  </div>
</template>
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import DatePicker from "../Components/DatePicker.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
export default {
  props: ["user_id", "view", "status"],
  components: {
    PageTitle,
    DatePicker,
    ConfirmDialog,
  },
  data: () => ({
    initval: false,
    delete_id: null,
    showConfirmDialog: false,
    valertdialogmessage: "",
    save_error: false,
    travelDetails: {
      id: 0,
      emp_id: "",
      visa_no: "",
      passport_no_or_issuing_auth: "",
      visa_auth: "",
      purpose_of_visit: "",
      regions_visited: "",
      dept_date: "",
      date_of_arrival: "",
    },
    visa_issue_date: "",
    visa_expiry_date: "",
    valid: true,
    travel_data: [],
    all_passport_details: [],
    dialog: false,
    isBtnLoading: false,
    visaDetails: [],
  }),
  mounted() {},
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    headers() {
      if (this.view == "userview" && this.status) {
        return [
          {
            text: "Visa No",
            align: "left",
            value: "fetchvisadetails.visa_no",
          },
          {
            text: "Passport No/Issuing Authority",
            align: "left",
            value: "passport_no_or_issuing_auth",
          },

          {
            text: "Visa Authority",
            value: "visa_auth",
            align: "left",
          },
          {
            text: "Departure date",
            value: "dept_date",
            align: "left",
          },
          {
            text: "Arrival in Country",
            value: "date_of_arrival",
            align: "left",
          },
          {
            text: "Purpose of Trip",
            value: "purpose_of_visit",
            align: "left",
          },
          {
            text: "Regions Visited",
            value: "regions_visited",
            align: "left",
          },
          {
            text: "Action",
            value: "",
            align: "left",
          },
        ];
      } else {
        return [
          {
            text: "Visa No",
            align: "left",
            value: "fetchvisadetails.visa_no",
          },
          {
            text: "Passport No/Issuing Authority",
            align: "left",
            value: "passport_no_or_issuing_auth",
          },

          {
            text: "Visa Authority",
            value: "visa_auth",
            align: "left",
          },
          {
            text: "Departure date",
            value: "dept_date",
            align: "left",
          },
          {
            text: "Date of Arrival",
            value: "date_of_arrival",
            align: "left",
          },
          {
            text: "Purpose of Trip",
            value: "purpose_of_visit",
            align: "left",
          },
          {
            text: "Regions Visited",
            value: "regions_visited",
            align: "left",
          },
        ];
      }
    },
  },
  mounted() {
    this.$eventBus.$on("visa_length", this.addVisa);
  },

  watch: {
    user_id: {
      immediate: true,
      handler() {
        if (this.user_id) {
          this.save_error = false;
          this.fetchVisadetails();
          this.fetchtraveldetailsdata();
        }
      },
    },
  },
  methods: {
    getPassport(visano) {
      if (visano == 0) {
        
        this.travelDetails.visa_auth = "";
        this.travelDetails.passport_no_or_issuing_auth = "";
      } else {
        var issuing_auth = this.visaDetails.find((x) => x.id == visano);
        this.visa_issue_date = issuing_auth.date_of_issue;
        this.visa_expiry_date = issuing_auth.date_of_expiry;
        this.travelDetails.visa_auth = issuing_auth.visa_issuing_authority;
        this.travelDetails.passport_no_or_issuing_auth =
          issuing_auth.fetchpassportdetails.passport_no;
      }
    },
    confirmDelete() {
      this.deleteVisaDetails();
      this.showConfirmDialog = false;
    },
    cancel() {
      this.showConfirmDialog = false;
    },
    deleteItem(id) {
      this.delete_id = id;
      this.showConfirmDialog = true;
    },
    deleteVisaDetails() {
      this.initval = true;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "deletetravelhistorydetails",
          {
            id: this.delete_id,
          }
        )
        .then((response) => {
          if (response.data.status == "S") {
            this.initval = false;
            this.flashMessage.success({
              message: response.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.fetchtraveldetailsdata();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addVisa() {
      this.fetchVisadetails();
    },
    fetchVisadetails() {
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetchvisadetailslov/" +
            this.user_id
        )
        .then((response) => {
          if (response.data.status == "S") {
            this.visaDetails = response.data.visadetails;
            this.all_passport_details = response.data.all_passport_details;
            this.visaDetails.unshift({
              id: "0",
              visa_issued: "Visa on Arrival",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editTravel(id) {
      this.travelDetails = [];
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetchtraveldetailsdatasforedit/" +
            id
        )
        .then((response) => {
          if (response.data.status == "S") {
            this.travelDetails = response.data.data;
            console.log(this.travelDetails);
            if (this.travelDetails.visa_no > 0) {
              this.getPassport(this.travelDetails.visa_no);
            }
            if (this.travelDetails.visa_no == 0) {
              this.travelDetails.visa_no = "0";
            }
            this.initval = false;
            this.dialog = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    savetraveldetails() {
      if (this.$refs.userform.validate()) {
        this.isBtnLoading = true;
        this.travelDetails.emp_id = this.user_id;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "createtraveldetails",
            this.travelDetails
          )
          .then((response) => {
            if (response.data.status == "S") {
              this.flashMessage.success({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.$refs.userform.reset();
              this.isBtnLoading = false;
              this.close();
              this.fetchtraveldetailsdata();
            } else if (response.data.status == "EXIST") {
              this.valertdialogmessage = response.data.message;
              this.isBtnLoading = false;
              this.save_error = true;
            } else if (response.data.status == "OL") {
              this.valertdialogmessage = response.data.message;
              this.isBtnLoading = false;
              this.save_error = true;
            }
          })
          .catch((err) => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.isBtnLoading = false;
          });
      }
    },
    fetchtraveldetailsdata() {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetchtraveldetailsdatas/" +
            this.user_id
        )
        .then((response) => {
          if (response.data.status == "S") {
            this.travel_data = response.data.traveldetails;
            this.initval = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    travelhistoryAddbtn() {
      this.fetchVisadetails();
      if (this.visaDetails < 1) {
        this.flashMessage.error({
          message: this.$t("add_visa_details_first"),
          time: 4000,
          blockClass: "custom-block-class",
        });
      } else {
        this.travelDetails.emp_id = this.user_id;
        this.travelDetails.id = 0;
        this.save_error = false;
        this.valertdialogmessage = "";
        this.dialog = true;
      }
    },
    close() {
      this.$refs.userform.reset();
      this.dialog = false;
      this.visa_expiry_date = "";
      this.visa_issue_date = "";
    },
    formatteddeptdate(formatted_date) {
      this.travelDetails.dept_date = formatted_date;
      if (this.travelDetails.dept_date > this.travelDetails.date_of_arrival) {
        this.travelDetails.date_of_arrival = "";
      }
    },
    formatteddateofarrival(formatted_date) {
      this.travelDetails.date_of_arrival = formatted_date;
    },
  },
};
</script>
<style scoped>
.add_btn_end {
  width: 100%;
  text-align: end;
}
.displaypassportdetailsinvisa {
  position: absolute;
  right: 157pt;
  margin-bottom: 10px;
  font-size: 14px;
  color: #04043c;
}
</style>
