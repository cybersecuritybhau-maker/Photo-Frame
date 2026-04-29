const imageUpload = document.getElementById('imageUpload');
const frameSelect = document.getElementById('frameSelect');
const canvas = document.getElementById('outputCanvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');
const placeholder = document.getElementById('placeholder');

const SIZE = 3000; // 4K Resolution

imageUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const userImg = new Image();
        userImg.onload = function() {
            const frameImg = new Image();
            frameImg.src = frameSelect.value;

            frameImg.onload = function() {
                placeholder.style.display = 'none';
                canvas.width = SIZE;
                canvas.height = SIZE;

                // Smart Crop Logic (Auto-Fit)
                let sourceX, sourceY, sourceSize;
                const ratio = userImg.width / userImg.height;

                if (ratio > 1) {
                    sourceSize = userImg.height;
                    sourceX = (userImg.width - userImg.height) / 2;
                    sourceY = 0;
                } else {
                    sourceSize = userImg.width;
                    sourceX = 0;
                    sourceY = (userImg.height - userImg.width) / 3; // Focus on face
                }

                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                // ১. ইউজারের ছবি আঁকা
                ctx.drawImage(userImg, sourceX, sourceY, sourceSize, sourceSize, 0, 0, SIZE, SIZE);
                
                // ২. নির্বাচিত ফ্রেমটি আঁকা
                ctx.drawImage(frameImg, 0, 0, SIZE, SIZE);

                downloadBtn.style.display = 'block';
            };
            // ফ্রেম লোড না হলে এরর হ্যান্ডলিং
            frameImg.onerror = () => alert("Frame file not found! Make sure frame names match.");
        };
        userImg.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// ডাউনলোড ফাংশন
downloadBtn.addEventListener('click', function() {
    const link = document.createElement('a');
    link.download = 'Nagib_Studio_Photo.png';
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
});
