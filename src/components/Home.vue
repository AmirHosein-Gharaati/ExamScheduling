<template>
  <div>
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
            <v-col cols="4">
              <v-text-field
                v-model="numberOfDays"
                hide-details
                label="Number of Days"
                type="number"
                outlined
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="numberOfSlotsPerDay"
                hide-details
                label="Number of Slots Per Day"
                type="number"
                outlined
              />
            </v-col>
            <v-col cols="4">
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
            <v-col cols="6">
              <v-select
                v-model="notAvailableDaysModel"
                :items="notAvailableDaysItems"
                label="Not Available Days"
                multiple
                outlined
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="holidaysModel"
                :items="holidaysItems"
                label="Holidays"
                multiple
                outlined
                hide-details
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="hyperParametersModel.population_size"
                hide-details
                label="Population Size"
                type="number"
                outlined
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="hyperParametersModel.max_generation"
                hide-details
                label="Maximum Generation"
                type="number"
                outlined
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="hyperParametersModel.mutation_probability"
                hide-details
                label="Mutation Probability"
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

    <v-card v-if="loading || results" class="my-8 pa-8">
      <div
        v-if="loading"
        class="d-flex align-center justify-center pa-2 my-4 orange"
      >
        Waiting for the results...
      </div>
      <div v-if="results">
        <h1 class="d-flex justify-center blue white--text">
          Fitness: {{ results.fitness }}
        </h1>
        <div v-for="dayId in +numberOfDays" :key="dayId">
          <div v-if="isValidDay(dayId)" class="my-16">
            <h1 class="px-4">Day: {{ dayId }}</h1>
            <div
              v-for="slot in getProperSlotsByDayId(dayId)"
              :key="slot.time_slot"
            >
              <div v-if="isValidTimeSlot(slot)">
                <div>
                  <h2 class="px-4">
                    Time Slot:
                    {{ getProperTimeSlotNumber(dayId, slot.time_slot) }}
                  </h2>
                </div>
                <div
                  v-for="exam in slot.courses"
                  :key="exam.courses"
                  class="d-flex align-center justify-end pa-2 ma-2 lime lighten-4"
                >
                  <h3 v-if="exam.professor" class="px-4">
                    استاد: {{ exam.professor }}
                  </h3>
                  <h3 class="px-4">درس: {{ exam.title }}</h3>
                </div>
              </div>
            </div>
            <v-divider class="blue-grey darken-3 pt-1"></v-divider>
          </div>
        </div>
      </div>
    </v-card>
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
    results: null,
    loading: false,
    notAvailableDaysModel: null,
    holidaysModel: null,
    dataType: {
      student: 0,
      professor: 1,
    },
    hyperParametersModel: {
      population_size: null,
      max_generation: null,
      mutation_probability: null,
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
      this.loading = true;
      this.results = null;

      const hyperParametersList = [
        {
          population_size: +this.hyperParametersModel.population_size,
          max_generation: +this.hyperParametersModel.max_generation,
          mutation_probability: +this.hyperParametersModel.mutation_probability,
        },
      ];

      const data = {
        courses: this.courses,
        students: this.students,
        professors: this.professors,
        time_slots: this.timeSlots,
        number_of_tries: +this.numberOfTries,
        number_of_slots_per_day: +this.numberOfSlotsPerDay,
        hyper_parameters_list: hyperParametersList,
      };

      const customConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      axios
        .post("http://localhost:5000/", data, customConfig)
        .then((res) => {
          this.results = res.data;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getProperSlotsByDayId(dayId) {
      const id = (+dayId - 1) * +this.numberOfSlotsPerDay;
      const val = this.results.schedule.slice(
        id,
        id + +this.numberOfSlotsPerDay
      );
      return val;
    },
    isValidDay(dayId) {
      const daySlots = this.getProperSlotsByDayId(dayId);
      let emptyDays = 0;

      for (let i = 0; i < daySlots.length; i++) {
        if (!this.isValidTimeSlot(daySlots[i])) {
          emptyDays += 1;
        }
      }
      return emptyDays < +this.numberOfSlotsPerDay;
    },
    isValidTimeSlot(slot) {
      return slot.courses.length > 0;
    },
    getProperTimeSlotNumber(dayId, timeSlotId) {
      return +timeSlotId - (+dayId - 1) * +this.numberOfSlotsPerDay;
    },
    range(start, end) {
      const items = [];

      for (let i = start; i < end; i++) {
        items.push(i);
      }

      return items;
    },
    timeSlotIsInDay(timeSlotId, dayId) {
      const start = (dayId - 1) * +this.numberOfSlotsPerDay;
      const end = dayId * +this.numberOfSlotsPerDay;
      return timeSlotId > start && timeSlotId <= end;
    },
    timeSlotIsinDays(timeSlotId, dayIds) {
      let isInDays = false;
      dayIds.forEach((dayId) => {
        if (this.timeSlotIsInDay(timeSlotId, dayId)) {
          isInDays = true;
          return;
        }
      });
      return isInDays;
    },
  },
  computed: {
    holidaysItems() {
      if (+this.numberOfDays > 0) {
        return this.range(1, +this.numberOfDays + 1);
      }
      return [];
    },
    notAvailableDaysItems() {
      if (+this.numberOfDays > 0) {
        return this.range(1, +this.numberOfDays + 1);
      }
      return [];
    },
    courses() {
      const coursesList = [];

      for (const [name, id] of this.coursesMap.entries()) {
        coursesList.push({ title: name, pk: id });
      }

      return coursesList;
    },
    timeSlots() {
      if (+this.numberOfSlotsPerDay > 0 && +this.numberOfDays > 0) {
        const timeSlotsArray = [];

        for (
          let timeSlotId = 1;
          timeSlotId <= +this.numberOfSlotsPerDay * +this.numberOfDays;
          timeSlotId++
        ) {
          const isAvailable = this.timeSlotIsinDays(
            timeSlotId,
            this.notAvailableDaysModel
          )
            ? 0
            : 1;
          const isHoliday = this.timeSlotIsinDays(
            timeSlotId,
            this.holidaysModel
          )
            ? 1
            : 0;

          timeSlotsArray.push({
            pk: timeSlotId,
            is_available: isAvailable,
            is_holiday: isHoliday,
          });
        }
        return timeSlotsArray;
      }
      return [];
    },
  },
});
</script>
