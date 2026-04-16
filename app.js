window.onload = function () {
    if (typeof clm === "undefined") {
        console.error("clmtrackr is not loaded properly.");
        return;
    }

    console.log("clmtrackr loaded successfully.");

    // Initialize clmtrackr
    const tracker = new clm.tracker();
    try {
        tracker.init();
    } catch (error) {
        console.error("Error initializing tracker:", error);
        return;
    }

    // Create the video element for webcam feed
    const video = document.createElement("video");
    video.width = 640;
    video.height = 480;
    video.style.display = "none"; // Hide video feed
    document.body.appendChild(video);

    // Set up webcam and start video stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
            video.srcObject = stream;
            video.play();
            tracker.start(video);
            updateCursor();
        })
        .catch(err => {
            console.error("Error accessing webcam: ", err);
        });

    // Function to start calibration process
    function startCalibration() {
        tracker.start(video);
        console.log("Calibration started...");
        document.getElementById("calibration-status").innerText =
            "Calibration in progress... Follow the dots on the screen!";
    }

    // Function to update cursor based on eye coordinates
    function updateCursor() {
        requestAnimationFrame(updateCursor);
        const positions = tracker.getCurrentPosition();
        if (positions && positions.length > 27) {
            const eyeX = positions[27][0];
            const eyeY = positions[27][1];

            gsap.to("#custom-cursor", {
                x: eyeX - 10,
                y: eyeY - 10,
                duration: 0.2,
                ease: "power2.out"
            });

            document.getElementById("cursor-x").innerText = Math.round(eyeX);
            document.getElementById("cursor-y").innerText = Math.round(eyeY);
        }
    }

    // Start calibration automatically after 2 seconds
    setTimeout(startCalibration, 2000);
};
