# Glossary — Thuật ngữ Kafka chuẩn hoá

> Mục đích: đảm bảo **toàn bộ study pack dùng thuật ngữ nhất quán**. Khi viết lesson, luôn giữ nguyên **English
> term** làm chính (in đậm lần đầu xuất hiện trong mỗi file), kèm mô tả tiếng Việt. Không tự ý dịch thuật ngữ kỹ
> thuật sang tiếng Việt (ví dụ: không dịch "broker" thành "môi giới").

Quy tắc chung:
- Luôn viết thuật ngữ gốc tiếng Anh, **không phiên âm, không dịch nghĩa đen**.
- Mô tả tiếng Việt phải giải thích được **bản chất**, không chỉ định nghĩa từ điển.
- Nếu một thuật ngữ có nhiều cách hiểu tùy ngữ cảnh (ví dụ "replica" vs "follower"), phải ghi rõ rule phân biệt.

---

### broker
Một tiến trình Kafka server, chịu trách nhiệm lưu trữ dữ liệu (partition) và phục vụ request đọc/ghi từ
producer/consumer. Một cluster gồm nhiều broker.

### cluster
Tập hợp nhiều broker phối hợp với nhau, chia sẻ tải và cung cấp tính sẵn sàng cao (high availability).

### topic
Một danh mục logic để phân loại message, giống "bảng" trong database nhưng là append-only log. Một topic được
chia thành nhiều partition.

### partition
Đơn vị lưu trữ và song song hoá thực sự của Kafka. Mỗi partition là một append-only log, có thứ tự tuyệt đối
bên trong nó. **Rule**: khi nói về "ordering trong Kafka", luôn phải chỉ rõ là ordering **trong một partition**,
không phải trong toàn topic.

### offset
Số thứ tự (index) của một message trong một partition, tăng dần và không đổi (immutable) sau khi ghi. Dùng để
xác định vị trí đọc của consumer.

### leader
Partition replica chịu trách nhiệm xử lý mọi request đọc/ghi cho partition đó tại một thời điểm. Mỗi partition
có đúng 1 leader tại một thời điểm.

### follower
Partition replica sao chép (replicate) dữ liệu từ leader, không phục vụ ghi trực tiếp (mặc định), sẵn sàng trở
thành leader khi cần failover.

### replica
Tên gọi chung cho một bản sao của partition — bao gồm cả leader và follower. **Rule**: "replica" là tập hợp,
"leader"/"follower" là vai trò cụ thể của một replica tại một thời điểm.

### ISR (In-Sync Replicas)
Tập hợp các replica (bao gồm leader) đang đồng bộ đầy đủ với leader trong giới hạn thời gian cho phép
(`replica.lag.time.max.ms`). Chỉ replica trong ISR mới đủ điều kiện được bầu làm leader mới khi failover (trừ
khi bật `unclean.leader.election`).

### consumer group
Tập hợp các consumer instance cùng chia sẻ việc đọc một hoặc nhiều topic, mỗi partition chỉ được đọc bởi **đúng
một** consumer instance trong cùng group tại một thời điểm.

### rebalance
Quá trình phân phối lại partition cho các consumer trong cùng consumer group, xảy ra khi có consumer
join/leave/crash hoặc thay đổi số lượng partition.

### retention
Chính sách giữ dữ liệu trong topic theo thời gian (`retention.ms`) hoặc dung lượng (`retention.bytes`), sau đó
dữ liệu cũ bị xoá (nếu không phải compacted topic).

### compaction (log compaction)
Cơ chế giữ lại **bản ghi mới nhất cho mỗi key**, xoá các bản ghi cũ hơn cùng key, dùng cho use case dạng
"latest state" (ví dụ changelog, CDC snapshot) thay vì giữ toàn bộ lịch sử.

### idempotence (idempotent producer)
Cơ chế đảm bảo producer gửi lại (retry) một message không tạo ra **duplicate** trên broker, nhờ producer ID +
sequence number. Đây là điều kiện cần (không phải đủ) cho exactly-once.

