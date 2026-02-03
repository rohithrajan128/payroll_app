<template>
  <div class="main-20">
    <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
    <div>
      <v-app-bar flat color="white">
        <h5>
          {{ $t("initiate_exit_interview") }}
          <i class="fa fa-institution pl-3"></i>
        </h5>
      </v-app-bar>
      <v-sheet class="mt-1">
        <div class="row pb-6">
          <div v-bind:class="[
            empdetailsexpand == true ? 'col-md-2' : 'col-md-1 ml-8',
          ]">
            <div class="text-center pl-2">
              <v-avatar size="65" rounded="0" class="vavatarprofile" v-if="user_array && !empdetailsexpand">
                <img v-if="user_array.profile_pic" :src="envImagePath + user_array.profile_pic" />
                <img v-else src="@/assets/images/default-user-profile-picture.png" />
              </v-avatar>
              <v-avatar size="140" rounded="0" class="vavatarprofile" v-if="user_array && empdetailsexpand">
                <img v-if="user_array.profile_pic" :src="envImagePath + user_array.profile_pic" />
                <img v-else src="@/assets/images/default-user-profile-picture.png" />
              </v-avatar>
            </div>
          </div>
          <div class="col-md-10">
            <v-row class="expandableicondivclass" v-bind:class="[
              empdetailsexpand == true
                ? 'expandableicondivclass'
                : 'expandablecloseicondivclass',
            ]">
              <v-spacer></v-spacer>
              <v-tooltip bottom v-if="empdetailsexpand">
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" @click="empdetailsexpand = false">mdi-arrow-up-drop-circle-outline</v-icon>
                </template>
                <span>{{ $t("show_less") }}</span>
              </v-tooltip>
              <v-tooltip bottom v-else>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" @click="empdetailsexpand = true">mdi-arrow-down-drop-circle-outline</v-icon>
                </template>
                <span>{{ $t("show_more") }}</span>
              </v-tooltip>
            </v-row>
            <v-layout v-if="empdetailsexpand">
              <v-flex md12>
                <span class="usernamegreenheading">{{
                  user_array.Full_Code
                }}</span>
              </v-flex>
            </v-layout>
            <v-layout wrap class="mt-1">
              <v-flex md3 pl-2 v-if="!empdetailsexpand" class="align-self-center">
                <span class="usernamegreenheading">{{
                  user_array.full_name
                }}</span><br />
                <span class="usernamegreenheadingexpandstyle">{{
                  user_array.empno
                }}</span>
              </v-flex>
              <v-flex md3 pl-2>
                <div class="userdetails_in_emp_seperation_process">
                  <span class="heading_emp_seperation_process">{{
                    $t("designation")
                  }}</span>
                  <span class="body_emp_seperation_process" v-if="user_array.designation_id">
                    {{ user_array.designation.designation }}
                  </span>
                  <span class="body_emp_seperation_process" v-else>{{
                    $t("not_appllicable")
                  }}</span>
                </div>
              </v-flex>
              <v-flex md3 pl-2>
                <div class="userdetails_in_emp_seperation_process">
                  <span class="heading_emp_seperation_process">{{
                    $t("reporting_to")
                  }}</span>
                  <span class="body_emp_seperation_process" v-if="primary_manager_name">
                    <v-avatar class="primarymanagerprofilepicclass">
                      <v-img v-if="primary_manager_pic" :src="envImagePath + primary_manager_pic" alt></v-img>
                      <img v-else src="@/assets/images/default-user-profile-picture.png" alt />
                    </v-avatar>
                    <span>{{ primary_manager_name }}</span>
                  </span>
                  <span class="body_emp_seperation_process" v-else>{{
                    $t("not_appllicable")
                  }}</span>
                </div>
              </v-flex>
              <v-flex md3 pl-2 v-if="empdetailsexpand">
                <div class="userdetails_in_emp_seperation_process">
                  <span class="heading_emp_seperation_process">{{
                    $t("Joining_date")
                  }}</span>
                  <span class="body_emp_seperation_process" v-if="user_array.Joining_date">
                    {{ user_array.Joining_date | formatFullDate }}
                  </span>
                  <span class="body_emp_seperation_process" v-else>{{
                    $t("not_appllicable")
                  }}</span>
                </div>
              </v-flex>
              <v-flex md3 pl-2>
                <div class="userdetails_in_emp_seperation_process">
                  <span class="heading_emp_seperation_process">{{
                    $t("resignation_date")
                  }}</span>
                  <span class="body_emp_seperation_process" v-if="user_array.resignation_details">
                    {{ user_array.resignation_details.resignation_submitted_on | formatDate }}</span>
                  <span v-else class="body_emp_seperation_process">{{
                    $t("not_appllicable")
                  }}</span>
                </div>
              </v-flex>
            </v-layout>
            <v-layout wrap class="mt-4" v-if="empdetailsexpand">
              <v-flex md3 pl-2>
                <div class="userdetails_in_emp_seperation_process">
                  <span class="heading_emp_seperation_process">{{
                    $t("department")
                  }}</span>
                  <span class="body_emp_seperation_process" v-if="user_array.department">
                    {{ user_array.department }}
                  </span>
                  <span class="body_emp_seperation_process" v-else>{{
                    $t("not_appllicable")
                  }}</span>
                </div>
              </v-flex>
              <v-flex md3 pl-2>
                <div class="userdetails_in_emp_seperation_process">
                  <span class="heading_emp_seperation_process">{{
                    $t("location")
                  }}</span>
                  <span class="body_emp_seperation_process" v-if="user_array.addressdetails">{{
                    user_array.addressdetails.county }}</span>
                  <span class="body_emp_seperation_process" v-else>{{
                    $t("not_appllicable")
                  }}</span>
                </div>
              </v-flex>
              <v-flex md3 pl-2>
                <div class="userdetails_in_emp_seperation_process body_emp_seperation_process">
                  <span class="heading_emp_seperation_process">{{
                    $t("requested_lwd")
                  }}</span>
                  <span v-if="user_array.resignation_details">{{
                    user_array.resignation_details.tentative_last_working_day
                    | formatDate
                  }}</span>
                  <span v-else class="body_emp_seperation_process">{{
                    $t("not_appllicable")
                  }}</span>
                </div>
              </v-flex>
              <v-flex md3 pl-2>
                <div class="userdetails_in_emp_seperation_process">
                  <span class="heading_emp_seperation_process">{{
                    $t("approved_lwd")
                  }}</span>
                  <span class="body_emp_seperation_process">{{
                    $t("not_appllicable")
                  }}</span>
                </div>
              </v-flex>
            </v-layout>
          </div>
        </div>
      </v-sheet>
      <v-sheet>
        <v-stepper v-model="stepper" alt-labels class="vsteppertextstyling">
          <v-stepper-header>
            <v-stepper-step step="1">{{
              $t("emp_exit_details")
            }}</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="2">{{
              $t("noc_by_reporting_managers")
            }}</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="3">{{
              $t("emp_exit_interview_form")
            }}</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="4">{{ $t("exit_process") }}</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="5">{{
              $t("final_relieving_process")
            }}</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="6">{{ $t("f&f_settlement") }}</v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <EmpSeperationProcess :user_id="user_array.id" :status="1" :user_slug="$route.query.slug"
                @updatestepper="updatestepper" @getdatasuccess="getdatasuccess" />
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-form v-model="valid" ref="emp_sep_form">
                <div class="pl-4 pr-4 pt-5 vsteppercards" style="position: relative">

                  <v-card class="pa-3 mb-3">
                    <v-layout>
                      <v-flex md4>
                        <div class="row ma-0 pa-0 ">
                          <strong class="mr-5 align-self-center pb-1">{{ $t('enable_noc_by_manager?') }}</strong>
                          <v-radio-group
                            :disabled="emp_seperation.enable_noc_by_manager == 'Yes' && emp_seperation.status == 'Approved'"
                            v-model="emp_seperation.enable_noc_by_manager" row class="noc_radio_groups"
                            @change="changeNOCmanager">
                            <v-radio label="Yes" value="Yes"></v-radio>
                            <v-radio label="No" value="No"></v-radio>
                          </v-radio-group>
                        </div>
                      </v-flex>
                      <v-flex md4 v-if="emp_seperation.enable_noc_by_manager == 'Yes'">
                        <v-autocomplete class="mt-3 required_field" v-bind:label="$t('manager')" v-on="on" index="id"
                          :disabled="emp_seperation.enable_noc_by_manager == 'Yes' && emp_seperation.status == 'Approved'"
                          :items="exit_manager_array" item-value="id" item-text="full_details"
                          v-model="emp_seperation.primary_manager_id" :rules="fieldRules" outlined dense>
                        </v-autocomplete>
                      </v-flex>
                    </v-layout>
                    <v-layout v-if="emp_seperation.enable_noc_by_manager == 'No'">
                      <v-flex md10>
                        <v-textarea dense outlined v-bind:label="$t('why_no_noc_by_manager_explain')"
                          class="required_field" max-length="2000" :rules="fieldRules"
                          v-model="emp_seperation.noc_comments" rows="3"></v-textarea>
                      </v-flex>
                    </v-layout>
                    <v-layout v-if="emp_seperation.enable_noc_by_manager == 'Yes' &&
                      emp_seperation.status
                      " class="pl-2 pr-2 mt-5">
                      <v-flex md8 class="pt-1">
                        <div class="d-flex mr-5 mb-5">
                          <span class="project_work_heading">{{
                            $t("managers_approval")
                          }}</span>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn small v-on="on" @click="showStatusDialog = true"
                                class="mr-2 ml-5 success hover_shine mb-1 mr-5" :disabled="isBtnLoadingapproveonbehalf ||
                                  emp_seperation.status == 'Approved' ||
                                  emp_seperation.status == 'Rejected'
                                  ">
                                {{ $t("approve_on_behalf") }}
                                <b-spinner :disabled="isBtnLoadingapproveonbehalf" small
                                  v-if="isBtnLoadingapproveonbehalf"></b-spinner>
                              </v-btn>
                            </template>
                            <span>{{ $t("approve_on_behalf") }}</span>
                          </v-tooltip>
                          <v-tooltip bottom v-if="emp_seperation.approver_id != null &&
                            emp_seperation.status == 'Approved'">
                            <template v-slot:activator="{ on }">
                              <v-btn small v-on="on" class="mr-2 ml-5 primary hover_shine mb-1 mr-5"
                                @click="showmanagerdialogarray">
                                {{ $t("show_manager_questions") }}
                              </v-btn>
                            </template>
                            <span>{{ $t("show_manager_questions") }}</span>
                          </v-tooltip>
                        </div>
                        <v-simple-table>
                          <template v-slot:default>
                            <thead>
                              <tr>
                                <th>{{ $t("approved_by") }}</th>
                                <th v-if="emp_seperation.approved_behalf_id != null">
                                  {{ $t("on_behalf_of") }}
                                </th>
                                <th>{{ $t("approve_date") }}</th>
                                <th>{{ $t("approve_status") }}</th>
                                <!-- <th>{{ $t('on_behalf_approver') }}</th> -->

                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td v-if="emp_seperation.approved_behalf_id != null">
                                  <v-chip class="vchipapproveonbehalf" small outlined color="primary"
                                    v-if="emp_seperation.approve_behalf">
                                    {{ emp_seperation.approve_behalf.Full_Code }}
                                  </v-chip>
                                  <span v-else>{{ $t("not_appllicable") }}</span>
                                </td>
                                <td v-else>
                                  <v-chip class="vchipapproveonbehalf" small outlined color="primary"
                                    v-if="emp_seperation.primary_manager">
                                    {{ emp_seperation.primary_manager.Full_Code }}
                                  </v-chip>
                                  <span v-else>{{ $t("not_appllicable") }}</span>
                                </td>
                                <td v-if="emp_seperation.approved_behalf_id != null">
                                  <v-chip class="vchipapproveonbehalf" small outlined color="primary"
                                    v-if="emp_seperation.primary_manager">
                                    {{ emp_seperation.primary_manager.Full_Code }}
                                  </v-chip>
                                  <span v-else>{{ $t("not_appllicable") }}</span>
                                </td>
                                <td>
                                  <span v-if="emp_seperation.manager_approval_date">{{
                                    emp_seperation.manager_approval_date
                                    | formatDate
                                  }}</span>
                                  <span v-else>{{ $t("not_appllicable") }}</span>
                                </td>
                                <td>
                                  <span v-if="emp_seperation.status">{{
                                    emp_seperation.status
                                  }}</span>
                                  <span v-else>{{ $t("not_appllicable") }}</span>
                                </td>

                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-flex>
                    </v-layout>
                  </v-card>
                  <v-card class="pa-3 mb-3">
                    <v-layout>
                      <v-flex md12>
                        <div class="row ma-0 pa-0 ">
                          <strong class="mr-5 align-self-center pb-1">{{ $t('exit_interview_for_emp_enable?') }}</strong>
                          <v-radio-group row class="noc_radio_groups" :disabled="emp_seperation.submit_emp_questions == 1"
                            v-model="emp_seperation.exit_interview_for_emp_enable"
                            @change="emp_seperation.not_enable_emp_reason = ''">
                            <v-radio label="Yes" value="Yes"></v-radio>
                            <v-radio label="No" value="No"></v-radio>
                          </v-radio-group>
                          <v-tooltip bottom v-if="emp_seperation.submit_emp_questions == 1">
                            <template v-slot:activator="{ on }">
                              <v-btn color="success" small class="ml-5 mt-4" @click="stepper = 3" v-on=on>
                                {{ $t('submitted') }}
                              </v-btn>
                            </template>
                            <span>{{ $t("view_form") }}</span>
                          </v-tooltip>
                          <v-btn color="success" small outlined
                            v-if="emp_seperation.submit_emp_questions != 1 && emp_seperation.exit_interview_for_emp_enable == 'Yes'"
                            class="ml-5 mt-4" readonly style="pointer-events: none;">
                            {{ $t('enabled') }}
                          </v-btn>
                        </div>
                      </v-flex>
                    </v-layout>
                    <v-layout v-if="emp_seperation.exit_interview_for_emp_enable == 'No'">
                      <v-flex md10>
                        <v-textarea dense outlined v-bind:label="$t('reason_for_not_enable_for_emp')"
                          class="required_field" v-model="emp_seperation.not_enable_emp_reason" :rules="fieldRules"
                          rows="3" max-length="2000"></v-textarea>
                      </v-flex>
                    </v-layout>
                  </v-card>
                  <v-card class="pa-3 mb-3">
                    <v-layout>
                      <v-flex md4>
                        <div class="row ma-0 pa-0 ">
                          <strong class="mr-5 align-self-center pb-1">{{ $t('system_admin_noc') }}</strong>
                          <v-radio-group row class="noc_radio_groups" @change="changeSystemadminradio()"
                            v-model="emp_seperation.enable_noc_by_system_admin"
                            :disabled="emp_seperation.submit_system_admin_questions == 1">
                            <v-radio label="Yes" value="Yes"></v-radio>
                            <v-radio label="No" value="No"></v-radio>
                          </v-radio-group>
                        </div>
                      </v-flex>
                      <v-flex md4 v-if="emp_seperation.enable_noc_by_system_admin == 'Yes'">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-autocomplete class="mt-3 required_field" v-bind:label="$t('system_admin')" v-on="on"
                              :disabled="emp_seperation.submit_system_admin_questions == 1" index="id"
                              :items="org_employee_array" item-value="id" item-text="full_details"
                              v-model="emp_seperation.system_admin_id" :rules="fieldRules" outlined dense>
                            </v-autocomplete>
                          </template>
                          <span>{{ $t("system_admin") }}</span>
                        </v-tooltip>
                      </v-flex>
                    </v-layout>
                    <v-layout v-if="emp_seperation.enable_noc_by_system_admin == 'No'">
                      <v-flex md10>
                        <v-textarea dense outlined v-bind:label="$t('reason_for_not_enable_noc_system_admin')"
                          class="required_field" v-model="emp_seperation.system_admin_no_noc_comment" :rules="fieldRules"
                          rows="3" max-length="2000"></v-textarea>
                      </v-flex>
                    </v-layout>
                    <v-layout v-if="emp_seperation.enable_noc_by_system_admin == 'Yes' && emp_seperation.system_admin_id"
                      class="pl-2 pr-2 mt-5">
                      <v-flex md8 class="pt-1">
                        <div class="d-flex justify-content-between mr-5 mb-5">
                          <span class="project_work_heading">{{
                            $t("system_admin_approval")
                          }}</span>

                          <v-tooltip bottom v-if="emp_seperation.submit_system_admin_questions == 1">
                            <template v-slot:activator="{ on }">
                              <v-btn small v-on="on" class="mr-2 ml-5 primary hover_shine mb-1 mr-5"
                                @click="showdialogadmin">
                                {{ $t("show_system_admin_questions") }}
                              </v-btn>
                            </template>
                            <span>{{ $t("show_system_admin_questions") }}</span>
                          </v-tooltip>
                        </div>

                        <v-simple-table>
                          <template v-slot:default>
                            <thead>
                              <tr>
                                <th>{{ $t("approved_by") }}</th>
                                <th>{{ $t("approve_date") }}</th>
                                <th>{{ $t("approve_status") }}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td v-if="emp_seperation.system_admin != null">
                                  <v-chip class="vchipapproveonbehalf" small outlined color="primary">
                                    {{ emp_seperation.system_admin.Full_Code }}
                                  </v-chip>
                                </td>
                                <td v-else>{{ $t("not_appllicable") }}</td>
                                <td>
                                  <span v-if="emp_seperation.system_admin_approval_date">
                                    {{ emp_seperation.system_admin_approval_date | formatDate }}</span>
                                  <span v-else>{{ $t("not_appllicable") }}</span>
                                </td>
                                <td>
                                  <span v-if="emp_seperation.submit_system_admin_questions ==
                                    1
                                    ">{{ $t("approved") }}</span>
                                  <span v-else>{{ $t("Pending") }}</span>
                                </td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-flex>
                    </v-layout>
                  </v-card>


                  <v-row class="pb-5 mt-4">
                    <v-spacer></v-spacer>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn small v-on="on" class="font-weight-bold cancel-btn mr-2"
                          color="btn hover_shine cancel_button" @click="$router.go(-1)">{{ $t("back") }}</v-btn>
                      </template>
                      <span>{{ $t("back") }}</span>
                    </v-tooltip>
                    <v-btn small @click="stepper = 1" class="primary mr-2">
                      {{ $t("previous") }}
                    </v-btn>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn small v-on="on" class="mr-2 success hover_shine mb-1"  :disabled="isBtnLoading"
                          @click="saveEmpseperation('save')">
                          {{ $t("save") }}
                          <b-spinner small v-if="isBtnLoading"></b-spinner>
                        </v-btn>
                      </template>
                      <span>{{ $t("save") }}</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }" >
                        <v-btn color="primary" class="mr-2" :disabled="isBtnLoading"
                          @click="saveEmpseperation('savennext')" small v-on="on">
                          {{ $t("save_next") }}
                          <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
                        </v-btn>
                      </template>
                      <span>{{ $t("save_next") }}</span>
                    </v-tooltip>
                    <v-btn color="primary" class="mr-2" :disabled="isBtnLoading" @click="stepper = 3" small
                      v-if="emp_seperation.status == 'Pending' || emp_seperation.status == 'Approved'">
                      {{ $t("next") }}
                    </v-btn>
                  </v-row>
                </div>
              </v-form>
            </v-stepper-content>

            <v-stepper-content step="3">
              <div class="pl-4 pr-4 pt-5 vsteppercards" style="position: relative">
                <!-- <div>
                  <span
                    class="employeestatussubmission"
                  >{{ $t('emp_exit_interview_submission_status') }}</span>
                  <v-chip small color="primary" v-if="emp_seperation.status == 'Pending'">
                    {{
                    emp_seperation.status
                    }}
                  </v-chip>
                  <v-chip small color="error" v-if="emp_seperation.status == 'Rejected'">
                    {{
                    emp_seperation.status
                    }}
                  </v-chip>
                  <v-chip small color="success" v-if="emp_seperation.status == 'Approved'">
                    {{
                    emp_seperation.status
                    }}
                  </v-chip>
                </div>
                <hr /> -->
                <div v-if="user_array.id">
                  <EmpQuestionAnswer :userID="user_array.id" />
                </div>
              </div>

              <v-row class="rowsavebton mb-2">
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn small v-on="on" class="font-weight-bold cancel-btn mr-2" color="btn hover_shine cancel_button"
                      @click="$router.go(-1)">{{ $t("back") }}</v-btn>
                  </template>
                  <span>{{ $t("back") }}</span>
                </v-tooltip>
                <v-btn small @click="stepper = 2" class="primary mr-2">
                  {{ $t("previous") }}
                </v-btn>
                <v-btn color="primary" class="mr-2" :disabled="isDisabled" @click="stepper = 4" small>
                  {{ $t("next") }}
                  <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
                </v-btn>
              </v-row>
            </v-stepper-content>

            <v-stepper-content step="4">
              <div class="pl-4 pr-4 pt-5 vsteppercards" style="position: relative">
                <ExitProcess :stepper="2" @hrstepper="hrstepper" @hrstepper2="hrstepper2" :user_id="user_array.id">
                </ExitProcess>
              </div>
            </v-stepper-content>

            <v-stepper-content step="5">
              <span class="project_work_heading">{{
                $t("leave_details")
              }}</span>
              <v-layout wrap pt-5>
                <v-flex md6>
                  <v-row wrap>
                    <v-col md="3">
                      <div class="appliedleavediv">
                        <div class="textinsideleavedetails">
                          <span class="countleavetype" v-if="appliedLeave">
                            {{ appliedLeave }}
                          </span>
                          <span class="countleavetype" v-else>{{
                            $t("zero")
                          }}</span>
                          <span class="textleavetype">{{ $t("applied") }}</span>
                        </div>
                      </div>
                    </v-col>
                    <v-col md="3">
                      <div class="approvedleavediv">
                        <div class="textinsideleavedetails">
                          <span class="countleavetype" v-if="approvedLeave">
                            {{ approvedLeave }}
                          </span>
                          <span class="countleavetype" v-else>{{
                            $t("zero")
                          }}</span>
                          <span class="textleavetype">{{
                            $t("approved")
                          }}</span>
                        </div>
                      </div>
                    </v-col>
                    <v-col md="3">
                      <div class="cancelledleavediv">
                        <div class="textinsideleavedetails">
                          <span class="countleavetype" v-if="cancelledLeave">
                            {{ cancelledLeave }}
                          </span>
                          <span class="countleavetype" v-else>{{
                            $t("zero")
                          }}</span>
                          <span class="textleavetype">{{
                            $t("cancelled")
                          }}</span>
                        </div>
                      </div>
                    </v-col>
                    <v-col md="3">
                      <div class="escalatedleavediv">
                        <div class="textinsideleavedetails">
                          <span class="countleavetype" v-if="escalatedLeave">
                            {{ escalatedLeave }}
                          </span>
                          <span class="countleavetype" v-else>{{
                            $t("zero")
                          }}</span>
                          <span class="textleavetype">{{
                            $t("escalated")
                          }}</span>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-flex>
                <v-flex md6 pl-6>
                  <v-row wrap>
                    <v-col md="3">
                      <div class="lopleavediv">
                        <div class="textinsideleavedetails">
                          <span class="countleavetype" v-if="lopLeave">{{
                            lopLeave
                          }}</span>
                          <span class="countleavetype" v-else>{{
                            $t("zero")
                          }}</span>
                          <span class="textleavetype">{{ $t("LOP") }}</span>
                        </div>
                      </div>
                    </v-col>
                    <v-col md="3">
                      <div class="pendingleavediv">
                        <div class="textinsideleavedetails">
                          <span class="countleavetype" v-if="pendingLeave">
                            {{ pendingLeave }}
                          </span>
                          <span class="countleavetype" v-else>{{
                            $t("zero")
                          }}</span>
                          <span class="textleavetype">{{ $t("pending") }}</span>
                        </div>
                      </div>
                    </v-col>
                    <v-col md="3">
                      <div class="rejectedleavediv">
                        <div class="textinsideleavedetails">
                          <span class="countleavetype" v-if="rejectedLeave">
                            {{ rejectedLeave }}
                          </span>
                          <span class="countleavetype" v-else>{{
                            $t("zero")
                          }}</span>
                          <span class="textleavetype">{{
                            $t("rejected")
                          }}</span>
                        </div>
                      </div>
                    </v-col>
                    <v-col md="3">
                      <div class="waitingleavediv">
                        <div class="textinsideleavedetails">
                          <span class="countleavetype" v-if="waitingLeave">
                            {{ waitingLeave }}
                          </span>
                          <span class="countleavetype" v-else>{{
                            $t("zero")
                          }}</span>
                          <span class="textleavetype">{{ $t("waiting") }}</span>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-flex>
              </v-layout>
              <v-form v-model="valid1" ref="final_releiving_process">
                <v-layout pt-8>
                  <v-flex md4 pr-5>
                    <v-text-field dense outlined v-bind:label="$t('tentactive_last_working_day')" rows="2" readonly
                      v-model="final_releiving_process.tentactive_last_working_day
                        "></v-text-field>
                  </v-flex>
                  <v-flex md4 pr-5>
                    <DatePicker :label="$t('relieving date')" :max="new Date().toISOString().substr(0, 10)"
                      :stored_date="final_releiving_process.final_resigning_date
                        " @formatted_date="formatted_from_date" dense :class_required="'RequiredField'"
                      :rules="fieldRules" v-model="final_releiving_process.final_resigning_date" />
                  </v-flex>
                  <v-flex md4 pr3>
                    <v-text-field dense outlined v-bind:label="$t('available_earned_leave_as_lwd')" readonly v-model="final_releiving_process.available_earned_leave_as_lwd
                      "></v-text-field>
                  </v-flex>
                </v-layout>
              </v-form>
              <v-row class="pr-2">
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn small v-on="on" class="font-weight-bold cancel-btn mb-5 mr-2 mt-2"
                      color="btn hover_shine cancel_button" @click="$router.go(-1)">{{ $t("back") }}</v-btn>
                  </template>
                  <span>{{ $t("back") }}</span>
                </v-tooltip>

                <v-btn small @click="stepper = 4" class="primary mb-5 mr-2 mt-2">
                  {{ $t("previous") }}
                </v-btn>

                <v-btn color="primary" v-if="!submittedornot" class="mr-2 mb-5 mt-2" :disabled="isDisabled"
                  @click="(stepper = 6), fetchfandf()" small>
                  {{ $t("next") }}
                  <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
                </v-btn>

                <v-tooltip bottom v-if="submittedornot">
                  <template v-slot:activator="{ on }">
                    <v-btn small v-on="on" class="mt-2 success hover_shine mb-5 mr-2" :disabled="isBtnLoading1"
                      @click="makeEmpInactivedialog">
                      {{ $t("make_emp_inactive") }}
                      <b-spinner :disabled="isBtnLoading1" small v-if="isBtnLoading1"></b-spinner>
                    </v-btn>
                  </template>
                  <span>{{ $t("make_emp_inactive") }}</span>
                </v-tooltip>
              </v-row>
            </v-stepper-content>
            <v-stepper-content step="6">
              <v-form ref="fandf" class="mt-5" v-model="valid">
                <v-layout>
                  <v-flex md4 pr3>
                    <v-text-field dense outlined v-bind:label="$t('available_earned_leave_as_lwd')" readonly v-model="final_releiving_process.available_earned_leave_as_lwd
                      "></v-text-field>
                  </v-flex>

                  <v-flex md4 pl-2>
                    <DatePicker :label="$t('date_of_fandf')" :min="new Date().toISOString().substr(0, 10)" :stored_date="emp_full_final_settlement.date_of_full_and_final_settlement
                      " @formatted_date="formatted_final_date" dense :class_required="'RequiredField'"
                      :rules="fieldRules" v-model="emp_full_final_settlement.date_of_full_and_final_settlement
                        " />
                  </v-flex>
                  <v-flex xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" dense v-model="emp_full_final_settlement.amount_transferred"
                          :rules="fieldRules" v-bind:label="$t('amount_transfered')" required class="required_field"
                          outlined></v-text-field>
                      </template>
                      <span>{{ $t("amount_transfered") }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex xs12 md4>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" dense v-model="emp_full_final_settlement.mode_of_transfer"
                          :rules="fieldRules" v-bind:label="$t('mode_of_transfer')" required class="required_field"
                          outlined></v-text-field>
                      </template>
                      <span>{{ $t("mode_of_transfer") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" v-model="emp_full_final_settlement.transfer_reference" dense
                          :rules="fieldRules" v-bind:label="$t('transfer_reference')" required class="required_field"
                          outlined></v-text-field>
                      </template>
                      <span>{{ $t("transfer_reference") }}</span>
                    </v-tooltip>
                  </v-flex>

                  <v-flex xs12 sm6 md4 pl-2 class>
                    <div class="browsedivdoc">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-text-field readonly outlined dense v-on="on" @click="callDocumentSelect" v-model="emp_full_final_settlement.releaving_documents_url
                            " v-bind:label="$t('upload_doc')"></v-text-field>
                          <v-chip label class="browsebtndoc" @click="callDocumentSelect" color="primary" v-on="on">{{
                            $t("browse") }}</v-chip>
                        </template>
                        <span>{{ $t("upload_doc") }}</span>
                      </v-tooltip>
                    </div>
                    <!-- {{emp_proof.doct_type}} -->
                    <!-- <div v-if="emp_proof.doct_type">
                      <a :href="document_url  +  emp_proof.doct_type" download>
                        <p class="download_color">Download</p>
                      </a>
                    </div>-->
                    <div v-if="emp_full_final_settlement.releaving_documents_url">
                      <a :href="document_url +
                        emp_full_final_settlement.releaving_documents_url
                        " target="_blank" class="text-primary f-13 a-underline">{{ $t("download") }}</a>
                    </div>
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex xs12 sm6 md4 style="display: none">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <span v-on="on">
                          <DocumentSelect :label="'Proof '" :folder="'ProofDocument'" :uploadtype="enable_document_select"
                            @closeDialog="closeDocumentSelectDialog" @uploadedDocument="uploadedDocument" :documentlink="emp_full_final_settlement.date_of_full_and_final_settlement
                              "></DocumentSelect>
                        </span>
                      </template>
                      <span>{{ $t("file_input") }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>

                <div class="d-block text-right mr-4">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn small v-on="on" class="font-weight-bold cancel-btn mr-2"
                        color="btn hover_shine cancel_button" @click="$router.go(-1)">{{ $t("back") }}</v-btn>
                    </template>
                    <span>{{ $t("back") }}</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <div v-on="on" class="d-inline-block mr-2">
                        <v-btn small @click="stepper = 5" class="primary mr-2">
                          {{ $t("previous") }}
                        </v-btn>
                      </div>
                    </template>
                    <span>{{ $t("previous") }}</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <div v-on="on" class="d-inline-block">
                        <v-btn :disabled="isDisabled" color="green darken-1" @click="savefandf" small
                          class="mr-2 success hover_shine">
                          {{ $t("save") }}
                          <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
                        </v-btn>
                      </div>
                    </template>
                    <span>{{ $t("save") }}</span>
                  </v-tooltip>
                </div>
              </v-form>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>

        <v-dialog fullscreen transition="dialog-bottom-transition" persistent v-model="showmanagersquestions">
          <v-card class="container">
            <v-toolbar color="primary" dark>
              <span class="headline">{{
                $t("managers_questions")
              }}</span>
              <v-spacer></v-spacer>
              <ExcelExitInterview :questions="admin_question_array" :header="header_name" />
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon @click="closemanaserdialogarray" class="dialogcloseinuserdetails ml-5"
                    v-on="on">mdi-close</v-icon>
                </template>
                <span>{{ $t("close") }}</span>
              </v-tooltip>
            </v-toolbar>
            <v-card-text class="mt-3">

              <v-data-table :headers="questions_array_headers" :items="questions_array" :loading="initval"
                hide-default-footer disable-pagination>
                <template v-slot:item="{ item, index }">
                  <tr>
                    <td colspan="5">
                      <span v-if="item.questions">{{
                        item.questions
                      }}</span>
                    </td>
                    <td>
                      <div v-if="item.field_type == 'LOV'" class="lov_autocomplete_div lovdiv">
                        <v-select v-if="item.is_field_required == 'Yes'" :rules="fieldRules" class="required_field"
                          v-model="questions_array[index].answer" readonly v-bind:label="$t('select')"
                          :items="item.lookup_values" dense outlined></v-select>
                        <v-select v-else v-bind:label="$t('select')" :items="item.lookup_values" dense outlined
                          v-model="questions_array[index].answer" readonly></v-select>
                      </div>
                      <div v-if="item.field_type == 'AUTOCOMPLETE'" class="lov_autocomplete_div lovdiv">
                        <v-autocomplete v-if="item.is_field_required == 'Yes'" v-model="questions_array[index].answer"
                          readonly :rules="fieldRules" class="required_field" v-bind:label="$t('select')"
                          :items="item.lookup_values" dense outlined></v-autocomplete>
                        <v-autocomplete v-else v-bind:label="$t('select')" :items="item.lookup_values" dense outlined
                          v-model="questions_array[index].answer" readonly="checksubmitdone"></v-autocomplete>
                      </div>
                      <div v-if="item.field_type == 'TEXTAREA'" class="lov_autocomplete_div lovdiv">
                        <v-textarea v-if="item.is_field_required == 'Yes'" v-model="questions_array[index].answer"
                          readonly :rules="fieldRules" class="required_field" v-bind:label="$t('type_here')" rows="2"
                          dense outlined></v-textarea>
                        <v-textarea v-else v-bind:label="$t('type_here')" rows="2" dense outlined
                          v-model="questions_array[index].answer" readonly></v-textarea>
                      </div>
                      <div v-if="item.field_type == 'TEXTFIELD'" class="lov_autocomplete_div lovdiv">
                        <v-text-field v-if="item.is_field_required == 'Yes'" v-model="questions_array[index].answer"
                          :rules="fieldRules" class="required_field" v-bind:label="$t('type_here')" dense outlined
                          readonly></v-text-field>
                        <v-text-field v-else readonly v-bind:label="$t('type_here')" dense outlined
                          v-model="questions_array[index].answer"></v-text-field>
                      </div>
                      <div v-if="item.field_type == 'RADIO BUTTON'">
                        <v-radio-group v-model="questions_array[index].answer" readonly class="required_field" row>
                          <v-radio class="vradiogroupvfor text--primary" v-for="(
                                      lookupchild, checkindex
                                    ) in item.lookup_values" :key="checkindex" :label="lookupchild"
                            :value="lookupchild">
                          </v-radio>
                        </v-radio-group>
                      </div>
                      <div v-if="item.field_type == 'CHECKBOX'">
                        <div class="checkboxcomponent">
                          <v-checkbox :rules="fieldRules" readonly v-for="(
                                      lookupchild, checkindex
                                    ) in item.lookup_values" :key="checkindex" v-model="questions_array[index].answer"
                            :label="lookupchild" multiple color="primary" :value="lookupchild" hide-details></v-checkbox>
                        </div>
                      </div>
                      <div v-if="item.field_type == 'RANGESLIDER'" class="lov_autocomplete_div">
                        <v-range-slider hide-details class="align-center pt-2" step="1" thumb-size="22"
                          thumb-label="always" readonly></v-range-slider>
                      </div>
                    </td>
                  </tr>
                </template>
              </v-data-table>

            </v-card-text>
          </v-card>
        </v-dialog>

        <v-dialog fullscreen transition="dialog-bottom-transition" persistent v-model="showadminquestions">
          <v-card class="container">
            <v-toolbar color="primary" dark>
              <span class="headline">{{
                $t("managers_questions")
              }}</span>
              <v-spacer></v-spacer>
              <ExcelExitInterview :questions="admin_question_array" :header="header_name"
                v-if="admin_question_array.length > 0" />
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon @click="closeadmindialog" class="dialogcloseinuserdetails ml-5" v-on="on">mdi-close</v-icon>
                </template>
                <span>{{ $t("close") }}</span>
              </v-tooltip>
            </v-toolbar>
            <v-card-text class="mt-3">
              <v-data-table :headers="questions_array_headers" :items="system_admin_questions_array" :loading="initval"
                hide-default-footer disable-pagination>
                <template v-slot:item="{ item, index }">
                  <tr>
                    <td colspan="5">
                      <span v-if="item.questions">{{
                        item.questions
                      }}</span>
                    </td>
                    <td>
                      <div v-if="item.field_type == 'LOV'" class="lov_autocomplete_div mt-3">
                        <v-select v-if="item.is_field_required == 'Yes'" :rules="fieldRules" class="required_field"
                          v-model="system_admin_questions_array[index].answer
                            " readonly v-bind:label="$t('select')" :items="item.lookup_values" dense
                          outlined></v-select>
                        <v-select v-else v-bind:label="$t('select')" :items="item.lookup_values" dense outlined
                          v-model="questions_array[index].answer" readonly></v-select>
                      </div>
                      <div v-if="item.field_type == 'AUTOCOMPLETE'" class="lov_autocomplete_div mt-3">
                        <v-autocomplete v-if="item.is_field_required == 'Yes'" v-model="system_admin_questions_array[index].answer
                          " readonly :rules="fieldRules" class="required_field" v-bind:label="$t('select')"
                          :items="item.lookup_values" dense outlined></v-autocomplete>
                        <v-autocomplete v-else v-bind:label="$t('select')" :items="item.lookup_values" dense outlined
                          v-model="system_admin_questions_array[index].answer
                            " readonly="checksubmitdone"></v-autocomplete>
                      </div>
                      <div v-if="item.field_type == 'TEXTAREA'" class="lov_autocomplete_div mt-3">
                        <v-textarea v-if="item.is_field_required == 'Yes'" v-model="system_admin_questions_array[index].answer
                          " readonly :rules="fieldRules" class="required_field" v-bind:label="$t('type_here')" rows="2"
                          dense outlined></v-textarea>
                        <v-textarea v-else v-bind:label="$t('type_here')" rows="2" dense outlined v-model="system_admin_questions_array[index].answer
                          " readonly></v-textarea>
                      </div>
                      <div v-if="item.field_type == 'TEXTFIELD'" class="lov_autocomplete_div mt-3">
                        <v-text-field v-if="item.is_field_required == 'Yes'" v-model="system_admin_questions_array[index].answer
                          " :rules="fieldRules" class="required_field" v-bind:label="$t('type_here')" dense outlined
                          readonly></v-text-field>
                        <v-text-field v-else readonly v-bind:label="$t('type_here')" dense outlined v-model="system_admin_questions_array[index].answer
                          "></v-text-field>
                      </div>
                      <div v-if="item.field_type == 'RADIO BUTTON'">

                        <v-radio-group v-model="system_admin_questions_array[index].answer
                          " readonly class="required_field" row>
                          <v-radio class="vradiogroupvfor text--primary" v-for="(
                                      lookupchild, checkindex
                                    ) in item.lookup_values" :key="checkindex" :label="lookupchild"
                            :value="lookupchild">
                          </v-radio>
                        </v-radio-group>
                      </div>
                      <div v-if="item.field_type == 'CHECKBOX'">
                        <div class="checkboxcomponent">
                          <v-checkbox :rules="fieldRules" readonly v-for="(
                                      lookupchild, checkindex
                                    ) in item.lookup_values" :key="checkindex" v-model="system_admin_questions_array[index].answer
                                      " :label="lookupchild" multiple color="primary" :value="lookupchild"
                            hide-details></v-checkbox>
                        </div>
                      </div>
                      <div v-if="item.field_type == 'RANGESLIDER'" class="lov_autocomplete_div">
                        <v-range-slider hide-details class="align-center pt-2" step="1" thumb-size="22"
                          thumb-label="always" readonly></v-range-slider>
                      </div>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-sheet>
      <ConfirmDialog :show="showStatusDialog" :cancel="cancelStatus" :confirm="confirmStatus" v-bind:title="$t('confirm')"
        v-bind:description="$t('status_change')" />
      <ConfirmDialog :show="makeInactiveDialog" :cancel="cancelInactiveStatus" :confirm="confirmInactiveStatus"
        v-bind:title="$t('confirm')" v-bind:description="$t('make_emp_inactive')" />
      <ConfirmDialog :show="showprojectalert" :cancel="cancelprojectalert" v-bind:title="$t('confirm')"
        v-bind:description="description_text_message" :confirm="confirmassign" :primary_delete="delete_primary" />
    </div>
  </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
