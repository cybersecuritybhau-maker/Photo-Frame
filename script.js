const imageUpload = document.getElementById('imageUpload');
const frameSelect = document.getElementById('frameSelect');
const canvas = document.getElementById('outputCanvas');
const ctx = canvas.getContext('2d');
const loader = document.getElementById('loader');
const downloadBtn = document.getElementById('downloadBtn');

const TARGET_WIDTH = 3500;
const TARGET_HEIGHT = 4500;

// সিস্টেম অপ্টিমাইজেশন: ব্রাউজার মেমোরিতে মডেল ধরে রাখা
async function init() {
    loader.style.display = "block";
    loader.innerText = "System Boosting... Ready in a second";

    try {
        // ফাস্টার মডেল লোডিং (TinyFaceDetector এর ইনপুট সাইজ কমিয়ে স্পিড বাড়ানো হয়েছে)
        await faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/');
        
        // ব্যাকগ্রাউন্ডে ফ্রেম লোড করে রাখা
        const preloadFrame = new Image();
        preloadFrame.src = frameSelect.value;

        loader.style.display = "none";
        console.log("Super Fast AI Ready");
    } catch (e) {
        loader.innerText = "AI Connection Error. Refresh page.";
    }
}

imageUpload.addEventListener('change', async () => {
    const file = imageUpload.files[0];
    if (!file) return;

    loader.style.display = "block";
    loader.innerText = "Fast Matching...";

    const img = await faceapi.bufferToImage(file);
    
    // সুপার ফাস্ট ডিটেকশন সেটিংস (inputSize কমানো হয়েছে স্পিডের জন্য)
    const detections = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions({
        inputSize: 128, // ১২৮ বা ১৬০ দিলে স্পিড অনেক বেড়ে যায়
        scoreThreshold: 0.5
    }));

    const frameImg = new Image();
    frameImg.src = frameSelect.value;

    frameImg.onload = () => {
        canvas.width = TARGET_WIDTH;
        canvas.height = TARGET_HEIGHT;
        
        // রেন্ডারিং কোয়ালিটি ফিক্স
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'medium'; // 'high' এর বদলে 'medium' দিলে প্রসেসিং ফাস্ট হয়

        if (detections) {
            const { x, y, width, height } = detections.box;
            const zoom = 2.4; 
            const sourceWidth = width * zoom;
            const sourceHeight = sourceWidth * (TARGET_HEIGHT / TARGET_WIDTH);
            const sourceX = x - (sourceWidth - width) / 2;
            const sourceY = y - (sourceHeight - height) / 2.5; 

            ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
        } else {
            ctx.drawImage(img, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
        }

        ctx.drawImage(frameImg, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
        
        loader.style.display = "none";
        downloadBtn.style.display = "block";
    };
});

// সরাসরি ডাউনলোড ফাংশন
downloadBtn.onclick = () => {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'Fast_4K_Photo.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

init();
