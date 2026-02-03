<template>
  <div class="main-20">
    
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title
      class="col-md-4"
      :heading="$t('categories')"
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
            :to="{ name: 'categories.amend' }"
          >
            <v-btn
              color=" btn  hover_shine add_new"
              small
              class=""
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
      :items="allcategories"
      :loading="initval"
      :search="search"
    >
      <template v-slot:item="{item, expand, isExpanded} ">
        <tr>
          <td>{{ item.category_name }}</td>
          <td class="text-left">
            <router-link
              :to="{
                name: 'categories.amend',
                 query: {
                  slug: item.slug,
                  pathname: 'categories.amend',
                },
              }"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon class="mr-2 edit_btn icon_size" v-on="on"
                    >mdi-pencil-outline</v-icon
                  >
                </template>
                <span>{{ $t("edit") }}</span>
              </v-tooltip>
            </router-link>

            <v-tooltip bottom v-if="user.hr_employee.rolename == 'SuperUser'">
              <template v-slot:activator="{ on }">
                <v-icon
                  class="mr-2 delete_btn icon_size"
                  v-on="on"
                  small
                  @click="deleteItem(item.id)"
                  >mdi-trash-can-outline</v-icon
                >
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

        <template v-slot:expanded-item="{ item,headers }">
              <td  :colspan="headers.length" class="dropdown-container bg-grey pl-3 py-2">
                <div class="text-secondary px-5 description_item" v-if="item.description">
                  <strong>{{ $t("description") }}:</strong> <br>
                  {{item.description}}
                </div>
                <div class="text-secondary" v-else>
                  <p class="pl-3">{{ $t("no_details_found") }}</p>
                </div>
              </td>
            </template>




    </v-data-table>
    <ConfirmDialog
      :show="showConfirmDialog"
      :cancel="cancel"
      :confirm="confirm"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('delete_confirmation')"
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
    allcategories: [],
    showConfirmDialog: false,
    initval: false,
    delete_id: null,
    status_id: null,
    isDisabled: false,
    headers: [
      {
        text: "Categories",
        align: "left",
        value: "category_name",
        width:'80%'
      },

    
      {
        text: "Actions",
        value: "name",
        align: "left",
        width:'50%'
      },
      {
        text: "",
        value: "",
        align: "left",
        width:'20%'
      },
    ],
    google_icon: {
      icon_name: "category",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
    valid: false,
    message: "",
    showStatusDialog: false,
  }),
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.fetchcategories();
  },
  methods: {
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm() {
      this.deleteConfirm();
      this.showConfirmDialog = false;
    },
    deleteItem(id) {
      this.delete_id = id;
      this.showConfirmDialog = true;
    },
    deleteConfirm() {
      axios
        .delete(
          process.env.VUE_APP_API_URL_ADMIN + "deletecategory/" + this.delete_id
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
            this.fetchcategories();
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

            this.fetchcategories();
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

   
    fetchcategories() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getcategories")
        .then((res) => {
          this.allcategories = res.data.category;        
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
.description_item{
    overflow-wrap: anywhere;
}
</style>