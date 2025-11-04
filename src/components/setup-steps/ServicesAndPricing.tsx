import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Plus, Trash2, Clock, Users, Camera } from 'lucide-react'

interface ServicesAndPricingProps {
  data: any
  onDataChange: (data: any) => void
}

interface Service {
  id: string
  name: string
  duration: number
  price: number
  description: string
  maxClients: number
  category: string
  options: Array<{
    id: string
    name: string
    price: number
  }>
}

export function ServicesAndPricing({ data, onDataChange }: ServicesAndPricingProps) {
  const [services, setServices] = useState<Service[]>(data?.services || [
    {
      id: '1',
      name: 'Мужская стрижка',
      duration: 45,
      price: 1500,
      description: 'Классическая мужская стрижка с укладкой',
      maxClients: 1,
      category: 'Стрижки',
      options: []
    }
  ])

  const categories = [
    'Стрижки',
    'Борода',
    'Окрашивание',
    'Уход',
    'Комплекс',
    'Другое'
  ]

  const addService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      name: '',
      duration: 30,
      price: 0,
      description: '',
      maxClients: 1,
      category: 'Стрижки',
      options: []
    }
    const newServices = [...services, newService]
    setServices(newServices)
    onDataChange({ ...data, services: newServices })
  }

  const updateService = (serviceId: string, field: string, value: any) => {
    const newServices = services.map(service => 
      service.id === serviceId 
        ? { ...service, [field]: value }
        : service
    )
    setServices(newServices)
    onDataChange({ ...data, services: newServices })
  }

  const deleteService = (serviceId: string) => {
    const newServices = services.filter(service => service.id !== serviceId)
    setServices(newServices)
    onDataChange({ ...data, services: newServices })
  }

  const addOption = (serviceId: string) => {
    const newOption = {
      id: Date.now().toString(),
      name: '',
      price: 0
    }
    const newServices = services.map(service => 
      service.id === serviceId 
        ? { ...service, options: [...service.options, newOption] }
        : service
    )
    setServices(newServices)
    onDataChange({ ...data, services: newServices })
  }

  const updateOption = (serviceId: string, optionId: string, field: string, value: any) => {
    const newServices = services.map(service => 
      service.id === serviceId 
        ? {
            ...service, 
            options: service.options.map(option => 
              option.id === optionId 
                ? { ...option, [field]: value }
                : option
            )
          }
        : service
    )
    setServices(newServices)
    onDataChange({ ...data, services: newServices })
  }

  const deleteOption = (serviceId: string, optionId: string) => {
    const newServices = services.map(service => 
      service.id === serviceId 
        ? {
            ...service, 
            options: service.options.filter(option => option.id !== optionId)
          }
        : service
    )
    setServices(newServices)
    onDataChange({ ...data, services: newServices })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3>Ваши услуги</h3>
          <p className="text-sm text-muted-foreground">
            Настройте все услуги, их цены и дополнительные опции
          </p>
        </div>
        <Button onClick={addService} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Добавить услугу</span>
        </Button>
      </div>

      <div className="space-y-4">
        {services.map((service, index) => (
          <Card key={service.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Услуга #{index + 1}</span>
                    {service.category && (
                      <Badge variant="secondary">{service.category}</Badge>
                    )}
                  </CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteService(service.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Название услуги</Label>
                  <Input
                    placeholder="Мужская стрижка"
                    value={service.name}
                    onChange={(e) => updateService(service.id, 'name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Категория</Label>
                  <Select
                    value={service.category}
                    onValueChange={(value) => updateService(service.id, 'category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea
                  placeholder="Описание услуги для клиентов..."
                  value={service.description}
                  onChange={(e) => updateService(service.id, 'description', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Длительность (мин)</span>
                  </Label>
                  <Input
                    type="number"
                    value={service.duration}
                    onChange={(e) => updateService(service.id, 'duration', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Цена (₽)</Label>
                  <Input
                    type="number"
                    value={service.price}
                    onChange={(e) => updateService(service.id, 'price', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>Макс. клиентов</span>
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={service.maxClients}
                    onChange={(e) => updateService(service.id, 'maxClients', parseInt(e.target.value))}
                  />
                </div>
              </div>

              {/* Дополнительные опции */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <Label>Дополнительные опции</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addOption(service.id)}
                    className="flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Добавить</span>
                  </Button>
                </div>

                {service.options.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    Нет дополнительных опций
                  </p>
                )}

                {service.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2 p-3 bg-gray-50 rounded">
                    <Input
                      placeholder="Название опции"
                      value={option.name}
                      onChange={(e) => updateOption(service.id, option.id, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Цена"
                      value={option.price}
                      onChange={(e) => updateOption(service.id, option.id, 'price', parseInt(e.target.value))}
                      className="w-24"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteOption(service.id, option.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Фото примеров */}
              <div className="space-y-2 pt-4 border-t">
                <Label className="flex items-center space-x-1">
                  <Camera className="w-4 h-4" />
                  <span>Фото примеров работ</span>
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Camera className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">
                    Загрузите фото примеров для этой услуги
                  </p>
                  <Button variant="outline" size="sm">
                    Выбрать фото
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Итоговая сводка */}
      {services.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Сводка услуг</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{services.length}</div>
                <p className="text-sm text-blue-700">Всего услуг</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.min(...services.map(s => s.price))}₽ - {Math.max(...services.map(s => s.price))}₽
                </div>
                <p className="text-sm text-blue-700">Диапазон цен</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.min(...services.map(s => s.duration))} - {Math.max(...services.map(s => s.duration))} мин
                </div>
                <p className="text-sm text-blue-700">Время оказания</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Категории услуг:</h4>
              <div className="flex flex-wrap gap-2">
                {[...new Set(services.map(s => s.category))].map((category) => (
                  <Badge key={category} variant="secondary" className="bg-blue-100 text-blue-800">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}