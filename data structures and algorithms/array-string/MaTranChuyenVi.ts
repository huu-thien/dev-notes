const transposeMatrix = (matrix: number[][]): number[][] => {
  const rows: number = matrix.length;
  const cols: number = matrix[0].length;

  const transposeMatrix: number[][] = [];
  for (let col = 0; col < cols; col++) {
    const newRow: number[] = [];
    for (let row = 0; row < rows; row++) {
      newRow.push(matrix[row][col]);
    }
    transposeMatrix.push(newRow);
  }
  return transposeMatrix;
};

const matrix: number[][] = [
  [2, 3],
  [1, 2],
  [3, 4],
  [5, 6],
];

console.log(transposeMatrix(matrix));
