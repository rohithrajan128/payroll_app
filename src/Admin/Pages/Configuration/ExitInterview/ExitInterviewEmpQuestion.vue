
<template>
  <div class="main-20">
    <VueElementLoading
      :active="loader"
      spinner="bar-fade-scale"
      color="var(--primary)"
    />
    <div>
      <v-app-bar flat color="white">
        <h5>
          {{ $t("exit_interview_questions")
          }}<i class="fa fa-question pl-3"></i>
        </h5>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              small
              v-on="on"
              @click="$router.go(-1)"
              class="font-weight-bold cancel-btn"
              color="btn hover_shine primary cancel_button"
              >{{ $t("back") }}
            </v-btn>
          </template>
          <span>{{ $t("back") }}</span>
        </v-tooltip>
      </v-app-bar>
      <v-sheet class="mt-1">
        <v-alert
          v-model="checksubmitdone"
          :text="checksubmitdone"
          color="success"
        >
          {{ $t("exit_interview_questions_submitted_successfully") }}</v-alert
        >
        <v-card v-if="user_section">
          <v-tabs bg-color="teal-darken-3" show-arrows v-model="tab">
            <v-tab
              v-for="(section, i) in user_section"
              :key="i"
              :value="section.id"
              @change="fetchempQuestion(section.id)"
            >
              {{ section.section_name }}
            </v-tab>
            <v-tab-item eager v-for="(section, i) in user_section" :key="i">
              <v-sheet
                v-if="questions_array.length > 0"
                class="questionvsheetvif"
              >
                <v-form ref="empanswerform" v-model="valid" lazy-validation>
                  <v-data-table
                    :headers="headers"
                    :items="questions_array"
                    :loading="initval"
                    hide-default-footer
                    disable-pagination
                  >
                    <template v-slot:item="{ item, index }">
                      <tr
                        class="questionsectionclass"
                        v-if="
                          section.id == 0 &&
                          (index == 0 ||
                            questions_array[index - 1].section_name !=
                              item.section_name)
                        "
                      >
                        <td colspan="14" class="resourcestylename">
                          <div class="row">
                            <div class="align-self-center pl-3">
                              {{ item.section_name }}
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="5">
                          <span v-if="item.questions">{{
                            item.questions
                          }}</span>
                        </td>
                        <td>
                          <div
                            v-if="item.field_type == 'LOV'"
                            class="lov_autocomplete_div"
                          >
                            <v-select
                              v-if="item.is_field_required == 'Yes'"
                              :rules="fieldRules"
                              class="required_field"
                              v-model="questions_array[index].answer"
                              :readonly="checksubmitdone"
                              v-bind:label="$t('select')"
                              :items="item.lookup_values"
                              dense
                              outlined
                            ></v-select>
                            <v-select
                              v-else
                              v-bind:label="$t('select')"
                              :items="item.lookup_values"
                              dense
                              outlined
                              v-model="questions_array[index].answer"
                              :readonly="checksubmitdone"
                            ></v-select>
                          </div>
                          <div
                            v-if="item.field_type == 'AUTOCOMPLETE'"
                            class="lov_autocomplete_div"
                          >
                            <v-autocomplete
                              v-if="item.is_field_required == 'Yes'"
                              v-model="questions_array[index].answer"
                              :readonly="checksubmitdone"
                              :rules="fieldRules"
                              class="required_field"
                              v-bind:label="$t('select')"
                              :items="item.lookup_values"
                              dense
                              outlined
                            ></v-autocomplete>
                            <v-autocomplete
                              v-else
                              v-bind:label="$t('select')"
                              :items="item.lookup_values"
                              dense
                              outlined
                              v-model="questions_array[index].answer"
                              :readonly="checksubmitdone"
                            ></v-autocomplete>
                          </div>
                          <div
                            v-if="item.field_type == 'TEXTAREA'"
                            class="lov_autocomplete_div"
                          >
                            <v-textarea
                              v-if="item.is_field_required == 'Yes'"
                              v-model="questions_array[index].answer"
                              :readonly="checksubmitdone"
                              :rules="fieldRules"
                              class="required_field"
                              v-bind:label="$t('type_here')"
                              rows="2"
                              dense
                              outlined
                            ></v-textarea>
                            <v-textarea
                              v-else
                              v-bind:label="$t('type_here')"
                              rows="2"
                              dense
                              outlined
                              v-model="questions_array[index].answer"
                              :readonly="checksubmitdone"
                            ></v-textarea>
                          </div>
                          <div
                            v-if="item.field_type == 'TEXTFIELD'"
                            class="lov_autocomplete_div"
                          >
                            <v-text-field
                              v-if="item.is_field_required == 'Yes'"
                              v-model="questions_array[index].answer"
                              :rules="fieldRules"
                              class="required_field"
                              v-bind:label="$t('type_here')"
                              dense
                              outlined
                              :readonly="checksubmitdone"
                            ></v-text-field>
                            <v-text-field
                              v-else
                              :readonly="checksubmitdone"
                              v-bind:label="$t('type_here')"
                              dense
                              outlined
                              v-model="questions_array[index].answer"
                            ></v-text-field>
                          </div>
                          <div v-if="item.field_type == 'RADIO BUTTON'">
                            <!-- <div class="radio-item b h6 align-self-center pt-2">
                                                            <div class="align-self-center" style="display: inline-flex;">
                                                                <v-radio-group :readonly="checksubmitdone" inline
                                                                    class="d-flex required_field mainradioitem"
                                                                    v-model="questions_array[index].answer"
                                                                    v-if="item.is_field_required == 'Yes'"
                                                                    :rules="fieldRules">
                                                                    <v-radio label="Yes" class="radio_items"
                                                                        value="Yes"></v-radio>
                                                                    <v-radio label="No" class="radio_items"
                                                                        value="No"></v-radio>
                                                                </v-radio-group>
                                                                <v-radio-group v-else :readonly="checksubmitdone" inline
                                                                    class="d-flex" v-model="questions_array[index].answer">
                                                                    <v-radio label="Yes" class="radio_items"
                                                                        value="Yes"></v-radio>
                                                                    <v-radio label="No" class="radio_items"
                                                                        value="No"></v-radio>
                                                                </v-radio-group>
                                                            </div>
                                                        </div> -->
                            <v-radio-group
                              v-model="questions_array[index].answer"
                              :readonly="checksubmitdone"
                              class="required_field"
                              row
                            >
                              <v-radio
                                class="vradiogroupvfor text--primary"
                                v-for="(
                                  lookupchild, checkindex
                                ) in item.lookup_values"
                                :key="checkindex"
                                :label="lookupchild"
                                :value="lookupchild"
                              >
                              </v-radio>
                            </v-radio-group>
                          </div>
                          <div v-if="item.field_type == 'CHECKBOX'">
                            <div class="checkboxcomponent">
                              <!-- <v-checkbox v-if="item.is_field_required == 'Yes'"
                                                                v-model="questions_array[index].answer"
                                                                :readonly="checksubmitdone" :rules="fieldRules"
                                                                class="required_field"></v-checkbox>
                                                            <v-checkbox v-else v-model="questions_array[index].answer"
                                                                :readonly="checksubmitdone"></v-checkbox> -->

                              <v-checkbox
                                :rules="fieldRules"
                                :readonly="checksubmitdone"
                                v-for="(
                                  lookupchild, checkindex
                                ) in item.lookup_values"
                                :key="checkindex"
                                v-model="questions_array[index].answer"
                                :label="lookupchild"
                                multiple
                                color="primary"
                                :value="lookupchild"
                                hide-details
                              ></v-checkbox>
                            </div>
                          </div>
                          <div
                            v-if="item.field_type == 'RANGESLIDER'"
                            class="lov_autocomplete_div"
                          >
                            <v-range-slider
                              hide-details
                              class="align-center pt-2"
                              step="1"
                              thumb-size="22"
                              thumb-label="always"
                              :readonly="checksubmitdone"
                            ></v-range-slider>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-form>
                <v-row class="nextpreviousbtn" v-if="!checksubmitdone">
                  <v-spacer></v-spacer>
                  <v-tooltip bottom v-if="i > 0">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        small
                        v-on="on"
                        @click="previousbtn(i)"
                        :disabled="isBtnLoading"
                        class="font-weight-bold cancel-btn"
                        color="btn hover_shine primary"
                      >
                        <v-icon medium>mdi-chevron-left</v-icon>
                        {{ $t("previous") }}
                      </v-btn>
                    </template>
                    <span>{{ $t("previous") }}</span>
                  </v-tooltip>
                  <v-tooltip
                    bottom
                    v-if="i + 1 != user_section.length && section.id != 0"
                  >
                    <template v-slot:activator="{ on }">
                      <v-btn
                        small
                        v-on="on"
                        class="font-weight-bold cancel-btn ml-2 mr-2"
                        :disabled="isBtnLoading"
                        @click="saveandnextbtn(i, 'next')"
                        color="btn hover_shine primary"
                        >{{ $t("save_next") }}
                        <v-icon medium>mdi-chevron-right</v-icon>
                        <b-spinner small v-if="isBtnLoading"></b-spinner>
                      </v-btn>
                    </template>
                    <span>{{ $t("save_next") }}</span>
                  </v-tooltip>
                  <v-tooltip bottom v-else-if="section.id == 0">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        small
                        v-on="on"
                        class="font-weight-bold cancel-btn ml-2 mr-2"
                        :disabled="isBtnLoading"
                        @click="saveandnextbtn(i, 'saveall')"
                        color="btn hover_shine primary"
                        >{{ $t("save") }}
                        <b-spinner small v-if="isBtnLoading"></b-spinner>
                      </v-btn>
                    </template>
                    <span>{{ $t("save") }}</span>
                  </v-tooltip>
                  <v-tooltip bottom v-else>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        small
                        v-on="on"
                        class="font-weight-bold cancel-btn ml-2 mr-2"
                        :disabled="isBtnLoading"
                        @click="saveandnextbtn(i, 'save')"
                        color="btn hover_shine primary"
                        >{{ $t("save") }}
                        <b-spinner small v-if="isBtnLoading"></b-spinner>
                      </v-btn>
                    </template>
                    <span>{{ $t("save") }}</span>
                  </v-tooltip>
                  <v-tooltip bottom v-if="lastsave && !checksubmitdone">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        small
                        v-on="on"
                        class="font-weight-bold cancel-btn ml-2 mr-2"
                        :disabled="isBtnLoading1"
                        @click="SubmitEmpQuestions()"
                        color="btn hover_shine success"
                        >{{ $t("submit") }}
                        <b-spinner small v-if="isBtnLoading1"></b-spinner>
                      </v-btn>
                    </template>
                    <span>{{ $t("submit") }}</span>
                  </v-tooltip>
                </v-row>
              </v-sheet>
              <v-sheet v-else class="questionvsheetvelse">
                <span>{{ $t("no_questions_found") }}</span>
              </v-sheet>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-sheet>
    </div>
    <ConfirmDialog
      :show="showConfirmDialog"
      :cancel="cancel"
      :confirm="confirm"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('cannot_edit_once_you_submit_want_to_proceed')"
    />
  </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import ComingSoon from "../../ComingSoon.vue";
