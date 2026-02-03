<template>
  <div class="container-fluid mt-3 p-0">
    <div class="mb-3 mx-auto">
      <div class="card-header">
        <div class="card-header-tab">
          <div class="card-header-title font-size-lg text-capitalize titlewrap">
            {{ $t("create_vendordetails") }}
          </div>
        </div>
      </div>
      <div class="card-body">
        <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />

        <v-form ref="form" v-model="valid">
          <div class="row">
            <div class="col-md-9">
              <v-layout>
                <v-flex xs12 md6 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field v-on="on" v-model="vendordetails.shortname" :rules="fieldRules"
                        v-bind:label="$t('short_name')" required class="required_field" outlined dense></v-text-field>
                    </template>
                    <span>{{ $t("short_name") }}</span>
                  </v-tooltip>
                </v-flex>
                <v-flex xs12 md6 pl-3>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field v-on="on" v-model="vendordetails.registered_name" :rules="fieldRules"
                        v-bind:label="$t('registered_name')" required class="required_field" outlined
                        dense></v-text-field>
                    </template>
                    <span>{{ $t("registered_name") }}</span>
                  </v-tooltip>
                </v-flex></v-layout>
              <v-layout>
                <v-flex xs12 md6 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field v-on="on" v-model="vendordetails.contact_name" v-bind:label="$t('contact_name')"
                        outlined dense></v-text-field>
                    </template>
                    <span>{{ $t("contact_name") }}</span>
                  </v-tooltip>
                </v-flex>
                <v-flex xs12 md6 pl-3>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field v-model="vendordetails.mobile" v-bind:label="$t('contact_no')" maxlength="10"
                        v-on="on" :rules="[...phoneRules]" @keypress.native="isNumber($event)" outlined
                        dense></v-text-field>
                    </template>
                    <span>{{ $t("contact_no") }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex xs12 md6 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field v-on="on" v-model="vendordetails.email_id" :rules="emailRules"
                        v-bind:label="$t('email')" outlined dense></v-text-field>
                    </template>
                    <span>{{ $t("email") }}</span>
                  </v-tooltip>
                </v-flex>

                <v-flex xs12 md6 pl-3>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field v-on="on" maxlength="15" v-model="vendordetails.gst_no" v-bind:label="$t('gstno')"
                        outlined dense></v-text-field>
                    </template>
                    <span>{{ $t("gstno") }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
              <!-- <v-layout>
                <v-flex xs12 md12 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-on="on"
                        maxlength="100"
                        counter
                        v-model="vendordetails.address"
                        v-bind:label="$t('address')"
                        outlined
                        dense
                      ></v-text-field>
                    </template>
                    <span>{{ $t("address") }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout> -->
            </div>

            <div class="col-md-3 pt-8">

              <MediaSelect :label="'Icon Image'" folder="VendorIconImage" :image="vendordetails.icon_image"
                :resizeheight="100" :resizewidth="100" @updateImage="updateImage"></MediaSelect>

            </div>
          </div>


          <v-layout>
            <v-flex xs12 md12 pl-2 pr-8>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-textarea rows="2" v-on="on" maxlength="100" counter v-model="vendordetails.address"
                    v-bind:label="$t('address')" outlined dense></v-textarea>
                </template>
                <span>{{ $t("address") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>


        </v-form>
        <div class="d-block text-right mt-5">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div v-on="on" class="d-inline-block mr-2">
                <v-btn v-on="on" small @click="$router.go(-1)" class="ma-1 font-weight-bold cancel-btn"
                  color="dark cancel_button">{{ $t("cancel") }}</v-btn>
              </div>
            </template>
            <span>{{ $t("cancel") }}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div v-on="on" class="d-inline-block">
                <v-btn :disabled="isDisabled" color="green darken-1" @click="saveVendordetails" small
                  class="mr-2 success hover_shine">
                  {{ $t("save") }}
                  <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
                </v-btn>
              </div>
            </template>
            <span>{{ $t("save") }}</span>
          </v-tooltip>
        </div>
      </div>

    </div>
  </div>
</template>
  
<script>
import VueElementLoading from "vue-element-loading";
import MediaSelect from "../Components/Upload/MediaSelect.vue";

export default {
  components: {
    VueElementLoading,
    MediaSelect,
  },
  data: () => ({
    valid: true,
    loader: false,
    isBtnLoading: false,
    isDisabled: false,
    openMedia: false,
    vendordetails: {
      shortname: "",
      registered_name: "",
      contact_name: "",
      mobile: "",
      email_id: "",
      address: "",
      icon_image: "",
      gst_no: "",
      active_status: 1,
    },

    items: [],
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
    numberRules() {
      return [(v) => !!v || this.$t("valid_number_required")];
    },
    phoneRules() {
      return [(v) => !v || v.length >= 10 || this.$t("valid_number_required")];
    },
  },

  created() { },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
              "fetchvendorbyslug?slug=" +
              this.$route.query.slug
            )
            .then((res) => {
              this.btnloading = false;
              this.loader = false;
              if (res.data.status == "S") {
                this.message = res.data.message;
                this.vendordetails = res.data.vendordetails;
              } else if (res.data.status == "E") {
                this.message = res.data.message;
              }
            })
            .catch((err) => {
              this.isDisabled = false;
              console.log("this error" + err);
            });
        }
      },
    },
  },

  methods: {
    saveVendordetails() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "createVendordetails",
            this.vendordetails
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
              this.message = res.data.message;
              this.$router.push({
                name: "vendordetails",
              });
            } else if (res.data.status == "E") {
              this.isBtnLoading = false;
              (this.isDisabled = false),
                this.flashMessage.error({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class",
                });
              this.clear();
            } else {
              this.isBtnLoading = false;
              this.flashMessage.error({
                message: this.array_data,
              });
              this.clear();
            }
          })
          .catch((err) => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.isBtnLoading = false;
            this.isDisabled = false;
            console.log("this error" + err);
          });
      }
    },

    clear() {
      this.$refs.form.reset();
    },

    updateImage(imagedata) {
      this.vendordetails.icon_image = imagedata;
    },
    upload_Image() {
      if (this.openMedia == false) {
        this.openMedia = true;
      } else {
        this.openMedia = false;
      }
    },

    isNumber(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      }
      return true;
    },
  },
};
</script>
<style scoped></style>