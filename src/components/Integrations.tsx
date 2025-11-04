import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Switch } from './ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import {
  Search,
  Calendar,
  CreditCard,
  MessageSquare,
  BarChart3,
  Database,
  Settings,
  CheckCircle,
  ExternalLink,
  Plus
} from 'lucide-react'

interface Integration {
  id: string
  name: string
  category: string
  description: string
  icon: any
  connected: boolean
  enabled: boolean
  color: string
}

export function Integrations() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Google Calendar',
      category: 'calendar',
      description: 'Sync appointments with Google Calendar',
      icon: Calendar,
      connected: true,
      enabled: true,
      color: 'blue'
    },
    {
      id: '2',
      name: 'Stripe',
      category: 'payments',
      description: 'Accept online payments and deposits',
      icon: CreditCard,
      connected: true,
      enabled: true,
      color: 'purple'
    },
    {
      id: '3',
      name: 'WhatsApp Business',
      category: 'messaging',
      description: 'Send notifications via WhatsApp',
      icon: MessageSquare,
      connected: false,
      enabled: false,
      color: 'green'
    },
    {
      id: '4',
      name: 'Telegram Bot',
      category: 'messaging',
      description: 'Automated booking through Telegram',
      icon: MessageSquare,
      connected: false,
      enabled: false,
      color: 'blue'
    },
    {
      id: '5',
      name: 'Google Analytics',
      category: 'analytics',
      description: 'Track website visits and conversions',
      icon: BarChart3,
      connected: true,
      enabled: false,
      color: 'orange'
    },
    {
      id: '6',
      name: 'Meta Pixel',
      category: 'analytics',
      description: 'Facebook and Instagram tracking',
      icon: BarChart3,
      connected: false,
      enabled: false,
      color: 'blue'
    },
    {
      id: '7',
      name: 'HubSpot CRM',
      category: 'crm',
      description: 'Sync contacts and deals',
      icon: Database,
      connected: false,
      enabled: false,
      color: 'orange'
    },
    {
      id: '8',
      name: 'Zapier',
      category: 'automation',
      description: 'Connect to 5000+ apps',
      icon: Settings,
      connected: false,
      enabled: false,
      color: 'orange'
    },
    {
      id: '9',
      name: 'PayPal',
      category: 'payments',
      description: 'Alternative payment gateway',
      icon: CreditCard,
      connected: false,
      enabled: false,
      color: 'blue'
    }
  ])

  const categories = [
    { id: 'all', label: 'All Integrations' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'payments', label: 'Payments' },
    { id: 'messaging', label: 'Messaging' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'crm', label: 'CRM' },
    { id: 'automation', label: 'Automation' }
  ]

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === 'all' || integration.category === filter
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: integrations.length,
    connected: integrations.filter(i => i.connected).length,
    active: integrations.filter(i => i.enabled && i.connected).length
  }

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(integration =>
      integration.id === id && integration.connected
        ? { ...integration, enabled: !integration.enabled }
        : integration
    ))
  }

  const connectIntegration = (id: string) => {
    setIntegrations(integrations.map(integration =>
      integration.id === id
        ? { ...integration, connected: true, enabled: true }
        : integration
    ))
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1>Integrations</h1>
          <p className="text-muted-foreground">
            Connect SmartMate Pro with your favorite tools
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Request Integration</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Integrations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Connected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.connected}</div>
            <p className="text-xs text-muted-foreground">Linked accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently in use</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Tabs value={filter} onValueChange={setFilter} className="w-full md:w-auto">
              <TabsList className="grid grid-cols-4 md:grid-cols-7">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="text-xs">
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIntegrations.map((integration) => {
              const Icon = integration.icon
              return (
                <Card 
                  key={integration.id}
                  className={`relative ${
                    integration.connected && integration.enabled
                      ? 'border-blue-200 bg-blue-50'
                      : ''
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        integration.color === 'blue' ? 'bg-blue-100' :
                        integration.color === 'green' ? 'bg-green-100' :
                        integration.color === 'purple' ? 'bg-purple-100' :
                        integration.color === 'orange' ? 'bg-orange-100' :
                        'bg-gray-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          integration.color === 'blue' ? 'text-blue-600' :
                          integration.color === 'green' ? 'text-green-600' :
                          integration.color === 'purple' ? 'text-purple-600' :
                          integration.color === 'orange' ? 'text-orange-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                      {integration.connected && (
                        <Switch
                          checked={integration.enabled}
                          onCheckedChange={() => toggleIntegration(integration.id)}
                        />
                      )}
                    </div>

                    <h4 className="font-medium mb-1">{integration.name}</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      {integration.description}
                    </p>

                    <div className="flex items-center justify-between">
                      {integration.connected ? (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-600 font-medium">Connected</span>
                        </div>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => connectIntegration(integration.id)}
                          className="flex items-center space-x-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Connect</span>
                        </Button>
                      )}
                      
                      {integration.connected && (
                        <Button variant="outline" size="sm">
                          <Settings className="w-3 h-3 mr-1" />
                          Configure
                        </Button>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {integration.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredIntegrations.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No integrations found</p>
              <p className="text-sm text-gray-400">Try adjusting your search or filter</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Popular Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Integrations</CardTitle>
          <CardDescription>
            Most commonly used integrations by SmartMate Pro users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {integrations
              .filter(i => ['Google Calendar', 'Stripe', 'WhatsApp Business'].includes(i.name))
              .map((integration) => {
                const Icon = integration.icon
                return (
                  <div 
                    key={integration.id}
                    className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      integration.color === 'blue' ? 'bg-blue-100' :
                      integration.color === 'green' ? 'bg-green-100' :
                      integration.color === 'purple' ? 'bg-purple-100' :
                      'bg-gray-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        integration.color === 'blue' ? 'text-blue-600' :
                        integration.color === 'green' ? 'text-green-600' :
                        integration.color === 'purple' ? 'text-purple-600' :
                        'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{integration.name}</h4>
                      <p className="text-xs text-gray-500">
                        {integration.connected ? 'Connected' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}