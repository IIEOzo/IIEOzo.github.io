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
    
    this.lastScrollY = window.scrollY;
    this.scrollThreshold = 150;
    this.initialScrollTriggered = false;
    this.autoShowTimer = null;
    
    this.init();
  }
  
  init() {
    this.setupInitialState();
    this.bindEvents();
    this.setupAutoShow();
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
    
    if (this.isMobile()) {
      this.updateMobileNavLinks();
      return;
    }
    
    this.handleDesktopScroll(currentScrollY);
    this.lastScrollY = currentScrollY;
  }
  
  handleDesktopScroll(currentScrollY) {
    window.requestAnimationFrame(() => {
      this.checkHeroVisibility();
      this.checkBottom();
      
      // 首次滚动处理
      if (!this.initialScrollTriggered && currentScrollY > 5) {
        this.nav.classList.remove('initial-hidden');
        this.initialScrollTriggered = true;
        this.clearAutoShowTimer();
      }
      
      // 导航栏显示/隐藏逻辑
      if (!this.nav.classList.contains('at-bottom')) {
        const isScrollingUp = currentScrollY < this.lastScrollY;
        const isScrollingDown = currentScrollY > this.lastScrollY;
        
        if (isScrollingUp) {
          this.nav.classList.remove('nav-hidden');
        } else if (isScrollingDown) {
          this.nav.classList.add('nav-hidden');
        }
      }
    });
  }
  
  checkHeroVisibility() {
    if (!this.heroSection || this.isMobile()) return;
    
    const heroRect = this.heroSection.getBoundingClientRect();
    const heroBottom = heroRect.bottom;
    
    if (heroBottom > 0 && window.scrollY < heroRect.height) {
      this.setNavTransparent();
    } else {
      this.setNavSolid();
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
  
  updateMobileNavLinks() {
    if (!this.isMobile()) return;
    
    const currentSection = this.getCurrentSection();
    this.navLinks.innerHTML = this.generateMobileLinks(currentSection);
  }
  
  getCurrentSection() {
    const sections = [
      { id: 'about', element: document.querySelector('#about') },
      { id: 'work', element: document.querySelector('#work') },
      { id: 'contact', element: document.querySelector('#contact') }
    ];
    
    const currentScroll = window.scrollY + 100;
    
    for (const section of sections) {
      if (section.element && currentScroll >= section.element.offsetTop) {
        return section.id;
      }
    }
    
    return 'hero';
  }
  
  generateMobileLinks(currentSection) {
    const linkMap = {
      'hero': '',
      'about': '<a href="#work">作品</a><a href="#contact">联系</a>',
      'work': '<a href="#about">关于</a><a href="#contact">联系</a>',
      'contact': '<a href="#about">关于</a><a href="#work">作品</a>'
    };
    
    return linkMap[currentSection] || '';
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
    
    if (this.isMobile()) {
      this.nav.classList.remove('transparent');
      this.nav.style.backgroundColor = 'rgba(255, 255, 255, 1)';
      this.nav.style.backdropFilter = 'none';
      this.nav.style.borderBottom = '1px solid rgba(0, 0, 0, 0.08)';
    } else {
      this.setNavTransparent();
    }
    
    if (this.isMobile()) {
      this.updateMobileNavLinks();
    }
  }
  
  handleResize() {
    if (this.isMobile()) {
      this.updateMobileNavLinks();
    } else {
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
      this.updateMobileNavLinks();
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