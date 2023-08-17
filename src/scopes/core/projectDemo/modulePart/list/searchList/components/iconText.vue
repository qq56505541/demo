<template>
  <span>
    <ta-icon :type="type" style="margin-right: 8px" />
    {{ text }}
  </span>
</template>

<script>
export default {
  name: 'iconText',
  props: {
    type: {
      type: String,
      required: true,
    },
    text: {
      type: [String, Number],
      required: true,
    },
  },
}
</script>
