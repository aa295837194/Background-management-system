import Vue from 'vue'
import {
    Button,
    Message,
    Form,
    FormItem,
    Input,
    Container,
    Header,
    Main,
    Aside,
    Menu,
    MenuItem,
    MenuItemGroup,
    Submenu,
    Breadcrumb, BreadcrumbItem, Card, Col, Row, Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox
} from 'element-ui'



Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Message)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Col)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)



Vue.prototype.$message=Message;
Vue.prototype.$confirm=MessageBox.confirm;