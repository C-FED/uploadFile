## jq插件：上传文件（图片带本地预览功能）插件



### 特点
1. 无flash依赖
1. 兼容IE10+
1. 带图片预览功能


### 配置

```

    // 上传插件
    $('#file').uploadFile({
      url:'./php/getFile.php', // 必须参数
      btn:'#send', // selector 必须参数
      accept:['jpg','gif','png'], // 文件名后缀
      maxSize:'300K', // 2B 2K 2M 2G
      scale:[341,341], // 裁剪图片的最小范围（后台）
      previewBox:'#picBox', // selector,
      data:{
        'x':0,
        'y':0,
        'w':100,
        'h':100,
        'appID':(new Date()).getTime()
      }, // 额外数据
      previewCallBack:function (img,data) { // 预览图片回调
        cutImg(img,data);
      },
      sendNull:function (message) { // 未选择文件
        alert('未选择文件！');
      },
      onFileChange:function () { // file change事件
        console.log('选择图片中。。。');
      },
      onBeforeSend:function (data) { // 中断上传   true:'可以上传'  false:'禁止上传' 
        return btnSave(data);
      },
      ajaxSuccess:function (data) { // 上传成功
        console.log(data);
        $('#picBox').html('');
      },
      ajaxError:function (error) { // 上传失败
        console.log(error);
      },
      scaleError:function () { // 图片比例不合适
        alert('图片比例不合适！');
      },
      acceptError:function () { // 文件类型不符
        alert('文件类型不符合！');
      },
      sizeError:function () { // 文件大小不符
        alert('文件大小不符合！');
      }
    });

```
