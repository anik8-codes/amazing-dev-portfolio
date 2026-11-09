variable "account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "zone_id" {
  description = "Cloudflare zone ID of the primary domain"
  type        = string
}

variable "domain" {
  description = "Primary domain (decision 1: anik8.codes; anik8.me will 301 here)"
  type        = string
  default     = "anik8.codes"
}

variable "project" {
  description = "Name used for the Pages project and resource prefixes"
  type        = string
  default     = "amazing-dev-portfolio"
}
