<template>
  <div class="container-fluid mt-3 p-0">
    <div class="mb-3 mx-auto">
      <div class="card-header">
        <div class="card-header-tab">
          <div class="card-header-title font-size-lg text-capitalize titlewrap">
            {{ $t("create_section") }}
          </div>
        </div>
      </div>
      <div class="card-body">
        <VueElementLoading
          :active="loader"
          spinner="bar-fade-scale"
          color="var(--primary)"
        />
        <v-form ref="formhead" v-model="valid">
          <div class="row">
            <div class="col-md-12 pb-0">
              <v-layout>
                <v-flex md4 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-select
                        dense
                        outlined
                        v-bind:label="$t('parent_menu')"
                        v-model="section_head.parent_menu"
                        :readonly="
                          sectionarray.length > 0 && !$route.query.section
                        "
                        v-on="on"
                        required
                        class="required_field"
                        :rules="fieldRules"
                        item-value="id"
                        item-text="shortname"
                        :items="parentMenuArray"
                      ></v-select>
                    </template>
                    <span>{{ $t("parent_menu") }}</span>
                  </v-tooltip>
                </v-flex>
                <v-flex md8 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-textarea
                        v-bind:label="$t('description')"
                        rows="2"
                        v-on="on"
                        class="required_field"
                        :readonly="
                          sectionarray.length > 0 && !$route.query.section
                        "
                        :rules="fieldRules"
                        v-model="section_head.description"
                        outlined
                        dense
                      >
                      </v-textarea>
                    </template>
                    <span>{{ $t("description") }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
            </div>
          </div>
          <v-row class="mb-4">
            <div v-if="sectionarray.length > 0">
              <h6 class="pl-6 mb-5">
                <b>{{ $t("list_of_section") }}</b>
              </h6>
            </div>
            <v-spacer></v-spacer>
            <v-tooltip bottom v-if="!$route.query.section">
              <template v-slot:activator="{ on }">
                <v-btn
                  small
                  v-on="on"
                  @click="addnewsection"
                  color="primary"
                  class="mr-2"
                  >{{ $t("add_section") }}</v-btn
                >
              </template>
              <span>{{ $t("add_section") }}</span>
            </v-tooltip>
          </v-row>
          <div v-for="(section, index) in sectionarray" :key="index">
            <v-layout class="px-2">
              <v-flex md43 pl-2>
                <v-select
                  v-model="section.section"
                  dense
                  v-bind:label="$t('section_order')"
                  outlined
                  item-value="shortname"
                  item-text="longname"
                  :items="sectionOrderArray"
                  class="required_field"
                  :rules="fieldRules"
                >
                </v-select>
              </v-flex>
              <v-flex md5 pl-2>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-bind:label="$t('section_name')"
                      v-on="on"
                      class="required_field"
                      v-model="section.section_name"
                      outlined
                      dense
                      :rules="fieldRules"
                    >
                    </v-text-field>
                  </template>
                  <span>{{ $t("section_name") }}</span>
                </v-tooltip>
              </v-flex>
              <v-flex md3 pl-2>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-autocomplete
                      multiple
                      required
                      chips
                      small-chips
                      primary
                      v-on="on"
                      v-model="section.visible_to"
                      :rules="fieldRulesArray"
                      :items="RoleArray"
                      item-text="rolename"
                      item-value="id"
                      dense
                      v-bind:label="$t('visible_to')"
                      outlined
                      class="required_field"
                    >
                      <template v-slot:selection="{ item }">
                        <v-chip outlined class="py-2" color="primary" small>
                          <span>{{ item.rolename }}</span>
                        </v-chip>
                      </template>
                    </v-autocomplete>
                  </template>
                  <span>{{ $t("visible_to") }}</span>
                </v-tooltip>
              </v-flex>
              <v-flex md1 pl-2 pr-2 pt-1 v-if="!$route.query.section">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      class="text-white rounded-pill iconflexaddremove mr-3 ml-1"
                      medium
                      @click="minimizerowindex(index)"
                      v-on="on"
                    >
                      mdi-minus</v-icon
                    >
                  </template>
                  <span>{{ $t("remove") }}</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      class="text-white rounded-pill iconflexaddremove"
                      medium
                      @click="addrowindex(index)"
                      v-if="index + 1 == sectionarray.length"
                      v-on="on"
                    >
                      mdi-plus</v-icon
                    >
                  </template>
                  <span>{{ $t("add") }}</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </div>
        </v-form>
        <div class="d-block text-right mr-4">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div v-on="on" class="d-inline-block mr-2">
                <v-btn
                  v-on="on"
                  small
                  @click="$router.go(-1)"
                  class="ma-1 font-weight-bold cancel-btn"
                  color="btn hover_shine cancel_button"
                  >{{ $t("cancel") }}</v-btn
                >
              </div>
            </template>
            <span>{{ $t("cancel") }}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="sectionarray.length >= 1">
            <template v-slot:activator="{ on }">
              <div v-on="on" class="d-inline-block">
                <v-btn
                  :disabled="isDisabled"
                  color="green darken-1"
                  @click="savesection"
                  small
                  class="mr-2 success hover_shine"
                >
                  {{ $t("save") }}
                  <b-spinner
                    :disabled="isBtnLoading"
                    small
                    v-if="isBtnLoading"
                  ></b-spinner>
                </v-btn>
              </div>
            </template>
            <span>{{ $t("save") }}</span>
          </v-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
    
<script>
import VueElementLoading from "vue-element-loading";
import MediaSelect from "../Components/Upload/MediaSelect.vue";
import DatePicker from "../Components/DatePicker.vue";
import DocumentSelect from "../Components/Upload/DocumentSelect.vue";
export default {
  components: {
    VueElementLoading,
    MediaSelect,
    DatePicker,
    DocumentSelect,
  },
  data: () => ({
    dialog: false,
    valid: true,
    loader: false,
    isBtnLoading: false,
    isDisabled: false,
    sectionarray: [],
    RoleArray: [],
    parentMenuArray: [],
    sectionOrderArray: [],
    user: [],
    user_id: "",
    section_head: {
      description: "",
      parent_menu: "",
    },
    section: {
      id: 0,
      userID: null,
      description: "",
      parent_menu: "",
      visible_to: [],
      section: "",
      section_name: "",
    },
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    fieldRulesArray() {
      return [(v) => v.length > 0 || this.$t("field_required")];
    },
  },

  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.user_id = this.user.emp_id;
    this.fetchlookup();
  },

  watch: {
    "$route.query.section": {
      immediate: true,
      handler() {
        if (this.$route.query.section) {
          this.loader = true;
          axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "fetchsectionbyidforedit/" +
                this.$route.query.section
            )
            .then((res) => {
              this.loader = false;
              if (res.data.status == "S") {
                this.sectionarray.push(res.data.section);
                this.sectionarray[0].visible_to = [];
                this.sectionarray[0].visible_to = res.data.visible_to;
                this.section_head.description = res.data.section.description;
                this.section_head.parent_menu = res.data.section.parent_menu;
              }
            })
            .catch((err) => {
              this.isDisabled = false;
              console.log("this error" + err);
            });
        }
      },
    },
    user_id: {
      immediate: true,
      handler() {
        if (this.user_id >= 1) {
          this.section.userID = this.user_id;
        }
      },
    },
  },

  methods: {
    NumbersOnly(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },

    addnewsection() {
      if (this.$refs.formhead.validate()) {
        this.section = {
          section: "",
          section_name: "",
          visible_to: [],
        };
        this.section.id = 0;
        this.section.userID = this.user_id;
        this.section.parent_menu = this.section_head.parent_menu;
        this.section.description = this.section_head.description;
        this.sectionarray.push(this.section);
      }
    },
    addrowindex() {
      if (this.$refs.formhead.validate()) {
        this.section = {
          section: "",
          section_name: "",
          visible_to: [],
        };
        this.section.id = 0;
        this.section.userID = this.user_id;
        this.section.parent_menu = this.section_head.parent_menu;
        this.section.description = this.section_head.description;
        this.sectionarray.push(this.section);
      }
    },
    minimizerowindex(index) {
      this.sectionarray.splice(index, 1);
    },

    savesection() {
      if (this.$refs.formhead.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        this.section.userID = this.user_id;
        if (this.$route.query.section > 0) {
          this.sectionarray[0].description = this.section_head.description;
          this.sectionarray[0].parent_menu = this.section_head.parent_menu;
        }
        axios
          .post(process.env.VUE_APP_API_URL_ADMIN + "savesectionarray", {
            section: this.sectionarray,
          })
          .then((res) => {
            if (res.data.status == "S") {
              this.flashMessage.success({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.$router.push({
                name: "question_sections",
              });
            } else {
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.isBtnLoading = false;
              this.isDisabled = false;
              console.log("this error" + err);
            }
          })
          .catch((err) => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.isBtnLoading = false;
            this.isDisabled = false;
            console.log("this error" + err);
          });
      }
    },

    fetchlookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "SECTIONS",
          },
        })
        .then((response) => {
          this.sectionOrderArray = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "HEADER_MENU_SECTION",
          },
        })
        .then((response) => {
          this.parentMenuArray = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchalluserroles")
        .then((response) => {
          this.RoleArray = response.data.roles;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style scoped>
.iconflexaddremove {
  background-color: #1976d2 !important;
  height: 30px !important;
  width: 30px !important;
}

.fileinputrowclass {
  min-width: 250px !important;
  padding-top: 10px;
}

.browsedivdoc {
  display: inline-flex;
  width: 100%;
  position: relative;
}

.browsedivdoc /deep/ .v-chip {
  border-radius: 0%;
}

.browsebtndoc {
  height: 40px !important;
  margin-left: -10%;
}
</style>