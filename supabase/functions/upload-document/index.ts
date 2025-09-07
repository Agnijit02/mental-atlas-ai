import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify the JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid token');
    }

    const { fileName, fileContent, mimeType } = await req.json();
    
    if (!fileName || !fileContent) {
      throw new Error('Missing fileName or fileContent');
    }

    // Convert base64 to file content for text extraction
    let extractedText = '';
    
    try {
      // For simple text files, we can extract directly
      if (mimeType?.includes('text/')) {
        const decoder = new TextDecoder();
        const uint8Array = Uint8Array.from(atob(fileContent), c => c.charCodeAt(0));
        extractedText = decoder.decode(uint8Array);
      } else {
        // For other file types, use Gemini's document processing
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [
                {
                  text: "Extract all text content from this document. Return only the extracted text without any additional commentary or formatting."
                },
                {
                  inlineData: {
                    mimeType: mimeType || 'application/octet-stream',
                    data: fileContent
                  }
                }
              ]
            }],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 8192,
            }
          })
        });

        if (response.ok) {
          const result = await response.json();
          extractedText = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
      }
    } catch (error) {
      console.error('Error extracting text:', error);
      // Fallback: just use filename as content indicator
      extractedText = `Document: ${fileName}`;
    }

    // Create file path for storage
    const fileExtension = fileName.split('.').pop() || '';
    const filePath = `${user.id}/${Date.now()}_${fileName}`;
    
    // Upload file to Supabase Storage
    const fileBuffer = Uint8Array.from(atob(fileContent), c => c.charCodeAt(0));
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, fileBuffer, {
        contentType: mimeType || 'application/octet-stream',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Save document metadata to database
    const { data: document, error: dbError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        name: fileName,
        file_path: filePath,
        file_size: fileBuffer.length,
        mime_type: mimeType,
        content: extractedText
      })
      .select()
      .single();

    if (dbError) {
      // Clean up uploaded file if database insert fails
      await supabase.storage.from('documents').remove([filePath]);
      throw new Error(`Database error: ${dbError.message}`);
    }

    return new Response(JSON.stringify({
      success: true,
      document: {
        id: document.id,
        name: document.name,
        size: document.file_size,
        uploadDate: document.created_at
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in upload-document function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});