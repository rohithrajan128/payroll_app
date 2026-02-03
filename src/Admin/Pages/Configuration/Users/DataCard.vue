<template>
  <v-card style="margin-top: -12px; height: 205px" class="p-2">
    <div class="pb-2 font-weight-bold pl-2">
      {{ $t("role_assigned") }}
      <div class="mt-1">
        <v-chip
          small
          v-for="(role, index) in user_info.user.emprole_name"
          :key="index"
          class="mr-1"
          outlined
          color="primary"
        >
          {{ role }}
        </v-chip>
      </div>
    </div>
    <div class="row">
      <div class="col-md-4 ml-2 py-3 font-weight-bold">
        {{ $t("employee_type") }}
      </div>
      <div class="col-md-6 py-3">
        {{ user_info.user.employee_status.longname }}
      </div>
      <div class="col-md-4 ml-2 py-3 font-weight-bold padding-level mt-m10">
        {{ $t("level") }}
      </div>
      <div class="col-md-6 py-3 padding-level mt-m10">
        {{ user_info.user.levelidname.level }}
      </div>
      <div class="col-md-4 ml-2 py-3 font-weight-bold mt-m10">
        {{ $t("department") }}
      </div>
      <div class="col-md-6 py-3 mt-m10">{{ user_info.user.department }}</div>
    </div>
    <v-card-actions class="d-flex justify-content-end">
      <v-btn small text color="teal accent-4" @click="reveal = true">SHOW MORE </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <v-card
        v-if="reveal"
        class="transition-fast-in-fast-out v-card--reveal p-2"
        style="height: 205px; margin-left: -8px"
      >
        <v-card-text class="pb-0">
          <v-row>
            <div class="row">
              <div class="col-md-4 ml-2 py-3 font-weight-bold text-dark">
                {{ $t("organisation") }}
              </div>
              <div class="col-md-6 py-3 text-dark">
                {{ user_info.user.user_org.shortname }}
              </div>
              <div
                class="col-md-4 ml-2 py-3 font-weight-bold padding-level mt-m10 text-dark"
              >
                {{ $t("site") }}
              </div>
              <div class="col-md-6 py-3 padding-level mt-m10 text-dark">
                {{ user_info.user.sitedetails.shortname }}
              </div>
              <div class="col-md-12 py-3 mt-m10">
                <div class="pl-2 font-weight-bold text-dark">
                  {{ $t("working_days") }}
                  <div class="mt-1">
                    <v-chip
                      small
                      v-for="(day, index) in JSON.parse(user_info.user.working_days)"
                      :key="index"
                      class="mr-1 my-1"
                      outlined
                      color="primary"
                    >
                      {{ day }}
                    </v-chip>
                  </div>
                </div>
              </div>
            </div>
          </v-row>
        </v-card-text>
        <v-card-actions class="pt-0 d-flex justify-content-end">
          <v-btn small text color="teal accent-4" @click="reveal = false">
            SHOW LESS
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-expand-transition>
  </v-card>
</template>
<script>
export default {
  props: ["user_info"],
  data: () => ({
    reveal: false,
  }),
  mounted() {
    console.log(this.user_info.user.reporting_to.empnamefetch.working_days);
  },
};
</script>
<style>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
.mt-m10 {
  margin-top: -10px;
}
</style>