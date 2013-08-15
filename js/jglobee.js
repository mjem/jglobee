(function($) {
	$.fn.jglobee = function(options) {
		var container = this;

		// Define our default settings
		var defaults = {
			earthTexture: 'img/PathfinderMap.jpeg',
			earthNormal: 'img/EarthNormal-medres.jpeg',
			earthSpecular: 'img/EarthSpecular.png',
			sun: true,
			// ambientLight: 0xdddddd,
			artifacts: []
			};

		// Merge in the user settings
		var settings = $.extend({}, defaults, options);

		// Initialise an WebGL renderer
		var renderer = new THREE.WebGLRenderer({antialias:true});
		// create and start the renderer; choose antialias setting.
			// if ( Detector.webgl )
				// renderer = new THREE.WebGLRenderer( {antialias:true} );
			// else
				// renderer = new THREE.CanvasRenderer();

		renderer.setSize(container.width(), container.height());

		// Create an empty scene
		var scene = new THREE.Scene();

		// Initialise a camera
		var addCamera = function() {
			// set some camera attributes
			var VIEW_ANGLE = 45,  // focal length
				ASPECT = container.width() / container.height(),  // aspect ratio
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

		// attach ourselves to the browser DOM tree
		container.append(renderer.domElement);

		// Create the main Earth sphere
		var addEarth = function() {
			// We assume `radius` is also a reasonable number of slices to look like
			// a smooth sphere
			var radius=50,
				segments=radius,
				rings=radius;

			// Always load a main texture
			var earthTexture = THREE.ImageUtils.loadTexture(settings.earthTexture);
			// earthTexture.anisotropy = 16;

			// Normal map is optional
			var earthNormal = null;
			if (settings.earthNormal) {
				var normalTexture = THREE.ImageUtils.loadTexture(settings.earthNormal);
			}

			// Specular map is optional
			var earthSpecular = null;
			if (settings.earthSpecular) {
				var specularTexture = THREE.ImageUtils.loadTexture(settings.earthSpecular);
			}

			// Earth material material
			var earthMaterial = new THREE.MeshPhongMaterial({
				// var sphereMaterial = new THREE.MeshLambertMaterial({
				map: earthTexture,
				normalMap: normalTexture,
				specularMap: specularTexture,
				ambient: 0xffffff,
				color: 0x808080,
				specular: 0xffff80, // change the size of the reflected Sun
				shininess: 30
				// emissive: 0x808080
			});

			var sphere = new THREE.Mesh(
				new THREE.SphereGeometry(radius, segments, rings),
				earthMaterial);

			// Insert outselves into the scene
			scene.add(sphere);
		};

		addEarth();

		// A list of 3d-objects which can receive mouse clicks
		var intersects = [];

		// Insert an artifact into the scene at a lat/lon position
		var addThing = function(thing) {
			// No need for fancy lighting for such small things
			var material = new THREE.MeshLambertMaterial({
				color: thing.color,
				ambient: thing.color
			});

			// create the visible part of the artifact
			var sphere = new THREE.Mesh(new THREE.SphereGeometry(
					thing.radius,
					thing.radius*4,  // segments
					thing.radius*4),  // rings
				material);

			// Offset it to the north pole
			sphere.position.x = thing.height || 50;

			// Now we create a parent object which will be rotated into position
			var holder = new THREE.Object3D();

			// Create a rotation matrix to apply our lat/lon coordinates to a world object
			var lon = THREE.Math.degToRad(thing.lon);
			var lonAxis = new THREE.Vector3(0, 1, 0);
			var lonMatrix = new THREE.Matrix4().makeRotationAxis(lonAxis, lon);
			var lat = THREE.Math.degToRad(thing.lat);
			var latAxis = new THREE.Vector3(0, 0, 1);
			var latMatrix = new THREE.Matrix4().makeRotationAxis(latAxis, lat);
			var latLonMatrix = new THREE.Matrix4().multiplyMatrices(lonMatrix, latMatrix);

			// Spin the holder object around
			holder.rotation.setFromRotationMatrix(latLonMatrix);

			// Insert the visible thing into the holder
			holder.add(sphere);

			// Add the holder to the main scene
			scene.add(holder);

			// Only the visible part receives mouse clicks
			intersects.push(sphere);
			// thing.object = sphere;
		};

		// Insert all the artifact things
		for(var i=0; i<settings.artifacts.length; i++) {
			addThing(settings.artifacts[i]);
		};

		// add some ambient lighting
		var ambientLight = new THREE.AmbientLight(settings.ambientLight);
		scene.add(ambientLight);

		// var directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
		// directionalLight.position.set( 0, 1, 0 ); scene.add(directionalLight);

		// Add the Sun as oth a visible sphere and as a source of lighting
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

		// Convert mouse x,y clicks back to scene vectors
		var projector = new THREE.Projector();

		// Trace a line from a mouse click and test for insertections with artifacts
		container.click(function(e) {
			var x =   (e.clientX / container.width()) * 2 - 1;
			// console.log(e.clientX + ' ' + container.width() + ' ' + (e.clientX / container.width()));
			var y = - (e.clientY / container.height()) * 2 + 1;
			// console.log(x + ' ' + y);
			var vector = new THREE.Vector3(x, y, 1);
			projector.unprojectVector(vector, camera);
			var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
			var i = ray.intersectObjects(intersects);

			console.log('Click ' + vector.x + ' ' + vector.y + ' you hit ' + i.length + ' objects');
		});

		// Set up spin/zoom/pan control
		controls = new THREE.OrbitControls(camera, renderer.domElement);

		// Event loop
		function animate() {
			requestAnimationFrame(animate);
			renderer.render(scene, camera);
			controls.update();
		}

		// Attempt to handle resizing... seems to detach the mouse controls though.
		// Best to recreate the scene at application level
		// function onResize() {
			// var width = container.width();
			// var height = container.height();
			// console.log('Resize globe to ' + width + ' x ' + height);
			// renderer.setSize(width, height);
			// camera.aspect = width / height;
			// camera.updateProjectionMatrix();
		// controls = new THREE.OrbitControls(camera, renderer.domElement);
		// window.addEventListener('resize', onResize, false);

		// All done
		animate();
		return container;
	};
}(jQuery));
