import { MIMETYPE } from './utils/constant';
import { formatByte } from './utils';

/**
 * 图片预览  IE10+
 * @param {File} input_file 
 * @param {HTMLElement} picBox 
 * @param {function(HTMLImageElement)} callback 
 */
function previewImage(input_file, picBox, callback) {
    let createImg = function (path) {
        let img = new Image();
        img.src = path;
        img.id = 'imgTmp';
        img.onload = function () {
            callback && callback(img); // 图片加载完成，回调
        };
    };

    if (FileReader !== void 0) { //  FileReader    IE10+
        let reader = new FileReader();
        reader.onload = function (e) {
            let ev = e || window.event,
                target = ev.target || ev.srcElement;

            let path = target.result;
            createImg(path);
        };
        // 该方法会读取指定的 Blob 或 File 对象。
        // 读取操作完成的时候，readyState 会变成已完成（DONE），并触发 loadend 事件，
        // 同时 result 属性将包含一个data:URL格式的字符串（base64编码）以表示所读取文件的内容
        reader.readAsDataURL(input_file);
    } else if (URL !== void 0) { //  createObjectURL   IE10+
        let path = window.URL.createObjectURL(input_file.files[0]);
        createImg(path);

    } else {  //  IE  滤镜
        input_file.select();
        let path = document.selection.createRange().text;
        picBox.innerHTML = "";
        picBox.style.filter = `progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true',sizingMethod='scale',src="${path}")`; // 使用滤镜效果
        callback && callback(picBox);

    }
}

// prop func
$.fn.extend({
    uploadFile: function (config) {
        let $ele = this; // jQueryElement
        let ele = this[0]; // HTMLElement
        let file; // 文件  input[file]
        let data = {}; // 额外数据
        let isCanSend = false; // 默认禁止上传

        try {
            // Init 初始化 accept='image/jpg,image/gif'
            if (config.accept && config.accept.length > 0) {
                ele.accept = (config.accept).map(function (item, index) {
                    return MIMETYPE[item] || '';
                }).join(',');
            }

            // Event change 选择文件
            $ele.on('change', function (e) {
                let ev = e || window.event,
                    target = ev.target || ev.srcElement;
                file = target.files[0];

                // onFileChange 暴露出文件信息
                if (typeof config.onFileChange === 'function') {
                    config.onFileChange(file);
                }
                // 判断是否选择文件
                if (file) {
                    isCanSend = true;
                    // 1. 判断文件类型 后缀
                    if (!!config.accept) {
                        // jpg,jpeg=>jpg  img*=>image
                        config.accept = config.accept.map(function (item, index, array) {
                            if (item === "img*") {
                                item = "image";
                            }
                            return item;
                        });

                        let reg = new RegExp(`\\.(${config.accept.join('|')})$`, 'g'); // Reg /\.(jpg|gif|png)$/g
                        // 判断文件后缀
                        if (!reg.test(file.name)) {
                            isCanSend = false;
                            // 判断是否是图片文件 image/*
                            if (!!~file.type.indexOf("image") && !!~config.accept.indexOf("image")) {
                                isCanSend = true;
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
                    if (file.size === 0) {
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
                            if (config.scale && config.scale.length === 2) {
                                if (img.width >= config.scale[0] && img.height >= config.scale[1] && img.height <= $(window).height()) {
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
            if (config.btn && config.url) {
                $(config.btn).on('click', function () {
                    let isCanDoAjax = true;
                    let formData = new FormData(); // 表单数据
                    // 额外的回调
                    if (typeof config.onBeforeSend === 'function') {
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
            console.error(err);
        }
        return this;
    }

});
