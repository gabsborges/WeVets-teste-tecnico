import { jest } from "@jest/globals";

jest.unstable_mockModule("../infra/repositories/postApi.js", () => ({
  fetchPosts: jest.fn().mockResolvedValue([{ id: 1 }])
}));

jest.unstable_mockModule("../infra/repositories/userApi.js", () => ({
  fetchUsers: jest.fn().mockResolvedValue([{ id: 1 }])
}));

jest.unstable_mockModule("../domain/post/postEnricher.js", () => ({
  enrichPosts: jest.fn().mockResolvedValue([{ postId: 1 }])
}));

const postApi = await import("../infra/repositories/postApi.js");
const userApi = await import("../infra/repositories/userApi.js");
const enricher = await import("../domain/post/postEnricher.js");
const { generateReport } = await import("../application/generateReport.js");

describe("generateReport", () => {
  it("should orchestrate report generation", async () => {
    const result = await generateReport();

    expect(postApi.fetchPosts).toHaveBeenCalled();
    expect(userApi.fetchUsers).toHaveBeenCalled();
    expect(enricher.enrichPosts).toHaveBeenCalled();
    expect(result).toEqual([{ postId: 1 }]);
  });
});