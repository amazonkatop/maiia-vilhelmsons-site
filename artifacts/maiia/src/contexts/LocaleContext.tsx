import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';

export type Locale = 'en' | 'ru';

interface LocaleContextValue {
  locale: Locale;
  t: (key: keyof typeof translations) => string;
  l: <T extends Record<string, any>>(obj: T, keyBase: string) => any;
}

const translations = {
  // Navigation
  'nav.portfolio': { en: 'Portfolio', ru: 'Портфолио' },
  'nav.about': { en: 'Studio', ru: 'Студия' },
  'nav.services': { en: 'Services', ru: 'Услуги' },
  'nav.journal': { en: 'Journal', ru: 'Журнал' },
  'nav.contact': { en: 'Contact', ru: 'Контакты' },
  
  // Home
  'home.subtitle': { en: 'Interior Architecture & Design', ru: 'Архитектура и Дизайн Интерьера' },
  'home.stats.projects': { en: 'Completed Projects', ru: 'Реализованных проектов' },
  'home.stats.years': { en: 'Years Experience', ru: 'Лет опыта' },
  'home.stats.locations': { en: 'Key Locations', ru: 'Ключевые локации' },
  'home.featured': { en: 'Selected Works', ru: 'Избранные работы' },
  'home.services': { en: 'Our Approach', ru: 'Наш подход' },
  'home.journal': { en: 'From the Journal', ru: 'Из журнала' },
  'home.cta': { en: 'Inquire about your project', ru: 'Обсудить ваш проект' },
  
  // General
  'general.read_more': { en: 'Read More', ru: 'Читать далее' },
  'general.view_project': { en: 'View Project', ru: 'Смотреть проект' },
  'general.all_projects': { en: 'All Projects', ru: 'Все проекты' },
  'general.back': { en: 'Back', ru: 'Назад' },
  'general.location': { en: 'Location', ru: 'Локация' },
  'general.type': { en: 'Type', ru: 'Тип' },
  
  // Contact Form
  'contact.title': { en: 'Start a Conversation', ru: 'Начать диалог' },
  'contact.desc': { en: 'We accept a limited number of commissions each year to ensure the highest level of detail and attention. Please share a few details about your upcoming project.', ru: 'Мы берем ограниченное количество проектов в год, чтобы обеспечить максимальное внимание к деталям. Пожалуйста, расскажите немного о вашем будущем проекте.' },
  'contact.form.name': { en: 'Name', ru: 'Имя' },
  'contact.form.email': { en: 'Email', ru: 'Электронная почта' },
  'contact.form.phone': { en: 'Phone (optional)', ru: 'Телефон (опционально)' },
  'contact.form.type': { en: 'Project Type', ru: 'Тип проекта' },
  'contact.form.message': { en: 'Project Details', ru: 'Детали проекта' },
  'contact.form.submit': { en: 'Submit Inquiry', ru: 'Отправить заявку' },
  'contact.form.submitting': { en: 'Submitting...', ru: 'Отправка...' },
  'contact.success': { en: 'Thank you for your inquiry. We will be in touch shortly.', ru: 'Спасибо за ваше обращение. Мы свяжемся с вами в ближайшее время.' },
  
  // Types
  'type.residential': { en: 'Residential', ru: 'Жилой' },
  'type.commercial': { en: 'Commercial', ru: 'Коммерческий' },
  'type.hospitality': { en: 'Hospitality', ru: 'Гостеприимство' }
} as const;

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const locale = location.startsWith('/ru') ? 'ru' : 'en';

  const t = (key: keyof typeof translations) => {
    return translations[key]?.[locale] || key;
  };

  // Helper to extract localized field from API object, e.g. l(project, 'title') -> project.titleEn or project.titleRu
  const l = <T extends Record<string, any>>(obj: T, keyBase: string) => {
    if (!obj) return '';
    const key = `${keyBase}${locale === 'en' ? 'En' : 'Ru'}`;
    return obj[key] || '';
  };

  return (
    <LocaleContext.Provider value={{ locale, t, l }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
