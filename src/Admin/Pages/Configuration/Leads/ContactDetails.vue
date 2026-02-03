<template>
    <div class="container-fluid mt-3 p-0">
        <div class="mb-3 mx-auto">
            <div class="card-header">
                <div class="card-header-tab">
                    <div class="card-header-title font-size-lg text-capitalize titlewrap">
                        {{ $t("create_contact") }}
                    </div>
                </div>
            </div>
            <div class="card-body">
                <v-form ref="form" v-model="valid">
                    <v-layout>
                        <v-flex xs12 md3 pl-2>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-on="on" v-model="leadDetails.contact_name"
                                        v-bind:label="$t('contact_name')" required outlined dense :rules="fieldRules"
                                        class="required_field" @blur="passvalue"></v-text-field>
                                </template>
                                <span>{{ $t("contact_name") }}</span>
                            </v-tooltip>
                        </v-flex>
                        <v-flex xs12 md4 pl-2>
                            <div class="row">
                                <div class="col-md-12">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-text-field dense outlined v-bind:label="$t('country_code')" v-on="on"
                                                @keypress.native="isNumber($event)" maxlength="5" @blur="passvalue" required
                                                :rules="fieldRules" class="required_field input_field" hide-details
                                                v-model="leadDetails.phone_code"></v-text-field>
                                        </template>
                                        <span>{{ $t("country_code") }}</span>
                                    </v-tooltip>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-text-field v-model="leadDetails.contact_phone"
                                                class="required_field select_field" v-bind:label="$t('contact_no')"
                                                maxlength="15" @blur="passvalue" v-on="on" :rules="fieldRules"
                                                @keypress.native="isNumber($event)" outlined dense></v-text-field>
                                        </template>
                                        <span>{{ $t("contact_no") }}</span>
                                    </v-tooltip>
                                </div>
                            </div>
                        </v-flex>
                        <v-flex xs12 md3 pl-2>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-on="on" v-model="leadDetails.email" v-bind:label="$t('email')" outlined
                                        @blur="passvalue" :rules="[...fieldRules, ...emailRules]" dense
                                        class="required_field"></v-text-field>
                                </template>
                                <span>{{ $t("email") }}</span>
                            </v-tooltip>
                        </v-flex>
                        <v-flex xs12 md2 pl-2>
                            <v-checkbox v-model="leadDetails.is_primary" :label="$t('is_primary')"
                                class="leadprimarycheckbox required_field mt-0"></v-checkbox>
                        </v-flex>
                    </v-layout>
                </v-form>
            </div>
        </div>
    </div>
</template>
    
<script>

export default {
    props: ['checkvalidation'],
    components: {
    },
    data: () => ({
        valid: true,
        loader: false,
        isBtnLoading: false,
        isDisabled: false,
        openMedia: false,

        leadDetails: {
            id: 0,
            contact_name: "",
            phone_code: "",
            contact_phone: "",
            contact_email: "",
            is_primary: "",
        },

        items: [],
    }),

    computed: {
        fieldRules() {
            return [(v) => !!v || this.$t("field_required")];
        },
        emailRules() {
            return [
                (v) =>
                    !v ||
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                    this.$t("email_valid"),
            ];
        },
     
    },

    created() { },
    watch: {
        checkvalidation: {
            immediate: true,
            handler() {
                this.validationcheck();
            },
        },
    },

    methods: {
        passvalue() {
            this.$emit("inputValue", this.leadDetails);
        },
        validationcheck() {
            if (this.$refs.form.validate()) {
                this.$emit("validation", 'true');
            }
            else{
                this.$emit("validation", 'false');
            }
        },

        clear() {
            this.$refs.form.reset();
        },



        isNumber(evt) {
            evt = evt ? evt : window.event;
            var charCode = evt.which ? evt.which : evt.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                evt.preventDefault();
            }
            return true;
        },
    },
};
</script>
<style scoped>
.select_field {
    position: absolute;
    right: 9px !important;
    top: 12px;
    width: 62%;
    height: 20px !important;
}

.select_field /deep/ .v-label--active {
    background: white;
    padding: 0px 12px 0px 12px;
}

.leadprimarycheckbox /deep/ .v-label {
    margin-top: 6px !important;
}

.select_field /deep/ .v-input__control {
    padding-right: 3px !important;
}
</style>