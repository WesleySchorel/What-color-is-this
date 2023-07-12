document.getElementById("images-info").addEventListener("click", function () {
  var inputElement = document.getElementById("image-input");

  if (document.activeElement !== inputElement) {
    inputElement.value = null;
    inputElement.click();
  }
});

document.getElementById("image-input").addEventListener("change", function (event) {
  var file = event.target.files[0];
  handleImageUpload(file);
});

document.addEventListener("paste", function (event) {
  var items = event.clipboardData.items;
  for (var i = 0; i < items.length; i++) {
    if (items[i].type.indexOf("image") !== -1) {
      var file = items[i].getAsFile();
      handleImageUpload(file);
      break;
    }
  }
});

document.getElementById("copy-button").addEventListener("click", function () {
  var colorValue = document.getElementById("color-value");
  var hexCode = colorValue.textContent.replace("HEX color: ", "");

  if (hexCode !== "HEX color:") {
    copyToClipboard(hexCode);
    var colorSquare = document.querySelector(".color-square");
    colorSquare.classList.add("copy");
    setTimeout(function () {
      colorSquare.classList.remove("copy");
    }, 1800);
  } else {
    alert("No color selected");
  }
});

var recentColors = [];

function addRecentColor(hex) {
  recentColors.push(hex);
  if (recentColors.length > 5) {
    recentColors.shift();
  }
  updateColorHistory();
}

function updateColorHistory() {
  var colorHistory = document.querySelector(".color-history");
  colorHistory.innerHTML = "<h2>Recent colors:</h2>";
  var ul = document.createElement("ul");
  recentColors.forEach(function (color) {
    var li = document.createElement("li");
    li.style.backgroundColor = color;
    li.setAttribute("data-color", color);
    li.addEventListener("click", function () {
      copyToClipboard(color);
    });
    ul.appendChild(li);
  });
  colorHistory.appendChild(ul);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(function () {
    console.log("Copied to clipboard: " + text);
  }, function (err) {
    console.error("Failed to copy to clipboard: ", err);
  });
}

function handleImageUpload(file) {
  var reader = new FileReader();

  reader.onload = function (e) {
    var img = document.createElement("img");
    img.src = e.target.result;

    img.onload = function () {
      var container = document.getElementById("image-container");
      container.innerHTML = "";
      container.appendChild(img);

      var imagesInfo = document.getElementById("images-info");
      imagesInfo.style.display = "none";

      container.removeEventListener("click", onClick);

      container.addEventListener("click", onClick);

      container.removeEventListener("mousemove", onMouseMove);

      container.addEventListener("mousemove", onMouseMove);

      container.addEventListener("mouseout", onMouseOut);
    };
  };

  reader.readAsDataURL(file);
}

function onClick(e) {
  var img = e.currentTarget.querySelector("img");

  var rect = img.getBoundingClientRect();
  var x = Math.round((e.clientX - rect.left) * (img.naturalWidth / rect.width));
  var y = Math.round((e.clientY - rect.top) * (img.naturalHeight / rect.height));

  x = Math.max(0, Math.min(img.naturalWidth - 1, x));
  y = Math.max(0, Math.min(img.naturalHeight - 1, y));

  var canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  var context = canvas.getContext("2d");
  context.drawImage(img, 0, 0);

  var pixelData = context.getImageData(x, y, 1, 1).data;
  var hex = "#" + ("000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);

  updateColorValues(hex);
}

function onMouseMove(e) {
  var img = document.getElementById("image-container").querySelector("img");

  var rect = img.getBoundingClientRect();
  var x = Math.round((e.clientX - rect.left) * (img.naturalWidth / rect.width));
  var y = Math.round((e.clientY - rect.top) * (img.naturalHeight / rect.height));

  x = Math.max(0, Math.min(img.naturalWidth - 1, x));
  y = Math.max(0, Math.min(img.naturalHeight - 1, y));

  var canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  var context = canvas.getContext("2d");
  context.drawImage(img, 0, 0);

  var pixelData = context.getImageData(x, y, 1, 1).data;
  var hex = "#" + ("000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);

  updateCircle(hex);
}

function onMouseOut() {
  removeCircle();
}

function updateColorValues(hex) {
  var colorValue = document.getElementById("color-value");
  var colorSquare = document.querySelector(".color-square");

  colorValue.textContent = "HEX color: " + hex;
  colorSquare.style.backgroundColor = hex;

  addRecentColor(hex);
}

function updateCircle(hex) {
  var img = document.getElementById("image-container").querySelector("img");

  var rect = img.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;

  var circle = document.getElementById("circle");
  if (!circle) {
    circle = document.createElement("div");
    circle.id = "circle";
    document.getElementById("image-container").appendChild(circle);
  }

  circle.style.backgroundColor = hex;
  circle.style.left = x + 35 + "px";
  circle.style.top = y - circle.offsetHeight / 2 + "px";
}

function removeCircle() {
  var circle = document.getElementById("circle");
  if (circle) {
    circle.remove();
  }
}

function rgbToHex(r, g, b) {
  return ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}