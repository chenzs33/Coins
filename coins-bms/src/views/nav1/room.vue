<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<!-- <el-form-item>
					<el-input v-model="filters.roomintroduce" placeholder="房间名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getAllRooms">查询</el-button>
				</el-form-item> -->
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="rooms" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="roomintroduce" label="房间名称" width="150" sortable>
			</el-table-column>
			<!-- <el-table-column prop="roomnumber" label="房间总数" width="120" sortable>
			</el-table-column> -->
			<!-- <el-table-column prop="roomimage" label="图片地址" min-width="100" sortable>
			</el-table-column> -->
			<el-table-column prop="roomarea" label="房间面积(m²)" width="150" sortable>
			</el-table-column>
			<el-table-column prop="roomwifi" label="wifi" width="100" sortable>
			</el-table-column>
			<el-table-column prop="roombed" label="床大小(m)" width="150"  sortable>
			</el-table-column>
			<el-table-column prop="roombreakfast" label="早餐" width="100" sortable>
			</el-table-column>
			<el-table-column prop="roomnum" label="可住人数" width="150" sortable>
			</el-table-column>
			<el-table-column prop="roomnumber" label="剩余数量" width="150" sortable>
			</el-table-column>
			<el-table-column prop="roomprice" label="价格" width="120" sortable>
			</el-table-column>
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
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="房间名称" prop="roomintroduce">
					<el-input v-model="editForm.roomintroduce" auto-complete="off" disabled="disabled"></el-input>
				</el-form-item>
				<!-- <el-form-item label="房间总数" prop="roomnumber">
					<el-input-number v-model="editForm.roomnumber" :min="1" :max="200"></el-input-number>
				</el-form-item> -->
				<el-form-item label="图片地址" prop="roomimage">
					<el-input type="textarea" v-model="editForm.roomimage"></el-input>
				</el-form-item>
				<el-form-item label="房间面积(m²)" prop="roomarea">
					<el-input v-model="editForm.roomarea" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="wifi" prop="roomwifi">
					<el-radio-group v-model="editForm.roomwifi">
						<el-radio class="radio" :label="1">有</el-radio>
						<el-radio class="radio" :label="0">无</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="床大小(m)" prop="roombed">
					<el-input v-model="editForm.roombed" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="早餐" prop="roombreakfast">
					<el-radio-group v-model="editForm.roombreakfast">
						<el-radio class="radio" :label="1">有</el-radio>
						<el-radio class="radio" :label="0">无</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="可住人数" prop="roomnum">
					<el-input-number v-model="editForm.roomnum" :min="1" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="剩余数量" prop="roomnumber">
					<el-input-number v-model="editForm.roomnumber" :min="1" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="价格" prop="roomprice">
					<el-input v-model="editForm.roomprice" auto-complete="off"></el-input>
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
				<el-form-item label="房间名称" prop="roomintroduce">
					<el-input v-model="addForm.roomintroduce" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="房间总数" prop="roomnumber">
					<el-input-number v-model="addForm.roomnumber" :min="1" :max="10000"></el-input-number>
				</el-form-item>
				<el-form-item label="图片地址" prop="roomimage">
					<el-input type="textarea" v-model="addForm.roomimage"></el-input>
				</el-form-item>
				<el-form-item label="房间面积(m²)" prop="roomarea">
					<el-input v-model="addForm.roomarea" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="wifi" prop="roomwifi">
					<el-radio-group v-model="addForm.roomwifi">
						<el-radio class="radio" :label="1">有</el-radio>
						<el-radio class="radio" :label="0">无</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="床大小(m)" prop="roombed">
					<el-input v-model="addForm.roombed" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="早餐" prop="roombreakfast">
					<el-radio-group v-model="addForm.roombreakfast">
						<el-radio class="radio" :label="1">有</el-radio>
						<el-radio class="radio" :label="0">无</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="可住人数" prop="roomnum">
					<el-input-number v-model="addForm.roomnum" :min="1" :max="20"></el-input-number>
				</el-form-item>
				<el-form-item label="剩余数量" prop="roomnumber">
					<el-input-number v-model="addForm.roomnumber" :min="1" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="价格" prop="roomprice">
					<el-input v-model="addForm.roomprice" auto-complete="off"></el-input>
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
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getAllRoom, addRoom, updateRoom, deleteRoom } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				rooms: [],
				total: 0,
				currPage: 1,
				pageSize: 20,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					roomintroduce: { required: true, message: '请输入房间名称', trigger: 'blur' },
					// roomnumber: { required: true, message: '请输入房间总数', },
					roomimage: { required: true, message: '请输入图片地址', trigger: 'blur' },
					roomarea: { required: true, message: '请输入房间面积', trigger: 'blur' },
					roomwifi: { required: true, message: '请选择是否有wifi'},
					roombed: { required: true, message: '请输入床大小' },
					roombreakfast: { required: true, message: '请选择是否有早餐'},
					roomnum: { required: true, message: '请输入可住人数' },
					roomnumber: { required: true, message: '请输入剩余房间数' },
					roomprice: { required: true, message: '请输入房间价格' },
				},
				//编辑界面数据
				editForm: {
					roomintroduce:'',
					// roomnumber: '',
					roomimage:'',
					roomarea:'',
					roomwifi:'',
					roombed:'',
					roombreakfast:'',
					roomnum:'',
					roomnumber:'',
					roomprice:''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					roomintroduce: { required: true, message: '请输入房间名称', trigger: 'blur' },
					roomnumber: { required: true, message: '请输入房间总数',  },
					roomimage: { required: true, message: '请输入图片地址', trigger: 'blur' },
					roomarea: { required: true, message: '请输入房间面积', trigger: 'blur' },
					roomwifi: { required: true, message: '请选择是否有wifi' },
					roombed: { required: true, message: '请输入床大小' },
					roombreakfast: { required: true, message: '请选择是否有早餐' },
					roomnum: { required: true, message: '请输入可住人数' },
					roomnumber: { required: true, message: '请输入剩余房间数' },
					roomprice: { required: true, message: '请输入房间价格'},
				},
				//新增界面数据
				addForm: {
					roomintroduce:'',
					// roomnumber: '',
					roomimage:'',
					roomarea:'',
					roomwifi:1,
					roombed:'',
					roombreakfast:1,
					roomnum:'',
					roomnumber:'',
					roomprice:''
				}

			}
		},
		methods: {
			formatWifi: function (row, column) {
				return row.roomwifi == 1 ? '有' : '无';
			},
			formatBreakfast: function (row, column) {
				return row.roombreakfast == 1 ? '有' : '无';
			},
			handleCurrentChange(val) {
				this.currPage = val;
				this.getAllRooms();
			},
			//获取用户列表
			getAllRooms() {
				let para = {				
					currPage: this.currPage,
					pageSize: this.pageSize,
				}

				this.listLoading = true;
				//NProgress.start();
				getAllRoom(para).then((res) => {
					this.total = res.data.data.total;
					this.rooms = res.data.data.data;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { roomintroduce: row.roomintroduce };
					deleteRoom(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getAllRooms();
					});
				}).catch(() => {

				});
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
					roomintroduce:'',
					roomnumber: '',
					roomimage:'',
					roomarea:'',
					roomwifi:1,
					roombed:'',
					roombreakfast:1,
					roomnum:'',
					roomnumber:'',
					roomprice:''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.roomwifi = (para.roomwifi==1?'有':'无')
							para.roombreakfast = (para.roombreakfast==1?'有':'无')
							updateRoom(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getAllRooms();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.roomwifi = (para.roomwifi==1?'有':'无')
							para.roombreakfast = (para.roombreakfast==1?'有':'无')
							para.roomprice = parseFloat(para.roomprice)
							para.roomnum = String(para.roomnum)
							
							addRoom(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getAllRooms();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
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
			// 			this.getAllRooms();
			// 		});
			// 	}).catch(() => {

			// 	});
			// }
		},
		mounted() {
			this.getAllRooms();
		}
	}

</script>

<style scoped>

</style>