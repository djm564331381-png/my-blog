# 我的博客

一个极简主义的个人博客网站，风格参考 [sinyalee.com](https://sinyalee.com/blog/)。

## 特点

- **极简设计**：白色背景，内容优先，专注于阅读体验
- **响应式布局**：完美适配桌面端和移动端
- **文章分类**：支持按分类浏览文章
- **搜索功能**：快速查找感兴趣的内容
- **留言板**：使用 Utterances 实现基于 GitHub Issues 的评论系统
- **暗色模式**：自动适配系统主题偏好
- **免费托管**：使用 GitHub Pages 部署

## 技术栈

- HTML5
- CSS3（CSS 变量、Flexbox、Grid）
- Vanilla JavaScript（无框架依赖）
- GitHub Pages（免费托管）

## 本地预览

直接在浏览器中打开 `index.html` 文件即可预览。

或者使用简单的 HTTP 服务器：

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .
```

然后访问 `http://localhost:8000`

## 如何添加新文章

1. 打开 `assets/js/main.js` 文件
2. 在 `blogPosts` 数组中添加新文章对象：

```javascript
{
    id: 6,  // 确保 ID 唯一
    title: "文章标题",
    excerpt: "文章摘要（显示在列表页）",
    content: `<p>文章内容（支持 HTML）</p>`,
    category: "分类名称",
    date: "2026-04-17",
    tags: ["标签1", "标签2"]
}
```

3. 保存文件，刷新页面即可看到新文章

## 部署到 GitHub Pages

### 第一步：创建 GitHub 仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角 "+" → "New repository"
3. 仓库名称填写 `my-blog`（或你喜欢的名字）
4. 选择 "Public"（公开）
5. 点击 "Create repository"

### 第二步：上传代码

#### 方法一：使用 Git 命令行

```bash
# 进入博客目录
cd my-blog

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 关联远程仓库（替换为你的用户名）
git remote add origin https://github.com/你的用户名/my-blog.git

# 推送代码
git branch -M main
git push -u origin main
```

#### 方法二：直接上传

1. 在 GitHub 仓库页面点击 "uploading an existing file"
2. 拖拽或选择所有文件上传
3. 点击 "Commit changes"

### 第三步：启用 GitHub Pages

1. 进入仓库的 "Settings"（设置）
2. 左侧菜单点击 "Pages"
3. "Source" 选择 "Deploy from a branch"
4. "Branch" 选择 "main"，文件夹选择 "/ (root)"
5. 点击 "Save"
6. 等待几分钟，访问 `https://你的用户名.github.io/my-blog/`

## 自定义配置

### 修改博客标题和描述

编辑 `index.html` 中的：

```html
<h1 class="site-title"><a href="index.html">我的博客</a></h1>
<p class="site-description">记录生活与思考</p>
```

### 修改配色

编辑 `assets/css/style.css` 中的 CSS 变量：

```css
:root {
    --accent-color: #0073aa;  /* 主题色 */
    --background-color: #fff;  /* 背景色 */
    --text-color: #333;        /* 文字颜色 */
    /* ... */
}
```

### 修改关于页面

编辑 `about.html` 文件中的内容。

## 评论系统配置

留言板使用 [Utterances](https://utteranc.es/)，一个基于 GitHub Issues 的免费评论系统。

1. 确保你的博客仓库是公开的
2. 安装 [Utterances GitHub App](https://github.com/apps/utterances)
3. 在 `guestbook.html` 中修改配置：

```html
<script src="https://utteranc.es/client.js"
    repo="你的用户名/my-blog"  <!-- 修改这里 -->
    issue-term="pathname"
    theme="github-light"
    crossorigin="anonymous"
    async>
</script>
```

## 目录结构

```
my-blog/
├── index.html          # 首页
├── post.html           # 文章详情页
├── posts.html          # 文章列表页
├── about.html          # 关于页面
├── guestbook.html      # 留言板
├── README.md           # 说明文档
├── assets/
│   ├── css/
│   │   └── style.css   # 样式文件
│   └── js/
│       └── main.js     # 脚本文件
└── posts/              # 文章数据目录（可选）
```

## 许可证

MIT License - 可自由使用和修改

---

有问题或建议？欢迎在留言板交流！
