# whistle.pinned-ip-imweb
> 感谢IMWeb倒数第一帅 @andyzliu 友情提供域名 `mypcip.cn`

该whistle插件用于生成和本机IP关联的域名，本机IP发生改变时会自动更新DNS服务器的IP设置，主要解决手机端连自己PC抓包调试工具时，PC的IP跳变导致重新配置手机代理问题。

### 安装
1. 该应用是whistle插件，需要先安装whistle：[https://github.com/avwo/whistle](https://github.com/avwo/whistle)
2. 安装插件：
    ```
    tnpm i -g @tencent/whistle.pinned-ip-imweb
    ```
    > 如果出现权限问题加sudo：`sudo tnpm i -g @tencent/whistle.pinned-ip-imweb`

### 使用

安装成功后，打开 **whistle管理页面 > Plugins(右侧第四个按钮) > 插件管理页面**，可以看到关联当前电脑的IP的域名及代理端口：

![获取本机IP关联的域名](https://user-images.githubusercontent.com/11450939/50882222-07dd5c00-141f-11e9-9a08-1d997120a04a.png)

> 注意：由于DNS缓存原因，有可能需要等待几分钟新IP才能生效。

手机连Staff-WiFi并配置上述host及port即可连接你PC上的whistle代理。
