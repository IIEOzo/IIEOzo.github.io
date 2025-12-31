/*
 * cursor.js - 自定义鼠标交互系统（优化版）
 * 仅在桌面端生效，使用现代JavaScript，更好的性能
 */

class CustomCursor {
    constructor() {
        // 仅桌面端初始化
        this.isDesktop = window.innerWidth >= 769;
        if (!this.isDesktop) return;
        
        this.cursor = null;
        this.clickEffect = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMoving = false;
        this.moveTimer = null;
        this.scrollTimer = null;
        this.isScrolling = false;
        
        // 动画帧ID
        this.animationFrameId = null;
        
        this.init();
    }
    
    // 初始化光标系统
    init() {
        this.createCursorElements();
        this.bindEvents();
        this.startAnimation();
        
        console.log('自定义鼠标系统已启动（优化版）');
    }
    
    // 创建光标元素
    createCursorElements() {
        // 主光标 - 白色圆形
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        document.body.appendChild(this.cursor);
        
        // 点击效果
        this.clickEffect = document.createElement('div');
        this.clickEffect.className = 'cursor-click';
        document.body.appendChild(this.clickEffect);
    }
    
    // 绑定事件
    bindEvents() {
        // 鼠标移动
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        
        // 鼠标进入可交互元素
        this.bindInteractiveElements();
        
        // 鼠标按下/释放
        document.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
        
        // 页面滚动
        window.addEventListener('scroll', this.onScroll.bind(this));
        
        // 窗口大小改变
        window.addEventListener('resize', this.onResize.bind(this));
        
        // 页面可见性变化
        document.addEventListener('visibilitychange', this.onVisibilityChange.bind(this));
    }
    
    // 鼠标移动事件
    onMouseMove(e) {
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
        const interactiveElements = document.querySelectorAll(
            'a, button, .btn, .filter-btn, .portfolio-link, .portfolio-item, .social-links a, .mobile-menu-btn'
        );
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', this.onElementEnter.bind(this));
            element.addEventListener('mouseleave', this.onElementLeave.bind(this));
            element.addEventListener('mousedown', this.onElementClick.bind(this));
        });
    }
    
    // 元素进入事件
    onElementEnter(e) {
        document.body.classList.add('link-hover');
        
        // 为链接添加特殊类
        const element = e.currentTarget;
        if (element.tagName === 'A' || element.classList.contains('btn')) {
            element.classList.add('cursor-link');
        }
    }
    
    // 元素离开事件
    onElementLeave(e) {
        document.body.classList.remove('link-hover');
        
        // 移除链接特殊类
        const element = e.currentTarget;
        if (element.tagName === 'A' || element.classList.contains('btn')) {
            element.classList.remove('cursor-link');
        }
    }
    
    // 元素点击事件
    onElementClick(e) {
        this.showClickEffect(e);
    }
    
    // 鼠标按下事件
    onMouseDown() {
        if (this.cursor) {
            this.cursor.style.transform = `translate(-50%, -50%) scale(0.9)`;
            this.cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        }
    }
    
    // 鼠标释放事件
    onMouseUp() {
        if (this.cursor) {
            this.cursor.style.transform = `translate(-50%, -50%) scale(1)`;
            this.cursor.style.backgroundColor = '#ffffff';
        }
    }
    
    // 滚动事件
    onScroll() {
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
    
    // 窗口大小改变事件
    onResize() {
        const isNowDesktop = window.innerWidth >= 769;
        
        // 如果切换到移动端，禁用自定义光标
        if (!isNowDesktop && this.isDesktop) {
            document.body.classList.add('cursor-disabled');
            if (this.cursor) this.cursor.style.display = 'none';
            this.stopAnimation();
        } 
        // 如果切换到桌面端，启用自定义光标
        else if (isNowDesktop && !this.isDesktop) {
            document.body.classList.remove('cursor-disabled');
            if (this.cursor) this.cursor.style.display = 'block';
            this.startAnimation();
        }
        
        this.isDesktop = isNowDesktop;
    }
    
    // 页面可见性变化事件
    onVisibilityChange() {
        if (document.hidden) {
            this.stopAnimation();
        } else {
            this.startAnimation();
        }
    }
    
    // 显示点击效果
    showClickEffect(event) {
        this.clickEffect.style.left = event.clientX + 'px';
        this.clickEffect.style.top = event.clientY + 'px';
        this.clickEffect.classList.add('active');
        
        setTimeout(() => {
            this.clickEffect.classList.remove('active');
        }, 200);
    }
    
    // 开始动画循环
    startAnimation() {
        if (this.animationFrameId) return;
        
        const animate = () => {
            // 更新主光标位置
            if (this.cursor && (this.isMoving || document.body.classList.contains('link-hover'))) {
                this.cursor.style.left = this.mouseX + 'px';
                this.cursor.style.top = this.mouseY + 'px';
            }
            
            this.animationFrameId = requestAnimationFrame(animate);
        };
        
        this.animationFrameId = requestAnimationFrame(animate);
    }
    
    // 停止动画循环
    stopAnimation() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
    
    // 销毁光标系统
    destroy() {
        this.stopAnimation();
        
        if (this.cursor) this.cursor.remove();
        if (this.clickEffect) this.clickEffect.remove();
        
        // 清除所有定时器
        if (this.moveTimer) clearTimeout(this.moveTimer);
        if (this.scrollTimer) clearTimeout(this.scrollTimer);
        
        console.log('自定义鼠标系统已销毁');
    }
}

// 初始化光标系统
document.addEventListener('DOMContentLoaded', () => {
    // 仅在桌面端初始化
    if (window.innerWidth >= 769) {
        window.customCursor = new CustomCursor();
    }
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CustomCursor;
}