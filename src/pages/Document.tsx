import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { useNavigate, useParams } from 'react-router-dom';

type ThemeMode = 'light' | 'dark' | 'sepia';

const Document = () => {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');
  const [revealedParagraphs, setRevealedParagraphs] = useState<number>(0);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const docId = parseInt(id || '1');

  const toggleTheme = () => {
    const themes: ThemeMode[] = ['light', 'dark', 'sepia'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
    document.documentElement.classList.remove('light', 'dark', 'sepia');
    document.documentElement.classList.add(nextTheme);
  };

  const documentContent = {
    1: {
      title: 'G.O.B.',
      year: 2010,
      date: '28.05.2010',
      paragraphs: [
        'Цель: создание на территории России или другой выбранной для проекта территории, свободных международных ЦОДов (виртуального пространства), не имеющего статуса конкретной государственной принадлежности, а имеющего статус свободного международного виртуального консорциума, ни у кого не находящегося в частной собственности, являющегося международной организационной структурой на территории России.',
        'Предпосылки для реализации проекта заключаются в создании условий для формирования глобальной инфраструктуры, которая будет функционировать вне рамок традиционных государственных границ. Это предполагает разработку принципиально новой модели управления цифровым пространством.',
        'Основная идея состоит в том, что виртуальное пространство не должно принадлежать отдельным государствам или корпорациям. Оно должно существовать как независимая международная структура, доступная всем участникам на равных условиях.',
        'Техническая реализация проекта требует создания распределённой сети дата-центров, которые будут физически расположены на территории России, но юридически не будут подчиняться её законодательству в полной мере.',
        'Экономическая модель проекта основывается на принципе коллективного владения и управления. Никто не может претендовать на единоличное право собственности на эту инфраструктуру.',
        'Политические аспекты реализации связаны с необходимостью согласования интересов различных государств и международных организаций. Это потребует длительных переговоров и создания новых правовых механизмов.',
        'В долгосрочной перспективе такая структура может стать прототипом для других международных цифровых консорциумов, которые будут создаваться в различных регионах мира.'
      ]
    },
    2: {
      title: 'Кто приватизирует Россию?',
      year: 2010,
      date: '15.08.2010',
      paragraphs: [
        'Они считают себя самыми умными и хитрыми. Они уверены в том, что придуманная схема экономического геноцида народа этой страны: нищета, пьянство, наркомания, отсутствие медицины, образования, работы, права выбора в жизни – принадлежит им.',
        'Механизмы приватизации выходят далеко за рамки простой передачи государственной собственности в частные руки. Речь идёт о системной трансформации всех сфер общественной жизни.',
        'Банковские клубы играют ключевую роль в этом процессе. Они контролируют потоки капитала и определяют правила игры на финансовых рынках.',
        'Образовательная система целенаправленно деградирует, чтобы создать поколение, не способное критически мыслить и противостоять манипуляциям.',
        'Здравоохранение превращается в коммерческую индустрию, где доступ к качественной медицине определяется финансовым статусом.',
        'Средства массовой информации формируют нужную картину мира, отвлекая внимание от реальных процессов перераспределения ресурсов.',
        'Конечная цель – полный контроль над территорией и населением через экономические механизмы, без необходимости прямой военной оккупации.'
      ]
    }
  };

  const doc = documentContent[docId as keyof typeof documentContent] || documentContent[1];

  useEffect(() => {
    const timer = setInterval(() => {
      setRevealedParagraphs((prev) => {
        if (prev < doc.paragraphs.length) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [doc.paragraphs.length]);

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
                <h2 className="font-serif text-xl font-bold text-sidebar-foreground mb-2">
                  {doc.title}
                </h2>
                <div className="font-mono text-xs text-muted-foreground space-y-1">
                  <div className="text-accent font-medium">
                    {language === 'ru' ? 'ДЕКЛАССИФИЦИРОВАНО' : 'DECLASSIFIED'}
                  </div>
                  <div>{doc.date}</div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div>
                  <div className="text-xs font-mono uppercase text-muted-foreground mb-2">
                    {language === 'ru' ? 'Содержание' : 'Contents'}
                  </div>
                  <div className="space-y-2">
                    {doc.paragraphs.map((_, idx) => (
                      <div
                        key={idx}
                        className={`font-mono text-xs py-1 px-2 rounded transition-colors ${
                          idx < revealedParagraphs
                            ? 'text-foreground bg-sidebar-accent/30'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {language === 'ru' ? 'Абзац' : 'Paragraph'} {idx + 1}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="text-xs font-mono uppercase text-muted-foreground mb-2">
                    {language === 'ru' ? 'Прогресс чтения' : 'Reading progress'}
                  </div>
                  <div className="bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-accent h-full transition-all duration-300"
                      style={{
                        width: `${(revealedParagraphs / doc.paragraphs.length) * 100}%`
                      }}
                    />
                  </div>
                  <div className="font-mono text-xs text-muted-foreground mt-2">
                    {revealedParagraphs} / {doc.paragraphs.length}
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </aside>

        <main className="flex-1 flex flex-col">
          <header className="border-b border-border bg-card">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="font-mono text-xs text-muted-foreground">
                  {language === 'ru' ? 'Документ' : 'Document'} #{docId}
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
                <div className="absolute top-0 right-0 font-mono text-xs text-accent border border-accent px-3 py-1.5 bg-background/80 backdrop-blur">
                  {language === 'ru' ? 'ДЕКЛАССИФИЦИРОВАНО' : 'DECLASSIFIED'}
                  <div className="text-muted-foreground mt-1">{doc.date}</div>
                </div>

                <div className="pt-16 space-y-4">
                  <div className="font-mono text-sm text-muted-foreground">
                    {doc.year}
                  </div>
                  <h1 className="font-serif text-5xl font-bold text-foreground leading-tight">
                    {doc.title}
                  </h1>
                </div>
              </div>

              <Separator className="my-12" />

              <div className="space-y-8">
                {doc.paragraphs.map((paragraph, idx) => (
                  <p
                    key={idx}
                    className={`font-serif text-lg leading-relaxed text-foreground/90 transition-opacity duration-600 ${
                      idx < revealedParagraphs ? 'fade-in-up opacity-100' : 'opacity-0'
                    }`}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

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
                    {language === 'ru' ? 'Конец документа' : 'End of document'}
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

export default Document;