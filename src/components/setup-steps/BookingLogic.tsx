import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Switch } from '../ui/switch'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { Clock, Calendar, Users, RefreshCw, AlertTriangle } from 'lucide-react'

interface BookingLogicProps {
  data: any
  onDataChange: (data: any) => void
}

export function BookingLogic({ data, onDataChange }: BookingLogicProps) {
  const [formData, setFormData] = useState({
    slotInterval: data?.slotInterval || 30,
    fillPriority: data?.fillPriority || 'morning',
    allowRescheduling: data?.allowRescheduling ?? true,
    rescheduleDeadline: data?.rescheduleDeadline || 2,
    allowCancellation: data?.allowCancellation ?? true,
    cancellationDeadline: data?.cancellationDeadline || 2,
    allowGroupBooking: data?.allowGroupBooking ?? true,
    maxGroupSize: data?.maxGroupSize || 3,
    bufferTime: data?.bufferTime || 0,
    autoConfirmBooking: data?.autoConfirmBooking ?? true,
    requireDeposit: data?.requireDeposit ?? false,
    depositAmount: data?.depositAmount || 500,
    complexServiceLogic: data?.complexServiceLogic ?? true,
    overbookingProtection: data?.overbookingProtection ?? true
  })

  const handleInputChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onDataChange(newData)
  }

  const slotIntervals = [
    { value: 15, label: '15 минут' },
    { value: 30, label: '30 минут' },
    { value: 60, label: '1 час' }
  ]

  const fillPriorities = [
    { value: 'morning', label: 'С утра' },
    { value: 'evening', label: 'С вечера' },
    { value: 'afternoon', label: 'От обеда в обе стороны' },
    { value: 'random', label: 'Случайно' }
  ]

  return (
    <div className="space-y-6">
      {/* Основные настройки слотов */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Настройки расписания</span>
          </CardTitle>
          <CardDescription>
            Базовые параметры для автоматического создания слотов записи
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Интервал слотов</Label>
              <Select
                value={formData.slotInterval.toString()}
                onValueChange={(value) => handleInputChange('slotInterval', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {slotIntervals.map((interval) => (
                    <SelectItem key={interval.value} value={interval.value.toString()}>
                      {interval.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Минимальный интервал между записями
              </p>
            </div>

            <div className="space-y-2">
              <Label>Приоритет заполнения</Label>
              <Select
                value={formData.fillPriority}
                onValueChange={(value) => handleInputChange('fillPriority', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fillPriorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Как заполнять расписание в первую очередь
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Время буфера между записями (минуты)</Label>
            <Input
              type="number"
              min="0"
              max="60"
              value={formData.bufferTime}
              onChange={(e) => handleInputChange('bufferTime', parseInt(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Дополнительное время для подготовки между клиентами
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Автоматическое подтверждение записи</Label>
              <p className="text-xs text-muted-foreground">
                Записи подтверждаются сразу без вашего участия
              </p>
            </div>
            <Switch
              checked={formData.autoConfirmBooking}
              onCheckedChange={(checked) => handleInputChange('autoConfirmBooking', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Защита от перебронирования</Label>
              <p className="text-xs text-muted-foreground">
                Предотвращает двойные записи на одно время
              </p>
            </div>
            <Switch
              checked={formData.overbookingProtection}
              onCheckedChange={(checked) => handleInputChange('overbookingProtection', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Управление записями */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5" />
            <span>Перезапись и отмена</span>
          </CardTitle>
          <CardDescription>
            Правила изменения и отмены записей клиентами
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Разрешить перезапись</Label>
                <p className="text-xs text-muted-foreground">
                  Клиенты могут изменить время записи
                </p>
              </div>
              <Switch
                checked={formData.allowRescheduling}
                onCheckedChange={(checked) => handleInputChange('allowRescheduling', checked)}
              />
            </div>

            {formData.allowRescheduling && (
              <div className="ml-4 space-y-2">
                <Label>Не позже чем за (часов)</Label>
                <Input
                  type="number"
                  min="0"
                  max="48"
                  value={formData.rescheduleDeadline}
                  onChange={(e) => handleInputChange('rescheduleDeadline', parseInt(e.target.value))}
                />
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Разрешить отмену</Label>
                <p className="text-xs text-muted-foreground">
                  Клиенты могут отменить запись
                </p>
              </div>
              <Switch
                checked={formData.allowCancellation}
                onCheckedChange={(checked) => handleInputChange('allowCancellation', checked)}
              />
            </div>

            {formData.allowCancellation && (
              <div className="ml-4 space-y-2">
                <Label>Не позже чем за (часов)</Label>
                <Input
                  type="number"
                  min="0"
                  max="48"
                  value={formData.cancellationDeadline}
                  onChange={(e) => handleInputChange('cancellationDeadline', parseInt(e.target.value))}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Групповые записи */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Групповые визиты</span>
          </CardTitle>
          <CardDescription>
            Настройки для записи нескольких человек одновременно
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Разрешить групповые записи</Label>
              <p className="text-xs text-muted-foreground">
                Несколько человек в одно время (семья, друзья)
              </p>
            </div>
            <Switch
              checked={formData.allowGroupBooking}
              onCheckedChange={(checked) => handleInputChange('allowGroupBooking', checked)}
            />
          </div>

          {formData.allowGroupBooking && (
            <div className="ml-4 space-y-2">
              <Label>Максимальный размер группы</Label>
              <Input
                type="number"
                min="2"
                max="10"
                value={formData.maxGroupSize}
                onChange={(e) => handleInputChange('maxGroupSize', parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                С��олько человек максимум можно записать в одно время
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Предоплата */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Предоплата и депозиты</span>
          </CardTitle>
          <CardDescription>
            Требование предоплаты для подтверждения записи
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Требовать депозит</Label>
              <p className="text-xs text-muted-foreground">
                Клиент должен внести депозит для подтверждения записи
              </p>
            </div>
            <Switch
              checked={formData.requireDeposit}
              onCheckedChange={(checked) => handleInputChange('requireDeposit', checked)}
            />
          </div>

          {formData.requireDeposit && (
            <div className="ml-4 space-y-2">
              <Label>Размер депо��ита (₽)</Label>
              <Input
                type="number"
                min="100"
                max="5000"
                value={formData.depositAmount}
                onChange={(e) => handleInputChange('depositAmount', parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Фиксированная сумма депозита для любой услуги
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Комплексные услуги */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Сложные записи</span>
          </CardTitle>
          <CardDescription>
            Логика для комплексных услуг и длительных процедур
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Умная логика сложных услуг</Label>
              <p className="text-xs text-muted-foreground">
                Автоматически резервирует несколько слотов для длительных услуг
              </p>
            </div>
            <Switch
              checked={formData.complexServiceLogic}
              onCheckedChange={(checked) => handleInputChange('complexServiceLogic', checked)}
            />
          </div>

          {formData.complexServiceLogic && (
            <div className="ml-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Пример:</strong> Стрижка + борода (90 мин) автоматически займет 3 слота по 30 минут
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Сводка настроек */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-900">Сводка настроек</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Интервал слотов:</strong> {formData.slotInterval} мин
            </div>
            <div>
              <strong>Буферное время:</strong> {formData.bufferTime} мин
            </div>
            <div>
              <strong>Заполнение:</strong> {fillPriorities.find(p => p.value === formData.fillPriority)?.label}
            </div>
            <div>
              <strong>Автоподтверждение:</strong> {formData.autoConfirmBooking ? 'Да' : 'Нет'}
            </div>
            <div>
              <strong>Перезапись:</strong> {formData.allowRescheduling ? `За ${formData.rescheduleDeadline}ч` : 'Нет'}
            </div>
            <div>
              <strong>Отмена:</strong> {formData.allowCancellation ? `За ${formData.cancellationDeadline}ч` : 'Нет'}
            </div>
            <div>
              <strong>Групповые записи:</strong> {formData.allowGroupBooking ? `До ${formData.maxGroupSize} чел` : 'Нет'}
            </div>
            <div>
              <strong>Депозит:</strong> {formData.requireDeposit ? `${formData.depositAmount}₽` : 'Не требуется'}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {formData.autoConfirmBooking && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Автоподтверждение
              </Badge>
            )}
            {formData.allowGroupBooking && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Групповые записи
              </Badge>
            )}
            {formData.requireDeposit && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Депозит обязателен
              </Badge>
            )}
            {formData.complexServiceLogic && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Сложные услуги
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}