<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.tiile" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getEssay">查询</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item> -->
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="article"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <!-- <el-table-column prop="aid" label="文章ID" width="120" sortable></el-table-column> -->
      
      <!-- <el-table-column prop="imageurl" label="图片地址" width="300" sortable></el-table-column> -->
      <el-table-column prop="userID" label="用户ID" width="320" sortable></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="150" sortable></el-table-column>
      <el-table-column prop="content" label="内容" min-width="200" sortable></el-table-column>
      <el-table-column prop="likeNum" label="点赞数" width="150" sortable></el-table-column>
      <el-table-column prop="commentNum" label="评论数" width="150" sortable></el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
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
        <!-- <el-form-item label="文章ID" prop="aid">
          <el-input v-model="editForm.aid" auto-complete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="标题" prop="title">
          <el-input v-model="editForm.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片地址" prop="imageurl">
          <el-input v-model="editForm.imageurl" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content"> 
          <el-input type="textarea" v-model="editForm.content"></el-input>
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
        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片地址" prop="imageurl">
          <el-input v-model="addForm.imageurl" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" v-model="addForm.content"></el-input>
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
  getDiscover,
  delDiscover
} from "../../api/api";

export default {
  data() {
    return {
      filters: {
        title: ""
      },
      article: [],
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
        content: { required: true, message: "请输入内容", trigger: "blur" },
      },
      //编辑界面数据
      editForm: {
        aid:'',
        title:'',
        content:'',
        imageurl:''
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        title: { required: true, message: "请输入标题", trigger: "blur" },
        imageurl: { required: true, message: "请输入图片地址", trigger: "blur" },
        content: { required: true, message: "请输入内容", trigger: "blur" },
      },
      //新增界面数据
      addForm: {
        title:'',
        content:'',
        imageurl:''
      }
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.currPage = val;
      this.getEssay();
    },
    //获取用户列表
    getEssay() {
      let para = {
        page: this.currPage,
        pageSize: this.pageSize
      };
      this.listLoading = true;
      //NProgress.start();
      getDiscover(para).then(res => {
        console.log("getDiscover ==>", res);
        this.total = res.data.count;
        this.article = res.data.list;
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
          let para = { aid: row.aid };
          delDiscover(para).then(res => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getEssay();
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
        title:'',
        content:'',
        imageurl:'',
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
            alterEssay(para).then(res => {
              console.log('alterEssay修改文章para，res==>',para,res)
              this.editLoading = false;
              //NProgress.done();
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["editForm"].resetFields();
              this.editFormVisible = false;
              this.getEssay();
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
            putEssay(para).then(res => {
              this.addLoading = false;
              //NProgress.done();
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getEssay();
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
    //         this.getEssay();
    //       });
    //     })
    //     .catch(() => {});
    // }
  },
  mounted() {
    this.getEssay();
  }
};
</script>

<style scoped>
</style>