### transactions (transactional producer)
Cơ chế cho phép ghi atomically vào **nhiều partition/topic** (và phối hợp với consumer offset commit), dùng để
đạt được exactly-once semantics trong luồng read-process-write.

### exactly-once semantics (EOS)
Đảm bảo mỗi message được xử lý và có hiệu lực (effect) **đúng một lần**, kể cả khi có retry/failure. Trong
Kafka, đạt được nhờ kết hợp idempotent producer + transactions + consumer đọc ở mức `read_committed`. **Rule**:
luôn giải thích rõ EOS áp dụng trong phạm vi nào (Kafka-to-Kafka), không phải EOS toàn hệ thống end-to-end nếu
có side effect ra hệ thống ngoài (DB, HTTP call...).

### throughput
Lượng dữ liệu/message xử lý được trong một đơn vị thời gian (ví dụ MB/s, messages/s). Trade-off thường gặp:
throughput cao thường đánh đổi với latency thấp.

### latency
Thời gian từ khi message được gửi đến khi nó khả dụng để đọc (hoặc được xử lý xong), tuỳ ngữ cảnh (produce
latency, end-to-end latency).

### backpressure
Hiện tượng downstream (consumer, hệ thống xử lý) không theo kịp tốc độ dữ liệu đến, buộc phải có cơ chế làm
chậm producer hoặc buffer/queue dữ liệu lại.

### hot partition
Một partition nhận lượng traffic (ghi hoặc đọc) không cân xứng so với các partition khác trong cùng topic,
thường do key phân bổ không đều, gây nghẽn cổ chai cục bộ dù cluster tổng thể vẫn còn tài nguyên.

### lag (consumer lag)
Khoảng cách giữa offset mới nhất được ghi vào partition (log end offset) và offset mà consumer group đã xử lý
xong (committed offset). Lag cao là dấu hiệu chính của việc consumer xử lý không kịp.

### schema evolution
Việc thay đổi cấu trúc dữ liệu (schema) của message theo thời gian mà vẫn đảm bảo tương thích ngược/xuôi
(backward/forward compatibility) giữa producer và consumer cũ/mới.

### CDC (Change Data Capture)
Kỹ thuật capture các thay đổi (insert/update/delete) từ database và phát ra dưới dạng event stream, thường dùng
Kafka Connect + Debezium làm hạ tầng truyền tải.

### partitioner
Thành phần phía producer quyết định một message sẽ được ghi vào **partition nào** trong topic — mặc định dựa
trên hash của key (nếu có key) hoặc round-robin/sticky (nếu không có key). **Rule**: khi giải thích ordering,
luôn phải nhắc tới partitioner vì đây là nơi quyết định message nào rơi vào cùng partition.

### log end offset (LEO)
Offset của vị trí ghi mới nhất trong một partition — tức "điểm cuối" hiện tại của log. Khác với **committed
offset**, LEO không liên quan tới consumer group nào, nó là thuộc tính của chính partition.

### committed offset
Offset mà một **consumer group cụ thể** đã xác nhận xử lý xong, được lưu lại (thường ở internal topic
`__consumer_offsets`). **Rule**: luôn gắn "committed offset" với một consumer group cụ thể — không có khái niệm
"committed offset" chung cho toàn bộ partition mà không gắn với group nào.

### current position
Offset tiếp theo mà consumer sẽ **fetch** trong lần `poll()` kế tiếp — khác với **committed offset** (offset
consumer đã xác nhận xử lý xong). Current position luôn ≥ committed offset trong một phiên xử lý bình thường;
khoảng cách giữa hai giá trị này chính là vùng rủi ro duplicate/loss nếu consumer crash giữa chừng.

