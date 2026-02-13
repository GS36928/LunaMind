import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import NavBar from "../../../../../components/dashboard/NavBar";
import { prisma } from "@/lib/prisma";
import { FilterPanel } from "../../../../../components/ui/FilterPanel";
import { TeacherList } from "../../../../../components/teacher-profile/TeacherList";
import { Prisma } from "@prisma/client";
import { FilterMobileModal } from "../../../../../components/ui/FilterMobileModal";

interface SearchParams {
  subjects?: string;
  days?: string;
  time?: string; // format: "13:00-17:00"
  minPrice?: string;
  maxPrice?: string;
}

export default async function TutorsStudent({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const safeUser = { ...user, image: user.image || undefined };

  if (safeUser.role === "TEACHER") redirect("/dashboard");

  const params = await searchParams;

  const subjects = params.subjects?.split(",") || [];
  const days = params.days?.split(",") || [];
  const time = params.time || "";
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;

  // დროის დიაპაზონის დაშლა
  const [timeStart, timeEnd] = time ? time.split("-") : ["", ""];

  const where: Prisma.TeacherProfileWhereInput = {};

  // საგნების და ფასის ფილტრი
  if (subjects.length > 0 || minPrice !== undefined || maxPrice !== undefined) {
    where.teacherSubjects = {
      some: {
        ...(subjects.length > 0 && { name: { in: subjects } }),
        ...((minPrice !== undefined || maxPrice !== undefined) && {
          price: {
            ...(minPrice !== undefined && { gte: minPrice }),
            ...(maxPrice !== undefined && { lte: maxPrice }),
          },
        }),
      },
    };
  }

  // დღეების ფილტრი
  const lessonsFilter: Prisma.LessonWhereInput = {};
  if (days.length > 0) lessonsFilter.day = { in: days, mode: "insensitive" };

  if (Object.keys(lessonsFilter).length > 0) {
    where.lessons = { some: lessonsFilter };
  }

  const teachers = await prisma.teacherProfile.findMany({
    where: Object.keys(where).length > 0 ? where : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      teacherSubjects: true,
      lessons: true,
    },
  });

  const teachersWithSafeImages = teachers.map((teacher) => ({
    ...teacher,
    user: {
      ...teacher.user,
      image: teacher.user?.image || "/images/default-profile.png",
    },
  }));

  // დროის დიაპაზონის ფილტრის ფუნქცია
  const timeToMinutes = (timeStr: string) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + (minutes || 0);
  };

  const matchesTimeFilter = (lessonTime: string) => {
    if (!timeStart && !timeEnd) return true;

    const lessonMinutes = timeToMinutes(lessonTime);
    const startMinutes = timeToMinutes(timeStart);
    const endMinutes = timeToMinutes(timeEnd);

    let matches = true;

    if (timeStart) {
      matches = matches && lessonMinutes >= startMinutes;
    }

    if (timeEnd) {
      matches = matches && lessonMinutes <= endMinutes;
    }

    return matches;
  };

  // თითოეული მასწავლებლისთვის ქმნის ცალკე ქარდს ყოველი შესაბამისი საგნისთვის
  const teachersWithExpandedSubjects = teachersWithSafeImages.flatMap(
    (teacher) => {
      // ფილტრავს საგნებს რომლებიც აკმაყოფილებენ საგნისა და ფასის პირობებს
      const matchingSubjects = teacher.teacherSubjects.filter((subject) => {
        const matchesSubject =
          subjects.length === 0 || subjects.includes(subject.name);
        const matchesPrice =
          (minPrice === undefined || subject.price! >= minPrice) &&
          (maxPrice === undefined || subject.price! <= maxPrice);

        return matchesSubject && matchesPrice;
      });

      // თითოეული საგნისთვის ვამოწმებთ დღეებისა და დროის პირობებს
      const expandedCards = matchingSubjects
        .map((subject) => {
          // ვპოულობთ ამ საგანთან დაკავშირებულ გაკვეთილებს
          const subjectLessons = teacher.lessons.filter(
            (lesson) => lesson.subject === subject.name
          );

          // აკმაყოფილებს თუ არა ეს საგანი დღეებისა და დროის პირობებს
          const hasMatchingLessons = subjectLessons.some((lesson) => {
            const matchesDay = days.length === 0 || days.includes(lesson.day);
            const matchesTime = matchesTimeFilter(lesson.time);
            return matchesDay && matchesTime;
          });

          // თუ საგანი აკმაყოფილებს ყველა პირობას, ვაბრუნებთ
          if (hasMatchingLessons) {
            return {
              ...teacher,
              // ჩავსვათ საგნის ინფორმაცია ქარდისთვის
              subjectName: subject.name,
              subjectPrice: subject.price,
              // შევინარჩუნოთ მხოლოდ ამ საგანთან დაკავშირებული teacherSubjects
              teacherSubjects: [subject],
              // შევინარჩუნოთ მხოლოდ ამ საგანთან დაკავშირებული lessons
              lessons: subjectLessons,
            };
          }

          return null;
        })
        .filter((card): card is NonNullable<typeof card> => card !== null); // Type-safe ფილტრაცია

      return expandedCards;
    }
  );

  return (
    <div className="bg-[#F6F5FA]">
      <div className="bg-[#F6F5FA] min-h-screen px-4 lg:px-6 3xl:px-[160px] max-w-[1920px] 3xl:mx-auto pb-[70px] lg:pb-8">
        <NavBar user={safeUser} />
        <div className="grid grid-cols-1 mt-[22px] sm:mt-8 lg:mt-[20px] xl:mt-6 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4">
          <div className="cursor-pointer lg:grid lg:col-span-1">
            <FilterMobileModal
              initialSubjects={subjects}
              initialDays={days}
              initialTime={time}
              initialMinPrice={minPrice?.toString()}
              initialMaxPrice={maxPrice?.toString()}
            />
            <div className="hidden lg:flex flex-col rounded-2xl bg-[#FFFFFF] h-fit px-5 py-6 gap-4 sticky top-6 self-start">
              <span className="text-sm leading-5 font-helveticaneue-regular text-[#737373]">
                ფილტრაცია
              </span>
              <FilterPanel
                initialSubjects={subjects}
                initialDays={days}
                initialTime={time}
                initialMinPrice={minPrice?.toString()}
                initialMaxPrice={maxPrice?.toString()}
              />
            </div>
          </div>
          <TeacherList teachers={teachersWithExpandedSubjects} />
        </div>
      </div>
    </div>
  );
}
