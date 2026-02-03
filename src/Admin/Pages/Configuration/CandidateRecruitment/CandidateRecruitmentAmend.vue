<template>
  <div class="container-fluid mt-3 p-0">
    <div class="mb-3 mx-auto">
      <div class="card-header">
        <div class="card-header-tab">
          <div class="card-header-title font-size-lg text-capitalize titlewrap">
            {{ $t("create_candidate_recruitment") }}
          </div>
        </div>
      </div>
      <div class="card-body">
        <VueElementLoading
          :active="loader_main"
          spinner="bar-fade-scale"
          color="var(--primary)"
        />
        <v-stepper v-model="stepmodel" vertical>
          <v-stepper-step :complete="stepmodel > 1" step="1" editable>
            {{ $t("basic_details") }}
          </v-stepper-step>
          <v-stepper-content step="1" class="wrapper_unset">
            <v-form ref="formstep1" v-model="valid">
              <v-card>
                <v-layout pt-1>
                  <v-flex md2 sm4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          class="required_field"
                          :rules="fieldRules"
                          v-bind:label="$t('salutation')"
                          v-on="on"
                          index="id"
                          item-value="shortname"
                          item-text="longname"
                          v-model="recruitment_details.salutation"
                          :items="salutation_array"
                          outlined
                          dense
                        ></v-autocomplete>
                      </template>
                      <span>{{ $t("salutation") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-on="on"
                          v-model="recruitment_details.name"
                          :rules="fieldRules"
                          maxlength="100"
                          v-bind:label="$t('full_name')"
                          required
                          class="required_field"
                          outlined
                          dense
                        ></v-text-field>
                      </template>
                      <span>{{ $t("full_name") }}</span>
                    </v-tooltip>
                    <v-tooltip bottom> </v-tooltip>
                  </v-flex>
                  <v-flex xs12 md6 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-on="on"
                          v-model="recruitment_details.email"
                          :rules="[...fieldRules, ...emailRules]"
                          v-bind:label="$t('email')"
                          class="required_field"
                          outlined
                          dense
                        ></v-text-field>
                      </template>
                      <span>{{ $t("email") }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
                <v-layout pt-1>
                  <v-flex xs12 md4 pl-2>
                    <div class="row">
                      <div class="col-md-12">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              dense
                              outlined
                              v-bind:label="$t('country_code')"
                              v-on="on"
                              required
                              prefix="+"
                              maxlength="5"
                              :rules="fieldRules"
                              class="required_field input_field"
                              hide-details
                              v-model="recruitment_details.country_code"
                              @blur="clearfn(leave_master.min_service_year)"
                            ></v-text-field>
                          </template>
                          <span>{{ $t("min_service_period") }}</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              maxlength="15"
                              v-model="recruitment_details.mobile"
                              class="required_field select_field"
                              v-bind:label="$t('contact_no')"
                              v-on="on"
                              :rules="fieldRules"
                              @keypress.native="isNumber($event)"
                              outlined
                              dense
                            ></v-text-field>
                          </template>
                          <span>{{ $t("contact_no") }}</span>
                        </v-tooltip>
                      </div>
                    </div>
                  </v-flex>
                  <v-flex xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-select
                          v-model="recruitment_details.candidate_gender"
                          :items="genderItems"
                          item-text="longname"
                          item-value="shortname"
                          v-bind:label="$t('gender')"
                          v-on="on"
                          outlined
                          dense
                        ></v-select>
                      </template>
                      <span>{{ $t("gender") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          v-on="on"
                          v-model="recruitment_details.position_applied_for"
                          :items="postionappliedforItems"
                          item-value="id"
                          item-text="job_title"
                          v-bind:label="$t('position_applied_for')"
                          required
                          outlined
                          multiple
                          small-chips
                          dense
                        ></v-autocomplete>
                      </template>
                      <span>{{ $t("position_applied_for") }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
                <v-layout pt-1>
                  <v-flex xs12 md4 pl-2 class="createlookupflex">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-select
                          v-on="on"
                          v-model="recruitment_details.candidate_qualification"
                          :items="highereducationItems"
                          item-text="longname"
                          item-value="shortname"
                          v-bind:label="$t('highest_qualifiaction')"
                          required
                          outlined
                          dense
                          class="mr-1"
                        ></v-select>
                      </template>
                      <span>{{ $t("highest_qualifiaction") }}</span>
                    </v-tooltip>
                    <CreateLookup
                      :dropdownlabel="$t('highest_qualifiaction')"
                      lookup_parent_name="HIGHEST QUALIFICATION"
                      @lookup_data="lookupMessage"
                    ></CreateLookup>
                  </v-flex>
                  <v-flex xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="recruitment_details.courses"
                          maxlength="50"
                          v-bind:label="$t('crs')"
                          v-on="on"
                          outlined
                          dense
                        ></v-text-field>
                      </template>
                      <span>{{ $t("crs") }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-form>
          </v-stepper-content>
          <v-stepper-step :complete="stepmodel > 2" step="2" editable>
            {{ $t("current_employment_details") }}
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-radio-group
              v-model="employ_history"
              row
              class="pl-2 pt-1 experienceorfresherclass"
              @change="changeradio"
            >
              <v-radio label="Fresher" value="Fresher"></v-radio>
              <v-radio label="Experienced" value="Experienced"></v-radio>
            </v-radio-group>
            <v-form ref="formstep2" v-model="valid">
              <v-card v-show="employ_history == 'Fresher'">
                <v-layout>
                  <v-flex xs12 md4 pl-2>
                    <v-autocomplete
                      v-bind:label="$t('employoment_type')"
                      index="id"
                      item-value="shortname"
                      item-text="longname"
                      v-model="recruitment_details.emp_type_looking"
                      :rules="fieldRules"
                      :items="job_type_array"
                      multiple
                      small-chips
                      outlined
                      dense
                      class="required_field"
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-on="on"
                          v-model="recruitment_details.current_location"
                          maxlength="250"
                          v-bind:label="$t('current_location')"
                          required
                          outlined
                          dense
                        ></v-text-field>
                      </template>
                      <span>{{ $t("current_location") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex class="current_ctc_item" xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-on="on"
                          v-model="recruitment_details.expected_ctc"
                          maxlength="100"
                          v-bind:label="$t('expected_CTC')"
                          required
                          outlined
                          dense
                        ></v-text-field>
                      </template>
                      <span>{{ $t("expected_CTC") }}</span>
                    </v-tooltip>
                    <!-- <span class="text_position">{{ recruitment_details.expected_ctc }}</span> -->
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex xs12 md4 pl-2 class="createlookupflex">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-select
                          v-model="recruitment_details.notice_period"
                          :items="noticeperiodItems"
                          item-value="shortname"
                          item-text="longname"
                          v-bind:label="$t('notice_period')"
                          v-on="on"
                          outlined
                          dense
                          class="pr-1"
                        ></v-select>
                      </template>
                      <span>{{ $t("notice_period") }}</span>
                    </v-tooltip>
                    <CreateLookup
                      :dropdownlabel="$t('notice_period')"
                      lookup_parent_name="NOTICE PERIOD"
                      @lookup_data="lookupMessage"
                    ></CreateLookup>
                  </v-flex>
                  <v-flex xs12 md4 pl-2>
                    <v-combobox
                      v-model="recruitment_details.preffered_location"
                      chips
                      multiple
                      required
                      class="majorskillsetcombobox"
                      outlined
                      dense
                      v-bind:label="$t('preffered_location')"
                    >
                      <template
                        v-slot:selection="{ attrs, item, select, selected }"
                      >
                        <v-chip
                          small
                          v-bind="attrs"
                          :input-value="selected"
                          @click="select"
                          color="primary"
                          class="ma-1"
                        >
                          {{ item }}
                        </v-chip>
                      </template>
                    </v-combobox>
                  </v-flex>
                </v-layout>
              </v-card>
              <v-card v-show="employ_history != 'Fresher'">
                <v-layout pt-1>
                  <v-flex xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-on="on"
                          v-model="recruitment_details.current_company"
                          maxlength="250"
                          v-bind:label="$t('current_company')"
                          required
                          outlined
                          dense
                        ></v-text-field>
                      </template>
                      <span>{{ $t("current_company") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-on="on"
                          v-model="recruitment_details.current_designation"
                          maxlength="250"
                          v-bind:label="$t('current_designation')"
                          required
                          outlined
                          dense
                        ></v-text-field>
                      </template>
                      <span>{{ $t("current_designation") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-on="on"
                          v-model="recruitment_details.current_location"
                          maxlength="250"
                          v-bind:label="$t('current_location')"
                          required
                          outlined
                          dense
                        ></v-text-field>
                      </template>
                      <span>{{ $t("current_location") }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
                <v-layout pt-1>
                  <v-flex class="current_ctc_item" xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="recruitment_details.current_ctc"
                          maxlength="7"
                          @keypress.native="isNumber($event)"
                          v-bind:label="$t('current_CTC')"
                          v-on="on"
                          outlined
                          dense
                        ></v-text-field>
                      </template>
                      <span>{{ $t("current_CTC") }}</span>
                    </v-tooltip>
                    <span class="text_position">{{ convertToWords }}</span>
                  </v-flex>
                  <v-flex class="current_ctc_item" xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-on="on"
                          v-model="recruitment_details.expected_ctc"
                          maxlength="100"
                          v-bind:label="$t('expected_CTC')"
                          required
                          outlined
                          dense
                        ></v-text-field>
                      </template>
                      <span>{{ $t("expected_CTC") }}</span>
                    </v-tooltip>
                    <!-- <span class="text_position">{{ recruitment_details.expected_ctc }}</span> -->
                  </v-flex>
                  <v-flex xs12 md4 pl-2 class="createlookupflex">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-select
                          v-model="recruitment_details.notice_period"
                          :items="noticeperiodItems"
                          item-value="shortname"
                          item-text="longname"
                          v-bind:label="$t('notice_period')"
                          v-on="on"
                          outlined
                          dense
                          class="pr-1"
                        ></v-select>
                      </template>
                      <span>{{ $t("notice_period") }}</span>
                    </v-tooltip>
                    <CreateLookup
                      :dropdownlabel="$t('notice_period')"
                      lookup_parent_name="NOTICE PERIOD"
                      @lookup_data="lookupMessage"
                    ></CreateLookup>
                  </v-flex>
                </v-layout>
                <v-layout mt-2>
                  <v-flex xs12 md4 mt-5 pl-2>
                    <v-autocomplete
                      v-bind:label="$t('employoment_type')"
                      index="id"
                      item-value="shortname"
                      item-text="longname"
                      v-model="recruitment_details.emp_type_looking"
                      :rules="fieldRules"
                      :items="job_type_array"
                      multiple
                      small-chips
                      outlined
                      dense
                      class="required_field"
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs12 md4 pl-2>
                    <div
                      class="row text-center pl-3 pb-1"
                      style="font-size: 16px"
                    >
                      {{ $t("total_work_experience") }}
                    </div>
                    <div class="row pr-4 pl-1">
                      <v-layout pt-1>
                        <v-flex xs12 md6 pl-2>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-select
                                v-on="on"
                                @change="
                                  yearchange(
                                    recruitment_details.total_experience_year
                                  )
                                "
                                v-model="
                                  recruitment_details.total_experience_year
                                "
                                :items="total_year_items"
                                v-bind:label="$t('select_year')"
                                required
                                outlined
                                dense
                              ></v-select>
                            </template>
                            <span>{{ $t("select_year") }}</span>
                          </v-tooltip>
                        </v-flex>
                        <v-flex xs12 md6 pl-2>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-select
                                v-on="on"
                                @change="
                                  monthchange(
                                    recruitment_details.total_experience_months
                                  )
                                "
                                v-model="
                                  recruitment_details.total_experience_months
                                "
                                :items="total_month_items"
                                v-bind:label="$t('select_month')"
                                required
                                outlined
                                dense
                              ></v-select>
                            </template>
                            <span>{{ $t("select_month") }}</span>
                          </v-tooltip>
                        </v-flex>
                      </v-layout>
                    </div>
                  </v-flex>
                  <v-flex xs12 md4 pl-2>
                    <div
                      class="row text-center pl-3 pb-1"
                      style="font-size: 16px"
                    >
                      {{ $t("relevant_work_experience") }}
                    </div>
                    <div class="row pr-4 pl-1">
                      <v-layout pt-1>
                        <v-flex xs12 md6 pl-2>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-select
                                v-on="on"
                                @change="
                                  monthchange(
                                    recruitment_details.total_experience_months
                                  )
                                "
                                v-model="
                                  recruitment_details.relevant_experience
                                "
                                :items="relevant_year_items"
                                v-bind:label="$t('select_year')"
                                required
                                outlined
                                dense
                              ></v-select>
                            </template>
                            <span>{{ $t("select_year") }}</span>
                          </v-tooltip>
                        </v-flex>
                        <v-flex xs12 md6 pl-2>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-select
                                v-on="on"
                                v-model="
                                  recruitment_details.relevant_experience_months
                                "
                                :items="relevant_month_items"
                                v-bind:label="$t('select_month')"
                                required
                                outlined
                                dense
                              ></v-select>
                            </template>
                            <span>{{ $t("select_month") }}</span>
                          </v-tooltip>
                        </v-flex>
                      </v-layout>
                    </div>
                  </v-flex>
                </v-layout>
                <v-layout mt-2>
                  <v-flex xs12 md4 pl-2>
                    <v-combobox
                      v-model="recruitment_details.preffered_location"
                      chips
                      multiple
                      required
                      outlined
                      dense
                      v-bind:label="$t('preffered_location')"
                      class="majorskillsetcombobox"
                    >
                      <template
                        v-slot:selection="{ attrs, item, select, selected }"
                      >
                        <v-chip
                          small
                          v-bind="attrs"
                          :input-value="selected"
                          @click="select"
                          color="primary"
                          class="ma-1"
                        >
                          {{ item }}
                        </v-chip>
                      </template>
                    </v-combobox>
                  </v-flex>
                  <!-- :min="new Date().toISOString().substr(0, 10)" -->
                </v-layout>
              </v-card>
            </v-form>
          </v-stepper-content>
          <v-stepper-step :complete="stepmodel > 3" step="3" editable>
            {{ $t("skills") }}
          </v-stepper-step>
          <v-stepper-content step="3">
            <v-form ref="formstep3" v-model="valid">
              <div
                v-for="(skills, i) in skillsArray"
                :key="i"
                elevation="5"
                class="mb-4"
                v-bind:class="[
                  skillsArray.length > 1 && i != skillsArray.length - 1
                    ? 'bottomborderloop'
                    : '',
                ]"
              >
                <v-layout pt-1>
                  <v-flex
                    xs12
                    md3
                    class="createlookupflex"
                    v-if="candidateskillsitems"
                  >
                    <v-autocomplete
                      v-model="skills.skills"
                      required
                      class="required_field"
                      outlined
                      dense
                      :error="skills.multipleError"
                      :error-messages="skills.multipleErrorMessage"
                      @change="changeSkills(skills.skills, i)"
                      :rules="fieldRules"
                      :items="candidateskillsitems"
                      item-text="longname"
                      item-value="longname"
                      v-bind:label="$t('skill')"
                    >
                    </v-autocomplete>
                    <CreateLookup
                      :dropdownlabel="$t('skills')"
                      lookup_parent_name="TECHNICAL_SKILLS_HEADER"
                      @lookup_data="lookupMessage"
                    ></CreateLookup>
                  </v-flex>
                  <v-flex xs12 md3 pl-1>
                    <v-autocomplete
                      v-bind:label="$t('proficiency')"
                      index="id"
                      item-value="shortname"
                      item-text="longname"
                      v-model="skills.proficiency"
                      :items="skillsproficiencyarray"
                      outlined
                      dense
                    >
                    </v-autocomplete>
                  </v-flex>
                  <v-flex xs12 md3 pl-1>
                    <v-text-field
                      v-model="skills.total_experience"
                      v-bind:label="$t('total_experience')"
                      maxlength="20"
                      outlined
                      dense
                    ></v-text-field>
                  </v-flex>
                  <v-flex md3 sm6 pl-1>
                    <div class="row pr-2">
                      <div class="col-md-9 pr-0">
                        <v-menu
                          v-on="on"
                          v-model="skills.menu2"
                          ref="menu2"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="skills.formattedDate2"
                              v-bind:label="$t('last_worked_on')"
                              append-icon="mdi-calendar"
                              outlined
                              dense
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="skills.last_worked_on"
                            type="month"
                            no-title
                            scrollable
                            :max="new Date().toISOString().substr(0, 10)"
                            @input="formatlastworked(i)"
                            @change="skills.menu2 = false"
                          ></v-date-picker>
                        </v-menu>
                      </div>
                      <div class="col-md-3 pl-0">
                        <div class="row pl-3 pt-4">
                          <v-tooltip bottom v-if="skillsArray.length > 1">
                            <template v-slot:activator="{ on }">
                              <v-icon
                                medium
                                color="error"
                                style="font-size: 30px"
                                v-on="on"
                                @click="deleteskillsmultiple(i)"
                                >mdi-delete</v-icon
                              >
                            </template>
                            <span>{{ $t("delete") }}</span>
                          </v-tooltip>
                          <v-tooltip bottom v-if="i == skillsArray.length - 1">
                            <template v-slot:activator="{ on }">
                              <v-icon
                                medium
                                color="primary"
                                style="font-size: 30px"
                                v-on="on"
                                @click="addskillsmultiple()"
                                >mdi-plus-circle</v-icon
                              >
                            </template>
                            <span>{{ $t("add_new") }}</span>
                          </v-tooltip>
                        </div>
                      </div>
                    </div>
                  </v-flex>
                </v-layout>
              </div>
            </v-form>
          </v-stepper-content>

          <v-stepper-step :complete="stepmodel > 4" step="4" editable>
            {{ $t("certification") }}
          </v-stepper-step>
          <v-stepper-content step="4">
            <v-form ref="formstep4" v-model="valid">
              <div
                v-for="(certification, j) in certificationArray"
                :key="j"
                elevation="5"
                class="mb-4"
                v-bind:class="[
                  certificationArray.length > 1 ? 'bottomborderloop' : '',
                ]"
              >
                <v-layout pt-1>
                  <v-flex xs12 md6 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-on="on"
                          v-model="certification.certification_title"
                          max-length="100"
                          v-if="
                            certificationArray.length > 1 &&
                            i != certificationArray.length - 1
                          "
                          :rules="fieldRules"
                          class="required_field"
                          v-bind:label="$t('certification_title')"
                          required
                          outlined
                          dense
                        ></v-text-field>
                        <v-text-field
                          v-on="on"
                          v-model="certification.certification_title"
                          max-length="100"
                          v-else
                          v-bind:label="$t('certification_title')"
                          required
                          outlined
                          dense
                        ></v-text-field>
                      </template>
                      <span>{{ $t("certification_title") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex md6 sm6 pl-3>
                    <div class="row">
                      <div class="col-md-9 pr-0">
                        <v-menu
                          v-on="on"
                          v-model="certification.menu1"
                          ref="menu1"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="certification.formattedDate1"
                              v-bind:label="$t('obtained_date')"
                              append-icon="mdi-calendar"
                              outlined
                              dense
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="certification.obtained_date"
                            type="month"
                            no-title
                            scrollable
                            :max="new Date().toISOString().substr(0, 10)"
                            @input="formatobtaineddate(j)"
                            @change="certification.menu1 = false"
                          ></v-date-picker>
                        </v-menu>
                      </div>
                      <div class="col-md-3 pl-0">
                        <div class="row pl-3 pt-4">
                          <v-tooltip
                            bottom
                            v-if="certificationArray.length > 1"
                          >
                            <template v-slot:activator="{ on }">
                              <v-icon
                                medium
                                color="error"
                                style="font-size: 30px"
                                v-on="on"
                                @click="deletecertificate(j)"
                                >mdi-delete</v-icon
                              >
                            </template>
                            <span>{{ $t("delete") }}</span>
                          </v-tooltip>
                          <v-tooltip
                            bottom
                            v-if="j == certificationArray.length - 1"
                          >
                            <template v-slot:activator="{ on }">
                              <v-icon
                                medium
                                color="primary"
                                style="font-size: 30px"
                                v-on="on"
                                @click="addcertification()"
                                >mdi-plus-circle</v-icon
                              >
                            </template>
                            <span>{{ $t("add_new") }}</span>
                          </v-tooltip>
                        </div>
                      </div>
                    </div>
                  </v-flex>
                </v-layout>
              </div>
            </v-form>
          </v-stepper-content>

          <v-stepper-step step="5" editable>
            {{ $t("other_details") }}
          </v-stepper-step>
          <v-stepper-content step="5">
            <v-form ref="formstep5" v-model="valid">
              <v-card>
                <v-layout pt-1>
                  <v-flex xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-select
                          v-on="on"
                          v-model="recruitment_details.marital_status"
                          :items="marital_status_array"
                          item-text="longname"
                          item-value="shortname"
                          v-bind:label="$t('martial_status')"
                          outlined
                          dense
                        ></v-select>
                      </template>
                      <span>{{ $t("martial_status") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex md4 sm6 pl-3>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          v-on="on"
                          index="id"
                          v-bind:label="$t('nationality')"
                          outlined
                          v-model="recruitment_details.nationality"
                          :items="countries"
                          item-text="name"
                          item-value="name"
                          dense
                          @change="fetch_states(RecruitmentConnect.country)"
                        ></v-autocomplete>
                      </template>
                      <span>{{ $t("nationality") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex md4 sm6 pl-3>
                    <DatePicker
                      :label="$t('dob')"
                      :stored_date="recruitment_details.date_of_birth"
                      :max="new Date().toISOString().substr(0, 10)"
                      @formatted_date="formattedDOB"
                      dense
                    />
                  </v-flex>
                </v-layout>
                <v-layout pt-1>
                  <v-flex xs12 md4 pl-2>
                    <!-- <DatePicker
                      :label="$t('passport_expiry')"
                      :stored_date="recruitment_details.passport_expiry"
                      :min="new Date().toISOString().substr(0, 10)"
                      @formatted_date="formattePassportDate"
                      dense
                    /> -->
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-menu
                          v-on="on"
                          v-model="menu"
                          ref="menu"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="formattedDate"
                              v-bind:label="$t('passport_expiry')"
                              append-icon="mdi-calendar"
                              outlined
                              dense
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="recruitment_details.passport_expiry"
                            type="month"
                            no-title
                            scrollable
                            :min="new Date().toISOString().substr(0, 10)"
                            @input="formatDate"
                            @change="menu = false"
                          ></v-date-picker>
                        </v-menu>
                      </template>
                      <span>{{ $t("passport_expiry") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-on="on"
                          v-model="recruitment_details.candidate_travel_history"
                          maxlength="100"
                          v-bind:label="$t('travel_history')"
                          required
                          outlined
                          dense
                        ></v-text-field>
                      </template>
                      <span>{{ $t("travel_history") }}</span>
                    </v-tooltip>
                  </v-flex>

                  <v-flex xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-on="on"
                          v-model="recruitment_details.willing_to_travel"
                          maxlength="200"
                          v-bind:label="$t('willingness_to_travel')"
                          required
                          outlined
                          dense
                        ></v-text-field>
                      </template>
                      <span>{{ $t("willingness_to_travel") }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
                <v-layout pt-1>
                  <v-flex xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-on="on"
                          v-model="recruitment_details.candidate_visa"
                          maxlength="200"
                          v-bind:label="$t('visa_available')"
                          required
                          outlined
                          dense
                        ></v-text-field>
                      </template>
                      <span>{{ $t("visa_available") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          v-on="on"
                          v-model="recruitment_details.source_type"
                          :items="source_type_array"
                          item-value="longname"
                          item-text="shortname"
                          v-bind:label="$t('source')"
                          outlined
                          dense
                        ></v-autocomplete>
                      </template>
                      <span>{{ $t("source") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex
                    xs12
                    md4
                    pl-2
                    v-show="
                      recruitment_details.source_type != 'Job Portal' &&
                      recruitment_details.source_type != '' &&
                      recruitment_details.source_type != null &&
                      recruitment_details.source_type != 'Vendor'
                    "
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-on="on"
                          v-model="recruitment_details.source_data"
                          v-bind:label="$t('source_type')"
                          class="pr-2"
                          dense
                          outlined
                        ></v-text-field>
                      </template>
                      <span>{{ $t("source_type") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex
                    xs12
                    md4
                    pl-2
                    v-show="recruitment_details.source_type == 'Job Portal'"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          v-on="on"
                          v-model="recruitment_details.source_data"
                          :items="job_portal_array"
                          item-value="longname"
                          item-text="shortname"
                          v-bind:label="$t('source_type')"
                          outlined
                          dense
                        ></v-autocomplete>
                      </template>
                      <span>{{ $t("source") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex
                    xs12
                    md4
                    pl-2
                    v-show="recruitment_details.source_type == 'Vendor'"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          v-on="on"
                          v-model="recruitment_details.source_data"
                          :items="vendor_details_array"
                          item-value="longname"
                          item-text="shortname"
                          v-bind:label="$t('source_type')"
                          outlined
                          dense
                        ></v-autocomplete>
                      </template>
                      <span>{{ $t("source") }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
                <v-layout pt-1>
                  <v-flex xs12 md8 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-textarea
                          v-on="on"
                          v-model="recruitment_details.candidate_queries"
                          maxlength="250"
                          rows="2"
                          v-bind:label="$t('any_other_queries_or_concerns')"
                          outlined
                          dense
                        ></v-textarea>
                      </template>
                      <span>{{ $t("any_other_queries_or_concerns") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 sm12 md4 pl-2>
                    <VueElementLoading
                      :active="loader"
                      spinner="bar-fade-scale"
                      color="var(--primary)"
                    />
                    <div class="browsedivdoc">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            readonly
                            outlined
                            dense
                            v-on="on"
                            @click="callDocumentSelect"
                            v-model="recruitment_details.file_url"
                            v-bind:label="$t('upload_doc')"
                          ></v-text-field>
                          <v-chip
                            label
                            class="browsebtndoc"
                            @click="callDocumentSelect"
                            color="primary"
                            >{{ $t("browse") }}</v-chip
                          >
                        </template>
                        <span>{{ $t("upload_doc") }}</span>
                      </v-tooltip>
                    </div>

                    <div
                      v-if="recruitment_details.file_url"
                      class="documentdownloadapplyleave"
                    >
                      <a
                        :href="document_url + recruitment_details.file_url"
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
                            @uploadedDocumentName="uploadedDocumentName"
                            :documentlink="recruitment_details.file_url"
                          >
                          </DocumentSelect>
                        </span>
                      </template>
                      <span>{{ $t("file_input") }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
                <v-layout> </v-layout>
              </v-card>
            </v-form>
          </v-stepper-content>
          <v-stepper-step step="6" editable>
            {{ $t("social_media_link") }}
          </v-stepper-step>
          <v-stepper-content step="6">
            <v-form ref="formstep6" v-model="valid">
              <v-card>
                <v-layout pt-1>
                  <v-flex xs12 md4 pl-2>
                    <v-text-field
                      v-model="recruitment_details.website"
                      v-bind:label="$t('website')"
                      class="pr-2"
                      dense
                      outlined
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 md4>
                    <v-text-field
                      v-model="recruitment_details.youtube"
                      v-bind:label="$t('youtube')"
                      required
                      class="pr-2"
                      dense
                      outlined
                    ></v-text-field>
                  </v-flex>

                  <!-- :rules="linkedinRules" -->
                  <v-flex xs12 md4>
                    <v-text-field
                      v-model="recruitment_details.linkedin"
                      v-bind:label="$t('linkedin')"
                      class="pr-2"
                      dense
                      outlined
                    ></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout pt-1>
                  <v-flex xs12 md4 pl-2>
                    <v-text-field
                      v-model="recruitment_details.twitter"
                      v-bind:label="$t('twitter')"
                      class="pr-2"
                      required
                      dense
                      outlined
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 md4>
                    <v-text-field
                      v-model="recruitment_details.instagram"
                      v-bind:label="$t('instagram')"
                      class="pr-2"
                      required
                      dense
                      outlined
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 md4>
                    <v-text-field
                      v-model="recruitment_details.facebook"
                      v-bind:label="$t('facebook')"
                      class="pr-2"
                      required
                      dense
                      outlined
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-form>
          </v-stepper-content>
        </v-stepper>
        <v-row class="my-5">
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div v-on="on" class="d-inline-block mr-2">
                <v-btn
                  small
                  @click="previousPage()"
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
                  :disabled="isDisabled"
                  color="green darken-1"
                  @click="validationcheckbeforeSave"
                  small
                  class="mt-1 mr-4 mb-4 success hover_shine"
                >
                  {{ $t("submit") }}
                  <b-spinner
                    :disabled="isBtnLoading"
                    small
                    v-if="isBtnLoading"
                  ></b-spinner>
                </v-btn>
              </div>
            </template>
            <span>{{ $t("submit") }}</span>
          </v-tooltip>
        </v-row>
      </div>
    </div>
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
import CreateLookup from "../../../Pages/CreateLookup.vue";
import VueElementLoading from "vue-element-loading";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import DocumentSelect from "../Components/Upload/DocumentSelect.vue";
import DatePicker from "../Components/DatePicker.vue";
import { Country, State, City } from "country-state-city";
export default {
  props: ["candidate_slug", "editable"],
  components: {
    VueElementLoading,
    ConfirmDialog,
    DocumentSelect,
    DatePicker,
    CreateLookup,
    // VuePhoneNumberInput,
  },
  data: () => ({
    stepmodel: 1,
    valid: true,
    loader_main: false,
    showConfirmDialog: false,
    loader: false,
    document_url: process.env.VUE_APP_IMAGE_PATH,
    isBtnLoading: false,
    isDisabled: false,
    openMedia: false,
    countries: [],
    salutation_array: [],
    employ_history: "Fresher",
    job_type_array: [],
    source_type_array: [],
    job_portal_array: [],
    skillsproficiencyarray: [],
    vendor_details_array: [],
    skillsArray: [
      {
        id: 0,
        candidate_id: "",
        skills: "",
        proficiency: "",
        total_experience: "",
        last_worked_on: "",
        formattedDate2: "",
        menu2: false,
        multipleError: false,
        multipleErrorMessage: "",
      },
    ],
    candidateskills: {
      id: 0,
      candidate_id: "",
      skills: "",
      proficiency: "",
      total_experience: "",
      last_worked_on: "",
      formattedDate2: "",
      menu2: false,
      multipleError: false,
      multipleErrorMessage: "",
    },
    certificationArray: [
      {
        id: 0,
        candidate_id: "",
        certification_title: "",
        obtained_date: "",
        formattedDate1: "",
        menu1: false,
      },
    ],
    candidate_certification: {
      id: 0,
      candidate_id: "",
      certification_title: "",
      obtained_date: "",
      formattedDate1: "",
      menu1: false,
    },
    recruitment_details: {
      id: 0,
      salutation: "",
      name: "",
      email: "",
      mobile: "",
      position_applied_for: [],
      candidate_job: "",
      candidate_skills: "",
      emp_type_looking: "",
      lastworking_days: "",
      current_company: "",
      current_location: "",
      source_type: "",
      current_ctc: "",
      expected_ctc: "",
      notice_period: "",
      willing_to_travel: "",
      passport_expiry: "",
      candidate_queries: "",
      filename: "",
      file_url: "",
      status: "",
      country_code: "",
      candidate_gender: "",
      current_designation: "",
      total_experience_months: "",
      total_experience_year: "",
      relevant_experience: "",
      relevant_experience_months: "",
      candidate_qualification: "",
      source_type: "",
      source_data: "",
      courses: "",
      marital_status: "",
      nationality: "",
      date_of_birth: "",
      preffered_location: "",
      candidate_travel_history: "",
      candidate_visa: "",
      facebook: "",
      website: "",
      linkedin: "",
      twitter: "",
      instagram: "",
      youtube: "",
    },
    total_year_items: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      "Above 40",
    ],
    total_month_items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    relevant_year_items: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      "Above 40",
    ],
    relevant_month_items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    certifcate_index: null,
    skills_index: null,
    enable_document_select: "",
    passportExpiryItems: [],
    candidateskillsitems: [],
    genderItems: [],
    noticeperiodItems: [],
    postionappliedforItems: [],
    candidatejobItems: [],
    highereducationItems: [],
    marital_status_array: [],
    menu: false,
    formattedDate: "",
  }),

  computed: {
    convertToWords() {
      const ones = [
        "",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
      ];
      const teens = [
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
      ];
      const tens = [
        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
      ];
      const thousands = ["", "Thousand", "Lakh", "Crore", "Arab", "Kharab"];

      let num = this.recruitment_details.current_ctc;
      if (num == 0) {
        return "";
      }

      let result = "";
      let chunkIndex = 0;
      while (num > 0) {
        let chunk = num % 100;
        if (chunk !== 0) {
          let chunkWords = [];

          if (chunk >= 10 && chunk <= 19) {
            chunkWords.push(teens[chunk - 10]);
          } else {
            if (chunk >= 20) {
              chunkWords.push(tens[Math.floor(chunk / 10)]);
              chunk %= 10;
            }
            if (chunk > 0) {
              chunkWords.push(ones[chunk]);
            }
          }

          result =
            chunkWords.join(" ") + " " + thousands[chunkIndex] + " " + result;
        }

        chunkIndex++;
        num = Math.floor(num / 100);
      }
      return result.trim();
    },

    //  linkedinRules() {
    //    return [
    //         (v) =>
    //           !v ||
    //          /^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(v) ||
    //           this.$t("email_valid"),
    //       ];
    //   },
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    experienceRules() {
      return [(v) => v === 0 || !!v || this.$t("field_required")];
    },

    emailRules() {
      return [
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          this.$t("email_valid"),
      ];
    },
    numberRules() {
      return [(v) => !!v || this.$t("valid_number_required")];
    },
    phoneRules() {
      return [(v) => !v || v.length >= 10 || this.$t("valid_number_required")];
    },
  },

  created() {
    this.countries = Country.getAllCountries();
    this.fetchlookup();
    this.fetchVendorDetails();
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.fetchCandidateDetails();
        }
      },
    },
    candidate_slug: {
      immediate: true,
      handler() {
        if (this.candidate_slug) {
          this.fetchCandidateDetails();
        }
      },
    },
  },

  methods: {
    changeSkills(skill, skilindex) {
      this.valid = true;
      for (var j = 0; j < this.skillsArray.length; j++) {
        this.skillsArray[j].multipleError = false;
        this.skillsArray[j].multipleErrorMessage = "";
      }
      for (var i = 0; i < this.skillsArray.length; i++) {
        if (this.skillsArray[i].skills == skill && i != skilindex) {
          this.skillsArray[skilindex].multipleError = true;
          this.skillsArray[skilindex].multipleErrorMessage = this.$t(
            "duplicate_skills_cant_add"
          );
          this.valid = false;
        }
      }
    },

    deletecertificate(index) {
      if (this.certificationArray[index].certification_title) {
        this.showConfirmDialog = true;
        this.certifcate_index = index;
      } else {
        this.deletecertificateconfirm(index);
      }
    },
    deleteskillsmultiple(index) {
      if (this.skillsArray[index].skills) {
        this.showConfirmDialog = true;
        this.skills_index = index;
      } else {
        this.deleteskillsmultipleconfirm(index);
      }
    },
    cancel() {
      this.showConfirmDialog = false;
      this.certifcate_index = null;
      this.skills_index = null;
    },
    confirm() {
      if (this.skills_index != null) {
        this.deleteskillsmultipleconfirm(this.skills_index);
      }
      if (this.certifcate_index != null) {
        this.deletecertificateconfirm(this.certifcate_index);
      }
      this.cancel();
    },
    formatobtaineddate(index) {
      if (this.certificationArray[index].obtained_date) {
        const year = this.certificationArray[index].obtained_date.substr(0, 4);
        const month = this.certificationArray[index].obtained_date.substr(5, 2);
        const options = { year: "numeric", month: "short" };
        const formattedDate = new Date(year, month - 1).toLocaleDateString(
          undefined,
          options
        );
        this.certificationArray[index].formattedDate1 = formattedDate;
      } else {
        this.certificationArray[index].formattedDate1 = "";
      }
    },
    formatlastworked(index) {
      if (this.skillsArray[index].last_worked_on) {
        const year = this.skillsArray[index].last_worked_on.substr(0, 4);
        const month = this.skillsArray[index].last_worked_on.substr(5, 2);
        const options = { year: "numeric", month: "short" };
        const formattedDate = new Date(year, month - 1).toLocaleDateString(
          undefined,
          options
        );
        this.skillsArray[index].formattedDate2 = formattedDate;
      } else {
        this.skillsArray[index].formattedDate2 = "";
      }
    },
    formatDate() {
      var year = this.recruitment_details.passport_expiry.substr(0, 4);
      var month = this.recruitment_details.passport_expiry.substr(5, 2);
      var options = { year: "numeric", month: "short" };
      var formattedDate = new Date(year, month - 1).toLocaleDateString(
        undefined,
        options
      );
      this.formattedDate = formattedDate;
    },
    previousPage() {
      this.$router.go(-1);
    },
    addskillsmultiple() {
      if (this.$refs.formstep3.validate()) {
        this.skillsArray.push(this.candidateskills);
        this.candidateskills = {
          id: 0,
          candidate_id: "",
          skills: "",
          proficiency: "",
          total_experience: "",
          last_worked_on: "",
          formattedDate2: "",
          menu2: false,
          multipleError: false,
          multipleErrorMessage: "",
        };
      }
    },
    addcertification() {
      if (this.$refs.formstep4.validate()) {
        this.certificationArray.push(this.candidate_certification);
        this.candidate_certification = {
          id: 0,
          candidate_id: "",
          certification_title: "",
          obtained_date: "",
          formattedDate1: "",
          menu1: false,
        };
      }
    },
    fetchCandidateDetails() {
      var slug_data = "";
      if (this.candidate_slug) {
        slug_data = this.candidate_slug;
      } else {
        slug_data = this.$route.query.slug;
      }
      this.loader_main = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetch_candidate_slug?slug=" +
            slug_data
        )
        .then((res) => {
          this.btnloading = false;
          if (res.data.status == "S") {
            this.loader_main = false;
            this.message = res.data.message;
            this.employ_history = res.data.candidate_type;
            this.recruitment_details = res.data.candidate_details;
            this.recruitment_details.position_applied_for =
              res.data.position_applied_for;
            this.recruitment_details.candidate_skills = JSON.parse(
              res.data.candidate_details.candidate_skills
            );
            this.recruitment_details.preffered_location = JSON.parse(
              res.data.candidate_details.preffered_location
            );
            this.recruitment_details.emp_type_looking = JSON.parse(
              res.data.candidate_details.emp_type_looking
            );
            this.monthchange(this.recruitment_details.total_experience_months);
            if (res.data.candidate_details.passport_expiry) {
              this.formatDate();
            }
            if (res.data.candidate_details.certificates.length > 0) {
              this.certificationArray = [];
              this.certificationArray = res.data.candidate_details.certificates;
            }
            if (res.data.candidate_details.skills.length > 0) {
              this.skillsArray = [];
              this.skillsArray = res.data.candidate_details.skills;
              this.skillsArray.map((ele) => {
                ele.multipleErrorMessage = "";
                ele.multipleError = false;
              });
            }
          } else if (res.data.status == "E") {
            this.loader_main = false;
            this.message = res.data.message;
          }
        })
        .catch((err) => {
          this.isDisabled = false;
          console.log("this error" + err);
        });
    },
    formatteStartDate(formatted_date) {
      if (formatted_date) {
        this.recruitment_details.lastworking_days = formatted_date;
      }
    },
    formattedDOB(formatted_date) {
      this.recruitment_details.date_of_birth = formatted_date;
    },
    saveFormattedDate(date) {
      if (date == null) {
        return null;
      } else {
        let monthdate = new Date(date);
        let month = monthdate.toLocaleString("default", { month: "short" });
        let year = monthdate.getFullYear();
        this.$refs.menu.save(month + "-" + year);
      }
    },
    yearchange(year) {
      if (year != "Above 40") {
        this.relevant_year_items = [];
        for (var i = 0; i <= year; i++) {
          this.relevant_year_items.push(i);
        }
      } else {
        this.relevant_year_items = [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
          24,
          25,
          26,
          27,
          28,
          29,
          30,
          31,
          32,
          33,
          34,
          35,
          36,
          37,
          ,
          38,
          39,
          40,
          "Above 40",
        ];
      }
    },
    monthchange(month) {
      if (
        this.recruitment_details.total_experience_year ==
        this.recruitment_details.relevant_experience
      ) {
        this.relevant_month_items = [];
        for (var j = 0; j <= month; j++) {
          this.relevant_month_items.push(j);
        }
      } else {
        this.relevant_month_items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      }
    },

    changeExperience() {
      this.recruitment_details.relevant_experience_months = "";
      this.recruitment_details.relevant_experience = "";
    },
    changeradio() {
      this.recruitment_details.relevant_experience_months = "";
      this.recruitment_details.relevant_experience = "";
      this.recruitment_details.total_experience_months = "";
      this.recruitment_details.total_experience_year = "";
      this.recruitment_details.notice_period = "";
      this.recruitment_details.expected_ctc = "";
      this.recruitment_details.current_ctc = "";
      this.recruitment_details.current_location = "";
      this.recruitment_details.current_designation = "";
      this.recruitment_details.current_company = "";
      this.recruitment_details.emp_type_looking = "";
    },
    uploadedDocument(file_path) {
      this.loader = true;
      this.recruitment_details.file_url = file_path;
      this.closeDocumentSelectDialog();
    },
    deletecertificateconfirm(index) {
      this.certificationArray.splice(index, 1);
    },
    deleteskillsmultipleconfirm(index) {
      this.skillsArray.splice(index, 1);
    },
    uploadedDocumentName(file_name) {
      this.recruitment_details.filename = file_name;
    },
    closeDocumentSelectDialog(uploadtype) {
      this.enable_document_select = "";
      this.loader = false;
    },
    callDocumentSelect() {
      this.enable_document_select = "DragDrop";
    },
    lookupMessage(lookup_data) {
      if (lookup_data.status == "S") {
        this.flashMessage.success({
          message: lookup_data.message,
          time: 4000,
          blockClass: "custom-block-class",
        });
        this.fetchlookup();
      } else {
        this.flashMessage.error({
          message: lookup_data.message,
          time: 4000,
          blockClass: "custom-block-class",
        });
      }
    },
    fetchVendorDetails() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getvendordetails", {})
        .then((response) => {
          this.vendor_details_array = response.data.activevendors;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchlookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "JOB_TYPE",
          },
        })
        .then((response) => {
          this.job_type_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "CANDIDATE_SOURCE",
          },
        })
        .then((response) => {
          this.source_type_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "JOB_PORTAL",
          },
        })
        .then((response) => {
          this.job_portal_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "PASSPORT EXPIRY",
          },
        })
        .then((response) => {
          this.passportExpiryItems = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "NOTICE PERIOD",
          },
        })
        .then((response) => {
          this.noticeperiodItems = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_all_recruitment_job", {
          params: {
            job_status: "Active",
          },
        })
        .then((res) => {
          this.postionappliedforItems = res.data.jobs_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "GENDER",
          },
        })
        .then((response) => {
          this.genderItems = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "HIGHEST QUALIFICATION",
          },
        })
        .then((response) => {
          this.highereducationItems = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "MARITAL_STATUS",
          },
        })
        .then((response) => {
          this.marital_status_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "SKILLS_PROFICIENCY",
          },
        })
        .then((response) => {
          this.skillsproficiencyarray = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "TECHNICAL_SKILLS_HEADER",
          },
        })
        .then((response) => {
          this.candidateskillsitems = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "SALUTATION",
          },
        })
        .then((response) => {
          this.salutation_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      if (this.candidate_slug) {
        this.fetchCandidateDetails();
      }
    },

    validationcheckbeforeSave() {
      if (this.$refs.formstep1.validate()) {
        if (this.$refs.formstep2.validate()) {
          if (this.$refs.formstep3.validate() && this.valid == true) {
            if (this.$refs.formstep4.validate()) {
              if (this.$refs.formstep5.validate()) {
                this.saveRecruitment();
              } else {
                this.stepmodel = 5;
              }
            } else {
              this.stepmodel = 4;
            }
          } else {
            this.stepmodel = 3;
          }
        } else {
          this.stepmodel = 2;
        }
      } else {
        this.stepmodel = 1;
      }
    },

    saveRecruitment() {
      if (this.$refs.formstep4.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "create_candidate_details",
            {
              recruitment: this.recruitment_details,
              certification: this.certificationArray,
              skills: this.skillsArray,
            }
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
              this.previousPage();
            } else if (res.data.status == "E") {
              this.isBtnLoading = false;
              (this.isDisabled = false),
                this.flashMessage.error({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class",
                });
              this.clear();
            } else {
              this.isBtnLoading = false;
              this.flashMessage.error({
                message: this.array_data,
              });
              this.clear();
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
.browsedivdoc {
  display: inline-flex;
  width: 100%;
  position: relative;
}

.browsedivdoc /deep/ .v-chip {
  border-radius: 0%;
}

.browsedivdoc /deep/ .v-text-field__details {
  display: none;
}

.browsebtndoc {
  height: 40px;
  margin-left: -10%;
  /* margin-top: 30px; */
}

.experienceorfresherclass /deep/ .v-label {
  margin-bottom: 0px !important;
}

.current_ctc_item {
  position: relative;
}

.text_position {
  position: absolute;
  bottom: 0px;
  left: 10px;
  font-size: 11px;
  color: grey;
}

.select_field {
  position: absolute;
  right: 12px;
  top: 12px;
  width: 62%;
  height: 20px !important;
}

.select_field /deep/ .v-label--active {
  background: white;
  padding: 0px 12px 0px 12px;
}

/* .wrapper_unset /deep/ .v-stepper__wrapper{
  overflow: unset !important;
} */
.v-sheet.v-card:not(.v-sheet--outlined) {
  box-shadow: none;
}

.bottomborderloop {
  border-bottom: solid rgb(204, 200, 200) 1px;
}

.majorskillsetcombobox /deep/ .v-input__append-inner {
  display: none !important;
}
</style>
