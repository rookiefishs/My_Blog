<!--
 * @Author: wangzhiyu <w19165802736@163.com>
 * @version: 1.1.1
 * @Date: 2023-12-04 13:56:11
 * @LastEditTime: 2024-01-18 13:56:11
 * @Descripttion: 自定义键盘组件
-->
<template>
  <DialogModal :title="''" ref="dialogModalRef" @close="close" draggable="true">
    <template #text="{ row }">
      <!-- <el-button @click="openModal(row)">打开弹框</el-button> -->
      <span></span>
    </template>
    <template #body>
      <div class="form-floating">
        <textarea ref="textareaRef" class="form-control input" placeholder="输入区域" id="textarea" style="height: 100px"></textarea>
        <label for="textarea">输入区域</label>
      </div>

      <!-- 键盘1 -->
      <div class="letter show">
        <div class="simple-keyboard-main"></div>
      </div>

      <!-- 键盘2 -->
      <div class="fn">
        <div class="select-box left-select"></div>
        <div class="simple-keyboard-main2"></div>
        <div class="select-box right-select"></div>
      </div>
    </template>

    <template #footer>
      <span></span>
    </template>
  </DialogModal>
  <div class="modal fade" id="keyboardModal" tabindex="-1" aria-labelledby="textarea" aria-hidden="true"></div>
</template>

<script setup>
// 导入css样式
import './bootstrap.css';
import './simple-keyboard.css';
import 'simple-keyboard/build/css/index.css';
import SimpleKeyboard from 'simple-keyboard';
import { ref, nextTick } from 'vue';

// 弹框实例
const dialogModalRef = ref();

// 自定义键盘文本域
let textBox = '';

// 使用 ref 创建对 textarea 元素的引用
const textareaRef = ref(null);

/**
 * 键盘
 */
let commonKeyboardOptions = {
  onKeyPress: button => onKeyPress(button),
  theme: 'simple-keyboard hg-theme-default',
  physicalKeyboardHighlight: true,
  syncInstanceInputs: true,
  mergeDisplay: true,
};
let keyboard = '';

function handleShift() {
  let currentLayout = keyboard.options.layoutName;
  let shiftToggle = currentLayout === 'default' ? 'shift' : 'default';

  keyboard.setOptions({
    layoutName: shiftToggle,
  });
}
// 切换键盘
function handleSwitch(button) {
  console.log(button);
  nextTick(() => {
    if (button === '{f(x)}') {
      document.querySelector('.fn').classList.add('show');
      document.querySelector('.letter').classList.remove('show');
    } else if (button === '{ABC}') {
      document.querySelector('.letter').classList.add('show');
      document.querySelector('.fn').classList.remove('show');
    }
  });
}
// 点击enter提交
function handleSubmit(button) {
  dialogModalRef.value.dialog.visible = false;

  // TODO: 以下代码分别为修改input框的value以及调用input的chang事件,为v-model的核心方法,两个都触发执行,就是触发了v-model,所以v-model的也会被修改

  // 将写出结果内容添加到当前修改的input的value中
  window.targetInput.value = textBox.value ? (isNaN(Number(textBox.value)) ? textBox.value : Number(textBox.value)) : '';

  // 触发input与change事件，以更新v-model绑定的变量
  window.targetInput.dispatchEvent(new Event('input'));
  window.targetInput.dispatchEvent(new Event('change'));
}
function handleEsc() {
  dialogModalRef.value.dialog.visible = false;
}
function getButtonValue(button) {
  if (button === '{True(HI)}') button = '{True}';
  if (button === '{False(LO)}') button = '{False}';
  let arr = ['{True}', '{False}', '{and}', '{or}', '{not}', '{xor}'];
  if (arr.includes(button)) {
    return button.slice(1, button.length - 1);
  } else if (button === '{space}') {
    return ' ';
  } else if (button.includes('numpad')) {
    return button.slice(7, button.length - 1);
  } else {
    return button;
  }
}
function onKeyPress(button) {
  if (button === '{escape}') {
    handleEsc();
    return;
  }
  if (button === '{enter}') {
    handleSubmit(button);
    return;
  }
  if (button === '{shift}' || button === '{shiftleft}' || button === '{shiftright}' || button === '{capslock}') {
    handleShift();
    return;
  }

  if (button === '{backspace}') {
    // 获取光标位置
    let cursorPosition = textBox.selectionStart;
    // 获取文本框中的值
    let value = textBox.value;
    let newValue = removeCharAtIndex(value, cursorPosition - 1);

    textBox.value = newValue;
    keyboard.setInput(newValue);

    moveCursor(cursorPosition, -1);
  } else if (button === '{f(x)}' || button === '{ABC}') {
    handleSwitch(button);
  } else if (button === '{arrowleft}' || button === '{arrowright}') {
    let offset = button === '{arrowleft}' ? -1 : 1;
    let currentPosition = textBox.selectionStart;
    let newPosition = currentPosition + offset;
    textBox.setSelectionRange(newPosition, newPosition);
  } else {
    // 获取光标位置
    let cursorPosition = textBox.selectionStart;
    // 获取文本框中的值
    let value = textBox.value;
    // 输入的键盘值
    let buttonValue = getButtonValue(button);
    // 在光标位置插入值
    let newValue = insertString(value, cursorPosition, buttonValue);

    textBox.value = newValue;
    keyboard.setInput(newValue);

    moveCursor(cursorPosition, buttonValue.length);
  }

  // 将focus操作加入延时队列
  setTimeout(() => {
    textBox.focus();
  }, 0);
}
// 在指定位置插入字符串
function insertString(originalString, index, insertion) {
  return originalString.slice(0, index) + insertion + originalString.slice(index);
}
// 移除指定位置的字符串
function removeCharAtIndex(inputString, index) {
  return inputString.slice(0, index) + inputString.slice(index + 1);
}
// 将光标移动到指定位置
function moveCursor(currentPosition, offset) {
  let newPosition = currentPosition + offset; // 计算新的光标位置
  textBox.setSelectionRange(newPosition, newPosition); // 移动光标
}

