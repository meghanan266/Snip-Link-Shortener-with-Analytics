## Commit
When I ask you to commit, do the following:
1. Run: git -C snip status to see what changed
2. Run: git -C snip add .
3. Generate a commit message following conventional commits format:
   - feat: for new features
   - fix: for bug fixes  
   - docs: for documentation
   - refactor: for refactoring
   - chore: for config/setup changes
   Keep it under 72 characters, all lowercase, no period at end.
4. Run: git -C snip commit -m "your generated message"
5. Tell me the commit message you used.
