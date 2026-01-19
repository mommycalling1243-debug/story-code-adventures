import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, mood } = await req.json();
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");

    if (!ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY is not configured");
    }

    if (!text) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use a friendly, wise voice for the owl mascot
    // Matilda - XrExE9yKIg1WjnnlVkGX (warm and friendly)
    const voiceId = "XrExE9yKIg1WjnnlVkGX";

    // Adjust voice settings based on mood
    let stability = 0.5;
    let similarityBoost = 0.75;
    let style = 0.4;
    let speed = 1.0;

    switch (mood) {
      case "excited":
        stability = 0.3;
        style = 0.7;
        speed = 1.1;
        break;
      case "celebrating":
        stability = 0.2;
        style = 0.8;
        speed = 1.15;
        break;
      case "thinking":
        stability = 0.7;
        style = 0.2;
        speed = 0.9;
        break;
      case "encouraging":
        stability = 0.5;
        style = 0.5;
        speed = 1.0;
        break;
      case "error":
        stability = 0.6;
        style = 0.3;
        speed = 0.95;
        break;
      case "confused":
        stability = 0.4;
        style = 0.4;
        speed = 0.9;
        break;
      case "proud":
        stability = 0.6;
        style = 0.6;
        speed = 1.05;
        break;
      case "sleeping":
        stability = 0.8;
        style = 0.1;
        speed = 0.8;
        break;
      default:
        break;
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability,
            similarity_boost: similarityBoost,
            style,
            use_speaker_boost: true,
            speed,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", response.status, errorText);
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
