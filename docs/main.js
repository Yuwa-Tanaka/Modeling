/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls.js */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");


// --- シーンの基本設定 ---
const scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();
const camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new three__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// --- カメラ操作 (OrbitControls) ---
const controls = new three_examples_jsm_controls_OrbitControls_js__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 動きを滑らかにする
controls.dampingFactor = 0.05; // 減衰係数
// --- テクスチャのロード ---
const textures = [];
const textureLoader = new three__WEBPACK_IMPORTED_MODULE_1__.TextureLoader();
// 竜巻を構成する画像ファイル名
const imageFiles = ['DUAJ7008.PNG', 'QPFN6908.PNG', 'SYSN2107.PNG', 'VLYN1227.PNG'];
// 全てのテクスチャを非同期でロードし、完了後にinitとanimateを開始
Promise.all(imageFiles.map(file => textureLoader.loadAsync(file)))
    .then(loadedTextures => {
    loadedTextures.forEach(texture => {
        textures.push(texture);
    });
    init(); // 初期化処理
    animate(); // アニメーションループ開始
})
    .catch(error => {
    console.error('テクスチャのロードに失敗しました', error);
});
// --- 竜巻を構成する要素に関する定数と変数 ---
const planes = []; // 竜巻の各画像を格納する配列
const numberOfInstancesPerImage = 300; // 各画像につき生成するインスタンス数
const tornadoHeight = 40; // 竜巻の高さ
const bottomRadius = 1.5; // 竜巻の底の半径 (下から上へ広がるため小さい)
const spreadRadius = 10; // 竜巻の上部の半径 (下から上へ広がるため大きい)
const tornadoGroup = new three__WEBPACK_IMPORTED_MODULE_1__.Group(); // 竜巻全体を管理するためのグループ
scene.add(tornadoGroup); // シーンにグループを追加
// --- キーボード操作の状態管理 ---
const keyState = {
    w: false, a: false, s: false, d: false,
    arrowUp: false, arrowDown: false, arrowLeft: false, arrowRight: false
};
const moveSpeed = 1; // 竜巻の移動速度
// --- 建物の管理 ---
const buildings = []; // シーン内の建物オブジェクトを格納する配列
// --- 初期化処理 ---
function init() {
    // カメラの初期位置と注視点の設定 (地面の下から竜巻を見上げるように)
    camera.position.set(0, 25, 50);
    camera.lookAt(0, -tornadoHeight / 2, 0);
    // 背景色を空色に設定
    scene.background = new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x87CEEB); // Sky Blue
    // --- 竜巻を構成する画像の生成ループ ---
    textures.forEach((texture, textureIndex) => {
        const material = new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({
            map: texture,
            side: three__WEBPACK_IMPORTED_MODULE_1__.DoubleSide,
            transparent: true,
            opacity: 0.8,
            alphaTest: 0.1 // 透過部分のチラつき軽減
        });
        const geometry = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(2, 2); // 個々の画像のサイズ (幅1, 高さ1)
        for (let i = 0; i < numberOfInstancesPerImage; i++) {
            const plane = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(geometry, material);
            // 竜巻のY軸方向の初期位置 (下から上へループするので初期は下側)
            const initialY = Math.random() * -tornadoHeight;
            // Y位置に応じた螺旋の半径を計算 (下から上へ広がる形状)
            const normalizedY = (initialY + tornadoHeight) / tornadoHeight; // 0(下端)～1(上端)に正規化
            const currentRadius = bottomRadius + normalizedY * (spreadRadius - bottomRadius);
            // 初期位置を螺旋状に配置
            const angle = Math.random() * Math.PI * 2; // ランダムな初期角度
            plane.position.x = Math.cos(angle) * currentRadius;
            plane.position.y = initialY + tornadoHeight / 2; // 原点が竜巻の中心になるようオフセット
            plane.position.z = Math.sin(angle) * currentRadius;
            // ランダムな初期回転
            plane.rotation.x = Math.random() * Math.PI * 2;
            plane.rotation.y = Math.random() * Math.PI * 2;
            plane.rotation.z = Math.random() * Math.PI * 2;
            // ランダムなスケール
            const scale = 0.5 + Math.random() * 0.5; // 0.5～1.0の範囲
            plane.scale.set(scale, scale, scale);
            // アニメーション制御用のデータをuserDataに格納
            plane.userData = {
                initialAngle: angle,
                currentY: plane.position.y,
                fallSpeed: -(0.05 + Math.random() * 0.05),
                rotationSpeedAroundAxis: 0.05 + Math.random() * 0.05,
                individualRotationSpeed: new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(// 個別のランダムな回転速度
                (Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 0.05),
                yAxisRotationSpeed: (Math.random() - 0.5) * 0.03 // 個別のY軸周り回転速度
            };
            tornadoGroup.add(plane); // 竜巻グループに追加
            planes.push(plane); // アニメーションループ用に格納
        }
    });
    // --- 地面の生成とテクスチャ設定 ---
    const groundTextureLoader = new three__WEBPACK_IMPORTED_MODULE_1__.TextureLoader();
    const groundSizeMultiplier = 10; // 地面のサイズ乗数
    // 地面のGeometry (広さ、分割数)
    const groundGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(bottomRadius * 4 * groundSizeMultiplier, bottomRadius * 4 * groundSizeMultiplier, 64, 64);
    // 地面の色とディスプレイスメントマップを同時にロード
    Promise.all([
        groundTextureLoader.loadAsync('stone.png'),
        groundTextureLoader.loadAsync('stone.png') // ディスプレイスメントマップ (同じファイルを使用)
    ]).then(([stoneTexture, displacementMap]) => {
        // テクスチャの繰り返し設定
        stoneTexture.wrapS = three__WEBPACK_IMPORTED_MODULE_1__.RepeatWrapping;
        stoneTexture.wrapT = three__WEBPACK_IMPORTED_MODULE_1__.RepeatWrapping;
        stoneTexture.repeat.set(10 * groundSizeMultiplier, 10 * groundSizeMultiplier);
        displacementMap.wrapS = three__WEBPACK_IMPORTED_MODULE_1__.RepeatWrapping;
        displacementMap.wrapT = three__WEBPACK_IMPORTED_MODULE_1__.RepeatWrapping;
        displacementMap.repeat.set(10 * groundSizeMultiplier, 10 * groundSizeMultiplier);
        // 地面のマテリアル (StandardMaterialでPBRを適用)
        const groundMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({
            map: stoneTexture,
            side: three__WEBPACK_IMPORTED_MODULE_1__.DoubleSide,
            roughness: 0.8,
            metalness: 0.1,
            displacementMap: displacementMap,
            displacementScale: 1.0,
            displacementBias: 0 // 凹凸の中心オフセット
        });
        const ground = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = Math.PI / 2; // 地面を水平に回転
        ground.position.y = -tornadoHeight / 2; // 竜巻の最下端に合わせる
        scene.add(ground);
    }).catch((error) => {
        console.error('地面テクスチャのロードに失敗しました', error);
        // テクスチャロード失敗時のフォールバック
        const fallbackGroundMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({ color: 0x8B4513, side: three__WEBPACK_IMPORTED_MODULE_1__.DoubleSide });
        const fallbackGround = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(bottomRadius * 4 * groundSizeMultiplier, bottomRadius * 4 * groundSizeMultiplier), fallbackGroundMaterial);
        fallbackGround.rotation.x = Math.PI / 2;
        fallbackGround.position.y = -tornadoHeight / 2;
        scene.add(fallbackGround);
    });
    // --- 建物の生成ループ ---
    const numberOfBuildings = 40; // 建物の数
    const minBuildingHeight = 2; // 最小の高さ
    const maxBuildingHeight = 8; // 最大の高さ
    const minBuildingSize = 1; // 最小の幅/奥行き
    const maxBuildingSize = 4; // 最大の幅/奥行き
    // 建物の出現範囲 (地面の端から少し内側)
    const buildingSpawnRadius = (bottomRadius * 4 * groundSizeMultiplier) / 2 - maxBuildingSize;
    const minDistanceFromTornado = spreadRadius + 5; // 竜巻の中心から最低限離れる距離
    for (let i = 0; i < numberOfBuildings; i++) {
        // ランダムな建物サイズ
        const width = minBuildingSize + Math.random() * (maxBuildingSize - minBuildingSize);
        const depth = minBuildingSize + Math.random() * (maxBuildingSize - minBuildingSize);
        const height = minBuildingHeight + Math.random() * (maxBuildingHeight - minBuildingHeight);
        const buildingGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(width, height, depth);
        const grayValue = Math.random(); // 白から黒の間のランダムなグレースケール値
        const buildingMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({
            color: new three__WEBPACK_IMPORTED_MODULE_1__.Color(grayValue, grayValue, grayValue),
            roughness: 0.7,
            metalness: 0.2
        });
        const building = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(buildingGeometry, buildingMaterial);
        // 建物の位置を決定 (竜巻から離れて地面内)
        let placed = false;
        while (!placed) {
            const angle = Math.random() * Math.PI * 2;
            const distance = minDistanceFromTornado + Math.random() * (buildingSpawnRadius - minDistanceFromTornado);
            building.position.x = Math.cos(angle) * distance;
            building.position.z = Math.sin(angle) * distance;
            building.position.y = -tornadoHeight / 2 + height / 2; // 地面の上に置く
            const groundRadius = (bottomRadius * 4 * groundSizeMultiplier) / 2;
            if (Math.abs(building.position.x) < groundRadius - width / 2 &&
                Math.abs(building.position.z) < groundRadius - depth / 2) {
                placed = true;
            }
        }
        building.receiveShadow = true; // 影を受ける
        building.castShadow = true; // 影を落とす
        // 衝突判定と吹っ飛び管理用のプロパティ
        building.userData.isBuilding = true;
        building.userData.isBlownAway = false;
        building.userData.velocity = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(); // 吹っ飛び速度
        building.userData.rotationVelocity = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(); // 吹っ飛び回転速度
        building.userData.originalPosition = building.position.clone(); // 元の位置
        building.userData.originalRotation = building.rotation.clone(); // 元の回転
        scene.add(building);
        buildings.push(building); // buildings配列に格納
    }
    // --- 光源の設定 (太陽と環境光) ---
    // 環境光 (シーン全体を均等に照らす)
    const ambientLight = new three__WEBPACK_IMPORTED_MODULE_1__.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    // 太陽としてのDirectionalLight (無限遠から平行な光を当てる)
    const sunLight = new three__WEBPACK_IMPORTED_MODULE_1__.DirectionalLight(0xFFEEAA, 1.5); // 太陽らしい暖色系の色と強い強度
    sunLight.position.set(50, 80, 50); // 非常に遠く、斜め上から当たるように設定
    sunLight.castShadow = true; // 影を落とす設定
    // 太陽の影の設定 (影の品質と範囲)
    sunLight.shadow.mapSize.width = 4096; // 影の解像度を高く
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 200; // ライトの範囲を広げる
    sunLight.shadow.camera.left = -100; // 影カメラの視野範囲をさらに広げる
    sunLight.shadow.camera.right = 100;
    sunLight.shadow.camera.top = 100;
    sunLight.shadow.camera.bottom = -100;
    sunLight.shadow.bias = -0.0001; // シャドウアクネ対策
    scene.add(sunLight);
    // --- レンダラーでの影の有効化 ---
    renderer.shadowMap.enabled = true; // レンダラーで影の計算を有効に
    renderer.shadowMap.type = three__WEBPACK_IMPORTED_MODULE_1__.PCFSoftShadowMap; // 影を滑らかにする設定
    // --- キーボードイベントリスナーの設定 ---
    window.addEventListener('keydown', (event) => {
        switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
                keyState.w = true;
                break;
            case 'KeyS':
            case 'ArrowDown':
                keyState.s = true;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                keyState.a = true;
                break;
            case 'KeyD':
            case 'ArrowRight':
                keyState.d = true;
                break;
        }
    });
    window.addEventListener('keyup', (event) => {
        switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
                keyState.w = false;
                break;
            case 'KeyS':
            case 'ArrowDown':
                keyState.s = false;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                keyState.a = false;
                break;
            case 'KeyD':
            case 'ArrowRight':
                keyState.d = false;
                break;
        }
    });
}
// --- アニメーションループ ---
const clock = new three__WEBPACK_IMPORTED_MODULE_1__.Clock(); // 時間計測用
function animate() {
    requestAnimationFrame(animate); // 次のフレームを要求
    const deltaTime = clock.getDelta(); // 前のフレームからの経過時間
    // --- 竜巻のWASD/矢印キーによる移動 ---
    if (keyState.w || keyState.arrowUp) {
        tornadoGroup.position.z -= moveSpeed * deltaTime * 60;
    }
    if (keyState.s || keyState.arrowDown) {
        tornadoGroup.position.z += moveSpeed * deltaTime * 60;
    }
    if (keyState.a || keyState.arrowLeft) {
        tornadoGroup.position.x -= moveSpeed * deltaTime * 60;
    }
    if (keyState.d || keyState.arrowRight) {
        tornadoGroup.position.x += moveSpeed * deltaTime * 60;
    }
    // --- 竜巻グループ全体のY軸回転 ---
    tornadoGroup.rotation.y += 0.05;
    // --- 竜巻を構成する各画像の動き ---
    planes.forEach(plane => {
        const userData = plane.userData;
        // Y軸に沿って上昇させる
        userData.currentY -= userData.fallSpeed * deltaTime * 60;
        // 竜巻の範囲外に出たら下部に戻す (ループ処理)
        if (userData.currentY > tornadoHeight / 2) {
            userData.currentY = -tornadoHeight / 2; // 下限に戻す
            // X, Z位置も更新して、スムーズなループにする
            const normalizedY = (userData.currentY + tornadoHeight / 2) / tornadoHeight;
            const newRadius = bottomRadius + normalizedY * (spreadRadius - bottomRadius);
            const newAngle = Math.random() * Math.PI * 2;
            plane.position.x = Math.cos(newAngle) * newRadius;
            plane.position.z = Math.sin(newAngle) * newRadius;
            // 各種速度のリセットと再設定
            userData.initialAngle = newAngle;
            userData.fallSpeed = -(0.05 + Math.random() * 0.05);
            userData.rotationSpeedAroundAxis = 0.05 + Math.random() * 0.05;
            userData.yAxisRotationSpeed = (Math.random() - 0.5) * 0.03;
        }
        // Y位置に応じた現在の半径を計算
        const normalizedY = (userData.currentY + tornadoHeight / 2) / tornadoHeight;
        const currentRadius = bottomRadius + normalizedY * (spreadRadius - bottomRadius);
        // 竜巻の螺旋回転
        const angle = Math.atan2(plane.position.z, plane.position.x) + userData.rotationSpeedAroundAxis * deltaTime;
        plane.position.x = Math.cos(angle) * currentRadius;
        plane.position.y = userData.currentY;
        plane.position.z = Math.sin(angle) * currentRadius;
        // 個別の回転
        plane.rotation.x += userData.individualRotationSpeed.x;
        plane.rotation.y += userData.individualRotationSpeed.y;
        plane.rotation.z += userData.individualRotationSpeed.z;
        // 自身のY軸周りの回転
        plane.rotation.y += userData.yAxisRotationSpeed;
    });
    // --- 建物の衝突判定と吹っ飛び処理 ---
    const collisionRadius = 5; // 竜巻の中心からこの距離内に入ったら衝突とみなす
    const blowAwayForce = 0.5; // 吹っ飛ばす力の強さ
    const gravity = -0.05; // 重力の影響
    // 竜巻の中心位置をワールド座標で取得
    const tornadoWorldPosition = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3();
    tornadoGroup.getWorldPosition(tornadoWorldPosition);
    buildings.forEach(building => {
        if (!building.userData.isBlownAway) {
            // 竜巻の中心と建物の水平距離を計算
            const distanceX = building.position.x - tornadoWorldPosition.x;
            const distanceZ = building.position.z - tornadoWorldPosition.z;
            const horizontalDistance = Math.sqrt(distanceX * distanceX + distanceZ * distanceZ);
            // 衝突判定: 竜巻の底の半径+αの範囲内に入ったら衝突
            if (horizontalDistance < bottomRadius + collisionRadius) {
                building.userData.isBlownAway = true; // 建物が吹っ飛ばされる状態に
                // 竜巻の中心から外側へランダムな力を与える
                const angleToBuilding = Math.atan2(distanceZ, distanceX);
                const forceX = Math.cos(angleToBuilding) * (blowAwayForce + Math.random() * blowAwayForce);
                const forceZ = Math.sin(angleToBuilding) * (blowAwayForce + Math.random() * blowAwayForce);
                const forceY = Math.random() * blowAwayForce * 2; // 上方向にも少し力を加える
                building.userData.velocity.set(forceX, forceY, forceZ);
                // ランダムな回転速度も与える
                building.userData.rotationVelocity.set((Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2);
                building.userData.velocity.y += Math.random() * 0.5; // Y方向の初期速度をランダムに加算
            }
        }
        else {
            // 吹っ飛ばされている建物の位置と回転を更新
            building.userData.velocity.y += gravity * deltaTime * 60; // 重力を適用
            building.position.add(building.userData.velocity); // 速度に応じて位置を移動
            building.rotation.x += building.userData.rotationVelocity.x; // 回転を適用
            building.rotation.y += building.userData.rotationVelocity.y;
            building.rotation.z += building.userData.rotationVelocity.z;
            // 建物が遠くへ行った、または地面の下に落ちたらリセット
            if (building.position.y < -50 || building.position.distanceTo(tornadoWorldPosition) > 100) {
                building.userData.isBlownAway = false; // 吹っ飛び状態をリセット
                building.position.copy(building.userData.originalPosition); // 元の位置に戻す
                building.rotation.copy(building.userData.originalRotation); // 元の回転に戻す
                building.userData.velocity.set(0, 0, 0); // 速度をリセット
                building.userData.rotationVelocity.set(0, 0, 0); // 回転速度をリセット
            }
        }
    });
    // --- OrbitControlsの更新とレンダリング ---
    controls.update(); // カメラコントロールを更新
    renderer.render(scene, camera); // シーンをレンダリング
}
// --- ウィンドウリサイズ時の処理 ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight; // アスペクト比を更新
    camera.updateProjectionMatrix(); // カメラの投影行列を更新
    renderer.setSize(window.innerWidth, window.innerHeight); // レンダラーサイズを更新
}, false);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_three_examples_jsm_controls_OrbitControls_js"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtXQUNBLEtBQUs7V0FDTDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDM0JBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2NncHJlbmRlcmluZy8uL3NyYy9hcHAudHMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tICd0aHJlZSc7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSAndGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHMuanMnO1xuXG4vLyAtLS0g44K344O844Oz44Gu5Z+65pys6Kit5a6aIC0tLVxuY29uc3Qgc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbmNvbnN0IGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDAuMSwgMTAwMCk7XG5jb25zdCByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHsgYW50aWFsaWFzOiB0cnVlIH0pO1xucmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbi8vIC0tLSDjgqvjg6Hjg6nmk43kvZwgKE9yYml0Q29udHJvbHMpIC0tLVxuY29uc3QgY29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuY29udHJvbHMuZW5hYmxlRGFtcGluZyA9IHRydWU7IC8vIOWLleOBjeOCkua7keOCieOBi+OBq+OBmeOCi1xuY29udHJvbHMuZGFtcGluZ0ZhY3RvciA9IDAuMDU7IC8vIOa4m+ihsOS/guaVsFxuXG4vLyAtLS0g44OG44Kv44K544OB44Oj44Gu44Ot44O844OJIC0tLVxuY29uc3QgdGV4dHVyZXMgPSBbXTtcbmNvbnN0IHRleHR1cmVMb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpO1xuLy8g56uc5be744KS5qeL5oiQ44GZ44KL55S75YOP44OV44Kh44Kk44Or5ZCNXG5jb25zdCBpbWFnZUZpbGVzID0gWydEVUFKNzAwOC5QTkcnLCAnUVBGTjY5MDguUE5HJywgJ1NZU04yMTA3LlBORycsICdWTFlOMTIyNy5QTkcnXTtcblxuLy8g5YWo44Gm44Gu44OG44Kv44K544OB44Oj44KS6Z2e5ZCM5pyf44Gn44Ot44O844OJ44GX44CB5a6M5LqG5b6M44GraW5pdOOBqGFuaW1hdGXjgpLplovlp4tcblByb21pc2UuYWxsKGltYWdlRmlsZXMubWFwKGZpbGUgPT4gdGV4dHVyZUxvYWRlci5sb2FkQXN5bmMoZmlsZSkpKVxuICAgIC50aGVuKGxvYWRlZFRleHR1cmVzID0+IHtcbiAgICAgICAgbG9hZGVkVGV4dHVyZXMuZm9yRWFjaCh0ZXh0dXJlID0+IHtcbiAgICAgICAgICAgIHRleHR1cmVzLnB1c2godGV4dHVyZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpbml0KCk7IC8vIOWIneacn+WMluWHpueQhlxuICAgICAgICBhbmltYXRlKCk7IC8vIOOCouODi+ODoeODvOOCt+ODp+ODs+ODq+ODvOODl+mWi+Wni1xuICAgIH0pXG4gICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcign44OG44Kv44K544OB44Oj44Gu44Ot44O844OJ44Gr5aSx5pWX44GX44G+44GX44GfJywgZXJyb3IpO1xuICAgIH0pO1xuXG4vLyAtLS0g56uc5be744KS5qeL5oiQ44GZ44KL6KaB57Sg44Gr6Zai44GZ44KL5a6a5pWw44Go5aSJ5pWwIC0tLVxuY29uc3QgcGxhbmVzID0gW107IC8vIOernOW3u+OBruWQhOeUu+WDj+OCkuagvOe0jeOBmeOCi+mFjeWIl1xuY29uc3QgbnVtYmVyT2ZJbnN0YW5jZXNQZXJJbWFnZSA9IDMwMDsgLy8g5ZCE55S75YOP44Gr44Gk44GN55Sf5oiQ44GZ44KL44Kk44Oz44K544K/44Oz44K55pWwXG5jb25zdCB0b3JuYWRvSGVpZ2h0ID0gNDA7IC8vIOernOW3u+OBrumrmOOBlVxuY29uc3QgYm90dG9tUmFkaXVzID0gMS41OyAvLyDnq5zlt7vjga7lupXjga7ljYrlvoQgKOS4i+OBi+OCieS4iuOBuOW6g+OBjOOCi+OBn+OCgeWwj+OBleOBhClcbmNvbnN0IHNwcmVhZFJhZGl1cyA9IDEwOyAvLyDnq5zlt7vjga7kuIrpg6jjga7ljYrlvoQgKOS4i+OBi+OCieS4iuOBuOW6g+OBjOOCi+OBn+OCgeWkp+OBjeOBhClcblxuY29uc3QgdG9ybmFkb0dyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7IC8vIOernOW3u+WFqOS9k+OCkueuoeeQhuOBmeOCi+OBn+OCgeOBruOCsOODq+ODvOODl1xuc2NlbmUuYWRkKHRvcm5hZG9Hcm91cCk7IC8vIOOCt+ODvOODs+OBq+OCsOODq+ODvOODl+OCkui/veWKoFxuXG4vLyAtLS0g44Kt44O844Oc44O844OJ5pON5L2c44Gu54q25oWL566h55CGIC0tLVxuY29uc3Qga2V5U3RhdGUgPSB7XG4gICAgdzogZmFsc2UsIGE6IGZhbHNlLCBzOiBmYWxzZSwgZDogZmFsc2UsXG4gICAgYXJyb3dVcDogZmFsc2UsIGFycm93RG93bjogZmFsc2UsIGFycm93TGVmdDogZmFsc2UsIGFycm93UmlnaHQ6IGZhbHNlXG59O1xuY29uc3QgbW92ZVNwZWVkID0gMTsgLy8g56uc5be744Gu56e75YuV6YCf5bqmXG5cbi8vIC0tLSDlu7rnianjga7nrqHnkIYgLS0tXG5jb25zdCBidWlsZGluZ3MgPSBbXTsgLy8g44K344O844Oz5YaF44Gu5bu654mp44Kq44OW44K444Kn44Kv44OI44KS5qC857SN44GZ44KL6YWN5YiXXG5cbi8vIC0tLSDliJ3mnJ/ljJblh6bnkIYgLS0tXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIC8vIOOCq+ODoeODqeOBruWIneacn+S9jee9ruOBqOazqOimlueCueOBruioreWumiAo5Zyw6Z2i44Gu5LiL44GL44KJ56uc5be744KS6KaL5LiK44GS44KL44KI44GG44GrKVxuICAgIGNhbWVyYS5wb3NpdGlvbi5zZXQoMCwgMjUsIDUwKTtcbiAgICBjYW1lcmEubG9va0F0KDAsIC10b3JuYWRvSGVpZ2h0IC8gMiwgMCk7XG5cbiAgICAvLyDog4zmma/oibLjgpLnqbroibLjgavoqK3lrppcbiAgICBzY2VuZS5iYWNrZ3JvdW5kID0gbmV3IFRIUkVFLkNvbG9yKDB4ODdDRUVCKTsgLy8gU2t5IEJsdWVcblxuICAgIC8vIC0tLSDnq5zlt7vjgpLmp4vmiJDjgZnjgovnlLvlg4/jga7nlJ/miJDjg6vjg7zjg5cgLS0tXG4gICAgdGV4dHVyZXMuZm9yRWFjaCgodGV4dHVyZSwgdGV4dHVyZUluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbiAgICAgICAgICAgIG1hcDogdGV4dHVyZSwgICAgICAgICAgLy8g44OG44Kv44K544OB44Oj44KS6YGp55SoXG4gICAgICAgICAgICBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLCAvLyDkuKHpnaLooajnpLpcbiAgICAgICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLCAgICAgLy8g6YCP5piO5bqm44KS5pyJ5Yq544GrXG4gICAgICAgICAgICBvcGFjaXR5OiAwLjgsICAgICAgICAgIC8vIOS4jemAj+aYjuW6plxuICAgICAgICAgICAgYWxwaGFUZXN0OiAwLjEgICAgICAgIC8vIOmAj+mBjumDqOWIhuOBruODgeODqeOBpOOBjei7vea4m1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSgyLCAyKTsgLy8g5YCL44CF44Gu55S75YOP44Gu44K144Kk44K6ICjluYUxLCDpq5jjgZUxKVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtYmVyT2ZJbnN0YW5jZXNQZXJJbWFnZTsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBwbGFuZSA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cbiAgICAgICAgICAgIC8vIOernOW3u+OBrlnou7jmlrnlkJHjga7liJ3mnJ/kvY3nva4gKOS4i+OBi+OCieS4iuOBuOODq+ODvOODl+OBmeOCi+OBruOBp+WIneacn+OBr+S4i+WBtClcbiAgICAgICAgICAgIGNvbnN0IGluaXRpYWxZID0gTWF0aC5yYW5kb20oKSAqIC10b3JuYWRvSGVpZ2h0O1xuXG4gICAgICAgICAgICAvLyBZ5L2N572u44Gr5b+c44GY44Gf6J665peL44Gu5Y2K5b6E44KS6KiI566XICjkuIvjgYvjgonkuIrjgbjluoPjgYzjgovlvaLnirYpXG4gICAgICAgICAgICBjb25zdCBub3JtYWxpemVkWSA9IChpbml0aWFsWSArIHRvcm5hZG9IZWlnaHQpIC8gdG9ybmFkb0hlaWdodDsgLy8gMCjkuIvnq68p772eMSjkuIrnq68p44Gr5q2j6KaP5YyWXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50UmFkaXVzID0gYm90dG9tUmFkaXVzICsgbm9ybWFsaXplZFkgKiAoc3ByZWFkUmFkaXVzIC0gYm90dG9tUmFkaXVzKTtcblxuICAgICAgICAgICAgLy8g5Yid5pyf5L2N572u44KS6J665peL54q244Gr6YWN572uXG4gICAgICAgICAgICBjb25zdCBhbmdsZSA9IE1hdGgucmFuZG9tKCkgKiBNYXRoLlBJICogMjsgLy8g44Op44Oz44OA44Og44Gq5Yid5pyf6KeS5bqmXG4gICAgICAgICAgICBwbGFuZS5wb3NpdGlvbi54ID0gTWF0aC5jb3MoYW5nbGUpICogY3VycmVudFJhZGl1cztcbiAgICAgICAgICAgIHBsYW5lLnBvc2l0aW9uLnkgPSBpbml0aWFsWSArIHRvcm5hZG9IZWlnaHQgLyAyOyAvLyDljp/ngrnjgYznq5zlt7vjga7kuK3lv4PjgavjgarjgovjgojjgYbjgqrjg5Xjgrvjg4Pjg4hcbiAgICAgICAgICAgIHBsYW5lLnBvc2l0aW9uLnogPSBNYXRoLnNpbihhbmdsZSkgKiBjdXJyZW50UmFkaXVzO1xuXG4gICAgICAgICAgICAvLyDjg6njg7Pjg4Djg6DjgarliJ3mnJ/lm57ou6JcbiAgICAgICAgICAgIHBsYW5lLnJvdGF0aW9uLnggPSBNYXRoLnJhbmRvbSgpICogTWF0aC5QSSAqIDI7XG4gICAgICAgICAgICBwbGFuZS5yb3RhdGlvbi55ID0gTWF0aC5yYW5kb20oKSAqIE1hdGguUEkgKiAyO1xuICAgICAgICAgICAgcGxhbmUucm90YXRpb24ueiA9IE1hdGgucmFuZG9tKCkgKiBNYXRoLlBJICogMjtcblxuICAgICAgICAgICAgLy8g44Op44Oz44OA44Og44Gq44K544Kx44O844OrXG4gICAgICAgICAgICBjb25zdCBzY2FsZSA9IDAuNSArIE1hdGgucmFuZG9tKCkgKiAwLjU7IC8vIDAuNe+9njEuMOOBruevhOWbslxuICAgICAgICAgICAgcGxhbmUuc2NhbGUuc2V0KHNjYWxlLCBzY2FsZSwgc2NhbGUpO1xuXG4gICAgICAgICAgICAvLyDjgqLjg4vjg6Hjg7zjgrfjg6fjg7PliLblvqHnlKjjga7jg4fjg7zjgr/jgpJ1c2VyRGF0YeOBq+agvOe0jVxuICAgICAgICAgICAgcGxhbmUudXNlckRhdGEgPSB7XG4gICAgICAgICAgICAgICAgaW5pdGlhbEFuZ2xlOiBhbmdsZSxcbiAgICAgICAgICAgICAgICBjdXJyZW50WTogcGxhbmUucG9zaXRpb24ueSxcbiAgICAgICAgICAgICAgICBmYWxsU3BlZWQ6IC0oMC4wNSArIE1hdGgucmFuZG9tKCkgKiAwLjA1KSwgLy8g5LiK5piH44GV44Gb44KL44Gu44Gn6LKg44Gu5YCkXG4gICAgICAgICAgICAgICAgcm90YXRpb25TcGVlZEFyb3VuZEF4aXM6IDAuMDUgKyBNYXRoLnJhbmRvbSgpICogMC4wNSwgLy8g56uc5be76Lu45ZGo44KK44Gu5Zue6Lui6YCf5bqmXG5cbiAgICAgICAgICAgICAgICBpbmRpdmlkdWFsUm90YXRpb25TcGVlZDogbmV3IFRIUkVFLlZlY3RvcjMoIC8vIOWAi+WIpeOBruODqeODs+ODgOODoOOBquWbnui7oumAn+W6plxuICAgICAgICAgICAgICAgICAgICAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAwLjA1LFxuICAgICAgICAgICAgICAgICAgICAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAwLjA1LFxuICAgICAgICAgICAgICAgICAgICAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAwLjA1XG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICB5QXhpc1JvdGF0aW9uU3BlZWQ6IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDAuMDMgLy8g5YCL5Yil44GuWei7uOWRqOOCiuWbnui7oumAn+W6plxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdG9ybmFkb0dyb3VwLmFkZChwbGFuZSk7IC8vIOernOW3u+OCsOODq+ODvOODl+OBq+i/veWKoFxuICAgICAgICAgICAgcGxhbmVzLnB1c2gocGxhbmUpOyAvLyDjgqLjg4vjg6Hjg7zjgrfjg6fjg7Pjg6vjg7zjg5fnlKjjgavmoLzntI1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gLS0tIOWcsOmdouOBrueUn+aIkOOBqOODhuOCr+OCueODgeODo+ioreWumiAtLS1cbiAgICBjb25zdCBncm91bmRUZXh0dXJlTG9hZGVyID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKTtcbiAgICBjb25zdCBncm91bmRTaXplTXVsdGlwbGllciA9IDEwOyAvLyDlnLDpnaLjga7jgrXjgqTjgrrkuZfmlbBcbiAgICAvLyDlnLDpnaLjga5HZW9tZXRyeSAo5bqD44GV44CB5YiG5Ymy5pWwKVxuICAgIGNvbnN0IGdyb3VuZEdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoYm90dG9tUmFkaXVzICogNCAqIGdyb3VuZFNpemVNdWx0aXBsaWVyLCBib3R0b21SYWRpdXMgKiA0ICogZ3JvdW5kU2l6ZU11bHRpcGxpZXIsIDY0LCA2NCk7XG5cbiAgICAvLyDlnLDpnaLjga7oibLjgajjg4fjgqPjgrnjg5fjg6zjgqTjgrnjg6Hjg7Pjg4jjg57jg4Pjg5fjgpLlkIzmmYLjgavjg63jg7zjg4lcbiAgICBQcm9taXNlLmFsbChbXG4gICAgICAgIGdyb3VuZFRleHR1cmVMb2FkZXIubG9hZEFzeW5jKCdzdG9uZS5wbmcnKSwgICAgICAgLy8g44Kr44Op44O844OG44Kv44K544OB44OjXG4gICAgICAgIGdyb3VuZFRleHR1cmVMb2FkZXIubG9hZEFzeW5jKCdzdG9uZS5wbmcnKSAgICAgICAgLy8g44OH44Kj44K544OX44Os44Kk44K544Oh44Oz44OI44Oe44OD44OXICjlkIzjgZjjg5XjgqHjgqTjg6vjgpLkvb/nlKgpXG4gICAgXSkudGhlbigoW3N0b25lVGV4dHVyZSwgZGlzcGxhY2VtZW50TWFwXSkgPT4ge1xuICAgICAgICAvLyDjg4bjgq/jgrnjg4Hjg6Pjga7nubDjgorov5TjgZfoqK3lrppcbiAgICAgICAgc3RvbmVUZXh0dXJlLndyYXBTID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gICAgICAgIHN0b25lVGV4dHVyZS53cmFwVCA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nO1xuICAgICAgICBzdG9uZVRleHR1cmUucmVwZWF0LnNldCgxMCAqIGdyb3VuZFNpemVNdWx0aXBsaWVyLCAxMCAqIGdyb3VuZFNpemVNdWx0aXBsaWVyKTtcblxuICAgICAgICBkaXNwbGFjZW1lbnRNYXAud3JhcFMgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgICAgICAgZGlzcGxhY2VtZW50TWFwLndyYXBUID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gICAgICAgIGRpc3BsYWNlbWVudE1hcC5yZXBlYXQuc2V0KDEwICogZ3JvdW5kU2l6ZU11bHRpcGxpZXIsIDEwICogZ3JvdW5kU2l6ZU11bHRpcGxpZXIpO1xuXG4gICAgICAgIC8vIOWcsOmdouOBruODnuODhuODquOCouODqyAoU3RhbmRhcmRNYXRlcmlhbOOBp1BCUuOCkumBqeeUqClcbiAgICAgICAgY29uc3QgZ3JvdW5kTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoe1xuICAgICAgICAgICAgbWFwOiBzdG9uZVRleHR1cmUsICAgICAgICAgICAvLyDjgqvjg6njg7zjg57jg4Pjg5dcbiAgICAgICAgICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsICAgICAgLy8g5Lih6Z2i6KGo56S6XG4gICAgICAgICAgICByb3VnaG5lc3M6IDAuOCwgICAgICAgICAgICAgIC8vIOeyl+OBlVxuICAgICAgICAgICAgbWV0YWxuZXNzOiAwLjEsICAgICAgICAgICAgICAvLyDph5HlsZ7mhJ9cbiAgICAgICAgICAgIGRpc3BsYWNlbWVudE1hcDogZGlzcGxhY2VtZW50TWFwLCAvLyDjg4fjgqPjgrnjg5fjg6zjgqTjgrnjg6Hjg7Pjg4jjg57jg4Pjg5dcbiAgICAgICAgICAgIGRpc3BsYWNlbWVudFNjYWxlOiAxLjAsICAgICAgLy8g5Ye55Ye444Gu5by344GVXG4gICAgICAgICAgICBkaXNwbGFjZW1lbnRCaWFzOiAwICAgICAgICAgIC8vIOWHueWHuOOBruS4reW/g+OCquODleOCu+ODg+ODiFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgZ3JvdW5kID0gbmV3IFRIUkVFLk1lc2goZ3JvdW5kR2VvbWV0cnksIGdyb3VuZE1hdGVyaWFsKTtcblxuICAgICAgICBncm91bmQucm90YXRpb24ueCA9IE1hdGguUEkgLyAyOyAvLyDlnLDpnaLjgpLmsLTlubPjgavlm57ou6JcbiAgICAgICAgZ3JvdW5kLnBvc2l0aW9uLnkgPSAtdG9ybmFkb0hlaWdodCAvIDI7IC8vIOernOW3u+OBruacgOS4i+err+OBq+WQiOOCj+OBm+OCi1xuICAgICAgICBzY2VuZS5hZGQoZ3JvdW5kKTtcbiAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcign5Zyw6Z2i44OG44Kv44K544OB44Oj44Gu44Ot44O844OJ44Gr5aSx5pWX44GX44G+44GX44GfJywgZXJyb3IpO1xuICAgICAgICAvLyDjg4bjgq/jgrnjg4Hjg6Pjg63jg7zjg4nlpLHmlZfmmYLjga7jg5Xjgqnjg7zjg6vjg5Djg4Pjgq9cbiAgICAgICAgY29uc3QgZmFsbGJhY2tHcm91bmRNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiAweDhCNDUxMywgc2lkZTogVEhSRUUuRG91YmxlU2lkZSB9KTtcbiAgICAgICAgY29uc3QgZmFsbGJhY2tHcm91bmQgPSBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeShib3R0b21SYWRpdXMgKiA0ICogZ3JvdW5kU2l6ZU11bHRpcGxpZXIsIGJvdHRvbVJhZGl1cyAqIDQgKiBncm91bmRTaXplTXVsdGlwbGllciksIGZhbGxiYWNrR3JvdW5kTWF0ZXJpYWwpO1xuICAgICAgICBmYWxsYmFja0dyb3VuZC5yb3RhdGlvbi54ID0gTWF0aC5QSSAvIDI7XG4gICAgICAgIGZhbGxiYWNrR3JvdW5kLnBvc2l0aW9uLnkgPSAtdG9ybmFkb0hlaWdodCAvIDI7XG4gICAgICAgIHNjZW5lLmFkZChmYWxsYmFja0dyb3VuZCk7XG4gICAgfSk7XG5cbiAgICAvLyAtLS0g5bu654mp44Gu55Sf5oiQ44Or44O844OXIC0tLVxuICAgIGNvbnN0IG51bWJlck9mQnVpbGRpbmdzID0gNDA7IC8vIOW7uueJqeOBruaVsFxuICAgIGNvbnN0IG1pbkJ1aWxkaW5nSGVpZ2h0ID0gMjsgIC8vIOacgOWwj+OBrumrmOOBlVxuICAgIGNvbnN0IG1heEJ1aWxkaW5nSGVpZ2h0ID0gODsgLy8g5pyA5aSn44Gu6auY44GVXG4gICAgY29uc3QgbWluQnVpbGRpbmdTaXplID0gMTsgICAgLy8g5pyA5bCP44Gu5bmFL+WlpeihjOOBjVxuICAgIGNvbnN0IG1heEJ1aWxkaW5nU2l6ZSA9IDQ7ICAgIC8vIOacgOWkp+OBruW5hS/lpaXooYzjgY1cbiAgICAvLyDlu7rnianjga7lh7rnj77nr4Tlm7IgKOWcsOmdouOBruerr+OBi+OCieWwkeOBl+WGheWBtClcbiAgICBjb25zdCBidWlsZGluZ1NwYXduUmFkaXVzID0gKGJvdHRvbVJhZGl1cyAqIDQgKiBncm91bmRTaXplTXVsdGlwbGllcikgLyAyIC0gbWF4QnVpbGRpbmdTaXplO1xuICAgIGNvbnN0IG1pbkRpc3RhbmNlRnJvbVRvcm5hZG8gPSBzcHJlYWRSYWRpdXMgKyA1OyAvLyDnq5zlt7vjga7kuK3lv4PjgYvjgonmnIDkvY7pmZDpm6Ljgozjgovot53pm6JcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtYmVyT2ZCdWlsZGluZ3M7IGkrKykge1xuICAgICAgICAvLyDjg6njg7Pjg4Djg6Djgarlu7rnianjgrXjgqTjgrpcbiAgICAgICAgY29uc3Qgd2lkdGggPSBtaW5CdWlsZGluZ1NpemUgKyBNYXRoLnJhbmRvbSgpICogKG1heEJ1aWxkaW5nU2l6ZSAtIG1pbkJ1aWxkaW5nU2l6ZSk7XG4gICAgICAgIGNvbnN0IGRlcHRoID0gbWluQnVpbGRpbmdTaXplICsgTWF0aC5yYW5kb20oKSAqIChtYXhCdWlsZGluZ1NpemUgLSBtaW5CdWlsZGluZ1NpemUpO1xuICAgICAgICBjb25zdCBoZWlnaHQgPSBtaW5CdWlsZGluZ0hlaWdodCArIE1hdGgucmFuZG9tKCkgKiAobWF4QnVpbGRpbmdIZWlnaHQgLSBtaW5CdWlsZGluZ0hlaWdodCk7XG5cbiAgICAgICAgY29uc3QgYnVpbGRpbmdHZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSh3aWR0aCwgaGVpZ2h0LCBkZXB0aCk7XG4gICAgICAgIGNvbnN0IGdyYXlWYWx1ZSA9IE1hdGgucmFuZG9tKCk7IC8vIOeZveOBi+OCiem7kuOBrumWk+OBruODqeODs+ODgOODoOOBquOCsOODrOODvOOCueOCseODvOODq+WApFxuICAgICAgICBjb25zdCBidWlsZGluZ01hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHtcbiAgICAgICAgICAgIGNvbG9yOiBuZXcgVEhSRUUuQ29sb3IoZ3JheVZhbHVlLCBncmF5VmFsdWUsIGdyYXlWYWx1ZSksIC8vIOOCsOODrOODvOOCueOCseODvOODq+OBp+iJsuOCkuioreWumlxuICAgICAgICAgICAgcm91Z2huZXNzOiAwLjcsXG4gICAgICAgICAgICBtZXRhbG5lc3M6IDAuMlxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgYnVpbGRpbmcgPSBuZXcgVEhSRUUuTWVzaChidWlsZGluZ0dlb21ldHJ5LCBidWlsZGluZ01hdGVyaWFsKTtcblxuICAgICAgICAvLyDlu7rnianjga7kvY3nva7jgpLmsbrlrpogKOernOW3u+OBi+OCiembouOCjOOBpuWcsOmdouWGhSlcbiAgICAgICAgbGV0IHBsYWNlZCA9IGZhbHNlO1xuICAgICAgICB3aGlsZSAoIXBsYWNlZCkge1xuICAgICAgICAgICAgY29uc3QgYW5nbGUgPSBNYXRoLnJhbmRvbSgpICogTWF0aC5QSSAqIDI7XG4gICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IG1pbkRpc3RhbmNlRnJvbVRvcm5hZG8gKyBNYXRoLnJhbmRvbSgpICogKGJ1aWxkaW5nU3Bhd25SYWRpdXMgLSBtaW5EaXN0YW5jZUZyb21Ub3JuYWRvKTtcblxuICAgICAgICAgICAgYnVpbGRpbmcucG9zaXRpb24ueCA9IE1hdGguY29zKGFuZ2xlKSAqIGRpc3RhbmNlO1xuICAgICAgICAgICAgYnVpbGRpbmcucG9zaXRpb24ueiA9IE1hdGguc2luKGFuZ2xlKSAqIGRpc3RhbmNlO1xuXG4gICAgICAgICAgICBidWlsZGluZy5wb3NpdGlvbi55ID0gLXRvcm5hZG9IZWlnaHQgLyAyICsgaGVpZ2h0IC8gMjsgLy8g5Zyw6Z2i44Gu5LiK44Gr572u44GPXG5cbiAgICAgICAgICAgIGNvbnN0IGdyb3VuZFJhZGl1cyA9IChib3R0b21SYWRpdXMgKiA0ICogZ3JvdW5kU2l6ZU11bHRpcGxpZXIpIC8gMjtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhidWlsZGluZy5wb3NpdGlvbi54KSA8IGdyb3VuZFJhZGl1cyAtIHdpZHRoIC8gMiAmJlxuICAgICAgICAgICAgICAgIE1hdGguYWJzKGJ1aWxkaW5nLnBvc2l0aW9uLnopIDwgZ3JvdW5kUmFkaXVzIC0gZGVwdGggLyAyKSB7XG4gICAgICAgICAgICAgICAgcGxhY2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGJ1aWxkaW5nLnJlY2VpdmVTaGFkb3cgPSB0cnVlOyAvLyDlvbHjgpLlj5fjgZHjgotcbiAgICAgICAgYnVpbGRpbmcuY2FzdFNoYWRvdyA9IHRydWU7ICAgLy8g5b2x44KS6JC944Go44GZXG5cbiAgICAgICAgLy8g6KGd56qB5Yik5a6a44Go5ZC544Gj6aOb44Gz566h55CG55So44Gu44OX44Ot44OR44OG44KjXG4gICAgICAgIGJ1aWxkaW5nLnVzZXJEYXRhLmlzQnVpbGRpbmcgPSB0cnVlO1xuICAgICAgICBidWlsZGluZy51c2VyRGF0YS5pc0Jsb3duQXdheSA9IGZhbHNlO1xuICAgICAgICBidWlsZGluZy51c2VyRGF0YS52ZWxvY2l0eSA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7IC8vIOWQueOBo+mjm+OBs+mAn+W6plxuICAgICAgICBidWlsZGluZy51c2VyRGF0YS5yb3RhdGlvblZlbG9jaXR5ID0gbmV3IFRIUkVFLlZlY3RvcjMoKTsgLy8g5ZC544Gj6aOb44Gz5Zue6Lui6YCf5bqmXG4gICAgICAgIGJ1aWxkaW5nLnVzZXJEYXRhLm9yaWdpbmFsUG9zaXRpb24gPSBidWlsZGluZy5wb3NpdGlvbi5jbG9uZSgpOyAvLyDlhYPjga7kvY3nva5cbiAgICAgICAgYnVpbGRpbmcudXNlckRhdGEub3JpZ2luYWxSb3RhdGlvbiA9IGJ1aWxkaW5nLnJvdGF0aW9uLmNsb25lKCk7IC8vIOWFg+OBruWbnui7olxuXG4gICAgICAgIHNjZW5lLmFkZChidWlsZGluZyk7XG4gICAgICAgIGJ1aWxkaW5ncy5wdXNoKGJ1aWxkaW5nKTsgLy8gYnVpbGRpbmdz6YWN5YiX44Gr5qC857SNXG4gICAgfVxuXG4gICAgLy8gLS0tIOWFiea6kOOBruioreWumiAo5aSq6Zm944Go55Kw5aKD5YWJKSAtLS1cbiAgICAvLyDnkrDlooPlhYkgKOOCt+ODvOODs+WFqOS9k+OCkuWdh+etieOBq+eFp+OCieOBmSlcbiAgICBjb25zdCBhbWJpZW50TGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4ZmZmZmZmLCAwLjUpO1xuICAgIHNjZW5lLmFkZChhbWJpZW50TGlnaHQpO1xuXG4gICAgLy8g5aSq6Zm944Go44GX44Gm44GuRGlyZWN0aW9uYWxMaWdodCAo54Sh6ZmQ6YGg44GL44KJ5bmz6KGM44Gq5YWJ44KS5b2T44Gm44KLKVxuICAgIGNvbnN0IHN1bkxpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhGRkVFQUEsIDEuNSk7IC8vIOWkqumZveOCieOBl+OBhOaaluiJsuezu+OBruiJsuOBqOW8t+OBhOW8t+W6plxuICAgIHN1bkxpZ2h0LnBvc2l0aW9uLnNldCg1MCwgODAsIDUwKTsgLy8g6Z2e5bi444Gr6YGg44GP44CB5pac44KB5LiK44GL44KJ5b2T44Gf44KL44KI44GG44Gr6Kit5a6aXG4gICAgc3VuTGlnaHQuY2FzdFNoYWRvdyA9IHRydWU7IC8vIOW9seOCkuiQveOBqOOBmeioreWumlxuXG4gICAgLy8g5aSq6Zm944Gu5b2x44Gu6Kit5a6aICjlvbHjga7lk4Hos6rjgajnr4Tlm7IpXG4gICAgc3VuTGlnaHQuc2hhZG93Lm1hcFNpemUud2lkdGggPSA0MDk2OyAvLyDlvbHjga7op6Plg4/luqbjgpLpq5jjgY9cbiAgICBzdW5MaWdodC5zaGFkb3cubWFwU2l6ZS5oZWlnaHQgPSA0MDk2O1xuICAgIHN1bkxpZ2h0LnNoYWRvdy5jYW1lcmEubmVhciA9IDAuNTtcbiAgICBzdW5MaWdodC5zaGFkb3cuY2FtZXJhLmZhciA9IDIwMDsgIC8vIOODqeOCpOODiOOBruevhOWbsuOCkuW6g+OBkuOCi1xuICAgIHN1bkxpZ2h0LnNoYWRvdy5jYW1lcmEubGVmdCA9IC0xMDA7IC8vIOW9seOCq+ODoeODqeOBruimlumHjuevhOWbsuOCkuOBleOCieOBq+W6g+OBkuOCi1xuICAgIHN1bkxpZ2h0LnNoYWRvdy5jYW1lcmEucmlnaHQgPSAxMDA7XG4gICAgc3VuTGlnaHQuc2hhZG93LmNhbWVyYS50b3AgPSAxMDA7XG4gICAgc3VuTGlnaHQuc2hhZG93LmNhbWVyYS5ib3R0b20gPSAtMTAwO1xuICAgIHN1bkxpZ2h0LnNoYWRvdy5iaWFzID0gLTAuMDAwMTsgLy8g44K344Oj44OJ44Km44Ki44Kv44ON5a++562WXG5cbiAgICBzY2VuZS5hZGQoc3VuTGlnaHQpO1xuXG4gICAgLy8gLS0tIOODrOODs+ODgOODqeODvOOBp+OBruW9seOBruacieWKueWMliAtLS1cbiAgICByZW5kZXJlci5zaGFkb3dNYXAuZW5hYmxlZCA9IHRydWU7IC8vIOODrOODs+ODgOODqeODvOOBp+W9seOBruioiOeul+OCkuacieWKueOBq1xuICAgIHJlbmRlcmVyLnNoYWRvd01hcC50eXBlID0gVEhSRUUuUENGU29mdFNoYWRvd01hcDsgLy8g5b2x44KS5ruR44KJ44GL44Gr44GZ44KL6Kit5a6aXG5cbiAgICAvLyAtLS0g44Kt44O844Oc44O844OJ44Kk44OZ44Oz44OI44Oq44K544OK44O844Gu6Kit5a6aIC0tLVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIHN3aXRjaCAoZXZlbnQuY29kZSkge1xuICAgICAgICAgICAgY2FzZSAnS2V5Vyc6IGNhc2UgJ0Fycm93VXAnOiBrZXlTdGF0ZS53ID0gdHJ1ZTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdLZXlTJzogY2FzZSAnQXJyb3dEb3duJzoga2V5U3RhdGUucyA9IHRydWU7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnS2V5QSc6IGNhc2UgJ0Fycm93TGVmdCc6IGtleVN0YXRlLmEgPSB0cnVlOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ0tleUQnOiBjYXNlICdBcnJvd1JpZ2h0Jzoga2V5U3RhdGUuZCA9IHRydWU7IGJyZWFrO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgc3dpdGNoIChldmVudC5jb2RlKSB7XG4gICAgICAgICAgICBjYXNlICdLZXlXJzogY2FzZSAnQXJyb3dVcCc6IGtleVN0YXRlLncgPSBmYWxzZTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdLZXlTJzogY2FzZSAnQXJyb3dEb3duJzoga2V5U3RhdGUucyA9IGZhbHNlOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ0tleUEnOiBjYXNlICdBcnJvd0xlZnQnOiBrZXlTdGF0ZS5hID0gZmFsc2U7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnS2V5RCc6IGNhc2UgJ0Fycm93UmlnaHQnOiBrZXlTdGF0ZS5kID0gZmFsc2U7IGJyZWFrO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8vIC0tLSDjgqLjg4vjg6Hjg7zjgrfjg6fjg7Pjg6vjg7zjg5cgLS0tXG5jb25zdCBjbG9jayA9IG5ldyBUSFJFRS5DbG9jaygpOyAvLyDmmYLplpPoqIjmuKznlKhcblxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7IC8vIOasoeOBruODleODrOODvOODoOOCkuimgeaxglxuXG4gICAgY29uc3QgZGVsdGFUaW1lID0gY2xvY2suZ2V0RGVsdGEoKTsgLy8g5YmN44Gu44OV44Os44O844Og44GL44KJ44Gu57WM6YGO5pmC6ZaTXG5cbiAgICAvLyAtLS0g56uc5be744GuV0FTRC/nn6LljbDjgq3jg7zjgavjgojjgovnp7vli5UgLS0tXG4gICAgaWYgKGtleVN0YXRlLncgfHwga2V5U3RhdGUuYXJyb3dVcCkgeyB0b3JuYWRvR3JvdXAucG9zaXRpb24ueiAtPSBtb3ZlU3BlZWQgKiBkZWx0YVRpbWUgKiA2MDsgfVxuICAgIGlmIChrZXlTdGF0ZS5zIHx8IGtleVN0YXRlLmFycm93RG93bikgeyB0b3JuYWRvR3JvdXAucG9zaXRpb24ueiArPSBtb3ZlU3BlZWQgKiBkZWx0YVRpbWUgKiA2MDsgfVxuICAgIGlmIChrZXlTdGF0ZS5hIHx8IGtleVN0YXRlLmFycm93TGVmdCkgeyB0b3JuYWRvR3JvdXAucG9zaXRpb24ueCAtPSBtb3ZlU3BlZWQgKiBkZWx0YVRpbWUgKiA2MDsgfVxuICAgIGlmIChrZXlTdGF0ZS5kIHx8IGtleVN0YXRlLmFycm93UmlnaHQpIHsgdG9ybmFkb0dyb3VwLnBvc2l0aW9uLnggKz0gbW92ZVNwZWVkICogZGVsdGFUaW1lICogNjA7IH1cblxuICAgIC8vIC0tLSDnq5zlt7vjgrDjg6vjg7zjg5flhajkvZPjga5Z6Lu45Zue6LuiIC0tLVxuICAgIHRvcm5hZG9Hcm91cC5yb3RhdGlvbi55ICs9IDAuMDU7XG5cbiAgICAvLyAtLS0g56uc5be744KS5qeL5oiQ44GZ44KL5ZCE55S75YOP44Gu5YuV44GNIC0tLVxuICAgIHBsYW5lcy5mb3JFYWNoKHBsYW5lID0+IHtcbiAgICAgICAgY29uc3QgdXNlckRhdGEgPSBwbGFuZS51c2VyRGF0YTtcblxuICAgICAgICAvLyBZ6Lu444Gr5rK/44Gj44Gm5LiK5piH44GV44Gb44KLXG4gICAgICAgIHVzZXJEYXRhLmN1cnJlbnRZIC09IHVzZXJEYXRhLmZhbGxTcGVlZCAqIGRlbHRhVGltZSAqIDYwO1xuXG4gICAgICAgIC8vIOernOW3u+OBruevhOWbsuWkluOBq+WHuuOBn+OCieS4i+mDqOOBq+aIu+OBmSAo44Or44O844OX5Yem55CGKVxuICAgICAgICBpZiAodXNlckRhdGEuY3VycmVudFkgPiB0b3JuYWRvSGVpZ2h0IC8gMikge1xuICAgICAgICAgICAgdXNlckRhdGEuY3VycmVudFkgPSAtdG9ybmFkb0hlaWdodCAvIDI7IC8vIOS4i+mZkOOBq+aIu+OBmVxuXG4gICAgICAgICAgICAvLyBYLCBa5L2N572u44KC5pu05paw44GX44Gm44CB44K544Og44O844K644Gq44Or44O844OX44Gr44GZ44KLXG4gICAgICAgICAgICBjb25zdCBub3JtYWxpemVkWSA9ICh1c2VyRGF0YS5jdXJyZW50WSArIHRvcm5hZG9IZWlnaHQgLyAyKSAvIHRvcm5hZG9IZWlnaHQ7XG4gICAgICAgICAgICBjb25zdCBuZXdSYWRpdXMgPSBib3R0b21SYWRpdXMgKyBub3JtYWxpemVkWSAqIChzcHJlYWRSYWRpdXMgLSBib3R0b21SYWRpdXMpO1xuXG4gICAgICAgICAgICBjb25zdCBuZXdBbmdsZSA9IE1hdGgucmFuZG9tKCkgKiBNYXRoLlBJICogMjtcbiAgICAgICAgICAgIHBsYW5lLnBvc2l0aW9uLnggPSBNYXRoLmNvcyhuZXdBbmdsZSkgKiBuZXdSYWRpdXM7XG4gICAgICAgICAgICBwbGFuZS5wb3NpdGlvbi56ID0gTWF0aC5zaW4obmV3QW5nbGUpICogbmV3UmFkaXVzO1xuXG4gICAgICAgICAgICAvLyDlkITnqK7pgJ/luqbjga7jg6rjgrvjg4Pjg4jjgajlho3oqK3lrppcbiAgICAgICAgICAgIHVzZXJEYXRhLmluaXRpYWxBbmdsZSA9IG5ld0FuZ2xlO1xuICAgICAgICAgICAgdXNlckRhdGEuZmFsbFNwZWVkID0gLSgwLjA1ICsgTWF0aC5yYW5kb20oKSAqIDAuMDUpO1xuICAgICAgICAgICAgdXNlckRhdGEucm90YXRpb25TcGVlZEFyb3VuZEF4aXMgPSAwLjA1ICsgTWF0aC5yYW5kb20oKSAqIDAuMDU7XG4gICAgICAgICAgICB1c2VyRGF0YS55QXhpc1JvdGF0aW9uU3BlZWQgPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAwLjAzO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gWeS9jee9ruOBq+W/nOOBmOOBn+ePvuWcqOOBruWNiuW+hOOCkuioiOeul1xuICAgICAgICBjb25zdCBub3JtYWxpemVkWSA9ICh1c2VyRGF0YS5jdXJyZW50WSArIHRvcm5hZG9IZWlnaHQgLyAyKSAvIHRvcm5hZG9IZWlnaHQ7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRSYWRpdXMgPSBib3R0b21SYWRpdXMgKyBub3JtYWxpemVkWSAqIChzcHJlYWRSYWRpdXMgLSBib3R0b21SYWRpdXMpO1xuXG4gICAgICAgIC8vIOernOW3u+OBruieuuaXi+Wbnui7olxuICAgICAgICBjb25zdCBhbmdsZSA9IE1hdGguYXRhbjIocGxhbmUucG9zaXRpb24ueiwgcGxhbmUucG9zaXRpb24ueCkgKyB1c2VyRGF0YS5yb3RhdGlvblNwZWVkQXJvdW5kQXhpcyAqIGRlbHRhVGltZTtcblxuICAgICAgICBwbGFuZS5wb3NpdGlvbi54ID0gTWF0aC5jb3MoYW5nbGUpICogY3VycmVudFJhZGl1cztcbiAgICAgICAgcGxhbmUucG9zaXRpb24ueSA9IHVzZXJEYXRhLmN1cnJlbnRZO1xuICAgICAgICBwbGFuZS5wb3NpdGlvbi56ID0gTWF0aC5zaW4oYW5nbGUpICogY3VycmVudFJhZGl1cztcblxuICAgICAgICAvLyDlgIvliKXjga7lm57ou6JcbiAgICAgICAgcGxhbmUucm90YXRpb24ueCArPSB1c2VyRGF0YS5pbmRpdmlkdWFsUm90YXRpb25TcGVlZC54O1xuICAgICAgICBwbGFuZS5yb3RhdGlvbi55ICs9IHVzZXJEYXRhLmluZGl2aWR1YWxSb3RhdGlvblNwZWVkLnk7XG4gICAgICAgIHBsYW5lLnJvdGF0aW9uLnogKz0gdXNlckRhdGEuaW5kaXZpZHVhbFJvdGF0aW9uU3BlZWQuejtcblxuICAgICAgICAvLyDoh6rouqvjga5Z6Lu45ZGo44KK44Gu5Zue6LuiXG4gICAgICAgIHBsYW5lLnJvdGF0aW9uLnkgKz0gdXNlckRhdGEueUF4aXNSb3RhdGlvblNwZWVkO1xuICAgIH0pO1xuXG4gICAgLy8gLS0tIOW7uueJqeOBruihneeqgeWIpOWumuOBqOWQueOBo+mjm+OBs+WHpueQhiAtLS1cbiAgICBjb25zdCBjb2xsaXNpb25SYWRpdXMgPSA1OyAvLyDnq5zlt7vjga7kuK3lv4PjgYvjgonjgZPjga7ot53pm6LlhoXjgavlhaXjgaPjgZ/jgonooZ3nqoHjgajjgb/jgarjgZlcbiAgICBjb25zdCBibG93QXdheUZvcmNlID0gMC41OyAvLyDlkLnjgaPpo5vjgbDjgZnlipvjga7lvLfjgZVcbiAgICBjb25zdCBncmF2aXR5ID0gLTAuMDU7ICAgIC8vIOmHjeWKm+OBruW9semfv1xuXG4gICAgLy8g56uc5be744Gu5Lit5b+D5L2N572u44KS44Ov44O844Or44OJ5bqn5qiZ44Gn5Y+W5b6XXG4gICAgY29uc3QgdG9ybmFkb1dvcmxkUG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICAgIHRvcm5hZG9Hcm91cC5nZXRXb3JsZFBvc2l0aW9uKHRvcm5hZG9Xb3JsZFBvc2l0aW9uKTtcblxuICAgIGJ1aWxkaW5ncy5mb3JFYWNoKGJ1aWxkaW5nID0+IHtcbiAgICAgICAgaWYgKCFidWlsZGluZy51c2VyRGF0YS5pc0Jsb3duQXdheSkge1xuICAgICAgICAgICAgLy8g56uc5be744Gu5Lit5b+D44Go5bu654mp44Gu5rC05bmz6Led6Zui44KS6KiI566XXG4gICAgICAgICAgICBjb25zdCBkaXN0YW5jZVggPSBidWlsZGluZy5wb3NpdGlvbi54IC0gdG9ybmFkb1dvcmxkUG9zaXRpb24ueDtcbiAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlWiA9IGJ1aWxkaW5nLnBvc2l0aW9uLnogLSB0b3JuYWRvV29ybGRQb3NpdGlvbi56O1xuICAgICAgICAgICAgY29uc3QgaG9yaXpvbnRhbERpc3RhbmNlID0gTWF0aC5zcXJ0KGRpc3RhbmNlWCAqIGRpc3RhbmNlWCArIGRpc3RhbmNlWiAqIGRpc3RhbmNlWik7XG5cbiAgICAgICAgICAgIC8vIOihneeqgeWIpOWumjog56uc5be744Gu5bqV44Gu5Y2K5b6EK86x44Gu56+E5Zuy5YaF44Gr5YWl44Gj44Gf44KJ6KGd56qBXG4gICAgICAgICAgICBpZiAoaG9yaXpvbnRhbERpc3RhbmNlIDwgYm90dG9tUmFkaXVzICsgY29sbGlzaW9uUmFkaXVzKSB7XG4gICAgICAgICAgICAgICAgYnVpbGRpbmcudXNlckRhdGEuaXNCbG93bkF3YXkgPSB0cnVlOyAvLyDlu7rnianjgYzlkLnjgaPpo5vjgbDjgZXjgozjgovnirbmhYvjgatcblxuICAgICAgICAgICAgICAgIC8vIOernOW3u+OBruS4reW/g+OBi+OCieWkluWBtOOBuOODqeODs+ODgOODoOOBquWKm+OCkuS4juOBiOOCi1xuICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2xlVG9CdWlsZGluZyA9IE1hdGguYXRhbjIoZGlzdGFuY2VaLCBkaXN0YW5jZVgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZvcmNlWCA9IE1hdGguY29zKGFuZ2xlVG9CdWlsZGluZykgKiAoYmxvd0F3YXlGb3JjZSArIE1hdGgucmFuZG9tKCkgKiBibG93QXdheUZvcmNlKTtcbiAgICAgICAgICAgICAgICBjb25zdCBmb3JjZVogPSBNYXRoLnNpbihhbmdsZVRvQnVpbGRpbmcpICogKGJsb3dBd2F5Rm9yY2UgKyBNYXRoLnJhbmRvbSgpICogYmxvd0F3YXlGb3JjZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgZm9yY2VZID0gTWF0aC5yYW5kb20oKSAqIGJsb3dBd2F5Rm9yY2UgKiAyOyAvLyDkuIrmlrnlkJHjgavjgoLlsJHjgZflipvjgpLliqDjgYjjgotcblxuICAgICAgICAgICAgICAgIGJ1aWxkaW5nLnVzZXJEYXRhLnZlbG9jaXR5LnNldChmb3JjZVgsIGZvcmNlWSwgZm9yY2VaKTtcbiAgICAgICAgICAgICAgICAvLyDjg6njg7Pjg4Djg6Djgarlm57ou6LpgJ/luqbjgoLkuI7jgYjjgotcbiAgICAgICAgICAgICAgICBidWlsZGluZy51c2VyRGF0YS5yb3RhdGlvblZlbG9jaXR5LnNldChcbiAgICAgICAgICAgICAgICAgICAgKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMC4yLFxuICAgICAgICAgICAgICAgICAgICAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAwLjIsXG4gICAgICAgICAgICAgICAgICAgIChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDAuMlxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBidWlsZGluZy51c2VyRGF0YS52ZWxvY2l0eS55ICs9IE1hdGgucmFuZG9tKCkgKiAwLjU7IC8vIFnmlrnlkJHjga7liJ3mnJ/pgJ/luqbjgpLjg6njg7Pjg4Djg6DjgavliqDnrpdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIOWQueOBo+mjm+OBsOOBleOCjOOBpuOBhOOCi+W7uueJqeOBruS9jee9ruOBqOWbnui7ouOCkuabtOaWsFxuICAgICAgICAgICAgYnVpbGRpbmcudXNlckRhdGEudmVsb2NpdHkueSArPSBncmF2aXR5ICogZGVsdGFUaW1lICogNjA7IC8vIOmHjeWKm+OCkumBqeeUqFxuICAgICAgICAgICAgYnVpbGRpbmcucG9zaXRpb24uYWRkKGJ1aWxkaW5nLnVzZXJEYXRhLnZlbG9jaXR5KTsgLy8g6YCf5bqm44Gr5b+c44GY44Gm5L2N572u44KS56e75YuVXG4gICAgICAgICAgICBidWlsZGluZy5yb3RhdGlvbi54ICs9IGJ1aWxkaW5nLnVzZXJEYXRhLnJvdGF0aW9uVmVsb2NpdHkueDsgLy8g5Zue6Lui44KS6YGp55SoXG4gICAgICAgICAgICBidWlsZGluZy5yb3RhdGlvbi55ICs9IGJ1aWxkaW5nLnVzZXJEYXRhLnJvdGF0aW9uVmVsb2NpdHkueTtcbiAgICAgICAgICAgIGJ1aWxkaW5nLnJvdGF0aW9uLnogKz0gYnVpbGRpbmcudXNlckRhdGEucm90YXRpb25WZWxvY2l0eS56O1xuXG4gICAgICAgICAgICAvLyDlu7rnianjgYzpgaDjgY/jgbjooYzjgaPjgZ/jgIHjgb7jgZ/jga/lnLDpnaLjga7kuIvjgavokL3jgaHjgZ/jgonjg6rjgrvjg4Pjg4hcbiAgICAgICAgICAgIGlmIChidWlsZGluZy5wb3NpdGlvbi55IDwgLTUwIHx8IGJ1aWxkaW5nLnBvc2l0aW9uLmRpc3RhbmNlVG8odG9ybmFkb1dvcmxkUG9zaXRpb24pID4gMTAwKSB7XG4gICAgICAgICAgICAgICAgYnVpbGRpbmcudXNlckRhdGEuaXNCbG93bkF3YXkgPSBmYWxzZTsgLy8g5ZC544Gj6aOb44Gz54q25oWL44KS44Oq44K744OD44OIXG4gICAgICAgICAgICAgICAgYnVpbGRpbmcucG9zaXRpb24uY29weShidWlsZGluZy51c2VyRGF0YS5vcmlnaW5hbFBvc2l0aW9uKTsgLy8g5YWD44Gu5L2N572u44Gr5oi744GZXG4gICAgICAgICAgICAgICAgYnVpbGRpbmcucm90YXRpb24uY29weShidWlsZGluZy51c2VyRGF0YS5vcmlnaW5hbFJvdGF0aW9uKTsgLy8g5YWD44Gu5Zue6Lui44Gr5oi744GZXG4gICAgICAgICAgICAgICAgYnVpbGRpbmcudXNlckRhdGEudmVsb2NpdHkuc2V0KDAsIDAsIDApOyAvLyDpgJ/luqbjgpLjg6rjgrvjg4Pjg4hcbiAgICAgICAgICAgICAgICBidWlsZGluZy51c2VyRGF0YS5yb3RhdGlvblZlbG9jaXR5LnNldCgwLCAwLCAwKTsgLy8g5Zue6Lui6YCf5bqm44KS44Oq44K744OD44OIXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIC0tLSBPcmJpdENvbnRyb2xz44Gu5pu05paw44Go44Os44Oz44OA44Oq44Oz44KwIC0tLVxuICAgIGNvbnRyb2xzLnVwZGF0ZSgpOyAvLyDjgqvjg6Hjg6njgrPjg7Pjg4jjg63jg7zjg6vjgpLmm7TmlrBcbiAgICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7IC8vIOOCt+ODvOODs+OCkuODrOODs+ODgOODquODs+OCsFxufVxuXG4vLyAtLS0g44Km44Kj44Oz44OJ44Km44Oq44K144Kk44K65pmC44Gu5Yem55CGIC0tLVxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7IC8vIOOCouOCueODmuOCr+ODiOavlOOCkuabtOaWsFxuICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7IC8vIOOCq+ODoeODqeOBruaKleW9seihjOWIl+OCkuabtOaWsFxuICAgIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7IC8vIOODrOODs+ODgOODqeODvOOCteOCpOOCuuOCkuabtOaWsFxufSwgZmFsc2UpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9ycy1ub2RlX21vZHVsZXNfdGhyZWVfZXhhbXBsZXNfanNtX2NvbnRyb2xzX09yYml0Q29udHJvbHNfanNcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBwLnRzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=