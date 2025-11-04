import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Switch } from '../ui/switch'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Bell, MessageCircle, Star, RefreshCw, Mail, Plus, Trash2 } from 'lucide-react'

interface NotificationsAndFollowupsProps {
  data: any
  onDataChange: (data: any) => void
}

export function NotificationsAndFollowups({ data, onDataChange }: NotificationsAndFollowupsProps) {
  const [formData, setFormData] = useState({
    channels: data?.channels || ['whatsapp'],
    reminders: data?.reminders || [
      { time: 24, unit: 'hours', enabled: true, message: 'Напоминаем о записи завтра в {time}. Адрес: {address}' },
      { time: 1, unit: 'hours', enabled: true, message: 'Через час ждем вас на {service}! До встречи!' }
    ],
    reviewRequest: data?.reviewRequest || {
      enabled: true,
      delay: 2,
      delayUnit: 'hours',
      message: 'Как прошел визит? Будем благодарны за отзыв ⭐',
      autoResponse: 'Спасибо за отзыв! Рады, что вам понравилось 😊'
    },
    followUps: data?.followUps || [
      {
        id: '1',
        name: 'Повторная запись',
        delay: 30,
        delayUnit: 'days',
        message: 'Прошел месяц после последнего визита. Время освежить образ? 😉',
        enabled: true
      }
    ],
    birthdayReminders: data?.birthdayReminders ?? true,
    promotionalMessages: data?.promotionalMessages ?? true,
    noShowFollowup: data?.noShowFollowup ?? true
  })

  const handleInputChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onDataChange(newData)
  }

  const channels = [
    { value: 'whatsapp', label: 'WhatsApp', icon: '💬' },
    { value: 'telegram', label: 'Telegram', icon: '✈️' },
    { value: 'sms', label: 'SMS', icon: '📱' },
    { value: 'email', label: 'Email', icon: '📧' }
  ]

  const toggleChannel = (channel: string) => {
    const newChannels = formData.channels.includes(channel)
      ? formData.channels.filter((c: string) => c !== channel)
      : [...formData.channels, channel]
    handleInputChange('channels', newChannels)
  }

  const updateReminder = (index: number, field: string, value: any) => {
    const newReminders = formData.reminders.map((reminder: any, i: number) => 
      i === index ? { ...reminder, [field]: value } : reminder
    )
    handleInputChange('reminders', newReminders)
  }

  const updateReviewRequest = (field: string, value: any) => {
    const newReviewRequest = { ...formData.reviewRequest, [field]: value }
    handleInputChange('reviewRequest', newReviewRequest)
  }

  const addFollowUp = () => {
    const newFollowUp = {
      id: Date.now().toString(),
      name: 'Новый фоллоу-ап',
      delay: 7,
      delayUnit: 'days',
      message: 'Персонализированное сообщение',
      enabled: true
    }
    const newFollowUps = [...formData.followUps, newFollowUp]
    handleInputChange('followUps', newFollowUps)
  }

  const updateFollowUp = (id: string, field: string, value: any) => {
    const newFollowUps = formData.followUps.map((followUp: any) => 
      followUp.id === id ? { ...followUp, [field]: value } : followUp
    )
    handleInputChange('followUps', newFollowUps)
  }

  const deleteFollowUp = (id: string) => {
    const newFollowUps = formData.followUps.filter((followUp: any) => followUp.id !== id)
    handleInputChange('followUps', newFollowUps)
  }

  return (
    <div className="space-y-6">
      {/* Каналы уведомлений */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Каналы уведомлений</span>
          </CardTitle>
          <CardDescription>
            Выберите, как вы хотите связываться с клиентами
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {channels.map((channel) => (
              <div
                key={channel.value}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.channels.includes(channel.value)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleChannel(channel.value)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{channel.icon}</span>
                  <div>
                    <h4 className="font-medium">{channel.label}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formData.channels.includes(channel.value) ? 'Активен' : 'Неактивен'}
                    </p>
                  </div>
                  {formData.channels.includes(channel.value) && (
                    <Badge className="ml-auto">Выбрано</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Напоминания */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span>Напоминания клиентам</span>
          </CardTitle>
          <CardDescription>
            Автоматические напоминания о предстоящих записях
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.reminders.map((reminder: any, index: number) => (
            <Card key={index} className="bg-gray-50">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span className="font-medium">
                      За {reminder.time} {reminder.unit === 'hours' ? 'часов' : 'дней'}
                    </span>
                  </div>
                  <Switch
                    checked={reminder.enabled}
                    onCheckedChange={(checked) => updateReminder(index, 'enabled', checked)}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <Input
                    type="number"
                    min="1"
                    value={reminder.time}
                    onChange={(e) => updateReminder(index, 'time', parseInt(e.target.value))}
                  />
                  <Select
                    value={reminder.unit}
                    onValueChange={(value) => updateReminder(index, 'unit', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">часов</SelectItem>
                      <SelectItem value="days">дней</SelectItem>
                    </SelectContent>
                  </Select>
                  <div></div>
                </div>

                <Textarea
                  value={reminder.message}
                  onChange={(e) => updateReminder(index, 'message', e.target.value)}
                  rows={2}
                />
                
                <div className="mt-2 text-xs text-muted-foreground">
                  Доступные переменные: {'{time}'}, {'{service}'}, {'{address}'}, {'{client_name}'}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Просьба об отзыве */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5" />
            <span>Просьба об отзыве</span>
          </CardTitle>
          <CardDescription>
            Автоматическая просьба оставить отзыв после визита
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Включить просьбу об отзыве</Label>
              <p className="text-xs text-muted-foreground">
                Отправлять сообщение с просьбой об отзыве
              </p>
            </div>
            <Switch
              checked={formData.reviewRequest.enabled}
              onCheckedChange={(checked) => updateReviewRequest('enabled', checked)}
            />
          </div>

          {formData.reviewRequest.enabled && (
            <div className="space-y-4 ml-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Задержка отправки</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.reviewRequest.delay}
                    onChange={(e) => updateReviewRequest('delay', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Единица времени</Label>
                  <Select
                    value={formData.reviewRequest.delayUnit}
                    onValueChange={(value) => updateReviewRequest('delayUnit', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">часов</SelectItem>
                      <SelectItem value="days">дней</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Сообщение-просьба</Label>
                <Textarea
                  value={formData.reviewRequest.message}
                  onChange={(e) => updateReviewRequest('message', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Автоответ на отзыв</Label>
                <Textarea
                  value={formData.reviewRequest.autoResponse}
                  onChange={(e) => updateReviewRequest('autoResponse', e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Фоллоу-апы */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5" />
                <span>Фоллоу-ап сообщения</span>
              </CardTitle>
              <CardDescription>
                Автоматические сообщения для возврата клиентов
              </CardDescription>
            </div>
            <Button onClick={addFollowUp} size="sm" className="flex items-center space-x-1">
              <Plus className="w-3 h-3" />
              <span>Добавить</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.followUps.map((followUp: any) => (
            <Card key={followUp.id} className="bg-gray-50">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <Input
                    value={followUp.name}
                    onChange={(e) => updateFollowUp(followUp.id, 'name', e.target.value)}
                    className="font-medium bg-transparent border-none p-0 h-auto"
                  />
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={followUp.enabled}
                      onCheckedChange={(checked) => updateFollowUp(followUp.id, 'enabled', checked)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteFollowUp(followUp.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Через</Label>
                    <Input
                      type="number"
                      min="1"
                      value={followUp.delay}
                      onChange={(e) => updateFollowUp(followUp.id, 'delay', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Период</Label>
                    <Select
                      value={followUp.delayUnit}
                      onValueChange={(value) => updateFollowUp(followUp.id, 'delayUnit', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">дней</SelectItem>
                        <SelectItem value="weeks">недель</SelectItem>
                        <SelectItem value="months">месяцев</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div></div>
                </div>

                <Textarea
                  value={followUp.message}
                  onChange={(e) => updateFollowUp(followUp.id, 'message', e.target.value)}
                  rows={2}
                />
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Дополнительные настройки */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>Дополнительные уведомления</span>
          </CardTitle>
          <CardDescription>
            Специальные типы сообщений для клиентов
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Поздравления с днем рождения</Label>
              <p className="text-xs text-muted-foreground">
                Автоматические поздравления и специальные предложения
              </p>
            </div>
            <Switch
              checked={formData.birthdayReminders}
              onCheckedChange={(checked) => handleInputChange('birthdayReminders', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Рекламные сообщения</Label>
              <p className="text-xs text-muted-foreground">
                Уведомления об акциях, скидках и новых услугах
              </p>
            </div>
            <Switch
              checked={formData.promotionalMessages}
              onCheckedChange={(checked) => handleInputChange('promotionalMessages', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Сообщения при пропуске записи</Label>
              <p className="text-xs text-muted-foreground">
                Автоматическое сообщение, если клиент не пришел
              </p>
            </div>
            <Switch
              checked={formData.noShowFollowup}
              onCheckedChange={(checked) => handleInputChange('noShowFollowup', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Сводка */}
      <Card className="bg-orange-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-900">Сводка уведомлений</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Активные каналы:</strong>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.channels.map((channel: string) => (
                  <Badge key={channel} variant="secondary" className="text-xs">
                    {channels.find(c => c.value === channel)?.label}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <strong>Напоминания:</strong> {formData.reminders.filter((r: any) => r.enabled).length} активных
            </div>
            <div>
              <strong>Просьба об отзыве:</strong> {formData.reviewRequest.enabled ? 'Включена' : 'Отключена'}
            </div>
            <div>
              <strong>Фоллоу-апы:</strong> {formData.followUps.filter((f: any) => f.enabled).length} активных
            </div>
          </div>

          <div className="mt-4 p-3 bg-orange-100 rounded-lg">
            <p className="text-sm text-orange-800">
              💡 <strong>Совет:</strong> Персонализированные сообщения увеличивают количество повторных записей на 40%
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}