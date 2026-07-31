
# Valk vscode extension

A vscode extension for `valk` language text highlighting and language server support.

## Diagnostics

Diagnostics run when a Valk document is opened or saved by default. To enable
live diagnostics, choose **Valk: LSP Diagnostics Mode** in VS Code Settings or
add this to `settings.json`:

```json
{
  "valk.lsp.diagnosticsMode": "change"
}
```

Use `"save"` to switch back. Changes apply to a running language server without
requiring a restart.
