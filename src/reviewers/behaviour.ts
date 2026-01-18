/**
 * Behavior Reviewer Agent
 * Analyzes code quality, patterns, and best practices
 * 
 * STUB: Replace with LLM or static analysis tools
 * Example:  Sonarqube, ESLint integration, or Claude API for code review
 */

export interface BehaviorReview {
  hasIssues: boolean;
  severity: "low" | "medium" | "high";
  issues: BehaviorIssue[];
  message: string;
}

export interface BehaviorIssue {
  type: string;
  description: string;
  severity: "low" | "medium" | "high";
}

export async function runBehaviorReview(diff: string): Promise<BehaviorReview> {
  // STUB: This is a placeholder implementation
  // TODO:  Integrate with ESLint API, Prettier, or LLM for behavior analysis
  // Example LLM prompt: 
  // "Review this code diff for quality, patterns, and best practices.  Check for: 
  // - Unnecessary complexity
  // - Lack of error handling
  // - Poor naming conventions
  // - Missing documentation
  // - Anti-patterns"

  const issues: BehaviorIssue[] = [];

  // Pattern 1: Check for missing error handling
  if (/\. then\(|async.*=>|\. catch\(/i.test(diff) && !/try|catch|Error/i.test(diff)) {
    issues.push({
      type: "Missing Error Handling",
      description: "Async operations without visible error handling",
      severity: "medium",
    });
  }

  // Pattern 2: Check for console.log in production code
  if (/console\.(log|debug|error)/i.test(diff)) {
    issues.push({
      type: "Debug Logging",
      description: "Found console logging statements that should use proper logging",
      severity: "low",
    });
  }

  // Pattern 3: Check for large functions (heuristic)
  if (diff.split("\n").length > 300) {
    issues.push({
      type: "Large Change Set",
      description: "This diff is quite large and may be harder to review",
      severity: "low",
    });
  }

  // Pattern 4: Check for missing JSDoc/comments on exports
  if (/export\s+(class|function|const)/. test(diff) && !/\/\*\*|\/\//. test(diff)) {
    issues.push({
      type: "Missing Documentation",
      description: "Public exports without documentation comments",
      severity: "low",
    });
  }

  const hasIssues = issues.length > 0;
  const maxSeverity = hasIssues
    ? issues.reduce((max, issue) => {
        const severityMap = { high: 3, medium: 2, low: 1 };
        return Math.max(max, severityMap[issue.severity]);
      }, 0)
    : 1;

  const severityMap: Record<number, "low" | "medium" | "high"> = {
    3: "high",
    2: "medium",
    1: "low",
  };

  return {
    hasIssues,
    severity: severityMap[maxSeverity] || "low",
    issues,
    message: hasIssues
      ? `🔍 Found ${issues.length} code quality suggestion(s)`
      : "✅ Code quality looks good",
  };
}