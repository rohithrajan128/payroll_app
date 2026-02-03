<template>
  <div class="container-fluid mt-3 p-0">
    <div class="mb-3 mx-auto">
      <div class="card-header">
        <div class="card-header-tab">
          <div class="card-header-title font-size-lg text-capitalize titlewrap">
            {{ $t("create_amend_questions") }}
          </div>
        </div>
      </div>
      <div class="card-body">
        <VueElementLoading
          :active="loader"
          spinner="bar-fade-scale"
          color="var(--primary)"
        />
        <v-form ref="form" v-model="valid">
          <h5 class="pl-2 mb-5">{{ $t("questions") }}</h5>
          <v-layout pl-5 pr-5 pt-3>
            <v-flex md10 pr-4>
              <v-textarea
                dense
                outlined
                rows="2"
                v-bind:label="$t('question')"
                class="required_field"
                :rules="fieldRules"
                v-model="question_array.questions"
                maxlength="1000"
                counter="1000"
                v-bind:hint="$t('enter_the_question_with_question_mark')"
              ></v-textarea>
            </v-flex>
            <v-flex md2>
              <div class="checkboxcomponent">
                <v-checkbox
                  v-model="question_array.is_field_required"
                  v-bind:label="$t('is_field_required?')"
                ></v-checkbox>
              </div>
            </v-flex>
          </v-layout>

          <v-layout pl-5 pr-5 pt-3>
            <v-flex md3 pr-4>
              <v-select
                dense
                outlined
                v-bind:label="$t('section_menu')"
                @change="fetchsectionname(question_array.section_menu)"
                :items="section_head"
                item-value="id"
                item-text="shortname"
                v-model="question_array.section_menu"
              ></v-select>
            </v-flex>
            <v-flex md4 pl2 pr-4 v-if="question_array.section_menu">
              <v-autocomplete
                dense
                outlined
                v-bind:label="$t('section_name')"
                class="required_field"
                @change="fetchsectionrole(question_array.section_id)"
                :items="section_name"
                item-value="id"
                item-text="section_name"
                :rules="fieldRules"
                v-model="question_array.section_id"
              ></v-autocomplete>
            </v-flex>
            <v-flex md3 pr-4>
              <v-autocomplete
                dense
                outlined
                rows="2"
                v-bind:label="$t('role_type')"
                class="required_field"
                :rules="fieldRules"
                v-model="question_array.role_type_id"
                :items="role_array"
                item-text="rolename"
                item-value="id"
              ></v-autocomplete>
            </v-flex>
          </v-layout>

          <v-layout pl-5 pr-5 pt-1>
            <v-flex md3 pr-4>
              <v-autocomplete
                dense
                outlined
                rows="2"
                v-bind:label="$t('field_type')"
                class="required_field"
                :rules="fieldRules"
                v-model="question_array.field_type"
                :items="field_type_array"
                item-text="shortname"
                item-value="shortname"
              ></v-autocomplete>
            </v-flex>
            <v-flex
              md4
              pr-4
              v-if="
                question_array.field_type == 'LOV' ||
                question_array.field_type == 'AUTOCOMPLETE' ||
                question_array.field_type == 'CHECKBOX' ||
                question_array.field_type == 'RADIO BUTTON'
              "
            >
              <v-autocomplete
                dense
                outlined
                rows="2"
                v-bind:label="$t('lookup_parent')"
                class="required_field"
                :rules="fieldRules"
                v-model="question_array.lookup_parent_name"
                :items="lookup_array"
                item-text="shortname"
                item-value="shortname"
              ></v-autocomplete>
            </v-flex>
            <v-flex md3 pr-4>
              <v-text-field
                type="number"
                dense
                outlined
                v-bind:label="$t('sequence')"
                maxlength="2"
                class="required_field"
                :rules="fieldRules"
                v-model="question_array.sequence"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
        <div class="d-block text-right mr-4">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div v-on="on" class="d-inline-block mr-2">
                <v-btn
                  v-on="on"
                  small
                  @click="$router.go(-1)"
                  class="ma-1 font-weight-bold cancel-btn"
                  color="btn hover_shine cancel_button"
                  >{{ $t("cancel") }}</v-btn
                >
              </div>
            </template>
            <span>{{ $t("cancel") }}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div v-on="on" class="d-inline-block">
                <v-btn
                  :disabled="isBtnLoading"
                  color="green darken-1"
                  @click="saveQuestions"
                  small
                  class="mr-2 success hover_shine"
                >
                  {{ $t("save") }}
                  <b-spinner small v-if="isBtnLoading"></b-spinner>
                </v-btn>
              </div>
            </template>
            <span>{{ $t("save") }}</span>
          </v-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import VueElementLoading from "vue-element-loading";
import MediaSelect from "../Components/Upload/MediaSelect.vue";

export default {
  components: {
    VueElementLoading,
    MediaSelect,
  },
  data: () => ({
    valid: true,
    loader: false,
    isBtnLoading: false,
    role_array: [],
    lookup_array: [],
    field_type_array: [],
    question_array: {
      id: 0,
      questions: "",
      section_id: null,
      section_menu: "",
      registered_name: "",
      role_type_id: "",
      lookup_parent_name: "",
      field_type: "",
      sequence: 0,
      is_field_required: "",
      status: "",
    },
    section_head: [],
    section_name: [],
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },

  created() {
    this.fetchlookup();
    this.fetchAllRole();
    this.fetchAllLookupParent();
  },
  watch: {
    "$route.query.question": {
      immediate: true,
      handler() {
        if (this.$route.query.question) {
          this.loader = true;
          axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "fetchquestionbyid/" +
                this.$route.query.question
            )
            .then((res) => {
              if (res.data.status == "S") {
                this.loader = false;
                this.question_array = res.data.question;
                this.question_array.section_menu =
                  res.data.question.fetchsection.parent_menu;
                this.fetchsectionname(this.question_array.section_menu);
                this.question_array.section_id = res.data.question.section_id;
                this.fetchsectionrole(this.question_array.section_id);
                this.question_array.is_field_required = res.data.field;
              }
            })
            .catch((err) => {
              this.loader = false;
              console.log("this error" + err);
            });
        }
      },
    },

    "$route.query.sequence": {
      immediate: true,
      handler() {
        this.question_array.sequence = this.$route.query.sequence;
      },
    },
  },

  methods: {
    fetchsectionname(id) {
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetchsectionnamefromheader/" + id
        )
        .then((response) => {
          this.section_name = response.data.section;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchsectionrole(id) {
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetchrolenamefromsection/" + id
        )
        .then((response) => {
          this.role_array = [];
          this.role_array = response.data.role;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    saveQuestions() {
      if (this.$refs.form.validate()) {
        this.isBtnLoading = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "createamendquestions",
            this.question_array
          )
          .then((res) => {
            if (res.data.status == "S") {
              this.flashMessage.success({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.$router.push({
                name: "questions",
              });
            } else {
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
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
            this.isBtnLoading = false;
          });
      }
    },

    fetchlookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "FIELD_TYPE",
          },
        })
        .then((response) => {
          this.field_type_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "HEADER_MENU_SECTION",
          },
        })
        .then((response) => {
          this.section_head = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetchAllRole() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchalluserroles")
        .then((response) => {
          this.role_array = response.data.roles;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetchAllLookupParent() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchalllookupparentsvalues")
        .then((response) => {
          this.lookup_array = response.data.lookup;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style scoped>
.v-input__slot {
  padding-left: 3px !important;
}

.checkboxcomponent /deep/ .v-label {
  font-size: 16px !important;
  padding-top: 6px !important;
}
</style>