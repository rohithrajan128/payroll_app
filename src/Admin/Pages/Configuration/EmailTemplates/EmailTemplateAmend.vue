<template>
  <div class="container-fluid mt-3 p-0">
    <div class="text-center">
      <v-progress-circular v-if="loading" :size="70" :width="7" color="purple" indeterminate></v-progress-circular>
    </div>
    <div class="mb-3" v-if="!loading">
      <div class="card-header">
        <div class="card-header-tab">
          <div class="
              card-header-title
              font-size-lg
              text-capitalize
              font-weight-normal
              titlewrap
            ">
            {{ $t("amend_email_template") }}
          </div>
        </div>
      </div>
      <div class="card-body" style="box-shadow: none !important">
        <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
        <v-form ref="form" v-model="valid">
          <v-flex xs12 sm12>
            <v-layout row wrap>
              <v-flex xs12 sm12>
                <v-card>
                  <v-container fluid grid-list-md>
                    <v-flex xs12 sm12>
                      <v-layout>
                        <v-flex xs12 md6>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <span v-on="on">
                                <v-autocomplete v-bind:label="$t('select_mode')" item-value="id" item-text="longname"
                                  index="id" v-model="fieldItem.template_type_id" :rules="fieldRules1" :items="items"
                                  outlined required dense></v-autocomplete>
                              </span>
                            </template>
                            <span>{{ $t("select_mode") }}</span>
                          </v-tooltip>
                        </v-flex>
                        <v-flex xs12 md6>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-text-field v-on="on" :disabled="fieldItem.id == 0 ? disabled : ''"
                                v-model="fieldItem.template_name" :rules="fieldRules" v-bind:label="$t('name')" required
                                outlined dense></v-text-field>
                            </template>
                            <span>{{ $t("name") }}</span>
                          </v-tooltip>
                        </v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 md12>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-text-field v-on="on" v-model="fieldItem.template_subject" :rules="fieldRules"
                                v-bind:label="$t('subject')" required outlined dense></v-text-field>
                            </template>
                            <span>{{ $t("subject") }}</span>
                          </v-tooltip>
                        </v-flex>
                      </v-layout>

                      <v-layout>
                        <v-flex xs12 md12>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <span v-on="on">
                                <v-card-text>{{ $t("body") }}</v-card-text>

                                <quill-editor v-model="fieldItem.template_body" tag-name="textarea" id="tempbody" @blur="validateField()" @change="validateField()"
                                  name="template_body" v-bind:label="$t('body')" :editor="editor"
                                  :config="editorConfig"></quill-editor>
                                <span v-if="showerrmsg" name class="ml-2" style="color: red">{{ $t("field_required") }}</span>
                              </span>
                            </template>
                            <span>{{ $t("body") }}</span>
                          </v-tooltip>
                        </v-flex>
                      </v-layout>

                      <v-layout>
                        <v-flex xs12 md12>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <span v-on="on">
                                <v-card-text>{{ $t("signature") }}</v-card-text>
                                <quill-editor v-model="fieldItem.template_signature" tag-name="textarea"
                                  name="template_signature" v-bind:label="$t('signature')" :editor="editor"
                                  :config="editorConfig"></quill-editor>
                                <span v-if="errmsgsign" name class="ml-2" style="color: red">{{ $t("field_required") }}</span>
                              </span>
                            </template>
                            <span>{{ $t("signature") }}</span>
                          </v-tooltip>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-container>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-form>
      </div>
      <div class="d-block text-right mr-4">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block mr-2">
              <v-btn v-on="on" small @click="$router.go(-1)" :disabled="loading" class="ma-1 font-weight-bold cancel-btn"
                color="dark cancel_button">{{ $t("cancel") }}</v-btn>
            </div>
          </template>
          <span>{{ $t("cancel") }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block">
              <v-btn :disabled="isDisabled" @click="submit" small class="mr-2 success hover_shine" color="green darken-1">
                {{ $t("submit") }}
                <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
              </v-btn>
            </div>
          </template>
          <span>{{ $t("submit") }}</span>
        </v-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
import { quillEditor } from "vue-quill-editor";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
export default {
  components: {
    VueElementLoading,
    quillEditor,
  },
  data: () => ({
    btnloading: false,
    flowerbraceleft: "{{",
    flowerbraceright: "}}",
    orgcolumns: [],
    customercolumns: [],
    appointmentcolumns: [],
    // editor2: ClassicEditor,
    selectmode: null,
    loader: false,
    editorConfig: {
      required: true,
    },
    editor: "",
    valid: true,
    show: true,
    showsmsarea: false,
    message: "",
    errmsgsign: false,
    errmsgbody: false,
    valid_error: false,
    valid_success: false,
    successmessage: "",
    loading: false,
    isBtnLoading: false,
    isDisabled: false,
    fieldItem: {
      id: 0,
      template_name: "",
      template_subject: "",
      template_body: "",
      template_signature: "",
      can_override: "N",
      template_type_id: "",
    },
    template_slug: "",
    passwordvalue: String,
    items: [],
    item: [],
    orgs: [],
    disabled: false,
    showerrmsg: false,
    email: "",
  }),

  computed: {
    fieldRules() {
      return [(v) => (!!v && !!v.trim()) || this.$t("field_required")];
    },
    fieldRules1() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },

  created() {
    this.fetchLookup();
  },
  mounted() { },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          this.template_slug = this.$route.query.slug;
          axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
              "emailtemplates/" +
              this.$route.query.slug
            )
            .then((res) => {
              this.loader = false;
              this.fieldItem = res.data.email_template;
              this.loading = false;
            })
            .catch((err) => {
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.loader = false;
              console.log("this error", err);
            });
        }
      },
    },
  },

  methods: {
    validateField(){
      const contentWithoutPTags = this.fieldItem.template_body.replace(/<p>/g, '').replace(/<\/p>/g, '');
    console.log(contentWithoutPTags);
        if(contentWithoutPTags==''){
      this.showerrmsg=true
     }else{
      this.showerrmsg=false
     } 
    },
    fetchLookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "TEMPLATE_TYPE",
          },
        })
        .then((response) => {
          console.log(response);
          this.items = response.data.lookup_details;
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(err);
        });
    },

    submit() {
      if(this.fieldItem.template_body ==""){
        this.showerrmsg=true;
      }
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        if (this.template_slug == "") {
          axios
            .post(
              process.env.VUE_APP_API_URL_ADMIN + "emailtemplates",
              this.fieldItem
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
                this.message = res.data.message;
                this.$router.push({
                  name: "email_template",
                });
              } else if (res.data.status == "E") {
                this.isBtnLoading = false;
                this.isDisabled = false;
                this.flashMessage.error({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class",
                });
              } else {
                this.isBtnLoading = false;
                this.flashMessage.error({
                  message: this.array_data,
                });
              }
            })
            .catch((err) => {
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.isBtnLoading = false;
              console.log("this error" + err);
            });
        } else {
          axios
            .patch(
              process.env.VUE_APP_API_URL_ADMIN +
              "emailtemplates/" +
              this.template_slug,
              this.fieldItem
            )
            .then((res) => {
              this.btnloading = false;
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
                this.message = res.data.message;
                this.$router.push({
                  name: "email_template",
                });
              } else if (res.data.status == "E") {
                this.isBtnLoading = false;
                this.isDisabled = false;
                this.flashMessage.error({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class",
                });
              } else {
                this.isDisabled = false;
                this.flashMessage.error({
                  message: this.array_data,
                });
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
      }
    },
    cancel() {
      this.$router.push({
        name: "email_template",
      });
    },
  },
};
</script>
<style lang="css">
@import "~quill/dist/quill.core.css";
@import "~quill/dist/quill.snow.css";
@import "~quill/dist/quill.bubble.css";

.v-card {
  box-shadow: none !important;
}
</style>
