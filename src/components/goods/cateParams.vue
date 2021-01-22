<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>

        </el-breadcrumb>
        <el-card>
            <el-alert
                    title="只能选择三级分类"
                    type="warning"
                    show-icon>
            </el-alert>
            <el-cascader
                    v-model="selected"
                    :options="goodList"
                    expand-trigger="hover"
                    :props="CateProps"
                    @change="handleChange"></el-cascader>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" @click="AdddialogVisible=true" :disabled="selected.length===0?true:false">添加参数</el-button>
                    <el-dialog
                            :title="'添加'+ getName()"
                            :visible.sync="AdddialogVisible"
                            width="30%"
                    >
                        <el-form :model="AddForm" :rules="AddFormrules" ref="AddruleForm" label-width="100px" >
                            <el-form-item :label=getName() prop="attr_name">
                                <el-input v-model="AddForm.attr_name"></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
    <el-button @click="AdddialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitAddParams">确 定</el-button>
  </span>
                    </el-dialog>

                    <el-table
                            :data="ParamsData"
                            border
                            style="width: 100%">

                        <el-table-column
                                type="expand"
                        >
                            <template slot-scope="scope">
                                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="CloseTag(scope.row,index)">{{item}} </el-tag>
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                />
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>

                        </el-table-column>


                        <el-table-column
                                type="index"
                                label="#">
                        </el-table-column>
                        <el-table-column
                                prop="attr_name"
                                label="属性名称">
                        </el-table-column>
                        <el-table-column

                                label="操作">
                            <el-button type="primary" icon="el-icon-edit" @click="EditdialogVisible=true">编辑</el-button>
                            <el-button type="danger" icon="el-icon-delete">删除</el-button>
                        </el-table-column>


                    </el-table>


                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" @click="AdddialogVisible=true" :disabled="selected.length===0?true:false">添加参数</el-button>
                    <el-dialog
                            :title="'添加'+ getName()"
                            :visible.sync="AdddialogVisible"
                            width="30%"
                    >
                        <el-form :model="AddForm" :rules="AddFormrules" ref="AddruleForm" label-width="100px" >
                            <el-form-item :label=getName() prop="attr_name">
                                <el-input v-model="AddForm.attr_name"></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
    <el-button @click="AdddialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitAddParams">确 定</el-button>
  </span>
                    </el-dialog>
                    <el-table
                            :data="ParamsData"
                            border
                            style="width: 100%">
                        <el-table-column
                                type="expand"
                        >

                        </el-table-column>
                        <el-table-column
                                type="index"
                                label="#">
                        </el-table-column>
                        <el-table-column
                                prop="attr_name"
                                label="属性名称">
                        </el-table-column>
                        <el-table-column

                                label="操作">
                            <el-button type="primary" icon="el-icon-edit" @click="EditdialogVisible=true">编辑</el-button>
                            <el-button type="danger" icon="el-icon-delete">删除</el-button>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

            </el-tabs>
            <el-dialog
                    title="提示"
                    :visible.sync="EditdialogVisible"
                    width="30%"
            >

               <span slot="footer" class="dialog-footer">
    <el-button @click="EditdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="EditdialogVisible = false">确 定</el-button>
  </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "cateParams",
        created() {
            this.getGoodsList()
        },
        data(){
            return {
                selected:[],
                goodList:[],
                CateProps:{
                    value:'cat_id',
                    children:'children',
                    label:'cat_name'
                },
                selectedId:0,
                activeName:'many',
                ParamsData:[],
                EditdialogVisible:false,
                AdddialogVisible:false,
                AddForm:{
                    attr_name:''
                },
                AddFormrules:{
                    attr_name:[{required:true,message:'请输入参数名称',trigger:'blur'}]
                }
            }
        },
        methods:{
            async getGoodsList(){
                const {data:res}= await this.$http.get('categories')
                if (res.meta.status!==200) return this.$message.error('获取商品分类数据失败')
                this.goodList=res.data




            },
            showInput(row){
                row.inputVisible=true;


            },
            async getParamsList(){
                const {data:res}= await this.$http.get(`categories/${this.selectedId}/attributes`,{params:{sel:this.activeName}})
                if(res.meta.status!==200){

                    return this.$message.error('获取参数列表失败')
                }
                res.data.forEach(item=>{

                    item.attr_vals=item.attr_vals===''?[]:item.attr_vals.split(' ')
                    item.inputVisible=false;
                    item.inputValue='';
                })
                this.ParamsData=res.data;
                console.log(res)

            },
            handleChange(){
                if(this.selected.length!==3){
                    this.selected=[];
                    return

                }
                else{
                    this.selectedId=this.selected[2];
                    this.getParamsList()

                }
            },
            async handleInputConfirm(row){
                if (row.inputValue.trim().length === 0){
                    row.inputValue=''
                    row.inputVisible=false

                    return
                }
                row.attr_vals.push(row.inputValue.trim())
                row.inputValue='';
                row.inputVisible=false
                const {data:res} = await this.$http.put(`categories/${this.selectedId}/attributes/${row.attr_id}`,{
                    attr_name:row.attr_name,
                    attr_sel:row.attr_sel,
                    attr_vals:row.attr_vals.join(' ')
                })
                if(res.meta.status!==200){
                    return this.$message.error('提交参数失败')

                }
                this.$message.success('成功提交参数');

            },
            handleClick(){
                this.getParamsList()

            },
            submitAddParams(){
                this.$refs.AddruleForm.validate(async valid=>{
                    if(!valid)return
                    const{data:res}=await this.$http.post(`categories/${this.selectedId}/attributes`,{
                        attr_sel:this.activeName,
                        attr_name:this.AddForm.attr_name,


                    });
                    console.log(res)
                    if(res.meta.status!==201)return this.$message.error('添加参数失败')
                    this.getParamsList()
                    this.AdddialogVisible=false;


                })




            },
            async CloseTag(row,i){
                row.attr_vals.splice(i,1);
                const {data:res} = await this.$http.put(`categories/${this.selectedId}/attributes/${row.attr_id}`,{
                    attr_name:row.attr_name,
                    attr_sel:row.attr_sel,
                    attr_vals:row.attr_vals.join(' ')
                })
                if(res.meta.status!==200){
                    return this.$message.error('删除失败')

                }
                this.$message.success('成功删除参数');

            },
            getName(){
                if(this.activeName === 'many'){
                    return '动态参数'
                }
                else{
                    return '静态属性'
                }
            }
        }
    }
</script>

<style scoped>
    .el-cascader{
        margin:7px;
    }
    .el-button{
        margin-bottom: 7px;
    }
    .el-tag{
        margin-left: 8px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>