const lettersRegEx = /^[a-z]+$/i;
const numbersRegEx = /^[0-9]+$/;

// in case the document is already rendered
if (document.readyState != 'loading') runScript();
// modern browsers
else if (document.addEventListener)
  document.addEventListener('DOMContentLoaded', runScript);
// IE <= 8
else
  document.attachEvent('onreadystatechange', function() {
    if (document.readyState == 'complete') runScript();
  });

function runScript() {
  document.getElementById('form').addEventListener('submit', () => {
    event.preventDefault();
    const imageAreaEl = document.getElementById('imageArea');
    const message = document.getElementById('messageInput').value;
    clearChildElements(imageAreaEl);
    printMessage(message, imageAreaEl);
  });
}

function clearChildElements(parent) {
  while (parent.firstChild) {
    parent.firstChild.remove();
  }
}

async function printMessage(string, printArea) {
  let charArray = string.split('');
  await asyncForEach(charArray, async character => {
    let url = '';
    switch (getCharacterType(character)) {
      case 'letter':
        url = `/letters/${character}`;
        await fetch(url)
          .then(handleErrors)
          .then(response => response.json())
          .then(response => {
            let newImg = createImg(response.url, character, character);
            printArea.append(newImg);
          })
          .catch(error => console.log(error.message));
        break;
      case 'number':
        url = `/numbers/${character}`;
        await fetch(url)
          .then(handleErrors)
          .then(response => response.json())
          .then(response => {
            let newImg = createImg(response.url, character, character);
            printArea.append(newImg);
          })
          .catch(error => console.log(error.message));
        break;
      case 'space':
        printArea.append(createSpace());
        break;
      // TO DO: handle symbols --for now we will just print a space
      case 'symbol':
        let symbolName = getSymbolName(character);
        url = `/symbols/${symbolName}`;
        await fetch(url)
          .then(handleErrors)
          .then(response => response.json())
          .then(response => {
            let newImg = createImg(response.url, character, character);
            printArea.append(newImg);
          })
          .catch(error => console.log(error.message));
        break;
      default:
        console.log(`We were unable to process this character: ${character}`);
    }
  });
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

function handleErrors(response) {
  if (!response.ok) {
    throw Error(
      `Request failed with response ${response.status} : ${response.statusText}`
    );
  }
  return response;
}

function getCharacterType(character) {
  if (lettersRegEx.test(character)) return 'letter';
  if (numbersRegEx.test(character)) return 'number';
  if (character === ' ') return 'space';
  if (getSymbolName(character) !== 'symbol not found') return 'symbol';
}

function createImg(src, alt, title) {
  var img = document.createElement('img');
  img.className = 'letter';
  img.src = src;
  img.alt = alt;
  img.title = title;
  return img;
}

function createSpace() {
  var box = document.createElement('div');
  box.className = 'space';
  return box;
}

function getSymbolName(character) {
  switch (character) {
    case '!':
      return 'exclamation';
    case '&':
      return 'ampersand';
    case '?':
      return 'questionmark';
    case '.':
      return 'period';
    case '#':
      return 'hash';
    case '%':
      return 'percent';
    case '+':
      return 'plus';
    case '=':
      return 'equals';
    case ',':
      return 'comma';
    case "'":
      return 'apostrophe';
    case '\\/':
      return 'slash';
    case '"':
      return 'quote';
    case '*':
      return 'asterisk';
    case '$':
      return 'dollar';
    default:
      return 'symbol not found';
  }
}
