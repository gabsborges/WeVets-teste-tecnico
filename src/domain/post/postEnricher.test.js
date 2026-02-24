import { jest } from "@jest/globals";


const cepApi = await jest.unstable_mockModule(
  "../../infra/repositories/cepApi.js",
  () => ({
    fetchCepData: async () => ({ city: "Test City", state: "TS" })
  })
);

const { enrichPosts } = await import("./postEnricher.js");

describe("Post Enricher", () => {
  it("should enrich posts correctly", async () => {
    const posts = [{ id: 1, userId: 1, title: "Test Post" }];
    const users = [{ id: 1, name: "John", email: "john@test.com" }];

    const result = await enrichPosts(posts, users);

    expect(result[0]).toEqual({
      postId: 1,
      title: "Test Post",
      authorName: "John",
      authorEmail: "john@test.com",
      cep: "01001000",
      city: "Test City",
      state: "TS"
    });
  });
});