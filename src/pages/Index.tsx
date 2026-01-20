import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { documents } from '@/data/documents';
import { SEO } from '@/components/SEO';

type ThemeMode = 'light' | 'dark' | 'sepia';

const Index = () => {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');
  const [activeSection, setActiveSection] = useState('main');

  const toggleTheme = () => {
    const themes: ThemeMode[] = ['light', 'dark', 'sepia'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
    document.documentElement.classList.remove('light', 'dark', 'sepia');
    document.documentElement.classList.add(nextTheme);
  };

  const texts = {
    ru: {
      manifesto: {
        title: 'Архив времени',
        subtitle: 'Тексты, написанные 15 лет назад. Они не предсказывали будущее. Они описывали логику процессов. Время проявило их суть. Без триумфа, без оправданий. Просто фиксация.',
        stamp: 'ДЕКЛАССИФИЦИРОВАНО',
        date: '28.05.2010 → 18.01.2026'
      },
      about: {
        title: 'О времени написания',
        text: 'Эти тексты созданы в период 2010–2011 годов, когда мир выглядел иначе: перестройка в России казалась завершённой, глобализация — неизбежной, а цифровая революция — только набирала обороты. Тогда такие идеи казались радикальными или даже утопичными.'
      },
      sections: {
        main: 'Главная',
        texts: 'Тексты',
        timeline: 'Временная шкала',
        then_now: 'Тогда и сейчас',
        search: 'Поиск',
        people_forgot: 'Люди просто забыли',
        reminder: 'Напоминание',
        author: 'Об авторе',
        contact: 'Контакты',
        heatmap: 'Тепловая карта'
      }
    },
    en: {
      manifesto: {
        title: 'Time Archive',
        subtitle: 'Texts written 15 years ago. They were not prophecies. They were an understanding of processes. Time has revealed their essence. Without triumph, without excuses. Just fixation.',
        stamp: 'DECLASSIFIED',
        date: '28.05.2010 → 18.01.2026'
      },
      about: {
        title: 'About the Time of Writing',
        text: 'These texts were created in the period of 2010–2011, when the world looked different: perestroika in Russia seemed completed, globalization inevitable, and the digital revolution was just gaining momentum. Back then, such ideas appeared radical or even utopian.'
      },
      sections: {
        main: 'Main',
        texts: 'Texts',
        timeline: 'Timeline',
        then_now: 'Then and Now',
        search: 'Search',
        people_forgot: 'People Forgot',
        reminder: 'Reminder',
        author: 'About Author',
        contact: 'Contact',
        heatmap: 'Heatmap'
      }
    }
  };

  const t = texts[language];

  const documentCards = documents.map(doc => ({
    id: doc.id,
    title: doc.title,
    year: doc.year,
    preview: doc.content[language][0].substring(0, 120) + '...',
    views: doc.id === 1 ? 2847 : doc.id === 2 ? 3621 : doc.id === 3 ? 1893 : 1256,
    relevance: doc.id === 1 ? 94 : doc.id === 2 ? 98 : doc.id === 3 ? 89 : 76
  }));

  return (
    <>
      <SEO 
        title="Архив документов 2010-2011"
        description="Цифровой архив документов 2010-2011 годов. Исследуйте свидетельства эпохи через призму времени."
        keywords="архив 2010-2011, исторические документы, цифровой архив, свидетельства эпохи, социальная история"
      />
      <div className={`min-h-screen paper-texture ${theme}`}>
        <div className="flex h-screen">
        <aside className="w-80 border-r border-border bg-sidebar">
          <ScrollArea className="h-full">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="font-serif text-2xl font-bold text-sidebar-foreground mb-2">
                  {t.manifesto.title}
                </h2>
                <div className="font-mono text-xs text-muted-foreground space-y-1">
                  <div className="text-accent font-medium">{t.manifesto.stamp}</div>
                  <div>{t.manifesto.date}</div>
                </div>
              </div>

              <Separator className="my-4" />

              <nav className="space-y-2">
                {Object.entries(t.sections).map(([key, label]) => {
                  const handleClick = () => {
                    if (key === 'timeline') {
                      window.location.href = '/timeline';
                    } else if (key === 'then_now') {
                      window.location.href = '/then-now';
                    } else if (key === 'search') {
                      window.location.href = '/search';
                    } else if (key === 'people_forgot') {
                      window.location.href = '/people-forgot';
                    } else if (key === 'reminder') {
                      window.location.href = '/reminder';
                    } else if (key === 'author') {
                      window.location.href = '/author';
                    } else if (key === 'contact') {
                      window.location.href = '/contact';
                    } else {
                      setActiveSection(key);
                    }
                  };

                  return (
                    <button
                      key={key}
                      onClick={handleClick}
                      className={`w-full text-left px-3 py-2 rounded-sm text-sm transition-colors ${
                        activeSection === key
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </nav>

              <Separator className="my-6" />

              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase text-muted-foreground tracking-wide">
                  {language === 'ru' ? 'Документы' : 'Documents'}
                </h3>
                {documentCards.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => window.location.href = `/document/${doc.id}`}
                    className="w-full text-left p-3 rounded-sm border border-border hover:border-accent transition-colors group"
                  >
                    <div className="font-serif text-sm font-medium mb-1 group-hover:text-accent transition-colors">
                      {doc.title}
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {doc.year}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </ScrollArea>
        </aside>

        <main className="flex-1 flex flex-col">
          <header className="border-b border-border bg-card">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="font-mono text-xs text-muted-foreground">
                  {language === 'ru' ? 'Страница 1 из 7' : 'Page 1 of 7'}
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
                  {t.manifesto.stamp}
                  <div className="text-muted-foreground mt-1 text-center">{t.manifesto.date}</div>
                </div>

                <div className="pt-16 space-y-8 fade-in-up">
                  <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight tracking-tight">
                    {t.manifesto.title}
                  </h1>
                  
                  <p className="font-serif text-xl md:text-2xl leading-relaxed text-foreground/90 max-w-4xl">
                    {t.manifesto.subtitle}
                  </p>
                </div>
              </div>

              <Separator className="my-12" />

              <section className="space-y-6 fade-in-up" style={{animationDelay: '0.2s'}}>
                <h2 className="font-serif text-3xl font-bold text-foreground document-line pb-4">
                  {t.about.title}
                </h2>
                <p className="font-serif text-lg leading-relaxed text-foreground/90">
                  {t.about.text}
                </p>
              </section>

              <section className="space-y-6 fade-in-up" style={{animationDelay: '0.4s'}}>
                <h2 className="font-serif text-3xl font-bold text-foreground document-line pb-4">
                  {language === 'ru' ? 'Что увидит читатель' : 'What the Reader Will See'}
                </h2>
                <ul className="space-y-3 font-serif text-lg leading-relaxed text-foreground/90">
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1.5">•</span>
                    <span>{language === 'ru' ? 'Оригинальные тексты без изменений' : 'Original texts without changes'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1.5">•</span>
                    <span>{language === 'ru' ? 'Без современных правок или адаптаций' : 'Without modern edits or adaptations'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1.5">•</span>
                    <span>{language === 'ru' ? 'С дистанцией времени для самостоятельного анализа' : 'With the distance of time for independent analysis'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1.5">•</span>
                    <span>{language === 'ru' ? 'Как документ эпохи' : 'As a document of the era'}</span>
                  </li>
                </ul>
              </section>

              <section className="space-y-6 fade-in-up" style={{animationDelay: '0.6s'}}>
                <h2 className="font-serif text-3xl font-bold text-foreground document-line pb-4">
                  {language === 'ru' ? 'Ключевые документы архива' : 'Key Archive Documents'}
                </h2>
                <div className="grid md:grid-cols-2 gap-4 mb-12">
                  <Card 
                    className="p-6 border-2 border-accent/50 bg-accent/5 hover:bg-accent/10 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => window.location.href = '/reminder'}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                        <Icon name="AlertCircle" size={24} className="text-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                          {language === 'ru' ? 'Напоминание' : 'Reminder'}
                        </h3>
                        <p className="text-sm text-foreground/80 font-serif mb-3">
                          {language === 'ru' 
                            ? 'Документ о приватизации России. Анализ механизмов 1985-2010 годов и предупреждение о последствиях.'
                            : 'Document on Russia\'s privatization. Analysis of 1985-2010 mechanisms and warning about consequences.'}
                        </p>
                        <div className="font-mono text-xs text-accent">
                          2010-2011 → {language === 'ru' ? 'Критически важно' : 'Critically important'}
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card 
                    className="p-6 border-2 border-primary/50 bg-primary/5 hover:bg-primary/10 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => window.location.href = '/author'}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Icon name="User" size={24} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                          {language === 'ru' ? 'Об авторе' : 'About Author'}
                        </h3>
                        <p className="text-sm text-foreground/80 font-serif mb-3">
                          {language === 'ru'
                            ? 'Философский контекст проекта. О природе истины, роли выдающихся людей и выборе пути.'
                            : 'Philosophical context of the project. On the nature of truth, role of outstanding people and choice of path.'}
                        </p>
                        <div className="font-mono text-xs text-primary">
                          {language === 'ru' ? 'Философия архива' : 'Archive philosophy'}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </section>

              <section className="space-y-6 fade-in-up" style={{animationDelay: '0.8s'}}>
                <h2 className="font-serif text-3xl font-bold text-foreground document-line pb-4">
                  {language === 'ru' ? 'Тепловая карта популярности' : 'Popularity Heatmap'}
                </h2>
                <div className="grid gap-4">
                  {documentCards.map((doc, idx) => (
                    <Card key={doc.id} className="p-4 hover:shadow-md transition-shadow" style={{animationDelay: `${0.8 + idx * 0.1}s`}}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-serif font-bold text-lg mb-1">{doc.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3 font-serif">{doc.preview}</p>
                          <div className="flex items-center gap-4 font-mono text-xs">
                            <span className="text-muted-foreground">{doc.year}</span>
                            <span className="flex items-center gap-1">
                              <Icon name="Eye" size={12} />
                              {doc.views}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className={`font-mono text-2xl font-bold ${
                            doc.relevance >= 90 ? 'text-accent' : 'text-muted-foreground'
                          }`}>
                            {doc.relevance}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {language === 'ru' ? 'актуальность' : 'relevance'}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>

              <div className="pt-12 pb-8 border-t border-border">
                <div className="flex items-center justify-between mb-6">
                  <div className="font-mono text-xs text-muted-foreground">
                    {language === 'ru' ? 'Страница 1 из 7' : 'Page 1 of 7'}
                  </div>
                  <button
                    onClick={() => window.location.href = '/contact'}
                    className="font-mono text-xs text-accent hover:text-accent/80 transition-colors flex items-center gap-2"
                  >
                    <Icon name="Mail" size={14} />
                    {language === 'ru' ? 'Связаться с нами' : 'Contact us'}
                  </button>
                </div>
                <div className="text-center font-mono text-xs text-muted-foreground">
                  © 2010-2026 {language === 'ru' ? 'Архив Времени' : 'Time Archive'}
                </div>
              </div>
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
    </>
  );
};

export default Index;