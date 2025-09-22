// Simple in-memory rate limiter
// In production, use Redis for distributed rate limiting

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetTime: number;
  retryAfter?: number;
}

const requestCounts = new Map<string, RateLimitInfo>();

export function rateLimiter(clientId: string): RateLimitResult {
  const maxRequests = parseInt(process.env.MAX_REQUESTS_PER_MINUTE || "20");
  const windowMs = 60 * 1000; // 1 minute
  const now = Date.now();

  // Clean up expired entries
  for (const [key, info] of requestCounts.entries()) {
    if (now > info.resetTime) {
      requestCounts.delete(key);
    }
  }

  // Get or create rate limit info for client
  let rateLimitInfo = requestCounts.get(clientId);
  
  if (!rateLimitInfo || now > rateLimitInfo.resetTime) {
    // Create new window
    rateLimitInfo = {
      count: 0,
      resetTime: now + windowMs
    };
    requestCounts.set(clientId, rateLimitInfo);
  }

  // Check if request is allowed
  if (rateLimitInfo.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      limit: maxRequests,
      resetTime: rateLimitInfo.resetTime,
      retryAfter: Math.ceil((rateLimitInfo.resetTime - now) / 1000)
    };
  }

  // Increment count and allow request
  rateLimitInfo.count++;
  
  return {
    allowed: true,
    remaining: maxRequests - rateLimitInfo.count,
    limit: maxRequests,
    resetTime: rateLimitInfo.resetTime
  };
}

// Cleanup function to prevent memory leaks
export function cleanupRateLimiter() {
  const now = Date.now();
  for (const [key, info] of requestCounts.entries()) {
    if (now > info.resetTime) {
      requestCounts.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupRateLimiter, 5 * 60 * 1000);