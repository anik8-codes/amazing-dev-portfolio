output "pages_subdomain" {
  value = cloudflare_pages_project.site.subdomain
}

output "d1_database_id" {
  value = cloudflare_d1_database.api.id
}

output "kv_namespace_id" {
  value = cloudflare_workers_kv_namespace.cache.id
}
