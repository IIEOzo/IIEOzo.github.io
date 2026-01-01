🚀 个人设计作品站 - 极速上手指南
⚡ 30秒速览
项目类型：静态作品集网站
技术栈：HTML5 + CSS3 + ES6
代码状态：✅ 完全优化，✅ 语义化，✅ 响应式
维护难度：简单（无需构建工具）
关键特性：自定义光标、分组动画、智能导航

📁 文件结构速查
text
项目根目录/
├── index.html              # 唯一页面
├── css/                   # 样式（模块化组织）
│   ├── main.css          # 基础/字体/滚动条
│   ├── components.css    # 所有组件样式
│   ├── animations.css    # 所有动画效果
│   └── cursor.css        # 自定义光标
├── js/                   # JS（面向对象设计）
│   ├── main.js          # 应用入口
│   ├── navigation.js    # 导航逻辑
│   ├── portfolio.js     # 作品集切换
│   └── cursor.js        # 光标交互
└── production/          # 作品详情页目录
🎨 设计系统速查
核心CSS变量
css
/* 在:root中定义 - 全局修改颜色/动画 */
--bg-dark: #181818;          /* 背景色 */
--bg-card: #1f1f1f;          /* 卡片背景 */
--text-primary: #dbdbdb;     /* 主要文字 */
--transition-fast: 0.4s...;  /* 动画曲线 */
断点系统
桌面端：≥769px（完整交互）

移动端：≤768px（简化动画）

🧩 核心模块速查
1. 导航系统 (navigation.js)
javascript
// 智能功能：
// - 滚动时隐藏/显示
// - 首页透明效果
// - 移动端自动切换导航链接
// - 底部显示返回箭头

// 修改导航链接：
// 1. 修改index.html中的nav-links
// 2. 移动端自动适配（无需修改JS）
2. 作品集系统 (portfolio.js)
javascript
// 分类切换：
// 按钮 → data-filter="分类名"
// 容器 → data-category="分类名"
// 支持分类：brand, poster, logo, other

// 添加新分类：
// 1. 添加HTML结构（按模板）
// 2. 添加筛选按钮
// 3. JS自动识别，无需修改
3. 动画系统 (animations.css)
html
<!-- 添加渐入动画 -->
<div class="group-1" data-delay="0.2s">内容</div>
<!-- 组号：1-6，延迟：0-1.4s -->
<!-- 滚动到视口自动添加.active类 -->
4. 光标系统 (cursor.js)
javascript
// 仅在桌面端启用（≥769px）
// 功能：白色圆形 + 悬停放大 + 点击波纹
// 可交互元素：a, button, .btn, .filter-btn等
⚙️ 快速操作指南
🔧 添加新作品分类
html
<!-- 1. 添加按钮 -->
<button class="filter-btn" data-filter="新分类">新分类</button>

<!-- 2. 添加作品容器 -->
<div class="portfolio-category" data-category="新分类" style="display:none;">
  <!-- 复制现有结构 -->
</div>
<!-- ✅ 完成！JS自动处理 -->
🎬 添加新页面板块
html
<section id="新板块">
  <h2 class="section-title">标题</h2>
  <div class="新容器样式">
    内容
  </div>
</section>

<!-- 添加CSS -->
.新容器样式 {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 40px 50px;
}
🗑️ 禁用/删除功能
css
/* 禁用所有动画 */
* { transition: none !important; animation: none !important; }

/* 删除光标系统 */
删除: cursor.css + cursor.js + HTML中的script标签
🚨 紧急修复指南
问题1：导航栏不显示
javascript
// 检查：控制台有无错误？JS是否加载？
// 快速修复：移除nav上的initial-hidden类
问题2：分类切换无效
javascript
// 检查：data-filter和data-category是否一致？
// 快速修复：确保按钮和容器使用相同分类名
问题3：动画不执行
css
/* 检查：animations.css是否加载？ */
/* 快速修复：确保元素有group-*类且滚入视口 */
📈 性能检查点
必须保持的指标
✅ LCP < 2.5秒（图片懒加载）

✅ FID < 100ms（事件委托）

