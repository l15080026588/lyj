webpackJsonp([15],{GF4k:function(e,s,t){"use strict";Object.defineProperty(s,"__esModule",{value:!0});t("mtWM");const o=/^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/;var r={data:function(){return{userLogin:!1,errorInfo:!1,ruleForm:{User_Name:"",User_Pass:""},loginbycode:{User_Tel:"",code:""},rules:{User_Name:[{required:!0,message:"请输入用户名",trigger:"blur"}],User_Pass:[{required:!0,message:"请输入密码",trigger:"blur"}]},phonerules:{phone:[{required:!0,message:"手机号不能为空",trigger:"blur"},{min:11,max:11,message:"长度为11个数字",trigger:"blur"}]},activeName:"0",getcodes:"1111",disabled:!1,time:0,btntxt:"重新发送",mes:""}},computed:{user(){return this.$store.state.user}},methods:{submitForm(e){const s=this;s.$refs[e].validate(e=>{if(!e)return console.log("error submit!!"),!1;localStorage.setItem("ms_username",s.ruleForm.User_Name),localStorage.setItem("ms_user",JSON.stringify(s.ruleForm)),s.$http({method:"get",url:"/api/user/login",params:{data:s.ruleForm}}).then(e=>{console.log(e),-1==e.data?(s.errorInfo=!0,s.errInfo="该用户不存在",console.log("该用户不存在")):0==e.data?(console.log("密码错误"),s.errorInfo=!0,s.errInfo="密码错误"):(this.$store.commit("isLogin",e.body[0]),s.$router.push("/dashboard"))})})},submitbycode(e){if(o.test(this.loginbycode.User_Tel)){if(this.getcodes.toLowerCase()!=this.loginbycode.code.toLowerCase())return this.$message.error("验证码有误"),void(this.loginbycode.code="");const s=this;s.$refs[e].validate(e=>{if(!e)return console.log("error submit!!"),!1;s.$http({method:"get",url:"/api/user/quicklogin",params:{data:s.loginbycode.User_Tel}}).then(e=>{console.log(1234567),console.log(e),-1==e.body.status?(s.errorInfo=!0,s.errInfo="该用户不存在",console.log("该用户不存在")):(console.log(200==e.body.status),200==e.body.status&&(this.mes="OK"),this.$store.commit("isLogin",this.mes),s.$router.push("/dashboard"),localStorage.setItem("ms_username",e.body.username))})})}},sendcode(){console.log(this.loginbycode.User_Tel),/^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(this.loginbycode.User_Tel)?(console.log(this.loginbycode.User_Tel),this.$message({message:"发送成功",type:"success",center:!0}),this.time=60,this.disabled=!0,this.timer(),console.log("222222222"),this.$axios({method:"post",url:"/api/sms",data:{mobile:this.loginbycode.User_Tel}}).then(e=>{console.log(e),200==e.data.state?(this.getcodes=e.data.code,this.$message({message:"获取成功",type:"success",center:!0})):500==e.data.state&&this.$message({message:"获取失败",center:!0})})):this.$message({message:"请输入正确的手机号",center:!0})},timer(){this.time>0?(this.time--,this.btntxt=this.time+"s后重新获取",setTimeout(this.timer,1e3)):(this.time=0,this.btntxt="获取验证码",this.disabled=!1)},qqLoginClick(e){QC.Login.showPopup({appId:"填写自己的APP_ID",redirectURI:"回调地址url"})},qqLogin(){var e=this;QC.Login.check()?(QC.Login.getMe(function(s,t){void 0!=s&&(e.loading=!0,e.$store.dispatch("LoginByUsername",{username:"",openId:s,accessToken:t}).then(()=>{e.loading=!1,e.$router.push({path:"/"})}).catch(()=>{e.loading=!1}))}),console.log("已登录!"),clearInterval(this.timer),this.timer=null):console.log("未登录!")},registered(){this.$router.push("/register")},handleClick(){console.log(this.activeName)}}},i={render:function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("div",{staticClass:"login-wrap"},[t("div",{staticClass:"ms-title"},[e._v("后台管理系统")]),e._v(" "),t("div",{staticClass:"ms-login"},[t("el-form",{ref:"ruleForm",staticClass:"demo-ruleForm",attrs:{model:e.ruleForm,rules:e.rules,"label-width":"0px"}},[t("el-form-item",{attrs:{prop:"User_Name"}},[t("el-input",{attrs:{placeholder:"username"},model:{value:e.ruleForm.User_Name,callback:function(s){e.$set(e.ruleForm,"User_Name",s)},expression:"ruleForm.User_Name"}})],1),e._v(" "),t("el-form-item",{attrs:{prop:"User_Pass"}},[t("el-input",{attrs:{type:"password",placeholder:"password"},nativeOn:{keyup:function(s){if(!("button"in s)&&e._k(s.keyCode,"enter",13,s.key,"Enter"))return null;e.submitForm("ruleForm")}},model:{value:e.ruleForm.User_Pass,callback:function(s){e.$set(e.ruleForm,"User_Pass",s)},expression:"ruleForm.User_Pass"}})],1),e._v(" "),t("el-form-item",[t("el-button",{staticClass:"login-btn",attrs:{type:"primary"},on:{click:function(s){e.submitForm("ruleForm")}}},[e._v("登录")])],1),e._v(" "),t("el-form-item",[t("label",{staticClass:"regisn",on:{click:e.registered}},[e._v("注册账号")]),e._v(" "),t("label",{staticClass:"thirdpart"},[e._v("第三方账号登录")])]),e._v(" "),t("el-tabs",{on:{"tab-click":function(s){e.handleClick()}},model:{value:e.activeName,callback:function(s){e.activeName=s},expression:"activeName"}},[t("el-tab-pane",{attrs:{label:"验证码登录",name:"1"}},[t("el-form",{ref:"loginbycode",staticClass:"loginbycode",attrs:{model:e.loginbycode,rules:e.phonerules}},[t("el-form-item",{attrs:{prop:"User_Tel"}},[t("el-input",{attrs:{"prefix-icon":"el-icon-mobile",placeholder:"请输入手机号"},model:{value:e.loginbycode.User_Tel,callback:function(s){e.$set(e.loginbycode,"User_Tel",s)},expression:"loginbycode.User_Tel"}})],1),e._v(" "),t("el-form-item",{staticClass:"code",attrs:{prop:"code"}},[t("el-input",{attrs:{placeholder:"请输入验证码"},model:{value:e.loginbycode.code,callback:function(s){e.$set(e.loginbycode,"code",s)},expression:"loginbycode.code"}}),e._v(" "),0==e.disabled?t("el-button",{attrs:{type:"primary",disabled:e.disabled},on:{click:e.sendcode}},[e._v("发送验证码\n                ")]):e._e(),e._v(" "),1==e.disabled?t("el-button",{attrs:{type:"primary",disabled:e.disabled},on:{click:e.sendcode}},[e._v(e._s(e.btntxt)+"\n                ")]):e._e()],1),e._v(" "),t("el-form-item",[t("el-button",{staticClass:"login_btn",attrs:{type:"primary"},on:{click:function(s){e.submitbycode("loginbycode")}}},[e._v("登录")])],1)],1)],1)],1)],1)],1)])},staticRenderFns:[]};var l=t("VU/8")(r,i,!1,function(e){t("uTD5")},"data-v-2adfe584",null);s.default=l.exports},uTD5:function(e,s){}});