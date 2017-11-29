/**
 *快捷收款> 快捷收款列表
 */
sysController.controller("fastPayListController", ["$scope", "$http", "$window", "$cookieStore", "$timeout","$dateTool", "$grid", "$getSelectTypes","$filter","GET_TOKEN","QINIU",
    function($scope, $http, $window, $cookieStore, $timeout,$dateTool, $grid, $getSelectTypes,$filter,GET_TOKEN,QINIU) {


        /*调用七牛上传*/
        var Qiniu = new QiniuJsSDK();
        var maxLen=10,minLen=1;
        GET_TOKEN();
        QINIU.OPTION.uptoken=$cookieStore.get("UPTOKEN");
        QINIU.FUN(maxLen,minLen,$scope);
        QINIU.FileUploaded({scope:$scope});//图片模块上传
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"upPhotosBtn",multi_selection: false}));


        /*list*/
        $grid.initial($scope, [$window.API.FASTPAY.LIST].join(""),{orderBy:"createTime"});

        /*初始化日历*/
        $dateTool.ele('.form_datetime_start,.form_datetime_end',{format: "yyyy-mm-dd",minView :2});
        $scope.list={};

        /*获取常用枚举*/
        $http.get([$window.API.FASTPAY.LIST,"/enum"].join("")).success(function(res){
            if(res.stateCode===0){
                $scope.payToolTypes =res.data.payToolTypes ; //付款方式
            }
        });

        /*查询*/
        var postData={};
        $scope.submitSearch=function(dt){
            postData=angular.copy(dt)||{};
            $scope.dateThan=$dateTool.compare({startTime:'#beginTime',endTime:'#endTime',required:false,isEqual:false});// 时间判断
            if(( $scope.dateThan)){
                return false;
            }
            postData.orderBy='createTime';
            postData.beginTime=$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyy-MM-dd');
            postData.endTime=$filter('date')($.trim(angular.element("#endTime").val()), 'yyyy-MM-dd');
            $scope.filtering(postData);
        };

        /*一键生成Excel表*/
        var postExcelData={};
        $scope.createExcel=function(dt){
            postExcelData=angular.copy(dt)||{};
            $scope.dateThan=$dateTool.compare({startTime:'#beginTime',endTime:'#endTime',required:false,isEqual:false});// 时间判断
            if(( $scope.dateThan)){
                return false;
            }
            postExcelData.orderBy='createTime';
            postExcelData.beginTime=$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyy-MM-dd');
            postExcelData.endTime=$filter('date')($.trim(angular.element("#endTime").val()), 'yyyy-MM-dd');
            $window.location.href=[
                $window.API.FASTPAY.LIST_EXCEL,
                "?userAuditStatus=",postExcelData.userAuditStatus,
                "&bindingCard=",postExcelData.bindingCard,
                "&getPermission=",postExcelData.getPermission,
                "&isTwitter=",postExcelData.isTwitter,
                "&withdrawDeposit=",postExcelData.withdrawDeposit,
                "&beginTime=",postExcelData.beginTime,
                "&endTime=",postExcelData.endTime,
                "&searchKey=",postExcelData.searchKey
            ].join("");
        };


        /*身份认证信息*/
        $scope.$watch('list.userAuditStatus',function(dt){
            if(dt!==undefined){
                $scope.filtering($scope.list);
            }
        });
        /*绑定收款银行卡*/
        $scope.$watch('list.bindingCard',function(dt){
            if(dt!==undefined){
                $scope.filtering($scope.list);
            }
        });
        /*快捷收款权限*/
        $scope.$watch('list.getPermission',function(dt){
            if(dt!==undefined){
                $scope.filtering($scope.list);
            }
        });
        /*是否是推客*/
        $scope.$watch('list.isTwitter',function(dt){
            if(dt!==undefined){
                $scope.filtering($scope.list);
            }
        });
        /*是否存在提现申请*/
        $scope.$watch('list.withdrawDeposit',function(dt){
            if(dt!==undefined){
                $scope.filtering($scope.list);
            }
        });


      
        /*查看身份认证信息dialog*/
        $scope.identityAuthenticationInfo=function(dt){
            angular.element('.createDialog3').modal({backdrop: 'static', keyboard: false});
            var cdt=angular.copy(dt);
            $http.get([$window.API.FASTPAY.LIST,"/",cdt.id,"/audit"].join("")).success(function (res) {
                if(res.stateCode===0&&res.data){
                    var identityInfo = res.data.identityInfo;
                    var bindCardInfo = res.data.bindCardInfo;
                    $scope.updateKey = res.data.updateKey;
                    $scope.auditInfo={
                        "posId":cdt.id,
                        "realName":identityInfo.realName,
                        "idCardNo":identityInfo.idCardNo,
                        "idImageA":identityInfo.idImageA,
                        "idImageB":identityInfo.idImageB,
                        "idHoldImage":identityInfo.idHoldImage,
                        "cardNO":bindCardInfo.cardNO,
                        "posCardImage":bindCardInfo.posCardImage,
                        "userAuditStatus":cdt.userAuditStatus,
                        "userAuditStatusDesc":cdt.userAuditStatusDesc
                    }
                }else {
                    errorMsg.make({msg:res.message});
                }
            });
        }
        /*审核不通过*/
       	$scope.auditNoPass=function(){
       		angular.element('.createDialog4').modal({backdrop: 'static', keyboard: false});
       		$scope.rejectReason="";//初始化原因为空
       		
       	}
       	/*提交审核不通过/通过*/
       	var ispass = true;
        $scope.audit=function(bool,posId,updateKey,rejectReason){
        	if(!bool&&!rejectReason){
        		$scope.errorMsg="请填写原因"
        		return false;
        	}
        	$scope.errorMsg=null;
        	if(ispass){
        		ispass = false;
        		$http({ url:[$window.API.FASTPAY.LIST,"/",posId,"/audit",
		            "?allowed=",bool,
		            "&updateKey=",updateKey,
		            "&rejectReason=",rejectReason || ""
	            ].join(""), method:'post'}).success(function(res){
	            	ispass=true;
	                if(res.stateCode===0){
	                    successMsg.make({msg:'提交成功!'});
	                    angular.element('.createDialog4').modal('hide');
	                    angular.element('.createDialog3').modal('hide');
	                    $scope.refresh();
	                }else{
	                    errorMsg.make({msg:res.message});
	                }
	
	            });
        	}
            
        }
		
        /*打开dialog 修改权限*/
        $scope.roots={};
        $scope.createDialog=function(dt){
            angular.element('.createDialog').modal({backdrop: 'static', keyboard: false});
            var cdt=angular.copy(dt);
            $scope.rootSet=cdt;
            $scope.roots={
                "id":cdt.id,
                "userId":cdt.userId,
                "get":cdt.baseAuth.get===2?true:false,
                "getRate":Math.round(cdt.baseAuth.getRate*10000)/100,
                "poundage":cdt.baseAuth.poundage,
                "twitterStatus":cdt.baseAuth.twitterStatus===2?true:false,
                "develop":cdt.baseAuth.develop===2?true:false,
                "spread":cdt.baseAuth.spread===2?true:false,
                "disabled":false//这个是控制 发展下级推客 发展收款客户 禁止选择的
            }
			
			var firstGetRate = Math.round(cdt.baseAuth.getRate*10000)/100;
            /*推客 发展下级推客 发展收款客户 三个单选框的状态监控*/
            $scope.$watch('roots.twitterStatus',function(newV,oldV){
            	/*console.log("newV:"+newV);
            	console.log("oldV:"+oldV);
				console.log($scope.roots.getRate);
				console.log(firstGetRate)*/
   				if(newV!==oldV){
   					if(newV){
   						$scope.roots.getRate=0.45;
   						$scope.roots.disabled=false;
   						$scope.roots.develop=$scope.roots.spread=true;
   					}else {
   						$scope.roots.getRate=0.58;
   						$scope.roots.disabled=true;
   						$scope.roots.develop=$scope.roots.spread=false;
   					}
   				}else {
   					$scope.roots.getRate = firstGetRate
   				}

            });
        };

        /*提交dialog*/
       var ispass=true;
        $scope.createDialogSumbitRoot=function(dt){
        	var reg = /^\d+(?:\.\d{1,4})?$/i;
        	if(!reg.test(dt.getRate)){
        		$scope.roots.errorMsg="只能输入数字和小数";
            	return false;
        	}
            if(dt.getRate<0.43){
            	$scope.roots.errorMsg="手续费率必须大于0.43且小于1.00";
            	return false;
            }
            $scope.roots.errorMsg=null;
            var data={
                "get": dt.get===true?2:3,
                "getRate": dt.getRate/100,
                "poundage": dt.poundage,
                "twitterStatus": dt.twitterStatus===true?2:3,
                "spread": dt.spread===true?2:3,
                "develop": dt.develop===true?2:3
            };
			if(ispass){
                ispass=false;
                $http({ url:[$window.API.FASTPAY.LIST,"/",dt.id,"/permission"].join(""), method:'post',data:data}).success(function(res){
                	ispass=true;
                    if(res.stateCode===0){
                        successMsg.make({msg:'提交成功!'});
                        angular.element('.createDialog').modal('hide');
                        $scope.refresh();
                    }else{
                        errorMsg.make({msg:res.message});
                    }

                });
	        }
        };
        


        /*打开dialog 处理申请*/
        var select=angular.element("#upPhotosBtn").nextAll(".img-show-box");
        $scope.createDialogPayAdd=function(dt){
            $scope.pay={};
            $scope.pay.amount=dt[1].toFixed(2);
            $scope.pay.id=dt[0];
            $scope.pay.userId=dt[2];
            select.attr("data-url",$scope.pay.credential ).html(QINIU.creatDom($scope.pay.credential ));//删除图片
            angular.element('.createDialog2').modal({backdrop: 'static', keyboard: false});
        };


        /*提交dialog*/
        var ispass=true;
        $scope.createDialogSumbitPay=function(dt){
            //console.log(select.attr('data-url'));
            $scope.pay.voucher =select.attr('data-url')?select.attr('data-url'):null;
            var data=dt;
            if(!data.payMode){
                $scope.pay.errorMsg="请选择付款方式!";
                return false
            }
            if(!data.voucher ){
                $scope.pay.errorMsg="请上传凭证!";
                return false
            }

            $scope.pay.errorMsg=null;
            delete data.errorMsg;
			console.log(data);
            if(ispass){
                ispass=false;
                $http({ url:[$window.API.FASTPAY.LIST,"/brokerage/record"].join(""), method:'post',data:data} ).success(function(res){
                    ispass=true;
                    console.log(res)
                    if(res.stateCode===0){
                        successMsg.make({msg:'提交成功!'});
                        $scope.refresh();
                        angular.element('.createDialog2').modal('hide');
                        select.attr('data-url',"");
                    }else{
                        errorMsg.make({msg:res.message});
                    }

                });
            }
        };
    }]);

