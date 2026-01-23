# ============================================
# Makefile for Link-It Docker Operations
# ============================================
# Run 'make help' to see available targets

# Variables - centralize compose invocation
COMPOSE := docker compose
BASE := -f docker-compose.yml

# Environment-specific configurations
DEV := $(BASE) -f docker-compose.dev.yml
STAGING := $(BASE) -f docker-compose.staging.yml -p linkit-staging
PROD := $(BASE) -f docker-compose.prod.yml -p linkit-prod

# Default env files (can be overridden)
STAGING_ENV_FILE ?= .env.staging
PROD_ENV_FILE ?= .env.prod

# Default port for smoke test
PORT ?= 3000

# ============================================
# Help
# ============================================
.PHONY: help
help: ## Show this help
	@echo "Link-It Docker Operations"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Examples:"
	@echo "  make dev           Start development environment"
	@echo "  make staging       Start staging (port 3001)"
	@echo "  make prod          Start production (port 3000)"
	@echo "  make build         Build production image"
	@echo "  make logs          Follow container logs"

# ============================================
# Environment Validation
# ============================================
.PHONY: check-env check-env-build check-env-staging check-env-prod

check-env: ## Validate all environment variables (default .env)
	@./scripts/check-env.sh all

check-env-build: ## Validate build-time vars only
	@./scripts/check-env.sh build

check-env-staging: ## Validate staging environment
	@./scripts/check-env.sh all --env-file $(STAGING_ENV_FILE)

check-env-prod: ## Validate production environment
	@./scripts/check-env.sh all --env-file $(PROD_ENV_FILE)

# ============================================
# Build
# ============================================
.PHONY: build

build: check-env-build ## Build production image (runs check-env first)
	$(COMPOSE) $(BASE) build \
		--build-arg BUILD_SHA=$$(git rev-parse --short HEAD 2>/dev/null || echo "unknown") \
		--build-arg BUILD_TIMESTAMP=$$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# ============================================
# Development
# ============================================
.PHONY: dev dev-down

dev: ## Start development environment
	$(COMPOSE) $(DEV) up

dev-down: ## Stop development environment
	$(COMPOSE) $(DEV) down

# ============================================
# Staging
# ============================================
.PHONY: staging staging-down staging-restart

staging: ## Start staging (runs check-env first)
	@./scripts/check-env.sh runtime --env-file $(STAGING_ENV_FILE)
	$(COMPOSE) $(STAGING) --env-file $(STAGING_ENV_FILE) up -d
	@$(MAKE) smoke-test PORT=3001

staging-down: ## Stop staging environment
	$(COMPOSE) $(STAGING) down

staging-restart: staging-down staging ## Restart staging environment

# ============================================
# Production
# ============================================
.PHONY: prod prod-down prod-restart

prod: ## Start production (runs check-env first)
	@./scripts/check-env.sh runtime --env-file $(PROD_ENV_FILE)
	$(COMPOSE) $(PROD) --env-file $(PROD_ENV_FILE) up -d
	@$(MAKE) smoke-test PORT=3000

prod-down: ## Stop production environment
	$(COMPOSE) $(PROD) down

prod-restart: prod-down prod ## Restart production environment

# ============================================
# Smoke Test
# ============================================
.PHONY: smoke-test

smoke-test: ## Health check after startup (PORT=3000)
	@echo "Waiting for health check on port $(PORT)..."
	@for i in 1 2 3 4 5 6 7 8 9 10; do \
		if curl -fsS http://localhost:$(PORT)/api/v1/health > /dev/null 2>&1; then \
			echo "Health check passed!"; \
			curl -s http://localhost:$(PORT)/api/v1/health | head -c 200; \
			echo ""; \
			exit 0; \
		fi; \
		echo "  Attempt $$i/10 - waiting..."; \
		sleep 3; \
	done; \
	echo "Health check failed after 10 attempts"; \
	exit 1

# ============================================
# Operations
# ============================================
.PHONY: down logs shell ps

down: ## Stop all containers (all environments)
	-$(COMPOSE) $(DEV) down 2>/dev/null
	-$(COMPOSE) $(STAGING) down 2>/dev/null
	-$(COMPOSE) $(PROD) down 2>/dev/null
	-$(COMPOSE) $(BASE) down 2>/dev/null

logs: ## Follow container logs (default environment)
	$(COMPOSE) $(BASE) logs -f

logs-staging: ## Follow staging container logs
	$(COMPOSE) $(STAGING) logs -f

logs-prod: ## Follow production container logs
	$(COMPOSE) $(PROD) logs -f

shell: ## Shell into running container (default environment)
	$(COMPOSE) $(BASE) exec link-it /bin/sh

ps: ## Show running containers
	@echo "=== Default/Base ==="
	-@$(COMPOSE) $(BASE) ps 2>/dev/null || true
	@echo ""
	@echo "=== Staging ==="
	-@$(COMPOSE) $(STAGING) ps 2>/dev/null || true
	@echo ""
	@echo "=== Production ==="
	-@$(COMPOSE) $(PROD) ps 2>/dev/null || true

# ============================================
# Cleanup
# ============================================
.PHONY: clean clean-all

clean: ## Remove containers and volumes
	-$(COMPOSE) $(DEV) down -v 2>/dev/null
	-$(COMPOSE) $(STAGING) down -v 2>/dev/null
	-$(COMPOSE) $(PROD) down -v 2>/dev/null
	-$(COMPOSE) $(BASE) down -v 2>/dev/null

clean-all: clean ## Remove images, containers, and volumes
	-docker rmi link-it-link-it 2>/dev/null
	-docker rmi linkit-staging-link-it 2>/dev/null
	-docker rmi linkit-prod-link-it 2>/dev/null
	@echo "Cleaned up images and volumes"
