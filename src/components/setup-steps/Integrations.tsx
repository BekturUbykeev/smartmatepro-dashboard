import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Switch } from '../ui/switch'
import { 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  BarChart3, 
  Database,
  CheckCircle,
  ExternalLink,
  Settings
} from 'lucide-react'

interface IntegrationsProps {
  data: any
  onDataChange: (data: any) => void
}

export function Integrations({ data, onDataChange }: IntegrationsProps) {
  const [formData, setFormData] = useState({
    googleCalendar: data?.googleCalendar || { enabled: false, connected: false },
    stripe: data?.stripe || { enabled: false, connected: false },
    whatsappBusiness: data?.whatsappBusiness || { enabled: false, connected: false },
    telegram: data?.telegram || { enabled: false, connected: false },
    instagram: data?.instagram || { enabled: false, connected: false },
    googleAnalytics: data?.googleAnalytics || { enabled: false, connected: false },
    metaPixel: data?.metaPixel || { enabled: false, connected: false },
    notion: data?.notion || { enabled: false, connected: false },
    googleSheets: data?.googleSheets || { enabled: false, connected: false },
    zapier: data?.zapier || { enabled: false, connected: false }
  })

  const handleToggleIntegration = (integration: string, enabled: boolean) => {
    const newData = {
      ...formData,
      [integration]: { ...formData[integration as keyof typeof formData], enabled }
    }
    setFormData(newData)
    onDataChange(newData)
  }

  const handleConnect = (integration: string) => {
    // Симуляция подключения
    const newData = {
      ...formData,
      [integration]: { 
        ...formData[integration as keyof typeof formData], 
        connected: true,
        enabled: true 
      }
    }
    setFormData(newData)
    onDataChange(newData)
  }

  const integrations = [
    {
      key: 'googleCalendar',
      name: 'Google Calendar',
      icon: Calendar,
      description: 'Синхронизация расписания с Google Calendar',
      category: 'Календарь',
      benefits: ['Двусторонняя синхронизация', 'Автоматические уведомления', 'Избежание конфликтов'],
      color: 'blue'
    },
    {
      key: 'stripe',
      name: 'Stripe',
      icon: CreditCard,
      description: 'Прием онлайн-платежей и депозитов',
      category: 'Платежи',
      benefits: ['Предоплата услуг', 'Автоматические депозиты', 'Международные карты'],
      color: 'purple'
    },
    {
      key: 'whatsappBusiness',
      name: 'WhatsApp Business',
      icon: MessageSquare,
      description: 'Официальный API для бизнес-сообщений',
      category: 'Мессенджеры',
      benefits: ['Верифицированный аккаунт', 'Массовые рассылки', 'Аналитика сообщений'],
      color: 'green'
    },
    {
      key: 'telegram',
      name: 'Telegram Bot',
      icon: MessageSquare,
      description: 'Бот в Telegram для записи и уведомлений',
      category: 'Мессенджеры',
      benefits: ['Быстрые уведомления', 'Inline-кнопки', 'Групповые чаты'],
      color: 'blue'
    },
    {
      key: 'instagram',
      name: 'Instagram Business',
      icon: MessageSquare,
      description: 'Ответы в Instagram Direct Messages',
      category: 'Социальные сети',
      benefits: ['Автоответы в DM', 'Реклама услуг', 'Интеграция с постами'],
      color: 'pink'
    },
    {
      key: 'googleAnalytics',
      name: 'Google Analytics',
      icon: BarChart3,
      description: 'Отслеживание конверсий и поведения клиентов',
      category: 'Аналитика',
      benefits: ['Отслеживание записей', 'Источники клиентов', 'ROI рекламы'],
      color: 'orange'
    },
    {
      key: 'metaPixel',
      name: 'Meta Pixel',
      icon: BarChart3,
      description: 'Пиксель Facebook/Instagram для рекламы',
      category: 'Аналитика',
      benefits: ['Ретаргетинг', 'Похожие аудитории', 'Отслеживание конверсий'],
      color: 'blue'
    },
    {
      key: 'notion',
      name: 'Notion',
      icon: Database,
      description: 'Синхронизация данных с базой Notion',
      category: 'CRM',
      benefits: ['База клиентов', 'История записей', 'Аналитика'],
      color: 'gray'
    },
    {
      key: 'googleSheets',
      name: 'Google Sheets',
      icon: Database,
      description: 'Экспорт данных в Google Таблицы',
      category: 'CRM',
      benefits: ['Отчеты в реальном времени', 'Кастомная аналитика', 'Простой доступ'],
      color: 'green'
    },
    {
      key: 'zapier',
      name: 'Zapier',
      icon: Settings,
      description: 'Подключение к 5000+ приложений',
      category: 'Автоматизация',
      benefits: ['Безграничные интеграции', 'Кастомные workflows', 'Автоматизация задач'],
      color: 'orange'
    }
  ]

  const categories = [...new Set(integrations.map(i => i.category))]

  const getColorClasses = (color: string, connected: boolean) => {
    const colors = {
      blue: connected ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-gray-50 border-gray-200',
      green: connected ? 'bg-green-50 border-green-200 text-green-900' : 'bg-gray-50 border-gray-200',
      purple: connected ? 'bg-purple-50 border-purple-200 text-purple-900' : 'bg-gray-50 border-gray-200',
      pink: connected ? 'bg-pink-50 border-pink-200 text-pink-900' : 'bg-gray-50 border-gray-200',
      orange: connected ? 'bg-orange-50 border-orange-200 text-orange-900' : 'bg-gray-50 border-gray-200',
      gray: connected ? 'bg-gray-50 border-gray-300 text-gray-900' : 'bg-gray-50 border-gray-200'
    }
    return colors[color as keyof typeof colors] || colors.gray
  }

  return (
    <div className="space-y-6">
      <div>
        <h3>Интеграции с внешними сервисами</h3>
        <p className="text-sm text-muted-foreground">
          Подключите необходимые сервисы для расширения функциональности бота
        </p>
      </div>

      {categories.map((category) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle>{category}</CardTitle>
            <CardDescription>
              {category === 'Календарь' && 'Синхронизация расписания'}
              {category === 'Платежи' && 'Прием онлайн-платежей'}
              {category === 'Мессенджеры' && 'Каналы коммуникации с клиентами'}
              {category === 'Социальные сети' && 'Интеграция с социальными платформами'}
              {category === 'Аналитика' && 'Отслеживание и анализ данных'}
              {category === 'CRM' && 'Управление клиентскими данными'}
              {category === 'Автоматизация' && 'Подключение к внешним системам'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrations
                .filter(integration => integration.category === category)
                .map((integration) => {
                  const integrationData = formData[integration.key as keyof typeof formData]
                  const Icon = integration.icon
                  
                  return (
                    <Card 
                      key={integration.key}
                      className={getColorClasses(integration.color, integrationData.connected)}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Icon className="w-6 h-6" />
                            <div>
                              <h4 className="font-medium">{integration.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {integration.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {integrationData.connected && (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                            <Switch
                              checked={integrationData.enabled}
                              onCheckedChange={(enabled) => 
                                handleToggleIntegration(integration.key, enabled)
                              }
                              disabled={!integrationData.connected}
                            />
                          </div>
                        </div>

                        <div className="space-y-2 mb-3">
                          <Label className="text-xs">Преимущества:</Label>
                          <div className="flex flex-wrap gap-1">
                            {integration.benefits.map((benefit, index) => (
                              <Badge 
                                key={index} 
                                variant="secondary" 
                                className="text-xs"
                              >
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          {integrationData.connected ? (
                            <Button variant="outline" size="sm" className="flex items-center space-x-1">
                              <Settings className="w-3 h-3" />
                              <span>Настроить</span>
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              onClick={() => handleConnect(integration.key)}
                              className="flex items-center space-x-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Подключить</span>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* API ключи и настройки */}
      <Card>
        <CardHeader>
          <CardTitle>API ключи и токены</CardTitle>
          <CardDescription>
            Дополнительные настройки для подключенных интеграций
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(formData).some(([_, integration]) => (integration as any).connected) ? (
            <div className="space-y-4">
              {formData.googleAnalytics.connected && (
                <div className="space-y-2">
                  <Label>Google Analytics Tracking ID</Label>
                  <Input placeholder="UA-XXXXXXXXX-X или G-XXXXXXXXXX" />
                </div>
              )}
              
              {formData.metaPixel.connected && (
                <div className="space-y-2">
                  <Label>Meta Pixel ID</Label>
                  <Input placeholder="000000000000000" />
                </div>
              )}

              {formData.stripe.connected && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Stripe Publishable Key</Label>
                    <Input placeholder="pk_live_..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Stripe Secret Key</Label>
                    <Input type="password" placeholder="sk_live_..." />
                  </div>
                </div>
              )}

              {formData.whatsappBusiness.connected && (
                <div className="space-y-2">
                  <Label>WhatsApp Business Token</Label>
                  <Input type="password" placeholder="EAAxxxxxxxxxx..." />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Подключите интеграции для настройки API ключей</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Сводка */}
      <Card className="bg-teal-50 border-teal-200">
        <CardHeader>
          <CardTitle className="text-teal-900">Сводка интеграций</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Всего доступно интеграций:</span>
              <Badge variant="secondary">{integrations.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Подключено:</span>
              <Badge className="bg-green-500">
                {Object.values(formData).filter(i => i.connected).length}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Активно:</span>
              <Badge className="bg-blue-500">
                {Object.values(formData).filter(i => i.enabled && i.connected).length}
              </Badge>
            </div>
          </div>

          {Object.values(formData).some(i => i.connected) && (
            <div className="mt-4 pt-4 border-t border-teal-200">
              <Label className="text-teal-900">Подключенные сервисы:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {integrations
                  .filter(integration => formData[integration.key as keyof typeof formData].connected)
                  .map(integration => (
                    <Badge 
                      key={integration.key} 
                      variant="secondary" 
                      className="bg-teal-100 text-teal-800"
                    >
                      {integration.name}
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}