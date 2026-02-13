import Image from "next/image";
import React, { useState, useRef } from "react";
import {
  AddPlusCircle,
  CaretCircleRight,
  CircleWarning,
  CreditCard01,
} from "react-coolicons";
import { useClickOutside } from "@/hooks/useClickOutside";

// This component is for FUTURE use - currently shows "No cards" message
// When payment system is integrated, this will display real user cards

const CardBox = () => {
  // TODO: Replace with real card data from database when ready
  return null; // Removed hardcoded data
};

const Banks = ({
  img,
  alt,
  desc,
}: {
  img?: string;
  alt?: string;
  desc: string;
}) => {
  return (
    <div className="p-[18px] border border-[#F1F1F1] rounded-2xl cursor-pointer flex items-center justify-between">
      <div className="flex gap-3 items-center">
        {img && alt && <Image src={img} width={23} height={20} alt={alt} />}
        <span className="text-sm leading-5 text-[#080808] font-helveticaneue-medium">
          {desc}
        </span>
      </div>
      <CaretCircleRight color="#737373" width={24} height={24} />
    </div>
  );
};

const AddCardModal = ({ onClose }: { onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(modalRef, onClose);

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-[#00000099]">
      <div
        ref={modalRef}
        className="relative w-full lg:max-w-lg  bg-white max-h-[80vh] rounded-t-2xl lg:rounded-2xl"
      >
        <div className="p-5">
          <h2 className="text-base leading-6 text-black font-helveticaneue-medium font-bold!">
            ბარათის დამატება
          </h2>
        </div>

        <hr className="text-[#EBECF0]" />

        <div className="px-5 pt-5 py-4 flex flex-col gap-3">
          <Banks
            img="/images/bog.png"
            alt="საქართველოს ბანკი"
            desc="საქართველოს ბანკი"
          />
          <Banks img="/images/tbc.png" alt="თიბისი ბანკი" desc="თიბისი ბანკი" />
          <Banks desc="სხვა ბანკები" />
        </div>

        <div className="px-5 pb-5">
          <button
            className="bg-[#EBECF0] w-full rounded-[50px] py-4 text-sm leading-5 text-[#080808] font-helveticaneue-medium cursor-pointer"
            onClick={onClose}
          >
            დახურვა
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-black text-lg font-bold cursor-pointer"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const AddNewCard = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="flex justify-center items-center gap-2 py-6 w-full border border-[#D9D9D9] border-dashed rounded-xl sm:w-1/2 xl:w-[343px] cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <AddPlusCircle />
      <span className="text-xs leading-4 text-[#080808] font-helveticaneue-medium">
        ახალი ბარათის დამატება
      </span>
    </div>
  );
};

const Card = () => {
  const [showAddCardModal, setShowAddCardModal] = useState(false);

  // TODO: Fetch real cards from database when payment system is ready
  const hasCards = false; // Will be true when user has cards

  return (
    <div className="mt-4 flex flex-col gap-4">
      {hasCards ? (
        <div className="flex flex-col gap-4 sm:flex-row">
          <CardBox />
          <AddNewCard onClick={() => setShowAddCardModal(true)} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 border border-[#F1F1F1] rounded-xl">
          <CreditCard01 className="text-[#737373] mb-4" width={48} height={48} />
          <p className="text-sm leading-5 text-[#737373] font-helveticaneue-medium mb-4">
            თქვენ ჯერ არ გაქვთ დამატებული ბარათები
          </p>
          <button
            onClick={() => setShowAddCardModal(true)}
            className="bg-[#F0C514] text-[#080808] px-6 py-3 rounded-[50px] text-sm font-helveticaneue-medium hover:bg-[#d4ad11] transition-colors"
          >
            ბარათის დამატება
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3 items-center">
        <CircleWarning className="text-[#737373]" />
        <span className="text-sm leading-5 font-helveticaneue-regular text-[#737373] text-center">
          ევექტუსი თქვენს ბარათს არ იყენებს პირადი მოხმარებისთვის და მისი ხილვა
          ჩვენთვის შეუძლებელია. ბარათის მონაცემები გამოყენებული იქნება მხოლოდ
          თქვენი ინფორმაციისთვის რომ გადახდა ან თანხის ჩარიცხვა მოხდეს მარტივად
          და შეფერხების გარეშე
        </span>
      </div>

      {showAddCardModal && (
        <AddCardModal onClose={() => setShowAddCardModal(false)} />
      )}
    </div>
  );
};

export default Card;
