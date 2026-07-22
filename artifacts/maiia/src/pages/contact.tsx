import { useState } from 'react';
import { useLocale } from '../contexts/LocaleContext';
import { PageTransition, FadeIn } from '../components/Animations';
import { useSubmitLead } from '@workspace/api-client-react';

export default function Contact() {
  const { locale, t } = useLocale();
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

  return (
    <PageTransition className="pt-32 pb-32 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <FadeIn>
            <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">{t('contact.title')}</h1>
            <p className="text-lg font-light text-foreground/70 mb-16 max-w-md leading-relaxed">
              {t('contact.desc')}
            </p>

            <div className="space-y-8 font-light">
              <div>
                <p className="text-sm tracking-widest uppercase text-accent mb-2">Studio</p>
                <p className="text-lg">Southampton, NY</p>
                <p className="text-lg">Manhattan, NY</p>
              </div>
              <div>
                <p className="text-sm tracking-widest uppercase text-accent mb-2">Inquiries</p>
                <a href="mailto:studio@maiiavilhelmsons.com" className="text-lg hover:text-accent transition-colors block">
                  studio@maiiavilhelmsons.com
                </a>
                <a href="tel:+1-631-555-0100" className="text-lg hover:text-accent transition-colors block">
                  +1 631 555 0100
                </a>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="bg-white p-8 md:p-12 shadow-sm">
              {success ? (
                <div className="text-center py-20">
                  <p className="text-2xl font-serif mb-4 text-accent">
                    {locale === 'en' ? 'Thank You' : 'Спасибо'}
                  </p>
                  <p className="font-light text-foreground/80">{t('contact.success')}</p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="mt-8 text-sm uppercase tracking-widest border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors"
                  >
                    {locale === 'en' ? 'Send another message' : 'Отправить еще одно сообщение'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs uppercase tracking-widest text-foreground/60">{t('contact.form.name')}</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-accent transition-colors font-light"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs uppercase tracking-widest text-foreground/60">{t('contact.form.email')}</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-accent transition-colors font-light"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-xs uppercase tracking-widest text-foreground/60">{t('contact.form.phone')}</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-accent transition-colors font-light"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="projectType" className="text-xs uppercase tracking-widest text-foreground/60">{t('contact.form.type')}</label>
                    <select 
                      id="projectType" 
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-accent transition-colors font-light appearance-none rounded-none"
                    >
                      <option value="residential">{t('type.residential')}</option>
                      <option value="commercial">{t('type.commercial')}</option>
                      <option value="hospitality">{t('type.hospitality')}</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs uppercase tracking-widest text-foreground/60">{t('contact.form.message')}</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-accent transition-colors font-light resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitLead.isPending}
                    className="w-full border border-foreground/20 px-8 py-4 text-sm uppercase tracking-widest hover:bg-foreground hover:text-white transition-all duration-500 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-foreground"
                  >
                    {submitLead.isPending ? t('contact.form.submitting') : t('contact.form.submit')}
                  </button>
                  
                  {submitLead.isError && (
                    <p className="text-destructive text-sm text-center">
                      {locale === 'en' ? 'An error occurred. Please try again.' : 'Произошла ошибка. Пожалуйста, попробуйте еще раз.'}
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