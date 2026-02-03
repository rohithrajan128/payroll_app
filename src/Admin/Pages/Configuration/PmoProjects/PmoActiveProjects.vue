<template>
  <div>
    <div class="main-20">
      <!-- <v-app-bar flat color="white">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-text-field
              v-on="on"
              v-model="search"
              append-icon="search"
              v-bind:label="$t('search')"
              single-line
              hide-details
              class="srch_bar"
            ></v-text-field>
          </template>
          <span>{{ $t("search") }}</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <router-link
                  class="text-decoration-none"
                  :to="{
                    name: 'project.amend',
                    query: { hide: 'true' },
                  }"
                  style="color: white"
                >
                  <v-btn
                    color=" btn  mb-2 hover_shine add_new"
                    small
                    class="mt-2"
                    v-on="on"
                  >{{ $t("add_new") }}</v-btn>
                </router-link>
          </template>
          <span>{{ $t("add_new") }}</span>
        </v-tooltip>
      </v-app-bar>-->
      <v-data-table
        :headers="headers"
        :items="active_proj"
        :search="search"
        :loading="initval"
        v-bind:no-data-text="$t('no_data_available')"
        :footer-props="{
          'items-per-page-text': $t('rows_per_page'),
        }"
      >
        <template v-slot:item="props">
          <tr>
            <td>
              <div class="min_width_120">
                <router-link
                v-if="user_role.includes('HR')"
                small
                :to="{
                  name: 'project.amend',
                  query: { slug: props.item.slug, hide: 'true' },
                }"
              
              >
              {{ props.item.project_name }} 
              </router-link>
                <router-link
                v-else
                small
                :to="{
                  name: 'project.amend',
                  query:{ slug: props.item.slug, hide: 'false' , id: props.item.id },
                }"
              >
              {{ props.item.project_name }} 
              </router-link>
                </div>
            </td>
            <td>
              <div class="min_width_120">{{ props.item.manager_details.Full_Code }}</div>
            </td>
            <td>
              <div class="min_width_120 text-capitalize">{{ props.item.client_name }}</div>
            </td>
            <td>{{ props.item.start_date | formatDate}}</td>
            <td>
              <v-tooltip bottom v-if="props.item.description" max-width="370" color="white">
                <template v-slot:activator="{ on }">
                  <div class="description_hover_div" v-on="on" v-html="props.item.description"></div>
                </template>
                <v-sheet v-html="props.item.description" class="pa-4 "></v-sheet>
              </v-tooltip>
              <span v-else>{{ $t("not_appllicable") }}</span>
            </td>
            <td>{{ props.item.resource_allocation_count }}</td>
            <td v-if="user_role.includes('HR')" class="text-center">
              <div class="d-flex justify-space-between align-items-center">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <!-- <div v-on="on" class="d-inline-block min_width">
                      <v-btn
                        v-on="on"
                        :disabled="isDisabled"
                        class="hover_shine"
                        @click="changeStatus(props.item.id)"
                        x-small
                        v-bind:class="[
                          props.item.active_flag == 1 ? 'success' : 'warning',
                        ]"
                      >
                        <span v-if="props.item.active_flag == 1">
                          {{ $t("active") }}
                        </span>
                        <span v-if="props.item.active_flag == 0">
                          {{ $t("inactive") }}
                        </span>
                      </v-btn>
                    </div>-->
                    <div
                      v-if="user_role.includes('HR')" 
                      v-on="on"
                      class="maindivforswitch d-inline-block"
                      @click="changeStatus(props.item.id)"
                    >
                      <v-switch v-model="props.item.active_flag" color="success" readonly></v-switch>
                      <div class="viconinswitchon" v-if="props.item.active_flag == 1">
                        <img src="@/assets/images/correct_switch.png" height="20px" />
                      </div>
                      <div class="viconinswitchoff" v-if="props.item.active_flag == 0">
                        <img src="@/assets/images/delete_switch.png" height="24px" />
                      </div>
                    </div>
                  </template>
                  <span>{{ $t("status") }}</span>
                </v-tooltip>
              </div>
            </td>
            <td v-if="user_role.includes('HR') || user_role.includes('Manager') "  class="text-center px-0">


              <router-link
              v-if="user_role.includes('HR')" 
                small
                :to="{
                  name: 'project.amend',
                  query: { slug: props.item.slug, hide: 'true',from:'amend' },
                }"
              >
                <v-icon class="mr-2 edit_btn icon_size" v-on="on">mdi-pencil-outline</v-icon>
              </router-link>


                  <router-link
                      small
                      :to="{
                      name: 'project.amend',
                      query: { slug: props.item.slug, hide: 'false' , id: props.item.id,from:'amend' },
                    }"
                    >
                  <v-btn x-small class="mr-2 primary hover_shine">
                    {{ $t("resource_allocation") }}
                  </v-btn></router-link>
        


            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
    <ConfirmDialog
      :show="showStatusDialog"
      :cancel="cancelStatus"
      :confirm="confirmStatus"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('status_change')"
    />
  </div>
</template>

