- Broker:
	-  1 cụm kafka có thể có nhiều broker
	- Mỗi broker có nhiệm vụ nhận message từ đầu producer và lưu trữ message ở broker, và gửi message đến consumer
	- Ngoài ra broker còn có nhiều nhiệm vụ khác như là: 
		- Điều phối group consumer
		- Lưu trữ commit offset
		- Chọn ra consumer leader
		- ...
- Zookeeper"
	-  Là 1 phần mềm open source dùng để quản lý các broker và quản lý trạng thái chung của cụm cluster 
	- Zookeeper chia sẻ thông tin trạng thái của broker, khi 1 broker chết hoặc đc thêm vào thì nó sẽ noti đến các broker khác, hoặc 1 topic được thêm vào thì nó cũng gửi noti đến các broker khác


# 1. Architecture

## 1.1. Broker

Trong Kafka, **Broker** là thành phần cốt lõi chịu trách nhiệm **nhận, lưu trữ và phân phối message**. Một hệ thống Kafka không chỉ có một broker mà thường được triển khai thành một **Kafka Cluster**, bao gồm nhiều broker chạy trên các server khác nhau.

Có thể hình dung đơn giản:

```
                Kafka Cluster
        ┌─────────────────────────┐
        │                         │
Producer ────► Broker 1           │
        │       Broker 2           │
        │       Broker 3           │
        │       ...                │
        │                         │
        └──────────┬──────────────┘
                   │
                   ▼
               Consumer
```

Producer không nhất thiết phải gửi message trực tiếp đến một broker cố định. Kafka sẽ xác định broker nào đang giữ **partition** tương ứng để message được ghi vào đúng nơi.

### Nhiệm vụ chính của Broker

#### 1. Nhận message từ Producer

Khi Producer gửi message vào Kafka, broker sẽ tiếp nhận message và xác định message đó thuộc **topic/partition** nào.

Ví dụ:

```
Producer
   │
   │ OrderCreated
   ▼
Topic: orders
   │
   ├── Partition 0
   ├── Partition 1
   └── Partition 2
```

Mỗi partition thực chất là một **log append-only**, nơi Kafka ghi các message theo thứ tự.

---

#### 2. Lưu trữ message

Broker chịu trách nhiệm lưu trữ message trên disk.

Ví dụ:

```
Topic: orders

Partition 0
┌────┬────┬────┬────┬────┐
│ M0 │ M1 │ M2 │ M3 │ M4 │
└────┴────┴────┴────┴────┘
  0    1    2    3    4
       ↑
     Offset
```

Mỗi message có một **offset**, giúp Kafka xác định chính xác vị trí của message trong partition.

Điểm quan trọng là Kafka **không xóa message ngay sau khi Consumer đọc**.

Message sẽ tiếp tục tồn tại dựa trên chính sách retention, ví dụ:

```
retention.ms = 7 days
```

hoặc dựa trên kích thước:

```
retention.bytes = 100GB
```

Điều này cho phép nhiều Consumer có thể đọc cùng một message và thậm chí Consumer có thể **đọc lại message cũ** bằng cách reset offset.

---

#### 3. Phân phối message cho Consumer

Broker cũng chịu trách nhiệm phục vụ Consumer khi Consumer request message.

Ví dụ:

```
Producer
   │
   ▼
Broker
   │
   ├────────► Consumer A
   │
   └────────► Consumer B
```

Tuy nhiên, Kafka không đơn giản là broker "push" message xuống Consumer.

Thực tế, Consumer thường **pull message từ Broker** bằng cách gửi request để lấy các message tiếp theo mà nó cần xử lý.

---

#### 4. Quản lý Consumer Group

Kafka Broker còn tham gia quản lý **Consumer Group**.

Ví dụ một topic có 3 partition:

```
Topic: orders

P0 ─────────► Consumer A

P1 ─────────► Consumer B

P2 ─────────► Consumer C
```

Nếu Consumer B bị chết:

```
P0 ─────────► Consumer A
P1 ─────────► Consumer C
P2 ─────────► Consumer A
```

Kafka sẽ thực hiện **rebalance** để phân chia lại partition cho các Consumer còn sống.

Trong các phiên bản Kafka hiện đại, việc điều phối group có thể do **Group Coordinator** đảm nhiệm, và coordinator này nằm trên một broker.

---

#### 5. Quản lý Offset

Kafka cần biết Consumer Group đã đọc đến đâu trong mỗi partition.

Ví dụ:

```
Partition 0

M0  M1  M2  M3  M4  M5  M6
            ↑
          Offset 3
```

Kafka lưu thông tin committed offset trong internal topic:

```
__consumer_offsets
```

Nhờ đó, khi Consumer restart, nó có thể tiếp tục xử lý từ vị trí trước đó thay vì phải đọc lại toàn bộ message.

---

#### 6. Replication và Fault Tolerance

Một trong những điểm mạnh của Kafka Cluster là **replication**.

Ví dụ replication factor = 3:

```
Partition 0

Broker 1 ── Leader
Broker 2 ── Follower
Broker 3 ── Follower
```

