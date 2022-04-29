<?php include $_SERVER['DOCUMENT_ROOT'] . "/src/php/header.php"; ?>

<?php include $_SERVER['DOCUMENT_ROOT'] . "/src/php/wearableConfiguration.php";?>

<!-- A-Frame -->

<a-scene fog="type: linear; color: #a3d0ed; near:5; far:20">
    <a-sky color="#a3d0ed"></a-sky>

    <!-- Mixins -->
    <a-assets>
        <a-mixin
            id="foliage"
            geometry="primitive: cone; segments-height: 1; segments-radial: 4; radius-bottom: 0.3"
            material="color:white;flat-shading:true';"
        ></a-mixin>
        <a-mixin
            id="trunk"
            geometry="primitive:box; height:0.5; width: 0.1; depth: 0.1;"
            material="color: white;"
        ></a-mixin>
        <a-mixin id="text" text="font: src/font/Exo2Bold.fnt; anchor:center;align:center;"></a-mixin>
        <a-mixin
            id="title"
            text="font: src/font/Exo2Bold.fnt; height: 40; width: 40; opacity: 0.75; anchor: center; align: center"
        ></a-mixin>
        <a-mixin
            id="heading"
            text="font: src/font/Exo2Bold.fnt; height: 10; width: 10; opacity: 0.75; anchor: center; align: center"
        ></a-mixin>
        <a-mixin
            id="copy"
            text="font: src/font/Exo2Bold.fnt; height: 5; width: 5; opacity: 0.75; anchor: center; align: center"
        ></a-mixin>
    </a-assets>

    <!-- Lights -->
    <a-light type="directional" castShadow="true" intensity="0.4" color="#D0EAF9" position="5 3 1"></a-light>
    <a-light intensity="0.8" type="ambient" color="#B4C5EC"></a-light>

    <!-- Camera -->
    <a-camera id="player-camera" position="0 1.5 2" lane-controls look-controls="enabled: false">
        <a-entity
            id="cursor-mobile"
            cursor="fuse: true; fuseTimeout: 250"
            position="0 0 -1"
            geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
            material="color: white; shader: flat"
            scale="0.5 0.5 0.5"
            raycaster="far: 50; interval: 1000; objects: .clickable"
        ></a-entity>
        <a-animation
            begin="fusing"
            easing="ease-in"
            attribute="scale"
            fill="backwards"
            from="1 1 1"
            to="0.2 0.2 0.2"
            dur="250"
        ></a-animation>
    </a-camera>

    <!-- Icebergs -->
    <lp-cone
        class="iceberg"
        amplitude-variance="0.25"
        segments-radial="5"
        segments-height="3"
        height="1"
        radius-top="0.15"
        radius-bottom="0.5"
        position="3 -0.1 -1.5"
        animation__rotation="property: rotation; from: -5 0 0; to: 5 0 0; loop: true; dir: alternate; dur: 1500;"
        animation__position="property: position; from: 3 -0.2 -1.5; to: 4 -0.2 -2.5; loop: true; dir: alternate; dur: 12000; easing: linear;"
    >
    </lp-cone>
    <lp-cone
        class="iceberg"
        amplitude="0.12"
        segments-radial="7"
        segments-height="3"
        height="0.5"
        radius-top="0.25"
        radius-bottom="0.35"
        position="-3 -0.1 -0.5"
        animation__rotation="property: rotation; from: 0 0 -5; to: 5 0 0; loop: true; dir: alternate; dur: 1500;"
        animation__position="property: position; from: -4 -0.2 -0.5; to: -2 -0.2 -0.5; loop: true; dir: alternate; dur: 15000; easing: linear;"
    >
    </lp-cone>
    <lp-cone
        class="iceberg"
        amplitude="0.1"
        segments-radial="6"
        segments-height="2"
        height="0.5"
        radius-top="0.25"
        radius-bottom="0.25"
        position="-5 -0.2 -3.5"
        animation__rotation="property: rotation; from: 5 0 -5; to: 5 0 0; loop: true; dir: alternate; dur: 800;"
        animation__position="property: position; from: -3 -0.2 -3.5; to: -5 -0.2 -5.5; loop: true; dir: alternate; dur: 15000; easing: linear;"
    >
    </lp-cone>

    <!-- Ocean -->
    <a-ocean
        depth="50"
        width="50"
        amplitude="0"
        amplitude-variance="0.1"
        speed="1.5"
        speed-variance="1"
        opacity="1"
        density="50"
    ></a-ocean>
    <a-ocean
        depth="50"
        width="50"
        opacity="0.5"
        amplitude="0"
        amplitude-variance="0.15"
        speed="1.5"
        speed-variance="1"
        density="50"
    ></a-ocean>

    <!-- Platform -->
    <lp-cone
        amplitude="0.05"
        amplitude-variance="0.05"
        scale="2 2 2"
        shadow
        position="0 -3.5 -1.5"
        rotation="90 0 0"
        radius-top="1.9"
        radius-bottom="1.9"
        segments-radial="20"
        segments-height="20"
        height="20"
        emissive="#005DED"
        emissive-intensity="0.1"
    >
        <a-entity id="tree-container" position="0 0 -1.5" rotation="-90 0 0">
            <!-- Trees -->
            <a-entity
                id="template-tree-center"
                shadow
                scale="0.3 0.3 0.3"
                position="0 0.6 0"
                class="tree"
                data-tree-position-index="1"
                animation__position="property: position; from: 0 0.6 -7; to: 0 0.6 2; dur: 5000; easing: linear;"
            >
                <a-entity mixin="foliage"></a-entity>
                <a-entity mixin="trunk" position="0 -0.5 0"></a-entity>
            </a-entity>
            <a-entity
                id="template-tree-left"
                shadow
                scale="0.3 0.3 0.3"
                position="-0.5 0.6 0"
                class="tree"
                data-tree-position-index="0"
                animation__position="property: position; from: -0.5 0.6 -7; to: -0.5 0.6 2; dur: 5000; easing: linear;"
            >
                <a-entity mixin="foliage"></a-entity>
                <a-entity mixin="trunk" position="0 -0.5 0"></a-entity>
            </a-entity>
            <a-entity
                id="template-tree-right"
                shadow
                scale="0.3 0.3 0.3"
                position="0.5 0.6 0"
                class="tree"
                data-tree-position-index="2"
                animation__position="property: position; from: 0.5 0.6 -7; to: 0.5 0.6 2; dur: 5000; easing: linear;"
            >
                <a-entity mixin="foliage"></a-entity>
                <a-entity mixin="trunk" position="0 -0.5 0"></a-entity>
            </a-entity>

            <!-- Score -->

            <a-text
                id="score"
                value="0"
                mixin="text"
                height="40"
                width="40"
                position="0 1.2 -3"
                opacity="0.75"
                visible
            ></a-text>

            <!-- Menus -->
            <a-entity id="menu-container">
                <a-entity id="start-menu" position="0 1.1 -3">
                    <a-entity id="start-copy" position="0 1 0">
                        <a-text
                            value="Turn left and right to move your player, and avoid the trees!"
                            mixin="copy"
                        ></a-text>
                        <a-text value="Start" position="0 0.75 0" mixin="heading"></a-text>
                        <a-box
                            id="start-button"
                            position="0 0.65 -0.05"
                            width="1.5"
                            height="0.6"
                            depth="0.1"
                        ></a-box>
                    </a-entity>
                    <a-text value="ERGO" mixin="title"></a-text>
                </a-entity>

                <a-entity id="game-over" position="0 1.1 -3">
                    <a-text value="?" mixin="heading" id="game-score" position="0 1.7 0"></a-text>
                    <a-text value="Score" mixin="copy" position="0 1.2 0"></a-text>

                    <a-entity id="game-over-copy">
                        <a-text mixin="heading" position="0 0.6 0" value="Restart"></a-text>
                        <a-box
                            id="restart-button"
                            position="0 0.6 -0.5"
                            width="2"
                            height="0.6"
                            depth="0.1"
                        ></a-box>
                    </a-entity>

                    <a-text value="Game Over" mixin="title"></a-text>
                </a-entity>
            </a-entity>

            <!-- Player -->
            <a-entity id="player" player>
                <a-sphere
                    radius="0.05"
                    animation__radius="property: radius; from: 0.05; to: 0.055; loop: true; dir: alternate; dur: 1500;"
                    animation__position="property: position; from: 0 0.5 0.6; to: 0 0.525 0.6; loop: true; dir: alternate; dur: 15000; easing: easeInOutQuad;"
                >
                    <a-light type="point" intensity="0.35" color="#FF440C"></a-light>
                </a-sphere>
            </a-entity>
        </a-entity>
    </lp-cone>
</a-scene>

<?php include $_SERVER['DOCUMENT_ROOT'] . "/src/php/header.php"; ?>