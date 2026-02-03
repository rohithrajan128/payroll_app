<template>
  <v-app>
    <div class="main-20">
      <div flat color="white" class="row py-5 pl-5 align-items-center">
        <page-title class="col-md-4" :heading="$t('users')" :google_icon="google_icon"></page-title>
        <div class="col-md-6">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-text-field dense density="compact" v-on="on" outlined v-model="search" append-icon="search"
                label="Search" class="srch_bar" rounded small hide-details rounded-pill></v-text-field>

            </template>
            <span>{{ $t("search") }}</span>
          </v-tooltip>

        </div>
        <!-- <v-spacer></v-spacer> -->
        <div class="col-md-2">

          <router-link class="text-decoration-none" :to="{ name: 'employee_creation' }" style="color: white">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn color=" btn  hover_shine add_new" small class="" v-on="on">{{ $t("add_new") }}</v-btn>
              </template>
              <span>{{ $t("add_new") }}</span>
            </v-tooltip>
          </router-link>
        </div>
      </div>
      <v-data-table :headers="headers" :items="allUsers" :loading="initval" :search="search">
        <template v-slot:item="props">
          <tr v-bind:class="[
              props.item.empno == null ? 'back_color' : '',
            ]">
            <td>
              <router-link v-if="props.item.empno != null" class="text-decoration-none" style="color: white" :to="{
                  name: 'users.view',
                  query: {
                    slug: props.item.slug,
                    view: 'userview'
                  },
                }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-chip v-on="on" color="success" small outlined medium class="userindexcodechip">{{ props.item.empno
                    }}</v-chip>
                  </template>
                  <span>{{ $t("view") }}</span>
                </v-tooltip>
              </router-link>
              <span v-else>

                <v-chip  color="primary" small outlined medium class="userindexcodechip px-2">
               <span @click="routereditusers(props.item.slug, props.item.empno,props.item.emprole_name.includes('SuperUser'))">

                {{ $t("draft") }}
                </span>   
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon v-if="!props.item.emprole_name.includes('SuperUser')" class="delete_btn delete_icon_size"
                        v-on="on" small @click="deleteItem(props.item.id)">mdi-trash-can-outline</v-icon>
                    </template>
                    <span>{{ $t("delete") }}</span>
                  </v-tooltip>
                </v-chip>
              </span>
            </td>
            <td class="usernamehoverstyle">   
              <div class="widget-content p-0">
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
                          <div class="widget-heading">{{ props.item.firstname }} {{ props.item.lastname }}</div>
                          <div class="widget-subheading opacity-7" v-if="props.item.designation.designation">{{props.item.designation.designation}}</div>
                        </div>
                      </div>
                    </div>  
                   </td>
            <!-- <td>{{ props.item.rolename }}</td> -->
            <td v-if="props.item.emprole_name.includes('SuperUser')">
              <v-chip small color="primary" outlined>SuperUser</v-chip>
            </td>
            <td v-else>
              <span v-if="props.item.employee_roles.length >= 1">
                <v-chip color="primary" outlined small v-for="(role, index) in props.item.employee_roles" :key="index"
                  class="mr-1 my-1">{{ role.role_details.rolename }}</v-chip>
              </span>
              <span v-else>{{ $t("not_appllicable") }}</span>
            </td>
            <td v-if="props.item.user_org == null">{{ $t("not_appllicable") }}</td>
            <td v-else>{{ props.item.user_org.shortname }}</td>
            <!-- <td class="param-value">{{ props.item.mobile }}</td> -->
            <td v-if="props.item.userdetails">{{ props.item.userdetails.email }}</td>
            <td v-else>{{ $t("not_appllicable") }}</td>
            <td class="text-center">
              <span v-if="props.item.Joining_date" class="mr-4">{{ props.item.Joining_date | formatdateMonthyear }}</span>
              <span v-else>{{ $t("not_appllicable") }}</span>
            </td>
          </tr>
        </template>
      </v-data-table>
      <ConfirmDialog :show="showStatusDialog" :cancel="cancelStatus" :confirm="confirmStatus" v-bind:title="$t('confirm')"
        v-bind:description="$t('status_change')" />
      <ConfirmDialog :show="showConfirmDialog" :cancel="cancel" :confirm="confirm" :id="delete_id"
        v-bind:title="$t('confirm')" v-bind:description="$t('delete_confirmation')" />
    </div>
  </v-app>
</template>

<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
export default {
  components: {
    PageTitle,
    ConfirmDialog
  },
  data: () => ({
    allUsers: [],
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    initval: false,
    status_id: null,
    isDisabled: false,
    showConfirmDialog: false,
    delete_id: "",
    headers: [
      {
        text: "Employee No",
        align: "left",
        value: "empno"
      },
      {
        text: "Name",
        align: "left",
        value: "firstname"
      },
      {
        text: "Role",
        sortable: false,
        value: "employee_roles"
      },
      {
        text: "Organisation",
        value: "user_org.shortname"
      },
      // {
      //   text: "Mobile",
      //   value: "mobile",
      // },
      {
        text: "Email",
        value: "userdetails.email"
      },
      {
        text: "Joining Date",
        value: "Joining_date",
        align: "center"
      }
      // {
      //   text: "Actions",
      //   value: "name",
      //   align: "center",
      // },
    ],
    google_icon: {
      icon_name: "group",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined"
    },
    search: "",
    valid_error: false,
    valid_success: false,
    successmessage: "",
    valid: false,
    message: "",
    user: "",
    showStatusDialog: false
  }),
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.fetchUsers();
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
            this.fetchUsers();
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
            this.fetchUsers();
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
    cancelStatus() {
      this.showStatusDialog = false;
    },
    confirmStatus() {
      this.statusUpdate();
      this.showStatusDialog = false;
    },
    fetchUsers() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchuser")
        .then(res => {
          this.allUsers = res.data.usersdata;
          this.initval = false;
        })
        .catch(err => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          console.log(" error" + err);
        });
    },
    changeStatus(id) {
      this.status_id = id;
      this.showStatusDialog = true;
    },
    routereditusers(slug, empno,role) {
      if(role){
return
      }
      if (empno != null) {
        this.$router.push({
          name: "users.view",
          query: {
            slug: slug,
            view: "userview"
          }
        });
      } else {
        this.$router.push({
          name: "employee_creation",
          query: {
            slug: slug,
            pathname: "userview"
          }
        });
      }
    },

    statusUpdate() {
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "updateuserstatus", {
          id: this.status_id
        })
        .then(res => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.flashMessage.success({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class"
            });
            this.initval = true;
            this.fetchUsers();
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class"
            });
          } else {
            this.flashMessage.error({
              message: this.array_data
            });
            this.initval = true;
            this.fetchUsers();
          }
        })
        .catch(err => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          console.log("this error" + err);
        });
    }
  }
};
</script>
<style scoped>
/* .v-text-field /deep/ .v-input__slot {
  min-height: 38px !important;
  width: 353px;
} */

.param-value {
  max-width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.userindexcodechip:hover {
  cursor: pointer;
}

.usernamehoverstyle:hover {
  /* cursor: pointer; */
  font-weight: 500;
}

.usernamehoverstyle {
  font-weight: 500;
  color: rgb(71, 174, 110);
  max-width: 250px;
}

.delete_icon_size {
  font-size: 20px !important;
}
</style>