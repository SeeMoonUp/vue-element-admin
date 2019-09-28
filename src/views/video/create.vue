<template>
  <video-detail :is-edit="false" />
</template>

<script>
import VideoDetail from './components/VideoDetail'

export default {
  name: 'CreateForm',
  components: { VideoDetail }
}
</script>

