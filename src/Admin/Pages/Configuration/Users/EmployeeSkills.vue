<template>
  <div class="main-20">
    <div>
      <v-app-bar flat color="white">
        <!-- <div class="pagetitle_in_userdetails">
      <page-title
        :heading="$t('employee_skills')"
        :google_icon="google_icon"
      ></page-title> 
    </div>-->
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              v-if="view == 'userview' && status"
              class="btn mr-2 mb-2 hover_shine add_new"
              small
              v-on="on"
              @click="dialog_open_when_add"
            >
              {{ $t("add") }}
            </v-btn>
          </template>
          <span>{{ $t("add") }}</span>
        </v-tooltip>
      </v-app-bar>
      <v-data-table
        :loading="initval"
        :headers="headers"
        :items="employee_skills"
        v-bind:no-data-text="$t('no_data_available')"
        :footer-props="{ 'items-per-page-text': $t('rows_per_page') }"
      >
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.skills }}</td>
            <td>
              <span v-if="props.item.proficiency">{{
                props.item.proficiency
              }}</span>
              <span v-else>{{ $t("not_appllicable") }}</span>
            </td>
            <td>
              <span v-if="props.item.last_worked_on">{{
                props.item.last_worked_on
              }}</span>
              <span v-else>{{ $t("not_appllicable") }}</span>
            </td>
           
            <td>{{ props.item.created_at | formatdateMonthyear }}</td>
            <td class="text-center px-0" v-if="view == 'userview' && status">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    small
                    class="mr-3 edit_btn icon_size"
                    v-on="on"
                    @click="editSkillsDialog(props.item.id)"
                  >
                    mdi-pencil-outline</v-icon
                  >
                </template>
                <span>{{ $t("edit") }}</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    class="delete_btn icon_size"
                    v-on="on"
                    small
                    @click="deleteItem(props.item.id)"
                    >mdi-trash-can-outline</v-icon
                  >
                </template>
                <span>{{ $t("delete") }}</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-dialog
        persistent
        v-model="dialog"
        fullscreen
        transition="dialog-bottom-transition"
        max-width="1100px"
      >
        <v-card>
          <v-toolbar color="primary" dark>
            <span class="headline">{{
              $t("create_amend_employee_skills")
            }}</span>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  @click="close"
                  class="dialogcloseinuserdetails"
                  v-on="on"
                  >mdi-close</v-icon
                >
              </template>
              <span>{{ $t("close") }}</span>
            </v-tooltip>
          </v-toolbar>
          <v-alert
            v-model="save_error"
            :text="save_error"
            color="error"
            icon="warning"
            outlined
            dismissible
          >
            {{ valertdialogmessage }}</v-alert
          >
          <v-form ref="userform" v-model="valid">
            <div
              v-for="(skills, i) in skillsArray"
              :key="i"
              elevation="5"
              class="mb-4 ml-2 mt-3"
              v-bind:class="[
                skillsArray.length > 1 && i != skillsArray.length - 1
                  ? 'bottomborderloop'
                  : '',
              ]"
            >
              <v-layout pt-1>
                <v-flex
                  xs12
                  md3
                  class="createlookupflex"
                  v-if="candidateskillsitems"
                >
                  <v-autocomplete
                    v-model="skills.skills"
                    required
                    class="required_field"
                    outlined
                    dense
                    :error="skills.multipleError"
                    :error-messages="skills.multipleErrorMessage"
                    @change="changeSkills(skills.skills, i)"
                    :rules="fieldRules"
                    :items="candidateskillsitems"
                    item-text="longname"
                    item-value="longname"
                    v-bind:label="$t('skill')"
                  >
                  </v-autocomplete>
                  <CreateLookup
                    :dropdownlabel="$t('skills')"
                    lookup_parent_name="TECHNICAL_SKILLS_HEADER"
                    @lookup_data="lookupMessage"
                  ></CreateLookup>
                </v-flex>
                <v-flex xs12 md3 pl-1>
                  <v-autocomplete
                    v-bind:label="$t('proficiency')"
                    index="id"
                    item-value="shortname"
                    item-text="longname"
                    v-model="skills.proficiency"
                    :items="skillsproficiencyarray"
                    outlined
                    dense
                  >
                  </v-autocomplete>
                </v-flex>
                <v-flex xs12 md3 pl-1>
                  <v-text-field
                    v-model="skills.experience"
                    v-bind:label="$t('total_experience')"
                    maxlength="20"
                    outlined
                    dense
                  ></v-text-field>
                </v-flex>
                <v-flex md3 sm6 pl-1>
                  <div class="row pr-2">
                    <div class="col-md-9 pr-0">
                      <v-menu
                        v-model="skills.menu2"
                        ref="menu2"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="skills.last_worked_on"
                            v-bind:label="$t('last_worked_on')"
                            append-icon="mdi-calendar"
                            outlined
                            dense
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="skills.last_worked_on"
                          type="month"
                          no-title
                          scrollable
                          :max="new Date().toISOString().substr(0, 10)"
                          @input="formatlastworked(i)"
                          @change="skills.menu2 = false"
                        ></v-date-picker>
                      </v-menu>
                    </div>
                    <div class="col-md-3 pl-0">
                      <div class="row pl-3 pt-4">
                        <v-tooltip bottom v-if="skillsArray.length > 1">
                          <template v-slot:activator="{ on }">
                            <v-icon
                              medium
                              color="error"
                              style="font-size: 30px"
                              v-on="on"
                              @click="deleteskillsmultiple(i)"
                              >mdi-delete</v-icon
                            >
                          </template>
                          <span>{{ $t("delete") }}</span>
                        </v-tooltip>
                        <v-tooltip bottom v-if="i == skillsArray.length - 1">
                          <template v-slot:activator="{ on }">
                            <v-icon
                              medium
                              color="primary"
                              style="font-size: 30px"
                              v-on="on"
                              @click="addskillsmultiple()"
                              >mdi-plus-circle</v-icon
                            >
                          </template>
                          <span>{{ $t("add_new") }}</span>
                        </v-tooltip>
                      </div>
                    </div>
                  </div>
                </v-flex>
              </v-layout>
            </div>
          </v-form>
          <v-card-actions class="container mt-3">
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on" class="d-inline-block mr-2">
                  <v-btn
                    v-on="on"
                    small
                    @click="close"
                    class="ma-1 font-weight-bold"
                    color="dark cancel_button"
                    >{{ $t("cancel") }}</v-btn
                  >
                </div>
              </template>
              <span>{{ $t("cancel") }}</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  @click="save()"
                  small
                  class="mr-2 success hover_shine"
                  color="green darken-1"
                  :disabled="submit_credential_disable"
                >
                  {{ $t("submit") }}
                  <b-spinner
                    :disabled="isBtnLoading"
                    small
                    v-if="isBtnLoading"
                  ></b-spinner>
                </v-btn>
              </template>
              <span> {{ $t("submit") }} </span>
            </v-tooltip>
          </v-card-actions>
          <!-- <v-form ref="userform" v-model="valid">
            <v-card-text class="mt-8">
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md6 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-on="on"
                          v-model="employee_model.skill_name"
                          :rules="fieldRules"
                          dense
                          v-bind:label="$t('skill_name')"
                          outlined
                          class="required_field"
                        ></v-text-field>
                      </template>
                      <span>{{ $t("skill_name") }}</span>
                    </v-tooltip>
                  </v-flex>
                 
                  <v-flex xs12 sm6 md6 pl-2 class="createlookupflex">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          v-on="on"
                          v-model="employee_model.skill_header_id"
                          dense
                          class="pr-2"
                          v-bind:label="$t('skill_category')"
                          outlined
                          item-value="id"
                          item-text="longname"
                          :items="candidateskillsitems"
                        >
                        </v-autocomplete>
                      </template>
                      <span>{{ $t("skill_category") }}</span>
                    </v-tooltip>
                    <CreateLookup
                      lookup_parent_name="TECHNICAL_SKILLS_HEADER"
                      @lookup_data="lookupMessage"
                      :dropdownlabel="$t('skill_category')"
                    ></CreateLookup>
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex xs12 sm6 md6 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-on="on"
                          v-model="employee_model.experience"
                          :rules="fieldRules"
                          dense
                          v-bind:label="$t('experience')"
                          outlined
                          maxlength="2"
                          v-on:keypress="NumbersOnly"
                          class="required_field"
                        ></v-text-field>
                      </template>
                      <span>{{ $t("experience") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 sm6 md6 pl-2 class="createlookupflex">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          v-on="on"
                          v-model="employee_model.rating"
                          :rules="fieldRules"
                          dense
                          item-value="longname"
                          item-text="longname"
                          :items="skillsrating"
                          v-bind:label="$t('rating')"
                          outlined
                          class="required_field"
                        ></v-autocomplete>
                      </template>
                      <span>{{ $t("rating") }}</span>
                    </v-tooltip>
                    <CreateLookup
                      lookup_parent_name="RATING_TYPE"
                      @lookup_data="lookupMessage"
                      :dropdownlabel="$t('rating')"
                    ></CreateLookup>
                  </v-flex>
                </v-layout>
                <v-layout wrap class="submitbuttonindialogusers">
                  <v-flex xs12 sm12 md12 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-textarea
                          v-on="on"
                          v-model="employee_model.description"
                          dense
                          counter="150"
                          rows="2"
                          maxlength="150"
                          v-bind:label="$t('description')"
                          outlined
                        >
                        </v-textarea>
                      </template>
                      <span>{{ $t("description") }}</span>
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
                    <v-btn
                      v-on="on"
                      small
                      @click="close"
                      class="ma-1 font-weight-bold"
                      color="dark cancel_button"
                      >{{ $t("cancel") }}</v-btn
                    >
                  </div>
                </template>
                <span>{{ $t("cancel") }}</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    @click="save()"
                    small
                    class="mr-2 success hover_shine"
                    color="green darken-1"
                    :disabled="submit_credential_disable"
                  >
                    {{ $t("submit") }}
                    <b-spinner
                      :disabled="isBtnLoading"
                      small
                      v-if="isBtnLoading"
                    ></b-spinner>
                  </v-btn>
                </template>
                <span> {{ $t("submit") }} </span>
              </v-tooltip>
            </v-card-actions>
          </v-form> -->
        </v-card>
      </v-dialog>
      <ConfirmDialog
        :id="delete_id"
        :show="dialogDelete"
        :cancel="closeDelete"
        :confirm="deleteItemConfirm"
        v-bind:title="$t('confirm')"
        v-bind:description="$t('want_to_delete')"
      />
    </div>
  </div>
</template>
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import CreateLookup from "../../../Pages/CreateLookup.vue";

export default {
  components: {
    PageTitle,
    ConfirmDialog,
    CreateLookup,
  },
  props: ["user_id", "view", "status"],
  data: () => ({
    valertdialogmessage: "",
    save_error: false,
    google_icon: {
      icon_name: "Badge",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    panel: [0, 1],
    readonly: false,
    message: "",
    delete_id: "",
    dialog: false,
    initval: false,
    isBtnLoading: false,
    valid: true,
    candidateskillsitems: [],
    skillsrating: [],
    employee_skills: [],
    dialogDelete: false,
    showConfirmDialog: false,
    candidateskills: {
      id: 0,
      skills: "",
      experience: "",
      description: "",
      rating: "",
      multipleError: false,
      menu2: false,

      multipleErrorMessage: "",
    },
    skillsproficiencyarray: [],
    skillsArray: [],
    submit_credential_disable: false,
  }),
  mounted() {},
  created() {
    this.fetchlookup();
  },
  watch: {
    user_id: {
      immediate: true,
      handler() {
        this.fetchSkills();
      },
    },
  },

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    headers() {
      if (this.view == "userview" && this.status) {
        return [
          {
            text: this.$t("Skill Name"),
            align: "start",
            sortable: false,
            value: "skills",
          },

          {
            text: "Proficiency",
            value: "proficiency",
          },
          {
            text: "Experience",
            value: "experience",
          },
          //   {
          //   text: "Rating",
          //   value: "rating",
          //  sortable: false,
          //},
          // {
          // text: "Description",
          // value: "description",
          //},
          {
            text: "Created At",
            value: "created_at",
          },
          {
            text: this.$t("action"),
            align: "center",
            value: "class_name",
          },
        ];
      } else {
        return [
          {
            text: this.$t("Skill Name"),
            align: "start",
            sortable: false,
            value: "skills",
          },

          {
            text: "Proficiency",
            value: "proficiency",
          },
          {
            text: "Experience",
            value: "experience",
          },
          //   {
          //   text: "Rating",
          //   value: "rating",
          //  sortable: false,
          //},
          // {
          // text: "Description",
          // value: "description",
          //},
        ];
      }
    },
  },
  methods: {
    formatlastworked(index) {
      if (this.skillsArray[index].last_worked_on) {
        const year = this.skillsArray[index].last_worked_on.substr(0, 4);
        const month = this.skillsArray[index].last_worked_on.substr(5, 2);
        const options = { year: "numeric", month: "short" };
        const formattedDate = new Date(year, month - 1).toLocaleDateString(
          undefined,
          options
        );
        this.skillsArray[index].last_worked_on = formattedDate;
      } else {
        this.skillsArray[index].last_worked_on = "";
      }
    },
    addskillsmultiple() {
      if (this.$refs.userform.validate()) {
        this.skillsArray.push(this.candidateskills);
        this.candidateskills = {
          id: 0,
          skills: "",
          experience: "",
          description: "",
          rating: "",
          multipleError: false,
          multipleErrorMessage: "",
        };
      }
    },
    cancel() {
      this.showConfirmDialog = false;
      this.skills_index = null;
    },
    deleteskillsmultipleconfirm(index) {
      this.skillsArray.splice(index, 1);
    },
    confirm() {
      if (this.skills_index != null) {
        this.deleteskillsmultipleconfirm(this.skills_index);
      }

      this.cancel();
    },
    changeSkills(skill, skilindex) {
      this.valid = true;
      for (var j = 0; j < this.skillsArray.length; j++) {
        this.skillsArray[j].multipleError = false;
        this.skillsArray[j].multipleErrorMessage = "";
      }
      for (var i = 0; i < this.skillsArray.length; i++) {
        if (this.skillsArray[i].skills == skill && i != skilindex) {
          this.skillsArray[skilindex].multipleError = true;
          this.skillsArray[skilindex].multipleErrorMessage = this.$t(
            "duplicate_skills_cant_add"
          );
          this.valid = false;
        }
      }
    },
    deleteskillsmultiple(index) {
      if (this.skillsArray[index].skills) {
        this.showConfirmDialog = true;
        this.skills_index = index;
      } else {
        this.deleteskillsmultipleconfirm(index);
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

    fetchSkills() {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetchemployeeskills/" +
            this.user_id
        )
        .then((res) => {
          this.employee_skills = res.data.data;
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
            lookup_type: "SKILLS_PROFICIENCY",
          },
        })
        .then((response) => {
          this.skillsproficiencyarray = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "TECHNICAL_SKILLS_HEADER",
          },
        })
        .then((response) => {
          this.candidateskillsitems = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "RATING_TYPE",
          },
        })
        .then((response) => {
          this.skillsrating = response.data.lookup_details;
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
            "deleteemployeeskill/" +
            this.delete_id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.fetchSkills();
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
      this.save_error = false;
      if (this.skillsArray.length > 0) {
        this.dialog = true;
      } else {
        this.skillsArray = [
          {
            id: 0,
            skills: "",
            experience: "",
            description: "",
            rating: "",
            multipleError: false,
            menu2: false,

            multipleErrorMessage: "",
          },
        ];
        this.dialog = true;
      }
      // this.$refs.userform.reset();
    },
    close() {
      this.dialog = false;
      this.delete_id = "";
      this.initval = false;
      this.skillsArray = [];
      this.submit_credential_disable = false;
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

        axios
          .post(process.env.VUE_APP_API_URL_ADMIN + "createemployeeskill", {
            skills_data: this.skillsArray,
            emp_id: this.user_id,
          })
          .then((response) => {
            if (response.data.status == "S") {
              this.flashMessage.success({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.close();
              this.fetchSkills();
            } else if (response.data.status == "E") {
              this.submit_credential_disable = false;
              this.isBtnLoading = false;
              this.valertdialogmessage = response.data.message;
              this.save_error = true;
              // this.close();
              // this.fetchSkills();
            } else {
              this.submit_credential_disable = false;
              this.isBtnLoading = false;
              this.valertdialogmessage = response.data.message;
              this.save_error = true;
            }
          })
          .catch((err) => {
            this.submit_credential_disable = false;
            this.isBtnLoading = false;
            this.valertdialogmessage = this.$t("something_went_wrong");
            this.save_error = true;
            console.log(err);
            this.close();
          });
      }
    },
    editSkillsDialog(id) {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetchemployeeskillsedit/" + id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.skillsArray = [];

            this.skillsArray.push(res.data.employee_skills);
            this.dialog = true;
            this.initval = false;
          }
          if (res.data.status == "E") {
            this.flashMessage.error({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.close();
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
  },
};
</script>

<style scoped>
.vtooltip_hover_description {
  min-height: 100px;
  max-width: 180px;
  padding: 10px 20px;
  background-color: antiquewhite;
}
.bottomborderloop {
  border-bottom: solid rgb(204, 200, 200) 1px;
}
</style>
