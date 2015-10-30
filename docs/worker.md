NJob Worker Develop Guide
=======================
在 NJob 的架构中，Worker 是 Job 的最终执行者

与 Server 通信
============
Worker 与 Server 间通过 Broker 进行通信（目前版本中是 Redis）

消息传输的格式为`json`

接收方向上 Worker 需要订阅`njob-worker`频道的消息

发送方向上 Worker 只需要也只能向`njob-server`频道发送消息

基本消息结构
```
{
	"uuid": "消息唯一标识符（UUID.v1）",
	...
}
```

Job 注册
=======
Woker 需要向 Server 注册自己可以处理的 Job

注册消息结构
```
{
	...
	"job": {
		"name": "add",
		"args": [
			{
				"name": "firstAddend",
				"type": "Number"
			},
			{
				"name": "secondAddend",
				"type": "Number"
			}
		]
	}
}
```

参数类型的可选值
- Number
- Boolean
- String
- Object
- Array

注册成功后 Server 将会返回一条`uuid`相同的消息

接收 Job
-----------------
Server 收到 Client 的请求后会将 Job 转发给 Worker

由于所有的 Worker 都订阅了同一个`njob-server`频道，所以 Worker 需要在收到 Job 之后检查自己是否能处理，能则处理，否则忽略

接收消息结构
```
{
	...
	"job": {
		"id": "任务唯一标识符（UUID.v4)",
		"name": "add",
		"args": [
			{
				"name": "firstAddend",
				"value": "1"
			},
			{
				"name": "secondAddend",
				"value": "2"
			}
		]
	}
}
```

更新 Job 状态
----------------
当 Job 状态发生改变时，Worker 需要主动通知 Server

更新消息结构
```
{
	...
	"status": "状态"
	"job": {
		"id": "任务唯一标识符（UUID.v4)"
	}
}
```

可能的状态有
值|意义
---|-----
jobWaiting|等待执行
jobProcessing|执行中
jobFailure|失败
jobCompleted|已完成
jobRevoked|已撤销