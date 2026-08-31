import { defineCloudflareConfig } from '@opennextjs/cloudflare';

/**
 * OpenNext adapter config for the Keystatic editor on Cloudflare Workers.
 *
 * Deliberately minimal. The editor renders the Keystatic admin and proxies reads
 * and writes to the GitHub API — there is nothing to cache at the edge, and no
 * incremental static regeneration to wire up, because every page is dynamic and
 * per-user. Adding a cache here would only risk serving one editor another's
 * view of the repository.
 */
export default defineCloudflareConfig();