### sticky partitioner
Chiến lược mặc định (từ Kafka 2.4+) của partitioner khi message **không có key** — thay vì rải đều từng message
một theo round-robin, sticky partitioner "dính" vào 1 partition cho tới khi batch hiện tại đầy hoặc `linger.ms`
hết hạn, rồi mới chuyển sang partition khác. **Rule**: khi giải thích vì sao no-key message vẫn đạt batching
hiệu quả, phải nhắc tới sticky partitioner, không chỉ nói "round-robin".

### in-flight requests
Số lượng request producer đã gửi tới broker nhưng **chưa nhận được response** (ack hoặc lỗi). Cấu hình qua
`max.in.flight.requests.per.connection`. **Rule**: khi giải thích ordering có thể bị phá vỡ do retry, luôn gắn
với khái niệm in-flight requests — vì đó chính là điều kiện để 2 batch "vượt mặt" nhau khi 1 trong 2 phải retry.

### static membership
Cơ chế (`group.instance.id`) cho phép một consumer instance giữ **cùng 1 định danh thành viên** trong consumer
group qua các lần restart, giúp coordinator không kích hoạt rebalance ngay khi instance đó khởi động lại nhanh
(ví dụ rolling deploy). **Rule**: static membership không loại bỏ rebalance hoàn toàn — nó chỉ tránh rebalance
**không cần thiết** khi restart nằm trong khoảng `session.timeout.ms`.

### isolation.level
Cấu hình phía consumer quyết định consumer có đọc được message thuộc transaction **chưa commit** hay không.
`read_committed` chỉ trả về message thuộc transaction đã commit thành công; `read_uncommitted` (mặc định) trả
về mọi message kể cả message thuộc transaction sẽ bị abort. **Rule**: đây là mảnh ghép bắt buộc phải nhắc khi
giải thích exactly-once semantics ở phía consumer.

### min.insync.replicas
Config ở topic/broker quy định **số lượng replica tối thiểu trong ISR** phải xác nhận ghi thành công thì
`acks=all` mới trả ack cho producer. **Rule**: đây là mảnh ghép bắt buộc phải nhắc kèm `acks=all` — nếu không đặt
`min.insync.replicas ≥ 2` (với replication factor 3), ISR có thể co lại còn 1 (chỉ leader) mà `acks=all` vẫn ack
bình thường, khiến durability thực tế suy biến về mức tương đương `acks=1`.

### unclean leader election
Việc bầu một replica **ngoài ISR** (đã lỡ đồng bộ, có thể thiếu dữ liệu) làm leader mới khi không còn replica
nào trong ISR khả dụng. Bật qua `unclean.leader.election.enable=true`. **Rule**: đây là quyết định đánh đổi
availability (cluster tiếp tục nhận ghi) lấy durability (có thể mất dữ liệu đã ack trước đó) — phải được quyết
định trước khi có sự cố, không phải trong lúc xử lý incident.

### sequence number (producer)
Số thứ tự tăng dần được idempotent producer gắn vào mỗi batch gửi tới **một partition cụ thể**, dùng kèm
producer ID để broker nhận diện và loại bỏ batch trùng lặp do retry. **Rule**: sequence number chỉ có ý nghĩa
trong phạm vi 1 producer ID + 1 partition, không phải một số toàn cục.

### producer ID (PID)
Định danh duy nhất được broker cấp cho một producer session khi bật `enable.idempotence=true`. Producer restart
sẽ nhận PID mới, khiến broker coi dữ liệu gửi lại là **hoàn toàn mới** (không nhận diện được là duplicate ở tầng
này). **Rule**: luôn nhắc PID đi kèm sequence number khi giải thích idempotent producer — PID xác định "phiên",
sequence number xác định "vị trí trong phiên đó".

### transaction marker
Bản ghi đặc biệt (COMMIT hoặc ABORT) được transaction coordinator ghi vào **mọi partition liên quan** khi một
transaction kết thúc. Consumer đọc ở `read_committed` dùng marker này để quyết định có trả record về ứng dụng
hay không. **Rule**: record vẫn nằm vật lý trên đĩa trước khi marker xuất hiện — marker không "xóa" dữ liệu, nó
chỉ quyết định tính **hiển thị** với consumer `read_committed`.

