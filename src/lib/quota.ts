import redis from "./redis";

const QUOTA_KEY_PREFIX = "quota:";

export async function checkQuota(organizationId: string, requiredCredits: number): Promise<boolean> {
  const key = `${QUOTA_KEY_PREFIX}${organizationId}`;
  
  // Get current credits
  const creditsStr = await redis.hget(key, "total_credits");
  if (!creditsStr) {
    // If no quota set, assume no credits for enterprise safety
    return false;
  }

  const credits = parseInt(creditsStr);
  return credits >= requiredCredits;
}

export async function reserveCredits(organizationId: string, amount: number): Promise<boolean> {
  const key = `${QUOTA_KEY_PREFIX}${organizationId}`;
  
  // Atomic decrement and check
  const script = `
    local current = redis.call("HGET", KEYS[1], "total_credits")
    if not current or tonumber(current) < tonumber(ARGV[1]) then
      return 0
    end
    redis.call("HINCRBY", KEYS[1], "total_credits", -tonumber(ARGV[1]))
    return 1
  `;

  const result = await redis.eval(script, 1, key, amount);
  return result === 1;
}

export async function refundCredits(organizationId: string, amount: number) {
  const key = `${QUOTA_KEY_PREFIX}${organizationId}`;
  await redis.hincrby(key, "total_credits", amount);
}
