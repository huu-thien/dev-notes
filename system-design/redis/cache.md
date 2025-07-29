# 📦 Cache là gì?

**Cache** là vùng lưu trữ tạm thời giúp tăng tốc độ truy xuất dữ liệu bằng cách lưu lại bản sao của dữ liệu thường xuyên được sử dụng.

- Cache có thể nằm ở nhiều tầng: trình duyệt, CDN, RAM, Redis, CPU,...
- Mục tiêu: giảm độ trễ (latency), giảm tải cho hệ thống gốc (DB, API,...)

---

# 🧠 Các chiến lược Caching phổ biến

## 📖 Read Cache Strategies

### 1. Cache Aside (Lazy Loading)

- Ứng dụng **kiểm tra cache** → nếu miss, **truy xuất DB** → lưu vào cache.
- Cache được làm mới chỉ khi có request.

**✅ Ưu điểm**:
- Không cache dữ liệu không cần thiết.
- Cache gần với DB (fresh).

**❌ Nhược điểm**:
- Cache miss → truy vấn chậm.
- Ứng dụng phải xử lý cache logic.

**🟢 Dùng khi**:
- Dữ liệu thay đổi thường xuyên.
- Muốn kiểm soát thời điểm cache.

---

### 2. Read Through

- Ứng dụng **luôn gọi cache**, cache **tự lấy từ DB** khi miss.
- Cache hoạt động như một proxy layer.

**✅ Ưu điểm**:
- Đơn giản hóa ứng dụng (logic nằm trong cache layer).
- Tự động làm mới cache.

**❌ Nhược điểm**:
- Có thể cache dữ liệu ít dùng.
- Phụ thuộc vào middleware/cache adapter.

**🟢 Dùng khi**:
- Muốn tách biệt hoàn toàn cache logic.
- Có hệ thống cache hỗ trợ sẵn.

---

## ✍️ Write Cache Strategies

### 3. Write Through

- Ứng dụng ghi **vào cache**, cache sẽ **ghi ngay xuống DB**.
- Ghi hai nơi, đảm bảo đồng bộ.

**✅ Ưu điểm**:
- Dữ liệu luôn nhất quán giữa cache và DB.
- Đọc ngay sau ghi sẽ trúng cache.

**❌ Nhược điểm**:
- Ghi chậm hơn (2 bước).
- Cache thành bottleneck nếu ghi quá nhiều.

**🟢 Dùng khi**:
- Hệ thống cần **data consistency cao**.
- Ghi không quá thường xuyên.

---

### 4. Write Around

- Ứng dụng ghi **trực tiếp vào DB**, **bỏ qua cache**.
- Cache sẽ được cập nhật trong lần đọc sau (lazy update).

**✅ Ưu điểm**:
- Tránh làm bẩn cache.
- Tối ưu cho ghi nhiều, đọc ít.

**❌ Nhược điểm**:
- Lần đọc đầu sẽ **cache miss**.
- Dễ inconsistency nếu không đồng bộ nhanh.

**🟢 Dùng khi**:
- Hệ thống ghi nhiều nhưng ít khi đọc lại ngay.
- Không cần đọc ngay dữ liệu vừa ghi.

---

### 5. Write Back (Write Behind)

- Ứng dụng ghi vào cache → cache sẽ **ghi xuống DB sau (async)**.
- Dữ liệu sẽ được ghi theo lô hoặc sau một khoảng thời gian.

**✅ Ưu điểm**:
- Tốc độ ghi cực nhanh.
- Tốt cho workload write-intensive.

**❌ Nhược điểm**:
- Nguy cơ **mất dữ liệu** nếu cache crash.
- DB sẽ bị **trễ cập nhật** (eventual consistency).

**🟢 Dùng khi**:
- Có thể chấp nhận mất dữ liệu tạm thời.
- Yêu cầu tốc độ ghi rất cao (VD: logging, metrics, queue buffering...).

---

# 🧾 So sánh tổng quát

| Trường hợp sử dụng          | Read Cache                 | Write Cache                       |
| --------------------------- | -------------------------- | --------------------------------- |
| Đọc nhiều, ghi ít           | Cache Aside / Read Through | Write Through                     |
| Ghi nhiều, đọc ít           | Không cần Read Cache       | Write Around                      |
| Ghi rất nhiều, cần tốc độ   | -                          | Write Back (cẩn thận mất dữ liệu) |
| Cần dữ liệu mới & chính xác | Read Through               | Write Through                     |
| Muốn kiểm soát cache logic  | Cache Aside                | Write Around                      |

---

# 🧠 Ghi nhớ nhanh

- `Cache Aside`: Chủ động đọc rồi cache. → **Linh hoạt**
- `Read Through`: Cache tự đọc DB nếu miss. → **Tiện lợi**
- `Write Through`: Ghi vào cache & DB cùng lúc. → **An toàn**
- `Write Around`: Ghi thẳng DB, cache cập nhật sau. → **Hiệu quả**
- `Write Back`: Ghi vào cache, DB cập nhật sau. → **Rủi ro cao, tốc độ cao**

---

# 📌 Bonus: Những lưu ý khi dùng cache

- Luôn xác định **TTL (Time to Live)** hợp lý.
- Cần cơ chế **cache invalidation** để tránh stale data.
- Đo lường tỷ lệ **cache hit/miss** để tối ưu chiến lược.

