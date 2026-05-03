import { GRADES, inputClass, selectClass, selectStyle } from './formStyles';
import type { StudentFormState } from '../model/types';

interface Props {
  value: StudentFormState;
  onChange: (next: StudentFormState) => void;
}

export function StudentForm({ value, onChange }: Props) {
  const set = <K extends keyof StudentFormState>(key: K, val: StudentFormState[K]) =>
    onChange({ ...value, [key]: val });

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-on-surface">
            한글 이름 <span className="text-error">*</span>
          </label>
          <input
            type="text"
            placeholder="예) 김민수"
            value={value.nameKo}
            onChange={(e) => set('nameKo', e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-on-surface">
            Last Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            placeholder="예) Kim"
            value={value.nameLastEn}
            onChange={(e) => set('nameLastEn', e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-on-surface">
            First Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            placeholder="예) Minsu"
            value={value.nameFirstEn}
            onChange={(e) => set('nameFirstEn', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-on-surface">
          학년 <span className="text-error">*</span>
        </label>
        <select
          value={value.grade}
          onChange={(e) => set('grade', Number(e.target.value))}
          className={selectClass}
          style={selectStyle}
        >
          <option value="" disabled>
            학년을 선택해주세요
          </option>
          {GRADES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
