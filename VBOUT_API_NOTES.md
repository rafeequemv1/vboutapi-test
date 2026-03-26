# VBOUT Social Media API Notes

## Auth
VBOUT authenticates requests using an API key passed as a query parameter named `key`.

Example (App Me):
```text
GET https://api.vbout.com/1/app/me.json?key={YOUR_API_ID}
```

Quickstart-style curl sample:
```text
$ curl https://api.vbout.com/1/app/me.json -H 'Content Type: application/json' -d '{"key":"YOUR_API_ID"}'
```

In this project, the server reads your key from the `VBOUT_API_KEY` environment variable and forwards it to VBOUT as `?key=...`.

## Rate Limits
VBOUT enforces a rate limit of **15 requests per 1 second**.

If you exceed your rate limit, VBOUT returns **HTTP 429 Too Many Requests** for subsequent API calls.

The returned rate-limit JSON object includes:
- `rate-limit.limit`
- `rate-limit.requests`
- `rate-limit.remaining`
- `rate-limit.reached`
- `rate-limit.reset`
- `rate-limit.after`

Example rate-limit JSON object:
```json
{
  "rate-limit": {
    "limit": "10",
    "requests": "1",
    "remaining": "9",
    "reached": "0",
    "reset": "123456789",
    "after": "1"
  }
}
```

VBOUT also returns the same values in `x-rate-limit-*` headers (for example: `x-rate-limit-limit`, `x-rate-limit-requests`, etc.).

## SocialMedia

### channels
Endpoint:
```text
GET https://api.vbout.com/1/socialmedia/channels.json?key={YOUR_API_ID}
```
Parameters: none.

### calendar
Endpoint:
```text
POST https://api.vbout.com/1/socialmedia/calendar.json?key={YOUR_API_ID}
```

Example request parameters:
```text
channels=all
includeposted=true
```

Query parameters:
- `channels` (string, default: `"all"`) possible values: `all | facebook | twitter | linkedin`
- `from` (required, string `<date> m/d/Y | Y-m-d`, default: `"none"`)
- `to` (required, string `<date> m/d/Y | Y-m-d`, default: `"none"`)
- `includeposted` (boolean, default: `"false"`) possible values: `true | false`
- `limit` (number, default: `10`)
- `page` (number, default: `1`)
- `sort` (string, default: `"asc"`) possible values: `asc | desc`

### stats
Endpoint:
```text
GET https://api.vbout.com/1/socialmedia/stats.json?key={YOUR_API_ID}&channels=facebook
```

Query parameters:
- `channels` (string, default: `"all"`) possible values: `all | facebook | twitter | linkedin | pinterest`
- `sort` (string, default: `"asc"`) possible values: `asc | desc`

### add (AddPost)
Endpoint:
```text
POST https://api.vbout.com/1/socialmedia/addpost.json?key={YOUR_API_ID}
```

Parameters:
- `message` (required, string)
- `channel` (required, string) possible values: `facebook | twitter | linkedin | pinterest | instagram`
- `channelid` (required, integer) possible values: `1 | 2 | 3 | 4`
- `photo` (optional, string) possible values: `(Link) or (Uploaded Image)`
- `isscheduled` (boolean, default: `"false"`) possible values: `true | false`
- `scheduleddate` (string `<date> m/d/Y | Y-m-d`, default: `"none"`)
- `scheduledhours` (string `<time>`, default: `"none"`)
- `scheduledampm` (string, AM/PM) possible values: `AM | PM | am | pm`
- `trackableLinks` (boolean, default: `"false"`) possible values: `true | false`

Scheduling rule (per VBOUT fields):
- Set `isscheduled=true`, and include `scheduleddate`, `scheduledhours`, and `scheduledampm`.
- For immediate posts, set `isscheduled=false` (or omit scheduling fields).

### edit (EditPost)
Endpoint:
```text
POST https://api.vbout.com/1/socialmedia/editpost.json?key={YOUR_API_ID}
```

Parameters:
- `id` (required, integer)
- `channel` (required, string) possible values: `facebook | twitter | linkedin | pinterest | instagram`
- `message` (string)
- `scheduleddatetime` (string `<date-time>` ISO-8601 `Y-m-d H:i:s`)

Example request payload (fields):
```text
id=1
channel=facebook
message=Hello World!
scheduleddatetime=2020-10-20 15:30:00
```

### delete (DeletePost)
Endpoint:
```text
POST https://api.vbout.com/1/socialmedia/deletepost.json?key={YOUR_API_ID}
```

Parameters:
- `id` (required, integer)
- `channel` (string) possible values: `facebook | twitter | linkedin`

