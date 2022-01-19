<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.feedbackText" placeholder="内容"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="selectVipByUphone">查询</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item> -->
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="feedback"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="userID" label="用户ID" width="300" sortable></el-table-column>
	  <el-table-column prop="feedbackText" label="反馈内容" min-width="180" sortable></el-table-column>
      <!-- <el-table-column prop="phone" label="手机号" width="180" sortable></el-table-column> -->
	  <!-- <el-table-column prop="" label="" min-width="180" ></el-table-column> -->
      <!-- <el-table-column label="操作" min-width="150">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="20"
        :total="total"
        style="float:right;"
      ></el-pagination>
    </el-col>

  </section>
</template>

<script>
import util from "../../common/js/util";
//import NProgress from 'nprogress'
import { getFeedbackList } from "../../api/api";

export default {
  data() {
    return {
      filters: {
        phone: ""
      },
      feedback: [],
      total: 0,
      currPage: 1,
      pageSize: 15,
      listLoading: false,
      sels: [], //列表选中列

    //   editFormVisible: false, //编辑界面是否显示
    //   editLoading: false,
    //   editFormRules: {
    //     gname: { required: true, message: "请输入商品名称", trigger: "blur" },
    //     imageurl: {
    //       required: true,
    //       message: "请输入商品图片地址",
    //       trigger: "blur"
    //     },
    //     grade: { required: true, message: "兑换所需积分" },
    //     num: { required: true, message: "剩余数量" }
    //   },
    //   //编辑界面数据
    //   editForm: {
    //     gname: "",
    //     imageurl: "",
    //     grade: "",
    //     num: ""
    //   },

    //   addFormVisible: false, //新增界面是否显示
    //   addLoading: false,
    //   addFormRules: {
    //     gname: { required: true, message: "请输入商品名称", trigger: "blur" },
    //     imageurl: {
    //       required: true,
    //       message: "请输入商品图片地址",
    //       trigger: "blur"
    //     },
    //     grade: { required: true, message: "兑换所需积分" },
    //     num: { required: true, message: "剩余数量" }
    //   },
    //   //新增界面数据
    //   addForm: {
    //     gname: "",
    //     imageurl: "",
    //     grade: "",
    //     num: ""
    //   }
    };
  },
  methods: {
    //性别显示转换
    formatSex: function(row, column) {
      return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
    },
    handleCurrentChange(val) {
      this.currPage = val;
      this.getFeedbackList();
    },
    //获取商品列表
    getFeedbackList() {
      let para = {
        page: this.currPage,
        pageSize: this.pageSize
      };
      // this.listLoading = true;
      //NProgress.start();
      getFeedbackList(para).then(res => {
        console.log("getFeedbackList ==>", res);
        this.total = res.data.count;
        this.feedback = res.data.list;
        this.listLoading = false;
        //NProgress.done();
      });
    },
    //查找
    // selectVipByUphone() {
    //   let para = {				
    //       phone: this.filters.phone,
    //       // currPage: this.currPage,
	// 				// pageSize: this.pageSize,
	// 			}
    //   this.listLoading = true;
    //   if(para.phone.length!=0){
    //     //NProgress.start();
    //     selectVipByUphone(para).then(res => {
    //       // this.total = res.data.data.total;
    //       this.vips = res.data.data;
    //       this.listLoading = false;
    //       //NProgress.done();
    //     });
    //   }else{
    //     this.getFeedbackList()
    //   }
    // },
    //删除
    handleDel: function(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { gid: row.gid };
          deleteGoods(para).then(res => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getFeedbackList();
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
        gname: "",
        imageurl: "",
        grade: "",
        num: ""
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
            editGoods(para).then(res => {
              this.editLoading = false;
              //NProgress.done();
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["editForm"].resetFields();
              this.editFormVisible = false;
              this.getFeedbackList();
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
            // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
            addGoods(para).then(res => {
              console.log("addGoods新增成功==>", res);
              this.addLoading = false;
              //NProgress.done();
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getFeedbackList();
            });
          });
        }
      });
    },
    selsChange: function(sels) {
      this.sels = sels;
    }
    //批量删除
    // batchRemove: function () {
    // 	var ids = this.sels.map(item => item.id).toString();
    // 	this.$confirm('确认删除选中记录吗？', '提示', {
    // 		type: 'warning'
    // 	}).then(() => {
    // 		this.listLoading = true;
    // 		//NProgress.start();
    // 		let para = { ids: ids };
    // 		batchRemoveUser(para).then((res) => {
    // 			this.listLoading = false;
    // 			//NProgress.done();
    // 			this.$message({
    // 				message: '删除成功',
    // 				type: 'success'
    // 			});
    // 			this.getAllVips();
    // 		});
    // 	}).catch(() => {

    // 	});
    // }
  },
  mounted() {
    this.getFeedbackList();
  }
};
</script>

<style scoped>
</style>