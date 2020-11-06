### qcweb 静态网站发布脚手架
```shell script
* projectId 项目ID
* userId 用户ID
* describe 更新描述
* top 查看多少条
* historyId 历史版本ID


* 发布新版本 qcweb deploy "http://<projectId>:<userId>@127.0.0.1:3000" "<describe>"
# 如下 会把项目根目录下面的 dist 文件夹压缩为 dist.zip 文件 ，然后上传到服务器完成项目更新
qcweb deploy "http://392508c2-f4b3-48b9-84cd-93b8891f19ec:9da39bcc-aba0-44e0-927a-8f5feada0e13@127.0.0.1:3000" "测试脚手架"


* 查看发布历史 qcweb deploy "http://<projectId>:<userId>@127.0.0.1:3000" "<top>"
# 如下
qcweb history "http://392508c2-f4b3-48b9-84cd-93b8891f19ec:9da39bcc-aba0-44e0-927a-8f5feada0e13@127.0.0.1:3000" 10

会得到如下结果
* historyId                             uploadUser         uploadTime    describe
* b4af1ac0-1db6-11eb-85e1-55399207c7de  superAdmin   2020-11-03 17:26:51   版本回滚-->null
* be58f550-1db1-11eb-b14a-537213ab45fb  superAdmin   2020-11-03 16:51:20   版本回滚-->null
* 51910440-1db0-11eb-a67d-57e45b9bb2d2  superAdmin   2020-11-03 16:41:08   测试脚手架1
* d7625480-1daf-11eb-a67d-57e45b9bb2d2  superAdmin   2020-11-03 16:37:43   测试脚手架1
* 62229d10-1daf-11eb-a67d-57e45b9bb2d2  superAdmin   2020-11-03 16:34:26   测试脚手架
* 30330910-1ced-11eb-9f03-951397e20d0f  superAdmin   2020-11-02 17:24:20   版本回滚-->null
* 87fad5e0-1cea-11eb-bb1d-ff56e6f9c60d  superAdmin   2020-11-02 17:05:19   null
* 6f790820-1cea-11eb-82d4-f7f22ce15ed0  superAdmin   2020-11-02 17:04:38   null
* 66034f30-1cea-11eb-82d4-f7f22ce15ed0  superAdmin   2020-11-02 17:04:22   null
* 389b5100-1cea-11eb-82d4-f7f22ce15ed0  superAdmin   2020-11-02 17:03:06   null


* 回滚版本 qcweb rollback "http://<projectId>:<userId>@127.0.0.1:3000" "<historyId>"
# 如下 用上面得到的historyId即可使用
qcweb rollback "http://392508c2-f4b3-48b9-84cd-93b8891f19ec:9da39bcc-aba0-44e0-927a-8f5feada0e13@127.0.0.1:3000" "6f790820-1cea-11eb-82d4-f7f22ce15ed0"

```




