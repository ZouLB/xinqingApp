loader.define(function(require,exports,module) {

   
	router.$("#plistLink").on("click",function () {
		router.load({url:"pages/plotList/plotList.html"});
        // router.loadPart({ id:"#partList", url: "pages/plotList/plotList.html", param: {} });
    })

    return {};
})