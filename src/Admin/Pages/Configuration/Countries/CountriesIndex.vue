<template>
  <div class="main-20">
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title class="col-md-4" :heading="$t('countries')" :google_icon="google_icon"></page-title>
      <div class="search_item col-md-6">
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
              v-bind:label="$t('search')"
              hide-details
              class="srch_bar"
            ></v-text-field>
          </template>
          <span>{{ $t("search") }}</span>
        </v-tooltip>
      </div>
      <div class="col-md-2">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <router-link
            class="text-decoration-none"
            :to="{ name: 'countries.amend' }"
          >
            <v-btn
              color=" btn hover_shine add_new"
              small
              class="mb-2"
              v-on="on"
            >{{ $t("add_new") }}</v-btn>
          </router-link>
        </template>
        <span>{{ $t("add_new") }}</span>
      </v-tooltip>
    </div>
    </div>
    <!-- IMPORT START -->
    <v-form ref="form" v-model="valid">
      <v-flex xs12 md12>
        <div v-if="alertdisabel">
          <v-alert
            v-show="valid_error == true && valid_success == false"
            color="error"
            icon="warning"
            outlined
          >
            <div class="readmore">{{ message }}</div>
            <a
              v-if="message.length > 100"
              class="text-primary"
              @click="Readmore(message)"
            >{{ $t("more") }}</a>
          </v-alert>
        </div>
        <div v-if="alertshow">
          <v-alert
            v-show="valid_error == true && valid_success == false"
            color="error"
            icon="warning"
            outlined
          >
            {{ errormessage
            }}
            <a class="text-primary ml-2" @click="Readless(message)">{{ $t("less") }}</a>
          </v-alert>
        </div>
        <v-alert
          v-show="valid_error == false && valid_success == true"
          outlined
          type="success"
          text
        >{{ successmessage }}</v-alert>
        <div no-body class="mb-1">
          <b-card-header header-tag="header" v-b-toggle.accordion1 class="p-1" role="tab">
            <div class="pl-2 pr-2 d-block">{{ $t("file_upload") }}</div>
          </b-card-header>
          <b-collapse id="accordion1" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <div class="text-center">
                <v-progress-circular
                  v-if="loading"
                  :size="70"
                  :width="7"
                  color="purple"
                  indeterminate
                ></v-progress-circular>
              </div>
              <v-flex xs12 md6>
                <div class="row">
                  <div class="col-6">
                    <span>
                      <v-row>
                        <v-file-input
                          :prepend-icon="null"
                          prepend-inner-icon="mdi-microsoft-excel"
                          ref="filedata"
                          :rules="fieldRules"
                          @change="selectFile"
                          v-bind:label="$t('file_input')"
                        ></v-file-input>
                      </v-row>
                    </span>
                  </div>
                  <div>
                    <v-btn
                      :disabled="!valid"
                      class="btn-shadow-primary btn btn-primary btn-lg"
                      @click="uploadCountries"
                    >{{ $t("upload") }}</v-btn>

                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <a :href="'/files/country_upload_template.xlsx'" download>
                          <img
                            v-on="on"
                            class="img_align img-responsive mr-2 image ml-5 img_items"
                            src="@/assets/images/xlsxicon.png"
                            alt
                          />
                        </a>
                      </template>
                      <span>{{ $t("download_template") }}</span>
                    </v-tooltip>
                  </div>
                </div>
              </v-flex>
            </b-card-body>
          </b-collapse>
        </div>
      </v-flex>
    </v-form>
    <!-- IMPORT END -->
    <v-data-table
      :headers="headers"
      :items="countries"
      :search="search"
      :loading="initval"
      v-bind:no-data-text="$t('no_data_available')"
      :footer-props="{
        'items-per-page-text': $t('rows_per_page'),
      }"
    >
      <template v-slot:item="props">
        <tr>
          <td>{{ props.item.name }}</td>
          <td class="justify-center align-items-center layout px-0">
            <router-link
              small
              class="mr-2"

              :to="{
                name: 'countries.amend',
                query: { slug: props.item.slug },
              }"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon small class="mr-2 edit_btn icon_size" v-on="on">mdi-pencil-outline</v-icon>
                </template>
                <span>{{ $t("edit") }}</span>
              </v-tooltip>
            </router-link>

            <router-link
              small
              class="mr-2"
              :to="{
                name: 'states',
                params: {
                  id: props.item.id,
                  parentname: props.item.name,
                },
              }"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon small class="mr-2 settings_icon icon_size" v-on="on">lnr-cog</v-icon>
                </template>
                <span>{{ $t("add_state") }}</span>
              </v-tooltip>
            </router-link>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  class="delete_btn icon_size"
                  v-on="on"
                  small
                  @click="deleteItem(props.item.id)"
                >mdi-trash-can-outline</v-icon>
              </template>
              <span>{{ $t("delete") }}</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
    </v-data-table>
    <ConfirmDialog
      :show="showConfirmDialog"
      :cancel="cancel"
      :confirm="confirm"
      :id="delete_id"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('delete_confirmation')"
    />
  </div>
