# VBOUT Social Poster

Small web app to create immediate or scheduled social posts using VBOUT API.

## VBOUT API

This app calls:
- `POST https://api.vbout.com/1/socialmedia/addpost.json?key={YOUR_API_ID}`

## Setup

1. Install dependencies:
   - `npm install`
2. Configure environment:
   - Copy `.env.example` to `.env`
   - Set `VBOUT_API_KEY` in `.env`
3. Run the app:
   - `npm run dev`

## Use

- Open `http://localhost:3000`
- Enter:
  - `message`
  - `channel` (`facebook`, `twitter`, `linkedin`, `pinterest`, `instagram`)
  - `channelid` (account-specific numeric id)
  - Choose `Immediate` or `Scheduled`
  - If `Scheduled`, set date and time

## Notes

- This app uses a simple outbound throttle to avoid exceeding VBOUT's documented limit (15 requests/second).
- Do not hardcode your API key in code or commit it to git.

## Backend API (for testing)

POST `/api/socialmedia/addpost`

Body fields:
- `message` (string, required)
- `channel` (`facebook` | `twitter` | `linkedin` | `pinterest` | `instagram`, required)
- `channelid` (number/string, required)
- `photo` (string URL, optional)
- `trackableLinks` (boolean, optional)
- `sendMode` (`immediate` | `scheduled`, required)
- If `sendMode=scheduled`:
  - `scheduledDate` (YYYY-MM-DD, required)
  - `scheduledTime` (HH:MM, required)

Example (immediate):

```bash
curl -X POST http://localhost:3000/api/socialmedia/addpost \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Hello World\",\"channel\":\"facebook\",\"channelid\":1,\"sendMode\":\"immediate\"}"
```

Example (scheduled):

```bash
curl -X POST http://localhost:3000/api/socialmedia/addpost \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Hi tomorrow\",\"channel\":\"twitter\",\"channelid\":2,\"sendMode\":\"scheduled\",\"scheduledDate\":\"2026-03-26\",\"scheduledTime\":\"09:30\"}"
```
