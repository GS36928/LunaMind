// types/lesson.ts
export interface Lesson {
  id: string;
  subject: string;
  day: string;
  date: string;
  time: string;
  duration: number;
  comment?: string;
  link?: string;
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    image?: string;
  };
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    image?: string;
  };
  price?: number;
}

export interface BookedLesson {
  id: string;
  subject: string;
  date: string;
  time: string;
  duration: number;
  price?: number;
  comment?: string;
  link?: string;
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    image?: string;
  };
  student: {
    id: string;
    firstName: string;
    lastName: string;
    image?: string;
  };
}
