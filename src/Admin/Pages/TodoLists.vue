<template>
  <div class="main-20">
    <div flat color="white" class="row pt-6 pb-0 pl-5 align-items-center">
      <page-title class="col-md-4" :heading="$t('todo')" :google_icon="google_icon"></page-title>
      <div class="search_item col-md-6">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-text-field dense rounded-pill density="compact" outlined rounded small v-on="on" v-model="search"
              append-icon="search" v-bind:label="$t('search')" hide-details class="srch_bar"></v-text-field>
          </template>
          <span>{{ $t("search") }}</span>
        </v-tooltip>
      </div>
      <div class="col-md-2 text-right" v-if="!nav_task">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn class="btn hover_shine add_new mr-3" small v-on="on" @click="addtasktodo">{{ $t("add_task") }}</v-btn>
          </template>
          <span>{{ $t("add_task") }}</span>
        </v-tooltip>
      </div>
    </div>
    <div class="row pt-1 ma-0" v-bind:class="[nav_task == true ? 'pr-2' : 'pr-0']">
      <div v-bind:class="[nav_task == true ? 'col-md-8' : 'col-md-12']">
        <div id="datatabletransitionid">
          <v-data-table :headers="headers" :items="todolist" :search="search" :loading="initval"
            v-bind:no-data-text="$t('no_task_available')" hide-default-footer class="todotable">
            <template v-slot:item="props">
              <tr v-bind:class="[props.item.id == todoarray.id ? 'todotablerowactive' : 'todotablerow']">
                <td style="width: 70%;" @click="opentodotask(props.item.id)">
                  <div class="widget-content p-0">
                    <div class="widget-content-wrapper">
                      <div class="widget-content-left mr-3">
                        <div class="widget-content-left" v-if="props.item.task_name">
                          <v-avatar :color="props.item.avatarcolor" size="small" class="todoavatar">
                            <span class="text-h6">{{ props.item.task_name.charAt(0).toUpperCase() }}</span>
                          </v-avatar>
                        </div>
                      </div>
                      <div class="widget-content-left flex2">
                        <div class="widget-heading">{{ props.item.task_name }}</div>
                        <div class="widget-subheading opacity-7 d-flex"
                          v-if="props.item.due_date || props.item.remind_me_date">
                          <div class="tododatedetails">
                            <span v-if="props.item.due_date">
                              <v-icon> mdi-calendar-month-outline</v-icon>
                              <span class="tododuedateclass mr-5">
                                {{ props.item.due_date | formatdateMonthyear }} , {{ props.item.due_date | formatBirthDay
                                }}
                              </span>
                            </span>
                            <span v-if="props.item.remind_me_date">
                              <v-icon>mdi mdi-alarm</v-icon>
                              <span class="tododuedateclass">
                                {{ props.item.remind_me_date | formatDate }}
                                <span v-if="props.item.remind_me_time">
                                  at {{ props.item.remind_me_time }}
                                </span>
                              </span>
                            </span>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>

                </td>
                <td class="text-right">
                  <v-menu>
                    <template v-slot:activator="{ on: menu, attrs }">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                          <v-chip class="mt-1" pill v-bind="attrs" v-on="{ ...tooltip, ...menu }" small
                            :color="props.item.color" style="min-width:101px; justify-content: center;">
                            {{ props.item.status }}
                            <v-icon right>
                              mdi-menu-down
                            </v-icon>
                          </v-chip>
                        </template>
                        <span>{{ $t('status') }}</span>
                      </v-tooltip>
                    </template>
                    <v-list class="c-drop-menu">
                      <v-list-item v-for="(item, index) in todo_status_array" :key="index">
                        <v-list-item-title style="cursor: pointer;"
                          @click="changetodostatus(item.longname, props.item.id, props.item.status)">
                          {{ item.longname }}
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </td>

                <!-- <td class="text-center px-0">

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon small class="mr-2 edit_btn icon_size" v-on="on">mdi-pencil-outline</v-icon>
              </template>
              <span>{{ $t("edit") }}</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon class="delete_btn icon_size" v-on="on" small
                  @click="deleteItem(props.item)">mdi-trash-can-outline</v-icon>
              </template>
              <span>{{ $t("delete") }}</span>
            </v-tooltip>

          </td> -->
                <td class="text-right">
                  <v-tooltip bottom v-if="props.item.favourite == 1">
                    <template v-slot:activator="{ on }">
                      <v-icon color="amber" class="favouritestaricon" v-on="on"
                        @click="addtofavourite(props.item.id)">mdi-star</v-icon>
                    </template>
                    <span>{{ $t("fav") }}</span>
                  </v-tooltip>
                  <v-tooltip bottom v-else>
                    <template v-slot:activator="{ on }">
                      <v-icon color="secondary" v-on="on" class="favouritestaricon"
                        @click="addtofavourite(props.item.id)">mdi-star-outline</v-icon>
                    </template>
                    <span>{{ $t("fav") }}</span>
                  </v-tooltip>
                </td>
              </tr>
            </template>
          </v-data-table>
        </div>
      </div>
      <div class="col-md-4 pa-0" style="margin-top: 18px !important;" v-if="nav_task">
        <v-card class="pa-0 ma-0 mr-2">
          <v-card class="pa-0 ma-0">
            <div class="todotaskcreateamend">
              <span v-if="todoarray.id > 0 && todoarray.task_name">
                {{ todoarray.task_name }}
              </span>
              <span v-else>
                {{ $t('create_task') }}
              </span>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" class="dialogcloseinuserdetails todoclose text-right"
                    @click="closetasktodo">mdi-close</v-icon>
                </template>
                <span>{{ $t("close") }}</span>
              </v-tooltip>
              <div v-if="todoarray.id > 0 && todoarray.task_name" class="todocreatedbyclass">
                <v-chip x-small color="error">
                <span >{{ $t('created_by') }} - </span> 
                <span v-if="todoarray.created_by == user.emp_id"> {{ $t('you') }}</span>
                <span v-else>
                  <span v-if="todoarray.createdby_details.Full_Code">
                    {{ todoarray.createdby_details.Full_Code }}
                  </span>
                </span>
                </v-chip>
              </div>
            </div>
          </v-card>
          <div class="px-3 pt-4 pb-3 todoformclass">
            <v-form ref="form" v-model="valid">
              <v-layout>
                <v-flex md12>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field outlined dense v-model="todoarray.task_name" v-on="on" v-bind:label="$t('task_name')"
                        class="required_field" :rules="fieldRules" required maxlength="100">
                      </v-text-field>
                    </template>
                    <span>{{ $t("task_name") }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex md12>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-autocomplete v-on="on" v-model="todoarray.assign_to" :items="employee_list" item-value="id"
                        item-text="Full_Code" v-bind:label="$t('assign_to')" outlined multiple dense>
                        <template v-slot:selection="{ attrs, item, select, selected }">
                          <v-chip x-small v-bind="attrs" :input-value="selected" @click="select" color="primary"
                            class="ma-1">
                            {{ item.Full_Code }}
                          </v-chip>
                        </template>
                      </v-autocomplete>
                    </template>
                    <span>{{ $t("assign_to") }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex md12 class="pr-2">
                  <DatePicker :label="$t('due_date')" :min="new Date().toISOString().substr(0, 10)"
                    :stored_date="todoarray.due_date" @formatted_date="formatted_due_date" dense />
                </v-flex>
              </v-layout>
              <h6 class="todoheadersub">{{ $t('remind_me') }}</h6>
              <v-layout class="pr-2">
                <v-flex md7 class="pr-1">
                  <DatePicker :label="$t('date')" :min="new Date().toISOString().substr(0, 10)"
                    :stored_date="todoarray.remind_me_date" @formatted_date="formatted_reminder_date" dense />
                </v-flex>
                <v-flex md5 class="pl-1">
                  <v-menu ref="menu" v-model="menu5" :close-on-content-click="false" :nudge-right="40"
                    :return-value.sync="time" lazy transition="scale-transition" offset-y full-width max-width="290px"
                    min-width="290px">
                    <template v-slot:activator="{ on }">
                      <v-text-field v-model="todoarray.remind_me_time" :label="$t('time')" append-icon="mdi-clock-outline"
                        dense readonly required outlined v-on="on"></v-text-field>
                    </template>
                    <v-time-picker v-if="menu5" v-model="todoarray.remind_me_time" full-width
                      @click:minute="$refs.menu.save(todoarray.remind_me_time)"></v-time-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
              <v-layout class="pr-2">
                <v-flex md12>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-textarea outlined dense v-model="todoarray.add_note" rows="2" v-on="on"
                        v-bind:label="$t('add_note')" maxlength="2000">
                      </v-textarea>
                    </template>
                    <span>{{ $t("add_note") }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
              <v-layout class="pr-2">
                <v-flex xs12 md12>
                  <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
                  <div class="browsedivdoc">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field readonly outlined dense v-on="on" @click="callDocumentSelect"
                          v-model="todoarray.file_name" v-bind:label="$t('upload_doc')"></v-text-field>
                        <v-chip label class="browsebtndoc" @click="callDocumentSelect" color="primary" v-on="on">{{
                          $t("browse") }}</v-chip>
                      </template>
                      <span>{{ $t("upload_doc") }}</span>
                    </v-tooltip>
                  </div>
                  <!-- :href="document_url + todoarray.file_name"  -->
                </v-flex>
                <v-flex xs12 sm6 md8 style="display: none">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <span v-on="on">
                        <DocumentSelect :label="'To do Document'" :folder="'Todo documents'"
                          :uploadtype="enable_document_select" @closeDialog="closeDocumentSelectDialog"
                          @uploadedDocument="uploadedDocument" :documentlink="todoarray.file_name"></DocumentSelect>
                      </span>
                    </template>
                    <span>{{ $t("file_input") }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
            </v-form>
            <div class="d-block text-right action-footer pr-2">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <div v-on="on" class="d-inline-block">
                    <v-btn v-on="on" small @click="closetasktodo" :disabled="isBtnLoading"
                      class="mr-1 font-weight-bold cancel-btn" color="dark cancel_button">{{ $t("cancel") }}</v-btn>
                  </div>
                </template>
                <span>{{ $t("cancel") }}</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <div v-on="on" class="d-inline-block">
                    <v-btn :disabled="isBtnLoading" @click="submittodo" small class="success hover_shine"
                      color="green darken-1">
                      {{ $t("save") }}
                      <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
                    </v-btn>
                  </div>
                </template>
                <span>{{ $t("save") }}</span>
              </v-tooltip>
            </div>
          </div>
        </v-card>
      </div>
    </div>
    <!-- <ConfirmDialog :show="showConfirmDialog" :cancel="cancel" :confirm="confirm" :id="delete_id"
      v-bind:title="$t('confirm')" v-bind:description="$t('delete_confirmation')" /> -->
  </div>
</template>
<script>
import PageTitle from "../../Layout/Components/PageTitle.vue";
import VueElementLoading from "vue-element-loading";
import DatePicker from "../../Admin/Pages/Configuration/Components/DatePicker.vue";
import DocumentSelect from "../../Admin/Pages/Configuration/Components/Upload/DocumentSelect.vue";
export default {
  components: {
    PageTitle,
    DocumentSelect,
    VueElementLoading,
    DatePicker,
  },
  data: () => ({
    search: "",
    menu5: false,
    nav_task: false,
    dialog: false,
    valid: false,
    isBtnLoading: false,
    initval: false,
    enable_document_select: "",
    user: [],
    todo_status_array: [],
    todolist: [],
    employee_list: [],
    todoarray: {
      id: 0,
      task_name: "",
      assign_to: "",
      remind_me_time: "",
      remind_me_date: "",
      due_date: "",
      add_note: "",
      file_name: "",
    },
    showConfirmDialog: false,
    delete_id: null,
    google_icon: {
      icon_name: "lists",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined"
    },
    message: ""
  }),

  computed: {

    headers() {
      return [
        {
          text: this.$t("task_name"),
          value: "task_name"
        },
        {
          text: this.$t("status"),
          value: "status"
        },
        {
          text: this.$t("favourite"),
          value: "favourite"
        },
      ];
    },

    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },

  watch: {
    user: {
      immediate: true,
      handler() {
        if (this.user.emp_id > 0) {
          this.fetchTodoList();
        }
      },
    },
  },

  created() {
    this.fetchLookup();
  },

  mounted() {
    // this.user.hr_employee.emprole_name.includes("Manager");
    this.user = JSON.parse(localStorage.getItem("user"));
  },

  methods: {
    changetodostatus(status, id, c_status) {
      if (c_status != status) {
        this.initval = true;
        axios
          .post(process.env.VUE_APP_API_URL_ADMIN + "update_todo_status", {
            id: id,
            status: status,
          })
          .then((res) => {
            if (res.data.status == "S") {
              this.fetchTodoList();
              this.flashMessage.success({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
            } else {
              this.flashMessage.error({
                message: res.data.message,
              });
            }
          })
          .catch((err) => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            console.log("this error" + err);
          });
      }
    },

    fetchLookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "TODO_STATUS",
          },
        })
        .then((response) => {
          this.todo_status_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    opentodotask(id) {
      this.initval = true;
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "edit_todo_task", {
          id: id,
        })
        .then((res) => {
          this.initval = false;
          if (res.data.status == "S") {
            this.todoarray = res.data.data;
            this.todoarray.assign_to = JSON.parse(res.data.data.assign_to);
            if (this.nav_task == false) {
              this.opentransition();
              setTimeout(() => {
                this.nav_task = true;
                document.getElementById("datatabletransitionid").className = "";
              }, 200);
            }
          } else {
            this.flashMessage.error({
              message: res.data.message,
            });
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log("this error" + err);
        });
    },
    addtasktodo() {
      this.opentransition();
      setTimeout(() => {
        this.nav_task = true;
        document.getElementById("datatabletransitionid").className = "";
        this.$refs.form.reset();
        this.todoarray.id = 0;
        this.todoarray.remind_me_date = '';
        this.todoarray.due_date = '';
      }, 200);
    },
    closetasktodo() {
      this.$refs.form.reset();
      this.todoarray.id = 0;
      this.todoarray.remind_me_date = '';
      this.todoarray.due_date = '';
      this.nav_task = false;
      this.closetransition();
    },
    submittodo() {
      if (this.$refs.form.validate()) {
        this.isBtnLoading = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "save_employee_to_do",
            this.todoarray
          )
          .then((res) => {
            this.isBtnLoading = false;
            if (res.data.status == "S") {
              this.flashMessage.success({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.closetasktodo();
              this.fetchTodoList();
            } else {
              this.closetasktodo();
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class"
              });
            }
          })
          .catch((err) => {
            this.closetasktodo();
            this.isBtnLoading = false;
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class"
            });
            console.log("error", err);
          });
      }
    },
    callDocumentSelect() {
      this.enable_document_select = "DragDrop";
    },
    closeDocumentSelectDialog(uploadtype) {
      this.enable_document_select = "";
      console.log("close dialog", uploadtype);
      this.loader = false;
    },
    uploadedDocument(file_path) {
      this.loader = true;
      this.todoarray.file_name = file_path;
      this.closeDocumentSelectDialog();
    },
    formatted_due_date(formatted_date) {
      this.todoarray.due_date = formatted_date;
    },
    formatted_reminder_date(formatted_date) {
      this.todoarray.remind_me_date = formatted_date;
    },
    addtofavourite(id) {
      this.initval = true;
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "update_todo_favourite", {
          id: id,
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.flashMessage.success({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.fetchTodoList();
          } else {
            this.flashMessage.error({
              message: res.data.message,
            });
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log("this error" + err);
        });
    },

    // cancel() {
    //   this.showConfirmDialog = false;
    // },
    // confirm(id) {
    //   this.deleteConfirm(id);
    //   this.showConfirmDialog = false;
    // },
    // deleteLookup(lookup) {
    //   axios
    //     .delete(process.env.VUE_APP_API_URL_ADMIN + "lookups/" + lookup.id)
    //     .then(res => {
    //       if (Array.isArray(res.data.message)) {
    //         this.array_data = res.data.message.toString();
    //       } else {
    //         this.array_data = res.data.message;
    //       }
    //       if (res.data.status == "E") {
    //         this.flashMessage.error({
    //           message: this.array_data,
    //           time: 4000,
    //           blockClass: "custom-block-class"
    //         });
    //       } else {
    //         this.flashMessage.success({
    //           message: this.array_data,
    //           time: 4000,
    //           blockClass: "custom-block-class"
    //         });
    //         this.initialize();
    //       }
    //     })
    //     .catch(err => {
    //       this.flashMessage.error({
    //         message: this.$t("something_went_wrong"),
    //         time: 4000,
    //         blockClass: "custom-block-class"
    //       });
    //       console.log("error", err);
    //     });
    // },

    fetchTodoList() {
      this.initval = true;
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "fetch_employee_todo", {
          user_id: this.user.emp_id
        })
        .then(res => {
          if (res.data.status == "S") {
            this.initval = false;
            this.todolist = res.data.data;
            this.employee_list = res.data.assign_to;
          } else {
            this.initval = false;
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class"
            });
            console.log("error message", array_data);
          }
        })
        .catch(err => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          console.log("error", err);
          this.initval = false;
        });
    },

    opentransition() {
      document.getElementById("datatabletransitionid").className = "datatabletodotransition";
    },
    closetransition() {
      document.getElementById("datatabletransitionid").className = "datatabletodotransitionexpand";
    },

    // deleteItem(item) {
    //   this.delete_id = item;
    //   this.showConfirmDialog = true;
    // },
    // deleteConfirm(item) {
    //   const index = this.todolist.indexOf(item);
    //   this.deleteLookup(this.todolist[index]);
    //   this.todolist.splice(index, 1);
    // },
    // close() {
    //   this.dialog = false;
    //   setTimeout(() => {
    //     this.editedItem = Object.assign({}, this.defaultItem);
    //     this.editedIndex = -1;
    //   }, 300);
    // }
  }
};
</script>

