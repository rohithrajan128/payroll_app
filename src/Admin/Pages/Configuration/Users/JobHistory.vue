<template>
  <div class="main-20">
    <div>
      <v-tabs v-model="tab">
        <v-tab>{{ $t("current") }}</v-tab>
        <v-tab>{{ $t("previous") }}</v-tab>
        <div v-if="tab == 1" class="addbtndiv">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                v-if="view == 'userview' && status"
                class="btn mr-2 hover_shine add_new addbtn"
                small
                v-on="on"
                @click="dialog_open_when_add"
                >{{ $t("add") }}</v-btn
              >
            </template>
            <span>{{ $t("add") }}</span>
          </v-tooltip>
        </div>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <div>
            <v-data-table
              :loading="initval"
              :headers="headers"
              :items="current_job"
              v-bind:no-data-text="$t('no_data_available')"
              :footer-props="{ 'items-per-page-text': $t('rows_per_page') }"
            >
              <template v-slot:item="props">
                <tr>
                  <td>{{ props.item.employer_name }}</td>
                  <td>
                    {{ props.item.job_history_employee_type.employee_type }}
                  </td>
                  <!-- <td>{{ props.item.job_history_employee_status_type.shortname }}</td> -->

                  <td>{{ props.item.start_date | formatDate }}</td>
                  <td>{{ props.item.end_date | formatDate }}</td>
                  <td>
                    {{ getEmployeeExperience(joining_date) }}
                  </td>
                  <!-- <td>{{ props.item.manager_details.total_experience  }}</td> -->
                  <!-- <td>{{ props.item.end_date }}</td> -->
                  <td>
                    <!-- {{manager_details}} -->
                    <span
                      v-for="(manager, manager_index) in filterdManager(
                        props.item.start_date,
                        props.item.end_date
                      )"
                      :key="manager_index"
                    >
                      <v-chip
                        color="primary"
                        small
                        outlined
                        medium
                        class="userindexcodechip mr-1"
                      >
                        {{ manager }}
                      </v-chip>
                    </span>
                  </td>
                  <!-- <td v-else>{{ $t('not_appllicable') }}</td> -->
                  <td>{{ props.item.designation }}</td>
                </tr>
              </template>
            </v-data-table>
          </div>
        </v-tab-item>
        <v-tab-item>
          <div>
            <v-data-table
              :loading="initval"
              :headers="headers"
              :items="job_history"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              v-bind:no-data-text="$t('no_data_available')"
              :footer-props="{ 'items-per-page-text': $t('rows_per_page') }"
            >
              <template v-slot:item="{ item, expand, isExpanded }">
                <tr v-bind:class="[]">
                  <td>{{ item.employer_name }}</td>
                  <td>{{ item.job_history_employee_type.employee_type }}</td>
                  <!-- <td>{{ props.item.job_history_employee_status_type.shortname }}</td> -->
                  <td>{{ item.start_date | formatDate }}</td>
                  <td v-if="item.end_date">{{ item.end_date | formatDate }}</td>
                  <td v-else>{{ $t("not_appllicable") }}</td>
                  <td>{{ getPreviuosExp(item.start_date, item.end_date) }}</td>
                  <td v-if="item.previous_emp_id">
                    {{ item.previous_emp_id }}
                  </td>
                  <td v-else>{{ $t("not_appllicable") }}</td>
                  <td>{{ item.designation }}</td>
                  <td
                    class="text-center px-0"
                    v-if="view == 'userview' && status"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon
                          small
                          class="mr-3 edit_btn icon_size"
                          v-on="on"
                          @click="editJobDialog(item.id)"
                          >mdi-pencil-outline</v-icon
                        >
                      </template>
                      <span>{{ $t("edit") }}</span>
                    </v-tooltip>

                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon
                          class="delete_btn icon_size"
                          v-on="on"
                          small
                          @click="deleteItem(item.id)"
                          >mdi-trash-can-outline</v-icon
                        >
                      </template>
                      <span>{{ $t("delete") }}</span>
                    </v-tooltip>
                  </td>
                  <td class="text-end" @click="expand(!isExpanded)">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn icon v-if="isExpanded == false" v-on="on">
                          <v-icon>mdi-arrow-down-drop-circle-outline</v-icon>
                        </v-btn>
                        <v-btn icon v-else>
                          <v-icon>mdi-arrow-up-drop-circle-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t("view_details") }}</span>
                    </v-tooltip>
                  </td>
                </tr>
              </template>

              <template v-slot:expanded-item="{ headers, item }">
                <tr class="child_row">
                  <td :colspan="headers.length" class="childtd p-0">
                    <v-simple-table class="simpletableformetricdisplay">
                      <template v-slot:default>
                        <thead class="header_items">
                          <tr>
                            <th class="text-left">
                              <b class="simpledatatableheader">
                                {{ $t("last_rep_manager") }}
                              </b>
                            </th>
                            <th class="text-left">
                              <b class>
                                {{ $t("rep_manager_designation") }}
                              </b>
                            </th>

                            <th class="text-left">
                              <b class="simpledatatableheader">{{
                                $t("last_rep_manager_email")
                              }}</b>
                            </th>
                            <th class="text-left">
                              <b class="simpledatatableheader">{{
                                $t("ctc")
                              }}</b>
                            </th>
                            <th class="text-left">
                              <b class="simpledatatableheader">{{
                                $t("exit_formality_status")
                              }}</b>
                            </th>
                            <th class="text-left">
                              <b class="simpledatatableheader">{{
                                $t("reason_exit_pending")
                              }}</b>
                            </th>
                          </tr>
                        </thead>
                        <tbody v-if="item">
                          <tr>
                            <td class="text-left">
                              {{ item.last_reporting_manager }}
                            </td>
                            <td class="text-left">
                              {{ item.reporting_manager_designation }}
                            </td>
                            <td class="text-left">
                              {{ item.last_manager_email }}
                            </td>
                            <td class="text-left">{{ item.ctc }}</td>
                            <td class="text-left">
                              {{ item.exit_formality_status }}
                            </td>
                            <td class="text-left">
                              {{ item.reason_exit_pending }}
                            </td>
                          </tr>
                        </tbody>
                        <tbody v-else>
                          <td>
                            <div class="text-secondary text-center">
                              <p class="pl-3">{{ $t("no_details_found") }}</p>
                            </div>
                          </td>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </td>
                </tr>
                <tr class="child_row">
                  <td :colspan="headers.length" class="childtd p-0">
                    <v-simple-table class="simpletableformetricdisplay">
                      <template v-slot:default>
                        <thead class="header_items">
                          <tr>
                            <th class="text-left">
                              <b class="simpledatatableheader">{{
                                $t("notice_period_status")
                              }}</b>
                            </th>
                            <th class="text-left">
                              <b class="simpledatatableheader">{{
                                $t("reason_for_pending_notice")
                              }}</b>
                            </th>
                            <th class="text-left">
                              <b class="simpledatatableheader">{{
                                $t("hr_name")
                              }}</b>
                            </th>
                            <th class="text-left">
                              <b class="simpledatatableheader">{{
                                $t("hr_email")
                              }}</b>
                            </th>
                            <th class="text-left">
                              <b class="simpledatatableheader">{{
                                $t("hr_contact")
                              }}</b>
                            </th>
                            <th class="text-left">
                              <b class="simpledatatableheader">{{
                                $t("reason_for_leave")
                              }}</b>
                            </th>
                          </tr>
                        </thead>
                        <tbody v-if="item">
                          <tr>
                            <td class="text-left">
                              {{ item.notice_period_status }}
                            </td>
                            <td class="text-left">
                              {{ item.reason_for_pending_notice }}
                            </td>

                            <td class="text-left">{{ item.hr_name }}</td>
                            <td class="text-left">{{ item.hr_email }}</td>
                            <td class="text-left">{{ item.hr_contact }}</td>
                            <td class="text-left">
                              {{ item.reason_for_leaving }}
                            </td>
                          </tr>
                        </tbody>
                        <tbody v-else>
                          <td>
                            <div class="text-secondary text-center">
                              <p class="pl-3">{{ $t("no_details_found") }}</p>
                            </div>
                          </td>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </div>
        </v-tab-item>
      </v-tabs-items>
      <v-dialog
        persistent
        v-model="dialog"
        fullscreen
        transition="dialog-bottom-transition"
        max-width="1100px"
      >
        <v-card>
          <v-toolbar color="primary" dark>
            <span class="headline">{{ $t("create_amend_job_history") }}</span>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  @click="close"
                  class="dialogcloseinuserdetails"
                  v-on="on"
                  >mdi-close</v-icon
                >
              </template>
              <span>{{ $t("close") }}</span>
            </v-tooltip>
          </v-toolbar>
          <v-form ref="userform" v-model="valid">
            <template>
              <v-stepper v-model="e1">
                <v-stepper-header>
                  <v-stepper-step :complete="e1 > 1" step="1">
                    {{ $t("job_position") }}
                  </v-stepper-step>
                  <v-divider></v-divider>

                  <v-stepper-step :complete="e1 > 2" step="2">
                    {{ $t("reporting_manager_details") }}
                  </v-stepper-step>

                  <v-divider></v-divider>

                  <v-stepper-step step="3">
                    {{ $t("other_details") }}
                  </v-stepper-step>
                </v-stepper-header>

                <v-stepper-items>
                  <v-stepper-content step="1">
                    <!-- <v-card
          class="mb-12"
          height="200px"
                    >-->

                    <v-form ref="jobpositionform" class="mt-3" v-model="valid">
                      <FlashMessage
                        :position="'right bottom'"
                        style="position: fixed; z-index: 15000"
                      ></FlashMessage>

                      <v-layout wrap>
                        <v-flex xs12 sm6 md4 pl-2>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-on="on"
                                v-model="job_model.employer_name"
                                :rules="fieldRules"
                                dense
                                v-bind:label="$t('organisation')"
                                outlined
                                class="required_field"
                              ></v-text-field>
                            </template>
                            <span>{{ $t("organisation") }}</span>
                          </v-tooltip>
                        </v-flex>

                        <v-flex xs12 sm6 md4 pl-2 mr-2>
                          <v-autocomplete
                            v-model="job_model.type_id"
                            :rules="fieldRules"
                            :items="employee_type"
                            item-value="id"
                            item-text="employee_type"
                            dense
                            v-bind:label="$t('emp_type')"
                            outlined
                            class="required_field"
                          ></v-autocomplete>
                        </v-flex>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-bind:label="$t('employee_number')"
                              v-on="on"
                              index="id"
                              item-value="id"
                              item-text="longname"
                              @keyup="uppercaseemployeeno"
                              v-model="job_model.previous_emp_id"
                              :rules="fieldRules"
                              outlined
                              dense
                              class="required_field mt_30"
                            ></v-text-field>
                          </template>
                          <span>{{ $t("employee_number") }}</span>
                        </v-tooltip>
                      </v-layout>

                      <v-layout wrap>
                        <v-flex xs12 sm6 md4 pl-2 pr-2>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-on="on"
                                v-model="job_model.job_location"
                                dense
                                v-bind:label="$t('job_location')"
                                outlined
                              ></v-text-field>
                            </template>
                            <span>{{ $t("job_location") }}</span>
                          </v-tooltip>
                        </v-flex>
                        <v-flex xs12 sm6 md4 pl-2>
                          <DatePicker
                            :label="$t('start_date')"
                            :stored_date="job_model.start_date"
                            :rules="fieldRules"
                            :class_required="'RequiredField'"
                            :max="job_model.end_date"
                            @formatted_date="formattedStartDate"
                          />
                        </v-flex>
                        <v-flex xs12 sm6 md4 pl-2>
                          <DatePicker
                            :label="$t('end_date')"
                            :stored_date="job_model.end_date"
                            :max="new Date().toISOString().substr(0, 10)"
                            :rules="fieldRules"
                            :class_required="'RequiredField'"
                            :min="job_model.start_date"
                            @formatted_date="formattedEndDate"
                          />
                        </v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 sm6 md4 pl-2 class="align-self-center">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-on="on"
                                v-model="job_model.designation"
                                :rules="fieldRules"
                                dense
                                v-bind:label="$t('last_held_design')"
                                outlined
                                class="required_field"
                              ></v-text-field>
                            </template>
                            <span>{{ $t("last_held_design") }}</span>
                          </v-tooltip>
                        </v-flex>

                        <v-flex xs12 sm6 md4 pl-2 class="align-self-center">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-on="on"
                                v-model="job_model.ctc"
                                :rules="fieldRules"
                                dense
                                v-bind:label="$t('last_held_ctc')"
                                outlined
                                maxlength="30"
                                class="required_field"
                              ></v-text-field>
                            </template>
                            <span>{{ $t("last_held_ctc") }}</span>
                          </v-tooltip>
                        </v-flex>
                        <v-flex xs12 sm6 md4 pl-2 class>
                          <div class="browsedivdoc">
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  readonly
                                  outlined
                                  dense
                                  v-on="on"
                                  @click="callDocumentSelect"
                                  v-model="job_model.doct_type"
                                  v-bind:label="$t('upload_doc')"
                                ></v-text-field>
                                <v-chip
                                  label
                                  class="browsebtndoc"
                                  @click="callDocumentSelect"
                                  color="primary"
                                  v-on="on"
                                >
                                  {{ $t("browse") }}
                                </v-chip>
                              </template>
                              <span>{{ $t("upload_doc") }}</span>
                            </v-tooltip>
                          </div>
                          <div
                            v-if="job_model.doct_type"
                            class="documentdownloadapplyleave"
                          >
                            <a
                              :href="document_url + job_model.doct_type"
                              class="text-primary f-13 a-underline"
                            >
                              {{ $t("download") }}
                            </a>
                          </div>
                        </v-flex>
                        <v-flex xs12 sm6 md4 style="display: none">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <span v-on="on">
                                <DocumentSelect
                                  :label="'Proof '"
                                  :folder="'ProofDocument'"
                                  :uploadtype="enable_document_select"
                                  @closeDialog="closeDocumentSelectDialog"
                                  @uploadedDocument="uploadedDocument"
                                  :documentlink="job_model.doct_type"
                                ></DocumentSelect>
                              </span>
                            </template>
                            <span>{{ $t("file_input") }}</span>
                          </v-tooltip>
                        </v-flex>
                      </v-layout>
                    </v-form>

                    <!-- </v-card> -->
                    <div class="position-fixed">
                      <v-btn small @click="close()" class="secondary">
                        {{ $t("cancel") }}
                      </v-btn>

                      <v-btn
                        color="primary"
                        class="ml-2"
                        :disabled="isDisabled"
                        @click="SubmitEmployeeOfficialDetails('nextpage')"
                        small
                      >
                        {{ $t("save_next") }}
                        <b-spinner
                          :disabled="isBtnLoading"
                          small
                          v-if="isBtnLoading"
                        ></b-spinner>
                      </v-btn>

                      <v-btn
                        color="primary"
                        class="ml-2"
                        :disabled="saveDisabled"
                        @click="SubmitEmployeeOfficialDetails('samepage')"
                        small
                      >
                        {{ $t("save") }}
                        <b-spinner
                          :disabled="saveBtnLoading"
                          small
                          v-if="saveBtnLoading"
                        ></b-spinner>
                      </v-btn>
                    </div>
                  </v-stepper-content>

                  <v-stepper-content step="2">
                    <v-div class="mb-12" height="200px">
                      <v-form
                        ref="managerdetailsform"
                        class="mt-3"
                        v-model="valid"
                      >
                        <FlashMessage
                          :position="'right bottom'"
                          style="position: fixed; z-index: 15000"
                        ></FlashMessage>

                        <v-layout wrap>
                          <v-flex xs12 sm6 md4 pl-2>
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  v-on="on"
                                  v-model="job_model.last_reporting_manager"
                                  dense
                                  required
                                  :rules="fieldRules"
                                  class="required_field"
                                  v-bind:label="$t('last_rep_manager')"
                                  outlined
                                ></v-text-field>
                              </template>
                              <span>{{ $t("last_rep_manager") }}</span>
                            </v-tooltip>
                          </v-flex>
                          <v-flex xs12 sm6 md4 pl-2>
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  v-on="on"
                                  v-model="
                                    job_model.reporting_manager_designation
                                  "
                                  dense
                                  v-bind:label="$t('rep_manager_designation')"
                                  outlined
                                ></v-text-field>
                              </template>
                              <span>{{ $t("rep_manager_designation") }}</span>
                            </v-tooltip>
                          </v-flex>

                          <v-flex xs12 sm6 md4 pl-2>
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  v-on="on"
                                  v-model="job_model.last_manager_email"
                                  v-bind:label="$t('last_rep_manager_email')"
                                  dense
                                  :rules="[...emailRules]"
                                  outlined
                                ></v-text-field>
                              </template>
                              <span>{{ $t("last_rep_manager_email") }}</span>
                            </v-tooltip>
                          </v-flex>
                        </v-layout>
                      </v-form>
                    </v-div>
                    <div class="position-fixed">
                      <v-btn small @click="close()" class="secondary mr-2">
                        {{ $t("cancel") }}
                      </v-btn>
                      <v-btn small @click="e1 = 1" class="primary">
                        {{ $t("previous") }}
                      </v-btn>
                      <v-btn
                        color="primary"
                        class="ml-2"
                        :disabled="isDisabled"
                        @click="SubmitEmployeeOfficialDetails('nextpage')"
                        small
                      >
                        {{ $t("save_next") }}
                        <b-spinner
                          :disabled="isBtnLoading"
                          small
                          v-if="isBtnLoading"
                        ></b-spinner>
                      </v-btn>
                      <v-btn
                        color="primary"
                        class="ml-2"
                        :disabled="saveDisabled"
                        @click="SubmitEmployeeOfficialDetails('samepage')"
                        small
                      >
                        {{ $t("save") }}
                        <b-spinner
                          :disabled="saveBtnLoading"
                          small
                          v-if="saveBtnLoading"
                        ></b-spinner>
                      </v-btn>
                    </div>
                  </v-stepper-content>

                  <v-stepper-content step="3">
                    <v-form ref="otherdetailsform" class="mt-3" v-model="valid">
                      <v-layout wrap>
                        <v-flex v-bind="vFlexPropsselect" pl-2>
                          <v-autocomplete
                            v-model="job_model.exit_formality_status"
                            :rules="fieldRules"
                            :items="exit_formalities_array"
                            item-value="shortname"
                            item-text="longname"
                            dense
                            v-bind:label="$t('exit_formality_status')"
                            outlined
                            class="required_field"
                          ></v-autocomplete>
                        </v-flex>

                        <v-flex
                          v-bind="vFlexProps"
                          pl-2
                          v-if="job_model.exit_formality_status == 'Pending'"
                        >
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-textarea
                                v-on="on"
                                v-model="job_model.reason_exit_pending"
                                :rules="fieldRules"
                                v-bind:label="$t('reason_for_pending')"
                                required
                                outlined
                                counter="100"
                                maxlength="100"
                                rows="1"
                                dense
                              ></v-textarea>
                            </template>
                            <span>{{ $t("reason_for_pending") }}</span>
                          </v-tooltip>
                        </v-flex>
                        <v-flex v-bind="vFlexPropsselect" pl-2>
                          <v-autocomplete
                            v-model="job_model.notice_period_status"
                            :rules="fieldRules"
                            :items="notice_period_status_array"
                            item-value="shortname"
                            item-text="longname"
                            dense
                            v-bind:label="$t('notice_period_status')"
                            outlined
                            class="required_field"
                          ></v-autocomplete>
                        </v-flex>
                        <v-flex
                          v-bind="vFlexProps1"
                          pl-2
                          v-if="job_model.notice_period_status == 'Not Served'"
                        >
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-textarea
                                v-on="on"
                                v-model="job_model.reason_for_pending_notice"
                                :rules="fieldRules"
                                v-bind:label="$t('reason_for_pending')"
                                outlined
                                counter="100"
                                maxlength="100"
                                rows="1"
                                dense
                              ></v-textarea>
                            </template>
                            <span>{{ $t("reason_for_pending") }}</span>
                          </v-tooltip>
                        </v-flex>
                      </v-layout>

                      <v-layout wrap></v-layout>

                      <v-layout>
                        <v-flex xs12 sm6 md4 pl-2>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-on="on"
                                v-model="job_model.hr_name"
                                dense
                                v-bind:label="$t('hr_name')"
                                outlined
                              ></v-text-field>
                            </template>
                            <span>{{ $t("hr_name") }}</span>
                          </v-tooltip>
                        </v-flex>

                        <v-flex xs12 sm6 md4 pl-2>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-on="on"
                                v-model="job_model.hr_email"
                                :rules="[...emailRules]"
                                dense
                                v-bind:label="$t('hr_email')"
                                outlined
                              ></v-text-field>
                            </template>
                            <span>{{ $t("hr_email") }}</span>
                          </v-tooltip>
                        </v-flex>
                        <v-flex xs12 sm6 md4 pl-2>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-on="on"
                                v-model="job_model.hr_contact"
                                maxlenght="10"
                                :rules="[...phoneRules]"
                                dense
                                v-bind:label="$t('hr_contact')"
                                outlined
                              ></v-text-field>
                            </template>
                            <span>{{ $t("hr_contact") }}</span>
                          </v-tooltip>
                        </v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 sm6 md12 pl-2>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-textarea
                                v-on="on"
                                v-model="job_model.reason_for_leaving"
                                dense
                                counter="100"
                                rows="1"
                                maxlength="100"
                                v-bind:label="$t('reasonforleaving')"
                                outlined
                              ></v-textarea>
                            </template>
                            <span>{{ $t("reasonforleaving") }}</span>
                          </v-tooltip>
                        </v-flex>
                      </v-layout>
                    </v-form>
                    <div class="position-fixed">
                      <v-btn small @click="close()" class="secondary mr-2">
                        {{ $t("cancel") }}
                      </v-btn>
                      <v-btn small @click="e1 = 2" class="primary">
                        {{ $t("previous") }}
                      </v-btn>
                      <v-btn
                        color="primary"
                        class="ml-2"
                        :disabled="saveDisabled"
                        @click="SubmitEmployeeOfficialDetails('samepage')"
                        small
                      >
                        {{ $t("save") }}
                        <b-spinner
                          :disabled="saveBtnLoading"
                          small
                          v-if="saveBtnLoading"
                        ></b-spinner>
                      </v-btn>
                    </div>
                  </v-stepper-content>
                </v-stepper-items>
              </v-stepper>
            </template>
          </v-form>
        </v-card>
      </v-dialog>
    </div>
    <ConfirmDialog
      :show="dialogDelete"
      :cancel="closeDelete"
      :confirm="deleteItemConfirm"
      :id="delete_id"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('delete_confirmation')"
    />
  </div>
