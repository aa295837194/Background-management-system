<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-steps :space="200" :active="activeIndex-0" finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form :model="addForm" :rules="addFormRules" ref="addRuleForm" label-width="100px" label-position="top">

                <el-tabs tab-position="left"  v-model="activeIndex" :before-leave="beforeLeave" @tab-click="tabClick">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name" >
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">

                            <el-cascader
                                    v-model="addForm.goods_cat"

                                    :options="goodsCate"
                                    :props="{ expandTrigger: 'hover',
                                 value:'cat_id',
                                 label:'cat_name',
                                 children:'children'
                                 }"
                                    @change="handleChange"></el-cascader>
                        </el-form-item>


                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item v-for="(item,index) in manyData" :key="index"> {{item.attr_name}}
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox v-for="(item2,index2) in item.attr_vals" :key="index2" :label="item2"></el-checkbox>

                            </el-checkbox-group>
                        </el-form-item>


                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item v-for="(item,index) in onlyData" :key="index">{{item.attr_name}}
                            <el-input v-model="item.attr_vals"></el-input>

                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload

                                action="http://127.0.0.1:8888/api/private/v1/upload"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                list-type="picture"
                                :headers="getToken"
                                :file-list="fileList"
                                :on-success="success"
                        >
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor> </quill-editor>
                        <el-button type="primary" @click="submit">添加商品</el-button>
                    </el-tab-pane>

                </el-tabs>
            </el-form>
        </el-card>

    </div>
</template>

<script>
    import _ from 'lodash'
    export default {
        name: "addGood",
        data(){
            return  {
                activeIndex:'0',
                addForm:{
                    goods_name:'',
                    goods_cat:[],
                    goods_price:'',
                    goods_number:'',
                    goods_weight:'',
                    goods_introduce:'',
                    pics:[],
                    attrs:[],
                },
                addFormRules: {
                    goods_name:[{required:true,message:'请输入商品消息',trigger:'blur'}],
                    goods_price:[{required:true,message:'请输入商品价格',trigger:'blur'}],
                    goods_weight:[{required:true,message:'请输入商品重量',trigger:'blur'}],
                    goods_number:[{required:true,message:'请输入商品数量',trigger:'blur'}],
                    cate:[{required:true}],
                },
                onlyData:[],
                manyData:[],
                selectId:0,

                goodsCate:[],
                fileList:[],
                getToken:{
                    Authorization:window.sessionStorage.getItem('token')
                }
            }
        },
        created(){
            this.getGoodsCate()

        },
        methods:{
            async getGoodsCate(){
                if(this.activeIndex==='0'){
                    const{data:res}=await this.$http.get('categories')
                    if(res.meta.status!=200){
                        return this.$message.error('获取商品分类失败')
                    }
                    this.goodsCate=res.data

                }
            },
            handleChange(){
                if(this.addForm.goods_cat.length!==3){
                    this.addForm.goods_cat=[]

                }
                this.selectId=this.addForm.goods_cat[2]


            },
            beforeLeave(activeName, oldActiveName){
                if(oldActiveName==='0' && this.addForm.goods_cat.length!=3){
                    this.$message.error('请选择商品分类')
                    return false
                }
            },
            async tabClick(){
                if(this.activeIndex==='1'){
                    const{data :res}=await this.$http.get(`categories/${this.selectId}/attributes`,{params:{sel:'many'}})
                    if(res.meta.status!==200){
                        return this.$message.error('获取动态参数失败')



                    }
                    res.data.forEach(item=>{
                        item.attr_vals=item.attr_vals.length===0?[]:item.attr_vals.split(' ')
                    })
                    this.manyData=res.data
                }
                else if(this.activeIndex==='2'){
                    const{data :res}=await this.$http.get(`categories/${this.selectId}/attributes`,{params:{sel:'only'}})
                    if(res.meta.status!==200){
                        return this.$message.error('获取静态参数失败')



                    }


                    this.onlyData=res.data
                    console.log(this.onlyData)
                }

            },
            handlePreview(){

            },
            handleRemove(file){
                console.log(file)
                const pth=file.response.data.tmp_path
                const i= this.addForm.pics.findIndex(item=>item.pic===pth
                )
                this.addForm.pics.splice(i,1)


            },
            success(file){

                this.addForm.pics.push({pic:file.data.tmp_path})
            },
            async submit(){
                this.$refs.addRuleForm.validate(valid=>{
                    if(!valid){
                        this.$message.error('请输入未完成的表单项')
                    }

                })
                this.onlyData.forEach(item=>{
                    const newInfo={
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals
                    }
                    this.addForm.attrs.push(newInfo)

                })
                this.manyData.forEach(item=>{
                    const newInfo={
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals.join(' ')
                    }
                    this.addForm.attrs.push(newInfo)

                })
                const form=_.cloneDeep(this.addForm)
                form.goods_cat=form.goods_cat.join(',')
                const {data:res} = await this.$http.post('goods',form)
                console.log(form)
                if(res.meta.status!=201){
                    console.log(res)
                    return this.$message.error('添加商品失败')
                }
                this.$message.success('添加商品成功')
                this.$router.push('/goods')
            }





        }
    }
</script>

<style scoped>
    .el-steps{
        margin-bottom: 25px;
    }

</style>