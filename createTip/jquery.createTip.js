/**
  * Theme: createTip
  * Author: Who am I
  * dev: jquery
  * usage:1.  $(el).createTip("提示内容","info | warn | ok | error");
  		  2.  $(el).createAlert(html_head,html_body,callback);
  * memo: 兼容移动端 compatible Moblie
  */
;$.fn.extend({
	"createTip":function (content,type) {
		var me=this;
		var limit=6;

		// 把容器放入页面中
		if ($(".g_tipcontainer").length===0) {
			var html=`<div class="g_tipcontainer"></div>`;
			var parent=$(html);
			$(me).append(parent);
		}
		// 限制提示框数量
		if ($(".g_tipbox").length<limit) {
			var tipType={
				"info":'<span class="tip_type info"><i class="fa fa-info" aria-hidden="true"></i></span>',
				"ok":'<span class="tip_type ok"><i class="fa fa-check" aria-hidden="true"></i></span>',
				"warn":'<span class="tip_type warn"><i class="fa fa-warning" aria-hidden="true"></i></span>',
				"error":'<span class="tip_type error"><i class="fa fa-times" aria-hidden="true"></i></span>'
			};
			var html=`<div class="g_tipbox `+(type || "info")+`">
						`+tipType[(type || "info")]+`
						<span class="tip_content">`+(content || "这里写提示内容")+`</span>
					</div>`;
			var tip=$(html);
			$(".g_tipcontainer").prepend(tip);
			tip.on("animationend",function () {
				tip.remove();
			});

			return tip;
		}
		
	},
	"createAlert":function (html_head,html_body,callback) {
		var me=this;

		// 防止重复
		if ($(".g_alertbox").length===0) {
			var html=`<div class="g_alertbox">
						<div class="box_backscreen"></div>
						<div class="box_main">
							<div class="main_closebtn">&times;</div>
							<div class="main_head">
								<p class="head_title">`+(html_head || "确定删除吗？")+`</p>
							</div>
							<div class="main_body">`+(html_body || "")+`</div>
							<div class="main_foot">
								<div class="foot_btn no">取消</div>
								<div class="foot_btn yes">确定</div>
							</div>
						</div>
					</div>`;

			var me_alert=$(html);
			$(me).append(me_alert);

			var $alertBox=$(me).find(".g_alertbox"),
				$closeBtn=$alertBox.find(".main_closebtn"),
				$footbtnNo=$alertBox.find(".foot_btn.no"),
				$footbtnYes=$alertBox.find(".foot_btn.yes");

			var hideBox=function () {
				$alertBox.fadeOut(600,function () {
					$alertBox.remove();
				});
			};
			// 取消按钮
			$closeBtn.on("click",function () {
				hideBox();
			});
			$footbtnNo.on("click",function () {
				hideBox();
			});
			// 确定按钮
			$footbtnYes.on("click",function () {
				hideBox();
				// 回调函数
				callback && callback();
			});
			// 渐入
			me_alert.fadeIn(300);

			return me_alert;
		}
			
	}
});