### segment (log segment)
Một partition trên đĩa được chia thành nhiều file segment, mỗi segment gồm bộ ba file `.log`/`.index`/
`.timeindex`; chỉ segment **active** (mới nhất) mới nhận ghi. **Rule**: retention/compaction xóa theo **toàn bộ
segment**, không xóa từng message lẻ — dữ liệu có thể tồn tại lâu hơn `retention.ms` một chút nếu segment chứa
nó chưa roll xong.

### sparse index (offset index / time index)
Cấu trúc index không lưu **mọi** offset mà chỉ lưu một số mốc cách nhau theo `log.index.interval.bytes`, tra
cứu bằng binary search tới mốc gần nhất rồi scan tuần tự một đoạn ngắn. **Rule**: đây là lý do Kafka tra cứu
theo offset/thời gian gần như hằng số thời gian dù log rất lớn, mà không cần index đầy đủ tốn bộ nhớ/đĩa.

### zero-copy
Kỹ thuật hệ điều hành (`sendfile` syscall) cho phép broker gửi dữ liệu từ page cache thẳng ra network socket mà
không cần copy qua user-space của tiến trình Kafka. **Rule**: đây là một trong ba trụ cột (cùng sequential I/O
và page cache) giải thích vì sao Kafka đạt throughput cao khi đọc dữ liệu.

### rebalance storm
Chuỗi rebalance liên tiếp tự tái tạo lẫn nhau: xử lý chậm → rebalance (pause cả group) → lag tích lũy trong lúc
pause → vòng xử lý kế tiếp càng chậm hơn → rebalance tiếp. **Rule**: khi chẩn đoán, phải tìm **nguyên nhân gốc**
gây chậm ban đầu (không chỉ tăng `session.timeout.ms`/`max.poll.interval.ms` để "che" triệu chứng).

### cooperative rebalancing
Chiến lược rebalance (`CooperativeStickyAssignor`, Kafka 2.4+) chỉ thu hồi/gán lại **các partition thực sự thay
đổi chủ sở hữu**, thay vì bắt toàn bộ group dừng và gán lại từ đầu như eager rebalancing. **Rule**: cooperative
rebalancing giảm **phạm vi** ảnh hưởng của mỗi lần rebalance, nhưng không loại bỏ việc rebalance xảy ra hay xử lý
nguyên nhân gốc gây ra nó.

### hotspot / hot partition key
Trường hợp một hoặc vài giá trị **key** chiếm tỷ trọng traffic vượt trội so với phần còn lại, khiến toàn bộ
traffic dồn vào đúng 1 partition (do cùng key luôn hash vào cùng partition). **Rule**: đây là vấn đề **key
design** (cardinality/độ lệch phân bổ giá trị key), không phải vấn đề **partition count** — tăng số partition
không tự động chữa được hotspot loại này.

### composite key
Kỹ thuật ghép nhiều thành phần vào 1 key (ví dụ `tenant_id + bucket_number`) để vừa giữ được ordering tương đối
theo entity gốc, vừa phân tán traffic ra nhiều partition hơn nhằm tránh hotspot khi entity đó có skew traffic
tự nhiên cao. **Rule**: composite key làm **nới lỏng** ordering từ "toàn bộ entity gốc" xuống "từng bucket con"
— phải xác nhận nghiệp vụ chấp nhận được mức nới lỏng này trước khi áp dụng.

### schema compatibility (backward / forward / full)
Quy tắc kiểm soát schema evolution: **backward compatible** trả lời "consumer mới có đọc được data do producer
cũ ghi không" (an toàn để nâng cấp consumer trước); **forward compatible** trả lời "consumer cũ có đọc được
data do producer mới ghi không" (an toàn để nâng cấp producer trước); **full compatible** là cả hai chiều đều
đúng (an toàn nâng cấp theo bất kỳ thứ tự nào, nhưng giới hạn nhiều nhất những gì được phép thay đổi).

