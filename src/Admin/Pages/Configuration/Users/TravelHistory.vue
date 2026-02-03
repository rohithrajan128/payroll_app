<template>
  <div class="main-20">
    <v-tabs color="#3f6ad8" left>
      <v-tab
        ><span class="tab-title"
          ><i class="fa fa-envelope pl-3 mr-2"></i>
          {{ $t("passport_details") }}
        </span></v-tab
      >
      <v-tab
        ><i class="fa fa-vcard pl-2 mr-1" aria-hidden="true"></i
        ><span class="tab-title">{{ $t("visa_details") }}</span>
      </v-tab>
      <v-tab
        ><span class="tab-title"
          ><i class="fa fa-vcard pl-2 mr-2" aria-hidden="true"></i
          >{{ $t("travel_details") }}</span
        ></v-tab
      >
      <v-tab-item>
        <v-sheet class="mt-8 pl-6" v-if="user_id && passportdatalength == 0">
          <VueElementLoading
            :active="loader"
            spinner="bar-fade-scale"
            color="var(--primary)"
          />

          <div v-if="!loader" class="d-flex">
            <div>
              <h5 class="usernamedisplaytravel">
                {{ $t("does_the") }} {{ user_name }} {{ $t("has_passport?") }}
              </h5>
            </div>
            <div>
              <v-radio-group
                row
                inline
                v-model="havepassport"
                class="userdetailsoftravel"
                @change="traveldetails('passport', havepassport)"
                :readonly="
                  view != 'userview' || !status || passportdatalength >= 1
                "
              >
                <v-radio label="Yes" class="radio_items" :value="1"></v-radio>
                <v-radio label="No" class="radio_items" :value="0"></v-radio>
              </v-radio-group>
            </div>
          </div>
        </v-sheet>
        <div v-if="getuserDetails">
          <v-sheet class="mt-1" v-if="havepassport == 1 && showsecondrow">
            <PassportDetails
              :user_id="user_id"
              :view="view"
              :status="status"
              @passportDataLength="passportDataLength"
            />
          </v-sheet>
        </div>
      </v-tab-item>
      <v-tab-item>
        <v-sheet class="mt-8 pl-6" v-if="user_id && visadatalength == 0">
          <div class="d-flex">
            <div>
              <h5 class="usernamedisplaytravel">
                {{ $t("has") }} {{ user_name }} {{ $t("travelled_abroad?") }}
              </h5>
            </div>
            <div>
              <v-radio-group
                inline
                row
                v-model="havetravelabroad"
                class="userdetailsoftravel"
                :disabled="havepassport == 0 && showsecondrow == false"
                @change="traveldetails('abroad', havetravelabroad)"
                :readonly="view != 'userview' || !status || visadatalength >= 1"
              >
                <v-radio label="Yes" class="radio_items" :value="1"></v-radio>
                <v-radio label="No" class="radio_items" :value="0"></v-radio>
              </v-radio-group>
            </div>
          </div>
        </v-sheet>
        <v-sheet
          class="mt-1"
          v-if="havetravelabroad == 1 && showallrow && getuserDetails"
        >
          <VisaDetails
            :user_id="user_id"
            :view="view"
            :status="status"
            @visaDataLength="visaDataLength"
          />
        </v-sheet>
      </v-tab-item>
      <v-tab-item>
        <v-sheet class="mt-1">
          <div
            v-if="havetravelabroad == 0 && showallrow == false"
            class="visa_text"
          >
            {{ $t("please_add_visa_details") }}
          </div>
          <div v-else>
            <!-- v-if="havetravelabroad == 1 && showallrow" -->
            <TravelHistoryDetails
              :user_id="user_id"
              :view="view"
              :status="status"
            />
          </div>
        </v-sheet>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
import PassportDetails from "../Users/PassportDetails.vue";
import VisaDetails from "../Users/VisaDetails.vue";
import TravelHistoryDetails from "../Users/TravelhistoryDetails.vue";
export default {
  props: ["user_id", "view", "user_name", "status"],
  components: {
    VueElementLoading,
    PassportDetails,
    VisaDetails,
    TravelHistoryDetails,
  },
  data: () => ({
    visadatalength: null,
    passportdatalength: null,
    havetravelabroad: 0,
    havepassport: 0,
    loader: false,
    showsecondrow: false,
    getuserDetails: false,
    showallrow: false,
  }),
  mounted() {},
  created() {},

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },

  watch: {
    user_id: {
      immediate: true,
      handler() {
        this.getuserDetails = true;
        this.GetTravelstatus();
      },
    },
  },
  methods: {
    passportDataLength(passportDataLength) {
      this.passportdatalength = passportDataLength;
    },
    visaDataLength(visaDataLength) {
      this.visadatalength = visaDataLength;
    },
    traveldetails(name, value) {
      if (name == "passport") {
        this.showsecondrow = false;
      }
      this.loader = true;
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "changetraveldetailinuser", {
          userID: this.user_id,
          status: value,
          target: name,
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.showsecondrow = true;
            this.loader = false;
            this.GetTravelstatus();
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          this.loader = false;
          console.log(" error" + err);
        });
    },

    GetTravelstatus() {
      this.loader = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "gettravelstatus/" + this.user_id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.havepassport = res.data.passport_status;
            this.havetravelabroad = res.data.travel_status;
            if (this.havepassport == 1) {
              this.showsecondrow = true;
            }
            if (this.havetravelabroad == 1) {
              this.showallrow = true;
            }
            if (this.havepassport == null) {
              this.havepassport = 0;
            }
            if (this.havetravelabroad == null) {
              this.havetravelabroad = 0;
            }
            this.loader = false;
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
          this.loader = false;
        });
    },
  },
};
</script>

<style scoped>
.usernamedisplaytravel {
  font-size: 15px;
  font-weight: 500;
}

.radio_items {
  margin-left: 30px;
  align-items: flex-start !important;
}

.v-label {
  padding-top: 1px !important;
}

.v-input--radio-group--column .v-input--radio-group__input {
  flex-direction: row !important;
}

.userdetailsoftravel {
  margin: 0px;
  margin-left: auto;
}

.maindivfortravelradio {
  align-items: baseline;
  display: inline-flex;
  padding: 0% !important;
}
.visa_text {
  text-align: center;
  margin-top: 20px;
  /* font-weight: 700; */
}
</style>
