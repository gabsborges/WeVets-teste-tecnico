import { jest } from "@jest/globals";

/**
 * Mock do módulo de CEP antes de importar o SUT
 */
jest.unstable_mockModule("../infra/repositories/cepApi.js", () => ({
  fetchCepData: jest.fn()
}));

// Importa depois do mock (obrigatório em ESM)
const { enrichPosts } = await import("../domain/post/postEnricher.js");
const cepApi = await import("../infra/repositories/cepApi.js");

describe("enrichPosts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should enrich posts with author and cep data", async () => {
    cepApi.fetchCepData.mockResolvedValue({
      city: "São Paulo",
      state: "SP"
    });

    const posts = [
      { id: 1, userId: 1, title: "Post title" }
    ];

    const users = [
      { id: 1, name: "Gabriel", email: "gabriel@email.com" }
    ];

    const result = await enrichPosts(posts, users);

    expect(result).toHaveLength(1);

    expect(result[0]).toMatchObject({
      postId: 1,
      title: "Post title",
      authorName: "Gabriel",
      authorEmail: "gabriel@email.com",
      cep: expect.any(String),
      city: "São Paulo",
      state: "SP"
    });

    expect(cepApi.fetchCepData).toHaveBeenCalledTimes(1);
  });

  it("should fallback when cep request fails", async () => {
    cepApi.fetchCepData.mockRejectedValue(new Error("CEP error"));

    const posts = [
      { id: 1, userId: 1, title: "Post title" }
    ];

    const users = [
      { id: 1, name: "Gabriel", email: "gabriel@email.com" }
    ];

    const result = await enrichPosts(posts, users);

    expect(result[0].city).toBeNull();
    expect(result[0].state).toBeNull();
  });

  it("should ignore posts without author", async () => {
    cepApi.fetchCepData.mockResolvedValue({
      city: "São Paulo",
      state: "SP"
    });

    const posts = [{ id: 1, userId: 999, title: "Post title" }];
    const users = [];

    const result = await enrichPosts(posts, users);

    expect(result).toHaveLength(0);
  });
});