<template>
  <div class="main-20">
    <div class="pa-5" v-if="$route.query.view == 'myprofile'">
      <page-title
        :heading="$t('myprofile')"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <div class="row align-items-center" v-else>
      <div class="col-md-7 pa-5">
        <page-title
          :heading="$t('userview')"
          :google_icon="google_icon"
        ></page-title>
      </div>
      <div
        class="col-md-5 text-end d-flex justify-content-end pr-27"
        v-if="getuserid"
      >
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div class="d-inline-block mr-2">
              <v-btn
                v-on="on"
                small
                class="cancel-btn"
                color="secondary"
                @click="$router.go(-1)"
              >
                {{ $t("cancel") }}
              </v-btn>
            </div>
          </template>
          <span>{{ $t("cancel") }}</span>
        </v-tooltip>
        <v-btn
          v-if="
            $route.query.view == 'userview' && user_info.user.userdetails.status
          "
          class="hover_shine btn bg-primary text-white mr-2"
          @click="sendCredential(user_info.user.userdetails.email)"
          small
        >
          <span class="spanactivesize">{{ $t("send_credential") }}</span>
        </v-btn>

        <!-- @click="changeStatus(user_info.user.id)" -->

        <v-btn
          v-if="$route.query.view == 'userview'"
          @click="handleClick('assign_role')"
          small
          class="mr-2 bg-primary text-white hover_shine btn"
        >
          <span class="spanactivesize">{{ $t("assign_role") }}</span>
        </v-btn>
        <v-btn
          v-if="$route.query.view == 'userview' && getuserid"
          class="hover_shine btn"
          style="cursor: context-menu"
          small
          v-bind:class="[
            user_info.user.userdetails.status == 1 ? 'success' : 'warning',
          ]"
        >
          <span
            v-if="user_info.user.userdetails.status == 1"
            class="spanactivesize"
            >{{ $t("active") }}</span
          >
          <span v-else class="spanactivesize">{{ $t("inactive") }}</span>
        </v-btn>
      </div>
    </div>

    <div class="container-fluid">
      <VueElementLoading
        :active="loader"
        spinner="bar-fade-scale"
        color="var(--primary)"
      />
      <div class="row">
        <div class="col-md-8">
          <v-card class="card-height">
            <div class="row">
              <div class="col-md-3">
                <div class="profilepic">
                  <img
                    class="profilepic__image"
                    v-if="user_info.user.profile_pic"
                    :src="envImagePath + user_info.user.profile_pic"
                    alt
                  />
                  <img
                    v-else
                    class="profilepic__image"
                    src="@/assets/images/default-user-profile-picture.png"
                  />
                  <div class="profilepic__content">
                    <span class="profilepic__icon">
                      <v-btn icon>
                        <v-icon @click="upload_Image" color="grey lighten-1">
                          mdi-camera
                        </v-icon>
                      </v-btn></span
                    >
                    <span class="profilepic__text">Edit Profile</span>
                  </div>
                  <v-layout style="display: none">
                    <v-flex xs12>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <span v-on="on">
                            <!-- :image="profile_details.profile_pic" -->
                            <MediaSelect
                              :label="'Image'"
                              folder="userprofiles"
                              :resizeheight="100"
                              :resizewidth="100"
                              @updateImage="updateImage"
                              :upload_profile="openMedia"
                            >
                            </MediaSelect>
                          </span>
                        </template>
                        <span>{{ $t("file_input") }}</span>
                      </v-tooltip>
                    </v-flex>
                  </v-layout>
                </div>
              </div>
              <div class="col-md-9">
                <div class="name-border">
                  <div class="d-flex justify-content-between">
                    <div>
                      <div class="name-fonts">
                        {{ user_info.user.firstname }}
                        {{ user_info.user.lastname }}
                      </div>
                      <div class="designation-fonts">
                        {{ user_info.user.designation.designation }}
                      </div>
                    </div>
                    <div class="mr-2">
                      <img
                        src="@/assets/images/male_icon.jpg"
                        v-if="user_info.user.gender == 'Male'"
                        height="40"
                        class="icon_radius"
                      />
                      <img
                        src="@/assets/images/female_icon.jpg"
                        height="40"
                        class="icon_radius"
                        v-else
                      />
                      <span class="emp-no-font">{{
                        user_info.user.empno
                      }}</span>
                    </div>
                  </div>
                  <div
                    v-if="user_info.user.gender == 'Male'"
                    class="gender_font"
                  >
                    {{ $t("male") }}
                  </div>
                  <div
                    v-else-if="user_info.user.gender == 'Female'"
                    class="gender_font"
                  >
                    {{ $t("female") }}
                  </div>
                  <div v-else class="gender_font">
                    {{ $t("others") }}
                  </div>
                </div>
                <!-- {{user_info}} -->
                <div class="d-flex mt-2 justify-content-between">
                  <div>
                    <div>
                      <i
                        class="fa fa-envelope fa-font-size email-color"
                        aria-hidden="true "
                      ></i>
                      <span class="em-font"
                        >{{ user_info.user.user_email }}
                      </span>
                    </div>
                    <div class="mt-1">
                      <i
                        class="fa fa-phone fa-font-size phone-color"
                        aria-hidden="true"
                      ></i>
                      <span class="em-font">{{ user_info.user.phone }} </span>
                    </div>
                    <div class="mt-1">
                      <i
                        class="fa fa-calendar fa-font-size jod-color"
                        aria-hidden="true"
                      ></i>
                      <span class="em-font"
                        >{{ user_info.user.Joining_date | formatDate }} (DOJ)
                      </span>
                    </div>
                    <div class="mt-1">
                      <i
                        class="fa fa-calendar fa-font-size dob-color"
                        aria-hidden="true"
                      ></i>
                      <span class="em-font"
                        >{{ user_info.user.dob | formatDate }} (DOB)
                      </span>
                    </div>
                  </div>
                  <!-- {{user_info.user.reporting_to   user_info.user.reporting_to.empnamefetch.profile_pic}} -->
                  <!-- {{user_info.user.reporting_to}} -->
                  <div class="mr-3 font-weight-bold">
                    {{ $t("reporting_to") }}
                    <div class="mt-1 reporting-border">
                      <v-avatar size="35">
                        <v-img
                          v-if="
                            user_info.user.reporting_to.empnamefetch &&
                            user_info.user.reporting_to.empnamefetch.profile_pic
                          "
                          :src="
                            envImagePath +
                            user_info.user.reporting_to.empnamefetch.profile_pic
                          "
                          alt
                        >
                        </v-img>

                        <img
                          v-else-if="
                            user_info.user.reporting_to.empnamefetch &&
                            user_info.user.reporting_to.empnamefetch
                              .profile_pic == null
                          "
                          src="@/assets/images/default-user-profile-picture.png"
                          alt
                        />
                        <img
                          v-else
                          :src="envImagePath + user_info.user.profile_pic"
                          alt
                        />
                      </v-avatar>
                      <span
                        class="reporting-name-font"
                        v-if="user_info.user.reporting_to.empnamefetch"
                        >{{
                          user_info.user.reporting_to.empnamefetch.Full_Code
                        }}
                      </span>
                      <span v-else class="reporting-name-font">{{
                        $t("self")
                      }}</span>
                    </div>
                  </div>
                </div>

                <div class="mr-2 text-end" style="position:absolute;right:14px;bottom:5%;">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        medium
                        color="primary"
                        dark
                        v-on="on"
                        class="vicon_llink"
                        @click="
                          edituserDetails($route.query.slug, $route.query.view)
                        "
                      >
                        mdi-pencil-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("edit") }}</span>
                  </v-tooltip>
                </div>
              </div>
            </div>
          </v-card>
        </div>
        <div class="col-md-4">
            <DataCard :user_info="user_info"></DataCard>
        </div>
      </div>
    </div>
    <div class="px-4">
      <div class="row" v-if="getuserid">
        <div class="col-md-12 col-sm-12 col-lg-12">
          <div class="card">
            <v-tabs class="vtabmainuserview" v-if="user_id" show-arrows>
              <tabs
                :tabs="
                  login_user.hr_employee.emprole_name.includes('HR')
                    ? tabs
                    : tabs1
                "
                :currentTab="currentTab"
                :wrapper-class="'shadow-tabs inline-tabs'"
                style="display: inline-flex"
                :tab-class="'tab-item'"
                :tab-active-class="'tab-item-active'"
                :line-class="'tab-item-line'"
                @onClick="handleClick"
              />
            </v-tabs>
            <!-- <div v-if="currentTab === 'job'">
              <v-sheet class="vsheetbtab" v-if="showuserdetails_job">
                <current-job
                  :user_id="job_user_id"
                  :view="$route.query.view"
                  :user_status="user_info.user.userdetails.status"
                  :status="user_status"
                  @updateUserStatus="updateUserStatus"
                />
              </v-sheet>
            </div> -->
            <div v-if="currentTab === 'personal'">
              <v-sheet
                class="vsheetbtabpersonal pb-6"
                v-if="showuserdetails_personal"
              >
                <v-tabs color="#3f6ad8" left>
                  <v-tab
                    ><span class="tab-title"
                      ><i class="fa fa-envelope pl-3 mr-2"></i>
                      {{ $t("contact_details") }}
                    </span></v-tab
                  >
                  <v-tab
                    ><i class="fa fa-vcard pl-2 mr-1" aria-hidden="true"></i
                    ><span class="tab-title">{{ $t("personal_details") }}</span>
                  </v-tab>
                  <v-tab
                    ><span class="tab-title"
                      ><i class="fa fa-vcard pl-2 mr-2" aria-hidden="true"></i
                      >{{ $t("family_details") }}</span
                    ></v-tab
                  >
                  <v-tab
                    ><span class="tab-title"
                      ><i class="fa fa-language pl-3 mr-2"></i>
                      {{ $t("languages_known") }}
                    </span></v-tab
                  >

                  <v-tab-item v-if="showuserdetails_personal">
                    <contactaddressdetails
                      :user_id="personal_user_id"
                      :view="$route.query.view"
                      :status="user_status"
                      @getPermanentAddress="getPermanentAddress"
                    />
                  </v-tab-item>
                  <v-tab-item v-if="showuserdetails_personal">
                    <CurrentJob
                      :user_id="job_user_id"
                      :view="$route.query.view"
                      :user_status="user_info.user.userdetails.status"
                      :status="user_status"
                      @updateUserStatus="updateUserStatus"
                    />
                  </v-tab-item>
                  <v-tab-item v-if="showuserdetails_personal">
                    <familydetails
                      :user_id="personal_user_id"
                      :view="$route.query.view"
                      :status="user_status"
                    />
                  </v-tab-item>
                  <v-tab-item v-if="showuserdetails_personal">
                    <languages-known
                      :user_id="personal_user_id"
                      :view="$route.query.view"
                      :status="user_status"
                    />
                  </v-tab-item>
                </v-tabs>
              </v-sheet>
            </div>
            <div v-if="currentTab === 'education'">
              <v-sheet class="vsheetbtab" v-if="showuserdetails_education">
                <educationdetails
                  :user_id="education_user_id"
                  :view="$route.query.view"
                  :status="user_status"
                />
              </v-sheet>
            </div>
            <div v-if="currentTab === 'reporting_to'">
              <v-sheet class="vsheetbtab" v-if="showuserdetails_rep_to">
                <reporting-to
                  :user_id="reporting_user_id"
                  :view="$route.query.view"
                  :status="user_status"
                />
              </v-sheet>
            </div>
            <div v-if="currentTab === 'leave_details'">
              <v-sheet class="vsheetbtab" v-if="showuserdetails_leave">
                <leave-details
                  :user_id="leave_user_id"
                  :view="$route.query.view"
                  :status="user_status"
                />
              </v-sheet>
            </div>
            <div v-if="currentTab === 'job_history'">
              <v-sheet class="vsheetbtab" v-if="showuserdetails_job_history">
                <jobhistory
                  :user_id="job_history_user_id"
                  :view="$route.query.view"
                  :status="user_status"
                  :joining_date="user_info.user.Joining_date"
                />
                <reference-details
                  :user_id="job_history_user_id"
                  :view="$route.query.view"
                  :status="user_status"
                />
              </v-sheet>
            </div>
            <div v-if="currentTab === 'travel_history'">
              <v-sheet class="vsheetbtab" v-if="showuserdetails_travel">
                <travel-history
                  :user_id="travel_user_id"
                  :view="$route.query.view"
                  :status="user_status"
                  :user_name="user_name"
                />
              </v-sheet>
            </div>
            <div v-if="currentTab === 'documents'">
              <v-sheet class="vsheetbtab" v-if="showuserdetails_document">
                <EmpIdProofs
                  :user_id="document_user_id"
                  :view="$route.query.view"
                  :status="user_status"
                />
              </v-sheet>
            </div>
            <div v-if="currentTab === 'employee_skills'">
              <v-sheet class="vsheetbtab" v-if="showuserdetails_skills">
                <employeeskills
                  :user_id="skills_user_id"
                  :view="$route.query.view"
                  :status="user_status"
                />
              </v-sheet>
            </div>
            <div v-if="currentTab === 'compliance'">
              <v-sheet
                class="vsheetbtabpersonal pb-6"
                v-if="showuserdetails_compliance"
              >
                <v-tabs color="#3f6ad8" left>
                  <v-tab
                    ><span class="tab-title">
                      <i class="fa fa-money pl-3 mr-2"></i
                      >{{ $t("bank_details") }}
                    </span></v-tab
                  >
                  <v-tab
                    ><span class="tab-title">
                      <i class="fa fa-money pl-3 mr-2"></i
                      >{{ $t("epfo_account_details") }}
                    </span></v-tab
                  >
                  <v-tab
                    ><span class="tab-title">
                      <i class="fa fa-folder-o pl-3 mr-2"></i
                      >{{ $t("esic_details") }}
                    </span></v-tab
                  >
                  <v-tab-item v-if="showuserdetails_compliance">
                    <EmpBankDetails
                      :user_id="compliance_user_id"
                      :view="$route.query.view"
                      :status="user_status"
                    />
                  </v-tab-item>
                  <v-tab-item v-if="showuserdetails_compliance">
                    <EmpEpfoAccountDetails
                      :user_id="compliance_user_id"
                      :view="$route.query.view"
                      :status="user_status"
                    />
                  </v-tab-item>
                  <v-tab-item v-if="showuserdetails_compliance">
                    <EmployeeEsicDetails
                      :user_id="compliance_user_id"
                      :view="$route.query.view"
                      :status="user_status"
                    />
                  </v-tab-item>
                </v-tabs>
              </v-sheet>
              <!-- <v-sheet class="vsheetbtab" v-if="showuserdetails_compliance">
                <EmpBankDetails :user_id="compliance_user_id" :view="$route.query.view" :status="user_status" />
                <EmpEpfoAccountDetails :user_id="compliance_user_id" :view="$route.query.view" :status="user_status" />
                <EmployeeEsicDetails :user_id="compliance_user_id" :view="$route.query.view" :status="user_status" />
              </v-sheet> -->
            </div>
            <div v-if="currentTab === 'assign_role'">
              <v-sheet class="vsheetbtab" v-if="showuserdetails_assign_role">
                <assigningnewrole
                  :user_id="assign_role_user_id"
                  :view="$route.query.view"
                  :status="user_status"
                />
              </v-sheet>
            </div>
            <div v-if="currentTab === 'emp_seperation_processcompliance'">
              <v-sheet class="vsheetbtab">
                <!-- <EmpSeperationProcess :user_id="exit_process_user_id" :view="$route.query.view" :status="user_status"
                  :user_slug="user_info.user.slug" /> -->

                <div
                  class="col-md-7 maindivfortravelradio mt-2"
                  v-if="employee_seperation == 0"
                >
                  <h6 class="usernamedisplaytravel mr-2 mt-1">
                    <b>{{ $t("initiate_emp_seperation_process") }}</b>
                  </h6>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        small
                        v-on="on"
                        class="mr-2 ml-1 primary mb-1"
                        :disabled="isBtnLoading1"
                        @click="changeExitStatus"
                        >{{ $t("ok") }}
                        <b-spinner
                          :disabled="isBtnLoading1"
                          small
                          v-if="isBtnLoading1"
                        ></b-spinner>
                      </v-btn>
                    </template>
                    <span>{{ $t("exit_interview_process") }}</span>
                  </v-tooltip>
                </div>
                <div
                  class="col-md-12 maindivfortravelradio mt-2"
                  v-if="employee_seperation == 1"
                >
                  <h6 class="usernamedisplaytravel mr-2 mt-1">
                    <b>{{ $t("continue_seperation_process") }}</b>
                  </h6>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        small
                        v-on="on"
                        class="mr-2 ml-1 primary mb-1"
                        :disabled="isBtnLoading1"
                        @click="routeToexitInterview"
                        >{{ $t("continue") }}
                        <b-spinner
                          :disabled="isBtnLoading1"
                          small
                          v-if="isBtnLoading1"
                        ></b-spinner>
                      </v-btn>
                    </template>
                    <span>{{ $t("exit_interview_process") }}</span>
                  </v-tooltip>
                  <v-spacer></v-spacer>
                  <v-tooltip bottom v-if="employee_seperation == 1">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        small
                        v-on="on"
                        class="mr-2 ml-1 error mb-1"
                        @click="showEndExitinterview = true"
                        >{{ $t("end/discountinue") }}
                      </v-btn>
                    </template>
                    <span>{{ $t("end/discountinue") }}</span>
                  </v-tooltip>
                </div>
                <hr v-if="Emp_seperation_array" />
                <div class="row pb-3" v-if="Emp_seperation_array">
                  <div class="col-md-12" v-if="Emp_seperation_array.remark">
                  <div class="title_heading">
                    {{ $t("emp_separation_process_cancel_remark") }}
                  </div>
                  <div class="values">
                    {{ Emp_seperation_array.remark }}
                  </div>
                </div>
                  <div class="col-md-3" v-if="Emp_seperation_array.resigned_date">
                  <div class="title_heading">
                    {{ $t("applied_resignation_date") }}
                  </div>
                  <div class="values">
                    {{ Emp_seperation_array.resigned_date | formatDate}}
                  </div>
                </div>
                  <div class="col-md-3" v-if="Emp_seperation_array.created_at">
                  <div class="title_heading">
                    {{ $t("cancellation_date") }}
                  </div>
                  <div class="values">
                    {{ Emp_seperation_array.created_at | formatDate}}
                  </div>
                </div>
                </div>

               
              </v-sheet>

              <v-dialog
                v-model="endseperation_dialog"
                persistent
                max-width="600px"
              >
                <v-toolbar color="primary">
                  <span class="headline" style="color: white">{{
                    $t("employee_seperation_remark")
                  }}</span>
                  <v-spacer></v-spacer>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        @click="closedialog"
                        class="dialogcloseinuserdetails"
                        v-on="on"
                        style="color: white"
                        >mdi-close</v-icon
                      >
                    </template>
                    <span>{{ $t("close") }}</span>
                  </v-tooltip>
                </v-toolbar>
                <v-card>
                  <v-form ref="form" v-model="valid">
                    <v-layout pt-4 px-6>
                      <v-flex xs12 md12 pr-1>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-textarea
                              dense
                              v-on="on"
                              v-model="empseperationremark"
                              :rules="fieldRules"
                              v-bind:label="$t('remark')"
                              required
                              class="required_field"
                              maxlength="1000"
                              outlined
                              rows="3"
                            ></v-textarea>
                          </template>
                          <span>{{ $t("shortname") }}</span>
                        </v-tooltip>
                      </v-flex>
                    </v-layout>

                    <div class="text-right mr-6 pb-4">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <div v-on="on" class="d-inline-block mr-2">
                            <v-btn
                              v-on="on"
                              small
                              @click="closedialog"
                              class="ma-1 font-weight-bold cancel-btn"
                              color="dark cancel_button"
                              >{{ $t("cancel") }}</v-btn
                            >
                          </div>
                        </template>
                        <span>{{ $t("cancel") }}</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <div v-on="on" class="d-inline-block">
                            <v-btn
                              :disabled="isBtnLoading2"
                              color="green darken-1"
                              @click="submitcancelempprocess"
                              small
                              class="mr-2 success hover_shine"
                            >
                              {{ $t("submit") }}
                              <b-spinner small v-if="isBtnLoading2"></b-spinner>
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
          </div>
        </div>
      </div>
    </div>
    <ConfirmDialog
      :show="showStatusDialog"
      :cancel="cancelStatus"
      :confirm="confirmStatus"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('status_change')"
    />
    <ConfirmDialog
      :show="showExitDialog"
      :cancel="cancelExitStatus"
      :confirm="confirmExitStatus"
      v-bind:title="$t('initiate_exit_interview')"
      v-bind:description="$t('sure_initiate_exit_interview')"
    />
    <ConfirmDialog
      :show="showEndExitinterview"
      :cancel="cancelEndExitInterview"
      :confirm="confirmEndExitInterview"
      v-bind:title="$t('cancel_exit_interview')"
      v-bind:description="$t('sure_want_to_end_exit_interview')"
    />
  </div>
