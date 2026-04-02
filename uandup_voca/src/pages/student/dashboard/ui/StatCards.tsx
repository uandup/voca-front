export function StatCards() {
  return (
    <div className="lg:col-span-4 flex flex-col gap-6">
      {/* Overall Accuracy */}
      <div className="bg-linear-to-br from-primary to-primary-container p-6 rounded-xl shadow-lg text-white flex-1 flex flex-col justify-center">
        <p className="text-xs font-bold text-white/70 mb-2 uppercase tracking-widest">
          Overall Accuracy
        </p>
        <div className="flex items-center gap-4">
          <span className="text-4xl font-black font-headline">92%</span>
        </div>
      </div>

      {/* Assigned Words */}
      <div className="bg-surface-container-lowest border border-outline-variant/10 shadow-sm p-6 rounded-xl flex-1 flex flex-col justify-center cursor-pointer hover:border-primary/30 hover:shadow-md transition-all">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-primary text-base">
            menu_book
          </span>
          <p className="text-xs font-bold text-primary uppercase tracking-widest">
            Assigned Words
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-4xl font-black text-primary font-headline">
            80
          </span>
          <span
            className="-mr-3 material-symbols-outlined text-primary"
            style={{ fontSize: "40px" }}
          >
            chevron_right
          </span>
        </div>
      </div>

      {/* Words to Review */}
      <div className="bg-surface-container-lowest border border-outline-variant/10 shadow-sm p-6 rounded-xl flex-1 flex flex-col justify-center cursor-pointer hover:border-green-600/30 hover:shadow-md transition-all">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-green-600 text-base">
            auto_stories
          </span>
          <p className="text-xs font-bold text-green-600 uppercase tracking-widest">
            Words to Review
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-4xl font-black text-green-600 font-headline">
            200
          </span>
          <span
            className="-mr-3 material-symbols-outlined text-green-600"
            style={{ fontSize: "40px" }}
          >
            chevron_right
          </span>
        </div>
      </div>
    </div>
  );
}
