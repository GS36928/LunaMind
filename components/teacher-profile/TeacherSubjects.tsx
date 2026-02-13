interface Subject {
  id: string;
  name: string;
  price: number;
}

interface TeacherSubjectsProps {
  subjects: Subject[];
}

const TeacherSubjects = ({ subjects }: TeacherSubjectsProps) => {
  if (subjects.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-5">
      <span className="text-sm leading-5 text-[#737373] font-helveticaneue-regular">
        საგნები
      </span>
      <ul className="mt-5 grid grid-cols-1 gap-2">
        {subjects.map((subject) => (
          <li key={subject.id} className="bg-[#0077FF1A] rounded-[40px] p-3">
            <span className="text-[#0077FF] text-sm leading-5 font-helveticaneue-regular">
              {subject.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeacherSubjects;
