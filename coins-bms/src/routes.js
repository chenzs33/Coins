import Login from "./views/Login.vue";
import NotFound from "./views/404.vue";
import Home from "./views/Home.vue";
import Main from "./views/Main.vue";
// import Table from './views/nav1/Table.vue'
// import Form from './views/nav1/Form.vue'
// import user from './views/nav1/user.vue'
import charts from "./views/charts/echarts.vue";
import user from "./views/nav1/user.vue";
import feedback from "./views/nav1/feedback.vue";
import article from "./views/nav1/article.vue";
import goods from "./views/nav1/goods.vue";

import admin from "./views/nav2/admin.vue";

import getAllWillOrder from "./views/nav3/getAllWillOrder.vue";
import getAllCompleteOrder from "./views/nav3/getAllCompleteOrder.vue";

let routes = [
  {
    path: "/login",
    component: Login,
    name: "",
    hidden: true,
  },
  {
    path: "/404",
    component: NotFound,
    name: "",
    hidden: true,
  },
  {
    path: "/",
    component: Home,
    name: "信息管理",
    // iconCls: 'el-icon-message',//图标样式class
    children: [
      { path: "/main", component: Main, name: "主页", hidden: true },
      { path: "/user", component: user, name: "用户信息管理" },
      { path: "/goods", component: goods, name: "兑换商品管理" },
      { path: "/article", component: article, name: "用户帖子管理" },
      { path: "/feedback", component: feedback, name: "用户反馈信息" },
    ],
  },
  {
    path: "/",
    component: Home,
    name: "内部管理",
    // iconCls: 'fa fa-id-card-o',
    children: [
      { path: "/admin", component: admin, name: "管理员" },
      { path: "/charts", component: charts, name: "统计" },
    ],
  },
  {
    path: "/",
    component: Home,
    name: "兑换订单管理",
    // iconCls: 'fa fa-bar-chart',
    children: [
      { path: "/getAllWillOrder", component: getAllWillOrder, name: "待兑换" },
      {
        path: "/getAllCompleteOrder",
        component: getAllCompleteOrder,
        name: "已兑换",
      },
    ],
  },
  {
    path: "*",
    hidden: true,
    redirect: { path: "/404" },
  },
];

export default routes;
