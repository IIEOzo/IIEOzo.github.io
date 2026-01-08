// 设备检测和配置
class DeviceConfig {
    constructor() {
        this.deviceType = this.detectDevice();
        this.config = this.getConfig();
    }
    
    detectDevice() {
        const width = window.innerWidth;
        if (width <= 767) return 'mobile';
        if (width <= 1024) return 'tablet';
        return 'desktop';
    }
    
    getConfig() {
        const configs = {
            mobile: {
                // 波浪线配置
                wave: {
                    maxRadius: 800,           // 最大半径
                    effectRange: 120,         // 影响范围
                    strengthMultiplier: 0.5,  // 强度乘数
                    speed: 6,                // 传播速度
                    damping: 0.95            // 衰减系数
                },
                // 椭圆变形配置
                ellipse: {
                    effectDistance: 150,      // 影响距离
                    distortionMultiplier: 0.6, // 变形强度
                    blurMultiplier: 0.2       // 模糊乘数
                },
                // 点击效果配置
                click: {
                    rippleSize: 300,         // 波纹大小
                    rippleDuration: 1000,    // 波纹持续时间
                    strengthMultiplier: 1.5  // 点击强度
                },
                // 线条密度和粗细
                lines: {
                    strokeWidth: 2.5,        // 线条粗细
                    xGap: 8,                 // X轴间距
                    yGap: 15                 // Y轴间距
                }
            },
            tablet: {
                wave: {
                    maxRadius: 1000,
                    effectRange: 100,
                    strengthMultiplier: 0.7,
                    speed: 7,
                    damping: 0.96
                },
                ellipse: {
                    effectDistance: 200,
                    distortionMultiplier: 0.8,
                    blurMultiplier: 0.25
                },
                click: {
                    rippleSize: 350,
                    rippleDuration: 1100,
                    strengthMultiplier: 2.0
                },
                lines: {
                    strokeWidth: 2.0,        // 线条粗细
                    xGap: 10,                // X轴间距
                    yGap: 30                 // Y轴间距
                }
            },
            desktop: {
                wave: {
                    maxRadius: 1200,
                    effectRange: 90,
                    strengthMultiplier: 1.0,
                    speed: 8,
                    damping: 0.98
                },
                ellipse: {
                    effectDistance: 250,
                    distortionMultiplier: 1.0,
                    blurMultiplier: 0.3
                },
                click: {
                    rippleSize: 400,
                    rippleDuration: 1200,
                    strengthMultiplier: 3.0
                },
                lines: {
                    strokeWidth: 1.5,        // 线条粗细
                    xGap: 12,                // X轴间距
                    yGap: 35                 // Y轴间距
                }
            }
        };
        
        return configs[this.deviceType] || configs.desktop;
    }
}

const deviceConfig = new DeviceConfig();

