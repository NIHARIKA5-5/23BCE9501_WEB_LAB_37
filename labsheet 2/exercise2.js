document.addEventListener('DOMContentLoaded', function() {
    // Audio Player Time Display
    const audio = document.getElementById('audioPlayer');
    const audioTime = document.getElementById('audioTime');
    const audioDuration = document.getElementById('audioDuration');

    if (audio && audioTime && audioDuration) {
        audio.addEventListener('loadedmetadata', () => {
            audioDuration.textContent = formatTime(audio.duration);
        });

        audio.addEventListener('timeupdate', () => {
            audioTime.textContent = formatTime(audio.currentTime);
        });
    }

    // Video Player Time Display
    const video = document.getElementById('videoPlayer');
    const videoTime = document.getElementById('videoTime');
    const videoDuration = document.getElementById('videoDuration');

    if (video && videoTime && videoDuration) {
        video.addEventListener('loadedmetadata', () => {
            videoDuration.textContent = formatTime(video.duration);
        });

        video.addEventListener('timeupdate', () => {
            videoTime.textContent = formatTime(video.currentTime);
        });
    }

    // Format time as MM:SS
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds === 0) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
});
