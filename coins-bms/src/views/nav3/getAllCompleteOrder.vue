<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.uphone" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="selectPayone">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="WillOrder"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>

      <el-table-column
        prop="username"
        label="用户名"
        width="120"
        sortable
      ></el-table-column>
      <el-table-column
        prop="phone"
        label="联系方式"
        width="150"
        sortable
      ></el-table-column>
      <el-table-column
        prop="title"
        label="兑换商品"
        width="120"
        sortable
      ></el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        min-width="120"
        sortable
      ></el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="20"
        :total="total"
        style="float: right"
      ></el-pagination>
    </el-col>
  </section>
</template>

<script>
import util from "../../common/js/util";
//import NProgress from 'nprogress'
import { getExchangeByPage, exchanged } from "../../api/api";

export default {
  data() {
    return {
      filters: {
        uphone: "",
      },
      WillOrder: [],
      total: 0,
      currPage: 1,
      pageSize: 20,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {},
      //编辑界面数据
      editForm: {
        uid: "",
        orderid: "",
        roomname: "",
        orderstatus: "",
      },
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.currPage = val;
      this.getExchangeByPage();
    },
    //获取用户列表
    getExchangeByPage() {
      let para = {
        page: this.currPage,
        pageSize: this.pageSize,
        status: 1,
      };

      this.listLoading = true;
      //NProgress.start();
      getExchangeByPage(para).then((res) => {
        console.log("getExchangeByPage ==> ", res);
        this.total = res.data.count;
        this.WillOrder = res.data.list;
        this.listLoading = false;
        //NProgress.done();
      });
    },
    //查找
    selectPayone() {
      let para = {
        uphone: this.filters.uphone,
        // currPage: this.currPage,
        // pageSize: this.pageSize,
      };
      this.listLoading = true;
      if (para.uphone.length != 0) {
        //NProgress.start();
        selectPayone(para).then((res) => {
          // this.total = res.data.data.total;
          this.WillOrder = res.data.data;
          this.listLoading = false;
          //NProgress.done();
        });
      } else {
        this.getExchangeByPage();
      }
    },

    selsChange: function (sels) {
      this.sels = sels;
    },
  },
  mounted() {
    this.getExchangeByPage();
  },
};
</script>

<style scoped></style>
