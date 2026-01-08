import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { youtubeRouter } from "./youtube-router";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Seções (conteúdo dinâmico do site)
  sections: router({
    list: publicProcedure.query(() => db.getActiveSections()),
    getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => db.getSectionBySlug(input.slug)),
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        content: z.string().optional(),
        imageUrl: z.string().optional(),
        imageKey: z.string().optional(),
        sectionType: z.enum(["sermon", "retreat", "service", "general"]),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.createSection(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        content: z.string().optional(),
        imageUrl: z.string().optional(),
        imageKey: z.string().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const { id, ...data } = input;
        return db.updateSection(id, data);
      }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ input, ctx }) => {
      if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return db.deleteSection(input.id);
    }),
  }),

  // Produtos (camisetas e outros itens)
  products: router({
    list: publicProcedure.query(() => db.getActiveProducts()),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => db.getProductById(input.id)),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.number(),
        imageUrl: z.string().optional(),
        imageKey: z.string().optional(),
        stock: z.number().optional(),
        sku: z.string().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.createProduct(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        imageUrl: z.string().optional(),
        imageKey: z.string().optional(),
        stock: z.number().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const { id, ...data } = input;
        return db.updateProduct(id, data);
      }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ input, ctx }) => {
      if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return db.deleteProduct(input.id);
    }),
  }),

  // Eventos (retiros, cultos, reuniões)
  events: router({
    list: publicProcedure.query(() => db.getActiveEvents()),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => db.getEventById(input.id)),
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        eventType: z.enum(["retreat", "service", "meeting", "special"]),
        startDate: z.date(),
        endDate: z.date().optional(),
        location: z.string().optional(),
        imageUrl: z.string().optional(),
        imageKey: z.string().optional(),
        capacity: z.number().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.createEvent(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        location: z.string().optional(),
        imageUrl: z.string().optional(),
        imageKey: z.string().optional(),
        capacity: z.number().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const { id, ...data } = input;
        return db.updateEvent(id, data);
      }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ input, ctx }) => {
      if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return db.deleteEvent(input.id);
    }),
  }),

  // YouTube
  youtube: youtubeRouter,

  // Pregações (vídeos do YouTube)
  sermons: router({
    list: publicProcedure.query(() => db.getActiveSermons()),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => db.getSermonById(input.id)),
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        youtubeVideoId: z.string(),
        youtubeUrl: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        speaker: z.string().optional(),
        publishedAt: z.date().optional(),
        duration: z.number().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.createSermon(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        speaker: z.string().optional(),
        publishedAt: z.date().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const { id, ...data } = input;
        return db.updateSermon(id, data);
      }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ input, ctx }) => {
      if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return db.deleteSermon(input.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
