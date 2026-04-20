export async function onRequestGet() {
  const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfjj2693yIgHzFXQujvCQiTh8KAJTwmOjfjLbe5tItagXbkhg/viewform";
  const OPEN_YEAR = 2026;
  const OPEN_MONTH = 4;
  const OPEN_DAY = 21;
  const OPEN_HOUR = 23;
  const OPEN_MINUTE = 0;

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
    return ${p.year};
  }

  const now = cairoNowParts();
  const nowKey = toKey(now);
  const openKey =
    ${OPEN_YEAR};

  const commonHeaders = {
    "Cache-Control": "no-store, max-age=0",
    "Pragma": "no-cache",
    "Expires": "0"
  };

  if (nowKey >= openKey) {
    return new Response(null, {
      status: 302,
      headers: {
        ...commonHeaders,
        "Location": FORM_URL
      }
    });
  }

  const html = 
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Registration not open yet</title>
  <meta http-equiv="refresh" content="15">
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
    h1 { margin-top: 0; }
    p { line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Registration is not open yet</h1>
    <p>Please try again at the announced opening time.</p>
    <p>This page refreshes automatically every 15 seconds.</p>
    <p><a href="/">Back to main page</a></p>
  </div>
</body>
</html>;

  return new Response(html, {
    status: 200,
    headers: {
      ...commonHeaders,
      "Content-Type": "text/html; charset=UTF-8"
    }
  });
}
