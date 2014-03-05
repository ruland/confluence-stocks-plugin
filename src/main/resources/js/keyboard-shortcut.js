//Hack to load i18n resource into frontend so it will work in the help dialog.
AJS.toInit(function($) {
    AJS.I18n.get("com.atlassian.confluence.plugins.confluence-stocks-plugin");
});