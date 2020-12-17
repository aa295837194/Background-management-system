<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>

        </el-breadcrumb>
        <el-card>

                <el-table
                    :data="rolesList"
                    border
                    style="width: 100%">
                <el-table-column
                        type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['rowStyle',index1===0?'top':'','vcenter']" v-for="(item1 ,index1) in scope.row.children" :key="index1" @close="deleteRights(scope.row,item1.id)">
                        <el-col :span="5"><el-tag closable>{{item1.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <el-col :span="19"  >
                            <el-row v-for="(item2,index2) in item1.children" :key="index2" :class="[index2===0?'':'top']" @close="deleteRights(scope.row,item2.id)" >
                                <el-col :span="6">
                                    <el-tag type="success" closable>{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span="13">
                                    <el-tag type="warning" v-for="(item3,index3) in item2.children" :key="index3" closable @close="deleteRights(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                </el-col>


                            </el-row>

<!--                            <el-col :span="6">-->
<!--                                <el-row v-for="(item3,index3) in item2.children" :key="index3">{{item3.authName}}</el-row>-->
<!--                            </el-col>-->
                        </el-col>
                    </el-row>
                    </template>

                </el-table-column>
                <el-table-column
                        type="index"
                        label="id">
                </el-table-column>
                <el-table-column
                        prop="roleName"
                        label="角色名称">
                </el-table-column>
                <el-table-column
                        prop="roleDesc"
                        label="角色描述">
                </el-table-column>
                <el-table-column

                        label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" ><i class="el-icon-edit"></i>编辑</el-button>
                        <el-button type="success" ><i class="el-icon-delete"></i>删除</el-button>
                        <el-button type="warning" @click="setUserRightsDialog(scope.row)"><i class="el-icon-setting" ></i>分配角色</el-button>
                    </template>


                </el-table-column>
            </el-table>




        </el-card>
        <el-dialog
                title="分配角色"
                :visible.sync="SetUserdialogVisible"
                width="50%"
                @close="CloseChange"
        >
            <el-tree
                    :props="defaultProps"
                    :data="rightsList"

                    show-checkbox
                    ref="treeRef"
                    node-key="id"
            default-expand-all
            :default-checked-keys="defKeys">
            </el-tree>
            <span slot="footer" class="dialog-footer">
    <el-button @click="SetUserdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitRights(roleId)" >确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Roles",
        data(){
            return  {
                rolesList:[],
                SetUserdialogVisible:false,
                rightsList:[],
                defaultProps:{
                    children:"children",
                    label:'authName'
                },
                defKeys:[105],
                roleId:'',




            }

        },
        methods: {
            async getRolesList() {
                const {data: res} = await this.$http.get('roles')
                if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
                this.rolesList = res.data;


            },
            async deleteRights(role,rightId){
                const confirmRes=await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err=>err)
                if(confirmRes!=='confirm')
                {
                    return this.$message.info('取消了删除')
                }

                const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                if(res.meta.status!=200)return this.$message.error('取消权限失败')
                this.$message.success('取消权限成功')
                role.children=res.data;

            },
            async setUserRightsDialog(role){
                const{data:res}=await this.$http.get('rights/tree');
                if(res.meta.status!==200) return this.$message.error('获取权限列表失败')
                this.rightsList=res.data;
                this.roleId=role.id;
                this.getRoleRight(role,this.defKeys)

                this.SetUserdialogVisible=true;
            },
            getRoleRight(node,keys){
                if(!node.children){
                    return keys.push(node.id)
                }
                node.children.forEach(item=>this.getRoleRight(item,keys))
            },
            CloseChange(){
                this.defKeys=[]
            },
            async submitRights(roleId){
                this.SetUserdialogVisible = false
                const keys=[...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
                const Newrights=keys.join(',')
                const{data:res}=await this.$http.post(`roles/${roleId}/rights`,{rids:Newrights})
                if(res.meta.status!==200)return this.$message.error('修改用户权限失败')
                this.$message.success('修改用户权限成功')
                this.getRolesList()

            }



        },
        created() {
            this.getRolesList();
        }
    }
</script>

<style scoped>
.el-tag{
    margin:7px
}
    .rowStyle{
      border-bottom: 1px solid #eeeeee;
    }
    .top{
        border-top: 1px solid #eeeeee;
    }
    .vcenter{
        display: flex;
        align-items: center;
    }



</style>