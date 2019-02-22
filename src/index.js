export default class Catalog {
  constructor(opts) {
    this.options = {
      selector: "h1,h2,h3,h4,h5,h6", //
      contentEl: "", // 内容区
      catalogEl: "" // 生成的目录区
    };
    this.tags = null;
    this.content = null;
    this.prev = null;
    this._init(opts);
  }
  _init(opts) {
    this.options = Object.assign({}, this.options, opts);
    if (!this.options.catalogEl || !this.options.catalogEl) {
      console.warn("catalogEl Or contentEl is undefined");
      return;
    }
    this.content = document.querySelector(this.options.contentEl);
    if (!this.content) {
      console.warn(`the dom of ${this.options.contentEl} is not found`);
      return;
    }
    this.tags = document.querySelectorAll(this.options.selector);
    this.tags = this.findParants();
    var tree = this.getTree();
    var htmlTree = this.getHtml(tree);
    document.querySelector(
      this.options.catalogEl
    ).innerHTML = `<div class="js-catalog_container"><div id="js-catalog_wrapper"><div class="js-catalog_hover"></div>${htmlTree}</div></div>`;
    this._bind();
    window.addEventListener("scroll", this.activeIndex.bind(this));
  }
  _bind() {
    var _this = this;
    document.querySelector(this.options.catalogEl).addEventListener("click", function(e) {
      if (e.target.tagName == "UL") return;
      var datasetId = e.target.getAttribute("data-catalog");
      const bounding = document.getElementById(datasetId).getBoundingClientRect();
      document.getElementsByClassName("js-catalog_hover")[0].style.top = e.target.offsetTop + "px";
      window.scrollBy(0, bounding.y);
    });
  }
  findParants() {
    var newTags = [];
    for (var i = 0; i < this.tags.length; i++) {
      this.tags[i].id = "head-" + i;
      var treeItem = {
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
  getTree() {
    var trees = [];
    var map = {};
    this.tags.forEach(function(item) {
      map[item.id] = item;
    });
    this.tags.forEach(function(tag) {
      var parent = map[tag.parent];
      if (parent) {
        parent.children.push(tag);
      } else {
        trees.push(tag);
      }
    });
    return trees;
  }
  getHtml(tree) {
    var prev = '<ul class="js-catalog_ul">';
    var next = "</ul>";
    var content = "";
    for (var i = 0; i < tree.length; i++) {
      if (tree[i].children.length > 0) {
        content =
          content +
          `<li class="js-catalog_li" data-catalog="${tree[i].id}">${tree[i].title}</li>` +
          this.getHtml(tree[i].children);
      } else {
        content =
          content + `<li class="js-catalog_li" data-catalog="${tree[i].id}">${tree[i].title}</li>`;
      }
    }
    return prev + content + next;
  }
  activeIndex() {
    let tags = document
      .querySelector(this.options.contentEl)
      .querySelectorAll(this.options.selector);
    let boundings = [];
    for (let i = 0; i < tags.length; i++) {
      boundings.push(document.getElementById(tags[i].id).getBoundingClientRect());
    }
    var index = 0;
    for (let i = 0; i < boundings.length; i++) {
      if (boundings[i].bottom >= 0) {
        index = i;
        break;
      }
    }
    var target = document.querySelector(this.options.catalogEl).getElementsByTagName("li")[index];
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
    var scrollTop = contanier.scrollTop;

    // 判断向下滑并滑出视野范围内
    if (hover_bounding.bottom > contanier_bounding.bottom) {
      // hover与wrapper底端的距离
      var distance = wrapper_bounding.bottom - hover_bounding.bottom;
      if (distance > h) {
        document.getElementsByClassName("js-catalog_container")[0].scrollBy({
          top: h / 2,
          behavior: "smooth"
        });
      } else {
        document.getElementsByClassName("js-catalog_container")[0].scrollBy({
          top: scrollHeight - h - scrollTop,
          behavior: "smooth"
        });
      }
      //   if (scrollHeight - (h + scrollTop) < h) {
      //     document.getElementsByClassName("js-catalog_container")[0].scrollBy({
      //       top: scrollHeight - (h + scrollTop),
      //       behavior: "smooth"
      //     });
      //   } else {
      //     document.getElementsByClassName("js-catalog_container")[0].scrollBy({
      //       top: h,
      //       behavior: "smooth"
      //     });
      //   }
    } else {
      // 判断向上滑出视野范围内
      if (hover_bounding.top < contanier_bounding.top) {
        //   计算hover与wrapper顶端的距离
        var distance = hover_bounding.top - wrapper_bounding.top;
        if (distance > h) {
          document.getElementsByClassName("js-catalog_container")[0].scrollBy({
            top: -h / 2,
            behavior: "smooth"
          });
        } else {
          document.getElementsByClassName("js-catalog_container")[0].scrollBy({
            top: -(scrollHeight - h - scrollTop),
            behavior: "smooth"
          });
        }
        // if (scrollTop > h) {
        //   document.getElementsByClassName("js-catalog_container")[0].scrollBy({
        //     top: -h / 2,
        //     behavior: "smooth"
        //   });
        // } else {
        //   document.getElementsByClassName("js-catalog_container")[0].scrollBy({
        //     top: -scrollTop,
        //     behavior: "smooth"
        //   });
        // }
      }
    }
  }
}
