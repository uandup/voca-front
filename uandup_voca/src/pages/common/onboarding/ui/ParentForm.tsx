import { inputClass, inputBaseClass, selectBaseClass, selectStyle } from './formStyles';
import type { ParentFormState, ChildFormEntry } from '../model/types';
import { GRADES } from '@/entities/member';
import type { StudentGrade } from '@/entities/member';

interface Props {
  value: ParentFormState;
  onChange: (next: ParentFormState) => void;
}

export function ParentForm({ value, onChange }: Props) {
  const set = <K extends keyof ParentFormState>(key: K, val: ParentFormState[K]) =>
    onChange({ ...value, [key]: val });

  // 자녀 행 단위 수정 — 해당 인덱스만 교체한 새 배열로 갱신한다.
  const setChild = (index: number, patch: Partial<ChildFormEntry>) =>
    set(
      'children',
      value.children.map((c, i) => (i === index ? { ...c, ...patch } : c)),
    );

  const addChild = () => set('children', [...value.children, { nameKo: '', grade: 1 }]);

  // 자녀는 최소 1명이어야 하므로 마지막 1개는 삭제 불가.
  const removeChild = (index: number) =>
    set(
      'children',
      value.children.filter((_, i) => i !== index),
    );

  return (
    <>
      {/* 학부모 성함 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-on-surface">
          한글 이름 <span className="text-error">*</span>
        </label>
        <input
          type="text"
          placeholder="예) 김영희"
          value={value.nameKo}
          onChange={(e) => set('nameKo', e.target.value.replace(/\s/g, ''))}
          className={inputClass}
        />
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
          onChange={(e) => set('phone', e.target.value.replace(/\D/g, ''))}
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

      {/* 자녀 정보 — 여러 명 입력 가능 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-on-surface">
          자녀 정보 <span className="text-error">*</span>
        </label>

        {value.children.map((child, index) => (
          <div key={index} className="flex gap-2">
            {/* flex 행에서는 w-full이 빠진 base 클래스를 쓴다 — w-full과 flex-1/w-28이 충돌하면
                너비 계산이 깨져 행이 부모 폭을 넘어간다. min-w-0으로 input의 flex 축소도 허용. */}
            <input
              type="text"
              placeholder="예) 김민수"
              value={child.nameKo}
              onChange={(e) => setChild(index, { nameKo: e.target.value.replace(/\s/g, '') })}
              className={`${inputBaseClass} flex-1 min-w-0`}
            />
            <select
              value={child.grade}
              onChange={(e) => setChild(index, { grade: Number(e.target.value) as StudentGrade })}
              className={`${selectBaseClass} w-28 shrink-0`}
              style={selectStyle}
            >
              {GRADES.map((g) => (
                <option key={g} value={g}>
                  Grade {g}
                </option>
              ))}
            </select>
            {/* 자녀는 최소 1명 — 행이 2개 이상일 때만 삭제 버튼을 노출한다. */}
            {value.children.length > 1 && (
              <button
                type="button"
                onClick={() => removeChild(index)}
                aria-label="자녀 삭제"
                className="shrink-0 px-2 rounded-lg leading-none text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addChild}
          className="self-start flex items-center gap-1 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
        >
          <span className="material-symbols-outlined text-base">add</span>
          자녀 추가
        </button>
      </div>
    </>
  );
}
