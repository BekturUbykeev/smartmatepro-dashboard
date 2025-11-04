import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Alert, AlertDescription } from '../ui/alert'
import { Label } from '../ui/label'
import { 
  CheckCircle, 
  AlertTriangle, 
  Rocket, 
  Settings, 
  MessageSquare,
  Calendar,
  Bell,
  Link,
  Play,
  Copy,
  ExternalLink
} from 'lucide-react'

interface PublishAndReviewProps {
  data: any
  onDataChange: (data: any) => void
}

export function PublishAndReview({ data, onDataChange }: PublishAndReviewProps) {
  const [publishState, setPublishState] = useState({
    isPublishing: false,
    isPublished: false,
    publishProgress: 0
  })

  const [botLinks, setBotLinks] = useState({
    whatsapp: 'https://wa.me/79001234567',
    telegram: 'https://t.me/your_barber_bot',
    website: 'https://smartmate.pro/book/your-id',
    qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PC9zdmc+'
  })

  // Проверка готовности разделов
  const sections = [
    {
      id: 'basic-info',
      name: 'Основная информация',
      icon: Settings,
      completed: !!(data?.businessName && data?.specialistName),
      issues: data?.businessName ? [] : ['Не указано название бизнеса']
    },
    {
      id: 'services',
      name: 'Услуги и цены',
      icon: Settings,
      completed: !!(data?.services && data?.services.length > 0),
      issues: data?.services?.length > 0 ? [] : ['Не добавлено ни одной услуги']
    },
    {
      id: 'booking',
      name: 'Логика записи',
      icon: Calendar,
      completed: true,
      issues: []
    },
    {
      id: 'chat',
      name: 'Поведение бота',
      icon: MessageSquare,
      completed: !!(data?.welcomeMessage),
      issues: data?.welcomeMessage ? [] : ['Не настроено приветственное сообщение']
    },
    {
      id: 'notifications',
      name: 'Уведомления',
      icon: Bell,
      completed: !!(data?.channels && data?.channels.length > 0),
      issues: data?.channels?.length > 0 ? [] : ['Не выбраны каналы уведомлений']
    },
    {
      id: 'integrations',
      name: 'Интеграции',
      icon: Link,
      completed: true,
      issues: []
    }
  ]

  const completedSections = sections.filter(s => s.completed).length
  const totalSections = sections.length
  const completionPercentage = (completedSections / totalSections) * 100

  const allIssues = sections.flatMap(s => s.issues)
  const hasIssues = allIssues.length > 0

  const handlePublish = async () => {
    if (hasIssues) return

    setPublishState({ isPublishing: true, isPublished: false, publishProgress: 0 })

    const steps = [
      'Проверка настроек...',
      'Создание бота...',
      'Настройка интеграций...',
      'Активация каналов...',
      'Генерация ссылок...',
      'Финальная проверка...'
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setPublishState(prev => ({
        ...prev,
        publishProgress: ((i + 1) / steps.length) * 100
      }))
    }

    setPublishState({
      isPublishing: false,
      isPublished: true,
      publishProgress: 100
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      {/* Проверка готовности */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>Проверка готовности</span>
          </CardTitle>
          <CardDescription>
            Убедитесь, что все разделы настроены корректно
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Готовность к запуску:</span>
              <span className="font-medium">{completedSections}/{totalSections} разделов</span>
            </div>
            <Progress value={completionPercentage} className="w-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <div 
                  key={section.id} 
                  className={`flex items-center space-x-3 p-3 rounded-lg border ${
                    section.completed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className={`p-1 rounded ${
                    section.completed ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      section.completed ? 'text-green-600' : 'text-red-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${
                      section.completed ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {section.name}
                    </p>
                    {section.issues.length > 0 && (
                      <p className="text-xs text-red-600 mt-1">
                        {section.issues[0]}
                      </p>
                    )}
                  </div>
                  {section.completed && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              )
            })}
          </div>

          {hasIssues && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Необходимо исправить следующие проблемы:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {allIssues.map((issue, index) => (
                    <li key={index} className="text-sm">{issue}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Сводка настроек */}
      <Card>
        <CardHeader>
          <CardTitle>Итоговая сводка</CardTitle>
          <CardDescription>
            Обзор всех настроек вашего AI-бота
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Бизнес-информация</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Название:</span>
                  <span>{data?.businessName || 'Не указано'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Специалист:</span>
                  <span>{data?.specialistName || 'Не указано'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Тип услуг:</span>
                  <span>{data?.serviceType || 'Не указано'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Услуги</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Количество услуг:</span>
                  <span>{data?.services?.length || 0}</span>
                </div>
                {data?.services?.length > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span>Цены от:</span>
                      <span>{Math.min(...data.services.map((s: any) => s.price))}₽</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Цены до:</span>
                      <span>{Math.max(...data.services.map((s: any) => s.price))}₽</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Общение</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Стиль:</span>
                  <span>{data?.tone === 'friendly' ? 'Дружелюбный' : data?.tone || 'Не настроен'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Допродажи:</span>
                  <span>{data?.upsellEnabled ? 'Включены' : 'Отключены'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Уведомления</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Каналы:</span>
                  <span>{data?.channels?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Напоминания:</span>
                  <span>{data?.reminders?.filter((r: any) => r.enabled).length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Публикация */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Rocket className="w-5 h-5" />
            <span>Запуск бота</span>
          </CardTitle>
          <CardDescription>
            Активируйте вашего AI-бота и начните принимать записи
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!publishState.isPublished && !publishState.isPublishing && (
            <div className="text-center py-8">
              <Rocket className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-muted-foreground mb-4">
                Все готово к запуску вашего AI-бота!
              </p>
              <Button 
                onClick={handlePublish}
                disabled={hasIssues}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Запустить бота
              </Button>
              {hasIssues && (
                <p className="text-sm text-red-600 mt-2">
                  Сначала исправьте все проблемы выше
                </p>
              )}
            </div>
          )}

          {publishState.isPublishing && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
              <p className="text-blue-600 mb-4">Активируем вашего бота...</p>
              <Progress value={publishState.publishProgress} className="w-full max-w-sm mx-auto" />
              <p className="text-sm text-muted-foreground mt-2">
                {Math.round(publishState.publishProgress)}%
              </p>
            </div>
          )}

          {publishState.isPublished && (
            <div className="space-y-6">
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-green-800 mb-2">Бот успешно запущен! 🎉</h3>
                <p className="text-green-600">
                  Ваш AI-бот активен и готов принимать записи от клиентов
                </p>
              </div>

              {/* Ссылки для клиентов */}
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-900">Ссылки для клиентов</CardTitle>
                  <CardDescription className="text-green-700">
                    Поделитесь этими ссылками с клиентами для записи
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-green-800">WhatsApp</Label>
                    <div className="flex items-center space-x-2">
                      <input 
                        readOnly 
                        value={botLinks.whatsapp}
                        className="flex-1 px-3 py-2 text-sm border rounded bg-white"
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(botLinks.whatsapp)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-green-800">Telegram</Label>
                    <div className="flex items-center space-x-2">
                      <input 
                        readOnly 
                        value={botLinks.telegram}
                        className="flex-1 px-3 py-2 text-sm border rounded bg-white"
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(botLinks.telegram)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-green-800">Веб-форма записи</Label>
                    <div className="flex items-center space-x-2">
                      <input 
                        readOnly 
                        value={botLinks.website}
                        className="flex-1 px-3 py-2 text-sm border rounded bg-white"
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(botLinks.website)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Следующие шаги */}
              <Card>
                <CardHeader>
                  <CardTitle>Что дальше?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Поделитесь с клиентами</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Добавьте ссылки в Instagram bio</li>
                        <li>• Отправьте постоянным клиентам</li>
                        <li>• Разместите QR-код в салоне</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Мониторинг</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Следите за записями в Dashboard</li>
                        <li>• Проверяйте аналитику</li>
                        <li>• Корректируйте настройки</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      Перейти в Dashboard
                    </Button>
                    <Button variant="outline" size="sm">
                      Скачать QR-код
                    </Button>
                    <Button variant="outline" size="sm">
                      Просмотреть аналитику
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}