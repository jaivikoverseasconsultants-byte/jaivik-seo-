cd "C:/Users/Harshita/jaivik-seo"
for u in durham tmu_ug tmu_pg unb waterloo_ug york guelph algonquin kpu; do
  echo "=== $u ==="
  node scripts/ca-detail.js "data/wave-canada/$u-discovery.json" "data/wave-canada/$u-detail.json" 2>&1 | tail -3
done
echo "=== ALL DONE ==="
