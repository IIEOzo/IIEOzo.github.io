// 主应用程序入口
document.addEventListener('DOMContentLoaded', function() {
    console.log('设计工作室网站已加载');
    
    // 初始化模块
    initNavigation();
    initPortfolio();
    initScrollAnimations();
    initTitleAnimations();
    initLazyLoading();
    initSectionResetAnimations(); // 新增：初始化板块重置动画
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

// 标题横线动画 - 修改为每次滚动到板块时重新触发动画
function initTitleAnimations() {
    const sectionTitles = document.querySelectorAll('.section-title');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 先重置动画
                entry.target.classList.remove('animated');
                entry.target.classList.add('reset-animation');
                
                // 强制重绘
                void entry.target.offsetWidth;
                
                // 移除重置类，添加动画类
                entry.target.classList.remove('reset-animation');
                entry.target.classList.add('animated');
            } else {
                // 离开视口时移除动画类
                entry.target.classList.remove('animated');
                entry.target.classList.add('reset-animation');
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

// 新增：初始化板块重置动画
function initSectionResetAnimations() {
    // 只在桌面端执行
    if (window.innerWidth < 769) return;
    
    // 监听滚动，当滚动到特定板块时重置作品集的动画
    const portfolioContainer = document.querySelector('.portfolio-container');
    const aboutContainer = document.querySelector('.about-container');
    const contactContainer = document.querySelector('.contact-info-container');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
    };
    
    // 创建观察器
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 当进入作品集板块时，重置作品项的动画
                if (entry.target.classList.contains('portfolio-container')) {
                    resetPortfolioAnimations();
                }
                // 当进入关于我板块时，重置关于我动画
                else if (entry.target.classList.contains('about-container')) {
                    resetAboutAnimations();
                }
                // 当进入联系板块时，重置联系动画
                else if (entry.target.classList.contains('contact-info-container')) {
                    resetContactAnimations();
                }
            }
        });
    }, observerOptions);
    
    // 开始观察
    if (portfolioContainer) observer.observe(portfolioContainer);
    if (aboutContainer) observer.observe(aboutContainer);
    if (contactContainer) observer.observe(contactContainer);
}

// 重置作品集动画
function resetPortfolioAnimations() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const moreLinks = document.querySelectorAll('.category-more-link a');
    
    // 重置所有作品项
    portfolioItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(15px) scale(0.98)';
        
        // 强制重绘
        void item.offsetWidth;
        
        // 应用动画
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
        }, 50);
    });
    
    // 重置查看更多链接
    moreLinks.forEach(link => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';
        
        // 强制重绘
        void link.offsetWidth;
        
        // 应用动画
        setTimeout(() => {
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 300);
    });
}

// 重置关于我动画
function resetAboutAnimations() {
    const aboutTexts = document.querySelectorAll('.about-text p');
    
    aboutTexts.forEach((text, index) => {
        text.style.opacity = '0';
        text.style.transform = 'translateY(20px)';
        
        // 强制重绘
        void text.offsetWidth;
        
        // 应用动画
        setTimeout(() => {
            text.style.opacity = '1';
            text.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// 重置联系动画
function resetContactAnimations() {
    const contactTexts = document.querySelectorAll('.contact-info p');
    const contactImage = document.querySelector('.contact-info img');
    
    contactTexts.forEach((text, index) => {
        text.style.opacity = '0';
        text.style.transform = 'translateY(20px)';
        
        // 强制重绘
        void text.offsetWidth;
        
        // 应用动画
        setTimeout(() => {
            text.style.opacity = '1';
            text.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    if (contactImage) {
        contactImage.style.opacity = '0';
        contactImage.style.transform = 'scale(0.9)';
        
        // 强制重绘
        void contactImage.offsetWidth;
        
        // 应用动画
        setTimeout(() => {
            contactImage.style.opacity = '1';
            contactImage.style.transform = 'scale(1)';
        }, 500);
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
    initSectionResetAnimations(); // 新增：初始化板块重置动画
    
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

// 标题横线动画 - 修改为每次滚动到板块时重新触发动画
function initTitleAnimations() {
    const sectionTitles = document.querySelectorAll('.section-title');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 先重置动画
                entry.target.classList.remove('animated');
                entry.target.classList.add('reset-animation');
                
                // 强制重绘
                void entry.target.offsetWidth;
                
                // 移除重置类，添加动画类
                entry.target.classList.remove('reset-animation');
                entry.target.classList.add('animated');
            } else {
                // 离开视口时移除动画类
                entry.target.classList.remove('animated');
                entry.target.classList.add('reset-animation');
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