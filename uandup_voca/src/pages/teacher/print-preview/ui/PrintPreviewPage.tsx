import { useState } from "react";
import { TestWMPrintModal, TestWMSPrintModal, TestESPrintModal } from "@/widgets/test-print";

type ModalType = "WM" | "WMS" | "ES" | null;

const previews = [
  {
    type: "WM" as const,
    title: "Word + Meaning",
    description: "단어와 뜻을 작성하는 시험지",
    icon: "article",
  },
  {
    type: "WMS" as const,
    title: "Word + Meaning + Synonym",
    description: "단어, 뜻, 동의어를 작성하는 시험지",
    icon: "description",
  },
  {
    type: "ES" as const,
    title: "Example Sentence",
    description: "빈칸 채우기 예문 시험지",
    icon: "edit_note",
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {previews.map((item) => (
          <button
            key={item.type}
            onClick={() => setOpenModal(item.type)}
            className="group text-left bg-surface-container-lowest border border-primary/5 rounded-xl p-8 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all text-primary">
              <span className="material-symbols-outlined text-2xl">
                {item.icon}
              </span>
            </div>
            <h2 className="font-headline font-bold text-lg text-primary-container mb-2">
              {item.title}
            </h2>
            <p className="text-sm text-on-surface-variant">
              {item.description}
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-primary group-hover:gap-3 transition-all">
              <span>미리보기</span>
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </div>
          </button>
        ))}
      </div>

      {openModal === "WM" && (
        <TestWMPrintModal onClose={() => setOpenModal(null)} />
      )}
      {openModal === "WMS" && (
        <TestWMSPrintModal onClose={() => setOpenModal(null)} />
      )}
      {openModal === "ES" && (
        <TestESPrintModal onClose={() => setOpenModal(null)} />
      )}
    </main>
  );
}