Producer gửi message vào Leader:

```
Producer
    │
    ▼
Broker 1
 Leader
    │
    ├────────► Broker 2
    │           Follower
    │
    └────────► Broker 3
                Follower
```

Nếu Broker 1 bị chết, Kafka có thể bầu một Replica khác trở thành Leader.

Điều này giúp hệ thống **không bị mất dữ liệu và vẫn tiếp tục hoạt động** khi một broker gặp sự cố, với điều kiện cluster được cấu hình replication và durability phù hợp.

---

# 1.2. ZooKeeper

**ZooKeeper** là một hệ thống distributed coordination service mã nguồn mở, trước đây được Kafka sử dụng để quản lý một số thông tin metadata và coordination của Kafka Cluster.

Có thể hình dung ZooKeeper giống như một **"trung tâm điều phối"** của Kafka trong kiến trúc cũ:

```
             ZooKeeper
                 │
       ┌─────────┼─────────┐
       │         │         │
       ▼         ▼         ▼
   Broker 1   Broker 2   Broker 3
```

ZooKeeper không trực tiếp nhận hoặc lưu message của Kafka.

Nó chủ yếu hỗ trợ Kafka trong việc **quản lý metadata và coordination giữa các broker**.

### Một số nhiệm vụ của ZooKeeper

#### 1. Theo dõi trạng thái của Broker

ZooKeeper giúp Kafka biết broker nào đang tồn tại trong cluster.

Ví dụ:

```
Broker 1  ✓
Broker 2  ✓
Broker 3  ✗
```

Khi Broker 3 bị mất kết nối, trạng thái của cluster được cập nhật và Kafka có thể thực hiện các hành động cần thiết, chẳng hạn như xử lý leader của partition bị ảnh hưởng.

---

#### 2. Leader Election

Trong kiến trúc Kafka sử dụng ZooKeeper, ZooKeeper tham gia vào quá trình **leader election**.

Ví dụ:

```
Partition 0

Broker 1 ── Leader
Broker 2 ── Replica
Broker 3 ── Replica
```

Nếu Broker 1 chết:

```
Broker 1 ── ✗

Broker 2 ── New Leader
Broker 3 ── Replica
```

Việc lựa chọn leader giúp partition tiếp tục hoạt động mà không cần toàn bộ cluster dừng lại.

---

#### 3. Lưu trữ Metadata và thông tin Cluster

ZooKeeper lưu trữ một số metadata quan trọng liên quan đến Kafka cluster trong kiến trúc cũ, chẳng hạn thông tin về broker, topic/partition và cluster coordination.

Khi cluster có sự thay đổi, các broker có thể nhận biết được thay đổi metadata cần thiết để cập nhật trạng thái của mình.

---

### Một điểm rất quan trọng: Kafka hiện đại không còn phụ thuộc ZooKeeper

Nếu học Kafka hiện nay thì cần phân biệt **Kafka cũ** và **Kafka hiện đại**.

Kafka đã giới thiệu **KRaft (Kafka Raft)** để thay thế ZooKeeper.

Kiến trúc cũ:

```
                ZooKeeper
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
    Broker 1     Broker 2     Broker 3
```

Kiến trúc mới:

```
             Kafka Cluster
        ┌────────┬────────┬────────┐
        │Broker 1│Broker 2│Broker 3│
        │        │        │        │
        │     KRaft Controller    │
        └────────┴────────┴────────┘
```

Với **KRaft**, Kafka tự quản lý metadata và cluster coordination thông qua cơ chế **Raft**, không cần triển khai ZooKeeper riêng.

Vì vậy, nếu bạn đang học Kafka để áp dụng vào project mới, nên tập trung vào:

- **Broker**
- **Topic**
- **Partition**
- **Replica**
- **Leader / Follower**
- **Consumer Group**
- **Offset**
- **Group Coordinator**
- **Controller**
- **KRaft**

thay vì xem ZooKeeper là một thành phần bắt buộc của Kafka.

### Tóm lại

Có thể nhớ kiến trúc Kafka theo cách đơn giản:

```
                    Kafka Cluster
        ┌────────────────────────────────┐
        │                                │
        │  Broker 1   Broker 2   Broker 3│
        │     │          │          │    │
        │     └──────┬───┴──────────┘    │
        │            │                   │
        │        Topic / Partition       │
        │            │                   │
        │       Message Storage          │
        │            │                   │
        └────────────┼───────────────────┘
                     │
                     ▼
              Consumer Group
              ┌──────┼──────┐
              ▼      ▼      ▼
             C1      C2     C3
```

**Broker = nơi Kafka thực sự nhận, lưu trữ và phục vụ message.**

**Consumer Group = cơ chế giúp Kafka phân chia partition cho các Consumer cùng xử lý một workload.**

**Offset = vị trí Consumer đã đọc đến đâu.**

**Replication = cơ chế bảo vệ dữ liệu khi broker gặp sự cố.**

**ZooKeeper = thành phần coordination của kiến trúc Kafka cũ; Kafka hiện đại sử dụng KRaft để thay thế.**