### DLQ (Dead Letter Queue)
Topic riêng dùng để cô lập các message **không thể xử lý được** dù đã retry hợp lý (do lỗi cấu trúc dữ liệu,
vi phạm business rule, hoặc lỗi cố hữu khác), nhằm không chặn các message khác phía sau. **Rule**: DLQ chỉ có
giá trị khi đi kèm quy trình vận hành (alerting, dashboard, runbook xử lý/replay) — không có quy trình xử lý,
DLQ chỉ là nơi dữ liệu lỗi tích tụ vô thời hạn mà không ai biết.

### retry topic pattern
Kỹ thuật xử lý lỗi tạm thời bằng cách publish message lỗi sang 1 topic riêng (có thể nhiều tầng với delay tăng
dần), rồi commit offset ở topic chính ngay lập tức — thay vì giữ nguyên offset chưa commit để retry trong
process (cách này chặn toàn bộ partition cho tới khi retry xong). **Rule**: đánh đổi mất ordering tuyệt đối
giữa message được retry và message mới, để đổi lấy việc không chặn xử lý các message không liên quan.

### poison message
Message **luôn luôn lỗi** dù retry bao nhiêu lần (khác với lỗi tạm thời có khả năng tự phục hồi), thường do dữ
liệu sai định dạng hoặc vi phạm business rule không thể xử lý được bằng logic hiện tại. **Rule**: nên phát hiện
và đẩy thẳng sang DLQ **không cần retry**, vì retry chắc chắn sẽ lỗi y hệt và chỉ lãng phí tài nguyên/thời gian.

### idempotency key (application-level)
Định danh do **ứng dụng tự quản lý** (khác với producer ID/sequence number ở tầng Kafka), dùng để phát hiện và
bỏ qua việc xử lý trùng lặp một side effect (ví dụ gọi API thanh toán, gửi email). **Rule**: idempotent producer
(`enable.idempotence`) chỉ đảm bảo không ghi trùng vào Kafka — không đảm bảo consumer không xử lý trùng 1
message hợp lệ; cần idempotency key riêng ở tầng ứng dụng cho mọi side effect không tự nhiên idempotent, đặc
biệt side effect đi ra ngoài Kafka.

### integration event vs command
Hai loại thông điệp có ngữ nghĩa khác nhau trong kiến trúc event-driven: **integration event** mô tả "một sự
thật đã xảy ra" (`OrderPlaced`), phù hợp tự nhiên với mô hình pub-sub của Kafka, producer không cần biết ai
consume; **command** mô tả "một yêu cầu hành động" (`ChargeCustomer`), thường cần phản hồi rõ ràng về thành
công/thất bại. **Rule**: publish command qua Kafka vẫn được nhưng cần tự xây cơ chế phản hồi (reply topic,
correlation ID, timeout) — không tự nhiên có sẵn như trong integration event.

### eventual consistency (trong bối cảnh event-driven)
Trạng thái mà các service khác nhau **tạm thời nhìn thấy dữ liệu khác nhau** vì mỗi service cập nhật state độc
lập dựa trên event nhận được, thay vì có 1 transaction chung xuyên suốt. **Rule**: đây là hệ quả **không tránh
khỏi** của kiến trúc event-driven qua Kafka, cần thiết kế compensating action (hoàn tác) cho các race condition
phát sinh — không phải lỗi cần "sửa cho hết", mà là đặc tính cần thiết kế cho.

### choreography vs orchestration
Hai mô hình điều phối luồng nghiệp vụ nhiều bước trong microservices: **choreography** — mỗi service tự phản
ứng với event nhận được, không ai "chỉ huy" toàn cảnh (tự nhiên với Kafka pub-sub, nhưng khó trace luồng phức
tạp); **orchestration** — 1 service điều phối trung tâm gọi tuần tự các service khác (dễ trace/rollback, nhưng
giảm bớt decoupling thuần tuý). **Rule**: choreography phù hợp luồng đơn giản, orchestration phù hợp luồng phức
tạp nhiều bước cần kiểm soát rollback rõ ràng.

