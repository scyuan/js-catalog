class Catalog {
  constructor(opts) {
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
  _init(opts) {
    this.options = Object.assign({}, this.options, opts);
    if (!this.options.catalogEl || !this.options.catalogEl) {
      console.warn("catalogEl Or contentEl is undefined");
      return;
    }
    this.content = document.querySelector(this.options.contentEl);
    this.catalog = document.querySelector(this.options.catalogEl);
    if (!this.content) {
      console.warn(`the dom of ${this.options.contentEl} is not found`);
      return;
    }
    if (!this.catalog) {
      console.warn(`the dom of ${this.options.catalogEl} is not found`);
      return;
    }
    this._generateTree();
    this._bind();
    this._activeIndex();
  }

  _generateTree() {
    this.tags = this.content.querySelectorAll(this.options.selector);
    if (this.tags.length <= 0) {
      this.catalog.innerHTML = `<div class="js-catalog_container"></div>`;
      return;
    }
    this.tags = this._findParants();
    let tree = this._getTree();
    let htmlTree = this._getHtml(tree);
    this.catalog.innerHTML = `<div class="js-catalog_container"><div id="js-catalog_wrapper"><div class="js-catalog_hover"></div>${htmlTree}</div></div>`;
  }

  _bind() {
    let height = parseFloat(this._getStyle(this.content, "height").replace("px", ""));
    height = Math.round(height);
    let scrollHeight = this.content.scrollHeight;
    if (scrollHeight > height) {
      this.hasScroll = true;
      this.content.addEventListener("scroll", this._activeIndex.bind(this))
    } else {
      window.addEventListener("scroll", this._activeIndex.bind(this));
    }
    this.catalog.addEventListener("click", this._handleClick.bind(this));
  }

  _handleClick(e) {
    if (e.target.tagName == "UL") return;
    let datasetId = e.target.getAttribute("data-catalog");
    const bounding = document.getElementById(datasetId).getBoundingClientRect();
    document.getElementsByClassName("js-catalog_hover")[0].style.top = e.target.offsetTop + "px";
    if (this.hasScroll) {
      this.content.scrollBy(0, bounding.y - this.options.offsetTop);
    } else {
      window.scrollBy(0, bounding.y - this.options.offsetTop);
    }
  }

  _getStyle(obj, attr) {
    if (window.getComputedStyle) {
      return getComputedStyle(obj, null)[attr];
    } else {
      return obj.currentStyle[attr];
    }
  }
  _findParants() {
    let newTags = [];
    for (let i = 0; i < this.tags.length; i++) {
      this.tags[i].id = "head-" + i;
      let treeItem = {
        title: this.tags[i].innerText || tags[i].textContent,
        tagName: this.tags[i].tagName,
        id: "head-" + i,
        parent: "",
        children: []
      };
      if (i == 0) {
        newTags.push(treeItem);
        continue;
      }
      for (let j = i - 1; j >= 0; j--) {
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
  _getTree() {
    let trees = [];
    let map = {};
    this.tags.forEach(function (item) {
      map[item.id] = item;
    });
    this.tags.forEach(function (tag) {
      let parent = map[tag.parent];
      if (parent) {
        parent.children.push(tag);
      } else {
        trees.push(tag);
      }
    });
    return trees;
  }
  _getHtml(tree) {
    let prev = '<ul class="js-catalog_ul">';
    let next = "</ul>";
    let content = "";
    for (let i = 0; i < tree.length; i++) {
      if (tree[i].children.length > 0) {
        content =
          content +
          `<li class="js-catalog_li" data-catalog="${tree[i].id}">${tree[i].title}</li>` +
          this._getHtml(tree[i].children);
      } else {
        content =
          content + `<li class="js-catalog_li" data-catalog="${tree[i].id}">${tree[i].title}</li>`;
      }
    }
    return prev + content + next;
  }
  _activeIndex() {
    if (!document.querySelector(this.options.catalogEl) || !document.querySelector(this.options.catalogEl)) return;
    if (this.catalog.getElementsByTagName("li").length <= 0) return;
    let tags = this.content.querySelectorAll(this.options.selector);
    let boundings = [];
    for (let i = 0; i < tags.length; i++) {
      boundings.push(document.getElementById(tags[i].id).getBoundingClientRect());
    }
    let index = 0;
    for (let i = 0; i < boundings.length; i++) {
      if (boundings[i].bottom >= this.options.offsetTop) {
        index = i;
        break;
      }
    }
    let target = this.catalog.getElementsByTagName("li")[index];
    if (this.prev) {
      this.prev.className = this.prev.className.replace("js-catalog_active", "");
    }
    target.className = target.className.replace("js-catalog_active", "") + " js-catalog_active";
    this.prev = target;

    let hover = document.getElementsByClassName("js-catalog_hover")[0];
    hover.style.top = target.offsetTop + "px";
    let hover_bounding = {
      top: hover.getBoundingClientRect().top,
      bottom: hover.getBoundingClientRect().bottom
    };

    let contanier = document.getElementsByClassName("js-catalog_container")[0];
    let scrollTop = contanier.scrollTop;
    let scrollHeight = contanier.scrollHeight;
    let contanier_bounding = {
      top: contanier.getBoundingClientRect().top,
      bottom: contanier.getBoundingClientRect().bottom
    };
    let wrapper_bounding = {
      top: document.getElementById("js-catalog_wrapper").getBoundingClientRect().top,
      bottom: document.getElementById("js-catalog_wrapper").getBoundingClientRect().bottom
    };
    let h = contanier.clientHeight;
    scrollTop = contanier.scrollTop;

    // 判断向下滑并滑出视野范围内
    if (hover_bounding.bottom > contanier_bounding.bottom) {
      // hover与wrapper底端的距离
      let distance = wrapper_bounding.bottom - hover_bounding.bottom;
      if (distance > h) {
        document.getElementsByClassName("js-catalog_container")[0].scrollBy(0, h / 2);
      } else {
        document.getElementsByClassName("js-catalog_container")[0].scrollBy(0, scrollHeight - h - scrollTop);
      }

    } else {
      // 判断向上滑出视野范围内
      if (hover_bounding.top < contanier_bounding.top) {
        //   计算hover与wrapper顶端的距离
        let distance = hover_bounding.top - wrapper_bounding.top;
        if (distance > h) {
          document.getElementsByClassName("js-catalog_container")[0].scrollBy(0, -h / 2);
        } else {
          document.getElementsByClassName("js-catalog_container")[0].scrollBy(0, -(scrollHeight - h - scrollTop));
        }
      }
    }
  }
}
module.exports = Catalog;