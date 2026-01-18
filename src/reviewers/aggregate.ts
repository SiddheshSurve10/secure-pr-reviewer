import { Context } from "probot";
import { runScopeReview } from "./scope";
import { runSecurityReview } from "./security";
import { runBehaviorReview } from "./behavior";
import { runTestsReview } from "./tests";

export type ReviewVerdict = "APPROVE" | "WARN" | "BLOCK";

export interface ReviewResult {
  verdict: ReviewVerdict;
  summary: string;
  scope:  Awaited<ReturnType<typeof runScopeReview>>;
  security: Awaited<ReturnType<typeof runSecurityReview>>;
  behavior:  Awaited<ReturnType<typeof runBehaviorReview>>;
  tests: Awaited<ReturnType<typeof runTestsReview>>;
}

/**
 * Aggregates results from all review agents into a final verdict
 * 
 * Verdict Logic:
 * - BLOCK: If security issues are critical/high OR scope is unfocused with security concerns
 * - WARN: If any medium severity issues detected
 * - APPROVE: If all issues are low severity or none
 */
export async function runReviewAgents(
  diff: string,
  context: Context,
  pr: any
): Promise<ReviewResult> {
  context.log.debug(`Running all review agents for PR #${pr. number}`);

  // Run all agents in parallel for performance
  const [scope, security, behavior, tests] = await Promise.all([
    runScopeReview(diff),
    runSecurityReview(diff),
    runBehaviorReview(diff),
    runTestsReview(diff),
  ]);

  // Determine final verdict based on agent results
  let verdict: ReviewVerdict = "APPROVE";

  // BLOCK conditions:  Critical or high security issues
  if (security.severity === "critical" || security.severity === "high") {
    verdict = "BLOCK";
  }

  // WARN conditions: Medium severity issues or unfocused scope with concerns
  if (
    verdict !== "BLOCK" &&
    (security.severity === "medium" ||
      behavior.severity === "medium" ||
      behavior.severity === "high" ||
      ! scope.isFocused)
  ) {
    verdict = "WARN";
  }

  // Generate summary
  const summaryParts:  string[] = [];
  if (scope.severity !== "low") summaryParts.push(scope. message);
  if (security.severity !== "low") summaryParts.push(security.message);
  if (behavior.severity !== "low") summaryParts.push(behavior.message);
  if (! tests.hasTestCoverage) summaryParts.push(tests.message);

  const summary =
    summaryParts.length > 0 ? summaryParts.join(" | ") : "All checks passed";

  return {
    verdict,
    summary,
    scope,
    security,
    behavior,
    tests,
  };
}