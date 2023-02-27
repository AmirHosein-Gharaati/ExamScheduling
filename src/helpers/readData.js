export function readCourses(rawDataArray) {
  const map = new Map();
  const headers = rawDataArray[0];
  headers.shift();

  for (let index = 0; index < headers.length; index++) {
    map.set(headers[index], index + 1);
  }

  return map;
}

export function readStudents(rawDataArray) {
  const studentCoursesRow = rawDataArray.slice(1);

  const studentsData = [];

  studentCoursesRow.forEach((row) => {
    if (row.length === 0) {
      return;
    }

    const student = {
      pk: row[0],
      courses: [],
    };

    for (let i = 1; i < row.length; i++) {
      if (row[i]) {
        student.courses.push(i);
      }
    }

    studentsData.push(student);
  });

  return studentsData;
}

export function readProfessors(rawDataArray, coursesMap) {
  const professorsData = [];

  for (let i = 0; i < rawDataArray.length; i++) {
    const professor = {
      pk: i + 1,
      name: rawDataArray[i][0],
      courses: [],
    };

    for (let j = 1; j < rawDataArray[i].length; j++) {
      const courseName = rawDataArray[i][j];
      const courseId = coursesMap.get(courseName);

      if (!!courseId) {
        professor.courses.push(courseId);
      }
    }

    professorsData.push(professor);
  }

  return professorsData;
}