// 改进的波浪线效果，鼠标移动时产生向四周扩散的余波
class AWaves extends HTMLElement {
    connectedCallback() {
        this.svg = this.querySelector('svg')
        this.mouse = {
            x: 0,
            y: 0,
            lx: 0,
            ly: 0,
            sx: 0,
            sy: 0,
            v: 0,
            vs: 0,
            a: 0,
            // 添加鼠标历史位置用于计算扩散效果
            history: [],
            maxHistory: 10,
            // 添加波源数组，用于管理多个扩散波
            waveSources: []
        }
        this.lines = []
        this.paths = []

        this.bindEvents()
        this.setSize()
        this.setLines()

        requestAnimationFrame(this.tick.bind(this))
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.setSize()
            this.setLines()
            // 窗口大小变化时更新元素位置
            updateElementPositions();
        })
        
        // 桌面端和平板端使用鼠标事件
        if (deviceConfig.deviceType !== 'mobile') {
            window.addEventListener('mousemove', (e) => {
                this.updateMousePosition(e.pageX, e.pageY)
                // 添加新的波源
                this.addWaveSource(e.pageX - this.bounding.left, e.pageY - this.bounding.top + window.scrollY)
            })
        }
        
        // 移动端使用触摸事件
        this.addEventListener('touchmove', (e) => {
            e.preventDefault()
            this.updateMousePosition(e.touches[0].clientX, e.touches[0].clientY)
            this.addWaveSource(e.touches[0].clientX - this.bounding.left, e.touches[0].clientY - this.bounding.top + window.scrollY, 
                              deviceConfig.config.click.strengthMultiplier * 0.5) // 移动端降低强度
        })
        
        // 点击时也产生波纹
        this.addEventListener('click', (e) => {
            const x = e.pageX - this.bounding.left;
            const y = e.pageY - this.bounding.top + window.scrollY;
            this.addWaveSource(x, y, deviceConfig.config.click.strengthMultiplier);
        });
        
        // 移动端点击效果
        this.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const x = e.touches[0].clientX - this.bounding.left;
            const y = e.touches[0].clientY - this.bounding.top + window.scrollY;
            this.addWaveSource(x, y, deviceConfig.config.click.strengthMultiplier * 0.7); // 移动端降低强度
            createRipple(e.touches[0].clientX, e.touches[0].clientY, true);
        });
    }
    
    setSize() {
        this.bounding = this.getBoundingClientRect()
        this.svg.style.width = `${this.bounding.width}px`
        this.svg.style.height = `${this.bounding.height}px`
    }
    
    setLines() {
        const { width, height } = this.bounding
        
        this.lines = []
        this.paths.forEach((path) => {
            path.remove()
        })
        this.paths = []

        // 根据设备类型调整线条密度和粗细
        const linesConfig = deviceConfig.config.lines;
        const xGap = linesConfig.xGap;
        const yGap = linesConfig.yGap;

        const oWidth = width + 200
        const oHeight = height + 30

        const totalLines = Math.ceil(oWidth / xGap)
        const totalPoints = Math.ceil(oHeight / yGap)

        const xStart = (width - xGap * totalLines) / 2
        const yStart = (height - yGap * totalPoints) / 2

        for (let i = 0; i <= totalLines; i++) {
            const points = []
            for (let j = 0; j <= totalPoints; j++) {
                const point = {
                    x: xStart + xGap * i,
                    y: yStart + yGap * j,
                    cursor: { x: 0, y: 0, vx: 0, vy: 0 },
                    // 添加波浪属性
                    waveOffset: Math.random() * Math.PI * 2, // 随机相位偏移
                    baseY: yStart + yGap * j, // 存储基础Y位置
                }
                points.push(point)
            }
            this.lines.push(points)

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
            // 设置线条粗细
            path.setAttribute('stroke-width', linesConfig.strokeWidth);
            this.svg.appendChild(path)
            this.paths.push(path)
        }
    }
    
    updateMousePosition(x, y) {
        const { mouse } = this
        mouse.x = x - this.bounding.left
        mouse.y = y - this.bounding.top + window.scrollY
        
        // 记录鼠标位置历史
        mouse.history.push({x: mouse.x, y: mouse.y, time: Date.now()})
        if (mouse.history.length > mouse.maxHistory) {
            mouse.history.shift()
        }
        
        // 更新自定义光标位置（仅桌面端和平板端）
        if (deviceConfig.deviceType !== 'mobile') {
            const cursor = document.querySelector('.cursor')
            if (cursor) {
                cursor.style.left = `${x}px`
                cursor.style.top = `${y}px`
            }
        }
    }
    
    // 添加波源（鼠标移动时调用）
    addWaveSource(x, y, strengthMultiplier = 1.0) {
        const waveConfig = deviceConfig.config.wave;
        const wave = {
            x: x,
            y: y,
            strength: waveConfig.strengthMultiplier * strengthMultiplier,
            time: Date.now(),
            radius: 0,
            maxRadius: waveConfig.maxRadius,
            speed: waveConfig.speed + Math.random() * 3,
            damping: waveConfig.damping
        };
        
        this.mouse.waveSources.push(wave);
        
        // 根据设备类型调整同时存在的波源数量
        const maxSources = deviceConfig.deviceType === 'mobile' ? 15 : 
                         deviceConfig.deviceType === 'tablet' ? 20 : 25;
        
        if (this.mouse.waveSources.length > maxSources) {
            this.mouse.waveSources.shift();
        }
    }
    
    // 更新波源
    updateWaveSources() {
        const now = Date.now();
        const activeSources = [];
        const waveConfig = deviceConfig.config.wave;
        
        for (const wave of this.mouse.waveSources) {
            // 更新波半径
            wave.radius += wave.speed;
            
            // 计算波强度衰减 - 根据设备类型调整衰减率
            const age = (now - wave.time) / 1000;
            const distanceFactor = Math.max(0, 1 - wave.radius / wave.maxRadius);
            const timeFactor = Math.max(0, 1 - age * 0.3);
            wave.currentStrength = wave.strength * distanceFactor * timeFactor * wave.damping;
            
            // 如果波仍然有效，保留它
            if (wave.radius < wave.maxRadius && wave.currentStrength > 0.005) {
                activeSources.push(wave);
            }
        }
        
        this.mouse.waveSources = activeSources;
    }
    
    // 计算点受到的波影响
    calculateWaveForce(point, time) {
        let totalForceX = 0;
        let totalForceY = 0;
        const waveConfig = deviceConfig.config.wave;
        
        // 基础波浪效果（轻微起伏）
        const waveFrequency = 0.003;
        const waveAmplitude = 0.3 * waveConfig.strengthMultiplier;
        const baseWaveY = Math.sin(time * waveFrequency + point.waveOffset) * waveAmplitude;
        
        totalForceY += baseWaveY * 0.05;
        
        // 鼠标位置对点的影响（向外扩散的力）
        const { mouse } = this;
        const dx = point.x - mouse.sx;
        const dy = point.y - mouse.sy;
        const distance = Math.hypot(dx, dy);
        
        // 鼠标直接影响范围根据设备类型调整
        const maxMouseDistance = deviceConfig.deviceType === 'mobile' ? 15 : 
                               deviceConfig.deviceType === 'tablet' ? 12 : 10;
        
        if (distance > 0 && distance < maxMouseDistance) {
            // 计算从鼠标指向点的单位向量（向外扩散）
            const angle = Math.atan2(dy, dx);
            const forceFactor = 1 - distance / maxMouseDistance;
            const forceStrength = forceFactor * mouse.vs * 0.1 * waveConfig.strengthMultiplier;
            
            totalForceX += Math.cos(angle) * forceStrength;
            totalForceY += Math.sin(angle) * forceStrength;
        }
        
        // 波源的影响（多个向外扩散的圆形波）
        for (const wave of mouse.waveSources) {
            const wx = point.x - wave.x;
            const wy = point.y - wave.y;
            const waveDistance = Math.hypot(wx, wy);
            const waveRadiusDiff = Math.abs(waveDistance - wave.radius);
            
            // 波的影响范围根据设备类型调整
            const waveEffectRange = waveConfig.effectRange;
            if (waveRadiusDiff < waveEffectRange && waveDistance > 0) {
                // 计算波的影响强度
                const waveEffect = 1 - waveRadiusDiff / waveEffectRange;
                const waveForce = waveEffect * wave.currentStrength * 0.2 * waveConfig.strengthMultiplier;
                
                // 波向外扩散，力的方向从波源指向点
                const waveAngle = Math.atan2(wy, wx);
                totalForceX += Math.cos(waveAngle) * waveForce;
                totalForceY += Math.sin(waveAngle) * waveForce;
                
                // 添加轻微的上下波动
                totalForceY += Math.sin(waveDistance * 0.03 - wave.radius * 0.05) * waveEffect * 0.1;
            }
        }
        
        return { x: totalForceX, y: totalForceY };
    }
    
    movePoints(time) {
        const { lines, mouse } = this;
        const waveConfig = deviceConfig.config.wave;
        
        // 更新波源
        this.updateWaveSources();
        
        lines.forEach((points) => {
            points.forEach((p) => {
                // 计算点受到的总力
                const force = this.calculateWaveForce(p, time);
                
                // 应用力到点的速度 - 根据设备类型调整
                const forceMultiplier = waveConfig.strengthMultiplier;
                p.cursor.vx += force.x * 0.8 * forceMultiplier;
                p.cursor.vy += force.y * 0.8 * forceMultiplier;
                
                // 弹性恢复力（使点回到原位）
                p.cursor.vx += (0 - p.cursor.x) * 0.005;
                p.cursor.vy += (0 - p.cursor.y) * 0.005;
                
                // 阻尼（减慢速度）
                p.cursor.vx *= 0.96;
                p.cursor.vy *= 0.96;
                
                // 更新位置
                p.cursor.x += p.cursor.vx;
                p.cursor.y += p.cursor.vy;
                
                // 增加最大位移限制
                const maxDisplacement = 80 * forceMultiplier;
                p.cursor.x = Math.min(maxDisplacement, Math.max(-maxDisplacement, p.cursor.x));
                p.cursor.y = Math.min(maxDisplacement, Math.max(-maxDisplacement, p.cursor.y));
            });
        });
    }
    
    moved(point, withCursorForce = true) {
        const coords = {
            x: point.x + (withCursorForce ? point.cursor.x : 0),
            y: point.y + (withCursorForce ? point.cursor.y : 0),
        }

        coords.x = Math.round(coords.x * 10) / 10
        coords.y = Math.round(coords.y * 10) / 10

        return coords
    }
    
    drawLines() {
        const { lines, moved, paths } = this

        lines.forEach((points, lIndex) => {
            let p1 = moved(points[0], false)
            let d = `M ${p1.x} ${p1.y}`

            points.forEach((p, pIndex) => {
                const isLast = pIndex === points.length - 1
                p = moved(p, !isLast)
                d += `L ${p.x} ${p.y}`
            })

            paths[lIndex].setAttribute('d', d)
        })
    }
    
    tick(time) {
        const { mouse } = this

        // 平滑鼠标位置
        const smoothFactor = deviceConfig.deviceType === 'mobile' ? 1 : 0.5;
        mouse.sx += (mouse.x - mouse.sx) * smoothFactor;
        mouse.sy += (mouse.y - mouse.sy) * smoothFactor;

        // 计算鼠标速度
        const dx = mouse.x - mouse.lx
        const dy = mouse.y - mouse.ly
        const d = Math.hypot(dx, dy)

        mouse.v = d
        mouse.vs += (d - mouse.vs) * 0.9
        // 根据设备类型调整最大速度限制
        const maxSpeed = deviceConfig.deviceType === 'mobile' ? 100 : 
                       deviceConfig.deviceType === 'tablet' ? 120 : 150;
        mouse.vs = Math.min(maxSpeed, mouse.vs);

        mouse.lx = mouse.x
        mouse.ly = mouse.y
        mouse.a = Math.atan2(dy, dx)

        // 更新时间
        this.currentTime = time;

        this.movePoints(time)
        this.drawLines()

        requestAnimationFrame(this.tick.bind(this))
    }
}

