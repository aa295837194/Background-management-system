<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>

        </el-breadcrumb>
        <el-card>
            <el-table
                    :data="orderData"
                    style="width: 100%"
            border>
                <el-table-column type="index" label="#"></el-table-column>


                <el-table-column
                        prop="order_number"
                        label="订单编号"
                        >
                </el-table-column>
                <el-table-column
                        prop="order_price"
                        label="订单价格">
                </el-table-column>
                <el-table-column
                        label="是否付款">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="is_send"
                        label="是否发货">
                </el-table-column>
                <el-table-column

                        label="下单时间">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dateFormater}}
                    </template>
                </el-table-column>
                <el-table-column

                        label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" @click="showDialog"></el-button>
                        <el-button type="success" @click="showDelivery">物流信息</el-button>
                    </template>

                </el-table-column>
            </el-table>
            <el-dialog
                    title="提示"
                    :visible.sync="dialogVisible"
                    width="30%"
                    @close="closeEvent">
                <el-form :model="addressForm" :rules="addressFormRules" ref="addruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="省市区/县" prop="address1">
                        <el-cascader
                                v-model="addressForm.address1"
                                :options="cityData"
                                :props="{ expandTrigger: 'hover' }"
                                @change="handleChange"></el-cascader>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="address2">
                        <el-input v-model="addressForm.address2"></el-input>
                    </el-form-item>
                    </el-form>
                <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
            </el-dialog>
            <el-dialog
                    title="提示"
                    :visible.sync="wuLiudialogVisible"
                    width="30%"
                    >


                <el-timeline >
                    <el-timeline-item
                            v-for="(activity, index) in kuaidi"
                            :key="index"
                            :timestamp="activity.time">
                        {{activity.context}}
                    </el-timeline-item>
                </el-timeline>
                <span slot="footer" class="dialog-footer">

  </span>
            </el-dialog>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[3,5,10,20]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>

    </div>
</template>

<script>
    import citydata from "./citydata";
    export default {
        name: "order",
        created() {
            this.getOrderData()
        },
        data(){
            return {
                queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:10,
                },
                orderData:[],
                total:0,
                dialogVisible:false,
                cityData:citydata,
                addressForm:{
                    address1:[],
                    address2:''
                },
                addressFormRules:{
                    address1:[{required:true ,message:'请选择省市区',trigger:'blur'}],
                    address2:[{required:true ,message:'请选择省市区',trigger:'blur'}]
                },
                wuLiudialogVisible:false,
                kuaidi:[]
            }
        },
        methods:{
            async getOrderData(){
                const{data:res} =await this.$http.get('orders',{params:this.queryInfo})
                if(res.meta.status!=200){
                    return this.$message.error('获取订单数据失败')
                }
                this.orderData=res.data.goods
                this.total=res.data.total

            },
            showDialog(){
                this.dialogVisible=true


            },
            handleSizeChange(newSize){
                this.queryInfo.pagesize=newSize
            },
            handleCurrentChange(newPage){
                this.queryInfo.pagenum=newPage
            },
            handleChange(){},
            closeEvent(){
                this.addressForm.address1=[]
            },
           async showDelivery(){
               const {data :res }= await this.$http.get('/kuaidi/1106975712662')
               if (res.meta.status!==200){
                   return this.$message.error('获取物流进度失败')
               }
               this.kuaidi=res.data

               this.wuLiudialogVisible=true


            },

        }
    }
</script>

<style scoped>

</style>