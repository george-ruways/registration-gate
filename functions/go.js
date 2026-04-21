export async function onRequest(context) {
  const FORM_URL = context.env.FORM_URL;

  // Production opening time: 21 April 2026, 11:00 PM Cairo time
  const OPEN_YEAR = 2026;
  const OPEN_MONTH = 4;
  const OPEN_DAY = 21;
  const OPEN_HOUR = 23;
  const OPEN_MINUTE = 0;

  // Cairo is UTC+2 on 2026-04-21
  const TARGET_ISO = "2026-04-21T23:00:00+02:00";
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
  <link rel="icon" type="image/png" href="/thy-logo.png?v=3" />
  <link rel="shortcut icon" href="/thy-logo.png?v=3" />
  <link rel="apple-touch-icon" href="/thy-logo.png?v=3" />
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
      border-radius: 18px;
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
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="${REFRESH_SECONDS}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/png" href="/thy-logo.png?v=3" />
  <link rel="shortcut icon" href="/thy-logo.png?v=3" />
  <link rel="apple-touch-icon" href="/thy-logo.png?v=3" />
  <title>Conference Registration</title>
  <style>
    * { box-sizing: border-box; }

    body {
      font-family: Arial, "Segoe UI", Tahoma, sans-serif;
      background: linear-gradient(180deg, #f8f8f8 0%, #f1f1f1 100%);
      color: #111827;
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 14px;
    }

    .card {
      width: min(94vw, 560px);
      background: white;
      border-radius: 20px;
      box-shadow: 0 12px 30px rgba(0,0,0,0.08);
      padding: 20px 18px 22px;
      text-align: center;
      border-top: 4px solid #e11d2e;
    }

    .logo-wrap {
      margin-bottom: 12px;
    }

    .logo {
      width: min(170px, 42vw);
      height: auto;
      display: block;
      margin: 0 auto;
    }

    .brand-main {
      margin: 8px 0 0 0;
      font-size: clamp(18px, 4.3vw, 24px);
      font-weight: 700;
      color: #6b4f1d;
      line-height: 1.6;
    }

    .brand-sub {
      margin: 8px 0 0 0;
      font-size: clamp(14px, 3.6vw, 17px);
      line-height: 1.7;
      color: #4b5563;
    }

    .event {
      margin: 14px 0 8px 0;
      font-size: clamp(18px, 4.3vw, 24px);
      font-weight: 700;
      color: #b91c1c;
      line-height: 1.5;
    }

    .event-en {
      margin: 2px 0 0 0;
      font-size: clamp(14px, 3.4vw, 16px);
      color: #6b7280;
      direction: ltr;
    }

    .status {
      margin: 14px 0 6px 0;
      font-size: clamp(22px, 5vw, 30px);
      font-weight: 800;
      line-height: 1.2;
      color: #111827;
    }

    .status-en {
      margin: 0;
      font-size: clamp(14px, 3.4vw, 16px);
      color: #6b7280;
      direction: ltr;
    }

    .time {
      font-weight: 700;
      color: #6b4f1d;
      font-size: clamp(15px, 3.8vw, 18px);
      line-height: 1.8;
      margin: 10px 0 0 0;
    }

    .time-en {
      margin: 4px 0 0 0;
      font-size: clamp(14px, 3.3vw, 16px);
      color: #6b7280;
      direction: ltr;
    }

    .countdown {
      font-size: clamp(30px, 8vw, 44px);
      font-weight: 800;
      margin: 20px 0 16px 0;
      line-height: 1.1;
      word-break: break-word;
      color: #111827;
      direction: ltr;
    }

    .btn {
      display: inline-block;
      margin-top: 8px;
      background: #2563eb;
      color: white;
      text-decoration: none;
      border-radius: 14px;
      padding: 15px 18px;
      font-size: 18px;
      font-weight: 700;
      width: 100%;
      max-width: 330px;
      min-height: 54px;
      box-sizing: border-box;
    }

    .small {
      font-size: clamp(13px, 3.2vw, 14px);
      color: #6b7280;
      margin-top: 14px;
      line-height: 1.8;
    }

    .small-en {
      display: block;
      margin-top: 4px;
      direction: ltr;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo-wrap">
      <img class="logo" src="/thy-logo.png" alt="Conference logo" />
    </div>

    <p class="brand-main">لجنة المؤتمرات بخدمة الشباب الجامعي، كنيسة الشهيد مارجرجس بأسيوط</p>
    <p class="brand-sub">الصفحة الرسمية للتسجيل الإلكتروني</p>

    <p class="event">♥️🥁 مؤتمر صيف ٢٠٢٦ 🥁♥️</p>
    <p class="event-en">Summer Conference 2026</p>

    <p class="status">التسجيل غير متاح الآن</p>
    <p class="status-en">Registration is not open yet</p>

    <p class="time">يفتح التسجيل يوم 21 April 2026 الساعة 11:00 PM بتوقيت القاهرة</p>
    <p class="time-en">Registration opens on 21 April 2026 at 11:00 PM Cairo time</p>

    <div class="countdown" id="countdown">Calculating...</div>

    <a class="btn" href="/go">الدخول إلى التسجيل | Open Registration</a>

    <p class="small">
      يتم تحديث هذه الصفحة تلقائيًا كل ${REFRESH_SECONDS} ثوانٍ، وعند فتح التسجيل سيتم تحويلك تلقائيًا.
      <span class="small-en">This page refreshes automatically every ${REFRESH_SECONDS} seconds and will redirect automatically once registration opens.</span>
    </p>
  </div>

  <script>
    const TARGET_ISO = "${TARGET_ISO}";
    const countdownEl = document.getElementById("countdown");

    function renderCountdown() {
      const now = Date.now();
      const target = new Date(TARGET_ISO).getTime();
      let diff = target - now;

      if (diff <= 0) {
        countdownEl.textContent = "Opening now...";
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      countdownEl.textContent = hours + "h " + minutes + "m " + seconds + "s";
    }

    renderCountdown();
    setInterval(renderCountdown, 1000);
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

