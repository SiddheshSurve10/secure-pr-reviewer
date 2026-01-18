import { Context } from "probot";

/**
 * Fetches the complete PR diff from GitHub
 * Uses the GitHub API to get the raw diff format
 */
export async function fetchPullRequestDiff(
  context: Context,
  pr: any
): Promise<string> {
  try {
    // Fetch the PR comparison to get the diff
    const comparison = await context.octokit.repos.compareCommits({
      owner: pr.base.repo.owner.login,
      repo: pr.base.repo.name,
      base: pr.base.sha,
      head: pr.head.sha,
    });

    // Build diff string from commits
    let diff = "";

    for (const commit of comparison.data.commits) {
      diff += `commit ${commit.sha}\n`;
      diff += `Author: ${commit.commit.author.name}\n`;
      diff += `Date: ${commit.commit.author. date}\n\n`;
      diff += commit.commit.message + "\n\n`;

      // Get commit patch
      const commitData = await context.octokit. repos.getCommit({
        owner: pr.base.repo. owner.login,
        repo: pr.base.repo.name,
        ref: commit.sha,
      });

      if (commitData.data.files) {
        for (const file of commitData.data.files) {
          diff += `diff --git a/${file.filename} b/${file.filename}\n`;
          diff += `index ${file.sha.substring(0, 7)}..${file.sha.substring(0, 7)} 100644\n`;
          diff += `--- a/${file.filename}\n`;
          diff += `+++ b/${file.filename}\n`;
          diff += file.patch || "";
          diff += "\n";
        }
      }
    }

    return diff;
  } catch (error) {
    context.log.error({ error }, "Failed to fetch PR diff");
    throw error;
  }
}