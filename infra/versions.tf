terraform {
  required_version = ">= 1.8"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }

  # Remote state in a Cloudflare R2 bucket (S3-compatible, free tier).
  # Bootstrap once by hand: create bucket `tofu-state` + an R2 API token.
  # CI passes the endpoint: -backend-config="endpoints={s3=\"https://<account_id>.r2.cloudflarestorage.com\"}"
  # and the token as AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.
  backend "s3" {
    bucket                      = "tofu-state"
    key                         = "amazing-dev-portfolio/terraform.tfstate"
    region                      = "auto"
    use_path_style              = true
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_metadata_api_check     = true
    skip_s3_checksum            = true
  }
}

provider "cloudflare" {
  # Reads CLOUDFLARE_API_TOKEN from the environment.
}
