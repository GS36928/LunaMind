import Link from "next/link";
import { CalendarAdd } from "react-coolicons";
import NoContent from "../ui/NoContent";
import Image from "next/image";

interface OurLessonsProps {
  subject: string;
  teacher: string;
  teacherImage: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
}

interface BookedLesson {
  id: string;
  date: string;
  teacher: User;
  student: User;
  createdAt: string;
  duration: number;
  subject: string;
}

const OurLessonsBox = ({ subject, teacher, teacherImage }: OurLessonsProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border border-[#F1F1F1] rounded-2xl bg-[#F6F5FA]">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 relative">
          <Image
            src={teacherImage}
            alt="user image"
            fill
            className="object-cover object-center rounded-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm leading-5 text-[#080808] font-helveticaneue-medium">
            {subject}
          </span>
          <span className="text-xs leading-4 text-[#737373] font-helveticaneue-regular">
            {teacher}
          </span>
        </div>
      </div>
    </div>
  );
};

const AddNewLessons = () => {
  return (
    <Link href="/dashboard/tutors">
      <div className="flex items-center justify-center gap-2 px-2 py-4 bg-[#F6F5FA] rounded-[12px]">
        <CalendarAdd className="text-[#7D3FFF]" />
        <span className="text-sm leading-5 font-helveticaneue-regular text-[#080808] border-b-1 border-[#080808]">
          დაამატეთ ახალი გაკვეთილი
        </span>
      </div>
    </Link>
  );
};

const OurLessons = ({
  profilePage = false,
  teacher = false,
  lessons,
}: {
  profilePage?: boolean;
  teacher?: boolean;
  lessons?: BookedLesson[];
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // თუ lessons არსებობს, ვფილტრავთ მხოლოდ მომავლებს (>= today)
  const filteredLessons = lessons
    ? lessons.filter((lesson) => {
        const lessonDate = new Date(lesson.date);
        lessonDate.setHours(0, 0, 0, 0);
        return lessonDate >= today;
      })
    : [];
  return (
    <div
      className={` bg-white rounded-2xl p-5 flex flex-col
        ${teacher && !profilePage ? "lg:h-screen" : ""} gap-4 ${
        lessons?.length === 0 && "lg:max-h-[596px]"
      } lg:py-6
        ${
          profilePage
            ? "md:h-[428px] lg:mt-6 mt-4 lg:h-[436px]"
            : "mt-4 lg:mt-0"
        }`}
      style={{ boxShadow: "0px 2px 5px 0px rgba(0,0,0,0.05)" }}
    >
      <span className="text-sm leading-5 text-[#737373] font-helveticaneue-regular">
        {teacher ? "ჩემი მოსწავლეები" : "ჩემი გაკვეთილები"}
      </span>
      <div className="flex flex-col justify-between h-full gap-2">
        <div className="flex flex-col gap-2">
          {filteredLessons.length > 0 ? (
            filteredLessons.map((lesson) => (
              <OurLessonsBox
                key={lesson.id}
                subject={lesson.subject}
                teacher={
                  teacher
                    ? `${lesson.student.firstName} ${lesson.student.lastName}`
                    : `${lesson.teacher.firstName} ${lesson.teacher.lastName}`
                }
                teacherImage={
                  teacher
                    ? lesson.student.image || "/images/default-profile.png"
                    : lesson.teacher.image || "/images/default-profile.png"
                }
              />
            ))
          ) : (
            <NoContent needBtn={false} desc="გთხოვთ დაამატოთ გაკვეთილი" />
          )}
        </div>
        {!teacher && <AddNewLessons />}
      </div>
    </div>
  );
};

export default OurLessons;
