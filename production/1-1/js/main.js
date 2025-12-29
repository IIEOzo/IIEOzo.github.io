// 在现有文件顶部添加路径优化代码 针对 GitHub Pages 环境
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

// 主应用程序入口
document.addEventListener('DOMContentLoaded', function() {
    console.log('设计工作室网站已加载');
    
    // 初始化模块
    initNavigation();
    initPortfolio();
    initScrollAnimations();
    initTitleAnimations();
    initLazyLoading();
    initDetailToggle(); // 初始化详情切换功能
    initTextAnimations(); // 初始化文字渐入动画
});

// 滚动动画
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    
    function checkScroll() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll();
}

// 标题横线动画
function initTitleAnimations() {
    const sectionTitles = document.querySelectorAll('.section-title');
    
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
}

// 图片懒加载
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// 详情切换功能
function initDetailToggle() {
    const toggleButton = document.getElementById('detail-toggle');
    const detailContent = document.getElementById('detail-content');
    
    if (toggleButton && detailContent) {
        toggleButton.addEventListener('click', function() {
            if (detailContent.classList.contains('show')) {
                detailContent.classList.remove('show');
                toggleButton.textContent = '查看';
            } else {
                detailContent.classList.add('show');
                toggleButton.textContent = '隐藏';
            }
        });
    }
}

// 文字渐入动画
function initTextAnimations() {
    // 只在桌面端执行
    if (window.innerWidth <= 768) return;
    
    const sectionTitle = document.querySelector('.section-title');
    const infoText = document.querySelector('.info-text');
    
    // 为标题添加渐入动画
    if (sectionTitle) {
        setTimeout(() => {
            sectionTitle.classList.add('animated');
        }, 300);
    }
    
    // 为.info-text添加渐入动画
    if (infoText) {
        setTimeout(() => {
            infoText.classList.add('animated');
        }, 600);
    }
}