<template>
  <div class="p-3">
    <VueElementLoading
      :active="loader"
      spinner="bar-fade-scale"
      color="var(--primary)"
    />
    <div class="">
      <v-form ref="form" v-model="notes_valid">
        <v-textarea
          clearable
          class="pr-6"
          clear-icon="mdi-close-circle"
          v-bind:label="$t('comments')"
          v-model="notes.description"
          outlined
          rows="1"
          @keyup.enter="submitNotes"
        ></v-textarea>
      </v-form>
    </div>
    <div class="d-flex justify-content-end">
      <v-btn
        small
        @click="submitNotes()"
        color="green darken-1"
        class="mr-2 success"
        :disabled="!notes.description.trim() || isDisabled || isbtnLoading"
      >
        {{ $t("save_coments") }}
        <b-spinner
          @click="submitNotes()"
          :disabled="true"
          small
          v-if="isbtnLoading"
        ></b-spinner>
      </v-btn>
    </div>
    <v-divider></v-divider>
    <div class="notes_item">
      <div v-if="!allNotes.length > 0" class="text-center">
        <span>{{ $t("no_notes_available") }}</span>
      </div>

      <div
        v-for="(selected_candidate_notes, selected_notes_index) in allNotes"
        :key="selected_notes_index"
      >
        <div class="readmore mt-1">
          {{ selected_candidate_notes.description }}
        </div>
        <a
          v-if="selected_candidate_notes.description.length > 70"
          class="text-primary"
          @click="Readmore(selected_candidate_notes)"
          >{{ $t("more") }}</a
        >
        <div style="color: grey; margin-top: 10px; font-size: 11px">
          <span>{{ $t("created_on") }}</span
          >&nbsp;:&nbsp;
          <i>
            <span>
              {{ selected_candidate_notes.created_at | formatDateTime }} </span
            >&nbsp;by&nbsp;<span
              >{{ selected_candidate_notes.firstname }}&nbsp;{{
                selected_candidate_notes.lastname
              }}</span
            >
          </i>
        </div>
        <div
          class="text-end w-100 mr-3"
          v-if="
            selected_notes_index == 0 &&
            user.hr_employee.id == selected_candidate_notes.notes_by
          "
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                v-on="on"
                small
                class="mr-4 edit_btn"
                @click="editNotes(selected_candidate_notes)"
                >mdi-pencil-outline</v-icon
              >
            </template>
            <span>{{ $t("edit") }}</span>
          </v-tooltip>
        </div>
        <v-divider class="mt-3"></v-divider>
      </div>
    </div>
    <div class="text-center">
      <v-dialog v-model="descriptiondialog" width="800">
        <v-card>
          <v-card-title
            class="text-h5 primary lighten-2 d-flex justify-content-between text-white"
          >
            <div>
              {{ $t("notes") }}
            </div>
            <div>
              <v-icon
                @click="descriptiondialog = false"
                class="close-btn-x text-white"
                >mdi-close-thick</v-icon
              >
            </div>
          </v-card-title>
          <div class="d-flex justify-content-center p-3">
            <div>{{ selected.description }}</div>
          </div>
          <div
            style="
              color: grey;
              font-size: 12px;
              padding-left: 16px;
              padding-bottom: 10px;
            "
          >
            <span>{{ $t("created_on") }}</span
            >&nbsp;:&nbsp;
            <i>
              <span> {{ selected.date | formatDateTime }} </span
              >&nbsp;by&nbsp;<span>{{ selected.by }}</span>
            </i>
          </div>

          <!-- <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
          </v-card-actions> -->
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import VueElementLoading from "vue-element-loading";

export default {
  props: ["candidate_id", "job_id"],
  components: {
    VueElementLoading,
  },
  computed: {},
  data: () => ({
    date: new Date(
      Date.now() - new Date().getTimezoneOffset() * 60000
    ).toISOString(),
    loader: false,
    allNotes: [],
    notes_valid: true,
    notes: {
      notes_by: null,
      candidate_id: null,
      job_id: null,
      description: "",
    },
    descriptiondialog: false,
    user: "",
    isbtnLoading: false,
    isDisabled: false,
    selected: {
      description: "",
      date: "",
      by: "",
    },
    icon: "pe-7s-drawer icon-gradient bg-happy-itmeo",
  }),
  watch: {
    candidate_id: {
      immediate: true,
      handler() {
        if (this.candidate_id) {
          this.user = JSON.parse(localStorage.getItem("user"));
          this.notes.job_id = this.job_id;
          this.loader = true;
          this.notes.candidate_id = this.candidate_id;
          this.loader = false;
          this.getNotes();
        }
      },
    },
  },

  methods: {
    editNotes(msg_data) {
      this.notes = msg_data;
    },
    Readmore(data) {
      this.descriptiondialog = true;
      this.selected.description = data.description;
      this.selected.date = data.created_at;
      this.selected.by = data.firstname + " " + data.lastname;
    },
    submitNotes() {
      if (this.$refs.form.validate()) {
        this.isbtnLoading = true;
        if (this.notes.description == "") {
          this.flashMessage.error({
            message: this.$t("enter_notes"),
          });
          this.isbtnLoading = false;
        } else {
          this.notes.candidate_id = this.candidate_id;
          // Form is valid, process
          axios
            .post(
              process.env.VUE_APP_API_URL_ADMIN + "create_notes",
              this.notes
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
                this.isbtnLoading = false;
                this.loader = false;
                this.notes_dialog = false;
                this.notes.description = "";
                this.getNotes();
              } else if (res.data.status == "E") {
                this.flashMessage.error({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class",
                });
                this.isbtnLoading = false;
              } else {
                this.isbtnLoading = false;
                this.flashMessage.error({
                  message: this.array_data,
                });
              }
            })
            .catch((err) => {
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
              console.log("this error", err);
            });
        }
      } else {
        alert("Form is Invalid");
      }
    },
    getNotes() {
      this.loader = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetch_saved_notes_candidate_id",
          {
            params: {
              candidate_id: this.candidate_id,
              job_id: this.job_id,
            },
          }
        )
        .then((res) => {
          this.loader = false;
          this.allNotes = res.data.savednotes;
        })
        .catch((err) => {
          this.loader = false;

          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          this.loader = false;
          console.log("this error", err);
        });
    },
  },
};
</script>
<style scoped>
.notes-scroller {
  height: 286px;
  overflow-y: scroll;
}
.readmore {
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.v-application .pr-6 {
  padding-right: 0px !important;
}
.notes_txt_align {
  text-align: center !important;
}
.scroll-section {
  max-height: 500px;
  overflow-y: scroll;
}
.notes_item {
  max-height: 300px;
  overflow-y: scroll;
}
</style>
