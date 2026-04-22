dev:
	@bash "$(PWD)/scripts/select-plugin-dev.sh" $(PLUGIN)

version:
	pnpm --filter './plugins/*' --filter './examples/*' exec -- npm version patch --no-git-tag-version

publish:
	pnpm run publish:plugins

.PHONY: dev version publish