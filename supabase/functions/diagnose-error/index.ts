import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { GoogleGenAI, Type } from 'npm:@google/genai';
import { checkSafelist } from '../shared/safelistData.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { app: appName = 'Software App', os = 'windows', error_text = '' } = await req.json();

    if (!error_text || typeof error_text !== 'string') {
      return new Response(JSON.stringify({ error: 'Error text is required for diagnosis' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 1. Check deterministic cost-reduction safelist first (§9.3)
    const safelistResult = checkSafelist(error_text, os as 'windows' | 'mac');
    if (safelistResult) {
      return new Response(JSON.stringify({ ...safelistResult, source: 'safelist' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Fall back to Gemini AI if API key is present
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          explanation: `The installer for ${appName} failed on ${os}. The error output indicates a permission, network, or package ID mismatch.`,
          fix_command: os === 'windows'
            ? `winget source update && winget install --id ${appName}`
            : `brew update && brew cleanup`,
          confidence: 'medium',
          source: 'fallback',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: { 'User-Agent': 'aistudio-build' },
      },
    });

    const systemPrompt = `You are diagnosing a software installation error on a student's laptop.
Given the app name, OS, and raw error text, respond in JSON matching the schema:
{ "explanation": "string", "fix_command": "string or null", "confidence": "high|medium|low" }

Rules:
- "explanation": Provide a clear, plain-English explanation of why the installation failed, suited for a student (no dense jargon).
- "fix_command": Only provide a fix command if you are highly confident it's 100% safe and correct for ${os}. If unsure, return null.
- Safety Rule: NEVER suggest destructive commands (disk formatting, force-deleting system directories like C:\\Windows, sudo rm -rf /, permanently disabling security features).`;

    const promptText = `App: ${appName}\nTarget OS: ${os}\nRaw Error Log:\n${error_text.slice(0, 3000)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            explanation: { type: Type.STRING },
            fix_command: { type: Type.STRING },
            confidence: { type: Type.STRING },
          },
          required: ['explanation', 'confidence'],
        },
      },
    });

    const responseText = response.text ? response.text.trim() : '{}';
    let parsedJson: any = {};
    try {
      parsedJson = JSON.parse(responseText);
    } catch (err) {
      parsedJson = {
        explanation: responseText || 'Installation failed due to a system error.',
        fix_command: null,
        confidence: 'low',
      };
    }

    return new Response(
      JSON.stringify({
        explanation: parsedJson.explanation || 'Analyzed installation log.',
        fix_command: parsedJson.fix_command || null,
        confidence: parsedJson.confidence || 'medium',
        source: 'ai',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in diagnose-error function:', error);
    return new Response(
      JSON.stringify({
        explanation: 'An error occurred while analyzing the setup log with AI.',
        fix_command: null,
        confidence: 'low',
        errorDetails: error?.message || 'Server error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