</template>

<script>
import userprofile from "../Users/UserProfile.vue";
import jobhistory from "../Users/JobHistory.vue";
import educationdetails from "../Users/EducationDetails.vue";
import familydetails from "../Users/FamilyDetails.vue";
import employeeskills from "../Users/EmployeeSkills.vue";
import contactaddressdetails from "../Users/ContactAddressDetails.vue";
import assigningnewrole from "../Users/AssigningNewRole.vue";
import EmpBankDetails from "../Users/EmpBankDetails.vue";
import EmpIdProofs from "../Users/EmpIdProofs.vue";
import EmpEpfoAccountDetails from "../Users/EmpEpfoAccountDetails.vue";
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ReferenceDetails from "./ReferenceDetails.vue";
import TravelHistory from "./TravelHistory.vue";
import ReportingTo from "./ReportingTo.vue";
import EmployeeEsicDetails from "./EmployeeEsicDetails.vue";
import LeaveDetails from "./LeaveDetails.vue";
import CurrentJob from "./CurrentJob.vue";
import Complainces from "./Complainces.vue";
import LanguagesKnown from "../Users/LanguagesKnown.vue";
import EmpSeperationProcess from "../Users/EmpSeperationProcess.vue";
import HrEmployeePersonalDetails from "./HrEmployee/HrEmployeePersonalDetails.vue";
import HrEmployeeBasicDetails from "./HrEmployee/HrEmployeeBasicDetails.vue";
import VueElementLoading from "vue-element-loading";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import MediaSelect from "../Components/Upload/MediaSelect.vue";
import DataCard from "./DataCard.vue";