</template>

<script>
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
export default {
  components: {
    PageTitle,
    ConfirmDialog
  },
  data: () => ({
    loading: false,
    uploaded_file: "",
    valid: false,
    cities: [],
    valid_error: false,
    valid_success: false,
    search: "",
    dialog: false,
    initval: true,
    lookups: [],
    countries: [],
    message: "",
    google_icon: {
      icon_name: "flag",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined"
    },
    successmessage: "",
    errormessage: {},
    alertshow: false,
    alertdisabel: true,
    showConfirmDialog: false,
    delete_id: null
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
          text: this.$t("name"),
          value: "name"
        },
        {
          text: this.$t("action"),
          align: "center",
          value: "class_name"
        }
      ];
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },
  mounted() {},

  methods: {
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm(id) {
      this.deleteConfirm(id);
      this.showConfirmDialog = false;
    },

    deleteItem(template_id) {
      this.delete_id = template_id;
      this.showConfirmDialog = true;
    },

    Readmore(message) {
      this.alertshow = true;
      this.alertdisabel = false;
      this.errormessage = message;
    },
    Readless(message) {
      this.alertshow = false;
      this.alertdisabel = true;
      this.message = message;
    },
    initialize() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_countries")
        .then(response => {
          this.countries = response.data.countries;
          this.initval = false;
        })
        .catch(err => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          this.initval = false;
          console.log(err);
        });
    },
    deleteConfirm(id) {
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "delete_countries/" + id)
        .then(res => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.flashMessage.success({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class"
            });
            this.initialize();
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class"
            });
          } else {
            this.flashMessage.error({
              message: this.array_data
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
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    // UPLOAD CITIES OR SUBURBS
    selectFile(file) {
      this.validate = true;
      this.uploaded_file = file;
    },

    uploadCountries() {
      this.message = "";
      this.loading = true;
      this.valid = false;
      if (this.uploaded_file == "") {
        this.valid_error = true;
        this.valid_success = false;
        this.$vuetify.goTo(0);
        return;
      }
      let formData = new FormData();
      formData.append("uploaded_file", this.uploaded_file);
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "uploadcountry", formData)
        .then(res => {
          this.loading = false;
          this.valid = true;
          if (res.data.status == "E") {
            this.valid_error = true;
            this.valid_success = false;
            this.colorcode = "error";
            for (var i = 0; i < res.data.message.length; i++) {
              this.message = this.message + " " + res.data.message[i];
            }
            this.$vuetify.goTo(0);
          } else {
            this.valid_error = false;
            this.valid_success = true;
            this.successmessage = res.data.message; //"File uploded successfully";
            this.uploaded_file = "";
            this.$refs.filedata.reset();
            this.initialize();
          }
        })
        .catch(err => {
          this.valid_success = false;
          this.valid_error = true;
          this.valid = true;
          this.colorcode = "error";
          this.loading = false;
          this.message = this.$t("contact_admin");
          this.$vuetify.goTo(0);
          console.log(err);
        });
    }
  }
};
</script>
<style scoped>
.readmore {
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.upload_btn{
background: #2a6396;
}
.img_items{
  width: 50px !important;
}
</style>