</template>

<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import DatePicker from "../Components/DatePicker.vue";
import DocumentSelect from "../Components/Upload/DocumentSelect.vue";
import Tabs from "vue-tabs-with-active-line";
import moment from "moment";

const TABS = [
  {
    title: "Current",
    value: "current",
  },
  {
    title: "Previous",
    value: "previous",
  },
];

export default {
  components: {
    PageTitle,
    ConfirmDialog,
    DatePicker,
    DocumentSelect,
    Tabs,
  },
  props: ["user_id", "view", "status", "joining_date"],
  data: () => ({
    manager_details: [],
    tab: null,
    tabs: TABS,
    currentTab: "current",
    expanded: [],
    singleExpand: false,
    isExpanded: false,
    exit_formalities_array: [],
    notice_period_status_array: [],
    e1: 1,
    saveBtnLoading: false,
    saveDisabled: false,
    isDisabled: false,
    google_icon: {
      icon_name: "work_history",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    panel: [0, 1],
    current_job: [],
    tab_val: 0,
    addmorereferences: [],
    readonly: false,
    message: "",
    delete_id: "",
    dialog: false,
    initval: false,
    isBtnLoading: false,
    valid: true,
    employee_type: [],
    singleExpand: false,
    employee_status: [],
    dialogDelete: false,
    job_history: [],
    document_url: process.env.VUE_APP_IMAGE_PATH,
    referencedetails: {
      id: "0",
      name: "",
      position: "",
      email: "",
      organisation: "",
      contact_no: "",
    },
    enable_document_select: "",
    job_model: {
      id: 0,
      employer_name: "",
      type_id: "",
      previous_emp_id: "",
      last_reporting_manager: "",
      reason_for_leaving: "",
      start_date: "",
      end_date: "",
      designation: "",
      previous_empno: "",
      ctc: "",
      job_location: "",
      reporting_manager_designation: "",
      last_manager_email: "",
      exit_formality_status: "",
      reason_exit_pending: "",
      notice_period_status: "",
      reason_for_pending_notice: "",
      hr_name: "",
      hr_email: "",
      doct_type: "",
      hr_contact: "",
    },
    emp_experience: "",
    submit_credential_disable: false,
  }),
  mounted() {},
  created() {
    this.fetchlookup();
  },
  watch: {
    user_id: {
      immediate: true,
      handler() {
        this.fetchJob();
      },
    },
  },

  computed: {
    vFlexPropsselect() {
      if (
        this.job_model.exit_formality_status == "Pending" ||
        this.job_model.notice_period_status == "Not Served"
      ) {
        return {
          xs12: true,
          sm6: true,
          md2: true,
        };
      } else {
        return {
          xs12: true,
          sm6: true,
          md4: true,
        };
      }
    },
    vFlexProps() {
      if (this.job_model.notice_period_status == "Not Served") {
        return {
          xs12: true,
          sm6: true,
          md10: true,
        };
      } else {
        return {
          xs12: true,
          sm6: true,
          md8: true,
        };
      }
    },
    vFlexProps1() {
      if (this.job_model.exit_formality_status == "Pending") {
        return {
          xs12: true,
          sm6: true,
          md10: true,
        };
      } else {
        return {
          xs12: true,
          sm6: true,
          md8: true,
        };
      }
    },
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    websiteRules1() {
      return [(v) => !!v || this.$t("url_valid")];
    },
    phoneRules() {
      return [
        (v) =>
          (v >= 0 && v <= 999999999999) || this.$t("valid_number_required"),
      ];
    },
    emailRules() {
      return [
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          this.$t("email_valid"),
      ];
    },
    headers() {
      if (
        this.currentTab == "current" &&
        this.view == "userview" &&
        this.status
      ) {
        return [
          {
            text: "Organisation",
            align: "start",
            value: "emp_name",
            sortable: true,
          },
          { text: "Employment Type", value: "emp_type", sortable: true },
          // { text: 'Status', value: 'status', sortable: false },
          { text: "Start Date", value: "start_date", sortable: true },
          { text: "End Date", value: "end_date", sortable: true },
          {
            text: "Total Experience",
            value: "total_experience",
            sortable: true,
          },
          { text: "Reporting Manager", value: "manager_name", sortable: true },
          {
            text: "Designation",
            value: "last_held_des",
            sortable: true,
          },
        ];
      } else if (
        this.currentTab == "previous" &&
        this.view == "userview" &&
        this.status
      ) {
        return [
          {
            text: "Organisation",
            align: "start",
            value: "emp_name",
            sortable: true,
          },
          { text: "Employment Type", value: "emp_type", sortable: true },
          // { text: 'Status', value: 'status', sortable: false },
          { text: "Start Date", value: "start_date", sortable: true },
          { text: "End Date", value: "end_date" },
          { text: "Employee Number", value: "manager_name", sortable: true },
          {
            text: "Last Held Designation",
            value: "last_held_des",
            sortable: true,
          },
          { text: "Actions", value: "actions", sortable: true },
          { text: "", value: "view", sortable: true },
        ];
      } else {
        return [
          {
            text: "Organisation",
            align: "start",
            value: "emp_name",
            sortable: true,
          },
          { text: "Employment Type", value: "emp_type", sortable: true },
          // { text: 'Status', value: 'status', sortable: false },
          { text: "Start Date", value: "start_date", sortable: true },
          { text: "End Date", value: "end_date", sortable: true },
          { text: "Reporting Manager", value: "manager_name", sortable: true },
          {
            text: "Last Held Designation",
            value: "last_held_des",
            sortable: true,
          },
        ];
      }
    },
  },
  methods: {
    getPreviuosExp(start_date, end_date) {
      var startDate = new Date(start_date);
      var endDate = new Date(end_date);
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();
      const startMonth = startDate.getMonth();
      const endMonth = endDate.getMonth();

      const years = endYear - startYear;
      const months = endMonth - startMonth;

      return `${years} Years ${months} Months`;

      // return this.emp_experience = `${years} Years ${months} Months`;
    },
    getEmployeeExperience(joinind_date) {
      var startDate = new Date(joinind_date);
      var endDate = new Date();
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();
      const startMonth = startDate.getMonth();
      const endMonth = endDate.getMonth();

      const years = endYear - startYear;
      const months = endMonth - startMonth;
      return (this.emp_experience = `${years} Years ${months} Months`);
      // console.log(experience);
    },
    filterdManager(start_date, end_date) {
      let date = new Date().toISOString().substr(0, 10);
      return this.manager_details
        .filter(
          (item) =>
            (start_date >= item.start_date &&
              start_date <= (item.end_date || date)) ||
            ((end_date || date) >= item.start_date &&
              (end_date || date) <= (item.end_date || date))
        )
        .map((item) =>
          item.manager_details == null
            ? item.manager_data.full_name
            : item.manager_details.full_name
        );
    },
    filterdManagerExperience(start_date, end_date) {
      let date = new Date().toISOString().substr(0, 10);
      return this.manager_details
        .filter(
          (item) =>
            (start_date >= item.start_date &&
              start_date <= (item.end_date || date)) ||
            ((end_date || date) >= item.start_date &&
              (end_date || date) <= (item.end_date || date))
        )
        .map((item) =>
          item.manager_details == null
            ? item.manager_data.total_experience
            : item.total_experience
        );
    },
    uppercaseemployeeno() {
      if (this.job_model.previous_emp_id != "") {
        this.job_model.previous_emp_id =
          this.job_model.previous_emp_id.toUpperCase();
      }
    },
    handleClick(newTab) {
      this.currentTab = newTab;
    },
    uploadedDocument(file_path) {
      this.job_model.doct_type = file_path;
      this.closeDocumentSelectDialog();
    },
    closeDocumentSelectDialog(uploadtype) {
      this.enable_document_select = "";
      console.log("close dialog", uploadtype);
    },
    callDocumentSelect() {
      this.enable_document_select = "DragDrop";
    },
    SubmitEmployeeOfficialDetails(page) {
      let form_val = false;
      if (this.e1 == 1) {
        form_val = this.$refs.jobpositionform.validate();
        console.log(form_val);
      } else if (this.e1 == 2) {
        form_val = this.$refs.managerdetailsform.validate();
      } else {
        form_val = this.$refs.otherdetailsform.validate();
      }
      if (form_val == true) {
        this.job_model.emp_id = this.user_id;
        if (page == "samepage") {
          this.saveBtnLoading = true;
          this.saveDisabled = true;
          this.isDisabled = true;
        } else {
          this.isBtnLoading = true;
          this.isDisabled = true;
          this.saveDisabled = true;
        }
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "createjobhistorydetail",
            this.job_model
          )
          .then((res) => {
            if (Array.isArray(res.data.message)) {
              this.array_data = res.data.message.toString();
            } else {
              this.array_data = res.data.message;
            }
            if (res.data.status == "S") {
              this.job_model.id = res.data.JobHistory.id;
              this.isBtnLoading = false;
              this.isDisabled = false;
              this.saveBtnLoading = false;
              this.saveDisabled = false;

              if (page == "samepage") {
                this.flashMessage.success({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class",
                });
                this.message = res.data.message;

                if (this.e1 == 3) {
                  this.close();
                }
              } else {
                this.e1 = this.e1 + 1;
                // this.fetchJob();
              }
            } else if (res.data.status == "E") {
              this.flashMessage.error({
                message: this.array_data,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.isBtnLoading = false;
              this.isDisabled = false;
              this.saveBtnLoading = false;
              this.saveDisabled = false;
            } else {
              this.isBtnLoading = false;
              this.isDisabled = false;
              this.saveBtnLoading = false;
              this.saveDisabled = false;
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
            console.log(err);
          });
      }
    },
    managerCheck(job_designation, manager) {
      return (
        manager.start_date > job_designation.end_date &&
        job_designation.start_date < manager.end_date
      );

      // return true;
    },
    removelanguage(index) {
      this.job_model.addmorereferences.splice(index, 1);
    },
    fetchJob() {
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetchjobhistory/" + this.user_id
        )
        .then((res) => {
          this.job_history = res.data.data;
          this.current_job = res.data.current_job;
          let current_job_details = res.data.current_job_details;
          this.manager_details = res.data.manager_details;

          // for (var i = current_job_details.length - 1; i >= 0; i--) {
          //   var parentId = current_job_details[i].id;
          // var experience = moment(current_job_details[i].start_date).diff(
          //   moment(),
          //   "milliseconds"
          // );
          // var duration = moment.duration(experience);
          // console.log(
          //   "Current job",
          //   duration.years() / -1 +
          //     " years and " +
          //     duration.months() / -1 +
          //     " months"
          // );
          // console.log(current_job_details[i]);
          // current_job_details[i]['manager_details']=

          // var childrenToInsert = child.filter(item => item.parent_id === parentId);

          // Insert children after the current parent element
          // if (childrenToInsert.length > 0) {
          //   parent.splice(i + 1, 0, ...childrenToInsert);
          // }
          // }
          this.initval = false;
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
    fetchlookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_all_emp_no_details")
        .then((res) => {
          this.employee_type = res.data.all_employee_number_details;
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log("this error" + err);
        });

      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "EMPLOYEE_STATUS",
          },
        })
        .then((response) => {
          this.employee_status = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "EXIT_FORMALITIES_STATUS",
          },
        })
        .then((response) => {
          this.exit_formalities_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "NOTICE_PERIOD_STATUS",
          },
        })
        .then((response) => {
          this.notice_period_status_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    deleteItem(id) {
      // alert(id)
      this.delete_id = id;
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.initval = true;
      this.dialogDelete = false;
      axios
        .delete(
          process.env.VUE_APP_API_URL_ADMIN +
            "deletejobhistory/" +
            this.delete_id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.fetchJob();
            this.message = res.data.message;
            this.flashMessage.success({
              message: this.message,
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
          console.log(" error" + err);
        });
    },
    dialog_open_when_add() {
      this.e1 = 1;
      this.dialog = true;
      this.addmorelanguage();
      // this.$refs.userform.reset();
    },
    close() {
      this.dialog = false;
      this.delete_id = "";
      this.initval = false;
      this.job_model = {};
      this.job_model.addmorereferences = [];
      this.job_model.id = 0;
      this.submit_credential_disable = false;
      this.isBtnLoading = false;
      // this.$refs.userform.reset();
      this.$refs.jobpositionform.reset();
      this.$refs.managerdetailsform.reset();
      this.$refs.otherdetailsform.reset();
      this.fetchJob();
    },
    closeDelete() {
      this.dialogDelete = false;
    },
    addmorelanguage() {
      this.job_model.addmorereferences.push(this.referencedetails);
      this.referencedetails = {};
      this.referencedetails.id = 0;
      this.referencedetails.name = "";
      this.referencedetails.position = "";
      this.referencedetails.email = "";
      this.referencedetails.organisation = "";
      this.referencedetails.contact_no = "";
    },
    save() {
      if (this.$refs.userform.validate()) {
        this.submit_credential_disable = true;
        this.isBtnLoading = true;
        this.job_model.emp_id = this.user_id;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "createjobhistorydetail",
            this.job_model
          )
          .then((response) => {
            if (response.data.status == "S") {
              this.flashMessage.success({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.close();
              this.fetchJob();
            }
            if (response.data.status == "YEARERROR") {
              this.flashMessage.error({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
            }
            if (response.data.status == "YEARERROR") {
              this.flashMessage.error({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.submit_credential_disable = false;
              this.isBtnLoading = false;
            }
          })
          .catch((err) => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            console.log(err);
            this.close();
          });
      }
    },
    editJobDialog(id) {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchjobhistoryedit", {
          params: {
            id: id,
            emp_id: this.user_id,
          },
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.job_model = res.data.data;

            this.e1 = 1;
            this.dialog = true;
            this.initval = false;
          }
          if (res.data.status == "E") {
            this.flashMessage.error({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.close();
          }
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
    formattedStartDate(formatted_date) {
      this.job_model.start_date = formatted_date;

      // this.job_model.end_date = "";
    },
    formattedEndDate(formatted_date) {
      this.job_model.end_date = formatted_date;
    },

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
  },
};
</script>
<style scoped>
.userform {
  border: none;
}
.heading {
  font-weight: bold;
  font-size: 15px;
}
.values {
  font-size: 15px;
}
.expansionpaneldummydiv /deep/ .v-expansion-panel-header {
  align-items: flex-start !important;
}

.expansionpaneldummydiv .v-expansion-panel {
  flex: 1 0 25% !important;
  margin: 10px 50px !important;
  max-width: 40%;
  position: relative;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}
.theme--light.v-sheet--outlined {
  border: none;
}
.v-stepper {
  box-shadow: none !important;
}
.expansion_panel /deep/ .v-expansion-panels {
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between !important;
  list-style-type: none;
  padding: 0;
  width: 100%;
  z-index: 1;
}
.expansionpaneldummydiv /deep/ .v-expansion-panel::before {
  box-shadow: none !important;
}
.addbtndiv {
  flex-grow: inherit;
  margin-top: auto;
}
.addbtn {
  float: right !important;
}
.position-fixed {
  right: 30px;
  bottom: 20px;
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
  height: 40px;
  margin-left: -10%;
}
.browsedivdoc /deep/ .v-text-field__details {
  display: none;
}
.child_row /deep/ .header_items {
  background: #80808030 !important;
}

.childtd {
  border: 1px solid grey !important;
}
.tr_back {
  border: 1px solid black !important;
}
.tabs__item {
  font-size: 12px !important;
  font-weight: 500 !important;
}

.shadow-tabs {
  font-size: 12px !important;
  font-weight: 600 !important;
}

.tabs__item {
  /* padding: inherit !important; */
  /* margin-bottom: -3px !important; */
  align-self: end;
}
</style>
