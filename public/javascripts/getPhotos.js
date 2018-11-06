// in case the document is already rendered
if (document.readyState != 'loading') runScript();
// modern browsers
else if (document.addEventListener) document.addEventListener('DOMContentLoaded', runScript);
// IE <= 8
else document.attachEvent('onreadystatechange', function () {
    if (document.readyState == 'complete') runScript();
});

function runScript() {
    document.getElementById('form').addEventListener('submit', () => {
        event.preventDefault();
        const imageAreaEl = document.getElementById("imageArea");
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
    let charArray = string.split("");
    await asyncForEach(charArray, async (character) => {

        let url = `http://localhost:3000/letters/${character}`;

        await fetch(url).then(handleErrors).then(response => {
            response.json().then(photo => {
                let newImg = createImg(photo.url, character, character);
                printArea.append(newImg);
            })
        }).catch(error => console.log(error));
    })
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(`Request failed with response ${response.status} : ${response.statusText}`);
    }
    return response;
}

function createImg(src, alt, title) {
    var img = document.createElement('img');
    img.src = src;
    img.width = '100';
    if (alt != null) img.alt = alt;
    if (title != null) img.title = title;
    return img;
}