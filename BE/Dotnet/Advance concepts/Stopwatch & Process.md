---
tags: dotnet 
---
### Stopwatch and Process

- Stopwatch
    - `StartNew()`
    - `Restart()`: resets the elapsed time to zero and then starts the timer
    - `Stop()`
    - `Elapsed`
    - `ElapsedMilliseconds`
- Process
    - `GetCurrentProcess()`
    - `VirtualMemorySize64`: amount of virtual memory, in bytes, allocated for the process
    - `WorkingSet64`: amount of physical memory, in bytes, allocated for the process
- để kiểm tra performance có thể dùng BenchmarkDotnet