✅ CLS < 0.1（尺寸固定的图片）

监控方法
javascript
// 在控制台运行：
console.log('性能状态:', {
  分类数: document.querySelectorAll('.portfolio-category').length,
  监听器数: getEventListeners(document).click?.length || 0
});
🎯 最佳实践速查
✅ 应该做的
html
<!-- 1. 图片优化 -->
<img src="..." width="400" height="400" loading="lazy">

<!-- 2. 语义化标签 -->
<section id="about">代替<div class="section">

<!-- 3. ARIA标签 -->
<button aria-label="筛选品牌作品">
❌ 不要做的
css
/* 1. 不要添加大量!important */
/* 2. 不要使用复杂的选择器嵌套（超过3层） */
/* 3. 不要在移动端使用复杂动画 */
🔄 代码规范速查
CSS规范
使用CSS变量（修改颜色/动画只需改:root）

BEM命名：.block__element--modifier

移动端优先：所有样式先写移动端，再@media桌面端

JS规范
使用类（Class）组织代码

事件委托：减少监听器数量

模块化：一个功能一个文件

HTML规范
语义化标签：header, main, section, footer

ARIA属性：按钮添加aria-label

外部链接：rel="noopener noreferrer"

📦 添加第三方库的注意事项
安全添加方法
html
<!-- 1. 使用preconnect预连接 -->
<link rel="preconnect" href="https://cdn库地址">

<!-- 2. 添加integrity校验 -->
<script src="..." integrity="sha256-..."></script>

<!-- 3. 添加crossorigin -->
<script src="..." crossorigin="anonymous"></script>
🐛 常见问题快速修复
症状	可能原因	快速修复
导航透明不生效	未在首页区域	检查.hero元素是否存在
移动端导航错乱	视口设置错误	检查<meta name="viewport">
分类切换卡顿	图片未懒加载	添加loading="lazy"属性
光标不显示	在移动端或JS错误	检查控制台错误，桌面端才启用
⚡ 5分钟完成的任务
任务1：更新联系方式
html
<!-- 修改index.html中的联系信息 -->
<p><b>电话：</b><a href="tel:新号码">新号码</a></p>
<p><b>邮箱：</b><a href="mailto:新邮箱">新邮箱</a></p>
任务2：添加新作品
html
<!-- 在对应分类的portfolio-grid中添加 -->
<div class="portfolio-item">
  <a href="链接" target="_blank" class="portfolio-link">
    <img src="图片" alt="描述" width="400" height="400">
    <div class="portfolio-overlay">
      <h3>标题</h3>
      <p>描述</p>
      <div class="btn">点击</div>
    </div>
  </a>
</div>
任务3：添加社交媒体
html
<!-- 在footer的social-links中添加 -->
<a href="链接" aria-label="平台名"><i class="fab fa-图标"></i></a>
🔧 工具推荐
开发工具
浏览器：Chrome DevTools（性能面板）

测试：Lighthouse（性能/SEO/可访问性）

代码：VS Code（安装Live Server插件）

调试命令
javascript
// 在控制台快速检查
检查导航状态: document.querySelector('nav').className
检查分类: document.querySelectorAll('.portfolio-category').length
检查事件: getEventListeners(document).click?.length
📞 紧急联系方式
遇到问题
JS错误 → 检查控制台（F12）

样式问题 → 检查元素样式（F12 → Elements）

性能问题 → 运行Lighthouse（F12 → Lighthouse）

快速回滚
bash
# 如果修改出错，恢复最近版本
git checkout -- index.html   # 恢复单个文件
git reset --hard HEAD^      # 恢复所有更改（慎用）
🎯 记住这几点
颜色/动画 → 只修改CSS变量（:root）

添加功能 → 先找类似模块，复制结构

移动端问题 → 检查@media规则

性能问题 → 图片懒加载 + 事件委托

JS问题 → 类已封装好，直接使用

最后更新：2024年1月
维护状态：✅ 稳定可用
上手时间：有经验前端 ≈ 30分钟
测试要求：Chrome + Safari + 手机端

💡 提示：所有代码都有详细注释，遇到问题先看注释，再查此文档。