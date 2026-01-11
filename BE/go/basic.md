# 🧭 Lộ trình học Golang 

## 0️⃣ Chuẩn bị môi trường

### Cài đặt

- Go (>= 1.20)
    
- VS Code
    
- Extension **Go (by Go Team at Google)**
    

### Check

```bash
go version
go env
```

---

## 1️⃣ Go Variables (Biến)

### Khai báo biến

```go
var a int = 10
var b = 20
c := 30 // short-hand (xài nhiều nhất)
```

### Quy tắc

- `:=` chỉ dùng **trong function**
    
- Go là **static typed** (kiểu xác định từ đầu)
    

### Zero value

|Type|Zero value|
|---|---|
|int|0|
|string|""|
|bool|false|
|pointer|nil|

---

## 2️⃣ Go Constants (Hằng số)

```go
const PI = 3.14
const (
    StatusOK = 200
    StatusBad = 400
)
```

### iota

```go
const (
    Red = iota
    Green
    Blue
)
```

---

## 3️⃣ Go Output (In ra màn hình)

```go
fmt.Print("Hello")
fmt.Println("Hello")
fmt.Printf("Name: %s, Age: %d", name, age)
```

Format phổ biến:

- `%s` string
    
- `%d` int
    
- `%f` float
    
- `%v` any
    

---

## 4️⃣ Go Data Types (Kiểu dữ liệu)

### Primitive

- int, int64
    
- float32, float64
    
- string
    
- bool
    

### Derived

- array
    
- slice
    
- map
    
- struct
    
- pointer
    

---

## 5️⃣ Go Arrays

```go
var arr [3]int = [3]int{1,2,3}
```

📌 Fixed length, ít dùng trong thực tế

---

## 6️⃣ Go Slices (CỰC KỲ QUAN TRỌNG)

```go
nums := []int{1,2,3}
nums = append(nums, 4)
```

### len & cap

```go
len(nums)
cap(nums)
```

---

## 7️⃣ Go Operators

- Toán học: `+ - * / %`
    
- So sánh: `== != > < >= <=`
    
- Logic: `&& || !`
    

---

## 8️⃣ Go Conditions

```go
if age >= 18 {
    fmt.Println("Adult")
} else {
    fmt.Println("Kid")
}
```

Inline if:

```go
if x := 10; x > 5 {
    fmt.Println(x)
}
```

---

## 9️⃣ Go Switch

```go
switch day {
case 1:
    fmt.Println("Mon")
case 2:
    fmt.Println("Tue")
default:
    fmt.Println("Unknown")
}
```

No break needed 👍

---

## 🔟 Go Loops

### For (Go chỉ có for)

```go
for i := 0; i < 5; i++ {
    fmt.Println(i)
}
```

### While-style

```go
for x < 10 {
    x++
}
```

### Range

```go
for i, v := range nums {
    fmt.Println(i, v)
}
```

---

## 1️⃣1️⃣ Go Functions

```go
func add(a int, b int) int {
    return a + b
}
```

### Multiple return

```go
func swap(a, b int) (int, int) {
    return b, a
}
```

---

## 1️⃣2️⃣ Go Struct

```go
type User struct {
    ID   int
    Name string
}
```

Khởi tạo:

```go
u := User{ID: 1, Name: "Thien"}
```

---

## 1️⃣3️⃣ Go Maps

```go
m := map[string]int{
    "apple":  10,
    "banana": 5,
}
```

Check tồn tại:

```go
v, ok := m["apple"]
```

---

## 📦 Next Level – Go NÂNG CAO 🔥

> Phần này là **linh hồn của Go**. Hiểu xong là đọc code người khác không còn sợ nữa.

---

## 1️⃣ Pointer (Con trỏ)

### Pointer là gì?

👉 Pointer **lưu địa chỉ bộ nhớ** của biến, không phải giá trị.

```go
var a int = 10
var p *int = &a

fmt.Println(a)  // 10
fmt.Println(p)  // địa chỉ
fmt.Println(*p) // 10 (dereference)
```

### Khi nào dùng pointer?

- Truyền giá trị lớn (struct)
    
- Thay đổi giá trị gốc trong function
    
- Tránh copy không cần thiết
    

### Ví dụ thực tế

```go
func updateAge(age *int) {
    *age = 30
}

func main() {
    a := 20
    updateAge(&a)
    fmt.Println(a) // 30
}
```

📌 **Rule nhớ nhanh**:

- `&` lấy địa chỉ
    
- `*` truy cập giá trị
    

---

## 2️⃣ Method & Receiver

### Method là function gắn với struct

```go
type User struct {
    Name string
}

func (u User) SayHello() {
    fmt.Println("Hello", u.Name)
}
```

Gọi:

```go
u := User{Name: "Thien"}
u.SayHello()
```

### Pointer Receiver (quan trọng)

```go
func (u *User) Rename(name string) {
    u.Name = name
}
```

👉 Nếu method **có sửa dữ liệu** → dùng pointer receiver

---

## 3️⃣ Interface (TRÙM CUỐI CỦA GO 👑)

### Interface là gì?

👉 Interface định nghĩa **hành vi**, không phải dữ liệu

