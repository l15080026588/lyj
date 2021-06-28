

<template>
    <div class="login-wrap">
        <div class="ms-title">后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="User_Name">
                    <el-input v-model="ruleForm.User_Name" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="User_Pass">
                    <el-input type="password" placeholder="password" v-model="ruleForm.User_Pass" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary"  @click="submitForm('ruleForm')" class="login-btn">登录</el-button>
               </el-form-item>
                <el-form-item>
                    <label class="regisn" @click="registered">注册账号</label>
                    <label class="thirdpart">第三方账号登录</label>
                </el-form-item>
                <el-tabs v-model="activeName" @tab-click="handleClick()">
                <el-tab-pane label="验证码登录" name="1">
            <el-form :model="loginbycode" :rules="phonerules" ref="loginbycode" class="loginbycode">
               <el-form-item prop="User_Tel">
                  <el-input
                  v-model="loginbycode.User_Tel"
                  prefix-icon="el-icon-mobile"
                  placeholder="请输入手机号"
                  ></el-input>
               </el-form-item>
                <el-form-item prop="code" class="code">
                    <el-input v-model="loginbycode.code" placeholder="请输入验证码"></el-input>
                    <el-button type="primary" @click="sendcode" :disabled="disabled" v-if="disabled==false">发送验证码
                    </el-button>
                    <el-button type="primary" @click="sendcode" :disabled="disabled" v-if="disabled==true">{{btntxt}}
                    </el-button>
               </el-form-item>
               <el-form-item>
                  <el-button type="primary"  @click="submitbycode('loginbycode')" class="login_btn">登录</el-button>
               </el-form-item>
            </el-form>
          </el-tab-pane>
          </el-tabs>
                
            </el-form>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

const REG_TELPHONE= /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/;

    export default {
        data: function(){
            return {
                userLogin:false,
                errorInfo : false,
                ruleForm: {
                    User_Name: '',
                    User_Pass: ''
                },
                loginbycode:{
                    User_Tel: '',
                    code: ''
                },
                rules: {
                    User_Name: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    User_Pass: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },
                phonerules:{
                    phone:[
                    { required: true, message: '手机号不能为空', trigger: 'blur' },
                    { min: 11, max: 11, message: '长度为11个数字', trigger: 'blur' }
                    ]
                },
                activeName:'0',
                getcodes:'1111',
                disabled: false,
                time: 0,
                btntxt: "重新发送",
                mes:'',
            }
        },
        computed: {
            user() {
                return this.$store.state.user
            }
        },
        methods: {
            
            submitForm(formName) {
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        localStorage.setItem('ms_username',self.ruleForm.User_Name);
                        localStorage.setItem('ms_user',JSON.stringify(self.ruleForm));
                        self.$http({
                            method:'get',
                            url:'/api/user/login',
                            params:{
                                data:self.ruleForm
                            }
                        }).then((response) => {
                                console.log(response);
                                if (response.data == -1) {
                                    self.errorInfo = true;
                                    self.errInfo = '该用户不存在';
                                    console.log('该用户不存在')
                                } else if (response.data == 0) {
                                    console.log('密码错误')
                                    self.errorInfo = true;
                                    self.errInfo = '密码错误';
                                } else  {
                                    this.$store.commit('isLogin',response.body[0]);
                                    self.$router.push('/dashboard');
                                }
                            })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            
            submitbycode(formName){
                if(REG_TELPHONE.test(this.loginbycode.User_Tel)){
                    if(this.getcodes.toLowerCase()!=this.loginbycode.code.toLowerCase()){
                    this.$message.error('验证码有误');
                    this.loginbycode.code="";
                    return;
                    }

                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.$http({
                            method:'get',
                            url:'/api/user/quicklogin',
                            params:{
                                data:self.loginbycode.User_Tel
                            }
                        }).then((response) => {
                                console.log(1234567);
                                console.log(response);
                                if (response.body.status == -1) {
                                    self.errorInfo = true;
                                    self.errInfo = '该用户不存在';
                                    console.log('该用户不存在')
                                
                                } else  {
                                    console.log(response.body.status ==200)
                                    if(response.body.status==200)
                                        this.mes="OK";
                                    this.$store.commit('isLogin',this.mes);
                                    self.$router.push('/dashboard');
                                    localStorage.setItem('ms_username',response.body.username);
                                }
                            })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
        }},
                
                
               


sendcode() {
        const reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/
        console.log(this.loginbycode.User_Tel);
        if (!reg.test(this.loginbycode.User_Tel)) {
            this.$message({
                message:'请输入正确的手机号',
                center:true
            })
            return
        } else {
            console.log(this.loginbycode.User_Tel);
            this.$message({
                message: '发送成功',
                type: 'success',
                center:true
            });
            this.time = 60;
            this.disabled = true;
            this.timer();
            console.log('222222222')
            this.$axios({
                        method: 'post',
                        url: '/api/sms',
                        data: {
                          mobile:this.loginbycode.User_Tel
                        }
            })
            .then(res =>{
                    console.log(res);
                    if(res.data.state == 200)
                        {
                        this.getcodes=res.data.code,
                        this.$message({
                        message: '获取成功',
                        type: 'success',
                        center:true
                    });
                    }
                    else if(res.data.state == 500)
                    {
                            this.$message({
                            message: '获取失败',
                            center:true
                            });
                    }
            })
        }
            },
    timer() {
          if (this.time > 0) {
              this.time--;
              this.btntxt = this.time + "s后重新获取";
              setTimeout(this.timer, 1000);
          } else {
              this.time = 0;
              this.btntxt = "获取验证码";
              this.disabled = false;
          }
      },



qqLoginClick(value) {
                // 直接弹出授权页面，授权过后跳转到回调页面进行登录处理
                QC.Login.showPopup({
                    appId:"填写自己的APP_ID",
                    redirectURI:"回调地址url"  //登录成功后会自动跳往该地址
                })
},
// QQ第三方登录
	    qqLogin(){
		    var that = this; // 先将vue这个对象保存在_self对象中
		    //检查是否登录
		    if (QC.Login.check()) {
		        //该处的openId，accessToken就是后台需要的参数了，后台可以通过这些参数获取临时登录凭证，然后就是自己的逻辑了
		        QC.Login.getMe(function (openId, accessToken) {
		            if (  openId != undefined ){
		                that.loading = true;
		                // 传参给后台进行登录验证
		                that.$store.dispatch('LoginByUsername', {
		                    username: '',
		                    openId: openId,
		                    accessToken: accessToken
		                }).then(() => {
		                    that.loading = false;
		                    that.$router.push({ path: '/' })
		                }).catch(() => {
		                    that.loading = false
		                })
		            }
		        });
		        console.log('已登录!')
		        // 清除定时器
		        clearInterval(this.timer);
		        this.timer = null;
		    } else {
		        console.log('未登录!')
		    }
	    },


            registered(){
                this.$router.push('/register')
            },
            handleClick(){
                
                console.log(this.activeName);
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
    .regisn{
        float: left;
        color: #409eff;
    }
    .thirdpart{
        float: right;
        color: #409eff;
    }
</style>
