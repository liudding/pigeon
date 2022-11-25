
# Socket 

> Made with SocketIO

本项目仅作为 WebSocket 的代理 broker，负责转发客户端与客户端、客户端与服务端之间的事件消息，不参与业务。


### 事件
事件分为系统事件和普通事件，
#### 系统事件
系统事件是 Socket 系统定义的事件，用来处理定义的应用协议（非 WebSocket 协议）。事件名称均为保留词，在定义普通事件时，需确保普通事件名称不能与系统事件重名。

为了减少事件重名的概率，可为系统事件指定前缀，如指定前缀为 `chao`，则系统事件名称则形如 `chao:join_room`。

事件列表：
* join_room
* join_room_succeeded
* 

#### 普通事件
普通事件，可以任意定义。



### 事件发送

方式：
* 广播
* 指定对象


### Webhooks

```json
{
  "time_ms": 1327078148132,
  "events": [{ "name": "event_name", "some": "data" }]
}
```

## Admin UI

https://admin.socket.io/