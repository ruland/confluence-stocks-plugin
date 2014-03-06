
/**
 * Settings that each Autocomplete will be initialized on, depending on the trigger character used to activate the
 * autocomplete.
 */
AJS.Rte.BootstrapManager.addOnInitCallback(function() {

    function makeLinkTag(link) {
        return Confluence.Link.fromData({
            attrs: {
                href: "http://finance.yahoo.com/q?s=" + link.href
            },
            body: {
                html: link.name,
                text: link.name
            },
            classes: ["stocks"]
        });
    }

    Confluence.Editor.Autocompleter.Settings["$"] = {

        ch : "$",
        endChars : [],
        cache: false,

        dropDownClassName: "autocomplete-stocks",
        selectFirstItem: true,

        getHeaderText : function (autoCompleteControl, value) {
            if (value)
            {
                return AJS.I18n.getText("editor.autocomplete.stocks.header.text");
            }
            else
            {
                return AJS.I18n.getText("editor.autocomplete.stocks.header.text.hint");
            }
        },

        getAdditionalLinks : function (autoCompleteControl, value, callback) {
            var additionalLinks = [];
            callback(value, additionalLinks);
            return additionalLinks;
        },

        getDataAndRunCallback : function(autoCompleteControl, val, callback) {

            var xhr = AJS.$.ajax({
                    type: "GET",
                    dataType: "jsonp",
                    jsonp: "callback",
                    jsonpCallback: "YAHOO.Finance.SymbolSuggest.ssCallback",
                    data: {
                        query: val
                    },
                    cache: true,
                    url: "http://autoc.finance.yahoo.com/autoc"
            });

            var YAHOO = window.YAHOO = {Finance: {SymbolSuggest: {}}};

            xhr.done(YAHOO.Finance.SymbolSuggest.ssCallback = function(data){
                var search = [];
                if (data.ResultSet.Result.length === 0) {
                    callback([[{name : val, href : "http://finance.yahoo.com/q?s=" + val}]], val, function(){});
                } else {
                    for (var i = 0; i <= 4; i++) {
                        search.push([{name : data.ResultSet.Result[i].symbol + " (" + data.ResultSet.Result[i].name + ")", href : data.ResultSet.Result[i].symbol}]);
                    }
                    callback(search, val, function(){});
                }
            });

        },

        update : function(autoCompleteControl, link) {
            linkTag = makeLinkTag(link);
            linkTag.insert();
        }
    }

});