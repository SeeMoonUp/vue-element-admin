<template>
  <div class="upload-container">
    <el-upload
      :data="dataObj"
      class="upload-demo"
      :action="actionPath"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :on-success="uploadSuccess"
      :file-list="fileList"
      list-type="picture"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">上传文件，目前文件大小未做限制</div>
    </el-upload>
  </div>
</template>
<script>
import { getToken } from '@/api/qiniu'
export default {
  name: 'UploadFile',
  data() {
    return {
      actionPath: 'https://upload-z1.qiniup.com',
      dataObj: { token: '', key: '' },
      tempUrl: '',
      success: false,
      fileList: []
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeUpload(file) {
      console.log('上传之前')
      console.log(getToken())
      console.log(getToken().data)

      const isMP4 = file.type === 'video/mp4'
      const isLt2M = file.size / 1024 / 1024 < 500

      if (!isMP4) {
        this.$message.error('上传视频只能是 MP4 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传视频大小不能超过 500MB!')
        return false
      }

      const _self = this
      return new Promise((resolve, reject) => {
        getToken().then(response => {
          console.log(response)
          console.log(response.data)
          const key = response.data.key
          const token = response.data.token
          console.log('key' + key)
          console.log('token' + token)
          _self._data.dataObj.token = token
          _self._data.dataObj.key = key
          resolve(true)
        }).catch(err => {
          console.log(err)
          reject(false)
        })
      })
    },
    uploadSuccess(response, file, fileList) {
      const _self = this
      this.tempUrl = _self._data.dataObj.key
      this.success = true
      console.log(_self)
      this.$message({
        message: '文件上传成功',
        type: 'success'
      })
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>
