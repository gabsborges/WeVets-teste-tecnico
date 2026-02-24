import { jest } from "@jest/globals";

jest.unstable_mockModule("../infra/repositories/cepApi.js", () => ({
  fetchCepData: jest.fn()
}));

const { enrichPosts } = await import("../domain/post/postEnricher.js");
const cepApi = await import("../infra/repositories/cepApi.js");
const logger = (await import("../utils/logger.js")).logger;

describe("enrichPosts - pleno", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should enrich posts with author and cep data", async () => {
    cepApi.fetchCepData.mockResolvedValue({
      city: "São Paulo",
      state: "SP"
    });

    jest.spyOn(logger, "warn").mockImplementation(() => {});

    const posts = [{ id: 1, userId: 1, title: "Post title" }];
    const users = [{ id: 1, name: "Gabriel", email: "gabriel@email.com" }];

    const result = await enrichPosts(posts, users);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      postId: 1,
      title: "Post title",
      authorName: "Gabriel",
      authorEmail: "gabriel@email.com",
      city: "São Paulo",
      state: "SP"
    });

    expect(cepApi.fetchCepData).toHaveBeenCalledTimes(1);
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it("should fallback and log warning when CEP request fails", async () => {
    cepApi.fetchCepData.mockRejectedValue(new Error("CEP error"));
    jest.spyOn(logger, "warn").mockImplementation(() => {});

    const posts = [{ id: 1, userId: 1, title: "Post title" }];
    const users = [{ id: 1, name: "Gabriel", email: "gabriel@email.com" }];

    const result = await enrichPosts(posts, users);

    expect(result[0].city).toBeNull();
    expect(result[0].state).toBeNull();
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining("Failed to fetch CEP")
    );
  });

  it("should ignore posts without author", async () => {
    cepApi.fetchCepData.mockResolvedValue({ city: "São Paulo", state: "SP" });

    const posts = [{ id: 1, userId: 999, title: "Post title" }];
    const users = [];

    const result = await enrichPosts(posts, users);
    expect(result).toHaveLength(0);
  });

  it("should ignore posts with missing fields", async () => {
    cepApi.fetchCepData.mockResolvedValue({ city: "São Paulo", state: "SP" });

    const posts = [{ id: null, userId: null, title: "Missing fields" }];
    const users = [{ id: 1, name: "Gabriel", email: "gabriel@email.com" }];

    const result = await enrichPosts(posts, users);
    expect(result).toHaveLength(0);
  });

it("should use cached CEP data without calling API again", async () => {
  const address = { city: "São Paulo", state: "SP" };
  cepApi.fetchCepData.mockImplementation(async (cep) => address);

  const posts = [
    { id: 1, userId: 1, title: "Post 1" },
    { id: 2, userId: 1, title: "Post 2" }
  ];
  const users = [{ id: 1, name: "Gabriel", email: "gabriel@email.com" }];

  const result = await enrichPosts(posts, users);

  expect(result).toHaveLength(2);
  expect(result[0]).toEqual({ ...result[0] }); 
  expect(result[1]).toEqual({ ...result[1] });
});
});