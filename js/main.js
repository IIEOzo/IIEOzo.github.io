// main.js - 主应用程序入口（优化版）
// 使用现代JavaScript特性，模块化设计，性能优化

// 在现有文件顶部添加路径优化代码
(function() {
    // GitHub Pages路径自动修正
    function fixGitHubPagesPaths() {
        // 获取当前页面的基本URL
        const baseUrl = window.location.href.includes('github.io') 
            ? window.location.pathname.split('/').slice(0, -1).join('/') 
            : '';
        
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
        
        // 修正图片路径（相对路径）
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

// 主应用程序模块
const App = {
    // 初始化所有模块
    init() {
        console.log('设计工作室网站已加载 - 优化版');
        
        // 初始化各个模块
        this.initNavigation();
        this.initPortfolio();
        this.initScrollAnimations();
        this.initTitleAnimations();
        this.initLazyLoading();
        this.initBackToTop();
        this.initGroupAnimations();
        this.initAccessibility();
        
        // 性能监控
        this.monitorPerformance();
    },
    
    // 初始化组动画
    initGroupAnimations() {
        const groupSelectors = {
            'group-1': '#about .section-title',
            'group-2': '.about-container',
            'group-3': '#work .section-title',
            'group-3-5': '.portfolio-filters-container',
            'group-4': '.portfolio-container',
            'group-5': '#contact .section-title',
            'group-6': '.contact-info-container'
        };
        
        // 为每个元素添加对应的组类
        Object.entries(groupSelectors).forEach(([className, selector]) => {
            const element = document.querySelector(selector);
            if (element) {
                element.classList.add(className);
            }
        });
        
        // 检查组是否在视口中
        const checkGroupAnimations = () => {
            const groups = document.querySelectorAll('[class^="group-"]');
            
            groups.forEach(group => {
                const groupTop = group.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                // 当组进入视口时添加active类
                if (groupTop < windowHeight - 100) {
                    group.classList.add('active');
                }
            });
        };
        
        // 使用Intersection Observer优化性能
        if ('IntersectionObserver' in window) {
            const groupObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        groupObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px 0px'
            });
            
            document.querySelectorAll('[class^="group-"]').forEach(group => {
                groupObserver.observe(group);
            });
        } else {
            // 回退方案
            window.addEventListener('scroll', checkGroupAnimations);
            checkGroupAnimations();
        }
    },
    
    // 滚动动画
    initScrollAnimations() {
        const revealElements = document.querySelectorAll('.reveal');
        
        if (!revealElements.length) return;
        
        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px 0px'
            });
            
            revealElements.forEach(element => {
                revealObserver.observe(element);
            });
        } else {
            // 回退方案
            const checkScroll = () => {
                revealElements.forEach(element => {
                    const elementTop = element.getBoundingClientRect().top;
                    const windowHeight = window.innerHeight;
                    
                    if (elementTop < windowHeight - 100) {
                        element.classList.add('active');
                    }
                });
            };
            
            window.addEventListener('scroll', checkScroll);
            checkScroll();
        }
    },
    
    // 标题横线动画
    initTitleAnimations() {
        const sectionTitles = document.querySelectorAll('.section-title');
        
        if (!sectionTitles.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-50px 0px -50px 0px'
        });
        
        sectionTitles.forEach(title => {
            observer.observe(title);
        });
    },
    
    // 图片懒加载
    initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if (!images.length) return;
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // 添加加载效果
                        img.style.opacity = '0';
                        img.style.transition = 'opacity 0.3s ease';
                        
                        // 设置src
                        img.src = img.dataset.src;
                        
                        // 加载完成后显示
                        img.onload = () => {
                            img.style.opacity = '1';
                            img.removeAttribute('data-src');
                        };
                        
                        // 加载失败处理
                        img.onerror = () => {
                            console.error(`Failed to load image: ${img.dataset.src}`);
                            img.style.opacity = '1';
                        };
                        
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // 回退方案：直接加载所有图片
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    },
    
    // 回到顶部功能
    initBackToTop() {
        const backToTopButton = document.getElementById('backToTop');
        
        if (!backToTopButton) return;
        
        const toggleBackToTop = () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        };
        
        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };
        
        window.addEventListener('scroll', toggleBackToTop);
        backToTopButton.addEventListener('click', scrollToTop);
        toggleBackToTop();
    },
    
    // 无障碍支持
    initAccessibility() {
        // 为所有按钮添加键盘支持
        document.querySelectorAll('button, [role="button"]').forEach(button => {
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });
        
        // 跳过导航链接
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-to-content';
        skipLink.textContent = '跳转到主要内容';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: #000;
            color: white;
            padding: 8px;
            z-index: 10000;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.prepend(skipLink);
    },
    
    // 性能监控
    monitorPerformance() {
        if ('performance' in window && 'getEntriesByType' in performance) {
            // 监控资源加载时间
            window.addEventListener('load', () => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log(`页面完全加载时间: ${perfData.loadEventEnd - perfData.startTime}ms`);
                }
            });
        }
    },
    
    // 导航初始化（将在navigation.js中实现）
    initNavigation() {
        // 这个函数将在navigation.js中实现
        console.log('导航初始化');
    },
    
    // 作品集初始化（将在portfolio.js中实现）
    initPortfolio() {
        // 这个函数将在portfolio.js中实现
        console.log('作品集初始化');
    }
};

// DOM加载完成后初始化应用
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}