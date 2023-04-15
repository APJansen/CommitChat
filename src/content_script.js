// content_script.js
import TurndownService from 'turndown';


const MODEL_NAME_CLASS = '.flex.w-full.items-center.justify-center.gap-1.border-b.border-black\\/10.bg-gray-50.p-3.text-gray-500.dark\\:border-gray-900\\/50.dark\\:bg-gray-700.dark\\:text-gray-300'
const USER_MESSAGE_CLASS = 'group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 dark:bg-gray-800';
const COUNTER_CLASS = 'flex-grow.flex-shrink-0';
const USER_TEXT_CLASS = 'min-h-\[20px\] flex flex-col items-start gap-4 whitespace-pre-wrap';
const USER_TEXT_CLASS_EDIT = 'm-0 resize-none border-0 bg-transparent p-0 focus\:ring-0 focus-visible\:ring-0';

const DEFAULT_MODEL_NAME = 'ChatGPT';

const UNSELECT_HOTKEY = 'KeyX'

const SELECTED_USER_CLASS = 'selected-user-lightblue';
const SELECTED_MODEL_CLASS = 'selected-model-lightblue';

function hasMatchingClasses(element, user_class) {
  const userClassList = user_class.split(' ');
  const elementClassList = [...element.classList];

  return userClassList.every((className) => elementClassList.includes(className));
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
  console.log(targetElement.classList);

  // Check if the clicked element or any of its ancestors has matching classes
  const promptElement = findAncestorWithMatchingClasses(targetElement, USER_MESSAGE_CLASS);

  // Exclude the actual text to prevent interfering with normal copy paste and editing
  const userTextElement = hasMatchingClasses(targetElement, USER_TEXT_CLASS);
  const userEditElement = hasMatchingClasses(targetElement, USER_TEXT_CLASS_EDIT);

  if (promptElement && !userTextElement && !userEditElement) {
    promptElement.classList.toggle(SELECTED_USER_CLASS);

    const replyElement = promptElement.nextElementSibling;
    replyElement.classList.toggle(SELECTED_MODEL_CLASS);

    // Automatically copy the content to the clipboard when a new message is selected or unselected
    copySelectedMessages();
  }
});

function findAncestorWithMatchingClasses(element, classList) {
  let currentElement = element;
  while (currentElement) {
    if (hasMatchingClasses(currentElement, classList)) {
      return currentElement;
    }
    currentElement = currentElement.parentElement;
  }
  return null;
}

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
    return DEFAULT_MODEL_NAME;
  }

  const modelText = modelInfoElement.textContent;
  const modelNameMatch = modelText.match(/Model: (.+)$/);
  const modelName = modelNameMatch[1].replace(/"(.+)"|Default \((.+)\)/, '$1$2');

  return modelName;
}

function copyUserMessage(userElement) {
  const userTextAll = userElement.textContent;
  const userText = removeCounter(userTextAll, userElement);
  const userMessage = addQuote(userText);
  return userMessage;
}

function copyModelMessage(modelElement, turnDownService) {
  const modelHTML = modelElement.innerHTML;
  const modelMarkdown = turnDownService.turndown(modelHTML);
  const modelText = removeCounter(modelMarkdown, modelElement);
  const modelMessage = addQuote(modelText);
  return modelMessage;
}

function removeCounter(text, element) {
  const counterElement = element.querySelector('.' + COUNTER_CLASS);
  const counterText = counterElement ? counterElement.textContent : '';
  return text.replace(new RegExp(`^${counterText}|${counterText}$`, 'g'), '').trim();
}

function copySelectedMessages() {
  const selectedElements = document.querySelectorAll('.' + SELECTED_USER_CLASS);
  const modelName = getModelName();

  let contentToCopy = '## Relevant conversation with ' + modelName + '\n\n';
  const turndownService = new TurndownService();
  customCodeBlockRule(turndownService);

  selectedElements.forEach((userElement) => {
    const userMessage = copyUserMessage(userElement);

    const modelElement = userElement.nextElementSibling;
    const modelMessage = copyModelMessage(modelElement, turndownService);

    contentToCopy += `### Me:\n${userMessage}\n\n### ${modelName}:\n${modelMessage}\n\n`;
  });

  copyTextToClipboard(contentToCopy);
  console.log(`Copied user and model messages to clipboard: "${contentToCopy}"`);
}

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.shiftKey && event.code === UNSELECT_HOTKEY) {
    clearSelections();
  }
});

