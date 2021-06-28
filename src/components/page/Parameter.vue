<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-tickets"></i>系统参数</el-breadcrumb-item>
            </el-breadcrumb>
            
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form :model="selectForm"  ref="selectForm">
                    <el-button type="primary" icon="search" @click="search(selectForm)">查询</el-button>
                    <el-button type="primary" icon="search" @click="addUser()" >新建系统参数</el-button>
                </el-form>
            </div>

            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="keyword" label="关键字" sortable width="120">
                </el-table-column>
                <el-table-column prop="name" label="名称" sortable width="120">
                </el-table-column>
                <el-table-column prop="value" label="值" sortable width="120">
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="this.isAdd?'新增':'编辑'" :visible.sync="editVisible" width="60%">
            <el-form ref="form" :rules="ruleForm" :model="form" label-width="70px">
                <el-form-item prop="keyword" label="关键字">
                    <el-input v-model="form.keyword"></el-input>
                </el-form-item>
                <el-form-item prop="name" label="名称" >
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item prop="value" label="值">
                    <el-input v-model="form.value"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                 <el-button @click="editVisible = false">取 消</el-button>
                 <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>


        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="400px">
            <div class="del-dialog-cnt">是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
 import draggable from 'vuedraggable' 
    export default {
        data() {
            var checkkeyword = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('关键字不能为空'));
        } else {
          const self = this;
          self.$http({
            method:'get',
            url:'/api/user/sys_par_get_all',
            params:{
                data:""
                }
            }).then((response) =>{
                for(let i in response.body){
                    if(response.data[i].keyword==value)
                    {
                        return callback(new Error('关键字重复'));
                    }
                }
                callback();
            });
        }
      };
            return {   
                tableData: [{
                    keyword:"",
                    name:"",
                    value:""
                },{
                    keyword:"",
                    name:"",
                    value:""
                },{
                    keyword:"",
                    name:"",
                    value:""
                },{
                    keyword:"",
                    name:"",
                    value:""
                },{
                    keyword:"",
                    name:"",
                    value:""
                },{
                    keyword:"",
                    name:"",
                    value:""
                },{
                    keyword:"",
                    name:"",
                    value:""
                },{
                    keyword:"",
                    name:"",
                    value:""
                },{
                    keyword:"",
                    name:"",
                    value:""
                },{
                    keyword:"",
                    name:"",
                    value:""
                }],
                ruleForm:{
                    name:[
                        { required: true, message: '名称不能为空', trigger: 'blur' }
                    ],
                    keyword:[
                        { validator: checkkeyword, required: true, trigger: 'blur' }
                    ],
                    value:[
                        { required: true, message: '值不能为空', trigger: 'blur' }
                    ]
                },
                curPage: 1,
                multipleSelection: [],
                selectForm:{
                    selectKeyWord:""
                },
                delList: [],
                isSearch: false,
                isAdd:false,
                editVisible: false,
                delVisible: false,
                
                form: {
                    keyword:"",
                    name:"",
                    value:""
                },
                rowId: -1
            };
        },

        created() {
            this.getData();
        },
        computed: {
            data() {
                return this.tableData.filter(d => {
                    let is_del = false;
                    for (let i = 0; i < this.delList.length; i++) {
                        if (d.name === this.delList[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (
                            d.address.indexOf(this.selectProvince) > -1 &&
                            (d.name.indexOf(this.selectKeyWord) > -1 ||
                                d.address.indexOf(this.selectKeyWord) > -1)
                        ) {
                            return d;
                        }
                    }
                });
                
            }
        },
    components: {
     draggable
  },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.curPage = val;
                this.getData();
            },
            handleCurrentChanges(val) {
                this.curPages = val;
                this.getData();
            },
            // 获取easy mock数据
            getData() {
                // this.$axios
                //     .get(this.url, {
                //         page: this.curPage
                //     })
                //     .then(res => {
                //         this.tableData = res.data.list;
                //     });
            },
            search(formName) {
                this.isSearch = true;
                const self = this;

                    self.$http({
                    method:'get',
                    url:'/api/user/sys_par_get_all',
                    params:{
                        data:""
                    }
                }).then((response) =>{
                    for(let i in response.body){
                        this.tableData[i].keyword=response.data[i].keyword;
                        this.tableData[i].name=response.data[i].name;
                        this.tableData[i].value=response.data[i].value;
                    }
                });
            },

            formatter(row, column) {
                return row.address;
            },
            handleEdit(index, row) {
                
                this.rowId = index;
                const item = this.tableData[index];
                this.form = {
                    keyword: item.keyword,
                    name: item.name,
                    value: item.value  
                };
                this.editVisible = true;


            },

            handleDelete(index, row) {
                this.rowId = index;
                const item = this.tableData[index];
                this.form = {
                    keyword: item.keyword,
                    name: item.name,
                    value: item.value  
                };
                this.delVisible = true;
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.rowId, this.form);
                this.editVisible = false;
                if(!this.isAdd){
                    this.$http({
                        method:'get',
                        url:'/api/user/sys_par_update',
                        params:{
                            keyword:this.form.keyword,
                            name:this.form.name,
                            value:this.form.value
                        }
                    }).then((response) =>{
                    });
                    this.$message.success(`修改第 ${this.rowId + 1} 行成功`);
                }else{
                    this.$http({
                        method:'get',
                        url:'/api/user/sys_par_inster',
                        params:{
                            keyword:this.form.keyword,
                            name:this.form.name,
                            value:this.form.value
                        }
                    }).then((response) =>{
                         if(response.data == 201)
                          this.$message.success('数据添加成功');
                    });

                }
            },

            

            // 确定删除
            deleteRow() {
                this.$set(this.tableData, this.rowId, this.form);
                this.delVisible = false;
                this.tableData.splice(this.rowId, 1);
                    this.$http({
                        method:'get',
                        url:'/api/user/sys_par_delete', 
                        params:{
                            keyword:this.form.keyword,
                        }
                    }).then((response) =>{
                    });
                    this.$message.success(`删除第 ${this.rowId + 1} 行成功`);
            },

            

            addUser(){
                this.isAdd=true;
                this.editVisible = true;
                this.tableData.shift({
                    keyword:this.form.keyword,
                    name:this.form.name,
                    value:this.form.value,
                });

            }
        }}
            
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt {
        font-size: 16px;
        text-align: center;
    }
    .delAll {
        margin: 20px 0;
        float: left;
    }
</style>
