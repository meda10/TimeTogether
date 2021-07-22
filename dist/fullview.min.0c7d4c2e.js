// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/fullview/dist/fullview.min.js":[function(require,module,exports) {
/**
 * fullView v1.1.2
 */

/*!
 * https://github.com/seeratawan01/fullview.js
 *
 * @license GPLv3 for open source use only
 *
 * Copyright (C) 2020 https://github.com/seeratawan01/fullview.js/blob/master/LICENSE
 */
!function(n,o,r,l){var s="fullView";function i(t,i){this._defaults=n.fn.fullView.defaults,this.options=n.extend({},this._defaults,i),this.mainView=n(t),this.views=n(t).children(),this._name=s,this.currentView=0,this.previousView=0,this.isScrolling=!1,this.isProgress=!1,this.offsets=[],this.$dotsElement=null,this.$navbar=null,this.$anchors={},this.lastY=null,this.lastX=null,this.init()}n.extend(i.prototype,{init:function(){this.buildCache(),this.utilites(),this.settingUp(),this.bindEvents()},destroy:function(){this.unbindEvents(),this.$views.removeData()},buildCache:function(){this.$window=n(o),this.$document=n(r),this.$htmlBody=n("html, body"),this.$views=n(this.views),this.options.navbar!==l&&"string"==typeof this.options.navbar&&n(this.options.navbar).length&&(this.$navbar=n(this.options.navbar))},utilites:function(){this.createDots=function(){var t=n("#fv-dots");t.length&&t.remove();var s,e=n("<div>").attr("id","fv-dots").append("<ul>");return!0===this.options.dotsTooltips?(s=this).$views.each(function(t){var i=s.$views.eq(t).attr("data-tooltip")?s.$views.eq(t).attr("data-tooltip"):null;i?e.find("ul").append('<li class="fv-tooltip"><a data-scroll="'+t+'" href="#" class=""><span></span></a><span class="fv-tooltiptext">'+i+"</span></li>"):e.find("ul").append('<li class="fv-tooltip"><a data-scroll="'+t+'" href="#" class=""><span></span></a></li>')}):this.$views.each(function(t){e.find("ul").append('<li><a data-scroll="'+t+'" href="#" class=""><span></span></a></li>')}),"right"!==this.options.dotsPosition&&(e.css({left:"4%"}),e.find(".fv-tooltip .fv-tooltiptext").css({right:"unset",left:"105%"}),e.find(".fv-tooltip").addClass("fv-tooltip-left")),n("body").append(e),e.find("a")},this.changeActiveStatus=function(t){this.$views.removeClass("active").eq(t).addClass("active"),this.options.dots&&this.$dotsElement.removeClass("active").eq(t).addClass("active"),this.$anchors.length&&this.$anchors.removeClass("active").filter('[data-scroll="'+t+'"]').addClass("active")},this.scrollTo=function(t,i){var s=this;t=parseInt(t),this.offsets[t]!==l&&"number"==typeof t?(this.isProgress=!0,this.previousView=this.currentView===t?this.previousView:this.currentView,this.currentView=t,i===l&&(this.previousView>this.currentView?i="up":this.previousView<this.currentView&&(i="down")),this.callback("onScrollStart",{destination:t,current:this.previousView,direction:i}),this.$htmlBody.stop(!0).animate({scrollTop:this.offsets[t].offset},{easing:n.easing[this.options.easing]?this.options.easing:"linear",duration:this.options.speed}).promise().then(function(){s.changeActiveStatus(t),!0===s.isScrolling&&setTimeout(function(){s.isScrolling=!1},s.options.speed+320),this.isProgress=!1,s.callback("onScrollEnd",{direction:i})})):console.warn("The View You Want To Scroll To Does not Exist!")},this.scrollByWheel=function(t){n(":animated").length||this.isScrolling||(this.isScrolling=!0,0<t.originalEvent.wheelDelta||t.originalEvent.detail<0?this.scrollUp():this.scrollDown())},this.scrollDown=function(){var t="down";return this.currentView<this.$views.length-1?(this.previousView=this.currentView,this.currentView++,this.scrollTo(this.currentView,t)):this.currentView===this.$views.length-1&&(this.isScrolling=!1,this.options.backToTop&&(this.isScrolling=!0,this.previousView=this.currentView,this.currentView=0,this.scrollTo(this.currentView,t))),this},this.scrollUp=function(){return 0<this.currentView?(this.previousView=this.currentView,this.currentView--,this.scrollTo(this.currentView,"up")):0===this.currentView&&(this.isScrolling=!1),this}},settingUp:function(){var s,t,i=this.$window.height();this.$views.css({height:i}),this.currentView=0,this.isScrolling=!1,r.body.scrollTop=0,r.documentElement.scrollTop=0,"number"!=typeof this.options.speed?(this.options.speed=500,console.warn("Speed Should be of Type Number")):this.options.speed<=300&&(this.options.speed=300,console.warn("Min Speed is 350 miliseconds")),this.offsets.splice(0,this.offsets.length),this.$views.each(function(t){var i=this.$views.eq(t).attr("id"),s=this.$views.eq(t).offset().top;this.offsets.push({position:t,anchor:i,offset:s})}.bind(this)),null!==this.$navbar&&(s=this.$navbar,t="a[href='"+this.offsets.filter(function(t){if(t.anchor===l)return!1;var i=s.find('a[href="#'+t.anchor+'"]');return i.length&&i.attr("data-scroll",t.position),!0}).map(function(t){return"#"+t.anchor}).join("'], a[href='")+"']",this.$anchors=this.$navbar.find(t)),this.options.dots&&(this.$dotsElement=this.createDots());var e,n,o=this.$views.filter('[class="active"]');o.length&&(e=o.eq(0).offset().top,n=this.offsets.filter(function(t){return t.offset===e}),this.currentView=n[0].position,this.previousView=this.currentView,r.body.scrollTop=e,r.documentElement.scrollTop=e),this.options.dots&&(this.$dotsElement=this.createDots()),this.changeActiveStatus(this.currentView)},bindEvents:function(){var e=this;e.$window.on("resize."+e._name,e.settingUp.bind(e)),null!==e.$dotsElement&&e.$dotsElement.on("click."+e._name,function(t){t.preventDefault(),n(":animated").length||(e.previousView=e.currentView,e.currentView=parseInt(n(this).attr("data-scroll")),e.scrollTo(e.currentView))}),e.$anchors!==l&&0<e.$anchors.length&&e.$anchors.on("click."+e._name,function(t){t.preventDefault(),n(":animated").length||(e.previousView=e.currentView,e.currentView=parseInt(n(this).attr("data-scroll")),e.scrollTo(e.currentView))}),e.options.mouseScrolling&&e.$window.on("DOMMouseScroll mousewheel."+e._name,function(t){var i=t||o.event;"INPUT"!=(i.target||i.srcElement).tagName.toUpperCase()&&e.scrollByWheel(i)}),e.options.keyboardScrolling&&e.$document.on("keydown."+e._name,function(t){var i=t||o.event;if("INPUT"!=(i.target||i.srcElement).tagName.toUpperCase()&&(!n(":animated").length&&!e.isScrolling))switch(i.keyCode?i.keyCode:i.which){case 40:e.scrollDown();break;case 38:case 33:e.scrollUp();break;case 34:e.scrollDown()}}),e.$views.on("touchstart."+e._name,function(t){e.lastY=t.originalEvent.touches[0].clientY,e.lastX=t.originalEvent.touches[0].clientX}),e.options.touchScrolling&&e.$views.on("touchend."+e._name,function(t){var i,s=t||o.event;"INPUT"!=(s.target||s.srcElement).tagName.toUpperCase()&&(i=s.originalEvent.changedTouches[0].clientY,s.originalEvent.changedTouches[0].clientX<e.lastX||e.lastX,e.lastY>i+25?e.scrollDown():e.lastY<i-25&&e.scrollUp())})},unbindEvents:function(){this.$window.off("."+this._name),this.$document.off("."+this._name),this.$views.off("."+this._name)},callback:function(t,i){var s=this.options.onScrollStart,e=this.options.onScrollEnd;"function"==typeof e&&"onScrollEnd"===t&&e(this.$views.eq(this.currentView),this.$views.eq(this.previousView),i.direction),"function"==typeof s&&"onScrollStart"===t&&s(this.$views.eq(i.current),this.$views.eq(i.destination),i.direction)}}),n.fn.fullView=function(t){return t===l||"object"==typeof t?this.each(function(){n.data(this,s)||n.data(this,s,new i(this,t))}):this},n.fn.fullView.defaults={navbar:l,dots:!0,dotsPosition:"right",dotsTooltips:!1,easing:"linear",backToTop:!1,speed:500,keyboardScrolling:!0,mouseScrolling:!0,touchScrolling:!0,onScrollEnd:null,onScrollStart:null}}(jQuery,window,document);


},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "38033" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","node_modules/fullview/dist/fullview.min.js"], null)
//# sourceMappingURL=/fullview.min.0c7d4c2e.js.map