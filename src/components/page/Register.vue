<template>
  <div class="register">
     <div class="register-contant">
        <section class="form-contant">
           <div class="manage_tip">
               <span class="title">用户注册</span>
           </div>
           <el-form :model="register" :rules="rules" ref="registerForm" class="registerForm">
               <el-form-item prop="userName">
                   <el-input label="姓名" placeholder="请输入名字" v-model="register.userName"></el-input>
               </el-form-item>
               <el-form-item prop="userType">
                   <el-select v-model="register.userType" placeholder="请选择用户类型">
                    <el-option label="学生" value="student"></el-option>
                    <el-option label="教师" value="teacher"></el-option>>
                  </el-select>
               </el-form-item>
               <el-form-item prop="studyNumber">
                   <el-input label="学/工号" placeholder="请输入学/工号" v-model="register.studyNumber"></el-input>
               </el-form-item>
               <el-form-item prop="userTel">
                   <el-input label="手机号" placeholder="请输入手机号" v-model="register.userTel"></el-input>
               </el-form-item>
               <el-form-item prop="codes" class="code">
                    <el-input v-model="codes" placeholder="请输入验证码"></el-input>
                    <el-button type="button" @click="sendcode" :disabled="disabled" v-if="disabled==false">发送验证码
                    </el-button>
                    <el-button type="button" @click="sendcode" :disabled="disabled" v-if="disabled==true">{{btntxt}}
                    </el-button>
                  </el-form-item>
                  <el-form-item prop="userPass" class="passw">
                    <el-input type="password" placeholder="请输入密码" v-model="register.userPass" prefix-icon="el-icon-lock"></el-input>
                  </el-form-item>
                  <el-form-item prop="checkPass">
                    <el-input type="password" placeholder="请再次输入密码" v-model="checkPass" prefix-icon="el-icon-lock"></el-input>
                  </el-form-item>
               <el-form-item>
                 <el-button type="primary" @click="submitForm('registerForm')" class="submit_btn">注 册</el-button>
               </el-form-item>
           </el-form>
        </section>
     </div>
  </div>
</template>
<script>
import axios from 'axios'
const REG_TELPHONE= /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/;

  export default {
    data() {
      var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        } else {
          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
          console.log(reg.test(value));
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
      };
      return {
        register:{
          userName: '',
          userType:'',
          userPass:'',
          userTel:'',
          studyNumber:'',
        },
        
        codes:'',
        getcodes:'1111',
        disabled: false,
        time: 0,
        btntxt: "重新发送",
        checkPass:'',
        rules: {
          userName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { min: 4, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
          ],
          userPass: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' }
          ],
          userTel:[
            { validator: checkPhone, trigger: 'blur' },
          ]
      },
      }
    },
    methods:{
        submitForm(formName){

          if(REG_TELPHONE.test(this.register.userTel)){
            if(this.getcodes.toLowerCase()!=this.codes.toLowerCase()){
              this.$message.error('验证码有误');
              this.codes="";
              return;
            }

            this.$axios({
              method:'post',
              url:'/api/users_info/regist',
              data:{
                name: this.register.userName,
                role: this.register.userType,
                studyNumber: this.register.studyNumber,
                telphone: this.register.userTel,
                pass: this.register.userPass,
              }
            }).then(response=>{
            //  console.log('测试注册完是否返回数据');
              console.log(response);
              if(response.status == 204){
                this.$message.error('该手机号已注册');
                this.register.userName='';
                this.register.userType='';
                this.register.studyNumber='';
                this.register.userTel='';
                this.register.userPass='';
                this.ruleForm.checkPass='';
              }
              if(response.status== 201){
                this.$message({
                  message: '注册成功',
                  iconClass: 'icon icon-success',
                  duration: 1000
                });
                this.$router.push('/');
              }
            }).catch(function (err) {
              console.log(err);
            });
          }
          },







        sendcode() {
        const reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/
        console.log(this.register.userTel);
        if (!reg.test(this.register.userTel)) {
            this.$message({
                message:'请输入正确的手机号',
                center:true
            })
            return
        } else {
            console.log(this.register.userTel);
            this.$message({
                message: '发送成功',
                type: 'success',
                center:true
            });
            this.time = 60;
            this.disabled = true;
            this.timer();
            this.$axios({
                        method: 'post',
                        url: '/api/sms',
                        data: {
                          mobile:this.register.userTel
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
      }
      // checkcode(){
      //    console.log(this.codes);
      //      if(this.getcodes == this.codes)
      //               this.codetrue=true;
      // },
    }
  }
</script>
<style>
.register{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center; /*定义父元素的元素垂直居中*/
  justify-content: center; /*定义子元素的里的元素水平居中*/
  background: rgb(45, 73, 107);
}
.register-contant{
  width: 630px;
  height: 630px;
  border: 1px solid #ebebeb;
  box-shadow: 0 12px 14px rgba(0,0,0,.08);
  border-radius: 3px;
}
.form-contant{
  width: 580px;
  height: 580px;
  /* border: 1px solid red; */
  padding: 25px;
  /* border-radius: 5px; */
  text-align: center;
  background-color: #fff;
}
.form-contant .manage_tip .title{
  font-family: "Microsoft YaHei";
  font-weight: bold;
  font-size: 26px;
  color: #000000;
}
.registerForm{
    margin-top: 15px;
}
.registerForm .el-input{
    width: 300px;
}
.submit_btn{
  width: 200px;
  background-color: #0896ba;
  border-color: #0896ba;
}
.code .el-input {
        width: 170px;
        border-radius: 0px;
        left: 0px;
        display: inline-block;
}
.code  .el-button {
        width: 130px;
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        border-left: 0px;
        left: 0px;
        display: inline-block;
}
.passw{
  margin-top: 0px;
}
</style>