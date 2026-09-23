const languageButton = document.querySelector('.language-toggle');
const languageLabel = document.querySelector('.language-toggle__label');
const requestForm = document.querySelector('#service-request');
const formError = document.querySelector('#form-error');
const toast = document.querySelector('#toast');

const messages = {
  en: {
    languageLabel: '中文',
    languageAria: '切换为中文',
    required: 'Please complete every field and accept the service-rate note.',
    copied: 'WeChat ID copied: Californiamomo',
    copyFailed: 'WeChat ID: Californiamomo',
    sms: ({ name, address, appliance, urgency, issue }) =>
      `Hi Momo Service, I would like to request an appointment.\n\nName: ${name}\nService address: ${address}\nAppliance: ${appliance}\nTiming: ${urgency}\nIssue: ${issue}\n\nI understand the listed service rates. Please let me know your availability.`,
  },
  zh: {
    languageLabel: 'EN',
    languageAria: 'Switch to English',
    required: '请填写所有项目，并确认已了解服务收费。',
    copied: '微信号已复制：Californiamomo',
    copyFailed: '微信号：Californiamomo',
    sms: ({ name, address, appliance, urgency, issue }) =>
      `您好 Momo Service，我想预约上门服务。\n\n姓名：${name}\n服务地址：${address}\n设备：${appliance}\n时间：${urgency}\n问题描述：${issue}\n\n我已了解网站列出的服务收费。请告知可预约时间，谢谢。`,
  },
};

let currentLanguage = localStorage.getItem('momo-language') || (navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en');

function setLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.body.classList.toggle('lang-zh', language === 'zh');

  document.querySelectorAll('[data-en][data-zh]').forEach((element) => {
    element.textContent = element.dataset[language];
  });

  document.querySelectorAll('[data-placeholder-en][data-placeholder-zh]').forEach((element) => {
    element.placeholder = element.dataset[`placeholder${language === 'zh' ? 'Zh' : 'En'}`];
  });

  languageLabel.textContent = messages[language].languageLabel;
  languageButton.setAttribute('aria-label', messages[language].languageAria);
  languageButton.setAttribute('aria-pressed', language === 'zh' ? 'true' : 'false');
  localStorage.setItem('momo-language', language);
  formError.textContent = '';
}

languageButton.addEventListener('click', () => {
  setLanguage(currentLanguage === 'en' ? 'zh' : 'en');
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

document.querySelector('.copy-wechat').addEventListener('click', async (event) => {
  const value = event.currentTarget.dataset.copy;
  try {
    await navigator.clipboard.writeText(value);
    showToast(messages[currentLanguage].copied);
  } catch {
    showToast(messages[currentLanguage].copyFailed);
  }
});

requestForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!requestForm.checkValidity()) {
    formError.textContent = messages[currentLanguage].required;
    requestForm.reportValidity();
    return;
  }

  formError.textContent = '';
  const data = {
    name: document.querySelector('#customer-name').value.trim(),
    address: document.querySelector('#service-address').value.trim(),
    appliance: document.querySelector('#appliance').selectedOptions[0].textContent,
    urgency: document.querySelector('#urgency').selectedOptions[0].textContent,
    issue: document.querySelector('#issue').value.trim(),
  };
  const body = encodeURIComponent(messages[currentLanguage].sms(data));
  const separator = /iPad|iPhone|iPod/.test(navigator.userAgent) ? '&' : '?';
  window.location.href = `sms:+16507885300${separator}body=${body}`;
});

document.querySelector('#year').textContent = new Date().getFullYear();
setLanguage(currentLanguage);
