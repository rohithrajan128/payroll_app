<template>
  <div class="container-fluid mt-3 p-0">
    <div class="mb-3 mx-auto">
      <div class="card-header">
        <div class="card-header-title font-size-lg text-capitalize titlewrap">
          {{ $t("create_asset") }}
        </div>
      </div>

      <div class="card-body">
        <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />

        <v-form ref="form" v-model="valid">
          <v-layout>
            <v-flex xs12 md3 pl-2>
              <DatePicker :label="$t('purchased_date')" :stored_date="assetdetails.purchased_date"
                @formatted_date="formatted_from_date" dense :class_required="'RequiredField'" :rules="fieldRules"
                v-model="assetdetails.purchased_date" />
            </v-flex>
            <v-flex xs12 md6 pl-2>
              <div class="d-flex">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-autocomplete v-bind:label="$t('purchased_from')" v-on="on" index="id" class="required_field"
                      item-value="id" item-text="shortname" v-model="assetdetails.purchased_from" :rules="fieldRules"
                      :items="vendorslist" outlined dense></v-autocomplete>
                  </template>
                  <span>{{ $t("purchased_from") }}</span>
                </v-tooltip>
                <div>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <button v-on="on" small rounded class="btn btn-primary rounded-circle primary mt-2 px-1 py-0"
                        @click="dialog_open_when_add" type="button">
                        <v-icon class="text-white" small>mdi-plus</v-icon>
                      </button>
                    </template>
                    <span>{{ $t("add_new_vendor") }}</span>
                  </v-tooltip>
                </div>
              </div>
            </v-flex>
            <v-flex xs12 md3 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field v-on="on" v-model="assetdetails.invoice_no" :rules="invoiceRules"
                    v-bind:label="$t('invoice_no')" required class="required_field" outlined dense></v-text-field>
                </template>
                <span>{{ $t("invoice_no") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>

          <v-layout>
            <v-flex xs12 md3 pl-2 class="createlookupflex">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete v-bind:label="$t('department')" v-on="on" index="id" class="required_field"
                    item-value="id" item-text="longname" v-model="assetdetails.department" :rules="fieldRules"
                    :items="departmentlist" outlined dense></v-autocomplete>
                </template>
                <span>{{ $t("department") }}</span>
              </v-tooltip>
              <CreateLookup :dropdownlabel="$t('department')" lookup_parent_name="DEPARTMENT"
                @lookup_data="lookupMessage"></CreateLookup>
            </v-flex>
            <!-- <v-flex xs12 md2 pl-2 >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-on="on"
                      v-model="assetdetails.invoice_no"
                      :rules="invoiceRules"
                      v-bind:label="$t('invoice_no')"
                      required
                      class="required_field"
                      outlined
                      dense
                    ></v-text-field>
                  </template>
                  <span>{{ $t("invoice_no") }}</span>
                </v-tooltip>
              </v-flex> -->

            <!-- <v-flex xs12 md3 pl-2>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-autocomplete
                      v-bind:label="$t('site')"
                      v-on="on"
                      index="id"
                      class="required_field"
                      item-value="id"
                      item-text="shortname"
                      v-model="assetdetails.site"
                      :rules="fieldRules"
                      :items="sitelist"
                      outlined
                      dense
                    ></v-autocomplete>
                  </template>
                  <span>{{ $t("site") }}</span>
                </v-tooltip>
              </v-flex> -->
            <!-- <v-flex xs12 md3 pl-2>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-autocomplete
                      outlined
                      v-on="on"
                      v-bind:label="$t('location')"
                      :items="sitelist"
                      index="id"
                      item-value="id"
                      item-text="address3"
                      v-model="assetdetails.location_id"
                      required
                      dense
                      multiple
                      chips
                      small-chips
                      prepend-inner-icon="mdi-map-marker-multiple"
                    ></v-autocomplete>
                  </template>
                  <span>{{ $t("location") }}</span>
                </v-tooltip>
              </v-flex> -->

            <v-flex xs12 md6 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-textarea v-on="on" rows="1" maxlength="200" counter v-model="assetdetails.description"
                    v-bind:label="$t('description')" outlined dense></v-textarea>
                </template>
                <span>{{ $t("description") }}</span>
              </v-tooltip>
            </v-flex>

            <v-flex xs12 sm6 md3 pl-2>
              <div class="browsedivdoc">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field readonly outlined dense v-on="on" @click="callDocumentSelect"
                      v-model="assetdetails.invoice_attached" v-bind:label="$t('upload_doc')"></v-text-field>
                    <v-chip label class="browsebtndoc" @click="callDocumentSelect" color="primary" v-on="on">{{
                      $t("browse") }}</v-chip>
                  </template>
                  <span>{{ $t("upload_doc") }}</span>
                </v-tooltip>
              </div>
              <div v-if="assetdetails.invoice_attached" class="documentdownloadapplyleave">
                <a :href="document_url + assetdetails.invoice_attached" download class="text-primary f-13 a-underline">
                  {{ $t("download") }}
                </a>
              </div>
            </v-flex>
            <v-flex xs12 sm6 md3 style="display: none">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span v-on="on">
                    <DocumentSelect :label="'Proof '" :folder="'ProofDocument'" :uploadtype="enable_document_select"
                      @uploadedDocument="uploadedDocument" :documentlink="assetdetails.invoice_attached"></DocumentSelect>
                  </span>
                </template>
                <span>{{ $t("file_input") }}</span>
              </v-tooltip>
            </v-flex>
            <!-- @closeDialog="closeDocumentSelectDialog" -->
          </v-layout>
          <v-layout>
            <v-flex xs6 md3 pl-2 class="createlookupflex">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete dense v-on="on" v-model="assetdetails.assettype" :rules="fieldRules"
                    v-bind:label="$t('asset_type')" required :items="categoriesAssetTypes" item-text="shortname"
                    item-value="shortname" class="required_field" @change="
                      checkassettype(
                        assetdetails.assettype,
                        categoriesAssetTypes
                      )
                      " outlined></v-autocomplete>
                </template>
                <span>{{ $t("asset_type") }}</span>
              </v-tooltip>
              <CreateLookup :dropdownlabel="$t('asset_type')" lookup_parent_name="ASSET_TYPE"
                @lookup_data="lookupMessage"></CreateLookup>
            </v-flex>
            <v-flex xs6 md3 pl-2 v-if="selected_assettype == 'Asset'" class="createlookupflex">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete dense v-on="on" v-model="assetdetails.asset_categorytype" :rules="fieldRules"
                    v-bind:label="$t('asset_type_category')" required :items="assetcategorylist" item-text="shortname"
                    item-value="shortname" class="required_field" outlined @change="
                      checkassettypecategory(assetdetails.asset_categorytype)
                      "></v-autocomplete>
                </template>
                <span>{{ $t("asset_type_category") }}</span>
              </v-tooltip>
              <CreateLookup :dropdownlabel="$t('asset_type_category')" lookup_parent_name="ASSET_TYPE_CATEGORY"
                @lookup_data="lookupMessage"></CreateLookup>
            </v-flex>
          </v-layout>
          <div class="xs12 md4">
            <v-sheet>
              <div class="pl-5">
                <v-row>
                  <div class="card-header-title font-size-lg text-capitalize titlewrap" v-if="selected_assettype == 'Asset' &&
                    assetdetails.asset_categorytype
                    ">
                    {{ $t("create_assets") }}
                  </div>
                  <div class="card-header-title font-size-lg text-capitalize titlewrap"
                    v-else-if="selected_assettype == 'Consumable'">
                    {{ $t("create_consumables") }}
                  </div>
                  <v-spacer></v-spacer>
                </v-row>
              </div>
              <div v-if="assetdetails.assetslist && assetdetails.assetslist.length >= 1
                " class="mt-30">
                <v-form ref="assetvaluesref" v-model="valid">
                  <div v-for="(asset_info, asset_index) in assetdetails.assetslist" :key="asset_index">
                    <v-layout>
                      <v-flex xs12 md4 pl-2 v-if="selected_assettype == 'Asset'">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-autocomplete v-on="on" v-model="asset_info.parent_category" dense outlined
                              :rules="fieldRules" class="required_field" :label="$t('parentcategory')"
                              :items="parentassetcategorylist" item-text="short_name" item-value="id" @change="
                                fetch_child(
                                  asset_info.parent_category,
                                  asset_index
                                )
                                "></v-autocomplete>
                          </template>
                          <span>{{ $t("parentcategory") }}</span>
                        </v-tooltip>
                      </v-flex>
                      <v-flex xs12 md4 pl-2 v-else-if="selected_assettype == 'Consumable'">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-autocomplete v-on="on" v-model="asset_info.parent_category" dense outlined
                              :rules="fieldRules" :label="$t('parentcategory')" :items="parentconsumablescategorylist"
                              item-text="short_name" class="required_field" item-value="id" @change="
                                fetch_child(
                                  asset_info.parent_category,
                                  asset_index
                                )
                                "></v-autocomplete>
                          </template>
                          <span>{{ $t("parentcategory") }}</span>
                        </v-tooltip>
                      </v-flex>
                      <v-flex xs12 md4 pl-2>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-autocomplete v-on="on" v-model="asset_info.child_category" dense outlined
                              :rules="fieldRules" :label="$t('childcategory')" class="required_field"
                              :items="childconsumablescategorylist[asset_index]" item-text="short_name" item-value="id"
                              @change="
                                fetchAssetCatDetails(
                                  asset_info.child_category,
                                  asset_index,
                                  assetdetails.assettype,
                                  asset_info.parent_category
                                )
                                "></v-autocomplete>
                          </template>
                          <span>{{ $t("childcategory") }}</span>
                        </v-tooltip>
                      </v-flex>
                      <v-flex xs12 md3 pl-2 v-if="selected_assettype == 'Asset'">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-text-field readonly dense outlined :label="$t('asset_tagid')"
                              :prefix="prefix_cat_id.toLowerCase()" class="required_field"
                              v-model="asset_info.asset_tagid" :rules="fieldRules" v-on="on"></v-text-field>
                          </template>
                          <span>{{ $t("asset_tagid") }}</span>
                        </v-tooltip>
                      </v-flex>
                    </v-layout>
                    <v-layout>
                      <v-flex xs12 md4 pl-2>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <!-- <v-autocomplete
                              dense
                              outlined
                              :label="$t('metric')"
                              :items="metriclist"
                              v-model="asset_info.metric"
                              item-text="long_name"
                              :rules="fieldRules"
                              item-value="long_name"
                              v-on="on"
                              @change="
                                fetch_metricvalues(
                                  asset_info.metric,
                                  asset_index
                                )
                              "
                            ></v-autocomplete> -->

                            <v-text-field readonly dense outlined :label="$t('metric')" v-model="asset_info.metric"
                              class="required_field" :rules="fieldRules" v-on="on"></v-text-field>
                          </template>
                          <span>{{ $t("metric") }}</span>
                        </v-tooltip>
                      </v-flex>
                      <v-flex xs12 md4 pl-2>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-text-field readonly dense outlined :label="$t('metric_value')"
                              v-model="asset_info.metric_value" :rules="fieldRules" v-on="on"></v-text-field>
                            <!-- <v-autocomplete
                              dense
                              outlined
                              v-model="asset_info.metric_value"
                              :label="$t('metric_value')"
                              :items="metricvaluelist[asset_index]"
                              item-value="metric_value"
                              item-text="metric_value"
                              v-on="on"
                            ></v-autocomplete> -->
                          </template>
                          <span>{{ $t("metric_value") }}</span>
                        </v-tooltip>
                      </v-flex>
                      <v-flex xs12 md3 pl-2>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-text-field :rules="fieldRules" maxlength="6" dense outlined :label="$t('quantity')"
                              v-on:keypress="NumbersOnly" class="required_field" v-on="on"
                              v-model="asset_info.quantity"></v-text-field>
                          </template>
                          <span>{{ $t("quantity") }}</span>
                        </v-tooltip>
                      </v-flex>
                    </v-layout>
                    <v-layout>
                      <v-flex xs12 md4 pl-2>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-text-field :rules="fieldRules" dense outlined v-on="on" :label="$t('unit_cost')"
                              v-on:keypress="NumbersOnly" class="required_field" hint="In Rupees"
                              v-model="asset_info.unit_cost"></v-text-field>
                          </template>
                          <span>{{ $t("unit_cost") }}</span>
                        </v-tooltip>
                      </v-flex>
                      <v-flex xs12 md4 pl-2>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-text-field :rules="fieldRules" dense maxlength="6" outlined :label="$t('tax_rate')"
                              v-on:keypress="NumbersOnly" class="required_field" v-on="on"
                              v-model="asset_info.tax_rate"></v-text-field>
                          </template>
                          <span>{{ $t("tax_rate") }}</span>
                        </v-tooltip>
                      </v-flex>
                      <v-flex xs12 md3 pl-2>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-text-field :rules="fieldRules" dense outlined :label="$t('total_cost')" hint="In Rupees"
                              v-on="on" v-on:keypress="NumbersOnly" class="required_field"
                              v-model="asset_info.total_cost"></v-text-field>
                          </template>
                          <span>{{ $t("total_cost") }}</span>
                        </v-tooltip>
                      </v-flex>
                    </v-layout>
                    <v-layout>
                      <v-flex xs12 md4 pl-2>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-text-field :rules="fieldRules" dense outlined :label="$t('serial_number')" v-on="on"
                              v-model="asset_info.serial_no" class="required_field"></v-text-field>
                          </template>
                          <span>{{ $t("serial_number") }}</span>
                        </v-tooltip>
                      </v-flex>
                      <v-flex xs12 md4 pl-2>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-text-field :rules="fieldRules" dense outlined :label="$t('brand')" class="required_field"
                              v-on="on" v-model="asset_info.brand"></v-text-field>
                          </template>
                          <span>{{ $t("brand") }}</span>
                        </v-tooltip>
                      </v-flex>
                      <v-flex xs12 md3 pl-2>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-text-field :rules="fieldRules" dense outlined :label="$t('model')" v-on="on"
                              v-model="asset_info.model" class="required_field"></v-text-field>
                          </template>
                          <span>{{ $t("model") }}</span>
                        </v-tooltip>
                      </v-flex>
                      <v-flex xs12 md1 pl-2>
                        <v-tooltip bottom v-if="asset_index == assetdetails.assetslist.length - 1
                          ">
                          <template v-slot:activator="{ on }">
                            <button v-on="on" x-small rounded
                              class="btn btn-primary rounded-circle primary mt-2 px-1 py-0" @click="addassetvalues"
                              type="button">
                              <v-icon class="text-white" small>mdi-plus</v-icon>
                            </button>
                          </template>
                          <span>{{ $t("add") }}</span>
                        </v-tooltip>
                        <!-- {{assetdetails.assetslist.length}} -->

                        <v-tooltip bottom v-if="assetdetails.assetslist.length > 1">
                          <template v-slot:activator="{ on }">
                            <button v-on="on" @click="
                              removeAssets(
                                asset_index,

                                asset_info.id
                              )
                              " class="mt-5" type="button">
                              <v-icon medium class="delete_btn icon_size">mdi-trash-can-outline</v-icon>
                            </button>
                          </template>
                          <span>{{ $t("delete") }}</span>
                        </v-tooltip>
                      </v-flex>
                    </v-layout>
                    <v-flex xs12 md12>
                      <v-divider :thickness="15"></v-divider>
                    </v-flex>
                  </div>
                </v-form>
              </div>
            </v-sheet>
          </div>
        </v-form>
      </div>
    </div>

    <v-dialog persistent v-model="dialog" max-width="1100px">
      <v-card>
        <v-toolbar color="primary" dark>
          <span class="headline">{{ $t("create_vendordetails") }}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon @click="close" class="dialogcloseinuserdetails" v-on="on">mdi-close</v-icon>
            </template>
            <span>{{ $t("close") }}</span>
          </v-tooltip>
        </v-toolbar>

        <v-form ref="vendorform" v-model="valid">
          <v-card-text class="mt-8">
            <v-alert v-model="save_error" :text="valertdialogmessage" color="error" icon="warning" outlined dismissible>
              {{ valertdialogmessage }}</v-alert>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 md4 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field v-on="on" v-model="vendordetails.shortname" :rules="fieldRules"
                        v-bind:label="$t('short_name')" required class="required_field" outlined dense></v-text-field>
                    </template>
                    <span>{{ $t("short_name") }}</span>
                  </v-tooltip>
                </v-flex>
                <v-flex xs12 md8 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field v-on="on" v-model="vendordetails.registered_name" :rules="fieldRules"
                        v-bind:label="$t('registered_name')" required class="required_field" outlined
                        dense></v-text-field>
                    </template>
                    <span>{{ $t("registered_name") }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex xs12 md3 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field v-on="on" v-model="vendordetails.contact_name" v-bind:label="$t('contact_name')"
                        outlined dense></v-text-field>
                    </template>
                    <span>{{ $t("contact_name") }}</span>
                  </v-tooltip>
                </v-flex>
                <v-flex xs12 md3 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field v-model="vendordetails.mobile" v-bind:label="$t('contact_no')" maxlength="10"
                        v-on="on" :rules="[...phoneRules]" onkeyup="if(this.value.length > 10)  return false;"
                        @keypress.native="isNumber($event)" outlined dense></v-text-field>
                    </template>
                    <span>{{ $t("contact_no") }}</span>
                  </v-tooltip>
                </v-flex>

                <v-flex xs12 md5 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field v-on="on" v-model="vendordetails.email_id" :rules="emailRules"
                        v-bind:label="$t('email')" outlined dense></v-text-field>
                    </template>
                    <span>{{ $t("email") }}</span>
                  </v-tooltip>
                </v-flex>
                <v-flex xs12 md5 pl-2>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field v-on="on" maxlength="15" v-model="vendordetails.gst_no" v-bind:label="$t('gstno')"
                        outlined dense></v-text-field>
                    </template>
                    <span>{{ $t("gstno") }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>

              <v-layout wrap>
                <v-flex xs12 md12>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-text-field v-on="on" maxlength="100" counter v-model="vendordetails.address"
                        v-bind:label="$t('address')" outlined dense></v-text-field>
                    </template>
                    <span>{{ $t("address") }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" @click="saveVendordetails()" small class="mr-2 success hover_shine mb-3"
                  color="green darken-1" :disabled="submit_credential_disable">
                  {{ $t("submit") }}
                  <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
                </v-btn>
              </template>
              <span> {{ $t("submit") }} </span>
            </v-tooltip>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <div class="d-block text-right mr-4">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <div v-on="on" class="d-inline-block mr-2">
            <v-btn v-on="on" small @click="$router.go(-1)" class="ma-1 font-weight-bold cancel-btn"
              color="dark cancel_button">{{ $t("cancel") }}</v-btn>
          </div>
        </template>
        <span>{{ $t("cancel") }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <div v-on="on" class="d-inline-block">
            <v-btn :disabled="isDisabled" color="green darken-1" @click="saveAssetdetails" small
              class="mr-2 success hover_shine">
              {{ $t("save") }}
              <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
            </v-btn>
          </div>
        </template>
        <span>{{ $t("save") }}</span>
      </v-tooltip>
    </div>
    <ConfirmDialog :show="showConfirmDialog" :cancel="cancel" :confirm="confirm" :id="delete_id"
      v-bind:title="$t('confirm')" v-bind:description="$t('delete_confirmation')" />
  </div>
</template>

<script>
import CreateLookup from "../../../Pages/CreateLookup.vue";
import VueElementLoading from "vue-element-loading";
import DatePicker from "../Components/DatePicker.vue";
import PageTitle from "../../../../Layout/Components/PageTitle.vue";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import DocumentSelect from "../Components/Upload/DocumentSelect.vue";

export default {
  components: {
    VueElementLoading,
    DatePicker,
    PageTitle,
    ConfirmDialog,
    DocumentSelect,
    CreateLookup
  },
  data: () => ({
    document_url: process.env.VUE_APP_IMAGE_PATH,
    valertdialogmessage: "",
    save_error: false,
    enable_document_select: "",
    categoriesAssetTypes: [],
    assetcategorylist: [],
    valid: true,
    loader: false,
    show: false,
    isDisabled: false,
    isBtnLoading: false,
    submit_credential_disable: false,
    dialog: false,
    initval: false,
    selected_asset_cat_name: "",
    selected_assettype: "",
    assetdetails: {
      id: 0,
      purchased_date: "",
      purchased_from: "",
      invoice_no: "",
      site: "",
      department: "",
      description: "",
      invoice_attached: "",
      status: 1,
      location_id: [],
      assettype: "",
      assetslist: [],
      consumableslist: [],
      asset_categorytype: "",
    },
    vendordetails: {
      shortname: "",
      registered_name: "",
      contact_name: "",
      mobile: "",
      email_id: "",
      address: "",
      icon_image: "",
      active_status: 1,
      gst_no: "",
    },
    departmentlist: [],
    sitelist: [],
    vendorslist: [],
    parentconsumablescategorylist: [],
    childconsumablescategorylist: [],
    parentassetcategorylist: [],
    childassetcategorylist: [],
    childcategorylist: [],
    metriclist: [],
    metricvaluelist: [],
    items: [],
    asset_cat_details: [],
    prefix_cat_id: "",
    assets: {
      id: 0,
      parent_category: "",
      child_category: "",
      asset_tagid: "",
      metric: "",
      metric_value: "",
      quantity: "",
      unit_cost: "",
      tax_rate: "",
      total_cost: "",
      brand: "",
      model: "",
      serial_no: "",
    },
    showConfirmDialog: false,
    delete_id: null,

    // listofassets: [],
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
    numberRules() {
      return [(v) => !!v || this.$t("valid_number_required")];
    },
    invoiceRules() {
      return [
        // (v) =>
        //   !v ||
        //   /\b[a-zA-Z]{3}\d{6}\b/.test(v) ||
        //   this.$t("valid_number_required"),
        (v) => !!v || this.$t("field_required"),
      ];
    },
    multiplerules() {
      return [(v) => (v.length > 0 && !!v) || this.$t("field_required")];
    },

    phoneRules() {
      return [
        (v) =>
          v.length <= 10 ||
          (v >= 0 && v <= 999999999999) ||
          this.$t("valid_number_required"),
      ];
    },
  },

  mounted() {
    this.fetchlookup();
    // this.fetchsite();
    this.fetchvendorslist();
    this.fetchParentnames();
    this.fetchMetrics();
  },

  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.fetchAssetDetails();
        }
      },
    },
  },

  methods: {
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
    fetchAssetDetails() {
      this.loader = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
          "fetchdetailedAssetbyslug?slug=" +
          this.$route.query.slug
        )
        .then((res) => {
          this.btnloading = false;

          if (res.data.status == "S") {
            this.message = res.data.message;

            setTimeout(() => {
              this.assetdetails = res.data.assetdetails;
              res.data.assetdetails.assetslist.map((asset_child, index) => {
                this.fetch_child(asset_child.parent_category, index);
                this.fetchAssetCatDetails(
                  asset_child.child_category,
                  index,
                  res.data.assetdetails.assettype,
                  asset_child.parent_category
                );
              });
              this.selected_assettype = res.data.assetdetails.assettype;
              if (res.data.assetdetails.asset_categorytype) {
                this.checkassettypecategory(
                  res.data.assetdetails.asset_categorytype
                );
              }
              this.loader = false;
            }, 2400);
          }
        })
        .catch((err) => {
          this.isDisabled = false;
          console.log("this error" + err);
        });
    },
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm(id) {
      this.deleteConfirm(id);
      this.showConfirmDialog = false;
    },

    fetchAssetCatDetails(id, index, asset_type, asset_parent_cat) {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_assset_cat_details", {
          params: {
            id: id,
          },
        })
        .then((res) => {
          if ((res.data.status = "S")) {
            this.assetdetails.assetslist[index].metric =
              res.data.asset_cat_details.metric_fetch.short_name;
            this.assetdetails.assetslist[index].metric_value =
              res.data.asset_cat_details.metric_value_fetch.metric_value;
            this.assetdetails.assetslist[index].asset_tagid =
              res.data.asset_cat_details.asset_tag_id;
            if (asset_type == "Asset") {
              this.prefix_cat_id =
                this.parentassetcategorylist.find(
                  (x) => x.id == asset_parent_cat
                ).short_name + "/";
            } else {
              this.prefix_cat_id =
                this.parentconsumablescategorylist.find(
                  (elem) => elem.id == asset_parent_cat
                ).short_name + "/";
            }
            // alert(this.prefix_cat_id);
          } else {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    removeAssets(index, id) {
      if (id > 0) {
        this.delete_id = id;
        this.showConfirmDialog = true;
      } else {
        this.assetdetails.assetslist.splice(index, 1);
        if (id == 0) {
          this.checkassettypecategory(res.data.assetdetails.asset_categorytype);
        }
      }
    },
    deleteConfirm(id) {
      axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "delete_assets_details/" + id)
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
            this.fetchAssetDetails();
          } else if (res.data.status == "E") {
            this.flashMessage.error({
              message: this.array_data,
              time: 4000,
              blockClass: "custom-block-class",
            });
          } else {
            this.flashMessage.error({
              message: this.array_data,
            });
            this.fetchAssetDetails();
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
    saveAssetdetails() {
      if (this.$refs.form.validate() && this.$refs.assetvaluesref.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        axios
          .post(process.env.VUE_APP_API_URL_ADMIN + "createAssetdetails", {
            assetdetails: this.assetdetails,
          })
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
              // this.showassettype = true;
              // this.fetchlookup();
              // this.isBtnLoading = false;
              this.$router.push({
                name: "assetdetails",
              });
            } else if (res.data.status == "E") {
              this.isBtnLoading = false;
              (this.isDisabled = false),
                this.flashMessage.error({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class",
                });
              // this.clear();
            } else {
              this.isBtnLoading = false;
              this.flashMessage.error({
                message: this.array_data,
              });
              // this.clear();
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
      // this.$refs.assetvaluesref.reset();
    },
    clearvendor() {
      this.$refs.vendorform.reset();
    },

    fetchsite() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getsite")
        .then((res) => {
          this.sitelist = res.data.data;
        })
        .catch((err) => {
          console.log(err);
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

    formatted_from_date(formatted_date) {
      this.assetdetails.purchased_date = formatted_date;
    },

    fetchvendorslist() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getvendordetails")
        .then((res) => {
          this.vendorslist = res.data.activevendors;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetchlookup() {
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "DEPARTMENT",
          },
        })
        .then((response) => {
          this.departmentlist = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "ASSET_TYPE",
          },
        })
        .then((response) => {
          this.categoriesAssetTypes = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "ASSET_TYPE_CATEGORY",
          },
        })
        .then((response) => {
          this.assetcategorylist = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    dialog_open_when_add() {
      this.dialog = true;
      this.gst_no = "";
      this.icon_image = "";
      this.address = "";
      this.email_id = "";
      this.mobile = "";
      this.contact_name = "";
      this.registered_name = "";
      this.shortname = "";
    },

    close() {
      this.dialog = false;
      this.save_error = false;
      // this.vendordetails = {};
      this.assetdetails.purchased_from = this.vendordetails.shortname;
      this.submit_credential_disable = false;
      this.isBtnLoading = false;
    },

    isNumber(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      }
      return true;
    },

    uploadedDocument(filepath) {
      this.assetdetails.invoice_attached = filepath.substring(23);
      this.closeDialog();
    },

    closeDialog(uploadtype) {
      this.enable_document_select = "";
      console.log("close dialog", uploadtype);
    },

    callDocumentSelect() {
      this.enable_document_select = "DragDrop";
    },

    checkassettype(asset_shortname, asset_type) {
      // this.$refs.assetvaluesref.reset();

      asset_type.map((assettype) => {
        if (assettype.shortname == asset_shortname) {
          this.asset_type = assettype.shortname;
          this.selected_assettype = assettype.shortname;
          this.assetdetails.assettype = assettype.shortname;
        }
      });
      if (
        this.selected_assettype == "Consumable" &&
        this.assetdetails.assetslist.length == 0
      ) {
        this.addassetvalues();
      }
      this.$refs.assetvaluesref.reset();
    },

    checkassettypecategory(asset_type_category) {
      this.selected_asset_cat_name = asset_type_category;
      if (this.assetdetails.assetslist.length == 0) {
        this.addassetvalues();
      }
    },

    addassetvalues() {
      // alert("sadasd");
      //  this.$refs.assetvaluesref.reset();
      this.assetdetails.assetslist.push(this.assets);
      this.assets = {};

      // this.assetdetails.asset_categorytype = this.selected_asset_cat_name;

      this.assets.asset_type = this.asset_type;
    },

    saveVendordetails() {
      if (this.$refs.vendorform.validate()) {
        this.assetdetails.purchased_from = this.vendordetails.shortname;
        this.isDisabled = true;
        this.isBtnLoading = true;
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "createVendordetails",
            this.vendordetails
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
              this.isDisabled = false;
              this.close();
              this.fetchvendorslist();
              this.assetdetails.purchased_from = this.vendordetails.shortname;
            } else if (res.data.status == "E") {
              this.isBtnLoading = false;
              (this.isDisabled = false),
                (this.valertdialogmessage = res.data.message);
              this.save_error = true;
              this.clearvendor();
            } else {
              this.isBtnLoading = false;
              (this.isDisabled = false),
                (this.valertdialogmessage = response.data.message);
              this.save_error = true;
              this.clearvendor();
            }
          })
          .catch((err) => {
            this.valertdialogmessage = response.data.message;
            this.save_error = true;
            this.isBtnLoading = false;
            this.isDisabled = false;
            console.log("this error" + err);
          });
      }
    },

    fetchParentnames() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getallassetcategories")
        .then((res) => {
          for (let i = 0; i < res.data.data.length; i++) {
            if (
              res.data.data[i].asset_status_fetch.shortname == "Asset" &&
              res.data.data[i].active == 1
            ) {
              if (res.data.data[i].parent_id == 0) {
                this.parentassetcategorylist.push(res.data.data[i]);
              }
            } else {
              if (res.data.data[i].parent_id == 0) {
                this.parentconsumablescategorylist.push(res.data.data[i]);
              }
            }
          }
        })
        .catch((err) => {
          this.initval = false;
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
        });
    },

    fetch_child(assetinfo, index) {
      if (this.selected_assettype == "Asset") {
        this.assetdetails.assetslist[index].asset_tagid = "";
      }
      // this.childconsumablescategorylist[index] = [];
      this.initval = true;
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
          "fetch_childcategories/" +
          assetinfo
        )
        .then((response) => {
          // this.childconsumablescategorylist = [];
          // for (let i = 0; i < response.data.childasset.length; i++) {
          // }
          this.childconsumablescategorylist[index] = response.data.childasset;
          this.initval = false;
        })
        .catch((err) => {
          this.initval = false;
          console.log(err);
        });
    },

    fetchMetrics() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getallmetric")
        .then((res) => {
          for (let i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].active) {
              this.metriclist.push(res.data.data[i]);
            }
            this.initval = false;
          }
        })
        .catch((err) => {
          this.initval = false;
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
        });
    },

    fetch_asset_tagid(id, array, index) {
      // if (!this.childconsumablescategorylist) {
      //   this.assetdetails.assetslist[index].asset_tagid = "";
      // }
      // array.map((array) => {
      //   if (array.id == id) {
      //     this.assetdetails.assetslist[index].asset_tagid = array.asset_tag_id;
      //   }
      // });
    },

    fetch_metricvalues(slug, index) {
      // this.metricvaluelist = [];
      axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
          "get_metric_values_longname/" +
          slug
        )
        .then((res) => {
          // for (let i = 0; i < res.data.data.length; i++) {
          // }
          this.metricvaluelist[index] = res.data.data;
          this.initval = false;
        })
        .catch((err) => {
          this.initval = false;
          this.flashMessage.error({
            message: this.$t("something_went_wrong"),
            time: 4000,
            blockClass: "custom-block-class",
          });
          console.log(" error" + err);
        });
    },

    // calculatetotalcost(quantity, unitcost, tax, index) {
    //   this.listofconsumables[index].total_cost = quantity * unitcost * tax;
    // },
  },
};
</script>
<style scoped>
/* .plus_icon_height {
  width: 40px;
  height: 30px;
  padding-left: 7px;
} */

.browsedivdoc {
  display: inline-flex;
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
}

.mt-30 {
  margin-top: 30px;
}
</style>
