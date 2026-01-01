
/**
 * navigation.js - 导航功能优化版
 * 优化内容：代码模块化、性能优化、简化逻辑、更好的事件处理
 */

class NavigationController {
  constructor() {
    this.nav = document.querySelector('nav');
    this.navLinks = document.querySelector('.nav-links');
    this.logoElement = document.querySelector('.logo');
    this.heroSection = document.querySelector('.hero');
    
    // 获取页面主要区域
    this.aboutSection = document.getElementById('about');
    this.workSection = document.getElementById('work');
    this.contactSection = document.getElementById('contact');
    
    this.lastScrollY = window.scrollY;
    this.scrollThreshold = 150;
    this.initialScrollTriggered = false;
    this.autoShowTimer = null;
    this.currentSection = 'hero'; // 当前所在区域
    
    this.init();
  }
  
  init() {
    console.log('🚀 导航系统已初始化（智能区域检测版）');
    
    this.setupInitialState();
    this.bindEvents();
    this.setupAutoShow();
    this.updateNavLinks(); // 初始更新
  }
  
  setupInitialState() {
    if (this.isDesktop()) {
      this.nav.classList.add('initial-hidden', 'transparent');
    } else {
      this.nav.classList.remove('initial-hidden');
    }
  }
  
  bindEvents() {
    window.addEventListener('scroll', () => this.handleScroll());
    window.addEventListener('resize', () => this.handleResize());
    document.addEventListener('click', (e) => this.handleDocumentClick(e));
    
    if (this.logoElement) {
      this.logoElement.addEventListener('click', (e) => this.handleLogoClick(e));
    }
  }
  
  handleScroll() {
    const currentScrollY = window.scrollY;
    
    // 检测当前所在区域
    this.detectCurrentSection(currentScrollY);
    
    // 更新移动端导航链接
    if (this.isMobile()) {
      this.updateMobileNavLinks();
    }
    
    // 移动端逻辑
    if (this.isMobile()) {
      return;
    }
    
    // 桌面端逻辑
    const isScrollingDown = currentScrollY > this.lastScrollY;
    const isScrollingUp = currentScrollY < this.lastScrollY;
    
    window.requestAnimationFrame(() => {
      this.checkHeroVisibility();
      this.checkBottom();
      
      // 首次滚动时移除初始隐藏类
      if (!this.initialScrollTriggered && currentScrollY > 5) {
        this.nav.classList.remove('initial-hidden');
        this.initialScrollTriggered = true;
        this.clearAutoShowTimer();
      }
      
      // 正常的导航栏显示/隐藏逻辑
      if (!this.nav.classList.contains('at-bottom')) {
        if (isScrollingUp) {
          this.nav.classList.remove('nav-hidden');
        } else if (isScrollingDown) {
          this.nav.classList.add('nav-hidden');
        }
      }
    });
    
    this.lastScrollY = currentScrollY;
  }
  
  // 检测当前所在区域
  detectCurrentSection(currentScrollY) {
    const windowHeight = window.innerHeight;
    const windowCenter = currentScrollY + (windowHeight / 2);
    
    // 获取各区域位置
    const sections = [
      { id: 'hero', element: this.heroSection },
      { id: 'about', element: this.aboutSection },
      { id: 'work', element: this.workSection },
      { id: 'contact', element: this.contactSection }
    ];
    
    let newSection = 'hero';
    
    // 按顺序检查哪个区域在视窗中心
    for (const section of sections) {
      if (section.element) {
        const rect = section.element.getBoundingClientRect();
        const elementTop = currentScrollY + rect.top;
        const elementBottom = elementTop + rect.height;
        
        if (windowCenter >= elementTop && windowCenter <= elementBottom) {
          newSection = section.id;
          break;
        }
      }
    }
    
    // 如果当前不在任何特定区域，检查是否在区域之间
    if (newSection === 'hero') {
      // 检查是否在hero之后但在about之前
      if (this.aboutSection) {
        const aboutRect = this.aboutSection.getBoundingClientRect();
        const aboutTop = currentScrollY + aboutRect.top;
        
        if (currentScrollY < aboutTop - 100) {
          newSection = 'hero';
        } else {
          // 如果过了hero区域但不在任何主要区域，隐藏导航链接
          newSection = 'none';
        }
      }
    }
    
    // 如果区域发生变化，更新导航链接
    if (newSection !== this.currentSection) {
      this.currentSection = newSection;
      this.updateNavLinks();
    }
  }
  
