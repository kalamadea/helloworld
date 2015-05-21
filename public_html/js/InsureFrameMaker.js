/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var InsFrameCreator = {
    urls: {
        NS: '/PbInsuranceFrontend/znkd/ua.htm',
        OS: '/PbInsuranceFrontend/osgpo/ua.htm',
        NB: '/PbInsuranceFrontend/nbo/ua.htm',
        TI: '/PbInsuranceFrontend/tourist/ua.htm',
        FI: '/PbInsuranceFrontend/flight/ua.htm',
        events: '/PbInsuranceFrontend/mybid/ua.htm',
        my: '/PbInsuranceFrontend/myinsur/ua.htm'
    },
    createIFrame: function(obj) {
        var baseUrl = 'https://insur.privatbank.ua';
        try {
            var host = window.location.host;
            if ('localhost:8080' == host || '10.56.0.26:8080' == host) {
                baseUrl = 'http://' + host;
            }
        } catch (e) {
        }
        this.params = obj;
        $("iframe#" + (obj.id || "iframe_insure")).remove();
        var container = obj.container ? $(obj.container) : $("<div class='insure_container'></div>");
        container.css('minWidth', '700px');
        
        if (!obj.container) {
            $("body").append(container);
        }
        var src = "";
        if (obj.url) {
            src += (obj.url + "?");
        } else {
            src += (baseUrl+this.urls[obj.product] + "?");
        }

        for (k in obj.params) {
            var type = Object.prototype.toString.call(obj.params[k]).toLowerCase();
            if (type === "[object array]") {
                for (var i = 0; i < obj.params[k].length; i++) {
                    if (obj.params[k][i]) {
                        src += (k + "=" + obj.params[k][i] + "&");
                    }
                }
            } else {
                if (obj.params[k]) {
                    src += (k + "=" + obj.params[k] + "&");
                }
            }
        }
        $("<iframe/>", {id: obj.id || "iframe_insure", class: obj.cl || "test", src: src, scrolling: "no"
        }).appendTo(container).css(obj.style || {});
    },
    _validIframeParams: function() {

    },
    _listener: function(event) {
        if (!event.data)
            return;

        var iframeData = JSON.parse(event.data).data
                || {id: InsFrameCreator.params.id, height: event.data};
        if (!iframeData.id)
            return;

        var insureFrame = document.getElementById(InsFrameCreator.params.id);

        if (insureFrame == null) {
            return;
        }
        var insureIframeHeight = iframeData.height || 0;
        if (insureIframeHeight - InsFrameCreator._getBlockElementHeight(insureFrame) > 10)
            $(insureFrame).css('height', insureIframeHeight + 'px');
    },
    _addEvent: function(elem, evnt, func) {
        if (elem.addEventListener) { // W3C DOM
            elem.addEventListener(evnt, func, false);
        } else if (elem.attachEvent) { // IE DOM
            elem.attachEvent("on" + evnt, func);
        } else {
            elem["on" + evnt] = func;
        }
    },
    _getBlockElementHeight: function(el) {
        var height = parseInt(el.clientHeight || 0) +
                parseInt(el.style.paddingTop.replace(/[^\d]/gi, '') || 0) +
                parseInt(el.style.paddingBottom.replace(/[^\d]/gi, '') || 0) +
                parseInt(el.style.marginTop.replace(/[^\d]/gi, '') || 0);

        return height;
    }
};

if (window.insur_loader != null) {
    InsFrameCreator.createIFrame(window.insur_loader.params);
    InsFrameCreator._addEvent(window, "message", InsFrameCreator._listener);
};
