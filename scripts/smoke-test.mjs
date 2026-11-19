// Read-only smoke + security test. Usage: node scripts/smoke-test.mjs <BASE_URL>
// Signs in with the seeded demo users (creates sessions only), then only issues GET requests.
import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const BASE = (process.argv[2] ?? "").replace(/\/$/, "");
if (!BASE) {
  console.error("Usage: node scripts/smoke-test.mjs <BASE_URL>");
  process.exit(2);
}
const PASSWORD = "Demo@1234";
const results = [];

function record(name, pass, detail = "") {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? `  [${detail}]` : ""}`);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function login(email) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await signInRequest(email);
    // Better Auth rate-limits sign-in (~3 per 10s). Wait and retry.
    if (res.status === 429) {
      await sleep((Number(res.headers.get("x-retry-after")) || 10) * 1000 + 500);
      continue;
    }
    const cookie = res.headers
      .getSetCookie()
      .map((c) => c.split(";")[0])
      .join("; ");
    if (!res.ok || !cookie) throw new Error(`sign-in failed for ${email}: HTTP ${res.status}`);
    return cookie;
  }
  throw new Error(`sign-in failed for ${email}: still rate-limited (429)`);
}

async function signInRequest(email) {
  return fetch(`${BASE}/api/auth/sign-in/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE },
    body: JSON.stringify({ email, password: PASSWORD }),
    redirect: "manual",
  });
}

