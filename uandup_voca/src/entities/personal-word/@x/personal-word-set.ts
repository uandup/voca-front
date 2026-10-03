// personal-word-set entity가 personal-word entity로부터 import할 수 있는 표면.
// 세트 삭제가 소속 단어까지 소프트 삭제하므로 세트 쪽 invalidate가 단어 캐시 키를 알아야 한다.
export { personalWordKeys } from '../api/queryKeys';
