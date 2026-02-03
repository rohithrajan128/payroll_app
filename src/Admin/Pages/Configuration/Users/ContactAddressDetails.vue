<template>
  <div class="main-20 mt-5">
    <!-- <div class="pagetitle_in_userdetails">
      <page-title
        :heading="$t('contact_details')"
        :google_icon="google_icon"
      ></page-title>
    </div>-->
    <div>
      <v-app-bar flat color="white">
        <h5>
          <i class="fa fa-address-card mr-1"></i>

          {{ $t("contact_address_details") }}
        </h5>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              class="btn mr-2 mb-2 hover_shine add_new"
              v-if="view == 'userview' && status"
              small
              v-on="on"
              @click="dialog_open_when_add_contact"
              >{{ $t("add") }}</v-btn
            >
          </template>
          <span>{{ $t("add") }}</span>
        </v-tooltip>
      </v-app-bar>
      <div class="pa-3">
        <VueElementLoading
          :active="initval"
          spinner="bar-fade-scale"
          color="var(--primary)"
        />
        <v-row>
          <v-col
            v-for="(contact, index) in p_contact_details"
            :key="index"
            cols="12"
            md="4"
          >
            <v-card
              class="p-3 contact-info-card"
              @mouseover="showActions(index)"
              @mouseleave="hideActions()"
              v-bind:style="
                show_action_btn == true && hovered_index == index
                  ? 'background: #00000052;'
                  : ''
              "
            >
              <span class="contact-info" v-if="contact.primary">PRIMARY</span>
              <b style="font-size: 18px">{{
                contact.employee_contact_type.shortname
              }}</b
              ><br />
              <div style="font-size: 18px">{{ contact.contact_id }}</div>
              <div
                v-if="show_action_btn == true && hovered_index == index"
                style="position: absolute; top: 28px; left: 28%"
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      small
                      class="mr-3 edit_btn icon_size"
                      v-on="on"
                      @click="editContactDialog(contact.id)"
                      style="
                        background: white;
                        padding: 7px;
                        border-radius: 10px;
                      "
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
                      style="
                        background: white;
                        padding: 5px;
                        border-radius: 10px;
                      "
                      @click="deleteItem(contact, 'contact')"
                      >mdi-trash-can-outline</v-icon
                    >
                  </template>
                  <span>{{ $t("delete") }}</span>
                </v-tooltip>
              </div>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            v-for="(contact, index) in s_contact_details"
            :key="index"
            cols="12"
            md="4"
          >
            <v-card
              class="p-3 contact-info-card"
              @mouseover="showActionsS(index)"
              @mouseleave="hideActionsS()"
              v-bind:style="
                show_action_btn == true && s_hovered_index == index
                  ? 'background: #00000052;'
                  : ''
              "
            >
              <span class="contact-info" v-if="contact.primary">PRIMARY</span>
              <b style="font-size: 18px">{{
                contact.employee_contact_type.shortname
              }}</b
              ><br />
              <div style="font-size: 18px">{{ contact.contact_id }}</div>
              <div
                v-if="show_action_btn == true && s_hovered_index == index"
                style="position: absolute; top: 28px; left: 28%"
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      small
                      class="mr-3 edit_btn icon_size"
                      v-on="on"
                      @click="editContactDialog(contact.id)"
                      style="
                        background: white;
                        padding: 7px;
                        border-radius: 10px;
                      "
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
                      style="
                        background: white;
                        padding: 5px;
                        border-radius: 10px;
                      "
                      @click="deleteItem(contact, 'contact')"
                      >mdi-trash-can-outline</v-icon
                    >
                  </template>
                  <span>{{ $t("delete") }}</span>
                </v-tooltip>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>
      <!-- <v-data-table
        :loading="initval"
        :headers="headers"
        :items="contact_details"
        v-bind:no-data-text="$t('no_data_available')"
        :footer-props="{ 'items-per-page-text': $t('rows_per_page') }"
      >
        <template v-slot:item="props">
          <tr>
            <td v-if="props.item.employee_contact_type != null">
              {{ props.item.employee_contact_type.shortname }}
            </td>
            <td v-else>{{ $t("e-mail") }}</td>
            <td>{{ props.item.contact_id }}</td>
            <td>
              <span v-if="props.item.primary == 1">
                <v-chip
                  class="ma-2 danger"
                  text-color="white"
                  color="primary"
                  small
                  >{{ $t("yes") }}</v-chip
                >
              </span>
              <span v-else>
                <v-chip class="ma-2" color="orange" text-color="white" small>{{
                  $t("no")
                }}</v-chip>
              </span>
            </td>

            <td class="text-left" v-if="view == 'userview' && status">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    small
                    class="mr-3 edit_btn icon_size"
                    v-on="on"
                    @click="editContactDialog(props.item.id)"
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
                    @click="deleteItem(props.item, 'contact')"
                    >mdi-trash-can-outline</v-icon
                  >
                </template>
                <span>{{ $t("delete") }}</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table> -->
      <!-- <div class="pagetitle_in_userdetails">
        <page-title
          :heading="$t('Address_details')"
          :google_icon="google_icon2"
        ></page-title>
      </div>-->

      <div>
        <v-app-bar flat color="white">
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                class="btn mr-2 mb-2 hover_shine add_new"
                v-if="view == 'userview' && status"
                small
                v-on="on"
                @click="dialog_open_when_add"
                >{{ $t("add") }}</v-btn
              >
            </template>
            <span>{{ $t("add") }}</span>
          </v-tooltip>
        </v-app-bar>
        <div class="pa-3">
          <VueElementLoading
            :active="initval"
            spinner="bar-fade-scale"
            color="var(--primary)"
          />
          <v-row>
            <v-col
              v-for="(address, index) in p_address_details"
              :key="index"
              cols="12"
              md="6"
            >
              <v-card
                class="p-3 contact-info-card"
                @mouseover="showActionsPA(index)"
                @mouseleave="hideActionsPA()"
                v-bind:style="
                  show_action_btn == true && pa_hovered_index == index
                    ? 'background: #00000052;'
                    : ''
                "
              >
                <span class="contact-info" v-if="address.status == 1"
                  >PRIMARY</span
                >
                <b style="font-size: 16px"
                  >Address Type : {{ address.address_type }}</b
                ><br />
                <div style="font-size: 18px">{{ address.address }}</div>
                <div style="font-size: 18px">
                  {{ address.country_name.name }},
                  {{ address.state_name.name }}, {{ address.county }} -
                  {{ address.postcode }}
                </div>
                <div
                  v-if="show_action_btn == true && pa_hovered_index == index"
                  style="position: absolute; top: 28px; left: 40%"
                >
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        small
                        class="mr-3 edit_btn icon_size"
                        v-on="on"
                        @click="editContactAddressDialog(address.id)"
                        style="
                          background: white;
                          padding: 7px;
                          border-radius: 10px;
                        "
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
                        style="
                          background: white;
                          padding: 5px;
                          border-radius: 10px;
                        "
                        @click="deleteItem(address, 'address')"
                        >mdi-trash-can-outline</v-icon
                      >
                    </template>
                    <span>{{ $t("delete") }}</span>
                  </v-tooltip>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              v-for="(address, index) in s_address_details"
              :key="index"
              cols="12"
              md="6"
            >
              <v-card
                class="p-3 contact-info-card"
                @mouseover="showActionsSA(index)"
                @mouseleave="hideActionsSA()"
                v-bind:style="
                  show_action_btn == true && sa_hovered_index == index
                    ? 'background: #00000052;'
                    : ''
                "
              >
                <span class="contact-info" v-if="address.status == 1"
                  >PRIMARY</span
                >
                <b style="font-size: 16px"
                  >Address Type : {{ address.address_type }}</b
                ><br />
                <div style="font-size: 18px">{{ address.address }}</div>
                <div style="font-size: 18px">
                  {{ address.country_name.name }},
                  {{ address.state_name.name }}, {{ address.county }} -
                  {{ address.postcode }}
                </div>
                <div
                  v-if="show_action_btn == true && sa_hovered_index == index"
                  style="position: absolute; top: 28px; left: 40%"
                >
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        small
                        class="mr-3 edit_btn icon_size"
                        v-on="on"
                        @click="editContactAddressDialog(address.id)"
                        style="
                          background: white;
                          padding: 7px;
                          border-radius: 10px;
                        "
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
                        style="
                          background: white;
                          padding: 5px;
                          border-radius: 10px;
                        "
                        @click="deleteItem(address, 'address')"
                        >mdi-trash-can-outline</v-icon
                      >
                    </template>
                    <span>{{ $t("delete") }}</span>
                  </v-tooltip>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>
        <!-- <v-data-table
          :loading="initval1"
          :headers="headers1"
          :items="address_details"
          v-bind:no-data-text="$t('no_data_available')"
          :footer-props="{ 'items-per-page-text': $t('rows_per_page') }"
        >
          <template v-slot:item="props">
            <tr>
              <td style="width: 12%">{{ props.item.address_type }}</td>
              <td style="padding: 0px 30px">
                <v-tooltip bottom v-if="props.item.address" color="white">
                  <template v-slot:activator="{ on }">
                    <div class="description_hover_div_address" v-on="on">
                      {{ props.item.address }}
                    </div>
                  </template>
                  <v-sheet class="pa-4 b">{{ props.item.address }}</v-sheet>
                </v-tooltip>
              </td>
              <td>{{ props.item.country_name.name }}</td>
              <td>{{ props.item.state_name.name }}</td>
              <td>{{ props.item.county }}</td>
              <td>
                <span v-if="props.item.postcode">{{
                  props.item.postcode
                }}</span>
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>
              <td v-if="view == 'userview'">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <div
                      v-on="on"
                      class="maindivforswitch d-inline-block"
                      @click="changeStatus(props.item)"
                      readonly
                    >
                      <v-switch
                        v-model="props.item.status"
                        color="success"
                        readonly
                      ></v-switch>
                      <div
                        class="viconinswitchon"
                        v-if="props.item.status == 1"
                      >
                        <img
                          src="@/assets/images/correct_switch.png"
                          height="20px"
                        />
                      </div>
                      <div
                        class="viconinswitchoff"
                        v-if="props.item.status == 0"
                      >
                        <img
                          src="@/assets/images/delete_switch.png"
                          height="24px"
                        />
                      </div>
                    </div>
                  </template>
                  <span>{{ $t("status") }}</span>
                </v-tooltip>
              </td>
              <td class="text-left" v-if="view == 'userview' && status">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      small
                      class="mr-3 edit_btn icon_size"
                      v-on="on"
                      @click="editContactAddressDialog(props.item.id)"
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
                      @click="deleteItem(props.item, 'address')"
                      >mdi-trash-can-outline</v-icon
                    >
                  </template>
                  <span>{{ $t("delete") }}</span>
                </v-tooltip>
              </td>
            </tr>
          </template>
        </v-data-table> -->
      </div>

      <!--contact -->
      <v-dialog
        persistent
        v-model="contactdialog"
        small
        transition="dialog-bottom-transition"
        max-width="800px"
      >
        <v-card class="container" style="padding: 0px !important">
          <v-toolbar color="primary" dark>
            <span class="headline">{{ $t("create_contact_details") }}</span>
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
          <v-card-text class="mt-8">
            <v-container grid-list-md>
              <v-alert
                v-model="save_error"
                :text="save_error"
                color="error"
                icon="warning"
                outlined
                dismissible
                >{{ valertdialogmessage }}</v-alert
              >

              <v-form ref="usercontactform" v-model="valid">
                <!-- {{addmorecontacts1}}<br> -->
                <v-layout
                  class="layout_item"
                  v-for="(contact, contact_index) in addmorecontacts"
                  :key="contact_index"
                  wrap
                >
                  <v-flex
                    xs12
                    md4
                    pl-2
                    v-if="contact.type_id != null"
                    class="createlookupflex"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          v-on="on"
                          v-model="contact.type_id"
                          :rules="fieldRules"
                          v-bind:label="$t('contact_type')"
                          outlined
                          dense
                          class="required_field"
                          :items="contact_types"
                          item-value="id"
                          item-text="longname"
                          @change="
                            contact_type_rules(
                              contact.type_id,
                              contact_types,
                              contact_index
                            )
                          "
                        ></v-autocomplete>
                      </template>
                      <span>{{ $t("contact_type") }}</span>
                    </v-tooltip>
                    <CreateLookup
                      lookup_parent_name="EMPLOYEE_CONTACT"
                      @lookup_data="lookupMessage"
                      :dropdownlabel="$t('contact_type')"
                    ></CreateLookup>
                  </v-flex>
                  <v-flex v-if="contact.type_id" xs12 md4 pl-2>
                    <v-tooltip bottom v-if="contact.type_id == null">
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-on="on"
                          v-model="contact.contact_id"
                          :rules="[...fieldRules, ...emailRules]"
                          v-bind:label="$t('email')"
                          outlined
                          dense
                          class="required_field maindivexpandannouncemet"
                        ></v-text-field>
                      </template>
                      <span>{{ $t("email") }}</span>
                    </v-tooltip>

                    <v-tooltip
                      bottom
                      v-if="contact.type && contact.type == 'mobile'"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-on="on"
                          v-model="contact.contact_id"
                          maxlength="12"
                          :rules="[...fieldRules, ...phoneRules]"
                          v-bind:label="$t('contact_no')"
                          v-on:keypress="NumbersOnly"
                          outlined
                          dense
                          class="required_field maindivexpandannouncemet"
                        ></v-text-field>
                      </template>
                      <span>{{ $t("contact") }}</span>
                    </v-tooltip>
                    <v-tooltip bottom v-if="contact.type == 'email'">
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-on="on"
                          v-model="contact.contact_id"
                          :rules="[...fieldRules, ...emailRules]"
                          v-bind:label="$t('email')"
                          maxlength="35"
                          outlined
                          dense
                          class="required_field maindivexpandannouncemet"
                        ></v-text-field>
                      </template>
                      <span>{{ $t("email") }}</span>
                    </v-tooltip>
                    <v-tooltip bottom v-if="contact.type == 'skype'">
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-on="on"
                          v-model="contact.contact_id"
                          :rules="fieldRules"
                          v-bind:label="$t('contact_id')"
                          outlined
                          dense
                          class="required_field maindivexpandannouncemet"
                        ></v-text-field>
                      </template>
                      <span>{{ $t("contact_id") }}</span>
                    </v-tooltip>
                  </v-flex>

                  <v-flex xs12 md3 pl-3>
                    <div
                      class="align-items-start mb-10"
                      style="margin-top: -14px; margin-left: 13px"
                    >
                      <v-switch
                        v-model="contact.primary"
                        @click="checkprimaryexist(contact_index)"
                        v-bind:label="$t('primary')"
                        value="1"
                        inset
                        :readonly="contact.primary == '1' && not_edit"
                        color="green"
                        small
                      ></v-switch>
                    </div>
                  </v-flex>
                  <v-flex xs12 md2 class="add_flex">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <button
                          v-show="contact_index == addmorecontacts.length - 1"
                          v-if="plus_btn"
                          v-on="on"
                          x-small
                          rounded
                          class="btn btn-primary rounded-circle mr-2 primary addlanguagebutton px-1 py-0 mt-2"
                          @click="addmorecontact"
                          type="button"
                        >
                          <v-icon class="text-white" small>mdi-plus</v-icon>
                        </button>
                      </template>
                      <span>{{ $t("add") }}</span>
                    </v-tooltip>
                    <v-tooltip v-if="addmorecontacts.length > 1" bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon
                          class="delete_btn icon_size mt-2 mr-3"
                          v-on="on"
                          @click="removelanguage(contact_index)"
                          >mdi-trash-can-outline</v-icon
                        >
                      </template>
                      <span>{{ $t("remove") }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions class="container">
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on" class="d-inline-block mr-2">
                  <v-btn
                    v-on="on"
                    small
                    @click="close"
                    class="mb-3 font-weight-bold cancel-btn"
                    color="btn hover_shine cancel_button"
                    >{{ $t("cancel") }}</v-btn
                  >
                </div>
              </template>
              <span>{{ $t("cancel") }}</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  @click="savecontact()"
                  small
                  class="mr-2 success hover_shine mb-3"
                  color="green darken-1"
                  :disabled="submit_credential_disable"
                >
                  {{ $t("submit") }}
                  <b-spinner
                    :disabled="isBtnLoading"
                    small
                    v-if="isBtnLoading"
                  ></b-spinner>
                </v-btn>
              </template>
              <span>{{ $t("submit") }}</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- address -->
      <v-dialog
        persistent
        v-model="dialog"
        transition="dialog-bottom-transition"
        max-width="800px"
      >
        <v-card>
          <v-toolbar color="primary" dark>
            <span class="headline">{{
              $t("create_amend_contact_details")
            }}</span>
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
          <v-card-text class="mt-8">
            <v-container grid-list-md>
              <v-alert
                v-model="save_error"
                :text="save_error"
                color="error"
                icon="warning"
                outlined
                dismissible
                >{{ valertdialogmessage }}</v-alert
              >
              <v-form ref="userform" v-model="valid">
                <v-layout>
                  <v-flex xs12 sm6 md6 pl-2 class="createlookupflex">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          v-on="on"
                          v-model="address_details_model.address_type"
                          :rules="fieldRules"
                          v-bind:label="$t('address_type')"
                          outlined
                          dense
                          class="required_field"
                          :items="address_types"
                          item-value="longname"
                          item-text="longname"
                          @change="
                            checkPermanentAddress(
                              address_details_model.address_type
                            )
                          "
                        ></v-autocomplete>
                      </template>
                      <span>{{ $t("address_type") }}</span>
                    </v-tooltip>
                    <CreateLookup
                      lookup_parent_name="ADDRESS_TYPE"
                      @lookup_data="lookupMessage"
                    ></CreateLookup>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <div style="margin-top: -16px; padding-left:40px">
                      <div style="margin-bottom: -12px;">{{$t('primary')}}</div>
                      <v-switch
                        v-model="address_details_model.status"
                        inset
                        color="green"
                        small
                      ></v-switch>
                    </div>
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex xs12 sm12 md12 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-textarea
                          v-on="on"
                          v-model="address_details_model.address"
                          :rules="fieldRules"
                          maxlength="200"
                          counter="200"
                          v-bind:label="$t('address')"
                          class="required_field pr-2"
                          outlined
                          rows="2"
                          dense
                        ></v-textarea>
                      </template>
                      <span>{{ $t("address") }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
                <v-layout class="submitbuttonindialogusers">
                  <v-flex xs12 sm3 md3 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          v-on="on"
                          index="id"
                          :rules="fieldRules"
                          v-bind:label="$t('country')"
                          outlined
                          v-model="address_details_model.country"
                          :items="countries"
                          item-text="name"
                          item-value="id"
                          dense
                          class="required_field"
                          @change="fetch_states(address_details_model.country)"
                        ></v-autocomplete>
                      </template>
                      <span>{{ $t("country") }}</span>
                    </v-tooltip>
                  </v-flex>

                  <v-flex xs12 sm3 md3 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          v-on="on"
                          :rules="fieldRules"
                          v-bind:label="$t('state')"
                          outlined
                          dense
                          class="required_field pr-2"
                          index="id"
                          @change="fetch_cities(address_details_model.state)"
                          item-value="id"
                          item-text="name"
                          v-model="address_details_model.state"
                          :items="states"
                        ></v-autocomplete>
                      </template>
                      <span>{{ $t("state") }}</span>
                    </v-tooltip>
                  </v-flex>

                  <v-flex xs12 sm3 md3 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          v-on="on"
                          index="id"
                          v-model="address_details_model.county"
                          :rules="fieldRules"
                          item-value="name"
                          item-text="name"
                          v-bind:label="$t('city')"
                          outlined
                          dense
                          class="required_field pr-2"
                          :items="cities"
                        ></v-autocomplete>
                      </template>
                      <span>{{ $t("city") }}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 sm3 md3 pl-2>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-on="on"
                          v-model="address_details_model.postcode"
                          :rules="[...fieldRules, ...postcodeRules]"
                          v-bind:label="$t('postal_code')"
                          v-on:keypress="NumbersOnly"
                          class="required_field"
                          maxlength="6"
                          outlined
                          dense
                        ></v-text-field>
                      </template>
                      <span>{{ $t("postal_code") }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
          <v-container grid-list-md>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <div v-on="on" class="d-inline-block mr-2">
                    <v-btn
                      v-on="on"
                      small
                      @click="close"
                      color="btn hover_shine cancel_button"
                      >{{ $t("cancel") }}</v-btn
                    >
                  </div>
                </template>
                <span>{{ $t("cancel") }}</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    @click="save('normal')"
                    small
                    class="success hover_shine mr-3"
                    color="green darken-1"
                    :disabled="submit_credential_disable"
                  >
                    {{ $t("submit") }}
                    <b-spinner
                      :disabled="isBtnLoading"
                      small
                      v-if="isBtnLoading"
                    ></b-spinner>
                  </v-btn>
                </template>
                <span>{{ $t("submit") }}</span>
              </v-tooltip>
            </v-card-actions>
            <ConfirmDialog
              :show="showcreateDialog"
              :cancel="cancelcreate"
              :confirm="confirmcreate"
              v-bind:title="$t('confirm')"
              :description="description_text_create"
            />
          </v-container>
        </v-card>
      </v-dialog>
      <ConfirmDialog
        :show="showStatusDialog"
        :cancel="cancelStatus"
        :confirm="confirmStatus"
        v-bind:title="$t('confirm')"
        :description="description_text_status"
      />
      <ConfirmDialog
        :id="delete_id"
        :show="dialogDelete"
        :cancel="closeDelete"
        :confirm="deleteItemConfirm"
        :primary_delete="delete_primary"
        v-bind:title="$t('confirm')"
        :description="description_text_message"
      />
    </div>
  </div>
</template>
<script>
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import CreateLookup from "../../../Pages/CreateLookup.vue";
import VueElementLoading from "vue-element-loading";
export default {
  components: {
    PageTitle,
    ConfirmDialog,
    CreateLookup,
    VueElementLoading,
  },
  props: ["user_id", "view", "status"],
  data: () => ({
    valertdialogmessage: "",
    save_error: false,
    google_icon: {
      icon_name: "contacts",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    google_icon2: {
      icon_name: "contact_mail",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    showcreateDialog: false,
    description_text_create: "",
    plus_btn: true,

    elseselect: false,
    emailselect: false,
    numberselect: false,
    message: "",
    delete_id: "",
    description_text_status: "",
    not_edit: false,
    dialog: false,
    contactdialog: false,
    initval: false,
    initval1: false,
    isBtnLoading: false,
    valid: true,
    address_types: [],
    contact_types: [],
    contact_details: [],
    p_contact_details: [],
    s_contact_details: [],
    address_details: [],
    addmorecontacts: [],
    addmorecontacts1: [],
    permanent_data_exist: null,
    countries: [],
    states: [],
    cities: [],
    type: "",
    updatetype: "",
    status_id: null,
    showStatusDialog: false,
    contacttypeshortname: "",
    description_text_message: "",
    delete_primary: "",
    check_primary: false,
    contact_details_model: {
      id: 0,
      contact_id: "",
      type_id: "",
      primary: "",
      type: "",
    },

    address_details_model: {
      id: 0,
      emp_id: "",
      address_type: "",
      address: "",
      country: "",
      state: "",
      county: "",
      postcode: "",
      status: 1,
      type: "normal",
    },

    dialogDelete: false,

    submit_credential_disable: false,
    show_action_btn: false,
    hovered_index: null,
    s_hovered_index: null,
    pa_hovered_index: null,
    sa_hovered_index: null,
    s_address_details: [],
    p_address_details: [],
  }),
  mounted() {},
  created() {
    this.fetchlookup();
    this.get_countries();
  },
  watch: {
    user_id: {
      immediate: true,
      handler() {
        this.fetchDetails();
        this.get_countries();
      },
    },
  },

  computed: {
    fieldinputs() {},
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    numberRules() {
      return [(v) => !!v || this.$t("valid_number_required")];
    },

    phoneRules() {
      return [
        (v) =>
          v.length <= 10 ||
          (v >= 0 && v <= 999999999999) ||
          this.$t("valid_number_required"),
      ];
    },

    emailRules() {
      return [
        (v) => !!v || this.$t("email_required"),
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          this.$t("email_valid"),
      ];
    },

    postcodeRules() {
      return [(v) => (v >= 0 && v <= 999999) || this.$t("postcode_valid")];
    },
    headers() {
      if (this.view == "userview" && this.status) {
        return [
          {
            text: "Contact Type",
            align: "start",
            sortable: false,
            value: "employee_contact_type.shortname",
          },
          { text: "Contact", value: "contact_id", sortable: false },
          { text: "Primary", value: "primary", sortable: false },
          { text: "Actions", value: "actions", sortable: false },
        ];
      } else {
        return [
          {
            text: "Contact Type",
            align: "start",
            sortable: false,
            value: "employee_contact_type.shortname",
          },
          { text: "Contact", value: "contact_id", sortable: false },
          { text: "Primary", value: "primary", sortable: false },
        ];
      }
    },
    headers1() {
      if (this.view == "userview" && this.status) {
        return [
          {
            text: "Address Type",
            value: "address_type",
            sortable: false,
          },
          { text: "Address", value: "address", sortable: false },
          { text: "Country", value: "country", sortable: false },
          { text: "State", value: "state", sortable: false },
          { text: "City", value: "county", sortable: false },
          { text: "Postal Code", value: "postcode", sortable: false },
          { text: "Status", value: "status" },
          { text: "Actions", value: "actions", sortable: false },
        ];
      } else {
        return [
          { text: "Address Type", value: "address_type", sortable: false },
          { text: "Address", value: "address", sortable: false },
          { text: "Country", value: "country", sortable: false },
          { text: "State", value: "state", sortable: false },
          { text: "City", value: "county", sortable: false },
          { text: "Postal Code", value: "postcode", sortable: false },
        ];
      }
    },
  },
  methods: {
    hideActions() {
      this.hovered_index = null;
      this.s_hovered_index = null;
      this.show_action_btn = false;
    },
    showActions(index) {
      this.hovered_index = index;
      this.show_action_btn = true;
    },
    hideActionsS() {
      this.hovered_index = null;
      this.s_hovered_index = null;
      this.show_action_btn = false;
    },
    showActionsS(index) {
      this.s_hovered_index = index;
      this.show_action_btn = true;
    },
    hideActionsPA() {
      this.pa_hovered_index = null;
      this.sa_hovered_index = null;
      this.show_action_btn = false;
    },
    showActionsPA(index) {
      this.pa_hovered_index = index;
      this.show_action_btn = true;
    },
    hideActionsSA() {
      this.pa_hovered_index = null;
      this.sa_hovered_index = null;
      this.show_action_btn = false;
    },
    showActionsSA(index) {
      this.sa_hovered_index = index;
      this.show_action_btn = true;
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
    checkPermanentAddress(address_type) {
      if (this.permanent_data_exist == 1) {
        var permanent_address = this.address_details.find(
          (x) => x.id == this.address_details_model.id
        ).address_type;

        this.valertdialogmessage =
          "Please add another permanent address and update this address";
        this.save_error = true;
        setTimeout(() => {
          this.address_details_model.address_type = permanent_address;
        }, 100);
      } else {
        this.address_details_model.address_type = address_type;
      }
    },

    changeStatus(item) {
      if (this.status == 0 || this.view != "userview") {
        this.showStatusDialog = false;
      } else if (
        (item.status == 1 && item.address_type == "Permanent") ||
        (item.status == 1 && item.address_type == "Current")
      ) {
        this.showStatusDialog = false;
      } else {
        this.updatetype = "normal";
        this.status_id = item.id;
        this.description_text_status = this.$t("status_change");
        this.showStatusDialog = true;
      }
    },
    checkprimaryexist(index) {
      var primaryArray = [];
      for (var i = 0; i < this.addmorecontacts.length; i++) {
        if (this.addmorecontacts[i].primary == 1) {
          primaryArray.push(this.addmorecontacts[i]);
        }
      }
      if (primaryArray.length >= 2) {
        for (var j = 0; j < this.addmorecontacts.length; j++) {
          if (this.addmorecontacts[j].primary == 1 && j != index) {
            this.addmorecontacts[j].primary = "";
          }
        }
      }
    },
    removelanguage(index) {
      this.addmorecontacts.splice(index, 1);
    },
    addmorecontact() {
      this.contact_details_model.id = 0;
      this.contact_details_model.emp_id = this.user_id;
      this.addmorecontacts.push(this.contact_details_model);
      this.not_edit = false;
      this.contact_details_model = {
        id: 0,
        contact_id: "",
        type_id: "",
        emp_id: this.user_id,
        primary: "",
        type: "",
      };
    },
    get_countries() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_countries")
        .then((response) => {
          this.countries = response.data.countries;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetch_states(name) {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_states_name/" + name)
        .then((response) => {
          this.states = response.data.states;
          this.cities = [];
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetch_cities(name) {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_cities_name/" + name)
        .then((response) => {
          this.cities = response.data.cities;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchDetails() {
      this.initval = true;
      this.plus_btn = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetchcontactandaddressdetails/" +
            this.user_id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.contact_details = res.data.contactDetails;
            let p_contact_details = [];
            let s_contact_details = [];
            this.contact_details.map((ele) => {
              if (ele.primary) {
                p_contact_details.push(ele);
              } else {
                s_contact_details.push(ele);
              }
              this.p_contact_details = p_contact_details;
              this.s_contact_details = s_contact_details;
            });
            if (this.view == "userview") {
              this.address_details = res.data.addressDetails;
              let p_address_details = [];
              let s_address_details = [];
              this.address_details.map((ele) => {
                if (ele.status == 1) {
                  p_address_details.push(ele);
                } else {
                  s_address_details.push(ele);
                }
                this.p_address_details = p_address_details;
                this.s_address_details = s_address_details;
              });
            } else {
              for (var i = 0; i < res.data.addressDetails.length; i++) {
                if (res.data.addressDetails[i].status == 1) {
                  this.address_details.push(res.data.addressDetails[i]);
                }
              }
              let p_address_details = [];
              let s_address_details = [];
              this.address_details.map((ele) => {
                if (ele.status == 1) {
                  p_address_details.push(ele);
                } else {
                  s_address_details.push(ele);
                }
                this.p_address_details = p_address_details;
                this.s_address_details = s_address_details;
              });
            }
            this.initval = false;
            this.initval1 = false;
            this.not_edit = false;
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
    fetchlookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "ADDRESS_TYPE",
          },
        })
        .then((response) => {
          this.address_types = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "EMPLOYEE_CONTACT",
          },
        })
        .then((response) => {
          this.contact_types = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteItem(delete_item_id, type) {
      this.delete_id = delete_item_id.id;
      if (
        delete_item_id.primary == 1 ||
        (delete_item_id.status == 1 &&
          delete_item_id.address_type == "Permanent") ||
        (delete_item_id.status == 1 && delete_item_id.address_type == "Current")
      ) {
        this.description_text_message = this.$t(
          "primary_contact_delete_confirm"
        );
        this.delete_primary = "Primary";
      } else {
        this.description_text_message = this.$t("want_to_delete");
        this.delete_primary = "";
      }
      this.dialogDelete = true;
      this.type = type;
    },

    deleteItemConfirm() {
      this.initval = true;
      this.dialogDelete = false;
      axios
        .delete(
          process.env.VUE_APP_API_URL_ADMIN + "deletecontactaddressdetails",
          {
            params: {
              id: this.delete_id,
              type: this.type,
            },
          }
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.fetchDetails();
            this.message = res.data.message;
            this.$emit("getPermanentAddress", true);
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
    dialog_open_when_add_contact() {
      this.contactdialog = true;
      this.not_edit = false;
      this.contact_details_model.id = 0;
      this.addmorecontact();
      // this.contact_and_address_details.contact_details_model.id = 0;
      // this.contact_and_address_details.address_details_model.id = 0;
      // this.$refs.userform.reset();
    },
    dialog_open_when_add() {
      this.dialog = true;
      this.address_details_model.id = 0;
      this.address_details_model.type = "normal";
      // this.contact_and_address_details.contact_details_model.id = 0;
      // this.contact_and_address_details.address_details_model.id = 0;
      // this.$refs.userform.reset();
    },
    close() {
      this.save_error = false;
      this.dialog = false;
      this.not_edit = false;
      this.contactdialog = false;
      this.delete_id = "";
      this.initval = false;
      this.initval1 = false;
      this.submit_credential_disable = false;
      this.isBtnLoading = false;
      this.addmorecontacts = [];
      this.plus_btn = true;
      this.address_details_model.type = "normal";
      if (this.$refs.userform) {
        this.$refs.userform.reset();
      } else {
        this.$refs.usercontactform.reset();
      }
      this.elseselect = false;
      this.emailselect = false;
      this.numberselect = false;
    },
    closeDelete() {
      this.dialogDelete = false;
    },
    statusUpdate() {
      this.initval1 = true;
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "updateaddressstatus", {
          id: this.status_id,
          type: this.updatetype,
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.flashMessage.success({
              message: res.data.message,
              time: 4000,
              blockClass: "custom-block-class",
            });
            this.initval1 = false;
            this.$emit("getPermanentAddress", true);
            this.fetchDetails();
          }
          if (res.data.status == "EXISTC") {
            this.initval1 = false;
            this.description_text_status = this.$t(
              "want_to_change_this_as_current_and_old_as_inactive"
            );
            this.updatetype = "advanced";
            this.showStatusDialog = true;
          }
          if (res.data.status == "EXISTP") {
            this.initval1 = false;
            this.description_text_status = this.$t(
              "want_to_change_this_as_permanent_and_old_as_inactive"
            );
            this.updatetype = "advanced";
            this.showStatusDialog = true;
          }
        })
        .catch((err) => {
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log("this error" + err);
          this.initval1 = false;
        });
    },
    cancelStatus() {
      this.showStatusDialog = false;
    },
    confirmStatus() {
      this.statusUpdate();
      this.showStatusDialog = false;
    },
    cancelcreate() {
      this.showcreateDialog = false;
      this.isBtnLoading = false;
      this.submit_credential_disable = false;
      this.address_details_model.type = "normal";
    },
    confirmcreate() {
      this.showcreateDialog = false;
      this.save("advanced");
    },
    save(type) {
      this.description_text_create = "";
      if (this.$refs.userform.validate()) {
        this.address_details_model.type = type;
        this.submit_credential_disable = true;
        this.isBtnLoading = true;
        this.address_details_model.emp_id = this.user_id;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN +
              "createcontactandaddressdetails",
            this.address_details_model
          )
          .then((response) => {
            if (response.data.status == "S") {
              this.flashMessage.success({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.$emit("getPermanentAddress", true);
              this.close();
              this.fetchDetails();
            } else if (response.data.status == "EXISTCURRENT") {
              this.description_text_create = this.$t(
                "want_to_make_this_as_current_and_old_as_inactive"
              );
              this.showcreateDialog = true;
            } else if (response.data.status == "EXISTPERMANENT") {
              this.description_text_create = this.$t(
                "want_to_make_this_as_permanent_and_old_as_inactive"
              );
              this.showcreateDialog = true;
            } else if (response.data.status == "E") {
              this.submit_credential_disable = true;
              this.isBtnLoading = true;
              this.valertdialogmessage = response.data.message;
              this.save_error = true;
            } else {
              this.submit_credential_disable = true;
              this.isBtnLoading = true;
              this.valertdialogmessage = response.data.message;
              this.save_error = true;
            }
          })
          .catch((err) => {
            this.submit_credential_disable = true;
            this.isBtnLoading = true;
            this.valertdialogmessage = this.$t("something_went_wrong");
            this.save_error = true;
            console.log(err);
            this.close();
          });
      }
    },
    savecontact() {
      if (this.$refs.usercontactform.validate()) {
        this.submit_credential_disable = true;
        this.isBtnLoading = true;
        this.contact_details_model.emp_id = this.user_id;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "createcontact",
            this.addmorecontacts
          )
          .then((response) => {
            if (response.data.status == "S") {
              this.flashMessage.success({
                message: response.data.message,
                time: 4000,
                blockClass: "custom-block-class",
              });
              this.close();
              this.fetchDetails();
            }
            if (response.data.status == "E") {
              this.submit_credential_disable = false;
              this.isBtnLoading = false;
              this.valertdialogmessage = response.data.message;
              this.save_error = true;

              // this.close();
              // this.fetchDetails();
            }
          })
          .catch((err) => {
            this.submit_credential_disable = false;
            this.isBtnLoading = false;
            this.valertdialogmessage = response.data.message;
            this.save_error = true;
            console.log(err);
            this.close();
          });
      }
    },
    editContactAddressDialog(id) {
      this.address_details_model.type = "normal";
      this.initval1 = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetchcontactandaddressdetailsbyid/" +
            id
        )
        .then((res) => {
          if (res.data.status == "S") {
            // this.contact_and_address_details.contact_details_model =
            //   res.data.contactDetails;
            this.address_details_model = res.data.addressDetails;
            this.permanent_data_exist = res.data.permanenta_address_exist;
            this.fetch_states(this.address_details_model.country);
            this.fetch_cities(this.address_details_model.state);
            // this.contact_type_rules(
            //   this.contact_and_address_details.contact_details_model.type_id,
            //   this.contact_types
            // );
            this.dialog = true;
            this.initval1 = false;
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
          this.initval1 = false;
          console.log(" error" + err);
        });
    },

    editContactDialog(id) {
      this.initval = true;
      this.plus_btn = false;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetchcontactdetailsbyid/" + id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.addmorecontacts = res.data.contactDetails;
            if (res.data.contactDetails[0].primary == 1) {
              this.not_edit = true;
            }
            this.addmorecontacts.map((ele, i) => {
              if (ele.primary == 1) {
                this.check_primary = true;
              }
              this.contact_type_rules(ele.type_id, this.contact_types, i);
            });

            // this.addmorecontacts.map(ele,i=>{
            //   this.contact_type_rules(
            //   this.ele.type_id,
            //   this.contact_types,i
            // );
            // })

            this.contactdialog = true;
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

    contact_type_rules(model_id, array, index) {
      array.map((item) => {
        if (item.id == model_id) {
          this.contacttypeshortname = item.shortname;
          if (
            this.contacttypeshortname == "Email" ||
            this.contacttypeshortname == "Official Email ID"
          ) {
            this.addmorecontacts[index].type = "email";
            return;
            // this.addmorecontacts1=addmorecontacts;
            // this.addmorecontacts=[];
            // this.addmorecontacts.push(this.addmorecontacts);

            this.elseselect = false;
            this.numberselect = false;
          } else if (
            this.contacttypeshortname == "Phone" ||
            this.contacttypeshortname == "Mobile Number"
          ) {
            this.addmorecontacts[index].type = "mobile";
            console.log(this.addmorecontacts[2]);
            this.numberselect = true;
            this.emailselect = false;
            this.elseselect = false;
          } else {
            this.addmorecontacts[index].type = "skype";
            this.elseselect = true;
            this.numberselect = false;
            this.emailselect = false;
          }
        }
      });
    },
  },
};
</script>
<style scoped>
.layout_item {
  max-height: 80px !important;
}

.layout_margin {
  margin-top: 36px !important;
}

.maindivexpandannouncemet {
  margin-left: auto;
  animation-name: big_it_announcement;
  animation-duration: 0.5s;
  animation-fill-mode: backwards;
}

@keyframes big_it_announcement {
  from {
    width: 48%;
  }

  to {
    width: 100%;
  }
}

.addlanguagebutton {
  height: 30px !important;
  padding: 0px 4px !important;
}

.description_hover_div_address {
  width: 200px;
  height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: -3px;
}
/* .add_flex {
  text-wrap: nowrap;
} */

.contact-info {
  padding: 2px;
  box-shadow: 0px 0px 4px 0px;
  background: #007bff;
  color: white;
  border-radius: 5px;
  position: absolute;
  right: -44px;
  rotate: 45deg;
  top: 15px;
  width: 140px;
  text-align: center;
}
.contact-info-card {
  position: relative;
  overflow: clip;
  box-shadow: 0px 0px 3px 1px #007bff !important;
  margin-left: 5px;
}
.contact-info-card:hover {
  cursor: pointer;
}
</style>
