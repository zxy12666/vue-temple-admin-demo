<template>
  <div class="list">
    <el-col :span="24" class='actions-top'>
      <!--<el-button type='danger' icon='delete'-->
      <!--:disabled='batch_flag'-->
      <!--@click='onDeleteList(true)'>删除选中-->
      <!--</el-button>-->
      <el-tag
        v-for="tag in tags"
        :key="tag.name"
        :closable="true"
        type=""
        :close-transition="false"
        @close="tagHandleClose(tag)"
      >
        {{tag.name}}
      </el-tag>
      <el-form :inline="true" :model='search_data' class="demo-form-inline">
        <el-form-item>
          <el-input placeholder="项目搜索"
                    v-model='search_data.key'
                    size="mini"
                    clear></el-input>
        </el-form-item>
        <!--<el-form-item>-->
        <!--<el-select v-model="search_data.status" clearable >-->
        <!--<el-option-->
        <!--v-for="item in status_options"-->
        <!--:key="item.value"-->
        <!--:label="item.label"-->
        <!--:value="item.value">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-select v-model="search_data.sortColumn" filterable  size="mini">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item>-->
        <!--<el-button class="add-button" @click="handleDownload" type="primary"  size="mini" icon="el-icon-plus">打印表格</el-button>-->
        <!--</el-form-item>-->
        <el-form-item>
        <el-button style='margin:0 0 20px 20px;' type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">导出表格</el-button>
        </el-form-item>
        <el-form-item>
          <router-link :to="'/train/add'" >
            <el-button style='margin:0 0 20px 20px;' class="add-button"  type="primary"   icon="el-icon-plus">新建培训班</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table border style="width: 100%" align='center'
              :data="article_list"
    >
      <el-table-column
        type="index"
        :index="indexMethod"
        :align="fields.number.style.align"
      >
      </el-table-column>
      <el-table-column
        :prop="fields.className.info.prop"
        :label="fields.className.info.label"
        :align="fields.className.style.align"
        :sortable="fields.className.info.sortable"
      >
      </el-table-column>
      <el-table-column
        :prop="fields.startTime.info.prop"
        :label="fields.startTime.info.label"
        :align="fields.startTime.style.align"
        :sortable="fields.startTime.info.sortable"
      >
      </el-table-column>
      <el-table-column
        :prop="fields.endTime.info.prop"
        :label="fields.endTime.info.label"
        :align="fields.endTime.style.align"
        :sortable="fields.endTime.info.sortable"
      >
      </el-table-column>
      <el-table-column
        :prop="fields.address.info.prop"
        :label="fields.address.info.label"
        :align="fields.address.style.align"
        :sortable="fields.address.info.sortable"
      >
      </el-table-column>
      <el-table-column
        :prop="fields.classTeacher.info.prop"
        :label="fields.classTeacher.info.label"
        :align="fields.classTeacher.style.align"
        :sortable="fields.classTeacher.info.sortable"
      >
      </el-table-column>
      <el-table-column
        :prop="fields.tel.info.prop"
        :label="fields.tel.info.label"
        :align="fields.tel.style.align"
        :sortable="fields.tel.info.sortable"
      >
      </el-table-column>
      <!--&gt;-->
      <!--&lt;!&ndash;:formatter="formatterStatus"&ndash;&gt;-->
      <!--&lt;!&ndash;:formatter="formatterStatus"-->
      <!--:filters="fields.status.filter.list"-->
      <!--:filter-method="filterStatus"-->
      <!--:filter-multiple="fields.status.filter.multiple"&ndash;&gt;-->
      <!--</el-table-column>-->
      <el-table-column label="操作"  align="center" header-align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            plain
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            plain
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24" class='btm-action'>
      <el-pagination
        v-if='paginations.total>0'
        class='pagination'
        :page-sizes="paginations.page_sizes"
        :page-size="paginations.pageSize"
        :layout="paginations.layout"
        :total="paginations.total"
        :current-page='paginations.pageNum'
        @current-change='onChangeCurrentPage'
        @size-change='onChangePageSize'>
      </el-pagination>
    </el-col>
  </div>
</template>

<script>
  import ListJs from './list.js'

  export default ListJs
</script>

