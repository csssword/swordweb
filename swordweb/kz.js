var $report;
function addKzSubmitDiv(){
	var her = document.location.href;
	var reher = document.referrer;
	var title = document.body.getElement('title');
	if(her.indexOf("login.html")!=-1)return; //排除登陆页面  
	if(her.indexOf("MH011TqgxhxxCtrl_openWin")!=-1)return; //排除首页
	if(her.indexOf("Pre_HxzgTyslProxy_initIntegratedAcceptPage")!=-1) return; //排除统一受理页面
	if(her.indexOf("Pre_HxzgTyslProxy_tyslView")!=-1) return; //排除统一受理页面
	if(her.indexOf("mh040_dbsyjcInit")!=-1) return;//排除待办事宜
	if(her.indexOf("Pre_WorkItemProxy_initDaiBanRwPage")!=-1) return;//排除待办任务
	if(her.indexOf("Mh102UserTableCtrl_hasPermisson")!=-1||her.indexOf("Mh109IpadGnsShowCtrl_openhtml")!=-1) return;//排除门户指定页面
	if($defined($report))return;
	if(reher.indexOf("tid=cx")!=-1||her.indexOf("tid=cx")!=-1)return;  //排除查询用例
	
	if($chk(title)&&title.innerText.indexOf("访问系统出现异常")!=-1)return;//排除异常用例
	if($chk($(document.body).getElements('div[sword=SwordWorkflow]')[0]))return;//排除工作流进入用例
	var tooBar =$(document.body).getElements('div[sword=SwordToolBar]').get('name');
	if(tooBar.length!=0){
		 var toolBar=tooBar[0];
		 if(!$chk(toolBar))return;
		 var myFirstElement  = new Element('div', {name:'tybddy',type:'print',caption:'表单打印',onclick:'beforeSubmitDiv()',enabled:'true'});
		 $(document.body).getElements('div[name='+toolBar+']').grab(myFirstElement);
	}else{
		  var myFirstElement  = new Element('div', {name:'ToolBarButton',sword:'SwordToolBar',showType:'mini'});
		  var FirstElement  = new Element('div', {name:'tybddy',type:'print',caption:'表单打印',onclick:'beforeSubmitDiv()',enabled:'true'});
		  $(myFirstElement).grab(FirstElement);
		  var wrapper = $(document.body).getElements('div[class=wrapper]')[0];
		  if($chk(wrapper))$(wrapper).grab(myFirstElement,'top');
		  else $(document.body).grab(myFirstElement,'top');
	}
}

function getTybddyName(){  //为工作流提供获取接口
	return "tybddy";
}
function getTybddyDiv(){//为工作流提供获取接口
	return new Element('div', {name:'tybddy',type:'print',caption:'表单打印',onclick:'beforeSubmitDiv()',enabled:'true'});
}

function beforeSubmitDiv(){
	 var swordSubmits =$(document.body).getElements('div[sword=SwordSubmit]').get('name');
	 if (swordSubmits.length != 0) {
			for ( var i = 0; i < swordSubmits.length; i++) {
				var subname = swordSubmits[i];
				$w(subname).button.getParent().setStyle("display", "none");
			}
		}	 
	 var minBoxs = $(document.body).getElements('div[class=tb_mini_box]');
	 if(minBoxs.length !=0){
		 for(var i=0;i<minBoxs.length;i++){
			 minBoxs[i].setStyle('display', 'none');
		 }
	 }
	 var boxs = $(document.body).getElements('div[class=tb_box]');
	 if(boxs.length !=0){
		 for(var i=0;i<boxs.length;i++){
			 boxs[i].setStyle('display', 'none');
		 }
	 }
	 var wf = $(document.body).getElement('div[name=SwordWorkflowtoolbar]');
	 if($chk(wf))wf.setStyle('display', 'none');
	
   //  WebBrowser.ExecWB(7,1);

	window.print();
	if (swordSubmits.length != 0) {
		for ( var i = 0; i < swordSubmits.length; i++) {
			var subname = swordSubmits[i];
			var isshow=$w(subname).options.isShow;
			if(isshow=='true'){
			$w(subname).show(); 
			}
		}
	}
	 if(minBoxs.length !=0){
		 for(var i=0;i<minBoxs.length;i++){
			 minBoxs[i].setStyle('display', '');
		 }
	 }
	 if(boxs.length !=0){
		 for(var i=0;i<boxs.length;i++){
			 boxs[i].setStyle('display', '');
		 }
	 }
	 if($chk(wf))wf.setStyle('display', '');
	
}
