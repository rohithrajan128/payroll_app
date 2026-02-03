<template>
  <div class="main-20">
    
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title
      class="col-md-4"
      :heading="$t('email_templates')"
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
            :to="{ name: 'email_template_amend' }"
          >
            <v-btn
              color=" hover_shine add_new"
              small
              class=""
              v-on="on"
            >
              {{ $t("add_new") }}
            </v-btn></router-link
          >
        </template>
        <span>{{ $t("add_new") }}</span>
      </v-tooltip>
    </div>
    </div>
    <v-data-table
      :headers="headers"
      :items="email_templates"
      :search="search"
      :loading="initval"
      v-bind:no-data-text="$t('no_data_available')"
      :footer-props="{
        'items-per-page-text': $t('rows_per_page'),
      }"
    >
      <template v-slot:item="props">
        <tr>
          <td>{{ props.item.templatetypename }}</td>
          <td>{{ props.item.template_name }}</td>
          <td>{{ props.item.template_subject }}</td>
          <td class="text-center">
            <router-link
              small
              :to="{
                name: 'email_template_amend',
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
  </div>
</template>

<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
export default {
  components: { PageTitle, ConfirmDialog },
  data: () => ({
    search: "",
    showConfirmDialog: false,
    delete_id: null,
    dialog: false,
    email_templates: [],
    initval: true,
    add_type: "Other Template",
    google_icon: {
      icon_name: "dynamic_feed",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    headers() {
      return [
        {
          text: this.$t("type"),
          value: "templatetypename",
        },
        {
          text: this.$t("name"),
          value: "template_name",
        },
        {
          text: this.$t("subject"),
          value: "template_subject",
        },
        {
          text: this.$t("action"),
          align: "center",
          value: "email",
        },
      ];
    },

    dropdown_font() {
      return [
        {
          text: this.$t("default_template"),
          value: "Default Templates",
        },
        {
          text: this.$t("other_template"),
          value: "Other Templates",
        },
      ];
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {},
  mounted() {
    this.fetchEmailTemplates();
  },

  methods: {
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm(id) {
      this.deleteConfirm(id);
      this.showConfirmDialog = false;
    },

    fetchEmailTemplates() {
      this.initval=true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "emailtemplates")
        .then((res) => {
          this.email_templates = res.data.email_templates;
          this.initval = false;
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          this.initval = false;
          console.log(err);
        });
    },
    deleteItem(template_id) {
      this.delete_id = template_id;
      this.showConfirmDialog = true;
    },
    deleteConfirm(template_id) {
      axios
        .delete(
          process.env.VUE_APP_API_URL_ADMIN + "emailtemplates/" + template_id
        )
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
          } else {
            this.flashMessage.success({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.fetchEmailTemplates();
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

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    addDropdown(addtype) {
      this.add_type = addtype;
      this.$emit("template_type", addtype);
    },
  },
};
</script>
<style scoped>
.list_item {
  cursor: pointer;
}
</style>