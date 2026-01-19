import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { documents } from '@/data/documents';

type ThemeMode = 'light' | 'dark' | 'sepia';

interface SearchResult {
  documentId: number;
  documentTitle: string;
  year: number;
  matches: {
    text: string;
    highlight: string;
  }[];
  relevance: number;
}

const Search = () => {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    const themes: ThemeMode[] = ['light', 'dark', 'sepia'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
    document.documentElement.classList.remove('light', 'dark', 'sepia');
    document.documentElement.classList.add(nextTheme);
  };

  const handleSearch = () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    setTimeout(() => {
      const searchQuery = query.toLowerCase();
      const foundResults: SearchResult[] = [];

      documents.forEach(doc => {
        const matches: { text: string; highlight: string }[] = [];
        let relevanceScore = 0;

        const contentArray = doc.content[language];
        contentArray.forEach(paragraph => {
          const lowerParagraph = paragraph.toLowerCase();
          if (lowerParagraph.includes(searchQuery)) {
            const index = lowerParagraph.indexOf(searchQuery);
            const start = Math.max(0, index - 50);
            const end = Math.min(paragraph.length, index + searchQuery.length + 50);
            
            let excerpt = paragraph.substring(start, end);
            if (start > 0) excerpt = '...' + excerpt;
            if (end < paragraph.length) excerpt = excerpt + '...';

            matches.push({
              text: excerpt,
              highlight: searchQuery
            });
            relevanceScore += 20;
          }
        });

        if (matches.length > 0) {
          foundResults.push({
            documentId: doc.id,
            documentTitle: doc.title,
            year: doc.year,
            matches,
            relevance: Math.min(100, relevanceScore)
          });
        }
      });

      foundResults.sort((a, b) => b.relevance - a.relevance);
      setResults(foundResults);
      setIsSearching(false);
    }, 300);
  };

  const highlightText = (text: string, highlight: string) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() 
        ? <mark key={i} className="bg-accent/30 text-accent font-medium">{part}</mark>
        : part
    );
  };

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
                  {language === 'ru' ? 'Поиск' : 'Search'}
                </h2>
                <div className="font-mono text-xs text-muted-foreground">
                  {language === 'ru' ? 'Полнотекстовый' : 'Full-text'}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <Card className="p-4">
                  <div className="text-xs font-mono uppercase text-muted-foreground mb-3">
                    {language === 'ru' ? 'Результаты' : 'Results'}
                  </div>
                  <div className="text-3xl font-mono font-bold text-accent mb-1">
                    {results.length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {language === 'ru' 
                      ? `${results.length === 0 ? 'документов' : results.length === 1 ? 'документ' : 'документов'} найдено`
                      : `${results.length === 1 ? 'document' : 'documents'} found`}
                  </div>
                </Card>

                {results.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="text-xs font-mono uppercase text-muted-foreground mb-2">
                        {language === 'ru' ? 'По документам' : 'By documents'}
                      </div>
                      {results.map(result => (
                        <button
                          key={result.documentId}
                          onClick={() => navigate(`/document/${result.documentId}`)}
                          className="w-full text-left p-3 rounded-sm border border-border hover:border-accent transition-colors"
                        >
                          <div className="font-serif text-sm font-medium mb-1">
                            {result.documentTitle}
                          </div>
                          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                            <span>{result.year}</span>
                            <span>•</span>
                            <span>{result.matches.length} {language === 'ru' ? 'совп.' : 'matches'}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase text-muted-foreground mb-2">
                    {language === 'ru' ? 'Подсказки' : 'Tips'}
                  </div>
                  <div className="text-xs text-foreground/70 space-y-1">
                    <div>• {language === 'ru' ? 'Используйте ключевые слова' : 'Use keywords'}</div>
                    <div>• {language === 'ru' ? 'Поиск без учёта регистра' : 'Case-insensitive search'}</div>
                    <div>• {language === 'ru' ? 'Ищите по темам' : 'Search by topics'}</div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </aside>

        <main className="flex-1 flex flex-col">
          <header className="border-b border-border bg-card">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4 flex-1 max-w-2xl">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder={language === 'ru' ? 'Поиск в архиве...' : 'Search in archive...'}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="font-serif pr-10"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleSearch}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    disabled={isSearching}
                  >
                    <Icon name={isSearching ? "Loader2" : "Search"} size={16} className={isSearching ? "animate-spin" : ""} />
                  </Button>
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
            <div className="max-w-5xl mx-auto p-8">
              {!query && results.length === 0 && (
                <div className="text-center py-16 fade-in-up">
                  <Icon name="Search" size={64} className="mx-auto mb-6 text-muted-foreground opacity-50" />
                  <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
                    {language === 'ru' ? 'Поиск по архиву' : 'Archive Search'}
                  </h2>
                  <p className="font-serif text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
                    {language === 'ru'
                      ? 'Введите ключевые слова для поиска в текстах 2010-2011 годов. Система ищет точные совпадения и контекст.'
                      : 'Enter keywords to search in 2010-2011 texts. System searches for exact matches and context.'}
                  </p>
                  <div className="flex gap-2 justify-center flex-wrap">
                    {['виртуальное пространство', 'банковские клубы', 'приватизация', 'цифровизация', 'глобализация'].map(tag => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                        onClick={() => {
                          setQuery(tag);
                          setTimeout(handleSearch, 100);
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {query && results.length === 0 && !isSearching && (
                <div className="text-center py-16 fade-in-up">
                  <Icon name="FileX" size={64} className="mx-auto mb-6 text-muted-foreground opacity-50" />
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                    {language === 'ru' ? 'Ничего не найдено' : 'Nothing found'}
                  </h2>
                  <p className="font-serif text-base text-foreground/70">
                    {language === 'ru'
                      ? `По запросу "${query}" совпадений не обнаружено`
                      : `No matches found for "${query}"`}
                  </p>
                </div>
              )}

              {results.length > 0 && (
                <div className="space-y-6">
                  <div className="fade-in-up">
                    <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
                      {language === 'ru' ? 'Результаты поиска' : 'Search Results'}
                    </h2>
                    <p className="font-mono text-sm text-muted-foreground">
                      {language === 'ru' ? 'Найдено' : 'Found'} {results.length} {language === 'ru' ? 'документов' : 'documents'} • {language === 'ru' ? 'запрос' : 'query'}: "{query}"
                    </p>
                  </div>

                  <div className="space-y-4">
                    {results.map((result, idx) => (
                      <Card
                        key={result.documentId}
                        className="p-6 fade-in-up hover:shadow-lg transition-shadow cursor-pointer"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                        onClick={() => navigate(`/document/${result.documentId}`)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-serif text-xl font-bold text-foreground mb-1">
                              {result.documentTitle}
                            </h3>
                            <div className="font-mono text-xs text-muted-foreground">
                              {result.year} • {result.matches.length} {language === 'ru' ? 'совпадений' : 'matches'}
                            </div>
                          </div>
                          <Badge variant="secondary" className="font-mono">
                            {result.relevance}%
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          {result.matches.slice(0, 3).map((match, i) => (
                            <div key={i} className="border-l-2 border-muted pl-4 py-2">
                              <p className="font-serif text-sm leading-relaxed text-foreground/90">
                                {highlightText(match.text, match.highlight)}
                              </p>
                            </div>
                          ))}
                          {result.matches.length > 3 && (
                            <div className="text-xs text-muted-foreground font-mono">
                              + {result.matches.length - 3} {language === 'ru' ? 'ещё совпадений' : 'more matches'}
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-border">
                          <button className="flex items-center gap-2 text-sm font-mono text-accent hover:underline">
                            {language === 'ru' ? 'Открыть документ' : 'Open document'}
                            <Icon name="ArrowRight" size={14} />
                          </button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
};

export default Search;