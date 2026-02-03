<template>
    <div class="main-20">
        <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
        <v-sheet>
            <v-row>
                <div class="timesheetdownloadtext">
                    {{ $t('timesheet_download') }}
                </div>
            </v-row>
            <hr>
            <v-form model="valid" ref="userform">
                <v-layout class="justify-space-between">
                    <v-flex md2 class="optiontextstyle pl-8 align-self-center">
                        {{ $t('option') }}
                    </v-flex>
                    <v-flex md4 class="pl-5 radio-item b h6">
                        <v-radio-group inline v-model="downloadoption" class="d-flex">
                            <v-radio label="Employee" class="radio_items" value="employee"></v-radio>
                            <v-radio label="Project" class="radio_items" value="project"></v-radio>
                            <v-radio label="Monthly" class="radio_items" value="monthly"></v-radio>
                        </v-radio-group>
                    </v-flex>
                    <v-flex md5>
                        <v-autocomplete v-if="selectedradiooption === 'Employee'" outlined v-bind:label="$t('employee')"
                            v-model="activeEmpID" :items="ActiveEmployees" item-value="id" item-text="Full_Code" dense
                            @change="fetch_project_assigned(activeEmpID)" class="required_field pt-3 pr-11 text-left"
                            :rules="fieldRules">
                        </v-autocomplete>

                        <v-autocomplete v-if="selectedradiooption === 'Projects'"
                            class="required_field pt-3 pr-11 text-left" :rules="fieldRules" outlined
                            v-bind:label="$t('project')" dense v-model="PmoprojectID" :items="PmoProjects" item-value="slug"
                            item-text="project_name" @change="projectResourcecheck(PmoprojectID)">
                        </v-autocomplete>

                        <v-menu v-if="selectedradiooption === 'Month'" v-model="menu" :close-on-content-click="false"
                            :return-value.sync="date" transition="scale-transition" offset-y max-width="290px"
                            min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="monthSelectedFormatted" v-bind:label="$t('month')"
                                    append-icon="mdi-calendar" outlined dense readonly v-bind="attrs" v-on="on"
                                    class="required_field pt-3 pr-11 text-left" :rules="fieldRules"></v-text-field>
                            </template>
                            <v-date-picker v-model="monthSelected" type="month" no-title
                                :max="new Date().toISOString().substr(0, 10)" @click:month="$refs.menu.save(date)"
                                scrollable>
                            </v-date-picker>

                        </v-menu>

                    </v-flex>
                </v-layout>

                <v-layout class="justify-space-between">
                    <v-flex md2 class="optiontextstyle pl-8 align-self-center">
                        <span v-if="downloadoption === 'employee'">{{ $t('project_assigned') }}</span>
                        <span v-if="downloadoption === 'project'">{{ $t('project_resource') }}</span>
                        <span v-if="downloadoption === 'monthly'">{{ $t('organisation') }}</span>
                    </v-flex>
                    <v-flex md4>
                        <v-autocomplete v-if="selectedradiooption === 'Employee'" class="required_field pl-9 pr-15"
                            :rules="fieldRules" outlined dense :items="assignedProjects" item-value="id"
                            item-text="project_name" v-bind:label="$t('project_assigned')" v-model="assignedprojectID">
                        </v-autocomplete>

                        <v-autocomplete v-if="selectedradiooption === 'Projects'" class="required_field pl-9 pr-15"
                            :rules="fieldRules" outlined dense :items="projectResource" item-value="emp_id"
                            item-text="hr_emp_id.Full_Code" v-bind:label="$t('project_resource')"
                            v-model="projectResourceID"></v-autocomplete>

                        <v-autocomplete v-if="selectedradiooption === 'Month'" class="required_field pl-9 pr-15"
                            :rules="fieldRules" outlined dense :items="organisationarray" item-value="id"
                            item-text="shortname" v-bind:label="$t('organisation')"
                            v-model="organisationID"></v-autocomplete>
                    </v-flex>


                    <v-flex md5>
                        <v-menu v-if="downloadoption === 'employee' || downloadoption === 'project'" ref="menu"
                            v-model="menu" :close-on-content-click="false" :return-value.sync="date"
                            transition="scale-transition" offset-y max-width="290px" min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="monthSelectedFormatted" v-bind:label="$t('month')"
                                    append-icon="mdi-calendar" outlined dense readonly v-bind="attrs" v-on="on"
                                    class="required_field pr-11" :rules="fieldRules"></v-text-field>
                            </template>

                            <v-date-picker v-model="monthSelected" type="month" no-title
                                :max="new Date().toISOString().substr(0, 10)" @click:month="$refs.menu.save(date)"
                                scrollable>
                            </v-date-picker>

                        </v-menu>
                    </v-flex>
                </v-layout>
            </v-form>
            <v-layout>
                <v-spacer></v-spacer>
                <!-- <vue-excel-xlsx :data="empTimesheet" :columns="columns" :file-name="'timesheet'" :file-type="'xlsx'"
                    :sheet-name="'sheetname'">
                    <button id="downloaddummybutton">download dummy</button>
                </vue-excel-xlsx> -->
                <!-- document. getElementById("clickMe"). click(); -->
                <v-btn @click="downloadTimesheet" color="btn mr-2 mb-2 hover_shine add_new" small :disabled="isBtnLoading"
                    class="mr-11 mb-5">{{
                        $t('download')
                    }} <b-spinner small v-if="isBtnLoading"></b-spinner></v-btn>
            </v-layout>
        </v-sheet>
        <div id="hiddentableexcel_format">
            <table border="1" ref="exportable_table">
                <thead>

                    <tr v-if="downloadoption == 'employee' || downloadoption == 'project'">
                        <th>Resource</th>
                        <td>
                            <span v-if="empName != null">{{ empName.firstname }} {{ empName.lastname }}</span>
                        </td>
                        <th>Month</th>
                        <td>({{ monthSelected | formatMonth }})</td>
                    </tr>
                    <tr v-else>
                        <th>Month</th>
                        <td colspan="4">({{ monthSelected | formatMonth }})</td>
                    </tr>
                    <tr v-if="downloadoption == 'employee' || downloadoption == 'project'">
                        <th>Total No of working days</th>
                        <td>
                            {{ totalWorkdays }}
                        </td>
                        <th>No of days worked</th>
                        <td>{{ countworkdays }}</td>
                    </tr>
                    <tr v-else>
                        <th>Total No of working days</th>
                        <td colspan="4">
                            {{ totalWorkdays }}
                        </td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <th>SL No</th>
                        <th>Task</th>
                        <th>Date</th>
                        <th>No of Hours</th>
                        <th v-if="downloadoption == 'monthly'">Resource</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(tims, index) in empTimesheet" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ tims.task_name }}</td>
                        <td>{{ tims.submitted_date | formatDate }}</td>
                        <td>{{ tims.no_of_hrs }}</td>
                        <th v-if="downloadoption == 'monthly'">{{ tims.employee_details.firstname }} {{
                            tims.employee_details.lastname }}</th>
                    </tr>
                </tbody>
            </table>
            <input type="text" v-model="name">
            <button id="downloaddummybutton" @click="ExportExcel('xlsx')">Export table to excel xlsx</button>
        </div>
    </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
