
// 导航功能
function initNavigation() {
    // 智能导航栏隐藏/显示逻辑
    let lastScrollY = window.scrollY;
    const scrollThreshold = 150;
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');
    const logoElement = document.querySelector('.logo');
    const backToTopButton = document.getElementById('back-to-top');
    
    // 初始状态：页面加载时添加初始隐藏类和透明类（仅桌面端）
    if (window.innerWidth > 768) {
        nav.classList.add('initial-hidden', 'transparent');
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
            // 到达底部时显示导航栏
            nav.classList.remove('nav-hidden');
        }
    }
    
    // 检查是否进入"部分作品"区域
    function checkWorkSection() {
        // 只在桌面端执行
        if (window.innerWidth <= 768) return;
        
        const workSection = document.getElementById('work');
        if (!workSection) return;
        
        const workSectionTop = workSection.offsetTop - 200; // 提前200px触发
        const workSectionBottom = workSection.offsetTop + workSection.offsetHeight;
        const currentScroll = window.scrollY;
        
        // 如果进入"部分作品"区域，添加opaque类，移除transparent类
        if (currentScroll >= workSectionTop && currentScroll < workSectionBottom) {
            nav.classList.add('opaque');
            nav.classList.remove('transparent');
        } else {
            // 不在"部分作品"区域，添加transparent类，移除opaque类
            nav.classList.add('transparent');
            nav.classList.remove('opaque');
        }
    }
    
    // 控制回到顶部按钮的显示/隐藏
    function checkBackToTopButton() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    }
    
    // 回到顶部功能
    function initBackToTop() {
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // 手机端：导航栏始终显示全部三个链接，不移除自动变换功能
    function updateMobileNavLinks() {
        // 只在移动端执行
        if (window.innerWidth > 768) return;
        
        // 手机端始终显示全部三个链接
        const allLinks = `
            <a href="#work">作品</a>
            <a href="#about">关于</a>
            <a href="#contact">联系</a>
        `;
        
        // 检查当前链接是否与预设的一致，如果不一致则更新
        if (navLinks.innerHTML.trim() !== allLinks.trim()) {
            navLinks.innerHTML = allLinks;
        }
    }
    
    // 初始检查
    checkBottom();
    checkWorkSection();
    checkBackToTopButton();
    initBackToTop();
    updateMobileNavLinks(); // 初始时更新手机端导航链接
    
    let initialScrollTriggered = false;
    let autoShowTimer = null;
    
    // 桌面端和移动端分开处理滚动逻辑
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        // 检查回到顶部按钮
        checkBackToTopButton();
        
        // 移动端逻辑 - 不再根据滚动位置更新导航链接，只执行基本逻辑
        if (window.innerWidth <= 768) {
            // 移动端：保持导航栏可见，不执行自动变换
            // 导航栏已经固定显示所有三个链接，无需更新
            return;
        }
        
        // 桌面端逻辑
        const isScrollingDown = currentScrollY > lastScrollY;
        const isScrollingUp = currentScrollY < lastScrollY;
        
        window.requestAnimationFrame(() => {
            // 检查是否到达底部
            checkBottom();
            
            // 检查是否进入"部分作品"区域
            checkWorkSection();
            
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
                    
                    // 如果是桌面端，检查是否需要更新导航栏透明度
                    if (window.innerWidth > 768) {
                        setTimeout(() => {
                            checkWorkSection();
                        }, 100);
                    }
                }
            }
        }
    });
    
    // 点击logo跳转到顶部
    if (logoElement) {
        logoElement.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 滚动到页面顶部
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
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
        // 如果是移动端，更新导航链接为固定三个
        if (window.innerWidth <= 768) {
            updateMobileNavLinks();
            // 移动端：确保导航栏没有动画
            nav.style.transition = 'none';
            nav.style.transform = 'none';
        } else {
            // 桌面端：恢复原始链接
            const originalLinks = `
                <a href="#work">作品</a>
                <a href="#about">关于</a>
                <a href="#contact">联系</a>
            `;
            navLinks.innerHTML = originalLinks;
            
            // 检查是否在底部
            checkBottom();
            // 检查是否在"部分作品"区域
            checkWorkSection();
        }
    });
}
