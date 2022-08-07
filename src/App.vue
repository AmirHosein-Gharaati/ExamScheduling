<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <span class="font-weight-bold">Exam Scheduling</span>
    </v-app-bar>
    <v-main>
      <v-container>
        <Home />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Home from "./components/Home.vue";

export default Vue.extend({
  name: "App",

  components: {
    Home,
  },

  data: () => ({
    //
  }),
});
</script>
