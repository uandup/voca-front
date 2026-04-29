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
      sub: {
        lines: [
          'From progress monitoring to structured review, every step is precisely managed through our online system.',
        ],
        fontSize: '1.125rem',
      },
    },
    curriculum: {
      headline: {
        lines: ['From Level 1 to Level 10,', 'A Vocabulary Curriculum Built to Completion'],
        fontSize: '1.4rem',
      },
      body: {
        lines: [
          'Over 5,000 essential vocabulary words, organized across 10 precisely graded levels.',
          'Students begin at their current level and advance step by step — building real proficiency all the way to Level 10.',
        ],
        fontSize: '1rem',
      },
    },
    spaced: {
      headline: {
        lines: ['Structured 1-4-7 Review Cycle', 'for Deep Memory Consolidation'],
        fontSize: '2.25rem',
      },
      body: {
        lines: [
          'Moving beyond rote memorization, our review intervals are built around the forgetting curve.',
          'Scheduled reviews at Day 1, Day 4, and Day 7 transform short-term recall into lasting long-term retention.',
        ],
        fontSize: '1rem',
      },
      steps: [
        {
          day: 'D+0',
          label: 'Vocabulary Test',
          desc: [
            'A word and sentence test',
            'taken right after learning',
            'locks in initial memory',
          ],
          icon: 'edit_note',
        },
        {
          day: 'D+1',
          label: 'Review 1',
          desc: [
            'A first review one day later',
            'strengthens short-term memory',
            'before it fades.',
          ],
          icon: 'replay',
        },
        {
          day: 'D+4',
          label: 'Review 2',
          desc: ['A second review on day four', 'disrupts the forgetting curve.'],
          icon: 'replay',
        },
        {
          day: 'D+7',
          label: 'Review 3',
          desc: [
            'The final review on day seven',
            'completes the shift from',
            'short-term recall to long-term retention.',
          ],
          icon: 'verified',
        },
      ],
    },
    wrongWord: {
      headline: {
        lines: ['The Wrong Word Bank System', 'That Guarantees Complete Mastery'],
        fontSize: '1.625rem',
      },
      body: {
        lines: [
          'Beyond simple review,',
          'this is a post-learning management solution built for complete mastery.',
          'Every incorrect answer is instantly recorded,',
          'and targeted retests continue until every word is fully memorized',
        ],
        fontSize: '0.875rem',
      },
    },
    levelTest: {
      headline: {
        lines: ["The Level Test That Cements What You've Learned"],
        fontSize: '2.25rem',
      },
      body: {
        lines: [
          'A final verification that everything learned has taken root in long-term memory.',
          'Each test passed builds real confidence — and any words that surface again are fully reinforced, cementing lasting mastery.',
        ],
        fontSize: '1rem',
      },
    },
    analytics: {
      headline: {
        lines: ['A Precision Dashboard That Proves Your Progress'],
        fontSize: '2rem',
      },
      body: {
        lines: [
          'Every learning step above is recorded and analyzed.',
          "Per-test score trends pinpoint each student's weak points and drive personalized instruction.",
        ],
        fontSize: '1.125rem',
      },
    },
    cta: {
      headline: {
        lines: ['A Structured System That Changes How You Learn.'],
        fontSize: '1.75rem',
      },
      body: {
        lines: [
          'Through data-driven, systematic management, we help every student achieve their best.',
        ],
        fontSize: '1.125rem',
      },
      button: 'Get Started with Google',
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
      sub: {
        lines: [
          '학습 현황 파악부터 체계적인 복습까지, 모든 과정이 온라인 시스템을 통해 정교하게 관리됩니다.',
        ],
        fontSize: '1.25rem',
      },
    },
    curriculum: {
      headline: {
        lines: ['레벨 1부터 10까지', '체계적으로 완성하는 어휘 커리큘럼'],
        fontSize: '2rem',
      },
      body: {
        lines: [
          '총 5,000개 이상의 필수 어휘를 10단계로 세분화하여 제공합니다.',
          '학생의 현재 수준에 맞는 단어부터 시작해 레벨 10까지 순차적으로 완성하며 실력을 단계적으로 끌어올립니다.',
        ],
        fontSize: '1.1rem',
      },
    },
    spaced: {
      headline: {
        lines: ['장기 기억으로 가는', '1-4-7 체계적 복습 시스템'],
        fontSize: '2.25rem',
      },
      body: {
        lines: [
          '단순 반복 암기에서 벗어나, 망각 곡선을 고려한 과학적 복습 주기를 제안합니다.',
          '학습 후 1일, 4일, 7일 시점에 진행되는 복습 시험을 통해 단기 기억을 장기 기억으로 안정적으로 전환합니다.',
        ],
        fontSize: '1rem',
      },
      steps: [
        {
          day: 'D+0',
          label: '단어 시험',
          desc: ['학습 직후 단어·예문 시험을 통해', '초기 기억을 고정합니다.'],
          icon: 'edit_note',
        },
        {
          day: 'D+1',
          label: 'Review 1',
          desc: ['학습 1일 후 첫 복습 시험으로', '단기 기억을 강화합니다.'],
          icon: 'replay',
        },
        {
          day: 'D+4',
          label: 'Review 2',
          desc: ['학습 4일 후 두 번째 복습으로', '망각 곡선을 완만하게 늦춥니다.'],
          icon: 'replay',
        },
        {
          day: 'D+7',
          label: 'Review 3',
          desc: ['학습 7일 후 최종 복습을 통해', '기억이 장기적으로 자리 잡습니다.'],
          icon: 'verified',
        },
      ],
    },
    wrongWord: {
      headline: {
        lines: ['완벽한 암기를 보장하는', '오답 뱅크 시스템'],
        fontSize: '2.25rem',
      },
      body: {
        lines: [
          '단순한 정리를 넘어 완전한 학습을 위한 사후 관리 솔루션을 제안합니다.',
          '모든 오답은 시스템에 즉시 기록되며,',
          '단어가 완벽히 숙달될 때까지 오답 시험을 통해 빈틈없는 암기를 보장합니다.',
        ],
        fontSize: '1rem',
      },
    },
    levelTest: {
      headline: {
        lines: ['흔들리지 않는 실력을 완성하는 레벨 테스트'],
        fontSize: '2.25rem',
      },
      body: {
        lines: [
          '레벨 테스트로 장기 기억 전환을 최종 검증합니다.',
          '시험 통과 과정에서 느끼는 성취감과 자신감은 지속적인 학습의 원동력이 되며, 이 과정에서 재발견된 오답까지 완벽히 보완하여 흔들리지 않는 실력을 완성합니다.',
        ],
        fontSize: '1rem',
      },
    },
    analytics: {
      headline: {
        lines: ['학습 성취도를 데이터로 증명하는 정밀 분석 대시보드'],
        fontSize: '2.25rem',
      },
      body: {
        lines: [
          '앞서 이야기한 모든 학습 과정은 기록되고 분석됩니다.',
          '시험별 성적 추이를 정밀하게 분석하여 학생의 취약점을 진단하고, 최적화된 개인 맞춤형 학습을 제공합니다.',
        ],
        fontSize: '1rem',
      },
    },
    cta: {
      headline: {
        lines: ['체계적인 시스템이 학습의 효율을 바꿉니다.'],
        fontSize: '2.25rem',
      },
      body: {
        lines: ['데이터 기반의 체계적인 관리를 통해 최상의 학습 결과를 만드시기 바랍니다.'],
        fontSize: '1.125rem',
      },
      button: 'Google 계정으로 시작하기',
    },
    footer: '© 2025 유앤UP국제학원. All rights reserved.',
  },
} as const;

export type LandingContent = (typeof LANDING_CONTENT)[Lang];
