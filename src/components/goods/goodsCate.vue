<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>

        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="AddFormButton">添加分类</el-button>
                </el-col>
            </el-row>
            <el-dialog
                    title="提示"
                    :visible.sync="addFormdialogVisible"
                    width="30%"
                    @close="closeDialog"
                    >
                <el-form ref="addFormRef" :model="addForm" label-width="80px" :rules='addFormRules' >
                    <el-form-item label="分类名称" prop="cat_name">
                        <el-input v-model="addForm.cat_name" ></el-input>
                    </el-form-item>
                    <el-form-item label="父级分类">
                        <el-cascader
                                v-model="selected"
                                :options="parentList"
                                expand-trigger="hover"
                                :props='parentProps'
                                @change="parentCateChanged"
                                clearable

                                ></el-cascader>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
    <el-button @click="addFormdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitData">确 定</el-button>
  </span>
            </el-dialog>
            <tree-table :data="goodsList" :columns="columns" show-index index-text="#" :selection-type="false" :expand-type="false" border>
                <template slot="effective" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted===false"></i>
                    <i class="el-icon-error" v-else></i>
                </template>
                <template slot="order" slot-scope="scope">
                    <el-tag type="primary" v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>
            </tree-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="this.queryInfo.pagenum"
                    :page-sizes="[3, 5, 8, 10]"

                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>


    </div>
</template>

<script>
    export default {
        name: "goodsCate",
        data(){
            return{
                goodsList:[],
                columns:[
                    {
                    label:'分类名称',
                    prop:'cat_name',
                },
                    {
                        label:'是否有效',

                        type:'template',
                        template:'effective'
                    },
                    {
                        label:'排序',

                        type:'template',
                        template:'order'
                    }],
                queryInfo:{
                    type:3,
                    pagenum:1,
                    pagesize:4,
                },
                total:0,
                addFormdialogVisible:false,
                addForm:{
                    cat_name:'',
                    cat_pid:0,
                    cat_level:0,
                },
                addFormRules:{
                    cat_name:[{required:true,message:'请输入分类名称',trigger:'blur'
                    }]
                },
                parentList:[],
                selected:[],
                parentProps:{
                    value:'cat_id',
                    children:'children',
                    label:'cat_name',
                    checkStrictly:true,


                }



            }
        },
        created() {
            this.getGoodsList()

        },
        methods:{
           async getGoodsList(){
            const {data:res}= await this.$http.get('categories',{params:this.queryInfo})
               if (res.meta.status!==200)return this.$message.error('获取商品分类数据失败')
               this.goodsList=res.data.result
                this.total=res.data.total


            },
            handleSizeChange(newSize){
               this.queryInfo.pagesize=newSize;
               this.getGoodsList()
            },
            handleCurrentChange(currentPage){
               this.queryInfo.pagenum=currentPage;
                this.getGoodsList()

    },
            async AddFormButton(){
                const {data:res}= await this.$http.get('categories',{params:{type:2}})
                if (res.meta.status!==200)return this.$message.error('获取商品分类数据失败')
                this.parentList=res.data
               this.addFormdialogVisible=true;
            },
            parentCateChanged(){
               if(this.selected.length>0){
                   this.addForm.cat_pid=this.selected[this.selected.length-1];
                   this.addForm.cat_level=this.selected.length;
                   return

               }
               else{
                   this.addForm.cat_pid = 0
                   this.addForm.cat_level=0;
               }
            },
            closeDialog(){
               this.$refs['addFormRef'].resetFields();
               this.selected=[],
                   this.addForm.cat_level=0;
               this.addForm.cat_pid=0;

            },
              submitData(){
               this.$refs.addFormRef.validate(async valid=>{
                   if(!valid) return
                   const {data:res}=await  this.$http.post('categories',this.addForm)
                   if(res.meta.status!==201)return this.$message.error('提交商品分类失败')
                   this.$message.success('提交商品分类成功')
                   this.getGoodsList();
                   this.addFormdialogVisible=false;
               })
            }
        }
    }
</script>

<style >

    .el-cascader-panel{
        height:200px;
    }
</style>