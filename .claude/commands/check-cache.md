## Check Cache Invalidation
When I ask you to check cache, review the file or files I specify and verify:
- Every function that deletes a Link from the DB also calls linkCache.delete(slug)
- Every function that creates a Link also calls linkCache.set({ slug, url, password, expiresAt })
- Every function that updates a Link's url, password, or expiresAt also calls linkCache.set()
- The cache key used is "linkcache:{slug}" — not any other format
Report each issue as: [CACHE BUG] filename — description — fix needed
Report "No cache issues found" if everything is correct.