import Tabs from "vue-tabs-with-active-line";

const TABS = [
  // {
  //   title: "Job",
  //   value: "job",
  // },
  {
    title: "Personal",
    value: "personal",
  },
  {
    title: "Education",
    value: "education",
  },
  {
    title: "Reporting To",
    value: "reporting_to",
  },
  {
    title: "Leave Details",
    value: "leave_details",
  },
  {
    title: "Job History",
    value: "job_history",
  },
  {
    title: "Travel History",
    value: "travel_history",
  },
  {
    title: "Documents",
    value: "documents",
  },
  {
    title: "Skills",
    value: "employee_skills",
  },
  {
    title: "Compliance",
    value: "compliance",
  },
  {
    title: "Assign Role",
    value: "assign_role",
  },
  {
    title: " Employee Seperation Process",
    value: "emp_seperation_processcompliance",
  },
];
const TABS1 = [
  // {
  //   title: "Job",
  //   value: "job",
  // },
  {
    title: "Personal",
    value: "personal",
  },
  {
    title: "Education",
    value: "education",
  },
  {
    title: "Reporting To",
    value: "reporting_to",
  },
  {
    title: "Leave Details",
    value: "leave_details",
  },
  {
    title: "Job History",
    value: "job_history",
  },
  {
    title: "Travel History",
    value: "travel_history",
  },
  {
    title: "Documents",
    value: "documents",
  },
  {
    title: "Skills",
    value: "employee_skills",
  },
  {
    title: "Compliance",
    value: "compliance",
  },
  {
    title: "Assign Role",
    value: "assign_role",
  },
];

