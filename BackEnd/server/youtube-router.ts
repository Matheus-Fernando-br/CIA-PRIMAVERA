/**
 * Router tRPC para gerenciar sincronização do YouTube
 * Apenas administradores podem sincronizar vídeos
 */

import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { syncYouTubeVideos } from "./youtube";
import { TRPCError } from "@trpc/server";

export const youtubeRouter = router({
  /**
   * Sincroniza vídeos do YouTube manualmente
   * Apenas para administradores
   */
  sync: protectedProcedure
    .input(
      z.object({
        channelId: z.string().describe("ID do canal do YouTube"),
        maxResults: z.number().optional().default(10),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      try {
        const result = await syncYouTubeVideos(input.channelId, input.maxResults);
        return {
          success: true,
          created: result.created,
          updated: result.updated,
          message: `${result.created} vídeos criados, ${result.updated} atualizados`,
        };
      } catch (error) {
        console.error("[YouTube Router] Erro na sincronização:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao sincronizar vídeos do YouTube",
        });
      }
    }),

  /**
   * Verifica o status da sincronização
   */
  status: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return {
      configured: !!process.env.YOUTUBE_API_KEY,
      message: process.env.YOUTUBE_API_KEY
        ? "YouTube API configurada"
        : "YouTube API não configurada",
    };
  }),
});
