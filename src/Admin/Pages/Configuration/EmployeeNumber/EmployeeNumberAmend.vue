<template>
  <div class="container-fluid mt-3 p-0">
    <div class="main-card mb-3 ">
      <div>
        <div class="card-header-tab card-header">
          <div class="card-header-title font-size-lg text-capitalize titlewrap ">
            {{ $t("create_employee_number") }}
          </div>
        </div>
      </div>
      <div class="card-body">
        <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />
        <v-form ref="form" v-model="valid">
          <v-layout class="mt-2">
            <v-flex xs12 md4 pl-2 class="createlookupflex">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-autocomplete v-on="on" v-model="employee_number.employee_type" index="id" item-value="shortname"
                    item-text="longname" :rules="fieldRules" :items="employee_type_array"
                    v-bind:label="$t('employee_type')" required dense class="required_field" outlined></v-autocomplete>
                </template>
                <span>{{ $t("employee_type") }}</span>
              </v-tooltip>
              <CreateLookup lookup_parent_name="EMPLOYEE_TYPE" @lookup_data="lookupMessage" :dropdownlabel="$t('employee_type')"></CreateLookup>
            </v-flex>
            <v-flex xs12 md3 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field v-on="on" dense v-model="employee_number.employee_auto_gen_name" :rules="fieldRules"
                    v-bind:label="$t('auto_gen_name')" @blur="enableExample()" @keyup="uppercaseName()" required class="required_field"
                    outlined></v-text-field>
                </template>
                <span>{{ $t("auto_gen_name") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 md3 pl-2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field v-on="on" v-model="employee_number.employee_no_limit" 
                  :rules="fieldRules"
                    maxlength="1"
                    v-bind:label="$t('no_limit')" required class="required_field" outlined dense
                    v-on:keypress="NumbersOnly"></v-text-field>
                </template>
                <span>{{ $t("no_limit") }}</span>
              </v-tooltip>
            </v-flex>
           <v-flex v-if="employee_number.employee_auto_gen_name" xs12 md2 pl-2 >
          
           
           </v-flex>
          </v-layout>
          <v-layout>
            
              <!-- Ex:<span class="text-primary">{{ $t("no_limit_3") }}</span>=><span class="text-success">{{ employee_number.employee_auto_gen_name }}</span> <span class="text-primary">001</span> -->
              <div v-if="employee_number.employee_auto_gen_name !='' && employee_number.employee_no_limit > 0" class="px-2 ml-2 py-1 "><v-icon medium color="grey" class="mb-1">mdi-information</v-icon><span   class="pt-2">
                Sample Employee number(<span class="text-success">{{ employee_number.employee_auto_gen_name }}</span><span class=""  v-for="index in numbervalue" :key="index">1</span>)
</span> </div>
          </v-layout>
        </v-form>
      </div>
      <div class="d-block text-right mr-4">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block mr-2">
              <v-btn v-on="on" small class="ma-1 font-weight-bold cancel-btn" color="dark cancel_button"
                @click="$router.go(-1)">
                {{ $t("cancel") }}
              </v-btn>
            </div>
          </template>
          <span>{{ $t("cancel") }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-inline-block">
              <v-btn :disabled="isDisabled" color="green darken-1" @click="submit" small class="mr-2 success hover_shine">
                {{ $t("submit") }}
                <b-spinner :disabled="isBtnLoading" small v-if="isBtnLoading"></b-spinner>
              </v-btn>
            </div>
          </template>
          <span>{{ $t("submit") }}</span>
        </v-tooltip>
      </div>
    </div>
  </div>
</template>
<script>
import VueElementLoading from "vue-element-loading";
import CreateLookup from "../../../Pages/CreateLookup.vue";
export default {
  components: {
    VueElementLoading,
    CreateLookup
  },
  data: () => ({
    isBtnLoading: false,
    valid: true,
    loader: false,
    isDisabled: false,
    employee_type_array: [],
    employee_number: {
      id: 0,
      employee_type: "",
      employee_auto_gen_name: "",
      employee_no_limit: null,
    },
  }),
  computed: {
    numbervalue(){
      if(this.employee_number.employee_no_limit !=""){
        return JSON.parse(this.employee_number.employee_no_limit);
      }else{
        return 0;
      }
    },

    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    numberRules() {
      return [(v) => !!v || this.$t("number_required")];
    },
  },
  mounted() {
    this.fetchLookups();
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          axios
            .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_emp_no_by_id", {
              params: {
                slug: this.$route.query.slug,
              },
            })
            .then((res) => {
              this.employee_number = res.data.employee_number;
              this.loader = false;
            });
        }
      },
    },
  },
  methods: {
    lookupMessage(lookup_data) {
      if(lookup_data.status == 'S') {
        this.flashMessage.success({
          message: lookup_data.message,
          time: 4000,
          blockClass: "custom-block-class",
        });
      this.fetchLookups();
      }
      else {
        this.flashMessage.error({
          message: lookup_data.message,
          time: 4000,
          blockClass: "custom-block-class",
        });
      }
    },
    enableExample(){
      if(this.employee_number.employee_auto_gen_name !=''){
       this.show_example==true;
      }
    },
    uppercaseName() {
      this.employee_number.employee_auto_gen_name = this.employee_number.employee_auto_gen_name.toUpperCase();
    },
    NumbersOnly(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 53) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    fetchLookups(){
      axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "EMPLOYEE_TYPE",
          },
        })
        .then((response) => {
          this.employee_type_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        // Form is valid, process
        axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "create_emp_no",
            this.employee_number
          )
          .then((res) => {
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
                blockClass: "custom-block-class",
              });
              this.message = res.data.message;
              this.$router.push({
                name: "employee_number",
              });
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
            console.log(err);
          });
      } else {
        console.log("Form is Invalid");
      }
    },
  },
};
</script>
<style scoped>

.example_div{
  height:100%
}
.info_text{
  background-color: #d3cfcf;
  border-radius: 5px !important;
}

</style>