  // 更新导航链接显示
  updateNavLinks() {
    if (this.isDesktop()) {
      // 桌面端显示所有链接
      this.navLinks.innerHTML = `
        <a href="#about">关于</a>
        <a href="#work">作品</a>
        <a href="#contact">联系</a>
      `;
    } else {
      // 移动端根据当前区域显示
      let linksHTML = '';
      
      switch (this.currentSection) {
        case 'about':
          // 在关于区域：显示作品和联系
          linksHTML = `
            <a href="#work">作品</a>
            <a href="#contact">联系</a>
          `;
          break;
          
        case 'work':
          // 在作品区域：显示关于和联系
          linksHTML = `
            <a href="#about">关于</a>
            <a href="#contact">联系</a>
          `;
          break;
          
        case 'contact':
          // 在联系区域：显示关于和作品
          linksHTML = `
            <a href="#about">关于</a>
            <a href="#work">作品</a>
          `;
          break;
          
        case 'hero':
          // 在顶部图片区域：隐藏所有链接
          linksHTML = '';
          break;
          
        case 'none':
        default:
          // 在其他区域：隐藏所有链接
          linksHTML = '';
          break;
      }
      
      this.navLinks.innerHTML = linksHTML;
    }
  }
  
  checkHeroVisibility() {
    if (this.isMobile()) return;
    
    if (this.heroSection) {
      const heroRect = this.heroSection.getBoundingClientRect();
      const heroBottom = heroRect.bottom;
      
      if (heroBottom > 0 && window.scrollY < heroRect.height) {
        this.setNavTransparent();
      } else {
        this.setNavSolid();
      }
    }
  }
  
  setNavTransparent() {
    this.nav.classList.add('transparent');
    this.nav.style.backgroundColor = 'rgba(24, 24, 24, 0)';
    this.nav.style.backdropFilter = 'none';
    this.nav.style.borderBottom = '1px solid transparent';
  }
  
  setNavSolid() {
    this.nav.classList.remove('transparent');
    this.nav.style.backgroundColor = 'rgba(24, 24, 24, 0.98)';
    this.nav.style.backdropFilter = 'blur(10px)';
    this.nav.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
  }
  
  checkBottom() {
    if (this.isMobile()) return;
    
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    
    const isAtBottom = (scrollTop + windowHeight) >= (documentHeight - 100);
    
    if (isAtBottom) {
      this.nav.classList.remove('nav-hidden');
      this.nav.classList.add('at-bottom');
    } else {
      this.nav.classList.remove('at-bottom');
    }
  }
  
  // 移动端导航链接更新（保持原有方法兼容性）
  updateMobileNavLinks() {
    if (!this.isMobile()) return;
    
    // 已经由updateNavLinks处理，这里只需要确保调用
    this.updateNavLinks();
  }
  
  handleDocumentClick(e) {
    if (e.target.matches('.nav-links a')) {
      e.preventDefault();
      this.handleNavLinkClick(e.target);
    }
  }
  
  handleNavLinkClick(link) {
    const href = link.getAttribute('href');
    
    if (href.startsWith('#')) {
      const targetId = href.substring(1);
      this.scrollToSection(targetId);
    }
  }
  
  scrollToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (!targetElement) return;
    
    const navbarHeight = this.nav.offsetHeight;
    const targetPosition = targetElement.offsetTop - navbarHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
  
  handleLogoClick(e) {
    e.preventDefault();
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // 滚动到顶部后更新当前区域
    this.currentSection = 'hero';
    if (this.isMobile()) {
      this.updateNavLinks();
    }
  }
  
  handleResize() {
    if (this.isMobile()) {
      this.updateNavLinks();
    } else {
      // 桌面端恢复默认链接
      this.restoreDesktopLinks();
    }
  }
  
  restoreDesktopLinks() {
    this.navLinks.innerHTML = `
      <a href="#about">关于</a>
      <a href="#work">作品</a>
      <a href="#contact">联系</a>
    `;
    
    this.checkBottom();
  }
  
  setupAutoShow() {
    if (this.isMobile()) {
      this.nav.classList.remove('initial-hidden');
      this.initialScrollTriggered = true;
      this.updateNavLinks();
    } else {
      this.autoShowTimer = setTimeout(() => {
        if (!this.initialScrollTriggered) {
          this.nav.classList.remove('initial-hidden');
          this.initialScrollTriggered = true;
        }
      }, 10000);
    }
  }
  
  clearAutoShowTimer() {
    if (this.autoShowTimer) {
      clearTimeout(this.autoShowTimer);
      this.autoShowTimer = null;
    }
  }
  
  isDesktop() {
    return window.innerWidth > 768;
  }
  
  isMobile() {
    return window.innerWidth <= 768;
  }
}

// 初始化导航控制器
document.addEventListener('DOMContentLoaded', () => {
  window.navigationController = new NavigationController();
});