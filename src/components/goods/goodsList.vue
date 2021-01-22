<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>

        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-input placeholder="请输入内容" v-model="goodsParams.query" >

                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="AddGood">添加商品</el-button>
                </el-col>
            </el-row>


            <el-table
                    :data="goodslist"
                    border
                    style="width: 100%">
                <el-table-column
                        prop="goods_name"
                        label="商品名称"
                >
                </el-table-column>
                <el-table-column
                        prop="goods_price"
                        label="商品价格"
                >
                </el-table-column>
                <el-table-column
                        prop="goods_weight"
                        label="商品重量">
                </el-table-column>
                <el-table-column

                        label="创建时间"
                >
                    <template slot-scope="scope">{{scope.row.add_time | dateFormater}}</template>
                </el-table-column>
                <el-table-column

                        label="操作"
                >
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" ></el-button>

                        <el-button type="danger" icon="el-icon-delete" @click="deleteGood(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>

            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="goodsParams.pagenum"
                    :page-sizes="[3,5,10]"
                    :page-size="goodsParams.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>

        </el-card></div>

</template>

<script>
    export default {
        name: "goodslist",
        data(){
            return{
                goodslist:[],
                goodsParams:{
                    query:'',
                    pagenum:1,
                    pagesize:10,
                },
                total:0

            }
        },
        created() {
            this.getGoodsList()
        },
        methods:{
            async getGoodsList(){
                const {data :res} = await this.$http.get('goods',{params:this.goodsParams})
                if(res.meta.status!==200)
                    return this.$message.error('获取商品列表失败')
                this.goodslist=res.data.goods
                this.total=res.data.total

            },
            async deleteGood(id){
                const confirmResult= await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err=>err)
                if(confirmResult !== 'confirm'){
                    return this.$message.info('删除已取消')
                }
                const {data:res} =await this.$http.delete(`goods/${id}`)
                console.log(res)
                if(res.meta.status!==200){
                    return this.$message.error('删除商品失败')
                }
                this.$message.success('删除商品成功')
                this.getGoodsList()

            },
            handleSizeChange(newSize){
                this.goodsParams.pagesize=newSize
                this.getGoodsList()
            },
            handleCurrentChange(newPage){
                this.goodsParams.pagenum=newPage
                this.getGoodsList()

            },
            AddGood(){
                this.$router.push('goods/addGood')
            }

        }
    }
</script>

<style scoped>

</style>