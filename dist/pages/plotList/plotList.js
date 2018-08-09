loader.define(function(require,exports,module) {

   
    router.$("#pmessLink").on("click",function () {
        router.load({ url: "pages/plotMessage/plotMessage.html", param: {} });
    })

    return {};
})