<template>
  <div class="main-20">
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title
        class="col-md-4"
        :heading="$t('level')"
        :google_icon="google_icon"
      ></page-title>

      <div class="col-md-6">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-text-field
              dense
              rounded-pill
              density="compact"
              outlined
              rounded
              small
              v-on="on"
              v-model="search"
              append-icon="search"
              v-bind:label="$t('search')"
              hide-details
              class="srch_bar"
            ></v-text-field>
          </template>
          <span>{{ $t("search") }}</span>
        </v-tooltip>
      </div>

      <div class="col-md-2">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <router-link
              class="text-decoration-none"
              :to="{ name: 'level_amend' }"
            >
              <v-btn
                class="btn mr-2 mb-2 hover_shine add_new"
                small
                v-on="on"
                >{{ $t("add_new") }}</v-btn
              >
            </router-link>
          </template>
          <span>{{ $t("add_new") }}</span>
        </v-tooltip>
      </div>
    </div>
    <!-- <v-spacer></v-spacer> -->
    <!-- 
    {{level_array}}-->
    <v-data-table
      :headers="headers"
      :items="level_array"
      :search="search"
      :loading="initval"
      v-bind:no-data-text="$t('no_data_available')"
      :footer-props="{
          'items-per-page-text': $t('rows_per_page'),
        }"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      item-key="id"
      show-expand
    >
      <template v-slot:item="{ item, expand, isExpanded }">
        <tr>
          <td></td>
          <td>{{ item.level }}</td>
<td>{{ item.level_description }}</td>
<td class="">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
             

                <div
                  v-on="on"
                  class="maindivforswitch d-inline-block"
                  @click="updateAnnouncementStatus(item.id)"
                >
                  <v-switch
                    v-model="item.status"
                    color="success"
                    readonly
                  >
                  </v-switch>
                  <div class="viconinswitchon" v-if="item.status == 1">
                    <img
                      src="@/assets/images/correct_switch.png"
                      height="20px"
                    />
                  </div>
                  <div class="viconinswitchoff" v-if="item.status == 0">
                    <img
                      src="@/assets/images/delete_switch.png"
                      height="24px"
                    />
                  </div>
                </div>
              </template>
              <span>{{ $t("status") }}</span>
            </v-tooltip>
          </td>
          <td class=" px-0 text-center">
            <router-link
                small
                :to="{
                  name: 'level_amend',
                  query: { slug: item.slug },
                }"
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon small class="mr-2 edit_btn icon_size" v-on="on"
                      >mdi-pencil-outline</v-icon
                    >
                  </template>
                  <span>{{ $t("edit") }}</span>
                </v-tooltip>
              </router-link>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  v-on="on"
                  class="delete_btn icon_size"
                  @click="deleteItem(item)"
                >mdi-trash-can-outline</v-icon>
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

      <!-- <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="dropdown-container bg-grey pl-3 py-2">
          <div class="text-secondary px-5 description_item" v-if="item.designation_array">
            <tr v-for="designation_item in item.designation_array">
             <td>
              {{ designation_item.designation }}

             </td>
            </tr>
          </div>
          <div class="text-secondary" v-else>
            <p class="pl-3">{{ $t("no_details_found") }}</p>
          </div>
        </td>
      </template> -->

      <template v-slot:expanded-item="{ headers, item }">
          <tr class="child_row">
          <td :colspan="headers.length" class="childtd p-0">
            <v-simple-table class="simpletableformetricdisplay">
              <template v-slot:default>
                <thead v-if="item.designation_array.length>0">
                  <tr class="child_row">
                    <th class="text-left">
                    
                      <b class="simpledatatableheader font-weight-bold">{{
                        $t("designation_name")
                      }}</b>
                      
                    </th>
                  </tr>
                </thead>
                <tbody v-if="item.designation_array.length>0">
                  <tr class="child_row"
                    v-for="(details, index) in item.designation_array"
                    :key="index"
                  >
                    <td>{{ details.designation }}</td>
                  </tr>
                </tbody>
                <tbody class="child_row" v-else>
                    <td colspan="3"><div class="text-secondary text-center" >
                    <p class="pl-3 ">{{ $t("no_details_found") }}</p>
                  </div></td>
                    
                  </tbody>

              </template>
            </v-simple-table>
          </td>
        </tr>
        </template>











   
    </v-data-table>


    <ConfirmDialog
      :show="showStatusDialog"
      :cancel="cancelStatus"
      :confirm="confirmStatus"
        :id="status_id"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('status_change')"
    />
   

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
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
export default {
  components: { PageTitle, ConfirmDialog },
  data: () => ({
    search: "",
    // dialog: false,
    expanded: [],
    initval: false,
    level_array: [],
    showConfirmDialog: false,
    delete_id: null,
    singleExpand: false,
    status_id:"",
showStatusDialog:false,
    user: "",
    google_icon: {
      icon_name: "library_books",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    message: "",
  }),

  computed: {
    headers() {
      return [
        {
          text: this.$t("level"),
          value: "level_id",
        },
        {
          text: this.$t("level_description"),
          value: "level_description",
        },
        {
          text: this.$t("status"),
          value: "status",
        },
        // {
        //   text: this.$t("week_end"),
        //   value: "work_week_end",
        // },

        {
          text: this.$t("action"),
          align: "center",
          value: "class_name",
        },
        {
          text: "",
        },
      ];
    },
  },

  created() {
    this.user = JSON.parse(localStorage.getItem("user"));

    this.initialize();
  },
  methods: {
      cancelStatus() {
      this.showStatusDialog = false;
    },
    confirmStatus() {
      this.statusUpdate();
      this.showStatusDialog = false;
    },
    statusUpdate() {
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "update_level_status",
          {
            id: this.status_id,
          }
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
            this.initialize();
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
            this.initialize();
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
    updateAnnouncementStatus(id){
       this.status_id = id;
      this.showStatusDialog = true;
    },
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm(id) {
      this.deleteConfirm(id);
      this.showConfirmDialog = false;
    },
    deleteLevel(id) {
      axios
        .delete(process.env.VUE_APP_API_URL_ADMIN + "level/" + id)
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
          } else {
            this.flashMessage.success({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.initialize();
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log("error", err);
        });
    },

    initialize() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "level", {
          params: {
            site_id: this.user.hr_employee.site_id,
            org_id: this.user.hr_employee.org_id,
          },
        })
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.initval = false;
            this.level_array = res.data.level_details;
          } else if (res.data.status == "E") {
            this.initval = false;
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
          } else {
            this.initval = false;
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
            console.log("error message", array_data);
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log("error", err);
          this.initval = false;
        });
    },

    deleteItem(item) {
      console.log("item data will ", item);
      this.delete_id = item.id;
      this.showConfirmDialog = true;
    },
    deleteConfirm(id) {
      this.deleteLevel(id);
    },
  },
};
</script>
<style scoped>
.description_item {
  overflow-wrap: anywhere;
}
.childtd{
  border:1px solid #8080808a !important
}
.child_row{
  background:#eeeeee61 !important;
}
.parent_row{
  /* background:#eeeeee !important; */

}
#parent_row{
  /* background:#eeeeee !important; */

}
.simpledatatableheader{
  font-size: 14px;
}
</style>