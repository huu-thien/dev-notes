---
tags: dotnet 
---
### Async/Await

- hàm async thường có kiểu trả về là `Task`, `Task<T>` (tránh void)
- await phải dùng với Task
- khi gặp await: chuyển hướng sang thread chính và chờ task hoàn thành 
	- khi gọi await nó cũng return task -> không cần return task trong hàm (vẫn cần return giá trị trả về của task nếu có) và tránh lock hàm (như task.Wait()) 
	- khi task hoàn thành thì các công việc còn lại trong hàm vẫn được thực thi như bình thường
- await có giá trị trả về là kết quả trả về của task

- Xem thêm về xử lí lỗi, và các ví dụ dùng `await` với Task: [](../Intern%20tech%20notes/Asynchronous%20programming.md#Async%20&%20await%7CAsync%20&%20await)