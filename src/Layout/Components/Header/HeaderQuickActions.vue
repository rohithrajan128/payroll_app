<template>
  <div class="text-center">
    <v-menu offset-y>
      <template v-slot:activator="{ on: menu, attrs }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on: tooltip }">
            <v-icon
              v-bind="attrs"
              v-on="{ ...tooltip, ...menu }"
              small
              class="mr-2 edit_btn icon_size action_button rounded-circle p-2"
            >mdi mdi-gesture-tap-button</v-icon>
          </template>
          <span>{{ $t("quick_actions") }}</span>
        </v-tooltip>
      </template>
      <v-list>
        <!-- Quick actions in headermenu for Approval/Apply,Add Timsheet/Approve -->
        <router-link class="text-decoration-none" :to="{ name: 'applyleave' }">
          <v-list-item link>
            <v-list-item-title>{{ $t("applyleave") }}</v-list-item-title>
          </v-list-item>
        </router-link>
        <router-link class="text-decoration-none" :to="{ name: 'leave_approval' }">
          <v-list-item v-if="role.includes('Manager') || role.includes('HR') " link>
            <v-list-item-title>{{ $t("approve_leave") }}</v-list-item-title>
          </v-list-item>
        </router-link>

        <router-link class="text-decoration-none" :to="{ name: 'timesheet' }">
          <v-list-item link>
            <v-list-item-title>{{ $t("timesheet") }}</v-list-item-title>
          </v-list-item>
        </router-link>

        <router-link class="text-decoration-none" :to="{ name: 'timesheet_approval' }">
          <v-list-item v-if="role.includes('Manager')" link>
            <v-list-item-title>{{ $t("timesheet_approval") }}</v-list-item-title>
          </v-list-item>
        </router-link>
      </v-list>
    </v-menu>
  </div>
</template>

  

  <script>
export default {
  data: () => ({
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    role: ""
  }),
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    if (this.user) {
      this.role = this.user.hr_employee.emprole_name;
    }
  }
};
</script>
<style scoped>

.action_button {
  background: rgba(0, 221, 255, 0.116);
}
.router-link-active /deep/ .v-list-item{
    color:#3f6ad8 !important;
    background: #e0f3ff;

}
</style>

