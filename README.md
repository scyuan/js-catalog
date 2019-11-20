Generate a directory based on the HTML structure without dependencies. and Directory can automatically scroll with content

### Demo

![](https://ws4.sinaimg.cn/large/006tKfTcgy1g0fdih9y9fg310r0u07wn.gif)

### Use

#### Vue or other can import ES6 modules.

```JavaScript

import Catalog from "js-catalog";
import "js-catalog/lib/style/style.css";

new Catalog({
    contentEl: '#body',
    catalogEl: '#catalog',
    offsetTop: 60         // offset top
})
```
#### via script
```
<script src="/lib/umd/index.js"></script>
<script>
    new Catalog({
        contentEl: '#body',
        catalogEl: '#catalog',
        offsetTop: 60      // offset top
    })
</script>
```

```html
<div id="body">
  <h1>Chapter 1</h1>
  <p>
    最好表示已经没有上升空间，永远只在一个固定的模式上循环渐进。更好代表着更高层次的境界，举个例子，有人问“你觉得我和某某谁好看
  </p>
  <h2>Chapter 1.1</h2>
  <h1>Chapter 2</h1>
  <p>
    最好表示已经没有上升空间，永远只在一个固定的模式上循环渐进。更好代表着更高层次的境界，举个例子，有人问“你觉得我和某某谁好看
  </p>
  <h2>Chapter 2.1</h2>
  <p>
    最好表示已经没有上升空间，永远只在一个固定的模式上循环渐进。更好代表着更高层次的境界，举个例子，有人问“你觉得我和某某谁好看
  </p>
  <h2>Chapter 2.1</h2>
  <p>
    最好表示已经没有上升空间，永远只在一个固定的模式上循环渐进。更好代表着更高层次的境界，举个例子，有人问“你觉得我和某某谁好看
  </p>
</div>
<div id="catalog"></div>
```