### connector / task / worker (Kafka Connect)
Ba khái niệm phân lớp của Kafka Connect: **connector** là cấu hình logic mức cao (kết nối hệ thống nào, topic
nào, transform gì) — không tự xử lý dữ liệu; **task** là đơn vị thực thi song song thực sự, do connector sinh
ra; **worker** là tiến trình JVM chạy task, nhiều worker hợp thành 1 Connect cluster. **Rule**: số task hữu ích
phụ thuộc khả năng chia nhỏ công việc của **chính connector đó**, không phải cấu hình chung chung — tăng task
không tự động tăng song song hoá nếu connector không chia nhỏ được.

### SMT (Single Message Transform)
Cơ chế transform nhẹ áp dụng cho **từng message độc lập** khi đi qua Kafka Connect (đổi tên field, mask dữ
liệu, route theo điều kiện đơn giản). **Rule**: SMT chỉ nên dùng cho transform cấu trúc đơn giản trên 1 message
— nhu cầu join/state/gọi API enrich là dấu hiệu cần chuyển sang Kafka Streams hoặc consumer application riêng.

### distributed mode vs standalone mode (Kafka Connect)
Hai chế độ chạy Connect worker: **standalone** lưu offset/config ở file cục bộ, không chịu lỗi, chỉ hợp dev/
test; **distributed** lưu offset/config trên Kafka topic nội bộ, chia sẻ giữa nhiều worker, chịu lỗi và scale
được. **Rule**: production luôn nên dùng distributed mode kể cả khi chỉ chạy 1 worker, vì trạng thái không phụ
thuộc file cục bộ.

### state store (Kafka Streams)
Kho lưu trữ trạng thái **cục bộ** (thường là RocksDB) trong mỗi instance Kafka Streams, dùng cho các phép xử lý
stateful (aggregate, join, windowing). **Rule**: state store cho tốc độ đọc/ghi cực nhanh (không round-trip
mạng), nhưng cần được sao lưu liên tục vào **changelog topic** để có thể phục hồi khi instance crash/restart.

### changelog topic (Kafka Streams)
Topic Kafka nội bộ mà Kafka Streams dùng để **sao lưu mọi thay đổi** trên state store cục bộ — cho phép rebuild
state store từ đầu bằng cách replay changelog khi instance restart hoặc chuyển sang máy khác. **Rule**: thời
gian phục hồi sau crash tỷ lệ thuận kích thước state đã tích luỹ trong changelog, đây là chi phí vận hành thật
cần tính vào capacity planning.

### KStream vs KTable (Kafka Streams / ksqlDB)
Hai mô hình dữ liệu cốt lõi: **KStream** là chuỗi sự kiện độc lập, bất biến (mỗi record = 1 sự kiện đã xảy ra);
**KTable** là trạng thái hiện tại theo key (record mới ghi đè giá trị cũ cùng key, tương đương kết quả của
aggregation). **Rule**: nhầm lẫn ngữ nghĩa 2 khái niệm này (đặc biệt khi join) là nguyên nhân phổ biến khiến
kết quả stream processing sai mà không có lỗi rõ ràng.

### outbox pattern
Kỹ thuật ghi event nghiệp vụ vào 1 bảng "outbox" trong **cùng transaction DB** với thay đổi dữ liệu nghiệp vụ,
sau đó dùng CDC (ví dụ Debezium) đọc bảng outbox để phát event ra Kafka. **Rule**: giải quyết rủi ro dual-write
(ghi DB thành công nhưng publish Kafka thất bại hoặc ngược lại) bằng cách tận dụng tính atomic sẵn có của
transaction DB, thay vì tự cài đặt 2-phase commit giữa DB và Kafka.

