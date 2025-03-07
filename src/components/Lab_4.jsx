import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Lab_4 = () => {
    const canvas = useRef();

    useEffect(() => {
        if (!canvas.current) return;

        // Configuración del renderizador
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        canvas.current.appendChild(renderer.domElement);

        // Configuración de la escena
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87ceeb); // Azul claro como fondo

        // Luz ambiental para mejorar la visualización
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        // Luz direccional para sombras
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Crear el plano (superficie de la mesa)
        const planeGeometry = new THREE.PlaneGeometry(10, 10);
        const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22, side: THREE.DoubleSide });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        scene.add(plane);

        // Función para crear barreras de la mesa
        const createBarrier = (width, height, depth, x, y, z) => {
            const barrier = new THREE.Mesh(
                new THREE.BoxGeometry(width, height, depth),
                new THREE.MeshStandardMaterial({ color: 0x8b4513 }) // Marrón tipo madera
            );
            barrier.position.set(x, y, z);
            scene.add(barrier);
        };

        // Crear las barreras
        const barrierHeight = 0.5;
        createBarrier(10.5, barrierHeight, 1, 0, barrierHeight / 2, 5.5); // Borde superior
        createBarrier(10.5, barrierHeight, 1, 0, barrierHeight / 2, -5.5); // Borde inferior
        createBarrier(1, barrierHeight, 10.5, 5.5, barrierHeight / 2, 0); // Borde derecho
        createBarrier(1, barrierHeight, 10.5, -5.5, barrierHeight / 2, 0); // Borde izquierdo

        // Función para crear el pato (esfera, cono y cubo)
        const createDuck = (position, colour, rotation) => {

            
            // Color amarillo para todas las partes del pato
            const yellowMaterial = new THREE.MeshStandardMaterial({ color: colour });

            // Crear cabeza (esfera)
            const headGeometry = new THREE.SphereGeometry(0.5);
            const head = new THREE.Mesh(headGeometry, yellowMaterial);
            head.position.set(position.x, position.y + 1, position.z+0.5);
            scene.add(head);

            // Crear pico (cono)
            const beakGeometry = new THREE.ConeGeometry(0.3, 0.6, 32);
            const beak = new THREE.Mesh(beakGeometry, yellowMaterial);
            beak.position.set(position.x, position.y + 1, position.z + 1);
            beak.rotation.x = rotation;
            //beak.rotation.y = rotation;  // Rotar el cono para que apunte hacia adelante
            scene.add(beak);

            // Crear cuerpo (cubo)
            const bodyGeometry = new THREE.BoxGeometry(1, 1, 1.3);
            const body = new THREE.Mesh(bodyGeometry, yellowMaterial);
            body.position.set(position.x, position.y+0.51, position.z);
            scene.add(body);

            return { head, beak, body };
        };

        // Crear el pato en la posición deseada
        const duckPosition = { x: -4, y: 0, z: -4 };
        const duckColor = 0xFFFFFF;
        const duck = createDuck(duckPosition, duckColor, Math.PI / 2);
        createDuck({ x: -4, y: 0, z: -2 }, 0xFFFF00, Math.PI / 2);
        createDuck({ x: 3, y: 0, z: 3 }, 0xFF0000,90  );
        createDuck({ x: -3, y: 0, z: 2 }, 0x00FF00, Math.PI / 2);
        createDuck({ x: 2, y: 0, z: -2 }, 0x0000FF,Math.PI / 2);

        // Función de animación
        const animate = function () {
            requestAnimationFrame(animate);

            // Rotar el pato (todas sus partes) sobre el eje X
            duck.head.rotation.y += 0;
            duck.beak.rotation.y += 0;
            duck.body.rotation.y += 0.01;
    
            if (duck.beak.rotation.x > 1){

                duck.beak.rotation.x +=0.01;
            }if(duck.beak.rotation.x < 1){
                duck.beak.rotation.x -=0.01;
            }
            

            // Renderizar la escena
            renderer.render(scene, camera);
        };

        // Crear cámara
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 5, 10);
        camera.lookAt(0, 0, 0);
        scene.add(camera);

        // Configurar OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        animate(); // Comenzar la animación
    }, []);

    return <div ref={canvas} />;
};

export default Lab_4;
