<template>
  <div class="container-fluid mt-3 p-0">
    <div class="mb-3 mx-auto card">
      <div class="card-header">
        <div class>
          <div
            class="card-header-title font-size-lg text-capitalize titlewrap"
          >{{ $t("create_level") }}</div>
        </div>
      </div>
      <div class="card-body mt-5">
        <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
        <v-form ref="form" v-model="valid">
          <v-layout>
            <v-flex xs12 md4 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="level_data.level"
                    :rules="fieldRules"
                    v-bind:label="$t('level_name')"
                    required
                    class="required_field"
                    outlined
                    dense
                  ></v-text-field>
                </template>
                <span>{{ $t("level_name") }}</span>
              </v-tooltip>
            </v-flex>
               <v-flex xs12 md8 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-textarea
                    v-on="on"
                    v-model="level_data.level_description"
                    v-bind:label="$t('description')"
                    outlined
                    counter="500"
                    rows="1"
                    maxlength="500"
                    dense
                  ></v-textarea>
                </template>
                <span>{{ $t("description") }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
          <v-layout>
         
          </v-layout>
          <v-layout v-for="(deisgnation_object, index) in level_data.designation_array" :key="index">
            <!-- {{deisgnation_object}} --> 
              <v-flex x6 md4 pl-2>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-on="on"
                      v-model="deisgnation_object.designation"
                      :rules="[...designationcheck1]"
                      @keyup="$refs.form.validate()"
                      v-bind:label="$t('designation_name')"
                      required
                      class="required_field"
                      maxlength="40"
                      counter="40"
                      outlined
                      dense
                    ></v-text-field>
                  </template>
                  <span>{{ $t("designation_name") }}</span>
                </v-tooltip>
              </v-flex>
            
              <v-flex
                xs12
                md2
                pl-50
                class="align-items-center"
               
              >
              <span  v-if="
                 index == level_data.designation_array.length-1 
                ">

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <button
                   
                      v-on="on"
                      @click="addDesignation(index)"
                      class="rounded-circle mr-2 py-0 mt-4  designation_add_icon"
                    >
                      <v-icon class=" ml-2 text-white bg-primary rounded-circle" medium>mdi-plus</v-icon>
                    </button>
                  </template>
                  <span>{{ $t("add") }}</span>
                </v-tooltip>
              </span>
           

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <button
                    v-if="level_data.designation_array.length > 1"
                      v-on="on"
                      @click="removeDesignation(index,deisgnation_object.designation)"
                      class=" small rounded-circle mr-2 mt-4  py-0"
                    >
                      <v-icon medium class="delete_btn icon_size" >mdi-trash-can-outline</v-icon>
                    </button>
                  </template>
                  <span>{{ $t("remove") }}</span>
                </v-tooltip>
              </v-flex>
          
          </v-layout>
        </v-form>
      </div>
      <div class="d-block text-right mb-3 mr-4">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div class="d-inline-block mr-2">
              <v-btn
                v-on="on"
                small
                class="ma-1 font-weight-bold cancel-btn"
                color="secondary"
                @click="cancelbtn()"
              >{{ $t("cancel") }}</v-btn>
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
                @click="submit"
                small
                class="mr-2 success hover_shine"
              >
                {{ $t("submit") }}
                <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
              </v-btn>
            </div>
          </template>
          <span>{{ $t("submit") }}</span>
        </v-tooltip>
      </div>
    </div>

    <ConfirmDialog
      :show="showConfirmDialog"
      :cancel="cancel"
      :confirm="confirm"
      :id="delete_id"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('remove_confirmation')"
    />
  </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
import ConfirmDialog from "../Components/ConfirmDialog.vue";
import ChildIndexVue from '../Lookups/ChildIndex.vue';
import { CollapsePlugin } from 'bootstrap-vue';
// import DatePicker from "../Components/DatePicker.vue";
export default {
  components: {
    VueElementLoading,
    ConfirmDialog
    // DatePicker,
  },
  data: () => ({
    showDesignationDialog: false,
    showConfirmDialog:false,
    valid: true,
    loader: false,
    file: "",
    user: "",
    delete_id: "",
    repeatedvmodel: "",
    isBtnLoading: false,
    isDisabled: false,
    designation_show: false,
    designationcheck:false,
    all_designations:[],
    designation_exists:[],
    level_data: {
      id: 0,
      level: "",
      level_description: "",
      designation_array: []

    },
    designation_data: {
      id: 0,
      designation: "",
      designation_description: "",
      level_id: ""
    },
    insertedDesig:[],
    items: []
  }),
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.fetchAllDesignation();
    if (!this.$route.query.slug) {
      this.level_data.designation_array.push(this.designation_data);
    }
    // this.dialog_open_when_add();
  },
  computed: {
    fieldRules() {
      return [v => !!v || this.$t("field_required"),
    ];
    },
    designationcheck1() {
      return [v => !!v || this.$t("field_required"),
      // v=>!this.all_designations.includes(v) || this.$t("designation_already_exist"),
      v=>{
      const isDuplicate = this.designation_exists
        .filter(item => item.designation === v);
      return !isDuplicate.length>0 || this.$t("designation_already_exist_in")+isDuplicate[0].level_details.level;
         },
      v => {
      const isDuplicate = this.level_data.designation_array
        .filter(item => item.designation === v)
        .length > 1;
      return !isDuplicate || this.$t("designation_already_exist");
    }
    ];
    },
    numberRules() {
      return [v => !!v || this.$t("number_required")];
    },
    
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
              process.env.VUE_APP_API_URL_ADMIN +
                "level/" +
                this.$route.query.slug +
                "/edit"
            )
            .then(res => {
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "S") {
                this.level_data = res.data.level_data;
                this.loader = false;
              } else if (res.data.status == "E") {
                this.flashMessage.error({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class"
                });
                this.loader = false;
              } else {
                console.log("error message", array_data);
              }
            })
            .catch(err => {
              this.loader = false;
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class"
              });
              console.log("error", err);
            });
        }
      }
    }
  },
  methods: {
    checkDuplicates(v){
      var count=0
      this.insertedDesig.map(ele=>{
      if(ele==v){
        count=count+1;
      if(count>1){
        return false;
      }
      }
      })
      if(count<=1){
        return true
      }
    },
    insertDesignation(index,desigantion){
this.insertedDesig[index]=desigantion;
    },
    cancelbtn(){
      this.$router.push({
name:"level"
      })
    },
    existcheck(desig) {
      if(desig == this.repeatedvmodel){
        return [ this.$t("designation_already_exist")];
      }
      
    },
  checkDesignation(designation){
  if( this.insertedDesig.includes(designation)){
    this.repeatedvmodel = designation;
    this.designationcheck=true;
   }
   else{
    this.designationcheck=false
    this.repeatedvmodel = '';
   }
    },
    fetchAllDesignation() {
      this.initval = true;
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchorgsitedesignation",{
          params:{
            org_id: this.user.hr_employee.org_id,
            site_id: this.user.hr_employee.site_id,
            slug:this.$route.query.slug
          }
        })
        .then((res) => {
          if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "S") {
                this.all_designations = res.data.all_designations;
                this.designation_exists=res.data.designation_exists
                // console.log(this.level.designation_array);

                this.loader = false;
              } else if (res.data.status == "E") {
                this.flashMessage.error({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class"
                });
                this.loader = false;
              } else {
                console.log("error message", array_data);
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
    
    removeDesignation(index,designation) {
      this.delete_id = index;
      if(designation!=""){
        this.showConfirmDialog = true;

      }else{
        this.level_data.designation_array.splice(index, 1);
      }
    },
    addDesignation() {
      // alert(index)
      if (this.$refs.form.validate()) {
        this.level_data.designation_array.push({
          id: 0,
          designation: "",
          designation_description: "",
          level_id: ""
        });
      }
    },
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm(id) {
      this.deleteConfirm(id);
      this.showConfirmDialog = false;
    },
    deleteConfirm(index) {
      this.level_data.designation_array.splice(index, 1);
    },
    // designation_show() {
    //   // this.designation_show=true;
    // },
    // fetchLookup() {
    //   axios
    //     .get(process.env.VUE_APP_API_URL_ADMIN + "fetchdesignationlookup", {
    //       params: {
    //         lookup_type: "DESIGNATION",
    //         slug:this.$route.query.slug
    //       }
    //     })
    //     .then(response => {
    //       this.designation_array = response.data.lookup_details;

    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },

    submit() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        // Form is valid, process
        if (this.level_data.id == 0) {
          axios
            .post(process.env.VUE_APP_API_URL_ADMIN + "level", {
              level_data: this.level_data,
              org_id: this.user.hr_employee.org_id,
              site_id: this.user.hr_employee.site_id
            })
            .then(res => {
              this.btnloading = false;
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
                  name: "level"
                });
              } else if (res.data.status == "E") {
                this.flashMessage.error({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class"
                });
                this.isBtnLoading = false;
                this.isDisabled = false;
              } else {
                this.isBtnLoading = false;
                this.isDisabled = false;
                this.isBtnLoading = false;
                this.flashMessage.error({
                  message: this.array_data
                });
              }
            })
            .catch(err => {
              this.isBtnLoading = false;
              this.isDisabled = false;
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class"
              });
              this.isBtnLoading = false;
              this.isDisabled = false;
              console.log("error", err);
            });
        } else {
          axios
            .patch(
              process.env.VUE_APP_API_URL_ADMIN + "level/" + this.level_data.id,{
                level_data: this.level_data,
                org_id: this.user.hr_employee.org_id,
              site_id: this.user.hr_employee.site_id
              }
            )
            .then(res => {
              this.btnloading = false;
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
                  name: "level"
                });
              } else if (res.data.status == "E") {
                this.isBtnLoading = false;
                this.isDisabled = false;
                this.flashMessage.error({
                  message: this.array_data,
                  time: 4000,
                  blockClass: "custom-block-class"
                });
              } else {
                this.isBtnLoading = false;
                this.isBtnLoading = false;
                this.isDisabled = false;
                this.flashMessage.error({
                  message: this.array_data
                });
              }
            })
            .catch(err => {
              this.isBtnLoading = false;
              this.isDisabled = false;
              this.flashMessage.error({
                message: this.$t("something_went_wrong"),
                time: 4000,
                blockClass: "custom-block-class"
              });
              this.isBtnLoading = false;
              console.log("error", err);
            });
        }
      } else {
        //alert("Form is Invalid");
      }
    },
    clear() {
      this.$refs.form.reset();
    }
  }
};
</script>
<style scoped>
.designation_item {
  max-height: 70px !important;
}
.labelcheckbox {
  margin-left: 25px;
}

</style>