# CodeExpander Plugins - Common Commands
# Usage: make <target> [PLUGIN=<name>]

# Install all dependencies
install:
	@pnpm install

# Start dev server for a plugin (interactive if PLUGIN is not set)
# Usage: make dev PLUGIN=plugin-text
dev:
	@bash "$(PWD)/scripts/select-plugin-dev.sh" $(PLUGIN)

# Build all plugins
build:
	@pnpm run build:plugins

# Build third-party plugins (interactive if PLUGIN is not set)
# Usage: make build-third-party PLUGIN=blockbench,drawio
build-third-party:
	@node "$(PWD)/scripts/build-third-party-plugins.mjs" $(if $(PLUGIN),--plugin=$(PLUGIN))

# List all third-party plugins
list-third-party:
	@node "$(PWD)/scripts/build-third-party-plugins.mjs" --list

# Publish all plugins at once
publish:
	@pnpm run publish:plugins

# Publish plugins one by one (interactive)
# Usage: make publish-plugin PLUGIN=blockbench
publish-plugin:
	@node "$(PWD)/scripts/publish-plugins.mjs" $(if $(PLUGIN),--plugin=$(PLUGIN))

# List all publishable plugins
list-plugins:
	@node "$(PWD)/scripts/publish-plugins.mjs" --list

# Bump patch version for all plugins
version:
	@pnpm --filter './plugins/*' --filter './examples/*' --filter './third-party/*' exec -- npm version patch --no-git-tag-version

# Run linter across all packages
lint:
	@pnpm -r run lint 2>/dev/null || true

# Clean dist folders for all plugins
clean:
	@pnpm --filter './plugins/*' --filter './examples/*' --filter './third-party/*' exec -- rm -rf dist

# Create a new plugin (interactive)
create:
	@pnpm run create

# Run tests (if available)
test:
	@pnpm -r run test 2>/dev/null || echo "No tests found"

.PHONY: install dev build build-third-party list-third-party publish publish-plugin list-plugins version lint clean create test
