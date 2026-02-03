
<template>
    <div class="main-20">
        <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
        <div>
            <v-app-bar flat color="white">
                <h5>{{ $t('exit_interview') }}<i class="fa fa-external-link pl-3"></i></h5>
                <v-spacer></v-spacer>
                <!-- <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn small v-on="on" @click="$router.go(-1)" class="font-weight-bold cancel-btn"
                            color="btn hover_shine cancel_button">{{ $t("cancel") }}
                        </v-btn>
                    </template>
                    <span>{{ $t("cancel") }}</span>
                </v-tooltip> -->
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <router-link class="text-decoration-none" :to="{ name: 'exit_interview_emp_question' }"
                           >
                            <v-btn small v-on="on" class="font-weight-bold cancel-btn ml-2"
                                color="btn primary hover_shine">{{ $t("next") }}
                            </v-btn>
                        </router-link>
                    </template>
                    <span>{{ $t("next") }}</span>
                </v-tooltip>
            </v-app-bar>
            <v-sheet class="mt-1">
                <div class="row pb-6">
                    <div class="col-md-2 align-self-center pb-12">
                        <div class="text-center pl-2">
                            <v-avatar rounded="0" size="130" class="vavatarprofile" v-if="user_array">
                                <img v-if="user_array.profile_pic" :src="envImagePath + user_array.profile_pic" />
                                <img v-else src="@/assets/images/default-user-profile-picture.png" />
                            </v-avatar>
                        </div>
                    </div>
                    <div class="col-md-10">
                        <v-layout>
                            <v-flex md12>
                                <span class="usernamegreenheading">
                                    {{ user_array.Full_Code }}
                                </span>
                            </v-flex>
                        </v-layout>
                        <v-layout wrap class="mt-1">
                            <v-flex md3 pl-2>
                                <div class="userdetails_in_emp_seperation_process">
                                    <span class="heading_emp_seperation_process">
                                        {{ $t('designation') }}
                                    </span>
                                    <span class="body_emp_seperation_process" v-if="user_array.designation_id">{{
                                        user_array.designation.longname }}</span>
                                    <span class="body_emp_seperation_process" v-else>{{ $t('not_appllicable') }}</span>
                                </div>
                            </v-flex>
                            <v-flex md3 pl-2>
                                <div class="userdetails_in_emp_seperation_process">
                                    <span class="heading_emp_seperation_process">
                                        {{ $t('reporting_to') }}
                                    </span>
                                    <span class="body_emp_seperation_process" v-if="primary_manager_name">{{
                                        primary_manager_name }}</span>
                                    <span class="body_emp_seperation_process" v-else>{{ $t('not_appllicable') }}</span>
                                </div>
                            </v-flex>
                            <v-flex md3 pl-2>
                                <div class="userdetails_in_emp_seperation_process">
                                    <span class="heading_emp_seperation_process">
                                        {{ $t('department') }}
                                    </span>
                                    <span class="body_emp_seperation_process" v-if="user_array.department">{{
                                        user_array.department }}</span>
                                    <span class="body_emp_seperation_process" v-else>{{ $t('not_appllicable') }}</span>
                                </div>
                            </v-flex>
                            <v-flex md3 pl-2>
                                <div class="userdetails_in_emp_seperation_process">
                                    <span class="heading_emp_seperation_process">
                                        {{ $t('location') }}
                                    </span>
                                    <span class="body_emp_seperation_process" v-if="user_array.addressdetails">
                                        {{ user_array.addressdetails.county }}</span>
                                    <span class="body_emp_seperation_process" v-else>{{ $t('not_appllicable') }}</span>
                                </div>
                            </v-flex>
                        </v-layout>
                        <v-layout wrap class="mt-4">
                            <v-flex md3 pl-2>
                                <div class="userdetails_in_emp_seperation_process">
                                    <span class="heading_emp_seperation_process">
                                        {{ $t('emp_no') }}
                                    </span>
                                    <span class="body_emp_seperation_process" v-if="user_array.empno">{{
                                        user_array.empno }}</span>
                                    <span class="body_emp_seperation_process" v-else>{{ $t('not_appllicable') }}</span>
                                </div>
                            </v-flex>
                            <v-flex md3 pl-2>
                                <div class="userdetails_in_emp_seperation_process">
                                    <span class="heading_emp_seperation_process">
                                        {{ $t('official_email') }}
                                    </span>
                                    <span class="body_emp_seperation_process" v-if="user_array.userdetails">
                                        {{ user_array.userdetails.email }}</span>
                                    <span class="body_emp_seperation_process" v-else>{{ $t('not_appllicable') }}</span>
                                </div>
                            </v-flex>
                            <v-flex md3 pl-2>
                                <div class="userdetails_in_emp_seperation_process">
                                    <span class="heading_emp_seperation_process">
                                        {{ $t('Joining_date') }}
                                    </span>
                                    <span class="body_emp_seperation_process" v-if="user_array.Joining_date">{{
                                        user_array.Joining_date |
                                        formatFullDate }}</span>
                                    <span class="body_emp_seperation_process" v-else>{{ $t('not_appllicable') }}</span>
                                </div>
                            </v-flex>
                            <v-flex md3 pl-2>
                                <div class="userdetails_in_emp_seperation_process">
                                    <span class="heading_emp_seperation_process">
                                        {{ $t('resignation_date') }}
                                    </span>
                                    <span class="body_emp_seperation_process" v-if="user_array.resignation_details">{{
                                        user_array.resignation_details.resignation_submitted_on | formatFullDate}}</span>
                                    <span v-else class="body_emp_seperation_process">{{ $t('not_appllicable') }}</span>
                                </div>
                            </v-flex>
                        </v-layout>
                        <v-layout wrap class="mt-4">
                            <v-flex md3 pl-2>
                                <div class="userdetails_in_emp_seperation_process">
                                    <span class="heading_emp_seperation_process">
                                        {{ $t('immediate_supervisor_name') }}
                                    </span>
                                    <!-- <span class="body_emp_seperation_process" v-if="user_array.department">{{
                                        user_array.department }}</span> -->
                                    <span class="body_emp_seperation_process">{{ $t('not_appllicable') }}</span>
                                </div>
                            </v-flex>
                            <v-flex md3 pl-2>
                                <div class="userdetails_in_emp_seperation_process">
                                    <span class="heading_emp_seperation_process">
                                        {{ $t('last_project_worked') }}
                                    </span>
                                    <span class="body_emp_seperation_process" v-if="last_project_worked.length>=1">
                                        <span v-for="(project , index) in last_project_worked" :key="index">
                                        {{ project.project_name }}<span v-if="index+1!=last_project_worked.length">{{ $t('coma') }}</span>
                                        </span>
                                        </span>
                                        <span v-else class="body_emp_seperation_process">{{ $t('not_appllicable') }}</span>
                                </div>
                            </v-flex>
                        </v-layout>
                    </div>
                </div>
            </v-sheet>
            <br>
            <v-app-bar flat color="white">
                <h5>{{ $t('future_contact_details') }}</h5>
            </v-app-bar>
            <v-sheet class="mt-1 mb-2 pb-15">
                <div class="row">
                    <div class="col-md-6">
                        <v-layout wrap class="pt-4" pl-8>
                            <v-flex md6 pl-2>
                                <div class="userdetails_in_emp_seperation_process">
                                    <span class="heading_emp_seperation_process">
                                        {{ $t('mobile_no_personal') }}
                                    </span>
                                    <span class="body_emp_seperation_process" v-if="user_array.phone">{{
                                        user_array.phone }}</span>
                                    <span class="body_emp_seperation_process" v-else>{{ $t('not_appllicable') }}</span>
                                </div>
                            </v-flex>
                            <v-flex md6 pl-2>
                                <div class="userdetails_in_emp_seperation_process">
                                    <span class="heading_emp_seperation_process">
                                        {{ $t('email_id_personal') }}
                                    </span>
                                    <span class="body_emp_seperation_process" v-if="user_array.personal_email">{{
                                        user_array.personal_email }}</span>
                                    <span class="body_emp_seperation_process" v-else>{{ $t('not_appllicable') }}</span>
                                </div>
                            </v-flex>
                        </v-layout>
                        <v-form ref="form" v-model="valid">
                            <v-layout wrap class="mt-6" pl-8>
                                <v-flex md6 pl-2>
                                    <div class="userdetails_in_emp_seperation_process">
                                        <span class="heading_emp_seperation_process">
                                            {{ $t('is_the_mobile_no_correct') }}
                                        </span>
                                        <v-radio-group inline v-model="mobilecorrect" class="radiabuttonclass d-flex" row>
                                            <v-radio label="Yes" :value="1"></v-radio>
                                            <v-radio label="No" :value="0"></v-radio>
                                        </v-radio-group>
                                        <div v-if="mobilecorrect == 0" class="pr-15">
                                            <v-text-field dense outlined v-bind:label="$t('new_mobile_no')"
                                                class="required_field mr-10" v-model="newDetails.mobile" maxlength="10"
                                                @keypress.native="isNumber($event)" :rules="fieldRules"></v-text-field>
                                        </div>
                                    </div>
                                </v-flex>
                                <v-flex md6 pl-2>
                                    <div class="userdetails_in_emp_seperation_process">
                                        <span class="heading_emp_seperation_process">
                                            {{ $t('is_the_email_id_correct') }}
                                        </span>
                                        <v-radio-group inline v-model="emailcorrect" class="radiabuttonclass d-flex" row>
                                            <v-radio label="Yes" :value="1"></v-radio>
                                            <v-radio label="No" :value="0"></v-radio>
                                        </v-radio-group>
                                        <div v-if="emailcorrect == 0" class="pr-12">
                                            <v-text-field dense outlined v-bind:label="$t('new_email')"
                                                class="required_field mr-5" v-model="newDetails.email"
                                                :rules="emailRules"></v-text-field>
                                        </div>
                                    </div>
                                </v-flex>
                            </v-layout></v-form>
                    </div>
                    <div class="col-md-6">
                        <v-layout wrap class="mt-4">
                            <v-flex md6>
                                <div class="userdetails_in_emp_seperation_process_address">
                                    <span class="heading_emp_seperation_process">
                                        {{ $t('address') }}
                                    </span>
                                    <span class="body_emp_seperation_process" v-if="user_array.fulladdress">{{
                                        user_array.fulladdress }}</span>
                                    <span class="body_emp_seperation_process" v-else>{{ $t('not_appllicable') }}</span>
                                </div>
                            </v-flex>
                            <v-flex md6 pl-4>
                                <div class="userdetails_in_emp_seperation_process">
                                    <span class="heading_emp_seperation_process">
                                        {{ $t('is_the_address_correct') }}
                                    </span>
                                    <v-radio-group inline v-model="addresscorrect" class="radiabuttonclass d-flex" row>
                                        <v-radio label="Yes" :value="1"></v-radio>
                                        <v-radio label="No" :value="0"></v-radio>
                                    </v-radio-group>
                                </div>
                            </v-flex>
                        </v-layout>
                        <v-layout wrap pr-12 class="mt-2" v-if="addresscorrect == 0">
                            <v-flex md12>
                                <v-textarea rows="2" dense outlined v-bind:label="$t('new_address')"
                                    class="required_field mr-5" v-model="newDetails.address"
                                    :rules="fieldRules"></v-textarea>

                            </v-flex>
                        </v-layout>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <v-layout wrap pl-8>
                            <v-flex md3 pl-2>
                                <div class="userdetails_in_emp_seperation_process">
                                    <span class="heading_emp_seperation_process">
                                        {{ $t('postcode') }}
                                    </span>
                                    <span class="body_emp_seperation_process" v-if="user_array.addressdetails">
                                        {{ user_array.addressdetails.postcode }}</span>
                                    <span class="body_emp_seperation_process" v-else>{{ $t('not_appllicable') }}</span>
                                </div>
                            </v-flex>
                            <v-flex md3 pl-2>
                                <div class="userdetails_in_emp_seperation_process">
                                    <span class="heading_emp_seperation_process">
                                        {{ $t('country') }}
                                    </span>
                                    <span class="body_emp_seperation_process" v-if="user_array.nationalitylookupdetails">{{
                                        user_array.nationalitylookupdetails.shortname }}</span>
                                    <span v-else class="body_emp_seperation_process">{{ $t('not_appllicable') }}</span>
                                </div>
                            </v-flex>
                            <v-flex md3 pl-2>
                                <div class="userdetails_in_emp_seperation_process">
                                    <span class="heading_emp_seperation_process">
                                        {{ $t('state') }}
                                    </span>
                                    <span class="body_emp_seperation_process" v-if="user_array.fulllocation">
                                        <span v-if="user_array.fulllocation.state_name"> {{
                                            user_array.fulllocation.state_name.name
                                        }}</span>
                                    </span>
                                    <span v-else class="body_emp_seperation_process">{{ $t('not_appllicable') }}</span>
                                </div>
                            </v-flex>
                            <v-flex md3 pl-2>
                                <div class="userdetails_in_emp_seperation_process">
                                    <span class="heading_emp_seperation_process">
                                        {{ $t('city') }}
                                    </span>
                                    <span class="body_emp_seperation_process" v-if="user_array.addressdetails">{{
                                        user_array.addressdetails.county }}</span>
                                    <span v-else class="body_emp_seperation_process">{{ $t('not_appllicable') }}</span>
                                </div>
                            </v-flex>
                        </v-layout>
                    </div>
                </div>

                <v-row>
                    <v-spacer></v-spacer>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn small v-on="on" class="font-weight-bold cancel-btn mr-10 mb-5" :disabled="isBtnLoading"
                                @click="saveEmpNewDetails()" color="btn hover_shine success">{{
                                    $t("save") }}
                                <b-spinner small v-if="isBtnLoading"></b-spinner>
                            </v-btn>
                        </template>
                        <span>{{ $t("save") }}</span>
                    </v-tooltip>
                </v-row>
            </v-sheet>
            <v-app-bar flat color="white">
                <h5>{{ $t('new_company_details') }}</h5>
            </v-app-bar>
            <v-sheet class="mt-1">
                <v-layout wrap pl-8 pr-8 class="pt-6">
                    <v-flex md4>
                        <v-text-field dense outlined v-bind:label="$t('name_of_joining_org')"
                            v-model="newcompany.new_join_org_name"></v-text-field>
                    </v-flex>
                    <v-flex md4 pl-4>
                        <v-text-field dense outlined v-bind:label="$t('designation')"
                            v-model="newcompany.new_join_org_position"></v-text-field>
                    </v-flex>
                    <v-flex md4 pl-4>
                        <DatePicker :label="$t('date_of_joining')" :stored_date="newcompany.new_org_join_date"
                            @formatted_date="formatted_from_date" dense v-model="newcompany.new_org_join_date" />
                    </v-flex>
                </v-layout>
                <v-row class="mt-2">
                    <v-spacer></v-spacer>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn small v-on="on" class="font-weight-bold cancel-btn mr-10 mb-5" :disabled="isBtnLoading1"
                                @click="saveEmpNewCompany()" color="btn hover_shine success">{{
                                    $t("save") }}
                                <b-spinner small v-if="isBtnLoading1"></b-spinner>
                            </v-btn>
                        </template>
                        <span>{{ $t("save") }}</span>
                    </v-tooltip>
                </v-row>
            </v-sheet>
        </div>
    </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
