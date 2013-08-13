(function($) {
	$.fn.jglobee = function(options) {
		var container = this;

		console.log('options ' + options);
		// console.log('options ' + options.earthTexture);

		var defaults = {
			earthTexture: 'Lambert-cylindrical-equal-area-projection.jpg',
			earthNormal: null,
			earthSpecular: null,
			sun: true,
			ambientLight: 0xdddddd,
			artifacts: [{color: 0x00ff00,
					  radius: 1,
					  lat: 37,
					  lon: 14
					  }]
			};

		var settings = $.extend({}, defaults, options);
		// init = function () {

		// set the scene size
		// var WIDTH = 800,
		// HEIGHT = 600;

		var WIDTH = container.width();
		var HEIGHT = container.height();

		var renderer = new THREE.WebGLRenderer({antialias:true});

		// create and start the renderer; choose antialias setting.
		//	if ( Detector.webgl )
		//		renderer = new THREE.WebGLRenderer( {antialias:true} );
		//	else
		//		renderer = new THREE.CanvasRenderer();

		var scene = new THREE.Scene();

		var addCamera = function() {
			// set some camera attributes
			var VIEW_ANGLE = 45,  // focal length
				ASPECT = WIDTH / HEIGHT,  // aspect ratio
				NEAR = 0.1,  // near cutoff plane
				FAR = 10000;  // far cutoff plane

			var camera = new THREE.PerspectiveCamera(VIEW_ANGLE,
													 ASPECT,
													 NEAR,
													 FAR);

			camera.position.set(150, 75, 0);
			scene.add(camera);
			return camera;
		};

		var camera = addCamera();

		// start the renderer
		renderer.setSize(WIDTH, HEIGHT);

		// attach the render-supplied DOM element
		container.append(renderer.domElement);

		var addEarth = function() {
			// set up the Earth sphere
			var radius=50,
				segments=radius,
				rings=radius;

			// console.log('Init texture ' + settings.earthTexture);
			var earthTexture = THREE.ImageUtils.loadTexture(settings.earthTexture);
			earthTexture.anisotropy = 16;
			// earthTexture.ambient = 0xffffff;
			// earthTexture.color = 0xffffff;
			// earthTexture.specular = 0xffffff;
			// earthTexture.shininess = 10000000000;

			// var bumpTexture = THREE.ImageUtils.loadTexture('Earth-normal-8k.dds');
			// var normalTexture = THREE.ImageUtils.loadTexture('EarthNormal.png');
			// var normalTexture = THREE.ImageUtils.loadTexture('http://localhost:10000/static/images/EarthNormal.png');
			// var specularTexture = THREE.ImageUtils.loadTexture('http://localhost:10000/static/images/specular.png');

			var earthNormal = null;
			console.log('pre');
			if (settings.earthNormal) {
				console.log('normal');
				var normalTexture = THREE.ImageUtils.loadTexture(settings.earthNormal);
			}

			var earthSpecular = null;
			if (settings.earthSpecular) {
				console.log('specular');
				var specularTexture = THREE.ImageUtils.loadTexture(settings.earthSpecular);
			}
			console.log('post');


			// Earth material material
			var earthMaterial = new THREE.MeshPhongMaterial({
				// var sphereMaterial = new THREE.MeshLambertMaterial({
				map: earthTexture,
				normalMap: normalTexture,
				specularMap: specularTexture,
				ambient: 0xffffff,
				color: 0x808080,
				specular: 0xffff80,
				shininess: 30
				// emissive: 0x808080
			});

			var sphere = new THREE.Mesh(
				new THREE.SphereGeometry(
					radius,
					segments,
					rings),
				earthMaterial);
			scene.add(sphere);
		};

		addEarth();

		var intersects = [];

		var addThing = function(thing) {
			var material = new THREE.MeshLambertMaterial({
				color: thing.color,
				ambient: thing.color
			});
			var sphere = new THREE.Mesh(new THREE.SphereGeometry(
					thing.radius,
					thing.radius*4,  // segments
					thing.radius*4),  // rings
				material);
			sphere.position.x = thing.height || 50;
			var holder = new THREE.Object3D();
			var lon = THREE.Math.degToRad(thing.lon);
			var lonAxis = new THREE.Vector3(0, 1, 0);
			var lonMatrix = new THREE.Matrix4().makeRotationAxis(lonAxis, lon);
			var lat = THREE.Math.degToRad(thing.lat);
			var latAxis = new THREE.Vector3(0, 0, 1);
			var latMatrix = new THREE.Matrix4().makeRotationAxis(latAxis, lat);
			var latLonMatrix = new THREE.Matrix4().multiplyMatrices(lonMatrix, latMatrix);
			holder.rotation.setFromRotationMatrix(latLonMatrix);
			holder.add(sphere);
			scene.add(holder);
			intersects.push(sphere);
			// thing.object = sphere;
		};

		for(var i=0; i<settings.artifacts.length; i++) {
			addThing(settings.artifacts[i]);
		};

		// add ambient lighting
		var ambientLight = new THREE.AmbientLight(settings.ambientLight);
		scene.add(ambientLight);

		// var directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
		// directionalLight.position.set( 0, 1, 0 ); scene.add(directionalLight);

		var addSun = function() {
			var sunLight = new THREE.PointLight(0xffff80);
			sunLight.position.set(-100, 200, 100);
			scene.add(sunLight);

			var sunMaterial = new THREE.MeshLambertMaterial({
				ambient: 0xffff00,
				emissive: 0xffff00
			});

			var sunSphere = new THREE.Mesh(new THREE.SphereGeometry(10,	10, 10),
										   sunMaterial);
			sunSphere.position.set(-100, 200, 100);
			scene.add(sunSphere);
		};

		if (settings.sun) {
			addSun();
		}

		var projector = new THREE.Projector();

		container.click(function(e) {
			var x =   (e.clientX / container.width()) * 2 - 1;
			// console.log(e.clientX + ' ' + container.width() + ' ' + (e.clientX / container.width()));
			var y = - (e.clientY / container.height()) * 2 + 1;
			console.log(x + ' ' + y);
			var vector = new THREE.Vector3(x, y, 1);
			projector.unprojectVector(vector, camera);
			var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
			var i = ray.intersectObjects(intersects);

			console.log('hello ' + vector.x + ' ' + vector.y + ' you hit ' + i.length + ' objects');
		});

		controls = new THREE.OrbitControls(camera, renderer.domElement);

		function animate() {
			requestAnimationFrame(animate);
			renderer.render(scene, camera);
			controls.update();
		}

		// function onResize() {
			// var width = container.width();
			// var height = container.height();
			// console.log('Resize globe to ' + width + ' x ' + height);
			// renderer.setSize(width, height);
			// camera.aspect = width / height;
			// camera.updateProjectionMatrix();
		// controls = new THREE.OrbitControls(camera, renderer.domElement);

		// function animate() {
			// requestAnimationFrame(animate);
			// renderer.render(scene, camera);
			// controls.update();
		// }

			// animate();
		// }

		// window.addEventListener('resize', onResize, false);

		animate();
		return container;
	};
}(jQuery));
