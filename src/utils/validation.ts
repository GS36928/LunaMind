export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const isValidPassword = (password: string) => {
  // მინიმუმ 8 სიმბოლო, ერთი დიდი ასო, ერთი ციფრი
  return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
};
// ტელეფონის ვალიდაცია: მხოლოდ ციფრები, 9-15 სიმბოლო
export const isValidPhone = (phone: string) => /^[0-9]{9,15}$/.test(phone);

export const fullNameRegex = /^[ა-ჰ]{3,}\s[ა-ჰ]{3,}$/;
