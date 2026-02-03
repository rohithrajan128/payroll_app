<template>
  <div class="main-20">
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title
        class="col-md-4"
        :heading="$t('announcements')"
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
              label="Search"
              class="srch_bar"
              hide-details
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
              :to="{ name: 'announcements_amend' }"
            >
              <v-btn
                color=" btn mr-2 mb-2 hover_shine add_new"
                small
                class="mb-2"
                v-on="on"
                >{{ $t("add_new") }}</v-btn
              >
            </router-link>
          </template>
          <span>{{ $t("add_new") }}</span>
        </v-tooltip>
      </div>
    </div>
    <v-data-table
      :headers="headers"
      :items="announcement_array"
      :search="search"
      :loading="initval"
    >
      <template v-slot:item="props">
        <tr>
          <td>{{ props.item.title }}</td>
          <td>
            <v-tooltip
              bottom
              v-if="props.item.content"
              max-width="370"
              color="white"
            >
              <template v-slot:activator="{ on }">
                <div class="description_hover_div"  v-on="on">
                  {{ convertedannouncement(props.item.content) }}
                </div>
              </template>
              <v-sheet class="pa-4 b" width="50vw" >{{ convertedannouncement(props.item.content) }}</v-sheet>
            </v-tooltip>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <!-- <td>{{ props.item.employee_no_limit }}</td> -->
          <td class="text-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div
                  v-on="on"
                  class="maindivforswitch d-inline-block"
                  @click="updateAnnouncementStatus(props.item.id)"
                >
                  <v-switch
                    v-model="props.item.status"
                    color="success"
                    readonly
                  >
                  </v-switch>
                  <div class="viconinswitchon" v-if="props.item.status == 1">
                    <img
                      src="@/assets/images/correct_switch.png"
                      height="20px"
                    />
                  </div>
                  <div class="viconinswitchoff" v-if="props.item.status == 0">
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

          <td class="text-center px-0">
            <router-link
              :to="{
                name: 'announcements_amend',
                query: { slug: props.item.slug },
              }"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" small class="mr-2 edit_btn icon_size"
                    >mdi-pencil-outline</v-icon
                  >
                </template>
                <span>{{ $t("edit") }}</span>
              </v-tooltip>
            </router-link>
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
    <ConfirmDialog
      :show="showConfirmDialog"
      :cancel="cancel"
      :confirm="confirm"
      :id="delete_id"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('delete_confirmation')"
    />
    <ConfirmDialog
      :show="showStatusDialog"
      :cancel="cancelStatus"
      :confirm="confirmStatus"
        :id="status_id"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('status_change')"
    />
  </div>
</template>
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
export default {
  components: {
    PageTitle,
    ConfirmDialog,
  },
  data: () => ({
    google_icon: {
      icon_name: "campaign",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
    showConfirmDialog: false,
    showStatusDialog: false,
    delete_id: null,
    status_id: null,
    isDisabled: false,
    initval: false,
    announcement_array: [],
    user: "",
  }),
  computed: {
    headers() {
      return [
        {
          text: this.$t("title"),
          align: "left",
          sortable: true,
          value: "title",
              width:"18%"
        },
        {
          text: this.$t("content"),
          value: "content",
          sortable: true,
          width:"20%"
        },
        // {
        //   text: this.$t("document_upload"),
        //   value: "document_upload",
        // },
        {
          text: "Status",
          align: "center",
          value: "status",
        },
        {
          text: "Actions",
          value: "name",
          align: "center",
          sortable: false,
        },
      ];
    },
  
    convertedannouncement: function () {
      var vm = this;
      return function (content) {
          return content.replace(/<[^>]+>/g, '');
      };
   }
  },
  watch: {
    user: {
      immediate: true,
      handler() {
        if(this.user){

          this.fetchAnnouncement();
        }
      },
    },
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
  },
  methods: {
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm(id) {
      this.deleteConfirm(id);
      this.showConfirmDialog = false;
    },
    cancelStatus() {
      this.showStatusDialog = false;
    },
    confirmStatus() {
      this.statusUpdate();
      this.showStatusDialog = false;
    },
    deleteConfirm(id) {
      this.deleteAnnouncement(id);
    },
    updateAnnouncementStatus(id){
       this.status_id = id;
      this.showStatusDialog = true;
    },
    deleteItem($id) {
      this.delete_id = $id;
      this.showConfirmDialog = true;
    },
    fetchAnnouncement() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_all_announcement", {
          params: {
            site_id: this.user.hr_employee.site_id,
            org_id: this.user.hr_employee.org_id,
          },
        })
        .then((res) => {
          this.announcement_array = res.data.announcement_details;
          this.initval = false;
        })
        .catch((err) => {
          this.initval = false;
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
        });
    },
    deleteAnnouncement(id) {
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "delete_announcement/" + id)
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
            this.fetchAnnouncement();
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.initval = false;
          } else {
            this.flashMessage.error({
              message: this.array_data,
            });
          }
        })
        .catch((err) => {
          this.initval = false;
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log("this error" + err);
        });
    },
    // updateEmployeeNumberStatus(id) {
    //   this.status_id = id;
    //   this.showStatusDialog = true;
    // },
    statusUpdate() {
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "update_announcement_status",
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
            this.fetchAnnouncement();
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
            this.fetchAnnouncement();
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
.description_hover_div{
height: 20px !important;
width: 42vw !important;
text-overflow: ellipsis !important;
overflow: hidden !important;
}
</style>