export interface UploadErrorEntry {
  word: string;
  message: string;
}

export interface UploadResult {
  attempted: number;
  successful: number;
  failed: number;
  errors: UploadErrorEntry[];
}

interface UploadExcelResultModalProps {
  result: UploadResult;
  onClose: () => void;
  onFinish: () => void;
  onDownloadErrors: () => void;
}

import { ModalBackdrop } from "@/shared/ui/ModalBackdrop";

export function UploadExcelResultModal({
  result,
  onClose,
  onFinish,
  onDownloadErrors,
}: UploadExcelResultModalProps) {
  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white w-full max-w-180 rounded-3xl shadow-[0px_32px_64px_-12px_rgba(0,21,80,0.12)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 pb-6 flex justify-between items-start">
          <div className="flex items-start gap-4">
            <div className="bg-primary/5 p-3 rounded-2xl">
              <span className="material-symbols-outlined text-primary text-3xl">
                upload_file
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-primary font-headline leading-tight">
                Upload Summary
              </h2>
              <p className="text-on-surface-variant mt-1 text-sm font-medium">
                Excel file processing complete. Review the results below.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant/40 hover:text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-all"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 mx-8 mb-8 border border-surface-container rounded-2xl overflow-hidden divide-x divide-surface-container">
          <div className="px-6 py-8 text-center bg-white">
            <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] mb-2 opacity-70">
              Attempted
            </div>
            <div className="text-4xl font-extrabold text-primary font-headline tracking-tight">
              {result.attempted}
            </div>
          </div>
          <div className="px-6 py-8 text-center bg-primary/[0.02]">
            <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] mb-2 opacity-70">
              Successful
            </div>
            <div className="text-4xl font-extrabold text-primary font-headline tracking-tight">
              {result.successful}
            </div>
          </div>
          <div className="px-6 py-8 text-center bg-error-container/[0.05]">
            <div className="text-[10px] font-bold text-error uppercase tracking-[0.15em] mb-2">
              Failed
            </div>
            <div className="text-4xl font-extrabold text-error font-headline tracking-tight">
              {result.failed}
            </div>
          </div>
        </div>

        {/* Detailed Error Log */}
        {result.errors.length > 0 && (
          <div className="flex-1 overflow-y-auto px-8 pb-8 flex flex-col">
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pt-2 pb-2">
              <h3 className="font-bold text-primary text-base">
                Detailed Error Log
              </h3>
              <span className="bg-error text-white px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider">
                Critical Review Required
              </span>
            </div>
            <div className="space-y-3">
              {result.errors.map((entry, i) => (
                <div
                  key={i}
                  className="bg-surface-container-low/50 hover:bg-surface-container-low p-4 rounded-2xl border border-surface-container flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="font-extrabold text-on-surface font-headline text-base">
                      {entry.word}
                    </div>
                    <div className="text-xs text-on-surface-variant mt-0.5">
                      {entry.message}
                    </div>
                  </div>
                  <span
                    className="material-symbols-outlined text-error text-2xl"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    error
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-8 py-6 bg-surface-container-low/50 border-t border-surface-container flex items-center justify-between gap-4">
          <button
            onClick={onDownloadErrors}
            className="px-5 py-3 rounded-xl text-on-surface-variant font-bold text-sm hover:bg-surface-container-high transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            Download Error CSV
          </button>
          <button
            onClick={onFinish}
            className="px-10 py-3 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-sm shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
          >
            Finish &amp; View Bank
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}
