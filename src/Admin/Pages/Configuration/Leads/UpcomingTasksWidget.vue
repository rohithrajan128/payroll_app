<template>
  <div>
    <VueElementLoading
      :active="loader"
      spinner="bar-fade-scale"
      color="var(--primary)"
    />
    <div class="uc-calls">
      <v-icon color="black" class="mr-2">mdi-format-list-checks</v-icon
      >{{ $t("upcoming_tasks") }}
    </div>
    <v-divider class="mt-2 mb-0"></v-divider>
    <div class="scroll-area" style="height:83vh;">
      <div class="time_line_card content">
        <div v-if="task_array.length > 0">
          <div
            class="vertical-timeline vertical-timeline--animate vertical-timeline--one-column"
            v-for="(task, task_index) in task_array"
            :key="task_index"
          >
            <div class="vertical-timeline-element">
              <div>
                <span class="vertical-timeline-element-icon bounce-in">
                  <v-icon
                    v-if="task.task_type == 'followup'"
                    class="icon-badge-style"
                    color="blue"
                    >mdi-message-check-outline</v-icon
                  >
                  <v-icon
                    color="green"
                    v-if="task.task_type == 'meeting'"
                    class="icon-badge-style"
                    >mdi-calendar-badge</v-icon
                  >
                  <v-icon
                    color="orange"
                    v-if="task.task_type == 'call_log'"
                    class="icon-badge-style"
                    >mdi-phone</v-icon
                  >
                </span>
                <div class="vertical-timeline-element-content bounce-in">
                  <h4 class="timeline-title">
                    <span v-if="task.task_type == 'followup'"
                      >{{ $t("followup_with") }}:</span
                    >
                    <span v-if="task.task_type == 'meeting'"
                      >{{ $t("meeting_with") }}:</span
                    >
                    <span v-if="task.task_type == 'call_log'"
                      >{{ $t("call_with") }}:</span
                    >
                  </h4>
                  <p class="m-0" v-if="task.link_to == 'Lead'">
                    {{ task.lead_name }}
                  </p>
                  <p class="m-0" v-if="task.link_to == 'Candidate'">
                    {{ task.candidate_data.name }}
                  </p>
                  <p class="m-0" v-if="task.link_to == 'Connect'">
                    {{ task.connect_data.business_name }}
                  </p>
                  <div v-if="task.task_type != 'followup'">
                    <span class="font-weight-bold"
                      >{{ $t("assigned_to") }}:</span
                    >
                    &nbsp;{{ task.assigned_to_data.full_name }}
                  </div>
                  <span class="vertical-timeline-element-date margin-interview">
                    {{ task.date | formatDate }}

                    <div>
                      {{ task.time | formatTime }}
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="no-data">
          {{ $t("no_details_found") }}
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
    task_array: [],
    loader: false,
  }),
  mounted() {
    this.fetchTasks();
  },
  methods: {
    fetchTasks() {
      this.loader = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_upcoming_tasks")
        .then((res) => {
          this.loader = false;
          if (res.data.status == "S") {
            this.task_array = res.data.task_array;
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
.upcoming_interview_title {
  font-size: 14px;
  font-weight: bold;
  margin-top: -8px;
}
.activity_font {
  margin: 24px 0px 33px 13px;
  font-weight: bold;
  font-size: 16px;
}
.card-height {
  height: 134px;
  border-bottom: 6px solid #ccc !important ;
  border-color: #f44336 !important;
  border-radius: 10px 10px 10px 10px;
}
.all_card_font {
  text-align: center;
  font-size: 40px;
  margin: 0px;
  font-weight: bold;
}

.text-hover:hover {
  color: green;
  font-weight: bold;
  cursor: pointer;
}
.text-hover-closed:hover {
  color: red;
  font-weight: bold;
  cursor: pointer;
}
.border-color-candidates {
  border-color: #14a6b1 !important;
}
.candidate_height {
  height: 100px;
}
/* .candiate_color {
  color: #12a2e0;
} */
.tracking_border {
  border-color: #f79202 !important;
}
.upcoming_interview_card {
  height: 300px;
  margin-left: -7px;
  border-radius: 10px 10px 10px 10px;
  overflow-y: scroll;
}
.candidate_border_style {
  background-color: #abcef157 !important;
  border: 1px solid aliceblue;
  border-radius: 5px 5px 5px 5px;
  padding: 2px;
  text-align: center;
  color: #3f6ad8;
  font-weight: bold;
}
.candiate_contact_color {
  color: #f69102;
  background: #ffd69c69 !important;
}
.rejected_color {
  color: red;
  background: #faadad75 !important;
}
.hired_color {
  color: green;
  background: #a0e1a066 !important;
}
.interview_border {
  background: #d6e9fd;
  height: 70px;
  margin: 10px;
  border-radius: 7px 7px 7px 7px;
  border-left: 5px solid #2b85df !important;
  padding: 10px;
  border: 1px solid aliceblue;
}
.display_interview {
  color: gray;
  font-size: 12px;
}
.candidate_hover:hover {
  color: #16aaff;
  cursor: pointer;
  font-weight: bold;
}
.cursor_pointer {
  cursor: pointer;
  transition: transform 0.5s;
}
.cursor_pointer:hover {
  transform: scale(1.05);
  font-weight: bold;
}
.link_color {
  /* color: #3f6ad8 !important; */
  position: absolute;
  right: 10px;
  top: 10px;
}
.v-tabs >>> .v-item-group {
  position: relative !important;
}
.time_line_card {
  width: 100%;
  padding: 24px;
}
.margin-interview {
  margin-left: -16px;
}
.no-data {
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: gray;
}
/* .scroll-container {
  height: 83vh;
  transition: 0.4s ease-in-out;
} */
.uc-calls {
  font-size: 16px;
  font-weight: bold;
  padding-left: 10px;
  padding-top: 5px;
}
.icon-badge-style {
  background: white;
  right: 3px;
}
</style>
