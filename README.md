# 校体云 - 教师端小程序

校体云教师端小程序是一款基于uni-app框架开发的跨平台移动应用，主要为体育教师提供作业布置、学生管理、体测数据查看等功能。项目支持微信小程序、H5、App等多端部署。

## 技术栈
- 前端框架：uni-app + Vue 2
- UI组件库：uView UI
- 状态管理：Vuex
- 国际化：Vue I18n
- 加密工具：crypto-js
- 压缩工具：pako
- 编码工具：base-64

## 项目启动

```bash
# 1、依赖安装
npm install

# 2、微信小程序开发环境启动
npm run dev:mp-weixin

# 3、其他平台构建
# 根据 uni-app 配置进行相应平台的构建
```

## 环境配置

项目支持多环境配置，在 `package.json` 中定义了不同环境的构建脚本：

### 开发环境 (dev)
- 环境：测试环境
- API地址：http://test.xty.public.xiaoti.cloud

### 预发环境 (pre)  
- 环境：预发环境
- API地址：http://pre.xty.public.xiaoti.cloud

### 生产环境 (pro)
- 环境：正式环境  
- API地址：https://xty.public.xiaoti.cloud

## 项目结构

jlp-microprogram-teacher/
├── .gitignore                     # Git忽略文件
├── .vscode/                       # VSCode配置
├── App.vue                        # 应用入口组件
├── main.js                        # 应用入口文件
├── manifest.json                  # 应用配置文件
├── package.json                   # 项目依赖配置
├── pages.json                     # 页面路由配置
├── uni.scss                       # 全局样式变量
├── common/                        # 公共模块
│   ├── huaweicloud/              # 华为云相关配置
│   ├── lang/                     # 国际化语言包
│   │   ├── zh-Hans.js           # 简体中文
│   │   └── zh-Hant.js           # 繁体中文
│   ├── request.js               # 网络请求封装
│   ├── secret.js                # 密钥配置
│   ├── unzip.js                 # 解压工具
│   ├── url.js                   # API接口地址
│   ├── util.js                  # 通用工具函数
│   └── utility/                 # 工具类
│       ├── ClassUtil.js         # 班级工具类
│       ├── DateUtil.js          # 日期工具类
│       └── MathUtil.js          # 数学工具类
├── components/                   # 全局组件
│   └── model/                   # 模态框组件
├── pages/                       # 主包页面
│   ├── home/index/              # 首页
│   ├── login/                   # 登录相关
│   │   ├── index/              # 授权页面
│   │   ├── login/              # 登录页面
│   │   └── bindPhone/          # 绑定手机号
│   ├── mine/index/              # 个人中心
│   └── webView/index/           # 网页容器
├── pagesCenter/                 # 运动中心分包
│   ├── casuallyClass/           # 串班训练
│   ├── classTraining/           # 随堂训练
│   ├── freeExercise/            # 自由锻炼
│   ├── sportCenter/             # 运动中心
│   └── sunshineRun/             # 阳光跑
├── pagesData/                   # 数据统计分包
│   ├── aiData/                  # AI数据
│   ├── physicalData/            # 体测数据
│   ├── physicalFactorData/      # 体质因子数据
│   └── prizeVerification/       # 奖品核销
├── pagesMine/                   # 个人中心分包
│   └── mine/                    # 个人相关页面
│       ├── classConcat/         # 班级联系
│       ├── classManage/         # 班级管理
│       ├── clockDateSetting/    # 打卡日期设置
│       ├── editPhone/           # 编辑手机号
│       ├── facialCapture/       # 人脸采集
│       ├── facialSelfie/        # 人脸自拍
│       └── myInformation/       # 个人信息
├── pagesNotice/                 # 通知分包
│   ├── index/                   # 通知列表
│   └── leaveNotice/             # 请假通知
├── pagesPlan/                   # 计划分包
│   ├── classPlan/               # 班级计划
│   └── intervention/            # 干预计划
├── pagesTask/                   # 作业分包
│   ├── assign/                  # 布置作业
│   ├── correct/                 # 批改作业
│   └── components/              # 作业相关组件
├── static/                      # 静态资源
│   └── images/                  # 图片资源
├── store/                       # 状态管理
│   └── index.js                 # Vuex配置
└── uni_modules/                 # uni-app插件
├── lime-echart/             # 图表组件
└── uni-data-picker/         # 数据选择器

