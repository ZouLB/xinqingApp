loader.define(function(require,exports,module) {
    var pageview = {};
    
    pageview.bind = function () {
        onInput({
            id: ".user-input",
            callback: function () {// 点击删除按钮清空
                $(".user-input input").val('');
                $(this).hide();
            }
        })

        onInput({
            id: ".password-input",
            callback: function () {
                $("#password").val('');
                $(this).hide();
            }
        })
    }

    pageview.init = function () {
        this.bind();// 绑定事件
    }

    // 监听输入事件
    function onInput(opt) {
        var opt = opt || {};
            opt.id = opt.id || "";
            opt.target = opt.target || "input";
            opt.event = opt.event || "keyup";
            opt.icon = opt.icon || "icon-remove";
            opt.onInput = opt.onInput || function () {};
            opt.callback = opt.callback || function () {};

        if( opt.id == "" || opt.id === null ){
            return;
        }
        var $id = $(opt.id),
            $target = $id.find(opt.target),
            iconClass = '.'+opt.icon;

        // 输入框监听延迟执行
        $target.on(opt.event,bui.unit.debounce(function () {
            var val = $(this).val(),
                $btnRemove = $id.find(iconClass);
            if(val.length > 0){
                if( $btnRemove && $btnRemove.length ){
                    $btnRemove.css("display","block");
                }else{
                    $id.append('<i class="iconfont '+opt.icon+'"></i>');
                    $btnRemove = $target.find(iconClass);
                }
            }else{
                $btnRemove && $btnRemove.css("display","none");
            }

            opt.onInput && opt.onInput.call(this,val);
        },100))

        // 图标点击事件
        $id.on("click",iconClass,function () {
            opt.callback && opt.callback.call(this);
        })
    }

    window.encryptRSA = function (word) {
        var jse = new JSEncrypt();
        jse.setPublicKey('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCTm1CB1pdYNA7SNm8VsrZcc3LvuUZEwKluQTAi\n' +
            'a5DQ147BZnIDPNTGUIRzevDYZ1pEAM7sgPhc+C8ixcoGV/ld6PCS0XazOG3VtMTAwwO0s2/fHU3K\n' +
            'CBmOKrsuOtOVpIpgJY9qouZ+J3c8BXFfip+VUysdp8WKv7G4b67y7pxNHQIDAQAB');
        let encrypted = jse.encrypt(word);
        return encrypted;
    };

    var base = "http://bi.projects.bingosoft.net:8081/xinqing/";

    //封装POST方法
    function buiPost(api,params,callBack){
        bui.ajax({
            contentType: 'application/json;charset=UTF-8',
            method: 'POST',
            url: base+api,
            data: JSON.stringify(params),
            async: false
        }).then(function(res){
            callBack(res);
        },function(res,status){
            console.log(status);
        })
    }


    var storage = bui.storage();
    if(storage.get("user")[0]){
        $('#user').val(storage.get("user")[0])
    }

    $(".loginSubmit").on("click",function(){
        let user = $('#user').val();
        let pass = encryptRSA($('#password').val());
        buiPost("login",{userId: user, password: pass},function(res){
            if(res.code===200 && res.data.user){
                if(res.data.user.roles[0]!=="1"){
                    bui.hint({ 
                        content:"该账号没有权限访问，请联系管理员", 
                        position:"top",
                    });
                }else{
                    storage.set("user",res.data.user.userId);
                    storage.set("userName",res.data.user.userName);
                    router.load({url:"pages/main/main.html"});
                }
            }else{
                bui.hint({ 
                    content:res.message, 
                    position:"top",
                });
            }
        })
    });

    pageview.init();// 初始化

    return {};// 输出模块
})