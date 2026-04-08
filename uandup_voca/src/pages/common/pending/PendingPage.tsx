export default function PendingPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md px-5 text-center">
        {/* 로고 */}
        <div className="flex items-center justify-center mb-4">
          <img
            src="/logo.png"
            alt="유앤UP국제학원"
            className="h-24 w-auto object-contain"
          />
        </div>

        {/* 아이콘 */}
        {/* <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">
              schedule
            </span>
          </div>
        </div> */}

        {/* 텍스트 */}
        <h1 className="text-xl font-bold text-on-surface mb-2">승인 대기 중</h1>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-8">
          승인이 완료되면 서비스를 이용하실 수 있습니다.
        </p>

        {/* 알림 박스 */}
        <div className="px-4 py-3.5 rounded-xl bg-[#fffde7] border border-[#f9e87f] text-left">
          <p className="text-sm text-[#7a6c00]">
            <span className="font-bold">알림: </span>
            승인까지 시간이 걸릴 수 있습니다. 승인 완료 시 다시 로그인해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
