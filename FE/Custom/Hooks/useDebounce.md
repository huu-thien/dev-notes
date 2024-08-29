

```ts
import { useEffect, useState } from 'react'

const DEBOUNCE_TIMER = 500

const useDebounce = <T>(value: T, delay: number = DEBOUNCE_TIMER): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
```
