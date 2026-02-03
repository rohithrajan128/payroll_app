<template>
  <div v-bind:class="[view == 'widget' ? '' : '']">
    <VueElementLoading
      :active="loader"
      spinner="bar-fade-scale"
      color="var(--primary)"
    />
    <div>
      <div class="main-20">
        <div
          flat
          color="white"
          class="py-3 px-3 d-flex action-header-bar"
          v-bind:class="[view == 'widget' ? 'm-18' : '']"
        >
          <!-- <div class="col-md-10">
            <page-title
              v-if="view != 'widget'"
              :heading="$t('notes')"
              :google_icon="google_icon"
            ></page-title>
            <h5 v-else class="pt-2">{{ $t("latest_notes") }}</h5>
          </div> -->
          <div class="d-flex justify-content-end">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  v-if="view != 'widget'"
                  medium
                  color="primary"
                  v-on="on"
                  class="mr-5"
                  style="font-size:30px"
                  @click="addLeadNotes()"
                  >mdi-plus-circle</v-icon
                >
                <v-btn
                  style="position: absolute; right: 34px; top: 0px"
                  v-else
                  x-small
                  @click="addLeadNotes()"
                  outlined
                  color="black"
                  icon
                >
                  <v-icon small>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>{{ $t("add_new") }}</span>
            </v-tooltip>
          </div>
        </div>
        <v-divider class="mt-0" v-if="view == 'widget'"></v-divider>
      </div>
      <!-- <v-divider class="mt-1"></v-divider> -->
      <div v-bind:class="[view == 'widget' ? '' : 'notes_item']">
        <VuePerfectScrollbar
          class="scrollbar-container"
          v-bind:style="
            view == 'widget' ? 'height:150px' : 'max-height: 1000px'
          "
        >
          <div
            v-if="!allLeadNotes.length > 0"
            class="text-center no-data-block"
          >
            <span>{{ $t("no_notes_available") }}</span>
          </div>
          <div
            v-for="(
              selected_candidate_notes, selected_notes_index
            ) in allLeadNotes"
            :key="selected_notes_index"
            v-bind:class="[view == 'widget' ? 'p-3' : '']"
          >
            <div class="w-100 d-flex">
              <div class="notes-title w-90">
                <!-- {{ selected_candidate_notes.title }} -->
              </div>
              <span
                v-if="
                  user.emp_id === selected_candidate_notes.creator_data.id &&
                  view != 'widget'
                "
              >
                <v-icon
                  style="font-size: 16px"
                  @click="editNotes(selected_candidate_notes)"
                  >mdi-square-edit-outline</v-icon
                >
                <v-icon
                  style="font-size: 16px; margin-left: 10px"
                  @click="deleteNotes(selected_candidate_notes.id)"
                  >mdi-delete</v-icon
                >
              </span>
            </div>

            <div class="readmore mt-1">
              {{ selected_candidate_notes.comment }}
            </div>
            <a
              v-if="selected_candidate_notes.comment.length > 70"
              class="text-primary"
              @click="Readmore(selected_candidate_notes)"
              >{{ $t("more") }}</a
            >
            <div style="color: grey; margin-top: 10px">
              <span>{{ $t("created_on") }}</span
              >&nbsp;:&nbsp;
              <i>
                <span>
                  {{
                    selected_candidate_notes.created_at | formatDateTime
                  }} </span
                >&nbsp;by&nbsp;<span
                  >{{ selected_candidate_notes.creator_data.firstname }}&nbsp;{{
                    selected_candidate_notes.creator_data.lastname
                  }}</span
                >
              </i>
            </div>
            <v-divider style="margin-top: 6px"></v-divider>
          </div>
        </VuePerfectScrollbar>
      </div>
    </div>
    <div class="text-center">
      <v-dialog v-model="lead_notes_dialog" width="800">
        <v-card>
          <v-card-title
            class="text-h5 primary d-flex justify-content-between text-white"
          >
            <div>
              {{ $t("notes") }}
            </div>
            <div>
              <v-icon
                @click="lead_notes_dialog = false"
                class="close-btn-x text-white dialogcloseinuserdetails"
                >mdi-close-thick</v-icon
              >
            </div>
          </v-card-title>

          <div style="padding: 16px 24px 0px 24px">
            <v-form ref="form" v-model="notes_valid">
              <!-- <v-text-field
                class="pr-6 required_field"
                v-bind:label="$t('title')"
                v-model="notes.title"
                maxlength="100"
                outlined
              ></v-text-field> -->
              <v-textarea
                class="pr-6 required_field"
                append-icon="mdi-close-circle"
                @click:append="notes.comment = ''"
                v-bind:label="$t('write_notes')"
                v-model="notes.comment"
                outlined
                rows="5"
                counter="2000"
                maxlength="2000"
              ></v-textarea>
            </v-form>
          </div>

          <v-divider class="mt-0"></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div class="d-inline-block mr-2">
                  <v-btn
                    v-on="on"
                    small
                    class="ma-1 font-weight-bold cancel-btn"
                    color="secondary"
                    @click="lead_notes_dialog = false"
                    >{{ $t("cancel") }}</v-btn
                  >
                </div>
              </template>
              <span>{{ $t("cancel") }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  small
                  @click="submitNotes()"
                  color="green darken-1"
                  class="mr-2 success"
                  :disabled="
                    !notes.comment.trim() || isDisabled || isbtnLoading
                  "
                >
                  {{ $t("save_notes") }}
                  <b-spinner
                    @click="submitNotes()"
                    :disabled="true"
                    small
                    v-if="isbtnLoading"
                  ></b-spinner>
                </v-btn>
              </template>
              <span>{{ $t("save_notes") }}</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="descriptiondialog" width="1000">
        <v-card>
          <v-card-title
            class="text-h5 primary d-flex justify-content-between text-white"
          >
            <div>
              {{ $t("notes") }}
            </div>
            <div>
              <v-icon
                @click="descriptiondialog = false"
                class="close-btn-x text-white dialogcloseinuserdetails"
                >mdi-close-thick</v-icon
              >
            </div>
          </v-card-title>
          <div class="p-4">
            <!-- <div class="notes-title">{{ selected_notes.title }}</div> -->
            <div>{{ selected_notes.comment }}</div>
            <div>
              <div style="color: grey; margin-top: 10px">
                <span>{{ $t("created_on") }}</span
                >&nbsp;:&nbsp;
                <i>
                  <span> {{ selected_notes.created_at | formatDateTime }} </span
                  >&nbsp;by&nbsp;<span>{{ selected_notes.created_by }}</span>
                </i>
              </div>
            </div>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <ConfirmDialog
      :show="showdeleteDialog"
      :cancel="canceldelete"
      :confirm="confirmdelete"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('want_to_delete_note')"
    />
  </div>
</template>

<script>
import axios from "axios";
import VueElementLoading from "vue-element-loading";
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  components: {
    VueElementLoading,
    PageTitle,
    ConfirmDialog,
    VuePerfectScrollbar,
  },
  props: ["lead_id", "view", "refresh_value", "add_notes"],
  data: () => ({
    google_icon: {
      icon_name: "edit_square",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    user: "",
    loader: false,
    lead_notes_dialog: false,
    allLeadNotes: [],
    notes_valid: true,
    notes: {
      id: 0,
      title: "Your title",
      comment: "",
      lead_id: null,
    },
    lead_notes_dialog: false,
    isbtnLoading: false,
    isDisabled: false,
    selected_comment: "",
    descriptiondialog: false,
    selected_notes: {},
    icon: "pe-7s-drawer icon-gradient bg-happy-itmeo",
    showdeleteDialog: false,
    delete_id: null,
  }),
  watch: {
    lead_id: {
      immediate: true,
      handler() {
        if (this.lead_id) {
          this.notes.lead_id = this.lead_id;
          this.getNotes();
        }
      },
    },
    refresh_value: {
      immediate: true,
      handler() {
        if (this.refresh_value) {
          this.getNotes();
        }
      },
    },
    add_notes: {
      immediate: true,
      handler() {
        if (this.add_notes == true) {
          this.addLeadNotes();
        }
      },
    },
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
  },

  methods: {
    canceldelete() {
      this.showdeleteDialog = false;
    },
    confirmdelete() {
      this.confirmDeleteNote();
      this.showdeleteDialog = false;
    },
    confirmDeleteNote() {
      this.loader = true;
      axios
        .delete(
          process.env.VUE_APP_API_URL_ADMIN +
            "delete_lead_note/" +
            this.delete_id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.$emit("refresh");
            this.flashMessage.success({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.loader = false;
            this.getNotes();
            this.$emit("update-timeline");
          } else {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.loader = false;
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          this.loader = false;
          console.log("this error" + err);
        });
    },
    editNotes(notes) {
      this.notes.title = notes.title;
      this.notes.comment = notes.comment;
      this.notes.id = notes.id;
      this.lead_notes_dialog = true;
    },
    Readmore(notes) {
      this.descriptiondialog = true;
      this.selected_notes = {
        title: notes.title,
        comment: notes.comment,
        created_at: notes.created_at,
        updated_at: notes.updated_at,
        created_by:
          notes.creator_data.firstname + " " + notes.creator_data.lastname,
      };
    },
    addLeadNotes() {
      this.notes = {
        id: 0,
        title: "",
        comment: "",
        lead_id: this.lead_id,
      };
      this.lead_notes_dialog = true;
    },
    submitNotes() {
      if (this.$refs.form.validate()) {
        this.isbtnLoading = true;
        if (this.notes.comment == "") {
          this.flashMessage.error({
            message: this.$t("enter_notes"),
          });
          this.isbtnLoading = false;
        } else {
          if (this.notes.id == 0) {
            axios
              .post(
                process.env.VUE_APP_API_URL_ADMIN + "create_lead_notes",
                this.notes
              )
              .then((res) => {
                this.$emit("refresh");
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
                  this.lead_notes_dialog = false;
                  this.getNotes();
                  this.$emit("update-timeline");
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
          } else {
            axios
              .post(
                process.env.VUE_APP_API_URL_ADMIN + "update_lead_notes",
                this.notes
              )
              .then((res) => {
                 this.$emit("update-timeline");
                if (Array.isArray(res.data.message)) {
                  this.array_data = res.data.message.toString();
                } else {
                  this.array_data = res.data.message;
                }
                if (res.data.status == "S") {
                  this.$emit("refresh");
                  this.flashMessage.success({
                    message: this.array_data,
                    time: 4000,
                    blockClass: "custom-block-class",
                  });
                  this.message = res.data.message;
                  this.isbtnLoading = false;
                  this.loader = false;
                  this.lead_notes_dialog = false;
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
        }
      } else {
        alert("Form is Invalid");
      }
    },
    deleteNotes(id) {
      this.delete_id = id;
      this.showdeleteDialog = true;
    },
    getNotes() {
      this.loader = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "get_lead_notes", {
          params: {
            lead_id: this.lead_id,
            view: this.view,
          },
        })
        .then((res) => {
          this.loader = false;
          this.allLeadNotes = res.data.notes;
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
  padding: 20px;
  border: 1px solid #d2cfcf;
  border-radius: 5px;
  margin: 0px 24px;
}
.no-data-block {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: grey;
}
.notes-title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
}
.m-18 {
  margin: 2px;
}
.action-header-bar {
  display: flex;
  justify-content: end;
  margin-right: -12px;
}
</style>