export default {
  components: {
    VueElementLoading,
    ConfirmDialog,
    ComingSoon,
  },

  data: () => ({
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    showStatusDialog: false,
    checksubmitdone: false,
    showConfirmDialog: false,
    lastsave: false,
    user_section: [],
    isBtnLoading1: false,
    user_id: "",
    valid: true,
    isBtnLoading: false,
    initval: false,
    tab: 0,
    user: [],
    questions_array: [],
    loader: false,
    primary_manager_name: "",
    headers: [
      {
        text: "Topic",
        align: "left",
        value: "",
        sortable: false,
      },
      {
        text: "",
        align: "",
        value: "",
        sortable: false,
      },
      {
        text: "",
        align: "",
        value: "",
        sortable: false,
      },
      {
        text: "",
        align: "",
        value: "",
        sortable: false,
      },
      {
        text: "",
        align: "",
        value: "",
        sortable: false,
      },
      {
        text: "Employee Comment",
        align: "left",
        value: "",
        sortable: false,
      },
    ],
  }),
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.user_id = this.user.emp_id;
  },
  created() {},
  watch: {
    user_id: {
      immediate: true,
      handler() {
        if (this.user_id) {
          this.fetchemployeeSections();
        }
      },
    },
  },

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },
  methods: {
    previousbtn(index) {
      this.fetchempQuestion(this.user_section[index - 1].id);
      this.tab = index - 1;
    },
    saveandnextbtn(index, savevalue) {
      if (this.$refs[`empanswerform`][index].validate()) {
        this.isBtnLoading = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "saveemployeequestionanswer",
            {
              answer: this.questions_array,
              empID: this.user_id,
              saveType: savevalue,
            }
          )
          .then((res) => {
            if (res.data.status == "S") {
              this.isBtnLoading = false;
              this.flashMessage.success({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              if (savevalue == "next") {
                this.fetchempQuestion(this.user_section[index + 1].id);
                this.tab = index + 1;
              } else if (savevalue == "saveall") {
                this.fetchempQuestion(0);
              } else {
                this.fetchempQuestion(this.user_section[0].id);
              }
            }
          })
          .catch((err) => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            console.log(" error" + err);
            this.isBtnLoading = false;
          });
      }
    },
    fetchempQuestion(id) {
      this.questions_array = [];
      this.loader = true;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetchemployeequestionsfromsectionid",
          {
            section_id: id,
            emp_id: this.user_id,
          }
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.questions_array = res.data.question;
            if (res.data.submit == 1) {
              this.checksubmitdone = true;
            } else {
              this.checksubmitdone = false;
            }
            if (res.data.lastsave == 1) {
              this.lastsave = true;
            } else {
              this.lastsave = false;
            }

            this.loader = false;
          } else {
            this.flashMessage.error({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
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

    // fetchlookup() {
    //     axios
    //         .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
    //             params: {
    //                 lookup_type: "SERIALISED_ITEM",
    //             },
    //         })
    //         .then((response) => {
    //             this.enableNovlookups = response.data.lookup_details;
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // },

    fetchemployeeSections() {
      this.loader = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetchemployeeSectionsforexitinterview"
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.user_section = res.data.section;
            this.loader = false;
            if (this.user_section.length >= 1) {
              this.fetchempQuestion(this.user_section[0].id);
            }
            if (this.user_section.length >= 1) {
              this.user_section.unshift({
                id: 0,
                section_name: "Show All",
              });
              this.fetchempQuestion(0);
            }
          } else {
            this.flashMessage.error({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
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
    SubmitEmpQuestions() {
      if (this.tab != 0) {
        this.isBtnLoading1 = true;
        this.fetchempQuestion(0);
        this.tab = 0;
        this.isBtnLoading1 = false;
        setTimeout(() => {
          if (this.$refs[`empanswerform`][0].validate()) {
            this.showConfirmDialog = true;
          } else {
            this.lastsave = false;
          }
        }, 1000);
      } else {
        if (this.$refs[`empanswerform`][0].validate()) {
          this.showConfirmDialog = true;
        } else {
          this.lastsave = false;
        }
      }
    },
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm() {
      this.showConfirmDialog = false;
      this.confirmSubmitEmpQuestions();
    },
    confirmSubmitEmpQuestions() {
      this.isBtnLoading1 = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "submitemployeequestions/" +
            this.user_id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.flashMessage.success({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.isBtnLoading1 = false;
            this.fetchempQuestion(this.user_section[0].id);
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
  },
};
</script>

<style scoped>
.questionvsheetvelse {
  min-height: 60vh;
  text-align: center;
  padding-top: 42pt;
  font-size: 20px;
  font-weight: 600;
  color: #000000a1 !important;
}

.questionvsheetvif {
  min-height: 60vh;
  padding-top: 12pt;
}

.hrspannotice {
  font-size: 14px;
  font-weight: 500;
  color: #706363;
}

.lov_autocomplete_div {
  max-width: 250px;
  padding-top: 24px;
}

.checkboxcomponent {
  display: inline-flex;
  margin-bottom: 13px;
}
.checkboxcomponent .v-label {
  margin-right: 25px !important;
  margin-bottom: 0px !important;
}

.radio_items {
  margin-bottom: 0px !important;
  padding-right: 13px !important;
}

.radio-item /deep/ .v-input--radio-group__input {
  flex-direction: row !important;
  align-self: center !important;
}

.radio_items /deep/ .v-label {
  margin-bottom: 0px !important;
}

.v-input--radio-group__input {
  flex-direction: row !important;
}

.radio-item /deep/ .v-label {
  margin-bottom: 0px !important;
  top: 4px !important;
}

.nextpreviousbtn {
  margin-top: 22px;
  margin-bottom: 22px;
  padding-bottom: 32px;
  padding-right: 12px;
  margin-right: 16px;
}

.vradiogroupvfor .v-label {
  margin-bottom: 0px !important;
}

/* .vtabsections {
     pointer-events: none !important; 
} */
</style>