/** GET without following redirects. Detects both HTTP redirects and streamed (in-body) Next redirects / 404s. */
async function get(path, cookie) {
  const res = await fetch(`${BASE}${path}`, {
    headers: cookie ? { Cookie: cookie } : {},
    redirect: "manual",
  });
  const body = res.status >= 300 && res.status < 400 ? "" : await res.text();
  let redirect = null;
  if (res.status >= 300 && res.status < 400) redirect = res.headers.get("location") ?? "(unknown)";
  else {
    const m =
      body.match(/NEXT_REDIRECT;[a-z]+;([^;"\\]+)/) ??
      body.match(/http-equiv="refresh"[^>]*content="\d+;\s*url=([^"]+)"/);
    if (m) redirect = m[1];
  }
  // A real 404 carries the NEXT_HTTP_ERROR_FALLBACK;404 digest / noindex meta. (The "Page not found" text
  // is in every page's payload, so it is not a signal.) Streamed pages (loading.tsx) return HTTP 200 for it.
  const notFound =
    res.status === 404 || body.includes("NEXT_HTTP_ERROR_FALLBACK;404") || body.includes('name="robots" content="noindex"');
  const crashed = res.status >= 500 || /An unexpected error occurred/.test(body);
  return { status: res.status, redirect, notFound, crashed, body };
}

const ok200 = (r) => r.status === 200 && !r.redirect && !r.notFound && !r.crashed;
const path = (loc) => (loc ? loc.replace(/^https?:\/\/[^/]+/, "") : "");
const desc = (r) => `status ${r.status}${r.redirect ? `, redirect -> ${path(r.redirect)}` : ""}${r.notFound ? ", not-found" : ""}${r.crashed ? ", ERROR PAGE" : ""}`;

async function main() {
  console.log(`Smoke test against ${BASE}\n`);

  // Complaint data (read-only query).
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql.query(
    `SELECT c.id, c.title, c.department, u.email AS student
       FROM "Complaint" c JOIN "user" u ON u.id = c."studentId"`,
  );
  const byDept = (d) => rows.filter((r) => r.department === d);
  const of = (email) => rows.filter((r) => r.student === email);

  const emails = [
    "ali@student.edu",
    "ayesha@student.edu",
    "super@campus.edu",
    "library@campus.edu",
    "labs@campus.edu",
    "teaching@campus.edu",
    "cafeteria@campus.edu",
  ];
  const cookies = {};
  for (const e of emails) {
    try {
      cookies[e] = await login(e);
      record(`sign-in ${e}`, true);
    } catch (err) {
      record(`sign-in ${e}`, false, err.message);
    }
  }

  // 1. Main pages per role
  const studentPages = ["/complaints", "/complaints/new", "/notifications", "/profile"];
  const adminPages = ["/admin", "/admin/complaints", "/admin/notifications", "/admin/profile"];
  for (const e of ["ali@student.edu", "ayesha@student.edu"]) {
    for (const p of studentPages) {
      const r = await get(p, cookies[e]);
      record(`${e} GET ${p} -> 200`, ok200(r), ok200(r) ? "" : desc(r));
    }
  }
  for (const e of ["super@campus.edu", "library@campus.edu", "labs@campus.edu", "teaching@campus.edu", "cafeteria@campus.edu"]) {
    for (const p of adminPages) {
      const r = await get(p, cookies[e]);
      record(`${e} GET ${p} -> 200`, ok200(r), ok200(r) ? "" : desc(r));
    }
  }

  // 2. Logged out
  for (const p of ["/complaints", "/admin"]) {
    const r = await get(p);
    record(`logged out GET ${p} -> /sign-in`, path(r.redirect).startsWith("/sign-in"), desc(r));
  }

  // 3. Role crossover
  const sAdmin = await get("/admin", cookies["ali@student.edu"]);
  record("student GET /admin -> redirected away", !!sAdmin.redirect && !sAdmin.body.includes("Complaints by"), desc(sAdmin));
  const sAdminC = await get("/admin/complaints", cookies["ali@student.edu"]);
  record("student GET /admin/complaints -> redirected away", !!sAdminC.redirect, desc(sAdminC));
  const dComp = await get("/complaints", cookies["library@campus.edu"]);
  record("dept admin GET /complaints -> redirected away", !!dComp.redirect, desc(dComp));

  // 4. Student A vs student B
  const bComplaint = of("ayesha@student.edu")[0];
  const aComplaint = of("ali@student.edu")[0];
  const x = await get(`/complaints/${bComplaint.id}`, cookies["ali@student.edu"]);
  record("ali GET ayesha's /complaints/<id> -> 404", x.notFound && !x.body.includes(bComplaint.title), desc(x));
  const xe = await get(`/complaints/${bComplaint.id}/edit`, cookies["ali@student.edu"]);
  record("ali GET ayesha's /complaints/<id>/edit -> 404", xe.notFound, desc(xe));
  const own = await get(`/complaints/${aComplaint.id}`, cookies["ali@student.edu"]);
  record("ali GET own /complaints/<id> -> 200 (control)", ok200(own) && own.body.includes(aComplaint.title.slice(0, 20)), desc(own));

  // 5. Dept admin vs other department
  const labs = byDept("LABS_IT")[0];
  const lib = await get(`/admin/complaints/${labs.id}`, cookies["library@campus.edu"]);
  record("library admin GET LABS_IT /admin/complaints/<id> -> 404", lib.notFound && !lib.body.includes(labs.title), desc(lib));
  const ownLib = await get(`/admin/complaints/${byDept("LIBRARY")[0].id}`, cookies["library@campus.edu"]);
  record("library admin GET own LIBRARY complaint -> 200 (control)", ok200(ownLib), desc(ownLib));

  // 6. Department param cannot widen scope
  const libTitles = byDept("LIBRARY").map((r) => r.title);
  const teachTitles = byDept("TEACHING").map((r) => r.title);
  for (const p of ["/admin?department=LIBRARY", "/admin/complaints?department=LIBRARY"]) {
    const r = await get(p, cookies["teaching@campus.edu"]);
    const leaked = libTitles.filter((t) => r.body.includes(t));
    const sawOwn = teachTitles.some((t) => r.body.includes(t));
    record(
      `teaching admin GET ${p} -> no Library complaints`,
      ok200(r) && leaked.length === 0 && sawOwn,
      leaked.length ? `LEAKED: ${leaked.join(" | ")}` : sawOwn ? "" : `${desc(r)}; own complaints not shown`,
    );
  }

  // 7. Super admin opens every department
  for (const dept of ["CAFETERIA", "LIBRARY", "LABS_IT", "TEACHING"]) {
    const c = byDept(dept)[0];
    const r = await get(`/admin/complaints/${c.id}`, cookies["super@campus.edu"]);
    record(`super admin GET ${dept} /admin/complaints/<id> -> 200`, ok200(r) && r.body.includes("Oversight view"), desc(r));
  }
  const dc = await get(`/admin/complaints/${byDept("LIBRARY")[0].id}`, cookies["library@campus.edu"]);
  record("dept admin sees the action panel, not oversight card (control)", ok200(dc) && !dc.body.includes("Oversight view"), desc(dc));

  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} passed, ${failed.length} failed`);
  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => {
  console.error("Smoke test crashed:", e);
  process.exit(2);
});