// 为椭圆创建自定义元素
class AEllipse extends HTMLElement {
    connectedCallback() {
        // 保存原始样式
        this.originalStyle = {
            filter: this.style.filter,
            opacity: this.style.opacity,
            transform: this.style.transform
        };
        
        this.mouse = {
            x: 0,
            y: 0,
            lx: 0,
            ly: 0,
            sx: 0,
            sy: 0,
            v: 0,
            vs: 0,
            a: 0,
        };
        
        this.bindEvents();
        this.updatePosition();
    }
    
    bindEvents() {
        // 桌面端和平板端使用鼠标事件
        if (deviceConfig.deviceType !== 'mobile') {
            window.addEventListener('mousemove', (e) => {
                this.updateMousePosition(e.pageX, e.pageY);
                this.applyMouseEffect();
            });
        }
        
        // 移动端使用触摸事件
        this.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.updateMousePosition(e.touches[0].clientX, e.touches[0].clientY);
            this.applyMouseEffect();
        });
    }
    
    updateMousePosition(x, y) {
        const rect = this.getBoundingClientRect();
        this.mouse.x = x - rect.left;
        this.mouse.y = y - rect.top + window.scrollY;
    }
    
    applyMouseEffect() {
        const rect = this.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const dx = this.mouse.x - centerX;
        const dy = this.mouse.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 计算鼠标移动速度
        const speed = Math.sqrt(
            Math.pow(this.mouse.x - this.mouse.lx, 2) + 
            Math.pow(this.mouse.y - this.mouse.ly, 2)
        );
        
        // 根据设备类型调整影响范围
        const ellipseConfig = deviceConfig.config.ellipse;
        const maxEffectDistance = ellipseConfig.effectDistance;
        
        if (distance < maxEffectDistance) {
            const effectStrength = 1 - (distance / maxEffectDistance);
            
            // 根据鼠标位置和速度计算变形
            const distortionX = (dx / distance) * effectStrength * 40 * ellipseConfig.distortionMultiplier * (1 + speed * 0.05);
            const distortionY = (dy / distance) * effectStrength * 40 * ellipseConfig.distortionMultiplier * (1 + speed * 0.05);
            
            // 应用变形效果
            this.style.transform = `translate(${distortionX}px, ${distortionY}px) scale(${1 + effectStrength * 0.03 * ellipseConfig.distortionMultiplier})`;
            
            // 根据鼠标位置改变模糊度
            const currentBlur = parseFloat(this.style.filter.match(/blur\(([\d.]+)vw\)/)?.[1] || 0);
            const originalBlur = parseFloat(this.originalStyle.filter?.match(/blur\(([\d.]+)vw\)/)?.[1] || currentBlur);
            this.style.filter = `blur(${originalBlur + effectStrength * ellipseConfig.blurMultiplier}vw)`;
            
            // 根据鼠标位置改变不透明度
            const originalOpacity = parseFloat(this.originalStyle.opacity || 0.9);
            this.style.opacity = Math.min(1, originalOpacity + effectStrength * 0.2);
        } else {
            // 鼠标远离时恢复原状
            this.style.transform = this.originalStyle.transform || 'translate(0, 0) scale(1)';
            this.style.filter = this.originalStyle.filter;
            this.style.opacity = this.originalStyle.opacity || 0.9;
        }
        
        this.mouse.lx = this.mouse.x;
        this.mouse.ly = this.mouse.y;
    }
    
    updatePosition() {
        requestAnimationFrame(() => {
            this.applyMouseEffect();
            this.updatePosition();
        });
    }
}

