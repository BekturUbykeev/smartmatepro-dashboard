import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { Badge } from './ui/badge'
import { 
  Search, 
  MessageSquare, 
  BookOpen, 
  Video, 
  Mail,
  Phone,
  Clock,
  ExternalLink,
  HelpCircle
} from 'lucide-react'

export function Support() {
  const faqs = [
    {
      question: 'How do I set up my AI bot?',
      answer: 'Go to Business Setup and follow the step-by-step wizard. The AI will automatically analyze your website and social media to extract services, pricing, and schedule information. You can review and edit everything before publishing.'
    },
    {
      question: 'Can I integrate with my existing calendar?',
      answer: 'Yes! SmartMate Pro integrates with Google Calendar, Outlook, and other popular calendar services. Go to Integrations > Calendar to connect your account. All bookings will sync automatically in both directions.'
    },
    {
      question: 'How does the AI bot handle customer conversations?',
      answer: 'The AI bot uses your business information to handle bookings, answer questions about services, provide pricing, and suggest available time slots. You can customize the bot\'s tone and behavior in Business Setup > Chat Behavior.'
    },
    {
      question: 'What payment methods are supported?',
      answer: 'We support Stripe and PayPal for online payments. You can enable deposit requirements, full prepayment, or pay-on-arrival options. Configure this in Business Setup > Services & Pricing.'
    },
    {
      question: 'Can I have multiple staff members?',
      answer: 'Yes! The Business and Premium plans support multiple staff members. Each staff member can have their own schedule, services, and availability. Manage this in Business Setup > Booking Logic.'
    },
    {
      question: 'How do notifications work?',
      answer: 'SmartMate Pro sends automatic notifications via WhatsApp, SMS, Email, and Telegram. You can configure reminder times, follow-up messages, and review requests in Business Setup > Notifications.'
    },
    {
      question: 'Is there a mobile app?',
      answer: 'Currently, SmartMate Pro is web-based and works great on mobile browsers. A dedicated mobile app is coming soon! You\'ll receive notifications when it\'s available.'
    },
    {
      question: 'How do I upgrade or downgrade my plan?',
      answer: 'Go to Pricing to view all plans and change your subscription. Changes take effect immediately, and you\'ll be charged/credited the prorated amount.'
    }
  ]

  const resources = [
    {
      title: 'Getting Started Guide',
      description: 'Learn the basics of setting up your SmartMate Pro account',
      icon: BookOpen,
      link: '#'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step videos on all features',
      icon: Video,
      link: '#'
    },
    {
      title: 'API Documentation',
      description: 'Integrate SmartMate Pro with your custom applications',
      icon: BookOpen,
      link: '#'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users and share tips',
      icon: MessageSquare,
      link: '#'
    }
  ]

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'support@smartmate.pro',
      subtitle: 'Response within 24 hours',
      action: 'Send Email'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Available 9 AM - 6 PM EST',
      subtitle: 'Average response: 5 minutes',
      action: 'Start Chat'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: '+1 (555) 123-4567',
      subtitle: 'Premium plan only',
      action: 'Call Now'
    }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-2">Support Center</h1>
        <p className="text-muted-foreground mb-6">
          Get help with SmartMate Pro - We're here to assist you
        </p>

        {/* Search */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search for help articles, guides, and FAQs..."
              className="pl-12 py-6 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contactMethods.map((method) => {
          const Icon = method.icon
          return (
            <Card key={method.title} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{method.title}</CardTitle>
                <CardDescription>
                  <div>{method.description}</div>
                  <div className="flex items-center space-x-1 mt-1">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">{method.subtitle}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  {method.action}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Resources</CardTitle>
          <CardDescription>
            Explore guides, tutorials, and documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource) => {
              const Icon = resource.icon
              return (
                <button
                  key={resource.title}
                  className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{resource.title}</h4>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">{resource.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5" />
            <span>Frequently Asked Questions</span>
          </CardTitle>
          <CardDescription>
            Find quick answers to common questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle>Still need help?</CardTitle>
          <CardDescription>
            Send us a message and we'll get back to you as soon as possible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="your@email.com" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input placeholder="What do you need help with?" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                placeholder="Describe your issue or question in detail..."
                rows={6}
              />
            </div>

            <div className="flex justify-end">
              <Button className="px-8">Send Message</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Status */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <div>
                <h4 className="font-medium text-green-900">All Systems Operational</h4>
                <p className="text-sm text-green-700">All services are running smoothly</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              View Status Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}