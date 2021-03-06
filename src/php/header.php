<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Odyssey</title>

        <!-- Aframe version 1.0.4 -->
        <script src="/src/js/aframe.js"></script>
        <!-- Low Poly Version 0.0.2 -->
        <script src="/src/js/components/low-poly.js"></script>
        <script src="/src/js/components/ocean.js"></script>
        <script src="/src/js/components/animation-mixer.js"></script>
        <script src="/src/js/components/animation-timeline.js"></script>
        <script src="/src/js/components/rain.js"></script>
        <script src="/src/js/components/physics.js"></script>
        <script src="/src/js/hardware/bluetooth.js"></script>
        <script src="/src/js/hardware/sensorConfiguration.js"></script>
        <script src="/src/js/models/breathState.js"></script>
        <script src="/src/js/environment.js"></script>
        <script src="/src/js/chapters/introduction.js"></script>
        <script src="/src/js/chapters/relieve.js"></script>
        <script src="/src/js/chapters/confrontation.js"></script>
        <script src="/src/js/ui.js"></script>
        <script src="/src/js/progress.js"></script>
        <script src="/src/js/game.js"></script>

        <script>
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', function () {
                    navigator.serviceWorker.register('/service-worker.js', {
                        scope: './',
                    })
                })
            }
        </script>

        <link rel="apple-touch-icon" sizes="180x180" href="/src/images/favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/src/images/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/src/images/favicons/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/src/images/favicons/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="shortcut icon" href="/src/images/favicons/favicon.ico" />
        <meta name="apple-mobile-web-app-title" content="Odyssey" />
        <meta name="application-name" content="Odyssey" />
        <meta name="msapplication-TileColor" content="#2d89ef" />
        <meta name="msapplication-config" content="/src/images/favicons/browserconfig.xml" />
        <meta name="theme-color" content="#ffffff" />

        <link rel="stylesheet" href="/src/css/style.css" />
    </head>
    <body>

