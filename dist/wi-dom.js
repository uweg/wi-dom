module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/lib.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/elements.ts":
/*!*************************!*\
  !*** ./src/elements.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = __webpack_require__(/*! ./helper */ "./src/helper.ts");
class ElementBase {
}
exports.ElementBase = ElementBase;
class HtmlElement {
    constructor(name, args, children) {
        this.name = name;
        this.args = args;
        this.children = children;
        this.renderString = async (context) => {
            let renderedChildren = "";
            for (let i = 0; i < this.children.length; i++) {
                const c = this.children[i];
                const newContext = context.slice();
                newContext.push(i);
                renderedChildren += await c.renderString(newContext);
            }
            let argsString = "";
            const args = await this.renderArgs(context);
            for (const key of Object.keys(args)) {
                argsString += ` ${key}="${args[key]}"`;
            }
            return `<${this.name}${argsString}>${renderedChildren}</${this.name}>`;
        };
    }
    async renderArgs(context) {
        const result = {};
        return result;
    }
    async renderNode(context) {
        const result = document.createElement(this.name);
        for (let i = 0; i < this.children.length; i++) {
            const c = this.children[i];
            const newContext = context.slice();
            newContext.push(i);
            result.appendChild(await c.renderNode(newContext));
        }
        const args = await this.renderArgs(context);
        for (const key of Object.keys(args)) {
            result.setAttribute(key, args[key]);
        }
        return result;
    }
}
exports.HtmlElement = HtmlElement;
class HtmlBlockElement extends HtmlElement {
    constructor(name, args, children) {
        super(name, args, children);
    }
    async renderArgs(context) {
        const result = {};
        if (this.args.title !== undefined) {
            result.title = this.args.title;
        }
        const styles = [
            ...(this.args.style === undefined ? [] : [this.args.style]),
            ...(this.args.dynStyle === undefined ? [] : [this.args.dynStyle(null)]),
        ];
        if (styles.length > 0) {
            result.style = styles.join(" ");
        }
        if (this.args.id !== undefined) {
            result.id = this.args.id;
        }
        const classes = [
            ...(this.args.class === undefined ? [] : this.args.class),
            ...(this.args.dynClass === undefined ? [] : this.args.dynClass(null)),
        ].filter((c) => c !== null);
        if (classes.length > 0) {
            result.class = classes.join(" ");
        }
        if (this.args.data !== undefined) {
            for (const key in this.args.data) {
                result[`data-${key}`] = this.args.data[key];
            }
        }
        const addEvent = (event, jsEvent) => {
            if (this.args[event] !== undefined) {
                const m = helper_1.contextToString(jsEvent, context);
                result[event] = `__handle.${m}()`;
                if (typeof window !== "undefined") {
                    window.__handle[m] = this.args[event];
                }
            }
        };
        addEvent("onClick", "click");
        addEvent("onMouseEnter", "mouseenter");
        addEvent("onMouseLeave", "mouseleave");
        addEvent("onMouseOver", "mouseover");
        if (this.args.onClick !== undefined) {
            const m = helper_1.contextToString("click", context);
            result.onClick = `__handle.${m}()`;
            if (typeof window !== "undefined") {
                window.__handle[m] = this.args.onClick;
            }
        }
        return result;
    }
    async renderNode(context) {
        const node = await super.renderNode(context);
        if (this.args.dynClass !== undefined) {
            const _this = this;
            async function update() {
                if (_this.args.dynClass !== undefined) {
                    const classes = [
                        ...(_this.args.class === undefined ? [] : _this.args.class),
                        ..._this.args.dynClass(update),
                    ];
                    node.className = classes.filter((c) => c !== null).join(" ");
                }
            }
            await update();
        }
        if (this.args.dynStyle !== undefined) {
            const _this = this;
            async function update() {
                if (_this.args.dynStyle !== undefined) {
                    const s = _this.args.dynStyle(update);
                    node.setAttribute("style", s);
                }
            }
            await update();
        }
        return node;
    }
}
exports.HtmlBlockElement = HtmlBlockElement;
/**
 * Page
 */
class Page {
    constructor(body) {
        this.body = body;
    }
}
exports.Page = Page;
function page(body) {
    return new Page(body);
}
exports.page = page;
/**
 * Html
 */
class Html extends HtmlElement {
    constructor(head, body) {
        super("html", {}, [head, body]);
    }
}
function html(head, body) {
    return new Html(head, body);
}
exports.html = html;
class Head extends HtmlElement {
    constructor(children) {
        super("head", {}, children);
    }
}
function head(children) {
    return new Head(children);
}
exports.head = head;
/**
 * Body
 */
class Body extends HtmlElement {
    constructor(args, children) {
        super("body", args, children);
    }
}
exports.Body = Body;
function body(args, children) {
    return new Body(args, children);
}
exports.body = body;
class Script extends HtmlElement {
    constructor(args) {
        super("script", args, []);
    }
    async renderArgs(context) {
        let result = await super.renderArgs(context);
        if (this.args.defer === true) {
            result.defer = "";
        }
        if (this.args.async === true) {
            result.async = "";
        }
        result.src = this.args.src;
        return result;
    }
}
function script(args) {
    return new Script(args);
}
exports.script = script;
class Meta extends HtmlElement {
    constructor(args) {
        super("meta", args, []);
    }
    async renderArgs(context) {
        const result = await super.renderArgs(context);
        result.charset = this.args.charset;
        return result;
    }
}
function meta(args) {
    return new Meta(args);
}
exports.meta = meta;
class Link extends HtmlElement {
    constructor(args) {
        super("link", args, []);
    }
    async renderArgs(context) {
        const result = await super.renderArgs(context);
        result.rel = this.args.rel;
        result.href = this.args.href;
        return result;
    }
}
function link(args) {
    return new Link(args);
}
exports.link = link;
/**
 * Div
 */
class Div extends HtmlBlockElement {
    constructor(args, children) {
        super("div", args, children);
    }
}
function div(args, children) {
    return new Div(args, children);
}
exports.div = div;
class P extends HtmlBlockElement {
    constructor(args, children) {
        super("p", args, children);
    }
}
function p(args, children) {
    return new P(args, children);
}
exports.p = p;
class Strong extends HtmlBlockElement {
    constructor(args, children) {
        super("strong", args, children);
    }
}
function strong(args, children) {
    return new Strong(args, children);
}
exports.strong = strong;
class Span extends HtmlBlockElement {
    constructor(args, children) {
        super("span", args, children);
    }
}
function span(args, children) {
    return new Span(args, children);
}
exports.span = span;
class Img extends HtmlBlockElement {
    constructor(args) {
        super("img", args, []);
    }
    async renderArgs(context) {
        const result = await super.renderArgs(context);
        result.src = this.args.src;
        return result;
    }
}
function img(args) {
    return new Img(args);
}
exports.img = img;
/**
 * Br
 */
class Br extends HtmlBlockElement {
    constructor() {
        super("br", {}, []);
    }
}
function br() {
    return new Br();
}
exports.br = br;
class A extends HtmlBlockElement {
    constructor(args, children) {
        super("a", args, children);
    }
    async renderArgs(context) {
        const result = await super.renderArgs(context);
        const link = (await this.args.link);
        const str = link[1]
            .map((l) => "/" + encodeURIComponent(JSON.stringify(l)))
            .join("");
        result.href = link[0] + str;
        return result;
    }
}
exports.A = A;
function a(args, children) {
    return new A(args, children);
}
exports.a = a;
class Button extends HtmlBlockElement {
    constructor(args, content) {
        super("button", args, [new Text(content)]);
    }
}
exports.Button = Button;
function button(args, content) {
    return new Button(args, content);
}
exports.button = button;
/**
 * Input
 */
