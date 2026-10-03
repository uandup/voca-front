// personal-word entity가 personal-word-set entity로부터 import할 수 있는 표면.
// 단어 추가·삭제가 세트의 wordCount를 바꾸므로 단어 쪽 invalidate가 세트 목록 캐시 키를 알아야 한다.
export { personalWordSetKeys } from '../api/queryKeys';