import VueExcelXlsx from "vue-excel-xlsx";
import Vue from "vue";
Vue.use(VueExcelXlsx);
export default {
    components: {
        VueElementLoading,
    },
    computed: {
        fieldRules() {
            return [(v) => !!v || this.$t("field_required")];
        },
    },
    props: ["org_id", "user_details"],
    data: () => ({
        name: '',
        menu: false,
        valid: true,
        date: new Date().toISOString().substr(0, 7),
        downloadoption: 'employee',
        selectedradiooption: "Employee",
        loader: false,
        activeEmpID: '',
        user_site_id: '',
        user_org_id: '',
        assignedprojectID: '',
        monthSelected: '',
        monthSelectedFormatted: '',
        PmoprojectID: '',
        projectResourceID: '',
        organisationID: '',
        projectResource: [],
        assignedProjects: [],
        PmoProjects: [],
        ActiveEmployees: [],
        organisationarray: [],
        isBtnLoading: false,
        empTimesheet: [],
        empName: [],
        totalWorkdays: '',
        countworkdays: '',
        columns: [
            {
                label: "Sl No",
                field: "sl_no",
            },
            {
                label: "Employee Name",
                field: "employee_details.Full_Code",
            },
            {
                label: "Project",
                field: "project_details.project_name",
            },
            {
                label: "Task",
                field: "task_name",
            },
            {
                label: "Activity",
                field: "activity_name",
            },
            {
                label: "Task Status",
                field: "task_status",
            },
            {
                label: "Submitted On",
                field: "submitted_date",
            }
        ],
    }),
    mounted() {
        this.fetchPmoProjects();
        const recaptchaScript = document.createElement("script");
        recaptchaScript.setAttribute(
            "src",
            "https://unpkg.com/xlsx@0.15.1/dist/xlsx.full.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.min.js"
        );
        document.head.appendChild(recaptchaScript);

    },
    watch: {
        downloadoption: {
            immediate: true,
            handler() {
                this.radiooptioncheck();
                this.projectResourceID = '';
                this.PmoprojectID = '';
                this.monthSelected = '';
                this.monthSelectedFormatted = '';
                this.assignedprojectID = '0';
                this.activeEmpID = '';
                this.organisationID = '';
                this.empTimesheet = [];
            },
        },
        user_details: {
            immediate: true,
            handler() {
                this.user_org_id = this.user_details.org_id,
                this.user_site_id = this.user_details.site_id
                this.fetchActiveEmployees();
            },
        },
        monthSelected: {
            immediate: true,
            handler() {
                if (this.monthSelected) {
                    // this.monthSelectedFormatted = this.monthSelected;
                    var dateformat = new Date(this.monthSelected);
                    this.monthSelectedFormatted = dateformat.toLocaleString('default', { month: 'short' }) + "-" + dateformat.getFullYear();
                }
            },
        },

    },
    methods: {
        ExportExcel(type, fn, dl) {
            var elt = this.$refs.exportable_table;
            var wb = XLSX.utils.table_to_book(elt, { sheet: "Sheet JS" });
            return dl ?
                XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }) :
                XLSX.writeFile(wb, fn || (('Timesheet' + '.' || 'SheetJSTableExport.') + (type || 'xlsx')));
        },

        radiooptioncheck() {
            if (this.downloadoption === 'employee') {
                this.selectedradiooption = "Employee";
                this.fetchActiveEmployees();
            }
            if (this.downloadoption === 'project') {
                this.selectedradiooption = "Projects";
                this.fetchPmoProjects();
            }
            if (this.downloadoption === 'monthly') {
                this.selectedradiooption = "Month";
                this.fetchOrganisation();
            }
        },
        fetchActiveEmployees() {
            this.loader = true;
            axios
                .get(process.env.VUE_APP_API_URL_ADMIN + "fetchactiveuser/", {
                    params: {
                        org_id: this.user_org_id,
                        site_id: this.user_site_id
                    }
                })
                .then((res) => {
                    this.ActiveEmployees = res.data.usersdata;
                    this.loader = false;
                })
                .catch((err) => {
                    this.flashMessage.error({
                        message: this.$t("something_went_wrong"),
                        time: 4000,
                        blockClass: "custom-block-class",
                    });
                    console.log(" error" + err);
                    this.loader = false;
                });
        },
        fetchPmoProjects() {
            this.loader = true;
            axios
                .get(process.env.VUE_APP_API_URL_ADMIN + "fetchpmoprojects")
                .then((res) => {
                    this.PmoProjects = res.data.projects;
                    this.loader = false;
                })
                .catch((err) => {
                    this.flashMessage.error({
                        message: this.$t("something_went_wrong"),
                        time: 4000,
                        blockClass: "custom-block-class",
                    });
                    console.log(" error" + err);
                    this.loader = false;
                });
        },
        fetch_project_assigned(id) {
            this.loader = true;
            this.assignedProjects = [];
            axios
                .get(
                    process.env.VUE_APP_API_URL_ADMIN +
                    "fetch_assigned_project/" + id
                )
                .then((res) => {
                    if (res.data.status == 'S') {
                        this.assignedProjects = res.data.assigned_project;
                        if (this.assignedProjects.length > 1) {
                            this.assignedProjects.splice(0, 0, {
                                id: '0',
                                slug: 'all_projects',
                                project_name: "All projects",
                            });
                        }
                        this.loader = false;
                    }
                    else {
                        this.flashMessage.error({
                            message: this.$t("something_went_wrong"),
                            time: 4000,
                            blockClass: "custom-block-class",
                        });
                        this.loader = false;
                    }
                })
                .catch((err) => {
                    console.log("this error" + err);
                    this.loader = false;
                });
        },
        projectResourcecheck(slug) {
            this.projectResource = [];
            this.loader = true;
            axios
                .get(
                    process.env.VUE_APP_API_URL_ADMIN +
                    "getallresourcebyslugforproject/" + slug
                )
                .then((res) => {
                    this.projectResource = res.data.resources;
                    this.loader = false;
                })
                .catch((err) => {
                    console.log("this error" + err);
                    this.loader = false;
                });
        },

        fetchOrganisation() {
            this.loader = true;
            axios.
                get(
                    process.env.VUE_APP_API_URL_ADMIN +
                    "getorganisationofhr/" + this.org_id
                )
                .then((res) => {
                    this.organisationarray = res.data.org;
                    this.loader = false;
                })
                .catch((err) => {
                    console.log("this error" + err);
                    this.loader = false;
                });
        },

        downloadTimesheet() {
            if (this.$refs.userform.validate()) {
                this.isBtnLoading = true;
                this.totalWorkdays = '';
                this.countworkdays = '';
                axios.
                    post(
                        process.env.VUE_APP_API_URL_ADMIN +
                        "downloadtimesheet", {
                        selectedOption: this.downloadoption,
                        EmployeeID: this.activeEmpID,
                        projectID: this.assignedprojectID,
                        monthSelected: this.monthSelected,
                        projectSelected: this.PmoprojectID,
                        projectResourse: this.projectResourceID,
                        orgSelected: this.organisationID,
                    }
                    )
                    .then((res) => {
                        if (res.data.status == 'S') {
                            this.empTimesheet = res.data.empTimesheet;
                            this.empName = res.data.empname;
                            this.totalWorkdays = res.data.totalWorkdays;
                            this.countworkdays = res.data.countworkdays;
                            console.log('hh', res);
                            this.isBtnLoading = false;
                            setTimeout(this.clickDownload, 200);
                        }
                        if (res.data.status == 'ERR') {
                            this.isBtnLoading = false;
                            alert('no data found');
                            this.flashMessage.error({
                                message: res.data.message,
                                time: 4000,
                                blockClass: "custom-block-class",
                            });
                        }
                        else {
                            this.flashMessage.error({
                                message: this.$t("something_went_wrong"),
                                time: 4000,
                                blockClass: "custom-block-class",
                            });
                            this.isBtnLoading = false;
                        }
                    })

                    .catch((err) => {
                        this.flashMessage.error({
                            message: this.$t("something_went_wrong"),
                            time: 4000,
                            blockClass: "custom-block-class",
                        });
                        console.log("this error" + err);
                        this.isBtnLoading = false;
                    });
            }
        },
        clickDownload() {
            document.getElementById("downloaddummybutton").click();
        }
    },

};
</script>

<style scoped>
.timesheetdownloadtext {
    padding: 17px;
    font-size: 16px;
    font-weight: 700;
    padding-left: 35px;
    color: rgb(84, 77, 77);
}

.radio-item /deep/ .v-input--radio-group__input {
    flex-direction: row;
    align-self: center;
}

.radio-item /deep/ .v-label {
    margin-bottom: 0px !important;
}

.radio_items {

    margin-bottom: 0px !important;
    padding-left: 13px;
    padding-right: 13px;
}

.optiontextstyle {
    font-size: 14px;
    font-weight: 600;
    padding-bottom: 10px;
    color: rgb(81, 75, 75);
}

#downloaddummybutton {
    display: none;
}

#hiddentableexcel_format {
    display: none;
}
</style>