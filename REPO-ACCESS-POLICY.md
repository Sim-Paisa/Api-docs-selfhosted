# Repo access — pull-only for this chat session

**Scope: this restriction applies to the current chat session only.** It is not a standing project policy — just a guardrail so nothing gets pushed to GitHub by mistake while this session's work is in progress. A future session may carry different instructions from the user; do not assume this still applies unless it's restated.

**For this session: `Omar-Asad/API-docs-New` on GitHub must not be pushed to, committed to remotely, or otherwise modified.** Access is **pull/read-only** — for fetching and inspecting the current state only.

## Why (as of this session)

This GitHub repo currently backs the **live, published GitBook** documentation (via GitBook's Git Sync). Pushing any change — including the local Docusaurus migration already staged in this working copy — would alter what GitBook is actively syncing from and could break the merchant-facing docs that are still in production today.

## What this means in practice

- No `git push`, force or otherwise.
- No direct commits via the GitHub UI or API.
- No merges, branch creation, or PR merges on the GitHub remote.
- Local work (commits, branches, the Docusaurus migration, the Decap CMS admin panel, etc.) can continue freely — it simply stays local/unpublished.
- Fetching/pulling from GitHub to read the current state is fine at any time.

## Lifting this

Only the user can lift it, by saying so explicitly in a session (e.g. once there's a confirmed decision to cut over from GitBook and the Git Sync has been disabled). Don't infer it's lifted just because time has passed.

## Scope note: does not apply to the new independent repo

As of 2026-07-06 the self-hosted Docusaurus site + Decap CMS work moved to its own repo, **`Sim-Paisa/Api-docs-selfhosted`**, specifically so it could be developed and pushed to independently of `Omar-Asad/API-docs-New` and the GitBook sync. **This restriction is scoped to `Omar-Asad/API-docs-New` only** — pushing to `Sim-Paisa/Api-docs-selfhosted` is the whole point of the migration and is expected to happen normally.
