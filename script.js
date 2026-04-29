const imageUpload = document.getElementById('imageUpload');
const canvas = document.getElementById('outputCanvas');
const ctx = canvas.getContext('2d');
const loader = document.getElementById('loader');
const downloadBtn = document.getElementById('downloadBtn');

// 4K Target Dimensions (3.5 x 4.5 ratio)
const TARGET_WIDTH = 3500;
const TARGET_HEIGHT = 4500;

let fixedFrame = new Image();
fixedFrame.src = 'frame.png'; // আপনার ফ্রেমের নাম অবশ্যই frame.png হতে হবে

async function init() {
    console.log("Loading AI Models...");
    await faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/');
    console.log("System Ready");
}

imageUpload.addEventListener('change', async () => {
    const file = imageUpload.files[0];
    if (!file) return;

    loader.style.display = "block";
    const img = await faceapi.bufferToImage(file);
    
    // AI Face Detection
    const detections = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions());

    canvas.width = TARGET_WIDTH;
    canvas.height = TARGET_HEIGHT;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Step 1: Draw User Photo with Auto-Fit & Face Focus
    if (detections) {
        const { x, y, width, height } = detections.box;
        
        // Professional focus zoom
        const zoom = 2.3; 
        const sourceWidth = width * zoom;
        const sourceHeight = sourceWidth * (TARGET_HEIGHT / TARGET_WIDTH);
        
        const sourceX = x - (sourceWidth - width) / 2;
        const sourceY = y - (sourceHeight - height) / 2.5; 

        ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
    } else {
        // Full fit if no face found
        ctx.drawImage(img, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
    }

    // Step 2: Overlay the fixed Frame on top of the photo
    ctx.drawImage(fixedFrame, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
    
    loader.style.display = "none";
    downloadBtn.style.display = "block";
});

downloadBtn.onclick = () => {
    const link = document.createElement('a');
    link.download = 'ID_Photo_4K.png';
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
};

init();