/*
    介绍：
        canvas绘图与绘制文字的基本功能封装
    作者：
        狡猾的皮球 QQ871245007
    最后修改时间：
        2020年1月23日 17:42:22
 */

/*
    功能：
        创建img对象
*/
function NewImage(src, w, h) {
    let img = new Image(w, h);
    img.src = src;
    return img;
}

/*
    功能：
        绘制一条宽度为1像素的线段
    参数：
        ctx：context设备上下文
        color:颜色字符串
        sx,sy:起点
        ex,ey:终点
 */
function drawLine(ctx, color, sx, sy, ex, ey) {
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.strokeStyle = color;
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
}

/*
    功能：
        绘制一个填充矩形
    参数：
        ctx：context设备上下文
        color：颜色字符串
        sx,sy：绘制的起点
        w,h：绘制的宽高
 */
function drawFillRect(ctx, color, sx, sy, w, h) {
    ctx.fillStyle = color;
    ctx.fillRect(sx, sy, w, h);
}

/*
    功能：
        绘制图片(带裁剪和缩放功能)
    参数：
        ctx：不解释了
        img:原图片
        destX,destY:要绘制在画布上的位置
        destW,destH:要绘制的宽高
        srcX,srcY:在原图片上的左上角坐标
        srcW,srcH:要在原图片上截取的宽高
*/
function drawImg(ctx, img, destX, destY, destW, destH, srcX, srcY, srcW, srcH) {
    ctx.drawImage(img, srcX, srcY, srcW, srcH, destX, destY, destW, destH);
}

/*
    功能：
        绘制原图（无裁剪和缩放功能）
    参数：
        destX,destY:要绘制在画布上的位置
 */
function drawSrcImg(ctx, img, destX, destY) {
    ctx.drawImage(img, destX, destY);
}

/*
    功能：
        画序列帧图像的指定图块
    参数：
        destX,destY:要绘制在画布上的位置
        cellX,cellY:单元格位置
        dW, dH:单元格大小
 */
function drawCellImg(ctx, img, destX, destY, cellX, cellY, dW, dH) {
    drawImg(ctx, img, destX, destY, dW, dH, cellX * dW, cellY * dH, dW, dH);
}

/*
    功能：
        绘制缩放原图
    参数：
        destX,destY:要绘制在画布上的位置
        k：缩放比例
        dY:Y轴偏移量
 */
function drawScale(ctx,img,destX,destY,k=1,dY=0){
    ctx.drawImage(img, destX*k, destY*k+dY,img.width*k,img.height*k);
}


/*
    功能：
        绘制文字,不会换行
    参数：
        color：颜色字符串
        size：字体大小
        text：要绘制的字符串
        destX,destY：绘制的起点
*/
function drawText(ctx, color, size, text, destX, destY) {
    ctx.font = size + "px 微软雅黑";
    ctx.fillStyle = color;
    destY+=size;   //坐标是文字的左下角，所以得转换成左上角
    ctx.fillText(text, destX, destY);
    // ctx.strokeText(text, destX, destY);
}

/*
    功能：
        绘制描边文字,不会换行
    参数：
        colorOut：边框颜色
        colorIn：文字颜色
        size：字体大小
        text：要绘制的字符串
        destX,destY：绘制的起点
*/
function drawOutlineText(ctx, colorOut, colorIn, size, text, destX, destY) {
    drawText(ctx, colorOut, size, text, destX - 1, destY); //左
    drawText(ctx, colorOut, size, text, destX + 1, destY); //右
    drawText(ctx, colorOut, size, text, destX, destY + 1); //下
    drawText(ctx, colorOut, size, text, destX, destY - 1); //上
    drawText(ctx, colorIn, size, text, destX, destY);      //中间
}

/*
    功能：
        绘制自动换行的文字,支持\n换行
    参数：
        color：颜色字符串
        size：字体大小
        text：要绘制的字符串
        destX,destY：绘制的起点
        maxW：最大宽度，超过后会自动换行
 */
function drawRectText(ctx, color, size, text, destX, destY, maxW) {
    let lineWidth = 0;          //每一行的宽度
    let lastSubStrIndex = 0;
    let lineHeight = size + 3;    //行高
    ctx.font = size + "px 微软雅黑";
    ctx.fillStyle = color;
    destY+=size;   //坐标是文字的左下角，所以得转换成左上角
    for (let i = 0; i < text.length; i++) {
        lineWidth += ctx.measureText(text[i]).width;
        if (lineWidth > maxW || text[i] === '\n') {
            ctx.fillText(text.substring(lastSubStrIndex, i), destX, destY);
            destY += lineHeight;
            lineWidth = 0;
            if (text[i] === '\n')
                lastSubStrIndex = i + 1;
            else
                lastSubStrIndex = i;
        }
        if (i === text.length - 1) {
            ctx.fillText(text.substring(lastSubStrIndex, i + 1), destX, destY);
        }
    }
}