<style scoped>
.favouritestaricon {
  cursor: pointer !important;
}

.todotable /deep/ .v-data-table-header {
  display: none !important;
}

.todotable /deep/ .v-data-table__empty-wrapper {
  height: 66px;
  color: black;
  border-block: solid #f1f5f8 7px;
}

.todotable /deep/ .todotablerow {
  cursor: pointer !important;
  height: 70px !important;
  border-block: solid #f1f5f8 7px;
}

.todotable /deep/ .todotablerowactive {
  height: 80px;
  background-color: #86c1c361;
}

.todoavatar {
  width: 34px;
  height: 34px;
  color: white;
  margin-left: 10px;
}

.tododatedetails .v-icon {
  font-size: 17px !important;
  color: #000000db !important;
  padding-bottom: 1px !important;
}

.tododuedateclass {
  font-size: 13px;
}

.todotaskcreateamend {
  text-align: center;
  font-size: 17px;
  opacity: 0.8;
  font-weight: bold;
  color: #000000c6;
  padding-block: 16px;
}

.todoclose {
  position: absolute;
  right: 7px;
  color: black;
}

.todoheadersub {
  margin-top: -15px;
  opacity: 0.8;
}

.browsedivdoc {
  display: inline-flex;
  width: 100%;
  position: relative;
}

.browsedivdoc /deep/ .v-chip {
  border-radius: 0%;
}

.browsebtndoc {
  height: 40px !important;
  margin-left: -10%;
}

.download_color {
  color: #3f6ad8;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.download_item {
  position: absolute;
  top: 40px;
  right: 0px;
}

.todoformclass /deep/ .layout {
  margin-bottom: -5px !important;
}

.datatabletodotransition {
  animation-name: small_datatable;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
}

/* #birthdayanimationdiv {} */
.todocreatedbyclass{
  font-size: 11px;
    opacity: 1 !important;
    color: #595252;
    letter-spacing: 1px;
}
.datatabletodotransitionexpand {
  animation-name: large_database;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
}

@keyframes large_database {
  from {
    width: 66%;
  }

  to {
    width: 100%;
  }
}

@keyframes small_datatable {
  from {
    width: 100%;
  }

  to {
    width: 66%;
  }
}
</style>
