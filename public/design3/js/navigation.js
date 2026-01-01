/*
 * navigation.js - 导航功能
 * 优化版本：性能优化、代码模块化、减少重复计算
 */

class NavigationManager {
    constructor() {
        this.nav = document.querySelector('nav');
        this.navLinks = document.querySelector('.nav-links');
        this.backToTopButton = document.getElementById('back-to-top');
        this.lastScrollY = window.scrollY;
        this.scrollThreshold = 150;
        this.initialScrollTriggered = false;
        this.autoShowTimer = null;
        
        // 性能优化：减少DOM查询
        this.workSection = document.getElementById('work');
        
        this.init();
    }
    
    init() {
        console.log('🚀 导航系统已初始化');
        
        // 初始状态设置
        this.setInitialState();
        
        // 绑定事件
        this.bindEvents();
        
        // 初始检查
        this.checkBottom();
        this.checkWorkSection();
        this.checkBackToTopButton();
        this.initBackToTop();
        this.updateMobileNavLinks();
        
        // 页面加载完成后处理
        this.handlePageLoad();
    }
    
    setInitialState() {
        if (window.innerWidth > 768) {
            this.nav.classList.add('initial-hidden', 'transparent');
        } else {
            // 移动端直接显示
            this.nav.classList.remove('initial-hidden');
            this.initialScrollTriggered = true;
        }
    }
    
    bindEvents() {
        // 使用requestAnimationFrame优化滚动性能
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        
        // 点击页面任意位置触发导航栏显示
        document.addEventListener('click', this.handleDocumentClick.bind(this));
        
        // 窗口大小改变
        window.addEventListener('resize', this.throttle(this.handleResize.bind(this), 100));
    }
    
    // 检查是否到达页面底部
    checkBottom() {
        if (window.innerWidth <= 768) return;
        
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        
        const isAtBottom = (scrollTop + windowHeight) >= (documentHeight - 100);
        
        if (isAtBottom) {
            this.nav.classList.remove('nav-hidden');
        }
    }
    
    // 检查是否进入"部分作品"区域
    checkWorkSection() {
        if (window.innerWidth <= 768 || !this.workSection) return;
        
        const workSectionTop = this.workSection.offsetTop - 200;
        const workSectionBottom = this.workSection.offsetTop + this.workSection.offsetHeight;
        const currentScroll = window.scrollY;
        
        if (currentScroll >= workSectionTop && currentScroll < workSectionBottom) {
            this.nav.classList.add('opaque');
            this.nav.classList.remove('transparent');
        } else {
            this.nav.classList.add('transparent');
            this.nav.classList.remove('opaque');
        }
    }
    
    // 控制回到顶部按钮的显示/隐藏
    checkBackToTopButton() {
        if (!this.backToTopButton) return;
        
        if (window.scrollY > 300) {
            this.backToTopButton.classList.add('show');
        } else {
            this.backToTopButton.classList.remove('show');
        }
    }
    
    // 回到顶部功能
    initBackToTop() {
        if (!this.backToTopButton) return;
        
        this.backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // 平滑滚动到顶部
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // 可访问性：添加键盘支持
        this.backToTopButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.backToTopButton.click();
            }
        });
    }
    
    // 手机端：导航栏始终显示全部三个链接
    updateMobileNavLinks() {
        if (window.innerWidth > 768) return;
        
        const allLinks = `
            <a href="https://www.baidu.com" target="_blank" aria-label="查看作品">作品</a>
            <a href="https://www.baidu.com" target="_blank" aria-label="关于我们">关于</a>
            <a href="https://www.baidu.com" target="_blank" aria-label="联系我们">联系</a>
        `;
        
        if (this.navLinks.innerHTML.trim() !== allLinks.trim()) {
            this.navLinks.innerHTML = allLinks;
        }
    }
    
    // 滚动处理
    handleScroll() {
        const currentScrollY = window.scrollY;
        
        // 检查回到顶部按钮
        this.checkBackToTopButton();
        
        // 移动端逻辑
        if (window.innerWidth <= 768) {
            return;
        }
        
        // 桌面端逻辑
        const isScrollingDown = currentScrollY > this.lastScrollY;
        const isScrollingUp = currentScrollY < this.lastScrollY;
        
        // 使用requestAnimationFrame优化性能
        requestAnimationFrame(() => {
            this.checkBottom();
            this.checkWorkSection();
            
            // 首次滚动时移除初始隐藏类
            if (!this.initialScrollTriggered && currentScrollY > 5) {
                this.nav.classList.remove('initial-hidden');
                this.initialScrollTriggered = true;
                
                if (this.autoShowTimer) {
                    clearTimeout(this.autoShowTimer);
                    this.autoShowTimer = null;
                }
            }
            
            // 导航栏显示/隐藏逻辑
            if (!this.nav.classList.contains('at-bottom')) {
                if (isScrollingUp) {
                    this.nav.classList.remove('nav-hidden');
                } else if (isScrollingDown) {
                    this.nav.classList.add('nav-hidden');
                }
            }
        });
        
        this.lastScrollY = currentScrollY;
    }
    
    // 文档点击处理
    handleDocumentClick() {
        if (!this.initialScrollTriggered) {
            this.nav.classList.remove('initial-hidden');
            this.initialScrollTriggered = true;
            
            if (this.autoShowTimer) {
                clearTimeout(this.autoShowTimer);
                this.autoShowTimer = null;
            }
        }
    }
    
    // 页面加载处理
    handlePageLoad() {
        window.addEventListener('load', () => {
            if (window.innerWidth <= 768) {
                this.nav.classList.remove('initial-hidden');
                this.initialScrollTriggered = true;
                this.updateMobileNavLinks();
                
                // 移动端确保导航栏完全可见
                this.nav.style.opacity = '1';
                this.nav.style.visibility = 'visible';
                this.nav.style.transform = 'none';
            } else {
                // 桌面端10秒自动显示
                this.autoShowTimer = setTimeout(() => {
                    if (!this.initialScrollTriggered) {
                        this.nav.classList.remove('initial-hidden');
                        this.initialScrollTriggered = true;
                    }
                }, 10000);
            }
        });
    }
    
    // 窗口大小改变处理
    handleResize() {
        if (window.innerWidth <= 768) {
            this.updateMobileNavLinks();
            this.nav.style.transition = 'none';
            this.nav.style.transform = 'none';
        } else {
            // 桌面端恢复原始链接
            const originalLinks = `
                <a href="https://www.baidu.com" target="_blank" aria-label="查看作品">作品</a>
                <a href="https://www.baidu.com" target="_blank" aria-label="关于我们">关于</a>
                <a href="https://www.baidu.com" target="_blank" aria-label="联系我们">联系</a>
            `;
            this.navLinks.innerHTML = originalLinks;
            
            this.checkBottom();
            this.checkWorkSection();
        }
    }
    
    // 性能优化：节流函数
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // 销毁导航系统
    destroy() {
        window.removeEventListener('scroll', this.handleScroll);
        document.removeEventListener('click', this.handleDocumentClick);
        window.removeEventListener('resize', this.handleResize);
        
        if (this.backToTopButton) {
            this.backToTopButton.removeEventListener('click', this.initBackToTop);
        }
        
        if (this.autoShowTimer) {
            clearTimeout(this.autoShowTimer);
        }
        
        console.log('🚀 导航系统已销毁');
    }
}

// 初始化导航
function initNavigation() {
    try {
        return new NavigationManager();
    } catch (error) {
        console.error('🚀 导航系统初始化失败:', error);
        return null;
    }
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationManager;
}