document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('myCanvas');
    
    if (!canvas) {
        alert('Canvas element with id "myCanvas" not found!');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
        alert('Failed to get 2D context!');
        return;
    }

    // Filled rectangle
    ctx.fillStyle = 'gold';
    ctx.fillRect(50, 50, 150, 100);

    // Filled circle
    ctx.beginPath();
    ctx.arc(350, 100, 50, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();

    // Straight line
    ctx.beginPath();
    ctx.moveTo(50, 200);
    ctx.lineTo(450, 200);
    ctx.strokeStyle = 'violet';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Text
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('HTML5 Canvas', 150, 280);
});
