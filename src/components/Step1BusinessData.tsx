import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, FileText, Plus, Check, X, Upload, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface Step1Props {
  onNext: () => void;
  onBack: () => void;
}

interface Link {
  id: number;
  platform: string;
  url: string;
  verified: boolean;
  verifying: boolean;
}

export function Step1BusinessData({ onNext, onBack }: Step1Props) {
  const [activeTab, setActiveTab] = useState<'links' | 'files'>('links');
  const [links, setLinks] = useState<Link[]>([
    { id: 1, platform: 'Website', url: 'https://shark-barber.com', verified: false, verifying: false },
    { id: 2, platform: 'Instagram', url: 'https://instagram.com/sharkbarber', verified: false, verifying: false },
    { id: 3, platform: 'Facebook', url: 'https://facebook.com/sharkbarber', verified: false, verifying: false },
  ]);
  const [newLinkPlatform, setNewLinkPlatform] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const addLink = () => {
    if (newLinkPlatform.trim()) {
      const newLink: Link = {
        id: Date.now(),
        platform: newLinkPlatform.trim(),
        url: '',
        verified: false,
        verifying: false
      };
      setLinks(prev => [...prev, newLink]);
      setNewLinkPlatform('');
    }
  };

  const removeLink = (id: number) => {
    setLinks(prev => prev.filter(link => link.id !== id));
  };

  const updateLinkUrl = (id: number, url: string) => {
    setLinks(prev => prev.map(link => 
      link.id === id ? { ...link, url, verified: false, verifying: false } : link
    ));
  };

  const verifyLink = (id: number) => {
    const link = links.find(l => l.id === id);
    if (!link || !link.url) return;

    setLinks(prev => prev.map(l => 
      l.id === id ? { ...l, verifying: true } : l
    ));

    setTimeout(() => {
      setLinks(prev => prev.map(l => 
        l.id === id ? { ...l, verified: true, verifying: false } : l
      ));
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Step Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-[#0066FF] flex items-center justify-center shrink-0">
          <Info className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl">Business Data</h2>
          <p className="text-sm text-gray-600 mt-1">Provide your business information to get started</p>
        </div>
      </div>

      {/* Import Data Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-[0_8px_32px_rgba(0,102,255,0.12)] transition-all duration-300"
      >
        <div className="flex items-start gap-3 mb-4">
          <FileText className="w-5 h-5 text-[#0066FF] mt-0.5" />
          <div className="flex-1">
            <h3 className="text-base">Import Data</h3>
            <p className="text-sm text-gray-600 mt-1">
              Connect your social or website links so AI can learn about your business
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('links')}
              className={`px-4 py-1.5 text-sm rounded-md transition-all ${
                activeTab === 'links'
                  ? 'bg-[#0066FF] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Links
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`px-4 py-1.5 text-sm rounded-md transition-all ${
                activeTab === 'files'
                  ? 'bg-[#0066FF] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Files
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'links' ? (
            <motion.div
              key="links"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {links.map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="space-y-2"
                >
                  <label className="text-sm text-gray-700">
                    {['Website', 'Instagram', 'Facebook'].includes(link.platform) ? link.platform : 'Link'}
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        value={link.url}
                        onChange={(e) => updateLinkUrl(link.id, e.target.value)}
                        placeholder={`https://${link.platform.toLowerCase()}.com`}
                        className={link.verified ? 'pr-10 border-[#34ca57]' : ''}
                      />
                      {link.verified && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          <Check className="w-4 h-4 text-[#34ca57]" />
                        </motion.div>
                      )}
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className={link.verified ? "text-[#34ca57]" : ""}>
                            <Button
                              variant={link.verified ? "default" : "outline"}
                              onClick={() => verifyLink(link.id)}
                              disabled={!link.url || link.verifying || link.verified}
                              className={link.verified ? "!bg-[#34ca57] hover:!bg-[#34ca57] min-w-[110px]" : "min-w-[110px] border-gray-300 text-slate-900 hover:bg-slate-50"}
                            >
                              {link.verifying ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                  Verifying
                                </>
                              ) : link.verified ? (
                                "Verified ✓"
                              ) : (
                                "Verify"
                              )}
                            </Button>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{link.verified ? 'Verified' : 'Verify link'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => removeLink(link.id)}
                              className="bg-black hover:bg-black/90 text-white border-black"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remove link</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </motion.div>
              ))}

              {/* Add Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex gap-2 pt-2"
              >
                <motion.div
                  whileHover={{ borderColor: '#0066FF', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                  className="flex items-center gap-2 flex-1 px-4 py-2 border border-dashed border-gray-300 rounded-lg transition-all"
                >
                  <Plus className="w-5 h-5 text-[#0066FF]" />
                  <Input
                    value={newLinkPlatform}
                    onChange={(e) => setNewLinkPlatform(e.target.value)}
                    placeholder="Platform name (e.g., Twitter, LinkedIn)"
                    className="border-0 bg-transparent focus-visible:ring-0 p-0 h-auto"
                    onKeyDown={(e) => e.key === 'Enter' && addLink()}
                  />
                </motion.div>
                {newLinkPlatform && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <Button onClick={addLink} size="icon" className="bg-[#0066FF] hover:bg-[#0052CC]">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="files"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <motion.label
                whileHover={{ borderColor: '#0066FF', backgroundColor: '#f8fafc', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                className="border border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer block transition-all"
              >
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-4">
                  Drop your file here or click to browse
                </p>
                <Button variant="outline" className="gap-2" type="button">
                  <FileText className="w-4 h-4" />
                  Choose File
                </Button>
                <p className="text-xs text-gray-500 mt-3">
                  Supported formats: PDF, DOC, DOCX, TXT
                </p>
              </motion.label>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm text-gray-700">Uploaded Files</label>
                  <AnimatePresence>
                    {uploadedFiles.map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-[#0066FF]" />
                          <div>
                            <p className="text-sm text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => removeFile(index)}
                          className="h-8 w-8"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Business Information Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-[0_8px_32px_rgba(0,102,255,0.12)] transition-all duration-300"
      >
        <div className="flex items-start gap-3 mb-6">
          <FileText className="w-5 h-5 text-[#0066FF] mt-0.5" />
          <div>
            <h3 className="text-base">Business Information</h3>
            <p className="text-xs text-gray-500 mt-1">Basic details about your business</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-700">
              Business Name
            </label>
            <Input defaultValue="Shark Barber Shop LLC" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700">Service Type</label>
            <Select defaultValue="beauty">
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="freelance">Freelance & Consulting</SelectItem>
                <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                <SelectItem value="health">Health & Wellness</SelectItem>
                <SelectItem value="education">Education & Tutoring</SelectItem>
                <SelectItem value="pet">Pet Services</SelectItem>
                <SelectItem value="auto">Auto Services</SelectItem>
                <SelectItem value="home">Home Services</SelectItem>
                <SelectItem value="photography">Photography & Video</SelectItem>
                <SelectItem value="event">Event & Entertainment</SelectItem>
                <SelectItem value="tech">Tech Support & IT Services</SelectItem>
                <SelectItem value="design">Design & Creative</SelectItem>
                <SelectItem value="legal">Legal & Financial</SelectItem>
                <SelectItem value="realestate">Real Estate & Property</SelectItem>
                <SelectItem value="delivery">Delivery & Transport</SelectItem>
                <SelectItem value="other">Other / Custom Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700">
              Email
            </label>
            <Input type="email" defaultValue="shark@barber.com" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700">Phone Number</label>
            <Input type="tel" defaultValue="+1 (555) 123-4567" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700">Specialist Name</label>
            <Input defaultValue="John Doe" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700">Location</label>
            <Input defaultValue="San Francisco, CA" />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="px-8 bg-black text-white hover:bg-[#2A2A2A] hover:text-white border-black"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          className="px-8 bg-[#0066FF] hover:bg-[#0052CC]"
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
}
