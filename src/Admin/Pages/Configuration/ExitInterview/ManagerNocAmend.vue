<template>
  <div class="main-20">
    <div class="card-header">
        <div class="card-header-tab">
          <div
            class="
              card-header-title
              font-size-lg
              text-capitalize
              titlewrap   
            "
          >
          <!-- class=page-title-color -->
            {{ $t("create_ammend_noc") }}
          </div>
        </div>
      </div>
      <v-alert v-model="checksubmitdone" :text="checksubmitdone" color="success">
                    {{ $t('manager_noc_submitted_successfully') }}</v-alert>
    <div flat color="white" class="row pl-5 mt-5 mb-3 align-items-center">
      <span class="hrspannotice">
        {{
        $t('manager_exit_questions_for')
        }} {{ full_name }}
      </span>
    </div>
    <v-form ref="answerform" v-model="valid">
      <v-data-table
        :headers="headers"
        :items="questions_array"
        :loading="initval"
        hide-default-footer
        disable-pagination
      >
        <template v-slot:item="{ item, index }">
          <tr>
            <td colspan="5">
              <span v-if="item.questions">{{ item.questions }}</span>
            </td>
            <td>
              <div v-if="item.field_type == 'LOV'" class="lov_autocomplete_div">
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
              <div v-if="item.field_type == 'AUTOCOMPLETE'" class="lov_autocomplete_div">
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
              <div v-if="item.field_type == 'TEXTAREA'" class="lov_autocomplete_div">
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
              <div v-if="item.field_type == 'TEXTFIELD'" class="lov_autocomplete_div">
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
                <!--  <div class="radio-item b h6 align-self-center pt-2">
                 <div class="align-self-center" style="display: inline-flex;">
                    <v-radio-group
                      :readonly="checksubmitdone"
                      inline
                      class="d-flex required_field"
                      v-model="questions_array[index].answer"
                      v-if="item.is_field_required == 'Yes'"
                      :rules="fieldRules"
                    >
                      <v-radio label="Yes" class="radio_items" value="Yes"></v-radio>
                      <v-radio label="No" class="radio_items" value="No"></v-radio>
                    </v-radio-group>
                    <v-radio-group
                      v-else
                      :readonly="checksubmitdone"
                      inline
                      class="d-flex"
                      v-model="questions_array[index].answer"
                    >
                      <v-radio label="Yes" class="radio_items" value="Yes"></v-radio>
                      <v-radio label="No" class="radio_items" value="No"></v-radio>
                    </v-radio-group>
                  </div>
                </div> -->
                <v-radio-group v-model="questions_array[index].answer" :readonly="checksubmitdone" class="required_field"
                  row>
                  <v-radio class="vradiogroupvfor text--primary" v-for="(lookupchild, checkindex) in  item.lookup_values"
                    :key="checkindex" :label="lookupchild" :value="lookupchild">
                  </v-radio>
                </v-radio-group>
              </div>
              <div v-if="item.field_type == 'CHECKBOX'">
                <!-- <div class="checkboxcomponent">
                  <v-checkbox
                    v-if="item.is_field_required == 'Yes'"
                    v-model="questions_array[index].answer"
                    :readonly="checksubmitdone"
                    :rules="fieldRules"
                    class="required_field"
                  ></v-checkbox>
                  <v-checkbox
                    v-else
                    v-model="questions_array[index].answer"
                    :readonly="checksubmitdone"
                  ></v-checkbox>
                </div> -->
                <div class="checkboxcomponent">
                  <v-checkbox :rules="fieldRules" :readonly="checksubmitdone"
                    v-for="(lookupchild, checkindex) in  item.lookup_values" :key="checkindex"
                    v-model="questions_array[index].answer" :label="lookupchild" multiple color="primary"
                    :value="lookupchild" hide-details></v-checkbox>
                </div>
              </div>
              <div v-if="item.field_type == 'RANGESLIDER'" class="lov_autocomplete_div">
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
      <div class="d-block text-right mr-4">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div class="d-inline-block  mr-2">
              <v-btn
                v-on="on"
                small
               class="ma-1  font-weight-bold cancel-btn"
                color="secondary"

                @click="$router.go(-1)"
              >
                {{ $t("cancel") }}
              </v-btn>
            </div>
          </template>
          <span>{{ $t("cancel") }}</span>
        </v-tooltip>
        <v-tooltip bottom v-if="!checksubmitdone && !finishLoader">
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block">
              <v-btn
                :disabled="isBtnLoading"
                color="green darken-1"
                small
                class="mr-2 success hover_shine"
                @click="saveHranswers"
              >
                {{ $t("save") }}
                <b-spinner small v-if="isBtnLoading"></b-spinner>
              </v-btn>
            </div>
          </template>
          <span>{{ $t("save") }}</span>
        </v-tooltip>
        <v-tooltip bottom v-if="questionexistornot && !checksubmitdone">
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block">
              <v-btn
                :disabled="isBtnLoading"
                color="green darken-1"
                small
                class="mr-2 success hover_shine"
                @click="FinishHranswers"
              >
                {{ $t("finish") }}
                <b-spinner small v-if="isBtnLoading"></b-spinner>
              </v-btn>
            </div>
          </template>
          <span>{{ $t("finish") }}</span>
        </v-tooltip>
      </div>
    </v-form>
  </div>
