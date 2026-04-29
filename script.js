const imageUpload = document.getElementById('imageUpload');
const canvas = document.getElementById('outputCanvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');
const placeholderText = document.getElementById('placeholderText');

// 4K Resolution (Square)
const SIZE = 3000; 
const frameImg = new Image();
frameImg.src = 'frame.png'; // আপনার ফ্রেমের নাম frame.png হতে হবে

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            placeholderText.style.display = 'none';
            canvas.width = SIZE;
            canvas.height = SIZE;

            // ছবির মাঝখানের অংশ বের করার লজিক (Auto Center Fit)
            let sourceX, sourceY, sourceSize;
            if (img.width > img.height) {
                sourceSize = img.height;
                sourceX = (img.width - img.height) / 2;
                sourceY = 0;
            } else {
                sourceSize = img.width;
                sourceX = 0;
                sourceY = (img.height - img.width) / 3; // মুখ উপরে থাকে তাই ১/৩ অংশ ফোকাস
            }

            // হাই কোয়ালিটি রেন্ডারিং
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // ১. ইউজারের ছবি ড্র করা
            ctx.drawImage(img, sourceX, sourceY, sourceSize, sourceSize, 0, 0, SIZE, SIZE);
            
            // ২. ফ্রেমটি উপরে বসানো
            ctx.drawImage(frameImg, 0, 0, SIZE, SIZE);

            downloadBtn.style.display = 'block';
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

downloadBtn.onclick = () => {
    const link = document.createElement('a');
    link.download = 'Reunion_Photo_4K.png';
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
};
