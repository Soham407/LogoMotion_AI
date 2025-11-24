export type ImageSize = '1K' | '2K' | '4K';
export type VideoAspectRatio = '16:9' | '9:16';

export interface LogoGenerationResult {
  base64: string;
  mimeType: string;
}

export interface VideoGenerationResult {
  videoUrl: string;
}
