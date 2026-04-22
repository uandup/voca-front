import { useNavigate } from '@tanstack/react-router';

export function TestHeader() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-outline-variant/30 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate({ to: '/' })}
          className="flex items-center gap-1.5 text-on-surface-variant text-sm font-medium hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            logout
          </span>
          Exit
        </button>
      </div>

      <div className="flex items-center gap-1.5  text-on-surface-variant ">
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
          warning
        </span>
        <p className="text-sm font-semibold">
          Your answers are not saved automatically. Refreshing or exiting this page will discard all
          progress.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
            task_alt
          </span>
          Submit
        </button>
      </div>
    </header>
  );
}
