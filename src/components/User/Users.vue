<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>

        </el-breadcrumb>


        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input v-model='userParams.query' placeholder="请输入内容"  class="input-with-select" clearable @clear="getUserList">

                        <el-button  slot="append" icon="el-icon-search" @click="getUserList()" ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
                    <el-dialog
                            title="提示"
                            :visible.sync="dialogVisible"
                            width="30%"
                            @close="dialogClose">
                        <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
                            <el-form-item label="用户名" prop="username">
                                <el-input v-model="addForm.username"></el-input>
                            </el-form-item>
                                <el-form-item label="密码" prop="password">
                                    <el-input v-model="addForm.password" type="password"></el-input>
                                </el-form-item>
                                    <el-form-item label="邮箱" prop="email">
                                        <el-input v-model="addForm.email"></el-input>
                                    </el-form-item>
                                        <el-form-item label="手机" prop="tel">
                                            <el-input v-model="addForm.tel"></el-input>
                                        </el-form-item>


                        </el-form>
                        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false" >取 消</el-button>
    <el-button type="primary"  @click="Confirm">确 定</el-button>
  </span>
                    </el-dialog>
                    <el-dialog
                            title="提示"
                            :visible.sync="EditdialogVisible"
                            width="30%"
                            >
                        <el-form ref="editForm" :model="editForm" label-width="80px" :rules="editRules">
                            <el-form-item label="用户名" prop="username">
                                <el-input v-model="editForm.username" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱" prop="email">
                                <el-input v-model="editForm.email"></el-input>
                            </el-form-item>
                            <el-form-item label="手机" prop="mobile">
                                <el-input v-model="editForm.mobile"></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
    <el-button @click="EditdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="ConfirmEdit">确 定</el-button>
  </span>
                    </el-dialog>
                </el-col>
            </el-row>
        </el-card>
        <el-table
                :data="userList"
                :stripe="true"
        border>
            <el-table-column
                    type="index"
                    label="id"
                    >
            </el-table-column>
            <el-table-column
                    prop="username"
                    label="姓名"
                    >
            </el-table-column>
            <el-table-column
                    prop="email"
                    label="邮箱">
            </el-table-column>
            <el-table-column
                    prop="role_name"
                    label="角色"
            >
            </el-table-column>

            <el-table-column
                    label="状态"

            >
                <template slot-scope="scope">
                    <el-switch
                            v-model="scope.row.mg_state" @change="userStatusChange(scope.row)"
                            >
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
            >
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" @click="editUser(scope.row.id)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="DeleteUser(scope.row.id)"></el-button>
                    <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
                        <el-button type="warning" icon="el-icon-setting"></el-button>
                    </el-tooltip>
                </template>


            </el-table-column>
        </el-table>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="userParams.pagenum"
                :page-sizes="[1,2,5,10]"
                :page-size="userParams.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </div>




</template>

<script>
    export default {
        name: "Users",
        data(){
            var checkEmail= (rule,value,cb)=>{
                const regemail=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

                if(regemail.test(value)){
                    return cb()
                }
                cb(new Error('请输入合法的邮箱'))
            }
            var checkTel=(rule,value,cb)=>{
                const regTel=/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/;
                if(regTel.test(value)){
                    return cb()
                }
                cb(new Error('请输入合法的手机号'))
            }
            return{
              userParams:{
                  query:'',
                  pagenum:1,
                  pagesize:2,
              },
                userList:[],
                total:0,
                dialogVisible:false,
                addForm:{
                  username:'',
                    password:'',
                    email:'',
                    tel:'',
                },
                addRules:{
                  username:[{required:true,message:'请输入用户名',trigger:'blur'},
                      {min:3,max:10,message:'在3到10位之间',trigger: 'blur'}],
                    password:[{required:true,message:'请输入密码',trigger:'blur'},
                        {min:6,max:12,message:'在6到12位之间',trigger: 'blur'}],
                    email:[{required:true,message:'请输入邮箱',trigger:'blur'},
                        {validator:checkEmail,trigger: 'blur'}],
                    tel:[{required:true,message:'请输入手机',trigger:'blur'},
                        {validator:checkTel,trigger:'blur'}]


                },
                editForm:{

                },
                EditdialogVisible:false,
                editRules:{
                    username:[{required:true,message:'请输入用户名',trigger:'blur'},
                        {min:3,max:10,message:'在3到10位之间',trigger: 'blur'}],
                    email:[{required:true,message:'请输入邮箱',trigger:'blur'},
                        {validator:checkEmail,trigger: 'blur'}],
                    mobile:[{required:true,message:'请输入手机',trigger:'blur'},
                        {validator:checkTel,trigger:'blur'}]
                }
            }
        },
        created() {
            this.getUserList()
        },
        methods:{
            async getUserList(){
                const {data:res} =await this.$http.get('users',{params:this.userParams})

                if (res.meta.status!==200) return this.$message.error('获取用户列表失败')
                this.userList=res.data.users;
                this.total=res.data.total;
                console.log(res)

            },
            dialogClose(){
                this.$refs.addFormRef.resetFields()
            },
            handleSizeChange(newSize){

                this.userParams.pagesize=newSize;
                this.getUserList()

            },
            handleCurrentChange(CurrentPage){

                this.userParams.pagenum=CurrentPage
                this.getUserList()
            },
            Confirm(){
                this.$refs.addFormRef.validate(async valid=>{
                    if(!valid) return;
                    const {data:res}= await this.$http.post('users',this.addForm);
                    if(res.meta.status!==201){
                        return this.$message.error('添加用户失败')

                    }
                    this.$message.success('添加用户成功')
                    this.dialogVisible=false;
                    this.getUserList();

                })
            },
            ConfirmEdit(){
                this.$refs.editForm.validate(async valid=>{
                    if(!valid) return;
                    const { data:res }= await this.$http.put(`users/`+this.editForm.id,{username:this.editForm.username,mobile:this.editForm.mobile,email:this.editForm.email})
                    if(res.meta.status!==200){
                        return this.$message.error('修改用户信息失败')

                    }
                    this.$message.success('修改用户信息成功')
                    this.EditdialogVisible=false;
                    this.getUserList();

                })
            },
            async userStatusChange(userInfo){
                console.log(userInfo)
                const { data:res }= await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
                console.log(res)
                if (res.meta.status!==200){
                    userInfo.mg_state= !userInfo.mg_state;
                    return this.$message.error('更新用户状态失败')
                }
                this.$message.success('更新用户状态成功')
            },
            async editUser(id){
                this.EditdialogVisible=true;
                const {data:res}= await this.$http.get(`users/${id}`)
                if(res.meta.status!==200) return this.$message.error('获取信息失败')
                console.log(res)
                this.editForm=res.data;
            },
            async DeleteUser(id){
                const res= await  this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err=>err)
                if(res==="confirm"){
                   const {data:result}= await this.$http.delete('users/' +id)
                    console.log(result)
                    if(result.meta.status!==200){
                        return this.$message.error('删除用户失败')
                    }
                    this.$message.success('删除用户成功')


                }
                else{
                    this.$message.info('已取消删除')
                }
            }
        }
    }

</script>

<style scoped>

</style>