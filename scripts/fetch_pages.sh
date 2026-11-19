#!/bin/bash
# Parallel page fetch + on-page SEO extraction for trulytoursnamibia.com audit
cd /home/z/my-project/audit_data
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"

URLS=(
  "https://trulytoursnamibia.com/tours/"
  "https://trulytoursnamibia.com/10-days-tours/"
  "https://trulytoursnamibia.com/windhoek-sossusvlei/"
  "https://trulytoursnamibia.com/kalahari/"
  "https://trulytoursnamibia.com/tour-to-the-north/"
  "https://trulytoursnamibia.com/etosha-national-park/"
  "https://trulytoursnamibia.com/sossusvlei-and-swakopmund/"
  "https://trulytoursnamibia.com/ctt/"
  "https://trulytoursnamibia.com/saw/"
  "https://trulytoursnamibia.com/gde/"
  "https://trulytoursnamibia.com/tnt/"
  "https://trulytoursnamibia.com/bhw/"
  "https://trulytoursnamibia.com/contact/"
  "https://trulytoursnamibia.com/our-team/"
  "https://trulytoursnamibia.com/gallery/"
)

fetch() {
  local url="$1"
  local name=$(echo "$url" | sed 's|https://trulytoursnamibia.com/||; s|/$||; s|/|_|g')
  [ -z "$name" ] && name="home"
  curl -sS -m 30 -A "$UA" "$url" -o "page_${name}.html" 2>/dev/null
  echo "$name|$url|$(wc -c < page_${name}.html)"
}

# fetch all in parallel
for u in "${URLS[@]}"; do fetch "$u" & done
wait
echo "--- ALL FETCHED ---"

# quick check of leftover default pages
for u in "https://trulytoursnamibia.com/sample-page/" "https://trulytoursnamibia.com/hello-world/" "https://trulytoursnamibia.com/tours-2/" "https://trulytoursnamibia.com/customer-cabinet/"; do
  code=$(curl -sS -m 20 -A "$UA" -o /dev/null -w "%{http_code}" "$u")
  echo "STATUS ${code} $u"
done
