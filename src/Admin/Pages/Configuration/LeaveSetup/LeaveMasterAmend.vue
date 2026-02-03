<template>
  <div class="container-fluid main-20 p-0" style="margin-top: 10px">
    <div class="mb-3 mx-auto">
      <div class="card-header">
        <div class>
          <div class="card-header-title font-size-lg text-capitalize titlewrap">
            {{ $t("create_amend_leave_master") }}
          </div>
        </div>
      </div>
      <div class="card-body">
        <VueElementLoading
          :active="loader"
          spinner="bar-fade-scale"
          color="var(--primary)"
        />
        <v-form ref="form" v-model="valid">
          <v-layout>
            <v-flex xs12 md4 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-bind:label="$t('leave_name')"
                    v-on="on"
                    class="required_field"
                    v-model="leave_master.leave_name"
                    :rules="fieldRules"
                    @change="leaveshortnamecreate(leave_master.leave_name)"
                    :items="leave_name_array"
                    outlined
                    dense
                  ></v-text-field>
                </template>
                <span>{{ $t("leave_name") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex md3 xs12 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="leave_master.shortname"
                    outlined
                    :rules="fieldRules"
                    v-on="on"
                    v-bind:label="$t('shortname')"
                    required
                    class="required_field"
                    dense
                  ></v-text-field>
                </template>
                <span>{{ $t("shortname") }}</span>
              </v-tooltip>
            </v-flex>

            <!-- organisations -->
            <v-flex v-if="organisation" xs12 md3 pl-2>
              <v-text-field
                disabled
                v-model="organisation"
                :rules="fieldRules"
                v-bind:label="$t('organisation')"
                required
                class="required_field"
                outlined
                dense
              ></v-text-field>
            </v-flex>
            <v-flex v-else xs12 md3 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    v-bind:label="$t('organisation')"
                    v-on="on"
                    index="id"
                    item-value="id"
                    item-text="shortname"
                    class="required_field"
                    v-model="leave_master.org_id"
                    :rules="fieldRules"
                    :items="organisation_array"
                    outlined
                    dense
                  ></v-autocomplete>
                </template>
                <span>{{ $t("organisation") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md3 pl-3>
              <div class="ml-1 d-flex">
                <template>
                  <h6 class="mt-2">{{ $t("special_leave") }}</h6>
                  <v-switch
                    class="ml-3 mt-2"
                    v-model="leave_master.is_special_leave"
                    inset
                  ></v-switch>
                </template>
              </div>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12 md12 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-textarea
                    v-on="on"
                    rows="2"
                    maxlength="250"
                    counter
                    v-model="leave_master.leave_description"
                    v-bind:label="$t('description')"
                    outlined
                    dense
                  ></v-textarea>
                </template>
                <span>{{ $t("description") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </v-form>

          <v-stepper v-model="e1">
            <v-stepper-header>
              <v-stepper-step :editable="true" :complete="e1 > 1" step="1">
                {{ $t("leave_Calculation") }}
              </v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :editable="stepper_edit2" @click="applicableTab(e1,2)" :complete="e1 > 2" step="2">
                {{ $t("leave_applicable_for") }}
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step step="3" @click="applicableTab(e1,3)">
                {{ $t("restriction") }}
              </v-stepper-step>
            </v-stepper-header>
            <v-stepper-content step="1">
              <v-form ref="leave_calculation" v-model="valid_leave_calculation">
                <v-layout class="mt-5">
                  <v-flex xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          v-bind:label="$t('leave_setup_based_on')"
                          v-on="on"
                          index="id"
                          item-value="shortname"
                          item-text="longname"
                          disabled
                          class="required_field"
                          v-model="leave_master.leave_calculation_year"
                          :rules="fieldRules"
                          :items="reporting_based_on_array"
                          outlined
                          dense
                        ></v-autocomplete>
                      </template>
                      <span>{{ $t("leave_setup_based_on") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 md4 pl-2>
                    <div class="row">
                      <div class="col-md-12">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              dense
                              outlined
                              v-bind:label="$t('min_service_period')"
                              v-on="on"
                              maxlength="2"
                              required
                              :rules="numberRules"
                              class="required_field input_field"
                              @keydown="NumbersOnly"
                              hide-details
                              v-model="leave_master.min_service_year"
                              @blur="clearfn(leave_master.min_service_year)"
                            ></v-text-field>
                          </template>
                          <span>{{ $t("min_service_period") }}</span>
                        </v-tooltip>
                        <!-- @input="leave_master.min_service_year==''?leave_master.min_service_year=0 :leave_master.min_service_year;" -->
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-autocomplete
                              v-bind:label="$t('effective_after')"
                              v-on="on"
                              index="id"
                              item-value="shortname"
                              item-text="shortname"
                              class="required_field select_field"
                              v-model="leave_master.effective_year"
                              :rules="fieldRules"
                              :items="effective_year_array"
                              outlined
                              dense
                            ></v-autocomplete>
                          </template>
                          <span>{{ $t("effective_after") }}</span>
                        </v-tooltip>
                      </div>
                    </div>
                  </v-flex>
                  <v-flex xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          v-bind:label="$t('effective_after_now')"
                          v-on="on"
                          index="id"
                          item-value="shortname"
                          item-text="shortname"
                          class="required_field"
                          v-model="leave_master.date_confirmation"
                          :rules="fieldRules"
                          :items="date_confirmation_array"
                          outlined
                          dense
                        ></v-autocomplete>
                      </template>
                      <span>{{ $t("effective_after_now") }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          v-bind:label="$t('calculation_type')"
                          v-on="on"
                          index="id"
                          item-value="id"
                          item-text="longname"
                          class="required_field"
                          v-model="leave_master.current_calculation_type_id"
                          :rules="fieldRules"
                          :items="calculation_type_array"
                          @change="
                            calculateEffectiveDate(
                              leave_master.current_calculation_type_id
                            )
                          "
                          outlined
                          dense
                        ></v-autocomplete>
                      </template>
                      <span>{{ $t("calculation_type") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 md4 pl-2>
                    <DatePicker
                      :label="$t('effective_date')"
                      :stored_date="leave_master.effective_date"
                      :min="new Date().toISOString().substr(0, 10)"
                      @formatted_date="formattedEffectiveDate"
                      dense
                    />
                  </v-flex>
                  <v-flex v-if="leave_master.effective_date" xs12 md4 pl-2>
                    <DatePicker
                      :label="$t('effective_end_date')"
                      :stored_date="leave_master.effective_end_date"
                      :min="leave_master.effective_date"
                      @formatted_date="formattedEffectiveEndDate"
                      dense
                    />
                  </v-flex>
                </v-layout>

                <div v-if="leave_calculation_data">
                  <p class="font-weight-bold ml-2">
                    {{ $t("calculation_history") }}
                  </p>
                  <v-layout>
                    <!-- {{ leave_calculation_data.current_type_value }} -->
                    <v-flex xs12 md3 pl-2>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            dense
                            outlined
                            disabled
                            v-bind:label="$t('current_calculation_type')"
                            v-on="on"
                            v-model="leave_calculation_data.current_type_value"
                          ></v-text-field>
                        </template>
                        <span>{{ $t("current_calculation_type") }}</span>
                      </v-tooltip>
                    </v-flex>
                    <v-flex xs12 md3 pl-2>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            dense
                            outlined
                            disabled
                            v-bind:label="$t('next_calculation_type')"
                            v-on="on"
                            v-model="leave_calculation_data.next_type_value"
                          ></v-text-field>
                        </template>
                        <span>{{ $t("next_calculation_type") }}</span>
                      </v-tooltip>
                    </v-flex>
                    <v-flex
                      xs12
                      md3
                      pl-2
                      v-if="
                        leave_calculation_data.next_type_value !=
                        leave_calculation_data.current_type_value
                      "
                    >
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <DatePicker
                            :label="$t('effective_date')"
                            :disable_field="true"
                            v-on="on"
                            :stored_date="leave_calculation_data.effective_date"
                            :min="new Date().toISOString().substr(0, 10)"
                            dense
                          />
                          <!-- @formatted_date="formattedEffectiveDate" -->
                        </template>
                        <span>{{ $t("current_calculation_type") }}</span>
                      </v-tooltip>
                    </v-flex>
                  </v-layout>
                </div>
              </v-form>
              <div class="text-end">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <div v-on="on" class="d-inline-block">
                      <v-btn
                        v-on="on"
                        small
                        class="ma-1 font-weight-bold cancel-btn"
                        color="secondary"
                        @click="$router.go(-1)"
                      >
                        {{ $t("cancel") }}
                      </v-btn>
                    </div>
                  </template>
                  <span>{{ $t("cancel") }}</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <div v-on="on" class="d-inline-block">
                      <v-btn
                        color="primary darken-1"
                        @click="submitLeaveMaster('save', e1)"
                        small
                        :disabled="isLeavCalculationDisabled"
                        class="mr-2 hover_shine"
                      >
                        {{ $t("save") }}
                        <b-spinner
                          :disabled="isLeavCalculationLoading"
                          small
                          v-if="isLeavCalculationLoading"
                        ></b-spinner>
                      </v-btn>
                    </div>
                  </template>
                  <span>{{ $t("save") }}</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <div v-on="on" class="d-inline-block">
                      <v-btn
                        color="primary darken-1"
                        @click="submitLeaveMaster('leave_calculation',e1)"
                        small
                        class="mr-2 hover_shine"
                        :disabled="isSavenextLeaveCalcDisabled"
                      >
                        {{ $t("save_next") }}
                        <b-spinner
                          :disabled="isSavenextLeaveCalc"
                          small
                          v-if="isSavenextLeaveCalc"
                        ></b-spinner>
                      </v-btn>
                    </div>
                  </template>
                  <span>{{ $t("save_next") }}</span>
                </v-tooltip>
              </div>
            </v-stepper-content>
            <v-stepper-content step="2">
              <v-form
                ref="leave_applicable_for"
                v-model="valid_leave_calculation_applicable"
              >
                <v-layout class="mt-5">
                  <v-flex xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          v-bind:label="$t('gender')"
                          v-on="on"
                          index="id"
                          item-value="shortname"
                          item-text="longname"
                          class="required_field"
                          v-model="leave_master.applicable_gender"
                          :rules="fieldRules"
                          :items="gender_array"
                          required
                          outlined
                          dense
                        ></v-autocomplete>
                      </template>
                      <span>{{ $t("gender") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          v-bind:label="$t('maritalstatus')"
                          v-on="on"
                          index="id"
                          item-value="id"
                          item-text="longname"
                          class="required_field"
                          v-model="leave_master.applicable_marital_status"
                          :rules="fieldRules"
                          :items="maritalstatus_array"
                          outlined
                          dense
                        ></v-autocomplete>
                      </template>
                      <span>{{ $t("maritalstatus") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          v-bind:label="$t('department')"
                          v-on="on"
                          index="id"
                          item-value="shortname"
                          item-text="longname"
                          v-model="leave_master.department"
                          :rules="fieldRules"
                          :items="department_array"
                          outlined
                          multiple
                          dense
                        >
                          <template v-slot:selection="{ item, index }">
                            <v-chip
                              outlined
                              class="py-2"
                              color="primary"
                              small
                              v-if="index <= 2"
                            >
                              <span>{{ item.longname }}</span>
                            </v-chip>
                            <span
                              v-if="index === 2"
                              class="grey--text text-caption"
                              >(+{{
                                leave_master.department.length - 3
                              }}
                              others)</span
                            >
                          </template>

                          <v-list-tile
                            slot="prepend-item"
                            ripple
                            @click="selectDepartment"
                            class="ml-5"
                          >
                            <v-list-tile-action>
                              <v-icon
                                :color="
                                  leave_master.department.length > 0
                                    ? '#1976d2'
                                    : ''
                                "
                                class="select_icon_font_size"
                                >{{ icondepartment }}</v-icon
                              >
                            </v-list-tile-action>
                            <v-list-tile-title style="margin-left: 31px"
                              >Select All</v-list-tile-title
                            >
                          </v-list-tile>

                          <v-divider slot="prepend-item" class="mt-2" />
                        </v-autocomplete>
                      </template>
                      <span>{{ $t("department") }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          v-bind:label="$t('employee_type')"
                          v-on="on"
                          index="id"
                          item-value="employee_type"
                          item-text="employee_type"
                          v-model="leave_master.emp_type"
                          :items="employee_type_array"
                          multiple
                          outlined
                          dense
                        >
                          <template v-slot:selection="{ item }">
                            <v-chip outlined class="py-2" color="primary" small>
                              <span>{{ item.employee_type }}</span>
                            </v-chip>
                          </template>

                          <v-list-tile
                            slot="prepend-item"
                            ripple
                            @click="selectEmployeeType"
                            class="ml-5"
                          >
                            <v-list-tile-action>
                              <v-icon
                                :color="
                                  leave_master.emp_type.length > 0
                                    ? '#1976d2'
                                    : ''
                                "
                                class="select_icon_font_size"
                                >{{ icon }}</v-icon
                              >
                            </v-list-tile-action>
                            <v-list-tile-title style="margin-left: 31px"
                              >Select All</v-list-tile-title
                            >
                          </v-list-tile>
                          <v-divider slot="prepend-item" class="mt-2" />
                        </v-autocomplete>
                      </template>
                      <span>{{ $t("employee_type") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          v-bind:label="$t('designation')"
                          v-on="on"
                          index="id"
                          item-value="designation"
                          item-text="designation"
                          v-model="leave_master.designation"
                          :items="designation_array"
                          outlined
                          multiple
                          dense
                        >
                          <template v-slot:selection="{ item, index }">
                            <v-chip
                              outlined
                              class="py-2"
                              color="primary"
                              small
                              v-if="index <= 1"
                            >
                              <span>{{ item.designation }}</span>
                            </v-chip>
                            <span
                              v-if="index === 1"
                              class="grey--text text-caption"
                              >(+{{
                                leave_master.designation.length - 2
                              }}
                              others)</span
                            >
                          </template>
                          <v-list-tile
                            slot="prepend-item"
                            ripple
                            @click="selectEmployeeDesignation"
                            class="ml-5"
                          >
                            <v-list-tile-action>
                              <v-icon
                                :color="
                                  leave_master.designation.length > 0
                                    ? '#1976d2'
                                    : ''
                                "
                                class="select_icon_font_size"
                                >{{ iconDesignation }}</v-icon
                              >
                            </v-list-tile-action>
                            <v-list-tile-title style="margin-left: 31px"
                              >Select All</v-list-tile-title
                            >
                          </v-list-tile>

                          <v-divider slot="prepend-item" class="mt-2" />
                        </v-autocomplete>
                      </template>
                      <span>{{ $t("designation") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <!-- {{ site_array }} -->
                  <v-flex xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          v-bind:label="$t('site')"
                          v-on="on"
                          index="id"
                          item-value="fnd_site.id"
                          item-text="fnd_site.unique_location"
                          v-model="leave_master.site_id"
                          :rules="arrayfieldRules"
                          required
                          :items="site_array"
                          outlined
                          multiple
                          dense
                          @change="
                            fetchAllEmployeeSiteBased(leave_master.site_id)
                          "
                          class="required_field mt_30"
                        >
                          <template v-slot:selection="{ item, index }">
                            <v-chip
                              outlined
                              class="py-2"
                              color="primary"
                              small
                              v-if="index <= 1"
                            >
                              <span>{{ item.fnd_site.unique_location }}</span>
                            </v-chip>
                            <span
                              v-if="index === 1"
                              class="grey--text text-caption"
                              >(+{{
                                leave_master.site_id.length - 2
                              }}
                              others)</span
                            >
                          </template>

                          <v-list-tile
                            slot="prepend-item"
                            ripple
                            @click="selectSite"
                            class="ml-5"
                          >
                            <v-list-tile-action>
                              <v-icon
                                :color="
                                  leave_master.site_id.length > 0
                                    ? '#1976d2'
                                    : ''
                                "
                                class="select_icon_font_size"
                                >{{ iconsite }}</v-icon
                              >
                            </v-list-tile-action>
                            <v-list-tile-title style="margin-left: 31px"
                              >Select All</v-list-tile-title
                            >
                          </v-list-tile>
                          <v-divider slot="prepend-item" class="mt-2" />
                        </v-autocomplete>
                      </template>
                      <span>{{ $t("site") }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex xs12 md4 class="ml-2">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          v-bind:label="$t('employee')"
                          v-on="on"
                          index="id"
                          item-value="id"
                          item-text="Full_Code"
                          v-model="leave_master.emp_id"
                          :rules="fieldRules"
                          :items="org_employee_array"
                          outlined
                          multiple
                          dense
                        >
                          <template v-slot:selection="{ item, index }">
                            <v-chip
                              outlined
                              class="py-2"
                              color="primary"
                              small
                              v-if="index <= 1"
                            >
                              <span>{{ item.Full_Code }}</span>
                            </v-chip>
                            <span
                              v-if="index === 1"
                              class="grey--text text-caption"
                              >(+{{
                                leave_master.emp_id.length - 2
                              }}
                              others)</span
                            >
                          </template>

                          <v-list-tile
                            slot="prepend-item"
                            ripple
                            @click="selectEmployeId"
                            class="ml-5"
                          >
                            <v-list-tile-action>
                              <v-icon
                                :color="
                                  leave_master.emp_id.length > 0
                                    ? '#1976d2'
                                    : ''
                                "
                                class="select_icon_font_size"
                                >{{ iconAllEmployee }}</v-icon
                              >
                            </v-list-tile-action>
                            <v-list-tile-title style="margin-left: 31px"
                              >Select All</v-list-tile-title
                            >
                          </v-list-tile>
                          <v-divider slot="prepend-item" class="mt-2" />
                        </v-autocomplete>
                      </template>
                      <span>{{ $t("employee") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 md4 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          v-bind:label="$t('employee_role')"
                          v-on="on"
                          index="id"
                          item-value="rolename"
                          item-text="role_display_name"
                          v-model="leave_master.role"
                          :items="roles_array"
                          multiple
                          outlined
                          dense
                        >
                          <template v-slot:selection="{ item, index }">
                            <v-chip
                              outlined
                              class="py-2"
                              color="primary"
                              small
                              v-if="index <= 2"
                            >
                              <span>{{ item.role_display_name }}</span>
                            </v-chip>
                            <span
                              v-if="index === 2"
                              class="grey--text text-caption"
                              >(+{{
                                leave_master.role.length - 3
                              }}
                              others)</span
                            >
                          </template>
                          <v-list-tile
                            slot="prepend-item"
                            ripple
                            @click="selectEmpRole"
                            class="ml-5"
                          >
                            <v-list-tile-action>
                              <v-icon
                                :color="
                                  leave_master.role.length > 0 ? '#1976d2' : ''
                                "
                                class="select_icon_font_size"
                                >{{ roleicon }}</v-icon
                              >
                            </v-list-tile-action>
                            <v-list-tile-title style="margin-left: 31px"
                              >Select All</v-list-tile-title
                            >
                          </v-list-tile>
                          <v-divider slot="prepend-item" class="mt-2" />
                        </v-autocomplete>
                      </template>
                      <span>{{ $t("employee_role") }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
              </v-form>
              <div class="text-end">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <div v-on="on" class="d-inline-block">
                      <v-btn
                        color="secondary font-weight-bold"
                        @click="changePreviousTab(e1)"
                        small
                        class="font-weight-bold cancel-btn"
                      >
                        {{ $t("previous") }}
                      </v-btn>
                    </div>
                  </template>
                  <span>{{ $t("next") }}</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <div v-on="on" class="d-inline-block">
                      <v-btn
                        v-on="on"
                        small
                        class="ma-1 font-weight-bold cancel-btn"
                        color="secondary"
                        @click="$router.go(-1)"
                      >
                        {{ $t("cancel") }}
                      </v-btn>
                    </div>
                  </template>
                  <span>{{ $t("cancel") }}</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <div v-on="on" class="d-inline-block">
                      <v-btn
                        :disabled="leav_applicable_disabled"
                        color="primary darken-1"
                        @click="submitLeaveMaster('save_leave_applicable', e1)"
                        small
                        class="mr-2 hover_shine"
                      >
                        {{ $t("save") }}
                        <b-spinner
                          :disabled="leav_applicable_loader"
                          small
                          v-if="leav_applicable_loader"
                        ></b-spinner>
                      </v-btn>
                    </div>
                  </template>
                  <span>{{ $t("save") }}</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <div v-on="on" class="d-inline-block">
                      <v-btn
                        :disabled="leave_applicale_next_disabled"
                        color="primary darken-1"
                        @click="submitLeaveMaster('leave_applicable_for',e1)"
                        small
                        class="mr-2 hover_shine"
                      >
                        {{ $t("save_next") }}
                        <b-spinner
                          :disabled="leave_applicale_next_loader"
                          small
                          v-if="leave_applicale_next_loader"
                        ></b-spinner>
                      </v-btn>
                    </div>
                  </template>
                  <span>{{ $t("next") }}</span>
                </v-tooltip>
              </div>
            </v-stepper-content>
            <v-stepper-content step="3">
              <v-form ref="restriction" v-model="valid_leave_calculation">
              <v-layout class="mt-5">
                <v-flex xs12 md3 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        :rules="fieldRules"
                        dense
                        outlined
                        v-bind:label="$t('number_of_leaves_allowed')"
                        v-on="on"
                        maxlength="3"
                        @keydown="NumbersOnly"
                        class="required_field"
                        v-model="leave_master.no_of_leaves_allowed"
                      ></v-text-field>
                    </template>
                    <span>{{ $t("number_of_leaves_allowed") }}</span>
                  </v-tooltip>
                </v-flex>
                <v-flex xs12 md3 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        dense
                        outlined
                        maxlength="3"
                        v-bind:label="$t('max_consecutive_days')"
                        v-on="on"
                        @keydown="NumbersOnly"
                        v-model="leave_master.max_consecutive_days"
                      ></v-text-field>
                    </template>
                    <span>{{ $t("max_consecutive_days") }}</span>
                  </v-tooltip>
                </v-flex>
                <v-flex xs12 md3 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        dense
                        outlined
                        maxlength="3"
                        v-bind:label="$t('apply_in_advance')"
                        v-on="on"
                        @keydown="NumbersOnly"
                        v-model="leave_master.leave_in_advance"
                      ></v-text-field>
                    </template>
                    <span>{{ $t("apply_in_advance") }}</span>
                  </v-tooltip>
                </v-flex>
                <v-flex xs12 md3 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-autocomplete
                        dense
                        outlined
                        item-value="id"
                        item-text="leave_name"
                        :items="filtered_leave_array"
                        v-bind:label="$t('auto_detect_excess_leave')"
                        v-on="on"
                        v-model="leave_master.auto_detect_excess_leave"
                      ></v-autocomplete>
                    </template>
                    <span>{{ $t("auto_detect_excess_leave") }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
              </v-form>
              <v-layout>
                <v-flex xs12 md2 pl-2>
                  <template>
                    <div>
                      <h6 class="mt-2">{{ $t("is_file_upload") }}</h6>
                    </div>
                    <div>
                      <v-switch
                        class="ml-3 mt-2"
                        v-model="leave_master.is_file_upload"
                        inset
                      ></v-switch>
                    </div>
                  </template>
                </v-flex>
                <v-flex xs12 md2 pl-2>
                  <template>
                    <div>
                      <h6 class="mt-2">{{ $t("holiday_counted") }}</h6>
                    </div>
                    <div>
                      <v-switch
                        class="ml-3 mt-2"
                        v-model="leave_master.is_holidays_counted"
                        inset
                      ></v-switch>
                    </div>
                  </template>
                </v-flex>
                <v-flex xs12 md2 pl-2>
                  <template>
                    <div>
                      <h6 class="mt-2">{{ $t("paid_leave") }}</h6>
                    </div>
                    <div>
                      <v-switch
                        class="ml-3 mt-2"
                        v-model="leave_master.is_paid_leave"
                        inset
                      ></v-switch>
                    </div>
                  </template>
                </v-flex>
                <v-flex xs12 md3 pl-2>
                  <template>
                    <div>
                      <h6 class="mt-2">{{ $t("carry_forward") }}</h6>
                    </div>

                    <div>
                      <v-switch
                        class="ml-3 mt-2"
                        v-model="leave_master.is_carry_forward"
                        inset
                        @change="
                          displayCarryForward(leave_master.is_carry_forward)
                        "
                      ></v-switch>
                    </div>
                    <div>
                      <v-tooltip bottom v-if="store_carry_forward == 1">
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            dense
                            outlined
                            v-bind:label="$t('max_accumulation_count')"
                            v-on="on"
                            @keydown="NumbersOnly"
                            v-model="leave_master.max_accumulation_count"
                            maxlength="3"
                          ></v-text-field>
                        </template>
                        <span>{{ $t("max_accumulation_count") }}</span>
                      </v-tooltip>
                    </div>
                  </template>
                </v-flex>
                <v-flex xs12 md3 pl-2>
                  <template>
                    <div>
                      <h6 class="mt-2 required_field">
                        {{ $t("leave_encash") }}
                      </h6>
                    </div>

                    <div>
                      <v-switch
                        class="ml-3 mt-2"
                        v-model="leave_master.is_leave_encash"
                        inset
                        @change="displayMinLeave(leave_master.is_leave_encash)"
                      ></v-switch>
                    </div>
                    <div v-if="min_leave == 1">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            :rules="fieldRules"
                            dense
                            outlined
                            v-bind:label="$t('min_leave_for_encash')"
                            v-on="on"
                            @keydown="NumbersOnly"
                            maxlength="3"
                            class="required_field"
                            v-model="leave_master.min_leave_required_encash"
                          ></v-text-field>
                        </template>
                        <span>{{ $t("min_leave_for_encash") }}</span>
                      </v-tooltip>
                    </div>
                  </template>
                </v-flex>
              </v-layout>
              <div class="d-block text-right mr-4">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <div v-on="on" class="d-inline-block">
                      <v-btn
                        class="ma-1 font-weight-bold cancel-btn"
                        color="secondary"
                        @click="changePreviousTab(e1)"
                        small
                      >
                        {{ $t("previous") }}
                      </v-btn>
                    </div>
                  </template>
                  <span>{{ $t("previous") }}</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <div v-on="on" class="d-inline-block mr-2">
                      <v-btn
                        v-on="on"
                        :disabled="isDisabled"
                        small
                        @click="$router.go(-1)"
                        class="font-weight-bold cancel-btn"
                        color="secondary"
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
                        @click="submitLeaveMaster('finalSubmit',e1)"
                        small
                        class="mr-1 success hover_shine"
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
              </div>
            </v-stepper-content>
          </v-stepper>
      </div>
    </div>
  </div>
</template>
<script>
import VueElementLoading from "vue-element-loading";
import DatePicker from "../Components/DatePicker.vue";
import moment from "moment";

export default {
  components: {
    VueElementLoading,
    DatePicker,
  },
  data: () => ({
    roles_array: [],
    e1: 1,
    valid: true,
    leave_disabled: false,
    isLeavCalculationLoading: false,
    isLeavCalculationDisabled: false,
    isSavenextLeaveCalc: false,
    isSavenextLeaveCalcDisabled: false,
    leave_applicale_next_loader: false,
    leave_applicale_next_disabled: false,
    leav_applicable_loader: false,
    leav_applicable_disabled: false,
    user: "",
    loader: false,
    valid_leave_calculation: false,
    valid_leave_calculation_applicable: false,
    gender_array: [],
    effective_year_array: [],
    site_array: [],
    org_employee_array: [],
    maritalstatus_array: [],
    employee_type_array: [],
    leave_name_array: [],
    leave_array: [],
    designation_array: [],
    department_array: [],
    isDisabled: false,
    isBtnLoading: false,
    min_leave: 0,
    store_carry_forward: false,
    is_hr: false,
    organisation: "",
    organisation_array: [],
    calculation_type_array: [],
    date_confirmation_array: [],
    financial_year_data: "",
    reporting_based_on_array: [],
    leave_calculation_data: "",
    leave_master: {
      id: 0,
      site_id: [],
      leave_name: "",
      shortname: "",
      is_special_leave: 0,
      is_file_upload: 0,
      leave_description: "",
      applicable_gender: null,
      // exception_emp_type: [],
      effective_end_date: "",
      disable_field: true,
      applicable_marital_status: null,
      min_service_year: 0,
      emp_type: [],
      emp_id: [],
      designation: [],
      // exception_designation: [],
      no_of_leaves_allowed: null,
      // exception_site_id: [],
      department: [],
      // exception_department: "",
      max_consecutive_days: null,
      leave_in_advance: null,
      is_paid_leave: 1,
      max_accumulation_count: null,
      auto_detect_excess_leave: null,
      is_leave_encash: 0,
      min_leave_required_encash: null,
      // org_id: "",
      effective_year: "",
      org_id: null,
      date_confirmation: null,
      current_calculation_type_id: null,
      effective_date: "",
      updation_date: "",
      status: 1,
      leave_calculation_year: "",
      role: [],
      // exception_role: []
      stepper_edit2:false
    },
  }),
  computed: {

    datemin() {
      const futureDate = new Date(this.leave_master.effective_date);
      futureDate.setDate(futureDate.getDate() + 1);
      return `${futureDate}`;
    },
    filtered_leave_array() {
      if (this.leave_master.leave_name != "") {
        return this.leave_array.filter((ele) => {
          return ele.leave_name != this.leave_master.leave_name;
        });
      } else {
        return this.leave_array;
      }
    },
    icon() {
      if (this.selectall_employee_type) return "mdi-checkbox-marked";
      if (this.select_single_emp_type) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    },
    icondepartment() {
      if (this.selectall_department) return "mdi-checkbox-marked";
      if (this.select_single_department) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    },
    iconsite() {
      if (this.selectall_site) return "mdi-checkbox-marked";
      if (this.select_single_site) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    },
    roleicon() {
      if (this.selectall_exception_employee_role) return "mdi-checkbox-marked";
      if (this.select_single_emp_role) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    },
    exceptionroleicon() {
      if (this.selectall_employee_role) return "mdi-checkbox-marked";
      if (this.select_single_exception_emp_type) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    },
    selectall_employee_type() {
      return (
        this.leave_master.emp_type.length === this.employee_type_array.length
      );
    },
    select_single_emp_type() {
      return (
        this.leave_master.emp_type.length > 0 && !this.selectall_employee_type
      );
    },
    select_single_exception_emp_type() {
      return (
        this.leave_master.exception_role.length > 0 &&
        !this.selectall_exception_employee_role
      );
    },
    selectall_employee_role() {
      return this.leave_master.role.length === this.roles_array.length;
    },
    selectall_exception_employee_role() {
      return this.leave_master.role.length === this.roles_array.length;
    },
    select_single_emp_role() {
      return this.leave_master.role.length > 0 && !this.selectall_employee_type;
    },
    iconExceptionEmpType() {
      if (this.selectall_exception_employee_type) return "mdi-checkbox-marked";
      if (this.select_single_exception_emp_type) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    },
    selectall_exception_employee_type() {
      return (
        this.leave_master.exception_emp_type.length ===
        this.employee_type_array.length
      );
    },
    select_single_exception_emp_type() {
      return (
        this.leave_master.exception_emp_type.length > 0 &&
        !this.selectall_exception_employee_type
      );
    },
    iconAllEmployee() {
      if (this.selectall_employee) return "mdi-checkbox-marked";
      if (this.select_single_emp) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    },
    selectall_employee() {
      return this.leave_master.emp_id.length === this.org_employee_array.length;
    },
    select_single_emp() {
      return this.leave_master.emp_id.length > 0 && !this.selectall_employee;
    },
    iconDesignation() {
      if (this.selectall_employee_designation) return "mdi-checkbox-marked";
      if (this.select_single_designation) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    },
    selectall_employee_designation() {
      return (
        this.leave_master.designation.length === this.designation_array.length
      );
    },
    select_single_designation() {
      return (
        this.leave_master.designation.length > 0 &&
        !this.selectall_employee_designation
      );
    },
    iconExceptionDesignation() {
      if (this.selectall_exception_employee_designation)
        return "mdi-checkbox-marked";
      if (this.select_single_exception_designation) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    },
    selectall_exception_employee_designation() {
      return (
        this.leave_master.exception_designation.length ===
        this.designation_array.length
      );
    },
    selectall_department() {
      return (
        this.leave_master.department.length === this.department_array.length
      );
    },
    selectall_site() {
      return this.leave_master.site_id.length === this.site_array.length;
    },
    select_single_department() {
      return (
        this.leave_master.department.length > 0 && !this.selectall_department
      );
    },
    select_single_site() {
      return this.leave_master.site_id.length > 0 && !this.selectall_site;
    },
    select_single_exception_designation() {
      return (
        this.leave_master.exception_designation.length > 0 &&
        !this.selectall_exception_employee_designation
      );
    },
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    arrayfieldRules() {
      return [(v) => v.length > 0 || this.$t("field_required")];
    },
    numberRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },

  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.fetchLookup();
    this.fetchRoles();
    this.fetchEmployeeType();
    this.fetchOrgnaisation();
    this.fetchDesignation();
    this.fetchFinancialYear();
    this.fetchLeaveData();
    
  },
  created() {},
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN + "edit_leave_rules_by_slug",
              {
                params: {
                  slug: this.$route.query.slug,
                },
              }
            )
            .then((res) => {
              this.leave_disabled = true;
              this.leave_master = res.data.leave_rules_data;
              this.leave_calculation_data = res.data.leave_calculation_data;

              this.leave_master.emp_type = JSON.parse(
                res.data.leave_rules_data.emp_type
              );

              this.leave_master.designation = JSON.parse(
                res.data.leave_rules_data.designation
              );
              this.leave_master.site_id = JSON.parse(
                res.data.leave_rules_data.site_id
              );
              this.leave_master.min_service_year = `${res.data.leave_rules_data.min_service_year}`;

              this.leave_master.emp_id = JSON.parse(
                res.data.leave_rules_data.emp_id
              );

              this.leave_master.role = JSON.parse(
                res.data.leave_rules_data.role
              );

              this.leave_master.department = JSON.parse(
                res.data.leave_rules_data.department
              );

              if (this.leave_master.site_id) {
                this.fetchAllEmployeeSiteBased(this.leave_master.site_id);
              }
              this.displayMinLeave(res.data.leave_rules_data.is_leave_encash);
              this.displayCarryForward(
                res.data.leave_rules_data.is_carry_forward
              );
              this.fetchOrgnaisation();
              this.loader = false;
            });
        }
      },
    },
  },
  methods: {
    applicableTab(step,step_count){
      this.$nextTick(() => {
        this.$refs.form.validate()
        if((step==1 || step==3) && this.$refs.leave_calculation.validate()){
          this.e1=step_count
        }else if((step==2 || step==1) && this.$refs.leave_applicable_for.validate()){
          this.e1=step_count
        }
      }); 
    },
    fetchDesignation() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_emp_deignation",{
          params:{

            org_id: this.user.hr_employee.org_id,
            site_id: this.user.hr_employee.site_id,
          }
        })
        .then((response) => {
          this.designation_array = response.data.emp_designation;
          if (!this.$route.query.slug) {
            this.selectEmployeeDesignation();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    changeNextTab(tab_name,value) {
      console.log(tab_name);
      console.log(value);
      if (
        this.$refs.leave_calculation.validate() &&
        tab_name == "leave_calculation"
      ) {
        this.e1 = Number(value) + 1;
        console.log(this.e1);
      }
      if (
        this.$refs.leave_applicable_for.validate() &&
        tab_name == "leave_applicable_for"
      ) {
        this.e1 = Number(value) + 1;
      }
    },
    changePreviousTab(value) {
      this.e1 = value - 1;
    },
    clearfn(year) {
      if (year == "") {
        this.leave_master.min_service_year = "0";
      }
    },
    fetchRoles() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_all_roles")
        .then((res) => {
          this.roles_array = res.data.roles_details;
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
    fetchOrgSite(org_id) {
      // this.fetchAllEmployee(org_id);
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_org_site", {
          params: {
            org_id: org_id,
          },
        })
        .then((res) => {
          this.site_array = res.data.org_site_details;
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
    fetchAllEmployeeSiteBased(site_id) {
      // this.all_employee_details = [];
      if (site_id.length == 0) {
        this.leave_master.emp_id = [];
        return (this.org_employee_array = []);
      }
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetch_all_employee_site_based",
          {
            params: {
              site_id: site_id,
              org_id: this.leave_master.org_id,
            },
          }
        )
        .then((res) => {
          this.org_employee_array = res.data.all_employee_details;
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

    calculateEffectiveDate(calculation_type) {
      var CurrentDate = new Date().toISOString().slice(0, 10);
      this.calc_type_longname = this.calculation_type_array.find(
        (x) => x.id === calculation_type
      ).longname;
      var quarter_increment = 0;
      this.$route.query.slug
        ? (quarter_increment = 1)
        : (quarter_increment = 0);

      if (this.leave_master.leave_calculation_year == "Financial Year") {
        console.log(
          "reporting based on",
          this.leave_master.leave_calculation_year
        );
        if (this.calc_type_longname == "Daily" && this.leave_master) {
          if (
            CurrentDate >= this.financial_year_data.start_date &&
            CurrentDate < this.financial_year_data.end_date
          ) {
            var present_day = moment().format("YYYY-MM-DD");
            this.leave_master.effective_date = "";
            this.leave_master.effective_date = present_day;
          } else {
            this.isDisabled = true;
            this.flashMessage.error({
              message: this.$t("financial_year_not_started"),
              time: 4000,
              blockClass: "custom-block-class",
            });
          }
          // this.leave_calculation.effective_date=myDate
        } else if (
          this.calc_type_longname == "Quarterly" &&
          this.financial_year_data
        ) {
          if (
            CurrentDate >= this.financial_year_data.start_date &&
            CurrentDate < this.financial_year_data.end_date
          ) {
            if (this.leave_master.id > 0) {
              var quarterly_month_increament = moment(
                this.leave_master.effective_date
              )
                .add(quarter_increment, "quarter")
                .startOf("quarter")
                .format("YYYY-MM-DD");
              // this.leave_calculation.effective_date = quarterly_month_increament;
            } else {
              var quarterly_month_increament = moment()
                .add(quarter_increment, "quarter")
                .startOf("quarter")
                .format("YYYY-MM-DD");
            }
            this.leave_master.effective_date = quarterly_month_increament;
          } else {
            this.isDisabled = true;
            this.flashMessage.error({
              message: this.$t("financial_year_not_started"),
              time: 4000,
              blockClass: "custom-block-class",
            });
          }
        } else if (
          this.calc_type_longname == "Monthly" &&
          this.financial_year_data
        ) {
          if (
            CurrentDate >= this.financial_year_data.start_date &&
            CurrentDate < this.financial_year_data.end_date
          ) {
            var first_day_of_month = moment()
              .add(quarter_increment, "month")
              .startOf("month")
              .format("YYYY-MM-DD");

            this.leave_master.effective_date = first_day_of_month;
          } else {
            this.isDisabled = true;
            this.flashMessage.error({
              message: this.$t("financial_year_not_started"),
              time: 4000,
              blockClass: "custom-block-class",
            });
          }
        } else if (this.calc_type_longname == "Yearly") {
          if (
            CurrentDate >= this.financial_year_data.start_date &&
            CurrentDate < this.financial_year_data.end_date
          ) {
            var present_year = moment()
              .add(quarter_increment, "year")
              .startOf("year")
              .format("YYYY-MM-DD");

            this.leave_master.effective_date = present_year;
          } else {
            this.isDisabled = true;
            this.flashMessage.error({
              message: this.$t("financial_year_not_started"),
              time: 4000,
              blockClass: "custom-block-class",
            });
          }
        } else {
          this.isDisabled = true;
          this.flashMessage.error({
            message: this.$t("no_financial_year"),
            time: 4000,
            blockClass: "custom-block-class",
          });
        }
      } else if (this.leave_master.leave_calculation_year == "Calender Year") {
        // var start_of_year = new Date(new Date().getFullYear(), 0, 1);
        // var end_of_year = new Date(new Date().getFullYear(), 11, 31);
        var CurrentDate = new Date().toISOString().slice(0, 10);
        if (this.calc_type_longname == "Daily" && this.leave_master) {
          var present_day = moment().format("YYYY-MM-DD");
          this.leave_master.effective_date = "";
          this.leave_master.effective_date = present_day;

          // this.leave_calculation.effective_date=myDate
        } else if (
          this.calc_type_longname == "Quarterly" &&
          this.financial_year_data
        ) {
          var quarterly_month_increament = moment()
            .add(quarter_increment, "quarter")
            .startOf("quarter")
            .format("YYYY-MM-DD");
          this.leave_master.effective_date = quarterly_month_increament;
        } else if (
          this.calc_type_longname == "Monthly" &&
          this.financial_year_data
        ) {
          var first_day_of_month = moment()
            .add(quarter_increment, "month")
            .startOf("month")
            .format("YYYY-MM-DD");
          this.leave_master.effective_date = first_day_of_month;
        } else if (this.calc_type_longname == "Yearly") {
          var present_year = moment()
            .add(quarter_increment, "year")
            .startOf("year")
            .format("YYYY-MM-DD");

          this.leave_master.effective_date = present_year;
        }
      }
    },
    formattedEffectiveDate(formatted_date) {
      // console.log("formatted date", this.leave_master.effective_date);
      this.leave_master.effective_date = formatted_date;
    },
    formattedEffectiveEndDate(formatted_date) {
      this.leave_master.effective_end_date = formatted_date;
    },
    fetchLeave() {
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetch_leave_type_calculation" +
            this.leave_master.leave_name
        )
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.leave_array = res.data.leave_rules_data;
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
          } else {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
            console.log("error message", array_data);
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log("error", err);
        });
    },
    fetchFinancialYear() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_active_financial_year")
        .then((res) => {
          this.financial_year_data = res.data.active_financial_year;
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
    fetchOrgnaisation() {
      if (!this.user.hr_employee.emprole_name.includes("SuperUser")) {
        this.leave_master.org_id = this.user.hr_employee.org_id;
        this.leave_master.leave_calculation_year =
          this.user.hr_employee.user_org.leave_calculation_year;
        axios
          .get(
            process.env.VUE_APP_API_URL_ADMIN +
              "fetchorg/" +
              this.leave_master.org_id
          )
          .then((res) => {
            if (Array.isArray(res.data.message)) {
              this.array_data = res.data.message.toString();
            } else {
              this.array_data = res.data.message;
            }
            if (res.data.status == "S") {
              this.initval = false;
              this.organisation = res.data.org.shortname;
              this.fetchOrgSite(this.leave_master.org_id);
            } else if (res.data.status == "E") {
              this.initval = false;
              this.flashMessage.error({
                message: this.array_data,
                time: 4000,
                blockClass: "custom-block-class",
              });
            } else {
              this.initval = false;
              this.flashMessage.error({
                message: this.array_data,
                time: 4000,
                blockClass: "custom-block-class",
              });
              console.log("error message", array_data);
            }
          })
          .catch((err) => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });
            console.log("error", err);
            this.initval = false;
          });
      } else {
        axios
          .get(process.env.VUE_APP_API_URL_ADMIN + "getorganisation")
          .then((res) => {
            this.organisation_array = res.data.data;
          })

          .catch((err) => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class",
            });

            console.log(" error" + err);
          });
      }
    },
    selectEmployeeType() {
      if (this.selectall_employee_type) {
        this.leave_master.emp_type = [];
      } else {
        let initial_array = [];
        this.employee_type_array.map((ele) => {
          initial_array.push(ele.employee_type);
        });
        this.leave_master.emp_type = initial_array;
        initial_array = [];

        // this.leave_master.emp_type = this.employee_type_array.slice();
      }
    },
    selectEmpRole() {
      if (this.selectall_employee_role) {
        this.leave_master.role = [];
      } else {
        let initial_array = [];
        this.roles_array.map((ele) => {
          initial_array.push(ele.rolename);
        });
        this.leave_master.role = initial_array;
        initial_array = [];

        // this.leave_master.role = this.roles_array.slice();
      }
    },
    selectExceptionEmpRole() {
      if (this.selectall_exception_employee_role) {
        this.leave_master.exception_role = [];
      } else {
        this.leave_master.exception_role = this.roles_array.slice();
      }
    },
    selectExceptionEmployeeType() {
      if (this.selectall_exception_employee_type) {
        this.leave_master.exception_emp_type = [];
      } else {
        this.leave_master.exception_emp_type = this.employee_type_array.slice();
      }
    },
    selectEmployeeDesignation() {
      if (this.selectall_employee_designation) {
        this.leave_master.designation = [];
      } else {
        let initial_array = [];
        this.designation_array.map((ele) => {
          initial_array.push(ele.designation);
        });
        this.leave_master.designation = initial_array;
        initial_array = [];
        // this.leave_master.designation = this.designation_array.slice();
      }
    },
    selectExceptionEmployeeDesignation() {
      if (this.selectall_exception_employee_designation) {
        this.leave_master.exception_designation = [];
      } else {
        this.leave_master.exception_designation =
          this.designation_array.slice();
      }
    },
    selectDepartment() {
      if (this.selectall_department) {
        this.leave_master.department = [];
      } else {
        let department = [];
        this.department_array.map((ele) => {
          department.push(ele.shortname);
        });
        this.leave_master.department = department;
        department = [];
      }
    },
    selectSite() {
      if (this.selectall_site) {
        this.leave_master.site_id = [];
      } else {
        let site = [];
        this.site_array.map((ele) => {
          site.push(ele.fnd_site.id);
        });
        this.leave_master.site_id = site;
        site = [];
      }
    },
    selectEmployeId() {
      if (this.selectall_employee) {
        this.leave_master.emp_id = [];
      } else {
        let initial_array = [];
        this.org_employee_array.map((ele) => {
          initial_array.push(ele.id);
        });
        this.leave_master.emp_id = initial_array;
        initial_array = [];
      }
    },
    displayMinLeave(values) {
      this.min_leave = values;
    },
    displayCarryForward(carry_forward_values) {
      this.store_carry_forward = carry_forward_values;
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
    fetchLeaveData() {
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetch_all_leave_rules_details"
        )
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.initval = false;
            this.leave_array = res.data.leave_rules_data;
          } else if (res.data.status == "E") {
            this.initval = false;
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
          } else {
            this.initval = false;
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
            console.log("error message", array_data);
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log("error", err);
          this.initval = false;
        });
    },
    submitLeaveMaster(change_tab, from_tab) {
      console.log(change_tab, from_tab);
      if(from_tab==1){
        !this.$refs.form.validate()
       if(!this.$refs.leave_calculation.validate()){
        console.log("object");
        return  
       }
      }else if(from_tab==2){
         if(!this.$refs.leave_applicable_for.validate()){
          return
        }
      }else if(from_tab=3){
        if(!this.$refs.restriction.validate()){
          return 
        }
      }
      if (this.$refs.form.validate()) {
      this.isDisabled = true;
      this.isBtnLoading = true;
      if (change_tab == "save") {
        this.isLeavCalculationLoading = true;
        this.isSavenextLeaveCalcDisabled = true;
        this.isLeavCalculationDisabled = true;
      }
      if (change_tab == "leave_calculation") {
        this.isSavenextLeaveCalcDisabled = true;
        this.isSavenextLeaveCalc = true;
        this.isLeavCalculationDisabled = true;
      }
      //    leave_applicale_next_loader: false,
      // leave_applicale_next_disabled: false,
      // leav_applicable_loader: false,
      // leav_applicable_disabled: false,
      if (change_tab == "save_leave_applicable") {
        this.leav_applicable_loader = true;
        this.leave_applicale_next_disabled = true;
        this.leav_applicable_disabled = true;
      }
      if (change_tab == "leave_applicable_for") {
        this.leave_applicale_next_loader = true;
        this.leave_applicale_next_disabled = true;
        this.leav_applicable_disabled = true;
      }
      // this.isBtnLoading = true;
      // Form is valid, process

      axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "create_leave_rules",
          this.leave_master
        )
        .then((res) => {
          this.isBtnLoading = false;
          this.isLeavCalculationLoading = false;
          this.isDisabled = false;
          this.isSavenextLeaveCalc = false;
          this.isSavenextLeaveCalcDisabled = false;
          this.leav_applicable_loader = false;
          this.leave_applicale_next_disabled = false;
          this.leav_applicable_disabled = false;
          this.leave_applicale_next_loader = false;
          this.isLeavCalculationDisabled = false;

          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            if (res.data.leave_rules) {
              this.leave_master.id = res.data.leave_rules.id;
            }
            this.message = res.data.message;
            this.flashMessage.success({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });

           if (change_tab == "finalSubmit") {
              this.flashMessage.success({
                message: this.array_data,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.$router.push({
                name: "leavemaster",
              });
            } else {

              this.changeNextTab(change_tab, from_tab);
            }
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.isBtnLoading = false;
            this.isDisabled = false;
          } else {
            this.isBtnLoading = false;
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
          this.isLeavCalculationLoading = false;
          this.isLeavCalculationDisabled = false;
          this.isSavenextLeaveCalc = false;
          this.isSavenextLeaveCalcDisabled = false;
          this.leav_applicable_loader = false;
          this.leave_applicale_next_disabled = false;
          this.leav_applicable_disabled = false;
          this.leave_applicale_next_loader = false;
          console.log("error", err);
        });
      // } else {
      //   //alert("Form is Invalid");
      }
    },
    fetchEmployeeType() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_all_emp_no_details")
        .then((res) => {
          this.employee_type_array = res.data.all_employee_number_details;
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
    fetchLookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "GENDER_LEAVE",
          },
        })
        .then((response) => {
          this.gender_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "DEPARTMENT",
          },
        })
        .then((response) => {
          this.department_array = response.data.lookup_details;
          if (!this.$route.query.slug) {
            this.selectDepartment();
          }
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "DATE_CONFIRMATION",
          },
        })
        .then((response) => {
          this.date_confirmation_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "EFFECTIVE_YEAR",
          },
        })
        .then((response) => {
          this.effective_year_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "CALCULATION_TYPE",
          },
        })
        .then((response) => {
          this.calculation_type_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "LEAVE_MARITAL_STATUS",
          },
        })
        .then((response) => {
          this.maritalstatus_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "LEAVE_NAME",
          },
        })
        .then((response) => {
          this.leave_name_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "REPORTING_BASED_ON",
          },
        })
        .then((response) => {
          this.reporting_based_on_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    leaveshortnamecreate(leave) {
      this.leave_master.shortname = "";
      this.leave_master.shortname = leave[0].charAt().toUpperCase();
      for (var l = 0; l < leave.length; l++) {
        if (leave[l].charAt() == " ") {
          this.leave_master.shortname =
            this.leave_master.shortname + leave[l + 1].charAt().toUpperCase();
        }
      }
    },
  },
};
</script>
<style scoped>
.leave_applicable_font_size {
  font-size: 18px;
  font-weight: 700;
}

.pl-30 {
  padding-left: 30px;
}

.select_icon_font_size {
  font-size: 26px;
}
.mt-30 {
  margin-top: 30px !important;
}
.input_filed {
  position: relative;
}
.select_field {
  position: absolute;
  right: 12px;
  top: 12px;
  width: 45%;
  height: 20px !important;
}
.select_field /deep/ .v-label--active {
  background: white;
  padding: 0px 12px 0px 12px;
}
.tab_heading_font {
  font-weight: bold !important;
  color: black !important;
}
</style>