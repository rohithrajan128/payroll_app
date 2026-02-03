<template>
    <div class="container-fluid p-0">
        <div class="mb-3 mt-2 mx-auto">
            <div class="card-body">
                <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
                <div class="row">
                    <h4 class="title-section-user_creation">
                        {{ $t("contact_details") }}
                    </h4>
                    <div class="col-md-12" style="margin-top:-15px">
                        <div>{{ $t("company_contact_no") }}</div>
                        <div class="values" v-if="ConnectArray.contact_no">
                            <span v-if="ConnectArray.contact_no_code"> + {{ ConnectArray.contact_no_code }}</span>
                            {{ ConnectArray.contact_no }}
                        </div>
                        <div v-else>{{ $t("empty_field") }}</div>
                    </div>
                    <div class="col-md-12">
                        <div>{{ $t("company_email") }}</div>
                        <div class="values connectemaildiv" v-if="ConnectArray.email">
                            {{ ConnectArray.email }}
                        </div>
                        <div v-else>{{ $t("empty_field") }}</div>
                    </div>
                    <div class="col-md-12">
                        <div>{{ $t("primary_contact_email") }}</div>
                        <div class="values connectemaildiv" v-if="ConnectArray.contact_email">
                            {{ ConnectArray.contact_email }}
                        </div>
                        <div v-else>{{ $t("empty_field") }}</div>
                    </div>
                    <h4 class="title-section-user_creation">
                        {{ $t("address_details") }}
                    </h4>
                    <div class="col-md-12" style="margin-top:-16px">
                        <div class="values" v-if="ConnectArray.address">
                            <span class="values">
                                {{ ConnectArray.address }}
                            </span>
                            <br>
                            <span class="values" v-if="ConnectArray.city">
                                {{ ConnectArray.city }}
                            </span>
                            <span class="values" v-if="ConnectArray.state">
                                , {{ ConnectArray.state }}
                            </span>
                            <span class="values" v-if="ConnectArray.country">
                                , {{ ConnectArray.country }}
                            </span>
                            <span class="values" v-if="ConnectArray.post_code">
                                - {{ ConnectArray.post_code }}
                            </span>
                        </div>
                        <div v-else>{{ $t("empty_field") }}</div>
                    </div>
                    <h4 class="title-section-user_creation">
                        {{ $t("service_offered") }}
                    </h4>
                    <div class="col-md-12 pt-0 pb-3">
                        <div class="values" v-if="ConnectArray.service_offered">
                            <v-chip v-for="(service, i) in ConnectArray.service_offered" :key="i"
                                class="mr-1 serviceofeerrow" variant="outlined" color="primary" small>{{ service }}</v-chip>
                        </div>
                        <div v-else>{{ $t("empty_field") }}</div>
                    </div>
                    <h4 class="title-section-user_creation">
                        <div style="position: relative;">
                            {{ $t("social_links") }}
                            <v-spacer></v-spacer>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-icon medium color="primary" class="mb-1 headereditconnect"
                                        @click="sociallinkdialog = true" v-on="on">mdi-pencil-circle</v-icon>
                                </template>
                                <span>{{ $t("edit_social_links") }}</span>
                            </v-tooltip>
                        </div>
                    </h4>
                    <div
                        v-if="ConnectArray.website || ConnectArray.linkedin || ConnectArray.skype || ConnectArray.facebook">
                        <div style="margin-top: -15px;">
                            <div class="col-md-12" v-if="ConnectArray.website">
                                <div class="d-flex">
                                    <div>
                                        <v-img width="20" src="@/assets/icons/social-media/earth-icon.svg"></v-img>
                                    </div>
                                    <div class="pl-2">
                                        <div v-if="ConnectArray.website">
                                            <a class="social-links" :href="ConnectArray.website" target="_tab">
                                                {{ ConnectArray.website }}</a>
                                        </div>
                                        <div v-else class="pl-2">{{ $t("not_found") }}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12" v-if="ConnectArray.linkedin">
                                <div class="d-flex">
                                    <div>
                                        <v-img width="20" src="@/assets/icons/social-media/linkedin.svg"></v-img>
                                    </div>
                                    <div class="pl-2">
                                        <div v-if="ConnectArray.linkedin">
                                            <a class="social-links" :href="ConnectArray.linkedin" target="_tab">
                                                {{ ConnectArray.linkedin }}</a>
                                        </div>
                                        <div v-else class="pl-2">{{ $t("not_found") }}</div>
                                    </div>

                                </div>
                            </div>
                            <div class="col-md-12" v-if="ConnectArray.skype">
                                <div class="d-flex">
                                    <div>
                                        <v-img width="20" src="@/assets/icons/social-media/skype.svg"></v-img>
                                    </div>
                                    <div class="pl-2">
                                        <div v-if="ConnectArray.skype">
                                            <a class="social-links" :href="ConnectArray.skype" target="_tab">
                                                {{ ConnectArray.skype }}</a>
                                        </div>
                                        <div v-else class="pl-2">{{ $t("not_found") }}</div>
                                    </div>

                                </div>
                            </div>
                            <div class="col-md-12" v-if="ConnectArray.facebook">
                                <div class="d-flex">
                                    <div>
                                        <v-img width="20" src="@/assets/icons/social-media/facebook.svg"></v-img>
                                    </div>
                                    <div class="pl-2">
                                        <div v-if="ConnectArray.facebook">
                                            <a class="social-links" :href="ConnectArray.facebook" target="_tab">
                                                {{ ConnectArray.facebook }}</a>
                                        </div>
                                        <div v-else class="pl-2">{{ $t("not_found") }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row px-3" v-else>
                        <div class="col-md-12 text-center h6 b">
                            {{ $t("no_data_available") }}
                        </div>
                    </div>
                    <h4 class="title-section-user_creation">
                        <div style="position: relative;">
                            {{ $t("tax_info") }}
                            <v-spacer></v-spacer>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-icon medium color="primary" class="mb-1 headereditconnect"
                                        @click="taxinfodialog = true" v-on="on">mdi-pencil-circle</v-icon>
                                </template>
                                <span>{{ $t("edit_tax_info") }}</span>
                            </v-tooltip>
                        </div>
                    </h4>

                    <div class="col-md-12">
                        <div class="d-flex">
                            <div class="taxvalues">{{ $t("crn") }} -</div>
                            <div class="values ml-2" v-if="ConnectArray.CRN">
                                {{ ConnectArray.CRN }}
                            </div>
                            <div v-else class="ml-2">{{ $t("not_found") }}</div>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="d-flex">
                            <div class="taxvalues">{{ $t("vatgst") }} -</div>
                            <div class="values ml-2" v-if="ConnectArray.VAT_GST_NO">
                                {{ ConnectArray.VAT_GST_NO }}
                            </div>
                            <div v-else class="ml-2">{{ $t("not_found") }}</div>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="d-flex">
                            <div class="taxvalues">{{ $t("pan") }} -</div>
                            <div class="values ml-2" v-if="ConnectArray.business_pan">
                                {{ ConnectArray.business_pan }}
                            </div>
                            <div v-else class="ml-2">{{ $t("not_found") }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <v-dialog v-model="taxinfodialog" persistent max-width="650px">
            <v-toolbar color="primary">
                <span class="headline" style="color: white;">{{ $t("create_amend_tax_info") }}
                </span>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-icon @click="taxinfodialog = false" class="dialogcloseinuserdetails" v-on="on"
                            style="color: white;">mdi-close</v-icon>
                    </template>
                    <span>{{ $t("close") }}</span>
                </v-tooltip>
            </v-toolbar>
            <v-card>
                <v-form ref="form" v-model="validtax">
                    <v-layout px-6 pt-5>
                        <v-flex xs12 md12 px-1>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-text-field dense v-on="on" v-model="ConnectArray.CRN" maxlength="50"
                                        v-bind:label="$t('CRN')" outlined></v-text-field>
                                </template>
                                <span>{{ $t("CRN") }}</span>
                            </v-tooltip>
                        </v-flex>
                    </v-layout>
                    <v-layout px-6>
                        <v-flex xs12 md12 px-1>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-text-field dense v-on="on" v-model="ConnectArray.VAT_GST_NO" maxlength="50"
                                        v-bind:label="$t('VAT_GST_NO')" outlined></v-text-field>
                                </template>
                                <span>{{ $t("VAT_GST_NO") }}</span>
                            </v-tooltip>
                        </v-flex>
                    </v-layout>
                    <v-layout px-6>

                        <v-flex xs12 md12 px-1>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-text-field dense v-on="on" v-model="ConnectArray.business_pan" maxlength="50"
                                        v-bind:label="$t('business_pan_number')" outlined></v-text-field>
                                </template>
                                <span>{{ $t("business_pan_number") }}</span>
                            </v-tooltip>
                        </v-flex></v-layout>
                    <div class="text-right mr-6 pb-4">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <div v-on="on" class="d-inline-block mr-2">
                                    <v-btn v-on="on" small @click="taxinfodialog = false"
                                        class="ma-1 font-weight-bold cancel-btn" color="dark cancel_button">{{ $t("cancel")
                                        }}</v-btn>
                                </div>
                            </template>
                            <span>{{ $t("cancel") }}</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <div v-on="on" class="d-inline-block">
                                    <v-btn :disabled="isBtnLoading" color="green darken-1"
                                        @click="updateconnectdetails('additional_details')" small
                                        class="mr-2 success hover_shine">
                                        {{ $t("submit") }}
                                        <b-spinner small v-if="isBtnLoading"></b-spinner>
                                    </v-btn>
                                </div>
                            </template>
                            <span>{{ $t("submit") }}</span>
                        </v-tooltip>
                    </div>
                </v-form>
            </v-card>
        </v-dialog>

        <v-dialog v-model="sociallinkdialog" persistent max-width="700px">
            <v-toolbar color="primary">
                <span class="headline" style="color: white;">{{ $t("create_amend_social_link") }}
                </span>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-icon @click="sociallinkdialog = false" class="dialogcloseinuserdetails" v-on="on"
                            style="color: white;">mdi-close</v-icon>
                    </template>
                    <span>{{ $t("close") }}</span>
                </v-tooltip>
            </v-toolbar>
            <v-card>
                <v-form ref="form" v-model="validsocial">
                    <v-row class="pt-6 mx-5">
                        <v-col md="12" sm="12" class="sociallinkdialogrow">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-text-field dense v-on="on" v-model="ConnectArray.website" maxlength="50"
                                        v-bind:label="$t('website')" outlined></v-text-field>
                                </template>
                                <span>{{ $t("website") }}</span>
                            </v-tooltip>
                        </v-col>
                        <v-col md="12" sm="12" class="sociallinkdialogrow">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-text-field dense v-on="on" v-model="ConnectArray.facebook" maxlength="50"
                                        v-bind:label="$t('facebook')" outlined></v-text-field>
                                </template>
                                <span>{{ $t("facebook") }}</span>
                            </v-tooltip>
                        </v-col>
                        <v-col md="12" sm="12" class="sociallinkdialogrow">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-text-field dense v-on="on" v-model="ConnectArray.linkedin" maxlength="50"
                                        v-bind:label="$t('linkedin')" outlined></v-text-field>
                                </template>
                                <span>{{ $t("linkedin") }}</span>
                            </v-tooltip>
                        </v-col>
                        <v-col md="12" sm="12" class="sociallinkdialogrow">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-text-field dense v-on="on" v-model="ConnectArray.skype" v-bind:label="$t('skype')"
                                        maxlength="50" outlined></v-text-field>
                                </template>
                                <span>{{ $t("skype") }}</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <div class="text-right mr-6 pb-4">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <div v-on="on" class="d-inline-block mr-2">
                                    <v-btn v-on="on" small @click="sociallinkdialog = false"
                                        class="ma-1 font-weight-bold cancel-btn" color="dark cancel_button">{{ $t("cancel")
                                        }}</v-btn>
                                </div>
                            </template>
                            <span>{{ $t("cancel") }}</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <div v-on="on" class="d-inline-block">
                                    <v-btn :disabled="isBtnLoading" color="green darken-1"
                                        @click="updateconnectdetails('additional_details')" small
                                        class="mr-2 success hover_shine">
                                        {{ $t("submit") }}
                                        <b-spinner small v-if="isBtnLoading"></b-spinner>
                                    </v-btn>
                                </div>
                            </template>
                            <span>{{ $t("submit") }}</span>
                        </v-tooltip>
                    </div>
                </v-form>
            </v-card>
        </v-dialog>

    </div>
</template>
 
<script>
import VueElementLoading from "vue-element-loading";
export default {
    props: ['connect_id'],
    components: {
        VueElementLoading,
    },
    data: () => ({
        loader: false,
        isBtnLoading: false,
        sociallinkdialog: false,
        taxinfodialog: false,
        validsocial: false,
        validtax: false,
        ConnectArray: [],
    }),
    computed: {
    },

    mounted() {
    },

    created() {
        this.$eventBus.$on("updated_services", () => {
            this.fetchconnectbyId(this.connect_id);
        });
    },
    watch: {
        connect_id: {
            immediate: true,
            handler() {
                if (this.connect_id > 0) {
                    this.fetchconnectbyId(this.connect_id);
                }
            }
        }
    },
    methods: {
        updateconnectdetails(type) {
            this.isBtnLoading = true;
            axios
                .post(
                    process.env.VUE_APP_API_URL_ADMIN + "updateconnectdetailsinviewpage",
                    {
                        parent_id: this.connect_id,
                        type: type,
                        data: this.ConnectArray,
                    }
                )
                .then((res) => {
                    this.isBtnLoading = false;
                    this.sociallinkdialog = false;
                    this.taxinfodialog = false;
                    this.flashMessage.success({
                        message: res.data.message,
                        time: 4000,
                        blockClass: "custom-block-class",
                    });
                    this.fetchconnectbyId(this.connect_id);
                })
                .catch((err) => {
                    this.isBtnLoading = false;
                    this.sociallinkdialog = false;
                    this.taxinfodialog = false;
                    this.flashMessage.error({
                        message: this.$t("something_went_wrong"),
                        time: 4000,
                        blockClass: "custom-block-class",
                    });
                    console.log("error", err);
                });
        },
        fetchconnectbyId(id) {
            this.loader = true;
            axios
                .get(process.env.VUE_APP_API_URL_ADMIN + "edit_recruitment_connect/" + id)
                .then((res) => {
                    if (res.data.status = 'S') {
                        this.ConnectArray = res.data.connect;
                        this.ConnectArray.service_offered = JSON.parse(
                            res.data.connect.service_offered
                        );
                        this.loader = false;
                        this.$emit("getData", this.ConnectArray);
                    }
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
.values {
    font-weight: bold;
    font-size: 14px;
}

.headereditconnect {
    position: absolute;
    right: 7px;
    top: 0px;
}

.sociallinkdialogrow {
    padding-bottom: 0px;
    padding-top: 0px;
    margin: auto;
}

.connectemaildiv {
    text-overflow: ellipsis;
    overflow-x: clip;
    cursor: pointer;
}

.serviceofeerrow {
    margin-top: 6px !important;
}

.taxvalues {
    font-weight: 600;
    color: rgba(0, 0, 0, 0.737);
}

.sociallinknodata {
    margin-inline: auto;
    padding-left: 5px;
    font-size: 15px;
    padding-bottom: 15px;
    font-weight: 600;
    color: #5c5c5c;
}
</style>
  