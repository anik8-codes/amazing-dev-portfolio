# Site: static Next.js export served by Cloudflare Pages.
resource "cloudflare_pages_project" "site" {
  account_id        = var.account_id
  name              = var.project
  production_branch = "main"
}

resource "cloudflare_pages_domain" "apex" {
  account_id   = var.account_id
  project_name = cloudflare_pages_project.site.name
  name         = var.domain
}

resource "cloudflare_dns_record" "apex" {
  zone_id = var.zone_id
  name    = var.domain
  type    = "CNAME"
  content = cloudflare_pages_project.site.subdomain
  proxied = true
  ttl     = 1
}

resource "cloudflare_dns_record" "www" {
  zone_id = var.zone_id
  name    = "www.${var.domain}"
  type    = "CNAME"
  content = var.domain
  proxied = true
  ttl     = 1
}

# Media (reels, audio, 3D) — R2 has no egress fees.
resource "cloudflare_r2_bucket" "media" {
  account_id = var.account_id
  name       = "${var.project}-media"
}

# API data: counters + guestbook (D1), cache (KV). Used by worker/ from T19.
resource "cloudflare_d1_database" "api" {
  account_id = var.account_id
  name       = "${var.project}-api"
}

resource "cloudflare_workers_kv_namespace" "cache" {
  account_id = var.account_id
  title      = "${var.project}-cache"
}
