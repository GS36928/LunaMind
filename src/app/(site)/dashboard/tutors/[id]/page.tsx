import { getCurrentUser } from "@/lib/session";
import NavBar from "../../../../../../components/dashboard/NavBar";
import { redirect } from "next/navigation";
import SingleTeacherLeftSide from "../../../../../../components/teacher-profile/SingleTeacherLeftSide";
import SingleTeacherRightSide from "../../../../../../components/teacher-profile/SingleTeacherRightSide";
import { prisma } from "@/lib/prisma";
import TeacherAbout from "../../../../../../components/teacher-profile/TeacherAbout";
import TeacherSubjects from "../../../../../../components/teacher-profile/TeacherSubjects";

interface TutorPageProps {
  params: {
    id: string;
  };
  searchParams: {
    subject?: string;
  };
}

const TutorPage = async ({ params, searchParams }: TutorPageProps) => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const safeUser = { ...user, image: user.image || undefined };

  if (safeUser.role === "TEACHER") redirect("/dashboard");

  const { id } = await params;
  const searchParamsObj = await searchParams;
  const selectedSubject = searchParamsObj.subject;

  // პირდაპირ Prisma-ს გამოყენებით მასწავლებლის მონაცემების მიღება
  const teacher = await prisma.teacherProfile.findUnique({
    where: {
      id: id,
    },
    include: {
      user: true,
      teacherSubjects: true,
      lessons: true,
    },
  });

  if (!teacher) {
    redirect("/dashboard/tutors");
  }

  // ფილტრაცია მხოლოდ იმ საგნისა და გაკვეთილების, რომელზეც დააწკაპუნეს
  const filteredTeacher = {
    ...teacher,
    teacherSubjects: selectedSubject
      ? teacher.teacherSubjects.filter(
          (subject) => subject.name === selectedSubject
        )
      : teacher.teacherSubjects,
    lessons: selectedSubject
      ? teacher.lessons.filter((lesson) => lesson.subject === selectedSubject)
      : teacher.lessons,
  };

  const teacherWithSafeImage = {
    ...filteredTeacher,
    user: {
      ...teacher.user,
      image: teacher.user.image || "/images/default-profile.png",
    },
  };

  return (
    <div className="bg-[#F6F5FA]">
      <div className="bg-[#F6F5FA] min-h-screen px-4 lg:px-6 3xl:px-[160px] max-w-[1920px] 3xl:mx-auto pb-[70px] lg:pb-8">
        <NavBar user={safeUser} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-[32px] lg:mt-5 xl:mt-6   pb-[50px] lg:pb-0">
          <div className="col-span-2 order-2">
            <SingleTeacherLeftSide
              teacher={teacherWithSafeImage}
              selectedSubject={selectedSubject}
            />
            <div className="mt-4 lg:hidden flex flex-col gap-4">
              <TeacherAbout
                age={teacherWithSafeImage.age}
                city={teacherWithSafeImage.city}
                education={teacherWithSafeImage.education}
                experienceYears={teacherWithSafeImage.experienceYears}
                preferredAgeGroups={teacherWithSafeImage.preferredAgeGroups}
                certificateFiles={teacherWithSafeImage.certificateFiles}
              />
              <TeacherSubjects subjects={teacher.teacherSubjects} />
            </div>
          </div>
          <div className="lg:sticky top-6 self-start h-fit order-1 lg:order-2">
            <SingleTeacherRightSide
              teacher={teacherWithSafeImage}
              studentId={safeUser.id}
              teacherUserId={teacher.user.id}
            />
            <div className="hidden mt-4 lg:flex flex-col gap-4">
              <TeacherAbout
                age={teacherWithSafeImage.age}
                city={teacherWithSafeImage.city}
                education={teacherWithSafeImage.education}
                experienceYears={teacherWithSafeImage.experienceYears}
                preferredAgeGroups={teacherWithSafeImage.preferredAgeGroups}
                certificateFiles={teacherWithSafeImage.certificateFiles}
              />
              <TeacherSubjects subjects={teacher.teacherSubjects} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorPage;
