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

    const { action, documentId, prompt } = await req.json();

    // Get the document from the database
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single();

    if (docError || !document) {
      throw new Error('Document not found or access denied');
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (action) {
      case 'summary':
        systemPrompt = 'You are an AI assistant that creates concise, well-structured summaries of documents. Focus on key points and main ideas.';
        userPrompt = `Please provide a comprehensive summary of the following document:\n\n${document.content}`;
        break;
      
      case 'faq':
        systemPrompt = 'You are an AI assistant that generates frequently asked questions based on document content. Create questions that would help someone understand the material better.';
        userPrompt = `Generate 5-7 frequently asked questions with detailed answers based on this document:\n\n${document.content}`;
        break;
      
      case 'chat':
        systemPrompt = 'You are an AI assistant that answers questions about documents. Provide accurate, helpful responses based on the document content.';
        userPrompt = `Document content:\n${document.content}\n\nUser question: ${prompt}`;
        break;
      
      default:
        throw new Error('Invalid action');
    }

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\n${userPrompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini API error:', error);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const result = await response.json();
    const generatedContent = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedContent) {
      throw new Error('No content generated');
    }

    // Save to AI sessions table
    const { error: sessionError } = await supabase
      .from('ai_sessions')
      .insert({
        user_id: user.id,
        document_id: documentId,
        session_type: action,
        prompt: action === 'chat' ? prompt : null,
        response: generatedContent
      });

    if (sessionError) {
      console.error('Error saving AI session:', sessionError);
    }

    // Format response based on action type
    let formattedResponse;
    if (action === 'faq') {
      // Try to parse FAQs from the response
      const faqLines = generatedContent.split('\n').filter(line => line.trim());
      const faqs = [];
      let currentQuestion = '';
      let currentAnswer = '';
      
      for (const line of faqLines) {
        if (line.match(/^\d+\.|^Q:|^\?/)) {
          if (currentQuestion && currentAnswer) {
            faqs.push({ question: currentQuestion.trim(), answer: currentAnswer.trim() });
          }
          currentQuestion = line.replace(/^\d+\./, '').replace(/^Q:/, '').trim();
          currentAnswer = '';
        } else if (line.match(/^A:|^Answer:/)) {
          currentAnswer = line.replace(/^A:/, '').replace(/^Answer:/, '').trim();
        } else if (currentQuestion) {
          if (currentAnswer) {
            currentAnswer += ' ' + line.trim();
          } else {
            currentAnswer = line.trim();
          }
        }
      }
      
      if (currentQuestion && currentAnswer) {
        faqs.push({ question: currentQuestion.trim(), answer: currentAnswer.trim() });
      }
      
      formattedResponse = { faqs: faqs.length > 0 ? faqs : [{ question: "Generated Content", answer: generatedContent }] };
    } else if (action === 'summary') {
      // Extract key points if available
      const lines = generatedContent.split('\n').filter(line => line.trim());
      const keyPoints = lines.filter(line => line.match(/^[•\-\*]/) || line.match(/^\d+\./))
        .map(line => line.replace(/^[•\-\*\d\.]\s*/, '').trim())
        .slice(0, 5);
      
      formattedResponse = {
        summary: generatedContent,
        keyPoints: keyPoints.length > 0 ? keyPoints : null
      };
    } else {
      formattedResponse = { chat: generatedContent };
    }

    return new Response(JSON.stringify(formattedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in process-document function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});