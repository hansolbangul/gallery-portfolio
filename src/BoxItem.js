import * as THREE from 'three';

export class BoxItem {
    constructor(info) {
        const imageMap = new THREE.TextureLoader().load(
            "https://source.unsplash.com/collection/" + info.index
        );
        this.geometry = new THREE.BoxGeometry(32, 18, 1);
        this.material = new THREE.MeshPhongMaterial({
            map: imageMap,
        });
        this.boxMesh = new THREE.Mesh(this.geometry, this.material);
        this.boxMesh.castShadow = true;
        let x = info.index * info.distance;
        let y = 0; //Math.random() * 40 - 5;
        let z = 0;
        this.boxMesh.position.set(x, y, z);
        this.boxMesh.name = info.index + '번 아이템';
        this.boxMesh.link = imageMap
        info.galleryGroup.add(this.boxMesh);

        //조명 넣기
        this.spotLight = new THREE.SpotLight(0xffffff, 1.2);
        this.spotLight.position.set(x, 30, 30);
        this.spotLight.angle = Math.PI / 6;
        this.spotLight.penumbra = 0.1;
        this.spotLight.decay = 1;
        this.spotLight.distance = 70;
        this.spotLight.target = this.boxMesh;
        this.spotLight.castShadow = true;

        info.galleryGroup.add(this.spotLight);
    }
}