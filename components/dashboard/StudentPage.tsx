import { useBookedLessons } from "@/hooks/useBookedLessons";
import ActivityTracker from "./ActivityTracker";
import FutureLessons from "./FutureLessons";
import NavBar from "./NavBar";
import OurLessons from "./OurLessons";
import RepetitorSwiper from "./RepetitorSwiper";
import Review from "./Review";

type StudentUser = {
  id: string;
  firstName: string;
  lastName: string;
  role: "STUDENT";
};

type StudentPageProps = {
  user: StudentUser;
};

const StudentPage: React.FC<StudentPageProps> = ({ user }) => {
  const { data: lessons } = useBookedLessons({ studentId: user?.id });
  return (
    <div className="px-4 lg:px-6 bg-[#F6F5FA] 3xl:px-[160px] max-w-[1920px] 3xl:mx-auto pb-[70px] lg:pb-8">
      <NavBar user={user} />
      <div className="grid grid-cols-1 pt-8 lg:hidden">
        <ActivityTracker studentId={user.id} />
        <OurLessons lessons={lessons} />
        <FutureLessons studentId={user.id} />
        <RepetitorSwiper />
        <Review studentId={user.id} />
      </div>
      <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:mt-6">
        <div className="lg:col-span-1 flex flex-col gap-4 sticky lg:static top-6 h-fit self-start">
          <OurLessons lessons={lessons} />
          <Review studentId={user.id} />
        </div>
        <div className="lg:col-span-2 xl:col-span-3 flex flex-col gap-4">
          <ActivityTracker studentId={user.id} />
          <div className="xl:grid xl:grid-cols-1 gap-4">
            <FutureLessons studentId={user.id} />
          </div>
          <div className="hidden xl:block">
            <RepetitorSwiper />
          </div>
        </div>
        <div className="lg:col-span-3 xl:hidden">
          <RepetitorSwiper />
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
