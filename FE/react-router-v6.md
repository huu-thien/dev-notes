# 1. Link và NavLink

- NavLink có thể check active được

```typescript
<NavLink
  to='/staff/add'
  className={({ isActive }) => {
    const activeClass = isActive ? 'border-blue-600 text-blue-600' : ''
    return `active inline-block rounded-t-lg border-b-2 p-4 ${activeClass}`
  }}
  aria-current='page'
>
  Add
</NavLink>
```

- props `replace` của thẻ `NavLink & Link` -> không lưu vào stack history

# Nested Route

```typescript
function App() {
  return (
    <div className='App'>
      <MainLayout>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/about' element={<About />} />
          <Route path='/staff' element={<Staff />}>
            <Route path=':id' element={<StaffItem />} />
            <Route path='add' element={<AddStaff />} />
            <Route index element={<StaffList />} />
          </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </MainLayout>
    </div>
  )
}
```

- trong 1 số trường hợp chúng ta muốn khi vào trong staff thì vào thẳng staff/list luôn thì dùng `index` thay cho `path`

# Tách nested route vào một component khác

- useLocation() : Lấy được location hiện tại của Routes
- useRoutes() : một cách khai báo route khác

```typescript
import * as React from 'react'
import { useRoutes } from 'react-router-dom'

function App() {
  let element = useRoutes([
    {
      path: '/',
      element: <Dashboard />,
      children: [
        {
          path: 'messages',
          element: <DashboardMessages />
        },
        { path: 'tasks', element: <DashboardTasks /> }
      ]
    },
    { path: 'team', element: <AboutPage /> }
  ])

  return element
}
```

# Navigate trong react router

- Nếu người dùng nhập những route không tồn tại, chúng ta muốn redirect về trang home thì dùng `<Navigate />`

```typescript
import React, { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      navigate('/')
      // navigate(-1) go back
    }, 2000)
  }, [navigate])

  return <div>Not found</div>
}
// Nếu người dùng nhập những route không tồn tại thì ở trang Not Found, sau 2 giây thì về trang home
```

# Giao tiếp các page với nhau qua state

- Có thể giao tiếp giữa 2 page bằng state thông qua useNavigate và useLocation

```typescript
// Page not found
import React, { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      navigate('/', {
        state: 'Redirect from not found'
      })
    }, 2000)
  }, [navigate])

  return <div>Not found</div>
```

```typescript
// page dashboard
import { useLocation } from 'react-router-dom'

export default function Dashboard() {
  const location = useLocation()
  console.log(location)

  return (
    <div>
      <h1 className='mb-6 text-lg'>Dashboard</h1>
      <p className='text-cyan-800'>{location.state}</p>
    </div>
  )
}
```

# 2 cách xử lý query string trên url

- Dùng hook của react-router-dom : useSearchParams
- Cách 1: dùng js

```typescript
import About from 'pages/About'
import Dashboard from 'pages/Dashboard'
import NotFound from 'pages/NotFound'
import Staff from 'pages/Staff'
import { Routes, Route, useLocation, useSearchParams } from 'react-router-dom'

function App() {
  // const location = useLocation()
  // console.log(location)
  const [searchParams] = useSearchParams()
  console.log('searchParams', Object.fromEntries([...searchParams]))

  return (
    <div className='App'>
      <MainLayout>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/about' element={<About />} />
          <Route path='/staff/*' element={<Staff />}>
            {/* <Route path=':id' element={<StaffItem />} />
            <Route path='add' element={<AddStaff />} />
            <Route index element={<StaffList />} /> */}
          </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </MainLayout>
    </div>
  )
}

export default App
```

- Cách 2: dùng thư viện query-string
- https://www.npmjs.com/package/query-string/v/7.1.0
