// 배열을 무작위로 섞은 새 배열을 반환한다 (Fisher-Yates). 원본은 변경하지 않는다.
// 표시 순서 랜덤화 등 비즈니스와 무관한 범용 용도.
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
