# 📚 Kiến thức về Kubernetes (K8s)

## 1. 🧠 **Khái niệm cơ bản**
- **Kubernetes (K8s)** là một hệ thống mã nguồn mở để tự động hóa việc triển khai, mở rộng quy mô và quản lý các ứng dụng container.
- **Container**: Là một đơn vị phần mềm chứa mã nguồn, thư viện và cấu hình cần thiết để chạy ứng dụng. Kubernetes giúp quản lý các container này trên một hoặc nhiều máy chủ.
- **Cluster**: Là một tập hợp các node (máy chủ) mà Kubernetes quản lý.

## 2. ⚙️ **Các thành phần của Kubernetes**
- **Node**: Một máy chủ trong cluster, có thể là vật lý hoặc ảo. Mỗi node chạy một hoặc nhiều container.
  - **Master Node**: Chịu trách nhiệm điều phối và quản lý cluster.
  - **Worker Node**: Chạy các ứng dụng (containers) trong các pod.
  
- **Pod**: Là đơn vị triển khai nhỏ nhất trong Kubernetes, chứa một hoặc nhiều container. Các container trong cùng một pod chia sẻ cùng một IP, không gian tên mạng và bộ nhớ.
  
- **Service**: Cung cấp một điểm truy cập ổn định cho các pod, cho phép các pod giao tiếp với nhau trong cluster mà không cần phải biết địa chỉ IP của pod.
  
- **Deployment**: Quản lý các bản sao (replicas) của pod, cho phép triển khai và cập nhật các ứng dụng một cách tự động.

- **ReplicaSet**: Đảm bảo rằng một số lượng cố định các bản sao của pod luôn chạy trong cluster.

- **StatefulSet**: Quản lý các ứng dụng có trạng thái, giúp bảo đảm rằng mỗi pod có một định danh duy nhất và ổn định.

- **DaemonSet**: Đảm bảo rằng một pod bản sao chạy trên tất cả hoặc một số node trong cluster.

- **ConfigMap**: Quản lý các cấu hình bên ngoài của ứng dụng.

- **Secret**: Lưu trữ và quản lý các thông tin nhạy cảm như mật khẩu, token API, v.v.

- **Ingress**: Quản lý truy cập vào các dịch vụ trong cluster từ bên ngoài.

## 3. 🌐 **Kubernetes Architecture**
- **Master Node**: Chịu trách nhiệm về các hoạt động điều phối trong cluster như triển khai ứng dụng, theo dõi trạng thái của các node và pod, xử lý các yêu cầu API từ người dùng.
  - **kube-apiserver**: Cung cấp API REST cho các công cụ và client giao tiếp với Kubernetes.
  - **kube-scheduler**: Chịu trách nhiệm sắp xếp pod vào các node phù hợp.
  - **kube-controller-manager**: Giám sát trạng thái của cluster và thực hiện các điều chỉnh như tạo mới hoặc xóa pod khi cần.
  - **etcd**: Lưu trữ cấu hình và trạng thái của cluster.
  
- **Worker Node**: Chạy các container ứng dụng và có các thành phần như:
  - **kubelet**: Quản lý trạng thái của các container trong pod.
  - **kube-proxy**: Quản lý mạng và điều hướng lưu lượng đến các pod.

## 4. 📦 **Quản lý ứng dụng với Kubernetes**
- **Kubectl**: Công cụ dòng lệnh để giao tiếp và quản lý Kubernetes cluster. Bạn có thể sử dụng kubectl để triển khai ứng dụng, kiểm tra trạng thái, xem log, và quản lý các tài nguyên trong cluster.
  
- **Helm**: Quản lý các chart Kubernetes, giúp triển khai và quản lý các ứng dụng phức tạp với cấu hình có thể tái sử dụng.

## 5. 🚀 **Triển khai và Quản lý Ứng dụng**
- **Kubernetes Deployment** giúp bạn triển khai các bản sao của một pod, cập nhật ứng dụng mà không gián đoạn và duy trì độ sẵn sàng của ứng dụng.
  
- **Rolling Update**: Cập nhật các pod theo kiểu cuộn, giúp ứng dụng không bị gián đoạn khi có thay đổi.

- **Horizontal Pod Autoscaling (HPA)**: Tự động mở rộng hoặc thu nhỏ số lượng pod dựa trên các chỉ số như CPU hoặc bộ nhớ.

## 6. 🧑‍💻 **Quản lý mạng trong Kubernetes**
- **Pod Networking**: Mỗi pod trong Kubernetes được cấp một địa chỉ IP duy nhất và có thể giao tiếp với các pod khác trong cùng một cluster.
- **Service Networking**: Kubernetes Service cung cấp một tên DNS ổn định để các pod khác giao tiếp với nhau mà không phải lo về việc thay đổi địa chỉ IP.
  
- **Network Policies**: Xác định cách các pod có thể giao tiếp với nhau và với các nguồn bên ngoài cluster.

