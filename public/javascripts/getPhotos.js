var imgUrl = '';

function createImg(src, alt, title) {
    var img = document.createElement('img');
    img.src = src;
    img.width = '100';
    if (alt != null) img.alt = alt;
    if (title != null) img.title = title;
    return img;
}

function getPhotos(string) {
    let charArray = string.split("");
    let letter = charArray[0];
    let url = `http://localhost:3000/letters/random/${letter}`;

    fetch(url).then(function (response) {
        if (response.ok) {
            response.json().then(function (photo) {
                const parent = document.getElementById("imageArea");
                while (parent.firstChild) {
                    parent.firstChild.remove();
                }
                let newImg = createImg(photo.url, letter, letter);
                parent.append(newImg);
            });
        } else {
            console.log(`Request for the letter ${letter} failed with response ${response.status} : ${response.statusText}`);
        }
    });
}

function run() {
    processInput = () => {
        event.preventDefault();
        let message = document.getElementById('messageInput').value;
        getPhotos(message);

    }
    document.getElementById('form').addEventListener('submit', processInput);

}

// in case the document is already rendered
if (document.readyState != 'loading') run();
// modern browsers
else if (document.addEventListener) document.addEventListener('DOMContentLoaded', run);
// IE <= 8
else document.attachEvent('onreadystatechange', function () {
    if (document.readyState == 'complete') run();
});