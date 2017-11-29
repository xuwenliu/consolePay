/**
 * API URL
 */
window.pubkey="MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCBG3UFPAxh+a0NLv6Plvjo5YPDdnlbED8dI4GP21DdFKvXVFcPb0lSRrht5Xrg7ck4PJ/fovfSi7k8MYqPY52g9tnPzkAthVOs99Tw6DVe22vV2hcs7dXvtk+TxKy4IqMjZA77hiH8wMYcJur+o4R770mrVP4fP88x53EQ4PaayQIDAQAB";

window.API = {
    "SYS":{

        "LOGIN":[HOST, "/user/login"].join(""), //登录
        "LOGOUT":[HOST, "/user/logout"].join(""),//退出
        "test":[HOST, "/user/loginText"].join("")  //test

    },
    OTHER:{
        "QINIU_UPTOKEN":[HOST, "/upload/getToken"].join(""),//七牛上传token
        "QNV_UPTOKEN":[HOST, "/upload/getVideoToken"].join(""),//七牛上传视频
        /*"PROVINCE":[HOST, "/area/province"].join(""),//省份
        "CITY":[HOST, "/area/city"].join(""),//城市
        "COUNTY":[HOST, "/area/county"].join(""),//区县
        "GET_AREA":[HOST, "/area"].join(""),//从最后一级反查
        "GET_CITY_OWN":[HOST, "/area/citySupport"].join(""),   // GET /area/citySupport //平台指定的城市
        "GET_BRAND_BY_BIGCLASS":[HOST, "/brand/collection"].join("") //GET /brand/collection?typeId=1获取指定大类的品牌及子类*/
    },
    "FASTPAY": {
        "LIST": [HOST, "/pos/user"].join(""),  //用户列表
        "LIST_EXCEL":[HOST,"/pos/user/export"].join(""), //用户列表-导出Excel表
        "LIST_TRANSACTION":[HOST,"/pos/transaction"].join(""), //交易列表
        "LIST_TRANSACTION_EXCEL":[HOST,"/pos/transaction/export"].join(""), //交易列表-导出Excel表
    },

}



