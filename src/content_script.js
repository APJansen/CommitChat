// contentScript.js
import TurndownService from 'turndown';


const MODEL_NAME_CLASS = '.flex.w-full.items-center.justify-center.gap-1.border-b.border-black\\/10.bg-gray-50.p-3.text-gray-500.dark\\:border-gray-900\\/50.dark\\:bg-gray-700.dark\\:text-gray-300'
const USER_MESSAGE_CLASS = 'group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 dark:bg-gray-800';
const USER_TEXT_CLASS = '.min-h-\\[20px\\].flex.flex-col.items-start.gap-4.whitespace-pre-wrap';
const MODEL_TEXT_CLASS = '.markdown.prose.w-full.break-words.dark\\:prose-invert.light';

const COPY_HOTKEY = 'KeyC'
const UNSELECT_HOTKEY = 'KeyX'

const SELECTED_USER_CLASS = 'selected-user-lightblue';
const SELECTED_MODEL_CLASS = 'selected-model-lightblue';

function hasMatchingClasses(element, user_class) {
  const userClassList = user_class.split(' ');
  const elementClassList = [...element.classList];

  return userClassList.every((className) => elementClassList.includes(className));
}

function getInnerHTMLFromElement(element, className) {
  return element.querySelector(className).innerHTML;
}

function copyTextToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

function clearSelections() {
  const selectedUserElements = document.querySelectorAll('.' + SELECTED_USER_CLASS);
  const selectedModelElements = document.querySelectorAll('.' + SELECTED_MODEL_CLASS);

  selectedUserElements.forEach((element) => {
    element.classList.remove(SELECTED_USER_CLASS);
  });

  selectedModelElements.forEach((element) => {
    element.classList.remove(SELECTED_MODEL_CLASS);
  });
}

document.body.addEventListener('click', (event) => {
  const targetElement = event.target;

  if (hasMatchingClasses(targetElement, USER_MESSAGE_CLASS)) {
    targetElement.classList.toggle(SELECTED_USER_CLASS);

    const siblingElement = targetElement.nextElementSibling;
    siblingElement.classList.toggle(SELECTED_MODEL_CLASS);
  }
});

function customCodeBlockRule(turndownService) {
  turndownService.addRule('codeBlock', {
    filter: ['pre'],
    replacement: function (content, node) {
      const codeElement = node.querySelector('code');
      const classList = codeElement.getAttribute('class') || '';
      const languageMatch = classList.match(/language-(\w+)/);
      const language = languageMatch ? languageMatch[1] : '';
      const codeContent = codeElement.textContent;

      return '\n```' + language + '\n' + codeContent + '\n```\n';
    }
  });
}

function addQuote(content) {
  const lines = content.split('\n');
  const quotedLines = lines.map(line => '> ' + line);
  return quotedLines.join('\n');
}

function getModelName() {
  const modelInfoElement = document.querySelector(MODEL_NAME_CLASS);

  if (!modelInfoElement) {
    console.error('Model information element not found.');
    return;
  }

  const modelText = modelInfoElement.textContent;
  const modelNameMatch = modelText.match(/Model: (.+)$/);
  const modelName = modelNameMatch[1].replace(/"(.+)"|Default \((.+)\)/, '$1$2');

  return modelName;
}

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.shiftKey && event.code === COPY_HOTKEY) {
    const selectedElements = document.querySelectorAll('.' + SELECTED_USER_CLASS);
    const modelName = getModelName();

    let contentToCopy = '## Relevant conversation with ' + modelName + '\n\n';
    const turndownService = new TurndownService();
    customCodeBlockRule(turndownService);

    selectedElements.forEach((element) => {
      const userInnerHTML = getInnerHTMLFromElement(element, USER_TEXT_CLASS);
      const modelInnerHTML = getInnerHTMLFromElement(element.nextElementSibling, MODEL_TEXT_CLASS);

      const userText = element.querySelector(USER_TEXT_CLASS).textContent;

      const modelMarkdown = turndownService.turndown(modelInnerHTML);

      const userQuote = addQuote(userText)
      const modelQuote = addQuote(modelMarkdown)

      contentToCopy += `### Me:\n${userQuote}\n\n### ${modelName}:\n${modelQuote}\n\n`;
    });

    copyTextToClipboard(contentToCopy);
    console.log(`Copied user and model messages to clipboard: "${contentToCopy}"`);
  }
  
  if (event.ctrlKey && event.shiftKey && event.code === UNSELECT_HOTKEY) {
    clearSelections();
  }
});

