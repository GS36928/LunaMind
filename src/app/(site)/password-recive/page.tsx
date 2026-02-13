"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import {
  LoginRegisterContentHeader,
  LoginRegisterContentInput,
  LoginRegisterContentInputPassword,
  LoginRegisterContentTitle,
} from "../../../../components/ui/LoginRegisterContent";
import SpinContent from "../../../../components/ui/SpinContent";
import { useRouter } from "next/navigation";
import { Check } from "react-coolicons";
import { toast } from "react-hot-toast";

interface CheckEmailResponse {
  exists: boolean;
}

interface RequestOtpResponse {
  message: string;
}

interface VerifyOtpResponse {
  message: string;
}

interface ResetPasswordResponse {
  message: string;
}

// Password validation function
export const isValidPassword = (password: string) => {
  // მინიმუმ 8 სიმბოლო, ერთი დიდი ასო, ერთი ციფრი
  return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
};

const PasswordRecieve: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
  const [otpRequested, setOtpRequested] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const router = useRouter();

  // ✅ Check if email exists
  useEffect(() => {
    if (!email) {
      setIsValidEmail(false);
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
        setIsValidEmail(Boolean(data.exists));
      } catch {
        setIsValidEmail(false);
      }
    };
    const timer = setTimeout(checkEmail, 500);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [email]);

  // ✅ Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  // ✅ Validate password and set errors
  useEffect(() => {
    const errors: string[] = [];

    if (newPassword) {
      if (newPassword.length < 8) {
        errors.push("პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს");
      }
      if (!/(?=.*[A-Z])/.test(newPassword)) {
        errors.push("პაროლი უნდა შეიცავდეს მინიმუმ 1 დიდ ასოს");
      }
      if (!/(?=.*\d)/.test(newPassword)) {
        errors.push("პაროლი უნდა შეიცავდეს მინიმუმ 1 ციფრს");
      }
    }

    setPasswordErrors(errors);
  }, [newPassword]);

  // ✅ Request OTP
  const handleRequestOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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

  // ✅ Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      const errorMsg = "გთხოვთ, შეიყვანოთ ერთჯერადი კოდი";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      if (!res.ok) {
        const data: VerifyOtpResponse = await res.json();
        throw new Error(data.message || "OTP invalid");
      }
      setOtpVerified(true);
      toast.success("კოდი დადასტურებულია! შეგიძლიათ შეცვალოთ პაროლი");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset Password
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      const errorMsg = "პაროლები არ ემთხვევა ერთმანეთს";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (!isValidPassword(newPassword)) {
      const errorMsg = "გთხოვთ, შეიყვანოთ ძლიერი პაროლი";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data: ResetPasswordResponse = await res.json();
      if (!res.ok) throw new Error(data.message);

      // ✅ Show modal instead of alert
      setShowModal(true);
      toast.success("პაროლი წარმატებით შეიცვალა!");

      // Reset form
      setOtpRequested(false);
      setOtpVerified(false);
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setEmail("");
      setIsValidEmail(false);
      setPasswordErrors([]);
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
    (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  // ✅ Close modal and go to login
  const handleCloseModal = () => {
    setShowModal(false);
    router.push("/login");
  };

  return (
    <div className="h-screen flex px-4 sm:px-6 lg:px-[44px] w-full gap-6 2xl:px-[152px] 2xl:gap-[44px]">
      <div className="pt-8 flex flex-col mx-auto w-full lg:w-[65%] xl:w-1/2 h-screen overflow-y-auto hide-scrollbar">
        <LoginRegisterContentHeader />
        <LoginRegisterContentTitle title="პაროლის აღდგენა" />

        {error && <p className="text-red-500 mb-2">{error}</p>}

        {/* Step 1 + 2: Email & OTP */}
        {!otpVerified && (
          <>
            <div className="mt-6">
              <LoginRegisterContentInput
                placeholder="ელ.ფოსტა"
                type="email"
                value={email}
                onChange={handleChange(setEmail)}
              />
            </div>
            {otpRequested && (
              <div className="mt-4">
                {/* OTP input with resend button */}
                <div className="relative">
                  <LoginRegisterContentInput
                    placeholder="ერთჯერადი კოდი"
                    type="text"
                    value={otp}
                    onChange={handleChange(setOtp)}
                  />

                  {/* show resend button only when countdown is 0 */}
                  {countdown === 0 && (
                    <button
                      disabled={loading}
                      onClick={handleRequestOtp}
                      className="absolute top-1/2 right-3 -translate-y-1/2 px-3 py-1 rounded text-xs font-helveticaneue-medium bg-[#FFD52A] text-[#0C0F21]"
                    >
                      გაგზავნა
                    </button>
                  )}
                </div>

                {/* resend info text */}
                <div className="text-sm text-gray-500 mt-2">
                  {countdown > 0 ? (
                    <div className="flex flex-col gap-2">
                      <span
                        className="text-center text-sm leading-5 text-[#0C0F21] font-helveticaneue-medium font-bold
            xl:text-base xl:leading-6"
                      >
                        ხელახლა გაგზავნა
                      </span>
                      <span className="text-center text-xs leading-4 font-helveticaneue-regular text-[#737373] lg:text-sm lg:leading-5">
                        ხელახლა გაგზავნა შესაძლებელია {countdown} წამში
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <span className="text-center text-xs leading-4 font-helveticaneue-regular text-[#737373] lg:text-sm lg:leading-5">
                        შეგიძლიათ ისევ გამოგზავნოთ კოდი
                      </span>
                    </div>
                  )}
                </div>

                {/* OTP validate button */}
                <button
                  disabled={loading}
                  onClick={handleVerifyOtp}
                  className="mt-4 py-4 w-full rounded-[40px] text-sm leading-5 text-[#0C0F21] font-helveticaneue-medium bg-[#FFD52A]"
                >
                  {loading ? "მიმდინარეობს..." : "ერთჯერადი კოდის ვალიდაცია"}
                </button>
              </div>
            )}

            {!otpRequested && (
              <button
                disabled={!isValidEmail || loading || countdown > 0}
                onClick={handleRequestOtp}
                className={`py-4 w-full rounded-[40px] text-sm font-helveticaneue-medium mt-4 ${
                  isValidEmail && countdown === 0
                    ? "bg-[#FFD52A] text-[#0C0F21] cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading
                  ? "გაგზავნა..."
                  : countdown > 0
                  ? `გთხოვთ, დაელოდოთ ${countdown}s`
                  : "კოდის მიღება"}
              </button>
            )}
          </>
        )}

        {/* Step 3: New Passwords */}
        {otpVerified && (
          <>
            <div className="flex flex-col mt-6 gap-[20px] sm:gap-3">
              <div>
                <LoginRegisterContentInputPassword
                  placeholder="ახალი პაროლი"
                  value={newPassword}
                  onChange={handleChange(setNewPassword)}
                />
                {/* Password requirements */}
                {newPassword && (
                  <div className="mt-2 space-y-1">
                    {passwordErrors.map((error, index) => (
                      <p key={index} className="text-red-500 text-xs">
                        • {error}
                      </p>
                    ))}
                    {passwordErrors.length === 0 && (
                      <p className="text-green-500 text-xs">
                        ✓ პაროლი აკმაყოფილებს ყველა მოთხოვნას
                      </p>
                    )}
                  </div>
                )}
                {!newPassword && (
                  <div className="mt-2 space-y-1">
                    <p className="text-gray-500 text-xs">• მინიმუმ 8 სიმბოლო</p>
                    <p className="text-gray-500 text-xs">
                      • მინიმუმ 1 დიდი ასო
                    </p>
                    <p className="text-gray-500 text-xs">• მინიმუმ 1 ციფრი</p>
                  </div>
                )}
              </div>

              <LoginRegisterContentInputPassword
                placeholder="გაიმეორეთ ახალი პაროლი"
                value={confirmPassword}
                onChange={handleChange(setConfirmPassword)}
              />
              {/* Password match indicator */}
              {confirmPassword && (
                <div className="mt-1">
                  {newPassword === confirmPassword ? (
                    <p className="text-green-500 text-xs">
                      ✓ პაროლები ემთხვევა
                    </p>
                  ) : (
                    <p className="text-red-500 text-xs">
                      ✗ პაროლები არ ემთხვევა
                    </p>
                  )}
                </div>
              )}
            </div>
            <button
              disabled={
                loading ||
                !isValidPassword(newPassword) ||
                newPassword !== confirmPassword
              }
              onClick={handleResetPassword}
              className={`mt-6 py-4 w-full rounded-[40px] text-sm leading-5 text-[#0C0F21] font-helveticaneue-medium ${
                isValidPassword(newPassword) && newPassword === confirmPassword
                  ? "bg-[#FFD52A] cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } xl:text-base xl:leading-6`}
            >
              {loading ? "მიმდინარეობს..." : "პაროლის შეცვლა"}
            </button>
          </>
        )}
      </div>
      <hr className="hidden lg:block w-px h-full bg-[#E5E5E5]" />
      <SpinContent />

      {/* ✅ Success Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 "
          onClick={handleCloseModal}
        >
          <div className="bg-white px-6 py-[34px] sm:py-[52px] rounded-2xl shadow-lg w-[90%] max-w-md flex flex-col items-center justify-center text-center gap-4">
            {/* Green Circle */}
            <div className="bg-[#66D95D] p-[10px] rounded-full flex justify-center items-center">
              <Check className="text-white w-6 h-6 2xl:w-[44px] 2xl:h-[44px]" />
            </div>

            {/* Text */}
            <div className="flex flex-col gap-2 items-center">
              <span
                className="font-helveticaneue-medium font-bold text-sm leading-5 text-[#0C0F21]
              2xl:text-base 2xl:leading-6"
              >
                პაროლი შეიცვალა
              </span>
              <p
                className="font-helveticaneue-regular text-xs leading-4 text-[#737373]
              sm:text-sm sm:leading-5 sm:max-w-[299px]"
              >
                ყველაფერი წესრიგშია, თქვენი პაროლი განახლებულია
              </p>
            </div>

            <button
              onClick={handleCloseModal}
              className="mt-5 w-full bg-[#FFD52A] py-3 rounded-[40px] text-[#0C0F21] font-helveticaneue-medium
              text-sm leading-5 sm:text-base sm:leading-6"
            >
              გასაგებია
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordRecieve;
