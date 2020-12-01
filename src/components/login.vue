<template>
    <div class="login_bg"><div class="login_box">
        <div class="vue_img"><img src="../assets/logo.png" alt=""></div>
        <div >
            <el-form   :model="loginForm" label-width="50px" class="login_form"  :rules="loginRules" ref="loginMethods">

                <el-form-item  prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"  ></el-input>
                </el-form-item>
                    <el-form-item prop="username">
                    <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
                    </el-form-item>
                    <el-form-item class="login_button" >
                    <el-row>

                        <el-button type="primary" @click="check">登录</el-button>
                        <el-button @click="reset">重置</el-button>
                    </el-row>
                    </el-form-item>

            </el-form>
        </div>
    </div></div>
</template>

<script>
    export default {
        name: "login",
        data: function () {
            return {
                loginForm:{
                    username:"admin",
                    password:"123456"

                },
                loginRules:{
                    username:[
                        {required: true,message:"请输入登录名称",trigger:"blur"},
                        {min:3,max:10,message:"长度在3到10个字符",trigger:"blur"}
                    ],
                    password:[
                        {required: true,message:"请输入登录密码",trigger:"blur"},
                        {min:6,max:15,message: "6到15个字符之间",trigger:"blur"}
                        ]
                }
            }

        },
        methods: {
            reset(){
                this.$refs.loginMethods.resetFields()
            },
            check (){
                this.$refs.loginMethods.validate(async (valid)=>{
                    if(!valid){return;}
                   const {data :res}= await this.$http.post('/login',this.loginForm);
                    if(res.meta.status !==200) {return this.$message.error('登陆失败')};
                     this.$message.success('登录成功');
                     window.sessionStorage.setItem('token',res.data.token);
                     this.$router.push('/home');
                });
            }
        }
    }
</script>

<style lang="less" scoped>
.login_bg{
    background-color: skyblue;
    height: 100%;
}
.login_box{
    background-color: white;
    width: 450px;
    height: 300px;
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    border-radius: 10px;
    padding: 10px;

}
.vue_img {
        width: 130px;
        height: 130px;
        border-radius: 50%;
        border:1px solid #eee;
        box-shadow: 0 0 10px #ddd;
        position:absolute;
        left:50%;
        transform: translate(-50%,-50%);
    background-color: #fff;
    }
    .vue_img img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
        border: 1px solid #eee;

    }
    .login_form{
        width: 100%;
        padding:0 20px;
        box-sizing: border-box;
        position: absolute;
        bottom:0;
        left:-10px;

    }
.login_button{
    display: flex;
    justify-content: flex-end;
}


</style>