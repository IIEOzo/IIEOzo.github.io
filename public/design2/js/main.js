/*
 * main.js - 主应用程序入口
 * 优化版本：代码模块化、性能优化、错误处理、缓存策略
 */

// 配置常量
const CONFIG = {
    lazyLoadThreshold: 0.1,
    scrollRevealOffset: 100,
    titleAnimationThreshold: 0.5,
    performanceDebounceDelay: 100
};

// 性能监控工具
class PerformanceMonitor {
    static mark(name) {
        if (window.performance && performance.mark) {
            performance.mark(name);
        }
    }

    static measure(name, startMark, endMark) {
        if (window.performance && performance.measure) {
            performance.measure(name, startMark, endMark);
        }
    }
}

// GitHub Pages路径自动修正
(function() {
    // 只在GitHub Pages环境下修正路径
    if (!window.location.href.includes('github.io')) return;

    function fixGitHubPagesPaths() {
        const baseUrl = window.location.pathname.split('/').slice(0, -1).join('/');
        
        // 修正CSS文件路径
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            if (link.href.includes('/css/') && !link.href.startsWith('http')) {
                link.href = baseUrl + link.getAttribute('href');
            }
        });
        
        // 修正JS文件路径
        document.querySelectorAll('script[src]').forEach(script => {
            if (script.src.includes('/js/') && !script.src.startsWith('http')) {
                script.src = baseUrl + script.getAttribute('src');
            }
        });
        
        // 修正图片路径
        document.querySelectorAll('img[src^="./"], img[src^="/"], img[src^="public/"]').forEach(img => {
            const src = img.getAttribute('src');
            if (!src.startsWith('http') && !src.startsWith('data:')) {
                img.src = baseUrl + (src.startsWith('/') ? src : '/' + src);
            }
        });
        
        // 修正内部链接路径
        document.querySelectorAll('a[href^="./"], a[href^="/"], a[href^="public/"]').forEach(link => {
            const href = link.getAttribute('href');
            if (!href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
                link.href = baseUrl + (href.startsWith('/') ? href : '/' + href);
            }
        });
    }
    
    // 页面加载完成后执行路径修正
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixGitHubPagesPaths);
    } else {
        fixGitHubPagesPaths();
    }
})();

// 错误处理
window.addEventListener('error', (event) => {
    console.error('全局错误:', event.error);
    // 可以发送到错误监控服务
    if (window.errorReportingService) {
        window.errorReportingService.report(event.error);
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('未处理的Promise拒绝:', event.reason);
});

// 滚动动画管理器
class ScrollAnimationManager {
    constructor() {
        this.revealElements = document.querySelectorAll('.reveal');
        this.scrollHandler = this.debounce(this.checkScroll.bind(this), CONFIG.performanceDebounceDelay);
        this.init();
    }
    
    init() {
        PerformanceMonitor.mark('scrollAnimations_start');
        
        window.addEventListener('scroll', this.scrollHandler);
        this.checkScroll(); // 初始检查
        
        PerformanceMonitor.mark('scrollAnimations_end');
        PerformanceMonitor.measure('scrollAnimations_init', 'scrollAnimations_start', 'scrollAnimations_end');
    }
    
    checkScroll() {
        const windowHeight = window.innerHeight;
        
        this.revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - CONFIG.scrollRevealOffset) {
                element.classList.add('active');
            }
        });
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    destroy() {
        window.removeEventListener('scroll', this.scrollHandler);
    }
}

// 标题动画管理器
class TitleAnimationManager {
    constructor() {
        this.sectionTitles = document.querySelectorAll('.section-title');
        this.init();
    }
    
    init() {
        PerformanceMonitor.mark('titleAnimations_start');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: CONFIG.titleAnimationThreshold,
                rootMargin: '-50px 0px -50px 0px'
            });
            
            this.sectionTitles.forEach(title => {
                observer.observe(title);
            });
        } else {
            // 降级方案：直接添加类
            this.sectionTitles.forEach(title => {
                title.classList.add('animated');
            });
        }
        
        PerformanceMonitor.mark('titleAnimations_end');
        PerformanceMonitor.measure('titleAnimations_init', 'titleAnimations_start', 'titleAnimations_end');
    }
}

