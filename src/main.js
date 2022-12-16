import gsap from 'gsap'
import * as THREE from 'three';
import { BoxItem } from '../../../../포트폴리오 웹 사이트/gallery/bridge/src/BoxItem';
import { PreventDragClick } from './PreventDragClick';

// 갤러리 웹 포트폴리오 제작

const totalNum = 10; //전체 액자 갯수
const distance = 100;
const noDragSize = 20;
let moveX = 0;
let pageNum = 0;
let targetNum = 0;
let itemArr = [];
let isPressed = false;

// Renderer
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
	canvas,
	antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#000000"); //배경 컬러

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 50);

scene.add(camera);

// Light
var light = new THREE.HemisphereLight(0xffffff, 0x080820, 0.8);
light.position.set(0, 50, 50);
scene.add(light);

//가벽 만들기
const wallWidth = distance * totalNum + distance;
const geometry = new THREE.BoxGeometry(wallWidth, 100, 2);
const material = new THREE.MeshPhongMaterial({
	color: 0x464946,
});
const wallMesh = new THREE.Mesh(geometry, material);

wallMesh.position.set(wallWidth / 2 - distance, 0, -1.5);
wallMesh.receiveShadow = true;
// wallMesh.castShadow = true;

let galleryGroup = new THREE.Group();

galleryGroup.add(wallMesh);
scene.add(galleryGroup);

for (let i = 0; i < totalNum; i++) {
	itemArr.push(new BoxItem({ galleryGroup, index: i, distance }));
}

// RayCaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
function checkIntersects() {
	raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObjects(scene.children);

	for (const item of intersects) {
		console.log(item);
		break;
	}
}


const draw = () => {
	// controls.update();

	moveX += (targetNum - moveX) * 0.05;
	gsap.to(galleryGroup.position, {
		duration: 1,
		// delay: 0.8,
		x: moveX,
		// ease: "Power2.easeInOut",
	});
	// galleryGroup.position.x = moveX;

	camera.lookAt(scene.position);
	camera.updateProjectionMatrix();
	renderer.render(scene, camera);
	requestAnimationFrame(draw);
};

let timeout;
const scrollFunc = (event) => {
	clearTimeout(timeout);  //이전 휠 이벤트 제거
	timeout = setTimeout(function () { //다시 휠 이벤트 발생  0.1초후
		if (event.deltaY < 0) {
			if (pageNum > 0) {
				pageNum -= 1;
			}
		} else {
			if (pageNum < totalNum - 1) {
				pageNum += 1;
			}
		}
		targetNum = -(pageNum * distance);
	}, 100);
};

const setSize = () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.render(scene, camera);
}

// 이벤트
const preventDragClick = new PreventDragClick(canvas);

canvas.addEventListener("wheel", scrollFunc);
canvas.addEventListener('click', e => {
	if (preventDragClick.mouseMoved) return;
	mouse.x = e.clientX / canvas.clientWidth * 2 - 1;
	mouse.y = -(e.clientY / canvas.clientHeight * 2 - 1);
	checkIntersects();
});

// 드레그 이벤트
let dragX = 0;
const calculateMousePosition = (event) => {
	console.log(event)
	if (isPressed) {
		dragX = event.clientX;
	} else {
		let mathDrag = dragX - event.clientX
		if (Math.abs(mathDrag) < noDragSize) return
		if (mathDrag > 0) {
			if (pageNum < totalNum - 1) {
				pageNum += 1;
			}
		} else {
			if (pageNum > 0) {
				pageNum -= 1;
			}
		}
		targetNum = -(pageNum * distance);
	}
}

// 마우스 이벤트
canvas.addEventListener('mouseup', e => {
	isPressed = false;
	calculateMousePosition(e);
});
canvas.addEventListener('mousedown', e => {
	isPressed = true;
	calculateMousePosition(e);
});

// 터치 이벤트
canvas.addEventListener('touchstart', e => {
	isPressed = true;
	calculateMousePosition(e.touches[0]);
});
canvas.addEventListener('touchend', e => {
	isPressed = false;
	console.log('touch');
	calculateMousePosition(e.changedTouches[0]);
});

// 윈도우 리사이즈
window.addEventListener('resize', setSize);


draw();
