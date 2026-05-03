import { inputClass } from './formStyles';
import type { TeacherFormState } from '../model/types';

interface Props {
  value: TeacherFormState;
  onChange: (next: TeacherFormState) => void;
}

export function TeacherForm({ value, onChange }: Props) {
  const set = <K extends keyof TeacherFormState>(key: K, val: TeacherFormState[K]) =>
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
          <label className="text-sm font-medium text-on-surface">Last Name</label>
          <input
            type="text"
            placeholder="예) Kim"
            value={value.nameLastEn}
            onChange={(e) => set('nameLastEn', e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-on-surface">First Name</label>
          <input
            type="text"
            placeholder="예) Minsu"
            value={value.nameFirstEn}
            onChange={(e) => set('nameFirstEn', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    </>
  );
}
