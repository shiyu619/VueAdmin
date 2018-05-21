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
        <el-table-column label="id" width="76">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column prop="pai" label="排序" width="60">
          <template slot-scope="scope">
            <el-input size="mini" placeholder="" v-model="scope.row.id">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="nickName" label="名称">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column prop="nickName" label="描述">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{ scope.row.status===1 ? '已激活' : '未激活' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="325">
          <template slot-scope="scope">
            <el-button size="small" type="default" icon="edit" @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="small" type="info" icon="setting" @click="handleRoleConfig(scope.$index, scope.row)">授权
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">禁用
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
            <el-form-item label="角色名">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="form.loginName"></el-input>
            </el-form-item>
            <el-form-item label="排序">
              <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">保存</el-button>
              <el-button @click="handleClose">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>

      <el-dialog title="配置用户角色" :visible="dialogResources" size="tiny" :before-close="handleCloseResources">
        <el-tree :data="resources" show-checkbox default-expand-all node-key="id" ref="roleTree">
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCloseResources">取 消</el-button>
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
  const resources = [{
    id: 1,
    label: '一级 1',
    children: [{
      id: 4,
      label: '二级 1-1',
      children: [{
        id: 9,
        label: '三级 1-1-1'
      }, {
        id: 10,
        label: '三级 1-1-2'
      }]
    }]
  }, {
    id: 2,
    label: '一级 2',
    children: [{
      id: 5,
      label: '二级 2-1'
    }, {
      id: 6,
      label: '二级 2-2'
    }]
  }, {
    id: 3,
    label: '一级 3',
    children: [{
      id: 7,
      label: '二级 3-1'
    }, {
      id: 8,
      label: '二级 3-2',
      children: [{
        id: 11,
        label: '三级 3-2-1'
      }, {
        id: 12,
        label: '三级 3-2-2'
      }, {
        id: 13,
        label: '三级 3-2-3'
      }]
    }]
  }];
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
        resources: resources,
        userForm: false, // 用户新增和修改的弹窗
        userInfo: {},
        currentRow: {},
        dialogResources: false,
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
        this.dialogResources = true;
      },
      configUserRoles() {
        const checkedKeys = this.$refs.roleTree.getCheckedKeys();
        const nodesDOM = this.$refs.roleTree.$el.querySelectorAll('.el-tree-node');
        const nodesVue = [].map.call(nodesDOM, node => node.__vue__);
        nodesVue.filter(item => item.indeterminate === true).map(item => {
          checkedKeys.push(item.node.data.id);
        });
        console.info([...new Set(checkedKeys)]);
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
        this.userForm = true;
        this.form = row;
      },
      handleDelete(index, row) {
        this.$http.get(api.SYS_USER_DELETE + '?userIds=' + row.id).then(res => {
          this.loadData();
        });
      },
      loadData() {
        this.listLoading = true;
        sysApi.getRoleList.r({
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
      },
      handleCloseResources() {
        this.dialogResources = false;
      }
    },
    created() {
      this.loadData();
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
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
.el-tree-node .el-tree-node .el-tree-node {
  display: inline-block;
  .el-tree-node__content:hover {
    background-color: transparent;
  }
}
.el-dialog__footer {
  padding-bottom: 10px;
  padding-top: 10px;
  margin: 20px;
}
</style>
