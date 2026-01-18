import { Probot } from "probot";
import { handlePullRequest } from "./webhook";

export default (app: Probot) => {
  // Log that the app was loaded
  app.log. info("secure-pr-reviewer app loaded");

  // Listen to pull request events
  app. on(
    ["pull_request.opened", "pull_request.synchronize", "pull_request.reopened"],
    handlePullRequest
  );

  // Optional: Health check endpoint for monitoring
  app.router?. get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });
};