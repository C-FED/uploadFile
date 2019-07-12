## uploadfile 
> jq插件：上传文件（图片带本地预览功能）插件



### 特点
1. 无flash依赖
1. 兼容IE10+
1. 带本地图片预览功能


### 配置

<table>
	<thead>
		<tr>
			<td>参数</td>
			<td>类型</td>
			<td>注释</td>
			<td>必须参数</td>
		</tr>
	</thead>
    <tbody>
    	<tr>
    		<td>url</td>
    		<td>String</td>
			<td>上传文件的url地址</td>
			<td>否</td>
    	</tr>
    	<tr>
    		<td>btn</td>
    		<td>String</td>
			<td>选择器 上传按钮</td>
			<td>否</td>
    	</tr>
    	<tr>
    		<td>accept</td>
    		<td>Array</td>
			<td>上传文件的格式类型（写文件名后缀）</td>
			<td>否</td>
    	</tr>
    	<tr>
    		<td>maxSize</td>
    		<td>String</td>
			<td>上传文件的最大值</td>
			<td>否</td>
    	</tr>
    	<tr>
    		<td>scale</td>
    		<td>Array</td>
			<td>图片大小的最小范围（用于后台裁剪图片时）</td>
			<td>否</td>
    	</tr>
    	<tr>
    		<td>data</td>
    		<td>Object</td>
			<td>除文件以外的其他所需数据</td>
			<td>否</td>
    	</tr>
    	<tr>
    		<td>previewBox</td>
    		<td>String</td>
			<td>选择器 图片预览框</td>
			<td>否</td>
    	</tr>
    	<tr>
    		<td>previewCallBack</td>
    		<td>Function</td>
			<td>图片预览回调函数 （例如，进行图片裁剪）</td>
			<td>否</td>
    	</tr>
    	<tr>
    		<td>onFileChange</td>
    		<td>Function</td>
			<td>选择图片的change事件,暴露出文件信息</td>
			<td>否</td>
    	</tr>
    	<tr>
    		<td>onBeforeSend</td>
    		<td>Function</td>
			<td>上传图片的发送事件</td>
			<td>否</td>
    	</tr>
    	<tr>
    		<td>acceptError</td>
    		<td>Function</td>
			<td>文件类型错误的回调函数</td>
			<td>否</td>
    	</tr>
    	<tr>
    		<td>sizeError</td>
    		<td>Function</td>
			<td>文件大小不符的回调函数,0 代表文件为空，1 代表文件超限</td>
			<td>否</td>
    	</tr>
    	<tr>
    		<td>scaleError</td>
    		<td>Function</td>
			<td>图片比例不符的回调函数</td>
			<td>否</td>
    	</tr>
    	<tr>
    		<td>sendNull</td>
    		<td>Function</td>
			<td>未选择文件的回调函数</td>
			<td>否</td>
    	</tr>
    	<tr>
    		<td>ajaxSuccess</td>
    		<td>Function</td>
			<td>文件上传成功的回调函数</td>
			<td>否</td>
    	</tr>
    	<tr>
    		<td>ajaxError</td>
    		<td>Function</td>
			<td>文件上传失败的回调函数</td>
			<td>否</td>
    	</tr>
    </tbody>
</table>


### 使用

1. 引入相关js文件

```html

<script type="text/javascript" src="path/jquery.min.js"></script>
<script type="text/javascript" src="path/jquery.uploadFile.js"></script>

```

2. 简单使用

```js

$('#file').uploadFile({  // '#file' 是 <input type="file" /> 元素                                                                   
     url:'./php/getFile.php', // 必须参数
     btn:'#send', // selector 必须参数
});

```


3. 完整使用示例

```js

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
      onBeforeChange:function () { // file change事件
        console.log('选择图片中。。。');
      },
      onBeforeSend:function (data) { // 中断上传   true:'可以上传'  false:'禁止上传' 
        return btnSave(data);
      },
      ajaxSuccess:function (data) { // 上传成功
        console.log(data);
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

### MIT license
Copyright (c) 2019 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the &quot;Software&quot;), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---
built upon love by [docor](https://github.com/turingou/docor.git) v0.3.0
