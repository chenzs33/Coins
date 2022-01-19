<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <!-- <el-form-item>
          <el-input v-model="filters.tiile" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getBanner">查询</el-button>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="banner"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <!-- <el-table-column prop="aid" label="文章ID" width="120" sortable></el-table-column> -->
      <!-- <el-table-column prop="title" label="标题" width="200" sortable></el-table-column> -->
      <el-table-column prop="imageurl" label="图片地址" width="400" sortable></el-table-column>
      <el-table-column label="操作" min-width="150">
        <template scope="scope">
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

    <!--新增界面-->
    <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <!-- <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title" auto-complete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="图片地址" prop="imageurl">
          <el-input type="textarea" v-model="addForm.imageurl" auto-complete="off"></el-input>
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
  selActivity,putActivity,deleteActivity
} from "../../api/api";

export default {
  data() {
    return {
      filters: {
        title: ""
      },
      banner: [],
      total: 0,
      currPage: 1,
      pageSize: 20,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        title: { required: true, message: "请输入标题", trigger: "blur" },
        imageurl: { required: true, message: "请输入图片地址", trigger: "blur" },
      },
      //编辑界面数据
      editForm: {
        aid:'',
        title:'',
        imageurl:''
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        title: { required: true, message: "请输入标题", trigger: "blur" },
        imageurl: { required: true, message: "请输入图片地址", trigger: "blur" },
      },
      //新增界面数据
      addForm: {
        title:'',
        imageurl:''
      }
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.currPage = val;
      this.getBanner();
    },
    //获取用户列表
    getBanner() {
      let para = {
        currPage: this.currPage,
        pageSize: this.pageSize
      };
      this.listLoading = true;
      //NProgress.start();
      selActivity(para).then(res => {
        console.log("selActivity ==>", res);
        // this.total = res.data.data.total;
        this.banner = res.data.data;
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
          let para = { actid: row.actid };
          deleteActivity(para).then(res => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getBanner();
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
        imageurl:'',
      };
    },
    //编辑
    // editSubmit: function() {
    //   this.$refs.editForm.validate(valid => {
    //     if (valid) {
    //       this.$confirm("确认提交吗？", "提示", {}).then(() => {
    //         this.editLoading = true;
    //         //NProgress.start();
    //         let para = Object.assign({}, this.editForm);
    //         alterEssay(para).then(res => {
    //           console.log('alterEssay修改文章para，res==>',para,res)
    //           this.editLoading = false;
    //           //NProgress.done();
    //           this.$message({
    //             message: "提交成功",
    //             type: "success"
    //           });
    //           this.$refs["editForm"].resetFields();
    //           this.editFormVisible = false;
    //           this.getBanner();
    //         });
    //       });
    //     }
    //   });
    // },
    //新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.addForm);
            putActivity(para).then(res => {
              this.addLoading = false;
              //NProgress.done();
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getBanner();
            });
          });
        }
      });
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    // //批量删除
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
    //         this.getBanner();
    //       });
    //     })
    //     .catch(() => {});
    // }
  },
  mounted() {
    this.getBanner();
  }
};
</script>

<style scoped>
</style>