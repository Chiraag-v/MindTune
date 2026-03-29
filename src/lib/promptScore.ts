/**
 * Heuristic prompt quality score (0-100).
 * Calibrated so:
 *   - Raw/messy user prompts  → 0–20
 *   - MindTune optimized output → 80–95
 */
export function scorePrompt(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;

  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  let score = 0;

  // ── 1. LENGTH (0-45) ─────────────────────────────────────────
  // Raw prompts are short (5-15 words). Optimized prompts are long (30-200 words).
  if (wordCount < 5) score += 3;
  else if (wordCount < 15) score += 10;
  else if (wordCount < 30) score += 24;
  else if (wordCount <= 80) score += 38;
  else if (wordCount <= 200) score += 45;
  else score += 40;

  // ── 2. CONSTRAINTS (0-30) ────────────────────────────────────
  // Raw prompts have no constraints. Optimized ones always do.
  const hasConstraints = /\b(must|should|avoid|only|exactly|limit|ensure|require|include|exclude|focus|restrict|prioritize|specify|maintain|follow|adhere|never|always|minimum|maximum|don't|do not|no more than|at least|keep|format)\b/i.test(trimmed);
  score += hasConstraints ? 30 : 0;

  // ── 3. STRUCTURE (0-15) ──────────────────────────────────────
  // Raw prompts are single-line. Optimized ones have clear structure.
  const hasLineBreaks = trimmed.includes('\n');
  const hasBullets = /^[\s]*[-*•]\s/m.test(trimmed) || /\n[-*•]\s/m.test(trimmed);
  const hasHeadings = /^#{1,3}\s/m.test(trimmed) || /\n#{1,3}\s/m.test(trimmed);
  const hasNumberedSteps = /\d+[\.\)]\s|\b(step\s*\d|1\.|2\.)\b/i.test(trimmed);
  const structurePoints = [hasLineBreaks, hasBullets, hasHeadings, hasNumberedSteps].filter(Boolean).length;
  score += Math.min(15, structurePoints * 6);

  // ── 4. SPECIFICITY (0-8) ─────────────────────────────────────
  const vagueWords = /\b(thing|stuff|something|do|make|get|help)\b/gi;
  const vagueCount = (trimmed.match(vagueWords) || []).length;
  const actionVerbs = /\b(write|create|explain|analyze|compare|summarize|list|describe|define|refactor|debug|fix|implement|build|design|generate|develop|optimize|configure|test|review|document|calculate|format|convert|validate|extract|identify|evaluate|produce|construct|integrate|deploy)\b/gi;
  const actionCount = (trimmed.match(actionVerbs) || []).length;
  score += Math.min(8, Math.max(0, 2 + actionCount * 2 - vagueCount * 1));

  // ── 5. TECHNICAL RICHNESS (0-2) ──────────────────────────────
  const hasTechnical = /\b(api|json|html|css|javascript|typescript|python|sql|function|class|array|object|database|endpoint|variable|module|component|interface|algorithm|framework|library|async|promise|query|schema|type|parameter|react|node|http|rest|graphql)\b/gi.test(trimmed);
  score += hasTechnical ? 2 : 0;

  return Math.min(100, Math.max(0, Math.round(score)));
}
