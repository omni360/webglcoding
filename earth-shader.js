/* 
* @Author: omni360
* @Date:   2014-08-12 20:30:43
* @Last Modified by:   omni360
* @Last Modified time: 2014-08-12 22:09:10
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
	var earth = new Earth();
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

Earth.prototype = new Sim.Object();

Earth.prototype.init = function(){
	//o创建一个包含地球和云层的群组
	var earthGroup = new THREE.Object3D();

	//把对象反馈给框架
	this.setObject3D(earthGroup);

	//添加地球对象和云层对象
	this.createGlobe();
	this.createClouds();
}
Earth.prototype.createGlobe = function(){

	//创建多重纹理，包括一种用于高度图的法线贴图和一张高光贴图
	var surfaceMap = THREE.ImageUtils.loadTexture("./images/earth_surface_2048.jpg");
	var normalMap = THREE.ImageUtils.loadTexture("./images/earth_normal_2048.jpg");
	var specularMap = THREE.ImageUtils.loadTexture("./images/earth_specular_2048.jpg");

	var shader = THREE.ShaderUtils.lib["normal"],
	uniforms =THREE.UniformsUtils.clone(shader.uniforms);

	uniforms["tNormal"].texture =  normalMap;
	uniforms["tDiffuse"].texture =  surfaceMap;
	uniforms["tSpecular"].texture = specularMap;


	uniforms["enableDiffuse"].value = true;
	uniforms["enableSpecular"].value = true;

	var shaderMaterial = new THREE.ShaderMaterial( {
		fragmentShader:shader.fragmentShader,
		vertexShader:shader.vertexShader,
		uniforms:uniforms,
		lights:true
	} );

	var globeGeometry = new THREE.SphereGeometry( 1,32,32 );

	//为着色器计算切线
	globeGeometry.computeTangents();
	var globeMesh = new THREE.Mesh(globeGeometry, shaderMaterial);

	//倾斜地球
	globeMesh.rotation.x = Earth.TILT;

	//添加到群组中
	this.object3D.add(globeMesh);

	//保存之后就可以旋转了。
	this.globeMesh = globeMesh;

	/*
	var earthmap = "./images/earth_surface_2048.jpg";
	var geometry = new THREE.SphereGeometry( 1, 32, 32);
	var texture = THREE.ImageUtils.loadTexture(earthmap);
	var material = new THREE.MeshBasicMaterial( {map:texture} );
	var mesh = new THREE.Mesh(geometry, material);

	//稍微倾斜一下。
	mesh.rotation.z = Earth.TILT;

	//把对象传递给框架
	this.setObject3D(mesh);
	*/
}

Earth.prototype.createClouds = function(){
	//创建云层
	var cloudsMap = THREE.ImageUtils.loadTexture("./images/earth_clouds_1024.png");
	var cloudsMaterial = new THREE.MeshLambertMaterial({color:0xffffff,map:cloudsMap,transparent:true});

	var cloudsGeometry = new THREE.SphereGeometry( Earth.CLOUDS_SCALE,32,32 );
	cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
	cloudsMesh.rotation.x = Earth.TILT;

	//添加到群组
	this.object3D.add(cloudsMesh);

	//保存之后就可以旋转了。
	this.cloudsMesh = cloudsMesh;
}



Earth.prototype.update = function(){
	//让地球动起来
	this.globeMesh.rotation.y += Earth.ROTATION_Y; 
	//让云层动起来
	this.cloudsMesh.rotation.y += Earth.CLOUDS_ROTATION_Y; 

	Sim.Object.prototype.update.call(this);
}

Earth.ROTATION_Y= 0.001;
Earth.TILT = 0.41;
Earth.CLOUDS_SCALE=1.005;
Earth.CLOUDS_ROTATION_Y = Earth.ROTATION_Y * 0.75;

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