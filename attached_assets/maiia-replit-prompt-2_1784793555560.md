# ПРОМТ ДЛЯ REPLIT AGENT — Maiia Vilhelmsons: страницы Home, Portfolio + остальные (Этапы 3–4)

Продолжаем проект **Maiia Vilhelmsons** (сайт студии дизайна интерьеров, Хэмптонс + Манхэттен). Каркас уже готов: Next.js 14 (App Router, TypeScript, `/en` и `/ru` через next-intl), Tailwind + дизайн-токены, Payload CMS с коллекциями `Project`, `Service`, `JournalPost`, `Media` (локализация en/ru, роли Admin/Editor). Теперь собираем сами страницы и подключаем их к данным из Payload.

Используй уже настроенные дизайн-токены (фон `#F7F3EC`, вторичный `#2C3538`, акцент sage `#A8AD8E`, serif-заголовки, sans-текст, line-height 1.7+) и компоненты `<Nav />` / `<Footer />` — не создавай их заново.

## 1. Home (`/[locale]/page.tsx`)

Собери из компонентов (создай каждый переиспользуемым):

- `<Hero />` — полноэкранное фото (next/image, priority), заголовок-манифест ("Timeless interiors for coastal living" на EN, естественный перевод на RU — не дословный), плавный fade-in при загрузке, лёгкий parallax при скролле
- Блок философии студии — короткий текст + портрет Maiia Vilhelmsons, ссылка на страницу About
- `<ProjectGallery variant="featured" />` — 4–6 избранных проектов из Payload (поле `featured: boolean` в коллекции Project), крупные кадры, не мелкие карточки
- `<PressLogos />` — плейсхолдеры логотипов (Architectural Digest, Veranda, ELLE Decor), grayscale → цвет при hover
- Финальный CTA-блок: "Book a Consultation" — кнопка со ссылкой на `/contact` + номер телефона рядом (`tel:`)

## 2. Portfolio (`/[locale]/portfolio`)

- `<ProjectGallery />` — крупные полноэкранные слайды, не сетка мелких карточек (на мобильных — вертикальный фулскрин-свайп)
- Фильтры (клиентский стейт, без перезагрузки страницы):
  - по локации: Southampton, East Hampton, Bridgehampton, Sag Harbor, Westhampton Beach
  - по типу: Waterfront, New Build, Renovation, Coastal Cottage
- Данные тянутся из Payload (`Project` collection), локализованные title/description отдаются в зависимости от `[locale]`

### Страница проекта (`/[locale]/portfolio/[slug]`)

- Полноэкранная лайтбокс-галерея (свайп/стрелки)
- Если у проекта есть поле `before/after` — `<BeforeAfterSlider />` (hover/drag переход)
- Метаданные (title/description) генерируются из полей Payload, alt-тексты фото — из локализованного поля `alt` с указанием локации и стиля ("Waterfront living room design, Southampton NY")
- Related projects — 2–3 похожих по локации/типу внизу страницы

## 3. About / Philosophy (`/[locale]/about`)

- История студии, портрет Maiia Vilhelmsons, философия дизайна
- Фото команды (плейсхолдеры)
- Награды и упоминания в прессе

## 4. Services (`/[locale]/services/[slug]`)

Список услуг из коллекции `Service`:
- Full-Service Interior Design
- New Construction & Renovation Design
- Custom Furnishings & Procurement
- Kitchen & Bath Design
- Color & Materials Consulting

Каждая — со `<ServiceProcess />`: Discovery → Concept → Design Development → Procurement → Installation (горизонтальный степпер на десктопе, вертикальный список на мобильном)

## 5. Journal (`/[locale]/journal`, `/[locale]/journal/[slug]`)

- Список статей из `JournalPost` (тренды, публикации в прессе, before/after кейсы)
- Страница статьи: JSON-LD `Article`, чистая типографика, hero-фото

## 6. Contact (`/[locale]/contact`)

- `<ConsultationForm />` (уже описана в прошлом промте — react-hook-form + zod → `/api/lead` → Resend)
- Телефон крупно, кликабельный
- Адрес офиса в Хэмптонс
- Ссылки на Instagram/Pinterest

## Требования к реализации

- `loading.tsx` с элегантным skeleton/fade (не спиннер) для каждого роута с данными из Payload
- Все фото — плейсхолдеры высокого разрешения с понятными именами файлов (`waterfront-livingroom-southampton-01.jpg` и т.п.) для лёгкой замены
- lazy loading всех изображений кроме hero
- Every page: уникальные `generateMetadata()` (title 50–60 симв., description 150–160 симв.) на обоих языках, canonical, hreflang en/ru + x-default
- JSON-LD: `BreadcrumbList` на страницах портфолио/услуг/журнала, `Article` на статьях журнала

## В конце — выведи чеклист

Что реализовано и что нужно доделать вручную: реальная фотосъёмка, финальные тексты (копирайтинг + перевод RU), домен, аналитика (GA4/Search Console), деплой Payload на VPS, интеграция Resend с боевым API-ключом.
