export async function onRequest(context) {
  const FORM_URL = context.env.FORM_URL;

  // Production opening time: 21 April 2026, 11:00 PM Cairo time
  const OPEN_YEAR = 2026;
  const OPEN_MONTH = 4;
  const OPEN_DAY = 21;
  const OPEN_HOUR = 23;
  const OPEN_MINUTE = 0;

  const REFRESH_SECONDS = 10;

  function cairoNowParts(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Cairo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23"
    }).formatToParts(date);

    const map = {};
    for (const p of parts) {
      if (p.type !== "literal") map[p.type] = p.value;
    }

    return {
      year: Number(map.year),
      month: Number(map.month),
      day: Number(map.day),
      hour: Number(map.hour),
      minute: Number(map.minute),
      second: Number(map.second)
    };
  }

  function toKey(p) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${p.year}${pad(p.month)}${pad(p.day)}${pad(p.hour)}${pad(p.minute)}`;
  }

  const commonHeaders = {
    "Cache-Control": "no-store, max-age=0",
    "Pragma": "no-cache",
    "Expires": "0",
    "X-Robots-Tag": "noindex, nofollow"
  };

  if (!FORM_URL) {
    return new Response(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Configuration error</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f6f7fb;
      color: #111827;
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
    }
    .card {
      width: min(92vw, 560px);
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      padding: 28px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Configuration error</h1>
    <p>FORM_URL is missing in Cloudflare Pages environment variables.</p>
  </div>
</body>
</html>`,
      {
        status: 500,
        headers: {
          ...commonHeaders,
          "Content-Type": "text/html; charset=UTF-8"
        }
      }
    );
  }

  const now = cairoNowParts();
  const nowKey = toKey(now);
  const openKey =
    `${OPEN_YEAR}${String(OPEN_MONTH).padStart(2, "0")}${String(OPEN_DAY).padStart(2, "0")}${String(OPEN_HOUR).padStart(2, "0")}${String(OPEN_MINUTE).padStart(2, "0")}`;

  if (nowKey >= openKey) {
    return new Response(null, {
      status: 302,
      headers: {
        ...commonHeaders,
        "Location": FORM_URL
      }
    });
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="${REFRESH_SECONDS}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Registration not open yet</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f6f7fb;
      color: #111827;
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
    }
    .card {
      width: min(92vw, 560px);
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      padding: 28px;
      text-align: center;
    }
    h1 { margin-top: 0; margin-bottom: 10px; }
    p { line-height: 1.6; margin: 8px 0; }
    .time { font-weight: 700; }
    .small { font-size: 13px; color: #6b7280; margin-top: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Registration is not open yet</h1>
    <p class="time">Opens at 21 April 2026, 11:00 PM Cairo time</p>
    <p>This page refreshes automatically every ${REFRESH_SECONDS} seconds.</p>
    <p class="small">Keep this page open. It will redirect automatically when registration opens.</p>
  </div>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      ...commonHeaders,
      "Content-Type": "text/html; charset=UTF-8"
    }
  });
}
