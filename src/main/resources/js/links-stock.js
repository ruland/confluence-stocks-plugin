AJS.toInit(function($) {
	AJS.$('a[href*="finance.yahoo.com"]').addClass("stocks aui-lozenge aui-lozenge-subtle");

  window.setInterval(function(){
  		/// 
      AJS.$.each($(".stocks").get(), function(i, item) {
        var symbol = item.href.substr(29);
        var quote = encodeURIComponent("select * from yahoo.finance.quotes where symbol in ('" + symbol + "')");
        var url = "http://query.yahooapis.com/v1/public/yql?q=" + quote + "&format=json&diagnostics=true&env=http://datatables.org/alltables.env";
        AJS.$.ajax({
          type: "GET",
          dataType: "json",
          url: url,
          success: function(data) {
            stock = data.query.results.quote;
            price = stock.LastTradePriceOnly;
            percent = stock.Change_PercentChange;
            item.innerHTML = symbol + " <b>" + price + "</b> [" + percent + "]";
            if (percent.charAt(0) == "+") {
              item.className = "stocks aui-lozenge aui-lozenge-success aui-lozenge-subtle";
            } else {
              item.className = "stocks aui-lozenge aui-lozenge-error aui-lozenge-subtle";
            }
          }  
        });
      });  
	}, 60000);
});