<template>
     <div class="card-body">
        <v-list>
          <v-list-group
            v-for="item in items"
            :key="item.name"
            v-model="item.active"
            no-action
            class="p-0 list_group"
            :append-icon="item.children && item.children.length > 0 ? 'mdi-chevron-down' : ''"
          >
            <template v-slot:activator>
              <v-list-item-content p-0 class="p-0">
                <div v-if="selected">
                  <v-checkbox
                    v-if="selectedItem(item)==true"
                    v-model="trueval"
                    class="custom-checkbox mb-0 mt-0"
                    readonly
                    hide-details
                    @click.stop="updateMenuAssignment(false, item)"
                    :label="item.name"
                  ></v-checkbox>
                  <v-checkbox
                    indeterminate
                    v-else-if="selectedItem(item)=='some_selected'"
                    v-model="trueval"
                    class="custom-checkbox mb-0 mt-0"
                    readonly
                    hide-details
                    @click.stop="updateMenuAssignment(false, item)"
                    :label="item.name"
                  ></v-checkbox>
                  <v-checkbox
                    v-else
                    v-model="falseval"
                    hide-details
                    readonly
                    class="mb-0 mt-0"
                    @click.stop="updateMenuAssignment(true, item)"
                    :label="item.name"
                  ></v-checkbox>
                </div>
              </v-list-item-content>
            </template>

            <v-list-item v-for="child in item.children" :key="child.name" class="py-0">
              <v-list-item-content class="py-0">
                <v-checkbox
                  v-if="selected.includes(child.id)"
                  v-model="trueval"
                  readonly
                  hide-details
                  class="mb-0"
                  @click="updateMenuAssignment(false, child)"
                  :label="child.name"
                ></v-checkbox>
                <v-checkbox
                  v-else
                  v-model="falseval"
                  class="mb-0"
                  readonly
                  hide-details
                  @click="updateMenuAssignment(true, child)"
                  :label="child.name"
                ></v-checkbox>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
      </div>
</template>

<script>
export default {
    props:["items","selected", "trueval", "falseval"],
    methods:{
        updateMenuAssignment(value, item) {
            this.$emit('updateMenuAssignment',value, item);
    },
    selectedItem(item) {
      if (item.children.length > 0) {
        const allChildrenSelected = item.children.every(child =>
          this.selected.includes(child.id)
        );
        const noneOfTheItemsPresent = !item.children.some(child =>
          this.selected.includes(child.id)
        );
        if (allChildrenSelected) {
          console.log("all are selected");
          return true;
        } else if (noneOfTheItemsPresent) {
          return false;
        } else {
          return "some_selected";
        }
      } else {
        if (this.selected.includes(item.id)) {
          return true;
        } else {
          return false;
        }
      }
    },
    }
}
</script>
<style scoped>
.checkboxmenuaccess {
  display: flex;
  /* flex: 0 0 auto !important; */
  max-height: 55px !important;
}
.menuaccessitemname {
  margin-top: 16px;
}
.checkbox-value {
  display: flex !important;
  justify-content: flex-start !important;
}
.sibebarvlistmenu .v-list-item__append {
  display: none !important;
}
.v_list_menu_title .v-list-item__content {
  text-align: left !important;
  font-size: 14px !important;
}
.role_list_item {
  height: 20px;
  padding-top: 20px !important;
}
.v_child_list_title .v-list-item-title {
  text-align: left !important;
  font-size: 14px !important;
}
.role_list_child_item {
  padding-top: 20px !important;
  height: 15px !important;
}
.v-label{
  margin: 0px !important;
}
label{
  margin: 0px !important;
}
.list_group /deep/ .v-list-group__header{
width: max-content !important;
}
.list_group /deep/ .v-label{
  margin: 0px;
} 
</style>