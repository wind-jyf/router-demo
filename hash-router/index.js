// 在正式的vue-router中 是用h函数进行虚拟dom转换
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