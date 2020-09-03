  const renderElement = (component) => {
    document.getElementById('content').innerHTML = component.template;
  }

  class vueRouter{
    constructor(options){
      this.options = options;//routes
      this.current = '/';
      this.routeMap = {};

      this.init();//初始化，对popstate事件进行监听
      this.bindEvent();//给a标签添加监听事件
      this.createRouteMap(options);//创建路由映射关系表
      this.render();//渲染
    }
  
    init(){//绑定监听事件
      window.addEventListener('popstate',this.render.bind(this),false);
      //window.addEventListener('click',this.onClick.bind(this),false);
    }
    createRouteMap(options){//创建路由映射关系
      options.forEach(item=>this.routeMap[item.path] = item.component);
    }
    bindEvent(){
      let _this = this;
      const links = document.getElementsByTagName('a');
      [].forEach.call(links,link=>link.addEventListener('click',function(){
        const url = this.getAttribute('data-href');
        _this.push(url);
      }))
    }
    push(url){
      window.history.pushState({},null,url);
      this.render();
    }
    getPath(){
      return window.location.pathname || '/';
    }
    render(){//渲染页面
      let path = this.getPath();
      this.current = path;
      console.log(this.current);
      renderElement(this.routeMap[this.current]);
    }
    /*
    onClick(){
      this.push('/book');
    }
    */
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