import { jest } from "@jest/globals";
import { fetchPosts } from "../infra/repositories/postApi.js";
import { httpClient } from "../infra/http/httpClient.js";

jest.spyOn(httpClient, "get").mockResolvedValue({
  data: Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }))
});

describe("fetchPosts", () => {
  it("should return top 20 posts by id", async () => {
    const result = await fetchPosts();

    expect(result).toHaveLength(20);
    expect(result[0].id).toBe(50);
    expect(result[19].id).toBe(31);
  });
});