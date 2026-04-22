# @codeexpander/plugin-types

Shared TypeScript types for CodeExpander plugins.

## Contents

- **Window bridge**: `Window.__codeexpander_initial_payload` and `Window.__codeexpander` (writeClipboard, showToast) used when plugins run inside the CodeExpander host.

## Usage

In a plugin:

1. Add dependency: `"@codeexpander/plugin-types": "workspace:*"` (or publish and use version).
2. In `src/global.d.ts`: `/// <reference types="@codeexpander/plugin-types" />`

Types are then available globally in that plugin (e.g. `window.__codeexpander?.showToast?.("ok")`).
