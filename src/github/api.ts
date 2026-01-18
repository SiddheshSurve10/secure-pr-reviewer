/**
 * GitHub API utility functions
 * Wrappers around Octokit for common operations
 * 
 * All operations are read-only to maintain safety
 */

import { Octokit } from "@octokit/rest";

export interface GitHubApiConfig {
  owner: string;
  repo: string;
}

/**
 * Get PR author information
 */
export async function getPRAuthor(
  octokit: Octokit,
  config: GitHubApiConfig,
  prNumber: number
): Promise<string> {
  const pr = await octokit.pulls. get({
    owner: config.owner,
    repo: config.repo,
    pull_number: prNumber,
  });

  return pr.data.user?. login || "unknown";
}

/**
 * Check if user is repo maintainer
 */
export async function isMaintainer(
  octokit: Octokit,
  config: GitHubApiConfig,
  username: string
): Promise<boolean> {
  try {
    const user = await octokit.repos.getCollaboratorPermissionLevel({
      owner: config. owner,
      repo: config. repo,
      username,
    });

    const permission = user.data.permission;
    return permission === "admin" || permission === "maintain";
  } catch {
    return false;
  }
}

/**
 * Get repository information
 */
export async function getRepositoryInfo(
  octokit: Octokit,
  config: GitHubApiConfig
) {
  return octokit. repos.get({
    owner: config.owner,
    repo: config.repo,
  });
}