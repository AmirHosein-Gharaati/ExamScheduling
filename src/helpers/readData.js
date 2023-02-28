const courseIdAndTitle = new Map([
  [290331041, "مباني و برنامه نويسي كامپيوتر - مهندسي"],
  [290331111, "آشنايي با کامپيوتر"],
  [290331121, "کاربرد کامپيوتر"],
  [290332011, "برنامه نويسي شي گرا"],
  [290332021, "مباني تحقيق درعمليات"],
  [290332071, "مباني كامپيوتر و برنامه نويسي"],
  [290332111, "زبان ماشين و برنامه سازي سيستم"],
  [290332121, "ساختمان داده هاوالگوريتمها 1"],
  [290332131, "مدارهاي الكتريكي "],
  [290332141, "مدارهاي منطقي"],
  [290332151, "رياضي مهندسي"],
  [290332161, "معماري كامپيوتر"],
  [290332162, "آزمعماري كامپيوتر"],
  [290332171, "اصول طراحي سيستم هاي عامل"],
  [290332172, "آزمايشگاه سيستم هاي عامل"],
  [290332181, "نظريه زبانهاوماشين"],
  [290332191, "روشهاي محاسبات عددي"],
  [290332201, "ريزپردازنده"],
  [290332202, "آزريزپردازنده"],
  [290332211, "مدارهاي الكترونيكي"],
  [290332221, "شبكه هاي كامپيوتري"],
  [290332222, "آزشبكه هاي كامپيوتري"],
  [290332271, "انتقال داده ها"],
  [290332331, "طراحي وپياده سازي زبانهاي برنامه سازي"],
  [290332351, "اصول طراحي پايگاه داده ها"],
  [290332391, "طراحي و تحليل الگوريتمها"],
  [290332461, "تجارت الكترونيكي"],
  [290332471, "سيگنالهاوسيستمها"],
  [290332481, "هوش مصنوعي"],
  [290332671, "نظريه و الگوريتم هاي گراف"],
  [290338101, "برنامه نويسي پيشرفته"],
  [290343901, " سيستمهاي نهفته پيشرفته"],
  [290344041, "يادگيري ماشين"],
  [290344081, "شبكه عصبي و يادگيري عميق"],
  [290344091, "پردازش تصاويرديجيتالي"],
  [290344161, "معماري كامپيوترپيشرفته"],
  [290344221, "توصيف ووارسي برنامه ها"],
  [290344341, " طراحي الگوريتمهاي پيشرفته"],
  [290344381, "داده كاوي"],
  [290344401, "پردازش سيگنالهاي بيولوژيكي"],
  [290344501, "متن كاوي"],
  [290344571, "رايانش ابري"],
  [290344601, "هندسه محاسباتي"],
  [290345011, "محاسبات ادراکي"],
  [290346001, "سيستم هاي اطلاعات مديريت"],
  [290346051, "سيستم هاي چند عاملي"],
  [290346071, "بانک هاي اطلاعاتي نوين"],
  [290346511, "مباني امنيت اطلاعات"],
  [290346531, "امنيت پايگاه داده"],
  [290376181, "بازشناسي آماري الگوي پيشرفته"],
]);

const labCoursesIds = [290332162, 290332172, 290332202, 290332222];

export function readCourses(rawDataArray) {
  const map = new Map();
  let courses = rawDataArray[0];
  courses.shift();

  courses = filterCourses(courses);

  for (let index = 0; index < courses.length; index++) {
    map.set(index + 1, courseIdAndTitle.get(courses[index]));
  }

  return map;
}

function filterCourses(courses) {
  let newCourses = courses.filter(isCECourse).filter(isNotLabCourse);
  return newCourses;

  function isCECourse(course) {
    return course.toString().startsWith("29033");
  }

  function isNotLabCourse(course) {
    return !labCoursesIds.includes(course);
  }
}

export function readStudents(rawDataArray, coursesMap) {
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
      if (coursesMap.get(i) && row[i]) {
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
