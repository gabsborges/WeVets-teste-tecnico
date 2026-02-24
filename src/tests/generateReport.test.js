import { jest } from "@jest/globals";

jest.unstable_mockModule("../infra/repositories/postApi.js", () => ({
  fetchPosts: jest.fn().mockResolvedValue([{ id: 1, userId: 1, title: "Post 1" }])
}));

jest.unstable_mockModule("../infra/repositories/userApi.js", () => ({
  fetchUsers: jest.fn().mockResolvedValue([{ id: 1, name: "Gabriel", email: "gabriel@email.com" }])
}));

jest.unstable_mockModule("../domain/post/postEnricher.js", () => ({
  enrichPosts: jest.fn().mockResolvedValue([{ postId: 1, title: "Post 1" }])
}));

const postApi = await import("../infra/repositories/postApi.js");
const userApi = await import("../infra/repositories/userApi.js");
const enricher = await import("../domain/post/postEnricher.js");
const { generateReport } = await import("../application/generateReport.js");
const logger = (await import("../utils/logger.js")).logger;

describe("generateReport - pleno", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(logger, "info").mockImplementation(() => {});
    jest.spyOn(logger, "error").mockImplementation(() => {});
  });

  it("should orchestrate report generation successfully", async () => {
    const result = await generateReport();

    expect(postApi.fetchPosts).toHaveBeenCalled();
    expect(userApi.fetchUsers).toHaveBeenCalled();
    expect(enricher.enrichPosts).toHaveBeenCalled();
    expect(result).toEqual([{ postId: 1, title: "Post 1" }]);
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining("Fetching posts and users"));
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining("Report items generated"));
  });

  it("should log error and throw when fetch fails", async () => {
    postApi.fetchPosts.mockRejectedValueOnce(new Error("API error"));

    await expect(generateReport()).rejects.toThrow("API error");
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("Failed to generate report"),
      expect.any(Error)
    );
  });
});