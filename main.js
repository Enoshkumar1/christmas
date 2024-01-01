// Create scene
const scene = new THREE.Scene();

// Create camera
camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,1,1000);
camera.position.z = 3;

// Set initial camera position
const initialCameraPosition = { x: 0, y: 0, z: 3 };
camera.position.set(initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z);

// Create WebGLRenderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create stars
const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({
  color: 0xFFFFFF,
  size: 2,
});

const starsVertices = [];
for (let i = 0; i < 1000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = (Math.random() - 0.5) * 2000;

  starsVertices.push(x, y, z);
}
const stars1 = [];




starsGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(starsVertices, 3)
);

const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Handle window resize
window.addEventListener('resize', () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(newWidth, newHeight);
});

// Animation
const animate = () => {
  requestAnimationFrame(animate);

  // Move stars
  stars.rotation.x += 0.0001;
  stars.rotation.y += 0.0001;
  
  renderer.render(scene, camera);
};

// Create a group to hold the models
const modelsGroup = new THREE.Group();
scene.add(modelsGroup);



// Add a directional light to the scene
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0.1, 0.5, 0.5); // Adjust the position of the directional light
scene.add(directionalLight);

const AmbientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(AmbientLight);



// Load the 3D model
const loader = new  THREE.GLTFLoader();
let model,model2,model3;
let model2Group;

loader.load('./assets/Christmas_Tree/3dstar1.glb',
  (gltf) => {
    model = gltf.scene;

    // Set texture filtering to reduce blurriness
    model.traverse((child) => {
      if (child.isMesh && child.material.map) {
        child.material.map.minFilter = THREE.LinearFilter;
        child.material.map.magFilter = THREE.LinearFilter;
      }
    });
    model.scale.set(0.3, 0.3, 0.3); // Set initial scale
    model.position.set(-2.95,2,0);
    modelsGroup.add(model);

    // Duplicate the model two more times
    for (let i = 0; i < 2; i++) {
      const clonedModel = model.clone();
      modelsGroup.add(clonedModel);

      // Increase the scale of the third model
      if (i === 1) {
        clonedModel.scale.set(1.5, 1.5, 1.5);
      }
     
      // Add ambient light to the cloned models
      if (clonedModel.children) {
        clonedModel.children.forEach((child) => {
          if (child.isMesh) {
            child.material.emissive = new THREE.Color(0.2, 0.2, 0.2); // Adjust the emissive color as needed
          }
        });
      }

      // Adjust positions of the duplicated models as needed
      clonedModel.position.x = i * -1.45; // Example: Adjust the X position
      clonedModel.position.y = 1.65;
    }
  },
  undefined,
  (error) => {
    console.error('Error loading 3D model', error);
  }
);

loader.load('./assets/Christmas_Tree/christmastree3.glb', (gltf) => {
  model2 = gltf.scene;
  model2.scale.set(0.015, 0.015, 0.015);
  model2.position.set(-2.5, -1.5, 0);
  scene.add(model2);

 

});


        loader.load('./assets/jesus_scene13.glb', (gltf) => {
            model3 = gltf.scene;
            model3.scale.set(3,3,3)
            scene.add(model3);
            
            // Add a light with less intensity to model3
            const model3Light = new THREE.DirectionalLight(0xffffff, 1); // Adjust the intensity as needed
            model3Light.position.set(0, 5, 0); // Adjust the position of the light
            model3.position.set(0.7, -0.7, 0.1);
            model3.add(model3Light);
        });

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minPolarAngle = controls.maxPolarAngle = Math.PI / 2;
controls.enableZoom = false;


animate();

function updateForMobile() {
  const isMobile = window.innerWidth < 750; // Adjust the breakpoint as needed

  // Update camera position for mobile
  if (isMobile) {
    camera.position.set(0, 0, 5); // Adjust the mobile camera position
    // Change positions of models for mobile if they are defined
    if (model) {
      model.position.set(-0.95, 2, 0); // Adjust the position of model1 for mobile

    }
    if (model2) {
      model2.position.set(0, -1.5, 0); // Adjust the position of model2 for mobile
    }
    if (model3) {
      model3.position.set(0, -4.15, 0); // Adjust the position of model2 for mobile
    }
    // Loop through cloned models and adjust their positions
    modelsGroup.children.forEach((clonedModel, index) => {
      if (index > 0) { // Skip the original model (index 0)
        clonedModel.position.x = index * 0.08; // Adjust the X position for cloned models
        clonedModel.position.y = 1.65;
      }
    });
  } else {
    camera.position.set(initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z);
  }

  // Disable damping on mobile for better performance
  controls.enableDamping = !isMobile;
}

// Call the update function on window resize
window.addEventListener('resize', () => {
  onWindowResize();
  updateForMobile();
});

// Initial call to set up the scene
updateForMobile();
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
}

window.addEventListener("resize", onWindowResize, false);

function updateModelPosition() {
  const scrollOffset = window.scrollY;

  // Assuming model is the upside-down model
  if (model) {
    const initialY = 2; // Adjust the initial Y position as needed
    const scrollSpeed = 0.02; // Adjust the scroll speed as needed

    // Update the Y position based on the scroll offset
    model.position.y = initialY - scrollOffset * scrollSpeed;

    // Ensure the model doesn't go below a certain Y position
    const minModelY = -2; // Adjust the minimum Y position as needed
    model.position.y = Math.max(model.position.y, minModelY);
  }
}

// Listen for scroll events to update the model position
window.addEventListener('scroll', updateModelPosition);

// Call the function initially
updateModelPosition();

/* Function to update the position of model3 based on window width
const updateModel3Position = () => {
  const thresholdWidth = 0; // Adjust this threshold as needed for your design
  const isMobile = window.innerWidth < thresholdWidth;

  if (isMobile) {
    model3.position.set(0, -2, 0); // Adjust the mobile position as needed
  } else {
    model3.position.set(0.7, -0.7, 0); // Default position for larger screens
  }
};

// Listen for window resize
window.addEventListener('resize', () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(newWidth, newHeight);

  // Update the position of model3 on window resize
  updateModel3Position();
});

// Initial position update
updateModel3Position();

// ... (your existing code) */
