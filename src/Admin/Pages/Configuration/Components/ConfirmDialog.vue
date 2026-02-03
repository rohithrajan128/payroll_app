<template>
  <div v-show="show" class="overlay">
    <div class="dialog">
      <div class="dialog__content">
        <h2 class="dialog__title text-center" v-text="title"></h2>
        <v-divider></v-divider>
        <p class="dialog__description" v-text="description"></p>
      </div>
      
      <div v-if="primary_delete=='Primary'"  class="dialog__footer">
         <button @click="cancel" class="dialog__cancel  outline-no">
           <v-icon dark small right> mdi-cancel </v-icon
          > {{ $t("OK") }}
        </button>
           <button @click="confirm(id)" class="dialog__ok  outline-ok">
          {{ create_message }}
        </button>
        </div>
      <div class="dialog__footer mt-2" v-else>

        <v-btn
            class="red text-white mr-5"
            small
            variant="outlined"
            @click="cancel" 
          >
          {{ $t("no_confirm") }}
          </v-btn>

        <v-btn
            class="success text-white mr-4"
            small
            variant="outlined"
            @click="confirm(id)"
          >
          {{ $t("yes_confirm") }}
          </v-btn>

          
        <!-- {{ primary_delete }} -->
        <!-- <button @click="cancel" class="dialog__cancel  outline-no">
           <v-icon dark small right> mdi-cancel </v-icon
          > {{ $t("no_confirm") }}
        </button>
        <button
          @click="confirm(id)"
          class="dialog__confirm  outline-yes"
        >
          <v-icon dark small right> mdi-checkbox-marked-circle </v-icon
          > {{ $t("yes_confirm") }}
        </button> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "show",
    "title",
    "description",
    "cancel",
    "confirm",
    "locationStatus",
    "dialog_data",
    "id",
    "create_message",
    "primary_delete"
  ],
};
</script>
<style scoped>
.overlay {
  --tw-bg-opacity: 1;
  background-color: rgba(0, 0, 0, var(--tw-bg-opacity));
  --tw-bg-opacity: 0.5;
  height: 100%;
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: 100%;
  z-index: 10;
}
.dialog {
  --tw-bg-opacity: 1;
  background-color: rgba(255, 255, 255, var(--tw-bg-opacity));
  border-radius: 0.75rem;
  /* border: solid rgb(0, 145, 255) 2px; */
  margin-left: auto;
  margin-right: auto;
  margin-top: 20%;
  max-width: 100%;
  width: 24rem;
}
.dialog__content {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 1rem;
}
.dialog__title {
  font-weight: 500;
  font-size: 1.125rem;
  line-height: 1.75rem;
  margin-bottom: 0.5rem;
  --tw-text-opacity: 1;
  /* color: rgba(17, 24, 39, var(--tw-text-opacity)); */
  color: rgb(81, 81, 231);
}
.dialog__description {
  font-size: 1rem;
  line-height: 1.25rem;
  margin-bottom: 1.3rem;
  --tw-text-opacity: 1;
  color: rgba(107, 114, 128, var(--tw-text-opacity));
}
.dialog__footer {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 1rem;
}
.dialog__cancel {
  color: red;
  margin-right: 2rem;
  font-size: 15px !important;
}
.dialog__ok {
  color: #3f6ad8;
  margin-right: 2rem;
  font-size: 15px !important;
}
.dialog__cancel:hover {
  font-weight: 900;
  color: red;
  font-size: 15px;
}
.dialog__confirm {
  color: rgb(4, 206, 4);
  margin-right: 2rem;
  font-size: 15px;
}
.dialog__confirm:hover {
  font-weight: 900;
  color: rgb(4, 206, 4);
  font-size: 15px;
}

</style>