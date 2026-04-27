export type Lang = 'en' | 'ko';

export const LANDING_CONTENT = {
  en: {
    nav: { googleLogin: 'Sign in with Google' },
    hero: {
      badge: 'Official Online Learning System — UandUP Academy',
      headline: {
        lines: ['The Most Systematic Vocabulary Solution', 'Powered by Individual Learning Data.'],
        fontSize: '2.125rem',
        subFontSize: '1.125rem',
      },
      sub: [
        'From progress monitoring to structured review, every step is precisely managed through our online system.',
      ],
    },
    curriculum: {
      label: 'Curriculum',
      headline: {
        lines: ['An Optimized 10-Level Vocabulary', 'Curriculum for SAT Excellence'],
        fontSize: '2.25rem',
      },
      body: [
        'Master over 5,000 essential SAT vocabulary words.',
        'Ten precisely graded levels deliver the right words at the right difficulty for each individual student.',
      ],
      completed: 'Completed',
      inProgress: 'In Progress',
    },
    spaced: {
      label: 'Spaced Repetition System',
      headline: {
        lines: ['Structured 1-4-7 Review Cycle', 'for Deep Memory Consolidation'],
        fontSize: '2.25rem',
      },
      body: [
        'Moving beyond rote memorization, our scientifically designed review intervals follow the forgetting curve.',
        'Reviews at Day 1, Day 4, and Day 7 reliably convert short-term memory into permanent, long-term retention.',
      ],
      footnote:
        'Each review stage is individually released by the assigned teacher, keeping pace precisely aligned with in-class instruction.',
      steps: [
        {
          day: 'D+0',
          label: 'Vocabulary Test',
          desc: 'Immediately after learning, a word and sentence test locks in initial memory retention.',
          icon: 'edit_note',
        },
        {
          day: 'D+1',
          label: 'Review 1',
          desc: 'The first review session one day later reinforces short-term memory consolidation.',
          icon: 'replay',
        },
        {
          day: 'D+4',
          label: 'Review 2',
          desc: 'A second review at day four effectively interrupts the forgetting curve.',
          icon: 'replay',
        },
        {
          day: 'D+7',
          label: 'Review 3',
          desc: 'The final review at day seven converts short-term memory into long-term retention.',
          icon: 'verified',
        },
      ],
    },
    wrongWord: {
      label: 'Wrong Word Bank',
      headline: {
        lines: ['Zero Weak Points —', 'Automated Error Tracking & Remediation'],
        fontSize: '2.25rem',
      },
      body: [
        'One test is never the end. Every incorrect answer is automatically accumulated in the "Wrong Word Bank" and retested until fully mastered.',
        "By tracking each word's error count, the system identifies exactly which words a student struggles with and ensures focused, effective remediation.",
      ],
      cardTitle: 'Wrong Word Bank',
      cardCount: '124 words',
    },
    levelTest: {
      label: 'Level Test',
      headline: {
        lines: ['Final Level Assessment', 'for Complete Mastery Verification'],
        fontSize: '2.25rem',
      },
      body: [
        'Even after all study sessions are complete, a comprehensive Level Test verifies long-term retention of every word.',
        'Any failed level is automatically routed back into the wrong-word review cycle — the system continues managing progress until full mastery is confirmed.',
      ],
      flow: [
        {
          icon: 'school',
          label: 'Complete Level Study',
          color: 'bg-secondary-container text-on-secondary-container',
        },
        {
          icon: 'quiz',
          label: 'Take the Level Test',
          color: 'bg-secondary-container text-on-secondary-container',
        },
        {
          icon: 'check_circle',
          label: 'Pass → Advance to Next Level',
          color: 'bg-success-container text-on-success-container',
        },
        {
          icon: 'error',
          label: 'Fail → Wrong Word Review Loop',
          color: 'bg-error-container text-on-error-container',
        },
      ],
    },
    analytics: {
      label: 'Data Analytics',
      headline: {
        lines: ['Objective Performance Metrics', 'Through Precision Data Analysis'],
        fontSize: '2.25rem',
      },
      body: [
        'Beyond simple score records, every aspect of the learning process is logged and analyzed in real time.',
        "Weekly score trends and level-by-level accuracy are precisely examined to identify each student's weak points and deliver optimized, personalized instruction.",
      ],
      metrics: [
        {
          icon: 'show_chart',
          label: 'Weekly Score Trends',
          desc: 'Visualize score changes across every test session over time.',
        },
        {
          icon: 'analytics',
          label: 'Level-by-Level Accuracy',
          desc: 'Pinpoint weak zones at each difficulty level with precision.',
        },
        {
          icon: 'history_edu',
          label: 'Cumulative Word Count',
          desc: 'Track total words mastered and full learning history in one place.',
        },
        {
          icon: 'person_search',
          label: 'Personalized Analysis',
          desc: 'Data-driven insights that shape an optimized individual learning path.',
        },
      ],
    },
    cta: {
      headline: {
        lines: ['A Proven System That Transforms', 'Learning Efficiency.'],
        fontSize: '2.25rem',
        bodyFontSize: '1rem',
      },
      body: 'Through data-driven, systematic management, we are committed to delivering the highest possible learning outcomes for every student.',
    },
    footer: '© 2025 UandUP Academy. All rights reserved.',
  },

  ko: {
    nav: { googleLogin: 'Google로 로그인' },
    hero: {
      badge: '유앤UP국제학원 공식 온라인 학습 시스템',
      headline: {
        lines: ['개인별 학습 데이터를 기반으로 한', '체계적인 영단어 솔루션'],
        fontSize: '2.75rem',
        subFontSize: '1.25rem',
      },
      sub: [
        '학습 현황 파악부터 체계적인 복습까지, 모든 과정이 온라인 시스템을 통해 정교하게 관리됩니다.',
      ],
    },
    curriculum: {
      label: '커리큘럼',
      headline: {
        lines: ['SAT 고득점을 위한', '최적화된 10단계 어휘 커리큘럼'],
        fontSize: '2.25rem',
      },
      body: [
        '총 5,000개 이상 SAT 필수 어휘를 정복합니다.',
        '세분화된 레벨 1~10을 통해 개인 수준별 맞춤 단어를 제공합니다.',
      ],
      completed: '완료',
      inProgress: '진행 중',
    },
    spaced: {
      label: '간격 반복 시스템',
      headline: {
        lines: ['기억의 고착화를 위한', '1-4-7 체계적 복습 시스템'],
        fontSize: '2.25rem',
      },
      body: [
        '단순 반복 암기에서 벗어나, 망각 곡선을 고려한 과학적 복습 주기를 제안합니다.',
        '학습 후 1일, 4일, 7일 단위로 시행되는 복습 시험을 통해 단기 기억을 장기 기억으로 확실하게 전환합니다.',
      ],
      footnote: '각 복습 단계는 담당 선생님이 직접 개방하여 수업 진도와 완벽하게 연동됩니다.',
      steps: [
        {
          day: 'D+0',
          label: '단어 시험',
          desc: '학습 직후 단어·예문 시험을 통해 초기 기억을 고정합니다.',
          icon: 'edit_note',
        },
        {
          day: 'D+1',
          label: 'Review 1',
          desc: '학습 1일 후 첫 번째 복습 시험으로 단기 기억을 강화합니다.',
          icon: 'replay',
        },
        {
          day: 'D+4',
          label: 'Review 2',
          desc: '학습 4일 후 두 번째 복습으로 망각 곡선을 효과적으로 차단합니다.',
          icon: 'replay',
        },
        {
          day: 'D+7',
          label: 'Review 3',
          desc: '학습 7일 후 최종 복습으로 단기 기억을 장기 기억으로 전환합니다.',
          icon: 'verified',
        },
      ],
    },
    wrongWord: {
      label: '오답 관리',
      headline: {
        lines: ['취약점 제로를 지향하는', '오답 추적 및 재시험 시스템'],
        fontSize: '2.25rem',
      },
      body: [
        "한 번의 시험으로 끝나지 않습니다. 틀린 단어는 '오답 뱅크'에 누적되어 완벽히 숙달될 때까지 테스트됩니다.",
        '오답 횟수 추적을 통해 학생이 특히 어려워하는 단어를 정확히 파악하고 집중적으로 암기할 수 있도록 돕습니다.',
      ],
      cardTitle: '오답 뱅크',
      cardCount: '124개',
    },
    levelTest: {
      label: '레벨 시험',
      headline: {
        lines: ['완벽한 숙달 검증을 위한', '최종 레벨 시험'],
        fontSize: '2.25rem',
      },
      body: [
        "모든 학습이 끝난 후에도 '레벨 시험'을 통해 장기 기억 저장 여부를 최종 검증합니다.",
        '통과하지 못한 레벨은 다시 오답 학습으로 연결되어, 완벽히 마스터할 때까지 시스템이 끝까지 관리합니다.',
      ],
      flow: [
        {
          icon: 'school',
          label: '레벨 학습 완료',
          color: 'bg-secondary-container text-on-secondary-container',
        },
        {
          icon: 'quiz',
          label: '레벨 시험 응시',
          color: 'bg-secondary-container text-on-secondary-container',
        },
        {
          icon: 'check_circle',
          label: '합격 → 다음 레벨 진급',
          color: 'bg-success-container text-on-success-container',
        },
        {
          icon: 'error',
          label: '불합격 → 오답 학습 연결',
          color: 'bg-error-container text-on-error-container',
        },
      ],
    },
    analytics: {
      label: '데이터 분석',
      headline: {
        lines: ['정밀한 데이터 분석을 통한', '객관적 성과 지표 제공'],
        fontSize: '2.25rem',
      },
      body: [
        '단순한 점수 기록을 넘어, 학습의 모든 과정은 실시간으로 기록되고 분석됩니다.',
        '주차별 성적 추이와 레벨별 정확도를 정밀하게 분석하여 학생의 취약점을 진단하고, 최적화된 개인 맞춤형 학습을 제공합니다.',
      ],
      metrics: [
        {
          icon: 'show_chart',
          label: '주차별 성적 추이',
          desc: '회차별 점수 변화를 시각적으로 추적합니다.',
        },
        {
          icon: 'analytics',
          label: '레벨별 정확도',
          desc: '단계별 취약 구간을 정밀하게 진단합니다.',
        },
        {
          icon: 'history_edu',
          label: '누적 학습량',
          desc: '습득 단어 수 및 학습 이력을 통합 관리합니다.',
        },
        {
          icon: 'person_search',
          label: '개인 맞춤 분석',
          desc: '데이터 기반 최적화된 학습 경로를 제시합니다.',
        },
      ],
    },
    cta: {
      headline: {
        lines: ['검증된 시스템이', '학습의 효율을 바꿉니다.'],
        fontSize: '2.25rem',
        bodyFontSize: '1rem',
      },
      body: '데이터 기반의 체계적인 관리를 통해 최상의 학습 결과를 만드시기 바랍니다.',
    },
    footer: '© 2025 유앤UP국제학원. All rights reserved.',
  },
} as const;

export type LandingContent = (typeof LANDING_CONTENT)[Lang];
