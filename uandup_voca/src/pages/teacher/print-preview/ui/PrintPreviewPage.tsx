import { useState } from 'react';
import { TestWMSPrintModal, TestESPrintModal, type ESRow } from '@/shared/test-print';
import { mockVocabList, mockESRows } from '@/shared/test-print/lib/mockData';

const ES_ROWS: ESRow[] = Array.from({ length: 15 }, (_, i) => ({
  no: String(i + 1).padStart(2, '0'),
  sentence: '',
}));

type ModalType = 'WMS' | 'ES' | 'TEST_WMS' | 'TEST_ES' | null;

const previews = [
  {
    type: 'WMS' as const,
    title: 'Word + Meaning + Synonym',
    description: '단어, 뜻, 동의어를 작성하는 시험지',
    icon: 'description',
  },
  {
    type: 'ES' as const,
    title: 'Example Sentence',
    description: '빈칸 채우기 예문 시험지',
    icon: 'edit_note',
  },
];

export function PrintPreviewPage() {
  const [openModal, setOpenModal] = useState<ModalType>(null);

  return (
    <main>
      <header className="mb-10">
        <h1 className="font-headline font-extrabold text-4xl text-primary tracking-tight mb-2">
          Print Preview
        </h1>
        <p className="text-on-surface-variant font-medium">
          시험지 양식을 미리보기위한 임시 페이지입니다.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="font-headline font-bold text-lg text-primary mb-4">Print Test (목데이터)</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setOpenModal('TEST_WMS')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/80 transition-colors"
          >
            <span className="material-symbols-outlined text-base">description</span>
            단어 시험 WMS (50개)
          </button>
          <button
            onClick={() => setOpenModal('TEST_ES')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/80 transition-colors"
          >
            <span className="material-symbols-outlined text-base">edit_note</span>
            예문 시험 (30개)
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {previews.map((item) => (
          <button
            key={item.type}
            onClick={() => setOpenModal(item.type)}
            className="group text-left bg-surface-container-lowest border border-primary/5 rounded-xl p-8 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all text-primary">
              <span className="material-symbols-outlined text-2xl">{item.icon}</span>
            </div>
            <h2 className="font-headline font-bold text-lg text-primary-container mb-2">
              {item.title}
            </h2>
            <p className="text-sm text-on-surface-variant">{item.description}</p>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-primary group-hover:gap-3 transition-all">
              <span>미리보기</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </button>
        ))}
      </div>

      {openModal === 'WMS' && (
        <TestWMSPrintModal onClose={() => setOpenModal(null)} rows={mockVocabList} />
      )}
      {openModal === 'ES' && <TestESPrintModal onClose={() => setOpenModal(null)} rows={ES_ROWS} />}
      {openModal === 'TEST_WMS' && (
        <TestWMSPrintModal onClose={() => setOpenModal(null)} rows={mockVocabList} />
      )}
      {openModal === 'TEST_ES' && (
        <TestESPrintModal onClose={() => setOpenModal(null)} rows={mockESRows} />
      )}
    </main>
  );
}
