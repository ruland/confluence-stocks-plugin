
/**
 * Settings that each Autocomplete will be initialized on, depending on the trigger character used to activate the
 * autocomplete.
 */
AJS.Rte.BootstrapManager.addOnInitCallback(function() {

    function makeLinkTag(link, price, diff) {
        link2 = link.name + " <b>" + price + "</b> [" + diff + "]";
        return Confluence.Link.fromData({
            attrs: {
                href: "http://finance.yahoo.com/q?s=" + link.href
            },
            body: {
                html: link2,
                text: link2
            },
            classes: ["stocks"]
        });
    }

    Confluence.Editor.Autocompleter.Settings["$"] = {

        ch : "$",
        endChars : [],
        cache: false,

        dropDownClassName: "autocomplete-stock",
        selectFirstItem: true,

        getHeaderText : function (autoCompleteControl, value) {
            if (value)
            {
                return AJS.I18n.getText("editor.autocomplete.stock.header.text");
            }
            else
            {
                return AJS.I18n.getText("editor.autocomplete.stock.header.text.hint");
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
                //{"totalSize":0,"result":[],"group":[{"name":"userinfo","result":[{"id":"589825","type":"user","title":"admin","wikiLink":"[~admin]","createdDate":{"friendly":"﻿Jan 06, 2012⚡date.friendly.formatted⚡{0}⁠","date":"2012-01-06T13:33:40+0100"},"creator":{"links":[{"href":"http://roelands-mbp.ams.atlassian.com:1990/confluence/rest/prototype/1/user/system/anonymous","rel":"self"}],"avatarUrl":"/confluence/s/en_GB-1988229788/4395/NOCACHE1/_/images/icons/profilepics/anonymous.png","anonymous":true,"displayName":"﻿Anonymous⚡anonymous.name⁠"},"lastModifier":{"links":[{"href":"http://roelands-mbp.ams.atlassian.com:1990/confluence/rest/prototype/1/user/system/anonymous","rel":"self"}],"avatarUrl":"/confluence/s/en_GB-1988229788/4395/NOCACHE1/_/images/icons/profilepics/anonymous.png","anonymous":true,"displayName":"﻿Anonymous⚡anonymous.name⁠"},"username":"admin","thumbnailLink":{"href":"http://roelands-mbp.ams.atlassian.com:1990/confluence/images/icons/profilepics/default.png","type":"image/png","rel":"thumbnail"},"link":[{"href":"http://roelands-mbp.ams.atlassian.com:1990/confluence/display/~admin","type":"text/html","rel":"alternate"},{"href":"http://roelands-mbp.ams.atlassian.com:1990/confluence/spaces/flyingpdf/pdfpageexport.action?pageId=589825","type":"application/pdf","rel":"alternate"},{"href":"http://roelands-mbp.ams.atlassian.com:1990/confluence/rest/prototype/1/content/589825","rel":"self"}]}]}]}
                var search = [];
                if (data.ResultSet.Result == null) {
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
            var linkTag;
            var symbol = link.href;
            var quote = encodeURIComponent("select * from yahoo.finance.quotes where symbol in ('" + symbol + "')");
            var url = "http://query.yahooapis.com/v1/public/yql?q=" + quote + "&format=json&diagnostics=true&env=http://datatables.org/alltables.env";
            AJS.$.ajax({
                type: "GET",
                dataType: "json",
                url: url,
                success: function(data) {
                    if (data.query.results == null) {
                        diff = "error"; price = "error";
                        linkTag = makeLinkTag(link, price, diff);
                        linkTag.insert();
                    } else {
                        stockname = data.query.results.quote;
                        price = stockname.LastTradePriceOnly;
                        diff = stockname.Change_PercentChange;
                        linkTag = makeLinkTag(link, price, diff);
                        linkTag.insert();
                    }
                },
                error: function(xhr, textStatus, errorThrown) {
                    diff = "error"; price = "error";
                    linkTag = makeLinkTag(link, price, diff);
                    linkTag.insert();
                }
            });

        }
    }

});