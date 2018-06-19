<template>
  <div style="padding: 20px;">
    <el-row>
      <el-col>
        <el-form :inline="true">
          <el-form-item>
            <el-input placeholder="请输入用户名" v-model="params.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="loadList">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- taobe & Pagination -->
    <el-table-page url="/travel/system/api/getUserList" :params="params" border ref="tablePage" autoSearch>
      <el-table-column prop="id" label="id"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="username" label="登录名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="login" label="登录次数"></el-table-column>
      <el-table-column prop="reg_time" :formatter="date_fmt" label="注册时间"></el-table-column>
      <el-table-column prop="reg_ip" label="注册IP"></el-table-column>
      <el-table-column prop="last_login_ip" label="最后登录IP"></el-table-column>
      <el-table-column prop="last_login_time" :formatter="date_fmt" label="最后登录时间"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
    </el-table-page>
  </div>
</template>

<script>

import dayjs from 'dayjs';

export default {
  data() {
    this.date_fmt = (row, column, cellValue, index) => {
      return dayjs(cellValue).format('YYYY-MM-DD'); // parse
    };
    return {
      params: {
        name: '123',
        age: 234
      }
    };
  },
  methods: {
    loadList() {
      this.$refs.tablePage.fetch();
    }
  }
};
</script>
