// 导航功能
function initNavigation() {
    // 智能导航栏隐藏/显示逻辑
    let lastScrollY = window.scrollY;
    const scrollThreshold = 150;
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');
    const logoElement = document.querySelector('.logo');
    const backToTopButton = document.getElementById('back-to-top');
    
    // 页面加载状态
    let pageLoaded = false;
    let userHasScrolled = false;
    let hasShownNav = false;
    let autoShowTimer = null;
    
    // 只在桌面端执行特殊逻辑
    if (window.innerWidth > 768) {
        // 初始状态：页面加载时导航栏完全透明（包括文字、图片、方框）
        nav.classList.add('initial-transparent');
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
        
        // 获取背景图片容器
        const backgroundContainer = document.querySelector('.desktop-background-container');
        if (backgroundContainer) {
            // 计算背景图片区域（包括下方10px）
            const backgroundTop = backgroundContainer.offsetTop;
            const backgroundBottom = backgroundTop + backgroundContainer.offsetHeight + 10;
            
            // 如果当前滚动位置在背景图片区域内（包括下方10px）
            if (currentScroll >= backgroundTop && currentScroll < backgroundBottom) {
                // 在背景图片区域：导航栏背景完全透明，文字保持显示
                nav.classList.add('transparent');
                nav.classList.remove('opaque');
                nav.style.backgroundColor = 'rgba(24, 24, 24, 0)';
                nav.style.backdropFilter = 'none';
                nav.style.borderBottomColor = 'transparent';
                nav.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            } 
            // 如果进入"部分作品"区域但不在背景图片区域
            else if (currentScroll >= workSectionTop && currentScroll < workSectionBottom) {
                // 不在背景图片区域但在作品区域：导航栏背景完全不透明
                nav.classList.add('opaque');
                nav.classList.remove('transparent');
                nav.style.backgroundColor = 'rgba(24, 24, 24, 1)';
                nav.style.backdropFilter = 'blur(10px)';
                nav.style.borderBottomColor = 'rgba(255, 255, 255, 0.1)';
                nav.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            } else {
                // 不在"部分作品"区域：导航栏背景透明
                nav.classList.add('transparent');
                nav.classList.remove('opaque');
                nav.style.backgroundColor = 'rgba(24, 24, 24, 0)';
                nav.style.backdropFilter = 'none';
                nav.style.borderBottomColor = 'transparent';
                nav.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
        } else {
            // 没有背景图片容器，使用原来的逻辑
            if (currentScroll >= workSectionTop && currentScroll < workSectionBottom) {
                nav.classList.add('opaque');
                nav.classList.remove('transparent');
                nav.style.backgroundColor = 'rgba(24, 24, 24, 1)';
                nav.style.backdropFilter = 'blur(10px)';
                nav.style.borderBottomColor = 'rgba(255, 255, 255, 0.1)';
                nav.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            } else {
                nav.classList.add('transparent');
                nav.classList.remove('opaque');
                nav.style.backgroundColor = 'rgba(24, 24, 24, 0)';
                nav.style.backdropFilter = 'none';
                nav.style.borderBottomColor = 'transparent';
                nav.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
        }
    }
    
    // 显示导航栏（移除初始透明状态）
    function showNavigation() {
        if (!hasShownNav) {
            nav.classList.remove('initial-transparent');
            hasShownNav = true;
            // 立即检查一次工作区域，确保状态正确
            checkWorkSection();
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
    
    // 手机端：导航栏始终显示全部三个链接
    function updateMobileNavLinks() {
        // 只在移动端执行
        if (window.innerWidth > 768) return;
        
        // 手机端始终显示全部三个链接
        const allLinks = `
            <a href="https://www.baidu.com" target="_blank">作品</a>
            <a href="https://www.baidu.com" target="_blank">关于</a>
            <a href="https://www.baidu.com" target="_blank">联系</a>
        `;
        
        // 检查当前链接是否与预设的一致，如果不一致则更新
        if (navLinks.innerHTML.trim() !== allLinks.trim()) {
            navLinks.innerHTML = allLinks;
        }
    }
    
    // 初始检查
    checkBottom();
    checkBackToTopButton();
    initBackToTop();
    updateMobileNavLinks(); // 初始时更新手机端导航链接
    
    // 页面加载完成后
    window.addEventListener('load', function() {
        pageLoaded = true;
        
        // 移动端：直接显示导航栏
        if (window.innerWidth <= 768) {
            nav.classList.remove('initial-transparent');
            updateMobileNavLinks();
            // 移动端：确保导航栏完全可见，没有动画
            nav.style.opacity = '1';
            nav.style.visibility = 'visible';
            nav.style.transform = 'none';
        } else {
            // 桌面端：设置10秒后自动显示导航栏
            autoShowTimer = setTimeout(function() {
                if (!userHasScrolled) {
                    showNavigation();
                }
            }, 10000);
        }
    });
    
    // 桌面端和移动端分开处理滚动逻辑
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        const isScrollingUp = currentScrollY < lastScrollY;
        const isScrollingDown = currentScrollY > lastScrollY;
        
        // 检查回到顶部按钮
        checkBackToTopButton();
        
        // 移动端逻辑 - 不再根据滚动位置更新导航链接，只执行基本逻辑
        if (window.innerWidth <= 768) {
            // 移动端：保持导航栏可见，不执行自动变换
            // 导航栏已经固定显示所有三个链接，无需更新
            checkBottom();
            return;
        }
        
        // 桌面端逻辑
        userHasScrolled = true;
        
        // 如果用户向上滑动
        if (isScrollingUp) {
            showNavigation();
            
            // 检查是否到达底部
            checkBottom();
            
            // 检查是否进入"部分作品"区域
            checkWorkSection();
            
            // 如果向上滑动，一直显示导航栏
            nav.classList.remove('nav-hidden');
        }
        // 如果用户向下滑动
        else if (isScrollingDown) {
            // 向下滑动则保持导航栏（包括文字，方框，图片）隐藏
            nav.classList.add('nav-hidden');
            
            // 清除10秒自动显示定时器
            if (autoShowTimer) {
                clearTimeout(autoShowTimer);
                autoShowTimer = null;
            }
        }
        // 如果没有滚动（位置不变）
        else {
            // 如果没有滚动，保持当前状态
            checkBottom();
            checkWorkSection();
        }
        
        lastScrollY = currentScrollY;
    });
    
    // 修改：移除logo的点击事件，因为它现在是一个外部链接
    // logoElement现在是一个链接，点击会自动跳转到百度，不需要额外的事件处理
    
    // 点击页面任意位置也可以触发导航栏显示（可选）
    document.addEventListener('click', function() {
        if (window.innerWidth > 768 && !hasShownNav) {
            showNavigation();
            
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
                <a href="https://www.baidu.com" target="_blank">作品</a>
                <a href="https://www.baidu.com" target="_blank">关于</a>
                <a href="https://www.baidu.com" target="_blank">联系</a>
            `;
            navLinks.innerHTML = originalLinks;
            
            // 检查是否在底部
            checkBottom();
            // 检查是否在"部分作品"区域
            checkWorkSection();
        }
    });
}