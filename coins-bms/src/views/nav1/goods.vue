<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <!-- <el-form-item>
          <el-input v-model="filters.name" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getGoods">查询</el-button>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="goods"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="title" label="商品名称" width="200" sortable></el-table-column>
      <!-- <el-table-column prop="imgUrl" label="商品图片地址" min-width="200" sortable></el-table-column> -->
      <el-table-column prop="condition" label="兑换所需积分" width="180" sortable></el-table-column>
      <el-table-column prop="num" label="剩余数量" width="180" sortable></el-table-column>
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
        <el-form-item label="商品名称" prop="title">
          <el-input v-model="editForm.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品图片地址" prop="imgUrl">
          <el-input type="textarea" v-model="editForm.imgUrl"></el-input>
        </el-form-item>
        <el-form-item label="兑换所需积分" prop="condition">
          <el-input-number v-model="editForm.condition" :min="1" :max="10000000"></el-input-number>
        </el-form-item>
        <el-form-item label="剩余数量" prop="num">
          <el-input-number v-model="editForm.num" :min="0" :max="1000000"></el-input-number>
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
        <el-form-item label="商品名称" prop="title">
          <el-input v-model="addForm.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品图片地址" prop="imgUrl">
          <el-input type="textarea" v-model="addForm.imgUrl"></el-input>
        </el-form-item>
        <el-form-item label="兑换所需积分" prop="condition">
          <el-input-number v-model="addForm.condition" :min="1" :max="10000000"></el-input-number>
        </el-form-item>
        <el-form-item label="剩余数量" prop="num">
          <el-input-number v-model="addForm.num" :min="0" :max="1000000"></el-input-number>
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
import { getGoods, addGoods, editGoods, deleteGoods } from "../../api/api";

export default {
  data() {
    return {
      filters: {
        name: ""
      },
      goods: [
        {
          title: "",
          imgUrl: "",
          condition: "",
          num: ""
        }
      ],
      total: 0,
      currPage: 1,
      pageSize: 20,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        title: { required: true, message: "请输入商品名称", trigger: "blur" },
        imgUrl: {
          required: true,
          message: "请输入商品图片地址",
          trigger: "blur"
        },
        condition: { required: true, message: "兑换所需积分" },
        num: { required: true, message: "剩余数量" }
      },
      //编辑界面数据
      editForm: {
        title: "",
        imgUrl: "",
        condition: "",
        num: ""
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        title: { required: true, message: "请输入商品名称", trigger: "blur" },
        imgUrl: {
          required: true,
          message: "请输入商品图片地址",
          trigger: "blur"
        },
        condition: { required: true, message: "兑换所需积分" },
        num: { required: true, message: "剩余数量" }
      },
      //新增界面数据
      addForm: {
        title: "",
        imgUrl: "",
        condition: "",
        num: ""
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
      this.getGoods();
    },
    //获取商品列表
    getGoods() {
      let para = {
        currPage: this.currPage,
        pageSize: this.pageSize
      };
      // this.listLoading = true;
      //NProgress.start();
      getGoods(para).then(res => {
        this.total = res.data.count;
        this.goods = res.data.list;
        this.listLoading = false;
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
          let para = { _id: row._id };
          deleteGoods(para).then(res => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getGoods();
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
        title: "",
        imgUrl: "",
        condition: "",
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
              this.getGoods();
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
              this.getGoods();
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
    // 			this.getGoods();
    // 		});
    // 	}).catch(() => {

    // 	});
    // }
  },
  mounted() {
    this.getGoods();
  }
};
</script>

<style scoped>
</style>