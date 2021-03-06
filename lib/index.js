(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("Catalog", ["module"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.Catalog = mod.exports;
  }
})(this, function (module) {
  "use strict";

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Catalog = function () {
    function Catalog(opts) {
      _classCallCheck(this, Catalog);

      this.options = {
        selector: "h1,h2,h3,h4,h5,h6", //
        contentEl: "", // 内容区
        catalogEl: "", // 生成的目录区
        offsetTop: 0
      };
      this.tags = null;
      this.content = null;
      this.catalog = null;
      this.prev = null;
      this.hasScroll = false;
      this._init(opts);
      return this;
    }

    _createClass(Catalog, [{
      key: "_init",
      value: function _init(opts) {
        this.options = Object.assign({}, this.options, opts);
        if (!this.options.catalogEl || !this.options.catalogEl) {
          console.warn("catalogEl Or contentEl is undefined");
          return;
        }
        this.content = document.querySelector(this.options.contentEl);
        this.catalog = document.querySelector(this.options.catalogEl);
        if (!this.content) {
          console.warn("the dom of " + this.options.contentEl + " is not found");
          return;
        }
        if (!this.catalog) {
          console.warn("the dom of " + this.options.catalogEl + " is not found");
          return;
        }
        this._generateTree();
        this._bind();
        this._activeIndex();
        this._finish();
      }
    }, {
      key: "_finish",
      value: function _finish() {
        var _this = this;

        if (window && window.location.hash) {
          var datasetId = window.location.hash;

          var _datasetId$split = datasetId.split('-'),
              _datasetId$split2 = _slicedToArray(_datasetId$split, 2),
              head = _datasetId$split2[0],
              index = _datasetId$split2[1];

          if (isNaN(index)) return;
          index = parseInt(index);
          var target = this.catalog.getElementsByTagName("li")[index];
          if (!target) return;
          var bounding = document.getElementById("" + datasetId.replace('#', '')).getBoundingClientRect();
          setTimeout(function () {
            if (_this.hasScroll) {
              _this.content.scrollBy(0, bounding.y - _this.options.offsetTop);
            } else {
              window.scrollBy(0, bounding.y - _this.options.offsetTop);
            }
          }, 0);
        }
      }
    }, {
      key: "_generateTree",
      value: function _generateTree() {
        this.tags = this.content.querySelectorAll(this.options.selector);
        if (this.tags.length <= 0) {
          this.catalog.innerHTML = "<div class=\"js-catalog_container\"></div>";
          return;
        }
        this.tags = this._findParants();
        var tree = this._getTree();
        var htmlTree = this._getHtml(tree);
        this.catalog.innerHTML = "<div class=\"js-catalog_container\"><div id=\"js-catalog_wrapper\"><div class=\"js-catalog_hover\"></div>" + htmlTree + "</div></div>";
      }
    }, {
      key: "_bind",
      value: function _bind() {
        var height = parseFloat(this._getStyle(this.content, "height").replace("px", ""));
        height = Math.round(height);
        var scrollHeight = this.content.scrollHeight;
        if (scrollHeight > height) {
          this.hasScroll = true;
          this.content.addEventListener("scroll", this._activeIndex.bind(this));
        } else {
          window.addEventListener("scroll", this._activeIndex.bind(this));
        }
        this.catalog.addEventListener("click", this._handleClick.bind(this));
      }
    }, {
      key: "_handleClick",
      value: function _handleClick(e) {
        if (e.target.tagName == "UL") return;
        var datasetId = e.target.getAttribute("data-catalog");
        var bounding = document.getElementById(datasetId).getBoundingClientRect();
        document.getElementsByClassName("js-catalog_hover")[0].style.top = e.target.offsetTop + "px";
        if (this.hasScroll) {
          this.content.scrollBy(0, bounding.y - this.options.offsetTop);
        } else {
          window.scrollBy(0, bounding.y - this.options.offsetTop);
        }
        if (window && window.location) location.hash = datasetId;
      }
    }, {
      key: "_getStyle",
      value: function _getStyle(obj, attr) {
        if (window.getComputedStyle) {
          return getComputedStyle(obj, null)[attr];
        } else {
          return obj.currentStyle[attr];
        }
      }
    }, {
      key: "_findParants",
      value: function _findParants() {
        var newTags = [];
        for (var i = 0; i < this.tags.length; i++) {
          this.tags[i].id = "head-" + i;
          var treeItem = {
            title: this.tags[i].innerText || this.tags[i].textContent,
            tagName: this.tags[i].tagName,
            id: "head-" + i,
            parent: "",
            children: []
          };
          if (i == 0) {
            newTags.push(treeItem);
            continue;
          }
          for (var j = i - 1; j >= 0; j--) {
            if (this.tags[i].tagName.replace("H", "") > this.tags[j].tagName.replace("H", "")) {
              treeItem.parent = this.tags[j].id;
              newTags.push(treeItem);
              break;
            } else if (j == 0) {
              newTags.push(treeItem);
            }
          }
        }
        return newTags;
      }
    }, {
      key: "_getTree",
      value: function _getTree() {
        var trees = [];
        var map = {};
        this.tags.forEach(function (item) {
          map[item.id] = item;
        });
        this.tags.forEach(function (tag) {
          var parent = map[tag.parent];
          if (parent) {
            parent.children.push(tag);
          } else {
            trees.push(tag);
          }
        });
        return trees;
      }
    }, {
      key: "_getHtml",
      value: function _getHtml(tree) {
        var prev = '<ul class="js-catalog_ul">';
        var next = "</ul>";
        var content = "";
        for (var i = 0; i < tree.length; i++) {
          if (tree[i].children.length > 0) {
            content = content + ("<li class=\"js-catalog_li\" data-catalog=\"" + tree[i].id + "\">" + tree[i].title + "</li>") + this._getHtml(tree[i].children);
          } else {
            content = content + ("<li class=\"js-catalog_li\" data-catalog=\"" + tree[i].id + "\">" + tree[i].title + "</li>");
          }
        }
        return prev + content + next;
      }
    }, {
      key: "_activeIndex",
      value: function _activeIndex() {
        if (!document.querySelector(this.options.catalogEl) || !document.querySelector(this.options.catalogEl)) return;
        if (this.catalog.getElementsByTagName("li").length <= 0) return;
        var tags = this.content.querySelectorAll(this.options.selector);
        var boundings = [];
        for (var i = 0; i < tags.length; i++) {
          boundings.push(document.getElementById(tags[i].id).getBoundingClientRect());
        }
        var index = 0;
        for (var _i = 0; _i < boundings.length; _i++) {
          if (boundings[_i].bottom >= this.options.offsetTop) {
            index = _i;
            break;
          }
        }
        var target = this.catalog.getElementsByTagName("li")[index];
        if (this.prev) {
          this.prev.className = this.prev.className.replace("js-catalog_active", "");
        }
        target.className = target.className.replace("js-catalog_active", "") + " js-catalog_active";
        this.prev = target;

        var hover = document.getElementsByClassName("js-catalog_hover")[0];
        hover.style.top = target.offsetTop + "px";
        var hover_bounding = {
          top: hover.getBoundingClientRect().top,
          bottom: hover.getBoundingClientRect().bottom
        };

        var contanier = document.getElementsByClassName("js-catalog_container")[0];
        var scrollTop = contanier.scrollTop;
        var scrollHeight = contanier.scrollHeight;
        var contanier_bounding = {
          top: contanier.getBoundingClientRect().top,
          bottom: contanier.getBoundingClientRect().bottom
        };
        var wrapper_bounding = {
          top: document.getElementById("js-catalog_wrapper").getBoundingClientRect().top,
          bottom: document.getElementById("js-catalog_wrapper").getBoundingClientRect().bottom
        };
        var h = contanier.clientHeight;
        scrollTop = contanier.scrollTop;

        // 判断向下滑并滑出视野范围内
        if (hover_bounding.bottom > contanier_bounding.bottom) {
          // hover与wrapper底端的距离
          var distance = wrapper_bounding.bottom - hover_bounding.bottom;
          if (distance > h) {
            document.getElementsByClassName("js-catalog_container")[0].scrollBy(0, h / 2);
          } else {
            document.getElementsByClassName("js-catalog_container")[0].scrollBy(0, scrollHeight - h - scrollTop);
          }
        } else {
          // 判断向上滑出视野范围内
          if (hover_bounding.top < contanier_bounding.top) {
            //   计算hover与wrapper顶端的距离
            var _distance = hover_bounding.top - wrapper_bounding.top;
            if (_distance > h) {
              document.getElementsByClassName("js-catalog_container")[0].scrollBy(0, -h / 2);
            } else {
              document.getElementsByClassName("js-catalog_container")[0].scrollBy(0, -(scrollHeight - h - scrollTop));
            }
          }
        }
      }
    }]);

    return Catalog;
  }();

  module.exports = Catalog;
});