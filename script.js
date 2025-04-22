/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   script.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: phudyka <phudyka@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/04/22 15:50:47 by phudyka           #+#    #+#             */
/*   Updated: 2025/04/22 19:31:16 by phudyka          ###   ########.fr       */
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

const webglContainer = document.createElement('div');
webglContainer.classList.add('webgl-container');
document.querySelector('.hero').insertBefore(webglContainer, document.querySelector('.hero-content'));

let scene, camera, renderer, particles;
let mouseX = 0, mouseY = 0;

function init3D() {
    scene = new THREE.Scene();
    
    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 30;
    
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    webglContainer.appendChild(renderer.domElement);
    
    createParticles();
    
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);
    
    animate();
}

function createParticles() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const particleCount = 3000;
    
    const pinkColor = new THREE.Color('#ff004c');
    const blueColor = new THREE.Color('#00f0b5');
    const colors = [];
    
    for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 100;
        const z = (Math.random() - 0.5) * 100;
        
        vertices.push(x, y, z);
        
        const mixRatio = Math.random();
        const color = new THREE.Color().lerpColors(pinkColor, blueColor, mixRatio);
        colors.push(color.r, color.g, color.b);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.15,
        transparent: true,
        opacity: 0.8,
        vertexColors: true,
        sizeAttenuation: true,
        depthWrite: false
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function animate() {
    requestAnimationFrame(animate);
    
    if (particles) {
        particles.rotation.x += 0.0003;
        particles.rotation.y += 0.0005;
        
        particles.rotation.x += mouseY * 0.0005;
        particles.rotation.y += mouseX * 0.0005;
        
        const time = Date.now() * 0.0005;
        particles.scale.x = 1 + Math.sin(time) * 0.1;
        particles.scale.y = 1 + Math.sin(time) * 0.1;
        particles.scale.z = 1 + Math.sin(time) * 0.1;
    }
    
    renderer.render(scene, camera);
}

if (typeof THREE !== 'undefined') {
    init3D();
} else {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = init3D;
    document.head.appendChild(script);
}

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.section-intro, .event-card, .artist-card, .gallery-item, .about-content');
    
    animatedElements.forEach(element => {
        element.classList.add('will-animate');
        observer.observe(element);
    });
});

const style = document.createElement('style');
style.textContent = `
    .will-animate {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .fade-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

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
    
    if ($('.artist-carousel').length) {
        $('.artist-carousel').slick({
            slidesToShow: 5,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
            dots: true,
            arrows: true,
            infinite: true,
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
                        setTimeout(initCarousel, 100);
                    });
                });
            });
        });
    } else {
        initCarousel();
    }
});