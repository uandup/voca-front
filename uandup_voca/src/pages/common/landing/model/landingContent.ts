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
          'From progress tracking to structured review, every step is precisely managed through our online system.',
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
          'Over 8,000 essential vocabulary words, structured across 10 graded levels.',
          'Students start where they are and build steadily toward Level 10, gaining real proficiency along the way.',
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
            'locks the words into memory.',
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
          desc: ['A second review on day four', 'pushes back against the forgetting curve.'],
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
        lines: ['From Mistake to Mastery, ', 'Automatically'],
        fontSize: '1.625rem',
      },
      body: {
        lines: [
          'More than a review tool,',
          'this system is built to carry students all the way to mastery.',
          'Every mistake is automatically logged,',
          'and targeted retests continue until every word sticks.',
        ],
        fontSize: '0.875rem',
      },
    },
    levelTest: {
      headline: {
        lines: ['The Level Test', "That Cements What You've Learned"],
        fontSize: '2.125rem',
      },
      body: {
        lines: [
          'A final check that everything learned has taken root in long-term memory.',
          'Each test passed builds real confidence,',
          'and any remaining gaps are fully reinforced for lasting mastery.',
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
          'Every step of the learning journey is recorded and analyzed.',
          "Detailed score trends reveal each student's weak points and guide personalized instruction.",
        ],
        fontSize: '1.125rem',
      },
    },
    cta: {
      headline: {
        lines: ['A Structured System That Changes How You Learn.'],
        fontSize: '2.25rem',
      },
      body: {
        lines: [
          'With data-driven learning management, every student reaches their full potential.',
        ],
        fontSize: '1.25rem',
      },
      button: 'Get Started with Google',
    },
    footer: '© Future Forum. All rights reserved',
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
          '총 8,000개 이상의 필수 어휘를 10단계로 나누어 제공합니다.',
          '학생의 현재 수준에 맞는 단어부터 시작해 레벨 10까지 차근차근 학습하며 어휘력을 안정적으로 끌어올립니다.',
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
          '단순 반복 암기에서 벗어나, 망각 곡선에 기반한 과학적 복습 주기를 적용합니다.',
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
          desc: ['학습 4일 후 두 번째 복습으로', '망각 속도를 완만하게 늦춥니다.'],
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
        lines: ['틀린 단어가 사라질 때까지'],
        fontSize: '2.25rem',
      },
      body: {
        lines: [
          '단순한 정리를 넘어, 완전한 숙달까지 이어지는 학습 관리 시스템입니다.',
          '틀린 단어는 즉시 기록되고, 완벽히 외울 때까지 맞춤 재시험이 반복됩니다.',
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
          '레벨 테스트로 장기 기억 전환 여부를 최종 점검합니다.',
          '시험을 통과하며 쌓이는 성취감과 자신감은 꾸준한 학습의 원동력이 되고,',
          '이 과정에서 드러난 오답까지 빠짐없이 보완해 진짜 실력을 완성합니다.',
        ],
        fontSize: '1.125rem',
      },
    },
    analytics: {
      headline: {
        lines: ['학습 성취도를 데이터로 증명하는 정밀 분석 대시보드'],
        fontSize: '2.25rem',
      },
      body: {
        lines: [
          '앞서 소개한 모든 학습 과정은 기록되고 분석됩니다.',
          '시험별 성적 추이를 정밀하게 분석하여 학생의 취약점을 진단하고, 최적화된 개인 맞춤형 학습을 제공합니다.',
        ],
        fontSize: '1.125rem',
      },
    },
    cta: {
      headline: {
        lines: ['체계적인 시스템이 학습의 효율을 바꿉니다.'],
        fontSize: '2.5rem',
      },
      body: {
        lines: ['데이터로 관리되는 학습, 지금 시작하세요.'],
        fontSize: '1.25rem',
      },
      button: 'Google 계정으로 시작하기',
    },
    footer: '© Future Forum. All rights reserved',
  },
} as const;

export type LandingContent = (typeof LANDING_CONTENT)[Lang];
