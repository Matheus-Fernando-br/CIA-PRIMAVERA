/**
 * Serviço de integração com YouTube API
 * Sincroniza pregações e vídeos da conta do YouTube
 */

import { createSermon, getSermonByYoutubeId, updateSermon } from "./db";
import { InsertSermon } from "../drizzle/schema";

interface YouTubeVideo {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      high?: { url: string };
      medium?: { url: string };
      default?: { url: string };
    };
    channelTitle: string;
  };
  contentDetails?: {
    duration: string;
  };
}

interface YouTubeSearchResponse {
  items: YouTubeVideo[];
}

/**
 * Converte duração ISO 8601 para segundos
 * Ex: PT1H30M45S -> 5445
 */
function isoDurationToSeconds(duration: string): number {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = duration.match(regex);

  if (!matches) return 0;

  const hours = parseInt(matches[1] || "0", 10);
  const minutes = parseInt(matches[2] || "0", 10);
  const seconds = parseInt(matches[3] || "0", 10);

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Busca vídeos do YouTube usando a API
 * Requer YOUTUBE_API_KEY nas variáveis de ambiente
 */
export async function searchYouTubeVideos(
  channelId: string,
  maxResults: number = 10
): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.warn("[YouTube] YOUTUBE_API_KEY não configurada");
    return [];
  }

  try {
    const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    searchUrl.searchParams.append("key", apiKey);
    searchUrl.searchParams.append("channelId", channelId);
    searchUrl.searchParams.append("part", "snippet");
    searchUrl.searchParams.append("order", "date");
    searchUrl.searchParams.append("maxResults", maxResults.toString());
    searchUrl.searchParams.append("type", "video");

    const response = await fetch(searchUrl.toString());

    if (!response.ok) {
      console.error("[YouTube] Erro na busca:", response.statusText);
      return [];
    }

    const data = (await response.json()) as YouTubeSearchResponse;
    return data.items || [];
  } catch (error) {
    console.error("[YouTube] Erro ao buscar vídeos:", error);
    return [];
  }
}

/**
 * Obtém detalhes de um vídeo do YouTube (incluindo duração)
 */
export async function getYouTubeVideoDetails(videoId: string): Promise<YouTubeVideo | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.warn("[YouTube] YOUTUBE_API_KEY não configurada");
    return null;
  }

  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.append("key", apiKey);
    url.searchParams.append("id", videoId);
    url.searchParams.append("part", "snippet,contentDetails");

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error("[YouTube] Erro ao buscar detalhes:", response.statusText);
      return null;
    }

    const data = await response.json() as { items: YouTubeVideo[] };
    return data.items?.[0] || null;
  } catch (error) {
    console.error("[YouTube] Erro ao buscar detalhes do vídeo:", error);
    return null;
  }
}

/**
 * Sincroniza vídeos do YouTube com o banco de dados
 * Cria novos registros e atualiza os existentes
 */
export async function syncYouTubeVideos(
  channelId: string,
  maxResults: number = 10
): Promise<{ created: number; updated: number }> {
  let created = 0;
  let updated = 0;

  try {
    // Busca vídeos recentes do canal
    const videos = await searchYouTubeVideos(channelId, maxResults);

    for (const video of videos) {
      const videoId = video.id.videoId;
      const snippet = video.snippet;

      // Obtém detalhes completos do vídeo (incluindo duração)
      const fullDetails = await getYouTubeVideoDetails(videoId);
      const duration = fullDetails?.contentDetails?.duration
        ? isoDurationToSeconds(fullDetails.contentDetails.duration)
        : undefined;

      // Verifica se o vídeo já existe
      const existing = await getSermonByYoutubeId(videoId);

      const sermonData: InsertSermon = {
        title: snippet.title,
        description: snippet.description,
        youtubeVideoId: videoId,
        youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnailUrl: snippet.thumbnails.high?.url || snippet.thumbnails.medium?.url,
        speaker: snippet.channelTitle,
        publishedAt: new Date(snippet.publishedAt),
        duration,
        syncedAt: new Date(),
        isActive: 1,
      };

      if (existing) {
        // Atualiza vídeo existente
        await updateSermon(existing.id, sermonData);
        updated++;
      } else {
        // Cria novo vídeo
        await createSermon(sermonData);
        created++;
      }

      // Aguarda um pouco para não sobrecarregar a API
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log(`[YouTube] Sincronização concluída: ${created} criados, ${updated} atualizados`);
    return { created, updated };
  } catch (error) {
    console.error("[YouTube] Erro durante sincronização:", error);
    return { created: 0, updated: 0 };
  }
}

/**
 * Agenda sincronização periódica de vídeos
 * Deve ser chamado no startup da aplicação
 */
export function startYouTubeSyncScheduler(channelId: string, intervalMinutes: number = 60): void {
  // Sincroniza imediatamente ao iniciar
  syncYouTubeVideos(channelId).catch((error) => {
    console.error("[YouTube] Erro na sincronização inicial:", error);
  });

  // Agenda sincronização periódica
  const intervalMs = intervalMinutes * 60 * 1000;
  setInterval(
    () => {
      syncYouTubeVideos(channelId).catch((error) => {
        console.error("[YouTube] Erro na sincronização agendada:", error);
      });
    },
    intervalMs
  );

  console.log(`[YouTube] Sincronização agendada a cada ${intervalMinutes} minutos`);
}
