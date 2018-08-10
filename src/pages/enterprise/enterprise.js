loader.define(function(require,exports,module) {

   
	router.$("#messageLink").on("click",function () {
        router.load({url:"pages/enterMessage/enterMessage.html"});
    })

    // $("#locationLink").on("click",function () {
    //     router.load({url:"pages/enterLocation/enterLocation.html"});
    // })
    router.$("#locationLink").on("click",function () {
        router.load({url:"pages/enterLocation/enterLocation.html"});
    })

    return {};
})