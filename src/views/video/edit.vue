<template>
  <video-detail :is-edit="true" />
</template>

<script>
import VideoDetail from './components/VideoDetail'

export default {
  name: 'EditForm',
  components: { VideoDetail }
}
</script>

