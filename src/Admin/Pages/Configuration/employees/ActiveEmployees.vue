<template>
  <div class="main-20">
    <!-- <v-app-bar flat color="white"> -->
    <!-- <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-text-field  v-on="on" v-model="search" append-icon="search" label="Search" class="srch_bar" single-line
            hide-details></v-text-field>
        </template>
        <span>{{ $t("search") }}</span>
      </v-tooltip> -->
    <!-- </v-app-bar> -->
    <v-data-table
      :headers="headers"
      :items="allActiveUsers"
      :loading="initval"
      :search="search"
    >
      <template v-slot:item="props">
        <tr v-bind:class="[props.item.empno == null ? 'back_color' : '']">
          <td>
            <router-link
              v-if="props.item.empno != null"
              class="text-decoration-none"
              :to="{
                name: 'users.view',
                query: {
                  slug: props.item.slug,
                  view: 'userview',
                },
              }"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-chip
                    v-on="on"
                    color="#1976d2"
                    small
                    outlined
                    medium
                      class="userindexcodechip px-2"
                  >
                    {{ props.item.empno }}</v-chip
                  >
                </template>
                <span>{{ $t("view") }}</span>
              </v-tooltip>
            </router-link>
            <span v-else>
              <v-chip
                v-on="on"
                color="primary"
                small
                outlined
                medium
                class="userindexcodechip px-2"
                >
                <span  @click="
                  routereditusers(
                    props.item.slug,
                    props.item.empno,
                    props.item.emprole_name.includes('SuperUser')
                  )
                ">

                  {{ $t("draft") }}

                </span>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      class="delete_btn delete_icon_size"
                      v-on="on"
                      small
                      @click="deleteItem(props.item.id)"
                      >mdi-trash-can-outline</v-icon
                    >
                  </template>
                  <span>{{ $t("delete") }}</span>
                </v-tooltip>
              </v-chip>
            </span>
          </td>
          <td
            class=""
            v-bind:class="[
              props.item.empno != null ? 'text-primary' : 'text-primary',
            ]"
          > <div class="widget-content p-0">
                      <div class="widget-content-wrapper">
                        <div class="widget-content-left mr-3">
                          <div class="widget-content-left"  v-if=" props.item.profile_pic">
                            <img width="36" class="rounded-circle" :src="envImagePath + props.item.profile_pic" alt />
                          </div>
                          <div class="widget-content-left"  v-else>
                            <img width="36" class="rounded-circle" src="@/assets/images/default-user-profile-picture.png" alt />
                          </div>
                        </div>
                        <div class="widget-content-left flex2">
                          <div class="widget-heading name-color">{{ props.item.firstname }} {{ props.item.lastname }}</div>
                          <div class="widget-subheading opacity-7 name-color" v-if="props.item.designation.designation">{{props.item.designation.designation}}</div>
                        </div>
                      </div>
                    </div>  </td>
          <td>
            <span v-if="props.item.emp_type == null">
              {{ $t("not_appllicable") }}</span
            >
            <span v-else>{{
              props.item.emptypefromempnumber.employee_type
            }}</span>
          </td>
          <td>
            <span v-if="props.item.designation_id == null">
              {{ $t("not_appllicable") }}</span
            >
            <span v-else>{{
              props.item.designationdetails.designation
            }}</span>
          </td>
          <td>
            {{ props.item.gender }}
          </td>
          <td>
            <span v-if="props.item.levelidname">{{
              props.item.levelidname.level
            }}</span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>{{ props.item.Joining_date | formatdateMonthyear }}</td>
          <td>
            <span v-if="props.item.dob == null">{{
              $t("not_appllicable")
            }}</span>
            <span v-else>{{ props.item.dob | formatdateMonthyear }}</span>
          </td>

          <!-- <td class="param-value">{{ props.item.mobile }}</td> -->
          <!-- <td v-if="props.item.userdetails">{{ props.item.userdetails.email }}</td>
          <td v-else> {{ $t("not_appllicable") }}</td> -->
          <!-- <td class="text-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on" class="d-inline-block">
                  <v-btn class="hover_shine btn mr-2 mb-2" :disabled="isDisabled"
                    @click="changeStatus(props.item.userdetails.emp_id)" small v-bind:class="[
                      props.item.userdetails.status == 1 ? 'success' : 'warning',
                    ]">
                    <span v-if="props.item.userdetails.status == 1" class="spanactivesize">{{ $t("active") }}</span>
                    <span v-if="props.item.userdetails.status == 0" class="spanactivesize">{{ $t("inactive") }}</span>
                  </v-btn>
                </div>
              </template>
              <span>{{ $t("status") }}</span>
            </v-tooltip>
          </td> -->
          <!-- <td class="text-center">
            <router-link class="text-decoration-none" style="color: white" :to="{
              name: 'employee_creation',
              query: { slug: props.item.slug,
                 view: 'userview' },
            }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                 <v-icon v-on="on" >mdi-pencil</v-icon>
                </template>
                <span>{{ $t("edit") }}</span>
              </v-tooltip>
            </router-link>
          </td> -->
        </tr>
      </template>
    </v-data-table>
    <ConfirmDialog
      :show="showConfirmDialog"
      :cancel="cancel"
      :confirm="confirm"
      :id="delete_id"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('delete_confirmation')"
    />
  </div>
