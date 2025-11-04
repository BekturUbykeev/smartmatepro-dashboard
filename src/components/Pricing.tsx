import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Check } from 'lucide-react'

export function Pricing() {
  const plans = [
    {
      name: 'Starter',
      description: 'Quick start for small businesses',
      price: 29.99,
      features: [
        'Up to 100 bookings / month',
        '1 service and 1 location',
        'Basic notifications (email)',
        'Online booking page',
        'Basic for team',
        'Working hours setup',
        'Service duration & price',
        'Manual booking approval'
      ],
      keyFeatures: [
        'Online booking page',
        'Basic for team',
        'Working hours setup',
        'Service duration & price',
        'Manual booking approval'
      ],
      highlighted: false
    },
    {
      name: 'Business',
      description: 'Automation & growth tools',
      price: 59.99,
      features: [
        'Unlimited bookings',
        'Up to 8 services and 3 staff members',
        'Notifications (Email, WhatsApp, SMS)',
        'Smart booking rules',
        'Everything in Starter, plus:',
        'Advanced set replies & FAQ',
        'Multiple staff schedules',
        'Google Calendar sync',
        'Payment integration (Stripe, PayPal)',
        'Auto-reminders for clients'
      ],
      keyFeatures: [
        'Everything in Starter, plus:',
        'Advanced set replies & FAQ',
        'Multiple staff schedules',
        'Google Calendar sync',
        'Payment integration (Stripe, PayPal)',
        'Auto-reminders for clients'
      ],
      highlighted: true
    },
    {
      name: 'Premium',
      description: 'Advanced admin & security',
      price: 99.99,
      features: [
        'Unlimited services, staff, and locations',
        'Priority notifications (Email, WhatsApp, SMS)',
        'AI suggestions for free slots',
        'Everything in Business, plus:',
        'CRM integrations (HubSpot, Bitrix24, etc.)',
        'Custom branding for booking page',
        'Advanced analytics & reports',
        'Team roles & permissions',
        'Priority support'
      ],
      keyFeatures: [
        'Everything in Business, plus:',
        'CRM integrations (HubSpot, Bitrix24, etc.)',
        'Custom branding for booking page',
        'Advanced analytics & reports',
        'Team roles & permissions',
        'Priority support'
      ],
      highlighted: false
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-2">Pricing</h1>
          <h2 className="text-3xl font-normal text-gray-700 mb-8">
            Choose the plan that fits your needs.
          </h2>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.highlighted
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xl scale-105'
                  : 'bg-white'
              }`}
            >
              <CardHeader>
                <CardTitle className={plan.highlighted ? 'text-white' : ''}>
                  {plan.name}
                </CardTitle>
                <CardDescription className={plan.highlighted ? 'text-blue-100' : ''}>
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className={`text-3xl font-semibold ${plan.highlighted ? 'text-white' : ''}`}>
                    $ {plan.price}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Choose plan
                </Button>

                {/* Features list */}
                <div className="space-y-3">
                  {plan.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm">
                      <span className={plan.highlighted ? 'text-blue-100' : 'text-gray-600'}>
                        • {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {plan.highlighted && (
                  <div className="border-t border-blue-400 pt-4" />
                )}

                {/* Key Features */}
                <div className="space-y-2">
                  <h4 className={`text-sm font-medium ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                    Key Features
                  </h4>
                  <div className="space-y-2">
                    {plan.keyFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          plan.highlighted ? 'text-white' : 'text-blue-600'
                        }`} />
                        <span className={`text-sm ${
                          plan.highlighted ? 'text-blue-50' : 'text-gray-600'
                        }`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <h3 className="mb-4">Need a custom plan?</h3>
          <p className="text-gray-600 mb-6">
            Contact us for enterprise solutions with custom features and pricing
          </p>
          <Button variant="outline" size="lg">
            Contact Sales
          </Button>
        </div>
      </div>
    </div>
  )
}