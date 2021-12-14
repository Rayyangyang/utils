function compress(file) { // 传入 fileobj 即可

  function dataURLtoFile(dataurl, filename) {//将base64转换为文件，dataurl为base64字符串，filename为文件名（必须带后缀名，如.jpg,.png）
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  return new Promise(function (resolve, reject) {
    // 最终base64
    var resultImg = '';
    var _fileSize = (file.size / (1024 * 1024)).toFixed(2);
    // 生成一个文件读取的对象
    var reader = new FileReader();
    // 判断是否需要压缩
    if (_fileSize > 4) {
      // console.log("大小为" + _fileSize + "M，要压缩")
      // 计算比例
      // 大于4M则需要压缩，根据文件大小与3M的比例压缩图片，这样只需要压缩一次即可小于3M
      var _scale = (3 / _fileSize).toFixed(2);
      // 创建一个img
      var _img = new Image();
      reader.onloadend = function (e) {
        _img.src = e.target.result;
      };

      _img.onload = function () {
        // 缩放图片需要的canvas（也可以在DOM中直接定义canvas标签，这样就能把压缩完的图片不转base64也能直接显示出来）
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        // 图片原始尺寸
        var originWidth = this.width;
        var originHeight = this.height;

        // 目标尺寸
        var targetWidth = originWidth * _scale,
          targetHeight = originHeight * _scale;

        // canvas对图片进行缩放
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        // 清除画布
        context.clearRect(0, 0, targetWidth, targetHeight);
        // 图片压缩
        context.drawImage(_img, 0, 0, targetWidth, targetHeight);
        /*第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高*/

        //压缩后的图片转base64 url
        /*canvas.toDataURL(mimeType, qualityArgument),mimeType 默认值是'image/png';
         * qualityArgument表示导出的图片质量，只有导出为jpeg和webp格式的时候此参数才有效，默认值是0.92*/
        resultImg = canvas.toDataURL('image/jpeg', 0.92);//base64 格式
        resolve(dataURLtoFile(resultImg, file.name));
      }
    } else {
      // console.log("大小为" + _fileSize + "M，不压缩")
      reader.onloadend = function (e) {
        resolve(dataURLtoFile(e.target.result, file.name));
      };
    }
    //发起异步读取文件请求，读取结果为data:url的字符串形式，
    reader.readAsDataURL(file);
  })
}