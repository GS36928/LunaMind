"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type QuestionType =
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "subjects"
  | "multi-select"
  | "boolean"
  | "file";

interface Subject {
  name: string;
  price: number;
}

interface Base64File {
  name: string;
  type: string;
  size: number;
  base64: string;
}

interface Profile {
  [key: string]:
    | string
    | number
    | boolean
    | undefined
    | Subject[]
    | string[]
    | File[]
    | Base64File[];
}

interface Question {
  key: string;
  label: string;
  type: QuestionType;
  options?: string[];
  multiple?: boolean;
  maxSizeMB?: number;
  dependsOn?: string;
}

interface QuestionsClientProps {
  userId: string;
  role: "STUDENT" | "TEACHER";
  initialStep: number;
}

const studentQuestions: Question[] = [
  {
    key: "educationLevel",
    label: "განათლება",
    type: "select",
    options: [
      "სკოლის მოსწავლე",
      "სტუდენტი",
      "საშუალო განათლება",
      "უმაღლესი განათლება",
      "თვით ნასწავლი",
      "სხვა",
    ],
  },
  {
    key: "desiredSubjects",
    label: "რომელია თქვენი სასურველი საგნები დასაწყისისთვის?",
    type: "multi-select",
    options: [
      "მათემატიკა",
      "ქართული",
      "ისტორია",
      "გეოგრაფია",
      "ქიმია",
      "ფიზიკა",
      "ბიოლოგია",
      "ხელოვნება",
      "ინგლისური",
      "რუსული",
      "გერმანული",
      "ესპანური",
      "ფრანგული",
      "დაწყებითი კლასები",
    ],
  },
  {
    key: "reason",
    label: "რატომ აირჩიეთ ევექტუსი?",
    type: "select",
    options: [
      "სასკოლო დავალებების შესასრულებლად",
      "ნიშნების ასამაღლებლად",
      "გამოცდისთვის მოსამზადებლად",
      "საგნის საფუძვლიანად შესასწავლად",
      "სხვა",
    ],
  },
  {
    key: "hasOtherCourses",
    label:
      "გქონიათ თუ არა შეხება სხვა ონლაინ სასწავლებელ კურსებთან ან პლატფორმებთან?",
    type: "select",
    options: ["კი", "არა"],
  },
  {
    key: "usageFrequency",
    label: "რამდენად ხშირად გსურთ გამოიყენოთ ჩვენი პლატფორმა?",
    type: "select",
    options: ["ყოველდღიურად", "კვირაში რამდენჯერმე", "საჭიროების მიხედვით"],
  },
  {
    key: "preferredLessonType",
    label: "როგორი ტიპის გაკვეთილები მოგწონთ ყველაზე მეტად?",
    type: "select",
    options: ["პრაქტიკული", "თეორიული", "თამაშზე დაფუძნებული"],
  },
  {
    key: "discoverySource",
    label: "როგორ გაიგეთ ჩვენს შესახებ?",
    type: "select",
    options: ["მეგობრისგან", "სოციალური ქსელიდან", "რეკლამიდან", "სხვა"],
  },
];

