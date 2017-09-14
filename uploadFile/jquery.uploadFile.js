/**
* @ignore  =====================================================================================
* @overview 该文档主要完成主要任务是 文件上传
* @author  Yangfan2016
* @version 1.0.3
* @ctime  created in 2017-09-14
* @depend  Library jQuery
* @compatibility  IE10+
* @ignore  =====================================================================================
*/

;(function ($, window) {
	var MIMETYPE={
        'doc':'application/msword',
        'docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'ppt':'application/vnd.ms-powerpoint',
        'pptx':'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'xls':'application/vnd.ms-excel',
        'xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'pdf':'application/pdf',
        'zip':'application/zip',
        'xml':'application/xml',
        'js':'application/javascript',
        'json':'application/json',
        'txt':'text/plain',
        'html':'text/html',
        'css':'text/css',
        'jpg':'image/jpeg',
        'jpeg':'image/jpeg',
        'png':'image/png',
        'gif':'image/gif',
        'bmp':'image/bmp',
        'webp':'image/webp',
        'ico':'image/x-icon',
        'img*':'image/*' // bug
    };
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

        } else if (typeof URL !== 'undefined') { //  createObjectURL   IE10+
            path = window.URL.createObjectURL(input_file.files[0]);
            createImg(path);

        } else {  //  IE  滤镜
            input_file.select();
            path = document.selection.createRange().text;
            picBox.innerHTML = "";
            picBox.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true',sizingMethod='scale',src=\"" + path + "\")"; // 使用滤镜效果
            callback && callback(picBox);

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

            // 验证必选参数
            try {
                if (typeof config.url!=="string" || typeof config.btn!=="string") {
                    throw "url或btn参数错误";
                } else {
                    // Init 初始化 accept='image/jpg,image/gif'
                    if (config.accept && config.accept.length > 0) {
                        ele.accept = (config.accept).map(function (item, index) {
                            return MIMETYPE[item] || '';
                        }).join(',');
                    }

                    // Event change 选择文件
                    $ele.on('change', function (e) {
                        var ev = e || window.event,
                            target = ev.target || ev.srcElement;
                        file = target.files[0];

                        // onFileChange 暴露出文件信息
                        if (typeof (config.onFileChange) === 'function') {
                            config.onFileChange(file);
                        }
                        // 判断是否选择文件
                        if (file) {
                            isCanSend=true;
                            // 1. 判断文件类型 后缀
                            if (!!config.accept) {
                                // jpg,jpeg=>jpg  img*=>image
                                config.accept=config.accept.map(function (item,index,array) {
                                    if (item==="img*") {
                                        item="image";
                                    }
                                    return item=="jpeg"?"jpg":item;
                                });

                                var reg = new RegExp('\\.(' + config.accept.join('|') + ')$', 'g'); // Reg /\.(jpg|gif|png)$/g
                                // 判断文件后缀
                                if (!reg.test(file.name)) {
                                    isCanSend = false;
                                    // 判断是否是图片文件 image/*
                                    if (file.type.indexOf("image")!==-1) {
                                        if (config.accept.indexOf("image")!==-1) {
                                            isCanSend=true;
                                        }
                                    }
                                    if (!isCanSend) {
                                        config.acceptError && config.acceptError();
                                        return false;
                                    }
                                } else {
                                    isCanSend = true;
                                }
                                    
                            }
                            // 2. 判断文件大小
                            if (file.size==0) {
                                config.sizeError && config.sizeError(0);
                                isCanSend = false;
                                return false;
                            } else {
                                if (!!config.maxSize) {
                                    if (file.size > formatByte(config.maxSize)) {
                                        config.sizeError && config.sizeError(1);
                                        isCanSend = false;
                                        return false;
                                    } else {
                                        isCanSend = true;
                                    }
                                }
                            } 
                            // + 预览图片
                            if (isCanSend && config.previewBox) {
                                previewImage(file, $(config.previewBox).get(0), function (img) {
                                    // 判断图片比例
                                    if (config.scale && config.scale.length == 2) {
                                        if (img.width >= config.scale[0] && img.height >= config.scale[1] && img.height<=$(window).height()) {
                                            isCanSend = true;
                                            // 加载图片，进行预览
                                            $(config.previewBox).html('');
                                            $(config.previewBox).append(img);
                                            // 执行预览图片后的回调
                                            config.previewCallBack && config.previewCallBack(img, data);
                                        } else {
                                            config.scaleError && config.scaleError();
                                            isCanSend = false;
                                            return false;
                                        }
                                    } else {
                                        // 加载图片，进行预览
                                        $(config.previewBox).html('');
                                        $(config.previewBox).append(img);
                                        config.previewCallBack && config.previewCallBack(img, data);
                                    }
                                });
                            }
                        } else {
                            file = null;
                            isCanSend = false;
                        }
                    });

                    // Event upload 提交
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
                            if (config.data && Object.keys(config.data).length > 0) {
                                for (key in config.data) {
                                    formData.append(key, config.data[key]);
                                }
                            }
                            // 额外发送的数据 例如裁剪
                            if (data && Object.keys(data).length > 0) {
                                for (key in data) {
                                    formData.append(key, data[key]);
                                }
                            }
                            // 将文件信息填入表单
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
                                contentType: false, // 不要设置Content-Type请求头，因文件数据是以 multipart/form-data 来编
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
                }
            } catch (err) {
                console.error(new Error("有错误！！！ "+err));
            } 

            return this;
        }
    });
}(jQuery, window));
