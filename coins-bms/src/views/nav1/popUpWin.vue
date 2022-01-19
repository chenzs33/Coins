<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <!-- <el-form-item>
          <el-input v-model="filters.tiile" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getPicture">查询</el-button>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="picture"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <!-- <el-table-column prop="aid" label="文章ID" width="120" sortable></el-table-column> -->
      <!-- <el-table-column prop="title" label="标题" width="200" sortable></el-table-column> -->
      <!-- <el-table-column prop="pid" label="图片ID" width="100" sortable></el-table-column> -->
      <el-table-column prop="pname" label="图片标题" width="200" sortable></el-table-column>
      <el-table-column prop="purl" label="图片地址" width="400" sortable></el-table-column>
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
        <el-form-item label="图片标题" prop="pname">
          <el-input v-model="addForm.pname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片地址" prop="purl">
          <el-input type="textarea" v-model="addForm.purl" auto-complete="off"></el-input>
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
  getPicture,insertPicture,updatePicture,deletePicture
} from "../../api/api";

export default {
  data() {
    return {
      filters: {
        title: ""
      },
      picture: [],
      total: 0,
      currPage: 1,
      pageSize: 20,
      listLoading: false,
      sels: [], //列表选中列

      // editFormVisible: false, //编辑界面是否显示
      // editLoading: false,
      // editFormRules: {
      //   title: { required: true, message: "请输入标题", trigger: "blur" },
      //   imageurl: { required: true, message: "请输入图片地址", trigger: "blur" },
      // },
      // //编辑界面数据
      // editForm: {
      //   aid:'',
      //   title:'',
      //   imageurl:''
      // },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        purl: { required: true, message: "请输入图片地址", trigger: "blur" },
        pname: { required: true, message: "请输入图片标题", trigger: "blur" }
      },
      //新增界面数据
      addForm: {
        pname:'',
        purl:''
      }
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.currPage = val;
      this.getPicture();
    },
    //获取列表
    getPicture() {
      // let para = {
      //   currPage: this.currPage,
      //   pageSize: this.pageSize
      // };
      this.listLoading = true;
      //NProgress.start();
      getPicture().then(res => {
        console.log("getPicture ==>", res);
        // this.total = res.data.data.total;
        this.picture = res.data.data;
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
          let para = { pid: row.pid };
          deletePicture(para).then(res => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getPicture();
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
        purl:'',
        pname:''
      };
    },
    // //编辑
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
    //           this.getPicture();
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
            insertPicture(para).then(res => {
              this.addLoading = false;
              //NProgress.done();
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getPicture();
            });
          });
        }
      });
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
  },
  mounted() {
    this.getPicture();
  }
};
</script>

<style scoped>
</style>