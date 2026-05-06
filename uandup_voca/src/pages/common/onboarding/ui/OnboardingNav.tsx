interface Props {
  onLogoClick: () => void;
}

export function OnboardingNav({ onLogoClick }: Props) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur border-b border-outline-variant">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
        <button onClick={onLogoClick} className="cursor-pointer">
          <img src="/logo.png" alt="UandUP Academy" className="h-12 w-auto object-contain" />
        </button>
      </div>
    </header>
  );
}