## 7. 🔐 **Bảo mật trong Kubernetes**
- **RBAC (Role-Based Access Control)**: Cung cấp quyền truy cập đến các tài nguyên trong Kubernetes dựa trên vai trò của người dùng hoặc service account.
- **Pod Security Policies**: Quản lý bảo mật của các pod, ví dụ như giới hạn quyền truy cập root trong container.
- **Network Policies**: Quản lý kết nối mạng và bảo vệ các pod khỏi các kết nối không mong muốn.

## 8. 📈 **Giám sát và Logging**
- **Prometheus**: Giám sát và thu thập các chỉ số hiệu suất từ các pod và dịch vụ trong Kubernetes.
- **Grafana**: Trình hiển thị và phân tích dữ liệu từ Prometheus để tạo các dashboard trực quan.
- **Fluentd**: Thu thập và xử lý log từ các pod, rồi gửi tới các hệ thống giám sát hoặc lưu trữ log.

## 9. 🔄 **High Availability (HA) và Fault Tolerance**
- **Replication**: Kubernetes cho phép bạn tạo các bản sao của pod để đảm bảo tính sẵn sàng cao và phân tán tải.
- **Pod Disruption Budgets**: Giới hạn số lượng pod có thể bị gián đoạn trong quá trình bảo trì hoặc cập nhật.

## 10. 🚢 **Kubernetes với Cloud Providers**
- **EKS (Elastic Kubernetes Service)**: Kubernetes do AWS cung cấp, dễ dàng triển khai và quản lý cluster Kubernetes.
- **AKS (Azure Kubernetes Service)**: Kubernetes do Microsoft Azure cung cấp, tích hợp với các dịch vụ khác trong Azure.
- **GKE (Google Kubernetes Engine)**: Kubernetes do Google cung cấp, dễ dàng tích hợp với các dịch vụ của Google Cloud.

## 11. 🏗️ **Mô hình triển khai Kubernetes**
- **On-Premise**: Kubernetes có thể được triển khai trên các máy chủ vật lý hoặc ảo trong cơ sở hạ tầng của bạn.
- **Cloud-native**: Các dịch vụ Kubernetes được triển khai trên các nền tảng đám mây như AWS, Azure, hoặc Google Cloud.

## 12. 🔧 **Công cụ và Tính năng Nâng cao trong Kubernetes**

### **Kubernetes Operator**
- **Operator** là một mô hình triển khai ứng dụng tự động hóa trong Kubernetes, cho phép quản lý các ứng dụng và dịch vụ phức tạp theo cách tự động.
- Operators giám sát trạng thái của ứng dụng và thực hiện các tác vụ quản lý, chẳng hạn như sao lưu, khôi phục hoặc mở rộng ứng dụng.

### **Kubernetes Volumes**
- **Volume** trong Kubernetes cho phép bạn lưu trữ dữ liệu bên ngoài container để dữ liệu không bị mất khi pod bị xóa hoặc thay đổi.
- Có nhiều loại volume khác nhau, bao gồm:
  - **emptyDir**: Tạo một thư mục tạm thời trên mỗi node, dữ liệu sẽ bị mất khi pod bị xóa.
  - **hostPath**: Liên kết dữ liệu giữa hệ thống tệp của node và pod.
  - **persistentVolume (PV)** và **persistentVolumeClaim (PVC)**: Làm việc với các hệ thống lưu trữ lâu dài bên ngoài Kubernetes.

### **Kubernetes Namespace**
- **Namespace** giúp tổ chức tài nguyên trong một cluster Kubernetes, cho phép phân chia cluster thành các không gian làm việc riêng biệt.
- Các ứng dụng khác nhau có thể được triển khai trong các namespace khác nhau để cách ly chúng với nhau.

### **Tolerations và Affinity**
- **Tolerations** cho phép pods chạy trên các node có taint (một dấu hiệu cho các node bị giới hạn cho các pod nhất định).
- **Affinity** cho phép bạn chỉ định các yêu cầu và ưu tiên về nơi mà pods có thể được triển khai trong một node hoặc giữa các node khác nhau.
  - **Node Affinity**: Quy định rằng pod phải chạy trên những node có nhãn nhất định.
  - **Pod Affinity/Anti-affinity**: Định nghĩa các quy tắc về cách các pod khác nhau có thể hoặc không thể chia sẻ node.

## 13. 🌍 **Mạng và Kết nối trong Kubernetes**

### **CNI (Container Network Interface)**
- Kubernetes sử dụng **CNI (Container Network Interface)** để cấu hình và quản lý mạng cho các container trong cluster.
- Các plugin CNI như **Calico**, **Weave**, **Flannel**, hoặc **Cilium** giúp cấu hình mạng cho các pod và hỗ trợ các tính năng như bảo mật mạng, mở rộng và định tuyến.

### **Network Policies**
- **Network Policy** cho phép bạn kiểm soát lưu lượng mạng giữa các pod trong cluster. Bạn có thể tạo ra các chính sách để chỉ cho phép giao tiếp giữa các pod và ngăn chặn những kết nối không mong muốn.
- Các chính sách có thể xác định các điều kiện về nguồn và đích (các pod, namespace) và các cổng dịch vụ.

## 14. 🔄 **Scalability và High Availability**

