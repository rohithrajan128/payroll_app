<template>
  <div class="counter-class">
    <div class="row">
      <div class="col-md-12 col-xl-12 pb-0 mt-1">
        <div class="card widget-content" style="padding: 9px 16px" @click="redirectTo('call_logs')">
          <div class="widget-content-outer">
            <div class="widget-content-wrapper">
              <div class="widget-content-left">
                <div class="widget-heading">
                  <v-icon class="pr-2 font-18" color="black">mdi-phone</v-icon
                  >Calls
                </div>
              </div>
              <div class="widget-content-right">
                <div class="widget-subheading">Scheduled</div>
                <div class="widget-numbers text-warning">
                  {{ calls.scheduled }}
                </div>
              </div>
              <div class="widget-content-right">
                <div class="widget-subheading">Done</div>
                <div class="widget-numbers text-success">
                  {{ calls.done }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-12 col-xl-12 pb-0">
        <div class="card widget-content" style="padding: 9px 16px" @click="redirectTo('meetings')">
          <div class="widget-content-outer">
            <div class="widget-content-wrapper">
              <div class="widget-content-left">
                <div class="widget-heading">
                  <v-icon class="pr-2 font-18" color="black"
                    >mdi-calendar-badge</v-icon
                  >Meeting
                </div>
              </div>
              <div class="widget-content-right">
                <div class="widget-subheading">Scheduled</div>
                <div class="widget-numbers text-warning">
                  {{ meeting.scheduled }}
                </div>
              </div>
              <div class="widget-content-right">
                <div class="widget-subheading">Done</div>
                <div class="widget-numbers text-success">
                  {{ meeting.done }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-12 col-xl-12 pb-0">
        <div class="card widget-content" style="padding: 9px 16px" @click="redirectTo('followup')">
          <div class="widget-content-outer">
            <div class="widget-content-wrapper">
              <div class="widget-content-left">
                <div class="widget-heading">
                  <v-icon class="pr-2 font-18" color="black"
                    >mdi-message-check-outline</v-icon
                  >Follow-up
                </div>
              </div>
              <div class="widget-content-right">
                <div class="widget-subheading">Scheduled</div>
                <div class="widget-numbers text-warning">
                  {{ followup.scheduled }}
                </div>
              </div>
              <div class="widget-content-right">
                <div class="widget-subheading">Done</div>
                <div class="widget-numbers text-success">
                  {{ followup.done }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
export default {
  components: {
    VueElementLoading,
  },
  data: () => ({
    loader: false,
    calls: {
      scheduled: 0,
      done: 0,
    },
    meeting: {
      scheduled: 0,
      done: 0,
    },
    followup: {
      scheduled: 0,
      done: 0,
    },
  }),
  mounted() {
    this.fetchDetails();
  },
  methods: {
    redirectTo(tab){
      this.$router.push({
        name: "lead_activities",
        query: {
          tab:tab
        },
      });
    },
    fetchDetails() {
      this.loader = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_lead_count_details")
        .then((res) => {
          this.loader = false;
          if (res.data.status == "S") {
            this.followup = res.data.followup;
            this.meeting = res.data.meeting;
            this.calls = res.data.calls;
          } else if (res.data.status == "E") {
            this.message = res.data.message;
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
          }
        })
        .catch((err) => {
          this.loader = false;
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
        });
    },
  },
};
</script>

<style scoped>
.counter-class {
  margin-left: -30px;
  padding-top: 35px;
}
.font-18 {
  font-size: 18px;
}
.bg-call {
  background: #abcef157;
  color: #3f6ad8;
}
.bg-meet {
  background: #ffd69c69;
  color: #f69102;
}
.bg-follow {
  background: #a0e1a066;
  color: green;
}
.count-data {
  border-radius: 10px;
  font-weight: bold;
  text-align: center;
  font-size: 18px;
}
.widget-content-left {
  width: 100px;
}
.widget-content:hover{
  cursor: pointer;
   /* transform: translateY(2px); */
   box-shadow: 0px 0px 4px;
   transition: 0.3s;
}
</style>