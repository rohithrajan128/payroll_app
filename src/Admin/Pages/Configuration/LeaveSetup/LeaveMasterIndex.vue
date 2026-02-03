<template>
  <div class="main-20">
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title class="col-md-4" :heading="$t('leave_master')" :google_icon="google_icon"></page-title>
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
              :to="{ name: 'leave_master_amend' }"
            >
              <v-btn class="btn hover_shine add_new" small v-on="on">{{ $t("add_new") }}</v-btn>
            </router-link>
          </template>
          <span>{{ $t("add_new") }}</span>
        </v-tooltip>
      </div>
    </div>
    <v-data-table
      :headers="headers"
      :items="leave_array"
      :search="search"
      :loading="initval"
      v-bind:no-data-text="$t('no_data_available')"
      :footer-props="{
          'items-per-page-text': $t('rows_per_page'),
        }"
    >
      <template v-slot:item="props">
        <tr>
          <td>{{ props.item.leave_name }}</td>
          <td v-if="props.item.applicable_gender">{{ props.item.applicable_gender}}</td>
          <td v-else>-</td>
          <td
            v-if="props.item.marital_status_lookup_values"
          >{{ props.item.marital_status_lookup_values.longname }}</td>
          <td v-else>
            <span class="text-center">-</span>
          </td>
             <td
            v-if="props.item.max_consecutive_days"
          >{{ props.item.max_consecutive_days }}</td>
          <td v-else>
            <span class="text-center">-</span>
          </td>
          <td class="text-start">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <!-- <div v-on="on" class="d-inline-block">
                    <v-btn
                      class="hover_shine btn mr-2 mb-2"
                      :disabled="isDisabled"
                      @click="changeStatus(props.item.id)"
                      small
                      v-bind:class="[
                      props.item.status == 1 ? 'success' : 'warning',
                    ]"
                    >
                      <span v-if="props.item.status == 1" class="spanactivesize">{{ $t("active") }}</span>
                      <span v-if="props.item.status == 0" class="spanactivesize">{{ $t("inactive") }}</span>
                    </v-btn>
                </div>-->
                <div
                  v-on="on"
                  class="maindivforswitch d-inline-block"
                  @click="changeStatus(props.item.id)"
                >
                  <v-switch v-model="props.item.status" color="success" readonly></v-switch>
                  <div class="viconinswitchon" v-if="props.item.status == 1">
                    <img src="@/assets/images/correct_switch.png" height="20px" />
                  </div>
                  <div class="viconinswitchoff" v-if="props.item.status == 0">
                    <img src="@/assets/images/delete_switch.png" height="24px" />
                  </div>
                </div>
              </template>
              <span>{{ $t("status") }}</span>
            </v-tooltip>
          </td>
          <td class="text-center px-0">
            <span v-if="props.item.shortname!='LOP'">

              <router-link
              small
              :to="{
                  name: 'leave_master_amend',
                  query: { slug: props.item.slug },
                }"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
            
                  <v-icon small class="mr-2 edit_btn icon_size"   v-on="on">mdi-pencil-outline</v-icon>
                </template>
                <span>{{ $t("edit") }}</span>
              </v-tooltip>
            </router-link>
            </span>
            <span v-else>
              <v-icon small class="mr-2 edit_btn icon_size" disabled  v-on="on">mdi-pencil-outline</v-icon>

            </span>
         
            <!-- <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    class="delete_btn icon_size"
                    v-on="on"
                    small
                    @click="deleteItem(props.item)"
                  >mdi-trash-can-outline</v-icon>
                </template>
                <span>{{ $t("delete") }}</span>
            </v-tooltip>-->
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
      v-bind:title="$t('confirm')"
      v-bind:description="$t('status_change')"
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
    showStatusDialog: false,
    initval: false,
    leave_array: [],
    showConfirmDialog: false,
    delete_id: null,
    status_id: "",
    google_icon: {
      icon_name: "library_books",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined"
    },
    message: ""
  }),
  computed: {
    headers() {
      return [
        {
          text: this.$t("leave_name"),
          value: "leave_name"
        },
        {
          text: this.$t("gender"),
          value: "applicable_gender"
        },
        {
          text: this.$t("martial_status"),
          value: "applicable_marital_status"
        },
        {
          text: this.$t("max_consecutive_days"),
          value: "max_consecutive_days"
        },
        {
          text: this.$t("status"),
          value: "status"
        },

        {
          text: this.$t("action"),
          align: "center",
          value: "class_name"
        }
      ];
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    changeStatus(slug) {
      this.status_id = slug;
      this.showStatusDialog = true;
    },
    cancelStatus() {
      this.showStatusDialog = false;
    },
    confirmStatus() {
      this.statusUpdate();
      this.showStatusDialog = false;
    },
    statusUpdate() {
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "update_leave_status", {
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
            this.initialize();
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class"
            });
            this.initval = false;
          } else {
            this.flashMessage.error({
              message: this.array_data
            });
            this.initval = true;
            this.initialize();
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
    },
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm(id) {
      this.deleteConfirm(id);
      this.showConfirmDialog = false;
    },
    deleteLeave(id) {
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "delete_leave_rules/" + id)
        .then(res => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class"
            });
          } else {
            this.flashMessage.success({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class"
            });
            this.initialize();
          }
        })
        .catch(err => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          console.log("error", err);
        });
    },
    deleteItem(item) {
      this.delete_id = item.id;
      this.showConfirmDialog = true;
    },
    deleteConfirm(id) {
      this.deleteLeave(id);
    },
    initialize() {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetch_all_leave_rules_details"
        )
        .then(res => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.initval = false;
            this.leave_array = res.data.leave_rules_data;
          } else if (res.data.status == "E") {
            this.initval = false;
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class"
            });
          } else {
            this.initval = false;
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class"
            });
            console.log("error message", array_data);
          }
        })
        .catch(err => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          console.log("error", err);
          this.initval = false;
        });
    }
  }
};
</script>
<style scoped>
</style>