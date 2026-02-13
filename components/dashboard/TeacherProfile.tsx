import { useBookedLessons } from "@/hooks/useBookedLessons";
import ActivityTracker from "./ActivityTracker";
import FutureLessons from "./FutureLessons";
import NavBar from "./NavBar";
import OurLessons from "./OurLessons";

type TeacherUser = {
  id: string;
  firstName: string;
  lastName: string;
  role: "TEACHER";
};

type TeacherPageProps = {
  user: TeacherUser;
};

const TeacherProfile: React.FC<TeacherPageProps> = ({ user }) => {
  const { data: lessons } = useBookedLessons({ teacherId: user?.id });

  return (
    <div className="px-4 lg:px-6 bg-[#F6F5FA] 3xl:px-[160px] max-w-[1920px] 3xl:mx-auto pb-[70px] lg:pb-8">
      <NavBar user={user} />
      <div className="grid grid-cols-1 pt-8 lg:hidden">
        <ActivityTracker teacher={true} teacherId={user?.id} />
        <OurLessons teacher={true} lessons={lessons} />
        <FutureLessons teacher={true} teacherId={user?.id} />
      </div>
      <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:mt-6">
        <div className="lg:col-span-1 flex flex-col gap-4 sticky top-6 h-fit self-start">
          <OurLessons teacher={true} lessons={lessons} />
        </div>
        <div className="lg:col-span-2 xl:col-span-3 flex flex-col gap-4">
          <ActivityTracker teacher={true} teacherId={user?.id} />
          <div className="xl:grid xl:grid-cols-1 gap-4">
            <FutureLessons teacher={true} teacherId={user?.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
