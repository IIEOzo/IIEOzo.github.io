// main.js - 优化版主JavaScript文件
// 使用ES6模块、现代API和性能优化

// 初始化应用程序
class DesignStudioApp {
    constructor() {
        this.init();
    }

    // 初始化所有模块
    async init() {
        try {
            // 显示加载状态
            this.showLoading();
            
            // 检测WebP支持
            await this.detectWebPSupport();
            
            // 预加载关键资源
            await this.preloadCriticalResources();
            
            // 初始化模块
            this.initNavigation();
            this.initPortfolio();
            this.initAnimations();
            this.initPerformance();
            this.initAccessibility();
            
            // 绑定全局事件
            this.bindGlobalEvents();
            
            // 隐藏加载状态
            setTimeout(() => {
                this.hideLoading();
                // 触发自定义事件
                window.dispatchEvent(new CustomEvent('app:ready'));
            }, 500);
            
            console.log('🎨 设计工作室应用已初始化');
            
        } catch (error) {
            console.error('应用初始化失败:', error);
            this.handleInitError(error);
        }
    }

    // 显示加载状态
    showLoading() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.classList.remove('hidden');
        }
    }

    // 隐藏加载状态
    hideLoading() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.classList.add('hidden');
        }
    }

    // 检测WebP支持
    async detectWebPSupport() {
        const canvas = document.createElement('canvas');
        if (canvas.getContext && canvas.getContext('2d')) {
            // 检测WebP支持
            const isSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
            document.documentElement.classList.toggle('webp', isSupported);
            document.documentElement.classList.toggle('no-webp', !isSupported);
        }
        return true;
    }

    // 预加载关键资源
    async preloadCriticalResources() {
        const criticalImages = [
            'https://images.pexels.com/photos/28839480/pexels-photo-28839480.jpeg',
            'https://mmbiz.qpic.cn/sz_mmbiz_png/rxqg3PD859eSjb5XtQiacPrsO58ibq690xgkzicctyGuNZ3ZibAiaZkhHDRibLGwt3JMIhYuXDeSgNzicuOO26hnwiceOg/0'
        ];

        const promises = criticalImages.map(src => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = src;
                img.onload = resolve;
                img.onerror = reject;
            });
        });

        await Promise.allSettled(promises);
    }

    // 初始化导航
    initNavigation() {
        const navigation = new Navigation();
        return navigation;
    }

    // 初始化作品集
    initPortfolio() {
        const portfolio = new Portfolio();
        return portfolio;
    }

    // 初始化动画
    initAnimations() {
        const animations = new Animations();
        return animations;
    }

    // 初始化性能监控
    initPerformance() {
        // 监控关键性能指标
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.log(`性能指标: ${entry.name} = ${entry.startTime}`);
                }
            });
            
            observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
        }
    }

    // 初始化无障碍功能
    initAccessibility() {
        // 添加键盘导航支持
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // 关闭所有模态框和菜单
                document.dispatchEvent(new CustomEvent('close-all'));
            }
            
            // Tab键导航焦点管理
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });

        // 添加焦点可见样式
        document.addEventListener('focusin', (e) => {
            e.target.classList.add('focus-visible');
        });

        document.addEventListener('focusout', (e) => {
            e.target.classList.remove('focus-visible');
        });
    }

    // Tab键导航处理
    handleTabNavigation(e) {
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const modal = document.querySelector('.modal.active');
        
        if (modal) {
            const focusableModalElements = modal.querySelectorAll(focusableElements);
            const firstElement = focusableModalElements[0];
            const lastElement = focusableModalElements[focusableModalElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    // 绑定全局事件
    bindGlobalEvents() {
        // 页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.title = '👋 记得回来看看作品更新';
            } else {
                document.title = '唐泉个人设计作品站 | 平面设计师';
            }
        });

        // 页面加载完成
        window.addEventListener('load', () => {
            // 延迟加载非关键资源
            this.lazyLoadNonCriticalResources();
            
            // 发送分析事件
            this.trackPageView();
        });

        // 错误处理
        window.addEventListener('error', (e) => {
            this.handleError(e.error || e);
        });

        // 未处理的Promise拒绝
        window.addEventListener('unhandledrejection', (e) => {
            this.handleError(e.reason);
        });
    }

    // 延迟加载非关键资源
    lazyLoadNonCriticalResources() {
        // 延迟加载社交媒体图标
        setTimeout(() => {
            const socialIcons = document.querySelectorAll('.social-links i');
            socialIcons.forEach(icon => {
                icon.style.opacity = '1';
            });
        }, 1000);
    }

    // 跟踪页面浏览
    trackPageView() {
        // 这里可以集成分析工具
        console.log('📊 页面浏览跟踪');
    }

    // 错误处理
    handleError(error) {
        console.error('应用错误:', error);
        // 这里可以集成错误报告服务
    }

    // 初始化错误处理
    handleInitError(error) {
        this.hideLoading();
        console.error('初始化失败:', error);
        // 显示错误消息给用户
        this.showErrorMessage('应用初始化失败，请刷新页面重试');
    }

    // 显示错误消息
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 9999;
        `;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// 导航类
class Navigation {
    constructor() {
        this.nav = document.getElementById('main-navigation');
        this.menuToggle = document.querySelector('.mobile-menu-toggle');
        this.navLinks = document.getElementById('nav-links');
        this.init();
    }

    init() {
        this.bindEvents();
        this.initIntersectionObserver();
        this.initScrollHandler();
        console.log('🚀 导航系统已初始化');
    }

    bindEvents() {
        // 移动端菜单切换
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggleMenu());
        }

        // 导航链接点击
        if (this.navLinks) {
            this.navLinks.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    this.handleNavClick(e);
                }
            });
        }

        // 关闭所有菜单
        document.addEventListener('close-all', () => {
            this.closeMenu();
        });

        // 点击外部关闭菜单
        document.addEventListener('click', (e) => {
            if (this.navLinks && this.navLinks.classList.contains('active') &&
                !this.nav.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        const isExpanded = this.menuToggle.getAttribute('aria-expanded') === 'true';
        this.menuToggle.setAttribute('aria-expanded', !isExpanded);
        this.navLinks.classList.toggle('active');
        
        // 锁定滚动
        document.body.style.overflow = this.navLinks.classList.contains('active') ? 'hidden' : '';
    }

    closeMenu() {
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleNavClick(e) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        
        if (href.startsWith('#')) {
            this.scrollToSection(href.substring(1));
        }
        
        // 移动端关闭菜单
        if (window.innerWidth <= 768) {
            this.closeMenu();
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const navHeight = this.nav.offsetHeight;
        const sectionTop = section.offsetTop - navHeight - 20;

        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }

    initIntersectionObserver() {
        // 观察导航栏透明状态
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.nav.classList.add('transparent');
                    } else {
                        this.nav.classList.remove('transparent');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '-100px 0px 0px 0px' }
        );

        observer.observe(heroSection);
    }

    initScrollHandler() {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateNav = () => {
            const currentScrollY = window.scrollY;
            const isScrollingDown = currentScrollY > lastScrollY;
            const isAtTop = currentScrollY < 100;

            if (isScrollingDown && !isAtTop) {
                this.nav.classList.add('nav-hidden');
            } else {
                this.nav.classList.remove('nav-hidden');
            }

            lastScrollY = currentScrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateNav);
                ticking = true;
            }
        });
    }
}

// 作品集类
class Portfolio {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.portfolioCategories = document.querySelectorAll('.portfolio-category');
        this.currentFilter = 'brand';
        this.init();
    }

    init() {
        this.bindEvents();
        this.activateCategory('brand');
        this.initImageLazyLoading();
        console.log('🖼️ 作品集系统已初始化');
    }

    bindEvents() {
        // 筛选按钮点击
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.switchCategory(filter);
            });
            
            // 键盘支持
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const filter = e.target.dataset.filter;
                    this.switchCategory(filter);
                }
            });
        });
    }

    switchCategory(filter) {
        if (filter === this.currentFilter) return;
        
        // 更新按钮状态
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        
        const activeButton = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
            activeButton.setAttribute('aria-selected', 'true');
        }
        
        // 切换类别
        this.deactivateCategory(this.currentFilter);
        this.activateCategory(filter);
        
        this.currentFilter = filter;
        
        // 发送分析事件
        this.trackFilterChange(filter);
    }

    activateCategory(category) {
        const targetCategory = document.getElementById(`${category}-category`);
        if (!targetCategory) return;

        targetCategory.hidden = false;
        
        // 触发动画
        setTimeout(() => {
            targetCategory.style.opacity = '1';
            targetCategory.style.transform = 'translateY(0)';
            
            // 动画子元素
            this.animateCategoryItems(targetCategory);
        }, 50);
    }

    deactivateCategory(category) {
        const targetCategory = document.getElementById(`${category}-category`);
        if (!targetCategory) return;

        targetCategory.style.opacity = '0';
        targetCategory.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            targetCategory.hidden = true;
        }, 300);
    }

    animateCategoryItems(category) {
        const items = category.querySelectorAll('.portfolio-item, .category-more-link');
        
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    initImageLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '100px 0px',
                threshold: 0.1
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    trackFilterChange(filter) {
        console.log(`🔍 作品筛选: ${filter}`);
        // 这里可以集成分析工具
    }
}

// 动画类
class Animations {
    constructor() {
        this.init();
    }

    init() {
        this.initScrollAnimations();
        this.initIntersectionObserver();
        this.initGroupAnimations();
        this.initTitleAnimations();
        console.log('✨ 动画系统已初始化');
    }

    initScrollAnimations() {
        const revealElements = document.querySelectorAll('.reveal');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '-50px 0px -50px 0px'
        });

        revealElements.forEach(element => {
            observer.observe(element);
        });
    }

    initIntersectionObserver() {
        // 观察所有需要动画的元素
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    animateElement(element) {
        const animationType = element.dataset.animate || 'fade-up';
        
        switch(animationType) {
            case 'fade-up':
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                break;
            case 'fade-in':
                element.style.opacity = '1';
                break;
            case 'scale':
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
                break;
        }
    }

    initGroupAnimations() {
        // 组动画系统
        const groups = document.querySelectorAll('[class*="group-"]');
        
        const groupObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    groupObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '-50px 0px -50px 0px'
        });

        groups.forEach(group => {
            groupObserver.observe(group);
        });
    }

    initTitleAnimations() {
        const sectionTitles = document.querySelectorAll('.section-title');
        
        const titleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    titleObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-100px 0px -100px 0px'
        });

        sectionTitles.forEach(title => {
            titleObserver.observe(title);
        });
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // 检查浏览器兼容性
    if (!('Promise' in window) || !('fetch' in window)) {
        document.body.innerHTML = `
            <div style="padding: 2rem; text-align: center;">
                <h2>浏览器版本过低</h2>
                <p>请升级到最新版本的浏览器以查看此网站</p>
            </div>
        `;
        return;
    }

    // 创建应用实例
    window.designStudioApp = new DesignStudioApp();
});

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DesignStudioApp,
        Navigation,
        Portfolio,
        Animations
    };
}