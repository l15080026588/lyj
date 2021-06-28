<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-tickets"></i></el-breadcrumb-item>数据字典维护
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form :model="selectForm"  ref="selectForm">
                    <el-input v-model="selectForm.selectKeyWord" placeholder="请输入code或者name" class="handle-input"></el-input>
                    <el-button type="primary" icon="search" @click="search(selectForm)">查询</el-button>
                    <el-button type="primary" icon="search" @click="addUser()" >创建数据字典</el-button>


                </el-form>
            </div>
        <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChanges">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="code" label="关键字" sortable width="120">
                </el-table-column>
                <el-table-column prop="name" label="名称" sortable width="120">
                </el-table-column>
                <el-table-column prop="descript" label="描述" sortable width="120">
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
            <el-button type="primary" icon="search" @click="searchs()">查询</el-button>
            <el-button type="primary" icon="search" @click="addUsers()" >创建数据项</el-button>
            <el-form ref="form" :rules="rules" :model="form" label-width="70px">
                <el-form-item prop="code" label="关键字">
                    <el-input type="course" v-model="form.code"></el-input>
                </el-form-item>

                <el-form-item  label="名称" >
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.descript"></el-input>
                </el-form-item>
            </el-form>
            
            <el-table :data="DictData"  ref="dragTable" row-key="value" border stripe highlight-current-row>
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="dict_id" label="序号" sortable width="70">
                </el-table-column>
                <el-table-column prop="value" label="值" sortable width="70">
                </el-table-column>
                <el-table-column prop="text" label="文本" sortable width="70">
                </el-table-column>
                <el-table-column prop="is_default" label="默认值" sortable width="100">
                </el-table-column>
                <el-table-column label="操作" width="250">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdits(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDeletes(scope.$index, scope.row)">删除</el-button>
                        <el-button size="small" style="padding:0" :disabled="scope.$index == 0" @click="moveUpward(scope.row, scope.$index)">上移</el-button>
                        <el-button size="small" style="padding:0" :disabled="(scope.$index + 1) == DictData.length" @click="moveDown(scope.row, scope.$index)">下移</el-button>
                    </template>
                </el-table-column>
                
            </el-table>
        <div class="pagination">
                <el-pagination @current-change="handleCurrentChanges" layout="prev, pager, next" :total="1000">
                </el-pagination>
            </div>
            <span slot="footer" class="dialog-footer">
                 <el-button @click="editVisible = false">取 消</el-button>
                 <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑二级弹出框 -->
        <el-dialog :title="this.isAdds?'新增':'编辑'" :visible.sync="editVisibles" width="60%">
            <el-form ref="forms" :rules="ruleForm" :model="forms" label-width="70px">
                <el-form-item label="序号">
                    <el-input v-model="forms.dict_id"></el-input>
                </el-form-item>
                <el-form-item prop="value" label="值">
                    <el-input type="course" v-model="forms.value"></el-input>
                </el-form-item>
                <el-form-item label="文本">
                    <el-input v-model="forms.text"></el-input>
                </el-form-item>
                <el-form-item label="是否默认">
                    <el-input v-model="forms.is_default"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                 <el-button @click="editVisibles = false">取 消</el-button>
                 <el-button type="primary" @click="saveEdits">确 定</el-button>
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
        <!-- 二级删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisibles" width="400px">
            <div class="del-dialog-cnt">是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="delVisibles = false">取 消</el-button>
        <el-button type="primary" @click="deleteRows">确 定</el-button>
      </span>
        </el-dialog>


    </div>
</template>

<script>
import Sortable from "sortablejs";
    export default {
        name: "DragTable",
        data() {
            var checkvalue = (rule, value, callback) => {
                const self = this;
                self.$http({
                    method:'get',
                    url:'/api/user/sys_dict_detail_select_code',
                    params:{
                        key:self.form.code
                    }
                    }).then((response) =>{
                        for(let i in response.body){
                            if(response.data[i].value==value)
                            {
                                return callback(new Error('数值重复'));
                            }
                    }
                        callback();
                    });      
            };
            return {
                sortable: null /* 表单拖拽 */ ,
                
                tableData: [{
                    code:"",
                    name:"",
                    descript:""
                },{
                    code:"",
                    name:"",
                    descript:""
                },{
                    code:"",
                    name:"",
                    descript:""
                },{
                    code:"",
                    name:"",
                    descript:""
                },{
                    code:"",
                    name:"",
                    descript:""
                },{
                    code:"",
                    name:"",
                    descript:""
                },{
                    code:"",
                    name:"",
                    descript:""
                },{
                    code:"",
                    name:"",
                    descript:""
                },{
                    code:"",
                    name:"",
                    descript:""
                },{
                    code:"",
                    name:"",
                    descript:""
                }],
                DictData: [{
                    dict_id:"",
                    dict_code:"",
                    text:"",
                    value:"",
                    is_default:""
                },{
                    dict_id:"",
                    dict_code:"",
                    text:"",
                    value:"",
                    is_default:""
                },{
                    dict_id:"",
                    dict_code:"",
                    text:"",
                    value:"",
                    is_default:""
                },{
                    dict_id:"",
                    dict_code:"",
                    text:"",
                    value:"",
                    is_default:""
                },{
                    dict_id:"",
                    dict_code:"",
                    text:"",
                    value:"",
                    is_default:""
                },{
                    dict_id:"",
                    dict_code:"",
                    text:"",
                    value:"",
                    is_default:""
                },{
                    dict_id:"",
                    dict_code:"",
                    text:"",
                    value:"",
                    is_default:""
                },{
                    dict_id:"",
                    dict_code:"",
                    text:"",
                    value:"",
                    is_default:""
                }],
                rules:{
                    code:[
                        { required: true, message: '请输入关键字', trigger: 'blur' }
                    ]
                },
                ruleForm:{
                    value:[
                        { validator: checkvalue,required:true,trigger:'blur'}
                    ]
                },
                curPage: 1,
                multipleSelection: [],
                curPages: 1,
                multipleSelections: [],
                selectForm:{
                    selectKeyWord:""
                },
                delList: [],
                isSearch: false,
                isAdd:false,
                editVisible: false,
                delVisible: false,
                
                delLists: [],
                isAdds:false,
                editVisibles: false,
                delVisibles: false,
                form: {
                    code:"",
                    name:"",
                    descript:""
                },
                forms: {
                    dict_id:"",
                    dict_code:"",
                    text:"",
                    value:"",
                    is_default:""
                },
                rowId: -1,
                rowIds: -1,
                formsvalue:0,
                formsid:1
            };
        },
mounted(){
  this.setSort();
},
        created() {
            this.getData();
            this.clear();
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
        methods: {
/**
 * 排序方法
 */
setSort(){
  const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
  this.sortable = Sortable.create(el,{
    ghostClass:'sortable-ghost',
    setData:function(dataTransfer){
      dataTransfer.setData('Text', '')
    },
    onEnd: evt => {
      const targetRow = this.DictData.splice(evt.oldIndex, 1)[0];
      this.DictData.splice(evt.newIndex, 0, targetRow);
    }
  })
},
	 moveUpward(row, index) {
            if (index > 0) {
                let upData = this.DictData[index - 1];
                this.DictData.splice(index - 1, 1);
                this.DictData.splice(index, 0, upData);
            } else {
                this.$message({
                    message: '已经是第一条，上移失败',
                    type: 'warning'
                });
            }
            
        },
        moveDown(row, index) {
            if ((index + 1) == this.DictData.length) {
                this.$message({
                    message: '已经是最后一条，下移失败',
                    type: 'warning'
                });
            } else {
                let downData = this.DictData[index + 1];
                this.DictData.splice(index + 1, 1);
                this.DictData.splice(index, 0, downData);
            }
        },




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
                if(this.selectForm.selectKeyWord == "")
                {
                    self.$http({
                    method:'get',
                    url:'/api/user/sys_dict_get_all',
                    params:{
                        data:self.selectForm.selectKeyWord
                    }
                }).then((response) =>{
                    for(let i in response.body){
                        this.tableData[i].code=response.data[i].code;
                        this.tableData[i].name=response.data[i].name;
                        this.tableData[i].descript=response.data[i].descript;
                    }
                });
                }
                else{
                    self.$http({
                    method:'get',
                    url:'/api/user/sys_dict_select_code',
                    params:{
                        key:self.selectForm.selectKeyWord
                    }
                }).then((response) =>{
                    for(let i in response.body){
                        this.tableData[i].code=response.data[i].code;
                        this.tableData[i].name=response.data[i].name;
                        this.tableData[i].descript=response.data[i].descript;
                    }
                });
                }
            },
            searchs() {
                this.isSearch = true;
                const self = this;
                    self.$http({
                    method:'get',
                    url:'/api/user/sys_dict_detail_select_code',
                    params:{
                        key:self.form.code
                    }
                }).then((response) =>{
                    for(let i in response.body){
                        this.DictData[i].dict_id=response.data[i].dict_id;
                        this.DictData[i].text=response.data[i].text;
                        this.DictData[i].value=response.data[i].value;
                        this.DictData[i].is_default=response.data[i].is_default;
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
                    code: item.code,
                    name: item.name,
                    descript: item.descript  
                };
                this.editVisible = true;


            },
            handleEdits(index, row) {
                this.rowIds = index;
                this.isAdds = 0;
                const item = this.DictData[index];
                this.forms = {
                    dict_id: item.dict_id, 
                    dict_code: item.dict_code,
                    text: item.text,
                    value: item.value,
                    is_default: item.is_default  
                };
                this.editVisibles = true;

            },
            handleDelete(index, row) {
                this.rowId = index;
                const item = this.tableData[index];
                this.form = {
                    code: item.code,
                    name: item.name,
                    descript: item.descript  
                };
                this.delVisible = true;
            },
            handleDeletes(index, row) {
                this.rowIds = index;
                const item = this.DictData[index];
                this.form = {
                    dict_code: item.dict_code,
                    text: item.text,
                    value: item.value,
                    is_default: item.is_default  
                };
                this.delVisibles = true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleSelectionChanges(val) {
                this.multipleSelections = val;
            },
            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.rowId, this.form);
                this.editVisible = false;
                
                if(!this.isAdd){
                    this.$http({
                        method:'get',
                        url:'/api/user/sys_dict_update',
                        params:{
                            code:this.form.code,
                            name:this.form.name,
                            descript:this.form.descript
                        }
                    }).then((response) =>{
                    });
                    this.$message.success(`修改第 ${this.rowId + 1} 行成功`);
                }else{
                    this.$http({
                        method:'get',
                        url:'/api/user/sys_dict_inster',
                        params:{
                            code:this.form.code,
                            name:this.form.name,
                            descript:this.form.descript
                        }
                    }).then((response) =>{
                         if(response.data == 201)
                          this.$message.success('数据添加成功');
                    });

                }
            },

            saveEdits() {
                this.$set(this.DictData, this.rowIds, this.forms);
                this.editVisibles = false;
                if(!this.isAdds){
                    this.$http({
                        method:'get',
                        url:'/api/user/sys_dict_detail_update',
                        params:{
                            dict_code:this.form.code,
                            dict_id:this.forms.dict_id,
                            text:this.forms.text,
                            value:this.forms.value,
                            is_default:this.forms.is_default
                        }
                    }).then((response) =>{
                    });
                    this.$message.success(`修改第 ${this.rowIds + 1} 行成功`);
                
                if(this.forms.is_default=="1")
                {
                    const self = this;
                    self.$http({
                    method:'get',
                    url:'/api/user/sys_dict_detail_select_code',
                    params:{
                        key:self.form.code
                    }
                }).then((response) =>{
                    for(let i in response.body){
                        if(this.DictData[i].is_default=="1"&&this.DictData[i].dict_id!=this.forms.dict_id)
                            this.$http({
                            method:'get',
                            url:'/api/user/sys_dict_detail_update',
                            params:{
                                dict_code:this.form.code,
                                dict_id:this.DictData[i].dict_id,
                                text:this.DictData[i].text,
                                value:this.DictData[i].value,
                                is_default:0
                            }
                            }).then((response) =>{
                            });
                            }
                });
                }    
                }
                else{
                    this.$http({
                        method:'get',
                        url:'/api/user/sys_dict_detail_inster',
                        params:{
                            dict_code:this.form.code,
                            dict_id:this.forms.dict_id,
                            text:this.forms.text,
                            value:this.forms.value,
                            is_default:this.forms.is_default,
                        }
                    }).then((response) =>{
                         if(response.data == 201)
                          this.$message.success('数据添加成功');
                    });
                    this.formsid++;
                    this.formsvalue++;
                }
            },

            // 确定删除
            deleteRow() {
                this.$set(this.tableData, this.rowId, this.form);
                this.delVisible = false;
                this.tableData.splice(this.rowId, 1);
                    this.$http({
                        method:'get',
                        url:'/api/user/sys_dict_delete', 
                        params:{
                            code:this.form.code,
                        }
                    }).then((response) =>{
                    });
                    this.$message.success(`删除第 ${this.rowId + 1} 行成功`);
            },

            deleteRows() {
                this.$set(this.DictData, this.rowIds, this.forms);
                this.delVisibles = false;
                this.DictData.splice(this.rowIds, 1);
                    this.$http({
                        method:'get',
                        url:'/api/user/sys_dict_detail_delete', 
                        params:{
                            dict_id:this.forms.dict_id,
                        }
                    }).then((response) =>{
                    });
                    this.$message.success(`删除第 ${this.rowIds + 1} 行成功`);
            },


            addUser(){
                this.isAdd=true;
                this.editVisible = true;
                this.tableData.shift({
                    code:this.form.number,
                    name:this.form.name,
                    descript:this.form.identity,
                });

            },
            addUsers(){
                this.isAdds=true;
                this.editVisibles = true;
                this.forms.is_default=0;
                this.forms.dict_id=this.formsid;
                this.forms.value=this.formsvalue;
                this.DictData.shift({
                    dict_id:this.forms.ditct_id,
                    dict_code:this.forms.dict_code,
                    text:this.forms.text,
                    value:this.forms.value,
                    is_default:this.forms.is_default,
                });

            }
        }
    };
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
