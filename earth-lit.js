/* 
* @Author: omni360
* @Date:   2014-08-12 20:30:43
* @Last Modified by:   omni360
* @Last Modified time: 2014-08-12 22:04:30
*/

//构造函数
EarthApp = function(){
	Sim.App.call(this);
}

//子类Sim.App
EarthApp.prototype = new Sim.App();
//自定义初始化过程。
EarthApp.prototype.init= function(param){
	//调用父类的初始化代码来设置场景，渲染器和默认相机。
	Sim.App.prototype.init.call(this,param);
	//创建地球，并添加到sim中。
	var earth= new Earth();
	earth.init();
	this.addObject(earth);

	//设置光照
	var sun = new Sun();
	sun.init();
	this.addObject(sun);
}

//自定义地球类
Earth=function(){
	Sim.Object.call(this);
}

Earth.prototype=new Sim.Object();

Earth.prototype.init= function(){
	//创建地球球体并添加纹理
	var earthmap = "./images/earth_surface_2048.jpg";
	var geometry = new THREE.SphereGeometry( 1, 32, 32);
	var texture = THREE.ImageUtils.loadTexture(earthmap);
	var material = new THREE.MeshBasicMaterial( {map:texture} );
	var mesh = new THREE.Mesh(geometry, material);

	//稍微倾斜一下。
	mesh.rotation.z = Earth.TILT;

	//把对象传递给框架
	this.setObject3D(mesh);
}

Sun = function() {
	Sim.Object.call(this);
}
Sun.prototype = new Sim.Object();
Sun.prototype.init= function(){

	//创建一个点光源照射地球，并放置于屏幕外部偏左一点的地方。
	var light = new THREE.PointLight( 0xffffff,2,100 );
	light.position.set(-10,0,20);

	//把对象反馈给框架
	this.setObject3D(light);
}

Earth.prototype.update = function() {
	//让地球动起来
	this.object3D.rotation.y += Earth.ROTATION_Y; 
}

Earth.ROTATION_Y= 0.0025;
Earth.TILT = 0.41;