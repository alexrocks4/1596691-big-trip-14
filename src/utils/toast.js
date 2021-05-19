const SHOW_TIME = 5000;
const Message = {
  NOEDIT: 'You can\'t edit points offline',
  NOCREATE: 'You can\'t create points offline',
  NODELETE: 'You can\'t delete points offline',
};

const toastContainer = document.createElement('div');
toastContainer.classList.add('toast-container');
document.body.append(toastContainer);

const toast = (message) => {
  const toastItem = document.createElement('div');
  toastItem.textContent = message;
  toastItem.classList.add('toast-item');

  toastContainer.append(toastItem);
  toastContainer.style.display = 'block';

  setTimeout(() => {
    toastItem.remove();

    if (!toastContainer.childNodes.length) {
      toastContainer.style.display = 'none';
    }

  }, SHOW_TIME);
};

export { toast, Message };