// 注册自定义元素
customElements.define('a-waves', AWaves);
customElements.define('a-ellipse', AEllipse);

// 更新元素位置的函数
function updateElementPositions() {
    const portfolioText = document.querySelector('.portfolio-text');
    const rectangle = document.querySelector('.rectangle');
    const subText = document.querySelector('.sub-text');
    const titleText = document.querySelector('.title-text');
    
    if (!portfolioText || !rectangle || !subText || !titleText) return;
    
    // 获取PORTFOLIO的实际高度
    const portfolioHeight = portfolioText.offsetHeight;
    const portfolioTop = parseFloat(getComputedStyle(portfolioText).top);
    
    // 更新矩形位置
    rectangle.style.top = `${portfolioTop + portfolioHeight + 35}px`;
    
    // 更新下方文字位置
    const rectangleHeight = parseFloat(getComputedStyle(rectangle).height);
    subText.style.top = `${portfolioTop + portfolioHeight + 35 + rectangleHeight + 15}px`;
    
    // 更新标题文字位置（PORTFOLIO上方10px）
    titleText.style.top = `${portfolioTop - 10 - 16}px`; // 16px是字体大小
}

// 添加键盘交互：按空格键改变椭圆颜色
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        const ellipses = document.querySelectorAll('a-ellipse');
        const colors = [
            'rgba(79, 232, 255, 0.9)',    // 青色半透明
            'rgba(255, 21, 21, 0.9)',     // 红色半透明
            'rgba(252, 255, 66, 0.9)',    // 黄色半透明
            'rgba(155, 81, 224, 0.9)',    // 紫色半透明
            'rgba(0, 255, 136, 0.9)',     // 绿色半透明
            'rgba(255, 170, 0, 0.9)'      // 橙色半透明
        ];
        
        ellipses.forEach(ellipse => {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            ellipse.style.backgroundColor = randomColor;
        });
        
        e.preventDefault();
    }
});

