// app/dashboard/tutors/loading.tsx - დავამატოთ loading component
export default function Loading() {
  return (
    <div className="bg-[#F6F5FA] min-h-screen px-4 lg:px-6 3xl:px-[160px] max-w-[1920px] 3xl:mx-auto pb-[70px] lg:pb-0">
      <div className="animate-pulse">
        {/* NavBar სიმულაცია */}
        <div className="h-16 bg-gray-200 rounded mt-4"></div>

        <div className="grid grid-cols-1 mt-[22px] sm:mt-8 lg:mt-[20px] xl:mt-6 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4">
          {/* Filter Panel სიმულაცია */}
          <div className="hidden lg:flex flex-col rounded-2xl bg-[#FFFFFF] h-fit px-5 py-6 gap-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-3">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="flex gap-2">
                <div className="h-10 bg-gray-200 rounded flex-1"></div>
                <div className="h-10 bg-gray-200 rounded flex-1"></div>
              </div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Teacher Cards სიმულაცია */}
          <div className="flex flex-col md:grid gap-4 md:grid-cols-2 lg:col-span-2 xl:col-span-3 xl:grid-cols-3 mt-6 lg:mt-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="border border-[#EBECF0] bg-white rounded-xl p-4"
              >
                <div className="flex justify-between items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex flex-col gap-1">
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="mt-2 h-3 bg-gray-200 rounded w-full"></div>
                <div className="mt-4 h-0.5 bg-gray-200"></div>
                <div className="mt-3 space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="mt-3 h-12 bg-gray-200 rounded-[50px]"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