```go
type Speaker interface {
    Speak() string
}
```

### Struct implement interface (KHÔNG cần từ khóa implements)

```go
type Human struct {}

func (h Human) Speak() string {
    return "Hello"
}
```

### Dùng interface

```go
func saySomething(s Speaker) {
    fmt.Println(s.Speak())
}

func main() {
    h := Human{}
    saySomething(h)
}
```

📌 **Key idea**: Go dùng **duck typing**

> Có method là được coi là interface đó 😎

---

## 4️⃣ Empty Interface & any

```go
func printAnything(v any) {
    fmt.Println(v)
}
```

(type assertion)

```go
v, ok := data.(string)
```

---

## 5️⃣ Error Handling (style Go)

```go
func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("divide by zero")
    }
    return a / b, nil
}
```

Luôn check error:

```go
res, err := divide(10, 0)
if err != nil {
    log.Fatal(err)
}
```

---

## 6️⃣ Goroutine (CONCURRENCY 🔥)

### Goroutine là gì?

👉 Function chạy **song song**, cực nhẹ

```go
go sayHello()
```

Ví dụ:

```go
func sayHello() {
    fmt.Println("Hello from goroutine")
}

func main() {
    go sayHello()
    time.Sleep(time.Second)
}
```

---

## 7️⃣ Channel (NÓI CHUYỆN GIỮA GOROUTINE)

```go
ch := make(chan int)
```

Send / Receive:

```go
ch <- 10
v := <-ch
```

Ví dụ full:

```go
func worker(ch chan int) {
    ch <- 42
}

func main() {
    ch := make(chan int)
    go worker(ch)
    fmt.Println(<-ch)
}
```

---

## 8️⃣ Buffered Channel

```go
ch := make(chan int, 2)
ch <- 1
ch <- 2
```

---

## 9️⃣ Select (đa channel)

```go
select {
case v := <-ch1:
    fmt.Println(v)
case v := <-ch2:
    fmt.Println(v)
default:
    fmt.Println("no data")
}
```

---

## 🎯 Tổng kết phần nâng cao

|Chủ đề|Mức độ quan trọng|
|---|---|
|Pointer|⭐⭐⭐⭐|
|Interface|⭐⭐⭐⭐⭐|
|Goroutine|⭐⭐⭐⭐⭐|
|Channel|⭐⭐⭐⭐⭐|

---

---

# 🚀 Go Backend với Gin + REST API

> Mục tiêu: làm **API chuẩn production**, dễ test, dễ mở rộng

---

## 1️⃣ Cài Gin

```bash
go get -u github.com/gin-gonic/gin
```

---

## 2️⃣ Cấu trúc project đơn giản

```
go-backend/
│── main.go
│── go.mod
│── handlers/
│   └── user.handler.go
│── services/
│   └── user.service.go
│── models/
│   └── user.go
```

---

## 3️⃣ main.go

```go
package main

import "github.com/gin-gonic/gin"

func main() {
    r := gin.Default()

    r.GET("/ping", func(c *gin.Context) {
        c.JSON(200, gin.H{"message": "pong"})
    })

    r.Run(":8080")
}
```

Run:

```bash
go run main.go
```

Test:

```
GET http://localhost:8080/ping
```

---

## 4️⃣ REST API cơ bản

### Model

```go
package models

type User struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
}
```

### Handler

```go
func GetUser(c *gin.Context) {
    c.JSON(200, models.User{ID: 1, Name: "Thien"})
}
```

---

# 🧱 Clean Architecture với Go

> Tư tưởng: **phụ thuộc đi vào trong**, core không phụ thuộc framework

---

## 1️⃣ Sơ đồ tầng

```
Controller (Handler)
   ↓
Service (Business logic)
   ↓
Repository (Data access)
   ↓
Database
```

---

## 2️⃣ Định nghĩa Interface (repo)

```go
package repositories

import "go-backend/models"

type UserRepository interface {
    FindByID(id int) (*models.User, error)
}
```

---

## 3️⃣ Implement Repository

```go
type UserRepo struct {}

func (r *UserRepo) FindByID(id int) (*models.User, error) {
    return &models.User{ID: id, Name: "Thien"}, nil
}
```

---

## 4️⃣ Service Layer

```go
package services

type UserService struct {
    repo repositories.UserRepository
}

func NewUserService(r repositories.UserRepository) *UserService {
    return &UserService{repo: r}
}

func (s *UserService) GetUser(id int) (*models.User, error) {
    return s.repo.FindByID(id)
}
```

---

## 5️⃣ Handler dùng Service

```go
func GetUserHandler(s *services.UserService) gin.HandlerFunc {
    return func(c *gin.Context) {
        user, _ := s.GetUser(1)
        c.JSON(200, user)
    }
}
```

---

## 6️⃣ Wire mọi thứ trong main.go

```go
repo := &repositories.UserRepo{}
service := services.NewUserService(repo)

r.GET("/users/:id", handlers.GetUserHandler(service))
```

---

## 🎯 Vì sao Clean Architecture xịn?

- Đổi DB không ảnh hưởng service
    
- Test service không cần Gin
    
- Code scale không lo rối
    
