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
          <v-row>
            <v-col cols="12" class="d-flex justify-center">
              <v-btn @click="submit">Submit</v-btn>
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
import axios from "axios";

import { readCourses, readStudents, readProfessors } from "../helpers/readData";

export default Vue.extend({
  name: "Home",

  data: () => ({
    numberOfDays: null,
    numberOfSlotsPerDay: null,
    numberOfTries: null,
    valid: true,
    students: null,
    coursesMap: null,
    professors: null,
    dataType: {
      student: 0,
      professor: 1,
    },
    hypeParametersList: [
      { population_size: 100, max_generation: 100, mutation_probability: 0.7 },
    ],
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
          this.coursesMap = readCourses(arrayList);
          this.students = readStudents(arrayList);
        } else if (type === this.dataType.professor) {
          if (!this.coursesMap) {
            alert("ابتدا باید اطلاعات دانشجویان و دروس پر شود");
            return;
          }
          this.professors = readProfessors(arrayList, this.coursesMap);
        }
      };
    },
    submit() {
      const data = {
        courses: this.courses,
        students: this.students,
        professors: this.professors,
        time_slots: this.timeSlots,
        number_of_tries: +this.numberOfTries,
        number_of_slots_per_day: +this.numberOfSlotsPerDay,
        hyper_parameters_list: this.hypeParametersList,
      };

      const customConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      axios
        .post("http://localhost:5000/", data, customConfig)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  computed: {
    courses() {
      const coursesList = [];

      for (const [name, id] of this.coursesMap.entries()) {
        coursesList.push({ title: name, pk: id });
      }

      return coursesList;
    },
    timeSlots() {
      if (this.numberOfSlotsPerDay > 0 && this.numberOfDays > 0) {
        const timeSlotsArray = [];

        for (
          let num = 1;
          num <= this.numberOfSlotsPerDay * this.numberOfDays;
          num++
        ) {
          timeSlotsArray.push({ pk: num, is_available: 1, is_holiday: 0 });
        }

        return timeSlotsArray;
      }
      return [];
    },
  },
});
</script>
