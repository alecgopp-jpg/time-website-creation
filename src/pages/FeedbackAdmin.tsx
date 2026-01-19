import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

type ThemeMode = 'light' | 'dark' | 'sepia';

interface FeedbackMessage {
  id: number;
  name: string;
  email: string;
  category: string;
  message: string;
  created_at: string;
  status: string;
  telegram_sent: boolean;
  notes?: string;
}

const FeedbackAdmin = () => {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const navigate = useNavigate();

  const toggleTheme = () => {
    const themes: ThemeMode[] = ['light', 'dark', 'sepia'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
    document.documentElement.classList.remove('light', 'dark', 'sepia');
    document.documentElement.classList.add(nextTheme);
  };

  useEffect(() => {
    loadMessages();
  }, [filter]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const url = filter 
        ? `https://functions.poehali.dev/2d8dcb7a-cc3a-4e32-9cbe-ae200bc103a3?status=${filter}`
        : 'https://functions.poehali.dev/2d8dcb7a-cc3a-4e32-9cbe-ae200bc103a3';
      
      const response = await fetch(url);
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoryLabels: Record<string, string> = {
    feedback: 'Отзыв',
    research: 'Исследование',
    media: 'СМИ',
    other: 'Другое'
  };

  const statusLabels: Record<string, string> = {
    new: 'Новое',
    read: 'Прочитано',
    replied: 'Отвечено',
    archived: 'Архив'
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
                <span className="font-mono text-sm">К архиву</span>
              </button>

              <div className="mb-6">
                <h2 className="font-serif text-2xl font-bold text-sidebar-foreground mb-2">
                  Сообщения
                </h2>
                <div className="font-mono text-xs text-muted-foreground">
                  Администрирование
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-mono uppercase text-muted-foreground tracking-wide mb-2">
                  Фильтр
                </h3>
                {['', 'new', 'read', 'replied', 'archived'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`block w-full text-left px-3 py-1.5 text-xs font-serif rounded-sm transition-colors ${
                      filter === status
                        ? 'text-accent bg-sidebar-accent/50'
                        : 'text-sidebar-foreground hover:text-accent hover:bg-sidebar-accent/50'
                    }`}
                  >
                    {status === '' ? 'Все сообщения' : statusLabels[status]}
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
                  Всего сообщений: {messages.length}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  <Icon name="Palette" size={16} />
                </Button>
                <Button variant="outline" size="sm" onClick={loadMessages}>
                  <Icon name="RefreshCw" size={14} className="mr-2" />
                  Обновить
                </Button>
              </div>
            </div>
          </header>

          <ScrollArea className="flex-1">
            <div className="container max-w-5xl mx-auto p-8 space-y-6">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  Загрузка...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Сообщений не найдено
                </div>
              ) : (
                messages.map((msg) => (
                  <Card key={msg.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-serif text-lg font-bold text-foreground">
                            {msg.name}
                          </h3>
                          <Badge variant="outline">
                            {categoryLabels[msg.category]}
                          </Badge>
                          <Badge variant={msg.status === 'new' ? 'default' : 'secondary'}>
                            {statusLabels[msg.status]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Icon name="Mail" size={14} />
                            {msg.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="Clock" size={14} />
                            {new Date(msg.created_at).toLocaleString('ru-RU')}
                          </span>
                          {msg.telegram_sent && (
                            <span className="flex items-center gap-1 text-green-600">
                              <Icon name="Send" size={14} />
                              Отправлено в Telegram
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-xs font-mono text-muted-foreground">
                        #{msg.id}
                      </div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-sm">
                      <p className="font-serif text-base text-foreground whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>
                    {msg.notes && (
                      <div className="mt-3 p-3 bg-accent/10 rounded-sm border-l-2 border-accent">
                        <div className="text-xs font-mono text-muted-foreground mb-1">
                          Примечание:
                        </div>
                        <p className="font-serif text-sm text-foreground">
                          {msg.notes}
                        </p>
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
};

export default FeedbackAdmin;
