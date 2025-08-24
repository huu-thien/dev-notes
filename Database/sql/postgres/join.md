## Toán Tử JOIN

### Các Loại JOIN

| Loại JOIN              | Mô Tả                                                                                                                                                                                                                                                                                                                            | Ví Dụ                                                                                                                                                                                                                          |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **FULL JOIN**          | Kết hợp tất cả các hàng từ hai bảng dựa trên một điều kiện join cụ thể. Bao gồm tất cả các hàng từ cả hai bảng, với các giá trị NULL cho các cột không có sự tương ứng. Thích hợp khi bạn muốn giữ lại tất cả dữ liệu từ cả hai bảng và biết rõ các mối quan hệ giữa chúng.                                                      | `sql<br>SELECT e.name AS employee_name, d.department_name<br>FROM departments d<br>FULL JOIN employees e ON d.department_id = e.department_id;`                                                                                |
| **CROSS JOIN**         | Kết hợp mọi hàng từ bảng đầu tiên với mọi hàng từ bảng thứ hai mà không cần điều kiện. Tạo ra kết quả là tích Cartesian, có thể dẫn đến số lượng hàng kết quả rất lớn nếu một trong các bảng có số lượng hàng lớn. Thích hợp khi bạn cần tất cả các kết hợp có thể có giữa hai bảng, nhưng không phụ thuộc vào điều kiện cụ thể. | `sql<br>SELECT e.name AS employee_name, d.department_name<br>FROM employees e<br>CROSS JOIN departments d;`                                                                                                                    |
| **CROSS JOIN LATERAL** | Giống với CROSS JOIN nhưng CROSS JOIN LATERAL cho phép thêm điều kiện cụ thể trong truy vấn.                                                                                                                                                                                                                                     | `sql<br>SELECT e.name AS employee_name, dept_info.department_name<br>FROM employees e<br>CROSS JOIN LATERAL (<br>SELECT d.department_name<br>FROM departments d<br>WHERE d.department_id = e.department_id<br>) AS dept_info;` |

### Ví Dụ Bổ Sung

1. **FULL JOIN**:
   ```sql
   SELECT e.name AS employee_name, d.department_name
   FROM departments d
   FULL JOIN employees e ON d.department_id = e.department_id;
   ```

````
- `Mô Tả`: Kết hợp thông tin về nhân viên và bộ phận, bao gồm cả những nhân viên không thuộc bộ phận nào và những bộ phận không có nhân viên.

2. **CROSS JOIN**:
 ```sql
  SELECT e.name AS employee_name, d.department_name
  FROM employees e
  CROSS JOIN departments d;
````

- `Mô Tả`: Tạo ra tất cả các kết hợp giữa nhân viên và bộ phận mà không cần điều kiện nào.

3. **CROSS JOIN LATERAL**:
   ```sql
   SELECT e.name AS employee_name, dept_info.department_name
    FROM employees e
      CROSS JOIN LATERAL (
      SELECT d.department_name
      FROM departments d
      WHERE d.department_id = e.department_id
    ) AS dept_info;
   ```

```
- `Mô Tả`: Truy vấn các bộ phận tương ứng cho mỗi nhân viên, cho phép điều kiện để lọc kết quả dựa trên thông tin của nhân viên.
```