// 创建波纹效果函数
function createRipple(x, y, isTouch = false) {
    const rippleConfig = deviceConfig.config.click;
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = '0';
    ripple.style.height = '0';
    ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
    
    document.body.appendChild(ripple);
    
    // 动画
    requestAnimationFrame(() => {
        ripple.style.transition = `all ${rippleConfig.rippleDuration}ms ease-out`;
        ripple.style.width = `${rippleConfig.rippleSize}px`;
        ripple.style.height = `${rippleConfig.rippleSize}px`;
        ripple.style.opacity = '0';
    });
    
    // 移除元素
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, rippleConfig.rippleDuration + 300);
    
    // 如果是移动端，添加额外的视觉效果
    if (isTouch) {
        // 添加点击反馈振动（如果支持）
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }
}

// 点击时在点击位置创建一个波纹效果
document.addEventListener('click', function(e) {
    // 排除右上角卡片区域，因为它们有自己的点击事件
    const card = document.querySelector('.card');
    if (card && card.contains(e.target)) {
        return;
    }
    
    createRipple(e.clientX, e.clientY);
});

// 移动端触摸开始事件
document.addEventListener('touchstart', function(e) {
    if (e.touches.length > 0) {
        createRipple(e.touches[0].clientX, e.touches[0].clientY, true);
    }
});

