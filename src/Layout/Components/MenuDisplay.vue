<template>
  <div class="custom-scrollbar">
    <!-- <VuePerfectScrollbar class="scrollbar-container" style="height: 88.5vh"> -->
    <v-list dense nav class="content">
      <template v-for="item in menuItems">
        <template v-if="item.children && item.children.length > 0">
          <v-list-group :key="item.id" no-action v-model="item.openList" @click="redirectParent(item.href, item)">
            <template v-slot:activator>
              <v-list-item-action style="margin-right: 24px; margin-left: 10px">
                <v-icon
                  style="font-size: 18px"
                  v-bind:style="sel_parent == item.id ? 'color:#1976d2 ' : ''"
                  >{{ item.icon }}</v-icon
                >
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title
                  @click="redirectParent(item.href, item)"
                  v-bind:style="sel_parent == item.id ? 'color:#1976d2 ' : ''"
                  >{{ item.title }}</v-list-item-title
                >
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="childItem in item.children"
              :key="childItem.id"
              link
              :to="childItem.href"
              @click="selectMenu(childItem)"
            >
              <v-list-item-content>
                <v-list-item-title
                  v-bind:class="
                    sel_child == childItem.id ? 'highlight-menu' : ''
                  "
                  ><v-icon
                    color="blue"
                    style="font-size: 20px"
                    v-if="sel_child == childItem.id"
                    >mdi-menu-right</v-icon
                  >{{ childItem.name }}</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <template v-else>
          <v-list-item
            :key="item.id"
            link
            :to="item.href"
            @click="selectMenu(item)"
            color="white"
          >
            <v-list-item-action style="margin-right: 24px; margin-left: 10px">
              <v-icon
                v-bind:style="sel_parent == item.id ? 'color:#1976d2 ' : ''"
                style="font-size: 18px"
                >{{ item.icon }}</v-icon
              >
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title
                v-bind:style="sel_parent == item.id ? 'color:#1976d2 ' : ''"
                >{{ item.title }}</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </template>
      </template>
    </v-list>
    <!-- </VuePerfectScrollbar> -->
  </div>
</template>


<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
export default {
  components: {
    VuePerfectScrollbar,
  },
  data() {
    return {
      sel_parent: null,
      sel_child: null,
      sel_index: null,
    };
  },
  props: ["menuItems"],
  watch: {
    menuItems: {
      immediate: true,
      handler() {
        if (this.menuItems.length > 0) {
          var sel_menu = JSON.parse(localStorage.getItem("sel_menu"));
          if (sel_menu.parent_id == 0) {
            this.sel_child = null;
            this.sel_parent = sel_menu.id;
            this.sel_index = this.menuItems.findIndex(
              (item) => item.id === this.sel_parent
            );
            this.menuItems[this.sel_index].openList = true;
          } else {
            this.sel_parent = sel_menu.parent_id;
            this.sel_child = sel_menu.id;
            this.sel_index = this.menuItems.findIndex(
              (item) => item.id === this.sel_parent
            );
            this.menuItems[this.sel_index].openList = true;
          }
        }
      },
    },
  },
  created() {},
  methods: {
    redirectParent(path, menu) {
      if (!path.includes("#")) {
        this.$router.push({
          name: path,
        });
        this.sel_child = null;
        this.sel_parent = menu.id;
        localStorage.setItem("sel_menu", JSON.stringify(menu));
      }
    },
    selectMenu(menu) {
      this.sel_child = null;
      this.sel_parent = null;

      if (menu.parent_id == 0) {
        this.sel_child = null;
        this.sel_parent = menu.id;
      } else {
        this.sel_parent = menu.parent_id;
        this.sel_child = menu.id;
      }
      localStorage.setItem("sel_menu", JSON.stringify(menu));
    },
  },
};
</script>
<style scoped>
.custom-scrollbar {
  position: relative;
  height: 89.5vh;
  overflow-y: hidden;
}

.custom-scrollbar .content {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding-right: 17px;
}

.custom-scrollbar .content:hover::-webkit-scrollbar-track {
  background-color: #e0edf9;
}
.custom-scrollbar .content::-webkit-scrollbar {
  width: 5px;
}

.custom-scrollbar .content::-webkit-scrollbar-thumb {
  background-color: #a7d0fa;
  border-radius: 4px;
}

.custom-scrollbar .content::-webkit-scrollbar-thumb {
  visibility: hidden;
}

.custom-scrollbar .content:hover::-webkit-scrollbar-thumb {
  visibility: visible;
}

.custom-scrollbar .content:hover {
  scrollbar-color: #a7d0fa #e0edf9; /* for Firefox */
}

.custom-scrollbar .content {
  scrollbar-color: transparent transparent; /* for Firefox */
  scrollbar-width: 3px; /* for Firefox */
  scrollbar-color: #a7d0fa #e0edf9; /* for Firefox */
}

</style>
