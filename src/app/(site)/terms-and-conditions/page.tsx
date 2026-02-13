import Link from "next/link";
import { Evectus } from "../../../../components/ui/Icons";

export const TermsAndConditions = () => {
  return (
    <div className="w-full bg-linear-to-b from-white to-[#F9FAFB] min-h-screen py-6 sm:py-10">
      {/* Header */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <Evectus />
          <span className="text-2xl xl:text-[32px] font-freeman-regular text-[#0D0D0D]">
            Evectus
          </span>
        </Link>
        <span className="font-lgvanastasia-regular text-3xl sm:text-4xl text-[#0D0D0D] leading-[100%] text-center">
          გამოყენების პირობები
        </span>
      </div>

      {/* Divider */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12 mt-6 sm:mt-8">
        <hr className="border-[#EBEBEB]" />
      </div>

      {/* Content */}
      <div className="max-w-[1000px] mx-auto mt-10 sm:mt-14 px-4 sm:px-6 lg:px-8 bg-white shadow-md rounded-3xl py-8 sm:py-10">
        <ul className="list-disc pl-5 sm:pl-8 space-y-6 text-[#0D0D0D] font-helveticaneue-medium leading-7 text-base sm:text-lg">
          <li>
            <strong className="text-[#4444FF]">
              Evectus – გამოყენების წესები და პირობები
            </strong>{" "}
            <br />
            <span className="text-sm text-[#666]">
              ბოლო განახლება: 2025 წლის ნოემბერი
            </span>
          </li>

          <li>
            <strong className="text-[#4444FF]">1. შესავალი:</strong>{" "}
            მოგესალმებით Evectus პლატფორმაზე. Evectus წარმოადგენს ონლაინ
            საგანმანათლებლო პლატფორმას, რომელიც აერთიანებს მომხმარებლებსა და
            მასწავლებლებს, რომლებიც სთავაზობენ ცოდნისა და უნარების განვითარების
            კურსებს ონლაინ ფორმატში („პლატფორმა“). Evectus-ის ვებსაიტის ან
            პლატფორმის გამოყენებით, თქვენ ადასტურებთ, რომ ხართ სრულწლოვანი,
            გაეცანით და ეთანხმებით მოცემულ წესებსა და პირობებს („წესები“) და რომ
            დაემორჩილებით მათ. ჩვენი პლატფორმის გამოყენება ასევე რეგულირდება
            პირადულობის პოლიტიკით, რომელიც წარმოადგენს ამ წესების განუყოფელ
            ნაწილს.
          </li>

          <li>
            <strong className="text-[#4444FF]">
              2. შეთანხმება და სამართლებრივი ურთიერთობა:
            </strong>{" "}
            ამ წესებით განისაზღვრება თქვენი და Evectus-ის შორის სამართლებრივი
            ურთიერთობა. პლატფორმის გამოყენებით თქვენ დებთ სამართლებრივ
            შეთანხმებას Evectus-თან და ადასტურებთ, რომ წაიკითხეთ და მიიღეთ ეს
            პირობები. თუ არ ეთანხმებით პირობებს, გთხოვთ, შეწყვიტოთ ვებსაიტის ან
            პლატფორმის გამოყენება.
          </li>

          <li>
            <strong className="text-[#4444FF]">
              3. კონფიდენციალურობის პოლიტიკა:
            </strong>{" "}
            Evectus პატივს სცემს თქვენი მონაცემების დაცვას. თქვენი პლატფორმით
            სარგებლობა ექვემდებარება ჩვენს პირადულობის პოლიტიკას, სადაც
            განმარტებულია, როგორ ვაგროვებთ, ვინახავთ და ვიყენებთ თქვენს
            მონაცემებს.
          </li>

          <li>
            <strong className="text-[#4444FF]">
              4. პლატფორმის გამოყენება:
            </strong>{" "}
            თქვენ ხართ პასუხისმგებელი Evectus-ის ვებსაიტზე ან აპლიკაციაზე
            შესვლისთვის საჭირო ყველა ტექნიკური საშუალების და ინტერნეტთან
            კავშირის უზრუნველყოფაზე. Evectus ახორციელებს განახლებებს
            მომხმარებლის გამოცდილების გასაუმჯობესებლად. პლატფორმა ხელმისაწვდომია
            პრინციპით „როგორც არის“ ყოველგვარი გარანტიის გარეშე.
          </li>

          <li>
            <strong className="text-[#4444FF]">
              5. ანგარიში და უსაფრთხოება:
            </strong>{" "}
            რეგისტრაციისას საჭიროა შექმნათ ანგარიში და მიაწოდოთ ზუსტი
            ინფორმაცია. თქვენ ხართ პასუხისმგებელი თქვენი პაროლის უსაფრთხოებაზე
            და ვალდებული ხართ არ გაავრცელოთ იგი მესამე პირებთან. დარღვევის
            შემთხვევაში დაუყოვნებლივ შეგვატყობინეთ ელფოსტით{" "}
            <a
              href="mailto:info@evectus.ge"
              className="text-[#4444FF] underline hover:text-[#2222FF]"
            >
              info@evectus.ge
            </a>
            .
          </li>

          <li>
            <strong className="text-[#4444FF]">
              6. ინტელექტუალური საკუთრება:
            </strong>{" "}
            Evectus ფლობს ან აქვს ლიცენზია ყველა ტექსტზე, გრაფიკაზე, ვიდეოზე,
            ლოგოზე, სურათზე, პროგრამულ უზრუნველყოფასა და სხვა მასალებზე
            („კონტენტი“). მათი გამოყენება Evectus-ის წერილობითი თანხმობის გარეშე
            აკრძალულია.
          </li>

          <li>
            <strong className="text-[#4444FF]">
              7. პასუხისმგებლობის შეზღუდვა:
            </strong>{" "}
            Evectus არ აგებს პასუხს ნებისმიერი პირდაპირი ან ირიბი ზიანისათვის,
            რომელიც შეიძლება წარმოიშვას პლატფორმის გამოყენების შედეგად.
            მომხმარებელი იყენებს Evectus-ს საკუთარი პასუხისმგებლობით.
          </li>

          <li>
            <strong className="text-[#4444FF]">
              8. კომპენსაცია და ვალდებულებები:
            </strong>{" "}
            თქვენ ეთანხმებით, რომ დაიცავთ და აანაზღაურებთ Evectus-ს ყველა ზიანსა
            და დანახარჯს, რომლებიც წარმოიშობა თქვენი ქმედებების ან წესების
            დარღვევის შედეგად.
          </li>

          <li>
            <strong className="text-[#4444FF]">9. ცვლილებები პირობებში:</strong>{" "}
            Evectus იტოვებს უფლებას შეცვალოს ეს პირობები ნებისმიერ დროს. ყველა
            ცვლილება გამოქვეყნდება ვებსაიტზე, და განახლებული პირობების მიღება
            ნიშნავს, რომ თქვენ ეთანხმებით ცვლილებებს.
          </li>

          <li>
            <strong className="text-[#4444FF]">
              10. მოქმედი სამართალი და დავების გადაწყვეტა:
            </strong>{" "}
            ეს პირობები რეგულირდება საქართველოს კანონმდებლობით. ყველა დავა
            განიხილება თბილისის შესაბამის სასამართლოებში.
          </li>

          <li>
            <strong className="text-[#4444FF]">
              11. კონტაქტის ინფორმაცია:
            </strong>{" "}
            📍 თბილისი, საქართველო 📧{" "}
            <a
              href="mailto:info@evectus.ge"
              className="text-[#4444FF] underline hover:text-[#2222FF] transition-colors"
            >
              info@evectus.ge
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TermsAndConditions;
