#!/bin/bash
# 启动 uni-app 项目到微信开发者工具

echo "正在启动项目..."

# 打开 HBuilderX
open /Applications/HBuilderX-Alpha.app

# 等待 HBuilderX 启动
sleep 3

# 打开微信开发者工具
open /Applications/wechatwebdevtools.app

echo "请在 HBuilderX 中："
echo "1. 导入项目：文件 -> 导入 -> 从本地目录导入"
echo "2. 选择项目路径：/Users/a8833/Documents/jxj_miniprograms"
echo "3. 右键点击项目 -> 运行 -> 运行到小程序模拟器 -> 微信开发者工具"
echo ""
echo "或者："
echo "右键点击项目 -> 运行 -> 运行到浏览器 -> Chrome (H5 预览)"
