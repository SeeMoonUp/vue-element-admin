<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          Publish
        </el-button>
        <!--<el-button v-loading="loading" type="warning" @click="draftForm">-->
        <!--Draft-->
        <!--</el-button>-->
      </sticky>

      <div class="createPost-main-container">
        <el-row>

          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                标题
              </MDinput>
            </el-form-item>

            <el-form-item style="margin-bottom: 40px;" label="摘要:">
              <el-input v-model="postForm.desc" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter the content" required />
              <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>

                <el-col :span="10">
                  <el-form-item label-width="120px" label="发布时间:" class="postInfo-container-item">
                    <el-date-picker v-model="displayTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="Select date and time" />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label="浏览数:">
                    <el-input-number v-model="postForm.viewNum" controls-position="right" :min="0" :max="10000" size="small" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="喜欢数:">
                    <el-input-number v-model="postForm.likeNum" controls-position="right" :min="0" :max="10000" size="small" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item label="封面选择:" prop="image_uri" style="margin-bottom: 30px;">
          <Upload ref="upload" v-model="postForm.image" />
        </el-form-item>

        <el-form-item label-width="120px" label="视频库选择:" class="postInfo-container-item">
          <el-select v-model="postForm.videoId" :remote-method="getVideoList" filterable default-first-option remote placeholder="Search Video" required>
            <el-option v-for="(item,index) in videoList" :key="item+index" :label="'['+item.id+']'+item.title" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item prop="content" style="margin-bottom: 30px;">
          <markdown-editor ref="markdownEditor" v-model="postForm.mdContent" height="300px" required />
        </el-form-item>

      </div>
    </el-form>
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import { fetchArticle, save } from '@/api/article'
import { searchUser } from '@/api/remote-search'
import { searchList } from '@/api/video'
import MarkdownEditor from '@/components/MarkdownEditor'
import Upload from '@/components/Upload/UploadImg'

const defaultForm = {
  status: 'draft',
  title: '', // 文章题目
  mdContent: '', // 文章内容
  content: '', // 文章内容
  desc: '', // 文章摘要
  source_uri: '', // 文章外链
  videoImg: '', // 文章图片
  videoId: '', // 视频id
  displayTime: undefined, // 前台展示时间
  id: undefined,
  comment_disabled: false,
  importance: 0,
  likeNum: 0,
  viewNum: 0
}

export default {
  name: 'ArticleDetail',
  components: { MDinput, MarkdownEditor, Sticky, Upload },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      videoList: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {}
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.desc.length
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return (+new Date(this.postForm.displayTime))
      },
      set(val) {
        this.postForm.displayTime = new Date(val)
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchArticle(id).then(response => {
        this.postForm = response.data

        // just for test
        // this.postForm.title += `   Article Id:${this.postForm.id}`
        // this.postForm.desc += `   Article Id:${this.postForm.id}`

        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '编辑精选'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '编辑精选'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      this.postForm.content = this.$refs.markdownEditor.getHtml()
      if (typeof this.$refs.upload.tempUrl !== 'undefined' && this.$refs.upload.tempUrl !== '') {
        this.postForm.videoImg = this.$refs.upload.tempUrl
      }
      if (typeof this.postForm.videoImg === 'undefined' || this.postForm.videoImg === '') {
        this.$message({
          message: '请上传视频封面图片',
          type: 'warning'
        })
        return false
      }
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          save(this.postForm).then(response => {
            console.log(response)
            this.$notify({
              title: '成功',
              message: '发布成功',
              type: 'success',
              duration: 2000
            })
            this.postForm.status = 'published'
          }).catch(err => {
            console.log(err)
          })
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      console.log(JSON.stringify(this.postForm))
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    getRemoteUserList(query) {
      searchUser(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
    },
    getVideoList(query) {
      searchList(query).then(response => {
        if (response.code !== 0) {
          return
        }

        this.videoList = response.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