/**
 *快捷收款> 交易列表
 */
sysController.controller("fastPayDealListController", ["$scope", "$http", "$window", "$cookieStore", "$timeout","$dateTool", "$grid", "$getSelectTypes","$filter","GET_TOKEN","QINIU",
    function($scope, $http, $window, $cookieStore, $timeout,$dateTool, $grid, $getSelectTypes,$filter,GET_TOKEN,QINIU) {
         /*调用七牛上传*/
        var Qiniu = new QiniuJsSDK();
        var maxLen=10,minLen=1;
        GET_TOKEN();
        QINIU.OPTION.uptoken=$cookieStore.get("UPTOKEN");
        QINIU.FUN(maxLen,minLen,$scope);
        QINIU.FileUploaded({scope:$scope});//图片模块上传
        Qiniu.uploader($.extend(QINIU.OPTION,{browse_button:"upPhotosBtn",multi_selection: false}));


        /*list*/
        $grid.initial($scope, [$window.API.FASTPAY.LIST_TRANSACTION].join(""),{orderBy:"createTime"});

        /*初始化日历*/
        $dateTool.ele('.form_datetime_start,.form_datetime_end',{format: "yyyy-mm-dd",minView :2});
        $scope.list={};

        /*获取常用枚举*/
        $http.get([$window.API.FASTPAY.LIST,"/enum"].join("")).success(function(res){
            if(res.stateCode===0){
                $scope.payToolTypes =res.data.payToolTypes ; //付款方式
            }
        });

        /*到账状态监控*/
        $scope.$watch('list.transactionStatus',function(dt){
            if(dt!==undefined){
                $scope.filtering($scope.list);
            }
        });


        /*查询*/
        var postData={};
        $scope.submitSearch=function(dt){
            postData=angular.copy(dt)||{};
            $scope.dateThan=$dateTool.compare({startTime:'#beginTime',endTime:'#endTime',required:false,isEqual:false});// 时间判断
            if(( $scope.dateThan)){
                return false;
            }
            postData.orderBy='createTime';
            postData.beginTime=$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyy-MM-dd');
            postData.endTime=$filter('date')($.trim(angular.element("#endTime").val()), 'yyyy-MM-dd');
            $scope.filtering(postData);
        };

        /*一键生成Excel表*/
        var postExcelData={};
        $scope.createExcel=function(dt){
            postExcelData=angular.copy(dt)||{};
            $scope.dateThan=$dateTool.compare({startTime:'#beginTime',endTime:'#endTime',required:false,isEqual:false});// 时间判断
            if(( $scope.dateThan)){
                return false;
            }
            postExcelData.orderBy='createTime';
            postExcelData.beginTime=$filter('date')($.trim(angular.element("#beginTime").val()), 'yyyy-MM-dd');
            postExcelData.endTime=$filter('date')($.trim(angular.element("#endTime").val()), 'yyyy-MM-dd');
            $window.location.href=[
                $window.API.FASTPAY.LIST_TRANSACTION_EXCEL,
                '?transactionStatus=',postExcelData.transactionStatus,
                '&beginTime=',postExcelData.beginTime,
                '&endTime=',postExcelData.endTime,
                '&searchKey=',postExcelData.searchKey
            ].join("");
        };

        
        /*重新发起结算*/
        $scope.againStart=function(recordId){
             if(confirm("确定再次发起结算吗？")){
                $http.post([$window.API.FASTPAY.LIST_TRANSACTION,"/",recordId,'/withdraw/again'].join("")).success(function(res){
                    if(res.stateCode===0){
                        successMsg.make({msg:'操作成功!'});
                        $scope.refresh();
                    }else{
                        errorMsg.make({msg:res.message});
                        $scope.refresh();
                    }
                });
                
            }
        }
        /*手动处理结算*/
       $scope.pay={};
        var select=angular.element("#upPhotosBtn").nextAll(".img-show-box");
        $scope.manualProcessing=function(dt){
            $scope.pay.recordId=dt.id; 
            $scope.pay.amount=dt.arrivalAmount;//结算金额=到账金额
            select.attr("data-url",$scope.pay.credential ).html(QINIU.creatDom($scope.pay.credential ));//删除图片
            angular.element('.createDialog-manualProcessing').modal({backdrop: 'static', keyboard: false});
        }

        /*提交 手动处理结算dialog*/
        var ispass=true;
        $scope.createDialogSumbitPay=function(dt){
            $scope.pay.voucher =select.attr('data-url')?select.attr('data-url'):null;
            var data=dt;
   			/*{
			  	"recordId": 0,
			  	"amount": 0,
			  	"payMode": "",
			  	"voucher": "",
			  	"remark": "",
			}*/
            if(!data.payMode){
                $scope.pay.errorMsg="请选择付款方式!";
                return false
            }
            if(!data.voucher ){
                $scope.pay.errorMsg="请上传凭证!";
                return false
            }
            $scope.pay.errorMsg=null;
			delete data.errorMsg;
			if(ispass){
				ispass=false;
				$http({ url:[$window.API.FASTPAY.LIST_TRANSACTION,"/",dt.recordId,"/withdraw/handled"].join(""), method:'post',data:data} ).success(function(res){
                	//console.log(res)
                	ispass=true;
	                if(res.stateCode===0){
	                    successMsg.make({msg:'提交成功!'});
	                    $scope.refresh();
	                    angular.element('.createDialog-manualProcessing').modal('hide');
	                    select.attr('data-url',"");
	                }else{
	                    errorMsg.make({msg:res.message});
	                }
	
	            });
			}
        };

        /*查看手动结算凭证*/
        $scope.lookManualProcessing=function(recordId){
            angular.element('.createDialog-lookManualProcessing').modal({backdrop: 'static', keyboard: false});
            $http.get([$window.API.FASTPAY.LIST_TRANSACTION,"/",recordId,"/withdraw/handled"].join("")).success(function(res){
            	//console.log(res)
                if(res.stateCode===0&&res.data){
                    $scope.manualProcessingInfo={
                        "amount":res.data.amount,
                        "payMode": res.data.payMode,        //打款方式int，1=微信，2=支付，3=网银，4=线下,
                        "payModeDesc":res.data.payModeDesc, //打款方式描述,
                        "voucher":res.data.voucher,         //打款凭证,
                        "remark":res.data.remark,           //备注,
                    }
                }else {
                    errorMsg.make({msg:res.message});
                }
           });   
        }
        /*查看手动结算凭证-确定*/
        $scope.close=function(){
            angular.element('.createDialog-lookManualProcessing').modal("hide");
        }


    }]);

