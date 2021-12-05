# server



## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org

## git commit提交规范
### 格式
```
type(scope) : subject

scope(可选): 用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同

subject: commit 的简短描述，不超过50个字符。
```
- feat : 新功能
- fix : 修复bug
- docs : 文档改变
- style : 代码格式改变
- refactor : 某个已有功能重构
- perf : 性能优化
- test : 增加测试
- build : 改变了build工具 如 grunt换成了 npm
- revert : 撤销上一次的 commit
- chore : 构建过程或辅助工具的变动

## 输出状态码
{
    code: 0,
    data: {

    },
    message: '',
    <!-- errors: 具体信息 -->
}

code :0 是成功 其他都是失败
-1 是错误
-666 登录状态过期