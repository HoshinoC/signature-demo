const canvas = document.getElementById("signature-pad");
const clearBtn = document.getElementById("clear-btn");
const saveBtn = document.getElementById("save-btn");
let display = document.getElementById("show");

const ctx = canvas.getContext("2d");

// 是否正在绘制
let isDrawing = false;
// canvas 是否有内容
let hasContent = false;

function startPosition(e){
    isDrawing = true;
    hasContent = true;
    draw(e);
}

function endPosition(){
    isDrawing = false;
    ctx.beginPath();
    saveState()
}

function draw(e){
    if(!isDrawing) return;
    let clientX, clientY;
    // 触摸逻辑
    if(e.type.startsWith("touch")){
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    }else{
        clientX = e.clientX;
        clientY = e.clientY;
    }
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.linejoin = "round";
    ctx.strokeStyle = "black";

    const x = clientX - canvas.offsetLeft;
    const y = clientY - canvas.offsetTop;

    if(isDrawing){
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
}

function saveState(){
    localStorage.setItem("signature", canvas.toDataURL());
}

function loadState(){
    const savedData = localStorage.getItem("signature");
    if(savedData){
        const img = new Image();
        img.src = savedData;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        }
    }
}

function removeState(){
    localStorage.removeItem("signature");
}

canvas.addEventListener("mousedown", (e) => {
    startPosition(e);
});

canvas.addEventListener("mouseup", (e) => {
    endPosition();
});

canvas.addEventListener("mousemove", (e) => {
    draw(e);
});

canvas.addEventListener("touchstart", (e) => {
    startPosition(e);
});

canvas.addEventListener("touchend", (e) => {
    endPosition();
});

canvas.addEventListener("touchmove", (e) => {
    draw(e);
});

clearBtn.addEventListener("click", () => {
    hasContent = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    removeState();
    display.innerHTML = "";
});

saveBtn.addEventListener("click", () => {
    if(hasContent){
        const dataUrl = canvas.toDataURL();
        display.innerHTML = `<img src="${dataUrl}" alt="Signature" />`;
        display.innerHTML += `<a href="${dataUrl}" download="signature.png">下载签名</a>`; 
        saveState();
    }
    else{
        alert("请先绘制内容");
    }
});




