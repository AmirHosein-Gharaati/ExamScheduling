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
      <!-- <v-sheet height="600">
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
      </v-sheet> -->
    </div>

    <div>
      <v-card class="pa-8">
        <v-form ref="form" v-model="valid" lazy-validation>
          <div class="d-flex justify-center"><h1 class="pb-4">Form</h1></div>
          <v-row>
            <v-col cols="6">
              <div>
                <h2>Students Data</h2>
                <input
                  type="file"
                  v-on:change="readFile($event, dataType.student)"
                  placeholder="Upload file"
                  accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                />
              </div>
            </v-col>
            <v-col cols="6">
              <div>
                <h2>Professor Data</h2>
                <input
                  type="file"
                  v-on:change="readFile($event, dataType.professor)"
                  placeholder="Upload file"
                  accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                />
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="3">
              <v-text-field
                v-model="numberOfDays"
                hide-details
                label="Number of Days"
                type="number"
                outlined
              />
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="numberOfSlotsPerDay"
                hide-details
                label="Number of Slots Per Day"
                type="number"
                outlined
              />
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="numberOfTries"
                hide-details
                label="Number of Tries"
                type="number"
                outlined
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import * as XLSX from "xlsx";

import { readCourses, readStudents, readProfessors } from "../helpers/readData";

export default Vue.extend({
  name: "Home",

  data: () => ({
    numberOfDays: null,
    numberOfSlotsPerDay: null,
    numberOfTries: null,
    valid: true,
    students: null,
    courses: null,
    professors: null,
    dataType: {
      student: 0,
      professor: 1,
    },
  }),
  methods: {
    readFile(event, type) {
      const file = event?.target?.files[0];
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = () => {
        const arrayBuffer = fileReader.result;
        const data = new Uint8Array(arrayBuffer);

        const arr = [];
        for (let i = 0; i != data.length; ++i)
          arr[i] = String.fromCharCode(data[i]);

        const bstr = arr.join("");
        const workbook = XLSX.read(bstr, { type: "binary" });
        const first_sheet_name = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[first_sheet_name];
        const arrayList = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (type === this.dataType.student) {
          this.courses = readCourses(arrayList);
          this.students = readStudents(arrayList);
        } else if (type === this.dataType.professor) {
          if (!this.courses) {
            alert("ابتدا باید اطلاعات دانشجویان و دروس پر شود");
            return;
          }
          this.professors = readProfessors(arrayList, this.courses);
        }
      };
    },
  },
});
</script>
