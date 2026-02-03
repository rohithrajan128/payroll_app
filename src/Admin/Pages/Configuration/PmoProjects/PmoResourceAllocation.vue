<template>
  <div class="main-20">
    <div></div>
    <div>
      <v-app-bar flat color="white">
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              class="btn mr-2 mb-2 hover_shine add_new"
              small
              v-on="on"
              @click="dialog_open_when_add(projectid)"
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
        :items="allresources"
        v-bind:no-data-text="$t('no_data_available')"
        :footer-props="{ 'items-per-page-text': $t('rows_per_page') }"
      >
        <template v-slot:item="props">
          <tr>
            <td>
              <span v-if="props.item.hr_emp_id.full_details">
                {{ props.item.hr_emp_id.full_details }}
              </span>
              <span v-else>
                {{ $t('not_appllicable') }}
              </span>
              {{ props.item.hr_emp_id.full_details }}</td>
            <td>{{ props.item.start_date | formatDate }}</td>
            <td>{{ props.item.end_date | formatDate }}</td>
            <td class="text-center px-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    small
                    class="mr-3 edit_btn icon_size"
                    v-on="on"
                    @click="editallocation(props.item.id)"
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
      <v-dialog persistent v-model="dialog" max-width="800px">
        <v-card>
          <v-toolbar color="primary" dark>
            <span class="headline">{{ $t("create_amend_resource") }}</span>
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
          <v-form ref="resourceform" v-model="valid">
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md6 pl-2>
                    <v-autocomplete
                      v-model="resource_allocation.emp_id"
                      :rules="fieldRules"
                      no-data-text="No Data available"
                      dense
                      v-bind:label="$t('res_name')"
                      outlined
                      class="required_field"
                      item-value="id"
                      item-text="full_details"
                      @change="fetchempdoj(resource_allocation.emp_id)"
                      :items="empid_list"
                    >
                    </v-autocomplete>
                  </v-flex>
                  <v-flex xs12 sm6 md6 pl-2>
                    <v-autocomplete
                      v-model="resource_allocation.project_id"
                      :rules="fieldRules"
                      dense
                      v-bind:label="$t('project_name')"
                      outlined
                      class="required_field"
                      item-value="id"
                      disabled
                      item-text="project_name"
                      :items="projectid_list"
                    >
                    </v-autocomplete>
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex xs12 sm6 md6 pl-2>
                    <DatePicker
                      :label="$t('start_date')"
                      :rules="fieldRules"
                      :min="projectStartDate"
                      :max="projectEndDate"
                      :class_required="'RequiredField'"
                      :stored_date="resource_allocation.start_date"
                      @formatted_date="formattedStartDate"
                      dense
                      required
                    />
                  </v-flex>
                  <v-flex xs12 sm6 md6 pl-2>
                    <DatePicker
                      :label="$t('end_date')"
                      :min="resource_allocation.start_date"
                      :stored_date="resource_allocation.end_date"
                      @formatted_date="formattedEndDate"
                      :max="projectEndDate"
                      dense
                      required
                    />
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    @click="saveallocation()"
                    small
                    class="mr-2 success hover_shine mb-3"
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
          </v-form>
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
import DatePicker from "../Components/DatePicker.vue";
export default {
  components: {
    PageTitle,
    ConfirmDialog,
    DatePicker,
  },
  props: [
    "projectid",
    "project_name",
    "projects",
    "project_start_date",
    "project_end_date",
  ],
  data: () => ({
    google_icon: {
      icon_name: "ballot",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    valertdialogmessage: "",
    save_error: false,
    user: "",
    projectStartDate: "",
    projectEndDate: "",
    user_org_id: "",
    delete_id: "",
    dialog: false,
    initval: false,
    isBtnLoading: false,
    valid: true,
    empid_list: [],
    projectid_list: [],
    dialogDelete: false,
    todaysdate: new Date().toISOString().substr(0, 10),
    resource_allocation: {
      emp_id: "",
      project_id: "",
      start_date: "",
      end_date: "",
    },
    allresources: [],
    headers: [
      {
        text: "Resource",
        value: "emp_id",
      },

      {
        text: "Start Date",
        value: "start_date",
      },
      {
        text: "End Date",
        value: "end_date",
      },
      {
        text: "Actions",
        value: "name",
        align: "center",
      },
    ],
    submit_credential_disable: false,
  }),
  mounted() {
    this.fetchAllProjects();
    this.user = JSON.parse(localStorage.getItem("user"));
    this.user_org_id = this.user.hr_employee.org_id;
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          // this.loader = true;
          this.fetchresourceallocated();
        }
      },
    },
    project_start_date: {
      immediate: true,
      handler() {
        this.projectStartDate = this.project_start_date;
        // alert(this.project_start_date)
        // if (this.project_start_date > this.todaysdate) {
        // }
        // else{
        //   this.projectStartDate = this.todaysdate
        // }
      },
    },
    project_end_date: {
      immediate: true,
      handler() {
        if (this.project_end_date) {
          this.projectEndDate = this.project_end_date;
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
    fetchempdoj(emp_id) {
      var joining_date = "";
      joining_date = this.empid_list.find((x) => x.id === emp_id).Joining_date;
      if (this.project_start_date >= joining_date) {
        this.projectStartDate = this.project_start_date;
      } else {
        this.projectStartDate = this.todaysdate;
      }
    },
    fetchresourceallocated() {
      this.allresources = [];
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "getallresource?slug=" +
            this.$route.query.slug
        )
        .then((res) => {
          this.allresources = res.data.resources;
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

    deleteItem(id) {
      this.delete_id = id;
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.initval = true;
      this.dialogDelete = false;

      axios
        .delete(
          process.env.VUE_APP_API_URL_ADMIN + "deleteresource/" + this.delete_id
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
            this.initval = true;
            this.fetchresourceallocated();
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
            // this.initval = true;
          } else {
            this.flashMessage.error({
              message: this.array_data,
            });
            // this.initval = true;
            this.fetchresourceallocated();
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
    dialog_open_when_add(id) {
      this.dialog = true;
      this.resource_allocation.id = 0;
      this.resource_allocation.start_date = "";
      this.resource_allocation.end_date = "";
      // this.$refs.resourceform.reset();
      this.resource_allocation.project_id = JSON.parse(id);
      // this.fetchprojectid(id);
      this.fetchempid(this.user_org_id);
    },
    close() {
      this.save_error = false;
      this.dialog = false;
      this.delete_id = "";
      this.initval = false;
      this.submit_credential_disable = false;
      this.isBtnLoading = false;
      this.$refs.resourceform.reset();
    },
    closeDelete() {
      this.dialogDelete = false;
    },
    saveallocation() {
      if (this.$refs.resourceform.validate()) {
        this.submit_credential_disable = true;
        this.isBtnLoading = true;

        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "createresource",
            this.resource_allocation
          )
          .then((response) => {
            if (response.data.status == "S") {
              this.flashMessage.success({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.close();
              this.fetchresourceallocated();
            }
            if (response.data.status == "E") {
              this.submit_credential_disable = true;
              this.isBtnLoading = true;
              this.valertdialogmessage = response.data.message;
              this.save_error = true;
            }
          })
          .catch((err) => {
            this.submit_credential_disable = true;
            this.isBtnLoading = true;
            this.valertdialogmessage = this.$t("something_went_wrong");
            this.save_error = true;
            console.log(err);
          });
      }
    },
    editallocation(id) {
      this.dialog = true;
      this.initval = false;
      this.fetchempid(this.user_org_id);
      this.fetchAllProjects();
      this.resource_allocation.start_date = "";
      this.resource_allocation.end_date = "";
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "edit_resource/" + id)
        .then((res) => {
          // setTimeout(() => {
          this.resource_allocation = res.data.resources;
          // this.resource_allocation.start_date = res.data.resources.start_date;
          // this.resource_allocation.end_date = res.data.resources.end_date;
          // }, 1000);
          this.loader = false;
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

    formattedStartDate(formatted_date) {
      this.resource_allocation.start_date = formatted_date;
    },
    formattedEndDate(formatted_date) {
      this.resource_allocation.end_date = formatted_date;
    },
    fetchempid(user_org_id) {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getempid", {
          params: {
            org_id: user_org_id,
            projects: this.projects.project_manager_id,
          },
        })
        .then((res) => {
          this.empid_list = res.data.emp_ids;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchAllProjects() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getprojectid")
        .then((res) => {
          this.projectid_list = res.data.project_ids;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetchprojectid(id) {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getprojectid")
        .then((res) => {
          this.projectid_list = res.data.project_ids;
          this.resource_allocation.project_id = JSON.parse(id);
          this.project_start_date = JSON.parse(id);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
