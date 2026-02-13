import ChooseAnyTime from "../../../components/home/ChooseAnyTime";
import DiscoverEducation from "../../../components/home/DiscoverEducation";
import Footer from "../../../components/home/Footer";
import Hero from "../../../components/home/Hero";
import HowItWorks from "../../../components/home/HowItWorks";
import NavBar from "../../../components/home/NavBar";
import OurPackages from "../../../components/home/OurPackages";
import StudentTestimonials from "../../../components/home/StudentTestimonials";
import SubjectDiscover from "../../../components/home/SubjectDiscover";
import Tutors from "../../../components/home/Tutors";
import TutorsType from "../../../components/home/TutorsType";
import WhyOurPlatform from "../../../components/home/WhyOurPlatform";
import VideoLesson from "../../../components/ui/VideoLesson";
import TutorsInfo from "../../../components/home/TutorsInfo";
import { getCurrentUser } from "@/lib/session";

export default async function Home() {
  const user = await getCurrentUser();
  const userImage = user?.image || null;
  const userFullName = `${user?.firstName} ${user?.lastName}` || null;

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-11 3xl:px-40 max-w-[1920px] 3xl:mx-auto">
        <div className="">
          <NavBar userImage={userImage} userFullName={userFullName} />
        </div>
        <Hero id="home" userExist={user?.id} />
        <div className="lg:flex lg:gap-6">
          <VideoLesson />
          <div className="lg:order-3 lg:w-[20%] lg:h-full">
            <Tutors />
            <div className="hidden lg:block lg:w-full lg:h-full">
              <TutorsType />
            </div>
          </div>
          <ChooseAnyTime />
        </div>
        <DiscoverEducation />
        <WhyOurPlatform id="why" />
        <SubjectDiscover />
        <OurPackages id="packages" userExist={user?.id} />
        <HowItWorks />
        <TutorsInfo id="tutors" userExist={user?.id} />
        <StudentTestimonials id="reviews" userExist={user?.id} />
      </div>
      <Footer userExist={user?.id} />
    </>
  );
}
