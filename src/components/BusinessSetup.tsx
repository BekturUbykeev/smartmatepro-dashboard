import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { CheckCircle, Circle, ArrowLeft, ArrowRight } from 'lucide-react'
import { BasicInfo } from './setup-steps/BasicInfo'
import { DataImport } from './setup-steps/DataImport'
import { ServicesAndPricing } from './setup-steps/ServicesAndPricing'
import { BookingLogic } from './setup-steps/BookingLogic'
import { ChatBehavior } from './setup-steps/ChatBehavior'
import { NotificationsAndFollowups } from './setup-steps/NotificationsAndFollowups'
import { Integrations as SetupIntegrations } from './setup-steps/Integrations'
import { TestingMode } from './setup-steps/TestingMode'
import { PublishAndReview } from './setup-steps/PublishAndReview'

interface SetupStep {
  id: string
  title: string
  description: string
  completed: boolean
  component: React.ComponentType<any>
}

export function BusinessSetup() {
  const [currentStep, setCurrentStep] = useState(0)
  const [setupData, setSetupData] = useState({})

  const steps: SetupStep[] = [
    {
      id: 'basic-info',
      title: 'Basic Info',
      description: 'Basic information about your business',
      completed: false,
      component: BasicInfo
    },
    {
      id: 'data-import',
      title: 'Data Import',
      description: 'Import data from websites and files',
      completed: false,
      component: DataImport
    },
    {
      id: 'services-pricing',
      title: 'Services & Pricing',
      description: 'Configure services and pricing',
      completed: false,
      component: ServicesAndPricing
    },
    {
      id: 'booking-logic',
      title: 'Booking Logic',
      description: 'Booking and scheduling logic',
      completed: false,
      component: BookingLogic
    },
    {
      id: 'chat-behavior',
      title: 'Chat Behavior',
      description: 'Bot behavior and style',
      completed: false,
      component: ChatBehavior
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Notifications and follow-ups',
      completed: false,
      component: NotificationsAndFollowups
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'External service integrations',
      completed: false,
      component: SetupIntegrations
    },
    {
      id: 'testing',
      title: 'Testing Mode',
      description: 'Test your bot configuration',
      completed: false,
      component: TestingMode
    },
    {
      id: 'publish',
      title: 'Publish & Review',
      description: 'Launch your bot',
      completed: false,
      component: PublishAndReview
    }
  ]

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      // Mark current step as completed
      steps[currentStep].completed = true
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex)
  }

  const CurrentComponent = steps[currentStep].component

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">Business Setup</h1>
        <p className="text-muted-foreground mb-4">
          Set up your AI bot in a few simple steps
        </p>
        
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Setup Progress</span>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Steps sidebar */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Setup Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  className={`w-full flex items-start space-x-3 p-3 rounded-lg text-left transition-colors ${
                    index === currentStep 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className={`w-5 h-5 ${
                        index === currentStep ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${
                      index === currentStep ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {step.description}
                    </p>
                  </div>
                  {index === currentStep && (
                    <Badge variant="secondary" className="ml-2">
                      Текущий
                    </Badge>
                  )}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="col-span-9">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{steps[currentStep].title}</span>
                    <Badge variant="outline">
                      {currentStep + 1} из {steps.length}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {steps[currentStep].description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CurrentComponent 
                data={setupData}
                onDataChange={setSetupData}
              />
              
              {/* Navigation buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Назад</span>
                </Button>
                
                <Button 
                  onClick={handleNext}
                  disabled={currentStep === steps.length - 1}
                  className="flex items-center space-x-2"
                >
                  <span>
                    {currentStep === steps.length - 1 ? 'Завершить' : 'Далее'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}