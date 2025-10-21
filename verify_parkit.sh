#!/usr/bin/env bash
# ParkIt end-to-end smoke test (backend + nginx + basic flows)
# This script prints PASS/FAIL for each step without exiting early.

set +e
API_LOCAL="http://127.0.0.1:5000"
API_PROXY="http://127.0.0.1"
PUBLIC="http://52.8.117.184"

pass() { printf "\e[32mPASS\e[0m  %s\n" "$1"; }
fail() { printf "\e[31mFAIL\e[0m  %s\n" "$1"; }

echo "== CHECK: required files exist =="
for f in \
  server/src/app.js \
  server/src/index.js \
  server/src/routes/health.js \
  server/src/routes/auth.js \
  server/src/routes/spots.js \
  server/src/routes/listings.js \
  server/src/routes/events.js \
  server/src/middleware/auth.js \
  server/.env
do
  if [ -f "$f" ]; then pass "found $f"; else fail "missing $f"; fi
done

echo
echo "== CHECK: .env essentials =="
grep -q '^MONGO_URI=' server/.env && pass "MONGO_URI set" || fail "MONGO_URI missing"
grep -q '^JWT_SECRET=' server/.env && pass "JWT_SECRET set" || fail "JWT_SECRET missing"
grep -q '^TM_API_KEY=' server/.env && pass "TM_API_KEY set (needed for /api/events)" || echo "WARN  TM_API_KEY not set; /api/events will fail"

echo
echo "== PM2 restart with env =="
cd server
pm2 restart parkit-backend --update-env >/dev/null 2>&1
sleep 1
pm2 list | grep -q parkit-backend && pass "pm2 process exists" || fail "pm2 process missing"
sleep 1

echo
echo "== CHECK: backend health (direct) =="
curl -sS "${API_LOCAL}/api/health" | jq . >/dev/null 2>&1
[ $? -eq 0 ] && pass "GET ${API_LOCAL}/api/health returns JSON" || fail "GET ${API_LOCAL}/api/health failed"

echo
echo "== CHECK: backend health (via nginx) =="
# expect 301 from /health to /api/health
code=$(curl -s -o /dev/null -w "%{http_code}" "${API_PROXY}/health")
[ "$code" = "301" ] && pass "GET ${API_PROXY}/health redirects (301) to /api/health" || fail "GET ${API_PROXY}/health expected 301, got ${code}"
curl -sS "${API_PROXY}/api/health" | jq . >/dev/null 2>&1
[ $? -eq 0 ] && pass "GET ${API_PROXY}/api/health through nginx returns JSON" || fail "GET ${API_PROXY}/api/health failed"

echo
echo "== AUTH: ensure test accounts exist =="
# create (ignore 'already registered')
curl -sS -X POST "${API_LOCAL}/api/auth/signup" -H "Content-Type: application/json" \
  -d '{"name":"Host1","email":"host1@parkit.com","password":"test123","role":"lister"}' >/dev/null
curl -sS -X POST "${API_LOCAL}/api/auth/signup" -H "Content-Type: application/json" \
  -d '{"name":"User1","email":"user1@parkit.com","password":"test123","role":"user"}' >/dev/null

echo "-- login lister"
LISTER_TOKEN=$(curl -sS -X POST "${API_LOCAL}/api/auth/login" -H "Content-Type: application/json" \
  -d '{"email":"host1@parkit.com","password":"test123"}' | jq -r '.token // empty')
if [ -n "$LISTER_TOKEN" ]; then pass "Lister login ok (token acquired)"; else fail "Lister login failed"; fi

echo "-- login user"
USER_TOKEN=$(curl -sS -X POST "${API_LOCAL}/api/auth/login" -H "Content-Type: application/json" \
  -d '{"email":"user1@parkit.com","password":"test123"}' | jq -r '.token // empty')
if [ -n "$USER_TOKEN" ]; then pass "User login ok (token acquired)"; else fail "User login failed"; fi

echo
echo "== LISTINGS: create + query =="
CREATE_RES=$(curl -sS -X POST "${API_LOCAL}/api/listings" \
  -H "Authorization: Bearer ${LISTER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Driveway on Elm",
    "pricePerHour":12,
    "lat":37.4030,
    "lng":-121.9700,
    "address":"123 Elm St, Santa Clara, CA",
    "bathroom":true,
    "evCharging":false,
    "shuttle":true,
    "tailgateFriendly":true,
    "overnightAllowed":false
  }')
echo "$CREATE_RES" | jq . >/dev/null 2>&1
if [ $? -eq 0 ] && echo "$CREATE_RES" | jq -e 'has("_id") or has("id")' >/dev/null 2>&1; then
  pass "POST /api/listings created a listing"
else
  echo "$CREATE_RES"
  fail "POST /api/listings failed"
fi

echo "-- query nearby listings"
curl -sS "${API_LOCAL}/api/listings?lat=37.4030&lng=-121.9700&maxKm=5" | jq '.[0:3]' >/dev/null 2>&1
[ $? -eq 0 ] && pass "GET /api/listings nearby returns JSON (possibly empty array if none in range)" || fail "GET /api/listings nearby failed"

echo
echo "== EVENTS: Ticketmaster proxy =="
EV=$(curl -sS "${API_LOCAL}/api/events?venue=Levi%27s%20Stadium&range=week")
if echo "$EV" | jq '.[0]' >/dev/null 2>&1; then
  pass "GET /api/events returned JSON"
else
  echo "$EV" | head -c 300; echo
  echo "WARN  /api/events likely needs TM_API_KEY in server/.env and pm2 restart --update-env"
fi

echo
echo "== FRONTEND: build + nginx =="
cd ~/4800project/client
npm run build >/dev/null 2>&1
if [ $? -eq 0 ]; then pass "client build ok"; else fail "client build failed"; fi
sudo nginx -t >/dev/null 2>&1 && sudo systemctl reload nginx
if [ $? -eq 0 ]; then pass "nginx config ok & reloaded"; else fail "nginx reload failed"; fi

echo "-- home page via public IP"
code=$(curl -s -o /dev/null -w "%{http_code}" "${PUBLIC}/")
[ "$code" = "200" ] && pass "GET ${PUBLIC}/ serves index.html" || fail "GET ${PUBLIC}/ returned ${code}"

echo "-- proxy health via public IP"
curl -sS "${PUBLIC}/api/health" | jq . >/dev/null 2>&1
[ $? -eq 0 ] && pass "GET ${PUBLIC}/api/health returns JSON" || fail "GET ${PUBLIC}/api/health failed"

echo
echo "== DONE =="
