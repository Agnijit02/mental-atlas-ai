import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useDocuments } from '@/hooks/useDocuments';
import FileUploadCard from '@/components/FileUploadCard';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Plus,
  FileText,
  MessageCircle,
  Send,
  Loader2,
  Home,
  BookOpen,
  Sparkles,
  Languages,
  Target,
  CheckSquare,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: number;
}

const Dashboard = () => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [documentContent, setDocumentContent] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'bengali' | 'hindi'>('english');
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { documents, loading: documentsLoading, processDocument, refetch } = useDocuments();

  const handleUploadSuccess = async (file: { name: string; id: string }) => {
    toast({
      title: "Upload Successful!",
      description: `${file.name} has been processed.`,
    });
    setIsUploadModalOpen(false);

    // Refresh the documents list to show the new document
    await refetch();
  };
  
  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Local storage key for chat history
  const getChatHistoryKey = (documentId: string) => `chat_history_${user?.id}_${documentId}`;

  // Load chat history from local storage
  const loadChatHistory = (documentId: string) => {
    try {
      const key = getChatHistoryKey(documentId);
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsedHistory = JSON.parse(stored);
        setChatHistory(parsedHistory);
      } else {
        setChatHistory([]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      setChatHistory([]);
    }
  };

  // Save chat history to local storage
  const saveChatHistory = (documentId: string, history: ChatMessage[]) => {
    try {
      const key = getChatHistoryKey(documentId);
      localStorage.setItem(key, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  // Load chat history when document changes
  useEffect(() => {
    if (selectedDocument && user) {
      loadChatHistory(selectedDocument);
    }
  }, [selectedDocument, user]);

  // Auto-scroll to bottom when chat history changes
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  };

  useEffect(() => {
    // Small delay to ensure DOM has updated
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 50);
    return () => clearTimeout(timeoutId);
  }, [chatHistory]);

  // Also scroll when loading state changes (for new messages)
  useEffect(() => {
    if (!isLoading) {
      const timeoutId = setTimeout(() => {
        scrollToBottom();
      }, 150);
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading]);

  // Language mapping for prompts
  const getLanguagePrompt = (language: string) => {
    switch (language) {
      case 'bengali':
        return 'Please respond in Bengali language.';
      case 'hindi':
        return 'Please respond in Hindi language.';
      default:
        return 'Please respond in English language.';
    }
  };


  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!chatMessage.trim()) return;
    if (!selectedDocument) {
      toast({
        title: 'No document selected',
        description: 'Please select a document first.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Add language instruction to the prompt
      const languageInstruction = getLanguagePrompt(selectedLanguage);
      const enhancedPrompt = `${chatMessage}\n\n${languageInstruction}`;

      const result = await processDocument(selectedDocument, 'chat', enhancedPrompt, selectedLanguage);

      // Create new chat message object
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        message: chatMessage,
        response: result.chat, // Fix: access the chat property from the response object
        timestamp: Date.now()
      };

      // Add to chat history
      const updatedHistory = [...chatHistory, newMessage];
      setChatHistory(updatedHistory);

      // Save to local storage
      if (selectedDocument) {
        saveChatHistory(selectedDocument, updatedHistory);
      }

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
            <div className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-notemon-text-main to-notemon-primary bg-clip-text text-transparent">
                NoteMon
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Languages className="h-4 w-4 text-notemon-primary" />
                <Select value={selectedLanguage} onValueChange={(value: 'english' | 'bengali' | 'hindi') => setSelectedLanguage(value)}>
                  <SelectTrigger className="w-[120px] bg-notemon-surface/20 border-notemon-surface text-notemon-text-secondary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-notemon-surface border-notemon-border">
                    <SelectItem value="english" className="text-notemon-text-main">English</SelectItem>
                    <SelectItem value="bengali" className="text-notemon-text-main">বাংলা</SelectItem>
                    <SelectItem value="hindi" className="text-notemon-text-main">हिंदी</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="border-notemon-surface text-notemon-text-secondary hover:text-notemon-text-main hover:bg-notemon-surface/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
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
                    {documentsLoading ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-notemon-primary mx-auto mb-4" />
                        <p className="text-notemon-text-secondary">Loading documents...</p>
                      </div>
                    ) : documents.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-notemon-text-secondary mx-auto mb-4" />
                        <p className="text-notemon-text-secondary mb-2">No documents yet</p>
                        <p className="text-sm text-notemon-text-secondary">
                          Upload your first document to get started
                        </p>
                      </div>
                    ) : (
                      documents.map((document) => (
                        <div
                          key={document.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedDocument === document.id
                              ? 'bg-notemon-primary/20 border border-notemon-primary'
                              : 'bg-notemon-background/50 hover:bg-notemon-background/70'
                          }`}
                          onClick={() => {
                            setSelectedDocument(document.id);
                            setDocumentContent(document.content);
                          }}
                        >
                          <div className="flex items-start space-x-3">
                            <FileText className="h-5 w-5 text-notemon-primary mt-1" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-notemon-text-main truncate">
                                {document.name}
                              </p>
                              <p className="text-xs text-notemon-text-secondary">
                                {formatFileSize(document.file_size)} • {new Date(document.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Chat */}
          <div className="col-span-6">
            <Card className="bg-notemon-surface/30 border-notemon-surface h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-notemon-text-main flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  AI Chat Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ScrollArea ref={chatScrollRef} className="h-[calc(100vh-300px)] min-h-[400px] max-h-[600px] mb-4 overflow-y-auto">
                  <div className="p-4 bg-notemon-background/30 rounded-lg">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Loader2 className="h-8 w-8 animate-spin text-notemon-primary mx-auto mb-4" />
                          <p className="text-notemon-text-secondary">
                            Processing your question...
                          </p>
                        </div>
                        {/* Invisible element to scroll to */}
                        <div ref={messagesEndRef} />
                      </div>
                    ) : chatHistory.length > 0 ? (
                      <div className="space-y-6">
                        {chatHistory.map((chat, index) => (
                          <div key={chat.id} className="space-y-4">
                            {/* User Message Bubble */}
                            <div className="flex justify-end">
                              <div className="max-w-[80%] chat-bubble-user p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                  <div className="w-2 h-2 bg-white/70 rounded-full"></div>
                                  <span className="text-xs font-medium opacity-80">You</span>
                                </div>
                                <div className="chat-markdown">
                                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {chat.message}
                                  </ReactMarkdown>
                                </div>
                                <div className="text-xs opacity-60 mt-2 text-right">
                                  {new Date(chat.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                          </div>

                            {/* AI Response Bubble */}
                            <div className="flex justify-start">
                              <div className="max-w-[80%] chat-bubble-ai p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                  <div className="w-2 h-2 bg-notemon-primary rounded-full"></div>
                                  <span className="text-xs font-medium text-notemon-text-main">AI Assistant</span>
                              </div>
                                <div className="chat-markdown">
                                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {chat.response}
                                  </ReactMarkdown>
                          </div>
                                <div className="text-xs text-notemon-text-secondary mt-2">
                                  {new Date(chat.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                            </div>
                            </div>
                          </div>
                          </div>
                        ))}
                        {/* Invisible element to scroll to */}
                        <div ref={messagesEndRef} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-center">
                        <div>
                          <Sparkles className="h-16 w-16 text-notemon-primary mx-auto mb-4" />
                          <p className="text-notemon-text-secondary mb-4">
                            Select a document and start chatting with AI
                          </p>
                          <div className="text-sm text-notemon-text-secondary space-y-2">
                            <p>You can ask for:</p>
                            <ul className="list-disc list-inside space-y-1">
                              <li>Summaries of your document</li>
                              <li>Frequently asked questions</li>
                              <li>Key points and insights</li>
                              <li>Any specific questions about the content</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Invisible element to scroll to */}
                    <div ref={messagesEndRef} />
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

          {/* Right Column - Chat Suggestions */}
          <div className="col-span-3">
            <Card className="bg-notemon-surface/50 border-notemon-surface h-full">
              <CardHeader>
                <CardTitle className="text-notemon-text-main">Chat Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedDocument ? (
                  <>
                    <div className="space-y-3">
                <Button
                        onClick={() => setChatMessage("Summarize this document")}
                  disabled={isLoading}
                        className="w-full justify-start bg-notemon-background/50 hover:bg-notemon-primary/20 text-notemon-text-main border border-notemon-surface text-sm py-2"
                  variant="outline"
                >
                        <FileText className="h-4 w-4 mr-2" />
                        Summarize Document
                </Button>

                <Button
                        onClick={() => setChatMessage("Generate frequently asked questions from this document")}
                  disabled={isLoading}
                        className="w-full justify-start bg-notemon-background/50 hover:bg-notemon-primary/20 text-notemon-text-main border border-notemon-surface text-sm py-2"
                  variant="outline"
                >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Generate FAQs
                </Button>

                <Button
                        onClick={() => setChatMessage("Extract the main key points from this document")}
                  disabled={isLoading}
                        className="w-full justify-start bg-notemon-background/50 hover:bg-notemon-primary/20 text-notemon-text-main border border-notemon-surface text-sm py-2"
                  variant="outline"
                >
                        <Target className="h-4 w-4 mr-2" />
                        Key Points
                </Button>

                      <Button
                        onClick={() => setChatMessage("What are the action items or recommendations in this document?")}
                        disabled={isLoading}
                        className="w-full justify-start bg-notemon-background/50 hover:bg-notemon-primary/20 text-notemon-text-main border border-notemon-surface text-sm py-2"
                        variant="outline"
                      >
                        <CheckSquare className="h-4 w-4 mr-2" />
                        Action Items
                      </Button>
                    </div>

                <Separator className="bg-notemon-surface" />

                <div className="text-center">
                  <p className="text-sm text-notemon-text-secondary mb-2">
                        Current Document:
                  </p>
                      <p className="text-sm text-notemon-text-main font-medium mb-1">
                        {documents.find(doc => doc.id === selectedDocument)?.name}
                      </p>
                      <p className="text-xs text-notemon-text-secondary">
                        {documentContent ? `${documentContent.substring(0, 50)}...` : 'No content available'}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Sparkles className="h-12 w-12 text-notemon-text-secondary mx-auto mb-4" />
                    <p className="text-notemon-text-secondary mb-2">Select a Document</p>
                    <p className="text-sm text-notemon-text-secondary">
                      Choose a document from the left panel to start chatting
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;