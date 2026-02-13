"use client";

import React, { useEffect, useRef, useState } from "react";
import SpinContent from "../../../../components/ui/SpinContent";
import {
  LoginRegisterContentHeader,
  LoginRegisterContentInput,
  LoginRegisterContentInputPassword,
  LoginRegisterContentSocial,
  LoginRegisterContentTermsAndPrivacy,
  LoginRegisterContentTitle,
} from "../../../../components/ui/LoginRegisterContent";
import { useRouter } from "next/navigation";
import { emailRegex, isValidPassword, isValidPhone } from "@/utils/validation";
import toast from "react-hot-toast";
import { Check } from "react-coolicons";

type Role = "STUDENT" | "TEACHER" | null;

interface CheckEmailResponse {
  exists: boolean;
}

interface RequestOtpResponse {
  message: string;
}

interface VerifyOtpResponse {
  message: string;
  verifiedToken?: string;
}

const RegistrationForm = () => {
  const [role, setRole] = useState<Role>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [error, setError] = useState<string>("");

  const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
  const [otpRequested, setOtpRequested] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [verifiedToken, setVerifiedToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  const toastShownRef = useRef(false);
  const router = useRouter();

  // Role from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get("role");
    if (roleParam === "TEACHER") setRole("TEACHER");
  }, []);

  // Check if email exists
  useEffect(() => {
    if (!email) {
      setIsValidEmail(false);
      setError("");
      return;
    }

    const controller = new AbortController();

    const checkEmail = async () => {
      try {
        const res = await fetch("/api/auth/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to check email");

        const data: CheckEmailResponse = await res.json();

        if (data.exists) {
          setIsValidEmail(false);
          setError("ელ.ფოსტა უკვე დაკავებულია");
        } else {
          setIsValidEmail(true);
          setError("");
        }
      } catch {
        setIsValidEmail(false);
        setError("ელ.ფოსტის შემოწმება ვერ მოხერხდა");
      }
    };

    const timer = setTimeout(checkEmail, 500); // debounce
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [email]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const georgianNameRegex = /^[ა-ჰ\s]*$/;

    if (georgianNameRegex.test(value)) {
      setFullName(value);
      setError("");
      toastShownRef.current = false;
    } else {
      if (!toastShownRef.current) {
        setError("გთხოვთ სახელი და გვარი შეიყვანოთ მხოლოდ ქართული ასოებით");
        toast.error("გთხოვთ სახელი და გვარი შეიყვანოთ მხოლოდ ქართული ასოებით");
        toastShownRef.current = true;
      }
    }
  };

  const handleRequestOtp = async () => {
    const parts = fullName
      .trim()
      .split(" ")
      .filter((part) => part.length > 0);
    if (parts.length !== 2) {
      setError("გთხოვთ შეიყვანოთ მხოლოდ სახელი და გვარი (2 სიტყვა).");
      return;
    }
    const [firstName, lastName] = parts;
    if (firstName.length < 2 || lastName.length < 2) {
      setError("სახელი და გვარი უნდა იყოს მინიმუმ 2 ასო");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("გთხოვთ შეიყვანოთ სწორი ელ.ფოსტა");
      toast.error("გთხოვთ შეიყვანოთ სწორი ელ.ფოსტა");
      return;
    }
    if (!isValidPhone(phone)) {
      setError("ტელეფონი არასწორია, გამოიყენეთ მხოლოდ ციფრები (9-15 სიმბოლო)");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/request-registration-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName, phone, role }),
      });
      const data: RequestOtpResponse = await res.json();

      if (!res.ok) throw new Error(data.message);

      setOtpRequested(true);
      setCountdown(60);
      toast.success("ერთჯერადი კოდი გამოგზავნილია თქვენს ელ.ფოსტაზე");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("გთხოვთ შეიყვანოთ ერთჯერადი კოდი");
      toast.error("გთხოვთ შეიყვანოთ ერთჯერადი კოდი");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-registration-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data: VerifyOtpResponse = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP invalid");

      setOtpVerified(true);
      setVerifiedToken(data.verifiedToken || "");
      toast.success("მეილი დადასტურებულია! შეგიძლიათ დაასრულოთ რეგისტრაცია");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) {
      setError("გთხოვთ აირჩიოთ როლი");
      return;
    }
    if (!otpVerified || !verifiedToken) {
      setError("გთხოვთ დაადასტუროთ თქვენი მეილი");
      return;
    }

    const parts = fullName
      .trim()
      .split(" ")
      .filter((part) => part.length > 0);
    if (parts.length !== 2) {
      setError("გთხოვთ შეიყვანოთ მხოლოდ სახელი და გვარი (2 სიტყვა).");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("გთხოვთ შეიყვანოთ სწორი ელ.ფოსტა");
      return;
    }
    if (!isValidPhone(phone)) {
      setError("ტელეფონი არასწორია, გამოიყენეთ მხოლოდ ციფრები (9-15 სიმბოლო)");
      return;
    }
    if (!isValidPassword(password)) {
      setError(
        "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს, ერთ დიდ ასოს და ერთ ციფრს."
      );
      return;
    }
    if (!acceptedTerms || !acceptedPrivacy) {
      setError("გთხოვთ მონიშნეთ წესები და კონფიდენციალურობა.");
      return;
    }
    if (password !== confirmPassword) {
      setError("პაროლები არ ემთხვევა.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          role,
          email,
          phoneNumber: phone,
          password,
          acceptedTerms,
          acceptedPrivacy,
          verifiedToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message.includes("ელფოსტა უკვე დაკავებულია")) {
          setError("ელ.ფოსტა უკვე დაკავებულია");
          toast.error("ელ.ფოსტა უკვე დაკავებულია");
          return;
        }
        if (data.message.includes("ნომერი უკვე დაკავებულია")) {
          setError("ტელეფონი უკვე დაკავებულია");
          toast.error("ტელეფონი უკვე დაკავებულია");
          return;
        }
        throw new Error(data.message);
      }

      setShowModal(true);
      toast.success("რეგისტრაცია წარმატებით დასრულდა!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  const handleCloseModal = () => {
    setShowModal(false);
    router.push("/login");
  };

  return (
    <div className="h-screen flex px-4 sm:px-6 lg:px-[44px] w-full gap-6 2xl:px-[152px] 2xl:gap-[44px]">
      <div className="pt-8 flex flex-col mx-auto w-full lg:w-[65%] xl:w-1/2 h-screen overflow-y-auto hide-scrollbar">
        <LoginRegisterContentHeader />
        <LoginRegisterContentTitle title="რეგისტრაცია" />
        {error && (
          <p className="text-red-500 leading-0 font-helveticaneue-regular text-sm mt-2">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col mt-6">
          <div className="flex w-full items-center border border-[#EBEBEB] rounded-[62px] p-1">
            <div
              onClick={() => setRole("STUDENT")}
              className={`w-1/2 text-center text-sm leading-5 cursor-pointer ${
                role === "STUDENT"
                  ? "font-helveticaneue-medium text-[#0C0F21] bg-[#F6F7FB] rounded-[48px] py-3"
                  : "font-helveticaneue-regular text-[#737373] py-3"
              }`}
            >
              მოსწავლე
            </div>
           
<div
  onClick={() => setRole("TEACHER")}
  className={`w-1/2 text-center text-sm leading-5 cursor-pointer ${
    role === "TEACHER"
      ? "font-helveticaneue-medium text-[#0C0F21] bg-[#F6F7FB] rounded-[48px] py-3"
      : "font-helveticaneue-regular text-[#737373] py-3"
  }`}
>
  მასწავლებელი
</div>


          </div>

          <div className="mt-[20px] lg:mt-[24px] flex flex-col gap-4">
            <LoginRegisterContentInput
              placeholder="სახელი და გვარი (ქართულად)"
              value={fullName}
              onChange={handleFullNameChange}
              type="text"
            />

            <LoginRegisterContentInput
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="ტელეფონის ნომერი"
            />

            <div className="flex gap-2">
              <LoginRegisterContentInput
                placeholder="ელ.ფოსტა"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                disabled={otpVerified}
              />
              <button
                type="button"
                disabled={
                  !isValidEmail || loading || countdown > 0 || otpVerified
                }
                onClick={handleRequestOtp}
                className={`px-4 rounded-[40px] text-sm font-helveticaneue-medium min-w-40 ${
                  isValidEmail && countdown === 0 && !otpVerified
                    ? "bg-[#FFD52A] text-[#0C0F21] cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading
                  ? "გაგზავნა..."
                  : countdown > 0
                  ? `${countdown}წ`
                  : "კოდის მიღება"}
              </button>
            </div>
            {error.includes("ელ.ფოსტა") && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}

            {!otpVerified && (
              <div className="flex gap-2">
                <LoginRegisterContentInput
                  placeholder="ერთჯერადი კოდი"
                  type="text"
                  value={otp}
                  onChange={handleChange(setOtp)}
                />
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleVerifyOtp}
                  className="py-2 px-6 rounded-[40px] text-sm leading-5 text-[#0C0F21] font-helveticaneue-medium bg-[#FFD52A]"
                >
                  {loading ? "მიმდინარეობს..." : "მეილის დადასტურება"}
                </button>
              </div>
            )}

            {otpVerified && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                <p className="text-green-700 text-sm font-helveticaneue-medium">
                  ✓ მეილი დადასტურებულია
                </p>
              </div>
            )}

            <LoginRegisterContentInputPassword
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="პაროლი"
            />
            <LoginRegisterContentInputPassword
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="გაიმეორეთ პაროლი"
            />
          </div>

          <div className="mt-3 flex flex-col gap-[16px]">
            <LoginRegisterContentTermsAndPrivacy
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              text="წესებს და პირობებს"
              href={"/terms-and-conditions"}
              secondText="კონფიდენციალურობის პოლიტიკას"
              secondHref={"/confidentiality"}
            />
            <LoginRegisterContentTermsAndPrivacy
              checked={acceptedPrivacy}
              onChange={(e) => setAcceptedPrivacy(e.target.checked)}
              text="დაბრუნების პოლიტიკა"
              href={"/return-policy"}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !otpVerified}
            className={`py-4 w-full rounded-[40px] text-sm leading-5 text-[#0C0F21] font-helveticaneue-medium mt-6 xl:text-base xl:leading-6 ${
              otpVerified
                ? "bg-[#FFD52A] cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? "რეგისტრაცია..." : "რეგისტრაცია"}
          </button>
        </form>

        <LoginRegisterContentSocial authType="ავტორიზაცია" />
      </div>

      <hr className="hidden lg:block w-px h-full bg-[#E5E5E5]" />
      <SpinContent />

      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div className="bg-white px-6 py-[34px] sm:py-[52px] rounded-2xl shadow-lg w-[90%] max-w-md flex flex-col items-center justify-center text-center gap-4">
            <div className="bg-[#66D95D] p-[10px] rounded-full flex justify-center items-center">
              <Check className="text-white w-6 h-6 2xl:w-[44px] 2xl:h-[44px]" />
            </div>
            <div className="flex flex-col gap-2 items-center">
              <span className="font-helveticaneue-medium font-bold text-sm leading-5 text-[#0C0F21]">
                რეგისტრაცია წარმატებით დასრულდა
              </span>
              <p className="font-helveticaneue-regular text-xs leading-4 text-[#737373]">
                თქვენი ანგარიში შექმნილია. შეგიძლიათ შეხვიდეთ სისტემაში.
              </p>
            </div>
            <button
              onClick={handleCloseModal}
              className="mt-5 w-full bg-[#FFD52A] py-3 rounded-[40px] text-[#0C0F21] font-helveticaneue-medium text-sm leading-5"
            >
              გასაგებია
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;
