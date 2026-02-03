
<template>
  <div class="main-20">
    <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
    <div>
      <v-app-bar flat color="white">
        <h5>{{ $t("emp_question_and_answer") }}</h5>
      </v-app-bar>
      <v-sheet class="mt-1 mb-15 pb-7" v-if="checksubmitdone">
        <v-sheet v-if="questions_array.length > 0">
          <v-alert text color="success">
            <div class="d-flex">
              {{ $t("submitted_by_emp") }}
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn small v-on="on" class="mr-2 ml-5 primary hover_shine mb-1 mr-5" @click="showempquestionsdialog">
                    {{ $t("show_emp_questions") }}
                  </v-btn>
                </template>
                <span>{{ $t("show_emp_questions") }}</span>
              </v-tooltip>
            </div>
          </v-alert>
        </v-sheet>
        <v-sheet v-else class="questionvsheetvelse">
          <span>{{ $t("no_questions_found") }}</span>
        </v-sheet>
      </v-sheet>
      <v-sheet v-else>
        <v-alert :text="!checksubmitdone" color="primary">
          {{ $t("not_yet_submitted_by_emp") }}</v-alert>
      </v-sheet>
    </div>
    <v-dialog fullscreen transition="dialog-bottom-transition" persistent v-model="showempquestions" max-width="1100px">
      <v-card class="container">
        <v-toolbar color="primary" dark>
          <span class="headline">{{
            $t("emp_questions")
          }}</span>
          <v-spacer></v-spacer>
          <ExcelExitInterview :questions="emp_questions_array" :header="header_name" v-if="emp_questions_array.length>0" />
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon @click="closeempquestionsdialog" class="dialogcloseinuserdetails ml-5" v-on="on">mdi-close</v-icon>
            </template>
            <span>{{ $t("close") }}</span>
          </v-tooltip>
        </v-toolbar>
        <v-card-text class="mt-8">
          <v-data-table :items="questions_array" :loading="initval" hide-default-footer disable-pagination>
            <template v-slot:item="{ item, index }">
              <tr class="questionsectionclass" v-if="index == 0 ||
                questions_array[index - 1].section_name != item.section_name
                ">
                <td colspan="14" class="resourcestylename">
                  <div class="row">
                    <div class="align-self-center pl-3">
                      {{ item.section_name }}
                    </div>
                  </div>
                </td>
              </tr>
              <tr class="questionanswerdatatable">
                <td colspan="5">
                  <span v-if="item.questions">{{ item.questions }}</span>
                </td>
                <td>
                  <div v-if="item.field_type == 'LOV'" class="lov_autocomplete_div">
                    <v-select v-if="item.is_field_required == 'Yes'" class="required_field"
                      v-model="questions_array[index].answer" readonly v-bind:label="$t('select')"
                      :items="item.lookup_values" dense outlined></v-select>
                    <v-select v-else v-bind:label="$t('select')" :items="item.lookup_values" dense outlined
                      v-model="questions_array[index].answer" readonly></v-select>
                  </div>
                  <div v-if="item.field_type == 'AUTOCOMPLETE'" class="lov_autocomplete_div">
                    <v-autocomplete v-if="item.is_field_required == 'Yes'" v-model="questions_array[index].answer"
                      readonly class="required_field" v-bind:label="$t('select')" :items="item.lookup_values" dense
                      outlined></v-autocomplete>
                    <v-autocomplete v-else v-bind:label="$t('select')" :items="item.lookup_values" dense outlined
                      v-model="questions_array[index].answer" readonly></v-autocomplete>
                  </div>
                  <div v-if="item.field_type == 'TEXTAREA'" class="lov_autocomplete_div">
                    <v-textarea v-if="item.is_field_required == 'Yes'" v-model="questions_array[index].answer" readonly
                      class="required_field" v-bind:label="$t('type_here')" rows="2" dense outlined></v-textarea>
                    <v-textarea v-else v-bind:label="$t('type_here')" rows="2" dense outlined
                      v-model="questions_array[index].answer" readonly></v-textarea>
                  </div>
                  <div v-if="item.field_type == 'TEXTFIELD'" class="lov_autocomplete_div">
                    <v-text-field v-if="item.is_field_required == 'Yes'" v-model="questions_array[index].answer"
                      class="required_field" v-bind:label="$t('type_here')" dense outlined readonly></v-text-field>
                    <v-text-field v-else readonly v-bind:label="$t('type_here')" dense outlined
                      v-model="questions_array[index].answer"></v-text-field>
                  </div>
                  <div v-if="item.field_type == 'RADIO BUTTON'">

                    <v-radio-group v-model="questions_array[index].answer" readonly class="required_field" row>
                      <v-radio class="vradiogroupvfor text--primary" v-for="(
                            lookupchild, checkindex
                          ) in item.lookup_values" :key="checkindex" :label="lookupchild" :value="lookupchild">
                      </v-radio>
                    </v-radio-group>
                  </div>
                  <div v-if="item.field_type == 'CHECKBOX'">
                    <div class="checkboxcomponent">
                      <div class="checkboxcomponent">
                        <v-checkbox :rules="fieldRules" readonly v-for="(
                              lookupchild, checkindex
                            ) in item.lookup_values" :key="checkindex" v-model="questions_array[index].answer"
                          :label="lookupchild" multiple color="primary" :value="lookupchild" hide-details></v-checkbox>
                      </div>
                    </div>
                  </div>
                  <div v-if="item.field_type == 'RANGESLIDER'" class="lov_autocomplete_div">
                    <v-range-slider hide-details class="align-center pt-2" step="1" thumb-size="22" thumb-label="always"
                      readonly></v-range-slider>
                  </div>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import ComingSoon from "../../ComingSoon.vue";
import ExcelExitInterview from "../Users/ExcellDownloadExitInterview.vue"
export default {
  props: ["userID"],
  components: {
    VueElementLoading,
    ConfirmDialog,
    ComingSoon,
    ExcelExitInterview
  },

  data: () => ({
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    showStatusDialog: false,
    header_name: '',
    checksubmitdone: false,
    showempquestions: false,
    showConfirmDialog: false,
    lastsave: false,
    emp_questions_array: [],
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
  mounted() { },
  created() { },
  watch: {
    userID: {
      immediate: true,
      handler() {
        if (this.userID) {
          this.user_id = this.userID;
          this.fetchemployeeSections();
        }
      },
    },
  },
  methods: {
    showempquestionsdialog() {
      this.emp_questions_array = this.questions_array;
      this.header_name = 'Employees Questions';
      this.showempquestions = true;
    },
    closeempquestionsdialog() {
      this.emp_questions_array = [];
      this.header_name = '';
      this.showempquestions = false;
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
            if (res.data.submit == 1) {
              this.checksubmitdone = true;
              this.questions_array = res.data.question;
            } else {
              this.checksubmitdone = false;
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

.hrspannotice {
  font-size: 14px;
  font-weight: 500;
  color: #706363;
}

.lov_autocomplete_div {
  max-width: 250px;
  padding-top: 24px;
}

.checkboxcomponent /deep/ .v-label {
  font-size: 16px !important;
  padding-top: 6px !important;
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

.questionanswerdatatable {
  pointer-events: none;
}

.vradiogroupvfor .v-label {
  margin-bottom: 0px !important;
}

.checkboxcomponent {
  display: inline-flex !important;
  margin-bottom: 13px !important;
}

.checkboxcomponent .v-label {
  margin-right: 25px !important;
  margin-bottom: 0px !important;
}
</style>