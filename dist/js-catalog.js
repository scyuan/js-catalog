'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Catalog = function () {
    function Catalog(opts) {
        _classCallCheck(this, Catalog);

        this.options = {
            catalog_class: '', // 目录样式
            catalog_activeclass: '', // 目录激活时样式
            selector: 'h1,h2,h3,h4,h5,h6', // 
            hover_class: '',
            contentEl: '',
            catalogEl: ''
        };
        this.tags = null;
        this.content = null;
        this.prev = null;
        this._init(opts);
    }

    _createClass(Catalog, [{
        key: '_init',
        value: function _init(opts) {
            this.options = Object.assign({}, this.options, opts);
            if (!this.options.catalogEl || !this.options.catalogEl) {
                console.warn('catalogEl Or contentEl is undefined');
                return;
            }
            this.content = document.querySelector(this.options.contentEl);
            if (!this.content) {
                console.warn('the dom of ' + this.options.contentEl + ' is not found');
                return;
            }
            this.tags = document.querySelectorAll(this.options.selector);
            this.tags = this.findParants();
            var tree = this.getTree();
            var htmlTree = this.getHtml(tree);
            document.querySelector(this.options.catalogEl).innerHTML = '<div class="wrapper"><div class="hover"></div>' + htmlTree + '</div>';
            this.activeIndex();
            this._bind();
        }
    }, {
        key: '_bind',
        value: function _bind() {
            var _this = this;
            document.querySelector(this.options.catalogEl).addEventListener('click', function (e) {
                if (e.target.tagName == 'UL') return;
                if (_this.prev) {
                    _this.prev.className = _this.prev.className.replace('active', '');
                }
                e.target.className = e.target.className + ' active';
                _this.prev = e.target;
                var datasetId = e.target.getAttribute('data-catalog');
                var bounding = document.getElementById(datasetId).getBoundingClientRect();
                document.getElementsByClassName('hover')[0].style.top = e.target.offsetTop + 'px';
                window.scrollBy({
                    top: bounding.y,
                    behavior: 'smooth'
                });
            });
        }
    }, {
        key: 'findParants',
        value: function findParants() {
            var newTags = [];
            for (var i = 0; i < this.tags.length; i++) {
                this.tags[i].id = 'head-' + i;
                var treeItem = {
                    title: this.tags[i].innerText || tags[i].textContent,
                    tagName: this.tags[i].tagName,
                    id: 'head-' + i,
                    parent: '',
                    children: []
                };
                if (i == 0) {
                    newTags.push(treeItem);
                    continue;
                }
                for (var j = i - 1; j >= 0; j--) {
                    if (this.tags[i].tagName.replace('H', '') > this.tags[j].tagName.replace('H', '')) {
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
        key: 'getTree',
        value: function getTree() {
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
        key: 'getHtml',
        value: function getHtml(tree) {
            var prev = '<ul class="catalog-ul">';
            var next = '</ul>';
            var content = '';
            for (var i = 0; i < tree.length; i++) {
                if (tree[i].children.length > 0) {
                    content = content + ('<li class="catalog-li" data-catalog="' + tree[i].id + '">' + tree[i].title + '</li>') + this.getHtml(tree[i].children);
                } else {
                    content = content + ('<li class="catalog-li" data-catalog="' + tree[i].id + '">' + tree[i].title + '</li>');
                }
            }
            return prev + content + next;
        }
    }, {
        key: 'activeIndex',
        value: function activeIndex() {
            for (var i = 0; i < this.tags.length - 1; i++) {
                if (document.getElementById(this.tags[i].id).getBoundingClientRect().top <= 0 && document.getElementById(this.tags[i + 1].id).getBoundingClientRect().top >= 0) {
                    var target = document.querySelector(this.options.catalogEl).getElementsByTagName('li')[i];
                    if (this.prev) {
                        this.prev.className = this.prev.className.replace('active', '');
                    }
                    target.className = target.className + ' active';
                    this.prev = target;
                    document.getElementsByClassName('hover')[0].style.top = target.offsetTop + 'px';
                    break;
                }
            }
        }
    }]);

    return Catalog;
}();
