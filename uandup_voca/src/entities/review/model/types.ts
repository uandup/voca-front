export interface ReviewDeck {
  id: number;
  studentId: number;
  totalCount: number;
  createdAt: string;
}

export interface ReviewItem {
  id: number;
  reviewId: number;
  wordId: number;
  wrongCount: number;
}
