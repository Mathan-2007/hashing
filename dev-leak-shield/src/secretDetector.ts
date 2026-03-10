/**
 * secretDetector.ts
 *
 * Scans text for common sensitive values and returns exact ranges that should be encoded.
 */

export interface SecretMatch {
  start: number;
  end: number;
  value: string;
  reason: string;
}

const KEYWORD_PATTERNS: Array<{ regex: RegExp; reason: string }> = [
  {
    regex:
      /(?:api[_-]?key|secret|token|password|bearer|private[_-]?key)\s*[:=]\s*["']?([^"'\n\r;]+)["']?/gi,
    reason: 'keyword assignment'
  },
  {
    regex: /\b(?:sk|pk|ghp|xoxb|AIza)[A-Za-z0-9_\-]{8,}\b/g,
    reason: 'known key/token format'
  },
  {
    regex: /(?:https?:\/\/)?(?:internal|private|intranet)\.[^\s"']+/gi,
    reason: 'private/internal URL'
  },
  {
    regex: /\/(?:apis|opt|srv|home|Users|var|etc)\/[A-Za-z0-9_./\-]+/g,
    reason: 'internal file path'
  },
  {
    regex: /\b[A-Z0-9_]+\s*=\s*[^\n\r#]+/g,
    reason: '.env style assignment'
  }
];

/**
 * Find secret-like values in a string.
 */
export function detectSecrets(text: string): SecretMatch[] {
  const matches: SecretMatch[] = [];

  for (const { regex, reason } of KEYWORD_PATTERNS) {
    regex.lastIndex = 0;

    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      // If there is a captured group (e.g. KEY="value"), prefer encoding the value only.
      const candidate = match[1] ?? match[0];
      const relativeOffset = match[0].indexOf(candidate);
      const start = match.index + Math.max(0, relativeOffset);
      const end = start + candidate.length;

      if (candidate.trim().length === 0) {
        continue;
      }

      matches.push({
        start,
        end,
        value: candidate,
        reason
      });
    }
  }

  // Remove overlapping ranges; keep longest match first.
  const sorted = matches.sort((a, b) => {
    if (a.start === b.start) {
      return b.end - a.end;
    }
    return a.start - b.start;
  });

  const result: SecretMatch[] = [];
  for (const current of sorted) {
    const overlaps = result.some(
      (saved) => current.start < saved.end && current.end > saved.start
    );

    if (!overlaps) {
      result.push(current);
    }
  }

  return result;
}
