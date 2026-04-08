import { GRADES, inputClass, selectClass, selectStyle } from "./formStyles";

interface Props {
  nameKo: string;
  nameEn: string;
  grade: string;
  onChangeNameKo: (v: string) => void;
  onChangeNameEn: (v: string) => void;
  onChangeGrade: (v: string) => void;
}

export function StudentForm({ nameKo, nameEn, grade, onChangeNameKo, onChangeNameEn, onChangeGrade }: Props) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-on-surface">
          한글 이름 <span className="text-error">*</span>
        </label>
        <input
          type="text"
          placeholder="한글 이름을 입력해주세요"
          value={nameKo}
          onChange={(e) => onChangeNameKo(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-on-surface">
          영어 이름 <span className="text-error">*</span>
        </label>
        <input
          type="text"
          placeholder="영어 이름을 입력해주세요"
          value={nameEn}
          onChange={(e) => onChangeNameEn(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-on-surface">
          학년 <span className="text-error">*</span>
        </label>
        <select
          value={grade}
          onChange={(e) => onChangeGrade(e.target.value)}
          className={selectClass}
          style={selectStyle}
        >
          <option value="" disabled>학년을 선택해주세요</option>
          {GRADES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
    </>
  );
}
