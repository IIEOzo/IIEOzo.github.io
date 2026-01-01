/*
 * portfolio.js - 作品集功能
 * 优化版本：性能优化、代码模块化、更好的可维护性
 */

class PortfolioManager {
    constructor() {
        this.portfolioItems = document.querySelectorAll('.portfolio-item');
        this.interactiveSelectors = '.portfolio-item:not(.no-link)';
        this.init();
    }
    
    init() {
        console.log('🎨 作品集系统已初始化');
        
        this.setupPortfolioItems();
        this.addEventListeners();
        this.enhanceAccessibility();
    }
    
    // 设置作品项
    setupPortfolioItems() {
        this.portfolioItems.forEach(item => {
            const hasLink = item.querySelector('.portfolio-link') !== null;
            
            if (hasLink) {
                this.setupInteractiveItem(item);
            } else {
                this.setupNonInteractiveItem(item);
            }
        });
    }
    
    // 设置可交互作品项
    setupInteractiveItem(item) {
        // 确保有正确的类名
        item.classList.remove('no-link');
        
        // 添加ARIA属性
        const link = item.querySelector('.portfolio-link');
        if (link) {
            link.setAttribute('aria-label', '查看作品详情');
            link.setAttribute('role', 'link');
        }
    }
    
    // 设置非交互作品项
    setupNonInteractiveItem(item) {
        item.classList.add('no-link');
        item.style.cursor = 'default';
        item.style.pointerEvents = 'none';
        
        // 移除遮蔽框
        const overlay = item.querySelector('.portfolio-overlay');
        if (overlay) {
            overlay.style.display = 'none';
            overlay.setAttribute('aria-hidden', 'true');
        }
        
        // 移除交互相关属性
        item.removeAttribute('tabindex');
        item.setAttribute('aria-hidden', 'false');
    }
    
    // 添加事件监听器
    addEventListeners() {
        const interactiveItems = document.querySelectorAll(this.interactiveSelectors);
        
        interactiveItems.forEach(item => {
            // 鼠标事件
            item.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
            item.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
            item.addEventListener('mousedown', this.handleMouseDown.bind(this));
            
            // 键盘事件
            item.addEventListener('keydown', this.handleKeyDown.bind(this));
            
            // 触摸事件（移动端）
            item.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
            item.addEventListener('touchend', this.handleTouchEnd.bind(this));
        });
    }
    
    // 增强可访问性
    enhanceAccessibility() {
        this.portfolioItems.forEach((item, index) => {
            // 为键盘导航添加tabindex
            if (!item.classList.contains('no-link')) {
                item.setAttribute('tabindex', '0');
                item.setAttribute('role', 'button');
                item.setAttribute('aria-label', `作品项目 ${index + 1}`);
            }
        });
    }
    
    // 鼠标进入处理
    handleMouseEnter() {
        if (window.innerWidth >= 769) {
            document.body.classList.add('link-hover');
        }
    }
    
    // 鼠标离开处理
    handleMouseLeave() {
        if (window.innerWidth >= 769) {
            document.body.classList.remove('link-hover');
        }
    }
    
    // 鼠标按下处理
    handleMouseDown(e) {
        if (window.customCursor && window.innerWidth >= 769) {
            window.customCursor.showClickEffect(e);
        }
        
        // 添加点击反馈
        e.currentTarget.classList.add('clicked');
        setTimeout(() => {
            e.currentTarget.classList.remove('clicked');
        }, 200);
    }
    
    // 键盘事件处理
    handleKeyDown(e) {
        const item = e.currentTarget;
        
        // Enter键或空格键触发点击
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            
            // 模拟点击链接
            const link = item.querySelector('.portfolio-link');
            if (link) {
                link.click();
            }
        }
    }
    
    // 触摸开始处理
    handleTouchStart(e) {
        const item = e.currentTarget;
        item.classList.add('touch-active');
    }
    
    // 触摸结束处理
    handleTouchEnd(e) {
        const item = e.currentTarget;
        item.classList.remove('touch-active');
        
        // 防止点击延迟
        if (e.cancelable) {
            e.preventDefault();
        }
    }
    
    // 预加载作品图片
    preloadImages() {
        const images = [];
        
        this.portfolioItems.forEach(item => {
            const img = item.querySelector('img');
            if (img && img.src) {
                images.push(img.src);
            }
        });
        
        // 使用IntersectionObserver进行智能预加载
        if ('IntersectionObserver' in window) {
            const preloadObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        preloadObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '200px 0px',
                threshold: 0.01
            });
            
            this.portfolioItems.forEach(item => {
                const img = item.querySelector('img');
                if (img) preloadObserver.observe(img);
            });
        }
    }
    
    // 加载图片
    loadImage(img) {
        if (!img.complete) {
            img.classList.add('loading');
            
            img.onload = () => {
                img.classList.remove('loading');
                img.classList.add('loaded');
            };
            
            img.onerror = () => {
                img.classList.remove('loading');
                img.classList.add('error');
                console.error('图片加载失败:', img.src);
            };
        }
    }
    
    // 销毁作品集系统
    destroy() {
        const interactiveItems = document.querySelectorAll(this.interactiveSelectors);
        
        interactiveItems.forEach(item => {
            item.removeEventListener('mouseenter', this.handleMouseEnter);
            item.removeEventListener('mouseleave', this.handleMouseLeave);
            item.removeEventListener('mousedown', this.handleMouseDown);
            item.removeEventListener('keydown', this.handleKeyDown);
            item.removeEventListener('touchstart', this.handleTouchStart);
            item.removeEventListener('touchend', this.handleTouchEnd);
        });
        
        console.log('🎨 作品集系统已销毁');
    }
}

// 初始化作品集
function initPortfolio() {
    try {
        return new PortfolioManager();
    } catch (error) {
        console.error('🎨 作品集系统初始化失败:', error);
        return null;
    }
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioManager;
}