</template>

<script>
import ConfirmDialog from "../Components/ConfirmDialog.vue";
export default {
  components: {
    ConfirmDialog,
  },
  data: () => ({
    allActiveUsers: [],
     envImagePath: process.env.VUE_APP_IMAGE_PATH,
    initval: false,
    user: "",
    user_organisation: "",
    user_site: "",
    showConfirmDialog: false,
    delete_id: "",
    headers: [
      {
        text: "Employee No",
        align: "left",
        sortable: false,
        value: "empno",
      },
      {
        text: "Name",
        align: "left",
        sortable: false,
        value: "firstname",
      },
      {
        text: "Employee Type",
        align: "left",
        sortable: false,
        value: "emptypelookupdetails.longname",
      },
      {
        text: "Designation",
        align: "left",
        sortable: false,
        value: "designationlookupdetails.longname",
      },
      {
        text: "Gender",
        align: "left",
        sortable: false,
        value: "gender",
      },

      {
        text: "Level ID",
        sortable: false,
        // value: "levelidname.level_id",
      },
      {
        text: "Date of Joining",
        sortable: false,
        value: "Joining_date",
      },
      {
        text: "Date of Birth",
        sortable: false,
        value: "dob",
      },

      // {
      //   text: "Actions",
      //   value: "name",
      //   align: "center",
      // },
    ],
  }),
  props: ["search"],
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.user_organisation = this.user.hr_employee.org_id;
    this.user_site = this.user.hr_employee.site_id;
    this.fetchActiveUsers();
  },
  routereditusers(slug, empno, role) {
    if (role) {
      return;
    }
    if (empno != null) {
      this.$router.push({
        name: "users.view",
        query: {
          slug: slug,
          view: "userview",
        },
      });
    } else {
      this.$router.push({
        name: "employee_creation",
        query: {
          slug: slug,
          pathname: "userview",
        },
      });
    }
  },
  methods: {
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm(id) {
      this.deleteConfirm(id);
      this.showConfirmDialog = false;
    },
    deleteItem(template_id) {
      this.delete_id = template_id;
      this.showConfirmDialog = true;
    },
    deleteConfirm(id) {
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "delete_draft_user/" + id)
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
            this.fetchActiveUsers();
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
          } else {
            this.flashMessage.error({
              message: this.array_data,
            });
            this.fetchActiveUsers();
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
    routereditusers(slug, empno) {
      if (empno != null) {
        this.$router.push({
          name: "users.view",
          query: {
            slug: slug,
            view: "userview",
          },
        });
      } else {
        this.$router.push({
          name: "employee_creation",
          query: {
            slug: slug,
            pathname: "userview",
          },
        });
      }
    },

    fetchActiveUsers() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchactiveuser", {
          params: {
            org_id: this.user_organisation,
            site_id: this.user_site,
          },
        })
        .then((res) => {
          this.allActiveUsers = res.data.usersdata;
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

    statusUpdate() {
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "updateuserstatus", {
          id: this.status_id,
        })
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
            this.fetchActiveUsers();
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
          } else {
            this.flashMessage.error({
              message: this.array_data,
            });
            this.initval = true;
            this.fetchActiveUsers();
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
.v-text-field /deep/ .v-input__slot {
  min-height: 38px !important;
  width: 353px;
}

.param-value {
  max-width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.view_btn {
  cursor: pointer !important;
}

.usernamehoverstyle:hover {
  cursor: pointer;
  font-weight: 500;
}

.usernamehoverstyle {
  font-weight: 500;
  color: #1976d2;
}

.delete_icon_size {
  font-size: 20px !important;
}
.userindexcodechip{
  cursor:pointer;
}
.name-color{
    color: #181b22 !important;
}
</style>