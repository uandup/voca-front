import type { WordTest } from "../ui/WordTestTable";
import type { ReviewTest } from "../ui/ReviewTestTable";

export const mockWordTests: WordTest[] = [
  {
    id: "#TX-8655",
    assignedAt: "26.03.25",
    type: "Word",
    levels: [4],
    quantity: 25,
    status: "Graded",
    score: "100/100",
  },
  {
    id: "#TX-8821",
    assignedAt: "26.03.30",
    type: "Word",
    levels: [1],
    quantity: 25,
    status: "Graded",
    score: "98/100",
  },
  {
    id: "#TX-8794",
    assignedAt: "26.03.30",
    type: "Sentence",
    levels: [1, 2, 3, 4],
    quantity: 20,
    status: "Pending",
  },
];

export const mockReviewTests: ReviewTest[] = [
  {
    id: "#RX-1001",
    assignedAt: "26.03.25",
    levels: [4],
    scores: [
      { value: "95/100", gradedAt: "26.03.27" },
      { value: "98/100", gradedAt: "26.03.29" },
      undefined,
      undefined,
    ],
  },
  {
    id: "#RX-1002",
    assignedAt: "26.03.28",
    levels: [1, 2, 3, 4],
    scores: [
      { value: "80/100", gradedAt: "26.03.30" },
      { value: "85/100", gradedAt: "26.04.01" },
      { value: "90/100", gradedAt: "26.04.03" },
      { value: "92/100", gradedAt: "26.04.05" },
    ],
  },
];
