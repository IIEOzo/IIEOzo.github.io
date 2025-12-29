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



// 下方代码针对设计工作室网站功能

// 主应用程序入口
document.addEventListener('DOMContentLoaded', function() {
    console.log('设计工作室网站已加载');
    
    // 初始化模块
    initNavigation();
    initPortfolio();
    initScrollAnimations();
    initTitleAnimations();
    initLazyLoading();
    initBackToTop(); // 初始化回到顶部功能
    initGroupAnimations(); // 初始化组动画
});

// 初始化组动画
function initGroupAnimations() {
    // 组1：关于我标题
    const group1 = document.querySelector('#about .section-title');
    if (group1) {
        group1.classList.add('group-1');
    }
    
    // 组2：关于我内容（包含文字、图片和玻璃质感矩形框）
    const group2 = document.querySelector('.about-container');
    if (group2) {
        group2.classList.add('group-2');
    }
    
    // 组3：部分作品标题
    const group3 = document.querySelector('#work .section-title');
    if (group3) {
        group3.classList.add('group-3');
    }
    
    // 组3.5：部分作品分类按钮组（品牌塑造，海报与宣传物料，品牌标志与字体，创意类）
    const group3_5 = document.querySelector('.portfolio-filters-container');
    if (group3_5) {
        group3_5.classList.add('group-3-5');
    }
    
    // 组4：部分作品内容（包含分类按钮、图片文字和玻璃质感矩形框）
    const group4 = document.querySelector('.portfolio-container');
    if (group4) {
        group4.classList.add('group-4');
    }
    
    // 组5：期待您的联系标题
    const group5 = document.querySelector('#contact .section-title');
    if (group5) {
        group5.classList.add('group-5');
    }
    
    // 组6：期待您的联系内容（包含文字图片和玻璃质感矩形框）
    const group6 = document.querySelector('.contact-info-container');
    if (group6) {
        group6.classList.add('group-6');
    }
    
    // 检查组是否在视口中，如果是则添加active类
    function checkGroupAnimations() {
        const groups = document.querySelectorAll('.group-1, .group-2, .group-3, .group-3-5, .group-4, .group-5, .group-6');
        
        groups.forEach(group => {
            const groupTop = group.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            // 当组进入视口时添加active类
            if (groupTop < windowHeight - 100) {
                group.classList.add('active');
            }
        });
    }
    
    // 监听滚动事件
    window.addEventListener('scroll', checkGroupAnimations);
    
    // 初始检查
    checkGroupAnimations();
}

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
    initBackToTop(); // 初始化回到顶部功能
    initGroupAnimations(); // 初始化组动画
    
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

// 回到顶部功能
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (!backToTopButton) return;
    
    // 显示/隐藏回到顶部按钮
    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    }
    
    // 滚动到顶部
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // 监听滚动事件
    window.addEventListener('scroll', toggleBackToTop);
    
    // 点击回到顶部
    backToTopButton.addEventListener('click', scrollToTop);
    
    // 初始化检查
    toggleBackToTop();
}