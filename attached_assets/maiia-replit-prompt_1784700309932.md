# ПРОМТ ДЛЯ REPLIT AGENT — Maiia Vilhelmsons Interior Design

Ты — senior fullstack-разработчик и арт-директор премиального сегмента. Собери продакшн-готовый сайт-визитку для эксклюзивной студии дизайна интерьеров **Maiia Vilhelmsons**, работающей в Хэмптонс (Southampton, East Hampton, Bridgehampton, Sag Harbor, Westhampton Beach) и на Манхэттене.

Уровень — как у топовых Hamptons-студий (Mabley Handler, Darci Hether, Annette Jaffe): тихая роскошь, прибрежная элегантность, ощущение эксклюзивности, без кричащих элементов.

Сайт **двуязычный**: английский (основной, `/en`) и русский (`/ru`).

## Технологический стек (self-hosted, минимальный бюджет)

**Frontend**
- Next.js 14+ (App Router), TypeScript
- Tailwind CSS
- Framer Motion — плавные, медленные, "дорогие" анимации
- next-intl — маршрутизация `/en/...` и `/ru/...`, переключатель языка в шапке
- next/image с приоритетной загрузкой hero
- Deployment: Vercel (free/Hobby tier)

**Backend / бэк-офис**
- Payload CMS (open-source, self-hosted) — админка для загрузки проектов
- Postgres — база данных (Replit Postgres add-on или Neon free tier)
- Cloudflare R2 — хранение и раздача фото (10 ГБ бесплатно)
- Локализация Payload включена (locales: `en`, `ru`) — каждое поле title/description/alt редактируется на двух языках в одной карточке проекта
- Роли пользователей: **Admin** (полный доступ) и **Editor** (только создание/редактирование проектов, услуг, статей — без доступа к настройкам)

**Прочее**
- Resend (free tier, 3000 писем/мес) — приём заявок с формы на email
- react-hook-form + zod — валидация формы консультации
- GA4 + Google Search Console

## Структура репозитория

```
maiia/
├── apps/
│   └── web/                          # Next.js
│       ├── app/
│       │   ├── [locale]/
│       │   │   ├── page.tsx                  # Home
│       │   │   ├── portfolio/
│       │   │   │   ├── page.tsx              # список + фильтры
│       │   │   │   └── [slug]/page.tsx
│       │   │   ├── about/page.tsx
│       │   │   ├── services/[slug]/page.tsx
│       │   │   ├── journal/[slug]/page.tsx
│       │   │   └── contact/page.tsx
│       │   └── api/lead/route.ts             # приём формы → Resend
│       ├── components/
│       ├── messages/en.json, ru.json         # UI-строки (не контент проектов)
│       └── lib/payload/                      # клиент к Payload API
├── cms/                               # Payload CMS
│   └── collections/
│       ├── Project.ts     # локализ. title/description, фото (R2), location, type
│       ├── Service.ts
│       ├── JournalPost.ts
│       └── Media.ts       # адаптер R2
```

## Что делать сейчас (Этапы 0–2)

1. Инициализировать monorepo в Replit: `/apps/web` (Next.js) + `/cms` (Payload)
2. Подключить Postgres, настроить `.env` (DB_URL, R2 ключи-заглушки, RESEND_API_KEY-заглушка)
3. В Payload: создать коллекции `Project`, `Service`, `JournalPost`, `Media`; включить локализацию en/ru; настроить роли Admin/Editor
4. В Next.js: установить Tailwind, Framer Motion, next-intl; настроить маршруты `/en` и `/ru`; подключить шрифты (serif + sans) через next/font без layout shift
5. Настроить дизайн-токены в tailwind.config:
   - фон `#F7F3EC`, вторичный `#2C3538`, акцент sage `#A8AD8E`
   - типографика: элегантный serif для заголовков, sans для текста, line-height 1.7+
6. Собрать минимальный layout: `<Nav />` (прозрачная поверх hero → solid при скролле, переключатель EN/RU), `<Footer />`

## Дизайн-система (сокращённо)

- "Quiet luxury" / coastal sophistication — простор, свет, естественные материалы
- Никакого чистого чёрного и кричащих цветов
- Широкие полноэкранные фото, минимум текста на экран
- Mobile-first, на мобильных — вертикальные полноэкранные фото-слайды

## SEO (закладывается с первого этапа)

- Semantic HTML5, один H1 на страницу, уникальные metadata на каждом языке
- hreflang en/ru + x-default
- JSON-LD: LocalBusiness / HomeAndConstructionBusiness с гео-координатами Хэмптонс
- Чистые URL: `/en/portfolio/[slug]`, `/ru/portfolio/[slug]`
- sitemap.xml с учётом локалей, robots.txt
- Core Web Vitals: LCP < 2.5s

## Лидогенерация (без сложных форм)

- Sticky-кнопка с номером телефона (`tel:`) — в шапке и floating на мобильном
- Простая форма "Запросить консультацию": имя, телефон, email, тип проекта (select) → `/api/lead` → Resend → письмо на почту
- Без CRM на старте — TODO-комментарий для будущей интеграции

## Что осталось решить (не блокирует старт разработки)

- Доменное имя (нужно подобрать/купить)
- Тексты для страниц (копирайтинг EN и перевод/адаптация RU)
- Реальная фотосъёмка проектов (сейчас — плейсхолдеры с понятными именами файлов)
- VPS/хостинг для Payload после этапа прототипирования в Replit
