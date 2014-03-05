/**
 * Autocomplete dropdown appears when you press a trigger character in the editor.
 */
(function($) {
    AJS.EventQueue = AJS.EventQueue || [];

    function activateStock() {
        AJS.EventQueue.push({name: 'confluencestockinsert'});
        Confluence.Editor.Autocompleter.Manager.shortcutFired("$", true);
    }

    function isDollarKey(event) {
        return event &&
            event.shiftKey &&
            !event.ctrlKey && !event.altKey && !event.altGraphKey && !event.metaKey &&
            event.which === 36;
    }

    tinymce.create('tinymce.plugins.InsertStock', {

        init : function(ed) {

            $('#insertstock-button').click(function(evt){
                evt.stopPropagation();
                evt.preventDefault();

                var inputDrivenDropdown = Confluence.Editor.Autocompleter.Manager.getInputDrivenDropdown();
                if (!inputDrivenDropdown || inputDrivenDropdown.inactive) {
                    tinymce.execCommand('mceFocus',false, ed.id);
                    activateStock();
                }
            });

            AJS.bind('editor.text-placeholder.activated', function(e, data) {
                if(data && data.placeholderType === "stock") {
                    if(isDollarKey(data.triggerEvent)) {
                        // Avoid 2nd #
                        tinymce.dom.Event.cancel(data.triggerEvent);
                    }
                    activateStock();
                }
            });

            if(AJS.Rte.Placeholder && AJS.Rte.Placeholder.addPlaceholderType)
                AJS.Rte.Placeholder.addPlaceholderType({
                    type: 'stock',
                    label: AJS.I18n.getText("property.panel.textplaceholder.display.stock"),
                    tooltip: AJS.I18n.getText("property.panel.textplaceholder.display.stock.tooltip")
                });
        },

        getInfo : function() {
            return {
                longname : 'Insert Stock Quote',
                author : 'Atlassian',
                authorurl : 'http://www.atlassian.com',
                version : tinymce.majorVersion + "." + tinymce.minorVersion
            };
        }
    });

    tinymce.PluginManager.add('insertstock', tinymce.plugins.InsertStock);
})(AJS.$);

AJS.Rte.BootstrapManager.addTinyMcePluginInit(function(settings) {
    settings.plugins += ",insertstock";
});