const teacherQuestions: Question[] = [
  { key: "age", label: "რამდენი წლის ხარ?", type: "number" },
  { key: "city", label: "ქალაქი", type: "text" },
  { key: "profession", label: "პროფესიული ინფორმაცია", type: "textarea" },
  {
    key: "education",
    label: "რა არის თქვენი უმაღლესი განათლება?",
    type: "select",
    options: [
      "ბაკალავრის ხარისხი",
      "მაგისტრის ხარისხი",
      "დოქტორის ხარისხი",
      "სხვა",
    ],
  },
  { key: "subjects", label: "აირჩიეთ საგნები და ფასები", type: "subjects" },
  {
    key: "goal",
    label: "რა არის თქვენი მთავარი მიზანი ჩვენს პლატფორმაზე?",
    type: "select",
    options: [
      "ახალი მოსწავლეების პოვნა",
      "გამოცდილების გაზიარება",
      "დამატებითი შემოსავლის მიღება",
      "პროფესიული ზრდა, განვითარება",
    ],
  },
  {
    key: "experienceYears",
    label: "რამდენ წლიანი გამოცდილება გაქვს სწავლების მიმართულებით?",
    type: "select",
    options: ["0-1", "2-5", "6-10", "10+"],
  },
  {
    key: "preferredAgeGroups",
    label: "რომელ ასაკობრივ ჯგუფთან ისურვებდით მუშაობას?",
    type: "multi-select",
    options: [
      "დაწყებითი კლასები",
      "საშუალო კლასები",
      "აბიტურიენტები",
      "სტუდენტები",
      "მოზრდილები",
    ],
  },
  {
    key: "hasCertificate",
    label: "გაქვს თუ არა სპეციალური სერთიფიკატი ან განათლება შენს სფეროში?",
    type: "boolean",
  },
  {
    key: "offersFreeIntroLesson",
    label: "გსურთ თუ არა გაცნობითი ხასიათის გაკვეთილის ჩატარება უფასოდ?",
    type: "boolean",
  },
  {
    key: "hasIntroVideo",
    label: "გსურთ თუ არა წინასწარ ჩაწერილი გაცნობითი ვიდეო თქვენს პროფილზე?",
    type: "boolean",
  },
  {
    key: "howDidYouHearAboutUs",
    label: "როგორ გაიგეთ ჩვენს შესახებ?",
    type: "select",
    options: ["მეგობრისგან", "სოციალური ქსელიდან", "რეკლამიდან"],
  },
];

const subjectOptions = [
  "მათემატიკა",
  "ქართული",
  "ისტორია",
  "გეოგრაფია",
  "ქიმია",
  "ფიზიკა",
  "ბიოლოგია",
  "ხელოვნება",
  "ინგლისური",
  "რუსული",
  "გერმანული",
  "ესპანური",
  "ფრანგული",
  "დაწყებითი კლასები",
];

type OtherFieldKeys = "educationLevel" | "reason" | "discoverySource";

