<template>
  <div class="padding20">
    <!-- <el-table :data="menuList" border style="width: 100%" align="center">
      <el-table-column prop="date" label="icon" width="50" align="center">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="名称" width="600">
        <template slot-scope="scope">
          <span v-html="scope.row.sql + scope.row.title"></span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="类型" width="100">
        <template slot-scope="scope">
          <el-tag>
            <span>{{['', '菜单', '按钮', '功能'][scope.row.type] || '顶级'}}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="url">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status ? 'success' : 'warning'">
            {{ scope.row.status ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="openMenuDialog(scope.row)" type="primary" size="small">添加下级</el-button>
          <el-button @click="openMenuDialog(scope.row, 'update')" type="info" size="small">编辑</el-button>
          <el-button type="warning" size="small">禁用</el-button>
          <el-button @click="delResources(scope.row.id)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table> -->
    <tree-table :data="menuList" border :expandAll="true">
      <el-table-column prop="date" label="icon" width="50" align="center">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="名称" width="600">
        <template slot-scope="scope">
          <span v-html="scope.row.sql + scope.row.title"></span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="类型" width="100">
        <template slot-scope="scope">
          <el-tag>
            <span>{{['', '菜单', '按钮', '功能'][scope.row.type] || '顶级'}}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="url">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status ? 'success' : 'warning'">
            {{ scope.row.status ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-has="[$root.auth.menu.addSub]" @click="openMenuDialog(scope.row)" type="primary" size="small">添加下级</el-button>
          <el-button v-has="[$root.auth.menu.update]" @click="openMenuDialog(scope.row, 'update')" type="info" size="small">编辑</el-button>
          <el-button v-has="[$root.auth.menu.disable]" type="warning" size="small">禁用</el-button>
          <el-button v-has="[$root.auth.menu.delete]" @click="delResources(scope.row.id)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </tree-table>

    <el-dialog title="提示" :visible.sync="operatorMneuDialog" :before-close="handleClose" width="50%">
      <el-dialog width="50%" title="选择图标" :visible.sync="iconDialog" append-to-body @open="iconDialogOpen">
        <iframe ref="iconIframe" src="/static/icon.html" frameborder="0" style="width: 100%;height: 500px;"></iframe>
        <div slot="footer" class="dialog-footer">
          <el-button @click="iconDialog = false">取 消</el-button>
          <el-button type="primary" @click="getIcon">确定</el-button>
        </div>
      </el-dialog>
      <el-form :model="menuForm" :rules="menuFormRules" ref="menuForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="上级菜单">
          <el-select v-model="menuForm.pid" :disabled="!menuForm.update" placeholder="请选择" :value="menuForm.parentMenu" @click="parantIdchange">
            <el-option v-for="item in menuSelectData" :key="item.value" :label="item.title" v-html="item.sql + item.title" :value="item.id">
            </el-option>
          </el-select>
          <p class="form-tip">必填，请选择上级菜单或顶级菜单（目前最多支持三级菜单）</p>
        </el-form-item>
        <el-form-item label="菜单名称" prop="region">
          <el-input v-model="menuForm.title" placeholder="请输入菜单名称"></el-input>
          <p class="form-tip">必填，请填写菜单名称（如：系统管理），建议字符不要太长，一般4-6个汉字</p>
        </el-form-item>
        <el-form-item label="菜单链接" prop="region">
          <el-input v-model="menuForm.url" placeholder="请输入URL"></el-input>
          <p class="form-tip">
            必填，请填写系统节点（如：admin/user/index），节点加入权限管理时菜单才会自动隐藏，非规则内的不会隐藏； 正常情况下，在输入的时候会有自动提示。如果是上级菜单时，请填写"#"符号，不要填写地址或节点地址
          </p>
        </el-form-item>
        <el-form-item label="类型" prop="resource">
          <el-radio-group v-model="menuForm.type">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
            <el-radio :label="3">功能</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单图标" prop="region">
          <div>
            <el-input v-model="menuForm.icon" placeholder="请输入或选择图标" style="width: 200px;"></el-input>
            <span style="display: inline-block; border-radius: 5px; border: 1px solid #c0c4cc;width: 40px;height: 40px; text-align: center;vertical-align: bottom;">
              <i :class="menuForm.icon"></i>
            </span>
            <el-button @click="iconDialog=true">选择图标</el-button>
          </div>
          <p class="form-tip">
            必填，请填写系统节点（如：admin/user/index），节点加入权限管理时菜单才会自动隐藏，非规则内的不会隐藏； 正常情况下，在输入的时候会有自动提示。如果是上级菜单时，请填写"#"符号，不要填写地址或节点地址
          </p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitMenuForm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog>

    </el-dialog>
  </div>
</template>

<script>
  import * as systemAPi from '@/api/system';
  import treeTable from '@/components/TreeTable';
  function arr_to_tree(data, pid) {
    const result = [];
    let temp;
    var length = data.length;
    for (var i = 0; i < length; i++) {
      if (data[i].pid === pid) {
        data[i].label = data[i].title;
        result.push(data[i]);
        temp = arr_to_tree(data, data[i].id);
        if (temp.length > 0) {
          data[i].children = temp;
          data[i].chnum = data[i].children.length;
        }
      }
    }
    return result;
  }
  export default {
    name: 'systemMenu',
    components: { treeTable },
    data() {
      return {
        menuFormRules: {},
        // 添加菜单的表单数据
        menuForm: {},
        iconDialog: false,
        operatorMneuDialog: false,
        menuList: [],
        menuSelectData: [],
        columns: [
          {
            text: 'icon',
            value: 'icon',
            width: 50
          },
          {
            text: '名称',
            value: 'title'
          },
          {
            text: '类型',
            value: 'type'
          },
          {
            text: 'url',
            value: 'url'
          }
        ]
      };
    },
    created() {
      this.loadMenuList();
    },
    methods: {
      loadMenuList() {
        systemAPi.getAllMenu.r()
          .then(res => {
            this.menuList = arr_to_tree(res.data, 0);
          });
      },
      openMenuDialog(row, type) {
        if (type === 'update') {
          this.menuForm = {
            id: row.id,
            type: row.type,
            pid: row.pid,
            title: row.title,
            icon: row.icon,
            url: row.url,
            update: true
          };
        } else {
          this.menuForm = {
            id: '',
            type: '',
            pid: row.id,
            title: '',
            icon: '',
            url: '',
            update: false
          };
        }
        this.menuDialogOpen(row.id || '');
        this.operatorMneuDialog = true;
      },
      iconDialogOpen() {
        this.$nextTick(res => {
          console.log(this.$refs['iconIframe'].contentWindow.vmObj = this);
        });
      },
      // 打开表单dialog的处理
      menuDialogOpen(pid) {
        systemAPi.getSelectData.r()
          .then(res => {
            this.menuSelectData = res.data;
          });
      },
      handleClose() {
        this.operatorMneuDialog = false;
      },
      getIcon() {
      },
      submitMenuForm() {
        systemAPi.addMenu.r(this.menuForm)
          .then(res => {
            this.operatorMneuDialog = false;
            this.loadMenuList();
            this.toast(this.menuForm.update ? '修改成功' : '添加成功');
          });
      },
      parantIdchange() {
      },
      delResources(id) {
        systemAPi.delResources.r({ id })
          .then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.loadMenuList();
          })
          .catch(err => {
            this.$message({
              message: err,
              type: 'error'
            });
          });
      }
    }
  };
</script>

<style>
.padding20 {
  padding: 20px;
}
.form-tip {
  margin: 0;
  color: #999 !important;
  line-height: 20px;
}
</style>

