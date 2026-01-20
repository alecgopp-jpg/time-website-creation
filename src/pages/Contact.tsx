import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ContactHeader } from '@/components/contact/ContactHeader';
import { ContactSidebar } from '@/components/contact/ContactSidebar';
import { ContactContent } from '@/components/contact/ContactContent';
import { ContactForm } from '@/components/contact/ContactForm';
import { SEO } from '@/components/SEO';

type ThemeMode = 'light' | 'dark' | 'sepia';

const Contact = () => {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');

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
    <>
      <SEO 
        title="Контакты и обратная связь"
        description="Свяжитесь с нами для обсуждения документов архива 2010-2011. Приветствуем исследователей, журналистов и всех заинтересованных."
        keywords="контакты архив, обратная связь, исследователи, сотрудничество"
      />
      <div className={`min-h-screen paper-texture ${theme}`}>
      <div className="flex h-screen">
        <aside className="w-80 border-r border-border bg-sidebar">
          <ScrollArea className="h-full">
            <div className="p-6">
              <ContactHeader
                language={language}
                theme={theme}
                onToggleLanguage={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
                onToggleTheme={toggleTheme}
              />
              <ContactSidebar sections={t.sections} />
            </div>
          </ScrollArea>
        </aside>

        <main className="flex-1">
          <ScrollArea className="h-full">
            <div className="max-w-4xl mx-auto p-8">
              <ContactContent
                language={language}
                title={t.title}
                subtitle={t.subtitle}
                intro={t.intro}
                community={t.community}
                guidelines={t.guidelines}
                note={t.note}
              />
              <ContactForm language={language} formContent={t.form} />
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
    </>
  );
};

export default Contact;