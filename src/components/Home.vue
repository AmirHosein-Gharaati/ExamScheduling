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
      <v-card class="pa-8">
        <v-form ref="form" v-model="valid" lazy-validation>
          <div class="d-flex justify-center"><h1 class="pb-4">Form</h1></div>
          <v-row>
            <v-col cols="6">
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
                    outlined
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date" range no-title></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="6">
              <v-menu
                ref="menu2"
                v-model="menu2"
                :close-on-content-click="false"
                :return-value.sync="dates"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-combobox
                    v-model="dates"
                    multiple
                    chips
                    small-chips
                    label="Exclude Dates"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    outlined
                  ></v-combobox>
                </template>
                <v-date-picker v-model="dates" multiple no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu2 = false">
                    Cancel
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.menu2.save(dates)">
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="3">
              <v-text-field
                v-model="numberValue"
                hide-details
                label="Slot Duration"
                type="number"
                outlined
              />
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="numberValue"
                hide-details
                label="Number of Slots"
                type="number"
                outlined
              />
            </v-col>

            <v-col cols="6">
              <v-menu
                ref="menuTimePicker"
                v-model="menuTimePicker"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="time"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="time"
                    label="Picker in menu"
                    prepend-icon="mdi-clock-time-four-outline"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    outlined
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="menuTimePicker"
                  v-model="menuTimePickerModel"
                  full-width
                  @click:minute="$refs.menuTimePicker.save(menuTimePickerModel)"
                ></v-time-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
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
    dates: [],
    value: "",
    events: [],
    valid: true,
    menu: false,
    menu2: false,
    menuTimePicker: null,
    menuTimePickerModel: null,
    numberValue: null,
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
