export const getLessonDuration = (duration: number) => {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours} საათი, ${minutes} წუთი`;
  } else if (hours > 0) {
    return `${hours} საათი`;
  } else {
    return `${minutes} წუთი`;
  }
};
