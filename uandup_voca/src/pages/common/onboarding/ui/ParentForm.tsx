import { GRADES, inputClass, selectClass, selectStyle } from './formStyles';

interface Props {
  nameLastKo: string;
  nameFirstKo: string;
  phone: string;
  phoneConsent: boolean;
  childLastKo: string;
  childFirstKo: string;
  childGrade: string;
  onChangeNameLastKo: (v: string) => void;
  onChangeNameFirstKo: (v: string) => void;
  onChangePhone: (v: string) => void;
  onChangePhoneConsent: (v: boolean) => void;
  onChangeChildLastKo: (v: string) => void;
  onChangeChildFirstKo: (v: string) => void;
  onChangeChildGrade: (v: string) => void;
}

export function ParentForm({
  nameLastKo,
  nameFirstKo,
  phone,
  phoneConsent,
  childLastKo,
  childFirstKo,
  childGrade,
  onChangeNameLastKo,
  onChangeNameFirstKo,
  onChangePhone,
  onChangePhoneConsent,
  onChangeChildLastKo,
  onChangeChildFirstKo,
  onChangeChildGrade,
}: Props) {
  return (
    <>
      {/* 학부모 성함 */}
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
            placeholder="예) 영희"
            value={nameFirstKo}
            onChange={(e) => onChangeNameFirstKo(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* 연락처 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-on-surface">
          연락처 <span className="text-error">*</span>
        </label>
        <input
          type="tel"
          placeholder="연락처를 입력해주세요"
          value={phone}
          onChange={(e) => onChangePhone(e.target.value)}
          className={inputClass}
        />
        <label className="flex items-start gap-2 mt-1 cursor-pointer">
          <input
            type="checkbox"
            checked={phoneConsent}
            onChange={(e) => onChangePhoneConsent(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-primary shrink-0"
          />
          <span className="text-xs text-on-surface-variant leading-relaxed">
            연락처 수집 및 이용에 동의합니다.{' '}
            <span className="text-on-surface-variant/60">
              (수집된 연락처는 학원 서비스 안내 및 학생 관리 목적으로만 사용됩니다.)
            </span>
            <span className="text-error ml-1">*</span>
          </span>
        </label>
      </div>

      {/* 자녀 이름 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-on-surface">
            자녀 성 (한글 또는 영어) <span className="text-error">*</span>
          </label>
          <input
            type="text"
            placeholder="예) 김"
            value={childLastKo}
            onChange={(e) => onChangeChildLastKo(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-on-surface">
            자녀 이름 (한글 또는 영어) <span className="text-error">*</span>
          </label>
          <input
            type="text"
            placeholder="예) 민수"
            value={childFirstKo}
            onChange={(e) => onChangeChildFirstKo(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* 학생 학년 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-on-surface">
          학생 학년 <span className="text-error">*</span>
        </label>
        <select
          value={childGrade}
          onChange={(e) => onChangeChildGrade(e.target.value)}
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
