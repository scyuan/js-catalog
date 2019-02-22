Generate a directory based on the HTML structure without dependencies. and Directory can automatically scroll with content

### Demo

![](https://note.youdao.com/yws/public/resource/c43595e0f3c50c1fc42143fed714c633/xmlnote/WEBRESOURCE9045059209c7999b32e5c1b6dad9f6dd/7265)

### Use

Vue or other can import ES6 modules.

```JavaScript
new Catalog({
    contentEl: '#body',
    catalogEl: '#catalog',
    offsetTop: 60         // offset top
})
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
