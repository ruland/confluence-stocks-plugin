AJS.toInit(function($) {
    // Add the shortcut to the shortcuts dialog
    Confluence.KeyboardShortcuts && Confluence.KeyboardShortcuts.Autoformat.push(
        {
            action: "$",
            context: "autoformat.autocomplete",
            description: AJS.I18n.getText("keyboard.shortcuts.autoformat.autocomplete.stock")
        });
});