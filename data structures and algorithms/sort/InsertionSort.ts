//Độ phức tạp của trường hợp xấu nhất: O(n^2) 
// => Xayr ra khi mảng tăng dần mà sx giảm dần 
//Độ phức tạp của trường hợp tốt nhất:  O(n)
// => Khi mảng đã được sắp xếp
// Độ phức tạp của trường hợp trung bình:  O(n)



const sample : number[] = [4,1,2,6,8,9,3]

const InsertionSort = (arr: number[]) :number[] => {

    for(let i = 1; i< arr.length; i++) {
        let j = i-1;
        let key = arr[i]

        while( j>=0 && key > arr[j]) {
            arr[j+1] = arr[j];
            j--;
        }
        arr[j+1] = key;
    }
    return arr;
}

console.log(InsertionSort(sample));