// 图片懒加载管理器
class LazyLoadManager {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }
    
    init() {
        PerformanceMonitor.mark('lazyLoad_start');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: CONFIG.lazyLoadThreshold
            });
            
            this.images.forEach(img => imageObserver.observe(img));
        } else {
            // 降级方案：立即加载所有图片
            this.images.forEach(img => this.loadImage(img));
        }
        
        PerformanceMonitor.mark('lazyLoad_end');
        PerformanceMonitor.measure('lazyLoad_init', 'lazyLoad_start', 'lazyLoad_end');
    }
    
    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;
        
        // 添加加载状态类
        img.classList.add('loading');
        
        // 创建新的Image对象预加载
        const tempImage = new Image();
        tempImage.onload = () => {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.remove('loading');
            img.classList.add('loaded');
        };
        
        tempImage.onerror = () => {
            console.error('图片加载失败:', src);
            img.classList.remove('loading');
            img.classList.add('error');
        };
        
        tempImage.src = src;
    }
}

// 应用程序主类
class DesignStudioApp {
    constructor() {
        this.modules = {};
        this.init();
    }
    
    init() {
        PerformanceMonitor.mark('app_init_start');
        
        console.log('🎨 设计工作室网站已加载');
        
        // 检查浏览器支持
        this.checkBrowserSupport();
        
        // 初始化模块
        this.initNavigation();
        this.initPortfolio();
        this.initScrollAnimations();
        this.initTitleAnimations();
        this.initLazyLoading();
        
        // 网络状态检测
        this.detectNetworkStatus();
        
        PerformanceMonitor.mark('app_init_end');
        PerformanceMonitor.measure('app_init', 'app_init_start', 'app_init_end');
    }
    
    checkBrowserSupport() {
        // 检查现代浏览器特性
        const supports = {
            intersectionObserver: 'IntersectionObserver' in window,
            cssGrid: 'CSS' in window && CSS.supports('display', 'grid'),
            flexbox: 'CSS' in window && CSS.supports('display', 'flex'),
            webp: this.checkWebpSupport()
        };
        
        if (!supports.intersectionObserver) {
            console.warn('浏览器不支持IntersectionObserver，某些动画效果可能受限');
        }
    }
    
    checkWebpSupport() {
        const elem = document.createElement('canvas');
        if (elem.getContext && elem.getContext('2d')) {
            return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        }
        return false;
    }
    
    initNavigation() {
        if (typeof initNavigation === 'function') {
            this.modules.navigation = initNavigation();
        }
    }
    
    initPortfolio() {
        if (typeof initPortfolio === 'function') {
            this.modules.portfolio = initPortfolio();
        }
    }
    
    initScrollAnimations() {
        this.modules.scrollAnimations = new ScrollAnimationManager();
    }
    
    initTitleAnimations() {
        this.modules.titleAnimations = new TitleAnimationManager();
    }
    
    initLazyLoading() {
        this.modules.lazyLoad = new LazyLoadManager();
    }
    
    detectNetworkStatus() {
        if (navigator.connection) {
            const connection = navigator.connection;
            
            if (connection.saveData === true || connection.effectiveType === 'slow-2g') {
                document.documentElement.classList.add('low-bandwidth');
                console.log('📶 低速网络模式已启用');
            }
        }
    }
    
    // 销毁应用（清理资源）
    destroy() {
        Object.values(this.modules).forEach(module => {
            if (module && typeof module.destroy === 'function') {
                module.destroy();
            }
        });
        
        console.log('🎨 应用程序已清理');
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // 设置页面加载状态
    document.documentElement.classList.add('loading');
    
    // 初始化应用
    window.designStudioApp = new DesignStudioApp();
    
    // 页面加载完成
    window.addEventListener('load', () => {
        document.documentElement.classList.remove('loading');
        document.documentElement.classList.add('loaded');
        
        // 性能指标
        if (window.performance) {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`⏱️ 页面加载时间: ${loadTime}ms`);
        }
    });
    
    // 页面可见性变化
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.documentElement.classList.add('page-hidden');
        } else {
            document.documentElement.classList.remove('page-hidden');
        }
    });
});

// 导出供测试使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DesignStudioApp,
        ScrollAnimationManager,
        TitleAnimationManager,
        LazyLoadManager,
        PerformanceMonitor
    };
}