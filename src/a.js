module.export = "gaoqiang";

class B {
  b = 1; // 实例上(某一对象)中的a属性
}
let classTest = new B();
console.log(classTest);

// generator函数
function* gen(params) {
  yield 1;
}
console.log(gen().next());
