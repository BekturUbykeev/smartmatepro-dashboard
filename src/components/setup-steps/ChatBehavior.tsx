import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Switch } from '../ui/switch'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { MessageSquare, Bot, Users, Zap, Play } from 'lucide-react'

interface ChatBehaviorProps {
  data: any
  onDataChange: (data: any) => void
}

export function ChatBehavior({ data, onDataChange }: ChatBehaviorProps) {
  const [formData, setFormData] = useState({
    tone: data?.tone || 'friendly',
    welcomeMessage: data?.welcomeMessage || 'Привет! Я помогу вам записаться к мастеру. Что вас интересует?',
    personalizedGreeting: data?.personalizedGreeting ?? true,
    timeBasedGreeting: data?.timeBasedGreeting ?? true,
    upsellEnabled: data?.upsellEnabled ?? true,
    upsellThreshold: data?.upsellThreshold || 1000,
    handoffEnabled: data?.handoffEnabled ?? true,
    handoffTriggers: data?.handoffTriggers || ['сложный вопрос', 'жалоба', 'особый запрос'],
    maxConversationLength: data?.maxConversationLength || 20,
    responseSpeed: data?.responseSpeed || 'normal',
    useEmojis: data?.useEmojis ?? true,
    proactiveMessages: data?.proactiveMessages ?? true
  })

  const [previewMode, setPreviewMode] = useState(false)
  const [testMessages, setTestMessages] = useState([
    { role: 'bot', text: formData.welcomeMessage },
  ])

  const handleInputChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onDataChange(newData)
  }

  const tones = [
    { value: 'friendly', label: 'Дружелюбный', example: 'Привет! Как дела? Давайте найдем для вас отличное время!' },
    { value: 'professional', label: 'Профессиональный', example: 'Здравствуйте! Помогу подобрать удобное время для записи.' },
    { value: 'casual', label: 'Неформальный', example: 'Приветики! Хочешь записаться? Сейчас все устроим!' },
    { value: 'concise', label: 'Лаконичный', example: 'Здравствуйте. Выберите услугу и время.' }
  ]

  const speeds = [
    { value: 'instant', label: 'Мгновенно' },
    { value: 'fast', label: 'Быстро (1-2 сек)' },
    { value: 'normal', label: 'Обычно (2-3 сек)' },
    { value: 'thoughtful', label: 'Обдуманно (3-5 сек)' }
  ]

  const addHandoffTrigger = () => {
    const newTrigger = prompt('Введите новый триггер для передачи человеку:')
    if (newTrigger) {
      const newTriggers = [...formData.handoffTriggers, newTrigger]
      handleInputChange('handoffTriggers', newTriggers)
    }
  }

  const removeHandoffTrigger = (index: number) => {
    const newTriggers = formData.handoffTriggers.filter((_: any, i: number) => i !== index)
    handleInputChange('handoffTriggers', newTriggers)
  }

  const simulateChat = () => {
    setPreviewMode(true)
    const responses = [
      'Отлично! Что вас интересует - стрижка, борода или комплекс?',
      'Подберем идеальное время! У нас есть свободные слоты завтра с 14:00.',
      'Записал вас! Отправлю напоминание за час до визита 😊'
    ]
    
    setTimeout(() => {
      setTestMessages(prev => [...prev, 
        { role: 'user', text: 'Хочу записаться на завтра' },
        { role: 'bot', text: responses[0] }
      ])
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Стиль общения */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Стиль общения</span>
          </CardTitle>
          <CardDescription>
            Как ваш AI-бот будет общаться с клиентами
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Тон общения</Label>
            <Select
              value={formData.tone}
              onValueChange={(value) => handleInputChange('tone', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tones.map((tone) => (
                  <SelectItem key={tone.value} value={tone.value}>
                    {tone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.tone && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <Label className="text-xs text-muted-foreground">Пример:</Label>
                <p className="text-sm italic">
                  {tones.find(t => t.value === formData.tone)?.example}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Приветственное сообщение</Label>
            <Textarea
              value={formData.welcomeMessage}
              onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Персонализированные приветствия</Label>
                <p className="text-xs text-muted-foreground">
                  Обращаться по имени, если клиент уже знаком
                </p>
              </div>
              <Switch
                checked={formData.personalizedGreeting}
                onCheckedChange={(checked) => handleInputChange('personalizedGreeting', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Приветствия по времени</Label>
                <p className="text-xs text-muted-foreground">
                  "Доброе утро", "Добрый день", "Добрый вечер"
                </p>
              </div>
              <Switch
                checked={formData.timeBasedGreeting}
                onCheckedChange={(checked) => handleInputChange('timeBasedGreeting', checked)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Использовать эмодзи</Label>
                <p className="text-xs text-muted-foreground">
                  Делает общение более живым
                </p>
              </div>
              <Switch
                checked={formData.useEmojis}
                onCheckedChange={(checked) => handleInputChange('useEmojis', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label>Скорость ответа</Label>
              <Select
                value={formData.responseSpeed}
                onValueChange={(value) => handleInputChange('responseSpeed', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {speeds.map((speed) => (
                    <SelectItem key={speed.value} value={speed.value}>
                      {speed.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Продажи и дополнительные предложения */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Продажи и предложения</span>
          </CardTitle>
          <CardDescription>
            Настройки для увеличения среднего чека и продаж
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Включить дополнительные предложения</Label>
              <p className="text-xs text-muted-foreground">
                Бот будет предлагать дополнительные услуги
              </p>
            </div>
            <Switch
              checked={formData.upsellEnabled}
              onCheckedChange={(checked) => handleInputChange('upsellEnabled', checked)}
            />
          </div>

          {formData.upsellEnabled && (
            <div className="ml-4 space-y-4">
              <div className="space-y-2">
                <Label>Минимальная сумма для предложений (₽)</Label>
                <Input
                  type="number"
                  value={formData.upsellThreshold}
                  onChange={(e) => handleInputChange('upsellThreshold', parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Если заказ меньше этой суммы, бот предложит дополнительные услуги
                </p>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <Label className="text-blue-900">Примеры предложений:</Label>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• "К стрижке добавить оформление бороды со скидкой 20%?"</li>
                  <li>• "Рекомендую комплекс - выйдет дешевле чем по отдельности"</li>
                  <li>• "У нас есть акция на уход - всего +300₽ к любой услуге"</li>
                </ul>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Проактивные сообщения</Label>
              <p className="text-xs text-muted-foreground">
                Бот может писать первым с предложениями и новостями
              </p>
            </div>
            <Switch
              checked={formData.proactiveMessages}
              onCheckedChange={(checked) => handleInputChange('proactiveMessages', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Передача человеку */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Передача специалисту</span>
          </CardTitle>
          <CardDescription>
            Когда бот должен передать разговор живому человеку
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Разрешить передачу человеку</Label>
              <p className="text-xs text-muted-foreground">
                При сложных вопросах бот передаст диалог вам
              </p>
            </div>
            <Switch
              checked={formData.handoffEnabled}
              onCheckedChange={(checked) => handleInputChange('handoffEnabled', checked)}
            />
          </div>

          {formData.handoffEnabled && (
            <div className="ml-4 space-y-4">
              <div className="space-y-2">
                <Label>Триггеры для передачи</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.handoffTriggers.map((trigger: string, index: number) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-red-100"
                      onClick={() => removeHandoffTrigger(index)}
                    >
                      {trigger} ✕
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={addHandoffTrigger}>
                  Добавить триггер
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Максимальная длина диалога</Label>
                <Input
                  type="number"
                  min="5"
                  max="50"
                  value={formData.maxConversationLength}
                  onChange={(e) => handleInputChange('maxConversationLength', parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  После скольких сообщений предложить связь с мастером
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Предварительный просмотр */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <span>Предварительный просмотр</span>
          </CardTitle>
          <CardDescription>
            Протестируйте, как будет вести себя ваш бот
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!previewMode ? (
            <div className="text-center py-8">
              <Bot className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-muted-foreground mb-4">
                Запустите симуляцию диалога с ботом
              </p>
              <Button onClick={simulateChat} className="flex items-center space-x-2">
                <Play className="w-4 h-4" />
                <span>Начать тест</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {testMessages.map((message, index) => (
                <div 
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-sm p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Сводка настроек */}
      <Card className="bg-purple-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-900">Личность вашего бота</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Стиль:</strong> {tones.find(t => t.value === formData.tone)?.label}</p>
            <p><strong>Скорость ответа:</strong> {speeds.find(s => s.value === formData.responseSpeed)?.label}</p>
            <p><strong>Продажи:</strong> {formData.upsellEnabled ? `Включены (от ${formData.upsellThreshold}₽)` : 'Отключены'}</p>
            <p><strong>Передача человеку:</strong> {formData.handoffEnabled ? `После ${formData.maxConversationLength} сообщений` : 'Отключена'}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              {tones.find(t => t.value === formData.tone)?.label}
            </Badge>
            {formData.useEmojis && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                С эмодзи 😊
              </Badge>
            )}
            {formData.upsellEnabled && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Увеличивает продажи
              </Badge>
            )}
            {formData.personalizedGreeting && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Персонализация
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}