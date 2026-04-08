import { inputClass } from "./formStyles";

interface Props {
  name: string;
  nameEn: string;
  onChangeName: (v: string) => void;
  onChangeNameEn: (v: string) => void;
}

export function TeacherForm({ name, nameEn, onChangeName, onChangeNameEn }: Props) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-on-surface">
          이름 <span className="text-error">*</span>
        </label>
        <input
          type="text"
          placeholder="이름을 입력해주세요"
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-on-surface">
          영어 이름
        </label>
        <input
          type="text"
          placeholder="영어 이름을 입력해주세요"
          value={nameEn}
          onChange={(e) => onChangeNameEn(e.target.value)}
          className={inputClass}
        />
      </div>
    </>
  );
}
