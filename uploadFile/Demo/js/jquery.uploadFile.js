/**
* @ignore  =====================================================================================
* @overview 该文档主要完成主要任务是 文件上传
* @author  Yangfan
* @version 0.0.5
* @ctime  created in 2017-08-07
* @depend  Library jQuery
* @compatibility  IE10+
* @ignore  =====================================================================================
*/

; (function ($, win) {
    // =======================图片预览  IE10+ ==================================
    function previewImage(input_file, picBox, callback) {
        var path,
            id = 'imgTmp',
            img;

        var createImg = function (src) {
            img = new Image();
            img.src = path;
            img.id = id;
            img.onload = function () {
                callback && callback(img); // 图片加载完成，回调
            };
            picBox.innerHTML = '';
            picBox.appendChild(img);
        };

        if (typeof FileReader !== 'undefined') { //  FileReader    IE10+
            var reader = new FileReader();
            reader.onload = function (e) {
                var ev = e || window.event,
                    target = ev.target || ev.srcElement;

                path = target.result;
                createImg(path);
            };
            reader.readAsDataURL(input_file); // 该方法会读取指定的 Blob 或 File 对象。读取操作完成的时候，readyState 会变成已完成（DONE），并触发 loadend 事件，同时 result 属性将包含一个data:URL格式的字符串（base64编码）以表示所读取文件的内容
            console.info('预览方式 FileReader');
        } else if (typeof URL !== 'undefined') { //  createObjectURL   IE10+
            path = window.URL.createObjectURL(input_file.files[0]);
            createImg(path);
            console.info('预览方式 createObjectURL');
        } else {  //  IE  滤镜
            imgFile.select();
            path = document.selection.createRange().text;
            picBox.innerHTML = "";
            picBox.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true',sizingMethod='scale',src=\"" + path + "\")"; // 使用滤镜效果
            callback && callback(picBox);
            console.info('预览方式 IE 滤镜');
        }
    }
    // 2K -> 2048
    function formatByte(str) {
        if (/^\d+$/g.test(str)) {
            return str;
        } else {
            var s = {
                'B': 1,
                'K': 1024,
                'M': 1024 * 1024,
                'G': 1024 * 1024 * 1024,
                'T': 1024 * 1024 * 1024 * 1024
            }
            var arr = [];
            str = str.toUpperCase().replace(/([B|K|M|G|T])/g, ',$1');
            arr = str.split(',');
            return arr[0] * s[arr[1]];
        }
    }
    // 扩展
    $.fn.extend({
        uploadFile: function (config) {
            var $ele = this, // jQuery
                ele = this[0], // js
                file, // 文件  input[file]
                data = {}, // 额外数据
                isCanSend = false; // 默认禁止上传

            // 初始化 accept='image/jpg,image/gif'
            if (config.accept && config.accept.length > 0) {
                ele.accept = (config.accept).map(function (item, index) {
                    return item = 'image/' + item;
                }).join(',').replace('jpg', 'jpeg');
            }
            // 上传
            $ele.on('change', function (e) {
                var ev = e || window.event,
                    target = ev.target || ev.srcElement;
                file = target.files[0];
                // 暴露出回调
                if (typeof (config.onBeforeChange) === 'function') {
                    config.onBeforeChange(file);
                }
                if (file) {
                    console.info('您已选择图片');
                    // 判断文件类型
                    if (!!config.accept) {
                        var reg = new RegExp('\\.(' + config.accept.join('|') + ')$', 'g'); // Reg /\.(jpg|gif|png)$/g
                        if (!reg.test(file.name)) {
                            isCanSend = false;
                            config.acceptError && config.acceptError();
                            return false;
                        } else {
                            isCanSend = true;
                        }
                    }
                    // 判断文件大小
                    if (!!config.maxSize) {
                        if (file.size > formatByte(config.maxSize) || file.size == 0) {
                            config.sizeError && config.sizeError();
                            isCanSend = false;
                            return false;
                        } else {
                            isCanSend = true;
                        }
                    }
                    // 预览图片
                    if (isCanSend && config.previewBox) {
                        previewImage(file, $(config.previewBox).get(0), function (img) {
                            // 判断图片比例
                            if (config.scale && config.scale.length == 2) {
                                if (img.width >= config.scale[0] && img.height >= config.scale[1]) {
                                    isCanSend = true;
                                    config.previewCallBack && config.previewCallBack(img, data);
                                } else {
                                    config.scaleError && config.scaleError();
                                    isCanSend = false;
                                    return false;
                                }
                            } else {
                                config.previewCallBack && config.previewCallBack(img, data);
                            }
                        });
                    }
                } else {
                    console.info('您取消了选择');
                    file = null;
                    isCanSend = false;
                }

            });
            // 提交
            $(config.btn).on('click', function () {
                var isCanDoAjax = true;
                var formData = new FormData(); // 表单数据
                // 额外的回调
                if (typeof (config.onBeforeSend) === 'function') {
                    isCanDoAjax = config.onBeforeSend(data);
                }
                // 是否中断发送
                if (isCanDoAjax) {
                    // 发送普通数据
                    // 额外发送的数据 例如 appid
                    if (Object.keys(config.data).length > 0) {
                        for (key in config.data) {
                            formData.append(key, config.data[key]);
                        }
                    }
                    // 额外发送的数据 例如裁剪
                    if (Object.keys(data).length > 0) {
                        for (key in data) {
                            formData.append(key, data[key]);
                        }
                    }
                    // 发送文件
                    if (isCanSend) {
                        formData.append('file', file);
                    } else {
                        if (typeof config.sendNull === 'function') {
                            return config.sendNull(); // 是否中断ajax发送
                        }
                    }
                    // 发送
                    $.ajax({
                        url: config.url,
                        method: 'POST',
                        data: formData, // 表单数据
                        processData: false, // 不要对data参数进行序列化处理，默认为true
                        contentType: false, // 不要设置Content-Type请求头，因为文件数据是以 multipart/form-data 来编
                        success: function (res, status, xhr) {
                            isCanSend = false; // 禁止重复上传
                            config.ajaxSuccess && config.ajaxSuccess(res);
                        },
                        error: function (xhr, status, error) {
                            config.ajaxError && config.ajaxError(error);
                        }
                    });
                }
            });
            return $ele;
        }
    });
}(jQuery, window));