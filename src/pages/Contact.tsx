import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

type ThemeMode = 'light' | 'dark' | 'sepia';

const Contact = () => {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'feedback',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://functions.poehali.dev/1fb58332-456a-4830-959c-06dc2cca6153', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: language === 'ru' ? 'Сообщение отправлено' : 'Message sent',
          description: language === 'ru' 
            ? 'Спасибо за обратную связь. Мы свяжемся с вами в ближайшее время.'
            : 'Thank you for your feedback. We will contact you soon.',
        });
        setFormData({ name: '', email: '', category: 'feedback', message: '' });
      } else {
        toast({
          title: language === 'ru' ? 'Ошибка отправки' : 'Sending error',
          description: language === 'ru'
            ? 'Не удалось отправить сообщение. Попробуйте позже.'
            : 'Failed to send message. Please try again later.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Error',
        description: language === 'ru'
          ? 'Произошла ошибка. Проверьте соединение и попробуйте снова.'
          : 'An error occurred. Check your connection and try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTheme = () => {
    const themes: ThemeMode[] = ['light', 'dark', 'sepia'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
    document.documentElement.classList.remove('light', 'dark', 'sepia');
    document.documentElement.classList.add(nextTheme);
  };

  const content = {
    ru: {
      title: 'КОНТАКТЫ И ОТЗЫВЫ',
      subtitle: 'Обратная связь',
      intro: 'Этот архив создан для диалога. Ваши мысли, анализ и критика важны. Мы приветствуем конструктивное обсуждение идей, изложенных в документах 2010-2011 годов.',
      sections: [
        {
          title: 'Для отзывов и комментариев',
          icon: 'MessageSquare',
          items: [
            'Поделитесь своим анализом документов',
            'Укажите на обнаруженные закономерности',
            'Предложите альтернативные интерпретации',
            'Задайте вопросы о контексте эпохи'
          ]
        },
        {
          title: 'Для исследователей',
          icon: 'BookOpen',
          items: [
            'Запросы на дополнительные материалы',
            'Вопросы об источниках и методологии',
            'Предложения о сотрудничестве',
            'Академические дискуссии'
          ]
        },
        {
          title: 'Для журналистов',
          icon: 'Newspaper',
          items: [
            'Запросы на интервью или комментарии',
            'Вопросы о контексте публикации',
            'Разрешения на цитирование',
            'Фактологические уточнения'
          ]
        }
      ],
      community: {
        title: 'Сообщество',
        text: 'Присоединяйтесь к обсуждению в нашем телеграм-сообществе:',
        link: 'https://t.me/timearchive2010'
      },
      guidelines: {
        title: 'Правила общения',
        items: [
          'Мы ценим аргументированную критику',
          'Приветствуются факты и логические выводы',
          'Уважайте альтернативные точки зрения',
          'Фокусируйтесь на идеях, а не на личностях',
          'Сомнение — путь к истине, а не препятствие'
        ]
      },
      note: 'Все сообщения рассматриваются. Ответы публикуются выборочно, если они представляют интерес для широкой аудитории. Время — лучший фильтр для истины.',
      form: {
        title: 'Форма обратной связи',
        name: 'Ваше имя',
        email: 'Email',
        category: 'Категория обращения',
        categories: {
          feedback: 'Отзыв / Комментарий',
          research: 'Исследование',
          media: 'СМИ',
          other: 'Другое'
        },
        message: 'Сообщение',
        submit: 'Отправить',
        sending: 'Отправка...'
      }
    },
    en: {
      title: 'CONTACTS AND FEEDBACK',
      subtitle: 'Feedback',
      intro: 'This archive is created for dialogue. Your thoughts, analysis and criticism are important. We welcome constructive discussion of ideas presented in documents from 2010-2011.',
      sections: [
        {
          title: 'For reviews and comments',
          icon: 'MessageSquare',
          items: [
            'Share your analysis of documents',
            'Point out discovered patterns',
            'Suggest alternative interpretations',
            'Ask questions about the context of the era'
          ]
        },
        {
          title: 'For researchers',
          icon: 'BookOpen',
          items: [
            'Requests for additional materials',
            'Questions about sources and methodology',
            'Collaboration proposals',
            'Academic discussions'
          ]
        },
        {
          title: 'For journalists',
          icon: 'Newspaper',
          items: [
            'Interview or comment requests',
            'Questions about publication context',
            'Citation permissions',
            'Factual clarifications'
          ]
        }
      ],
      community: {
        title: 'Community',
        text: 'Join the discussion in our Telegram community:',
        link: 'https://t.me/timearchive2010'
      },
      guidelines: {
        title: 'Communication rules',
        items: [
          'We value reasoned criticism',
          'Facts and logical conclusions are welcome',
          'Respect alternative viewpoints',
          'Focus on ideas, not personalities',
          'Doubt is the path to truth, not an obstacle'
        ]
      },
      note: 'All messages are reviewed. Responses are published selectively if they are of interest to a wide audience. Time is the best filter for truth.',
      form: {
        title: 'Feedback Form',
        name: 'Your name',
        email: 'Email',
        category: 'Category',
        categories: {
          feedback: 'Feedback / Comment',
          research: 'Research',
          media: 'Media',
          other: 'Other'
        },
        message: 'Message',
        submit: 'Send',
        sending: 'Sending...'
      }
    }
  };

  const t = content[language];

  return (
    <div className={`min-h-screen paper-texture ${theme}`}>
      <div className="flex h-screen">
        <aside className="w-80 border-r border-border bg-sidebar">
          <ScrollArea className="h-full">
            <div className="p-6">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-sidebar-foreground hover:text-accent transition-colors mb-6"
              >
                <Icon name="ArrowLeft" size={16} />
                <span className="font-mono text-sm">
                  {language === 'ru' ? 'К архиву' : 'Back to archive'}
                </span>
              </button>

              <div className="mb-6">
                <h2 className="font-serif text-2xl font-bold text-sidebar-foreground mb-2">
                  {language === 'ru' ? 'Контакты' : 'Contacts'}
                </h2>
                <div className="font-mono text-xs text-muted-foreground">
                  {language === 'ru' ? 'Обратная связь' : 'Feedback'}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <h3 className="text-xs font-mono uppercase text-muted-foreground tracking-wide mb-2">
                  {language === 'ru' ? 'Разделы' : 'Sections'}
                </h3>
                {t.sections.map((section, idx) => (
                  <a
                    key={idx}
                    href={`#section-${idx}`}
                    className="block px-3 py-1.5 text-xs font-serif text-sidebar-foreground hover:text-accent hover:bg-sidebar-accent/50 rounded-sm transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
                <a
                  href="#community"
                  className="block px-3 py-1.5 text-xs font-serif text-sidebar-foreground hover:text-accent hover:bg-sidebar-accent/50 rounded-sm transition-colors"
                >
                  {t.community.title}
                </a>
                <a
                  href="#guidelines"
                  className="block px-3 py-1.5 text-xs font-serif text-sidebar-foreground hover:text-accent hover:bg-sidebar-accent/50 rounded-sm transition-colors"
                >
                  {t.guidelines.title}
                </a>
                <a
                  href="#contact-form"
                  className="block px-3 py-1.5 text-xs font-serif text-sidebar-foreground hover:text-accent hover:bg-sidebar-accent/50 rounded-sm transition-colors"
                >
                  {t.form.title}
                </a>
              </div>
            </div>
          </ScrollArea>
        </aside>

        <main className="flex-1 flex flex-col">
          <header className="border-b border-border bg-card">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="font-mono text-xs text-muted-foreground">
                  {language === 'ru' ? 'Связь с архивом' : 'Archive communication'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
                  className="font-mono text-xs"
                >
                  {language.toUpperCase()}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="w-9 h-9 p-0"
                >
                  <Icon
                    name={theme === 'light' ? 'Sun' : theme === 'dark' ? 'Moon' : 'Eye'}
                    size={16}
                  />
                </Button>
              </div>
            </div>
          </header>

          <ScrollArea className="flex-1">
            <div className="max-w-4xl mx-auto p-8 space-y-12">
              <div className="relative">
                <div className="absolute top-0 right-0 stamp text-xs text-accent">
                  {language === 'ru' ? 'ОТКРЫТО' : 'OPEN'}
                  <div className="text-muted-foreground mt-1 text-center">
                    {language === 'ru' ? 'ДЛЯ СВЯЗИ' : 'FOR CONTACT'}
                  </div>
                </div>

                <div className="pt-16 space-y-8 fade-in-up">
                  <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight tracking-tight">
                    {t.title}
                  </h1>

                  <p className="font-serif text-xl text-muted-foreground">
                    {t.subtitle}
                  </p>
                </div>
              </div>

              <Separator className="my-12" />

              <div className="border-l-4 border-accent pl-6 my-8">
                <p className="font-serif text-lg leading-relaxed text-foreground/90">
                  {t.intro}
                </p>
              </div>

              <section className="space-y-6">
                {t.sections.map((section, idx) => (
                  <Card
                    key={idx}
                    id={`section-${idx}`}
                    className="p-6 fade-in-up scroll-mt-20"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center border-2 border-accent">
                        <Icon name={section.icon as any} size={20} className="text-accent" />
                      </div>
                      <div className="flex-1">
                        <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                          {section.title}
                        </h2>
                        <ul className="space-y-2 font-serif text-base text-foreground/90">
                          {section.items.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start gap-3">
                              <span className="text-accent mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                ))}
              </section>

              <section id="community" className="fade-in-up scroll-mt-20" style={{ animationDelay: '0.3s' }}>
                <Card className="p-6 border-2 border-primary/50 bg-primary/5">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon name="Users" size={20} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
                        {t.community.title}
                      </h2>
                      <p className="font-serif text-base text-foreground/90 mb-4">
                        {t.community.text}
                      </p>
                      <a
                        href={t.community.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-mono text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        <Icon name="ExternalLink" size={16} />
                        @timearchive2010
                      </a>
                    </div>
                  </div>
                </Card>
              </section>

              <section id="guidelines" className="fade-in-up scroll-mt-20" style={{ animationDelay: '0.4s' }}>
                <h2 className="font-serif text-3xl font-bold text-foreground document-line pb-4 mb-6">
                  {t.guidelines.title}
                </h2>
                <ul className="space-y-3 font-serif text-lg text-foreground/90">
                  {t.guidelines.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-accent mt-1.5">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <div className="bg-muted/30 p-6 rounded-sm border border-border">
                <p className="font-serif text-sm leading-relaxed text-foreground/80 italic">
                  {t.note}
                </p>
              </div>

              <section id="contact-form" className="fade-in-up scroll-mt-20" style={{ animationDelay: '0.5s' }}>
                <h2 className="font-serif text-3xl font-bold text-foreground document-line pb-4 mb-6">
                  {t.form.title}
                </h2>
                <Card className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="font-mono text-xs text-muted-foreground uppercase tracking-wide">
                          {t.form.name}
                        </label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="font-serif"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="font-mono text-xs text-muted-foreground uppercase tracking-wide">
                          {t.form.email}
                        </label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="font-serif"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="category" className="font-mono text-xs text-muted-foreground uppercase tracking-wide">
                        {t.form.category}
                      </label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 font-serif text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="feedback">{t.form.categories.feedback}</option>
                        <option value="research">{t.form.categories.research}</option>
                        <option value="media">{t.form.categories.media}</option>
                        <option value="other">{t.form.categories.other}</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="font-mono text-xs text-muted-foreground uppercase tracking-wide">
                        {t.form.message}
                      </label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        rows={6}
                        className="font-serif resize-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto font-mono"
                    >
                      {isSubmitting ? (
                        <>
                          <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                          {t.form.sending}
                        </>
                      ) : (
                        <>
                          <Icon name="Send" size={16} className="mr-2" />
                          {t.form.submit}
                        </>
                      )}
                    </Button>
                  </form>
                </Card>
              </section>

              <div className="pt-12 pb-8">
                <Separator className="mb-6" />
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="font-mono text-xs"
                  >
                    <Icon name="ArrowLeft" size={14} className="mr-2" />
                    {language === 'ru' ? 'К архиву' : 'Back to archive'}
                  </Button>
                  <div className="font-mono text-xs text-center text-muted-foreground">
                    {language === 'ru' ? 'Открыто для диалога' : 'Open for dialogue'}
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
};

export default Contact;