// 初始化光标位置
document.addEventListener('mousemove', (e) => {
    if (deviceConfig.deviceType !== 'mobile') {
        const cursor = document.querySelector('.cursor');
        if (cursor) {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        }
    }
});

// 颜色切换功能
document.addEventListener('DOMContentLoaded', function() {
    const colorToggle = document.getElementById('colorToggle');
    
    if (colorToggle) {
        // 检查本地存储，恢复之前的状态
        const isGrayscale = localStorage.getItem('grayscaleMode') === 'true';
        if (isGrayscale) {
            document.body.classList.add('grayscale');
            colorToggle.checked = true;
        }
        
        // 添加切换事件
        colorToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('grayscale');
                localStorage.setItem('grayscaleMode', 'true');
            } else {
                document.body.classList.remove('grayscale');
                localStorage.setItem('grayscaleMode', 'false');
            }
        });
        
        // 添加点击事件（确保触摸设备也能正常工作）
        colorToggle.addEventListener('click', function(e) {
            // 阻止事件冒泡，避免触发其他点击事件
            e.stopPropagation();
        });
        
        // 确保标签也能触发点击
        const colorToggleLabel = document.querySelector('.color-toggle');
        if (colorToggleLabel) {
            colorToggleLabel.addEventListener('click', function(e) {
                // 阻止事件冒泡，避免触发其他点击事件
                e.stopPropagation();
            });
        }
    }
});