<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import VueElementLoading from "vue-element-loading";
import PmoActiveProjects from "./PmoActiveProjects.vue";
import PmoInactiveProjects from "./PmoInactiveProjects.vue";
export default {
  props: ["status", "active_proj", "search","user_role"],
  data: () => ({
   
    isDisabled: false,
    loader: "",
    delete_id: "",
    status_id: "",
    page: null,
    initval: false,
    user_id: null,
    projects_array: [],
    showConfirmDialog: false,
    showStatusDialog: false,
    array_data: [],
    google_icon: {
      icon_name: "Work",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined"
    },
    statusactivechange: "",
   
  }),
  components: {
    PageTitle,
    ConfirmDialog,
    VueElementLoading,
    PmoActiveProjects,
    PmoInactiveProjects
  },

  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.user_id = this.user.emp_id;
  },
  watch: {
    status: {
      immediate: true,
      handler() {
        if (this.status) this.displayprojects();
      }
    }
  },
  computed: {
    headers(){

      if(this.user_role.includes('HR')){
        return [
        {
          text: this.$t("project_name"),
          value: "project_name",
          width: "13%"
        },
        {
          text: this.$t("project_manager"),
          value: "manager_details.Full_Code",
          width: "20%"
        },
        {
          text: this.$t("client"),
          value: "project_name",
          width: "15%"
        },
        {
          text: this.$t("start_date"),
          value: "project_name",
          width: "15%"
        },
        {
          text: this.$t("description"),
          value: "description"
        },
        {
          text: this.$t("active_resources"),
          value: "project_name",
          width: "11%"
        },
        {
          text: this.$t("status"),
          // align: "right",
          value: "active_status",
          width: "6%"
        },
        {
          text: this.$t("action"),
          align: "left",
          value: "class_name",
          width: "20%"
        }
      ]
      }else if(this.user_role.includes('Manager')){
        return [
        {
          text: this.$t("project_name"),
          value: "project_name",
          width: "13%"
        },
        {
          text: this.$t("project_manager"),
          value: "manager_details.Full_Code",
          width: "20%"
        },
        {
          text: this.$t("client"),
          value: "project_name",
          width: "20%"
        },
        {
          text: this.$t("start_date"),
          value: "project_name",
          width: "15%"
        },
        {
          text: this.$t("description"),
          value: "description"
        },
        {
          text: this.$t("active_resources"),
          value: "project_name",
          width: "18%"
        },
        {
          text: this.$t("action"),
          // align: "right",
          value: "active_status",
          width: "6%"
        }
      ]
      }else{
        return [
        {
          text: this.$t("project_name"),
          value: "project_name",
          width: "13%"
        },
        {
          text: this.$t("project_manager"),
          value: "manager_details.Full_Code",
          width: "20%"
        },
        {
          text: this.$t("client"),
          value: "project_name",
          width: "20%"
        },
        {
          text: this.$t("start_date"),
          value: "project_name",
          width: "15%"
        },
        {
          text: this.$t("description"),
          value: "description"
        },
        {
          text: this.$t("active_resources"),
          value: "project_name",
          width: "18%"
        },
      ]

      }
     
      }
    
  },

  methods: {
    cancelStatus() {
      this.showStatusDialog = false;
    },
    confirmStatus() {
      this.statusUpdate();
      this.showStatusDialog = false;
    },
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm(id) {
      this.deleteConfirm(id);
      this.showConfirmDialog = false;
    },
    deleteConfirm(id) {
      this.deleteProject(id);
    },
    deleteItem(menu_id) {
      this.delete_id = menu_id;
      this.showConfirmDialog = true;
    },
    // displayprojects() {
    //   this.loader = true;
    //   axios
    //     .get(process.env.VUE_APP_API_URL_ADMIN + "fetchactiveprojects")
    //     .then((res) => {
    //       this.projects_array = res.data.projects;
    //       this.loader = false;
    //       if (Array.isArray(res.data.message)) {
    //         this.array_data = res.data.message.toString();
    //       } else {
    //         this.array_data = res.data.message;
    //       }
    //       if (res.data.status == "E") {
    //         this.flashMessage.error({
    //           message: this.array_data,
    //           time: 4000,
    //           blockClass: "custom-block-class",
    //         });
    //       }
    //     })
    //     .catch((err) => {
    //       this.flashMessage.error({
    //         message: this.$t("something_went_wrong"),
    //         time: 4000,
    //         blockClass: "custom-block-class",
    //       });
    //       console.log("error", err);
    //     });
    // },

    changeStatus(id) {
      this.status_id = id;
      this.showStatusDialog = true;
    },
    statusUpdate() {
      this.initval = true;
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "update_project_status", {
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
            this.$emit("display_active");
            this.initval = false;
            this.statusactivechange = true;
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
            // this.displayprojects();
          }
          this.initval = false;
        })
        .catch(err => {
          this.initval = false;
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
.v-card--disabled {
  pointer-events: all !important;
}
.project-card {
  /* background: linear-gradient(120deg, #97e29621, #b5b4b200) !important; */
  /* background: #90ee9018; */
  /* background-color: rgb(174, 152, 152) !important; */
  border: 1px solid rgba(64, 132, 188, 0.411);
  /* max-width: 285px; */
}
.project-card .v-list-item {
  padding: 0px;
}

.search_field >>> .v-input__slot {
  max-width: 60% !important;
}
.project_items {
  max-width: 100% !important;
}
.heading {
  font-weight: 700;
}
.manager_text {
  font-weight: 500;
}
.start_date {
  margin-left: 42px;
}
.min_width_120 {
  min-width: 109px;
}
</style>