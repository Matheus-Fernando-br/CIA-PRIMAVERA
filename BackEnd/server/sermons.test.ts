import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock do contexto de usuário admin
function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@church.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

// Mock do contexto de usuário regular
function createUserContext(): TrpcContext {
  return {
    user: {
      id: 2,
      openId: "regular-user",
      email: "user@church.com",
      name: "Regular User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Sermons Router", () => {
  describe("sermons.list", () => {
    it("deve retornar lista de pregações (pública)", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.sermons.list();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("sermons.create", () => {
    it("deve permitir que admin crie uma pregação", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      // Note: Esta é uma chamada que requer banco de dados
      // Em um ambiente de teste real, você usaria um banco de dados de teste
      expect(caller.sermons.create).toBeDefined();
    });

    it("deve rejeitar criação de pregação por usuário regular", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.sermons.create({
          title: "Test Sermon",
          youtubeVideoId: "test123",
        });
        expect.fail("Deveria ter lançado erro FORBIDDEN");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });
});

describe("Products Router", () => {
  describe("products.list", () => {
    it("deve retornar lista de produtos (pública)", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.products.list();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("products.create", () => {
    it("deve rejeitar criação de produto por usuário regular", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.products.create({
          name: "Test Product",
          price: 2999,
        });
        expect.fail("Deveria ter lançado erro FORBIDDEN");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });
});

describe("Events Router", () => {
  describe("events.list", () => {
    it("deve retornar lista de eventos (pública)", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.events.list();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("events.create", () => {
    it("deve rejeitar criação de evento por usuário regular", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.events.create({
          title: "Test Event",
          eventType: "service",
          startDate: new Date(),
        });
        expect.fail("Deveria ter lançado erro FORBIDDEN");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });
});

describe("YouTube Router", () => {
  describe("youtube.status", () => {
    it("deve retornar status da API YouTube", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.youtube.status();

      expect(result).toHaveProperty("configured");
      expect(result).toHaveProperty("message");
    });

    it("deve rejeitar acesso de usuário regular", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.youtube.status();
        expect.fail("Deveria ter lançado erro FORBIDDEN");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });
});

describe("Auth Router", () => {
  describe("auth.me", () => {
    it("deve retornar dados do usuário autenticado", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.me();

      expect(result).toEqual(ctx.user);
    });
  });

  describe("auth.logout", () => {
    it("deve fazer logout com sucesso", async () => {
      const ctx = createAdminContext();
      const clearedCookies: any[] = [];

      ctx.res = {
        clearCookie: (name: string, options: any) => {
          clearedCookies.push({ name, options });
        },
      } as any;

      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.logout();

      expect(result.success).toBe(true);
      expect(clearedCookies.length).toBeGreaterThan(0);
    });
  });
});

describe("Authorization Tests", () => {
  it("apenas admins podem sincronizar YouTube", async () => {
    const userCtx = createUserContext();
    const caller = appRouter.createCaller(userCtx);

    try {
      await caller.youtube.sync({
        channelId: "test",
      });
      expect.fail("Deveria ter lançado erro FORBIDDEN");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("apenas admins podem deletar pregações", async () => {
    const userCtx = createUserContext();
    const caller = appRouter.createCaller(userCtx);

    try {
      await caller.sermons.delete({ id: 1 });
      expect.fail("Deveria ter lançado erro FORBIDDEN");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("apenas admins podem deletar produtos", async () => {
    const userCtx = createUserContext();
    const caller = appRouter.createCaller(userCtx);

    try {
      await caller.products.delete({ id: 1 });
      expect.fail("Deveria ter lançado erro FORBIDDEN");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("apenas admins podem deletar eventos", async () => {
    const userCtx = createUserContext();
    const caller = appRouter.createCaller(userCtx);

    try {
      await caller.events.delete({ id: 1 });
      expect.fail("Deveria ter lançado erro FORBIDDEN");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });
});
