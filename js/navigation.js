// 导航功能
function initNavigation() {
    // 智能导航栏隐藏/显示逻辑
    let lastScrollY = window.scrollY;
    const scrollThreshold = 150;
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');
    const logoElement = document.querySelector('.logo');
    
    // 获取首页横幅元素
    const heroSection = document.querySelector('.hero');
    
    // 初始状态：页面加载时添加初始隐藏类和透明类（仅桌面端）
    if (window.innerWidth > 768) {
        nav.classList.add('initial-hidden', 'transparent');
    }
    
    // 检查是否在首页横幅区域
    function checkHeroVisibility() {
        // 移动端直接返回，不执行透明效果
        if (window.innerWidth <= 768) {
            // 移动端：始终保持白色背景，不透明
            nav.classList.remove('transparent');
            nav.style.backgroundColor = 'rgba(255, 255, 255, 1)';
            nav.style.backdropFilter = 'none';
            nav.style.borderBottom = '1px solid rgba(0, 0, 0, 0.08)';
            // 移动端：确保没有transform动画
            nav.style.transform = 'none';
            return;
        }
        
        if (!heroSection) return;
        
        const heroRect = heroSection.getBoundingClientRect();
        const heroBottom = heroRect.bottom;
        
        // 桌面端：判断是否在首页横幅区域内
        // 如果导航栏在首页横幅区域内，保持透明效果
        if (heroBottom > 0 && window.scrollY < heroRect.height) {
            nav.classList.add('transparent');
            // 在首页横幅区域内，移除矩形框背景，但保持文字可见
            nav.style.backgroundColor = 'rgba(255, 255, 255, 0)';
            nav.style.backdropFilter = 'none';
            nav.style.borderBottom = '1px solid transparent';
        } else {
            nav.classList.remove('transparent');
            // 离开首页横幅区域，显示矩形框背景
            nav.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            nav.style.backdropFilter = 'blur(10px)';
            nav.style.borderBottom = '1px solid rgba(0, 0, 0, 0.05)';
        }
    }
    
    // 检查是否到达页面底部
    function checkBottom() {
        // 只在桌面端执行
        if (window.innerWidth <= 768) return;
        
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        
        // 判断是否接近底部（距离底部100px以内）
        const isAtBottom = (scrollTop + windowHeight) >= (documentHeight - 100);
        
        if (isAtBottom) {
            // 到达底部时显示导航栏和箭头
            nav.classList.remove('nav-hidden');
            nav.classList.add('at-bottom');
        } else {
            // 离开底部时隐藏箭头
            nav.classList.remove('at-bottom');
        }
    }
    
    // 移动端：根据当前滚动位置更新导航链接
    function updateMobileNavLinks() {
        // 只在移动端执行
        if (window.innerWidth > 768) return;
        
        const aboutSection = document.querySelector('#about');
        const workSection = document.querySelector('#work');
        const contactSection = document.querySelector('#contact');
        
        const sections = [
            { element: heroSection, id: 'hero', top: 0, bottom: heroSection ? heroSection.offsetHeight : 0 },
            { element: aboutSection, id: 'about', top: aboutSection ? aboutSection.offsetTop : 0, bottom: aboutSection ? aboutSection.offsetTop + aboutSection.offsetHeight : 0 },
            { element: workSection, id: 'work', top: workSection ? workSection.offsetTop : 0, bottom: workSection ? workSection.offsetTop + workSection.offsetHeight : 0 },
            { element: contactSection, id: 'contact', top: contactSection ? contactSection.offsetTop : 0, bottom: contactSection ? contactSection.offsetTop + contactSection.offsetHeight : 0 }
        ];
        
        // 获取当前滚动位置
        const currentScroll = window.scrollY + 100; // 加上100px的偏移，让切换更平滑
        
        // 找到当前所在的板块
        let currentSection = 'hero'; // 默认为首页
        
        for (const section of sections) {
            if (section.element && currentScroll >= section.top && currentScroll < section.bottom) {
                currentSection = section.id;
                break;
            }
        }
        
        // 清空现有链接
        navLinks.innerHTML = '';
        
        // 根据当前板块添加相应的链接
        switch(currentSection) {
            case 'hero':
                // 首页横幅区域：只显示logo，不显示任何链接
                break;
            case 'about':
                // 关于我区域：显示"作品"和"联系"
                navLinks.innerHTML = `
                    <a href="#work">作品</a>
                    <a href="#contact">联系</a>
                `;
                break;
            case 'work':
                // 部分作品区域：显示"关于"和"联系"
                navLinks.innerHTML = `
                    <a href="#about">关于</a>
                    <a href="#contact">联系</a>
                `;
                break;
            case 'contact':
                // 期待您的联系区域：显示"关于"和"作品"
                navLinks.innerHTML = `
                    <a href="#about">关于</a>
                    <a href="#work">作品</a>
                `;
                break;
        }
    }
    
    // 初始检查
    checkHeroVisibility();
    checkBottom();
    
    let initialScrollTriggered = false;
    let autoShowTimer = null;
    
    // 桌面端和移动端分开处理滚动逻辑
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        // 移动端逻辑
        if (window.innerWidth <= 768) {
            // 移动端：更新导航链接
            updateMobileNavLinks();
            return;
        }
        
        // 桌面端逻辑
        const isScrollingDown = currentScrollY > lastScrollY;
        const isScrollingUp = currentScrollY < lastScrollY;
        const isAtTop = currentScrollY < 10;
        
        window.requestAnimationFrame(() => {
            // 检查是否在首页横幅区域
            checkHeroVisibility();
            
            // 检查是否到达底部
            checkBottom();
            
            // 首次滚动时移除初始隐藏类
            if (!initialScrollTriggered && currentScrollY > 5) {
                nav.classList.remove('initial-hidden');
                initialScrollTriggered = true;
                
                // 清除10秒自动显示定时器
                if (autoShowTimer) {
                    clearTimeout(autoShowTimer);
                    autoShowTimer = null;
                }
            }
            
            // 如果不是在底部，则执行正常的导航栏显示/隐藏逻辑
            if (!nav.classList.contains('at-bottom')) {
                // 如果向上滑动，一直显示导航栏
                if (isScrollingUp) {
                    nav.classList.remove('nav-hidden');
                }
                // 如果向下滑动，隐藏导航栏
                else if (isScrollingDown) {
                    nav.classList.add('nav-hidden');
                }
            }
            // 如果在底部，导航栏已经由checkBottom函数显示
        });
        
        lastScrollY = currentScrollY;
    });
    
    // 平滑滚动
    const navbar = document.querySelector('nav');
    
    // 使用事件委托处理导航链接点击
    document.addEventListener('click', function(e) {
        if (e.target.matches('.nav-links a')) {
            e.preventDefault();
            const href = e.target.getAttribute('href');
            
            if (href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const navbarHeight = navbar.offsetHeight;
                    const targetPosition = targetElement.offsetTop - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        }
    });
    
    // 点击logo跳转到首页横屏
    if (logoElement) {
        logoElement.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 滚动到首页顶部
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // 移动端：保持白色背景
            if (window.innerWidth <= 768) {
                nav.classList.remove('transparent');
                nav.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                nav.style.backdropFilter = 'none';
                nav.style.borderBottom = '1px solid rgba(0, 0, 0, 0.08)';
                // 确保没有transform动画
                nav.style.transform = 'none';
            } else {
                // 桌面端逻辑保持不变
                nav.classList.add('transparent');
                nav.style.backgroundColor = 'rgba(255, 255, 255, 0)';
                nav.style.backdropFilter = 'none';
                nav.style.borderBottom = '1px solid transparent';
            }
            
            // 如果是移动端，更新导航链接
            if (window.innerWidth <= 768) {
                updateMobileNavLinks();
            }
        });
    }
    
    // 页面加载完成后
    window.addEventListener('load', function() {
        // 移动端：不执行10秒自动显示，直接显示导航栏
        if (window.innerWidth <= 768) {
            nav.classList.remove('initial-hidden');
            initialScrollTriggered = true;
            updateMobileNavLinks();
            // 移动端：确保导航栏完全可见，没有动画
            nav.style.opacity = '1';
            nav.style.visibility = 'visible';
            nav.style.transform = 'none';
        } else {
            // 桌面端逻辑保持不变
            autoShowTimer = setTimeout(function() {
                if (!initialScrollTriggered) {
                    nav.classList.remove('initial-hidden');
                    initialScrollTriggered = true;
                }
            }, 10000);
        }
    });
    
    // 点击页面任意位置也可以触发导航栏显示（可选）
    document.addEventListener('click', function() {
        if (!initialScrollTriggered) {
            nav.classList.remove('initial-hidden');
            initialScrollTriggered = true;
            
            // 清除10秒自动显示定时器
            if (autoShowTimer) {
                clearTimeout(autoShowTimer);
                autoShowTimer = null;
            }
        }
    });
    
    // 窗口大小改变时
    window.addEventListener('resize', function() {
        // 如果是移动端，更新导航链接
        if (window.innerWidth <= 768) {
            updateMobileNavLinks();
            // 移动端隐藏箭头
            nav.classList.remove('at-bottom');
            // 移动端：确保导航栏没有动画
            nav.style.transition = 'none';
            nav.style.transform = 'none';
        } else {
            // 桌面端：恢复原始链接
            const originalLinks = `
                <a href="#about">关于</a>
                <a href="#work">作品</a>
                <a href="#contact">联系</a>
            `;
            navLinks.innerHTML = originalLinks;
            
            // 检查是否在底部
            checkBottom();
        }
    });
}