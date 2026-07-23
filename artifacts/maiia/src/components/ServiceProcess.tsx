import { FadeIn } from './Animations';

interface Step {
  number: string;
  titleEn: string;
  titleRu: string;
  descEn: string;
  descRu: string;
}

const steps: Step[] = [
  {
    number: '01',
    titleEn: 'Discovery',
    titleRu: 'Знакомство',
    descEn: 'We begin with a deep listening session — understanding how you live, what you value, and what you want to feel when you come home.',
    descRu: 'Мы начинаем с вдумчивой беседы — узнаём, как вы живёте, что для вас важно и какое ощущение вы хотите испытывать, возвращаясь домой.',
  },
  {
    number: '02',
    titleEn: 'Concept',
    titleRu: 'Концепция',
    descEn: 'A spatial vision emerges: mood boards, material directions, and a colour story that frames every subsequent decision.',
    descRu: 'Рождается пространственное видение: мудборды, направления материалов и цветовая история, которая определяет все последующие решения.',
  },
  {
    number: '03',
    titleEn: 'Design Development',
    titleRu: 'Разработка дизайна',
    descEn: 'Detailed drawings, bespoke furniture specifications, and finish schedules are refined until every detail is resolved.',
    descRu: 'Детальные чертежи, спецификации мебели на заказ и отделочные ведомости дорабатываются до тех пор, пока каждая деталь не станет на своё место.',
  },
  {
    number: '04',
    titleEn: 'Procurement',
    titleRu: 'Закупка',
    descEn: 'We source and manage the acquisition of every piece — from antiques to custom fabrications — with complete transparency.',
    descRu: 'Мы подбираем и сопровождаем приобретение каждого предмета — от антиквариата до изделий на заказ — с полной прозрачностью.',
  },
  {
    number: '05',
    titleEn: 'Installation',
    titleRu: 'Реализация',
    descEn: 'White-glove installation, final styling, and a complete handover — so you arrive to a home that is entirely ready.',
    descRu: 'Монтаж в белых перчатках, финальный стайлинг и полная передача — чтобы вы вошли в дом, который полностью готов к жизни.',
  },
];

export function ServiceProcess({ locale = 'en' }: { locale?: 'en' | 'ru' }) {
  return (
    <div className="mt-20 pt-16 border-t border-border">
      <FadeIn>
        <h3 className="text-2xl font-serif mb-16">
          {locale === 'en' ? 'Our Process' : 'Наш процесс'}
        </h3>
      </FadeIn>

      {/* Desktop: horizontal stepper */}
      <div className="hidden md:grid md:grid-cols-5 gap-0 mb-4">
        {steps.map((step, i) => (
          <FadeIn key={step.number} delay={i * 0.08}>
            <div className="relative pr-8">
              {/* connector line */}
              {i < steps.length - 1 && (
                <div className="absolute top-[22px] left-[calc(2rem+1px)] right-0 h-[1px] bg-border" />
              )}
              <div className="flex items-center gap-3 mb-5">
                <span className="w-11 h-11 rounded-full border border-accent text-accent flex items-center justify-center text-xs font-light tracking-widest flex-shrink-0 bg-background relative z-10">
                  {step.number}
                </span>
              </div>
              <h4 className="text-base font-serif mb-3">
                {locale === 'en' ? step.titleEn : step.titleRu}
              </h4>
              <p className="text-sm font-light text-foreground/65 leading-relaxed">
                {locale === 'en' ? step.descEn : step.descRu}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Mobile: vertical list */}
      <div className="md:hidden space-y-0">
        {steps.map((step, i) => (
          <FadeIn key={step.number} delay={i * 0.06}>
            <div className="flex gap-6 pb-10">
              <div className="flex flex-col items-center">
                <span className="w-10 h-10 rounded-full border border-accent text-accent flex items-center justify-center text-xs tracking-widest flex-shrink-0">
                  {step.number}
                </span>
                {i < steps.length - 1 && (
                  <div className="w-[1px] flex-grow bg-border mt-3" />
                )}
              </div>
              <div className="pt-2 pb-4">
                <h4 className="text-lg font-serif mb-3">
                  {locale === 'en' ? step.titleEn : step.titleRu}
                </h4>
                <p className="text-sm font-light text-foreground/65 leading-relaxed">
                  {locale === 'en' ? step.descEn : step.descRu}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
