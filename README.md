# whistle.pinned-ip
> 本插件是通用的解决方案，如果要自动生成域名的方案可以参考 [auto-generate-domain](./examples/auto-generate-domain)

该whistle插件用于将指定域名绑定本机IP，本机IP发生改变时会自动更新DNS服务器的IP设置，主要解决手机端连自己PC抓包调试工具时，PC的IP跳变需要重新配置手机代理问题。

### 安装
1. 该应用是whistle插件，需要先安装whistle：[https://github.com/avwo/whistle](https://github.com/avwo/whistle)
2. 安装插件：
    ```
    npm i -g whistle.pinned-ip
    ```
    > 推荐使用淘宝镜像：` npm i -g whistle.pinned-ip --registry=https://registry.npm.taobao.org`

### 使用

1. 需要有一个用[DNSPod](https://www.dnspod.cn/console/dashboard)做DNS服务的域名(如果已存在，可以忽略该步骤)
    - 申请域名：[https://dnspod.cloud.tencent.com/](https://dnspod.cloud.tencent.com/)
    - 用DNSPod做域名解析(腾讯云申请的域名默认为DNSPod解析)：[https://support.dnspod.cn/Kb/showarticle/tsid/28/](https://support.dnspod.cn/Kb/showarticle/tsid/28/)
  ![配置好DNSPod](https://user-images.githubusercontent.com/11450939/50771579-00566f80-12c6-11e9-94ba-179b1f6011e7.png)
2. 获取DNSPod的Token：https://support.dnspod.cn/Kb/showarticle/tsid/227
  ![获取DNSPod的Token](https://user-images.githubusercontent.com/11450939/50771507-c9805980-12c5-11e9-97ee-6c113b919618.png)

假设按上述方式获取如下数据：

1. 域名：`local.xxx.com`， 其中：`xxx.com` 为在DNSPod上配的域名，子域名不一定为 `local` 名称可以自定义
2. ID：`12345`，在DNSPod生成的ID
3. Token：`8353ad93214a5af5ad94d00411630667`，在DNSPod生成的Token

打开插件的管理页面把生成好的数据填上并点击提交：
![pinned-ip插件管理界面](https://user-images.githubusercontent.com/11450939/50772036-5e378700-12c7-11e9-8335-8a341a8e5e2a.gif)

这样插件将对应域名的DNS指向本机IP，且本机有IP变更会自动同步到DNSPod，最后用域名代替IP作为代理的域名配置手机代理：

![配置手机代理](https://user-images.githubusercontent.com/11450939/50773118-d5bae580-12ca-11e9-847a-dff3864e656f.png)

> 注意：由于DNS缓存原因，可能需要等待几分钟新IP才能生效。
