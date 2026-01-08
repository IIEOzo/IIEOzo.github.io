/*
 * cursor.js - 自定义鼠标交互系统（白色版）
 * 目的：白色圆形光标，带背景反向效果，可交互元素放大效果
 * 功能：1. 自定义白色圆形光标 2. 链接悬停放大效果 3. 点击波纹动画（移除拖尾）
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
        
        console.log('自定义鼠标系统已启动（白色圆形版）');
    }
    
    // 创建光标元素（移除拖尾元素）
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
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.isMoving = true;
            
            // 清除移动定时器
            if (this.moveTimer) clearTimeout(this.moveTimer);
            
            // 设置移动定时器
            this.moveTimer = setTimeout(() => {
                this.isMoving = false;
            }, 100);
        });
        
        // 鼠标进入可交互元素
        const interactiveElements = document.querySelectorAll(
            'a, button, .btn, .filter-btn, .portfolio-link, .portfolio-item, .social-links a, .mobile-menu-btn'
        );
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                document.body.classList.add('link-hover');
                
                // 为链接添加特殊类
                if (element.tagName === 'A' || element.classList.contains('btn')) {
                    element.classList.add('cursor-link');
                }
            });
            
            element.addEventListener('mouseleave', () => {
                document.body.classList.remove('link-hover');
                
                // 移除链接特殊类
                if (element.tagName === 'A' || element.classList.contains('btn')) {
                    element.classList.remove('cursor-link');
                }
            });
            
            // 点击效果
            element.addEventListener('mousedown', (e) => {
                this.showClickEffect(e);
            });
        });
        
        // 鼠标按下
        document.addEventListener('mousedown', () => {
            if (this.cursor) {
                this.cursor.style.transform = `translate(-50%, -50%) scale(0.9)`;
                this.cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; // 点击时变浅一些
            }
        });
        
        // 鼠标释放
        document.addEventListener('mouseup', () => {
            if (this.cursor) {
                this.cursor.style.transform = `translate(-50%, -50%) scale(1)`;
                this.cursor.style.backgroundColor = '#ffffff'; // 恢复白色
            }
        });
        
        // 页面滚动
        window.addEventListener('scroll', () => {
            if (!this.isScrolling) {
                document.body.classList.add('scrolling');
                this.isScrolling = true;
            }
            
            if (this.scrollTimer) clearTimeout(this.scrollTimer);
            
            this.scrollTimer = setTimeout(() => {
                document.body.classList.remove('scrolling');
                this.isScrolling = false;
            }, 150);
        });
        
        // 窗口大小改变
        window.addEventListener('resize', () => {
            // 如果切换到移动端，禁用自定义光标
            if (window.innerWidth < 769) {
                document.body.classList.add('cursor-disabled');
                if (this.cursor) this.cursor.style.display = 'none';
            } else {
                document.body.classList.remove('cursor-disabled');
                if (this.cursor) this.cursor.style.display = 'block';
            }
        });
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
    
    // 动画循环
    animate() {
        // 更新主光标位置
        if (this.cursor && (this.isMoving || document.body.classList.contains('link-hover'))) {
            this.cursor.style.left = this.mouseX + 'px';
            this.cursor.style.top = this.mouseY + 'px';
        }
        
        // 继续动画循环
        requestAnimationFrame(() => this.animate());
    }
    
    // 销毁光标系统
    destroy() {
        if (this.cursor) this.cursor.remove();
        if (this.clickEffect) this.clickEffect.remove();
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