### snapshot phase vs streaming phase (CDC)
Hai giai đoạn bắt buộc của mọi pipeline CDC: **snapshot phase** đọc toàn bộ dữ liệu hiện có của bảng để tạo
baseline (vì transaction log không giữ lịch sử vô hạn); **streaming phase** sau đó đọc liên tục transaction log
từ đúng điểm snapshot kết thúc. **Rule**: snapshot của bảng lớn có thể gây tải đáng kể lên DB nguồn, cần lên kế
hoạch (giờ thấp điểm, incremental snapshot) chứ không bật CDC production tuỳ tiện.

### tombstone event
Message có value là `null` cho 1 key nhất định, dùng để biểu thị **record đã bị xoá** — quan trọng trong cả log
compaction (xoá key khỏi compacted topic) lẫn CDC (phản ánh delete từ database). **Rule**: downstream tiêu thụ
CDC/compacted topic bắt buộc phải xử lý tường minh tombstone event; bỏ sót khiến dữ liệu đã xoá ở nguồn "sống"
vĩnh viễn ở downstream (cache, search index).

---

### under-replicated partition (URP)
Partition có ít nhất 1 replica trong danh sách assigned replicas **chưa nằm trong ISR** (chưa đồng bộ kịp
leader). **Rule**: đây là tín hiệu vận hành quan trọng nhất cần theo dõi liên tục — URP > 0 kéo dài (không chỉ
thoáng qua khi rolling restart) là dấu hiệu sớm của broker quá tải, network chậm, hoặc disk pressure, và làm
giảm độ an toàn dữ liệu (ít replica sẵn sàng failover hơn).

### page cache
Vùng nhớ RAM mà hệ điều hành dùng để cache dữ liệu file đọc/ghi gần đây; Kafka **cố tình dựa vào page cache**
của OS thay vì tự quản lý cache riêng, tận dụng sequential I/O và cho phép consumer đọc dữ liệu gần đây trực
tiếp từ RAM thay vì disk. **Rule**: khi retention dài hơn nhiều so với RAM khả dụng, dữ liệu cũ buộc phải đọc từ
disk (cache miss), làm tăng đáng kể latency và disk I/O so với đọc dữ liệu gần đây — đây là lý do "low-volume
nhưng retention dài" vẫn có thể tốn kém về hiệu năng đọc.

### SASL (Simple Authentication and Security Layer)
Khung cơ chế **authentication** (xác minh danh tính client) cho Kafka, gồm nhiều mechanism cụ thể (`PLAIN`,
`SCRAM`, `GSSAPI`/Kerberos, `OAUTHBEARER`). **Rule**: SASL chỉ giải quyết "bạn là ai", không tự động mã hoá dữ
liệu trên đường truyền — cần kết hợp với TLS để bảo vệ credential khỏi bị nghe lén (đặc biệt với `PLAIN`).

### mTLS (mutual TLS)
Biến thể TLS mà **cả 2 phía** (client và broker) đều verify certificate của nhau, thay vì chỉ client verify
broker (TLS một chiều thông thường). **Rule**: mTLS vừa mã hoá dữ liệu (encryption) vừa xác minh danh tính
client (authentication) trong cùng 1 cơ chế — principal của client thường được suy ra từ Distinguished Name
trong certificate.

### ACL (Access Control List)
Cơ chế **authorization** của Kafka, quy định 1 principal được phép thực hiện operation nào (`READ`/`WRITE`/
`DESCRIBE`/`ALTER`...) trên resource nào (topic, consumer group, cluster). **Rule**: luôn đánh giá theo tổ hợp
`(principal, resource, operation)`; nên thiết kế theo least privilege và theo prefix pattern gắn với naming
convention topic, không cấp quyền rộng "cho tiện".

### principal
Danh tính đã được xác thực (qua SASL hoặc mTLS) của 1 client, dùng làm chủ thể để đánh giá ACL. **Rule**: nên
thiết kế 1 principal riêng cho mỗi service (không dùng chung), để authorization chính xác theo từng service và
có khả năng audit/thu hồi quyền độc lập khi cần.

