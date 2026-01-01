/*
 * cursor.js - 自定义鼠标交互系统（白色版）
 * 优化版本：性能优化、代码模块化、减少重复代码
 */

class CustomCursor {
    constructor() {
        this.cursor = null;
        this.clickEffect = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMoving = false;
        this.moveTimer = null;
        this.scrollTimer = null;
        this.isScrolling = false;
        this.interactiveSelectors = 'a, button, .btn, .filter-btn, .portfolio-link, .portfolio-item, .social-links a, .mobile-menu-btn';
        
        // 仅在桌面端初始化
        if (window.innerWidth >= 769) {
            this.init();
        }
    }
    
    // 初始化光标系统
    init() {
        this.createCursorElements();
        this.bindEvents();
        this.animate();
        
        console.log('🎯 自定义鼠标系统已启动（白色圆形版）');
    }
    
    // 创建光标元素
    createCursorElements() {
        // 主光标 - 白色圆形
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.setAttribute('aria-hidden', 'true'); // 可访问性优化
        document.body.appendChild(this.cursor);
        
        // 点击效果
        this.clickEffect = document.createElement('div');
        this.clickEffect.className = 'cursor-click';
        this.clickEffect.setAttribute('aria-hidden', 'true'); // 可访问性优化
        document.body.appendChild(this.clickEffect);
    }
    
    // 绑定事件
    bindEvents() {
        // 鼠标移动
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        
        // 鼠标进入可交互元素
        this.bindInteractiveElements();
        
        // 鼠标按下和释放
        document.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        // 页面滚动
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // 窗口大小改变
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    // 鼠标移动处理
    handleMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.isMoving = true;
        
        // 清除移动定时器
        if (this.moveTimer) clearTimeout(this.moveTimer);
        
        // 设置移动定时器
        this.moveTimer = setTimeout(() => {
            this.isMoving = false;
        }, 100);
    }
    
    // 绑定交互元素事件
    bindInteractiveElements() {
        const interactiveElements = document.querySelectorAll(this.interactiveSelectors);
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                document.body.classList.add('link-hover');
                
                if (element.tagName === 'A' || element.classList.contains('btn')) {
                    element.classList.add('cursor-link');
                }
            });
            
            element.addEventListener('mouseleave', () => {
                document.body.classList.remove('link-hover');
                
                if (element.tagName === 'A' || element.classList.contains('btn')) {
                    element.classList.remove('cursor-link');
                }
            });
            
            // 点击效果
            element.addEventListener('mousedown', (e) => {
                this.showClickEffect(e);
            });
        });
    }
    
    // 鼠标按下处理
    handleMouseDown() {
        if (this.cursor) {
            this.cursor.style.transform = `translate(-50%, -50%) scale(0.9)`;
            this.cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        }
    }
    
    // 鼠标释放处理
    handleMouseUp() {
        if (this.cursor) {
            this.cursor.style.transform = `translate(-50%, -50%) scale(1)`;
            this.cursor.style.backgroundColor = '#ffffff';
        }
    }
    
    // 滚动处理
    handleScroll() {
        if (!this.isScrolling) {
            document.body.classList.add('scrolling');
            this.isScrolling = true;
        }
        
        if (this.scrollTimer) clearTimeout(this.scrollTimer);
        
        this.scrollTimer = setTimeout(() => {
            document.body.classList.remove('scrolling');
            this.isScrolling = false;
        }, 150);
    }
    
    // 窗口大小改变处理
    handleResize() {
        if (window.innerWidth < 769) {
            document.body.classList.add('cursor-disabled');
            if (this.cursor) this.cursor.style.display = 'none';
        } else {
            document.body.classList.remove('cursor-disabled');
            if (this.cursor) this.cursor.style.display = 'block';
        }
    }
    
    // 显示点击效果
    showClickEffect(event) {
        if (!this.clickEffect) return;
        
        this.clickEffect.style.left = event.clientX + 'px';
        this.clickEffect.style.top = event.clientY + 'px';
        this.clickEffect.classList.add('active');
        
        setTimeout(() => {
            this.clickEffect.classList.remove('active');
        }, 200);
    }
    
    // 动画循环
    animate() {
        // 使用requestAnimationFrame进行性能优化
        const updateCursor = () => {
            if (this.cursor && (this.isMoving || document.body.classList.contains('link-hover'))) {
                this.cursor.style.left = this.mouseX + 'px';
                this.cursor.style.top = this.mouseY + 'px';
            }
            requestAnimationFrame(updateCursor);
        };
        
        updateCursor();
    }
    
    // 销毁光标系统
    destroy() {
        if (this.cursor) this.cursor.remove();
        if (this.clickEffect) this.clickEffect.remove();
        
        // 清理事件监听器
        document.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        
        console.log('🎯 自定义鼠标系统已销毁');
    }
}

// 初始化光标系统
document.addEventListener('DOMContentLoaded', () => {
    // 仅在桌面端初始化
    if (window.innerWidth >= 769) {
        try {
            window.customCursor = new CustomCursor();
        } catch (error) {
            console.error('🎯 自定义鼠标系统初始化失败:', error);
        }
    }
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CustomCursor;
}