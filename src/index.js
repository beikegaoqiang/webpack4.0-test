console.log("Hello World");
// 模块化语法引入JS文件
require("./a.js"); // ！！！使用UglifyJsPlugin压缩JS时在此处会报语法错误，需babel配置ES6→ES5
// 模块化语法引入css文件
require("./index.css"); // 也可import引入，但是最终是在head中生成script标签，而不是style标签
// 模块化语法引入less文件
require("./index.less");
require("@babel/polyfill");

// 箭头函数（ES6语法）：需配置babel将更高级的语法转换成ES5语法（@babel/preset-env）
let fun = () => {
  console.log(123);
};
fun();

// class（ES7语法）：@babel/plugin-proposal-class-properties
// 装饰器装饰class类：@babel/plugin-proposal-decorators、@babel/plugin-proposal-class-properties
@log
class A {
  a = 1; // 实例上(某一对象)中的a属性
}
let classTest = new A();
console.log(classTest);

// ！！！装饰器就是个函数，在定义时候触发。且如果是装饰class类，那么第一个参数就是类
function log(target) {
  console.log(target, "decorator");
}

// "aaa".includes("a");

// ************全局变量引入问题，以指代jquery的变量$为例：
// expose-loader：全局变量的引用问题，希望变量可以挂在到window上。  注：是内联Loader，可直接在项目代码中使用
// loader分类：前置的loader(pre); 后置的loader(post); 普通的loader; 内联的loader
// import $ from "expose-loader?$!jquery"; // 方式一：把jquery以$的形式暴露给window
import test from "jquery"; // 方式二：在webpack.config.js中去配置expose-loader
console.log(test, "jquery"); // 一般情况下能正常打印出$，但不能打印出window.$
console.log($, "jquery");
console.log(window.test, "window"); // 正常情况下会打印出undefied,因window对象下没有，需使用expose-loader进行暴露

// 图片引入方式一：在js中创建图片引入
import logo from "./dog.png"; // ！需导入图片文件，返回的结果是一个新的图片地址
let image = new Image();
// image.src = "./logo.png"  只会被解析成字符串，而不是图片文件，需导入图片文件
image.src = logo;
document.body.appendChild(image);
