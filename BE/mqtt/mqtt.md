# 📡 MQTT - Tổng quan và Chi tiết Kỹ thuật

## 🧠 1. MQTT là gì?

MQTT (Message Queuing Telemetry Transport) là một **giao thức truyền thông nhẹ**, hoạt động theo mô hình **publish/subscribe**, lý tưởng cho các hệ thống IoT (Internet of Things), thiết bị có băng thông hạn chế hoặc tài nguyên giới hạn.

---

## 🧩 2. Kiến trúc tổng quan

### **Mô hình: Client - Broker**

- **Client**: thiết bị gửi hoặc nhận dữ liệu (Publisher / Subscriber).
- **Broker**: trung tâm điều phối, tiếp nhận và phân phối message.

```
Client A (Publisher) ---> [Broker] ---> Client B (Subscriber)
```

---

## 🧷 3. Cấu trúc một MQTT Message

| Thành phần           | Mô tả |
|----------------------|------|
| **Topic**            | Chuỗi định danh dạng cây phân cấp. |
| **Payload**          | Dữ liệu chính của message (string, JSON, binary...). |
| **QoS**              | Mức đảm bảo truyền tin: 0, 1, 2. |
| **Retain Flag**      | Giữ lại message cuối cùng ở topic đó. |
| **Message ID**       | Dùng khi QoS > 0, để đảm bảo đúng trình tự. |

---

## 🧵 4. Topic trong MQTT

- **Là gì?**: Đường dẫn phân cấp xác định nơi dữ liệu được gửi hoặc nhận.
- **Cú pháp ví dụ**:
  - `home/livingroom/temperature`
  - `factory/line1/machine/status`
- **Không cần khai báo trước** – topic sinh ra khi được dùng.

### Ký tự đại diện (Wildcards):

| Wildcard | Mô tả |
|----------|------|
| `+`      | Đại diện cho **1 tầng** trong topic. |
| `#`      | Đại diện cho **nhiều tầng** (các tầng sau). |

**Ví dụ:**
- `home/+/temperature` → khớp với `home/kitchen/temperature`
- `home/#` → khớp với tất cả topic bắt đầu bằng `home/`

---

## 📶 5. QoS (Quality of Service)

| QoS | Mức độ đảm bảo | Mô tả |
|-----|----------------|------|
| 0   | At most once   | Gửi một lần, không xác nhận. Có thể mất dữ liệu. |
| 1   | At least once  | Gửi lại cho đến khi nhận ACK. Có thể trùng lặp. |
| 2   | Exactly once   | Đảm bảo chỉ một lần duy nhất. Đắt đỏ hơn. |

---

## 📦 6. Payload

- Không giới hạn loại dữ liệu (string, JSON, số, nhị phân...).
- Broker không xử lý nội dung – chỉ truyền tải.

**Ví dụ message:**
```json
{
  "topic": "home/livingroom/temperature",
  "payload": "25.4",
  "qos": 1,
  "retain": false
}
```

---

## 🧷 7. Retain Message

- Nếu `retain = true`, broker sẽ **lưu lại message mới nhất** của topic.
- Khi có client mới subscribe topic đó, sẽ nhận ngay message đã retain.
- Dùng để lưu trạng thái thiết bị hiện tại.

---

## 📣 8. Last Will and Testament (LWT)

- Message dự phòng khi client **mất kết nối đột ngột**.
- Được cấu hình khi CONNECT.
- Broker sẽ tự động gửi message này tới 1 topic nào đó.

**Ví dụ cấu hình LWT:**
```json
{
  "topic": "device/123/status",
  "payload": "offline",
  "qos": 1,
  "retain": true
}
```

---

## 🔐 9. Bảo mật trong MQTT

1. **Username/Password**: xác thực đơn giản khi kết nối.
2. **TLS/SSL**: mã hóa đường truyền.
3. **ACL (Access Control List)**: kiểm soát quyền publish/subscribe.
4. **Client ID**: định danh duy nhất cho mỗi client.

---

## 🔁 10. Keep Alive & Session

- **Keep Alive**: thời gian client duy trì kết nối, nếu không gửi gì thì phải gửi ping.
- Nếu quá thời gian mà không có dữ liệu → broker **ngắt kết nối** và gửi Will message nếu có.

---

## ⚙️ 11. Giao tiếp trong MQTT

Các bước giao tiếp cơ bản:

1. **CONNECT**: Client gửi yêu cầu kết nối.
2. **PUBLISH/SUBSCRIBE**: Gửi dữ liệu hoặc đăng ký nhận.
3. **DISCONNECT**: Ngắt kết nối.

---

## 💻 12. Broker phổ biến

| Broker    | Đặc điểm |
|-----------|----------|
| Mosquitto | Nhẹ, mã nguồn mở, phổ biến nhất |
| HiveMQ    | Thân thiện UI, hỗ trợ cluster |
| EMQX      | Mạnh mẽ, quy mô lớn |
| VerneMQ   | Có khả năng mở rộng tốt |

---

## 📍 13. Ví dụ ứng dụng thực tế

### 🔸 Giám sát nhiệt độ
- Topic: `home/livingroom/temp`
- Payload: `"26.7"`

### 🔸 Theo dõi định vị xe
- Topic: `vehicle/abc123/gps`
- Payload:
```json
{
  "lat": 21.0285,
  "lng": 105.8542
}
```

### 🔸 Cảnh báo cháy
- Topic: `factory/zone1/fire`
- Payload: `"ALERT"`
- QoS: `2`, Retain: `true`

---

## ✅ Tổng kết

- MQTT **nhẹ**, hiệu quả, lý tưởng cho các ứng dụng IoT.
- Giao tiếp qua **topic**, không cần khai báo trước.
- **Broker đóng vai trò trung tâm**, chịu trách nhiệm phân phối dữ liệu.
- Có cơ chế **bảo mật, đảm bảo truyền dữ liệu đúng, đủ và đúng thời điểm**.

---