</template>
    
  <script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
export default {
  components: {
    PageTitle
  },
  data: () => ({
    finishLoader: false,
    full_name:"",
    questionexistornot: null,
    checksubmitdone: false,
    questions_array: [],
    initval: false,
    status_id: null,
    valid: false,
    isBtnLoading: false,
    delete_id: null,
    user_slug:"",
    headers: [
      {
        text: "Topic",
        align: "left",
        value: "",
        sortable: false
      },
      {
        text: "",
        align: "",
        value: "",
        sortable: false
      },
      {
        text: "",
        align: "",
        value: "",
        sortable: false
      },
      {
        text: "",
        align: "",
        value: "",
        sortable: false
      },
      {
        text: "",
        align: "",
        value: "",
        sortable: false
      },
      {
        text: "Employee Comment",
        align: "left",
        value: "",
        sortable: false
      }
    ],
    google_icon: {
      icon_name: "help",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined"
    },
    search: ""
  }),

 

  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        this.user_slug=this.$route.query.slug;
this.full_name=this.$route.query.full_name;
        if ( this.user_slug) {
            this.fetchHRQuestions();
        }
      },
    },
  },

  created() {
    // this.fetchlookup();
  },
  computed: {
    fieldRules() {
      return [v => !!v || this.$t("field_required")];
    }
  },

  methods: {
    saveHranswers() {
       if (this.$refs.answerform.validate()) {
      this.isBtnLoading = true;
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "saveemployeeanswerfrommanager", {
          answer: this.questions_array,
          empID: this.user_slug
        })
        .then(res => {
          if (res.data.status == "S") {
            this.isBtnLoading = false;
            this.flashMessage.success({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class"
            });
            this.fetchHRQuestions();
          }
        })
        .catch(err => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          console.log(" error" + err);
          this.isBtnLoading = false;
        });
       }
    },

    FinishHranswers() {
      if (this.$refs.answerform.validate()) {
        this.finishLoader = true;
        this.isBtnLoading = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "finishemployeeanswerfrommanager",
            {
              answer: this.questions_array,
              empID: this.user_slug
            }
          )
          .then(res => {
            if (res.data.status == "S") {
              this.isBtnLoading = false;
              this.finishLoader = false;
              this.flashMessage.success({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class"
              });
              this.fetchHRQuestions();
            }
          })
          .catch(err => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class"
            });
            console.log(" error" + err);
            this.finishLoader = false;
            this.isBtnLoading = false;
          });
      }
    },

    fetchHRQuestions() {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetchmanagerquestionsforexitemployee/" +
            this.user_slug
        )
        .then(res => {
          if (res.data.status == "S") {
            this.questions_array = res.data.question;
            this.questionexistornot = res.data.finish;
            if (res.data.submit == 1) {
              this.checksubmitdone = true;
            } else {
              this.checksubmitdone = false;
            }
            this.initval = false;
          }
        })
        .catch(err => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          console.log(" error" + err);
          this.initval = false;
        });
    }
  }
};
</script>
  <style scoped>
.hrspannotice {
  font-size: 14px;
  font-weight: 500;
  color: #706363;
}

.lov_autocomplete_div {
  max-width: 250px;
  padding-top: 24px;
}



.radio_items {
  margin-bottom: 0px !important;
  padding-right: 13px;
}

.radio-item /deep/ .v-input--radio-group__input {
  flex-direction: row;
  align-self: center;
}

.radio-item /deep/ .v-label {
  margin-bottom: 0px !important;
}
.button_items{
    position:absolute;
    bottom:60px;
    right:10px;
}
.vradiogroupvfor /deep/ .v-label {
  margin-bottom: 0px !important;
}
.checkboxcomponent {
  display: inline-flex !important;
  margin-bottom: 13px !important;
}

.checkboxcomponent /deep/ .v-label {
  margin-right: 25px !important;
  margin-bottom: 0px !important;
}
</style>