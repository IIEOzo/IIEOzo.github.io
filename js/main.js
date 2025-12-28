// 主应用程序入口
document.addEventListener('DOMContentLoaded', function() {
    console.log('设计工作室网站已加载');
    
    // 初始化模块
    initNavigation();
    initPortfolio();
    initScrollAnimations();
    initTitleAnimations();
    initLazyLoading();
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

// 主应用程序入口
document.addEventListener('DOMContentLoaded', function() {
    console.log('设计工作室网站已加载');
    
    // 初始化模块
    initNavigation();
    initPortfolio();
    initScrollAnimations();
    initTitleAnimations();
    initLazyLoading();
    
    // 初始化自定义鼠标系统（仅在桌面端）
    if (window.innerWidth >= 769) {
        // cursor.js 会自动初始化
        // 如果需要手动控制，可以在这里调用
    }
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