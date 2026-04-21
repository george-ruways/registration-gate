export async function onRequest(context) {
  const FORM_URL = context.env.FORM_URL;

  // Real opening time: 21 April 2026, 11:00 PM Cairo time
  const OPEN_YEAR = 2026;
  const OPEN_MONTH = 4;
  const OPEN_DAY = 21;
  const OPEN_HOUR = 23;
  const OPEN_MINUTE = 0;

  // Cairo is UTC+2 on 2026-04-21
  const TARGET_ISO = "2026-04-21T23:00:00+02:00";

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
      padding: 16px;
      box-sizing: border-box;
    }
    .card {
      width: min(94vw, 520px);
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      padding: 24px;
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Registration not open yet</title>
  <style>
    * { box-sizing: border-box; }

    body {
      font-family: Arial, sans-serif;
      background: #f6f7fb;
      color: #111827;
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 14px;
    }

    .card {
      width: min(94vw, 520px);
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      padding: 22px 18px;
      text-align: center;
    }

    h1 {
      margin: 0 0 10px 0;
      font-size: clamp(26px, 5vw, 34px);
      line-height: 1.15;
    }

    p {
      line-height: 1.55;
      margin: 8px 0;
      font-size: clamp(15px, 3.7vw, 17px);
    }

    .time {
      font-weight: 700;
    }

    .countdown {
      font-size: clamp(28px, 8vw, 42px);
      font-weight: 700;
      margin: 18px 0 14px 0;
      word-break: break-word;
      line-height: 1.1;
    }

    .btn {
      appearance: none;
      border: 0;
      border-radius: 14px;
      padding: 15px 18px;
      font-size: 18px;
      font-weight: 700;
      width: 100%;
      min-height: 54px;
      background: #9ca3af;
      color: white;
      cursor: not-allowed;
      transition: none;
    }

    .btn.enabled {
      background: #2563eb;
      cursor: pointer;
    }

    .small {
      font-size: clamp(13px, 3.2vw, 14px);
      color: #6b7280;
      margin-top: 14px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Registration is not open yet</h1>
    <p class="time">Opens at 21 April 2026, 11:00 PM Cairo time</p>

    <div class="countdown" id="countdown">Calculating...</div>

    <button class="btn" id="openBtn" disabled>Open registration</button>

    <p class="small">
      The button will activate at the opening time.
    </p>
  </div>

  <script>
    const TARGET_ISO = "${TARGET_ISO}";
    const countdownEl = document.getElementById("countdown");
    const openBtn = document.getElementById("openBtn");

    function renderState() {
      const now = Date.now();
      const target = new Date(TARGET_ISO).getTime();
      let diff = target - now;

      if (diff <= 0) {
        countdownEl.textContent = "Registration is open";
        openBtn.disabled = false;
        openBtn.classList.add("enabled");
        return;
      }

      openBtn.disabled = true;
      openBtn.classList.remove("enabled");

      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      countdownEl.textContent = hours + "h " + minutes + "m " + seconds + "s";
    }

    openBtn.addEventListener("click", function () {
      if (!openBtn.disabled) {
        window.location.href = "/go";
      }
    });

    renderState();
    setInterval(renderState, 1000);
  </script>
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
