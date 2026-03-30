import { useRef, useState } from "react";
import { ModalBackdrop } from "@/shared/ui/ModalBackdrop";

interface UploadExcelModalProps {
  onClose: () => void;
  onUpload: (file: File) => void;
}

export function UploadExcelModal({ onClose, onUpload }: UploadExcelModalProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  }

  function handleUpload() {
    if (selectedFile) onUpload(selectedFile);
  }

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-[0px_32px_64px_-12px_rgba(0,0,0,0.14)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-10 pt-8 flex items-center justify-between ">
          <div className="flex items-center gap-4">
            <h2 className="font-headline text-[32px] font-extrabold text-primary leading-tight">
              Excel Upload
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-container-low rounded-full text-on-surface-variant/60 hover:text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-10 py-6 space-y-8">
          {/* Dropzone */}
          <div
            className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center text-center cursor-pointer transition-all ${
              isDragOver
                ? "border-primary/60 bg-surface-container-low"
                : "border-outline-variant/40 bg-surface-container-low/30 hover:border-primary/40 hover:bg-surface-container-low/60"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.csv"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
              <span
                className="material-symbols-outlined text-primary text-3xl"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                cloud_upload
              </span>
            </div>
            <div className="space-y-1 mb-6">
              {selectedFile ? (
                <>
                  <h3 className="text-lg font-headline font-bold text-on-surface">
                    {selectedFile.name}
                  </h3>
                  <p className="text-on-surface-variant text-sm">
                    Click to change file
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-headline font-bold text-on-surface">
                    Drag and drop your file here
                  </h3>
                  <p className="text-on-surface-variant text-sm">
                    or click to browse from your computer
                  </p>
                </>
              )}
            </div>
            <div className="flex gap-3">
              <span className="px-3 py-1.5 bg-white text-on-surface-variant text-[10px] font-bold uppercase tracking-wider rounded-lg border border-outline-variant/40 shadow-sm">
                .XLSX
              </span>
              <span className="px-3 py-1.5 bg-white text-on-surface-variant text-[10px] font-bold uppercase tracking-wider rounded-lg border border-outline-variant/40 shadow-sm">
                .CSV
              </span>
            </div>
          </div>

          {/* Instructions Panel */}
          <div className="bg-secondary-container/20 border border-outline-variant/30 rounded-2xl p-6 flex gap-4">
            <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-primary text-xl"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                info
              </span>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-bold text-primary">
                Instructions for Formatting:
              </p>
              <ul className="text-sm text-on-surface-variant space-y-2 leading-relaxed list-disc ml-4">
                <li>
                  Ensure your file includes columns for:{" "}
                  <span className="font-bold text-primary">
                    Word, Definition, Phonetic Symbol, Example Sentence
                  </span>
                  .
                </li>
                <li>Avoid using special characters in the column headers.</li>
                <li>
                  The system supports a maximum of{" "}
                  <span className="font-bold text-primary">500 entries</span>{" "}
                  per upload session.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-6 bg-surface-container-low/50 border-t border-outline-variant/20 flex items-center justify-end">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-on-surface-variant font-bold text-sm hover:bg-surface-container rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile}
              className="primary-gradient px-10 py-2.5 text-white font-bold text-sm rounded-xl shadow-[0px_8px_16px_-4px_rgba(0,27,95,0.3)] hover:shadow-[0px_12px_24px_-4px_rgba(0,27,95,0.4)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
}
