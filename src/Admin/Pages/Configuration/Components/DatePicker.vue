<template>
  <div>
    <v-menu
      ref="menu1"
      v-model="menu1"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="auto"
      :nudge-right="40"
      :close-on-content-click="false"
      :return-value.sync="show_date"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          dense
          v-model="DateFormatted"
          :label="label"
          :rules="fieldRules"
          append-icon="mdi-calendar"
          v-bind="attrs"
          :readonly="true"
          :disabled="disable_field"
          v-bind:class="class_required ? 'required_field' : ''"
          outlined
          @blur="date = parseDate(dateFormatted)"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="show_date"
        @click:date="$refs.menu1.save(show_date)"
        no-title
        class="modelqurantine"
        :max="max"
        :min="min"
        scrollable
      ></v-date-picker>
    </v-menu>
  </div>
</template>

<script>
export default {
  data: (vm) => ({
    show_date: "",
    padStart: "",
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    menu1: false,
  }),
  props: [
    "label",
    "max",
    "min",
    "stored_date",
    "rules",
    "class_required",
    "disable_field",
    "list_index",
  ],
  computed: {
    fieldRules() {
      if (this.rules) {
        return [(v) => !!v || this.$t("field_required")];
      }
    },

    DateFormatted() {
      if (this.list_index >= 0) {
        this.$emit("formatted_date_index", this.show_date, this.list_index);
        return this.formatDate(this.show_date);
      } else {
        this.$emit("formatted_date", this.show_date);
        return this.formatDate(this.show_date);
      }
    },
  },

  watch: {
    stored_date: {
      immediate: true,
      handler() {
        if (this.stored_date == "") {
          this.show_date = "";
        } else {
          this.show_date = this.stored_date;
        }
      },
    },
    date() {
      this.dateFormatted = this.formatDate(this.show_date);
    },
    menu(val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = "YEAR"));
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}-${month}-${year}`;
    },
    parseDate(date) {
      if (!date) return null;
      const [month, day, year] = date.split("-");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
  },
};
</script>