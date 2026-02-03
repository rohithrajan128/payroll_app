<template>
  <div class="main-20">
    <div>
      <v-app-bar flat color="white">
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-if="view == 'userview' && status" class="btn mr-2 mb-2 hover_shine add_new" small v-on="on"
              @click="dialog_open_when_add">
              {{ $t("add") }}
            </v-btn>
          </template>
          <span>{{ $t("add") }}</span>
        </v-tooltip>
      </v-app-bar>
      <v-data-table :loading="initval" :headers="headers" :items="education_details" :single-expand="singleExpand"
        item-key="id" v-bind:no-data-text="$t('no_data_available')">
        <template v-slot:item="{ item, expand, isExpanded }">
          <tr>
            <td v-if="item.type_id != null">
              {{ item.educationcoursetype.shortname }}
            </td>
            <td>{{ item.university_name }}</td>
            <td v-if="item.year_of_enrolment">{{ item.year_of_enrolment | formatMonth  }}</td>
            <td class="values" v-else>{{ $t("not_appllicable") }}</td>
            <td v-if="item.year_of_passing">{{ item.year_of_passing | formatMonth }}</td>
            <td class="values" v-else>{{ $t("not_appllicable") }}</td>
            <td v-if="item.subject_major">{{ item.subject_major }}</td>
            <td class="values" v-else>{{ $t("not_appllicable") }}</td>
            <td>{{ item.class_obtained }}</td>
            <td>
              <div v-if="item.downloaddocument && view == 'userview' && status">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <a v-on="on" class="text-center" :href="document_url + item.downloaddocument.doct_type"
                      target="_blank">
                      <v-icon color="blue" class="px-3">mdi-download</v-icon>
                    </a>
                  </template>
                  <span>{{ $t("Download") }}</span>
                </v-tooltip>
              </div>
              <div v-else>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <a v-on="on" target="_blank">
                      <v-icon color="blue" disabled class="px-3">mdi-download</v-icon>
                    </a>
                  </template>
                  <span>{{ $t("no_file_available") }}</span>
                </v-tooltip>
              </div>
            </td>
            <!-- <td>{{ item.enrolment_no }}</td> -->
            <td class="text-center px-0" v-if="view == 'userview' && status">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon small class="mr-3 edit_btn icon_size" v-on="on" @click="editEducationDialog(item.id)">
                    mdi-pencil-outline</v-icon>
                </template>
                <span>{{ $t("edit") }}</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon class="delete_btn icon_size" v-on="on" small
                    @click="deleteItem(item.id)">mdi-trash-can-outline</v-icon>
                </template>
                <span>{{ $t("delete") }}</span>
              </v-tooltip>
            </td>
            <td @click="expand(!isExpanded)">
              <v-btn icon v-if="isExpanded == false">
                <v-icon>mdi-arrow-down-drop-circle-outline</v-icon>
              </v-btn>
              <v-btn icon v-else>
                <v-icon>mdi-arrow-up-drop-circle-outline</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <tr>
            <td :colspan="headers.length" class="bg-grey pl-4 pr-3 pb-2 pt-1">
              <v-row class="justify-space-around">
                <v-col md="3">
                  <span class="expand_row_header_edu">
                    {{ $t("institue_college_name") }}
                  </span>
                  <div class="values" v-if="item.institute_name != null">
                    {{ item.institute_name }}
                  </div>
                  <div class="values" v-else>
                    {{ $t("not_appllicable") }}
                  </div>
                </v-col>
                <v-col md="3">
                  <span class="expand_row_header_edu">
                    {{ $t("enrolment_no") }} :
                  </span>
                  <div class="values" v-if="item.enrolment_no != null">
                    {{ item.enrolment_no }}
                  </div>
                  <div class="values" v-else>
                    {{ $t("not_appllicable") }}
                  </div>
                </v-col>
                <v-col md="3">
                  <span class="expand_row_header_edu">
                    {{ $t("program") }} :
                  </span>
                  <div class="values" v-if="item.educationprogramtype">
                    {{ item.educationprogramtype.shortname }}
                  </div>
                  <div class="values" v-else>
                    {{ $t("not_appllicable") }}
                  </div>
                </v-col>
                <v-col md="3">
                  <span class="expand_row_header_edu">
                    {{ $t("comments") }} :
                  </span>
                  <v-tooltip bottom v-if="item.comments" max-width="370" color="white">
                    <template v-slot:activator="{ on }">
                      <div class="description_hover_div_edu" v-on="on">
                        {{ item.comments }}
                      </div>
                    </template>
                    <v-sheet class="pa-4 b">{{ item.comments }}</v-sheet>
                  </v-tooltip>
                  <div class="values" v-else>
                    {{ $t("not_appllicable") }}
                  </div>
                </v-col>
              </v-row>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-dialog fullscreen transition="dialog-bottom-transition" persistent v-model="dialog" max-width="1100px">
        <v-card class="container">
          <v-toolbar color="primary" dark>
            <span class="headline">{{
              $t("create_amend_education_details")
            }}</span>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon @click="close" class="dialogcloseinuserdetails" v-on="on">mdi-close</v-icon>
              </template>
              <span>{{ $t("close") }}</span>
            </v-tooltip>
          </v-toolbar>
          <v-alert v-model="save_error" :text="save_error" color="error" icon="warning" outlined dismissible>
            {{ valertdialogmessage }}</v-alert>
          <v-form ref="userform" v-model="valid">
            <v-card-text class="mt-8">
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4 pl-2 class="createlookupflex">
                    <v-autocomplete v-model="education_model.type_id" :rules="fieldRules" dense
                      v-bind:label="$t('course')" outlined class="required_field" item-value="id" item-text="longname"
                      :error="course_exist_focus" :error-messages="course_exist_focus_message" :items="courselist"
                      @change="course_exist_check(education_model.type_id)"
                      :disabled="course_disable_when_edit"></v-autocomplete>
                    <CreateLookup lookup_parent_name="EDUCATION_TYPE" @lookup_data="lookupMessage"
                      :dropdownlabel="$t('course')"></CreateLookup>
                  </v-flex>
                  <v-flex xs12 sm6 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" maxlength="100" v-model="education_model.university_name"
                          :rules="fieldRules" dense v-bind:label="$t('university_board_name')" outlined
                          class="required_field"></v-text-field>
                      </template>
                      <span>{{ $t("university_board_name") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 sm6 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field maxlength="15" v-on="on" v-model="education_model.enrolment_no" :rules="fieldRules"
                          required dense v-bind:label="$t('enrolment_no')" outlined class="required_field"></v-text-field>
                      </template>
                      <span>{{ $t("enrolment_no") }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4 pl-2>


                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-menu v-on="on" v-model="menu" ref="menu" :close-on-content-click="false"
                          transition="scale-transition" offset-y max-width="290px" min-width="auto">
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field v-model="formattedDate" v-bind:label="$t('year_of_enrolment')"
                              class="required_field" :rules="fieldRules" append-icon="mdi-calendar" outlined dense
                              v-bind="attrs" v-on="on"></v-text-field>
                          </template>
                          <v-date-picker v-model="education_model.year_of_enrolment" type="month" no-title scrollable
                            :max="new Date().toISOString().substr(0, 10)" @input="formatDate"
                            @change="menu = false"></v-date-picker>
                        </v-menu>
                      </template>
                      <span>{{ $t("year_of_enrolment") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 sm6 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-menu v-on="on" v-model="menu1" ref="menu1" :close-on-content-click="false"
                          transition="scale-transition" offset-y max-width="290px" min-width="auto">
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field v-model="formattedDate1" v-bind:label="$t('year_of_passing')"
                             append-icon="mdi-calendar" outlined dense
                              v-bind="attrs" v-on="on"></v-text-field>
                          </template>
                          <v-date-picker v-model="education_model.year_of_passing" type="month" no-title scrollable
                            :max="new Date().toISOString().substr(0, 10)" @input="formatDate1"
                            @change="menu = false"></v-date-picker>
                        </v-menu>
                      </template>
                      <span>{{ $t("year_of_enrolment") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 sm6 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" v-model="education_model.class_obtained" :rules="fieldRules" dense
                          v-bind:label="$t('class_obtained/cgpa')" maxlength="30" outlined
                          class="required_field"></v-text-field>
                      </template>
                      <span>{{ $t("class_obtained/cgpa") }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" maxlength="100" v-model="education_model.institute_name" dense
                          v-bind:label="$t('institue_college_name')" outlined></v-text-field>
                      </template>
                      <span>{{ $t("institue_college_name") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 sm6 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field maxlength="100" v-on="on" v-model="education_model.subject_major" dense
                          v-bind:label="$t('subject_specialization')" outlined></v-text-field>
                      </template>
                      <span>{{ $t("subject_specialization") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 sm6 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete item-value="id" item-text="longname" :items="programselect" v-on="on"
                          v-model="education_model.program" dense v-bind:label="$t('program')" outlined></v-autocomplete>
                      </template>
                      <span>{{ $t("program") }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
                <v-layout wrap class="submitbuttonindialogusers">
                  <v-flex xs12 sm12 md8 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-textarea v-on="on" v-model="education_model.comments" dense rows="2" maxlength="500"
                          v-bind:label="$t('comments')" outlined counter="500"></v-textarea>
                      </template>
                      <span>{{ $t("comments") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 sm12 md4 pl-2 class="my-auto">
                    <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
                    <div class="browsedivdoc">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-text-field readonly outlined dense v-on="on" @click="callDocumentSelect"
                            v-model="education_model.doct_type" v-bind:label="$t('upload_doc')"
                            class="text-fied-align"></v-text-field>
                          <v-chip label class="browsebtndoc" @click="callDocumentSelect" color="primary" v-on="on">{{
                            $t("browse") }}</v-chip>
                        </template>
                        <span>{{ $t("upload_doc") }}</span>
                      </v-tooltip>
                    </div>

                    <div v-if="education_model.doct_type" class="documentdownloadapplyleave">
                      <a :href="document_url + education_model.doct_type" class="text-primary f-13 a-underline">
                        {{ $t("download") }}
                      </a>
                    </div>
                  </v-flex>
                  <v-flex xs12 sm6 md4 style="display: none">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <span v-on="on">
                          <DocumentSelect :label="'Proof '" :folder="'ProofDocument'" :uploadtype="enable_document_select"
                            @closeDialog="closeDocumentSelectDialog" @uploadedDocument="uploadedDocument"
                            :documentlink="education_model.doct_type"></DocumentSelect>
                        </span>
                      </template>
                      <span>{{ $t("file_input") }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions class="container mt-3">
              <v-spacer></v-spacer>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <div v-on="on" class="d-inline-block mr-2">
                    <v-btn v-on="on" small @click="close()" class="ma-1 font-weight-bold cancel-btn" color="secondary">{{
                      $t("cancel") }}</v-btn>
                  </div>
                </template>
                <span>{{ $t("cancel") }}</span>
              </v-tooltip>

              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" @click="save()" small class="success hover_shine" color="green darken-1"
                    :disabled="submit_credential_disable">
                    {{ $t("submit") }}
                    <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
                  </v-btn>
                </template>
                <span> {{ $t("submit") }} </span>
              </v-tooltip>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
      <ConfirmDialog :id="delete_id" :show="dialogDelete" :cancel="closeDelete" :confirm="deleteItemConfirm"
        v-bind:title="$t('confirm')" v-bind:description="$t('want_to_delete')" />
    </div>
  </div>
</template>
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import DocumentSelect from "../Components/Upload/DocumentSelect.vue";
import VueElementLoading from "vue-element-loading";
import CreateLookup from "../../../Pages/CreateLookup.vue";
export default {
  components: {
    PageTitle,
    ConfirmDialog,
    DocumentSelect,
    VueElementLoading,
    CreateLookup,
  },
  props: ["user_id", "view", "status"],
  data: () => ({
    valertdialogmessage: "",
    save_error: false,
    google_icon: {
      icon_name: "School",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    document_url: process.env.VUE_APP_IMAGE_PATH,
    loader: false,
    panel: [0, 1],
    readonly: false,

    message: "",
    singleExpand: false,
    delete_id: "",
    dialog: false,
    initval: false,
    isBtnLoading: false,
    valid: true,
    programselect: [],
    courselist: [],
    classobtain: [],
    education_details: [],
    dialogDelete: false,
    education_model: {
      id: 0,
      emp_id: "",
      type_id: "",
      institute_name: "",
      university_name: "",
      percentage: "",
      year_of_enrolment: "",
      year_of_passing: "",
      subject_major: "",
      enrolment_no: "",
      comments: "",
      program: "",
      doct_type: "",
    },
    submit_credential_disable: false,
    course_disable_when_edit: false,
    course_exist_focus: false,
    course_exist_focus_message: "",
    enable_document_select: "",
    id_details: {
      typeid: "",
      empid: "",
    },
    menu: false,
    menu1: false,
    formattedDate: "",
    formattedDate1: "",
  }),
  mounted() { },
  created() {
    this.fetchlookup();
  },

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    headers() {
      if (this.view == "userview" && this.status) {
        return [
          {
            text: this.$t("Education Type"),
            sortable: false,
            value: "educationcoursetype.shortname",
          },
          {
            text: "University/Board Name",
            value: "university_name",
            sortable: false,
          },
          {
            text: "Year of Enrolment",
            value: "year_of_enrollment",
          },
          {
            text: "Year of Passing",
            value: "year_of_passing",
          },
          {
            text: "Specialization",
            value: "subject_major",
          },
          {
            text: "Class Obtained",
            value: "class_obtained",
          },
          {
            text: "Downlaod Document",
            value: "doct_type",
          },
          {
            text: this.$t("action"),
            align: "center",
            value: "class_name",
          },
          {
            text: "",
            sortable: false,
          },
        ];
      } else {
        return [
          {
            text: this.$t("Education Type"),
            sortable: false,
            value: "educationcoursetype.shortname",
          },
          {
            text: "University/Board Name",
            value: "university_name",
            sortable: false,
          },
          {
            text: "Year of enrolment",
            value: "year_of_enrollment",
          },
          {
            text: "Year of passing",
            value: "year_of_passing",
          },
          {
            text: "Specialization",
            value: "subject_major",
          },
          {
            text: "Class Obtained",
            value: "class_obtained",
          },
          // {
          //   text: "Enrollment/Seat No",
          //   value: "enrolment_no",
          //   sortable: false,
          // },
          {
            text: "",
            sortable: false,
          },
        ];
      }
    },
  },
  watch: {
    user_id: {
      immediate: true,
      handler() {
        this.fetchEducation();
      },
    },
  },
  methods: {
    formatDate() {
      if (this.education_model.year_of_enrolment) {
        const year = this.education_model.year_of_enrolment.substr(0, 4);
        const month = this.education_model.year_of_enrolment.substr(5, 2);
        const options = { year: "numeric", month: "short" };
        const formattedDate = new Date(year, month - 1).toLocaleDateString(undefined, options);
        this.formattedDate = formattedDate;
      }
      else {
        this.formattedDate = "";
      }
    },
    formatDate1() {
      if (this.education_model.year_of_passing) {
        const year = this.education_model.year_of_passing.substr(0, 4);
        const month = this.education_model.year_of_passing.substr(5, 2);
        const options = { year: "numeric", month: "short" };
        const formattedDate = new Date(year, month - 1).toLocaleDateString(undefined, options);
        this.formattedDate1 = formattedDate;
      }
      else {
        this.formattedDate1 = "";
      }
    },
    lookupMessage(lookup_data) {
      if (lookup_data.status == "S") {
        this.flashMessage.success({
          message: lookup_data.message,
          time: 4000,
          blockClass: "custom-block-class",
        });
        this.fetchlookup();
      } else {
        this.flashMessage.error({
          message: lookup_data.message,
          time: 4000,
          blockClass: "custom-block-class",
        });
      }
    },
    uploadedDocument(file_path) {
      this.loader = true;
      this.education_model.doct_type = file_path;
      this.closeDocumentSelectDialog();
    },
    closeDocumentSelectDialog(uploadtype) {
      this.enable_document_select = "";
      console.log("close dialog", uploadtype);
      this.loader = false;
    },
    callDocumentSelect() {
      this.enable_document_select = "DragDrop";
    },




    fetchEducation() {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
          "fetcheducationdetails/" +
          this.user_id
        )
        .then((res) => {
          this.education_details = res.data.data;

          this.initval = false;
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
        });
    },
    fetchlookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "PROGRAM",
          },
        })
        .then((response) => {
          this.programselect = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "EDUCATION_TYPE",
          },
        })
        .then((response) => {
          this.courselist = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "CLASS_OBTAINED",
          },
        })
        .then((response) => {
          this.classobtain = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteItem(id) {
      this.delete_id = id;
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.initval = true;
      this.dialogDelete = false;
      axios
        .delete(
          process.env.VUE_APP_API_URL_ADMIN +
          "deleteeducation/" +
          this.delete_id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.fetchEducation();
            this.message = res.data.message;
            this.flashMessage.success({
              message: this.message,
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
          console.log(" error" + err);
        });
    },
    dialog_open_when_add() {
      this.dialog = true;
      this.course_exist_focus = false;
      this.course_exist_focus_message = "";
      // this.$refs.userform.reset();
    },
    close() {
      (this.save_error = false), (this.dialog = false);
      this.delete_id = "";
      this.initval = false;
      this.education_model = {};
      this.education_model.id = 0;
      this.submit_credential_disable = false;
      this.course_disable_when_edit = false;
      this.isBtnLoading = false;
      this.$refs.userform.reset();
    },
    closeDelete() {
      this.dialogDelete = false;
    },
    save() {
      if (this.$refs.userform.validate()) {
        this.submit_credential_disable = true;
        this.isBtnLoading = true;
        this.education_model.emp_id = this.user_id;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "createeducationdetail",
            this.education_model
          )
          .then((response) => {
            if (response.data.status == "YOPERROR") {
              this.valertdialogmessage = response.data.message;
              this.save_error = true;
              this.submit_credential_disable = false;
              this.isBtnLoading = false;
            }
            if (response.data.status == "S") {
              this.flashMessage.success({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.close();
              this.fetchEducation();
            } else if (response.data.status == "E") {
              this.valertdialogmessage = response.data.message;
              this.save_error = true;
              this.submit_credential_disable = false;
              this.isBtnLoading = false;
            }
          })
          .catch((err) => {
            this.valertdialogmessage = response.data.message;
            this.save_error = true;
            this.submit_credential_disable = false;
            this.isBtnLoading = false;
            console.log(err);
          });
      }
    },

    editEducationDialog(id) {
      this.initval = true;
      this.course_disable_when_edit = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetcheducationedit", {
          params: {
            id: id,
            emp_id: this.user_id,
          },
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.message = res.data.message;
            this.education_model = res.data.data;
            this.formatDate();
            this.formatDate1();
            this.dialog = true;
            this.initval = false;
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          this.initval = false;
          console.log(" error" + err);
        });
    },
    course_exist_check(type_id) {
      this.id_details.typeid = type_id;
      this.id_details.empid = this.user_id;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "courseexistencecheck",
          this.id_details
        )
        .then((response) => {
          if (response.data.status == "EXIST") {
            this.submit_credential_disable = true;
            this.course_exist_focus = true;
            this.course_exist_focus_message = "Course already added";
          } else {
            this.course_exist_focus = false;
            this.course_exist_focus_message = "";
            this.submit_credential_disable = false;
          }
        })
        .catch((err) => {
          console.log(" error" + err);
        });
    },

    NumbersOnly(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    // allowedMonths: (val) => parseInt(val.split("-")[1], 10) % 2 === 0,
  },
};
</script>
<style scoped>
.browsedivdoc {
  display: inline-flex;
  width: 100%;
  position: relative;
}

.browsedivdoc /deep/ .v-chip {
  border-radius: 0%;
}

.browsedivdoc /deep/ .v-text-field__details {
  display: none;
}

.browsebtndoc {
  height: 40px;
  margin-left: -10%;
  /* margin-top: 30px; */
}

.userform {
  border: none;
}

.heading {
  font-weight: bold;
  font-size: 15px;
}

.values {
  font-weight: 500 !important;
  font-size: 13px;
}

.description_hover_div_edu {
  font-weight: 500 !important;
  font-size: 13px;
  width: 250px;
  height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.expansionpaneldummydiv /deep/ .v-expansion-panel-header {
  align-items: flex-start !important;
}

.expansionpaneldummydiv .v-expansion-panel {
  flex: 1 0 25% !important;
  margin: 10px 50px !important;
  max-width: 40%;
  position: relative;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.theme--light.v-sheet--outlined {
  border: none;
}

.expansion_panel /deep/ .v-expansion-panels {
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between !important;
  list-style-type: none;
  padding: 0;
  width: 100%;
  z-index: 1;
}

.expansionpaneldummydiv /deep/ .v-expansion-panel::before {
  box-shadow: none !important;
}

.expand_row_header_edu {
  font-size: small;
}
</style>
