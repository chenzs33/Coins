<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.username" placeholder="登录名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getAdminBykw">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="admins"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column
        prop="username"
        label="登录名"
        width="250"
        sortable
      ></el-table-column>
      <el-table-column
        prop="password"
        label="密码"
        width="250"
        sortable
      ></el-table-column>

      <el-table-column label="操作" min-width="150">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="handleDel(scope.$index, scope.row)"
            >删除</el-button
          >
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
        style="float: right"
      ></el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog
      title="编辑"
      v-model="editFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editForm"
        label-width="80px"
        :rules="editFormRules"
        ref="editForm"
      >
        <el-form-item label="姓名" prop="username">
          <el-input v-model="editForm.username" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="editForm.password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click.native="editSubmit"
          :loading="editLoading"
          >提交</el-button
        >
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog
      title="新增"
      v-model="addFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addForm"
        label-width="80px"
        :rules="addFormRules"
        ref="addForm"
      >
        <el-form-item label="登录名" prop="username">
          <el-input v-model="addForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click.native="addSubmit"
          :loading="addLoading"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </section>
</template>

<script>
import util from "../../common/js/util";
//import NProgress from 'nprogress'
import {
  getAdminByPage,
  addAdmin,
  updateAdmin,
  deleteAdmin,
  getAdminBykw,
} from "../../api/api";

export default {
  data() {
    return {
      filters: {
        name: "",
      },
      admins: [],
      total: 0,
      currPage: 1,
      pageSize: 20,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        username: { required: true, message: "请输入登录名", trigger: "blur" },
        password: { required: true, message: "请输入密码", trigger: "blur" },
      },
      //编辑界面数据
      editForm: {
        username: "",
        password: "",
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        username: { required: true, message: "请输入登录名", trigger: "blur" },
        password: { required: true, message: "请输入密码", trigger: "blur" },
      },
      //新增界面数据
      addForm: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.currPage = val;
      this.getAdmins();
    },
    //获取用户列表
    getAdmins() {
      let para = {
        currPage: this.currPage,
        pageSize: this.pageSize,
      };
      this.listLoading = true;
      //NProgress.start();
      getAdminByPage(para).then((res) => {
        console.log("getAdminByPage获取管理员==>", res);
        this.count = res.data.count;
        this.admins = res.data.info.list;
        this.listLoading = false;
        //NProgress.done();
      });
    },
    //查找用户名
    getAdminBykw() {
      let para = {
        username: this.filters.username,
      };
      this.listLoading = true;
      //NProgress.start();
      getAdminBykw(para).then((res) => {
        this.admins = res.data.list;
        this.listLoading = false;
        //NProgress.done();
      });
    },
    //删除
    handleDel: function (index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning",
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { _id: row._id };
          deleteAdmin(para).then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getAdmins();
          });
        })
        .catch(() => {});
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面
    handleAdd: function () {
      this.addFormVisible = true;
      this.addForm = {
        username: "",
        password: "",
      };
    },
    //编辑
    editSubmit: function () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let para = Object.assign({}, this.editForm);
            updateAdmin(para).then((res) => {
              this.editLoading = false;
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.$refs["editForm"].resetFields();
              this.editFormVisible = false;
              this.getAdmins();
            });
          });
        }
      });
    },
    //新增
    addSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.addForm);
            addAdmin(para).then((res) => {
              this.addLoading = false;
              //NProgress.done();

              let { msg, code } = res.data;
              if (code !== 2000) {
                this.$message({
                  message: msg,
                  type: "error",
                });

              } else {
                this.$message({
                  message: "提交成功",
                  type: "success",
                });
                this.$refs["addForm"].resetFields();
                this.addFormVisible = false;
              }
                
                this.getAdmins();
            });
          });
        }
      });
    },
    selsChange: function (sels) {
      this.sels = sels;
    },
    //批量删除
    // batchRemove: function() {
    //   var ids = this.sels.map(item => item.id).toString();
    //   this.$confirm("确认删除选中记录吗？", "提示", {
    //     type: "warning"
    //   })
    //     .then(() => {
    //       this.listLoading = true;
    //       //NProgress.start();
    //       let para = { ids: ids };
    //       batchRemoveUser(para).then(res => {
    //         this.listLoading = false;
    //         //NProgress.done();
    //         this.$message({
    //           message: "删除成功",
    //           type: "success"
    //         });
    //         this.getAdmins();
    //       });
    //     })
    //     .catch(() => {});
    // }
  },
  mounted() {
    this.getAdmins();
  },
};
</script>

<style scoped>
</style>