/**
 * 下拉选择
 */
let selectOptions = {
  onChange: function (event) {
    console.log(event);
  },
};
let selectList = [
  {
    title: '选择设备',
    options: [
      { value: '', label: '--' },
      { value: '1', label: '设备1' },
      { value: '2', label: '设备2' },
    ],
  },
  {
    title: '获取所选参数值',
    options: [
      { value: '', label: '--' },
      { value: '1', label: '参数值1' },
      { value: '2', label: '参数值2' },
    ],
  },
];
async function createSelect(item, selectOptions) {
  await nextTick();
  let selectDom = document.createElement('select');
  selectDom.classList.add('form-select');
  selectDom.setAttribute('data-title', item.title);
  selectDom.onchange = selectOptions.onChange;

  for (let i = 0; i < item.options.length; i++) {
    let optionDom = document.createElement('option');
    optionDom.value = item.options[i].value;
    optionDom.textContent = item.options[i].label;
    selectDom.appendChild(optionDom);
  }
  return selectDom;
}
async function renderSelectList(parentDom, selectList, selectOptions) {
  await nextTick();

  let fragment = document.createDocumentFragment();

  for (let i = 0; i < selectList.length; i++) {
    let itemDom = document.createElement('div');
    itemDom.classList.add('item');

    let div = document.createElement('div');
    div.textContent = selectList[i].title;
    itemDom.appendChild(div);

    let selectDom = await createSelect(selectList[i], selectOptions);
    itemDom.appendChild(selectDom);

    fragment.appendChild(itemDom);
  }

  parentDom.appendChild(fragment);
}

// 打开键盘弹框
const openModal = value => {
  // 打开弹框
  dialogModalRef.value.dialog.visible = true;

  // 在模态框显示后聚焦到文本框
  nextTick(() => {
    if (textareaRef.value) {
      setTimeout(() => {
        textareaRef.value.focus();
      }, 1);
    }
  });

  // 创建键盘
  nextTick(() => {
    textBox = document.getElementById('textarea');

    if (value && textBox) {
      textBox.value = value;
    } else {
      textBox.value = '';
    }

    keyboard = new SimpleKeyboard('.simple-keyboard-main', {
      ...commonKeyboardOptions,
      layout: {
        default: ['{escape} 1 2 3 4 5 6 7 8 9 0 - = {backspace}', 'q w e r t y u i o p [ ] \\', "{capslock} a s d f g h j k l ; ' {enter}", 'z x c v b n m , . /', '{f(x)} {shiftleft} {space} {arrowleft} {arrowright}'],
        // {f(x)}
        shift: ['{escape} ! @ # $ % ^ & * ( ) _ + {backspace}', 'Q W E R T Y U I O P { } |', '{capslock} A S D F G H J K L : " {enter}', 'Z X C V B N M < > ?', '{f(x)} {shiftleft} {space} {arrowleft} {arrowright}'],
        // {f(x)}
      },
      display: {
        '{escape}': 'esc ⎋',
        '{tab}': 'tab ⇥',
        '{backspace}': 'backspace ⌫',
        '{enter}': '提交 ↵',
        '{capslock}': 'caps lock ⇪',
        '{shiftleft}': 'shift ⇧',
        '{arrowup}': '上',
        '{arrowdown}': '下',
        '{arrowleft}': '左',
        '{arrowright}': '右',
        '{ctrl}': 'ctrl',
        '{f(x)}': 'f(x)',
      },
    });

    new SimpleKeyboard('.simple-keyboard-main2', {
      ...commonKeyboardOptions,
      layout: {
        default: ['{True(HI)} {False(LO)} {escape} {backspace}', '{and} {or} {not} {xor} ( ) {numpad7} {numpad8} {numpad9}', '< > = ~= >= <= {numpad4} {numpad5} {numpad6}', '+ - * / % ^ {numpad1} {numpad2} {numpad3}', '" \' {space} {numpad0} , .', '{ABC} {enter} {arrowleft} {arrowright}'],
      },
      display: {
        '{escape}': 'esc ⎋',
        '{backspace}': 'backspace ⌫',
        '{enter}': '提交 ↵',
        '{ABC}': 'ABC',
        '{True(HI)}': 'True(HI)',
        '{False(LO)}': 'False(LO)',
        '{and}': 'and',
        '{or}': 'or',
        '{not}': 'not',
        '{xor}': 'xor',
        '{arrowleft}': '←',
        '{arrowright}': '→',
      },
    });

    renderSelectList(document.querySelector('.left-select'), selectList, selectOptions);
    renderSelectList(document.querySelector('.right-select'), selectList, selectOptions);
  });
};

