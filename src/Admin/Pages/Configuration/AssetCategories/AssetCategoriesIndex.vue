<template>
  <div class="main-20">
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title class="col-md-4" :heading="$t('asset_categories')" :google_icon="google_icon"></page-title>
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
              :to="{ name: 'assetcategories_amend' }"
            >
              <v-btn color=" btn  hover_shine add_new" small class v-on="on">
                {{
                $t("add_new")
                }}
              </v-btn>
            </router-link>
          </template>
          <span>{{ $t("add_new") }}</span>
        </v-tooltip>
      </div>
    </div>
    <v-data-table
      :headers="headers"
      :items="asset_categories"
      :search="search"
      :loading="initval"
      :single-expand="singleExpand"
      item-key="id"
    >
      <template v-slot:item="{ item, expand, isExpanded }">
        <tr>
          <td>{{ item.short_name }}</td>
          <td class="param-value">{{ item.asset_status_fetch.shortname }}</td>
          <td class="param-value">
            <span v-if="item.asset_tag_id != null">{{ item.asset_tag_id }}</span>
            <span v-else>{{ $t('not_appllicable') }}</span>
          </td>
          <td class="param-value">
            <span v-if="item.alert_value != null">{{ item.alert_value }}</span>
            <span v-else>{{ $t('not_appllicable') }}</span>
          </td>
          <td class="param-value">
            <span v-if="item.parent_id != 0">{{ item.get_parent_id.short_name }}</span>
            <span v-else></span>
          </td>
          <td class="text-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                    <div v-on="on" class="maindivforswitch d-inline-block" @click="updateCategoriesStatus(item.id)">
                  <v-switch v-model="item.active" color="success" readonly>
                  </v-switch>
                  <div class="viconinswitchon" v-if="item.active == 1">
                    <img src="@/assets/images/correct_switch.png" height="20px">
                  </div>
                  <div class="viconinswitchoff" v-if="item.active == 0">
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
              name: 'assetcategories_amend',
              query: 
              { slug: item.slug,
                assetType: item.asset_status_fetch.shortname           
              },
            }"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" small class="mr-2 edit_btn icon_size">mdi-pencil-outline</v-icon>
                </template>
                <span>{{ $t("edit") }}</span>
              </v-tooltip>
            </router-link>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  class="delete_btn icon_size"
                  v-on="on"
                  dense
                  @click="deleteItem(item.id)"
                >mdi-trash-can-outline</v-icon>
              </template>
              <span>{{ $t("delete") }}</span>
            </v-tooltip>
          </td>
          <td v-if="item.parent_id > 0" @click="expand(!isExpanded)">
            <v-tooltip bottom >
              <template v-slot:activator="{ on }">
                <v-btn icon v-if="isExpanded == false" v-on="on">
                  <v-icon>mdi-arrow-down-drop-circle-outline</v-icon>
                </v-btn>
                <v-btn icon v-else>
                  <v-icon>mdi-arrow-up-drop-circle-outline</v-icon>
                </v-btn>
              </template>
              <span>{{ $t("add_details") }}</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <tr>
          <td :colspan="headers.length" class="p-0">
            <v-simple-table class="simpletableformetricdisplay">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      <b class="simpledatatableheader">{{ $t("metric") }}</b>
                    </th>
                    <th class="text-left">
                      <b class="simpledatatableheader">{{ $t("metric_value") }}</b>
                    </th>
                    <th class="text-left">
                      <b class="simpledatatableheader">{{ $t("serialised_item") }}</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <b
                        class="simpledatatablebody"
                        v-if="item.parent_metric"
                      >{{ item.metric_fetch.short_name }}</b>
                      <b class="simpledatatablebody" v-else>{{ $t('not_appllicable') }}</b>
                    </td>
                    <td>
                      <b class="simpledatatablebody" v-if="item.child_metric != null">
                        {{
                        item.metric_value_fetch.metric_value
                        }}
                      </b>
                      <b class="simpledatatablebody" v-else>{{ $t('not_appllicable') }}</b>
                    </td>
                    <td>
                      <b class="simpledatatablebody" v-if="item.serialised_item != null">
                        {{
                        item.serialised_item_fetch.shortname
                        }}
                      </b>
                      <b class="simpledatatablebody" v-else>{{ $t('not_appllicable') }}</b>
                    </td>
                  </tr>
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
      v-bind:title="$t('confirm')"
      v-bind:description="$t('status_change')"
    />
    <ConfirmDialog
      :show="showConfirmDialog"
      :cancel="canceldelete"
      :confirm="confirmDelete"
      :id="delete_id"
      :primary_delete="delete_primary"
      v-bind:title="$t('confirm')"
      v-bind:description="delete_description"
    />
  
   
  </div>
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
    asset_categories: [],
    showConfirmDialog: false,
    showStatusDialog: false,
    status_id: null,
    isDisabled: false,
    initval: false,
    delete_id: "",
    singleExpand: false,
    google_icon: {
      icon_name: "analytics",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined"
    },
    delete_description:"",
    delete_primary:"",
    search: "",
    valid_error: false,
    valid_success: false,
    successmessage: "",
    valid: false,
    message: "",
    alert_dialog:false
  }),
  mounted() {
    this.fetchAssetCategories();
  },
  computed: {
    headers() {
      return [
        {
        text: this.$t('Category'),
        align: "left",
        sortable: false,
        value: "short_name"
      },
      {
        text: this.$t('asset_type'),
        value: "asset_status_fetch.shortname"
      },
      {
        text: this.$t('asset_tag_id'),
        align: "left",
        value: "asset_tag_id"
      },
      {
        text:this.$t('alert_value'),
        align: "left",
        value: "alert_value"
      },
      {
        text: this.$t('parent'),
        align: "left",
        value: "get_parent_id.short_name"
      },
      {
        text: this.$t('status'),
        align: "center",
        value: ""
      },

      {
        text: this.$t('actions'),
        value: "name",
        align: "center",
        sortable: false
      },
      {
        text: "",
        align: "center",
        sortable: false
      }
      ];
    }
  },
  methods: {
    deleteItem(id) {
      let check_parent=this.asset_categories.find(ele=>ele.parent_id==id);
     if(check_parent){
      this.delete_description=this.$t('cannot_delete_items_with_child_elements')
      this.delete_primary='Primary'
      this.showConfirmDialog=true;
      return;
     }

     this.delete_description=this.$t('delete_confirmation')
      this.showConfirmDialog = true;
      this.delete_id = id;
    },
    cancelStatus() {
      this.showStatusDialog = false;
    },
    canceldelete() {
      this.delete_primary=''
      this.showConfirmDialog = false;
    },
    confirmStatus() {
      this.statusUpdate();
      this.showStatusDialog = false;
    },
    fetchAssetCategories() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getallassetcategories")
        .then(res => {
          this.asset_categories = res.data.data;
          var parent=res.data.parent_names;
          var child=res.data.child_items;
          // parent.map((ele,i)=>{
    
          //   parent.splice(i+1, 0, child.filter(item=>item.parent_id==ele.id));
          // })
          for (var i = parent.length - 1; i >= 0; i--) {
  var parentId = parent[i].id;
  var childrenToInsert = child.filter(item => item.parent_id === parentId);

  // Insert children after the current parent element
  if (childrenToInsert.length > 0) {
    parent.splice(i + 1, 0, ...childrenToInsert);
  }
}
this.asset_categories=parent;
          this.initval = false;
        })
        .catch(err => {
          this.initval = false;
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          console.log(" error" + err);
        });
    },
    confirmDelete() {
      this.initval = true;
      this.showConfirmDialog = false;
      axios
        .delete(
          process.env.VUE_APP_API_URL_ADMIN +
            "deleteassetcategories/" +
            this.delete_id
        )
        .then(res => {
          if (res.data.status == "S") {
            this.initval = false;
            this.fetchAssetCategories();
            this.flashMessage.success({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class"
            });
          }
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
    updateCategoriesStatus(id) {
      this.status_id = id;
      this.showStatusDialog = true;
    },
    statusUpdate() {
      this.initval = true;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "updateassetcategoriesstatus",
          {
            id: this.status_id
          }
        )
        .then(res => {
          if (res.data.status == "S") {
            this.initval = false;
            this.flashMessage.success({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class"
            });
            this.fetchAssetCategories();
          } else {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class"
            });
            this.initval = false;
          }
        })
        .catch(err => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          this.initval = false;
          console.log("this error" + err);
        });
    }
  }
};
</script>
<style scoped>
.simpledatatablebody {
  font-size: 11px;
  font-weight: 500;
}

.simpledatatableheader {
  font-weight: bolder;
  font-size: 11px;
}

.simpletableformetricdisplay /deep/ .v-data-table__wrapper {
  background-color: rgb(245, 245, 245);
}
</style>