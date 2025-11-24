import { GoogleGenAI } from "@google/genai";
import { ImageSize, LogoGenerationResult, VideoAspectRatio } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please select a key first.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Generate a logo image using gemini-3-pro-image-preview
 */
export const generateLogo = async (
  prompt: string,
  size: ImageSize
): Promise<LogoGenerationResult> => {
  const ai = getAIClient();
  
  // Refined prompt for logo generation to ensure high quality
  const fullPrompt = `Design a professional, modern, and minimalist logo based on this description: ${prompt}. The logo should be on a clean background suitable for animation.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        { text: fullPrompt }
      ]
    },
    config: {
      imageConfig: {
        imageSize: size,
        aspectRatio: "1:1", // Logos are typically square
      }
    }
  });

  // Extract image
  let base64Image = "";
  let mimeType = "image/png";

  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        base64Image = part.inlineData.data;
        mimeType = part.inlineData.mimeType || "image/png";
        break;
      }
    }
  }

  if (!base64Image) {
    throw new Error("No image generated.");
  }

  return { base64: base64Image, mimeType };
};

/**
 * Generate a video animation from a static logo using veo-3.1-fast-generate-preview
 */
export const animateLogo = async (
  imageBase64: string,
  prompt: string,
  aspectRatio: VideoAspectRatio
): Promise<string> => {
  const ai = getAIClient();

  const animationPrompt = prompt 
    ? `Cinematic motion: ${prompt}` 
    : "Cinematic camera movement, bring this logo to life with elegant motion effects, high quality, 4k.";

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: animationPrompt,
    image: {
      imageBytes: imageBase64,
      mimeType: 'image/png', // Assuming PNG from the generation step
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p', // standard for fast preview
      aspectRatio: aspectRatio
    }
  });

  // Polling loop
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  if (operation.error) {
    throw new Error(`Video generation failed: ${operation.error.message}`);
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  
  if (!downloadLink) {
    throw new Error("No video URI returned.");
  }

  // Fetch the actual video bytes using the API key
  const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!videoResponse.ok) {
    throw new Error("Failed to download generated video.");
  }
  
  const videoBlob = await videoResponse.blob();
  return URL.createObjectURL(videoBlob);
};