class Input extends HtmlBlockElement {
    constructor(args, value) {
        super("input", args, []);
        this.value = value;
    }
    async renderArgs(context) {
        let result = await super.renderArgs(context);
        const m = helper_1.contextToString("input", context);
        result.value = helper_1.escapeXml(this.value.get(null));
        result.onInput = `__handle.${m}(event)`;
        if (typeof window !== "undefined") {
            window.__handle[m] = (e) => {
                this.value.set(e.currentTarget.value);
            };
        }
        return result;
    }
}
exports.Input = Input;
function input(args, value) {
    return new Input(args, value);
}
exports.input = input;
/**
 * TextArea
 */
class TextArea extends HtmlBlockElement {
    constructor(args, value) {
        super("textarea", args, []);
        this.value = value;
    }
    async renderArgs(context) {
        let result = await super.renderArgs(context);
        const m = helper_1.contextToString("input", context);
        result.value = helper_1.escapeXml(this.value.get(null));
        result.onInput = `__handle.${m}(event)`;
        if (typeof window !== "undefined") {
            window.__handle[m] = (e) => {
                this.value.set(e.currentTarget.value);
            };
        }
        return result;
    }
}
exports.TextArea = TextArea;
function textarea(args, value) {
    return new TextArea(args, value);
}
exports.textarea = textarea;
class Table extends HtmlBlockElement {
    constructor(args, children) {
        super("table", args, children);
    }
}
exports.Table = Table;
function table(args, children) {
    return new Table(args, children);
}
exports.table = table;
class THead extends HtmlBlockElement {
    constructor(args, children) {
        super("thead", args, children);
    }
}
exports.THead = THead;
function thead(args, children) {
    return new THead(args, children);
}
exports.thead = thead;
class TBody extends HtmlBlockElement {
    constructor(args, children) {
        super("tbody", args, children);
    }
}
exports.TBody = TBody;
function tbody(args, children) {
    return new TBody(args, children);
}
exports.tbody = tbody;
class Tr extends HtmlBlockElement {
    constructor(args, children) {
        super("tr", args, children);
    }
}
exports.Tr = Tr;
function tr(args, children) {
    return new Tr(args, children);
}
exports.tr = tr;
class Td extends HtmlBlockElement {
    constructor(args, children) {
        super("td", args, children);
    }
    async renderArgs(context) {
        const result = await super.renderArgs(context);
        if (this.args.colspan !== undefined) {
            result.colspan = this.args.colspan.toString();
        }
        return result;
    }
}
exports.Td = Td;
function td(args, children) {
    return new Td(args, children);
}
exports.td = td;
class Th extends HtmlBlockElement {
    constructor(args, children) {
        super("th", args, children);
    }
}
exports.Th = Th;
function th(args, children) {
    return new Th(args, children);
}
exports.th = th;
/**
 * Text
 */
class Text extends ElementBase {
    constructor(text) {
        super();
        this.text = text;
        this.renderString = async () => helper_1.escapeXml(this.text);
        this.renderNode = async () => document.createTextNode(this.text);
    }
}
exports.Text = Text;
function text(text) {
    return new Text(text);
}
exports.text = text;
/**
 * Dyn
 */
class Dyn extends ElementBase {
    constructor(signal) {
        super();
        this.signal = signal;
        this.node = null;
        this.context = [];
        this.renderPending = false;
        this.update = async () => {
            if (!this.renderPending) {
                this.renderPending = true;
                requestAnimationFrame(async () => {
                    this.renderPending = false;
                    const element = this.node;
                    if (element !== null) {
                        const newNode = await this.renderNode(this.context);
                        element.replaceWith(newNode);
                    }
                });
            }
        };
        this.renderString = async (context) => {
            const element = await this.signal(null);
            return element.renderString(context);
        };
        this.renderNode = async (context) => {
            this.context = context;
            const element = await this.signal(this.update);
            const node = await element.renderNode(context);
            // if (this.node === null) {
            this.node = node;
            // }
            return node;
        };
    }
}
exports.Dyn = Dyn;
function dyn(signal) {
    return new Dyn(signal);
}
exports.dyn = dyn;


/***/ }),

/***/ "./src/helper.ts":
/*!***********************!*\
  !*** ./src/helper.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function contextToString(event, context) {
    return `${event}_${context.map(c => c.toString()).join("_")}`;
}
exports.contextToString = contextToString;
function escapeXml(input) {
    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}
exports.escapeXml = escapeXml;


/***/ }),

/***/ "./src/lib.ts":
/*!********************!*\
  !*** ./src/lib.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var value_1 = __webpack_require__(/*! ./value */ "./src/value.ts");
exports.Value = value_1.Value;
var elements_1 = __webpack_require__(/*! ./elements */ "./src/elements.ts");
exports.a = elements_1.a;
exports.body = elements_1.body;
exports.img = elements_1.img;
exports.br = elements_1.br;
exports.button = elements_1.button;
exports.div = elements_1.div;
exports.dyn = elements_1.dyn;
exports.head = elements_1.head;
exports.html = elements_1.html;
exports.input = elements_1.input;
exports.link = elements_1.link;
exports.meta = elements_1.meta;
exports.p = elements_1.p;
exports.page = elements_1.page;
exports.script = elements_1.script;
exports.span = elements_1.span;
exports.strong = elements_1.strong;
exports.table = elements_1.table;
exports.tbody = elements_1.tbody;
exports.td = elements_1.td;
exports.text = elements_1.text;
exports.textarea = elements_1.textarea;
exports.th = elements_1.th;
exports.thead = elements_1.thead;
exports.tr = elements_1.tr;
exports.ElementBase = elements_1.ElementBase;


/***/ }),

