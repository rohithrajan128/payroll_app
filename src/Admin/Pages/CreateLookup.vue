<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <button v-on="on" x-small rounded class="btn btn-primary rounded-circle lookup_plus_btn" type="button"
          @click="addlookupvalue">
          <v-icon class="text-white" small>mdi-plus</v-icon>
        </button>
      </template>
      <span>{{ $t("add_lookup") }}</span>
    </v-tooltip>
    <v-dialog v-model="lookupdialog" persistent max-width="600px">
      <v-toolbar color="primary">
        <span class="headline" style="color: white;">{{ $t("create") }} {{ $t('lookup') }}
          <span v-if="dropdownlabel">( {{ dropdownlabel }} )</span></span>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon @click="closeLookup" class="dialogcloseinuserdetails" v-on="on"
              style="color: white;">mdi-close</v-icon>
          </template>
          <span>{{ $t("close") }}</span>
        </v-tooltip>
      </v-toolbar>
      <v-card>
        <v-form ref="form" v-model="valid">
          <v-layout pt-5 px-6>
            <v-flex xs12 md12 pr-1>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field dense v-on="on" v-model="lookupItem.shortname" :rules="fieldRules" :error="lookup_error"
                    :error-messages="lookup_error_message" @keyup="clearerrors()" v-bind:label="$t('lookup_name')"
                    required class="required_field" outlined></v-text-field>
                </template>
                <span>{{ $t("shortname") }}</span>
              </v-tooltip>
            </v-flex>
            <!-- <v-flex xs12 md6 pl-1>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field dense v-on="on" v-model="lookupItem.longname" :rules="fieldRules"
                    v-bind:label="$t('longname')" required class="required_field" outlined></v-text-field>
                </template>
                <span>{{ $t("longname") }}</span>
              </v-tooltip>
            </v-flex> -->
          </v-layout>

          <div class="text-right mr-6 pb-4">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on" class="d-inline-block mr-2">
                  <v-btn v-on="on" small @click="closeLookup" class="ma-1 font-weight-bold cancel-btn"
                    color="dark cancel_button">{{ $t("cancel") }}</v-btn>
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
                    <b-spinner small v-if="isBtnLoading"></b-spinner>
                  </v-btn>
                </div>
              </template>
              <span>{{ $t("submit") }}</span>
            </v-tooltip>
          </div>
        </v-form>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
export default {
  props: ['lookup_parent_name', 'dropdownlabel'],
  components: {
  },
  data: () => ({
    lookupdialog: false,
    lookup_error_message: "",
    lookup_error: false,
    valid: true,
    isBtnLoading: false,
    lookupItem: {
      shortname: "",
      parentname: "",
    },
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },

  created() { },
  watch: {
    lookup_parent_name: {
      immediate: true,
      handler() {
        this.lookupItem.parentname = this.lookup_parent_name;
        this.isBtnLoading = false;
      },
    },
  },
  methods: {
    clearerrors() {
      this.lookup_error = false;
      this.lookup_error_message = "";
    },
    addlookupvalue() {
      this.isBtnLoading = false;
      this.lookupdialog = true;
    },
    closeLookup() {
      this.isBtnLoading = false;
      this.lookup_error = false;
      this.lookup_error_message = "";
      this.$refs.form.reset();
      this.lookupdialog = false;
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.isBtnLoading = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "createlookupsdropdown",
            this.lookupItem
          )
          .then((res) => {
            if (res.data.status == "S") {
              this.isBtnLoading = false;
              this.$emit("lookup_data", res.data);
              setTimeout(() => {
                this.closeLookup();
              }, 100);
            }
            else {
              this.isBtnLoading = false;
              this.lookup_error = true;
              this.lookup_error_message = res.data.message;
            }
          })
          .catch((err) => {
            this.$emit("lookup_data", res.data);
            setTimeout(() => {
              this.closeLookup();
            }, 100);
            console.log("error", err);
          });

      }
    },

  },
};
</script>
<style scoped>
.lookup_plus_btn {
  height: 30px;
  width: 30px;
  margin-top: 5px;
  text-align: center;
  padding-inline: inherit;
  padding-left: 0.8px;
  padding-top: 2px;
}
</style>