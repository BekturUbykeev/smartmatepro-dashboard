import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp,
  MessageSquare,
  Clock,
  Star,
  Zap
} from 'lucide-react'

export function Dashboard() {
  const stats = {
    bookingsThisWeek: 25,
    newClients: 12,
    totalRevenue: 682.5,
    calendarUtilization: 68,
    automation: 82,
    avgRating: 4.8,
    totalReviews: 76,
    responseTime: '2 min'
  }

  const weeklyData = [
    { day: 'Mon', bookings: 4, revenue: 120 },
    { day: 'Tue', bookings: 3, revenue: 90 },
    { day: 'Wed', bookings: 6, revenue: 180 },
    { day: 'Thu', bookings: 5, revenue: 150 },
    { day: 'Fri', bookings: 8, revenue: 240 },
    { day: 'Sat', bookings: 12, revenue: 360 },
    { day: 'Sun', bookings: 7, revenue: 210 }
  ]

  const recentBookings = [
    { id: 1, client: 'Alex M.', service: 'Haircut + Beard', time: '14:30', status: 'confirmed' },
    { id: 2, client: 'Dmitry K.', service: 'Men\'s Haircut', time: '16:00', status: 'pending' },
    { id: 3, client: 'Michael R.', service: 'Full Service', time: '18:30', status: 'confirmed' }
  ]

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your business and AI bot performance
          </p>
        </div>
        <Badge className="bg-green-500">
          Bot Active
        </Badge>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Weekly Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bookingsThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New Clients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newClients}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Automation
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.automation}%</div>
            <p className="text-xs text-muted-foreground">
              Bookings via bot
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Booking chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Bookings</CardTitle>
            <CardDescription>
              Number of bookings throughout the week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Revenue</CardTitle>
            <CardDescription>
              Revenue throughout the week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent bookings */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>
              Latest bookings through your AI bot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {booking.client.split(' ')[0].charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{booking.client}</p>
                      <p className="text-sm text-muted-foreground">{booking.service}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{booking.time}</p>
                    <Badge 
                      variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>
              Key performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Calendar Utilization</span>
                <span className="text-sm font-medium">{stats.calendarUtilization}%</span>
              </div>
              <Progress value={stats.calendarUtilization} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">Rating</span>
              </div>
              <div className="text-right">
                <div className="font-medium">{stats.avgRating}</div>
                <div className="text-xs text-muted-foreground">{stats.totalReviews} reviews</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Response Time</span>
              </div>
              <div className="font-medium">{stats.responseTime}</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm">Conversion</span>
              </div>
              <div className="font-medium">85%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Today's Schedule</span>
          </CardTitle>
          <CardDescription>
            May 27, 2024
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">10:00 - 11:00</span>
                <Badge>Confirmed</Badge>
              </div>
              <p className="text-sm">Men's Haircut</p>
              <p className="text-xs text-muted-foreground">John Simpson</p>
            </div>

            <div className="p-4 border rounded-lg bg-green-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">14:00 - 14:30</span>
                <Badge variant="secondary">Pending</Badge>
              </div>
              <p className="text-sm">Beard Trim</p>
              <p className="text-xs text-muted-foreground">30 min</p>
            </div>

            <div className="p-4 border rounded-lg bg-orange-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">16:00 - 17:00</span>
                <Badge>Full Service</Badge>
              </div>
              <p className="text-sm">Haircut + Beard</p>
              <p className="text-xs text-muted-foreground">60 min</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}