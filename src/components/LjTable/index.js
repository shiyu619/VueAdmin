import Vue from 'vue';
Vue.component('el-table-page', {
  template: `<div>
                <el-table :data='sourceData' :border="border">
                    <slot></slot>
                </el-table>
                <div style="height:12px"></div>
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleIndexChange"
                    :page-size="pageSize"
                    :page-sizes="[10, 20, 50]"
                    :current-page="pageIndex"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="sourceTotal">
                </el-pagination>
               </div>`,
  props: {
    url: String,
    params: Object,
    border: Boolean,
    autoSearch: Boolean
  },
  created: function() {
    this.autoSearch && this.fetch();
  },
  data: function() {
    return {
      sourceData: [],
      sourceTotal: 100,
      pageIndex: 1,
      pageSize: 20
    };
  },
  methods: {
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.pageIndex = 1;
      this.fetch(this.pageIndex, size);
    },
    handleIndexChange: function(index) {
      this.pageIndex = index;
      this.fetch(index, this.pageSize);
    },
    fetch: function(index, size) {
      var send = this.params || {};
      send.pageIndex = index || 1;
      send.pageSize = size || this.pageSize;
      var vm = this;
      fetch(this.url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(send)
        }).then(function(res) { return res.json(); })
        .then(function(res) {
          console.log(res);
          vm.sourceData = res.data.content;
          vm.sourceTotal = res.data.total;
        });
    }
  }
});

