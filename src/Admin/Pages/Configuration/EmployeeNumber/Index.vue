<template>
  <div class="main-20">
    
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title
      class="col-md-4"
      :heading="$t('employee_number')"
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
            :to="{ name: 'employee_number_amend' }"
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
      :items="employee_number_array"
      :search="search"
      :loading="initval"
    >
      <template v-slot:item="props">
        <tr>
          <td>{{ props.item.employee_type }}</td>
          <td class="param-value">{{ props.item.employee_auto_gen_name }}</td>
          <td>{{ props.item.employee_no_limit }}</td>
          <td class="text-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <!-- <div v-on="on" class="d-inline-block min_width">
                  <v-btn
                    x-small
                    v-on="on"
                    :disabled="isDisabled"
                    class="hover_shine"
                    @click="updateEmployeeNumberStatus(props.item.id)"
                    small
                    v-bind:class="[
                      props.item.status == 1 ? 'success' : 'warning',
                    ]"
                  >
                    <span v-if="props.item.status == 1" class="spanactivesize">
                      {{ $t("active") }}
                    </span>
                    <span v-if="props.item.status == 0" class="spanactivesize">
                      {{ $t("inactive") }}
                    </span>
                  </v-btn>
                </div> -->

                <div v-on="on" class="maindivforswitch d-inline-block" @click="updateEmployeeNumberStatus(props.item.id)">
                  <v-switch v-model="props.item.status" color="success" readonly>
                  </v-switch>
                  <div class="viconinswitchon" v-if="props.item.status == 1">
                    <img src="@/assets/images/correct_switch.png" height="20px">
                  </div>
                  <div class="viconinswitchoff" v-if="props.item.status == 0">
                    <img src="@/assets/images/delete_switch.png" height="24px">
                  </div>
                </div>
                
              </template>
              <span>{{ $t("status") }}</span>
            </v-tooltip>
          </td>

          <td class="text-center px-0">
            <router-link
              :to="{
                name: 'employee_number_amend',
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
      icon_name: "settings_suggest",
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
    employee_number_array: [],
  }),
  computed: {
    headers() {
      return [
        {
          text: this.$t("employee_type"),
          align: "left",
          sortable: false,
          value: "employee_type",
        },
        {
          text: this.$t("auto_gen_name"),
          value: "employee_auto_gen_name",
        },
        {
          text: this.$t("number_limit"),
          value: "employee_no_limit",
        },
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
  },
  mounted() {
    this.fetchEmployeeNumber();
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
      this.deleteEmployeeNumber(id);
    },
    deleteItem($id) {
      this.delete_id = $id;
      this.showConfirmDialog = true;
    },
    fetchEmployeeNumber() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_emp_no_details")
        .then((res) => {
          this.employee_number_array = res.data.all_employee_number_details;
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
    deleteEmployeeNumber(id) {
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "delete_emp_no/" + id)
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
            this.fetchEmployeeNumber();
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
    updateEmployeeNumberStatus(id) {
      this.status_id = id;
      this.showStatusDialog = true;
    },
    statusUpdate() {
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "update_employee_number_status",
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
            this.fetchEmployeeNumber();
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
            this.fetchEmployeeNumber();
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
</style>