### **Horizontal Pod Autoscaling (HPA)**
- **HPA** cho phép tự động điều chỉnh số lượng bản sao của pod dựa trên các chỉ số như CPU, bộ nhớ, hoặc các chỉ số tuỳ chỉnh (custom metrics).
- HPA giúp mở rộng hoặc thu nhỏ số lượng pod theo yêu cầu ứng dụng, giúp duy trì hiệu suất và giảm chi phí.

### **Vertical Pod Autoscaling (VPA)**
- **VPA** tự động điều chỉnh tài nguyên (CPU và bộ nhớ) của pod để đáp ứng yêu cầu của ứng dụng khi có thay đổi về tải.

### **Cluster Autoscaler**
- **Cluster Autoscaler** giúp tự động mở rộng hoặc thu nhỏ số lượng node trong cluster để đáp ứng nhu cầu tài nguyên của các pod. Nếu các pod không thể được triển khai vì thiếu tài nguyên, Cluster Autoscaler sẽ thêm node vào cluster.

### **Pod Disruption Budgets (PDB)**
- **PDB** giúp đảm bảo rằng một số lượng tối thiểu pod vẫn duy trì trong trạng thái chạy trong quá trình bảo trì hoặc cập nhật. Điều này giúp đảm bảo ứng dụng có sẵn trong quá trình bảo trì.

## 15. 🚢 **Continuous Deployment (CD) với Kubernetes**

### **Kubernetes và CI/CD Pipelines**
- **CI/CD** (Continuous Integration/Continuous Deployment) có thể được tích hợp với Kubernetes để tự động hóa các bước triển khai phần mềm.
- Các công cụ như **Jenkins**, **GitLab CI**, **ArgoCD**, và **Tekton** giúp triển khai ứng dụng liên tục trong Kubernetes, từ việc build code cho đến việc kiểm thử và triển khai lên các môi trường sản xuất.
- **Helm Charts** có thể được sử dụng trong CD để quản lý các cấu hình ứng dụng, giúp triển khai các ứng dụng nhanh chóng và dễ dàng.

### **ArgoCD**
- **ArgoCD** là một công cụ CD mạnh mẽ dành cho Kubernetes, giúp triển khai các ứng dụng từ các repository Git và quản lý cấu hình.

## 16. 💻 **Quản lý và Giám sát trong Kubernetes**

### **Prometheus và Grafana**
- **Prometheus** là một hệ thống giám sát và cảnh báo mã nguồn mở, tích hợp mạnh mẽ với Kubernetes để thu thập các chỉ số hiệu suất từ các pod và dịch vụ.
- **Grafana** được sử dụng để trực quan hóa dữ liệu thu thập từ Prometheus, tạo các dashboard giúp theo dõi trạng thái của cluster.

### **EFK Stack (Elasticsearch, Fluentd, Kibana)**
- **EFK** là một giải pháp phổ biến để thu thập, xử lý và phân tích log trong Kubernetes.
  - **Fluentd** thu thập log từ các pod và gửi chúng đến **Elasticsearch**.
  - **Kibana** giúp trực quan hóa và phân tích các log từ Elasticsearch.

### **Kubernetes Dashboard**
- **Kubernetes Dashboard** là một giao diện web giúp quản lý và giám sát Kubernetes cluster, các pod, deployment, service và các tài nguyên khác trong cluster.

## 17. 🔐 **Bảo mật trong Kubernetes**

### **Kubernetes RBAC (Role-Based Access Control)**
- **RBAC** trong Kubernetes giúp kiểm soát quyền truy cập vào các tài nguyên dựa trên vai trò của người dùng hoặc service account.
- Bạn có thể tạo các **Role** và **ClusterRole** để xác định quyền truy cập, và **RoleBinding** hoặc **ClusterRoleBinding** để gán các quyền đó cho các user hoặc group.

### **Pod Security Policies (PSP)**
- **Pod Security Policies** cho phép bạn định nghĩa các quy tắc bảo mật cho các pod, chẳng hạn như cấm sử dụng quyền root hoặc yêu cầu các pod chạy với các quyền tối thiểu.
- Tuy nhiên, từ Kubernetes 1.21, PSP đã bị loại bỏ và sẽ được thay thế bởi các giải pháp bảo mật mới hơn.

### **Secrets Management**
- **Secrets** trong Kubernetes giúp bảo mật và lưu trữ các thông tin nhạy cảm như mật khẩu, chứng chỉ SSL, hoặc token API mà không cần phải lưu trữ chúng trong mã nguồn hoặc trong file cấu hình.
- Kubernetes hỗ trợ các công cụ bảo mật như **Vault** từ HashiCorp để quản lý Secrets.

## 18. 📈 **Kubernetes và Microservices**

- Kubernetes là nền tảng lý tưởng để triển khai và quản lý các ứng dụng microservices. Kubernetes giúp quản lý các dịch vụ nhỏ, dễ mở rộng và thay thế, hỗ trợ load balancing, rolling updates, và scaling theo yêu cầu.
- Các công cụ như **Istio** cung cấp các khả năng như điều phối dịch vụ (service mesh), quản lý lưu lượng và bảo mật cho các microservices trong Kubernetes.

