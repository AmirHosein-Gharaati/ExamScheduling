<template>
  <div>
    <div id="calendar" v-if="false">
      <v-sheet tile height="54" class="d-flex">
        <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-select
          v-model="type"
          :items="types"
          dense
          outlined
          hide-details
          class="ma-2"
          label="type"
        ></v-select>
        <v-select
          v-model="weekday"
          :items="weekdays"
          dense
          outlined
          hide-details
          label="weekdays"
          class="ma-2"
        ></v-select>
        <v-spacer></v-spacer>
        <v-btn icon class="ma-2" @click="$refs.calendar.next()">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="value"
          :weekdays="weekday"
          :type="type"
          :events="events"
          :event-overlap-mode="mode"
          :event-overlap-threshold="30"
          :event-color="getEventColor"
          @change="getEvents"
        ></v-calendar>
      </v-sheet>
    </div>

    <div>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row class="red">
          <v-col cols="4">
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="Date Range"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date" range></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Home",

  data: () => ({
    type: "week",
    types: ["month", "week", "day", "4day"],
    mode: "stack",
    weekday: [6, 0, 1, 2, 3, 4, 5],
    weekdays: [{ text: "Sat - Fri", value: [6, 0, 1, 2, 3, 4, 5] }],
    dates: ["2019-09-10", "2019-09-20"],
    value: "",
    events: [],
    valid: true,
    menu: false,
    date: null,
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1",
    ],
  }),
  methods: {
    getEvents({ start, end }) {
      console.log(start, end);
    },
    getEventColor(event: any) {
      return event.color;
    },
    rnd(a: number, b: number) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
  computed: {
    dateRangeText() {
      return this.dates.join(" ~ ");
    },
  },
});
</script>
