class RadarScanner {
    constructor(canvasId) {
        // 获取画布元素并设置上下文
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // 基础配置
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        this.radius = Math.min(this.centerX, this.centerY) - 10;
        this.angle = 0; // 扫描角度
        
        // 目标点数据
        this.targets = [
            { x: 150, y: 100 },
            { x: 300, y: 200 },
            { x: 400, y: 350 },
            { x: 250, y: 400 },
            { x: 100, y: 300 },
        ];

        // 初始化动画
        this.animate();
    }

    // 绘制雷达背景（边框和同心圆）
    drawBackground() {
        const ctx = this.ctx;
        
        // 外边框
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 255, 230, 0.3)';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'cyan';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // 同心圆
        for (let i = 1; i <= 4; i++) {
            ctx.beginPath();
            ctx.arc(this.centerX, this.centerY, (this.radius / 4) * i, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 255, 255, ${0.1 + i * 0.05})`;
            ctx.lineWidth = 1;
            ctx.shadowColor = 'cyan';
            ctx.shadowBlur = 6;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }

    // 绘制扫描线
    drawScanLine() {
        const ctx = this.ctx;
        const scanAngle = this.angle * Math.PI / 180;

        // 扫描线渐变效果
        const gradient = ctx.createRadialGradient(
            this.centerX + Math.cos(scanAngle) * this.radius * 0.5,
            this.centerY + Math.sin(scanAngle) * this.radius * 0.5,
            this.radius * 0.1,
            this.centerX + Math.cos(scanAngle) * this.radius,
            this.centerY + Math.sin(scanAngle) * this.radius,
            this.radius
        );
        gradient.addColorStop(0, 'rgba(0, 255, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(this.centerX, this.centerY);
        ctx.arc(this.centerX, this.centerY, this.radius, scanAngle - 0.03, scanAngle + 0.03);
        ctx.closePath();
        ctx.shadowColor = 'aqua';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    // 绘制目标点
    drawTargets() {
        const ctx = this.ctx;
        
        this.targets.forEach(target => {
            const dx = target.x - this.centerX;
            const dy = target.y - this.centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= this.radius) {
                ctx.beginPath();
                ctx.arc(target.x, target.y, 6, 0, Math.PI * 2);
                ctx.fillStyle = 'aqua';
                ctx.shadowColor = 'cyan';
                ctx.shadowBlur = 15;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        });
    }

    // 主绘制函数
    draw() {
        // 清除画布
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // 绘制各部分
        this.drawBackground();
        this.drawScanLine();
        this.drawTargets();
        
        // 更新角度
        this.angle = (this.angle + 1) % 360;
    }

    // 动画循环
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// 页面加载完成后初始化雷达
window.addEventListener('DOMContentLoaded', () => {
    new RadarScanner('radar');
});