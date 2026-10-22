import redis from "./redis";

const QUOTA_KEY_PREFIX = "quota:";

// In-memory fallback map for local development when Redis is not running
const inMemoryQuota = new Map<string, number>();
const DEFAULT_DEV_CREDITS = 50000;

export async function checkQuota(organizationId: string, requiredCredits: number): Promise<boolean> {
  const key = `${QUOTA_KEY_PREFIX}${organizationId}`;
  
  try {
    const creditsStr = await redis.hget(key, "total_credits");
    if (creditsStr) {
      const credits = parseInt(creditsStr, 10);
      return credits >= requiredCredits;
    }
  } catch {
    // Redis offline, fallback to in-memory
  }

  const current = inMemoryQuota.get(organizationId) ?? DEFAULT_DEV_CREDITS;
  return current >= requiredCredits;
}

export async function reserveCredits(organizationId: string, amount: number): Promise<boolean> {
  const key = `${QUOTA_KEY_PREFIX}${organizationId}`;
  
  try {
    // Atomic decrement and check via Redis Lua script
    const script = `
      local current = redis.call("HGET", KEYS[1], "total_credits")
      if not current or tonumber(current) < tonumber(ARGV[1]) then
        return 0
      end
      redis.call("HINCRBY", KEYS[1], "total_credits", -tonumber(ARGV[1]))
      return 1
    `;

    const result = await redis.eval(script, 1, key, amount);
    if (result === 1) return true;
    if (result === 0) return false;
  } catch {
    // Redis offline, fallback to in-memory atomic deduction
  }

  const current = inMemoryQuota.get(organizationId) ?? DEFAULT_DEV_CREDITS;
  if (current >= amount) {
    inMemoryQuota.set(organizationId, current - amount);
    return true;
  }
  return false;
}

export async function refundCredits(organizationId: string, amount: number): Promise<void> {
  const key = `${QUOTA_KEY_PREFIX}${organizationId}`;
  try {
    await redis.hincrby(key, "total_credits", amount);
    return;
  } catch {
    // Fallback to in-memory refund
  }

  const current = inMemoryQuota.get(organizationId) ?? DEFAULT_DEV_CREDITS;
  inMemoryQuota.set(organizationId, current + amount);
}

export async function getQuotaBalance(organizationId: string): Promise<number> {
  const key = `${QUOTA_KEY_PREFIX}${organizationId}`;
  try {
    const creditsStr = await redis.hget(key, "total_credits");
    if (creditsStr) return parseInt(creditsStr, 10);
  } catch {
    // Fallback
  }
  return inMemoryQuota.get(organizationId) ?? DEFAULT_DEV_CREDITS;
}
