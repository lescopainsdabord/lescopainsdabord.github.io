/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   script.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: phudyka <phudyka@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/04/23 13:32:25 by phudyka           #+#    #+#             */
/*   Updated: 2025/04/23 14:27:51 by phudyka          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

//ANIMATION LOGO

const logoElement = document.getElementById('logo');
let logoModel;
let rotationVelocity = { x: 0, y: 0 };
let lastTime = 0;

window.addEventListener('load', () => {
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

    if (logoElement) {
        logoElement.addEventListener('mouseover', () => {
            logoElement.style.transform = 'rotate(10deg)';
        });
        
        logoElement.addEventListener('mouseout', () => {
            logoElement.style.transform = 'rotate(0deg)';
        });
    }

    initLogoAnimation();

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
    
    camera.position.z = 5;
    camera.position.y = 0;
    
    const loadingManager = new THREE.LoadingManager();
    
    const gltfLoader = new THREE.GLTFLoader(loadingManager);
    
    const fadeElement = document.getElementById('fade');


gltfLoader.load(
    'copainsdabs.glb',
    function(gltf) {
        logoModel = gltf.scene;
        
        if (window.innerWidth <= 767) {
            logoModel.scale.set(0.08, 0.08, 0.08); // Taille mobile
            logoModel.position.set(0, 0, 0);    // Position centrée
        } else {
            logoModel.scale.set(0.18, 0.18, 0.18); // Taille desktop
            logoModel.position.set(0, 0, 0); 
        }
        
        logoModel.rotation.x = 0; 
        logoModel.rotation.y = 0;
        logoModel.rotation.z = 0;
        
        logoModel.traverse(function(node) {
            if (node.isMesh) {
                const chromeMaterial = new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    metalness: 0.9, 
                    roughness: 0.1, 
                    envMapIntensity: 1.0 
                });
                
                node.material = chromeMaterial;
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        
        const box = new THREE.Box3().setFromObject(logoModel);
        const center = box.getCenter(new THREE.Vector3());
        logoModel.position.sub(center);
        
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();
        
        const environmentScene = new THREE.Scene();
        
        const lightPositions = [
            new THREE.Vector3(5, 5, 5),
            new THREE.Vector3(-5, 3, -3),
            new THREE.Vector3(0, -5, 5),
            new THREE.Vector3(3, 0, -5),
            new THREE.Vector3(-3, 5, 0)
        ];
        
        lightPositions.forEach((pos, index) => {
            const light = new THREE.PointLight(0xffffff, 100, 20);
            light.position.copy(pos);
            environmentScene.add(light);
            
            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(0.2, 16, 16),
                new THREE.MeshBasicMaterial({ color: 0xffffff })
            );
            sphere.position.copy(pos);
            environmentScene.add(sphere);
        });
        
        const bgGeometry = new THREE.SphereGeometry(100, 32, 32);
        const bgMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x111111,
            side: THREE.BackSide
        });
        const bgSphere = new THREE.Mesh(bgGeometry, bgMaterial);
        environmentScene.add(bgSphere);
        
        const envMap = pmremGenerator.fromScene(environmentScene, 0.04).texture;
        scene.environment = envMap;
        
        pmremGenerator.dispose();
        
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
    
    let isDragging = false;
    let previousMousePosition = {
        x: 0,
        y: 0
    };
    let dragStartTime = 0;
    let lastDragTime = 0;
    let initialY = window.scrollY;
    
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchend', onTouchEnd);
    
    function onMouseDown(event) {
        event.preventDefault();
        isDragging = true;
        dragStartTime = Date.now();
        lastDragTime = dragStartTime;
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
        initialY = window.scrollY;
        rotationVelocity = { x: 0, y: 0 };
    }
    
    function onTouchStart(event) {
        event.preventDefault();
        if (event.touches.length === 1) {
            isDragging = true;
            dragStartTime = Date.now();
            lastDragTime = dragStartTime;
            previousMousePosition = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY
            };
            initialY = window.scrollY;
            rotationVelocity = { x: 0, y: 0 };
        }
    }
    
    function onMouseMove(event) {
        if (!isDragging) return;
        
        const now = Date.now();
        const deltaTime = (now - lastDragTime) / 1000;
        lastDragTime = now;
        
        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y
        };
        
        if (Math.abs(deltaMove.y) > Math.abs(deltaMove.x) * 2) {
            isDragging = false;
            return;
        }
        
        if (deltaTime > 0) {
            rotationVelocity = {
                x: deltaMove.y * 0.01 / deltaTime,
                y: deltaMove.x * 0.01 / deltaTime
            };
            
            rotateLogo(deltaMove);
        }
        
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
    
    function onTouchMove(event) {
        if (!isDragging || event.touches.length !== 1) return;
        
        const touchY = event.touches[0].clientY;
        const touchDeltaY = Math.abs(touchY - previousMousePosition.y);
        const touchX = event.touches[0].clientX;
        const touchDeltaX = Math.abs(touchX - previousMousePosition.x);
        
        if (touchDeltaY > touchDeltaX * 1.5 && touchDeltaY > 10) {
            isDragging = false;
            return;
        }
        
        event.preventDefault();
        
        const now = Date.now();
        const deltaTime = (now - lastDragTime) / 1000;
        lastDragTime = now;
        
        const deltaMove = {
            x: touchX - previousMousePosition.x,
            y: touchY - previousMousePosition.y
        };
        
        if (deltaTime > 0) {
            rotationVelocity = {
                x: deltaMove.y * 0.01 / deltaTime,
                y: deltaMove.x * 0.01 / deltaTime
            };
            
            rotateLogo(deltaMove);
        }
        
        previousMousePosition = {
            x: touchX,
            y: touchY
        };
    }
    
    function onMouseUp(event) {
        isDragging = false;
    }
    
    function onTouchEnd(event) {
        isDragging = false;
    }
    
    function rotateLogo(deltaMove) {
        if (!logoModel) return;
        
        logoModel.rotation.y += deltaMove.x * 0.01;
        logoModel.rotation.x = Math.max(-0.5, Math.min(0.5, logoModel.rotation.x + deltaMove.y * 0.01));
    }
    
    function animate(time) {
        requestAnimationFrame(animate);
        
        const deltaTime = (time - lastTime) / 1000;
        lastTime = time;
        
        const heroRect = heroSection.getBoundingClientRect();
        const isVisible = heroRect.top < window.innerHeight && heroRect.bottom > 0;
        
        if (isVisible) {
            if (logoModel && !isDragging) {
                const friction = 0.95;
                
                rotationVelocity.x *= friction;
                rotationVelocity.y *= friction;
                
                if (Math.abs(rotationVelocity.x) > 0.001 || Math.abs(rotationVelocity.y) > 0.001) {
                    logoModel.rotation.x = Math.max(-0.5, Math.min(0.5, logoModel.rotation.x + rotationVelocity.x * deltaTime));
                    logoModel.rotation.y += rotationVelocity.y * deltaTime;
                } else {
                    rotationVelocity.x = 0;
                    rotationVelocity.y = 0;
                }
                
                const autoRotationSpeed = 0.1;
                if (Math.abs(rotationVelocity.y) < 0.1) {
                    logoModel.rotation.y += autoRotationSpeed * deltaTime;
                }
                
                const floatY = Math.sin(time * 0.0005) * 0.05;
                logoModel.position.y = floatY;
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
                logoModel.scale.set(0.8, 0.8, 0.8);
                logoModel.position.y = 0;
            } else {
                logoModel.scale.set(1.5, 1.5, 1.5);
                logoModel.position.y = 0;
            }
        }
    });    
    animate(0);
}

document.addEventListener('DOMContentLoaded', () => {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseover', () => {
            const emoji = card.querySelector('.product-emoji');
            if (emoji) {
                emoji.style.transform = 'scale(1.2)';
                emoji.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseout', () => {
            const emoji = card.querySelector('.product-emoji');
            if (emoji) {
                emoji.style.transform = 'scale(1)';
            }
        });
    });
});

//OTHER
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
        console.error("jQuery or Slick not loaded");
        return;
    }
    
    const carousel = $('.artist-carousel');
    
    if (carousel.length === 0) {
        console.warn("Carousel element '.artist-carousel' not found in the DOM");
        return;
    }
    
    // Make sure slides exist before initializing
    if (carousel.children().length === 0) {
        console.warn("Carousel has no child elements to display");
        return;
    }
    
    carousel.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
        if (!slick.$slides || slick.$slides.length === 0) {
            return; // Avoid errors if slides aren't available
        }
        
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
    
    // Initialize the carousel with a slight delay to ensure DOM is ready
    setTimeout(() => {
        if (carousel.length) {
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
    }, 500);
}

document.addEventListener('DOMContentLoaded', function() {
    function loadSlickDependencies() {
        if (typeof $ === 'undefined') {
            const jqueryScript = document.createElement('script');
            jqueryScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js';
            jqueryScript.onload = function() {
                const slickCSS = document.createElement('link');
                slickCSS.rel = 'stylesheet';
                slickCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css';
                document.head.appendChild(slickCSS);
                
                const slickThemeCSS = document.createElement('link');
                slickThemeCSS.rel = 'stylesheet';
                slickThemeCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css';
                document.head.appendChild(slickThemeCSS);
                
                const slickScript = document.createElement('script');
                slickScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js';
                slickScript.onload = function() {
                    setTimeout(initCarousel, 500);
                };
                document.head.appendChild(slickScript);
            };
            document.head.appendChild(jqueryScript);
        } else {
            const slickCSS = document.createElement('link');
            slickCSS.rel = 'stylesheet';
            slickCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css';
            document.head.appendChild(slickCSS);
            
            const slickThemeCSS = document.createElement('link');
            slickThemeCSS.rel = 'stylesheet';
            slickThemeCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css';
            document.head.appendChild(slickThemeCSS);
            
            const slickScript = document.createElement('script');
            slickScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js';
            slickScript.onload = function() {
                setTimeout(initCarousel, 500);
            };
            document.head.appendChild(slickScript);
        }
    }
    
    loadSlickDependencies();
});