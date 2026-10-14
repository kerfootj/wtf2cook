# WTF 2 Cook

This is the Next.js app served at [wtf2cook.ca](https://www.wtf2cook.ca). The previous app remains recoverable in Git history.

## Local setup

Use Node 24 (`nvm use`), then `npm ci` in the repository root. Start MongoDB locally with Docker using a loopback-only `27017` port. Copy `.env.example` to ignored `.env.local` and configure `MONGODB_URI=mongodb://127.0.0.1:27017`, `MONGODB_DB=wtf2cook_dev`, `NEXTAUTH_URL=http://localhost:3000`, a random `NEXTAUTH_SECRET`, and a Google OAuth Web client ID/secret. Register **exactly** `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI in Google Cloud. If 3000 is occupied, use the actual dev port in both `NEXTAUTH_URL` and the Google redirect URI.

Run `npm run seed` to add six sample recipes without deleting existing records, then `npm run dev`. The seed script refuses non-local databases. `IMGUR_CLIENT_ID` is needed only for image uploads; HTTPS photo URLs work without it.

## Verification

`npm run typecheck`, `npm run lint`, `npm run build`, and `npm run test:e2e` cover the app. Browser tests use whichever recipes are present; the current local dev database contains eight production preview imports. Integration tests use only a separate local database:

```sh
TEST_MONGODB_URI=mongodb://127.0.0.1:27017 MONGODB_DB=wtf2cook_test npm test
```

## Agent recipe creation

Sign in with Google, open Account, create a named API token, and store the secret safely; it is shown only once. Send a JSON `POST /api/v1/recipes` with `Authorization: Bearer <token>` and a unique `Idempotency-Key` (8–128 letters/numbers or `._:-`). Recipes publish immediately. Example body:

```json
{
  "name": "Lemon pasta",
  "description": "A quick weeknight dinner",
  "servings": 2,
  "time_prep": 10,
  "time_cook": 15,
  "ingredients": [{ "title": null, "ingredients": ["250 g pasta", "1 lemon"] }],
  "instructions": [{ "title": null, "instructions": ["Cook pasta.", "Toss with lemon."] }]
}
```

The response includes the recipe ID, URL, and `published` status. The token cannot choose an owner or edit recipes. It expires after 90 days, can be revoked in Account, and is limited to 30 requests per minute.

## Production recipe preview

`npm run import:preview` shows a dry run of eight explicitly selected production recipes. `npm run import:preview -- --apply` copies only their public recipe fields into the local `wtf2cook_dev` database. It never writes production, never overwrites local recipes, and gives imports an unlinked preview owner so a local Google account cannot inadvertently edit them. The source is the verified production Atlas cluster/database using the ignored `.env.production-source.local` connection; the destination is the loopback-only Docker MongoDB. The script does not copy users, tokens, or authentication records. Imported recipes are marked `preview_import: true` for later cleanup.

## Legacy ownership recovery

Do not run a production migration until the actual production database is identified, duplicate IDs and orphaned owners are inventoried, and a restorable backup is tested. Sign in with the correct Google account **to that database** first. The `auth_accounts` record then supplies the verified Google `sub`; email is only an additional operator check, never the durable identity key.

`npm run link-owner -- --owner-id=<legacy-recipe-user-id> --google-sub=<verified-sub> --verified-email=<owner-email>` prints a dry-run count and refuses ambiguous links. Once a restorable backup is confirmed, append `--apply --backup-confirmed`. This preserves recipe IDs and `user_id` values while changing the Google-to-internal-user mapping. Re-run the dry-run and confirm the owner can list and edit every original recipe before cutover. Do not use this on `wtf2cook_dev` sample recipes as a substitute for a real sign-in test.

## Production repair (2026-10-12)

Production had 55 recipes: 29 owned by Joel's verified legacy Google user, 25 whose owner records were missing, and one owned by another valid Google user. The 25 orphaned recipes were assigned to Joel at his request; the other user's recipe retained its owner. Legacy Date/string timings were converted to integer minutes, and five inconsistent totals were recomputed from prep + cook + chill. Three Google account mappings were added for the rebuilt app. Original recipe IDs were preserved. A transactional migration changed 31 recipe documents.

The full pre-repair snapshot is in the ignored, private `backups/production-before-repair.ejson`. Its BSON types and contents were checked by restoring into local `wtf2cook_production_backup_check`; do not commit or share either copy. `node --env-file=.env.production-source.local --import tsx scripts/repair-production.ts verify` checks the repaired production invariants using the verified Atlas connection. The eight preview recipes in local `wtf2cook_dev` remain unlinked and are not a full production clone. Six non-production seed recipes were removed from local dev.
