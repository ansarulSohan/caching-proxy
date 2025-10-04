class Cache {
  constructor(ttl = 60000) {
    // Default TTL: 60 seconds
    this.store = new Map();
    this.ttl = ttl;
  }

  set(key, value) {
    const expires = Date.now() + this.ttl;
    this.store.set(key, { value, expires });
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expires) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  has(key) {
    const entry = this.store.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expires) {
      this.store.delete(key);
      return false;
    }
    return true;
  }

  delete(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

module.exports = Cache;
