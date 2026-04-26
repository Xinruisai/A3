# PROG2005 - 库存管理系统

一个基于 Ionic Angular 的移动端库存管理应用，提供库存物品的查询、新增、更新和删除功能。

## 项目概述

本项目是一个跨平台移动应用，用于管理库存物品数据。应用通过 RESTful API 与后端服务通信，实现了完整的 CRUD（创建、读取、更新、删除）操作，并提供了友好的用户界面和错误提示。

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Angular | 20.0.0 | 前端框架 |
| Ionic | 8.0.0 | 移动端 UI 框架 |
| Capacitor | 8.3.1 | 原生功能桥接 |
| TypeScript | 5.9.0 | 编程语言 |
| RxJS | 7.8.0 | 响应式编程库 |

## 项目结构

```
PROG2005A3/
├── src/
│   ├── app/
│   │   ├── models/
│   │   │   └── inventory-item.model.ts    # 数据模型定义
│   │   ├── services/
│   │   │   └── inventory-api.service.ts   # API 服务
│   │   ├── tab1/                          # 库存列表页面
│   │   │   ├── tab1.page.ts
│   │   │   ├── tab1.page.html
│   │   │   └── tab1.page.scss
│   │   ├── tab2/                          # 库存管理页面
│   │   │   ├── tab2.page.ts
│   │   │   ├── tab2.page.html
│   │   │   └── tab2.page.scss
│   │   ├── tab3/                          # 隐私与安全页面
│   │   │   ├── tab3.page.ts
│   │   │   ├── tab3.page.html
│   │   │   └── tab3.page.scss
│   │   ├── tabs/                          # 标签页导航
│   │   │   ├── tabs.page.ts
│   │   │   ├── tabs.page.html
│   │   │   └── tabs.routes.ts
│   │   ├── app.component.ts               # 应用根组件
│   │   └── app.routes.ts                  # 应用路由配置
│   ├── assets/                            # 静态资源
│   ├── environments/                      # 环境配置
│   ├── theme/                             # 主题样式
│   ├── global.scss                        # 全局样式
│   └── main.ts                            # 应用入口
├── angular.json                           # Angular 配置
├── ionic.config.json                      # Ionic 配置
├── package.json                           # 项目依赖
└── tsconfig.json                          # TypeScript 配置
```

## 功能特性

### Tab 1 - 库存列表

- 显示所有库存物品记录
- 按物品名称搜索（支持精确匹配和模糊匹配）
- 刷新列表功能
- 显示物品详细信息：
  - 物品编号
  - 物品名称
  - 分类
  - 库存状态
  - 数量
  - 价格
  - 供应商
  - 是否推荐
  - 备注信息

### Tab 2 - 库存管理

- **新增物品**：填写表单创建新的库存记录
- **更新物品**：按名称查找并更新现有记录
- **删除物品**：按名称删除记录（Laptop 除外）
- **推荐商品列表**：展示所有推荐商品
- **表单验证**：
  - 必填项检查
  - 数字范围验证
  - ASCII 字符检查（后端数据库限制）

### Tab 3 - 隐私与安全

- 输入校验说明
- 数据最小化原则
- 安全错误提示
- HTTPS 传输安全
- 运维控制建议
- 常见问题解答

## 数据模型

### InventoryItem

| 字段 | 类型 | 说明 |
|------|------|------|
| item_id | number | 物品编号（后端自动生成） |
| item_name | string | 物品名称（唯一） |
| category | string | 分类 |
| quantity | number | 库存数量 |
| price | number | 价格 |
| supplier_name | string | 供应商名称 |
| stock_status | string | 库存状态 |
| featured_item | number | 是否推荐（1=是，0=否） |
| special_note | string | 备注信息 |

### 物品分类

- Electronics（电子产品）
- Furniture（家具）
- Clothing（服装）
- Tools（工具）
- Other（其他）

### 库存状态

- In stock（有货）
- Low stock（库存不足）
- Out of stock（无货）

## API 接口

### 基础地址

```
https://prog2005.it.scu.edu.au/ArtGalley
```

### 接口列表

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | / | 获取所有库存物品 |
| GET | /{name} | 按名称搜索物品 |
| POST | / | 新增库存物品 |
| PUT | /{name} | 更新指定物品 |
| DELETE | /{name} | 删除指定物品 |

## 开发指南

### 环境要求

- Node.js 18+
- npm 9+
- Ionic CLI

### 安装依赖

```bash
npm install
```

### 开发服务器

```bash
npm start
```

或

```bash
ionic serve
```

### 构建应用

```bash
npm run build
```

### 运行测试

```bash
npm test
```

### 代码检查

```bash
npm run lint
```

### 真机测试

确保运行的服务和手机处于同一网络下，否则无法访问应用。

```bash
ionic serve --external
```
bash框架中运行 ionic serve --external 命令，将启动一个外部服务器，并打开浏览器，手机浏览器访问该服务器即可查看应用效果。
地址使用External URL，例如：https://192.168.1.100:8100/

## 业务规则

1. **物品名称唯一性**：每个物品的名称必须唯一
2. **Laptop 保护**：名称为 "Laptop" 的记录不能被删除
3. **字符限制**：物品名称仅支持 ASCII 字符（后端数据库限制）
4. **数值验证**：数量和价格必须为非负数

## 错误处理

应用实现了完善的错误处理机制：

- 网络错误捕获
- 后端错误信息提取
- 用户友好的中文错误提示
- 特殊错误处理（如中文字符不支持提示）

## 安全特性

- 输入数据校验
- HTTPS 加密传输
- 简洁的错误提示（避免泄露内部信息）
- 数据最小化原则

## 浏览器支持

参见 `.browserslistrc` 文件配置。

## 许可证

私有项目

## 作者

Ionic Framework

## 相关链接

- [Ionic Framework](https://ionicframework.com/)
- [Angular](https://angular.io/)
- [Capacitor](https://capacitorjs.com/)