// 卡片交互效果 - 优化移动端体验
document.addEventListener('DOMContentLoaded', function() {
    const cardItems = document.querySelectorAll('.card p');
    const card = document.querySelector('.card');
    let isMobile = deviceConfig.deviceType === 'mobile';
    let activeTimeout = null;
    
    // 防止卡片点击时触发页面其他点击事件
    if (card) {
        card.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    cardItems.forEach(item => {
        // 桌面端和平板端的悬停效果
        if (!isMobile) {
            item.addEventListener('mouseenter', function() {
                // 清除之前的超时
                if (activeTimeout) {
                    clearTimeout(activeTimeout);
                    activeTimeout = null;
                }
                
                // 添加正常混合模式类
                this.classList.add('normal-blend');
                
                // 展开效果
                this.style.flex = '2';
                this.style.background = 'transparent';
                this.style.borderColor = 'rgba(219, 219, 219, 0.9)';
                const span = this.querySelector('span');
                span.style.transform = 'rotate(0)';
                span.style.writingMode = 'horizontal-tb';
            });
            
            item.addEventListener('mouseleave', function() {
                // 移除正常混合模式类
                this.classList.remove('normal-blend');
                
                // 恢复原始状态
                this.style.flex = '1';
                this.style.background = 'transparent';
                this.style.borderColor = '#dbdbdb';
                const span = this.querySelector('span');
                span.style.transform = 'rotate(-90deg)';
                span.style.writingMode = 'vertical-rl';
            });
        }
        
        // 移动端的触摸处理
        if (isMobile) {
            item.addEventListener('touchstart', function(e) {
                e.stopPropagation();
                
                // 添加正常混合模式类
                this.classList.add('normal-blend');
                
                // 移动端不需要展开效果，直接跳转
                this.style.background = 'rgba(219, 219, 219, 0.2)';
                this.style.borderColor = 'rgba(219, 219, 219, 0.9)';
                
                // 设置超时，在500ms后如果没有跳转，则恢复混合模式
                activeTimeout = setTimeout(() => {
                    this.classList.remove('normal-blend');
                    this.style.background = 'transparent';
                    this.style.borderColor = '#dbdbdb';
                }, 500);
            });
            
            item.addEventListener('touchend', function(e) {
                e.stopPropagation();
                
                // 清除超时
                if (activeTimeout) {
                    clearTimeout(activeTimeout);
                    activeTimeout = null;
                }
                
                // 立即跳转
                const link = this.getAttribute('data-link');
                if (link) {
                    // 移除混合模式类，然后跳转
                    this.classList.remove('normal-blend');
                    this.style.background = 'transparent';
                    this.style.borderColor = '#dbdbdb';
                    
                    // 添加一个小的延迟，让用户看到反馈
                    setTimeout(() => {
                        window.location.href = link;
                    }, 50);
                }
            });
            
            item.addEventListener('touchcancel', function() {
                // 触摸取消时恢复
                if (activeTimeout) {
                    clearTimeout(activeTimeout);
                    activeTimeout = null;
                }
                
                this.classList.remove('normal-blend');
                this.style.background = 'transparent';
                this.style.borderColor = '#dbdbdb';
            });
        }
        
        // 桌面端和平板端的点击处理
        if (!isMobile) {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                
                // 获取链接并跳转
                const link = this.getAttribute('data-link');
                if (link) {
                    // 移除混合模式类，然后跳转
                    this.classList.remove('normal-blend');
                    window.location.href = link;
                }
            });
        }
    });
    
    // 监听设备变化
    window.addEventListener('resize', function() {
        const newIsMobile = deviceConfig.deviceType === 'mobile';
        if (newIsMobile !== isMobile) {
            isMobile = newIsMobile;
            
            // 重新设置卡片样式
            if (isMobile) {
                cardItems.forEach(item => {
                    const span = item.querySelector('span');
                    span.style.writingMode = 'horizontal-tb';
                    span.style.transform = 'rotate(0)';
                    item.style.flex = '1';
                });
            } else {
                cardItems.forEach(item => {
                    const span = item.querySelector('span');
                    span.style.writingMode = 'vertical-rl';
                    span.style.transform = 'rotate(-90deg)';
                    item.style.flex = '1';
                });
            }
        }
    });
});

