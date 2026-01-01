/*
 * cursor.js - 自定义鼠标交互系统优化版
 * 优化内容：使用模块化、事件委托、性能优化、代码简洁
 */

class CustomCursor {
  constructor() {
    this.cursor = null;
    this.clickEffect = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.isMoving = false;
    this.moveTimer = null;
    this.scrollTimer = null;
    this.isScrolling = false;
    this.interactiveSelectors = 'a, button, .btn, .filter-btn, .portfolio-link, .portfolio-item, .social-links a';
    
    // 仅在桌面端初始化
    if (this.isDesktop()) {
      this.init();
    }
  }
  
  // 检测是否为桌面端
  isDesktop() {
    return window.innerWidth >= 769;
  }
  
  // 初始化光标系统
  init() {
    this.createCursorElements();
    this.bindEvents();
    this.animate();
  }
  
  // 创建光标元素
  createCursorElements() {
    // 主光标
    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';
    document.body.appendChild(this.cursor);
    
    // 点击效果
    this.clickEffect = document.createElement('div');
    this.clickEffect.className = 'cursor-click';
    document.body.appendChild(this.clickEffect);
  }
  
  // 绑定事件
  bindEvents() {
    // 鼠标移动
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    
    // 事件委托处理可交互元素
    document.addEventListener('mouseover', (e) => this.handleMouseOver(e));
    document.addEventListener('mouseout', (e) => this.handleMouseOut(e));
    document.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    
    // 页面滚动
    window.addEventListener('scroll', () => this.handleScroll());
    
    // 窗口大小改变
    window.addEventListener('resize', () => this.handleResize());
  }
  
  // 鼠标移动处理
  handleMouseMove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    this.isMoving = true;
    
    clearTimeout(this.moveTimer);
    this.moveTimer = setTimeout(() => {
      this.isMoving = false;
    }, 100);
  }
  
  // 鼠标悬停在可交互元素上
  handleMouseOver(e) {
    const target = e.target;
    if (target.matches(this.interactiveSelectors)) {
      document.body.classList.add('link-hover');
      if (target.tagName === 'A' || target.classList.contains('btn')) {
        target.classList.add('cursor-link');
      }
    }
  }
  
  // 鼠标离开可交互元素
  handleMouseOut(e) {
    const target = e.target;
    if (target.matches(this.interactiveSelectors)) {
      document.body.classList.remove('link-hover');
      if (target.tagName === 'A' || target.classList.contains('btn')) {
        target.classList.remove('cursor-link');
      }
    }
  }
  
  // 鼠标按下
  handleMouseDown(e) {
    // 显示点击效果
    if (e.target.matches(this.interactiveSelectors)) {
      this.showClickEffect(e);
    }
    
    // 光标缩放效果
    if (this.cursor) {
      this.cursor.style.transform = 'translate(-50%, -50%) scale(0.9)';
      this.cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    }
  }
  
  // 鼠标释放
  handleMouseUp() {
    if (this.cursor) {
      this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      this.cursor.style.backgroundColor = '#ffffff';
    }
  }
  
  // 显示点击效果
  showClickEffect(event) {
    this.clickEffect.style.left = `${event.clientX}px`;
    this.clickEffect.style.top = `${event.clientY}px`;
    this.clickEffect.classList.add('active');
    
    setTimeout(() => {
      this.clickEffect.classList.remove('active');
    }, 200);
  }
  
  // 滚动处理
  handleScroll() {
    if (!this.isScrolling) {
      document.body.classList.add('scrolling');
      this.isScrolling = true;
    }
    
    clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => {
      document.body.classList.remove('scrolling');
      this.isScrolling = false;
    }, 150);
  }
  
  // 窗口大小改变处理
  handleResize() {
    if (!this.isDesktop()) {
      document.body.classList.add('cursor-disabled');
      if (this.cursor) this.cursor.style.display = 'none';
    } else {
      document.body.classList.remove('cursor-disabled');
      if (this.cursor) this.cursor.style.display = 'block';
    }
  }
  
  // 动画循环
  animate() {
    if (this.cursor && (this.isMoving || document.body.classList.contains('link-hover'))) {
      this.cursor.style.left = `${this.mouseX}px`;
      this.cursor.style.top = `${this.mouseY}px`;
    }
    
    requestAnimationFrame(() => this.animate());
  }
  
  // 销毁光标系统
  destroy() {
    if (this.cursor) this.cursor.remove();
    if (this.clickEffect) this.clickEffect.remove();
  }
}

// 初始化光标系统
document.addEventListener('DOMContentLoaded', () => {
  // 仅在桌面端初始化
  if (window.innerWidth >= 769) {
    window.customCursor = new CustomCursor();
  }
});