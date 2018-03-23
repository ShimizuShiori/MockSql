# MockSql

## 概要
‘
使用MockSql可以用来批量创建测试数据到数据库中

一个完整的MockSql应该包含以下功能

* 根据数据库类型和数据库连接字符串，读取表信息和字段信息
* 根据字段信息，通过UI选择值的生成规则
* 通过上述操作，生成一个用于生成语句的任务清单
* 根据任务清单生成Insert语句
* 执行生成得到的Insert语句

## 目前完成度

* [ ] 根据数据库类型和数据库连接字符串，读取表信息和字段信息
* [ ] 根据字段信息，通过UI选择值的生成规则
* [ ] 通过上述操作，生成一个用于生成语句的任务清单
* [x] 根据任务清单生成Insert语句
* [ ] 执行生成得到的Insert语句

## 使用说明书

### 命令行

在github当前项目中，可以使用以下命令看到演示结果

```cmd
node built/index.js tasks/demoTask.json
```

### 配置文件

*task* 目录中有 *schema* 文件，只需要在编写配置文件时，引入该 *schema* 即可。

```json
{
    "$schema": "./task.schema.json",
}
```

### 扩展

本项目是由 *TypeScript* 编写而成。
主要扩展的方向是 **值生成器** 和 **Sql生成器**

* 值生成器，是用于以可配置的规则生成待写入值的工具
* Sql生成器，是用于生成对当前数据库兼容的Insert语句