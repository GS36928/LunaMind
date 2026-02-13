export const countFinishedLessons = (
  lessons: { createdAt: string | Date; duration: number }[]
) => {
  const now = new Date();

  return lessons.filter((lesson) => {
    const createdDate =
      lesson.createdAt instanceof Date
        ? lesson.createdAt
        : new Date(lesson.createdAt);

    const endTime = new Date(
      createdDate.getTime() + lesson.duration * 60 * 60 * 1000
    );

    return endTime <= now;
  }).length;
};

export const countFinishedLessonsHours = (
  lessons: { createdAt: string | Date; duration: number }[]
) => {
  const now = new Date();

  return lessons
    .filter((lesson) => {
      const createdDate =
        lesson.createdAt instanceof Date
          ? lesson.createdAt
          : new Date(lesson.createdAt);

      const endTime = new Date(
        createdDate.getTime() + lesson.duration * 60 * 60 * 1000
      );

      return endTime <= now; // მხოლოდ დასრულებული გაკვეთილები
    })
    .reduce((total, lesson) => total + lesson.duration, 0); // ჯამი საათებში
};
