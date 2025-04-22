/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   script.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: phudyka <phudyka@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/04/22 15:50:47 by phudyka           #+#    #+#             */
/*   Updated: 2025/04/23 00:46:25 by phudyka          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const header = document.querySelector('header');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.nav-link');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mainNav.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
    });
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

function initLogoAnimation() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    const animationContainer = document.createElement('div');
    animationContainer.id = 'logo-animation';
    animationContainer.style.position = 'absolute';
    animationContainer.style.top = '0';
    animationContainer.style.left = '0';
    animationContainer.style.width = '100%';
    animationContainer.style.height = '100%';
    animationContainer.style.zIndex = '0';
    animationContainer.style.pointerEvents = 'none';
    
    heroSection.insertBefore(animationContainer, heroSection.firstChild);
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    animationContainer.appendChild(renderer.domElement);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    scene.add(mainLight);
    
    const accentLight = new THREE.DirectionalLight(0xffebcd, 0.6);
    accentLight.position.set(-5, 2, -3);
    scene.add(accentLight);
    
    const rimLight = new THREE.SpotLight(0xf5deb3, 0.8);
    rimLight.position.set(0, -3, 5);
    rimLight.angle = Math.PI / 4;
    rimLight.penumbra = 0.5;
    rimLight.castShadow = true;
    scene.add(rimLight);

    const spotLight1 = new THREE.SpotLight(0x64ccda, 2.5); // Bleu clair
    spotLight1.position.set(5, 8, 3);
    spotLight1.angle = Math.PI / 6;
    spotLight1.penumbra = 0.3;
    spotLight1.castShadow = true;
    spotLight1.shadow.bias = -0.0001;
    scene.add(spotLight1);

    const spotLight2 = new THREE.SpotLight(0xff9d76, 2.0); // Orange clair
    spotLight2.position.set(-7, 3, 4);
    spotLight2.angle = Math.PI / 8;
    spotLight2.penumbra = 0.4;
    spotLight2.castShadow = false;
    scene.add(spotLight2);

    const spotLight3 = new THREE.SpotLight(0xffffff, 1.8); // Blanc
    spotLight3.position.set(0, -4, 8);
    spotLight3.angle = Math.PI / 5;
    spotLight3.penumbra = 0.5;
    spotLight3.castShadow = false;
    scene.add(spotLight3);

    // Ajouter une lumière ponctuelle sous l'objet pour l'effet "showcase"
    const pointLight = new THREE.PointLight(0xffffff, 1.2);
    pointLight.position.set(0, -3, 0);
    scene.add(pointLight);
    
    camera.position.z = 5;
    camera.position.y = 0;
    
    // Définir une texture pour l'environnement si disponible
    let environmentTexture = null;
    try {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            'https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg',
            function(texture) {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                scene.environment = texture;
                environmentTexture = texture;
            },
            undefined,
            function(error) {
                console.log('Impossible de charger la texture d\'environnement:', error);
            }
        );
    } catch(e) {
        console.log('Erreur lors de la création de l\'environnement:', e);
    }
    
    const loadingManager = new THREE.LoadingManager();
    const gltfLoader = new THREE.GLTFLoader(loadingManager);
    const fadeElement = document.getElementById('fade');
    
    let logoModel = null;
    let lastTime = 0;

    gltfLoader.load(
        'copainsdabs.glb',
        function(gltf) {
            logoModel = gltf.scene;
            
            if (window.innerWidth <= 767) {
                logoModel.scale.set(2.7, 2.7, 2.7);
                logoModel.position.set(0, 0.5, 0);
            } else {
                logoModel.scale.set(5.0, 5.0, 5.0);
                logoModel.position.set(0, 2.0, 0);
            }
            
            logoModel.rotation.x = -0.3; 
            logoModel.rotation.y = 0.1;
            logoModel.rotation.z = 0.15;
            
            logoModel.traverse(function(node) {
                if (node.isMesh) {
                    // Créer un matériau de verre
                    const glassMaterial = new THREE.MeshPhysicalMaterial({
                        color: 0xffffff,          // Couleur de base blanche
                        transparent: true,         // Activer la transparence
                        opacity: 0.4,              // Niveau de transparence
                        roughness: 0.1,            // Surface très lisse
                        metalness: 0.2,            // Légèrement métallique pour les reflets
                        clearcoat: 1.0,            // Couche de vernis maximale
                        clearcoatRoughness: 0.1,   // Vernis presque parfait
                        transmission: 0.95,        // Transmission de la lumière
                        ior: 1.5,                  // Indice de réfraction (verre)
                        side: THREE.DoubleSide     // Rendre les deux côtés
                    });
                    
                    node.material = glassMaterial;
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            
            scene.add(logoModel);
            animationContainer.style.pointerEvents = 'auto';

            if (fadeElement) {
                fadeElement.style.opacity = '0';
                setTimeout(() => {
                    fadeElement.style.display = 'none';
                }, 500);
            }
        },
        function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function(error) {
            console.error('An error happened loading the GLTF model:', error);
        }
    );
    
    function animate(time) {
        requestAnimationFrame(animate);
        
        const deltaTime = (time - lastTime) / 1000;
        lastTime = time;
        
        const heroRect = heroSection.getBoundingClientRect();
        const isVisible = heroRect.top < window.innerHeight && heroRect.bottom > 0;
        
        if (isVisible) {
            if (logoModel) {
                const floatY = Math.sin(time * 0.001) * 0.1;
                const baseY = window.innerWidth <= 767 ? 0.3 : -0.7;
                logoModel.position.y = floatY + baseY; 
            }
            
            renderer.render(scene, camera);
        }
    }
    
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
        
        if (logoModel) {
            if (width <= 767) {
                logoModel.scale.set(2.7, 2.7, 2.7);
                logoModel.position.set(0, 0.5, 0);
            } else {
                logoModel.scale.set(5.0, 5.0, 5.0);
                logoModel.position.set(0, 2.0, 0);
            }
        }
    });
    
    window.addEventListener('scroll', () => {
        const heroRect = heroSection.getBoundingClientRect();
        if (heroRect.bottom < 0 || heroRect.top > window.innerHeight) {
            animationContainer.style.pointerEvents = 'none';
        } else {
            animationContainer.style.pointerEvents = 'auto';
        }
    });
    
    animate(0);
}

// Attendre que THREE.js soit chargé avant d'initialiser l'animation
document.addEventListener('DOMContentLoaded', function() {
    // Création de l'overlay de fondu
    const fadeOverlay = document.createElement('div');
    fadeOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: black;
        opacity: 1;
        z-index: 9999;
        transition: opacity 2.0s ease-out;
    `;
    document.body.appendChild(fadeOverlay);

    // Fondu au noir initial
    setTimeout(() => {
        fadeOverlay.style.opacity = '0';
        setTimeout(() => {
            fadeOverlay.remove();
        }, 500);
    }, 100);

    function loadScript(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        document.head.appendChild(script);
    }
    
    // Vérifier si THREE.js est déjà chargé
    if (typeof THREE === 'undefined') {
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/three.min.js', function() {
            loadScript('https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/loaders/GLTFLoader.js', function() {
                // Une fois que THREE.js et GLTFLoader sont chargés, on peut initialiser l'animation
                initLogoAnimation();
            });
        });
    } else if (typeof THREE.GLTFLoader === 'undefined') {
        loadScript('https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/loaders/GLTFLoader.js', function() {
            initLogoAnimation();
        });
    } else {
        initLogoAnimation();
    }

    // Autres initialisations du document
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });

    const logoElement = document.getElementById('logo');
    if (logoElement) {
        logoElement.addEventListener('mouseover', () => {
            logoElement.style.transform = 'rotate(10deg)';
        });
        
        logoElement.addEventListener('mouseout', () => {
            logoElement.style.transform = 'rotate(0deg)';
        });
    }

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const scrollArrow = document.createElement('div');
        scrollArrow.className = 'scroll-arrow';
        heroSection.appendChild(scrollArrow);
        
        scrollArrow.addEventListener('click', function() {
            const nouveautesSection = document.querySelector('#featured');
            if (nouveautesSection) {
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = nouveautesSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
});

const webglContainer = document.createElement('div');
webglContainer.classList.add('webgl-container');
document.querySelector('.hero').insertBefore(webglContainer, document.querySelector('.hero-content'));

let heroScene, heroCamera, heroRenderer, logoModel, heroClock;
let mouseX = 0, mouseY = 0;

function initHeroScene() {
    heroClock = new THREE.Clock();
    heroScene = new THREE.Scene();
    heroScene.background = new THREE.Color(0x000000);
    
    heroCamera = new THREE.PerspectiveCamera(60, 16/9, 0.1, 1000);
    heroCamera.position.set(0, 0, 12);
    heroCamera.lookAt(0, 0, 0);
    
    const heroCanvas = document.getElementById('hero-canvas');
    
    heroRenderer = new THREE.WebGLRenderer({
        canvas: heroCanvas,
        antialias: true,
        alpha: true
    });
    
    heroRenderer.setSize(window.innerWidth, window.innerHeight);
    heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    heroScene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    heroScene.add(directionalLight);

    const spotLight1 = new THREE.SpotLight(0x64ccda, 2.5); // Bleu clair
    spotLight1.position.set(8, 10, 5);
    spotLight1.angle = Math.PI / 6;
    spotLight1.penumbra = 0.3;
    heroScene.add(spotLight1);

    const spotLight2 = new THREE.SpotLight(0xff9d76, 2.0); // Orange clair
    spotLight2.position.set(-10, 5, 7);
    spotLight2.angle = Math.PI / 8;
    spotLight2.penumbra = 0.4;
    heroScene.add(spotLight2);

    // Ajouter un effet de lumière dynamique
    const pulsingLight = new THREE.PointLight(0xffffff, 1.5);
    pulsingLight.position.set(0, 0, 10);
    heroScene.add(pulsingLight);

    // Stocker la référence à cette lumière pour l'animation
    heroScene.userData.pulsingLight = pulsingLight;
    
    try {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            'https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg',
            function(texture) {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                heroScene.environment = texture;
            },
            undefined,
            function(error) {
                console.log('Impossible de charger la texture d\'environnement:', error);
            }
        );
    } catch(e) {
        console.log('Erreur lors de la création de l\'environnement:', e);
    }
    
    if (typeof THREE.GLTFLoader !== 'undefined') {
        const loader = new THREE.GLTFLoader();
        
        loader.load(
            'copainsdabs.glb',
            function (gltf) {
                logoModel = gltf.scene;
                
                const box = new THREE.Box3().setFromObject(logoModel);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                logoModel.position.set(-center.x, -center.y, -center.z);
                
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 10.5 / maxDim;
                logoModel.scale.set(scale, scale, scale);
                
                logoModel.traverse((child) => {
                    if (child.isMesh) {
                        const glassMaterial = new THREE.MeshPhysicalMaterial({
                            color: 0xffffff,          // Couleur de base blanche
                            transparent: true,         // Activer la transparence
                            opacity: 0.4,              // Niveau de transparence
                            roughness: 0.1,            // Surface très lisse
                            metalness: 0.2,            // Légèrement métallique
                            clearcoat: 1.0,            // Couche de vernis maximale
                            clearcoatRoughness: 0.1,   // Vernis presque parfait
                            transmission: 0.95,        // Transmission de la lumière
                            ior: 1.5,                  // Indice de réfraction (verre)
                            side: THREE.DoubleSide     // Rendre les deux côtés
                        });
                        
                        child.material = glassMaterial;
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                
                logoModel.userData.isLogo = true;
                heroScene.add(logoModel);
                
                logoModel.position.set(0, -5, 0);
            },
            undefined,
            function (error) {
                console.error('Erreur de chargement GLB:', error);
                createFallbackCube();
            }
        );
    } else {
        createFallbackCube();
    }
    window.addEventListener('resize', onHeroResize);
    
    animateHero();
}

function createFallbackCube() {
    const geometry = new THREE.BoxGeometry(3, 3, 3);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0xff0000,
        metalness: 0.5,
        roughness: 0.2
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, 0);
    heroScene.add(cube);
}

function onHeroResize() {
    const container = document.querySelector('.hero-3d');
    const width = container.clientWidth;
    const height = width * (9/16);
    
    heroCamera.aspect = 16/9;
    heroCamera.updateProjectionMatrix();
    heroRenderer.setSize(width, height);
}

function animateHero() {
    requestAnimationFrame(animateHero);
    
    const time = heroClock.getElapsedTime();
    
    if (logoModel) {
        logoModel.rotation.y = time * 0.5;
        
        heroScene.traverse((object) => {
            if (object !== logoModel && object.userData.isLogo) {
                heroScene.remove(object);
            }
        });
    }
    
    heroCamera.position.x += (mouseX * 0.1 - heroCamera.position.x) * 0.05;
    heroCamera.position.y += (-mouseY * 0.1 - heroCamera.position.y) * 0.05;
    heroCamera.lookAt(0, 0, 0);
    
    heroRenderer.render(heroScene, heroCamera);
}

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;
});

document.addEventListener('DOMContentLoaded', function() {
    function loadScript(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        document.head.appendChild(script);
    }
    
    if (typeof THREE === 'undefined') {
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/three.min.js', function() {
            loadScript('https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/loaders/GLTFLoader.js', function() {
                initHeroScene();
            });
        });
    } else if (typeof THREE.GLTFLoader === 'undefined') {
        loadScript('https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/loaders/GLTFLoader.js', function() {
            initHeroScene();
        });
    } else {
        initHeroScene();
    }
});

function initMap() {
    const location = [43.59614185964346, 7.056742264584779]; 
    
    const map = L.map('map').setView(location, 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    L.marker(location).addTo(map)
        .bindPopup("Les Copains d'Abord")
        .openPopup();
}

const leafletCSS = document.createElement('link');
leafletCSS.rel = 'stylesheet';
leafletCSS.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
document.head.appendChild(leafletCSS);

const leafletScript = document.createElement('script');
leafletScript.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
leafletScript.onload = initMap;
document.head.appendChild(leafletScript);

document.addEventListener('DOMContentLoaded', function() {
    if (typeof $ !== 'undefined') {
        initCarousel();
    } else {
        const jqueryScript = document.createElement('script');
        jqueryScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js';
        jqueryScript.onload = function() {
            const slickScript = document.createElement('script');
            slickScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js';
            slickScript.onload = initCarousel;
            document.head.appendChild(slickScript);
            
            const slickCSS = document.createElement('link');
            slickCSS.rel = 'stylesheet';
            slickCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css';
            document.head.appendChild(slickCSS);
            
            const slickThemeCSS = document.createElement('link');
            slickThemeCSS.rel = 'stylesheet';
            slickThemeCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css';
            document.head.appendChild(slickThemeCSS);
        };
        document.head.appendChild(jqueryScript);
    }
});

function initCarousel() {
    if (typeof $ === 'undefined' || typeof $.fn.slick === 'undefined') {
        console.error("jQuery ou Slick non chargés");
        return;
    }
    
    const carousel = $('.artist-carousel');
    
    // Vérifier que l'élément carousel existe avant d'appeler slick
    if (carousel.length) {
        carousel.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
            const slidesToPreload = 5;
            
            for (let i = 0; i < slidesToPreload; i++) {
                const slideIndex = (nextSlide + i) % slick.slideCount;
                const $slideToLoad = $(slick.$slides[slideIndex]);
                
                $slideToLoad.find('img[data-lazy]').each(function() {
                    const $img = $(this);
                    if ($img.attr('data-lazy') && !$img.attr('src')) {
                        $img.attr('src', $img.attr('data-lazy'));
                    }
                });
                
                $slideToLoad.find('img').each(function() {
                    const $img = $(this);
                    if ($img.attr('src') && !$img.prop('complete')) {
                        const imgSrc = $img.attr('src');
                        $img.attr('src', '');
                        setTimeout(() => $img.attr('src', imgSrc), 10);
                    }
                });
            }
        });
        
        carousel.slick({
            slidesToShow: 5,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
            dots: true,
            arrows: true,
            infinite: true,
            lazyLoad: 'anticipated',
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 4
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        centerMode: true,
                        centerPadding: '40px'
                    }
                }
            ]
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    function loadScript(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        document.head.appendChild(script);
    }
    
    function loadCSS(href, callback) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = callback;
        document.head.appendChild(link);
    }
    
    if (typeof $ === 'undefined') {
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js', function() {
            loadCSS('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css', function() {
                loadCSS('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css', function() {
                    loadScript('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js', function() {
                        setTimeout(initCarousel, 300);
                    });
                });
            });
        });
    } else {
        setTimeout(initCarousel, 300);
    }
});