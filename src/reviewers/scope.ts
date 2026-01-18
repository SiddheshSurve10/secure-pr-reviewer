/**
 * Scope Reviewer Agent
 * Analyzes the scope and size of changes to ensure PRs are focused
 * 
 * STUB: Replace the logic below with LLM-based analysis
 * Example: Use Claude/GPT to understand PR intent and validate scope
 */

export interface ScopeReview {
  isFocused: boolean;
  severity: "low" | "medium" | "high";
  message: string;
  filesCount: number;
  linesAdded: number;
  linesRemoved: number;
}

export async function runScopeReview(diff: string): Promise<ScopeReview> {
  // STUB: This is a placeholder implementation
  // TODO: Integrate with LLM to analyze PR scope
  // Example prompt: "Analyze if this PR scope is focused and well-defined"

  const linesAdded = (diff.match(/^\+(? !\+\+)/gm) || []).length;
  const linesRemoved = (diff.match(/^\-(?!\-\-)/gm) || []).length;
  const filesCount = (diff.match(/^diff --git/gm) || []).length;

  // Simple heuristic: warn if changes are too large
  const totalChanges = linesAdded + linesRemoved;
  const isFocused = totalChanges < 500 && filesCount < 10;

  return {
    isFocused,
    severity:  isFocused ? "low" : "high",
    message: isFocused
      ? "✅ PR scope is focused and well-defined"
      : `⚠️ PR changes ${totalChanges} lines across ${filesCount} files. Consider breaking into smaller PRs.`,
    filesCount,
    linesAdded,
    linesRemoved,
  };
}