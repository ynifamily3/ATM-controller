function sum(a: number, b: number) {
  return a + b;
}

test("1+2는 3", () => {
  expect(sum(1, 2)).toBe(3);
});
