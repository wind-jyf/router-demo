# 前端路由及简单实现

## 一、前端路由

> 前端路由可以在URL改变但是不请求服务器的同时，让页面进行重新渲染

在开发多页面应用时，浏览器会根据URL去请求服务器，服务器便返回给浏览器一个HTML，URL每发生变化一次，便会向服务器发一次请求。而这种路由称为**后端路由**。

而前端路由多应用与单页面应用中（简称SPA），前端路由的特征便是，在URL改变时，并不会向服务器发起请求，此时路由与页面的映射关系由前端来做，进行页面的更新。

前端路由主要有两种实现方法：

1. hash路由
2. history路由



## 二、hash路由

在URL中，`#`以及`#`后面的部分称为hash，hash可以通过`location.hash`进行获取，而同时在hash发生变化时，会触发hashchange 事件。而我们便可以通过此事件，进行相关页面的渲染。

#### hash路由的实现

先来看看HTML文件，我们要实现一个什么样的效果。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hash-router简单实现</title>
</head>
<body>
    <a href="#/">home</a>
    <a href="#/school">school</a>
    <a href="#/family">family</a>
    <button>go school</button>
    <router-view></router-view>
    <script type="text/javascript" src="./index.js"></script>
</body>
</html>
```

hash的改变，我们会触发`hashchange`事件，由此，我们可以进行页面的局部重新渲染。

* 对`hashchange`事件添加监听
* 通过`location.hash`得到当前hash值

```javascript
window.addEventListener('hashchange',this.onhashchange.bind(this),false);//绑定监听事件

onhashchange(){//hash变化更新路由，并进行新的渲染
      this.current = this.getHash();//getHash拿到当前的路由，并更新当前路由
      this.render();//根据当前路由进行渲染
}
```

在进行路由渲染时，我们需要一张路由与页面的映射关系。

```javascript
createRouteMap(options){//创建路由映射关系,this.routerMap便是路由映射关系表
    options.forEach(item=>this.routeMap[item.path] = item.component);
}
```



#### 完整代码

```javascript
// 这里简化下操作直接无脑渲染
  const renderElement = (component) => {
    document.querySelector('router-view').innerHTML = component.template;
  }

  class vueRouter{
    constructor(options){
      this.options = options;//routes
      this.current = '/';
      this.routeMap = {};

      this.init();//初始化，对hashchange事件进行监听
      this.createRouteMap(options);//创建路由映射关系表
      this.render();//渲染
    }
  
    init(){//绑定监听事件
      window.addEventListener('hashchange',this.onhashchange.bind(this),false);
      window.addEventListener('click',this.onClick.bind(this),false);
    }
    createRouteMap(options){//创建路由映射关系
      options.forEach(item=>this.routeMap[item.path] = item.component);
    }
    
    getHash(){ //获得当前hash串，如果为空，则为根路由
      return window.location.hash.slice(1) || '/';
    }
    push(path){//封装push
      window.location.hash = path;
    }
    onhashchange(){//hash变化更新路由，并进行新的渲染
      this.current = this.getHash();
      this.render();
    }
    onClick(){
      this.push('#/school');
    }
    render(){//渲染页面
      renderElement(this.routeMap[this.current]);
    }
  };
  const Home = { template: '<div>home</div>' };
  const School = { template: '<div>school</div>' };
  const Family = { template: '<div>family</div>' };

  const routes = [
    {path:'/',component:Home},
    {path:'/school',component:School},
    {path:'/family',component:Family}
  ];

  const Router = new vueRouter(routes);
```



## 三、history路由

hash发生变化时，会触发`hashchange`，但是history路由的变化，并不会触发任何事件，那我们应该如何在history路由变化时，进行局部页面的重新渲染呢？

* 添加点击监听事件，在需要进行跳转的a标签上进行添加
* 调用`history.pushState `或 `history.replaceState`会改变当前路由
* 点击浏览器的前进和回退会改变当前路由，同时触发`popstate`事件
* 通过`location.pathname`，可以得到当前路由

#### history路由的实现

```javascript
  const renderElement = (component) => {
    document.getElementById('content').innerHTML = component.template;
  }

  class vueRouter{
    constructor(options){
      this.options = options;//routes
      this.current = '/';
      this.routeMap = {};

      this.init();//对popstate事件进行监听
      this.bindEvent();//给a标签添加监听事件
      this.createRouteMap(options);//创建路由映射关系表
      this.render();//渲染
    }
  
    init(){//绑定监听事件
      window.addEventListener('popstate',this.render.bind(this),false);
    }
    createRouteMap(options){//创建路由映射关系
      options.forEach(item=>this.routeMap[item.path] = item.component);
    }
    bindEvent(){
      let _this = this;//由于在回调函数中this指向会发生变化，在此先存起来
      const links = document.getElementsByTagName('a');
      [].forEach.call(links,link=>link.addEventListener('click',function(){
        const url = this.getAttribute('data-href');
        _this.push(url);
      }))
    }
    push(url){//点击a标签触发路由变化，并进行渲染
      window.history.pushState({},null,url);//改变当前路由
      this.render();//通过当前路由进行渲染
    }
    getPath(){
      return window.location.pathname || '/';
    }
    render(){//渲染页面
      let path = this.getPath();
      this.current = path;
      renderElement(this.routeMap[this.current]);
    }
  };
  const Home = { template: '<div>home</div>' };
  const Book = { template: '<div>book</div>' };
  const Movie = { template: '<div>movie</div>' };

  const routes = [
    {path:'/',component:Home},
    {path:'/book',component:Book},
    {path:'/movie',component:Movie}
  ];

  const Router = new vueRouter(routes);
```

