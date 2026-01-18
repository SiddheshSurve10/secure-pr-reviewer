import { Context } from "probot";
import { fetchPullRequestDiff } from "./github/diff";
import { runReviewAgents } from "./reviewers/aggregate";
import { postReviewComment } from "./github/comments";

/**
 * Main webhook handler for pull request events
 * Orchestrates the entire review workflow: 
 * 1. Fetch PR diff
 * 2. Run all review agents (scope, security, behavior, tests)
 * 3. Aggregate results into verdict
 * 4. Post comments based on verdict
 */
export async function handlePullRequest(context: Context<"pull_request">) {
  const { pull_request, repository, action } = context. payload;
  const pr = pull_request;

  // Log PR event
  context.log.info(
    `PR #${pr.number} ${action} in ${repository.full_name}`
  );

  try {
    // Step 1: Fetch the PR diff
    context.log.info(`Fetching diff for PR #${pr.number}`);
    const diff = await fetchPullRequestDiff(context, pr);

    if (!diff || diff.trim().length === 0) {
      context.log.warn(`No diff found for PR #${pr.number}`);
      return;
    }

    // Step 2: Run all review agents
    context.log. info(`Running review agents for PR #${pr.number}`);
    const reviewResult = await runReviewAgents(diff, context, pr);

    // Step 3: Post review comment
    context.log.info(
      `Posting ${reviewResult.verdict} review for PR #${pr.number}`
    );
    await postReviewComment(context, pr, reviewResult);

    context.log.info(`Review complete for PR #${pr.number}`);
  } catch (error) {
    context.log.error(
      { error },
      `Failed to review PR #${pr.number}`
    );
    // Post a safe error comment
    await context.octokit.issues.createComment({
      owner: repository.owner. login,
      repo: repository. name,
      issue_number:  pr.number,
      body: `⚠️ **Review Error**: The secure PR reviewer encountered an issue analyzing this PR. Please try again or contact the maintainers. `,
    });
  }
}