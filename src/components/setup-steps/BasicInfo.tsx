import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Upload, MapPin, Clock, Camera } from 'lucide-react'

interface BasicInfoProps {
  data: any
  onDataChange: (data: any) => void
}

export function BasicInfo({ data, onDataChange }: BasicInfoProps) {
  const [formData, setFormData] = useState({
    businessName: data?.businessName || '',
    specialistName: data?.specialistName || '',
    serviceType: data?.serviceType || '',
    location: data?.location || '',
    workingHours: data?.workingHours || {
      start: '09:00',
      end: '18:00',
      weekends: true
    },
    serviceLocation: data?.serviceLocation || 'salon',
    currency: data?.currency || 'RUB',
    language: data?.language || 'ru',
    description: data?.description || '',
    photo: data?.photo || null
  })

  const serviceTypes = [
    'Барбершоп',
    'Салон красоты',
    'Мастер маникюра',
    'Массажист',
    'Косметолог',
    'Стилист',
    'Тренер',
    'Другое'
  ]

  const currencies = [
    { value: 'RUB', label: '₽ Рубль' },
    { value: 'USD', label: '$ Доллар' },
    { value: 'EUR', label: '€ Евро' },
    { value: 'KZT', label: '₸ Тенге' }
  ]

  const handleInputChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onDataChange(newData)
  }

  const handleWorkingHoursChange = (field: string, value: any) => {
    const newWorkingHours = { ...formData.workingHours, [field]: value }
    const newData = { ...formData, workingHours: newWorkingHours }
    setFormData(newData)
    onDataChange(newData)
  }

  return (
    <div className="space-y-6">
      {/* Business identity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>Идентификация бизнеса</span>
          </CardTitle>
          <CardDescription>
            Основная информация о вашем бизнесе и услугах
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Название бизнеса</Label>
              <Input
                id="businessName"
                placeholder="Barber Alex"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialistName">Имя специалиста</Label>
              <Input
                id="specialistName"
                placeholder="Алексей Иванов"
                value={formData.specialistName}
                onChange={(e) => handleInputChange('specialistName', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceType">Тип услуг</Label>
            <Select 
              value={formData.serviceType} 
              onValueChange={(value) => handleInputChange('serviceType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип услуг" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание деятельности</Label>
            <Textarea
              id="description"
              placeholder="Расскажите о своих услугах, опыте, особенностях..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          {/* Photo upload */}
          <div className="space-y-2">
            <Label>Фото и логотип</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-2">
                Загрузите фото специалиста или логотип
              </p>
              <Button variant="outline" size="sm">
                Выбрать файл
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location and schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Локация и расписание</span>
          </CardTitle>
          <CardDescription>
            Где и когда вы принимаете клиентов
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Адрес или локация</Label>
            <Input
              id="location"
              placeholder="г. Москва, ул. Примерная, 123"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Варианты приёма</Label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="serviceLocation"
                  value="salon"
                  checked={formData.serviceLocation === 'salon'}
                  onChange={(e) => handleInputChange('serviceLocation', e.target.value)}
                  className="text-blue-600"
                />
                <span>В салоне</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="serviceLocation"
                  value="home"
                  checked={formData.serviceLocation === 'home'}
                  onChange={(e) => handleInputChange('serviceLocation', e.target.value)}
                  className="text-blue-600"
                />
                <span>Выезд к клиенту</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="serviceLocation"
                  value="both"
                  checked={formData.serviceLocation === 'both'}
                  onChange={(e) => handleInputChange('serviceLocation', e.target.value)}
                  className="text-blue-600"
                />
                <span>Оба варианта</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workStart">Начало работы</Label>
              <Input
                id="workStart"
                type="time"
                value={formData.workingHours.start}
                onChange={(e) => handleWorkingHoursChange('start', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workEnd">Конец работы</Label>
              <Input
                id="workEnd"
                type="time"
                value={formData.workingHours.end}
                onChange={(e) => handleWorkingHoursChange('end', e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="weekends"
              checked={formData.workingHours.weekends}
              onChange={(e) => handleWorkingHoursChange('weekends', e.target.checked)}
              className="text-blue-600"
            />
            <Label htmlFor="weekends">Работаю в выходные</Label>
          </div>
        </CardContent>
      </Card>

      {/* Regional settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Региональные настройки</span>
          </CardTitle>
          <CardDescription>
            Валюта и язык общения с клиентами
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Валюта</Label>
              <Select 
                value={formData.currency} 
                onValueChange={(value) => handleInputChange('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Язык общения</Label>
              <Select 
                value={formData.language} 
                onValueChange={(value) => handleInputChange('language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">🇷🇺 Русский</SelectItem>
                  <SelectItem value="en">🇺🇸 English</SelectItem>
                  <SelectItem value="kz">🇰🇿 Қазақша</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {formData.businessName && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {formData.businessName.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">{formData.businessName}</h3>
                <p className="text-blue-700 text-sm">{formData.specialistName}</p>
                {formData.serviceType && (
                  <Badge variant="secondary" className="mt-1">
                    {formData.serviceType}
                  </Badge>
                )}
                {formData.location && (
                  <p className="text-blue-600 text-sm mt-2 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {formData.location}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}