class Snowflake {
    constructor(canvas) {
        this.canvas = canvas;
        this.init();
    }

    init() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * -this.canvas.height;
        this.size = Math.random() * 4 + 1;
        this.speedY = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() * 0.02 - 0.01);
        this.opacity = Math.random() * 0.5 + 0.3;
        this.wobbleOffset = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.05 + 0.02;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.wobbleOffset + this.y * 0.01) * 0.3;
        this.rotation += this.rotationSpeed;
        this.wobbleOffset += this.wobbleSpeed;

        if (this.y > this.canvas.height) {
            this.init();
            this.y = -this.size;
        }

        if (this.x < 0) {
            this.x = this.canvas.width;
        } else if (this.x > this.canvas.width) {
            this.x = 0;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(200, 230, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(200, 230, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();

        const spikes = 6;
        const outerRadius = this.size;
        const innerRadius = this.size * 0.4;

        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI / spikes) * i - Math.PI / 2;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;

            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }

        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();

        ctx.restore();
    }
}

class SnowSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.snowflakes = [];
        this.flakeCount = 200;
        
        this.resize();
        this.createSnowflakes();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createSnowflakes() {
        this.snowflakes = [];
        for (let i = 0; i < this.flakeCount; i++) {
            const flake = new Snowflake(this.canvas);
            flake.y = Math.random() * this.canvas.height;
            this.snowflakes.push(flake);
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.snowflakes.forEach(flake => {
            flake.update();
            flake.draw(this.ctx);
        });

        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const snowSystem = new SnowSystem('snowCanvas');
});