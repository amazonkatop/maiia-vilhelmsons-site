import { useState } from 'react';
import { useLocale } from '../contexts/LocaleContext';
import { PageTransition, FadeIn } from '../components/Animations';
import { useSubmitLead } from '@workspace/api-client-react';
import { useSiteContact } from '../hooks/useSiteContact';
import {
  localizedContactField,
  phoneTelHref,
} from '../lib/contact-settings';

const projectTypes = [
  { value: 'residential', en: 'Residential', ru: 'Жилой' },
  { value: 'commercial', en: 'Commercial', ru: 'Коммерческий' },
  { value: 'hospitality', en: 'Hospitality', ru: 'Гостеприимство' },
];

export default function Contact() {
  const { locale, t } = useLocale();
  const contact = useSiteContact();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'residential',
    message: ''
  });
  
  const submitLead = useSubmitLead();
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLead.mutate({ data: formData }, {
      onSuccess: () => {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', projectType: 'residential', message: '' });
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const inputClass = "w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-foreground transition-colors duration-300 font-light placeholder:text-foreground/30";

  const studioAddress = localizedContactField(
    contact.data,
    locale,
    'studioAddress',
    '23 Jobs Lane, Southampton, NY 11968',
  );
  const studioSubtitle = localizedContactField(
    contact.data,
    locale,
    'studioSubtitle',
    locale === 'en' ? 'By appointment — Hamptons & Manhattan' : 'По записи — Хэмптонс и Манхэттен',
  );
  const studioEmail = contact.data?.studioEmail ?? 'studio@maiiavilhelmsons.com';
  const phone = contact.data?.phone ?? '+1 929 600 1851';

  return (
    <PageTransition className="pt-32 pb-32 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left: info */}
          <FadeIn>
            <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">{t('contact.title')}</h1>
            <p className="text-lg font-light text-foreground/60 mb-16 max-w-md leading-relaxed">
              {t('contact.desc')}
            </p>

            <div className="space-y-10 font-light">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-accent mb-4">
                  {locale === 'en' ? 'Studio' : 'Студия'}
                </p>
                <p className="text-lg mb-1">{studioAddress}</p>
                <p className="text-lg text-foreground/60">
                  {studioSubtitle}
                </p>
              </div>

              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-accent mb-4">
                  {locale === 'en' ? 'Inquiries' : 'Запросы'}
                </p>
                <a href={`mailto:${studioEmail}`} className="text-lg hover:text-accent transition-colors block mb-2">
                  {studioEmail}
                </a>
                <a href={phoneTelHref(phone)} className="text-2xl font-serif hover:text-accent transition-colors block">
                  {phone}
                </a>
              </div>

              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-accent mb-4">
                  {locale === 'en' ? 'Follow' : 'Соцсети'}
                </p>
                <div className="flex gap-6">
                  <a href={contact.data?.followInstagramUrl ?? 'https://www.instagram.com/mvlh_interiors/'} target="_blank" rel="noopener noreferrer" className="text-lg font-light hover:text-accent transition-colors">
                    Instagram
                  </a>
                  <a href={contact.data?.followPinterestUrl ?? '#'} target="_blank" rel="noopener noreferrer" className="text-lg font-light hover:text-accent transition-colors">
                    Pinterest
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Right: form */}
          <FadeIn delay={0.15}>
            <div className="bg-white p-8 md:p-12">
              {success ? (
                <div className="text-center py-20">
                  <p className="text-3xl font-serif mb-4 text-accent">
                    {locale === 'en' ? 'Thank You' : 'Спасибо'}
                  </p>
                  <p className="font-light text-foreground/70 leading-relaxed">{t('contact.success')}</p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="mt-10 text-sm uppercase tracking-widest border-b border-foreground/30 pb-1 hover:text-accent hover:border-accent transition-colors"
                  >
                    {locale === 'en' ? 'Send another message' : 'Отправить ещё одно сообщение'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs uppercase tracking-widest text-foreground/40">
                      {t('contact.form.name')} *
                    </label>
                    <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className={inputClass} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs uppercase tracking-widest text-foreground/40">
                        {t('contact.form.email')} *
                      </label>
                      <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-xs uppercase tracking-widest text-foreground/40">
                        {t('contact.form.phone')}
                      </label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="projectType" className="text-xs uppercase tracking-widest text-foreground/40">
                      {t('contact.form.type')}
                    </label>
                    <select id="projectType" name="projectType" value={formData.projectType} onChange={handleChange} className={`${inputClass} cursor-pointer appearance-none`}>
                      {projectTypes.map(pt => (
                        <option key={pt.value} value={pt.value}>
                          {locale === 'en' ? pt.en : pt.ru}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs uppercase tracking-widest text-foreground/40">
                      {t('contact.form.message')}
                    </label>
                    <textarea id="message" name="message" rows={5} value={formData.message} onChange={handleChange} className={`${inputClass} resize-none`} />
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitLead.isPending}
                    className="w-full border border-foreground/20 px-8 py-4 text-sm uppercase tracking-widest hover:bg-foreground hover:text-white transition-all duration-500 disabled:opacity-40"
                  >
                    {submitLead.isPending ? t('contact.form.submitting') : t('contact.form.submit')}
                  </button>
                  
                  {submitLead.isError && (
                    <p className="text-red-500 text-sm text-center font-light">
                      {locale === 'en' ? 'An error occurred. Please try again.' : 'Произошла ошибка. Пожалуйста, попробуйте ещё раз.'}
                    </p>
                  )}
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </PageTransition>
  );
}
