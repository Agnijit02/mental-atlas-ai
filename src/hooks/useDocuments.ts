import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  name: string;
  file_size: number;
  created_at: string;
  content: string;
}

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, session } = useAuth();
  const { toast } = useToast();

  const fetchDocuments = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to load documents',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const uploadDocument = async (file: File) => {
    if (!session) throw new Error('Not authenticated');

    // Convert file to base64
    const fileContent = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]); // Remove data:mime;base64, prefix
      };
      reader.readAsDataURL(file);
    });

    const { data, error } = await supabase.functions.invoke('upload-document', {
      body: {
        fileName: file.name,
        fileContent,
        mimeType: file.type
      }
    });

    if (error) throw error;
    
    // Refresh documents list
    await fetchDocuments();
    
    return data;
  };

  const processDocument = async (documentId: string, action: 'summary' | 'faq' | 'chat', prompt?: string) => {
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke('process-document', {
      body: {
        action,
        documentId,
        prompt
      }
    });

    if (error) throw error;
    return data;
  };

  return {
    documents,
    loading,
    uploadDocument,
    processDocument,
    refetch: fetchDocuments
  };
}