### rolling restart / rolling upgrade
Kỹ thuật khởi động lại hoặc nâng cấp từng broker **một tại một thời điểm** (không dừng toàn cluster), dựa vào
cơ chế leader failover sang replica khác trong ISR khi broker đang restart tạm thời rời cluster. **Rule**: chỉ
an toàn khi ISR đang khoẻ mạnh (under-replicated partitions = 0) trước khi bắt đầu; không restart nhiều broker
cùng lúc.

### version skew (client-broker)
Tình trạng client và broker chạy các phiên bản Kafka chênh lệch nhau, có thể xảy ra tạm thời (trong lúc rolling
upgrade — bình thường, được thiết kế để hoạt động) hoặc kéo dài (nợ kỹ thuật tích luỹ rủi ro). **Rule**: version
skew tạm thời an toàn nhờ wire protocol có versioning; skew kéo dài với nhiều version chênh lệch lớn nên được
coi là rủi ro cần dọn dẹp, không phải trạng thái ổn định nên duy trì lâu dài.

### canary rollout (upgrade)
Chiến lược upgrade/thay đổi cấu hình bằng cách áp dụng cho **1 phần nhỏ** hệ thống trước (ví dụ 1 broker), theo
dõi metric trong 1 khoảng thời gian đủ dài, rồi mới mở rộng dần ra phần còn lại. **Rule**: canary + staged
rollout giúp phát hiện vấn đề sớm với blast radius nhỏ, đổi lại tổng thời gian upgrade dài hơn so với upgrade
đồng loạt.

### actual loss vs perceived loss
Phân biệt quan trọng khi điều tra "mất message": **actual loss** là message thực sự không còn tồn tại trong
log Kafka (do ack yếu, unclean leader election); **perceived loss** là message vẫn còn nguyên trong Kafka
nhưng bị bỏ qua do lỗi commit timing hoặc logic xử lý ở consumer. **Rule**: luôn đọc trực tiếp partition theo
offset/timestamp (không qua consumer group hiện tại) để xác nhận loại nào trước khi kết luận nguyên nhân.

### member churn
Hiện tượng consumer instance trong 1 group liên tục join/leave (do restart, timeout, hoặc bị coi là chết), mỗi
lần đều kích hoạt 1 lần rebalance. **Rule**: member churn lặp lại liên tục (không phải 1 lần đơn lẻ) là dấu
hiệu của **rebalance storm** — cần tìm trigger gốc (deploy pattern, slow poll, session timeout quá chặt) thay
vì chỉ tăng timeout để che giấu triệu chứng.

### dual-write problem
Rủi ro mất tính nhất quán khi 1 nghiệp vụ cần ghi vào **2 hệ thống độc lập** (ví dụ: database và Kafka) mà
không có transaction chung tự nhiên giữa chúng — có thể ghi thành công ở 1 hệ thống nhưng thất bại ở hệ thống
còn lại. **Rule**: outbox pattern là giải pháp phổ biến để loại bỏ dual-write problem mà không cần 2-phase
commit phức tạp — ghi business change và event vào cùng 1 transaction database, dùng CDC đọc lại và publish.

### event-carried state transfer
Kiểu thiết kế event mang theo **đầy đủ dữ liệu cần thiết** để consumer xử lý độc lập, không cần gọi ngược lại
service nguồn để lấy thêm chi tiết (khác với event chỉ mang ID). **Rule**: giảm coupling runtime giữa các
service, đổi lại message size lớn hơn và dữ liệu trong event có thể "cũ" hơn dữ liệu mới nhất ở nguồn tại thời
điểm consumer xử lý.

> Danh sách này sẽ được **mở rộng dần** khi các phần lesson chi tiết (đặc biệt `08-learning-aids`) được sinh
> ra. Mọi thuật ngữ mới xuất hiện trong lesson phải được bổ sung vào đây trước khi lesson đó được coi là hoàn
> chỉnh (xem `QUALITY-CHECKLIST.md`).
