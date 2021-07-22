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
})({"node_modules/fullview/dist/fullview.js":[function(require,module,exports) {
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
; (function ($, window, document, undefined) {

    var fullView = 'fullView';

    // Create the plugin constructor
    function FullView(views, options) {

        this._defaults = $.fn.fullView.defaults;

        this.options = $.extend({}, this._defaults, options);
        this.mainView = $(views);
        this.views = $(views).children();

        this._name = fullView;

        this.currentView = 0;
        this.previousView = 0;
        this.isScrolling = false;
        this.isProgress = false;
        this.offsets = [];
        this.$dotsElement = null;
        this.$navbar = null;
        this.$anchors = {};
        this.lastY = null;
        this.lastX = null;

        this.init();

    }

    // Avoid FullView.prototype conflicts
    $.extend(FullView.prototype, {

        // Initialization logic
        init: function () {

            this.buildCache();
            this.utilites();
            this.settingUp();
            this.bindEvents();
        },

        // Remove plugin instance completely
        destroy: function () {
            this.unbindEvents();
            this.$views.removeData();
        },

        // Cache DOM nodes for performance
        buildCache: function () {

            this.$window = $(window);
            this.$document = $(document);
            this.$htmlBody = $("html, body");

            this.$views = $(this.views);

            if (this.options.navbar !== undefined && typeof this.options.navbar === 'string') {

                if ($(this.options.navbar).length) {
                    this.$navbar = $(this.options.navbar)
                }
            }

        },

        utilites: function () {
            this.createDots = function createDots() {
                var $dots = $("#fv-dots");
                if ($dots.length) {
                    $dots.remove();
                }
                var div = $("<div>").attr("id", "fv-dots").append('<ul>');

                if (this.options.dotsTooltips === true) {
                    var plugin = this;
                    this.$views.each(function (i) {
                        var tooltipTitle = plugin.$views.eq(i).attr('data-tooltip') ? plugin.$views.eq(i).attr('data-tooltip') : null;
                        if (tooltipTitle) {
                            div.find('ul').append('<li class="fv-tooltip"><a data-scroll="' + i + '" href="#" class=""><span></span></a><span class="fv-tooltiptext">' + tooltipTitle + '</span></li>')
                        } else {
                            div.find('ul').append('<li class="fv-tooltip"><a data-scroll="' + i + '" href="#" class=""><span></span></a></li>')
                        }
                    });
                } else {
                    this.$views.each(function (i) {
                        div.find('ul').append('<li><a data-scroll="' + i + '" href="#" class=""><span></span></a></li>')
                    });
                }


                if (this.options.dotsPosition !== 'right') {
                    div.css({
                        left: '4%'
                    });

                    div.find('.fv-tooltip .fv-tooltiptext').css({
                        right: 'unset',
                        left: '105%'
                    })

                    div.find('.fv-tooltip').addClass('fv-tooltip-left');

                }


                $('body').append(div);

                return div.find('a');
            };

            this.changeActiveStatus = function changeActiveStatus($view) {
                this.$views.removeClass('active').eq($view).addClass('active');
                if (this.options.dots) {
                    this.$dotsElement.removeClass('active').eq($view).addClass('active')
                }
                if (this.$anchors.length) {
                    this.$anchors.removeClass('active').filter('[data-scroll="' + $view + '"]').addClass('active')
                }
            }

            this.scrollTo = function scrollTo($view, dir) {

                var plugin = this;

                $view = parseInt($view);

                if (this.offsets[$view] !== undefined && typeof $view === 'number') {
                    this.isProgress = true;
                    this.previousView = this.currentView === $view ? this.previousView : this.currentView;
                    this.currentView = $view;

                    if (dir === undefined) {
                        if (this.previousView > this.currentView) {
                            dir = "up"
                        } else if (this.previousView < this.currentView) {
                            dir = "down"
                        }
                    }

                    // Event OnScrollStart
                    this.callback("onScrollStart", {
                        destination: $view,
                        current: this.previousView,
                        direction: dir
                    });

                    this.$htmlBody.stop(true).animate(
                        {
                            scrollTop: this.offsets[$view].offset
                        }, {
                        easing: $.easing[this.options.easing] ? this.options.easing : 'linear',
                        duration: this.options.speed
                    }).promise().then(function () {
                        plugin.changeActiveStatus($view);
                        if (plugin.isScrolling === true) {
                            setTimeout(function () {
                                plugin.isScrolling = false;
                            }, plugin.options.speed + 320);
                        }
                        this.isProgress = false;
                        // Event OnScrollEnd
                        plugin.callback("onScrollEnd", {
                            direction: dir
                        });
                    });
                } else {
                    console.warn("The View You Want To Scroll To Does not Exist!")
                }

            }

            this.scrollByWheel = function scrollByWheel(event) {

                // Check if Already scrolling
                if (!$(':animated').length && !this.isScrolling) {
                    this.isScrolling = true;
                    if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
                        // scroll up
                        this.scrollUp();
                    }
                    else {
                        // scroll down
                        this.scrollDown();
                    }
                }
            }

            this.scrollDown = function scrollDown() {
                var dir = "down";
                if (this.currentView < this.$views.length - 1) {
                    this.previousView = this.currentView;
                    this.currentView++;
                    this.scrollTo(this.currentView, dir);
                }
                else if (this.currentView === this.$views.length - 1) {
                    this.isScrolling = false;
                    if (this.options.backToTop) {
                        this.isScrolling = true;
                        this.previousView = this.currentView;
                        this.currentView = 0;
                        this.scrollTo(this.currentView, dir);
                    }
                }
                return this;
            }

            this.scrollUp = function scrollUp() {
                var dir = "up";
                if (this.currentView > 0) {
                    this.previousView = this.currentView;
                    this.currentView--;
                    this.scrollTo(this.currentView, dir);
                } else if (this.currentView === 0) {
                    this.isScrolling = false;
                }
                return this;
            }
        },

        settingUp: function () {
            var vh = this.$window.height();
            // var vw = this.$window.width();

            // Setting Viewport
            this.$views.css({
                height: vh,
                // width: vw
            });
            this.currentView = 0;
            this.isScrolling = false;
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;

            if (typeof this.options.speed !== 'number') {
                this.options.speed = 500;
                console.warn("Speed Should be of Type Number")
            } else {

                if (this.options.speed <= 300) {
                    this.options.speed = 300;
                    console.warn("Min Speed is 350 miliseconds")
                }
            }



            // Calculating Offsets
            this.offsets.splice(0, this.offsets.length)
            this.$views.each(function (i) {
                var anchor = this.$views.eq(i).attr('id');
                var viewOffset = this.$views.eq(i).offset().top;

                this.offsets.push({
                    position: i,
                    anchor: anchor,
                    offset: viewOffset
                })

            }.bind(this));


            // Setting Menu
            if (this.$navbar !== null) {
                var $menu = this.$navbar;
                var seletedAnchor = this.offsets.filter(function (obj) {
                    if (obj.anchor !== undefined) {
                        var $menuitem = $menu.find('a[href="#' + obj.anchor + '"]')
                        if ($menuitem.length) {
                            $menuitem.attr("data-scroll", obj.position)
                        }
                        return true;
                    }
                    return false; // skip
                }).map(function (obj) { return ("#" + obj.anchor); });

                var queryString = "a[href='" + seletedAnchor.join("'], a[href='") + "']";

                // Collecting All Nav Items
                this.$anchors = this.$navbar.find(queryString)

            }

            // Creating Dots
            if (this.options.dots) {
                this.$dotsElement = this.createDots();
            }

            // Check if any view active
            var $actview = this.$views.filter('[class="active"]');

            // this.$views.removeClass('active');
            if ($actview.length) {
                var offset = $actview.eq(0).offset().top;

                var activeData = this.offsets.filter(function (obj) {
                    return obj.offset === offset;
                })

                this.currentView = activeData[0].position;
                this.previousView = this.currentView;

                document.body.scrollTop = offset;
                document.documentElement.scrollTop = offset;
            }

            // If AutoPlay
            if (this.options.dots) {
                this.$dotsElement = this.createDots();
            }

            // Setting Initail Active Status
            this.changeActiveStatus(this.currentView);

        },

        // Bind events that trigger methods
        bindEvents: function () {
            var plugin = this;

            // On Window Resize
            plugin.$window.on('resize' + '.' + plugin._name, plugin.settingUp.bind(plugin));

            // On Dot Click
            plugin.$dotsElement !== null ?
                plugin.$dotsElement.on('click' + '.' + plugin._name, function (e) {
                    e.preventDefault();
                    if (!$(':animated').length) {
                        plugin.previousView = plugin.currentView;
                        plugin.currentView = parseInt($(this).attr("data-scroll"));
                        plugin.scrollTo(plugin.currentView);
                    }
                }) : "";

            // On nav anchor click
            plugin.$anchors !== undefined && plugin.$anchors.length > 0 ?
                plugin.$anchors.on('click' + '.' + plugin._name, function (e) {
                    e.preventDefault();

                    if (!$(':animated').length) {
                        plugin.previousView = plugin.currentView;
                        plugin.currentView = parseInt($(this).attr("data-scroll"));
                        plugin.scrollTo(plugin.currentView);
                    }

                }) : ""

            // On MouseScroll
            plugin.options.mouseScrolling ?
                plugin.$window.on('DOMMouseScroll mousewheel' + '.' + plugin._name, function (event) {
                    var e = event || window.event,
                        target = e.target || e.srcElement;

                    if (target.tagName.toUpperCase() == 'INPUT') return;
                    plugin.scrollByWheel(e);
                }) : ""

            // On Keyboard Press
            plugin.options.keyboardScrolling ?
                plugin.$document.on('keydown' + '.' + plugin._name, function (event) {

                    var e = event || window.event,
                        target = e.target || e.srcElement;

                    if (target.tagName.toUpperCase() == 'INPUT') return;

                    // Check if Already scrolling
                    if (!$(':animated').length && !plugin.isScrolling) {
                        var code = (e.keyCode ? e.keyCode : e.which);
                        switch (code) {
                            case 40: // Down key
                                plugin.scrollDown();
                                break;
                            // case 32: // Space Bar
                            //     plugin.scrollDown();
                            //     break;
                            case 38: // Up key
                                plugin.scrollUp();
                                break;
                            case 33: // Page up key
                                plugin.scrollUp();
                                break;
                            case 34: // Page down key
                                plugin.scrollDown();
                                break;
                        }
                    }
                }) : ""

            // On Touch Devices
            plugin.$views.on('touchstart' + '.' + plugin._name, function (e) {
                plugin.lastY = e.originalEvent.touches[0].clientY;
                plugin.lastX = e.originalEvent.touches[0].clientX;
            });

            plugin.options.touchScrolling ?
                plugin.$views.on('touchend' + '.' + plugin._name, function (event) {
                    // if (e.target !== e.currentTarget) return;

                    var e = event || window.event,
                        target = e.target || e.srcElement;
                    if (target.tagName.toUpperCase() == 'INPUT') return;

                    var currentY = e.originalEvent.changedTouches[0].clientY;
                    var currentX = e.originalEvent.changedTouches[0].clientX;

                    if (currentX < plugin.lastX) {
                        // Left
                        // console.log("left")
                    } else if (currentX > plugin.lastX) {
                        // Right
                        // console.log("right")
                    }

                    if (plugin.lastY > currentY + 25) {
                        plugin.scrollDown();
                    } else if (plugin.lastY < currentY - 25) {
                        plugin.scrollUp();
                    }
                }) : ""

        },

        // Unbind events that trigger methods
        unbindEvents: function () {
            this.$window.off('.' + this._name);
            this.$document.off('.' + this._name);
            this.$views.off('.' + this._name);
        },

        callback: function (eventName, addtional) {
            // Cache onScrollEnd option
            var onScrollStart = this.options.onScrollStart;
            var onScrollEnd = this.options.onScrollEnd;

            if (typeof onScrollEnd === 'function' && eventName === "onScrollEnd") {
                // Current, Previous, Direction
                onScrollEnd(this.$views.eq(this.currentView), this.$views.eq(this.previousView), addtional.direction);
            }

            if (typeof onScrollStart === 'function' && eventName === "onScrollStart") {
                // Current, Destination, Direction
                onScrollStart(this.$views.eq(addtional.current), this.$views.eq(addtional.destination), addtional.direction);
            }

        }

    });

    $.fn.fullView = function (options) {

        if (options === undefined || typeof options === 'object') {

            return this.each(function () {

                if (!$.data(this, fullView)) {
                    $.data(this, fullView, new FullView(this, options));
                }

            })
        }

        return this;
    };

    $.fn.fullView.defaults = {
        //Navigation
        navbar: undefined,
        dots: true,
        dotsPosition: 'right',
        dotsTooltips: false,

        //Scrolling
        easing: 'linear',
        backToTop: false,
        speed: 500, //ms

        // Accessibility
        keyboardScrolling: true,
        mouseScrolling: true,
        touchScrolling: true,

        // Callback
        onScrollEnd: null,
        onScrollStart: null,

    };

})(jQuery, window, document);
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "46041" + '/');

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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","node_modules/fullview/dist/fullview.js"], null)
//# sourceMappingURL=/fullview.215b5a74.js.map