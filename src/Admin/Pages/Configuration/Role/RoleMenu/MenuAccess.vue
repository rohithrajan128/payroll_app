<template>
  <div class="main-card mb-3 card">
    <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
    <div class="card-hover-shadow">
      <div class="card-header">
        <i class="add-icon lnr-add icon-gradient bg-happy-itmeo"></i>
        {{ $t("assign_menu_accessto") }}
        <b class="role_text_color">{{ $route.query.name }}</b>
        &nbsp;{{ $t("role") }}
      </div>
<MenuTreeView @updateMenuAssignment="updateMenuAssignment" :items="items" :selected="selected" :trueval="trueval" :falseval="falseval"></MenuTreeView>

      <div class="d-block text-right card-footer">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              small
              @click="$router.go(-1)"
              class="ma-1 font-weight-bold cancel-btn"
              color="dark cancel_button"
            >{{ $t("cancel") }}</v-btn>
          </template>
          <span>{{ $t("cancel") }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" small @click="save()" :disabled="isDisabled" class="mr-2 success">
              {{ $t("submit") }}
              <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
            </v-btn>
          </template>
          <span>{{ $t("submit") }}</span>
        </v-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
import MenuTreeView from "../../Components/MenuTreeView.vue"
export default {
  components: { VueElementLoading,MenuTreeView },
  data: () => ({
    selected: [],
    items: [],
    message: "",
    isBtnLoading: false,
    isDisabled: false,
    loader: false,
    trueval: true,
    falseval: false
  }),
  mounted() {},
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          axios
            .get(process.env.VUE_APP_API_URL_ADMIN + "rolemenu")
            .then(res => {
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "S") {
                this.items = res.data.menu;
                this.selectedmenus(this.$route.query.id);
              } else if (res.data.status == "E") {
                this.flashMessage.error({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class"
                });
              } else {
                this.flashMessage.error({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class"
                });
              }
            })
            .catch(err => {
              this.loader = false;
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class"
              });
              console.log("this error" + err);
            });
        }
      }
    }
  },
  methods: {
    updateMenuAssignment(value, item) {
      if (value === true) {
        console.log(item);
        if (item.children.length == 0) {
          this.selected.push(item.id);
          console.log(this.selected);
        } else {
          this.selected.push(item.id);
          item.children.forEach(child => {
            this.selected.push(child.id);
          });
        }
      } else {
        if (item.children.length == 0) {
          this.selected = this.selected.filter(menu => menu != item.id);
        } else {
          this.selected = this.selected.filter(menu => menu != item.id);
          item.children.forEach(child => {
            this.selected = this.selected.filter(menu => menu != child.id);
          });
          console.log("2", this.selected);
        }
      }
    },
    selectedmenus(roleid) {
      this.loader = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getmenuaccess/" + roleid)
        .then(res => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            console.log(res.data.selected_menu);
            // this.selected = res.data.selected_menu;
            this.selected = JSON.parse(JSON.stringify(res.data.selected_menu));
            this.selected1 = res.data.selected_menu;
            console.log("seleced values");
            console.log(this.selected);
            this.loader = false;
          } else if (res.data.status == "E") {
            this.loader = false;
            console.log("error_message", this.array_data);
          } else {
            this.loader = false;
            console.log("error_message", this.array_data);
          }
        })
        .catch(err => {
          this.loader = false;
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          console.log("this error" + err);
        });
    },
    save() {
      this.isDisabled = true;
      this.isBtnLoading = true;
      this.loader = true;
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "storemenuaccess", {
          role_id: this.$route.query.id,
          role_access: this.selected
        })
        .then(res => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          this.loader = false;
          if (res.data.status == "S") {
            this.flashMessage.success({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class"
            });
            this.message = res.data.message;
            this.$router.push({
              name: "roles"
            });
            this.$eventBus.$emit("updated_menus");
          } else if (res.data.status == "E") {
            this.isBtnLoading = false;
            this.isDisabled = false;
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class"
            });
          } else {
            this.isBtnLoading = false;
            this.flashMessage.error({
              message: this.array_data
            });
          }
        })
        .catch(err => {
          this.isBtnLoading = false;
          this.isDisabled = false;
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class"
          });
          console.log("error", err);
        });
    }
  }
};
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