// 关闭弹框回调
const close = () => {
  window.isFocus = false;
};

// 打开键盘弹框方法挂载全局
window.keyboard ? (window.keyboard.openModal = openModal) : (window.openModal = openModal);
</script>

<style scoped>
input {
  font-size: 20px;
}

/* .modal {
  --bs-modal-width: 1100px;
} */

.fn,
.letter {
  display: none;
  margin: 10px 0 0;
  background-color: #ececec;
}

div.show {
  display: flex;
}

.fn .select-box {
  padding: 0 10px 5px;
  /* width: 230px; */
}
.fn .select-box .item {
  margin-top: 10px;
}

/* 重置键盘盒子样式 */
.hg-theme-default {
  width: unset;
  flex: 1;
}

/* 重置指定键盘1的样式 */
.simple-keyboard-main {
  --key-width: 63px;
  --margin-width: 5px;

  --longer-key-width: calc(var(--key-width) * 2 + var(--margin-width));
  --space-key-width: calc(var(--key-width) * 7 + var(--margin-width) * 6);
}

.simple-keyboard-main .hg-row .hg-button {
  flex-grow: 0;
  height: var(--key-width);
  width: var(--key-width);
}
.simple-keyboard-main .hg-row {
  justify-content: center;
}

.simple-keyboard-main .hg-row .hg-button[data-skbtn='{escape}'] {
  width: var(--longer-key-width);
}
.simple-keyboard-main .hg-row .hg-button[data-skbtn='{backspace}'] {
  width: var(--longer-key-width);
}
.simple-keyboard-main .hg-row .hg-button[data-skbtn='{capslock}'] {
  width: var(--longer-key-width);
}
.simple-keyboard-main .hg-row .hg-button[data-skbtn='{enter}'] {
  width: var(--longer-key-width);
}
.simple-keyboard-main .hg-row .hg-button[data-skbtn='{shiftleft}'] {
  width: var(--longer-key-width);
}
.simple-keyboard-main .hg-row .hg-button[data-skbtn='{space}'] {
  width: var(--space-key-width);
}

/* 重置指定键盘1的样式 */
.simple-keyboard-main2 {
  --key-width: 63px;
  --margin-width: 5px;

  --longer-key-width: calc(var(--key-width) * 2 + var(--margin-width));
  --backspace-key-width: calc(var(--key-width) * 3 + var(--margin-width) * 2);
  --enter-key-width: calc(var(--key-width) * 5 + var(--margin-width) * 4);
  --space-key-width: calc(var(--key-width) * 4 + var(--margin-width) * 3);
}
.simple-keyboard-main2 .hg-row .hg-button {
  flex-grow: 0;
  height: var(--key-width);
  width: var(--key-width);
}
.simple-keyboard-main2 .hg-row {
  justify-content: center;
}

.simple-keyboard-main2 .hg-row .hg-button[data-skbtn='{True(HI)}'] {
  width: var(--longer-key-width);
}
.simple-keyboard-main2 .hg-row .hg-button[data-skbtn='{False(LO)}'] {
  width: var(--longer-key-width);
}
.simple-keyboard-main2 .hg-row .hg-button[data-skbtn='{escape}'] {
  width: var(--longer-key-width);
}
.simple-keyboard-main2 .hg-row .hg-button[data-skbtn='{backspace}'] {
  width: var(--backspace-key-width);
}
.simple-keyboard-main2 .hg-row .hg-button[data-skbtn='ABC'] {
  width: var(--longer-key-width);
}
.simple-keyboard-main2 .hg-row .hg-button[data-skbtn='{enter}'] {
  width: var(--enter-key-width);
}
.simple-keyboard-main2 .hg-row .hg-button[data-skbtn='{space}'] {
  width: var(--space-key-width);
}
</style>
