import { GRADES, inputClass, selectClass, selectStyle } from './formStyles';
import type { ParentFormState } from '../model/types';

interface Props {
  value: ParentFormState;
  onChange: (next: ParentFormState) => void;
}

export function ParentForm({ value, onChange }: Props) {
  const set = <K extends keyof ParentFormState>(key: K, val: ParentFormState[K]) =>
    onChange({ ...value, [key]: val });

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
            value={value.nameLastKo}
            onChange={(e) => set('nameLastKo', e.target.value)}
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
            value={value.nameFirstKo}
            onChange={(e) => set('nameFirstKo', e.target.value)}
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
          value={value.phone}
          onChange={(e) => set('phone', e.target.value)}
          className={inputClass}
        />
        <label className="flex items-start gap-2 mt-1 cursor-pointer">
          <input
            type="checkbox"
            checked={value.phoneConsent}
            onChange={(e) => set('phoneConsent', e.target.checked)}
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
            value={value.childNameLastKo}
            onChange={(e) => set('childNameLastKo', e.target.value)}
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
            value={value.childNameFirstKo}
            onChange={(e) => set('childNameFirstKo', e.target.value)}
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
          value={value.childGrade}
          onChange={(e) => set('childGrade', e.target.value)}
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
