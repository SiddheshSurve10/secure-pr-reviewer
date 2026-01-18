import { Context } from "probot";
import { ReviewResult, ReviewVerdict } from "../reviewers/aggregate";

/**
 * Generates review comments based on verdict and analysis
 * Follows safe practices: 
 * - Evidence-based only
 * - No code suggestions (use GitHub suggestions instead)
 * - Professional tone
 * - Limited inline comments
 */

interface CommentTemplate {
  emoji: string;
  title: string;
  color: string;
  recommendation: string;
}

const VERDICT_TEMPLATES: Record<ReviewVerdict, CommentTemplate> = {
  APPROVE: {
    emoji: "✅",
    title: "Review Passed",
    color: "28a745",
    recommendation: "This PR looks good and ready for review.",
  },
  WARN:  {
    emoji: "⚠️",
    title: "Review Warnings",
    color: "ffc107",
    recommendation: 
      "This PR has some concerns that maintainers should review.",
  },
  BLOCK:  {
    emoji: "🚫",
    title: "Review Blocked",
    color: "dc3545",
    recommendation: 
      "This PR has critical issues that must be addressed before merging.",
  },
};

/**
 * Post the main review comment on the PR
 */
export async function postReviewComment(
  context: Context,
  pr: any,
  reviewResult: ReviewResult
): Promise<void> {
  const template = VERDICT_TEMPLATES[reviewResult.verdict];
  const { owner, repo } = pr.base. repo;

  // Build the detailed comment body
  let body = `## ${template.emoji} ${template. title}\n\n`;
  body += `**Recommendation:** ${template.recommendation}\n\n`;

  body += `### Summary\n`;
  body += `${reviewResult.summary}\n\n`;

  // Add detailed findings
  body += `### Detailed Analysis\n\n`;

  // Scope Analysis
  body += `#### 📊 Scope\n`;
  body += `- Files changed: ${reviewResult.scope.filesCount}\n`;
  body += `- Lines added: ${reviewResult.scope.linesAdded}\n`;
  body += `- Lines removed: ${reviewResult.scope.linesRemoved}\n`;
  body += `- Status: ${reviewResult.scope.message}\n\n`;

  // Security Analysis
  body += `#### 🔒 Security\n`;
  if (reviewResult.security.issues.length > 0) {
    body += `Found ${reviewResult.security.issues. length} security concern(s):\n`;
    for (const issue of reviewResult.security.issues) {
      body += `- **${issue.type}** (${issue.severity}): ${issue.description}\n`;
    }
  } else {
    body += `No obvious security issues detected.\n`;
  }
  body += "\n";

  // Behavior Analysis
  body += `#### 🔍 Code Quality\n`;
  if (reviewResult.behavior.issues. length > 0) {
    body += `${reviewResult.behavior.issues.length} suggestion(s):\n`;
    for (const issue of reviewResult. behavior.issues) {
      body += `- **${issue.type}**:  ${issue.description}\n`;
    }
  } else {
    body += `Code quality looks good.\n`;
  }
  body += "\n";

  // Tests Analysis
  body += `#### 🧪 Tests\n`;
  body += reviewResult.tests.message + "\n\n";

  // Add footer
  body += `---\n`;
  body += `_This is an automated review by [secure-pr-reviewer](https://github.com/SiddheshSurve10/secure-pr-reviewer). `;
  body += `Maintainers should review all findings and use their judgment._\n`;

  // Post the comment
  try {
    await context.octokit.issues.createComment({
      owner: owner. login,
      repo: repo. name,
      issue_number:  pr.number,
      body,
    });

    context.log.info(
      `Posted ${reviewResult.verdict} comment on PR #${pr.number}`
    );
  } catch (error) {
    context.log.error(
      { error },
      `Failed to post review comment on PR #${pr.number}`
    );
    throw error;
  }
}

/**
 * Generate inline comments for specific issues (optional)
 * Limited to max 1 per file per issue type to avoid spam
 */
export async function postInlineComments(
  context: Context,
  pr: any,
  reviewResult: ReviewResult,
  diff: string
): Promise<void> {
  // Only post inline comments if there are significant issues
  if (reviewResult. verdict !== "BLOCK") {
    return;
  }

  // TODO: Implement parsing of diff to find line numbers
  // and post inline comments for critical security issues
  // This requires mapping file:line from analysis to actual PR line numbers

  context.log.debug("Inline comments posting skipped (not critical)");
}