import ExcelExitInterview from "../Users/ExcellDownloadExitInterview.vue"
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import ExitProcess from "../Users/ExitProcess.vue";
import DatePicker from "../Components/DatePicker.vue";
import DocumentSelect from "../Components/Upload/DocumentSelect.vue";
import EmpSeperationProcess from "../Users/EmpSeperationProcess.vue";
import EmpQuestionAnswer from "../../Configuration/ExitInterview/EmpAnserViewHr.vue";

export default {
  components: {
    VueElementLoading,
    ConfirmDialog,
    ExitProcess,
    DatePicker,
    EmpSeperationProcess,
    DocumentSelect,
    EmpQuestionAnswer,
    ExcelExitInterview
  },

  data: () => ({
    exit_manager_array: [],
    org_employee_array: [],
    header_name: "",
    admin_question_array: [],
    primary_manager_pic: "",
    showmanagersquestions: false,
    showadminquestions: false,
    document_url: process.env.VUE_APP_IMAGE_PATH,
    empdetailsexpand: false,
    makeInactiveDialog: false,
    isDisabled: false,
    delete_primary: "",
    questions_array_headers: [
      {
        text: "Topic",
        align: "left",
        value: "",
        sortable: false,
      },
      {
        text: "",
        align: "",
        value: "",
        sortable: false,
      },
      {
        text: "",
        align: "",
        value: "",
        sortable: false,
      },
      {
        text: "",
        align: "",
        value: "",
        sortable: false,
      },
      {
        text: "",
        align: "",
        value: "",
        sortable: false,
      },
      {
        text: "Comment",
        align: "left",
        value: "",
        sortable: false,
      },
    ],
    questions_array: [],
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    showStatusDialog: false,
    user_array: [],
    loader: false,
    valid: false,
    valid1: false,
    appliedLeave: "",
    approvedLeave: "",
    rejectedLeave: "",
    cancelledLeave: "",
    lopLeave: "",
    pendingLeave: "",
    escalatedLeave: "",
    waitingLeave: "",
    submittedornot: null,
    stepper: 1,
    description_text_message: "",

    isBtnLoading: false,
    isBtnLoading1: false,
    showprojectalert: false,
    enableNovlookups: [],
    disable_save: true,
    initval: false,
    checksubmitdone: false,
    questionexistornot: false,
    system_admin_questions_array: [],
    enabled_system_admin_noc: false,
    final_releiving_process: {
      final_resigning_date: "",
      tentactive_last_working_day: "",
      available_earned_leave_as_lwd: "",
    },
    emp_seperation: {
      emp_id: "",
      enable_noc_by_manager: "Yes",
      noc_comments: "",
      primary_manager_id: 0,
      not_enable_emp_reason: "",
      system_admin_no_noc_comment: "",
      exit_interview_for_emp_enable: "Yes",
      system_admin_id: null,
      enable_noc_by_system_admin: "Yes",
      submit_system_admin_questions: null,
    },
    emp_full_final_settlement: {
      emp_id: "",
      date_of_full_and_final_settlement: "",
      amount_transferred: "",
      mode_of_transfer: "",
      releaving_documents_url: "",
      transfer_reference: "",
    },
    enable_document_select: "",
    isBtnLoadingapproveonbehalf: false,
    primary_manager_name: "",
  }),
  mounted() {
    this.fetchfandf();
  },
  created() {
    this.fetchlookup();
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.fetchemployeeDetails();
          this.fetchManagerQuestions();
        }
      },
    },
  },

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },
  methods: {
    showdialogadmin() {
      this.showadminquestions = true;
      this.admin_question_array = this.system_admin_questions_array;
      this.header_name = "System Admin Questions";
    },
    closeadmindialog() {
      this.admin_question_array = [];
      this.header_name = "";
      this.showadminquestions = false;
    },
    showmanagerdialogarray() {
      this.showmanagersquestions = true
      this.admin_question_array = this.questions_array;
      this.header_name = "Managers Questions";
    },
    closemanaserdialogarray() {
      this.admin_question_array = [];
      this.header_name = "";
      this.showmanagersquestions = false;
    },
    changeSystemadminradio() {
      this.emp_seperation.system_admin_id = null;
      this.emp_seperation.system_admin_no_noc_comment = '';
    },
    fetchallManagersList() {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
          "fetchsystemadmins/" +
          this.user_array.id
        )
        .then((res) => {
          this.org_employee_array = res.data.allmanagers;
          this.initval = false;
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          this.initval = false;
          console.log(" error" + err);
        });
    },
    cancelprojectalert() {
      this.showprojectalert = false;
      // this.dialog = true;
    },

    confirmassign() {
      this.showprojectalert = false;
      // this.dialog = true;
    },

    fetchManagerQuestions() {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
          "fetchmanagerquestionsforexitemployee/" +
          this.$route.query.slug
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.questions_array = res.data.question;
            this.questionexistornot = res.data.finish;
            if (res.data.submit == 1) {
              this.checksubmitdone = true;
            } else {
              this.checksubmitdone = false;
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

      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
          "fetchsystemadminquestionsforexitemployee/" +
          this.$route.query.slug
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.system_admin_questions_array = res.data.question;
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
    fetchfandf() {
      this.loader = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
          "fetchempfullfinalsettlement/" +
          this.user_array.id
        )
        .then((res) => {
          if(this.stepper!=1){
            this.loader = false;
          }
          if (res.data.status == "S") {
            if (res.data.emp_full_final_settlement != null) {
              this.emp_full_final_settlement =
                res.data.emp_full_final_settlement;
              this.disable_save = false;
            }
          }
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
    uploadedDocument(file_path) {
      console.log(
        "substring doc will be emp seperation pages",
        file_path.substring(23)
      );
      // this.emp_full_final_settlement.releaving_documents_url = file_path.substring(
      //   23
      // );
      this.emp_full_final_settlement.releaving_documents_url = file_path;
      this.closeDocumentSelectDialog();
    },
    closeDocumentSelectDialog() {
      this.enable_document_select = "";
      // console.log("close dialog", uploadtype);
    },
    callDocumentSelect() {
      this.enable_document_select = "DragDrop";
    },
    updatestepper() {
      this.stepper = 2;
    },
    hrstepper() {
      this.stepper = 3;
    },
    hrstepper2() {
      this.stepper = 5;
    },
    formatted_from_date(formatted_date) {
      this.final_releiving_process.final_resigning_date = formatted_date;
    },
    formatted_final_date(formatted_date) {
      this.emp_full_final_settlement.date_of_full_and_final_settlement =
        formatted_date;
    },
    confirmInactiveStatus() {
      this.makeInactiveDialog = false;
      this.makeEmpInactive();
    },
    cancelInactiveStatus() {
      this.makeInactiveDialog = false;
    },
    makeEmpInactivedialog() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_manager_project", {
          params: {
            emp_id: this.user_array.id,
          },
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.emp_project_exist = res.data.emp_proeject_exist;
            if (this.emp_project_exist) {
              this.showprojectalert = true;
              this.delete_primary = "Primary";
              this.description_text_message =
                "Please change the project assigned to " +
                this.emp_project_exist.manager_details.Full_Code +
                " and comeback again";

              // alert(this.emp_project_exist);
            } else {
              this.makeInactiveDialog = true;
            }
          }
        });
    },
    confirmStatus() {
      this.showStatusDialog = false;
      this.approveonbehalf();
    },
    cancelStatus() {
      this.showStatusDialog = false;
    },
    approveonbehalf() {
      this.isBtnLoadingapproveonbehalf = true;
      this.emp_seperation.emp_id = this.user_array.id;
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "approveonbehalf", {
          emp_id: this.emp_seperation.emp_id,
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.isBtnLoadingapproveonbehalf = false;
            this.flashMessage.success({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.fetchEmpSeperateProcess();
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
          this.isBtnLoading = false;
        });
    },
    getdatasuccess(getdatasuccess) {
      if (getdatasuccess > 0) {
        this.loader = false;
      }
    },
    fetchEmpSeperateProcess() {
      this.loader = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
          "fetchemployeeseperateprocess/" +
          this.user_array.id
        )
        .then((res) => {
          if(this.stepper!=1){
            this.loader = false;
          }
          if (res.data.status == "S") {
            if (res.data.data) {
              this.emp_seperation = res.data.data;

              if (res.data.data.exit_interview_for_emp_enable == null) {
                this.emp_seperation.exit_interview_for_emp_enable = "Yes";
                this.emp_seperation.enable_noc_by_manager = "Yes";
                this.emp_seperation.enable_noc_by_system_admin = "Yes";
              }
            }
          }
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
    saveEmpseperation(type) {
      if (this.$refs.emp_sep_form.validate()) {
        this.isBtnLoading = true;
        this.emp_seperation.emp_id = this.user_array.id;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN +
            "saveemployeeseperationfromexitinterview",
            this.emp_seperation
          )
          .then((res) => {
            if (res.data.status == "S") {
              this.isBtnLoading = false;
              this.flashMessage.success({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.fetchEmpSeperateProcess();
              if (type == 'savennext') {
                this.stepper = 3;
              }
            } else if (res.data.status == "NOTFOUND") {
              this.isBtnLoading = false;
              this.flashMessage.error({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
            } else if (res.data.status == "NOTEDIT") {
              this.isBtnLoading = false;
              this.flashMessage.error({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.fetchEmpSeperateProcess();
            }
          })
          .catch((err) => {
            this.isBtnLoading = false;
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            console.log(" error" + err);
          });
      }
    },
    changeNOCmanager() {
      this.emp_seperation.noc_comments = '';
      this.fetchPrimaryManagerDetails();
    },
    savefandf() {
      this.emp_full_final_settlement.emp_id = this.user_array.id;
      if (this.$refs.fandf.validate()) {
        this.isBtnLoading = true;
        this.emp_seperation.emp_id = this.user_array.id;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "saveempfullfinalsettlement",
            this.emp_full_final_settlement
          )
          .then((res) => {
            if (res.data.status == "S") {
              this.isBtnLoading = false;
              this.flashMessage.success({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.fetchEmpSeperateProcess();
            } else if (res.data.status == "NOTFOUND") {
              this.isBtnLoading = false;
              this.flashMessage.error({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
            } else if (res.data.status == "NOTEDIT") {
              this.isBtnLoading = false;
              this.flashMessage.error({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.fetchEmpSeperateProcess();
            }
          })
          .catch((err) => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            console.log(" error" + err);
            this.isBtnLoading = false;
          });
      }
    },
    makeEmpInactive() {
      if (this.$refs.final_releiving_process.validate()) {
        this.isBtnLoading1 = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN +
            "makempinactivefromexitinterview",
            {
              resigningDate: this.final_releiving_process.final_resigning_date,
              empID: this.user_array.id,
            }
          )
          .then((res) => {
            if (res.data.status == "S") {
              this.flashMessage.success({
                message: res.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.fetchEmpLeavesDetails();
              this.isBtnLoading1 = false;
            }
          })
          .catch((err) => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            console.log(" error" + err);
            this.isBtnLoading1 = false;
          });
      }
    },

    fetchEmpLeavesDetails() {
      this.loader = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
          "fetchemployeeleavedetailscount/" +
          this.user_array.id
        )
        .then((res) => {
          if (res.data.status == "S") {
            if(this.stepper!=1){
            this.loader = false;
          }
            this.appliedLeave = res.data.applied;
            this.approvedLeave = res.data.approved;
            this.rejectedLeave = res.data.rejected;
            this.cancelledLeave = res.data.cancelled;
            this.lopLeave = res.data.lop;
            this.pendingLeave = res.data.pending;
            this.escalatedLeave = res.data.escalated;
            this.waitingLeave = res.data.waiting;
            this.final_releiving_process.available_earned_leave_as_lwd =
              res.data.available_EL;
            this.final_releiving_process.tentactive_last_working_day =
              res.data.LWD;
            this.final_releiving_process.final_resigning_date =
              res.data.resignDate;
            this.submittedornot = res.data.submittedornot;
          }
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

    setExitinterview(value) {
      // if (value == 'No') {
      //     this.emp_seperation.exit_interview_for_emp_enable = 'Yes';
      // }
      // else {
      //     this.emp_seperation.exit_interview_for_emp_enable = 'No';
      // }
      this.emp_seperation.noc_comments = "";
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
          //     this.emp_seperation.exit_interview_for_emp_enable='Yes'
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
          "fetchuserbyslug?slug=" +
          this.$route.query.slug
        )
        .then((res) => {
          if(this.stepper!=1){
            this.loader = false;
          }
          if (res.data.status == "S") {
            this.user_array = res.data.user;
            this.emp_seperation.emp_id = res.data.user.id;
            this.fetchPrimaryManagerDetails();
            this.fetchEmpSeperateProcess();
            this.fetchEmpLeavesDetails();
            this.fetchallManagersList();
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
          if(this.stepper!=1){
            this.loader = false;
          }
          if (res.data.status == "S") {
            this.exit_manager_array = res.data.allmanager_list;
            this.primary_manager_name = res.data.manager;
            this.primary_manager_pic = res.data.profile;
            this.emp_seperation.primary_manager_id = res.data.managerID;
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
  },
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

.v-stepper__label {
  min-width: 130px !important;
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

.usernamegreenheadingexpandstyle {
  color: #185918;
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

.uppercase {
  text-transform: uppercase;
}

.download_color {
  color: #3f6ad8;
  font: size 15px;
  margin-top: -23px;
  cursor: pointer;
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

.browsedivdoc /deep/ .v-text-field__details {
  display: none;
}

.leavedetailscard {
  font-size: 15px;
  text-align: center;
  font-weight: 500;
  /* font-family: "Roboto"; */
  background-color: rgb(22, 113, 205);
  height: 35px;
  color: #eeeeee;
  padding-top: 5px;
}

.leavecountcard {
  text-align: center;
  font-size: 20px;
  /* font-family: sans-serif; */
  font-weight: 500;
  /* border: solid 1px dodgerblue; */
}

.documentdownloadapplyleave {
  position: absolute;
  right: 3px;
  top: 40px;
  font-size: 13px;
  font-weight: 600;
}

.download_margin {
  margin-top: -20px;
}

.documentdownloadapplyleave:hover {
  font-weight: 700;
  cursor: pointer;
}

.documentdeleteapplyleave {
  position: absolute;
  left: -22px;
  top: 9px;
  cursor: pointer;
}

.expandableicondivclass {
  position: absolute !important;
  right: 96px !important;
  top: 56px !important;
}

.primarymanagerprofilepicclass {
  height: 25px !important;
  min-width: 25px !important;
  width: 25px !important;
  margin-right: 5px !important;
}

.expandablecloseicondivclass {
  position: absolute !important;
  right: 9px !important;
  top: 31px !important;
}

.checkboxcomponent {
  display: inline-flex;
  margin-bottom: 13px;
}

.checkboxcomponent .v-label {
  margin-right: 25px !important;
  margin-bottom: 0px !important;
}

.vradiogroupvfor .v-label {
  margin-bottom: 0px !important;
}

.noc_radio_groups /deep/ .v-label {
  margin-bottom: 0px !important;
}

.lovdiv {
  margin-top: 27px;
}
</style>