<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300" label="Title">
        <template slot-scope="{row}">
          <!--<router-link :to="'/example/edit/'+row.id" class="link-type">-->
          <span>{{ row.title }}</span>
          <!--</router-link>-->
        </template>
      </el-table-column>

      <el-table-column align="center" label="qiniuKey">
        <template slot-scope="scope">
          <span>{{ scope.row.qiniuKey }}</span>
        </template>
      </el-table-column>

      <!--<el-table-column width="100px" label="Importance">-->
      <!--<template slot-scope="scope">-->
      <!--<svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />-->
      <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column class-name="status-col" label="Status" width="110">-->
      <!--<template slot-scope="{row}">-->
      <!--<el-tag :type="row.status | statusFilter">-->
      <!--{{ row.status }}-->
      <!--</el-tag>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column align="center" label="Date">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions">
        <template slot-scope="scope">
          <a :href="'http://video.bitxueyuan.com/'+scope.row.qiniuKey" target="_blank">
            <el-button type="primary" size="small" icon="el-icon-view">
              观看
            </el-button>
          </a>
          <!--<router-link :to="'/example/edit/'+scope.row.id">-->
          <!--<el-button type="primary" size="small" icon="el-icon-edit">-->
          <!--编辑-->
          <!--</el-button>-->
          <!--</router-link>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList } from '@/api/video'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ArticleList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
