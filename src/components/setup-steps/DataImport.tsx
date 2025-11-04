import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Progress } from '../ui/progress'
import { 
  Link, 
  Upload, 
  Globe, 
  Instagram, 
  Facebook, 
  FileText, 
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react'

interface DataImportProps {
  data: any
  onDataChange: (data: any) => void
}

export function DataImport({ data, onDataChange }: DataImportProps) {
  const [formData, setFormData] = useState({
    website: data?.website || '',
    instagram: data?.instagram || '',
    facebook: data?.facebook || '',
    googleBusiness: data?.googleBusiness || '',
    uploadedFiles: data?.uploadedFiles || [],
    analysisResults: data?.analysisResults || null,
    isAnalyzing: false
  })

  const [analyzeProgress, setAnalyzeProgress] = useState(0)

  const handleInputChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onDataChange(newData)
  }

  const handleAnalyze = async () => {
    setFormData({ ...formData, isAnalyzing: true })
    setAnalyzeProgress(0)

    // Симуляция анализа
    const steps = [
      'Сканирование сайта...',
      'Анализ социальных сетей...',
      'Обработка загруженных файлов...',
      'Извлечение услуг и цен...',
      'Анализ стиля общения...',
      'Создание структуры данных...'
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAnalyzeProgress(((i + 1) / steps.length) * 100)
    }

    // Результат анализа
    const analysisResults = {
      services: [
        { name: 'Мужская стрижка', price: 1500, duration: 45 },
        { name: 'Стрижка бороды', price: 800, duration: 30 },
        { name: 'Комплекс стрижка + борода', price: 2000, duration: 60 }
      ],
      schedule: {
        workingDays: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
        hours: '09:00-18:00'
      },
      communicationStyle: 'дружелюбный, профессиональный',
      contact: {
        phone: '+7 (900) 123-45-67',
        address: 'г. Москва, ул. Примерная, 123'
      },
      reviews: 24,
      rating: 4.8,
      foundContent: {
        website: formData.website ? 'Найдено: услуги, цены, контакты' : null,
        instagram: formData.instagram ? 'Найдено: 45 постов, фото работ' : null,
        facebook: formData.facebook ? 'Найдено: отзывы, расписание' : null
      }
    }

    const newData = { 
      ...formData, 
      analysisResults, 
      isAnalyzing: false 
    }
    setFormData(newData)
    onDataChange(newData)
  }

  const hasDataSources = formData.website || formData.instagram || formData.facebook || formData.uploadedFiles.length > 0

  return (
    <div className="space-y-6">
      <Tabs defaultValue="links" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="links">Ссылки</TabsTrigger>
          <TabsTrigger value="files">Файлы</TabsTrigger>
        </TabsList>

        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Link className="w-5 h-5" />
                <span>Ссылки на ваши ресурсы</span>
              </CardTitle>
              <CardDescription>
                Добавьте ссылки на сайт и социальные сети для автоматического анализа
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>Сайт</span>
                </Label>
                <Input
                  id="website"
                  placeholder="https://your-website.com"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram" className="flex items-center space-x-2">
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </Label>
                <Input
                  id="instagram"
                  placeholder="https://instagram.com/your-profile"
                  value={formData.instagram}
                  onChange={(e) => handleInputChange('instagram', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebook" className="flex items-center space-x-2">
                  <Facebook className="w-4 h-4" />
                  <span>Facebook</span>
                </Label>
                <Input
                  id="facebook"
                  placeholder="https://facebook.com/your-page"
                  value={formData.facebook}
                  onChange={(e) => handleInputChange('facebook', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="googleBusiness">Google Business</Label>
                <Input
                  id="googleBusiness"
                  placeholder="Ссылка на Google Business профиль"
                  value={formData.googleBusiness}
                  onChange={(e) => handleInputChange('googleBusiness', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Загрузка файлов</span>
              </CardTitle>
              <CardDescription>
                Загрузите файлы с услугами, расписанием или другой информацией
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm font-medium mb-1">Услуги и цены</p>
                  <p className="text-xs text-gray-500 mb-2">Excel, PDF, DOCX</p>
                  <Button variant="outline" size="sm">
                    Выбрать файл
                  </Button>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm font-medium mb-1">Расписание</p>
                  <p className="text-xs text-gray-500 mb-2">Excel, CSV</p>
                  <Button variant="outline" size="sm">
                    Выбрать файл
                  </Button>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm font-medium mb-1">FAQ / Шаблоны</p>
                  <p className="text-xs text-gray-500 mb-2">TXT, DOCX, PDF</p>
                  <Button variant="outline" size="sm">
                    Выбрать файл
                  </Button>
                </div>
              </div>

              {formData.uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Загруженные файлы:</Label>
                  <div className="space-y-2">
                    {formData.uploadedFiles.map((file: any, index: number) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{file.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {file.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>AI-анализ данных</span>
          </CardTitle>
          <CardDescription>
            Система автоматически проанализирует ваши данные и предложит структуру
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasDataSources && (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Добавьте ссылки или загрузите файлы для анализа</p>
            </div>
          )}

          {hasDataSources && !formData.analysisResults && !formData.isAnalyzing && (
            <div className="text-center">
              <Button onClick={handleAnalyze} className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>Запустить анализ</span>
              </Button>
            </div>
          )}

          {formData.isAnalyzing && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Анализируем ваши данные...</span>
              </div>
              <Progress value={analyzeProgress} className="w-full" />
            </div>
          )}

          {formData.analysisResults && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Анализ завершен</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-4">
                    <h4 className="font-medium mb-2">Найденные услуги</h4>
                    <div className="space-y-1">
                      {formData.analysisResults.services.map((service: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{service.name}</span>
                          <span>{service.price}₽</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-4">
                    <h4 className="font-medium mb-2">Контактная информация</h4>
                    <div className="space-y-1 text-sm">
                      <p>📞 {formData.analysisResults.contact.phone}</p>
                      <p>📍 {formData.analysisResults.contact.address}</p>
                      <p>⭐ {formData.analysisResults.rating} ({formData.analysisResults.reviews} отзывов)</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="pt-4">
                  <h4 className="font-medium mb-2">Обнаруженный контент</h4>
                  <div className="space-y-2">
                    {Object.entries(formData.analysisResults.foundContent).map(([key, value]) => 
                      value && (
                        <div key={key} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{value}</span>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button variant="outline" onClick={() => handleInputChange('analysisResults', null)}>
                  Запустить повторный анализ
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}