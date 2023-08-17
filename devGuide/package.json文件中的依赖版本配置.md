
## 灵活使用package.json文件中的依赖版本号配置
`npm`对于依赖的版本号有以下的规定：
1. 一个包含`package.json`文件的目录，比如`"demo":"./pkgs/demo"`
1. 一个包含1的目录结构的`tgz`压缩包，比如`"demo":"./pkgs/demo.tgz"`
1. 一个可以处理为2的`URL`，比如`"demo":"http://path/demo.tgz"`
1. 一个`<name>@<version>`格式的文本，指代发布到registry的一个可以处理为3的包，项目中常用的为此方式，比如`"demo":"1.0.0"`
1. 一个`<name>@<tag>`格式的文本，指向4,比如`"demo":"BETA"`
1. 一个`<name>`格式的文本，意为`<name>@latest`,比如`"demo":"latest"`
1. 一个`git`地址，当`clone`之后，结果为1,比如`"demo":"git://path/demo.git"`
   `git` 地址格式如下
    ```
    git://github.com/user/project.git#commit-ish
    git+ssh://user@hostname:project.git#commit-ish
    git+http://user@hostname/project/blah.git#commit-ish
    git+https://user@hostname/project/blah.git#commit-ish
    commit-ish 可以是任意可成功执行git checkout的标签（tag）、commit-hash、分支名称等
    默认为master
    ```

根据此规定，我们可以灵活的配置依赖的版本或指定特定的自己修改过的第三方依赖

此处以`mini-css-extract-plugin`以及上述第二种方式进行详细阐述

1. 将`tgz`文件放到本地的`pgks`目录下
1. 修改`package.json`文件中的相关依赖版本为指向对应`tgz`的相对于`package.json`的相对路径`"mini-css-extract-plugin": "./pkgs/mini-css-extract-plugin-0.10.0.tgz"`
1. 使用`npm install`进行`install`
1. 将`pkgs`目录及下边的tgz文件以及修改后的`package.json`文件提交到仓库

**注意：**
1. `pkgs`目录名，此处仅作为示例，实际项目中，可以放到项目的任意目录下
1. 使用本地的`tgz`文件作为依赖后，只能使用`npm install`，且这个依赖必须在项目的`package.json`中直接依赖
1. 与`tgz`文件相似，也可以使用解压后的目录以及`git`仓库作为依赖
1. `tgz`文件可以使用URL形式,比如
   ```
   "mini-css-extract-plugin": "http://118.112.188.108:9071/mini-css-extract-plugin/download/mini-css-extract-plugin-0.10.0.tgz"
   ```