// 椭圆点击跳转和拖拽功能 - 修改为滑动结束后不跳转
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有透明点击椭圆
    const clickEllipses = document.querySelectorAll('.click-ellipse');
    const dragImage = document.getElementById('drag-image');
    
    // 状态变量
    let isDragging = false;
    let currentEllipse = null;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let dragDistance = 0;
    const DRAG_THRESHOLD = 10; // 滑动阈值，超过这个距离才认为是滑动
    
    // 为每个透明点击椭圆添加事件
    clickEllipses.forEach(ellipse => {
        // 鼠标按下事件
        ellipse.addEventListener('mousedown', function(e) {
            // 阻止事件冒泡，避免触发其他元素的事件
            e.stopPropagation();
            e.preventDefault();
            
            // 记录当前椭圆
            currentEllipse = this;
            isDragging = false;
            dragDistance = 0;
            
            // 记录起始位置
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            
            // 设置鼠标样式
            document.body.style.cursor = 'grabbing';
        });
        
        // 点击事件（用于跳转）
        ellipse.addEventListener('click', function(e) {
            // 只有在没有拖拽的情况下才执行跳转
            if (!isDragging && dragDistance < DRAG_THRESHOLD) {
                e.stopPropagation();
                e.preventDefault();
                
                const link = this.getAttribute('data-link');
                if (link) {
                    window.location.href = link;
                }
            }
        });
    });
    
    // 全局鼠标移动事件（处理拖拽）
    document.addEventListener('mousemove', function(e) {
        if (currentEllipse) {
            // 计算拖拽距离
            dragDistance = Math.sqrt(
                Math.pow(e.clientX - dragStartX, 2) + 
                Math.pow(e.clientY - dragStartY, 2)
            );
            
            // 如果拖拽距离超过阈值，则认为是滑动/拖拽
            if (dragDistance > DRAG_THRESHOLD) {
                if (!isDragging) {
                    isDragging = true;
                    
                    // 设置拖拽图片
                    const imgSrc = currentEllipse.getAttribute('data-img');
                    if (imgSrc) {
                        dragImage.src = imgSrc;
                        dragImage.classList.add('visible');
                        
                        // 计算图片位置（鼠标右下方）
                        dragOffsetX = 20;
                        dragOffsetY = 20;
                    }
                }
                
                // 更新拖拽图片位置
                if (dragImage.classList.contains('visible')) {
                    dragImage.style.left = (e.clientX + dragOffsetX) + 'px';
                    dragImage.style.top = (e.clientY + dragOffsetY) + 'px';
                }
            }
        }
    });
    
    // 全局鼠标松开事件
    document.addEventListener('mouseup', function(e) {
        // 重置拖拽状态
        if (currentEllipse) {
            if (isDragging) {
                // 隐藏拖拽图片
                dragImage.classList.remove('visible');
                dragImage.src = '';
            }
            
            // 重置状态
            isDragging = false;
            currentEllipse = null;
            dragDistance = 0;
            
            // 恢复鼠标样式
            document.body.style.cursor = '';
        }
    });
    
    // 阻止顶部矩形的点击事件冒泡
    const topRectangle = document.querySelector('.top-rectangle');
    if (topRectangle) {
        topRectangle.addEventListener('mousedown', function(e) {
            e.stopPropagation();
        });
        
        topRectangle.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // 确保在椭圆上点击不会触发其他元素的事件
    clickEllipses.forEach(ellipse => {
        ellipse.addEventListener('mousedown', function(e) {
            e.stopPropagation();
        });
        
        ellipse.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
});

// 窗口大小改变时重新检测设备并更新元素位置
window.addEventListener('resize', () => {
    const newDeviceType = deviceConfig.detectDevice();
    if (newDeviceType !== deviceConfig.deviceType) {
        deviceConfig.deviceType = newDeviceType;
        deviceConfig.config = deviceConfig.getConfig();
        
        // 重新初始化波浪线效果
        const waves = document.querySelector('a-waves');
        if (waves) {
            waves.setLines();
        }
        
        // 显示/隐藏光标
        const cursor = document.querySelector('.cursor');
        if (cursor) {
            cursor.style.display = newDeviceType === 'mobile' ? 'none' : 'block';
        }
    }
    
    // 更新元素位置
    updateElementPositions();
});

// 页面加载完成后更新元素位置
window.addEventListener('load', () => {
    updateElementPositions();
});

// 延迟一段时间后再次更新元素位置，确保字体加载完成
setTimeout(() => {
    updateElementPositions();
}, 500);