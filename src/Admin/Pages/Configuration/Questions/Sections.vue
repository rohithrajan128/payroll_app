<template>
    <div class="main-20">
        <div flat color="white" class="row py-5 pl-5 align-items-center">
            <page-title class="col-md-4" :heading="$t('sections')" :google_icon="google_icon"></page-title>
            <div class="col-md-6">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-text-field dense rounded-pill density="compact" outlined rounded small v-on="on" v-model="search"
                            append-icon="search" label="Search" class="srch_bar" hide-details></v-text-field>
                    </template>
                    <span>{{ $t("search") }}</span>
                </v-tooltip>
            </div>

            <div class="col-md-2">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <router-link class="text-decoration-none" :to="{ name: 'question_sections.amend' }"
                            style="color: white">
                            <v-btn color=" btn hover_shine add_new" small class v-on="on">{{ $t("add_new") }}</v-btn>
                        </router-link>
                    </template>
                    <span>{{ $t("add_new") }}</span>
                </v-tooltip>
            </div>
        </div>
        <v-data-table :headers="headers" :items="sections_array" :loading="initval" :search="search">
            <template v-slot:item="props">
                <tr>
                    <td>
                        <span v-if="props.item.parent_menu">{{ props.item.fetch_header_name.shortname }}</span>
                        <span v-else>{{ $t('not_appllicable') }}</span>
                    </td>
                    <td>
                        <v-tooltip bottom v-if="props.item.description" max-width="370" color="white">
                            <template v-slot:activator="{ on }">
                                <div class="description_hover_div" v-on="on">
                                    {{ props.item.description }}
                                </div>
                            </template>
                            <v-sheet class="pa-4 b">{{ props.item.description }}</v-sheet>
                        </v-tooltip>
                        <span v-else>{{ $t('not_appllicable') }}</span>
                    </td>
                    <td>
                        <span v-if="props.item.section">{{ props.item.section }}</span>
                        <span v-else>{{ $t('not_appllicable') }}</span>
                    </td>
                    <td>
                        <span v-if="props.item.section_name">{{ props.item.section_name }}</span>
                        <span v-else>{{ $t('not_appllicable') }}</span>
                    </td>
                    <td>
                      
                                         <span v-if="props.item.visibleTo.length >= 1">
                <v-chip color="primary" outlined small v-for="(role, index) in props.item.visibleTo" :key="index"
                  class="mr-1">{{ role.rolename }}</v-chip>
              </span>
              <span v-else>{{ $t('not_appllicable') }}</span>
                    </td>
                    <td>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">

                                <div v-on="on" class="maindivforswitch d-inline-block" @click="changeStatus(props.item.id)">
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
                    <td class="text-center">
                        <router-link :to="{
                            name: 'question_sections.amend',
                            query: {
                                section: props.item.id,
                            },
                        }">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-icon class="mr-2 edit_btn icon_size" v-on="on">mdi-pencil-outline</v-icon>
                                </template>
                                <span>{{ $t("edit") }}</span>
                            </v-tooltip>
                        </router-link>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon class="mr-2 edit_btn icon_size" @click="deleteSections(props.item.id)" color="error"
                                    v-on="on">mdi-trash-can-outline</v-icon>
                            </template>
                            <span>{{ $t("delete") }}</span>
                        </v-tooltip>
                    </td>
                </tr>
            </template>
        </v-data-table>
        <ConfirmDialog :show="showStatusDialog" :cancel="cancelStatus" :confirm="confirmStatus" v-bind:title="$t('confirm')"
            v-bind:description="$t('status_change')" />
        <ConfirmDialog :show="showdeleteDialog" :cancel="canceldelete" :confirm="confirmdelete" v-bind:title="$t('confirm')"
            v-bind:description="$t('want_to_delete_section')" />
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
        user: [],
        user_id: '',
        sections_array: [],
        showdeleteDialog: false,
        initval: false,
        status_id: null,
        delete_id: null,
        headers: [
            {
                text: "Parent Name",
                align: "left",
                value: "fetch_header_name.shortname"
            },
            {
                text: "Description",
                align: "left",
                value: "description"
            },

            {
                text: "Order",
                align: "left",
                value: "section"
            },
            {
                text: "Section Name",
                align: "left",
                value: "section_name"
            },
            {
                text: "Visible To",
                align: "left",
                value: "fetch_role_name.rolename"
            },
            {
                text: "Status",
                align: "left",
                sortable: false,
                value: "status"
            },


            {
                text: "Actions",
                value: "",
                sortable: false,
                align: "center"
            }
        ],
        google_icon: {
            icon_name: "folder_copy",
            color: "google_icon_gradient",
            icon: "material-symbols-outlined"
        },
        search: "",
        showStatusDialog: false
    }),
    watch: {
        user_id: {
            immediate: true,
            handler() {
                if (this.user_id) {
                    this.fetchSections();
                }
            }
        },
    },
    mounted() {
        this.user = JSON.parse(localStorage.getItem("user"));
        this.user_id = this.user.emp_id;
    },
    methods: {
        cancelStatus() {
            this.showStatusDialog = false;
        },
        confirmStatus() {
            this.statusUpdate();
            this.showStatusDialog = false;
        },
        cancel() {
            this.showdeleteDialog = false;
        },

        canceldelete() {
            this.showdeleteDialog = false;
        },
        confirmdelete() {
            this.confirmdeleteSection();
            this.showdeleteDialog = false;
        },

        fetchSections() {
            this.initval = true;
            axios
                .get(process.env.VUE_APP_API_URL_ADMIN + "fetchallsections/" +
                    this.user_id)
                .then(res => {
                    this.sections_array = res.data.sections;
                    this.initval = false;
                })
                .catch(err => {
                    this.flashMessage.error({
                        message: this.$t("something_went_wrong"),
                        time: 4000,
                        blockClass: "custom-block-class"
                    });
                    console.log(" error" + err);
                    this.initval = false;
                });
        },

        changeStatus(id) {
            this.status_id = id;
            this.showStatusDialog = true;
        },

        deleteSections(id) {
            this.delete_id = id;
            this.showdeleteDialog = true;
        },

        statusUpdate() {
            this.initval = true;
            axios
                .post(process.env.VUE_APP_API_URL_ADMIN + "updatesectionstatus", {
                    id: this.status_id
                })
                .then(res => {
                    if (res.data.status == "S") {
                        this.flashMessage.success({
                            message: res.data.message,
                            time: 4000,
                            blockClass: "custom-block-class"
                        });
                        this.initval = false;
                        this.fetchSections();
                    } else {
                        this.flashMessage.error({
                            message: this.$t("something_went_wrong"),
                            time: 4000,
                            blockClass: "custom-block-class"
                        });
                        this.initval = false;
                        this.fetchSections();
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
        },

        confirmdeleteSection() {
            this.initval = true;
            axios
                .post(process.env.VUE_APP_API_URL_ADMIN + "deletesections", {
                    id: this.delete_id
                })
                .then(res => {
                    if (res.data.status == "S") {
                        this.flashMessage.success({
                            message: res.data.message,
                            time: 4000,
                            blockClass: "custom-block-class"
                        });
                        this.initval = false;
                        this.fetchSections();
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
<style scoped></style>