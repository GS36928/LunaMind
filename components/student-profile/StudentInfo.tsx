"use client";
import React, { useState, useRef, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import { emailRegex, isValidPhone, fullNameRegex } from "@/utils/validation";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  role: "STUDENT" | "TEACHER";
};

interface StudentInfoProps {
  user: User;
  fullName: string;
  setFullName: (val: string) => void;
}

const InputStudentInfo: React.FC<{
  value: string;
  onChange: (val: string) => void;
  onBlur?: () => void;
  placeholder?: string;
}> = ({ value, onChange, onBlur, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onBlur={onBlur}
    placeholder={placeholder}
    className="border border-[#F1F1F1] rounded-xl p-4 text-sm w-full focus:outline-none"
  />
);

const StudentInfo: React.FC<StudentInfoProps> = ({
  user,
  fullName,
  setFullName,
}) => {
  const [phone, setPhone] = useState(user.phoneNumber || "");
  const [email, setEmail] = useState(user.email || "");

  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const updateBackend = useCallback(
    async (field: string, value: string) => {
      const data: Record<string, unknown> = {};
      if (["firstName", "lastName", "email", "phoneNumber"].includes(field)) {
        data[field] = value;
      }
      try {
        await fetch("/api/students/updateProfile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, data }),
        });
      } catch (err) {
        console.error("Failed to update profile:", err);
      }
    },
    [user.id]
  );

  const debouncedUpdate = useCallback(
    (field: string, value: string, delay = 500) => {
      if (timersRef.current[field]) clearTimeout(timersRef.current[field]);
      timersRef.current[field] = setTimeout(
        () => updateBackend(field, value),
        delay
      );
    },
    [updateBackend]
  );

  const handlePhoneChange = (val: string) => {
    const filtered = val.replace(/\D/g, "");
    setPhone(filtered);
  };

  return (
    <div className="mt-4 flex flex-col gap-4">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{ className: "font-helveticaneue-medium" }}
      />

      <div className="flex flex-col gap-3 md:flex-row md:gap-4">
        <InputStudentInfo
          value={fullName}
          onChange={setFullName}
          onBlur={() => {
            if (!fullNameRegex.test(fullName)) {
              toast.error(
                "გთხოვთ შეიყვანოთ სახელი და გვარი მხოლოდ ქართულად (მინ. 3 ასო თითოეული)"
              );
            } else {
              const [firstName, ...last] = fullName.split(" ");
              debouncedUpdate("firstName", firstName || "");
              debouncedUpdate("lastName", last.join(" ") || "");
            }
          }}
          placeholder="სრული სახელი"
        />
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:gap-4">
        <InputStudentInfo
          value={phone}
          onChange={handlePhoneChange}
          onBlur={() => {
            if (!isValidPhone(phone)) {
              toast.error(
                "ტელეფონი უნდა შეიცავდეს მხოლოდ ციფრებს (9-15 ციფრი)"
              );
            } else {
              debouncedUpdate("phoneNumber", phone);
            }
          }}
          placeholder="ტელეფონის ნომერი"
        />
        <InputStudentInfo
          value={email}
          onChange={setEmail}
          onBlur={() => {
            if (!emailRegex.test(email)) {
              toast.error("გთხოვთ შეიყვანოთ ვალიდური ელ. ფოსტა");
            } else {
              debouncedUpdate("email", email);
            }
          }}
          placeholder="ელ. ფოსტა"
        />
      </div>
    </div>
  );
};

export default StudentInfo;