import DatePicker from "../Components/DatePicker.vue";
export default {
    components: {
        VueElementLoading,
        DatePicker
    },

    data: () => ({
        envImagePath: process.env.VUE_APP_IMAGE_PATH,
        showStatusDialog: false,
        isBtnLoading: false,
        isBtnLoading1: false,
        valid: true,
        newcompany: {
            new_org_join_date: '',
            new_join_org_position: '',
            new_join_org_name: '',
            empNo: '',
            user_id: '',
        },
        emailcorrect: 1,
        addresscorrect: 1,
        mobilecorrect: 1,
        user_array: [],
        last_project_worked: [],
        newDetails: {
            empNo: '',
            user_id: '',
            mobile: '',
            email: '',
            address: '',
        },
        user_id: "",
        user: [],
        loader: false,
        primary_manager_name: '',
    }),
    mounted() {
        this.user = JSON.parse(localStorage.getItem("user"));
        this.user_id = this.user.emp_id;
    },
    created() {
        this.fetchlookup();
    },
    watch: {
        user_id: {
            immediate: true,
            handler() {
                if (this.user_id) {
                    this.fetchemployeeDetails();
                    this.fetchEmpnewDetails();
                    this.newDetails.user_id = this.user_id;
                    this.newcompany.user_id = this.user_id;
                }
            },
        },
        mobilecorrect: {
            immediate: true,
            handler() {
                if (this.mobilecorrect == 1) {
                    this.newDetails.mobile = null;
                }
            },
        },
        emailcorrect: {
            immediate: true,
            handler() {
                if (this.emailcorrect == 1) {
                    this.newDetails.email = null;
                }
            },
        },
        addresscorrect: {
            immediate: true,
            handler() {
                if (this.addresscorrect == 1) {
                    this.newDetails.address = null;
                }
            },
        },
    },

    computed: {
        fieldRules() {
            return [v => !!v || this.$t("field_required")];
        },
        emailRules() {
            return [v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || this.$t("email_valid")];
        },

    },
    methods: {

        formatted_from_date(formatted_date) {
            this.newcompany.new_org_join_date = formatted_date;
        },

        saveEmpNewDetails() {
            if (this.$refs.form.validate()) {
                this.isBtnLoading = true;
                this.newDetails.user_id = this.user_id;
                axios
                    .post(
                        process.env.VUE_APP_API_URL_ADMIN +
                        "saveempnewdetails", this.newDetails
                    )
                    .then((res) => {
                        if (res.data.status == "S") {
                            this.flashMessage.success({
                                message: res.data.message,
                                time: 4000,
                                blockClass: "custom-block-class",
                            });
                            this.isBtnLoading = false;
                            this.fetchEmpnewDetails();
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
            }
        },

        saveEmpNewCompany() {
            this.isBtnLoading1 = true;
            this.newDetails.user_id = this.user_id;
            axios
                .post(
                    process.env.VUE_APP_API_URL_ADMIN +
                    "saveexitinterviewempdetails", this.newcompany
                )
                .then((res) => {
                    if (res.data.status == "S") {
                        this.flashMessage.success({
                            message: res.data.message,
                            time: 4000,
                            blockClass: "custom-block-class",
                        });
                        this.isBtnLoading1 = false;
                        this.fetchEmpnewDetails();
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

        fetchEmpnewDetails() {
            this.loader = true;
            axios
                .get(
                    process.env.VUE_APP_API_URL_ADMIN +
                    "fetchempnewdetails/" + this.user_id
                )
                .then((res) => {
                    if (res.data.status == "S") {
                        if(res.data.details !=null){
                         

                        this.newcompany.new_org_join_date = res.data.details.new_org_join_date;
                        this.newcompany.new_join_org_name = res.data.details.new_join_org_name;
                        this.newcompany.new_join_org_position = res.data.details.new_join_org_position;
                        if (res.data.details.new_email_id != null) {
                            this.emailcorrect = 0;
                            this.newDetails.email = res.data.details.new_email_id;
                        }
                        if (res.data.details.new_address != null) {
                            this.addresscorrect = 0;
                            this.newDetails.address = res.data.details.new_address;
                        }
                        if (res.data.details.new_contact_no != null) {
                            this.mobilecorrect = 0;
                            this.newDetails.mobile = res.data.details.new_contact_no;
                        }}
                        this.loader = false;
                                            } else {
                        this.flashMessage.error({
                            message: res.data.message,
                            time: 4000,
                            blockClass: "custom-block-class",
                        });
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
        fetchlookup() {
            axios
                .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
                    params: {
                        lookup_type: "SERIALISED_ITEM",
                    },
                })
                .then((response) => {
                    this.enableNovlookups = response.data.lookup_details;
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        fetchemployeeDetails() {
            this.loader = true;
            axios
                .get(
                    process.env.VUE_APP_API_URL_ADMIN +
                    "fetchuserbyidinempexit/" +
                    this.user_id
                )
                .then((res) => {
                    if (res.data.status == "S") {
                        this.user_array = res.data.user;
                        this.last_project_worked = res.data.last_project_worked;
                        this.newDetails.empNo = this.user_array.empno;
                        this.newcompany.empNo = this.user_array.empno;
                        this.fetchPrimaryManagerDetails();
                        this.loader = false;
                    } else {
                        this.flashMessage.error({
                            message: res.data.message,
                            time: 4000,
                            blockClass: "custom-block-class",
                        });
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
        fetchPrimaryManagerDetails() {
            this.loader = true;
            axios
                .get(
                    process.env.VUE_APP_API_URL_ADMIN +
                    "fetchprimarymanagerbyid/" +
                    this.user_array.id
                )
                .then((res) => {
                    if (res.data.status == "S") {
                        this.primary_manager_name = res.data.manager;
                        this.loader = false;
                    } else {
                        this.flashMessage.error({
                            message: res.data.message,
                            time: 4000,
                            blockClass: "custom-block-class",
                        });
                        this.loader = false;
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
        isNumber(evt) {
            evt = evt ? evt : window.event;
            var charCode = evt.which ? evt.which : evt.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                evt.preventDefault();
            }
            return true;
        },
    }
};
</script>

<style scoped>
.heading_emp_seperation_process {
    font-size: 14px;
    font-weight: 500;
    color: #6c5d5d;
    margin-bottom: 2px;
}

.body_emp_seperation_process {
    font-size: 14px;
    font-weight: 500;
    color: #403636;
}

.userdetails_in_emp_seperation_process {
    display: grid;
}

.userdetails_in_emp_seperation_process_address {
    display: grid;
    max-width: 280px;
    text-align: justify;
}

.v-stepper__label {
    min-width: 180px !important;
    text-align: center !important;
}

.vsteppercards {
    min-height: 260px;
}

.usernamegreenheading {
    color: #0ba10b;
    font-size: 16px;
    font-weight: 600;
    margin-left: 8px;
}

.project_work_heading {
    font-size: 17px;
    font-weight: 500;
}

.rowsavebton {
    position: absolute;
    bottom: 10px;
    right: 20px;
}

.vchipapproveonbehalf {
    margin-left: -10px;
}

.employeestatussubmission {
    font-size: 15px;
    font-weight: 500;
    color: #725d5d;
    margin-right: 15px;
}

.appliedleavediv {
    background-color: rgb(221, 18, 18);
    height: 100px;
    text-align: center;
    border-radius: 3px;
}

.approvedleavediv {
    background-color: rgb(85, 10, 248);
    height: 100px;
    text-align: center;
    border-radius: 3px;
}

.cancelledleavediv {
    background-color: rgb(188, 220, 12);
    height: 100px;
    text-align: center;
    border-radius: 3px;
}

.escalatedleavediv {
    background-color: rgb(12, 182, 12);
    height: 100px;
    text-align: center;
    border-radius: 3px;
}

.lopleavediv {
    background-color: rgb(89, 97, 93);
    height: 100px;
    text-align: center;
    border-radius: 3px;
}

.pendingleavediv {
    background-color: rgb(56, 224, 253);
    height: 100px;
    text-align: center;
    border-radius: 3px;
}

.rejectedleavediv {
    background-color: rgb(211, 113, 33);
    height: 100px;
    text-align: center;
    border-radius: 3px;
}

.waitingleavediv {
    background-color: rgb(9, 119, 174);
    height: 100px;
    text-align: center;
    border-radius: 3px;
}

.textleavetype {
    color: white;
    font-size: 15px;
}

.countleavetype {
    color: white;
    font-size: 25px;
}

.textinsideleavedetails {
    display: inline-grid;
    padding-top: 16px;
}

.radiabuttonclass .v-label {
    margin-bottom: 0px;
}
</style>