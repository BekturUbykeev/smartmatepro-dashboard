import { useState } from 'react';
import { motion } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Step1BusinessData } from './components/Step1BusinessData';
import { Step2ServicesBooking } from './components/Step2ServicesBooking';
import { Step3AINotifications } from './components/Step3AINotifications';
import { Step4TestLaunch } from './components/Step4TestLaunch';
import { DashboardPage } from './components/DashboardPage';
import { CalendarPage } from './components/CalendarPage';
import { ChatsPage } from './components/ChatsPage';
import { IntegrationsPage } from './components/IntegrationsPage';
import { Progress } from './components/ui/progress';

type PageType = 'Business Setup' | 'Dashboard' | 'Calendar' | 'Chats' | 'Integrations';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('Dashboard');
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleNext = () => setCurrentStep(s => Math.min(s + 1, totalSteps));
  const handleBack = () => setCurrentStep(s => Math.max(s - 1, 1));
  const handleNavigate = (page: string) => setCurrentPage(page as PageType);

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar activeItem={currentPage} onNavigate={handleNavigate} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="flex-none">
          {/* На календаре — компактная шапка и без поиска */}
          <Header showSearch={currentPage !== 'Calendar'} compact={currentPage === 'Calendar'} />
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0 overflow-hidden bg-white">
          {/* Business Setup */}
          {currentPage === 'Business Setup' && (
            <div className="max-w-4xl mx-auto p-8 overflow-auto h-full">
              <div className="mb-8">
                <h1 className="text-2xl mb-4">AI Assistant Setup</h1>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>{currentStep} of {totalSteps} steps completed</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              </div>

              <motion.div key={currentStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                {currentStep === 1 && <Step1BusinessData onNext={handleNext} onBack={handleBack} />}
                {currentStep === 2 && <Step2ServicesBooking onNext={handleNext} onBack={handleBack} />}
                {currentStep === 3 && <Step3AINotifications onNext={handleNext} onBack={handleBack} />}
                {currentStep === 4 && <Step4TestLaunch onNext={() => alert('Setup Complete!')} onBack={handleBack} />}
              </motion.div>
            </div>
          )}

          {/* Dashboard */}
          {currentPage === 'Dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="h-full overflow-auto">
              <DashboardPage />
            </motion.div>
          )}

          {/* Calendar */}
          {currentPage === 'Calendar' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="h-full overflow-hidden">
              <CalendarPage />
            </motion.div>
          )}

          {/* Chats */}
          {currentPage === 'Chats' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="h-full overflow-auto">
              <ChatsPage />
            </motion.div>
          )}

          {/* Integrations */}
          {currentPage === 'Integrations' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="h-full overflow-auto">
              <IntegrationsPage />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
