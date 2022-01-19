<template>
  <el-form
    ref="form"
    :model="form"
    label-width="80px"
    @submit.prevent="onSubmit"
    style="margin:20px;width:60%;min-width:600px;"
  >
    <el-form-item label="酒店地址">
      <el-input v-model="form.address"></el-input>
    </el-form-item>
    <el-form-item label="酒店电话">
      <el-input v-model="form.phone"></el-input>
    </el-form-item>
    <el-form-item label="酒店简介">
      <el-input type="textarea" v-model="form.content"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="editCompany">确定修改</el-button>
      <!-- <el-button @click.native.prevent>取消</el-button> -->
      <el-button @click='getCompanys'>重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import util from "../../common/js/util";
//import NProgress from 'nprogress'
import {
  getCompany,
  editCompany
} from "../../api/api";

export default {
  data() {
    return {
      form: {
        cname:"1",
        address: "",
        phone: "",
        content: ""
      }
    };
  },
  methods: {
    //获取公司信息
    getCompanys() {
      this.listLoading = true;
      //NProgress.start();
      getCompany().then(res => {
        console.log("getCompany ==>", res);
        this.form = res.data.data;
        this.listLoading = false;
        //NProgress.done();
      });
    },

    editCompany(){
      // this.listLoading = true;

      this.$refs.form.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
              //NProgress.start();
              console.log('form==>',this.form)
              let para = Object.assign({}, this.form);
							editCompany(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['form'].resetFields();
                this.editFormVisible = false;
                // this.listLoading = false;
								this.getCompanys();
							});
						});
					}
				});
    },

    onSubmit() {
      console.log("submit!");
    }
  },

  mounted() {
    this.getCompanys();
  }
};
</script>