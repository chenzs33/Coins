<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.cname" placeholder="优惠券名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="findCoupon">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="coupons"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="cname" label="优惠券名称" width="150" sortable></el-table-column>
      <!-- <el-table-column prop="cid" label="优惠券ID" width="150" sortable></el-table-column> -->
      <el-table-column prop="minAmount" label="满xx" width="150" sortable></el-table-column>
      <el-table-column prop="amount" label="减xx" width="150" sortable></el-table-column>
      <el-table-column prop="number" label="剩余数量" width="150" sortable></el-table-column>
      <el-table-column prop="sendStartDate" label="开始时间" width="250" sortable></el-table-column>
      <el-table-column prop="sendEndDate" label="结束时间" width="250" sortable></el-table-column>
      <el-table-column label="操作" min-width="150">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="20"
        :total="total"
        style="float:right;"
      ></el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="优惠券名称" prop="cname">
          <el-input v-model="editForm.cname" auto-complete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="优惠券ID" prop="cid">
          <el-input v-model="editForm.cid" auto-complete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="满xx" prop="minAmount">
          <el-input-number v-model="editForm.minAmount" :min="0" :max="10000"></el-input-number>
        </el-form-item>
        <el-form-item label="减xx" prop="amount">
          <el-input-number v-model="editForm.amount" :min="0" :max="10000"></el-input-number>
        </el-form-item>
        <el-form-item label="剩余数量" prop="number">
          <el-input-number v-model="editForm.number" :min="0" :max="10000"></el-input-number>
        </el-form-item>
        <el-form-item label="开始时间" prop="sendStartDate">
          <el-date-picker type="date" placeholder="选择日期" v-model="editForm.sendStartDate"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="sendEndDate">
          <el-date-picker type="date" placeholder="选择日期" v-model="editForm.sendEndDate"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="优惠券名称" prop="cname">
          <el-input v-model="addForm.cname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="满xx" prop="minAmount">
          <el-input-number v-model="addForm.minAmount" :min="0" :max="100000"></el-input-number>
        </el-form-item>
        <el-form-item label="减xx" prop="amount">
          <el-input-number v-model="addForm.amount" :min="0" :max="100000"></el-input-number>
        </el-form-item>
        <el-form-item label="剩余数量" prop="number">
          <el-input-number v-model="addForm.number" :min="0" :max="100000"></el-input-number>
        </el-form-item>
        <!-- <el-form-item label="活动持续天数">
          <el-input-number v-model="addForm.date" :min="0" :max="200"></el-input-number>
        </el-form-item> -->
        <el-form-item label="开始时间" prop="sendStartDate">
          <el-date-picker type="date" placeholder="选择日期" v-model="addForm.sendStartDate"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="sendEndDate">
          <el-date-picker type="date" placeholder="选择日期" v-model="addForm.sendEndDate"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import util from "../../common/js/util";
//import NProgress from 'nprogress'
import {
  selCoupon,
  putCoupon,
  alterCoupon,
  deleteCoupon,
  findCoupon
} from "../../api/api";

import axios from "axios";


export default {
  data() {
    return {
      filters: {
        cname: ""
      },
      coupons: [],
      total: 0,
      currPage: 1,
      pageSize: 20,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        cname: { required: true, message: "请输入优惠券名称", trigger: "blur" },
        minAmount: { required: true, message: "请输入使用条件" },
        amount: { required: true, message: "请输入优惠金额"},
        number: { required: true, message: "请输入剩余优惠券数量"},
        sendStartDate: { required: true, message: "请输入开始时间"},
        sendEndDate: { required: true, message: "请输入结束时间"}
      },
      //编辑界面数据
      editForm: {
        cname:'',
        cid:'',
        minAmount:'',
        amount:'',
        number:'',
        sendStartDate:'',
        sendEndDate:''
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        cname: { required: true, message: "请输入优惠券名称", trigger: "blur" },
        minAmount: { required: true, message: "请输入使用条件"},
        amount: { required: true, message: "请输入优惠金额" },
        number: { required: true, message: "请输入剩余优惠券数量"},
        sendStartDate: { required: true, message: "请输入开始时间" },
        sendEndDate: { required: true, message: "请输入结束时间"}
      },
      //新增界面数据
      addForm: {
        cname:'',
        minAmount:'',
        amount:'',
        number: '',
        sendStartDate:'',
        sendEndDate:''
      }
    };
  },
  methods: {
    //性别显示转换
    formatSex: function(row, column) {
      return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
    },
    handleCurrentChange(val) {
      this.currPage = val;
      this.getCoupons();
    },
    //获取用户列表
    getCoupons() {
      let para = {				
					currPage: this.currPage,
					pageSize: this.pageSize,
				}
      this.listLoading = true;
      // NProgress.start();
      selCoupon(para).then(res => {
        console.log("selCoupon ==>", res);
        this.total = res.data.data.total;
        this.coupons = res.data.data.data;
        this.listLoading = false;
        // NProgress.done();
      });
    },
    findCoupon() {
      let para = {				
          cname: this.filters.cname,
          // currPage: this.currPage,
					// pageSize: this.pageSize,
				}
      this.listLoading = true;
      //NProgress.start();
      findCoupon(para).then(res => {
        // this.total = res.data.data.total;
        this.coupons = res.data.data;
        this.listLoading = false;
        //NProgress.done();
      });
    },
    //删除
    handleDel: function(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { cid: row.cid }; 
          deleteCoupon(para).then(res => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getCoupons();
          });
        })
        .catch(() => {});
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = {
        cname:'',
        minAmount:'',
        amount:'',
        number:'',
        sendStartDate:'',
        sendEndDate:''
      };
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.editForm);
            para.sendStartDate =
              !para.sendStartDate || para.sendStartDate == ""
                ? ""
                : util.formatDate.format(new Date(para.sendStartDate), "yyyy-MM-dd");
            para.sendEndDate =
              !para.sendEndDate || para.sendEndDate == ""
                ? ""
                : util.formatDate.format(new Date(para.sendEndDate), "yyyy-MM-dd");
            alterCoupon(para).then(res => {
              this.editLoading = false;
              //NProgress.done();
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["editForm"].resetFields();
              this.editFormVisible = false;
              this.getCoupons();
            });
          });
        }
      });
    },
    //新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.addForm);
            para.sendStartDate =
              !para.sendStartDate || para.sendStartDate == ""
                ? ""
                : util.formatDate.format(new Date(para.sendStartDate), "yyyy-MM-dd");
            para.sendEndDate =
              !para.sendEndDate || para.sendEndDate == ""
                ? ""
                : util.formatDate.format(new Date(para.sendEndDate), "yyyy-MM-dd");
            putCoupon(para).then(res => {
              console.log('putCoupon ==>',res)
              this.addLoading = false;
              //NProgress.done();
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getCoupons();
            });
          });
        }
      });
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    //批量删除
    // batchRemove: function() {
    //   var cid = this.sels.map(item => item.cid).toString();
    //   this.$confirm("确认删除选中记录吗？", "提示", {
    //     type: "warning"
    //   })
    //     .then(() => {
    //       this.listLoading = true;
    //       //NProgress.start();
    //       let para = { cid: cid };
    //       deleteCoupon(para).then(res => {
    //         this.listLoading = false;
    //         //NProgress.done();
    //         this.$message({
    //           message: "删除成功",
    //           type: "success"
    //         });
    //         this.getCoupons();
    //       });
    //     })
    //     .catch(() => {});
    // }
  },
  mounted() {
    this.getCoupons();
  }
};
</script>

<style scoped>
</style>