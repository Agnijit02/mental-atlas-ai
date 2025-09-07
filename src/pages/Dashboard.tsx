import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { summarizeText, generateFaqs, generateMindmap, chatWithDocument } from '@/api/notemonApi';
import FileUploadCard from '@/components/FileUploadCard';
import {
  Plus, 
  FileText, 
  MessageCircle, 
  Brain, 
  List, 
  Send, 
  Loader2, 
  Home,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const Dashboard = () => {
  const [documentContent, setDocumentContent] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // --- Handler for successful upload from the new card component ---
  const handleUploadSuccess = (file: File) => {
    toast({
      title: "Upload Successful!",
      description: `${file.name} has been processed.`, // In a real app, you would refresh your file list here.
    });
  };
  
  // Sample files for demonstration
  const sampleFiles = [
    { id: 1, name: 'Physics_Notes.pdf', size: '2.4 MB', uploadDate: '2024-01-15' },
    { id: 2, name: 'History_Chapter_5.docx', size: '1.8 MB', uploadDate: '2024-01-14' },
    { id: 3, name: 'Math_Formulas.pdf', size: '890 KB', uploadDate: '2024-01-13' },
  ];

  // Handle API calls
  const handleSummarize = async () => {
    if (!documentContent.trim()) {
      toast({
        title: 'No content to summarize',
        description: 'Please upload a document or enter some text first.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setActiveFeature('summary');
    
    try {
      const result = await summarizeText(documentContent);
      setResults(result);
      toast({
        title: 'Summary generated!',
        description: 'Your document summary is ready.',
      });
    } catch (error) {
      toast({
        title: 'Summary failed',
        description: 'Unable to generate summary. Please try again.',
        variant: 'destructive',
      });
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateFAQs = async () => {
    if (!documentContent.trim()) {
      toast({
        title: 'No content for FAQs',
        description: 'Please upload a document or enter some text first.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setActiveFeature('faqs');
    
    try {
      const result = await generateFaqs(documentContent);
      setResults(result);
      toast({
        title: 'FAQs generated!',
        description: 'Your document FAQs are ready.',
      });
    } catch (error) {
      toast({
        title: 'FAQ generation failed',
        description: 'Unable to generate FAQs. Please try again.',
        variant: 'destructive',
      });
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateMindmap = async () => {
    if (!documentContent.trim()) {
      toast({
        title: 'No content for mindmap',
        description: 'Please upload a document or enter some text first.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setActiveFeature('mindmap');
    
    try {
      const result = await generateMindmap(documentContent);
      setResults(result);
      toast({
        title: 'Mindmap generated!',
        description: 'Your visual mindmap is ready.',
      });
    } catch (error) {
      toast({
        title: 'Mindmap generation failed',
        description: 'Unable to generate mindmap. Please try again.',
        variant: 'destructive',
      });
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chatMessage.trim()) return;
    if (!documentContent.trim()) {
      toast({
        title: 'No document loaded',
        description: 'Please upload a document to chat about.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setActiveFeature('chat');
    
    try {
      const result = await chatWithDocument(chatMessage, documentContent);
      setResults({ chat: result, message: chatMessage });
      setChatMessage('');
      toast({
        title: 'Response received!',
        description: 'AI has analyzed your question.',
      });
    } catch (error) {
      toast({
        title: 'Chat failed',
        description: 'Unable to process your message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-notemon-text-main">
      {/* Header */}
      <header className="bg-notemon-surface/50 border-b border-notemon-surface backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-notemon-text-main to-notemon-primary bg-clip-text text-transparent">
                NoteMon
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-notemon-text-secondary">
                Welcome to your AI Study Partner
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/')}
                className="border-notemon-surface text-notemon-text-secondary hover:text-notemon-text-main hover:bg-notemon-surface/20"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
          {/* Left Column - File List */}
          <div className="col-span-3">
            <Card className="bg-notemon-surface/50 border-notemon-surface h-full">
                         <CardHeader>
                <CardTitle className="text-notemon-text-main flex items-center justify-between">
                  <span>Documents</span>
                  <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                    <DialogTrigger asChild>
                      <Button size="icon" className="bg-gradient-primary hover:bg-notemon-primary-hover text-white h-8 w-8">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-notemon-surface border-notemon-border text-notemon-text-main">
                      {/* Use the new component here */}
                      <FileUploadCard
                        onClose={() => setIsUploadModalOpen(false)}
                        onUploadSuccess={handleUploadSuccess}
                      />
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100%-8rem)]">
                  <div className="space-y-3">
                    {sampleFiles.map((file) => (
                      <div
                        key={file.id}
                        className="p-3 rounded-lg bg-notemon-background/50 hover:bg-notemon-background/70 cursor-pointer transition-colors"
                        onClick={() => setDocumentContent(`Sample content for ${file.name}. This is a demonstration of how the document content would appear here. This document contains information about various topics that can be analyzed using AI tools.`)}
                      >
                        <div className="flex items-start space-x-3">
                          <FileText className="h-5 w-5 text-notemon-primary mt-1" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-notemon-text-main truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-notemon-text-secondary">
                              {file.size} • {file.uploadDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Chat/Results */}
          <div className="col-span-6">
            <Card className="bg-notemon-surface/30 border-notemon-surface h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-notemon-text-main flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  {activeFeature === 'chat' ? 'Chat Results' : 
                   activeFeature === 'summary' ? 'Summary' :
                   activeFeature === 'faqs' ? 'FAQs' :
                   activeFeature === 'mindmap' ? 'Mindmap' : 'Results'}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 mb-4">
                  <div className="min-h-[400px] p-4 bg-notemon-background/30 rounded-lg">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Loader2 className="h-8 w-8 animate-spin text-notemon-primary mx-auto mb-4" />
                          <p className="text-notemon-text-secondary">
                            {activeFeature === 'summary' ? 'Generating summary...' :
                             activeFeature === 'faqs' ? 'Creating FAQs...' :
                             activeFeature === 'mindmap' ? 'Building mindmap...' :
                             activeFeature === 'chat' ? 'Processing your question...' : 'Working...'}
                          </p>
                        </div>
                      </div>
                    ) : results ? (
                      <div className="space-y-4">
                        {activeFeature === 'summary' && results.summary && (
                          <div>
                            <h3 className="font-semibold text-notemon-text-main mb-2">Summary</h3>
                            <p className="text-notemon-text-secondary leading-relaxed">{results.summary}</p>
                            {results.keyPoints && (
                              <div className="mt-4">
                                <h4 className="font-medium text-notemon-text-main mb-2">Key Points</h4>
                                <ul className="list-disc list-inside space-y-1 text-notemon-text-secondary">
                                  {results.keyPoints.map((point: string, index: number) => (
                                    <li key={index}>{point}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                        {activeFeature === 'faqs' && results.faqs && (
                          <div className="space-y-4">
                            <h3 className="font-semibold text-notemon-text-main">Frequently Asked Questions</h3>
                            {results.faqs.map((faq: any, index: number) => (
                              <div key={index} className="border-l-2 border-notemon-primary pl-4">
                                <h4 className="font-medium text-notemon-text-main mb-1">{faq.question}</h4>
                                <p className="text-notemon-text-secondary">{faq.answer}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        {activeFeature === 'chat' && results.chat && (
                          <div className="space-y-4">
                            <div className="bg-notemon-surface/50 p-3 rounded-lg">
                              <p className="text-notemon-text-main font-medium">You asked:</p>
                              <p className="text-notemon-text-secondary">{results.message}</p>
                            </div>
                            <div className="bg-notemon-primary/10 p-3 rounded-lg">
                              <p className="text-notemon-text-main font-medium">AI Response:</p>
                              <p className="text-notemon-text-secondary">{results.chat}</p>
                            </div>
                          </div>
                        )}
                        {activeFeature === 'mindmap' && (
                          <div className="text-center">
                            <Brain className="h-16 w-16 text-notemon-primary mx-auto mb-4" />
                            <p className="text-notemon-text-secondary">Mindmap visualization would appear here</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-center">
                        <div>
                          <Sparkles className="h-16 w-16 text-notemon-primary mx-auto mb-4" />
                          <p className="text-notemon-text-secondary">
                            Select a document and use the AI tools to get started
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Chat Input */}
                <form onSubmit={handleChatSubmit} className="flex space-x-2">
                  <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Ask a question about your document..."
                    className="bg-notemon-background/50 border-notemon-surface text-notemon-text-main placeholder:text-notemon-text-secondary"
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading || !chatMessage.trim()}
                    className="bg-gradient-primary hover:bg-notemon-primary-hover text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - AI Tools */}
          <div className="col-span-3">
            <Card className="bg-notemon-surface/50 border-notemon-surface h-full">
              <CardHeader>
                <CardTitle className="text-notemon-text-main">AI Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleSummarize}
                  disabled={isLoading}
                  className="w-full justify-start bg-notemon-background/50 hover:bg-notemon-primary/20 text-notemon-text-main border border-notemon-surface"
                  variant="outline"
                >
                  <FileText className="h-5 w-5 mr-3" />
                  Generate Summary
                </Button>

                <Button
                  onClick={handleGenerateMindmap}
                  disabled={isLoading}
                  className="w-full justify-start bg-notemon-background/50 hover:bg-notemon-primary/20 text-notemon-text-main border border-notemon-surface"
                  variant="outline"
                >
                  <Brain className="h-5 w-5 mr-3" />
                  Create Mindmap
                </Button>

                <Button
                  onClick={handleGenerateFAQs}
                  disabled={isLoading}
                  className="w-full justify-start bg-notemon-background/50 hover:bg-notemon-primary/20 text-notemon-text-main border border-notemon-surface"
                  variant="outline"
                >
                  <List className="h-5 w-5 mr-3" />
                  Generate FAQs
                </Button>

                <Separator className="bg-notemon-surface" />

                <div className="text-center">
                  <p className="text-sm text-notemon-text-secondary mb-2">
                    Document loaded:
                  </p>
                  <p className="text-xs text-notemon-text-main">
                    {documentContent ? `${documentContent.substring(0, 50)}...` : 'No document selected'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;