export default {
  components: {
    userprofile,
    jobhistory,
    educationdetails,
    familydetails,
    employeeskills,
    contactaddressdetails,
    PageTitle,
    assigningnewrole,
    EmpBankDetails,
    EmpIdProofs,
    EmpEpfoAccountDetails,
    MediaSelect,
    HrEmployeePersonalDetails,
    ReferenceDetails,
    HrEmployeeBasicDetails,
    LanguagesKnown,
    TravelHistory,
    ReportingTo,
    LeaveDetails,
    CurrentJob,
    EmpSeperationProcess,
    Complainces,
    EmployeeEsicDetails,
    VueElementLoading,
    ConfirmDialog,
    Tabs,
    DataCard
  },
  data: () => ({
    Emp_seperation_array: "",
    employee_seperation: 0,
    empseperationremark: "",
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    isBtnLoading2: false,
    showEndExitinterview: false,
    empSepReadonly: false,
    valid: false,
    status_id: "",
    showStatusDialog: "",
    showExitDialog: "",
    initval: false,
    user_info: [],
    user_status: "",
    user_id: "",
    getuserid: false,
    tabs_name: 0,

    google_icon: {
      icon_name: "person",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    profile_details: {
      id: 0,
      profile_pic: "",
    },
    userdetailsName_id6: "",
    user_name: "",
    loader: false,
    endseperation_dialog: false,
    showuserdetails_job: false,
    isBtnLoading1: false,
    showuserdetails_personal: false,
    showuserdetails_education: false,
    showuserdetails_rep_to: false,
    showuserdetails_leave: false,
    showuserdetails_job_history: false,
    showuserdetails_travel: false,
    showuserdetails_document: false,
    showuserdetails_skills: false,
    showuserdetails_compliance: false,
    showuserdetails_assign_role: false,
    showuserdetails_exit_process: false,
    job_user_id: null,
    personal_user_id: null,
    education_user_id: null,
    reporting_user_id: null,
    leave_user_id: null,
    job_history_user_id: null,
    travel_user_id: null,
    document_user_id: null,
    skills_user_id: null,
    compliance_user_id: null,
    assign_role_user_id: null,
    exit_process_user_id: null,
    tabs: TABS,
    tabs1: TABS1,
    currentTab: "personal",
    login_user: "",
    openMedia: false,
  }),
  mounted() {
    this.login_user = JSON.parse(localStorage.getItem("user"));
  },
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.fetchemployeeDetails();
        }
        if (this.$route.params.tab == "emp_seperation_processcompliance") {
          // this.currentTab = 'emp_seperation_processcompliance';
          this.handleClick("emp_seperation_processcompliance");
        }
      },
    },

    user_id: {
      immediate: true,
      handler() {
        if (this.user_id >= 1) {
          this.getuserid = true;
          this.fetch_user_details_to_tabs("personal");
          this.fetchEmpSeperateProcess();
        }
      },
    },
  },

  methods: {
    submitcancelempprocess() {
      if (this.$refs.form.validate()) {
        this.isBtnLoading2 = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "cancel_emp_seperation_process",
            {
              emp_id: this.user_id,
              remark: this.empseperationremark,
            }
          )
          .then((res) => {
            this.openMedia = false;
            if (res.data.status == "S") {
              this.isBtnLoading2 = false;
              this.endseperation_dialog = false;
              this.flashMessage.success({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.fetchEmpSeperateProcess();
              this.fetchemployeeDetails();
            } else {
              this.isBtnLoading2 = false;
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class",
              });
            }
          })
          .catch((err) => {
            this.isBtnLoading2 = false;
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
          });
      }
    },
    closedialog() {
      this.empseperationremark = "";
      this.endseperation_dialog = false;
    },
    confirmEndExitInterview() {
      this.showEndExitinterview = false;
      this.endseperation_dialog = true;
    },
    updateImage(imagedata) {
      // this.profile_pic = imagedata;
      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "update_employee_profile_pic",
          {
            profile_pic: imagedata,
            id: this.user_info.user.id,
          }
        )
        .then((res) => {
          this.openMedia = false;
          if (res.data.status == "S") {
            console.log("hihihih");
            console.log(res.data.employee_profile_pic);

            this.user_info.user.profile_pic = res.data.employee_profile_pic;

            this.flashMessage.success({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
          } else {
            this.flashMessage.error({
              message: res.data.message,
            });
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
        });
      // {{user_info.user.id}}
    },

    upload_Image() {
      if (this.openMedia == false) {
        this.openMedia = true;
      } else {
        this.openMedia = false;
      }
    },
    routeToexitInterview() {
      this.isBtnLoading1 = true;
      setTimeout(() => {
        this.$router.push({
          name: "exit_interview_process_hr",
          query: {
            slug: this.$route.query.slug,
          },
        });
        this.isBtnLoading1 = false;
      }, 500);
    },
    fetchEmpSeperateProcess() {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetchemployeeseperateprocess/" +
            this.user_id
        )
        .then((res) => {
          if (res.data.status == "S") {
            if (res.data.data) {
              this.employee_seperation = 1;
              this.empSepReadonly = true;
              this.emp_seperation = res.data.data;
            } else {
              this.Emp_seperation_array = res.data.emp_sep;
              this.employee_seperation = 0;
            }
            this.initval = false;
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
          this.initval = false;
        });
    },
    getPermanentAddress(getPermanentAddress) {
      if (getPermanentAddress) {
        this.fetchemployeeDetails();
      }
    },
    handleClick(newTab) {
      switch (newTab) {
        // case "job":
        //   this.closealltab();
        //   this.fetch_user_details_to_tabs("job");
        //   break;
        case "personal":
          this.fetch_user_details_to_tabs("personal");
          break;
        case "education":
          this.fetch_user_details_to_tabs("education");
          break;
        case "reporting_to":
          this.fetch_user_details_to_tabs("reporting_to");
          break;
        case "leave_details":
          this.fetch_user_details_to_tabs("leave_details");
          break;
        case "job_history":
          this.fetch_user_details_to_tabs("job_history");
          break;
        case "travel_history":
          this.fetch_user_details_to_tabs("travel_history");
          break;
        case "documents":
          this.fetch_user_details_to_tabs("documents");
          break;
        case "employee_skills":
          this.fetch_user_details_to_tabs("employee_skills");
          break;
        case "compliance":
          this.fetch_user_details_to_tabs("compliance");
          break;
        case "assign_role":
          this.fetch_user_details_to_tabs("assign_role");
          break;
        case "emp_seperation_processcompliance":
          this.fetch_user_details_to_tabs("emp_seperation_processcompliance");
          break;
      }
      this.currentTab = newTab;
    },
    closealltab() {
      this.showuserdetails_job = false;
      this.showuserdetails_personal = false;
      this.showuserdetails_education = false;
      this.showuserdetails_rep_to = false;
      this.showuserdetails_leave = false;
      this.showuserdetails_job_history = false;
      this.showuserdetails_travel = false;
      this.showuserdetails_document = false;
      this.showuserdetails_skills = false;
      this.showuserdetails_compliance = false;
      this.showuserdetails_assign_role = false;
      this.showuserdetails_exit_process = false;
      this.job_user_id = null;
      this.personal_user_id = null;
      this.education_user_id = null;
      this.reporting_user_id = null;
      this.leave_user_id = null;
      this.job_history_user_id = null;
      this.travel_user_id = null;
      this.document_user_id = null;
      this.skills_user_id = null;
      this.compliance_user_id = null;
      this.assign_role_user_id = null;
      this.exit_process_user_id = null;
    },
    fetch_user_details_to_tabs(tab) {
      this.closealltab();
      // if (tab == "job") {
      //   this.job_user_id = this.user_id;
      //   this.showuserdetails_job = true;
      // }
      if (tab == "personal") {
        this.personal_user_id = this.user_id;
        this.showuserdetails_personal = true;
      }
      if (tab == "education") {
        this.education_user_id = this.user_id;
        this.showuserdetails_education = true;
      }
      if (tab == "reporting_to") {
        this.reporting_user_id = this.user_id;
        this.showuserdetails_rep_to = true;
      }
      if (tab == "leave_details") {
        this.leave_user_id = this.user_id;
        this.showuserdetails_leave = true;
      }
      if (tab == "job_history") {
        this.job_history_user_id = this.user_id;
        this.showuserdetails_job_history = true;
      }
      if (tab == "travel_history") {
        this.travel_user_id = this.user_id;
        this.showuserdetails_travel = true;
      }
      if (tab == "documents") {
        this.document_user_id = this.user_id;
        this.showuserdetails_document = true;
      }
      if (tab == "employee_skills") {
        this.skills_user_id = this.user_id;
        this.showuserdetails_skills = true;
      }
      if (tab == "compliance") {
        this.compliance_user_id = this.user_id;
        this.showuserdetails_compliance = true;
      }
      if (tab == "assign_role") {
        this.assign_role_user_id = this.user_id;
        this.showuserdetails_assign_role = true;
      }
      if (tab == "emp_seperation_processcompliance") {
        this.exit_process_user_id = this.user_id;
        this.showuserdetails_exit_process = true;
      }
    },
    cancelStatus() {
      this.showStatusDialog = false;
    },
    cancelExitStatus() {
      this.showExitDialog = false;
    },
    cancelEndExitInterview() {
      this.showEndExitinterview = false;
    },
    confirmStatus() {
      this.statusUpdate();
      this.showStatusDialog = false;
    },
    confirmExitStatus() {
      this.routeToexitInterview();
      this.showExitDialog = false;
    },
    ExitStatusUpdate() {
      this.showStatusDialog = false;
    },
    changeStatus(id) {
      this.status_id = id;
      this.showStatusDialog = true;
    },
    changeExitStatus() {
      this.showExitDialog = true;
    },
    statusUpdate() {
      this.loader = true;
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "updateuserstatus", {
          id: this.status_id,
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.flashMessage.success({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.loader = false;
            this.fetchemployeeDetails();
          } else {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
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
    sendCredential(email) {
      this.loader = true;
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "sendcredential", {
          email: email,
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.flashMessage.success({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.loader = false;
          } else {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
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

    edituserDetails(Slug, View) {
      this.$router.push({
        name: "employee_creation",
        query: {
          slug: Slug,
          pathname: View,
        },
      });
    },
    fetchemployeeDetails() {
      this.loader = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetchuserbyslug?slug=" +
            this.$route.query.slug
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.user_id = res.data.user.id;
            this.user_name = res.data.user.full_name;
            this.user_info = res.data;
            this.user_status = res.data.user_status;
            this.loader = false;
          } else if (res.data.status == "E") {
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
    updateUserStatus(updateUserStatus) {
      this.user_status = updateUserStatus;
      this.fetchemployeeDetails();
    },
  },
};
</script>
<style scoped>
.camera-icon {
  background: #00000070;
  position: absolute;
  left: -2px;
  width: 69px;
  height: 34px;
  top: 40px;
}

.card-height {
  height: 205px;
}

.main_card /deep/ .nav {
  flex-wrap: nowrap !important;

  width: 100% !important;
}

.main_card /deep/.nav-link {
  padding: 0.3rem !important;
}

.main_card /deep/.nav-tabs {
  justify-content: space-between !important;
  font-size: 15px;
}

.main_card {
  padding: 0px !important;
  margin: 0px !important;
}

.cardcontents {
  padding: 2px 20px;
}

.vcardsinmaintopdiv {
  height: 180px;
  margin: 10px 0px;
}

.vcardtextdivforuserdetails {
  display: inline-block;
  padding: 0px 13px;
}

.headerdivuserdetails {
  color: #1976d2;
  font-size: 16px;
  font-weight: 600;
  /* font-family: 'Pe-icon-7-stroke'; */
  padding-bottom: 0px;
}

.bodydivuserdetails {
  font-size: 16px;
  font-weight: 500;
  color: #444343;
  /* font-family: none; */
}

.mainuserprofileclasscard {
  cursor: pointer;
  position: relative;
}

.mainuserprofileclasscard:hover {
  background-color: hsl(113, 90%, 88%);
}

.maintopvcardtitle {
  font-size: 18px;
  /* font-family: math; */
  font-weight: 600;
  color: #464444;
  padding: 22px 9px 10px 25px;
}

.faiconsanduserdetailsdiv {
  display: flex;
  font-size: 14px;
  /* font-family: math; */
  font-weight: 600;
  padding-bottom: 1px;
  padding-top: 2px;
  padding-left: 5px;
}

.faiconsanduserdetailsdiv span {
  padding-bottom: 2px;
  padding-top: 1px;
}

.pr-27 {
  padding-right: 27px;
}

.card-padding {
  padding: 0px 16px 0px 16px;
}

.vtabmainuserview /deep/ .tabs__item {
  font-size: 14px !important;
  font-weight: 600 !important;
}

.vtabmainuserview /deep/ .shadow-tabs {
  font-size: 14px !important;
  font-weight: 600 !important;
}

.v-tabs {
  padding-top: 13px !important;
}

.v-tabs /deep/ .v-slide-group__prev {
  margin-top: -13px !important;
  margin-right: -8px !important;
}

.v-tabs /deep/ .v-slide-group__next {
  margin-top: -13px !important;
  margin-left: -8px !important;
}

.tabs__item {
  align-self: center !important;
  margin-top: -13px !important;
}

.tabs {
  color: #5a5050 !important;
}

.tabs /deep/ .tabs__item_active {
  padding-top: 0px !important;
  align-self: center !important;
  margin-top: -4px !important;
}

.tabs /deep/ .tabs__item {
  padding-top: 0px !important;
  padding-top: 0px !important;
  margin-top: -6px !important;
  min-width: 115px;
}

.vavatarprofileclasscard {
  width: 100% !important;
}

.address_item {
  width: 90% !important;
  max-height: 100px;
}

p {
  text-overflow: ellipsis !important;
}

.displayreportintoinusercard {
  position: absolute;
  bottom: 2px;
  width: 100%;
  right: 15px;
}

.reportingtochip {
  margin-top: 17px;
  margin-left: 6px;
  border-radius: 9px;
}

.reportingtohead {
  font-size: 14px;
  font-weight: 600;
  color: #000000ad;
}

.edit_icon {
  position: absolute;
  top: 30px;
  right: 10px;
}

.avatar-icon {
  border: none !important;
}

.profilepic {
  position: relative;
  /* width: 146px; */
  height: 182px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #111;
  margin-left: 5px;
  border: 1px solid #c1b0b0;
}

.profilepic:hover .profilepic__content {
  opacity: 1;
}

.profilepic:hover .profilepic__image {
  opacity: 0.2;
  background: grey;
}

.profilepic__image {
  object-fit: cover;
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
  height: 180px;
}

.profilepic__content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.profilepic__icon {
  color: white;
  padding-bottom: 8px;
}

/* .fas {
  font-size: 20px;
} */

.profilepic__text {
  text-transform: uppercase;
  font-size: 12px;
  width: 50%;
  text-align: center;
}

.img_height {
  height: 178px;
}

.name-border {
  border: 1px solid black;
  border-radius: 7px 7px 7px 7px;
  padding: 6px;
  margin-right: 13px;
}

.name-fonts {
  font-size: 19px;
  font-weight: bold;
}

.designation-fonts {
  font-size: 13px;
  color: gray;
  font-weight: bold;
}

.fa-font-size {
  font-size: 18px;
}

.em-font {
  margin-left: 8px;
  font-size: 14px;
}

.reporting-border {
  border: 1px solid #247cd4;
  border-radius: 7px 7px 7px 7px;
  padding: 2px;
}

.reporting-name-font {
  color: #247cd4;
  font-weight: normal;
  margin-left: 6px;
}

.padding-level {
  padding: 0px 0px 0px 13px;
}

.icon_radius {
  border-radius: 40px;
}

.emp-no-font {
  font-weight: bold;
  font-size: 17px;
  margin-left: 7px;
}

.vicon_llink {
  font-size: 30px;
}

.jod-color {
  color: #148ef1e0;
}
.dob-color {
  color: #1170bde0;
}

.phone-color {
  color: #1671cd;
}

.email-color {
  color: #0aaace;
}

.gender_font {
  text-align: end;
  margin-top: -7px;
  margin-right: 70px;
  font-size: 13px;
  text-transform: capitalize;
  font-weight: 700;
}

.maindivfortravelradio {
  display: flex;
}

.title_heading {
  font-weight: bold;
}
</style>
