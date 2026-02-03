<template>
  <div class="container-fluid main-20 p-0">
    <div class>
      <v-card class="p-2" variant="outlined">
        <v-card-text>
          <div>
            <div class="text-h6 text-primary">{{projects.project_name}}</div>
          </div>
        </v-card-text>
      </v-card>

      <!-- <div class="card-header">
        <div>
          <div
            class="card-header-title font-size-lg text-capitalize titlewrap"
            v-if="displayprojectdetails == 'true'"
          >{{ $t("create_project") }}</div>
          <div
            class="card-header-title font-size-lg text-capitalize titlewrap"
            v-else
          >{{ $t("project_details") }}</div>
        </div>
      </div>-->

      <v-tabs
        v-if="user_role.includes('HR') || (user_role.includes('Manager'))"
        class="vtabmainuserview"
      >
        <Tabs
          :tabs="tabs"
          :currentTab="currentTab"
          :wrapper-class="'shadow-tabs inline-tabs align-self-center'"
          style="display: inline-flex"
          :tab-class="'tab-item'"
          :tab-active-class="'tab-item-active'"
          :line-class="'tab-item-line'"
          @onClick="handleClick"
        />
      </v-tabs>
      <div
        v-else-if="(projects.active_flag ==1 || projects.active_flag ==0) && $route.query.from != 'add_new'"
      >

        <v-tabs>
          <Tabs
            :tabs="tabs2"
            :currentTab="currentTab2"
            :wrapper-class="'shadow-tabs inline-tabs align-self-center'"
            style="display: inline-flex"
            :tab-class="'tab-item'"
            :tab-active-class="'tab-item-active'"
            :line-class="'tab-item-line'"
          />
        </v-tabs>
      </div>

      <div v-else>
        <v-tabs>
          <Tabs
            :tabs="tabs3"
            :currentTab="currentTab3"
            :wrapper-class="'shadow-tabs inline-tabs align-self-center'"
            style="display: inline-flex"
            :tab-class="'tab-item'"
            :tab-active-class="'tab-item-active'"
            :line-class="'tab-item-line'"
          />
        </v-tabs>
      </div>

      <div v-if="currentTab=='teams' && $route.query.from != 'add_new'" class="card">
        <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />

        <div class="my-2 px-5 mt-5 py-2 mx-2 desc_item rounded px-2">
          <strong>{{$t('description')}}:</strong>
          <!--              
                <div
                  v-if="more"
                  class="text-caption proj_desc show_more"
                  :inner-html.prop="projects.description"
          ></div>-->

          <v-expand-transition v-if="more">
            <div
              v-if="more"
              height="100"
              class="text-caption proj_desc show_more"
              :inner-html.prop="projects.description"
            ></div>
          </v-expand-transition>

          <v-expand-transition v-else>
            <div
            v-if="projects.description"
              class="text-caption proj_desc"
              :inner-html.prop="projects.description | truncate(250)"
            ></div>
          </v-expand-transition>

          <div class="text-end" v-if="projects.description && projects.description.length>=250">
            <v-btn
              x-small
              py-2
              class="my-2"
              v-bind:class="[
                      more == 1 ?'warning' :'success'
                    ]"
              @click="show"
            >{{more? $t('less') : $t('more')}}</v-btn>
          </div>
        </div>

        <v-layout class="justify-content-start my-5 px-3 team_main" wrap>
          <v-flex
          
            v-for="(member, member_index) in team_members"
            :key="member_index"
            md3
            class="pr-2"
          >
          <!-- -->
            <v-card
              outlined
              class="rounded py-3 pr-2 hover_shine1"
     
              tile
            >
              <v-row align="center" class="fill-height">
                <v-col class="py-0 text-center  pl-4" cols="3">
                      <v-avatar v-if="member.project_id && member.hr_emp_id.profile_pic">
                    <v-img  :src="envImagePath + member.hr_emp_id.profile_pic" alt></v-img>
                  </v-avatar>
                  <v-avatar v-else-if="member.manager_details && member.manager_details.profile_pic">
                    <v-img  :src="envImagePath + member.manager_details.profile_pic" alt></v-img>
                  </v-avatar>
                  <v-avatar v-else>
                    <v-img src="@/assets/images/default-user-profile-picture.png" alt="John"></v-img>
                  </v-avatar>
                  
                </v-col>
                <v-col v-if="member.project_id" cols="9" class="py-0 px-0">
                  <v-list-item color="rgba(0, 0, 0, .4)" >
                    <v-list-item-content>
                      <v-list-item-title
                        class="full_code font-weight-bold"
                      >{{member.hr_emp_id.Full_Code}}</v-list-item-title>
                      <v-list-item-subtitle
                        class=""
                      >{{member.hr_emp_id.designation.longname}}</v-list-item-subtitle>
                      <v-list-item-subtitle class="">{{member.hr_emp_id.user_email}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>

                <v-col cols="9" v-else class="py-0 px-0">
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title
                        class="full_code font-weight-bold"
                      >{{member.manager_details.Full_Code}}</v-list-item-title>
                      <v-list-item-subtitle
                        class=""
                      >{{member.manager_details.designation.longname }}</v-list-item-subtitle>
                      <v-list-item-subtitle
                        class=""
                      >{{ member.manager_details.user_email }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
              </v-row>
            </v-card>
          </v-flex>
        </v-layout>
        <div class="d-block text-right card-footer">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div v-on="on" class="d-inline-block mr-2">
                <v-btn small @click="$router.go(-1)" class="secondary">
                  {{
                  $t("cancel")
                  }}
                </v-btn>
              </div>
            </template>
            <span>{{ $t("cancel") }}</span>
          </v-tooltip>
        </div>
      </div>
      <div v-if="currentTab=='project_details' && $route.query.from != 'add_new'">
        <!-- <div class="card-header">
          <div>
            <div
              class="card-header-title font-size-lg text-capitalize titlewrap"
              v-if="displayprojectdetails == 'true'"
            >{{ $t("create_project") }}</div>
            <div
              class="card-header-title font-size-lg text-capitalize titlewrap"
              v-else
            >{{ $t("project_details") }}</div>
          </div>
        </div> -->

        <div class="card-body" v-if="displayprojectdetails == 'true'">
          <div>
            <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
            <v-form ref="form" v-model="valid">
              <!-- <h5 class="pl-2 mb-5">{{ $t("project_details") }}</h5> -->
              <div class="row">
                <div class="col-md-6">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-on="on"
                        v-model="projects.project_name"
                        :rules="fieldRules"
                        v-bind:label="$t('project_name')"
                        required
                        class="required_field"
                        outlined
                        dense
                      ></v-text-field>
                    </template>
                    <span>{{ $t("project_name") }}</span>
                  </v-tooltip>
                </div>
                <div class="col-md-6 mb-4">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-autocomplete
                        :disabled="!user.hr_employee.emprole_name.includes('HR')"
                        class="required_field"
                        v-bind:label="$t('project_manager')"
                        no-data-text="No Data available"
                        v-on="on"
                        v-model="projects.project_manager_id"
                        :rules="fieldRules"
                        :items="managerlist"
                        item-value="managerdetails.id"
                        item-text="managerdetails.Full_Code"
                        outlined
                        dense
                      ></v-autocomplete>
                    </template>
                    <span>{{ $t("project_manager") }}</span>
                  </v-tooltip>
                </div>

                <div class="col-md-6">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-on="on"
                        v-model="projects.client_name"
                        :rules="fieldRules"
                        v-bind:label="$t('client_name')"
                        required
                        class="required_field mt_30"
                        outlined
                        dense
                      ></v-text-field>
                    </template>
                    <span>{{ $t("client_name") }}</span>
                  </v-tooltip>
                </div>
                <div class="col-md-3 mt_30">
                  <!-- :min="todaysdate" -->
                  <DatePicker
                    :label="$t('start_date')"
                    :rules="fieldRules"
                    
                    :class_required="'RequiredField'"
                    :stored_date="projects.start_date"
                    @formatted_date="formattedStartDate"
                    dense
                    v-model="projects.start_date"
                  />
                </div>
                <div class="col-md-3 mt_30">
                  <DatePicker
                    :label="$t('end_date')"
                    :min="projects.start_date"
                    :stored_date="projects.end_date"
                    @formatted_date="formattedEndDate"
                    v-model="projects.end_date"
                    dense
                  />
                </div>
                <div class="col-md-12 mt_30">
                  <quillEditor
                    v-model="projects.description"
                    tag-name="textarea"
                    id="description"
                    name="description"
                    label="Description"
                    :editor="editor"
                    :config="editorConfig"
                  ></quillEditor>
                </div>
                <div class="col-md-2">
                  <!-- <v-switch v-model="projects.active_flag" v-bind:label="$t('status')" flat inset></v-switch> -->
                </div>
              </div>
            </v-form>
          </div>

          <div class="d-block text-right mt-5 mr-4">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on" class="d-inline-block mr-2">
                  <v-btn small @click="$router.go(-1)" class="secondary">
                    {{
                    $t("cancel")
                    }}
                  </v-btn>
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
                    @click="saveProject"
                    small
                    class="mr-2 success hover_shine"
                  >
                    {{ $t("save") }}
                    <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
                  </v-btn>
                </div>
              </template>
              <span>{{ $t("save") }}</span>
            </v-tooltip>
          </div>
        </div>
        <div v-else class="px-3 card">
          <v-layout wrap>
            <v-flex xs12 sm6 md6 pl-2 pt-4 pl-6>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="projects.project_name"
                    :rules="fieldRules"
                    v-bind:label="$t('project_name')"
                    readonly
                    required
                    class="required_field"
                    outlined
                    dense
                  ></v-text-field>
                </template>
                <span>{{ $t("project_name") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 sm6 md6 pl-2 pt-4>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    class="required_field"
                    v-bind:label="$t('project_manager')"
                    v-on="on"
                    v-model="projects.project_manager_id"
                    :rules="fieldRules"
                    :items="managerlist"
                    item-value="managerdetails.id"
                    item-text="managerdetails.full_details"
                    outlined
                    readonly
                    dense
                  ></v-autocomplete>
                </template>
                <span>{{ $t("project_manager") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>

          <v-layout wrap>
            <v-flex xs12 sm6 md6 pl-2 pt-4 pl-6>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="projects.client_name"
                    :rules="fieldRules"
                    v-bind:label="$t('client_name')"
                    required
                    readonly
                    class="required_field"
                    outlined
                    dense
                  ></v-text-field>
                </template>
                <span>{{ $t("client_name") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 sm6 md3 pl-2 pt-4 pl-6>
              <!-- :min="todaysdate" -->
              <DatePicker
                :label="$t('start_date')"
                :rules="fieldRules"
                
                :disable_field="disable_field"
                :class_required="'RequiredField'"
                :stored_date="projects.start_date"
                @formatted_date="formattedStartDate"
                dense
                v-model="projects.start_date"
              />
            </v-flex>
            <v-flex xs12 sm6 md3 pl-2 pt-4>
              <DatePicker
                :label="$t('end_date')"
                :disable_field="disable_field"
                :min="projects.start_date"
                :stored_date="projects.end_date"
                @formatted_date="formattedEndDate"
                v-model="projects.end_date"
                dense
                readonly
                disabled
              />
            </v-flex>
          </v-layout>

          <v-tabs class="vtabmainuserview">
            <Tabs
              :tabs="tabs1"
              :currentTab="currentTab1"
              :wrapper-class="'shadow-tabs inline-tabs align-self-center'"
              style="display: inline-flex"
              :tab-class="'tab-item'"
              :tab-active-class="'tab-item-active'"
              :line-class="'tab-item-line'"
              @onClick="handleClick1"
            />
          </v-tabs>

          <div v-if="currentTab1=='activity'" class="title" active>
            <v-sheet class="vsheetbtab">
              <pmo-project-activity :project_name="projects.project_name" :projectid="project_id" />
            </v-sheet>
          </div>
          <div v-if="currentTab1=='resource_allocation'" title="Resource Allocation" :active="true">
            <v-sheet class="vsheetbtab">
              <PmoResourceAllocation
                :project_name="projects.project_name"
                :projectid="project_id"
                :projects="projects"
                :project_start_date="projects.start_date"
                :project_end_date="projects.end_date"
              />
            </v-sheet>
          </div>
          <div v-if="currentTab1=='resource_history'" title="Resource History">
            <v-sheet class="vsheetbtab">
              <pmo-project-history :project_name="projects.project_name" :projectid="project_id" />
            </v-sheet>
          </div>

          <div class="d-block text-right card-footer">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on" class="d-inline-block mr-2">
                  <v-btn small @click="$router.go(-1)" class="secondary">
                    {{
                    $t("cancel")
                    }}
                  </v-btn>
                </div>
              </template>
              <span>{{ $t("cancel") }}</span>
            </v-tooltip>
          </div>
        </div>
      </div>
      <div v-if="currentTab3=='project_details' && $route.query.from == 'add_new'">
        <!-- <div class="card-header">
          <div>
            <div
              class="card-header-title font-size-lg text-capitalize titlewrap"
              v-if="displayprojectdetails == 'true'"
            >{{ $t("create_project") }}</div>
            <div
              class="card-header-title font-size-lg text-capitalize titlewrap"
              v-else
            >{{ $t("project_details") }}</div>
          </div>
        </div> -->

        <div class="card-body" v-if="displayprojectdetails == 'true'">
          <div>
            <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
            <v-form ref="form" v-model="valid">
              <!-- <h5 class="pl-2 mb-5">{{ $t("project_details") }}</h5> -->
              <div class="row">
                <div class="col-md-6">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-on="on"
                        v-model="projects.project_name"
                        :rules="fieldRules"
                        v-bind:label="$t('project_name')"
                        required
                        class="required_field"
                        outlined
                        dense
                      ></v-text-field>
                    </template>
                    <span>{{ $t("project_name") }}</span>
                  </v-tooltip>
                </div>
                <div class="col-md-6 mb-4">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-autocomplete
                        :disabled="!user.hr_employee.emprole_name.includes('HR')"
                        class="required_field"
                        v-bind:label="$t('project_manager')"
                        no-data-text="No Data available"
                        v-on="on"
                        v-model="projects.project_manager_id"
                        :rules="fieldRules"
                        :items="managerlist"
                        item-value="managerdetails.id"
                        item-text="managerdetails.Full_Code"
                        outlined
                        dense
                      ></v-autocomplete>
                    </template>
                    <span>{{ $t("project_manager") }}</span>
                  </v-tooltip>
                </div>

                <div class="col-md-6">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-on="on"
                        v-model="projects.client_name"
                        :rules="fieldRules"
                        v-bind:label="$t('client_name')"
                        required
                        class="required_field mt_30"
                        outlined
                        dense
                      ></v-text-field>
                    </template>
                    <span>{{ $t("client_name") }}</span>
                  </v-tooltip>
                </div>
                <div class="col-md-3 mt_30">
                  <!-- :min="todaysdate" -->
                  <DatePicker
                    :label="$t('start_date')"
                    :rules="fieldRules"
                    :class_required="'RequiredField'"
                    :stored_date="projects.start_date"
                    @formatted_date="formattedStartDate"
                    dense
                    v-model="projects.start_date"
                  />
                </div>
                <div class="col-md-3 mt_30">
                  <DatePicker
                    :label="$t('end_date')"
                    :min="projects.start_date"
                    :stored_date="projects.end_date"
                    @formatted_date="formattedEndDate"
                    v-model="projects.end_date"
                    dense
                  />
                </div>
                <div class="col-md-10 mt_30">
                  <quillEditor
                    v-model="projects.description"
                    tag-name="textarea"
                    id="description"
                    name="description"
                    label="Description"
                    :editor="editor"
                    :config="editorConfig"
                  ></quillEditor>
                </div>
                <div class="col-md-2">
                  <v-switch v-model="projects.active_flag" v-bind:label="$t('status')" flat inset></v-switch>
                </div>
              </div>
            </v-form>
          </div>

          <div class="d-block text-right mt-5 mr-4">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on" class="d-inline-block mr-2">
                  <v-btn small @click="$router.go(-1)" class="secondary">
                    {{
                    $t("cancel")
                    }}
                  </v-btn>
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
                    @click="saveProject"
                    small
                    class="mr-2 success hover_shine"
                  >
                    {{ $t("save") }}
                    <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
                  </v-btn>
                </div>
              </template>
              <span>{{ $t("save") }}</span>
            </v-tooltip>
          </div>
        </div>
        <div v-else class="px-3 card">
          <v-layout wrap>
            <v-flex xs12 sm6 md6 pl-2 pt-4 pl-6>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="projects.project_name"
                    :rules="fieldRules"
                    v-bind:label="$t('project_name')"
                    readonly
                    required
                    class="required_field"
                    outlined
                    dense
                  ></v-text-field>
                </template>
                <span>{{ $t("project_name") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 sm6 md6 pl-2 pt-4>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete
                    class="required_field"
                    v-bind:label="$t('project_manager')"
                    v-on="on"
                    v-model="projects.project_manager_id"
                    :rules="fieldRules"
                    :items="managerlist"
                    item-value="managerdetails.id"
                    item-text="managerdetails.full_details"
                    outlined
                    readonly
                    dense
                  ></v-autocomplete>
                </template>
                <span>{{ $t("project_manager") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>

          <v-layout wrap>
            <v-flex xs12 sm6 md6 pl-2 pt-4 pl-6>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="projects.client_name"
                    :rules="fieldRules"
                    v-bind:label="$t('client_name')"
                    required
                    readonly
                    class="required_field"
                    outlined
                    dense
                  ></v-text-field>
                </template>
                <span>{{ $t("client_name") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 sm6 md3 pl-2 pt-4 pl-6>
              <!-- :min="todaysdate" -->
              <DatePicker
                :label="$t('start_date')"
                :rules="fieldRules"
                :disable_field="disable_field"
                :class_required="'RequiredField'"
                :stored_date="projects.start_date"
                @formatted_date="formattedStartDate"
                dense
                v-model="projects.start_date"
              />
            </v-flex>
            <v-flex xs12 sm6 md3 pl-2 pt-4>
              <DatePicker
                :label="$t('end_date')"
                :disable_field="disable_field"
                :min="projects.start_date"
                :stored_date="projects.end_date"
                @formatted_date="formattedEndDate"
                v-model="projects.end_date"
                dense
                readonly
                disabled
              />
            </v-flex>
          </v-layout>

          <v-tabs class="vtabmainuserview">
            <Tabs
              :tabs="tabs1"
              :currentTab="currentTab1"
              :wrapper-class="'shadow-tabs inline-tabs align-self-center'"
              style="display: inline-flex"
              :tab-class="'tab-item'"
              :tab-active-class="'tab-item-active'"
              :line-class="'tab-item-line'"
              @onClick="handleClick1"
            />
          </v-tabs>

          <div v-if="currentTab1=='activity'" class="title" active>
            <v-sheet class="vsheetbtab">
              <pmo-project-activity :project_name="projects.project_name" :projectid="project_id" />
            </v-sheet>
          </div>
          <div v-if="currentTab1=='resource_allocation'" title="Resource Allocation" :active="true">
            <v-sheet class="vsheetbtab">
              <PmoResourceAllocation
                :project_name="projects.project_name"
                :projectid="project_id"
                :projects="projects"
                :project_start_date="projects.start_date"
                :project_end_date="projects.end_date"
              />
            </v-sheet>
          </div>
          <div v-if="currentTab1=='resource_history'" title="Resource History">
            <v-sheet class="vsheetbtab">
              <pmo-project-history :project_name="projects.project_name" :projectid="project_id" />
            </v-sheet>
          </div>

          <div class="d-block text-right card-footer">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on" class="d-inline-block mr-2">
                  <v-btn small @click="$router.go(-1)" class="secondary">
                    {{
                    $t("cancel")
                    }}
                  </v-btn>
                </div>
              </template>
              <span>{{ $t("cancel") }}</span>
            </v-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
import VueElementLoading from "vue-element-loading";
import DatePicker from "../Components/DatePicker.vue";
import { quillEditor } from "vue-quill-editor";
import PmoResourceAllocation from "./PmoResourceAllocation.vue";
import PmoProjectActivity from "./PmoProjectActivity.vue";
import PmoProjectHistory from "./PmoProjectHistory.vue";
import Tabs from "vue-tabs-with-active-line";

const TABS1 = [
  {
    title: "Activity",
    value: "activity"
  },
  {
    title: "Resource Allocation",
    value: "resource_allocation"
  },
  {
    title: "Resource History",
    value: "resource_history"
  }
];
const TABS = [
  {
    title: "My Team",
    value: "teams"
  },
  {
    title:true ? 'cond1' : '$10.00',
    value: "project_details"
  }
];
const TABS2 = [
  {
    title: "My Team",
    value: "teams"
  }
];
const TABS3 = [
  {
    title: "Create Project Details",
    value: "project_details"
  }
];
export default {
  components: {
    VueElementLoading,
    DatePicker,
    quillEditor,
    PmoResourceAllocation,
    PmoProjectActivity,
    PmoProjectHistory,
    Tabs
  },
  data: () => ({
    more: false,
    // tabs: TABS,
    tabs1: TABS1,
    tabs2: TABS2,
    tabs3: TABS3,
    currentTab: "teams",
    currentTab1: "resource_allocation",
    currentTab2: "teams",
    currentTab3: "project_details",

    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    editorConfig: {
      required: true
    },
    team_members: [],
    projects: {
      model: null,
      project_name: "",
      client_name: "",
      project_manager_id: "",
      start_date: "",
      end_date: "",
      description: "",
      active_flag: 1
    },
    user: "",
    displayprojectdetails: "",
    editor: "",
    start_date: "",
    end_date: "",
    valid: true,
    project_id: "",
    loader: false,
    isBtnLoading: false,
    isDisabled: false,
    categories: {
      longname: "",
      shortname: "",
      status: 1
    },
    description: "",
    managerlist: [],
    items: [],
    todaysdate: new Date().toISOString().substr(0, 10),
    disable_field: true,
    user_role: ""
  }),

  computed: {
    fieldRules() {
      return [v => !!v || this.$t("field_required")];
    },
   tabs(){
    return  [
  {
    title: "My Team",
    value: "teams"
  },
  {
    title:this.displayprojectdetails=='true' ? 'Create/Amend Project Details': 'Resource Allocation' ,
    value: "project_details"
  }
];
   }
  },

  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.fetchmanagerlist();
  },
  created() {},

  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          this.displayprojectdetails = this.$route.query.hide;
          this.project_id = this.$route.query.id;

          axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "fetchprojectbyslug?slug=" +
                this.$route.query.slug
            )
            .then(res => {
              this.btnloading = false;

              if (res.data.status == "S") {
                this.message = res.data.message;

                this.projects = res.data.projects;
                this.team_members = [
                  res.data.team_manager,
                  ...res.data.team_members
                ];
                this.user_role = res.data.user_role;
                if (
                  this.displayprojectdetails != "true" &&
                  this.$route.query.from == "amend"
                ) {
                  this.currentTab = "project_details";
                } else if (this.$route.query.from == "amend") {
                  this.currentTab = "project_details";
                }

                this.loader = false;
              } else if (res.data.status == "E") {
                this.message = res.data.message;
              }
            })
            .catch(err => {
              this.isDisabled = false;
              console.log("this error" + err);
            });
        } else if (this.$route.query.hide) {
          this.displayprojectdetails = this.$route.query.hide;
        }
      }
    }
  },

  methods: {
    show() {
      if (this.more == true) {
        this.more = false;
      } else {
        this.more = true;
      }
    },
    handleClick(newTab) {
      this.currentTab = newTab;
    },
    handleClick1(newTab) {
      this.currentTab1 = newTab;
    },
    saveProject() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "projectdetails",
            this.projects
          )
          .then(res => {
            if (Array.isArray(res.data.message)) {
              this.array_data = res.data.message.toString();
            } else {
              this.array_data = res.data.message;
            }
            if (res.data.status == "S") {
              this.flashMessage.success({
                message: this.array_data,
                time: 4000,
                blockClass: "custom-block-class"
              });
              this.message = res.data.message;
              this.$router.push({
                name: "projects"
              });
            } else if (res.data.status == "E") {
              this.isBtnLoading = false;
              (this.isDisabled = false),
                this.flashMessage.error({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class"
                });
              this.clear();
            } else {
              this.isBtnLoading = false;
              this.flashMessage.error({
                message: this.array_data
              });
              this.clear();
            }
          })
          .catch(err => {
            this.flashMessage.error({
              message: this.$t("something_went_wrong"),
              time: 4000,
              blockClass: "custom-block-class"
            });
            this.isBtnLoading = false;
            this.isDisabled = false;
            console.log("this error" + err);
          });
      }
    },
    formattedStartDate(formatted_date) {
      this.projects.start_date = formatted_date;
    },
    formattedEndDate(formatted_date) {
      if (formatted_date) {
        var currentTime = new Date().toISOString().substr(0, 10);
        if (formatted_date <= currentTime) {
          this.projects.active_flag = 0;
        }
      }
      this.projects.end_date = formatted_date;
    },
    clear() {
      this.$refs.form.reset();
    },

    fetchmanagerlist() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getmanagerlist")
        .then(res => {
          this.managerlist = res.data.managerlist;
          if (!this.user.hr_employee.emprole_name.includes("HR")) {
            this.projects.project_manager_id = this.user.hr_employee.id;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="css">
@import "~quill/dist/quill.core.css";
@import "~quill/dist/quill.snow.css";
@import "~quill/dist/quill.bubble.css";
</style>
  <style scoped>
.v-input--selection-controls {
  margin: 0px;
}
.mt_30 {
  margin-top: -30px !important;
}
.main-20 >>> .app-page-title {
  padding: 0px !important;
  margin: 0px !important;
}
.full_code {
  font-size: 14px;
}

.tabs__item {
  font-size: 11px !important;
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
.desc_item {
  border: 1px solid rgb(6, 8, 70);
  font-size: 15px;
  background: #ffffff;
}
.proj_desc /deep/ p {
  margin: 0px;
}
.hover_shine1 {
  position: relative;
  overflow: hidden;
  /* box-shadow: -2px 2px 2px #ccc; */
  border:1px solid #0b7076;
  width: fit-content; 
}

.hover_shine1:after {
  content: "";
  position: absolute;
  top: -50%;
  right: -200%;
  bottom: -100%;
  left: -100%;
  background: linear-gradient(
    to bottom,
    rgba(229, 172, 142, 0),
    rgba(255, 255, 255, 0.5) 50%,
    rgba(229, 172, 142, 0)
  );
  transform: rotateZ(30deg) translate(-15em, 25em);
}

/*This activates the sheen once the button has been hovered*/
.hover_shine1:hover::after {
  animation: hover_shine 1s forwards;
}

.show_more {
  max-height: 100%;
  transition: 6s ease-in-out;
}
.team_main{
  grid-row-gap: 12px !important;
}
</style>
