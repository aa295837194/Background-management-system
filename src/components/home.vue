<template>
    <el-container>
        <el-header>
            <div class="center">
                <img src="../assets/heima.png" alt="">
                <span>电商后台管理系统</span>
            </div>

            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="isCollapse ? '64px':'200px'"  >
                <div class="toggle-button" @click="toCollapse">
                    |||
                </div>
                <el-menu
                        background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition=false router :default-active="activePath">
                    <el-submenu :index="item.id +'' "  v-for="item in menuList" :key="item.id">
                        <template slot="title">
                            <i :class='iconList[item.id]'></i>
                            <span>{{item.authName}}</span>
                        </template>


                            <el-menu-item :index="'/'+subitem.path " v-for="subitem in item.children" :key="subitem.id" @click="SavePath('/'+subitem.path)" >
                                <template slot="title">
                                    <i class="el-icon-menu"></i>
                                    <span>{{subitem.authName}}</span>
                                </template>

                            </el-menu-item>


                    </el-submenu>


                </el-menu>
            </el-aside>
            <el-main><router-view></router-view></el-main>
        </el-container>
    </el-container>

</template>

<script>
    export default {
        data(){
            return {
                menuList:[],
                iconList:{
                    '125':'iconfont icon-user',
                    '103':'iconfont icon-tijikongjian',
                    '101':'iconfont icon-shangpin',
                    '102':'iconfont icon-danju',
                    '145':'iconfont icon-baobiao',

                },
                isCollapse:false,
                activePath:'',
            }
        },
        created() {
            this.getMenuList();
            this.activePath=window.sessionStorage.getItem('CurrentPath')
        },
        methods : {
            logout(){
                window.sessionStorage.clear();
                this.$router.push('/login')
            },
            async getMenuList(){
                const {data :res }= await this.$http.get('menus');
                if(res.meta.status!=200) return this.$message.error(res.meta.msg);
                this.menuList=res.data;
                console.log(res)
            },
            toCollapse(){
                this.isCollapse=!this.isCollapse;
            },
            SavePath(activePath){
                window.sessionStorage.setItem('CurrentPath',activePath);
                this.activePath=activePath;
            }
        }
    }
</script>

<style scoped>
.el-header{
    background-color: #373d41;
    display:flex;
    justify-content: space-between;
    color:white;
    font-size:20px;

}
    .el-aside{
        background-color: #333744;

    }
    .el-main{
        background-color: #EAEDF1;
    }
    .el-container{
        width: 100%;
        height: 100%;
    }
    .center{
        display: flex;
        align-items: center;

    }
    .center span {
        margin-left: 15px;
    }

    .el-menu-item span{
        color:white;
    }
    .iconfont{
        margin-right:10px;
    }
    .toggle-button{
        font-size: 12px;
        line-height: 24px;
        letter-spacing: 0.2em;
        text-align: center;
        color:white;
        background-color: #4a5064;
        cursor: pointer;

    }
</style>