const QuestionsClient: React.FC<QuestionsClientProps> = ({
  userId,
  role,
  initialStep,
}) => {
  const router = useRouter();
  const questions = role === "STUDENT" ? studentQuestions : teacherQuestions;

  const validatedInitialStep = Math.max(
    0,
    Math.min(initialStep, questions.length - 1)
  );
  const [step, setStep] = useState<number>(validatedInitialStep);
  const [answers, setAnswers] = useState<Profile>({
    subjects: [],
    desiredSubjects: [],
    preferredAgeGroups: [],
    hasCertificate: undefined,
    offersFreeIntroLesson: undefined,
    hasIntroVideo: undefined,
  });
  const [otherValues, setOtherValues] = useState<{
    educationLevel?: string;
    reason?: string;
    discoverySource?: string;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 🆕 FIX: Store uploaded file URLs
  const [uploadedFileUrls, setUploadedFileUrls] = useState<{
    certificateFiles: string[];
    introVideoUrl: string[];
  }>({
    certificateFiles: [],
    introVideoUrl: [],
  });

  const current = questions[step];

  // ფაილის გადაყვანა Base64-ში
  const fileToBase64 = (file: File): Promise<Base64File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve({
          name: file.name,
          type: file.type,
          size: file.size,
          base64: reader.result as string,
        });
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleChange = (
    key: string,
    value:
      | string
      | number
      | boolean
      | string[]
      | Subject[]
      | File[]
      | Base64File[]
  ) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectChange = (key: string, value: string) => {
    if (value === "სხვა") {
      handleChange(key, value);
    } else {
      handleChange(key, value);
      setOtherValues((prev) => ({ ...prev, [key as OtherFieldKeys]: "" }));
    }
  };

  const handleOtherTextChange = (key: string, value: string) => {
    setOtherValues((prev) => ({ ...prev, [key as OtherFieldKeys]: value }));
  };

  const handleMultiSelectChange = (key: string, selectedValue: string) => {
    const currentValues = [...((answers[key] as string[]) || [])];
    const newValues = currentValues.includes(selectedValue)
      ? currentValues.filter((val) => val !== selectedValue)
      : [...currentValues, selectedValue];

    handleChange(key, newValues);
  };

  const handleSubjectChange = (name: string, price: number) => {
    setAnswers((prev) => {
      const subjects = [...((prev.subjects as Subject[]) || [])];
      const index = subjects.findIndex((s) => s.name === name);

      if (index >= 0) {
        if (price === 0) subjects.splice(index, 1);
        else subjects[index].price = price;
      } else {
        subjects.push({ name, price });
      }

      return { ...prev, subjects };
    });
  };

  const handleFileChange = async (key: string, files: FileList | null) => {
    if (!files) {
      handleChange(key, []);
      return;
    }

    const fileArray = Array.from(files);

    try {
      // Convert files to Base64
      const base64Files = await Promise.all(
        fileArray.map((file) => fileToBase64(file))
      );

      handleChange(key, base64Files);
      console.log(
        `✅ Converted ${base64Files.length} files to Base64 for ${key}`
      );
    } catch (error) {
      console.error(`❌ Error converting files for ${key}:`, error);
      // Fallback: store as regular files if conversion fails
      handleChange(key, fileArray);
    }
  };

  const getAnswerValue = <T,>(key: string, defaultValue: T): T => {
    const val = answers[key];
    if (val === undefined || val === null) return defaultValue;
    return val as T;
  };

  const getStringValue = (key: string): string => {
    return getAnswerValue(key, "");
  };

  const getBooleanValue = (key: string): boolean | undefined => {
    return answers[key] as boolean | undefined;
  };

  const getStringArrayValue = (key: string): string[] => {
    return getAnswerValue(key, []);
  };

  const getSubjectsValue = (): Subject[] => {
    return getAnswerValue("subjects", []);
  };

  const getFileArrayValue = (key: string): File[] | Base64File[] => {
    return getAnswerValue(key, []);
  };

  const selectedSubjects = getStringArrayValue("desiredSubjects");
  const selectedAgeGroups = getStringArrayValue("preferredAgeGroups");

  const isOtherSelected =
    current &&
    ((current.key === "educationLevel" &&
      getStringValue(current.key) === "სხვა") ||
      (current.key === "reason" && getStringValue(current.key) === "სხვა") ||
      (current.key === "discoverySource" &&
        getStringValue(current.key) === "სხვა"));

  const getCurrentOtherValue = (): string => {
    if (!current) return "";
    const key = current.key as OtherFieldKeys;
    return otherValues[key] || "";
  };

  const shouldShowDependentSection = (dependsOnKey: string): boolean => {
    const dependsOnValue = answers[dependsOnKey];
    return dependsOnValue === true;
  };

  const isNextDisabled = (): boolean => {
    if (!current) return true;

    const value = answers[current.key];

    let isCurrentQuestionValid = false;

    switch (current.type) {
      case "number":
        isCurrentQuestionValid = typeof value === "number" && value > 0;
        break;
      case "text":
      case "textarea":
        isCurrentQuestionValid =
          typeof value === "string" && value.trim() !== "";
        break;
      case "select":
        if (value === "სხვა") {
          const otherKey = current.key as OtherFieldKeys;
          isCurrentQuestionValid =
            !!otherValues[otherKey] && otherValues[otherKey].trim() !== "";
        } else {
          isCurrentQuestionValid =
            typeof value === "string" && value.trim() !== "";
        }
        break;
      case "boolean":
        isCurrentQuestionValid = value !== undefined;
        break;
      case "multi-select":
        isCurrentQuestionValid = Array.isArray(value) && value.length > 0;
        break;
      case "subjects":
        const subjects = getSubjectsValue();
        isCurrentQuestionValid =
          subjects.length > 0 && subjects.every((s) => s.price > 0);
        break;
      default:
        isCurrentQuestionValid = !!value;
    }

    if (!isCurrentQuestionValid) return true;

    if (current.key === "hasCertificate" && value === true) {
      const certificateDescription = getStringValue("certificateDescription");
      const certificateFiles = getFileArrayValue("certificateFiles");
      return !certificateDescription.trim() || certificateFiles.length === 0;
    }

    if (current.key === "hasIntroVideo" && value === true) {
      const introVideoFiles = getFileArrayValue("introVideoUrl");
      return introVideoFiles.length === 0;
    }

    return false;
  };

  const handleNext = async () => {
    if (!current || isLoading) return;

    setIsLoading(true);
    const isLastQuestion = step === questions.length - 1;

    // შექმენი ახალი ობიექტი API-სთვის
    const apiAnswers = { ...answers };

    // Handle other text fields
    if (answers.educationLevel === "სხვა" && otherValues.educationLevel) {
      apiAnswers.educationLevel = otherValues.educationLevel;
    }
    if (answers.reason === "სხვა" && otherValues.reason) {
      apiAnswers.reason = otherValues.reason;
    }
    if (answers.discoverySource === "სხვა" && otherValues.discoverySource) {
      apiAnswers.discoverySource = otherValues.discoverySource;
    }

    // 🆕 FIX: Use uploaded URLs instead of Base64 data
    if (uploadedFileUrls.certificateFiles.length > 0) {
      apiAnswers.certificateFiles = uploadedFileUrls.certificateFiles;
      console.log(
        "🔄 Using uploaded certificate URLs:",
        uploadedFileUrls.certificateFiles
      );
    }

    if (uploadedFileUrls.introVideoUrl.length > 0) {
      apiAnswers.introVideoUrl = uploadedFileUrls.introVideoUrl;
      console.log(
        "🔄 Using uploaded video URLs:",
        uploadedFileUrls.introVideoUrl
      );
    }

    // ✅ FIX: Remove already uploaded files from API request
    // Certificate files - if they are already URLs, don't send them again
    if (
      apiAnswers.certificateFiles &&
      Array.isArray(apiAnswers.certificateFiles)
    ) {
      const firstFile = apiAnswers.certificateFiles[0];
      if (typeof firstFile === "string" && firstFile.startsWith("http")) {
        console.log(
          "🗑️ Removing certificateFiles from API request (already uploaded)"
        );
        delete apiAnswers.certificateFiles;
      }
    }

    // Intro video - if it's already a URL, don't send it again
    if (apiAnswers.introVideoUrl && Array.isArray(apiAnswers.introVideoUrl)) {
      const firstVideo = apiAnswers.introVideoUrl[0];
      if (typeof firstVideo === "string" && firstVideo.startsWith("http")) {
        console.log(
          "🗑️ Removing introVideoUrl from API request (already uploaded)"
        );
        delete apiAnswers.introVideoUrl;
      }
    }

    console.log(
      "📤 Sending answers to API (without duplicate files):",
      apiAnswers
    );

    const endpoint =
      role === "STUDENT" ? "/api/students/profile" : "/api/teachers/profile";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          step,
          isLastQuestion,
          answers: apiAnswers,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Request failed");
      }

      console.log("✅ API Response:", result);

      // ✅ FIX: Update uploaded file URLs state with response data
      if (result.uploadedFiles) {
        console.log("🔄 Updating uploaded file URLs from API response:", {
          certificateFiles: result.uploadedFiles.certificateFiles,
          introVideoUrl: result.uploadedFiles.introVideoUrl,
        });

        // Update the uploadedFileUrls state
        setUploadedFileUrls({
          certificateFiles: result.uploadedFiles.certificateFiles || [],
          introVideoUrl: result.uploadedFiles.introVideoUrl || [],
        });

        // Also update answers state with the URLs
        setAnswers((prev) => ({
          ...prev,
          certificateFiles:
            result.uploadedFiles.certificateFiles || prev.certificateFiles,
          introVideoUrl:
            result.uploadedFiles.introVideoUrl || prev.introVideoUrl,
        }));

        console.log("✅ Successfully updated local state with URLs");
      }

      if (isLastQuestion) {
        router.push("/dashboard");
      } else {
        setStep((prev) => prev + 1);
      }
    } catch (error) {
      console.error("❌ Error saving profile:", error);
      alert("მონაცემების შენახვა ვერ მოხერხდა. გთხოვთ სცადოთ ხელახლა.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!current) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="pb-4">
      <div
        className="flex justify-between items-center mt-8 pb-4 md:pb-6
      px-4 md:px-6 lg:px-11 3xl:px-40 max-w-[1920px] 3xl:mx-auto"
      >
        <div className="text-2xl leading-[100%] font-freeman-regular xl:text-[32px] cursor-pointer px-2 sm:px-0">
          Evectus
        </div>
      </div>
      <hr className="text-[#EBEBEB] pb-6 sm:pb-8" />
      <div className="px-4 md:px-6 lg:px-11 3xl:px-40 max-w-[1920px] 3xl:mx-auto lg:w-xl lg:mx-auto">
        <div className="flex justify-center gap-2 pb-6">
          {Array.from({ length: questions.length }).map((_, index) => (
            <div
              key={index}
              className={`
                h-[5px] rounded-[10px] 
                transition-all duration-300 ease-in-out
                ${
                  index === step
                    ? "bg-[#FFD52A] w-12"
                    : "bg-gray-300 w-8 md:w-[42px] lg:w-[60px] xl:w-20"
                }
                `}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-lgvanastasia-regular text-[44px] leading-8 text-[#0C0F21] text-center">
            დაგვეხმარე შეგმოგთავაზოთ სწორი სასწავლო კურსი
          </p>
          <p className="text-[#737373] font-helveticaneue-medium text-sm leading-5 text-center xl:text-base">
            {role === "STUDENT"
              ? "დაგვეხმარეთ სწორად შეგირჩიოთ რეპეტიტორი თქვენი პირადი საჭიროებების საფუძველზე"
              : "შეავსეთ თქვენი პროფილის ინფორმაცია"}
          </p>
        </div>
        <h2
          className="mt-[42px] pb-3 font-helveticaneue-regular text-[#0C0F21] text-sm leading-4 sm:mt-8 
        xl:text-base "
        >
          {current.label}
        </h2>

        {current.type === "text" && (
          <input
            type="text"
            placeholder="შეიყვანეთ ქართულად"
            value={getStringValue(current.key)}
            onChange={(e) => {
              let value = e.target.value;

              // დავუშვათ მხოლოდ ქართული ასოები, სფეისი და დეფისი
              value = value.replace(/[^ა-ჰ\s\-]/g, "");

              handleChange(current.key, value);
            }}
            onKeyDown={(e) => {
              // აკრძალე არა-ქართული სიმბოლოების შეყვანა
              if (
                !/^[ა-ჰ\s\-]$/.test(e.key) &&
                e.key !== "Backspace" &&
                e.key !== "Delete" &&
                e.key !== "Tab" &&
                e.key !== "ArrowLeft" &&
                e.key !== "ArrowRight" &&
                e.key !== "Home" &&
                e.key !== "End"
              ) {
                e.preventDefault();
              }
            }}
            className="w-full py-4 px-4 border border-[#EBEBEB] rounded-xl text-[#000000] 
      text-sm leading-5 font-helveticaneue-regular
      focus:outline-none focus:ring-2 focus:ring-[#FFD52A] focus:border-0 transition-all duration-300 ease-in-out
      xl:text-base"
          />
        )}

        {current.type === "number" && (
          <input
            type="text"
            value={getAnswerValue<number | string>(current.key, "")}
            onChange={(e) => {
              let value = e.target.value;

              // დავუშვათ მხოლოდ ციფრები
              value = value.replace(/[^\d]/g, "");

              // არ დაუშვას 100-ზე მეტი რიცხვის შეყვანა
              if (value.length >= 3) {
                // ნება დართეთ მხოლოდ "100"-ის შეყვანას
                if (value !== "100") {
                  value = value.slice(0, 2); // დატოვე მხოლოდ პირველი 2 ციფრი
                }
              }

              // არ დაუშვას 14-ზე ნაკლები რიცხვის შეყვანა
              if (value.length > 0) {
                const numValue = parseInt(value, 10);
                if (numValue < 14 && value.length >= 2) {
                  value = "14"; // ავტომატურად გახადე 14
                }
              }

              // თუ ცარიელია, გაგზავნე ცარიელი სტრინგი
              if (value === "") {
                handleChange(current.key, "");
                return;
              }

              // გადაიყვანე რიცხვად
              const numValue = parseInt(value, 10);
              handleChange(current.key, numValue);
            }}
            onBlur={(e) => {
              const value = e.target.value;
              if (value === "") return;

              const numValue = parseInt(value, 10);
              // ვალიდაცია მხოლოდ როცა მომხმარებელი input-ს ტოვებს
              if (numValue < 14) {
                handleChange(current.key, 14);
              } else if (numValue > 100) {
                handleChange(current.key, 100);
              }
            }}
            onKeyDown={(e) => {
              if (
                !/[0-9]/.test(e.key) &&
                e.key !== "Backspace" &&
                e.key !== "Delete" &&
                e.key !== "Tab" &&
                e.key !== "ArrowLeft" &&
                e.key !== "ArrowRight"
              ) {
                e.preventDefault();
              }
            }}
            pattern="[0-9]*"
            inputMode="numeric"
            placeholder="შეიყვანეთ თქვენი ასაკი (14 წლიდან 100 წლამდე)"
            className="w-full py-4 px-4 border border-[#EBEBEB] rounded-xl text-[#000000] 
      text-sm leading-5 font-helveticaneue-regular
      focus:outline-none focus:ring-2 focus:ring-[#FFD52A] focus:border-0 transition-all duration-300 ease-in-out
      xl:text-base"
          />
        )}

        {current.type === "textarea" && (
          <textarea
            value={getStringValue(current.key)}
            onChange={(e) => {
              let value = e.target.value;

              // დავუშვათ მხოლოდ ქართული ასოები, სფეისი და სასვენი ნიშნები
              value = value.replace(/[^ა-ჰ\s\-.,!?;:()'"„“]/g, "");

              handleChange(current.key, value);
            }}
            onKeyDown={(e) => {
              // აკრძალე არა-ქართული სიმბოლოების შეყვანა
              if (
                !/^[ა-ჰ\s\-.,!?;:()'"„“]$/.test(e.key) &&
                e.key !== "Backspace" &&
                e.key !== "Delete" &&
                e.key !== "Tab" &&
                e.key !== "ArrowLeft" &&
                e.key !== "ArrowRight" &&
                e.key !== "Home" &&
                e.key !== "End" &&
                e.key !== "Enter"
              ) {
                e.preventDefault();
              }
            }}
            className="w-full py-4 px-4 border border-[#EBEBEB] rounded-xl text-[#000000] 
      text-sm leading-5 font-helveticaneue-regular
      focus:outline-none focus:ring-2 focus:ring-[#FFD52A] focus:border-0 transition-all duration-300 ease-in-out
      xl:text-base"
            rows={4}
            placeholder="შეიყვანეთ ქართულად"
          />
        )}

        {current.type === "select" && (
          <div className="space-y-4">
            {/* SELECT FIELD */}
            <select
              value={getStringValue(current.key)}
              onChange={(e) => handleSelectChange(current.key, e.target.value)}
              className="w-full py-4 px-4 border border-[#EBEBEB] rounded-xl text-[#000000] 
      text-sm leading-5 font-helveticaneue-regular
      focus:outline-none focus:ring-2 focus:ring-[#FFD52A] focus:border-0 transition-all duration-300 ease-in-out
      xl:text-base"
            >
              <option value="">აირჩიეთ...</option>

              {current.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            {/* OTHER TEXT FIELD */}
            {getStringValue(current.key) === "სხვა" && (
              <div className="mt-4">
                <label className="block text-base leading-5 font-helveticaneue-regular text-black mb-2">
                  გთხოვთ მიუთითოთ თქვენი ვერსია:
                </label>

                <input
                  type="text"
                  value={getCurrentOtherValue()}
                  onChange={(e) =>
                    handleOtherTextChange(current.key, e.target.value)
                  }
                  placeholder={`შეიყვანეთ ${current.label.toLowerCase()}`}
                  className="w-full py-4 px-4 border border-[#EBEBEB] rounded-xl text-[#000000] 
          text-sm leading-5 font-helveticaneue-regular
          focus:outline-none focus:ring-2 focus:ring-[#FFD52A] focus:border-0 transition-all duration-300 ease-in-out
          xl:text-base"
                />
              </div>
            )}
          </div>
        )}

        {current.type === "multi-select" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {current.options?.map((option) => {
                const isSelected =
                  current.key === "desiredSubjects"
                    ? selectedSubjects.includes(option)
                    : selectedAgeGroups.includes(option);

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleMultiSelectChange(current.key, option)}
                    className={`py-3 px-4 border rounded-lg text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? "bg-[#FFD52A] border-[#FFD52A] text-[#0C0F21]"
                        : "bg-white border-gray-300 text-gray-700 hover:border-[#FFD52A]"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {getStringArrayValue(current.key).length === 0 && (
              <p className="text-[#737373] text-center py-4">
                გთხოვთ აირჩიოთ მინიმუმ ერთი ვარიანტი
              </p>
            )}
          </div>
        )}

        {current.type === "boolean" && (
          <div className="space-y-6">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleChange(current.key, true)}
                className={`flex-1 py-4 px-4 border rounded-xl text-sm font-medium transition-all duration-200 ${
                  getBooleanValue(current.key) === true
                    ? "bg-[#FFD52A] border-[#FFD52A] text-[#0C0F21]"
                    : "bg-white border-gray-300 text-gray-700 hover:border-[#FFD52A]"
                }`}
              >
                კი
              </button>
              <button
                type="button"
                onClick={() => handleChange(current.key, false)}
                className={`flex-1 py-4 px-4 border rounded-xl text-sm font-medium transition-all duration-200 ${
                  getBooleanValue(current.key) === false
                    ? "bg-[#FFD52A] border-[#FFD52A] text-[#0C0F21]"
                    : "bg-white border-gray-300 text-gray-700 hover:border-[#FFD52A]"
                }`}
              >
                არა
              </button>
            </div>

            {current.key === "hasCertificate" &&
              shouldShowDependentSection("hasCertificate") && (
                <div className="mt-6 space-y-4 p-4 border border-[#EBEBEB] rounded-xl bg-gray-50">
                  <h3 className="font-helveticaneue-medium text-[#0C0F21] text-sm">
                    სერტიფიკატის დეტალები
                  </h3>

                  <div>
                    <label className="block text-sm font-helveticaneue-regular text-[#0C0F21] mb-2">
                      სერტიფიკატის აღწერა *
                    </label>
                    <input
                      type="text"
                      value={getStringValue("certificateDescription")}
                      onChange={(e) => {
                        let value = e.target.value;

                        // დავუშვათ მხოლოდ ქართული ასოები, სფეისი და სასვენი ნიშნები
                        value = value.replace(/[^ა-ჰ\s\-.,!?;:()'"„“]/g, "");

                        handleChange("certificateDescription", value);
                      }}
                      onKeyDown={(e) => {
                        // აკრძალე არა-ქართული სიმბოლოების შეყვანა
                        if (
                          !/^[ა-ჰ\s\-.,!?;:()'"„“]$/.test(e.key) &&
                          e.key !== "Backspace" &&
                          e.key !== "Delete" &&
                          e.key !== "Tab" &&
                          e.key !== "ArrowLeft" &&
                          e.key !== "ArrowRight" &&
                          e.key !== "Home" &&
                          e.key !== "End"
                        ) {
                          e.preventDefault();
                        }
                      }}
                      className="w-full py-3 px-4 border border-[#EBEBEB] rounded-lg text-[#000000] 
      text-sm leading-5 font-helveticaneue-regular
      focus:outline-none focus:ring-2 focus:ring-[#FFD52A] focus:border-0 transition-all duration-300 ease-in-out"
                      placeholder="მიუთითეთ სერტიფიკატის დეტალები... (ქართულად)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-helveticaneue-regular text-[#0C0F21] mb-2">
                      ატვირთეთ სერტიფიკატები (PDF/სურათი) *
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) =>
                        handleFileChange("certificateFiles", e.target.files)
                      }
                      className="w-full py-3 px-4 border border-[#EBEBEB] rounded-lg text-[#000000] 
                    text-sm leading-5 font-helveticaneue-regular
                    focus:outline-none focus:ring-2 focus:ring-[#FFD52A] focus:border-0 transition-all duration-300 ease-in-out"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <p className="text-xs text-[#737373] mt-1">
                      მაქსიმალური ზომა: 10MB ფაილზე (PDF, JPG, PNG)
                    </p>
                  </div>
                </div>
              )}

            {current.key === "hasIntroVideo" &&
              shouldShowDependentSection("hasIntroVideo") && (
                <div className="mt-6 space-y-4 p-4 border border-[#EBEBEB] rounded-xl bg-gray-50">
                  <h3 className="font-helveticaneue-medium text-[#0C0F21] text-sm">
                    გაცნობითი ვიდეო
                  </h3>

                  <div>
                    <label className="block text-sm font-helveticaneue-regular text-[#0C0F21] mb-2">
                      ატვირთეთ გაცნობითი ვიდეო *
                    </label>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleFileChange("introVideoUrl", e.target.files)
                      }
                      className="w-full py-3 px-4 border border-[#EBEBEB] rounded-lg text-[#000000] 
                    text-sm leading-5 font-helveticaneue-regular
                    focus:outline-none focus:ring-2 focus:ring-[#FFD52A] focus:border-0 transition-all duration-300 ease-in-out
                    xl:text-base"
                      accept="video/*"
                    />
                    <p className="text-xs text-[#737373] mt-1">
                      მაქსიმალური ზომა: 40MB
                    </p>
                  </div>
                </div>
              )}
          </div>
        )}

        {current.type === "subjects" && (
          <div className="space-y-4">
            <select
              onChange={(e) => {
                const name = e.target.value;
                if (name && !getSubjectsValue().find((s) => s.name === name)) {
                  // ახალი საგნის დამატება ცარიელი ფასით (undefined ან "")
                  handleSubjectChange(name, "" as unknown as number);
                }
                e.target.value = "";
              }}
              className="w-full py-4 px-4 border border-[#EBEBEB] rounded-xl text-[#000000] 
        text-sm leading-5 font-helveticaneue-regular
        focus:outline-none focus:ring-2 focus:ring-[#FFD52A] focus:border-0 transition-all duration-300 ease-in-out
        xl:text-base"
            >
              <option value="">აირჩიეთ საგანი...</option>
              {subjectOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <div className="space-y-3">
              {getSubjectsValue().map((subject, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border border-[#EBEBEB] rounded-xl"
                >
                  <span className="flex-1 text-[#0C0F21] font-helveticaneue-regular">
                    {subject.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={subject.price === 0 ? "" : subject.price}
                      onChange={(e) => {
                        const priceValue =
                          e.target.value === "" ? 0 : Number(e.target.value);
                        handleSubjectChange(subject.name, priceValue);
                      }}
                      placeholder="ფასი"
                      className="w-24 py-2 px-3 border border-[#EBEBEB] rounded-lg text-[#000000] 
                text-sm leading-5 font-helveticaneue-regular
                focus:outline-none focus:ring-2 focus:ring-[#FFD52A] focus:border-0 transition-all duration-300 ease-in-out"
                      min="0"
                    />
                    <span className="text-[#737373] text-sm">₾</span>
                    <button
                      onClick={() => handleSubjectChange(subject.name, 0)}
                      className="text-red-500 hover:text-red-700 p-1"
                      type="button"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {getSubjectsValue().length === 0 && (
              <p className="text-[#737373] text-center py-4">
                არ არის არჩეული საგანი. გთხოვთ აირჩიოთ საგანი ზემოთ მოცემული
                სიიდან.
              </p>
            )}
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={isNextDisabled() || isLoading}
          className={`mt-6 cursor-pointer py-4 text-center w-full rounded-[40px] 
          text-[#0C0F21] text-sm leading-5 font-helveticaneue-medium xl:text-base
          transition-all duration-300 ease-in-out relative
          ${
            isNextDisabled() || isLoading
              ? "bg-gray-300 cursor-not-allowed opacity-50"
              : "bg-[#FFD52A] hover:bg-[#FFC107]"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-[#0C0F21] border-t-transparent rounded-full animate-spin mr-2"></div>
              იტვირთება...
            </div>
          ) : step < questions.length - 1 ? (
            "შემდეგი"
          ) : (
            "დასრულება"
          )}
        </button>
      </div>
    </div>
  );
};

export default QuestionsClient;
