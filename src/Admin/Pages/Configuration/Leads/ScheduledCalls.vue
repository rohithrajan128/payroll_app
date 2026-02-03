<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="call_logs"
      :loading="initval"
      :search="search"
      :single-expand="singleExpand"
    >
      <template v-slot:item="{ item, expand, isExpanded }">
        <tr>
          <td v-if="source != 'Lead'" style="color: #1976d2">
            <span
              class="redirect_to"
              @click="redirectTo(item)"
              v-if="item.link_to == 'Lead'"
              >{{ item.lead_name }}</span
            >
            <span
              class="redirect_to"
              @click="redirectTo(item)"
              v-if="item.link_to == 'Candidate'"
              >{{ item.candidate_data.name }}</span
            >
            <span
              class="redirect_to"
              @click="redirectTo(item)"
              v-if="item.link_to == 'Connect'"
              >{{ item.connect_data.business_name }}</span
            >
          </td>
          <td v-if="source != 'Lead'">
            <span v-if="item.link_to == 'Lead'"
              >+{{ item.lead_details.primary_contact.phone_code }}-{{
                item.lead_details.primary_contact.contact_phone
              }}</span
            >
            <span v-if="item.link_to == 'Candidate'"
              >+{{ item.candidate_data.country_code }}-{{
                item.candidate_data.mobile
              }}</span
            >
            <span v-if="item.link_to == 'Connect'"
              >+{{ item.connect_data.contact_number_code }}-{{
                item.connect_data.contact_number
              }}</span
            >
          </td>
          <td v-if="source != 'Lead'">
            {{ item.link_to }}
          </td>
          <td v-if="item.schedule_date">
            {{ item.schedule_date | formatDate }}
          </td>
          <td v-else>{{ $t("not_appllicable") }}</td>
          <td v-if="item.schedule_time">
            {{ item.schedule_time }}
          </td>
          <td v-else>{{ $t("not_appllicable") }}</td>
          <td>{{ item.assigned_to_data.full_name }}</td>
          <td v-if="item.created_at">
            {{ item.created_at | formatDate }}
          </td>
          <td v-else>{{ $t("not_appllicable") }}</td>
          <!-- {{item}} -->
          <td>
            <v-select
              :class="[
                item.status == 'schedule_call'
                  ? 'schedule-status'
                  : 'complete-status',
              ]"
              @change="markComplete(item.id)"
              class="pt-1 change-status"
              style="width: 140px"
              v-model="item.status"
              :items="markcomplete_array"
              item-text="longname"
              item-value="shortname"
              solo
              dense
            ></v-select>
          </td>
          <td class="text-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  @click="editCallLog(item.id)"
                  class="mr-2 edit_btn icon_size"
                  v-on="on"
                  >mdi-pencil-outline</v-icon
                >
              </template>
              <span>{{ $t("edit") }}</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  class="mr-2 edit_btn icon_size"
                  @click="deleteCallLog(item.id)"
                  color="error"
                  v-on="on"
                  >mdi-trash-can-outline</v-icon
                >
              </template>
              <span>{{ $t("delete") }}</span>
            </v-tooltip>
          </td>
          <td @click="expand(!isExpanded)">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn icon v-if="isExpanded == false" v-on="on">
                  <v-icon>mdi-arrow-down-drop-circle-outline</v-icon>
                </v-btn>
                <v-btn icon v-else>
                  <v-icon>mdi-arrow-up-drop-circle-outline</v-icon>
                </v-btn>
              </template>
              <span>{{ $t("add_details") }}</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <tr>
          <td :colspan="headers.length + 1" class="p-0">
            <div v-if="item.reason" class="px-5 py-2">
              <div class="h6 b pa-0 ma-0">{{ $t("reason_for_calling") }} :</div>
              &nbsp;
              <div style="text-align: justify; margin-top: -15px">
                {{ item.reason }}
              </div>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  props: ["call_logs", "initval", "search", "source"],
  data: () => ({
    singleExpand: false,
    markcomplete_array: [
      {
        id: 1,
        shortname: "schedule_call",
        longname: "Scheduled",
      },
      {
        id: 2,
        shortname: "completed_call",
        longname: "Completed",
      },
    ],
  }),
  computed: {
    headers() {
      if (this.source == "Lead") {
        return [
          {
            text: "Schedule Date",
            align: "left",
            value: "schedule_date",
          },
          {
            text: "Schedule Time",
            align: "left",
            value: "schedule_time",
          },
          {
            text: "Assigned To",
            align: "left",
            value: "assigned_to_data.full_name",
          },
          {
            text: "Creation Date",
            align: "left",
            value: "created_at",
          },
          {
            text: "Status",
            align: "left",
            value: "status",
          },
          {
            text: "Actions",
            width: "120",
            value: "",
            sortable: false,
            align: "center",
          },
          {
            text: "",
            value: "",
            sortable: false,
            align: "center",
          },
        ];
      } else {
        return [
          {
            text: "Name",
            align: "left",
            value: "lead.name",
            width: "200px",
          },
          {
            text: "Contact",
            align: "left",
            value: "contact",
          },
          {
            text: "Linked To",
            align: "left",
            value: "link_to",
          },
          {
            text: "Schedule Date",
            align: "left",
            value: "schedule_date",
          },
          {
            text: "Schedule Time",
            align: "left",
            value: "schedule_time",
          },
          {
            text: "Assigned To",
            align: "left",
            value: "assigned_to_data.full_name",
          },
          {
            text: "Creation Date",
            align: "left",
            value: "created_at",
          },
          {
            text: "Status",
            align: "left",
            value: "status",
          },
          {
            text: "Actions",
            width: "120px",
            value: "",
            sortable: false,
            align: "center",
          },
          {
            text: "",
            value: "",
            sortable: false,
            align: "center",
          },
        ];
      }
    },
  },
  methods: {
    redirectTo(item) {
      if (item.link_to == "Candidate") {
        this.$router.push({
          name: "candidate_recruitment_view",
          query: {
            slug: item.candidate_data.slug,
          },
        });
      } else if (item.link_to == "Lead") {
        this.$router.push({
          name: "lead_view",
          query: {
            id: item.lead_details.id,
          },
        });
      } else if (item.link_to == "Connect") {
        this.$router.push({
          name: "candidate_connect_view",
          query: {
            id: item.connect_data.id,
          },
        });
      }
    },
    markComplete(id) {
      this.$emit("mark-complete", id);
    },
    editCallLog(id) {
      this.$emit("edit-call", id);
    },
    deleteCallLog(id) {
      this.$emit("delete-call", id);
    },
  },
};
</script>
<style scoped>
.complete-status >>> .v-input__slot {
  border: 1px solid green;
  background: rgb(250, 255, 250) !important;
}
.schedule-status >>> .v-input__slot {
  border: 1px solid orange;
  background: rgb(255, 251, 240) !important;
}
.redirect_to:hover{
  cursor: pointer;
  font-weight: bold;
}
</style>