/***/ "./src/value.ts":
/*!**********************!*\
  !*** ./src/value.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Value {
    constructor(initial) {
        this.context = [];
        this.get = (context) => {
            if (context !== null && this.context.indexOf(context) === -1) {
                this.context.push(context);
            }
            return this.value;
        };
        this.set = (value) => {
            this.value = value;
            for (const c of this.context) {
                c();
            }
        };
        this.value = initial;
    }
}
exports.Value = Value;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VsZW1lbnRzLnRzIiwid2VicGFjazovLy8uL3NyYy9oZWxwZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdmFsdWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ2xGQSx3RUFBc0Q7QUFpQnRELE1BQXNCLFdBQVc7Q0FJaEM7QUFKRCxrQ0FJQztBQUVELE1BQXNCLFdBQVc7SUFJL0IsWUFDVSxJQUFZLEVBQ1YsSUFBVyxFQUNiLFFBQXFCO1FBRnJCLFNBQUksR0FBSixJQUFJLENBQVE7UUFDVixTQUFJLEdBQUosSUFBSSxDQUFPO1FBQ2IsYUFBUSxHQUFSLFFBQVEsQ0FBYTtRQVMvQixpQkFBWSxHQUFHLEtBQUssRUFBRSxPQUFpQixFQUFF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QixDQUFDLENBQUM7UUFFRixRQUFHLEdBQUcsQ0FBQyxLQUFRLEVBQUUsRUFBRTtZQUNqQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUVuQixLQUFLLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQzVCLENBQUMsRUFBRSxDQUFDO2FBQ0w7UUFDSCxDQUFDLENBQUM7UUFqQkEsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7SUFDdkIsQ0FBQztDQWlCRjtBQXZCRCxzQkF1QkMiLCJmaWxlIjoid2ktZG9tLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvbGliLnRzXCIpO1xuIiwiaW1wb3J0IHsgY29udGV4dFRvU3RyaW5nLCBlc2NhcGVYbWwgfSBmcm9tIFwiLi9oZWxwZXJcIjtcclxuaW1wb3J0IHsgVmFsdWUsIFZhbHVlQ29udGV4dCB9IGZyb20gXCIuL3ZhbHVlXCI7XHJcblxyXG5leHBvcnQgdHlwZSBBcmdzID0ge1xyXG4gIGNsYXNzPzogKHN0cmluZyB8IG51bGwpW107XHJcbiAgZHluQ2xhc3M/OiAoc2lnbmFsOiBWYWx1ZUNvbnRleHQgfCBudWxsKSA9PiAoc3RyaW5nIHwgbnVsbClbXTtcclxuICBvbkNsaWNrPzogKCkgPT4gdm9pZDtcclxuICBvbk1vdXNlRW50ZXI/OiAoKSA9PiB2b2lkO1xyXG4gIG9uTW91c2VMZWF2ZT86ICgpID0+IHZvaWQ7XHJcbiAgb25Nb3VzZU92ZXI/OiAoKSA9PiB2b2lkO1xyXG4gIHRpdGxlPzogc3RyaW5nO1xyXG4gIGRhdGE/OiB7IFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfTtcclxuICBpZD86IHN0cmluZztcclxuICBzdHlsZT86IHN0cmluZztcclxuICBkeW5TdHlsZT86IChzaWduYWw6IFZhbHVlQ29udGV4dCB8IG51bGwpID0+IHN0cmluZztcclxufTtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFbGVtZW50QmFzZSB7XHJcbiAgYWJzdHJhY3QgcmVuZGVyU3RyaW5nOiAoY29udGV4dDogbnVtYmVyW10pID0+IFByb21pc2U8c3RyaW5nPjtcclxuXHJcbiAgYWJzdHJhY3QgcmVuZGVyTm9kZTogKGNvbnRleHQ6IG51bWJlcltdKSA9PiBQcm9taXNlPE5vZGU+O1xyXG59XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSHRtbEVsZW1lbnQ8XHJcbiAgVEFyZ3MgZXh0ZW5kcyB7fSxcclxuICBUQ2hpbGRyZW4gZXh0ZW5kcyBFbGVtZW50QmFzZVxyXG4+IHtcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgbmFtZTogc3RyaW5nLFxyXG4gICAgcHJvdGVjdGVkIGFyZ3M6IFRBcmdzLFxyXG4gICAgcHJpdmF0ZSBjaGlsZHJlbjogVENoaWxkcmVuW11cclxuICApIHt9XHJcblxyXG4gIGFzeW5jIHJlbmRlckFyZ3MoY29udGV4dDogbnVtYmVyW10pOiBQcm9taXNlPHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0+IHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IHt9IGFzIHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH07XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIHJlbmRlclN0cmluZyA9IGFzeW5jIChjb250ZXh0OiBudW1iZXJbXSkgPT4ge1xyXG4gICAgbGV0IHJlbmRlcmVkQ2hpbGRyZW4gPSBcIlwiO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IGMgPSB0aGlzLmNoaWxkcmVuW2ldO1xyXG4gICAgICBjb25zdCBuZXdDb250ZXh0ID0gY29udGV4dC5zbGljZSgpO1xyXG4gICAgICBuZXdDb250ZXh0LnB1c2goaSk7XHJcbiAgICAgIHJlbmRlcmVkQ2hpbGRyZW4gKz0gYXdhaXQgYy5yZW5kZXJTdHJpbmcobmV3Q29udGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGFyZ3NTdHJpbmcgPSBcIlwiO1xyXG4gICAgY29uc3QgYXJncyA9IGF3YWl0IHRoaXMucmVuZGVyQXJncyhjb250ZXh0KTtcclxuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGFyZ3MpKSB7XHJcbiAgICAgIGFyZ3NTdHJpbmcgKz0gYCAke2tleX09XCIke2FyZ3Nba2V5XX1cImA7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGA8JHt0aGlzLm5hbWV9JHthcmdzU3RyaW5nfT4ke3JlbmRlcmVkQ2hpbGRyZW59PC8ke3RoaXMubmFtZX0+YDtcclxuICB9O1xyXG5cclxuICBhc3luYyByZW5kZXJOb2RlKGNvbnRleHQ6IG51bWJlcltdKSB7XHJcbiAgICBjb25zdCByZXN1bHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMubmFtZSk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IGMgPSB0aGlzLmNoaWxkcmVuW2ldO1xyXG4gICAgICBjb25zdCBuZXdDb250ZXh0ID0gY29udGV4dC5zbGljZSgpO1xyXG4gICAgICBuZXdDb250ZXh0LnB1c2goaSk7XHJcbiAgICAgIHJlc3VsdC5hcHBlbmRDaGlsZChhd2FpdCBjLnJlbmRlck5vZGUobmV3Q29udGV4dCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFyZ3MgPSBhd2FpdCB0aGlzLnJlbmRlckFyZ3MoY29udGV4dCk7XHJcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhhcmdzKSkge1xyXG4gICAgICByZXN1bHQuc2V0QXR0cmlidXRlKGtleSwgYXJnc1trZXldKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEh0bWxCbG9ja0VsZW1lbnQ8XHJcbiAgVEFyZ3MgZXh0ZW5kcyBBcmdzLFxyXG4gIFRDaGlsZHJlbiBleHRlbmRzIEVsZW1lbnRCYXNlXHJcbj4gZXh0ZW5kcyBIdG1sRWxlbWVudDxUQXJncywgVENoaWxkcmVuPiB7XHJcbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBhcmdzOiBUQXJncywgY2hpbGRyZW46IFRDaGlsZHJlbltdKSB7XHJcbiAgICBzdXBlcihuYW1lLCBhcmdzLCBjaGlsZHJlbik7XHJcbiAgfVxyXG5cclxuICBhc3luYyByZW5kZXJBcmdzKGNvbnRleHQ6IG51bWJlcltdKTogUHJvbWlzZTx7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9PiB7XHJcbiAgICBjb25zdCByZXN1bHQgPSB7fSBhcyB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9O1xyXG5cclxuICAgIGlmICh0aGlzLmFyZ3MudGl0bGUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXN1bHQudGl0bGUgPSB0aGlzLmFyZ3MudGl0bGU7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc3R5bGVzID0gW1xyXG4gICAgICAuLi4odGhpcy5hcmdzLnN0eWxlID09PSB1bmRlZmluZWQgPyBbXSA6IFt0aGlzLmFyZ3Muc3R5bGVdKSxcclxuICAgICAgLi4uKHRoaXMuYXJncy5keW5TdHlsZSA9PT0gdW5kZWZpbmVkID8gW10gOiBbdGhpcy5hcmdzLmR5blN0eWxlKG51bGwpXSksXHJcbiAgICBdO1xyXG5cclxuICAgIGlmIChzdHlsZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICByZXN1bHQuc3R5bGUgPSBzdHlsZXMuam9pbihcIiBcIik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuYXJncy5pZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJlc3VsdC5pZCA9IHRoaXMuYXJncy5pZDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjbGFzc2VzID0gW1xyXG4gICAgICAuLi4odGhpcy5hcmdzLmNsYXNzID09PSB1bmRlZmluZWQgPyBbXSA6IHRoaXMuYXJncy5jbGFzcyksXHJcbiAgICAgIC4uLih0aGlzLmFyZ3MuZHluQ2xhc3MgPT09IHVuZGVmaW5lZCA/IFtdIDogdGhpcy5hcmdzLmR5bkNsYXNzKG51bGwpKSxcclxuICAgIF0uZmlsdGVyKChjKSA9PiBjICE9PSBudWxsKTtcclxuXHJcbiAgICBpZiAoY2xhc3Nlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHJlc3VsdC5jbGFzcyA9IGNsYXNzZXMuam9pbihcIiBcIik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuYXJncy5kYXRhICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5hcmdzLmRhdGEpIHtcclxuICAgICAgICByZXN1bHRbYGRhdGEtJHtrZXl9YF0gPSB0aGlzLmFyZ3MuZGF0YVtrZXldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYWRkRXZlbnQgPSAoZXZlbnQ6IGtleW9mIFRBcmdzLCBqc0V2ZW50OiBzdHJpbmcpID0+IHtcclxuICAgICAgaWYgKHRoaXMuYXJnc1tldmVudF0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGNvbnN0IG0gPSBjb250ZXh0VG9TdHJpbmcoanNFdmVudCwgY29udGV4dCk7XHJcbiAgICAgICAgcmVzdWx0W2V2ZW50IGFzIHN0cmluZ10gPSBgX19oYW5kbGUuJHttfSgpYDtcclxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgKHdpbmRvdyBhcyBhbnkpLl9faGFuZGxlW21dID0gdGhpcy5hcmdzW2V2ZW50XTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgYWRkRXZlbnQoXCJvbkNsaWNrXCIsIFwiY2xpY2tcIik7XHJcbiAgICBhZGRFdmVudChcIm9uTW91c2VFbnRlclwiLCBcIm1vdXNlZW50ZXJcIik7XHJcbiAgICBhZGRFdmVudChcIm9uTW91c2VMZWF2ZVwiLCBcIm1vdXNlbGVhdmVcIik7XHJcbiAgICBhZGRFdmVudChcIm9uTW91c2VPdmVyXCIsIFwibW91c2VvdmVyXCIpO1xyXG5cclxuICAgIGlmICh0aGlzLmFyZ3Mub25DbGljayAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGNvbnN0IG0gPSBjb250ZXh0VG9TdHJpbmcoXCJjbGlja1wiLCBjb250ZXh0KTtcclxuICAgICAgcmVzdWx0Lm9uQ2xpY2sgPSBgX19oYW5kbGUuJHttfSgpYDtcclxuICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAod2luZG93IGFzIGFueSkuX19oYW5kbGVbbV0gPSB0aGlzLmFyZ3Mub25DbGljaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBhc3luYyByZW5kZXJOb2RlKGNvbnRleHQ6IG51bWJlcltdKSB7XHJcbiAgICBjb25zdCBub2RlID0gYXdhaXQgc3VwZXIucmVuZGVyTm9kZShjb250ZXh0KTtcclxuXHJcbiAgICBpZiAodGhpcy5hcmdzLmR5bkNsYXNzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgY29uc3QgX3RoaXMgPSB0aGlzO1xyXG4gICAgICBhc3luYyBmdW5jdGlvbiB1cGRhdGUoKSB7XHJcbiAgICAgICAgaWYgKF90aGlzLmFyZ3MuZHluQ2xhc3MgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgY29uc3QgY2xhc3NlcyA9IFtcclxuICAgICAgICAgICAgLi4uKF90aGlzLmFyZ3MuY2xhc3MgPT09IHVuZGVmaW5lZCA/IFtdIDogX3RoaXMuYXJncy5jbGFzcyksXHJcbiAgICAgICAgICAgIC4uLl90aGlzLmFyZ3MuZHluQ2xhc3ModXBkYXRlKSxcclxuICAgICAgICAgIF07XHJcbiAgICAgICAgICBub2RlLmNsYXNzTmFtZSA9IGNsYXNzZXMuZmlsdGVyKChjKSA9PiBjICE9PSBudWxsKS5qb2luKFwiIFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGF3YWl0IHVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmFyZ3MuZHluU3R5bGUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBjb25zdCBfdGhpcyA9IHRoaXM7XHJcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcclxuICAgICAgICBpZiAoX3RoaXMuYXJncy5keW5TdHlsZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBjb25zdCBzID0gX3RoaXMuYXJncy5keW5TdHlsZSh1cGRhdGUpO1xyXG4gICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGF3YWl0IHVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBub2RlO1xyXG4gIH1cclxufVxyXG4vKipcclxuICogUGFnZVxyXG4gKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBQYWdlIHtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgYm9keTogQm9keSkge31cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBhZ2UoYm9keTogQm9keSkge1xyXG4gIHJldHVybiBuZXcgUGFnZShib2R5KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEh0bWxcclxuICovXHJcblxyXG5jbGFzcyBIdG1sIGV4dGVuZHMgSHRtbEVsZW1lbnQ8e30sIEVsZW1lbnRCYXNlPiB7XHJcbiAgY29uc3RydWN0b3IoaGVhZDogSGVhZCwgYm9keTogQm9keSkge1xyXG4gICAgc3VwZXIoXCJodG1sXCIsIHt9LCBbaGVhZCwgYm9keV0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGh0bWwoaGVhZDogSGVhZCwgYm9keTogQm9keSkge1xyXG4gIHJldHVybiBuZXcgSHRtbChoZWFkLCBib2R5KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEhlYWRcclxuICovXHJcblxyXG50eXBlIEhlYWRDaGlsZHJlbiA9IFNjcmlwdCB8IExpbmsgfCBNZXRhO1xyXG5cclxuY2xhc3MgSGVhZCBleHRlbmRzIEh0bWxFbGVtZW50PHt9LCBIZWFkQ2hpbGRyZW4+IHtcclxuICBjb25zdHJ1Y3RvcihjaGlsZHJlbjogSGVhZENoaWxkcmVuW10pIHtcclxuICAgIHN1cGVyKFwiaGVhZFwiLCB7fSwgY2hpbGRyZW4pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGhlYWQoY2hpbGRyZW46IEhlYWRDaGlsZHJlbltdKSB7XHJcbiAgcmV0dXJuIG5ldyBIZWFkKGNoaWxkcmVuKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEJvZHlcclxuICovXHJcblxyXG5leHBvcnQgY2xhc3MgQm9keSBleHRlbmRzIEh0bWxFbGVtZW50PEFyZ3MsIEVsZW1lbnRCYXNlPiB7XHJcbiAgY29uc3RydWN0b3IoYXJnczogQXJncywgY2hpbGRyZW46IEVsZW1lbnRCYXNlW10pIHtcclxuICAgIHN1cGVyKFwiYm9keVwiLCBhcmdzLCBjaGlsZHJlbik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYm9keShhcmdzOiBBcmdzLCBjaGlsZHJlbjogRWxlbWVudEJhc2VbXSkge1xyXG4gIHJldHVybiBuZXcgQm9keShhcmdzLCBjaGlsZHJlbik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTY3JpcHRcclxuICovXHJcblxyXG50eXBlIFNjcmlwdEFyZ3MgPSB7IHNyYzogc3RyaW5nOyBkZWZlcj86IGJvb2xlYW47IGFzeW5jPzogYm9vbGVhbiB9O1xyXG5cclxuY2xhc3MgU2NyaXB0IGV4dGVuZHMgSHRtbEVsZW1lbnQ8U2NyaXB0QXJncywgbmV2ZXI+IHtcclxuICBjb25zdHJ1Y3RvcihhcmdzOiBTY3JpcHRBcmdzKSB7XHJcbiAgICBzdXBlcihcInNjcmlwdFwiLCBhcmdzLCBbXSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyByZW5kZXJBcmdzKGNvbnRleHQ6IG51bWJlcltdKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgc3VwZXIucmVuZGVyQXJncyhjb250ZXh0KTtcclxuICAgIGlmICh0aGlzLmFyZ3MuZGVmZXIgPT09IHRydWUpIHtcclxuICAgICAgcmVzdWx0LmRlZmVyID0gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5hcmdzLmFzeW5jID09PSB0cnVlKSB7XHJcbiAgICAgIHJlc3VsdC5hc3luYyA9IFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzdWx0LnNyYyA9IHRoaXMuYXJncy5zcmM7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzY3JpcHQoYXJnczogU2NyaXB0QXJncykge1xyXG4gIHJldHVybiBuZXcgU2NyaXB0KGFyZ3MpO1xyXG59XHJcblxyXG4vKipcclxuICogTWV0YVxyXG4gKi9cclxuXHJcbnR5cGUgTWV0YUFyZ3MgPSB7IGNoYXJzZXQ6IFwidXRmLThcIiB8IFwid2luZG93cy0xMjUyXCIgfTtcclxuXHJcbmNsYXNzIE1ldGEgZXh0ZW5kcyBIdG1sRWxlbWVudDxNZXRhQXJncywgbmV2ZXI+IHtcclxuICBjb25zdHJ1Y3RvcihhcmdzOiBNZXRhQXJncykge1xyXG4gICAgc3VwZXIoXCJtZXRhXCIsIGFyZ3MsIFtdKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHJlbmRlckFyZ3MoY29udGV4dDogbnVtYmVyW10pIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHN1cGVyLnJlbmRlckFyZ3MoY29udGV4dCk7XHJcbiAgICByZXN1bHQuY2hhcnNldCA9IHRoaXMuYXJncy5jaGFyc2V0O1xyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWV0YShhcmdzOiBNZXRhQXJncykge1xyXG4gIHJldHVybiBuZXcgTWV0YShhcmdzKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIExpbmtcclxuICovXHJcblxyXG50eXBlIExpbmtBcmdzID0geyByZWw6IFwic3R5bGVzaGVldFwiOyBocmVmOiBzdHJpbmcgfTtcclxuXHJcbmNsYXNzIExpbmsgZXh0ZW5kcyBIdG1sRWxlbWVudDxMaW5rQXJncywgbmV2ZXI+IHtcclxuICBjb25zdHJ1Y3RvcihhcmdzOiBMaW5rQXJncykge1xyXG4gICAgc3VwZXIoXCJsaW5rXCIsIGFyZ3MsIFtdKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHJlbmRlckFyZ3MoY29udGV4dDogbnVtYmVyW10pIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHN1cGVyLnJlbmRlckFyZ3MoY29udGV4dCk7XHJcbiAgICByZXN1bHQucmVsID0gdGhpcy5hcmdzLnJlbDtcclxuICAgIHJlc3VsdC5ocmVmID0gdGhpcy5hcmdzLmhyZWY7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsaW5rKGFyZ3M6IExpbmtBcmdzKSB7XHJcbiAgcmV0dXJuIG5ldyBMaW5rKGFyZ3MpO1xyXG59XHJcblxyXG4vKipcclxuICogRGl2XHJcbiAqL1xyXG5cclxuY2xhc3MgRGl2IGV4dGVuZHMgSHRtbEJsb2NrRWxlbWVudDxBcmdzLCBFbGVtZW50QmFzZT4ge1xyXG4gIGNvbnN0cnVjdG9yKGFyZ3M6IEFyZ3MsIGNoaWxkcmVuOiBFbGVtZW50QmFzZVtdKSB7XHJcbiAgICBzdXBlcihcImRpdlwiLCBhcmdzLCBjaGlsZHJlbik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGl2KGFyZ3M6IEFyZ3MsIGNoaWxkcmVuOiBFbGVtZW50QmFzZVtdKSB7XHJcbiAgcmV0dXJuIG5ldyBEaXYoYXJncywgY2hpbGRyZW4pO1xyXG59XHJcblxyXG4vKipcclxuICogUFxyXG4gKi9cclxuXHJcbnR5cGUgUEFyZ3MgPSBBcmdzO1xyXG5cclxudHlwZSBQQ2hpbGRyZW4gPSBFbGVtZW50QmFzZTtcclxuXHJcbmNsYXNzIFAgZXh0ZW5kcyBIdG1sQmxvY2tFbGVtZW50PEFyZ3MsIFBDaGlsZHJlbj4ge1xyXG4gIGNvbnN0cnVjdG9yKGFyZ3M6IFBBcmdzLCBjaGlsZHJlbjogUENoaWxkcmVuW10pIHtcclxuICAgIHN1cGVyKFwicFwiLCBhcmdzLCBjaGlsZHJlbik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcChhcmdzOiBQQXJncywgY2hpbGRyZW46IFBDaGlsZHJlbltdKSB7XHJcbiAgcmV0dXJuIG5ldyBQKGFyZ3MsIGNoaWxkcmVuKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFN0cm9uZ1xyXG4gKi9cclxuXHJcbnR5cGUgU3Ryb25nQXJncyA9IEFyZ3M7XHJcblxyXG50eXBlIFN0cm9uZ0NoaWxkcmVuID0gRWxlbWVudEJhc2U7XHJcblxyXG5jbGFzcyBTdHJvbmcgZXh0ZW5kcyBIdG1sQmxvY2tFbGVtZW50PFN0cm9uZ0FyZ3MsIFN0cm9uZ0NoaWxkcmVuPiB7XHJcbiAgY29uc3RydWN0b3IoYXJnczogU3Ryb25nQXJncywgY2hpbGRyZW46IFN0cm9uZ0NoaWxkcmVuW10pIHtcclxuICAgIHN1cGVyKFwic3Ryb25nXCIsIGFyZ3MsIGNoaWxkcmVuKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzdHJvbmcoYXJnczogU3Ryb25nQXJncywgY2hpbGRyZW46IFN0cm9uZ0NoaWxkcmVuW10pIHtcclxuICByZXR1cm4gbmV3IFN0cm9uZyhhcmdzLCBjaGlsZHJlbik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTcGFuXHJcbiAqL1xyXG5cclxudHlwZSBTcGFuQXJncyA9IEFyZ3M7XHJcblxyXG50eXBlIFNwYW5DaGlsZHJlbiA9IEVsZW1lbnRCYXNlO1xyXG5cclxuY2xhc3MgU3BhbiBleHRlbmRzIEh0bWxCbG9ja0VsZW1lbnQ8U3BhbkFyZ3MsIFNwYW5DaGlsZHJlbj4ge1xyXG4gIGNvbnN0cnVjdG9yKGFyZ3M6IFNwYW5BcmdzLCBjaGlsZHJlbjogU3BhbkNoaWxkcmVuW10pIHtcclxuICAgIHN1cGVyKFwic3BhblwiLCBhcmdzLCBjaGlsZHJlbik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3BhbihhcmdzOiBTcGFuQXJncywgY2hpbGRyZW46IFNwYW5DaGlsZHJlbltdKSB7XHJcbiAgcmV0dXJuIG5ldyBTcGFuKGFyZ3MsIGNoaWxkcmVuKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEltZ1xyXG4gKi9cclxuXHJcbnR5cGUgSW1nQXJncyA9IEFyZ3MgJiB7IHNyYzogc3RyaW5nIH07XHJcblxyXG5jbGFzcyBJbWcgZXh0ZW5kcyBIdG1sQmxvY2tFbGVtZW50PEltZ0FyZ3MsIG5ldmVyPiB7XHJcbiAgY29uc3RydWN0b3IoYXJnczogSW1nQXJncykge1xyXG4gICAgc3VwZXIoXCJpbWdcIiwgYXJncywgW10pO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgcmVuZGVyQXJncyhjb250ZXh0OiBudW1iZXJbXSkge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgc3VwZXIucmVuZGVyQXJncyhjb250ZXh0KTtcclxuICAgIHJlc3VsdC5zcmMgPSB0aGlzLmFyZ3Muc3JjO1xyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW1nKGFyZ3M6IEltZ0FyZ3MpIHtcclxuICByZXR1cm4gbmV3IEltZyhhcmdzKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEJyXHJcbiAqL1xyXG5cclxuY2xhc3MgQnIgZXh0ZW5kcyBIdG1sQmxvY2tFbGVtZW50PHt9LCBuZXZlcj4ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoXCJiclwiLCB7fSwgW10pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGJyKCkge1xyXG4gIHJldHVybiBuZXcgQnIoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEFcclxuICovXHJcblxyXG50eXBlIEFBcmdzID0gQXJncyAmIHsgbGluazogUHJvbWlzZTxQYWdlPiB9O1xyXG5cclxuZXhwb3J0IGNsYXNzIEEgZXh0ZW5kcyBIdG1sQmxvY2tFbGVtZW50PEFBcmdzLCBFbGVtZW50QmFzZT4ge1xyXG4gIGNvbnN0cnVjdG9yKGFyZ3M6IEFBcmdzLCBjaGlsZHJlbjogRWxlbWVudEJhc2VbXSkge1xyXG4gICAgc3VwZXIoXCJhXCIsIGFyZ3MsIGNoaWxkcmVuKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHJlbmRlckFyZ3MoY29udGV4dDogbnVtYmVyW10pIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHN1cGVyLnJlbmRlckFyZ3MoY29udGV4dCk7XHJcbiAgICBjb25zdCBsaW5rID0gKGF3YWl0IHRoaXMuYXJncy5saW5rKSBhcyBhbnk7XHJcbiAgICBjb25zdCBzdHIgPSBsaW5rWzFdXHJcbiAgICAgIC5tYXAoKGw6IHN0cmluZykgPT4gXCIvXCIgKyBlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkobCkpKVxyXG4gICAgICAuam9pbihcIlwiKTtcclxuICAgIHJlc3VsdC5ocmVmID0gbGlua1swXSArIHN0cjtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYShhcmdzOiBBQXJncywgY2hpbGRyZW46IEVsZW1lbnRCYXNlW10pIHtcclxuICByZXR1cm4gbmV3IEEoYXJncywgY2hpbGRyZW4pO1xyXG59XHJcblxyXG4vKipcclxuICogQnV0dG9uXHJcbiAqL1xyXG5cclxudHlwZSBCdXR0b25BcmdzID0gQXJncztcclxuXHJcbmV4cG9ydCBjbGFzcyBCdXR0b24gZXh0ZW5kcyBIdG1sQmxvY2tFbGVtZW50PEJ1dHRvbkFyZ3MsIFRleHQ+IHtcclxuICBjb25zdHJ1Y3RvcihhcmdzOiBCdXR0b25BcmdzLCBjb250ZW50OiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKFwiYnV0dG9uXCIsIGFyZ3MsIFtuZXcgVGV4dChjb250ZW50KV0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGJ1dHRvbihhcmdzOiBCdXR0b25BcmdzLCBjb250ZW50OiBzdHJpbmcpIHtcclxuICByZXR1cm4gbmV3IEJ1dHRvbihhcmdzLCBjb250ZW50KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIElucHV0XHJcbiAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIElucHV0IGV4dGVuZHMgSHRtbEJsb2NrRWxlbWVudDxBcmdzLCBuZXZlcj4ge1xyXG4gIGNvbnN0cnVjdG9yKGFyZ3M6IEFyZ3MsIHByaXZhdGUgdmFsdWU6IFZhbHVlPHN0cmluZz4pIHtcclxuICAgIHN1cGVyKFwiaW5wdXRcIiwgYXJncywgW10pO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgcmVuZGVyQXJncyhjb250ZXh0OiBudW1iZXJbXSkge1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IHN1cGVyLnJlbmRlckFyZ3MoY29udGV4dCk7XHJcblxyXG4gICAgY29uc3QgbSA9IGNvbnRleHRUb1N0cmluZyhcImlucHV0XCIsIGNvbnRleHQpO1xyXG4gICAgcmVzdWx0LnZhbHVlID0gZXNjYXBlWG1sKHRoaXMudmFsdWUuZ2V0KG51bGwpKTtcclxuICAgIHJlc3VsdC5vbklucHV0ID0gYF9faGFuZGxlLiR7bX0oZXZlbnQpYDtcclxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICh3aW5kb3cgYXMgYW55KS5fX2hhbmRsZVttXSA9IChlOiBJbnB1dEV2ZW50KSA9PiB7XHJcbiAgICAgICAgdGhpcy52YWx1ZS5zZXQoKGUuY3VycmVudFRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSk7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbnB1dChhcmdzOiBBcmdzLCB2YWx1ZTogVmFsdWU8c3RyaW5nPikge1xyXG4gIHJldHVybiBuZXcgSW5wdXQoYXJncywgdmFsdWUpO1xyXG59XHJcblxyXG4vKipcclxuICogVGV4dEFyZWFcclxuICovXHJcblxyXG5leHBvcnQgY2xhc3MgVGV4dEFyZWEgZXh0ZW5kcyBIdG1sQmxvY2tFbGVtZW50PEFyZ3MsIG5ldmVyPiB7XHJcbiAgY29uc3RydWN0b3IoYXJnczogQXJncywgcHJpdmF0ZSB2YWx1ZTogVmFsdWU8c3RyaW5nPikge1xyXG4gICAgc3VwZXIoXCJ0ZXh0YXJlYVwiLCBhcmdzLCBbXSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyByZW5kZXJBcmdzKGNvbnRleHQ6IG51bWJlcltdKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgc3VwZXIucmVuZGVyQXJncyhjb250ZXh0KTtcclxuXHJcbiAgICBjb25zdCBtID0gY29udGV4dFRvU3RyaW5nKFwiaW5wdXRcIiwgY29udGV4dCk7XHJcbiAgICByZXN1bHQudmFsdWUgPSBlc2NhcGVYbWwodGhpcy52YWx1ZS5nZXQobnVsbCkpO1xyXG4gICAgcmVzdWx0Lm9uSW5wdXQgPSBgX19oYW5kbGUuJHttfShldmVudClgO1xyXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgKHdpbmRvdyBhcyBhbnkpLl9faGFuZGxlW21dID0gKGU6IElucHV0RXZlbnQpID0+IHtcclxuICAgICAgICB0aGlzLnZhbHVlLnNldCgoZS5jdXJyZW50VGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKTtcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRleHRhcmVhKGFyZ3M6IEFyZ3MsIHZhbHVlOiBWYWx1ZTxzdHJpbmc+KSB7XHJcbiAgcmV0dXJuIG5ldyBUZXh0QXJlYShhcmdzLCB2YWx1ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUYWJsZVxyXG4gKi9cclxuXHJcbnR5cGUgVGFibGVBcmdzID0ge30gJiBBcmdzO1xyXG5cclxudHlwZSBUYWJsZUNoaWxkcmVuID0gVEhlYWQgfCBUQm9keSB8IER5bjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWJsZSBleHRlbmRzIEh0bWxCbG9ja0VsZW1lbnQ8VGFibGVBcmdzLCBUYWJsZUNoaWxkcmVuPiB7XHJcbiAgY29uc3RydWN0b3IoYXJnczogVGFibGVBcmdzLCBjaGlsZHJlbjogVGFibGVDaGlsZHJlbltdKSB7XHJcbiAgICBzdXBlcihcInRhYmxlXCIsIGFyZ3MsIGNoaWxkcmVuKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0YWJsZShhcmdzOiBUYWJsZUFyZ3MsIGNoaWxkcmVuOiBUYWJsZUNoaWxkcmVuW10pIHtcclxuICByZXR1cm4gbmV3IFRhYmxlKGFyZ3MsIGNoaWxkcmVuKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFRIZWFkXHJcbiAqL1xyXG5cclxudHlwZSBUSGVhZEFyZ3MgPSB7fTtcclxudHlwZSBUSGVhZENoaWxkcmVuID0gVHI7XHJcblxyXG5leHBvcnQgY2xhc3MgVEhlYWQgZXh0ZW5kcyBIdG1sQmxvY2tFbGVtZW50PFRIZWFkQXJncywgVEhlYWRDaGlsZHJlbj4ge1xyXG4gIGNvbnN0cnVjdG9yKGFyZ3M6IFRIZWFkQXJncywgY2hpbGRyZW46IFRIZWFkQ2hpbGRyZW5bXSkge1xyXG4gICAgc3VwZXIoXCJ0aGVhZFwiLCBhcmdzLCBjaGlsZHJlbik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdGhlYWQoYXJnczogVEhlYWRBcmdzLCBjaGlsZHJlbjogVEhlYWRDaGlsZHJlbltdKSB7XHJcbiAgcmV0dXJuIG5ldyBUSGVhZChhcmdzLCBjaGlsZHJlbik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUQm9keVxyXG4gKi9cclxuXHJcbnR5cGUgVEJvZHlBcmdzID0ge307XHJcbnR5cGUgVEJvZHlDaGlsZHJlbiA9IFRyO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRCb2R5IGV4dGVuZHMgSHRtbEJsb2NrRWxlbWVudDxUQm9keUFyZ3MsIFRCb2R5Q2hpbGRyZW4+IHtcclxuICBjb25zdHJ1Y3RvcihhcmdzOiBUQm9keUFyZ3MsIGNoaWxkcmVuOiBUQm9keUNoaWxkcmVuW10pIHtcclxuICAgIHN1cGVyKFwidGJvZHlcIiwgYXJncywgY2hpbGRyZW4pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRib2R5KGFyZ3M6IFRCb2R5QXJncywgY2hpbGRyZW46IFRCb2R5Q2hpbGRyZW5bXSkge1xyXG4gIHJldHVybiBuZXcgVEJvZHkoYXJncywgY2hpbGRyZW4pO1xyXG59XHJcblxyXG4vKipcclxuICogVHJcclxuICovXHJcblxyXG50eXBlIFRyQXJncyA9IHt9O1xyXG50eXBlIFRyQ2hpbGRyZW4gPSBUZCB8IFRoO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyIGV4dGVuZHMgSHRtbEJsb2NrRWxlbWVudDxUckFyZ3MsIFRyQ2hpbGRyZW4+IHtcclxuICBjb25zdHJ1Y3RvcihhcmdzOiBUckFyZ3MsIGNoaWxkcmVuOiBUckNoaWxkcmVuW10pIHtcclxuICAgIHN1cGVyKFwidHJcIiwgYXJncywgY2hpbGRyZW4pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRyKGFyZ3M6IFRyQXJncywgY2hpbGRyZW46IFRyQ2hpbGRyZW5bXSkge1xyXG4gIHJldHVybiBuZXcgVHIoYXJncywgY2hpbGRyZW4pO1xyXG59XHJcblxyXG4vKipcclxuICogVGRcclxuICovXHJcblxyXG50eXBlIFRkQXJncyA9IEFyZ3MgJiB7IGNvbHNwYW4/OiBudW1iZXIgfTtcclxudHlwZSBUZENoaWxkcmVuID0gRWxlbWVudEJhc2U7XHJcblxyXG5leHBvcnQgY2xhc3MgVGQgZXh0ZW5kcyBIdG1sQmxvY2tFbGVtZW50PFRkQXJncywgVGRDaGlsZHJlbj4ge1xyXG4gIGNvbnN0cnVjdG9yKGFyZ3M6IFRkQXJncywgY2hpbGRyZW46IFRkQ2hpbGRyZW5bXSkge1xyXG4gICAgc3VwZXIoXCJ0ZFwiLCBhcmdzLCBjaGlsZHJlbik7XHJcbiAgfVxyXG5cclxuICBhc3luYyByZW5kZXJBcmdzKGNvbnRleHQ6IG51bWJlcltdKSB7XHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBzdXBlci5yZW5kZXJBcmdzKGNvbnRleHQpO1xyXG5cclxuICAgIGlmICh0aGlzLmFyZ3MuY29sc3BhbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJlc3VsdC5jb2xzcGFuID0gdGhpcy5hcmdzLmNvbHNwYW4udG9TdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRkKGFyZ3M6IFRkQXJncywgY2hpbGRyZW46IFRkQ2hpbGRyZW5bXSkge1xyXG4gIHJldHVybiBuZXcgVGQoYXJncywgY2hpbGRyZW4pO1xyXG59XHJcblxyXG4vKipcclxuICogVGhcclxuICovXHJcblxyXG50eXBlIFRoQXJncyA9IHt9O1xyXG50eXBlIFRoQ2hpbGRyZW4gPSBFbGVtZW50QmFzZTtcclxuXHJcbmV4cG9ydCBjbGFzcyBUaCBleHRlbmRzIEh0bWxCbG9ja0VsZW1lbnQ8VGhBcmdzLCBUaENoaWxkcmVuPiB7XHJcbiAgY29uc3RydWN0b3IoYXJnczogVGhBcmdzLCBjaGlsZHJlbjogVGhDaGlsZHJlbltdKSB7XHJcbiAgICBzdXBlcihcInRoXCIsIGFyZ3MsIGNoaWxkcmVuKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0aChhcmdzOiBUaEFyZ3MsIGNoaWxkcmVuOiBUaENoaWxkcmVuW10pIHtcclxuICByZXR1cm4gbmV3IFRoKGFyZ3MsIGNoaWxkcmVuKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFRleHRcclxuICovXHJcblxyXG5leHBvcnQgY2xhc3MgVGV4dCBleHRlbmRzIEVsZW1lbnRCYXNlIHtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHRleHQ6IHN0cmluZykge1xyXG4gICAgc3VwZXIoKTtcclxuICB9XHJcblxyXG4gIHJlbmRlclN0cmluZyA9IGFzeW5jICgpID0+IGVzY2FwZVhtbCh0aGlzLnRleHQpO1xyXG5cclxuICByZW5kZXJOb2RlID0gYXN5bmMgKCkgPT4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGhpcy50ZXh0KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRleHQodGV4dDogc3RyaW5nKSB7XHJcbiAgcmV0dXJuIG5ldyBUZXh0KHRleHQpO1xyXG59XHJcblxyXG4vKipcclxuICogRHluXHJcbiAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIER5biBleHRlbmRzIEVsZW1lbnRCYXNlIHtcclxuICBwcml2YXRlIG5vZGU6IE5vZGUgfCBudWxsID0gbnVsbDtcclxuICBwcml2YXRlIGNvbnRleHQ6IG51bWJlcltdID0gW107XHJcbiAgcHJpdmF0ZSByZW5kZXJQZW5kaW5nID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBzaWduYWw6IChjb250ZXh0OiBWYWx1ZUNvbnRleHQgfCBudWxsKSA9PiBQcm9taXNlPEVsZW1lbnRCYXNlPlxyXG4gICkge1xyXG4gICAgc3VwZXIoKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZSA9IGFzeW5jICgpID0+IHtcclxuICAgIGlmICghdGhpcy5yZW5kZXJQZW5kaW5nKSB7XHJcbiAgICAgIHRoaXMucmVuZGVyUGVuZGluZyA9IHRydWU7XHJcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJQZW5kaW5nID0gZmFsc2U7XHJcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMubm9kZSBhcyBFbGVtZW50IHwgbnVsbDtcclxuICAgICAgICBpZiAoZWxlbWVudCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgY29uc3QgbmV3Tm9kZSA9IGF3YWl0IHRoaXMucmVuZGVyTm9kZSh0aGlzLmNvbnRleHQpO1xyXG4gICAgICAgICAgZWxlbWVudC5yZXBsYWNlV2l0aChuZXdOb2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJlbmRlclN0cmluZyA9IGFzeW5jIChjb250ZXh0OiBudW1iZXJbXSkgPT4ge1xyXG4gICAgY29uc3QgZWxlbWVudCA9IGF3YWl0IHRoaXMuc2lnbmFsKG51bGwpO1xyXG4gICAgcmV0dXJuIGVsZW1lbnQucmVuZGVyU3RyaW5nKGNvbnRleHQpO1xyXG4gIH07XHJcblxyXG4gIHJlbmRlck5vZGUgPSBhc3luYyAoY29udGV4dDogbnVtYmVyW10pID0+IHtcclxuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gYXdhaXQgdGhpcy5zaWduYWwodGhpcy51cGRhdGUpO1xyXG4gICAgY29uc3Qgbm9kZSA9IGF3YWl0IGVsZW1lbnQucmVuZGVyTm9kZShjb250ZXh0KTtcclxuICAgIC8vIGlmICh0aGlzLm5vZGUgPT09IG51bGwpIHtcclxuICAgIHRoaXMubm9kZSA9IG5vZGU7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgcmV0dXJuIG5vZGU7XHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGR5bihcclxuICBzaWduYWw6IChjb250ZXh0OiBWYWx1ZUNvbnRleHQgfCBudWxsKSA9PiBQcm9taXNlPEVsZW1lbnRCYXNlPlxyXG4pIHtcclxuICByZXR1cm4gbmV3IER5bihzaWduYWwpO1xyXG59XHJcbiIsImV4cG9ydCBmdW5jdGlvbiBjb250ZXh0VG9TdHJpbmcoZXZlbnQ6IHN0cmluZywgY29udGV4dDogbnVtYmVyW10pIHtcclxuICByZXR1cm4gYCR7ZXZlbnR9XyR7Y29udGV4dC5tYXAoYyA9PiBjLnRvU3RyaW5nKCkpLmpvaW4oXCJfXCIpfWA7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBlc2NhcGVYbWwoaW5wdXQ6IHN0cmluZykge1xyXG4gIHJldHVybiBpbnB1dFxyXG4gICAgLnJlcGxhY2UoLyYvZywgXCImYW1wO1wiKVxyXG4gICAgLnJlcGxhY2UoLzwvZywgXCImbHQ7XCIpXHJcbiAgICAucmVwbGFjZSgvPi9nLCBcIiZndDtcIilcclxuICAgIC5yZXBsYWNlKC9cIi9nLCBcIiZxdW90O1wiKVxyXG4gICAgLnJlcGxhY2UoLycvZywgXCImYXBvcztcIik7XHJcbn0iLCJleHBvcnQgeyBWYWx1ZSB9IGZyb20gXCIuL3ZhbHVlXCI7XHJcbmV4cG9ydCB7XHJcbiAgYSxcclxuICBib2R5LFxyXG4gIGltZyxcclxuICBicixcclxuICBidXR0b24sXHJcbiAgZGl2LFxyXG4gIGR5bixcclxuICBoZWFkLFxyXG4gIGh0bWwsXHJcbiAgaW5wdXQsXHJcbiAgbGluayxcclxuICBtZXRhLFxyXG4gIHAsXHJcbiAgcGFnZSxcclxuICBzY3JpcHQsXHJcbiAgc3BhbixcclxuICBzdHJvbmcsXHJcbiAgdGFibGUsXHJcbiAgdGJvZHksXHJcbiAgdGQsXHJcbiAgdGV4dCxcclxuICB0ZXh0YXJlYSxcclxuICB0aCxcclxuICB0aGVhZCxcclxuICB0cixcclxuICBFbGVtZW50QmFzZSxcclxufSBmcm9tIFwiLi9lbGVtZW50c1wiO1xyXG4iLCJleHBvcnQgdHlwZSBWYWx1ZUNvbnRleHQgPSAoKSA9PiBQcm9taXNlPHZvaWQ+O1xyXG5cclxuZXhwb3J0IGNsYXNzIFZhbHVlPFQ+IHtcclxuICBwcml2YXRlIHZhbHVlOiBUO1xyXG4gIHByaXZhdGUgY29udGV4dDogVmFsdWVDb250ZXh0W10gPSBbXTtcclxuXHJcbiAgY29uc3RydWN0b3IoaW5pdGlhbDogVCkge1xyXG4gICAgdGhpcy52YWx1ZSA9IGluaXRpYWw7XHJcbiAgfVxyXG5cclxuICBnZXQgPSAoY29udGV4dDogVmFsdWVDb250ZXh0IHwgbnVsbCkgPT4ge1xyXG4gICAgaWYgKGNvbnRleHQgIT09IG51bGwgJiYgdGhpcy5jb250ZXh0LmluZGV4T2YoY29udGV4dCkgPT09IC0xKSB7XHJcbiAgICAgIHRoaXMuY29udGV4dC5wdXNoKGNvbnRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLnZhbHVlO1xyXG4gIH07XHJcblxyXG4gIHNldCA9ICh2YWx1ZTogVCkgPT4ge1xyXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG5cclxuICAgIGZvciAoY29uc3QgYyBvZiB0aGlzLmNvbnRleHQpIHtcclxuICAgICAgYygpO1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==