<template>
  <div class="user-management">
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%;">
        <el-col :span="12">
          <el-button type="primary" icon="plus" @click="addUserForm">新增</el-button>
        </el-col>
        <el-col :span="12">
          <div class="el-input" style="width: 200px; float: right;">
            <i class="el-input__icon el-icon-search"></i>
            <input type="text" placeholder="输入用户名称" v-model="searchKey" @keyup.enter="search($event)" class="el-input__inner">
          </div>
        </el-col>
      </el-row>
    </h3>
    <div slot="body">
      <el-table :data="tableData.rows" border style="width: 100%" v-loading="listLoading" @selection-change="handleSelectionChange">
        <!--checkbox 适当加宽，否则IE下面有省略号 https://github.com/ElemeFE/element/issues/1563-->
        <el-table-column prop="id" type="selection" width="50">
        </el-table-column>
        <el-table-column label="照片" width="76">
          <template slot-scope="scope">
            <img :src='scope.row.photo' style="height: 35px;vertical-align: middle;" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column prop="nickName" label="登录用户名">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{ scope.row.status===1 ? '已激活' : '未激活' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="285">
          <template slot-scope="scope">
            <el-button size="small" type="default" icon="edit" @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="small" type="info" icon="setting" @click="handleRoleConfig(scope.$index, scope.row)">配置角色
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableData.pagination.pageNo" :page-sizes="[5, 10, 20]" :page-size="tableData.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.pagination.total">
      </el-pagination>

      <el-dialog title="提示" :visible="userForm" width="30%" :before-close="handleClose">

        <div>
          <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="用户名">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="登录用户名">
              <el-input v-model="form.loginName"></el-input>
            </el-form-item>
            <el-form-item label="手机">
              <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item label="工号">
              <el-input v-model="form.companyId"></el-input>
            </el-form-item>
            <el-form-item label="固定电话">
              <el-input v-model="form.mobile"></el-input>
            </el-form-item>

            <el-form-item label="状态">
              <el-radio-group v-model="form.resource">
                <el-radio label="禁用"></el-radio>
                <el-radio label="激活"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="用户类型">
              <el-radio-group v-model="form.resource">
                <el-radio label="用户注册"></el-radio>
                <el-radio label="后台配置"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注">
              <el-input type="textarea" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">立即创建</el-button>
              <el-button @click="handleClose">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>

      <el-dialog title="配置用户角色" v-model="dialogVisible" size="tiny">
        <div class="select-tree">
          <el-scrollbar tag="div" class='is-empty' wrap-class="el-select-dropdown__wrap" view-class="el-select-dropdown__list">
            <el-tree ref="roleTree" :data="roleTree" show-checkbox check-strictly node-key="id" v-loading="dialogLoading" :props="defaultProps">
            </el-tree>
          </el-scrollbar>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="configUserRoles">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import panel from '../../components/panel.vue';
  import * as api from '../../api';
  import * as sysApi from '@/api/system';

  export default {
    components: {
      'imp-panel': panel,
      'userForm': import('./addUserForm')
    },
    data() {
      return {
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        userForm: false, // 用户新增和修改的弹窗
        userInfo: {},
        currentRow: {},
        dialogVisible: false,
        dialogLoading: false,
        defaultProps: {
          children: 'children',
          label: 'name',
          id: 'id'
        },
        roleTree: [],
        listLoading: false,
        searchKey: '',
        tableData: {
          pagination: {
            total: 0,
            pageNo: 1,
            pageSize: 10,
            parentId: 0
          },
          rows: []
        }
      };
    },
    methods: {
      search(target) {
        this.loadData();
      },
      handleSelectionChange(val) {

      },
      handleRoleConfig(index, row) {
        this.currentRow = row;
        this.dialogVisible = true;
        if (this.roleTree.length <= 0) {
          sysApi.roleList.r({ selectChildren: true })
            .then(res => {
              this.roleTree = res;
            });
        }
        this.$http.get(api.SYS_USER_ROLE + '?id=' + row.id)
          .then(res => {
            this.$refs.roleTree.setCheckedKeys(res.data);
          }).catch(err => {
            console.log(err);
          });
      },
      configUserRoles() {
        const checkedKeys = this.$refs.roleTree.getCheckedKeys();
        this.$http.get(api.SYS_SET_USER_ROLE + '?userId=' + this.currentRow.id + '&roleIds=' + checkedKeys.join(','))
          .then(res => {
            this.$message('修改成功');
            this.dialogVisible = false;
          });
      },
      handleSizeChange(val) {
        this.tableData.pagination.pageSize = val;
        this.loadData();
      },
      handleCurrentChange(val) {
        this.tableData.pagination.pageNo = val;
        this.loadData();
      },
      handleEdit(index, row) {
        this.$router.push({ path: 'userAdd', query: { id: row.id }});
      },
      handleDelete(index, row) {
        this.$http.get(api.SYS_USER_DELETE + '?userIds=' + row.id).then(res => {
          this.loadData();
        });
      },
      loadData() {
        this.listLoading = true;
        sysApi.userList.r({
          key: this.searchKey,
          pageSize: this.tableData.pagination.pageSize,
          pageNo: this.tableData.pagination.pageNo
        })
          .then(res => {
            this.tableData.rows = res.data.content;
            this.tableData.pagination.total = res.data.total;
            this.listLoading = false;
          })
          .catch(() => {
            this.listLoading = false;
          });
      },
      addUserForm() {
        this.userForm = true;
      },
      handleClose() {
        this.userForm = false;
      },
      onSubmit() {
        console.log('submit!');
      }
    },
    created() {
      this.loadData();
    }
  };
</script>
<style>
.user-management {
  margin: 20px;
}
.el-pagination {
  float: right;
  margin-top: 15px;
}
.el-input__icon {
  position: absolute;
  width: 35px;
  height: 100%;
  right: 0;
  top: 0;
  text-align: center;
  color: #bfcbd9;
  transition: all 0.3s;
}
</style>
