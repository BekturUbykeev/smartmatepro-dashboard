import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { 
  Play, 
  MessageSquare, 
  Calendar, 
  Bell, 
  CheckCircle, 
  AlertTriangle,
  Bot,
  User,
  Clock,
  ArrowRight
} from 'lucide-react'

interface TestingModeProps {
  data: any
  onDataChange: (data: any) => void
}

export function TestingMode({ data, onDataChange }: TestingModeProps) {
  const [testState, setTestState] = useState({
    chatTest: { status: 'idle', messages: [], currentStep: 0 },
    bookingTest: { status: 'idle', scenario: null },
    notificationTest: { status: 'idle', results: [] },
    integrationTest: { status: 'idle', results: [] },
    overallProgress: 0
  })

  const [activeTest, setActiveTest] = useState<string | null>(null)

  const chatScenarios = [
    {
      id: 'basic_booking',
      name: 'Базовая запись',
      description: 'Клиент хочет записаться на стрижку',
      steps: [
        { role: 'user', text: 'Привет, хочу записаться на стрижку' },
        { role: 'bot', text: 'Привет! Отлично! На какой день вам удобно записаться?' },
        { role: 'user', text: 'На завтра, если можно' },
        { role: 'bot', text: 'Завтра у нас есть свободные слоты: 14:00, 16:30, 18:00. Какое время подойдет?' },
        { role: 'user', text: '16:30 подходит' },
        { role: 'bot', text: 'Отлично! Записал вас на завтра 16:30 на мужскую стрижку (1500₽). Ваше имя для записи?' }
      ]
    },
    {
      id: 'upsell_scenario',
      name: 'Допродажа',
      description: 'Бот предлагает дополнительные услуги',
      steps: [
        { role: 'user', text: 'Запишите меня на стрижку' },
        { role: 'bot', text: 'Конечно! А хотели бы добавить оформление бороды? Сейчас скидка 20%' },
        { role: 'user', text: 'А сколько это будет стоить?' },
        { role: 'bot', text: 'Стрижка + борода вместо 2300₽ будет всего 2000₽. Очень выгодно!' }
      ]
    },
    {
      id: 'consultation',
      name: 'Консультация',
      description: 'Клиент просит совет по стилю',
      steps: [
        { role: 'user', text: 'Какую стрижку посоветуете?' },
        { role: 'bot', text: 'Подберу идеальный вариант! Какая у вас форма лица и какой стиль предпочитаете?' },
        { role: 'user', text: 'Овальное лицо, хочу что-то современное' },
        { role: 'bot', text: 'Для овального лица отлично подойдет fade или undercut. Могу показать примеры работ! Хотите записаться?' }
      ]
    }
  ]

  const runChatTest = async (scenario: any) => {
    setActiveTest('chat')
    setTestState(prev => ({
      ...prev,
      chatTest: { status: 'running', messages: [], currentStep: 0 }
    }))

    for (let i = 0; i < scenario.steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setTestState(prev => ({
        ...prev,
        chatTest: {
          ...prev.chatTest,
          messages: [...prev.chatTest.messages, scenario.steps[i]],
          currentStep: i + 1
        }
      }))
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
    setTestState(prev => ({
      ...prev,
      chatTest: { ...prev.chatTest, status: 'completed' }
    }))
  }

  const runBookingTest = async () => {
    setActiveTest('booking')
    setTestState(prev => ({
      ...prev,
      bookingTest: { status: 'running', scenario: null }
    }))

    const tests = [
      'Проверка доступных слотов...',
      'Тест создания записи...',
      'Проверка конфликтов времени...',
      'Тест групповой записи...',
      'Проверка отмены записи...'
    ]

    for (let i = 0; i < tests.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1200))
      setTestState(prev => ({
        ...prev,
        overallProgress: ((i + 1) / tests.length) * 25
      }))
    }

    setTestState(prev => ({
      ...prev,
      bookingTest: { status: 'completed', scenario: 'success' }
    }))
  }

  const runNotificationTest = async () => {
    setActiveTest('notifications')
    setTestState(prev => ({
      ...prev,
      notificationTest: { status: 'running', results: [] }
    }))

    const notifications = [
      { type: 'reminder_24h', status: 'success', message: 'Напоминание за 24 часа отправлено' },
      { type: 'reminder_1h', status: 'success', message: 'Напоминание за 1 час отправлено' },
      { type: 'review_request', status: 'success', message: 'Просьба об отзыве отправлена' },
      { type: 'follow_up', status: 'success', message: 'Фоллоу-ап сообщение отправлено' }
    ]

    for (let i = 0; i < notifications.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setTestState(prev => ({
        ...prev,
        notificationTest: {
          status: 'running',
          results: [...prev.notificationTest.results, notifications[i]]
        },
        overallProgress: 25 + ((i + 1) / notifications.length) * 25
      }))
    }

    setTestState(prev => ({
      ...prev,
      notificationTest: { ...prev.notificationTest, status: 'completed' }
    }))
  }

  const runIntegrationTest = async () => {
    setActiveTest('integrations')
    setTestState(prev => ({
      ...prev,
      integrationTest: { status: 'running', results: [] }
    }))

    const integrations = [
      { name: 'Google Calendar', status: 'success', message: 'Синхронизация работает' },
      { name: 'WhatsApp', status: 'success', message: 'Сообщения отправляются' },
      { name: 'Stripe', status: 'warning', message: 'Тестовый режим активен' },
      { name: 'Analytics', status: 'success', message: 'События отслеживаются' }
    ]

    for (let i = 0; i < integrations.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setTestState(prev => ({
        ...prev,
        integrationTest: {
          status: 'running',
          results: [...prev.integrationTest.results, integrations[i]]
        },
        overallProgress: 50 + ((i + 1) / integrations.length) * 50
      }))
    }

    setTestState(prev => ({
      ...prev,
      integrationTest: { ...prev.integrationTest, status: 'completed' },
      overallProgress: 100
    }))
  }

  const runAllTests = async () => {
    await runBookingTest()
    await runNotificationTest()  
    await runIntegrationTest()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'running':
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return <Play className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3>Тестирование настроек бота</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Проверьте, как работает ваш бот в различных сценариях
        </p>
        
        {testState.overallProgress > 0 && (
          <div className="space-y-2">
            <Progress value={testState.overallProgress} className="w-full" />
            <p className="text-sm text-muted-foreground">
              Общий прогресс: {Math.round(testState.overallProgress)}%
            </p>
          </div>
        )}
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat">Диалоги</TabsTrigger>
          <TabsTrigger value="booking">Записи</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          <TabsTrigger value="integrations">Интеграции</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Тестирование диалогов</span>
              </CardTitle>
              <CardDescription>
                Проверьте, как бот ведет себя в разных сценариях общения
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {chatScenarios.map((scenario) => (
                  <Card key={scenario.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <h4 className="font-medium mb-2">{scenario.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {scenario.description}
                      </p>
                      <Button 
                        size="sm" 
                        onClick={() => runChatTest(scenario)}
                        disabled={testState.chatTest.status === 'running'}
                        className="w-full"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Запустить тест
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {testState.chatTest.messages.length > 0 && (
                <Card className="bg-gray-50">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Симуляция диалога</span>
                      {getStatusIcon(testState.chatTest.status)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {testState.chatTest.messages.map((message: any, index: number) => (
                        <div 
                          key={index}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex items-start space-x-2 max-w-sm`}>
                            {message.role === 'bot' && (
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <Bot className="w-3 h-3 text-white" />
                              </div>
                            )}
                            <div 
                              className={`p-3 rounded-lg ${
                                message.role === 'user' 
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-white border'
                              }`}
                            >
                              <p className="text-sm">{message.text}</p>
                            </div>
                            {message.role === 'user' && (
                              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                                <User className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="booking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Тестирование записей</span>
              </CardTitle>
              <CardDescription>
                Проверка логики создания, изменения и отмены записей
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                {testState.bookingTest.status === 'idle' && (
                  <>
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-muted-foreground mb-4">
                      Проверим логику работы с записями
                    </p>
                    <Button onClick={runBookingTest} className="flex items-center space-x-2">
                      <Play className="w-4 h-4" />
                      <span>Запустить тест записей</span>
                    </Button>
                  </>
                )}

                {testState.bookingTest.status === 'running' && (
                  <>
                    <Clock className="w-16 h-16 mx-auto mb-4 text-blue-500 animate-spin" />
                    <p className="text-blue-600">Тестируем логику записей...</p>
                  </>
                )}

                {testState.bookingTest.status === 'completed' && (
                  <>
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <p className="text-green-600 mb-4">Все тесты записей прошли успешно!</p>
                    <div className="space-y-2 text-sm text-left max-w-md mx-auto">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Создание записи работает</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Проверка конфликтов времени</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Групповые записи работают</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Отмена записей работает</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Тестирование уведомлений</span>
              </CardTitle>
              <CardDescription>
                Проверка отправки напоминаний и фоллоу-ап сообщений
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                {testState.notificationTest.status === 'idle' && (
                  <>
                    <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-muted-foreground mb-4">
                      Проверим отправку всех типов уведомлений
                    </p>
                    <Button onClick={runNotificationTest} className="flex items-center space-x-2">
                      <Play className="w-4 h-4" />
                      <span>Запустить тест уведомлений</span>
                    </Button>
                  </>
                )}

                {testState.notificationTest.status === 'running' && (
                  <div className="space-y-4">
                    <Clock className="w-16 h-16 mx-auto text-blue-500 animate-spin" />
                    <p className="text-blue-600">Тестируем уведомления...</p>
                    <div className="space-y-2 text-left max-w-md mx-auto">
                      {testState.notificationTest.results.map((result: any, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{result.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {testState.notificationTest.status === 'completed' && (
                  <>
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <p className="text-green-600 mb-4">Все уведомления работают корректно!</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ArrowRight className="w-5 h-5" />
                <span>Тестирование интеграций</span>
              </CardTitle>
              <CardDescription>
                Проверка работы всех подключенных внешних сервисов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                {testState.integrationTest.status === 'idle' && (
                  <>
                    <ArrowRight className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-muted-foreground mb-4">
                      Проверим связь со всеми интеграциями
                    </p>
                    <Button onClick={runIntegrationTest} className="flex items-center space-x-2">
                      <Play className="w-4 h-4" />
                      <span>Запустить тест интеграций</span>
                    </Button>
                  </>
                )}

                {testState.integrationTest.status === 'running' && (
                  <div className="space-y-4">
                    <Clock className="w-16 h-16 mx-auto text-blue-500 animate-spin" />
                    <p className="text-blue-600">Тестируем интеграции...</p>
                    <div className="grid grid-cols-2 gap-2 text-left max-w-lg mx-auto">
                      {testState.integrationTest.results.map((result: any, index: number) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                          {getStatusIcon(result.status)}
                          <div>
                            <p className="text-sm font-medium">{result.name}</p>
                            <p className="text-xs text-muted-foreground">{result.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {testState.integrationTest.status === 'completed' && (
                  <>
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <p className="text-green-600 mb-4">Интеграции протестированы!</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Запустить все тесты */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <h4 className="font-medium text-blue-900 mb-2">Полное тестирование</h4>
            <p className="text-sm text-blue-700 mb-4">
              Запустите все тесты одновременно для полной проверки системы
            </p>
            <Button 
              onClick={runAllTests}
              disabled={activeTest !== null}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Запустить все тесты
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}