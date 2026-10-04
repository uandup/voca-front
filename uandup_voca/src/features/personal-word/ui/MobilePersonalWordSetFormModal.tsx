import { useState } from 'react';
import type { PersonalWordSetRow } from '@/entities/personal-word-set';
import { usePersonalWordSetActions } from '../model/usePersonalWordSetActions';
import { MobileModalShell, MobileTextField } from './MobileModalShell';

interface Props {
  studentId: number;
  // 넘기면 이름 변경, 없으면 새 세트 생성.
  target?: PersonalWordSetRow;
  onClose: () => void;
}

// 데스크탑 PersonalWordSetFormModal과 **같은 검증 규칙**을 쓴다.
// 서버가 같은 제약을 걸고 있고, 두 화면이 다른 메시지를 내면 학생이 폰에서 본 문구와
// 선생님이 데스크탑에서 본 문구가 어긋나 설명이 안 된다.
const MAX_NAME_LENGTH = 50;

// 폰용 세트 생성·이름변경 모달. 필드가 이름 하나뿐이라 생성과 수정이 같은 폼을 쓴다.
export function MobilePersonalWordSetFormModal({ studentId, target, onClose }: Props) {
  const { create, rename } = usePersonalWordSetActions(studentId);
  const mutation = target ? rename : create;

  const [name, setName] = useState(target?.name ?? '');
  const [submitted, setSubmitted] = useState(false);
  const [failed, setFailed] = useState(false);

  const trimmed = name.trim();
  const error =
    trimmed === ''
      ? 'Set name is required.'
      : trimmed.length > MAX_NAME_LENGTH
        ? `Set name must be ${MAX_NAME_LENGTH} characters or fewer.`
        : '';

  function handleSave() {
    setSubmitted(true);
    if (error) return;
    setFailed(false);
    // 실패하면 모달을 닫지 않는다 — 폰은 지하철·엘리베이터에서 요청이 그냥 죽는다.
    // 닫아버리면 방금 입력한 이름이 사라져 처음부터 다시 쳐야 한다.
    const options = { onSuccess: onClose, onError: () => setFailed(true) };
    if (target) {
      rename.mutate({ id: target.id, data: { name } }, options);
    } else {
      create.mutate({ name }, options);
    }
  }

  return (
    <MobileModalShell title={target ? 'Rename set' : 'New word set'} onClose={onClose}>
      <div className="space-y-4">
        <MobileTextField
          label="Set name"
          value={name}
          onChange={setName}
          placeholder="e.g. Sep 13 TOEIC Words"
          error={submitted ? error : ''}
          autoFocus
          onEnter={handleSave}
        />

        {failed && (
          <p className="text-xs text-error">Could not save. Check your connection and try again.</p>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={mutation.isPending}
          className="w-full min-h-12 rounded-xl bg-primary text-white text-sm font-bold touch-manipulation disabled:opacity-60"
        >
          {mutation.isPending ? 'Saving...' : target ? 'Save name' : 'Create set'}
        </button>
      </div>
    </MobileModalShell>
  );
}
