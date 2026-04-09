import { inputClass } from "./formStyles";

interface Props {
  nameLastKo: string;
  nameFirstKo: string;
  nameLastEn: string;
  nameFirstEn: string;
  onChangeNameLastKo: (v: string) => void;
  onChangeNameFirstKo: (v: string) => void;
  onChangeNameLastEn: (v: string) => void;
  onChangeNameFirstEn: (v: string) => void;
}

export function TeacherForm({
  nameLastKo,
  nameFirstKo,
  nameLastEn,
  nameFirstEn,
  onChangeNameLastKo,
  onChangeNameFirstKo,
  onChangeNameLastEn,
  onChangeNameFirstEn,
}: Props) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-on-surface">
            성 (한글) <span className="text-error">*</span>
          </label>
          <input
            type="text"
            placeholder="예) 김"
            value={nameLastKo}
            onChange={(e) => onChangeNameLastKo(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-on-surface">
            이름 (한글) <span className="text-error">*</span>
          </label>
          <input
            type="text"
            placeholder="예) 민수"
            value={nameFirstKo}
            onChange={(e) => onChangeNameFirstKo(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-on-surface">
            Last Name
          </label>
          <input
            type="text"
            placeholder="예) Kim"
            value={nameLastEn}
            onChange={(e) => onChangeNameLastEn(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-on-surface">
            First Name
          </label>
          <input
            type="text"
            placeholder="예) Minsu"
            value={nameFirstEn}
            onChange={(e) => onChangeNameFirstEn(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    </>
  );
}
