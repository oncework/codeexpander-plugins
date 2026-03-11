dev:
	@bash "$(PWD)/scripts/select-plugin-dev.sh" $(PLUGIN)

version:
	pnpm --filter './packages/plugin-*' exec -- npm version patch --no-git-tag-version

publish:
	pnpm run publish:plugins

.PHONY: dev version publish